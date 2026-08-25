# Phase 2b — manual re-entry still needed

Generated during the Phase 2b OpenFoodFacts re-fetch pass
(scripts/catalog-database/phase2-refetch-list.md). For these barcodes, a
verbatim re-fetch of `ingredients_text_en` / `ingredients_text` from
`world.openfoodfacts.org` did NOT produce ingredient text that is cleaner
than what is already stored — either because OpenFoodFacts' own community
data for that barcode is itself OCR-garbled or incomplete, or because it
carries the same nutrition-facts/marketing-copy contamination the label
photo already had. `src/data/products.js` was NOT changed for these three —
they still need a human to source a clean ingredient declaration (a fresh
label photo, the brand's own website, or a different open-data source).

## `0051000025487` — Prego Traditional Italian Sauce (Prego)

OpenFoodFacts' `ingredients_text` for this barcode is a Spanish-language
label OCR with heavy character-level corruption ("puré de tornate", "efr
trocitos de tomate en jugo de tomate", "contiene unoo màs de los
siquientes: dw moiz", garbled manufacturer address) — the SAME corruption
already present in the stored data, because the stored data was originally
sourced from this exact OFF record. Re-fetching returns no improvement.

## `0072250011372` — Classic White Bread (Wonder)

OpenFoodFacts' `ingredients_text` for this barcode is not an ingredient
declaration at all — it is a marketing/anniversary blurb ("...Merica's
250th birthday with a slice of tradition... salute the brave service
members... total donation by Wonder's parent company...") followed by a
nutrition-notes paragraph. There is no real ingredient list anywhere in the
field. The currently-stored data has the same problem (it came from this
same OFF record). This barcode needs a genuinely new source — the current
product entry has no usable ingredient declaration at all.

## `0038000940644` — Eggo waffles (Kellogg's)

OpenFoodFacts' `ingredients_text` for this barcode is a bilingual
(English/Spanish) nutrition-facts panel bleeding into the ingredient
declaration on both the currently-stored data and the freshly-fetched OFF
text (e.g. "vitamin d/vitamin d 0mcg 0% • iron/iron 3.6 mg 20%...",
"riboflavin/riboflavin 10% | vitamins and minerals: calcium carbonate").
Re-fetching does not fix this — the contamination is baked into OFF's own
community-submitted text for this barcode. Needs a clean single-language
ingredient photo/source.
