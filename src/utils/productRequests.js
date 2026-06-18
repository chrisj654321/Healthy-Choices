/**
 * productRequests.js
 * Utility for logging product view/request events to Supabase.
 */

import { supabase } from './supabase';

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
