import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY     = '@hc_scan_history';
const PREFS_KEY       = '@hc_user_prefs';
const ONBOARDING_KEY  = '@hc_onboarding_done';
const DAILY_SCAN_KEY  = '@hc_daily_scans';
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
    const data  = raw ? JSON.parse(raw) : { date: today, count: 0 };

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
  } catch {
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
  }
}

export async function getScanHistory() {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
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
  // Whether the user has explicitly reviewed each setup section (vs. skipped it
  // during onboarding). Drives the "finish setting up your profile" Home card.
  allergensReviewed: false,
  dietaryReviewed: false,
  goalReviewed: false,
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

export async function getUserPrefs() {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch (e) {
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
