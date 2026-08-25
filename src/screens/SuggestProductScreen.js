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
import { addRequest } from '../utils/productRequests';
import SpecsMascot from '../components/SpecsMascot';
import BackButton from '../components/BackButton';

/**
 * SuggestProductScreen.js
 * The couch entry point into the request loop that used to only start at
 * the scanner's Product Not Found dead-end (see utils/productRequests.js —
 * addRequest already supports this name-based shape). A user doesn't have
 * to be standing in front of a product to ask us to add it, just to know
 * what it's called.
 *
 * Reachable from Profile, right next to My Requests.
 */
export default function SuggestProductScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Product name needed', 'Tell us what the product is called so we can look for it.');
      return;
    }

    setSubmitting(true);
    try {
      await addRequest({ name: trimmedName, brand: brand.trim() || null });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setSubmitted(true);
    } catch (e) {
      // addRequest already saves locally before attempting to sync, so this
      // catch is really just "something unexpected blew up" — the request
      // itself isn't lost even if we land here.
      console.warn('[SuggestProduct] request failed:', e?.message ?? e);
      Alert.alert('Something went wrong', 'Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setName('');
    setBrand('');
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
            We've added this to your requests. Check My Requests any time to see the status.
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
              <Text style={styles.secondaryBtnText}>Suggest another product</Text>
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
          <Text style={styles.headerTitle}>Suggest a product</Text>
          <Text style={styles.headerSub}>
            Don't have it in hand? Tell us what to look for and we'll add it to the queue.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Product name</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Everything Bagel Seasoning"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>Brand (optional)</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Trader Joe's"
              placeholderTextColor={Colors.textMuted}
              value={brand}
              onChangeText={setBrand}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
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
  input: { flex: 1, fontSize: Font.sizes.base, color: Colors.textPrimary },

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
