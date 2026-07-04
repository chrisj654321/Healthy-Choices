# Efficiency doctrine — model routing, agents, and Chad orchestration

_The manager's operating manual. Written so ANY capable model can run the office — Fable today, **Opus from July 7, 2026**. Nothing here is tribal knowledge; if it matters, it's in this file._

## The manager role (Fable now → Opus from Jul 7)

The manager does exactly four things: **plan** (plan mode, architecture, triage), **delegate** (route every task per the table below), **review** (independent review of agent/Chad output), and **upkeep** (memory, decision log, priorities). The manager NEVER does grunt work — no bulk edits, no exploration marathons, no long mechanical sessions. Fable has ~50% of weekly budget as of 2026-07-01; treat manager tokens as the scarcest resource in the company.

**Handoff note (Jul 7):** switching the manager to Opus requires zero migration — CLAUDE.md + instructions/ + context/ ARE the manager's brain. A new manager's first act: read those, confirm the priorities file is current, carry on.

## Model rankings — cost reflects what WE actually pay, not list price

Higher = better. Cost 9 = effectively free to us (founder's ChatGPT sub has generous limits); Fable cost 2 = the scarcest thing in the office. Intelligence = how hard a problem it handles unsupervised. Taste = UI/UX, copy, API design, code quality.

| model | cost | intelligence | taste |
|---|---|---|---|
| gpt-5.5 (via Codex CLI) | 9 | 8 | 5 |
| sonnet-5 | 5 | 5 | 7 |
| opus-4.8 | 4 | 7 | 8 |
| fable-5 | 2 | 9 | 9 |

**How to apply:**
- These are defaults, not limits. **Standing permission to escalate:** if a cheaper model's output doesn't meet the bar, rerun with a smarter model without asking. Judge the output, not the price tag — escalating costs less than shipping mediocre work.
- Cost is a tie-breaker only; for anything that ships: **intelligence > taste > cost**.
- **Bulk/mechanical** (clear-spec implementation, data analysis, migrations, investigation): **gpt-5.5** — it's effectively free.
- **Anything user-facing** (UI, copy, API design) needs **taste ≥ 7** → Sonnet minimum; Opus/Fable for the final pass. GPT never writes final user-facing copy.
- **Reviews of plans/implementations:** Fable or Opus; optionally gpt-5.5 as an extra independent perspective (a THIRD set of eyes is nearly free).
- **Haiku never generates facts** (no search-and-report, no barcodes/money/legal, nothing user-facing). Haiku may classify, extract-from-given-text, and reformat — always behind a script validator or Sonnet+ review.
- **Local scripts still beat every model** for deterministic work (bulk HTTP, parsing, validation, merges).

| Task | Route to |
|---|---|
| Strategy, architecture, final review, legal/brand judgment | **Manager** (Fable → Opus from Jul 7) |
| User-facing building: UI code, marketing copy (Cicero), product data (Octavius) | **Sonnet agents** |
| Bulk/mechanical: clear-spec implementation, data analysis, investigation, migrations | **gpt-5.5 via `codex exec`** |
| Routine sessions (commits, small fixes, running scripts) | Main session on `/model claude-sonnet-5` |
| Deterministic anything | **Local scripts** (free) |

Commit note: `git commit` is one cheap tool call — the cost is which model carries the session. Route the *session*, not the commit.

## Codex CLI mechanics (gpt-5.5 — VERIFIED WORKING 2026-07-02)

- Binary (not on PATH): `C:/Users/chris/AppData/Local/OpenAI/Codex/bin/aec6b7c6fcdfb66a/codex.exe` · logged in via the founder's ChatGPT sub · `~/.codex/config.toml` defaults to gpt-5.5, high reasoning.
- **Investigation / analysis (read-only):** `codex exec -s read-only "<self-contained prompt>"` from the repo root — it reads the repo itself; don't paste file contents.
- **Implementation:** `codex exec "<prompt>"` (workspace-write sandbox). Treat its output like any agent's: validate with scripts, review before merge, it never commits.
- **Inside agent flows:** the Agent model parameter only takes Claude models — to use gpt-5.5 from a workflow, spawn a thin Sonnet wrapper agent whose prompt is: write a self-contained codex prompt, run `codex exec` via Bash, return the result.
- Smoke test on record: repo-aware Q&A, 7.8k tokens, correct answer, zero Claude spend.

## Agent-spawning rules (what we learned the expensive way)

1. **Script-first test:** would the agent make ≥10 similar HTTP calls or file ops? Write a local script instead. (The photo pipeline went from 400 agent tool-calls to one script run.)
2. **Named agents over re-briefing:** Octavius (products), Cicero (marketing), and **Hadrian (all general app code — screens/components/navigation/utils)** carry their identity, rules, and voice in `.claude/agents/` — a spawn costs one short pointer prompt, not a 2,000-word brief. Hadrian is the standing answer to "who builds the UI/feature code" — spawn it by name instead of re-writing the Sonnet-builder constraints (no commits, no builds, Babel-parse validation, disjoint file ownership) every time.
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

**Two lanes now:**
- **Programmatic (primary):** gpt-5.5 via `codex exec` — Claude spawns it directly (see Codex CLI mechanics above). Use for anything bulk/mechanical/investigative that a session can wait on.
- **Paste-bridge (for big async waves):** the ChatGPT app, with **the founder as the bridge** — right for multi-hour product waves and work Chad runs while Claude does something else. Protocol:

1. **Claude writes the brief** in [context/chad-tasks.md](../context/chad-tasks.md): self-contained, exact output file paths, schema/format spec, validation criteria, and the concurrency rule (which files Chad owns for the run).
2. **Founder pastes** the brief into ChatGPT; Chad works and writes outputs into the repo (his established pattern: `src/data/batches/products/chatskill_*` waves).
3. **Claude validates with scripts** (parse, schema, dedupe, mod-10 — free) and **reviews like any agent's work** (creator ≠ reviewer applies to Chad too), then merges.
4. Status tracked on the task board; git-status check before anyone touches Chad's in-flight files.

**Route to Chad:** bulk product research waves, first-draft content packs, list-building/data collection, anything self-contained with a file deliverable. **Keep from Chad:** repo-wide refactors, anything needing our agent/skill context, legal/political copy (stays in the 4-role pipeline), final review.

## Weekly budget rhythm

Mon–Sun budget mindset: manager tokens for planning/review checkpoints only; Sonnet default for everything else; Chad absorbs bulk research; scripts absorb everything deterministic. If the manager is >2 consecutive turns of mechanical work, that's a routing failure — stop and delegate.
