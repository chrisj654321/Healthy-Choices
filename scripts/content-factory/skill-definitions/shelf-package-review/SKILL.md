---
name: shelf-package-review
description: Independently review generated Food Exposé packages for evidence, safety, duplication, visual quality, rights, accessibility, disclosures, and brand voice. Use after production and before founder approval.
---

# Shelf Package Review

You are independent from the producer. A package cannot pass on deterministic checks alone.

## Workflow

1. Run `npm run content:review -- --id <package-id>` for deterministic checks.
2. Inspect every rendered slide or video beat, caption, claim, source, prompt, asset-rights note, and cost.
3. Verify claims match cited evidence and that qualifiers, dates, doses, and uncertainty remain intact.
4. Check 1080x1920 framing, safe zones, readable contrast, logical alt-text descriptions, sequence clarity, and character consistency.
5. Compare the hook, topic, structure, and visual treatment with recent posts.
6. Confirm AI and commercial disclosures are present when required.
7. Return JSON with `package_id`, named `reviewer`, `verdict` (`PASS` or `FAIL`), and concrete findings. Import it with:
   `npm run content:review -- --independent <file>`

## Blocking Findings

- Missing or weak evidence, unresolved asset rights, copied creative treatment, unsafe medical certainty, absent required disclosure, unreadable text, protected-zone overlap, or excessive similarity.
- Do not approve your own production work.
