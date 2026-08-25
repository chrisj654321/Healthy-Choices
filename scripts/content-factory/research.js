const fs = require('node:fs');
const path = require('node:path');

const { evaluateFinding } = require('./scoring');
const { getRecentConcepts, insertFinding } = require('./db');
const { daysBetween, readJson, writeJson } = require('./utils');

function validateFinding(finding, index) {
  const required = ['source_url', 'observed_at', 'hook', 'topic'];
  const missing = required.filter((field) => !finding[field]);
  if (missing.length) {
    throw new Error(`Finding ${index + 1} is missing: ${missing.join(', ')}`);
  }
  try {
    const url = new URL(finding.source_url);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch {
    throw new Error(`Finding ${index + 1} has an invalid source URL.`);
  }
}

function researchBrief(config) {
  return {
    generated_at: new Date().toISOString(),
    target_findings: config.research.targetFindings,
    stale_after_days: config.research.staleAfterDays,
    themes: config.research.themes,
    required_fields: [
      'source_url',
      'source_account',
      'observed_at',
      'hook',
      'topic',
      'format',
      'visual_structure',
      'public_signals',
      'comment_insights',
      'engagement_reason',
      'product_angle',
      'brand_relevance (0-5)',
      'evidence_strength (0-5)',
      'audience_usefulness (0-5)',
      'emotional_strength (0-5)',
      'visual_feasibility (0-5)',
      'production_cost (0-5)',
    ],
    rules: [
      'Use public posts only and retain the exact source URL.',
      'Record observable signals; do not claim private analytics.',
      'Summarize the format without copying wording or visuals closely.',
      'Reject stale, unrelated, unsourceable, or rights-unclear ideas.',
      'Do not automate likes, follows, comments, or account actions.',
    ],
  };
}

function writeResearchBrief(config) {
  const filePath = path.join(config.paths.exports, 'research-brief.json');
  writeJson(filePath, researchBrief(config));
  return filePath;
}

function importFindings(db, config, inputPath, now = new Date()) {
  const payload = readJson(inputPath);
  const findings = Array.isArray(payload) ? payload : payload.findings;
  if (!Array.isArray(findings)) {
    throw new Error('Research input must be an array or an object with findings[].');
  }

  const since = new Date(
    now.getTime() - config.deduplication.recentWindowDays * 86_400_000
  ).toISOString();
  const recentConcepts = getRecentConcepts(db, since);
  const results = findings.map((finding, index) => {
    validateFinding(finding, index);
    const evaluation = evaluateFinding(finding, config, recentConcepts, now);
    const stored = insertFinding(db, {
      ...finding,
      scores: evaluation.values,
      total_score: evaluation.score,
      status: 'researched',
      rejection_reasons: evaluation.reasons,
    });
    return {
      id: stored.id,
      accepted: evaluation.accepted,
      score: evaluation.score,
      reasons: evaluation.reasons,
    };
  });

  const reportPath = path.join(config.paths.exports, 'latest-research-report.json');
  writeJson(reportPath, {
    imported_at: now.toISOString(),
    source_file: path.resolve(inputPath),
    accepted: results.filter((item) => item.accepted).length,
    rejected: results.filter((item) => !item.accepted).length,
    results,
  });
  return { results, reportPath };
}

function previewFindings(db, config, inputPath, now = new Date()) {
  const payload = readJson(inputPath);
  const findings = Array.isArray(payload) ? payload : payload.findings;
  if (!Array.isArray(findings)) {
    throw new Error('Research input must be an array or an object with findings[].');
  }
  const since = new Date(
    now.getTime() - config.deduplication.recentWindowDays * 86_400_000
  ).toISOString();
  const recentConcepts = getRecentConcepts(db, since);
  return findings.map((finding, index) => {
    validateFinding(finding, index);
    return {
      source_url: finding.source_url,
      ...evaluateFinding(finding, config, recentConcepts, now),
    };
  });
}

function getUsableInventory(db, config, now = new Date()) {
  const rows = db
    .prepare(
      `SELECT * FROM findings
       WHERE total_score >= ? AND status IN ('researched', 'sourced')
       ORDER BY total_score DESC, captured_at DESC`
    )
    .all(config.research.minimumScore);

  return rows.filter(
    (row) => daysBetween(row.observed_at, now) <= config.research.staleAfterDays
  );
}

function ensureInventoryFallback(db, config) {
  const inventory = getUsableInventory(db, config);
  if (inventory.length) return inventory;
  const reportPath = path.join(config.paths.exports, 'last-valid-inventory.json');
  if (!fs.existsSync(reportPath)) return [];
  const saved = readJson(reportPath);
  return Array.isArray(saved.findings) ? saved.findings : [];
}

function snapshotInventory(db, config) {
  const findings = getUsableInventory(db, config);
  if (findings.length) {
    writeJson(path.join(config.paths.exports, 'last-valid-inventory.json'), {
      saved_at: new Date().toISOString(),
      findings,
    });
  }
  return findings;
}

module.exports = {
  ensureInventoryFallback,
  getUsableInventory,
  importFindings,
  previewFindings,
  researchBrief,
  snapshotInventory,
  validateFinding,
  writeResearchBrief,
};
