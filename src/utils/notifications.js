import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// ─── Storage keys ─────────────────────────────────────────────────────────────

const OPT_IN_KEY        = '@hc_notif_opted_in';
const WEEKLY_ENABLED_KEY = '@hc_notif_weekly_enabled';
const PRIMED_KEY         = '@hc_notif_primed'; // the priming step has been shown once

// Identifier prefixes — every scheduled notification's `identifier` starts with
// one of these so cancelByCategory can target just that group.
const ID_PREFIX = {
  welcome: 'hc_welcome_',
  weekly:  'hc_weekly_',
};

const DAY_MS = 24 * 60 * 60 * 1000;

// ─── Copy bank ────────────────────────────────────────────────────────────────
// Playful, non-factual copy only. No ingredient/health facts, no stats, no
// promotional/discount content (Guideline 4.5.4), no guilt/streak-shaming.
//
// FACTS: [] — placeholder for a verified fact bank arriving from another
// workstream. Do NOT populate this with ingredient/health claims until that
// data has been verified — see instructions/instructions.md non-negotiables.
const FACTS = [];

export const COPY = {
  welcome: [
    {
      title: 'Your scanner is ready.',
      body: 'Day 1: pick one thing from your pantry and see what it\'s really made of.',
    },
    {
      title: 'Pantry intrigue awaits.',
      body: 'Day 2: somewhere in your kitchen is a label with a secret. Go find it.',
    },
    {
      title: 'One more scan?',
      body: 'Day 3: your scanner has x-ray vision and nothing to do today. Put it to work.',
    },
  ],
  weekly: [
    {
      title: 'Grocery run today?',
      body: 'Don\'t forget your x-ray vision.',
    },
    {
      title: 'Your scanner missed you.',
      body: 'It\'s been staring at the ceiling all week. Give it a mystery.',
    },
    {
      title: 'Cart before the facts.',
      body: 'Scan first, decide second — old shopper proverb, probably.',
    },
    {
      title: 'Aisle of secrets.',
      body: 'Every shelf is hiding something. Weekend shopping is a great time to look.',
    },
    {
      title: 'Basket check.',
      body: 'Before it all goes in the cart, give a few labels a once-over.',
    },
    {
      title: 'Your scanner, bored again.',
      body: 'It only comes alive at the grocery store. Today\'s its day.',
    },
  ],
};

// ─── Small storage helpers ────────────────────────────────────────────────────

async function getBool(key) {
  try {
    return (await AsyncStorage.getItem(key)) === 'true';
  } catch {
    return false;
  }
}

async function setBool(key, value) {
  try {
    await AsyncStorage.setItem(key, value ? 'true' : 'false');
  } catch (e) {
    console.warn('[Notifications] failed to persist', key, e?.message ?? e);
  }
}

export async function hasBeenPrimed() {
  return getBool(PRIMED_KEY);
}

export async function markPrimed() {
  return setBool(PRIMED_KEY, true);
}

export async function isOptedIn() {
  return getBool(OPT_IN_KEY);
}

export async function isWeeklyEnabled() {
  // Defaults to true once opted in; explicit false only if the user turned it off.
  const raw = await AsyncStorage.getItem(WEEKLY_ENABLED_KEY);
  return raw === null ? true : raw === 'true';
}

async function setOptedIn(value) {
  return setBool(OPT_IN_KEY, value);
}

async function setWeeklyEnabled(value) {
  return setBool(WEEKLY_ENABLED_KEY, value);
}

// ─── Permission helpers ───────────────────────────────────────────────────────

/**
 * Reads current OS permission status without prompting the user.
 * Returns 'granted' | 'denied' | 'undetermined'.
 */
export async function getPermissionStatus() {
  if (Platform.OS === 'web') return 'denied';
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted) return 'granted';
    if (settings.ios?.status === Notifications.IosAuthorizationStatus.DENIED) return 'denied';
    if (settings.status === 'denied') return 'denied';
    return 'undetermined';
  } catch (e) {
    console.warn('[Notifications] getPermissionStatus failed:', e?.message ?? e);
    return 'undetermined';
  }
}

/**
 * Triggers the system permission prompt. The system prompt fires only once
 * ever per install — call this ONLY right after the user accepts our own
 * priming UI ("Sure, remind me"), never automatically on app start.
 * Returns true if permission is granted (including previously granted).
 */
export async function requestPermission() {
  if (Platform.OS === 'web') return false;
  try {
    const settings = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    return !!settings.granted;
  } catch (e) {
    console.warn('[Notifications] requestPermission failed:', e?.message ?? e);
    return false;
  }
}

// ─── Scheduling ───────────────────────────────────────────────────────────────

/**
 * Schedules the 3-day "pantry audit" welcome series, one per day at ~10am
 * local time starting tomorrow. Distinct copy per day. Safe to call multiple
 * times — cancels any existing welcome-series notifications first.
 */
export async function scheduleWelcomeSeries() {
  if (Platform.OS === 'web') return;
  await cancelByCategory('welcome');

  const now = new Date();
  for (let dayOffset = 1; dayOffset <= COPY.welcome.length; dayOffset++) {
    const copy = COPY.welcome[dayOffset - 1];
    const fireDate = new Date(now.getTime() + dayOffset * DAY_MS);
    fireDate.setHours(10, 0, 0, 0);

    try {
      await Notifications.scheduleNotificationAsync({
        identifier: `${ID_PREFIX.welcome}${dayOffset}`,
        content: {
          title: copy.title,
          body: copy.body,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fireDate,
        },
      });
    } catch (e) {
      console.warn('[Notifications] scheduleWelcomeSeries failed for day', dayOffset, e?.message ?? e);
    }
  }
}

/**
 * Schedules one recurring weekly notification for the Saturday ~9am
 * grocery-run slot, rotating through the weekly copy bank. Safe to call
 * multiple times — cancels any existing weekly notification first.
 */
export async function scheduleWeeklyReengagement() {
  if (Platform.OS === 'web') return;
  await cancelByCategory('weekly');

  // Rotate copy by week-of-year so the message changes week to week without
  // any extra state to track.
  const weekIndex = Math.floor(Date.now() / (7 * DAY_MS)) % COPY.weekly.length;
  const copy = COPY.weekly[weekIndex];

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: `${ID_PREFIX.weekly}recurring`,
      content: {
        title: copy.title,
        body: copy.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 7, // 1 = Sunday ... 7 = Saturday
        hour: 9,
        minute: 0,
      },
    });
  } catch (e) {
    console.warn('[Notifications] scheduleWeeklyReengagement failed:', e?.message ?? e);
  }
}

/**
 * Cancels all scheduled notifications whose identifier starts with the given
 * category's prefix ('welcome' | 'weekly').
 */
export async function cancelByCategory(category) {
  const prefix = ID_PREFIX[category];
  if (!prefix) return;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter((n) => n.identifier?.startsWith(prefix));
    await Promise.all(
      toCancel.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
  } catch (e) {
    console.warn('[Notifications] cancelByCategory failed:', category, e?.message ?? e);
  }
}

/**
 * Cancels every notification scheduled by this app.
 */
export async function cancelAll() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('[Notifications] cancelAll failed:', e?.message ?? e);
  }
}

// ─── High-level opt-in / opt-out flows ────────────────────────────────────────

/**
 * Call after the user taps "Sure, remind me" on the priming UI. Requests the
 * system permission and, if granted, opts in and schedules both series.
 * Returns true if the user ended up opted in with notifications scheduled.
 */
export async function optInToNotifications() {
  await markPrimed();
  const granted = await requestPermission();
  if (!granted) {
    return false;
  }
  await setOptedIn(true);
  await setWeeklyEnabled(true);
  await scheduleWelcomeSeries();
  await scheduleWeeklyReengagement();
  return true;
}

/**
 * Call when the user dismisses the priming UI with "Not now". Records that
 * priming happened so we never auto-trigger it again; does not touch the OS
 * permission and schedules nothing.
 */
export async function declineNotificationPriming() {
  await markPrimed();
}

/**
 * Turns all notifications off (master toggle OFF in Profile). Cancels
 * everything scheduled and clears the opt-in flag, but does not revoke the OS
 * permission (that can only be done by the user in Settings).
 */
export async function optOutOfNotifications() {
  await setOptedIn(false);
  await cancelAll();
}

/**
 * Turns the master toggle back ON from Profile, assuming OS permission is
 * already granted (if it's not, the caller should deep-link to Settings
 * instead of calling this — see ProfileScreen). Deliberately does NOT
 * restart the welcome series — that's a signup-time drip only.
 */
export async function optBackIntoNotifications() {
  await setOptedIn(true);
  if (await isWeeklyEnabled()) {
    await scheduleWeeklyReengagement();
  }
}

/**
 * Call on app launch. If the user is opted in with weekly reminders on,
 * re-schedules the weekly notification so its copy rotates to this week's
 * line — a WEEKLY trigger otherwise repeats the same content forever.
 * No-ops (and never prompts) in every other state.
 */
export async function refreshWeeklySchedule() {
  try {
    if (!(await isOptedIn())) return;
    if (!(await isWeeklyEnabled())) return;
    if ((await getPermissionStatus()) !== 'granted') return;
    await scheduleWeeklyReengagement();
  } catch (e) {
    console.warn('[Notifications] refreshWeeklySchedule failed:', e?.message ?? e);
  }
}

/**
 * Toggles just the weekly reminder while leaving the welcome series/opt-in
 * state untouched.
 */
export async function setWeeklyReminders(enabled) {
  await setWeeklyEnabled(enabled);
  if (enabled) {
    await scheduleWeeklyReengagement();
  } else {
    await cancelByCategory('weekly');
  }
}
