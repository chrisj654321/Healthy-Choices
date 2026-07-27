---
name: shelf-performance-review
description: Analyze Food Exposé post metrics at 2 hours, 24 hours, and 7 days and recommend controlled content experiments. Use for weekly performance reviews, monthly pillar decisions, hook comparisons, or coverage audits.
---

# Shelf Performance Review

Base recommendations on actual published results, not generic social-media advice.

## Workflow

1. Import CSV or JSON snapshots with `npm run content:metrics -- --input <file>`.
2. Check that at least 90% of published posts have both 24-hour and 7-day records.
3. Compare views, watch/completion signals, likes, comments, shares, saves, profile visits, link clicks, and attributable downloads.
4. Segment results by pillar, hook, format, CTA, and the declared test variable.
5. Identify the strongest two pillars only after enough 7-day samples exist.
6. Recommend one meaningful variable change per next experiment.

## Rules

- Do not compare raw totals without accounting for views and sample size.
- Flag missing or delayed metrics.
- Keep winners, revise middle performers, and pause weak pillars only after repeated evidence.
- Never automate engagement or community replies.
