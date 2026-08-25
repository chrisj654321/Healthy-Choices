import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// ─── Storage keys / identifiers ────────────────────────────────────────────────
// Mirrors notifications.js's conventions: a dedicated AsyncStorage key for the
// master toggle, and an identifier prefix so cancellation can target just this
// category without touching welcome/weekly notifications.

const ENABLED_KEY = '@hc_goal_reminders_enabled';
const ID_PREFIX   = 'hc_goal_';

const DAY_MS  = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

// ─── Deadline buckets (Part B7 CommitmentStep) ─────────────────────────────────
// Single source of truth for both the onboarding UI (chip labels + the
// bucket -> targetDate math) and this module's countdown/copy logic.

export const DEADLINE_BUCKETS = [
  { id: '1-5',   label: '1–5 weeks',       shortLabel: '1–5 week',       weeks: 5 },
  { id: '5-10',  label: '5–10 weeks',      shortLabel: '5–10 week',      weeks: 10 },
  { id: '10-20', label: '10–20 weeks',     shortLabel: '10–20 week',     weeks: 20 },
  { id: '20-52', label: '20 weeks–1 year', shortLabel: '20 week–1 year', weeks: 52 },
];

const BUCKET_BY_ID = Object.fromEntries(DEADLINE_BUCKETS.map((b) => [b.id, b]));

/** Bucket id -> ISO targetDate (now + the bucket's upper-bound weeks). */
export function bucketToTargetDate(bucketId, now = Date.now()) {
  const bucket = BUCKET_BY_ID[bucketId];
  if (!bucket) return null;
  return new Date(now + bucket.weeks * WEEK_MS).toISOString();
}

// ─── Countdown math ─────────────────────────────────────────────────────────────

/**
 * Returns { phase: 'countdown', weeksLeft } | { phase: 'deadline', weeksLeft: 0 }
 * | { phase: 'expired' } | { phase: 'invalid' }.
 * 'deadline' covers the final week (countdown hits 0 but hasn't run out yet);
 * 'expired' is more than a week past the target — the schedule goes silent.
 */
export function computeGoalStatus(targetDate, now = Date.now()) {
  const target = new Date(targetDate).getTime();
  if (!Number.isFinite(target)) return { phase: 'invalid' };

  const diffMs = target - now;
  if (diffMs > 0) return { phase: 'countdown', weeksLeft: Math.ceil(diffMs / WEEK_MS) };
  if (diffMs > -WEEK_MS) return { phase: 'deadline', weeksLeft: 0 };
  return { phase: 'expired' };
}

// ─── Copy bank ────────────────────────────────────────────────────────────────
// App-authored, claim-free templates only. `goalText` is the user's own
// free-text input from CommitmentStep, inserted verbatim — never analyzed,
// summarized, or transformed (see instructions/instructions.md non-negotiables
// and the OFF-vandalism-risk lesson: we never let outside/user text read as
// an editorial claim, so it's always framed as a quote of their own words).

const WITH_GOAL_TEXT = [
  (goalText, n) => `Your goal: "${goalText}" — ${n} week${n === 1 ? '' : 's'} left. Scan something today.`,
  (goalText, n) => `${n} week${n === 1 ? '' : 's'} left on "${goalText}." A quick scan keeps you on track.`,
  (goalText, n) => `Still chasing "${goalText}"? ${n} week${n === 1 ? '' : 's'} left — scan something today.`,
];

const WITHOUT_GOAL_TEXT = [
  (bucketLabel, n) => `Your ${bucketLabel} goal: ${n} week${n === 1 ? '' : 's'} left. A scan a day keeps the mystery ingredients away.`,
  (bucketLabel, n) => `${n} week${n === 1 ? '' : 's'} left on your ${bucketLabel} goal. Scan something today.`,
  (bucketLabel, n) => `Your ${bucketLabel} goal is getting close — ${n} week${n === 1 ? '' : 's'} left. Keep scanning.`,
];

function finalCopy(goalText) {
  return goalText
    ? `Last call on "${goalText}" — deadline week. Make it count.`
    : 'Deadline week for your goal. Make it count.';
}

/**
 * Pure copy selection — no side effects, so it's directly unit-testable.
 * Returns null when there's nothing to say: no deadline set, invalid date,
 * or more than a week past the target (the schedule goes silent by then).
 */
export function pickReminderCopy(prefs, now = Date.now()) {
  const deadline = prefs?.goalDeadline;
  if (!deadline?.targetDate) return null;

  const status = computeGoalStatus(deadline.targetDate, now);
  if (status.phase === 'invalid' || status.phase === 'expired') return null;

  const goalText = (prefs.goalText || '').trim();

  if (status.phase === 'deadline') {
    return { title: 'Deadline week', body: finalCopy(goalText), phase: 'deadline', weeksLeft: 0 };
  }

  // Rotate by week-of-epoch so the message varies week to week without any
  // extra state to track — same trick as notifications.js's weekly copy.
  const weekIndex = Math.floor(now / WEEK_MS);
  const bucket = BUCKET_BY_ID[deadline.bucket];
  const bucketLabel = bucket?.shortLabel || 'goal';
  const body = goalText
    ? WITH_GOAL_TEXT[weekIndex % WITH_GOAL_TEXT.length](goalText, status.weeksLeft)
    : WITHOUT_GOAL_TEXT[weekIndex % WITHOUT_GOAL_TEXT.length](bucketLabel, status.weeksLeft);

  return { title: 'Goal check-in', body, phase: 'countdown', weeksLeft: status.weeksLeft };
}

// ─── Master toggle ──────────────────────────────────────────────────────────────

export async function isGoalRemindersEnabled() {
  try {
    const raw = await AsyncStorage.getItem(ENABLED_KEY);
    // Defaults to true once a deadline exists; explicit false only if the
    // user turned it off — same default-on pattern as isWeeklyEnabled().
    return raw === null ? true : raw === 'true';
  } catch {
    return true;
  }
}

export async function setGoalRemindersEnabled(enabled) {
  try {
    await AsyncStorage.setItem(ENABLED_KEY, enabled ? 'true' : 'false');
  } catch (e) {
    console.warn('[GoalReminders] failed to persist enabled flag:', e?.message ?? e);
  }
}

// ─── Scheduling ───────────────────────────────────────────────────────────────

/**
 * Cancels every scheduled goal-reminder notification (identifier starts with
 * ID_PREFIX). Never touches welcome/weekly notifications.
 */
export async function cancelGoalReminders() {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter((n) => n.identifier?.startsWith(ID_PREFIX));
    await Promise.all(
      toCancel.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
  } catch (e) {
    console.warn('[GoalReminders] cancel failed:', e?.message ?? e);
  }
}

/**
 * Schedules 2x/week (Mon + Thu, 10am local time) recurring WEEKLY triggers
 * when the user has a goal deadline. Safe to call multiple times — always
 * cancels any existing goal reminders first, so the copy/countdown never
 * goes stale. No-ops (leaving everything cancelled) when: there's no
 * deadline, the master toggle is off, or the deadline window has fully
 * passed (silence, per plan B8).
 */
export async function scheduleGoalReminders(prefs) {
  if (Platform.OS === 'web') return;
  await cancelGoalReminders();

  if (!(await isGoalRemindersEnabled())) return;

  const copy = pickReminderCopy(prefs);
  if (!copy) return;

  const triggers = [
    { identifier: `${ID_PREFIX}mon`, weekday: 2 }, // Monday (1 = Sunday ... 7 = Saturday)
    { identifier: `${ID_PREFIX}thu`, weekday: 5 }, // Thursday
  ];

  for (const t of triggers) {
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: t.identifier,
        content: {
          title: copy.title,
          body: copy.body,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: t.weekday,
          hour: 10,
          minute: 0,
        },
      });
    } catch (e) {
      console.warn('[GoalReminders] scheduleGoalReminders failed:', t.identifier, e?.message ?? e);
    }
  }
}

/**
 * Call once at app launch (mirrors notifications.js's refreshWeeklySchedule)
 * so the countdown/copy stays current and the schedule silences itself once
 * the deadline window has fully passed. Best-effort — never throws.
 */
export async function refreshGoalReminders(prefs) {
  try {
    await scheduleGoalReminders(prefs);
  } catch (e) {
    console.warn('[GoalReminders] refresh failed:', e?.message ?? e);
  }
}

/**
 * Call once, right when a deadline is first confirmed (onboarding
 * completion — Part B7/B8). Turns the master toggle on and schedules
 * immediately.
 */
export async function enableGoalReminders(prefs) {
  await setGoalRemindersEnabled(true);
  await scheduleGoalReminders(prefs);
}
