# Wave 02 Merge Notes

Merged on 2026-06-28.

## Merged Into `src/data/products.js`

1 existing product improved:

- Campbell's Condensed Tomato Soup 10.75oz

1 net-new product added:

- Campbell's Condensed Chicken Noodle Soup 10.75oz

## Sources Used

- Campbell official product pages for current label nutrition and ingredients.
- Open Food Facts exact barcode records for front product images and barcode identity.
- Existing `campbell` company entry in `src/data/companies.js`.

## Not Merged

- Rice-A-Roni Chicken Flavor Rice: calorie conflict remains unresolved.
- Perdue Short Cuts Original Roasted: source conflict remains unresolved.
- Products requiring new parent company entries remain parked for a company-profile wave.

## Verification

- `node --check src/data/products.js` passed.
- Duplicate barcode scan passed.
- Net-new barcode `051000012517` is present.
