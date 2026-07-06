# Wave 1 SQLite Build Report

[2026-07-05T16:53:15.804Z] Starting offline SQLite product build.
[2026-07-05T16:53:15.834Z] Extracted 892 manual products from src/data/products.js.
[2026-07-05T16:53:15.856Z] Loaded 25 healthy category definitions and 269 companies.
[2026-07-05T16:53:15.858Z] Loaded 418 product image backfills.
[2026-07-05T16:53:15.880Z] Loaded scorer; score and grade will be precomputed.
[2026-07-05T16:53:16.814Z] Loaded 135775 generated products.
[2026-07-05T16:53:16.823Z] Inserting generated products.
[2026-07-05T16:53:18.095Z] Inserted 25000 generated rows so far.
[2026-07-05T16:53:20.010Z] Inserted 50000 generated rows so far.
[2026-07-05T16:53:22.617Z] Inserted 75000 generated rows so far.
[2026-07-05T16:53:24.927Z] Inserted 100000 generated rows so far.
[2026-07-05T16:53:27.239Z] Inserted 125000 generated rows so far.
[2026-07-05T16:53:28.365Z] Inserting manual override products.
[2026-07-05T16:53:28.444Z] Inserted 135599 generated rows and 892 manual rows; skipped 176 generated barcode collisions.
[2026-07-05T16:53:28.445Z] Creating product indexes.
[2026-07-05T16:53:29.461Z] Building summary tables.
[2026-07-05T16:53:33.412Z] Build complete in 17.61s.
[2026-07-05T16:53:33.412Z] Database: assets\db\products.db (153.65 MB), rows=136491.
[2026-07-05T16:53:33.412Z] Score precompute: worked.
[2026-07-05T16:54:01.981Z] Starting SQLite validation.
[2026-07-05T16:54:03.229Z] PASS: row count vs source JSON plus manual overrides - db=136491, expected=136491, collisions=176
[2026-07-05T16:54:03.230Z] PASS: manual source row count - db=892, expected=892
[2026-07-05T16:54:03.230Z] PASS: generated source row count - db=135599, expected=135599
[2026-07-05T16:54:03.230Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-05T16:54:03.231Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-05T16:54:03.231Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-05T16:54:03.231Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-05T16:54:03.232Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-05T16:54:03.242Z] PASS: generated spot check 011150180559 - ROUNDY'S, MICROWAVE POPCORN, LIGHT BUTTER, LIGHT BUTTER
[2026-07-05T16:54:03.242Z] PASS: generated spot check 041415376434 - PREMIUM LOWFAT FROZEN YOGURT, HARVEST PEACH MELBA
[2026-07-05T16:54:03.243Z] PASS: generated spot check 099482497255 - BUFFALO FLAVORED SPROUTED BROWN RICE CRISPS, BUFFALO
[2026-07-05T16:54:03.243Z] PASS: generated spot check 850005872214 - SALTED CARAMEL FRENCH ICE CREAM, SALTED CARAMEL
[2026-07-05T16:54:03.244Z] PASS: generated spot check 041415248809 - ROASTED RED PEPPER WITH QUESO FRESCO SMOKED CHICKEN SAUSAGE, ROASTED RED PEPPER WITH QUESO FRESCO
[2026-07-05T16:54:03.244Z] PASS: generated spot check 070552580589 - CHEDDAR & SOUR CREAM POTATO CHIPS, CHEDDAR & SOUR CREAM
[2026-07-05T16:54:03.244Z] PASS: generated spot check 855974003201 - HONEY BBQ SAUCE
[2026-07-05T16:54:03.244Z] PASS: generated spot check 028000558895 - CANDY PIECES IN MILK CHOCOLATE HEARTS SHAPED CHOCOLATES, MILK CHOCOLATE
[2026-07-05T16:54:03.245Z] PASS: generated spot check 043000085400 - DARK CHOCOLATE PEPPERMINT PATTY DESSERT KIT, DARK CHOCOLATE PEPPERMINT PATTY
[2026-07-05T16:54:03.245Z] PASS: generated spot check 052548692537 - CINNAMON CHEWS CANDY, CINNAMON CHEWS
[2026-07-05T16:54:03.245Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-05T16:54:03.245Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-05T16:54:03.246Z] PASS: generated product has null/0 packaging + diet flags 011150180559 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-05T16:54:03.246Z] PASS: index exists idx_products_category
[2026-07-05T16:54:03.246Z] PASS: index exists idx_products_company
[2026-07-05T16:54:03.246Z] PASS: index exists idx_products_brand
[2026-07-05T16:54:03.246Z] PASS: index exists idx_products_search_text
[2026-07-05T16:54:03.256Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-05T16:54:03.257Z] PASS: summary table populated category_counts - rows=25
[2026-07-05T16:54:03.257Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-05T16:54:03.257Z] PASS: summary table populated company_product_counts - rows=204
[2026-07-05T16:54:03.257Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-05T16:54:03.258Z] PASS: summary table populated schema_meta - rows=6
[2026-07-05T16:54:03.258Z] TIMING: barcode lookup 016000275287 0.078ms
[2026-07-05T16:54:03.286Z] TIMING: LIKE search "%cheerios%" limit 6 27.799ms
[2026-07-05T16:54:03.363Z] DB size 153.65 MB.
[2026-07-05T16:54:03.364Z] Rows total=136491, generated=135599, manual=892.
[2026-07-05T16:54:03.364Z] Score rows=136491; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-05T16:54:03.364Z] Validation PASS.
[2026-07-05T16:58:25.438Z] Starting SQLite validation.
[2026-07-05T16:58:26.681Z] PASS: row count vs source JSON plus manual overrides - db=136491, expected=136491, collisions=176
[2026-07-05T16:58:26.681Z] PASS: manual source row count - db=892, expected=892
[2026-07-05T16:58:26.681Z] PASS: generated source row count - db=135599, expected=135599
[2026-07-05T16:58:26.682Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-05T16:58:26.683Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-05T16:58:26.683Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-05T16:58:26.683Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-05T16:58:26.684Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-05T16:58:26.693Z] PASS: generated spot check 011150180559 - ROUNDY'S, MICROWAVE POPCORN, LIGHT BUTTER, LIGHT BUTTER
[2026-07-05T16:58:26.694Z] PASS: generated spot check 041415376434 - PREMIUM LOWFAT FROZEN YOGURT, HARVEST PEACH MELBA
[2026-07-05T16:58:26.694Z] PASS: generated spot check 099482497255 - BUFFALO FLAVORED SPROUTED BROWN RICE CRISPS, BUFFALO
[2026-07-05T16:58:26.695Z] PASS: generated spot check 850005872214 - SALTED CARAMEL FRENCH ICE CREAM, SALTED CARAMEL
[2026-07-05T16:58:26.695Z] PASS: generated spot check 041415248809 - ROASTED RED PEPPER WITH QUESO FRESCO SMOKED CHICKEN SAUSAGE, ROASTED RED PEPPER WITH QUESO FRESCO
[2026-07-05T16:58:26.695Z] PASS: generated spot check 070552580589 - CHEDDAR & SOUR CREAM POTATO CHIPS, CHEDDAR & SOUR CREAM
[2026-07-05T16:58:26.695Z] PASS: generated spot check 855974003201 - HONEY BBQ SAUCE
[2026-07-05T16:58:26.696Z] PASS: generated spot check 028000558895 - CANDY PIECES IN MILK CHOCOLATE HEARTS SHAPED CHOCOLATES, MILK CHOCOLATE
[2026-07-05T16:58:26.697Z] PASS: generated spot check 043000085400 - DARK CHOCOLATE PEPPERMINT PATTY DESSERT KIT, DARK CHOCOLATE PEPPERMINT PATTY
[2026-07-05T16:58:26.698Z] PASS: generated spot check 052548692537 - CINNAMON CHEWS CANDY, CINNAMON CHEWS
[2026-07-05T16:58:26.698Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-05T16:58:26.699Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-05T16:58:26.699Z] PASS: generated product has null/0 packaging + diet flags 011150180559 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-05T16:58:26.700Z] PASS: index exists idx_products_category
[2026-07-05T16:58:26.700Z] PASS: index exists idx_products_company
[2026-07-05T16:58:26.700Z] PASS: index exists idx_products_brand
[2026-07-05T16:58:26.700Z] PASS: index exists idx_products_search_text
[2026-07-05T16:58:26.710Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-05T16:58:26.710Z] PASS: summary table populated category_counts - rows=25
[2026-07-05T16:58:26.710Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-05T16:58:26.711Z] PASS: summary table populated company_product_counts - rows=204
[2026-07-05T16:58:26.711Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-05T16:58:26.711Z] PASS: summary table populated schema_meta - rows=6
[2026-07-05T16:58:26.712Z] TIMING: barcode lookup 016000275287 0.075ms
[2026-07-05T16:58:26.741Z] TIMING: LIKE search "%cheerios%" limit 6 29.126ms
[2026-07-05T16:58:26.823Z] DB size 153.65 MB.
[2026-07-05T16:58:26.823Z] Rows total=136491, generated=135599, manual=892.
[2026-07-05T16:58:26.824Z] Score rows=136491; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-05T16:58:26.824Z] Validation PASS.
[2026-07-05T17:17:08.144Z] Starting SQLite validation.
[2026-07-05T17:17:09.402Z] PASS: row count vs source JSON plus manual overrides - db=136491, expected=136491, collisions=176
[2026-07-05T17:17:09.402Z] PASS: manual source row count - db=892, expected=892
[2026-07-05T17:17:09.403Z] PASS: generated source row count - db=135599, expected=135599
[2026-07-05T17:17:09.404Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-05T17:17:09.404Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-05T17:17:09.405Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-05T17:17:09.405Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-05T17:17:09.405Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-05T17:17:09.415Z] PASS: generated spot check 011150180559 - ROUNDY'S, MICROWAVE POPCORN, LIGHT BUTTER, LIGHT BUTTER
[2026-07-05T17:17:09.416Z] PASS: generated spot check 041415376434 - PREMIUM LOWFAT FROZEN YOGURT, HARVEST PEACH MELBA
[2026-07-05T17:17:09.416Z] PASS: generated spot check 099482497255 - BUFFALO FLAVORED SPROUTED BROWN RICE CRISPS, BUFFALO
[2026-07-05T17:17:09.416Z] PASS: generated spot check 850005872214 - SALTED CARAMEL FRENCH ICE CREAM, SALTED CARAMEL
[2026-07-05T17:17:09.417Z] PASS: generated spot check 041415248809 - ROASTED RED PEPPER WITH QUESO FRESCO SMOKED CHICKEN SAUSAGE, ROASTED RED PEPPER WITH QUESO FRESCO
[2026-07-05T17:17:09.417Z] PASS: generated spot check 070552580589 - CHEDDAR & SOUR CREAM POTATO CHIPS, CHEDDAR & SOUR CREAM
[2026-07-05T17:17:09.417Z] PASS: generated spot check 855974003201 - HONEY BBQ SAUCE
[2026-07-05T17:17:09.417Z] PASS: generated spot check 028000558895 - CANDY PIECES IN MILK CHOCOLATE HEARTS SHAPED CHOCOLATES, MILK CHOCOLATE
[2026-07-05T17:17:09.418Z] PASS: generated spot check 043000085400 - DARK CHOCOLATE PEPPERMINT PATTY DESSERT KIT, DARK CHOCOLATE PEPPERMINT PATTY
[2026-07-05T17:17:09.418Z] PASS: generated spot check 052548692537 - CINNAMON CHEWS CANDY, CINNAMON CHEWS
[2026-07-05T17:17:09.418Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-05T17:17:09.419Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-05T17:17:09.419Z] PASS: generated product has null/0 packaging + diet flags 011150180559 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-05T17:17:09.419Z] PASS: index exists idx_products_category
[2026-07-05T17:17:09.419Z] PASS: index exists idx_products_company
[2026-07-05T17:17:09.419Z] PASS: index exists idx_products_brand
[2026-07-05T17:17:09.420Z] PASS: index exists idx_products_search_text
[2026-07-05T17:17:09.429Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-05T17:17:09.430Z] PASS: summary table populated category_counts - rows=25
[2026-07-05T17:17:09.430Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-05T17:17:09.430Z] PASS: summary table populated company_product_counts - rows=204
[2026-07-05T17:17:09.431Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-05T17:17:09.431Z] PASS: summary table populated schema_meta - rows=6
[2026-07-05T17:17:09.431Z] TIMING: barcode lookup 016000275287 0.099ms
[2026-07-05T17:17:09.460Z] TIMING: LIKE search "%cheerios%" limit 6 27.947ms
[2026-07-05T17:17:09.539Z] DB size 153.65 MB.
[2026-07-05T17:17:09.540Z] Rows total=136491, generated=135599, manual=892.
[2026-07-05T17:17:09.540Z] Score rows=136491; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-05T17:17:09.540Z] Validation PASS.
[2026-07-05T17:18:39.674Z] Starting SQLite validation.
[2026-07-05T17:18:40.909Z] PASS: row count vs source JSON plus manual overrides - db=136491, expected=136491, collisions=176
[2026-07-05T17:18:40.910Z] PASS: manual source row count - db=892, expected=892
[2026-07-05T17:18:40.910Z] PASS: generated source row count - db=135599, expected=135599
[2026-07-05T17:18:40.911Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-05T17:18:40.911Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-05T17:18:40.912Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-05T17:18:40.912Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-05T17:18:40.912Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-05T17:18:40.924Z] PASS: generated spot check 011150180559 - ROUNDY'S, MICROWAVE POPCORN, LIGHT BUTTER, LIGHT BUTTER
[2026-07-05T17:18:40.924Z] PASS: generated spot check 041415376434 - PREMIUM LOWFAT FROZEN YOGURT, HARVEST PEACH MELBA
[2026-07-05T17:18:40.925Z] PASS: generated spot check 099482497255 - BUFFALO FLAVORED SPROUTED BROWN RICE CRISPS, BUFFALO
[2026-07-05T17:18:40.925Z] PASS: generated spot check 850005872214 - SALTED CARAMEL FRENCH ICE CREAM, SALTED CARAMEL
[2026-07-05T17:18:40.926Z] PASS: generated spot check 041415248809 - ROASTED RED PEPPER WITH QUESO FRESCO SMOKED CHICKEN SAUSAGE, ROASTED RED PEPPER WITH QUESO FRESCO
[2026-07-05T17:18:40.926Z] PASS: generated spot check 070552580589 - CHEDDAR & SOUR CREAM POTATO CHIPS, CHEDDAR & SOUR CREAM
[2026-07-05T17:18:40.926Z] PASS: generated spot check 855974003201 - HONEY BBQ SAUCE
[2026-07-05T17:18:40.927Z] PASS: generated spot check 028000558895 - CANDY PIECES IN MILK CHOCOLATE HEARTS SHAPED CHOCOLATES, MILK CHOCOLATE
[2026-07-05T17:18:40.927Z] PASS: generated spot check 043000085400 - DARK CHOCOLATE PEPPERMINT PATTY DESSERT KIT, DARK CHOCOLATE PEPPERMINT PATTY
[2026-07-05T17:18:40.927Z] PASS: generated spot check 052548692537 - CINNAMON CHEWS CANDY, CINNAMON CHEWS
[2026-07-05T17:18:40.927Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-05T17:18:40.928Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-05T17:18:40.928Z] PASS: generated product has null/0 packaging + diet flags 011150180559 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-05T17:18:40.928Z] PASS: index exists idx_products_category
[2026-07-05T17:18:40.928Z] PASS: index exists idx_products_company
[2026-07-05T17:18:40.929Z] PASS: index exists idx_products_brand
[2026-07-05T17:18:40.929Z] PASS: index exists idx_products_search_text
[2026-07-05T17:18:40.938Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-05T17:18:40.939Z] PASS: summary table populated category_counts - rows=25
[2026-07-05T17:18:40.939Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-05T17:18:40.939Z] PASS: summary table populated company_product_counts - rows=204
[2026-07-05T17:18:40.939Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-05T17:18:40.940Z] PASS: summary table populated schema_meta - rows=6
[2026-07-05T17:18:40.940Z] TIMING: barcode lookup 016000275287 0.073ms
[2026-07-05T17:18:40.968Z] TIMING: LIKE search "%cheerios%" limit 6 28.358ms
[2026-07-05T17:18:41.050Z] DB size 153.65 MB.
[2026-07-05T17:18:41.050Z] Rows total=136491, generated=135599, manual=892.
[2026-07-05T17:18:41.051Z] Score rows=136491; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-05T17:18:41.051Z] Validation PASS.
[2026-07-05T17:25:46.785Z] Starting SQLite validation.
[2026-07-05T17:25:48.061Z] PASS: row count vs source JSON plus manual overrides - db=136491, expected=136491, collisions=176
[2026-07-05T17:25:48.061Z] PASS: manual source row count - db=892, expected=892
[2026-07-05T17:25:48.062Z] PASS: generated source row count - db=135599, expected=135599
[2026-07-05T17:25:48.062Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-05T17:25:48.062Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-05T17:25:48.063Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-05T17:25:48.063Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-05T17:25:48.063Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-05T17:25:48.073Z] PASS: generated spot check 011150180559 - ROUNDY'S, MICROWAVE POPCORN, LIGHT BUTTER, LIGHT BUTTER
[2026-07-05T17:25:48.074Z] PASS: generated spot check 041415376434 - PREMIUM LOWFAT FROZEN YOGURT, HARVEST PEACH MELBA
[2026-07-05T17:25:48.074Z] PASS: generated spot check 099482497255 - BUFFALO FLAVORED SPROUTED BROWN RICE CRISPS, BUFFALO
[2026-07-05T17:25:48.075Z] PASS: generated spot check 850005872214 - SALTED CARAMEL FRENCH ICE CREAM, SALTED CARAMEL
[2026-07-05T17:25:48.075Z] PASS: generated spot check 041415248809 - ROASTED RED PEPPER WITH QUESO FRESCO SMOKED CHICKEN SAUSAGE, ROASTED RED PEPPER WITH QUESO FRESCO
[2026-07-05T17:25:48.075Z] PASS: generated spot check 070552580589 - CHEDDAR & SOUR CREAM POTATO CHIPS, CHEDDAR & SOUR CREAM
[2026-07-05T17:25:48.076Z] PASS: generated spot check 855974003201 - HONEY BBQ SAUCE
[2026-07-05T17:25:48.076Z] PASS: generated spot check 028000558895 - CANDY PIECES IN MILK CHOCOLATE HEARTS SHAPED CHOCOLATES, MILK CHOCOLATE
[2026-07-05T17:25:48.076Z] PASS: generated spot check 043000085400 - DARK CHOCOLATE PEPPERMINT PATTY DESSERT KIT, DARK CHOCOLATE PEPPERMINT PATTY
[2026-07-05T17:25:48.076Z] PASS: generated spot check 052548692537 - CINNAMON CHEWS CANDY, CINNAMON CHEWS
[2026-07-05T17:25:48.077Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-05T17:25:48.077Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-05T17:25:48.077Z] PASS: generated product has null/0 packaging + diet flags 011150180559 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-05T17:25:48.077Z] PASS: index exists idx_products_category
[2026-07-05T17:25:48.077Z] PASS: index exists idx_products_company
[2026-07-05T17:25:48.078Z] PASS: index exists idx_products_brand
[2026-07-05T17:25:48.078Z] PASS: index exists idx_products_search_text
[2026-07-05T17:25:48.087Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-05T17:25:48.087Z] PASS: summary table populated category_counts - rows=25
[2026-07-05T17:25:48.087Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-05T17:25:48.087Z] PASS: summary table populated company_product_counts - rows=204
[2026-07-05T17:25:48.088Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-05T17:25:48.088Z] PASS: summary table populated schema_meta - rows=6
[2026-07-05T17:25:48.088Z] TIMING: barcode lookup 016000275287 0.079ms
[2026-07-05T17:25:48.116Z] TIMING: LIKE search "%cheerios%" limit 6 27.785ms
[2026-07-05T17:25:48.196Z] DB size 153.65 MB.
[2026-07-05T17:25:48.196Z] Rows total=136491, generated=135599, manual=892.
[2026-07-05T17:25:48.196Z] Score rows=136491; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-05T17:25:48.197Z] Validation PASS.
[2026-07-05T17:33:03.455Z] Starting SQLite validation.
[2026-07-05T17:33:04.683Z] PASS: row count vs source JSON plus manual overrides - db=136491, expected=136491, collisions=176
[2026-07-05T17:33:04.683Z] PASS: manual source row count - db=892, expected=892
[2026-07-05T17:33:04.683Z] PASS: generated source row count - db=135599, expected=135599
[2026-07-05T17:33:04.684Z] PASS: manual override spot check 016000275287 - Cheerios Original
[2026-07-05T17:33:04.685Z] PASS: manual override spot check 016000275270 - Honey Nut Cheerios
[2026-07-05T17:33:04.685Z] PASS: manual override spot check 038000845024 - Kellogg's Frosted Flakes
[2026-07-05T17:33:04.685Z] PASS: manual override spot check 016000275799 - Lucky Charms
[2026-07-05T17:33:04.686Z] PASS: manual override spot check 030000013465 - Quaker Instant Oatmeal Maple Brown Sugar
[2026-07-05T17:33:04.696Z] PASS: generated spot check 011150180559 - ROUNDY'S, MICROWAVE POPCORN, LIGHT BUTTER, LIGHT BUTTER
[2026-07-05T17:33:04.696Z] PASS: generated spot check 041415376434 - PREMIUM LOWFAT FROZEN YOGURT, HARVEST PEACH MELBA
[2026-07-05T17:33:04.697Z] PASS: generated spot check 099482497255 - BUFFALO FLAVORED SPROUTED BROWN RICE CRISPS, BUFFALO
[2026-07-05T17:33:04.697Z] PASS: generated spot check 850005872214 - SALTED CARAMEL FRENCH ICE CREAM, SALTED CARAMEL
[2026-07-05T17:33:04.697Z] PASS: generated spot check 041415248809 - ROASTED RED PEPPER WITH QUESO FRESCO SMOKED CHICKEN SAUSAGE, ROASTED RED PEPPER WITH QUESO FRESCO
[2026-07-05T17:33:04.697Z] PASS: generated spot check 070552580589 - CHEDDAR & SOUR CREAM POTATO CHIPS, CHEDDAR & SOUR CREAM
[2026-07-05T17:33:04.698Z] PASS: generated spot check 855974003201 - HONEY BBQ SAUCE
[2026-07-05T17:33:04.698Z] PASS: generated spot check 028000558895 - CANDY PIECES IN MILK CHOCOLATE HEARTS SHAPED CHOCOLATES, MILK CHOCOLATE
[2026-07-05T17:33:04.698Z] PASS: generated spot check 043000085400 - DARK CHOCOLATE PEPPERMINT PATTY DESSERT KIT, DARK CHOCOLATE PEPPERMINT PATTY
[2026-07-05T17:33:04.698Z] PASS: generated spot check 052548692537 - CINNAMON CHEWS CANDY, CINNAMON CHEWS
[2026-07-05T17:33:04.699Z] PASS: manual packaging_json populated 014500021830 - Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz
[2026-07-05T17:33:04.699Z] PASS: manual diet flags populated 014500021830 - isOrganic=0, isVegan=1, isGlutenFree=1
[2026-07-05T17:33:04.699Z] PASS: generated product has null/0 packaging + diet flags 011150180559 - packaging_json=null, isOrganic=0, isVegan=0, isGlutenFree=0
[2026-07-05T17:33:04.699Z] PASS: index exists idx_products_category
[2026-07-05T17:33:04.700Z] PASS: index exists idx_products_company
[2026-07-05T17:33:04.700Z] PASS: index exists idx_products_brand
[2026-07-05T17:33:04.700Z] PASS: index exists idx_products_search_text
[2026-07-05T17:33:04.710Z] PASS: summary category count sanity beverages - summary=49, direct=49
[2026-07-05T17:33:04.710Z] PASS: summary table populated category_counts - rows=25
[2026-07-05T17:33:04.710Z] PASS: summary table populated category_hero_images - rows=25
[2026-07-05T17:33:04.710Z] PASS: summary table populated company_product_counts - rows=204
[2026-07-05T17:33:04.711Z] PASS: summary table populated spotlight_company_ids - rows=65
[2026-07-05T17:33:04.711Z] PASS: summary table populated schema_meta - rows=6
[2026-07-05T17:33:04.712Z] TIMING: barcode lookup 016000275287 0.082ms
[2026-07-05T17:33:04.740Z] TIMING: LIKE search "%cheerios%" limit 6 27.823ms
[2026-07-05T17:33:04.822Z] DB size 153.65 MB.
[2026-07-05T17:33:04.822Z] Rows total=136491, generated=135599, manual=892.
[2026-07-05T17:33:04.822Z] Score rows=136491; scorer meta=scoreProduct imported through VM bundle; score and grade precomputed.
[2026-07-05T17:33:04.823Z] Validation PASS.
