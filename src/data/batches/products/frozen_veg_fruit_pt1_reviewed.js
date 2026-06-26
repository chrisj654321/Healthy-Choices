/*
QA REPORT — frozen_veg_fruit_pt1
Reviewed: 2026-06-24
PASS: 14  FIX: 0  REJECT: 0

Checks run independently against formatted JS and raw JSON:
 A. UPC-A mod-10: all 14 valid
 B. OFF API re-fetch: all 14 status=1, names/brands loosely match
 C. Ingredient arrays: match verbatim. NOTE — raw JSON's pre-split `ingredients`
    for the two Alexia fries wrongly split commas inside parentheses; the
    FORMATTED file is correct (parenthetical groups kept intact). No fix needed.
 D. Medical/legal claim scan: clean (no causes/prevents/cures/treats/toxic/
    carcinogenic/healthy/unhealthy in any field)
 E. companyId: conagra, b-and-g-foods, general-mills all exist in companies.js
 F. Schema: all required fields present on all 14
 G. Duplicates: none of the 14 barcodes exist in products.js MANUAL_PRODUCTS

014500021830 | PASS | Birds Eye Broccoli Florets
014500021571 | PASS | Birds Eye Whole Green Beans
014500021281 | PASS | Birds Eye Mixed Vegetables
014500021007 | PASS | Birds Eye Sweet Peas
014500020994 | PASS | Birds Eye Super Sweet Corn
020000290157 | PASS | Green Giant Broccoli Florets
020000273389 | PASS | Green Giant Sweet Peas
020000273365 | PASS | Green Giant Niblets Corn
021908503356 | PASS | Cascadian Farm Broccoli Florets
021908501406 | PASS | Cascadian Farm Sweet Peas
021908514956 | PASS | Cascadian Farm Mixed Berries
021908543017 | PASS | Cascadian Farm Strawberries
834183001024 | PASS | Alexia Yukon Gold Julienne Fries
834183007149 | PASS | Alexia Waffle Cut Sweet Potato Fries
*/

// ─── FROZEN VEGETABLES & FRUIT PT.1 (REVIEWED) ──────────────────────────────
// 14 products · all PASS · independently QA-verified 2026-06-24

  '014500021830': {
    barcode: '014500021830',
    name: 'Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz',
    brand: 'Birds Eye',
    companyId: 'conagra',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '3.5 oz (99g)',
    calories: 30,
    ingredients: [
      'broccoli',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 15, carbs: 5, sugars: 1, protein: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '014500021571': {
    barcode: '014500021571',
    name: 'Birds Eye Steamfresh Whole Green Beans 10.8oz',
    brand: 'Birds Eye',
    companyId: 'conagra',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '3 oz (85g)',
    calories: 30,
    ingredients: [
      'green beans',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 10, carbs: 5, sugars: 2, protein: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '014500021281': {
    barcode: '014500021281',
    name: 'Birds Eye Steamfresh Mixed Vegetables 10.8oz',
    brand: 'Birds Eye',
    companyId: 'conagra',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '3.5 oz (100g)',
    calories: 60,
    ingredients: [
      'corn',
      'carrots',
      'green beans',
      'peas',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 40, carbs: 12, sugars: 4, protein: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '014500021007': {
    barcode: '014500021007',
    name: 'Birds Eye Sweet Peas 10oz',
    brand: 'Birds Eye',
    companyId: 'conagra',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '2/3 cup (90g)',
    calories: 70,
    ingredients: [
      'peas',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 130, carbs: 12, sugars: 5, protein: 5 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '014500020994': {
    barcode: '014500020994',
    name: 'Birds Eye Steamfresh Super Sweet Corn 10oz',
    brand: 'Birds Eye',
    companyId: 'conagra',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '2/3 cup (85g)',
    calories: 90,
    ingredients: [
      'corn',
    ],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 5, carbs: 19, sugars: 6, protein: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '020000290157': {
    barcode: '020000290157',
    name: 'Green Giant Valley Fresh Steamers Broccoli Florets 12oz',
    brand: 'Green Giant',
    companyId: 'b-and-g-foods',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '3/4 cup (84g)',
    calories: 25,
    ingredients: [
      'broccoli',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 20, carbs: 5, sugars: 1, protein: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '020000273389': {
    barcode: '020000273389',
    name: 'Green Giant Valley Fresh Steamers Sweet Peas 12oz',
    brand: 'Green Giant',
    companyId: 'b-and-g-foods',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '2/3 cup (90g)',
    calories: 70,
    ingredients: [
      'sweet peas',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 120, carbs: 12, sugars: 5, protein: 5 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '020000273365': {
    barcode: '020000273365',
    name: 'Green Giant Niblets Corn 12oz',
    brand: 'Green Giant',
    companyId: 'b-and-g-foods',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '2/3 cup (85g)',
    calories: 80,
    ingredients: [
      'corn',
    ],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 0, carbs: 17, sugars: 5, protein: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '021908503356': {
    barcode: '021908503356',
    name: 'Cascadian Farm Organic Premium Broccoli Florets 16oz',
    brand: 'Cascadian Farm Organic',
    companyId: 'general-mills',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '1 cup (85g)',
    calories: 25,
    ingredients: [
      'organic broccoli',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 30, carbs: 5, sugars: 1, protein: 2 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '021908501406': {
    barcode: '021908501406',
    name: 'Cascadian Farm Organic Premium Sweet Peas 16oz',
    brand: 'Cascadian Farm Organic',
    companyId: 'general-mills',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '2/3 cup (90g)',
    calories: 70,
    ingredients: [
      'organic peas',
      'trace of sea salt',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 70, carbs: 12, sugars: 5, protein: 4 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '021908514956': {
    barcode: '021908514956',
    name: 'Cascadian Farm Organic Frozen Mixed Berries 10oz',
    brand: 'Cascadian Farm Organic',
    companyId: 'general-mills',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '2/3 cup (84g)',
    calories: 60,
    ingredients: [
      'organic strawberries',
      'organic blackberries',
      'organic blueberries',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 14, sugars: 10, protein: 1 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '021908543017': {
    barcode: '021908543017',
    name: 'Cascadian Farm Organic Premium Strawberries 10oz',
    brand: 'Cascadian Farm Organic',
    companyId: 'general-mills',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '3/4 cup (84g)',
    calories: 45,
    ingredients: [
      'organic strawberries',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 11, sugars: 7, protein: 1 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '834183001024': {
    barcode: '834183001024',
    name: 'Alexia Organic Yukon Gold Julienne Fries with Sea Salt 15oz',
    brand: 'Alexia',
    companyId: 'conagra',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: 'about 3 oz (85g)',
    calories: 120,
    ingredients: [
      'organic potatoes',
      'organic vegetable oil (canola, sunflower, safflower)',
      'sea salt',
      'citric acid',
    ],
    nutrition: { fat: 4, saturatedFat: 0, sodium: 130, carbs: 21, sugars: 0, protein: 2 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '834183007149': {
    barcode: '834183007149',
    name: 'Alexia Waffle Cut Sweet Potato Fries with Sea Salt 20oz',
    brand: 'Alexia',
    companyId: 'conagra',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: 'about 3 oz (85g)',
    calories: 130,
    ingredients: [
      'sweet potatoes',
      'vegetable oil (contains one or more of the following: high oleic canola, canola, sunflower)',
      'rice flour',
      'cane sugar',
      'tapioca starch',
      'corn starch',
      'tapioca dextrin',
      'sea salt',
      'garlic powder',
      'onion powder',
      'chili pepper',
      'red pepper',
      'dried yeast',
      'black pepper',
      'cumin',
      'xanthan gum',
      'gluconic acid',
    ],
    nutrition: { fat: 4, saturatedFat: 0, sodium: 160, carbs: 22, sugars: 3, protein: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },
