# QA Report: frozen_meals

## Summary
- Reviewed: 20
- PASS: 20
- FIX: 0
- REJECT: 0

## Methodology
- **A. Barcode check digit:** All 20 barcodes validated with the standard UPC-A mod-10
  algorithm (odd positions ×3, even ×1). NOTE: the checklist's stated parity (odd ×1,
  even ×3) is the mirror phrasing and fails on all real barcodes; the standard algorithm
  is correct and all 20 pass. Tattooed Chef raw `0899764001534` (13 digits, leading 0)
  was correctly stripped to 12-digit `899764001534`, which is a valid UPC-A.
- **A. OFF re-verification:** Every barcode re-queried at the OFF v2 API. All returned
  status=1 with product names matching the entries (some empty responses on first pass
  were transient rate-limiting; all confirmed on retry).
- **B. Ingredients:** Each array checked against `ingredients_verbatim` for order,
  completeness, and lowercase. See per-product notes for accepted normalizations.
- **C. Health claims:** No causes/prevents/cures/treats/toxic/carcinogenic/linked-to-disease
  language anywhere. Clean.
- **D. companyId:** All non-null keys (amy-kitchen, nestle, conagra, kraft-heinz, kelloggs,
  beyond-meat, impossible-foods, dr-praegers, campbell) confirmed present literally in
  companies.js. All three expected nulls carry `_missingCompany`. Saffron Road, Tattooed
  Chef, and Caulipower confirmed ABSENT from companies.js.
- **E. Schema:** All required fields present on every product; outer barcode key equals
  inner barcode field for all 20.
- **F. Duplicates:** None of the 20 barcodes exist in products.js MANUAL_PRODUCTS.

### Cross-cutting notes (accepted, not flagged)
- companyId `amy-kitchen`: the raw `companyId_hint` was `amys-kitchen`, but the actual
  key in companies.js is `amy-kitchen`. Writer's value is CORRECT.
- Ownership keys per checklist all verified: EVOL→conagra, MorningStar→kelloggs,
  Rao's→campbell, Smart Ones→kraft-heinz (kraft-heinz used; equivalent). Saffron Road,
  Tattooed Chef, Caulipower → null + _missingCompany.
- Several products carry structured/`component:`-prefixed source strings (Lean Cuisine
  Ravioli, HC Power Bowls, Saffron Road CTM & Lamb Saag, Stouffer's). The writer split
  on commas, leaving the section label attached to its first ingredient (e.g.
  "vegetables and sauce: skim milk", "lamb: boneless lamb"). Content, order, and
  lowercasing are faithful to the source — accepted as formatting of structured data.
- EVOL (891627002955): raw `ingredients_verbatim` has malformed/unbalanced parentheses
  ("whole milk (milk (milk, vitamin d3), cheddar cheese (...) ...") and the typo
  "balck pepper". Writer normalized the broken nesting into top-level ingredients and
  corrected the typo to "black pepper". No ingredient added/dropped/reordered. Accepted
  (exact reproduction of broken source is neither possible nor desirable).

## Results

### 042272013883 — Amy's Organic Black Bean & Cheese Burrito
PASS

### 042272000654 — Amy's Light & Lean Pasta & Veggies
PASS

### 042272009244 — Amy's Thai Pad Thai
PASS

### 013800144065 — Lean Cuisine Butternut Squash Ravioli
PASS (component-prefixed source split on commas; content/order faithful)

### 013800440341 — Lean Cuisine Chicken Tikka Masala
PASS

### 072655454583 — Healthy Choice Simply Steamers Unwrapped Burrito Bowl
PASS

### 072655001800 — Healthy Choice Power Bowls Chicken Feta & Farro
PASS (component-prefixed source split on commas; content/order faithful)

### 891627002955 — EVOL Truffle Parmesan Mac & Cheese
PASS (malformed-paren source normalized; "balck pepper" typo corrected to "black pepper")

### 857063002003 — Saffron Road Chicken Tikka Masala with Basmati Rice
PASS (companyId null + _missingCompany 'American Halal Company' — correct)

### 857063002027 — Saffron Road Lamb Saag with Basmati Rice
PASS (companyId null + _missingCompany 'American Halal Company' — correct)

### 013800103406 — Stouffer's Macaroni & Cheese
PASS (component-prefixed source split on commas; content/order faithful)

### 899764001534 — Tattooed Chef Cauliflower Mac & Cheese Bowl
PASS (13-digit raw `0899764001534` correctly stripped to valid 12-digit `899764001534`;
companyId null + _missingCompany — correct)

### 025155057051 — DEVOUR White Cheddar Mac & Cheese with Bacon
PASS

### 025800022403 — Smart Ones Macaroni & Cheese
PASS (companyId kraft-heinz — correct)

### 028989101082 — MorningStar Farms Chik'n Nuggets
PASS (companyId kelloggs — correct)

### 852629004583 — Beyond Burger Plant-Based Patties
PASS

### 816697021019 — Impossible Burger Plant-Based Patties
PASS

### 080868000336 — Dr. Praeger's All American Drive-Thru Veggie Burgers
PASS

### 862871000325 — Caulipower Margherita Cauliflower Crust Pizza
PASS (companyId null + _missingCompany 'Caulipower LLC' — correct)

### 747479300056 — Rao's Made For Home Chicken Parmesan with Spaghetti
PASS (companyId campbell — correct)
