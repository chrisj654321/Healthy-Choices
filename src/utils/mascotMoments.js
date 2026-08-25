import AsyncStorage from '@react-native-async-storage/async-storage';

// Deliberately separate from reviewPrompt.js's SUCCESSFUL_SCAN_COUNT_KEY —
// ScannerScreen increments that counter in a 900ms setTimeout AFTER
// navigating to ProductScoreScreen, so reading it here would race it and
// give an off-by-one/undefined count on the very screen that needs it.
const FIRST_A_DONE_KEY = '@hc_mascot_first_a_done';
const SCAN_COUNT_KEY   = '@hc_mascot_scan_count';
const STREAK_KEY       = '@hc_mascot_streak';
// Deliberately its own key, separate from FIRST_A_DONE_KEY, even though the
// first-ever 90+ score and the first-ever 'A' grade are usually the same
// scan (grade 'A' == score >= 90, see scorer.js#scoreToGrade). This flag
// gates the special full-screen celebration (ProductScoreScreen ->
// FirstHighScoreCelebration), which is a bigger moment than the small
// hero-corner backflip firstA plays, so it gets its own one-time trigger.
const FIRST_HIGH_SCORE_KEY = '@hc_first_high_score_celebrated';

// Score threshold for the special first-90+ celebration. Matches the 'A'
// grade cutoff in scorer.js (scoreToGrade), but this checks the real
// numeric score the caller already has, not the letter grade.
const HIGH_SCORE_THRESHOLD = 90;

// Celebrate every 10th scan (10, 20, 30, …).
const TENTH_SCAN_INTERVAL = 10;
// Backflip fires on the first scan of a day once the streak reaches 3.
const STREAK_CELEBRATE_THRESHOLD = 3;

function yesterdayDateString(from = new Date()) {
  // setDate(getDate() - 1) rolls the month/year over correctly on its own
  // and is unaffected by DST (it operates on the calendar day, not a raw
  // 24h subtraction), so this is safe across the spring-forward/fall-back
  // boundary.
  const d = new Date(from);
  d.setDate(d.getDate() - 1);
  return d.toDateString();
}

/**
 * Marks the first-ever 'A' grade as celebrated. Returns true exactly once
 * per install (subsequent A grades return false).
 */
async function checkFirstA(displayGrade) {
  if (displayGrade !== 'A') return false;
  const done = await AsyncStorage.getItem(FIRST_A_DONE_KEY);
  if (done === 'true') return false;
  await AsyncStorage.setItem(FIRST_A_DONE_KEY, 'true');
  return true;
}

/**
 * Marks the first-ever 90+ score as celebrated with the special full-screen
 * moment (ProductScoreScreen's FirstHighScoreCelebration). Returns true
 * exactly once per install; every later 90+ scan returns false so the
 * screen falls back to the normal recordScanAndPickCelebration flow below
 * (which still runs firstA/streak/tenthScan as before).
 *
 * Separate export (not folded into recordScanAndPickCelebration) because
 * the caller needs to know specifically whether THIS is the special moment,
 * to decide which celebration UI to show and whether to fire the
 * 'firstHighScore' review-prompt moment afterward.
 *
 * Wrapped in its own try/catch (mirroring recordScanAndPickCelebration's
 * resilience below) so a storage failure here never blocks the score
 * screen — it just falls back to "not the special moment" and behaves like
 * a normal scan.
 */
export async function checkFirstHighScore(score) {
  // Number.isFinite, not typeof === 'number' -- NaN is typeof 'number' but
  // every comparison against it is false, so `NaN < HIGH_SCORE_THRESHOLD`
  // would silently slip past a typeof-only guard and spend the flag.
  if (!Number.isFinite(score) || score < HIGH_SCORE_THRESHOLD) return false;
  try {
    const done = await AsyncStorage.getItem(FIRST_HIGH_SCORE_KEY);
    if (done === 'true') return false;
    await AsyncStorage.setItem(FIRST_HIGH_SCORE_KEY, 'true');
    return true;
  } catch (e) {
    console.warn('[MascotMoments] checkFirstHighScore failed:', e?.message ?? e);
    return false;
  }
}

/**
 * Increments the persisted total scan count and reports whether this scan
 * landed on a multiple of TENTH_SCAN_INTERVAL.
 */
async function incrementScanCount() {
  const raw = await AsyncStorage.getItem(SCAN_COUNT_KEY);
  const count = (Number(raw) || 0) + 1;
  await AsyncStorage.setItem(SCAN_COUNT_KEY, String(count));
  return count % TENTH_SCAN_INTERVAL === 0;
}

/**
 * Advances the daily-streak counter and reports whether this is the first
 * scan of a new calendar day, plus the resulting streak length.
 *   - same day as last recorded scan  -> no-op (not a new day), streak unchanged
 *   - last recorded scan was yesterday -> streak + 1
 *   - anything else (gap, or no prior data, or corrupted data) -> reset to 1
 */
async function updateStreak() {
  const today = new Date().toDateString();
  const yesterday = yesterdayDateString();
  const raw = await AsyncStorage.getItem(STREAK_KEY);

  let data = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      // Corrupted data -- treat exactly like "no prior data" so the block
      // below overwrites it with a fresh, valid entry (self-heals).
      data = null;
    }
  }

  if (data && data.lastDate === today) {
    return { firstScanOfDay: false, streak: data.streak };
  }

  const streak = data && data.lastDate === yesterday ? (data.streak || 0) + 1 : 1;
  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify({ lastDate: today, streak }));
  return { firstScanOfDay: true, streak };
}

/**
 * Call once per real scan (ScannerScreen -> ProductScore, gated by
 * `route.params.fromScanner` so history/search/browse navigations never
 * fire a celebration). Updates all three moment trackers every call, then
 * returns the single highest-priority celebration to play, or null.
 *
 * Priority: firstA > streak > tenthScan. Only one celebration ever plays
 * per scan -- lower-priority moments that also qualified on this same scan
 * are simply not returned (their underlying counters are still persisted,
 * so nothing is lost or double-counted, they just don't get their own
 * separate playback this time).
 *
 * Whole body is wrapped in try/catch -- a storage failure here must never
 * break the product score screen, so any error resolves to null (no
 * celebration) instead of throwing.
 */
export async function recordScanAndPickCelebration({ displayGrade } = {}) {
  try {
    const firstA = await checkFirstA(displayGrade);
    const tenthScan = await incrementScanCount();
    const { firstScanOfDay, streak } = await updateStreak();
    const streakEligible = firstScanOfDay && streak >= STREAK_CELEBRATE_THRESHOLD;

    if (firstA) return 'firstA';
    if (streakEligible) return 'streak';
    if (tenthScan) return 'tenthScan';
    return null;
  } catch (e) {
    console.warn('[MascotMoments] failed:', e?.message ?? e);
    return null;
  }
}
