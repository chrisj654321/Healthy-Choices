import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { useProStatus } from '../utils/subscription';
import { buildProductFromRaw } from '../utils/productParser';
import { scoreProduct, scoreToGrade, gradeToColor } from '../utils/scorer';
import { PRODUCT_DB } from '../data/products';

// ─── OpenFoodFacts search endpoint ────────────────────────────────────────────

const OFF_SEARCH =
  'https://world.openfoodfacts.org/cgi/search.pl' +
  '?action=process&json=1&page_size=24' +
  '&fields=code,product_name,product_name_en,brands,categories_tags,labels_tags,' +
  'nutriments,ingredients_text,ingredients,serving_size,image_front_url,image_url' +
  '&search_simple=1&search_terms=';

// ─── Search local PRODUCT_DB (manual + generated) by name/brand ───────────────

function searchLocal(query) {
  const q = query.toLowerCase().trim();
  return Object.values(PRODUCT_DB)
    .filter((p) => {
      const name  = (p.name  || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      return name.includes(q) || brand.includes(q);
    })
    .slice(0, 6);
}

// ─── Fetch from OpenFoodFacts ─────────────────────────────────────────────────

async function fetchFromOFF(query) {
  const url = OFF_SEARCH + encodeURIComponent(query);
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'HealthyChoices/1.0 (support@healthychoices.app)' },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  return (data.products || [])
    .filter((p) => p.product_name || p.product_name_en)
    .map((p) => buildProductFromRaw(p.code || null, p));
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProductSearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isPro } = useProStatus();

  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [searched, setSearched] = useState(false);

  const debounceTimer = useRef(null);
  const inputRef      = useRef(null);

  // Clear search when leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        clearTimeout(debounceTimer.current);
      };
    }, [])
  );

  const runSearch = useCallback(async (text) => {
    const q = text.trim();
    if (!q) {
      setResults([]);
      setSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      // Run local + remote in parallel
      const localHits = searchLocal(q);
      const remoteHits = await fetchFromOFF(q);

      // Merge: local results first, then dedupe remote by barcode
      const seen = new Set(localHits.map((p) => p.barcode).filter(Boolean));
      const deduped = remoteHits.filter((p) => {
        if (!p.barcode || seen.has(p.barcode)) return false;
        seen.add(p.barcode);
        return true;
      });

      setResults([...localHits, ...deduped]);
    } catch (e) {
      console.warn('[Search] fetch error:', e);
      // Fall back to local-only results on network error
      const localHits = searchLocal(q);
      setResults(localHits);
      if (localHits.length === 0) {
        setError('Could not reach the product database. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChangeText = (text) => {
    setQuery(text);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => runSearch(text), 400);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setError(null);
    inputRef.current?.focus();
  };

  const handleSelect = (product) => {
    Keyboard.dismiss();
    navigation.navigate('ProductScore', { product });
  };

  // ── Pro gate ─────────────────────────────────────────────────────────────────

  if (!isPro) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search Products</Text>
        </View>
        <View style={styles.gateWrap}>
          <View style={styles.gateIconWrap}>
            <Ionicons name="search" size={44} color={Colors.primary} />
          </View>
          <Text style={styles.gateTitle}>Search by Name</Text>
          <Text style={styles.gateSub}>
            Look up any product by name or brand across millions of items — no barcode needed.
          </Text>
          <View style={styles.featureList}>
            {GATE_FEATURES.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.upgradeBtn}
            onPress={() => navigation.navigate('Paywall', { feature: 'search' })}
          >
            <Ionicons name="star" size={16} color={Colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.upgradeBtnText}>Upgrade to Pro</Text>
          </TouchableOpacity>
          <Text style={styles.gateNote}>7-day free trial • Cancel anytime</Text>
        </View>
      </View>
    );
  }

  // ── Main search UI ───────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Products</Text>
        <Text style={styles.headerSub}>Search millions of products by name or brand</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBarWrap}>
        <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="e.g. Cheerios, Oreos, Greek yogurt…"
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={handleChangeText}
          returnKeyType="search"
          onSubmitEditing={() => runSearch(query)}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* States */}
      {loading && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Searching…</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerState}>
          <Ionicons name="wifi-outline" size={44} color={Colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => runSearch(query)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && searched && results.length === 0 && (
        <View style={styles.centerState}>
          <Ionicons name="cube-outline" size={44} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No results for "{query}"</Text>
          <Text style={styles.emptySub}>Try a different name or brand.</Text>
        </View>
      )}

      {!loading && !searched && (
        <View style={styles.centerState}>
          <Ionicons name="search-outline" size={44} color={Colors.primaryLight} />
          <Text style={styles.hintTitle}>Find any food product</Text>
          <Text style={styles.hintSub}>
            Type a product name, brand, or category above to get instant health scores.
          </Text>
        </View>
      )}

      {/* Results list */}
      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item, i) => item.barcode || String(i)}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => <ResultCard product={item} onPress={() => handleSelect(item)} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

// ─── Result card ─────────────────────────────────────────────────────────────

function ResultCard({ product, onPress }) {
  const result = scoreProduct(product);
  const grade  = result.grade;
  const color  = gradeToColor(grade);

  const categoryLabel = product.category
    ? product.category.replace(/\ben:/g, '').replace(/-/g, ' ')
    : null;

  return (
    <TouchableOpacity style={styles.resultCard} onPress={onPress} activeOpacity={0.75}>
      {/* Thumbnail */}
      <View style={styles.thumbWrap}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.thumb} resizeMode="contain" />
        ) : (
          <View style={styles.thumbFallback}>
            <Ionicons name="cube-outline" size={26} color={Colors.textMuted} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.resultBrand} numberOfLines={1}>
          {product.brand}{categoryLabel ? ` · ${categoryLabel}` : ''}
        </Text>
        {product.calories > 0 && (
          <Text style={styles.resultCal}>{product.calories} cal / serving</Text>
        )}
      </View>

      {/* Grade badge */}
      <View style={[styles.gradeBadge, { borderColor: color }]}>
        <Text style={[styles.gradeText, { color }]}>{grade}</Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GATE_FEATURES = [
  'Search millions of products by name or brand',
  'Instant health score without scanning',
  'Compare similar products side by side',
  'Research products before you shop',
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  header:      { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: Font.sizes.xl, fontWeight: Font.weights.heavy, color: Colors.textPrimary },
  headerSub:   { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 2 },

  // Search bar
  searchBarWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14, marginHorizontal: 16, marginBottom: 12,
    paddingHorizontal: 12, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  searchIcon:  { marginRight: 8 },
  searchInput: {
    flex: 1, fontSize: Font.sizes.base,
    color: Colors.textPrimary, padding: 0,
  },
  clearBtn: { padding: 4 },

  // States
  centerState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, gap: 12,
  },
  loadingText: { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 4 },
  errorText:   { fontSize: Font.sizes.base, color: Colors.textSecondary, textAlign: 'center' },
  retryBtn:    { marginTop: 8, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: Colors.primary, borderRadius: 10 },
  retryText:   { color: Colors.white, fontWeight: Font.weights.semibold },
  emptyTitle:  { fontSize: Font.sizes.base, fontWeight: Font.weights.semibold, color: Colors.textPrimary, textAlign: 'center' },
  emptySub:    { fontSize: Font.sizes.sm, color: Colors.textSecondary, textAlign: 'center' },
  hintTitle:   { fontSize: Font.sizes.lg, fontWeight: Font.weights.bold, color: Colors.textPrimary, textAlign: 'center' },
  hintSub:     { fontSize: Font.sizes.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  // Results
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  separator:   { height: 1, backgroundColor: Colors.border, marginLeft: 76 },
  resultCard:  {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 14,
    padding: 12, marginVertical: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  thumbWrap:    { width: 52, height: 52, borderRadius: 10, overflow: 'hidden', marginRight: 12, backgroundColor: Colors.primaryLight },
  thumb:        { width: '100%', height: '100%' },
  thumbFallback:{ flex: 1, alignItems: 'center', justifyContent: 'center' },
  resultInfo:   { flex: 1 },
  resultName:   { fontSize: Font.sizes.base, fontWeight: Font.weights.semibold, color: Colors.textPrimary, lineHeight: 20 },
  resultBrand:  { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 2 },
  resultCal:    { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  gradeBadge:   {
    width: 36, height: 36, borderRadius: 10, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  gradeText:    { fontSize: Font.sizes.md, fontWeight: Font.weights.heavy },

  // Pro gate
  gateWrap:      { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  gateIconWrap:  {
    width: 88, height: 88, borderRadius: 24,
    backgroundColor: Colors.primaryLight + '33',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  gateTitle:    { fontSize: Font.sizes.xxl, fontWeight: Font.weights.heavy, color: Colors.textPrimary, textAlign: 'center' },
  gateSub:      { fontSize: Font.sizes.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginTop: 8, marginBottom: 24 },
  featureList:  { alignSelf: 'stretch', gap: 10, marginBottom: 28 },
  featureRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText:  { fontSize: Font.sizes.base, color: Colors.textPrimary, flex: 1 },
  upgradeBtn:   {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 32,
  },
  upgradeBtnText: { fontSize: Font.sizes.base, fontWeight: Font.weights.bold, color: Colors.white },
  gateNote:       { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 12 },
});
