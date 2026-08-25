const fs = require('node:fs');
const sharp = require('sharp');

const {
  insertReview,
  transitionEntity,
} = require('./db');
const { validateConceptClaims } = require('./claims');
const { jaccardSimilarity, safeJson } = require('./utils');
const { validateVisualBriefs } = require('./visual-audit');

const HIGH_RISK_LANGUAGE = [
  /\bcauses? cancer\b/i,
  /\bcauses? infertility\b/i,
  /\bwill make you\b/i,
  /\btoxic\b/i,
  /\bpoison\b/i,
  /\bguaranteed\b/i,
];

const ACCEPTED_ASSET_RIGHTS = new Set([
  'founder_created',
  'licensed',
  'licensed_stock',
  'cleared',
  'ai_generated',
]);

function needsEvidence(concept, storyboard) {
  if (concept.pillar === 'founder_story') return false;
  const text = `${concept.hook} ${concept.topic} ${storyboard
    .map((slide) => `${slide.headline || ''} ${slide.body || ''}`)
    .join(' ')}`;
  return /\b(study|research|linked|associated|contains|owns|lobby|donat|health|risk|ingredient|percent|million|billion)\b/i.test(
    text
  );
}

async function deterministicReview(db, config, packageId) {
  const contentPackage = db
    .prepare(
      `SELECT p.*, c.title, c.hook, c.topic, c.pillar, c.format,
              c.storyboard_json, c.source_claim_ids_json, c.ai_generated,
              c.promotes_own_business, c.rights_status
       FROM packages p JOIN concepts c ON c.id = p.concept_id
       WHERE p.id = ?`
    )
    .get(packageId);
  if (!contentPackage) throw new Error(`Package not found: ${packageId}`);

  const findings = [];
  const storyboard = safeJson(contentPackage.storyboard_json, []);
  const slides = db
    .prepare('SELECT * FROM slides WHERE package_id = ? ORDER BY slide_number')
    .all(packageId);
  const disclosure = safeJson(contentPackage.disclosure_json, {});

  if (contentPackage.format === 'slideshow') {
    findings.push(...validateVisualBriefs(storyboard, config));
  }

  if (contentPackage.format === 'slideshow') {
    if (slides.length < 3 || slides.length > 7) {
      findings.push({ severity: 'fail', message: 'Slideshows require 3-7 slides.' });
    }
    for (const slide of slides) {
      if (!fs.existsSync(slide.rendered_path)) {
        findings.push({
          severity: 'fail',
          message: `Missing rendered slide ${slide.slide_number}.`,
        });
        continue;
      }
      const metadata = await sharp(slide.rendered_path).metadata();
      if (
        metadata.width !== config.rendering.width ||
        metadata.height !== config.rendering.height
      ) {
        findings.push({
          severity: 'fail',
          message: `Slide ${slide.slide_number} is not 1080x1920.`,
        });
      }
      if (!ACCEPTED_ASSET_RIGHTS.has(slide.asset_rights)) {
        findings.push({
          severity: 'fail',
          message: `Slide ${slide.slide_number} has unresolved asset rights.`,
        });
      }
      if (
        slide.asset_rights === 'licensed_stock' &&
        (!slide.source_asset || !fs.existsSync(slide.source_asset))
      ) {
        findings.push({
          severity: 'fail',
          message: `Slide ${slide.slide_number} has no local licensed-stock source file.`,
        });
      }
      if (!slide.alt_text || slide.alt_text.trim().length < 10) {
        findings.push({
          severity: 'fail',
          message: `Slide ${slide.slide_number} needs useful accessibility text.`,
        });
      }
    }
  } else if (storyboard.length < 3) {
    findings.push({ severity: 'fail', message: 'Video brief has fewer than 3 beats.' });
  }

  const claimCheck = validateConceptClaims(db, contentPackage);
  if (needsEvidence(contentPackage, storyboard) && claimCheck.claims.length === 0) {
    findings.push({
      severity: 'fail',
      message: 'Factual content needs at least one verified evidence record.',
    });
  }
  for (const failure of claimCheck.failures) {
    findings.push({ severity: 'fail', message: failure });
  }

  const allText = [
    contentPackage.caption_tiktok,
    contentPackage.caption_reels,
    contentPackage.caption_shorts,
    ...storyboard.flatMap((slide) => [slide.headline, slide.body]),
  ]
    .filter(Boolean)
    .join(' ');
  for (const expression of HIGH_RISK_LANGUAGE) {
    if (expression.test(allText)) {
      findings.push({
        severity: 'warn',
        message: `Potentially unsafe or overconfident wording: ${expression}`,
      });
    }
  }

  if (contentPackage.ai_generated && !disclosure.ai_generated) {
    findings.push({ severity: 'fail', message: 'AI disclosure is missing.' });
  }
  if (contentPackage.promotes_own_business && !disclosure.commercial_content) {
    findings.push({ severity: 'fail', message: 'Commercial disclosure is missing.' });
  }

  const recent = db
    .prepare(
      `SELECT c.id, c.hook, c.topic, c.format
       FROM concepts c WHERE c.id != ? AND c.created_at >= datetime('now', ?)`
    )
    .all(
      contentPackage.concept_id,
      `-${config.deduplication.recentWindowDays} days`
    );
  const currentText = `${contentPackage.hook} ${contentPackage.topic} ${contentPackage.format}`;
  for (const candidate of recent) {
    const similarity = jaccardSimilarity(
      currentText,
      `${candidate.hook} ${candidate.topic} ${candidate.format}`
    );
    if (similarity > config.deduplication.maxTextSimilarity) {
      findings.push({
        severity: 'fail',
        message: `Too similar to recent concept ${candidate.id} (${similarity.toFixed(2)}).`,
      });
      break;
    }
  }

  const verdict = findings.some((item) => item.severity === 'fail')
    ? 'FAIL'
    : 'PASS';
  return { verdict, findings, checked_at: new Date().toISOString() };
}

async function saveDeterministicReview(db, config, packageId) {
  const result = await deterministicReview(db, config, packageId);
  insertReview(db, {
    package_id: packageId,
    reviewer: 'factory-validator',
    review_type: 'deterministic_qa',
    independent: false,
    verdict: result.verdict,
    findings: result.findings,
  });
  return result;
}

function addIndependentReview(db, packageId, input) {
  if (!input.reviewer || input.reviewer === 'content-factory') {
    throw new Error('Independent review requires a named reviewer other than producer.');
  }
  if (!['PASS', 'FAIL'].includes(input.verdict)) {
    throw new Error('Independent review verdict must be PASS or FAIL.');
  }
  return insertReview(db, {
    package_id: packageId,
    reviewer: input.reviewer,
    review_type: 'independent_content_review',
    independent: true,
    verdict: input.verdict,
    findings: input.findings || [],
  });
}

function packageCanPassQa(db, packageId) {
  const reviews = db
    .prepare('SELECT * FROM reviews WHERE package_id = ? ORDER BY created_at DESC')
    .all(packageId);
  const deterministic = reviews.find(
    (review) => review.review_type === 'deterministic_qa'
  );
  const independent = reviews.find((review) => review.independent === 1);
  return (
    deterministic?.verdict === 'PASS' &&
    independent?.verdict === 'PASS'
  );
}

function markQaPassed(db, packageId, actor = 'content-factory') {
  if (!packageCanPassQa(db, packageId)) {
    throw new Error('Both deterministic QA and independent review must pass.');
  }
  const contentPackage = db
    .prepare('SELECT status FROM packages WHERE id = ?')
    .get(packageId);
  if (contentPackage?.status === 'qa_passed') return;
  transitionEntity(
    db,
    'package',
    packageId,
    'qa_passed',
    actor,
    'Deterministic and independent reviews passed.'
  );
}

function founderDecision(db, packageId, approved, note = '') {
  const contentPackage = db
    .prepare('SELECT status FROM packages WHERE id = ?')
    .get(packageId);
  if (!contentPackage) throw new Error(`Package not found: ${packageId}`);
  if (approved) {
    if (contentPackage.status === 'founder_approved') return;
    if (contentPackage.status !== 'qa_passed') {
      throw new Error('Founder approval is blocked until QA passes.');
    }
    transitionEntity(
      db,
      'package',
      packageId,
      'founder_approved',
      'founder',
      note || 'Founder approved final package.'
    );
  } else {
    transitionEntity(
      db,
      'package',
      packageId,
      'revision_requested',
      'founder',
      note || 'Founder requested revisions.'
    );
  }
}

module.exports = {
  ACCEPTED_ASSET_RIGHTS,
  HIGH_RISK_LANGUAGE,
  addIndependentReview,
  deterministicReview,
  founderDecision,
  markQaPassed,
  needsEvidence,
  packageCanPassQa,
  saveDeterministicReview,
};
