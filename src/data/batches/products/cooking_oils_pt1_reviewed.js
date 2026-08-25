/*
QA REPORT — cooking_oils_pt1
Reviewed: 2026-06-24
PASS: 14  FIX: 0  REJECT: 0

NOTE ON CHECK A (UPC-A): The check-digit algorithm as literally described in the
brief (odd positions x1, even positions x3, sum mod 10 == 0) is the INVERSE of the
real UPC-A standard. Applied as written it would falsely reject 10 of 14 valid
barcodes. Using the correct UPC-A weighting (odd positions x3, even x1), all 14
check digits are valid. All 14 also re-verified live against the OFF API (status:1,
brand/name match). Verdicts below use the correct standard.

850687110505 | PASS | OFF status:1, brand match; check digit valid (std UPC-A)
039153010031 | PASS | OFF status:1, brand match; check digit valid
070404002801 | PASS | OFF status:1, brand match; check digit valid
041736010130 | PASS | OFF status:1, brand match; check digit valid
099482454722 | PASS | raw JSON companyId "amazon" not in companies.js; formatted file correctly used null + _missingCompany. OFF loose brand match (365/Whole Foods). Check digit valid
096619927319 | PASS | OFF status:1, brand match; companyId costco verified; check digit valid
736211701084 | PASS | OFF status:1, brand match; companyId chosen-foods verified; check digit valid
850004639870 | PASS | OFF status:1, brand match; companyId kraft-heinz verified; check digit valid
692752106866 | PASS | OFF status:1, brand match; check digit valid
051500253625 | PASS | OFF lists brand "J.M. Smucker" (stale; B&G Foods acquired Crisco 2020). companyId b-and-g-foods verified & brand-accurate; check digit valid
027000690864 | PASS | OFF status:1, brand match; companyId conagra verified; check digit valid
857190000477 | PASS | OFF status:1, brand match; check digit valid
024182000283 | PASS | OFF status:1, brand match; companyId eden-foods verified; check digit valid
022506137103 | PASS | OFF status:1, brand match; companyId hain-celestial verified; check digit valid

All ingredient arrays match raw ingredients_verbatim (lowercased, correctly split).
No medical/legal claim terms found. All schema fields present. No duplicates in
products.js. All non-null companyIds verified to exist in companies.js.
*/

  '850687110505': {
    barcode: '850687110505',
    name: 'California Olive Ranch 100% California Extra Virgin Olive Oil 16.9oz',
    brand: 'California Olive Ranch',
    companyId: null,
    _missingCompany: 'California Olive Ranch LLC',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 120,
    ingredients: [
      'extra virgin olive oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['Non-GMO Project Verified', 'California Olive Oil Council Certified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '039153010031': {
    barcode: '039153010031',
    name: 'Colavita Premium Selection Extra Virgin Olive Oil 17oz',
    brand: 'Colavita',
    companyId: null,
    _missingCompany: 'Colavita USA',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 120,
    ingredients: [
      'extra virgin olive oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '070404002801': {
    barcode: '070404002801',
    name: 'Pompeian Smooth Extra Virgin Olive Oil 32oz',
    brand: 'Pompeian',
    companyId: null,
    _missingCompany: 'Pompeian Inc.',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 120,
    ingredients: [
      'extra virgin olive oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '041736010130': {
    barcode: '041736010130',
    name: 'Filippo Berio Extra Virgin Olive Oil 25.3oz',
    brand: 'Filippo Berio',
    companyId: null,
    _missingCompany: 'Salov Group',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 120,
    ingredients: [
      'extra virgin olive oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '099482454722': {
    barcode: '099482454722',
    name: '365 by Whole Foods Market Organic Extra Virgin Olive Oil 16.9oz',
    brand: '365 by Whole Foods Market',
    companyId: null,
    _missingCompany: 'Amazon / Whole Foods Market',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 120,
    ingredients: [
      'organic extra virgin olive oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '096619927319': {
    barcode: '096619927319',
    name: 'Kirkland Signature Organic Extra Virgin Olive Oil 2L',
    brand: 'Kirkland Signature',
    companyId: 'costco',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 120,
    ingredients: [
      'organic extra virgin olive oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '736211701084': {
    barcode: '736211701084',
    name: 'Chosen Foods 100% Pure Avocado Oil 16.9oz',
    brand: 'Chosen Foods',
    companyId: 'chosen-foods',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 124,
    ingredients: [
      'avocado oil',
    ],
    nutrition: { fat: 14, saturatedFat: 1.5, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['Non-GMO Project Verified', 'Paleo Certified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '850004639870': {
    barcode: '850004639870',
    name: 'Primal Kitchen 100% Pure Avocado Oil Spray 4.7oz',
    brand: 'Primal Kitchen',
    companyId: 'kraft-heinz',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 sec spray (0.3g)',
    calories: 0,
    ingredients: [
      'avocado oil',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['Non-GMO Project Verified', 'Certified Paleo', 'Keto Certified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '692752106866': {
    barcode: '692752106866',
    name: 'Nutiva Organic Refined Coconut Oil 15oz',
    brand: 'Nutiva',
    companyId: null,
    _missingCompany: 'Nutiva Inc.',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 120,
    ingredients: [
      'organic refined expeller-pressed coconut oil',
    ],
    nutrition: { fat: 14, saturatedFat: 12, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '051500253625': {
    barcode: '051500253625',
    name: 'Crisco Pure Vegetable Oil 48oz',
    brand: 'Crisco',
    companyId: 'b-and-g-foods',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 120,
    ingredients: [
      'soybean oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '027000690864': {
    barcode: '027000690864',
    name: 'Wesson 100% Natural Canola Oil 48oz',
    brand: 'Wesson',
    companyId: 'conagra',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 120,
    ingredients: [
      'canola oil',
    ],
    nutrition: { fat: 14, saturatedFat: 1, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '857190000477': {
    barcode: '857190000477',
    name: 'La Tourangelle Toasted Sesame Oil 8.45oz',
    brand: 'La Tourangelle',
    companyId: null,
    _missingCompany: 'La Tourangelle Inc.',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 120,
    ingredients: [
      'sesame seed oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '024182000283': {
    barcode: '024182000283',
    name: 'Eden Foods Organic Toasted Sesame Oil 5oz',
    brand: 'Eden Foods',
    companyId: 'eden-foods',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tsp (5ml)',
    calories: 40,
    ingredients: [
      'toasted sesame oil',
    ],
    nutrition: { fat: 4.5, saturatedFat: 0.5, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '022506137103': {
    barcode: '022506137103',
    name: 'Spectrum Naturals Organic Canola Oil 16oz',
    brand: 'Spectrum Naturals',
    companyId: 'hain-celestial',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 120,
    ingredients: [
      'organic canola oil',
    ],
    nutrition: { fat: 14, saturatedFat: 1, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },
