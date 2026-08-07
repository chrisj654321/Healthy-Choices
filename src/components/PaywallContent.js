import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Animated, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import {
  getCurrentOffering,
  extractPackages,
  purchaseRCPackage,
  restorePurchases,
  getProStatus,
} from '../utils/subscription';
import { FALLBACK_PRICES, FALLBACK_TRIAL_FINE, monthlyEquiv, introOffer } from '../utils/paywallPricing';
import { getPaywallContent, resolveFeatureColor, headlineFor } from '../utils/paywallContent';
import { maybeRequestAppReview } from '../utils/reviewPrompt';
import { logAppEvent } from '../utils/appAnalytics';

// ─── Remote-editable content ────────────────────────────────────────────────
// Headlines, feature-list rows, the yearly badge, and CTA labels are driven
// by RevenueCat's Offering `metadata` (see src/utils/paywallContent.js) —
// editable from the RC dashboard with no app build and no OTA update. Price
// rendering, price hierarchy, trial disclosure, and legal links stay
// hardcoded below (see plan-decouple-from-apple.md, Phase 1) so a dashboard
// copy edit can never re-break the Apple 3.1.2(c) price-prominence fix.

// ─── Pure paywall content ──────────────────────────────────────────────────────
// Renders BEFORE the NavigationContainer when used from onboarding, so this
// takes only callbacks — never a navigation prop. The PaywallScreen (in the
// main navigator) wraps this unchanged; onboarding's "paywall" step renders
// it directly as a full-screen step.

export default function PaywallContent({ feature = null, onPurchased, onDismiss }) {
  const insets  = useSafeAreaInsets();

  // Funnel analytics: 'onboarding' when this renders as the onboarding
  // "paywall" step (feature is never passed there) — every other call site
  // (PaywallScreen.js) always passes one of the ~8 in-app trigger features.
  const paywallSource = feature || 'onboarding';

  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading,      setLoading]      = useState(false);
  const [rcPackages,   setRcPackages]   = useState({ yearly: null, monthly: null });
  const [prices,       setPrices]       = useState(FALLBACK_PRICES);
  const [yearlyTrialFine, setYearlyTrialFine] = useState(FALLBACK_TRIAL_FINE);
  // Content defaults to the in-code fallbacks synchronously (byte-identical
  // to pre-remote behavior) and is replaced once the RC offering's metadata
  // loads and validates — see the "Load RC offering" effect below.
  const [content, setContent] = useState(() => getPaywallContent(null));

  const { title, sub } = headlineFor(content, feature);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  // ── Entrance animation ─────────────────────────────────────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 340, useNativeDriver: true }),
    ]).start();
  }, []);

  // Funnel analytics: this paywall was shown, exactly once per mount.
  useEffect(() => {
    logAppEvent('paywall_shown', { step: paywallSource }).catch(() => {});
  }, []);

  const handleDismiss = () => {
    logAppEvent('paywall_dismissed', { step: paywallSource }).catch(() => {});
    onDismiss?.();
  };

  // ── Load RC offering ───────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    (async () => {
      const offering = await getCurrentOffering();
      if (!active || !offering) return;

      const { yearly: yearlyPkg, monthly: monthlyPkg } = extractPackages(offering);
      setRcPackages({ yearly: yearlyPkg, monthly: monthlyPkg });

      // Use real localized prices from the App Store when available. The
      // billed amount (`price`) is what gets shown PROMINENTLY on each card;
      // `monthlyBig` is the calculated per-month breakdown, shown small and
      // subordinate — never the other way around (that's the exact thing
      // Apple flagged under 3.1.2(c)).
      setPrices({
        yearly: {
          price:      yearlyPkg?.product.priceString ?? FALLBACK_PRICES.yearly.price,
          period:     '/year',
          monthlyBig: yearlyPkg
            ? (monthlyEquiv(yearlyPkg.product.price, yearlyPkg.product.currencyCode) ?? FALLBACK_PRICES.yearly.monthlyBig)
            : FALLBACK_PRICES.yearly.monthlyBig,
        },
        monthly: {
          price:      monthlyPkg?.product.priceString ?? FALLBACK_PRICES.monthly.price,
          period:     '/month',
          monthlyBig: monthlyPkg?.product.priceString ?? FALLBACK_PRICES.monthly.monthlyBig,
        },
      });

      // Free-trial disclosure ("3 Days Free, then $49.99/year") — only the
      // yearly plan carries a trial. Falls back to the real configured trial
      // terms if RC's introPrice hasn't loaded yet, never a guess.
      const offer = yearlyPkg ? introOffer(yearlyPkg, '/year') : null;
      setYearlyTrialFine(offer?.fine ?? FALLBACK_TRIAL_FINE);

      // Remote copy — validated field-by-field, never all-or-nothing (see
      // src/utils/paywallContent.js). No metadata / an unreachable offering
      // both resolve to the same in-code defaults already set above.
      setContent(getPaywallContent(offering));
    })();
    return () => { active = false; };
  }, []);

  // ── Purchase ───────────────────────────────────────────────────────────────
  const handleSubscribe = async () => {
    const pkg = rcPackages[selectedPlan];
    if (!pkg) {
      Alert.alert('Not Available', 'Unable to load this plan. Please check your connection and try again.');
      return;
    }

    setLoading(true);
    logAppEvent('purchase_started', { step: paywallSource }).catch(() => {});
    try {
      let isPro = await purchaseRCPackage(pkg);
      // Defensive re-check: if the purchase completed but the entitlement isn't
      // reported active yet, verify once more against RevenueCat before deciding.
      // This is the exact failure Apple hit — a charge with no unlock — so surface
      // a clear next step instead of silently leaving the user on the paywall.
      if (!isPro) isPro = await getProStatus();
      setLoading(false);
      if (isPro) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        logAppEvent('purchase_completed', { step: paywallSource }).catch(() => {});
        await maybeRequestAppReview('subscription');
        onPurchased?.();
      } else {
        Alert.alert(
          'Purchase received',
          'Your purchase went through, but Premium hasn\'t unlocked yet. Tap "Restore purchase" to sync it — or contact support if it keeps happening.'
        );
      }
    } catch (e) {
      setLoading(false);
      if (!e.userCancelled) {
        Alert.alert('Purchase Failed', e.message || 'Something went wrong. Please try again.');
      }
    }
  };

  // ── Restore ────────────────────────────────────────────────────────────────
  const handleRestore = async () => {
    setLoading(true);
    const restored = await restorePurchases();
    setLoading(false);
    if (restored) {
      Alert.alert('Restored!', 'Your Premium subscription has been restored.', [
        { text: 'OK', onPress: () => onPurchased?.() },
      ]);
    } else {
      Alert.alert('Nothing to Restore', 'No active subscription found for this account.');
    }
  };

  const plan = prices[selectedPlan];

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Close button — 44×44 touch target */}
      <TouchableOpacity style={[s.closeBtn, { top: insets.top + 12 }]} onPress={handleDismiss}>
        <Ionicons name="close" size={20} color={Colors.textMuted} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Header ── */}
          <View style={s.header}>
            <View style={s.logoWrap}>
              <Image source={require('../../assets/icon.png')} style={s.logoImage} resizeMode="cover" />
            </View>
            <Text style={s.appLabel}>SHELF EXPOSÉ PREMIUM</Text>
            <Text style={s.headline}>{title}</Text>
            {sub ? <Text style={s.headlineSub}>{sub}</Text> : null}
          </View>

          {/* ── Feature list ── */}
          <View style={s.featureList}>
            {content.features.map(({ icon, colorKey, text }, i) => {
              const color = resolveFeatureColor(colorKey);
              return (
                <View key={`${i}-${text}`} style={s.featureRow}>
                  <View style={[s.featureIcon, { backgroundColor: color + '18' }]}>
                    <Ionicons name={icon} size={17} color={color} />
                  </View>
                  <Text style={s.featureText}>{text}</Text>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                </View>
              );
            })}
          </View>

          {/* ── Plan selector — side-by-side cards, billed amount leads ── */}
          <View style={s.plans}>
            {(['yearly', 'monthly']).map((planId) => {
              const selected = selectedPlan === planId;
              const isYearly = planId === 'yearly';
              const p        = prices[planId];
              return (
                <TouchableOpacity
                  key={planId}
                  style={[s.planCard, selected && s.planCardSelected]}
                  onPress={() => setSelectedPlan(planId)}
                  activeOpacity={0.8}
                >
                  {isYearly ? (
                    <View style={s.trialBadge}>
                      <Text style={s.trialBadgeText}>{content.yearlyBadge}</Text>
                    </View>
                  ) : null}

                  <View style={[s.radio, selected && s.radioSelected]}>
                    {selected && <View style={s.radioDot} />}
                  </View>

                  <Text style={[s.planLabel, selected && s.planLabelSelected]}>
                    {planId.toUpperCase()}
                  </Text>

                  {/* Billed amount — the most prominent pricing element on the
                      card, per Apple 3.1.2(c). The calculated per-month price
                      is shown smaller, below, never the reverse. The period
                      suffix (/year, /month) is styled smaller than the price
                      itself so the actual number reads as the dominant part. */}
                  <Text style={[s.planPriceBig, selected && s.planPriceBigSelected]}>
                    {p.price}<Text style={s.planPricePeriod}>{p.period}</Text>
                  </Text>
                  {isYearly ? (
                    <Text style={s.planBilled}>{p.monthlyBig} · $0 due today</Text>
                  ) : (
                    <Text style={s.planBilled}>billed monthly</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── CTA ── */}
          <TouchableOpacity
            style={[s.ctaBtn, loading && s.ctaBtnLoading]}
            onPress={handleSubscribe}
            disabled={loading}
            activeOpacity={0.87}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={s.ctaText}>
                  {content.ctaLabels[selectedPlan]}
                </Text>
                <Ionicons name="arrow-forward" size={17} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Fine print — real renewal terms. Yearly explicitly states the
              trial duration AND the price billed once it ends, per Apple's
              free-trial disclosure requirement; both stay subordinate
              (small, plain text) to the billed amount shown on the card. */}
          <Text style={s.finePrint}>
            {selectedPlan === 'yearly' ? yearlyTrialFine : `${plan.price}${plan.period}`} — cancel anytime
          </Text>

          {/* Continue free / Restore */}
          <View style={s.footerLinks}>
            <TouchableOpacity onPress={handleDismiss}>
              <Text style={s.freeLink}>Continue with free version</Text>
            </TouchableOpacity>
            <Text style={s.footerSep}>·</Text>
            <TouchableOpacity onPress={handleRestore} disabled={loading}>
              <Text style={s.restoreLink}>Restore purchase</Text>
            </TouchableOpacity>
          </View>

          {/* Legal */}
          <Text style={s.legal}>
            Subscriptions auto-renew unless cancelled at least 24 hours before the end of the
            current period. Manage or cancel in your device's App Store settings.
          </Text>
          <View style={s.legalLinks}>
            <TouchableOpacity
              onPress={() => WebBrowser.openBrowserAsync('https://shelfexpose.app/terms')}
            >
              <Text style={s.legalLink}>Terms of Use</Text>
            </TouchableOpacity>
            <Text style={s.footerSep}>·</Text>
            <TouchableOpacity
              onPress={() => WebBrowser.openBrowserAsync('https://shelfexpose.app/privacy')}
            >
              <Text style={s.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  closeBtn:    {
    position: 'absolute', right: 18, zIndex: 10,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll:      { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32 },

  // Header
  header:      { alignItems: 'center', marginBottom: 24 },
  logoWrap:    {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    overflow: 'hidden',
  },
  logoImage:   { width: '100%', height: '100%' },
  appLabel:    { fontSize: 11, fontWeight: '800', color: Colors.primary, letterSpacing: 1.6, marginBottom: 10 },
  headline:    { fontSize: 34, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', lineHeight: 42, marginBottom: 6 },
  headlineSub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },

  // Feature list
  featureList: {
    backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border, marginBottom: 22,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  featureRow:  {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  featureIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  featureText: { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.textPrimary },

  // Plans — side by side, per-month price leads
  plans:            { flexDirection: 'row', gap: 10, marginBottom: 20 },
  planCard:         {
    flex: 1, alignItems: 'flex-start',
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 2, borderColor: Colors.border,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
    overflow: 'hidden',
  },
  planCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  radio:            {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  radioSelected:    { borderColor: Colors.primary },
  radioDot:         { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.primary },
  planLabel:        { fontSize: 12, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 6 },
  planLabelSelected:{ color: Colors.primaryDark ?? Colors.primary },
  planPriceBig:        { fontSize: 22, fontWeight: '800', color: Colors.textSecondary },
  planPriceBigSelected: { color: Colors.primary },
  planPricePeriod:     { fontSize: 13, fontWeight: '600' },
  planBilled:       { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  trialBadge:       {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10, paddingVertical: 3,
    borderBottomLeftRadius: 10,
  },
  trialBadgeText:   { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  // CTA
  ctaBtn:       {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 17,
    shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
    marginBottom: 10,
  },
  ctaBtnLoading:{ opacity: 0.7 },
  ctaText:      { fontSize: 17, fontWeight: '800', color: '#fff' },
  finePrint:    { fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginBottom: 20 },

  // Footer
  footerLinks:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 },
  footerSep:    { color: Colors.textMuted, fontSize: 12 },
  freeLink:     { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  restoreLink:  { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  legal:        { fontSize: 12, color: Colors.textMuted, textAlign: 'center', lineHeight: 17 },
  legalLinks:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 },
  legalLink:    { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', textDecorationLine: 'underline' },
});
