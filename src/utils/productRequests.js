/**
 * productRequests.js
 * Utility for logging product view/request events to Supabase, plus the
 * local "My Requests" loop: AsyncStorage-backed record of barcodes a user
 * has asked us to add, with best-effort background sync to product_requests.
 *
 * Kept as one module (rather than splitting sync vs. local storage) so the
 * planned Wave-2 SQLite migration only has to touch this file.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { getProductByBarcode } from '../data/productStore';

const REQUESTS_KEY = '@hc_product_requests';

/**
 * Log a product request to the database.
 * Captures: barcode, name, brand, and current user_id (if authenticated).
 *
 * @param {Object} product - Product object with barcode, name, brand
 * @returns {Promise<boolean>} - true on success, false on failure
 */
export async function logProductRequest(product) {
  try {
    // Get current authenticated user (if any)
    let userId = null;
    try {
      const { data } = await supabase.auth.getUser();
      userId = data?.user?.id || null;
    } catch (authError) {
      // If auth call fails, userId stays null; we still log the request
      console.warn('[productRequests] Failed to get user:', authError.message);
    }

    // Insert into product_requests table
    const { error } = await supabase
      .from('product_requests')
      .insert([
        {
          barcode: product.barcode || null,
          name: product.name || null,
          brand: product.brand || null,
          user_id: userId,
        },
      ]);

    if (error) {
      console.warn('[productRequests]', error.message);
      return false;
    }

    return true;
  } catch (e) {
    console.warn('[productRequests]', e.message);
    return false;
  }
}

/**
 * Insert a single request row into product_requests. Shared by addRequest
 * and retryPendingSyncs so both use the exact same column shape as
 * logProductRequest above (barcode, name, brand, user_id).
 */
async function insertRequestRow(barcode) {
  try {
    let userId = null;
    try {
      const { data } = await supabase.auth.getUser();
      userId = data?.user?.id || null;
    } catch (authError) {
      console.warn('[productRequests] Failed to get user:', authError.message);
    }

    const { error } = await supabase
      .from('product_requests')
      .insert([{ barcode: barcode || null, name: null, brand: null, user_id: userId }]);

    if (error) {
      console.warn('[productRequests]', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[productRequests]', e.message);
    return false;
  }
}

async function readLocalRequests() {
  try {
    const raw = await AsyncStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeLocalRequests(list) {
  try {
    await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('[productRequests] failed to persist locally:', e?.message ?? e);
  }
}

/**
 * Record a "request this product" tap from the scanner's Product Not Found
 * dead-end. Always saves locally first (so the user's request is never
 * lost), then tries the Supabase insert. If the insert fails (offline, etc.)
 * the local record is flagged pending and picked up by retryPendingSyncs()
 * on the next addRequest/getRequests call.
 *
 * @param {string} barcode
 * @returns {Promise<{barcode: string, requestedAt: string, pendingSync: boolean}>}
 */
export async function addRequest(barcode) {
  const requestedAt = new Date().toISOString();
  const entry = { barcode, requestedAt, pendingSync: true };

  const list = await readLocalRequests();
  list.unshift(entry);
  await writeLocalRequests(list);

  const synced = await insertRequestRow(barcode);
  if (synced) {
    entry.pendingSync = false;
    await writeLocalRequests(list);
  }

  // Best-effort: clear out any earlier requests that failed to sync before.
  retryPendingSyncs().catch(() => {});

  return entry;
}

/**
 * Retry syncing any locally-saved requests that never made it to Supabase
 * (e.g. the user was offline when they tapped "Request this product").
 * Safe to call often — no-ops instantly if nothing is pending.
 */
export async function retryPendingSyncs() {
  const list = await readLocalRequests();
  const pending = list.filter((r) => r.pendingSync);
  if (pending.length === 0) return;

  let changed = false;
  for (const entry of pending) {
    const synced = await insertRequestRow(entry.barcode);
    if (synced) {
      entry.pendingSync = false;
      changed = true;
    }
  }
  if (changed) await writeLocalRequests(list);
}

/**
 * Read all locally-saved product requests, newest first, each annotated
 * with its current status against the local product database:
 *   - resolved: true + product  → the barcode now resolves (show "Added ✓")
 *   - resolved: false           → still not in our database ("Requested — we're on it")
 * Also fires a best-effort retry of any requests still pending sync.
 */
export async function getRequests() {
  retryPendingSyncs().catch(() => {});
  const list = await readLocalRequests();
  return Promise.all(
    list.map(async (entry) => {
      const product = await getProductByBarcode(entry.barcode);
      return { ...entry, resolved: !!product, product };
    })
  );
}
