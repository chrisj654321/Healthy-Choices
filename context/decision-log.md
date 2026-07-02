# Decision log

_Running record: decision → why → outcome. Newest first. Add an entry for every consequential decision; fill in outcomes when they land._

| Date | Decision | Why | Outcome |
|---|---|---|---|
| 2026-07-02 | gpt-5.5 integrated via Codex CLI (`codex exec`, ChatGPT sub) — bulk/mechanical/investigation lane; model ranking table (cost/intelligence/taste) + standing escalation permission adopted | Founder ChatGPT sub = effectively free capacity; Fable budget scarce | Verified working (smoke test 2026-07-02) |
| 2026-07-02 | Efficiency doctrine + model routing (instructions/efficiency.md): manager plans/delegates/reviews only; Sonnet default for sessions; scripts for determinism; Chad task board for bulk work; **manager role hands to Opus Jul 7** | Fable at ~50% weekly budget; grunt work on manager models is pure waste | Active |
| 2026-07-01 | Created `context/`, `memory/`, `instructions/` + CLAUDE.md as the project's operating system | Persist business context across sessions and AIs | Active |
| 2026-07-01 | Cicero agent for all social writing; trained on X + LinkedIn voices; journal pipeline at `marketing/journal/` | One permanent voice identity beats re-briefing every spawn | Created; shakedown pending |
| 2026-07-01 | Octavius: script-first product pipeline (fetch chain OFF→OFF-search→USDA→UPCItemDB, agent for misses only) | Old flow was 4–8 agents/product; unaffordable at 2,000-product scale; single-source (OFF) fragility | ~80% token cut; verified live on 5-product test incl. OFF 503s absorbed |
| 2026-07-01 | Political-analysis pipeline stays multi-agent (NOT collapsed into an agent) | Its value is legal separation; one agent holding 4 adversarial roles recreates the liability | Standing |
| 2026-07-01 | Allergens personalized: never "Bad" universally; zero score penalty; red tag only for the user's own allergens | Peanuts shown as "Bad" to a no-allergy user reads as the app being wrong — fatal for a trust product | Shipped to code; in build 27 |
| 2026-07-01 | Tiered severity colors (red = high-severity only); calm 3-tone home tiles; phone-first (no iPad layout work yet) | Wall-of-red dilutes real warnings; rainbow tiles fought the brand; effort focus | Shipped to code; in build 27 |
| 2026-07-01 | Pricing: $7.99/mo, $49.99/yr, **50% off first year on BOTH plans**; paywall copy driven from live RC introPrice | Match real ASC config; never advertise an offer the store doesn't have | Code + terms page aligned |
| 2026-07-01 | Build 26 rejection root causes: RC entitlement had NO products attached; IAPs never submitted; stock icon (4.3a); Terms link missing from metadata | — | All fixed (new shelf+magnifier icon, RC mapping, ASC steps); build 27 pending |
| 2026-06-30 | Company spotlight = weekly rotation through 30 household-name brands (anchored: Sargento week of 6/29) | Recognizable brand each week; "this week's free unlock" is the freemium hook | Shipped; in build 27 |
| 2026-06-30 | Marketing voice: NAME NAMES. Companies, ingredients, real danger flags. Accuracy is the only rail, not timidity | Anonymized "wellness fog" copy defeats the mission and kills virality | Locked in content-framework.md + Cicero |
| 2026-06-30 | Content ordering law: shock first → 5 checkable products → why → CTA. Video: app mention ONCE at end; 3 hooks per idea; ≤35s | Cold-start algorithm reality: first 2 seconds decide everything | Locked; 20 scripts written to this format |
| 2026-06-30 | Icon/splash: original shelf + wood-handled magnifier mark (user-iterated: 20% smaller magnifier, wood handle, items seated) | 4.3(a) rejection — old icon was a stock magnifier-eye | Rasterized (opaque, no alpha), committed |
| 2026-06-29 | Home reorder: hero (700+) → recent scans → weekly free unlock (with company logo) → category grid | Spotlight is the conversion hook; belongs above the fold-ish | Shipped; in build 27 |
| 2026-06 | Freemium gate: company transparency data (money trail) is THE Pro feature | Transparency data is the differentiated value worth paying for | Standing; paywall live |
| 2026-06 | 30-day launch goal: $1,000/mo ≈ 40 annual subs; daily short-form video is the growth engine; waitlist before approval | Honest math beats vibes; velocity drives category rank | Plan at marketing/30-day-launch-plan.md |
| 2026-06 | EAS builds are metered — validate via logic checks; user decides when to build | Wasted builds = wasted money | Standing SOP |
| 2026-06 | Haiku banned from all research | Fabricated sequential placeholder barcodes rather than admitting failure | Standing; encoded in Octavius |
| 2026-05/06 | Keep the 135k-product generated catalog (products_generated.json) | It's the scan-anything engine (ingredients+nutrition for scoring), not dead weight | Standing; 212MB eager-load flagged for later re-architecture |
