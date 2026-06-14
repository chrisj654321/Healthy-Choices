# Bread Pt2 — Independent QA Report

**Date:** 2026-06-14
**Reviewer:** Independent QA subagent
**Inputs:** `bread_pt2_formatted.js` (9 products), `bread_pt2_raw.json` (15 products), `products.js`, `companies.js`

## Summary

- **8 PASS / 0 FIX / 1 REJECT** (of the 9 products in the formatted file)
- 6 raw products were **never carried into** the formatted file and are correctly excluded (all fail UPC-A check digit; all flagged `could_not_verify`/not-in-OFF in raw JSON).

## Per-product verdicts (formatted file)

| # | UPC | Product | Check digit | OFF name/brand | Ing. order | Medical | companyId | Schema | Dup? | Verdict |
|---|-----|---------|-------------|----------------|-----------|---------|-----------|--------|------|---------|
| 1 | 073731004197 | Mission Burrito Tortillas 8ct | OK | match (Flour Tortillas BURRITO / mission) | match | clean | null + `_missingCompany` Gruma (no `gruma` key) — correct | complete | no | **PASS** |
| 2 | 046000273419 | Old El Paso Soft Tacos & Fajitas 10ct | OK | match | match | clean | `general-mills` exists; GM owns Old El Paso | complete | no | **PASS** |
| 3 | 074117000734 | Joseph's Lavash Bread 4ct | OK | match (Lavash Bread / Joseph's) | match | clean | null (no parent key) — correct | complete | no | **PASS** |
| 4 | 073130001322 | Oroweat 100% Whole Wheat 24oz | OK | match | match | clean | `bimbo` exists; Oroweat in subsidiaries list | complete | no | **PASS** |
| 5 | 055991040450 | Silver Hills Squirrelly 21oz | OK | match (Squirrelly / Silver Hills) | match | clean | null — correct | complete | no | **PASS** |
| 6 | 072250037631 | Nature's Own 40-Cal Honey Wheat 16oz | OK | match | match | clean | `flowers-foods` exists; subsidiary confirmed | complete | no | **PASS** |
| 7 | 696685200042 | Carbonaut GF White 19oz | OK | match | match | clean | null — correct | complete | no | **PASS** |
| 8 | 853584002003 | Canyon Bakehouse Mountain White 18oz | OK | match | match | clean | `flowers-foods` exists; subsidiary confirmed | complete | no | **PASS** |
| 9 | 698997809166 | Udi's GF Whole Grain Sandwich 12oz | OK | match (Pinnacle/Udi's) | match | clean | null + `_missingCompany` Conagra | complete | **YES** | **REJECT** |

### REJECT detail — #9 Udi's (698997809166)
Barcode `698997809166` already exists in `products.js` at ~line 4210 as
`"Udi's Gluten Free Whole Grain Bread 12oz"` (brand "Udi's"). Adding it again is a duplicate key.
**Action:** excluded from `bread_pt2_reviewed.js`.

## Checklist notes

**A. UPC-A check digit + OFF API.** All 9 formatted UPCs pass mod-10. All 9 confirmed in OFF with matching name/brand. The 6 excluded raw products fail check digit (expected vs actual): 007885852032→8, 068833992319→2, 031493828880→8, 085253700541→9, 085279500517→2, 086000089922→4 — consistent with raw JSON `could_not_verify` notes.

**B. Ingredient order.** All 9 formatted `ingredients` arrays are byte-identical to the corresponding `ingredients_verbatim` in raw JSON.

**C. Medical claims.** No causes/prevents/cures/treats/toxic/carcinogenic/linked-to-disease language in any name or ingredient string.

**D. companyId / 2026 ownership.**
- `general-mills`, `bimbo`, `flowers-foods` all exist literally in `companies.js`.
- Ownership current as of 2026: Old El Paso→General Mills; Oroweat→Grupo Bimbo (subsidiaries list); Nature's Own & Canyon Bakehouse→Flowers Foods (subsidiaries list).
- `gruma` is NOT a key in companies.js; Mission correctly set `companyId: null` with `_missingCompany: 'Gruma (Mission Foods)'`. Mission→Gruma ownership confirmed.
- Raw JSON used a non-existent key `bimbo-bakeries` for Oroweat; formatted file correctly normalized to `bimbo`.
- Joseph's, Silver Hills, Carbonaut have no parent key defined; `null` is appropriate.

**E. Schema.** All 9 entries complete; `barcode` field equals the object key in every case.

**F. Duplicates.** Only `698997809166` (Udi's) collides with an existing `products.js` entry. The other 8 are absent from `products.js` (0 matches each).

## Recommendation
Merge the 8 PASS products from `bread_pt2_reviewed.js`. Do not add Udi's (`698997809166`) — already present. If desired, replace the existing Udi's entry separately to capture the fuller ingredient list and Conagra ownership note, but that is out of scope for this batch.
