// QA REVIEWED 3 PASS 3 FIX 0 REJECT 0
//
// All three entries from phase7_rejects_formatted.js passed every check:
//   • UPC-A check digit (GS1 mod-10): all VALID
//       021908453040 → cd 0 ✓ | 602652260858 → cd 8 ✓ | 818780011938 → cd 8 ✓
//   • Duplicate check vs src/data/products.js: none present
//   • companyId check vs src/data/companies.js:
//       general-mills ✓ (Lärabar parent; brand map 'larabar' → General Mills)
//       kind-snacks   ✓ (correct key for KIND; Mars subsidiary)
//       conagra       ✓ (Angie's BOOMCHICKAPOP parent since 2017)
//   • Plausibility:
//       Lärabar Cashew Cookie — Snack Bars; vegan (cashews+dates), GF ✓
//       KIND Kids Chocolate Chip — Snack Bars; contains honey so isVegan=false ✓, GF ✓
//       Angie's BOOMCHICKAPOP — Chips & Crackers; vegan, GF ✓
//       ingredients arrays non-empty & lowercase ✓
//
// No FIX or REJECT entries.
// ────────────────────────────────────────────────────────────────────────────

module.exports = {

  // Lärabar Cashew Cookie Fruit & Nut Bar
  // OFF status=1 · verified check digit · General Mills / Larabar brand
  '021908453040': {
    barcode: '021908453040',
    name: 'Lärabar Cashew Cookie Fruit & Nut Bar',
    brand: 'Lärabar',
    companyId: 'general-mills',
    category: 'Snack Bars',
    image: null,
    servingSize: '1 bar (48g)',
    calories: 220,
    ingredients: [
      'cashews',
      'dates',
    ],
    nutrition: { fat: 12, saturatedFat: 2.5, sodium: 5, carbs: 25, sugars: 15, protein: 5 },
    certifications: ['Gluten Free Certified', 'Kosher'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  // KIND Kids Chewy Granola Bar Chocolate Chip (10-bar box)
  // OFF status=1 · verified check digit · KIND Snacks (Mars)
  // companyId is 'kind-snacks' (Mars subsidiary) per companies.js entry.
  '602652260858': {
    barcode: '602652260858',
    name: 'KIND Kids Chewy Granola Bar Chocolate Chip',
    brand: 'KIND Kids',
    companyId: 'kind-snacks',
    category: 'Snack Bars',
    image: null,
    servingSize: '1 bar (23g)',
    calories: 100,
    ingredients: [
      'oats',
      'tapioca syrup',
      'semi-sweet chocolate (unsweetened chocolate, cane sugar, cocoa butter, vanilla extract)',
      'canola oil',
      'cane sugar',
      'honey',
      'brown rice',
      'brown rice flour',
      'sea salt',
      'natural flavor',
      'vitamin e (tocopherols)',
    ],
    nutrition: { fat: 3.5, saturatedFat: 0.5, sodium: 65, carbs: 16, sugars: 5, protein: 1 },
    certifications: ['Non-GMO Project', 'Gluten Free Certified'],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  // Angie's BOOMCHICKAPOP Sweet & Salty Kettle Corn 7oz
  // OFF status=1 · verified check digit · Conagra Brands (acquired Angie's 2017)
  '818780011938': {
    barcode: '818780011938',
    name: "Angie's BOOMCHICKAPOP Sweet & Salty Kettle Corn",
    brand: "Angie's BOOMCHICKAPOP",
    companyId: 'conagra',
    category: 'Chips & Crackers',
    image: null,
    servingSize: '2 cups (28g)',
    calories: 140,
    ingredients: [
      'popcorn',
      'sunflower oil',
      'cane sugar',
      'sea salt',
    ],
    nutrition: { fat: 8, saturatedFat: 0.5, sodium: 110, carbs: 18, sugars: 8, protein: 1 },
    certifications: ['Non-GMO Project', 'Gluten Free Certified', 'Kosher'],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

};
