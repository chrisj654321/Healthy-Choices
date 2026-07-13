// ─── DELI MEAT 2026-07-09 ─────────────────────────────────────────────────
// 21 products fetched (0 misses) · 17 formatted / 2 could_not_verify / 2 excluded (pre-existing duplicates)
//
// STAGE-1 DATA QUALITY ISSUES CAUGHT DURING STAGE-2 VERIFICATION
// (this batch's fetch summary claimed 0 misses / all resolved, but several
// "resolved" records were wrong-variant matches or carried a nutrition bug —
// flagging in detail for the Opus reviewer since nothing here should be
// taken on faith just because Stage 1 marked it resolved):
//
// 1) PER-100G-MISLABELED-AS-PER-SERVING BUG: several usda-fdc-sourced (and at
//    least one off-search-sourced) records reported nutrition values that were
//    actually per-100g figures sitting under a serving_size field of ~50-60g,
//    with no scaling applied. Confirmed by re-querying USDA FDC directly by
//    the exact verified GTIN and comparing to manufacturer-published label
//    values, which consistently matched (FDC value) x (serving_grams/100):
//      - oscar-mayer-deli-fresh-smoked-ham: fetched calories 107 for a 56g
//        serving -> true value 60 (matches Kraft Heinz FDC record scaled 0.56x).
//      - dietz-watson-black-forest-smoked-ham: fetched calories 118, sodium
//        reported as 0 (a probable null->0 parsing bug) -> true values,
//        calories 70 / sodium 480mg (FDC record for the same GTIN, scaled 0.56x).
//      - hormel-natural-choice-honey-deli-ham: fetched calories 39.2 (fat 0.84,
//        sodium 330, protein 5.6) -- every value was ~0.56x the real Hormel.com
//        label (calories 70, fat 1.5, sodium 590, protein 10). Replaced with
//        Hormel's own published nutrition panel.
//    Cross-checked against hormel.com, hillshirefarm.com, dietzandwatson.com,
//    landofrost.com, oscarmayer.com and H-E-B nutrition panels wherever
//    possible; only re-derived math (raw FDC x serving/100) when no printed
//    panel could be found. See per-entry notes below.
//
// 2) WRONG-VARIANT / WRONG-BRAND MATCHES (name in ≠ product returned):
//    - oscar-mayer-deli-fresh-mesquite-smoked-turkey-br: Stage-1 returned
//      Oscar Mayer "Blackened Turkey Breast" (cayenne, red bell peppers) for
//      a search on Mesquite Smoked. Replaced with the real Mesquite Smoked
//      product (UPC 044700030707, confirmed on oscarmayer.com + H-E-B).
//    - hillshire-farm-ultra-thin-oven-roasted-turkey-br: Stage-1 returned the
//      "Honey Roasted" variant (has honey in the ingredients) for a search on
//      Oven Roasted. Replaced with the real family-size Oven Roasted product
//      (UPC 044500966466, hillshirefarm.com).
//    - hillshire-farm-ultra-thin-black-forest-ham / -roast-beef: Stage-1
//      matched the "Naturals" sub-line instead of "Ultra Thin". Replaced with
//      the correct Ultra Thin SKUs (UPC 044500329537 confirmed via
//      hillshirefarm.com; UPC 044500984699 confirmed via USDA FDC gtin match
//      + Brookshire's retailer listing under the same UPC).
//    - applegate-organics-oven-roasted-turkey-breast: Stage-1 returned a
//      Safeway "O Organics" private-label product (wrong brand entirely) for
//      an Applegate Organics search. The real product (UPC 025317686006) turned
//      out to be an EXISTING entry already in products.js — excluded from
//      this file, see DUPLICATES below.
//    - land-o-frost-premium-honey-ham / -oven-roasted-turkey-breast: Stage-1
//      matched "Bold Ham" (maple/molasses recipe) and "Hickory Smoked Turkey
//      Breast" respectively, not the Premium-line flavors requested. Replaced
//      with the real Premium Honey Ham (UPC 051900016035) and Premium Oven
//      Roasted Turkey Breast (UPC 051900016028), both confirmed via
//      landofrost.com + USDA FDC gtin match.
//    - hillshire-farm-ultra-thin-honey-ham: matched_off_code was correct
//      (0044500201963, confirmed via TheFreshGrocer listing under the same
//      UPC) but the OFF-crowd-sourced ingredients_verbatim was wrong/
//      incomplete (missing "ham" and several ingredients, and listing
//      preservatives -- sodium propionate/erythorbate/nitrite -- the real
//      product does not contain). Ingredients replaced via USDA FDC gtin
//      match + retailer confirmation; nutrition values were already correct
//      (verified via the same 0.56x-scaling cross-check) and were kept as-is.
//
// 3) NO BARCODE SUPPLIED (usda-fdc path carries no UPC): oscar-mayer-deli-
//    fresh-smoked-ham, oscar-mayer-deli-fresh-mesquite-smoked-turkey-br,
//    hillshire-farm-ultra-thin-oven-roasted-turkey-br, -black-forest-ham,
//    -roast-beef, applegate-organics-oven-roasted-turkey-breast (duplicate,
//    excluded), dietz-watson-oven-classic-turkey-breast, land-o-frost-
//    premium-honey-ham, land-o-frost-premium-oven-roasted-turkey-breast.
//    All researched and UPC-verified against a retailer/manufacturer page
//    displaying the barcode, then mod-10 validated. See per-entry notes.
//
// COULD NOT VERIFY (2): boar-s-head-ovengold-roasted-turkey-breast and
// boar-s-head-deluxe-ham. Both are sold at the deli counter / as
// random-weight packages. Every barcode found for them across USDA FDC
// (205295000005, 0207305000005, 0207306000004), Kroger/Fred Meyer
// (0027555900000, 0027574900000), and Fairway (00207217000001) uses a
// GS1 restricted-circulation prefix ("20"-"29" after stripping the leading
// database zero) -- the standard range for in-store random-weight/scale
// labels, not a fixed manufacturer GTIN. No fixed consumer-package UPC could
// be found for either product on Target, Walmart, or Instacart (all listings
// are "price per lb" / weighed-to-order). Per the no-fabrication rule, both
// are left out of products.js entirely rather than assigned an invented or
// store-instance-specific barcode. Ingredients and nutrition ARE verified
// (boarshead.com), just parked here for the record in case a fixed-UPC
// packaged version turns up in a future batch:
//   - Ovengold Roasted Turkey Breast: turkey breast, water, salt, sugar,
//     sodium phosphate, dextrose. Serving 2oz (56g), 60 cal, fat 1g, sat fat
//     0g, sodium 360mg, carbs 0g, sugars 0g, protein 11g, fiber 0g.
//   - Branded Deluxe Ham: fresh ham, water, salt, sugar, dextrose, sodium
//     phosphate, sodium erythorbate, sodium nitrite. (No verified per-serving
//     nutrition panel found; ingredients only.)
//
// DUPLICATES EXCLUDED (2) -- already exist in products.js, not re-added:
//   - '025317686006' Applegate Organics Oven Roasted Turkey Breast (already
//     present, companyId 'hormel', ingredients/nutrition match this batch's
//     independent research almost exactly -- good cross-validation of method).
//   - '037600132602' Hormel Natural Choice Oven Roasted Turkey Breast
//     (already present, companyId 'hormel', nutrition matches within normal
//     cross-source rounding).
//
// FLAGGED FOR REVIEWER (uncertain / worth a second look):
//   - applegate-naturals-oven-roasted-turkey-breast ('025317586009'):
//     ingredients_verbatim says "chicken broth" (confirmed independently by
//     both the original OFF record and a direct USDA FDC gtin lookup on the
//     same barcode), but applegate.com's own current product page text says
//     "turkey broth" for what appears to be the same product line. Went with
//     the barcode-tied sources (2-1 agreement) but this is an allergen-
//     relevant discrepancy worth a manual recheck.
//   - dietz-watson-oven-classic-turkey-breast: used the UPC displayed
//     directly on dietzandwatson.com's own Oven Classic product page
//     (031506739019, mod-10 valid) together with that same page's ingredient
//     list and nutrition panel. USDA FDC's branded database has two adjacent-
//     looking GTINs for very similar products under the same name
//     (031506739095, no coating/seasoning; 031506450051, coated with salt/
//     spices/garlic/onion/paprika, matching the manufacturer's text) --
//     neither is the same number as the manufacturer's page. Also note an
//     existing, different, already-shipped products.js entry '031506739194'
//     "Oven Roasted Turkey Breast" (Dietz & Watson) is a distinct product/
//     UPC, not a duplicate of this one. Confident on ingredients/nutrition
//     (single coherent source), less confident the UPC digit string is
//     the exact one Stage-1 or a rescan would independently reproduce.
//   - hormel-natural-choice-smoked-deli-turkey: fetched fat (0.5g) sits
//     slightly below Hormel's own published label (1g); sodium fetched at
//     540mg vs Hormel's 500mg. Both within normal label-rounding variance,
//     used Hormel's own published panel values in the final entry.
//
// INGREDIENT DECODING NOTE: connector/boilerplate phrases ("contains less
// than 2% of the following:", "contains 2% or less of:", "coated with:")
// were dropped rather than folded into the following ingredient's name, so
// that every remaining token has a shot at an exact ingredientCache.js hit.
// (Flagging that an existing, already-shipped entry -- '025317686006' --
// instead folded this connector phrase into the ingredient string itself,
// e.g. 'contains less than 2% of the following: sea salt', which will not
// hit the cache; not fixed here since it's out of this batch's scope, just
// noting the inconsistency for awareness.)
// Parenthetical sub-ingredients were kept inside their parent entry unless
// independently significant (allergens, dyes, preservatives) -- e.g.
// "sodium ascorbate (vitamin c)" stayed as one entry ('sodium ascorbate'),
// but "natural flavorings (including celery juice powder)" produced a
// second, separate 'celery juice powder' entry since celery is a declared
// allergen and cache already carries that exact ingredient.
//
// 9 ingredients not found in ingredientCache.js (see new_ingredients in the
// report to Opus) were kept verbatim rather than renamed to force a cache
// hit, including one label-spelling variant: cache only has the two-word
// 'modified corn starch', these labels literally print the one-word
// "MODIFIED CORNSTARCH" -- kept as printed, flagged as new rather than
// silently normalized to the existing two-word cache key.

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
      'ham', 'water', 'cultured dextrose', 'sugar', 'salt', 'vinegar',
      'cultured celery juice', 'sodium phosphates', 'cherry powder', 'caramel color',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0.5, sodium: 470, carbs: 1, sugars: 1, protein: 11 },
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
      'beef', 'water', 'vinegar', 'salt', 'dextrose',
      'potassium and sodium phosphates', 'beef seasoning', 'natural flavor',
    ],
    nutrition: { fat: 3, saturatedFat: 1.5, sodium: 490, carbs: 1, sugars: 0, protein: 10 },
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
      'ham', 'water', 'honey', 'salt', 'vinegar', 'dextrose', 'brown sugar',
      'sodium erythorbate', 'sodium phosphates', 'sodium nitrite',
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
