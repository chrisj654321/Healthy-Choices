const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const { loadConfig } = require('./config');
const { renderStoryboard } = require('./renderer');
const { createVisualAuditReport, visualAuditMarkdown } = require('./visual-audit');
const { insertClaim, insertSlide, nowIso, openFactoryDb } = require('./db');

const workspaceRoot = path.resolve(__dirname, '..', '..');
const config = loadConfig({ workspaceRoot });
const assetDirectory = path.join(
  workspaceRoot,
  'marketing',
  'factory',
  'assets',
  'label-check-v2'
);
const packageDirectory = path.join(
  workspaceRoot,
  'marketing',
  'factory',
  'packages',
  'the-20-second-label-check-v2'
);

function asset(name) {
  return path.join(assetDirectory, name);
}

const sourceAssets = {
  hook: asset('slide-01-grocery-label-source.png'),
  servings: asset('slide-02-servings-source.png'),
  ingredients: asset('slide-03-ingredients-source.png'),
  sugar: asset('slide-04-sugar-source.png'),
  protein: asset('top-sirloin-4oz-source.png'),
  disclosure: asset('slide-06-disclosure-source.png'),
  choice: asset('slide-07-family-source.png'),
};

for (const [name, sourceAsset] of Object.entries(sourceAssets)) {
  if (!fs.existsSync(sourceAsset)) {
    throw new Error(`Missing ${name} source asset: ${sourceAsset}`);
  }
}

function brief(goal, mustShow, mustNotShow, proof) {
  return {
    goal,
    must_show: mustShow,
    must_not_show: mustNotShow,
    text_zone: 'center-safe-panel',
    capture_style: 'casual_iphone_photo',
    proof,
  };
}

const storyboard = [
  {
    headline: 'The 20-second label check',
    body: 'Five fast checks before it lands in your cart.',
    theme: 'green',
    visual_badge: ['TURN THE BOX AROUND', 'Start with the back label'],
    visual_badge_style: 'success',
    source_asset: sourceAssets.hook,
    asset_rights: 'ai_generated',
    visual_brief: brief(
      'Open with a real shopper examining the back of a package instead of another generic food photo.',
      ['shopper', 'generic package back', 'blank label panel'],
      ['front-of-box marketing claim', 'unrelated grocery cart', 'fabricated package wording'],
      'The back of the package makes the promised label check immediately concrete.'
    ),
  },
  {
    headline: '1. Count the servings',
    body: 'One bottle can hold 5 servings. Multiply before judging calories.',
    theme: 'warning',
    visual_badge: ['EXAMPLE LABEL', 'Servings per container: 5'],
    visual_badge_style: 'warning',
    source_asset: sourceAssets.servings,
    asset_rights: 'ai_generated',
    visual_brief: brief(
      'Make multi-serving packaging feel practical with a parent holding a bottle beside a lunchbox.',
      ['generic bottle', 'blank label area', 'normal kitchen context'],
      ['claimed product facts', 'tiny unreadable text', 'styled studio scene'],
      'The bottle plus the plainly labeled example shows why servings per container matter.'
    ),
  },
  {
    headline: '2. Read first AND last',
    body: 'First is what it has most of. Last is what may be easy to miss.',
    theme: 'evidence',
    visual_badge: ['INGREDIENT LIST', 'Read first to last'],
    visual_badge_style: 'neutral',
    source_asset: sourceAssets.ingredients,
    asset_rights: 'ai_generated',
    visual_brief: brief(
      'Show two hands tracing the beginning and end of a package ingredient panel.',
      ['generic ingredient-panel area', 'finger at top', 'finger at bottom'],
      ['made-up ingredient list', 'unrelated meal photo', 'claim that every last ingredient is harmful'],
      'Hands marking both ends of the panel visually reinforce the first-to-last reading habit.'
    ),
  },
  {
    headline: '3. Check added sugar',
    body: 'Check added sugar, carbs, and fiber together. The front is not the full story.',
    theme: 'warning',
    visual_badge: ['EXAMPLE CHECK', 'Added sugar: 19g'],
    visual_badge_style: 'warning',
    source_asset: sourceAssets.sugar,
    asset_rights: 'ai_generated',
    visual_brief: brief(
      'Connect a packaged snack with a normal kitchen sugar jar without turning the slide into a fear image.',
      ['generic snack wrapper', 'ordinary sugar jar', 'home kitchen'],
      ['pink stock backdrop', 'sugar-cube pile', 'claim that sugar is forbidden'],
      'The everyday snack and pantry sugar context explains why the nutrition line is worth checking.'
    ),
  },
  {
    headline: '4. Protein vs. calories',
    body: 'Our ideal: 1g protein per 10 calories. 4 oz top sirloin: 212 cal + 34g protein = 6.2:1.',
    theme: 'green',
    visual_badge: ['USDA EXAMPLE', 'Top sirloin, cooked, broiled'],
    visual_badge_style: 'success',
    source_asset: sourceAssets.protein,
    asset_rights: 'ai_generated',
    visual_brief: brief(
      'Use a realistically sized four-ounce cooked top sirloin as a source-backed protein example.',
      ['small steak serving', 'home dinner plate', 'vegetables'],
      ['oversized restaurant steak', 'fake product nutrition facts', 'weight-loss guarantee'],
      'The meal is an actual USDA-derived example, while the on-slide text distinguishes the rule from the example.'
    ),
  },
  {
    headline: '5. Check the disclosure',
    body: 'Avoid bioengineered ingredients or cultivated meat? Read the package and product details.',
    theme: 'evidence',
    visual_badge: ['EXAMPLE DISCLOSURE', 'CONTAINS BIOENGINEERED FOOD INGREDIENTS'],
    visual_badge_style: 'neutral',
    source_asset: sourceAssets.disclosure,
    asset_rights: 'ai_generated',
    visual_brief: brief(
      'Show a generic unbranded package with a blank area where a locally rendered example disclosure is placed.',
      ['generic food package', 'blank disclosure space', 'real grocery context'],
      ['fake real brand', 'counterfeit certification seal', 'universal health claim'],
      'The local example disclosure makes the shopper preference actionable without pretending it belongs to a real product.'
    ),
  },
  {
    headline: 'Own the choice',
    body: 'It\'s your body. Own it. If you regret it, choose differently next time.',
    theme: 'green',
    visual_badge: ['FOOD EXPOSÉ', 'Small checks. Better choices.'],
    visual_badge_style: 'success',
    source_asset: sourceAssets.choice,
    asset_rights: 'ai_generated',
    visual_brief: brief(
      'End with a warm, believable shared family meal instead of a warning image.',
      ['happy family', 'shared dinner', 'lived-in home'],
      ['worried people', 'grocery cart', 'another nutrition label'],
      'A normal family dinner makes the ending about agency and repeatable choices, not fear.'
    ),
  },
];

async function renderContactSheet(assets) {
  const thumbnailWidth = 270;
  const thumbnailHeight = 480;
  const columns = 4;
  const rows = Math.ceil(assets.length / columns);
  const items = await Promise.all(
    assets.map((item, index) =>
      sharp(item.path)
        .resize(thumbnailWidth, thumbnailHeight, { fit: 'cover' })
        .jpeg({ quality: 84 })
        .toBuffer()
        .then((input) => ({
          input,
          left: (index % columns) * thumbnailWidth,
          top: Math.floor(index / columns) * thumbnailHeight,
        }))
    )
  );
  await sharp({
    create: {
      width: columns * thumbnailWidth,
      height: rows * thumbnailHeight,
      channels: 3,
      background: '#EFF6F2',
    },
  })
    .composite(items)
    .jpeg({ quality: 88 })
    .toFile(path.join(packageDirectory, 'contact-sheet.jpg'));
}

async function main() {
  fs.mkdirSync(packageDirectory, { recursive: true });
  const assets = await renderStoryboard(storyboard, packageDirectory, config);
  await renderContactSheet(assets);

  const contentPackage = {
    id: 'package_label_check_v2',
    title: 'The 20-Second Label Check',
  };
  const audit = createVisualAuditReport(contentPackage, storyboard, config);
  fs.writeFileSync(
    path.join(packageDirectory, 'visual-audit.md'),
    visualAuditMarkdown(audit),
    'utf8'
  );

  const manifest = {
    package_id: contentPackage.id,
    slug: 'the-20-second-label-check-v2',
    format: 'slideshow',
    captions: {
      tiktok:
        'My 20-second label check: count servings, read the first and last ingredients, check added sugar and carbs, compare protein to calories, then look for the bioengineered disclosure if that matters to you. Save this for your next grocery trip.\n\nThe 1:10 protein-to-calorie ratio is Food Exposé\'s general comparison rule, not medical advice or a personal nutrition prescription.\n\nFood Exposé is my app.',
      reels:
        'A crowded label gets easier when you check the same five things every time.\n\nFood Exposé is my app.',
      shorts: 'Try this 20-second label check.\n\nFood Exposé is my app.',
    },
    disclosure: {
      ai_generated: true,
      commercial_content: true,
      caption_note: 'Food Exposé is my app.',
      native_tiktok_ai_toggle: true,
      native_tiktok_commercial_toggle: true,
    },
    sources: [
      {
        slide: 5,
        title: 'USDA FoodData Central, cooked broiled top sirloin',
        url: 'https://fdc.nal.usda.gov/',
        note: 'FDC 168635: 188 calories and 30.3g protein per 100g; 4 oz cooked is approximately 212 calories and 34g protein.',
      },
    ],
    assets,
    audit_passed: audit.goal_achieved,
  };
  fs.writeFileSync(
    path.join(packageDirectory, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );

  // Replace the draft package in the local review board. This deliberately
  // leaves it generated: founder approval is still required before Buffer sees it.
  const db = openFactoryDb(config.paths.database);
  const concept = db
    .prepare('SELECT * FROM concepts WHERE title = ? ORDER BY updated_at DESC LIMIT 1')
    .get(contentPackage.title);
  if (concept) {
    const proteinClaim = insertClaim(db, {
      claim_text:
        'USDA FoodData Central entry 168635 reports 188 calories and 30.3g protein per 100g for cooked, broiled choice top sirloin with visible fat trimmed.',
      claim_type: 'nutrition',
      source_url: 'https://fdc.nal.usda.gov/',
      source_title: 'FoodData Central',
      publisher: 'USDA Agricultural Research Service',
      evidence_excerpt:
        'Four ounces cooked is approximately 113g, or 212 calories and 34g protein.',
      verification_status: 'verified',
      rights_status: 'not_applicable',
      reviewer: 'content-factory',
      reviewed_at: nowIso(),
    });
    const claimIds = Array.from(
      new Set([...JSON.parse(concept.source_claim_ids_json || '[]'), proteinClaim.id])
    );
    db.prepare(
      `UPDATE concepts
       SET storyboard_json = ?, source_claim_ids_json = ?, ai_generated = 1,
           rights_status = 'ai_generated', updated_at = ?
       WHERE id = ?`
    ).run(JSON.stringify(storyboard), JSON.stringify(claimIds), nowIso(), concept.id);

    const existingPackage = db
      .prepare('SELECT * FROM packages WHERE concept_id = ? ORDER BY updated_at DESC LIMIT 1')
      .get(concept.id);
    if (existingPackage) {
      db.prepare('DELETE FROM slides WHERE package_id = ?').run(existingPackage.id);
      db.prepare(
        `UPDATE packages
         SET package_dir = ?, caption_tiktok = ?, caption_reels = ?, caption_shorts = ?,
             disclosure_json = ?, asset_manifest_json = ?, status = 'generated', updated_at = ?
         WHERE id = ?`
      ).run(
        packageDirectory,
        manifest.captions.tiktok,
        manifest.captions.reels,
        manifest.captions.shorts,
        JSON.stringify(manifest.disclosure),
        JSON.stringify(assets),
        nowIso(),
        existingPackage.id
      );
      for (let index = 0; index < assets.length; index += 1) {
        const slide = storyboard[index];
        const rendered = assets[index];
        insertSlide(db, {
          package_id: existingPackage.id,
          slide_number: index + 1,
          headline: slide.headline,
          body: slide.body,
          alt_text: `${slide.headline}. ${slide.body}`,
          image_prompt: slide.visual_brief.goal,
          source_asset: slide.source_asset,
          rendered_path: rendered.path,
          asset_rights: slide.asset_rights,
          width: rendered.width,
          height: rendered.height,
          content_hash: rendered.hash,
        });
      }
    }
  }
  db.close();

  console.log(JSON.stringify({ packageDirectory, auditPassed: audit.goal_achieved }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
