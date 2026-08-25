/**
 * remoteConfig.js
 *
 * Small JSON manifest fetched from Supabase Storage (same public-bucket
 * pattern `src/data/productStore.js` already uses for `products.db`) that
 * carries two things:
 *   1. The current catalog's { dbVersion, dbUrl } — lets us ship a new
 *      products.db by uploading a file + editing this manifest, with no JS
 *      change (see context/plan-decouple-from-apple.md Phase 2).
 *   2. A `config` bag of remote feature flags/kill switches, read through
 *      `getFlag(key, defaultValue)` with an in-code default for every flag.
 *
 * See scripts/catalog-database/README-remote-manifest.md for the manifest JSON shape and
 * publish steps.
 *
 * Contract (mirrors productStore.js's "must never throw" rule):
 *   - No exported function ever throws or rejects.
 *   - The manifest is untrusted input: every field is type-checked before
 *     use, unknown keys are ignored, and a `dbUrl` that isn't an https URL
 *     under the expected Supabase Storage prefix is refused outright (never
 *     let a malformed/hostile manifest point the app at an arbitrary host).
 *   - Fetched once per app session (module-level cached promise, same
 *     pattern as productStore.js's `_initPromise`) and the last good,
 *     validated copy is persisted to AsyncStorage so a later cold start with
 *     no network still has *something* better than pure in-code defaults.
 *   - Any failure (unreachable, malformed JSON, fully invalid shape) reports
 *     to Sentry via captureException and degrades to the persisted cache,
 *     then to null/defaults — never a blank state, never a thrown error.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithTimeout, isAbortError } from './fetchWithTimeout';
import { captureException } from './sentry';

// Hosted in the same "Catalog" Supabase Storage bucket as REMOTE_DB_URL
// (see productStore.js). Publish a new catalog by uploading products.db and
// editing this manifest — no app release required.
export const REMOTE_CONFIG_URL =
  'https://huvxeaegygaeotomdqpc.supabase.co/storage/v1/object/public/Catalog/manifest.json';

// Any dbUrl the manifest points at MUST start with this prefix — the public
// Supabase Storage host for our project. Anything else (a different host,
// http instead of https, a bare path) is refused so a compromised/malformed
// manifest can't redirect the app's catalog download to an arbitrary server.
export const EXPECTED_DB_URL_PREFIX =
  'https://huvxeaegygaeotomdqpc.supabase.co/storage/v1/object/public/';

const MANIFEST_CACHE_KEY = '@hc_remote_manifest';

// Module-level cached fetch promise — shared across every caller so the
// network hit only ever happens once per app session, same pattern as
// productStore.js's _initPromise.
let _manifestPromise = null;

function isValidDbUrl(url) {
  return (
    typeof url === 'string' &&
    url.startsWith(EXPECTED_DB_URL_PREFIX) &&
    url.length > EXPECTED_DB_URL_PREFIX.length
  );
}

/**
 * Validates+narrows a raw parsed-JSON manifest into our trusted shape.
 * Returns null only when `raw` isn't even a plausible manifest object
 * (missing/wrong top-level type) — individual bad fields (a bad dbUrl, a
 * non-string dbVersion, a non-object config) are nulled/defaulted
 * individually instead of invalidating the whole manifest, so e.g. a bad
 * dbUrl doesn't also take out perfectly good feature flags.
 */
function validateManifest(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

  const dbVersion = typeof raw.dbVersion === 'string' && raw.dbVersion.trim() ? raw.dbVersion : null;
  const dbUrl = isValidDbUrl(raw.dbUrl) ? raw.dbUrl : null;
  const config =
    raw.config && typeof raw.config === 'object' && !Array.isArray(raw.config) ? raw.config : {};

  return { dbVersion, dbUrl, config };
}

async function fetchManifestFromNetwork() {
  const response = await fetchWithTimeout(REMOTE_CONFIG_URL);
  if (!response.ok) {
    throw new Error(`remote config fetch failed with status ${response.status}`);
  }
  return await response.json();
}

async function loadLastGoodManifestFromCache() {
  const raw = await AsyncStorage.getItem(MANIFEST_CACHE_KEY);
  if (!raw) return null;
  return validateManifest(JSON.parse(raw));
}

async function loadManifest() {
  try {
    const raw = await fetchManifestFromNetwork();
    const validated = validateManifest(raw);
    if (!validated) throw new Error('remote manifest failed shape validation');

    // Best-effort persistence — a failure here shouldn't fail this fetch,
    // it just means the next cold start with no network has less to fall
    // back on.
    try {
      await AsyncStorage.setItem(MANIFEST_CACHE_KEY, JSON.stringify(validated));
    } catch (cacheWriteError) {
      captureException(cacheWriteError, { function: 'remoteConfig.loadManifest.cacheWrite' });
    }

    return validated;
  } catch (error) {
    // A timeout/background abort — our own AbortController firing, or the OS
    // canceling the request when the app is backgrounded — is an EXPECTED
    // condition, not a failure: we fall back to the cached manifest below
    // either way. Reporting it to Sentry at error level is pure noise that
    // buries real failures, so skip the capture for aborts/cancellations.
    if (!isAbortError(error)) {
      captureException(error, { function: 'remoteConfig.loadManifest' });
    }

    try {
      return await loadLastGoodManifestFromCache();
    } catch (cacheReadError) {
      captureException(cacheReadError, { function: 'remoteConfig.loadManifest.cacheRead' });
      return null;
    }
  }
}

/**
 * Idempotent — safe to call from multiple sites; only fetches once per app
 * session. Never rejects: resolves to a validated manifest object, or null
 * if the network is unreachable/malformed AND no persisted cache exists.
 */
export function getRemoteManifest() {
  if (!_manifestPromise) {
    _manifestPromise = loadManifest();
  }
  return _manifestPromise;
}

/**
 * Returns { dbVersion, dbUrl } from the remote manifest, or null if the
 * manifest is unavailable or doesn't carry a valid pair of both fields.
 * Callers (productStore.js) are expected to fall back to their own
 * hardcoded constants when this resolves null — this function never throws.
 */
export async function getRemoteDbConfig() {
  try {
    const manifest = await getRemoteManifest();
    if (!manifest || !manifest.dbVersion || !manifest.dbUrl) return null;
    return { dbVersion: manifest.dbVersion, dbUrl: manifest.dbUrl };
  } catch (error) {
    captureException(error, { function: 'remoteConfig.getRemoteDbConfig' });
    return null;
  }
}

/**
 * Typed remote feature-flag accessor. `defaultValue` is both the in-code
 * fallback AND the expected type — if the manifest's config carries a value
 * for `key` whose typeof doesn't match defaultValue's, the remote value is
 * ignored and the default wins (a flag can never change type from a
 * dashboard edit and silently break a caller expecting a number/boolean).
 *
 * Not wired into any feature's real behavior yet (2026-08-06) — this is the
 * mechanism only. Never throws.
 *
 * @example getFlag('freeScansPerDay', 5)
 */
export async function getFlag(key, defaultValue) {
  try {
    const manifest = await getRemoteManifest();
    const value = manifest?.config?.[key];
    if (value === undefined || value === null) return defaultValue;
    if (typeof value !== typeof defaultValue) return defaultValue;
    return value;
  } catch (error) {
    captureException(error, { function: 'remoteConfig.getFlag', key });
    return defaultValue;
  }
}
