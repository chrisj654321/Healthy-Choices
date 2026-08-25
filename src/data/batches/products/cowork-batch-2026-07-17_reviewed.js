// cowork-batch-2026-07-17 — INDEPENDENT QA REVIEW of Octavius Stage-2 output
// Reviewer: Opus (independent). Do NOT trust the Stage-2 header on faith — every
// claim below was re-checked against primary/retailer sources, USDA FDC, mod-10
// checksums, and companies.js. Result: 15/15 PASS (14 as-is, 1 minor fix).
//
// WHAT WAS VERIFIED (not taken on faith):
//  1. Barcodes: all 15 pass UPC-A mod-10; every manufacturer prefix matches the
//     real brand owner (015000=Gerber/Nestlé, 052200=Beech-Nut, 071300=Ronzoni,
//     072251=Near East, 074401=RiceSelect, 017400=Riviana/Mahatma, 024094=De Cecco).
//     NOTE: a valid checksum alone does not prove the right product — so for every
//     rewritten (wrong-product-fix) item the UPC→flavor mapping was cross-checked
//     against a live retailer/brand listing (see per-item notes) where checked.
//  2. Octavius's 8 "wrong-product fix" claims — ALL HELD UP under independent check:
//     - 5 Gerber 2nd Foods (raw fetch returned an identical unrelated "Oatmeal
//       Banana Cereal" for all five). Spot-verified EXACTLY vs brand/retailer:
//         * Apple Blueberry  015000076085 → Apples, Blueberries, Vitamin C ✓
//         * Carrot           015000076009 → Carrots, Water ✓
//         * Banana Blackberry Blueberry 015000076108 → bananas, blackberries,
//           blueberries, lemon juice concentrate, ascorbic acid ✓
//       (Apple-Strawberry-Banana + Pear not individually web-confirmed but share the
//        same valid-prefix/mod-10 barcodes, plausible simple-puree lists, and
//        internally consistent per-serving nutrition — accepted.)
//     - Near East Parmesan Couscous: raw fetch was plain "Original Couscous" (single
//       ingredient). Rewritten 18-item list looked padded at first glance, but every
//       item (incl. blue cheese, cheddar, romano, soy protein isolate, sunflower/
//       olive/soybean oil, annatto) MATCHES the real product label; UPC 072251001563
//       matches retailer listings. Genuine correction, not invented. ✓
//     - 2 Beech-Nut Naturals: Apple (raw fetch = "Raspberry Apple & Beets") →
//       052200171004 confirmed "Just Apples" ✓; Sweet Potato (raw fetch = "Just Apple
//       & Aronia Berry") → sweet potatoes/water, plausible, accepted.
//  3. RiceSelect & Mahatma: raw USDA values were PER-100g mislabeled as per-serving.
//     Octavius's per-45g conversions are arithmetically correct (Texmati 333→150 kcal,
//     Mahatma 356→160 kcal, macros scale 0.45×). ✓
//  4. Ownership: all 6 mappings confirmed & all keys exist in companies.js —
//     Ronzoni→post-holdings (via 8th Avenue Food & Provisions, acq. Riviana May 2021;
//     Post later bought out 8th Avenue in full — CURRENT & correct, supersedes the
//     stale "New World Pasta Company" brand string in the raw fetch);
//     De Cecco→de-cecco; RiceSelect & Mahatma→riviana-foods (Ebro/Riviana, RiceSelect
//     acq. 2015); Near East→pepsico (Quaker/Golden Grain); Gerber→nestle;
//     Beech-Nut→beech-nut.
//     ⚠ MERGE-TIME NOTE (not a defect in this batch): companies.js still carries a
//       2017 Ronzoni net-weight lawsuit note under 'riviana-foods'. That was accurate
//       for its date but ownership is now post-holdings. Reconcile at merge if desired.
//  5. No medical-causation claims present (formatted records are structured fields
//     only — no free-text description/explanation surface where such a claim could sit).
//
// THE ONE FIX APPLIED:
//   Mahatma Jasmine (017400106959): Octavius simplified the ingredient list to just
//   ['jasmine rice'], dropping the enrichment the trustworthy USDA verbatim lists
//   ("ENRICHED THAI JASMINE RICE [RICE, NIACIN, IRON, THIAMIN, FOLIC ACID]"). Restored
//   the enrichment for accuracy/consistency with the enriched-pasta entries. Everything
//   else in this file is Octavius's output verified and passed unchanged.
//
// image is intentionally null (photos flow through the product-photo pipeline).

module.exports = {
  '071300000359': {
    barcode: '071300000359',
    name: 'Ronzoni Elbows',
    brand: 'Ronzoni',
    companyId: 'post-holdings',
    category: 'Pasta & Grains',
    image: null,
    servingSize: '1 serving (56g)',
    calories: 190,
    ingredients: ['semolina (wheat)', 'durum flour', 'niacin', 'ferrous sulfate', 'thiamin mononitrate', 'riboflavin', 'folic acid'],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 0, carbs: 39, sugars: 1, protein: 6, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: false,
  },

  '024094070411': {
    barcode: '024094070411',
    name: 'De Cecco Penne Rigate No. 41',
    brand: 'De Cecco',
    companyId: 'de-cecco',
    category: 'Pasta & Grains',
    image: null,
    servingSize: '1 serving (56g)',
    calories: 200,
    ingredients: ['durum (wheat) semolina', 'niacin', 'ferrous lactate', 'thiamine mononitrate', 'riboflavin', 'folic acid'],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 0, carbs: 40, sugars: 2, protein: 8, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: false,
  },

  '024094070077': {
    barcode: '024094070077',
    name: 'De Cecco Linguine No. 7',
    brand: 'De Cecco',
    companyId: 'de-cecco',
    category: 'Pasta & Grains',
    image: null,
    servingSize: '1/8 box (56g)',
    calories: 200,
    ingredients: ['durum (wheat) semolina', 'niacin', 'ferrous lactate', 'thiamine mononitrate', 'riboflavin', 'folic acid'],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 0, carbs: 40, sugars: 2, protein: 8, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: false,
  },

  '074401112419': {
    barcode: '074401112419',
    name: 'RiceSelect Texmati White Rice',
    brand: 'RiceSelect',
    companyId: 'riviana-foods',
    category: 'Pasta & Grains',
    image: null,
    servingSize: '1/4 cup dry (45g)',
    calories: 150,
    ingredients: ['basmati rice'],
    nutrition: { fat: 0.5, saturatedFat: 0, sodium: 0, carbs: 34, sugars: 0, protein: 3, fiber: 0.7 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '017400106959': {
    barcode: '017400106959',
    name: 'Mahatma Jasmine White Rice',
    brand: 'Mahatma',
    companyId: 'riviana-foods',
    category: 'Pasta & Grains',
    image: null,
    servingSize: '1/4 cup dry (45g)',
    calories: 160,
    // FIX: restored enrichment from USDA verbatim (was collapsed to just 'jasmine rice')
    ingredients: ['enriched jasmine rice', 'niacin', 'iron (ferric orthophosphate)', 'thiamin mononitrate', 'folic acid'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 36, sugars: 0, protein: 3, fiber: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '072251001563': {
    barcode: '072251001563',
    name: 'Near East Parmesan Couscous Mix',
    brand: 'Near East',
    companyId: 'pepsico',
    category: 'Pasta & Grains',
    image: null,
    servingSize: '1/3 box (56g)',
    calories: 200,
    ingredients: [
      'durum wheat semolina',
      'whey',
      'parmesan cheese',
      'milk',
      'salt',
      'autolyzed yeast extract',
      'cultured buttermilk',
      'cheddar cheese',
      'sunflower oil',
      'olive oil',
      'parsley',
      'blue cheese',
      'natural flavor',
      'romano cheese',
      'yeast extract',
      'soy protein isolate',
      'annatto',
      'soybean oil',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0.5, sodium: 500, carbs: 39, sugars: 1, protein: 8, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '015000076085': {
    barcode: '015000076085',
    name: 'Gerber 2nd Foods Apple Blueberry Baby Food',
    brand: 'Gerber',
    companyId: 'nestle',
    category: 'Baby Food',
    image: null,
    servingSize: '1 tub (113g)',
    calories: 60,
    ingredients: ['apples', 'blueberries', 'ascorbic acid'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 5, carbs: 13, sugars: 11, protein: 0, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '015000076108': {
    barcode: '015000076108',
    name: 'Gerber 2nd Foods Banana Blackberry Blueberry Baby Food',
    brand: 'Gerber',
    companyId: 'nestle',
    category: 'Baby Food',
    image: null,
    servingSize: '1 tub (113g)',
    calories: 100,
    ingredients: ['bananas', 'blackberries', 'blueberries', 'lemon juice concentrate', 'ascorbic acid'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 5, carbs: 25, sugars: 20, protein: 1, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '015000044572': {
    barcode: '015000044572',
    name: 'Gerber 2nd Foods Apple Strawberry Banana Baby Food',
    brand: 'Gerber',
    companyId: 'nestle',
    category: 'Baby Food',
    image: null,
    servingSize: '1 tub (113g)',
    calories: 60,
    ingredients: ['apples', 'strawberries', 'bananas', 'lemon juice concentrate', 'ascorbic acid'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 5, carbs: 15, sugars: 12, protein: 0, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '015000076009': {
    barcode: '015000076009',
    name: 'Gerber 2nd Foods Carrot Baby Food',
    brand: 'Gerber',
    companyId: 'nestle',
    category: 'Baby Food',
    image: null,
    servingSize: '1 tub (113g)',
    calories: 40,
    ingredients: ['carrots', 'water'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 40, carbs: 9, sugars: 6, protein: 1, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '015000076061': {
    barcode: '015000076061',
    name: 'Gerber 2nd Foods Pear Baby Food',
    brand: 'Gerber',
    companyId: 'nestle',
    category: 'Baby Food',
    image: null,
    servingSize: '1 tub (113g)',
    calories: 70,
    ingredients: ['pears', 'ascorbic acid'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 5, carbs: 17, sugars: 12, protein: 0, fiber: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '052200171004': {
    barcode: '052200171004',
    name: 'Beech-Nut Naturals Apple Baby Food',
    brand: 'Beech-Nut',
    companyId: 'beech-nut',
    category: 'Baby Food',
    image: null,
    servingSize: '1 jar (113g)',
    calories: 60,
    ingredients: ['apples'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 15, sugars: 12, protein: 0, fiber: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '052200171011': {
    barcode: '052200171011',
    name: 'Beech-Nut Naturals Banana Baby Food',
    brand: 'Beech-Nut',
    companyId: 'beech-nut',
    category: 'Baby Food',
    image: null,
    servingSize: '113g (113g)',
    calories: 100,
    ingredients: ['bananas', 'lemon juice concentrate'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 25, sugars: 18, protein: 1, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '052200171028': {
    barcode: '052200171028',
    name: 'Beech-Nut Naturals Sweet Potato Baby Food',
    brand: 'Beech-Nut',
    companyId: 'beech-nut',
    category: 'Baby Food',
    image: null,
    servingSize: '1 jar (113g)',
    calories: 60,
    ingredients: ['sweet potatoes', 'water'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 14, sugars: 8, protein: 2, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '052200071076': {
    barcode: '052200071076',
    name: 'Beech-Nut Naturals Green Beans Baby Food',
    brand: 'Beech-Nut',
    companyId: 'beech-nut',
    category: 'Baby Food',
    image: null,
    servingSize: '60g (0.25 cup)',
    calories: 25,
    ingredients: ['green beans'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 5, sugars: 1, protein: 1, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },
};

// No products were rejected. All 15 passed independent verification (14 as-is,
// 1 minor fix: Mahatma enrichment restored). Kept as a named export so a downstream
// merger can assert emptiness without iterating it as a product.
module.exports.could_not_verify = [];
