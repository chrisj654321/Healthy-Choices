# Claude memory

> **HARD RULE: Every time the founder shares major context about the business or his situation, update THIS file with the key details — same session, no exceptions.** Date every entry. Newest at top. This file is the durable record; if it isn't written here, it will be forgotten.

---

## 2026-07-02 — Exit vision + data strategy
Founder pictures selling the app to an aggregate-scan-data buyer (market-research/CPG demand-signals style). Decision after pushback: NEVER track users or sell PII (brand = trust; bad money anyway); build the anonymous aggregate analytics asset from day one (scan_events, zero identity). He initially floated declaring tracking now to enable later data sales — talked through why that fails legally (ATT timing, CCPA, FTC deception) and financially (pennies/user vs. sub revenue; PII is diligence liability). He agreed; posture locked.

## 2026-07-02 — Military-mention rule refined (founder correction)
Biographical military context in marketing is fine and is part of his story (Army, AIT at Fort Leonard Wood; WiFi only at the USO — the military rest spot, the one place on base with WiFi — weekends only, ~5 hrs/week). Prohibited only: position/rank/uniform used to promote, uniform photos, implied Army/DoD endorsement, implied building on duty time/government resources. He is comfortable naming unit/location — not classified. Per-post test: affiliation selling vs. setting the scene.

## 2026-07-01 (late) — Token budget constraint
Fable/Opus has ~50% of the founder's weekly usage remaining; after that it's API pricing. Standing implication: Fable plans/reviews ONLY; Sonnet (or the main session on /model sonnet) does building, commits, and routine work. Auto-routing tasks to the cheapest capable model is on the founder's top to-do list (see context/backlog.md ⚙️ Workflow).

## 2026-07-01 — Business snapshot (seed entry)

**Situation:** Build 26 rejected by Apple (4 findings — all root-caused and fixed; see context/decision-log.md). Build 27 pending: screenshots + IAP review screenshot + sandbox purchase test, then resubmit. RevenueCat entitlement mapping was the purchase-bug root cause (no products attached) — founder fixed in dashboard.

**Money:** Pre-revenue. Goal: $1,000/mo from the App Store within ~30 days of launch (≈40 annual subs at $24.99 first-year). Pricing: $7.99/mo, $49.99/yr, 50% off first year on both plans. Marketing budget mindset: "$20k on the line, zero-to-hero or doors close." Actual tooling spend ~$27/mo (Buffer + Runway).

**Founder:** Christian James. Built the entire app by directing AI — story: June 2025, mom's dining-room table, post-bankruptcy, business partner had stolen $20k+, wife three months pregnant, started with Base44 then found real AI tooling. ~60 working days across 13 months. Submitted first build June 20, 2026. CrossFit L2 + NASM Sports Nutrition, former head coach. In Army 12D school (passed basic + phase 1 dive school ~93% attrition) — NEVER usable in marketing (JER/DoDD 1344.10). Availability cliff: ~Aug 3, 2026, gone ~7 months — everything must be batched/automated by then.

**Team:** Founder + Claude (Fable plans/reviews, Sonnet builds) + Chad (ChatGPT, parallel product waves) + named agents Octavius (products) and Cicero (social). Daily journal → `marketing/journal/` → Cicero mines it for LinkedIn build-in-public content.

**Product state:** 873 curated products (+135k generated scan catalog), ~86% photo coverage, 269 companies (254 with logos), freemium paywall on company transparency. Target: 2,000 products via Octavius pipeline.

**Distribution state:** X account ~3,000 followers but flat (~10 impressions/post) — being rebuilt with the growth-batch voice. No TikTok yet (cold start planned). LinkedIn = founder story series (10 posts written) + build-in-public pillar. Waitlist + launch burst strategy queued for approval day.

## 2026-07-04 — Infrastructure: domain + transactional email live

**Domain:** shelfexpose.app purchased (founder, 2026-07-04). Production email domain + future web home.

**Email:** Resend connected as Supabase custom SMTP (free tier: 3,000/mo, 100/day, 1 verified domain). Replaces Supabase built-in sender (2/hr, non-production) — was a silent launch-blocker since the app requires account creation. Founder completed DNS verification + Supabase integration + rate-limit raise; password-reset email tested working. Resend API key lives in .env (gitignored, verified).

**Error tracking:** Sentry chosen (free 5k errors/mo, Expo-supported); wiring pending founder DSN. Config must stay identity-free (no PII, no user IDs) per the 2026-07-02 no-tracking decision; next build's privacy label needs "Crash Data — not linked" added.

**Stack audit verdict (X-post 12-tool list):** only Resend + Sentry were real gaps. Rejected: Stripe (Apple IAP mandatory on iOS), Clerk (Supabase Auth shipped), PostHog (conflicts with no-tracking stance; in-house anonymous analytics in build 28), Vercel (Netlify serves), Upstash/Pinecone (no fit yet).

## 2026-07-06 — APPROVED. Shelf Exposé is LIVE on the App Store. 🚀

Apple approved the resubmission (the build carrying the 5.6.3 rating-prompt fix, the 2.1(a) Google Sign-In fix, password reset, SQLite catalog, Sentry, and the onboarding image upgrade). Listing verified live: **https://apps.apple.com/app/id6776718186** — "Shelf Exposé," free + IAP ($7.99/mo, $49.99/yr, 50% off first year), Health & Fitness, 13+, iOS 16.4+. Rejection history closed: builds 26 (IAP/icon/terms), 27 (privacy label), 28 (5.6.3 + Google sign-in) → approved 2026-07-06.

Launch context: ~13 months from dining-room table to shipped product, ~28 days before the founder's Aug 3 availability cliff. P0 shifts from "get approved" to "launch burst + revenue" ($1k/mo goal ≈ 40 annual subs). The launch-day marketing burst (P1) is now unblocked and time-critical.

Same-day: shelfexpose.app marketing site went live on Cloudflare→Netlify DNS, and the new Higgsfield-built two-act site (dark detective investigation → bright food world) deployed to its preview URL awaiting founder review + motion pass. The site's "Coming to the App Store" copy is now outdated — needs the real App Store link.
