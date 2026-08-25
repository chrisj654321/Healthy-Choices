import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { addFeatureRequest } from '../utils/featureRequests';
import SpecsMascot from '../components/SpecsMascot';
import BackButton from '../components/BackButton';

/**
 * SuggestFeatureScreen.js
 * The feature-side twin of SuggestProductScreen — an easy in-app channel for
 * users to tell us what the app is missing. Requests land in the write-only
 * feature_requests table (plus the local My Requests list) so demand can be
 * ranked the same way product requests feed Octavius.
 *
 * Reachable from Profile, right next to Suggest a Product.
 */
export default function SuggestFeatureScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Feature needed', 'Tell us what you\'d like the app to do.');
      return;
    }

    setSubmitting(true);
    try {
      await addFeatureRequest({ title: trimmedTitle, details: details.trim() || null });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setSubmitted(true);
    } catch (e) {
      // addFeatureRequest saves locally before attempting to sync, so this
      // catch is really just "something unexpected blew up" — the request
      // itself isn't lost even if we land here.
      console.warn('[SuggestFeature] request failed:', e?.message ?? e);
      Alert.alert('Something went wrong', 'Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setTitle('');
    setDetails('');
    setSubmitted(false);
  };

  // ── Success state ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <BackButton navigation={navigation} />
        <View style={styles.successWrap}>
          <SpecsMascot clip="backflip" size={110} />
          <Text style={styles.successTitle}>Got it!</Text>
          <Text style={styles.successSubtitle}>
            Thanks for the idea — it goes straight to the founder. Check My Requests any time to see what you've suggested.
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('MyRequests')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>View My Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleAddAnother}>
              <Text style={styles.secondaryBtnText}>Suggest another feature</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <BackButton navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Suggest a feature</Text>
          <Text style={styles.headerSub}>
            What's missing? Tell us what would make the app more useful for you.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>What would you like?</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Scan history search"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
              autoCapitalize="sentences"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>Tell us more (optional)</Text>
          <View style={[styles.inputWrap, styles.multilineWrap]}>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="What problem would this solve for you?"
              placeholderTextColor={Colors.textMuted}
              value={details}
              onChangeText={setDetails}
              autoCapitalize="sentences"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  header: { paddingLeft: 64, paddingTop: 16, paddingBottom: 24 },
  headerTitle: { fontSize: Font.sizes.xl, fontWeight: Font.weights.heavy, color: Colors.textPrimary },
  headerSub: { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 6, lineHeight: 20 },

  form: { gap: 8 },
  label: { fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.textSecondary, marginTop: 8, marginBottom: 2 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, height: 52,
  },
  multilineWrap: { height: 120, alignItems: 'flex-start', paddingVertical: 12 },
  input: { flex: 1, fontSize: Font.sizes.base, color: Colors.textPrimary },
  multilineInput: { height: '100%' },

  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    height: 52, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.35,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4,
    marginTop: 20,
  },
  primaryBtnText: { fontSize: Font.sizes.base, fontWeight: Font.weights.bold, color: Colors.white },

  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 6 },
  successTitle: { fontSize: Font.sizes.xl, fontWeight: Font.weights.heavy, color: Colors.textPrimary, marginTop: 12 },
  successSubtitle: { fontSize: Font.sizes.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  buttonGroup: { width: '100%' },
  secondaryBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  secondaryBtnText: { fontSize: Font.sizes.sm, color: Colors.primary, fontWeight: Font.weights.semibold },
});
