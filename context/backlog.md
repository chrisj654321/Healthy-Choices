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
- _Compliance notes (researched 2026-07-04):_ local notifications only (no APNs server needed); expo-notifications rides the NEXT planned build. System permission prompt fires **once ever** → show our own priming screen first (allowed & recommended), only trigger the system prompt on "Yes". Guideline 4.5.4: engagement reminders fine; anything promotional needs explicit opt-in language + an in-app opt-out toggle (add Notifications section to Profile settings). Copy bank drafted in session 2026-07-04 — every factual claim must be verified before shipping.

### 3. Shopping guides hub v1 — **feature + research** · start of the Guides pillar
Scientifically-supported best practices, each claim sourced:
- **General rules** — shop the perimeter (produce/meat/dairy on the walls; aisles = processed; note the bakery exception), read serving sizes first, the 4-number check (already our content).
- **Fruits** — picking, ripeness, wax/coatings, wash practices (baking-soda wash evidence exists).
- **Meats** — labels decoded (grass-fed vs finished, air-chilled, "natural"), what's marketing vs regulation.
- **Produce barcodes/PLU codes** — 4-digit conventional, 9-prefix organic; what stickers actually tell you.
Research pass first (verified sources only) → guide content files → simple Guides screen (reuse category-tile pattern). Doubles as marketing ammo (each guide = posts/scripts for Cicero).

### 4. "Buy this instead" — better-graded alternatives on D/F scores — **feature** · growth + Pro upsell
When a product grades poorly, show 2–3 higher-graded products from the same category (data exists: 873 curated w/ categories+grades). Flips the app from judge to guide; strongest un-built Pro surface ("see all N cleaner options"). Added 2026-07-04.

### 5. Product-not-found request loop — **feature (small)** · plugs the highest-intent leak
Miss screen currently dead-ends ("check back later"). Add "Request this product" → product_requests table (exists; RLS still pending, P3) + a "My requests" status list. Misses become engagement; the queue becomes Octavius's demand-ranked worklist. Added 2026-07-04.

## 🟢 Quick wins — batch these tweaks together

5c. **Pantry report card** — **tweak/feature.** "You've scanned N, pantry average B−, worst offender X" personal stats surface; feeds positive-progress notifications (shipped 2026-07-04) and, with a designed share-card image, turns users into the marketing channel. Added 2026-07-04.

5d. **Scan-during-onboarding final step** — **tweak.** Replace/augment the "Ready" step with "scan something near you right now" — compresses time-to-first-aha to zero. Added 2026-07-04.

5b. **App-feel polish pack** — **tweak batch** (found 2026-07-04):
- **Review-prompt compliance fix (do before next submission):** `src/utils/reviewPrompt.js` wraps `StoreReview.requestReview()` in a custom Alert pre-prompt — Guideline 5.6.1 disallows custom review prompts. Remove the Alert, call `requestReview()` directly at good moments (after 2nd–3rd successful scan, after subscribe); drop the `onboarding` moment (Apple: never on first run). Keep the AsyncStorage throttle; system caps at 3/365 days anyway.
- **Haptics expansion:** today only scan-success fires a haptic (ScannerScreen). Add: error haptic on product-not-found + daily-limit; warning/success haptic keyed to grade on ProductScore reveal; selection haptics on tab switches, filter chips, favorite/store toggles; success haptic on purchase complete. No permissions needed.
- **Grade-reveal animation:** ProductScoreScreen has zero Animated usage — a short scale/count-up on the grade + matching haptic is the single biggest "feels like a real app" win.

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
