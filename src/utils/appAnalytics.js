/**
 * appAnalytics.js
 * Anonymous, install-level funnel + retention analytics.
 *
 * ── WHAT THIS MODULE ANSWERS ────────────────────────────────────────────────
 * Today we cannot tell where users fall off (onboarding step -> first scan ->
 * paywall shown -> dismissed or purchased), when they close the app, or
 * whether they come back. This module exists solely to answer those three
 * questions in aggregate, in `public.app_events` (see
 * supabase/app_events_setup.sql for the table + the funnel/retention queries
 * that read it).
 *
 * ── WHAT THIS COLLECTS ──────────────────────────────────────────────────────
 *   - install_id: a random UUID generated once on first launch and persisted
 *     in AsyncStorage. Reused for every event from that install, forever
 *     (until the app is uninstalled, which wipes it — AsyncStorage, not
 *     SecureStore, is the deliberate choice here for exactly that reason:
 *     this is not a secret, and it needs to die with the install).
 *   - session_id: a random UUID generated once per cold start, held in
 *     memory only (never persisted). Lets in-session funnels (did THIS
 *     visit's paywall view lead to THIS visit's purchase) sit alongside the
 *     cross-session retention signal that install_id provides.
 *   - event: one of a hard WHITELIST (see EVENT_WHITELIST below) — nothing
 *     else is ever accepted, so no future call site can accidentally leak
 *     freeform user text into this table.
 *   - step: a short qualifier (onboarding step name, paywall trigger source)
 *     — also always caller-controlled, never raw user input.
 *   - app_version / platform: which build/OS reported the event.
 *   - days_since_last_open: computed ON THE DEVICE from a locally-stored
 *     last-open timestamp, then reduced to a coarse bucket (0/1/3/7/14/30/
 *     31+) before it's sent. The device does the math; raw open-history
 *     timestamps never leave it.
 *
 * ── WHAT THIS NEVER COLLECTS ────────────────────────────────────────────────
 * No user_id, no email, no name, no IP, no IDFA/IDFV, no device fingerprint,
 * no third-party SDK. Nothing here is joinable to a Food Exposé account —
 * app_events has no user_id column at all (see app_events_setup.sql), which
 * is what keeps it "Data Not Linked to You" on the App Store privacy label
 * even though install_id is a declarable Identifier on that label.
 *
 * ── WHY A PERSISTENT ID IS NOT "TRACKING" UNDER APPLE'S ATT ─────────────────
 * Apple's App Tracking Transparency framework governs TRACKING: linking a
 * user's or device's data with data from OTHER companies' apps/websites for
 * targeted advertising, or sharing it with a data broker. install_id is
 * first-party (this app only), used only for this app's own product
 * analytics, and is never shared with anyone. That means it does not require
 * an ATT prompt. It IS still a declarable Identifier on the privacy label
 * ("Data Not Linked to You" bucket) — declare it there, do not skip it.
 *
 * This is a deliberate, founder-approved reversal (2026-07-26) of the
 * 2026-07-02 "no persistent identifier" decision, scoped to THIS table only.
 * scan_events (src/utils/scanAnalytics.js) is untouched and stays fully
 * anonymous/session-free — do not add an identifier there.
 *
 * Fire-and-forget throughout: every exported function silently no-ops on any
 * failure (offline, RLS misconfig, native module unavailable, etc.) and
 * never throws, so it can never block or crash the UI.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as Application from 'expo-application';
import { supabase } from './supabase';

const INSTALL_ID_KEY  = '@hc_install_id';
const LAST_OPEN_KEY   = '@hc_app_last_open_at';
const FIRST_SCAN_KEY  = '@hc_first_scan_logged';

// The only event names this module will ever write. Anything else is
// dropped before it reaches the network call — see logAppEvent().
const EVENT_WHITELIST = new Set([
  'app_open',
  'app_backgrounded',
  'onboarding_step',
  'first_scan',
  'paywall_shown',
  'paywall_dismissed',
  'purchase_started',
  'purchase_completed',
]);

// ─── ID generation ──────────────────────────────────────────────────────────

/**
 * RFC4122-ish v4 UUID from Math.random. Used only if the native expo-crypto
 * module is unavailable (Expo Go before a rebuild, or under Jest). This ID
 * is a coarse analytics bucket key, never a security token — non-
 * cryptographic randomness is an acceptable trade here, unlike auth tokens.
 */
function fallbackUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateId() {
  try {
    const id = Crypto.randomUUID();
    if (id) return id;
  } catch (_e) {
    // Fall through to the JS fallback below.
  }
  return fallbackUUID();
}

// Cache the IN-FLIGHT PROMISE (not just the resolved value) so concurrent
// callers during app startup never race each other into generating two
// different install ids or double-writing AsyncStorage.
let installIdPromise = null;

/**
 * Returns this install's persistent random id — generated once, reused for
 * the lifetime of the install. Safe to call as often as needed; every call
 * after the first resolves from memory without touching AsyncStorage again.
 */
export function getInstallId() {
  if (!installIdPromise) {
    installIdPromise = (async () => {
      try {
        const existing = await AsyncStorage.getItem(INSTALL_ID_KEY);
        if (existing) return existing;
        const fresh = generateId();
        await AsyncStorage.setItem(INSTALL_ID_KEY, fresh);
        return fresh;
      } catch (_e) {
        // Storage unavailable — fall back to an id that's only good for this
        // process lifetime rather than crashing the caller.
        return generateId();
      }
    })();
  }
  return installIdPromise;
}

// Per-launch, in-memory only — regenerated every time this module is loaded
// fresh (i.e. every cold start). Never persisted, never derived from
// anything persisted.
let sessionId = null;

/** Returns this launch's session id, generating it on first call. */
export function getSessionId() {
  if (!sessionId) sessionId = generateId();
  return sessionId;
}

// ─── days_since_last_open ───────────────────────────────────────────────────

/**
 * Reduce a raw day count to a coarse bucket before it ever leaves the
 * device. Buckets: 0 (same day), 1, 3 (2-3 days), 7 (4-7), 14 (8-14),
 * 30 (15-30), 31 (30+ — "31" stands in for "more than a month").
 */
function bucketDays(days) {
  if (days <= 0) return 0;
  if (days === 1) return 1;
  if (days <= 3) return 3;
  if (days <= 7) return 7;
  if (days <= 14) return 14;
  if (days <= 30) return 30;
  return 31;
}

/**
 * Reads the locally-stored last-open timestamp, computes the coarse bucket,
 * and updates the stored timestamp to now. Only ever called for 'app_open'
 * events — that's the one moment "did they come back, and how long since
 * last time" is meaningful. Returns null on first-ever open (nothing to
 * compare against) or on any storage failure.
 */
async function consumeDaysSinceLastOpen() {
  try {
    const raw = await AsyncStorage.getItem(LAST_OPEN_KEY);
    const now = Date.now();
    await AsyncStorage.setItem(LAST_OPEN_KEY, String(now));

    if (!raw) return null; // first-ever open — no prior data to bucket
    const last = parseInt(raw, 10);
    if (!Number.isFinite(last)) return null;

    const days = Math.floor((now - last) / (24 * 60 * 60 * 1000));
    return bucketDays(days);
  } catch (_e) {
    return null;
  }
}

// ─── app_version / platform ─────────────────────────────────────────────────

/**
 * Native app version, mirroring how sentry.js reads it. Returns null in
 * Expo Go / dev where the native module reports null — callers just omit
 * the field rather than sending a placeholder.
 */
function appVersion() {
  try {
    return Application.nativeApplicationVersion || null;
  } catch (_e) {
    return null;
  }
}

// ─── Core logger ─────────────────────────────────────────────────────────────

/**
 * Log an anonymous, install-level app event. Never throws, never blocks the
 * UI, silently no-ops on failure (offline, RLS misconfig, unknown event
 * name, etc.).
 *
 * @param {string} event - MUST be one of EVENT_WHITELIST above.
 * @param {Object} [opts]
 * @param {string|null} [opts.step] - short qualifier (onboarding step name,
 *   paywall trigger source). Caller-controlled, never raw user input.
 * @returns {Promise<void>}
 */
export async function logAppEvent(event, { step = null } = {}) {
  try {
    if (!EVENT_WHITELIST.has(event)) {
      // Not a throw — a future typo/new call site must never crash the UI —
      // but loud enough to catch in dev.
      console.warn('[appAnalytics] dropped non-whitelisted event:', event);
      return;
    }

    const installId = await getInstallId();
    const sessId     = getSessionId();
    const daysSinceLastOpen = event === 'app_open' ? await consumeDaysSinceLastOpen() : null;

    const { error } = await supabase
      .from('app_events')
      .insert([
        {
          install_id: installId,
          session_id: sessId,
          event,
          step: step || null,
          app_version: appVersion(),
          platform: Platform.OS || null,
          days_since_last_open: daysSinceLastOpen,
        },
      ]);

    if (error) {
      console.warn('[appAnalytics]', error.message);
    }
  } catch (_e) {
    // Swallow everything — offline, network error, anything. Fire-and-forget.
  }
}

// ─── first_scan: exactly-once-per-install helper ───────────────────────────

// Cache the in-flight promise so two near-simultaneous calls in the same
// session (e.g. a double-fired effect) can't both pass the "not logged yet"
// check before either finishes persisting it. The AsyncStorage flag is what
// actually makes this once-per-install across launches, not just this cache.
let firstScanPromise = null;

/**
 * Logs 'first_scan' exactly once per install, no matter how many times a
 * caller invokes this (once per real scan, in practice — see
 * ProductScoreScreen.js). Never throws.
 */
export function logFirstScanIfNeeded() {
  if (!firstScanPromise) {
    firstScanPromise = (async () => {
      try {
        const already = await AsyncStorage.getItem(FIRST_SCAN_KEY);
        if (already) return;
        await AsyncStorage.setItem(FIRST_SCAN_KEY, 'true');
        await logAppEvent('first_scan');
      } catch (_e) {
        // Swallow — fire-and-forget, must never block the score screen.
      }
    })();
  }
  return firstScanPromise;
}
