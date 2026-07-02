# Idea backlog — sorted by impact, sized by effort

_Founder brain-dump triaged 2026-07-01. Completed ideas get deleted; shipped items move to the decision log. Sizes: **tweak** (batchable in an afternoon), **feature** (a planned build), **overhaul** (architecture-level — schedule deliberately)._

## 🔥 High impact — do first

### 1. Ingredients tab: verdict-first regroup — **feature (one screen)** · biggest UX win on the list
Redesign ProductScoreScreen's ingredients tab from category-grouped to verdict-grouped: **Bad/Caution → Moderate → Good**, top to bottom, as collapsible sections that open to explain what each ingredient does. Glanceable in 2 seconds, explorable on tap. **Unrecognized ingredients move to the very bottom of Moderate** (not their own scary bucket).
- Companion data campaign: **eliminate "unrecognized"** — pull every ingredient currently unmatched by `ingredientCache.js` across the DB, categorize them in batches (Octavius-style script → review → cache additions). Ongoing; shrink to zero over time.

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

4. **My Stores logos** — **tweak.** Profile "My Stores" should show retailer logos; walmart/kroger/amazon-whole-foods already exist in companies.js with logos — wire the same logo component in.
5. **"Favorite stores" at signup** — **tweak/small feature.** Add a store-picker step to onboarding (feeds future store guides + personalization). Already on the home-page roadmap.
6. **Top-10 unexpected food facts** — **content task.** Research (verified) → feeds both a possible in-app "did you know" surface and Cicero's content bank.

## 🟠 Big swings — schedule deliberately

7. **Dark mode** — **overhaul.** Colors is a static constant used across ~20 screens; real dark mode means a theme context + dynamic palette everywhere + asset audits. High polish value, real cost. Profile already has a Display Settings section to house the toggle. Don't start this in a batch-work session.

## 📦 Saved for later (founder-flagged: needs curated data, build over time)

8. **Store-specific guides** — Aldi / Costco / Target / Whole Foods swipeable guides.
9. **Category guides** — savory snacks, cereal, dairy, etc.
10. **Shop Smart by Aisle** — aisle-by-aisle companion mode (home-page roadmap).

## ✅ Done → deleted from backlog (see decision-log)
- Real company logos (254/269, 2026-07-01) · Homepage photo-forward redesign (in build 27 — re-evaluate live)
