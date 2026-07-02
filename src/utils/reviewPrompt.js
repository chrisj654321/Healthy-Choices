import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const PROMPTED_MOMENTS_KEY = '@hc_review_prompted_moments';
const LAST_PROMPTED_AT_KEY = '@hc_review_last_prompted_at';
const REVIEW_ACTION_TAKEN_KEY = '@hc_review_action_taken';

const DAY_MS = 24 * 60 * 60 * 1000;

const MOMENT_COPY = {
  onboarding: {
    title: 'Enjoying Shelf Expose?',
    message: 'A quick rating helps more people cut through what is in their food.',
    confirm: 'Rate Shelf Expose',
    cooldownDays: 0,
  },
  firstScan: {
    title: 'Was that useful?',
    message: 'A quick rating helps more shoppers decode food labels before they buy.',
    confirm: 'Rate Shelf Expose',
    cooldownDays: 2,
  },
  subscription: {
    title: 'Thanks for supporting Shelf Expose',
    message: 'If the app feels worth paying for, a quick rating helps us reach more shoppers.',
    confirm: 'Rate Shelf Expose',
    cooldownDays: 0,
    bypassCooldown: true,
  },
};

async function getPromptedMoments() {
  try {
    const raw = await AsyncStorage.getItem(PROMPTED_MOMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function markPrompted(moment, actionTaken = false) {
  const prompted = await getPromptedMoments();
  prompted[moment] = new Date().toISOString();
  const updates = [
    [PROMPTED_MOMENTS_KEY, JSON.stringify(prompted)],
    [LAST_PROMPTED_AT_KEY, String(Date.now())],
  ];
  if (actionTaken) updates.push([REVIEW_ACTION_TAKEN_KEY, 'true']);
  await AsyncStorage.multiSet(updates);
}

async function recentlyPrompted(cooldownDays) {
  if (!cooldownDays) return false;
  const raw = await AsyncStorage.getItem(LAST_PROMPTED_AT_KEY);
  if (!raw) return false;
  const last = Number(raw);
  return Number.isFinite(last) && Date.now() - last < cooldownDays * DAY_MS;
}

export async function maybeRequestAppReview(moment) {
  const copy = MOMENT_COPY[moment];
  if (!copy || Platform.OS === 'web') return false;

  try {
    const prompted = await getPromptedMoments();
    if (await AsyncStorage.getItem(REVIEW_ACTION_TAKEN_KEY) === 'true') return false;
    if (prompted[moment]) return false;
    if (!copy.bypassCooldown && await recentlyPrompted(copy.cooldownDays)) return false;
    if (!await StoreReview.hasAction()) return false;

    Alert.alert(copy.title, copy.message, [
      {
        text: 'Not now',
        style: 'cancel',
        onPress: () => markPrompted(moment).catch(() => {}),
      },
      {
        text: copy.confirm,
        onPress: async () => {
          await markPrompted(moment, true);
          await StoreReview.requestReview();
        },
      },
    ]);
    return true;
  } catch (e) {
    console.warn('[ReviewPrompt] failed:', e?.message ?? e);
    return false;
  }
}
