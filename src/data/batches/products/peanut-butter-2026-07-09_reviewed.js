// ─── PEANUT BUTTER 2026-07-09 · OPUS-REVIEWED ────────────────────────────────
// Independent Stage-3 review of Octavius's formatted batch. Result:
//   17 entries reviewed → 16 PASS, 1 FIX, 0 REJECT.
//   FIX: Peter Pan Crunchy companyId 'conagra' → 'post-holdings'.
//        Post Holdings completed acquisition of the Peter Pan peanut-butter
//        brand from Conagra (completed 2021-01-25); as of 2026 it is a Post
//        Consumer Brands product. Confirmed via Post Holdings' own
//        completion release + the existing products.js Nut Butters Peter Pan
//        entry (045300005492), which already uses companyId 'post-holdings'.
//        Octavius sourced the corrected label data from postconsumerbrands.com
//        yet still assigned 'conagra' — an ownership slip, likely following the
//        STALE brandToCompany map entry at companies.js:9676 ('peter pan':
//        'conagra'). That map entry should be corrected separately (flagged to
//        founder — out of scope for this batch file).
//
// Spot-checks that PASSED against independent sources:
//   - Jif No Added Sugar (051500245408): ingredients peanuts/palm oil/salt +
//     15.5oz UPC confirmed (jif.com, Target, upcitemdb).
//   - Skippy Reduced Fat: "pea protein" fix confirmed (peanutbutter.com/Hormel
//     Foodservice) — Stage-1's "soy protein concentrate" was wrong. 190 cal ✓.
//   - Skippy Super Chunk: UPC 037600106139 + 190 cal / 2 tbsp (32g) confirmed.
//   - Sodium unit fix (off-search grams→mg) verified on multiple entries
//     (0.11→110, 0.08→80, 0.15→150, 0.03→30, 0→0).
//   - Teddie 071018010176 = genuine distinct UNSALTED SKU (peanuts only,
//     sodium 0), separate barcode from the existing salted 071018010183.
//     Rename correct.
//   - Duplicate-barcode exclusions (Smucker's Natural Creamy 051500017005,
//     Crazy Richard's Creamy 074822610631): both confirmed byte-compatible
//     with existing Nut Butters entries. Exclusion is CORRECT and structurally
//     forced — products.js is a flat barcode→entry map where each key holds ONE
//     category; re-adding under "Peanut Butter" would overwrite/mutate the
//     existing Nut Butters entry, not coexist. Not an overreach by Octavius.
//   - Peter Pan Natural Creamy could_not_verify: correct. The only UPC a web
//     search surfaced (045300005409) is the barcode ALREADY used by Peter Pan
//     Crunchy in this batch — the summarizer conflated variants, exactly the
//     unreliability Octavius flagged. No fabricated barcode. Correct to omit.
//   - All 17 output barcodes confirmed NOT already present anywhere in
//     products.js (no silent-overwrite risk beyond the two excluded).
//
// FOUNDER NOTES (non-blocking):
//   1. companies.js:9676 brandToCompany map still says 'peter pan':'conagra' —
//      stale, should be 'post-holdings'. Fix in a separate pass.
//   2. isVegan: Octavius set the sweetened Jif/Skippy entries (which contain
//      mono- and diglycerides — ambiguous animal/plant source) to isVegan:true,
//      while the EXISTING Nut Butters entries for the same brands use
//      isVegan:false. Both are defensible (no animal ingredient is *declared*),
//      but it is an internal inconsistency worth a taxonomy decision. Left as
//      Octavius set it (not a factual error).
//   3. Catalog taxonomy: Smucker's Natural Creamy 16oz and Crazy Richard's
//      Creamy 16oz will live ONLY under "Nut Butters", not the new "Peanut
//      Butter" category, because of the single-category constraint above. If
//      "Peanut Butter" is meant to be a complete browse category, those two
//      SKUs are gaps by design — a product decision, not a data bug.
//
// ─────────────────────────────────────────────────────────────────────────────
// Original Octavius Stage-2 header preserved below for provenance.
// ─────────────────────────────────────────────────────────────────────────────
// 20 products fetched (Stage-1 script) · 0 raw misses reported by fetch.
// 17 formatted / 1 could_not_verify / 2 excluded as duplicate-barcode conflicts
// with the existing "Nut Butters" category.
//
// This batch is a DIFFERENT catalog category ("Peanut Butter") from the
// pre-existing "Nut Butters" category. The two are not merged/conflated —
// category stays exactly "Peanut Butter" below.
//
// STAGE-1 FETCH ERRORS CAUGHT (mismatched-product / bad-data corrections):
//   - crazy-richard-s-100-peanuts-creamy-peanut-butter: Stage-1 resolved to a
//     cookie-dough product. Re-researched to Crazy Richard's; verified UPC
//     074822610631 then collided with the existing Nut Butters entry — excluded.
//   - peter-pan-natural-creamy-peanut-butter-spread: Stage-1 resolved to the
//     HONEY ROAST variant. Correct label from postconsumerbrands.com; no
//     mod-10-valid UPC confirmable → could_not_verify.
//   - skippy-creamy-peanut-butter-spread-no-sugar-adde: Stage-1 matched a
//     Swedish-labeled OFF record. Replaced with US SKU (UPC 037600148221).
//   - jif-no-added-sugar-creamy-peanut-butter-spread: Stage-1 returned Simply
//     Jif ingredients (contained sugar). Replaced with jif.com official; UPC
//     051500245408 confirmed.
//   - jif-reduced-fat-creamy-peanut-butter-spread: Stage-1 OFF ingredient text
//     corrupted at tail. Replaced with jif.com clean list; calories 214→190.
//   - skippy-reduced-fat-creamy-peanut-butter-spread: Stage-1 OFF nutriment
//     internally impossible. Cross-confirmed peanutbutter.com panel; ingredient
//     "soy protein concentrate" corrected to "pea protein".
//   - skippy-super-chunk-peanut-butter: Stage-1 USDA per-100g mislabeled as
//     per-serving. Replaced with per-serving (190 cal); UPC 037600106139.
//   - santa-cruz-organic-dark-roasted-crunchy-peanut-b: Stage-1 OFF nutriment
//     impossible (fiber > carbs). Replaced with eatthismuch.com label data.
//
// SODIUM UNIT FIX: off-search records report sodium in GRAMS; normalized ×1000
// to mg for every off-search-sourced entry below.
//
// VARIANT-NAME FLAG: teddie 071018010176 resolves to Teddie's UNSALTED smooth
// variant (sodium 0, peanuts only) — kept and renamed accordingly.
//
// COULD NOT VERIFY (job a): peter-pan-natural-creamy-peanut-butter-spread —
// data good but no mod-10-valid UPC confirmable; left out per "never fabricate
// a barcode" rule.
//
// DUPLICATE-BARCODE CONFLICTS (excluded, already in catalog under "Nut Butters"):
//   - smucker-s-natural-creamy-peanut-butter (051500017005)
//   - crazy-richard-s-100-peanuts-creamy-peanut-butter (074822610631)
//
// OWNERSHIP: Jif, Smucker's, Santa Cruz Organic -> jm-smucker. Skippy,
// Justin's -> hormel. Peter Pan -> post-holdings (CORRECTED by Opus review;
// Octavius had 'conagra'). Teddie -> teddie. All keys present in companies.js.

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
    // UPC confirmed via jif.com product page + Target.com + barcodeindex.com
    // (three independent confirmations). Ingredients/nutrition = jif.com's
    // official panel (Stage-1 wrongly returned Simply Jif's list w/ sugar).
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
    // Ingredients + calories corrected via jif.com official page (Stage-1 OFF
    // text was corrupted/truncated at the tail).
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
    // Stage-1 (USDA path) had no barcode and per-100g-mislabeled nutrition.
    // UPC confirmed via upcitemdb; nutrition per-serving (myfooddiary), 190 cal.
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
    // Full nutrition panel + ingredients replaced. Stage-1's OFF record was
    // internally impossible; official peanutbutter.com panel used instead.
    // "pea protein" fix confirmed via peanutbutter.com / Hormel Foodservice.
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
    // Swedish-labeled OFF record under the wrong barcode. UPC confirmed on
    // Target's product page.
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
    // OPUS FIX: companyId 'conagra' -> 'post-holdings'. Post Holdings acquired
    // the Peter Pan peanut-butter brand from Conagra (completed 2021-01-25);
    // as of 2026 it is a Post Consumer Brands product. Matches the existing
    // products.js Peter Pan entry (045300005492), which uses 'post-holdings'.
    barcode: '045300005409',
    name: 'Peter Pan Crunchy Peanut Butter 16.3oz',
    brand: 'Peter Pan',
    companyId: 'post-holdings',
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
    // Full nutrition panel replaced — Stage-1's OFF record had impossible
    // values (fiber > total carbs). Replaced with eatthismuch.com label data.
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
    // Renamed from batch input ("Teddie All Natural Smooth Peanut Butter") —
    // this barcode resolves (OFF + retailer confirmation) to Teddie's UNSALTED
    // smooth variant (peanuts only, sodium 0). Distinct SKU from the existing
    // salted Nut Butters entry (071018010183). Verified genuine, not a fetch bug.
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
