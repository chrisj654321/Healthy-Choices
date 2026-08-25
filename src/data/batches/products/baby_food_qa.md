# Baby Food — QA Review Report

**Reviewer:** Agent 3 (independent QA)
**Date:** 2026-06-16
**Source:** `baby_food_formatted.js` reviewed against `baby_food_raw.json`

## Summary

| Metric | Count |
|---|---|
| Products in raw (total) | 19 |
| Raw `off_verified: true` | 15 |
| Raw `off_verified: false` (correctly excluded) | 4 |
| Products in formatted | 15 |
| Products in reviewed (output) | 15 |
| **PASS** | 15 |
| **FIX** (data value changes) | 0 |
| **REJECT** (removed) | 0 |

All 15 included products are the off_verified-true set. The 4 off_verified-false
products (Sprout Apple Banana Butternut Squash, Beech-Nut Pineapple Pear & Avocado,
Happy Tot Love My Veggies, Gerber Organic Apple Zucchini Spinach Strawberry) were
correctly excluded by the writer.

## Checklist results (all products)

- **A. UPC-A check digit:** 15/15 valid (standard odd×3 / even×1 mod-10).
- **A. OFF API re-verification:** 15/15 returned `status:1` (found). Product names align.
- **B. Ingredient accuracy:** 15/15 accurate; order preserved, all lowercase, no items lost. Acceptable normalizations only (see notes).
- **C. Medical-claim scan:** PASS. No claim language in any source field. Formatted records carry no marketing/description fields, so zero claim-language surface.
- **D. companyId:** all correct — Gerber→`nestle`, Earth's Best→`hain-celestial`, Happy Baby/Happy Tot→`danone`, Plum→`campbell`, Beech-Nut→`null` + `_missingCompany`. All non-null keys confirmed present in `companies.js`; `beech-nut` confirmed NOT a key.
- **E. Schema:** 15/15 complete. Outer barcode key == inner `barcode` field in every record.
- **F. Duplicates:** 15/15 absent from `MANUAL_PRODUCTS` in `products.js`.

## Per-product verdicts

| Barcode | Name | Verdict | Note |
|---|---|---|---|
| 015000048303 | Gerber Lil' Crunchies Mild Cheddar | PASS | Raw OCR comma `mixed, tocopherols` correctly merged to `mixed tocopherols`; `vitamins and minerals:` prefix and `contains: milk` allergen line dropped (correct). |
| 015000045203 | Gerber Puffs Strawberry Apple | PASS | `vitamins and minerals:` prefix normalized out. |
| 023923330351 | Earth's Best Sweet Potato & Beets | PASS | Exact match. |
| 023923236028 | Earth's Best Sesame Street Veggie Puffs | PASS (minor) | Raw lists `organic sunflower oil` twice (pos 2 & 8); de-duplicated by writer. Source duplicate is an artifact — de-dup retained. |
| 890180001894 | Plum Organics Just Prunes | PASS | Exact match. |
| 890180001191 | Plum Organics Pear Spinach & Pea | PASS | Exact match. |
| 890180001238 | Plum Organics Banana + Pumpkin | PASS | Exact match. |
| 052200076224 | Beech-Nut Organics Prune & Pear | PASS | companyId null + `_missingCompany` correct. |
| 052200011058 | Beech-Nut Fruities Pear Banana & Raspberries | PASS | companyId null + `_missingCompany` correct. |
| 852697001408 | Happy Baby Broccoli Pears & Peas | PASS | Exact match. |
| 852697001378 | Happy Baby Bananas Beets & Blueberries | PASS | Exact match. |
| 852697001743 | Happy Baby Pears Mangos & Spinach | PASS | Exact match. |
| 819573017571 | Happy Baby Sweet Potatoes Blueberries & Beets | PASS | `<1% of:` qualifier normalized out; ingredients intact. |
| 819573011579 | Happy Tot Super Foods Pears Beets & Blueberries + Chia | PASS | Exact match. |
| 819573013269 | Happy Baby Bananas Raspberries & Oats | PASS | `<2% of:` qualifier normalized out; ingredients intact. |

## Conclusion

The writer's output is accurate and trustworthy. No data corrections or removals were
required. `baby_food_reviewed.js` is identical to `baby_food_formatted.js` apart from an
updated header comment documenting the review.
