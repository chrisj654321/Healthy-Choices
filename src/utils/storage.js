import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@hc_scan_history';
const PREFS_KEY = '@hc_user_prefs';
const ONBOARDING_KEY = '@hc_onboarding_done';
const MAX_HISTORY = 100;

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
  showLobbying: true,
  showDonations: true,
  notifyNewFlags: true,
  unit: 'imperial',
};

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
