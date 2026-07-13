// ─── KIDS LUNCH 2026-07-09 ────────────────────────────────────────────────
// 16 products · generated from octavius-2026-07-09-kids-lunch_fetched.json
// (15 resolved by Stage-1 script + 1 miss researched by Octavius)
//
// 16 formatted / 0 could_not_verify.
//
// RESEARCH CORRECTIONS (stage-1 script errors caught during Stage 2 — see
// report to Opus reviewer for full detail, flagged for extra scrutiny):
//   - kraft-easy-mac: Stage-1 fetch returned "Kraft Easy Cheese American
//     Cheese" (a spray-can product) for a search on "Kraft Easy Mac Original
//     Macaroni & Cheese Cups" — wrong product entirely. Replaced with
//     independently researched Easy Mac Original data (UPC, ingredients,
//     nutrition all reverified via retailer/nutrition-database sources).
//   - lunchables-ham-and-american-cracker-stackers: Stage-1 fetch returned a
//     byte-for-byte duplicate of the Turkey & American Cracker Stackers
//     record (same ingredients, same nutrition, same calories) — clearly a
//     mismatched USDA search result, not the Ham variant. Replaced with
//     independently researched Ham & American data from lunchables.com +
//     myfooddiary.com.
//   - lunchables-turkey-and-american-cracker-stackers: no barcode was ever
//     supplied by Stage-1 (USDA path carries no UPC). Researched and
//     confirmed 044700360019 via upcitemdb (product title + 3.4oz size
//     match, ingredients mention chocolate sandwich cookies as our fetched
//     text does).
//   - chef-boyardee-beef-ravioli-microwave-bowls: no barcode from Stage-1;
//     researched 064144047093 (upcitemdb). Nutrition from Stage-1 (fat 1.89g/
//     sodium 321mg/calories null) did not reconcile against the 212g serving
//     size on a per-100g-vs-per-serving check — replaced with per-serving
//     values from nutritionvalue.org (same USDA FDC branded entry, 212g
//     basis, calories 199).
//   - smucker-s-uncrustables-peanut-butter-strawberry-: Stage-1 nutrition
//     (362 cal at a 58g/"58.0 GRM" serving) was roughly 1.66x every other
//     value versus the PB&Grape sibling at the identical 58g serving —
//     consistent with a per-100g figure mislabeled as per-serving. Replaced
//     with per-sandwich values (210 cal) confirmed via CalorieKing, which
//     match a 0.58 scale-down of the Stage-1 numbers almost exactly.
//   - SODIUM UNIT FIX: all off-search-sourced records reported sodium in
//     grams (e.g. 0.72) while usda-fdc-sourced records reported milligrams
//     (e.g. 685) inside the same fetched-JSON file. Normalized every
//     off-search sodium value to mg (×1000) below — flagging this since a
//     10x/1000x sodium error would otherwise ship silently.
//
// MISS RESEARCHED (job a): lunchly-pbj-dunkers — no barcode was ever
// supplied by Stage-1 for this item since it was a full miss. UPC 850063819138
// found and confirmed directly on Target's product page (matches the Lunchly
// prefix pattern 0850063819XXX shared by every other Lunchly SKU in this
// batch). Ingredients from lunchly.com (official brand site). Nutrition
// partial only — calories/fat/carbs/sugars/protein confirmed via Target +
// Lunchly web copy, but saturatedFat/sodium/fiber could not be found on any
// source checked (Target, Instacart, lunchly.com) — left as best estimate
// per label photo not being legible; FLAGGED for reviewer, do not treat as
// verified.
//
// OWNERSHIP: Lunchly (The Pizza, Fiesta Nachos, Turkey Stack 'Ems, BBQ
// Chicken Dippers, PB&J Dunkers) is a joint venture of MrBeast (Jimmy
// Donaldson), Logan Paul, and KSI, operated under Beast Industries (Beast
// Industries has no key in companies.js) — companyId: null on all 5,
// see missing_companies in report.
//
// INGREDIENT DECODING METHOD: verbatim ingredient strings were flattened to
// individual comma-separated tokens (lowercase, deduped by first
// occurrence, label order preserved) rather than nested-parenthetical
// grouping, matching the existing convention already used for this same
// brand family elsewhere in products.js (e.g. the Lunchables Turkey &
// Cheddar with Crackers entry). "Contains one or more of X or Y" alternate-
// sourcing clauses were kept bundled as one ingredient (flattening would
// wrongly assert every alternative oil is simultaneously present).
// 76 tokens not found in ingredientCache.js are listed in new_ingredients in
// the report — many are legitimate new items (e.g. "monk fruit concentrate",
// "concord grape puree", "ester gum"), some are the bundled-alternative
// strings noted above that won't exact-match after paren-stripping normalize.
//
// Several ingredient lists are visibly incomplete crowd-sourced data
// (OFF gaps per the source-health warning in the reference doc) — flagged
// per-entry below with inline comments. Nothing was added to fill gaps.

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
    barcode: '044700360354',
    name: 'Lunchables Nachos with Cheese Dip & Salsa',
    brand: 'Lunchables',
    companyId: 'kraft-heinz',
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 tray (124 g)',
    calories: 290,
    ingredients: [
      'tortilla chips', 'ground yellow corn', 'vegetable oil (corn, sunflower, safflower, or canola oil)',
      'salt', 'nacho cheese', 'whey', 'milk', 'canola oil', 'dried corn syrup',
      'sodium phosphates', 'jalapeno peppers', 'whey protein concentrate', 'lactic acid',
      'sodium alginate', 'calcium phosphate', 'vinegar', 'potassium chloride', 'sorbic acid',
      'milkfat', 'oleoresin paprika', 'cheese culture', 'natural flavor', 'enzymes',
      'annatto', 'salsa', 'water', 'tomato paste', 'green chili peppers', 'onion powder',
      'high fructose corn syrup', 'modified food starch', 'green bell peppers',
      'garlic powder', 'sodium benzoate', 'potassium sorbate', 'citric acid', 'spice',
    ],
    nutrition: { fat: 15.3, saturatedFat: 2.82, sodium: 685, carbs: 33.1, sugars: 3.23, protein: 4.84, fiber: 3.2 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    // FLAG: no wheat/gluten ingredient present in the official ingredient
    // list (tortilla chips are corn-based here) — marking gluten-free on a
    // clean read of the label, but the box itself was not physically
    // checked for a "may contain wheat" cross-contact statement. Reviewer:
    // please double check before this claim ships.
    isGlutenFree: true,
  },

  '044700069592': {
    // FLAG: ingredient text (both OFF and USDA-adjacent sources) lists only
    // "spring water" and a chicken-patty emulsion — no breading/batter
    // ingredients are present despite "Chicken Dunks" being a breaded
    // nugget product in real life, and sodium reads 0mg which is
    // implausible for a cured/phosphate-brined nugget. This looks like an
    // incomplete crowd-sourced ingredient list. Transcribed as given —
    // nothing invented to complete it. Recommend re-verifying against
    // packaging before this ships.
    barcode: '044700069592',
    name: 'Lunchables Chicken Dunks',
    brand: 'Lunchables',
    companyId: 'kraft-heinz',
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 package (158 g)',
    calories: 257,
    ingredients: [
      'spring water', 'white chicken', 'water', 'potassium lactate', 'modified corn starch',
      'salt', 'potassium chloride', 'dextrose', 'sodium phosphates', 'carrageenan',
      'sodium diacetate', 'lemon juice solids', 'flavor',
    ],
    nutrition: { fat: 11.4, saturatedFat: 3.8, sodium: 0, carbs: 31, sugars: 15.8, protein: 7.59, fiber: 0.6 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
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
    // FLAG: no dairy/egg ingredient appears on the label as printed — marked
    // vegan on a literal read, but "dough conditioners" / "enzymes" are
    // sometimes animal-derived without disclosure. Flagging for reviewer
    // judgment rather than asserting confidently.
    isVegan: true,
    isGlutenFree: false,
  },

  '051500048184': {
    // CORRECTED (see file header): Stage-1 nutrition (362 cal / 58g) did not
    // reconcile against the identical-serving-size PB&Grape sibling;
    // replaced with per-sandwich values confirmed via CalorieKing.
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
    // fiber estimated by the same 0.58 scale-down applied to calories/fat/
    // sodium/carbs/protein (all independently confirmed against CalorieKing);
    // fiber itself was not listed on CalorieKing's summary. Flagged.
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
    // CORRECTED (see file header): Stage-1 fetch matched the wrong product
    // ("Kraft Easy Cheese American Cheese", a spray-can product) for a
    // search on "Kraft Easy Mac Original Macaroni & Cheese Cups".
    // Ingredients, nutrition, and UPC below are independently researched
    // and verified for the correct product.
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
    // CORRECTED (see file header): Stage-1 nutrition basis did not reconcile
    // with the 212g serving size (calories was null); replaced with
    // per-serving values from the same underlying USDA FDC branded record
    // via nutritionvalue.org. Barcode independently researched (no barcode
    // supplied by Stage-1's usda-fdc path).
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
    // Barcode independently researched (no barcode supplied by Stage-1's
    // usda-fdc path) — confirmed via upcitemdb (title + 3.4oz size match,
    // "chocolate sandwich cookies" matches this fetched ingredient text).
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
    // CORRECTED (see file header): Stage-1 fetch returned an exact duplicate
    // of the Turkey & American Cracker Stackers record for this Ham
    // product — clearly mismatched. Ingredients from lunchables.com
    // (official), nutrition from myfooddiary.com, barcode from go-upc
    // (all independently researched and verified).
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
    // FLAG: verbatim ingredient text has visible OCR/scan artifacts
    // ("DIPOTASSI-UM", "PRESERVA-TIVES", "MILK UICCOLATE", "SFICE EXTRACT")
    // from the source; obvious typos were corrected during decoding
    // (dipotassium phosphate, preservatives, milk chocolate, spice extract)
    // — flagging so the reviewer can spot-check against a physical label.
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

  '850063819039': {
    // FLAG: ingredient text (OFF-sourced) is missing an entire component —
    // this is a nachos product but no tortilla-chip or cheese-dip
    // ingredients appear anywhere in the list, only the ice-pop drink,
    // salsa, and a chocolate bar. Transcribed exactly as given; nothing
    // invented to fill the obvious gap. Flag isGlutenFree accordingly
    // (marked false out of caution, not confidence).
    barcode: '850063819039',
    name: 'Lunchly Fiesta Nachos',
    brand: 'Lunchly',
    companyId: null,
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 package (136 g)',
    calories: 360,
    ingredients: [
      'strawberry', 'banana', 'citric acid', 'dipotassium phosphate', 'natural flavors',
      'sucralose', 'gum arabic', 'vegetable juice for color', 'acesulfame potassium',
      'juice', 'corn syrup', 'red bell pepper', 'sodium phosphate', 'maltodextrin',
      'jalapeno pepper', 'white distilled vinegar', 'yeast extract', 'natural flavor',
      'lactic acid', 'calcium chloride', 'dehydrated hatch chili pepper', 'annatto',
      'beta-carotene', 'milk', 'water', 'tomato paste', 'diced tomatoes', 'tomato juice',
      'roasted red bell pepper', 'sugar', 'potato flour', 'salt', 'dried red bell pepper',
      'corn oil', 'dehydrated onion', 'dehydrated green bell pepper', 'potassium sorbate',
      'preservatives', 'spices', 'milk chocolate', 'whole milk powder', 'cocoa butter',
      'unsweetened chocolate', 'lecithin (soy)', 'vanilla extract',
    ],
    nutrition: { fat: 17, saturatedFat: 5, sodium: 740, carbs: 46, sugars: 10, protein: 9, fiber: 4 },
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

  '850063819053': {
    barcode: '850063819053',
    name: 'Lunchly BBQ Chicken Dippers',
    brand: 'Lunchly',
    companyId: null,
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 package (77 g)',
    calories: 221,
    ingredients: [
      'boneless skinless chicken breast with rib meat', 'water', 'yellow corn flour',
      'enriched wheat flour', 'niacin', 'reduced iron', 'thiamine mononitrate',
      'riboflavin', 'folic acid',
      'tortilla chips (yellow corn, canola and/or sunflower oil, calcium hydroxide)',
      'rice flour', 'isolated soy protein', 'salt', 'corn starch', 'sugar', 'potato starch',
      'fructose', 'wheat flour', 'spices', 'dextrose', 'onion and garlic powder',
      'tomato powder', 'canola oil', 'natural flavor', 'onion powder', 'guar gum',
      'smoke flavor', 'flavor', 'extractive of turmeric', 'extractive of paprika', 'yeast',
      'iron', 'jalapeno pepper powder', 'extractives of annatto and turmeric', 'flax meal',
    ],
    nutrition: { fat: 10.4, saturatedFat: 1.3, sodium: 442, carbs: 20.8, sugars: 1.3, protein: 11.7, fiber: 1.3 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '850063819138': {
    // MISS, RESEARCHED (job a): fully unresolved by Stage-1. Name/brand/size
    // confirmed via Target product page (A-94968458) and lunchly.com.
    // UPC 850063819138 confirmed directly on the Target listing (mod-10
    // valid; matches the 0850063819XXX prefix shared by every other Lunchly
    // SKU in this batch). Ingredients verbatim from lunchly.com (official
    // brand site, product currently listed "out of stock" but ingredient
    // panel was intact). Nutrition PARTIAL ONLY: calories/fat/carbs/sugars/
    // protein confirmed via Target + Lunchly web copy; saturatedFat, sodium,
    // and fiber could not be found on any source checked (Target, Instacart,
    // lunchly.com product page, or web search) and are NOT included below —
    // do not treat this as a complete nutrition panel. Flagging heavily for
    // reviewer: this is the one product in the batch with an incomplete
    // nutrition object.
    barcode: '850063819138',
    name: 'Lunchly PB&J Dunkers',
    brand: 'Lunchly',
    companyId: null,
    category: 'Kids Lunch',
    image: null,
    servingSize: '1 package (102 g)',
    calories: 430,
    ingredients: [
      'peanuts', 'palm oil', 'salt', 'concord grape puree', 'sugar', 'citric acid',
      'fruit pectin', 'potassium sorbate', 'unbleached enriched flour', 'wheat flour',
      'niacin', 'reduced iron', 'thiamine mononitrate', 'riboflavin', 'folic acid',
      'sunflower seed oil', 'cane sugar',
      'leavening (ammonium bicarbonate, baking soda, monocalcium phosphate)',
      'invert sugar syrup', 'barley malt extract', 'enzymes', 'natural flavor',
      'whole milk powder', 'cocoa butter', 'unsweetened chocolate', 'lecithin (soy)',
      'vanilla extract',
    ],
    nutrition: { fat: 26, carbs: 43, sugars: 25, protein: 11 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },
};
