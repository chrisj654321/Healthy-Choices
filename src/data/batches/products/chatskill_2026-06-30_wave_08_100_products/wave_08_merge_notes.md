# Wave 08 Merge Notes

Merged 100 reviewed products into `src/data/products.js`.

## Verification Targets

- No duplicate barcodes against existing `PRODUCT_DB` before merge, including leading-zero normalized checks.
- Every product has companyId, ingredients, nutrition, servingSize, and image.
- `products.js` should parse with `node --check`.

## Categories Added

- Packaged Meals: 19
- Condiments & Sauces: 7
- Meat & Seafood / Primary Proteins: 19
- Deli & Lunch: 5
- Cereals: 16
- Chips & Crackers: 5
- Snack Bars: 6
- Frozen Meals: 4
- Canned Goods: 1
- Frozen Vegetables & Fruit: 7
- Soups & Broths: 11
