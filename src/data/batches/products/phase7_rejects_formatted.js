// ── Phase 7: Re-researched Rejects ──────────────────────────────────────────
//
// These four products were rejected from prior batches due to invalid UPC-A
// check digits on their original barcodes. This file contains only entries
// where a correct, verified barcode was found:
//   • Passes UPC-A check digit (GS1 mod-10)
//   • status=1 on world.openfoodfacts.org
//   • Not already present in src/data/products.js
//
// NOT included — no verified barcode found:
//   Wild Friends Classic Creamy Peanut Butter 16oz
//     Original bad barcode: 085354700376 (check digit fail; OFF 404)
//     All retailers consistently list the same invalid barcode; no valid
//     alternative located in OFF or any barcode registry. Exclude until
//     a physical scan or manufacturer confirmation is available.
//     _missingCompany: 'Wild Friends Foods'
//
// Original bad barcodes (now superseded):
//   416261001246  → 021908453040  (Lärabar Cashew Cookie)
//   602652220600  → 602652260858  (KIND Kids Chewy Granola Bar Chocolate Chip)
//   081878001343  → 818780011938  (Angie's BOOMCHICKAPOP Sweet & Salty Kettle Corn 7oz)
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
  // Note: product is sold under "KIND Chewy" / "KIND Kids" branding; companyId
  // is 'kind-snacks' (Mars subsidiary) per companies.js entry.
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
