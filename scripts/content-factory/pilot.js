const path = require('node:path');

const { loadConfig, writeDefaultConfig } = require('./config');
const { insertClaim, insertConcept, openFactoryDb } = require('./db');
const { approveConcept, produceConcept } = require('./producer');
const {
  addIndependentReview,
  markQaPassed,
  saveDeterministicReview,
} = require('./review');
const { writeJson } = require('./utils');

const PILOT_TOPICS = [
  ['ingredient-list-order', 'Why the first ingredient matters', 'ingredient_translation'],
  ['serving-size-math', 'The serving-size trick shoppers miss', 'label_literacy'],
  ['parent-company-map', 'Three brands, one parent company', 'company_transparency'],
  ['added-sugar-names', 'Added sugar can wear many names', 'ingredient_translation'],
  ['front-label-halo', 'The front label is marketing, not evidence', 'marketing_literacy'],
  ['dye-labels', 'Why food-dye names look confusing', 'ingredient_translation'],
  ['protein-claim', 'Check what follows the protein claim', 'label_literacy'],
  ['organic-context', 'What organic does and does not tell you', 'label_literacy'],
  ['preservative-purpose', 'Why companies add preservatives', 'ingredient_translation'],
  ['grocery-swap', 'A better swap starts with the full label', 'family_shopping'],
  ['ownership-video', 'Who owns the brand in your cart?', 'company_transparency'],
  ['ingredient-video', 'Translate one ingredient in 20 seconds', 'ingredient_translation'],
  ['family-video', 'The 12-second parent label check', 'family_shopping'],
  ['founder-video', 'Why I started scanning every label', 'founder_story'],
];

function pilotStoryboard(topic, format) {
  const slides = [
    {
      headline: topic,
      body: 'A clear curiosity-led hook without fear or medical certainty.',
      theme: 'green',
      asset_rights: 'ai_generated',
      image_prompt: 'Generic grocery setting with no visible brand logos.',
      has_people: format === 'video',
    },
    {
      headline: 'Check the full context',
      body: 'Read the ingredient list, serving size, and product purpose together.',
      theme: 'evidence',
      asset_rights: 'ai_generated',
      image_prompt: 'Close-up of generic packaging with an unreadable label area.',
      has_people: false,
    },
    {
      headline: 'Make the choice that fits your family',
      body: 'Use the evidence, then decide based on your own priorities.',
      theme: 'warning',
      asset_rights: 'ai_generated',
      image_prompt: 'Warm family grocery scene with generic food packaging.',
      has_people: format === 'video',
    },
  ];
  return format === 'video'
    ? slides.map((slide, index) => ({ ...slide, duration_seconds: index === 0 ? 3 : 5 }))
    : slides;
}

async function runPilot(workspaceRoot) {
  const pilotRoot = path.join(
    workspaceRoot,
    'marketing',
    'factory',
    `pilot-fixture-${new Date().toISOString().replace(/[:.]/g, '-')}`
  );
  const config = writeDefaultConfig({ workspaceRoot, factoryRoot: pilotRoot });
  const db = openFactoryDb(config.paths.database);
  const packages = [];

  for (let index = 0; index < PILOT_TOPICS.length; index += 1) {
    const [slug, hook, pillar] = PILOT_TOPICS[index];
    const format = index < 10 ? 'slideshow' : 'video';
    const claim = insertClaim(db, {
      claim_text: `${hook} is a consumer label-literacy topic used in this fixture.`,
      claim_type: 'ingredient',
      source_url: `https://example.com/evidence/${slug}`,
      source_title: 'Synthetic pilot evidence',
      publisher: 'Fixture only',
      evidence_excerpt: 'Synthetic evidence record for workflow validation only.',
      verification_status: 'verified',
      reviewer: 'pilot-evidence-reviewer',
      reviewed_at: new Date().toISOString(),
      rights_status: 'not_applicable',
    });
    const concept = insertConcept(db, {
      title: hook,
      hook,
      topic: slug,
      pillar,
      format,
      test_variable: index % 2 === 0 ? 'hook' : 'visual_treatment',
      test_variant: `pilot-${index + 1}`,
      storyboard: pilotStoryboard(hook, format),
      caption_tiktok: `${hook}. Save this for your next grocery trip.`,
      caption_reels: `${hook}. A practical label check for your next trip.`,
      caption_shorts: `${hook}.`,
      source_claim_ids: [claim.id],
      ai_generated: true,
      promotes_own_business: true,
      rights_status: 'ai_generated',
      status: 'sourced',
      score: 80,
    });
    approveConcept(db, concept.id, 'pilot-founder-fixture');
    const contentPackage = await produceConcept(db, config, concept.id, {
      slug: `pilot-${String(index + 1).padStart(2, '0')}-${slug}`,
      generationCost: 0,
    });
    await saveDeterministicReview(db, config, contentPackage.id);
    addIndependentReview(db, contentPackage.id, {
      reviewer: 'pilot-independent-reviewer',
      verdict: 'PASS',
      findings: ['Synthetic pilot package only; no external publishing authorized.'],
    });
    markQaPassed(db, contentPackage.id, 'pilot-orchestrator');
    packages.push({ id: contentPackage.id, slug: contentPackage.slug, format });
  }

  const reportPath = path.join(config.paths.exports, 'pilot-report.json');
  writeJson(reportPath, {
    generated_at: new Date().toISOString(),
    fixture_only: true,
    public_posting_authorized: false,
    slideshows: packages.filter((item) => item.format === 'slideshow').length,
    videos: packages.filter((item) => item.format === 'video').length,
    status: 'qa_passed_waiting_for_founder',
    packages,
  });
  db.close();
  return { reportPath, packages, config };
}

module.exports = { PILOT_TOPICS, pilotStoryboard, runPilot };
