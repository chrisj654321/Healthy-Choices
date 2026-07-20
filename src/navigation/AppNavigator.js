import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { isOnboardingDone, getUserPrefs } from '../utils/storage';
import { refreshWeeklySchedule } from '../utils/notifications';
import { refreshGoalReminders } from '../utils/goalReminders';
import { useAuth } from '../context/AuthContext';

import HomeScreen             from '../screens/HomeScreen';
import HealthyCategoryScreen  from '../screens/HealthyCategoryScreen';
import CompanyListScreen      from '../screens/CompanyListScreen';
import ScannerScreen          from '../screens/ScannerScreen';
import ProductScoreScreen     from '../screens/ProductScoreScreen';
import CompanyProfileScreen   from '../screens/CompanyProfileScreen';
import ScanHistoryScreen      from '../screens/ScanHistoryScreen';
import ProductSearchScreen    from '../screens/ProductSearchScreen';
import ProfileScreen          from '../screens/ProfileScreen';
import ProfileSetupScreen     from '../screens/ProfileSetupScreen';
import MyRequestsScreen       from '../screens/MyRequestsScreen';
import OnboardingScreen       from '../screens/OnboardingScreen';
import PaywallScreen          from '../screens/PaywallScreen';
import AuthScreen             from '../screens/AuthScreen';
import ResetPasswordScreen    from '../screens/ResetPasswordScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();
const Root  = createStackNavigator();

// Exposed so a notification-tap listener (registered below) can navigate
// without needing a ref passed down through props.
export const navigationRef = createNavigationContainerRef();

// Set by OnboardingScreen right before onComplete() on the final "ready"
// step. Checked once the main app (post-auth) mounts, then cleared
// immediately so it never fires again on a later cold start.
const SCAN_AFTER_ONBOARDING_KEY = '@hc_scan_after_onboarding';

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home"           component={HomeScreen} />
      <Stack.Screen name="History"        component={ScanHistoryScreen} />
      <Stack.Screen name="HealthyCategory" component={HealthyCategoryScreen} />
      <Stack.Screen name="ProductScore"   component={ProductScoreScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
    </Stack.Navigator>
  );
}

function ScanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Scanner"        component={ScannerScreen} />
      <Stack.Screen name="ProductScore"   component={ProductScoreScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
    </Stack.Navigator>
  );
}

function CompaniesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompanyList"    component={CompanyListScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
      <Stack.Screen name="ProductScore"   component={ProductScoreScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductSearch"  component={ProductSearchScreen} />
      <Stack.Screen name="ProductScore"   component={ProductScoreScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain"    component={ProfileScreen} />
      <Stack.Screen name="MyRequests"     component={MyRequestsScreen} />
      <Stack.Screen name="ProductScore"   component={ProductScoreScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync().catch(() => {});
        },
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle:      styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home:      focused ? 'home'     : 'home-outline',
            Search:    focused ? 'search'   : 'search-outline',
            Scan:      focused ? 'scan'      : 'scan-outline',
            Companies: focused ? 'business' : 'business-outline',
            Profile:   focused ? 'person'   : 'person-outline',
          };
          const iconName = icons[route.name];
          if (route.name === 'Scan') {
            return (
              <View style={[styles.scanIconWrap, focused && styles.scanIconWrapActive]}>
                <Ionicons name={iconName} size={26} color={focused ? Colors.white : Colors.primary} />
              </View>
            );
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"      component={HomeStack}      options={{ title: 'Home' }} />
      <Tab.Screen name="Search"    component={SearchStack}    options={{ title: 'Search' }} />
      <Tab.Screen name="Scan"      component={ScanStack}      options={{ title: 'Scan' }} />
      <Tab.Screen name="Companies" component={CompaniesStack} options={{ title: 'Companies' }} />
      <Tab.Screen name="Profile"   component={ProfileStack}   options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ─── Root app with auth + onboarding gate ─────────────────────────────────────
export default function AppNavigator() {
  const { user, authLoading, passwordRecovery } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    isOnboardingDone().then(setOnboardingDone);
    // Rotate the weekly notification's copy to this week's line. No-ops
    // unless the user is opted in with OS permission granted — never prompts.
    refreshWeeklySchedule();
    // Keep goal-reminder countdown/copy current, and let it go silent once
    // the deadline window has fully passed. No-ops if there's no deadline.
    getUserPrefs().then(refreshGoalReminders).catch(() => {});
  }, []);

  // Tapping any of our local notifications should just bring the user to the
  // Scan tab — low-risk best-effort navigation, never throws.
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      try {
        if (navigationRef.isReady()) {
          navigationRef.navigate('MainApp', { screen: 'Scan' });
        }
      } catch (e) {
        console.warn('[Notifications] tap navigation failed:', e?.message ?? e);
      }
    });
    return () => subscription.remove();
  }, []);

  // One-time "land on Scan" after completing onboarding's final step. The
  // flag is written by OnboardingScreen before onComplete(), then survives
  // the Auth screen (persisted storage, not React state) since auth happens
  // between onboarding and the main tabs mounting here. We only get a
  // navigationRef once NavigationContainer (below) has mounted, so this
  // effect polls isReady() a few times over ~1.5s — the same not-ready
  // guard the notification-tap listener uses, just retried since this only
  // needs to fire once right after mount.
  useEffect(() => {
    if (!user) return; // main tabs aren't mounted yet
    let cancelled = false;
    let attempts = 0;

    const tryNavigate = async () => {
      try {
        const flag = await AsyncStorage.getItem(SCAN_AFTER_ONBOARDING_KEY);
        if (flag !== 'true' || cancelled) return;

        if (navigationRef.isReady()) {
          await AsyncStorage.removeItem(SCAN_AFTER_ONBOARDING_KEY);
          navigationRef.navigate('MainApp', { screen: 'Scan' });
          return;
        }

        attempts += 1;
        if (attempts < 8) {
          setTimeout(tryNavigate, 200); // retry for up to ~1.6s
        }
      } catch (e) {
        console.warn('[Onboarding] scan-after-onboarding navigation failed:', e?.message ?? e);
      }
    };

    tryNavigate();
    return () => { cancelled = true; };
  }, [user]);

  // Show spinner while we check auth + onboarding state
  if (authLoading || onboardingDone === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  // A password-recovery link establishes a real (but purpose-limited)
  // session, so `user` is truthy here — without this check the branches
  // below would just drop the user into onboarding/the main app instead of
  // letting them set a new password.
  if (passwordRecovery) {
    return <ResetPasswordScreen />;
  }

  // Step 1: Onboarding (first launch only)
  if (!onboardingDone) {
    return <OnboardingScreen onComplete={() => setOnboardingDone(true)} />;
  }

  // Step 2: Auth (required — no anonymous use)
  if (!user) {
    return <AuthScreen />;
  }

  // Step 3: Main app
  return (
    <NavigationContainer ref={navigationRef}>
      <Root.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <Root.Screen name="MainApp" component={MainTabs} options={{ presentation: 'card' }} />
        <Root.Screen name="Paywall" component={PaywallScreen} />
        <Root.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      </Root.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  tabBar: {
    backgroundColor:  Colors.white,
    borderTopColor:   Colors.border,
    borderTopWidth:   1,
    height:           80,
    paddingBottom:    16,
    paddingTop:       8,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: -4 },
    shadowOpacity:    0.06,
    shadowRadius:     12,
    elevation:        12,
  },
  tabLabel: {
    fontSize:   Font.sizes.xs,
    fontWeight: Font.weights.medium,
  },
  scanIconWrap: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  scanIconWrapActive: { backgroundColor: Colors.primary },
});
