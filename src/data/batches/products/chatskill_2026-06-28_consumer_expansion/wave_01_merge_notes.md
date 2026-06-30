# Wave 01 Merge Notes

Merged on 2026-06-28 after independent review.

## Merged Into `src/data/products.js`

12 reviewer-approved products:

- Velveeta Shells & Cheese Original 12oz
- Annie's Organic Shells & Real Aged Cheddar Macaroni & Cheese 6oz
- Kraft Deluxe Original Cheddar Macaroni & Cheese Dinner 14oz
- Knorr Pasta Sides Fettuccine Alfredo 4.4oz
- Hormel Compleats Chicken Alfredo 10oz
- Tasty Bite Organic Original Madras Lentils 10oz
- Ben's Original Ready Rice Jasmine Rice 8.5oz
- JENNIE-O Lean Ground Turkey
- Hillshire Farm Polska Kielbasa 14oz
- Aidells Smoked Chicken & Apple Sausage 12oz
- Applegate Naturals Chicken & Apple Breakfast Sausage 7oz
- SeaPak Jumbo Butterfly Shrimp 9oz

## Not Merged

- Hamburger Helper Cheeseburger Macaroni: requires `eagle-family-foods` company entry.
- Rice-A-Roni Chicken Flavor Rice: calorie value conflicts with listed macros; needs nutrition follow-up.
- Chef Boyardee Beef Ravioli: requires `hometown-food-company` company entry.
- Tyson Boneless Skinless Chicken Breast Tenderloins: unresolved product evidence.
- Perdue Short Cuts Original Roasted Carved Chicken Breast: incomplete nutrition fields.
- Butterball Ground Turkey 93/7: unresolved UPC/image.
- Trident Seafoods Alaskan Salmon Burgers: requires `trident-seafoods` company entry.
- Gorton's Beer Battered Fish Fillets: requires `nissui` company entry.

## Verification

- `node --check src/data/products.js` passed.
- Duplicate barcode scan found no duplicate `barcode` fields.
- All 12 approved barcodes are present in `src/data/products.js`.
- Independent review checkpoint is `wave_01_review_notes.md`.
