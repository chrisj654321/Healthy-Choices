# Wave 1 SQLite Build Report

[2026-08-23T03:50:49.099Z] Starting offline SQLite product build.
[2026-08-23T03:50:49.127Z] Extracted 1128 manual products from src/data/products.js.
[2026-08-23T03:50:49.145Z] Loaded 25 healthy category definitions and 334 companies.
[2026-08-23T03:50:49.171Z] Loaded 848 brand-to-company and 784 brand-to-parent entries, 4100 cached ingredient analyses.
[2026-08-23T03:50:49.172Z] Loaded 565 product image backfills.
[2026-08-23T03:50:49.192Z] Loaded scorer; score and grade will be precomputed.
[2026-08-23T03:50:49.196Z] Inserting generated products.
[2026-08-23T03:50:49.196Z] Inserting manual override products.
[2026-08-23T03:50:51.115Z] Inserted 0 generated rows and 1128 manual rows; skipped 0 generated barcode collisions.
[2026-08-23T03:50:51.115Z] Creating product indexes.
[2026-08-23T03:50:51.118Z] Building summary tables.
[2026-08-23T03:50:51.144Z] Build complete in 2.05s.
[2026-08-23T03:50:51.144Z] Database: assets\db\products.db (2.82 MB), rows=1128.
[2026-08-23T03:50:51.144Z] Score precompute: worked.
[2026-08-23T03:50:51.145Z] Reference data: 334 companies, 1632 brand map rows, 4100 ingredient analyses.
[2026-08-23T03:50:51.200Z] Starting SQLite validation.
[2026-08-23T03:50:51.247Z] PASS: row count is manual-only - db=1128, expected=1128
[2026-08-23T03:50:51.247Z] PASS: manual source row count - db=1128, expected=1128
[2026-08-23T03:50:51.247Z] PASS: generated rows deliberately excluded - db=0, expected=0
[2026-08-23T03:50:51.248Z] PASS: manual override spot check 073472001233 - Food for Life Ezekiel 4:9 Sesame Sprouted Whole Grain Bread
[2026-08-23T03:50:51.248Z] PASS: manual override spot check 073472001240 - Food for Life Ezekiel 4:9 Flax Sprouted Whole Grain Bread
[2026-08-23T03:50:51.248Z] PASS: manual override spot check 073472001530 - Food for Life Ezekiel 4:9 Low Sodium Sprouted Whole Grain Bread
[2026-08-23T03:50:51.249Z] PASS: manual override spot check 073472001011 - Food for Life 7 Sprouted Grains Bread
[2026-08-23T03:50:51.249Z] PASS: manual override spot check 073472001417 - Food for Life Genesis 1:29 Sprouted Grain and Seed Bread
[2026-08-23T03:50:51.250Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-08-23T03:50:51.250Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-08-23T03:50:51.251Z] PASS: index exists idx_products_category
[2026-08-23T03:50:51.251Z] PASS: index exists idx_products_company
[2026-08-23T03:50:51.251Z] PASS: index exists idx_products_brand
[2026-08-23T03:50:51.251Z] PASS: index exists idx_products_search_text
[2026-08-23T03:50:51.252Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-08-23T03:50:51.252Z] PASS: summary table populated category_counts - rows=25
[2026-08-23T03:50:51.253Z] PASS: summary table populated category_hero_images - rows=25
[2026-08-23T03:50:51.253Z] PASS: summary table populated company_product_counts - rows=224
[2026-08-23T03:50:51.253Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-08-23T03:50:51.254Z] PASS: summary table populated schema_meta - rows=9
[2026-08-23T03:50:51.255Z] PASS: schema version is 2 - value=2
[2026-08-23T03:50:51.255Z] PASS: companies table matches source - db=334, source=334
[2026-08-23T03:50:51.256Z] PASS: brand_company_map populated - rows=1632
[2026-08-23T03:50:51.256Z] PASS: brand_company_map carries both kinds - kinds=company,parent
[2026-08-23T03:50:51.257Z] PASS: ingredient_analysis populated - rows=4100
[2026-08-23T03:50:51.260Z] PASS: every company row is valid JSON - bad=0
[2026-08-23T03:50:51.261Z] TIMING: barcode lookup 073472001233 0.103ms
[2026-08-23T03:50:51.262Z] TIMING: LIKE search "%cheerios%" limit 6 0.589ms
[2026-08-23T03:50:51.262Z] DB size 2.82 MB.
[2026-08-23T03:50:51.262Z] Rows total=1128, generated=0, manual=1128.
[2026-08-23T03:50:51.263Z] Score rows=1128; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-08-23T03:50:51.263Z] Validation PASS.
[2026-08-23T03:53:54.607Z] Starting SQLite validation.
[2026-08-23T03:53:54.654Z] PASS: row count is manual-only - db=1128, expected=1128
[2026-08-23T03:53:54.654Z] PASS: manual source row count - db=1128, expected=1128
[2026-08-23T03:53:54.655Z] PASS: generated rows deliberately excluded - db=0, expected=0
[2026-08-23T03:53:54.656Z] PASS: manual override spot check 073472001233 - Food for Life Ezekiel 4:9 Sesame Sprouted Whole Grain Bread
[2026-08-23T03:53:54.656Z] PASS: manual override spot check 073472001240 - Food for Life Ezekiel 4:9 Flax Sprouted Whole Grain Bread
[2026-08-23T03:53:54.657Z] PASS: manual override spot check 073472001530 - Food for Life Ezekiel 4:9 Low Sodium Sprouted Whole Grain Bread
[2026-08-23T03:53:54.657Z] PASS: manual override spot check 073472001011 - Food for Life 7 Sprouted Grains Bread
[2026-08-23T03:53:54.657Z] PASS: manual override spot check 073472001417 - Food for Life Genesis 1:29 Sprouted Grain and Seed Bread
[2026-08-23T03:53:54.658Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-08-23T03:53:54.658Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-08-23T03:53:54.659Z] PASS: index exists idx_products_category
[2026-08-23T03:53:54.659Z] PASS: index exists idx_products_company
[2026-08-23T03:53:54.659Z] PASS: index exists idx_products_brand
[2026-08-23T03:53:54.660Z] PASS: index exists idx_products_search_text
[2026-08-23T03:53:54.660Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-08-23T03:53:54.661Z] PASS: summary table populated category_counts - rows=25
[2026-08-23T03:53:54.661Z] PASS: summary table populated category_hero_images - rows=25
[2026-08-23T03:53:54.662Z] PASS: summary table populated company_product_counts - rows=224
[2026-08-23T03:53:54.662Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-08-23T03:53:54.663Z] PASS: summary table populated schema_meta - rows=9
[2026-08-23T03:53:54.663Z] PASS: schema version is 2 - value=2
[2026-08-23T03:53:54.664Z] PASS: companies table matches source - db=334, source=334
[2026-08-23T03:53:54.665Z] PASS: brand_company_map populated - rows=1632
[2026-08-23T03:53:54.666Z] PASS: brand_company_map carries both kinds - kinds=company,parent
[2026-08-23T03:53:54.666Z] PASS: ingredient_analysis populated - rows=4100
[2026-08-23T03:53:54.669Z] PASS: every company row is valid JSON - bad=0
[2026-08-23T03:53:54.670Z] TIMING: barcode lookup 073472001233 0.141ms
[2026-08-23T03:53:54.671Z] TIMING: LIKE search "%cheerios%" limit 6 0.438ms
[2026-08-23T03:53:54.672Z] DB size 2.82 MB.
[2026-08-23T03:53:54.672Z] Rows total=1128, generated=0, manual=1128.
[2026-08-23T03:53:54.672Z] Score rows=1128; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-08-23T03:53:54.673Z] Validation PASS.
