---
name: shelf-claim-check
description: Verify health, ingredient, ownership, lobbying, political, regulatory, and nutrition claims for Food Exposé marketing. Use before factual concepts are produced or whenever a post needs evidence, source renewal, rights review, or medical-claim risk checking.
---

# Shelf Claim Check

Create evidence records that another reviewer can audit.

## Workflow

1. Extract each independently checkable statement. Do not combine several claims into one record.
2. Search current primary sources first: regulators, peer-reviewed papers, company filings, FEC records, lobbying disclosures, and official product labels.
3. Record the exact source URL, title, publisher, publication/access dates, a short supporting excerpt, claim type, and expiry date when the fact can change.
4. Mark a claim `verified` only when the evidence directly supports the wording. Include reviewer and review timestamp.
5. Use cautious association language for observational health evidence. Never turn association into causation.
6. Save JSON and import with:
   `npm run content:claims -- --input <file>`

## Rules

- Never invent citations, headlines, percentages, or regulatory status.
- Flag contested evidence, dose/context limitations, and stale political data.
- Product photos need founder-created, licensed, or independently cleared rights.
- AI generic packaging must not imitate a recognizable branded product.
- The evidence checker must not perform the final package review.
