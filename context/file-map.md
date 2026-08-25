# File map — where everything lives, and where new files go

This is the one rulebook for file organization. Claude and Chad both follow it. The goal is simple: a person who is not a coder can find things, and new files never pile up loose again.

## The two zones

**Zone A — Code. Do NOT rename or move these.** The app framework (React Native / Expo) needs these exact names and places. Move one and the app breaks. Leave this zone exactly as it is:

- everything under `src/` (screens, components, utils, data)
- the config files at the top of the project: `App.js`, `index.js`, `app.json`, `package.json`, `babel.config.js`, `metro.config.js`, `eas.json`, `eslint.config.js`, `netlify.toml`, `.gitignore`, `.easignore`, `.env.example`
- `assets/`, `web/` (the live website), `supabase/`, `.claude/`
- `CLAUDE.md`, `README.md`, `VISION.md` stay at the top (tools read them there)

**Zone B — Workshop. Organize freely.** These are working files the app never loads, so moving them is safe: `scripts/`, `docs/`, `context/`, `instructions/`, `memory/`, `marketing/`.

## The five naming rules

1. **Name a folder after its job, in plain words, lowercase-with-dashes** — `catalog-database`, not `db`.
2. **Every file lives in a job folder. No loose files at the top of `scripts/` or the top of the project.** This is the rule that stops the mess.
3. **Group files by what they are FOR, not by their type** — put every "build the product database" tool together, whether it ends in `.js`, `.py`, or `.sh`.
4. **When a job is finished and will not run again, move the file to an `archive/` folder** — the working folders then show only live tools.
5. **Give each folder a one-line `README.md`** that says what it holds.

## Where does a new file go?

- Is it app code the phone runs? → `src/` (ask first if unsure — Zone A).
- Is it a tool or script you run on the computer? → `scripts/<job>/` (see the map below).
- Is it a working note, a plan, or a task board? → `context/`.
- Is it a reference document a person reads (analysis, architecture, copy drafts)? → `docs/`.
- Is it product or ingredient data (Chad's research output)? → `src/data/...` (batches, research), or the external ingredient-audit folder.
- Is the job done and the file kept only for history? → the nearest `archive/`.

If none fit, ask — do not drop it loose.

## Current folder map

**`scripts/` — computer tools, one folder per job:**
- `catalog-database/` — build, validate, and upload the product database + its manifest; the daily ingest task
- `products/` — add, merge, tag, and audit product catalog data
- `ingredients/` — ingredient-audit tooling (merges, coverage, wave planning, the audit dashboard)
- `media/` — image, video, mascot, and App-Store-screenshot generation
- `content-factory/` — the social-content pipeline (its path is locked by `package.json`; do not move it)
- `archive/` — spent one-off scripts kept out of the way

**`docs/` — reference documents for people:** architecture notes, business/competitor analysis, copy drafts.

**`context/` — the operating memory:** plans, decision log, priorities, task boards, this map.

**`src/data/` — the app's data (Chad-owned research lands here):** `batches/`, `research/`, `company_reanalysis/`, plus the loaded data files at its top (these are Zone A — do not move).

## For Chad

Chad's research output follows the same rules: product batches go under `src/data/batches/...`, sourcing/company research under `src/data/research/...`, candidate lists as named CSVs in the batch folder, and audit working files in the external `Ingredient Audit by ChatGPT` folder. No loose files at the top of any folder. When a wave is finished, its one-off scripts move to `archive/`.
