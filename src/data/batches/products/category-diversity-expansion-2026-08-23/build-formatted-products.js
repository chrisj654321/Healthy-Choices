const fs = require('node:fs');
const path = require('node:path');

const dir = __dirname;
const wave1 = JSON.parse(fs.readFileSync(path.join(dir, 'wave_01_raw_research.json'), 'utf8'));
const wave2 = JSON.parse(fs.readFileSync(path.join(dir, 'wave_02_raw_research.json'), 'utf8'));
const photoReview = JSON.parse(fs.readFileSync(path.join(dir, 'photo_review.json'), 'utf8'));

const selectedBarcodes = [
  '191011000872', // JUST Egg
  '810012620185', // Strong Roots
  '856017003813', // Birch Benders
  '075947401555', // Mr. Dell's
  '073416045378', // Lundberg
  '812446030004', // A Dozen Cousins
  '024182002249', // Eden Foods
  '085239190326', // Good & Gather
  '093966009545', // Organic Valley
  '046100353394', // Sargento
  '860006229603', // Little Sesame
  '852537005412', // Base Culture
  '850053830099', // Seven Sundays
  '859480006077', // Safe Catch
  '070303022061', // Season Brand
  '850014634414', // Bonafide Provisions
  '024000241133', // College Inn
];

const researched = [...wave1.products, ...wave2.products];
const byBarcode = new Map(researched.map((product) => [product.barcode, product]));

const mestemacher = {
  barcode: '084213000729',
  name: 'Mestemacher Whole Rye Bread',
  brand: 'Mestemacher',
  companyId: 'mestemacher',
  category: 'Bread',
  servingSize: '1 piece (72g)',
  calories: 180,
  ingredients: ['whole kernel rye', 'water', 'wholemeal rye flour', 'salt', 'oat fiber', 'yeast'],
  nutrition: { fat: 1, saturatedFat: 0, sodium: 270, carbs: 40, sugars: 2, protein: 4 },
  certifications: ['Kosher', 'No Preservatives'],
  isOrganic: false,
  isVegan: true,
  isGlutenFree: false,
};

byBarcode.set(mestemacher.barcode, mestemacher);
selectedBarcodes.push(mestemacher.barcode);

const companyOverrides = {
  '812446030004': 'verde-valle-foods',
  '850014634414': 'blount-fine-foods',
  '024000241133': 'b-and-g-foods',
};

const formatted = {};
for (const barcode of selectedBarcodes) {
  const product = byBarcode.get(barcode);
  if (!product) throw new Error(`Missing selected research product ${barcode}`);
  const photo = photoReview[barcode];
  if (!photo || photo.review !== 'pass' || !photo.image_url) {
    throw new Error(`Missing approved exact-variant photo for ${barcode} ${product.name}`);
  }
  formatted[barcode] = {
    barcode,
    name: product.name,
    brand: product.brand,
    companyId: companyOverrides[barcode] || product.companyId,
    category: product.category,
    image: photo.image_url,
    servingSize: product.servingSize,
    calories: product.calories,
    ingredients: product.ingredients,
    nutrition: product.nutrition,
    certifications: product.certifications || [],
    isOrganic: product.isOrganic === true,
    isVegan: product.isVegan === true,
    isGlutenFree: product.isGlutenFree === true,
  };
}

fs.writeFileSync(
  path.join(dir, 'formatted_products.js'),
  `const CATEGORY_DIVERSITY_EXPANSION_2026_08_23 = ${JSON.stringify(formatted, null, 2)};\n\nmodule.exports = CATEGORY_DIVERSITY_EXPANSION_2026_08_23;\n`
);

console.log(`Formatted ${Object.keys(formatted).length} selected products.`);
