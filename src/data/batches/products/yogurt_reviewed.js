// QA REVIEWED — 2026-06-12 — 0 PASS, 0 FIX, 24 REJECT
//
// NO ENTRIES CLEARED FOR MERGE.
//
// All 24 yogurt entries were REJECTED on BARCODE grounds (checklist section A).
// Every barcode in yogurt_raw.json / yogurt_formatted.js is a fabricated,
// sequential placeholder (001010000021, 001010000038, 001010000045, ...,
// incrementing by 7). Every one FAILS the UPC-A mod-10 check digit, and none
// resolve to a real product on Open Food Facts / retailer barcode databases.
// Real products from these brands use genuine GS1 prefixes (e.g. Dannon =
// 036632xxxxxx). Per the rule "Wrong check digit = REJECT," none of these
// entries may be merged into products.js, which uses real barcodes.
//
// This batch must be re-researched with real, scanned UPCs before it can pass QA.
// See yogurt_qa.md for the full per-product report, including the separate
// companyId fixes that should be applied during the re-research (most notably:
// companyId 'forager-project' DOES exist in companies.js — the formatted file
// wrongly nulled it).
