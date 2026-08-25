# Yogurt Re-Research — QA Review

**Reviewer:** Claude Code (independent QA)
**Date:** 2026-06-12
**Source files:**
- `src/data/batches/products/yogurt_reresearched_formatted.js`
- `src/data/batches/products/yogurt_reresearch_raw.json`
**Cross-checked against:** `src/data/products.js` (duplicates), `src/data/companies.js` (companyId)

**Result: 16 PASS / 3 FIX / 3 REJECT** (22 products reviewed)

Checklist per product: A barcode (check digit + Open Food Facts product match), B ingredient order vs raw, C medical claims, D companyId exists & reflects 2026 ownership, E schema, F duplicate check.

---

## Global checks

- **Duplicates (F):** None of the 22 barcodes appear in `products.js`. PASS for all.
- **Medical claims (C):** Formatted entries contain only ingredients + schema fields (no marketing `notes`). No causes/prevents/cures/treats/toxic/carcinogenic/disease language found. PASS for all.
- **Ingredient order (B):** Formatted `ingredients` arrays are a verbatim, in-order copy of the raw JSON `ingredients`. Match for all. (Raw field is `ingredients`, not `ingredients_verbatim`; identical content.)
- **Schema (E):** All entries have required fields and the object key equals the `barcode` field. (After fix, Lifeway key and barcode both updated to the corrected value.)
- **companyId keys confirmed present in companies.js:** `danone`, `general-mills`, `lactalis`, `chobani`, `forager-project`, `kite-hill`, `oatly`. (`celsius-holdings` also exists — not used here.)

---

## Per-product verdicts

| # | Product | Barcode | Check digit | OFF match | Verdict |
|---|---------|---------|-------------|-----------|---------|
| 1 | Dannon Fruit on the Bottom Strawberry | 036632001047 | OK (7) | Dannon "Low Fat Yogurt Strawberry" | **PASS** |
| 2 | Yoplait Original Strawberry | 070470003009 | OK (9) | Yoplait "strawberry" | **PASS** |
| 3 | Activia Strawberry Lowfat | 036632026002 | OK (2) | Activia "Strawberry Yogurt" | **PASS** |
| 4 | Wallaby Organic Strawberry | 795709010015 | OK (5) | Wallaby Organic "...Strawberry" | **PASS** |
| 5 | Oikos Triple Zero Vanilla | 036632008343 | OK (3) | "Oikos Triple Zero" vanilla greek | **PASS** |
| 6 | Siggi's 0% Plain Skyr | 898248001008 | OK (8) | siggi's "...skyr PLAIN" | **PASS** |
| 7 | Two Good Strawberry | 036632039019 | OK (9) | "Too good blended strawberry yogurt" | **PASS** |
| 8 | Chobani Plain Nonfat Greek 32oz | 894700010137 | OK (7) | chobani "Greek Yogurt Nonfat Plain" | **PASS** |
| 9 | So Delicious Coconut Vanilla | 744473000135 | OK (5) | So Delicious vanilla coconutmilk | **PASS** |
| 10 | Kite Hill Plain Unsweetened Almond | 856624004364 | OK (4) | kite hill "plain unsweetened ALMOND MILK YOGURT" | **FIX** companyId |
| 11 | Silk Almondmilk Strawberry | 025293003965 | OK (5) | Silk "Almondmilk Strawberry" | **PASS** |
| 12 | Forager Cashewmilk Plain | 814558020331 | OK (1) | Forager Project cashew/coconut | **PASS** |
| 13 | Oatly Oatmilk Plain | 019064663042 | **FAIL** (need 5, has 2) | n/a | **REJECT** |
| 14 | Danimals Strawberry Smoothie | 036632036407 | OK (7) | Danimals/Dannon "danonino" | **PASS** |
| 15 | GoGurt Strawberry Tubes | 070470137780 | OK (0) | Yoplait "Go-Gurt Strawberry..." | **PASS** |
| 16 | Little Chobani Strawberry Banana | 081829001681 | **FAIL** (need 3, has 1) | n/a | **REJECT** |
| 17 | YoCrunch Strawberry w/ M&Ms | 046675000839 | OK (9) | YoCrunch "...with M&M's" | **PASS** |
| 18 | Stonyfield YoBaby Vanilla | 005215970117 | OK (7) | **404 — not in OFF** | **FIX** (flag unverified) |
| 19 | Lifeway Plain Lowfat Kefir | 017077102320 | **FAIL** (need 2, has 0) | corrected 017077102322 = Lifeway "Kefir" | **FIX** barcode |
| 20 | Yakult Original Probiotic | 699235001007 | OK (7) | Yakult "Live & Active Probiotic Drink" | **PASS** |
| 21 | Activia Probiotic Dailies Strawberry | 036632029546 | OK (6) | ACTIVIA "Low Fat Yogurt Drink" | **PASS** |
| 22 | Green Valley Creamery Kefir | 008131240000 | **FAIL** (need 5, has 0) | corrected 008131240005 also not in OFF | **REJECT** |

---

## FIX details

### #10 Kite Hill — `FIX companyId: 'kite-hill'`
Formatted entry set `companyId: null` with `_missingCompany`, but `'kite-hill'` exists as a real key in `companies.js` (line 6589, "Kite Hill Inc."). Corrected to `companyId: 'kite-hill'`; `_missingCompany` removed. Barcode and OFF match are valid.

### #18 Stonyfield YoBaby — `FIX: flag _qaUnverified`
UPC-A check digit is valid (7). However the product returns **HTTP 404** from Open Food Facts (both `world.openfoodfacts.org` and `.net`), so the required OFF product-name/brand confirmation could not be obtained. The raw JSON only cited a Kroger retailer URL. Not a "wrong product" or "wrong check digit," so not a hard REJECT — retained with a `_qaUnverified` flag recommending secondary confirmation before publishing. companyId `'lactalis'` is valid (Stonyfield divested by Danone to Lactalis). Barcode not found in `products.js`.

### #19 Lifeway — `FIX barcode: 017077102322`
Original `017077102320` fails the UPC-A check digit (computed 2, file had 0). The single-digit correction `017077102322` was verified on Open Food Facts as Lifeway "Kefir" (Lifeway Foods Inc., 946ml). Object key, `barcode` field, and check all updated to `017077102322`. `companyId` stays `null` — Lifeway is not a key in `companies.js` (independent, LWAY); `_missingCompany` retained.

---

## REJECT details

### #13 Oatly Oatmilk Plain — `REJECT: bad UPC-A check digit`
`019064663042` fails check digit (computed 5, has 2). Corrected `019064663045` is not in Open Food Facts, so the intended product cannot be confirmed. Cannot auto-fix.
Note: the formatted entry also set `companyId: null`, but `'oatly'` IS a key in `companies.js` (line 3115). Even with that companyId fix, the unverifiable barcode forces REJECT. Re-research the correct UPC.

### #16 Little Chobani Strawberry Banana — `REJECT: bad UPC-A check digit`
`081829001681` fails check digit (computed 3, has 1). Corrected `081829001683` is not in Open Food Facts. Cannot confirm intended product. Re-research the correct UPC.

### #22 Green Valley Creamery Kefir — `REJECT: bad UPC-A check digit`
`008131240000` fails check digit (computed 5, has 0). The all-zeros tail (`...40000`) looks like a placeholder. Corrected `008131240005` is also absent from Open Food Facts. Cannot confirm. Re-research the correct UPC.

---

## Notes for re-research (rejected items)
- All three rejects were sourced in the raw JSON via Kroger product-URL prefixes, not via Open Food Facts. The Kroger note for Lifeway even acknowledged a possible check-digit ambiguity. Kroger URL digit prefixes are unreliable for deriving the printed UPC-A — prefer the OFF API or the package barcode.
- The `could_not_verify` list in the raw JSON (Fage 0% 7oz, Stonyfield Strawberry Lowfat 6oz, Chobani Peach & Mango Drink) was correctly excluded from the formatted batch — no action needed.
