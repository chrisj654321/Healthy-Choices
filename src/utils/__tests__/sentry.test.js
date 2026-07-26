/**
 * Tests for src/utils/sentry.js — specifically the release/dist/OTA-tag wiring
 * added 2026-07-26.
 *
 * Why this file exists: on 2026-07-23 through 07-26, Sentry kept receiving the
 * `setUserName` ReferenceError that had already been fixed in ff411a0, and
 * there was no way to tell from the dashboard whether those events came from
 * an old binary, the new one, or a device that had (or hadn't) pulled an OTA
 * update. These tests pin the three things that answer that question:
 *   - `release` in Sentry's `<bundleId>@<version>+<build>` mobile convention,
 *     which must stay byte-identical to what the native SDK auto-detects (and
 *     to whatever source maps get uploaded once the config plugin TODO lands),
 *   - `dist` = native build number,
 *   - `ota.update_id`, which is the ONLY field that separates a patched device
 *     from an unpatched one running the same binary.
 *
 * Both native modules return null under Jest and in Expo Go, so they're mocked
 * below: the null case is a real production path (dev builds), not a test
 * artifact, and it has its own case below.
 *
 * The mocks expose GETTERS over plain state objects rather than plain values.
 * Babel's ESM→CJS interop makes the properties of an imported namespace object
 * read-only, so assigning `Application.nativeBuildVersion = null` straight onto
 * the mock silently does nothing and every case would test the same defaults.
 * Mutating `mockApp`/`mockUpdates` instead is what actually varies the input.
 */

const mockApp = {
  applicationId: 'com.jamesadventure.healthychoices',
  nativeApplicationVersion: '1.2.0',
  nativeBuildVersion: '31',
};

const mockUpdates = {
  updateId: null,
  channel: null,
  runtimeVersion: null,
  isEmbeddedLaunch: true,
};

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
}));

jest.mock('expo-application', () => ({
  get applicationId() { return mockApp.applicationId; },
  get nativeApplicationVersion() { return mockApp.nativeApplicationVersion; },
  get nativeBuildVersion() { return mockApp.nativeBuildVersion; },
}));

jest.mock('expo-updates', () => ({
  get updateId() { return mockUpdates.updateId; },
  get channel() { return mockUpdates.channel; },
  get runtimeVersion() { return mockUpdates.runtimeVersion; },
  get isEmbeddedLaunch() { return mockUpdates.isEmbeddedLaunch; },
}));

const Sentry = require('@sentry/react-native');
const { initSentry } = require('../sentry');

/** The options object passed to the most recent Sentry.init() call. */
function initOptions() {
  return Sentry.init.mock.calls[Sentry.init.mock.calls.length - 1][0];
}

describe('initSentry — build identification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApp.applicationId = 'com.jamesadventure.healthychoices';
    mockApp.nativeApplicationVersion = '1.2.0';
    mockApp.nativeBuildVersion = '31';
  });

  it('sets release in Sentry mobile convention: bundleId@version+build', () => {
    initSentry();
    expect(initOptions().release).toBe('com.jamesadventure.healthychoices@1.2.0+31');
  });

  it('sets dist to the native build number, so two builds of one version split apart', () => {
    initSentry();
    expect(initOptions().dist).toBe('31');
  });

  it('OMITS release and dist entirely when the natives report null (Expo Go / dev)', () => {
    // Passing a half-built string like "null@null+null" would be worse than
    // nothing: it would suppress the SDK's own native detection AND create a
    // junk release in the dashboard. Absent keys let the fallback happen.
    mockApp.applicationId = null;
    mockApp.nativeApplicationVersion = null;
    mockApp.nativeBuildVersion = null;

    initSentry();

    expect(initOptions()).not.toHaveProperty('release');
    expect(initOptions()).not.toHaveProperty('dist');
  });

  it('still omits release if only ONE of the three pieces is missing', () => {
    mockApp.nativeBuildVersion = null;
    initSentry();
    expect(initOptions()).not.toHaveProperty('release');
  });

  it('keeps the no-PII stance intact alongside the new fields', () => {
    initSentry();
    const opts = initOptions();
    expect(opts.sendDefaultPii).toBe(false);
    expect(typeof opts.beforeSend).toBe('function');
    expect(opts.beforeSend({ user: { id: 'abc' } }).user).toBeNull();
  });
});

describe('initSentry — OTA provenance tags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdates.updateId = null;
    mockUpdates.channel = null;
    mockUpdates.runtimeVersion = null;
    mockUpdates.isEmbeddedLaunch = true;
  });

  it('reports the embedded bundle when no OTA update has been applied', () => {
    initSentry();
    expect(initOptions().initialScope.tags).toEqual({
      'ota.update_id': 'embedded',
      'ota.channel': 'none',
      'ota.runtime_version': 'unknown',
      'ota.embedded_launch': 'true',
    });
  });

  it('reports the update id once a JS-only update is running', () => {
    mockUpdates.updateId = '0b1c2d3e-4f56-7890-abcd-ef1234567890';
    mockUpdates.channel = 'production';
    mockUpdates.runtimeVersion = '1.2.0';
    mockUpdates.isEmbeddedLaunch = false;

    initSentry();

    expect(initOptions().initialScope.tags).toEqual({
      'ota.update_id': '0b1c2d3e-4f56-7890-abcd-ef1234567890',
      'ota.channel': 'production',
      'ota.runtime_version': '1.2.0',
      'ota.embedded_launch': 'false',
    });
  });

  it('emits string tag values only — Sentry drops non-string tags', () => {
    initSentry();
    for (const value of Object.values(initOptions().initialScope.tags)) {
      expect(typeof value).toBe('string');
    }
  });
});
