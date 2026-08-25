const fs = require('node:fs');
const path = require('node:path');

const {
  insertConcept,
  insertPackage,
  insertSlide,
  transitionEntity,
} = require('./db');
const { renderStoryboard } = require('./renderer');
const {
  contentFingerprint,
  readJson,
  safeJson,
  slugify,
  writeJson,
} = require('./utils');

const TEST_VARIABLES = new Set([
  'hook',
  'slide_structure',
  'subject',
  'cta',
  'visual_treatment',
  'product_payoff',
]);

function validateConceptInput(concept, index = 0) {
  const required = ['title', 'hook', 'topic', 'pillar', 'format', 'test_variable'];
  const missing = required.filter((field) => !concept[field]);
  if (missing.length) {
    throw new Error(`Concept ${index + 1} is missing: ${missing.join(', ')}`);
  }
  if (!['slideshow', 'video'].includes(concept.format)) {
    throw new Error(`Concept ${index + 1} format must be slideshow or video.`);
  }
  if (!TEST_VARIABLES.has(concept.test_variable)) {
    throw new Error(`Concept ${index + 1} has an unsupported test variable.`);
  }
  if (!Array.isArray(concept.storyboard) || concept.storyboard.length < 3) {
    throw new Error(`Concept ${index + 1} needs at least three storyboard beats.`);
  }
  if (concept.format === 'slideshow' && concept.storyboard.length > 7) {
    throw new Error(`Concept ${index + 1} has more than seven slides.`);
  }
}

function importConcepts(db, inputPath) {
  const payload = readJson(inputPath);
  const concepts = Array.isArray(payload) ? payload : payload.concepts;
  if (!Array.isArray(concepts)) {
    throw new Error('Concept input must be an array or an object with concepts[].');
  }
  return concepts.map((concept, index) => {
    validateConceptInput(concept, index);
    const stored = insertConcept(db, concept);
    if (concept.finding_id) {
      const finding = db
        .prepare('SELECT status FROM findings WHERE id = ?')
        .get(concept.finding_id);
      if (finding?.status === 'researched') {
        transitionEntity(
          db,
          'finding',
          concept.finding_id,
          'sourced',
          'content-factory',
          `Concept created: ${stored.id}`
        );
      }
    }
    return stored;
  });
}

function approveConcept(db, conceptId, actor = 'founder') {
  const concept = db.prepare('SELECT * FROM concepts WHERE id = ?').get(conceptId);
  if (!concept) throw new Error(`Concept not found: ${conceptId}`);
  if (concept.status === 'concept_approved') return concept;
  transitionEntity(
    db,
    'concept',
    conceptId,
    'concept_approved',
    actor,
    'Founder approved concept for production.'
  );
  return db.prepare('SELECT * FROM concepts WHERE id = ?').get(conceptId);
}

function buildDisclosures(concept, config) {
  return {
    ai_generated:
      Boolean(concept.ai_generated) && config.publishing.requireAiDisclosure,
    commercial_content:
      Boolean(concept.promotes_own_business) &&
      config.publishing.requireCommercialDisclosure,
    caption_note: [
      concept.ai_generated ? 'AI-generated visuals.' : null,
      concept.promotes_own_business ? 'Food Expos\u00e9 is my app.' : null,
    ]
      .filter(Boolean)
      .join(' '),
    native_tiktok_ai_toggle:
      concept.ai_generated && concept.format === 'video',
    native_tiktok_commercial_toggle: Boolean(concept.promotes_own_business),
  };
}

function appendDisclosure(caption, disclosure) {
  const base = String(caption || '').trim();
  if (!disclosure.caption_note) return base;
  return `${base}\n\n${disclosure.caption_note}`.trim();
}

async function produceConcept(db, config, conceptId, options = {}) {
  const concept = db.prepare('SELECT * FROM concepts WHERE id = ?').get(conceptId);
  if (!concept) throw new Error(`Concept not found: ${conceptId}`);
  if (!['concept_approved', 'generated'].includes(concept.status)) {
    throw new Error('A concept must be founder-approved before production.');
  }

  const storyboard = safeJson(concept.storyboard_json, []);
  const slug = options.slug || slugify(`${concept.title}-${concept.id.slice(-8)}`);
  const generationCost = Number(options.generationCost || 0);
  const maximumCost =
    concept.format === 'video'
      ? config.costControls.maxVideoUsd
      : config.costControls.maxSlideshowUsd;
  if (generationCost > maximumCost) {
    throw new Error(
      `${concept.format} cost $${generationCost.toFixed(
        2
      )} exceeds the configured $${maximumCost.toFixed(2)} limit.`
    );
  }
  const existingPackage = db
    .prepare('SELECT id FROM packages WHERE slug = ?')
    .get(slug);
  if (!existingPackage) {
    const weeklySpend = Number(
      db
        .prepare(
          `SELECT COALESCE(SUM(generation_cost), 0) AS total
           FROM packages WHERE created_at >= datetime('now', '-7 days')`
        )
        .get().total
    );
    if (weeklySpend + generationCost > config.costControls.weeklyBudgetUsd) {
      throw new Error(
        `Weekly generation budget would exceed $${config.costControls.weeklyBudgetUsd.toFixed(
          2
        )}.`
      );
    }
  }
  const packageDirectory = path.join(config.paths.packages, slug);
  fs.mkdirSync(packageDirectory, { recursive: true });
  const disclosure = buildDisclosures(concept, config);

  const contentPackage = insertPackage(db, {
    concept_id: concept.id,
    slug,
    package_type: concept.format,
    package_dir: packageDirectory,
    caption_tiktok: appendDisclosure(concept.caption_tiktok, disclosure),
    caption_reels: appendDisclosure(concept.caption_reels, disclosure),
    caption_shorts: appendDisclosure(concept.caption_shorts, disclosure),
    disclosure,
    generation_cost: generationCost,
    status: 'generated',
  });

  const manifest = [];
  if (concept.format === 'slideshow') {
    const assets = await renderStoryboard(storyboard, packageDirectory, config);
    for (let index = 0; index < assets.length; index += 1) {
      const slide = storyboard[index];
      const asset = assets[index];
      insertSlide(db, {
        package_id: contentPackage.id,
        slide_number: index + 1,
        headline: slide.headline,
        body: slide.body,
        alt_text:
          slide.alt_text ||
          `${slide.headline}${slide.body ? `. ${slide.body}` : ''}`,
        image_prompt: slide.image_prompt,
        source_asset: slide.source_asset,
        rendered_path: asset.path,
        asset_rights: slide.asset_rights || concept.rights_status,
        width: asset.width,
        height: asset.height,
        content_hash: asset.hash,
      });
      manifest.push({
        type: 'image',
        path: asset.path,
        width: asset.width,
        height: asset.height,
        hash: asset.hash,
      });
    }
  } else {
    const briefPath = path.join(packageDirectory, 'video-brief.json');
    writeJson(briefPath, {
      concept_id: concept.id,
      title: concept.title,
      hook: concept.hook,
      storyboard,
      generation_rules: {
        engine: 'higgsfield-generate',
        prompt_approval_required: true,
        character_reference_required: storyboard.some((beat) => beat.has_people),
        text_added_locally: true,
      },
    });
    manifest.push({
      type: 'video_brief',
      path: briefPath,
      hash: contentFingerprint(JSON.stringify(storyboard)),
    });
  }

  const manifestPath = path.join(packageDirectory, 'manifest.json');
  writeJson(manifestPath, {
    package_id: contentPackage.id,
    concept_id: concept.id,
    slug,
    format: concept.format,
    captions: {
      tiktok: appendDisclosure(concept.caption_tiktok, disclosure),
      reels: appendDisclosure(concept.caption_reels, disclosure),
      shorts: appendDisclosure(concept.caption_shorts, disclosure),
    },
    disclosure,
    claims: safeJson(concept.source_claim_ids_json, []),
    assets: manifest,
  });

  db.prepare(
    `UPDATE packages
     SET asset_manifest_json = ?, updated_at = ?
     WHERE id = ?`
  ).run(JSON.stringify(manifest), new Date().toISOString(), contentPackage.id);

  if (concept.status === 'concept_approved') {
    transitionEntity(
      db,
      'concept',
      concept.id,
      'generated',
      'content-factory',
      `Generated package ${contentPackage.id}`
    );
  }
  if (contentPackage.status === 'revision_requested') {
    transitionEntity(
      db,
      'package',
      contentPackage.id,
      'generated',
      'content-factory',
      'Regenerated requested revision in the existing package.'
    );
  }
  return db.prepare('SELECT * FROM packages WHERE id = ?').get(contentPackage.id);
}

module.exports = {
  TEST_VARIABLES,
  appendDisclosure,
  approveConcept,
  buildDisclosures,
  importConcepts,
  produceConcept,
  validateConceptInput,
};
