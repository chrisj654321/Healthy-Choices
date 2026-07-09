# Current priorities

_Last updated: 2026-07-09 (evening pass) — update whenever a priority ships or shifts._

## ✅ SHIPPED — Shelf Exposé is LIVE on the App Store (2026-07-06)
**https://apps.apple.com/app/id6776718186** — free + IAP, $7.99/mo / $49.99/yr, 50% off first year. Approved after the 5.6.3 + 2.1(a) fix resubmission. Rejection era over.

## ✅ SHIPPED — Marketing site rebuilt + live (2026-07-08)
Full detective-themed two-act site live at https://fierce-pine-854.higgsfield.app (headline bug fixed, S-curve evidence-board redesign, PepsiCo money section reframed around influence not brand trivia). Custom domain `shelfexpose.app` DNS cutover to this site still pending founder review/go-ahead — currently on back burner per founder (2026-07-09).

## ✅ SHIPPED — Launch-day content burst (2026-07-09, founder-confirmed)
The "it's live" moment content ran. August is now underway: **15 X posts scheduled**; LinkedIn is scheduling in a rolling 10-day window (Buffer plan limit on this tier), so it gets refreshed every ~10 days rather than batched a full month at once — noted as a standing constraint below, not a one-time gap.

## ✅ SHIPPED — Sentry ANR fix (2026-07-08) + auth-refresh hardening (2026-07-09)
`scorer.js`'s ingredient-index build moved off the cold-start path. Committed `785baf0`. **Sentry → GitHub pipeline confirmed live and working — 3 issues filed so far**: #2 (test issue, expected), #3 (the ANR above, already fixed pending next build), #4 (`setValueWithKeyAsync... User interaction is not allowed` — an iOS Keychain write failing while the device is locked, the same failure mode `fcd8ff5` "Fix auth refresh while backgrounded" already targets, not yet shipped in a build). Added one more layer of hardening today: `SecureStoreAdapter` now sets `keychainAccessible: AFTER_FIRST_UNLOCK` explicitly (Expo's default requires the device unlocked at the exact moment of access) — closes the residual race where a refresh already in flight completes its write after the app backgrounds. Committed. All three known issues are now addressed pending the next build; no open Sentry issue as of this writing.

## ✅ SHIPPED — Scoring overhaul (ceiling + certifications), search fix, photo backfill (2026-07-09)
- **Scoring ceiling** (founder-directed): a literal 100 now requires a genuinely raw, single-ingredient whole food in verified-clean packaging. Everything else caps at 96. Missing packaging data defaults to a small "assume plastic" penalty. **0 of 136,491 products now reach literal 100** (intentional). Fixes Tropicana directly: 100 → 96.
- **Certification bonus retiered** (same session, founder asked for this to ship with the next build): certifications used to get a flat +3 regardless of type. Now tiered by what each mark actually verifies — Tier A/+3 (USDA Organic, Non-GMO Project Verified, Heart-Check — independently verify the ingredient/additive profile), Tier B/+2 (Certified Gluten-Free/GFCO, Certified Vegan, Nut-Free Certified, Kosher, Halal — real verification, scoped to a specific dietary/allergen need), Tier C/+1 (Fair Trade, Certified Humane, Rainforest Alliance, B Corp, California Olive Oil Council — real certification, about ethics/sourcing not this product's health profile), Tier D/+0 (Keto/Paleo/Whole30/Made in USA — real programs, but dietary-pattern or origin claims, not independently verified safety/quality standards). Capped at +8 total so a long cert list can't stack unrealistically. Catalog-wide: 116 of 285 certified products see their bonus drop (none increase), matching the "make it stricter and more honest" intent. Note: no "EWG Verified" products exist in the catalog yet, but the tier is ready (Tier A) the moment one is added.
- **Search resilience fixed**: added an 8s timeout to the OFF fetch (RN's fetch never times out on its own) + a visible "showing local matches only" notice when live search fails silently — fixes the reported "Instant Ramen → 1 result" symptom.
- **Photo coverage**: 101 real images merged for free via the local OFF bulk script. Coverage 353/892 (40%) → 454/892 (51%).
- All of the above: 794/794 tests passing, `assets/db/products.db` rebuilt + validated twice (once per scoring change) with the new scoring baked into precomputed score/grade columns — **ready to ship with the next build as asked.**
- **Marketing-claims audit** (founder asked to verify the app does what social copy claims — see P1 below).

## P0 — Launch burst + first revenue (was P1; now unblocked and time-critical)
~25 days to the Aug 3 availability cliff. Goal: $1k/mo ≈ 40 annual subs ≈ 1,300–5,000 downloads.
- [x] Launch-day content burst (Cicero) — ran, founder-confirmed 2026-07-09
- [ ] Marketing site DNS cutover (`shelfexpose.app` → the new Higgsfield site) — founder's call, currently paused
- [ ] Waitlist emails (D1) → launch announcement once there are any signups
- [ ] **Analytics SQL + privacy label — needs the founder directly, see checklist below**
- [ ] Watch Sentry + App Store reviews daily for launch-week crashes/complaints
- [ ] Next submission: run the `submission-preflight` skill, not ad-hoc checklists

**Analytics SQL + privacy label checklist** (I can't execute either step myself — both require logging into a dashboard I don't have credentials for, Supabase and App Store Connect respectively):
1. Supabase Dashboard → SQL Editor → paste the full contents of `supabase/analytics_setup.sql` → Run. One-time, idempotent (`create table if not exists`).
2. App Store Connect → App Privacy → add/confirm two data types: **Product Interaction** and **Crash Data**, both set to **"Data Not Linked to You"** (matches `scan_events`'s actual schema — no user/device/session id — and Sentry's identity-free config). Ships with the next build's metadata update, not the binary itself.

## P1 — Launch marketing engine (30-day plan → $1,000/mo)
Plan: `marketing/30-day-launch-plan.md`. Math: $1k/mo ≈ 40 annual subs ≈ 1,300–5,000 downloads ≈ 40–150k short-form views.
- Marketing folder reorganized 2026-07-08: one folder per month, one file per social type (`marketing/2026-07/`, `marketing/2026-08/`) — see decision-log.
- **August underway**: 15 X posts scheduled. LinkedIn is Buffer-limited to a **rolling 10-day scheduling window on the current plan** — can't batch the full month at once; needs a recurring ~10-day top-up instead of a one-time August push. Worth a plan-upgrade cost/benefit check if this becomes a recurring time cost during the founder's Aug 3 availability cliff.
- LinkedIn origin-story series complete for July (`marketing/2026-07/linkedin-2026-07.md`, 29/29 days filled, dated) — flat engagement, staying on autopilot per 2026-07-04 decision
- Sentry → GitHub auto-issue pipeline confirmed live AND working (2026-07-05, exercised for real 2026-07-08/09 — see above)
- **Claims audit finding (2026-07-09) — action needed before these post**: two X/LinkedIn script lines describe capability the app doesn't have yet. "I'm building an app that flags ingredients banned in other countries. Follow so you catch the next one" (`marketing/video-scripts-batch.md`) — the app DOES show banned/restricted status passively when scanning (documented in `ingredients.js`), but there's no active alert when a NEW ban happens; "follow" means the social account, reword so it can't read as an app feature. "Shelf Exposé flags what replaced the thing that got banned" (`marketing/2026-07/linkedin-2026-07.md`) — **not implemented at all**. Either build it or cut the line before it posts.
- Batch remaining August content before the Aug 3 availability cliff (still the deadline that drives everything)

## P2 — Database to 1,000+ products, full photo coverage
- 892 products today (verified 2026-07-09, corrects the prior stale "873" figure). Photo coverage 454/892 (51%), up from 40%.
- **Product-candidate research now runs directly via `codex exec`** (2026-07-09) — no more founder paste-bridge needed for this lane; Claude invokes gpt-5.5 programmatically per `instructions/efficiency.md`'s Codex CLI mechanics. First run targets the DB's thinnest categories (Kids Lunch, Deli Meat, Peanut Butter, Chips, Crackers, Eggs, Hot Cereal), 150–200 real candidates, feeding the Octavius pipeline (script-first fetch → 1 Sonnet agent → 1 Opus review → script merge). Chad's paste-bridge (`context/chad-tasks.md`) stays available for anything that doesn't fit a self-contained CLI prompt.
- Photo backlog: 438 products still missing an image after the free OFF bulk pass — next tier is UPCItemDB/USDA (still scriptable) then retailer-page lookups via the `octavius` agent for the genuine long tail.

## Feature ideas queue → [backlog.md](backlog.md) (impact-sorted, effort-sized)
- NEW (2026-07-09): banned-ingredient-replacement tracking (what a manufacturer swapped in after a ban) — real feature gap found in the claims audit, not yet sized.
- NEW (2026-07-09): active banned-ingredient alert/notification (vs. today's passive scan-time display) — real feature gap, not yet sized.

## P3 — App quality
- **Testing infrastructure**: Jest + jest-expo, now **794** characterization tests across 6 suites — `npm test` runs the app's core logic locally, no build needed.
- **Product-catalog re-architecture (Waves 1-3) COMPLETE 2026-07-05**: `assets/db/products.db` rebuilt twice today (scoring ceiling, then cert retiering) and validated clean each time. Still needs a founder call before the next real build: commit the ~153MB `products.db` vs. an EAS build hook to regenerate it; on-device asset-copy flow still unverified beyond mocks/Node-side checks.
- **Company/political data**: 269 companies, 540 issues logged — 36 already animal-welfare/child-labor related (real, active litigation). Coverage across the full catalog hasn't been systematically audited — worth a pass as the product DB scales past 1,000.
- UI polish batch done 2026-07-01 (tab-bar bug, personalized allergens, tiered severity, calm tiles) — shipped in build 27
- RLS on product_requests: **DONE 2026-07-05**
- RevenueCat Android key: **explicitly deferred 2026-07-05**
- Remaining backlog: `alternatives.js`'s `getCuratedGradeABCandidates` query runs ~79ms unindexed (fine for a one-time per-product lookup, not worth an index yet)
