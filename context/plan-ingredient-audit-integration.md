# Plan: integrate the ChatGPT Ingredient Audit into the app

_Created 2026-08-08. Source: `C:\Users\chris\Ingredient Audit by ChatGPT\` (Chad's audit workspace, last refreshed 2026-07-24)._

## What the audit contains (verified, not assumed)

| File | Rows | What it is |
|---|---|---|
| Ingredient Master List.csv | 3,553 | The app's full `CACHED_INGREDIENT_ANALYSIS` (all 3,528 keys match exactly, zero drift) + **25 new audited ingredients** |
| Score Change Proposals.csv | 150 | Proposed risk changes to existing entries. **Not applied anywhere.** Each has a rationale, a confidence level, and a status (`proposed` / `needs-more-research`) |
| Next Ingredient Queue.csv | 2,250 | Future work candidates. Not part of this integration |
| Research Sources.csv | 431 | Evidence library. Stays outside the app |
| Archive - Technical Research Records | — | Batch checkpoints. Stays outside the app |

The 25 new ingredients include real coverage gaps: `fd&c red 3`, `fd&c red 40`, `citrus red 2`, `artificial color`, `fully hydrogenated oil`, `carboxymethylcellulose`.

## Two constraints the CSVs do not respect

1. **Risk scale.** The app's `IngredientRisk` enum is 2 (Low), 5 (Medium), 8 (High) — nothing else. Several proposals propose risk 3. Decision: **map 3 → 2 (Low)**. Extending the enum would change `riskToFlag()` thresholds and scorer behavior for all 3,528 entries — not worth it for a one-point nuance the UI cannot display anyway.
2. **Rating labels.** The CSV's `rating` column (`ok`/`caution`/`avoid`/`allergen`) is Chad's bookkeeping. The app derives display labels from risk via `riskToFlag()`. The importer ignores the column; a validator warns if a proposal's label disagrees with what its mapped risk would derive.

## Doctrine that applies

- **Chad's output gets validated like any agent's** (CLAUDE.md). The proposals cite FDA/GRAS/CFR facts — the never-fabricate rail means we verify before we ship, and the regulatory-facts-only rail means rationales that lean on regulation are the right kind. Creator ≠ reviewer: Chad wrote them, an Opus reviewer checks them.
- Customer-facing `customerExplanation` text on the 25 new entries must pass the 8th-grade voice check.
- Score changes alter what every user sees on scanned products. The founder decides; the review only recommends.

## Phases

### A — Importer + validators (deterministic script, no AI)
`scripts/ingredient-audit/import-audit.js`:
- Parse both CSVs with a real CSV parser (quoted fields contain commas).
- Validate: lowercase name, risk maps into {2,5,8}, category in the known category set, non-empty explanation, no duplicate keys.
- Output a normalized `audit-import.json` checkpoint — the sole input for later steps. No hand edits to `ingredientCache.js` ever.

### B — Review + founder decision on the 150 proposals
1. Split by direction and status: raises (~18 `avoid`-bound), lowers (~130, mostly EDTA/GRAS-style corrections), `needs-more-research` (excluded this round).
2. Opus reviewer verifies **every raise** against primary sources (raises create "the app got scarier" moments and legal exposure) and **a 20-proposal sample of the lowers** (lowers are the low-risk direction). If the sample fails >2, escalate to full verification.
3. Present the founder one grouped decision sheet: accept-all-lowers / accept-all-raises / per-item exceptions. Target: one sitting, not 150 questions.

### C — Apply + blast-radius report
- Script applies approved changes + the 25 new entries to `src/data/ingredientCache.js`, preserving file format.
- Run the full test suite (502).
- **Score-drift report**: re-score all 1,092 catalog products before/after; list every product whose score moves, with the delta and the ingredient that caused it. Founder sees the blast radius before anything ships.

### D — Ship through the Phase-3 lane
- Rebuild `products.db` (picks the new ingredient data into the `ingredient_analysis` table), validate, upload, bump `scripts/manifest.json`, publish.
- Same gate as the pending catalog: **after 1.2.0 is approved**, so existing installs get the overlay-capable binary first.
- The bundled `ingredientCache.js` update rides the next build automatically as the offline seed.

### E — Standing loop for the remaining 2,250 (SOP, later)
Chad seals batches → audit refresh → periodic re-run of Phases A–D on the new deltas. Write into `context/sops.md` once the first pass proves the tooling. Not part of this integration.

## Effort and routing

| Phase | Who | Size |
|---|---|---|
| A importer | codex/Hadrian | small script |
| B review | Opus reviewer agent | the real cost — ~38 verifications |
| B decision | Founder | one sitting |
| C apply + drift | codex/Hadrian | small script + report |
| D ship | Claude session | existing commands |

## Open decisions (founder)

1. Approve the risk-3 → 2 mapping. (Recommended above.)
2. Review depth for the ~130 lowers: 20-sample (recommended) or full verification.
