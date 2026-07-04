import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Animated, Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { DEFAULT_PREFS, saveUserPrefs, markOnboardingDone } from '../utils/storage';
import { optInToNotifications, declineNotificationPriming } from '../utils/notifications';
import { PRIMARY_GOAL_OPTIONS } from '../data/preferences';
import { STORES } from '../data/stores';
import { StoreLogo } from './ProfileScreen';

const { width: SCREEN_W } = Dimensions.get('window');

// Set right before onComplete() on the final "ready" step, cleared by
// AppNavigator the first time it's read. Survives the Auth screen (which
// sits between onboarding and the main tabs) because it's persisted storage,
// not React state — lets us land the user straight on the Scan tab post-auth.
const SCAN_AFTER_ONBOARDING_KEY = '@hc_scan_after_onboarding';

// ─── Static data for value-building screens ───────────────────────────────────

const BAD_PRODUCTS = [
  { name: 'Cheerios',         brand: 'General Mills', tag: 'Ultra-processed',    score: 28, color: '#E05252', emoji: '🌾' },
  { name: 'Doritos',          brand: 'PepsiCo',       tag: 'MSG + dyes',         score: 25, color: '#E05252', emoji: '🔺' },
  { name: 'Wonder Bread',     brand: 'Bimbo',         tag: 'HFCS + refined',     score: 18, color: '#D93B3B', emoji: '🍞' },
  { name: 'Pop-Tarts',        brand: 'Kellanova',     tag: 'Dyes + HFCS',        score: 20, color: '#D93B3B', emoji: '🍓' },
  { name: 'Coca-Cola',        brand: 'Coca-Cola Co.', tag: '39g sugar / can',    score: 22, color: '#E05252', emoji: '🥤' },
  { name: 'Lunchables',       brand: 'Kraft Heinz',   tag: 'Nitrites + sodium',  score: 24, color: '#E05252', emoji: '🧃' },
  { name: 'Oreos',            brand: 'Mondelēz',      tag: 'HFCS + palm oil',    score: 22, color: '#E05252', emoji: '🍪' },
  { name: 'Cheetos',          brand: 'PepsiCo',       tag: 'Yellow 6 + MSG',     score: 24, color: '#E05252', emoji: '🧀' },
  { name: 'Mountain Dew',     brand: 'PepsiCo',       tag: 'Yellow 5 + 46g sugar', score: 21, color: '#D93B3B', emoji: '💚' },
  { name: 'Kraft Mac & Cheese', brand: 'Kraft Heinz', tag: 'Yellow 5 & 6',       score: 26, color: '#E05252', emoji: '🧀' },
  { name: 'Hot Pockets',      brand: 'Nestlé',        tag: 'TBHQ + nitrites',    score: 23, color: '#D93B3B', emoji: '🌮' },
  { name: 'Eggo Waffles',     brand: 'Kellanova',     tag: 'TBHQ + dyes',        score: 27, color: '#E05252', emoji: '🧇' },
];


const COMPANY_SPOTLIGHT = {
  name: 'PepsiCo, Inc.',
  hq: 'Purchase, New York',
  revenue: '$91.5B',
  lobbyingSpend: '$6,200,000',
  donationSplit: { republican: 58, democrat: 42 },
  issue: 'Donated millions opposing mandatory GMO & added-sugar labeling laws.',
  brands: ['Pepsi', 'Doritos', 'Cheetos', 'Gatorade', 'Quaker', 'Mountain Dew'],
};

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = ['hook', 'reveal', 'transparency', 'allergens', 'dietary', 'goal', 'stores', 'notify', 'ready'];

const ALLERGEN_OPTIONS = [
  { id: 'peanuts',   label: 'Peanuts',        icon: 'alert-circle-outline' },
  { id: 'tree nuts', label: 'Tree Nuts',       icon: 'alert-circle-outline' },
  { id: 'milk',      label: 'Dairy / Milk',    icon: 'alert-circle-outline' },
  { id: 'eggs',      label: 'Eggs',            icon: 'alert-circle-outline' },
  { id: 'wheat',     label: 'Wheat / Gluten',  icon: 'alert-circle-outline' },
  { id: 'soy',       label: 'Soy',             icon: 'alert-circle-outline' },
  { id: 'fish',      label: 'Fish',            icon: 'alert-circle-outline' },
  { id: 'shellfish', label: 'Shellfish',        icon: 'alert-circle-outline' },
];

const DIETARY_OPTIONS = [
  { id: 'vegan',        label: 'Vegan',          icon: 'leaf-outline' },
  { id: 'vegetarian',   label: 'Vegetarian',     icon: 'flower-outline' },
  { id: 'gluten-free',  label: 'Gluten-Free',    icon: 'ban-outline' },
  { id: 'dairy-free',   label: 'Dairy-Free',     icon: 'water-outline' },
  { id: 'keto',         label: 'Keto',           icon: 'fitness-outline' },
  { id: 'paleo',        label: 'Paleo',          icon: 'nutrition-outline' },
  { id: 'low-sugar',    label: 'Low Sugar',      icon: 'trending-down-outline' },
  { id: 'organic-only', label: 'Organic Only',   icon: 'earth-outline' },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingScreen({ onComplete }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState({ ...DEFAULT_PREFS });
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

  const handleNext = async () => {
    // Continuing past a setup step counts as reviewing it (Skip does not).
    const reviewKey = { allergens: 'allergensReviewed', dietary: 'dietaryReviewed', goal: 'goalReviewed' }[currentStep];
    const nextPrefs = reviewKey ? { ...prefs, [reviewKey]: true } : prefs;
    if (reviewKey) setPrefs(nextPrefs);

    if (isLast) {
      await saveUserPrefs(nextPrefs);
      await markOnboardingDone();
      try {
        await AsyncStorage.setItem(SCAN_AFTER_ONBOARDING_KEY, 'true');
      } catch (e) {
        console.warn('[Onboarding] failed to set scan-after-onboarding flag:', e?.message ?? e);
      }
      onComplete();
      return;
    }
    goToStep(step + 1);
  };

  const handleSkip = () => goToStep(step + 1);

  const toggleArray = (key, id) => {
    setPrefs((p) => {
      const cur = p[key] ?? [];
      return { ...p, [key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });
  };

  const showSkip = !isLast && !['hook', 'reveal', 'transparency', 'notify', 'ready'].includes(currentStep);

  const nextLabel = () => {
    if (currentStep === 'hook')         return 'Show Me';
    if (currentStep === 'reveal')       return 'How does this work?';
    if (currentStep === 'transparency') return 'Set Up My Profile';
    if (isLast)                         return 'Start Scanning';
    return 'Continue';
  };

  // The notify step has its own two buttons ("Sure, remind me" / "Not now")
  // instead of the shared footer — both just advance to the next step after
  // recording the choice.
  const handleNotifyChoice = async (accepted) => {
    if (accepted) {
      await optInToNotifications();
    } else {
      await declineNotificationPriming();
    }
    goToStep(step + 1);
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
          {currentStep === 'hook'         && <HookStep />}
          {currentStep === 'reveal'       && <RevealStep />}
          {currentStep === 'transparency' && <TransparencyStep />}
          {currentStep === 'allergens'    && (
            <SelectStep
              title="Any food allergies?"
              subtitle="We'll highlight these on every product you scan — even trace amounts."
              options={ALLERGEN_OPTIONS}
              selected={prefs.allergens}
              onToggle={(id) => toggleArray('allergens', id)}
              noneLabel="No allergies"
              onNone={() => setPrefs((p) => ({ ...p, allergens: [] }))}
            />
          )}
          {currentStep === 'dietary' && (
            <SelectStep
              title="How do you eat?"
              subtitle="We'll personalise your ingredient flags and score summaries."
              options={DIETARY_OPTIONS}
              selected={prefs.dietaryFlags}
              onToggle={(id) => toggleArray('dietaryFlags', id)}
            />
          )}
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
          {currentStep === 'stores' && (
            <StoresStep
              selected={prefs.favoriteStores}
              onToggle={(id) => toggleArray('favoriteStores', id)}
            />
          )}
          {currentStep === 'notify' && <NotifyStep />}
          {currentStep === 'ready' && <ReadyStep />}
        </Animated.View>
      </ScrollView>

      {/* ── Footer ── */}
      {currentStep === 'notify' ? (
        <View style={[s.footer, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={s.skipBtn}
            onPress={() => handleNotifyChoice(false)}
          >
            <Text style={s.skipText}>Not now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.nextBtn}
            onPress={() => handleNotifyChoice(true)}
            activeOpacity={0.85}
          >
            <Text style={s.nextText}>Sure, remind me</Text>
            <Ionicons name="notifications" size={17} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
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
      )}
    </View>
  );
}

// ─── Step: Hook ───────────────────────────────────────────────────────────────

function HookStep() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={h.wrap}>
      {/* Animated scan ring */}
      <View style={h.ringWrap}>
        <Animated.View style={[h.ringOuter, { transform: [{ scale: pulse }] }]} />
        <View style={h.ringInner}>
          <Ionicons name="scan" size={52} color={Colors.primary} />
        </View>
      </View>

      <Text style={h.title}>You're about to see{'\n'}what's really in{'\n'}your food.</Text>

      <Text style={h.sub}>
        Most people have no idea what they're actually eating.
        We analyzed 7,500+ products so you don't have to.
      </Text>

      <View style={h.pills}>
        {[
          { icon: 'warning-outline',  color: Colors.flagRed,    text: 'Flagged additives highlighted' },
          { icon: 'flask-outline',    color: Colors.flagOrange, text: 'Ultra-processing detected' },
          { icon: 'business-outline', color: Colors.primary,    text: 'Corporate transparency' },
        ].map(({ icon, color, text }) => (
          <View key={text} style={h.pill}>
            <View style={[h.pillIcon, { backgroundColor: color + '18' }]}>
              <Ionicons name={icon} size={17} color={color} />
            </View>
            <Text style={h.pillText}>{text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const h = StyleSheet.create({
  wrap:      { alignItems: 'center', paddingTop: 24, paddingBottom: 12 },
  ringWrap:  { width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  ringOuter: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: Colors.primaryLight,
  },
  ringInner: {
    width: 96, height: 96, borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  title: {
    fontSize: 32, fontWeight: '800', color: Colors.textPrimary,
    textAlign: 'center', lineHeight: 42, marginBottom: 18,
  },
  sub: {
    fontSize: 16, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 25, marginBottom: 36, paddingHorizontal: 8,
  },
  pills:    { width: '100%', gap: 12 },
  pill:     { flexDirection: 'row', alignItems: 'center', gap: 14,
              backgroundColor: '#fff', borderRadius: 14, padding: 14,
              borderWidth: 1, borderColor: Colors.border,
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
              elevation: 1 },
  pillIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pillText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
});

// ─── Step: Reveal ─────────────────────────────────────────────────────────────

function RevealStep() {
  return (
    <View style={rv.wrap}>
      <Text style={rv.eyebrow}>WHAT WE FOUND</Text>
      <Text style={rv.title}>
        <Text style={{ color: Colors.flagRed }}>7,500+ products</Text>
        {'\n'}with concerning{'\n'}ingredients.
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
  return (
    <View style={pc.card}>
      {/* Score badge */}
      <View style={pc.scoreBadge}>
        <Text style={pc.scoreText}>{p.score}</Text>
      </View>
      {/* Emoji avatar */}
      <View style={pc.emojiWrap}>
        <Text style={pc.emoji}>{p.emoji}</Text>
      </View>
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
    position: 'absolute', top: 8, right: 8,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.flagRed,
    alignItems: 'center', justifyContent: 'center',
  },
  scoreText:  { fontSize: 11, fontWeight: '800', color: '#fff' },
  emojiWrap:  { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.dangerLight,
                alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emoji:      { fontSize: 22 },
  name:       { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, lineHeight: 17, marginBottom: 2 },
  brand:      { fontSize: 11, color: Colors.textMuted, marginBottom: 8 },
  tag:        { backgroundColor: Colors.dangerLight, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3,
                alignSelf: 'flex-start' },
  tagText:    { fontSize: 10, fontWeight: '700', color: Colors.flagRed },
});


// ─── Step: Transparency ───────────────────────────────────────────────────────

function TransparencyStep() {
  const c = COMPANY_SPOTLIGHT;
  const repPct = c.donationSplit.republican;
  const demPct = c.donationSplit.democrat;

  return (
    <View style={tr.wrap}>
      <Text style={tr.eyebrow}>YOUR EDGE</Text>
      <Text style={tr.title}>
        See who's really{'\n'}
        <Text style={{ color: Colors.primary }}>funding your food.</Text>
      </Text>
      <Text style={tr.sub}>
        We track the lobbying spend and political donations of every company
        behind the products you scan — so you can make values-aligned choices.
      </Text>

      {/* Company card */}
      <View style={tr.card}>
        {/* Header */}
        <View style={tr.cardHeader}>
          <View style={tr.logoPlaceholder}>
            <Text style={tr.logoText}>P</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={tr.companyName}>{c.name}</Text>
            <Text style={tr.companyHq}>{c.hq} · Revenue {c.revenue}</Text>
          </View>
        </View>

        <View style={tr.divider} />

        {/* Stats row */}
        <View style={tr.statsRow}>
          <View style={tr.stat}>
            <Text style={tr.statValue}>{c.lobbyingSpend}</Text>
            <Text style={tr.statLabel}>Annual Lobbying</Text>
          </View>
          <View style={tr.statDivider} />
          <View style={tr.stat}>
            <Text style={tr.statValue}>{c.brands.length}+</Text>
            <Text style={tr.statLabel}>Brands Owned</Text>
          </View>
        </View>

        <View style={tr.divider} />

        {/* Donation split */}
        <Text style={tr.splitLabel}>Political Donation Split</Text>
        <View style={tr.splitBar}>
          <View style={[tr.splitRep, { flex: repPct }]}>
            <Text style={tr.splitBarText}>{repPct}% Rep</Text>
          </View>
          <View style={[tr.splitDem, { flex: demPct }]}>
            <Text style={tr.splitBarText}>{demPct}% Dem</Text>
          </View>
        </View>

        <View style={tr.divider} />

        {/* Issue callout */}
        <View style={tr.issueBadge}>
          <Ionicons name="warning-outline" size={15} color={Colors.flagOrange} style={{ marginTop: 1 }} />
          <Text style={tr.issueText}>{c.issue}</Text>
        </View>

        {/* Brand chips */}
        <View style={tr.brandChips}>
          {c.brands.map((b) => (
            <View key={b} style={tr.chip}>
              <Text style={tr.chipText}>{b}</Text>
            </View>
          ))}
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
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  logoText:        { fontSize: 24, fontWeight: '800', color: Colors.primary },
  companyName:     { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  companyHq:       { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  divider:         { height: 1, backgroundColor: Colors.border, marginVertical: 14 },
  statsRow:        { flexDirection: 'row', alignItems: 'center' },
  stat:            { flex: 1, alignItems: 'center' },
  statValue:       { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  statLabel:       { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  statDivider:     { width: 1, height: 36, backgroundColor: Colors.border },
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
  brandChips:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  chip:            { backgroundColor: Colors.primaryLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipText:        { fontSize: 11, fontWeight: '600', color: Colors.primary },
  footnote:        { fontSize: 11, color: Colors.textMuted, textAlign: 'center', lineHeight: 16 },
});

// ─── Step: SelectStep (allergens / dietary / goal) ────────────────────────────

function SelectStep({ title, subtitle, options, selected, onToggle, single = false, noneLabel, onNone }) {
  const noneActive = noneLabel && selected.length === 0;
  return (
    <View style={ss.wrap}>
      <Text style={ss.title}>{title}</Text>
      <Text style={ss.sub}>{subtitle}</Text>
      <View style={ss.grid}>
        {noneLabel && (
          <TouchableOpacity
            style={[ss.chip, ss.chipFull, noneActive && ss.chipActive]}
            onPress={onNone}
            activeOpacity={0.75}
          >
            <Ionicons name="checkmark-circle-outline" size={14} color={noneActive ? '#fff' : Colors.primary} />
            <Text style={[ss.chipText, noneActive && ss.chipTextActive]}>{noneLabel}</Text>
          </TouchableOpacity>
        )}
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <TouchableOpacity
              key={opt.id}
              style={[ss.chip, active && ss.chipActive, single && ss.chipFull]}
              onPress={() => onToggle(opt.id)}
              activeOpacity={0.75}
            >
              {opt.icon && (
                <Ionicons name={opt.icon} size={14} color={active ? '#fff' : Colors.primary} />
              )}
              <Text style={[ss.chipText, active && ss.chipTextActive]}>{opt.label}</Text>
              {active && <Ionicons name="checkmark" size={13} color="#fff" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const ss = StyleSheet.create({
  wrap:          { paddingBottom: 16 },
  title:         { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8, lineHeight: 33 },
  sub:           { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 24 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip:          {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 22, borderWidth: 1.5, borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  chipActive:    { backgroundColor: Colors.primary },
  chipFull:      { width: '100%' },
  chipText:      { fontSize: 14, fontWeight: '600', color: Colors.primary },
  chipTextActive:{ color: '#fff' },
});

// ─── Step: StoresStep (favorite stores) ───────────────────────────────────────

function StoresStep({ selected, onToggle }) {
  return (
    <View style={st.wrap}>
      <Text style={st.title}>Where do you shop?</Text>
      <Text style={st.sub}>Pick your favorite stores — we'll tailor shopping guides around them.</Text>
      <View style={st.grid}>
        {STORES.map((item) => {
          const active = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[st.card, active && st.cardActive]}
              onPress={() => onToggle(item.id)}
              activeOpacity={0.75}
            >
              <StoreLogo storeId={item.id} label={item.label} size={38} />
              <Text style={[st.cardLabel, active && st.cardLabelActive]} numberOfLines={1}>
                {item.label}
              </Text>
              {active && (
                <View style={st.check}>
                  <Ionicons name="checkmark" size={11} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap:          { paddingBottom: 16 },
  title:         { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8, lineHeight: 33 },
  sub:           { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 24 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card:          {
    width: (SCREEN_W - 48 - 20) / 3,
    alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 12, paddingHorizontal: 6,
    borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  cardActive:    { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  cardLabel:     { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  cardLabelActive: { color: Colors.primary },
  check:         {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
});

// ─── Step: NotifyStep (notification opt-in priming) ───────────────────────────

function NotifyStep() {
  return (
    <View style={nt.wrap}>
      <View style={nt.iconWrap}>
        <Ionicons name="notifications-outline" size={44} color={Colors.primary} />
      </View>
      <Text style={nt.title}>Want gentle reminders{'\n'}to decode your pantry?</Text>
      <Text style={nt.sub}>
        We'll nudge you here and there — never anything pushy, and you can turn
        it off anytime in your profile.
      </Text>
    </View>
  );
}

const nt = StyleSheet.create({
  wrap:     { alignItems: 'center', paddingTop: 24, paddingBottom: 12 },
  iconWrap: {
    width: 96, height: 96, borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 28,
  },
  title:    {
    fontSize: 26, fontWeight: '800', color: Colors.textPrimary,
    textAlign: 'center', lineHeight: 34, marginBottom: 14,
  },
  sub:      {
    fontSize: 15, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 22, paddingHorizontal: 8,
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
          <Ionicons name="checkmark-circle" size={64} color={Colors.primary} />
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
