import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Animated, Dimensions, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import Slider from '@react-native-community/slider';
import { Colors } from '../constants/colors';
import { DEFAULT_PREFS, saveUserPrefs, markOnboardingDone } from '../utils/storage';
import { optInToNotifications } from '../utils/notifications';
import { DEADLINE_BUCKETS, bucketToTargetDate, enableGoalReminders } from '../utils/goalReminders';
import { PRIMARY_GOAL_OPTIONS } from '../data/preferences';
import { SelectStep } from '../components/setupSteps';
import SpecsMascot from '../components/SpecsMascot';
import PaywallContent from '../components/PaywallContent';
import OfferContent from '../components/OfferContent';
import { PRODUCT_IMAGES, COMPANY_LOGOS } from '../data/onboardingAssets';
import { COMPANY_DB } from '../data/companies';
import { formatCurrency } from '../utils/scorer';

const { width: SCREEN_W } = Dimensions.get('window');

// Set right before onComplete() on the final "ready" step, cleared by
// AppNavigator the first time it's read. Survives the Auth screen (which
// sits between onboarding and the main tabs) because it's persisted storage,
// not React state — lets us land the user straight on the Scan tab post-auth.
const SCAN_AFTER_ONBOARDING_KEY = '@hc_scan_after_onboarding';

// ─── Static data for value-building screens ───────────────────────────────────

const BAD_PRODUCTS = [
  { name: 'Cheerios',         slug: 'cheerios',     brand: 'General Mills', tag: 'Ultra-processed',    score: 28, color: '#E05252', emoji: '🌾' },
  { name: 'Doritos',          slug: 'doritos',      brand: 'PepsiCo',       tag: 'MSG + dyes',         score: 25, color: '#E05252', emoji: '🔺' },
  { name: 'Wonder Bread',     slug: 'wonder-bread', brand: 'Bimbo',         tag: 'HFCS + refined',     score: 18, color: '#D93B3B', emoji: '🍞' },
  { name: 'Pop-Tarts',        slug: 'pop-tarts',    brand: 'Kellanova',     tag: 'Dyes + HFCS',        score: 20, color: '#D93B3B', emoji: '🍓' },
  { name: 'Coca-Cola',        slug: 'coca-cola',    brand: 'Coca-Cola Co.', tag: '39g sugar / can',    score: 22, color: '#E05252', emoji: '🥤' },
  { name: 'Lunchables',       slug: 'lunchables',   brand: 'Kraft Heinz',   tag: 'Nitrites + sodium',  score: 24, color: '#E05252', emoji: '🧃' },
  { name: 'Oreos',            slug: 'oreos',        brand: 'Mondelēz',      tag: 'HFCS + palm oil',    score: 22, color: '#E05252', emoji: '🍪' },
  { name: 'Cheetos',          slug: 'cheetos',      brand: 'PepsiCo',       tag: 'Yellow 6 + MSG',     score: 24, color: '#E05252', emoji: '🧀' },
  { name: 'Mountain Dew',     slug: 'mountain-dew', brand: 'PepsiCo',       tag: 'Yellow 5 + 46g sugar', score: 21, color: '#D93B3B', emoji: '💚' },
  { name: 'Kraft Mac & Cheese', slug: 'kraft-mac',  brand: 'Kraft Heinz',   tag: 'Yellow 5 & 6',       score: 26, color: '#E05252', emoji: '🧀' },
  { name: 'Hot Pockets',      slug: 'hot-pockets',  brand: 'Nestlé',        tag: 'TBHQ + nitrites',    score: 23, color: '#D93B3B', emoji: '🌮' },
  { name: 'Eggo Waffles',     slug: 'eggo',         brand: 'Kellanova',     tag: 'TBHQ + dyes',        score: 27, color: '#E05252', emoji: '🧇' },
];

// Pulled LIVE from the real companies.js record (COMPANY_DB.pepsico) rather
// than a hand-maintained duplicate — a prior version of this const had drifted
// out of sync with the real data (fabricated-looking $6.2M/58-42 split vs. the
// real $3.9M/44-56). Never re-introduce a shadow copy here.
const PEPSICO = COMPANY_DB.pepsico;

// Onboarding-specific "incentive" stats — NOT stored in companies.js because
// they're catalog computations, not lobbying/political facts. Verified
// 2026-07-19 against assets/db/products.db (our own data) + USDA ERS. Recompute
// via: `select name, nutrition_json from products where companyId='pepsico'`
// (see src/data/research/pepsico_gmo_labeling_final.js for the GMO-labeling
// lobbying figures these stats sit alongside).
//   - Beverages (n=12 PepsiCo drinks in catalog): avg 28.5g sugar/serving,
//     max 53g (Naked Juice Green Machine). Mountain Dew = 46g.
//   - AHA added-sugar daily limit: 36g (men) / 25g (women) — heart.org.
//   - GMO-crop ingredient scan: 43/67 PepsiCo catalog products contain
//     corn/soy/canola-derived ingredients (text match on ingredients_json).
//   - USDA ERS 2024: >90% of US corn, soybean, and canola acres are GE varieties.
const PEPSICO_INCENTIVE_STATS = [
  {
    value: '28g',
    text: 'average sugar per serving across PepsiCo drinks in our catalog — one Mountain Dew (46g) alone exceeds a full day’s AHA added-sugar limit for an adult (25–36g).',
  },
  {
    value: '43 of 67',
    text: 'PepsiCo products in our catalog contain corn, soy, or canola — crops that are 90%+ genetically engineered in the U.S. (USDA ERS, 2024).',
  },
];

// Computed LIVE from the real company count (never a hand-typed guess — a
// prior version of this const was manually set to "270+" while the real
// count was 268, a genuine never-fabricate violation caught in review
// 2026-07-19). Floors to the nearest 10 so the "+" always stays true even
// as the catalog grows via the cowork product pipeline (see priorities.md).
const COMPANY_COUNT_LABEL = `${Math.floor(Object.keys(COMPANY_DB).length / 10) * 10}+`;

// Verified 2026-07-19 via WebSearch against primary/authoritative sources —
// never-fabricate gate (plan Part B3). Each figure traces to the source
// listed; do not edit a number without re-verifying it.
const STATS_PLACEHOLDER = [
  {
    icon: 'fast-food-outline',
    value: '53%',
    text: "of adult calories in the U.S. come from ultra-processed food — 62% for kids.",
    source: 'CDC / NHANES, Aug 2021–Aug 2023 (NCHS Data Brief No. 536, Aug 2025)',
  },
  {
    icon: 'water-outline',
    value: '~7g',
    text: 'of microplastics found in the average human brain — about the weight of a plastic spoon.',
    source: 'Nature Medicine, Feb 2025',
  },
  {
    icon: 'flask-outline',
    value: 'Banned in 4 countries',
    text: 'Potassium bromate — a possible carcinogen — is barred from bread in the EU, UK, Canada, and China. Still legal in the U.S.',
    source: 'IARC (WHO), Group 2B; FDA 21 CFR 137',
  },
  {
    icon: 'nutrition-outline',
    value: '94%',
    text: "of Americans don't get enough fiber. Only 1 in 10 eat enough vegetables.",
    source: 'USDA/HHS Dietary Guidelines 2020–2025; CDC MMWR, 2022',
  },
];

const CHALLENGE_OPTIONS = [
  { id: 'actually-healthy', label: 'Finding foods that are actually healthy, not just marketed that way' },
  { id: 'ingredient-lists', label: 'Understanding long ingredient lists and unfamiliar additives' },
  { id: 'compare-fast',     label: 'Comparing similar products fast, without reading every label' },
  { id: 'balance',          label: 'Balancing price, taste, health, and convenience' },
  { id: 'dietary-fit',      label: 'Finding meals that fit allergies, intolerances, or dietary needs' },
  { id: 'avoid-upf',        label: 'Avoiding excess sugar, sodium, saturated fat, and ultra-processed foods' },
  { id: 'claims-trust',     label: 'Knowing which nutrition claims to trust' },
  { id: 'time-budget',      label: 'Planning affordable meals with limited time' },
  { id: 'fresh-quality',    label: 'Finding quality, especially in fresh foods' },
];

// DEADLINE_BUCKETS is imported from utils/goalReminders.js — single source of
// truth shared with the bucket -> targetDate math and the reminder copy bank.

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = ['welcome', 'reveal', 'stats', 'transparency', 'goal', 'challenge', 'commitment', 'paywall', 'ready'];

// ─── Small helpers ──────────────────────────────────────────────────────────────

function commitmentLabel(v) {
  if (v <= 2) return 'Just curious';
  if (v <= 4) return 'Interested';
  if (v <= 6) return 'Motivated';
  if (v <= 8) return 'Serious';
  if (v <= 9) return 'Committed';
  return 'All in';
}

function mixColor(hex1, hex2, t) {
  const c1 = [1, 3, 5].map((i) => parseInt(hex1.substr(i, 2), 16));
  const c2 = [1, 3, 5].map((i) => parseInt(hex2.substr(i, 2), 16));
  return '#' + c1
    .map((c, i) => Math.round(c + (c2[i] - c) * t).toString(16).padStart(2, '0'))
    .join('');
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingScreen({ onComplete }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState({ ...DEFAULT_PREFS });
  const [paywallShowOffer, setPaywallShowOffer] = useState(false);
  const scrollRef = useRef(null);
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentStep = STEPS[step];
  const isLast      = step === STEPS.length - 1;
  const progressPct = step / (STEPS.length - 1);

  // Animate step transitions
  const goToStep = (next) => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      slideAnim.setValue(20);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  };

  const finishOnboarding = async (finalPrefs) => {
    await saveUserPrefs(finalPrefs);
    await markOnboardingDone();
    // A goal deadline was set in the commitment step (which already ran the
    // inline permission-priming flow) — schedule the actual reminder
    // cadence now that prefs are final (Part B7/B8).
    if (finalPrefs?.goalDeadline) {
      enableGoalReminders(finalPrefs).catch((e) => {
        console.warn('[Onboarding] enableGoalReminders failed:', e?.message ?? e);
      });
    }
    try {
      await AsyncStorage.setItem(SCAN_AFTER_ONBOARDING_KEY, 'true');
    } catch (e) {
      console.warn('[Onboarding] failed to set scan-after-onboarding flag:', e?.message ?? e);
    }
    onComplete();
  };

  const handleNext = async () => {
    // Continuing past a setup step counts as reviewing it (Skip does not).
    const reviewKey = { goal: 'goalReviewed', challenge: 'challengeReviewed' }[currentStep];
    const nextPrefs = reviewKey ? { ...prefs, [reviewKey]: true } : prefs;
    if (reviewKey) setPrefs(nextPrefs);

    if (isLast) {
      await finishOnboarding(nextPrefs);
      return;
    }
    goToStep(step + 1);
  };

  const handleSkip = () => goToStep(step + 1);

  // ── Paywall step callbacks ──────────────────────────────────────────────────
  // The "paywall" step renders full-screen (see early return below), so it
  // drives its own step advancement instead of going through handleNext.
  const handlePaywallPurchased = () => {
    setPaywallShowOffer(false);
    goToStep(step + 1); // -> ready
  };
  const handlePaywallDismissToOffer = () => setPaywallShowOffer(true);
  const handleOfferPurchased = () => {
    setPaywallShowOffer(false);
    goToStep(step + 1); // -> ready
  };
  const handleOfferPayFullPrice = () => setPaywallShowOffer(false);
  const handleOfferDismiss = () => {
    setPaywallShowOffer(false);
    goToStep(step + 1); // -> ready
  };

  // ── Commitment step handlers ────────────────────────────────────────────────
  const handlePickDeadline = (bucket) => {
    const targetDate = bucketToTargetDate(bucket.id);
    setPrefs((p) => ({ ...p, goalDeadline: { bucket: bucket.id, targetDate } }));
    // Deadline path runs the notification permission flow inline (Part B7) —
    // fire-and-forget; everyone else gets primed later, inside the
    // post-first-scan setup flow (Part B9). Scheduling the actual reminder
    // cadence happens at onboarding completion via goalReminders.js (B8).
    optInToNotifications().catch(() => {});
  };
  const handleClearDeadline = () => setPrefs((p) => ({ ...p, goalDeadline: null }));

  // ── Paywall step: full-screen, bypasses the standard progress/footer chrome ──
  if (currentStep === 'paywall') {
    return paywallShowOffer ? (
      <OfferContent
        onPurchased={handleOfferPurchased}
        onPayFullPrice={handleOfferPayFullPrice}
        onDismiss={handleOfferDismiss}
      />
    ) : (
      <PaywallContent
        onPurchased={handlePaywallPurchased}
        onDismiss={handlePaywallDismissToOffer}
      />
    );
  }

  const showSkip = !isLast && ['goal', 'challenge', 'commitment'].includes(currentStep);

  const nextLabel = () => {
    if (currentStep === 'welcome') return 'Show Me';
    if (isLast)                    return 'Start Scanning';
    return 'Continue';
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* ── Progress bar ── */}
      <View style={s.progressTrack}>
        <Animated.View style={[s.progressFill, { width: `${progressPct * 100}%` }]} />
      </View>

      {/* ── Content ── */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {currentStep === 'welcome'      && <WelcomeStep />}
          {currentStep === 'reveal'       && <RevealStep />}
          {currentStep === 'stats'        && <StatsStep />}
          {currentStep === 'transparency' && <TransparencyStep />}
          {currentStep === 'goal' && (
            <SelectStep
              title="What's your top goal?"
              subtitle="Pick one — this shapes which warnings we prioritise for you."
              options={PRIMARY_GOAL_OPTIONS.map((o) => ({ id: o.value, label: o.label }))}
              selected={prefs.primaryGoal ? [prefs.primaryGoal] : []}
              onToggle={(id) => setPrefs((p) => ({ ...p, primaryGoal: p.primaryGoal === id ? null : id }))}
              single
            />
          )}
          {currentStep === 'challenge' && (
            <SelectStep
              title="What's your biggest challenge when shopping?"
              subtitle="Pick one — we'll tailor tips around it."
              options={CHALLENGE_OPTIONS}
              selected={prefs.challenge ? [prefs.challenge] : []}
              onToggle={(id) => setPrefs((p) => ({ ...p, challenge: p.challenge === id ? null : id }))}
              single
            />
          )}
          {currentStep === 'commitment' && (
            <CommitmentStep
              commitment={prefs.commitment}
              onCommitmentChange={(v) => setPrefs((p) => ({ ...p, commitment: Math.round(v) }))}
              goalDeadline={prefs.goalDeadline}
              onPickDeadline={handlePickDeadline}
              onClearDeadline={handleClearDeadline}
              goalText={prefs.goalText}
              onGoalTextChange={(t) => setPrefs((p) => ({ ...p, goalText: t }))}
            />
          )}
          {currentStep === 'ready' && <ReadyStep />}
        </Animated.View>
      </ScrollView>

      {/* ── Footer ── */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 12 }]}>
        {showSkip && (
          <TouchableOpacity style={s.skipBtn} onPress={handleSkip}>
            <Text style={s.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={s.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={s.nextText}>{nextLabel()}</Text>
          <Ionicons name="arrow-forward" size={17} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Step: Welcome ────────────────────────────────────────────────────────────

function WelcomeStep() {
  const openTerms   = () => WebBrowser.openBrowserAsync('https://shelfexpose.netlify.app/terms');
  const openPrivacy = () => WebBrowser.openBrowserAsync('https://shelfexpose.netlify.app/privacy');

  return (
    <View style={w.wrap}>
      <Image source={require('../../assets/icon.png')} style={w.logo} resizeMode="cover" />

      <Text style={w.eyebrow}>WELCOME TO SHELF EXPOSÉ</Text>
      <Text style={w.title}>Stop guessing.</Text>
      <Text style={w.title}>Know everything{'\n'}about your food.</Text>

      <Text style={w.sub}>
        Most people have no idea what they're actually eating. We can analyze
        3,000,000+ products, 1,000,000+ ingredient listings, and {COMPANY_COUNT_LABEL} companies.
      </Text>

      <View style={w.pills}>
        {[
          { icon: 'warning-outline',  color: Colors.flagRed,    text: 'Flagged additives highlighted' },
          { icon: 'flask-outline',    color: Colors.flagOrange, text: 'Ultra-processing detected' },
          { icon: 'business-outline', color: Colors.primary,    text: 'Corporate transparency' },
        ].map(({ icon, color, text }) => (
          <View key={text} style={w.pill}>
            <View style={[w.pillIcon, { backgroundColor: color + '18' }]}>
              <Ionicons name={icon} size={17} color={color} />
            </View>
            <Text style={w.pillText}>{text}</Text>
          </View>
        ))}
      </View>

      <Text style={w.legal}>
        By continuing, you agree to our{' '}
        <Text style={w.legalLink} onPress={openTerms}>Terms of Service</Text>
        {' '}and{' '}
        <Text style={w.legalLink} onPress={openPrivacy}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}

const w = StyleSheet.create({
  wrap:      { alignItems: 'center', paddingTop: 8, paddingBottom: 12 },
  logo:      { width: 72, height: 72, borderRadius: 20, marginBottom: 20 },
  eyebrow:   { fontSize: 11, fontWeight: '800', color: Colors.primary, letterSpacing: 1.4, marginBottom: 12 },
  title:     {
    fontSize: 32, fontWeight: '800', color: Colors.textPrimary,
    textAlign: 'center', lineHeight: 40,
  },
  sub:       {
    fontSize: 15, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 23, marginTop: 16, marginBottom: 28, paddingHorizontal: 4,
  },
  pills:     { width: '100%', gap: 12, marginBottom: 24 },
  pill:      { flexDirection: 'row', alignItems: 'center', gap: 14,
               backgroundColor: '#fff', borderRadius: 14, padding: 14,
               borderWidth: 1, borderColor: Colors.border,
               shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
               elevation: 1 },
  pillIcon:  { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pillText:  { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  legal:     { fontSize: 12, color: Colors.textMuted, textAlign: 'center', lineHeight: 17, paddingHorizontal: 8 },
  legalLink: { color: Colors.textSecondary, fontWeight: '600', textDecorationLine: 'underline' },
});

// ─── Step: Reveal ─────────────────────────────────────────────────────────────

function RevealStep() {
  return (
    <View style={rv.wrap}>
      <Text style={rv.eyebrow}>WHAT WE FOUND</Text>
      <Text style={rv.title}>
        <Text style={{ color: Colors.flagRed }}>Household names</Text>
        {' '}with concerning{'\n'}ingredients.
      </Text>
      <Text style={rv.sub}>
        These are household names sitting in most American kitchens right now.
      </Text>

      {/* 2-col product grid */}
      <View style={rv.grid}>
        {BAD_PRODUCTS.map((p) => (
          <ProductBadCard key={p.name} product={p} />
        ))}
      </View>
    </View>
  );
}

function ProductBadCard({ product: p }) {
  const image = PRODUCT_IMAGES[p.slug];
  return (
    <View style={pc.card}>
      {/* Score badge — sits above the image tile */}
      <View style={pc.scoreBadge}>
        <Text style={pc.scoreText}>{p.score}</Text>
      </View>
      {/* Product image, falling back to the emoji avatar if unmapped */}
      {image ? (
        <View style={pc.imageWrap}>
          <Image source={image} style={pc.image} resizeMode="contain" />
        </View>
      ) : (
        <View style={pc.emojiWrap}>
          <Text style={pc.emoji}>{p.emoji}</Text>
        </View>
      )}
      <Text style={pc.name} numberOfLines={2}>{p.name}</Text>
      <Text style={pc.brand} numberOfLines={1}>{p.brand}</Text>
      {/* Concern tag */}
      <View style={pc.tag}>
        <Text style={pc.tagText}>{p.tag}</Text>
      </View>
    </View>
  );
}

const rv = StyleSheet.create({
  wrap:    { paddingBottom: 8 },
  eyebrow: { fontSize: 11, fontWeight: '800', color: Colors.flagRed, letterSpacing: 1.4, marginBottom: 8 },
  title:   { fontSize: 30, fontWeight: '800', color: Colors.textPrimary, lineHeight: 38, marginBottom: 12 },
  sub:     { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 24 },
  grid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});

const CARD_W = (SCREEN_W - 48 - 10) / 2;

const pc = StyleSheet.create({
  card: {
    width: CARD_W, backgroundColor: '#fff', borderRadius: 14,
    padding: 12, borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
    overflow: 'hidden',
  },
  scoreBadge: {
    position: 'absolute', top: 8, right: 8, zIndex: 2, elevation: 2,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.flagRed,
    alignItems: 'center', justifyContent: 'center',
  },
  scoreText:  { fontSize: 11, fontWeight: '800', color: '#fff' },
  imageWrap:  { width: '100%', height: 72, borderRadius: 10, backgroundColor: '#fff',
                borderWidth: 1, borderColor: Colors.border,
                alignItems: 'center', justifyContent: 'center', marginBottom: 8, overflow: 'hidden' },
  image:      { width: '100%', height: '100%' },
  emojiWrap:  { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.dangerLight,
                alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emoji:      { fontSize: 22 },
  name:       { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, lineHeight: 17, marginBottom: 2 },
  brand:      { fontSize: 11, color: Colors.textMuted, marginBottom: 8 },
  tag:        { backgroundColor: Colors.dangerLight, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3,
                alignSelf: 'flex-start' },
  tagText:    { fontSize: 10, fontWeight: '700', color: Colors.flagRed },
});

// ─── Step: Stats (NEW — scary but sourced) ─────────────────────────────────────

function StatsStep() {
  return (
    <View style={sts.wrap}>
      <Text style={sts.title}>The average grocery cart is worse than you think.</Text>
      <View style={sts.cards}>
        {STATS_PLACEHOLDER.map((stat, i) => (
          <View key={i} style={sts.card}>
            <View style={sts.iconWrap}>
              <Ionicons name={stat.icon} size={22} color={Colors.flagOrange} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={sts.value}>{stat.value}</Text>
              <Text style={sts.text}>{stat.text}</Text>
              <Text style={sts.source}>{stat.source}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const sts = StyleSheet.create({
  wrap:     { paddingBottom: 8 },
  title:    { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, lineHeight: 36, marginBottom: 24 },
  cards:    { gap: 12 },
  card:     {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.warningLight,
              alignItems: 'center', justifyContent: 'center' },
  value:    { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  text:     { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 4 },
  source:   { fontSize: 11, color: Colors.textMuted },
});

// ─── Step: Transparency ───────────────────────────────────────────────────────

function TransparencyStep() {
  const c = PEPSICO;
  const repPct = c.donationSplit.republican;
  const demPct = c.donationSplit.democrat;
  const gmoIssue = c.issues.find((i) => i.id === 'gmo-labeling-opposition');
  const sugarIssue = c.issues.find((i) => i.id === 'soda-tax-lobbying');

  return (
    <View style={tr.wrap}>
      <Text style={tr.eyebrow}>YOUR EDGE</Text>
      <Text style={tr.title}>Who really controls{'\n'}your food?</Text>
      <Text style={tr.sub}>
        Value-aligned choices depend on knowing where your money goes. We track
        the lobbying influence and political donations of every company behind
        everyday products.
      </Text>

      {/* Company card */}
      <View style={tr.card}>
        {/* Header */}
        <View style={tr.cardHeader}>
          <View style={tr.logoPlaceholder}>
            {COMPANY_LOGOS?.pepsico ? (
              <Image source={COMPANY_LOGOS.pepsico} style={tr.logoImage} resizeMode="contain" />
            ) : (
              <Text style={tr.logoText}>P</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={tr.companyName}>{c.name}</Text>
            <Text style={tr.companyHq}>{c.hq} · Revenue ${c.revenue}</Text>
          </View>
        </View>

        <View style={tr.divider} />

        {/* Stats row — "Brands Owned" cell dropped (chips already show them) */}
        <View style={tr.statsRow}>
          <View style={tr.stat}>
            <Text style={tr.statValue}>{formatCurrency(c.lobbyingSpend)}</Text>
            <Text style={tr.statLabel}>Annual Lobbying</Text>
          </View>
        </View>

        <View style={tr.divider} />

        {/* Focus block: labeling-opposition lobbying (founder-directed focus,
            2026-07-19) — GMO first, sugar-tax second. Short one-line
            compressions of the full sourced descriptions in companies.js
            (COMPANY_DB.pepsico.issues); the Company Profile shows the full text. */}
        {gmoIssue && (
          <View style={tr.issueBadge}>
            <Ionicons name="document-text-outline" size={15} color={Colors.flagOrange} style={{ marginTop: 1 }} />
            <Text style={tr.issueText}>
              Contributed $8M+ opposing mandatory GMO-labeling laws in 4 states (2012–2014).
            </Text>
          </View>
        )}
        {sugarIssue && (
          <View style={[tr.issueBadge, { marginTop: 8 }]}>
            <Ionicons name="cash-outline" size={15} color={Colors.flagOrange} style={{ marginTop: 1 }} />
            <Text style={tr.issueText}>
              Actively lobbies against sugary-drink taxes and labeling laws nationwide.
            </Text>
          </View>
        )}

        {/* Incentive stats: shows PepsiCo's own catalog data so the lobbying
            above reads as motive, not just abstract dollar figures. */}
        <View style={tr.incentiveBlock}>
          {PEPSICO_INCENTIVE_STATS.map((stat, i) => (
            <View key={i} style={tr.incentiveRow}>
              <Text style={tr.incentiveValue}>{stat.value}</Text>
              <Text style={tr.incentiveText}>{stat.text}</Text>
            </View>
          ))}
        </View>

        <View style={tr.divider} />

        {/* Brand chips */}
        <View style={tr.brandChips}>
          {c.subsidiaries.map((b) => (
            <View key={b} style={tr.chip}>
              <Text style={tr.chipText}>{b}</Text>
            </View>
          ))}
        </View>

        <View style={tr.divider} />

        {/* Donation split — moved to the bottom of the card (least important) */}
        <Text style={tr.splitLabel}>Political Donation Split</Text>
        <View style={tr.splitBar}>
          <View style={[tr.splitRep, { flex: repPct }]}>
            <Text style={tr.splitBarText}>{repPct}% Rep</Text>
          </View>
          <View style={[tr.splitDem, { flex: demPct }]}>
            <Text style={tr.splitBarText}>{demPct}% Dem</Text>
          </View>
        </View>
      </View>

      <Text style={tr.footnote}>
        Data sourced from OpenSecrets, SEC filings, and FDA/FTC public records.
      </Text>
    </View>
  );
}

const tr = StyleSheet.create({
  wrap:            { paddingBottom: 8 },
  eyebrow:         { fontSize: 11, fontWeight: '800', color: Colors.primary, letterSpacing: 1.4, marginBottom: 8 },
  title:           { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, lineHeight: 36, marginBottom: 12 },
  sub:             { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 24 },
  card:            {
    backgroundColor: '#fff', borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 3, marginBottom: 14,
  },
  cardHeader:      { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  logoPlaceholder: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  logoImage:       { width: '100%', height: '100%' },
  logoText:        { fontSize: 24, fontWeight: '800', color: Colors.primary },
  companyName:     { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  companyHq:       { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  divider:         { height: 1, backgroundColor: Colors.border, marginVertical: 14 },
  statsRow:        { flexDirection: 'row', alignItems: 'center' },
  stat:            { flex: 1, alignItems: 'center' },
  statValue:       { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  statLabel:       { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  splitLabel:      { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8 },
  splitBar:        { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', height: 28, marginBottom: 6 },
  splitRep:        { backgroundColor: '#D93B3B', alignItems: 'center', justifyContent: 'center' },
  splitDem:        { backgroundColor: '#3B6DD9', alignItems: 'center', justifyContent: 'center' },
  splitBarText:    { fontSize: 10, fontWeight: '800', color: '#fff' },
  issueBadge:      {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: Colors.warningLight, borderRadius: 10, padding: 10,
  },
  issueText:       { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, flex: 1 },
  incentiveBlock:  { marginTop: 12, gap: 10 },
  incentiveRow:    { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  incentiveValue:  { fontSize: 15, fontWeight: '800', color: Colors.primary, minWidth: 62 },
  incentiveText:   { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, flex: 1 },
  brandChips:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  chip:            { backgroundColor: Colors.primaryLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipText:        { fontSize: 11, fontWeight: '600', color: Colors.primary },
  footnote:        { fontSize: 11, color: Colors.textMuted, textAlign: 'center', lineHeight: 16 },
});

// ─── Step: Commitment (NEW) ─────────────────────────────────────────────────────

function CommitmentStep({
  commitment, onCommitmentChange,
  goalDeadline, onPickDeadline, onClearDeadline,
  goalText, onGoalTextChange,
}) {
  const [showBuckets, setShowBuckets] = useState(!!goalDeadline);
  const value = commitment ?? 5;
  const trackColor = mixColor(Colors.textSecondary, Colors.primary, (value - 1) / 9);

  const handleYes = () => setShowBuckets(true);
  const handleNo = () => {
    setShowBuckets(false);
    onClearDeadline();
  };

  return (
    <View style={cm.wrap}>
      <Text style={cm.title}>How committed are you?</Text>
      <Text style={cm.sub}>Slide to where you're really at today — no judgment.</Text>

      <Text style={[cm.sliderLabel, { color: trackColor }]}>{commitmentLabel(value)}</Text>
      <Slider
        style={cm.slider}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={value}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.border}
        thumbTintColor={Colors.primary}
        onValueChange={onCommitmentChange}
      />
      <View style={cm.sliderScale}>
        <Text style={cm.scaleText}>1</Text>
        <Text style={cm.scaleText}>10</Text>
      </View>

      <View style={cm.divider} />

      <Text style={cm.subTitle}>Do you have a deadline for your goal?</Text>
      <View style={cm.yesNoRow}>
        <TouchableOpacity
          style={[cm.yesNoBtn, showBuckets && cm.yesNoBtnActive]}
          onPress={handleYes}
          activeOpacity={0.75}
        >
          <Text style={[cm.yesNoText, showBuckets && cm.yesNoTextActive]}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[cm.yesNoBtn, !showBuckets && cm.yesNoBtnActive]}
          onPress={handleNo}
          activeOpacity={0.75}
        >
          <Text style={[cm.yesNoText, !showBuckets && cm.yesNoTextActive]}>No</Text>
        </TouchableOpacity>
      </View>

      {showBuckets && (
        <View style={cm.bucketGrid}>
          {DEADLINE_BUCKETS.map((b) => {
            const active = goalDeadline?.bucket === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                style={[cm.bucketChip, active && cm.bucketChipActive]}
                onPress={() => onPickDeadline(b)}
                activeOpacity={0.75}
              >
                <Text style={[cm.bucketText, active && cm.bucketTextActive]}>{b.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={cm.divider} />

      <Text style={cm.subTitle}>What's the goal? <Text style={cm.optional}>(optional)</Text></Text>
      <TextInput
        style={cm.input}
        placeholder="e.g. Fit into my old jeans by fall"
        placeholderTextColor={Colors.textMuted}
        value={goalText}
        onChangeText={onGoalTextChange}
        multiline
      />
    </View>
  );
}

const cm = StyleSheet.create({
  wrap:         { paddingBottom: 16 },
  title:        { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8, lineHeight: 33 },
  sub:          { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 20 },
  sliderLabel:  { fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  slider:       { width: '100%', height: 40 },
  sliderScale:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  scaleText:    { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  divider:      { height: 1, backgroundColor: Colors.border, marginVertical: 20 },
  subTitle:     { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  optional:     { fontSize: 13, fontWeight: '500', color: Colors.textMuted },
  yesNoRow:     { flexDirection: 'row', gap: 10, marginBottom: 12 },
  yesNoBtn:     {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#fff',
  },
  yesNoBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  yesNoText:    { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  yesNoTextActive: { color: Colors.primary },
  bucketGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bucketChip:   {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1.5, borderColor: Colors.primary, backgroundColor: Colors.primaryLight,
  },
  bucketChipActive: { backgroundColor: Colors.primary },
  bucketText:   { fontSize: 13, fontWeight: '600', color: Colors.primary },
  bucketTextActive: { color: '#fff' },
  input:        {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14,
    padding: 14, fontSize: 15, color: Colors.textPrimary, minHeight: 52,
    backgroundColor: '#fff', textAlignVertical: 'top',
  },
});

// ─── Step: Ready ──────────────────────────────────────────────────────────────

function ReadyStep() {
  return (
    <View style={rd.wrap}>
      <LinearGradient
        colors={[Colors.primaryLight, '#fff']}
        style={rd.gradient}
      >
        <View style={rd.iconWrap}>
          <SpecsMascot clip="shy-blush" size={96} />
        </View>
      </LinearGradient>

      <Text style={rd.title}>You're all set!</Text>
      <Text style={rd.sub}>
        Your profile is saved. Start scanning any barcode to instantly see
        its health score, ingredient risks, and the company behind it.
      </Text>

      <View style={rd.cards}>
        {[
          { icon: 'scan',           color: Colors.primary,     label: 'Scan any barcode',      sub: 'Point camera at any product' },
          { icon: 'warning-outline', color: Colors.flagOrange, label: 'Get instant flags',     sub: 'Additives, dyes, seed oils & more' },
          { icon: 'business-outline',color: Colors.primary,    label: 'Know the company',      sub: 'Lobbying, donations & controversies' },
        ].map(({ icon, color, label, sub }) => (
          <View key={label} style={rd.card}>
            <View style={[rd.cardIcon, { backgroundColor: color + '18' }]}>
              <Ionicons name={icon} size={20} color={color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={rd.cardLabel}>{label}</Text>
              <Text style={rd.cardSub}>{sub}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const rd = StyleSheet.create({
  wrap:       { alignItems: 'center', paddingBottom: 16 },
  gradient:   {
    width: 120, height: 120, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  iconWrap:   { alignItems: 'center', justifyContent: 'center' },
  title:      { fontSize: 30, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  sub:        {
    fontSize: 15, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 23, marginBottom: 32, paddingHorizontal: 8,
  },
  cards:      { width: '100%', gap: 10 },
  card:       {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  cardIcon:   { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardLabel:  { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  cardSub:    { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});

// ─── Shell styles ─────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background },
  progressTrack:{ height: 3, backgroundColor: Colors.border },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  scroll:       { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 },
  footer:       {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 24, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  skipBtn:      { paddingVertical: 14, paddingHorizontal: 8 },
  skipText:     { fontSize: 15, color: Colors.textMuted, fontWeight: '600' },
  nextBtn:      {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary,
    paddingVertical: 15, borderRadius: 14,
    shadowColor: Colors.primary, shadowOpacity: 0.35, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  nextText:     { fontSize: 16, fontWeight: '700', color: '#fff' },
});
