import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { initRevenueCat } from './src/utils/subscription';

export default function App() {
  useEffect(() => {
    // Initialize RevenueCat at startup without a user ID.
    // User identification (linking to the Supabase account) happens inside
    // AuthContext as soon as a session is established.
    initRevenueCat().catch((e) =>
      console.warn('[RC] init failed:', e.message)
    );
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
