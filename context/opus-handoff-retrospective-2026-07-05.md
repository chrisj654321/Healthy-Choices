# Opus handoff retrospective — Fable, 2026-07-05

_Departing-manager memo, written two days before the manager role hands to Opus (2026-07-07, per [decision-log.md](decision-log.md) 2026-07-02 and [instructions/efficiency.md](../instructions/efficiency.md)). This is a permanent record: what the founder actually uses this system for, what repeats, what keeps getting corrected, and what I built on the way out. Everything cited; nothing padded._

**Method note:** evidence below comes from the full decision log, the 17 memory files at `~/.claude/projects/C--Users-chris-HealthyChoices/memory/`, the agent/skill definitions, and the context files. I attempted transcript search across past sessions (`ccd_session_mgmt`); it indexed only 5 stale CCD sessions (Apr–Jun) and returned zero hits for correction phrases — the real working sessions ran in the CLI and aren't searchable. So no transcript claims appear here; the dated memory files are the primary repeated-correction evidence, and they're good.

---

## 1. What does the founder use Claude for most?

Christian is a non-coder who **built the entire app by directing AI** ([company-map.md](company-map.md) People table; [memory/claude-memory.md](../memory/claude-memory.md) 2026-07-01: "~60 working days across 13 months"). Claude isn't a tool he consults — it's the entire engineering org, plus half the strategy and marketing departments. By decision-log volume, in order:

1. **Building and fixing the app itself.** The log is dominated by app work: builds 24→28, the review-prompt 5.6.1 rebuild, haptics/animation pack, notifications v1, the Jest test program (76→147→196 tests, 2026-07-04/05), and the full SQLite catalog re-architecture (Waves 1–3, closed out 2026-07-05).
2. **App Store submission firefighting.** Build 26 rejected on 4 findings (2026-07-01), build 27 rejected on the ATT privacy label (2026-07-02), build 28 fixes — each a multi-day root-cause-and-fix cycle.
3. **Product database growth.** 540→773→873 curated products, photos to ~86%, 254/269 logos ([memory/product_build_progress.md], [priorities.md](priorities.md) P2); target 2,000 via the octavius pipeline.
4. **The marketing system.** Cicero, content-sprint monthly packs, the journal→LinkedIn pipeline, the whole ~$27/mo automation stack ([memory/marketing-plan.md]) — built so the account runs itself when he loses availability Aug 3.
5. **Strategy with memory.** The exit-vision/no-tracking decision, pricing, freemium gate, stack audit ([memory/claude-memory.md] 2026-07-02, 2026-07-04). What he values here is that the system *remembers*: "always reference past decisions" is rule #2 in [instructions/instructions.md](../instructions/instructions.md).

The human keeps for himself: ASC/RevenueCat dashboard ops, filming/posting, final approvals, and every commit.

## 2. What tasks repeat again and again?

- **Product-add batches** — Chad waves 05–09 (~100 each), my phases 1–8 + pt2, ongoing to 2,000 ([memory/product_build_progress.md], [priorities.md] P2). Fully skill-ified (octavius).
- **Photo/logo backfills** — the 402-barcode run, two logo audits with their own lessons (magic-byte check, black-slab detection) ([sops.md](sops.md), [memory/feedback-bulk-http-local-not-agents.md]). Skill-ified (product-photo-lookup).
- **The submit→reject→fix→resubmit loop** — builds 24, 26, 27, 28. Every rejection traced to a *checklist miss*, not novel problems: IAPs never submitted, entitlement unmapped, terms link missing, stock icon, privacy toggles ([decision-log.md] 2026-07-01/02; [memory/submission-audit-2026-06.md]). This was NOT a skill until today — now it is (see §4).
- **Monthly content packs + ad-hoc posts** — month-01 banks, month-02 pack exists in `marketing/month-02/`. Skill-ified (content-sprint).
- **Characterization-test expansion** — three rounds in three days (scorer → subscription/storage → productStore), same brief shape each time. Now a delegation template (see deliverables).
- **Context-file upkeep** — every consequential session appends to the decision log. This discipline is the single reason a zero-migration handoff is possible.

## 3. What instructions does he keep rewriting/repeating?

The `feedback-*.md` memory files are the receipts. Each is a dated instance of the founder correcting (or explicitly praising) an approach:

| Memory file | What it corrected | Root cause |
|---|---|---|
| `feedback-limited-builds` | Stop suggesting EAS builds / expo runs to verify | Default AI instinct is "build and test"; his builds are metered. Repeated enough that it now lives in FIVE places (memory, CLAUDE.md, instructions.md, sops.md, efficiency.md) |
| `feedback-bulk-http-local-not-agents` | 8 agents × 50 barcodes all died at session limits; one local script did 402 in ~3 min | Agent-per-item instinct; became the product-photo-lookup skill |
| `feedback-name-names` | Rejected timid, anonymized "wellness fog" copy — name companies and ingredients, accuracy is the only rail | Default AI over-caution; superseded the content-sprint guardrails' over-hedged framing |
| `feedback-eighth-grade-voice` | LinkedIn draft used "production stack," "type-checking" — all marketing at 8th-grade non-tech level (barbecue test) | Writing for developers when the audience is regular people |
| `feedback-x-thread-format` | I turned a one-post tone correction into a rigid "always thread" rule; he had to correct it back (he has X Premium — long single posts are MORE native) | Over-generalizing a narrow correction |
| `feedback-verify-scope-before-encoding` | The meta-lesson from the above: check whether a correction is one-off or general BEFORE writing it into doctrine | His words: "sometimes I have to say exactly what I want. Often times you're really good and you infer what I want. But this was not an example of that." |
| `feedback-verify-screenshot-metrics` | Cited a reposted third-party viral post's 490K views as his own and declared a false "format breakthrough" — logged it before he caught it ("bro learn to zoom") | Asserting a visual read instead of verifying whose numbers they were |
| `feedback-short-bullets` | (Praise, not correction) End decision turns with ✅ done-list + numbered options — "beautiful, and exactly how I like being communicated with" | He works late/tired; scannability wins |
| `user-teach-dev-jargon` | (Request) Bold the real technical term, define once, use naturally — he wants developer fluency | Public voice stays non-tech; explanations TO him should not |

Two more rewrite cycles outside memory/: the **military-mention rule** started as an absolute ban ("NEVER usable in marketing," claude-memory 2026-07-01) and the founder had to walk it back to biography-is-fine on 2026-07-02 — it's now stated in five files. And the **Haiku ban** went from "banned from all research" (2026-06) to the refined transform-only rule (2026-07-02).

**The honest pattern:** his corrections cluster into exactly three failure modes — (a) *over-caution defaults* (timid copy, over-strict military rule, hedge-everything), (b) *over-generalizing his corrections* into sweeping rules, and (c) *resource-waste defaults* (builds, agent fleets). He almost never corrects factual/technical work — he corrects **calibration**. Opus should internalize that the founder's own voice is direct and unafraid; when in doubt, be specific and named, not soft — and when a correction lands, ask what axis it's on before encoding it.

## 4. What workflows should become Skills that aren't already?

Audited against the 4 existing skills (octavius, product-photo-lookup, content-sprint, add-product[deprecated]):

- **App Store submission preflight — the one real gap. BUILT today:** `.claude/skills/submission-preflight/SKILL.md`. Three consecutive builds were rejected on findings that a checklist would have caught, and the checklist knowledge was scattered across sops.md (one paragraph), the decision log, and submission-audit-2026-06.md. Now it's one skill: code-level greps, the ASC/RC founder checklist, metadata, sandbox test, reviewer notes, and a rejection→known-fix playbook keyed by guideline number.
- **Considered and rejected:** characterization-test expansion (delegation-shaped, not pipeline-shaped — it's now a template in `instructions/delegation-templates.md` instead); Chad briefs (already templated in [chad-tasks.md](chad-tasks.md)); the "unrecognized-ingredient elimination" campaign ([backlog.md](backlog.md) #1 — real, but it hasn't run once yet; write the skill after the pilot run teaches us the shape, per pilot-before-fleet).
- **Existing skills: leave them alone.** All four descriptions trigger correctly and the doctrine warns against unnecessary rebuilding. One note for later: `add-product` can be deleted outright once muscle memory fully points at octavius — it's pure redirect text now.

## 5. What should Opus know on day one?

Short version — the full briefing is now in the expanded **Handoff note** in [instructions/efficiency.md](../instructions/efficiency.md), which is the file Opus reads anyway:

1. **The context files really are the brain — trust them.** This infrastructure was built by the founder and prior sessions and it *works*; the handoff is zero-migration because the decision log and memory files have been kept honest. Your job is to keep them alive, not rebuild them.
2. **Calibration is the skill the founder is buying.** Direct voice, no timidity, no over-generalized rules, no wasted builds/agents (see §3 pattern).
3. **Verify independently before telling the founder something is done.** Agent reports get truncated by connection errors (happened twice on 2026-07-05 alone); the decision log's repeated "verified independently" is not a stylistic tic, it's the SOP.
4. **This codebase's specific traps** — duplicate JS object keys silently overriding (the 2026-07-04 dye-severity bug), the 25k-line products.js, the two photo-storage patterns, letter grades never rendered in UI — are in the handoff note and the agent files.
5. **How he likes to be talked to:** ✅ done-list + numbered options at decision points; teach him the jargon (bold, define once, use naturally); Markdown always.
6. **Open items you inherit:** build 28 review outcome; the products.db-in-EAS-build decision (~153MB commit vs. build hook — founder decision, needs a real build); Sentry GitHub-integration config confirmation; Aug 3 availability cliff drives everything.

---

## What I'm leaving behind (built 2026-07-05)

| Deliverable | Path | What it is |
|---|---|---|
| This retrospective | `context/opus-handoff-retrospective-2026-07-05.md` | Permanent record of the five answers above |
| Submission-preflight skill | `.claude/skills/submission-preflight/SKILL.md` | The rejection-proofing checklist as a pipeline |
| Founder usage guide | `instructions/founder-usage-guide.md` | How to brief the system, what to expect from each tier, real if-you-say-X examples |
| Delegation templates | `instructions/delegation-templates.md` | Fill-in-the-blank briefs for the 4 delegation shapes this project actually uses |
| Expanded handoff note | `instructions/efficiency.md` (edited in place) | The day-one briefing: judgment calls, gotchas, founder-communication rules, open items |

And the honest closing note: most of what made this project work was already here before today — the founder's insistence on a decision log with *outcomes*, the memory files that captured his corrections verbatim, and the named agents that stopped us re-briefing from scratch. I audited it, filled the one real skill gap, extracted the templates, and wrote down the judgment calls that lived only in my head. Opus: read efficiency.md first, confirm priorities.md is current (its "last updated" line already lags the P0 section by a day — keep those fresher than I did), and carry on.

— Fable, retiring manager
