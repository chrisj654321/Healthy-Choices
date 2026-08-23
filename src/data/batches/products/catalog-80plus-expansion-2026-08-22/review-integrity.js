const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dir = __dirname;
const inputs = Array.from({ length: 7 }, (_, index) =>
  `wave_${String(index + 1).padStart(2, '0')}_raw_research.json`
);
const products = inputs.flatMap((file) =>
  JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')).products
);
const passes = products.filter((product) =>
  ['verified_score_80plus', 'verified_score_80plus_company_pending'].includes(product.status)
);
const catalogText = fs.readFileSync(path.resolve(dir, '../../../products.js'), 'utf8');
const batchMarker = '  // ─── CATALOG 80+ EXPANSION 2026-08-22';
const nextMarker = '  // ─── STAPLE WAVE 2026-08-17';
const batchStart = catalogText.indexOf(batchMarker);
const batchEnd = batchStart < 0 ? -1 : catalogText.indexOf(nextMarker, batchStart);
const catalogWithoutThisBatch = batchStart >= 0 && batchEnd > batchStart
  ? `${catalogText.slice(0, batchStart)}${catalogText.slice(batchEnd)}`
  : catalogText;
const catalogBarcodes = [...catalogWithoutThisBatch.matchAll(/(?:barcode|['"]barcode['"])\s*:\s*['"](\d+)['"]/g)].map(
  (match) => match[1]
);
const companyText = fs.readFileSync(path.resolve(dir, '../../../companies.js'), 'utf8');

const normalize = (barcode) => barcode.replace(/^0+/, '');
const validUpcA = (barcode) => {
  if (!/^\d{12}$/.test(barcode)) return false;
  const digits = [...barcode].map(Number);
  const total = digits.slice(0, 11).reduce(
    (sum, digit, index) => sum + digit * (index % 2 === 0 ? 3 : 1),
    0
  );
  return (10 - (total % 10)) % 10 === digits[11];
};

const results = passes.map((product) => {
  const duplicateBarcodes = catalogBarcodes.filter(
    (barcode) => normalize(barcode) === normalize(product.barcode)
  );
  const companyExists = product.companyId
    ? companyText.includes(`'${product.companyId}': {`)
    : false;
  const completeNutrition = [
    'fat',
    'saturatedFat',
    'sodium',
    'carbs',
    'sugars',
    'protein',
  ].every((key) => Number.isFinite(product.nutrition?.[key]));
  return {
    barcode: product.barcode,
    name: product.name,
    category: product.category,
    score: product.scorePreview,
    upcValid: validUpcA(product.barcode),
    duplicateBarcodes,
    companyExists,
    companyPending: product.status === 'verified_score_80plus_company_pending',
    ingredientsComplete: Array.isArray(product.ingredients) && product.ingredients.length > 0,
    nutritionComplete: completeNutrition,
    sourcesComplete: Array.isArray(product.sources) && product.sources.length >= 2,
  };
});

const batch80PlusCounts = Object.fromEntries(
  Object.entries(Object.groupBy(results, (product) => product.category)).map(
    ([category, categoryProducts]) => [category, categoryProducts.length]
  )
);
const failures = results.filter((result) =>
  !result.upcValid ||
  result.duplicateBarcodes.length > 0 ||
  (!result.companyExists && !result.companyPending) ||
  !result.ingredientsComplete ||
  !result.nutritionComplete ||
  !result.sourcesComplete ||
  result.score < 80
);
const targetCategories = [...new Set(products.map((product) => product.category))];
const db = new DatabaseSync(path.resolve(dir, '../../../../../assets/db/products.db'), { readOnly: true });
const catalog80PlusCounts = Object.fromEntries(targetCategories.map((category) => [
  category,
  db.prepare('SELECT COUNT(1) AS count FROM products WHERE category = ? AND score >= 80')
    .get(category).count,
]));
const categoriesBelowFive = Object.entries(catalog80PlusCounts).filter(([, count]) => count < 5);
const generatedProducts = JSON.parse(
  fs.readFileSync(path.resolve(dir, '../../../products_generated.json'), 'utf8')
).products || [];
const generatedAliases = results.flatMap((result) =>
  generatedProducts
    .filter((product) => normalize(String(product.barcode || '')) === normalize(result.barcode))
    .map((product) => ({
      curatedBarcode: result.barcode,
      generatedBarcode: String(product.barcode),
      generatedName: product.name,
      resolution: 'manual SQLite catalog wins; leading-zero scans normalize to the curated 12-digit UPC',
    }))
);

console.log(JSON.stringify({
  passCount: results.length,
  batch80PlusCounts,
  catalog80PlusCounts,
  categoriesBelowFive,
  integrityFailures: failures,
  generatedAliases,
  companyPending: results.filter((result) => result.companyPending).map((result) => result.name),
}, null, 2));

if (failures.length || categoriesBelowFive.length) process.exitCode = 1;
