# Company map — who and what runs Shelf Exposé

_Last updated: 2026-07-01_

## The business

**Shelf Exposé** (app; working repo name "HealthyChoices") — iOS food-transparency app: scan a product → instant health grade, plain-English ingredient breakdown, and the money trail behind the brand (ownership, lobbying, political donations). Product of **James Adventure Sales & Marketing LLC**. Freemium: company transparency data is the Pro gate ($7.99/mo or $49.99/yr; 50% off first year on both plans).

North star: **VISION.md** — translate the label, expose the ownership, follow the money. Full doctrine in [instructions/instructions.md](../instructions/instructions.md).

## People

| Who | Role |
|---|---|
| **Christian James** (founder) | Everything human: product decisions, App Store Connect / RevenueCat ops, filming/posting content, journaling, final approval on all output. Built the app by directing AI ("vibe-coding") — no traditional coding background. CrossFit L2 coach + NASM Sports Nutrition cert (former head coach). Currently in Army 12D school at Fort Leonard Wood — **may appear in marketing as biographical story only** (refined 2026-07-02): never position/rank/uniform as the pitch, never implied Army endorsement, never implied duty-time building (JER). Availability drops hard after Aug 3, 2026 for ~7 months — hence batched content + automation. |
| **Claude ("Fable"/Opus/Sonnet)** | Primary engineering + strategy partner. Fable/Opus = planner and final reviewer; Sonnet = builder. Operates the agent roster below. |
| **Chad (ChatGPT)** | Concurrent second AI session. Has run product-add waves (wave_05–09, ~100 products each) directly in the repo, and co-designed the X growth-batch voice. **Concurrency rule:** check `git status` before touching src/data files Chad may be editing; use staging files; commit by explicit path only. |

## Agent roster (`.claude/agents/`)

| Agent | Model | Job | Never |
|---|---|---|---|
| **Octavius** | Sonnet | Product pipeline: miss research, UPC verification, label decoding → schema, companyId/ownership resolution. Works AFTER the local fetch script (scripts do bulk HTTP, he does judgment). | Fabricates a barcode/ingredient; self-approves |
| **Cicero** | Sonnet | ALL marketing writing: X, LinkedIn (founder series + build-in-public from `marketing/journal/`), video scripts, hooks, calendars. $20k-on-the-line cold-start mindset; voice exemplar = user-edited `marketing/x-posts-growth-batch.md` + `linkedin_posts.md`. | Self-certifies; breaks accuracy rails; uses military identifiers |
| Ad-hoc Sonnet builders | Sonnet | Scoped code changes with disjoint file ownership, spawned per task | Run git commands; review own work |
| Opus reviewers | Opus | Independent review of everything user-facing: code diffs, content packs, product batches, legal copy | Get combined with the creator role |

**Standing pattern: Sonnet creates → Opus/Fable reviews → the human commits.** Legal separation (creator ≠ reviewer) is non-negotiable for product data, political claims, and marketing copy.

## Pipelines (the machines we run repeatedly)

- **octavius** skill — add products (data+company+photo+barcode), ~2 agents/batch. Target: 2,000 products.
- **product-photo-lookup** skill — bulk photo backfills (local scripts first, Octavius for misses, Opus visual review).
- **/political-analysis** — company lobbying/issues research, 4-role legal-separation chain. Only pipeline that stays multi-agent on purpose.
- **content-sprint** skill — monthly content pack (Cicero drafts, Opus evaluates, human approves).
- Marketing system: ~$27/mo (Buffer + Runway), video-primary, auto-generate + human approve.
