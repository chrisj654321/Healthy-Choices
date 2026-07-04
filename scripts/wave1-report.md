# Wave 1 SQLite Build Report

[2026-07-04T19:22:01.890Z] Starting offline SQLite product build.
[2026-07-04T19:22:01.931Z] Extracted 892 manual products from src/data/products.js.
[2026-07-04T19:22:01.941Z] Loaded 25 healthy category definitions and 269 companies.
[2026-07-04T19:22:01.942Z] Loaded 418 product image backfills.
[2026-07-04T19:22:01.964Z] Loaded scorer; score and grade will be precomputed.
[2026-07-04T19:22:02.907Z] Loaded 135775 generated products.
[2026-07-04T19:22:02.911Z] Inserting generated products.
[2026-07-04T19:22:04.310Z] Inserted 25000 generated rows so far.
[2026-07-04T19:22:05.669Z] Inserted 50000 generated rows so far.
[2026-07-04T19:22:06.973Z] Inserted 75000 generated rows so far.
[2026-07-04T19:22:08.226Z] Inserted 100000 generated rows so far.
[2026-07-04T19:22:09.585Z] Inserted 125000 generated rows so far.
[2026-07-04T19:22:10.120Z] Inserting manual override products.
[2026-07-04T19:22:10.157Z] Inserted 135599 generated rows and 892 manual rows; skipped 176 generated barcode collisions.
[2026-07-04T19:22:10.158Z] Creating product indexes.
[2026-07-04T19:22:10.724Z] Building summary tables.
[2026-07-04T19:22:12.732Z] Build complete in 10.84s.
[2026-07-04T19:22:12.733Z] Database: assets\db\products.db (152.93 MB), rows=136491.
[2026-07-04T19:22:12.733Z] Score precompute: worked.
[2026-07-04T19:22:15.593Z] Starting SQLite validation.
[2026-07-04T19:22:16.842Z] PASS: row count vs source JSON plus manual overrides - db=136491, expected=136491, collisions=176
[2026-07-04T19:22:16.843Z] PASS: manual source row count - db=892, expected=892
[2026-07-04T19:22:16.843Z] PASS: generated source row count - db=135599, expected=135599
[2026-07-04T19:22:16.846Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-04T19:22:16.846Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-04T19:22:16.847Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-04T19:22:16.847Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-04T19:22:16.847Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-04T19:22:16.857Z] PASS: generated spot check 011150180559 - ROUNDY'S, MICROWAVE POPCORN, LIGHT BUTTER, LIGHT BUTTER
[2026-07-04T19:22:16.858Z] PASS: generated spot check 041415376434 - PREMIUM LOWFAT FROZEN YOGURT, HARVEST PEACH MELBA
[2026-07-04T19:22:16.858Z] PASS: generated spot check 099482497255 - BUFFALO FLAVORED SPROUTED BROWN RICE CRISPS, BUFFALO
[2026-07-04T19:22:16.858Z] PASS: generated spot check 850005872214 - SALTED CARAMEL FRENCH ICE CREAM, SALTED CARAMEL
[2026-07-04T19:22:16.859Z] PASS: generated spot check 041415248809 - ROASTED RED PEPPER WITH QUESO FRESCO SMOKED CHICKEN SAUSAGE, ROASTED RED PEPPER WITH QUESO FRESCO
[2026-07-04T19:22:16.859Z] PASS: generated spot check 070552580589 - CHEDDAR & SOUR CREAM POTATO CHIPS, CHEDDAR & SOUR CREAM
[2026-07-04T19:22:16.859Z] PASS: generated spot check 855974003201 - HONEY BBQ SAUCE
[2026-07-04T19:22:16.860Z] PASS: generated spot check 028000558895 - CANDY PIECES IN MILK CHOCOLATE HEARTS SHAPED CHOCOLATES, MILK CHOCOLATE
[2026-07-04T19:22:16.860Z] PASS: generated spot check 043000085400 - DARK CHOCOLATE PEPPERMINT PATTY DESSERT KIT, DARK CHOCOLATE PEPPERMINT PATTY
[2026-07-04T19:22:16.860Z] PASS: generated spot check 052548692537 - CINNAMON CHEWS CANDY, CINNAMON CHEWS
[2026-07-04T19:22:16.861Z] PASS: index exists idx_products_category
[2026-07-04T19:22:16.861Z] PASS: index exists idx_products_company
[2026-07-04T19:22:16.862Z] PASS: index exists idx_products_brand
[2026-07-04T19:22:16.862Z] PASS: index exists idx_products_search_text
[2026-07-04T19:22:16.871Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-04T19:22:16.871Z] PASS: summary table populated category_counts - rows=25
[2026-07-04T19:22:16.872Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-04T19:22:16.872Z] PASS: summary table populated company_product_counts - rows=204
[2026-07-04T19:22:16.872Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-04T19:22:16.872Z] PASS: summary table populated schema_meta - rows=6
[2026-07-04T19:22:16.873Z] TIMING: barcode lookup 016000275287 0.077ms
[2026-07-04T19:22:16.898Z] TIMING: LIKE search "%cheerios%" limit 6 25.318ms
[2026-07-04T19:22:16.973Z] DB size 152.93 MB.
[2026-07-04T19:22:16.973Z] Rows total=136491, generated=135599, manual=892.
[2026-07-04T19:22:16.974Z] Score rows=136491; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-04T19:22:16.974Z] Validation PASS.
[2026-07-04T19:22:53.612Z] Starting SQLite validation.
[2026-07-04T19:22:54.855Z] PASS: row count vs source JSON plus manual overrides - db=136491, expected=136491, collisions=176
[2026-07-04T19:22:54.856Z] PASS: manual source row count - db=892, expected=892
[2026-07-04T19:22:54.856Z] PASS: generated source row count - db=135599, expected=135599
[2026-07-04T19:22:54.857Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-04T19:22:54.858Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-04T19:22:54.858Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-04T19:22:54.859Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-04T19:22:54.859Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-04T19:22:54.870Z] PASS: generated spot check 011150180559 - ROUNDY'S, MICROWAVE POPCORN, LIGHT BUTTER, LIGHT BUTTER
[2026-07-04T19:22:54.870Z] PASS: generated spot check 041415376434 - PREMIUM LOWFAT FROZEN YOGURT, HARVEST PEACH MELBA
[2026-07-04T19:22:54.871Z] PASS: generated spot check 099482497255 - BUFFALO FLAVORED SPROUTED BROWN RICE CRISPS, BUFFALO
[2026-07-04T19:22:54.871Z] PASS: generated spot check 850005872214 - SALTED CARAMEL FRENCH ICE CREAM, SALTED CARAMEL
[2026-07-04T19:22:54.871Z] PASS: generated spot check 041415248809 - ROASTED RED PEPPER WITH QUESO FRESCO SMOKED CHICKEN SAUSAGE, ROASTED RED PEPPER WITH QUESO FRESCO
[2026-07-04T19:22:54.872Z] PASS: generated spot check 070552580589 - CHEDDAR & SOUR CREAM POTATO CHIPS, CHEDDAR & SOUR CREAM
[2026-07-04T19:22:54.872Z] PASS: generated spot check 855974003201 - HONEY BBQ SAUCE
[2026-07-04T19:22:54.873Z] PASS: generated spot check 028000558895 - CANDY PIECES IN MILK CHOCOLATE HEARTS SHAPED CHOCOLATES, MILK CHOCOLATE
[2026-07-04T19:22:54.874Z] PASS: generated spot check 043000085400 - DARK CHOCOLATE PEPPERMINT PATTY DESSERT KIT, DARK CHOCOLATE PEPPERMINT PATTY
[2026-07-04T19:22:54.874Z] PASS: generated spot check 052548692537 - CINNAMON CHEWS CANDY, CINNAMON CHEWS
[2026-07-04T19:22:54.875Z] PASS: index exists idx_products_category
[2026-07-04T19:22:54.875Z] PASS: index exists idx_products_company
[2026-07-04T19:22:54.875Z] PASS: index exists idx_products_brand
[2026-07-04T19:22:54.876Z] PASS: index exists idx_products_search_text
[2026-07-04T19:22:54.888Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-04T19:22:54.889Z] PASS: summary table populated category_counts - rows=25
[2026-07-04T19:22:54.889Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-04T19:22:54.890Z] PASS: summary table populated company_product_counts - rows=204
[2026-07-04T19:22:54.890Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-04T19:22:54.891Z] PASS: summary table populated schema_meta - rows=6
[2026-07-04T19:22:54.891Z] TIMING: barcode lookup 016000275287 0.115ms
[2026-07-04T19:22:54.922Z] TIMING: LIKE search "%cheerios%" limit 6 30.338ms
[2026-07-04T19:22:55.017Z] DB size 152.93 MB.
[2026-07-04T19:22:55.018Z] Rows total=136491, generated=135599, manual=892.
[2026-07-04T19:22:55.018Z] Score rows=136491; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-04T19:22:55.018Z] Validation PASS.
