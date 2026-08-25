---
name: shelf-trendwatch
description: Research weekly public TikTok content patterns for Food Exposé and produce structured, source-linked findings. Use when asked to find trends, refresh the weekly idea inventory, analyze competitor formats, or prepare inputs for content:research.
---

# Shelf Trendwatch

Research formats and audience questions, not scripts to copy.

## Workflow

1. Run `npm run content:research` to create the current research brief.
2. Review low-volume public posts from food scanners, label educators, family-shopping creators, consumer-transparency accounts, and Food Exposé.
3. Capture the exact source URL, account, date, hook, format, visual structure, public signals, useful comment themes, and why the pattern fits the brand.
4. Score the required 0-5 fields from the brief. Treat public counts as directional signals, not proof of conversions.
5. Reject stale, unrelated, unsourceable, rights-unclear, or overly derivative findings.
6. Save 15-25 findings as JSON and import with:
   `npm run content:research -- --input <file>`

## Rules

- Do not scrape at scale or automate account actions.
- Do not copy a creator's wording, scenes, or distinctive visual identity.
- Every record needs a public source URL.
- Separate observed facts from your interpretation.
- If research is unavailable, report the failure; the factory will retain its last valid inventory.
