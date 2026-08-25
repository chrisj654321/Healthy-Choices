# Baked-snack tier — score drift report (2026-08-19)

Scope: `src/utils/scorer.js` Rule 2 (fried-snack cap) split into three
evidence-based tiers, plus a Rule 3 (refined-grain penalty) false-positive
fix. Full method and rule text: `context/research/baked-vs-fried-chips.md`
(sourced recommendation, adopted) and the code comments above
`detectFriedSnack`/`detectBakedSnackMarker`/`detectSimplePopcorn`/
`calcRefinedGrainPenalty` in `src/utils/scorer.js`.

Computed by scoring all 1,098 manual catalog products
(`src/data/products.js`) through the OLD scorer (`git show HEAD` snapshot,
taken before any edit this session) and the NEW scorer, using the same
VM-bundling approach as `scripts/catalog-database/build-products-sqlite.js`
so the comparison runs through the identical code path the real build uses.
Zero scoring errors on either side. The real catalog rebuild
(`node scripts/catalog-database/build-products-sqlite.js`) has been run
against the new scorer — `assets/db/products.db` now reflects these scores.

## Headline numbers

- **Total products scored:** 1,098
- **Score movers (delta ≠ 0):** 9
- **Tier reclassified with NO score change** (base score was already below
  both the old and new cap, so the cap swap didn't bind): 3
- **Rule 3 (refined-grain penalty) changed:** 1 product (Caulipower — the
  exact false positive this fix targets; nothing else in the catalog was
  affected)
- **Score range after rebuild:** 0–100 (no out-of-bounds values)
- **Scoring errors:** 0 (old scorer), 0 (new scorer)

## Every score mover (old → new, rule fired)

| Product | Category | Old | New | Δ | Rule fired |
|---|---|---|---|---|---|
| Popchips Original Sea Salt Potato Chips | Chips & Crackers | 50 | 65 | +15 | Tier 2 (baked-analogue cap 65) — brand-process marker: "Popchips" |
| Harvest Snaps Green Pea Snack Crisps Lightly Salted | Chips & Crackers | 50 | 65 | +15 | Tier 2 — name marker "Crisps" |
| Pirate's Booty Aged White Cheddar Puffs | Chips & Crackers | 50 | 65 | +15 | Tier 2 — name marker "Puffs" |
| Hippeas Organic Chickpea Puffs Groovy White Cheddar | Chips & Crackers | 50 | 60 | +10 | Tier 2 — name marker "Puffs" (real uncapped score is 60, below the new 65 ceiling, so the cap doesn't bind — it only stopped being artificially pulled down to 50) |
| LesserEvil Himalayan Pink Salt Paleo Puffs | Chips & Crackers | 50 | 65 | +15 | Tier 2 — name marker "Puffs" |
| Way Better Snacks Simply Sweet Potato Tortilla Chips | Chips & Crackers | 50 | 65 | +15 | Tier 2 — brand-process marker: "Way Better Snacks" |
| Off The Eaten Path Rice, Peas & Black Beans Veggie Crisps | Chips & Crackers | 50 | 65 | +15 | Tier 2 — name markers "Veggie"/"Crisps" |
| Caulipower Margherita Cauliflower Crust Pizza | Frozen Meals | 40 | 65 | +25 | Rule 3 fix — first ingredient "crust (cauliflower, brown rice flour, ...)" now evaluated by its true primary component (cauliflower), not the whole literal string; no form-tier cap applies to this category |
| Angie's BOOMCHICKAPOP Sweet & Salty Kettle Corn | Chips & Crackers | 50 | 90 | +40 | Tier 3 — simple whole-kernel popcorn exemption (popcorn first, only sunflower oil/cane sugar/sea salt after it, no NOVA/refined-starch marker); scored fully on merits, no process cap at all |

No product moved down. Every mover is an intended, spec-matching
reclassification — see "Surprises" below for the two items worth a second
look even though their behavior is correct.

## Tier reclassified, score unaffected (cap changed but wasn't binding)

These three products' TRUE uncapped score was already at or below the new
cap, so swapping the cap didn't move the visible score — flagged here for
completeness since the underlying rule/tier genuinely changed for them:

| Product | Old cap | New cap | Score (unchanged) |
|---|---|---|---|
| Lay's Oven Baked Original Potato Crisps | none (was exempted outright by the old `OVEN_BAKED_REGEX`) | 65 (Tier 2) | 63 |
| Stacy's Simply Naked Pita Chips | 50 | 65 (Tier 2 — name marker "Pita Chips"; Rule 3's -25 refined-wheat-flour penalty still stacks on top, unchanged) | 43 |
| Cheetos Puffs Cheese Flavored Snacks | 50 | 65 (Tier 2 — name marker "Puffs") | 20 |

## Safeguards — confirmed held

- **Simple Mills** (both catalog SKUs — "Fine Ground Sea Salt" test fixture
  at 93, real catalog "Farmhouse Cheddar" SKU at 80) and **Mary's Gone
  Crackers** (94): zero delta, `isFriedSnack`/`isBakedSnack`/
  `isSimplePopcorn` all `false`, `refinedGrainPenalty` 0. Neither fried nor
  refined-grain nor a chip/puff/crisp/popcorn name — correctly untouched by
  every tier in this rule.
- **Whole/fresh proteins** (chicken breast, salmon, ground beef, eggs):
  covered by existing Rule 1 regression tests, unaffected by this change
  (Rule 1 — processed/cured meat — was not touched).
- **Pringles** (both catalog barcodes, "Original Potato Crisps" and "BBQ
  flavored coated potato crisps"): stayed on Tier 1 (fried, cap 50),
  unchanged scores (50 and 20 respectively) — confirms the "potato/corn
  crisps" carve-out correctly keeps a genuinely fried, formed potato-starch
  snack out of the milder Tier 2, even though the bare word "crisps" also
  appears on the Tier 2 marker list.
- **Ordinary baked crackers** (Cheez-It, Goldfish — "Baked Snack Crackers"):
  not in the mover list, not reclassified — the bare word "baked" alone
  never triggers Tier 2; it requires a chip-format word (chip/crisp/potato/
  tortilla) in the same name, which crackers don't have. Matches Rule 2's
  original design intent ("baked crackers are deliberately NOT capped
  here").
- **Score bounds:** every one of the 1,098 rebuilt scores lands in [0, 100]
  with no errors.

## Surprises (investigated, both resolve to "correct, flagging for visibility")

1. **The Popchips/Way Better brand-allowlist mechanism is the one soft spot
   in this change.** Both real catalog product NAMES carry no baked/popped/
   puffed marker word at all ("Popchips Original Sea Salt Potato Chips",
   "Way Better Snacks Simply Sweet Potato Tortilla Chips") — the only reason
   they land on Tier 2 is a small brand-name allowlist
   (`BAKED_ANALOGUE_BRAND_TERMS` in scorer.js) asserting that Popchips uses
   a documented heat-and-pressure "popped" process and Way Better Snacks are
   baked, not fried. I'm highly confident on Popchips (the brand's entire
   identity/tagline is built on "popped, not fried, not baked"); I'm less
   certain on the exact Way Better Snacks claim, which I'm asserting from
   general brand knowledge rather than an in-session citation. **Recommend
   the reviewer verify the Way Better Snacks manufacturing-process claim
   before this ships** — if wrong, the fix is a one-line removal from
   `BAKED_ANALOGUE_BRAND_TERMS`, which would drop that one product back to
   the Tier 1 default (50) with no other side effects (confirmed isolated
   via the same drift methodology above).
2. **Cheetos Puffs Cheese Flavored Snacks moved tiers (Tier 1→Tier 2) with
   zero visible score change.** This is a heavily processed, oil-coated
   extruded corn puff (maltodextrin, MSG, Yellow 6, whey protein
   concentrate) — moving it off the 50-point fried cap onto the 65-point
   baked-analogue cap could look like a quality-relaxation at a glance. It
   isn't one in practice: its real ingredient/nutrition penalties already
   drive it to 20, far below either cap, so the cap swap has zero net
   effect on this specific product. Flagged only because the RULE now
   treats "puffed and oil-coated, not deep-fried" the same as "baked/popped"
   for classification purposes — consistent with the research review's own
   framing of extruded puffs as a NOVA-marker Tier 2 case (it explicitly
   cites Pirate's Booty, a very similar puffed-and-coated product, under the
   same tier), but worth the founder's awareness since Cheetos is a much
   more recognizable "junk food" brand than Pirate's Booty.

No other unexpected movers found across the full 1,098-product scan.

## Files changed

- `src/utils/scorer.js` — Rule 2 split into three tiers (`FRIED_SNACK_CAP`
  50 kept, new `BAKED_SNACK_CAP` 65, Tier 3 popcorn exemption via
  `detectSimplePopcorn`); Rule 3's `calcRefinedGrainPenalty` now resolves a
  compound first ingredient's true primary component
  (`primaryIngredientCandidate`) instead of testing the whole literal
  string.
- `src/utils/__tests__/scorer.test.js` — 19 new tests covering all three
  tiers, the Pringles/Cheez-It/Lay's-Oven-Baked edge cases, the within-brand
  LesserEvil split, the added-sugar-still-applies popcorn case, and the
  Caulipower Rule 3 fix (plus two supporting Rule 3 compound-ingredient
  fixtures).
- `assets/db/products.db` — rebuilt via
  `node scripts/catalog-database/build-products-sqlite.js` against the new
  scorer (gitignored binary, not part of the diff for review).

## Test results

`npm test`: **623/623 passed**, 23 suites (full repo run, not just
scorer.test.js). `scorer.test.js` alone: 174/174 (155 pre-existing + 19
new), 0 failures.

Not committed, per instructions.
