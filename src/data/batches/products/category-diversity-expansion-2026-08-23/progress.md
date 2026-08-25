# Category diversity expansion

Updated: 2026-08-23

## Rules

- Goal: at least five score-80+ brands and five parent companies per feasible category.
- Same-brand flavors and minor variants count once for diversity.
- Deep-fried chips are capped at 50 and baked, popped, or puffed chip analogues at 65; these use a five-brand best-available target instead of an impossible 80+ target.
- Ordinary crackers are not automatically form-capped and retain the 80+ goal.
- No product is promoted without an exact verified barcode, current ingredients, serving nutrition, company owner, and reviewed image.

## Cleanup checkpoint

- Consolidate `Chips` and `Crackers` into `Chips & Crackers`.
- Consolidate `Peanut Butter` into `Nut Butters`.
- Move processed meats from `Deli & Lunch` into `Deli Meat`.
- Move the three misplaced hummus products into `Dips & Hummus`.
- Correct legacy Planters records from Kraft Heinz to Hormel using current official Hormel ownership evidence.

## Expansion order

1. Frozen Breakfast
2. Packaged Meals
3. Kids Lunch
4. Dips & Hummus
5. Deli Meat
6. Bread
7. Granola
8. Meat & Seafood / Primary Proteins
9. Nut Butters
10. Soups & Broths

Status: complete pending final independent review.

## Post-cleanup baseline

| Category | 80+ brands | 80+ owners | Remaining requirement |
|---|---:|---:|---|
| Frozen Breakfast | 1 | 1 | 4 brands and owners |
| Packaged Meals | 1 | 1 | 4 brands and owners |
| Kids Lunch | 0 | 0 | best available from 2 additional owners, then reassess |
| Dips & Hummus | 5 | 4 | 1 owner |
| Deli Meat | 0 | 0 | complete under best-available rule: 12 brands, 8 owners, maximum score 40 |
| Bread | 4 | 3 | 2 brands and owners |
| Granola | 4 | 4 | 1 brand and owner |
| Meat & Seafood / Primary Proteins | 4 | 3 | 2 brands and owners |
| Nut Butters | 13 | 10 | complete |
| Soups & Broths | 5 | 3 | 2 brands and owners |

Database rebuild and validation passed with 1,128 products. Full lint and test run passed: 23 suites, 634 tests.

## Final checkpoint

- Added 18 fully researched products with verified ownership and reviewed exact-package images.
- Reclassified three existing high-scoring lunchbox staples into `Kids Lunch`, preserving distinct brands and owners.
- Final database: 1,146 products.

| Category | 80+ products | 80+ brands | 80+ owners | Result |
|---|---:|---:|---:|---|
| Frozen Breakfast | 9 | 5 | 5 | Complete |
| Packaged Meals | 5 | 5 | 5 | Complete |
| Kids Lunch | 5 | 5 | 5 | Complete |
| Dips & Hummus | 9 | 6 | 5 | Complete |
| Deli Meat | 0 | 0 | 0 | Complete under best-available rule; maximum possible catalog score is 40 |
| Bread | 12 | 6 | 5 | Complete |
| Granola | 7 | 5 | 5 | Complete |
| Meat & Seafood / Primary Proteins | 9 | 6 | 5 | Complete |
| Nut Butters | 24 | 13 | 10 | Complete |
| Soups & Broths | 17 | 7 | 5 | Complete |
| Chips & Crackers | 18 | 12 | 11 | Complete at combined-category level; fried and puffed chip forms remain score-capped |

SQLite build and validation pass. Full lint and tests pass: 23 suites, 634 tests.
