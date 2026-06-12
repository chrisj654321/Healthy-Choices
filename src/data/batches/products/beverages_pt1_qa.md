# QA Report — beverages_pt1

**Date:** 2026-06-12
**Reviewer:** Independent QA (Claude Code)
**Result:** 4 PASS, 0 FIX, 16 REJECT

## Method notes

- UPC-A check digit computed via GS1 mod-10 (odd-position digits ×3 + even-position digits, mod 10, subtracted from 10). Algorithm validated against the GS1 textbook example `036000291452` → check digit 2.
- Per checklist rule A.1, a wrong check digit is an automatic REJECT: a barcode that fails its own check digit is not scannable and cannot be a valid GS1 UPC-A.
- Existing `products.js` (52 products) scanned for all 20 barcodes: **no duplicates** found.
- `companies.js` checked for every `companyId`. Notably there is **no `celsius` key** in companies.js — the writer had already correctly set Bang/Celsius/Alani Nu to `companyId: null` (raw JSON had proposed `celsius`).
- Product `notes` fields from the raw JSON were correctly dropped during formatting, so no medical-claim trigger words reached product fields.

## Per-product verdicts

| # | Product | Barcode | Check digit | Verdict |
|---|---------|---------|-------------|---------|
| 1 | Coca-Cola Classic 12oz | 049000050127 | OK (7) | **PASS** |
| 2 | Pepsi Cola 12oz | 012000084508 | OK (8) | **PASS** |
| 3 | Mountain Dew 12oz | 012000041755 | BAD (given 5, expected 4) | **REJECT** |
| 4 | Dr Pepper 12oz | 078600000438 | BAD (given 8, expected 0) | **REJECT** |
| 5 | Sprite 12oz | 049000050479 | OK (9) | **PASS** |
| 6 | Olipop Strawberry Vanilla 12oz | 855586005254 | BAD (given 4, expected 9) | **REJECT** |
| 7 | Poppi ACV Soda 12oz | 850058003057 | BAD (given 7, expected 4) | **REJECT** |
| 8 | Zevia Cola 12oz | 721670117129 | BAD (given 9, expected 5) | **REJECT** |
| 9 | Spindrift Raspberry Lime 12oz | 722252041411 | BAD (given 1, expected 8) | **REJECT** |
| 10 | Olipop Classic Grape 12oz | 855586007849 | BAD (given 9, expected 0) | **REJECT** |
| 11 | Red Bull Original 8.4oz | 010900000005 | BAD (given 5, expected 0) | **REJECT** |
| 12 | Monster Energy Original 16oz | 012800001509 | BAD (given 9, expected 7) | **REJECT** |
| 13 | Bang Energy Cotton Candy 16oz | 024100082340 | BAD (given 0, expected 6) | **REJECT** |
| 14 | Celsius Sparkling Orange 12oz | 018420015048 | BAD (given 8, expected 7) | **REJECT** |
| 15 | Alani Nu Energy Cherry Slush 12oz | 856889007451 | BAD (given 1, expected 2) | **REJECT** |
| 16 | Gatorade Fruit Punch 32oz | 052000328721 | OK (1) | **PASS** |
| 17 | Powerade Mountain Berry Blast 32oz | 012001008002 | BAD (given 2, expected 8) | **REJECT** |
| 18 | BodyArmor Fruit Punch 28oz | 028000100064 | BAD (given 4, expected 3) | **REJECT** |
| 19 | Liquid I.V. Lemon Lime Stick | 074305001050 | BAD (given 0, expected 5) | **REJECT** |
| 20 | Pedialyte Sport Fruit Punch 12oz | 018640003131 | BAD (given 1, expected 8) | **REJECT** |

## Detail on the 4 PASS entries

All four cleared every check:

- **B. Ingredients:** match `ingredients_verbatim` in raw JSON exactly (order, no additions/omissions).
- **C. Medical claims:** none in any string field.
- **D. companyId:** `coca-cola` (Coca-Cola, Sprite) and `pepsico` (Pepsi, Gatorade) both exist literally in companies.js and reflect current 2026 ownership.
- **E. Schema:** all required fields present; `barcode` key equals `barcode` field value.
- **F. Duplicates:** none in products.js.

## Notes on the rejected entries

The 16 rejects fail on barcode validity (A.1) and are not merged. Other observations recorded for the re-research pass:

- **Web verification (A.2)** corroborates the barcode problem. For Red Bull 8.4oz the real GS1 UPCs use the `611269xxxxxx` prefix (e.g., 611269108026), not `010900000005`. For Liquid I.V. Lemon Lime the real codes use `850039…`/`863737…` prefixes, not `074305001050`. The submitted numbers are not just check-digit-off — they do not resolve to the named products — so no single corrected barcode could be substituted with confidence. Hence REJECT rather than FIX.
- **Ownership accuracy (carried for re-research, independent of the barcode reject):**
  - Poppi `companyId: 'pepsico'` — correct (PepsiCo acquired Poppi March 2024).
  - Monster — writer correctly used `monster-beverage` (raw JSON had `coca-cola`; Coca-Cola holds only a 16.7% stake, not ownership).
  - Bang, Celsius, Alani Nu — raw JSON proposed `companyId: 'celsius'`, which does **not exist** in companies.js. Writer correctly set these to `null` with a `_missingCompany` note. Celsius Holdings needs a companies.js entry before these can be added.
  - Olipop, Zevia, Spindrift, Red Bull — `companyId` handling (null with `_missingCompany`, or `red-bull`) is reasonable but moot until barcodes are corrected. Note `red-bull` key **does** exist in companies.js, so a future valid Red Bull entry should use `companyId: 'red-bull'` rather than null.

## Action required

Re-research correct, scannable UPC-A barcodes for the 16 rejected products and resubmit. Separately, add a `celsius` (Celsius Holdings) entry to companies.js to unblock Bang/Celsius/Alani Nu.
