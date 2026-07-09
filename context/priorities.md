# Current priorities

_Last updated: 2026-07-09 — update whenever a priority ships or shifts._

## ✅ SHIPPED — Shelf Exposé is LIVE on the App Store (2026-07-06)
**https://apps.apple.com/app/id6776718186** — free + IAP, $7.99/mo / $49.99/yr, 50% off first year. Approved after the 5.6.3 + 2.1(a) fix resubmission. Rejection era over.

## ✅ SHIPPED — Marketing site rebuilt + live (2026-07-08)
Full detective-themed two-act site live at https://fierce-pine-854.higgsfield.app (headline bug fixed, S-curve evidence-board redesign, PepsiCo money section reframed around influence not brand trivia). Custom domain `shelfexpose.app` DNS cutover to this site still pending founder review/go-ahead — currently on back burner per founder (2026-07-09).

## ✅ SHIPPED — Sentry ANR fix (2026-07-08)
`scorer.js`'s ingredient-index build moved off the cold-start path (was a synchronous IIFE running at import time on every launch). Committed `785baf0`. Awaiting on-device confirmation on the next build.

## ✅ SHIPPED — Scoring overhaul + search fix + photo backfill (2026-07-09)
- **Scoring methodology changed** (founder-directed): a literal 100 is now reserved for a genuinely raw, single-ingredient whole food in packaging that's been verified (not just assumed) clean. Everything else — pasteurized, roasted, canned, juiced, or with unresearched packaging — caps at 96 (`PROCESSED_CLEAN_CEILING`). Missing packaging data now defaults to a small "assume plastic" penalty instead of silently skipping it. **Catalog-wide effect: 0 of 136,491 products currently reach literal 100** (intentional — packaging is verified-clean for only a small researched subset). Fixes the Tropicana complaint directly: was 100, now 96. 791/791 tests passing; `assets/db/products.db` rebuilt + validated with the new scoring baked into its precomputed score/grade columns.
- **Search resilience fixed**: the OFF live-search fetch had no timeout (RN's fetch never times out on its own) and failures were completely invisible whenever local curated results existed — looked exactly like "the catalog only has one match" (the reported "Instant Ramen → 1 result" symptom). Added an 8s timeout + a visible "showing local matches only" notice on failure.
- **Photo coverage**: ran the free local OFF bulk-fetch script against all 539 products missing an image; 101 resolved and merged (real URLs, zero fabrication). Coverage: 353/892 (40%) → 454/892 (51%). Remaining 438 need the fallback tiers (see P2).
- **Marketing-claims audit** (founder asked to verify the app does what social copy claims — see below).

## P0 — Launch burst + first revenue (was P1; now unblocked and time-critical)
~25 days to the Aug 3 availability cliff. Goal: $1k/mo ≈ 40 annual subs ≈ 1,300–5,000 downloads.
- [ ] Launch-day content burst (Cicero) — the "it's live" moment only happens once
- [ ] Marketing site DNS cutover (`shelfexpose.app` → the new Higgsfield site) — founder's call, currently paused
- [ ] Waitlist emails (D1) → launch announcement once there are any signups
- [ ] Run supabase/analytics_setup.sql once; add "Product Interaction (not linked)" + "Crash Data (not linked)" to the privacy label WITH the next build
- [ ] Watch Sentry + App Store reviews daily for launch-week crashes/complaints
- [ ] Next submission: run the `submission-preflight` skill, not ad-hoc checklists

## P1 — Launch marketing engine (30-day plan → $1,000/mo)
Plan: `marketing/30-day-launch-plan.md`. Math: $1k/mo ≈ 40 annual subs ≈ 1,300–5,000 downloads ≈ 40–150k short-form views.
- Marketing folder reorganized 2026-07-08: one folder per month, one file per social type (`marketing/2026-07/`, `marketing/2026-08/`) — see decision-log.
- Daily short-form video (scripts ready: `marketing/video-scripts-batch.md` + `-2.md`, 20 total)
- X posts live (`marketing/x-posts-growth-batch.md` + `marketing/2026-07/x-buildstory-2026-07.md`, single-post format)
- LinkedIn origin-story series complete for July (`marketing/2026-07/linkedin-2026-07.md`, 29/29 days filled, dated) — flat engagement, staying on autopilot per 2026-07-04 decision
- Sentry → GitHub auto-issue pipeline confirmed live (2026-07-05)
- **Claims audit finding (2026-07-09) — action needed before these post**: two X script lines describe capability the app doesn't have yet. "I'm building an app that flags ingredients banned in other countries. Follow so you catch the next one" (`marketing/video-scripts-batch.md`) — the app DOES show banned/restricted status passively when you scan a product with that ingredient (FDA-revoked, EU-banned dyes etc. are documented in `ingredients.js`), but there is NO active alert/notification when a NEW ban happens — "follow" here means the social account, not an in-app push; reword so it can't be read as an app feature. "Shelf Exposé flags what replaced the thing that got banned" (`marketing/2026-07/linkedin-2026-07.md`) — **not implemented at all**, no ingredient-substitution/replacement tracking exists. Either build it (real feature, sized below) or cut the line before it posts.
- Launch burst the day approval lands; batch August content before Aug 3 availability cliff (still the deadline that drives everything)

## P2 — Database to 1,000+ products, full photo coverage
- 892 products today (verified 2026-07-09, corrects the prior stale "873" figure). Photo coverage 454/892 (51%), up from 40%.
- Chad brief drafted (`context/chad-tasks.md` → PRODUCT CANDIDATE RESEARCH) targeting the thinnest categories: Kids Lunch (1), Deli Meat (1), Peanut Butter (1), Chips (2), Crackers (2), Eggs (13), Hot Cereal (14) — 150–200 candidates requested, real barcodes only, feeds the Octavius pipeline (script-first fetch → 1 Sonnet agent → 1 Opus review → script merge).
- Photo backlog: 438 products still missing an image after the free OFF bulk pass — next tier is UPCItemDB/USDA (still scriptable) then retailer-page lookups via the `octavius` agent for the genuine long tail (small batches, ~10-20 at a time), per `product-photo-lookup` skill Phases 2-3.
- **Certification bonus needs a rethink** (surfaced during the scoring audit): every cert string currently gets the same flat +3 bonus, including non-health certs like "Made in USA" alongside USDA Organic/EWG-style marks — worth a real taxonomy pass (which certs deserve weight, which don't) rather than folding it silently into the scoring change above.

## Feature ideas queue → [backlog.md](backlog.md) (impact-sorted, effort-sized)
- NEW (2026-07-09): banned-ingredient-replacement tracking (what a manufacturer swapped in after a ban) — real feature gap found in the claims audit, not yet sized.
- NEW (2026-07-09): active banned-ingredient alert/notification (vs. today's passive scan-time display) — real feature gap, not yet sized.

## P3 — App quality
- **Testing infrastructure built 2026-07-04/05, expanded 2026-07-08/09**: Jest + jest-expo, now 791 characterization tests across 6 suites (scorer, subscription, storage, productStore, alternatives) — `npm test` runs the app's core logic locally, no build needed.
- **Product-catalog re-architecture (Waves 1-3) COMPLETE 2026-07-05**: 212MB eager-loaded JSON replaced by a queryable SQLite store (`src/data/productStore.js`) across every screen/util. `assets/db/products.db` rebuilt 2026-07-09 with the new scoring baked in; validated clean. Still needs a founder call before the next real build: commit the ~153MB `products.db` vs. an EAS build hook to regenerate it; on-device asset-copy flow still unverified beyond mocks/Node-side checks.
- **Company/political data**: 269 companies, 540 issues logged — 36 already animal-welfare/child-labor related (cocoa, hazelnut, carnauba wax supply chains, real active litigation). Claims-audit finding: this mechanism is real and already populated for a meaningful subset, but coverage hasn't been systematically audited against which companies in the catalog actually have it vs. don't — worth a coverage pass as the product DB scales past 1,000.
- UI polish batch done 2026-07-01 (tab-bar bug, personalized allergens, tiered severity, calm tiles) — shipped in build 27
- RLS on product_requests: **DONE 2026-07-05**
- RevenueCat Android key: **explicitly deferred 2026-07-05**
- Remaining backlog: `alternatives.js`'s `getCuratedGradeABCandidates` query runs ~79ms unindexed (fine for a one-time per-product lookup, not worth an index yet)
