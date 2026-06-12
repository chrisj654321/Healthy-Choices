# Yogurt Batch — QA Review

**Date:** 2026-06-12
**Reviewer:** QA (independent)
**Result:** 0 PASS · 0 FIX · **24 REJECT**
**Merge-ready entries written to `yogurt_reviewed.js`:** none

---

## CRITICAL / BATCH-LEVEL FINDING — all barcodes are fabricated

Every barcode in this batch is a **sequential placeholder**, not a real UPC:

```
001010000021, 001010000038, 001010000045, 001010000052, ... 001010000242
```

They increment by 7 in lockstep with the array index. Two independent checks fail for **all 24**:

1. **Check-digit math (UPC-A mod-10):** every barcode fails. Spot results:
   - `001010000021` → calc check digit **8**, actual **1** → BAD
   - `001010000038` → calc **5**, actual **8** → BAD
   - `001010000242` → calc **0**, actual **2** → BAD
   - (full sweep: 24/24 BAD)
2. **Existence:** no barcode resolves to a product on Open Food Facts / barcode databases. Real products from these brands use genuine GS1 prefixes — e.g. real Dannon UPCs are `036632xxxxxx`, not `00101000xxxx`.

Per the checklist rule **"Wrong check digit = REJECT,"** none of these entries may enter `products.js` (which uses real, mostly-valid barcodes). The entire batch must be **re-researched with real scanned UPCs** before it can pass.

Because the barcode is a hard REJECT for every row, the remaining checks below are recorded as **fix-on-redo notes** so the re-research pass can correct them at the same time. None of them change the verdict.

---

## Cross-cutting fix-on-redo notes (apply during re-research)

### companyId — keys NOT present in `companies.js`
Verified present keys: `danone, fage, lactalis, chobani, oatly, general-mills, kite-hill, forager-project`.

- **`forager` (Forager Project, #145):** the raw JSON used `forager`; the formatted file then nulled it as "not found." But **`forager-project` DOES exist** in `companies.js` (line 7277). Correct key is **`forager-project`** — not null. This is the one genuine FIX that the formatter got wrong in the other direction.
- **`noosa` (#90):** not in `companies.js`. Formatter correctly nulled with `_missingCompany`. Add company or keep null.
- **`lifeway-foods` (#204):** not in `companies.js`. Formatter correctly nulled. (Lifeway Foods, independent, NASDAQ: LWAY.)
- **`yakult-usa` (#228):** not in `companies.js`. Formatter correctly nulled. (Yakult Honsha Co., Japan.)
- **Green Valley Creamery (#242):** null in raw + formatted. Parent is Redwood Hill Farm & Creamery — no key in `companies.js`. Keep null or add.

### companyId — WRONG owner (ownership error in BOTH raw and formatted)
- **Stonyfield (#45 Strawberry, #197 YoBaby):** assigned `danone`. **Stonyfield has been owned by Lactalis since 2017** (Danone divested it for $875M). Correct key is **`lactalis`**, not `danone`.
- **YoCrunch (#180):** assigned `danone`. YoCrunch was part of the same 2017 Danone→Lactalis divestiture. Should be re-verified; likely **`lactalis`**.
- (Siggi's #83 `lactalis` — correct. Two Good/Activia/Oikos/Danimals/Silk/So Delicious `danone` — correct.)

### Other
- **Duplicate check:** PASS for the whole batch — none of these barcodes appear in `products.js` (51 existing entries checked). (Moot, since barcodes are fake.)
- **Medical-claims scan:** PASS — no trigger words (causes/prevents/cures/treats/toxic/carcinogenic/linked to disease) in any product field. (The `notes` field from raw is dropped in the formatted output, which is correct.)
- **Ingredient lists:** formatted arrays match `ingredients_verbatim` in the raw JSON exactly (order, additions, omissions) for all 24. No ingredient FIX needed.
- **Schema:** formatted entries are well-formed and `barcode` key == `barcode` field for all 24. (#197 raw has a stray indentation on `isGlutenFree` but value is correct.) The `_missingCompany` annotation key the formatter added is non-schema; acceptable as a TODO marker but strip before merge.

---

## Per-product verdicts

| # | Barcode | Product | Verdict | Notes |
|---|---------|---------|---------|-------|
| 1 | 001010000021 | Dannon Strawberry Lowfat | **REJECT** | Fake barcode (chk 8≠1); not on OFF. companyId `danone` OK. |
| 2 | 001010000038 | Activia Vanilla Lowfat | **REJECT** | Fake barcode (chk 5≠8). companyId `danone` OK. |
| 3 | 001010000045 | Stonyfield Org. Strawberry | **REJECT** | Fake barcode (chk 2≠5). Also companyId WRONG: `danone`→`lactalis`. |
| 4 | 001010000052 | Wallaby Org. Strawberry | **REJECT** | Fake barcode (chk 9≠2). companyId `danone` — verify (Wallaby divested by Danone). |
| 5 | 001010000069 | Fage Total 0% Plain | **REJECT** | Fake barcode (chk 6≠9). companyId `fage` OK. |
| 6 | 001010000076 | Oikos Triple Zero Vanilla | **REJECT** | Fake barcode (chk 3≠6). companyId `danone` OK. |
| 7 | 001010000083 | Siggi's 0% Plain Skyr | **REJECT** | Fake barcode (chk 0≠3). companyId `lactalis` OK. |
| 8 | 001010000090 | Noosa Strawberry | **REJECT** | Fake barcode (chk 7≠0). companyId null — no `noosa` key. |
| 9 | 001010000107 | Two Good Strawberry | **REJECT** | Fake barcode (chk 3≠7). companyId `danone` OK. |
| 10 | 001010000114 | So Delicious Coconut Vanilla | **REJECT** |Jake barcode (chk 0≠4). companyId `danone` OK. |
| 11 | 001010000121 | Kite Hill Plain Almond | **REJECT** | Fake barcode (chk 7≠1). companyId `kite-hill` OK. |
| 12 | 001010000138 | Silk Almondmilk Strawberry | **REJECT** | Fake barcode (chk 4≠8). companyId `danone` OK. |
| 13 | 001010000145 | Forager Cashewmilk Plain | **REJECT** | Fake barcode (chk 1≠5). companyId wrongly nulled — should be `forager-project` (key exists). |
| 14 | 001010000152 | Oatly Oat Milk Plain | **REJECT** | Fake barcode (chk 8≠2). companyId `oatly` OK. |
| 15 | 001010000159 | Danimals Strawberry Smoothie | **REJECT** | Fake barcode (chk 8≠9). companyId `danone` OK. |
| 16 | 001010000166 | GoGurt Strawberry | **REJECT** | Fake barcode (chk 5≠6). companyId `general-mills` OK. |
| 17 | 001010000173 | Chobani Kids Tube | **REJECT** | Fake barcode (chk 2≠3). Raw nulled companyId; `chobani` key exists → should be `chobani` (formatter set it, fine). |
| 18 | 001010000180 | YoCrunch Strawberry w/ Oreo | **REJECT** | Fake barcode (chk 9≠0). companyId `danone` — likely WRONG, →`lactalis`. |
| 19 | 001010000197 | Stonyfield YoBaby Vanilla | **REJECT** | Fake barcode (chk 6≠7). companyId WRONG: `danone`→`lactalis`. |
| 20 | 001010000204 | Lifeway Kefir Plain | **REJECT** | Fake barcode (chk 2≠4). companyId null — no `lifeway-foods` key. |
| 21 | 001010000211 | Chobani Probiotic Drink | **REJECT** | Fake barcode (chk 9≠1). Raw nulled; `chobani` key exists → `chobani` (formatter set it, fine). |
| 22 | 001010000228 | Yakult Original | **REJECT** | Fake barcode (chk 6≠8). companyId null — no `yakult-usa` key. |
| 23 | 001010000235 | Activia Dailies Strawberry | **REJECT** | Fake barcode (chk 3≠5). companyId `danone` OK. |
| 24 | 001010000242 | Green Valley Creamery Kefir | **REJECT** | Fake barcode (chk 0≠2). companyId null (Redwood Hill) — no key. |

---

## Recommendation

Send the entire batch back to research. The blocking defect is upstream in `yogurt_raw.json`: the researcher populated `barcode` with synthetic sequential IDs rather than real scanned UPCs. No amount of formatting or per-field fixing makes these entries safe to merge into `products.js`. On re-research, also apply the companyId corrections above (especially `forager-project`, and Stonyfield/YoCrunch → `lactalis`).
