#!/usr/bin/env node
/**
 * Healthy Choices — Product Ingestion Script
 *
 * Pulls branded food products from OpenFoodFacts and USDA FoodData Central,
 * normalizes them into the Healthy Choices product shape, flags concerning
 * ingredients (seed oils, ultra-processed additives, artificial dyes, HFCS,
 * synthetic preservatives), and scores functional benefits (adaptogens,
 * fermented foods, grass-fed, regenerative, organic).
 *
 * Output:  src/data/products_generated.json   (merged, deduped by barcode)
 * Log:     scripts/ingestion_log.txt          (append-only)
 * State:   scripts/.ingestion_state.json      (page cursors per source)
 *
 * Usage:
 *   node scripts/ingest-products.js --batch=25
 *   node scripts/ingest-products.js --batch=10 --source=openfoodfacts
 *   node scripts/ingest-products.js --batch=10 --source=usda
 *
 * Env:
 *   USDA_API_KEY — optional. Falls back to "DEMO_KEY" (rate-limited).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

// ─── Paths ─────────────────────────────────────────────────────────────────
const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'products_generated.json');
const LOG_FILE = path.join(SCRIPT_DIR, 'ingestion_log.txt');
const STATE_FILE = path.join(SCRIPT_DIR, '.ingestion_state.json');

// ─── Config ────────────────────────────────────────────────────────────────
const args = parseArgs(process.argv.slice(2));
const BATCH_SIZE = Math.max(1, parseInt(args.batch || args['batch-size'] || args.batchSize || '25', 10));
const SOURCE = String(args.source || 'both').toLowerCase();
const USDA_API_KEY = process.env.USDA_API_KEY || 'ceYGtJpUYpZjZpezqnVqaeiyix1ZgeRrFsPOw6b4';

// NOTE: When running via Cowork scheduled tasks, api.nal.usda.gov must be added to the
// egress allowlist in Settings → Capabilities. Without it, USDA calls will fail with
// EAI_AGAIN / ECONNREFUSED. OpenFoodFacts (world.openfoodfacts.org) may also rate-limit
// anonymous bot requests with HTTP 503; register an OFF account for higher limits.
const SEARCH_QUERY = args.query || args.q || null;

// ─── Detection lists ───────────────────────────────────────────────────────
const SEED_OILS = [
  'canola oil', 'soybean oil', 'sunflower oil', 'safflower oil',
  'corn oil', 'cottonseed oil', 'grapeseed oil', 'rice bran oil',
  'rapeseed oil', 'vegetable oil',
];

const ARTIFICIAL_DYES = [
  'red 40', 'red #40', 'fd&c red 40', 'allura red',
  'yellow 5', 'yellow #5', 'fd&c yellow 5', 'tartrazine',
  'yellow 6', 'yellow #6', 'sunset yellow',
  'blue 1', 'blue #1', 'brilliant blue',
  'blue 2', 'blue #2', 'indigo carmine',
  'green 3', 'fast green',
  'red 3', 'erythrosine',
  'caramel color iv', 'caramel color iii',
];

const SYNTHETIC_PRESERVATIVES = [
  'bha', 'butylated hydroxyanisole',
  'bht', 'butylated hydroxytoluene',
  'tbhq', 'tertiary butylhydroquinone',
  'sodium benzoate', 'potassium benzoate',
  'sodium nitrite', 'sodium nitrate',
  'potassium sorbate', 'sodium sorbate',
  'propyl gallate', 'edta', 'calcium disodium edta',
  'sulfites', 'sulfur dioxide',
  'propylparaben', 'methylparaben',
];

const ULTRA_PROCESSED_ADDITIVES = [
  'maltodextrin', 'modified corn starch', 'modified food starch',
  'monosodium glutamate', 'msg', 'autolyzed yeast',
  'hydrolyzed', 'soy protein isolate', 'whey protein isolate',
  // All generic "flavoring" terms — opaque additive blend, same concern as natural/artificial flavors
  'natural flavors', 'natural flavor', 'artificial flavors', 'artificial flavor',
  'flavoring', 'natural flavoring', 'artificial flavoring',
  'mono and diglycerides', 'monoglycerides', 'diglycerides',
  'carrageenan', 'xanthan gum', 'guar gum', 'cellulose gum',
  'polysorbate 80', 'polysorbate 60',
  'corn syrup solids', 'dextrose',
  'enriched flour', 'bleached flour',
  'soy lecithin',
  // Plain starch used as a processed filler/thickener
  'corn starch',
];

const HFCS_TERMS = [
  'high fructose corn syrup', 'high-fructose corn syrup',
  'hfcs', 'fructose syrup', 'glucose-fructose syrup',
];

// ─── Functional benefits ───────────────────────────────────────────────────
const ADAPTOGENS = [
  'ashwagandha', 'rhodiola', 'reishi', "lion's mane", 'lions mane',
  'cordyceps', 'chaga', 'maca', 'holy basil', 'tulsi', 'eleuthero',
  'schisandra', 'astragalus', 'ginseng', 'turkey tail',
];

const FERMENTED_FOODS = [
  'kefir', 'kombucha', 'sauerkraut', 'kimchi', 'miso', 'tempeh',
  'live cultures', 'live and active cultures', 'cultured',
  'probiotics', 'lactobacillus', 'bifidobacterium',
  'natto', 'gochujang',
];

const GRASS_FED_TERMS = [
  'grass-fed', 'grass fed', '100% grass-fed', 'pasture-raised',
  'pasture raised', 'grassfed',
];

const REGENERATIVE_TERMS = [
  'regenerative', 'regeneratively', 'rofa certified', 'rofa-certified',
  'regenerative organic',
];

const ORGANIC_TERMS = [
  'organic', 'usda organic', 'certified organic', 'eu organic',
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = {};
  for (const a of argv) {
    if (!a.startsWith('--')) continue;
    const [k, v] = a.slice(2).split('=');
    out[k] = v ?? 'true';
  }
  return out;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function logLine(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try {
    ensureDir(LOG_FILE);
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch (e) {
    console.error('Failed to write log:', e.message);
  }
}

function readJsonOrDefault(file, dflt) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return dflt;
  }
}

function writeJson(file, data) {
  ensureDir(file);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function fetchJson(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'HealthyChoices/1.0 (christianjames128@gmail.com)',
          Accept: 'application/json',
          ...(opts.headers || {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 400) {
            return reject(
              new Error(`HTTP ${res.statusCode} for ${url}: ${data.slice(0, 200)}`)
            );
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Bad JSON from ${url}: ${e.message}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(45000, () => {
      req.destroy(new Error('Request timeout after 45s'));
    });
  });
}

function tokenize(ingredientsText) {
  return String(ingredientsText || '')
    .toLowerCase()
    // ① Convert parentheses to commas FIRST so sub-ingredient lists
    //   ("CHEDDAR CHEESE (MILK, CULTURES, SALT)") split into siblings
    //   rather than collapsing into one junk token.
    .replace(/[()]/g, ',')
    // ② Strip "CONTAINS (LESS THAN) X% (OR LESS) OF:" legal disclaimers
    //   — these precede ingredient lists and aren't ingredients themselves.
    .replace(/contains\s+(?:less\s+than\s+)?[\d.]+\s*%\s*(?:or\s+less\s+)?(?:of\s+)?:?\s*/gi, '')
    // ③ Strip section-header labels of the form "WORD(S): " with no digits
    //   e.g. "CRUST:", "TOPPINGS:", "BARBECUE SAUCE:", "YEAST TOPPINGS:"
    //   The [a-z ] character class intentionally excludes digits so that
    //   "CONTAINS LESS THAN 2% OF:" is not accidentally consumed here.
    .replace(/\b[a-z][a-z ]{1,40}:\s*/g, '')
    .split(/[,;]/)
    .map((s) => s.trim().replace(/[\[\]\.]/g, '').trim())
    .filter((s) => s.length > 1 && s.length < 80);
}

// ─── Flagging logic ────────────────────────────────────────────────────────
function flagIngredients(ingredientsArray) {
  const text = (ingredientsArray || []).join(' | ').toLowerCase();
  const flags = {
    seedOils: [],
    ultraProcessedAdditives: [],
    artificialDyes: [],
    highFructoseCornSyrup: false,
    syntheticPreservatives: [],
  };
  for (const s of SEED_OILS) if (text.includes(s)) flags.seedOils.push(s);
  for (const a of ULTRA_PROCESSED_ADDITIVES) if (text.includes(a)) flags.ultraProcessedAdditives.push(a);
  for (const d of ARTIFICIAL_DYES) if (text.includes(d)) flags.artificialDyes.push(d);
  if (HFCS_TERMS.some((t) => text.includes(t))) flags.highFructoseCornSyrup = true;
  for (const p of SYNTHETIC_PRESERVATIVES) if (text.includes(p)) flags.syntheticPreservatives.push(p);

  flags.seedOils = [...new Set(flags.seedOils)];
  flags.ultraProcessedAdditives = [...new Set(flags.ultraProcessedAdditives)];
  flags.artificialDyes = [...new Set(flags.artificialDyes)];
  flags.syntheticPreservatives = [...new Set(flags.syntheticPreservatives)];

  flags.totalConcerns =
    flags.seedOils.length +
    flags.ultraProcessedAdditives.length +
    flags.artificialDyes.length +
    (flags.highFructoseCornSyrup ? 1 : 0) +
    flags.syntheticPreservatives.length;

  return flags;
}

function scoreFunctionalBenefits(ingredientsArray, name, labels) {
  const text = [(ingredientsArray || []).join(' | '), name || '', labels || '']
    .join(' | ')
    .toLowerCase();

  const benefits = {
    adaptogens: ADAPTOGENS.filter((a) => text.includes(a)),
    fermented: FERMENTED_FOODS.filter((f) => {
      // Use word-boundary check to avoid substring false positives (e.g. "annatto" matching "natto")
      const re = new RegExp(`(?<![a-z])${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z])`);
      return re.test(text);
    }),
    grassFed: GRASS_FED_TERMS.some((t) => text.includes(t)),
    regenerative: REGENERATIVE_TERMS.some((t) => text.includes(t)),
    organic: ORGANIC_TERMS.some((t) => text.includes(t)),
  };

  benefits.score =
    benefits.adaptogens.length * 2 +
    benefits.fermented.length * 1 +
    (benefits.grassFed ? 2 : 0) +
    (benefits.regenerative ? 3 : 0) +
    (benefits.organic ? 1 : 0);

  return benefits;
}

// ─── Source: OpenFoodFacts ─────────────────────────────────────────────────
async function fetchOpenFoodFacts(page, pageSize) {
  const fields = [
    'code',
    'product_name',
    'brands',
    'categories',
    'ingredients_text',
    'labels',
    'nutriments',
    'serving_size',
    'image_url',
  ].join(',');
  const queryParam = SEARCH_QUERY
    ? `&search_terms=${encodeURIComponent(SEARCH_QUERY)}&search_simple=1`
    : '';
  // Restrict to products with US barcodes (UPC-A starts with country code 0)
  // and prefer English-language entries
  const url =
    `https://world.openfoodfacts.org/cgi/search.pl` +
    `?action=process&sort_by=unique_scans_n&page=${page}` +
    `&page_size=${pageSize}&json=1&fields=${fields}` +
    `&tagtype_0=countries&tag_contains_0=contains&tag_0=united-states${queryParam}`;
  const data = await fetchJson(url);
  const products = data.products || [];
  return products.map(normalizeOpenFoodFacts).filter(Boolean);
}

function normalizeOpenFoodFacts(p) {
  if (!p.code || !p.product_name) return null;
  const ingredients = tokenize(p.ingredients_text);
  const flags = flagIngredients(ingredients);
  const benefits = scoreFunctionalBenefits(ingredients, p.product_name, p.labels);
  const n = p.nutriments || {};

  return {
    barcode: String(p.code),
    name: p.product_name,
    brand: (p.brands || '').split(',')[0].trim() || null,
    category: (p.categories || '').split(',').pop()?.trim() || null,
    image: p.image_url || null,
    servingSize: p.serving_size || null,
    calories: n['energy-kcal_serving'] ?? n['energy-kcal_100g'] ?? null,
    ingredients,
    nutrition: {
      fat: n.fat_serving ?? n.fat_100g ?? null,
      saturatedFat: n['saturated-fat_serving'] ?? n['saturated-fat_100g'] ?? null,
      sodium:
        n.sodium_serving != null ? n.sodium_serving * 1000 :
        n.sodium_100g != null ? n.sodium_100g * 1000 :
        null,
      carbs: n.carbohydrates_serving ?? n.carbohydrates_100g ?? null,
      sugars: n.sugars_serving ?? n.sugars_100g ?? null,
      protein: n.proteins_serving ?? n.proteins_100g ?? null,
    },
    source: 'openfoodfacts',
    flags,
    functionalBenefits: benefits,
    ingestedAt: new Date().toISOString(),
  };
}

// ─── Source: USDA FoodData Central ─────────────────────────────────────────
// Primary host: api.nal.usda.gov  (must be on Cowork egress allowlist)
// To add: Settings → Capabilities → Network allowlist → add api.nal.usda.gov
async function fetchUSDA(page, pageSize) {
  const queryParam = SEARCH_QUERY
    ? `&query=${encodeURIComponent(SEARCH_QUERY)}`
    : `&query=food`;
  const url =
    `https://api.nal.usda.gov/fdc/v1/foods/search` +
    `?api_key=${encodeURIComponent(USDA_API_KEY)}` +
    `&dataType=Branded&pageSize=${Math.min(pageSize, 200)}&pageNumber=${page}` +
    `&sortBy=publishedDate&sortOrder=desc${queryParam}`;
  const data = await fetchJson(url);
  const foods = data.foods || [];
  return foods.map(normalizeUSDA).filter(Boolean);
}

function normalizeUSDA(f) {
  if (!f.gtinUpc && !f.fdcId) return null;
  const ingredients = tokenize(f.ingredients);
  const flags = flagIngredients(ingredients);
  const benefits = scoreFunctionalBenefits(ingredients, f.description, f.brandedFoodCategory);

  const nutMap = {};
  for (const n of f.foodNutrients || []) {
    const name = String(n.nutrientName || '').toLowerCase();
    nutMap[name] = n.value;
  }

  return {
    barcode: f.gtinUpc ? String(f.gtinUpc) : `usda-${f.fdcId}`,
    name: f.description || null,
    brand: f.brandOwner || f.brandName || null,
    category: f.brandedFoodCategory || null,
    image: null,
    servingSize: f.servingSize ? `${f.servingSize} ${f.servingSizeUnit || ''}`.trim() : null,
    calories: nutMap['energy'] ?? null,
    ingredients,
    nutrition: {
      fat: nutMap['total lipid (fat)'] ?? null,
      saturatedFat: nutMap['fatty acids, total saturated'] ?? null,
      sodium: nutMap['sodium, na'] ?? null,
      carbs: nutMap['carbohydrate, by difference'] ?? null,
      sugars:
        nutMap['sugars, total including nlea'] ??
        nutMap['total sugars'] ??
        nutMap['sugars, total'] ??
        null,
      protein: nutMap['protein'] ?? null,
    },
    source: 'usda',
    flags,
    functionalBenefits: benefits,
    ingestedAt: new Date().toISOString(),
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  ensureDir(LOG_FILE);
  ensureDir(OUTPUT_FILE);

  logLine(`=== Ingestion run started ===`);
  logLine(
    `Batch size: ${BATCH_SIZE}, Source: ${SOURCE}, Query: ${SEARCH_QUERY || '(none — broad sweep)'}, USDA key: ${
      USDA_API_KEY === 'DEMO_KEY' ? 'DEMO_KEY (rate-limited)' : 'configured'
    }`
  );

  // Existing dataset
  const existing = readJsonOrDefault(OUTPUT_FILE, {
    products: [],
    meta: { lastRun: null, totalCount: 0 },
  });
  if (!existing.products) existing.products = [];
  if (!existing.meta) existing.meta = { lastRun: null, totalCount: 0 };

  const knownBarcodes = new Set(existing.products.map((p) => p.barcode));

  // Page-cursor state
  const state = readJsonOrDefault(STATE_FILE, { offPage: 1, usdaPage: 1 });

  const added = [];
  const errors = [];

  const useOFF = SOURCE === 'openfoodfacts' || SOURCE === 'both';
  const useUSDA = SOURCE === 'usda' || SOURCE === 'both';
  const halfBatch = useOFF && useUSDA ? Math.ceil(BATCH_SIZE / 2) : BATCH_SIZE;

  // OpenFoodFacts
  if (useOFF) {
    try {
      const target = halfBatch;
      const collected = [];
      let page = state.offPage;
      let attempts = 0;
      while (collected.length < target && attempts < 5) {
        if (attempts > 0) await new Promise((r) => setTimeout(r, 2000)); // polite delay
        const products = await fetchOpenFoodFacts(page, Math.max(target * 2, 25));
        if (products.length === 0) break;
        for (const p of products) {
          if (collected.length >= target) break;
          if (knownBarcodes.has(p.barcode)) continue;
          knownBarcodes.add(p.barcode);
          collected.push(p);
        }
        page++;
        attempts++;
      }
      state.offPage = page;
      added.push(...collected);
      logLine(`OpenFoodFacts: added ${collected.length} new products (advanced to page ${page})`);
    } catch (e) {
      // 503 from OFF is a soft rate-limit — log it but don't abort the whole run,
      // USDA can still fill the batch
      const msg = `OpenFoodFacts WARNING (skipping, USDA will fill batch): ${e.message.slice(0, 120)}`;
      logLine(msg);
    }
  }

  // USDA — only if no fatal error from OpenFoodFacts
  if (useUSDA && errors.length === 0) {
    try {
      const target = useOFF ? Math.max(0, BATCH_SIZE - added.length) : BATCH_SIZE;
      const collected = [];
      let page = state.usdaPage;
      let attempts = 0;
      while (collected.length < target && attempts < 20) {
        const products = await fetchUSDA(page, 200);
        if (products.length === 0) break;
        for (const p of products) {
          if (collected.length >= target) break;
          if (knownBarcodes.has(p.barcode)) continue;
          knownBarcodes.add(p.barcode);
          collected.push(p);
        }
        page++;
        attempts++;
      }
      state.usdaPage = page;
      added.push(...collected);
      logLine(`USDA: added ${collected.length} new products (advanced to page ${page})`);
    } catch (e) {
      const msg = `USDA ERROR: ${e.message}`;
      logLine(msg);
      errors.push(msg);
    }
  }

  // Per the schedule's policy: if the script errors, log and stop.
  if (errors.length > 0) {
    logLine(`=== Ingestion run FAILED. Stopping per error policy. Errors: ${errors.length} ===`);
    process.exit(1);
  }

  // Merge + persist
  existing.products.push(...added);
  existing.meta.lastRun = new Date().toISOString();
  existing.meta.totalCount = existing.products.length;
  existing.meta.lastBatchSize = added.length;

  writeJson(OUTPUT_FILE, existing);
  writeJson(STATE_FILE, state);

  if (added.length > 0) {
    logLine(`Added ${added.length} products this run:`);
    for (const p of added) {
      const concerns = p.flags.totalConcerns;
      const benefitScore = p.functionalBenefits.score;
      logLine(
        `  [${p.source}] ${p.barcode} ${p.name} (${p.brand || 'no-brand'}) — concerns: ${concerns}, benefits: ${benefitScore}`
      );
    }
  } else {
    logLine(`No new products added this run.`);
  }

  logLine(`=== Ingestion run completed. Total products in DB: ${existing.products.length} ===`);
}

main().catch((e) => {
  try {
    ensureDir(LOG_FILE);
    fs.appendFileSync(
      LOG_FILE,
      `[${new Date().toISOString()}] FATAL: ${e.stack || e.message}\n`
    );
  } catch (_) {}
  console.error('FATAL:', e);
  process.exit(1);
});
