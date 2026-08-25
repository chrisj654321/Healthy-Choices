# Beverages PT1 Re-research — Independent QA Report

**Date:** 2026-06-12
**Batch:** beverages_pt1 (13 products; 4 prior-passed sodas excluded by design)
**Result:** 13 PASS / 0 FIX / 0 REJECT

## Checklist applied per product
- A. UPC-A mod-10 check digit math + OFF API v2 product/brand confirmation
- B. Formatted ingredients array vs `ingredients_verbatim`, order preserved
- C. Medical-claim scan (causes/prevents/cures/treats/toxic/carcinogenic/linked to disease)
- D. companyId exists literally in companies.js + reflects 2026 ownership
- E. Schema completeness; barcode key == barcode field
- F. No duplicate in products.js

## Cross-cutting verification
- **Duplicate scan (F):** grep of all 13 barcodes against `src/data/products.js` returned zero matches. No duplicates.
- **companyId existence (D):** confirmed present in companies.js — `pepsico` (L73), `coca-cola` (L122), `unilever` (L277), `keurig-dr-pepper` (L1749), `monster-beverage` (L1806), `red-bull` (L1863), `celsius-holdings` (L1912). OLIPOP / Zevia / Spindrift have no company entry → `companyId: null` (correct).
- **celsius-holdings ownership:** companies.js L1949 `subsidiaries: ['Celsius','Bang Energy','Alani Nu']` — confirms Celsius, Bang, and Alani Nu all map to `celsius-holdings` (Alani Nu acquired Aug 2024, Bang via Vital Pharmaceuticals 2023).
- **Medical claims (C):** none found in any formatted ingredient array. (Note: companies.js itself contains FTC-claim *descriptions* re: Bang, but those are issue records, not product data — out of scope.)
- **Check digits (A):** all 13 computed valid via mod-10.

## Per-product verdicts

| # | UPC | Product | Check digit | OFF name / brand | companyId | Verdict |
|---|-----|---------|-------------|------------------|-----------|---------|
| 1 | 012000809965 | Mountain Dew Original Soda | OK | "Soda regular…" / Mountain Dew | pepsico | **PASS** |
| 2 | 078000082166 | Dr Pepper Original Soda | OK | "Dr Pepper Soda" / Dr. Pepper | keurig-dr-pepper | **PASS** |
| 3 | 860439001012 | OLIPOP Strawberry Vanilla Prebiotic Soda | OK | "Strawberry Vanilla" / Olipop | null | **PASS** |
| 4 | 810063710293 | Poppi Classic Cola Prebiotic Soda | OK | "Classic Cola Prebiotic Soda" / Poppi | pepsico | **PASS** |
| 5 | 894773001018 | Zevia Zero Calorie Soda Cola | OK | "Zero Calorie Soda - Cola…" / Zevia | null | **PASS** |
| 6 | 856579002316 | Spindrift Raspberry Lime Sparkling Water | OK | "Raspberry Lime Sparkling Water…" / Spindrift | null | **PASS** |
| 7 | 611269991000 | Red Bull Original Energy Drink | OK | "Energy Drink" / Red Bull | red-bull | **PASS** |
| 8 | 070847811169 | Monster Energy Original Green | OK | "Monster Energy" / Monster | monster-beverage | **PASS** |
| 9 | 889392000313 | Celsius Sparkling Orange Functional Energy Drink | OK | "SPARKLING ORANGE" / CELSIUS | celsius-holdings | **PASS** |
| 10 | 810030512257 | Alani Nu Energy Cherry Slush | OK | "Cherry Slush" / Alani Nu | celsius-holdings | **PASS** |
| 11 | 610764000316 | Bang Energy Cotton Candy | OK | "Cotton candy energy drink" / (empty in OFF) | celsius-holdings | **PASS** |
| 12 | 858176002324 | BodyArmor Fruit Punch Sports Drink | OK | "Fruit Punch Sports Drink" / BODYARMOR | coca-cola | **PASS** |
| 13 | 851741008455 | Liquid I.V. Hydration Multiplier Lemon Lime | OK | "Lemon Lime" / Liquid I.V. | unilever | **PASS** |

## Notes (non-blocking, acceptable)
- **#3 OLIPOP (B):** raw JSON nests 7 OLISMART components inside a parenthetical proprietary blend; formatted array correctly flattens them in-sequence after "Carbonated Water". Order preserved.
- **#11 Bang (B):** OFF brand field is empty; raw JSON confirms brand via upcitemdb. Formatted strips parenthetical descriptors (e.g. "[Creatine Bonded to L-Leucine]", "Preserves Freshness") — descriptors, not ingredients. Order preserved.
- **#4 Poppi (D):** assigned `companyId: 'pepsico'` reflecting PepsiCo's March 2024 acquisition of Poppi — correct 2026 ownership.
- **#13 Liquid I.V. (D):** `unilever` reflects 2020 acquisition — correct.
- Products excluded by upstream re-research (`could_not_verify`): Powerade Mountain Berry Blast 32oz (OFF 404), Pedialyte Sport Fruit Punch 12oz (SKU does not exist). Correctly withheld.

## Output
- `src/data/batches/products/beverages_pt1_reresearched_reviewed.js` — all 13 PASS entries.
