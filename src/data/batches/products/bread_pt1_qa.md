# QA Report — bread_pt1

**Reviewed:** 2026-06-13
**Source:** `bread_pt1_formatted.js` vs `bread_pt1_raw.json`
**Result:** 14 products reviewed — **6 PASS · 5 FIX · 3 REJECT** (11 entries written to `bread_pt1_reviewed.js`)

## Checks applied
- **A. Barcode** — UPC-A mod-10 check digit computed; Open Food Facts API (`/api/v2/product/[upc].json`) confirmed for product name + brand.
- **B. Ingredients** — formatted array compared element-by-element against `ingredients_verbatim` (order included).
- **C. Medical claims** — scanned for causes/prevents/cures/treats/toxic/carcinogenic/disease language.
- **D. companyId** — must exist literally in `companies.js`; 2026 ownership applied.
- **E. Schema** — required fields present; object key == `barcode` field.
- **F. Duplicates** — checked against `products.js` (no matches for any of the 14 barcodes).

All 14 check digits valid. All 14 OFF lookups returned a matching product/brand. No medical claims found. No ingredient-order mismatches. No duplicate barcodes.

The only systemic defect is **companyId**: the formatted file assigned `flowers-foods` to Wonder (a Bimbo brand) and left four Bimbo/Conagra brands as `null` with `_missingCompany` placeholders even though valid company entries (`bimbo`, `conagra`) exist in `companies.js`. Three products belong to companies with no entry in `companies.js` and are rejected.

## Per-product table

| # | UPC | Product | Chk | OFF match | Ingredients | Med claims | companyId (formatted → verdict) | Dup | Verdict |
|---|-----|---------|-----|-----------|-------------|-----------|----------------------------------|-----|---------|
| 1 | 072250011372 | Wonder Classic White 20oz | OK (2) | "Classic White Bread" / Wonder ✓ | match | none | `flowers-foods` → **`bimbo`** | no | **FIX companyId: bimbo** |
| 2 | 072250037068 | Nature's Own Honey Wheat 20oz | OK (8) | "Honey Wheat Bread" / Nature's Own ✓ | match | none | `flowers-foods` ✓ | no | **PASS** |
| 3 | 073410003053 | Arnold Country White 24oz | OK (3) | "Country style white" / Arnold ✓ | match | none | `null` (_missingCompany Bimbo) → **`bimbo`** | no | **FIX companyId: bimbo** |
| 4 | 072945601345 | Sara Lee 100% Whole Wheat 20oz | OK (5) | "100% Whole Wheat Bread" / Sara Lee ✓ | match | none | `null` (_missingCompany Bimbo) → **`bimbo`** | no | **FIX companyId: bimbo** |
| 5 | 013764027053 | Dave's Killer 21 Grains 27oz | OK (3) | "Organic Bread 21 Whole Grains and Seeds" / Dave's Killer Bread ✓ | match | none | `flowers-foods` ✓ | no | **PASS** |
| 6 | 013764027282 | Dave's Killer Powerseed 25oz | OK (2) | "Powerseed Organic Bread" / Dave's Killer Bread ✓ | match | none | `flowers-foods` ✓ | no | **PASS** |
| 7 | 014100070832 | Pepperidge Farm Hearty White 24oz | OK (2) | "Hearty White Bread" / Pepperidge Farm ✓ | match | none | `campbell` ✓ | no | **PASS** |
| 8 | 073472001202 | Food For Life Ezekiel 4:9 24oz | OK (2) | "EZEKIEL 4:9 FLOURLESS SPROUTED GRAIN BREAD" / Food For Life ✓ | match | none | `food-for-life` ✓ | no | **PASS** |
| 9 | 048121103071 | Thomas' Original English Muffins 12ct | OK (1) | "Original" / Thomas' ✓ | match | none | `null` (_missingCompany Bimbo) → **`bimbo`** | no | **FIX companyId: bimbo** |
| 10 | 075185000046 | Martin's Famous Potato Rolls 12ct | OK (6) | "Potato Rolls" / Martin's ✓ | match | none | `null` (_missingCompany Martin's Famous Pastry Shoppe) | no | **REJECT** |
| 11 | 073435000044 | King's Hawaiian Sweet Rolls 12ct | OK (4) | "ORIGINAL HAWAIIAN SWEET ROLLS" / King's Hawaiian ✓ | match | none | `null` (_missingCompany King's Hawaiian Holding) | no | **REJECT** |
| 12 | 853584002010 | Canyon Bakehouse GF 7-Grain 18oz | OK (0) | "7-Grain Bread" / Canyon Bakehouse ✓ | match | none | `flowers-foods` ✓ | no | **PASS** |
| 13 | 698997809166 | Udi's GF Whole Grain 12oz | OK (6) | "Udi's, soft & hearty whole grain bread" / Udi's ✓ | match | none | `null` (_missingCompany Boulder Brands/TreeHouse — **incorrect**) → **`conagra`** | no | **FIX companyId: conagra** |
| 14 | 851921006547 | Sola Sweet & Buttery 14oz | OK (7) | "Sweet & Buttery Soft White Bread" / Sola ✓ | match | none | `null` (_missingCompany Sola Company) | no | **REJECT** |

## FIX details

- **#1 Wonder** — formatted assigned `flowers-foods`, but Wonder is a Bimbo Bakeries USA (Grupo Bimbo) brand. Raw JSON correctly had `bimbo`. Corrected to `bimbo` (entry exists at companies.js id `bimbo`).
- **#3 Arnold / #4 Sara Lee / #9 Thomas'** — formatted left these `null` with `_missingCompany: 'Bimbo Bakeries USA'`, but a valid `bimbo` entry exists in companies.js. All Bimbo Bakeries brands. Corrected to `bimbo`.
- **#13 Udi's** — formatted `_missingCompany` claimed "Boulder Brands (TreeHouse Foods)". This is wrong: Boulder Brands → Pinnacle Foods (2016) → **Conagra Brands** (Pinnacle acquisition, 2018). As of 2026 Udi's is a Conagra brand. `conagra` exists in companies.js. Corrected to `conagra`.

## REJECT details

The QA rule requires `companyId` to exist **literally** in `companies.js`. The following parent companies have no entry under any name (searched: martins, kings-hawaiian, sola, and full-name variants):

- **#10 Martin's Famous Potato Rolls** — Martin's Famous Pastry Shoppe (private, family-owned). No entry. REJECT.
- **#11 King's Hawaiian Sweet Rolls** — King's Hawaiian Holding Company (private). No entry. REJECT.
- **#14 Sola Sweet & Buttery Bread** — Sola Company (independent). No entry. REJECT.

These three pass barcode, OFF, ingredient, medical-claim, schema, and duplicate checks — the sole blocker is the missing company. They can be promoted to PASS once corresponding entries are added to `companies.js`.

## Notes carried from raw `could_not_verify`
The raw JSON already dropped four candidates (Franz Great White, Martin's 15ct, Canyon Heritage 18oz, Udi's single-loaf UPC) for unverifiable UPCs; no action required — they are not in the formatted set.
