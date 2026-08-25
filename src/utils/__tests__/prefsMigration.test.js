/**
 * Prefs migration safety net (Part B5/B9).
 *
 * Onboarding's GoalStep option list was replaced (old nutrient-target ids
 * like 'avoid-added-sugar' -> new life-goal ids like 'weight-loss'), and
 * DEFAULT_PREFS grew new fields (challenge, commitment, goalDeadline,
 * goalText, challengeReviewed, storesReviewed). These tests pin that an
 * existing user's OLD-shaped stored prefs blob — saved before any of this
 * shipped — still loads, merges with the new defaults, and never crashes
 * downstream consumers (getProfileSetup, scorer's personalised warnings)
 * even when it contains an id that no longer appears in any option list.
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('../sentry', () => ({ captureException: jest.fn() }));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PREFS, getUserPrefs, getProfileSetup } from '../storage';
import { getPersonalisedWarnings } from '../scorer';
import { PRIMARY_GOAL_OPTIONS } from '../../data/preferences';

const PREFS_KEY = '@hc_user_prefs';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('DEFAULT_PREFS shape', () => {
  test('includes every new field introduced by this batch', () => {
    expect(DEFAULT_PREFS).toEqual(
      expect.objectContaining({
        challenge: null,
        challengeReviewed: false,
        commitment: null,
        goalDeadline: null,
        goalText: '',
        storesReviewed: false,
      })
    );
  });
});

describe('PRIMARY_GOAL_OPTIONS replacement', () => {
  test('new option list no longer contains any of the old nutrient-target ids', () => {
    const OLD_IDS = [
      'avoid-added-sugar', 'reduce-sodium', 'increase-protein',
      'increase-fiber', 'avoid-high-risk', 'eat-clean', 'low-carb-diet',
    ];
    const newIds = PRIMARY_GOAL_OPTIONS.map((o) => o.value);
    for (const oldId of OLD_IDS) {
      expect(newIds).not.toContain(oldId);
    }
  });

  test('has the 9 founder-specified life-goal ids', () => {
    const newIds = PRIMARY_GOAL_OPTIONS.map((o) => o.value);
    expect(newIds).toEqual([
      'weight-loss', 'more-energy', 'managing-health-concerns', 'fitness-performance',
      'inflammation-skin', 'family-health', 'learn-ingredients', 'long-term-habits', 'money-values',
    ]);
  });
});

describe('getUserPrefs — old-shaped stored blob merges safely with new defaults', () => {
  test('a pre-batch stored blob (missing every new field) gets the new fields from DEFAULT_PREFS', async () => {
    const oldShapedStoredPrefs = {
      dietaryFlags: ['vegan'],
      allergens: ['peanuts'],
      favoriteStores: ['walmart'],
      dietStyle: [],
      primaryGoal: 'avoid-added-sugar', // old id, no longer in PRIMARY_GOAL_OPTIONS
      allergensReviewed: true,
      dietaryReviewed: true,
      goalReviewed: true,
      showLobbying: true,
      showDonations: true,
      notifyNewFlags: true,
      unit: 'imperial',
      // no challenge / commitment / goalDeadline / goalText / challengeReviewed / storesReviewed
    };
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(oldShapedStoredPrefs));

    const merged = await getUserPrefs();

    // Old data preserved as-is — never silently dropped or rewritten.
    expect(merged.primaryGoal).toBe('avoid-added-sugar');
    expect(merged.favoriteStores).toEqual(['walmart']);

    // New fields backfilled from DEFAULT_PREFS.
    expect(merged.challenge).toBeNull();
    expect(merged.challengeReviewed).toBe(false);
    expect(merged.commitment).toBeNull();
    expect(merged.goalDeadline).toBeNull();
    expect(merged.goalText).toBe('');
    expect(merged.storesReviewed).toBe(false);
  });
});

describe('getProfileSetup — unknown/old goal id never crashes, still counts as "done"', () => {
  test('old primaryGoal id (not in the new option list) still satisfies the goal section', () => {
    const result = getProfileSetup({ primaryGoal: 'avoid-added-sugar', goalReviewed: false });
    expect(result.missing).not.toContain('goal');
  });

  test('a prefs blob missing every new field entirely does not throw', () => {
    expect(() => getProfileSetup({ allergensReviewed: true, dietaryReviewed: true, goalReviewed: true, storesReviewed: true })).not.toThrow();
  });
});

describe('scorer.getPersonalisedWarnings — old and new goal ids both resolve safely', () => {
  const analyzed = [];
  const product = { nutrition: { sugars: 20 } };

  test('old id (still present in GOAL_NOTE_MAP) resolves to a real note, no crash', () => {
    const warnings = getPersonalisedWarnings(analyzed, product, {
      allergens: [], dietaryFlags: [], primaryGoal: 'avoid-added-sugar',
    });
    expect(warnings.goalNote).toBe('Contains 20g sugar — above your low-sugar goal.');
  });

  test('new id (not in GOAL_NOTE_MAP yet) resolves to null, never throws', () => {
    expect(() => getPersonalisedWarnings(analyzed, product, {
      allergens: [], dietaryFlags: [], primaryGoal: 'weight-loss',
    })).not.toThrow();
    const warnings = getPersonalisedWarnings(analyzed, product, {
      allergens: [], dietaryFlags: [], primaryGoal: 'weight-loss',
    });
    expect(warnings.goalNote).toBeNull();
  });

  test('a totally unrecognized id (neither old nor new) also resolves to null, never throws', () => {
    const warnings = getPersonalisedWarnings(analyzed, product, {
      allergens: [], dietaryFlags: [], primaryGoal: 'some-future-id-that-does-not-exist-yet',
    });
    expect(warnings.goalNote).toBeNull();
  });
});
