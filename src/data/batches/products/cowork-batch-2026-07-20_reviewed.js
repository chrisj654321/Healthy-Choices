// cowork-batch-2026-07-20 — Stage 3 independent QA review (Opus)
//
// Reviewed Octavius's Stage-2 output (cowork-batch-2026-07-20_formatted.js)
// against the raw Stage-1 fetch (cowork-batch-2026-07-20_fetched.json). Every
// record below was re-checked field-by-field: ingredients vs. verbatim source,
// nutrition math, ownership resolution vs. companies.js + real-world facts,
// barcode mod-10 (UPC-A check digit), and screening for medical-causation
// language (none found anywhere in the batch — clean).
//
// RESULT: 8 PASS (2 as-is + 6 after a documented fix I applied), 4 to
// could_not_verify. Counts and reasoning in the trailing block.
//
// Barcode note: all 13 formatted UPCs pass the mod-10 check digit. Where a
// barcode did NOT exist in the Stage-1 fetch (USDA-FDC records carry no UPC),
// Octavius supplied one from its own research. A valid check digit is
// necessary but not sufficient (≈10% of random 12-digit strings pass), so
// each researcher-supplied barcode is tagged _barcodeSource:'researcher' and
// should be scanned/photo-confirmed before it becomes the production key.
// Barcodes that came straight from a Stage-1 matched_off_code are tagged
// 'fetched'.
//
// Ownership note: Octavius's ownership research is accurate and actually
// caught STALE data in companies.js — see the "companies.js corrections
// needed" block at the bottom. Do not merge those silently; they belong to
// the founder.

module.exports = {
  // ── PASS as-is ────────────────────────────────────────────────────────

  '818290015488': {
    barcode: '818290015488',
    name: 'Chobani Caramel Macchiato Coffee Creamer',
    brand: 'Chobani',
    companyId: 'chobani', // verified: companies.js chobani→chobani
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15g)',
    calories: 35,
    // Stage-1 verbatim was garbled OCR ("Milk, cream, cane sug natural
    // flavors ..."). Reconstructed from the legible fragment. May be
    // INCOMPLETE (real SKU likely carries stabilizers not captured by OCR) —
    // acceptable for pipeline but re-photo the panel before relying on it.
    ingredients: ['milk', 'cream', 'cane sugar', 'natural flavors'],
    nutrition: { fat: 1.5, saturatedFat: 1, sodium: 10, carbs: 5, sugars: 5, protein: 0 }, // matches fetched (sodium 0.01g→10mg ✓)
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
    _barcodeSource: 'fetched', // == fetched matched_off_code 0818290015488
    _reviewNote: 'ingredients reconstructed from garbled OCR; nutrition+barcode verified',
  },

  '859922007396': {
    barcode: '859922007396',
    name: 'nutpods French Vanilla Unsweetened Almond + Coconut Creamer',
    brand: 'nutpods',
    companyId: 'nutpods', // verified: companies.js nutpods→nutpods
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15g)',
    calories: 10,
    ingredients: [
      'water', 'coconut cream', 'almonds', 'natural flavors', 'acacia gum',
      'dipotassium phosphate', 'sunflower lecithin', 'sea salt', 'gellan gum',
    ], // exact match to fetched USDA verbatim ✓
    nutrition: { fat: 1, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 }, // matches fetched (fetched sodium was null → 0)
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
    _barcodeSource: 'researcher', // NOT in fetch (USDA record, no UPC); confirm by scan
  },

  '041570030837': {
    barcode: '041570030837',
    name: 'Blue Diamond Smokehouse Almonds',
    brand: 'Blue Diamond',
    companyId: 'blue-diamond',
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 170,
    ingredients: [
      'almonds', 'vegetable oil (canola, safflower and/or sunflower)', 'salt',
      'corn maltodextrin', 'natural hickory smoke flavor', 'yeast',
      'hydrolyzed corn and soy protein', 'natural flavors',
    ], // matches fetched verbatim ✓
    nutrition: { fat: 16, saturatedFat: 1, sodium: 150, carbs: 5, sugars: 1, protein: 6 }, // matches fetched (0.15g→150mg ✓)
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
    _barcodeSource: 'fetched',
  },

  '041570350461': {
    barcode: '041570350461',
    name: 'Blue Diamond Bold Sriracha Almonds',
    brand: 'Blue Diamond',
    companyId: 'blue-diamond',
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 170,
    ingredients: [
      'almonds', 'vegetable oil (canola, safflower and/or sunflower)', 'sugar',
      'salt', 'corn maltodextrin', 'paprika', 'garlic powder',
      'cayenne pepper sauce (salt, aged cayenne red peppers, vinegar solids, garlic)',
      'tomato powder', 'citric acid', 'yeast extract', 'vinegar solids',
      'extractives of paprika', 'natural flavor',
    ], // matches fetched verbatim ✓
    nutrition: { fat: 15, saturatedFat: 1, sodium: 120, carbs: 5, sugars: 2, protein: 6 }, // matches fetched (0.12g→120mg ✓)
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
    _barcodeSource: 'fetched',
  },

  '041570072561': {
    barcode: '041570072561',
    name: 'Blue Diamond Honey Roasted Almonds',
    brand: 'Blue Diamond',
    companyId: 'blue-diamond',
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 160,
    ingredients: ['almonds', 'sugar', 'vegetable oil (canola, safflower and/or sunflower)', 'honey', 'salt', 'corn maltodextrin'], // matches fetched verbatim ✓
    nutrition: { fat: 13, saturatedFat: 1, sodium: 60, carbs: 9, sugars: 5, protein: 5 }, // matches fetched ✓
    certifications: [],
    isOrganic: false,
    isVegan: false, // correct — contains honey
    isGlutenFree: true,
    _barcodeSource: 'fetched',
  },

  '041570130766': {
    barcode: '041570130766',
    name: 'Blue Diamond Lightly Salted Almonds',
    brand: 'Blue Diamond',
    companyId: 'blue-diamond',
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz / 28 nuts (28g)',
    calories: 170,
    ingredients: ['almonds', 'vegetable oil (almond, canola, safflower and/or sunflower)', 'sea salt'], // matches fetched verbatim ✓
    nutrition: { fat: 16, saturatedFat: 1, sodium: 40, carbs: 5, sugars: 1, protein: 6 }, // matches fetched (0.04g→40mg ✓)
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
    _barcodeSource: 'fetched',
  },

  '010300933649': {
    barcode: '010300933649',
    name: 'Emerald Roasted & Salted Whole Cashews',
    brand: 'Emerald',
    companyId: null, // Emerald not in companies.js. Octavius flags Flagstone Foods
    // (divested by Campbell Soup) as parent; not yet mapped, so null is the
    // safe choice — no fabricated company. Add 'flagstone' mapping later if desired.
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 170,
    ingredients: ['cashews', 'vegetable oil (safflower, sunflower, and/or canola oil)', 'salt', 'rosemary extract'], // matches fetched (dropped harmless parenthetical "(to preserve freshness)") ✓
    nutrition: { fat: 13, saturatedFat: 2, sodium: 80, carbs: 8, sugars: 2, protein: 5 }, // matches fetched (0.08g→80mg ✓)
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
    _barcodeSource: 'fetched',
  },

  '893869005084': {
    barcode: '893869005084',
    name: 'Sahale Snacks Honey Almonds Glazed Mix',
    brand: 'Sahale Snacks',
    companyId: 'second-nature-brands', // verified current owner (see companies.js note)
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1/4 cup (30g)', // FIX: was '(28g)'; per-serving math implies ~30-31g, and real label is 30g
    calories: 170,
    ingredients: [
      'almonds', 'dried cranberries (sugar, cranberries)', 'organic cane sugar',
      'sesame seeds', 'organic tapioca syrup', 'brown sugar', 'sea salt',
      'organic tapioca syrup solids', 'organic honey', 'ground vanilla beans',
      'vanilla extract', 'almond extract', 'natural flavors',
    ], // exact match to fetched verbatim ✓
    nutrition: { fat: 13, saturatedFat: 1, sodium: 160, carbs: 11, sugars: 7, protein: 5 }, // per-100g→per-serving conversion verified against fetched ✓
    certifications: [],
    isOrganic: false,
    isVegan: false, // contains honey
    isGlutenFree: false, // FIX: Octavius inferred GF from absence of wheat (low-confidence, no label claim). Conservative default.
    _barcodeSource: 'fetched',
    _reviewNote: 'nutrition per-serving conversion verified; serving grams corrected 28→30; isGlutenFree downgraded true→false (no explicit claim)',
  },

  // ── PASS after a fix I applied ────────────────────────────────────────

  '029000016156': {
    barcode: '029000016156',
    name: 'Planters Deluxe Whole Cashews',
    brand: 'Planters',
    companyId: 'hormel', // verified: Hormel acquired Planters from Kraft Heinz in 2021. companies.js is STALE here (still maps planters→kraft-heinz).
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 160,
    // FIX: Octavius wrote ['cashews','sea salt','peanut oil'] — dropped the
    // "and/or cottonseed oil" from the fetched verbatim ("CASHEW, SEA SALT,
    // PEANUT AND/OR COTTONSEED OIL.") and appears copy-pasted from the other
    // Planters record. Restored to source.
    ingredients: ['cashews', 'sea salt', 'peanut and/or cottonseed oil'],
    nutrition: { fat: 13, saturatedFat: 2.5, sodium: 100, carbs: 9, sugars: 2, protein: 5 }, // per-100g→per-28g conversion verified against fetched ✓
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
    _barcodeSource: 'researcher', // NOT in fetch (USDA record); confirm by scan
    _reviewNote: 'ingredient "cottonseed oil" restored (Octavius dropped it); per-serving nutrition conversion verified',
  },

  '077034089974': {
    barcode: '077034089974',
    name: "Kar's Sweet 'N Salty Mix",
    brand: "Kar's",
    companyId: 'second-nature-brands', // verified: Kar's Nuts rebranded to Second Nature Brands
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1/4 cup (28g)',
    calories: 140,
    ingredients: [
      'peanuts', 'sunflower oil', 'cottonseed oil', 'salt', 'raisins',
      "chocolate candies (confectionery coating [sugar, partially hydrogenated palm kernel oil, cocoa powder, whey powder, nonfat milk powder, soy lecithin, vanillin], sugar, artificial coloring, gum arabic, corn syrup, confectioner's glaze)",
      'yellow 6 lake', 'yellow 6', 'yellow 5 lake', 'blue 1 lake', 'red 40 lake', 'blue 2 lake',
      'sunflower kernels',
    ], // all terms present in fetched verbatim (colors surfaced from the chocolate-candies parenthetical); nothing invented ✓
    nutrition: { fat: 9, saturatedFat: 2.5, sodium: 60, carbs: 13, sugars: 10, protein: 4 }, // per-100g→per-28g conversion verified against fetched ✓
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false, // FIX: Octavius inferred GF from absence of wheat (low-confidence, no label claim). Conservative default.
    _barcodeSource: 'researcher', // NOT in fetch (USDA record); confirm by scan
    _reviewNote: 'per-serving nutrition conversion verified; isGlutenFree downgraded true→false (no explicit claim)',
  },

  '070690270632': {
    barcode: '070690270632',
    name: 'Fisher Deluxe Mixed Nuts',
    brand: 'Fisher',
    companyId: 'sanfilippo', // verified: companies.js fisher→sanfilippo (John B. Sanfilippo & Son)
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 170,
    // FIX: Octavius DROPPED "filberts" and reordered the nuts. Fetched verbatim:
    // "ALMONDS, CASHEWS, PECANS, BRAZILS, VEGETABLE OIL (...), FILBERTS, SEA SALT."
    // Restored filberts and source order.
    ingredients: [
      'almonds', 'cashews', 'pecans', 'brazil nuts',
      'vegetable oil (peanut, cottonseed, soybean and/or sunflower seed)',
      'filberts', 'sea salt',
    ],
    nutrition: { fat: 16, saturatedFat: 2, sodium: 110, carbs: 6, sugars: 1, protein: 5 }, // FIX: fat 15→16 (57.1g/100g × 0.28 = 16.0); rest matches conversion ✓
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
    _barcodeSource: 'researcher', // NOT in fetch (USDA record); confirm by scan
    _reviewNote: 'filberts restored + nut order corrected to source; fat rounded 15→16 to match conversion',
  },
};

// ── could_not_verify / rejected ─────────────────────────────────────────
//
// 1. Planters "Roasted & Salted Cashews" (Octavius shipped as
//    "Planters Salted Cashew Halves & Pieces", UPC 029000016071)
//    REJECTED. Octavius correctly caught that Stage-1 matched an unrelated
//    Kraft-Heinz "Deluxe Salted Mixed Nuts" (5-nut blend). But its
//    replacement record is unverifiable: the name, barcode, AND full nutrition
//    (fetched nutrition was all null) are entirely from Octavius's own
//    knowledge with zero corroboration in the fetch — and it substituted a
//    DIFFERENT SKU ("Halves & Pieces") than the requested "Roasted & Salted
//    Cashews". Barcode passes mod-10 but that's the only thing checkable.
//    Nothing here can be verified against source data → do not merge.
//    module.exports entry withheld: 029000016071.
//
// 2. Wonderful Pistachios No Shells Chili Roasted (UPC 014113910873)
//    REJECTED for ingredients. Barcode is legit (fetched matched_off_code)
//    and nutrition matches fetched — BUT the fetched ingredients_verbatim was
//    only "Pistachios, sunflower oil" (truncated OFF record). Octavius
//    expanded it to 13 ingredients, adding 11 that appear nowhere in the
//    source, several oddly specific and likely hallucinated ("red tabasco
//    pepper", "malic acid", "turmeric extract"). A chili-roasted product with
//    a 2-item list is wrong, but an 11-item invented seasoning list is worse.
//    Cannot verify the real panel against the provided source → withheld
//    pending a photographed ingredient panel. (If re-added, keep barcode
//    014113910873 and the verified nutrition; only the ingredient list is the
//    blocker.)
//
// 3. Wonderful Pistachios No Shells Salt & Pepper — UPHELD could_not_verify.
//    Stage-1 matched a Great Value (Walmart) SKU, not Wonderful. Octavius
//    correctly refused it. No trustworthy complete record or checkable UPC
//    for the real Wonderful SKU was obtained. Correct call.
//
// 4. "Good & Gather Monster Trail Mix" — UPHELD could_not_verify.
//    Octavius's finding is sound: no such product exists under Good & Gather;
//    Target's actual "Monster Trail Mix" is the Favorite Day private label
//    (UPC 085239156766, mod-10 valid). Octavius correctly did NOT unilaterally
//    re-brand a Favorite Day product as Good & Gather. If the founder wants it
//    added as Favorite Day (companyId would be Target's private-label owner —
//    not currently a mapped company), the captured data is in the Stage-2
//    file's trailing note. Decision belongs to the founder.

// ── companies.js corrections needed (flag to founder — do NOT auto-apply) ──
//
// Octavius's ownership research surfaced two real staleness bugs in
// src/data/companies.js. The reviewed records above use the CORRECT owner;
// the map itself still needs fixing:
//
//   A. Planters → Hormel, not Kraft Heinz. Hormel Foods acquired the Planters
//      snack-nuts business from Kraft Heinz in 2021 (closed June 2021).
//      companies.js still maps 'planters': 'kraft-heinz' (~line 9634) AND
//      lists "Planters" in kraft-heinz.subsidiaries (~line 388). Both should
//      move to 'hormel' (which already lists Planters-adjacent brands and has
//      a full entry). The 3 stale product-map lines (9184-9190,
//      'planters ...': 'The Kraft Heinz Company') are also wrong.
//
//   B. Duplicate key 'sahale snacks' — mapped to 'jm-smucker' (~line 9746)
//      AND to 'second-nature-brands' (~line 10160). JS keeps the last, so it
//      resolves to second-nature-brands (correct: Second Nature Brands
//      acquired Sahale from J.M. Smucker), but the dead 'jm-smucker' line
//      should be deleted to avoid confusion.
//
// Neither is applied here — companies.js edits are the founder's call.
