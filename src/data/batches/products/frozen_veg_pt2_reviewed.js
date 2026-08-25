/*
QA REPORT — frozen_veg_pt2
Reviewed: 2026-06-26
PASS: 17  FIX: 0  REJECT: 0

[071202117902] | PASS | Dole Frozen Blueberries 16oz
[071202171430] | PASS | Dole Frozen Sliced Strawberries 16oz
[079900001578] | PASS | Wyman's Wild Blueberries 15oz
[070560876773] | PASS | Pictsweet Chopped Collard Greens 16oz
[070560929110] | PASS | Pictsweet Brussels Sprouts 10oz
[638882000544] | PASS | Stahlbush Island Farms Green Peas 10oz
[638882000612] | PASS | Stahlbush Island Farms Cut Spinach 10oz
[638882000889] | PASS | Stahlbush Island Farms Sliced Beets 10oz
[099482462130] | PASS | 365 Whole Foods Market Organic Riced Cauliflower 12oz
[099482446697] | PASS | 365 Whole Foods Market Organic Stir-Fry Blend 16oz
[099482406486] | PASS | 365 Whole Foods Market Organic Peas & Carrots 16oz
[032601025151] | PASS | Earthbound Farm Organic California-Style Blend 10oz
[032601026097] | PASS | Earthbound Farm Organic Triple Berry Blend 10oz
[024284000389] | PASS | Sno Pac Organic Broccoli Florets 10oz
[024284297109] | PASS | Sno Pac Organic Butternut Squash 12oz
[042563007874] | PASS | Woodstock Organic Broccoli Florets 10oz
[042563011055] | PASS | Woodstock Organic Sugar Snap Peas 10oz

Notes:
- A (check digit): all 17 UPC-A barcodes pass mod-10.
- B (ingredients): all lowercase JS arrays; no medical/causation language.
- C (companyId): all non-null; the 8 distinct ids used (dole-food, wymans,
  pictsweet, stahlbush, amazon, taylor-farms, sno-pac, hain-celestial) all
  exist as keys in COMPANY_DB. 365 Whole Foods -> amazon and Earthbound Farm
  -> taylor-farms mappings verified.
- D (duplicate barcode): none of the 17 barcodes appear in products.js.
- E (schema): all 14 fields present on every product; nutrition has all 6
  sub-fields.
- F (key == barcode): outer object key matches inner barcode field for all 17.
*/

  '071202117902': {
    barcode: '071202117902',
    name: 'Dole Frozen Blueberries 16oz',
    brand: 'Dole',
    companyId: 'dole-food',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '1 cup (140g)',
    calories: 80,
    ingredients: [
      'blueberries',
    ],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 0, carbs: 17, sugars: 12, protein: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '071202171430': {
    barcode: '071202171430',
    name: 'Dole Frozen Sliced Strawberries 16oz',
    brand: 'Dole',
    companyId: 'dole-food',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '1 cup (140g)',
    calories: 50,
    ingredients: [
      'strawberries',
      'natural flavors',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 13, sugars: 6, protein: 1 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '079900001578': {
    barcode: '079900001578',
    name: "Wyman's Wild Blueberries 15oz",
    brand: "Wyman's",
    companyId: 'wymans',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '1 cup (140g)',
    calories: 80,
    ingredients: [
      'wild blueberries',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 18, sugars: 13, protein: 1 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '070560876773': {
    barcode: '070560876773',
    name: 'Pictsweet Chopped Collard Greens 16oz',
    brand: 'Pictsweet',
    companyId: 'pictsweet',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '1 cup (87g)',
    calories: 35,
    ingredients: [
      'collard greens',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 20, carbs: 5, sugars: 0, protein: 2 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '070560929110': {
    barcode: '070560929110',
    name: 'Pictsweet Brussels Sprouts 10oz',
    brand: 'Pictsweet',
    companyId: 'pictsweet',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '5 sprouts (85g)',
    calories: 50,
    ingredients: [
      'brussels sprouts',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 15, carbs: 9, sugars: 2, protein: 3 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '638882000544': {
    barcode: '638882000544',
    name: 'Stahlbush Island Farms Green Peas 10oz',
    brand: 'Stahlbush Island Farms',
    companyId: 'stahlbush',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '0.5 cup (85g)',
    calories: 70,
    ingredients: [
      'green peas',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 60, carbs: 12, sugars: 4, protein: 4 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '638882000612': {
    barcode: '638882000612',
    name: 'Stahlbush Island Farms Cut Spinach 10oz',
    brand: 'Stahlbush Island Farms',
    companyId: 'stahlbush',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '0.5 cup (85g)',
    calories: 30,
    ingredients: [
      'spinach',
    ],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 80, carbs: 4, sugars: 0, protein: 3 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '638882000889': {
    barcode: '638882000889',
    name: 'Stahlbush Island Farms Sliced Beets 10oz',
    brand: 'Stahlbush Island Farms',
    companyId: 'stahlbush',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '0.5 cup (85g)',
    calories: 35,
    ingredients: [
      'beets',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 65, carbs: 8, sugars: 7, protein: 1 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '099482462130': {
    barcode: '099482462130',
    name: '365 Whole Foods Market Organic Riced Cauliflower 12oz',
    brand: '365 Whole Foods Market',
    companyId: 'amazon',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '0.75 cup (75g)',
    calories: 20,
    ingredients: [
      'organic cauliflower',
      'salt',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 20, carbs: 4, sugars: 2, protein: 2 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '099482446697': {
    barcode: '099482446697',
    name: '365 Whole Foods Market Organic Stir-Fry Blend 16oz',
    brand: '365 Whole Foods Market',
    companyId: 'amazon',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '0.75 cup (85g)',
    calories: 21,
    ingredients: [
      'organic broccoli',
      'organic carrots',
      'organic green beans',
      'organic onions',
      'organic red bell peppers',
      'organic mushrooms',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 13, carbs: 4, sugars: 2, protein: 1 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '099482406486': {
    barcode: '099482406486',
    name: '365 Whole Foods Market Organic Peas & Carrots 16oz',
    brand: '365 Whole Foods Market',
    companyId: 'amazon',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '2/3 cup (87g)',
    calories: 51,
    ingredients: [
      'organic green peas',
      'organic carrots',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 51, carbs: 10, sugars: 4, protein: 3 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '032601025151': {
    barcode: '032601025151',
    name: 'Earthbound Farm Organic California-Style Blend 10oz',
    brand: 'Earthbound Farm',
    companyId: 'taylor-farms',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '0.75 cup (85g)',
    calories: 30,
    ingredients: [
      'organic broccoli',
      'organic carrots',
      'organic cauliflower',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 35, carbs: 6, sugars: 2, protein: 2 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '032601026097': {
    barcode: '032601026097',
    name: 'Earthbound Farm Organic Triple Berry Blend 10oz',
    brand: 'Earthbound Farm',
    companyId: 'taylor-farms',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '1 serving (140g)',
    calories: 80,
    ingredients: [
      'organic blueberries',
      'organic blackberries',
      'organic raspberries',
    ],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 0, carbs: 18, sugars: 11, protein: 1 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '024284000389': {
    barcode: '024284000389',
    name: 'Sno Pac Organic Broccoli Florets 10oz',
    brand: 'Sno Pac',
    companyId: 'sno-pac',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '1 cup (79g)',
    calories: 20,
    ingredients: [
      'organic broccoli florets',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 20, carbs: 4, sugars: 1, protein: 2 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '024284297109': {
    barcode: '024284297109',
    name: 'Sno Pac Organic Butternut Squash 12oz',
    brand: 'Sno Pac',
    companyId: 'sno-pac',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '1 cup (140g)',
    calories: 81,
    ingredients: [
      'organic butternut squash',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 3, carbs: 20, sugars: 4, protein: 2 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '042563007874': {
    barcode: '042563007874',
    name: 'Woodstock Organic Broccoli Florets 10oz',
    brand: 'Woodstock',
    companyId: 'hain-celestial',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '0.5 cup (85g)',
    calories: 30,
    ingredients: [
      'organic broccoli florets',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 15, carbs: 5, sugars: 1, protein: 3 },
    certifications: ['USDA Organic'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '042563011055': {
    barcode: '042563011055',
    name: 'Woodstock Organic Sugar Snap Peas 10oz',
    brand: 'Woodstock',
    companyId: 'hain-celestial',
    category: 'Frozen Vegetables & Fruit',
    image: null,
    servingSize: '2/3 cup (85g)',
    calories: 35,
    ingredients: [
      'organic sugar snap peas',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 7, sugars: 4, protein: 3 },
    certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },
