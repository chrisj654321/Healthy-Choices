// ─── PEANUT BUTTER 2026-07-09 ─────────────────────────────────────────────
// 20 products fetched (Stage-1 script) · 0 raw misses reported by fetch.
// 17 formatted / 1 could_not_verify / 2 excluded as duplicate-barcode conflicts
// with the existing "Nut Butters" category (see report to Opus reviewer).
//
// This batch is a DIFFERENT catalog category ("Peanut Butter") from the
// pre-existing "Nut Butters" category. Per instructions the two are not to
// be merged/conflated — category stays exactly "Peanut Butter" below.
// However, because products.js is keyed by barcode, two products in this
// batch turned out to be the exact same physical item (same UPC, same
// ingredients) as products already sitting in "Nut Butters". Those two were
// NOT written below (would silently overwrite/duplicate an existing key) —
// full data is in the Stage-2 report for the reviewer to decide on.
//
// STAGE-1 FETCH ERRORS CAUGHT (mismatched-product / bad-data corrections):
//   - crazy-richard-s-100-peanuts-creamy-peanut-butter: Stage-1 resolved to
//     "Crazy About Cookies, Scoop & Bake Cookie Dough, Peanut Butter" — a
//     cookie dough product, not peanut butter at all. Fully replaced with
//     independently researched Crazy Richard's data (crazyrichards.com +
//     upcitemdb.com UPC confirmation). NOTE: this verified UPC (074822610631)
//     turned out to collide with an existing Nut Butters entry — excluded,
//     see report.
//   - peter-pan-natural-creamy-peanut-butter-spread: Stage-1 resolved to
//     "PETER PAN Natural Creamy HONEY ROAST Peanut Butter, 28 OZ" (contains
//     honey — a different SKU than the plain Natural Creamy spread asked
//     for). Verified via direct OFF API call that this actually is what's
//     on that barcode (not a fetch-script bug — the search step chose the
//     wrong variant). Replaced ingredients/nutrition with the correct
//     product from postconsumerbrands.com's official Natural Creamy Peanut
//     Butter Spread page, but could not independently confirm a mod-10-valid
//     UPC for this specific SKU (see could_not_verify below).
//   - skippy-creamy-peanut-butter-spread-no-sugar-adde: Stage-1 matched a
//     Swedish-labeled OFF record ("JORDNÖTTER (97.5%), RAPSOLJA,
//     BOMULLSFRÖOLJA, SALT.") under barcode 0037600311069. Replaced with the
//     correct US SKU (UPC 037600148221, confirmed directly on Target's
//     product page) and English ingredients/nutrition.
//   - jif-no-added-sugar-creamy-peanut-butter-spread: Stage-1 (USDA path,
//     no barcode) resolved ingredients identical to Simply Jif Creamy
//     Peanut Butter (includes "sugar" in the ingredient list — contradicts
//     "No Added Sugar" claim). Replaced with jif.com's official "No Added
//     Sugar Creamy Peanut Butter Spread" ingredients/nutrition and a UPC
//     confirmed on both jif.com/Target and barcodeindex.com (051500245408).
//   - jif-reduced-fat-creamy-peanut-butter-spread: Stage-1 OFF ingredient
//     text was corrupted at the tail ("...PYRIDOXINE HYDROCHLORIDE FRLUC AT
//     NGREDIENTS:" — garbled OCR/crowd-entry, missing niacinamide and
//     scrambling folic acid). Replaced with jif.com's clean official
//     ingredient list. Calories also corrected 214 -> 190 (jif.com panel is
//     internally consistent with the macros; OFF's energy value was not).
//   - skippy-reduced-fat-creamy-peanut-butter-spread: Stage-1 OFF nutriment
//     record was internally inconsistent (energy-kcal_serving 475 vs a
//     macro sum of ~65 kcal for the same "per serving" fields — impossible).
//     Investigated raw OFF nutriments: the "_100g"-suffixed fields actually
//     contained the correct per-serving numbers (a units mislabel in the
//     community entry). Cross-confirmed against peanutbutter.com's official
//     panel (fat 12g, satfat 2g, sodium 170mg, carbs 14g, fiber 1g, sugars 4g,
//     protein 7g, 190 cal) — all matched. Ingredients also replaced with the
//     official Hormel list (Stage-1's had "soy protein concentrate" instead
//     of the correct "pea protein").
//   - skippy-super-chunk-peanut-butter: Stage-1 (USDA path, no barcode) gave
//     per-100g values mislabeled as per-serving (calories 594 for a 32g
//     serving is impossible). Replaced with myfooddiary.com per-serving data
//     (190 cal) and found+confirmed UPC 037600106139 via direct upcitemdb.com
//     page fetch.
//   - santa-cruz-organic-dark-roasted-crunchy-peanut-b: Stage-1 OFF nutriment
//     record had fiber_serving 9.38g against carbohydrates_serving 6g
//     (fiber cannot exceed total carbs) and saturated fat 6.25g against 16g
//     total fat — internally impossible values, confirmed present in OFF's
//     raw record itself (not a fetch-script bug, a bad crowd-sourced entry).
//     Replaced full nutrition panel with eatthismuch.com's label-sourced data,
//     which matches the sibling Creamy variant's (verified) profile closely.
//   - jif-no-added-sugar and skippy-super-chunk and crazy-richard-s (USDA
//     path entries): also had the general USDA-nutriment-as-per-100g bug
//     (calories/macros far too high for the stated serving) — corrected via
//     the retail/aggregator sources cited above rather than raw scaling,
//     since better sources were found. See kids-lunch batch report for the
//     general shape of this recurring Stage-1 bug.
//
// SODIUM UNIT FIX: every off-search-sourced record in the fetched JSON
// reports sodium in GRAMS (e.g. 0.11) while usda-fdc-sourced records report
// MILLIGRAMS (e.g. 391) — same bug pattern seen in prior batches. Normalized
// every off-search sodium value to mg (×1000) below.
//
// VARIANT-NAME FLAG: teddie-all-natural-smooth-peanut-butter's barcode
// (0071018010176) resolves via direct OFF API confirmation to "Smooth
// UNSALTED Peanut Butter" (sodium 0, ingredients = dry roasted peanuts only,
// no salt) — not the plain "Smooth" the batch input asked for. This looks
// like a genuine distinct Teddie SKU (their unsalted line), not a fetch
// error — kept and renamed to reflect what's actually on that barcode,
// flagged for reviewer since it may not be the SKU originally intended.
//
// COULD NOT VERIFY (job a): peter-pan-natural-creamy-peanut-butter-spread —
// ingredients/nutrition confirmed via postconsumerbrands.com official page,
// but no mod-10-valid UPC could be found. The only 16.3oz-size candidate
// surfaced repeatedly across Kroger-family retailer URLs (0004530000536)
// FAILS the UPC-A checksum (both as "drop one leading zero" UPC-A and as a
// straight EAN-13); web-search-summarized UPCs for the 40oz size were also
// inconsistent across two separate searches (045300362021 vs 045300299037
// for the same product) — a sign the AI search summarizer is misreading
// digits, not a reliable source. Per the "never fabricate a barcode" rule,
// this is left out of products.js entirely rather than guessed.
//
// DUPLICATE-BARCODE CONFLICTS (excluded from this file, flagged for
// reviewer decision — NOT included as could_not_verify since the data
// itself is good, just already in the catalog under a different category):
//   - smucker-s-natural-creamy-peanut-butter: barcode 051500017005 is
//     byte-for-byte the existing products.js Nut Butters entry
//     ("Smucker's Natural Creamy Peanut Butter 16oz", same ingredients,
//     same size). Adding it again under category "Peanut Butter" with the
//     same key would silently overwrite/duplicate that entry.
//   - crazy-richard-s-100-peanuts-creamy-peanut-butter: barcode 074822610631
//     (independently re-researched after the cookie-dough mismatch above)
//     is likewise already the existing Nut Butters entry ("Crazy Richard's
//     100% Natural Creamy Peanut Butter 16oz", same ingredients/nutrition).
//
// OWNERSHIP: Jif, Smucker's, Santa Cruz Organic -> jm-smucker (companies.js
// subsidiaries list explicitly names Santa Cruz Organic under J.M. Smucker).
// Skippy, Justin's -> hormel. Peter Pan -> conagra. Crazy Richard's ->
// crazy-richards. Teddie -> teddie. All keys confirmed present in
// src/data/companies.js — no missing_companies this batch.
//
// INGREDIENT DECODING: lowercase canonical names, label order preserved.
// "Contains 2% or less of:" and similar structural label phrases are not
// ingredients and were dropped. Parenthetical oil-source lists (e.g.
// "hydrogenated vegetable oil (cottonseed, soybean and rapeseed oil) to
// prevent separation") were folded into the single canonical parent
// ingredient "hydrogenated vegetable oil" already in ingredientCache.js —
// the bracketed oils are sourcing detail, not independently significant
// (not a dye/preservative/allergen). Vitamin/mineral fortification
// sub-lists (magnesium oxide, ferric orthophosphate, zinc oxide, copper
// sulfate, niacinamide, pyridoxine hydrochloride, folic acid) WERE each kept
// as their own ingredient entries since each already carries its own
// cache-scored explanation. "Organic" was dropped as an ingredient-name
// prefix (e.g. "organic roasted peanuts" -> "roasted peanuts") since the
// schema's isOrganic flag + certifications array already carries that fact;
// this avoids a guaranteed cache miss for a modifier, not a different
// substance. One genuinely new ingredient not in ingredientCache.js:
// "copper sulfate" (Jif Reduced Fat, Skippy Reduced Fat) — see report.

module.exports = {
  '051500255377': {
    barcode: '051500255377',
    name: 'Jif Extra Crunchy Peanut Butter 16oz',
    brand: 'Jif',
    companyId: 'jm-smucker',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (33g)',
    calories: 196,
    ingredients: [
      'roasted peanuts',
      'sugar',
      'molasses',
      'hydrogenated vegetable oil',
      'mono- and diglycerides',
      'salt',
    ],
    nutrition: { fat: 16, saturatedFat: 3.5, sodium: 110, carbs: 8, sugars: 3, protein: 7, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '051500243220': {
    barcode: '051500243220',
    name: 'Jif Natural Creamy Peanut Butter Spread 28oz',
    brand: 'Jif',
    companyId: 'jm-smucker',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (33g)',
    calories: 196,
    ingredients: [
      'peanuts',
      'sugar',
      'palm oil',
      'salt',
      'molasses',
    ],
    nutrition: { fat: 16, saturatedFat: 3.5, sodium: 80, carbs: 8, sugars: 4, protein: 7, fiber: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '051500255742': {
    barcode: '051500255742',
    name: 'Jif Natural Crunchy Peanut Butter Spread',
    brand: 'Jif',
    companyId: 'jm-smucker',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (33g)',
    calories: 196,
    ingredients: [
      'peanuts',
      'sugar',
      'palm oil',
      'salt',
      'molasses',
    ],
    nutrition: { fat: 16, saturatedFat: 3.5, sodium: 70, carbs: 8, sugars: 3, protein: 7, fiber: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '051500245408': {
    // UPC confirmed via jif.com product page fetch + Target.com fetch +
    // barcodeindex.com listing title (three independent confirmations).
    // Ingredients/nutrition replaced with jif.com's official panel — see
    // header note (Stage-1 wrongly returned Simply Jif's ingredient list,
    // which includes "sugar", contradicting the "No Added Sugar" claim).
    barcode: '051500245408',
    name: 'Jif No Added Sugar Creamy Peanut Butter Spread 15.5oz',
    brand: 'Jif',
    companyId: 'jm-smucker',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (33g)',
    calories: 200,
    ingredients: [
      'peanuts',
      'palm oil',
      'salt',
    ],
    nutrition: { fat: 17, saturatedFat: 3.5, sodium: 55, carbs: 7, sugars: 2, protein: 8, fiber: 3 },
    certifications: ['Kosher Pareve'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '051500255278': {
    barcode: '051500255278',
    name: 'Simply Jif Creamy Peanut Butter 15.5oz',
    brand: 'Jif',
    companyId: 'jm-smucker',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (33g)',
    calories: 196,
    ingredients: [
      'roasted peanuts',
      'hydrogenated vegetable oil',
      'mono- and diglycerides',
      'molasses',
      'sugar',
      'salt',
    ],
    nutrition: { fat: 17, saturatedFat: 3.5, sodium: 70, carbs: 7, sugars: 3, protein: 7, fiber: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '051500255186': {
    // Ingredients + calories corrected via jif.com official page — see
    // header note (Stage-1 OFF text was corrupted/truncated at the tail).
    barcode: '051500255186',
    name: 'Jif Reduced Fat Creamy Peanut Butter 16oz',
    brand: 'Jif',
    companyId: 'jm-smucker',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (36g)',
    calories: 190,
    ingredients: [
      'peanuts',
      'corn syrup solids',
      'sugar',
      'pea protein',
      'salt',
      'hydrogenated vegetable oil',
      'mono- and diglycerides',
      'molasses',
      'magnesium oxide',
      'niacinamide',
      'ferric orthophosphate',
      'zinc oxide',
      'copper sulfate',
      'pyridoxine hydrochloride',
      'folic acid',
    ],
    nutrition: { fat: 12, saturatedFat: 2.5, sodium: 190, carbs: 15, sugars: 4, protein: 7, fiber: 2 },
    certifications: ['Kosher Pareve'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '037600106139': {
    // Stage-1 (USDA path) had no barcode and per-100g-mislabeled-as-serving
    // nutrition (594 cal for a 32g serving). UPC confirmed via direct
    // upcitemdb.com page fetch; nutrition from myfooddiary.com (per-serving,
    // internally consistent with the macros).
    barcode: '037600106139',
    name: 'Skippy Super Chunk Peanut Butter 28oz',
    brand: 'Skippy',
    companyId: 'hormel',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (32g)',
    calories: 190,
    ingredients: [
      'roasted peanuts',
      'sugar',
      'hydrogenated vegetable oil',
      'salt',
    ],
    nutrition: { fat: 16, saturatedFat: 3, sodium: 125, carbs: 6, sugars: 3, protein: 7, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '037600106740': {
    barcode: '037600106740',
    name: 'Skippy Natural Creamy Peanut Butter Spread 40oz',
    brand: 'Skippy',
    companyId: 'hormel',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (32g)',
    calories: 190,
    ingredients: [
      'roasted peanuts',
      'sugar',
      'palm oil',
      'salt',
    ],
    nutrition: { fat: 16, saturatedFat: 3.49, sodium: 150, carbs: 6.02, sugars: 3, protein: 7.01, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '037600105330': {
    barcode: '037600105330',
    name: 'Skippy Natural Super Chunk Peanut Butter Spread',
    brand: 'Skippy',
    companyId: 'hormel',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (32g)',
    calories: 190,
    ingredients: [
      'roasted peanuts',
      'sugar',
      'palm oil',
      'salt',
    ],
    nutrition: { fat: 17, saturatedFat: 3.5, sodium: 120, carbs: 6, sugars: 3, protein: 7, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '037600105002': {
    // Full nutrition panel + ingredients replaced — see header note.
    // Stage-1's OFF record was internally impossible (475 cal serving vs a
    // ~65 kcal macro sum); official peanutbutter.com panel used instead.
    barcode: '037600105002',
    name: 'Skippy Reduced Fat Creamy Peanut Butter Spread 16.3oz',
    brand: 'Skippy',
    companyId: 'hormel',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (34g)',
    calories: 190,
    ingredients: [
      'roasted peanuts',
      'corn syrup solids',
      'sugar',
      'pea protein',
      'salt',
      'hydrogenated vegetable oil',
      'magnesium oxide',
      'ferric orthophosphate',
      'zinc oxide',
      'copper sulfate',
      'mono- and diglycerides',
      'niacinamide',
      'pyridoxine hydrochloride',
      'folic acid',
    ],
    nutrition: { fat: 12, saturatedFat: 2, sodium: 170, carbs: 14, sugars: 4, protein: 7, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '037600148221': {
    // Barcode + ingredients + nutrition all replaced — Stage-1 matched a
    // Swedish-labeled OFF record under the wrong barcode (0037600311069).
    // UPC confirmed directly on Target's product page.
    barcode: '037600148221',
    name: 'Skippy Creamy Peanut Butter Spread No Sugar Added 16oz',
    brand: 'Skippy',
    companyId: 'hormel',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (32g)',
    calories: 210,
    ingredients: [
      'roasted peanuts',
      'palm oil',
      'salt',
    ],
    nutrition: { fat: 18, saturatedFat: 4, sodium: 110, carbs: 4, sugars: 2, protein: 7, fiber: 1 },
    certifications: ['Kosher'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '045300005409': {
    barcode: '045300005409',
    name: 'Peter Pan Crunchy Peanut Butter 16.3oz',
    brand: 'Peter Pan',
    companyId: 'conagra',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (33g)',
    calories: 210,
    ingredients: [
      'roasted peanuts',
      'sugar',
      'hydrogenated vegetable oil',
      'salt',
    ],
    nutrition: { fat: 17, saturatedFat: 3.5, sodium: 100, carbs: 7, sugars: 5, protein: 8, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '051500062005': {
    barcode: '051500062005',
    name: "Smucker's Natural Chunky Peanut Butter",
    brand: "Smucker's",
    companyId: 'jm-smucker',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (32g)',
    calories: 190,
    ingredients: [
      'peanuts',
      'salt',
    ],
    nutrition: { fat: 16, saturatedFat: 3, sodium: 100, carbs: 7, sugars: 2, protein: 8, fiber: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '840379101393': {
    barcode: '840379101393',
    name: "Justin's Classic Peanut Butter Spread 28oz",
    brand: "Justin's",
    companyId: 'hormel',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (32g)',
    calories: 210,
    ingredients: [
      'dry roasted peanuts',
      'palm oil',
    ],
    nutrition: { fat: 18, saturatedFat: 3.5, sodium: 30, carbs: 6, sugars: 2, protein: 7, fiber: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '051500902882': {
    barcode: '051500902882',
    name: 'Santa Cruz Organic Dark Roasted Creamy Peanut Butter 16oz',
    brand: 'Santa Cruz Organic',
    companyId: 'jm-smucker',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (32g)',
    calories: 180,
    ingredients: [
      'roasted peanuts',
      'salt',
    ],
    nutrition: { fat: 16, saturatedFat: 2, sodium: 50, carbs: 6, sugars: 1, protein: 9, fiber: 3 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '051500507872': {
    // Full nutrition panel replaced — see header note. Stage-1's OFF record
    // had impossible values (fiber > total carbs, saturated fat > half of
    // total fat) confirmed present in OFF's own raw nutriments, not a
    // fetch-script bug. Replaced with eatthismuch.com's label-sourced data.
    barcode: '051500507872',
    name: 'Santa Cruz Organic Dark Roasted Crunchy Peanut Butter 16oz',
    brand: 'Santa Cruz Organic',
    companyId: 'jm-smucker',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (32g)',
    calories: 180,
    ingredients: [
      'roasted peanuts',
      'salt',
    ],
    nutrition: { fat: 16, saturatedFat: 2, sodium: 45, carbs: 6, sugars: 1, protein: 9, fiber: 3 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '071018010176': {
    // Renamed from the batch's input name ("Teddie All Natural Smooth
    // Peanut Butter") — this barcode resolves (confirmed via direct OFF API
    // call) to Teddie's UNSALTED smooth variant (ingredients = dry roasted
    // peanuts only, sodium 0). Flagged for reviewer: may not be the exact
    // SKU the batch intended.
    barcode: '071018010176',
    name: 'Teddie All Natural Smooth Unsalted Peanut Butter 16oz',
    brand: 'Teddie',
    companyId: 'teddie',
    category: 'Peanut Butter',
    image: null,
    servingSize: '2 tbsp (32g)',
    calories: 190,
    ingredients: [
      'dry roasted peanuts',
    ],
    nutrition: { fat: 16, saturatedFat: 2.5, sodium: 0, carbs: 7, sugars: 2, protein: 8, fiber: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },
};
