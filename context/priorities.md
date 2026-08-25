# Current priorities

_Last updated: 2026-07-30 — update whenever a priority ships or shifts._

_Full rewrite 2026-07-26: the previous version was dated 07-20 and had drifted badly — it listed shipped work as pending, carried multi-paragraph write-ups of things long since done, and omitted the highest-leverage item entirely. Shipped work now lives as one line each with a commit ref; the detail is in [decision-log.md](decision-log.md)._

---

## 🚦 BLOCKING THE NEXT APPLE BUILD

_Updated 2026-07-30: founder wanted to see the Living Conditions feature but isn't submitting to Apple right now — no build was run this session. This section is prepped so the next real submission doesn't have to re-derive any of this._

**Version number — decide when you're actually ready to submit:**
- Ship under `1.2.0` (autoIncrement handles the build number) if the 2026-07-23 submission is still in Apple review, OR if it was approved and you want this as a follow-up patch.
- Go to **1.3.0** if 1.2.0 is already live — this batch adds a real user-facing feature (Living Conditions), not just fixes, so a `.1` bump would understate it.
- Can't be checked from this session (App Store Connect, no credentials here) — check ASC before deciding.

**What's New copy, drafted from every commit since the 1.2.0 submission (`a3788c0`) — trim before pasting into ASC:**
- New: "How This Was Raised" card on egg products — housing conditions, certified space-per-hen standards, sourced to Certified Humane / USDA / United Egg Producers, shown on any egg scan (catalog or not)
- New: "Suggest a product" by name, from Profile
- Fixed: company pages no longer show fabricated "Low" lobbying badges or invented 50/50 donation splits when we never researched that company — now honestly says "No data"
- Fixed: scanner "Connection Error" on common items — checks the local catalog before the network call now
- Fixed: whole-package OCR text no longer renders as ingredients
- Data: 16 new company records, all null-companyId products resolved; +58 product photos (86% coverage, up from 80.7%); company-resolution work in progress (19.5% → 41.5% of the wider OFF catalog, background work, not user-facing yet)

**Not user-facing but relevant to the release:**
- Sentry now tags every event with release/build/OTA-update id (needs `SENTRY_ORG`/`SENTRY_PROJECT`/token secrets live in EAS — grep the build log for `sentry-cli`: `output:` good, `error:` means a secret's wrong)
- New `app_events` funnel/retention analytics table — **run `supabase/app_events_setup.sql` in the Supabase dashboard before this ships, or inserts silently no-op**
- Privacy policy already covers the install-id disclosure (`029716c`) and is live (pushed, confirmed on `origin/main` as of this session)

**Housekeeping found this session, not blocking but worth knowing before you build:**
- Local `main` is **27 commits ahead of `origin/main`** (everything since `af5d7f6`, including all of the above) — push before building if your EAS build source is GitHub-linked rather than local-CLI upload.
- App Store Connect privacy label additions (Device ID → "Data Not Linked to You", Used for Tracking = No; Name) were flagged 2026-07-26 as still outstanding — re-check before submitting, can't verify from here.

**Immediately AFTER the build ships:** upload `products.db` (`node scripts/catalog-database/upload-products-db.js`) and bump `DB_VERSION`. Not before — the rebuilt catalog references company records that only exist in the new binary, so a fresh install of the older live version would show blank company pages.

---

## P0 — Grading trust + staple-category coverage (2026-08-17)

Kicked off after a catalog audit against the real shipping DB: 1,092 products, only 385 score 80+ (the "recommend" bar; = the old grade-A/B cutoff, `scoreToGrade` maps 80→B/90→A). Four linked workstreams. Full rationale in [decision-log.md](decision-log.md) 2026-08-17.

1. **Scorer accuracy audit (keystone — do first).** Once we surface sub-80 products as "best available," the score IS the product; a wrong score misleads people who trust us. Build a ~40-product reference set with an obvious human verdict, run the scorer (free local script), flag every disagreement. Probe three rules: added-sugar (granola/bars/creamers), fried/oil credit (the avocado-oil hole — scorer treats "avocado oil" as a whole food, `scorer.js:310`), and a hard floor on processed/deli meat. Note: the 2026-07-09 cert overhaul already discounts marketing claims vs. verified certs — that part is sound.
2. **Empty/low-category display → best-available, labeled honestly (Hadrian).** Founder chose Option B: when a category has no 80+ option, show the single highest-scored product, labeled e.g. *"Highest-scored [category] we found — still only X/100."* Requires relaxing the alternatives query to fall back to best-in-category when no 80+ exists, plus the honest label. Current trigger only fires alternatives on D/F scans (`ProductScoreScreen.js:518`) — revisit as part of this.
3. **Remove letter grades from the UI (Hadrian).** Founder: never show A/B/C. Show the 0–100 number only; 80+ = recommend. Woven through `ProductScoreScreen.js` — GradeRing display, `scoreToVerdict`, grade-keyed haptics, better-picks trigger. Keep the score-driven logic; remove the letter as a shown value. `scoreToGrade` stays internal (drives color/notes only).
4. **Staple-category product wave (Chad → review here).** Fill thin staple aisles (coffee creamer, bread, snack bars, granola, + top-ups) to ~12–15 best-of-each, even sub-80, so everyday aisles aren't empty. Brief + curated shortlist on the Chad board. Do AFTER the accuracy audit so we curate with a scorer we trust. Granola only clears 80+ with no-added-sugar products.

**Also queued:** avocado-oil adulteration — verify from primary sources (UC Davis 2020 *Food Control*) BEFORE it becomes a scoring signal or in-app copy. Chad research brief drafted; nothing ships until verified + Opus-reviewed.

## P2 — Paywall: "$0 today" free-trial framing (2026-08-17)

Founder wants the yearly free-trial paywall to lead with **"$0 today"** (nothing charged now) as the prominent value, to lift trial starts. Trial display today reads "3 Days Free, then $49.99/year" via `introOffer()` + `FALLBACK_TRIAL_FINE` in [paywallPricing.js:25](../src/utils/paywallPricing.js), rendered in `PaywallContent.js` (and the exit-offer `OfferContent.js`).

**Compliance rail (do NOT skip):** the 1.2.0 rejection was Apple 3.1.2(c) price-prominence, and Apple's free-trial rule requires the disclosure to still show the real billed amount ("then $49.99/year"). So add "$0 today" as the prominent number ALONGSIDE the required "3 Days Free, then $49.99/year" disclosure — never replace the billed-amount line with just "$0". Keep the RC-metadata override path intact. Small Hadrian task; update `paywallContent.test.js`.

## P0 — Catalog scale: make company resolution work at 10,000 products

The founder's own framing: curating products one at a time cannot reach the ~10k needed to cover most-consumed goods. Company coverage is **not** a per-product problem — it's a per-owner problem, and that's what makes it tractable.

Measured 2026-07-26 by running the real `findCompanyId()` against all 123,932 US products in the OFF bulk dump: **only 19.5% of SKUs resolve to a company.**

- **Resolver fix (in progress).** `findCompanyId()` never compares a brand string against `COMPANY_DB` record *names* — so "General Mills, Inc." (918 SKUs), "The Kroger Co." (1,625) and "The Kellogg Company" (697) all fail despite having records. Adding a normalized name-match step measures at **19.5% → 27.1%, +9,415 SKUs, zero new research.** False positives are worse than nulls here — naming the wrong parent is a worse failure than showing nothing — so matching must be equality-first with word-boundary prefixes and an ambiguity→null rule.
- **Retailer / private-label records (in progress).** 24 retail entities = **18,345 SKUs (14.8% of the catalog)**, led by Walmart (2,965), Safeway (1,741), Meijer (1,660), Ahold (1,070), Hy-Vee (1,050). Many have consolidated into each other or into records we already hold, so this is fewer new records than it looks. "Your store brand is owned by the chain selling it" is a genuine transparency answer.
- **Then:** the remaining long tail of manufacturer brand-owners, worked by SKU count. Each mapping covers hundreds of products; a curated product covers one.

## P0 — Watch Sentry + App Store reviews

Now meaningful in a way it wasn't: as of `ac05896`/`ecaf4ba` stack traces symbolicate, and events carry `release`/`dist` + `ota.*` tags, so "is this fixed in the shipped build?" is answerable from the dashboard. First build after the secrets landed, grep the build log for `sentry-cli` — `output:` good, `error:` means the org slug or token is wrong (the `SENTRY_ALLOW_FAILURE` guard makes that failure silent by design).

## P1 — Product photos

**211 of 1,092 products (19.3%) have no photo** — the real figure, queried from `products.db` directly (never via `products.js` in plain `node -e`; see the 07-11 methodology bug). The earlier "166" predated the 47 cowork-batch products.

- **60 photos found 2026-07-26 and NOT yet merged** (55 Open Food Facts + 5 UPCItemDB). 25 flagged for visual review on name divergence; 3 spot-checked, 2 confirmed genuine variant mismatches (Clif Builder's chocolate vs. chocolate-peanut-butter; Coffee-Mate Cinnamon Vanilla vs. the DUO line).
- **151 still missing.** OFF is exhausted for these (26% hit rate — the easy ones were harvested in earlier waves) and UPCItemDB's free tier caps out. What's left needs retailer lookups.

## P1 — `/political-analysis` for the 16 new company records

The companies added 2026-07-26 carry ownership only — `lobbyingSpend`/`politicalDonations` are deliberately `null`, and the UI now honestly renders that as "No data" rather than a green "Low" badge. The Pro page for these is thin until a real pass runs. Prioritize by catalog presence.

## P2 — Localization

Spanish is the defensible target: the catalog is US-products-only, so the value is for non-English-primary speakers **in the US**, not international users. French/German/Brazilian Portuguese are much harder to justify on the same reasoning. Founder's final call still open — see the `localization-scope` memory.

## P2 — MorningStar ad image revision

`marketing/app-store-screenshots/morningstar-scan-6.5in-*.png` needs a problem/solution headline across the top so the single image carries the whole premise. Exact wording pending founder confirmation.

---

## 🟡 Open decisions (founder)

- **The 144 `lobbyingSpend: 0` records → `null`?** The UI now treats 0 and null identically as "No data", so this is a data-hygiene change, not a behavior one — but it visibly touches 144 company pages and should be a deliberate call.
- **`celsius-holdings`** has `politicalDonations: 0` with a hardcoded 50/50 `donationSplit` baked into the record — a data artifact of the bug fixed in `f861b3c`, not something the code fix touches.
- **"Good & Gather Monster Trail Mix"** doesn't exist; the real product is Target's Favorite Day private label. Held pending a call on whether to add Target as a company (the retailer work above may settle this).

## 📣 Marketing

Founder 2026-07-26: **content is sufficient for now** — the August X/LinkedIn top-up is explicitly not a priority. Waitlist announcement is moot (no signups).

- **Microplastics video is BUILD COMPLETE and founder-approved — but not posted.** A finished asset sitting idle; see `marketing/videos/microplastics-video-progress.md`.
- Claims-audit line ("flags what replaced the thing that got banned") — reworded by the founder 2026-07-26. The underlying feature was judged not worth building.

---

## ✅ Shipped

**2026-07-26 (this session):**
- Funnel + retention analytics — `app_events`, persistent install id, 8-event whitelist, funnel/conversion/retention SQL (`b2616cf`)
- Company pages stopped asserting money-trail facts we never researched — 144 fake "Low" lobbying badges, **131 fabricated 50/50 donation splits**, 26 literal "$null" revenues (`f861b3c`)
- All 19 null-companyId products resolved, +16 company records (`aaf43e1`); caught Muir Glen leaving General Mills (Jan 2026) and Tazo leaving Unilever (2022)
- "Suggest a product" by name, from Profile (`4110af1`)
- Sentry source-map upload + release/dist/OTA tagging (`ac05896`, `ecaf4ba`, `b2c4aa5`); guarded so a bad token can't burn a metered build
- **`npm test` was inflated by stale worktrees — real suite is 350 tests, not 987** (`b7bea94`). Treat any test count in this log dated before 07-26 as suspect.
- Privacy policy rewritten to disclose the install code (`029716c`) — **not live until pushed**

**Earlier:** App Store approval (2026-07-06), 1.2.0 submission (07-23), onboarding/paywall overhaul, scoring ceiling + retiered certifications, products.db runtime-download fix, 1,092 products, marketing site + Evidence Archive, Specs mascot + in-app integration, `shelfexpose.app` redirect. Details in [decision-log.md](decision-log.md).

---

## Feature ideas → [backlog.md](backlog.md)

Impact-sorted, effort-sized. Standouts worth pulling forward: the **one-time dev-client build** (removes the metered-build requirement for all future JS-only verification), shopping-guides hub, dark mode.
