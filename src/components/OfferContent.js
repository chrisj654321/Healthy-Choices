import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, StatusBar,
  Animated, ActivityIndicator, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import {
  getCurrentOffering,
  extractPackages,
  purchaseRCPackage,
  getProStatus,
} from '../utils/subscription';
import { computeOfferPricing } from '../utils/paywallPricing';
import { maybeRequestAppReview } from '../utils/reviewPrompt';
import { logAppEvent } from '../utils/appAnalytics';
import SpecsMascot from './SpecsMascot';

// ─── Pure exit-offer content ───────────────────────────────────────────────────
// The one-per-visit "wait, one-time offer" screen shown after a user backs
// out of the main paywall. Renders BEFORE the NavigationContainer when used
// from onboarding, so this takes only callbacks — never a navigation prop.
//
// Background: assets/mascot/grocery-aisle-bg.jpg, a founder-approved
// Higgsfield generation (nano_banana_pro, 2026-07-20) — cartoon toy-render
// grocery aisle matching Specs's visual style, composition/lighting
// referenced from a real produce-aisle photo but restyled with no real
// brand names/logos/text (trademark-safe). Dimmed via s.dimOverlay so the
// SpecsMascot backflip clip + pricing card read clearly on top.
export default function OfferContent({ onPurchased, onPayFullPrice, onDismiss }) {
  const insets = useSafeAreaInsets();

  const [loading,    setLoading]    = useState(false);
  const [rcPackages, setRcPackages] = useState({ yearly: null, monthly: null });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 340, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const offering = await getCurrentOffering();
      if (!active || !offering) return;
      const { yearly, monthly } = extractPackages(offering);
      setRcPackages({ yearly, monthly });
    })();
    return () => { active = false; };
  }, []);

  const pricing = computeOfferPricing(rcPackages.yearly, rcPackages.monthly);

  const handleClaim = async () => {
    const pkg = rcPackages.yearly;
    if (!pkg) {
      Alert.alert('Not Available', 'Unable to load this offer. Please check your connection and try again.');
      return;
    }

    setLoading(true);
    // step: 'offer' — this is the 50%-off exit offer, a distinct purchase
    // path from the main paywall (see appAnalytics.js's app_events_setup.sql
    // conversion query for the caveat this creates: a purchase completed
    // here can't be attributed back to whichever paywall trigger led here).
    logAppEvent('purchase_started', { step: 'offer' }).catch(() => {});
    try {
      let isPro = await purchaseRCPackage(pkg);
      if (!isPro) isPro = await getProStatus();
      setLoading(false);
      if (isPro) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        logAppEvent('purchase_completed', { step: 'offer' }).catch(() => {});
        await maybeRequestAppReview('subscription');
        onPurchased?.();
      } else {
        Alert.alert(
          'Purchase received',
          'Your purchase went through, but Premium hasn\'t unlocked yet. Please try again in a moment.'
        );
      }
    } catch (e) {
      setLoading(false);
      if (!e.userCancelled) {
        Alert.alert('Purchase Failed', e.message || 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />

      <Image
        source={require('../../assets/mascot/grocery-aisle-bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={s.dimOverlay} />

      <Animated.View style={[s.content, { opacity: fadeAnim, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <View style={s.mascotWrap}>
          <SpecsMascot clip="backflip" size={140} />
        </View>

        <Text style={s.eyebrow}>WAIT — ONE-TIME OFFER</Text>
        <Text style={s.headline}>Limited-time: 50% off{'\n'}your first year.</Text>

        {/* Price math */}
        <View style={s.priceCard}>
          <View style={s.priceRow}>
            <Text style={s.priceStrike}>{pricing.standardPrice}/yr</Text>
            <Text style={s.priceArrow}>→</Text>
            <Text style={s.priceIntro}>{pricing.introPrice}</Text>
          </View>
          <Text style={s.priceIntroMonthly}>{pricing.introMonthly} for your first year</Text>
          <View style={s.priceDivider} />
          <View style={s.priceVsRow}>
            <Text style={s.priceVsLabel}>vs. paying monthly</Text>
            <Text style={s.priceVsValue}>{pricing.monthlyPlanPrice}/mo</Text>
          </View>
          {pricing.savePctVsMonthly ? (
            <View style={s.saveBadge}>
              <Text style={s.saveBadgeText}>Save ~{pricing.savePctVsMonthly}% vs monthly</Text>
            </View>
          ) : null}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[s.ctaBtn, loading && s.ctaBtnLoading]}
          onPress={handleClaim}
          disabled={loading}
          activeOpacity={0.87}
        >
          {loading ? (
            <ActivityIndicator color={Colors.primary} size="small" />
          ) : (
            <Text style={s.ctaText}>Claim my one-time offer</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={s.secondaryBtn} onPress={onPayFullPrice} disabled={loading}>
          <Text style={s.secondaryText}>I'd rather pay full price</Text>
        </TouchableOpacity>

        <Text style={s.finePrint}>
          {pricing.introPrice} for the first year, then {pricing.standardPrice}/yr. Cancel anytime.
        </Text>

        <TouchableOpacity onPress={onDismiss} disabled={loading}>
          <Text style={s.freeLink}>Continue with free version</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.primaryDark },
  dimOverlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.28)' },
  content:     { flex: 1, alignItems: 'center', paddingHorizontal: 28, justifyContent: 'center' },
  mascotWrap:  { marginBottom: 12 },
  eyebrow:     { fontSize: 12, fontWeight: '800', color: '#fff', letterSpacing: 1.6, marginBottom: 8, opacity: 0.9 },
  headline:    { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 36, marginBottom: 20 },

  priceCard:   {
    width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 18,
    marginBottom: 20,
  },
  priceRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4 },
  priceStrike: { fontSize: 16, color: Colors.textMuted, textDecorationLine: 'line-through' },
  priceArrow:  { fontSize: 16, color: Colors.textMuted },
  priceIntro:  { fontSize: 26, fontWeight: '800', color: Colors.primary },
  priceIntroMonthly: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 12 },
  priceDivider: { height: 1, backgroundColor: Colors.border, marginBottom: 12 },
  priceVsRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceVsLabel: { fontSize: 13, color: Colors.textSecondary },
  priceVsValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  saveBadge:   {
    marginTop: 12, alignSelf: 'center',
    backgroundColor: Colors.primaryLight, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  saveBadgeText: { fontSize: 12, fontWeight: '800', color: Colors.primary },

  ctaBtn:      {
    width: '100%', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: 16, paddingVertical: 17,
    marginBottom: 12,
  },
  ctaBtnLoading: { opacity: 0.7 },
  ctaText:     { fontSize: 17, fontWeight: '800', color: Colors.primary },
  secondaryBtn: {
    width: '100%', alignItems: 'center', justifyContent: 'center',
    borderRadius: 16, paddingVertical: 15, marginBottom: 18,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)',
  },
  secondaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  finePrint:   { fontSize: 12, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginBottom: 16, lineHeight: 17 },
  freeLink:    { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600', textDecorationLine: 'underline' },
});
