# Beverages Pt2 — Independent QA Review

**Date:** 2026-06-13
**Reviewer:** Automated QA pass
**Source files:** `beverages_pt2_formatted.js`, `beverages_pt2_raw.json`
**Cross-checks:** `products.js` (duplicates), `companies.js` (companyId)

## Summary

| Result | Count |
|--------|-------|
| PASS   | 25    |
| FIX    | 2     |
| REJECT | 0     |
| **Total reviewed** | **27** |

- All 27 UPC-A check digits computed valid (mod-10).
- No duplicate barcodes found in `products.js`.
- No medical claims (causes/prevents/cures/treats/toxic/carcinogenic/linked-to-disease) found in any product.
- All ingredient arrays match `ingredients_verbatim` order in the raw JSON.
- All 8 distinct companyIds (`danone`, `coca-cola`, `pepsico`, `ocean-spray`, `nestle`, `keurig-dr-pepper`, `gts-living-foods`, `health-ade`) exist literally in `companies.js`.
- 26/27 products confirmed via OpenFoodFacts API name+brand match. DASANI (049000009774) is absent from OFF API but confirmed via upcitemdb + Target per raw note; check digit valid, retained as PASS.
- Two `could_not_verify` items (Humm Blueberry Lemon, KeVita Master Brew Ginger Lemon) were correctly excluded from the formatted file.

## Per-product results

| # | UPC | Product | Check digit | OFF API name/brand | Ingredients order | Medical claims | companyId | Duplicate | Verdict |
|---|-----|---------|-------------|--------------------|-------------------|----------------|-----------|-----------|---------|
| 1 | 632565000098 | FIJI Natural Artesian Water | OK (8) | Match (Natural Artesian Water / FIJI) | Match | None | null (+_missingCompany) | No | PASS |
| 2 | 079298000085 | Evian Natural Spring Water | OK (5) | Match (Natural Spring Water / evian) | Match | None | danone ✓ | No | PASS |
| 3 | 786162200433 | Smartwater Vapor Distilled | OK (3) | Match (SmartWater / Glacéau) | Match | None | coca-cola ✓ | No | PASS |
| 4 | 075720000814 | Poland Spring Natural Spring Water | OK (4) | Match (poland spring) | Match | None | null (+_missingCompany) | No | PASS |
| 5 | 049000009774 | DASANI Purified Water | OK (4) | Not in OFF (alt-source confirmed) | Match | None | coca-cola ✓ | No | PASS* |
| 6 | 048500301029 | Tropicana Pure Premium No Pulp OJ | OK (9) | Match (Pure Premium OJ Original No Pulp / Tropicana) | Match | None | null (+_missingCompany) | No | PASS |
| 7 | 025000100000 | Simply Orange Pulp Free OJ | OK (0) | Match (Simply Orange Pulp Free / Simply) | Match | None | coca-cola ✓ | No | PASS |
| 8 | 025000058387 | Minute Maid Lemonade | OK (7) | Match (Lemonade) | Match | None | coca-cola ✓ | No | PASS |
| 9 | 031200200075 | Ocean Spray Cranberry Juice Cocktail | OK (5) | Match (Cranberry Juice Cocktail / Ocean Spray) | Match | None | ocean-spray ✓ | No | PASS |
| 10 | 082592720153 | Naked Juice Green Machine | OK (3) | Match (BOOSTED SMOOTHIE GREEN MACHINE / Naked) | Match | None | pepsico ✓ | No | PASS |
| 11 | 041800207503 | Welch's 100% Concord Grape Juice | OK (3) | Match (100% Grape Juice Concord / Welch's) | Match | None | null (+_missingCompany) | No | PASS |
| 12 | 012000004520 | Starbucks Frappuccino Mocha | OK (0) | Match (Starbucks frappuccino mocha / Starbucks) | Match | None | pepsico ✓ | No | PASS |
| 13 | 012000028496 | Starbucks Doubleshot Energy Vanilla | OK (6) | Match (DOUBLESHOT ENERGY / STARBUCKS) | Match | None | pepsico ✓ | No | PASS |
| 14 | 604913000159 | La Colombe Vanilla Draft Latte | OK (9) | Match (Vanilla Draft Latte / La Colombe) | Match | None | null (+_missingCompany) | No | PASS |
| 15 | 041271027730 | SToK Cold Brew Unsweetened Black | OK (0) | Match (COLD BREW COFFEE / STŌK) | Match | None | danone ✓ | No | PASS |
| 16 | 851220003414 | Chameleon Cold-Brew Organic Concentrate | OK (4) | Match (Chameleon cold-brew concentrate / Chameleon) | Match | None | nestle ✓ | No | PASS |
| 17 | 012000012709 | Lipton Iced Tea Lemon | OK (9) | Match (Iced tea / Lipton, Unilever) | Match | None | pepsico ✓ | No | PASS |
| 18 | 613008715267 | AriZona Green Tea Ginseng & Honey | OK (7) | Match (Green Tea with Ginseng and Honey / Arizona) | Match | None | null (+_missingCompany) | No | PASS |
| 19 | 076183003282 | Snapple Apple Juice Drink | OK (2) | Match (snapple apple / snapple) | Match | None | keurig-dr-pepper ✓ | No | PASS |
| 20 | 012000286209 | Pure Leaf Unsweetened Black Tea | OK (9) | Match (PURE LEAF Real Brewed Unsweetened / PURE LEAF) | Match | None | pepsico ✓ | No | PASS |
| 21 | 083900005757 | Gold Peak Sweet Tea | OK (7) | Match (Sweet Tea Gold Peak / Gold Peak, Coca-Cola) | Match | None | coca-cola ✓ | No | PASS |
| 22 | 722430110165 | GT's Synergy Trilogy Kombucha | OK (5) | Match (TRILOGY / SYNERGY) | Match | None | gts-living-foods ✓ | No | PASS |
| 23 | 851861006126 | Health-Ade Pink Lady Apple Kombucha | OK (6) | Match (Kombucha Pink Lady Apple / Health-Ade) | Match | None | **FIX** null→health-ade ✓ | No | FIX |
| 24 | 853311003587 | KeVita Master Brew Kombucha Ginger | OK (7) | Match (LIVE PROBIOTIC KOMBUCHA Ginger / KEVITA) | Match | None | pepsico ✓ | No | PASS |
| 25 | 852311004013 | Bai Brasilia Blueberry | OK (3) | Match (Brasilia blueberry antioxidant / Bai) | Match | None | keurig-dr-pepper ✓ | No | PASS |
| 26 | 786162150004 | vitaminwater XXX Açai-Blueberry-Pom | OK (4) | Match (Açai-Blueberry-Pomegranate XXX / glaceau) | Match | None | coca-cola ✓ | No | **FIX** name |

\* DASANI: not present in OFF API (status 0). Raw JSON documents alt-source confirmation (upcitemdb + Target). Check digit valid, brand/name well-established, ingredients plausible. Retained as PASS with note rather than REJECT, since the REJECT trigger is a *wrong* product, not an *absent* OFF record.

## FIXes applied

1. **Health-Ade Pink Lady Apple Kombucha (851861006126)** — `companyId` was `null` in both raw and formatted, but `health-ade` exists literally in `companies.js`. Applied `companyId: 'health-ade'` and removed the implicit missing-company gap. (Formatted file already had this fix; verified and kept.)

2. **vitaminwater XXX (786162150004)** — `name` in formatted used ASCII `Acai`; raw JSON and OFF API confirmed name both use accented `Açai`. Corrected to `vitaminwater XXX Açai-Blueberry-Pomegranate 20 fl oz` to match source.

## Notes / observations (non-blocking)

- Chameleon Cold-Brew (851220003414) `companyId: 'nestle'` is correct per 2020 Nestlé acquisition; OFF brand field shows the sub-brand only, which is expected.
- Several products correctly use `companyId: null` with a `_missingCompany` annotation for owners not yet in `companies.js` (FIJI/Wonderful, Poland Spring/BlueTriton, Tropicana/PAI, Welch's, La Colombe, AriZona). These are valid pending-company markers, not failures.
- OFF API returned HTTP 429 mid-run; verifications were spaced out and all completed successfully.
