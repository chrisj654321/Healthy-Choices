# Chad task board

_Briefs for Chad (ChatGPT). Claude writes them; the founder pastes them into ChatGPT; Chad's output lands in the repo; Claude validates + reviews before merge. Protocol details: [instructions/efficiency.md](../instructions/efficiency.md)._

## Brief template

```
### [TASK NAME] — status: DRAFTED | SENT | CHAD-DONE | VALIDATED | MERGED
**Goal:** one sentence.
**Output files (Chad owns these for the run):** exact repo paths.
**Format/schema:** exact spec or pointer to an example file.
**Validation (Claude runs after):** the script/checks that must pass.
**Rules:** no fabrication (could_not_verify is success), source everything, don't touch files outside your list.
```

## Active tasks

### INGREDIENT-CACHE UNKNOWNS — WAVE 01 (recurring campaign) — status: MERGED (2026-07-05, 98.10%→98.90% coverage, 196/196 tests, see decision-log)
**Goal:** Classify the top 150 currently-unrecognized ingredient strings so the app's scorer stops bucketing them as "unrecognized" (they fail every lookup in `src/utils/scorer.js` and fall to a heuristic).
**Output files (Chad owns these for the run):** `src/data/batches/batch_15_unknowns_w01.js` (new file — do NOT edit `src/data/ingredientCache.js`, `src/data/ingredients.js`, or any other file).
**Format/schema:** Input list = `scripts/remaining-unknowns.json` (regenerated 2026-07-05 — 150 entries, `{ ingredient, count }`, sorted by occurrence count). For EACH entry, write exactly one line in the output file, matching the existing batch convention (see `src/data/batches/batch_14_bakery.js` for live examples):
```
  'exact input string': { risk: IngredientRisk.Low, category: 'additives', explanation: 'One or two sentences.' },
```
- **Key = the exact `ingredient` string from the input list, unchanged** (it is already normalized/lowercase; the app's exact-match lookup depends on it).
- `risk` = `IngredientRisk.Low` | `IngredientRisk.Medium` | `IngredientRisk.High` only.
- `category` = one of the existing cache categories only: `additives, sweeteners, preservatives, grains, fats, flavor-enhancers, dairy, dairy-alternatives, emulsifiers, dyes, proteins, vitamins, fruits, vegetables, legumes, nuts, seeds, spices, beverages, probiotics, cacao, amino acids, sugar-alcohols, eggs, seafood, meats, stimulants, condiments, confectionery, botanicals`.
- `explanation` = plain-English, one–two sentences, in the established voice: what it is + why the risk level, with regulatory framing where it applies (e.g. "FDA GRAS", "21 CFR ...", "IARC ..."). **No apostrophes inside explanations** (single-quoted strings; the merge script is line-parsed — if unavoidable, escape as `\'`).
- **Many entries are label FRAGMENTS or purpose clauses, not ingredients** ("for color", "to prevent caking", "contains 2 or less of salt", "a natural mold inhibitor"). Classify what the phrase DENOTES at the class level and say so honestly: e.g. `'for color'` → category `dyes`, explanation that it marks an unspecified added colorant whose identity the label does not disclose. Pure quantity/prep fragments ("contains 2 or less of salt", "and salt", "boneless") → classify as the underlying substance/attribute at its established severity (salt is already Low in the cache — stay consistent with existing entries for the same substance).
- If you genuinely cannot classify an entry on sourced grounds, OMIT it and list it under a `// could_not_verify:` comment block at the end of the file — that is a successful outcome, not a failure.
**Validation (Claude runs after):** line-regex parse of every entry; keys ⊆ input list, lowercase, unique; category/risk from the allowed sets; harness-eval of the entries as an object literal; then `node scripts/merge-ingredient-batches.js` (dedupes against existing keys), `npm test` (196 tests must stay green), and a rerun of `node scripts/ingredient-coverage.js` — the matched-% delta is this wave's scorecard. Opus spot-review of classifications against sources before the founder commits.
**Rules:** no fabrication (could_not_verify is success), no invented health effects — sourced/regulatory classifications only, consistent with existing cache entries for the same substance family; don't touch files outside your list; this brief is the standing template — waves 02+ change only the wave number after Claude regenerates the input list.

### INGREDIENT-CACHE UNKNOWNS — WAVE 02 (recurring campaign) — status: MERGED (2026-07-05, 98.90%→99.11% coverage, 196/196 tests, see decision-log)

### INGREDIENT-CACHE UNKNOWNS — WAVE 03 (recurring campaign) — status: MERGED (2026-07-05, 99.11%→99.22% coverage, 196/196 tests, via direct `codex exec`, see decision-log)
**Goal:** Same as Waves 01/02 — classify the next top-150 unrecognized ingredients. Same format/rules as the standing template above.
**Output files:** `src/data/batches/batch_17_unknowns_w03.js`.
**Routing change (2026-07-05):** run directly via the programmatic `codex exec` lane (`instructions/efficiency.md`'s Codex CLI mechanics) instead of the manual paste-bridge — no founder copy/paste needed. Same model (gpt-5.5), same validation pipeline after (Hadrian mechanical + Opus accuracy, both independent, before merge). Paste-bridge remains available for anything that doesn't fit a single self-contained CLI prompt.
**Validation:** identical to Waves 01/02.
**Goal:** Same as Wave 01 — classify the next top-150 unrecognized ingredient strings. `scripts/remaining-unknowns.json` was auto-regenerated as a side effect of Wave 01's coverage re-measure, so it's already fresh (2026-07-05) and ready to use as-is.
**Output files (Chad owns these for the run):** `src/data/batches/batch_16_unknowns_w02.js` (new file — same rules as Wave 01: do NOT edit `ingredientCache.js`, `ingredients.js`, or any other file).
**Format/schema:** Identical to Wave 01 — see that brief above for the full spec (key format, allowed risk/category sets, label-fragment handling, could_not_verify rule). One heads-up specific to this wave: the top of the current input list is dominated by the same 6 fragments Wave 01 correctly punted (`'slat'`, `'5'`, `'1'`, `''`, `'3'`, `'ntss 31'`) plus `'4'` — they rank high by occurrence count but are still genuinely unclassifiable (OCR noise / numeric fragments). Punt them again to `could_not_verify` exactly as before — don't force a classification just because they resurfaced. (Note for Claude/founder: worth adding a permanent exclude-list for these specific strings before generating Wave 03's input, so they stop taking up slots in the top-150 every round.)
**Validation (Claude runs after):** identical pipeline to Wave 01 — line-regex parse, keys check, enum check, harness-eval, `node scripts/merge-ingredient-batches.js`, `npm test` (must stay green), re-run `node scripts/ingredient-coverage.js` for the new coverage delta, independent Opus accuracy review before anything merges.
**Rules:** same as Wave 01 — no fabrication, could_not_verify is success, sourced/regulatory classifications only, stay consistent with cache entries for the same substance family across waves (e.g. if Wave 01 classified a fragment a certain way, a related fragment in Wave 02 should match it, not drift).

### SHOPPING GUIDES V1 — VERIFIED-SOURCES RESEARCH — status: DRAFTED
**Goal:** Produce the sourced research foundation for the app's first Shopping Guides (backlog #2) — verifiable claims only; this document is the accuracy gate everything downstream (app copy, Cicero content) must trace back to.
**Output files (Chad owns these for the run):** `context/research-shopping-guides-v1.md` (new file — nothing else).
**Format/schema:** One `##` section per topic below. Each claim on its own bullet as: **claim (one plain sentence)** → source (organization + title + URL) → confidence tag: `verified` (primary source: government/regulator/standards body/peer-reviewed study), `reported` (reputable secondary only), or `could_not_verify`. Where a term is regulated, quote or closely paraphrase the regulatory definition and cite the regulation itself (USDA FSIS, FDA, CFR, IFPS).
Topics:
1. **General shopping rules** — the shop-the-perimeter heuristic (what evidence actually supports it, and the bakery exception where perimeter ≠ healthy); reading serving sizes first; note: the "4-number check" is our own existing content — do NOT research it, just leave a placeholder line.
2. **Fruits & produce** — picking/ripeness indicators for common fruits (only where a credible source exists — no folklore); wax coatings (what they are, FDA status); wash practices, specifically the evidence on baking-soda washing (the peer-reviewed apple/pesticide study) vs. plain water vs. commercial washes.
3. **Meat labels decoded** — grass-fed vs. grain-finished (and what happened to the USDA grass-fed standard), air-chilled, "natural" (the actual USDA FSIS definition vs. what shoppers assume), "no hormones added" (incl. where hormone use is banned anyway — poultry/pork disclaimer rule), free-range/cage-free tiers. For each: what is regulation, what is third-party certification, what is pure marketing.
4. **PLU codes** — the IFPS system: 4-digit conventional, 9-prefix organic, and the true current status of the 8-prefix (widely repeated as "GMO" — verify what IFPS actually says today). What a PLU sticker can and cannot tell you.
**Validation (Claude runs after):** every URL spot-checked reachable and actually supporting its claim (sampled by Opus review); zero medical-causation claims (regulatory/observational facts only); every claim tagged; `could_not_verify` entries preserved, not silently dropped. Founder approves before any claim moves toward app copy.
**Rules:** no fabrication (could_not_verify is success) — a shorter honest document beats a complete padded one; no fabricated studies/stats/quotes; source everything to primary sources where they exist; write research notes, NOT app copy (plain-English rewriting happens later under separate review); don't touch files outside your list.

### PRODUCT CANDIDATE RESEARCH — PUSH TO 1,000+ — status: VALIDATED (2026-07-09, run via `codex exec`, no founder paste needed)
**Goal:** Research real, verifiable candidate products (real barcode + name + brand) NOT currently in `src/data/products.js`, prioritizing the DB's thinnest categories, to feed the Octavius pipeline toward 1,000+ total products (current count: 892, verified 2026-07-09).
**Output files (Chad owns these for the run):** ONE new CSV, `src/data/batches/products/candidates-2026-07-09.csv`, columns exactly `Barcode,Product Name,Brand,Category` — no other files.
**Format/schema:**
- Aim for 150–200 candidate rows (buffer above the ~108 needed to cross 1,000, since some will be dupes/unresolvable and get dropped in Stage 0/1 of the Octavius pipeline).
- **Prioritize these under-filled categories** (current product counts in parens — all real mainstream US grocery brands, not obscure/regional unless genuinely common): Kids Lunch (1), Deli Meat (1), Peanut Butter (1 — distinct from the existing "Nut Butters" category at 25, don't just duplicate those), Chips (2), Crackers (2), Eggs (13), Hot Cereal (14), Granola (17), Pasta Sauce & Cooking Sauces (17), Coffee & Tea (17). Fill the rest from any mainstream category once these are covered.
- **Barcode must be a real UPC/EAN you found attached to that exact product** (retailer listing, Open Food Facts, USDA FDC, brand's own site) — if you can't confirm a real barcode for a product you're confident is real and common, list it anyway with the barcode column blank; Octavius's Stage 1 fetch script resolves by name-search when barcode is blank. **Never invent a barcode** — a wrong-but-plausible-looking UPC is worse than a blank one, since it would silently mismatch a different product downstream.
- Do not attempt ingredients, nutrition, scoring, or company data — that's the Octavius pipeline's job (Stages 1–4), not this brief's.
**Validation (Claude runs after):** dedupe check against every barcode already in `products.js`; drop rows whose barcode is a mod-10 (UPC/EAN check-digit) failure; spot-check a sample of blank-barcode rows are real, findable products (not invented); hand the surviving CSV to the `octavius` skill's Stage 0 pre-flight as a normal batch.
**Rules:** no fabrication (a shorter, honest list beats a padded one — `could_not_verify`/blank-barcode is a fine outcome); real products only, no discontinued/regional-only items presented as mainstream; don't touch files outside your list; this is a candidate list ONLY — nothing here merges into the app without going through the full Octavius Stage 1–4 verification pipeline.
**Result:** `candidates-2026-07-09.csv` — 187 rows, distributed Kids Lunch (16), Deli Meat (21), Peanut Butter (20), Chips (20), Crackers (20), Eggs (15), Hot Cereal (18), Granola (16), Pasta Sauce & Cooking Sauces (20), Coffee & Tea (21). Every barcode left blank (gpt-5.5 chose not to guess any — fully conservative, exactly as instructed). Claude's validation pass: 0 duplicates against existing `products.js` entries by brand+name; spot-checked realistic, no fabricated-looking entries. Ready for Octavius Stage 0 whenever the founder wants to run the batch (not auto-triggered — that's a separate agent-cost decision).

## Completed

- Product waves 05–09 (~100 products each) — pre-board era, merged via batch pipeline.
- X growth-batch voice co-design (`marketing/strategy/x-posts-growth-batch.md`) — merged as Cicero's canonical voice exemplar.
