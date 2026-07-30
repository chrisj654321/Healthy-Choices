# Wave 1 SQLite Build Report

[2026-07-27T15:08:34.364Z] Starting offline SQLite product build.
[2026-07-27T15:08:34.395Z] Extracted 1092 manual products from src/data/products.js.
[2026-07-27T15:08:34.409Z] Loaded 25 healthy category definitions and 300 companies.
[2026-07-27T15:08:34.411Z] Loaded 565 product image backfills.
[2026-07-27T15:08:34.430Z] Loaded scorer; score and grade will be precomputed.
[2026-07-27T15:08:34.442Z] Inserting generated products.
[2026-07-27T15:08:34.443Z] Inserting manual override products.
[2026-07-27T15:08:36.325Z] Inserted 0 generated rows and 1092 manual rows; skipped 0 generated barcode collisions.
[2026-07-27T15:08:36.326Z] Creating product indexes.
[2026-07-27T15:08:36.328Z] Building summary tables.
[2026-07-27T15:08:36.341Z] Build complete in 1.98s.
[2026-07-27T15:08:36.342Z] Database: assets\db\products.db (0.96 MB), rows=1092.
[2026-07-27T15:08:36.342Z] Score precompute: worked.
[2026-07-27T15:08:36.434Z] Starting SQLite validation.
[2026-07-27T15:08:36.470Z] PASS: row count is manual-only - db=1092, expected=1092
[2026-07-27T15:08:36.471Z] PASS: manual source row count - db=1092, expected=1092
[2026-07-27T15:08:36.471Z] PASS: generated rows deliberately excluded - db=0, expected=0
[2026-07-27T15:08:36.471Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-27T15:08:36.472Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-27T15:08:36.472Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-27T15:08:36.473Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-27T15:08:36.474Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-27T15:08:36.475Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-27T15:08:36.476Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-27T15:08:36.477Z] PASS: index exists idx_products_category
[2026-07-27T15:08:36.477Z] PASS: index exists idx_products_company
[2026-07-27T15:08:36.477Z] PASS: index exists idx_products_brand
[2026-07-27T15:08:36.477Z] PASS: index exists idx_products_search_text
[2026-07-27T15:08:36.478Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-27T15:08:36.479Z] PASS: summary table populated category_counts - rows=25
[2026-07-27T15:08:36.479Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-27T15:08:36.480Z] PASS: summary table populated company_product_counts - rows=222
[2026-07-27T15:08:36.480Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-27T15:08:36.481Z] PASS: summary table populated schema_meta - rows=6
[2026-07-27T15:08:36.481Z] TIMING: barcode lookup 016000275287 0.140ms
[2026-07-27T15:08:36.482Z] TIMING: LIKE search "%cheerios%" limit 6 0.585ms
[2026-07-27T15:08:36.483Z] DB size 0.96 MB.
[2026-07-27T15:08:36.483Z] Rows total=1092, generated=0, manual=1092.
[2026-07-27T15:08:36.483Z] Score rows=1092; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-27T15:08:36.484Z] Validation PASS.
