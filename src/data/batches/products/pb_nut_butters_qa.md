# QA Report — Peanut Butter & Nut Butters

**Reviewed:** 2026-06-14
**Source files:** `pb_nut_butters_formatted.js` (14 products), `pb_nut_butters_raw.json` (15 candidates)
**Cross-checks:** `products.js` (duplicates), `companies.js` (companyId)

**Verdict tally: 14 PASS · 0 FIX · 1 REJECT**

---

## Summary findings

- **Duplicate check (F):** All 15 candidate barcodes return 0 hits in `products.js`. No duplicates.
- **companyId existence (D):** All referenced ids (`jm-smucker`, `hormel`, `post-holdings`, `hain-celestial`) exist literally in `companies.js` (lines 694, 1005, 2526, 2731). `null` companyIds (independent brands) accepted.
- **companyId data note:** The raw JSON used `companyId: "j-m-smucker"` for Jif and Smucker's, which does **not** exist in `companies.js`. The formatting step correctly normalized this to `jm-smucker`. The formatted/reviewed output is correct; flagging the raw-JSON value as a source defect for upstream awareness.
- **Medical-claim scan (C):** No causes/prevents/cures/treats/toxic/carcinogenic/disease language in any name, ingredient list, or certification. Clean.
- **Ingredient order (B):** All 14 formatted `ingredients` arrays match `ingredients_verbatim` in the raw JSON exactly (order and text).
- **Schema (E):** All 14 entries have the complete schema; the object key equals the `barcode` field in every case.

---

## Per-product results

| # | Barcode | Product | UPC check digit | OFF API name / brand | companyId | Verdict |
|---|---------|---------|-----------------|----------------------|-----------|---------|
| 1 | 051500255162 | Jif Creamy PB 16oz | OK | "Creamy Peanut Butter" / Jif | jm-smucker ✓ | PASS |
| 2 | 037600110754 | Skippy Creamy PB 16.3oz | OK | "Creamy Peanut Butter" / Skippy | hormel ✓ | PASS |
| 3 | 045300005492 | Peter Pan Creamy Original 16.3oz | OK | "Peanut Butter" / Peter Pan | post-holdings ✓ | PASS |
| 4 | 051500017005 | Smucker's Natural Creamy 16oz | OK | "Natural Creamy Peanut Butter" / Smucker's | jm-smucker ✓ | PASS |
| 5 | 071018010183 | Teddie All Natural Smooth 16oz | OK | "Smooth Peanut Butter" / Teddie | null | PASS |
| 6 | 855188003004 | Justin's Classic PB 16oz | OK | "PEANUT BUTTER SPREAD" / Justin's | hormel ✓ | PASS |
| 7 | 044082032313 | Once Again Organic Creamy 16oz | OK | "Organic Peanut Butter…" / Once Again | null | PASS |
| 8 | 074822610631 | Crazy Richard's 100% Natural 16oz | OK | "100% Peanuts! Creamy" / Crazy Richard's¹ | null | PASS |
| 9 | 894455000315 | Justin's Classic Almond 16oz | OK | "Almond Butter" / Justin's | hormel ✓ | PASS |
| 10 | 051651060325 | MaraNatha Creamy Almond 16oz | OK | "Almond Butter" / MaraNatha | hain-celestial ✓ | PASS |
| 11 | 094922149985 | Barney Butter Smooth Almond 10oz | OK | "Almond Butter Smooth" / Barney Butter | null | PASS |
| 12 | 870001002576 | Artisana Raw Cashew 14oz | OK | "Raw Cashew Butter" / Artisana Organics | null | PASS |
| 13 | 737539191205 | SunButter Natural Sunflower 16oz | OK | "Sunflower Seed Butter" / SunButter | null | PASS |
| 14 | 857851005063 | 88 Acres Pumpkin Seed 14oz | OK | "Pumpkin Seed Butter" / 88Acres | null | PASS |
| — | 085354700376 | Wild Friends Classic Creamy PB 16oz | **FAIL** | not in OFF | null | **REJECT** |

¹ OFF lists brand as "Carmy Richards" (apparent OFF data-entry typo); barcode and product type confirm the match. Accepted.

---

## Ownership verification (2026)

- **jm-smucker** (Jif, Smucker's) — The J.M. Smucker Company owns both brands. Current. ✓
- **hormel** (Skippy, Justin's) — Hormel Foods acquired Skippy (2013) and Justin's (2016); both still owned in 2026. ✓
- **post-holdings** (Peter Pan) — Post Holdings acquired Peter Pan from Conagra Brands (deal closed 2021); manufacturing internalized via 8th Avenue Food & Provisions acquisition effective 2025-07-01. The OFF record's "Conagra Brands" manufacturer tag is stale; `post-holdings` is the correct 2026 owner. ✓ (Sources: Food Dive; Post Holdings SEC Form 8-K FY2025)
- **hain-celestial** (MaraNatha) — Hain Celestial Group owns MaraNatha. Current. ✓

---

## REJECT detail

**Wild Friends Classic Creamy Peanut Butter 16oz — UPC 085354700376**
- **UPC-A mod-10 check digit FAILS:** odd-position sum × 3 + even-position sum yields a required check digit of `0`, but the barcode ends in `6`. Invalid UPC-A.
- **OFF lookup:** product not found in Open Food Facts (`could_not_verify_in_OFF` in raw JSON). Nutrition was sourced only from a third-party Instacart listing.
- **Disposition:** Correctly excluded from `pb_nut_butters_formatted.js` by the formatting step. Do **not** add to `products.js` without a corrected, scan-verified barcode.
