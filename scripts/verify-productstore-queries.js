#!/usr/bin/env node

/**
 * verify-productstore-queries.js
 *
 * Node-side proof (no device/simulator needed) that:
 *   1. The exact SQL query string src/data/productStore.js's
 *      getProductByBarcode() uses runs without error against the REAL
 *      assets/db/products.db built by scripts/build-products-sqlite.js.
 *   2. Reshaping the raw row through the same logic as productStore.js's
 *      rowToProduct() produces an object with the fields scorer.js's
 *      scoreProduct() actually destructures (ingredients, nutrition,
 *      certifications), and running it through the REAL scoreProduct()
 *      produces a sane, non-crashing result.
 *
 * This does NOT prove the on-device asset-copy-then-open flow works (that
 * requires a real device/simulator build) — it only proves the schema and
 * query string are correct against real data, using the same node:sqlite
 * DatabaseSync driver Wave 1's own build/validate scripts use.
 */
const path = require('node:path');
const vm = require('node:vm');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, 'assets', 'db', 'products.db');

function readSource(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function transformExports(source) {
  return source
    .replace(/^import .+;\s*$/gm, '')
    .replace(/\bexport const\s+/g, 'const ')
    .replace(/\bexport function\s+/g, 'function ');
}

function loadScorer() {
  const bundle = [
    transformExports(readSource('src/data/ingredientCache.js')),
    transformExports(readSource('src/data/ingredients.js')),
    transformExports(readSource('src/utils/scorer.js')),
    '\nmodule.exports = { scoreProduct, scoreToGrade };',
  ].join('\n\n');

  const sandbox = { module: { exports: {} }, exports: {}, console };
  vm.runInNewContext(bundle, sandbox, { filename: 'scorer-bundle.js', timeout: 30000 });

  if (typeof sandbox.module.exports.scoreProduct !== 'function') {
    throw new Error('scoreProduct was not exported from scorer bundle');
  }
  return sandbox.module.exports;
}

// Same reshape logic as productStore.js's rowToProduct(), duplicated here
// (not imported) since this script runs under plain Node, not the RN/Expo
// runtime productStore.js is written for.
function rowToProduct(row) {
  return {
    barcode: row.barcode,
    name: row.name,
    brand: row.brand,
    companyId: row.companyId,
    category: row.category,
    image: row.image,
    servingSize: row.servingSize,
    calories: row.calories,
    ingredients: row.ingredients_json ? JSON.parse(row.ingredients_json) : [],
    nutrition: row.nutrition_json ? JSON.parse(row.nutrition_json) : {},
    certifications: row.certifications_json ? JSON.parse(row.certifications_json) : [],
    flags: row.flags_json ? JSON.parse(row.flags_json) : {},
    packaging: row.packaging_json ? JSON.parse(row.packaging_json) : null,
    isOrganic: !!row.isOrganic,
    isVegan: !!row.isVegan,
    isGlutenFree: !!row.isGlutenFree,
  };
}

function main() {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`Database not found: ${path.relative(ROOT, DB_PATH)}`);
  }

  console.log('Loading scorer...');
  const { scoreProduct } = loadScorer();

  console.log(`Opening ${path.relative(ROOT, DB_PATH)} (read-only)...`);
  const db = new DatabaseSync(DB_PATH, { readOnly: true });

  // Same barcodes as scripts/wave1-report.md's manual-override spot checks,
  // plus one generated-source barcode, so both `source` values are covered.
  const barcodes = [
    '016000275287', // Cheerios Original (manual)
    '016000275270', // Honey Nut Cheerios (manual)
    '038000845024', // Kellogg's Frosted Flakes (manual)
    '855974003201', // HONEY BBQ SAUCE (generated)
  ];

  let allOk = true;

  for (const barcode of barcodes) {
    // The EXACT query string productStore.js's getProductByBarcode() uses.
    const row = db.prepare('SELECT * FROM products WHERE barcode = ?').get(barcode);

    if (!row) {
      console.log(`FAIL: ${barcode} - no row returned`);
      allOk = false;
      continue;
    }

    const product = rowToProduct(row);

    const hasExpectedFields =
      Array.isArray(product.ingredients) &&
      typeof product.nutrition === 'object' &&
      product.nutrition !== null &&
      Array.isArray(product.certifications);

    if (!hasExpectedFields) {
      console.log(`FAIL: ${barcode} - reshaped product missing expected field types`, product);
      allOk = false;
      continue;
    }

    let result;
    let scoreError = null;
    try {
      result = scoreProduct(product);
    } catch (e) {
      scoreError = e;
    }

    if (scoreError) {
      console.log(`FAIL: ${barcode} - scoreProduct threw: ${scoreError.message}`);
      allOk = false;
      continue;
    }

    const scoreSane =
      Number.isFinite(result?.score) && result.score >= 0 && result.score <= 100 && !!result?.grade;

    console.log(
      `${scoreSane ? 'PASS' : 'FAIL'}: ${barcode} - "${product.name}" source=${row.source} ` +
        `ingredients=${product.ingredients.length} score=${result?.score} grade=${result?.grade}`
    );
    if (!scoreSane) allOk = false;
  }

  // Wave 2 schema gap fix: confirm packaging_json and diet-flag columns
  // reshape correctly and actually feed into scoreProduct()'s real penalty.
  console.log('\nSpot-checking packaging_json / diet-flag columns...');

  const packagingBarcode = '014500021830'; // Birds Eye Steamfresh Pure & Simple Broccoli Florets
  const packagingRow = db.prepare('SELECT * FROM products WHERE barcode = ?').get(packagingBarcode);
  if (!packagingRow) {
    console.log(`FAIL: ${packagingBarcode} - no row returned`);
    allOk = false;
  } else {
    const product = rowToProduct(packagingRow);
    const hasPackagingObject =
      product.packaging
      && product.packaging.material === 'plastic'
      && product.packaging.concernLevel === 'high';

    let result;
    let scoreError = null;
    try {
      result = scoreProduct(product);
    } catch (e) {
      scoreError = e;
    }

    const packagingPenaltyApplied = !scoreError && Number(result?.packagingPenalty) > 0;

    console.log(
      `${hasPackagingObject && packagingPenaltyApplied ? 'PASS' : 'FAIL'}: ${packagingBarcode} - "${product.name}" ` +
        `packaging=${JSON.stringify(product.packaging)} isVegan=${product.isVegan} isGlutenFree=${product.isGlutenFree} isOrganic=${product.isOrganic} ` +
        `packagingPenalty=${result?.packagingPenalty} score=${result?.score} grade=${result?.grade}`
    );
    if (!hasPackagingObject || !packagingPenaltyApplied) allOk = false;
  }

  const dietFlagBarcode = '074873970838'; // WestSoy Organic Unsweetened Vanilla Soymilk
  const dietFlagRow = db.prepare('SELECT * FROM products WHERE barcode = ?').get(dietFlagBarcode);
  if (!dietFlagRow) {
    console.log(`FAIL: ${dietFlagBarcode} - no row returned`);
    allOk = false;
  } else {
    const product = rowToProduct(dietFlagRow);
    const flagsCorrect =
      product.isOrganic === true && product.isVegan === true && product.isGlutenFree === true
      && typeof product.isOrganic === 'boolean'
      && typeof product.isVegan === 'boolean'
      && typeof product.isGlutenFree === 'boolean';

    console.log(
      `${flagsCorrect ? 'PASS' : 'FAIL'}: ${dietFlagBarcode} - "${product.name}" ` +
        `isOrganic=${product.isOrganic} isVegan=${product.isVegan} isGlutenFree=${product.isGlutenFree}`
    );
    if (!flagsCorrect) allOk = false;
  }

  // ── Wave 3: real-data checks for the new productStore.js query APIs ──────
  console.log('\nWave 3 — verifying new productStore.js query APIs against real data...');

  // searchProductsLocal: the exact query string, lowercased query bound in.
  {
    const q = 'cheerios';
    const rows = db
      .prepare("SELECT * FROM products WHERE search_text LIKE '%' || ? || '%' LIMIT ?")
      .all(q, 6);
    const ok = rows.length > 0 && rows.length <= 6 &&
      rows.every((r) => r.search_text.includes(q));
    console.log(`${ok ? 'PASS' : 'FAIL'}: searchProductsLocal('${q}') - ${rows.length} row(s), all contain query in search_text`);
    if (!ok) allOk = false;
  }

  // getFeaturedProducts: IN (...) query returns all requested barcodes (order reordered in JS, not here).
  {
    const barcodes = ['016000275287', '038000845024', '855974003201'];
    const placeholders = barcodes.map(() => '?').join(',');
    const rows = db.prepare(`SELECT * FROM products WHERE barcode IN (${placeholders})`).all(...barcodes);
    const ok = rows.length === barcodes.length;
    console.log(`${ok ? 'PASS' : 'FAIL'}: getFeaturedProducts(...) - requested ${barcodes.length}, got ${rows.length} row(s)`);
    if (!ok) allOk = false;
  }

  // getProductsByCategory: real category query sorted by score, nulls last.
  {
    const wanted = ['snack bars'];
    const rows = db
      .prepare('SELECT * FROM products WHERE lower(category) IN (?) ORDER BY score IS NULL, score DESC')
      .all(...wanted);
    let sorted = true;
    let sawNull = false;
    for (const row of rows) {
      if (row.score == null) {
        sawNull = true;
      } else if (sawNull) {
        sorted = false; // a non-null score appeared after a null one
      }
    }
    // also verify non-null scores are in descending order amongst themselves
    const nonNullScores = rows.filter((r) => r.score != null).map((r) => r.score);
    for (let i = 1; i < nonNullScores.length; i++) {
      if (nonNullScores[i] > nonNullScores[i - 1]) sorted = false;
    }
    const ok = rows.length > 0 && sorted;
    console.log(
      `${ok ? 'PASS' : 'FAIL'}: getProductsByCategory('Snack Bars') - ${rows.length} row(s), ` +
        `null-scores-last=${sawNull ? 'yes' : 'n/a'}, descending=${sorted}`
    );
    if (!ok) allOk = false;
  }

  // getCategoryCounts: confirm all 25 HEALTHY_CATEGORIES tiles have a row.
  {
    const rows = db.prepare('SELECT category_id, count FROM category_counts').all();
    const ok = rows.length === 25;
    console.log(`${ok ? 'PASS' : 'FAIL'}: getCategoryCounts() - expected 25 rows, got ${rows.length}`);
    if (!ok) allOk = false;
  }

  // getHeroImagesByCategory: one row per tile, same 25-row expectation.
  {
    const rows = db.prepare('SELECT category_id, image FROM category_hero_images').all();
    const ok = rows.length === 25;
    console.log(`${ok ? 'PASS' : 'FAIL'}: getHeroImagesByCategory() - expected 25 rows, got ${rows.length}`);
    if (!ok) allOk = false;
  }

  // getProductsByCompany: spot-check a known companyId returns only matching rows.
  {
    const companyRow = db
      .prepare("SELECT companyId FROM products WHERE companyId IS NOT NULL AND companyId != '' LIMIT 1")
      .get();
    if (!companyRow) {
      console.log('FAIL: getProductsByCompany(...) - no product with a companyId found to spot-check');
      allOk = false;
    } else {
      const rows = db.prepare('SELECT * FROM products WHERE companyId = ?').all(companyRow.companyId);
      const ok = rows.length > 0 && rows.every((r) => r.companyId === companyRow.companyId);
      console.log(`${ok ? 'PASS' : 'FAIL'}: getProductsByCompany('${companyRow.companyId}') - ${rows.length} row(s), all match`);
      if (!ok) allOk = false;
    }
  }

  // getSpotlightEligibleCompanies: table only contains eligible companies,
  // and Sargento (anchor of the FEATURED_ORDER rotation) is present at index 0.
  {
    const rows = db
      .prepare('SELECT companyId, productCount, featuredOrder, hasHighIssue FROM spotlight_company_ids')
      .all();
    const allEligible = rows.length > 0 && rows.every((r) => r.productCount > 0 && r.hasHighIssue === 1);
    const sargento = rows.find((r) => r.companyId === 'sargento');
    const sargentoOk = !!sargento && sargento.featuredOrder === 0;
    const ok = allEligible && sargentoOk;
    console.log(
      `${ok ? 'PASS' : 'FAIL'}: getSpotlightEligibleCompanies() - ${rows.length} eligible row(s), ` +
        `all productCount>0 && hasHighIssue=${allEligible}, sargento featuredOrder=${sargento?.featuredOrder}`
    );
    if (!ok) allOk = false;
  }

  // getCuratedGradeABCandidates: the exact query string productStore.js's
  // new function uses, run against real data. Confirms it returns a sane
  // fraction of the catalog, all curated (image+companyId) and grade A/B.
  {
    const rows = db
      .prepare(
        `SELECT * FROM products
          WHERE image IS NOT NULL AND image != ''
            AND companyId IS NOT NULL AND companyId != ''
            AND grade IN ('A', 'B')`
      )
      .all();
    const allCurated = rows.every(
      (r) => r.image && r.companyId && (r.grade === 'A' || r.grade === 'B')
    );
    // Sanity bound: curated (image+companyId) rows total 770 in the real DB
    // (892 manual products, some without image/companyId or non-A/B grade),
    // so this A/B-only subset should be a plausible fraction of that, not
    // suspiciously large (e.g. not close to the full 136k catalog).
    const sane = rows.length > 0 && rows.length < 1000;
    const ok = allCurated && sane;
    console.log(
      `${ok ? 'PASS' : 'FAIL'}: getCuratedGradeABCandidates() - ${rows.length} row(s), ` +
        `all curated+A/B=${allCurated}, sane-fraction=${sane}`
    );
    if (!ok) allOk = false;
  }

  // getAlternatives()-equivalent end-to-end proof for a real product:
  // Cheerios Original (grade C, category "Cereals") should surface curated
  // grade A/B cereal alternatives, sorted by score descending, excluding
  // itself, with a different barcode.
  {
    const scannedBarcode = '016000275287'; // Cheerios Original
    const scanned = db.prepare('SELECT * FROM products WHERE barcode = ?').get(scannedBarcode);

    function normalizeCategory(cat) {
      if (!cat || typeof cat !== 'string') return null;
      const stripped = cat.replace(/^en:/i, '').trim().toLowerCase();
      return stripped || null;
    }

    const targetCategory = normalizeCategory(scanned?.category);
    const candidateRows = db
      .prepare(
        `SELECT * FROM products
          WHERE image IS NOT NULL AND image != ''
            AND companyId IS NOT NULL AND companyId != ''
            AND grade IN ('A', 'B')`
      )
      .all();

    const alternatives = candidateRows
      .filter((row) => row.barcode !== scannedBarcode)
      .filter((row) => normalizeCategory(row.category) === targetCategory)
      .sort((a, b) => b.score - a.score);

    const sameCategory = alternatives.every((row) => normalizeCategory(row.category) === targetCategory);
    const differentBarcode = alternatives.every((row) => row.barcode !== scannedBarcode);
    const gradeAB = alternatives.every((row) => row.grade === 'A' || row.grade === 'B');
    let sortedDesc = true;
    for (let i = 1; i < alternatives.length; i++) {
      if (alternatives[i].score > alternatives[i - 1].score) sortedDesc = false;
    }

    const ok =
      !!scanned && targetCategory === 'cereals' && alternatives.length > 0 &&
      sameCategory && differentBarcode && gradeAB && sortedDesc;

    console.log(
      `${ok ? 'PASS' : 'FAIL'}: getAlternatives()-equivalent for Cheerios Original (${scannedBarcode}, ` +
        `category="${scanned?.category}", grade=${scanned?.grade}) - ${alternatives.length} alternative(s), ` +
        `sameCategory=${sameCategory}, differentBarcode=${differentBarcode}, gradeAB=${gradeAB}, sortedDesc=${sortedDesc}`
    );
    if (alternatives.length > 0) {
      const top = alternatives[0];
      console.log(
        `  top alternative: "${top.name}" barcode=${top.barcode} score=${top.score} grade=${top.grade}`
      );
    }
    if (!ok) allOk = false;
  }

  db.close();
  console.log(allOk ? '\nAll checks PASS.' : '\nSome checks FAILED.');
  if (!allOk) process.exitCode = 1;
}

main();
