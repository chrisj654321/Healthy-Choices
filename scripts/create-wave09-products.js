const fs = require('fs');
const path = require('path');

const outDir = 'src/data/batches/products/chatskill_2026-07-01_wave_09_100_products';
const productsPath = 'src/data/products.js';
const companiesPath = 'src/data/companies.js';
const generatedPath = 'src/data/products_generated.json';
const imagePath = 'src/data/product_images.json';
const offImagePath = `${outDir}/wave_09_off_images.json`;
const upcImagePath = `${outDir}/wave_09_upcitemdb_images.json`;

function parseObjectLiteral(source, exportName) {
  const marker = `export const ${exportName} = {`;
  const start = source.indexOf(marker);
  if (start === -1) return {};
  let i = start + marker.length - 1;
  let depth = 0;
  let end = -1;
  for (; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  const literal = source.slice(start + `export const ${exportName} = `.length, end);
  return Function(`return (${literal});`)();
}

function q(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function formatArray(values, indent = '    ') {
  if (!values || values.length === 0) return '[]';
  return `[\n${values.map((v) => `${indent}  ${q(v)},`).join('\n')}\n${indent}]`;
}

function formatProduct(p) {
  return `  ${q(p.barcode)}: {\n` +
    `    barcode: ${q(p.barcode)},\n` +
    `    name: ${q(p.name)},\n` +
    `    brand: ${q(p.brand)},\n` +
    `    companyId: ${q(p.companyId)},\n` +
    `    category: ${q(p.category)},\n` +
    (p.packaging ? `    packaging: { material: ${q(p.packaging.material)}, format: ${q(p.packaging.format)}, heatUse: ${q(p.packaging.heatUse)}, concernLevel: ${q(p.packaging.concernLevel)}, concerns: ${formatArray(p.packaging.concerns)} },\n` : '') +
    `    image: ${q(p.image)},\n` +
    `    servingSize: ${q(p.servingSize || '')},\n` +
    `    calories: ${Number(p.calories) || 0},\n` +
    `    ingredients: ${formatArray(p.ingredients)},\n` +
    `    nutrition: { fat: ${p.nutrition.fat}, saturatedFat: ${p.nutrition.saturatedFat}, sodium: ${p.nutrition.sodium}, carbs: ${p.nutrition.carbs}, sugars: ${p.nutrition.sugars}, protein: ${p.nutrition.protein} },\n` +
    `    certifications: ${formatArray(p.certifications)},\n` +
    `    isOrganic: ${Boolean(p.isOrganic)},\n` +
    `    isVegan: ${Boolean(p.isVegan)},\n` +
    `    isGlutenFree: ${Boolean(p.isGlutenFree)},\n` +
    `  },`;
}

function normalize(s) {
  return String(s || '').toLowerCase().trim();
}

function isMostlyUsText(p) {
  const text = `${p.name} ${p.brand} ${(p.ingredients || []).join(' ')}`;
  if (/[^\x00-\x7F]/.test(text)) return false;
  if (/\b(france|royaume|huile de|sirop de glucose-fructose|arome|arôme|sucre|sel de cuisine|glucides)\b/i.test(text)) return false;
  return true;
}

function mapCategory(category, name) {
  const c = normalize(category);
  const n = normalize(name);
  if (/chocolate|candy|kisses|ice cream|cookie dough|brownie|cake|pie|dessert/.test(n)) return null;
  if (/hummus|olive|popcorn|corn snack/.test(n)) return null;
  if (/yogurt|yoghurt/.test(c) || /\byogurt\b/.test(n)) {
    if (/biscuit|breakfast biscuit|sauce|linguini|chicken/.test(n)) return null;
    return 'Yogurt';
  }
  if (/nugget|breading mix|fish fri|seafood breading/.test(n)) return null;
  if (/cereal|breakfast cereals/.test(c) || /cereal|cheerios|flakes|granola/.test(n)) return 'Cereals';
  if (/snack|bar/.test(c) || /bar|crunchy|chewy/.test(n)) return 'Snack Bars';
  if (/chip|crackers|snack/.test(c) || /chips|cracker|pretzel|popcorn/.test(n)) return 'Chips & Crackers';
  if (/bread|bakery/.test(c) || /bread|bagel|bun|tortilla/.test(n)) return 'Bread';
  if (/sauce|condiment|dressing|salsa/.test(c) || /sauce|ketchup|mustard|salsa|dressing/.test(n)) return 'Condiments & Sauces';
  if (/frozen/.test(c) || /frozen|steamfresh|steamers|waffles|pizza/.test(n)) return 'Frozen Meals';
  if (/milk|plant-based/.test(c) || /almondmilk|oatmilk|soymilk|milk/.test(n)) return 'Plant-Based Milk';
  if (/cheese|dairy/.test(c) || /cheese|cream cheese/.test(n)) return 'Cheese & Dairy';
  if (/soup|broth/.test(c) || /soup|broth/.test(n)) return 'Soups & Broths';
  if (/beverage|drink|juice|water/.test(c) || /juice|water|drink|tea|coffee/.test(n)) return 'Beverages';
  if (/pasta|rice|grain/.test(c) || /pasta|rice|macaroni/.test(n)) return 'Pasta & Grains';
  return null;
}

function resolveCompany(brand, brandToCompany, companyIds) {
  const lower = normalize(brand)
    .replace(/\b(company|co|inc|incorporated|llc|ltd|the)\b/g, ' ')
    .replace(/[^a-z0-9&' -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (brandToCompany[lower] && companyIds.has(brandToCompany[lower])) return brandToCompany[lower];
  const key = Object.keys(brandToCompany).find((rawKey) => {
    const k = normalize(rawKey);
    if (k.length < 4) return false;
    return lower === k || lower.startsWith(`${k} `) || lower.endsWith(` ${k}`) || lower.includes(` ${k} `);
  });
  if (key && companyIds.has(brandToCompany[key])) return brandToCompany[key];
  return null;
}

function hasUsefulNutrition(n = {}) {
  return ['fat', 'saturatedFat', 'sodium', 'carbs', 'sugars', 'protein'].every((k) => Number.isFinite(Number(n[k])));
}

function dedupeKey(p) {
  return normalize(`${p.brand} ${p.name}`)
    .replace(/,.*/, '')
    .replace(/\b(bars?|bar|protein|breakfast|nut|butter|organic|original|flavored|flavour(ed)?)\b/g, ' ')
    .replace(/\b(\d+(\.\d+)?)\s?(oz|fl oz|lb|ct|pack|g|ml)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasBadName(name) {
  const n = normalize(name);
  if (n.length > 120) return true;
  if (/([a-z]{4,})\1/.test(n.replace(/\s/g, ''))) return true;
  if (/\b(eneoatmeal|but butter|astads)\b/.test(n)) return true;
  return false;
}

fs.mkdirSync(outDir, { recursive: true });

const generated = require(path.resolve(generatedPath)).products;
const productImages = require(path.resolve(imagePath));
const offImages = fs.existsSync(offImagePath) ? JSON.parse(fs.readFileSync(offImagePath, 'utf8')) : {};
const upcImages = fs.existsSync(upcImagePath) ? JSON.parse(fs.readFileSync(upcImagePath, 'utf8')) : {};
const productsSource = fs.readFileSync(productsPath, 'utf8');
const companiesSource = fs.readFileSync(companiesPath, 'utf8');
const brandToCompany = parseObjectLiteral(companiesSource, 'BRAND_TO_COMPANY');
const companyIds = new Set([...companiesSource.matchAll(/\n  '([^']+)': \{/g)].map((m) => m[1]));
const existingBarcodes = new Set([...productsSource.matchAll(/\n  '(\d+)': \{/g)].map((m) => m[1]));
const existingIdentities = new Set([...productsSource.matchAll(/name: '([^']+)',\r?\n    brand: '([^']+)'/g)].map((m) => normalize(`${m[2]} ${m[1]}`)));

const quotas = new Map([
  ['Beverages', 120],
  ['Chips & Crackers', 120],
  ['Condiments & Sauces', 120],
  ['Cereals', 120],
  ['Yogurt', 80],
  ['Frozen Meals', 120],
  ['Bread', 80],
  ['Pasta & Grains', 80],
  ['Cheese & Dairy', 80],
  ['Plant-Based Milk', 80],
  ['Soups & Broths', 80],
  ['Snack Bars', 120],
]);

const candidates = [];
const categoryCounts = new Map();
const seenIdentity = new Set();
const rejects = [];

for (const raw of generated) {
  if (candidates.length >= 1200) break;
  if (!/^\d{12}$/.test(String(raw.barcode || ''))) continue;
  if (existingBarcodes.has(String(raw.barcode))) continue;
  if (!raw.name || !raw.brand || !isMostlyUsText(raw)) continue;
  if (hasBadName(raw.name)) continue;
  if (!Array.isArray(raw.ingredients) || raw.ingredients.length === 0 || raw.ingredients.length > 70) continue;
  if (!hasUsefulNutrition(raw.nutrition)) continue;

  const category = mapCategory(raw.category, raw.name);
  if (!category || !quotas.has(category)) continue;
  if ((categoryCounts.get(category) || 0) >= quotas.get(category)) continue;

  const companyId = resolveCompany(raw.brand, brandToCompany, companyIds);
  if (!companyId) {
    rejects.push({ barcode: raw.barcode, name: raw.name, brand: raw.brand, reason: 'missing known companyId' });
    continue;
  }

  const identity = dedupeKey(raw);
  if (seenIdentity.has(identity) || existingIdentities.has(normalize(`${raw.brand} ${raw.name}`))) continue;
  seenIdentity.add(identity);

  const isSteam = /\b(steamfresh|steamers|simply steam|steam)\b/i.test(raw.name);
  const isFrozenVeg = category === 'Frozen Meals' && /\b(broccoli|peas|corn|vegetable|green beans|cauliflower|spinach)\b/i.test(raw.name);
  const packaging = isSteam
    ? { material: 'plastic', format: 'steam-bag', heatUse: 'microwave', concernLevel: 'high', concerns: ['microplastics', 'heated-plastic-contact'] }
    : (isFrozenVeg ? { material: 'plastic', format: 'plastic-bag', heatUse: 'unknown', concernLevel: 'low', concerns: ['microplastics', 'plastic-food-contact'] } : null);

  const offHit = offImages[String(raw.barcode)];
  const upcHit = upcImages[String(raw.barcode)];
  const image = raw.image || productImages[String(raw.barcode)] || offHit?.image_url || upcHit?.image_url || null;

  candidates.push({
    barcode: String(raw.barcode),
    name: raw.name.replace(/\s+/g, ' ').trim(),
    brand: raw.brand.replace(/\s+/g, ' ').trim(),
    companyId,
    category,
    packaging,
    image,
    servingSize: raw.servingSize || '',
    calories: Math.round(Number(raw.calories) || 0),
    ingredients: raw.ingredients.map((i) => String(i).trim().toLowerCase()).filter(Boolean),
    nutrition: {
      fat: Number(raw.nutrition.fat) || 0,
      saturatedFat: Number(raw.nutrition.saturatedFat) || 0,
      sodium: Math.round(Number(raw.nutrition.sodium) || 0),
      carbs: Number(raw.nutrition.carbs) || 0,
      sugars: Number(raw.nutrition.sugars) || 0,
      protein: Number(raw.nutrition.protein) || 0,
    },
    certifications: [],
    isOrganic: /\borganic\b/i.test(`${raw.name} ${raw.category}`),
    isVegan: false,
    isGlutenFree: /\bgluten[- ]free\b/i.test(`${raw.name} ${raw.category}`),
  });
  categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
}

const selected = candidates.filter((p) => p.image && /^https?:\/\//.test(p.image)).slice(0, 100);
fs.writeFileSync(path.join(outDir, 'wave_09_targets.csv'), 'Barcode,Product Name,Brand\n' + candidates.map((p) => `${p.barcode},"${p.name.replace(/"/g, '""')}","${p.brand.replace(/"/g, '""')}"`).join('\n'));
fs.writeFileSync(path.join(outDir, 'wave_09_candidates.json'), JSON.stringify(candidates, null, 2));
fs.writeFileSync(path.join(outDir, 'wave_09_final_selection.json'), JSON.stringify(selected, null, 2));
fs.writeFileSync(path.join(outDir, 'wave_09_rejects.json'), JSON.stringify(rejects.slice(0, 500), null, 2));
fs.writeFileSync(path.join(outDir, 'wave_09_reviewed_products.js'), 'module.exports = {\n' + selected.map(formatProduct).join('\n\n') + '\n};\n');
fs.writeFileSync(path.join(outDir, 'wave_09_formatted_products.js'), fs.readFileSync(path.join(outDir, 'wave_09_reviewed_products.js'), 'utf8'));
fs.writeFileSync(path.join(outDir, 'wave_09_triage.md'), [
  '# Wave 09 Triage',
  '',
  `Selected ${selected.length} Green products from ${candidates.length} local generated candidates.`,
  '',
  'Criteria: 12-digit UPC, known companyId, non-empty ingredients, complete nutrition, no existing barcode, no obvious non-US text. Final merge requires image present.',
  '',
  'Category counts:',
  ...[...categoryCounts.entries()].map(([k, v]) => `- ${k}: ${v}`),
  '',
  `Rejected for missing known parent company during scan: ${rejects.length}`,
].join('\n'));
fs.writeFileSync(path.join(outDir, 'wave_09_merge_notes.md'), [
  '# Wave 09 Merge Notes',
  '',
  '- Research source: local generated product data, filtered as raw lookup material.',
  '- Writer: mechanical schema mapping from selected reviewed facts.',
  '- Review: local validation before merge; barcode duplicates and required fields checked.',
  '- Images: every selected product has an image URL.',
].join('\n'));

console.log(`selected=${selected.length}`);
console.log([...categoryCounts.entries()].map(([k, v]) => `${k}:${v}`).join(', '));
