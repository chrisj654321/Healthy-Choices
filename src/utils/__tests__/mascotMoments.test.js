/**
 * Tests for src/utils/mascotMoments.js.
 *
 * Uses the OFFICIAL @react-native-async-storage/async-storage Jest mock
 * (same pattern as storage.test.js), cleared in beforeEach so every test
 * starts from a genuinely empty store. Date-dependent behavior (the daily
 * streak) is controlled with Jest fake timers + setSystemTime rather than
 * mocking Date globally, so the module's own `new Date()` calls see
 * whatever "today" each test sets.
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { recordScanAndPickCelebration } from '../mascotMoments';

const FIRST_A_DONE_KEY = '@hc_mascot_first_a_done';
const SCAN_COUNT_KEY   = '@hc_mascot_scan_count';
const STREAK_KEY       = '@hc_mascot_streak';

// Noon local time avoids any same-day/DST edge cases in the test dates
// themselves (as opposed to the boundary being deliberately tested).
const NOON = 'T12:00:00';

function setDay(isoDate) {
  jest.setSystemTime(new Date(`${isoDate}${NOON}`));
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.useFakeTimers();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.useRealTimers();
  console.warn.mockRestore();
});

// ─── firstA ─────────────────────────────────────────────────────────────────

describe('firstA celebration', () => {
  test('fires exactly once: first "A" scan returns firstA, a later "A" scan does not', async () => {
    setDay('2026-01-05');
    const first = await recordScanAndPickCelebration({ displayGrade: 'A' });
    expect(first).toBe('firstA');

    // Same day, another A -- not a new day (no streak celebration either)
    // and firstA is already spent.
    const second = await recordScanAndPickCelebration({ displayGrade: 'A' });
    expect(second).toBeNull();

    expect(await AsyncStorage.getItem(FIRST_A_DONE_KEY)).toBe('true');
  });

  test('non-A grades never trigger firstA', async () => {
    setDay('2026-01-05');
    for (const grade of ['B', 'C', 'D', 'F', '?', undefined, null]) {
      // eslint-disable-next-line no-await-in-loop
      const result = await recordScanAndPickCelebration({ displayGrade: grade });
      expect(result).not.toBe('firstA');
    }
    expect(await AsyncStorage.getItem(FIRST_A_DONE_KEY)).toBeNull();
  });
});

// ─── tenthScan ──────────────────────────────────────────────────────────────

describe('tenthScan celebration', () => {
  test('fires on the 10th and 20th scan, and only those, within the same day', async () => {
    setDay('2026-01-05');
    const results = [];
    for (let i = 0; i < 20; i++) {
      // eslint-disable-next-line no-await-in-loop
      results.push(await recordScanAndPickCelebration({ displayGrade: null }));
    }
    results.forEach((result, idx) => {
      const scanNumber = idx + 1;
      if (scanNumber === 10 || scanNumber === 20) {
        expect(result).toBe('tenthScan');
      } else {
        expect(result).toBeNull();
      }
    });
    expect(await AsyncStorage.getItem(SCAN_COUNT_KEY)).toBe('20');
  });
});

// ─── streak ─────────────────────────────────────────────────────────────────

describe('streak celebration', () => {
  test('builds day over day and celebrates only once the streak reaches 3', async () => {
    setDay('2026-01-05');
    expect(await recordScanAndPickCelebration({ displayGrade: null })).toBeNull(); // streak 1

    setDay('2026-01-06');
    expect(await recordScanAndPickCelebration({ displayGrade: null })).toBeNull(); // streak 2

    setDay('2026-01-07');
    expect(await recordScanAndPickCelebration({ displayGrade: null })).toBe('streak'); // streak 3
  });

  test('a gap (skipped day) resets the streak back to 1', async () => {
    setDay('2026-01-05');
    await recordScanAndPickCelebration({ displayGrade: null }); // streak 1
    setDay('2026-01-06');
    await recordScanAndPickCelebration({ displayGrade: null }); // streak 2
    setDay('2026-01-07');
    expect(await recordScanAndPickCelebration({ displayGrade: null })).toBe('streak'); // streak 3

    // Gap: skip the 8th entirely, next scan lands on the 9th.
    setDay('2026-01-09');
    expect(await recordScanAndPickCelebration({ displayGrade: null })).toBeNull(); // streak reset to 1

    const stored = JSON.parse(await AsyncStorage.getItem(STREAK_KEY));
    expect(stored).toEqual({ lastDate: new Date('2026-01-09T12:00:00').toDateString(), streak: 1 });
  });

  test('midnight/DST boundary: same-day rescans are a no-op, not a fresh streak day, across the US spring-forward transition', async () => {
    // Sat 2026-03-07 -> Sun 2026-03-08 (US DST begins) -> Mon 2026-03-09.
    setDay('2026-03-07');
    await recordScanAndPickCelebration({ displayGrade: null }); // streak 1

    setDay('2026-03-08');
    await recordScanAndPickCelebration({ displayGrade: null }); // streak 2 (day after, across DST)

    // Multiple rescans still within 2026-03-08 must NOT keep bumping the
    // streak -- only the first scan of a calendar day counts.
    const rescanA = await recordScanAndPickCelebration({ displayGrade: null });
    const rescanB = await recordScanAndPickCelebration({ displayGrade: null });
    expect(rescanA).toBeNull();
    expect(rescanB).toBeNull();
    expect(JSON.parse(await AsyncStorage.getItem(STREAK_KEY)).streak).toBe(2);

    setDay('2026-03-09');
    expect(await recordScanAndPickCelebration({ displayGrade: null })).toBe('streak'); // streak 3
  });
});

// ─── priority + consumption ─────────────────────────────────────────────────

describe('priority ordering and consumption', () => {
  test('firstA > streak > tenthScan when multiple qualify on the same scan, and none re-fire afterward', async () => {
    setDay('2026-02-01');
    for (let i = 0; i < 8; i++) {
      // eslint-disable-next-line no-await-in-loop
      await recordScanAndPickCelebration({ displayGrade: null }); // scans 1-8, streak 1
    }
    setDay('2026-02-02');
    await recordScanAndPickCelebration({ displayGrade: null }); // scan 9, streak 2

    // Scan #10, first scan of a new day (streak -> 3), and an A grade --
    // all three moments qualify simultaneously. firstA must win.
    setDay('2026-02-03');
    const result = await recordScanAndPickCelebration({ displayGrade: 'A' });
    expect(result).toBe('firstA');

    // Same day again (scan #11): firstA is spent, streak isn't a new day
    // and tenthScan's count no longer lines up -- nothing fires.
    const followUp = await recordScanAndPickCelebration({ displayGrade: 'A' });
    expect(followUp).toBeNull();
  });
});

// ─── corrupted data / storage failures ──────────────────────────────────────

describe('resilience', () => {
  test('corrupted streak JSON self-heals instead of throwing', async () => {
    setDay('2026-01-05');
    await AsyncStorage.setItem(STREAK_KEY, 'not valid json{{{');

    const result = await recordScanAndPickCelebration({ displayGrade: null });
    expect(result).toBeNull(); // treated as no prior data -> streak 1, not celebration-eligible

    const stored = JSON.parse(await AsyncStorage.getItem(STREAK_KEY));
    expect(stored).toEqual({ lastDate: new Date('2026-01-05T12:00:00').toDateString(), streak: 1 });
  });

  test('AsyncStorage throwing anywhere in the flow -> caught, returns null, never throws', async () => {
    setDay('2026-01-05');
    AsyncStorage.getItem.mockImplementationOnce(() => Promise.reject(new Error('storage unavailable')));

    await expect(recordScanAndPickCelebration({ displayGrade: 'A' })).resolves.toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });
});
