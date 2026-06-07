import 'react-native-gesture-handler';
import React, { useEffect, Component } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { initRevenueCat } from './src/utils/subscription';

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
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={eb.container}>
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
