# Standard operating procedures

_The things we do repeatedly, and how we always do them. Add a section whenever a workflow gets repeated twice._

## Code changes
1. Non-trivial work starts in **plan mode**; user approves before edits.
2. **Sonnet build agents** implement, each owning a disjoint set of files; agents never run git commands.
3. **Fable/Opus reviews every diff** against the plan before work is called done; reviewer fixes small things directly, bounces big things back.
4. Validate with **logic checks, not builds** — node harnesses, parse checks (`@babel/parser` with jsx), greps. EAS builds are metered; the user decides when to spend one.
5. The **user commits**. Commit only files explicitly staged by path (Chad concurrency). Co-author line per repo convention.

## Product adds → `octavius` skill
Script-first: local fetch script (OFF → OFF-search → USDA → UPCItemDB, cached, mod-10 validated) → Octavius agent for misses/label decoding → one Opus review (includes photo match) → local merge script. Haiku is BANNED from research. Never fabricate a barcode — `could_not_verify` is success.

## Photos → `product-photo-lookup` skill
Bulk = local script always first. Misses → Octavius, small scoped batches. Every non-OFF image gets Opus visual review (caught a BMW bumper once). Magic-byte check everything (RN can't render .ico). Logo audits: featureless = maxStd < 30 after flatten-to-white; dark-but-detailed is fine.

## Company political data → `/political-analysis`
4-role legal separation (researcher → fact-checker → legal writer → legal reviewer), never collapsed. VERIFIED/UNVERIFIED/DISPUTED/STALE flag mapping. Forbidden language list applies. `null` = not found; `0` = confirmed zero — never default to 0.

## Social content → Cicero (+ content-sprint monthly)
Cicero drafts (voice exemplars: `marketing/x-posts-growth-batch.md`, `marketing/2026-07/linkedin-2026-07.md`), separate Opus evaluator judges, human approves/posts. Ordering: shock first → 5 checkable products → why → CTA. Accuracy is the only rail — name names, never fabricate, no medical causation, no military identifiers, pre-launch framing until live.

## App Store submissions
Before every resubmit: IAPs attached to the version + review screenshots; metadata has Terms link + Privacy URL; sandbox-test that a purchase unlocks Pro; reviewer notes (demo login, what's Pro-gated, IAP test path). Screenshots: 6.9"/6.7" iPhone required, 13" iPad since `supportsTablet`. Apple reviews on iPad Air — check the app there when it matters.

## Agent economics
Max 3 concurrent agents; Opus max 2; ~10/session. Checkpoint guards (>500 bytes) between waves. If an agent would make the same HTTP call 10+ times → write a local script instead. Session limits reset ~9:10am Central; EAS iOS quota resets 00:00 UTC on the 1st (~7pm Central the prior evening).

## Memory & context upkeep
Rules live in [instructions/instructions.md](../instructions/instructions.md). Major business context → `memory/claude-memory.md`. Decisions with outcomes → [decision-log.md](decision-log.md). Personnel/agent/pipeline changes → [company-map.md](company-map.md). Priority shifts → [priorities.md](priorities.md).
