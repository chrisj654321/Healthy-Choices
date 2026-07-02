# Standing instructions — read before acting

_This is the standard brief for any AI session working in this repo (Claude, Chad, agents). CLAUDE.md points here._

## Memory & context rules

1. **Every time the founder shares major context** about the business or his situation → **update `memory/claude-memory.md`** with the key details, dated, same session.
2. **Always reference past decisions before making new recommendations** — read `context/decision-log.md` first; don't re-litigate settled decisions (freemium gate, name-names voice, pricing, metered builds) unless the founder reopens them.
3. **When asked for strategy, assume full knowledge of this folder set** (`context/`, `memory/`, `instructions/`, VISION.md, marketing plans). Never answer a strategy question cold when the answer's inputs live in these files.
4. Keep the context files ALIVE: decisions → decision-log (with outcomes when they land) · priority shifts → priorities.md · new people/agents/pipelines → company-map.md · repeated workflows → sops.md.

## Output rules

- **Format all outputs in Markdown unless told otherwise.**
- Lead with the outcome; keep it scannable; complete sentences over fragment soup.
- Honest reporting always: failures reported as failures, skipped steps named, no rounding up.

## Always

- Plan mode for non-trivial changes; user approves before edits.
- Sonnet creates → Opus/Fable independently reviews → the human commits. Creator ≠ reviewer, everywhere.
- Check `git status` before touching `src/data/` files (Chad may be mid-wave); staging files + commit-by-explicit-path.
- Scripts for bulk HTTP; agents only for judgment. (10+ identical calls = write a script.)
- Validate with logic checks/harnesses — builds are metered and the user decides when to spend one.
- Accuracy rails in all content: name names truthfully, cite regulatory facts, hedge animal studies, vetted sources for money claims.

## Never

- **Military-mention rule (refined 2026-07-02):** biographical military context in marketing is allowed (being in the Army, at AIT, location, limited WiFi/time — his real story). PROHIBITED: using position/rank/title/uniform to promote or as a credibility pitch, uniform photos in marketing, implying Army/DoD endorsement, or implying the business is built on duty time or government resources. Per-post test: is the affiliation doing the SELLING, or setting the scene? Optional insurance on affiliation-forward posts: "views my own, not DoD's."
- Never fabricate: barcodes, ingredients, stats, studies, screenshots, headlines. `could_not_verify` is a success state.
- Never make medical-causation claims ("causes cancer") — regulatory facts only ("banned in the EU").
- Never let an agent commit, or an author approve its own work.
- Haiku never generates facts (no search-and-report, no barcodes/money/legal, nothing user-facing); classify/extract-from-given-text/reformat only, always behind a script validator or Sonnet+ review.
- Never suggest "just do an EAS build to check" — logic-check instead.
- Never default lobbying/donation figures to 0 (null = not found; 0 = confirmed zero).
- Never post/publish anything externally without explicit founder approval.

## Folder map

| Path | What lives there |
|---|---|
| `context/company-map.md` | Who's in the business, agents, pipelines |
| `context/priorities.md` | Current P0–P3 priorities |
| `context/sops.md` | How we always do recurring work |
| `context/decision-log.md` | Decisions → why → outcomes |
| `memory/claude-memory.md` | Durable business/situation memory (rule #1 above) |
| `instructions/instructions.md` | This file |
| `marketing/` (gitignored) | Content, plans, journal, voice exemplars |
| `.claude/agents/` + `.claude/skills/` | Octavius, Cicero, pipelines |
