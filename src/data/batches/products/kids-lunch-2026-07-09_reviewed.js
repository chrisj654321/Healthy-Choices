// ─── KIDS LUNCH 2026-07-09 — OPUS-REVIEWED ────────────────────────────────
// Stage 3 independent review of kids-lunch-2026-07-09_formatted.js.
// Input: 16 formatted entries. Output: 12 ship-ready (11 PASS + 1 FIXED),
// 4 DROPPED (see REJECTS below).
//
// REJECTS (dropped from this file — do NOT ship; re-add later from a real
// label, not crowd-sourced OFF/USDA gaps):
//   1. Lunchables Chicken Dunks (044700069592) — sodium read 0 mg AND the
//      ingredient list is only "spring water + a chicken-patty emulsion":
//      no breading, no crackers/BBQ-sauce/drink/dessert that the kit
//      actually contains. Because the scorer skips the sodium penalty when
//      sodium is 0 or missing (scorer.js L856), this would ship a falsely
//      healthy grade on a materially incomplete ingredient list.
//   2. Lunchly Fiesta Nachos (850063819039) — OFF ingredient list is missing
//      the two defining components (tortilla chips AND nacho-cheese dip);
//      only the ice-pop drink, salsa, and a chocolate bar are present. The
//      health grade would be computed on the wrong ingredients.
//   3. Lunchly BBQ Chicken Dippers (850063819053) — the fetched record is a
//      DIFFERENT product: a "YUMMY"-brand Smoky BBQ Chicken Dippers USDA
//      entry (tortilla chips, isolated soy protein, flax meal — a standalone
//      frozen-chicken product with no Lunchly drink or chocolate bar).
//      Octavius mapped that product's ingredients/nutrition onto the Lunchly
//      name + a pattern-guessed barcode. Wrong-product substitution.
//   4. Lunchly PB&J Dunkers (850063819138) — nutrition is missing BOTH
//      saturatedFat and sodium; per scorer.js L856-860 the product would
//      dodge both penalties and receive a materially inflated grade. Also
//      unverifiable (miss research) and its ingredient list omits the
//      signature drink every other Lunchly kit carries.
//
// FIX applied:
//   - Lunchables Nachos Cheese Dip & Salsa (044700360354): ingredient array
//     had fabrications/drops vs. the verbatim label — "vegetable oil (corn,
//     sunflower, safflower, or canola oil)" invented safflower+canola and
//     dropped soybean (label says "corn, sunflower or soybean oil");
//     "apocarotenal (color)" had been rendered as "annatto"; "corn bran" was
//     dropped; "dehydrated onions" had been changed to "onion powder".
//     Corrected all four to match the verbatim string.
//
// FOUNDER NOTES before ship:
//   - Several surviving entries carry INDEPENDENTLY-RESEARCHED barcodes that
//     the reviewer could NOT re-verify this session (WebSearch/WebFetch hit
//     the session limit). Kraft Easy Mac 021000012534 WAS confirmed correct
//     via go-upc/upcitemdb. Still unverified by the reviewer: Chef Boyardee
//     064144047093, Lunchables Turkey Stackers 044700360019, Lunchables Ham
//     Stackers 044700103210, Uncrustables Strawberry 051500048184, and the
//     Nachos barcode 044700360354 (which was not even documented in
//     Octavius's own correction log). All pass mod-10; spot-check before ship.
//   - Ham & American Cracker Stackers (044700103210) ingredients/nutrition
//     are fully Octavius-researched (Stage-1 returned a duplicate); the token
//     "potassium salt" is unusual (likely potassium chloride) — spot-check.
//   - isVegan:true on both Uncrustables and isGlutenFree:true on the Nachos
//     are literal-ingredient reads consistent with existing house convention
//     (the DB marks these true 344×/398×). Defensible, but none are
//     manufacturer-certified — mono-/diglycerides, DATEM and enzymes can be
//     animal-derived, and the Nachos was not checked for a cross-contact
//     "may contain wheat" statement.
//
// ── original decoding notes retained below ──
// INGREDIENT DECODING METHOD: verbatim strings flattened to comma-separated
// tokens (lowercase, deduped by first occurrence, label order preserved),
// matching the existing Lunchables convention in products.js. "Contains one
// or more of X or Y" alternate-sourcing clauses kept bundled as one token.
// SODIUM UNIT FIX: off-search records reported sodium in grams, usda-fdc in
// mg, inside the same fetched file; every off-search value normalized to mg.

module.exports = {
  '044700361139': {
    barcode: '044700361139',
    name: 'Lunchables Fun Pack Pepperoni Pizza with Capri Sun Fruit Punch and Crunch Bar',
    brand: 'Lunchables',
    companyId: 'kraft-heinz',
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 serving (100 g)',
    calories: 420,
    ingredients: [
      'filtered water', 'sugar', 'pear juice concentrate', 'grape juice concentrate',
      'orange juice concentrate', 'citric acid', 'monk fruit concentrate',
      'apple juice concentrate', 'pineapple juice concentrate', 'natural flavor',
      'mushroom extract', 'wheat flour', 'niacin', 'reduced iron', 'thiamin mononitrate',
      'riboflavin', 'folic acid', 'whole wheat flour', 'water', 'glycerin', 'soybean oil',
      'vital wheat gluten', 'mono- and diglycerides', 'salt', 'xanthan gum',
      'calcium propionate', 'sorbic acid', 'natural and artificial flavor', 'enzyme',
      'tomato paste', 'canola oil', 'modified food starch', 'garlic powder', 'onion powder',
      'spices', 'dried basil', 'sea salt', 'sodium benzoate', 'potassium sorbate',
      'pepperoni made with pork and chicken', 'pork', 'mechanically separated chicken',
      'dextrose', 'lactic acid starter culture', 'oleoresin paprika', 'flavoring',
      'sodium ascorbate', 'sodium nitrite', 'bha', 'bht', 'mozzarella cheese',
      'part-skim milk', 'milk protein concentrate', 'milkfat', 'cheese culture',
      'sodium citrate', 'vitamin a palmitate', 'cellulose powder', 'milk chocolate',
      'chocolate', 'cocoa butter', 'nonfat milk', 'lactose', 'soy lecithin',
      'caramel color', 'barley malt extract',
    ],
    nutrition: { fat: 19, saturatedFat: 8, sodium: 720, carbs: 49, sugars: 23, protein: 14, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '044700361146': {
    // NOTE: OFF ingredient text appears truncated — ends mid sub-list at
    // "mozzarella pasteurized prepared cheese product" with no further
    // breakdown. Transcribed as given; nothing invented to complete it.
    barcode: '044700361146',
    name: 'Lunchables Extra Cheesy Pizza Fun Pack',
    brand: 'Lunchables',
    companyId: 'kraft-heinz',
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 serving (130 g)',
    calories: 330,
    ingredients: [
      'mixed fruit flavored juice drink blend from concentrate', 'pizza crust', 'water',
      'sugar', 'glycerin', 'soybean oil', 'yeast', 'vital wheat gluten',
      'mono- and diglycerides', 'salt', 'xanthan gum', 'calcium propionate', 'sorbic acid',
      'natural and artificial flavor', 'mozzarella pasteurized prepared cheese product',
    ],
    nutrition: { fat: 9, saturatedFat: 5, sodium: 500, carbs: 50, sugars: 22, protein: 13, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '044700360354': {
    // REVIEWER FIX: ingredient array corrected to match the verbatim label —
    // restored "vegetable oil (corn, sunflower, or soybean oil)" (the prior
    // "safflower, or canola oil" was invented and dropped soybean), restored
    // "corn bran", changed "annatto" back to the label's "apocarotenal", and
    // "onion powder" back to "dehydrated onions".
    barcode: '044700360354',
    name: 'Lunchables Nachos with Cheese Dip & Salsa',
    brand: 'Lunchables',
    companyId: 'kraft-heinz',
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 tray (124 g)',
    calories: 290,
    ingredients: [
      'tortilla chips', 'ground yellow corn', 'vegetable oil (corn, sunflower, or soybean oil)',
      'corn bran', 'salt', 'nacho cheese', 'whey', 'milk', 'canola oil', 'dried corn syrup',
      'water', 'sodium phosphates', 'jalapeno peppers', 'whey protein concentrate',
      'lactic acid', 'milkfat', 'sodium alginate', 'vinegar', 'calcium phosphate',
      'potassium chloride', 'sorbic acid', 'cheese culture', 'enzymes', 'natural flavor',
      'apocarotenal', 'salsa', 'tomato paste', 'green chili peppers', 'dehydrated onions',
      'high fructose corn syrup', 'modified food starch', 'green bell peppers',
      'garlic powder', 'sodium benzoate', 'potassium sorbate', 'citric acid', 'spice',
    ],
    nutrition: { fat: 15.3, saturatedFat: 2.82, sodium: 685, carbs: 33.1, sugars: 3.23, protein: 4.84, fiber: 3.2 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    // Literal-read gluten-free (corn-based chips, no wheat/barley/rye in the
    // list) consistent with house convention; not manufacturer-certified and
    // the box was not checked for a "may contain wheat" cross-contact line.
    isGlutenFree: true,
  },

  '051500048177': {
    barcode: '051500048177',
    name: "Smucker's Uncrustables Peanut Butter & Grape Jelly Sandwich",
    brand: "Smucker's Uncrustables",
    companyId: 'jm-smucker',
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 sandwich (58 g)',
    calories: 218,
    ingredients: [
      'enriched unbleached flour', 'wheat flour', 'malted barley flour', 'niacin',
      'ferrous sulfate', 'thiamin mononitrate', 'riboflavin', 'folic acid', 'water',
      'unbleached whole wheat flour', 'sugar', 'yeast', 'soybean oil', 'salt',
      'dough conditioners', 'distilled mono and diglycerides', 'datem', 'enzymes',
      'wheat starch', 'ascorbic acid', 'calcium peroxide', 'peanuts', 'molasses',
      'fully hydrogenated vegetable oils (rapeseed and soybean)', 'mono and diglycerides',
      'grape juice', 'pectin', 'citric acid', 'potassium sorbate',
    ],
    nutrition: { fat: 9, saturatedFat: 2, sodium: 220, carbs: 28, sugars: 10, protein: 6, fiber: 2 },
    certifications: [],
    isOrganic: false,
    // Literal-read vegan (no dairy/egg/honey on the label); consistent with
    // house convention but not certified — mono-/diglycerides, DATEM and
    // enzymes can be animal-derived without disclosure.
    isVegan: true,
    isGlutenFree: false,
  },

  '051500048184': {
    // CORRECTED (Stage 2): Stage-1 nutrition (362 cal / 58g) did not reconcile
    // against the identical-serving PB&Grape sibling; replaced with
    // per-sandwich values confirmed via CalorieKing. Barcode Octavius-
    // researched — reviewer could not re-verify this session; spot-check.
    barcode: '051500048184',
    name: "Smucker's Uncrustables Peanut Butter & Strawberry Jam Sandwich",
    brand: "Smucker's Uncrustables",
    companyId: 'jm-smucker',
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 sandwich (58 g)',
    calories: 210,
    ingredients: [
      'enriched unbleached flour', 'wheat flour', 'malted barley flour', 'niacin',
      'ferrous sulfate', 'thiamin mononitrate', 'riboflavin', 'folic acid', 'water',
      'unbleached whole wheat flour', 'sugar', 'yeast', 'soybean oil', 'wheat gluten',
      'salt', 'guar gum', 'dough conditioner', 'enzymes', 'ascorbic acid',
      'calcium peroxide', 'peanuts', 'fully hydrogenated vegetable oils (rapeseed and soybean)',
      'molasses', 'strawberries', 'pectin', 'citric acid', 'potassium sorbate',
    ],
    nutrition: { fat: 9, saturatedFat: 2, sodium: 220, carbs: 28, sugars: 9, protein: 6, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: false,
  },

  '013562479665': {
    barcode: '013562479665',
    name: "Annie's Organic Real Aged Cheddar Macaroni & Cheese Cup",
    brand: "Annie's",
    companyId: 'general-mills',
    category: 'Packaged Meals',
    image: null,
    servingSize: '1 package (57 g)',
    calories: 220,
    ingredients: [
      'organic pasta', 'organic wheat flour', 'organic whole grain wheat flour',
      'organic tapioca starch', 'organic dried cheddar cheese', 'pasteurized organic milk',
      'salt', 'non-animal enzymes', 'organic nonfat milk', 'organic coconut oil',
      'organic corn starch', 'organic whey', 'organic butter', 'cultured organic milk',
      'potassium chloride', 'organic sunflower lecithin', 'disodium phosphate',
      'organic annatto extract', 'silicon dioxide',
    ],
    nutrition: { fat: 4.5, saturatedFat: 3, sodium: 360, carbs: 37, sugars: 2, protein: 7, fiber: 2 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: false,
    isGlutenFree: false,
  },

  '021000012534': {
    // CORRECTED (Stage 2): Stage-1 matched the wrong product ("Kraft Easy
    // Cheese American Cheese", a spray-can) for this Easy Mac search.
    // Barcode 021000012534 VERIFIED correct by reviewer (go-upc/upcitemdb =
    // Kraft Easy Mac Original). Serving size / calories are Octavius-
    // researched (2.05 oz = ~58 g); spot-check if exactness matters.
    barcode: '021000012534',
    name: 'Kraft Easy Mac Original Macaroni & Cheese Cup',
    brand: 'Kraft',
    companyId: 'kraft-heinz',
    category: 'Packaged Meals',
    image: null,
    servingSize: '1 packet (61 g)',
    calories: 250,
    ingredients: [
      'enriched macaroni product', 'wheat flour', 'glyceryl monostearate', 'niacin',
      'ferrous sulfate', 'thiamin mononitrate', 'riboflavin', 'folic acid', 'whey',
      'corn syrup solids', 'milk', 'milkfat', 'palm oil', 'modified food starch', 'salt',
      'milk protein concentrate', 'maltodextrin', 'calcium carbonate', 'sodium triphosphate',
      'medium chain triglycerides', 'dried buttermilk', 'citric acid', 'sodium phosphate',
      'lactic acid', 'calcium phosphate', 'nonfat dry milk', 'guar gum', 'cheese culture',
      'oleoresin paprika', 'oleoresin turmeric', 'annatto', 'silicon dioxide', 'enzymes',
      'natural flavor', 'xanthan gum', 'acetylated monoglycerides',
    ],
    nutrition: { fat: 4.5, saturatedFat: 2.5, sodium: 580, carbs: 44, sugars: 6, protein: 8, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '064144047093': {
    // CORRECTED (Stage 2): Stage-1 nutrition basis didn't reconcile with the
    // 212g serving (calories was null); replaced with per-serving values from
    // the same USDA FDC branded record via nutritionvalue.org. Barcode
    // Octavius-researched — reviewer could not re-verify this session.
    barcode: '064144047093',
    name: 'Chef Boyardee Beef Ravioli Microwave Bowl',
    brand: 'Chef Boyardee',
    companyId: 'conagra',
    category: 'Packaged Meals',
    image: null,
    servingSize: '1 bowl (212 g)',
    calories: 199,
    ingredients: [
      'tomatoes', 'tomato puree', 'water', 'enriched wheat flour', 'wheat flour',
      'malted barley flour', 'niacin', 'reduced iron', 'thiamine mononitrate', 'riboflavin',
      'folic acid', 'beef', 'crackermeal', 'bleached wheat flour', 'guar gum',
      'high fructose corn syrup', 'salt', 'modified corn starch', 'textured vegetable protein',
      'soy flour', 'soy protein concentrate', 'caramel color', 'soybean oil', 'carrots',
      'dehydrated onion', 'flavorings', 'enzyme modified cheese', 'cheddar cheese',
      'pasteurized milk', 'cultures', 'enzymes', 'cream', 'sodium phosphate', 'xanthan gum',
      'carotenal',
    ],
    nutrition: { fat: 7, saturatedFat: 3, sodium: 750, carbs: 28, sugars: 5, protein: 6, fiber: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '044700360019': {
    // Barcode Octavius-researched (usda-fdc path carries no UPC) — reviewer
    // could not re-verify this session; passes mod-10, spot-check before ship.
    barcode: '044700360019',
    name: 'Lunchables Turkey & American Cracker Stackers',
    brand: 'Lunchables',
    companyId: 'kraft-heinz',
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 package (96 g)',
    calories: 344,
    ingredients: [
      'sugar', 'unbleached enriched flour', 'wheat flour', 'niacin', 'reduced iron',
      'thiamine mononitrate', 'riboflavin', 'folic acid', 'palm and/or canola oil', 'cocoa',
      'high fructose corn syrup', 'cornstarch', 'leavening (baking soda and/or calcium phosphate)',
      'salt', 'soy lecithin', 'vanilla', 'chocolate', 'white turkey', 'water',
      'potassium lactate', 'modified cornstarch', 'dextrose', 'carrageenan',
      'sodium phosphates', 'potassium chloride', 'sodium diacetate', 'flavor',
      'sodium ascorbate', 'smoke flavor', 'sodium nitrite', 'natural and artificial flavor',
      'milk', 'milk protein concentrate', 'whey', 'milkfat', 'whey protein concentrate',
      'sodium citrate', 'lactic acid', 'sorbic acid', 'cheese culture', 'enzymes',
      'oleoresin paprika', 'annatto extract', 'sunflower lecithin', 'enriched flour',
      'palm oil', 'baking soda',
    ],
    nutrition: { fat: 16.7, saturatedFat: 7.29, sodium: 604, carbs: 38.5, sugars: 17.7, protein: 10.4, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '044700103210': {
    // CORRECTED (Stage 2): Stage-1 returned an exact duplicate of the Turkey
    // Stackers record for this Ham product. Ingredients (lunchables.com),
    // nutrition (myfooddiary), and barcode (go-upc) are fully Octavius-
    // researched — reviewer could not re-verify this session. NOTE the token
    // "potassium salt" is unusual (likely potassium chloride); spot-check.
    barcode: '044700103210',
    name: 'Lunchables Ham & American Cracker Stackers',
    brand: 'Lunchables',
    companyId: 'kraft-heinz',
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 tray (91 g)',
    calories: 330,
    ingredients: [
      'ham', 'water', 'potassium lactate', 'salt', 'modified cornstarch', 'potassium salt',
      'sugar', 'sodium phosphates', 'sodium diacetate', 'flavor', 'sodium ascorbate',
      'sodium nitrite', 'smoke flavor', 'enriched wheat flour', 'wheat flour', 'niacin',
      'reduced iron', 'thiamine mononitrate', 'riboflavin', 'folic acid', 'powdered sugar',
      'corn starch', 'shortening (palm oil, canola oil, modified palm oil)', 'cocoa powder',
      'corn syrup', 'corn flour', 'natural flavors', 'sodium bicarbonate', 'soy lecithin',
      'ammonium bicarbonate', 'milk', 'milk protein concentrate', 'milkfat', 'sodium citrate',
      'lactic acid', 'sorbic acid', 'enzymes', 'whey', 'cheese culture', 'oleoresin paprika',
      'annatto', 'sunflower lecithin', 'flour', 'palm oil',
      'vegetable oil (canola, and/or soybean, and/or palm oil)',
      'leavening (baking soda, ammonium bicarbonate, monocalcium phosphate)',
    ],
    // fiber not found on myfooddiary; left unset (undefined) rather than guessed.
    nutrition: { fat: 15, saturatedFat: 7, sodium: 620, carbs: 39, sugars: 18, protein: 11 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '850063819022': {
    // FLAG: verbatim ingredient text had OCR artifacts ("DIPOTASSI-UM",
    // "PRESERVA-TIVES", "MILK UICCOLATE", "SFICE EXTRACT"); obvious typos
    // corrected during decoding (dipotassium phosphate, preservatives, milk
    // chocolate, spice extract). companyId null — Lunchly is a MrBeast/Logan
    // Paul/KSI joint venture under Beast Industries, which has no key in
    // companies.js (correct to leave null rather than miscredit a parent).
    barcode: '850063819022',
    name: 'Lunchly The Pizza',
    brand: 'Lunchly',
    companyId: null,
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 portion (132 g)',
    calories: 360,
    ingredients: [
      'water', 'citric acid', 'dipotassium phosphate', 'natural flavors', 'sucralose',
      'acesulfame potassium', 'gum arabic', 'ester gum', 'd-alpha tocopheryl acetate',
      'pyridoxine hydrochloride', 'retinyl palmitate', 'cyanocobalamin',
      'enriched bleached wheat flour', 'flour', 'niacin', 'reduced iron',
      'thiamine mononitrate', 'riboflavin', 'folic acid',
      'vegetable shortening (interesterified soybean oil, hydrogenated soybean oil)',
      'sugar', 'salt', 'yeast', 'vegetable gums (corn starch, guar gum, xanthan gum)',
      'calcium propionate', 'monoglycerides', 'tomato paste', 'modified corn starch',
      'highly refined soybean oil', 'garlic powder', 'onion powder', 'spices',
      'sodium benzoate', 'potassium sorbate', 'xanthan gum', 'natural flavor',
      'low-moisture part-skim mozzarella cheese', 'cultured pasteurized part-skim milk',
      'enzymes', 'anti-caking blend (potato starch, cellulose)',
      'smoked uncured pepperoni made with pork', 'pork', 'sea salt', 'cane sugar', 'spice',
      'paprika', 'cultured celery extract', 'paprika extract', 'cherry powder',
      'rice concentrate', 'spice extract', 'lactic acid starter culture', 'milk chocolate',
      'whole milk powder', 'cocoa butter', 'unsweetened chocolate', 'lecithin (soy)',
      'vanilla extract', 'crisp rice', 'rice flour',
    ],
    nutrition: { fat: 15, saturatedFat: 7, sodium: 710, carbs: 44, sugars: 12, protein: 12, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '850063819008': {
    barcode: '850063819008',
    name: "Lunchly Turkey Stack 'Ems",
    brand: 'Lunchly',
    companyId: null,
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 package (72 g)',
    calories: 230,
    ingredients: [
      'water', 'citric acid', 'dipotassium phosphate', 'natural flavors', 'sucralose',
      'acesulfame potassium', 'gum arabic', 'ester gum', 'd-alpha tocopheryl acetate',
      'pyridoxine hydrochloride', 'retinyl palmitate', 'cyanocobalamin', 'turkey',
      'sea salt', 'vinegar', 'potato starch', 'cultured celery extract', 'cane sugar',
      'enriched wheat flour', 'flour', 'niacin', 'reduced iron', 'thiamine mononitrate',
      'riboflavin', 'folic acid', 'high oleic sunflower oil', 'sugar', 'salt',
      'leavening (baking soda, monocalcium phosphate)', 'corn syrup', 'soy lecithin',
      'natural flavor', 'pasteurized milk', 'cheese culture', 'enzymes', 'annatto', 'milk',
      'milk chocolate', 'whole milk powder', 'cocoa butter', 'unsweetened chocolate',
      'lecithin (soy)', 'vanilla extract',
    ],
    nutrition: { fat: 12, saturatedFat: 6, sodium: 480, carbs: 22, sugars: 7, protein: 11, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },
};
