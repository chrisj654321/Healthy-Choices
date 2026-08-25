/**
 * ResetPasswordScreen.js
 * Shown instead of the main app when a PASSWORD_RECOVERY session is active
 * (i.e. the user tapped a "reset password" email link). Lets them set a new
 * password, then hands control back to AppNavigator's normal auth flow.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { clearPasswordRecovery, signOut } = useAuth();

  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword]  = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [loading,         setLoading]         = useState(false);

  const handleSetPassword = async () => {
    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords don\'t match', 'Please make sure both passwords match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    clearPasswordRecovery();
    Alert.alert('Password updated', 'Your password has been changed.');
  };

  const handleCancel = async () => {
    clearPasswordRecovery();
    await signOut();
  };

  return (
    <KeyboardAvoidingView
      style={[s.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.content}>
        <View style={s.header}>
          <View style={s.iconWrap}>
            <Ionicons name="lock-closed" size={30} color="#fff" />
          </View>
          <Text style={s.title}>Set a new password</Text>
          <Text style={s.subtitle}>Choose a new password for your account.</Text>
        </View>

        <View style={s.inputWrap}>
          <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={s.inputIcon} />
          <TextInput
            style={s.input}
            placeholder="New password"
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            returnKeyType="next"
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={s.eyeBtn}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={s.inputWrap}>
          <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={s.inputIcon} />
          <TextInput
            style={s.input}
            placeholder="Confirm new password"
            placeholderTextColor={Colors.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSetPassword}
          />
        </View>

        <TouchableOpacity
          style={[s.ctaBtn, loading && { opacity: 0.7 }]}
          onPress={handleSetPassword}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={s.ctaText}>Update password</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCancel} style={s.cancelWrap}>
          <Text style={s.cancelText}>Cancel and sign in again</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 26 },

  header:  { alignItems: 'center', marginBottom: 32 },
  iconWrap: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  title:    { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, height: 52,
    marginBottom: 12,
  },
  inputIcon: { marginRight: 10 },
  input:     { flex: 1, fontSize: 15, color: Colors.textPrimary },
  eyeBtn:    { padding: 10 },

  ctaBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    height: 52, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.4,
    shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 5,
    marginTop: 8,
  },
  ctaText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  cancelWrap: { alignSelf: 'center', paddingVertical: 16 },
  cancelText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
});
