# Score-drift report — scorer form-penalty model (2026-08-17)

**Do not commit.** This report is for founder review before `src/utils/scorer.js`, `src/utils/__tests__/scorer.test.js`, and the rebuilt `assets/db/products.db` are committed.

## What changed

Four new rules were added to `scoreProduct()` in `src/utils/scorer.js`, applied as the FINAL step after the existing scoring pipeline (base ingredient scoring with Rule 4 folded in -> Rule 3's -25 subtraction -> Rule 1/2 hard caps as the true final ceiling):

- **Rule 1 — processed/cured meat -> hard cap 40.** Triggered by nitrate/nitrite anywhere in the ingredient list, OR a cured/processed-meat term in the product's name (hot dog, frank, frankfurter, wiener, sausage, bacon, salami, pepperoni, bologna, mortadella, prosciutto, deli meat, lunch/luncheon meat, ham, corned beef, pastrami, jerky, kielbasa, bratwurst, chorizo, hot link, vienna sausage, spam, potted meat), OR the product is filed under this catalog's own `Deli & Lunch`/`Deli Meat` category AND contains a real meat/poultry word (catches plain "uncured turkey breast" deli slices with no disclosed nitrite — WHO Group 1 covers the salting/curing/slicing process itself, not only a nitrite label word).
- **Rule 2 — fried snack -> hard cap 50.** Gated to this catalog's actual chip/snack categories (`Chips`, `Chips & Crackers`, `Snacks`) so bare trigger words like "puff," "kettle," or "crisp" can't false-fire on unrelated foods (baby food puffs, bone broth, cereal). Triggered by chip/crisp/kettle/fried/puff/curl/pork-rind terms in the name. An explicit "oven baked" claim exempts a product (baked, not fried).
- **Rule 3 — refined-grain #1 ingredient -> -25 point penalty** (a subtraction, not a cap — floored at 0). Fires only when the FIRST (primary-by-weight) ingredient is enriched/white/bleached flour or white/refined rice flour.
- **Rule 4 — snack/frying oils -> neutral, never a positive.** Avocado, canola, sunflower, safflower, soybean, and "vegetable" oil no longer grant a free "whole food" pass — either through the `WHOLE_FOOD_WORDS` fallback classifier (a whole avocado still gets credit; the OIL pressed from it does not), or through the UPF-marker/ceiling system for the specific oils that were resolving to a Low-risk/'ok' flag and silently never counting as a processing marker (the exact mechanism that let a fried chip reach the "whole-food-clean" ceiling on the strength of its claimed frying oil).

All four rules are named constants at the top of the new section in `scorer.js` (`PROCESSED_CURED_MEAT_CAP`, `FRIED_SNACK_CAP`, `REFINED_GRAIN_PENALTY`, and the full term/category word lists), exactly as the spec required — tunable without touching the detection logic.

## Two real false positives found by this drift audit, and fixed in the same pass

1. **"Frank's RedHot Original Cayenne Pepper Sauce" (96 -> would have been 40)** — bare "frank" word-boundary-matched the possessive brand name "Frank's" (the apostrophe is a non-word character, so "Frank" reads as its own whole word to a `\b` regex). A hot sauce is not a hot dog. Fixed by stripping `frank's`/`franks'` from a working copy of the name before the main term regex runs. **Final result: unchanged at 96, correctly excluded from the drift table above.**
2. **"Wonder Classic Enriched Hot Dog Buns" (would have wrongly shown Rule 1 firing)** — the literal phrase "hot dog" appears inside a BREAD product's name (a bun to hold a hot dog, not the hot dog itself). Fixed by stripping "hot dog buns"/"frankfurter buns" from the name before testing. **Final result: still moves (73 -> 0), but now correctly ONLY via Rule 3's refined-grain penalty (its own enriched-flour #1 ingredient), never via Rule 1.** See row in the table above.

A third accuracy gap (not a mover, so it never reached the printed table, but a real latent miscategorization) was also caught and fixed: **"MorningStar Farms Veggie Sausage Patties Original" and "... Links"** (soy/wheat-gluten products, `isVegan: true`) were matching Rule 1's bare "sausage" name trigger even though they contain no meat. Fixed by exempting any product the catalog's own schema already declares `isVegan: true` from the name/category meat-word triggers (nitrite detection is intentionally NOT exempted — a nitrite is a real curing-agent concern independent of protein source). Two other MorningStar SKUs that contain real egg whites/dairy (`isVegan: false`, genuinely not vegan, just not real meat either) still trip Rule 1 on "sausage" — a known, documented, low-priority residual gap (doesn't move any visible score in this catalog; every affected SKU was already at/below the cap).

## The drift table

Before/after: BEFORE = `git HEAD` scorer.js (pre-form-penalty). AFTER = the working-tree scorer.js this session built. Both scorers run through the same VM-bundle technique `scripts/catalog-database/build-products-sqlite.js` itself uses, against all 1,092 products in `src/data/products.js`.

**142 of 1,092 products moved. 950 unchanged. Every single mover moved DOWN — zero moved up.**

### Full list of every product whose score changed

| Score | Rule | Category | Brand | Product |
|---|---|---|---|---|
| 45 → 20 | Rule 3 — refined-grain #1 ingredient, −25 | Baby Food | Gerber | Banana cookies imp |
| 96 → 91 | Rule 4 — snack/frying oil marker (UPF ceiling) | Baby Food | Gerber | Gerber Lil' Crunchies Mild Cheddar |
| 45 → 20 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Arnold | Arnold Country White Bread 24oz |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Wonder | Bread white |
| 12 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Entenmann's | Cinnamon donuts, cinnamon |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Wonder | Classic Enriched Hot Dog Buns |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Wonder | Classic Hamburger Buns |
| 18 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Thomas | English Muffins |
| 19 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | THOMAS' | English Muffins |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Thomas | English Muffins Blueberry |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | THOMAS' | English Muffins Cinnamon Raisin |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Thomas' | English Muffins Sourdough |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Wonder Spoleto | Italian style bread |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | King's Hawaiian | King's Hawaiian Original Hawaiian Sweet Rolls 12ct |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | THOMAS' | Light Multi Grain English Muffins |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Martin's | Martin's Famous Potato Rolls 12ct Sliced (15oz) |
| 25 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Nature's Own | Nature's Own Honey Wheat Bread 20oz |
| 23 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Old El Paso | Old El Paso Flour Tortillas for Soft Tacos & Fajitas 10ct |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Thomas' | Original English Muffins |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Pepperidge Farm | Pepperidge Farm Farmhouse Hearty White Bread 24oz |
| 12 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Entenmann's | Powdered Donuts |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Entenmann's | Softies Plain Donuts |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Thomas' | Thomas' Original English Muffins 12ct |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Wonder | Wonder Classic White Bread |
| 23 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Bread | Wonder | Wonder Classic White Bread 20oz |
| 65 → 40 | Rule 1 — processed/cured meat, cap 40 | Canned Goods | Campbell's | Campbell's Split Pea With Ham and Bacon Soup 11.5oz |
| 96 → 91 | Rule 4 — snack/frying oil marker (UPF ceiling) | Cereals | Magic Spoon | Magic Spoon Frosted |
| 74 → 50 | Rule 2 — fried snack, cap 50 | Chips | Lay's | Lay's Classic Potato Chips |
| 90 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Angie's BOOMCHICKAPOP | Angie's BOOMCHICKAPOP Sweet & Salty Kettle Corn |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Beanitos | Beanitos Black Bean Chips Original Sea Salt |
| 96 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Boulder Canyon | Boulder Canyon Avocado Oil Classic Sea Salt Kettle Chips |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Cape Cod | Cape Cod Less Fat Original Kettle Cooked Potato Chips |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Cape Cod | Cape Cod Original Kettle Style Potato Chips |
| 78 → 53 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Carr's | Carr's Table Water Crackers |
| 56 → 31 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Sunshine | Cheez-It Crackers |
| 38 → 13 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Cheez-It | Cheez-It Extra Toasty Baked Snack Crackers |
| 60 → 35 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Cheez-It | Cheez-It Original |
| 60 → 35 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Cheez-It | Cheez-It Original Baked Snack Crackers |
| 26 → 1 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Oreo | Chocolate Sandwich Cookies |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Keebler | Club Original Crackers |
| 43 → 18 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Kraft Heinz Foods Company | CRISPY WHEAT CRACKERS |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Goldfish | Flavor Blasted Xtra Cheddar Baked Snack Crackers |
| 30 → 5 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | RITZ | fresh stacks |
| 25 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Ritz | fresh stacks the original |
| 24 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | RITZ | fresh stacks the original |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Fritos | Fritos Original Corn Chips |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Fritos | Fritos Scoops! Corn Chips |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Garden of Eatin' | Garden of Eatin' Blue Corn Tortilla Chips |
| 35 → 10 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Pepperidge Farm | Goldfish Baked Snack Crackers Cheddar |
| 53 → 28 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Pepperidge Farm | Goldfish Baked Snack Crackers, Original |
| 35 → 10 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Pepperidge Farm | Goldfish Cheddar Baked Snack Crackers |
| 35 → 10 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Goldfish | Goldfish Colors Cheddar Crackers |
| 40 → 15 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Goldfish | Goldfish Parmesan Crackers |
| 93 → 66 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Good Thins | Good Thins Simply Salt Rice Snacks |
| 67 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Mission Foods Inc | HABANERO AND LIME FLAVORED HOT ROLLED TORTILLA CHIPS, HABANERO AND LIME |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Harvest Snaps | Harvest Snaps Green Pea Snack Crisps Lightly Salted |
| 60 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Hippeas | Hippeas Organic Chickpea Puffs Groovy White Cheddar |
| 65 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Kettle Brand | Kettle Brand Jalapeno Potato Chips |
| 96 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Kettle Brand | Kettle Brand Sea Salt Potato Chips |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Lay's | Lay's Classic Potato Chips |
| 94 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | LesserEvil | LesserEvil Himalayan Pink Salt Paleo Puffs |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Off The Eaten Path | Off The Eaten Path Rice, Peas & Black Beans Veggie Crisps |
| 16 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Oreo | Oreo |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Nabisco | OREO mini |
| 96 → 91 | Rule 4 — snack/frying oil marker (UPF ceiling) | Chips & Crackers | Triscuit | original |
| 75 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Pirate's Booty | Pirate's Booty Aged White Cheddar Puffs |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Popchips | Popchips Original Sea Salt Potato Chips |
| 53 → 28 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Nabisco | Premium Original Saltine Crackers |
| 58 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Pringles | Pringles Original Potato Crisps |
| 27 → 2 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Ritz | Ritz Crackers the original |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Ritz | Ritz Garlic Butter Crackers |
| 23 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Ritz | Ritz Original Crackers |
| 23 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Ritz | Ritz peanut butter flavored filling cracker sandwiches |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Ruffles | Ruffles Original Flavor Ridged Potato Chips |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Santitas | Santitas White Corn Tortilla Chips |
| 96 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Siete | Siete Lime Grain Free Tortilla Chips |
| 68 → 43 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Stacy's | Stacy's Simply Naked Pita Chips |
| 15 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Kraft Heinz Foods Company | STONEGROUND WHEAT CRACKERS |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Tostitos | Tostitos Original Restaurant Style Tortilla Chips |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Tostitos | Tostitos Scoops! Tortilla Chips |
| 38 → 13 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Kellogg's | Town House Original Crackers |
| 33 → 8 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Kellogg's | Town House Sea Salt Pita Crackers |
| 91 → 50 | Rule 2 — fried snack, cap 50 | Chips & Crackers | Way Better Snacks | Way Better Snacks Simply Sweet Potato Tortilla Chips |
| 20 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Chips & Crackers | Cheez-It | White Cheddar Baked Snack Crackers |
| 96 → 91 | Rule 4 — snack/frying oil marker (UPF ceiling) | Condiments & Sauces | Chosen Foods | Chosen Foods Classic Avocado Oil Mayo |
| 96 → 91 | Rule 4 — snack/frying oil marker (UPF ceiling) | Condiments & Sauces | Primal Kitchen | Primal Kitchen Avocado Oil Mayonnaise |
| 96 → 91 | Rule 4 — snack/frying oil marker (UPF ceiling) | Condiments & Sauces | Tessemae's | Tessemae's Organic Creamy Ranch |
| 100 → 91 | Rule 4 — snack/frying oil marker (UPF ceiling) | Cooking Oils & Vinegars | Chosen Foods | Chosen Foods 100% Pure Avocado Oil 16.9oz |
| 100 → 91 | Rule 4 — snack/frying oil marker (UPF ceiling) | Cooking Oils & Vinegars | Primal Kitchen | Primal Kitchen 100% Pure Avocado Oil Spray 4.7oz |
| 73 → 48 | Rule 3 — refined-grain #1 ingredient, −25 | Crackers | Cheez-It | Cheez-It Original |
| 53 → 28 | Rule 3 — refined-grain #1 ingredient, −25 | Crackers | Goldfish | Goldfish Cheddar Crackers |
| 96 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Hebrew National | All Natural Uncured Beef Franks |
| 61 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Oscar Mayer | Beef franks |
| 56 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Dietz & Watson | Black Forest Smoked Ham |
| 57 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Oscar Mayer | Classic Uncured Beef Franks |
| 59 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Oscar Mayer | Deli Fresh Mesquite Smoked Turkey Breast |
| 49 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Oscar Mayer | Deli Fresh Smoked Uncured Ham |
| 69 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Hormel Natural Choice | Natural Choice Applewood Smoked Deli Turkey |
| 61 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Hormel Natural Choice | Natural Choice Honey Deli Ham |
| 69 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Hormel Natural Choice | Natural Choice Oven Roasted Turkey Breast |
| 80 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Applegate | Naturals Black Forest Ham |
| 96 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Applegate | Naturals Oven Roasted Turkey Breast |
| 96 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Applegate | Organics Oven Roasted Turkey Breast |
| 51 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Oscar Mayer | Original Bacon |
| 64 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Dietz & Watson | Oven Classic Turkey Breast |
| 84 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Dietz & Watson | Oven Roasted Turkey Breast |
| 74 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Boar's Head | OvenGold Roasted Turkey Breast |
| 56 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Oscar Mayer | Turkey Franks Classic |
| 42 → 40 | Rule 1 — processed/cured meat, cap 40 | Deli & Lunch | Hillshire Farm | Ultra Thin Oven Roasted Turkey Breast, Family Size |
| 96 → 40 | Rule 1 — processed/cured meat, cap 40 | Frozen Breakfast | Applegate Naturals | Applegate Natural Chicken & Sage Breakfast Sausage |
| 16 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Breakfast | Eggo | Blueberry Waffles |
| 96 → 40 | Rule 1 — processed/cured meat, cap 40 | Frozen Breakfast | Bob Evans | Bob Evans Original Pork Sausage Links |
| 96 → 40 | Rule 1 — processed/cured meat, cap 40 | Frozen Breakfast | Bob Evans | Bob Evans Original Pork Sausage Links 16oz |
| 43 → 18 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Breakfast | Eggo | Buttermilk Waffles |
| 16 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Breakfast | Eggo | Chocolatey Chip |
| 16 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Breakfast | Eggo | Chocolatey Chip Waffles |
| 16 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Breakfast | Eggo | Eggo Blueberry Waffles |
| 59 → 34 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Breakfast | Eggo | Eggo Buttermilk Waffles |
| 36 → 11 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Breakfast | Kellogg's | Eggo waffles |
| 26 → 1 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Breakfast | Eggo | Homestyle Waffles |
| 76 → 40 | Rule 1 — processed/cured meat, cap 40 | Frozen Breakfast | Jimmy Dean | Jimmy Dean Simple Scrambles Bacon |
| 25 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Breakfast | Eggo | Minis Waffles Cinnamon Toast |
| 16 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Breakfast | Eggo | Strawberry Waffles |
| 65 → 40 | Rule 3 — refined-grain #1 ingredient, −25 | Frozen Meals | Caulipower | Caulipower Margherita Cauliflower Crust Pizza |
| 61 → 40 | Rule 1 — processed/cured meat, cap 40 | Frozen Meals | DEVOUR | DEVOUR White Cheddar Mac & Cheese with Bacon |
| 67 → 40 | Rule 1 — processed/cured meat, cap 40 | Frozen Meals | Healthy Choice | POWER BOWLS Italian Chicken Sausage & Peppers |
| 69 → 40 | Rule 1 — processed/cured meat, cap 40 | Meat & Seafood / Primary Proteins | Aidells | Aidells Smoked Chicken & Apple Sausage 12oz |
| 86 → 40 | Rule 1 — processed/cured meat, cap 40 | Meat & Seafood / Primary Proteins | Applegate Naturals | Applegate Naturals Chicken & Apple Breakfast Sausage 7oz |
| 96 → 40 | Rule 1 — processed/cured meat, cap 40 | Meat & Seafood / Primary Proteins | aidells | Artichoke & Garlic Smoked Chicken Sausage |
| 82 → 40 | Rule 1 — processed/cured meat, cap 40 | Meat & Seafood / Primary Proteins | aidells | Italian Style Smoked Chicken Sausage with Mozzarella Cheese |
| 41 → 40 | Rule 1 — processed/cured meat, cap 40 | Meat & Seafood / Primary Proteins | Hillshire Farm | Turkey Polska Kielbasa |
| 96 → 91 | Rule 4 — snack/frying oil marker (UPF ceiling) | Nut Butters | 88 Acres | 88 Acres Pumpkin Seed Butter 14oz |
| 74 → 40 | Rule 1 — processed/cured meat, cap 40 | Pasta Sauce & Cooking Sauces | Prego | Italian Sausage & Garlic |
| 96 → 91 | Rule 4 — snack/frying oil marker (UPF ceiling) | Pasta Sauce & Cooking Sauces | Primal Kitchen | Primal Kitchen Tomato Basil Marinara Sauce 24oz |
| 64 → 40 | Rule 1 — processed/cured meat, cap 40 | Snack Bars | Country Archer | Country Archer Zero Sugar Beef Jerky Classic |
| 4 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Snack Bars | Pop-Tarts | Frosted Chocolate Fudge |
| 4 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Snack Bars | Pop-Tarts | Frosted Confetti Cupcake |
| 4 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Snack Bars | Pop-Tarts | Frosted Strawberry |
| 4 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Snack Bars | Pop-Tarts | Frosted Strawberry Pop Tarts |
| 8 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Snack Bars | Pop-Tarts | Pop tarts unfrosted strawberry |
| 12 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Soups & Broths | Maruchan | Maruchan Ramen Noodle Soup Chicken Flavor 3oz |
| 8 → 0 | Rule 3 — refined-grain #1 ingredient, −25 | Soups & Broths | Nissin | Nissin Cup Noodles Chicken Flavor 2.25oz |

## Summary

### Biggest movers

The largest drops are the two hard caps landing on products that were previously scoring near-perfect (96) purely because their ingredient lists looked short and clean:

| Product | Old | New | Drop | Why |
|---|---|---|---|---|
| Hebrew National All Natural Uncured Beef Franks | 96 | 40 | -56 | Rule 1 (deli-category + meat word; no nitrite disclosed) |
| Applegate Organics/Naturals Oven Roasted Turkey Breast (x2 SKUs) | 96 | 40 | -56 | Rule 1 (deli-category + meat word; the exact "uncured deli turkey" case the spec called out by name) |
| Bob Evans Original Pork Sausage Links (x2 SKUs) | 96 | 40 | -56 | Rule 1 ("sausage" in name) |
| Applegate Natural Chicken & Sage Breakfast Sausage | 96 | 40 | -56 | Rule 1 ("sausage" in name) |
| aidells Artichoke & Garlic Smoked Chicken Sausage | 96 | 40 | -56 | Rule 1 ("sausage" in name) |
| Boulder Canyon Avocado Oil Kettle Chips | 96 | 50 | -46 | Rule 2 (fried "kettle" chips — Rule 4 confirms the avocado oil no longer rescues it) |
| Kettle Brand Sea Salt Potato Chips | 96 | 50 | -46 | Rule 2 |
| Siete Lime Grain Free Tortilla Chips | 96 | 50 | -46 | Rule 2 |
| Lay's/Fritos/Ruffles/Cape Cod/Popchips/Tostitos/Santitas (chips family) | 91 | 50 | -41 | Rule 2 |

The exact worked examples from the approved spec all landed exactly as predicted: **Lay's Classic 91->50, Fritos 91->50, Hebrew National franks 96->40, Bob Evans pork sausage 96->40, Applegate deli turkey 96->40, Boulder Canyon avocado-oil chips 96->50.**

A large secondary cluster (74 products) comes from Rule 3's -25 refined-grain penalty hitting the catalog's bread/cracker/waffle/Pop-Tart aisle — English muffins, sandwich bread, hamburger/hot dog buns, Ritz/Cheez-It/Goldfish crackers, Eggo waffles, Pop-Tarts. Many of these were already scoring low (12-30) before the penalty, so the -25 floors them at literal 0 rather than spreading them out further below their old low score — this is the explicit, spec-required floor-at-0 behavior, not a bug, but it does mean a lot of already-poor refined-grain snacks now compress to the same literal 0 (Oreo, Ritz Original, most English muffins, all 5 Pop-Tarts SKUs). Worth knowing going in: this is a real loss of granularity among the worst-scoring refined products, traded for the accuracy gain of no longer letting them float in the teens/twenties.

### Surprises to verify with the founder (real, not bugs — a consequence of the spec's own word list)

These moved exactly as the approved spec's word list says they should, but the founder may want to weigh in on whether the fried-snack cap is fair to items that market themselves as explicitly NOT fried:

- **Popchips Original Sea Salt Potato Chips (91->50)** — Popchips' entire brand positioning is "never fried, only popped." The literal trigger is the word "chips" in the product name (per spec's own word list); there's no way to detect "popped not fried" from the name alone without an explicit exception list.
- **LesserEvil Himalayan Pink Salt Paleo Puffs (94->50), Pirate's Booty Aged White Cheddar Puffs (75->50), Hippeas Organic Chickpea Puffs (60->50)** — all three brands market themselves as baked/air-puffed, not deep-fried. Triggered by "puffs" (an explicit spec word list term).
- **Harvest Snaps Green Pea Snack Crisps (91->50), Off The Eaten Path Veggie Crisps (91->50), Stacy's Simply Naked Pita Chips (68->43), Way Better Snacks Tortilla Chips (91->50)** — all baked-snack brands, triggered by "crisps"/"chips" (spec word list terms).
- **Angie's BOOMCHICKAPOP Sweet & Salty Kettle Corn (90->50)** — this is POPCORN, not a chip, but "kettle" (an explicit spec word list term, intended for "Kettle Brand" style fried potato chips) matches "Kettle Corn" too. Traditional kettle corn genuinely is cooked in oil in a kettle, so this may be defensible on the merits even though the mechanism triggering it was aimed at a different product.
- **Caulipower Margherita Cauliflower Crust Pizza (65->40 via Rule 3, not Rule 1/2)** — worth a direct ingredient-list check to confirm the #1 ingredient is genuinely a refined flour (cauliflower-crust marketing implies otherwise) rather than a parsing artifact.

None of these are coding defects — every one fired exactly per the approved word list applied to the real product name and category. Flagging them because the founder may want to add brand-level or "baked"-style exceptions the same way "Oven Baked" was already exempted for Lay's, or may decide the word list is working as intended and these products should in fact be capped.

### Safeguard confirmation — the rules stayed form/ingredient-aware, not blunt category caps

- **Simple Mills Almond Flour Crackers** — BOTH real catalog SKUs (Farmhouse Cheddar: 80, unchanged; Fine Ground Sea Salt: 93, unchanged) are filed under the same `Chips & Crackers` category as the fried chips above, but neither is fried (name says "Crackers," not "Chips"/"Crisps") and neither has a refined-grain #1 ingredient (nut & seed flour blend). **Zero movement — confirmed via a dedicated regression test that also proves Rule 4 does not accidentally double-penalize the organic sunflower oil already 5 rows down that ingredient list.**
- **Mary's Gone Crackers Original Crackers** — 94, unchanged (whole grain: brown rice, quinoa, flax, sesame — no refined grain, no fried-snack name trigger).
- **Fresh/whole proteins** — every plain fresh cut in `Meat & Seafood / Primary Proteins` with no cured/smoked/name trigger is untouched: JENNIE-O Lean Ground Turkey (96), fresh ground turkey breast (96), fresh turkey patties (96), turkey breast tenderloins (21), Tyson Grilled Chicken Breast Strips, Oven Roasted Diced Chicken Breast, etc. Only 5 of 31 products in that category moved — every one because its own NAME says "sausage" or "kielbasa" (Aidells, Applegate, Hillshire), never a bare "chicken"/"beef"/"turkey"/"pork" cut.
- **Eggs category** — 33/33 products, zero movement (no meat/chip/refined-grain trigger applies to eggs by design).
- **Word-boundary safeguards** — dedicated tests confirm "graham" and "hamburger" are never matched by the "ham" trigger (real catalog: Wonder Classic Hamburger Buns moves via Rule 3 only, never Rule 1), and the two false positives found this session (Frank's RedHot, Hot Dog Buns) are now also pinned as regression tests.
- **Whole-food credit** — a whole avocado (single ingredient "avocado") still reaches `wholeFoodClean: true`; only the refined OIL form loses that credit.

## Test results

**551/551 tests pass** (522 pre-existing + 29 new for this feature). One pre-existing test's expectation was intentionally updated (documented in its own comment): `scoreProduct: processing-ceiling clamp` — its fixture happens to contain "sodium nitrite," which is now ALSO a legitimate Rule 1 trigger, so the expected score changed from 53 (the UPF-ceiling clamp alone) to 40 (Rule 1's cap, which is lower and now the binding constraint). No other existing test needed a change.

## Files changed

- `src/utils/scorer.js` — the four rules, their constants/word lists, and the two false-positive fixes (frank's-possessive guard, hot-dog-bun/frankfurter-bun exception, isVegan exemption).
- `src/utils/__tests__/scorer.test.js` — 29 new tests (one per rule's positive/negative cases, the two false-positive regressions, and every safeguard from the spec), one pre-existing test's expectation updated with an explanatory comment.
- `assets/db/products.db` — rebuilt via `node scripts/catalog-database/build-products-sqlite.js` with the new scorer; this is the artifact that ships the new scores to devices once uploaded (not done — founder decides when).

Nothing in `src/data/products.js` was touched — every drift number above comes purely from the scorer change, not a data edit.
