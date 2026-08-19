/**
 * Tests for src/utils/reviewPrompt.js.
 *
 * Covers the global cooldown (now 7 days, was 14 — see CLAUDE.md / the
 * 2026-08-19 review-prompt change), the once-ever-per-moment guard (used
 * directly by the new 'firstHighScore' moment), the hasAction() gate, and
 * the "already left a review" permanent opt-out.
 *
 * AsyncStorage keys are copied here as literals (not exported by the
 * source module) — same pattern as mascotMoments.test.js.
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-store-review', () => ({
  hasAction: jest.fn().mockResolvedValue(true),
  requestReview: jest.fn().mockResolvedValue(undefined),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { maybeRequestAppReview } from '../reviewPrompt';

const PROMPTED_MOMENTS_KEY = '@hc_review_prompted_moments';
const LAST_PROMPTED_AT_KEY = '@hc_review_last_prompted_at';
const REVIEW_ACTION_TAKEN_KEY = '@hc_review_action_taken';

const DAY_MS = 24 * 60 * 60 * 1000;

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  StoreReview.hasAction.mockResolvedValue(true);
  StoreReview.requestReview.mockResolvedValue(undefined);
});

describe('global cooldown is 7 days (not the old 14)', () => {
  test('a second (different) moment is blocked 6 days after the last prompt', async () => {
    expect(await maybeRequestAppReview('momentA')).toBe(true);

    await AsyncStorage.setItem(LAST_PROMPTED_AT_KEY, String(Date.now() - 6 * DAY_MS));

    expect(await maybeRequestAppReview('momentB')).toBe(false);
    expect(StoreReview.requestReview).toHaveBeenCalledTimes(1); // only momentA's call
  });

  test('a second (different) moment succeeds once 8 days have passed', async () => {
    expect(await maybeRequestAppReview('momentA')).toBe(true);

    await AsyncStorage.setItem(LAST_PROMPTED_AT_KEY, String(Date.now() - 8 * DAY_MS));

    expect(await maybeRequestAppReview('momentB')).toBe(true);
    expect(StoreReview.requestReview).toHaveBeenCalledTimes(2);
  });
});

describe("'firstHighScore' moment (new — first-90+ celebration)", () => {
  test('fires exactly once: a second call for the same moment is blocked forever, cooldown or not', async () => {
    expect(await maybeRequestAppReview('firstHighScore')).toBe(true);
    expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);

    const prompted = JSON.parse(await AsyncStorage.getItem(PROMPTED_MOMENTS_KEY));
    expect(prompted.firstHighScore).toBeTruthy();

    // Even after the cooldown window has fully elapsed, the SAME moment
    // never re-fires — the once-per-moment guard is permanent, not
    // cooldown-gated.
    await AsyncStorage.setItem(LAST_PROMPTED_AT_KEY, String(Date.now() - 30 * DAY_MS));
    expect(await maybeRequestAppReview('firstHighScore')).toBe(false);
    expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);
  });

  test('never prompts if the user already left a review (REVIEW_ACTION_TAKEN_KEY)', async () => {
    await AsyncStorage.setItem(REVIEW_ACTION_TAKEN_KEY, 'true');
    expect(await maybeRequestAppReview('firstHighScore')).toBe(false);
    expect(StoreReview.requestReview).not.toHaveBeenCalled();
  });

  test('never prompts when StoreReview.hasAction() resolves false', async () => {
    StoreReview.hasAction.mockResolvedValue(false);
    expect(await maybeRequestAppReview('firstHighScore')).toBe(false);
    expect(StoreReview.requestReview).not.toHaveBeenCalled();
  });
});
