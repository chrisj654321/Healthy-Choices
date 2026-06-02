import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import ScanHistoryItem from '../components/ScanHistoryItem';
import { getScanHistory, removeScanEntry, clearScanHistory } from '../utils/storage';
import { PRODUCT_DB } from '../data/products';
import { useProStatus } from '../utils/subscription';

const FREE_HISTORY_LIMIT = 5;

export default function ScanHistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { isPro, refresh: refreshPro } = useProStatus();

  useFocusEffect(
    useCallback(() => {
      loadHistory();
      refreshPro();
    }, [refreshPro])
  );

  const loadHistory = async () => {
    setLoading(true);
    const data = await getScanHistory();
    setHistory(data);
    setLoading(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Remove Entry', 'Remove this scan from your history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await removeScanEntry(id);
          setHistory((prev) => prev.filter((e) => e.id !== id));
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('Clear History', 'This will remove all scanned products. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await clearScanHistory();
          setHistory([]);
        },
      },
    ]);
  };

  const handlePress = (item) => {
    const product = item.product || PRODUCT_DB[item.barcode];
    if (!product) {
      Alert.alert('Unavailable', 'Full details for this scan are no longer available. Scan the product again to reload it.');
      return;
    }
    navigation.navigate('ProductScore', { product });
  };

  const FILTERS = ['all', 'A', 'B', 'C', 'D', 'F'];

  const filtered = history
    .filter((h) => filter === 'all' || h.grade === filter)
    .filter((h) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        h.name?.toLowerCase().includes(q) ||
        h.brand?.toLowerCase().includes(q)
      );
    });

  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
      : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearBtn}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats summary */}
      {history.length > 0 && (
        <View style={styles.statsRow}>
          <StatCard label="Total Scans" value={history.length} icon="scan-outline" />
          <StatCard label="Avg Score" value={avgScore ?? '—'} icon="stats-chart-outline" />
          <StatCard
            label="A/B Grades"
            value={history.filter((h) => h.grade === 'A' || h.grade === 'B').length}
            icon="ribbon-outline"
          />
        </View>
      )}

      {/* Search */}
      {history.length > 0 && (
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color="#9BB5AE" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products…"
            placeholderTextColor="#9BB5AE"
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color="#9BB5AE" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Grade filter */}
      {history.length > 0 && (
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All' : f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="scan-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>
            {history.length === 0 ? 'No scans yet' : `No ${filter}-grade scans`}
          </Text>
          <Text style={styles.emptySubtitle}>
            {history.length === 0
              ? 'Scan a product barcode to see its health score here.'
              : 'Try a different grade filter.'}
          </Text>
          {history.length === 0 && (
            <TouchableOpacity
              style={styles.scanNowBtn}
              onPress={() => navigation.navigate('Scanner')}
            >
              <Text style={styles.scanNowText}>Scan a Product</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={isPro ? filtered : filtered.slice(0, FREE_HISTORY_LIMIT)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ScanHistoryItem
              item={item}
              onPress={() => handlePress(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          ListFooterComponent={
            !isPro && filtered.length > FREE_HISTORY_LIMIT ? (
              <HistoryGateBanner
                lockedCount={filtered.length - FREE_HISTORY_LIMIT}
                onUpgrade={() => navigation.navigate('Paywall', { feature: 'history' })}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}

function HistoryGateBanner({ lockedCount, onUpgrade }) {
  return (
    <TouchableOpacity style={hgS.wrap} onPress={onUpgrade} activeOpacity={0.85}>
      <View style={hgS.iconWrap}>
        <Ionicons name="lock-closed" size={22} color={Colors.primary} />
      </View>
      <View style={hgS.text}>
        <Text style={hgS.title}>{lockedCount} more scan{lockedCount !== 1 ? 's' : ''} locked</Text>
        <Text style={hgS.sub}>Upgrade to Pro to see your full history.</Text>
      </View>
      <View style={hgS.btn}>
        <Text style={hgS.btnText}>Unlock</Text>
      </View>
    </TouchableOpacity>
  );
}
const hgS = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.primaryLight, borderRadius: 16,
    padding: 16, marginTop: 6, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.15, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  text:    { flex: 1 },
  title:   { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  sub:     { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  btn:     {
    backgroundColor: Colors.primary, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 11,
  },
  btnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});

function StatCard({ label, value, icon }) {
  return (
    <View style={scStyles.card}>
      <Ionicons name={icon} size={16} color={Colors.primary} />
      <Text style={scStyles.value}>{value}</Text>
      <Text style={scStyles.label}>{label}</Text>
    </View>
  );
}
const scStyles = StyleSheet.create({
  card: {
    flex: 1, alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, padding: 14, marginHorizontal: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  value: { fontSize: 22, fontWeight: '800', color: '#1A2E28', marginTop: 5 },
  label: { fontSize: 11, color: '#9BB5AE', marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAF9' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 22, paddingTop: 14, paddingBottom: 10,
    backgroundColor: '#F7FAF9',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#1A2E28' },
  clearBtn: { fontSize: 13, color: '#D93B3B', fontWeight: '600' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 14 },
  filterRow: {
    flexDirection: 'row', paddingHorizontal: 16, gap: 8,
    marginBottom: 12, flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 14, paddingVertical: 11, borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  filterPillActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 13, color: '#8AA49E', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16,
    marginBottom: 10, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: '#EDF2F0',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A2E28' },
  list: { paddingHorizontal: 16, paddingBottom: 48 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A2E28' },
  emptySubtitle: { fontSize: 14, color: '#9BB5AE', textAlign: 'center', lineHeight: 21 },
  scanNowBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 28,
    paddingVertical: 13, borderRadius: 50, marginTop: 8,
  },
  scanNowText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
