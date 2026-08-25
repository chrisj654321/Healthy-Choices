import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const PROMPTED_MOMENTS_KEY = '@hc_review_prompted_moments';
const LAST_PROMPTED_AT_KEY = '@hc_review_last_prompted_at';
const REVIEW_ACTION_TAKEN_KEY = '@hc_review_action_taken';
const SUCCESSFUL_SCAN_COUNT_KEY = '@hc_review_successful_scan_count';

const DAY_MS = 24 * 60 * 60 * 1000;

// Apple self-throttles the native prompt to ~3 times/year no matter what we
// do, so this is just our own spacing between attempts (was 14 days).
const GLOBAL_COOLDOWN_DAYS = 7;

// Only prompt on the 3rd successful scan — never on first run (Apple 5.6.1).
const FIRST_SCAN_TRIGGER_COUNT = 3;

const MOMENT_COOLDOWN_OVERRIDE = {
  // Subscription moment bypasses the global cooldown — a completed purchase
  // is a strong positive signal worth prompting on even during the window.
  subscription: { bypassCooldown: true },
};

async function getPromptedMoments() {
  try {
    const raw = await AsyncStorage.getItem(PROMPTED_MOMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function markPrompted(moment) {
  const prompted = await getPromptedMoments();
  prompted[moment] = new Date().toISOString();
  await AsyncStorage.multiSet([
    [PROMPTED_MOMENTS_KEY, JSON.stringify(prompted)],
    [LAST_PROMPTED_AT_KEY, String(Date.now())],
  ]);
}

async function recentlyPrompted() {
  const raw = await AsyncStorage.getItem(LAST_PROMPTED_AT_KEY);
  if (!raw) return false;
  const last = Number(raw);
  return Number.isFinite(last) && Date.now() - last < GLOBAL_COOLDOWN_DAYS * DAY_MS;
}

/**
 * Call after every successful scan. Increments a persisted counter and
 * returns true once the count reaches FIRST_SCAN_TRIGGER_COUNT (the 3rd
 * successful scan) — the caller should then invoke maybeRequestAppReview('firstScan').
 */
export async function recordSuccessfulScanForReview() {
  try {
    const raw = await AsyncStorage.getItem(SUCCESSFUL_SCAN_COUNT_KEY);
    const count = (Number(raw) || 0) + 1;
    await AsyncStorage.setItem(SUCCESSFUL_SCAN_COUNT_KEY, String(count));
    return count === FIRST_SCAN_TRIGGER_COUNT;
  } catch {
    return false;
  }
}

export async function maybeRequestAppReview(moment) {
  if (Platform.OS === 'web') return false;
  const override = MOMENT_COOLDOWN_OVERRIDE[moment] || {};

  try {
    const prompted = await getPromptedMoments();
    if (await AsyncStorage.getItem(REVIEW_ACTION_TAKEN_KEY) === 'true') return false;
    if (prompted[moment]) return false;
    if (!override.bypassCooldown && await recentlyPrompted()) return false;
    if (!await StoreReview.hasAction()) return false;

    await markPrompted(moment);
    await StoreReview.requestReview();
    return true;
  } catch (e) {
    console.warn('[ReviewPrompt] failed:', e?.message ?? e);
    return false;
  }
}
