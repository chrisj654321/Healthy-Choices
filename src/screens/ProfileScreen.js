import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { getUserPrefs, saveUserPrefs, clearScanHistory, getScanHistory } from '../utils/storage';
import { STORES } from '../data/stores';
import { DIET_PREFERENCE_OPTIONS, PRIMARY_GOAL_OPTIONS } from '../data/preferences';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { useProStatus, restorePurchases } from '../utils/subscription';
import RevenueCatUI from 'react-native-purchases-ui';

const DIETARY_OPTIONS = [
  { id: 'vegan', label: 'Vegan', icon: 'leaf' },
  { id: 'vegetarian', label: 'Vegetarian', icon: 'flower' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: 'ban' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: 'water' },
  { id: 'keto', label: 'Keto', icon: 'fitness' },
  { id: 'paleo', label: 'Paleo', icon: 'nutrition' },
  { id: 'low-sugar', label: 'Low Sugar', icon: 'trending-down' },
  { id: 'organic-only', label: 'Organic Only', icon: 'earth' },
];

const ALLERGEN_OPTIONS = [
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree nuts', label: 'Tree Nuts' },
  { id: 'milk', label: 'Dairy / Milk' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'wheat', label: 'Wheat / Gluten' },
  { id: 'soy', label: 'Soy' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
];

export default function ProfileScreen({ navigation }) {
  const insets    = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { isPro } = useProStatus();
  const [prefs,     setPrefs]     = useState(null);
  const [scanCount, setScanCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const [p, history] = await Promise.all([getUserPrefs(), getScanHistory()]);
    setPrefs(p);
    setScanCount(history.length);
  };

  const updatePref = async (key, value) => {
    // Editing a setup section also marks it reviewed (clears the Home nudge).
    const reviewKey = {
      allergens: 'allergensReviewed',
      dietaryFlags: 'dietaryReviewed',
      dietStyle: 'dietaryReviewed',
      primaryGoal: 'goalReviewed',
    }[key];
    const updated = { ...prefs, [key]: value, ...(reviewKey ? { [reviewKey]: true } : {}) };
    setPrefs(updated);
    await saveUserPrefs(updated);
  };

  const toggleArrayPref = async (key, id) => {
    const current = prefs[key] ?? [];
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    await updatePref(key, updated);
  };

  const handleManageSubscription = async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert('Error', 'Unable to open subscription management. Please try again.');
      }
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            try {
              // Server-side deletion first — the edge function removes the
              // Supabase auth user with the service-role key.
              const { error } = await supabase.functions.invoke('delete-account');
              if (error) throw error;

              await clearScanHistory();
              try {
                await signOut();
              } catch {
                // Session is already invalid after deletion — ignore.
              }
              Alert.alert(
                'Account Deleted',
                'Your account and all associated data have been permanently deleted.'
              );
            } catch (e) {
              Alert.alert(
                'Deletion Failed',
                'We could not delete your account right now. Please check your connection and try again, or contact support@healthychoices.app.'
              );
            }
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert('Clear History', 'This will remove all your scan history permanently.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearScanHistory();
          setScanCount(0);
        },
      },
    ]);
  };

  if (!prefs) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7FAF9' }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
    >
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.profileName}>My Profile</Text>
        {user?.email ? (
          <Text style={styles.profileEmail}>{user.email}</Text>
        ) : null}
        {isPro && (
          <View style={styles.proBadge}>
            <Ionicons name="star" size={11} color="#fff" />
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        )}
        <Text style={styles.profileSub}>{scanCount} products scanned</Text>
      </View>

      {/* Sign out */}
      <TouchableOpacity
        style={styles.signOutBtn}
        onPress={() =>
          Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: signOut },
          ])
        }
        activeOpacity={0.75}
      >
        <Ionicons name="log-out-outline" size={18} color="#D93B3B" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Dietary preferences */}
      <SectionHeader title="Dietary Preferences" subtitle="Used to personalize ingredient flags" />
      <View style={styles.chipGrid}>
        {DIETARY_OPTIONS.map((opt) => {
          const active = prefs.dietaryFlags?.includes(opt.id);
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => toggleArrayPref('dietaryFlags', opt.id)}
            >
              <Ionicons name={opt.icon} size={14} color={active ? Colors.white : Colors.primary} />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Diet Approach */}
      <SectionHeader title="Diet Approach" subtitle="How you prefer to eat (select all that apply)" />
      <View style={styles.chipGrid}>
        {DIET_PREFERENCE_OPTIONS.map((opt) => {
          const active = prefs.dietStyle?.includes(opt.value);
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => toggleArrayPref('dietStyle', opt.value)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Primary Goal */}
      <SectionHeader title="Primary Goal" subtitle="Your top nutrition priority right now" />
      <View style={styles.chipGrid}>
        {PRIMARY_GOAL_OPTIONS.map((opt) => {
          const active = prefs.primaryGoal === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => updatePref('primaryGoal', active ? null : opt.value)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Allergens */}
      <SectionHeader title="Allergen Alerts" subtitle="Get warnings when these are detected" />
      <View style={styles.allergenList}>
        <TouchableOpacity
          style={styles.allergenRow}
          onPress={() => updatePref('allergens', [])}
        >
          <View style={styles.allergenLeft}>
            <View style={[styles.allergenCheck, (prefs.allergens?.length ?? 0) === 0 && styles.allergenCheckActive]}>
              {(prefs.allergens?.length ?? 0) === 0 && <Ionicons name="checkmark" size={12} color={Colors.white} />}
            </View>
            <Text style={styles.allergenLabel}>No allergies</Text>
          </View>
        </TouchableOpacity>
        {ALLERGEN_OPTIONS.map((opt) => {
          const active = prefs.allergens?.includes(opt.id);
          return (
            <TouchableOpacity
              key={opt.id}
              style={styles.allergenRow}
              onPress={() => toggleArrayPref('allergens', opt.id)}
            >
              <View style={styles.allergenLeft}>
                <View style={[styles.allergenCheck, active && styles.allergenCheckActive]}>
                  {active && <Ionicons name="checkmark" size={12} color={Colors.white} />}
                </View>
                <Text style={styles.allergenLabel}>{opt.label}</Text>
              </View>
              {active && (
                <View style={styles.alertBadge}>
                  <Ionicons name="notifications" size={12} color={Colors.flagRed} />
                  <Text style={styles.alertBadgeText}>Alert On</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* My Stores */}
      <SectionHeader title="My Stores" subtitle="Select the stores you shop at most" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storeScroller}
      >
        {STORES.map((item) => {
          const active = prefs.favoriteStores?.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.storeChip, active && styles.storeChipActive]}
              onPress={() => toggleArrayPref('favoriteStores', item.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.storeEmoji}>{item.emoji}</Text>
              <Text style={[styles.storeLabel, active && styles.storeLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* App settings */}
      <SectionHeader title="Display Settings" />
      <View style={styles.settingsCard}>
        <ToggleRow
          label="Show Lobbying Data"
          sublabel="Display corporate lobbying information"
          value={prefs.showLobbying}
          onToggle={(v) => updatePref('showLobbying', v)}
        />
        <ToggleRow
          label="Show Political Donations"
          sublabel="Display donation split on company profiles"
          value={prefs.showDonations}
          onToggle={(v) => updatePref('showDonations', v)}
          last
        />
      </View>

      {/* Data */}
      <SectionHeader title="Data & Privacy" />
      <View style={styles.settingsCard}>
        {isPro ? (
          <TouchableOpacity style={styles.manageRow} onPress={handleManageSubscription}>
            <Ionicons name="card-outline" size={18} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.manageLabel}>Manage Subscription</Text>
              <Text style={styles.manageSub}>Cancel, pause, or view billing details</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.manageRow}
            onPress={async () => {
              const success = await restorePurchases();
              if (success) {
                Alert.alert('Restored', 'Your Pro access has been restored!');
              } else {
                Alert.alert('Nothing to Restore', 'No active subscription found for this Apple ID.');
              }
            }}
          >
            <Ionicons name="refresh-outline" size={18} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.manageLabel}>Restore Purchases</Text>
              <Text style={styles.manageSub}>Already subscribed? Tap to restore access.</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.dangerRow} onPress={handleClearHistory}>
          <Ionicons name="trash-outline" size={18} color={Colors.flagRed} />
          <View style={{ flex: 1 }}>
            <Text style={styles.dangerLabel}>Clear Scan History</Text>
            <Text style={styles.dangerSub}>{scanCount} entries stored locally</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dangerRow, { borderTopWidth: 1, borderTopColor: Colors.border }]} onPress={handleDeleteAccount}>
          <Ionicons name="person-remove-outline" size={18} color={Colors.flagRed} />
          <View style={{ flex: 1 }}>
            <Text style={styles.dangerLabel}>Delete Account</Text>
            <Text style={styles.dangerSub}>Permanently remove your account and data</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.about}>
        <Text style={styles.aboutText}>Shelf Exposé v1.0</Text>
        <Text style={styles.aboutSub}>
          Ingredient scoring, corporate transparency, and dietary personalization.
          Your scan history and preferences stay on your device.
        </Text>
      </View>
    </ScrollView>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <View style={shStyles.wrap}>
      <Text style={shStyles.title}>{title}</Text>
      {subtitle && <Text style={shStyles.sub}>{subtitle}</Text>}
    </View>
  );
}
const shStyles = StyleSheet.create({
  wrap: { marginTop: 24, marginBottom: 10 },
  title: { fontSize: Font.sizes.md, fontWeight: Font.weights.bold, color: Colors.textPrimary },
  sub: { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 2 },
});

function ToggleRow({ label, sublabel, value, onToggle, last = false, disabled = false }) {
  return (
    <View style={[trStyles.row, !last && trStyles.rowBorder, disabled && { opacity: 0.45 }]}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={trStyles.label}>{label}</Text>
        {sublabel && <Text style={trStyles.sub}>{sublabel}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={disabled ? undefined : onToggle}
        disabled={disabled}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={Colors.white}
      />
    </View>
  );
}
const trStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { fontSize: Font.sizes.base, fontWeight: Font.weights.medium, color: Colors.textPrimary },
  sub: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 60 },

  profileHeader: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileName:  { fontSize: Font.sizes.xl, fontWeight: Font.weights.heavy, color: Colors.textPrimary },
  profileEmail: { fontSize: Font.sizes.sm, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  profileSub:   { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 4 },
  signOutBtn:   {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    marginHorizontal: 24, marginBottom: 10, paddingVertical: 12,
    borderRadius: 12, backgroundColor: '#FEF0F0',
    borderWidth: 1, borderColor: '#FBDADA',
  },
  signOutText:  { fontSize: 14, fontWeight: '700', color: '#D93B3B' },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: Colors.primaryLight, borderWidth: 1.5, borderColor: Colors.primary },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.medium, color: Colors.primary },
  chipTextActive: { color: Colors.white },

  allergenList: { backgroundColor: Colors.white, borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  allergenRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  allergenLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  allergenCheck: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  allergenCheckActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  allergenLabel: { fontSize: Font.sizes.base, color: Colors.textPrimary },
  alertBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.dangerLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  alertBadgeText: { fontSize: Font.sizes.xs, color: Colors.flagRed, fontWeight: Font.weights.medium },

  storeScroller: { paddingVertical: 4, gap: 10 },
  storeChip: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: 82,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  storeChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  storeEmoji: { fontSize: 22 },
  storeLabel: { fontSize: Font.sizes.xs, fontWeight: Font.weights.medium, color: Colors.textSecondary, textAlign: 'center' },
  storeLabelActive: { color: Colors.primary },

  settingsCard: { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },

  proBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3, marginTop: 6,
  },
  proBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  manageRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  manageLabel: { fontSize: Font.sizes.base, fontWeight: Font.weights.medium, color: Colors.textPrimary },
  manageSub: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },

  dangerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  dangerLabel: { fontSize: Font.sizes.base, fontWeight: Font.weights.medium, color: Colors.flagRed },
  dangerSub: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },

  about: { alignItems: 'center', paddingVertical: 32, gap: 6 },
  aboutText: { fontSize: Font.sizes.sm, color: Colors.textMuted, fontWeight: Font.weights.medium },
  aboutSub: { fontSize: Font.sizes.xs, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
});
