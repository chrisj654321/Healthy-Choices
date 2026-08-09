# Publishing a catalog update or config change via the remote manifest

As of Phase 2 of `context/plan-decouple-from-apple.md`, the app reads a small
JSON manifest from Supabase Storage before deciding what catalog to
download and what feature flags are active. Editing that one file — no code
change, no app build, no OTA update — is now the normal way to:

- Ship a rebuilt `products.db` to every device.
- Flip a feature flag / kill switch that a screen has wired up to
  `getFlag()` (see `src/utils/remoteConfig.js` — note that as of 2026-08-06
  no screen actually reads a flag yet; the mechanism exists, wiring it into
  real behavior is a separate step).

## Where it lives

Same public "Catalog" bucket in Supabase Storage that `products.db` already
lives in:

```
https://huvxeaegygaeotomdqpc.supabase.co/storage/v1/object/public/Catalog/manifest.json
```

**Live since 2026-08-08.** Before that date the object did not exist and the
app fell back to the hardcoded constants on every launch.

## How to change it (do NOT edit it in the Supabase dashboard)

`scripts/manifest.json` in this repo is the source of truth. Edit that file,
then publish it:

```
node scripts/publish-manifest.js --dry-run   # validate only, no upload
node scripts/publish-manifest.js             # validate, then upload
```

The script applies the same checks the device applies, so a manifest the app
would silently reject fails on your machine instead of shipping. A dashboard
edit works, but it leaves no git history and the next run of this script
overwrites it — so keep every change in the file.

The upload sets a 300-second CDN cache. A change takes up to 5 minutes to
reach devices.

## Manifest shape

```json
{
  "dbVersion": "2026-09-01-1",
  "dbUrl": "https://huvxeaegygaeotomdqpc.supabase.co/storage/v1/object/public/Catalog/products.db",
  "config": {
    "freeScansPerDay": 5
  }
}
```

- `dbVersion` (string, required to take effect) — bump this to anything
  different from the previous value any time you re-upload `products.db`.
  Devices compare this against what they last downloaded and re-download
  only when it changed.
- `dbUrl` (string, required to take effect) — **must** start with
  `https://huvxeaegygaeotomdqpc.supabase.co/storage/v1/object/public/`. A
  `dbUrl` on any other host, or using `http://`, is silently rejected by the
  app (logged to Sentry) and it falls back to the hardcoded
  `REMOTE_DB_URL`/`DB_VERSION` constants in `src/data/productStore.js`
  instead — this is a deliberate safety rail, not a bug, so don't bother
  trying to point it anywhere else.
- `config` (object, optional) — a flat bag of feature flags. Unknown keys
  are ignored; a value whose type doesn't match the in-code default
  (`getFlag('key', defaultValue)`) is also ignored and the default wins, so
  a typo in the dashboard can't silently break a screen expecting a number
  to become a string.

`dbVersion` and `dbUrl` must BOTH be present and valid for the app to use
them — if either is missing/invalid, the app uses the hardcoded fallback for
BOTH, it doesn't mix a remote version with the hardcoded URL or vice versa.

## How to publish a catalog update

1. Rebuild `products.db` (existing process — see
   `scripts/build-products-sqlite.js`).
2. Upload it to the `Catalog` bucket (existing process — see
   `scripts/upload-products-db.js`), same filename or a new one.
3. Edit `manifest.json` in the same bucket:
   - Set `dbVersion` to a new, different string (any convention — the date
     stamp used in `productStore.js`, e.g. `2026-09-01-1`, is fine).
   - Set `dbUrl` to wherever you uploaded the file in step 2.
4. Done. No app release. Devices pick up the new catalog the next time they
   check the manifest (once per app session) and their on-device version
   doesn't match.

If you skip steps 2–3 (upload a new `.db` but never touch the manifest),
devices keep using whatever `dbUrl`/`dbVersion` the manifest already has, or
the hardcoded fallback if there's no manifest at all yet — the upload alone
does nothing.

## Safety behavior (already handled by the app, nothing you need to do)

- If `manifest.json` doesn't exist yet, is unreachable, or is malformed, the
  app falls back to `REMOTE_DB_URL`/`DB_VERSION` hardcoded in
  `productStore.js` and to in-code flag defaults. It never shows a blank or
  broken state.
- The app also persists the last manifest it successfully validated
  (AsyncStorage), so a device that's offline on a later cold start still
  prefers that last-good copy over the hardcoded fallback.
- A first-ever launch with no network works exactly as it does today —
  bundled fallbacks, no manifest fetch required to function.
