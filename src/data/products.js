/**
 * Product database keyed by barcode (UPC/EAN).
 * MANUAL_PRODUCTS: hand-curated entries — always take priority over generated data.
 * products_generated.json: auto-ingested from OpenFoodFacts + USDA via ingest-products.js
 */
import generatedRaw from './products_generated.json';

// Normalize generated products into the same shape as manual entries,
// keyed by barcode string
const _generated = {};
if (generatedRaw && Array.isArray(generatedRaw.products)) {
  for (const p of generatedRaw.products) {
    if (p.barcode) _generated[String(p.barcode)] = p;
  }
}

const MANUAL_PRODUCTS = {
  // ─── PepsiCo ───
  '012000001628': {
    barcode: '012000001628',
    name: 'Pepsi Cola',
    brand: 'Pepsi',
    companyId: 'pepsico',
    category: 'Beverages',
    image: null,
    servingSize: '12 fl oz (355ml)',
    calories: 150,
    ingredients: [
      'carbonated water',
      'high fructose corn syrup',
      'caramel color',
      'sugar',
      'phosphoric acid',
      'caffeine',
      'citric acid',
      'natural flavors',
    ],
    nutrition: {
      fat: 0,
      saturatedFat: 0,
      sodium: 30,
      carbs: 41,
      sugars: 41,
      protein: 0,
    },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '028400064057': {
    barcode: '028400064057',
    name: "Lay's Classic Potato Chips",
    brand: "Lay's",
    companyId: 'pepsico',
    category: 'Snacks',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 160,
    ingredients: ['potatoes', 'vegetable oil', 'salt'],
    nutrition: {
      fat: 10,
      saturatedFat: 1.5,
      sodium: 170,
      carbs: 15,
      sugars: 0,
      protein: 2,
    },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  // ─── Coca-Cola ───
  '049000028911': {
    barcode: '049000028911',
    name: 'Coca-Cola Classic',
    brand: 'Coca-Cola',
    companyId: 'coca-cola',
    category: 'Beverages',
    image: null,
    servingSize: '12 fl oz (355ml)',
    calories: 140,
    ingredients: [
      'carbonated water',
      'high fructose corn syrup',
      'caramel color',
      'phosphoric acid',
      'natural flavors',
      'caffeine',
    ],
    nutrition: {
      fat: 0,
      saturatedFat: 0,
      sodium: 45,
      carbs: 39,
      sugars: 39,
      protein: 0,
    },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  // ─── Kellogg's ───
  '038000845024': {
    barcode: '038000845024',
    name: "Kellogg's Frosted Flakes",
    brand: "Kellogg's",
    companyId: 'kelloggs',
    category: 'Cereals',
    image: null,
    servingSize: '¾ cup (36g)',
    calories: 130,
    ingredients: [
      'milled corn',
      'sugar',
      'malt flavoring',
      'salt',
      'niacinamide',
      'reduced iron',
      'zinc',
      'bht',
    ],
    nutrition: {
      fat: 0,
      saturatedFat: 0,
      sodium: 150,
      carbs: 31,
      sugars: 12,
      protein: 2,
    },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: false,
  },

  // ─── General Mills ───
  '016000275287': {
    barcode: '016000275287',
    name: 'Cheerios Original',
    brand: 'Cheerios',
    companyId: 'general-mills',
    category: 'Cereals',
    image: null,
    servingSize: '1 cup (28g)',
    calories: 100,
    ingredients: [
      'whole grain oats',
      'modified corn starch',
      'sugar',
      'oat bran',
      'salt',
      'calcium carbonate',
      'oat fiber',
      'niacinamide',
      'zinc',
      'natural flavors',
    ],
    nutrition: {
      fat: 2,
      saturatedFat: 0,
      sodium: 140,
      carbs: 20,
      sugars: 1,
      protein: 3,
    },
    certifications: ['Heart-Check'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: false,
  },

  // ─── Nestlé ───
  '028000209215': {
    barcode: '028000209215',
    name: 'KitKat Milk Chocolate Bar',
    brand: 'KitKat',
    companyId: 'nestle',
    category: 'Candy',
    image: null,
    servingSize: '1 bar (42g)',
    calories: 218,
    ingredients: [
      'sugar',
      'wheat flour',
      'cocoa butter',
      'milk',
      'chocolate',
      'palm kernel oil',
      'soy lecithin',
      'pgpr',
      'natural flavors',
      'yeast',
      'salt',
      'artificial flavors',
    ],
    nutrition: {
      fat: 11,
      saturatedFat: 8,
      sodium: 23,
      carbs: 27,
      sugars: 21,
      protein: 3,
    },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  },
};

// Merge: generated data is the base, manual entries always override
export const PRODUCT_DB = { ..._generated, ...MANUAL_PRODUCTS };

// Demo mode: returns a random product when barcode isn't found in DB
export const DEMO_PRODUCTS = [
  {
    barcode: 'DEMO001',
    name: 'Organic Oat Granola Bar',
    brand: 'CleanEats',
    companyId: null,
    category: 'Snacks',
    image: null,
    servingSize: '1 bar (40g)',
    calories: 190,
    ingredients: [
      'rolled oats',
      'honey',
      'almonds',
      'sunflower seeds',
      'dried cranberries',
      'cane sugar',
      'sunflower oil',
      'vanilla extract',
      'sea salt',
    ],
    nutrition: { fat: 8, saturatedFat: 1, sodium: 95, carbs: 27, sugars: 11, protein: 4 },
    certifications: ['USDA Organic', 'Non-GMO Project'],
    isOrganic: true,
    isVegan: false,
    isGlutenFree: true,
  },
];
