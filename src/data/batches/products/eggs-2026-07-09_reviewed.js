// Batch: Eggs 2026-07-09 — REVIEWED (Opus, Stage 3)
// Source: octavius-2026-07-09-eggs_fetched.json (13 resolved, 2 missed)
// Octavius output: eggs-2026-07-09_formatted.js (11 formatted / 3 could_not_verify / 1 excluded dup)
//
// REVIEW VERDICT: 11 PASS / 0 FIX / 0 REJECT. All entries accepted unchanged.
//
// Octavius's core claim — that all 13 Stage-1 "resolved" records were wrong-product/wrong-brand
// substitutions (Vital Farms->butter, Pete & Gerry's->Wellsley/Urban Remedy, Nellie's/Happy Egg->
// Member's Mark, Eggland's Best->Bob Evans sandwich, 365->whole milk) — was spot-checked against the
// raw JSON and is TRUE. Ignoring Stage 1 and re-researching from the candidate names was correct.
//
// Independent UPC verification (Go-UPC / upcitemdb / retailer pages) confirmed all 11 barcodes are
// real and correctly tied to the named product:
//   861745000027 Vital Farms Organic Pasture-Raised Large 12ct  ✓ (Go-UPC, EWG)
//   851387007560 Vital Farms Organic Pasture-Raised XL 12ct     ✓ (Go-UPC — real SKU IS organic; naming call correct)
//   815652002346 Pete & Gerry's Organic Free-Range XL           ✓ (Fresh Grocer, Fairway)
//   081565200241 Pete & Gerry's Organic Pasture-Raised Large    ✓ (Harris Teeter)
//   715141514643 Eggland's Best Cage-Free Large Brown 12ct      ✓ (upcitemdb, Publix)
//   715141716825 Eggland's Best Organic Large Brown 12ct        ✓ (upcitemdb)
//   715141113563 Eggland's Best Classic XL White 18ct           ✓ (upcitemdb/Go-UPC — 18ct confirmed, reasonable)
//   887422000081 Happy Egg Organic Free-Range Large Brown 12ct  ✓ (Go-UPC, Target)
//   887422000210 Happy Egg Heritage Breed Blue & Brown 12ct     ✓ (upcitemdb, Brookshire's)
//   075900971224 Bob Evans 100% Liquid Egg Whites               ✓ (OFF, EWG, retailers)
//   021130031542 Lucerne Grade AA Large Eggs                    ✓ (OFF) — companyId null is correct (no
//                Albertsons/Safeway/Lucerne key exists in companies.js; Lucerne Foods is Albertsons private label)
//
// Checks: no barcode collides with existing products.js; all companyIds exist and reflect real
// ownership (pete-and-gerrys owns both Pete & Gerry's and Nellie's per companies.js subsidiaries — confirmed);
// no medical-causation claims; ingredients faithful to label; both 'eggs' and 'egg whites' are present in
// ingredientCache.js (lines 74, 271) so no scoring miss.
//
// Excluded duplicate (kept excluded — correct): "Vital Farms Alfresco Large Eggs" == existing
// products.js 861745000010 "Vital Farms Pasture-Raised Large Grade A Eggs". Alfresco is Vital Farms'
// name for its non-organic pasture-raised large line; the new 861745000027 (organic) is a distinct SKU.
//
// could_not_verify (upheld — no fabricated barcodes): Nellie's Free Range Large WHITE (only brown
// 815652004180 surfaces, already in DB), Nellie's Free Range Organic Large Brown (no distinct organic
// Nellie's SKU resolves; only non-organic 815652004180), 365 WFM Cage-Free Large Brown (3 conflicting
// candidate UPCs, no stable public UPC for the private label). All three are defensible punts.

module.exports = {
  '861745000027': {
    barcode: '861745000027',
    name: 'Vital Farms Organic Pasture-Raised Large Eggs',
    brand: 'Vital Farms',
    companyId: 'vital-farms',
    category: 'Eggs',
    image: null,
    servingSize: '1 large egg (50g)',
    calories: 70,
    ingredients: ['eggs'],
    nutrition: { fat: 5, saturatedFat: 1.5, sodium: 70, carbs: 0, sugars: 0, protein: 6 },
    certifications: ['USDA Organic', 'Certified Humane'],
    isOrganic: true,
    isVegan: false,
    isGlutenFree: true,
  },

  '851387007560': {
    barcode: '851387007560',
    name: 'Vital Farms Organic Pasture-Raised Extra Large Eggs',
    brand: 'Vital Farms',
    companyId: 'vital-farms',
    category: 'Eggs',
    image: null,
    servingSize: '1 extra large egg (56g)',
    calories: 80,
    ingredients: ['eggs'],
    nutrition: { fat: 5, saturatedFat: 2, sodium: 80, carbs: 0, sugars: 0, protein: 7 },
    certifications: ['USDA Organic', 'Certified Humane'],
    isOrganic: true,
    isVegan: false,
    isGlutenFree: true,
  },

  '815652002346': {
    barcode: '815652002346',
    name: "Pete & Gerry's Organic Free-Range Extra Large Eggs",
    brand: "Pete & Gerry's",
    companyId: 'pete-and-gerrys',
    category: 'Eggs',
    image: null,
    servingSize: '1 extra large egg (56g)',
    calories: 80,
    ingredients: ['eggs'],
    nutrition: { fat: 5, saturatedFat: 2, sodium: 80, carbs: 0, sugars: 0, protein: 7 },
    certifications: ['USDA Organic', 'Certified Humane', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: false,
    isGlutenFree: true,
  },

  '081565200241': {
    barcode: '081565200241',
    name: "Pete & Gerry's Organic Pasture-Raised Eggs",
    brand: "Pete & Gerry's",
    companyId: 'pete-and-gerrys',
    category: 'Eggs',
    image: null,
    servingSize: '1 large egg (50g)',
    calories: 70,
    ingredients: ['eggs'],
    nutrition: { fat: 5, saturatedFat: 1.5, sodium: 65, carbs: 0, sugars: 0, protein: 6 },
    certifications: ['USDA Organic', 'Certified Humane'],
    isOrganic: true,
    isVegan: false,
    isGlutenFree: true,
  },

  '715141514643': {
    barcode: '715141514643',
    name: "Eggland's Best Cage Free Large Brown Eggs",
    brand: "Eggland's Best",
    companyId: 'egglands-best',
    category: 'Eggs',
    image: null,
    servingSize: '1 large egg (50g)',
    calories: 60,
    ingredients: ['eggs'],
    nutrition: { fat: 4, saturatedFat: 1, sodium: 65, carbs: 0, sugars: 0, protein: 6 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '715141716825': {
    barcode: '715141716825',
    name: "Eggland's Best Organic Large Brown Eggs",
    brand: "Eggland's Best",
    companyId: 'egglands-best',
    category: 'Eggs',
    image: null,
    servingSize: '1 large egg (50g)',
    calories: 60,
    ingredients: ['eggs'],
    nutrition: { fat: 4, saturatedFat: 1, sodium: 65, carbs: 0, sugars: 0, protein: 6 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: false,
    isGlutenFree: true,
  },

  '715141113563': {
    barcode: '715141113563',
    name: "Eggland's Best Classic Extra Large White Eggs",
    brand: "Eggland's Best",
    companyId: 'egglands-best',
    category: 'Eggs',
    image: null,
    servingSize: '1 extra large egg (56g)',
    calories: 80,
    ingredients: ['eggs'],
    nutrition: { fat: 4.5, saturatedFat: 1, sodium: 75, carbs: 0, sugars: 0, protein: 7 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '887422000081': {
    barcode: '887422000081',
    name: 'Happy Egg Organic Free Range Large Brown Eggs',
    brand: 'Happy Egg',
    companyId: 'happy-egg',
    category: 'Eggs',
    image: null,
    servingSize: '1 large egg (50g)',
    calories: 70,
    ingredients: ['eggs'],
    nutrition: { fat: 5, saturatedFat: 1.5, sodium: 70, carbs: 0, sugars: 0, protein: 6 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: false,
    isGlutenFree: true,
  },

  '887422000210': {
    barcode: '887422000210',
    name: 'Happy Egg Free Range Blue and Brown Heritage Breed Eggs',
    brand: 'Happy Egg',
    companyId: 'happy-egg',
    category: 'Eggs',
    image: null,
    servingSize: '1 large egg (50g)',
    calories: 70,
    ingredients: ['eggs'],
    nutrition: { fat: 5, saturatedFat: 1.5, sodium: 70, carbs: 0, sugars: 0, protein: 6 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '075900971224': {
    barcode: '075900971224',
    name: 'Bob Evans 100% Liquid Egg Whites',
    brand: 'Bob Evans',
    companyId: 'bob-evans',
    category: 'Eggs',
    image: null,
    servingSize: '3 tbsp (46g)',
    calories: 25,
    ingredients: ['egg whites'],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 75, carbs: 0, sugars: 0, protein: 5 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '021130031542': {
    barcode: '021130031542',
    name: 'Lucerne Grade AA Large Eggs',
    brand: 'Lucerne',
    companyId: null,
    category: 'Eggs',
    image: null,
    servingSize: '1 large egg (50g)',
    calories: 70,
    ingredients: ['eggs'],
    nutrition: { fat: 5, saturatedFat: 1.5, sodium: 70, carbs: 0, sugars: 0, protein: 6 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },
};
