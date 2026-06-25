/*
QA REPORT — coffee_tea_pt1
Reviewed: 2026-06-24
PASS: 11  FIX: 0  REJECT: 0

[025500304212] | PASS | UPC sum=50 ok; ingredients ["coffee"] match; companyId jm-smucker valid; no dup
[043000094228] | PASS | UPC sum=50 ok; "COFFEE"->"coffee" lowercased; kraft-heinz valid; no dup
[762111331205] | PASS | UPC sum=60 ok; "Ground arabica coffee."->["ground arabica coffee"]; jde-peets valid; no dup
[785357023567] | PASS | UPC sum=110 ok; ["coffee beans"] match; jde-peets valid; no dup
[851552005025] | PASS | UPC sum=80 ok; ["certified organic coffee"]; isOrganic true; death-wish-coffee valid; no dup
[028000466312] | PASS | UPC sum=70 ok; ["100% dark roasted select coffee beans"]; nestle valid; no dup
[762111853103] | PASS | UPC sum=80 ok; ["instant and microground coffee"]; jde-peets valid; no dup
[794522004423] | PASS | UPC sum=80 ok; ["black tea"]; unilever valid; no dup
[070734004025] | PASS | UPC sum=50 ok; 8-ingredient herbal array matches verbatim; hain-celestial valid; no dup
[070177025700] | PASS | UPC sum=60 ok; ["black tea"]; companyId null + _missingCompany ABF (correct); no dup
[072310008472] | PASS | UPC sum=70 ok; ["green tea"]; companyId null + _missingCompany R.C. Bigelow (correct); no dup

Notes: No medical-claim terms found. All outer keys == inner barcodes. Schema complete (14 fields) on all 11.
All 7 non-null companyIds confirmed present in companies.js. None of the 11 barcodes appear in products.js.
*/

  '025500304212': {
    barcode: '025500304212',
    name: 'Folgers Classic Roast Ground Coffee 43.5oz',
    brand: 'Folgers',
    companyId: 'jm-smucker',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '1 tbsp (6g)',
    calories: 0,
    ingredients: [
      'coffee',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '043000094228': {
    barcode: '043000094228',
    name: 'Maxwell House Original Roast Ground Coffee 30.6oz',
    brand: 'Maxwell House',
    companyId: 'kraft-heinz',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '1 tbsp (6g)',
    calories: 0,
    ingredients: [
      'coffee',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 5, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '762111331205': {
    barcode: '762111331205',
    name: 'Starbucks Pike Place Roast Ground Coffee 28oz',
    brand: 'Starbucks',
    companyId: 'jde-peets',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '2 tbsp (10g)',
    calories: 5,
    ingredients: [
      'ground arabica coffee',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['Fair Trade Certified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '785357023567': {
    barcode: '785357023567',
    name: "Peet's Coffee Major Dickason's Blend Ground 18oz",
    brand: "Peet's Coffee",
    companyId: 'jde-peets',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '2 tbsp (10g)',
    calories: 5,
    ingredients: [
      'coffee beans',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '851552005025': {
    barcode: '851552005025',
    name: 'Death Wish Coffee Organic 16oz',
    brand: 'Death Wish Coffee',
    companyId: 'death-wish-coffee',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '2.5 tbsp (12g)',
    calories: 5,
    ingredients: [
      'certified organic coffee',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['USDA Organic', 'Fair Trade Certified'],
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
  },

  '028000466312': {
    barcode: '028000466312',
    name: 'Nescafé Clásico Instant Coffee 7oz',
    brand: 'Nescafé',
    companyId: 'nestle',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '1 tsp (2g)',
    calories: 5,
    ingredients: [
      '100% dark roasted select coffee beans',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 10, carbs: 1, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '762111853103': {
    barcode: '762111853103',
    name: 'Starbucks VIA Instant Italian Roast 8ct',
    brand: 'Starbucks',
    companyId: 'jde-peets',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '1 packet (3.3g)',
    calories: 5,
    ingredients: [
      'instant and microground coffee',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 1, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '794522004423': {
    barcode: '794522004423',
    name: 'Lipton Yellow Label Black Tea 100ct',
    brand: 'Lipton',
    companyId: 'unilever',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '1 tea bag (2g)',
    calories: 0,
    ingredients: [
      'black tea',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '070734004025': {
    barcode: '070734004025',
    name: 'Celestial Seasonings Sleepytime Herbal Tea 20ct',
    brand: 'Celestial Seasonings',
    companyId: 'hain-celestial',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '1 tea bag (1.5g)',
    calories: 0,
    ingredients: [
      'chamomile',
      'spearmint',
      'lemongrass',
      'tilia flowers',
      'blackberry leaves',
      'orange blossoms',
      'hawthorn',
      'rosebuds',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: ['Non-GMO Project Verified'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '070177025700': {
    barcode: '070177025700',
    name: 'Twinings English Breakfast Tea 100ct',
    brand: 'Twinings',
    companyId: null,
    _missingCompany: 'Associated British Foods',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '1 tea bag (2g)',
    calories: 0,
    ingredients: [
      'black tea',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '072310008472': {
    barcode: '072310008472',
    name: 'Bigelow Classic Green Tea 20ct',
    brand: 'Bigelow',
    companyId: null,
    _missingCompany: 'R.C. Bigelow Inc.',
    category: 'Coffee & Tea',
    image: null,
    servingSize: '1 tea bag (1.8g)',
    calories: 0,
    ingredients: [
      'green tea',
    ],
    nutrition: { fat: 0, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },
