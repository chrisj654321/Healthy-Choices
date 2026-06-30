import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { COMPANY_DB } from '../data/companies';
import { formatCurrency, getLobbyingRiskLevel } from '../utils/scorer';
import { useProStatus } from '../utils/subscription';

export default function CompanyListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isPro, loading } = useProStatus();
  const [query, setQuery] = useState('');

  const companies = useMemo(
    () =>
      Object.values(COMPANY_DB)
        .filter((c) => c && c.name)
        .sort((a, b) => (b.lobbyingSpend ?? 0) - (a.lobbyingSpend ?? 0)),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.subsidiaries?.some((b) => b.toLowerCase().includes(q))
    );
  }, [companies, query]);

  // ── Locked state for free users ──
  if (!loading && !isPro) {
    return (
      <View style={s.container}>
        <View style={[s.header, { paddingTop: insets.top + 8 }]}>
          <Text style={s.headerTitle}>Companies</Text>
        </View>
        <View style={s.locked}>
          <View style={s.lockIcon}>
            <Ionicons name="business" size={36} color={Colors.primary} />
          </View>
          <Text style={s.lockTitle}>Company Transparency</Text>
          <Text style={s.lockSub}>
            See lobbying spend, political donations, and documented controversies behind
            every brand you buy. Unlock with Shelf Exposé Pro.
          </Text>
          <TouchableOpacity
            style={s.unlockBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Paywall', { feature: 'company' })}
          >
            <Ionicons name="star" size={15} color="#fff" />
            <Text style={s.unlockBtnText}>Unlock Pro</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <Text style={s.headerTitle}>Companies</Text>
      </View>

      <View style={s.searchWrap}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={s.searchInput}
          placeholder="Search companies or brands…"
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 40 }}>
        {filtered.map((company) => {
          const risk = company.lobbyingSpend != null ? getLobbyingRiskLevel(company.lobbyingSpend) : null;
          const flags = company.issues?.length ?? 0;
          return (
            <TouchableOpacity
              key={company.id}
              style={s.row}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CompanyProfile', { company })}
            >
              <View style={[s.logo, company.logo && s.logoWhite]}>
                {company.logo ? (
                  <Image source={{ uri: company.logo }} style={s.logoImg} resizeMode="contain" />
                ) : (
                  <Text style={s.logoText}>{company.name.charAt(0)}</Text>
                )}
              </View>
              <View style={s.info}>
                <Text style={s.name} numberOfLines={1}>{company.name}</Text>
                <View style={s.metaRow}>
                  {company.lobbyingSpend != null && (
                    <Text style={[s.meta, risk && { color: risk.color }]}>
                      {formatCurrency(company.lobbyingSpend)}/yr lobbying
                    </Text>
                  )}
                  {flags > 0 && (
                    <Text style={s.flagMeta}>· {flags} flag{flags !== 1 ? 's' : ''}</Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          );
        })}
        {filtered.length === 0 && (
          <Text style={s.empty}>No companies match “{query}”.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  headerTitle: { fontSize: Font.sizes.xl, fontWeight: Font.weights.heavy, color: Colors.textPrimary },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 12,
    backgroundColor: Colors.white, borderRadius: 12, height: 44,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: Font.sizes.base, color: Colors.textPrimary, paddingVertical: 0 },

  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: 12, padding: 12, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  logo: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12, overflow: 'hidden',
  },
  logoWhite: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  logoImg: { width: 30, height: 30 },
  logoText: { fontSize: Font.sizes.lg, fontWeight: Font.weights.heavy, color: Colors.primary },
  info: { flex: 1 },
  name: { fontSize: Font.sizes.base, fontWeight: Font.weights.semibold, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  meta: { fontSize: Font.sizes.xs, color: Colors.textSecondary },
  flagMeta: { fontSize: Font.sizes.xs, color: Colors.textMuted },
  empty: { fontSize: Font.sizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: 40 },

  locked: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, paddingBottom: 60 },
  lockIcon: {
    width: 80, height: 80, borderRadius: 24, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  lockTitle: { fontSize: Font.sizes.xl, fontWeight: Font.weights.heavy, color: Colors.textPrimary, marginBottom: 10 },
  lockSub: { fontSize: Font.sizes.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  unlockBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14,
  },
  unlockBtnText: { fontSize: Font.sizes.base, fontWeight: Font.weights.bold, color: '#fff' },
});
