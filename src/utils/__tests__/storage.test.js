/**
 * Characterization tests for src/utils/storage.js.
 *
 * Uses the OFFICIAL @react-native-async-storage/async-storage Jest mock
 * (node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js)
 * rather than a hand-rolled one. Its getItem() resolves to `null` for unset
 * keys (not undefined), which matters for this file's `raw ? JSON.parse(raw) : ...`
 * fallback logic — tests below rely on that real shape.
 *
 * These tests pin CURRENT behavior exactly as coded. As of 2026-07-05, the
 * `checkAndIncrementDailyScan` indefinite-fail-open bug was fixed (it now
 * self-heals on the first call after corrupted data, instead of granting
 * unlimited scans forever) and all corrupted-data / error-path branches in
 * this file now report to Sentry via `captureException` (mocked below) so
 * the team has visibility when these things happen to real users. The
 * remaining silent-reset behaviors (getScanHistory -> [], getUserPrefs ->
 * DEFAULT_PREFS) are intentionally kept as the correct safe UI fallback —
 * only their visibility changed, not their return values. A passing test
 * here is NOT an endorsement of every remaining edge case — it's a pin, so a
 * future accidental change gets caught, not a certification that every
 * behavior is ideal product design.
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../sentry', () => ({ captureException: jest.fn() }));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureException } from '../sentry';
import {
  FREE_DAILY_LIMIT,
  checkAndIncrementDailyScan,
  getDailyScansRemaining,
  addScanToHistory,
  getScanHistory,
  clearScanHistory,
  removeScanEntry,
  DEFAULT_PREFS,
  getProfileSetup,
  getUserPrefs,
  saveUserPrefs,
  isOnboardingDone,
  markOnboardingDone,
} from '../storage';

const DAILY_SCAN_KEY = '@hc_daily_scans';
const HISTORY_KEY = '@hc_scan_history';
const PREFS_KEY = '@hc_user_prefs';
const ONBOARDING_KEY = '@hc_onboarding_done';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  captureException.mockClear();
});

afterEach(() => {
  console.error.mockRestore();
  console.warn.mockRestore();
});

// ─── checkAndIncrementDailyScan ────────────────────────────────────────────

describe('checkAndIncrementDailyScan', () => {
  test('first call of a fresh day -> allowed, scansToday: 1, remaining: 4', async () => {
    const result = await checkAndIncrementDailyScan();
    expect(result).toEqual({ allowed: true, scansToday: 1, remaining: 4 });
  });

  test('5 calls in the same day -> 5th call still allowed, scansToday: 5, remaining: 0', async () => {
    let result;
    for (let i = 0; i < 5; i++) {
      result = await checkAndIncrementDailyScan();
    }
    expect(result).toEqual({ allowed: true, scansToday: 5, remaining: 0 });
  });

  test('6th call in the same day -> allowed: false, count does not keep incrementing', async () => {
    for (let i = 0; i < 5; i++) {
      await checkAndIncrementDailyScan();
    }
    const sixth = await checkAndIncrementDailyScan();
    expect(sixth).toEqual({ allowed: false, scansToday: 5, remaining: 0 });

    const seventh = await checkAndIncrementDailyScan();
    expect(seventh).toEqual({ allowed: false, scansToday: 5, remaining: 0 });
  });

  test('stored date different from today -> counter resets to 0 before incrementing (fresh 5)', async () => {
    await AsyncStorage.setItem(
      DAILY_SCAN_KEY,
      JSON.stringify({ date: 'Mon Jan 01 2000', count: 5 })
    );
    const result = await checkAndIncrementDailyScan();
    expect(result).toEqual({ allowed: true, scansToday: 1, remaining: 4 });
  });

  // FIXED 2026-07-05: previously failed open indefinitely — a corrupted
  // DAILY_SCAN_KEY blob fell through to the outer catch, which returned
  // unlimited-scan behavior WITHOUT ever writing fresh data back to storage,
  // so the same corrupted data was read again next call (indefinite free
  // unlimited scans). Now self-heals on the first call after corruption:
  // the parse failure is treated like "no data yet," proceeds through the
  // normal increment/save logic, and overwrites the corrupted entry with
  // valid data — so only the first call after corruption is "free," and
  // every call after that counts normally against FREE_DAILY_LIMIT.
  test('corrupted stored JSON -> self-heals: first call after corruption gets one fresh scan, reports to Sentry, and writes valid data back', async () => {
    await AsyncStorage.setItem(DAILY_SCAN_KEY, 'not valid json{{{');
    const result = await checkAndIncrementDailyScan();
    expect(result).toEqual({ allowed: true, scansToday: 1, remaining: FREE_DAILY_LIMIT - 1 });
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'checkAndIncrementDailyScan' })
    );

    // A subsequent call the same day must continue counting from 1 (not
    // reset again), proving valid data was actually persisted, not just
    // returned in-memory.
    const second = await checkAndIncrementDailyScan();
    expect(second).toEqual({ allowed: true, scansToday: 2, remaining: FREE_DAILY_LIMIT - 2 });
  });
});

// ─── getDailyScansRemaining ─────────────────────────────────────────────────

describe('getDailyScansRemaining', () => {
  test('same day, some scans used -> correct remaining math', async () => {
    await AsyncStorage.setItem(
      DAILY_SCAN_KEY,
      JSON.stringify({ date: new Date().toDateString(), count: 3 })
    );
    await expect(getDailyScansRemaining()).resolves.toBe(2);
  });

  test('different stored day -> full FREE_DAILY_LIMIT', async () => {
    await AsyncStorage.setItem(
      DAILY_SCAN_KEY,
      JSON.stringify({ date: 'Mon Jan 01 2000', count: 4 })
    );
    await expect(getDailyScansRemaining()).resolves.toBe(FREE_DAILY_LIMIT);
  });

  test('no stored data at all -> full limit', async () => {
    await expect(getDailyScansRemaining()).resolves.toBe(FREE_DAILY_LIMIT);
  });

  test('count at or beyond the limit -> clamped to 0, never negative', async () => {
    await AsyncStorage.setItem(
      DAILY_SCAN_KEY,
      JSON.stringify({ date: new Date().toDateString(), count: 9 })
    );
    await expect(getDailyScansRemaining()).resolves.toBe(0);
  });

  test('corrupted stored JSON -> falls back to full FREE_DAILY_LIMIT (fail open, same family as above)', async () => {
    await AsyncStorage.setItem(DAILY_SCAN_KEY, 'not valid json{{{');
    await expect(getDailyScansRemaining()).resolves.toBe(FREE_DAILY_LIMIT);
  });
});

// ─── addScanToHistory ───────────────────────────────────────────────────────

describe('addScanToHistory', () => {
  const product = {
    barcode: '012345678905',
    name: 'Test Cereal',
    brand: 'Test Brand',
    category: 'cereal',
    companyId: 'test-co',
  };
  const scoreResult = { score: 72, grade: 'C' };

  test('adds an entry with the correct shape', async () => {
    const entry = await addScanToHistory(product, scoreResult);
    expect(entry).toMatchObject({
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      companyId: product.companyId,
      score: 72,
      grade: 'C',
      product,
    });
    expect(entry.id).toBe(`${product.barcode}_${entry.id.split('_')[1]}`);
    expect(typeof entry.scannedAt).toBe('string');
    expect(new Date(entry.scannedAt).toString()).not.toBe('Invalid Date');
  });

  test('newest entry ends up FIRST in the stored array', async () => {
    await addScanToHistory({ ...product, barcode: '111' }, scoreResult);
    await addScanToHistory({ ...product, barcode: '222' }, scoreResult);
    const history = await getScanHistory();
    expect(history[0].barcode).toBe('222');
    expect(history[1].barcode).toBe('111');
  });

  test('MAX_HISTORY cap: seeding 100 entries + adding a 101st drops the OLDEST, not newest', async () => {
    const seeded = [];
    for (let i = 0; i < 100; i++) {
      seeded.push({
        id: `seed_${i}`,
        barcode: `seed_${i}`,
        name: `Seed ${i}`,
        brand: 'Seed Brand',
        category: 'seed',
        companyId: 'seed-co',
        score: 50,
        grade: 'C',
        scannedAt: new Date().toISOString(),
        product: { barcode: `seed_${i}` },
      });
    }
    // seeded[0] is treated as "newest" (front of array); seeded[99] is oldest.
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(seeded));

    await addScanToHistory({ ...product, barcode: 'new-101' }, scoreResult);
    const history = await getScanHistory();

    expect(history).toHaveLength(100);
    expect(history[0].barcode).toBe('new-101');
    // the oldest seeded entry (seed_99) should have been dropped off the end
    expect(history.some((e) => e.barcode === 'seed_99')).toBe(false);
    // the next-oldest (seed_98) should still be present, now at the tail
    expect(history[history.length - 1].barcode).toBe('seed_98');
  });

  test('AsyncStorage.setItem rejecting (storage full) -> caught, logged, reported to Sentry, returns undefined (no throw)', async () => {
    // FLAGGED FOR FOUNDER: a failed save here is silent to the UI layer —
    // the caller gets `undefined` back with no signal that the scan wasn't
    // actually persisted. Return-value contract intentionally left as-is
    // this session; Sentry visibility was added 2026-07-05 so the team can
    // at least see when this happens to a real user.
    //
    // NOTE: uses mockImplementationOnce (not jest.spyOn + mockRestore) --
    // spying on this particular manual mock module and later calling
    // mockRestore() leaves setItem as a dead stub that never reaches the
    // mock's internal multiSet/storage, silently breaking every AsyncStorage
    // write for the rest of the test file. mockImplementationOnce avoids
    // that entirely since the queued rejection pops itself off after one
    // call and every later call falls through to the real mock behavior.
    AsyncStorage.setItem.mockImplementationOnce(() =>
      Promise.reject(new Error('storage full'))
    );

    const result = await addScanToHistory(product, scoreResult);
    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalled();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'addScanToHistory', barcode: product.barcode })
    );
  });
});

// ─── getScanHistory ─────────────────────────────────────────────────────────

describe('getScanHistory', () => {
  test('empty/unset storage -> []', async () => {
    await expect(getScanHistory()).resolves.toEqual([]);
  });

  test('valid stored array -> returns it', async () => {
    const arr = [{ id: 'a1', barcode: '111' }];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
    await expect(getScanHistory()).resolves.toEqual(arr);
  });

  test('corrupted JSON stored -> returns [] to the UI (safe fallback), but reports to Sentry so it is not silent to the team', async () => {
    // FLAGGED FOR FOUNDER: this is indistinguishable from "user has no scan
    // history yet" in the UI — recovering the actual data isn't possible, so
    // [] remains the correct safe UI fallback. Sentry visibility was added
    // 2026-07-05 so a genuine corruption event surfaces to the team instead
    // of only showing up as a user review calling it "data loss."
    await AsyncStorage.setItem(HISTORY_KEY, 'not valid json{{{');
    await expect(getScanHistory()).resolves.toEqual([]);
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getScanHistory' })
    );
  });
});

// ─── clearScanHistory / removeScanEntry ─────────────────────────────────────

describe('clearScanHistory', () => {
  test('empties the history', async () => {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([{ id: 'a1' }]));
    await clearScanHistory();
    await expect(getScanHistory()).resolves.toEqual([]);
  });
});

describe('removeScanEntry', () => {
  test('removes only the matching entry, leaves order of the rest intact', async () => {
    const arr = [
      { id: 'a1', barcode: '1' },
      { id: 'a2', barcode: '2' },
      { id: 'a3', barcode: '3' },
    ];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
    await removeScanEntry('a2');
    await expect(getScanHistory()).resolves.toEqual([
      { id: 'a1', barcode: '1' },
      { id: 'a3', barcode: '3' },
    ]);
  });

  test('removing a non-existent id is a no-op (no error, no array change)', async () => {
    const arr = [{ id: 'a1', barcode: '1' }];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
    await expect(removeScanEntry('does-not-exist')).resolves.toBeUndefined();
    await expect(getScanHistory()).resolves.toEqual(arr);
  });
});

// ─── getUserPrefs / saveUserPrefs ────────────────────────────────────────────

describe('getUserPrefs / saveUserPrefs', () => {
  test('round-trip works', async () => {
    const prefs = { ...DEFAULT_PREFS, allergens: ['peanuts'], unit: 'metric' };
    await saveUserPrefs(prefs);
    await expect(getUserPrefs()).resolves.toEqual(prefs);
  });

  test('unset storage -> returns DEFAULT_PREFS exactly', async () => {
    await expect(getUserPrefs()).resolves.toEqual(DEFAULT_PREFS);
  });

  test('partially-saved prefs merge with DEFAULT_PREFS: saved values win, defaults fill in the rest', async () => {
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify({ allergens: ['peanuts'] }));
    const result = await getUserPrefs();
    expect(result).toEqual({ ...DEFAULT_PREFS, allergens: ['peanuts'] });
    // confirm defaults for untouched keys are genuinely present
    expect(result.dietStyle).toEqual(DEFAULT_PREFS.dietStyle);
    expect(result.showLobbying).toBe(true);
  });

  test('corrupted JSON -> falls back to DEFAULT_PREFS (safe reset) and reports to Sentry', async () => {
    // FLAGGED FOR FOUNDER: same silent-reset-on-corruption family as scan
    // history and daily-scan-count above — a corrupted prefs blob quietly
    // resets the user to defaults (loses allergen/diet/goal setup). Resetting
    // to defaults remains the correct safe choice (the alternative is
    // crashing); Sentry visibility was added 2026-07-05 so the team knows if/
    // when this happens to a real user.
    await AsyncStorage.setItem(PREFS_KEY, 'not valid json{{{');
    await expect(getUserPrefs()).resolves.toEqual(DEFAULT_PREFS);
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getUserPrefs' })
    );
  });

  test('saveUserPrefs writes JSON.stringify(prefs) verbatim (no merge with defaults on save)', async () => {
    await saveUserPrefs({ allergens: ['gluten'] });
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    expect(JSON.parse(raw)).toEqual({ allergens: ['gluten'] });
  });
});

// ─── getProfileSetup ─────────────────────────────────────────────────────────

describe('getProfileSetup', () => {
  test('fully empty prefs ({}) -> all three missing, complete: false', () => {
    expect(getProfileSetup({})).toEqual({
      complete: false,
      missing: ['allergens', 'dietary', 'goal'],
    });
  });

  test('no argument at all -> defaults to {} -> all three missing', () => {
    expect(getProfileSetup()).toEqual({
      complete: false,
      missing: ['allergens', 'dietary', 'goal'],
    });
  });

  test('allergens done via explicit allergensReviewed flag (even with empty allergens array)', () => {
    const result = getProfileSetup({ allergensReviewed: true, allergens: [] });
    expect(result.missing).not.toContain('allergens');
  });

  test('allergens done via backward-compatible "already has data" path (reviewed flag false/undefined)', () => {
    const result = getProfileSetup({ allergensReviewed: false, allergens: ['peanuts'] });
    expect(result.missing).not.toContain('allergens');

    const result2 = getProfileSetup({ allergens: ['peanuts'] });
    expect(result2.missing).not.toContain('allergens');
  });

  test('dietary done via explicit dietaryReviewed flag', () => {
    const result = getProfileSetup({ dietaryReviewed: true });
    expect(result.missing).not.toContain('dietary');
  });

  test('dietary done via backward-compatible data path: dietaryFlags OR dietStyle non-empty', () => {
    expect(getProfileSetup({ dietaryFlags: ['vegan'] }).missing).not.toContain('dietary');
    expect(getProfileSetup({ dietStyle: ['keto'] }).missing).not.toContain('dietary');
  });

  test('goal done via explicit goalReviewed flag', () => {
    const result = getProfileSetup({ goalReviewed: true });
    expect(result.missing).not.toContain('goal');
  });

  test('goal done via backward-compatible data path: primaryGoal != null', () => {
    const result = getProfileSetup({ primaryGoal: 'weight-loss' });
    expect(result.missing).not.toContain('goal');
  });

  test('goal NOT done when primaryGoal is explicitly null and goalReviewed is falsy', () => {
    const result = getProfileSetup({ primaryGoal: null, goalReviewed: false });
    expect(result.missing).toContain('goal');
  });

  test('complete: true only when all three sections are done', () => {
    const result = getProfileSetup({
      allergensReviewed: true,
      dietaryReviewed: true,
      goalReviewed: true,
    });
    expect(result).toEqual({ complete: true, missing: [] });
  });

  test('missing array only lists genuinely incomplete sections (mixed case)', () => {
    const result = getProfileSetup({
      allergensReviewed: true,
      // dietary left incomplete
      goalReviewed: true,
    });
    expect(result).toEqual({ complete: false, missing: ['dietary'] });
  });
});

// ─── isOnboardingDone / markOnboardingDone ───────────────────────────────────

describe('isOnboardingDone / markOnboardingDone', () => {
  test('default false when unset', async () => {
    await expect(isOnboardingDone()).resolves.toBe(false);
  });

  test('true after marking', async () => {
    await markOnboardingDone();
    await expect(isOnboardingDone()).resolves.toBe(true);
  });

  test('round-trips correctly via the raw storage key', async () => {
    await markOnboardingDone();
    const raw = await AsyncStorage.getItem(ONBOARDING_KEY);
    expect(raw).toBe('true');
    await expect(isOnboardingDone()).resolves.toBe(true);
  });

  test('AsyncStorage.getItem rejecting -> isOnboardingDone catches and returns false', async () => {
    // mockImplementationOnce, not spyOn+mockRestore -- see note in the
    // addScanToHistory "storage full" test above for why mockRestore is
    // unsafe with this particular manual mock module.
    AsyncStorage.getItem.mockImplementationOnce(() =>
      Promise.reject(new Error('read failed'))
    );
    await expect(isOnboardingDone()).resolves.toBe(false);
  });
});
