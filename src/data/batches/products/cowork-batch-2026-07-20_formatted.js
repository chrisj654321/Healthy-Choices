// cowork-batch-2026-07-20 — Octavius Stage 2 output
//
// Stage-1 fetch summary claimed "resolved: 14, missed: 1" but several "resolved"
// records were unreliable and required independent re-research:
//   - planters-roasted-salted-cashews resolved to an unrelated Kraft-Heinz
//     "Deluxe Salted Mixed Nuts" (5-nut blend) instead of a plain cashew product.
//   - wonderful-pistachios-no-shells-salt-pepper resolved to a Great Value
//     (Walmart) product, not Wonderful.
//   - Several usda-fdc records (planters-deluxe-whole-cashews, kar's-sweet-n-
//     salty-mix, fisher-deluxe-mixed-nuts) and one off-search record (sahale
//     honey-almonds-glazed-mix) carried per-100g nutrition values mislabeled
//     as a 28g/1oz serving (implausible calorie counts, e.g. 571-607 kcal for
//     a 28g serving of nuts). All four were re-researched against official
//     brand pages / retailer nutrition panels for correct per-serving values.
//   - The Chobani Caramel Macchiato ingredients_verbatim was garbled OCR from
//     a nutrition-panel photo; re-confirmed via chobani.com-sourced retailer
//     listings (Fairway, Lund's & Byerly's) that also display the UPC.
//
// All re-researched barcodes are mod-10 valid UPC-A and were cross-confirmed
// against at least one source that displays the barcode. Two products could
// not be verified to a trustworthy complete record and are in
// could_not_verify below — see the batch report for why. Do not merge on
// faith.

module.exports = {
  '818290015488': {
    barcode: '818290015488',
    name: 'Chobani Caramel Macchiato Coffee Creamer',
    brand: 'Chobani',
    companyId: 'chobani',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15g)',
    calories: 35,
    ingredients: ['milk', 'cream', 'cane sugar', 'natural flavors'],
    nutrition: { fat: 1.5, saturatedFat: 1, sodium: 10, carbs: 5, sugars: 5, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '859922007396': {
    barcode: '859922007396',
    name: 'nutpods French Vanilla Unsweetened Almond + Coconut Creamer',
    brand: 'nutpods',
    companyId: 'nutpods',
    category: 'Coffee Creamer',
    image: null,
    servingSize: '1 tbsp (15ml)',
    calories: 10,
    ingredients: [
      'water',
      'coconut cream',
      'almonds',
      'natural flavors',
      'acacia gum',
      'dipotassium phosphate',
      'sunflower lecithin',
      'sea salt',
      'gellan gum',
    ],
    nutrition: { fat: 1, saturatedFat: 0, sodium: 0, carbs: 0, sugars: 0, protein: 0 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '029000016071': {
    barcode: '029000016071',
    name: 'Planters Salted Cashew Halves & Pieces',
    brand: 'Planters',
    companyId: 'hormel',
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 160,
    ingredients: ['cashews', 'sea salt', 'peanut oil'],
    nutrition: { fat: 13, saturatedFat: 2.5, sodium: 100, carbs: 9, sugars: 2, protein: 5 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '029000016156': {
    barcode: '029000016156',
    name: 'Planters Deluxe Salted Whole Cashews',
    brand: 'Planters',
    companyId: 'hormel',
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 160,
    ingredients: ['cashews', 'sea salt', 'peanut oil'],
    nutrition: { fat: 13, saturatedFat: 2.5, sodium: 100, carbs: 9, sugars: 2, protein: 5 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
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
      'almonds',
      'vegetable oil (canola, safflower and/or sunflower)',
      'salt',
      'corn maltodextrin',
      'natural hickory smoke flavor',
      'yeast',
      'hydrolyzed corn and soy protein',
      'natural flavors',
    ],
    nutrition: { fat: 16, saturatedFat: 1, sodium: 150, carbs: 5, sugars: 1, protein: 6 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
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
      'almonds',
      'vegetable oil (canola, safflower and/or sunflower)',
      'sugar',
      'salt',
      'corn maltodextrin',
      'paprika',
      'garlic powder',
      'cayenne pepper sauce (salt, aged cayenne red peppers, vinegar solids, garlic)',
      'tomato powder',
      'citric acid',
      'yeast extract',
      'vinegar solids',
      'extractives of paprika',
      'natural flavor',
    ],
    nutrition: { fat: 15, saturatedFat: 1, sodium: 120, carbs: 5, sugars: 2, protein: 6 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
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
    ingredients: ['almonds', 'sugar', 'vegetable oil (canola, safflower and/or sunflower)', 'honey', 'salt', 'corn maltodextrin'],
    nutrition: { fat: 13, saturatedFat: 1, sodium: 60, carbs: 9, sugars: 5, protein: 5 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
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
    ingredients: ['almonds', 'vegetable oil (almond, canola, safflower and/or sunflower)', 'sea salt'],
    nutrition: { fat: 16, saturatedFat: 1, sodium: 40, carbs: 5, sugars: 1, protein: 6 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '014113910873': {
    barcode: '014113910873',
    name: 'Wonderful Pistachios No Shells Chili Roasted',
    brand: 'Wonderful',
    companyId: 'wonderful-company',
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 170,
    ingredients: [
      'pistachios',
      'sunflower oil',
      'salt',
      'sugar',
      'citric acid',
      'malic acid',
      'red tabasco pepper',
      'garlic powder',
      'yeast extract',
      'vinegar',
      'paprika extract',
      'turmeric extract',
      'natural flavor',
    ],
    nutrition: { fat: 13, saturatedFat: 1.5, sodium: 240, carbs: 6, sugars: 2, protein: 6 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '010300933649': {
    barcode: '010300933649',
    name: 'Emerald Roasted & Salted Whole Cashews',
    brand: 'Emerald',
    companyId: null,
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 170,
    ingredients: ['cashews', 'vegetable oil (safflower, sunflower, and/or canola oil)', 'salt', 'rosemary extract'],
    nutrition: { fat: 13, saturatedFat: 2, sodium: 80, carbs: 8, sugars: 2, protein: 5 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },

  '077034089974': {
    barcode: '077034089974',
    name: "Kar's Sweet 'N Salty Mix",
    brand: "Kar's",
    companyId: 'second-nature-brands',
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1/4 cup (28g)',
    calories: 140,
    ingredients: [
      'peanuts',
      'sunflower oil',
      'cottonseed oil',
      'salt',
      'raisins',
      "chocolate candies (confectionery coating [sugar, partially hydrogenated palm kernel oil, cocoa powder, whey powder, nonfat milk powder, soy lecithin, vanillin], sugar, artificial coloring, gum arabic, corn syrup, confectioner's glaze)",
      'yellow 6 lake',
      'yellow 6',
      'yellow 5 lake',
      'blue 1 lake',
      'red 40 lake',
      'blue 2 lake',
      'sunflower kernels',
    ],
    nutrition: { fat: 9, saturatedFat: 2.5, sodium: 60, carbs: 13, sugars: 10, protein: 4 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '893869005084': {
    barcode: '893869005084',
    name: 'Sahale Snacks Honey Almonds Glazed Mix',
    brand: 'Sahale Snacks',
    companyId: 'second-nature-brands',
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1/4 cup (28g)',
    calories: 170,
    ingredients: [
      'almonds',
      'dried cranberries (sugar, cranberries)',
      'organic cane sugar',
      'sesame seeds',
      'organic tapioca syrup',
      'brown sugar',
      'sea salt',
      'organic tapioca syrup solids',
      'organic honey',
      'ground vanilla beans',
      'vanilla extract',
      'almond extract',
      'natural flavors',
    ],
    nutrition: { fat: 13, saturatedFat: 1, sodium: 160, carbs: 11, sugars: 7, protein: 5 },
    certifications: [],
    isOrganic: false,
    isVegan: false,
    isGlutenFree: true,
  },

  '070690270632': {
    barcode: '070690270632',
    name: 'Fisher Deluxe Mixed Nuts',
    brand: 'Fisher',
    companyId: 'sanfilippo',
    category: 'Nuts & Trail Mix',
    image: null,
    servingSize: '1 oz (28g)',
    calories: 170,
    ingredients: ['cashews', 'almonds', 'pecans', 'brazil nuts', 'vegetable oil (peanut, cottonseed, soybean and/or sunflower seed)', 'sea salt'],
    nutrition: { fat: 15, saturatedFat: 2, sodium: 110, carbs: 6, sugars: 1, protein: 5 },
    certifications: [],
    isOrganic: false,
    isVegan: true,
    isGlutenFree: true,
  },
};

// NOTE: image is always null here per schema convention — photos flow through
// product_images.json. Confirmed front-of-pack photo URLs found mid-research
// (matched_off_code images from Stage 1, still live at research time):
//   041570030837 (Blue Diamond Smokehouse Almonds):
//     https://images.openfoodfacts.org/images/products/004/157/003/0837/front_en.5.400.jpg
//   041570072561 (Blue Diamond Honey Roasted Almonds):
//     https://images.openfoodfacts.org/images/products/004/157/007/2561/front_en.55.400.jpg
//   041570130766 (Blue Diamond Lightly Salted Almonds):
//     https://images.openfoodfacts.org/images/products/004/157/013/0766/front_en.32.400.jpg
//   014113910873 (Wonderful Pistachios No Shells Chili Roasted):
//     https://images.openfoodfacts.org/images/products/001/411/391/0873/front_en.4.400.jpg
//   010300933649 (Emerald Roasted & Salted Whole Cashews):
//     https://images.openfoodfacts.org/images/products/001/030/093/3649/front_en.4.400.jpg
//   893869005084 (Sahale Snacks Honey Almonds Glazed Mix):
//     https://images.openfoodfacts.org/images/products/089/386/900/5084/front_fr.7.400.jpg

// could_not_verify — see batch report for full reasoning:
//
// 1. "Wonderful Pistachios No Shells Salt & Pepper" (input brand Wonderful) —
//    the Stage-1 fetch matched a Great Value (Walmart) product by mistake.
//    Independent research (Kroger, Whole Foods, fatsecret, Instacart search
//    snippets) converged on a plausible ingredient list (pistachios, sunflower
//    oil, sea salt, sugar, black pepper, onion powder, garlic powder, yeast
//    extract, lemon juice concentrate, spice, natural flavor) but every source
//    disagreed on/omitted saturated fat, sodium, and fiber, and none displayed
//    a checksum-checkable UPC for this specific SKU (JS-rendered
//    wonderfulpistachios.com pages would not return their nutrition panel to
//    WebFetch). Rather than guess at missing panel values or a barcode, this
//    is left unverified.
//
// 2. "Good & Gather Monster Trail Mix" (Stage-1 miss) — no product by this
//    name/brand combination exists. Target's actual "Monster Trail Mix" is
//    sold under the Favorite Day (TM) brand (confirmed via target.com,
//    UPC 085239156766, full ingredient list and nutrition panel captured),
//    NOT Good & Gather. Good & Gather does sell other trail mixes (Spicy Dill
//    Pickle, Tex Mex, Omega-3) but not a "Monster" flavor. Since the input
//    brand cannot be confirmed against any real product, this is left
//    unverified rather than silently re-brand a Favorite Day product as
//    Good & Gather. Flagging for reviewer: if "Favorite Day Monster Trail
//    Mix" is an acceptable substitute for the batch's intent, the verified
//    data (UPC 085239156766; ingredients: peanuts, M&M's milk chocolate
//    candies, raisins, milk chocolate chips, peanut butter chips, vegetable
//    oil (peanut, cottonseed, soybean and/or sunflower seed), sea salt;
//    serving 1/4 cup (36g), 180 cal, 11g fat, 3.5g sat fat, 65mg sodium,
//    19g carbs, 2g fiber, 15g sugars, 5g protein) is ready to add under a
//    corrected brand/company in a follow-up pass — but that decision belongs
//    to the reviewer/founder, not this agent.
