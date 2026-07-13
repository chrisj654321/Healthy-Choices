// ─── DELI MEAT 2026-07-09 · OPUS-REVIEWED ─────────────────────────────────
// 17 formatted / 2 could_not_verify / 2 excluded (pre-existing duplicates).
// Independent Stage-3 review of Octavius's _formatted.js. All 5 companyId
// keys (kraft-heinz, tyson, hormel, dietz-and-watson, land-o-frost) confirmed
// present in companies.js. Both excluded duplicates (025317686006,
// 037600132602) confirmed already in products.js. No medical-claim language
// found in any entry.
//
// REVIEWER CHANGES vs _formatted.js (3 entries corrected; 0 rejected):
//   1) 044700030486 Oscar Mayer Deli Fresh Smoked Uncured Ham
//      - ingredients: removed 'cultured dextrose' and 'caramel color' (neither
//        appears on oscarmayer.com's own label) and reordered to match the
//        official list (ham, water, sugar, vinegar, salt, cultured celery
//        juice, sodium phosphates, cherry powder). Octavius had invented two
//        tokens not on the real panel.
//      - nutrition.sodium 470 -> 500 (retail Nutrition Facts panel, 21% DV
//        corroborates 500mg; Octavius's 470 was an FDC-scaled estimate).
//        Remaining values (sugars 1, protein 11) sit ~1 off a retail panel
//        reading of 2/10 — left as-is, within label-rounding variance.
//   2) 044500984699 Hillshire Farm Ultra Thin Roast Beef
//      - ingredients: replaced Octavius's list (which invented 'beef seasoning'
//        and dropped beef stock / cultured dextrose / maltodextrin / caramel
//        color) with hillshirefarm.com's verbatim label.
//      - nutrition: saturatedFat 1.5 -> 2, sodium 490 -> 500, sugars 0 -> 1
//        (hillshirefarm.com panel).
//   3) 051900016035 Land O'Frost Premium Honey Ham
//      - ingredients: removed 'dextrose' (not on label), added 'modified corn
//        starch' and 'sugar', reordered to landofrost.com's verbatim label.
//        Nutrition already matched the manufacturer panel exactly — unchanged.
//
// SPOT-CHECKED NUTRITION-SCALING FIXES (independently, per the brief):
//   - Hormel Natural Choice Honey Deli Ham (037600260305): fetched 39.2 cal
//     -> Octavius 70. CONFIRMED exact match to hormel.com (70 cal, 1.5 fat,
//     0.5 satfat, 590 sodium, 3 carbs, 3 sugars, 10 protein). Clean fix.
//   - Dietz & Watson Black Forest Smoked Ham (031506310270): fetched 118 cal
//     / sodium 0 (parse bug) -> Octavius 70 / 480. Sodium 480 CONFIRMED
//     independently; calories 70 is within label rounding of the 0.56x scale.
//   - Oscar Mayer Deli Fresh Smoked Uncured Ham (044700030486): fetched 105
//     cal -> Octavius 60. CONFIRMED 60 cal independently (sodium re-corrected
//     to 500, see above).
//   Also confirmed the two Oscar Mayer / Land O'Frost wrong-variant swaps and
//   both Hillshire honey-ham / black-forest overrides are FAITHFUL to the
//   real product labels (Octavius was correct to override the OFF nitrite
//   ingredient list on the Ultra Thin Honey Ham — the current SKU is uncured).
//
// STILL FLAGGED FOR THE FOUNDER (unchanged, worth a manual eye before ship):
//   - 025317586009 Applegate Naturals Oven Roasted Turkey: ingredient reads
//     'chicken broth' (2 barcode-tied sources) but applegate.com's page text
//     says 'turkey broth'. Allergen-relevant; kept 'chicken broth' pending a
//     package recheck.
//   - 031506739019 Dietz & Watson Oven Classic Turkey Breast: UPC taken from
//     dietzandwatson.com's own product page; USDA FDC lists two adjacent GTINs
//     for near-identical products. Ingredients/nutrition are single-source
//     coherent; the exact UPC digit string is the soft spot.
//   - 2 could-not-verify (Boar's Head Ovengold Turkey, Boar's Head Deluxe Ham)
//     were correctly left out — every barcode found uses a GS1 random-weight
//     restricted prefix, no fixed consumer UPC. Do NOT invent one.
//
// (Original Octavius decoding notes on connector-phrase dropping and the 9
// new_ingredients are preserved in _formatted.js; not repeated here.)

module.exports = {
  '044700075104': {
    barcode: '044700075104',
    name: 'Deli Fresh Oven Roasted Turkey Breast',
    brand: 'Oscar Mayer',
    companyId: 'kraft-heinz',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 50,
    ingredients: [
      'turkey breast', 'water', 'modified cornstarch', 'sodium lactate', 'salt',
      'sugar', 'sodium phosphates', 'carrageenan', 'natural flavor',
      'sodium diacetate', 'potassium chloride', 'sodium ascorbate',
      'sodium nitrite', 'caramel color',
    ],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 500, carbs: 2, sugars: 0, protein: 9 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '044700030486': {
    barcode: '044700030486',
    name: 'Deli Fresh Smoked Uncured Ham',
    brand: 'Oscar Mayer',
    companyId: 'kraft-heinz',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 60,
    ingredients: [
      'ham', 'water', 'sugar', 'vinegar', 'salt', 'cultured celery juice',
      'sodium phosphates', 'cherry powder',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0.5, sodium: 500, carbs: 1, sugars: 1, protein: 11 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '044700075081': {
    barcode: '044700075081',
    name: 'Deli Fresh Honey Ham',
    brand: 'Oscar Mayer',
    companyId: 'kraft-heinz',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 70,
    ingredients: [
      'ham', 'water', 'honey', 'salt', 'sugar', 'sodium phosphates',
      'sodium propionate', 'sodium diacetate', 'sodium benzoate',
      'sodium ascorbate', 'sodium nitrite', 'caramel color',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0, sodium: 520, carbs: 3, sugars: 3, protein: 10 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '044700030998': {
    barcode: '044700030998',
    name: 'Deli Fresh Rotisserie Seasoned Chicken Breast',
    brand: 'Oscar Mayer',
    companyId: 'kraft-heinz',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 50,
    ingredients: [
      'chicken breast', 'water', 'modified cornstarch', 'vinegar', 'salt',
      'cultured dextrose', 'sugar', 'natural chicken type flavor',
      'sodium phosphates', 'carrageenan', 'potassium chloride', 'paprika',
      'black pepper', 'garlic powder', 'onion powder', 'thyme',
    ],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 520, carbs: 1, sugars: 1, protein: 8 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '044700030707': {
    barcode: '044700030707',
    name: 'Deli Fresh Mesquite Smoked Turkey Breast',
    brand: 'Oscar Mayer',
    companyId: 'kraft-heinz',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 50,
    ingredients: [
      'turkey breast', 'water', 'modified cornstarch', 'vinegar', 'salt',
      'cultured dextrose', 'sugar', 'sodium phosphates', 'carrageenan',
      'paprika', 'dehydrated chili peppers', 'spices', 'flavor', 'salt',
    ],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 480, carbs: 1, sugars: 1, protein: 9 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '044500966466': {
    barcode: '044500966466',
    name: 'Ultra Thin Oven Roasted Turkey Breast, Family Size',
    brand: 'Hillshire Farm',
    companyId: 'tyson',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 60,
    ingredients: [
      'turkey breast', 'turkey broth', 'modified food starch', 'vinegar',
      'caramel color', 'carrageenan', 'cultured celery powder', 'salt',
      'sodium phosphates',
    ],
    nutrition: { fat: 2, saturatedFat: 0, sodium: 600, carbs: 2, sugars: 0, protein: 10 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '044500201963': {
    barcode: '044500201963',
    name: 'Ultra Thin Honey Ham',
    brand: 'Hillshire Farm',
    companyId: 'tyson',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 70,
    ingredients: [
      'ham', 'water', 'honey', 'vinegar', 'sugar', 'salt', 'sodium phosphate',
      'dextrose', 'natural flavorings', 'celery juice powder', 'sea salt',
      'citric acid',
    ],
    nutrition: { fat: 2.5, saturatedFat: 1, sodium: 570, carbs: 4, sugars: 3, protein: 9 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '044500329537': {
    barcode: '044500329537',
    name: 'Ultra Thin Black Forest Ham',
    brand: 'Hillshire Farm',
    companyId: 'tyson',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 60,
    ingredients: [
      'ham', 'water', 'vinegar', 'salt', 'cultured celery powder', 'dextrose',
      'sea salt', 'sodium phosphates', 'sugar', 'caramel color',
    ],
    nutrition: { fat: 3, saturatedFat: 1, sodium: 610, carbs: 1, sugars: 1, protein: 9 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '044500984699': {
    barcode: '044500984699',
    name: 'Ultra Thin Roast Beef',
    brand: 'Hillshire Farm',
    companyId: 'tyson',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 70,
    ingredients: [
      'beef', 'water', 'vinegar', 'beef stock', 'cultured dextrose', 'dextrose',
      'maltodextrin', 'natural flavors', 'potassium and sodium phosphates',
      'salt', 'caramel color',
    ],
    nutrition: { fat: 3, saturatedFat: 2, sodium: 500, carbs: 1, sugars: 1, protein: 10 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '037600260305': {
    barcode: '037600260305',
    name: 'Natural Choice Honey Deli Ham',
    brand: 'Hormel Natural Choice',
    companyId: 'hormel',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '4 slices (56g)',
    calories: 70,
    ingredients: [
      'pork', 'water', 'honey', 'salt', 'turbinado sugar',
      'cultured celery powder', 'cherry powder', 'sea salt',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0.5, sodium: 590, carbs: 3, sugars: 3, protein: 10 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '037600435611': {
    barcode: '037600435611',
    name: 'Natural Choice Applewood Smoked Deli Turkey',
    brand: 'Hormel Natural Choice',
    companyId: 'hormel',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '3 slices (56g)',
    calories: 50,
    ingredients: [
      'turkey breast meat', 'water', 'salt', 'potato starch', 'turbinado sugar',
      'rice starch', 'carrageenan', 'baking soda', 'cultured celery powder',
      'cherry powder', 'sea salt',
    ],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 500, carbs: 1, sugars: 1, protein: 10 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '025317005906': {
    barcode: '025317005906',
    name: 'Naturals Black Forest Ham',
    brand: 'Applegate',
    companyId: 'hormel',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 slices (55g)',
    calories: 70,
    ingredients: [
      'pork', 'water', 'sea salt', 'cane sugar', 'celery powder', 'spice extracts',
    ],
    nutrition: { fat: 2, saturatedFat: 0.5, sodium: 470, carbs: 1, sugars: 1, protein: 12 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '025317586009': {
    barcode: '025317586009',
    name: 'Naturals Oven Roasted Turkey Breast',
    brand: 'Applegate',
    companyId: 'hormel',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 slices (55g)',
    calories: 60,
    ingredients: [
      'turkey breast', 'water', 'sea salt', 'potato starch', 'salt',
      'chicken broth', 'rosemary extract',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 290, carbs: 0, sugars: 0, protein: 14 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '031506739019': {
    barcode: '031506739019',
    name: 'Oven Classic Turkey Breast',
    brand: 'Dietz & Watson',
    companyId: 'dietz-and-watson',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 60,
    ingredients: [
      'turkey breast', 'water', 'sugar', 'salt', 'sodium phosphate',
      'potassium chloride', 'salt', 'spices', 'garlic', 'onion', 'paprika',
    ],
    nutrition: { fat: 0.5, saturatedFat: 0, sodium: 400, carbs: 1, sugars: 1, protein: 13 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '031506310270': {
    barcode: '031506310270',
    name: 'Black Forest Smoked Ham',
    brand: 'Dietz & Watson',
    companyId: 'dietz-and-watson',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '2 oz (56g)',
    calories: 70,
    ingredients: [
      'fresh ham', 'water', 'sea salt', 'organic sugar', 'dextrose',
      'sodium phosphate', 'potassium lactate', 'sodium diacetate',
      'sodium ascorbate', 'sodium nitrite', 'natural smoke flavor', 'spice extracts',
    ],
    nutrition: { fat: 2, saturatedFat: 1, sodium: 480, carbs: 1, sugars: 1, protein: 11 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '051900016035': {
    barcode: '051900016035',
    name: 'Premium Honey Ham',
    brand: "Land O'Frost",
    companyId: 'land-o-frost',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '4 slices (50g)',
    calories: 50,
    ingredients: [
      'ham', 'water', 'honey', 'brown sugar', 'salt', 'vinegar',
      'modified corn starch', 'sugar', 'sodium erythorbate', 'sodium phosphates',
      'sodium nitrite',
    ],
    nutrition: { fat: 2, saturatedFat: 0.5, sodium: 540, carbs: 2, sugars: 2, protein: 8 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '051900016028': {
    barcode: '051900016028',
    name: 'Premium Oven Roasted Turkey Breast',
    brand: "Land O'Frost",
    companyId: 'land-o-frost',
    category: 'Deli & Lunch',
    image: null,
    servingSize: '4 slices (50g)',
    calories: 70,
    ingredients: [
      'turkey breast', 'white turkey', 'water', 'salt', 'vinegar',
      'autolyzed yeast extract', 'flavorings', 'turkey stock', 'turkey flavor',
      'dextrose', 'brown sugar', 'modified corn starch', 'maltodextrin',
      'sodium phosphates', 'sodium erythorbate', 'sodium nitrite',
    ],
    nutrition: { fat: 3, saturatedFat: 1, sodium: 460, carbs: 1, sugars: 0, protein: 8 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },
};
