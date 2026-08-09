# Food Exposé: Barcode Scanner (HealthyChoices) — session brief

iOS food-transparency app (Expo RN): scan a product → health grade, plain-English ingredients, and the money trail behind the brand. Solo founder (Christian James, James Adventure Sales & Marketing LLC), built by directing AI. Freemium — company transparency is the Pro gate.

## Read these before consequential work — and KEEP THEM UPDATED

| File | What it is | Your duty |
|---|---|---|
| [instructions/instructions.md](instructions/instructions.md) | Standing brief: memory rules, output rules, always/never | Follow it every session |
| [instructions/efficiency.md](instructions/efficiency.md) | **Model routing + agent rules + Chad protocol** — the manager's manual | Route EVERY task by its table before doing it yourself |
| [context/chad-tasks.md](context/chad-tasks.md) | Chad (ChatGPT) task board | Write briefs here; validate + review Chad's output like any agent's |
| [memory/claude-memory.md](memory/claude-memory.md) | Durable business memory | **Whenever the founder shares major business/situation context → add a dated entry, same session** |
| [context/decision-log.md](context/decision-log.md) | Decisions → why → outcomes | **Consult before recommending anything; append every consequential decision; fill in outcomes** |
| [context/priorities.md](context/priorities.md) | Current P0–P3 | Update when priorities ship or shift |
| [context/company-map.md](context/company-map.md) | People, agents (Octavius, Cicero), pipelines | Update when roles/agents/pipelines change |
| [context/sops.md](context/sops.md) | How recurring work is always done | Add a section when a workflow repeats |
| [context/backlog.md](context/backlog.md) | Idea backlog, impact-sorted + effort-sized | Add founder ideas here; delete when shipped (log outcome in decision-log) |
| [VISION.md](VISION.md) | Product north star | Every feature and post serves it |
| [memory/chad-memory.md](memory/chad-memory.md) | Durable Chad/ChatGPT preferences | Follow these defaults when generating prompts, creative concepts, and Chad-owned work |

Strategy questions assume full knowledge of the folders above. Format outputs in Markdown unless told otherwise. Always reference past decisions before new recommendations.

## Efficiency (full doctrine in instructions/efficiency.md)

- **The manager (Fable → Opus from Jul 7, 2026) only plans, delegates, reviews, and keeps context files current.** Manager tokens are the scarcest resource — grunt work on a manager model is a routing failure.
- Cheapest capable tier for everything: local scripts (deterministic) → **gpt-5.5 via `codex exec`** (bulk/mechanical/investigation — founder's ChatGPT sub = effectively free; binary path + mechanics in efficiency.md) → Sonnet (user-facing building, routine sessions — default `/model claude-sonnet-5`) → manager (planning/review only). Escalate without asking when output misses the bar; for anything that ships, intelligence > taste > cost; user-facing needs taste ≥ 7 (Sonnet+).
- Agents: script-first test, named agents over re-briefing, pilot before fleet, incremental checkpoints, max 3 parallel (Opus 2).
- **Keep the context window under 50% at all times.** There is no live gauge to read, so this is a set of disciplines, not a number to watch: grep for the lines you need instead of reading whole files; read a file range, not the file; delegate bulk reading and building to subagents and keep only their report; never paste large outputs back into the conversation; batch many images into one contact sheet rather than opening them one at a time; write findings to a file and reference the path instead of restating them. If a task cannot be done inside that budget, split it and delegate — do not spend the window and then compact.

## Language: ASD-STE100 Simplified Technical English

Write in ASD-STE100 Simplified Technical English: one word one meaning, short sentences, active voice, present tense, one instruction per sentence, no idiom or slang, keep the article ("the", "a"). This applies to **explanations to the founder, code comments, commit messages, plans, docs, and agent briefs.**

Two deliberate exemptions, because STE would defeat their purpose:
- **Customer-facing marketing copy** (Cicero's output: X, LinkedIn, video scripts, hooks, App Store text). That work is governed by the hook doctrine and the 8th-grade-voice rule, which need vivid and punchy language that STE forbids. STE and "every first line must earn the stop" cannot both apply.
- **Teaching technical terms to the founder** ([[user-teach-dev-jargon]]): he wants the real term bolded, defined once, then used. STE's approved-word limit would block this, so the teaching rule wins.

## Non-negotiables (full list in instructions/)

- Military mentions in marketing: biographical context is FINE ("I'm in the Army at AIT, building in scarce hours"); what's prohibited is using position/rank/uniform to PROMOTE, implying Army/DoD endorsement, or implying the business runs on duty time/resources. Test: is the affiliation doing the selling, or setting the scene? (JER)
- Never fabricate data (barcodes, stats, studies); no medical-causation claims — regulatory facts only. **Caveat (2026-07-23):** marketing tone may exaggerate for engagement — hyperbole, dramatic framing, punchy hooks, self-deprecating bits are fine. The rail is verifiable facts (no invented number, quote, study, screenshot, or stat presented as real), not enthusiasm or drama. **Satire carve-out (2026-07-23):** a fabricated depiction of the app's OWN interface for obvious comedic effect (e.g. a joke screenshot scoring candy "perfect") is allowed — founder-approved, see content-framework.md. Fabricating THIRD-PARTY facts/data is still fully banned; the satire has to read as a joke in context (caption/absurdity carries that, not a disclaimer).
- Creator ≠ reviewer: Sonnet builds, Opus/Fable reviews, Claude (this session) commits to GitHub when asked. Worker agents (Hadrian, Octavius, Cicero) never commit — their output only reaches a commit after being reviewed here.
- EAS builds and submissions are metered/consequential and stay with the founder — Claude never runs `eas build`/`eas submit`; validate with logic checks and hand off exact commands instead.
- Check `git status` before editing `src/data/` (Chad, a parallel ChatGPT session, runs product waves there); staging files; commit by explicit path.
- Scripts for bulk HTTP, agents for judgment. Haiku never generates facts — transform-only (classify/extract/reformat) behind validators.

## Key machinery

- **Product adds:** `octavius` skill (script-first fetch chain → Octavius agent → Opus review → script merge).
- **Social content:** Cicero agent (voice exemplars: `marketing/strategy/x-posts-growth-batch.md`, `marketing/2026-07/linkedin-2026-07.md`); monthly packs via `content-sprint`; separate Opus evaluator always.
- **Company political data:** `/political-analysis` — 4-role legal-separation pipeline, never collapsed.
- **Animal-welfare/farm sourcing data:** `sourcing-transparency` skill — same 4-role legal separation + symmetric praise rail (positive claims need third-party certification, negative need adjudication); industry modules, eggs = pilot. Data-only; UI is a separate build.
- **Photos:** `product-photo-lookup` skill.
- `marketing/` is gitignored (content, plans, founder journal at `marketing/journal/`).
