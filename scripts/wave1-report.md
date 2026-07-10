# Wave 1 SQLite Build Report

[2026-07-10T14:13:21.327Z] Starting offline SQLite product build.
[2026-07-10T14:13:21.379Z] Extracted 968 manual products from src/data/products.js.
[2026-07-10T14:13:21.392Z] Loaded 25 healthy category definitions and 268 companies.
[2026-07-10T14:13:21.393Z] Loaded 451 product image backfills.
[2026-07-10T14:13:21.411Z] Loaded scorer; score and grade will be precomputed.
[2026-07-10T14:13:22.376Z] Loaded 135775 generated products.
[2026-07-10T14:13:22.379Z] Inserting generated products.
[2026-07-10T14:13:24.812Z] Inserted 25000 generated rows so far.
[2026-07-10T14:13:28.918Z] Inserted 50000 generated rows so far.
[2026-07-10T14:13:32.388Z] Inserted 75000 generated rows so far.
[2026-07-10T14:13:35.536Z] Inserted 100000 generated rows so far.
[2026-07-10T14:13:39.120Z] Inserted 125000 generated rows so far.
[2026-07-10T14:13:40.560Z] Inserting manual override products.
[2026-07-10T14:13:40.671Z] Inserted 135591 generated rows and 968 manual rows; skipped 184 generated barcode collisions.
[2026-07-10T14:13:40.672Z] Creating product indexes.
[2026-07-10T14:13:41.772Z] Building summary tables.
[2026-07-10T14:13:45.900Z] Build complete in 24.57s.
[2026-07-10T14:13:45.900Z] Database: assets\db\products.db (153.69 MB), rows=136559.
[2026-07-10T14:13:45.900Z] Score precompute: worked.
[2026-07-10T14:13:46.068Z] Starting SQLite validation.
[2026-07-10T14:13:47.423Z] PASS: row count vs source JSON plus manual overrides - db=136559, expected=136559, collisions=184
[2026-07-10T14:13:47.423Z] PASS: manual source row count - db=968, expected=968
[2026-07-10T14:13:47.423Z] PASS: generated source row count - db=135591, expected=135591
[2026-07-10T14:13:47.424Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-10T14:13:47.424Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-10T14:13:47.425Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-10T14:13:47.425Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-10T14:13:47.425Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-10T14:13:47.437Z] PASS: generated spot check 070970479410 - MIKE AND IKE, ORIGINAL FRUIT CANDY
[2026-07-10T14:13:47.438Z] PASS: generated spot check 024072000218 - L & W, WHOLE PEELED STRAW MUSHROOMS
[2026-07-10T14:13:47.438Z] PASS: generated spot check 810077870334 - EGGNOG
[2026-07-10T14:13:47.439Z] PASS: generated spot check 0810571031705 - NACHO FLAVOR GRAIN-FREE TORTILLA CHIPS, NACHO
[2026-07-10T14:13:47.439Z] PASS: generated spot check 041133501057 - FREEZE DRIED RICE AND CHICKEN ENTREE, RICE AND CHICKEN
[2026-07-10T14:13:47.440Z] PASS: generated spot check 739063050812 - BEEF MINI MEATBALLS, BEEF
[2026-07-10T14:13:47.440Z] PASS: generated spot check 852885003429 - HEIRLOOM JELLY, BEAVER DAM PEPPER
[2026-07-10T14:13:47.440Z] PASS: generated spot check 016741833227 - TERIYAKI MADE WITH GINGER, GARLIC AND GREEN ONIONS, PLUS GOURMET GRAINS-SEITAN, BARLEY AND QUINOA VEGGIE BURGER, TERIYAKI
[2026-07-10T14:13:47.441Z] PASS: generated spot check 846107017820 - MERLOT, PEAR BALSAMIC, CHARDONNAY & MEDITERRANEAN SALT CARAMEL COLLECTION, SALT CARAMEL
[2026-07-10T14:13:47.441Z] PASS: generated spot check 716270075289 - MILK CHOCOLATE MARSHMALLOW FILLED EGGS, MILK CHOCOLATE MARSHMALLOW
[2026-07-10T14:13:47.441Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-10T14:13:47.441Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-10T14:13:47.442Z] PASS: generated product has null/0 packaging + diet flags 070970479410 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-10T14:13:47.442Z] PASS: index exists idx_products_category
[2026-07-10T14:13:47.442Z] PASS: index exists idx_products_company
[2026-07-10T14:13:47.442Z] PASS: index exists idx_products_brand
[2026-07-10T14:13:47.442Z] PASS: index exists idx_products_search_text
[2026-07-10T14:13:47.454Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-10T14:13:47.455Z] PASS: summary table populated category_counts - rows=25
[2026-07-10T14:13:47.456Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-10T14:13:47.456Z] PASS: summary table populated company_product_counts - rows=203
[2026-07-10T14:13:47.456Z] PASS: summary table populated spotlight_company_ids - rows=64
[2026-07-10T14:13:47.457Z] PASS: summary table populated schema_meta - rows=6
[2026-07-10T14:13:47.457Z] TIMING: barcode lookup 016000275287 0.081ms
[2026-07-10T14:13:47.487Z] TIMING: LIKE search "%cheerios%" limit 6 29.995ms
[2026-07-10T14:13:47.592Z] DB size 153.69 MB.
[2026-07-10T14:13:47.593Z] Rows total=136559, generated=135591, manual=968.
[2026-07-10T14:13:47.593Z] Score rows=136559; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-10T14:13:47.593Z] Validation PASS.
