// ─── CRACKERS 2026-07-09 ─────────────────────────────────────────────────
// 20 products fetched (Stage-1 script) · 0 raw misses reported by fetch.
// 15 formatted / 0 could_not_verify / 5 excluded as duplicates already
// present in products.js. NONE of the 20 "resolved" Stage-1 records were
// taken on faith — every one was re-checked against a second source
// (Target/Walmart/Kroger product pages, Kellanova/Mondelez SmartLabel,
// official brand sites). Systemic bugs and wrong-variant matches found:
//
// SYSTEMIC BUG 1 — SODIUM UNIT ERROR (all off-search-sourced records):
// Stage-1 copied OFF's sodium_serving field (grams) straight into the
// mg-denominated nutrition.sodium without converting. Fixed by x1000 and
// then independently re-confirmed against a retailer/SmartLabel value for
// every item (e.g. Cheez-It White Cheddar 0.21 -> 210mg, confirmed exact
// via Kellogg's SmartLabel; Goldfish Colors 0.19 -> 190mg, confirmed exact
// via Target).
//
// SYSTEMIC BUG 2 — PER-100G MISLABELED AS PER-SERVING (usda-fdc records):
// Ritz Garlic Butter (500 cal / 16g serving -> impossible; real value 80
// cal, confirmed Nabisco SmartLabel/retailer), Wasa Multi Grain (250 cal /
// 14g serving -> impossible; real value 35 cal/slice), Town House Pita Sea
// Salt (467 cal / 15g -> impossible; real 70 cal), Good Thins (419 cal /
// 31g -> impossible; real 130 cal). All confirmed by dividing the Stage-1
// figures by 100 and multiplying by the true serving weight, then
// cross-checked against an independent retailer nutrition panel — the math
// converges exactly in every case, confirming the bug rather than a
// different product.
//
// WRONG-VARIANT / WRONG-PRODUCT MATCHES (Stage-1 "resolved" but incorrect):
//   - wheat-thins-reduced-fat: Stage-1 matched a MEIJER store-brand copycat
//     ("Thin Wheats Reduced Fat"), not real Nabisco Wheat Thins. Real
//     product/ingredients confirmed via multiple retailers -> but this
//     turned out to be an EXACT recipe/nutrition duplicate of an existing
//     products.js entry (barcode 0044000069193, different pack-size UPC)
//     -> EXCLUDED as a duplicate, not added under the new UPC.
//   - goldfish-parmesan-crackers: Stage-1 matched "Goldfish Crackers Mix,
//     Cheddar, Zesty Cheddar, Parmesan" (a 3-flavor variety mix), not the
//     single-flavor Parmesan bag. Real single-flavor ingredients/nutrition
//     confirmed via Target (UPC 014100085461) and used instead.
//   - mary-s-gone-crackers-super-seed-classic-crackers: Stage-1 matched a
//     completely different product ("Minis Crackers, Vanilla" — a sweet
//     snack, not the savory Super Seed line). Real Super Seed Classic
//     ingredients/nutrition confirmed via marysgonecrackers.com,
//     mannaharvest.com and Kroger/EWG (UPC 897580000168) and used instead.
//     This is a DIFFERENT product from the existing products.js "Mary's
//     Gone Crackers Original Crackers" entry (897580000106 — tamari/soy
//     sauce flavor, no pumpkin/sunflower/poppy seeds) so it is NOT a
//     duplicate and was kept.
//   - annie-s-organic-cheddar-bunnies-crackers: Stage-1 matched "Organic
//     Extra Cheesy Cheddar Bunnies" (a different, richer-recipe variant),
//     not plain "Organic Cheddar Bunnies". Real Original ingredients
//     confirmed via OFF product page + myfooddata, but the real product
//     turned out to be an EXISTING products.js entry (013562302154,
//     companyId already 'general-mills' — confirms this batch's ownership
//     call independently) -> EXCLUDED as a duplicate.
//   - premium-original-saltine-crackers: Stage-1's ingredient text included
//     "partially hydrogenated cottonseed oil" — a PHO, banned by FDA order
//     effective 2018 and not legally usable in 2026. Confirmed via Target/
//     Fairway/ShopRite that the current real ingredient list has no PHO at
//     all (soybean and/or canola oil, palm oil instead). Replaced.
//   - ritz-garlic-butter-crackers: Stage-1's ingredient text had a
//     nonsensical trailing "SEEDS, POPPY." fragment not present in any
//     verified source (SmartLabel/Dollar General/ShopRite/Walmart all
//     agree on the same 10-ingredient list, no poppy seeds in a garlic
//     butter cracker). Dropped as garbled/fabricated text.
//   - triscuit-cracked-pepper-and-olive-oil-crackers: Stage-1's ingredient
//     text listed "vegetable oil (soybean and/or canola oil)", "maltodextrin"
//     and an extra "citric acid" not on the current label. Confirmed via
//     Target (UPC 044000050993) the real list is canola oil + rice starch,
//     no citric acid. Replaced.
//   - good-thins-simply-salt-corn-rice-snacks: no product named "Simply
//     Salt Corn & Rice Snacks" could be verified to exist — Good Thins
//     sells separate "Simply Salt RICE Snacks" (pure rice) and "Sea Salt
//     CORN Snacks" (pure corn) lines, plus a "Jalapeño & Lime Corn & Rice"
//     flavored blend, but no plain corn-and-rice "Simply Salt" blend.
//     Closest verified real match is Good Thins Simply Salt RICE Snacks
//     (UPC 044000044718) — used and renamed; flagged for reviewer in case
//     the founder actually wanted the corn-only SKU instead.
//
// DUPLICATES FOUND (excluded from this file — already in products.js):
//   - ritz-fresh-stacks-original-crackers -> barcode 0044000031138 already
//     a key in products.js ("fresh stacks the original").
//   - cheez-it-white-cheddar-baked-snack-crackers -> barcode 0024100789382
//     already a key in products.js ("White Cheddar Baked Snack Crackers").
//   - wheat-thins-reduced-fat-whole-grain-wheat-cracke -> same product/
//     recipe as existing products.js entry 0044000069193 ("Wheat Thins
//     reduced fat") — identical nutrition (120cal/3.5fat/200mg sodium/
//     22carb/4sugar/2protein), just a different pack-size UPC.
//   - simple-mills-almond-flour-sea-salt-crackers -> same product/recipe as
//     existing products.js entry 856069005131 ("Simple Mills Almond Flour
//     Crackers Fine Ground Sea Salt") — identical nutrition, different
//     pack-size UPC (this batch's verified barcode was 856069005957, a
//     10oz 2-count box vs. the existing 4.25oz single box).
//   - annie-s-organic-cheddar-bunnies-crackers -> same product as existing
//     products.js entry 013562302154 ("Annie's Organic Cheddar Bunnies
//     Baked Snack Crackers", companyId already 'general-mills').
//
// INGREDIENT DECODING: verbatim label order preserved, lowercase. Parens
// kept nested inside their parent entry (scorer's normalize() strips (...)
// and [...] before matching, so the parent name alone must resolve).
// Dyes/preservatives/allergens nested inside a parenthetical were ALSO
// listed as their own top-level entry (tbhq, annatto, celery, paprika
// extract, turmeric extract, beet juice concentrate, watermelon juice
// concentrate, huito). Two ingredients have no cache/token match at all:
// 'huito' (Genipa americana / jagua fruit extract, a natural dark-color
// dye — Goldfish Colors Cheddar) and 'seaweed' (Mary's Gone Crackers Super
// Seed Classic) — both listed in new_ingredients below.
//
// OWNERSHIP:
//   - Ritz/Triscuit/Wheat Thins/Premium(Nabisco)/Good Thins -> 'mondelez'
//     (BRAND_TO_COMPANY alias confirmed).
//   - Cheez-It -> 'kelloggs' (alias confirmed; represents Kellanova, which
//     Mars completed acquiring Dec 11 2025 per companies.js's own entry).
//   - Goldfish -> 'campbell-soup' (companies.js's BRAND_TO_COMPANY object
//     literal has a DUPLICATE 'goldfish' key — line ~9744 maps to
//     'campbell', a later line ~10302 maps to 'campbell-soup'; duplicate
//     object-literal keys resolve to the LAST one at runtime, confirmed by
//     evaluating the module directly -> 'campbell-soup' is what the app
//     actually uses. Flagging the duplicate/dead 'campbell' mapping and
//     the near-identical duplicate 'campbell'/'campbell-soup' COMPANY_DB
//     entries themselves for cleanup.).
//   - Wasa -> 'barilla' (alias confirmed; Barilla Group acquired Wasa in
//     2019, well-established).
//   - Simple Mills, Back to Nature -> aliases confirmed (excluded/kept
//     resp.).
//   - Club Original & Town House (Original + Pita) -> assigned 'kelloggs'.
//     NOT a straight alias lookup: companies.js's BRAND_TO_COMPANY has
//     'club crackers' -> 'mondelez' (confirmed wrong — Club and Town House
//     are Keebler-line crackers, officially listed today on Kellanova's
//     own brand pages, kellanovaus.com/us/en/brands/club and /town-house;
//     Mondelez makes the *competing* Nabisco cracker line (Ritz/Triscuit/
//     Wheat Thins) and has never owned Keebler). 'town house' has no alias
//     at all. FLAGGING BOTH FOR REVIEWER: recommend fixing companies.js's
//     'club crackers' alias (mondelez -> kelloggs) and adding a 'town
//     house' alias, rather than silently trusting the existing wrong
//     mapping.
//   - Carr's -> assigned 'kelloggs'. No alias exists for "carr's" at all;
//     confirmed via Kellanova's own brand page (kellanovaus.com/us/en/
//     brands/carrs.html) and SmartLabel (smartlabel.kelloggs.com) that
//     Carr's is marketed/distributed by Kellanova in the US. FLAGGING FOR
//     REVIEWER: recommend adding a "carr's" alias to companies.js.
//   - Mary's Gone Crackers -> companyId: null. No alias exists; real owner
//     is Dare Foods Limited (a private Canadian company, via its US
//     subsidiary Rosseau Incorporated), which acquired Mary's Gone
//     Crackers from Kameda Seika Co. in April 2025. 'Dare Foods' has no
//     entry anywhere in companies.js. Listed in missing_companies. (Note:
//     the existing products.js "Mary's Gone Crackers Original Crackers"
//     entry, 897580000106, currently has companyId: 'hain-celestial' —
//     likely stale/wrong given the 2025 Dare Foods acquisition; flagged
//     for reviewer, not changed here since it's outside this batch.)
//   - Crunchmaster -> companyId: null. No alias exists; real owner is TH
//     Foods, Inc. (private, Mitsubishi Corp / Kameda Seika joint-venture
//     history but no current controlling public parent found). Listed in
//     missing_companies.
//
// image is always null — photo URLs flow through product_images.json
// (product-photo-lookup skill).

module.exports = {
  '044000031176': {
    barcode: '044000031176',
    name: 'Ritz Garlic Butter Crackers',
    brand: 'Ritz',
    companyId: 'mondelez',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '5 crackers (16g)',
    calories: 80,
    ingredients: [
      'unbleached enriched flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid)',
      'soybean and/or canola oil',
      'palm oil',
      'sugar',
      'high fructose corn syrup',
      'leavening (calcium phosphate, baking soda)',
      'salt',
      'garlic powder',
      'soy lecithin',
      'natural flavor',
    ],
    nutrition: { fat: 4, saturatedFat: 1, sodium: 125, carbs: 10, sugars: 1, protein: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '044000050993': {
    barcode: '044000050993',
    name: 'Triscuit Cracked Pepper & Olive Oil Crackers',
    brand: 'Triscuit',
    companyId: 'mondelez',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '6 crackers (29g)',
    calories: 120,
    ingredients: [
      'whole grain wheat',
      'canola oil',
      'salt',
      'rice starch',
      'black pepper',
      'onion powder',
      'garlic powder',
      'extra virgin olive oil',
      'natural flavor (contains celery)',
      'celery',
    ],
    nutrition: { fat: 4, saturatedFat: 0, sodium: 140, carbs: 21, sugars: 0, protein: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '030100100577': {
    barcode: '030100100577',
    name: 'Club Original Crackers',
    brand: 'Keebler',
    companyId: 'kelloggs',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '4 crackers (14g)',
    calories: 70,
    ingredients: [
      'enriched flour (wheat flour, niacin, reduced iron, vitamin b1, vitamin b2, folic acid)',
      'soybean oil (with tbhq for freshness)',
      'tbhq',
      'sugar',
      'salt',
      'high fructose corn syrup',
      'leavening (baking soda, sodium acid pyrophosphate, monocalcium phosphate)',
      'corn syrup',
      'soy lecithin',
    ],
    nutrition: { fat: 3, saturatedFat: 0.5, sodium: 125, carbs: 9, sugars: 1, protein: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '030100100553': {
    barcode: '030100100553',
    name: 'Town House Original Crackers',
    brand: 'Kellogg\'s',
    companyId: 'kelloggs',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '5 crackers (16g)',
    calories: 80,
    ingredients: [
      'enriched flour (wheat flour, niacin, reduced iron, vitamin b1, vitamin b2, folic acid)',
      'soybean oil (with tbhq for freshness)',
      'tbhq',
      'sugar',
      'salt',
      'corn syrup',
      'leavening (baking soda, sodium acid pyrophosphate, monocalcium phosphate)',
      'soy lecithin',
    ],
    nutrition: { fat: 4.5, saturatedFat: 1, sodium: 150, carbs: 10, sugars: 1, protein: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '030100784586': {
    barcode: '030100784586',
    name: 'Town House Sea Salt Pita Crackers',
    brand: 'Kellogg\'s',
    companyId: 'kelloggs',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '6 crackers (15g)',
    calories: 70,
    ingredients: [
      'enriched flour (wheat flour, niacin, reduced iron, vitamin b1, vitamin b2, folic acid)',
      'soybean oil (with tbhq for freshness)',
      'tbhq',
      'rice flour',
      'sugar',
      'oat fiber',
      'sea salt',
      'yeast',
      'whey',
      'soy lecithin',
    ],
    nutrition: { fat: 2.5, saturatedFat: 0, sodium: 140, carbs: 11, sugars: 1, protein: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '024100104437': {
    barcode: '024100104437',
    name: 'Cheez-It Extra Toasty Baked Snack Crackers',
    brand: 'Cheez-It',
    companyId: 'kelloggs',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '27 crackers (30g)',
    calories: 150,
    ingredients: [
      'enriched flour (wheat flour, niacin, reduced iron, vitamin b1, vitamin b2, folic acid)',
      'vegetable oil (soybean, palm, canola and/or sunflower with tbhq for freshness)',
      'tbhq',
      'cheese made with skim milk (skim milk, whey protein, salt, cheese cultures, enzymes, annatto extract color)',
      'annatto',
      'salt',
      'dextrose',
      'paprika',
      'yeast',
      'paprika extract color',
    ],
    nutrition: { fat: 8, saturatedFat: 1.5, sodium: 230, carbs: 17, sugars: 0, protein: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '014100086109': {
    barcode: '014100086109',
    name: 'Goldfish Colors Cheddar Crackers',
    brand: 'Goldfish',
    companyId: 'campbell-soup',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 pack (26g)',
    calories: 120,
    ingredients: [
      'enriched wheat flour (flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid)',
      'cheddar cheese (cultured milk, salt, enzymes, annatto)',
      'annatto',
      'vegetable oils (canola, sunflower and/or soybean)',
      'salt',
      'yeast',
      'sugar',
      'autolyzed yeast extract',
      'spices',
      'celery',
      'onion powder',
      'monocalcium phosphate',
      'baking soda',
      'colors (beet juice concentrate, huito, watermelon juice concentrate, paprika extract, turmeric extract)',
      'beet juice concentrate',
      'huito',
      'watermelon juice concentrate',
      'paprika extract',
      'turmeric extract',
    ],
    nutrition: { fat: 4.5, saturatedFat: 1, sodium: 190, carbs: 17, sugars: 0, protein: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '014100085461': {
    barcode: '014100085461',
    name: 'Goldfish Parmesan Crackers',
    brand: 'Goldfish',
    companyId: 'campbell-soup',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 serving (30g)',
    calories: 140,
    ingredients: [
      'enriched wheat flour (flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid)',
      'vegetable oils (canola, sunflower and/or soybean)',
      'parmesan cheese (milk, cultures, salt, enzymes)',
      'salt',
      'yeast',
      'onion powder',
      'sugar',
      'butter',
      'autolyzed yeast extract',
      'baking soda',
    ],
    nutrition: { fat: 5, saturatedFat: 1, sodium: 260, carbs: 20, sugars: 0, protein: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '897580000168': {
    barcode: '897580000168',
    name: 'Mary\'s Gone Crackers Super Seed Classic Crackers',
    brand: 'Mary\'s Gone Crackers',
    companyId: null,
    category: 'Chips & Crackers',
    image: null,
    servingSize: '12 crackers (30g)',
    calories: 160,
    ingredients: [
      'organic brown rice',
      'organic quinoa',
      'organic pumpkin seeds',
      'organic sunflower seeds',
      'organic flax seeds',
      'organic sesame seeds',
      'organic poppy seeds',
      'filtered water',
      'sea salt',
      'organic seaweed',
      'organic black pepper',
      'organic herbs',
    ],
    nutrition: { fat: 8, saturatedFat: 1, sodium: 200, carbs: 19, sugars: 0, protein: 3 },
    certifications: ['USDA Organic', 'Non-GMO Project', 'Gluten-Free Certified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '819898010103': {
    barcode: '819898010103',
    name: 'Back to Nature Classic Round Crackers',
    brand: 'Back to Nature',
    companyId: 'back-to-nature',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '5 crackers (14g)',
    calories: 70,
    ingredients: [
      'wheat flour',
      'safflower oil',
      'cane sugar',
      'brown rice syrup',
      'leavening (baking soda, monocalcium phosphate monohydrate, ammonium bicarbonate)',
      'sea salt',
      'soy lecithin',
      'enzymes',
    ],
    nutrition: { fat: 2, saturatedFat: 0, sodium: 110, carbs: 11, sugars: 1, protein: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: false,
  },

  '059290573220': {
    barcode: '059290573220',
    name: 'Carr\'s Table Water Crackers',
    brand: 'Carr\'s',
    companyId: 'kelloggs',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '6 crackers (20g)',
    calories: 80,
    ingredients: [
      'enriched flour (wheat flour, calcium niacin, iron, thiamin mononitrate, riboflavin, folic acid)',
      'palm oil',
      'salt',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0.5, sodium: 110, carbs: 15, sugars: 0, protein: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '033617007032': {
    barcode: '033617007032',
    name: 'Wasa Multi Grain Crispbread',
    brand: 'Wasa',
    companyId: 'barilla',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 slice (14g)',
    calories: 35,
    ingredients: [
      'whole grain rye flour',
      'rye sourdough',
      'oat flakes',
      'whole grain wheat flour',
      'whole grain oat flour',
      'whole grain barley flour',
      'yeast',
      'salt',
      'barley malt extract',
      'sunflower lecithin',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 65, carbs: 8, sugars: 0, protein: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: false,
  },

  '044000000578': {
    barcode: '044000000578',
    name: 'Premium Original Saltine Crackers',
    brand: 'Nabisco',
    companyId: 'mondelez',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '5 crackers (15g)',
    calories: 70,
    ingredients: [
      'unbleached enriched flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid)',
      'soybean and/or canola oil',
      'palm oil',
      'sea salt',
      'salt',
      'malted barley flour',
      'baking soda',
      'yeast',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0, sodium: 135, carbs: 12, sugars: 0, protein: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },

  '044000044718': {
    barcode: '044000044718',
    name: 'Good Thins Simply Salt Rice Snacks',
    brand: 'Good Thins',
    companyId: 'mondelez',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '18 crackers (31g)',
    calories: 130,
    ingredients: [
      'white rice flour',
      'high oleic safflower oil',
      'salt',
    ],
    nutrition: { fat: 1.5, saturatedFat: 0, sodium: 85, carbs: 26, sugars: 0, protein: 2 },
    certifications: ['Certified Gluten-Free', 'Non-GMO Project'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '879890002025': {
    barcode: '879890002025',
    name: 'Crunchmaster Multi-Grain Sea Salt Crackers',
    brand: 'Crunchmaster',
    companyId: null,
    category: 'Chips & Crackers',
    image: null,
    servingSize: '15 crackers (30g)',
    calories: 130,
    ingredients: [
      'brown rice flour',
      'whole grain yellow cornmeal',
      'potato starch',
      'sesame seeds',
      'olive oil',
      'cane sugar',
      'flax seeds',
      'oat fiber',
      'sea salt',
    ],
    nutrition: { fat: 3.5, saturatedFat: 0.5, sodium: 150, carbs: 23, sugars: 2, protein: 2 },
    certifications: ['Certified Gluten-Free'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },
};
