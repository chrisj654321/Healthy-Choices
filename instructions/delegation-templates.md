# Delegation templates — the brief structures that worked

_Extracted 2026-07-05 from the briefs that actually produced good output on this project (decision log 2026-06 → 2026-07). A future manager should fill these in, not re-derive brief structure from scratch. Every template already encodes the expensive lessons: checkpoint guards, disjoint file ownership, creator ≠ reviewer, verify-independently, pilot-before-fleet._

## Clauses that go in EVERY brief (the standing eight)

1. **Scope boundary:** exact files/dirs the agent owns; anything outside → flag in report, don't touch.
2. **No commits, no builds, ever.** (Agents never commit; EAS is metered.)
3. **Read the target file fully (or grep-scoped for the 25k-line data files) before editing.**
4. **Checkpoint guard:** output file exists and >500 bytes → return `CHECKPOINT_EXISTS` and stop; write incrementally so a killed run leaves salvageable work.
5. **Validation the agent runs itself:** Babel parse vs. real `babel.config.js`, `npx jest`, or the pipeline's script asserts.
6. **Honest-uncertainty clause:** flag what you're unsure of so the reviewer looks there first; `could_not_verify` is a success state.
7. **Report format:** front-loaded conclusion — files changed, exact behavior delta, edge cases, uncertainties. The manager reads reports, not transcripts.
8. **After the agent returns: the MANAGER verifies independently** (rerun the tests/parse/grep yourself) before telling the founder anything is done. Agent reports get truncated by connection errors — it has happened; the decision log's repeated "verified independently" is the SOP, not flavor text.

---

## Template 1 — Bug fix / hardening with tests (→ Hadrian)

The shape that found the dye-severity bug (2026-07-04) and the storage fail-open behaviors (2026-07-05).

```
Agent: hadrian
Task: [one sentence — the file(s) and the risk being protected against, in founder terms,
       e.g. "tests that catch 'we don't make money or someone leaves a one-star review'"]

Phase A — CHARACTERIZATION FIRST, real data, unmocked where possible:
- Write tests pinning CURRENT behavior of [files]. Use the real data files/DB.
- If a test reveals behavior that looks wrong (silent catch, fail-open, duplicate key,
  asymmetric contract): DO NOT FIX IT. List each finding with evidence in your report.
  [The 2026-07-05 run found 4; fixing without asking risks breaking un-audited call sites.]

Phase B — only after explicit go-ahead, fix the approved subset:
- Fixes: [enumerated list from Phase A, decided by manager/founder]
- Leave-as-is (flagged, intentional-looking): [list]
- Every silent catch you touch reports to Sentry (captureException); user-cancelled paths excluded.

Boundaries: [exact files]. Do not add new dev-dependencies/libraries without asking
(e.g. no React-hook testing lib appeared uninvited — correct behavior, keep it).
Validate: npx jest [suites] green + Babel parse each touched file.
```

## Template 2 — New screen / feature build (→ Hadrian)

The shape behind the app-feel pack, notifications v1, review-prompt rebuild, Wave 2/3 migrations.

```
Agent: hadrian
Task: [feature in one sentence + the user-visible behavior when done]

Plan reference: [the approved plan / decision-log row — Hadrian builds to a plan,
                 it doesn't design the architecture]
Files owned: [exact list — disjoint from any parallel agent's]
House rules that bite on this task (pick the applicable ones):
- Match existing patterns exactly — grep the nearest existing example first
  (haptics wrapped in .catch(() => {}), Colors/Font constants, existing card styling).
- UI shows 0–100 scores, NEVER letter grades (has regressed once).
- src/data/products.js is ~25k lines — grep-scoped reads only.
- New package? Check git status on package.json/package-lock BEFORE and AFTER
  npx expo install — parallel installs have silently clobbered each other before.
- New native module → note "requires next real build, no OTA" in the report.
- Compliance constraints baked into the brief, not left to discretion:
  [e.g. 5.6.1 no custom review pre-prompt; 4.5.4 opt-out toggle; no-tracking = identity-free]
Validate: Babel parse everything touched; npm test stays green; if a behavior can only
be proven on-device (first-launch, async init race), SAY SO in the report — don't guess.
Then: manager reviews the diff against the plan before the founder hears "done".
```

## Template 3 — Content draft + independent review (→ Cicero, then Opus evaluator)

The shape behind the monthly packs and every ad-hoc post since 2026-07-01.

```
Agent: cicero
Task: [N posts / scripts, channel, pillar, theme] → file: marketing/[channel]-YYYY-MM.md
      (date-named monthly files, never "batch2"; every post heading = number + calendar date)

Voice anchors (Cicero re-reads them every run — just confirm which pillar):
- Pillar: [product-fact X / technical build-in-public X / LinkedIn founder / LinkedIn build-in-public]
- Remember the split: 8th-grade barbecue voice everywhere EXCEPT the X technical pillar.
- X format: single long post, punchy lines + hard breaks, by default. Threads only if the
  content demands it. (Standing correction — do not re-litigate.)
PILOT BEFORE FLEET: if this is a new pillar/voice/series, ONE post first for founder
voice-lock, then the batch.

Then spawn a SEPARATE Opus evaluator (model: opus, fresh instance, never Cicero):
"You are an independent reviewer. Do not trust the writer. Assume the draft is too
lenient until proven otherwise." Checklist: military-endorsement, no logos in AI video,
no medical causation, no fabricated anything, money-trail facts trace to
/political-analysis, hooks earn the stop, CTA mix 70/20/10.
Verdicts per item: PASS / FIX [text → replacement] / REJECT [reason]. Evaluator wins ties.
Nothing posts without the founder's explicit approval.
```

## Template 4 — Product-data / bulk-data batch (→ octavius skill, or Chad board)

Mostly you don't write this brief — **invoke the `octavius` skill** and it runs the stages. Write a custom brief only for data work OUTSIDE the product pipeline (cache backfills, audits, migrations):

```
Route check first (in order): local script (any ≥10 identical HTTP/file ops)
→ gpt-5.5 via codex exec (mechanical, clear spec, effectively free)
→ Chad board brief in context/chad-tasks.md (multi-hour async wave; use its template)
→ ONE Sonnet agent (only if it needs our repo/agent context AND judgment).

Brief body (whichever lane):
- Input checkpoint: [path] (must exist, >500 bytes — never run off partial input)
- Output: [exact path(s) the worker owns for this run]
- Schema: [pointer to an example entry — match field-for-field, don't paste the whole file]
- Anti-fabrication: could_not_verify is success; null = not found, 0 = confirmed zero;
  every barcode mod-10 checked; no Haiku anywhere near facts.
- Pilot: first ~20 items, measure hit rate, THEN the fleet (the 7-agent retailer run
  died at session limit with zero output — this rule is blood-bought).
- Validation I run after: [the exact script/grep/parse asserts]
- git status src/data/ before starting AND before merge (Chad may be mid-wave);
  merge via staging files; commit by explicit path, by the founder.
```

---

**Meta-rule for all four:** when a run teaches a new lesson, the template gets the one-line edit the same session — this file is doctrine, and stale doctrine is how the same mistake gets paid for twice.
