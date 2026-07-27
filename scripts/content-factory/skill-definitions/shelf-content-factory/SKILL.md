---
name: shelf-content-factory
description: Orchestrate the complete Food Exposé weekly content workflow across research, evidence, concept approval, production, independent review, founder approval, Buffer drafts, and measurement. Use when asked to run or inspect the content factory or prepare a full content week.
---

# Shelf Content Factory

Coordinate the specialist skills and preserve every approval boundary.

## Weekly Run

1. Initialize once with `npm run content:init`.
2. Invoke `shelf-trendwatch`; import findings with `content:research`.
3. Invoke `shelf-claim-check`; import evidence with `content:claims`.
4. Present ranked concepts to the founder. Approval authorizes production only.
5. Invoke `shelf-carousel-builder`; produce up to five slideshows and two video briefs.
6. Run deterministic QA, then invoke `shelf-package-review` as an independent reviewer.
7. Start `npm run content:board` for founder final approval.
8. Run `npm run content:buffer-drafts -- --dry-run` first. Create live Buffer drafts only after credentials and stable public asset URLs are configured.
9. Invoke `shelf-performance-review` after 2h, 24h, and 7d metrics arrive.
10. Import helpful community reply drafts with `content:community`; founder approval only marks them ready for manual native-app replies.

## Hard Gates

- Never skip evidence for factual health or political claims.
- Never generate before concept approval.
- Never founder-approve before deterministic and independent QA pass.
- Never send an unapproved package to Buffer.
- Buffer handoff creates drafts only; it does not schedule or publish.
- Never automate comments, likes, replies, follows, or deceptive engagement.
- Record failures and resume from ledger state instead of duplicating work.
