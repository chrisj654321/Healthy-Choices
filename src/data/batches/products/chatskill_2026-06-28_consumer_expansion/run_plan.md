# Chatskill Consumer Expansion Run Plan

Date: 2026-06-28

## Objective

Research 100 additional HealthyChoices grocery products in five resumable waves
of 20 products. This run starts with Wave 1 raw research only; no schema writing,
reviewed product insertion, image merge, or app code edits happen until research
and review checkpoints exist.

## Skill

`chatskill-batch-product-onboarding`

## Default Category Slate

1. Meat & seafood / primary proteins - 10
2. Packaged produce and salad kits - 10
3. Packaged meals / family staples - 10
4. Granola and hot cereal - 10
5. Coffee and tea - 10
6. Soups, broths, and ramen - 10
7. Dairy staples - 10
8. Frozen meals / premium convenience - 10
9. Cookies, chocolate, and sweet snacks - 10
10. Canned and pantry staples - 10

Wave 1 starts with Packaged Meals / Family Staples and Meat & Seafood / Primary
Proteins because current curated coverage is especially thin there.

## Wave 1 Agents

- Product researcher A: slots 1-10, packaged meals / family staples.
- Product researcher B: slots 11-20, meat & seafood / primary proteins.
- Company resolver: slots 1-20, parent-company and duplicate-risk check only.

The agents are not allowed to write product schema. Their output feeds later
writer/reviewer checkpoints.

## Checkpoints

- `wave_01_targets.json`: created.
- `wave_01_raw_research.json`: pending.
- `wave_01_company_resolution.md`: pending.
- `wave_01_formatted_products.js`: blocked until raw research and company resolution are reviewed.
- `wave_01_image_candidates.json`: blocked until verified barcodes exist.
- `wave_01_reviewed_products.js`: blocked until formatted output exists.
- `wave_01_merge_notes.md`: blocked until review passes.

## Resume Rule

On resume, read this file and `wave_01_targets.json`, then check which pending
checkpoint exists and is substantial. Continue from the earliest missing
checkpoint. Do not rely on chat memory.

## Review Gates

Reject or replace any target with:

- unverifiable barcode
- wrong-market Open Food Facts record
- parent company uncertainty for a mainstream brand
- missing ingredients for processed foods
- nutrition that cannot be tied to serving size
- duplicate manual product already in `products.js`
- product image that does not match exact variant
