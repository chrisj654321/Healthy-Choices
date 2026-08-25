# Wave 1 SQLite Build Report

[2026-08-24T02:02:07.778Z] Starting offline SQLite product build.
[2026-08-24T02:02:07.809Z] Extracted 1146 manual products from src/data/products.js.
[2026-08-24T02:02:07.825Z] Loaded 25 healthy category definitions and 344 companies.
[2026-08-24T02:02:07.847Z] Loaded 863 brand-to-company and 784 brand-to-parent entries, 4100 cached ingredient analyses.
[2026-08-24T02:02:07.849Z] Loaded 565 product image backfills.
[2026-08-24T02:02:07.869Z] Loaded scorer; score and grade will be precomputed.
[2026-08-24T02:02:07.873Z] Inserting generated products.
[2026-08-24T02:02:07.873Z] Inserting manual override products.
[2026-08-24T02:02:09.881Z] Inserted 0 generated rows and 1146 manual rows; skipped 0 generated barcode collisions.
[2026-08-24T02:02:09.882Z] Creating product indexes.
[2026-08-24T02:02:09.885Z] Building summary tables.
[2026-08-24T02:02:09.909Z] Build complete in 2.13s.
[2026-08-24T02:02:09.909Z] Database: assets\db\products.db (2.86 MB), rows=1146.
[2026-08-24T02:02:09.909Z] Score precompute: worked.
[2026-08-24T02:02:09.910Z] Reference data: 344 companies, 1647 brand map rows, 4100 ingredient analyses.
[2026-08-24T02:02:10.038Z] Starting SQLite validation.
[2026-08-24T02:02:10.084Z] PASS: row count is manual-only - db=1146, expected=1146
[2026-08-24T02:02:10.084Z] PASS: manual source row count - db=1146, expected=1146
[2026-08-24T02:02:10.085Z] PASS: generated rows deliberately excluded - db=0, expected=0
[2026-08-24T02:02:10.086Z] PASS: manual override spot check 191011000872 - JUST Egg Folded Plant Eggs
[2026-08-24T02:02:10.087Z] PASS: manual override spot check 810012620185 - Cauliflower Hash Browns
[2026-08-24T02:02:10.087Z] PASS: manual override spot check 856017003813 - Paleo Toaster Waffles
[2026-08-24T02:02:10.088Z] PASS: manual override spot check 075947401555 - All Natural Frozen Shredded Hash Browns
[2026-08-24T02:02:10.088Z] PASS: manual override spot check 073416045378 - Organic Long Grain Brown Rice Bowl
[2026-08-24T02:02:10.088Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-08-24T02:02:10.089Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-08-24T02:02:10.089Z] PASS: index exists idx_products_category
[2026-08-24T02:02:10.089Z] PASS: index exists idx_products_company
[2026-08-24T02:02:10.090Z] PASS: index exists idx_products_brand
[2026-08-24T02:02:10.090Z] PASS: index exists idx_products_search_text
[2026-08-24T02:02:10.091Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-08-24T02:02:10.091Z] PASS: summary table populated category_counts - rows=25
[2026-08-24T02:02:10.092Z] PASS: summary table populated category_hero_images - rows=25
[2026-08-24T02:02:10.092Z] PASS: summary table populated company_product_counts - rows=235
[2026-08-24T02:02:10.092Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-08-24T02:02:10.093Z] PASS: summary table populated schema_meta - rows=9
[2026-08-24T02:02:10.093Z] PASS: schema version is 2 - value=2
[2026-08-24T02:02:10.094Z] PASS: companies table matches source - db=344, source=344
[2026-08-24T02:02:10.094Z] PASS: brand_company_map populated - rows=1647
[2026-08-24T02:02:10.095Z] PASS: brand_company_map carries both kinds - kinds=company,parent
[2026-08-24T02:02:10.095Z] PASS: ingredient_analysis populated - rows=4100
[2026-08-24T02:02:10.098Z] PASS: every company row is valid JSON - bad=0
[2026-08-24T02:02:10.099Z] TIMING: barcode lookup 191011000872 0.098ms
[2026-08-24T02:02:10.099Z] TIMING: LIKE search "%cheerios%" limit 6 0.388ms
[2026-08-24T02:02:10.100Z] DB size 2.86 MB.
[2026-08-24T02:02:10.100Z] Rows total=1146, generated=0, manual=1146.
[2026-08-24T02:02:10.100Z] Score rows=1146; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-08-24T02:02:10.101Z] Validation PASS.
