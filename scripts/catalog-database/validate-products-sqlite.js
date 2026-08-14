#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');
const { DatabaseSync } = require('node:sqlite');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const DB_PATH = path.join(ROOT, 'assets', 'db', 'products.db');
const REPORT_PATH = path.join(__dirname, 'wave1-report.md');

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
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
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
  return evalObjectLiteral(
    objectLiteralAfter(readSource('src/data/products.js'), 'const MANUAL_PRODUCTS ='),
    'MANUAL_PRODUCTS'
  );
}

function loadCompanies() {
  return evalObjectLiteral(
    objectLiteralAfter(readSource('src/data/companies.js'), 'export const COMPANY_DB ='),
    'COMPANY_DB'
  );
}

function loadHealthyCategories() {
  let source = readSource('src/data/healthyCategories.js');
  source = source
    .replace(/^import .+;\s*$/gm, '')
    .replace(/export const HEALTHY_CATEGORIES\s*=/, 'const HEALTHY_CATEGORIES =')
    .replace(/export function\s+/g, 'function ');

  // healthyCategories.js now derives colors via buildCategoryAccents(ids) —
  // stub it the same way build-products-sqlite.js does (color/lightColor
  // aren't used below, just need a valid-shaped fake per id).
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

function stableSample(items, count) {
  const result = [];
  let seed = 0x12345678;
  const used = new Set();
  while (result.length < count && used.size < items.length) {
    seed = (1664525 * seed + 1013904223) >>> 0;
    const index = seed % items.length;
    if (!used.has(index)) {
      used.add(index);
      result.push(items[index]);
    }
  }
  return result;
}

function parseJson(value, fallback) {
  if (value == null) return fallback;
  return JSON.parse(value);
}

function comparableDbRow(row) {
  return {
    barcode: row.barcode,
    name: row.name,
    brand: row.brand,
    companyId: row.companyId,
    category: row.category,
    image: row.image,
    servingSize: row.servingSize,
    calories: row.calories,
    ingredients: parseJson(row.ingredients_json, []),
    nutrition: parseJson(row.nutrition_json, {}),
    certifications: parseJson(row.certifications_json, []),
    flags: parseJson(row.flags_json, {}),
    packaging: parseJson(row.packaging_json, null),
    isOrganic: !!row.isOrganic,
    isVegan: !!row.isVegan,
    isGlutenFree: !!row.isGlutenFree,
  };
}

function comparableProduct(product, productImages) {
  const barcode = String(product.barcode);
  return {
    barcode,
    name: product.name ?? null,
    brand: product.brand ?? null,
    companyId: product.companyId ?? null,
    category: product.category ?? null,
    image: product.image || productImages[barcode] || null,
    servingSize: product.servingSize ?? null,
    calories: product.calories == null ? null : Number(product.calories),
    ingredients: product.ingredients || [],
    nutrition: product.nutrition || {},
    certifications: product.certifications || [],
    flags: product.flags || {},
    packaging: product.packaging ?? null,
    isOrganic: !!product.isOrganic,
    isVegan: !!product.isVegan,
    isGlutenFree: !!product.isGlutenFree,
  };
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, ok, details = '') {
  log(`${ok ? 'PASS' : 'FAIL'}: ${name}${details ? ` - ${details}` : ''}`);
  return ok;
}

function timeQuery(label, fn) {
  const t0 = performance.now();
  const result = fn();
  const ms = performance.now() - t0;
  log(`TIMING: ${label} ${ms.toFixed(3)}ms`);
  return { result, ms };
}

function main() {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`Database not found: ${path.relative(ROOT, DB_PATH)}`);
  }

  log('Starting SQLite validation.');
  const manualProducts = loadManualProducts();
  const manualBarcodes = Object.keys(manualProducts);
  const categories = loadHealthyCategories();
  const companies = loadCompanies();
  const productImages = require(path.join(DATA_DIR, 'product_images.json'));

  // products_generated.json (~136k OFF bulk rows) is deliberately excluded
  // from products.db as of 2026-07-12 — it never shipped to production
  // anyway (see products.js's try/catch require and .easignore), and folding
  // it into the SQLite build ballooned the file to 161MB, blowing past
  // Supabase's free-tier 50MB upload cap. products.db is manual-only now, so
  // this validation expects exactly manualBarcodes.length rows and 0
  // 'generated'-sourced rows.
  const expectedRows = manualBarcodes.length;

  const db = new DatabaseSync(DB_PATH, { readOnly: true });
  const rowCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  const manualCount = db.prepare("SELECT COUNT(*) AS count FROM products WHERE source = 'manual'").get().count;
  const generatedCount = db.prepare("SELECT COUNT(*) AS count FROM products WHERE source = 'generated'").get().count;

  let allOk = true;
  allOk = check('row count is manual-only', rowCount === expectedRows, `db=${rowCount}, expected=${expectedRows}`) && allOk;
  allOk = check('manual source row count', manualCount === manualBarcodes.length, `db=${manualCount}, expected=${manualBarcodes.length}`) && allOk;
  allOk = check('generated rows deliberately excluded', generatedCount === 0, `db=${generatedCount}, expected=0`) && allOk;

  const productQuery = db.prepare('SELECT * FROM products WHERE barcode = ?');

  const manualSamples = manualBarcodes.slice(0, 5);
  for (const barcode of manualSamples) {
    const row = productQuery.get(barcode);
    const dbComparable = row ? comparableDbRow(row) : null;
    const sourceComparable = comparableProduct(manualProducts[barcode], productImages);
    allOk = check(
      `manual override spot check ${barcode}`,
      row?.source === 'manual' && sameJson(dbComparable, sourceComparable),
      row ? `${row.name}` : 'missing'
    ) && allOk;
  }

  // Dedicated spot check for the packaging/diet-flag columns (Wave 2 schema
  // gap fix): a manual product known to carry real packaging data.
  const packagingBarcode = '014500021830'; // Birds Eye Steamfresh Pure & Simple Broccoli Florets
  const packagingRow = productQuery.get(packagingBarcode);
  const packagingSource = manualProducts[packagingBarcode];
  allOk = check(
    `manual packaging_json populated ${packagingBarcode}`,
    !!packagingRow
      && sameJson(parseJson(packagingRow.packaging_json, null), packagingSource?.packaging ?? null)
      && packagingRow.packaging_json != null,
    packagingRow ? `${packagingRow.name}` : 'missing'
  ) && allOk;
  allOk = check(
    `manual diet flags populated ${packagingBarcode}`,
    !!packagingRow
      && !!packagingRow.isVegan === !!packagingSource?.isVegan
      && !!packagingRow.isGlutenFree === !!packagingSource?.isGlutenFree
      && !!packagingRow.isOrganic === !!packagingSource?.isOrganic,
    packagingRow
      ? `isOrganic=${packagingRow.isOrganic}, isVegan=${packagingRow.isVegan}, isGlutenFree=${packagingRow.isGlutenFree}`
      : 'missing'
  ) && allOk;

  const expectedIndexes = new Set([
    'idx_products_category',
    'idx_products_company',
    'idx_products_brand',
    'idx_products_search_text',
  ]);
  const indexRows = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = 'products'"
  ).all();
  const actualIndexes = new Set(indexRows.map((row) => row.name));
  for (const indexName of expectedIndexes) {
    allOk = check(`index exists ${indexName}`, actualIndexes.has(indexName)) && allOk;
  }

  const category = categories[0];
  const wanted = new Set(category.productCategories.map((name) => String(name).toLowerCase()));
  let directCount = 0;
  for (const product of Object.values(manualProducts)) {
    if (product.category && wanted.has(String(product.category).toLowerCase())) directCount += 1;
  }
  const summaryCount = db.prepare('SELECT count FROM category_counts WHERE category_id = ?').get(category.id)?.count;
  allOk = check(
    `summary category count sanity ${category.id}`,
    summaryCount === directCount,
    `summary=${summaryCount}, direct=${directCount}`
  ) && allOk;

  const summaryTables = [
    'category_counts',
    'category_hero_images',
    'company_product_counts',
    'spotlight_company_ids',
    'schema_meta',
  ];
  for (const table of summaryTables) {
    const count = db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;
    allOk = check(`summary table populated ${table}`, count > 0, `rows=${count}`) && allOk;
  }

  // Reference data (schemaVersion 2). The app overlays these tables onto its
  // bundled companies.js / ingredientCache.js at startup. A build that
  // silently dropped them would still pass every check above and would still
  // run — the app would just quietly fall back to bundled data forever, which
  // is exactly the failure this phase exists to end. So check them loudly.
  const schemaVersion = db.prepare("SELECT value FROM schema_meta WHERE key = 'schemaVersion'").get()?.value;
  allOk = check('schema version is 2', schemaVersion === '2', `value=${schemaVersion}`) && allOk;

  const companyRows = db.prepare('SELECT COUNT(*) AS count FROM companies').get().count;
  const sourceCompanyCount = Object.keys(companies).length;
  allOk = check(
    'companies table matches source',
    companyRows === sourceCompanyCount,
    `db=${companyRows}, source=${sourceCompanyCount}`
  ) && allOk;

  const brandRows = db.prepare('SELECT COUNT(*) AS count FROM brand_company_map').get().count;
  allOk = check('brand_company_map populated', brandRows > 0, `rows=${brandRows}`) && allOk;

  const brandKinds = db.prepare('SELECT DISTINCT kind FROM brand_company_map ORDER BY kind').all().map((r) => r.kind);
  allOk = check(
    'brand_company_map carries both kinds',
    sameJson(brandKinds, ['company', 'parent']),
    `kinds=${brandKinds.join(',')}`
  ) && allOk;

  const ingredientRows = db.prepare('SELECT COUNT(*) AS count FROM ingredient_analysis').get().count;
  allOk = check('ingredient_analysis populated', ingredientRows > 0, `rows=${ingredientRows}`) && allOk;

  // Every reference row is JSON the app parses at startup. One unparseable
  // row is silently skipped there, so catch it here instead.
  let badJson = 0;
  for (const row of db.prepare('SELECT id, json FROM companies').all()) {
    try {
      const parsed = JSON.parse(row.json);
      if (!parsed || typeof parsed !== 'object') badJson += 1;
    } catch (error) {
      badJson += 1;
    }
  }
  allOk = check('every company row is valid JSON', badJson === 0, `bad=${badJson}`) && allOk;

  const barcodeForTiming = manualSamples[0];
  timeQuery(`barcode lookup ${barcodeForTiming}`, () => productQuery.get(barcodeForTiming));
  timeQuery('LIKE search "%cheerios%" limit 6', () => db.prepare(
    "SELECT barcode, name FROM products WHERE search_text LIKE ? LIMIT 6"
  ).all('%cheerios%'));

  const scoredRows = db.prepare('SELECT COUNT(*) AS count FROM products WHERE score IS NOT NULL AND grade IS NOT NULL').get().count;
  const metaRows = db.prepare('SELECT key, value FROM schema_meta ORDER BY key').all();
  const dbSize = fs.statSync(DB_PATH).size;

  log(`DB size ${(dbSize / 1024 / 1024).toFixed(2)} MB.`);
  log(`Rows total=${rowCount}, generated=${generatedCount}, manual=${manualCount}.`);
  log(`Score rows=${scoredRows}; scorer meta=${metaRows.find((row) => row.key === 'scorerVersion')?.value || 'missing'}.`);
  log(`Validation ${allOk ? 'PASS' : 'FAIL'}.`);

  db.close();
  if (!allOk) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  log(`FAILED: ${error.stack || error.message}`);
  process.exitCode = 1;
}
