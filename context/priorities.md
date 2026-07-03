# Current priorities

_Last updated: 2026-07-01 — update whenever a priority ships or shifts._

## P0 — Get approved and live
Build 28 submitted 2026-07-02 (privacy-label fix + analytics layer + ingredients regroup + store logos). Awaiting Apple review.
- [x] Paid Apps Agreement Active · IAPs selected for the version · Terms in description · privacy data types
- [x] RevenueCat: attach monthly + yearly products to the Healthy Choices Pro entitlement
- [x] Privacy label toggles corrected (Used to Track = No on Email/User ID/Purchases)
- [x] IAP App Review screenshot per subscription (must have been attached — ASC accepted the submission)
- [x] Sandbox purchase tested — confirmed unlocking Pro (founder-verified 2026-07-02)
- [ ] New iPhone + iPad screenshots — confirm these were updated for this submission (not carried over stale from build 26)
- [ ] Confirm build 28 is APPROVED (check ASC for review outcome)
- [ ] IF approved: run supabase/analytics_setup.sql once, add Product Interaction (not linked) to privacy label WITH the next build

## P1 — Launch marketing engine (30-day plan → $1,000/mo)
Plan: `marketing/30-day-launch-plan.md`. Math: $1k/mo ≈ 40 annual subs ≈ 1,300–5,000 downloads ≈ 40–150k short-form views.
- Daily short-form video (scripts ready: `marketing/video-scripts-batch.md` + `-2.md`, 20 total)
- X posts live (`marketing/x-posts-growth-batch.md`), waitlist page, ASO listing
- Launch burst the day approval lands; batch August content before Aug 3 availability cliff

## P2 — Database to 2,000 products
- Octavius pipeline live (script-first, ~2 agents/batch). 873 curated products now; ~86% photo coverage
- Chad running parallel waves; coordinate via git status + staging files

## Feature ideas queue → [backlog.md](backlog.md) (impact-sorted, effort-sized)

## P3 — App quality
- UI polish batch done 2026-07-01 (tab-bar bug, personalized allergens, tiered severity, calm tiles) — ships in build 27
- Backlog: 135k generated catalog is a 212MB eager-loaded JSON (move to SQLite/API later); RLS on product_requests; RevenueCat Android key before any Android release
