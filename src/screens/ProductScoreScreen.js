import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Share, StatusBar, Image, ActivityIndicator, Animated, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import {
  scoreProduct, scoreToColor, scoreToVerdict, generateScoreExplanation, getPersonalisedWarnings,
} from '../utils/scorer';
import {
  addScanToHistory, getUserPrefs,
  hasBeenPromptedForSetup, markSetupPrompted,
} from '../utils/storage';
import { logProductRequest } from '../utils/productRequests';
import { logProductEvent } from '../utils/scanAnalytics';
import { logFirstScanIfNeeded } from '../utils/appAnalytics';
import { useProStatus } from '../utils/subscription';
import { getAlternatives } from '../utils/alternatives';
import { recordScanAndPickCelebration } from '../utils/mascotMoments';
import { COMPANY_DB } from '../data/companies';
import IngredientRow from '../components/IngredientRow';
import GradeRing from '../components/GradeRing';
import StatBar from '../components/StatBar';
import SpecsMascot from '../components/SpecsMascot';
import BackButton from '../components/BackButton';

// ── Flag utils ────────────────────────────────────────────────────────────────

const FLAG_RANK = { avoid: 0, caution: 1, moderate: 2, ok: 3, allergen: 3 };

const isBad = (item) => item.flag === 'avoid' || item.flag === 'caution';
const isOkay = (item) => item.flag === 'moderate';
const isGood = (item) => item.flag === 'ok' || item.flag === 'allergen';

// ── Sub-components ────────────────────────────────────────────────────────────

function IngredientSummaryRow({ totalBad, totalOkay, totalGood }) {
  return (
    <View style={sumS.row}>
      <View style={[sumS.pill, { backgroundColor: '#FDE8E8' }]}>
        <Text style={[sumS.dot, { color: '#D93B3B' }]}>🔴</Text>
        <Text style={[sumS.count, { color: '#D93B3B' }]}>{totalBad}</Text>
        <Text style={[sumS.label, { color: '#D93B3B' }]}>Bad</Text>
      </View>
      <View style={[sumS.pill, { backgroundColor: '#FEF9E7' }]}>
        <Text style={[sumS.dot, { color: '#F5C842' }]}>🟡</Text>
        <Text style={[sumS.count, { color: '#F5C842' }]}>{totalOkay}</Text>
        <Text style={[sumS.label, { color: '#F5C842' }]}>Okay</Text>
      </View>
      <View style={[sumS.pill, { backgroundColor: '#E8F7F2' }]}>
        <Text style={[sumS.dot, { color: '#1D9E75' }]}>🟢</Text>
        <Text style={[sumS.count, { color: '#1D9E75' }]}>{totalGood}</Text>
        <Text style={[sumS.label, { color: '#1D9E75' }]}>Good</Text>
      </View>
    </View>
  );
}
const sumS = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  pill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 10, borderRadius: 14,
  },
  dot: { fontSize: 13 },
  count: { fontSize: 18, fontWeight: '800' },
  label: { fontSize: 12, fontWeight: '600' },
});

const ALLERGEN_NEUTRAL_INFO = { color: '#5C7A72', bg: '#EDF2F0', label: 'Common allergen' };

const VERDICT_META = {
  bad:      { label: 'Avoid & Caution', color: '#D93B3B', bg: '#FDE8E8' },
  okay:     { label: 'Moderate',        color: '#F5A623', bg: '#FEF9E7' },
  good:     { label: 'Good',            color: '#1D9E75', bg: '#E8F7F2' },
};

function sortWithinVerdict(a, b) {
  if (a.category === 'unknown' && b.category !== 'unknown') return 1;
  if (b.category === 'unknown' && a.category !== 'unknown') return -1;
  const rank = (x) => FLAG_RANK[x.flag] ?? 3;
  const r = rank(a) - rank(b);
  if (r !== 0) return r;
  return (a.label ?? '').localeCompare(b.label ?? '');
}

function groupByVerdict(analyzedIngredients, personalAllergenLabels) {
  const bad = [];
  const okay = [];
  const good = [];

  analyzedIngredients.forEach((item) => {
    if (item.flag === 'allergen') {
      const isPersonalHit = personalAllergenLabels?.has(item.label);
      if (isPersonalHit) {
        bad.push(item);
      } else {
        good.push({ ...item, flagInfo: ALLERGEN_NEUTRAL_INFO });
      }
      return;
    }
    if (isBad(item)) bad.push(item);
    else if (isOkay(item)) okay.push(item);
    else good.push(item);
  });

  bad.sort(sortWithinVerdict);
  okay.sort(sortWithinVerdict);
  good.sort(sortWithinVerdict);

  return { bad, okay, good };
}

function VerdictSection({ verdictKey, items, collapsed, onToggle }) {
  const meta = VERDICT_META[verdictKey];

  return (
    <View style={catS.wrap}>
      <TouchableOpacity style={catS.header} onPress={onToggle} activeOpacity={0.7}>
        <Text style={catS.name}>{meta.label}</Text>
        <View style={catS.right}>
          <View style={[catS.pill, { backgroundColor: meta.bg }]}>
            <Text style={[catS.pillText, { color: meta.color }]}>{items.length}</Text>
          </View>
          <Ionicons
            name={collapsed ? 'chevron-down' : 'chevron-up'}
            size={14}
            color="#9BB5AE"
          />
        </View>
      </TouchableOpacity>
      {!collapsed && (
        <View style={catS.body}>
          {items.map((item, i) => <IngredientRow key={i} item={item} />)}
        </View>
      )}
    </View>
  );
}
const catS = StyleSheet.create({
  wrap: { marginBottom: 10, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#EDF2F0' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 13 },
  emoji: { fontSize: 17 },
  name: { flex: 1, fontSize: 13, fontWeight: '700', color: '#1A2E28' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10 },
  pillBad: { backgroundColor: '#FDE8E8' },
  pillOkay: { backgroundColor: '#FEF9E7' },
  pillGood: { backgroundColor: '#E8F7F2' },
  pillText: { fontSize: 11, fontWeight: '700' },
  pillTextBad: { color: '#D93B3B' },
  pillTextOkay: { color: '#F5A623' },
  pillTextGood: { color: '#1D9E75' },
  body: { paddingHorizontal: 14 },
});

// ── Better picks (alternatives) ────────────────────────────────────────────────

function AlternativeCard({ item, onPress }) {
  const color = scoreToColor(item._score);
  const hasBrand = item.brand && item.brand !== 'Unknown Brand';

  return (
    <TouchableOpacity style={altS.card} onPress={onPress} activeOpacity={0.75}>
      <View style={altS.thumbWrap}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={altS.thumb} resizeMode="contain" />
        ) : hasBrand ? (
          <View style={altS.thumbBrandTile}>
            <Text style={altS.thumbBrandLetter}>{item.brand.charAt(0).toUpperCase()}</Text>
          </View>
        ) : (
          <View style={altS.thumbFallback}>
            <Ionicons name="cube-outline" size={22} color="#B8C8C3" />
          </View>
        )}
        {/* Score number, not letter — the UI never shows letter grades. */}
        <View style={[altS.gradeBadge, { backgroundColor: color }]}>
          <Text style={altS.gradeBadgeText}>{item._score}</Text>
        </View>
      </View>
      <Text style={altS.name} numberOfLines={2}>{item.name}</Text>
      <Text style={altS.brand} numberOfLines={1}>{item.brand}</Text>
    </TouchableOpacity>
  );
}
const altS = StyleSheet.create({
  card: { width: 132, marginRight: 12 },
  thumbWrap: {
    width: 132, height: 100, borderRadius: 12, backgroundColor: '#F4F8F6',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    borderWidth: 1, borderColor: '#EDF2F0',
  },
  thumb: { width: '80%', height: '80%' },
  thumbBrandTile: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F7F2' },
  thumbBrandLetter: { fontSize: 30, fontWeight: '800', color: Colors.primary },
  thumbFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  gradeBadge: {
    position: 'absolute', top: 6, right: 6,
    minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 5,
    alignItems: 'center', justifyContent: 'center',
  },
  gradeBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  name: { fontSize: 13, fontWeight: '700', color: '#1A2E28', marginTop: 8, lineHeight: 17 },
  brand: { fontSize: 11, color: '#8AA49E', marginTop: 2 },
});

function BetterPicksSection({ product, alternatives, isPro, altShowAll, setAltShowAll, navigation }) {
  if (!alternatives || alternatives.length === 0) return null;

  const FREE_VISIBLE = 2;
  const PRO_VISIBLE = 6;

  const onCardPress = (alt) => {
    Haptics.selectionAsync().catch(() => {});
    navigation.push('ProductScore', { product: alt });
  };

  if (!isPro) {
    const visible = alternatives.slice(0, FREE_VISIBLE);
    const remaining = alternatives.length - visible.length;
    return (
      <View style={bpS.wrap}>
        <Text style={bpS.header}>Better picks in {product.category}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={bpS.row}>
          {visible.map((alt) => (
            <AlternativeCard key={alt.barcode} item={alt} onPress={() => onCardPress(alt)} />
          ))}
        </ScrollView>
        {remaining > 0 && (
          <TouchableOpacity
            style={bpS.seeAllRow}
            activeOpacity={0.75}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              navigation.navigate('Paywall', { feature: 'alternatives' });
            }}
          >
            <Text style={bpS.seeAllText}>See all {alternatives.length} cleaner options</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Pro: show up to PRO_VISIBLE, with a show-more expander for the rest.
  const visible = altShowAll ? alternatives : alternatives.slice(0, PRO_VISIBLE);
  const hasMore = alternatives.length > PRO_VISIBLE;

  return (
    <View style={bpS.wrap}>
      <Text style={bpS.header}>Better picks in {product.category}</Text>
      <View style={bpS.grid}>
        {visible.map((alt) => (
          <AlternativeCard key={alt.barcode} item={alt} onPress={() => onCardPress(alt)} />
        ))}
      </View>
      {hasMore && (
        <TouchableOpacity
          style={bpS.showMoreRow}
          activeOpacity={0.75}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            setAltShowAll((v) => !v);
          }}
        >
          <Text style={bpS.showMoreText}>
            {altShowAll ? 'Show less' : `Show ${alternatives.length - PRO_VISIBLE} more`}
          </Text>
          <Ionicons name={altShowAll ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
const bpS = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 14, marginBottom: 4 },
  header: { fontSize: 15, fontWeight: '700', color: '#1A2E28', marginBottom: 12 },
  row: { paddingRight: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  seeAllRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginTop: 12, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#E8F7F2',
  },
  seeAllText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  showMoreRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginTop: 12, paddingVertical: 10,
  },
  showMoreText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ProductScoreScreen({ route, navigation }) {
  const { product } = route?.params ?? {};
  const insets = useSafeAreaInsets();
  const { isPro, refresh: refreshPro } = useProStatus();
  const [result, setResult] = useState(null);
  const [warnings, setWarnings] = useState(null);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [collapsedCats, setCollapsedCats] = useState(new Set(['bad', 'okay', 'good']));
  const [prefs, setPrefs] = useState({ showLobbying: true, showDonations: true });
  // 'idle' | 'loading' | 'done'
  const [requestState, setRequestState] = useState('idle');
  const [alternatives, setAlternatives] = useState([]);
  const [altShowAll, setAltShowAll] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const gradeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!product) return;
    const r = scoreProduct(product);
    setResult(r);
    setAlternatives([]);
    setAltShowAll(false);
    setCelebration(null);

    const grade = r.displayGrade || r.grade;

    // Milestone celebrations only fire on a real scan (never when viewing
    // history, search results, or an alternative product) — that's what
    // fromScanner gates. Errors resolve to null inside the util itself, so
    // this never blocks the score screen from rendering.
    if (route?.params?.fromScanner) {
      recordScanAndPickCelebration({ displayGrade: grade })
        .then(setCelebration)
        .catch(() => {});
      // Funnel analytics: 'first_scan' fires once per install, no matter how
      // many real scans happen — logFirstScanIfNeeded() no-ops after the
      // first (see appAnalytics.js).
      logFirstScanIfNeeded().catch(() => {});
    }

    if (grade === 'D' || grade === 'F') {
      getAlternatives(product, { limit: 12 })
        .then(({ alternatives: alts }) => setAlternatives(alts))
        .catch(() => setAlternatives([]));
    }
    // Only add to history when navigating from the scanner, not when
    // viewing a past scan from the history list.
    if (!route?.params?.fromHistory) {
      addScanToHistory(product, r);
    }
    logProductEvent({
      barcode: product.barcode,
      category: product.category || null,
      score: typeof r.score === 'number' ? r.score : null,
      grade: r.displayGrade || r.grade || null,
      source: route?.params?.source || 'scan',
    }).catch(() => {});
    getUserPrefs().then((userPrefs) => {
      setPrefs(userPrefs);
      setWarnings(getPersonalisedWarnings(r.analyzedIngredients, product, userPrefs));
    });

    // Grade-reveal: haptic keyed to the grade, fired as the entrance animation starts.
    // Unscored products ('?', insufficient data) skip the haptic — it's not a bad grade.
    if (grade === 'A' || grade === 'B') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else if (grade === 'C') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    } else if (grade === 'D' || grade === 'F') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
    gradeAnim.setValue(0);
    Animated.spring(gradeAnim, {
      toValue: 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [product]);

  // Post-first-scan setup prompt (Part B9, Trigger 1) — once, ever, right as
  // the user leaves the score screen after a real scan (not history/search),
  // offer the "personalize your scans?" nudge into ProfileSetupScreen.
  // `beforeRemove` intercepts every way of leaving (back button, swipe
  // gesture, programmatic goBack) so this fires reliably; best-effort only —
  // never blocks navigation on failure.
  useEffect(() => {
    if (!route?.params?.fromScanner) return undefined;
    let handled = false;

    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (handled) return;
      handled = true;
      e.preventDefault();
      (async () => {
        try {
          const alreadyPrompted = await hasBeenPromptedForSetup();
          if (alreadyPrompted) {
            navigation.dispatch(e.data.action);
            return;
          }
          await markSetupPrompted();
          Alert.alert(
            'Got a minute to personalize your scans?',
            'Add allergens, dietary preferences, and your favorite stores — takes about a minute.',
            [
              { text: 'Not now', style: 'cancel', onPress: () => navigation.dispatch(e.data.action) },
              {
                text: "Let's go",
                onPress: () => {
                  navigation.dispatch(e.data.action);
                  navigation.navigate('ProfileSetup');
                },
              },
            ]
          );
        } catch (err) {
          console.warn('[ProductScore] setup-prompt check failed:', err?.message ?? err);
          navigation.dispatch(e.data.action);
        }
      })();
    });

    return unsubscribe;
  }, [navigation, route]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    await Share.share({
      message:
        `${product.name} scored ${result.score}/100 on Food Exposé.\n` +
        (result.avoidCount > 0
          ? `⚠️ ${result.avoidCount} ingredient(s) to avoid.`
          : '✅ No major red-flag ingredients!') +
        `\nGet the app: https://apps.apple.com/app/id6776718186`,
    });
  }, [result, product]);

  if (!product) return null;
  if (!result) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <SpecsMascot clip="idle-loop" size={88} />
      </View>
    );
  }

  const { score, grade, displayGrade, analyzedIngredients, insufficientData, hiddenUnreadableCount } = result;
  const gradeCol = insufficientData ? '#9BB5AE' : scoreToColor(score);
  const verdict = scoreToVerdict(displayGrade);
  const explanation = insufficientData ? null : generateScoreExplanation(product, result);
  const { nutrition = {} } = product;
  const company = product.companyId ? COMPANY_DB[product.companyId] : null;
  const hasHighSeverityIssues = company?.issues?.some((i) => i.severity === 'high');

  const personalAllergenLabels = new Set(
    (warnings?.allergenHits ?? []).flatMap(({ ingredients }) => ingredients.map((i) => i.label))
  );

  const { bad: verdictBad, okay: verdictOkay, good: verdictGood } =
    groupByVerdict(analyzedIngredients, personalAllergenLabels);

  const totalBad = verdictBad.length;
  const totalOkay = verdictOkay.length;
  const totalGood = verdictGood.length;

  const VERDICT_SECTIONS = [
    { key: 'bad', items: verdictBad },
    { key: 'okay', items: verdictOkay },
    { key: 'good', items: verdictGood },
  ].filter((sec) => sec.items.length > 0);

  const toggleCat = (key) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const TABS = ['ingredients', 'nutrition', 'company'];

  const showBetterPicks = (displayGrade === 'D' || displayGrade === 'F') && alternatives.length > 0;
  // Children before the sticky tab bar: 0 hero, 1 infoCard, 2 sayCard,
  // optionally 2b request card (insufficientData) or 2c better-picks (D/F),
  // then the sticky tab bar itself.
  const stickyIndex = 3 + (insufficientData || showBetterPicks ? 1 : 0);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        bounces
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[stickyIndex]}
      >
        {/* ── 0: Hero image ── */}
        <View style={s.heroWrap}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={s.heroImg} resizeMode="cover" />
          ) : (
            <View style={s.heroPlaceholder}>
              <Image
                source={require('../../assets/mascot/specs-placeholder-shrug.png')}
                style={s.heroLogo}
                resizeMode="contain"
              />
            </View>
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0)']}
            locations={[0, 0.22, 0.5]}
            style={[s.heroOverlay, { paddingTop: insets.top + 10 }]}
          >
            <TouchableOpacity style={s.navBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
          {celebration && (
            <SpecsMascot clip="backflip" size={96} style={s.heroCelebration} />
          )}
        </View>

        {/* ── 1: Product info + score ── */}
        <View style={s.infoCard}>
          <Text style={s.productName}>{product.name}</Text>
          <Text style={s.productMeta}>
            {product.brand}
            {product.category && product.category !== 'General' ? ` · ${product.category}` : ''}
          </Text>

          <View style={s.scoreRow}>
            <Animated.View
              style={{
                opacity: gradeAnim,
                transform: [{
                  scale: gradeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
                }],
              }}
            >
              <GradeRing score={insufficientData ? 0 : score} grade={displayGrade} color={gradeCol} size={88} />
            </Animated.View>
            <View style={s.scoreRight}>
              <View style={[s.verdictBadge, { backgroundColor: gradeCol + '1C' }]}>
                <Text style={[s.verdictText, { color: gradeCol }]}>{verdict}</Text>
              </View>
              <Text style={s.scoreSubLabel}>{insufficientData ? 'Not enough data to score' : 'out of 100'}</Text>
            </View>
          </View>

          {(product.isOrganic || product.isVegan || product.isGlutenFree) && (
            <View style={s.tagRow}>
              {product.isOrganic && <Tag icon="leaf" label="Organic" color={Colors.primary} />}
              {product.isVegan && <Tag icon="heart" label="Vegan" color={Colors.primary} />}
              {product.isGlutenFree && <Tag icon="checkmark-circle" label="Gluten-Free" color={Colors.primary} />}
            </View>
          )}
        </View>

        {/* ── 1b: Unverified community-data notice ── */}
        {product.source === 'community' && (
          <View style={s.unverifiedBanner}>
            <Ionicons name="globe-outline" size={18} color="#9A6B00" />
            <Text style={s.unverifiedBannerText}>
              <Text style={{ fontWeight: '800' }}>Unverified source: </Text>
              This product isn't in our curated database yet — the ingredients and score below come from a public, crowd-sourced listing and haven't been checked by Food Exposé.
            </Text>
          </View>
        )}

        {/* ── 2: Food Exposé Says ── */}
        <View style={[s.sayCard, { borderLeftColor: gradeCol }]}>
          <View style={s.sayMain}>
            <View style={s.sayHeader}>
              <View style={[s.sayIcon, { backgroundColor: gradeCol + '22' }]}>
                <Ionicons name="search" size={13} color={gradeCol} />
              </View>
              <Text style={[s.sayTitle, { color: gradeCol }]}>Food Exposé Says</Text>
            </View>
            {insufficientData ? (
              <Text style={s.sayText}>
                We don't have verified data on this product yet. We've flagged it for investigation — we'll research it and add a full score soon.
              </Text>
            ) : (
              <Text style={s.sayText}>{explanation}</Text>
            )}
          </View>
          <Image
            source={require('../../assets/mascot/specs-standing.png')}
            style={s.sayDetective}
            resizeMode="contain"
          />
        </View>

        {/* ── 2b: Request card (insufficient data only) ── */}
        {insufficientData && (
          <View style={s.requestCard}>
            {requestState === 'done' ? (
              <View style={s.requestConfirm}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                <Text style={s.requestConfirmText}>Got it — added to our research list.</Text>
              </View>
            ) : (
              <>
                <Text style={s.requestPrompt}>Want this one scored?</Text>
                <TouchableOpacity
                  style={[s.requestBtn, requestState === 'loading' && s.requestBtnDisabled]}
                  disabled={requestState === 'loading'}
                  activeOpacity={0.82}
                  onPress={async () => {
                    setRequestState('loading');
                    try {
                      await logProductRequest(product);
                    } catch (_) {
                      // silently swallow errors
                    }
                    setRequestState('done');
                  }}
                >
                  {requestState === 'loading' ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={s.requestBtnText}>Request a full exposé 🔍</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* ── 2c: Better picks (D/F grades only) ── */}
        {showBetterPicks && (
          <BetterPicksSection
            product={product}
            alternatives={alternatives}
            isPro={isPro}
            altShowAll={altShowAll}
            setAltShowAll={setAltShowAll}
            navigation={navigation}
          />
        )}

        {/* ── 3: Tabs (sticky) ── */}
        <View style={s.tabBarSticky}>
          <View style={s.tabBar}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[s.tab, activeTab === tab && s.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <View style={s.tabInner}>
                  <Text style={[s.tabLabel, activeTab === tab && s.tabLabelActive]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                  {tab === 'company' && hasHighSeverityIssues && (
                    <View style={s.tabDot} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 4: Tab body ── */}
        <View style={s.body}>

          {/* INGREDIENTS TAB */}
          {activeTab === 'ingredients' && (
            <View>
              {/* Personalised warnings */}
              {warnings?.allergenHits?.map(({ allergen, ingredients }) => (
                <View key={allergen} style={s.warnBanner}>
                  <Ionicons name="alert-circle" size={18} color="#9B59B6" />
                  <Text style={s.warnBannerText}>
                    <Text style={{ fontWeight: '800' }}>Allergen alert: </Text>
                    {allergen.charAt(0).toUpperCase() + allergen.slice(1)} detected
                    {' '}({ingredients.map((i) => i.label).join(', ')})
                  </Text>
                </View>
              ))}
              {warnings?.dietaryConflicts?.map(({ diet, label, ingredients }) => (
                <View key={diet} style={s.warnBannerYellow}>
                  <Ionicons name="warning-outline" size={18} color="#F5A623" />
                  <Text style={s.warnBannerYellowText}>
                    <Text style={{ fontWeight: '800' }}>Not {label}: </Text>
                    {ingredients.slice(0, 2).map((i) => i.label).join(', ')}
                    {ingredients.length > 2 ? ` +${ingredients.length - 2} more` : ''}
                  </Text>
                </View>
              ))}
              {warnings?.goalNote ? (
                <View style={s.warnBannerBlue}>
                  <Ionicons name="flag-outline" size={18} color="#3B82F6" />
                  <Text style={s.warnBannerBlueText}>{warnings.goalNote}</Text>
                </View>
              ) : null}
              {result.packagingConcern ? (
                <View style={s.warnBannerOrange}>
                  <Ionicons name="cube-outline" size={18} color="#C05621" />
                  <Text style={s.warnBannerOrangeText}>
                    <Text style={{ fontWeight: '800' }}>Packaging note: </Text>
                    {result.packagingConcern.note}
                  </Text>
                </View>
              ) : null}

              {/* Summary row */}
              <IngredientSummaryRow totalBad={totalBad} totalOkay={totalOkay} totalGood={totalGood} />

              {/* No ingredient data note (insufficient data path) */}
              {analyzedIngredients.length === 0 ? (
                <View style={s.noIngredientNote}>
                  <Ionicons name="information-circle-outline" size={20} color="#9BB5AE" />
                  <Text style={s.noIngredientNoteText}>No ingredient data available for this product.</Text>
                </View>
              ) : (
                <>
                  {/* All clear banner */}
                  {totalBad === 0 && totalOkay === 0 && (
                    <View style={s.allClear}>
                      <Ionicons name="checkmark-circle" size={22} color="#1D9E75" />
                      <Text style={s.allClearText}>No concerning ingredients found</Text>
                    </View>
                  )}

                  {/* Verdict sections */}
                  {VERDICT_SECTIONS.map(({ key, items }) => (
                    <VerdictSection
                      key={key}
                      verdictKey={key}
                      items={items}
                      collapsed={collapsedCats.has(key)}
                      onToggle={() => toggleCat(key)}
                    />
                  ))}
                </>
              )}

              {/* Hidden unreadable label entries (OCR garbage filtered out) */}
              {hiddenUnreadableCount > 0 && (
                <Text style={s.noIngredientNoteText}>
                  {hiddenUnreadableCount} unreadable label {hiddenUnreadableCount === 1 ? 'entry' : 'entries'} hidden
                </Text>
              )}

              {/* Certifications */}
              {product.certifications?.length > 0 && (
                <View style={s.certRow}>
                  {product.certifications.map((c, i) => (
                    <View key={i} style={s.certBadge}>
                      <Ionicons name="ribbon" size={12} color={Colors.primary} />
                      <Text style={s.certText}>{c}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* NUTRITION TAB */}
          {activeTab === 'nutrition' && (
            <View>
              <View style={s.nutHead}>
                <Text style={s.nutTitle}>Nutrition Facts</Text>
                <Text style={s.nutSub}>
                  {nutrition.perServing
                    ? `Per serving${product.servingSize ? `: ${product.servingSize}` : ''} · ${product.calories ?? '—'} kcal`
                    : `Per 100g · ${product.calories ?? '—'} kcal`}
                </Text>
              </View>
              <StatBar label="Sugar" value={nutrition.sugars ?? 0} max={50} unit="g" warn={(nutrition.sugars ?? 0) > 20} />
              <StatBar label="Sodium" value={nutrition.sodium ?? 0} max={600} unit="mg" warn={(nutrition.sodium ?? 0) > 400} />
              <StatBar label="Saturated Fat" value={nutrition.saturatedFat ?? 0} max={20} unit="g" warn={(nutrition.saturatedFat ?? 0) > 8} />
              <StatBar label="Total Fat" value={nutrition.fat ?? 0} max={40} unit="g" />
              <StatBar label="Carbohydrates" value={nutrition.carbs ?? 0} max={80} unit="g" />
              <StatBar label="Protein" value={nutrition.protein ?? 0} max={30} unit="g" />
              {(nutrition.sugars ?? 0) > 20 && (
                <View style={s.nutAlert}>
                  <Ionicons name="warning" size={14} color="#D93B3B" />
                  <Text style={s.nutAlertText}>
                    High sugar content — above the daily recommended threshold per serving.
                  </Text>
                </View>
              )}
              {(nutrition.sodium ?? 0) > 400 && (
                <View style={s.nutAlert}>
                  <Ionicons name="warning" size={14} color="#D93B3B" />
                  <Text style={s.nutAlertText}>
                    High sodium — contributes significantly to the 2,300mg daily limit.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* COMPANY TAB */}
          {activeTab === 'company' && !isPro && (
            <View>
              {company && (
                <View style={s.coTeaserWrap}>
                  <Text style={s.coName}>{company.name}</Text>
                  <Text style={s.coHQ}>{company.hq}</Text>
                  {company.issues?.length > 0 ? (
                    <View style={s.coTeaserAlert}>
                      <Ionicons name="alert-circle" size={14} color="#D93B3B" />
                      <Text style={s.coTeaserAlertText}>
                        {company.issues.filter((i) => i.severity === 'high').length > 0
                          ? `${company.issues.filter((i) => i.severity === 'high').length} high-severity issue${company.issues.filter((i) => i.severity === 'high').length > 1 ? 's' : ''} on record — unlock to see details`
                          : `${company.issues.length} documented issue${company.issues.length > 1 ? 's' : ''} — unlock to see details`}
                      </Text>
                    </View>
                  ) : (
                    <View style={s.coTeaserClean}>
                      <Ionicons name="checkmark-circle" size={14} color="#1D9E75" />
                      <Text style={s.coTeaserCleanText}>No major issues on record</Text>
                    </View>
                  )}
                </View>
              )}
              <ProGateCard
                icon="business-outline"
                title="Company Transparency"
                desc="See lobbying spend, political donations, and full issue breakdowns behind every brand you scan."
                onUpgrade={() => navigation.navigate('Paywall', { feature: 'company' })}
              />
            </View>
          )}
          {activeTab === 'company' && isPro && (
            <View>
              {company ? (
                <>
                  <View style={s.coHead}>
                    <Text style={s.coName}>{company.name}</Text>
                    <Text style={s.coHQ}>{company.hq}</Text>
                  </View>

                  {/* This row is a flexible flex-row (not a fixed grid), so a
                      missing stat is simply omitted rather than shown as
                      "undefined"/"$undefined" — no placeholder text needed
                      since 1-3 cells all lay out fine. lobbyingSpend of 0 is
                      this dataset's "unresearched" sentinel (see
                      getLobbyingRiskLevel in scorer.js), not a verified zero,
                      so it's treated the same as missing here. The row itself
                      is skipped when every stat is missing (small/private
                      sparse records), rather than rendering an empty box. */}
                  {(company.employees != null ||
                    company.revenue != null ||
                    (prefs.showLobbying !== false && company.lobbyingSpend > 0)) && (
                    <View style={s.coStats}>
                      {company.employees != null && (
                        <CoStat icon="people-outline" label="Employees" value={company.employees} />
                      )}
                      {company.revenue != null && (
                        <CoStat icon="trending-up-outline" label="Revenue" value={`$${company.revenue}`} />
                      )}
                      {prefs.showLobbying !== false && company.lobbyingSpend > 0 && (
                        <CoStat
                          icon="megaphone-outline"
                          label="Lobbying/yr"
                          value={formatMoney(company.lobbyingSpend)}
                          highlight
                        />
                      )}
                    </View>
                  )}

                  {company.issues?.length > 0 && (
                    <TouchableOpacity
                      style={s.coAlert}
                      onPress={() => navigation.navigate('CompanyProfile', { company, initialTab: 'issues' })}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="alert-circle" size={15} color="#D93B3B" />
                      <Text style={s.coAlertText}>
                        {company.issues.filter((i) => i.severity === 'high').length} high-severity &{' '}
                        {company.issues.filter((i) => i.severity === 'medium').length} medium issues documented.
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color="#D93B3B" />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={s.coBtn}
                    onPress={() => navigation.navigate('CompanyProfile', { company })}
                  >
                    <View style={s.coBtnL}>
                      <Ionicons name="business-outline" size={18} color={Colors.primary} />
                      <Text style={s.coBtnText}>View Full Transparency Profile</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
                  </TouchableOpacity>

                  {company.subsidiaries?.length > 0 && (
                    <>
                      <Text style={s.coSubLabel}>Other brands owned by {company.name}:</Text>
                      <View style={s.coSubRow}>
                        {company.subsidiaries.map((b, i) => (
                          <View key={i} style={s.coSubChip}>
                            <Text style={s.coSubText}>{b}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </>
              ) : (
                <View style={s.noCo}>
                  <Ionicons name="business-outline" size={44} color="#B8C8C3" />
                  <Text style={s.noCoTitle}>Company Not Found</Text>
                  <Text style={s.noCoSub}>
                    We don't have transparency data for "{product.brand}" yet. New companies are added regularly.
                  </Text>
                </View>
              )}
            </View>
          )}


        </View>

        {/* Informational disclaimer — required for Apple Health & Fitness category */}
        <Text style={s.disclaimer}>
          Scores and ingredient information are for educational purposes only and are not medical advice.
          They should not be used to diagnose, treat, or prevent any health condition.
          Consult a qualified healthcare professional for dietary guidance.
        </Text>

      </ScrollView>

      <BackButton navigation={navigation} />
    </View>
  );
}

// ── Helper components ─────────────────────────────────────────────────────────

function ProGateCard({ icon, title, desc, onUpgrade }) {
  return (
    <View style={pgS.wrap}>
      <View style={pgS.iconWrap}>
        <Ionicons name={icon} size={32} color={Colors.primary} />
        <View style={pgS.lockBadge}>
          <Ionicons name="lock-closed" size={11} color="#fff" />
        </View>
      </View>
      <Text style={pgS.title}>{title}</Text>
      <Text style={pgS.desc}>{desc}</Text>
      <TouchableOpacity style={pgS.btn} onPress={onUpgrade} activeOpacity={0.85}>
        <Ionicons name="star" size={15} color="#fff" />
        <Text style={pgS.btnText}>Unlock with Pro</Text>
      </TouchableOpacity>
    </View>
  );
}
const pgS = StyleSheet.create({
  wrap:      {
    alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24,
    backgroundColor: '#fff', borderRadius: 18, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  iconWrap:  { position: 'relative', marginBottom: 16 },
  lockBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  title:     { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  desc:      { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 22 },
  btn:       {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: Colors.primary,
    paddingHorizontal: 22, paddingVertical: 12, borderRadius: 50,
    shadowColor: Colors.primary, shadowOpacity: 0.35, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  btnText:   { fontSize: 14, fontWeight: '700', color: '#fff' },
});

function Tag({ icon, label, color }) {
  return (
    <View style={[tS.wrap, { backgroundColor: color + '15', borderColor: color + '35' }]}>
      <Ionicons name={icon} size={11} color={color} />
      <Text style={[tS.text, { color }]}>{label}</Text>
    </View>
  );
}
const tS = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 8, borderWidth: 1,
    paddingHorizontal: 8, paddingVertical: 4,
    marginRight: 6, marginTop: 5,
  },
  text: { fontSize: 11, fontWeight: '700' },
});

function CoStat({ icon, label, value, highlight = false }) {
  return (
    <View style={csS.wrap}>
      <Ionicons name={icon} size={15} color={highlight ? '#D93B3B' : Colors.primary} />
      <Text style={[csS.val, highlight && { color: '#D93B3B' }]}>{value}</Text>
      <Text style={csS.label}>{label}</Text>
    </View>
  );
}
const csS = StyleSheet.create({
  wrap: {
    flex: 1, alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, padding: 12, marginHorizontal: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  val: { fontSize: 12, fontWeight: '700', color: '#1A2E28', marginTop: 5, textAlign: 'center' },
  label: { fontSize: 11, color: '#9BB5AE', marginTop: 2, textAlign: 'center' },
});

function formatMoney(n) {
  if (n == null) return null;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const HERO_H = 220;

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Hero
  heroWrap: { height: HERO_H, overflow: 'hidden', backgroundColor: '#D5EAE3' },
  heroImg: { width: '100%', height: '100%' },
  heroPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D5EAE3' },
  heroLogo: { width: '80%', height: HERO_H * 0.94 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingBottom: 16,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroCelebration: { position: 'absolute', bottom: 0, right: 0 },

  // Product info card
  infoCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 22, paddingTop: 20, paddingBottom: 18,
    borderBottomWidth: 1, borderBottomColor: '#F0F5F2',
  },
  productName: { fontSize: 20, fontWeight: '700', color: '#1A2E28', lineHeight: 27 },
  productMeta: { fontSize: 13, color: '#8AA49E', marginTop: 3 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16 },
  scoreRight: { gap: 8 },
  verdictBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  verdictText: { fontSize: 13, fontWeight: '700' },
  scoreSubLabel: { fontSize: 12, color: '#B0C4BE', fontWeight: '500' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },

  // Unverified community-data notice
  unverifiedBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FEF9E7', borderRadius: 12, padding: 12,
    marginHorizontal: 16, marginTop: 12,
  },
  unverifiedBannerText: { flex: 1, fontSize: 13, color: '#9A6B00', lineHeight: 18 },

  // HealthyChoices Says card
  sayCard: {
    marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    backgroundColor: '#F7FAF8', borderRadius: 14,
    padding: 16, borderLeftWidth: 3,
    flexDirection: 'row', alignItems: 'center',
  },
  sayMain: { flex: 1 },
  sayDetective: { width: 46, height: 108, marginLeft: 12, alignSelf: 'flex-end' },
  sayHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
  sayIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  sayTitle: { fontSize: 13, fontWeight: '700' },
  sayText: { fontSize: 14, color: '#2D4A42', lineHeight: 22 },

  // Tabs (sticky)
  tabBarSticky: { backgroundColor: '#fff' },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#EDF2F0',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 13 },
  tabActive: { borderBottomWidth: 2.5, borderBottomColor: Colors.primary },
  tabInner: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tabLabel: { fontSize: 13, color: '#9BB5AE', fontWeight: '500' },
  tabLabelActive: { color: Colors.primary, fontWeight: '700' },
  tabDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D93B3B', marginTop: -6 },

  // Body
  body: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 80, backgroundColor: '#fff' },
  disclaimer: { fontSize: 10, color: '#9BB5AE', textAlign: 'center', lineHeight: 15, marginTop: 24, paddingHorizontal: 8 },

  // Personalised warning banners
  warnBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#F5EEF8', borderRadius: 12, padding: 12, marginBottom: 10,
  },
  warnBannerText: { flex: 1, fontSize: 13, color: '#6C3483', lineHeight: 18 },
  warnBannerYellow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FEF9E7', borderRadius: 12, padding: 12, marginBottom: 10,
  },
  warnBannerYellowText: { flex: 1, fontSize: 13, color: '#9A6B00', lineHeight: 18 },
  warnBannerBlue: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, marginBottom: 10,
  },
  warnBannerBlueText: { flex: 1, fontSize: 13, color: '#1D4ED8', lineHeight: 18 },
  warnBannerOrange: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FFF4E8', borderRadius: 12, padding: 12, marginBottom: 10,
  },
  warnBannerOrangeText: { flex: 1, fontSize: 13, color: '#9A4B12', lineHeight: 18 },

  // All clear
  allClear: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#E8F7F2', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 18,
  },
  allClearText: { fontSize: 14, fontWeight: '600', color: '#1D9E75' },

  // Certifications
  certRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  certBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#E8F7F2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  certText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },

  // Nutrition
  nutHead: { marginBottom: 18 },
  nutTitle: { fontSize: 16, fontWeight: '700', color: '#1A2E28' },
  nutSub: { fontSize: 12, color: '#8AA49E', marginTop: 3 },
  nutAlert: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#FDE8E8', borderRadius: 10, padding: 12, marginTop: 8,
  },
  nutAlertText: { flex: 1, fontSize: 12, color: '#D93B3B', lineHeight: 17 },

  // Company teaser (free users)
  coTeaserWrap: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: '#EDF2F0',
  },
  coTeaserAlert: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: '#FDE8E8', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8, marginTop: 10,
  },
  coTeaserAlertText: { flex: 1, fontSize: 12, color: '#D93B3B', fontWeight: '600' },
  coTeaserClean: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: '#E8F7F2', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8, marginTop: 10,
  },
  coTeaserCleanText: { fontSize: 12, color: '#1D9E75', fontWeight: '600' },

  // Company
  coHead: { marginBottom: 16 },
  coName: { fontSize: 18, fontWeight: '700', color: '#1A2E28' },
  coHQ: { fontSize: 13, color: '#8AA49E', marginTop: 2 },
  coStats: { flexDirection: 'row', marginBottom: 14 },
  coAlert: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FDE8E8', borderRadius: 10, padding: 12, marginBottom: 14,
  },
  coAlertText: { flex: 1, fontSize: 13, color: '#D93B3B' },
  coBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#E8F7F2', borderRadius: 12, padding: 14, marginBottom: 16,
  },
  coBtnL: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  coBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  coSubLabel: { fontSize: 12, color: '#8AA49E', marginBottom: 8 },
  coSubRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  coSubChip: { backgroundColor: '#EDF2F0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  coSubText: { fontSize: 12, color: '#5C7A72' },
  noCo: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  noCoTitle: { fontSize: 18, fontWeight: '700', color: '#1A2E28' },
  noCoSub: { fontSize: 14, color: '#8AA49E', textAlign: 'center', lineHeight: 21 },

  // Request card (insufficient data)
  requestCard: {
    marginHorizontal: 16, marginTop: 10, marginBottom: 4,
    backgroundColor: '#F7FAF8', borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: '#EDF2F0',
    alignItems: 'flex-start',
  },
  requestPrompt: { fontSize: 14, fontWeight: '600', color: '#1A2E28', marginBottom: 12 },
  requestBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20, paddingVertical: 11, borderRadius: 50,
    shadowColor: Colors.primary, shadowOpacity: 0.30, shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
    minWidth: 200,
  },
  requestBtnDisabled: { opacity: 0.65 },
  requestBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  requestConfirm: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  requestConfirmText: { fontSize: 14, fontWeight: '600', color: Colors.primary },

  // No ingredient data note
  noIngredientNote: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F4F8F6', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 18,
  },
  noIngredientNoteText: { fontSize: 14, color: '#9BB5AE', fontWeight: '500' },
});
