# Idea backlog — sorted by impact, sized by effort

_Founder brain-dump triaged 2026-07-01. Completed ideas get deleted; shipped items move to the decision log. Sizes: **tweak** (batchable in an afternoon), **feature** (a planned build), **overhaul** (architecture-level — schedule deliberately)._

## 🔥 High impact — do first

### 1. Unrecognized-ingredient elimination — **data campaign (ongoing)**
_UI regroup SHIPPED 2026-07-02 (verdict-first Bad→Moderate→Good sections, unrecognized at bottom of Moderate)._ Remaining: **eliminate "unrecognized"** — pull every ingredient currently unmatched by `ingredientCache.js` across the DB, categorize them in batches (Chad via `codex exec` → dual validation → cache additions). Waves 1-3 done 2026-07-05 (coverage 98.10%→99.22%, gains per wave: +0.80pp, +0.21pp, +0.11pp — clearly diminishing).

**Stopping rule (set 2026-07-06): stop running waves once a single wave's coverage gain drops below 0.05 percentage points.** `ingredientCache.js` is a static import in `scorer.js` (eagerly bundled, same category of thing as the 212MB products file that needed a SQLite fix — just currently ~700KB, nowhere near urgent). Flat per-wave file-size cost against shrinking per-wave coverage gain is real bloat risk if run to zero; this rule caps it before that happens. Check the coverage delta after each wave's Hadrian validation step before deciding to run the next one. If growth continues past this threshold being useful, the real fix is moving ingredient risk data into the existing SQLite store (like the product catalog already did) rather than keeping the cache growing eager JS forever — not urgent today, revisit if this ever gets picked back up after being capped.

### 2. Shopping guides hub v1 — **feature + research** · start of the Guides pillar
Scientifically-supported best practices, each claim sourced:
- **General rules** — shop the perimeter (produce/meat/dairy on the walls; aisles = processed; note the bakery exception), read serving sizes first, the 4-number check (already our content).
- **Fruits** — picking, ripeness, wax/coatings, wash practices (baking-soda wash evidence exists).
- **Meats** — labels decoded (grass-fed vs finished, air-chilled, "natural"), what's marketing vs regulation.
- **Produce barcodes/PLU codes** — 4-digit conventional, 9-prefix organic; what stickers actually tell you.
Research pass first (verified sources only) → guide content files → simple Guides screen (reuse category-tile pattern). Doubles as marketing ammo (each guide = posts/scripts for Cicero).

### 3. Marketing website — **overhaul** · founder-flagged "really important," added 2026-07-05
Domain (`shelfexpose.app`) already bought and DNS-verified (2026-07-04); Netlify already auto-deploys on GitHub push and currently serves only `privacy.html`/`terms.html`. This is the REAL marketing site: landing page, App Store badge/link, waitlist signup (already an open P1 item in `priorities.md` — "waitlist page" was named but never built), pulls from the same brand assets as the app (icon, green palette, VISION.md copy). Reuses existing Netlify infra — not starting from zero. Schedule deliberately, don't fold into a batch session.

### 4. Mascot design + animation — **feature/creative pipeline** · founder-flagged, added 2026-07-05
A branded character for marketing video — ties directly into the LOCKED video strategy in `memory/marketing-plan.md`: synthetic AI actors only, no founder face, recurring cast currently Parent/Spouse/Child/Aisle Shopper per `marketing/ai-video-style-guide.md`. A mascot would extend that cast list, not replace the no-founder-face rule. Needs: character design (visual identity, consistent with the shelf+magnifying-glass icon/green palette), a reference sheet for consistent AI-video generation (same discipline as the existing cast), and short animation tests before committing to it as a recurring video presence. Consult `ai-video-style-guide.md` before designing so it slots into the existing visual world instead of clashing with it.

## 🟢 Quick wins — batch these tweaks together

5. **Scan-during-onboarding final step** — **tweak.** Replace/augment the "Ready" step with "scan something near you right now" — compresses time-to-first-aha to zero. Added 2026-07-04.

6. **Top-10 unexpected food facts** — **content task.** Research (verified) → feeds both a possible in-app "did you know" surface and Cicero's content bank.

7. **Native Google Sign-In SDK** — **feature.** Current flow bridges through Supabase's web-based OAuth (`ASWebAuthenticationSession`), which shows iOS's generic "app wants to use huvxeaegygaeotomdqpc.supabase.co to sign in" dialog — normal for any Supabase/Firebase-style backend auth, not a bug, but not polished. Swapping to `@react-native-google-signin/google-signin` would show Google's clean native account picker instead, with no backend domain visible. Needs a new native module, a Google iOS OAuth client (reversed-client-id URL scheme), and a new EAS build — not a quick tweak. Added 2026-07-06 during the 2.1(a) rejection fix.

8. **One-time dev-client build** — **tweak (one metered build, ongoing payoff).** `eas.json` already has a `development` build profile (`developmentClient: true`) — nothing's been built from it yet. A dev client is a custom-built app like TestFlight, but it stays connected to Metro (`npx expo start --dev-client`) and reloads JS changes live, same as Expo Go but with this project's native modules (RevenueCat, Apple/Google Sign-In, expo-sqlite) actually included — Expo Go can't run this project at all because of those. Right now every JS-only fix requires a full TestFlight build to verify; one dev-client build would remove that requirement for all future JS-only iteration (only new native dependencies would still need a rebuild). Added 2026-07-06 after burning a full build cycle re-verifying auth fixes that were pure JS changes.

## 🟠 Big swings — schedule deliberately

7. **Dark mode** — **overhaul.** Colors is a static constant used across ~20 screens; real dark mode means a theme context + dynamic palette everywhere + asset audits. High polish value, real cost. Profile already has a Display Settings section to house the toggle. Don't start this in a batch-work session.

## ⚙️ Workflow (founder's top to-do, saved 2026-07-01 — not started)

**Auto-route work to the cheapest capable model.** Fable/Opus has ~50% of weekly usage left (then API rates) — it should never do grunt work. Wanted: when the founder gives a task, it auto-assigns to the right tier (Haiku: never research, OK for trivial mechanical text; Sonnet: building, agents, commits, routine sessions; Fable/Opus: planning, review, strategy only). Investigate: Claude Code hooks/settings for model routing, `/model sonnet` as default for grunt sessions, and making "spawn a Sonnet agent" the reflex for anything self-contained. Note: a `git commit` itself is one cheap tool call — the real cost is which model carries the session context, so the win is routing whole tasks, not the commit step.

## 📦 Saved for later (founder-flagged: needs curated data, build over time)

8. **Store-specific guides** — Aldi / Costco / Target / Whole Foods swipeable guides.
9. **Category guides** — savory snacks, cereal, dairy, etc.
10. **Shop Smart by Aisle** — aisle-by-aisle companion mode (home-page roadmap).

## ✅ Done → deleted from backlog (see decision-log)
- Real company logos (254/269) · Homepage redesign (build 27) · Ingredients verdict-regroup UI (2026-07-02) · My Stores logos — 10 retailers real, 6 letter-fallback (2026-07-02) · Favorite-stores signup step (2026-07-02) · 212MB catalog analysis done → context/research-catalog-rearchitecture.md (SQLite productStore, 5 phases) · Product-not-found request loop (shipped 2026-07-04; RLS prepared 2026-07-05, see priorities.md P3) · Product-catalog re-architecture Waves 1-3 (complete 2026-07-05) · Notifications v1 — permission priming + 3-day welcome drip + weekly reminder (shipped 2026-07-04, verified wired in AppNavigator/Onboarding/Profile 2026-07-05) · "Buy this instead" alternatives surface (shipped 2026-07-04, verified wired in ProductScoreScreen 2026-07-05, backend migrated to SQLite in Wave 3) · App-feel polish pack — review-prompt 5.6.1 fix, haptics expansion, grade-reveal animation (shipped 2026-07-04, verified 2026-07-05) · Pantry report card (shipped 2026-07-04, verified wired in ProfileScreen 2026-07-05)
