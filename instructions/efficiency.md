# Efficiency doctrine — model routing, agents, and Chad orchestration

_The manager's operating manual. Written so ANY capable model can run the office — Fable today, **Opus from July 7, 2026**. Nothing here is tribal knowledge; if it matters, it's in this file._

## The manager role (Fable now → Opus from Jul 7)

The manager does exactly four things: **plan** (plan mode, architecture, triage), **delegate** (route every task per the table below), **review** (independent review of agent/Chad output), and **upkeep** (memory, decision log, priorities). The manager NEVER does grunt work — no bulk edits, no exploration marathons, no long mechanical sessions. Fable has ~50% of weekly budget as of 2026-07-01; treat manager tokens as the scarcest resource in the company.

**Handoff note (Jul 7):** switching the manager to Opus requires zero migration — CLAUDE.md + instructions/ + context/ ARE the manager's brain. A new manager's first act: read those, confirm the priorities file is current, carry on.

## Model routing table — every task gets the cheapest capable tier

| Task | Route to | Never |
|---|---|---|
| Strategy, plans, architecture, final review, legal/brand judgment | **Manager** (Fable → Opus) | Delegate these down |
| Building code, scoped multi-file changes, product batches, content drafts | **Sonnet agents** (Octavius, Cicero, ad-hoc builders) | Manager doing it inline |
| Routine sessions (commits, small fixes, running scripts, batch chores) | **Main session on `/model claude-sonnet-5`** | Running these on Fable/Opus |
| Bulk HTTP, parsing, validation, dedup, merges — anything deterministic | **Local scripts** (free) | Any model doing loops of identical calls |
| Bulk self-contained research/drafting with file deliverables | **Chad** (ChatGPT sub — separate budget = free to us) | Tasks needing repo-wide context |
| Anything | — | **Haiku for research/data** (fabricates under uncertainty — permanent ban) |

Commit note: `git commit` is one cheap tool call — the cost is which model carries the session. Route the *session*, not the commit.

## Agent-spawning rules (what we learned the expensive way)

1. **Script-first test:** would the agent make ≥10 similar HTTP calls or file ops? Write a local script instead. (The photo pipeline went from 400 agent tool-calls to one script run.)
2. **Named agents over re-briefing:** Octavius and Cicero carry their identity, rules, and voice in `.claude/agents/` — a spawn costs one short pointer prompt, not a 2,000-word brief. Create a named agent the second time you write the same long brief.
3. **Pilot before fleet:** one scoped agent on ~20 items to measure hit rate BEFORE launching 6 more. (The 7-agent retailer run died at session limit and produced zero output files.)
4. **Checkpoint early, checkpoint often:** agents write output files incrementally — an agent killed mid-run should leave salvageable work, never nothing. STEP-0 guard (>500 bytes = done) makes resumes free.
5. **Concurrency caps:** max 3 agents parallel, Opus max 2, ~10/session. Don't launch fleets within an hour of known session-limit walls; `resumeFromRunId` after a limit, never restart.
6. **Disjoint file ownership** per parallel agent — zero merge conflicts, zero wasted redo.
7. **Creator ≠ reviewer, but ONE review:** a single merged review pass (e.g. Opus reviews product data AND photo match together) beats two separate review agents.
8. **Right-size the payload:** agents get file PATHS and scoped instructions, not pasted file contents; they read what they need.

## General-work efficiency (main session)

- Targeted reads (grep → offset/limit) over whole-file reads; products.js is 25k lines — never read it flat.
- Batch independent tool calls in one block; batch user questions into one AskUserQuestion (max 4).
- Don't re-read files after your own edits; don't re-verify what a passing script already asserted.
- Validate with node harnesses/parse checks — never an EAS build (metered) and never "spawn an agent to check."
- Write session-durable facts into context/ files as you go — post-compaction re-exploration is pure waste.
- Front-load conclusions in agent reports; the manager reads reports, not transcripts.

## Chad orchestration (ChatGPT subscription = free parallel capacity)

Chad can't be spawned by Claude — **the founder is the bridge.** Protocol:

1. **Claude writes the brief** in [context/chad-tasks.md](../context/chad-tasks.md): self-contained, exact output file paths, schema/format spec, validation criteria, and the concurrency rule (which files Chad owns for the run).
2. **Founder pastes** the brief into ChatGPT; Chad works and writes outputs into the repo (his established pattern: `src/data/batches/products/chatskill_*` waves).
3. **Claude validates with scripts** (parse, schema, dedupe, mod-10 — free) and **reviews like any agent's work** (creator ≠ reviewer applies to Chad too), then merges.
4. Status tracked on the task board; git-status check before anyone touches Chad's in-flight files.

**Route to Chad:** bulk product research waves, first-draft content packs, list-building/data collection, anything self-contained with a file deliverable. **Keep from Chad:** repo-wide refactors, anything needing our agent/skill context, legal/political copy (stays in the 4-role pipeline), final review.

## Weekly budget rhythm

Mon–Sun budget mindset: manager tokens for planning/review checkpoints only; Sonnet default for everything else; Chad absorbs bulk research; scripts absorb everything deterministic. If the manager is >2 consecutive turns of mechanical work, that's a routing failure — stop and delegate.
