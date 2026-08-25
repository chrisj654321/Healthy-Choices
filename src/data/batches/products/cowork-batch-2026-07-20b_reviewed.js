// cowork-batch-2026-07-20b — Independent Opus reviewer pass (Stage 3)
// Reviewed 2026-07-20. Source of truth: cowork-batch-2026-07-20b_fetched.json
// (Stage-1) + independent web verification of every barcode, ownership, and
// each label override Octavius claimed in Stage 2.
//
// VERDICT: 11 products in Octavius's PASS list, 4 could_not_verify.
//   - 9 PASS as-is
//   - 2 PASS after a reviewer FIX (JUST Egg, Justin's Maple Almond Butter)
//   - 0 rejected out of the PASS list
//   - 4 could_not_verify — ALL FOUR of Octavius's calls independently confirmed
//
// BARCODES: all 11 pass mod-10 AND were confirmed to belong to the exact named
// product via independent (non-Kroger-URL) sources:
//   715141514742 Eggland's CF Lg White  -> go-upc.com (barcode-conflict FIX,
//                                          main session 2026-07-20; the earlier
//                                          715141514711 had zero independent
//                                          confirmation and was superseded)
//   715141328615 Eggland's Jumbo White  -> upcitemdb / Fairway / ShopRite
//   011110873743 Simple Truth Nat CF Brn -> buycott + Aug 2025 recall notice
//   011110609335 Kroger Grade A Lg White -> buycott "Kroger 18 Large Eggs"
//   078742148397 Great Value Grade A Wht -> OFF (front image, matched_off_code)
//   078742148274 Great Value CF Lg Brown -> BrickSeek 18ct
//   085239311585 Good & Gather Grade A   -> upcitemdb / cooklist / OFF
//   763514517234 Davidson's CF Pasteur.  -> Harris Teeter / Cub / Amazon
//   191011001275 JUST Egg 16oz           -> The Fresh Grocer / Fairway id 00191011001275
//   894455000025 Justin's Honey Almond   -> Kroger / ShopRite / Gourmet Garage
//   894455000322 Justin's Maple Almond   -> OFF (front image, matched_off_code)
// GS1 prefixes are all brand-consistent (715141=Eggland's, 011110=Kroger,
// 078742=Walmart, 085239=Target, 894455=Justin's, 191011=Eat Just). Confirmed
// Octavius's "Kroger-URL numbers are unreliable" finding: Kroger's own 13-digit
// page ids (e.g. 0019101100127 for JUST Egg, 0001111079771/72 for Simple Truth
// Organic) do NOT reconstruct to valid UPC-A; the real UPCs he used do.
//
// REVIEWER FIXES applied below:
//  A) JUST Egg — Octavius's Stage-2 note claimed "dehydrated onion" and
//     "transglutaminase" are NOT on the current label and dropped both. That is
//     WRONG: current retail labels (H-E-B, Kroger, Food Republic ingredient
//     breakdown) list BOTH, and both are in the Stage-1 USDA verbatim. Restored
//     them (list re-decoded faithfully to the USDA verbatim order). Also aligned
//     nutrition to the Stage-1 source per 46g serving (was 60/4/210/0; source
//     -> 70 cal, 5g fat, 180mg sodium, 1g carb).
//  B) Justin's Maple Almond Butter — ingredients (almonds, organic maple sugar,
//     palm oil, sea salt) contain no animal products; Octavius marked
//     isVegan:false. Corrected to true, consistent with the in-DB Justin's
//     Classic Almond Butter (894455000315, isVegan:true). (Honey Almond stays
//     isVegan:false — it contains honey.)
//
// OVERRIDES I VERIFIED (Octavius was RIGHT):
//  - Justin's Honey Almond Butter: Stage-1 USDA record (594 kcal / 50g fat in a
//    32g serving — impossible) was correctly discarded. justins.com confirms the
//    exact override list (dry roasted almonds, palm oil, organic honey, organic
//    powdered sugar, sea salt) and 6g protein / serving. Override justified.
//
// COMPANY IDs still null pending companies.js additions (carry-forward, not a
// reviewer block): JUST Egg -> Eat Just, Inc.; Davidson's -> National
// Pasteurized Eggs, Inc. Both confirmed absent from companies.js.
// New ingredientCache.js entries flagged by Octavius are all confirmed ABSENT
// from ingredientCache.js and should be added on merge: carrot extractives,
// turmeric extractives, tapioca syrup solids, dry roasted almonds, organic
// powdered sugar (+ dehydrated onion / transglutaminase for JUST Egg).

module.exports = {
  // Barcode-conflict FIX (main session 2026-07-20, carried into this checkpoint):
  // 715141514711 -> 715141514742. The corrected value is directly confirmed by
  // go-upc.com ("Eggland's Best Cage Free White Grade A Large Eggs - 36oz/18ct");
  // the prior 715141514711 had no independent confirmation. Nutrition unchanged.
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

  // Reviewer-accepted SKU substitution: barcode is verified to be the CAGE FREE
  // Davidson's Safest Choice carton and the name says so — honest and internally
  // consistent. Accept as-is. (If the founder's source specifically wanted the
  // non-cage-free "Original" pasteurized carton, that SKU has NO independently
  // verifiable UPC and would move to could_not_verify — see reviewer note.)
  '763514517234': {
    barcode: '763514517234',
    name: "Davidson's Safest Choice Cage Free Pasteurized Large Eggs",
    brand: "Davidson's Safest Choice",
    companyId: null, // add National Pasteurized Eggs, Inc. to companies.js
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

  // FIX A: restored dehydrated onion + transglutaminase (on current label &
  // in Stage-1 source); nutrition aligned to Stage-1 source per 46g serving.
  '191011001275': {
    barcode: '191011001275',
    name: 'JUST Egg Plant-Based Egg',
    brand: 'JUST Egg',
    companyId: null, // add Eat Just, Inc. to companies.js
    category: 'Eggs',
    image: null,
    servingSize: '3 tbsp (46g)',
    calories: 70,
    ingredients: [
      'water',
      'mung bean protein',
      'expeller pressed canola oil',
      'dehydrated onion',
      'gellan gum',
      'carrot extractives',
      'turmeric extractives',
      'potassium citrate',
      'salt',
      'sugar',
      'tapioca syrup solids',
      'tetrasodium pyrophosphate',
      'transglutaminase',
      'nisin',
    ],
    nutrition: { fat: 5, saturatedFat: 0, sodium: 180, carbs: 1, sugars: 0, protein: 5 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  // Octavius's override VERIFIED against justins.com (Stage-1 USDA nutrition was
  // physically impossible and correctly discarded).
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

  // FIX B: isVegan false -> true (no animal ingredients).
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
    isVegan: true,
    isGlutenFree: true,
  },
};

// ============================================================================
// could_not_verify / rejected — each independently re-checked, NOT taken on
// Octavius's word. All four of his calls CONFIRMED CORRECT.
// ============================================================================
module.exports.could_not_verify = [
  {
    candidate: "Pete & Gerry's Classic Free Range Large Brown Eggs",
    brand: "Pete & Gerry's",
    reviewer_verdict: 'CONFIRMED could_not_verify (agree with Octavius)',
    reason:
      "Pete & Gerry's current lineup (peteandgerrys.com) is Organic Free Range, " +
      'Pasture Raised, and Organic Pasture Raised only — no non-organic "Classic ' +
      'Free Range" carton exists. The DB already holds their Organic Free Range ' +
      'Large (815652002148); relabeling it non-organic would be a fabrication. ' +
      "Likely a candidate-list error (possibly confused with the sister brand " +
      "Nellie's Free Range, which IS the non-organic line, UPC 815652004180 " +
      'already in DB).',
  },
  {
    candidate: "Eggland's Best Omega-3 Large White Eggs",
    brand: "Eggland's Best",
    reviewer_verdict: 'CONFIRMED could_not_verify (agree with Octavius)',
    reason:
      'No distinct "Omega-3" carton/SKU exists. Omega-3 (~125mg/egg) is a ' +
      'brand-wide nutritional callout printed across ALL Eggland\'s Best varieties ' +
      '(Classic, Cage Free, Organic, Jumbo), not a separately labeled product. ' +
      'Nothing to attach a unique barcode to.',
  },
  {
    candidate: 'Simple Truth Organic Cage Free Large Brown Eggs',
    brand: 'Simple Truth Organic',
    reviewer_verdict: 'CONFIRMED could_not_verify (agree with Octavius)',
    reason:
      'Real product, but the only barcodes found are Kroger internal page ids ' +
      '(0001111079771 Grade AA / 0001111079772 Grade A — they even disagree on ' +
      'the trailing digit for the same carton), which this batch proved do NOT ' +
      'reconstruct to valid UPC-A. No third-party UPC DB (upcitemdb/buycott/OFF) ' +
      'or the Aug-2025 August Egg Co. recall surfaced an Organic-specific UPC — ' +
      'the recall explicitly separated the non-organic Simple Truth cage-free SKU ' +
      '(011110873743, which IS in the PASS list) from certified-organic stock ' +
      'without giving the latter\'s UPC. No verifiable barcode -> reject.',
  },
  {
    candidate: 'Kroger Cage Free Large Brown Eggs (Kroger house brand)',
    brand: 'Kroger',
    reviewer_verdict: 'CONFIRMED could_not_verify (agree with Octavius)',
    reason:
      'Only a Kroger internal page id (0001111090408) exists; no third-party UPC ' +
      'database, recall notice, or non-Kroger retailer surfaced a real UPC-A for ' +
      'this specific house-brand SKU. Same Kroger-URL-unreliability problem. No ' +
      'verifiable barcode -> reject.',
  },
];

// ============================================================================
// Reviewer flags for the founder / merge step:
//  1. Davidson's Safest Choice (763514517234): ACCEPTED as the Cage Free SKU —
//     barcode independently verified, name honestly reflects it. Only downgrade
//     to could_not_verify if the intended candidate was specifically the
//     non-cage-free "Original" carton (no verifiable UPC for that one).
//  2. companies.js: add Eat Just, Inc. (JUST Egg) and National Pasteurized
//     Eggs, Inc. (Davidson's) — both confirmed missing; set companyId on merge.
//  3. ingredientCache.js: add carrot extractives, turmeric extractives, tapioca
//     syrup solids, dry roasted almonds, organic powdered sugar, dehydrated
//     onion, transglutaminase — all confirmed missing.
//  4. JUST Egg: if a prior batch cached an older JUST Egg record, reconcile —
//     the current verified label DOES include dehydrated onion & transglutaminase
//     (Octavius's Stage-2 claim that they were removed was incorrect).
// ============================================================================
