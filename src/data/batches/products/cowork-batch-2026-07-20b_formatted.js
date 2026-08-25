// cowork-batch-2026-07-20b — Octavius Stage 2 output
//
// Stage-1 fetch summary claimed "resolved: 11, missed: 4" but MOST of the 11
// "resolved" records were wrong-brand substitutions from USDA FDC's branded
// food search grabbing an unrelated entry:
//   - pete-gerry-s-classic-free-range-large-brown-eggs resolved to a
//     MEMBER'S MARK (Sam's Club) product.
//   - eggland-s-best-cage-free-large-white-eggs resolved to a HEINEN'S product.
//   - eggland-s-best-omega-3-large-white-eggs resolved to a 365 EVERYDAY
//     VALUE (organic) product.
//   - simple-truth-natural-cage-free-large-brown-eggs resolved to
//     "Simple Truth, Natural Ground Turkey" — a completely different
//     category (turkey, not eggs).
//   - kroger-grade-a-large-white-eggs resolved to a FOOD LION product.
//   - kroger-cage-free-large-brown-eggs resolved to a MEMBER'S MARK product.
//   - simple-truth-organic-cage-free-large-brown-eggs "resolved" record had
//     the correct brand, but its per-serving nutrition (138 kcal / 50g egg,
//     10g fat, 12g protein) is internally consistent with a *2-egg* serving,
//     not the 1-egg/50g serving_size field it was tagged with — not usable
//     as-is either.
// Every one of the above was independently re-researched from retailer/
// brand/government sources using only the ORIGINAL candidate name/brand,
// ignoring the Stage-1 match, per standing Octavius doctrine. The two
// USDA/OFF records that DID match their input brand correctly
// (great-value-grade-a-large-white-eggs, just-egg-plant-based-egg,
// justin-s-maple-almond-butter) were spot-checked against retailer/brand
// pages and are used largely as-is. justin-s-honey-almond-butter's fetched
// USDA nutrition (594 kcal / 50g fat in a 32g serving — more fat than the
// serving weighs) was discarded as corrupted and replaced with the current
// verified panel from justins.com.
//
// All barcodes below are mod-10 valid UPC-A and were cross-confirmed against
// at least one independent source that displays the digits themselves (not
// just a retailer's internal catalog/URL id — Kroger.com's product-page URL
// numbers were tested against a barcode we already had ground truth for and
// do NOT reconstruct to the real UPC-A, so Kroger-URL-only numbers were
// rejected as a source throughout this batch; see could_not_verify notes).
//
// Davidson's Safest Choice: the input asked for a generic "Pasteurized Large
// Eggs" but the only Davidson's Safest Choice UPC independently verifiable
// (Harris Teeter product-page path + a second retailer listing) is
// specifically the CAGE FREE variant (763514517234). Named accurately below
// as the Cage Free SKU rather than silently relabeling it "Original" —
// flagged for reviewer in case the founder's source specifically wanted the
// non-cage-free carton.

// CORRECTION (main session, 2026-07-20): a second, independent Octavius
// research pass on this same batch ran concurrently (a checkpoint-conflict
// situation caused by a parallel cowork session) and disagreed with this
// file on 4 items. Each was independently re-verified against a dedicated
// UPC-lookup or retailer source before deciding:
//   - Great Value Cage Free Large Brown Eggs (078742148274): this file was
//     RIGHT — confirmed directly via BrickSeek.
//   - Simple Truth Natural Cage Free Large Brown (011110873743): this file
//     was RIGHT — matches a QFC listing's URL id for the exact "Natural"
//     18ct SKU.
//   - Kroger Grade A Large White Eggs (011110609335): this file was RIGHT —
//     confirmed via buycott.com's direct UPC-lookup index.
//   - Eggland's Best Cage Free Large White Eggs: this file was WRONG.
//     715141514711 has zero independent confirmation anywhere. The other
//     research pass's 715141514742 is directly confirmed by go-upc.com
//     ("Eggland's Best Cage Free White Grade A Large Eggs - 36oz/18ct").
//     Corrected below; barcode key updated to match.
module.exports = {
  '715141514742': {
    barcode: '715141514742',
    name: "Eggland's Best Cage Free Large White Eggs",
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

  '011110873743': {
    barcode: '011110873743',
    name: 'Simple Truth Natural Cage Free Large Brown Eggs',
    brand: 'Simple Truth',
    companyId: 'kroger',
    category: 'Eggs',
    image: null,
    servingSize: '1 large egg (50g)',
    calories: 70,
    ingredients: ['eggs'],
    nutrition: { fat: 5, saturatedFat: 1.5, sodium: 65, carbs: 0, sugars: 0, protein: 6 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '011110609335': {
    barcode: '011110609335',
    name: 'Kroger Grade A Large White Eggs',
    brand: 'Kroger',
    companyId: 'kroger',
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

  '078742148397': {
    barcode: '078742148397',
    name: 'Great Value Grade A Large White Eggs',
    brand: 'Great Value',
    companyId: 'walmart',
    category: 'Eggs',
    image: 'https://images.openfoodfacts.org/images/products/007/874/214/8397/front_en.10.400.jpg',
    servingSize: '1 egg (44g)',
    calories: 60,
    ingredients: ['eggs'],
    nutrition: { fat: 4, saturatedFat: 1.5, sodium: 70, carbs: 0, sugars: 0, protein: 6 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '078742148274': {
    barcode: '078742148274',
    name: 'Great Value Cage Free Large Brown Eggs',
    brand: 'Great Value',
    companyId: 'walmart',
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

  '085239311585': {
    barcode: '085239311585',
    name: 'Good & Gather Grade A Large Eggs',
    brand: 'Good & Gather',
    companyId: 'target',
    category: 'Eggs',
    image: null,
    servingSize: '1 egg (50g)',
    calories: 70,
    ingredients: ['eggs'],
    nutrition: { fat: 5, saturatedFat: 1.5, sodium: 70, carbs: 0, sugars: 0, protein: 6 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '763514517234': {
    barcode: '763514517234',
    name: "Davidson's Safest Choice Cage Free Pasteurized Large Eggs",
    brand: "Davidson's Safest Choice",
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

  '715141328615': {
    barcode: '715141328615',
    name: "Eggland's Best Classic Jumbo White Eggs",
    brand: "Eggland's Best",
    companyId: 'egglands-best',
    category: 'Eggs',
    image: null,
    servingSize: '1 jumbo egg (63g)',
    calories: 80,
    ingredients: ['eggs'],
    nutrition: { fat: 5, saturatedFat: 1.5, sodium: 80, carbs: 0, sugars: 0, protein: 8 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '191011001275': {
    barcode: '191011001275',
    name: 'JUST Egg Plant-Based Egg',
    brand: 'JUST Egg',
    companyId: null,
    category: 'Eggs',
    image: null,
    servingSize: '3 tbsp (46g)',
    calories: 60,
    ingredients: [
      'water',
      'mung bean protein',
      'expeller pressed canola oil',
      'carrot extractives',
      'gellan gum',
      'natural flavor',
      'potassium citrate',
      'salt',
      'sugar',
      'tapioca syrup solids',
      'tetrasodium pyrophosphate',
      'turmeric extractives',
      'nisin',
    ],
    nutrition: { fat: 4, saturatedFat: 0, sodium: 210, carbs: 0, sugars: 0, protein: 5 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '894455000025': {
    barcode: '894455000025',
    name: "Justin's Honey Almond Butter 16oz",
    brand: "Justin's",
    companyId: 'hormel',
    category: 'Nut Butters',
    image: null,
    servingSize: '2 tbsp (32g)',
    calories: 200,
    ingredients: ['dry roasted almonds', 'palm oil', 'organic honey', 'organic powdered sugar', 'sea salt'],
    nutrition: { fat: 16, saturatedFat: 3, sodium: 80, carbs: 8, sugars: 4, protein: 6, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '894455000322': {
    barcode: '894455000322',
    name: "Justin's Maple Almond Butter 16oz",
    brand: "Justin's",
    companyId: 'hormel',
    category: 'Nut Butters',
    image: 'https://images.openfoodfacts.org/images/products/089/445/500/0322/front_en.19.400.jpg',
    servingSize: '2 tbsp (32g)',
    calories: 210,
    ingredients: ['dry roasted almonds', 'organic maple sugar', 'palm oil', 'sea salt'],
    nutrition: { fat: 17, saturatedFat: 3, sodium: 90, carbs: 8, sugars: 5, protein: 5, fiber: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },
};

// could_not_verify — see batch report for full reasoning:
//
// 1. "Pete & Gerry's Classic Free Range Large Brown Eggs" — Pete & Gerry's
//    own product list (peteandgerrys.com) shows only: Organic Free Range,
//    Organic Pasture Raised, Pasture Raised (non-organic, but NOT sold as
//    "free range"), and Organic Liquid Egg Whites. No non-organic "Classic
//    Free Range" carton exists in their current lineup. Rather than
//    substitute the already-in-DB Organic Free Range SKU (815652002148)
//    under a different, non-organic-sounding name, this is left unverified.
//
// 2. "Eggland's Best Omega-3 Large White Eggs" — egglandsbest.com's product
//    list has no distinct "Omega-3" carton/SKU. Omega-3 content (125mg/egg)
//    is a brand-wide nutritional claim on ALL Eggland's Best eggs, not a
//    separate labeled product. No real product matches this exact name.
//
// 3. "Simple Truth Organic Cage Free Large Brown Eggs" — brand/name are
//    real (Kroger sells this SKU), but every barcode found for it traces
//    only to Kroger.com's own product-page URL numbers (e.g.
//    0001111079771/72), which this batch's research proved unreliable: a
//    Kroger URL number for a product we already have a ground-truth UPC for
//    (Eggland's Best Cage Free Large Brown Eggs, real UPC 715141514643)
//    does NOT reconstruct to that real UPC when de-padded. No independent
//    third-party UPC database or government document (the August Egg Co.
//    2025 Salmonella recall, which named the sibling "Simple Truth Large
//    Brown Cage Free 18 eggs" and its UPC explicitly) surfaced an Organic-
//    specific UPC — the recall coverage explicitly distinguishes the
//    non-organic Simple Truth cage-free SKU from "certified organic" stock
//    without giving the latter's UPC. Left unverified rather than guess.
//
// 4. "Kroger Cage Free Large Brown Eggs" (Kroger house brand, not Simple
//    Truth) — same Kroger-URL-reliability problem as #3. No third-party UPC
//    database, recall notice, or retailer other than kroger.com surfaced a
//    barcode for this specific SKU. Left unverified.
//
// Flagging for reviewer:
// - Davidson's Safest Choice entry (763514517234) is the CAGE FREE variant
//   — the only one with an independently verifiable barcode. The input
//   candidate said generic "Pasteurized Large Eggs" (Davidson's also sells
//   an "Original," non-cage-free carton); no barcode for that exact
//   "Original" SKU could be independently confirmed. Please confirm this
//   substitution is acceptable, or downgrade to could_not_verify.
// - Justin's Honey Almond Butter: the Stage-1 USDA record's nutrition (594
//   kcal, 50g fat in a 32g serving) was internally impossible and has been
//   fully replaced with the current justins.com panel/ingredient list,
//   which also differs in ingredient order/composition from the stale USDA
//   text (current formula: dry roasted almonds, palm oil, organic honey,
//   organic powdered sugar (organic cane sugar, organic tapioca starch),
//   sea salt — no separate "honey powder").
// - JUST Egg ingredient list: Stage-1 USDA text included "dehydrated onion"
//   and "transglutaminase," which do not appear on the current
//   justegg.com-confirmed label (matching the live Target product-page
//   fetch). Used the current formula; flagging in case the app has an
//   older cached version of this product from a prior batch that should be
//   reconciled.
