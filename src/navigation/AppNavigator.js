import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { isOnboardingDone } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

import ScannerScreen          from '../screens/ScannerScreen';
import ProductScoreScreen     from '../screens/ProductScoreScreen';
import CompanyProfileScreen   from '../screens/CompanyProfileScreen';
import ScanHistoryScreen      from '../screens/ScanHistoryScreen';
import ProductSearchScreen    from '../screens/ProductSearchScreen';
import ProfileScreen          from '../screens/ProfileScreen';
import OnboardingScreen       from '../screens/OnboardingScreen';
import PaywallScreen          from '../screens/PaywallScreen';
import AuthScreen             from '../screens/AuthScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();
const Root  = createStackNavigator();

function ScanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Scanner"        component={ScannerScreen} />
      <Stack.Screen name="ProductScore"   component={ProductScoreScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="History"        component={ScanHistoryScreen} />
      <Stack.Screen name="ProductScore"   component={ProductScoreScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
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

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle:      styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Scan:    focused ? 'scan'        : 'scan-outline',
            Search:  focused ? 'search'      : 'search-outline',
            History: focused ? 'time'        : 'time-outline',
            Profile: focused ? 'person'      : 'person-outline',
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
      <Tab.Screen name="Scan"    component={ScanStack}    options={{ title: 'Scan' }} />
      <Tab.Screen name="Search"  component={SearchStack}  options={{ title: 'Search' }} />
      <Tab.Screen name="History" component={HistoryStack} options={{ title: 'History' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ─── Root app with auth + onboarding gate ─────────────────────────────────────
export default function AppNavigator() {
  const { user, authLoading } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    isOnboardingDone().then(setOnboardingDone);
  }, []);

  // Show spinner while we check auth + onboarding state
  if (authLoading || onboardingDone === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
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
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <Root.Screen name="MainApp" component={MainTabs} options={{ presentation: 'card' }} />
        <Root.Screen name="Paywall" component={PaywallScreen} />
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
