# Wave 1 SQLite Build Report

[2026-07-10T19:24:32.352Z] Starting offline SQLite product build.
[2026-07-10T19:24:32.394Z] Extracted 1008 manual products from src/data/products.js.
[2026-07-10T19:24:32.405Z] Loaded 25 healthy category definitions and 268 companies.
[2026-07-10T19:24:32.406Z] Loaded 451 product image backfills.
[2026-07-10T19:24:32.423Z] Loaded scorer; score and grade will be precomputed.
[2026-07-10T19:24:33.352Z] Loaded 135775 generated products.
[2026-07-10T19:24:33.357Z] Inserting generated products.
[2026-07-10T19:24:35.525Z] Inserted 25000 generated rows so far.
[2026-07-10T19:24:37.692Z] Inserted 50000 generated rows so far.
[2026-07-10T19:24:39.608Z] Inserted 75000 generated rows so far.
[2026-07-10T19:24:41.309Z] Inserted 100000 generated rows so far.
[2026-07-10T19:24:43.078Z] Inserted 125000 generated rows so far.
[2026-07-10T19:24:43.822Z] Inserting manual override products.
[2026-07-10T19:24:43.882Z] Inserted 135581 generated rows and 1008 manual rows; skipped 194 generated barcode collisions.
[2026-07-10T19:24:43.882Z] Creating product indexes.
[2026-07-10T19:24:44.436Z] Building summary tables.
[2026-07-10T19:24:46.457Z] Build complete in 14.11s.
[2026-07-10T19:24:46.458Z] Database: assets\db\products.db (153.73 MB), rows=136589.
[2026-07-10T19:24:46.458Z] Score precompute: worked.
[2026-07-10T19:24:46.582Z] Starting SQLite validation.
[2026-07-10T19:24:47.845Z] PASS: row count vs source JSON plus manual overrides - db=136589, expected=136589, collisions=194
[2026-07-10T19:24:47.846Z] PASS: manual source row count - db=1008, expected=1008
[2026-07-10T19:24:47.846Z] PASS: generated source row count - db=135581, expected=135581
[2026-07-10T19:24:47.846Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-10T19:24:47.847Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-10T19:24:47.847Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-10T19:24:47.848Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-10T19:24:47.848Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-10T19:24:47.859Z] PASS: generated spot check 854309008010 - CHOCOLATE CHIP JUMBO COOKIE, CHOCOLATE CHIP
[2026-07-10T19:24:47.860Z] PASS: generated spot check 00011826100362 - Vermont Creamery Everything Goat Cheese Log
[2026-07-10T19:24:47.860Z] PASS: generated spot check 194346066612 - CHIPOTLE LIME SEASONED PEANUTS, HONEY ROASTED CHIPTOLE PEANUTS, CHILI CRESCENT CRACKERS, CORN NUGGETS, SEASONED CRACKERS, PUMPKIN SEED KERNELS TRAIL MIX, CHIPOTLE LIME
[2026-07-10T19:24:47.861Z] PASS: generated spot check 027400323270 - SPREADABLE LIGHT BUTTER WITH CANOLA OIL, SALTED
[2026-07-10T19:24:47.861Z] PASS: generated spot check 043600002807 - APPLE SAUCE, CHUNKY CINNAMON
[2026-07-10T19:24:47.861Z] PASS: generated spot check 853026005111 - PUMPKIN PECAN SPICE SOFT-BAKED COOKIES, PUMPKIN PECAN SPICE
[2026-07-10T19:24:47.862Z] PASS: generated spot check 021130473656 - BREAD AND BUTTER CHIPS
[2026-07-10T19:24:47.862Z] PASS: generated spot check 0009542425081 - NEAPOLITAN WHITE CHOCOLATE TRUFFLES, WHITE CHOCOLATE
[2026-07-10T19:24:47.862Z] PASS: generated spot check 092202002739 - LOW FAT YOGURT, STRAWBERRY
[2026-07-10T19:24:47.862Z] PASS: generated spot check 075209824702 - FINE ICE CREAMS, CHOCOLATE ALMOND BRITTLE
[2026-07-10T19:24:47.863Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-10T19:24:47.863Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-10T19:24:47.863Z] PASS: generated product has null/0 packaging + diet flags 854309008010 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-10T19:24:47.863Z] PASS: index exists idx_products_category
[2026-07-10T19:24:47.863Z] PASS: index exists idx_products_company
[2026-07-10T19:24:47.863Z] PASS: index exists idx_products_brand
[2026-07-10T19:24:47.864Z] PASS: index exists idx_products_search_text
[2026-07-10T19:24:47.875Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-10T19:24:47.876Z] PASS: summary table populated category_counts - rows=25
[2026-07-10T19:24:47.876Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-10T19:24:47.876Z] PASS: summary table populated company_product_counts - rows=203
[2026-07-10T19:24:47.877Z] PASS: summary table populated spotlight_company_ids - rows=64
[2026-07-10T19:24:47.877Z] PASS: summary table populated schema_meta - rows=6
[2026-07-10T19:24:47.877Z] TIMING: barcode lookup 016000275287 0.099ms
[2026-07-10T19:24:47.908Z] TIMING: LIKE search "%cheerios%" limit 6 30.119ms
[2026-07-10T19:24:47.988Z] DB size 153.73 MB.
[2026-07-10T19:24:47.988Z] Rows total=136589, generated=135581, manual=1008.
[2026-07-10T19:24:47.988Z] Score rows=136589; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-10T19:24:47.988Z] Validation PASS.
