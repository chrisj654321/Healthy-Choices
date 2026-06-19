/**
 * AuthScreen.js
 * Sign In / Create Account screen.
 * Supports: email + password, Sign in with Apple (iOS), Sign in with Google.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Animated,
  ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Colors } from '../constants/colors';
import { supabase } from '../utils/supabase';

// Required for Google OAuth redirect to close the browser tab automatically
WebBrowser.maybeCompleteAuthSession();

// ─── Tab options ──────────────────────────────────────────────────────────────
const TABS = ['Sign In', 'Create Account'];

export default function AuthScreen() {
  const insets = useSafeAreaInsets();

  const [tab,             setTab]             = useState('Sign In');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [loading,         setLoading]         = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Tab switch animation ───────────────────────────────────────────────────
  const switchTab = (newTab) => {
    setTab(newTab);
    setPassword('');
    setConfirmPassword('');
  };

  // ── Email + password ───────────────────────────────────────────────────────
  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    if (tab === 'Create Account' && password !== confirmPassword) {
      Alert.alert('Passwords don\'t match', 'Please make sure both passwords match.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const { error } =
      tab === 'Sign In'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else if (tab === 'Create Account') {
      Alert.alert(
        'Check your email ✉️',
        'We sent a confirmation link to ' + email.trim() + '. Click it to activate your account.',
      );
    }
  };

  // ── Forgot password ────────────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter your email', 'Type your email address above, then tap Forgot Password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Email sent', 'Check your inbox for a password reset link.');
    }
  };

  // ── Sign in with Apple ─────────────────────────────────────────────────────
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        setLoading(true);
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token:    credential.identityToken,
        });
        setLoading(false);
        if (error) Alert.alert('Apple Sign In Error', error.message);
      }
    } catch (e) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Apple Sign In Error', e.message);
      }
    }
  };

  // ── Sign in with Google ────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      const redirectUrl = AuthSession.makeRedirectUri({ scheme: 'healthychoices', path: 'auth/callback' });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options:  {
          redirectTo:       redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) { setLoading(false); Alert.alert('Google Sign In Error', error.message); return; }

      const result = await WebBrowser.openAuthSessionAsync(data?.url, redirectUrl);

      if (result.type === 'success') {
        const url = new URL(result.url);
        const params = new URLSearchParams(url.hash.slice(1));
        const accessToken  = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken) {
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        }
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      Alert.alert('Google Sign In Error', e.message);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={[s.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Brand header ── */}
          <View style={s.header}>
            <LinearGradient colors={[Colors.primary, Colors.primaryDark ?? '#157A5A']} style={s.logoWrap}>
              <Ionicons name="leaf" size={34} color="#fff" />
            </LinearGradient>
            <Text style={s.appName}>Shelf Exposé</Text>
            <Text style={s.tagline}>The truth behind your food.</Text>
          </View>

          {/* ── Tab switcher ── */}
          <View style={s.tabBar}>
            {TABS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[s.tabBtn, tab === t && s.tabBtnActive]}
                onPress={() => switchTab(t)}
                activeOpacity={0.75}
              >
                <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Email + password form ── */}
          <View style={s.form}>
            <View style={s.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="Email address"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="Password"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType={tab === 'Create Account' ? 'next' : 'done'}
                onSubmitEditing={tab === 'Sign In' ? handleEmailAuth : undefined}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={s.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {tab === 'Create Account' && (
              <View style={s.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="Confirm password"
                  placeholderTextColor={Colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleEmailAuth}
                />
              </View>
            )}

            {tab === 'Sign In' && (
              <TouchableOpacity onPress={handleForgotPassword} style={s.forgotWrap}>
                <Text style={s.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[s.ctaBtn, loading && { opacity: 0.7 }]}
              onPress={handleEmailAuth}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={s.ctaText}>{tab === 'Sign In' ? 'Sign In' : 'Create Account'}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Divider ── */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or continue with</Text>
            <View style={s.dividerLine} />
          </View>

          {/* ── Social buttons ── */}
          <View style={s.socialButtons}>

            {/* Sign in with Apple — iOS only */}
            {Platform.OS === 'ios' && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={14}
                style={s.appleBtn}
                onPress={handleAppleSignIn}
              />
            )}

            {/* Sign in with Google */}
            <TouchableOpacity style={s.googleBtn} onPress={handleGoogleSignIn} activeOpacity={0.85}>
              {/* Google logo — four-colour G per brand guidelines */}
              <View style={s.googleIconWrap}>
                <Text style={s.googleG}>
                  <Text style={{ color: '#4285F4' }}>G</Text>
                  <Text style={{ color: '#EA4335' }}>o</Text>
                  <Text style={{ color: '#FBBC05' }}>o</Text>
                  <Text style={{ color: '#4285F4' }}>g</Text>
                  <Text style={{ color: '#34A853' }}>l</Text>
                  <Text style={{ color: '#EA4335' }}>e</Text>
                </Text>
              </View>
              <Text style={s.googleText}>Continue with Google</Text>
            </TouchableOpacity>

          </View>

          {/* ── Legal fine print ── */}
          <Text style={s.legal}>
            By continuing you agree to our{' '}
            <Text style={s.legalLink} onPress={() => WebBrowser.openBrowserAsync('https://shelfexpose.netlify.app/terms')}>
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text style={s.legalLink} onPress={() => WebBrowser.openBrowserAsync('https://shelfexpose.netlify.app/privacy')}>
              Privacy Policy
            </Text>.
          </Text>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 26, paddingTop: 32, paddingBottom: 48 },

  // Header
  header:   { alignItems: 'center', marginBottom: 36 },
  logoWrap: {
    width: 80, height: 80, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    shadowColor: Colors.primary, shadowOpacity: 0.35,
    shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  appName:  { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  tagline:  { fontSize: 14, color: Colors.textMuted },

  // Tabs
  tabBar:       {
    flexDirection: 'row', backgroundColor: Colors.border,
    borderRadius: 14, padding: 4, marginBottom: 24,
  },
  tabBtn:       { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 11 },
  tabBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  tabText:      { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  tabTextActive:{ color: Colors.textPrimary, fontWeight: '700' },

  // Form
  form:       { gap: 12, marginBottom: 24 },
  inputWrap:  {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, height: 52,
  },
  inputIcon:  { marginRight: 10 },
  input:      { flex: 1, fontSize: 15, color: Colors.textPrimary },
  eyeBtn:     { padding: 10 },
  forgotWrap: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 4, marginTop: -4 },
  forgotText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  ctaBtn:  {
    backgroundColor: Colors.primary, borderRadius: 14,
    height: 52, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.4,
    shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 5,
    marginTop: 4,
  },
  ctaText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  // Divider
  divider:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },

  // Social
  socialButtons: { gap: 12, marginBottom: 24 },
  appleBtn:      { height: 52, width: '100%' },
  googleBtn:     {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 14, height: 52,
    borderWidth: 1.5, borderColor: Colors.border,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  googleIconWrap: { alignItems: 'center', justifyContent: 'center' },
  googleG:        { fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  googleText:     { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },

  // Legal
  legal:     { fontSize: 11, color: Colors.textMuted, textAlign: 'center', lineHeight: 17 },
  legalLink: { color: Colors.primary, fontWeight: '600' },
});
