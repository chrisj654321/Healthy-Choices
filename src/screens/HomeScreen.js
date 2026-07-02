import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { getUserPrefs, getScanHistory, getProfileSetup } from '../utils/storage';
import { HEALTHY_CATEGORIES, countForCategory, heroImageForCategory } from '../data/healthyCategories';
import { PRODUCT_DB } from '../data/products';
import { scoreToColor, scoreProduct } from '../utils/scorer';
import { getSpotlightCompany } from '../utils/spotlight';

const MISSING_LABEL = {
  allergens: 'allergens',
  dietary: 'dietary preferences',
  goal: 'your top goal',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [setup, setSetup] = useState({ complete: true, missing: [] });
  const [recent, setRecent] = useState([]);
  const [userName, setUserName] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [prefs, history] = await Promise.all([getUserPrefs(), getScanHistory()]);
        if (!active) return;
        setSetup(getProfileSetup(prefs));
        setRecent(history.slice(0, 8));
        setUserName(prefs?.name ?? null);
      })();
      return () => { active = false; };
    }, [])
  );

  const missingText = setup.missing.map((m) => MISSING_LABEL[m]).filter(Boolean);

  // Tile counts computed once (PRODUCT_DB is large — don't recompute per render).
  const catCounts = useMemo(
    () => HEALTHY_CATEGORIES.map((cat) => ({ cat, count: countForCategory(cat, PRODUCT_DB) })),
    []
  );

  // Hero images computed once — requires scoring, but only once.
  const catHeroImages = useMemo(
    () => {
      const map = {};
      for (const cat of HEALTHY_CATEGORIES) {
        map[cat.id] = heroImageForCategory(cat, PRODUCT_DB, scoreProduct);
      }
      return map;
    },
    []
  );

  // Weekly company spotlight — stable for the entire render cycle.
  const spotlight = useMemo(() => getSpotlightCompany(), []);

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <View style={s.headerLeft}>
          <Text style={s.headerGreeting}>{greeting()}{userName ? `, ${userName}` : ''}</Text>
          <Text style={s.headerTitle}>Shelf Exposé</Text>
        </View>
        <TouchableOpacity
          style={s.headerIcon}
          onPress={() => navigation.navigate('History')}
          accessibilityLabel="Scan history"
        >
          <Ionicons name="time-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Scan hero */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={s.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={s.heroContent}>
            <Text style={s.heroEyebrow}>Know what's in your food</Text>
            <Text style={s.heroHeadline}>Scan any product for an instant health grade</Text>
            <TouchableOpacity
              style={s.heroBtn}
              activeOpacity={0.85}
              onPress={() => navigation.getParent()?.navigate('Scan')}
            >
              <Ionicons name="scan-outline" size={18} color={Colors.primary} />
              <Text style={s.heroBtnText}>Scan a product</Text>
            </TouchableOpacity>
          </View>
          <View style={s.heroBadge}>
            <Text style={s.heroBadgeNum}>700+</Text>
            <Text style={s.heroBadgeLabel}>products{'\n'}graded</Text>
          </View>
        </LinearGradient>

        {/* Profile-completion nudge (detective) */}
        {!setup.complete && (
          <TouchableOpacity
            style={s.setupCard}
            activeOpacity={0.85}
            onPress={() => navigation.getParent()?.navigate('Profile')}
          >
            <View style={s.setupMain}>
              <Text style={s.setupTitle}>Finish setting up your profile</Text>
              <Text style={s.setupSub}>
                {missingText.length > 0
                  ? `You skipped ${joinList(missingText)} during sign-up. Add ${missingText.length > 1 ? 'them' : 'it'} so we can tailor every score to you.`
                  : 'Add a few details so we can tailor every score to you.'}
              </Text>
              <View style={s.setupBtn}>
                <Text style={s.setupBtnText}>Complete profile</Text>
                <Ionicons name="arrow-forward" size={15} color="#fff" />
              </View>
            </View>
            <Image
              source={require('../../assets/detective.png')}
              style={s.setupDetective}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {/* Recent scans */}
        {recent.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Pick up where you left off</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hScroll}
            >
              {recent.map((item) => {
                const color = item.score == null ? '#9BB5AE' : scoreToColor(item.score);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={s.recentCard}
                    activeOpacity={0.8}
                    onPress={() => item.product && navigation.navigate('ProductScore', { product: item.product })}
                  >
                    {/* Product photo thumbnail */}
                    {item.product?.image ? (
                      <Image source={{ uri: item.product.image }} style={s.recentThumb} />
                    ) : (
                      <View style={s.recentThumbPlaceholder}>
                        <Image source={require('../../assets/icon.png')} style={s.recentThumbLogo} resizeMode="contain" />
                      </View>
                    )}
                    <View style={[s.recentScore, { borderColor: color }]}>
                      <Text style={[s.recentScoreNum, { color }]}>{item.score ?? '?'}</Text>
                    </View>
                    <Text style={s.recentName} numberOfLines={2}>{item.name}</Text>
                    <Text style={s.recentBrand} numberOfLines={1}>{item.brand}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Company spotlight — this week's free unlock (sits directly below recent scans) */}
        {spotlight != null && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>This week's free unlock</Text>
            <TouchableOpacity
              style={s.spotlightCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('CompanyProfile', { company: spotlight.company, spotlight: true })}
            >
              <View style={s.spotlightBadge}>
                <Ionicons name="lock-open-outline" size={13} color={Colors.primary} />
                <Text style={s.spotlightBadgeText}>Free company unlock</Text>
              </View>
              <View style={s.spotlightHead}>
                <View style={[s.spotlightLogoWrap, spotlight.company.logo && s.spotlightLogoWhite]}>
                  {spotlight.company.logo ? (
                    <Image source={{ uri: spotlight.company.logo }} style={s.spotlightLogoImg} resizeMode="contain" />
                  ) : (
                    <Text style={s.spotlightLogoLetter}>{spotlight.company.name.charAt(0)}</Text>
                  )}
                </View>
                <Text style={s.spotlightCompany} numberOfLines={2}>{spotlight.company.name}</Text>
              </View>
              <Text style={s.spotlightIssue} numberOfLines={2}>{spotlight.issue.title}</Text>
              <View style={s.spotlightCta}>
                <Text style={s.spotlightCtaText}>See the money trail</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Eat better by category */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Eat better by category</Text>
          <Text style={s.sectionSub}>Our highest-scoring picks, grouped by aisle.</Text>
          <View style={s.catGrid}>
            {catCounts.map(({ cat, count }) => {
              if (count === 0) return null;
              const heroImage = catHeroImages[cat.id];
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[s.catTile, { borderColor: cat.color + '33' }]}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('HealthyCategory', { category: cat })}
                >
                  {/* Hero: real product photo OR colored icon circle */}
                  {heroImage ? (
                    <View style={s.catHeroWrap}>
                      <Image source={{ uri: heroImage }} style={s.catHeroImage} />
                    </View>
                  ) : (
                    <View style={[s.catIconCircle, { backgroundColor: cat.lightColor }]}>
                      <MaterialCommunityIcons name={cat.icon} size={30} color={cat.color} />
                    </View>
                  )}
                  {/* Label bar with accent color */}
                  <View style={[s.catLabelBar, { backgroundColor: cat.color }]}>
                    <Text style={s.catLabel} numberOfLines={2}>{cat.label}</Text>
                    <Text style={s.catCount}>{count} pick{count !== 1 ? 's' : ''}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

function joinList(arr) {
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: Colors.background,
  },
  headerLeft: { flex: 1 },
  headerGreeting: { fontSize: Font.sizes.sm, color: Colors.textSecondary },
  headerTitle: { fontSize: Font.sizes.xl, fontWeight: Font.weights.heavy, color: Colors.textPrimary, marginTop: 1 },
  headerIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },

  heroCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 4, marginBottom: 8,
    borderRadius: 20, padding: 20,
  },
  heroContent: { flex: 1 },
  heroEyebrow: { fontSize: Font.sizes.xs, color: 'rgba(255,255,255,0.75)', fontWeight: Font.weights.medium, marginBottom: 4 },
  heroHeadline: { fontSize: Font.sizes.md, fontWeight: Font.weights.bold, color: '#fff', lineHeight: 22, marginBottom: 14 },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start',
    backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10,
  },
  heroBtnText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold, color: Colors.primary },
  heroBadge: { alignItems: 'center', marginLeft: 16 },
  heroBadgeNum: { fontSize: 28, fontWeight: Font.weights.heavy, color: '#fff' },
  heroBadgeLabel: { fontSize: Font.sizes.xs, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 14, marginTop: 2 },

  setupCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 8, marginBottom: 4,
    backgroundColor: Colors.primaryLight, borderRadius: 18, padding: 16,
    overflow: 'hidden',
  },
  setupMain: { flex: 1 },
  setupTitle: { fontSize: Font.sizes.md, fontWeight: Font.weights.bold, color: Colors.textPrimary },
  setupSub: { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 4, lineHeight: 19 },
  setupBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9, marginTop: 12,
  },
  setupBtnText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold, color: '#fff' },
  setupDetective: { width: 60, height: 132, marginLeft: 8, alignSelf: 'flex-end' },

  section: { marginTop: 24 },
  sectionTitle: { fontSize: Font.sizes.md, fontWeight: Font.weights.bold, color: Colors.textPrimary, marginHorizontal: 16 },
  sectionSub: { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginHorizontal: 16, marginTop: 2 },
  hScroll: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },

  recentCard: {
    width: 140, backgroundColor: Colors.white, borderRadius: 14, padding: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  recentThumb: {
    width: '100%', height: 80, borderRadius: 10, marginBottom: 8, resizeMode: 'contain',
    backgroundColor: Colors.border,
  },
  recentThumbPlaceholder: {
    width: '100%', height: 80, borderRadius: 10, marginBottom: 8,
    backgroundColor: '#D5EAE3', alignItems: 'center', justifyContent: 'center',
  },
  recentThumbLogo: { width: 44, height: 44, opacity: 0.8 },
  recentScore: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  recentScoreNum: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold },
  recentName: { fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.textPrimary, lineHeight: 17 },
  recentBrand: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },

  catGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, rowGap: 12,
  },
  catTile: {
    width: '48%', backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  catHeroWrap: {
    width: '100%', height: 104, padding: 10, backgroundColor: '#FFFFFF',
  },
  catHeroImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  catIconCircle: {
    width: '100%', height: 104, alignItems: 'center', justifyContent: 'center',
  },
  catLabelBar: {
    paddingHorizontal: 10, paddingVertical: 8,
  },
  catLabel: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold, color: '#fff', lineHeight: 16 },
  catCount: { fontSize: Font.sizes.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  spotlightCard: {
    marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 18, padding: 18,
    borderLeftWidth: 4, borderLeftColor: Colors.primary,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  spotlightBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.primaryLight, alignSelf: 'flex-start',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10,
  },
  spotlightBadgeText: { fontSize: Font.sizes.xs, fontWeight: Font.weights.semibold, color: Colors.primary },
  spotlightHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  spotlightLogoWrap: {
    width: 52, height: 52, borderRadius: 13, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryLight,
  },
  spotlightLogoWhite: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
  },
  spotlightLogoImg: { width: 42, height: 42 },
  spotlightLogoLetter: { fontSize: 22, fontWeight: Font.weights.heavy, color: Colors.primary },
  spotlightCompany: { flex: 1, fontSize: Font.sizes.md, fontWeight: Font.weights.bold, color: Colors.textPrimary },
  spotlightIssue: { fontSize: Font.sizes.sm, color: Colors.textSecondary, lineHeight: 19, marginBottom: 14 },
  spotlightCta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  spotlightCtaText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.primary },
});
