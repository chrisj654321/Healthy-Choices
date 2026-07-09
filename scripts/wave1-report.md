# Wave 1 SQLite Build Report

[2026-07-09T23:52:07.115Z] Starting offline SQLite product build.
[2026-07-09T23:52:07.156Z] Extracted 938 manual products from src/data/products.js.
[2026-07-09T23:52:07.167Z] Loaded 25 healthy category definitions and 269 companies.
[2026-07-09T23:52:07.168Z] Loaded 445 product image backfills.
[2026-07-09T23:52:07.184Z] Loaded scorer; score and grade will be precomputed.
[2026-07-09T23:52:08.092Z] Loaded 135775 generated products.
[2026-07-09T23:52:08.095Z] Inserting generated products.
[2026-07-09T23:52:10.264Z] Inserted 25000 generated rows so far.
[2026-07-09T23:52:14.142Z] Inserted 50000 generated rows so far.
[2026-07-09T23:52:17.772Z] Inserted 75000 generated rows so far.
[2026-07-09T23:52:20.917Z] Inserted 100000 generated rows so far.
[2026-07-09T23:52:24.490Z] Inserted 125000 generated rows so far.
[2026-07-09T23:52:25.924Z] Inserting manual override products.
[2026-07-09T23:52:26.041Z] Inserted 135596 generated rows and 938 manual rows; skipped 179 generated barcode collisions.
[2026-07-09T23:52:26.042Z] Creating product indexes.
[2026-07-09T23:52:27.171Z] Building summary tables.
[2026-07-09T23:52:31.861Z] Build complete in 24.75s.
[2026-07-09T23:52:31.862Z] Database: assets\db\products.db (153.66 MB), rows=136534.
[2026-07-09T23:52:31.862Z] Score precompute: worked.
[2026-07-09T23:52:37.474Z] Starting SQLite validation.
[2026-07-09T23:52:38.718Z] PASS: row count vs source JSON plus manual overrides - db=136534, expected=136534, collisions=179
[2026-07-09T23:52:38.719Z] PASS: manual source row count - db=938, expected=938
[2026-07-09T23:52:38.719Z] PASS: generated source row count - db=135596, expected=135596
[2026-07-09T23:52:38.719Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-09T23:52:38.720Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-09T23:52:38.720Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-09T23:52:38.721Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-09T23:52:38.721Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-09T23:52:38.731Z] PASS: generated spot check 782796031023 - DELUXE ROAST BEEF SUB, DELUXE ROAST BEEF
[2026-07-09T23:52:38.732Z] PASS: generated spot check 085239058206 - CORN & BLACK BEAN QUINOA BLEND WITH PINEAPPLE & RED PEPPER, CORN & BLACK BEAN
[2026-07-09T23:52:38.732Z] PASS: generated spot check 073321377359 - RED CHERRY ICEE & VANILLA ICE CREAM FLOAT FREEZE TUBES, RED CHERRY ICEE & VANILLA ICE CREAM
[2026-07-09T23:52:38.733Z] PASS: generated spot check 813090000000 - PINEAPPLE & ORANGE HABANERO HOT SAUCE, PINEAPPLE & ORANGE HABANERO
[2026-07-09T23:52:38.733Z] PASS: generated spot check 028400624572 - POTATO CHIPS, INDIAN TIKKA MASALA
[2026-07-09T23:52:38.733Z] PASS: generated spot check 883426003264 - SPICED APPLE CARAMEL ICED SLICED CAKE, SPICED APPLE CARAMEL
[2026-07-09T23:52:38.734Z] PASS: generated spot check 042563008123 - ORGANIC UNSWEETENED THOMPSON RAISINS, UNSWEETENED
[2026-07-09T23:52:38.734Z] PASS: generated spot check 070784472201 - APPLE CINNAMON TOASTED OATS SWEETENED CEREAL, APPLE CINNAMON
[2026-07-09T23:52:38.734Z] PASS: generated spot check 070670002949 - BAJA STYLE FISH TACO SAUCE
[2026-07-09T23:52:38.735Z] PASS: generated spot check 011822426848 - SUGAR EGG SHAPED COOKIE, SUGAR
[2026-07-09T23:52:38.735Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-09T23:52:38.735Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-09T23:52:38.735Z] PASS: generated product has null/0 packaging + diet flags 782796031023 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-09T23:52:38.736Z] PASS: index exists idx_products_category
[2026-07-09T23:52:38.736Z] PASS: index exists idx_products_company
[2026-07-09T23:52:38.738Z] PASS: index exists idx_products_brand
[2026-07-09T23:52:38.738Z] PASS: index exists idx_products_search_text
[2026-07-09T23:52:38.748Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-09T23:52:38.749Z] PASS: summary table populated category_counts - rows=25
[2026-07-09T23:52:38.749Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-09T23:52:38.749Z] PASS: summary table populated company_product_counts - rows=204
[2026-07-09T23:52:38.749Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-09T23:52:38.750Z] PASS: summary table populated schema_meta - rows=6
[2026-07-09T23:52:38.750Z] TIMING: barcode lookup 016000275287 0.080ms
[2026-07-09T23:52:38.778Z] TIMING: LIKE search "%cheerios%" limit 6 27.579ms
[2026-07-09T23:52:38.862Z] DB size 153.66 MB.
[2026-07-09T23:52:38.862Z] Rows total=136534, generated=135596, manual=938.
[2026-07-09T23:52:38.863Z] Score rows=136534; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-09T23:52:38.863Z] Validation PASS.
