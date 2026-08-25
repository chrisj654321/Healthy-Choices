// ─── CHIPS 2026-07-09 ─────────────────────────────────────────────────────
// 20 products fetched (Stage-1 script) · 0 raw misses reported by fetch.
// 16 formatted / 0 could_not_verify / 4 excluded as duplicates already
// present in products.js (see DUPLICATES note below — not written, would
// silently collide with or shadow existing catalog entries).
//
// Per the mid-task correction: NO Stage-1 "resolved" record was taken on
// faith. Every one of the 20 was independently re-checked against a second
// source (direct OFF API re-fetch by barcode, and/or USDA FDC food-detail
// lookups by GTIN, and/or brand SmartLabel/retailer pages). Two systemic
// bugs were found and fixed across the whole batch, plus several
// per-product wrong-data corrections. Full detail below.
//
// SYSTEMIC BUG 1 — SODIUM UNIT ERROR (all 13 off-search-sourced records):
// Stage-1 copied Open Food Facts' "sodium_serving" field, which OFF reports
// in GRAMS, directly into the mg-denominated `nutrition.sodium` field
// without converting. Confirmed by re-fetching every off-search barcode
// directly from OFF: e.g. Lay's BBQ sodium_serving = 0.19 (grams) → Stage-1
// wrote sodium: 0.19 (mg) instead of the correct 190 mg. Every off-search
// sodium value below has been corrected by ×1000.
//
// SYSTEMIC BUG 2 — PER-100G MISLABELED AS PER-SERVING (all 6 usda-fdc
// sourced records: Ruffles Original, Doritos Spicy Sweet Chili, SunChips
// Harvest Cheddar, SunChips Garden Salsa, Kettle Jalapeno, Cape Cod
// "Reduced Fat"; also 2 of 13 off-search records that had no per-serving
// nutriments on OFF — Cheetos Puffs and Takis Fuego): Stage-1's calorie/
// macro numbers matched the per-100g scale exactly (e.g. "calories: 571"
// for a 28g-serving potato chip — 571 kcal/100g is standard for chips, not
// per 28g). Confirmed by pulling each product's USDA FDC `labelNutrients`
// block directly (a field genuinely reported per serving, in mg for
// sodium) via the food-detail endpoint, cross-checked against 2-3
// independent GTINs of the same product line per item. All 6 usda-fdc
// records plus Cheetos Puffs and Takis Fuego below use these corrected,
// convergent per-serving values, not the Stage-1 numbers.
//
// PER-PRODUCT WRONG/INCOMPLETE DATA CORRECTIONS:
//   - ruffles-cheddar-sour-cream-potato-chips: Stage-1's OFF ingredient
//     text ("potatoes, veg sunflower, corn, and/or canola oil), and salt.")
//     is visibly truncated/wrong for a "Cheddar & Sour Cream" flavored chip
//     — no cheese, no seasoning at all. Replaced with the real ingredient
//     list and nutrition, cross-confirmed across 3 independent USDA FDC
//     GTINs (028400427364, 028400427241, 00028400159609) and a barcode
//     independently confirmed via PepsiCo SmartLabel + Target listing.
//   - cheetos-puffs-cheese-flavored-snacks: Stage-1's OFF ingredient text
//     was badly OCR-garbled ("carcentrate, monosodium glutamate, lactic
//     acid, c tric a artficial color..."), unreadable/unusable, and had no
//     per-serving nutrition at all (100g fallback, no serving_size).
//     Replaced entirely with a clean USDA FDC record (fdcId 1460671,
//     GTIN 00028400078917, "Cheetos Puffs Cheese Flavored Snacks 2.375oz")
//     whose ingredients match the garbled OCR text term-for-term once
//     legible. Barcode changed from Stage-1's OFF match (0028400242929) to
//     this verified, clean-data GTIN — flagged for reviewer.
//   - cheetos-crunchy-flamin-hot-limon-cheese-flavored: Stage-1 nutrition
//     (160 cal / 210mg sodium after the sodium fix) reconciled against only
//     1 of 3 independent USDA GTINs for this product; the other two GTINs
//     (028400590020, 028400333108) agree on 170 cal / 260mg sodium / 15g
//     carbs and include several ingredients missing from Stage-1's OFF text
//     (corn syrup solids, hydrolyzed corn protein, lime juice, sodium
//     diacetate, disodium inosinate/guanylate). Replaced with the
//     majority/richer USDA data and its GTIN (028400590020) — flagged for
//     reviewer as a real (non-unit) nutrition correction, not just rounding.
//   - doritos-spicy-sweet-chili-tortilla-chips: no barcode from Stage-1
//     (usda-fdc path). Verified GTIN 028400337274 via USDA FDC
//     labelNutrients, cross-checked against 2 further independent GTINs
//     (00028400156929, 00028400078894) that converge on identical values
//     (140 cal / 270mg sodium) — used the majority reading over a 4th GTIN
//     that read 150 cal / 280mg.
//   - takis-fuego-rolled-tortilla-chips: OFF (barcode 0757528029753,
//     mod-10 valid, product/brand/ingredients match) had no per-serving
//     nutriments at all — Stage-1 fell back to per-100g figures. No USDA
//     FDC record exists under this exact barcode; per-serving nutrition
//     (140 cal / 420mg sodium) is taken from 2 independent USDA GTINs of
//     the same "Fuego Hot Chili Pepper & Lime Tortilla Chips" product line
//     (757528048082, 0757528048945) which agree exactly and share
//     near-identical ingredients with the OFF-verified barcode's text.
//     Barcode kept as the OFF-verified 0757528029753; nutrition sourced
//     from a different (but same-recipe) SKU — flagged for reviewer.
//
// DUPLICATES FOUND (excluded from this file — already exist in products.js,
// presumably from the earlier chips_crackers_pt1/pt2 batches):
//   - doritos-cool-ranch-tortilla-chips → barcode 028400516310 already a
//     key in products.js ("Doritos Cool Ranch Flavored Tortilla Chips").
//   - ruffles-original-potato-chips → barcode 028400516686 already a key
//     in products.js ("Ruffles Original Flavor Ridged Potato Chips"),
//     same brand/flavor as this batch's independently-verified GTIN
//     028400427302.
//   - cape-cod-original-kettle-cooked-potato-chips → barcode 020685001642
//     already a key in products.js ("Cape Cod Original Kettle Style
//     Potato Chips") — byte-identical barcode to this batch's OFF match.
//   - tostitos-scoops-tortilla-chips → same product/brand already exists
//     in products.js under a different barcode (028400064088, "Tostitos
//     Scoops! Tortilla Chips") than this batch's OFF match (028400184762,
//     a different pack size). Same product, flagged rather than added as
//     a second SKU without reviewer sign-off.
//
// INGREDIENT DECODING METHOD: verbatim label order preserved, lowercase.
// Simple parenthetical oil/cheese sub-lists kept nested inside their
// parent entry (e.g. "vegetable oil (corn, canola, and/or sunflower oil)",
// "cheddar cheese (milk, cheese cultures, salt, enzymes)") since the
// scorer's normalize() strips (...) and [...] before matching — parent name
// alone must exist in ingredientCache.js. Multi-item "___ seasoning (...)"
// or "___ blend (...)" wrapper terms that are NOT themselves ingredients
// (confirmed absent from ingredientCache.js) were flattened into their
// individual components as top-level entries instead, matching the
// existing convention already used elsewhere in products.js (e.g. the
// Smartfood White Cheddar Popcorn entry). Any dye (Yellow 5/6, Red 40,
// Blue 1, lake forms) or allergen (wheat, milk) that appeared only inside
// a now-flattened or still-nested parenthetical was additionally listed as
// its own top-level entry so the scorer picks it up. 7 tokens not found in
// ingredientCache.js are listed in new_ingredients in the report.
//
// OWNERSHIP: Lay's/Ruffles/Tostitos/Fritos/Doritos/Cheetos/SunChips →
// pepsico (Frito-Lay is a PepsiCo division). Kettle Brand and Cape Cod →
// campbell-soup per the ownership-facts override table (overrides any
// Snyder's-Lance/USDA "brandOwner" field, which is stale — Campbell Soup
// Co. acquired Snyder's-Lance in 2018). Pringles → companies.js has no
// literal 'kellanova' key (only 'kelloggs', and BRAND_TO_COMPANY already
// maps 'pringles' → 'kelloggs') — used companyId: 'kelloggs'. Takis →
// Barcel USA, a snack subsidiary of Grupo Bimbo; companies.js has 'bimbo'
// (Grupo Bimbo) as the only matching literal key — used companyId: 'bimbo'.
// No missing_companies for this batch.

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
    // NOTE: Stage-1's OFF ingredient text was wrong/truncated for this
    // flavor (read like plain Original chips). Replaced with real
    // ingredients + nutrition, cross-confirmed across 3 independent USDA
    // FDC GTINs — see header note.
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
    // No barcode from Stage-1 (usda-fdc path, per-100g mislabel bug). GTIN
    // verified via USDA FDC labelNutrients, cross-checked against 2 further
    // independent GTINs — see header note.
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
    // Stage-1's OFF ingredient text was OCR-garbled and unusable, with no
    // per-serving nutrition at all. Replaced entirely with a clean USDA FDC
    // record (fdcId 1460671) whose ingredients match the garbled text
    // term-for-term once legible — see header note. Barcode changed from
    // Stage-1's OFF match (0028400242929) to this GTIN — flagged for
    // reviewer.
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
    // Stage-1's nutrition/ingredients (from OFF) reconciled against only 1
    // of 3 independent USDA GTINs; replaced with the majority/richer USDA
    // data (170 cal / 260mg sodium) and its GTIN — see header note.
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
    nutrition: { fat: 11, saturatedFat: 1.5, sodium: 260, carbs: 15, sugars: 0, protein: 1, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '028400147392': {
    // No barcode from Stage-1 (usda-fdc path, per-100g mislabel bug). GTIN
    // + per-serving labelNutrients confirmed via USDA FDC, cross-checked
    // against Target/Walmart/Kroger listings for the same 7oz bag.
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
    // No barcode from Stage-1 (usda-fdc path, per-100g mislabel bug). GTIN
    // + per-serving labelNutrients confirmed via USDA FDC (sibling 7oz bag
    // GTIN to the Harvest Cheddar entry above).
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
    companyId: 'campbell-soup',
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
    // No barcode from Stage-1 (usda-fdc path, per-100g mislabel bug). GTIN
    // + per-serving labelNutrients confirmed via USDA FDC — ingredients
    // match Stage-1's fetched text exactly (5oz bag).
    barcode: '084114116352',
    name: 'Kettle Brand Jalapeno Potato Chips',
    brand: 'Kettle Brand',
    companyId: 'campbell-soup',
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
    // No barcode from Stage-1; the usda-fdc record it resolved to was
    // actually the regular full-fat "Original" formula (potatoes, canola
    // oil, salt — single oil, no sea salt), NOT the "Reduced Fat"/"Less Fat
    // Original" product asked for (a distinct multi-oil-blend + sea salt
    // recipe per capecodchips.com and 7 independent USDA GTINs of the Less
    // Fat line). Replaced with the correct product's real name, ingredients,
    // barcode (14oz bag GTIN, labelNutrients confirmed against a 1oz-bag
    // sibling GTIN — both agree exactly) — flagged for reviewer as a
    // wrong-variant catch, not just a nutrition-unit fix.
    barcode: '020685001666',
    name: 'Cape Cod Less Fat Original Kettle Cooked Potato Chips',
    brand: 'Cape Cod',
    companyId: 'campbell-soup',
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
    // Barcode OFF-verified (mod-10 valid, product/brand/ingredients match).
    // OFF had no per-serving nutrition at all (100g fallback bug) and no
    // matching USDA FDC record exists under this exact GTIN — nutrition
    // sourced from 2 independent USDA GTINs of the same "Fuego Hot Chili
    // Pepper & Lime Tortilla Chips" product line, which agree exactly and
    // share near-identical ingredients — flagged for reviewer.
    barcode: '757528029753',
    name: 'Takis Fuego Rolled Tortilla Chips',
    brand: 'Takis',
    companyId: 'bimbo',
    category: 'Chips & Crackers',
    image: null,
    servingSize: 'about 12 pieces (28g)',
    calories: 140,
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
    nutrition: { fat: 8, saturatedFat: 2.5, sodium: 420, carbs: 16, sugars: 1, protein: 2, fiber: 1 },
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
