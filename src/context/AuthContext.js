/**
 * AuthContext.js
 * Provides the current user session throughout the app.
 * Also keeps RevenueCat's user identity in sync with Supabase auth.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { identifyRCUser, resetRCUser } from '../utils/subscription';

const AuthContext = createContext({
  user:        null,
  session:     null,
  authLoading: true,
  signOut:     async () => {},
});

export function AuthProvider({ children }) {
  const [session,     setSession]     = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Load existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      // Identify RC user if already logged in (e.g. app relaunch)
      if (session?.user?.id) {
        identifyRCUser(session.user.id);
      }
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

        if (event === 'SIGNED_OUT') {
          // Reset RC to anonymous so the next user starts clean.
          resetRCUser();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // resetRCUser() is called automatically via the SIGNED_OUT event above
  };

  return (
    <AuthContext.Provider
      value={{
        user:        session?.user ?? null,
        session,
        authLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
