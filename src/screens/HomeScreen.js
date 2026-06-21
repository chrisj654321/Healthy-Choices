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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { getUserPrefs, getScanHistory, getProfileSetup } from '../utils/storage';
import { HEALTHY_CATEGORIES, countForCategory } from '../data/healthyCategories';
import { PRODUCT_DB } from '../data/products';
import { scoreToColor } from '../utils/scorer';

const MISSING_LABEL = {
  allergens: 'allergens',
  dietary: 'dietary preferences',
  goal: 'your top goal',
};

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [setup, setSetup] = useState({ complete: true, missing: [] });
  const [recent, setRecent] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [prefs, history] = await Promise.all([getUserPrefs(), getScanHistory()]);
        if (!active) return;
        setSetup(getProfileSetup(prefs));
        setRecent(history.slice(0, 8));
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

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={s.headerIcon}
          onPress={() => navigation.navigate('History')}
          accessibilityLabel="Scan history"
        >
          <Ionicons name="time-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Shelf Exposé</Text>
        <View style={s.headerIcon} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
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

        {/* Eat better by category */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Eat better by category</Text>
          <Text style={s.sectionSub}>Our highest-scoring picks, grouped by aisle.</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.hScroll}
          >
            {catCounts.map(({ cat, count }) => {
              if (count === 0) return null;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={s.catTile}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('HealthyCategory', { category: cat })}
                >
                  <View style={s.catIcon}>
                    <Ionicons name={cat.icon} size={26} color={Colors.primary} />
                  </View>
                  <Text style={s.catLabel} numberOfLines={2}>{cat.label}</Text>
                  <Text style={s.catCount}>{count} pick{count !== 1 ? 's' : ''}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 10, backgroundColor: Colors.background,
  },
  headerIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  headerTitle: { fontSize: Font.sizes.lg, fontWeight: Font.weights.heavy, color: Colors.textPrimary },

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
    width: 130, backgroundColor: Colors.white, borderRadius: 14, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  recentScore: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  recentScoreNum: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold },
  recentName: { fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.textPrimary, lineHeight: 17 },
  recentBrand: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },

  catTile: {
    width: 104, backgroundColor: Colors.white, borderRadius: 14, padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  catIcon: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  catLabel: { fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.textPrimary, textAlign: 'center', lineHeight: 16 },
  catCount: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 3 },
});
