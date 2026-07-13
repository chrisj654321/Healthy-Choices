# Wave 1 SQLite Build Report

[2026-07-12T16:17:11.895Z] Starting offline SQLite product build.
[2026-07-12T16:17:11.924Z] Extracted 1045 manual products from src/data/products.js.
[2026-07-12T16:17:11.936Z] Loaded 25 healthy category definitions and 268 companies.
[2026-07-12T16:17:11.937Z] Loaded 507 product image backfills.
[2026-07-12T16:17:11.953Z] Loaded scorer; score and grade will be precomputed.
[2026-07-12T16:17:11.962Z] Inserting generated products.
[2026-07-12T16:17:11.962Z] Inserting manual override products.
[2026-07-12T16:17:12.036Z] Inserted 0 generated rows and 1045 manual rows; skipped 0 generated barcode collisions.
[2026-07-12T16:17:12.036Z] Creating product indexes.
[2026-07-12T16:17:12.039Z] Building summary tables.
[2026-07-12T16:17:12.048Z] Build complete in 0.15s.
[2026-07-12T16:17:12.048Z] Database: assets\db\products.db (0.93 MB), rows=1045.
[2026-07-12T16:17:12.048Z] Score precompute: worked.
[2026-07-12T16:17:12.120Z] Starting SQLite validation.
[2026-07-12T16:17:12.150Z] PASS: row count is manual-only - db=1045, expected=1045
[2026-07-12T16:17:12.150Z] PASS: manual source row count - db=1045, expected=1045
[2026-07-12T16:17:12.151Z] PASS: generated rows deliberately excluded - db=0, expected=0
[2026-07-12T16:17:12.151Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-12T16:17:12.151Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-12T16:17:12.152Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-12T16:17:12.152Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-12T16:17:12.152Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-12T16:17:12.152Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-12T16:17:12.152Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-12T16:17:12.153Z] PASS: index exists idx_products_category
[2026-07-12T16:17:12.153Z] PASS: index exists idx_products_company
[2026-07-12T16:17:12.153Z] PASS: index exists idx_products_brand
[2026-07-12T16:17:12.153Z] PASS: index exists idx_products_search_text
[2026-07-12T16:17:12.154Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-12T16:17:12.154Z] PASS: summary table populated category_counts - rows=25
[2026-07-12T16:17:12.154Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-12T16:17:12.154Z] PASS: summary table populated company_product_counts - rows=203
[2026-07-12T16:17:12.154Z] PASS: summary table populated spotlight_company_ids - rows=64
[2026-07-12T16:17:12.155Z] PASS: summary table populated schema_meta - rows=6
[2026-07-12T16:17:12.155Z] TIMING: barcode lookup 016000275287 0.057ms
[2026-07-12T16:17:12.155Z] TIMING: LIKE search "%cheerios%" limit 6 0.306ms
[2026-07-12T16:17:12.156Z] DB size 0.93 MB.
[2026-07-12T16:17:12.156Z] Rows total=1045, generated=0, manual=1045.
[2026-07-12T16:17:12.156Z] Score rows=1045; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-12T16:17:12.156Z] Validation PASS.
