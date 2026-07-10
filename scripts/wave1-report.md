# Wave 1 SQLite Build Report

[2026-07-10T14:05:04.269Z] Starting offline SQLite product build.
[2026-07-10T14:05:04.311Z] Extracted 954 manual products from src/data/products.js.
[2026-07-10T14:05:04.325Z] Loaded 25 healthy category definitions and 268 companies.
[2026-07-10T14:05:04.326Z] Loaded 445 product image backfills.
[2026-07-10T14:05:04.351Z] Loaded scorer; score and grade will be precomputed.
[2026-07-10T14:05:05.356Z] Loaded 135775 generated products.
[2026-07-10T14:05:05.366Z] Inserting generated products.
[2026-07-10T14:05:07.607Z] Inserted 25000 generated rows so far.
[2026-07-10T14:05:09.779Z] Inserted 50000 generated rows so far.
[2026-07-10T14:05:11.699Z] Inserted 75000 generated rows so far.
[2026-07-10T14:05:13.447Z] Inserted 100000 generated rows so far.
[2026-07-10T14:05:15.290Z] Inserted 125000 generated rows so far.
[2026-07-10T14:05:16.023Z] Inserting manual override products.
[2026-07-10T14:05:16.076Z] Inserted 135592 generated rows and 954 manual rows; skipped 183 generated barcode collisions.
[2026-07-10T14:05:16.076Z] Creating product indexes.
[2026-07-10T14:05:16.634Z] Building summary tables.
[2026-07-10T14:05:18.784Z] Build complete in 14.52s.
[2026-07-10T14:05:18.785Z] Database: assets\db\products.db (153.68 MB), rows=136546.
[2026-07-10T14:05:18.786Z] Score precompute: worked.
[2026-07-10T14:05:18.920Z] Starting SQLite validation.
[2026-07-10T14:05:20.156Z] PASS: row count vs source JSON plus manual overrides - db=136546, expected=136546, collisions=183
[2026-07-10T14:05:20.156Z] PASS: manual source row count - db=954, expected=954
[2026-07-10T14:05:20.157Z] PASS: generated source row count - db=135592, expected=135592
[2026-07-10T14:05:20.157Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-10T14:05:20.157Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-10T14:05:20.158Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-10T14:05:20.158Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-10T14:05:20.158Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-10T14:05:20.170Z] PASS: generated spot check 041220978113 - ORIGINAL MICROWAVE POPCORN, ORIGINAL
[2026-07-10T14:05:20.170Z] PASS: generated spot check 041548753300 - FRUIT BARS, BLACK CHERRY
[2026-07-10T14:05:20.171Z] PASS: generated spot check 011110046734 - SEIF-RISING CRUST PEPPERONI PIZZA
[2026-07-10T14:05:20.172Z] PASS: generated spot check 00071421976922 - AdvancePierre Loaded Cheeseburger Mini Patty, 1.33 oz.
[2026-07-10T14:05:20.172Z] PASS: generated spot check 890499000915 - BUTTER SHELL
[2026-07-10T14:05:20.173Z] PASS: generated spot check 011110863669 - PRIVATE SELECTION, SUGAR HOUSE BREAKFAST BREAD, MAPLE STREUSEL
[2026-07-10T14:05:20.173Z] PASS: generated spot check 888849012732 - COOKIES & CREAM MINIS PROTEIN BARS, COOKIES & CREAM
[2026-07-10T14:05:20.173Z] PASS: generated spot check 705118400215 - VANILLA A2 ORGANIC WHOLE MILK YOGURT, VANILLA
[2026-07-10T14:05:20.173Z] PASS: generated spot check 0019454100037 - CINNAMON CRUMB CAKES, CINNAMON
[2026-07-10T14:05:20.174Z] PASS: generated spot check 311917180823 - COLD-MILLED ORGANIC FLAXSEEDS
[2026-07-10T14:05:20.174Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-10T14:05:20.174Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-10T14:05:20.174Z] PASS: generated product has null/0 packaging + diet flags 041220978113 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-10T14:05:20.175Z] PASS: index exists idx_products_category
[2026-07-10T14:05:20.175Z] PASS: index exists idx_products_company
[2026-07-10T14:05:20.175Z] PASS: index exists idx_products_brand
[2026-07-10T14:05:20.175Z] PASS: index exists idx_products_search_text
[2026-07-10T14:05:20.185Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-10T14:05:20.186Z] PASS: summary table populated category_counts - rows=25
[2026-07-10T14:05:20.186Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-10T14:05:20.186Z] PASS: summary table populated company_product_counts - rows=203
[2026-07-10T14:05:20.187Z] PASS: summary table populated spotlight_company_ids - rows=64
[2026-07-10T14:05:20.187Z] PASS: summary table populated schema_meta - rows=6
[2026-07-10T14:05:20.187Z] TIMING: barcode lookup 016000275287 0.081ms
[2026-07-10T14:05:20.217Z] TIMING: LIKE search "%cheerios%" limit 6 29.215ms
[2026-07-10T14:05:20.297Z] DB size 153.68 MB.
[2026-07-10T14:05:20.297Z] Rows total=136546, generated=135592, manual=954.
[2026-07-10T14:05:20.297Z] Score rows=136546; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-10T14:05:20.297Z] Validation PASS.
