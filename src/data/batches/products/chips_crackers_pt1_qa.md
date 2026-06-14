# QA Report — Chips & Crackers (Part 1)

**Reviewed:** 2026-06-13
**Source:** `chips_crackers_pt1_formatted.js` vs `chips_crackers_pt1_raw.json`
**Cross-checks:** `products.js` (duplicate barcodes), `companies.js` (companyId)

## Summary

| Verdict | Count |
|---------|-------|
| PASS    | 16    |
| FIX     | 0     |
| REJECT  | 2     |
| **Total** | **18** |

All 18 UPC-A check digits are mathematically valid. All 18 barcodes resolve to a found product on Open Food Facts with matching brand/product. Two entries were rejected: one duplicate barcode and one with no valid `companyId` in `companies.js`.

## Per-product results

| # | Barcode | Name | UPC chk | OFF match | Ingredients order | Med. claims | companyId | Dup | Schema | Verdict |
|---|---------|------|---------|-----------|-------------------|-------------|-----------|-----|--------|---------|
| 1 | 028400199148 | Lay's Classic Potato Chips | OK | "Classic" / Lay's ✓ | matches | none | pepsico ✓ | no | ✓ | PASS |
| 2 | 028400516464 | Doritos Nacho Cheese Tortilla Chips | OK | Nacho Cheese / Frito-Lay ✓ | matches | none | pepsico ✓ | **YES (products.js:319)** | ✓ | **REJECT** |
| 3 | 028400516310 | Doritos Cool Ranch Tortilla Chips | OK | Cool Ranch / Frito-Lay ✓ | matches | none | pepsico ✓ | no | ✓ | PASS |
| 4 | 028400589864 | Cheetos Crunchy | OK | Cheetos Crunchy / Cheetos ✓ | matches | none | pepsico ✓ | no | ✓ | PASS |
| 5 | 028400589895 | Cheetos Flamin' Hot Crunchy | OK | Flamin' Hot / Cheetos ✓ | matches | none | pepsico ✓ | no | ✓ | PASS |
| 6 | 028400589291 | Fritos Original Corn Chips | OK | The Original Corn Chips / Frito ✓ | matches | none | pepsico ✓ | no | ✓ | PASS |
| 7 | 028400516686 | Ruffles Original Potato Chips | OK | Original Ruffles / Ruffles ✓ | matches | none | pepsico ✓ | no | ✓ | PASS |
| 8 | 084114108128 | Kettle Brand Sea Salt | OK | Potato Chips Sea Salt / Kettle Brand ✓ | matches | none | campbell ✓ | no | ✓ | PASS |
| 9 | 020685001642 | Cape Cod Original Kettle | OK | Original Sea Salt Kettle / Cape Cod ✓ | matches | none | campbell ✓ | no | ✓ | PASS |
| 10 | 850251004001 | SkinnyPop Original Popcorn | OK | Original Popcorn / Skinny Pop ✓ | matches | none | hershey ✓ | no | ✓ | PASS |
| 11 | 028400147415 | SunChips Original Multigrain | OK | Sun Chips Original / Sun Chips ✓ | matches | none | pepsico ✓ | no | ✓ | PASS |
| 12 | 028400314015 | Smartfood White Cheddar Popcorn | OK | White Cheddar / Smartfood ✓ | matches | none | pepsico ✓ | no | ✓ | PASS |
| 13 | 044000031114 | Ritz Original Crackers | OK | Ritz Crackers the original / Ritz ✓ | matches | none | mondelez ✓ | no | ✓ | PASS |
| 14 | 044000050986 | Triscuit Original | OK | original made with sea salt / Triscuit ✓ | matches | none | mondelez ✓ | no | ✓ | PASS |
| 15 | 044000030377 | Wheat Thins Original | OK | wheat thins crackers, original / Nabisco ✓ | matches | none | mondelez ✓ | no | ✓ | PASS |
| 16 | 024100106851 | Cheez-It Original | OK | Original Baked Snack Crackers / Cheez-It ✓ | matches | none | kelloggs ✓ | no | ✓ | PASS |
| 17 | 013562302154 | Annie's Cheddar Bunnies | OK | Cheddar Bunnies Original / Annie's ✓ | matches | none | general-mills ✓ | no | ✓ | PASS |
| 18 | 856069005131 | Simple Mills Almond Flour Crackers | OK | Almond Flour Crackers / Simple Mills ✓ | matches | none | **null (none in companies.js)** | no | ✓ | **REJECT** |

## Detail on rejections

### #2 — 028400516464 Doritos Nacho Cheese — REJECT (duplicate)
Barcode already present in `src/data/products.js` at line 319 (`name: 'Doritos Nacho Cheese'`, companyId pepsico, category 'Chips'). Adding it again would create a duplicate key. Check digit and OFF lookup are both valid; rejection is solely on the duplicate.

### #18 — 856069005131 Simple Mills — REJECT (companyId)
The entry carries `companyId: null` with a `_missingCompany: 'Simple Mills'` flag. Criterion D requires `companyId` to exist literally in `companies.js`. No `simple-mills` (or Flowers Foods, Simple Mills' 2025 acquirer) id exists in `companies.js` (only pepsico, kelloggs, general-mills, mondelez, hershey, campbell among the relevant ids). With no valid company reference, the product cannot pass ownership verification and is rejected pending a companies.js entry. UPC, OFF match, ingredients and the rest of the schema are all valid.

## Notes / verification details

- **UPC-A check digits:** all 18 verified via mod-10 (3-1 weighting). Zero failures.
- **OFF API:** all 18 returned `status: 1` (product found). Brand strings on OFF vary (Frito-Lay vs Doritos, Nabisco vs Wheat Thins, Skinny Pop vs SkinnyPop) but all resolve to the correct product/line — accepted.
- **Ingredients:** formatted arrays are byte-for-byte identical (including order and casing) to `ingredients_verbatim` in the raw JSON for every product.
- **Medical claims:** none of the ingredient lists or names contain causes/prevents/cures/treats/toxic/carcinogenic/disease-linkage language.
- **2026 ownership applied:** SkinnyPop → Hershey (Amplify acquisition) ✓; Kettle Brand & Cape Cod → Campbell (Snyder's-Lance/Campbell) ✓; Annie's → General Mills ✓; Triscuit/Wheat Thins/Ritz → Mondelez ✓; Cheez-It → Kellanova/kelloggs id ✓.
- **could_not_verify (raw JSON):** Late July Clasico 7.1oz and PopCorners Flex White Cheddar 5oz were already omitted upstream per protocol; not part of this batch.

## Output

`chips_crackers_pt1_reviewed.js` contains the 16 PASS entries only.
Header comment: `// QA REVIEWED — 16 PASS 0 FIX 2 REJECT`
