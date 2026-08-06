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
import { computeYearlySavings, introOffer, FALLBACK_TRIAL_FINE } from '../utils/paywallPricing';
import { maybeRequestAppReview } from '../utils/reviewPrompt';
import { logAppEvent } from '../utils/appAnalytics';
import SpecsMascot from './SpecsMascot';

// ─── Pure exit-offer content ───────────────────────────────────────────────────
// The one-per-visit "wait, don't go" screen shown after a user backs out of
// the main paywall. Same real offer as the main paywall (yearly, 3-day free
// trial, $49.99/yr after) — just reframed through a savings-vs-monthly lens
// instead of the main paywall's per-month-breakdown lens. Changed 2026-07-24
// post Apple 3.1.2(c) rejection: previously pitched a 50%-off first-year
// discount that no longer exists; the billed amount must stay the most
// prominent element here too, with the savings % subordinate.
// Renders BEFORE the NavigationContainer when used from onboarding, so this
// takes only callbacks — never a navigation prop.
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

  const pricing = computeYearlySavings(rcPackages.yearly, rcPackages.monthly);
  const trialFine = rcPackages.yearly
    ? (introOffer(rcPackages.yearly, '/year')?.fine ?? FALLBACK_TRIAL_FINE)
    : FALLBACK_TRIAL_FINE;

  const handleClaim = async () => {
    const pkg = rcPackages.yearly;
    if (!pkg) {
      Alert.alert('Not Available', 'Unable to load this offer. Please check your connection and try again.');
      return;
    }

    setLoading(true);
    // step: 'offer' — this is the exit-offer path, distinct from the main
    // paywall (see appAnalytics.js's app_events_setup.sql conversion query
    // for the caveat this creates: a purchase completed here can't be
    // attributed back to whichever paywall trigger led here).
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

        <Text style={s.eyebrow}>WAIT — DON'T MISS THIS</Text>
        <Text style={s.headline}>Try Premium free{'\n'}for 3 days.</Text>

        {/* Price card — billed amount is the prominent element (Apple
            3.1.2(c)); the per-month breakdown and savings % are subordinate,
            below and smaller. No strike-through/fake discount — this is the
            real price, same as the main paywall, just framed around the
            savings-vs-monthly comparison instead of the per-month number. */}
        <View style={s.priceCard}>
          <Text style={s.priceBig}>
            {pricing.yearlyPrice}<Text style={s.pricePeriod}>/year</Text>
          </Text>
          <Text style={s.priceToday}>$0 due today — 3-day free trial</Text>
          <View style={s.priceDivider} />
          <View style={s.priceVsRow}>
            <Text style={s.priceVsLabel}>{pricing.monthlyEquivPrice} · vs. paying monthly</Text>
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
            <Text style={s.ctaText}>Start My Free Trial</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={s.secondaryBtn} onPress={onPayFullPrice} disabled={loading}>
          <Text style={s.secondaryText}>See other plans</Text>
        </TouchableOpacity>

        <Text style={s.finePrint}>
          {trialFine}. Cancel anytime.
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
  // Billed amount — the prominent element on this card, matching the main
  // paywall's treatment. Period suffix styled smaller than the price itself.
  priceBig:    { fontSize: 32, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  pricePeriod: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary },
  priceToday:  { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, textAlign: 'center', marginTop: 4, marginBottom: 12 },
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
