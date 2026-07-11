# Wave 1 SQLite Build Report

[2026-07-11T03:19:20.454Z] Starting offline SQLite product build.
[2026-07-11T03:19:20.503Z] Extracted 1045 manual products from src/data/products.js.
[2026-07-11T03:19:20.516Z] Loaded 25 healthy category definitions and 268 companies.
[2026-07-11T03:19:20.518Z] Loaded 507 product image backfills.
[2026-07-11T03:19:20.535Z] Loaded scorer; score and grade will be precomputed.
[2026-07-11T03:19:21.518Z] Loaded 135775 generated products.
[2026-07-11T03:19:21.521Z] Inserting generated products.
[2026-07-11T03:19:23.735Z] Inserted 25000 generated rows so far.
[2026-07-11T03:19:25.835Z] Inserted 50000 generated rows so far.
[2026-07-11T03:19:27.696Z] Inserted 75000 generated rows so far.
[2026-07-11T03:19:29.347Z] Inserted 100000 generated rows so far.
[2026-07-11T03:19:31.103Z] Inserted 125000 generated rows so far.
[2026-07-11T03:19:31.848Z] Inserting manual override products.
[2026-07-11T03:19:31.910Z] Inserted 135578 generated rows and 1045 manual rows; skipped 197 generated barcode collisions.
[2026-07-11T03:19:31.910Z] Creating product indexes.
[2026-07-11T03:19:32.466Z] Building summary tables.
[2026-07-11T03:19:34.486Z] Build complete in 14.03s.
[2026-07-11T03:19:34.487Z] Database: assets\db\products.db (153.75 MB), rows=136623.
[2026-07-11T03:19:34.487Z] Score precompute: worked.
[2026-07-11T03:19:34.602Z] Starting SQLite validation.
[2026-07-11T03:19:35.913Z] PASS: row count vs source JSON plus manual overrides - db=136623, expected=136623, collisions=197
[2026-07-11T03:19:35.913Z] PASS: manual source row count - db=1045, expected=1045
[2026-07-11T03:19:35.913Z] PASS: generated source row count - db=135578, expected=135578
[2026-07-11T03:19:35.914Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-11T03:19:35.914Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-11T03:19:35.914Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-11T03:19:35.915Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-11T03:19:35.915Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-11T03:19:35.926Z] PASS: generated spot check 00016000184862 - CinnaGraham Toast Crunch Cereal
[2026-07-11T03:19:35.926Z] PASS: generated spot check 888670172421 - ORGANIC EXTRA FINE GREEN BEANS
[2026-07-11T03:19:35.926Z] PASS: generated spot check 02114016110 - ITALIAN BREAD
[2026-07-11T03:19:35.927Z] PASS: generated spot check 077966002362 - MI RANCHITO, GOLDEN ROUND TORTILLA CHIPS
[2026-07-11T03:19:35.927Z] PASS: generated spot check 0041387524581 - GREEN TEA ICED TEA MIX, HONEY; LEMON
[2026-07-11T03:19:35.927Z] PASS: generated spot check 842798101589 - TOMATO SAUCE
[2026-07-11T03:19:35.928Z] PASS: generated spot check 022000015785 - ORCHARDS LIME, RED APPLE, ORANGE, CHERRY, PEACH BITE SIZE CANDIES, ORCHARDS
[2026-07-11T03:19:35.928Z] PASS: generated spot check 028400517744 - CHEDDAR & SOUR CREAM POTATO CHIPS, CHEDDAR & SOUR CREAM
[2026-07-11T03:19:35.928Z] PASS: generated spot check 0841652100645 - COCOA OAT SQUARES WITH SUPERFOODS
[2026-07-11T03:19:35.928Z] PASS: generated spot check 041497133833 - DARK CHOCOLATE PRETZELS
[2026-07-11T03:19:35.929Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-11T03:19:35.929Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-11T03:19:35.929Z] PASS: generated product has null/0 packaging + diet flags 00016000184862 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-11T03:19:35.929Z] PASS: index exists idx_products_category
[2026-07-11T03:19:35.929Z] PASS: index exists idx_products_company
[2026-07-11T03:19:35.930Z] PASS: index exists idx_products_brand
[2026-07-11T03:19:35.930Z] PASS: index exists idx_products_search_text
[2026-07-11T03:19:35.938Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-11T03:19:35.939Z] PASS: summary table populated category_counts - rows=25
[2026-07-11T03:19:35.939Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-11T03:19:35.939Z] PASS: summary table populated company_product_counts - rows=203
[2026-07-11T03:19:35.939Z] PASS: summary table populated spotlight_company_ids - rows=64
[2026-07-11T03:19:35.940Z] PASS: summary table populated schema_meta - rows=6
[2026-07-11T03:19:35.940Z] TIMING: barcode lookup 016000275287 0.090ms
[2026-07-11T03:19:35.968Z] TIMING: LIKE search "%cheerios%" limit 6 27.674ms
[2026-07-11T03:19:36.048Z] DB size 153.75 MB.
[2026-07-11T03:19:36.048Z] Rows total=136623, generated=135578, manual=1045.
[2026-07-11T03:19:36.048Z] Score rows=136623; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-11T03:19:36.048Z] Validation PASS.
