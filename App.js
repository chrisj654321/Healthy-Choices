import 'react-native-gesture-handler';
import React, { useEffect, Component } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { initRevenueCat } from './src/utils/subscription';
import { initProductStore } from './src/data/productStore';
import { initSentry, captureException } from './src/utils/sentry';
import { logAppEvent } from './src/utils/appAnalytics';
import SpecsMascot from './src/components/SpecsMascot';

// Foreground behavior for local notifications — show them even while the app
// is open (banner + list), no sound. Must be set once at module scope, before
// any notification could fire.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Crash/error reporting (JS layer only — see src/utils/sentry.js for scope
// notes). Must run at module scope, before the component tree renders, so
// errors during initial render are still captured.
initSentry();

// ── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info);
    captureException(error, { componentStack: info && info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={eb.container}>
          <SpecsMascot clip="inspecting" size={180} style={eb.mascot} />
          <Text style={eb.title}>Something went wrong</Text>
          <Text style={eb.subtitle}>
            The app ran into an unexpected error. Please restart it.
          </Text>
          <TouchableOpacity
            style={eb.btn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={eb.btnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const eb = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#fff' },
  mascot:    { marginBottom: 16 },
  title:     { fontSize: 22, fontWeight: '700', color: '#1D9E75', marginBottom: 12 },
  subtitle:  { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  btn:       { backgroundColor: '#1D9E75', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  btnText:   { color: '#fff', fontWeight: '700', fontSize: 16 },
});
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    // Initialize RevenueCat at startup. Errors are non-fatal — the app
    // continues without subscription features if RC fails to initialize.
    initRevenueCat().catch((e) =>
      console.warn('[RC] init failed:', e.message)
    );

    // Initialize the SQLite product store at startup — non-blocking, same
    // pattern as RevenueCat above. Failures are non-fatal: ScannerScreen's
    // local lookups just fall back to "not found locally" if this never
    // completes successfully (see src/data/productStore.js).
    initProductStore().catch((e) => console.warn('[ProductStore] init failed:', e.message));

    // Funnel/retention analytics: 'app_open' fires exactly once here, per
    // cold start (see src/utils/appAnalytics.js — never throws, never
    // blocks). A dedicated AppState listener (rather than reusing
    // AuthContext's, which exists purely to pause Supabase's auth-refresh
    // timer and lives inside AuthProvider, mounted below this) logs
    // 'app_backgrounded' when the app leaves the foreground. 'inactive'
    // (iOS's brief transient state, e.g. Control Center) is intentionally
    // NOT treated as backgrounded — only a real transition to 'background'.
    logAppEvent('app_open').catch(() => {});
    const handleAppStateChange = (nextState) => {
      if (nextState === 'background') {
        logAppEvent('app_backgrounded').catch(() => {});
      }
    };
    const appStateSub = AppState.addEventListener('change', handleAppStateChange);
    return () => appStateSub.remove();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
