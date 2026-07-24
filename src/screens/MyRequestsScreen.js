import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { getRequests } from '../utils/productRequests';
import SpecsMascot from '../components/SpecsMascot';
import BackButton from '../components/BackButton';

export default function MyRequestsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  const loadRequests = async () => {
    setLoading(true);
    const data = await getRequests();
    setRequests(data);
    setLoading(false);
  };

  const handlePress = (item) => {
    if (item.resolved && item.product) {
      navigation.navigate('ProductScore', { product: item.product });
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <BackButton navigation={navigation} />
      <View style={styles.header}>
        <Text style={styles.title}>My Requests</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.empty}>
          <SpecsMascot clip="inspecting" size={80} />
          <Text style={styles.emptyTitle}>No requests yet</Text>
          <Text style={styles.emptySubtitle}>
            Scan a product we don't have and tap "Request this product" — it'll show up here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item, idx) => `${item.barcode}-${item.requestedAt}-${idx}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={item.resolved ? 0.7 : 1}
              onPress={() => handlePress(item)}
              disabled={!item.resolved}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.barcode}>{item.barcode}</Text>
                <Text style={styles.date}>Requested {formatDate(item.requestedAt)}</Text>
              </View>
              {item.resolved ? (
                <View style={styles.statusResolved}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
                  <Text style={styles.statusResolvedText}>Added</Text>
                </View>
              ) : (
                <View style={styles.statusPending}>
                  <Text style={styles.statusPendingText}>Requested — we're on it</Text>
                </View>
              )}
              {item.resolved && (
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10,
  },
  title: { fontSize: Font.sizes.md, fontWeight: Font.weights.bold, color: Colors.textPrimary },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 8 },
  emptyTitle: { fontSize: Font.sizes.md, fontWeight: Font.weights.bold, color: Colors.textPrimary, marginTop: 8 },
  emptySubtitle: { fontSize: Font.sizes.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  rowLeft: { flex: 1 },
  barcode: { fontSize: Font.sizes.base, fontWeight: Font.weights.semibold, color: Colors.textPrimary },
  date: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },

  statusResolved: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.successLight, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  statusResolvedText: { fontSize: Font.sizes.xs, color: Colors.primary, fontWeight: Font.weights.medium },

  statusPending: {
    backgroundColor: Colors.background, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  statusPendingText: { fontSize: Font.sizes.xs, color: Colors.textSecondary, fontWeight: Font.weights.medium },
});
