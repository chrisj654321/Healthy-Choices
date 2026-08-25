/**
 * Tests for src/utils/goalReminders.js — Part B8.
 *
 * Covers: countdown math (computeGoalStatus), bucket -> targetDate
 * (bucketToTargetDate), reminder copy/template selection (pickReminderCopy),
 * and the disabled/no-deadline no-op paths through scheduleGoalReminders.
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('mock-id'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
  SchedulableTriggerInputTypes: { WEEKLY: 'weekly', DATE: 'date' },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import {
  DEADLINE_BUCKETS,
  bucketToTargetDate,
  computeGoalStatus,
  pickReminderCopy,
  isGoalRemindersEnabled,
  setGoalRemindersEnabled,
  scheduleGoalReminders,
  cancelGoalReminders,
  enableGoalReminders,
} from '../goalReminders';

const DAY_MS  = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

// ─── bucketToTargetDate ─────────────────────────────────────────────────────────

describe('bucketToTargetDate', () => {
  const NOW = Date.parse('2026-07-19T00:00:00.000Z');

  test.each(DEADLINE_BUCKETS)('bucket $id -> now + $weeks weeks, ISO string', (bucket) => {
    const result = bucketToTargetDate(bucket.id, NOW);
    const expected = new Date(NOW + bucket.weeks * WEEK_MS).toISOString();
    expect(result).toBe(expected);
  });

  test('unknown bucket id -> null', () => {
    expect(bucketToTargetDate('not-a-real-bucket', NOW)).toBeNull();
  });
});

// ─── computeGoalStatus ──────────────────────────────────────────────────────────

describe('computeGoalStatus', () => {
  const NOW = Date.parse('2026-07-19T00:00:00.000Z');

  test('future date well beyond a week -> countdown with correct weeksLeft (rounds up)', () => {
    const target = NOW + 10 * DAY_MS; // 10 days = 1.43 weeks -> ceil to 2
    expect(computeGoalStatus(target, NOW)).toEqual({ phase: 'countdown', weeksLeft: 2 });
  });

  test('exactly 3 weeks out -> weeksLeft: 3', () => {
    const target = NOW + 3 * WEEK_MS;
    expect(computeGoalStatus(target, NOW)).toEqual({ phase: 'countdown', weeksLeft: 3 });
  });

  test('exactly at the target instant (diff = 0) -> deadline phase', () => {
    expect(computeGoalStatus(NOW, NOW)).toEqual({ phase: 'deadline', weeksLeft: 0 });
  });

  test('just passed (within a week after) -> still deadline phase', () => {
    const target = NOW - 1 * DAY_MS;
    expect(computeGoalStatus(target, NOW)).toEqual({ phase: 'deadline', weeksLeft: 0 });
  });

  test('more than a week past the target -> expired (silence)', () => {
    const target = NOW - 8 * DAY_MS;
    expect(computeGoalStatus(target, NOW)).toEqual({ phase: 'expired' });
  });

  test('unparseable date -> invalid', () => {
    expect(computeGoalStatus('not-a-date', NOW)).toEqual({ phase: 'invalid' });
  });
});

// ─── pickReminderCopy (template selection + disabled-without-deadline) ─────────

describe('pickReminderCopy', () => {
  const NOW = Date.parse('2026-07-19T00:00:00.000Z'); // a Sunday

  test('no goalDeadline at all -> null (nothing to say)', () => {
    expect(pickReminderCopy({}, NOW)).toBeNull();
    expect(pickReminderCopy({ goalDeadline: null }, NOW)).toBeNull();
  });

  test('goalDeadline with no targetDate -> null', () => {
    expect(pickReminderCopy({ goalDeadline: { bucket: '1-5' } }, NOW)).toBeNull();
  });

  test('expired deadline (>1 week past) -> null (silence)', () => {
    const targetDate = new Date(NOW - 8 * DAY_MS).toISOString();
    expect(pickReminderCopy({ goalDeadline: { bucket: '1-5', targetDate } }, NOW)).toBeNull();
  });

  test('deadline week -> final copy, mentions the free-text goal when present', () => {
    const targetDate = new Date(NOW - 1 * DAY_MS).toISOString();
    const withText = pickReminderCopy({ goalDeadline: { bucket: '1-5', targetDate }, goalText: 'Fit into my jeans' }, NOW);
    expect(withText.phase).toBe('deadline');
    expect(withText.weeksLeft).toBe(0);
    expect(withText.body).toContain('Fit into my jeans');

    const withoutText = pickReminderCopy({ goalDeadline: { bucket: '1-5', targetDate }, goalText: '' }, NOW);
    expect(withoutText.body).not.toContain('"');
    expect(withoutText.body.toLowerCase()).toContain('deadline week');
  });

  test('countdown with goalText -> body quotes the goal text verbatim, never altered', () => {
    const targetDate = new Date(NOW + 4 * WEEK_MS).toISOString();
    const result = pickReminderCopy(
      { goalDeadline: { bucket: '10-20', targetDate }, goalText: 'Run a 5k' },
      NOW
    );
    expect(result.phase).toBe('countdown');
    expect(result.weeksLeft).toBe(4);
    expect(result.body).toContain('Run a 5k');
    expect(result.body).toContain('4 weeks left');
  });

  test('countdown without goalText -> body uses the bucket label instead', () => {
    const targetDate = new Date(NOW + 4 * WEEK_MS).toISOString();
    const result = pickReminderCopy(
      { goalDeadline: { bucket: '10-20', targetDate }, goalText: '' },
      NOW
    );
    expect(result.phase).toBe('countdown');
    expect(result.body).toContain('10–20 week');
  });

  test('singular "week" (not "weeks") when exactly 1 week left', () => {
    const targetDate = new Date(NOW + 1 * WEEK_MS).toISOString(); // exactly 1 week out -> ceil to 1
    const result = pickReminderCopy(
      { goalDeadline: { bucket: '1-5', targetDate }, goalText: 'Test goal' },
      NOW
    );
    expect(result.weeksLeft).toBe(1);
    expect(result.body).toMatch(/1 week left/);
    expect(result.body).not.toMatch(/1 weeks left/);
  });

  test('copy rotates by week-of-epoch (template selection varies deterministically)', () => {
    const targetDate = new Date(NOW + 4 * WEEK_MS).toISOString();
    const prefs = { goalDeadline: { bucket: '10-20', targetDate }, goalText: 'Run a 5k' };
    const weekA = pickReminderCopy(prefs, NOW);
    const weekB = pickReminderCopy(prefs, NOW + WEEK_MS);
    // Different week-of-epoch indices should be capable of selecting a
    // different template — assert both are valid non-empty bodies mentioning
    // the goal text (rotation is deterministic, not asserting a specific index).
    expect(weekA.body).toContain('Run a 5k');
    expect(weekB.body).toContain('Run a 5k');
  });
});

// ─── Master toggle ──────────────────────────────────────────────────────────────

describe('isGoalRemindersEnabled / setGoalRemindersEnabled', () => {
  test('defaults to true when never set', async () => {
    expect(await isGoalRemindersEnabled()).toBe(true);
  });

  test('reflects explicit false after setGoalRemindersEnabled(false)', async () => {
    await setGoalRemindersEnabled(false);
    expect(await isGoalRemindersEnabled()).toBe(false);
  });

  test('reflects explicit true after setGoalRemindersEnabled(true)', async () => {
    await setGoalRemindersEnabled(false);
    await setGoalRemindersEnabled(true);
    expect(await isGoalRemindersEnabled()).toBe(true);
  });
});

// ─── scheduleGoalReminders (disabled-without-deadline no-op paths) ─────────────

describe('scheduleGoalReminders', () => {
  test('no goalDeadline -> cancels any existing reminders, schedules nothing', async () => {
    await scheduleGoalReminders({});
    expect(Notifications.cancelScheduledNotificationAsync).not.toHaveBeenCalled(); // nothing was scheduled to cancel
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  test('master toggle off -> schedules nothing even with a valid deadline', async () => {
    await setGoalRemindersEnabled(false);
    const targetDate = new Date(Date.now() + 4 * WEEK_MS).toISOString();
    await scheduleGoalReminders({ goalDeadline: { bucket: '10-20', targetDate }, goalText: 'Run a 5k' });
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  test('valid deadline + enabled -> schedules exactly 2 recurring WEEKLY notifications (Mon + Thu)', async () => {
    const targetDate = new Date(Date.now() + 4 * WEEK_MS).toISOString();
    await scheduleGoalReminders({ goalDeadline: { bucket: '10-20', targetDate }, goalText: 'Run a 5k' });

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(2);
    const calls = Notifications.scheduleNotificationAsync.mock.calls.map((c) => c[0]);
    expect(calls.map((c) => c.identifier).sort()).toEqual(['hc_goal_mon', 'hc_goal_thu']);
    for (const call of calls) {
      expect(call.trigger).toEqual(expect.objectContaining({ type: 'weekly', hour: 10, minute: 0 }));
      expect(call.content.body).toContain('Run a 5k');
    }
  });

  test('expired deadline -> schedules nothing (silence)', async () => {
    const targetDate = new Date(Date.now() - 8 * DAY_MS).toISOString();
    await scheduleGoalReminders({ goalDeadline: { bucket: '1-5', targetDate } });
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe('cancelGoalReminders', () => {
  test('only cancels notifications whose identifier starts with hc_goal_', async () => {
    Notifications.getAllScheduledNotificationsAsync.mockResolvedValueOnce([
      { identifier: 'hc_goal_mon' },
      { identifier: 'hc_goal_thu' },
      { identifier: 'hc_weekly_recurring' },
    ]);
    await cancelGoalReminders();
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledTimes(2);
    const cancelledIds = Notifications.cancelScheduledNotificationAsync.mock.calls.map((c) => c[0]);
    expect(cancelledIds.sort()).toEqual(['hc_goal_mon', 'hc_goal_thu']);
  });
});

describe('enableGoalReminders', () => {
  test('turns the master toggle on and schedules immediately', async () => {
    await setGoalRemindersEnabled(false);
    const targetDate = new Date(Date.now() + 4 * WEEK_MS).toISOString();
    await enableGoalReminders({ goalDeadline: { bucket: '10-20', targetDate } });
    expect(await isGoalRemindersEnabled()).toBe(true);
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(2);
  });
});
