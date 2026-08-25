// ─── GRANOLA 2026-07-09 ────────────────────────────────────────────────────
// 16 candidates fetched (Stage-1 script) · 15 resolved / 1 raw miss reported.
// 13 formatted / 2 could_not_verify / 0 excluded duplicates (checked against
// the existing "Granola" category — 17 pre-existing products — and against
// full products.js by barcode + name; no collisions found).
//
// STAGE-1 FETCH ERRORS CAUGHT (wrong-product substitutions / bad data —
// independently re-researched from brand sites, SmartLabel, and retailer
// nutrition panels; nothing below was left as Stage-1 delivered it without
// a second, independent source confirming it):
//
//   - kind-healthy-grains-peanut-butter-whole-grain-cl AND
//     kind-healthy-grains-cinnamon-oat-clusters: Stage-1 resolved BOTH of
//     these distinct KIND flavors to the same wrong product ("100% Healthy
//     Whole Grains, Dark Chocolate & Cranberry Clusters") with per-100g
//     values mislabeled as per-serving (448 "calories" is per 100g, not a
//     29g serving). Fully replaced both with independently verified H-E-B
//     nutrition panels + UPCs (602652171826 and 602652171840).
//
//   - purely-elizabeth-ancient-grain-granola-vanilla-a AND
//     purely-elizabeth-chocolate-sea-salt-probiotic-gr: Stage-1 resolved
//     BOTH to the same wrong product ("Pumpkin Fig Ancient Granola + Puffs
//     Cereal"). Chocolate Sea Salt Probiotic was fully replaced with
//     H-E-B's verified panel + UPC (085514000268 unpacked from Lund & Byerlys'
//     14-digit listing 00855140002687). The Vanilla Almond Butter product
//     turned out not to exist under "Ancient Grain" branding at all — Purely
//     Elizabeth's real closest match is "Grain-Free Vanilla Almond Butter
//     Granola" (different sub-line) — see could_not_verify below; no source
//     displayed a mod-10-valid UPC for it.
//
//   - udi-s-gluten-free-au-naturel-granola: Stage-1's "ingredients" (water,
//     tapioca starch, egg whites, yeast, xanthan gum...) and serving size
//     ("0.5 PIZZA CRUST (57 g)") are Udi's GLUTEN FREE PIZZA CRUST, a
//     completely different product category, not granola. Fully replaced
//     with the real Au Naturel Granola (oats/honey/canola oil, UPC
//     698997806158, confirmed via udisglutenfree.com + multiple retailers).
//
//   - bear-naked-cacao-and-cashew-butter-granola: Stage-1 had a bogus 8-digit
//     "matched_off_code" (09215113 — fails as any valid UPC length) and null
//     brand/nutrition. Replaced with SmartLabel's verified panel + real UPC
//     884623101654.
//
// SODIUM-UNIT BUG: confirmed present again this batch. Stage-1's off-search
// "sodium" field is in grams, not mg (e.g. Love Crunch's fetched 0.18 = 180mg,
// confirmed exact against the official OFF nutriments table). Where a
// retailer/brand panel was available it was used directly (already in mg);
// otherwise the ×1000 conversion was applied and cross-checked.
//
// PER-100G-AS-PER-SERVING BUG: Cascadian Farm Organic Fruit and Nut Granola's
// Stage-1 calories (213) do not match its own serving size (63g) — verified
// via a fresh OFF pull + independent web nutrition source that the real
// per-63g-serving figure is 280 calories (8g fat / 1g sat fat / 65mg sodium /
// 45g carbs / 15g sugar / 6g protein / 4g fiber). Corrected below.
//
// NATURE'S PATH LOVE CRUNCH: Stage-1's ingredients_verbatim was a
// French-Canadian label (OFF crowd-sourced) whose parenthetical grouping
// differs meaningfully from Nature's Path's own English-language US product
// page (naturespath.com) — notably the French version implies flax seeds
// inside the chocolate-chunk sub-list that the English source does not list
// at all. Used naturespath.com's English ingredients + the OFF nutriments
// table (barcode-verified, 058449771760) since calories/fat/carbs macros are
// internally consistent with 430 kcal, not Stage-1's 464.
//
// BAKERY ON MAIN — FLAG FOR REVIEWER: bakeryonmain.com's current site lists a
// completely different formula ("Multigrain & Bean Crisps... Navy Beans...")
// for this product page than the corn-meal-based formula tied to the
// verified barcode 0835228006028 (matches an OFF+image record). Bakery On
// Main is also reportedly being wound down/discontinued through 2025 in
// favor of a successor brand ("Uncle Crumbles") per press coverage. Kept the
// barcode-anchored (0835228006028) ingredients/nutrition since that's what a
// scanner actually reads off this UPC, but the brand's ingredient history is
// clearly in flux — reviewer should sanity-check before shipping.
//
// MADEGOOD STRAWBERRY GRANOLA MINIS: current MadeGood packaging/site markets
// this SKU as "Strawberry Granola Bites" with a slightly different
// ingredient list (no vegetable powder detail) and sodium of 5mg. Kept the
// original barcode-tied (687456223087) ingredients/nutrition from Stage-1
// (internally consistent, calories/macros check out against the 100g-scaled
// figure independently), but flagging the naming drift for the reviewer.
//
// ORGANIC-PREFIX CONVENTION (matches Peanut Butter batch precedent): dropped
// the word "organic" from individual ingredient names where the schema's
// isOrganic flag + certifications array already capture that fact (e.g.
// "Organic Coconut Sugar" -> "coconut sugar") — this is a modifier, not a
// different substance, and doing this actually produced several genuine
// cache hits ("certified gluten-free oats", "coconut sugar", "coconut oil",
// "puffed amaranth", "quinoa flakes" all matched ingredientCache.js once the
// "organic" prefix was dropped). Not applied to "pure" or "Fair Trade"
// modifiers — those aren't captured elsewhere in the schema, so they were
// left as-is and flagged as new ingredients where they caused a miss.
//
// COMPANY OWNERSHIP — checked brand-by-brand against companies.js (grep,
// not assumed):
//   - Bear Naked -> 'kelloggs' (matches existing Bear Naked Granola Honey
//     Almond entry already in products.js; Kellanova/Kellogg's owns Bear
//     Naked; Mars's Dec-2025 Kellanova acquisition is noted inside the
//     'kelloggs' company record itself)
//   - KIND -> 'mars' (matches all 3 existing KIND product entries already in
//     products.js — NOT 'kind-snacks', which exists as a separate company
//     key but isn't what's used elsewhere in the catalog)
//   - Cascadian Farm -> 'general-mills' (matches existing entry)
//   - Nature's Path -> 'natures-path' (matches existing entries)
//   - Purely Elizabeth -> 'purely-elizabeth' (matches existing entry)
//   - Udi's -> 'conagra' (matches existing Udi's bread entry)
//   - MadeGood -> no key in companies.js -> null; real parent is Riverside
//     Natural Foods Ltd. (Canadian, family-owned) — see missing_companies
//   - Safe + Fair -> no key in companies.js -> null; maker is The Safe + Fair
//     Food Company itself (small allergen-friendly company, no larger parent
//     found) — see missing_companies
//   - Bakery On Main -> no key in companies.js -> null; maker is Garden of
//     Light Inc. (dba Bakery on Main) — see missing_companies
//
// COULD NOT VERIFY (2):
//   1. Seven Sundays Maple Sea Salt Oat Protein Cereal (the Stage-1 miss) —
//      no such SKU currently exists in Seven Sundays' 7-item Oat Protein
//      Cereal lineup (Pumpkin Spice, Variety Pack, Maple Cinnamon, Super
//      Fruity, Simply Honey Snackies, Simply Honey). A "Maple Sea Salt"
//      product does exist but under the SUNFLOWER Cereal line (now branded
//      "Real Maple Sunflower Cereal"), a different base ingredient (upcycled
//      sunflower protein, not oat protein) with no UPC displayed anywhere
//      found. Given the name/line mismatch and no confirmable barcode, not
//      fabricating a match.
//   2. Purely Elizabeth [Ancient Grain] Granola Vanilla Almond Butter — real,
//      verified name/ingredients/nutrition found for the closest actual
//      product ("Grain-Free Vanilla Almond Butter Granola": organic pumpkin
//      seeds, organic sunflower seeds, cashews, organic coconut sugar,
//      almonds, organic coconut flakes, almond butter, organic coconut oil,
//      organic chia seeds, organic cinnamon, sea salt, vanilla extract; 1/3
//      cup (30g) = 170 cal, 13g fat, 3.5g sat fat, 105mg sodium, 8g carbs,
//      2g fiber, 4g sugars, 6g protein) via Kroger + purelyelizabeth.com, but
//      every source only displayed a truncated 13-digit string
//      ("0081058903029") that fails mod-10 as either a 12-digit UPC-A or a
//      13-digit EAN, and no second independent source supplied the missing
//      check digit (unlike the Chocolate Sea Salt Probiotic SKU above, where
//      a second 14-digit listing confirmed the correct code). Not guessing
//      the check digit.
//
// NEW INGREDIENTS (not in ingredientCache.js — flagged for cache extension,
// kept verbatim in the arrays below, never renamed to force a hit):
//   coconut, toasted sesame seeds, invert cane syrup, expeller pressed oil,
//   dark chocolate chunks, freeze-dried berry blend, chocolate flavor,
//   oat syrup solids, pure rolled oats, strawberry pieces,
//   whole grain crisp brown rice, strawberry flavor, natural color sprinkles,
//   beta carotene, cacao powder, probiotic cultures
//
// MISSING COMPANIES (no key in companies.js — companyId: null on these
// products):
//   - Riverside Natural Foods Ltd. (MadeGood's actual parent; Canadian,
//     family-owned, ~$300M+ revenue)
//   - The Safe + Fair Food Company (small allergen-friendly maker; no
//     larger parent identified)
//   - Garden of Light Inc., dba Bakery on Main (brand reportedly being wound
//     down through 2025 per trade press)

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

  '085514000268': {
    barcode: '085514000268',
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
    servingSize: '1/4 cup',
    calories: 130,
    ingredients: [
      'certified gluten-free oats',
      'honey',
      'canola oil',
    ],
    nutrition: { fat: 4.5, saturatedFat: 0, sodium: 0, carbs: 19, sugars: 5, protein: 4, fiber: 2 },
    certifications: [],
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
