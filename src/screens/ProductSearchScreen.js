import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { scoreProduct, scoreToColor } from '../utils/scorer';
import { searchProductsLocal, getFeaturedProducts } from '../data/productStore';

// ─── Endpoints ────────────────────────────────────────────────────────────────

const SAL_BASE =
  'https://search.openfoodfacts.org/search' +
  '?page_size=24&lang=en' +
  '&fields=code,product_name,product_name_en,brands,categories_tags,labels_tags,' +
  'nutriments,ingredients_text,ingredients,serving_size,image_front_url,image_url,packaging,packaging_text,packaging_tags,preparation,preparation_text,cooking_instructions,instructions' +
  '&q=';

const OFF_BASE =
  'https://world.openfoodfacts.org/cgi/search.pl' +
  '?action=process&json=1&page_size=24' +
  '&fields=code,product_name,product_name_en,brands,categories_tags,labels_tags,' +
  'nutriments,ingredients_text,ingredients,serving_size,image_front_url,image_url,packaging,packaging_text,packaging_tags,preparation,preparation_text,cooking_instructions,instructions' +
  '&search_simple=1&lc=en&tagtype_0=countries&tag_contains_0=contains&tag_0=united-states' +
  '&search_terms=';

const UA = { 'User-Agent': 'HealthyChoices/1.0 (support@healthychoices.app)' };

// Neither fetch() call below had a timeout — on a slow/flaky connection the
// request could hang indefinitely (RN's fetch has no default timeout, unlike
// browsers), leaving the user staring at just the curated-local hit with no
// indication live search ever ran. Bound every remote attempt so a hang always
// resolves to a visible outcome instead of silence.
const REMOTE_TIMEOUT_MS = 8000;

function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

// ─── Cycling loader phrases ───────────────────────────────────────────────────

const LOADER_PHRASES = [
  'Exposé incoming…',
  'Researching more…',
  'Deep dive finishing…',
  'Digging deeper…',
  'Following the trail…',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true if the string is mostly ASCII/Latin (≤30% non-ASCII letters). */
function isMostlyLatin(str) {
  if (!str) return false;
  const letters = str.replace(/[^a-zA-ZÀ-ɏ]/g, '');
  if (letters.length === 0) return true; // no letters at all — let it through
  const nonAscii = letters.replace(/[a-zA-ZÀ-ɏ]/g, (c) =>
    c.charCodeAt(0) > 127 ? c : ''
  ).length;
  // count chars > 0x024F as non-Latin
  let nonLatin = 0;
  for (const ch of letters) {
    if (ch.charCodeAt(0) > 0x024f) nonLatin++;
  }
  return nonLatin / letters.length <= 0.3;
}

/** Normalized dedupe key: lowercased brand + '|' + first 24 chars of lowercased name. */
function dedupeKey(product) {
  const brand = (product.brand || '').toLowerCase().trim();
  const name  = (product.name  || '').toLowerCase().trim().slice(0, 24);
  return `${brand}|${name}`;
}

/** True when the product has essentially no useful data. */
function isThinData(product) {
  const hasIngredients = product.ingredients && product.ingredients.length > 0;
  const hasNutriments  = product.calories > 0 || product.protein > 0 || product.fat > 0;
  return !hasIngredients && !hasNutriments;
}

// ─── Featured products shown on empty search state ───────────────────────────

const FEATURED_BARCODES = [
  '894700010045', // Chobani Strawberry Greek Yogurt
  '857777004195', // RXBar Blueberry Protein Bar
  '602652177514', // KIND Dark Chocolate Nuts & Sea Salt
  '013764014060', // Dave's Killer Bread 21 Whole Grains
  '857843003002', // Purely Elizabeth Original Superfood Granola
  '850397004217', // That's It Apple + Strawberry Fruit Bar
];

// ─── Fetch from Search-a-licious (primary) with OFF legacy fallback ───────────

async function fetchFromOFF(query) {
  const encoded = encodeURIComponent(query);
  let products = [];

  // Primary: Search-a-licious
  try {
    const resp = await fetchWithTimeout(SAL_BASE + encoded, { headers: UA }, REMOTE_TIMEOUT_MS);
    if (resp.ok) {
      const data = await resp.json();
      const hits = data.hits || [];
      if (hits.length > 0) {
        products = hits
          .filter((p) => p.product_name || p.product_name_en)
          .map((p) => buildProductFromRaw(p.code || null, p));
      }
    }
  } catch (_) {
    // fall through to legacy
  }

  // Fallback: legacy endpoint with US/EN filter
  if (products.length === 0) {
    const resp = await fetchWithTimeout(OFF_BASE + encoded, { headers: UA }, REMOTE_TIMEOUT_MS);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    products = (data.products || [])
      .filter((p) => p.product_name || p.product_name_en)
      .map((p) => buildProductFromRaw(p.code || null, p));
  }

  return products;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProductSearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isPro } = useProStatus();

  const [query,       setQuery]       = useState('');
  const [curatedHits, setCuratedHits] = useState([]);   // local/verified products
  const [liveHits,    setLiveHits]    = useState([]);   // web results
  const [liveLoading, setLiveLoading] = useState(false);
  const [error,       setError]       = useState(null);
  // True when the remote search failed but curated local hits still rendered —
  // previously this was entirely invisible (error only surfaces when there are
  // zero results at all), so a live-search outage silently looked like "the
  // catalog only has one match" instead of "live search is unavailable."
  const [liveUnavailable, setLiveUnavailable] = useState(false);
  const [searched,    setSearched]    = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Cycling phrase index for inline loader
  const [phraseIdx, setPhraseIdx] = useState(0);

  const debounceTimer = useRef(null);
  const inputRef      = useRef(null);
  // Track the current search so stale responses don't overwrite newer ones
  const searchGen = useRef(0);

  // Featured products shown on the empty search state — loaded once, async
  // (module-load-time PRODUCT_DB lookup can't be done anymore since the
  // store is opened async).
  useEffect(() => {
    let active = true;
    getFeaturedProducts(FEATURED_BARCODES).then((results) => {
      if (active) setFeaturedProducts(results);
    });
    return () => { active = false; };
  }, []);

  // Cycle loader text while liveLoading is true
  useEffect(() => {
    if (!liveLoading) return;
    const id = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % LOADER_PHRASES.length);
    }, 1200);
    return () => clearInterval(id);
  }, [liveLoading]);

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
      setCuratedHits([]);
      setLiveHits([]);
      setSearched(false);
      setError(null);
      setLiveLoading(false);
      return;
    }

    // Bump generation so any in-flight fetch can be discarded
    const gen = ++searchGen.current;

    setError(null);
    setLiveUnavailable(false);
    setSearched(true);
    setLiveLoading(true);
    setPhraseIdx(0);

    // ── 1. Show curated results as soon as the local SQLite query resolves ──
    const localHits = await searchProductsLocal(q, 6);
    if (gen !== searchGen.current) return;
    setCuratedHits(localHits);
    setLiveHits([]);

    // Build a set of known barcodes + dedupe keys from curated hits
    const curatedBarcodes = new Set(localHits.map((p) => p.barcode).filter(Boolean));
    const curatedKeys     = new Set(localHits.map(dedupeKey));

    // ── 2. Kick off live fetch in the background ────────────────────────────
    try {
      const remoteRaw = await fetchFromOFF(q);
      if (gen !== searchGen.current) return; // stale — discard

      // Filter + dedupe
      const seenKeys = new Set(curatedKeys);
      const filtered = [];

      for (const p of remoteRaw) {
        // Drop if duplicates a curated item by barcode
        if (p.barcode && curatedBarcodes.has(p.barcode)) continue;

        // Drop if foreign name
        const name = p.name || '';
        if (!isMostlyLatin(name)) continue;

        // Drop thin data
        if (isThinData(p)) continue;

        // Dedupe by brand|name key
        const key = dedupeKey(p);
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);

        filtered.push(p);
      }

      setLiveHits(filtered);
    } catch (e) {
      console.warn('[Search] fetch error:', e);
      if (gen !== searchGen.current) return;
      if (localHits.length === 0) {
        setError('Could not reach the product database. Check your connection.');
      } else {
        // Local results exist, so the full error view won't show — surface a
        // small inline notice instead so a live-search failure doesn't read
        // as "the catalog only has this one match."
        setLiveUnavailable(true);
      }
    } finally {
      if (gen === searchGen.current) setLiveLoading(false);
    }
  }, []);

  const handleChangeText = (text) => {
    setQuery(text);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => runSearch(text), 400);
  };

  const handleClear = () => {
    setQuery('');
    setCuratedHits([]);
    setLiveHits([]);
    setSearched(false);
    setError(null);
    setLiveLoading(false);
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
          <Text style={styles.gateNote}>Cancel anytime</Text>
        </View>
      </View>
    );
  }

  // ── Main search UI ───────────────────────────────────────────────────────────

  const hasResults     = curatedHits.length > 0 || liveHits.length > 0;
  const showLiveTier   = liveHits.length > 0 || liveLoading;
  const noResults      = searched && !hasResults && !liveLoading;

  // Build a flat typed array for FlatList so we can insert divider + loader rows
  const listData = [];

  // Curated section
  for (const p of curatedHits) {
    listData.push({ type: 'item', product: p, id: p.barcode || `curated-${p.name}` });
  }

  // Divider + live section
  if (showLiveTier) {
    listData.push({ type: 'divider', id: '__divider__' });
    for (const p of liveHits) {
      listData.push({ type: 'item', product: p, id: p.barcode || `live-${p.name}` });
    }
    if (liveLoading) {
      listData.push({ type: 'loader', id: '__loader__' });
    }
  } else if (liveUnavailable && curatedHits.length > 0) {
    listData.push({ type: 'live-unavailable', id: '__live_unavailable__' });
  }

  const renderRow = ({ item }) => {
    if (item.type === 'divider') {
      return (
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>More results from the web</Text>
          <View style={styles.dividerLine} />
        </View>
      );
    }
    if (item.type === 'live-unavailable') {
      return (
        <View style={styles.liveUnavailableRow}>
          <Ionicons name="cloud-offline-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.liveUnavailableText}>
            Showing local matches only — live web search is unavailable right now.
          </Text>
        </View>
      );
    }
    if (item.type === 'loader') {
      return (
        <View style={styles.inlineLoader}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.inlineLoaderText}>{LOADER_PHRASES[phraseIdx]}</Text>
        </View>
      );
    }
    // type === 'item'
    return (
      <ResultCard
        product={item.product}
        onPress={() => handleSelect(item.product)}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerBack}
            onPress={() => navigation.getParent()?.navigate('Scan')}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Products</Text>
        </View>
        <Text style={styles.headerSub}>Search millions of products by name or brand</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBarWrap}>
        <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="e.g. Cheerios, Lay's, Greek yogurt…"
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

      {/* Error state */}
      {!hasResults && !liveLoading && error && (
        <View style={styles.centerState}>
          <Ionicons name="wifi-outline" size={44} color={Colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => runSearch(query)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty state */}
      {noResults && !error && (
        <View style={styles.centerState}>
          <Ionicons name="cube-outline" size={44} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No results for "{query}"</Text>
          <Text style={styles.emptySub}>Try a different name or brand.</Text>
        </View>
      )}

      {/* Featured products — shown before any search */}
      {!searched && (
        <FlatList
          data={featuredProducts}
          keyExtractor={(item) => item.barcode || item.name}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.featuredLabel}>Featured Products</Text>
          }
          renderItem={({ item }) => (
            <ResultCard product={item} onPress={() => handleSelect(item)} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* Results list — shown as soon as there's anything to show OR while live is loading */}
      {(hasResults || (searched && liveLoading)) && (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="on-drag"
          renderItem={renderRow}
          ItemSeparatorComponent={({ leadingItem }) => {
            // Don't put a separator before/after divider or loader rows
            if (leadingItem && (leadingItem.type === 'divider' || leadingItem.type === 'loader')) {
              return null;
            }
            return <View style={styles.separator} />;
          }}
        />
      )}
    </View>
  );
}

// ─── Result card ─────────────────────────────────────────────────────────────

function ResultCard({ product, onPress }) {
  const result = scoreProduct(product);

  const isInsufficient = result.insufficientData ?? false;
  const color        = isInsufficient ? '#9BB5AE' : scoreToColor(result.score);

  const categoryLabel = product.category
    ? product.category.replace(/\ben:/g, '').replace(/-/g, ' ')
    : null;

  // Branded tile fallback: show first letter of brand when no image
  const hasBrand = product.brand && product.brand !== 'Unknown Brand';

  return (
    <TouchableOpacity style={styles.resultCard} onPress={onPress} activeOpacity={0.75}>
      {/* Thumbnail */}
      <View style={styles.thumbWrap}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.thumb} resizeMode="contain" />
        ) : hasBrand ? (
          <View style={styles.thumbBrandTile}>
            <Text style={styles.thumbBrandLetter}>
              {product.brand.charAt(0).toUpperCase()}
            </Text>
          </View>
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

      {/* Score badge */}
      <View style={[styles.gradeBadge, { borderColor: color }]}>
        <Text style={[styles.gradeText, { color }]}>{isInsufficient ? '?' : result.score}</Text>
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
  headerRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerBack:  { padding: 2, marginLeft: -4 },
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
  errorText:   { fontSize: Font.sizes.base, color: Colors.textSecondary, textAlign: 'center' },
  retryBtn:    { marginTop: 8, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: Colors.primary, borderRadius: 10 },
  retryText:   { color: Colors.white, fontWeight: Font.weights.semibold },
  emptyTitle:  { fontSize: Font.sizes.base, fontWeight: Font.weights.semibold, color: Colors.textPrimary, textAlign: 'center' },
  emptySub:    { fontSize: Font.sizes.sm, color: Colors.textSecondary, textAlign: 'center' },
  hintTitle:   { fontSize: Font.sizes.lg, fontWeight: Font.weights.bold, color: Colors.textPrimary, textAlign: 'center' },
  hintSub:     { fontSize: Font.sizes.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  featuredLabel: { fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },

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
  thumbWrap:      { width: 52, height: 52, borderRadius: 10, overflow: 'hidden', marginRight: 12, backgroundColor: Colors.primaryLight },
  thumb:          { width: '100%', height: '100%' },
  thumbFallback:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // Branded tile: green-light bg, brand initial in primary green
  thumbBrandTile: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },
  thumbBrandLetter: {
    fontSize: 22, fontWeight: 'bold', color: Colors.primary,
  },
  resultInfo:   { flex: 1 },
  resultName:   { fontSize: Font.sizes.base, fontWeight: Font.weights.semibold, color: Colors.textPrimary, lineHeight: 20 },
  resultBrand:  { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 2 },
  resultCal:    { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  gradeBadge:   {
    minWidth: 40, height: 40, borderRadius: 20, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 5,
  },
  gradeText:    { fontSize: Font.sizes.md, fontWeight: Font.weights.heavy },

  // Divider between curated and live tiers
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 4, marginVertical: 8,
  },
  dividerLine:  { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerLabel: {
    fontSize: Font.sizes.xs, color: Colors.textMuted,
    fontWeight: Font.weights.semibold,
    marginHorizontal: 10, textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Notice row: remote search failed but curated hits still rendered
  liveUnavailableRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 4, marginTop: 10, marginBottom: 4, gap: 6,
  },
  liveUnavailableText: {
    fontSize: Font.sizes.xs, color: Colors.textMuted, flex: 1,
  },

  // Inline loader row at bottom of live tier
  inlineLoader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, gap: 10,
  },
  inlineLoaderText: {
    fontSize: Font.sizes.sm, color: Colors.textSecondary,
    fontStyle: 'italic',
  },

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
