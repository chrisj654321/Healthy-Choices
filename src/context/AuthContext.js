/**
 * AuthContext.js
 * Provides the current user session throughout the app.
 * Also keeps RevenueCat's user identity in sync with Supabase auth.
 */

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '../utils/supabase';
import { identifyRCUser, resetRCUser } from '../utils/subscription';

const AuthContext = createContext({
  user:             null,
  session:          null,
  authLoading:      true,
  passwordRecovery: false,
  clearPasswordRecovery: () => {},
  signOut:          async () => {},
});

// Magic links (password recovery, signup confirmation) open the app via a
// plain OS deep link rather than the in-app browser session Google sign-in
// uses, so nothing else in the app observes them. detectSessionInUrl is off
// (required for React Native — see supabase.js), so we have to pull the
// PKCE `code` out of the incoming URL ourselves and exchange it manually.
//
// Password-reset links use a dedicated `reset-password` redirect path (see
// AuthScreen's handleForgotPassword) so we can tell them apart from a Google
// OAuth callback (`auth/callback`) just by looking at the URL — we don't
// rely on supabase-js's PASSWORD_RECOVERY event firing, because that event
// only fires when the PKCE code-verifier it stashed in SecureStore still has
// its `/recovery` suffix, and silently doesn't fire otherwise. Instead, on a
// recovery link we exchange the code ourselves and flip `passwordRecovery`
// directly on success; the PASSWORD_RECOVERY listener in AuthProvider below
// is kept purely as a backup. Supabase can also append an error to a
// recovery link (expired/already-used code) as query params or in the
// `#fragment` — we check both and surface a friendly alert instead of
// attempting an exchange that's guaranteed to fail.
function isPasswordRecoveryUrl(url) {
  return url.includes('reset-password');
}

function extractUrlError(url) {
  const parts = url.split(/[?#]/).slice(1); // everything after the first ? or #
  for (const part of parts) {
    const params = new URLSearchParams(part);
    const errorCode = params.get('error_code') || params.get('error');
    if (errorCode) {
      return { errorCode, errorDescription: params.get('error_description') };
    }
  }
  return null;
}

function friendlyRecoveryErrorMessage(errorCode) {
  if (errorCode === 'otp_expired') {
    return 'This reset link has expired or was already used. Please request a new one from the sign-in screen.';
  }
  return 'This reset link is no longer valid. Please request a new one from the sign-in screen.';
}

export function AuthProvider({ children }) {
  const [session,          setSession]          = useState(null);
  const [authLoading,      setAuthLoading]      = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  // The same incoming URL can arrive twice on cold start (once from
  // Linking.getInitialURL(), once from the 'url' event listener firing on
  // mount) — without this guard we'd try to exchange an already-used PKCE
  // code a second time and surface a spurious "expired link" alert.
  const lastHandledUrl = useRef(null);

  async function handleIncomingAuthUrl(url) {
    if (!url || url === lastHandledUrl.current) return;
    lastHandledUrl.current = url;

    let code;
    try {
      code = new URL(url).searchParams.get('code');
    } catch {
      return;
    }

    const isRecovery = isPasswordRecoveryUrl(url);

    if (isRecovery) {
      const urlError = extractUrlError(url);
      if (urlError) {
        Alert.alert('Reset link problem', friendlyRecoveryErrorMessage(urlError.errorCode));
        return;
      }
    }

    if (!code) return;

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (isRecovery) {
      if (error) {
        // exchangeCodeForSession failures (expired/reused code, missing
        // PKCE verifier) don't carry a stable error_code like the URL-level
        // ones do, so we fall back to the same generic friendly message.
        Alert.alert('Reset link problem', friendlyRecoveryErrorMessage(null));
      } else {
        setPasswordRecovery(true);
      }
      return;
    }

    // Non-recovery link (e.g. Google OAuth callback) — keep prior behavior.
    if (error) console.warn('[Auth] deep-link code exchange failed:', error.message);
  }

  useEffect(() => {
    const syncAuthRefreshWithAppState = (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    // On React Native, Supabase can otherwise keep refreshing auth while the
    // app is backgrounded. iOS may reject SecureStore keychain writes then with
    // "User interaction is not allowed."
    syncAuthRefreshWithAppState(AppState.currentState);
    const appStateSub = AppState.addEventListener('change', syncAuthRefreshWithAppState);

    // Load existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      // Identify RC user if already logged in (e.g. app relaunch)
      if (session?.user?.id) {
        identifyRCUser(session.user.id);
      }
    }).catch((e) => {
      // A corrupted/unreadable stored session must not leave the app
      // stuck on the boot spinner — fall through to the signed-out state.
      console.warn('[Auth] getSession failed:', e.message);
      setAuthLoading(false);
    });

    // Listen for auth state changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setAuthLoading(false);

        if (event === 'SIGNED_IN' && session?.user?.id) {
          // Link RevenueCat to the Supabase user so subscription state
          // follows the account across devices and reinstalls.
          identifyRCUser(session.user.id);
        }

        if (event === 'PASSWORD_RECOVERY') {
          setPasswordRecovery(true);
        }

        if (event === 'SIGNED_OUT') {
          // Reset RC to anonymous so the next user starts clean.
          resetRCUser();
          setPasswordRecovery(false);
        }
      }
    );

    // Catch a magic link that cold-launched the app...
    Linking.getInitialURL().then(handleIncomingAuthUrl);
    // ...or one tapped while the app was already running/backgrounded.
    const linkingSub = Linking.addEventListener('url', ({ url }) => handleIncomingAuthUrl(url));

    return () => {
      supabase.auth.stopAutoRefresh();
      appStateSub.remove();
      subscription.unsubscribe();
      linkingSub.remove();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // resetRCUser() is called automatically via the SIGNED_OUT event above
  };

  return (
    <AuthContext.Provider
      value={{
        user:             session?.user ?? null,
        session,
        authLoading,
        passwordRecovery,
        clearPasswordRecovery: () => setPasswordRecovery(false),
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
