# Wave 02 Triage

Tiny efficient rescue wave after Wave 01.

## Green

- Campbell's Condensed Tomato Soup 10.75oz
  - Existing companyId: `campbell`
  - Exact barcode verified by Open Food Facts record: `051000000118`
  - Official Campbell page supplied current nutrition and ingredients.
  - Open Food Facts supplied matching front-can image.
- Campbell's Condensed Chicken Noodle Soup 10.75oz
  - Existing companyId: `campbell`
  - Exact barcode verified by local generated import and Open Food Facts record: `051000012517`
  - Official Campbell page supplied current nutrition and ingredients.
  - Open Food Facts supplied matching front-can image.

## Yellow Parked

- Rice-A-Roni Chicken Flavor Rice: barcode record still reports conflicting calories; keep parked.
- Perdue Short Cuts Original Roasted: official brand page and barcode record disagree on serving/nutrition; keep parked.

## Red Parked

- Hamburger Helper, Chef Boyardee, Trident Seafoods, and Gorton's remain parked until missing parent-company records are added.
- Tyson and Butterball remain parked because product-level barcode evidence is unresolved.

Expected result: 1 existing product improved and 1 net-new product merged.
