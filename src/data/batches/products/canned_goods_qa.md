# Canned Goods — QA Review Report

**Reviewer:** Agent 3 (QA)
**Date:** 2026-06-15
**Source:** `canned_goods_formatted.js` reviewed against `canned_goods_raw.json`

## Summary

| Metric | Count |
|---|---|
| Products reviewed | 20 |
| PASS | 20 |
| FIX applied | 0 |
| REJECT (removed) | 0 |

All 20 products passed the full QA checklist. No corrections were required;
`canned_goods_reviewed.js` is byte-identical to the formatted file plus a QA header.

## Checklist results

**A. UPC-A check digit (mod-10):** All 20 barcodes valid. Weights applied as
odd-position(1-indexed)×3 + even-position×1, divisible by 10. All `off_verified: true`
in the raw research file.

**B. Ingredient array accuracy:** All arrays match `ingredients_verbatim` in order,
completeness, and lowercase. Quantity wrappers ("less than 2% of:", "Contains 2% or
Less of:") were correctly stripped while preserving every ingredient and its order
(Hunt's, Bush's, Ro-Tel). No omissions or reorderings found.

**C. Medical claim scan:** No causes/prevents/cures/treats/toxic/carcinogen language
anywhere in the file. PASS.

**D. companyId verification:**
- All non-null companyIds (`campbell`, `general-mills`, `amy-kitchen`, `conagra`,
  `nestle`, `mccormick`, `b-and-g-foods`, `goya-foods`, `eden-foods`,
  `del-monte-foods`) confirmed present as literal keys in `src/data/companies.js`.
- Ownership mappings correct: Campbell's + Pacific Foods → `campbell`;
  Progresso + Muir Glen → `general-mills`; Hunt's + Ro-Tel → `conagra`;
  Libby's → `nestle`; Thai Kitchen → `mccormick`; Green Giant corn → `b-and-g-foods`.
- All null companyIds carry a `_missingCompany` string: Bush's (Bush Brothers & Company),
  StarKist, Bumble Bee, Wild Planet, Crown Prince, Native Forest (Edward & Sons).
  None of these IDs exist in companies.js, so null is correct.

**E. Schema completeness:** All 14 required fields present on all 20 products.
Outer barcode key == inner `barcode` field on every entry.

**F. Duplicate check:** None of the 20 barcodes appear in `src/data/products.js`
(MANUAL_PRODUCTS). No duplicates.

## Per-product verdicts

| # | Barcode | Product | companyId | Verdict |
|---|---|---|---|---|
| 1 | 051000000118 | Campbell's Condensed Tomato Soup | campbell | PASS |
| 2 | 052603041201 | Pacific Foods Organic Creamy Tomato Soup | campbell | PASS |
| 3 | 041196010886 | Progresso Traditional Chicken Noodle Soup | general-mills | PASS |
| 4 | 042272005024 | Amy's Organic Lentil Soup | amy-kitchen | PASS |
| 5 | 042272005048 | Amy's Organic Black Bean Vegetable Soup | amy-kitchen | PASS |
| 6 | 027000380406 | Hunt's Diced Tomatoes | conagra | PASS |
| 7 | 725342260713 | Muir Glen Organic Diced Tomatoes | general-mills | PASS |
| 8 | 039400016144 | Bush's Best Original Baked Beans | null (_missingCompany) | PASS |
| 9 | 041331124669 | Goya Black Beans | goya-foods | PASS |
| 10 | 024182002539 | Eden Organic Black Beans | eden-foods | PASS |
| 11 | 024000163084 | Del Monte Sweet Peas | del-monte-foods | PASS |
| 12 | 020000104737 | Green Giant Whole Kernel Sweet Corn | b-and-g-foods | PASS |
| 13 | 080000006738 | StarKist Chunk Light Tuna in Water | null (_missingCompany) | PASS |
| 14 | 086600000053 | Bumble Bee Solid White Albacore Tuna | null (_missingCompany) | PASS |
| 15 | 829696000534 | Wild Planet Wild Albacore Tuna | null (_missingCompany) | PASS |
| 16 | 073230008511 | Crown Prince Smoked Oysters | null (_missingCompany) | PASS |
| 17 | 737628011506 | Thai Kitchen Coconut Milk Unsweetened | mccormick | PASS |
| 18 | 043182002080 | Native Forest Organic Classic Coconut Milk | null (_missingCompany) | PASS |
| 19 | 064144282432 | Ro-Tel Original Diced Tomatoes & Green Chilies | conagra | PASS |
| 20 | 039000045049 | Libby's 100% Pure Pumpkin | nestle | PASS |

## Notes / observations (non-blocking)

- Six products are missing company entries in `companies.js` (Bush Brothers,
  StarKist/Dongwon, Bumble Bee Foods, Wild Planet Foods, Crown Prince, Edward & Sons).
  The writer correctly flagged each via `_missingCompany`. Adding these companies
  would let the products surface ownership data, but null is schema-valid for now.
