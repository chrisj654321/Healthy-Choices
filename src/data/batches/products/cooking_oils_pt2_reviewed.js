/*
QA REPORT — cooking_oils_pt2
Reviewed: 2026-06-26
PASS: 15  FIX: 0  REJECT: 0

[074305001321] | PASS | Bragg Organic Raw ACV — companyId 'bragg' OK
[013000007658] | PASS | Heinz ACV — companyId 'kraft-heinz' OK
[070641000097] | PASS | Marukan Seasoned Rice Vinegar — null co. annotated
[070641000059] | PASS | Marukan Genuine Brewed Rice Vinegar — null co. annotated
[070641064129] | PASS | Marukan Organic Rice Vinegar — null co. annotated
[073575295003] | PASS | Nakano Organic Seasoned Rice Vinegar — companyId 'mizkan' OK
[742392701546] | PASS | Carrington Farms EV Coconut Oil — null co. annotated
[742392702901] | PASS | Carrington Farms Coconut Cooking Oil — null co. annotated
[705875000017] | PASS | Barlean's Organic Flax Oil — null co. annotated
[816536011454] | PASS | Kevala Organic EV Sesame Oil — null co. annotated
[786969010112] | PASS | Napa Valley Naturals Reserve EVOO — null co. annotated
[786969030066] | PASS | Napa Valley Naturals Golden Balsamic — null co. annotated
[648505035006] | PASS | Lucini Italia Premium Select EVOO — null co. annotated
[648505010010] | PASS | Lucini Italia Everyday EVOO — null co. annotated
[648505302559] | PASS | Lucini Italia Everyday Balsamic — null co. annotated

Notes:
- All 15 UPC-A check digits valid (mod-10).
- No duplicate barcodes found in products.js.
- companyIds 'bragg', 'kraft-heinz', 'mizkan' all confirmed present in COMPANY_DB (companies.js).
- All 12 companyId=null entries carry a _missingCompany annotation.
- All ingredient arrays lowercase; no medical/causation language.
- Schema complete (14 fields + 6 nutrition sub-fields) on every entry; outer key == barcode on every entry.
- Clean batch — no corrections applied, no rejections.
*/

  '074305001321': {
    barcode: '074305001321',
    name: 'Bragg Organic Raw Apple Cider Vinegar 32oz',
    brand: 'Bragg',
    companyId: 'bragg',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 0,
    ingredients: [
      'certified organic raw apple cider vinegar',
      'purified water',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 10, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified', 'B Corp Certified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '013000007658': {
    barcode: '013000007658',
    name: 'Heinz Apple Cider Vinegar 32oz',
    brand: 'Heinz',
    companyId: 'kraft-heinz',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 0,
    ingredients: [
      'distilled vinegar',
      'natural flavor',
      'caramel color',
      'water',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '070641000097': {
    barcode: '070641000097',
    name: 'Marukan Seasoned Gourmet Rice Vinegar 12oz',
    brand: 'Marukan',
    companyId: null,
    _missingCompany: 'Marukan Vinegar (U.S.A.) Inc.',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 25,
    ingredients: [
      'rice vinegar',
      'sugar',
      'salt',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 77, carbs: 1, sugars: 1, protein: 0 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '070641000059': {
    barcode: '070641000059',
    name: 'Marukan Genuine Brewed Rice Vinegar 12oz',
    brand: 'Marukan',
    companyId: null,
    _missingCompany: 'Marukan Vinegar (U.S.A.) Inc.',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 0,
    ingredients: [
      'rice vinegar',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '070641064129': {
    barcode: '070641064129',
    name: 'Marukan Organic Rice Vinegar 12oz',
    brand: 'Marukan',
    companyId: null,
    _missingCompany: 'Marukan Vinegar (U.S.A.) Inc.',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 0,
    ingredients: [
      'organic rice vinegar',
      'water',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '073575295003': {
    barcode: '073575295003',
    name: 'Nakano Organic Seasoned Rice Vinegar 12oz',
    brand: 'Nakano',
    companyId: 'mizkan',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 20,
    ingredients: [
      'organic rice vinegar',
      'organic invert sugar',
      'salt',
      'water',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 244, carbs: 4, sugars: 4, protein: 0 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '742392701546': {
    barcode: '742392701546',
    name: 'Carrington Farms Organic Extra Virgin Coconut Oil 54oz',
    brand: 'Carrington Farms',
    companyId: null,
    _missingCompany: 'The Carrington Tea Company LLC',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 98,
    ingredients: [
      'organic unrefined extra virgin coconut oil',
    ],
    nutrition: { fat: 13, saturatedFat: 12, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '742392702901': {
    barcode: '742392702901',
    name: 'Carrington Farms Organic Coconut Cooking Oil 16oz',
    brand: 'Carrington Farms',
    companyId: null,
    _missingCompany: 'The Carrington Tea Company LLC',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 130,
    ingredients: [
      'coconut oil',
    ],
    nutrition: { fat: 14, saturatedFat: 13, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '705875000017': {
    barcode: '705875000017',
    name: "Barlean's Organic Flax Oil 16oz",
    brand: "Barlean's",
    companyId: null,
    _missingCompany: "Barlean's Organic Oils",
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 120,
    ingredients: [
      'organic cold-pressed flaxseed oil',
    ],
    nutrition: { fat: 14, saturatedFat: 1, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '816536011454': {
    barcode: '816536011454',
    name: 'Kevala Organic Extra Virgin Sesame Oil 8oz',
    brand: 'Kevala',
    companyId: null,
    _missingCompany: 'Kevala',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 120,
    ingredients: [
      'organic cold pressed sesame oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '786969010112': {
    barcode: '786969010112',
    name: 'Napa Valley Naturals Reserve Extra Virgin Olive Oil 12.7oz',
    brand: 'Napa Valley Naturals',
    companyId: null,
    _missingCompany: 'Spruce Foods / Napa Valley Naturals',
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

  '786969030066': {
    barcode: '786969030066',
    name: 'Napa Valley Naturals Organic Golden Balsamic Vinegar 12.7oz',
    brand: 'Napa Valley Naturals',
    companyId: null,
    _missingCompany: 'Spruce Foods / Napa Valley Naturals',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (14g)',
    calories: 0,
    ingredients: [
      'organic golden balsamic vinegar',
      'organic grape must',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 5, carbs: 2, sugars: 2, protein: 0 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '648505035006': {
    barcode: '648505035006',
    name: 'Lucini Italia Organic Premium Select Extra Virgin Olive Oil 16.9oz',
    brand: 'Lucini Italia',
    companyId: null,
    _missingCompany: 'Lucini Italia Company',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 130,
    ingredients: [
      'organic extra virgin olive oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '648505010010': {
    barcode: '648505010010',
    name: 'Lucini Italia Everyday Extra Virgin Olive Oil 16.9oz',
    brand: 'Lucini Italia',
    companyId: null,
    _missingCompany: 'Lucini Italia Company',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 130,
    ingredients: [
      'extra virgin olive oil',
    ],
    nutrition: { fat: 14, saturatedFat: 2, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '648505302559': {
    barcode: '648505302559',
    name: 'Lucini Italia Everyday Balsamic Vinegar of Modena 8.5oz',
    brand: 'Lucini Italia',
    companyId: null,
    _missingCompany: 'Lucini Italia Company',
    category: 'Cooking Oils & Vinegars',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 15,
    ingredients: [
      'wine vinegar',
      'concentrated grape must',
      'cooked grape must',
      'caramel color',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 3, sugars: 3, protein: 0 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },
