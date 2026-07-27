#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const {
  buildBufferDraftInput,
  createBufferDraft,
  exportBufferFallback,
} = require('./buffer');
const { importClaims } = require('./claims');
const { importCommunityTasks, readCommunityTasks } = require('./community');
const { loadConfig, writeDefaultConfig } = require('./config');
const { openFactoryDb, recordFailure } = require('./db');
const { generatePerformanceReport, importMetrics } = require('./metrics');
const { backupLedger, healthReport } = require('./maintenance');
const { runPilot } = require('./pilot');
const {
  approveConcept,
  importConcepts,
  produceConcept,
} = require('./producer');
const {
  previewFindings,
  researchBrief,
  importFindings,
  ensureInventoryFallback,
  snapshotInventory,
  writeResearchBrief,
} = require('./research');
const {
  addIndependentReview,
  deterministicReview,
  founderDecision,
  markQaPassed,
  saveDeterministicReview,
} = require('./review');
const { startReviewBoard } = require('./server');
const { parseArgs, readJson, toBoolean, writeJson } = require('./utils');

function output(value) {
  console.log(
    typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  );
}

function requireArg(args, key) {
  if (!args[key]) throw new Error(`--${key} is required.`);
  return args[key];
}

function initialize(config, db) {
  const briefPath = writeResearchBrief(config);
  const examplesPath = path.join(config.paths.exports, 'input-examples.json');
  writeJson(examplesPath, {
    finding: {
        source_url: 'https://www.tiktok.com/@creator/video/123',
        source_account: '@creator',
        observed_at: new Date().toISOString(),
        hook: 'The label detail most shoppers miss',
        topic: 'ingredient labels',
        format: 'slideshow',
        visual_structure: 'hook, evidence, practical action',
        public_signals: { likes: 0, comments: 0, shares: 0 },
        comment_insights: [],
        engagement_reason: 'Useful curiosity gap',
        product_angle: 'generic grocery label',
        brand_relevance: 5,
        evidence_strength: 4,
        audience_usefulness: 5,
        emotional_strength: 3,
        visual_feasibility: 5,
        production_cost: 2,
    },
    claim: {
        claim_text: 'A precise, reviewable claim.',
        claim_type: 'ingredient',
        source_url: 'https://example.org/primary-source',
        evidence_excerpt: 'Short supporting excerpt.',
        verification_status: 'verified',
        reviewer: 'evidence-checker',
        reviewed_at: new Date().toISOString(),
    },
    concept: {
      finding_id: 'finding_ID_FROM_RESEARCH',
      title: 'The label detail most shoppers miss',
      hook: 'The front of the box leaves this out',
      topic: 'ingredient label context',
      pillar: 'label_literacy',
      format: 'slideshow',
      test_variable: 'hook',
      test_variant: 'curiosity-question',
      source_claim_ids: ['claim_ID_FROM_EVIDENCE'],
      ai_generated: true,
      promotes_own_business: true,
      rights_status: 'ai_generated',
      storyboard: [
        {
          headline: 'The front label is the sales pitch',
          body: 'Turn the package around before deciding.',
          theme: 'green',
          asset_rights: 'ai_generated',
          alt_text: 'A generic grocery package shown from the front.',
          image_prompt: 'Generic package, no logos, bright grocery setting.',
        },
        {
          headline: 'Check the full context',
          body: 'Read serving size and ingredients together.',
          theme: 'evidence',
          asset_rights: 'ai_generated',
          alt_text: 'A generic ingredient panel and serving-size panel.',
        },
        {
          headline: 'Choose what fits your family',
          body: 'Information first, then your priorities.',
          theme: 'warning',
          asset_rights: 'ai_generated',
          alt_text: 'A family comparing two generic grocery items.',
        },
      ],
      caption_tiktok: 'A practical label check for your next grocery trip.',
      caption_reels: 'Turn the package around before deciding.',
      caption_shorts: 'The full label tells the story.',
    },
    independent_review: {
      package_id: 'package_ID',
      reviewer: 'independent-reviewer-name',
      verdict: 'PASS',
      findings: [],
    },
    metric: {
      package_id: 'package_ID',
      bucket: '24h',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      profile_visits: 0,
      link_clicks: 0,
      app_downloads: 0,
    },
    community_task: {
      platform: 'tiktok',
      post_url: 'https://www.tiktok.com/@foodexpose/video/123',
      comment_excerpt: 'What should I look at first?',
      response_draft:
        'Start with serving size and the first three ingredients, then compare similar products.',
      priority: 'normal',
    },
  });
  output({
    database: config.paths.database,
    config: config.paths.config,
    research_brief: briefPath,
    examples: examplesPath,
    status: 'ready',
  });
}

async function commandResearch(db, config, args) {
  if (args.input) {
    if (toBoolean(args.dryRun)) {
      output({ dry_run: true, results: previewFindings(db, config, args.input) });
      return;
    }
    const result = importFindings(db, config, args.input);
    const inventory = snapshotInventory(db, config);
    output({ ...result, usable_inventory: inventory.length });
    return;
  }
  if (toBoolean(args.dryRun)) {
    output({
      dry_run: true,
      brief: researchBrief(config),
      usable_inventory: ensureInventoryFallback(db, config).length,
    });
    return;
  }
  const briefPath = writeResearchBrief(config);
  const inventory = ensureInventoryFallback(db, config);
  output({
    brief: briefPath,
    usable_inventory: inventory.length,
    fallback_active:
      inventory.length > 0 &&
      db.prepare(
        `SELECT COUNT(*) AS count FROM findings
         WHERE total_score >= ? AND status IN ('researched','sourced')`
      ).get(config.research.minimumScore).count === 0,
  });
}

async function commandProduce(db, config, args) {
  if (toBoolean(args.dryRun)) {
    const imported = args.input
      ? (() => {
          const payload = readJson(args.input);
          const concepts = Array.isArray(payload) ? payload : payload.concepts;
          if (!Array.isArray(concepts)) {
            throw new Error('Concept input must include concepts[].');
          }
          const { validateConceptInput } = require('./producer');
          concepts.forEach(validateConceptInput);
          return concepts.length;
        })()
      : 0;
    const approved = db
      .prepare(
        `SELECT id, title, format FROM concepts
         WHERE status = 'concept_approved' ORDER BY score DESC, created_at ASC`
      )
      .all();
    output({
      dry_run: true,
      concepts_validated_for_import: imported,
      would_approve: args.approve || null,
      would_produce: args.id
        ? approved.filter((item) => item.id === args.id)
        : approved,
    });
    return;
  }
  if (args.input) importConcepts(db, args.input);
  if (args.approve) {
    output(approveConcept(db, args.approve, 'founder-cli'));
    return;
  }
  const rows = args.id
    ? [db.prepare('SELECT * FROM concepts WHERE id = ?').get(args.id)]
    : db
        .prepare(
          `SELECT * FROM concepts WHERE status = 'concept_approved'
           ORDER BY score DESC, created_at ASC`
        )
        .all();
  if (args.generationCost && !args.id) {
    throw new Error('--generation-cost requires --id so cost is not duplicated.');
  }
  const limits = {
    slideshow: config.weeklyTargets.slideshows,
    video: config.weeklyTargets.videos,
  };
  const counts = { slideshow: 0, video: 0 };
  const produced = [];
  for (const row of rows.filter(Boolean)) {
    if (!toBoolean(args.all) && counts[row.format] >= limits[row.format]) continue;
    produced.push(
      await produceConcept(db, config, row.id, {
        generationCost: args.generationCost || 0,
      })
    );
    counts[row.format] += 1;
  }
  output({ produced: produced.map((item) => item.id), counts });
}

async function commandReview(db, config, args) {
  if (toBoolean(args.dryRun)) {
    const rows = args.id
      ? [db.prepare('SELECT * FROM packages WHERE id = ?').get(args.id)]
      : db.prepare(`SELECT * FROM packages WHERE status = 'generated'`).all();
    const results = [];
    for (const row of rows.filter(Boolean)) {
      results.push({
        package_id: row.id,
        ...(await deterministicReview(db, config, row.id)),
      });
    }
    output({ dry_run: true, results });
    return;
  }
  if (args.independent) {
    const payload = readJson(args.independent);
    const entries = Array.isArray(payload) ? payload : payload.reviews;
    if (!Array.isArray(entries)) throw new Error('Review file needs reviews[].');
    for (const review of entries) {
      addIndependentReview(db, review.package_id, review);
    }
  }
  const rows = args.id
    ? [db.prepare('SELECT * FROM packages WHERE id = ?').get(args.id)]
    : db
        .prepare(`SELECT * FROM packages WHERE status = 'generated'`)
        .all();
  const results = [];
  for (const row of rows.filter(Boolean)) {
    const result = await saveDeterministicReview(db, config, row.id);
    try {
      markQaPassed(db, row.id);
    } catch {
      // Independent review is intentionally a separate gate.
    }
    results.push({ package_id: row.id, ...result });
  }
  output(results);
}

async function commandBuffer(db, config, args) {
  const rows = args.id
    ? [db.prepare('SELECT * FROM packages WHERE id = ?').get(args.id)]
    : db
        .prepare(`SELECT * FROM packages WHERE status = 'founder_approved'`)
        .all();
  const packages = rows.filter(Boolean);
  if (toBoolean(args.dryRun)) {
    output({
      dry_run: true,
      drafts: packages.map((item) => ({
        package_id: item.id,
        input: buildBufferDraftInput(config, item),
      })),
    });
    return;
  }
  const fallback = exportBufferFallback(config, packages);
  const results = [];
  for (const item of packages) {
    results.push(
      await createBufferDraft(db, config, item.id)
    );
  }
  output({ fallback, results });
}

async function main() {
  const [command = 'help', ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  const workspaceRoot = process.cwd();
  const config =
    command === 'init'
      ? writeDefaultConfig({ workspaceRoot, factoryRoot: args.factoryRoot })
      : loadConfig({ workspaceRoot, factoryRoot: args.factoryRoot });
  const db = openFactoryDb(config.paths.database);
  let keepDbOpen = false;

  try {
    switch (command) {
      case 'init':
        initialize(config, db);
        break;
      case 'research':
        await commandResearch(db, config, args);
        break;
      case 'claims':
        output({ imported: importClaims(db, requireArg(args, 'input')).length });
        break;
      case 'produce':
        await commandProduce(db, config, args);
        break;
      case 'review':
        await commandReview(db, config, args);
        break;
      case 'founder-decision':
        founderDecision(
          db,
          requireArg(args, 'id'),
          toBoolean(args.approved),
          args.note || ''
        );
        output({ ok: true });
        break;
      case 'buffer-drafts':
        await commandBuffer(db, config, args);
        break;
      case 'metrics':
        if (toBoolean(args.dryRun)) {
          const { readMetricsInput } = require('./metrics');
          const metrics = args.input ? readMetricsInput(args.input) : [];
          output({ dry_run: true, snapshots_validated: metrics.length });
          break;
        }
        if (args.input) importMetrics(db, args.input);
        output(generatePerformanceReport(db, config));
        break;
      case 'backup':
        output(backupLedger(db, config));
        break;
      case 'health':
        output(healthReport(db, config));
        break;
      case 'community':
        if (toBoolean(args.dryRun)) {
          output({
            dry_run: true,
            tasks_validated: readCommunityTasks(requireArg(args, 'input')).length,
          });
        } else if (args.input) {
          output({ imported: importCommunityTasks(db, args.input).length });
        } else {
          output(
            db
              .prepare(
                `SELECT * FROM community_tasks
                 WHERE status = 'pending_review' ORDER BY created_at ASC`
              )
              .all()
          );
        }
        break;
      case 'mark-status': {
        if (!['scheduled', 'posted'].includes(args.to)) {
          throw new Error('--to must be scheduled or posted.');
        }
        const { transitionEntity } = require('./db');
        transitionEntity(
          db,
          'package',
          requireArg(args, 'id'),
          args.to,
          'founder-cli',
          args.note || `Manually marked ${args.to}.`
        );
        output({ ok: true, status: args.to });
        break;
      }
      case 'board':
        keepDbOpen = true;
        startReviewBoard(db, config);
        return;
      case 'pilot': {
        const result = await runPilot(workspaceRoot);
        output({
          report: result.reportPath,
          packages: result.packages.length,
        });
        return;
      }
      default:
        output({
          commands: [
            'init',
            'research [--input findings.json]',
            'claims --input claims.json',
            'produce [--input concepts.json] [--approve ID] [--id ID]',
            'review [--id ID] [--independent reviews.json]',
            'founder-decision --id ID --approved true|false',
            'buffer-drafts [--id ID] [--dry-run]',
            'metrics [--input metrics.csv]',
            'backup',
            'health',
            'community [--input tasks.json] [--dry-run]',
            'mark-status --id ID --to scheduled|posted',
            'board',
            'pilot',
          ],
        });
    }
  } catch (error) {
    recordFailure(db, {
      command,
      error_message: error.stack || error.message,
      retryable: /network|timeout|429|503/i.test(error.message),
    });
    throw error;
  } finally {
    if (!keepDbOpen) db.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
