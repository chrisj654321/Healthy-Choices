# Dev glossary — canonical definitions

Purpose: keep the wording of each definition the same every time. Repetition only works if the sentence does not change.

Rule (see [CLAUDE.md](../CLAUDE.md) "How to teach a term"): define a term the first time it appears in each session, then use a short bracketed gloss for the rest of that session. Add a new row here the first time a term is used with the founder.

Format: **term** — one plain sentence. *Short gloss:* the 3-6 word version. *Seen in:* where it came up.

---

## Release and build

**Native build** — a new copy of the app compiled from source, which Apple must review before users get it. *Short gloss:* new app file, Apple must review. *Seen in:* the decouple-from-Apple plan.

**OTA update (over-the-air)** — a JavaScript-only change pushed straight to installed apps, with no Apple review. *Short gloss:* JS-only push, no Apple review. *Seen in:* `expo-updates` work.

**Runtime version** — a label that says which native build an OTA update is allowed to land on. An update only reaches apps with a matching label. *Short gloss:* which build an update fits. *Seen in:* `app.json`.

**Channel** — the named lane an OTA update is published to, so a test build and a store build can get different updates. *Short gloss:* named lane for updates. *Seen in:* EAS config.

**EAS** — Expo Application Services, the hosted service that compiles the native build and sends it to Apple. *Short gloss:* Expo's build and submit service. *Seen in:* `eas build` / `eas submit`.

**TestFlight** — Apple's service for giving a build to testers before it goes on the store. *Short gloss:* Apple's pre-release testing app.

## Data and storage

**Catalog** — our SQLite product database, downloaded by the app instead of being compiled into it. *Short gloss:* the downloadable product database. *Seen in:* `src/data/productStore.js`.

**SQLite** — a database that lives in a single file, with no server. *Short gloss:* single-file database, no server. *Seen in:* the catalog.

**Manifest** — a small JSON file the app reads first to learn where the real data is and which version to take. *Short gloss:* small file pointing at the data. *Seen in:* `src/utils/remoteConfig.js`.

**Schema** — the agreed shape of a record: which fields exist and what type each one is. *Short gloss:* the agreed shape of the data. *Seen in:* `products.js`.

**Migration** — a scripted change that moves existing data to a new schema without losing it. *Short gloss:* scripted upgrade of stored data.

**Dedupe** — remove records that describe the same real thing under different keys. *Short gloss:* remove duplicate records. *Seen in:* the OFF/curated duplicate fix.

**Cache** — a local copy of data kept to avoid fetching it again. *Short gloss:* saved copy, avoids refetching. *Seen in:* `ingredientCache.js`.

## Code behaviour

**Regression** — something that used to work and broke because of a later change. *Short gloss:* a fix that broke something else. *Seen in:* the back button and tab bar collision.

**Fallback** — the safe value used when the preferred source fails. *Short gloss:* the safe backup value. *Seen in:* `resolveDbConfig()`.

**Deterministic** — the same input always gives the same output, so a rerun changes nothing. *Short gloss:* same input, same output, always. *Seen in:* the screenshot compositor script.

**Validator** — code that checks incoming data and refuses anything the wrong shape. *Short gloss:* checks data before it is used. *Seen in:* `paywallContent.js`.

**Allowlist** — a fixed list of permitted values; anything not on the list is rejected. *Short gloss:* only these values are allowed. *Seen in:* the paywall icon check.

**Insets (safe area)** — the space at the top and bottom of the screen that the notch and the home bar occupy. *Short gloss:* space the notch and home bar take. *Seen in:* `BackButton.js`.

**Remote config** — settings held on a server so they can change without a new build. *Short gloss:* server-held settings, no build needed. *Seen in:* `src/utils/remoteConfig.js`.

**Feature flag** — a remote on/off switch for one piece of behaviour. *Short gloss:* remote on/off switch. *Seen in:* `getFlag()`.

## Money and store

**Paywall** — the screen that asks the user to subscribe. *Short gloss:* the subscribe screen.

**Offering** — RevenueCat's name for the set of subscription options shown together on one paywall. *Short gloss:* the set of plans shown together.

**Metadata (RevenueCat)** — free-form key/value data attached to an offering, which the app can read to change text without a build. *Short gloss:* editable text attached to an offering.

**Entitlement** — the named permission a paid user holds, which the app checks instead of checking the product they bought. *Short gloss:* the named "Pro access" permission.
