const fs = require('fs');
const path = require('path');

const dir = __dirname;
const statuses = new Set([
  'verified_score_80plus',
  'verified_score_80plus_company_pending',
  'verified_catalog_addition_below_target',
]);
const products = Array.from({ length: 7 }, (_, index) =>
  JSON.parse(fs.readFileSync(path.join(dir, `wave_${String(index + 1).padStart(2, '0')}_raw_research.json`), 'utf8'))
).flatMap((wave) => wave.products.filter((product) => statuses.has(product.status)));

const off = JSON.parse(fs.readFileSync(path.join(dir, 'off_images.json'), 'utf8'));
const fallback = JSON.parse(fs.readFileSync(path.join(dir, 'fallback_images.json'), 'utf8'));
const retailer = JSON.parse(fs.readFileSync(path.join(dir, 'retailer_image_candidates.json'), 'utf8'));

const images = {};
for (const product of products) {
  const barcode = product.barcode;
  const candidate =
    (retailer[barcode]?.review === 'pass' && retailer[barcode]) ||
    (fallback[barcode]?.image_url && fallback[barcode]) ||
    (off[barcode]?.image_url && off[barcode]);
  if (!candidate?.image_url) throw new Error(`Missing approved image: ${barcode} ${product.name}`);
  images[barcode] = {
    image_url: candidate.image_url,
    source: candidate.source,
    matched_name: candidate.matched_name || product.name,
    page_url: candidate.page_url || null,
    review: candidate.review || 'barcode_name_match',
  };
}

const foodForLife = (product) => product.brand.toLowerCase() === 'food for life';
const wildway = (product) => product.brand === 'Wildway';
const plantCreamer = (product) => ['Forager Project', 'MALK Organics', 'Elmhurst 1925'].includes(product.brand);
const avocadoOrHummus = (product) => ['Wholly Avocado', 'Wholly Guacamole', "Cedar's"].includes(product.brand);

function dietaryFields(product) {
  const saffronRoad = product.brand === 'Saffron Road';
  const saffronGlutenFree = saffronRoad && !product.name.includes('Hatch Chile Chicken Pesto');
  const organicByLabel = foodForLife(product) || /\bOrganic\b/i.test(product.name);
  const vegan =
    foodForLife(product) || wildway(product) || plantCreamer(product) ||
    avocadoOrHummus(product) ||
    product.name === "Amy's Light in Sodium Brown Rice & Vegetables Bowl" ||
    product.name === 'Saffron Road Vegetable Biryani';
  const glutenFree =
    wildway(product) || plantCreamer(product) || avocadoOrHummus(product) ||
    product.brand === 'Organic Valley' || product.brand === 'Horizon Organic' ||
    product.name === "Amy's Light in Sodium Brown Rice & Vegetables Bowl" ||
    saffronGlutenFree;
  const certifications = [];
  if (organicByLabel) certifications.push('USDA Organic');
  if (saffronRoad) {
    certifications.push(
      'Halal',
      product.name === 'Saffron Road Vegetable Biryani'
        ? 'Seed Oil Free Self Claim'
        : 'Seed Oil Free Certified'
    );
  }
  if (saffronGlutenFree) certifications.push('Certified Gluten-Free');
  return { certifications, isOrganic: organicByLabel, isVegan: vegan, isGlutenFree: glutenFree };
}

const formatted = Object.fromEntries(products.map((product) => [
  product.barcode,
  {
    barcode: product.barcode,
    name: product.name,
    brand: product.brand,
    companyId: product.companyId,
    category: product.category,
    image: images[product.barcode].image_url,
    servingSize: product.servingSize,
    calories: product.calories,
    ingredients: product.ingredients,
    nutrition: product.nutrition,
    ...dietaryFields(product),
  },
]));

if (Object.keys(formatted).length !== 30) throw new Error(`Expected 30 products, got ${Object.keys(formatted).length}`);
fs.writeFileSync(path.join(dir, 'approved_images.json'), `${JSON.stringify(images, null, 2)}\n`);
fs.writeFileSync(
  path.join(dir, 'catalog_80plus_expansion_formatted.js'),
  `const CATALOG_80PLUS_EXPANSION_2026_08_22 = ${JSON.stringify(formatted, null, 2)};\n\nmodule.exports = CATALOG_80PLUS_EXPANSION_2026_08_22;\n`
);
console.log(`Formatted ${Object.keys(formatted).length} products with ${Object.keys(images).length} approved images.`);
