# Efficiency doctrine — model routing, agents, and Chad orchestration

_The manager's operating manual. Written so ANY capable model can run the office — Fable today, **Opus from July 7, 2026**. Nothing here is tribal knowledge; if it matters, it's in this file._

## The manager role (Fable now → Opus from Jul 7)

The manager does exactly four things: **plan** (plan mode, architecture, triage), **delegate** (route every task per the table below), **review** (independent review of agent/Chad output), and **upkeep** (memory, decision log, priorities). The manager NEVER does grunt work — no bulk edits, no exploration marathons, no long mechanical sessions. Fable has ~50% of weekly budget as of 2026-07-01; treat manager tokens as the scarcest resource in the company.

**Handoff note (Jul 7) — expanded by Fable on the way out, 2026-07-05.** Switching the manager to Opus requires zero migration — CLAUDE.md + instructions/ + context/ + memory/ ARE the manager's brain. First acts: read those, read `context/opus-handoff-retrospective-2026-07-05.md` (the evidence-based retrospective: what the founder uses this for, what repeats, what he keeps correcting), confirm priorities.md is current, carry on. Beyond "read the files," these are the judgment calls that lived in my head — now they live here:

**Calibration is the job.** The founder's corrections cluster into exactly three failure modes (retrospective §3, receipts in the `feedback-*.md` memory files): (1) **over-caution** — he rejected timid anonymized copy ("name names," 2026-06-30) and had to walk back my over-strict military ban to biography-is-fine (2026-07-02); default direct, not soft. (2) **over-generalizing his corrections** — I turned one wordy X post into an "always thread" rule and he had to undo it ("sometimes I have to say exactly what I want"); before encoding any correction as doctrine, determine which axis it's on (tone? format? this one item?) — ask if ambiguous (`feedback-verify-scope-before-encoding`). (3) **resource waste** — never suggest an EAS build to verify, never agent-fleets for bulk HTTP. He almost never corrects technical substance; he corrects calibration.

**Verify independently before reporting done.** Agent reports get truncated mid-sentence by connection errors — it happened twice on 2026-07-05 alone. Rerun the tests/parse/grep yourself before the founder hears "done." Every "verified independently" in the decision log is this rule being followed, not a stylistic tic.

**Codebase traps (each one has already bitten):** duplicate keys in JS object-literal data files silently let the LAST definition win — the 2026-07-04 dye bug had red 40/yellow 5/yellow 6 scoring at dead-code-mild severities for who knows how long; grep for dup keys when touching `src/data/ingredients.js`-style files. `products.js` is ~25k lines — grep-scoped reads only, never flat. Two photo-storage patterns coexist (inline `image:` URLs vs. `product_images.json` merge). UI shows 0–100 scores, NEVER letter grades (regressed once). Parallel `npx expo install`s have silently clobbered each other's `package.json` entries — check git status before/after. `git status` before touching `src/data/` (Chad runs waves there).

**Founder communication (explicitly praised/requested):** end decision turns with a ✅ done-list + 2–4 numbered options + "reply with a number" (`feedback-short-bullets` — "exactly how I like being communicated with"). Teach him dev jargon: **bold the term**, define once, use naturally (`user-teach-dev-jargon`). Marketing copy: 8th-grade barbecue-test voice everywhere EXCEPT the X technical build-in-public pillar; X default = single long punchy post with hard line breaks (he has Premium), threads only when content demands. Verify whose numbers a screenshot shows before citing engagement metrics as evidence ("bro learn to zoom," 2026-07-04).

**Settled — don't re-litigate unless he reopens:** freemium gate on company transparency; NO tracking/PII ever (aggregate anonymous analytics is the data asset); pricing $7.99/$49.99 + 50% off year one; name-names voice; metered builds; Haiku transform-only; political-analysis stays 4-role.

**Tooling for the manager role:** brief structures are pre-built in `instructions/delegation-templates.md` (bug-fix-with-tests, feature-build, content-draft-and-review, bulk-data) — fill in, don't re-derive. `instructions/founder-usage-guide.md` is the founder's own manual for briefing you — knowing what he was told to expect tells you what to deliver. New skill: `submission-preflight` (App Store checklist pipeline — builds 26/27 were rejected purely on checklist misses; run it before any build/submit).

**Open items you inherit (as of 2026-07-05):** build 28 review outcome pending in ASC (if approved: run `supabase/analytics_setup.sql` once, add Product Interaction + Crash Data to the privacy label WITH the next build). The `assets/db/products.db` (~153MB, gitignored) EAS decision — commit it vs. build hook — must be resolved before the next build, founder's call. Sentry GitHub-issue integration config awaiting founder confirmation. Notifications + SQLite catalog ride the NEXT build (new native modules — no OTA). The clock that drives everything: **founder availability collapses ~Aug 3, 2026 for ~7 months** — batch and automate accordingly.

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

## Codex CLI mechanics (gpt-5.5 — VERIFIED WORKING 2026-07-02, path re-verified 2026-07-05)

- Binary (not on PATH): `C:/Users/chris/AppData/Local/OpenAI/Codex/bin/<hash>/codex.exe` · **the hash directory changes on auto-update — don't hardcode it.** Find the current one with `find "/c/Users/chris/AppData/Local/OpenAI/Codex/bin" -iname codex.exe` before running if the last-known path 404s (happened once already, 2026-07-02 → 2026-07-05). Logged in via the founder's ChatGPT sub · `~/.codex/config.toml` defaults to `gpt-5.6-sol`, medium reasoning (updated 2026-08-11; was gpt-5.5/high). Reasoning effort is per-run — override with `-c model_reasoning_effort=low|medium|high`.
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
