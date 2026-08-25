#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');
const { DatabaseSync } = require('node:sqlite');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const SRC_DIR = path.join(ROOT, 'src');
const DB_DIR = path.join(ROOT, 'assets', 'db');
const DB_PATH = path.join(DB_DIR, 'products.db');
const REPORT_PATH = path.join(__dirname, 'wave1-report.md');

const CATEGORY_INDEXES = [
  ['idx_products_category', 'category'],
  ['idx_products_company', 'companyId'],
  ['idx_products_brand', 'brand'],
  ['idx_products_search_text', 'search_text'],
];

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}`;
  console.log(line);
  fs.appendFileSync(REPORT_PATH, `${line}\n`);
}

function readSource(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function objectLiteralAfter(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Marker not found: ${marker}`);

  const start = source.indexOf('{', markerIndex);
  if (start < 0) throw new Error(`Object start not found after: ${marker}`);

  let depth = 0;
  let quote = null;
  let lineComment = false;
  let blockComment = false;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === '\n' || ch === '\r') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (ch === '\\') {
        i += 1;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '/' && next === '/') {
      lineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      blockComment = true;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }

  throw new Error(`Object end not found after: ${marker}`);
}

function evalObjectLiteral(literal, label) {
  return vm.runInNewContext(`(${literal})`, Object.create(null), {
    filename: label,
    timeout: 30000,
  });
}

function loadManualProducts() {
  const source = readSource('src/data/products.js');
  const literal = objectLiteralAfter(source, 'const MANUAL_PRODUCTS =');
  return evalObjectLiteral(literal, 'MANUAL_PRODUCTS');
}

function loadHealthyCategories() {
  let source = readSource('src/data/healthyCategories.js');
  source = source
    .replace(/^import .+;\s*$/gm, '')
    .replace(/export const HEALTHY_CATEGORIES\s*=/, 'const HEALTHY_CATEGORIES =')
    .replace(/export function\s+/g, 'function ');

  // healthyCategories.js now derives colors via buildCategoryAccents(ids) —
  // this build script only needs valid category id/label/productCategories
  // (color/lightColor aren't read anywhere below), so stub it with a Proxy
  // that fabricates a plausible {color, light} pair for any id.
  const buildCategoryAccents = () => new Proxy(Object.create(null), {
    get: (_target, key) => ({
      color: `#${String(key).slice(0, 6).padEnd(6, '0')}`,
      light: '#ffffff',
    }),
  });

  return vm.runInNewContext(`${source}\nHEALTHY_CATEGORIES;`, { buildCategoryAccents }, {
    filename: 'healthyCategories.js',
    timeout: 30000,
  });
}

function loadCompanies() {
  const source = readSource('src/data/companies.js');
  const literal = objectLiteralAfter(source, 'export const COMPANY_DB =');
  return evalObjectLiteral(literal, 'COMPANY_DB');
}

function loadBrandMaps() {
  const source = readSource('src/data/companies.js');
  return {
    brandToCompany: evalObjectLiteral(
      objectLiteralAfter(source, 'export const BRAND_TO_COMPANY ='),
      'BRAND_TO_COMPANY'
    ),
    brandParentMap: evalObjectLiteral(
      objectLiteralAfter(source, 'export const BRAND_PARENT_MAP ='),
      'BRAND_PARENT_MAP'
    ),
  };
}

// CACHED_INGREDIENT_ANALYSIS's values reference the IngredientRisk enum
// declared above it in the same file, so the object literal cannot be
// evaluated on its own the way COMPANY_DB can. Run the whole module in a
// sandbox instead, the same way loadScorer() does.
function loadIngredientAnalysis() {
  const sandbox = { module: { exports: {} }, exports: {} };
  const bundle = [
    transformExports(readSource('src/data/ingredientCache.js')),
    '\nmodule.exports = CACHED_INGREDIENT_ANALYSIS;',
  ].join('\n');

  vm.runInNewContext(bundle, sandbox, {
    filename: 'ingredientCache.js',
    timeout: 30000,
  });

  const analysis = sandbox.module.exports;
  if (!analysis || typeof analysis !== 'object') {
    throw new Error('CACHED_INGREDIENT_ANALYSIS was not exported from ingredientCache.js');
  }
  return analysis;
}

function transformExports(source) {
  return source
    // Pre-existing bug found 2026-07-30: this only matched single-line
    // imports, so scorer.js's multi-line `import {\n a,\n b,\n} from '...'`
    // (added for ingredientNormalizer.js) silently broke score precompute
    // (caught by the try/catch, logged as "skipped", never crashed the
    // build — so it went unnoticed rather than failing loudly). Now
    // matches `import` through the first `from '...';` non-greedily,
    // across lines, covering both single- and multi-line import forms.
    .replace(/^import\b[\s\S]*?from\s*['"][^'"]+['"];?\s*$/gm, '')
    .replace(/\bexport const\s+/g, 'const ')
    .replace(/\bexport function\s+/g, 'function ');
}

// ingredientNormalizer.js is a plain CommonJS module (module.exports = {...}),
// not ES export syntax, since it must also be require()'d directly by
// scripts/catalog-database/ingest-products.js. Strip its module.exports assignment so the
// bare function declarations (hoisted) become available in the shared VM
// sandbox scope for scorer.js's `classifyTokenPlausibility` reference.
function stripModuleExports(source) {
  return source.replace(/^module\.exports\s*=\s*\{[\s\S]*?\};\s*$/m, '');
}

function loadScorer(companies) {
  const bundle = [
    transformExports(readSource('src/data/ingredientCache.js')),
    transformExports(readSource('src/data/ingredients.js')),
    stripModuleExports(readSource('src/utils/ingredientNormalizer.js')),
    // scorer.js imports detectHousingTier/isEggsHousingEligible from here
    // (housing-tier scoring adjustment, 2026-07-30) — must be bundled
    // before scorer.js or those calls are ReferenceErrors in the sandbox.
    transformExports(readSource('src/utils/sourcingMatch.js')),
    transformExports(readSource('src/utils/scorer.js')),
    '\nmodule.exports = { scoreProduct, scoreToGrade };',
  ].join('\n\n');

  const sandbox = {
    module: { exports: {} },
    exports: {},
    console,
    // scorer.js also imports COMPANY_DB directly (meat-poultry/seafood
    // sourcing adjustment, 2026-07-30) — the import line itself gets
    // stripped by transformExports() same as every other import, so the
    // bundled code's `COMPANY_DB` reference needs this pre-parsed object
    // (from loadCompanies(), already-loaded real data, not re-bundled
    // source text) sitting in scope before the bundle runs.
    COMPANY_DB: companies,
  };

  vm.runInNewContext(bundle, sandbox, {
    filename: 'scorer-bundle.js',
    timeout: 30000,
  });

  if (typeof sandbox.module.exports.scoreProduct !== 'function') {
    throw new Error('scoreProduct was not exported from scorer bundle');
  }
  return sandbox.module.exports;
}

function jsonOrNull(value) {
  return value == null ? null : JSON.stringify(value);
}

function stringOrNull(value) {
  if (value == null) return null;
  const text = String(value);
  return text.length ? text : null;
}

function rowFromProduct(product, source, productImages, scoreProduct) {
  const barcode = String(product.barcode || '').trim();
  const image = product.image || productImages[barcode] || null;
  let score = null;
  let grade = null;

  if (scoreProduct) {
    const result = scoreProduct(product);
    score = Number.isFinite(result?.score) ? result.score : null;
    grade = result?.grade ? String(result.grade) : null;
  }

  const name = stringOrNull(product.name);
  const brand = stringOrNull(product.brand);
  const category = stringOrNull(product.category);
  const searchText = [name, brand, category, barcode]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return {
    barcode,
    name,
    brand,
    companyId: stringOrNull(product.companyId),
    category,
    image: stringOrNull(image),
    servingSize: stringOrNull(product.servingSize),
    calories: product.calories == null ? null : Number(product.calories),
    ingredients_json: jsonOrNull(product.ingredients || []),
    nutrition_json: jsonOrNull(product.nutrition || {}),
    certifications_json: jsonOrNull(product.certifications || []),
    flags_json: jsonOrNull(product.flags || {}),
    packaging_json: jsonOrNull(product.packaging ?? null),
    isOrganic: product.isOrganic ? 1 : 0,
    isVegan: product.isVegan ? 1 : 0,
    isGlutenFree: product.isGlutenFree ? 1 : 0,
    isBioengineered: product.isBioengineered ? 1 : 0,
    source,
    score,
    grade,
    search_text: searchText,
  };
}

function insertProduct(stmt, row) {
  stmt.run(
    row.barcode,
    row.name,
    row.brand,
    row.companyId,
    row.category,
    row.image,
    row.servingSize,
    row.calories,
    row.ingredients_json,
    row.nutrition_json,
    row.certifications_json,
    row.flags_json,
    row.packaging_json,
    row.isOrganic,
    row.isVegan,
    row.isGlutenFree,
    row.isBioengineered,
    row.source,
    row.score,
    row.grade,
    row.search_text
  );
}

function createSchema(db) {
  db.exec(`
    PRAGMA journal_mode = OFF;
    PRAGMA synchronous = OFF;
    PRAGMA temp_store = MEMORY;
    PRAGMA locking_mode = EXCLUSIVE;

    CREATE TABLE products (
      barcode TEXT PRIMARY KEY,
      name TEXT,
      brand TEXT,
      companyId TEXT,
      category TEXT,
      image TEXT,
      servingSize TEXT,
      calories INTEGER,
      ingredients_json TEXT,
      nutrition_json TEXT,
      certifications_json TEXT,
      flags_json TEXT,
      packaging_json TEXT,
      isOrganic INTEGER,
      isVegan INTEGER,
      isGlutenFree INTEGER,
      isBioengineered INTEGER,
      source TEXT,
      score INTEGER,
      grade TEXT,
      search_text TEXT
    );

    CREATE TABLE category_counts (
      category_id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      count INTEGER NOT NULL
    );

    CREATE TABLE category_hero_images (
      category_id TEXT PRIMARY KEY,
      barcode TEXT,
      image TEXT,
      score INTEGER,
      grade TEXT
    );

    CREATE TABLE company_product_counts (
      companyId TEXT PRIMARY KEY,
      count INTEGER NOT NULL
    );

    CREATE TABLE spotlight_company_ids (
      companyId TEXT PRIMARY KEY,
      productCount INTEGER NOT NULL,
      featuredOrder INTEGER,
      hasHighIssue INTEGER NOT NULL
    );

    CREATE TABLE schema_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Reference data (schemaVersion 2, Phase 3 of the decouple-from-Apple
    -- plan). These three tables mirror what src/data/companies.js and
    -- src/data/ingredientCache.js hold in the JS bundle. The app keeps the
    -- bundled copies as its offline seed and overlays these rows on top at
    -- startup, so company and sourcing research reaches users by uploading a
    -- new products.db instead of by shipping an app build.
    CREATE TABLE companies (
      id TEXT PRIMARY KEY,
      json TEXT NOT NULL
    );

    -- Both brand lookups live in one table, separated by the kind column:
    --   'company' — BRAND_TO_COMPANY, brand -> COMPANY_DB id
    --   'parent'  — BRAND_PARENT_MAP, brand -> parent company display name
    -- A brand can legitimately appear under both kinds, so the primary key
    -- is the pair, not the brand alone.
    CREATE TABLE brand_company_map (
      brand TEXT NOT NULL,
      kind TEXT NOT NULL,
      value TEXT NOT NULL,
      PRIMARY KEY (brand, kind)
    );

    CREATE TABLE ingredient_analysis (
      name TEXT PRIMARY KEY,
      json TEXT NOT NULL
    );
  `);
}

function insertReferenceData(db, companies, brandMaps, ingredientAnalysis) {
  const insertCompany = db.prepare('INSERT INTO companies (id, json) VALUES (?, ?)');
  const insertBrand = db.prepare(
    'INSERT OR REPLACE INTO brand_company_map (brand, kind, value) VALUES (?, ?, ?)'
  );
  const insertIngredient = db.prepare(
    'INSERT INTO ingredient_analysis (name, json) VALUES (?, ?)'
  );

  let companyCount = 0;
  for (const [id, company] of Object.entries(companies)) {
    insertCompany.run(id, JSON.stringify(company));
    companyCount += 1;
  }

  let brandCount = 0;
  for (const [brand, companyId] of Object.entries(brandMaps.brandToCompany)) {
    insertBrand.run(brand, 'company', String(companyId));
    brandCount += 1;
  }
  for (const [brand, parentName] of Object.entries(brandMaps.brandParentMap)) {
    insertBrand.run(brand, 'parent', String(parentName));
    brandCount += 1;
  }

  let ingredientCount = 0;
  for (const [name, analysis] of Object.entries(ingredientAnalysis)) {
    insertIngredient.run(name, JSON.stringify(analysis));
    ingredientCount += 1;
  }

  return { companyCount, brandCount, ingredientCount };
}

function insertSummaries(db, categories, companies) {
  const insertCategoryCount = db.prepare(
    'INSERT INTO category_counts (category_id, label, count) VALUES (?, ?, ?)'
  );
  const insertHero = db.prepare(
    'INSERT INTO category_hero_images (category_id, barcode, image, score, grade) VALUES (?, ?, ?, ?, ?)'
  );
  const insertCompany = db.prepare(
    'INSERT INTO company_product_counts (companyId, count) VALUES (?, ?)'
  );
  const insertSpotlight = db.prepare(
    'INSERT INTO spotlight_company_ids (companyId, productCount, featuredOrder, hasHighIssue) VALUES (?, ?, ?, ?)'
  );

  for (const category of categories) {
    const wanted = category.productCategories.map((name) => String(name).toLowerCase());
    const placeholders = wanted.map(() => '?').join(',');
    const countRow = db.prepare(
      `SELECT COUNT(*) AS count FROM products WHERE lower(category) IN (${placeholders})`
    ).get(...wanted);
    insertCategoryCount.run(category.id, category.label, countRow.count);

    const hero = db.prepare(
      `SELECT barcode, image, score, grade
         FROM products
        WHERE image IS NOT NULL
          AND image != ''
          AND lower(category) IN (${placeholders})
        ORDER BY COALESCE(score, -1) DESC, name COLLATE NOCASE ASC, barcode ASC
        LIMIT 1`
    ).get(...wanted);
    insertHero.run(
      category.id,
      hero?.barcode || null,
      hero?.image || null,
      hero?.score ?? null,
      hero?.grade || null
    );
  }

  const companyRows = db.prepare(
    `SELECT companyId, COUNT(*) AS count
       FROM products
      WHERE companyId IS NOT NULL AND companyId != ''
      GROUP BY companyId`
  ).all();

  const companyCounts = new Map();
  for (const row of companyRows) {
    companyCounts.set(row.companyId, row.count);
    insertCompany.run(row.companyId, row.count);
  }

  const featuredOrder = [
    'sargento', 'coca-cola', 'pepsico', 'nestle', 'kelloggs', 'general-mills',
    'kraft-heinz', 'hershey', 'mars', 'mondelez', 'campbell', 'tyson', 'hormel',
    'mccormick', 'danone', 'unilever', 'conagra', 'red-bull', 'monster-beverage',
    'keurig-dr-pepper', 'jm-smucker', 'dole-food', 'smithfield', 'oatly',
    'celsius-holdings', 'tropicana-brands', 'tillamook', 'blue-diamond',
    'bumble-bee', 'starkist',
  ];
  const orderMap = new Map(featuredOrder.map((id, index) => [id, index]));

  for (const company of Object.values(companies)) {
    const productCount = companyCounts.get(company.id) || 0;
    const hasHighIssue = company.issues?.some((issue) => issue.severity === 'high') ? 1 : 0;
    if (productCount > 0 && hasHighIssue) {
      insertSpotlight.run(
        company.id,
        productCount,
        orderMap.has(company.id) ? orderMap.get(company.id) : null,
        hasHighIssue
      );
    }
  }
}

function insertMeta(db, meta) {
  const stmt = db.prepare('INSERT INTO schema_meta (key, value) VALUES (?, ?)');
  for (const [key, value] of Object.entries(meta)) {
    stmt.run(key, String(value));
  }
}

function main() {
  const started = performance.now();
  fs.writeFileSync(REPORT_PATH, '# Wave 1 SQLite Build Report\n\n');

  log('Starting offline SQLite product build.');
  fs.mkdirSync(DB_DIR, { recursive: true });
  if (fs.existsSync(DB_PATH)) fs.rmSync(DB_PATH);

  const manualProducts = loadManualProducts();
  const manualBarcodes = new Set(Object.keys(manualProducts));
  log(`Extracted ${manualBarcodes.size} manual products from src/data/products.js.`);

  const categories = loadHealthyCategories();
  const companies = loadCompanies();
  log(`Loaded ${categories.length} healthy category definitions and ${Object.keys(companies).length} companies.`);

  const brandMaps = loadBrandMaps();
  const ingredientAnalysis = loadIngredientAnalysis();
  log(
    `Loaded ${Object.keys(brandMaps.brandToCompany).length} brand-to-company and ` +
    `${Object.keys(brandMaps.brandParentMap).length} brand-to-parent entries, ` +
    `${Object.keys(ingredientAnalysis).length} cached ingredient analyses.`
  );

  const productImages = require(path.join(DATA_DIR, 'product_images.json'));
  log(`Loaded ${Object.keys(productImages).length} product image backfills.`);

  let scoreProduct = null;
  let scorerNote = 'scoreProduct imported through VM bundle; score and grade precomputed';
  try {
    scoreProduct = loadScorer(companies).scoreProduct;
    log('Loaded scorer; score and grade will be precomputed.');
  } catch (error) {
    scorerNote = `score precompute skipped: ${error.message}`;
    log(scorerNote);
  }

  // products_generated.json (the ~136k-row OFF bulk import) is deliberately
  // NOT loaded here. It never ships to production (excluded from EAS builds
  // per .easignore, require()'d behind a try/catch in products.js that
  // silently no-ops when absent) — the app's production PRODUCT_DB has
  // always been manual-only, with the OFF API as the live fallback for
  // everything else. Folding it into products.db anyway is what made the
  // file 161MB and unshippable (see 2026-07-12 decision-log entry: Supabase's
  // free-tier 50MB upload cap, Metro OOM risk). Keeping this build
  // manual-only restores the intended architecture and the file size that
  // goes with it.
  const generatedProducts = [];

  const db = new DatabaseSync(DB_PATH);
  createSchema(db);

  const insertStmt = db.prepare(`
    INSERT INTO products (
      barcode, name, brand, companyId, category, image, servingSize, calories,
      ingredients_json, nutrition_json, certifications_json, flags_json,
      packaging_json, isOrganic, isVegan, isGlutenFree, isBioengineered,
      source, score, grade, search_text
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let generatedInserted = 0;
  let generatedSkippedForManual = 0;
  let manualInserted = 0;

  log('Inserting generated products.');
  db.exec('BEGIN');
  for (let i = 0; i < generatedProducts.length; i += 1) {
    const product = generatedProducts[i];
    const barcode = String(product?.barcode || '').trim();
    if (!barcode) continue;
    if (manualBarcodes.has(barcode)) {
      generatedSkippedForManual += 1;
      continue;
    }

    insertProduct(insertStmt, rowFromProduct(product, 'generated', productImages, scoreProduct));
    generatedInserted += 1;

    if (generatedInserted > 0 && generatedInserted % 25000 === 0) {
      log(`Inserted ${generatedInserted} generated rows so far.`);
    }
  }

  log('Inserting manual override products.');
  for (const product of Object.values(manualProducts)) {
    if (!product?.barcode) continue;
    insertProduct(insertStmt, rowFromProduct(product, 'manual', productImages, scoreProduct));
    manualInserted += 1;
  }
  db.exec('COMMIT');
  log(`Inserted ${generatedInserted} generated rows and ${manualInserted} manual rows; skipped ${generatedSkippedForManual} generated barcode collisions.`);

  log('Creating product indexes.');
  for (const [indexName, columnName] of CATEGORY_INDEXES) {
    db.exec(`CREATE INDEX ${indexName} ON products(${columnName})`);
  }

  log('Building summary tables.');
  db.exec('BEGIN');
  insertSummaries(db, categories, companies);
  const referenceCounts = insertReferenceData(db, companies, brandMaps, ingredientAnalysis);
  insertMeta(db, {
    schemaVersion: '2',
    generatedAt: new Date().toISOString(),
    scorerVersion: scorerNote,
    generatedSourceRows: generatedProducts.length,
    manualSourceRows: manualBarcodes.size,
    generatedSkippedForManual,
    companyRows: referenceCounts.companyCount,
    brandMapRows: referenceCounts.brandCount,
    ingredientAnalysisRows: referenceCounts.ingredientCount,
  });
  db.exec('COMMIT');

  db.exec('PRAGMA optimize');
  const rowCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  db.close();

  const sizeBytes = fs.statSync(DB_PATH).size;
  const seconds = ((performance.now() - started) / 1000).toFixed(2);
  log(`Build complete in ${seconds}s.`);
  log(`Database: ${path.relative(ROOT, DB_PATH)} (${(sizeBytes / 1024 / 1024).toFixed(2)} MB), rows=${rowCount}.`);
  log(`Score precompute: ${scoreProduct ? 'worked' : 'skipped'}.`);
  log(
    `Reference data: ${referenceCounts.companyCount} companies, ` +
    `${referenceCounts.brandCount} brand map rows, ` +
    `${referenceCounts.ingredientCount} ingredient analyses.`
  );
}

try {
  main();
} catch (error) {
  log(`FAILED: ${error.stack || error.message}`);
  process.exitCode = 1;
}
