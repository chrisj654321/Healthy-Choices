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

### STAPLE-CATEGORY PRODUCT WAVE (2026-08-17) — status: DRAFTED
**Goal:** Research and format the best real products for the staple categories the catalog is thin on, so every everyday-shopping aisle has representation. Aim ~12–15 per category. For granola especially, the score bar (80+) is only reachable with **no-added-sugar** products — prioritize those.

**Why this list:** an audit of the shipping catalog (2026-08-17) found these staple categories under 12 products scoring 80+. These are aisles people buy from at every grocery trip, so they must not be empty. Where a category genuinely has no 80+ option, we still want the **best available** — the app will show it labeled honestly as the highest-scored item in that category. Do NOT assert a score yourself; the app's own scorer grades every product after Claude merges it. Your job is accurate data, not a grade.

**Candidate products to research (start here; add obvious peers you find):**
- **Coffee creamer (+10 needed):** nutpods (Original, French Vanilla — unsweetened), Elmhurst, Califia Farms Better Half, Laird Superfood, Forager Project cashew, Three Trees, Milkadamia, Chobani Oat barista, Trader Joe's oat creamer, So Delicious coconut (unsweetened).
- **Bread (+7):** Food for Life Ezekiel 4:9 sprouted, Silver Hills sprouted, Alvarado St. Bakery sprouted, Angelic Bakehouse, Dave's Killer Bread (organic 21 Whole Grains), Base Culture (grain-free), Simple Kneads (GF sourdough), San Luis Sourdough.
- **Snack bars (+6):** RXBAR, Larabar, That's It, GoMacro, Kate's Real Food, Autumn's Gold grain-free, 88 Acres, Skout Organic.
- **Granola (+12; NO-ADDED-SUGAR ones first):** Wildway grain-free, Lark Ellen Farm sprouted, Struesli, Paleonola, Purely Elizabeth (lower-sugar lines), Michele's, GrandyOats, Nature's Path Organic.
- **Top-ups:** Peanut/nut butter (Crazy Richard's 100% peanuts, Santa Cruz Organic, Fix & Fogg, Georgia Grinders); Yogurt (Siggi's plain, Maple Hill grass-fed, Stonyfield Organic, Straus, Fage plain); Eggs (Vital Farms pasture, Pete & Gerry's Organic, Happy Egg); Primary proteins (Wild Planet salmon/sardines, Mary's organic chicken, grass-fed ground beef).

**Output files (Chad owns these for the run):** `src/data/batches/products/staples-wave-2026-08-17_raw.json` (raw research per product) and `src/data/batches/products/staples-wave-2026-08-17_formatted.js`.
**Format/schema:** match `src/data/batches/products/deli-meat-2026-07-09_formatted.js` exactly (same keys, same shape). Every product needs a verified UPC/barcode, the real ingredient list off the actual label, nutrition, brand, category (reuse the existing category strings from the audit above), and an image URL if you can source one.
**Validation (Claude runs after):** octavius validators + the SQLite build + scorer precompute; then Opus review; then Claude merges. Nothing reaches the app until reviewed here (creator ≠ reviewer).
**Rules:** no fabrication — a verified UPC and a real label, or `could_not_verify` with the reason. Never invent a barcode, an ingredient, or a nutrition number. Don't assert a health score. Don't touch any file outside your two output files.

### AVOCADO-OIL ADULTERATION — VERIFY BEFORE ANY APP USE (2026-08-17) — status: DRAFTED
**Goal:** Verify, from primary sources, the claim that a large share of retail "avocado oil" is adulterated (diluted with cheaper seed oils) or mislabeled. This gates a future app change (a scoring signal + possibly a displayed note) that does NOT ship until verified here.
**Why:** the founder wants the finding in the app, but only if it is real and citable — the app's whole promise is that we never repeat a claim we can't stand behind. Anchor on the known study: **UC Davis 2020 (Green & Wang, *Food Control*)** — tested retail avocado oils, found the majority rancid before expiry or adulterated with other oils. Find that primary source plus any follow-ups (GAO/FDA notices, later peer-reviewed replications, third-party lab tests).
**Output file (Chad owns for the run):** `context/research/avocado-oil-adulteration.md` — for each source: what was tested, sample size, the exact finding (real number, not "90%" unless a source says it), and a reachable citation. Separate "what's proven" from "what's claimed but unverified."
**Validation (Claude runs after):** every stated figure traces to a primary source; no rounded-up number without a citation; conclusions match what the sources actually say. Claude + Opus review before it informs any scoring rule or in-app copy.
**Rules:** no fabrication — a source or nothing. Do not launder a marketing blog's number as fact; go to the study. Flag anything you can't confirm as unverified rather than dropping it.

### INGREDIENT QUEUE — 893 LOOSE MATCHES (2026-08-11) — status: SENT (running via `codex exec`, gpt-5.6-sol medium, session 01a001a1-381d-7bb1)
**Goal:** Triage the 893 `imported` loose-match tokens in `Next Ingredient Queue.csv` into a final status each, working highest-impact first, in batches of 25.

**What these 893 rows are:** tokens that fuzzy-hit an app ingredient but were NOT confirmed. Your job is the judgment a script cannot do: is the loose hit correct, or is this a real new substance, a label variant, or not an ingredient at all?

**Order:** the file is already sorted by `productFrequency` (how many products use the token), highest first. Work top to bottom. Do NOT skip ahead — the top rows (cocoa 4970, chocolate 4194, vanilla 3572) touch the most products, so they matter most.

**Batch size:** 25 rows per batch. About 36 batches total. Batches 001–005 (the first 117 rows) already carry a batch number; put a batch number (`Batch 006`, `Batch 007`, …) on each later block of 25 as you reach it.

**Per row, decide ONE `currentStatus`** (same five buckets you used before):
- `known-in-app` — the app already explains this token (check it against `Ingredient Master List.csv` first). No new entry. Fill `normalizedName` with the app key it maps to.
- `existing-alias` — a label variant of a known ingredient (example: "milk chocolate sugar" → chocolate). Give the parent key in `normalizedName`. No new entry.
- `new-substance` — a REAL substance the app does not explain yet. Fill `normalizedName`, `risk`, `category`, `explanation` (1–2 plain sentences), and `source` (a primary regulator: FDA / eCFR / EFSA / USDA). This is the only bucket that needs research.
- `noningredient` — label boilerplate, a process phrase, or OCR junk (example: "preserves freshness", "granular"). No entry; mark so it stops returning.
- `could_not_verify` — a real-looking token you cannot pin to a confirmed identity or source. Put the reason in `couldNotVerifyReason`. This is a success, not a failure.

**Risk scale:** the app uses three levels only — 2 (Low), 5 (Medium), 8 (High). Give your finer score; Claude maps it (8–10 High, 5–7 Medium, 2–4 Low). Never raise a token to High without a strong cited reason.

**Run all 36 batches in one pass.** Work top to bottom through every `imported` row. Write results back incrementally (do not hold all 893 to the end — save after each batch so a stop leaves finished batches intact). Claude validates the whole file once you finish; nothing merges to the app until Opus review.

**Output file (Chad owns for the run):** `Next Ingredient Queue.csv` — edit only the `imported` rows' `currentStatus`, `normalizedName`, `risk`, `category`, `explanation`, `source`, `couldNotVerifyReason`, `batch`. Do not touch any other row or column, and do not touch any file in `HealthyChoices/`.

**Validation (Claude runs after each batch):** every touched row has a valid `currentStatus`; every `new-substance` has risk + category + explanation + a reachable primary source; no `known-in-app`/`existing-alias` row invented a new entry; `could_not_verify` rows preserved with a reason; row count unchanged (still 2,250 unique). Nothing merges to the app until Opus reviews (creator ≠ reviewer).

**Rules:** no fabrication — `could_not_verify` is a valid answer and a short honest batch beats a padded one; source every new substance to a primary regulator; do not generate a risk from memory (research it); don't touch files outside your list.

### INGREDIENT AUDIT — FINISH HELD ITEMS + QUEUE (2026-08-08) — status: CHAD-DONE / VALIDATED (2026-08-11)
**Update 2026-08-11:** Chad's sync is in and validated. Task 1 done (60 held resolved: 50 rejected, 10 proposed). Claude merged the 93 reviewed score changes into the app (`6766f0c`, 502/502 tests). Task 2 produced 1,326 known-in-app, 8 aliases, 3 new substances, 13 noningredients, 7 could_not_verify — and left **893 `imported` loose matches** for careful review. That residue is now its own batched brief: see **INGREDIENT QUEUE — 893 LOOSE MATCHES** below.

**Goal:** Finish the two parts of your ingredient audit that Claude could not do for you, now that you are back up.

**Read first — what Claude already put in the app. Do NOT redo this work:**
- Applied 89 of your 90 `proposed` score changes from `Score Change Proposals.csv`. One was a no-op after scale mapping.
- Added 531 aliases. These are messy label strings from `Next Ingredient Queue.csv` that map to an ingredient the app already explains (example: "semi sweet chocolate" maps to chocolate). Claude used the app's own matcher to make them, so they are safe. Do not re-audit these as new ingredients.
- Researched and added 13 genuinely-new substances from the queue, each with an FDA / eCFR / EFSA source: ferric phosphate, ferric pyrophosphate, disodium pyrophosphate, ammonium phosphate, distilled monoglyceride, mixed triglycerides, five FD&C red dye fragments, "fd c colors", orange puree, and gluten free flour.
- Left your 60 `needs-more-research` proposals untouched. They are Task 1.
- Left 11 tokens with no entry because they are not ingredients: "preserves freshness", "to retain freshness", "maintains freshness", "added to retain freshness", "to protect freshness", "non gmo", "gluten free", "granular", "leavening agents", "slat", "ntss". Mark these as non-ingredients in your workspace so they stop returning to the queue.

**Risk scale — important:** the app uses only three levels: 2 (Low), 5 (Medium), 8 (High). Your finer scores are welcome, but know that Claude maps them to the nearest level by the flag they imply: a score of 8 to 10 becomes High, 5 to 7 becomes Medium, 2 to 4 becomes Low.

**Task 1 (do first) — finish the 60 held score changes.**
- File: `Score Change Proposals.csv`. Work only the rows with status `needs-more-research`.
- For each row, find the evidence you were missing. Then confirm the change or reject it.
- Set status to `proposed` when the source is solid. Add the source and a one-line rationale.
- Set status to `rejected` when you cannot verify it. Say why in one line.
- Every held row is a score LOWER or a no-change. None makes a product scarier. Do not raise a score here without a strong, cited reason.

**Task 2 (do second) — keep processing `Next Ingredient Queue.csv`.**
- About 1,693 of the 2,250 queue tokens already work in the app. Do not spend effort on label variants of a known ingredient. Claude's 531 aliases cover those.
- Work only tokens that name a REAL substance the app does not explain yet.
- For each real substance give: the normalized name, a risk score, a category, a plain one or two sentence explanation, and a source.
- Send label fragments, purpose clauses, and OCR junk to a `could_not_verify` list. Do not force a classification.
- Category must be one from the app's existing set. The list is in the WAVE 01 brief below.

**Output files (Chad owns these for the run):** your audit workspace CSVs (`Score Change Proposals.csv`, `Next Ingredient Queue.csv`, and your master list). The founder gives them to Claude. Claude validates and integrates them into the app, the same way as this round.
**Validation (Claude runs after):** parse each changed row; confirm risk and category are in the allowed sets; run the audit importer; `npm test` must stay green; rebuild the catalog; report the score drift.
**Rules:** no fabrication — `could_not_verify` is a success, not a failure; source everything; regulatory or observational facts only, no medical-causation claims; stay consistent with existing entries for the same substance family.

### INGREDIENT-CACHE UNKNOWNS — WAVE 01 (recurring campaign) — status: MERGED (2026-07-05, 98.10%→98.90% coverage, 196/196 tests, see decision-log)
**Goal:** Classify the top 150 currently-unrecognized ingredient strings so the app's scorer stops bucketing them as "unrecognized" (they fail every lookup in `src/utils/scorer.js` and fall to a heuristic).
**Output files (Chad owns these for the run):** `src/data/batches/batch_15_unknowns_w01.js` (new file — do NOT edit `src/data/ingredientCache.js`, `src/data/ingredients.js`, or any other file).
**Format/schema:** Input list = `scripts/ingredients/remaining-unknowns.json` (regenerated 2026-07-05 — 150 entries, `{ ingredient, count }`, sorted by occurrence count). For EACH entry, write exactly one line in the output file, matching the existing batch convention (see `src/data/batches/batch_14_bakery.js` for live examples):
```
  'exact input string': { risk: IngredientRisk.Low, category: 'additives', explanation: 'One or two sentences.' },
```
- **Key = the exact `ingredient` string from the input list, unchanged** (it is already normalized/lowercase; the app's exact-match lookup depends on it).
- `risk` = `IngredientRisk.Low` | `IngredientRisk.Medium` | `IngredientRisk.High` only.
- `category` = one of the existing cache categories only: `additives, sweeteners, preservatives, grains, fats, flavor-enhancers, dairy, dairy-alternatives, emulsifiers, dyes, proteins, vitamins, fruits, vegetables, legumes, nuts, seeds, spices, beverages, probiotics, cacao, amino acids, sugar-alcohols, eggs, seafood, meats, stimulants, condiments, confectionery, botanicals`.
- `explanation` = plain-English, one–two sentences, in the established voice: what it is + why the risk level, with regulatory framing where it applies (e.g. "FDA GRAS", "21 CFR ...", "IARC ..."). **No apostrophes inside explanations** (single-quoted strings; the merge script is line-parsed — if unavoidable, escape as `\'`).
- **Many entries are label FRAGMENTS or purpose clauses, not ingredients** ("for color", "to prevent caking", "contains 2 or less of salt", "a natural mold inhibitor"). Classify what the phrase DENOTES at the class level and say so honestly: e.g. `'for color'` → category `dyes`, explanation that it marks an unspecified added colorant whose identity the label does not disclose. Pure quantity/prep fragments ("contains 2 or less of salt", "and salt", "boneless") → classify as the underlying substance/attribute at its established severity (salt is already Low in the cache — stay consistent with existing entries for the same substance).
- If you genuinely cannot classify an entry on sourced grounds, OMIT it and list it under a `// could_not_verify:` comment block at the end of the file — that is a successful outcome, not a failure.
**Validation (Claude runs after):** line-regex parse of every entry; keys ⊆ input list, lowercase, unique; category/risk from the allowed sets; harness-eval of the entries as an object literal; then `node scripts/ingredients/merge-ingredient-batches.js` (dedupes against existing keys), `npm test` (196 tests must stay green), and a rerun of `node scripts/ingredients/ingredient-coverage.js` — the matched-% delta is this wave's scorecard. Opus spot-review of classifications against sources before the founder commits.
**Rules:** no fabrication (could_not_verify is success), no invented health effects — sourced/regulatory classifications only, consistent with existing cache entries for the same substance family; don't touch files outside your list; this brief is the standing template — waves 02+ change only the wave number after Claude regenerates the input list.

### INGREDIENT-CACHE UNKNOWNS — WAVE 02 (recurring campaign) — status: MERGED (2026-07-05, 98.90%→99.11% coverage, 196/196 tests, see decision-log)

### INGREDIENT-CACHE UNKNOWNS — WAVE 03 (recurring campaign) — status: MERGED (2026-07-05, 99.11%→99.22% coverage, 196/196 tests, via direct `codex exec`, see decision-log)
**Goal:** Same as Waves 01/02 — classify the next top-150 unrecognized ingredients. Same format/rules as the standing template above.
**Output files:** `src/data/batches/batch_17_unknowns_w03.js`.
**Routing change (2026-07-05):** run directly via the programmatic `codex exec` lane (`instructions/efficiency.md`'s Codex CLI mechanics) instead of the manual paste-bridge — no founder copy/paste needed. Same model (gpt-5.5), same validation pipeline after (Hadrian mechanical + Opus accuracy, both independent, before merge). Paste-bridge remains available for anything that doesn't fit a single self-contained CLI prompt.
**Validation:** identical to Waves 01/02.
**Goal:** Same as Wave 01 — classify the next top-150 unrecognized ingredient strings. `scripts/ingredients/remaining-unknowns.json` was auto-regenerated as a side effect of Wave 01's coverage re-measure, so it's already fresh (2026-07-05) and ready to use as-is.
**Output files (Chad owns these for the run):** `src/data/batches/batch_16_unknowns_w02.js` (new file — same rules as Wave 01: do NOT edit `ingredientCache.js`, `ingredients.js`, or any other file).
**Format/schema:** Identical to Wave 01 — see that brief above for the full spec (key format, allowed risk/category sets, label-fragment handling, could_not_verify rule). One heads-up specific to this wave: the top of the current input list is dominated by the same 6 fragments Wave 01 correctly punted (`'slat'`, `'5'`, `'1'`, `''`, `'3'`, `'ntss 31'`) plus `'4'` — they rank high by occurrence count but are still genuinely unclassifiable (OCR noise / numeric fragments). Punt them again to `could_not_verify` exactly as before — don't force a classification just because they resurfaced. (Note for Claude/founder: worth adding a permanent exclude-list for these specific strings before generating Wave 03's input, so they stop taking up slots in the top-150 every round.)
**Validation (Claude runs after):** identical pipeline to Wave 01 — line-regex parse, keys check, enum check, harness-eval, `node scripts/ingredients/merge-ingredient-batches.js`, `npm test` (must stay green), re-run `node scripts/ingredients/ingredient-coverage.js` for the new coverage delta, independent Opus accuracy review before anything merges.
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
