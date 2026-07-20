// cowork-batch-2026-07-18 — Independent QA review of Octavius Stage-2 output
// Reviewer: Opus (independent). Source-of-truth check against
// cowork-batch-2026-07-18_fetched.json + independent plausibility/checksum checks.
//
// Method: every UPC-A below was mod-10 recomputed by the reviewer (all 12 in the
// Stage-2 output pass). Three barcodes are additionally cross-confirmed by the
// fetched.json OFF `matched_off_code` (041271019650, 041271021448, 818290016935).
// Ingredient lists were compared to the verbatim source where a trustworthy one
// exists; nutrition was sanity-checked for internal consistency by product type.
// No medical-causation claims are present in any record (pure data rows).
//
// RESULT: 9 PASS as-is, 1 PASS-with-fix, 5 could_not_verify/rejected. See bottom.

module.exports = {
  // --- PASS as-is -----------------------------------------------------------

  // Beech-Nut Naturals Butternut Squash. Fetched match was a wrong USDA record
  // ("Apple & Aronia Berry"); researcher re-derived. Single-ingredient veg purée
  // is internally plausible; barcode mod-10 valid. Lowest-confidence PASS in the
  // batch (no verbatim source to diff against) but nothing implausible/fabricated.
  '052200171059': {
    barcode: '052200171059',
    name: 'Beech-Nut Naturals Butternut Squash Baby Food',
    brand: 'Beech-Nut',
    companyId: 'beech-nut',
    category: 'Baby Food',
    image: null,
    servingSize: '1 jar (113g)',
    calories: 35,
    ingredients: ['butternut squash'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 8, sugars: 3, protein: 1, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  // Coffee-Mate Café Mocha. Ingredients match fetched USDA verbatim (order + set);
  // only the "(not a source of lactose)" parenthetical and the "Contains" line were
  // dropped, which is normal parsing. Nutrition matches. Nestlé = correct owner.
  '050000421169': {
    barcode: '050000421169',
    name: 'Coffee-Mate Café Mocha Liquid Coffee Creamer 16oz',
    brand: 'Coffee-Mate',
    companyId: 'nestle',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 35,
    ingredients: [
      'water',
      'sugar',
      'vegetable oil (high oleic soybean and/or high oleic canola)',
      'micellar casein (a milk derivative)',
      'cocoa processed with alkali',
      'mono- and diglycerides',
      'dipotassium phosphate',
      'natural and artificial flavor',
      'cellulose gel',
      'cellulose gum',
      'carrageenan',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0, sodium: 5, carbs: 5, sugars: 5, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  // Coffee-Mate Cinnamon Vanilla Crème. Ingredients match fetched USDA verbatim;
  // saturatedFat filled 0 (fetched null) — consistent with a 35-cal creamer. PASS.
  '050000512775': {
    barcode: '050000512775',
    name: 'Coffee-Mate Cinnamon Vanilla Crème Liquid Coffee Creamer 32oz',
    brand: 'Coffee-Mate',
    companyId: 'nestle',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 35,
    ingredients: [
      'water',
      'sugar',
      'vegetable oil (high oleic soybean and/or high oleic canola)',
      'micellar casein (a milk derivative)',
      'mono- and diglycerides',
      'dipotassium phosphate',
      'natural and artificial flavor',
      'cellulose gel',
      'cellulose gum',
      'carrageenan',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0, sodium: 5, carbs: 5, sugars: 5, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  // Coffee-Mate Vanilla Caramel. Ingredients match fetched verbatim incl. 'salt' in
  // position; sodium 15 matches fetched. PASS.
  '050000112340': {
    barcode: '050000112340',
    name: 'Coffee-Mate Vanilla Caramel Liquid Coffee Creamer 32oz',
    brand: 'Coffee-Mate',
    companyId: 'nestle',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 35,
    ingredients: [
      'water',
      'sugar',
      'vegetable oil (high oleic soybean and/or high oleic canola)',
      'micellar casein (a milk derivative)',
      'mono- and diglycerides',
      'dipotassium phosphate',
      'salt',
      'natural and artificial flavor',
      'cellulose gel',
      'cellulose gum',
      'carrageenan',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0, sodium: 15, carbs: 5, sugars: 5, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  // Coffee-Mate SNICKERS. Ingredients match the fetched USDA ingredient blob
  // (order preserved); sodium 20 matches. PASS.
  '050000899845': {
    barcode: '050000899845',
    name: 'Coffee-Mate SNICKERS Liquid Coffee Creamer 32oz',
    brand: 'Coffee-Mate',
    companyId: 'nestle',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 35,
    ingredients: [
      'water',
      'sugar',
      'vegetable oil (high oleic soybean and/or high oleic canola)',
      'micellar casein (a milk derivative)',
      'natural and artificial flavor',
      'cocoa processed with alkali',
      'mono- and diglycerides',
      'dipotassium phosphate',
      'salt',
      'cellulose gel',
      'cellulose gum',
      'carrageenan',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0, sodium: 20, carbs: 5, sugars: 5, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  // International Delight Irish Crème. Barcode 041271019650 cross-confirmed by
  // fetched OFF matched_off_code. Ingredients match OFF verbatim. Danone = correct
  // owner. Nutrition: researcher corrected the OFF panel (OFF listed sodium 0mg,
  // implausible for a creamer) to sodium 10 / sat 0.5 — a defensible re-derivation.
  '041271019650': {
    barcode: '041271019650',
    name: 'International Delight Irish Crème Coffee Creamer 32oz',
    brand: 'International Delight',
    companyId: 'danone',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 35,
    ingredients: [
      'water',
      'cane sugar',
      'palm oil',
      'sodium caseinate (a milk derivative)',
      'dipotassium phosphate',
      'natural and artificial flavors',
      'mono and diglycerides',
      'sodium stearoyl lactylate',
      'polysorbate 60',
      'carrageenan',
      'salt',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0.5, sodium: 10, carbs: 5, sugars: 5, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  // --- PASS after minor reviewer fix ---------------------------------------

  // International Delight Southern Butter Pecan. Barcode 041271021448 cross-confirmed
  // by fetched OFF matched_off_code. FIX: the Stage-2 list DROPPED 'polysorbate 60',
  // which IS present in the barcode-confirmed OFF verbatim source
  // ("...sodium stearoyl lactylate, polysorbate 60, carrageenan"). Reviewer
  // reinserted it before 'carrageenan' to match the verbatim source.
  '041271021448': {
    barcode: '041271021448',
    name: 'International Delight Southern Butter Pecan Coffee Creamer 32oz',
    brand: 'International Delight',
    companyId: 'danone',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 35,
    ingredients: [
      'water',
      'cane sugar',
      'palm oil',
      'sodium caseinate (a milk derivative)',
      'dipotassium phosphate',
      'natural and artificial flavors',
      'mono and diglycerides',
      'sodium stearoyl lactylate',
      'polysorbate 60', // reviewer fix: restored, present in barcode-confirmed OFF source
      'carrageenan',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0.5, sodium: 10, carbs: 5, sugars: 5, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  // --- PASS as-is (continued) ----------------------------------------------

  // International Delight Zero Sugar Caramel Macchiato. Fetched USDA match was the
  // wrong variant (regular, contained 'Sugar', calories null). Researcher re-derived
  // a zero-sugar formulation (maltodextrin/sucralose/acesulfame potassium, no sugar)
  // that is internally consistent with a 15-cal / 0g-sugar product. Barcode mod-10
  // valid. No implausible/invented ingredient. PASS (re-researched; no clean verbatim).
  '041271022537': {
    barcode: '041271022537',
    name: 'International Delight Zero Sugar Caramel Macchiato Coffee Creamer 32oz',
    brand: 'International Delight',
    companyId: 'danone',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 15,
    ingredients: [
      'water',
      'palm oil',
      'maltodextrin',
      'sodium caseinate (a milk derivative)',
      'dipotassium phosphate',
      'sodium stearoyl lactylate',
      'mono and diglycerides',
      'carrageenan',
      'polysorbate 60',
      'sucralose',
      'gellan gum',
      'acesulfame potassium',
      'natural and artificial flavors',
    ],
    nutrition: { fat: 1, saturatedFat: 0.5, sodium: 0, carbs: 0.5, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  // Chobani Sweet Cream. Fetched USDA match was the wrong flavor ("Pumpkin") but its
  // generic dairy ingredient set (Milk, Cream, Cane Sugar, Natural Flavors) matches
  // the Sweet Cream product; barcode 818290016928 mod-10 valid, sibling of the
  // OFF-confirmed Vanilla (…935). Nutrition consistent with a dairy creamer. PASS.
  '818290016928': {
    barcode: '818290016928',
    name: 'Chobani Sweet Cream Coffee Creamer 24oz',
    brand: 'Chobani',
    companyId: 'chobani',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 35,
    ingredients: ['milk', 'cream', 'cane sugar', 'natural flavors'],
    nutrition: { fat: 1.5, saturatedFat: 1, sodium: 10, carbs: 5, sugars: 5, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  // Chobani Vanilla. Barcode 818290016935 AND ingredients cross-confirmed by fetched
  // OFF record (also has a real product photo). Exact verbatim match. PASS.
  '818290016935': {
    barcode: '818290016935',
    name: 'Chobani Vanilla Coffee Creamer',
    brand: 'Chobani',
    companyId: 'chobani',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 35,
    ingredients: ['milk', 'cream', 'cane sugar', 'natural flavors', 'vanilla extract'],
    nutrition: { fat: 1.5, saturatedFat: 1, sodium: 10, carbs: 5, sugars: 5, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },
};

// ---------------------------------------------------------------------------
// could_not_verify / rejected — DO NOT MERGE
// ---------------------------------------------------------------------------
module.exports.could_not_verify = [
  {
    key: '050000145782',
    name: 'Coffee-Mate Zero Sugar Italian Sweet Crème Liquid Coffee Creamer 32oz',
    reason:
      'REJECT — DUPLICATE. This UPC already exists in src/data/products.js as ' +
      "'0050000145782' (name 'Italian Sweet Creme', brand Nestlé, companyId nestle, " +
      'same 15-cal zero-sugar formulation, zero-padded to 13 digits). Merging would ' +
      'create a duplicate product. Barcode itself is mod-10 valid and the data is ' +
      'otherwise fine — the problem is collision with an existing record, not quality.',
  },
  {
    key: '041271028478',
    name: "International Delight REESE'S Peanut Butter Cup Coffee Creamer 32oz",
    reason:
      'COULD NOT VERIFY. The only Stage-1 source for this item was a known-bad USDA ' +
      "match (brand 'HOSTESS', 233 kcal/15ml, no cocoa) that the researcher correctly " +
      "rejected. The Stage-2 list then ADDS 'cocoa processed with alkali' (a specific " +
      'ingredient present in no source I can check). It is a plausible inference for a ' +
      'chocolate-flavored creamer, but with no verifiable verbatim label and no ' +
      'barcode cross-confirmation, the added ingredient cannot be confirmed vs ' +
      'fabricated. Barcode 041271028478 is mod-10 valid but checksum alone does not ' +
      'prove product identity. Hold for a confirmed label before merging.',
  },
  {
    key: 'beech-nut-naturals-pear-blueberry-baby-food',
    name: 'Beech-Nut Naturals Pear & Blueberry Baby Food',
    reason:
      'COULD NOT VERIFY. Excluded by researcher from Stage-2 (fetched.json resolved it ' +
      "to an unrelated USDA record, 'Just Apple & Aronia Berry'). No trustworthy " +
      'ingredient/nutrition/barcode record was produced. A candidate photo + UPC ' +
      '(052200172018, mod-10 valid) was located but the full data row was not ' +
      'completed. Not independently verifiable here.',
  },
  {
    key: 'earth-s-best-organic-stage-2-apple-blueberry-oat',
    name: "Earth's Best Organic Stage 2 Apple Blueberry Oatmeal",
    reason:
      'COULD NOT VERIFY. fetched.json resolved this to an unrelated USDA record ' +
      "('Earth's Best Organic Carrots Stage 2'). Researcher could not resolve it to a " +
      'trustworthy record; no Stage-2 row produced. Not independently verifiable here.',
  },
  {
    key: 'earth-s-best-organic-stage-2-carrots-broccoli',
    name: "Earth's Best Organic Stage 2 Carrots & Broccoli",
    reason:
      'COULD NOT VERIFY. Same failure mode — fetched.json resolved it to the same ' +
      "unrelated 'Carrots Stage 2' USDA record. No trustworthy Stage-2 row produced. " +
      'Not independently verifiable here.',
  },
];

// Photo notes carried forward (photos flow through product_images.json, not here):
// - Chobani Vanilla (818290016935): confirmed front-of-pack image on OFF.
// - Beech-Nut Pear & Blueberries (052200172018, could_not_verify): candidate photo
//   on beechnut.com, but the data row itself remains unverified.
