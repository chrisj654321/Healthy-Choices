# High-impact backlog plan — 2026-07-05

_Fable planning pass on the 4 high-impact backlog items (backlog.md #1–#4), incorporating the same-day video-strategy reopening (decision-log 2026-07-05). This is a plan, not a build: the only executable deliverables are the two Chad briefs appended to [chad-tasks.md](chad-tasks.md). Every claim below was verified against the real codebase before being written down._

## Routing summary (so nobody re-asks "Chad, Haiku, or Sonnet?")

Per the efficiency.md table — this is settled, apply it without re-litigating:

| Work | Model/lane | Why |
|---|---|---|
| Ingredient classification waves (#1) | **Chad (gpt-5.5, paste-bridge)** | Bulk research/classification with a file deliverable — Chad's exact lane. Haiku is banned from generating facts; Sonnet is for building, not research legwork |
| Shopping-guides research pass (#2a) | **Chad (gpt-5.5, paste-bridge)** | Verified-sources research, self-contained, file deliverable |
| Guides screen + content files (#2b) | **Hadrian (Sonnet)** after research is reviewed | User-facing app code = taste ≥ 7 |
| Website build (#3) | **General-purpose Sonnet session/agent** (NOT Hadrian — his domain is the RN app) | User-facing, but plain HTML/CSS — one scoped Sonnet build |
| Waitlist SQL + validation scripts | **Local scripts / main session** | Deterministic |
| Mascot design brief + reviews (#4) | **Manager writes brief; founder produces via AI-image tools + cheap commission** | Creative judgment + outside-the-repo production |
| All reviews before merge/ship | **Opus (manager from Jul 7)** | Creator ≠ reviewer, always |

**Sequencing** (driven by the Aug 3 availability cliff and build-28-pending): start both Chad briefs **now** (free, parallel, founder just pastes); website is the next Claude build (waitlist is an open P1 and the launch-burst landing target); guides build lands after its research is reviewed; mascot is deliberately last (see §4 — the video pivot demoted it).

---

## 1. Unrecognized-ingredient elimination — recurring Chad campaign

### The real mechanism (verified in code)

- `src/utils/scorer.js` → `lookupIngredient(raw)`: normalizes the raw label string, tries **exact match** against `CACHED_INGREDIENT_ANALYSIS` (`src/data/ingredientCache.js`, ~2,709 entries) + `INGREDIENT_DB` (`src/data/ingredients.js`), then singularized variants, then a **significant-token fallback** (unambiguous single winner required).
- Anything that misses everything falls to `classifyUnknown()` → heuristic flag + `category: 'unknown'` → the UI's "unrecognized" bucket.
- **"Unrecognized" precisely = an ingredient string whose normalized form fails all of exact, singularized, and token lookup.**

### Fresh state (regenerated today — the old `remaining-unknowns.json` was from 2026-06-18)

Ran `node scripts/ingredient-coverage.js` against the 135k-product corpus, 2026-07-05:

- 2,993,332 total ingredient occurrences; **98.10% now match** (token matching shipped in scorer.js) — **56,744 occurrences (1.90%) remain unknown**.
- Top-150 distinct unknowns = 19,001 occurrences (~33% of all remaining unknowns). Expect ~3–5 waves of 150 to capture most of the tail's head; a long tail persists (ongoing campaign, per backlog).
- **Character of the remainder:** mostly label-fragment/purpose phrases, not exotic chemicals — "for color" (2,289), "contains 2 or less of salt" (721), "to prevent caking" (634), "a natural mold inhibitor" (537). The classification task is largely "map the phrase to the additive class it denotes," which is exactly why sourced-classification rails matter (no invented effects).

### Existing tooling — nothing new needs writing

| Piece | Already exists |
|---|---|
| Enumerate unknowns | `scripts/ingredient-coverage.js` → writes top-150 to `scripts/remaining-unknowns.json` |
| Batch file format | `src/data/batches/batch_01..14_*.js` (bare `'key': { risk: IngredientRisk.X, category, explanation },` lines) |
| Merge + dedupe | `scripts/merge-ingredient-batches.js` (globs `src/data/batches/batch_*.js`, skips existing keys — idempotent, safe with old batch files present) |
| Regression net | `npm test` (196 tests incl. scorer suite) |

Only future tweak worth considering: raise the top-150 cap in `ingredient-coverage.js` if waves prove clean (a 2-character change; not needed for wave 01).

### The loop (reusable for wave 02, 03, …)

1. **Claude (main session, local script):** `node scripts/ingredient-coverage.js` — regenerate the list. Record the matched % as the wave's baseline.
2. **Founder pastes** the standing Chad brief (chad-tasks.md — written today, wave number is the only thing that changes) into ChatGPT.
3. **Chad** writes `src/data/batches/batch_2X_unknowns_wNN.js` per the schema.
4. **Claude validates** (scripted, free): line-regex parse, lowercase keys, allowed category, allowed risk constant, no unescaped apostrophes, keys actually in the input list, dedupe. Then **Opus-tier review of the classifications themselves** (spot-check explanations against sources — accuracy rails: no fabricated effects, regulatory framing like the existing entries' FDA GRAS/CFR cites).
5. **Claude merges** via `scripts/merge-ingredient-batches.js`, runs `npm test`, reruns `ingredient-coverage.js` — the matched-% delta is the wave's measurable outcome. Founder commits.
6. Repeat next wave. **Git-status check before every step that touches `src/data/`** (Chad runs product waves there in parallel).

**Deliverable written today:** Wave 01 brief in chad-tasks.md, status DRAFTED, scoped to the fresh top-150.

---

## 2. Shopping guides hub v1 — research now (Chad), build later (Hadrian)

### 2a. Research phase → Chad (brief written today, chad-tasks.md)

Verified-sources pass over the four backlog topics: perimeter rules (+bakery exception), fruit picking/ripeness/coatings/wash practices, meat-label decoding (marketing vs. regulation), PLU codes. Every claim carries a named source + URL + a confidence tag; `could_not_verify` is an acceptable and expected output. Output is a research document, **not** app copy — plain-English rewriting happens at build time under review. Full spec in the brief.

### 2b. Build phase → plan only (do NOT start until research is validated)

**Reuse check (done):** `src/data/healthyCategories.js` tiles are a data-driven array (`id/label/icon/color/lightColor` via `categoryAccents` in colors.js) — the **visual tile pattern reuses cleanly** for a Guides grid. But the tiles' data plumbing (`productCategories` matched against PRODUCT_DB + score-sorted product lists) does **not** apply: guides are static content, not product-backed. So: same look, new data source — not a config-only change, but a small, honest one.

Build steps (Hadrian, one scoped brief, after research review):

1. **Content file:** `src/data/guides.js` — array of guides, each `{ id, title, icon, color, sections: [{ heading, body, sourceNote }] }`. Body copy written at build time FROM the validated research doc, 8th-grade voice, each section traceable to a sourced claim. No claim enters `guides.js` that isn't in the reviewed research doc — that's the accuracy gate.
2. **Screens:** `GuidesScreen` (tile grid, healthyCategories visual pattern) + `GuideDetailScreen` (sections renderer). Entry point: Home hub card (fits the FlavCity-inspired home-page roadmap — guides/discovery hub is already on that map). Navigation via AppNavigator, same stack conventions as the 13 existing screens.
3. **Review chain (health-adjacent claims — non-negotiable):** Chad research → **Opus review of the research doc** (source-by-source: does the citation actually support the claim?) → founder approves → Hadrian builds → **Opus reviews the diff AND the on-screen copy against the research doc** → founder commits. Two distinct review moments because copy drift between "what the source said" and "what the screen says" is exactly where health-adjacent apps get in trouble.
4. **Cicero double-dip:** after ship, hand `guides.js` + the research doc to Cicero as a content bank — each guide is a natural video/post series ("the sticker on your apple is telling you something"). Zero extra research cost; log it as an input for the next content-sprint run.

No OTA concern: pure JS/data — rides any next build, no new native modules.

---

## 3. Marketing website — upgrade the LIVE site, don't greenfield it

### Constraint correction (backlog is slightly wrong)

The backlog says Netlify "currently serves only privacy.html/terms.html." **Not so:** `web/index.html` is a committed, deployed landing page (hero, three VISION pillars, footer, "Coming soon" badge) plus `support.html`, all behind `netlify.toml` (`publish = "web"`, redirects for /privacy /terms /support /launch). It already uses the brand palette (#1D9E75 green, #F7FAF9 background) and VISION copy. **This project is an upgrade, not a build-from-zero** — which shrinks it from "overhaul" to roughly a feature.

What's actually missing: **waitlist signup form** (the open P1), **App Store badge/link** (post-approval), **the real app icon** (current logo is a 🔍 emoji placeholder), screenshots/product visuals, and — new option since today's pivot — a founder-shot demo clip.

### Waitlist backend (verified: nothing waitlist-shaped exists in Supabase)

Grepped `src/` + `supabase/` — no waitlist table or reference. Create one, mirroring the `product_requests`/`scan_events` insert-only posture exactly:

- **`supabase/waitlist_setup.sql`** (founder runs once in the SQL Editor, same as product_requests_setup.sql):
  - `waitlist_signups(id uuid pk default gen_random_uuid(), email text not null unique, source text, created_at timestamptz default now())`
  - `enable row level security`; **one INSERT policy for `anon`** (`with check (true)`); **no select/update/delete** — client write-only, dashboard/service-role read-only. `unique(email)` makes double-submits a clean 409.
- **Frontend:** plain `fetch` POST to the project's PostgREST endpoint (`/rest/v1/waitlist_signups`) with the existing **anon key** (public by design — same key already ships inside the app binary; RLS is the guard, exactly the current pattern). No supabase-js bundle needed on a static page. Handle 409 as "you're already on the list." Add a hidden honeypot field for cheap bot filtering.

### Tech approach: stay static HTML — deliberately

The site is already framework-free single-file HTML/CSS and auto-deploys on git push. For a founder-maintained-forever marketing page, **that is the right stack**: no build step, no dependencies to rot during the 7-month low-availability window, editable by any future session in one file. Do not introduce Next/Astro/React for a 3-page site. (Escape hatch: if the site ever grows past ~6 pages or needs shared templates, revisit — not before.)

### Phases

| Phase | Ships | When |
|---|---|---|
| **1 — Waitlist (pre-approval)** | Waitlist form + `waitlist_setup.sql`; real app icon replaces the emoji; keep "Coming soon" badge | Next build slot — it's an open P1 and the launch plan says "waitlist before approval" |
| **2 — Launch flip (approval day)** | Swap badge → real App Store badge/link; add screenshots; waitlist copy becomes "Download now" (keep the form as a secondary capture) | The day build 28 (or successor) is approved — pre-stage the diff so the flip is a 5-minute commit |
| **3 — Content (post-launch, optional)** | Founder-shot demo clip in the hero (per today's video pivot — same footage gut-check rule: nothing military in frame); guide-teaser section cross-linking app guides | Opportunistic, after Phases 1–2 |

**Who builds it:** a general-purpose **Sonnet** session/agent with a scoped brief (this section is 80% of that brief). Explicitly NOT Hadrian — his identity/rules are the Expo RN app; a web one-pager doesn't need his RN constraints, just the standard rails (no commits, founder reviews on the Netlify deploy preview). Manager reviews the diff + the live form posting a test row before the founder commits.

---

## 4. Mascot — REFRAMED by today's video pivot; deliberately last

### What changed

The backlog entry (written earlier today, pre-pivot) frames the mascot as an extension of the synthetic-AI-actor cast under the "no founder face" rule. **Both premises died this afternoon:** the founder now films real video himself (already recording), and Runway — the assumed animation pipeline — is exactly what he found wasn't working. A mascot-as-synthetic-video-actor would re-enter the lane he just exited. Don't build the backlog item as written.

### What a mascot is actually for now — recommendation (pick one, justified)

**Recommended: in-app companion character first; marketing use limited to a static overlay/sticker device in founder videos. Not a video actor.**

Why this and not the alternatives:

- *Pure marketing-video asset:* dead on arrival — real founder video removed the gap a synthetic character existed to fill, and there's no animation pipeline to produce it anyway.
- *Full both-worlds character:* production cost (rigged animation, consistent generation) against a $27–50/mo budget and an Aug 3 founder-availability cliff — not defensible now.
- *In-app companion:* the app has real, cheap surfaces where a character earns its keep — onboarding steps (OnboardingScreen), empty states (scan history, My Requests, favorites), the notification-priming moment, error states. Static illustrations + one or two Lottie animations (`lottie-react-native`, Expo-compatible — but note: adding it is a **new native module → rides a build, no OTA**; static PNG poses need nothing new). This serves "Empowering / feels like nothing they've used before" (VISION) at near-zero marginal cost, and the same character PNG works as a corner sticker in CapCut on founder footage — brand continuity without an animation pipeline.

**Visual identity — derive, don't invent:** the character grows out of the existing mark — the shelf + **wood-handled magnifying glass** icon and the green palette (`#1D9E75` primary / `#157A5A` dark / `#E8F7F2` light, warm tan `#A98D5F` as the wood accent — all in `src/constants/colors.js`). Concept direction: a friendly magnifying-glass character (the brand object personified) — curious, calm, "informed friend in the grocery aisle" per the style guide's brand feeling. NOT a vegetable/animal mascot disconnected from the mark.

### Production path (no illustration pipeline exists — real options)

1. **Concept (near-free):** founder + AI image tools (GPT-image/Midjourney-class) generate 10–20 candidates from a design brief; founder picks one. AI output is for *choosing*, not shipping.
2. **Canonical asset (cheap commission, ~$100–300 one-time):** a Fiverr/99designs-tier illustrator turns the chosen concept into a clean **vector reference sheet** — 4–6 poses/expressions + color spec. This is the consistency anchor AI generation can't reliably give; a one-time cost, not a subscription (fits the budget doctrine better than keeping Runway for this).
3. **Deploy in-app (Hadrian, later):** static poses on 3–4 surfaces first; Lottie animation only if a later build slot justifies the native module.
4. **Video use:** transparent-PNG sticker overlays in CapCut (already in the free tool stack). Zero new tooling.

### Next steps + timing

Manager writes the **character design brief** (personality, poses, palette hexes, mark-derivation rules, do/don'ts from the style guide) — one short doc, do when the founder says go. But **sequence this last of the four**: it blocks nothing, ships no revenue lever, and the founder's scarce pre-Aug-3 hours are better spent filming (his new video lane) and on items 1–3. If it slips past Aug 3, concepting (step 1) is actually a fine low-energy weekend task during the limited window.

---

## Open founder decisions (numbered, per house style)

1. **Wave 01 go:** paste the ingredient brief (chad-tasks.md) into ChatGPT? (List is fresh as of today.)
2. **Guides research go:** paste the guides brief in parallel? (Chad can run both.)
3. **Website Phase 1:** green-light a Sonnet build session for waitlist + icon swap this week (pre-approval is the whole point)?
4. **Mascot timing:** accept "in-app companion, sequenced last" — or does he want the design brief written now anyway?
