# QA Report: frozen_breakfast

## Summary
- Reviewed: 22
- PASS: 22
- FIX: 0
- REJECT: 0

## Methodology
- **A. Check digits:** All 22 barcodes validated mod-10. 21 are 12-digit UPC-A (all valid); `0018627534198` is a 13-digit EAN-13 (valid). OFF API live-verified for 3 products (077900502095 Jimmy Dean Biscuit, 705599012211 Kodiak Buttermilk, 0018627534198 Kashi 7 Grain) — all status=1 with names matching raw JSON. Remaining products documented off_verified=true in raw with matching off_product_name; live re-check rate-limited (HTTP 429) but not contradicted.
- **B. Ingredients:** Every array matches `ingredients_verbatim` (order, completeness, lowercase). Writer faithfully reproduced verbatim quirks (e.g. Van's "(that we are proud of!) water", Kodiak "and sea salt", Amy's Cheddar Burrito unclosed paren, MorningStar "fruit juice for color natural flavors", Bob Evans "formed in collagen casing"). Multi-component products (Jimmy Dean) split on verbatim periods into top-level items — consistent and accurate.
- **C. Medical claims:** None present.
- **D. companyId:** kelloggs, tyson, hormel, bob-evans, amy-kitchen, natures-path all confirmed present in companies.js. Kodiak/Van's/Good Food Made Simple correctly null with `_missingCompany`. Note: raw JSON mislabeled Bob Evans as "Tyson Foods"; writer correctly used `bob-evans` per ownership checklist (Bob Evans is Post Holdings, not Tyson). Raw used Kellanova/tyson-foods/hormel-foods/amys-kitchen hints; writer correctly resolved to existing canonical keys kelloggs/tyson/hormel/amy-kitchen.
- **E. Schema:** All 22 entries complete (all required fields + all 6 nutrition sub-fields). Outer barcode key == inner barcode value for all.
- **F. Duplicates:** None of the 22 barcodes exist in MANUAL_PRODUCTS (src/data/products.js).

## Results
### 038000402906 — Eggo Buttermilk Waffles
PASS
### 038000403200 — Eggo Blueberry Waffles
PASS
### 038000403705 — Eggo Nutri-Grain Whole Wheat Waffles
PASS
### 0018627534198 — Kashi 7 Grain Waffles
PASS
### 705599012211 — Kodiak Power Waffles Buttermilk & Vanilla
PASS
### 705599012150 — Kodiak Power Waffles Blueberry
PASS
### 089947302033 — Van's 8 Whole Grains Multigrain Waffles
PASS
### 058449590545 — Nature's Path Organic Gluten Free Homestyle Waffles
PASS
### 058449590583 — Nature's Path Organic Buckwheat Wildberry Waffles
PASS
### 077900502095 — Jimmy Dean Sausage Egg & Cheese Biscuit Sandwiches
PASS
### 077900502101 — Jimmy Dean Sausage Egg & Cheese Croissant Sandwiches
PASS
### 077900502576 — Jimmy Dean Delights Turkey Sausage Egg White & Cheese Croissant Sandwiches
PASS
### 077900650482 — Jimmy Dean Simple Scrambles Bacon
PASS
### 028989100887 — MorningStar Farms Veggie Sausage Patties Original
PASS
### 028989971401 — MorningStar Farms Veggie Sausage Patties Original 8oz
PASS
### 028989971104 — MorningStar Farms Veggie Sausage Links
PASS
### 025317006972 — Applegate Natural Chicken & Sage Breakfast Sausage
PASS
### 042272003532 — Amy's Gluten Free Cheddar Cheese Bean & Rice Burrito
PASS
### 042272000715 — Amy's Cheddar Cheese Burrito
PASS
### 080618415021 — Good Food Made Simple Southwestern Veggie Egg White Breakfast Burrito
PASS
### 075900002201 — Bob Evans Original Pork Sausage Links
PASS
### 075900000740 — Bob Evans Original Pork Sausage Links 16oz
PASS
