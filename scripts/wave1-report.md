# Wave 1 SQLite Build Report

[2026-07-22T15:45:37.768Z] Starting offline SQLite product build.
[2026-07-22T15:45:37.794Z] Extracted 1092 manual products from src/data/products.js.
[2026-07-22T15:45:37.806Z] Loaded 25 healthy category definitions and 268 companies.
[2026-07-22T15:45:37.807Z] Loaded 507 product image backfills.
[2026-07-22T15:45:37.825Z] Loaded scorer; score and grade will be precomputed.
[2026-07-22T15:45:37.828Z] Inserting generated products.
[2026-07-22T15:45:37.828Z] Inserting manual override products.
[2026-07-22T15:45:39.948Z] Inserted 0 generated rows and 1092 manual rows; skipped 0 generated barcode collisions.
[2026-07-22T15:45:39.949Z] Creating product indexes.
[2026-07-22T15:45:39.953Z] Building summary tables.
[2026-07-22T15:45:39.970Z] Build complete in 2.20s.
[2026-07-22T15:45:39.970Z] Database: assets\db\products.db (0.95 MB), rows=1092.
[2026-07-22T15:45:39.970Z] Score precompute: worked.
[2026-07-22T15:45:57.714Z] Starting SQLite validation.
[2026-07-22T15:45:57.749Z] PASS: row count is manual-only - db=1092, expected=1092
[2026-07-22T15:45:57.750Z] PASS: manual source row count - db=1092, expected=1092
[2026-07-22T15:45:57.750Z] PASS: generated rows deliberately excluded - db=0, expected=0
[2026-07-22T15:45:57.751Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-22T15:45:57.751Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-22T15:45:57.752Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-22T15:45:57.752Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-22T15:45:57.753Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-22T15:45:57.753Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-22T15:45:57.754Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-22T15:45:57.754Z] PASS: index exists idx_products_category
[2026-07-22T15:45:57.755Z] PASS: index exists idx_products_company
[2026-07-22T15:45:57.756Z] PASS: index exists idx_products_brand
[2026-07-22T15:45:57.756Z] PASS: index exists idx_products_search_text
[2026-07-22T15:45:57.757Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-22T15:45:57.758Z] PASS: summary table populated category_counts - rows=25
[2026-07-22T15:45:57.758Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-22T15:45:57.758Z] PASS: summary table populated company_product_counts - rows=206
[2026-07-22T15:45:57.759Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-22T15:45:57.759Z] PASS: summary table populated schema_meta - rows=6
[2026-07-22T15:45:57.759Z] TIMING: barcode lookup 016000275287 0.122ms
[2026-07-22T15:45:57.760Z] TIMING: LIKE search "%cheerios%" limit 6 0.424ms
[2026-07-22T15:45:57.761Z] DB size 0.95 MB.
[2026-07-22T15:45:57.762Z] Rows total=1092, generated=0, manual=1092.
[2026-07-22T15:45:57.762Z] Score rows=1092; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-22T15:45:57.763Z] Validation PASS.
