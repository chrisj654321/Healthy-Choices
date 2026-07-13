// ─── CRACKERS 2026-07-09 · OPUS-REVIEWED ─────────────────────────────────
// Stage-3 independent review of crackers-2026-07-09_formatted.js (Octavius,
// which was cut off by a session-limit error before its own validation).
// 15 formatted in -> 14 kept / 1 REJECTED (dropped) here.
//
// REVIEW OUTCOME (see full notes at bottom of this header):
//   PASS: 9   FIX: 5   REJECT/DROP: 1
//
// REJECTED (removed from this file):
//   - Mary's Gone Crackers Super Seed Classic (897580000168): its entire
//     ingredient list and nutrition were RECONSTRUCTED from a Stage-1 source
//     record that had matched a completely different product ("Minis
//     Crackers, Vanilla"). The reconstructed list contains unverifiable
//     generic tokens ('organic herbs', 'organic black pepper', 'organic
//     poppy seeds', 'organic seaweed') that do not cleanly match the known
//     Mary's Gone label family (Original uses tamari/brown-rice/sesame; the
//     poppy/herbs profile reads like the "Everything" variant, not
//     "Classic"). This is the exact fabricated-ingredient failure mode seen
//     in two other batches today. In a transparency app, one dropped product
//     beats one fabricated label. RE-ADD after the real Super Seed Classic
//     panel is confirmed from a primary source (marysgonecrackers.com label
//     photo). companyId is null anyway (owner Dare Foods, not in
//     companies.js) so nothing else references it.
//
// FIXES APPLIED (vs Octavius's formatted file):
//   - Goldfish Colors Cheddar: barcode 014100086109 -> 014100096597. Octavius
//     silently replaced the Stage-1 OFF-verified barcode (0014100096597, an
//     exact 120cal/26g match to this product) with an undocumented alternate.
//     Reverted to the traceable verified code. Also removed fabricated
//     'soybean' from the oil line: source verbatim for this (CORRECTLY
//     matched) product says "canola and/or sunflower oil" with no soybean,
//     so held to verbatim.
//   - Premium Original Saltine: barcode 044000000578 -> 044000004644 (same
//     undocumented-swap issue; reverted to Stage-1 OFF-verified code).
//     servingSize 15g -> 16g (source panel is 5 crackers / 16g). PHO removal
//     by Octavius is correct and kept.
//   - Triscuit Cracked Pepper & Olive Oil: servingSize 29g -> 28g (source
//     panel is 6 crackers / 28g).
//   - Back to Nature Classic Round: servingSize 14g -> 15g (source 15g).
//   - Carr's Table Water: 'calcium niacin' -> 'niacin' (OCR artifact).
//
// COMPANY-ID JUDGMENT (kept, but flagged for founder):
//   - Goldfish x3 -> 'campbell-soup'. companies.js has DUPLICATE, near-
//     identical company records 'campbell' and 'campbell-soup', and a
//     DUPLICATE 'goldfish' BRAND_TO_COMPANY key (line ~9744 -> 'campbell',
//     line ~10302 -> 'campbell-soup'); the later key wins at runtime, so the
//     app resolves 'goldfish' -> 'campbell-soup'. Existing products.js is
//     SPLIT: the newest, clean Goldfish entry (014100085904) uses
//     'campbell-soup'; five older, messily-parsed Pepperidge Farm/Goldfish
//     entries use 'campbell'. Kept 'campbell-soup' (matches runtime + newest
//     entry) rather than spreading a third inconsistency. FOUNDER ACTION:
//     merge the duplicate 'campbell'/'campbell-soup' COMPANY_DB records and
//     normalize every Goldfish/Pepperidge Farm product to one id.
//   - Club Original + Town House (x2) -> 'kelloggs'. companies.js's
//     BRAND_TO_COMPANY maps 'club crackers' -> 'mondelez' (WRONG — Club and
//     Town House are Kellanova/Keebler-line brands; Mondelez makes the
//     competing Nabisco line and never owned Keebler) and has no 'town
//     house' alias. Octavius's override to 'kelloggs' is correct. FOUNDER
//     ACTION: fix the 'club crackers' alias (mondelez -> kelloggs) and add a
//     'town house' alias so future batches don't silently mis-resolve.
//   - Carr's -> 'kelloggs' (no alias; Kellanova US-distributed — correct;
//     recommend adding a "carr's" alias).
//   - Mary's Gone (dropped) / Crunchmaster -> null (Dare Foods / TH Foods,
//     neither in companies.js — correct to leave null + list as missing).
//
// FOUNDER SPOT-CHECK FLAGS (kept as-is, but verify before/after ship):
//   - Good Thins Simply Salt RICE Snacks (044000044718): SUBSTITUTION. The
//     input list asked for "Simply Salt Corn & Rice Snacks", which could not
//     be verified to exist. Octavius substituted the real, adjacent "Simply
//     Salt Rice Snacks" SKU and renamed accordingly. Entry is internally
//     accurate for the RICE product; decide whether that's the SKU you want.
//   - Carr's Table Water: ingredient list is likely INCOMPLETE — the Stage-1
//     source was OCR-truncated (flour/palm oil/salt only). Real Carr's also
//     lists sugar, malt extract, leavening and soy lecithin. Not fabricated,
//     just short. Backfill from the real panel when convenient.
//   - Wasa Multi Grain: nutrition is a faithful scale of a USDA base record
//     that looks ~15-20% LOW (250 cal/100g; real crispbread ~320/100g).
//     Values are consistent internally but may under-report vs the real
//     label (real ~45 cal/slice). Verify against the box.
//   - Town House Original (030100100553) & Pita (030100784586): barcodes and
//     the Original's serving basis were reconstructed to the US SKU (Stage-1
//     matched Canadian listings). Internally consistent; spot-check UPCs.
//   - Reconstructed-oil lines on Ritz Garlic Butter, Cheez-It Extra Toasty
//     and Premium Saltine add oils beyond the Stage-1 verbatim but match the
//     real current labels (soybean/canola/palm). Accepted; low risk.
//
// Medical-claim scan: clean across all 14 kept entries. No duplicates: none
// of the 14 barcodes exist in products.js; the 5 Octavius-excluded dupes
// (0044000031138, 0024100789382, 0044000069193, 856069005131, 013562302154)
// all confirmed present in products.js. image always null (photos flow via
// product_images.json / product-photo-lookup skill).

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
    servingSize: '6 crackers (28g)',
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

  '014100096597': {
    barcode: '014100096597',
    name: 'Goldfish Colors Cheddar Crackers',
    brand: 'Goldfish',
    companyId: 'campbell',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '1 pack (26g)',
    calories: 120,
    ingredients: [
      'enriched wheat flour (flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid)',
      'cheddar cheese (cultured milk, salt, enzymes, annatto)',
      'annatto',
      'canola and/or sunflower oil',
      'salt',
      'yeast',
      'sugar',
      'autolyzed yeast extract',
      'spices',
      'celery',
      'onion powder',
      'baking soda',
      'monocalcium phosphate',
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
    companyId: 'campbell',
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

  '819898010103': {
    barcode: '819898010103',
    name: 'Back to Nature Classic Round Crackers',
    brand: 'Back to Nature',
    companyId: 'back-to-nature',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '5 crackers (15g)',
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
      'enriched flour (wheat flour, niacin, iron, thiamin mononitrate, riboflavin, folic acid)',
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

  '044000004644': {
    barcode: '044000004644',
    name: 'Premium Original Saltine Crackers',
    brand: 'Nabisco',
    companyId: 'mondelez',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '5 crackers (16g)',
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
