# Wave 1 SQLite Build Report

[2026-07-16T15:32:07.177Z] Starting offline SQLite product build.
[2026-07-16T15:32:07.209Z] Extracted 1045 manual products from src/data/products.js.
[2026-07-16T15:32:07.224Z] Loaded 25 healthy category definitions and 268 companies.
[2026-07-16T15:32:07.226Z] Loaded 507 product image backfills.
[2026-07-16T15:32:07.245Z] Loaded scorer; score and grade will be precomputed.
[2026-07-16T15:32:07.249Z] Inserting generated products.
[2026-07-16T15:32:07.249Z] Inserting manual override products.
[2026-07-16T15:32:09.334Z] Inserted 0 generated rows and 1045 manual rows; skipped 0 generated barcode collisions.
[2026-07-16T15:32:09.335Z] Creating product indexes.
[2026-07-16T15:32:09.339Z] Building summary tables.
[2026-07-16T15:32:09.354Z] Build complete in 2.18s.
[2026-07-16T15:32:09.355Z] Database: assets\db\products.db (0.93 MB), rows=1045.
[2026-07-16T15:32:09.355Z] Score precompute: worked.
[2026-07-16T15:32:09.449Z] Starting SQLite validation.
[2026-07-16T15:32:09.481Z] PASS: row count is manual-only - db=1045, expected=1045
[2026-07-16T15:32:09.481Z] PASS: manual source row count - db=1045, expected=1045
[2026-07-16T15:32:09.482Z] PASS: generated rows deliberately excluded - db=0, expected=0
[2026-07-16T15:32:09.482Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-16T15:32:09.482Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-16T15:32:09.483Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-16T15:32:09.483Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-16T15:32:09.483Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-16T15:32:09.484Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-16T15:32:09.484Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-16T15:32:09.485Z] PASS: index exists idx_products_category
[2026-07-16T15:32:09.486Z] PASS: index exists idx_products_company
[2026-07-16T15:32:09.486Z] PASS: index exists idx_products_brand
[2026-07-16T15:32:09.486Z] PASS: index exists idx_products_search_text
[2026-07-16T15:32:09.487Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-16T15:32:09.487Z] PASS: summary table populated category_counts - rows=25
[2026-07-16T15:32:09.488Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-16T15:32:09.488Z] PASS: summary table populated company_product_counts - rows=203
[2026-07-16T15:32:09.488Z] PASS: summary table populated spotlight_company_ids - rows=64
[2026-07-16T15:32:09.488Z] PASS: summary table populated schema_meta - rows=6
[2026-07-16T15:32:09.489Z] TIMING: barcode lookup 016000275287 0.080ms
[2026-07-16T15:32:09.489Z] TIMING: LIKE search "%cheerios%" limit 6 0.535ms
[2026-07-16T15:32:09.490Z] DB size 0.93 MB.
[2026-07-16T15:32:09.490Z] Rows total=1045, generated=0, manual=1045.
[2026-07-16T15:32:09.490Z] Score rows=1045; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-16T15:32:09.490Z] Validation PASS.
