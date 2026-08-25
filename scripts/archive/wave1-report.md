# Wave 1 SQLite Build Report

[2026-08-12T00:29:08.891Z] Starting offline SQLite product build.
[2026-08-12T00:29:08.920Z] Extracted 1092 manual products from src/data/products.js.
[2026-08-12T00:29:08.937Z] Loaded 25 healthy category definitions and 302 companies.
[2026-08-12T00:29:08.965Z] Loaded 770 brand-to-company and 784 brand-to-parent entries, 4100 cached ingredient analyses.
[2026-08-12T00:29:08.966Z] Loaded 565 product image backfills.
[2026-08-12T00:29:08.986Z] Loaded scorer; score and grade will be precomputed.
[2026-08-12T00:29:08.991Z] Inserting generated products.
[2026-08-12T00:29:08.992Z] Inserting manual override products.
[2026-08-12T00:29:10.583Z] Inserted 0 generated rows and 1092 manual rows; skipped 0 generated barcode collisions.
[2026-08-12T00:29:10.583Z] Creating product indexes.
[2026-08-12T00:29:10.585Z] Building summary tables.
[2026-08-12T00:29:10.615Z] Build complete in 1.72s.
[2026-08-12T00:29:10.615Z] Database: assets\db\products.db (2.77 MB), rows=1092.
[2026-08-12T00:29:10.615Z] Score precompute: worked.
[2026-08-12T00:29:10.615Z] Reference data: 302 companies, 1554 brand map rows, 4100 ingredient analyses.
[2026-08-12T00:29:10.719Z] Starting SQLite validation.
[2026-08-12T00:29:10.773Z] PASS: row count is manual-only - db=1092, expected=1092
[2026-08-12T00:29:10.774Z] PASS: manual source row count - db=1092, expected=1092
[2026-08-12T00:29:10.774Z] PASS: generated rows deliberately excluded - db=0, expected=0
[2026-08-12T00:29:10.775Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-08-12T00:29:10.775Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-08-12T00:29:10.776Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-08-12T00:29:10.776Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-08-12T00:29:10.777Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-08-12T00:29:10.777Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-08-12T00:29:10.778Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-08-12T00:29:10.779Z] PASS: index exists idx_products_category
[2026-08-12T00:29:10.779Z] PASS: index exists idx_products_company
[2026-08-12T00:29:10.779Z] PASS: index exists idx_products_brand
[2026-08-12T00:29:10.780Z] PASS: index exists idx_products_search_text
[2026-08-12T00:29:10.781Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-08-12T00:29:10.782Z] PASS: summary table populated category_counts - rows=25
[2026-08-12T00:29:10.782Z] PASS: summary table populated category_hero_images - rows=25
[2026-08-12T00:29:10.783Z] PASS: summary table populated company_product_counts - rows=222
[2026-08-12T00:29:10.783Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-08-12T00:29:10.784Z] PASS: summary table populated schema_meta - rows=9
[2026-08-12T00:29:10.785Z] PASS: schema version is 2 - value=2
[2026-08-12T00:29:10.785Z] PASS: companies table matches source - db=302, source=302
[2026-08-12T00:29:10.785Z] PASS: brand_company_map populated - rows=1554
[2026-08-12T00:29:10.786Z] PASS: brand_company_map carries both kinds - kinds=company,parent
[2026-08-12T00:29:10.786Z] PASS: ingredient_analysis populated - rows=4100
[2026-08-12T00:29:10.790Z] PASS: every company row is valid JSON - bad=0
[2026-08-12T00:29:10.791Z] TIMING: barcode lookup 016000275287 0.235ms
[2026-08-12T00:29:10.793Z] TIMING: LIKE search "%cheerios%" limit 6 0.797ms
[2026-08-12T00:29:10.794Z] DB size 2.77 MB.
[2026-08-12T00:29:10.794Z] Rows total=1092, generated=0, manual=1092.
[2026-08-12T00:29:10.795Z] Score rows=1092; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-08-12T00:29:10.795Z] Validation PASS.
