const fs = require('node:fs');
const path = require('node:path');

const { safeJson } = require('./utils');

const REQUIRED_BRIEF_FIELDS = [
  'goal',
  'must_show',
  'must_not_show',
  'text_zone',
  'proof',
  'capture_style',
  'overlay_style',
];

const LABEL_TREATMENTS = new Set([
  'real_photo',
  'locally_composited_complete_label',
  'not_applicable',
]);

function needsLabelTreatment(slide) {
  const text = `${slide.headline || ''} ${slide.body || ''}`;
  return /\b(label|serving|ingredient|sugar|carb|disclosure|bioengineered)\b/i.test(
    text
  );
}

function isUsefulString(value) {
  return typeof value === 'string' && value.trim().length >= 12;
}

function validateVisualBriefs(storyboard, config) {
  const findings = [];
  const sourceUse = new Map();
  const expectedTextZone = config.visualReview.primaryTextZone;

  for (const [index, slide] of storyboard.entries()) {
    const slideNumber = index + 1;
    const brief = slide.visual_brief;

    if (!brief || typeof brief !== 'object' || Array.isArray(brief)) {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} needs a visual_brief that states what the image must prove.`,
      });
      continue;
    }

    for (const field of REQUIRED_BRIEF_FIELDS) {
      if (!brief[field]) {
        findings.push({
          severity: 'fail',
          slide: slideNumber,
          message: `Slide ${slideNumber} visual_brief is missing ${field}.`,
        });
      }
    }
    if (!isUsefulString(brief.goal)) {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} needs a concrete visual goal.`,
      });
    }
    if (!Array.isArray(brief.must_show) || brief.must_show.length === 0) {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} must name the visual evidence it needs to show.`,
      });
    }
    if (!Array.isArray(brief.must_not_show) || brief.must_not_show.length === 0) {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} must name what would make the visual misleading or generic.`,
      });
    }
    if (brief.text_zone !== expectedTextZone) {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} text_zone must be ${expectedTextZone}.`,
      });
    }
    if (brief.capture_style !== config.visualReview.requiredCaptureStyle) {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} capture_style must be ${config.visualReview.requiredCaptureStyle}.`,
      });
    }
    if (!isUsefulString(brief.proof)) {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} needs a plain-language explanation of why its visual supports the copy.`,
      });
    }
    if (brief.overlay_style !== 'single_integrated_overlay') {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} must use one integrated text treatment, not detached cards or badges.`,
      });
    }
    if (!LABEL_TREATMENTS.has(brief.label_treatment)) {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} needs a valid label_treatment declaration.`,
      });
    }
    if (needsLabelTreatment(slide) && brief.label_treatment === 'not_applicable') {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} discusses label information and must show a complete, readable label treatment.`,
      });
    }
    if (/\b(blank|placeholder|empty)\b/i.test((brief.must_show || []).join(' '))) {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} cannot use a blank or placeholder product panel as evidence.`,
      });
    }

    if (slide.source_asset) {
      const uses = sourceUse.get(slide.source_asset) || [];
      uses.push({ slideNumber, rationale: slide.asset_reuse_rationale });
      sourceUse.set(slide.source_asset, uses);
    }
    if (
      !config.visualReview.allowedSlideshowAssetRights.includes(
        slide.asset_rights
      )
    ) {
      findings.push({
        severity: 'fail',
        slide: slideNumber,
        message: `Slide ${slideNumber} must use founder-created or disclosed AI imagery, not licensed stock.`,
      });
    }
  }

  for (const [asset, uses] of sourceUse.entries()) {
    if (uses.length < 2) continue;
    if (uses.length > config.visualReview.maxSourceAssetUses) {
      findings.push({
        severity: 'fail',
        message: `${path.basename(asset)} is used ${uses.length} times; the maximum is ${config.visualReview.maxSourceAssetUses}.`,
      });
    }
    for (const use of uses) {
      if (!isUsefulString(use.rationale)) {
        findings.push({
          severity: 'fail',
          slide: use.slideNumber,
          message: `Slide ${use.slideNumber} repeats ${path.basename(asset)} without an asset_reuse_rationale.`,
        });
      }
    }
  }

  return findings;
}

function createVisualAuditReport(contentPackage, storyboard, config) {
  const findings = validateVisualBriefs(storyboard, config);
  const slides = storyboard.map((slide, index) => ({
    slide: index + 1,
    headline: slide.headline || '',
    visual_goal: slide.visual_brief?.goal || null,
    must_show: slide.visual_brief?.must_show || [],
    must_not_show: slide.visual_brief?.must_not_show || [],
    text_zone: slide.visual_brief?.text_zone || null,
    capture_style: slide.visual_brief?.capture_style || null,
    proof: slide.visual_brief?.proof || null,
    asset: slide.source_asset || null,
  }));
  return {
    package_id: contentPackage.id,
    title: contentPackage.title,
    goal_achieved: findings.length === 0,
    findings,
    slides,
    checked_at: new Date().toISOString(),
  };
}

function visualAuditMarkdown(report) {
  const result = [
    `# Visual Audit: ${report.title}`,
    '',
    `Package: ${report.package_id}`,
    `Checked: ${report.checked_at}`,
    '',
    `## Goal achieved? ${report.goal_achieved ? 'YES' : 'NO'}`,
    '',
  ];
  if (report.findings.length) {
    result.push('## Blocking findings', '');
    for (const finding of report.findings) {
      result.push(`- Slide ${finding.slide || 'package'}: ${finding.message}`);
    }
    result.push('');
  }
  result.push('## Slide-by-slide visual brief', '');
  for (const slide of report.slides) {
    result.push(`### ${slide.slide}. ${slide.headline}`, '');
    result.push(`- Goal: ${slide.visual_goal || 'Missing'}`);
    result.push(`- Must show: ${slide.must_show.join('; ') || 'Missing'}`);
    result.push(`- Must not show: ${slide.must_not_show.join('; ') || 'Missing'}`);
    result.push(`- Text zone: ${slide.text_zone || 'Missing'}`);
    result.push(`- Capture style: ${slide.capture_style || 'Missing'}`);
    result.push(`- Why this proves the point: ${slide.proof || 'Missing'}`);
    result.push(`- Asset: ${slide.asset || 'Generated visual / missing'}`, '');
  }
  return `${result.join('\n')}\n`;
}

function auditPackageVisuals(db, config, packageId, writeReport = true) {
  const contentPackage = db
    .prepare(
      `SELECT p.id, p.package_dir, c.title, c.storyboard_json
       FROM packages p JOIN concepts c ON c.id = p.concept_id
       WHERE p.id = ?`
    )
    .get(packageId);
  if (!contentPackage) throw new Error(`Package not found: ${packageId}`);
  const storyboard = safeJson(contentPackage.storyboard_json, []);
  const report = createVisualAuditReport(contentPackage, storyboard, config);
  if (writeReport) {
    fs.writeFileSync(
      path.join(contentPackage.package_dir, 'visual-audit.md'),
      visualAuditMarkdown(report),
      'utf8'
    );
  }
  return report;
}

module.exports = {
  REQUIRED_BRIEF_FIELDS,
  LABEL_TREATMENTS,
  auditPackageVisuals,
  createVisualAuditReport,
  validateVisualBriefs,
  visualAuditMarkdown,
};
