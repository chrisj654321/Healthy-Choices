/**
 * Characterization tests for src/utils/subscription.js.
 *
 * This wraps the react-native-purchases native SDK, so the SDK is fully
 * mocked below (native modules can't run under Jest). The mock exposes a
 * default export with jest.fn()s for every RC method this file calls, plus
 * named exports LOG_LEVEL and PACKAGE_TYPE using the REAL enum string values
 * from @revenuecat/purchases-typescript-internal (checked in node_modules):
 *   LOG_LEVEL.DEBUG = 'DEBUG'
 *   PACKAGE_TYPE.ANNUAL = 'ANNUAL', PACKAGE_TYPE.MONTHLY = 'MONTHLY'
 *
 * The core money-risk pattern in this file is the repeated
 *   entitlements.active[ENTITLEMENT_ID] !== undefined
 * check (getProStatus, purchaseRCPackage, restorePurchases, and the
 * useProStatus listener). The founder has a real war story of an RC
 * entitlement existing with zero products attached — purchase succeeds,
 * unlock never fires. These tests hit that pattern hard, in both directions,
 * including a wrong-key-present case that mirrors the actual bug class.
 *
 * Do not treat a passing test here as an endorsement — some pin asymmetries
 * (purchaseRCPackage throws, restorePurchases swallows) that are called out
 * in the Hadrian build report as worth the founder's attention, not "fine."
 * The asymmetry itself was intentionally left in place (purchaseRCPackage's
 * docstring contract is relied on by the UI layer to detect e.userCancelled),
 * but as of 2026-07-05 every catch block in this file (plus the previously
 * uncaught purchaseRCPackage failure path) also reports to Sentry via
 * `captureException` (mocked below), so the team has visibility when these
 * things happen to real users — user-cancelled purchases are the one
 * deliberate exception, since that's normal behavior, not an error.
 */

jest.mock('react-native-purchases', () => {
  const LOG_LEVEL = {
    VERBOSE: 'VERBOSE',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
  };

  const PACKAGE_TYPE = {
    UNKNOWN: 'UNKNOWN',
    CUSTOM: 'CUSTOM',
    LIFETIME: 'LIFETIME',
    ANNUAL: 'ANNUAL',
    SIX_MONTH: 'SIX_MONTH',
    THREE_MONTH: 'THREE_MONTH',
    TWO_MONTH: 'TWO_MONTH',
    MONTHLY: 'MONTHLY',
    WEEKLY: 'WEEKLY',
  };

  const Purchases = {
    configure: jest.fn(),
    setLogLevel: jest.fn(),
    logIn: jest.fn(),
    logOut: jest.fn(),
    getCustomerInfo: jest.fn(),
    getOfferings: jest.fn(),
    purchasePackage: jest.fn(),
    restorePurchases: jest.fn(),
    addCustomerInfoUpdateListener: jest.fn(),
    removeCustomerInfoUpdateListener: jest.fn(),
  };

  return {
    __esModule: true,
    default: Purchases,
    LOG_LEVEL,
    PACKAGE_TYPE,
  };
});

jest.mock('../sentry', () => ({ captureException: jest.fn() }));

import Purchases, { PACKAGE_TYPE } from 'react-native-purchases';
import { captureException } from '../sentry';
import {
  ENTITLEMENT_ID,
  initRevenueCat,
  identifyRCUser,
  resetRCUser,
  getProStatus,
  getCustomerInfo,
  getCurrentOffering,
  extractPackages,
  purchaseRCPackage,
  restorePurchases,
} from '../subscription';

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.warn.mockRestore();
  console.error.mockRestore();
});

// ─── getProStatus ──────────────────────────────────────────────────────────

describe('getProStatus', () => {
  test('entitlement present under the exact ENTITLEMENT_ID key -> true', async () => {
    Purchases.getCustomerInfo.mockResolvedValue({
      entitlements: { active: { [ENTITLEMENT_ID]: { isActive: true } } },
    });
    await expect(getProStatus()).resolves.toBe(true);
  });

  test('no active entitlements at all -> false', async () => {
    Purchases.getCustomerInfo.mockResolvedValue({
      entitlements: { active: {} },
    });
    await expect(getProStatus()).resolves.toBe(false);
  });

  test('a DIFFERENT entitlement key present (mismatched key name) -> false', async () => {
    // This is the exact bug class from the founder's war story: an
    // entitlement exists but under a key that doesn't match ENTITLEMENT_ID
    // (e.g. a typo, or the dashboard entitlement identifier drifting from
    // the string hardcoded here). Pro must NOT unlock in this case.
    Purchases.getCustomerInfo.mockResolvedValue({
      entitlements: { active: { 'some_other_entitlement': { isActive: true } } },
    });
    await expect(getProStatus()).resolves.toBe(false);
  });

  test('getCustomerInfo rejects -> returns false, does not throw, reports to Sentry', async () => {
    Purchases.getCustomerInfo.mockRejectedValue(new Error('network down'));
    await expect(getProStatus()).resolves.toBe(false);
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getProStatus' })
    );
  });
});

// ─── getCustomerInfo ───────────────────────────────────────────────────────

describe('getCustomerInfo', () => {
  test('resolves -> returns the raw object', async () => {
    const info = { entitlements: { active: {} }, originalAppUserId: 'abc' };
    Purchases.getCustomerInfo.mockResolvedValue(info);
    await expect(getCustomerInfo()).resolves.toBe(info);
  });

  test('rejects -> returns null, does not throw, reports to Sentry', async () => {
    Purchases.getCustomerInfo.mockRejectedValue(new Error('boom'));
    await expect(getCustomerInfo()).resolves.toBeNull();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getCustomerInfo' })
    );
  });
});

// ─── getCurrentOffering ────────────────────────────────────────────────────

describe('getCurrentOffering', () => {
  test('offerings.current present -> returns it', async () => {
    const current = { identifier: 'default', availablePackages: [] };
    Purchases.getOfferings.mockResolvedValue({ current });
    await expect(getCurrentOffering()).resolves.toBe(current);
  });

  test('offerings.current is null -> returns null', async () => {
    Purchases.getOfferings.mockResolvedValue({ current: null });
    await expect(getCurrentOffering()).resolves.toBeNull();
  });

  test('getOfferings rejects -> returns null, does not throw, reports to Sentry', async () => {
    Purchases.getOfferings.mockRejectedValue(new Error('offerings fetch failed'));
    await expect(getCurrentOffering()).resolves.toBeNull();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getCurrentOffering' })
    );
  });
});

// ─── extractPackages ───────────────────────────────────────────────────────

describe('extractPackages', () => {
  test('null offering -> { yearly: null, monthly: null }', () => {
    expect(extractPackages(null)).toEqual({ yearly: null, monthly: null });
  });

  test('undefined offering -> { yearly: null, monthly: null }', () => {
    expect(extractPackages(undefined)).toEqual({ yearly: null, monthly: null });
  });

  test('matches by packageType (ANNUAL / MONTHLY) first', () => {
    const yearlyPkg = { identifier: 'custom_id_1', packageType: PACKAGE_TYPE.ANNUAL };
    const monthlyPkg = { identifier: 'custom_id_2', packageType: PACKAGE_TYPE.MONTHLY };
    const offering = { availablePackages: [yearlyPkg, monthlyPkg] };
    expect(extractPackages(offering)).toEqual({ yearly: yearlyPkg, monthly: monthlyPkg });
  });

  test('packageType does not match, but identifier contains "year"/"month" substring -> fallback fires', () => {
    const yearlyPkg = { identifier: 'my-yearly-plan', packageType: PACKAGE_TYPE.CUSTOM };
    const monthlyPkg = { identifier: 'my-monthly-plan', packageType: PACKAGE_TYPE.CUSTOM };
    const offering = { availablePackages: [yearlyPkg, monthlyPkg] };
    expect(extractPackages(offering)).toEqual({ yearly: yearlyPkg, monthly: monthlyPkg });
  });

  test('identifier is exactly "$rc_annual" / "$rc_monthly" -> exact-match path', () => {
    const yearlyPkg = { identifier: '$rc_annual', packageType: PACKAGE_TYPE.UNKNOWN };
    const monthlyPkg = { identifier: '$rc_monthly', packageType: PACKAGE_TYPE.UNKNOWN };
    const offering = { availablePackages: [yearlyPkg, monthlyPkg] };
    expect(extractPackages(offering)).toEqual({ yearly: yearlyPkg, monthly: monthlyPkg });
  });

  test('empty availablePackages array -> both null, no crash', () => {
    expect(extractPackages({ availablePackages: [] })).toEqual({ yearly: null, monthly: null });
  });
});

// ─── purchaseRCPackage ─────────────────────────────────────────────────────

describe('purchaseRCPackage', () => {
  test('resolves with entitlement active -> true', async () => {
    Purchases.purchasePackage.mockResolvedValue({
      customerInfo: { entitlements: { active: { [ENTITLEMENT_ID]: {} } } },
    });
    await expect(purchaseRCPackage({ identifier: 'pkg' })).resolves.toBe(true);
  });

  test('resolves without entitlement active -> false', async () => {
    Purchases.purchasePackage.mockResolvedValue({
      customerInfo: { entitlements: { active: {} } },
    });
    await expect(purchaseRCPackage({ identifier: 'pkg' })).resolves.toBe(false);
  });

  test('rejects -> the rejection PROPAGATES (function does not catch it), and reports the genuine failure to Sentry', async () => {
    const err = new Error('purchase failed');
    Purchases.purchasePackage.mockRejectedValue(err);
    // Per the docstring: "THROWS on failure — catch in the UI layer."
    // This must NOT resolve to false; it must reject with the same error.
    await expect(purchaseRCPackage({ identifier: 'pkg' })).rejects.toThrow('purchase failed');
    expect(captureException).toHaveBeenCalledWith(
      err,
      expect.objectContaining({ function: 'purchaseRCPackage', packageId: 'pkg' })
    );
  });

  test('rejects with userCancelled -> still propagates (UI layer checks e.userCancelled), but does NOT report to Sentry (normal user behavior, not an error)', async () => {
    const err = Object.assign(new Error('user cancelled'), { userCancelled: true });
    Purchases.purchasePackage.mockRejectedValue(err);
    await expect(purchaseRCPackage({ identifier: 'pkg' })).rejects.toMatchObject({
      userCancelled: true,
    });
    expect(captureException).not.toHaveBeenCalled();
  });
});

// ─── restorePurchases ──────────────────────────────────────────────────────

describe('restorePurchases', () => {
  test('resolves with entitlement active -> true', async () => {
    Purchases.restorePurchases.mockResolvedValue({
      entitlements: { active: { [ENTITLEMENT_ID]: {} } },
    });
    await expect(restorePurchases()).resolves.toBe(true);
  });

  test('resolves without entitlement active -> false', async () => {
    Purchases.restorePurchases.mockResolvedValue({
      entitlements: { active: {} },
    });
    await expect(restorePurchases()).resolves.toBe(false);
  });

  test('rejects -> DOES catch here, returns false (asymmetric vs purchaseRCPackage), reports to Sentry', async () => {
    // Unlike purchaseRCPackage, this function wraps the call in try/catch
    // and swallows the error, returning false instead of rejecting. Pinning
    // this exactly as coded — flagged in the build report as an asymmetry
    // worth the founder's attention, not something this suite fixes. Sentry
    // visibility was added 2026-07-05 so a genuine restore failure is not
    // completely invisible to the team just because it's swallowed from the
    // caller's perspective.
    Purchases.restorePurchases.mockRejectedValue(new Error('restore failed'));
    await expect(restorePurchases()).resolves.toBe(false);
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'restorePurchases' })
    );
  });
});

// ─── initRevenueCat / identifyRCUser / resetRCUser (never throw) ──────────

describe('initRevenueCat', () => {
  test('configure + logIn succeed -> resolves cleanly, no throw', async () => {
    Purchases.logIn.mockResolvedValue({ customerInfo: {} });
    await expect(initRevenueCat('user-123')).resolves.toBeUndefined();
    expect(Purchases.configure).toHaveBeenCalled();
    expect(Purchases.logIn).toHaveBeenCalledWith('user-123');
  });

  test('logIn rejects during init -> warns but does not throw, reports to Sentry', async () => {
    Purchases.logIn.mockRejectedValue(new Error('logIn failed'));
    await expect(initRevenueCat('user-123')).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalled();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'initRevenueCat', step: 'logIn' })
    );
  });

  test('no userId -> does not call logIn at all, does not throw', async () => {
    await expect(initRevenueCat()).resolves.toBeUndefined();
    expect(Purchases.logIn).not.toHaveBeenCalled();
  });

  test('configure itself throws -> caught, warns, does not throw, reports to Sentry', async () => {
    Purchases.configure.mockImplementation(() => {
      throw new Error('configure exploded');
    });
    await expect(initRevenueCat('user-123')).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalled();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'initRevenueCat', step: 'configure' })
    );
  });
});

describe('identifyRCUser', () => {
  test('logIn resolves -> returns customerInfo', async () => {
    const customerInfo = { entitlements: { active: {} } };
    Purchases.logIn.mockResolvedValue({ customerInfo });
    await expect(identifyRCUser('user-123')).resolves.toBe(customerInfo);
  });

  test('logIn rejects -> returns null, does not throw, reports to Sentry', async () => {
    Purchases.logIn.mockRejectedValue(new Error('identify failed'));
    await expect(identifyRCUser('user-123')).resolves.toBeNull();
    expect(console.warn).toHaveBeenCalled();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'identifyRCUser', userId: 'user-123' })
    );
  });
});

describe('resetRCUser', () => {
  test('logOut succeeds -> resolves cleanly, does not throw', async () => {
    Purchases.logOut.mockResolvedValue();
    await expect(resetRCUser()).resolves.toBeUndefined();
    expect(console.warn).not.toHaveBeenCalled();
  });

  test('logOut rejects with an "anonymous" message -> ignored silently (no warn, no throw, no Sentry report — expected/benign)', async () => {
    Purchases.logOut.mockRejectedValue(new Error('already anonymous'));
    await expect(resetRCUser()).resolves.toBeUndefined();
    expect(console.warn).not.toHaveBeenCalled();
    expect(captureException).not.toHaveBeenCalled();
  });

  test('logOut rejects with a different message -> warns, still does not throw, reports to Sentry', async () => {
    Purchases.logOut.mockRejectedValue(new Error('network error'));
    await expect(resetRCUser()).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalled();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'resetRCUser' })
    );
  });
});

// ─── useProStatus hook ─────────────────────────────────────────────────────
//
// Skipped: no React hook-testing library (@testing-library/react-hooks or
// @testing-library/react-native) is installed in node_modules, and the task
// brief says not to install new dependencies without checking back first.
// The async functions above (getProStatus, purchaseRCPackage,
// restorePurchases) are the actual money-risk logic the hook wraps — those
// are fully covered. Flagged in the build report as a follow-up decision
// for the founder (which testing-library to add, if any).
