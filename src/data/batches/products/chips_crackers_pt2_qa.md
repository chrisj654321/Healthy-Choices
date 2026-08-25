# QA Report — chips_crackers_pt2

**Reviewed:** 2026-06-14
**Reviewer:** Independent QA (automated)
**Inputs:** `chips_crackers_pt2_formatted.js`, `chips_crackers_pt2_raw.json`, `products.js` (dup check), `companies.js` (companyId verification)
**Products in batch:** 20

## Summary

| Verdict | Count |
|---------|-------|
| PASS    | 17    |
| FIX     | 2     |
| REJECT  | 1     |

- All 20 UPCs checked against `products.js`: **no duplicates**.
- UPC-A mod-10 check digit: 19 valid, 1 invalid (081878001343).
- Ingredient order: every `ingredients` array matches `ingredients_verbatim` exactly.
- Medical-claim scan (causes/prevents/cures/treats/toxic/carcinogenic/linked-to-disease): **none found** in any product field.
- Schema: complete and consistent; key == `barcode` field for all 20.
- All 5 referenced companyIds (`pepsico`, `b-and-g-foods`, `utz-brands`, `conagra`, `hain-celestial`) exist literally in `companies.js`. Two assignments are nonetheless incorrect for 2026 ownership (see FIX).

## OFF API spot-checks (name/brand confirmation)

| UPC | OFF product_name | OFF brands | Match |
|-----|------------------|------------|-------|
| 082666500803 | Popchips Sea Salt | Popchips | ✓ |
| 028400183826 | Baked Original | Lay's | ✓ |
| 851769007010 | Grain Free Tortilla Chips | Siete | ✓ |
| 015665601004 | Pirate& booty aged white cheddar puffs | Pirate's Booty | ✓ |
| 708163120589 | Avocado Oil Classic Sea Salt Kettle Style Potato Chips | Boulder Canyon | ✓ |
| 015839000015 | Blue Chips Corn Tortilla Chips | Garden Of Eatin' | ✓ |
| 897580000106 | Original Crackers | Mary's Organic | ✓ |
| 081878001343 | — | — | HTTP 404 (not found) |

## Verdicts

| # | UPC | Product | Verdict |
|---|-----|---------|---------|
| 1 | 082666500803 | Popchips Original Sea Salt Potato Chips | PASS |
| 2 | 028400183826 | Lay's Oven Baked Original Potato Crisps | PASS |
| 3 | 071146002456 | Harvest Snaps Green Pea Snack Crisps Lightly Salted | PASS |
| 4 | 851769007010 | Siete Lime Grain Free Tortilla Chips | FIX [companyId: siete-family-foods] |
| 5 | 015665601004 | Pirate's Booty Aged White Cheddar Puffs | FIX [companyId: hershey] |
| 6 | 708163120589 | Boulder Canyon Avocado Oil Classic Sea Salt Kettle Chips | PASS |
| 7 | 810122080015 | Hippeas Organic Chickpea Puffs Groovy White Cheddar | PASS |
| 8 | 081878001343 | Angie's BOOMCHICKAPOP Sea Salt Popcorn | REJECT |
| 9 | 856369004087 | Quinn Butter & Sea Salt Microwave Popcorn 2-pack | PASS |
| 10 | 856762007401 | LesserEvil Himalayan Pink Salt Paleo Puffs | PASS |
| 11 | 028400064088 | Tostitos Scoops! Tortilla Chips | PASS |
| 12 | 028400705769 | Santitas White Corn Tortilla Chips | PASS |
| 13 | 015839000015 | Garden of Eatin' Blue Corn Tortilla Chips | PASS |
| 14 | 855564003024 | Way Better Snacks Simply Sweet Potato Tortilla Chips | PASS |
| 15 | 028400630658 | Off The Eaten Path Rice, Peas & Black Beans Veggie Crisps | PASS |
| 16 | 028400092173 | Stacy's Simply Naked Pita Chips | PASS |
| 17 | 856069005155 | Simple Mills Almond Flour Crackers Farmhouse Cheddar | PASS |
| 18 | 897580000106 | Mary's Gone Crackers Original Crackers | PASS |
| 19 | 036593110055 | RW Garcia 3 Seed Sweet Potato Crackers | PASS |
| 20 | 852834002008 | Beanitos Black Bean Chips Original Sea Salt | PASS |

## FIX detail

### #4 — Siete Lime Grain Free Tortilla Chips (851769007010)
- **Field:** `companyId`
- **As submitted:** `'pepsico'`
- **Corrected to:** `'siete-family-foods'`
- **Reason:** A dedicated brand-level entry `siete-family-foods` exists in `companies.js` (id `'siete-family-foods'`, name "Siete Family Foods (PepsiCo)") and already encodes the Jan 2025 $1.2B PepsiCo acquisition plus Siete-specific issues. Assigning the generic parent `pepsico` is not wrong about ultimate ownership but discards the more specific, available subsidiary record. Use the dedicated entry.

### #5 — Pirate's Booty Aged White Cheddar Puffs (015665601004)
- **Field:** `companyId`
- **As submitted:** `'b-and-g-foods'`
- **Corrected to:** `'hershey'`
- **Reason:** B&G Foods' `subsidiaries` list does NOT include Pirate's Booty, and B&G has never owned the brand. Pirate Brands (Pirate's Booty, SkinnyPop) is owned by **The Hershey Company** (acquired via Amplify Snack Brands, 2018); Hershey's `subsidiaries` list explicitly contains "Pirate Brands" and "SkinnyPop". Reassigned to the existing `'hershey'` entry, which reflects 2026 ownership.

## REJECT detail

### #8 — Angie's BOOMCHICKAPOP Sea Salt Popcorn (081878001343)
- **Reason:** Invalid UPC-A. Mod-10 check digit fails: the supplied final digit is `3`, but the correct check digit for `08187800134x` is `4` (valid would be `081878001344`). OpenFoodFacts returns **HTTP 404** for the supplied barcode, and the raw JSON itself flagged this product under `could_not_verify` ("UPC confirmed via Kroger… but not found in OpenFoodFacts"). The barcode as submitted cannot be trusted as a scan key. Reject pending a verified barcode (likely `081878001344`, but that must be confirmed against the actual product before inclusion).
- **Note:** Criteria B (ingredient order) and C (no medical claims) pass for this item; the reject is solely on barcode integrity (A/E).
