# Idea backlog — sorted by impact, sized by effort

_Founder brain-dump triaged 2026-07-01. Completed ideas get deleted; shipped items move to the decision log. Sizes: **tweak** (batchable in an afternoon), **feature** (a planned build), **overhaul** (architecture-level — schedule deliberately)._

## 🔥 High impact — do first

### 1. Unrecognized-ingredient elimination — **data campaign (ongoing)**
_UI regroup SHIPPED 2026-07-02 (verdict-first Bad→Moderate→Good sections, unrecognized at bottom of Moderate)._ Remaining: **eliminate "unrecognized"** — pull every ingredient currently unmatched by `ingredientCache.js` across the DB, categorize them in batches (Octavius-style script → review → cache additions). Ongoing; shrink to zero over time.

### 2. Notifications: permission ask + encouraging streak — **feature** · the retention lever
- "Allow notifications?" step at signup (expo-notifications, local scheduling).
- **Daily pantry-audit reminder for the first 3 days** post-signup.
- Tone: positive and encouraging — or playful "the app misses you / your pantry has secrets left" energy. Never guilt.
- Wanted: a real stat linking pantry audits → health outcomes. **Must be verified research — if no credible stat exists, use honest adjacent framing ("people who track eat better") or none. Never fabricate.**

### 3. Shopping guides hub v1 — **feature + research** · start of the Guides pillar
Scientifically-supported best practices, each claim sourced:
- **General rules** — shop the perimeter (produce/meat/dairy on the walls; aisles = processed; note the bakery exception), read serving sizes first, the 4-number check (already our content).
- **Fruits** — picking, ripeness, wax/coatings, wash practices (baking-soda wash evidence exists).
- **Meats** — labels decoded (grass-fed vs finished, air-chilled, "natural"), what's marketing vs regulation.
- **Produce barcodes/PLU codes** — 4-digit conventional, 9-prefix organic; what stickers actually tell you.
Research pass first (verified sources only) → guide content files → simple Guides screen (reuse category-tile pattern). Doubles as marketing ammo (each guide = posts/scripts for Cicero).

## 🟢 Quick wins — batch these tweaks together

6. **Top-10 unexpected food facts** — **content task.** Research (verified) → feeds both a possible in-app "did you know" surface and Cicero's content bank.

## 🟠 Big swings — schedule deliberately

7. **Dark mode** — **overhaul.** Colors is a static constant used across ~20 screens; real dark mode means a theme context + dynamic palette everywhere + asset audits. High polish value, real cost. Profile already has a Display Settings section to house the toggle. Don't start this in a batch-work session.

## ⚙️ Workflow (founder's top to-do, saved 2026-07-01 — not started)

**Auto-route work to the cheapest capable model.** Fable/Opus has ~50% of weekly usage left (then API rates) — it should never do grunt work. Wanted: when the founder gives a task, it auto-assigns to the right tier (Haiku: never research, OK for trivial mechanical text; Sonnet: building, agents, commits, routine sessions; Fable/Opus: planning, review, strategy only). Investigate: Claude Code hooks/settings for model routing, `/model sonnet` as default for grunt sessions, and making "spawn a Sonnet agent" the reflex for anything self-contained. Note: a `git commit` itself is one cheap tool call — the real cost is which model carries the session context, so the win is routing whole tasks, not the commit step.

## 📦 Saved for later (founder-flagged: needs curated data, build over time)

8. **Store-specific guides** — Aldi / Costco / Target / Whole Foods swipeable guides.
9. **Category guides** — savory snacks, cereal, dairy, etc.
10. **Shop Smart by Aisle** — aisle-by-aisle companion mode (home-page roadmap).

## ✅ Done → deleted from backlog (see decision-log)
- Real company logos (254/269) · Homepage redesign (build 27) · Ingredients verdict-regroup UI (2026-07-02) · My Stores logos — 10 retailers real, 6 letter-fallback (2026-07-02) · Favorite-stores signup step (2026-07-02) · 212MB catalog analysis done → context/research-catalog-rearchitecture.md (SQLite productStore, 5 phases)
