// Node acceptance tests are intentionally kept outside Jest discovery.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const assert = require('node:assert/strict');
const { buildBufferDraftInput, createBufferDraft } = require('../buffer');
const { loadConfig } = require('../config');
const {
  insertClaim,
  insertConcept,
  insertCommunityTask,
  openFactoryDb,
  transitionEntity,
} = require('../db');
const { importMetrics } = require('../metrics');
const { approveConcept, produceConcept } = require('../producer');
const {
  ensureInventoryFallback,
  importFindings,
  snapshotInventory,
} = require('../research');
const {
  addIndependentReview,
  founderDecision,
  markQaPassed,
  saveDeterministicReview,
} = require('../review');
const { evaluateFinding } = require('../scoring');
const { createReviewServer } = require('../server');
const { assertTransition } = require('../state');
const { writeJson } = require('../utils');
const sharp = require('sharp');

function testContext() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'food-expose-test-'));
  const config = loadConfig({
    workspaceRoot: process.cwd(),
    factoryRoot: root,
  });
  const db = openFactoryDb(config.paths.database);
  return {
    root,
    config,
    db,
    close() {
      db.close();
      fs.rmSync(root, { recursive: true, force: true });
    },
  };
}

function verifiedClaim(db, suffix = 'one') {
  return insertClaim(db, {
    claim_text: `Verified fixture claim ${suffix}.`,
    claim_type: 'ingredient',
    source_url: `https://example.com/source/${suffix}`,
    source_title: 'Fixture source',
    publisher: 'Fixture publisher',
    evidence_excerpt: 'This fixture excerpt directly supports the fixture claim.',
    verification_status: 'verified',
    reviewer: 'evidence-reviewer',
    reviewed_at: new Date().toISOString(),
  });
}

function storyboard() {
  return [
    {
      headline: 'The label detail most shoppers miss',
      body: 'A practical and non-alarmist opening.',
      theme: 'green',
      asset_rights: 'ai_generated',
    },
    {
      headline: 'Read the entire context',
      body: 'Check serving size, ingredients, and purpose together.',
      theme: 'evidence',
      asset_rights: 'ai_generated',
    },
    {
      headline: 'Choose what fits your family',
      body: 'Use the information without fear or fake certainty.',
      theme: 'warning',
      asset_rights: 'ai_generated',
    },
  ];
}

async function generatedPackage(context, suffix = 'one') {
  const claim = verifiedClaim(context.db, suffix);
  const concept = insertConcept(context.db, {
    title: `Ingredient context ${suffix}`,
    hook: `The label context shoppers miss ${suffix}`,
    topic: `label-context-${suffix}`,
    pillar: 'label_literacy',
    format: 'slideshow',
    test_variable: 'hook',
    test_variant: suffix,
    storyboard: storyboard(),
    caption_tiktok: 'Read the whole label before deciding.',
    caption_reels: 'A practical grocery-label reminder.',
    caption_shorts: 'Read the whole label.',
    source_claim_ids: [claim.id],
    ai_generated: true,
    promotes_own_business: true,
    rights_status: 'ai_generated',
    status: 'sourced',
    score: 85,
  });
  approveConcept(context.db, concept.id);
  const contentPackage = await produceConcept(
    context.db,
    context.config,
    concept.id,
    { slug: `fixture-${suffix}` }
  );
  return { claim, concept, contentPackage };
}

test('state machine blocks unsafe skips', () => {
  assert.doesNotThrow(() => assertTransition('generated', 'qa_passed'));
  assert.throws(
    () => assertTransition('generated', 'founder_approved'),
    /Invalid content state transition/
  );
  assert.throws(
    () => assertTransition('qa_passed', 'buffer_draft'),
    /Invalid content state transition/
  );
});

test('research rejects stale and duplicate findings and preserves fallback inventory', () => {
  const context = testContext();
  try {
    const finding = {
      source_url: 'https://www.tiktok.com/@example/video/1',
      observed_at: new Date().toISOString(),
      hook: 'The ingredient label detail most shoppers miss',
      topic: 'ingredient labels',
      format: 'slideshow',
      brand_relevance: 5,
      evidence_strength: 5,
      audience_usefulness: 5,
      emotional_strength: 4,
      visual_feasibility: 5,
      production_cost: 1,
    };
    const accepted = evaluateFinding(finding, context.config, []);
    assert.equal(accepted.accepted, true);
    const duplicate = evaluateFinding(finding, context.config, [
      {
        hook: finding.hook,
        topic: finding.topic,
        format: finding.format,
      },
    ]);
    assert.equal(duplicate.accepted, false);
    assert.match(duplicate.reasons.join(' '), /too similar/);

    const input = path.join(context.root, 'findings.json');
    writeJson(input, [finding]);
    importFindings(context.db, context.config, input);
    assert.equal(snapshotInventory(context.db, context.config).length, 1);
    context.db.prepare(`UPDATE findings SET status = 'rejected'`).run();
    assert.equal(ensureInventoryFallback(context.db, context.config).length, 1);
  } finally {
    context.close();
  }
});

test('renderer creates 1080x1920 slides inside a complete package', async () => {
  const context = testContext();
  try {
    const { contentPackage } = await generatedPackage(context, 'render');
    const slides = context.db
      .prepare('SELECT * FROM slides WHERE package_id = ? ORDER BY slide_number')
      .all(contentPackage.id);
    assert.equal(slides.length, 3);
    for (const slide of slides) {
      const metadata = await sharp(slide.rendered_path).metadata();
      assert.equal(metadata.width, 1080);
      assert.equal(metadata.height, 1920);
    }
  } finally {
    context.close();
  }
});

test('founder and Buffer gates require both reviews and final approval', async () => {
  const context = testContext();
  try {
    context.config.publishing.publicAssetBaseUrl = 'https://cdn.example.com/content';
    context.config.publishing.bufferChannelId = 'channel_fixture';
    const { contentPackage } = await generatedPackage(context, 'gates');
    const qa = await saveDeterministicReview(
      context.db,
      context.config,
      contentPackage.id
    );
    assert.equal(qa.verdict, 'PASS');
    assert.throws(
      () => markQaPassed(context.db, contentPackage.id),
      /independent review/
    );
    assert.throws(
      () => founderDecision(context.db, contentPackage.id, true),
      /blocked until QA/
    );

    addIndependentReview(context.db, contentPackage.id, {
      reviewer: 'independent-reviewer',
      verdict: 'PASS',
      findings: [],
    });
    markQaPassed(context.db, contentPackage.id);
    founderDecision(context.db, contentPackage.id, true);

    const approved = context.db
      .prepare('SELECT * FROM packages WHERE id = ?')
      .get(contentPackage.id);
    const input = buildBufferDraftInput(context.config, approved);
    assert.equal(input.saveToDraft, true);
    assert.equal(input.schedulingType, 'notification');
    assert.equal(input.assets.length, 3);

    const result = await createBufferDraft(
      context.db,
      context.config,
      contentPackage.id,
      { dryRun: true }
    );
    assert.equal(result.dryRun, true);
    assert.equal(
      context.db.prepare('SELECT status FROM packages WHERE id = ?').get(
        contentPackage.id
      ).status,
      'founder_approved'
    );
  } finally {
    context.close();
  }
});

test('seven-day metrics transition a posted package to measured', async () => {
  const context = testContext();
  try {
    const { contentPackage } = await generatedPackage(context, 'metrics');
    context.db
      .prepare(`UPDATE packages SET status = 'posted' WHERE id = ?`)
      .run(contentPackage.id);
    const input = path.join(context.root, 'metrics.json');
    writeJson(input, [
      {
        package_id: contentPackage.id,
        bucket: '7d',
        views: 1000,
        likes: 80,
        comments: 10,
        shares: 20,
        saves: 25,
      },
    ]);
    assert.equal(importMetrics(context.db, input), 1);
    assert.equal(
      context.db.prepare('SELECT status FROM packages WHERE id = ?').get(
        contentPackage.id
      ).status,
      'measured'
    );
  } finally {
    context.close();
  }
});

test('local review board exposes packages without publishing actions', async () => {
  const context = testContext();
  let server;
  try {
    await generatedPackage(context, 'board');
    insertCommunityTask(context.db, {
      platform: 'tiktok',
      post_url: 'https://www.tiktok.com/@foodexpose/video/1',
      comment_excerpt: 'What should I check first?',
      response_draft: 'Start with serving size and the first three ingredients.',
    });
    server = createReviewServer(context.db, context.config);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/dashboard`);
    const dashboard = await response.json();
    assert.equal(response.status, 200);
    assert.equal(dashboard.packages.length, 1);
    assert.equal(dashboard.packages[0].status, 'generated');
    assert.equal(dashboard.packages[0].buffer_post_id, null);
    assert.equal(dashboard.community.length, 1);
    assert.equal(dashboard.summary.community_waiting, 1);
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    context.close();
  }
});

test('production resumes without duplicate packages or slides', async () => {
  const context = testContext();
  try {
    const { concept } = await generatedPackage(context, 'resume');
    await produceConcept(context.db, context.config, concept.id, {
      slug: 'fixture-resume',
    });
    assert.equal(
      context.db.prepare('SELECT COUNT(*) AS count FROM packages').get().count,
      1
    );
    assert.equal(
      context.db.prepare('SELECT COUNT(*) AS count FROM slides').get().count,
      3
    );
    context.config.costControls.maxSlideshowUsd = 1;
    await assert.rejects(
      produceConcept(context.db, context.config, concept.id, {
        slug: 'cost-limit-fixture',
        generationCost: 2,
      }),
      /exceeds the configured/
    );
  } finally {
    context.close();
  }
});

test('research dry run validates input without writing findings', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'food-expose-dry-run-'));
  try {
    const input = path.join(root, 'findings.json');
    writeJson(input, [
      {
        source_url: 'https://www.tiktok.com/@example/video/dry-run',
        observed_at: new Date().toISOString(),
        hook: 'A dry-run label hook',
        topic: 'label literacy',
        format: 'slideshow',
        brand_relevance: 5,
        evidence_strength: 5,
        audience_usefulness: 5,
        emotional_strength: 4,
        visual_feasibility: 5,
        production_cost: 1,
      },
    ]);
    const result = execFileSync(
      process.execPath,
      [
        path.join(process.cwd(), 'scripts', 'content-factory', 'cli.js'),
        'research',
        '--factory-root',
        root,
        '--input',
        input,
        '--dry-run',
      ],
      { cwd: process.cwd(), encoding: 'utf8' }
    );
    assert.match(result, /"dry_run": true/);
    const config = loadConfig({ workspaceRoot: process.cwd(), factoryRoot: root });
    const db = openFactoryDb(config.paths.database);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM findings').get().count, 0);
    db.close();
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
