// ─── GRANOLA 2026-07-09 · OPUS-REVIEWED ─────────────────────────────────────
// Stage-3 independent review of granola-2026-07-09_formatted.js (Octavius was
// session-cut before writing its final report, so the whole file got extra
// scrutiny). 16 candidates fetched / 15 resolved / 1 raw miss.
//
// RESULT: 14 products SHIP (13 from Octavius's file + 1 Octavius dropped at
// cutoff, recovered here). 2 could-not-verify held back. 0 duplicates (all 14
// barcodes + names re-checked against products.js incl. the pre-existing
// "Granola" category — no collisions; Octavius's dedup claim holds).
//
// CHANGES THIS REVIEW MADE TO OCTAVIUS'S FILE:
//   1. Purely Elizabeth Chocolate Sea Salt Probiotic — BARCODE FIX. Octavius
//      wrote '085514000268', which FAILS mod-10 (valid check digit = 5). It
//      mis-transcribed the GTIN-14 00855140002687: stripping leading zeros
//      gives 855140002687 (valid, confirmed at Brookshire's + Lunds & Byerlys
//      as id 00855140002687). Corrected key + barcode to 855140002687.
//   2. Udi's Au Naturel Granola — nutrition + serving fix against the verified
//      panel (udisglutenfree.com / Vitacost): carbs 19->18, protein 4->3,
//      serving '1/4 cup' -> '1/4 cup (30g)'. Ingredients (oats/honey/canola
//      oil), 0mg sodium, and barcode 698997806158 all CONFIRMED correct —
//      Octavius's catch of the Stage-1 pizza-crust substitution was right.
//   3. KIND Peanut Butter Clusters — added 'tapioca starch' (present on the
//      verified label, UPC 602652171826 confirmed as this exact product).
//   4. ADDED: KIND Healthy Grains Dark Chocolate Whole Grain Clusters
//      (602652171994). Octavius dropped this product entirely at cutoff (not
//      in its output, not in could-not-verify). Stage-1 had resolved it to the
//      WRONG code 602652171833 (the discontinued "Dark Chocolate & Cranberry"
//      variant). Recovered with the real current UPC + verified panel
//      (nutritionvalue.org / kindsnacks.com): 29g serving, 110 cal.
//
// SPOT-CHECKS THAT CONFIRMED OCTAVIUS'S REWRITES (independently, via brand /
// retailer panels — his cut-off re-research held up):
//   - Bear Naked Fruit & Nut Medley: rewritten ingredient list matches the
//     real label EXACTLY (Walmart/Publix/Albertsons); OFF verbatim was a stale
//     formulation. Good catch.
//   - KIND Cinnamon Oat Clusters w/ Flax (602652171840): barcode + ingredient
//     set confirmed.
//   - Nature's Path Love Crunch: calories 430 are internally consistent with
//     the macros (16f/64c/9p ≈ 436 kcal), unlike Stage-1's 464.
//   - Cascadian Farm per-100g-as-serving bug fix (213 -> 280 cal / 63g) sound.
//   - Sodium g->mg conversions across the batch check out physically.
//
// COMPANY OWNERSHIP (re-verified brand-by-brand against companies.js):
//   Bear Naked->kelloggs · KIND->mars · Cascadian Farm->general-mills ·
//   Nature's Path->natures-path · Purely Elizabeth->purely-elizabeth ·
//   Udi's->conagra · MadeGood/Safe+Fair/Bakery On Main->null (no key; parents
//   noted below). All non-null keys exist in companies.js. (kind-snacks IS a
//   key but the catalog uses 'mars' for KIND everywhere — kept consistent.)
//
// FOUNDER NOTES BEFORE SHIP:
//   - MadeGood & Safe+Fair & Bakery On Main resolve to companyId:null. Real
//     parents: Riverside Natural Foods (MadeGood), The Safe+Fair Food Co.,
//     Garden of Light Inc. dba Bakery On Main (brand reportedly being wound
//     down through 2025). Consider adding company records later.
//   - Bakery On Main: barcode-anchored formula (835228006028) differs from the
//     brand's current site formula — ingredient history is in flux. Shipping
//     what a scanner reads off this UPC.
//   - MadeGood Strawberry: current packaging markets this as "Granola Bites";
//     kept barcode-tied name/data.
//
// COULD NOT VERIFY (2, held back — same as Octavius):
//   1. Seven Sundays Maple Sea Salt Oat Protein Cereal — no such SKU in the
//      oat-protein line; a "Maple Sea Salt" exists only under the sunflower
//      line, no confirmable barcode. Not fabricating.
//   2. Purely Elizabeth Vanilla Almond Butter (Ancient Grain) — real product
//      is the "Grain-Free" sub-line; no source supplied a mod-10-valid UPC.
//      Not guessing a check digit.

module.exports = {
  '856416000017': {
    barcode: '856416000017',
    name: 'Bear Naked Fruit & Nut Medley Wildly Delicious Granola',
    brand: 'Bear Naked',
    companyId: 'kelloggs',
    category: 'Granola',
    image: null,
    servingSize: '1/2 cup (56g)',
    calories: 240,
    ingredients: [
      'whole grain oats',
      'brown sugar',
      'almonds',
      'expeller pressed canola oil',
      'honey',
      'dried cranberries',
      'raisins',
      'brown rice syrup',
      'whole oat flour',
      'coconut',
      'pecans',
      'walnuts',
      'toasted sesame seeds',
      'sea salt',
      'baking soda',
      'rosemary extract',
    ],
    nutrition: { fat: 9, saturatedFat: 2, sodium: 150, carbs: 37, sugars: 12, protein: 6, fiber: 5 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '856416000703': {
    barcode: '856416000703',
    name: 'Bear Naked Triple Berry Crunch Granola',
    brand: 'Bear Naked',
    companyId: 'kelloggs',
    category: 'Granola',
    image: null,
    servingSize: '1/2 cup (52g)',
    calories: 210,
    ingredients: [
      'whole grain oats',
      'brown sugar',
      'brown rice syrup',
      'crisp rice',
      'whole oat flour',
      'dried cranberries',
      'canola oil',
      'pumpkin seeds',
      'strawberries',
      'blueberries',
      'baking soda',
      'sea salt',
      'natural flavors',
      'rosemary extract',
    ],
    nutrition: { fat: 5, saturatedFat: 0.5, sodium: 150, carbs: 40, sugars: 11, protein: 5, fiber: 5 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '884623101654': {
    barcode: '884623101654',
    name: 'Bear Naked Cacao & Cashew Butter Granola',
    brand: 'Bear Naked',
    companyId: 'kelloggs',
    category: 'Granola',
    image: null,
    servingSize: '1/2 cup (54g)',
    calories: 250,
    ingredients: [
      'whole grain oats',
      'semisweet chocolate',
      'soy lecithin',
      'invert cane syrup',
      'rice crisps',
      'cashew butter',
      'expeller pressed oil',
      'cashews',
      'pumpkin seeds',
      'whole oat flour',
      'brown rice syrup',
      'cane sugar',
      'sea salt',
      'ginger',
      'rosemary extract',
    ],
    nutrition: { fat: 11, saturatedFat: 3, sodium: 115, carbs: 34, sugars: 12, protein: 6, fiber: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '602652171826': {
    barcode: '602652171826',
    name: 'KIND Healthy Grains Peanut Butter Whole Grain Clusters',
    brand: 'KIND',
    companyId: 'mars',
    category: 'Granola',
    image: null,
    servingSize: '1/3 cup (30g)',
    calories: 120,
    ingredients: [
      'oats',
      'cane sugar',
      'peanut butter',
      'soy protein isolate',
      'brown rice',
      'tapioca syrup',
      'tapioca starch',
      'peanut oil',
      'peanuts',
      'buckwheat',
      'millet',
      'amaranth',
      'peanut flour',
      'quinoa',
      'brown rice syrup',
      'sea salt',
      'vitamin e',
    ],
    nutrition: { fat: 4, saturatedFat: 0.5, sodium: 50, carbs: 17, sugars: 5, protein: 5, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '602652171840': {
    barcode: '602652171840',
    name: 'KIND Healthy Grains Cinnamon Oat Clusters with Flax Seeds',
    brand: 'KIND',
    companyId: 'mars',
    category: 'Granola',
    image: null,
    servingSize: '1/3 cup (30g)',
    calories: 110,
    ingredients: [
      'oats',
      'cane sugar',
      'chicory root fiber',
      'flax seeds',
      'brown rice',
      'canola oil',
      'buckwheat',
      'millet',
      'amaranth',
      'molasses',
      'cinnamon',
      'quinoa',
      'brown rice syrup',
      'sea salt',
      'vitamin e',
    ],
    nutrition: { fat: 3.5, saturatedFat: 0, sodium: 15, carbs: 19, sugars: 5, protein: 3, fiber: 4 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '602652171994': {
    barcode: '602652171994',
    name: 'KIND Healthy Grains Dark Chocolate Whole Grain Clusters',
    brand: 'KIND',
    companyId: 'mars',
    category: 'Granola',
    image: null,
    servingSize: '1/3 cup (29g)',
    calories: 110,
    ingredients: [
      'oats',
      'tapioca syrup',
      'soy protein isolate',
      'semisweet chocolate',
      'cane sugar',
      'canola oil',
      'millet',
      'cocoa powder',
      'brown rice',
      'buckwheat',
      'natural flavor',
      'amaranth',
      'quinoa',
      'sea salt',
      'brown rice syrup',
      'vitamin e',
    ],
    nutrition: { fat: 2.5, saturatedFat: 0.5, sodium: 60, carbs: 18, sugars: 3, protein: 6, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '855140002687': {
    barcode: '855140002687',
    name: 'Purely Elizabeth Chocolate Sea Salt Ancient Grain Granola with Probiotics',
    brand: 'Purely Elizabeth',
    companyId: 'purely-elizabeth',
    category: 'Granola',
    image: null,
    servingSize: '1/3 cup (30g)',
    calories: 130,
    ingredients: [
      'certified gluten-free oats',
      'coconut sugar',
      'coconut oil',
      'dark chocolate chunks',
      'sunflower seeds',
      'puffed amaranth',
      'cacao powder',
      'quinoa flakes',
      'cinnamon',
      'sea salt',
      'chia seeds',
      'probiotic cultures',
      'inulin',
      'palm oil',
      'bacillus coagulans',
    ],
    nutrition: { fat: 6, saturatedFat: 3.5, sodium: 130, carbs: 19, sugars: 7, protein: 3, fiber: 2 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '021908133119': {
    barcode: '021908133119',
    name: 'Cascadian Farm Organic Fruit and Nut Granola',
    brand: 'Cascadian Farm Organic',
    companyId: 'general-mills',
    category: 'Granola',
    image: null,
    servingSize: '2/3 cup (63g)',
    calories: 280,
    ingredients: [
      'whole grain oats',
      'cane sugar',
      'rice',
      'sunflower oil',
      'raisins',
      'cranberries',
      'almonds',
      'molasses',
      'sea salt',
      'natural flavor',
      'vitamin e',
    ],
    nutrition: { fat: 8, saturatedFat: 1, sodium: 65, carbs: 45, sugars: 15, protein: 6, fiber: 4 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: false,
  },

  '058449771760': {
    barcode: '058449771760',
    name: "Nature's Path Love Crunch Premium Organic Granola Dark Chocolate & Red Berries",
    brand: "Nature's Path",
    companyId: 'natures-path',
    category: 'Granola',
    image: null,
    servingSize: '1 cup (95g)',
    calories: 430,
    ingredients: [
      'whole grain rolled oats',
      'cane sugar',
      'sunflower oil',
      'soy oil',
      'dark chocolate chunks',
      'dried coconut',
      'cocoa powder',
      'freeze-dried berry blend',
      'freeze-dried strawberries',
      'freeze-dried raspberries',
      'rice starch',
      'sea salt',
      'chocolate flavor',
      'tocopherols',
    ],
    nutrition: { fat: 16, saturatedFat: 3.5, sodium: 180, carbs: 64, sugars: 21, protein: 9, fiber: 5 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: false,
  },

  '058449770565': {
    barcode: '058449770565',
    name: "Nature's Path Pumpkin Seed + Flax Granola",
    brand: "Nature's Path Organic",
    companyId: 'natures-path',
    category: 'Granola',
    image: null,
    servingSize: '0.75 cup (55g)',
    calories: 260,
    ingredients: [
      'whole grain rolled oats',
      'cane sugar',
      'soy oil',
      'brown rice flour',
      'pumpkin seeds',
      'flax seeds',
      'oat syrup solids',
      'sea salt',
      'molasses',
      'rice starch',
      'cinnamon',
    ],
    nutrition: { fat: 10, saturatedFat: 1.5, sodium: 45, carbs: 37, sugars: 10, protein: 6, fiber: 4 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: false,
  },

  '687456223087': {
    barcode: '687456223087',
    name: 'MadeGood Organic Strawberry Granola Minis',
    brand: 'MadeGood',
    companyId: null,
    category: 'Granola',
    image: null,
    servingSize: '0.85 oz (24g)',
    calories: 90,
    ingredients: [
      'pure rolled oats',
      'strawberry pieces',
      'cane sugar',
      'agave nectar',
      'sunflower oil',
      'apples',
      'whole grain crisp brown rice',
      'agave inulin',
      'apricots',
      'tapioca flour',
      'vegetable powder',
      'strawberry flavor',
    ],
    nutrition: { fat: 2.5, saturatedFat: 0.4, sodium: 5, carbs: 16, sugars: 7, protein: 1, fiber: 2 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '858438003854': {
    barcode: '858438003854',
    name: 'Safe + Fair Birthday Cake Granola',
    brand: 'The Safe + Fair Food Company',
    companyId: null,
    category: 'Granola',
    image: null,
    servingSize: '1/3 cup (30g)',
    calories: 130,
    ingredients: [
      'oats',
      'brown rice syrup',
      'cane sugar',
      'sunflower oil',
      'natural color sprinkles',
      'palm oil',
      'palm kernel oil',
      'corn starch',
      'sunflower lecithin',
      'vegetable juice',
      'annatto',
      'spirulina extract',
      'turmeric',
      'beta carotene',
      'maltodextrin',
      'carnauba wax',
      'cellulose gum',
      'brown rice',
      'millet',
      'natural vanilla flavor',
      'sea salt',
    ],
    nutrition: { fat: 4.5, saturatedFat: 0.5, sodium: 40, carbs: 21, sugars: 9, protein: 2, fiber: 1 },
    certifications: ['Kosher'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '698997806158': {
    barcode: '698997806158',
    name: "Udi's Gluten Free Au Naturel Granola",
    brand: "Udi's",
    companyId: 'conagra',
    category: 'Granola',
    image: null,
    servingSize: '1/4 cup (30g)',
    calories: 130,
    ingredients: [
      'certified gluten-free oats',
      'honey',
      'canola oil',
    ],
    nutrition: { fat: 4.5, saturatedFat: 0, sodium: 0, carbs: 18, sugars: 5, protein: 3, fiber: 2 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '835228006028': {
    barcode: '835228006028',
    name: 'Bakery On Main Gluten-Free Granola Extreme Nut & Fruit',
    brand: 'Bakery On Main',
    companyId: null,
    category: 'Granola',
    image: null,
    servingSize: '1/3 cup (30g)',
    calories: 140,
    ingredients: [
      'corn meal',
      'evaporated cane juice',
      'brown rice',
      'expeller pressed canola oil',
      'sunflower seeds',
      'raisins',
      'almonds',
      'sesame seed',
      'flax seed',
      'coconut',
      'walnuts',
      'hazelnuts',
      'dried cranberries',
      'corn starch',
      'brazil nuts',
      'rice bran extract',
      'natural flavors',
      'pecans',
      'caramel color',
      'sea salt',
    ],
    nutrition: { fat: 7, saturatedFat: 1, sodium: 15, carbs: 18, sugars: 6, protein: 2, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },
};
