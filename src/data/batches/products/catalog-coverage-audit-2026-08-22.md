# Catalog coverage audit — 2026-08-22

Status: IN PROGRESS — deterministic catalog audit complete; candidate-product verification remains.

## Scope and method

- Source: shipping `assets/db/products.db`, manifest version `2026-08-17-1`.
- Catalog: 1,098 manually reviewed products; generated fallback products excluded.
- Scores: the app's precomputed scorer output, never estimated by the auditor.
- Strong option: score 80 or higher.
- Initial aisle target: at least 12 strong products with meaningful brand variety. Categories structurally unable to reach 80 because of an evidence-based scorer cap must instead show the best available products honestly.

## Catalog snapshot

- 1,098 total reviewed products
- 438 products score 80+
- 100% have scores, categories, ingredient lists, nutrition, and company IDs
- 159 lack an image
- Score range: 0–100; mean 59.2

## Shopper-facing aisle coverage

| Aisle | Total | 80+ | 80+ brands | Priority |
|---|---:|---:|---:|---|
| Frozen Breakfast | 38 | 0 | 0 | Critical |
| Deli & Lunch | 58 | 3 | 3 | Structural review |
| Granola | 31 | 3 | 3 | Critical |
| Frozen Meals | 84 | 5 | 5 | Critical |
| Bread | 42 | 5 | 4 | Critical |
| Coffee Creamer | 33 | 6 | 3 | High |
| Snack Bars | 50 | 11 | 7 | Near target |
| Yogurt | 31 | 13 | 10 | Covered |
| Soups & Broths | 34 | 15 | 5 | Brand-concentrated |
| Canned Goods | 42 | 16 | 15 | Covered, overly broad |
| Nuts & Trail Mix | 31 | 18 | 9 | Covered |
| Beverages | 49 | 18 | 17 | Covered, overly broad |
| Chips & Crackers | 107 | 18 | 12 | Covered as one tile; subtypes differ materially |
| Condiments & Sauces | 40 | 18 | 15 | Covered |
| Pasta & Grains | 26 | 19 | 16 | Covered |
| Cheese & Dairy | 25 | 20 | 17 | Covered as one tile; dairy subtypes are thin |
| Eggs | 34 | 20 | 12 | Covered |
| Pasta Sauce | 34 | 20 | 12 | Covered |
| Plant-Based Milk | 28 | 23 | 19 | Covered |
| Nut Butters | 45 | 24 | 13 | Covered |
| Cereal | 68 | 30 | 16 | Covered |
| Baby Food | 32 | 30 | 7 | Covered, brand-concentrated |
| Coffee & Tea | 37 | 33 | 18 | Covered |
| Frozen Veg & Fruit | 38 | 34 | 12 | Covered |
| Oils & Vinegars | 29 | 29 | 23 | Covered |

## Structural findings

1. `Chips`, `Crackers`, and `Chips & Crackers` are three database labels but already map to one shopper tile. Keep one shopper aisle and normalize future entries to `Chips & Crackers`; consider filters for chips, popcorn/puffs, and crackers.
2. `Deli Meat`, `Deli & Lunch`, and `Kids Lunch` map to one tile, but its three 80+ products are hummus. Processed/cured meat is intentionally capped at 40 by the scorer, so a goal of 12 deli meats scoring 80+ is impossible and undesirable. Split `Dips & Hummus`, `Deli Meat`, and `Kids Lunch`; use an honest best-available treatment for capped deli meat.
3. `Frozen Meals` and `Packaged Meals` share one tile. Keep the shopper tile if desired, but store a frozen/shelf-stable subtype so alternatives compare like with like.
4. `Peanut Butter` and `Nut Butters` already share one tile. Normalize future entries to one category plus a nut/seed subtype.
5. `Cheese & Dairy`, `Beverages`, and `Canned Goods` look healthy only because unlike products are pooled. Their major shopper subcategories need separate coverage measurements.

## Missing or materially underrepresented shopper categories

These are absent as shopper aisles or too thin to be useful:

- Dairy Milk (only three obvious dairy-milk products)
- Butter, Cream & Dairy Basics (two obvious butter products; cottage cheese and sour cream are also thin)
- Fresh/Packaged Produce and Salad Kits (no salad-kit products; include only scannable packaged items)
- Fresh Meat & Poultry
- Seafood (fresh/frozen/canned seafood needs a deliberate subtype split)
- Dips, Salsa & Hummus
- Tortillas, Wraps, Pitas & Buns
- Frozen Pizza
- Ice Cream & Frozen Desserts
- Baking Essentials & Mixes
- Spices & Seasonings
- Cookies & Sweet Snacks
- Candy & Chocolate
- Juice & Smoothies
- Water & Sparkling Water
- Soda & Functional Drinks
- Canned Beans & Legumes
- Canned Vegetables & Fruit
- Canned Fish & Seafood
- Pasta/Noodles/Ramen as distinct shopper filters

## Expansion order

### Wave group 1 — repair current empty/thin healthy aisles

1. Frozen Breakfast
2. Granola, prioritizing no-added-sugar products
3. Bread, prioritizing sprouted/whole-grain products
4. Coffee Creamer, prioritizing unsweetened products
5. Frozen Meals and shelf-stable meals
6. Snack Bars, adding brand diversity rather than duplicate flavors

### Wave group 2 — create missing everyday staples

1. Dairy Milk; Butter, Cream & Dairy Basics
2. Fresh Meat & Poultry; Seafood
3. Dips, Salsa & Hummus
4. Tortillas, Wraps, Pitas & Buns
5. Baking Essentials; Spices & Seasonings
6. Canned-food subcategories

### Wave group 3 — complete the store, including categories where 80+ may be rare

1. Frozen Pizza
2. Ice Cream & Frozen Desserts
3. Cookies & Sweet Snacks
4. Candy & Chocolate
5. Beverage subcategories
6. Packaged Produce & Salad Kits

## Initial candidate slate for verification

This is a research queue, not approved product data. Exact SKUs may enter the catalog only after UPC and label verification and a real scorer run.

### Frozen Breakfast

- Food for Life Ezekiel 4:9 Sprouted Grain Original, Golden Flax, Blueberry, and Apple Nut Waffles
- Additional Nature's Path Organic waffle varieties beyond the two already cataloged, especially Flax Plus and Chia Plus
- Minimally formulated frozen breakfast burritos or bowls from Amy's and similar brands, screened for sodium and refined-grain penalties

### Granola

- Struesli Original and other no-added-sweetener varieties
- Wildway no-added-sugar grain-free granola varieties
- Lark Ellen Farm sprouted granola varieties
- Other no-added-sugar candidates from Seven Sundays or current Purely Elizabeth lines

The catalog currently has no Struesli, Wildway, or Lark Ellen products. These brands should be researched before adding more flavors from brands already represented.

### Bread

- Food for Life Ezekiel 4:9 Sesame, Flax, Low Sodium, and 7 Sprouted Grains breads
- Additional Silver Hills sprouted loaves
- Alvarado Street Bakery sprouted breads
- Angelic Bakehouse sprouted breads
- Base Culture and Simple Kneads products where exact labels survive scorer review

The catalog currently has one Food for Life loaf and one Silver Hills loaf; the other named brands are absent.

### Coffee Creamer

- Elmhurst Unsweetened Cashew Creamer
- Califia Farms Unsweetened Almond Creamer and Unsweetened Oat Creamer
- Additional nutpods unsweetened varieties, but only after adding other brands for diversity
- Unsweetened candidates from Forager Project, Three Trees, or similar brands if sold as actual creamers with verifiable labels

The catalog already has two nutpods products and one high-scoring Califia creamer. Flavor duplication alone will not solve the three-brand concentration problem.

### Snack Bars

- Additional RXBAR and That's It varieties only when ingredient lists materially differ
- Kate's Real Food
- Autumn's Gold
- Skout Organic
- Additional Larabar varieties after normalizing the catalog's malformed `L�rabar` brand text

The catalog already contains RXBAR, That's It, GoMacro, and 88 Acres entries. Candidate selection should favor absent brands over flavor proliferation.

### Missing-category starter families

- Dairy Milk: more plain dairy-milk fat levels and brands, not flavored line extensions
- Butter & Dairy Basics: butter, heavy cream, cottage cheese, sour cream, and plain kefir
- Meat & Poultry: single-ingredient fixed-UPC chicken, turkey, beef, and pork products
- Seafood: plain canned and frozen salmon, tuna, sardines, shrimp, and white fish
- Dips: hummus, guacamole, bean dips, and minimally formulated salsa
- Baking: whole-grain and alternative flours, yeast, baking powder/soda, and lower-sugar mixes
- Spices: single spices, salt-free blends, and common seasoning blends
- Frozen Pizza and Frozen Desserts: best-available products, without assuming the category can supply twelve 80+ scores

## Candidate research guardrails

- Candidate names are leads, not approved additions.
- Every added SKU still requires a verified UPC, exact label ingredients, nutrition, company mapping, category, and image workflow.
- Run the real app scorer only after verified product data exists; never predict or promise an 80+ score.
- Where no product can legitimately reach 80, retain the category and label its highest-scoring products as best available rather than changing the scorer to manufacture coverage.
