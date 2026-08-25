// ─── CHIPS 2026-07-09 · OPUS-REVIEWED ─────────────────────────────────────
// Independent Stage-3 review of chips-2026-07-09_formatted.js.
// 16 formatted in → 16 shipped / 0 rejected. 5 FIXes applied (below).
// 4 duplicate exclusions independently confirmed still-correct.
//
// REVIEW FIXES APPLIED:
//   1. Kettle Brand Backyard Barbeque (084114116642): companyId
//      'campbell-soup' → 'campbell'.
//   2. Kettle Brand Jalapeno (084114116352): companyId
//      'campbell-soup' → 'campbell'.
//   3. Cape Cod Less Fat Original (020685001666): companyId
//      'campbell-soup' → 'campbell'.
//      Reason (1-3): companies.js has TWO Campbell records — 'campbell'
//      (subsidiaries incl. Kettle Brand) and 'campbell-soup' (subsidiaries
//      incl. Cape Cod). Both resolve, but the EXISTING catalog entries for
//      Kettle Brand (products.js barcode ...) and Cape Cod Original
//      (020685001642) both use companyId 'campbell'. Using 'campbell-soup'
//      here would make the same brand resolve to two different company pages
//      depending on which SKU the user scans. Aligned to the existing
//      convention. (Underlying duplicate-company-record cleanup flagged to
//      founder — not fixed here.)
//   4. Cheetos Flamin' Hot Limon (028400590020): nutrition.fiber 1 → 0.5.
//      CalorieKing + MyFoodDiary + Stage-1 OFF all report 0.5g fiber; the
//      rest of Octavius's correction (170 cal / 260mg sodium / 15g carbs /
//      11g fat) independently CONFIRMED by 2 sources — good catch overall.
//   5. Takis Fuego (757528029753): nutrition.calories 140 → 150,
//      nutrition.carbs 16 → 17. Official Takis SmartLabel (GTIN
//      757528008796) + MyFoodDiary both give 150 cal / 17g carbs per 28g
//      (sodium 420 / fat 8 / sat 2.5 / sugars 1 / protein 2 / fiber 1 all
//      matched Octavius). Sibling-SKU sourcing ACCEPTED — Takis Fuego is one
//      recipe across all pack sizes; per-serving values independently
//      verified against the official label.
//
// INDEPENDENTLY VERIFIED & CLEARED (invention-risk / flagged items):
//   - Ruffles Cheddar & Sour Cream ingredients: the padded-looking list
//     (butter, yellow 5, whey protein isolate, milk protein concentrate,
//     blue cheese) is FAITHFUL — matches the real ruffles.com label
//     term-for-term. NOT invented.
//   - Cheetos Flamin' Hot Limon added ingredients (corn syrup solids,
//     hydrolyzed corn protein, lime juice) CONFIRMED on the real label
//     (Walmart/CVS/Costco). NOT invented.
//   - Cheetos Puffs barcode 028400078917 CONFIRMED real (Cheetos Jumbo
//     Puffs 2.38oz, PepsiCo SmartLabel + upcitemdb); ingredients faithful to
//     the garbled OCR source.
//   - Cape Cod wrong-variant catch CONFIRMED: real "Less Fat Original" is
//     the multi-oil-blend + sea salt recipe (potatoes, vegetable oil
//     [canola, sunflower, safflower, and/or soybean], sea salt), distinct
//     from the full-fat Original. Substitution correct.
//   - 4 duplicate exclusions CONFIRMED already in products.js: Doritos Cool
//     Ranch (028400516310, byte-identical), Ruffles Original (028400516686),
//     Cape Cod Original (020685001642, byte-identical), Tostitos Scoops
//     (028400064088). No false-positive exclusions.
//   - No medical/health-causation claims in any of the 16 entries.
//
// ─── Octavius's original header (Stage-2) preserved below ─────────────────
// 20 products fetched (Stage-1 script) · 0 raw misses reported by fetch.
// 16 formatted / 0 could_not_verify / 4 excluded as duplicates already
// present in products.js.
//
// SYSTEMIC BUG 1 — SODIUM UNIT ERROR (all 13 off-search-sourced records):
// Stage-1 copied OFF's "sodium_serving" (GRAMS) into the mg-denominated
// nutrition.sodium field without converting. Corrected by ×1000.
//
// SYSTEMIC BUG 2 — PER-100G MISLABELED AS PER-SERVING (all 6 usda-fdc
// records + Cheetos Puffs + Takis Fuego): Stage-1's macros were per-100g.
// Corrected to per-serving via USDA labelNutrients, cross-checked across
// 2-3 GTINs per item.
//
// PER-PRODUCT CORRECTIONS (Octavius): Ruffles C&SC ingredients replaced
// (truncated Stage-1 text); Cheetos Puffs replaced (OCR-garbled) + barcode
// changed to clean-data GTIN 028400078917; Flamin' Hot Limon replaced with
// richer USDA data + GTIN 028400590020; Doritos Spicy Sweet Chili GTIN
// 028400337274 verified; Cape Cod "Reduced Fat" was actually the full-fat
// Original — replaced with the real "Less Fat Original" (GTIN 020685001666);
// Takis Fuego per-serving nutrition sourced from a same-recipe sibling SKU.
//
// OWNERSHIP: Lay's/Ruffles/Tostitos/Fritos/Doritos/Cheetos/SunChips →
// pepsico. Kettle Brand + Cape Cod → campbell (see REVIEW FIX 1-3).
// Pringles → kelloggs (BRAND_TO_COMPANY maps 'pringles' → 'kelloggs';
// 'kellanova' is aliased to 'kelloggs'). Takis → bimbo (Barcel/Grupo Bimbo).

module.exports = {
  '028400008617': {
    barcode: '028400008617',
    name: "Lay's Barbecue Potato Chips",
    brand: "Lay's",
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 package (28.3g)',
    calories: 152,
    ingredients: [
      'potatoes',
      'vegetable oil (canola oil, corn oil, soybean oil, sunflower oil)',
      'sugar',
      'salt',
      'dextrose',
      'maltodextrin (corn)',
      'molasses',
      'torula yeast',
      'natural flavors',
      'onion powder',
      'spices',
      'tomato powder',
      'paprika',
      'corn starch',
      'paprika extract',
      'caramel color',
      'yeast extract',
      'garlic powder',
      'mustard seed oil',
    ],
    nutrition: { fat: 9, saturatedFat: 1.5, sodium: 190, carbs: 16, sugars: 2, protein: 2, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '028400199636': {
    barcode: '028400199636',
    name: "Lay's Sour Cream & Onion Potato Chips",
    brand: "Lay's",
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '17 chips (28g)',
    calories: 160,
    ingredients: [
      'potatoes',
      'vegetable oil (canola oil, corn oil, soybean oil, sunflower oil)',
      'skim milk',
      'salt',
      'whey',
      'onion powder',
      'parsley',
      'sour cream (cultured cream, skim milk)',
      'dextrose',
      'maltodextrin (corn)',
      'natural flavors',
      'medium chain triglycerides',
      'lactose',
      'citric acid',
    ],
    nutrition: { fat: 10, saturatedFat: 1.5, sodium: 200, carbs: 15, sugars: 2, protein: 2, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '028400159609': {
    // Stage-1's OFF ingredient text was wrong/truncated for this flavor.
    // Replaced with the real label — REVIEW-CONFIRMED faithful against
    // ruffles.com (butter, yellow 5, whey protein isolate, blue cheese,
    // milk protein concentrate are all genuinely on the label).
    barcode: '028400159609',
    name: 'Ruffles Cheddar & Sour Cream Potato Chips',
    brand: 'Ruffles',
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: 'about 11 chips (28g)',
    calories: 160,
    ingredients: [
      'potatoes',
      'vegetable oil (sunflower, corn, and/or canola oil)',
      'maltodextrin (corn)',
      'salt',
      'whey',
      'cheddar cheese (milk, cheese cultures, salt, enzymes)',
      'onion powder',
      'corn oil',
      'monosodium glutamate',
      'natural and artificial flavor',
      'buttermilk',
      'canola oil',
      'sour cream (cultured cream, skim milk)',
      'lactose',
      'butter (cream, salt)',
      'sodium caseinate',
      'yeast extract',
      'citric acid',
      'skim milk',
      'blue cheese (milk, cheese cultures, salt, enzymes)',
      'lactic acid',
      'garlic powder',
      'yellow 6',
      'yellow 5',
      'whey protein isolate',
      'sunflower oil',
      'milk protein concentrate',
    ],
    nutrition: { fat: 10, saturatedFat: 1.5, sodium: 180, carbs: 15, sugars: 1, protein: 2, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '028400083133': {
    barcode: '028400083133',
    name: 'Tostitos Original Restaurant Style Tortilla Chips',
    brand: 'Tostitos',
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: 'about 7 chips (28g)',
    calories: 140,
    ingredients: [
      'corn',
      'vegetable oil (corn, canola, and/or sunflower oil)',
      'salt',
    ],
    nutrition: { fat: 7, saturatedFat: 1, sodium: 115, carbs: 19, sugars: 0, protein: 2, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '028400040044': {
    barcode: '028400040044',
    name: 'Fritos Chili Cheese Corn Chips',
    brand: 'Fritos',
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 oz (28.3g)',
    calories: 160,
    ingredients: [
      'corn',
      'corn oil',
      'whey',
      'salt',
      'spices',
      'maltodextrin (corn)',
      'cheddar cheese (milk, cheese cultures, enzymes)',
      'canola oil',
      'potassium chloride',
      'tomato powder',
      'monosodium glutamate',
      'onion powder',
      'natural flavors',
      "romano cheese (cow's milk, cheese cultures, salt, enzymes)",
      'dextrose',
      'buttermilk',
      'sodium caseinate',
      'annatto extract',
      'cream',
      'salt',
      'citric acid',
      'sunflower oil',
      'garlic powder',
      'disodium inosinate',
      'disodium guanylate',
      'caramel color',
    ],
    nutrition: { fat: 10, saturatedFat: 1.5, sodium: 180, carbs: 16, sugars: 1, protein: 2, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '028400589321': {
    barcode: '028400589321',
    name: 'Fritos Scoops! Corn Chips',
    brand: 'Fritos',
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 160,
    ingredients: [
      'corn',
      'vegetable oil (corn and/or canola oil)',
      'salt',
    ],
    nutrition: { fat: 10, saturatedFat: 1.5, sodium: 110, carbs: 16, sugars: 0, protein: 2, fiber: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '028400337274': {
    // No barcode from Stage-1 (usda-fdc path). GTIN verified via USDA FDC
    // labelNutrients, cross-checked against 2 further independent GTINs.
    barcode: '028400337274',
    name: 'Doritos Spicy Sweet Chili Tortilla Chips',
    brand: 'Doritos',
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 140,
    ingredients: [
      'corn',
      'vegetable oil (corn, canola, and/or sunflower oil)',
      'salt',
      'sugar',
      'monosodium glutamate',
      'fructose',
      'sodium diacetate',
      'soy sauce (soybean, wheat, salt)',
      'wheat',
      'onion powder',
      'maltodextrin (corn)',
      'hydrolyzed soy protein',
      'hydrolyzed corn protein',
      'garlic powder',
      'torula yeast',
      'malic acid',
      'paprika extract',
      'spices',
      'caramel color',
      'disodium inosinate',
      'disodium guanylate',
      'dextrose',
      'natural flavor',
    ],
    nutrition: { fat: 7, saturatedFat: 1, sodium: 270, carbs: 18, sugars: 1, protein: 2, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: false,
  },

  '028400078917': {
    // Stage-1's OFF ingredient text was OCR-garbled and unusable. Replaced
    // with a clean USDA FDC record (fdcId 1460671). Barcode changed from
    // Stage-1's OFF match to this GTIN — REVIEW-CONFIRMED real (Cheetos
    // Jumbo Puffs 2.38oz, PepsiCo SmartLabel + upcitemdb); ingredients
    // faithful to the garbled source.
    barcode: '028400078917',
    name: 'Cheetos Puffs Cheese Flavored Snacks',
    brand: 'Cheetos',
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 150,
    ingredients: [
      'enriched corn meal (corn meal, ferrous sulfate, niacin, thiamin mononitrate, riboflavin, folic acid)',
      'vegetable oil (corn, canola, and/or sunflower oil)',
      'whey',
      'cheddar cheese (milk, cheese cultures, salt, enzymes)',
      'canola oil',
      'maltodextrin (corn)',
      'salt',
      'whey protein concentrate',
      'monosodium glutamate',
      'natural and artificial flavors',
      'lactic acid',
      'citric acid',
      'yellow 6',
      'salt',
    ],
    nutrition: { fat: 10, saturatedFat: 1.5, sodium: 300, carbs: 13, sugars: 1, protein: 2, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '028400590020': {
    // Replaced with richer USDA data (170 cal / 260mg sodium) + GTIN.
    // REVIEW-CONFIRMED: 170 cal / 260mg sodium / 15g carbs / 11g fat via
    // CalorieKing + MyFoodDiary; added ingredients (corn syrup solids,
    // hydrolyzed corn protein, lime juice) confirmed real. fiber corrected
    // 1 → 0.5 (three sources agree on 0.5g).
    barcode: '028400590020',
    name: "Cheetos Crunchy Flamin' Hot Limon Cheese Flavored Snacks",
    brand: 'Cheetos',
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 170,
    ingredients: [
      'enriched corn meal (corn meal, ferrous sulfate, niacin, thiamin mononitrate, riboflavin, folic acid)',
      'vegetable oil (corn, canola, and/or sunflower oil)',
      'salt',
      'yeast extract',
      'monosodium glutamate',
      'potassium salt',
      'citric acid',
      'maltodextrin (corn)',
      'red 40',
      'yellow 6 lake',
      'yellow 6',
      'yellow 5',
      'corn syrup solids',
      'hydrolyzed corn protein',
      'cheddar cheese (milk, cheese cultures, salt, enzymes)',
      'onion powder',
      'sugar',
      'whey',
      'lime juice',
      'whey protein concentrate',
      'garlic powder',
      'natural flavors',
      'buttermilk',
      'sodium diacetate',
      'disodium inosinate',
      'disodium guanylate',
    ],
    nutrition: { fat: 11, saturatedFat: 1.5, sodium: 260, carbs: 15, sugars: 0, protein: 1, fiber: 0.5 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '028400147392': {
    // No barcode from Stage-1 (usda-fdc path). GTIN + per-serving
    // labelNutrients confirmed via USDA FDC, cross-checked against retailer
    // listings for the 7oz bag.
    barcode: '028400147392',
    name: 'SunChips Harvest Cheddar Whole Grain Snacks',
    brand: 'SunChips',
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: 'about 15 chips (28g)',
    calories: 140,
    ingredients: [
      'whole corn',
      'vegetable oil (sunflower and/or canola oil)',
      'whole wheat',
      'brown rice flour',
      'whole oat flour',
      'sugar',
      'maltodextrin (corn)',
      'salt',
      'cheddar cheese (milk, cheese cultures, salt, enzymes)',
      'natural flavors',
      'whey',
      'whey protein concentrate',
      'onion powder',
      "romano cheese (cow's milk, cheese cultures, salt, enzymes)",
      'buttermilk',
      'yeast extract',
      'citric acid',
      'paprika extract',
      'lactic acid',
      'garlic powder',
      'parmesan cheese (milk, cheese cultures, salt, enzymes)',
      'skim milk',
    ],
    nutrition: { fat: 6, saturatedFat: 0.5, sodium: 200, carbs: 19, sugars: 2, protein: 2, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '028400147408': {
    // No barcode from Stage-1 (usda-fdc path). GTIN + per-serving
    // labelNutrients confirmed via USDA FDC (sibling 7oz bag GTIN).
    barcode: '028400147408',
    name: 'SunChips Garden Salsa Whole Grain Snacks',
    brand: 'SunChips',
    companyId: 'pepsico',
    category: 'Chips & Crackers',
    image: null,
    servingSize: 'about 15 chips (28g)',
    calories: 140,
    ingredients: [
      'whole corn',
      'vegetable oil (sunflower and/or canola oil)',
      'whole wheat',
      'brown rice flour',
      'whole oat flour',
      'sugar',
      'tomato powder',
      'salt',
      'natural flavors',
      'maltodextrin (corn)',
      'cheddar cheese (milk, cheese cultures, salt, enzymes)',
      'dextrose',
      'buttermilk',
      'onion powder',
      'whey',
      'yeast extract',
      "romano cheese (part-skim cow's milk, cheese cultures, salt, enzymes)",
      'whey protein concentrate',
      'corn oil',
      'spices (including jalapeno pepper)',
      'citric acid',
      'paprika extract',
      'lactic acid',
    ],
    nutrition: { fat: 6, saturatedFat: 0.5, sodium: 140, carbs: 19, sugars: 2, protein: 2, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '084114116642': {
    barcode: '084114116642',
    name: 'Kettle Brand Backyard Barbeque Potato Chips',
    brand: 'Kettle Brand',
    companyId: 'campbell',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 bag (28g)',
    calories: 140,
    ingredients: [
      'potatoes',
      'vegetable oil (safflower, sunflower, and/or canola oil)',
      'organic dried cane syrup',
      'sugar',
      'salt',
      'maltodextrin',
      'paprika',
      'onion powder',
      'yeast extract',
      'tomato powder',
      'torula yeast',
      'garlic powder',
      'chili pepper',
      'natural flavor (including smoke)',
      'citric acid',
    ],
    nutrition: { fat: 8, saturatedFat: 0.5, sodium: 125, carbs: 16, sugars: 1, protein: 2, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '084114116352': {
    // No barcode from Stage-1 (usda-fdc path). GTIN + per-serving
    // labelNutrients confirmed via USDA FDC (5oz bag).
    barcode: '084114116352',
    name: 'Kettle Brand Jalapeno Potato Chips',
    brand: 'Kettle Brand',
    companyId: 'campbell',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 150,
    ingredients: [
      'potatoes',
      'vegetable oils (canola and/or sunflower and/or safflower and/or soybean)',
      'salt',
      'sugar',
      'onion powder',
      'spices',
      'torula yeast',
      'yeast extract',
      'garlic powder',
      'jalapeno powder',
      'natural flavors',
      'parsley',
    ],
    nutrition: { fat: 9, saturatedFat: 1, sodium: 170, carbs: 15, sugars: 1, protein: 2, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '020685001666': {
    // Stage-1's usda-fdc record was actually the full-fat "Original"
    // formula, NOT the "Reduced Fat"/"Less Fat Original" asked for.
    // Replaced with the correct product — REVIEW-CONFIRMED: real Less Fat
    // Original is the multi-oil-blend + sea salt recipe (matches label).
    barcode: '020685001666',
    name: 'Cape Cod Less Fat Original Kettle Cooked Potato Chips',
    brand: 'Cape Cod',
    companyId: 'campbell',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 130,
    ingredients: [
      'potatoes',
      'vegetable oil (canola, sunflower, safflower, and/or soybean oil)',
      'sea salt',
    ],
    nutrition: { fat: 6, saturatedFat: 0, sodium: 125, carbs: 18, sugars: 0, protein: 2, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '757528029753': {
    // Barcode OFF-verified. OFF had no per-serving nutrition; nutrition
    // sourced from a same-recipe sibling Fuego SKU — REVIEW-CONFIRMED
    // against the official Takis SmartLabel (150 cal / 420mg sodium / 17g
    // carbs per 28g). calories 140→150, carbs 16→17 corrected.
    barcode: '757528029753',
    name: 'Takis Fuego Rolled Tortilla Chips',
    brand: 'Takis',
    companyId: 'bimbo',
    category: 'Chips & Crackers',
    image: null,
    servingSize: 'about 12 pieces (28g)',
    calories: 150,
    ingredients: [
      'corn masa flour',
      'vegetable oil (palm, soybean, canola, rice bran oil)',
      'iodized salt',
      'maltodextrin',
      'citric acid',
      'sugar',
      'monosodium glutamate',
      'hydrolyzed soy protein',
      'onion powder',
      'yeast extract',
      'red 40',
      'yellow 6 lake',
      'natural and artificial flavors',
      'sodium bicarbonate',
      'soybean oil',
      'chili pepper',
      'disodium inosinate',
      'disodium guanylate',
      'tbhq',
    ],
    nutrition: { fat: 8, saturatedFat: 2.5, sodium: 420, carbs: 17, sugars: 1, protein: 2, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '038000138416': {
    barcode: '038000138416',
    name: 'Pringles Original Potato Crisps',
    brand: 'Pringles',
    companyId: 'kelloggs',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 serving (28g)',
    calories: 150,
    ingredients: [
      'dried potatoes',
      'vegetable oil (corn, cottonseed, high oleic soybean, sunflower oil)',
      'degerminated yellow corn flour',
      'cornstarch',
      'rice flour',
      'maltodextrin',
      'mono- and diglycerides',
      'salt',
      'wheat starch',
    ],
    nutrition: { fat: 9, saturatedFat: 1, sodium: 110, carbs: 14, sugars: 0, protein: 2, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: false,
  },
};
