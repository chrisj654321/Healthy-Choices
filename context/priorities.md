# Current priorities

_Last updated: 2026-07-05 — update whenever a priority ships or shifts._

## P0 — Get approved and live
Build 28 submitted 2026-07-02 (privacy-label fix + analytics layer + ingredients regroup + store logos). Still awaiting Apple review as of 2026-07-05 — App Store Connect showing the old (pre-fix) icon in the Apps list is a confirmed dashboard-cache display quirk, not a real binary issue (verified by decoding the actual submitted .ipa's icon).
- [x] Paid Apps Agreement Active · IAPs selected for the version · Terms in description · privacy data types
- [x] RevenueCat: attach monthly + yearly products to the Healthy Choices Pro entitlement
- [x] Privacy label toggles corrected (Used to Track = No on Email/User ID/Purchases)
- [x] IAP App Review screenshot per subscription (must have been attached — ASC accepted the submission)
- [x] Sandbox purchase tested — confirmed unlocking Pro (founder-verified 2026-07-02)
- [x] New iPhone + iPad screenshots confirmed current (founder-verified 2026-07-05)
- [ ] Confirm build 28 is APPROVED (check ASC for review outcome)
- [ ] IF approved: run supabase/analytics_setup.sql once, add Product Interaction (not linked) to privacy label WITH the next build
- [ ] New: `submission-preflight` skill now exists (`.claude/skills/submission-preflight/`) — run it before build 29/next submission, not the old ad-hoc checklist

## P1 — Launch marketing engine (30-day plan → $1,000/mo)
Plan: `marketing/30-day-launch-plan.md`. Math: $1k/mo ≈ 40 annual subs ≈ 1,300–5,000 downloads ≈ 40–150k short-form views.
- Daily short-form video (scripts ready: `marketing/video-scripts-batch.md` + `-2.md`, 20 total)
- X posts live (`marketing/x-posts-growth-batch.md`); NEW: technical build-in-public pillar started (`marketing/x-buildstory-2026-07.md`, single-post format, Post 2 pinned as profile intro)
- LinkedIn origin-story series running (`marketing/linkedin-2026-07.md`, 25/31 days filled) — flat engagement, staying on autopilot (5 min/10 days cost, not worth chasing per 2026-07-04 decision)
- Sentry → GitHub auto-issue pipeline confirmed live (2026-07-05) — errors now self-file as GitHub issues instead of needing manual triage
- Launch burst the day approval lands; batch August content before Aug 3 availability cliff (still the deadline that drives everything)

## P2 — Database to 2,000 products
- Octavius pipeline live (script-first, ~2 agents/batch). 873 curated products now; ~86% photo coverage
- Chad running parallel waves; coordinate via git status + staging files

## Feature ideas queue → [backlog.md](backlog.md) (impact-sorted, effort-sized)

## P3 — App quality
- **Testing infrastructure built 2026-07-04/05**: Jest + jest-expo, 196 characterization tests across 5 suites (scorer, subscription, storage, productStore, alternatives) — `npm test` runs the app's core logic locally, no build needed. Found and fixed real bugs: dye-severity duplicate-key scoring errors (red 40/yellow 5/yellow 6), 4 fail-open/silent-reset behaviors in storage.js, now all reporting to Sentry.
- **Product-catalog re-architecture (Waves 1-3) COMPLETE 2026-07-05**: 212MB eager-loaded JSON replaced by a queryable SQLite store (`src/data/productStore.js`) across every screen/util. Precomputed score/grade/summary tables eliminate most client-side re-scoring. Two items still need a founder call before the next real build: commit the ~153MB `products.db` vs. an EAS build hook to regenerate it; and the on-device asset-copy flow is proven via mocks/Node-side real-data checks but not yet on a real device.
- UI polish batch done 2026-07-01 (tab-bar bug, personalized allergens, tiered severity, calm tiles) — shipped in build 27
- RLS on product_requests: **DONE 2026-07-05** — `supabase/product_requests_setup.sql` run successfully in the Supabase SQL Editor (founder-confirmed). Table now insert-only from the client, matching scan_events.
- RevenueCat Android key: **explicitly deferred 2026-07-05** — no Android release planned, not worth setting up ahead of need. Revisit only if Android plans materialize. (Note: the existing iOS RC key in `subscription.js` is a public SDK key, safe to be visible in git — not a secret.)
- Remaining backlog: `alternatives.js`'s new `getCuratedGradeABCandidates` query runs ~79ms unindexed (fine for a one-time per-product lookup, not worth an index yet)
