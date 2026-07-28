/**
 * featureRequests.js
 * The "Suggest a Feature" loop, mirroring productRequests.js exactly:
 * AsyncStorage-backed local record (saved FIRST, so a request is never lost)
 * with best-effort background sync to the write-only feature_requests table
 * (see supabase/feature_requests_setup.sql).
 *
 * Unlike product requests there is no "resolved" state — a feature doesn't
 * auto-resolve against the local product DB; shipped features are announced
 * through release notes, not this list.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const FEATURE_REQUESTS_KEY = '@hc_feature_requests';

/**
 * Insert a single request row into feature_requests. Same column shape the
 * SQL setup script creates: title, details, user_id.
 */
async function insertRequestRow({ title, details } = {}) {
  try {
    let userId = null;
    try {
      const { data } = await supabase.auth.getUser();
      userId = data?.user?.id || null;
    } catch (authError) {
      console.warn('[featureRequests] Failed to get user:', authError.message);
    }

    const { error } = await supabase
      .from('feature_requests')
      .insert([{ title: title || null, details: details || null, user_id: userId }]);

    if (error) {
      console.warn('[featureRequests]', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[featureRequests]', e.message);
    return false;
  }
}

async function readLocalRequests() {
  try {
    const raw = await AsyncStorage.getItem(FEATURE_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeLocalRequests(list) {
  try {
    await AsyncStorage.setItem(FEATURE_REQUESTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('[featureRequests] failed to persist locally:', e?.message ?? e);
  }
}

/**
 * Record a "suggest this feature" ask. Always saves locally first, then
 * tries the Supabase insert; offline requests are flagged pendingSync and
 * retried on the next addFeatureRequest/getFeatureRequests call.
 *
 * @param {{title: string, details?: string}} input
 * @returns {Promise<{title: string, details: string|null, requestedAt: string, pendingSync: boolean}>}
 */
export async function addFeatureRequest({ title, details = null } = {}) {
  const requestedAt = new Date().toISOString();
  const entry = { title: title || null, details: details || null, requestedAt, pendingSync: true };

  const list = await readLocalRequests();
  list.unshift(entry);
  await writeLocalRequests(list);

  const synced = await insertRequestRow(entry);
  if (synced) {
    entry.pendingSync = false;
    await writeLocalRequests(list);
  }

  // Best-effort: clear out any earlier requests that failed to sync before.
  retryPendingSyncs().catch(() => {});

  return entry;
}

/**
 * Retry syncing any locally-saved feature requests that never made it to
 * Supabase. Safe to call often — no-ops instantly if nothing is pending.
 */
export async function retryPendingSyncs() {
  const list = await readLocalRequests();
  const pending = list.filter((r) => r.pendingSync);
  if (pending.length === 0) return;

  let changed = false;
  for (const entry of pending) {
    const synced = await insertRequestRow(entry);
    if (synced) {
      entry.pendingSync = false;
      changed = true;
    }
  }
  if (changed) await writeLocalRequests(list);
}

/**
 * Read all locally-saved feature requests, newest first. Also fires a
 * best-effort retry of any requests still pending sync.
 */
export async function getFeatureRequests() {
  retryPendingSyncs().catch(() => {});
  return readLocalRequests();
}
