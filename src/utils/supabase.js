/**
 * supabase.js
 * Supabase client — auth + database.
 *
 * SETUP (do this once before first build):
 *   1. Go to https://supabase.com → New project
 *   2. Copy "Project URL" and "anon public" key from Settings → API
 *   3. Replace the two placeholder strings below
 *   4. In Supabase Dashboard → Authentication → Providers:
 *        • Enable Apple (you'll need your Apple Service ID + private key)
 *        • Enable Google (you'll need a Google Cloud OAuth client ID)
 *   5. In Supabase → Authentication → URL Configuration:
 *        • Site URL:      healthychoices://
 *        • Redirect URL:  healthychoices://auth/callback
 */

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// ─── Replace these two values with your Supabase project credentials ──────────
const SUPABASE_URL      = 'https://huvxeaegygaeotomdqpc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dnhlYWVneWdhZW90b21kcXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjQxOTAsImV4cCI6MjA5NTkwMDE5MH0.mVg_Ek36OLOHG1GcghuxgRze-yDPdR1DDiKhPn3O-w4';
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Supabase uses SecureStore (encrypted device keychain) instead of
 * AsyncStorage so auth tokens are stored securely.
 *
 * `keychainAccessible: AFTER_FIRST_UNLOCK` (Expo's default is WHEN_UNLOCKED,
 * which requires the device to be unlocked at the exact moment of access) —
 * without this, a token write/read that lands while the device is locked
 * fails with "Error: Calling the 'setValueWithKeyAsync' function has failed
 * → Caused by: User interaction is not allowed" (Sentry REACT-NATIVE-4).
 * AppContext.js already stops Supabase's auto-refresh timer while backgrounded
 * (see `fcd8ff5`) to prevent most of these; this closes the residual race
 * where a refresh already in flight completes its keychain write after the
 * device has locked.
 */
const KEYCHAIN_OPTIONS = { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK };
const SecureStoreAdapter = {
  getItem:    (key) => SecureStore.getItemAsync(key, KEYCHAIN_OPTIONS),
  setItem:    (key, value) => SecureStore.setItemAsync(key, value, KEYCHAIN_OPTIONS),
  removeItem: (key) => SecureStore.deleteItemAsync(key, KEYCHAIN_OPTIONS),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage:            SecureStoreAdapter,
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: false,   // Required for React Native
    flowType:           'pkce',  // Google OAuth handler uses exchangeCodeForSession()
  },
});
