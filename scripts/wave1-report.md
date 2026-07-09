# Wave 1 SQLite Build Report

[2026-07-09T18:02:06.328Z] Starting offline SQLite product build.
[2026-07-09T18:02:06.367Z] Extracted 892 manual products from src/data/products.js.
[2026-07-09T18:02:06.379Z] Loaded 25 healthy category definitions and 269 companies.
[2026-07-09T18:02:06.381Z] Loaded 418 product image backfills.
[2026-07-09T18:02:06.397Z] Loaded scorer; score and grade will be precomputed.
[2026-07-09T18:02:07.338Z] Loaded 135775 generated products.
[2026-07-09T18:02:07.342Z] Inserting generated products.
[2026-07-09T18:02:09.561Z] Inserted 25000 generated rows so far.
[2026-07-09T18:02:11.763Z] Inserted 50000 generated rows so far.
[2026-07-09T18:02:13.770Z] Inserted 75000 generated rows so far.
[2026-07-09T18:02:15.590Z] Inserted 100000 generated rows so far.
[2026-07-09T18:02:17.549Z] Inserted 125000 generated rows so far.
[2026-07-09T18:02:18.334Z] Inserting manual override products.
[2026-07-09T18:02:18.390Z] Inserted 135599 generated rows and 892 manual rows; skipped 176 generated barcode collisions.
[2026-07-09T18:02:18.391Z] Creating product indexes.
[2026-07-09T18:02:18.976Z] Building summary tables.
[2026-07-09T18:02:21.146Z] Build complete in 14.82s.
[2026-07-09T18:02:21.146Z] Database: assets\db\products.db (153.65 MB), rows=136491.
[2026-07-09T18:02:21.146Z] Score precompute: worked.
[2026-07-09T18:02:44.616Z] Starting SQLite validation.
[2026-07-09T18:02:45.886Z] PASS: row count vs source JSON plus manual overrides - db=136491, expected=136491, collisions=176
[2026-07-09T18:02:45.887Z] PASS: manual source row count - db=892, expected=892
[2026-07-09T18:02:45.887Z] PASS: generated source row count - db=135599, expected=135599
[2026-07-09T18:02:45.888Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-09T18:02:45.889Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-09T18:02:45.890Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-09T18:02:45.890Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-09T18:02:45.891Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-09T18:02:45.901Z] PASS: generated spot check 011150180559 - ROUNDY'S, MICROWAVE POPCORN, LIGHT BUTTER, LIGHT BUTTER
[2026-07-09T18:02:45.902Z] PASS: generated spot check 041415376434 - PREMIUM LOWFAT FROZEN YOGURT, HARVEST PEACH MELBA
[2026-07-09T18:02:45.902Z] PASS: generated spot check 099482497255 - BUFFALO FLAVORED SPROUTED BROWN RICE CRISPS, BUFFALO
[2026-07-09T18:02:45.902Z] PASS: generated spot check 850005872214 - SALTED CARAMEL FRENCH ICE CREAM, SALTED CARAMEL
[2026-07-09T18:02:45.903Z] PASS: generated spot check 041415248809 - ROASTED RED PEPPER WITH QUESO FRESCO SMOKED CHICKEN SAUSAGE, ROASTED RED PEPPER WITH QUESO FRESCO
[2026-07-09T18:02:45.903Z] PASS: generated spot check 070552580589 - CHEDDAR & SOUR CREAM POTATO CHIPS, CHEDDAR & SOUR CREAM
[2026-07-09T18:02:45.903Z] PASS: generated spot check 855974003201 - HONEY BBQ SAUCE
[2026-07-09T18:02:45.904Z] PASS: generated spot check 028000558895 - CANDY PIECES IN MILK CHOCOLATE HEARTS SHAPED CHOCOLATES, MILK CHOCOLATE
[2026-07-09T18:02:45.904Z] PASS: generated spot check 043000085400 - DARK CHOCOLATE PEPPERMINT PATTY DESSERT KIT, DARK CHOCOLATE PEPPERMINT PATTY
[2026-07-09T18:02:45.904Z] PASS: generated spot check 052548692537 - CINNAMON CHEWS CANDY, CINNAMON CHEWS
[2026-07-09T18:02:45.904Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-09T18:02:45.904Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-09T18:02:45.905Z] PASS: generated product has null/0 packaging + diet flags 011150180559 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-09T18:02:45.905Z] PASS: index exists idx_products_category
[2026-07-09T18:02:45.905Z] PASS: index exists idx_products_company
[2026-07-09T18:02:45.905Z] PASS: index exists idx_products_brand
[2026-07-09T18:02:45.906Z] PASS: index exists idx_products_search_text
[2026-07-09T18:02:45.918Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-09T18:02:45.918Z] PASS: summary table populated category_counts - rows=25
[2026-07-09T18:02:45.919Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-09T18:02:45.919Z] PASS: summary table populated company_product_counts - rows=204
[2026-07-09T18:02:45.919Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-09T18:02:45.919Z] PASS: summary table populated schema_meta - rows=6
[2026-07-09T18:02:45.920Z] TIMING: barcode lookup 016000275287 0.083ms
[2026-07-09T18:02:45.949Z] TIMING: LIKE search "%cheerios%" limit 6 29.277ms
[2026-07-09T18:02:46.036Z] DB size 153.65 MB.
[2026-07-09T18:02:46.036Z] Rows total=136491, generated=135599, manual=892.
[2026-07-09T18:02:46.036Z] Score rows=136491; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-09T18:02:46.036Z] Validation PASS.
