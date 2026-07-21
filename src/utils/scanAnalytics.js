/**
 * scanAnalytics.js
 * Anonymous, aggregate-only product-interaction analytics.
 *
 * ── ANONYMITY CONTRACT ──────────────────────────────────────────────────────
 * This module logs ONLY: barcode, category, score, grade, and source
 * ('scan' | 'search' | 'history' | 'category' | 'home'). It NEVER reads,
 * generates, or stores a user id, email, device id, IDFA, or any session
 * identifier. There is no linkage to a Food Exposé account or any other
 * account. The data exists solely so the founder can see aggregate trends —
 * which products/categories/ingredients shoppers scan — never who scanned
 * them.
 *
 * This is intentional and load-bearing for our Apple ATT posture: because
 * nothing here identifies a user or device, none of it constitutes
 * "tracking" under Apple's App Tracking Transparency framework, and no
 * ATT prompt or third-party SDK is required. Do not add a user id, auth
 * call, device id, or any other identifier to this file — doing so would
 * turn this into tracking and break that posture.
 *
 * Fire-and-forget: every exported function silently no-ops on any failure
 * (offline, RLS misconfig, etc.) and never throws, so it can never block
 * or crash the UI.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { supabase } from './supabase';

const DEDUPE_WINDOW_MS = 30 * 1000;

// In-memory only — cleared on app restart. Not persisted, not an identifier.
// Keyed by `${barcode}::${source}` -> last-logged timestamp (ms).
const recentLogs = new Map();

function shouldLog(barcode, source) {
  const key = `${barcode}::${source}`;
  const now = Date.now();
  const last = recentLogs.get(key);
  if (last !== undefined && now - last < DEDUPE_WINDOW_MS) {
    return false;
  }
  recentLogs.set(key, now);
  return true;
}

/**
 * Log an anonymous product-interaction event.
 * Never throws. Never blocks. Silently no-ops on failure or offline.
 *
 * @param {Object} params
 * @param {string} params.barcode - Product barcode (required)
 * @param {string|null} [params.category] - Product category
 * @param {number|null} [params.score] - Computed health score
 * @param {string|null} [params.grade] - Computed letter grade
 * @param {string} [params.source] - One of 'scan' | 'search' | 'history' | 'category' | 'home'
 * @returns {Promise<void>}
 */
export async function logProductEvent({ barcode, category = null, score = null, grade = null, source = 'scan' } = {}) {
  try {
    if (!barcode) return;

    if (!shouldLog(barcode, source)) return;

    const { error } = await supabase
      .from('scan_events')
      .insert([
        {
          barcode: String(barcode),
          category: category || null,
          score: typeof score === 'number' ? score : null,
          grade: grade || null,
          source: source || 'scan',
        },
      ]);

    if (error) {
      // Silently no-op — analytics must never surface errors to the user.
      console.warn('[scanAnalytics]', error.message);
    }
  } catch (_e) {
    // Swallow everything — offline, network error, anything. Fire-and-forget.
  }
}
