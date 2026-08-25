import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { getUserPrefs, saveUserPrefs, clearScanHistory, getScanHistory } from '../utils/storage';
import { getRequests } from '../utils/productRequests';
import { getPantryStats } from '../utils/pantryStats';
import { scoreToColor } from '../utils/scorer';
import {
  getPermissionStatus,
  isOptedIn,
  isWeeklyEnabled,
  optInToNotifications,
  optBackIntoNotifications,
  optOutOfNotifications,
  setWeeklyReminders,
} from '../utils/notifications';
import { STORES } from '../data/stores';
import { COMPANY_DB } from '../data/companies';
import { STORE_LOGOS } from '../data/onboardingAssets';
import { DIET_PREFERENCE_OPTIONS, PRIMARY_GOAL_OPTIONS } from '../data/preferences';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { useProStatus, restorePurchases } from '../utils/subscription';
import RevenueCatUI from 'react-native-purchases-ui';

// Store id (src/data/stores.js) → companies.js key, for the retailers that
// already have a `logo` entry in COMPANY_DB. Stores not listed here (and any
// whose companies.js entry has no logo) fall back to a letter tile.
// Shared with OnboardingScreen's "favorite stores" step — single source of truth.
export const STORE_LOGO_MAP = {
  walmart: 'walmart',
  kroger: 'kroger',
  costco: 'costco',
  target: 'target',
  'trader-joes': 'trader-joes',
  aldi: 'aldi',
  publix: 'publix',
  heb: 'heb',
  wegmans: 'wegmans',
  'whole-foods': 'amazon',
};

export function StoreLogo({ storeId, label, size = 40 }) {
  const localLogo = STORE_LOGOS[storeId];
  const companyKey = STORE_LOGO_MAP[storeId];
  const logoUri = companyKey ? COMPANY_DB[companyKey]?.logo : null;
  const tileStyle = [
    logoStyles.tile,
    { width: size, height: size, borderRadius: size * 0.28 },
    (localLogo || logoUri) && logoStyles.tileWithLogo,
  ];
  if (localLogo) {
    return (
      <View style={tileStyle}>
        <Image
          source={localLogo}
          style={{ width: size * 0.68, height: size * 0.68 }}
          resizeMode="contain"
        />
      </View>
    );
  }
  if (logoUri) {
    return (
      <View style={tileStyle}>
        <Image
          source={{ uri: logoUri }}
          style={{ width: size * 0.68, height: size * 0.68 }}
          resizeMode="contain"
        />
      </View>
    );
  }
  return (
    <View style={[tileStyle, logoStyles.tileFallback]}>
      <Text style={[logoStyles.fallbackText, { fontSize: size * 0.4 }]}>
        {(label || '?').charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const logoStyles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 5,
  },
  tileWithLogo: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tileFallback: {
    backgroundColor: Colors.primaryLight,
  },
  fallbackText: {
    fontWeight: Font.weights.heavy,
    color: Colors.primary,
  },
});

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
  const [notifStatus, setNotifStatus] = useState({ permission: 'undetermined', optedIn: false, weekly: true });
  const [requestCount, setRequestCount] = useState(0);
  const [pantryStats, setPantryStats] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const [p, history, permission, optedIn, weekly, requests, stats] = await Promise.all([
      getUserPrefs(),
      getScanHistory(),
      getPermissionStatus(),
      isOptedIn(),
      isWeeklyEnabled(),
      getRequests(),
      getPantryStats(),
    ]);
    setPrefs(p);
    setScanCount(history.length);
    setNotifStatus({ permission, optedIn, weekly });
    setRequestCount(requests.length);
    setPantryStats(stats);
  };

  const handleSeeBetterPicks = () => {
    Haptics.selectionAsync().catch(() => {});
    navigation.navigate('ProductScore', { product: pantryStats.lowestProduct.product });
  };

  // Master toggle reflects "OS permission granted AND user opted in".
  const notifMasterOn = notifStatus.permission === 'granted' && notifStatus.optedIn;

  const handleNotifMasterToggle = async (value) => {
    if (value) {
      if (notifStatus.permission === 'denied') {
        // Can't re-prompt the system dialog once denied — send the user to Settings.
        Linking.openSettings();
        return;
      }
      if (notifStatus.permission === 'undetermined') {
        const granted = await optInToNotifications();
        setNotifStatus((s) => ({ ...s, permission: granted ? 'granted' : 'denied', optedIn: granted }));
        return;
      }
      // Already granted at the OS level — just resume our own schedule.
      await optBackIntoNotifications();
      setNotifStatus((s) => ({ ...s, optedIn: true }));
    } else {
      await optOutOfNotifications();
      setNotifStatus((s) => ({ ...s, optedIn: false }));
    }
  };

  const handleWeeklyToggle = async (value) => {
    await setWeeklyReminders(value);
    setNotifStatus((s) => ({ ...s, weekly: value }));
  };

  const updatePref = async (key, value) => {
    // Editing a setup section also marks it reviewed (clears the Home nudge).
    const reviewKey = {
      allergens: 'allergensReviewed',
      dietaryFlags: 'dietaryReviewed',
      dietStyle: 'dietaryReviewed',
      primaryGoal: 'goalReviewed',
      favoriteStores: 'storesReviewed',
    }[key];
    const updated = { ...prefs, [key]: value, ...(reviewKey ? { [reviewKey]: true } : {}) };
    setPrefs(updated);
    await saveUserPrefs(updated);
  };

  const toggleArrayPref = async (key, id) => {
    Haptics.selectionAsync().catch(() => {});
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
                'We could not delete your account right now. Please check your connection and try again, or contact jamesadventuremarketing@gmail.com.'
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
        <Text style={styles.profileSub}>{scanCount} product{scanCount !== 1 ? 's' : ''} scanned</Text>
      </View>

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
              <StoreLogo storeId={item.id} label={item.label} size={40} />
              <Text style={[styles.storeLabel, active && styles.storeLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pantry Report Card */}
      {pantryStats && (
        <>
          <SectionHeader title="Your Pantry Report Card" subtitle="A quick look at what you've scanned so far" />
          <View style={styles.settingsCard}>
            <View style={styles.pantryScoreRow}>
              <View>
                <Text style={styles.pantryScanCount}>
                  {pantryStats.totalScans} product{pantryStats.totalScans !== 1 ? 's' : ''} scanned
                </Text>
                {pantryStats.scansThisWeek > 0 && (
                  <Text style={styles.pantryScanSub}>{pantryStats.scansThisWeek} this week</Text>
                )}
              </View>
              <View style={styles.pantryAverageWrap}>
                <Text style={[styles.pantryAverageNumber, { color: scoreToColor(pantryStats.averageScore) }]}>
                  {pantryStats.averageScore}
                </Text>
                <Text style={styles.pantryAverageLabel}>avg score</Text>
              </View>
            </View>

            <View style={styles.pantryDivider} />

            <View style={styles.pantryHighlightRow}>
              <Ionicons name="trophy-outline" size={16} color={Colors.primary} />
              <Text style={styles.pantryHighlightText}>
                Your best pick: <Text style={styles.pantryHighlightStrong}>{pantryStats.bestProduct.name}</Text>{' '}
                ({pantryStats.bestProduct.score})
              </Text>
            </View>

            {pantryStats.lowestProduct?.product && (
              <TouchableOpacity style={styles.pantryHighlightRowTappable} onPress={handleSeeBetterPicks}>
                <Ionicons name="trending-up-outline" size={16} color={Colors.textSecondary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.pantryHighlightText}>
                    Room to improve: <Text style={styles.pantryHighlightStrong}>{pantryStats.lowestProduct.name}</Text>{' '}
                    ({pantryStats.lowestProduct.score})
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {/* Notifications */}
      <SectionHeader title="Notifications" subtitle="Gentle nudges — never required, always optional" />
      <View style={styles.settingsCard}>
        <ToggleRow
          label="Reminders"
          sublabel={
            notifStatus.permission === 'denied'
              ? 'Blocked in iOS Settings — tap to open'
              : 'Occasional nudges to check your pantry'
          }
          value={notifMasterOn}
          onToggle={handleNotifMasterToggle}
        />
        <ToggleRow
          label="Weekly reminders"
          sublabel="One reminder on Saturday morning, grocery-run timing"
          value={notifMasterOn && notifStatus.weekly}
          onToggle={handleWeeklyToggle}
          disabled={!notifMasterOn}
          last
        />
      </View>

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
        <TouchableOpacity
          style={styles.manageRow}
          onPress={() => navigation.navigate('MyRequests')}
        >
          <Ionicons name="file-tray-outline" size={18} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.manageLabel}>My Requests</Text>
            <Text style={styles.manageSub}>
              {requestCount === 0 ? 'Products you\'ve asked us to add' : `${requestCount} product${requestCount !== 1 ? 's' : ''} requested`}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.manageRow}
          onPress={() => navigation.navigate('SuggestProduct')}
        >
          <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.manageLabel}>Suggest a Product</Text>
            <Text style={styles.manageSub}>Don't have it in hand? Tell us what to add by name.</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.manageRow}
          onPress={() => navigation.navigate('SuggestFeature')}
        >
          <Ionicons name="bulb-outline" size={18} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.manageLabel}>Suggest a Feature</Text>
            <Text style={styles.manageSub}>Tell us what the app should do next.</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
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

      {/* About */}
      <View style={styles.about}>
        <Text style={styles.aboutText}>Food Exposé v1.0</Text>
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
    marginHorizontal: 24, marginTop: 24, marginBottom: 10, paddingVertical: 12,
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
  storeLabel: { fontSize: Font.sizes.xs, fontWeight: Font.weights.medium, color: Colors.textSecondary, textAlign: 'center' },
  storeLabelActive: { color: Colors.primary },

  settingsCard: { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },

  pantryScoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  pantryScanCount: { fontSize: Font.sizes.base, fontWeight: Font.weights.bold, color: Colors.textPrimary },
  pantryScanSub: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  pantryAverageWrap: { alignItems: 'center' },
  pantryAverageNumber: { fontSize: 32, fontWeight: Font.weights.heavy, lineHeight: 36 },
  pantryAverageLabel: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  pantryDivider: { height: 1, backgroundColor: Colors.border },
  pantryHighlightRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  pantryHighlightRowTappable: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  pantryHighlightText: { flex: 1, fontSize: Font.sizes.sm, color: Colors.textSecondary },
  pantryHighlightStrong: { color: Colors.textPrimary, fontWeight: Font.weights.medium },

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
