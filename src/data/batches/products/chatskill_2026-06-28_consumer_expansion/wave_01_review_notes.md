# Wave 01 Review Notes

Reviewer checkpoint for `chatskill_2026-06-28_consumer_expansion` wave 01.

Scope: compared `wave_01_formatted_products.js` against raw research, follow-up research, company follow-up, and existing `companies.js` / `products.js`. No outside product research was performed.

## Summary

| Count | Value |
|---|---:|
| PASS | 12 |
| FIX | 2 |
| REJECT | 6 |

Coordinator merge status: **not safe to merge the full wave**. The reviewed-products file contains only the 12 PASS entries. The 2 FIX items and 6 REJECT/company-blocked items should stay out until the exact notes below are resolved.

## Product Verdicts

| Slot | Barcode | Product | Verdict | Review notes |
|---:|---|---|---|---|
| 1 | `021000654925` | Velveeta Shells & Cheese Original 12 oz | PASS | Schema, UPC check digit, `kraft-heinz`, image key, packaged-meals category, ingredients, and nutrition match raw checkpoint. No duplicate barcode found in `products.js`. |
| 2 | `013562300983` | Annie's Organic Shells & Real Aged Cheddar 6 oz | PASS | Schema, UPC check digit, `general-mills`, image key, category, organic flags, ingredients, and nutrition match raw checkpoint. No duplicate barcode found. |
| 3 | `021000658862` | Kraft Deluxe Original Cheddar Macaroni & Cheese Dinner 14 oz | PASS | Writer correctly used follow-up FIX facts for serving size, nutrition, ingredients, and image. UPC and `kraft-heinz` are valid. No duplicate barcode found. |
| 4 | `016000402126` | Hamburger Helper Cheeseburger Macaroni | REJECT | Correct parent is Eagle Family Foods per company follow-up, but `eagle-family-foods` does not exist in `companies.js`. Keep excluded until company entry/analysis exists. |
| 5 | `015300430235` | Rice-A-Roni Chicken Flavor Rice 6.9 oz | FIX | Formatted object is otherwise schema-valid and `pepsico` exists, but calories `100` conflict with macros `40g carbs + 5g protein + 0.5g fat`, which cannot be reconciled from provided checkpoints. Requires nutrition/calorie follow-up before merge. Excluded from reviewed output. |
| 6 | `041000022531` | Knorr Pasta Sides Fettuccine Alfredo 4.4 oz | PASS | Writer correctly used follow-up FIX facts instead of erroneous raw serving size. UPC, `unilever`, image, ingredients, nutrition, and category pass. No duplicate barcode found. |
| 7 | `064144043156` | Chef Boyardee Beef Ravioli | REJECT | Company follow-up says Chef Boyardee requires new `hometown-food-company` entry and deep analysis; formatted writer excluded it. Do not use old `conagra` mapping for this wave. |
| 8 | `037600833233` | Hormel Compleats Chicken Alfredo 10 oz | PASS | Schema-valid, UPC-valid, `hormel` exists, image key is correct, and ingredient/nutrition values map to raw checkpoint. No duplicate barcode found. |
| 9 | `782733000020` | Tasty Bite Organic Original Madras Lentils 10 oz | PASS | Writer correctly used follow-up US-market facts and limited certifications to supported organic/non-GMO claims. UPC, `mars`, image, nutrition, ingredients, and flags pass. |
| 10 | `054800423392` | Ben's Original Ready Rice Jasmine Rice 8.5 oz | PASS | Schema, UPC, `mars`, image, category, vegan/gluten-free flags, ingredients, and nutrition match raw checkpoint. No duplicate barcode found. |
| 11 | none | Tyson Boneless Skinless Chicken Breast Tenderloins | REJECT | Follow-up rejected: no verified complete product evidence or nutrition panel. Do not write guessed UPC. |
| 12 | `072745002212` | Perdue Short Cuts Original Roasted Carved Chicken Breast 9 oz | FIX | Follow-up found a likely UPC but still has null saturated fat, sugars, fiber, and incomplete nutrition documentation. Keep excluded until resolved or explicitly documented. |
| 13 | none | Butterball Fresh All Natural Ground Turkey 93/7 | REJECT | Follow-up rejected because no valid UPC was exposed and image remains null. Keep excluded. |
| 14 | `042222302005` | JENNIE-O Lean Ground Turkey | PASS | Schema, UPC, `hormel`, category, ingredients, and nutrition pass. `image: null` is preserved because no accepted image candidate exists in upstream checkpoints; coordinator may fill photo later. No duplicate barcode found. |
| 15 | `044500341225` | Hillshire Farm Polska Kielbasa 14 oz | PASS | Writer correctly used follow-up PASS facts including protein and image. UPC, `tyson`, category, ingredients, and nutrition pass. No duplicate barcode found. |
| 16 | `764014208059` | Aidells Smoked Chicken & Apple Sausage 12 oz | PASS | Schema, UPC, `tyson`, category, gluten-free flag, ingredients, and nutrition pass. `image: null` is preserved because no accepted image candidate exists in upstream checkpoints. No duplicate barcode found. |
| 17 | `025317006958` | Applegate Naturals Chicken & Apple Breakfast Sausage 7 oz | PASS | Writer correctly replaced the raw wrong UPC with follow-up UPC `025317006958` and used follow-up nutrition/ingredients/image. `hormel` exists. No duplicate barcode found. |
| 18 | `041322109002` | SeaPak Jumbo Butterfly Shrimp 9 oz | PASS | Writer correctly used follow-up 9 oz product facts and `rich-products`. UPC, image, ingredients, nutrition, and category pass. No duplicate barcode found. |
| 19 | `028029597103` | Trident Seafoods Alaskan Salmon Burgers | REJECT | Product facts improved in follow-up, but `trident-seafoods` does not exist in `companies.js`. Keep excluded and do not map to generic Trident/Mondelez. |
| 20 | `044400153508` | Gorton's Beer Battered Fish Fillets | REJECT | Product facts improved in follow-up, but parent requires missing `nissui` company entry and deep analysis. Keep excluded. |

## Reviewed Output Notes

- `wave_01_reviewed_products.js` includes 12 PASS entries only.
- All included barcodes have valid UPC-A check digits.
- All included `companyId` values exist in `src/data/companies.js`.
- No included barcode was found in `src/data/products.js`.
- All included products use `image`, not `imageUrl`; two entries intentionally retain `image: null` with the reviewed reasons above.
