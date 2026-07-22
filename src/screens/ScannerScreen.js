import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
  StatusBar,
  Alert,
  Linking,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { checkAndIncrementDailyScan } from '../utils/storage';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { getProductByBarcode } from '../data/productStore';
import { useProStatus } from '../utils/subscription';
import { buildProduct, findCompanyId } from '../utils/productParser';
import { maybeRequestAppReview, recordSuccessfulScanForReview } from '../utils/reviewPrompt';
import { addRequest } from '../utils/productRequests';
import SpecsMascot from '../components/SpecsMascot';

const OFF_API = 'https://world.openfoodfacts.org/api/v2/product';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ScannerScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [torch, setTorch] = useState(false);
  const [active, setActive] = useState(true);
  const [manualMode, setManualMode] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const { isPro, refresh: refreshPro } = useProStatus();
  const cooldown = useRef(false);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanAnim]);

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setLoading(false);
      cooldown.current = false;
      setActive(true);
      return () => setActive(false);
    }, [])
  );

  const reset = () => {
    setScanned(false);
    setLoading(false);
    cooldown.current = false;
  };

  const handleManualSubmit = () => {
    const code = manualBarcode.trim();
    if (!code) return;
    setManualMode(false);
    setManualBarcode('');
    handleBarCodeScanned({ data: code });
  };

  const promptForReviewAfterScan = () => {
    setTimeout(() => {
      recordSuccessfulScanForReview()
        .then((shouldPrompt) => {
          if (shouldPrompt) return maybeRequestAppReview('firstScan');
        })
        .catch(() => {});
    }, 900);
  };

  // "Request this product" from the Product Not Found dead-end. Saves
  // locally (always succeeds) and best-effort syncs to Supabase; offline
  // requests are retried automatically the next time productRequests.js
  // is used (see retryPendingSyncs in that module).
  const handleRequestProduct = async (barcode) => {
    try {
      await addRequest(barcode);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Alert.alert(
        'Got it',
        'We\'ve added this to your requests — check My Requests in your Profile for status.',
        [{ text: 'OK', onPress: reset }]
      );
    } catch (e) {
      console.warn('[Scanner] request failed:', e?.message ?? e);
      reset();
    }
  };

  const handleBarCodeScanned = async ({ data: barcode }) => {
    if (cooldown.current || scanned) return;

    cooldown.current = true;
    setScanned(true);
    Vibration.vibrate(60);

    try {
      setLoading(true);
      setLoadingMsg('Scanning barcode…');
      await delay(250);

      setLoadingMsg('Looking up product…');
      const res = await fetch(
        `${OFF_API}/${encodeURIComponent(barcode)}?fields=product_name,product_name_en,brands,` +
          `ingredients_text,ingredients,nutriments,categories_tags,labels_tags,packaging,packaging_text,packaging_tags,preparation,preparation_text,cooking_instructions,instructions,` +
          `serving_size,image_front_url`,
        { headers: { 'User-Agent': 'FoodExpose/1.2 (jamesadventuremarketing@gmail.com)' } }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.status === 0 || !data.product) {
        const local = await getProductByBarcode(barcode);
        if (local) {
          // ── Daily scan limit check (only on successful lookup) ───────────────
          if (!isPro) {
            const { allowed, remaining } = await checkAndIncrementDailyScan();
            if (!allowed) {
              setLoading(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
              Alert.alert(
                "Daily Limit Reached",
                "Free accounts can scan 5 products per day. Upgrade to Premium for unlimited scans.",
                [
                  { text: "Not Now", style: "cancel", onPress: reset },
                  { text: "Upgrade", onPress: () => navigation.navigate('Paywall', { feature: 'scan' }) },
                ]
              );
              return;
            }
            if (remaining === 0) {
              Alert.alert(
                "Last Free Scan Today",
                "You've used all 5 free scans for today. Upgrade to Premium for unlimited scanning.",
                [
                  { text: "Continue", style: "cancel" },
                  { text: "Upgrade to Premium", onPress: () => navigation.navigate('Paywall', { feature: 'scan' }) },
                ]
              );
            }
          }
          setLoading(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          navigation.navigate('ProductScore', { product: local, fromScanner: true });
          promptForReviewAfterScan();
          return;
        }
        setLoading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        Alert.alert(
          'Product Not Found',
          `Barcode ${barcode} isn't in our database yet.\n\nTry scanning another product or check back after we update our data.`,
          [
            { text: 'OK', style: 'cancel', onPress: reset },
            { text: 'Request this product', onPress: () => handleRequestProduct(barcode) },
          ]
        );
        return;
      }

      // ── Daily scan limit check (only on successful lookup) ─────────────────
      if (!isPro) {
        const { allowed, remaining } = await checkAndIncrementDailyScan();
        if (!allowed) {
          setLoading(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
          Alert.alert(
            "Daily Limit Reached",
            "Free accounts can scan 5 products per day. Upgrade to Premium for unlimited scans.",
            [
              { text: "Not Now", style: "cancel", onPress: reset },
              { text: "Upgrade", onPress: () => navigation.navigate('Paywall', { feature: 'scan' }) },
            ]
          );
          return;
        }
        if (remaining === 0) {
          Alert.alert(
            "Last Free Scan Today",
            "You've used all 5 free scans for today. Upgrade to Premium for unlimited scanning.",
            [
              { text: "Continue", style: "cancel" },
              { text: "Upgrade to Premium", onPress: () => navigation.navigate('Paywall', { feature: 'scan' }) },
            ]
          );
        }
      }
      // ───────────────────────────────────────────────────────────────────────

      setLoadingMsg('Analyzing ingredients…');
      await delay(200);

      const product = buildProduct(barcode, data);
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      navigation.navigate('ProductScore', { product, fromScanner: true });
      promptForReviewAfterScan();
    } catch (err) {
      console.warn('[Scanner] scan error:', err);
      const local = await getProductByBarcode(barcode);
      if (local) {
        setLoading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        navigation.navigate('ProductScore', { product: local, fromScanner: true });
        promptForReviewAfterScan();
        return;
      }
      setLoading(false);
      Alert.alert(
        'Connection Error',
        'Could not reach the product database. Check your internet connection and try again.',
        [{ text: 'Retry', onPress: reset }]
      );
    }
  };

  // ── Permission loading ──
  if (!permission) {
    return (
      <View style={s.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  // ── Permission denied ──
  if (!permission.granted) {
    const canAsk = permission.canAskAgain;
    return (
      <View style={s.permScreen}>
        <View style={s.permIconWrap}>
          <Ionicons name="camera" size={52} color={Colors.primary} />
        </View>
        <Text style={s.permTitle}>Camera Access Required</Text>
        <Text style={s.permSub}>
          {canAsk
            ? 'Food Exposé needs your camera to scan product barcodes and analyze ingredients.'
            : 'Camera access was denied. Please enable it in your device Settings to scan barcodes.'}
        </Text>
        <TouchableOpacity
          style={s.permBtn}
          onPress={canAsk ? requestPermission : () => Linking.openSettings()}
        >
          <Text style={s.permBtnText}>
            {canAsk ? 'Continue' : 'Open Settings'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Scanner ──
  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {active && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              'upc_a', 'upc_e', 'ean13', 'ean8',
              'code128', 'code39', 'itf14',
            ],
          }}
        />
      )}

      {/* Top gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.80)', 'rgba(0,0,0,0.0)']}
        style={[s.topGrad, { paddingTop: insets.top + 16 }]}
      >
        <View style={s.topBar}>
          <View>
            <Text style={s.appName}>Food Exposé</Text>
            <Text style={s.appTagline}>The truth behind your food</Text>
          </View>
          <TouchableOpacity style={s.iconBtn} onPress={() => setTorch((t) => !t)}>
            <Ionicons
              name={torch ? 'flash' : 'flash-outline'}
              size={22}
              color={torch ? '#FFD60A' : Colors.white}
            />
          </TouchableOpacity>
        </View>
        <Text style={s.instruction}>Point camera at a product barcode</Text>
      </LinearGradient>

      {/* Viewfinder row */}
      <View style={s.midRow}>
        <View style={s.sideShade} />
        <View style={s.frame}>
          <View style={[s.corner, s.tl]} />
          <View style={[s.corner, s.tr]} />
          <View style={[s.corner, s.bl]} />
          <View style={[s.corner, s.br]} />

          {loading ? (
            <View style={s.frameCenter}>
              <SpecsMascot clip="idle-loop" size={72} />
              <Text style={s.loadMsg}>{loadingMsg}</Text>
            </View>
          ) : scanned ? (
            <View style={s.frameCenter}>
              <Ionicons name="checkmark-circle" size={56} color={Colors.primary} />
              <Text style={s.loadMsg}>Found!</Text>
            </View>
          ) : (
            <Animated.View
              style={[
                s.scanLine,
                {
                  transform: [{
                    translateY: scanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-(VF / 2 - 16), VF / 2 - 16],
                    }),
                  }],
                },
              ]}
            />
          )}
        </View>
        <View style={s.sideShade} />
      </View>

      {/* Bottom gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.85)']}
        style={[s.bottomGrad, { paddingBottom: insets.bottom + 24 }]}
      >
        {manualMode ? (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.manualWrap}>
            <TextInput
              style={s.manualInput}
              placeholder="Enter barcode number…"
              placeholderTextColor="rgba(255,255,255,0.45)"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              keyboardType="number-pad"
              autoFocus
              onSubmitEditing={handleManualSubmit}
              returnKeyType="search"
            />
            <View style={s.manualRow}>
              <TouchableOpacity style={s.manualCancel} onPress={() => { setManualMode(false); setManualBarcode(''); }}>
                <Text style={s.manualCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.rescanBtn, { flex: 1 }]} onPress={handleManualSubmit}>
                <Ionicons name="search-outline" size={18} color={Colors.white} />
                <Text style={s.rescanText}>Look Up</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <>
            {scanned && !loading && (
              <TouchableOpacity style={s.rescanBtn} onPress={reset}>
                <Ionicons name="scan-outline" size={18} color={Colors.white} />
                <Text style={s.rescanText}>Scan Another Product</Text>
              </TouchableOpacity>
            )}
            {!scanned && !loading && (
              <TouchableOpacity
                style={s.manualBtn}
                onPress={() => {
                  if (!isPro) {
                    navigation.navigate('Paywall', { feature: 'search' });
                  } else {
                    setManualMode(true);
                  }
                }}
              >
                <Ionicons name={isPro ? 'keypad-outline' : 'lock-closed-outline'} size={16} color="rgba(255,255,255,0.75)" />
                <Text style={s.manualBtnText}>Enter barcode manually</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={s.historyLink}
              onPress={() => navigation.navigate('History')}
            >
              <Ionicons name="time-outline" size={15} color="rgba(255,255,255,0.6)" />
              <Text style={s.historyLinkText}>View Scan History</Text>
            </TouchableOpacity>
          </>
        )}
      </LinearGradient>
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Styles ──────────────────────────────────────────────────────────────────

const VF = 260;
const CR = 26;
const CT = 3;

// Camera-overlay text sits on a live video feed with no predictable
// background, so a strong dark shadow (not just white opacity or the
// gradient scrim) is what keeps it readable over bright/busy frames.
const CAMERA_TEXT_POP = {
  textShadowColor: 'rgba(0,0,0,0.85)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 5,
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.background,
  },

  // Permission screen
  permScreen: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.background, padding: 36,
  },
  permIconWrap: {
    width: 100, height: 100, borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  permTitle: {
    fontSize: Font.sizes.xl, fontWeight: Font.weights.bold,
    color: Colors.textPrimary, textAlign: 'center', marginBottom: 12,
  },
  permSub: {
    fontSize: Font.sizes.base, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 24, marginBottom: 32,
  },
  permBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 36,
    paddingVertical: 14, borderRadius: 14,
  },
  permBtnText: {
    color: Colors.white, fontSize: Font.sizes.md,
    fontWeight: Font.weights.semibold,
  },

  // Overlays
  topGrad: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 22 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  appName: {
    fontSize: Font.sizes.lg, fontWeight: Font.weights.heavy, color: Colors.white,
    ...CAMERA_TEXT_POP,
  },
  appTagline: {
    fontSize: Font.sizes.xs, color: 'rgba(255,255,255,0.82)', marginTop: 2,
    ...CAMERA_TEXT_POP,
  },
  iconBtn: { padding: 8 },
  instruction: {
    fontSize: Font.sizes.sm, color: 'rgba(255,255,255,0.92)', textAlign: 'center',
    ...CAMERA_TEXT_POP,
  },

  midRow: { flexDirection: 'row', height: VF },
  sideShade: { flex: 1, backgroundColor: 'rgba(0,0,0,0.54)' },

  frame: { width: VF, alignItems: 'center', justifyContent: 'center' },

  corner: {
    position: 'absolute', width: CR, height: CR, borderColor: Colors.primary,
  },
  tl: { top: 0, left: 0, borderTopWidth: CT, borderLeftWidth: CT },
  tr: { top: 0, right: 0, borderTopWidth: CT, borderRightWidth: CT },
  bl: { bottom: 0, left: 0, borderBottomWidth: CT, borderLeftWidth: CT },
  br: { bottom: 0, right: 0, borderBottomWidth: CT, borderRightWidth: CT },

  scanLine: {
    width: VF - 16, height: 2,
    backgroundColor: Colors.primary, opacity: 0.75,
  },
  frameCenter: { alignItems: 'center', gap: 10 },
  loadMsg: {
    color: Colors.white, fontSize: Font.sizes.sm,
    fontWeight: Font.weights.medium,
    ...CAMERA_TEXT_POP,
  },

  bottomGrad: {
    flex: 1, alignItems: 'center', justifyContent: 'flex-end',
    paddingBottom: 56, gap: 16,
  },
  rescanBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 28, paddingVertical: 13, borderRadius: 50,
  },
  rescanText: {
    color: Colors.white, fontSize: Font.sizes.base,
    fontWeight: Font.weights.semibold,
  },
  historyLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  historyLinkText: { fontSize: Font.sizes.sm, color: 'rgba(255,255,255,0.6)' },

  manualBtn: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  manualBtnText: { fontSize: Font.sizes.sm, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  manualWrap: { width: '100%', gap: 10, paddingHorizontal: 4 },
  manualInput: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 16, color: Colors.white, textAlign: 'center',
  },
  manualRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  manualCancel: { paddingVertical: 14, paddingHorizontal: 6 },
  manualCancelText: { fontSize: Font.sizes.base, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
});
