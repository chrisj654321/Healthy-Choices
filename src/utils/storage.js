import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureException } from './sentry';

const HISTORY_KEY     = '@hc_scan_history';
const PREFS_KEY       = '@hc_user_prefs';
const ONBOARDING_KEY  = '@hc_onboarding_done';
const DAILY_SCAN_KEY  = '@hc_daily_scans';
const SETUP_PROMPTED_KEY = '@hc_setup_prompted';
const MAX_HISTORY     = 100;

export const FREE_DAILY_LIMIT   = 5;
export const FREE_HISTORY_LIMIT = 20;

// ─── Daily scan limit ─────────────────────────────────────────────────────────

/**
 * Call before processing a scan for a free user.
 * Increments today's count and returns whether the scan is allowed.
 * Resets automatically at midnight.
 */
export async function checkAndIncrementDailyScan() {
  try {
    const today = new Date().toDateString();
    const raw   = await AsyncStorage.getItem(DAILY_SCAN_KEY);

    let data;
    if (!raw) {
      data = { date: today, count: 0 };
    } else {
      try {
        data = JSON.parse(raw);
      } catch (parseError) {
        // Corrupted data — self-heal instead of failing open indefinitely.
        // Treat exactly like "no data yet" so this call proceeds through the
        // normal increment/save logic below and overwrites the bad entry
        // with valid data (rather than returning unlimited scans forever).
        captureException(parseError, {
          function: 'checkAndIncrementDailyScan',
          reason: 'corrupted DAILY_SCAN_KEY data',
        });
        data = { date: today, count: 0 };
      }
    }

    // New day — reset counter
    if (data.date !== today) {
      data.date  = today;
      data.count = 0;
    }

    const allowed = data.count < FREE_DAILY_LIMIT;
    if (allowed) {
      data.count += 1;
      await AsyncStorage.setItem(DAILY_SCAN_KEY, JSON.stringify(data));
    }

    return { allowed, scansToday: data.count, remaining: FREE_DAILY_LIMIT - data.count };
  } catch (error) {
    captureException(error, { function: 'checkAndIncrementDailyScan' });
    return { allowed: true, scansToday: 0, remaining: FREE_DAILY_LIMIT };
  }
}

/**
 * Returns how many free scans remain today (0–5).
 */
export async function getDailyScansRemaining() {
  try {
    const today = new Date().toDateString();
    const raw   = await AsyncStorage.getItem(DAILY_SCAN_KEY);
    const data  = raw ? JSON.parse(raw) : { date: today, count: 0 };
    if (data.date !== today) return FREE_DAILY_LIMIT;
    return Math.max(0, FREE_DAILY_LIMIT - data.count);
  } catch {
    return FREE_DAILY_LIMIT;
  }
}

export async function addScanToHistory(product, scoreResult) {
  try {
    const existing = await getScanHistory();
    const entry = {
      id: `${product.barcode}_${Date.now()}`,
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      companyId: product.companyId,
      score: scoreResult.score,
      grade: scoreResult.grade,
      scannedAt: new Date().toISOString(),
      product,
    };
    const updated = [entry, ...existing].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return entry;
  } catch (e) {
    console.error('Failed to save scan history:', e);
    captureException(e, { function: 'addScanToHistory', barcode: product?.barcode });
  }
}

export async function getScanHistory() {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    captureException(e, { function: 'getScanHistory', reason: 'corrupted HISTORY_KEY data or read failure' });
    return [];
  }
}

export async function clearScanHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

export async function removeScanEntry(id) {
  try {
    const existing = await getScanHistory();
    const updated = existing.filter((e) => e.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove entry:', e);
  }
}

export const DEFAULT_PREFS = {
  dietaryFlags: [],
  allergens: [],
  favoriteStores: [],
  dietStyle: [],
  primaryGoal: null,
  // Onboarding's shopping-challenge step (Part B6) — single-select, like primaryGoal.
  challenge: null,
  // Commitment step (Part B7): 1-10 slider + optional goal deadline/free-text.
  // goalDeadline is null or { bucket, targetDate } (targetDate = ISO string).
  commitment: null,
  goalDeadline: null,
  goalText: '',
  // Whether the user has explicitly reviewed each setup section (vs. skipped it
  // during onboarding, or not yet visited in the post-first-scan setup flow).
  // Drives the "finish setting up your profile" Home card.
  allergensReviewed: false,
  dietaryReviewed: false,
  goalReviewed: false,
  challengeReviewed: false,
  storesReviewed: false,
  showLobbying: true,
  showDonations: true,
  notifyNewFlags: true,
  unit: 'imperial',
};

/**
 * Which initial-signup sections the user still hasn't completed. A section
 * counts as done if it was explicitly reviewed OR already has data (covers
 * users who set things up before the review flags existed).
 * Returns { complete, missing: ['allergens'|'dietary'|'goal'] }.
 *
 * 'stores' is intentionally NOT checked here (founder, 2026-07-19) — the
 * favorite-stores feature is paused, not shipped. favoriteStores/storesReviewed
 * stay in DEFAULT_PREFS untouched so the field re-lights cleanly whenever the
 * feature comes back; ProfileSetupScreen's StoresStep import was removed the
 * same day, but the shared component still lives in setupSteps.js.
 */
export function getProfileSetup(prefs = {}) {
  const allergensDone = prefs.allergensReviewed || (prefs.allergens?.length > 0);
  const dietaryDone =
    prefs.dietaryReviewed || (prefs.dietaryFlags?.length > 0) || (prefs.dietStyle?.length > 0);
  const goalDone = prefs.goalReviewed || prefs.primaryGoal != null;

  const missing = [];
  if (!allergensDone) missing.push('allergens');
  if (!dietaryDone) missing.push('dietary');
  if (!goalDone) missing.push('goal');

  return { complete: missing.length === 0, missing };
}

// ─── Post-first-scan setup prompt (Part B9) ────────────────────────────────────
// One-time flag: has the user already been offered the "personalize your
// scans?" prompt after their first real scan? Independent of whether they
// accepted — either way we never auto-prompt a second time (the Home nudge
// card stays as the persistent, non-modal reminder after this).

export async function hasBeenPromptedForSetup() {
  try {
    return (await AsyncStorage.getItem(SETUP_PROMPTED_KEY)) === 'true';
  } catch {
    return false;
  }
}

export async function markSetupPrompted() {
  try {
    await AsyncStorage.setItem(SETUP_PROMPTED_KEY, 'true');
  } catch (e) {
    console.warn('[Storage] failed to persist setup-prompted flag:', e?.message ?? e);
  }
}

export async function getUserPrefs() {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch (e) {
    captureException(e, { function: 'getUserPrefs', reason: 'corrupted PREFS_KEY data or read failure' });
    return DEFAULT_PREFS;
  }
}

export async function saveUserPrefs(prefs) {
  try {
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save prefs:', e);
  }
}

export async function isOnboardingDone() {
  try {
    const val = await AsyncStorage.getItem(ONBOARDING_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

export async function markOnboardingDone() {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}
