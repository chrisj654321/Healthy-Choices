# Shelf Exposé (HealthyChoices) — session brief

iOS food-transparency app (Expo RN): scan a product → health grade, plain-English ingredients, and the money trail behind the brand. Solo founder (Christian James, James Adventure Sales & Marketing LLC), built by directing AI. Freemium — company transparency is the Pro gate.

## Read these before consequential work — and KEEP THEM UPDATED

| File | What it is | Your duty |
|---|---|---|
| [instructions/instructions.md](instructions/instructions.md) | Standing brief: memory rules, output rules, always/never | Follow it every session |
| [memory/claude-memory.md](memory/claude-memory.md) | Durable business memory | **Whenever the founder shares major business/situation context → add a dated entry, same session** |
| [context/decision-log.md](context/decision-log.md) | Decisions → why → outcomes | **Consult before recommending anything; append every consequential decision; fill in outcomes** |
| [context/priorities.md](context/priorities.md) | Current P0–P3 | Update when priorities ship or shift |
| [context/company-map.md](context/company-map.md) | People, agents (Octavius, Cicero), pipelines | Update when roles/agents/pipelines change |
| [context/sops.md](context/sops.md) | How recurring work is always done | Add a section when a workflow repeats |
| [context/backlog.md](context/backlog.md) | Idea backlog, impact-sorted + effort-sized | Add founder ideas here; delete when shipped (log outcome in decision-log) |
| [VISION.md](VISION.md) | Product north star | Every feature and post serves it |

Strategy questions assume full knowledge of the folders above. Format outputs in Markdown unless told otherwise. Always reference past decisions before new recommendations.

## Non-negotiables (full list in instructions/)

- **Never** use the founder's military status in marketing (JER/DoDD 1344.10).
- Never fabricate data (barcodes, stats, studies); no medical-causation claims — regulatory facts only.
- Creator ≠ reviewer: Sonnet builds, Opus/Fable reviews, the human commits. Agents never commit.
- EAS builds are metered — validate with logic checks; the founder decides when to build.
- Check `git status` before editing `src/data/` (Chad, a parallel ChatGPT session, runs product waves there); staging files; commit by explicit path.
- Scripts for bulk HTTP, agents for judgment. Haiku banned from research.

## Key machinery

- **Product adds:** `octavius` skill (script-first fetch chain → Octavius agent → Opus review → script merge).
- **Social content:** Cicero agent (voice exemplars: `marketing/x-posts-growth-batch.md`, `marketing/linkedin_posts.md`); monthly packs via `content-sprint`; separate Opus evaluator always.
- **Company political data:** `/political-analysis` — 4-role legal-separation pipeline, never collapsed.
- **Photos:** `product-photo-lookup` skill.
- `marketing/` is gitignored (content, plans, founder journal at `marketing/journal/`).
