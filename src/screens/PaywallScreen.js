import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Animated, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import { maybeRequestAppReview } from '../utils/reviewPrompt';

// ─── Static feature list ──────────────────────────────────────────────────────

const FEATURES = [
  { icon: 'business-outline',      color: Colors.primary,    text: 'Company lobbying & donation data' },
  { icon: 'search-outline',        color: Colors.primary,    text: 'Search any product by name' },
  { icon: 'time-outline',          color: Colors.primary,    text: 'Unlimited scan history' },
  { icon: 'share-social-outline',  color: Colors.primary,    text: 'Share product health scores' },
  { icon: 'warning-outline',       color: Colors.flagOrange, text: 'Priority ingredient alerts' },
  { icon: 'shield-checkmark-outline', color: Colors.primary, text: 'Support independent food research' },
];

// ─── Fallback prices (shown if RC offerings haven't loaded yet) ───────────────

const FALLBACK_PRICES = {
  yearly:  { price: '$49.99', period: '/year',  monthly: '$4.17/mo' },
  monthly: { price: '$7.99',  period: '/month', monthly: null },
};

// Build intro-offer copy from a confirmed App Store Connect introductory price.
// Handles BOTH a free trial (price 0) and a discounted intro (e.g. 50% off the
// first year). Returns null when there is no intro offer, so the copy can never
// advertise an offer the store doesn't actually have. `periodLabel` is the
// display suffix for the plan (e.g. '/year').
function introOffer(pkg, periodLabel) {
  const introPrice = pkg?.product?.introPrice;
  if (!introPrice) return null;
  const n = introPrice.periodNumberOfUnits;
  const unit = (introPrice.periodUnit || '').toLowerCase();
  if (!n || !unit) return null;
  const regular = pkg.product.priceString;

  // Total length of the intro = unit × count × number of billing cycles. This lets a
  // monthly plan whose intro runs 12 cycles read as "first year" (not "first month").
  const cycles = introPrice.cycles ?? introPrice.numberOfPeriods ?? 1;
  const unitMonths = { day: 1 / 30, week: 0.25, month: 1, year: 12 }[unit] || 1;
  const totalMonths = unitMonths * n * cycles;
  const spanLabel =
    totalMonths >= 11.5 && totalMonths < 23 ? 'year'
    : totalMonths >= 23 ? `${Math.round(totalMonths / 12)} years`
    : totalMonths >= 1.5 ? `${Math.round(totalMonths)} months`
    : n > 1 ? `${n} ${unit}s` : unit;

  // Free trial
  if (introPrice.price === 0) {
    const unitLabel = unit.charAt(0).toUpperCase() + unit.slice(1) + (n > 1 ? 's' : '');
    const label = `${n} ${unitLabel} Free`;
    return { pill: label, cta: `Start ${label}`, fine: `${label}, then ${regular}${periodLabel || ''}` };
  }

  // Discounted intro (e.g. 50% off the first year — on either the monthly or yearly plan)
  const introStr = introPrice.priceString || `$${Number(introPrice.price).toFixed(2)}`;
  const full = pkg.product.price;
  let pill = `Intro ${introStr}`;
  if (full > 0 && introPrice.price < full) {
    const pct = Math.round((1 - introPrice.price / full) * 100);
    if (pct > 0) pill = `${pct}% off first ${spanLabel}`;
  }
  // A multi-cycle intro (e.g. monthly at 50% off for 12 months) charges per period, so
  // show the period suffix. A single-period intro (a year paid up front) already covers it.
  const introPer = cycles > 1 && periodLabel ? periodLabel : '';
  return {
    pill,
    cta: 'Unlock Pro Now',
    fine: `${introStr}${introPer} for your first ${spanLabel}, then ${regular}${periodLabel || ''}`,
  };
}

// ─── Headline copy per triggering feature ─────────────────────────────────────

function headlineCopy(feature) {
  switch (feature) {
    case 'company':
      return { title: 'See who funds\nyour food.',      sub: 'Company transparency is a Pro feature.' };
    case 'share':
      return { title: 'Share what\nyou discover.',      sub: 'Sharing scores is a Pro feature.' };
    case 'search':
      return { title: 'Find any\nproduct instantly.',   sub: 'Product search is a Pro feature.' };
    case 'history':
      return { title: 'Your complete\nscan history.',   sub: 'Full history is a Pro feature.' };
    case 'alternatives':
      return { title: 'See every\ncleaner option.',     sub: 'Full better-picks lists are a Pro feature.' };
    default:
      return { title: 'Unlock\nShelf Exposé Pro.',   sub: 'Everything you need to eat better.' };
  }
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PaywallScreen({ route, navigation }) {
  const insets  = useSafeAreaInsets();
  const feature = route?.params?.feature ?? null;
  const { title, sub } = headlineCopy(feature);

  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading,      setLoading]      = useState(false);
  const [rcPackages,   setRcPackages]   = useState({ yearly: null, monthly: null });
  const [prices,       setPrices]       = useState(FALLBACK_PRICES);
  const [offeringReady, setOfferingReady] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  // ── Entrance animation ─────────────────────────────────────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 340, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Load RC offering ───────────────────────────────────────────────────────
  useEffect(() => {
    loadOffering();
  }, []);

  const loadOffering = async () => {
    const offering = await getCurrentOffering();
    if (!offering) return;

    const { yearly: yearlyPkg, monthly: monthlyPkg } = extractPackages(offering);
    setRcPackages({ yearly: yearlyPkg, monthly: monthlyPkg });

    // Savings claim is computed from the real store prices — never hardcoded
    let saveSuffix = '';
    if (yearlyPkg && monthlyPkg && monthlyPkg.product.price > 0) {
      const pct = Math.round(
        (1 - yearlyPkg.product.price / 12 / monthlyPkg.product.price) * 100
      );
      if (pct > 0) saveSuffix = ` — save ${pct}%`;
    }

    // Use real localized prices from the App Store when available
    setPrices({
      yearly: {
        price:   yearlyPkg?.product.priceString  ?? FALLBACK_PRICES.yearly.price,
        period:  '/year',
        monthly: yearlyPkg
          ? `${_monthlyEquiv(yearlyPkg.product.price, yearlyPkg.product.currencyCode)}${saveSuffix}`
          : FALLBACK_PRICES.yearly.monthly,
      },
      monthly: {
        price:  monthlyPkg?.product.priceString ?? FALLBACK_PRICES.monthly.price,
        period: '/month',
        monthly: null,
      },
    });
    setOfferingReady(true);
  };

  // Helper: build "~$X.XX/mo" string from annual price
  const _monthlyEquiv = (annualPrice, currencyCode) => {
    try {
      const monthly = (annualPrice / 12).toFixed(2);
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode ?? 'USD' })
        .format(monthly) + '/mo';
    } catch {
      return null;
    }
  };

  // ── Purchase ───────────────────────────────────────────────────────────────
  const handleSubscribe = async () => {
    const pkg = rcPackages[selectedPlan];
    if (!pkg) {
      Alert.alert('Not Available', 'Unable to load this plan. Please check your connection and try again.');
      return;
    }

    setLoading(true);
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
        await maybeRequestAppReview('subscription');
        navigation.goBack();
      } else {
        Alert.alert(
          'Purchase received',
          'Your purchase went through, but Pro hasn\'t unlocked yet. Tap "Restore purchase" to sync it — or contact support if it keeps happening.'
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
      Alert.alert('Restored!', 'Your Pro subscription has been restored.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Nothing to Restore', 'No active subscription found for this account.');
    }
  };

  const handleSkip = () => navigation.goBack();

  const plan = prices[selectedPlan];
  // Intro/offer copy is derived only from real App Store Connect introPrice data,
  // so it can never advertise an offer the store doesn't actually have.
  const yearlyOffer = introOffer(rcPackages.yearly, prices.yearly.period);
  const monthlyOffer = introOffer(rcPackages.monthly, prices.monthly.period);
  const planOffer = selectedPlan === 'yearly' ? yearlyOffer : monthlyOffer;

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Close button — 44×44 touch target */}
      <TouchableOpacity style={[s.closeBtn, { top: insets.top + 12 }]} onPress={handleSkip}>
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
              <Ionicons name="leaf" size={32} color={Colors.primary} />
            </View>
            <Text style={s.appLabel}>SHELF EXPOSÉ PRO</Text>
            <Text style={s.headline}>{title}</Text>
            {sub ? <Text style={s.headlineSub}>{sub}</Text> : null}
          </View>

          {/* ── Feature list ── */}
          <View style={s.featureList}>
            {FEATURES.map(({ icon, color, text }) => (
              <View key={text} style={s.featureRow}>
                <View style={[s.featureIcon, { backgroundColor: color + '18' }]}>
                  <Ionicons name={icon} size={17} color={color} />
                </View>
                <Text style={s.featureText}>{text}</Text>
                <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
              </View>
            ))}
          </View>

          {/* ── Plan selector ── */}
          <View style={s.plans}>

            {/* Yearly */}
            {(['yearly', 'monthly']).map((planId) => {
              const selected  = selectedPlan === planId;
              const isYearly  = planId === 'yearly';
              const p         = prices[planId];
              return (
                <TouchableOpacity
                  key={planId}
                  style={[s.planCard, selected && s.planCardSelected]}
                  onPress={() => setSelectedPlan(planId)}
                  activeOpacity={0.8}
                >
                  {/* Left: radio + label */}
                  <View style={s.planLeft}>
                    <View style={[s.radio, selected && s.radioSelected]}>
                      {selected && <View style={s.radioDot} />}
                    </View>
                    <View>
                      <View style={s.planLabelRow}>
                        <Text style={[s.planLabel, selected && s.planLabelSelected]}>
                          {planId.toUpperCase()}
                        </Text>
                        {(planId === 'yearly' ? yearlyOffer : monthlyOffer) && (
                          <View style={s.trialPill}>
                            <Text style={s.trialText}>
                              {(planId === 'yearly' ? yearlyOffer : monthlyOffer).pill}
                            </Text>
                          </View>
                        )}
                      </View>
                      {p.monthly && (
                        <Text style={s.planMonthly}>{p.monthly}</Text>
                      )}
                    </View>
                  </View>

                  {/* Right: price */}
                  <View style={s.planRight}>
                    <Text style={[s.planPrice, selected && s.planPriceSelected]}>
                      {p.price}
                    </Text>
                    <Text style={s.planPeriod}>{p.period}</Text>
                  </View>

                  {isYearly && (
                    <View style={s.bestBadge}>
                      <Text style={s.bestBadgeText}>BEST VALUE</Text>
                    </View>
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
                  {planOffer ? planOffer.cta : 'Unlock Pro Now'}
                </Text>
                <Ionicons name="arrow-forward" size={17} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Fine print */}
          <Text style={s.finePrint}>
            {planOffer ? planOffer.fine : `${plan.price}${plan.period} — cancel anytime`}
          </Text>

          {/* Continue free / Restore */}
          <View style={s.footerLinks}>
            <TouchableOpacity onPress={handleSkip}>
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
              onPress={() => WebBrowser.openBrowserAsync('https://shelfexpose.netlify.app/terms')}
            >
              <Text style={s.legalLink}>Terms of Use</Text>
            </TouchableOpacity>
            <Text style={s.footerSep}>·</Text>
            <TouchableOpacity
              onPress={() => WebBrowser.openBrowserAsync('https://shelfexpose.netlify.app/privacy')}
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
  },
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

  // Plans
  plans:            { gap: 10, marginBottom: 20 },
  planCard:         {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 2, borderColor: Colors.border,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
    overflow: 'hidden',
  },
  planCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  planLeft:         { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  planRight:        { alignItems: 'flex-end' },
  radio:            {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected:    { borderColor: Colors.primary },
  radioDot:         { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  planLabelRow:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  planLabel:        { fontSize: 13, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5 },
  planLabelSelected:{ color: Colors.primaryDark ?? Colors.primary },
  planMonthly:      { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  trialPill:        { backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  trialText:        { fontSize: 10, fontWeight: '700', color: '#fff' },
  planPrice:        { fontSize: 20, fontWeight: '800', color: Colors.textSecondary },
  planPriceSelected:{ color: Colors.primary },
  planPeriod:       { fontSize: 11, color: Colors.textMuted, textAlign: 'right' },
  bestBadge:        {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10, paddingVertical: 3,
    borderBottomLeftRadius: 10,
  },
  bestBadgeText:    { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

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
