/**
 * AuthContext.js
 * Provides the current user session throughout the app.
 * Also keeps RevenueCat's user identity in sync with Supabase auth.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
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
async function handleIncomingAuthUrl(url) {
  if (!url) return;
  let code;
  try {
    code = new URL(url).searchParams.get('code');
  } catch {
    return;
  }
  if (!code) return;

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) console.warn('[Auth] deep-link code exchange failed:', error.message);
}

export function AuthProvider({ children }) {
  const [session,          setSession]          = useState(null);
  const [authLoading,      setAuthLoading]      = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
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
