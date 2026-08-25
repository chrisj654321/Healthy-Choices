/**
 * Tests for src/utils/appAnalytics.js — the funnel + retention layer added
 * 2026-07-27 (founder-approved reversal of the 2026-07-02 "no persistent
 * identifier" stance, scoped to this table only — see the file header).
 *
 * Covers the load-bearing anonymity/correctness guarantees:
 *   - install_id is generated once and stable across calls (retention only
 *     works if this never changes for the life of the install)
 *   - session_id differs per launch (module reload), so cross-session
 *     retention and in-session funnels can be told apart
 *   - non-whitelisted event names are dropped before any network call
 *   - a failed/offline insert never throws (fire-and-forget contract)
 *   - no call path can ever attach a user id — the anonymity contract this
 *     whole module exists to keep, asserted directly on the inserted row
 *
 * expo-crypto's native module isn't available under Jest, so it's mocked
 * with a deterministic sequence generator (same shape as sentry.test.js's
 * getter-based mocks for expo-application) rather than relying on the
 * pure-JS Math.random fallback baked into appAnalytics.js itself — that
 * fallback is exercised separately below by making the mock throw.
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockApp = { nativeApplicationVersion: '1.2.0' };
jest.mock('expo-application', () => ({
  get nativeApplicationVersion() { return mockApp.nativeApplicationVersion; },
}));

// Deterministic, ordered UUIDs so tests can assert on exact values instead
// of just "truthy". Reset via resetCryptoMock() at the top of each test.
// Stashed on `global` (rather than closed-over module variables) because
// jest.mock()'s factory is hoisted above other declarations and may only
// reference out-of-scope identifiers prefixed `mock` — global is the
// escape hatch for everything else.
jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(() => {
    global.__uuidCallCount = (global.__uuidCallCount || 0) + 1;
    const queue = global.__uuidQueue || [];
    return queue.length ? queue.shift() : `generated-${global.__uuidCallCount}`;
  }),
}));

function resetCryptoMock(queue = []) {
  global.__uuidQueue = [...queue];
  global.__uuidCallCount = 0;
}

// Point supabase.from('app_events').insert([...]) at a controllable result.
function mockInsertResult(result) {
  const insert = jest.fn().mockResolvedValue(result);
  const { supabase } = require('../supabase');
  supabase.from.mockReturnValue({ insert });
  return insert;
}

describe('appAnalytics', () => {
  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();
    resetCryptoMock();
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    await AsyncStorage.clear();
    mockInsertResult({ error: null });
  });

  // ── install_id ──────────────────────────────────────────────────────────

  test('getInstallId() generates a fresh id once, then stays stable across calls', async () => {
    resetCryptoMock(['install-id-aaaa']);
    const { getInstallId } = require('../appAnalytics');

    const first  = await getInstallId();
    const second = await getInstallId();
    const third  = await getInstallId();

    expect(first).toBe('install-id-aaaa');
    expect(second).toBe(first);
    expect(third).toBe(first);
  });

  test('getInstallId() writes the generated id to AsyncStorage under the persisted key', async () => {
    resetCryptoMock(['install-id-bbbb']);
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const { getInstallId } = require('../appAnalytics');

    const id = await getInstallId();

    expect(id).toBe('install-id-bbbb');
    expect(await AsyncStorage.getItem('@hc_install_id')).toBe('install-id-bbbb');
  });

  test('getInstallId() reuses a value ALREADY in AsyncStorage instead of generating a new one — this is what makes it survive a real relaunch', async () => {
    // jest's async-storage mock is an in-memory singleton that itself does
    // not survive jest.resetModules(), so a real relaunch is simulated here
    // by manually seeding a fresh module load's storage with the value a
    // previous launch would have written to the real on-device store —
    // exercising the exact "read persisted value before generating" branch
    // that's what actually makes the id stable across app launches.
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    await AsyncStorage.setItem('@hc_install_id', 'install-id-from-a-previous-launch');

    resetCryptoMock(['should-never-be-used']);
    const { getInstallId } = require('../appAnalytics');

    const id = await getInstallId();

    expect(id).toBe('install-id-from-a-previous-launch');
    const Crypto = require('expo-crypto');
    expect(Crypto.randomUUID).not.toHaveBeenCalled();
  });

  test('concurrent getInstallId() calls never generate two different ids', async () => {
    resetCryptoMock(['install-id-cccc', 'install-id-should-not-be-used']);
    const { getInstallId } = require('../appAnalytics');

    const [a, b] = await Promise.all([getInstallId(), getInstallId()]);
    expect(a).toBe('install-id-cccc');
    expect(b).toBe('install-id-cccc');
  });

  test('falls back to a locally-generated id (never throws) if the native UUID call fails', async () => {
    const Crypto = require('expo-crypto');
    Crypto.randomUUID.mockImplementation(() => { throw new Error('native module unavailable'); });
    const { getInstallId } = require('../appAnalytics');

    const id = await getInstallId();
    // Fallback UUID shape: 8-4-4-4-12 hex, version 4.
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  // ── session_id ───────────────────────────────────────────────────────────

  test('getSessionId() is stable within one module load ("one launch")', () => {
    resetCryptoMock(['session-id-1111', 'should-not-be-used']);
    const { getSessionId } = require('../appAnalytics');

    expect(getSessionId()).toBe('session-id-1111');
    expect(getSessionId()).toBe('session-id-1111');
  });

  test('getSessionId() differs across two module loads ("two launches")', () => {
    resetCryptoMock(['session-id-AAAA']);
    const firstLoad = require('../appAnalytics');
    const sessionFromFirstLaunch = firstLoad.getSessionId();

    jest.resetModules();
    resetCryptoMock(['session-id-BBBB']);
    const secondLoad = require('../appAnalytics');
    const sessionFromSecondLaunch = secondLoad.getSessionId();

    expect(sessionFromFirstLaunch).toBe('session-id-AAAA');
    expect(sessionFromSecondLaunch).toBe('session-id-BBBB');
    expect(sessionFromSecondLaunch).not.toBe(sessionFromFirstLaunch);
  });

  // ── event whitelist ──────────────────────────────────────────────────────

  test('drops a non-whitelisted event name without calling supabase at all', async () => {
    resetCryptoMock(['install-id', 'session-id']);
    const { logAppEvent } = require('../appAnalytics');
    const { supabase } = require('../supabase');

    await logAppEvent('some_made_up_event_name');

    expect(supabase.from).not.toHaveBeenCalled();
  });

  test.each([
    'app_open', 'app_backgrounded', 'onboarding_step', 'first_scan',
    'paywall_shown', 'paywall_dismissed', 'purchase_started', 'purchase_completed',
  ])('logs the whitelisted event %s', async (eventName) => {
    resetCryptoMock(['install-id', 'session-id']);
    const insert = mockInsertResult({ error: null });
    const { logAppEvent } = require('../appAnalytics');

    await logAppEvent(eventName);

    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert.mock.calls[0][0][0]).toMatchObject({ event: eventName });
  });

  // ── never throws ─────────────────────────────────────────────────────────

  test('a rejected/offline insert never throws', async () => {
    resetCryptoMock(['install-id', 'session-id']);
    const { supabase } = require('../supabase');
    supabase.from.mockReturnValue({ insert: jest.fn().mockRejectedValue(new Error('network down')) });
    const { logAppEvent } = require('../appAnalytics');

    await expect(logAppEvent('app_open')).resolves.toBeUndefined();
  });

  test('an insert that resolves with a Supabase error (e.g. RLS misconfig) never throws', async () => {
    resetCryptoMock(['install-id', 'session-id']);
    mockInsertResult({ error: { message: 'row-level security violation' } });
    const { logAppEvent } = require('../appAnalytics');

    await expect(logAppEvent('app_open')).resolves.toBeUndefined();
  });

  test('logFirstScanIfNeeded() never throws even if storage and network both fail', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage broken'));
    const { logFirstScanIfNeeded } = require('../appAnalytics');

    await expect(logFirstScanIfNeeded()).resolves.toBeUndefined();
  });

  // ── anonymity contract: no identity-adjacent field on any inserted row ──

  test('no call path attaches a user_id (or any identity field) to the inserted row', async () => {
    resetCryptoMock(['install-id', 'session-id']);
    const insert = mockInsertResult({ error: null });
    const { logAppEvent } = require('../appAnalytics');

    await logAppEvent('app_open');
    await logAppEvent('onboarding_step', { step: 'welcome' });
    await logAppEvent('paywall_shown', { step: 'company' });
    await logAppEvent('purchase_completed', { step: 'company' });

    for (const call of insert.mock.calls) {
      const row = call[0][0];
      expect(row).not.toHaveProperty('user_id');
      expect(row).not.toHaveProperty('email');
      expect(row).not.toHaveProperty('name');
      expect(row).not.toHaveProperty('ip');
      expect(row).not.toHaveProperty('idfa');
      expect(row).not.toHaveProperty('idfv');
      expect(row).not.toHaveProperty('device_id');
      // Every row's keys are exactly the app_events_setup.sql column set
      // (minus id/created_at, which the DB fills in) — nothing extra sneaks in.
      expect(Object.keys(row).sort()).toEqual([
        'app_version', 'days_since_last_open', 'event',
        'install_id', 'platform', 'session_id', 'step',
      ]);
    }
  });

  test('the same install_id is reused across every event in a session', async () => {
    resetCryptoMock(['shared-install-id']);
    const insert = mockInsertResult({ error: null });
    const { logAppEvent } = require('../appAnalytics');

    await logAppEvent('app_open');
    await logAppEvent('first_scan');
    await logAppEvent('paywall_shown', { step: 'scan' });

    const installIds = insert.mock.calls.map((call) => call[0][0].install_id);
    expect(new Set(installIds).size).toBe(1);
    expect(installIds[0]).toBe('shared-install-id');
  });

  // ── step qualifier ───────────────────────────────────────────────────────

  test('passes step through when given, and null when omitted', async () => {
    resetCryptoMock(['install-id', 'session-id']);
    const insert = mockInsertResult({ error: null });
    const { logAppEvent } = require('../appAnalytics');

    await logAppEvent('onboarding_step', { step: 'transparency' });
    await logAppEvent('app_open');

    expect(insert.mock.calls[0][0][0].step).toBe('transparency');
    expect(insert.mock.calls[1][0][0].step).toBeNull();
  });

  // ── days_since_last_open ─────────────────────────────────────────────────

  test('days_since_last_open is null on the very first app_open (nothing to compare against)', async () => {
    resetCryptoMock(['install-id', 'session-id']);
    const insert = mockInsertResult({ error: null });
    const { logAppEvent } = require('../appAnalytics');

    await logAppEvent('app_open');

    expect(insert.mock.calls[0][0][0].days_since_last_open).toBeNull();
  });

  test('days_since_last_open is null for events other than app_open', async () => {
    resetCryptoMock(['install-id', 'session-id']);
    const insert = mockInsertResult({ error: null });
    const { logAppEvent } = require('../appAnalytics');

    await logAppEvent('paywall_shown', { step: 'scan' });

    expect(insert.mock.calls[0][0][0].days_since_last_open).toBeNull();
  });

  test('days_since_last_open reflects elapsed time on a later app_open', async () => {
    resetCryptoMock(['install-id', 'session-id']);
    const insert = mockInsertResult({ error: null });
    const { logAppEvent } = require('../appAnalytics');

    const realNow = Date.now;
    let now = new Date('2026-07-01T00:00:00Z').getTime();
    Date.now = () => now;

    await logAppEvent('app_open'); // day 0 — nothing to compare against yet

    now = new Date('2026-07-04T00:00:00Z').getTime(); // +3 days
    await logAppEvent('app_open');

    Date.now = realNow;

    expect(insert.mock.calls[0][0][0].days_since_last_open).toBeNull();
    expect(insert.mock.calls[1][0][0].days_since_last_open).toBe(3);
  });

  // ── first_scan: exactly once per install ────────────────────────────────

  test('logFirstScanIfNeeded() logs exactly once even when called repeatedly (once per install)', async () => {
    resetCryptoMock(['install-id', 'session-id']);
    const insert = mockInsertResult({ error: null });
    const { logFirstScanIfNeeded } = require('../appAnalytics');

    await logFirstScanIfNeeded();
    await logFirstScanIfNeeded();
    await logFirstScanIfNeeded();

    const firstScanInserts = insert.mock.calls.filter((call) => call[0][0].event === 'first_scan');
    expect(firstScanInserts).toHaveLength(1);
  });

  test('logFirstScanIfNeeded() is a no-op when the persisted flag is already set — this is what makes "once per install" survive a relaunch', async () => {
    // Same reasoning as the install_id relaunch test above: seed a fresh
    // module load's storage with the flag a previous launch would already
    // have written, rather than relying on jest's in-memory AsyncStorage
    // mock (which doesn't itself survive jest.resetModules()) to persist it.
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    await AsyncStorage.setItem('@hc_first_scan_logged', 'true');

    resetCryptoMock(['install-id', 'session-id']);
    const { supabase } = require('../supabase');
    const { logFirstScanIfNeeded } = require('../appAnalytics');

    await logFirstScanIfNeeded();

    expect(supabase.from).not.toHaveBeenCalled();
  });
});
