# Founder's guide to running the AI office

_Written for Christian by Fable, 2026-07-05, on the way out. This is the manual for the thing you built: how to brief it, what each layer does, and — using real incidents from our own history — when your quick style works and when you need to be painfully explicit. Jargon is **bolded and defined** on first use throughout, per your standing request (memory: `user-teach-dev-jargon`)._

## The org chart, in plain terms

| Layer | Who | What they're for | What they never do |
|---|---|---|---|
| **Manager** (Opus from Jul 7) | The session you talk to on the expensive model | Plans, routes work, reviews everything, keeps the context files current, answers strategy with full memory | Grunt work. If the manager is doing bulk edits, that's a routing failure — call it out |
| **Builder session** (Sonnet) | Routine day-to-day sessions (`/model claude-sonnet-5`) | Small fixes, running scripts, commits | Final review of its own big work |
| **Named agents** | Hadrian (app code), Octavius (product data), Cicero (marketing) | The repeatable specialist work — each carries its own permanent rulebook in `.claude/agents/` so nobody re-explains the rules every time | Commit, build, or approve their own work |
| **Chad** (ChatGPT) + **gpt-5.5** (`codex exec`) | Free parallel capacity on your ChatGPT sub | Bulk research waves, mechanical implementation, investigations | Final user-facing copy, legal/political content, final review |
| **Skills** | octavius, content-sprint, product-photo-lookup, submission-preflight | Whole pipelines in a can — say the trigger phrase and the machinery runs | — |
| **You** | The human | Decisions, dashboards (ASC/RevenueCat), filming, approvals, and every **commit** (saving a change permanently into the project's history) | — |

The one law under all of it: **creator ≠ reviewer**. Whoever wrote a thing never approves it. That's why product data, code diffs, and marketing packs always pass through a second set of eyes before you commit.

## How to brief it well (what actually worked on this project)

1. **Say the goal and the fear, not the implementation.** Your best briefs named the outcome you cared about: "tests that catch *we don't make money or someone leaves a one-star review*" (2026-07-05) got you the subscription + storage test suites, aimed at exactly the right files. You didn't have to know what a **characterization test** is (a test that pins down what code *currently* does, so future changes can't silently break it) — naming the fear was enough.
2. **Anchor to past decisions.** "Apply the established rules strictly, don't invent new severity" (the 2026-07-04 flavors ruling) is a perfect brief: it told the AI which principle wins. The decision log exists so you can say "per the decision on X" instead of re-explaining.
3. **Give a size and a boundary.** "Add these 20 products," "only the scanner screen, leave the rest" — scope is the cheapest quality lever you have. Open-ended briefs produce sprawl.
4. **When it matters, demand the checklist back.** You praised the ✅ done-list + numbered-options format ("beautiful, and exactly how I like being communicated with") — it's now standing doctrine. If a session ends in prose soup, ask for the numbered version; you're entitled to it.
5. **Trust but verify the "done."** Standing rule the managers follow: agent reports can be cut off mid-sentence by connection errors, so nothing is reported to you as done until it's been independently re-checked. If a "done" ever comes without "verified independently," ask.

## Your inference loop — when it works, and the two ways it fails

Most of the time you talk shorthand and the model infers correctly — you said so yourself. The two real failure modes we hit, so you can spot them early:

**Failure 1: it over-generalizes your correction.** The X-thread incident (2026-07-04): you disliked ONE wordy post. I encoded "all X posts must be threads," and Cicero dutifully shredded a good single post into a 10-tweet thread. Your words after: *"sometimes I have to say exactly what I want. Often times you're really good and you infer what I want. But this was not an example of that."* The fix is now doctrine (`feedback-verify-scope-before-encoding`): when you correct something, the AI should ask itself — or ask you — *is this about tone, format, or this one item?* **You can short-circuit it** by adding one sentence of scope: "this post was too wordy — just this one, not a new rule."

**Failure 2: it defaults to timid.** Out of the box, AI copy hedges, anonymizes, and softens. You had to explicitly reject that twice: "name names" (2026-06-30 — *"I am not scared to name names… these are facts"*) and the military rule, which I first wrote as an absolute marketing ban and you had to walk back to "biography is fine, endorsement is not" (2026-07-02). If output ever drifts back toward wellness-fog vagueness or over-hedging, you don't need a long argument — cite the decision: "per name-names."

## Five real "if you say X, here's what happens"

1. **"Add these products"** → the octavius skill fires: a local script fetches everything fetchable for free, ONE Octavius agent researches the misses and decodes labels, ONE Opus reviewer checks it, a script merges. You get a report with `could_not_verify` items listed honestly — that's success, not failure (the alternative was the model that invented barcodes and got banned).
2. **"Write next month's posts"** → content-sprint: Cicero drafts the whole pack in your locked voice, a separate strict Opus evaluator grades every item against the legal/brand checklist (military, logos, medical claims, money-trail sourcing), and you approve/edit — the human pass should be *editing, not rescuing*.
3. **"Fix what we find, and report everything to Sentry"** (you said exactly this, 2026-07-05) → all four silent-failure behaviors in storage got fixed, every silent catch now reports to **Sentry** (the crash-and-error reporting service — your smoke alarm for code), and the one thing that conflicted with standing rules (a fully autonomous fix-it pipeline) was declined with the reason stated and a better alternative offered. That decline is the system working: standing rules survive enthusiasm.
4. **"Make it more professional"** (2026-07-04) → the manager translated a vibe into an engineering audit: five concrete gaps (no tests, monolith screens, no TypeScript, eager-loaded catalog, no pre-submit QA), then started with the cheapest-risk one (tests) — which found a real scoring bug in the dye data the first day. Vague-but-honest briefs are fine; translation is the manager's job.
5. **"Bro learn to zoom"** (2026-07-04, after I misread a screenshot) → became a permanent rule: engagement numbers get verified against WHOSE post they belong to before any strategy conclusion is drawn. Your corrections don't evaporate — the sharp ones become memory files the very same session. That's the flywheel: correct once, encoded forever.

## What to expect from the manager, concretely

- **It reads before it recommends.** Strategy answers assume the decision log, memory, priorities, and vision are loaded. If a recommendation contradicts a settled decision (freemium gate, no-tracking, pricing), it should cite why it's reopening it — or not reopen it at all.
- **It routes.** Your instinct that expensive-model tokens shouldn't do grunt work is encoded (`instructions/efficiency.md`). If you catch the manager doing a long mechanical slog, say "route this."
- **It ends decision turns your way.** ✅ done-list, numbered options, "reply with a number."
- **It teaches.** Real terms, bolded, defined once, then used naturally — you asked to sound like a developer, and the only way there is exposure with translation.
- **It writes things down.** Major context you share → `memory/claude-memory.md` same session. Decisions → decision log. If you tell it something important and don't see it written, ask "did you log that?"

## When to be explicit (the short list)

- Scope of a correction ("just this one" vs. "always").
- Anything involving spending: builds, paid API tiers, new subscriptions.
- Reopening a settled decision (say "I want to revisit X" so it doesn't politely re-litigate on its own).
- Publishing anything externally — nothing posts without your explicit approval, so an ambiguous "looks good" on a draft is not treated as "post it."

Everything else — trust the shorthand. It's earned.
