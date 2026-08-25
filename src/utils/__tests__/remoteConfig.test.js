/**
 * Characterization tests for src/utils/remoteConfig.js (Phase 2 of
 * context/plan-decouple-from-apple.md).
 *
 * fetchWithTimeout is hand-mocked (same pattern as productStore.test.js's
 * expo-file-system/expo-sqlite mocks — a controllable jest.fn(), not a real
 * network call). AsyncStorage uses the OFFICIAL
 * @react-native-async-storage/async-storage jest mock, same as
 * storage.test.js.
 *
 * remoteConfig.js caches its fetch in a module-level promise, so (like
 * productStore.test.js) every test re-imports the module fresh via
 * jest.isolateModules to avoid state bleeding across tests.
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../fetchWithTimeout', () => ({
  fetchWithTimeout: jest.fn(),
  // Keep the real abort detector — remoteConfig uses it to decide what is
  // Sentry-worthy; mocking it away would defeat the test below.
  isAbortError: jest.requireActual('../fetchWithTimeout').isAbortError,
}));
jest.mock('../sentry', () => ({ captureException: jest.fn() }));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithTimeout } from '../fetchWithTimeout';
import { captureException } from '../sentry';
import { EXPECTED_DB_URL_PREFIX } from '../remoteConfig';

const VALID_DB_URL = `${EXPECTED_DB_URL_PREFIX}Catalog/products.db`;
const CACHE_KEY = '@hc_remote_manifest';

function loadRemoteConfig() {
  let mod;
  jest.isolateModules(() => {
    mod = require('../remoteConfig');
  });
  return mod;
}

function jsonResponse(body, ok = true, status = 200) {
  return { ok, status, json: async () => body };
}

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

// ─── missing / unreachable network ─────────────────────────────────────────

describe('network unreachable', () => {
  test('getRemoteManifest resolves null (never rejects) when fetch rejects and no cache exists', async () => {
    fetchWithTimeout.mockRejectedValue(new Error('network down'));
    const { getRemoteManifest } = loadRemoteConfig();

    await expect(getRemoteManifest()).resolves.toBeNull();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'remoteConfig.loadManifest' })
    );
  });

  test('getRemoteDbConfig resolves null when the network is unreachable', async () => {
    fetchWithTimeout.mockRejectedValue(new Error('network down'));
    const { getRemoteDbConfig } = loadRemoteConfig();

    await expect(getRemoteDbConfig()).resolves.toBeNull();
  });

  test('a non-ok HTTP response is treated as unreachable, falls back the same way', async () => {
    fetchWithTimeout.mockResolvedValue(jsonResponse(null, false, 404));
    const { getRemoteManifest } = loadRemoteConfig();

    await expect(getRemoteManifest()).resolves.toBeNull();
  });

  test('falls back to the last persisted good manifest when the network fails on a later session', async () => {
    const goodManifest = { dbVersion: '2026-09-01-1', dbUrl: VALID_DB_URL, config: { freeScansPerDay: 3 } };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(goodManifest));
    fetchWithTimeout.mockRejectedValue(new Error('network down'));
    const { getRemoteManifest } = loadRemoteConfig();

    await expect(getRemoteManifest()).resolves.toEqual(goodManifest);
  });
});

// ─── expected aborts/cancellations are NOT Sentry noise ─────────────────────

describe('timeout / background cancellations are not reported to Sentry', () => {
  test('a "Fetch request has been canceled" rejection falls back WITHOUT capturing to Sentry', async () => {
    // The exact shape seen in production: the 8s AbortController timeout fires
    // late (JS timers freeze while the app is backgrounded), aborting the
    // manifest fetch. Expected, not a failure.
    fetchWithTimeout.mockRejectedValue(new Error('fetch failed: Fetch request has been canceled'));
    const { getRemoteManifest } = loadRemoteConfig();

    await expect(getRemoteManifest()).resolves.toBeNull();
    expect(captureException).not.toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'remoteConfig.loadManifest' })
    );
  });

  test('a standard AbortError still falls back to the cached manifest, no capture', async () => {
    const goodManifest = { dbVersion: '2026-09-01-1', dbUrl: VALID_DB_URL, config: {} };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(goodManifest));
    const abort = new Error('aborted');
    abort.name = 'AbortError';
    fetchWithTimeout.mockRejectedValue(abort);
    const { getRemoteManifest } = loadRemoteConfig();

    await expect(getRemoteManifest()).resolves.toEqual(goodManifest);
    expect(captureException).not.toHaveBeenCalled();
  });

  test('a genuine network failure is STILL captured (guard did not over-suppress)', async () => {
    fetchWithTimeout.mockRejectedValue(new Error('network down'));
    const { getRemoteManifest } = loadRemoteConfig();

    await expect(getRemoteManifest()).resolves.toBeNull();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'remoteConfig.loadManifest' })
    );
  });
});

// ─── malformed JSON ─────────────────────────────────────────────────────────

describe('malformed JSON', () => {
  test('resolves null (never throws) when response.json() rejects', async () => {
    fetchWithTimeout.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });
    const { getRemoteManifest } = loadRemoteConfig();

    await expect(getRemoteManifest()).resolves.toBeNull();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'remoteConfig.loadManifest' })
    );
  });
});

// ─── wrong types ────────────────────────────────────────────────────────────

describe('wrong types in an otherwise-parseable manifest', () => {
  test('a non-string dbVersion is nulled out, config still comes through', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({ dbVersion: 12345, dbUrl: VALID_DB_URL, config: { freeScansPerDay: 3 } })
    );
    const { getRemoteManifest, getRemoteDbConfig, getFlag } = loadRemoteConfig();

    const manifest = await getRemoteManifest();
    expect(manifest.dbVersion).toBeNull();
    // getRemoteDbConfig requires BOTH fields valid to override.
    await expect(getRemoteDbConfig()).resolves.toBeNull();
    await expect(getFlag('freeScansPerDay', 5)).resolves.toBe(3);
  });

  test('a non-object config (array) is defaulted to {} instead of used as-is', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({ dbVersion: '2026-09-01-1', dbUrl: VALID_DB_URL, config: ['not', 'an', 'object'] })
    );
    const { getRemoteManifest } = loadRemoteConfig();

    const manifest = await getRemoteManifest();
    expect(manifest.config).toEqual({});
  });

  test('a completely non-object top-level manifest is rejected outright', async () => {
    fetchWithTimeout.mockResolvedValue(jsonResponse('just a string, not an object'));
    const { getRemoteManifest } = loadRemoteConfig();

    await expect(getRemoteManifest()).resolves.toBeNull();
  });

  test('a null top-level manifest is rejected outright', async () => {
    fetchWithTimeout.mockResolvedValue(jsonResponse(null));
    const { getRemoteManifest } = loadRemoteConfig();

    await expect(getRemoteManifest()).resolves.toBeNull();
  });
});

// ─── dbUrl host validation ──────────────────────────────────────────────────

describe('dbUrl host validation', () => {
  test('rejects a dbUrl on an unexpected host', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({
        dbVersion: '2026-09-01-1',
        dbUrl: 'https://evil.example.com/products.db',
        config: {},
      })
    );
    const { getRemoteManifest, getRemoteDbConfig } = loadRemoteConfig();

    const manifest = await getRemoteManifest();
    expect(manifest.dbUrl).toBeNull();
    await expect(getRemoteDbConfig()).resolves.toBeNull();
  });

  test('rejects a non-https dbUrl even on the right host', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({
        dbVersion: '2026-09-01-1',
        dbUrl: VALID_DB_URL.replace('https://', 'http://'),
        config: {},
      })
    );
    const { getRemoteManifest } = loadRemoteConfig();

    const manifest = await getRemoteManifest();
    expect(manifest.dbUrl).toBeNull();
  });

  test('rejects a non-string dbUrl', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({ dbVersion: '2026-09-01-1', dbUrl: 12345, config: {} })
    );
    const { getRemoteManifest } = loadRemoteConfig();

    const manifest = await getRemoteManifest();
    expect(manifest.dbUrl).toBeNull();
  });
});

// ─── valid manifest overriding the defaults ────────────────────────────────

describe('valid manifest overrides the defaults', () => {
  test('getRemoteDbConfig returns the manifest dbVersion/dbUrl when both are valid', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({ dbVersion: '2026-09-01-1', dbUrl: VALID_DB_URL, config: {} })
    );
    const { getRemoteDbConfig } = loadRemoteConfig();

    await expect(getRemoteDbConfig()).resolves.toEqual({
      dbVersion: '2026-09-01-1',
      dbUrl: VALID_DB_URL,
    });
  });

  test('getFlag returns the remote value when present and correctly typed', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({ dbVersion: '2026-09-01-1', dbUrl: VALID_DB_URL, config: { freeScansPerDay: 10, killSwitchScanning: true } })
    );
    const { getFlag } = loadRemoteConfig();

    await expect(getFlag('freeScansPerDay', 5)).resolves.toBe(10);
    await expect(getFlag('killSwitchScanning', false)).resolves.toBe(true);
  });

  test('getFlag falls back to the default when the remote value has the wrong type', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({ dbVersion: '2026-09-01-1', dbUrl: VALID_DB_URL, config: { freeScansPerDay: 'ten' } })
    );
    const { getFlag } = loadRemoteConfig();

    await expect(getFlag('freeScansPerDay', 5)).resolves.toBe(5);
  });

  test('only fetches once per session even when called from multiple sites', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({ dbVersion: '2026-09-01-1', dbUrl: VALID_DB_URL, config: {} })
    );
    const { getRemoteManifest, getRemoteDbConfig, getFlag } = loadRemoteConfig();

    await Promise.all([getRemoteManifest(), getRemoteDbConfig(), getFlag('x', 1)]);

    expect(fetchWithTimeout).toHaveBeenCalledTimes(1);
  });

  test('persists a valid manifest to AsyncStorage as the new last-good cache', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({ dbVersion: '2026-09-01-1', dbUrl: VALID_DB_URL, config: { freeScansPerDay: 7 } })
    );
    const { getRemoteManifest } = loadRemoteConfig();

    await getRemoteManifest();

    const cached = await AsyncStorage.getItem(CACHE_KEY);
    expect(JSON.parse(cached)).toEqual({
      dbVersion: '2026-09-01-1',
      dbUrl: VALID_DB_URL,
      config: { freeScansPerDay: 7 },
    });
  });
});

// ─── flag defaults when config is absent ───────────────────────────────────

describe('flag defaults when config is absent', () => {
  test('getFlag returns the default when the manifest has no config object at all', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({ dbVersion: '2026-09-01-1', dbUrl: VALID_DB_URL })
    );
    const { getFlag } = loadRemoteConfig();

    await expect(getFlag('freeScansPerDay', 5)).resolves.toBe(5);
  });

  test('getFlag returns the default when the manifest is entirely unavailable', async () => {
    fetchWithTimeout.mockRejectedValue(new Error('network down'));
    const { getFlag } = loadRemoteConfig();

    await expect(getFlag('freeScansPerDay', 5)).resolves.toBe(5);
    await expect(getFlag('killSwitchScanning', false)).resolves.toBe(false);
  });

  test('getFlag returns the default for a key not present in a valid config', async () => {
    fetchWithTimeout.mockResolvedValue(
      jsonResponse({ dbVersion: '2026-09-01-1', dbUrl: VALID_DB_URL, config: { otherFlag: true } })
    );
    const { getFlag } = loadRemoteConfig();

    await expect(getFlag('freeScansPerDay', 5)).resolves.toBe(5);
  });
});
