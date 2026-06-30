# Wave 01 Status

Last updated: 2026-06-28 after reviewed subset merge

## Completed

- `wave_01_targets.json`
- `run_plan.md`
- `coverage_snapshot.md`
- `wave_01_company_resolution.md`
- `wave_01_raw_research.json`
- `wave_01_image_candidates.json`
- `wave_01_followup_research.json`
- `wave_01_formatted_products.js`
- `wave_01_review_notes.md`
- `wave_01_reviewed_products.js`
- `wave_01_merge_notes.md`

## In Progress

- None.

## Pending

- Follow-up wave for not-merged products and missing company entries.

## Follow-Up Required Before Writing

- Slot 4 Hamburger Helper: product facts fixed, but company path must be Eagle Family Foods, not General Mills; requires new `eagle-family-foods` company entry before product merge.
- Slot 7 Chef Boyardee: company path corrected to Hometown Food Company; requires new `hometown-food-company` company entry before product merge.
- Slot 11 Tyson tenderloins: product unresolved; no barcode.
- Slot 12 Perdue Short Cuts: 9 oz UPC found, but nutrition fields are incomplete enough that it needs review before writing.
- Slot 13 Butterball ground turkey: UPC unresolved.
- Slot 19 Trident Seafoods: product facts fixed, but requires new `trident-seafoods` company entry before product merge.
- Slot 20 Gorton's: product facts fixed, but requires new `nissui` company entry before product merge.

## Ready For Writer

- None. Writer and independent reviewer completed the reviewed subset.

## Merged

- Slot 1 Velveeta Shells & Cheese Original
- Slot 2 Annie's Organic Shells & Real Aged Cheddar Mac & Cheese
- Slot 3 Kraft Deluxe Original Cheddar Macaroni & Cheese Dinner
- Slot 6 Knorr Pasta Sides Fettuccine Alfredo
- Slot 8 Hormel Compleats Chicken Alfredo
- Slot 9 Tasty Bite Organic Original Madras Lentils
- Slot 10 Ben's Original Ready Rice Jasmine
- Slot 14 Jennie-O Lean Ground Turkey
- Slot 15 Hillshire Farm Polska Kielbasa
- Slot 16 Aidells Smoked Chicken and Apple Sausage
- Slot 17 Applegate Naturals Chicken & Apple Breakfast Sausage
- Slot 18 SeaPak Jumbo Butterfly Shrimp, using verified 9 oz product identity

## Coordinator Notes

- Writer must use `wave_01_followup_research.json` corrections over raw partial fields.
- Merged entries came from `wave_01_reviewed_products.js`, not raw writer output.
- Helper ownership needs Eagle Family Foods path, not General Mills.
- Chef Boyardee ownership needs Hometown Food Company path, not Conagra.
- Trident Seafoods needs explicit handling to avoid `trident` gum -> Mondelez.
- Gorton's needs Nissui path/company entry.
- Butterball parent resolved as Butterball, not JBS, but product barcode is still unresolved.
- Rice-A-Roni needs calorie/nutrition reconciliation before it can be merged.
