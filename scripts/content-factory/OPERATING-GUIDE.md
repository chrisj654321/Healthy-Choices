# Food Exposé Content Factory

This system prepares TikTok-first content for **Food Exposé: Barcode Scanner**. It maintains evidence, approvals, assets, Buffer draft IDs, performance snapshots, and failure history in a local SQLite ledger.

It never schedules or publishes a post automatically.

## One-Time Setup

```powershell
npm run content:init
```

This creates:

- `marketing/factory/content-factory.db`
- `marketing/factory/config.json`
- `marketing/factory/exports/research-brief.json`
- `marketing/factory/exports/input-examples.json`

The generated `marketing/factory/` directory is runtime state and is intentionally excluded from Git.

For live Buffer drafts, set these environment variables locally:

```text
BUFFER_API_KEY=
BUFFER_CHANNEL_ID=
CONTENT_ASSET_BASE_URL=https://your-stable-public-media-host.example/content
```

`CONTENT_ASSET_BASE_URL` must serve direct, public, permanent HTTPS files. Buffer does not accept file uploads or private preview links.

## Weekly Workflow

### 1. Research

Run:

```powershell
npm run content:research
```

Use the `shelf-trendwatch` skill to collect 15-25 public findings into JSON, then import:

```powershell
npm run content:research -- --input C:\path\to\findings.json
```

If research fails, the most recent valid inventory remains available. A failed research week does not erase approved work.

### 2. Evidence

Use `shelf-claim-check`, then import independently reviewable evidence:

```powershell
npm run content:claims -- --input C:\path\to\claims.json
```

Every factual health, ingredient, ownership, lobbying, political, regulatory, or nutrition claim must link to a verified evidence record.

### 3. Concepts

Import concept JSON:

```powershell
npm run content:produce -- --input C:\path\to\concepts.json
```

Open the board:

```powershell
npm run content:board
```

Visit `http://127.0.0.1:4178`. Approving a concept authorizes production only.

### 4. Production

Produce approved concepts:

```powershell
npm run content:produce
```

The default weekly cap is five slideshows and two video briefs. Slides are rendered at 1080x1920 with protected TikTok interface margins. Higgsfield prompts remain subject to founder approval before generation.

Generation spend is guarded by configurable limits in `marketing/factory/config.json`. Defaults are $3 per slideshow, $8 per video, and $30 total across seven days. Record known generation cost with `--generation-cost` when producing a single package.

### 5. Review

Run deterministic QA:

```powershell
npm run content:review
```

Use `shelf-package-review` as a separate reviewer and import its verdict:

```powershell
npm run content:review -- --independent C:\path\to\reviews.json
```

Both checks must pass before the review board allows final founder approval.

### 6. Buffer Drafts

Always inspect a dry run first:

```powershell
npm run content:buffer-drafts -- --dry-run
```

When credentials and public asset URLs are ready:

```powershell
npm run content:buffer-drafts
```

This creates Buffer **drafts** with notification publishing. It does not schedule or publish them. Use notification publishing when TikTok-native audio, effects, or final disclosures must be added in the TikTok app.

### 7. Metrics

Import 2-hour, 24-hour, and 7-day CSV or JSON snapshots:

```powershell
npm run content:metrics -- --input C:\path\to\metrics.csv
```

Running `npm run content:metrics` without an input refreshes the performance report. The target is at least 90% coverage for both 24-hour and 7-day snapshots.

When a Buffer draft is scheduled or posted manually, update the ledger:

```powershell
node scripts/content-factory/cli.js mark-status --id PACKAGE_ID --to scheduled
node scripts/content-factory/cli.js mark-status --id PACKAGE_ID --to posted
```

## Founder Review Block

The weekly founder review should fit within two hours:

1. Approve or reject ranked concepts.
2. Review final slides, captions, claims, sources, rights, disclosures, and generation cost.
3. Approve final packages.
4. Inspect Buffer dry-run output.
5. Add TikTok-native audio/effects during notification publishing when needed.

## Community Replies

Useful reply drafts can be imported into a founder-controlled queue:

```powershell
npm run content:community -- --input C:\path\to\community-tasks.json
```

The review board can approve or reject each draft. Approval only marks it ready to copy into the native social app. The factory never sends comments, replies, likes, follows, or direct messages.

## Recovery and Safety

- Commands are idempotent by content fingerprints, package slugs, and Buffer draft IDs.
- Failures are recorded in the `failures` table.
- `npm run content:backup` creates timestamped database and configuration backups.
- `npm run content:health` checks database integrity, unresolved failures, stalled work, credentials, and metric coverage.
- Re-running a command resumes from ledger state and does not bypass approval gates.
- The review board binds to `127.0.0.1`, so it is not exposed to the network.
- No code automates comments, likes, replies, follows, or fake engagement.
- AI visuals use generic packaging unless product media is founder-created, licensed, or independently cleared.
- Realistic AI videos require TikTok’s AI disclosure. Content promoting Food Exposé requires commercial-content disclosure.

## Verification

```powershell
npm run content:test
npm run content:pilot
```

The pilot creates ten synthetic slideshow packages and four synthetic video briefs in a separate fixture ledger. It stops at `qa_passed` and never authorizes posting.
