import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import LobbyingFlagCard from '../components/LobbyingFlagCard';
import { getLobbyingRiskLevel, formatCurrency, scoreProduct, scoreToColor } from '../utils/scorer';
import { getUserPrefs } from '../utils/storage';
import { useProStatus } from '../utils/subscription';
import { getSpotlightCompany } from '../utils/spotlight';
import { PRODUCT_DB } from '../data/products';

export default function CompanyProfileScreen({ route, navigation }) {
  const { company, initialTab, spotlight } = route?.params ?? {};
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(initialTab ?? 'overview');
  const [prefs, setPrefs] = useState({ showLobbying: true, showDonations: true });
  const { isPro } = useProStatus();

  useEffect(() => {
    getUserPrefs().then(setPrefs);
  }, []);

  // Hooks must run before any early return — guard the body for the null case.
  const companyProducts = useMemo(() =>
    company ? Object.values(PRODUCT_DB).filter((p) => p.companyId === company.id) : [],
    [company?.id]
  );
  // This week's free-unlock company is viewable in full even for free users.
  const spotlightCompany = useMemo(() => getSpotlightCompany(), []);

  if (!company) return null;

  // Company money-trail data is a Pro feature; the weekly spotlight company is exempt.
  const unlocked = isPro || spotlightCompany?.company?.id === company.id;
  const goPaywall = () => navigation.navigate('Paywall', { feature: 'company' });

  const lobbyRisk = getLobbyingRiskLevel(company.lobbyingSpend);
  const repPct = company.donationSplit?.republican ?? 50;
  const demPct = company.donationSplit?.democrat ?? 50;
  const highSeverityCount = company.issues?.filter((i) => i.severity === 'high').length ?? 0;

  const sustainColor =
    company.sustainabilityScore >= 70
      ? Colors.scoreA
      : company.sustainabilityScore >= 55
      ? Colors.scoreB
      : company.sustainabilityScore >= 40
      ? Colors.scoreC
      : Colors.scoreD;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.textPrimary, '#2A4040']}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.companyMeta}>
          <View style={styles.companyIconWrap}>
            <Ionicons name="business" size={36} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyHq}>
              <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.6)" /> {company.hq}
            </Text>
            <View style={styles.metaRow}>
              <MetaPill icon="people-outline" value={company.employees} label="Employees" />
              <MetaPill icon="trending-up-outline" value={`$${company.revenue}`} label="Revenue" />
            </View>
          </View>
        </View>

        {/* Risk banner — lobbying spend is Pro-gated */}
        {prefs.showLobbying !== false && unlocked && (
          <View style={[styles.riskBanner, { backgroundColor: lobbyRisk.bg }]}>
            <View style={styles.riskLeft}>
              <Text style={[styles.riskLabel, { color: lobbyRisk.color }]}>Lobbying Risk</Text>
              <Text style={[styles.riskLevel, { color: lobbyRisk.color }]}>{lobbyRisk.label}</Text>
            </View>
            <View style={styles.riskRight}>
              {highSeverityCount > 0 && (
                <View style={styles.highFlag}>
                  <Ionicons name="alert-circle" size={14} color={Colors.flagRed} />
                  <Text style={styles.highFlagText}>{highSeverityCount} high-severity issue{highSeverityCount > 1 ? 's' : ''}</Text>
                </View>
              )}
              <Text style={[styles.riskAmount, { color: lobbyRisk.color }]}>
                {formatCurrency(company.lobbyingSpend)}/yr
              </Text>
              <Text style={[styles.riskSub, { color: lobbyRisk.color }]}>Federal lobbying</Text>
            </View>
          </View>
        )}

        {/* Locked teaser for free users */}
        {prefs.showLobbying !== false && !unlocked && (
          <TouchableOpacity style={styles.riskLocked} activeOpacity={0.85} onPress={goPaywall}>
            <Ionicons name="lock-closed" size={15} color={Colors.white} />
            <Text style={styles.riskLockedText}>Lobbying spend & political influence</Text>
            <View style={styles.riskLockedBtn}>
              <Text style={styles.riskLockedBtnText}>Unlock</Text>
            </View>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['overview', 'issues', 'brands', 'products'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        {activeTab === 'overview' && (
          <View>
            {/* Business Financials */}
            <SectionHeader title="Business Financials" />
            <View style={styles.financialsCard}>
              <View style={styles.financialsRow}>
                <View style={styles.financialStat}>
                  <Ionicons name="trending-up-outline" size={18} color={Colors.primary} />
                  <Text style={styles.financialValue}>${company.revenue}</Text>
                  <Text style={styles.financialLabel}>Annual Revenue</Text>
                </View>
                <View style={styles.financialDivider} />
                <View style={styles.financialStat}>
                  <Ionicons name="people-outline" size={18} color={Colors.primary} />
                  <Text style={styles.financialValue}>{company.employees}</Text>
                  <Text style={styles.financialLabel}>Employees</Text>
                </View>
              </View>
              {unlocked && prefs.showLobbying !== false && company.lobbyingSpend != null && (
                <>
                  <View style={styles.financialsDividerH} />
                  <View style={styles.financialsRow}>
                    <View style={styles.financialStat}>
                      <Ionicons name="megaphone-outline" size={18} color="#E67E22" />
                      <Text style={[styles.financialValue, { color: '#E67E22' }]}>{formatCurrency(company.lobbyingSpend)}</Text>
                      <Text style={styles.financialLabel}>Federal Lobbying / yr</Text>
                    </View>
                    {prefs.showDonations !== false && company.politicalDonations != null && (
                      <>
                        <View style={styles.financialDivider} />
                        <View style={styles.financialStat}>
                          <Ionicons name="flag-outline" size={18} color="#8E44AD" />
                          <Text style={[styles.financialValue, { color: '#8E44AD' }]}>{formatCurrency(company.politicalDonations)}</Text>
                          <Text style={styles.financialLabel}>Political Donations</Text>
                        </View>
                      </>
                    )}
                  </View>
                </>
              )}
            </View>

            {/* Political donation split */}
            {unlocked && prefs.showDonations !== false && company.politicalDonations != null && (
              <>
                <SectionHeader title="Donation Split" subtitle={`${company.donationSplitYear ?? ''} election cycle`} />
                <View style={styles.donationCard}>
                  <View style={styles.donationBarWrap}>
                    <View style={[styles.donationRed, { flex: repPct }]} />
                    <View style={[styles.donationBlue, { flex: demPct }]} />
                  </View>
                  <View style={styles.donationLegend}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#C0392B' }]} />
                      <Text style={styles.legendText}>Republican {repPct}%</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#2980B9' }]} />
                      <Text style={styles.legendText}>Democrat {demPct}%</Text>
                    </View>
                  </View>
                  {company.donationSplitSource && (
                    <Text style={styles.sourceNote}>Source: {company.donationSplitSource}</Text>
                  )}
                </View>
              </>
            )}

            {/* Lobbying targets */}
            {unlocked && prefs.showLobbying !== false && company.lobbyingTargets?.length > 0 && (
              <>
                <SectionHeader title="Lobbying Targets" />
                <View style={styles.targetList}>
                  {company.lobbyingTargets.map((t, i) => (
                    <View key={i} style={styles.targetRow}>
                      <Ionicons name="megaphone-outline" size={14} color={Colors.primary} />
                      <Text style={styles.targetText}>{t}</Text>
                    </View>
                  ))}
                  {company.lobbyingSource && (
                    <Text style={[styles.sourceNote, { marginTop: 6 }]}>Source: {company.lobbyingSource}</Text>
                  )}
                </View>
              </>
            )}

            {/* Money-trail data is Pro-gated (free for the weekly spotlight company) */}
            {!unlocked && (
              <LockedTeaser
                title="Lobbying & political donations"
                subtitle="See federal lobbying spend, the R/D donation split, and who they fund."
                onPress={goPaywall}
              />
            )}

            {/* Sustainability */}
            <SectionHeader title="Sustainability Score" />
            <View style={styles.sustainCard}>
              <View style={[styles.sustainScore, { borderColor: sustainColor }]}>
                <Text style={[styles.sustainNum, { color: sustainColor }]}>{company.sustainabilityScore}</Text>
                <Text style={[styles.sustainMax, { color: sustainColor }]}>/100</Text>
              </View>
              <View style={styles.sustainBar}>
                <View style={styles.sustainTrack}>
                  <View
                    style={[
                      styles.sustainFill,
                      { width: `${company.sustainabilityScore}%`, backgroundColor: sustainColor },
                    ]}
                  />
                </View>
                <Text style={styles.sustainNote}>
                  Based on environmental, labor, and supply chain data.
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'issues' && (
          <View>
            <SectionHeader
              title="Corporate Issues & Flags"
              subtitle={`${company.issues?.length ?? 0} documented concerns`}
            />
            {!unlocked ? (
              <LockedTeaser
                title="Unlock documented issues"
                subtitle={`${company.issues?.length ?? 0} concern${(company.issues?.length ?? 0) !== 1 ? 's' : ''} — recalls, lawsuits, and controversies.`}
                onPress={goPaywall}
              />
            ) : company.issues?.length > 0 ? (
              company.issues.map((issue, i) => <LobbyingFlagCard key={i} issue={issue} />)
            ) : (
              <EmptyState icon="checkmark-circle-outline" text="No documented issues found for this company." />
            )}
          </View>
        )}

        {activeTab === 'brands' && (
          <View>
            <SectionHeader
              title="Brands & Subsidiaries"
              subtitle={`${company.subsidiaries?.length ?? 0} brands under ${company.name}`}
            />
            <View style={styles.brandsGrid}>
              {company.subsidiaries?.map((brand, i) => (
                <View key={i} style={styles.brandCard}>
                  <Ionicons name="pricetag-outline" size={16} color={Colors.primary} />
                  <Text style={styles.brandName}>{brand}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'products' && (
          <View>
            <SectionHeader
              title="Products"
              subtitle={`${companyProducts.length} product${companyProducts.length !== 1 ? 's' : ''} in database`}
            />
            {companyProducts.length > 0 ? (
              companyProducts.map((product, i) => {
                const result = scoreProduct(product);
                const scoreColor = result.insufficientData ? '#9BB5AE' : scoreToColor(result.score);
                return (
                  <TouchableOpacity
                    key={product.barcode ?? i}
                    style={styles.productRow}
                    onPress={() => navigation.navigate('ProductScore', { product })}
                  >
                    {product.image ? (
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                    ) : (
                      <View style={styles.productImagePlaceholder}>
                        <Image source={require('../../assets/icon.png')} style={styles.productLogo} resizeMode="contain" />
                      </View>
                    )}
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                      <Text style={styles.productBrand}>{product.brand} · {product.category}</Text>
                    </View>
                    <View style={[styles.productScore, { borderColor: scoreColor }]}>
                      <Text style={[styles.productScoreNum, { color: scoreColor }]}>
                        {result.insufficientData ? '?' : result.score}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <EmptyState icon="cube-outline" text="No products in the database for this company yet." />
            )}
          </View>
        )}
      </ScrollView>

      {/* Upgrade CTA — shown only to free users */}
      {!isPro && (
        <TouchableOpacity
          style={styles.upgradeBanner}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Paywall', { feature: 'company' })}
        >
          <Text style={styles.upgradeBannerText}>
            {spotlight
              ? 'Enjoying the money trail? Unlock every company'
              : "Unlock every company’s money trail"}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function MetaPill({ icon, value, label }) {
  return (
    <View style={mpStyles.wrap}>
      <Ionicons name={icon} size={12} color="rgba(255,255,255,0.6)" />
      <Text style={mpStyles.value}>{value}</Text>
    </View>
  );
}
const mpStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 12, marginTop: 4 },
  value: { fontSize: Font.sizes.xs, color: 'rgba(255,255,255,0.7)' },
});

function SectionHeader({ title, subtitle }) {
  return (
    <View style={shStyles.wrap}>
      <Text style={shStyles.title}>{title}</Text>
      {subtitle && <Text style={shStyles.sub}>{subtitle}</Text>}
    </View>
  );
}
const shStyles = StyleSheet.create({
  wrap: { marginBottom: 12, marginTop: 4 },
  title: { fontSize: Font.sizes.md, fontWeight: Font.weights.bold, color: Colors.textPrimary },
  sub: { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 2 },
});

function EmptyState({ icon, text }) {
  return (
    <View style={esStyles.wrap}>
      <Ionicons name={icon} size={40} color={Colors.textMuted} />
      <Text style={esStyles.text}>{text}</Text>
    </View>
  );
}
const esStyles = StyleSheet.create({
  wrap: { alignItems: 'center', padding: 40, gap: 12 },
  text: { fontSize: Font.sizes.base, color: Colors.textMuted, textAlign: 'center' },
});

function LockedTeaser({ title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={ltStyles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={ltStyles.lockCircle}>
        <Ionicons name="lock-closed" size={20} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ltStyles.title}>{title}</Text>
        <Text style={ltStyles.sub}>{subtitle}</Text>
      </View>
      <View style={ltStyles.btn}>
        <Text style={ltStyles.btnText}>Unlock</Text>
      </View>
    </TouchableOpacity>
  );
}
const ltStyles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  lockCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold, color: Colors.textPrimary },
  sub: { fontSize: Font.sizes.xs, color: Colors.textSecondary, marginTop: 2, lineHeight: 16 },
  btn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  btnText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold, color: '#fff' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTop: { marginBottom: 16 },
  backBtn: { padding: 4 },
  companyMeta: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
  companyIconWrap: { width: 64, height: 64, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  companyName: { fontSize: Font.sizes.lg, fontWeight: Font.weights.bold, color: Colors.white, lineHeight: 26 },
  companyHq: { fontSize: Font.sizes.sm, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  metaRow: { flexDirection: 'row', marginTop: 6 },

  riskBanner: { borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  riskLeft: { flex: 1 },
  riskLabel: { fontSize: Font.sizes.xs, fontWeight: Font.weights.medium },
  riskLevel: { fontSize: Font.sizes.lg, fontWeight: Font.weights.heavy, marginTop: 2 },
  riskRight: { alignItems: 'flex-end', gap: 2 },
  riskAmount: { fontSize: Font.sizes.md, fontWeight: Font.weights.bold },
  riskSub: { fontSize: Font.sizes.xs },
  highFlag: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  highFlagText: { fontSize: Font.sizes.xs, color: Colors.flagRed, fontWeight: Font.weights.medium },

  riskLocked: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: 14,
  },
  riskLockedText: { flex: 1, fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.white },
  riskLockedBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  riskLockedBtnText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold, color: '#fff' },

  tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabLabel: { fontSize: Font.sizes.sm, color: Colors.textMuted, fontWeight: Font.weights.medium },
  tabLabelActive: { color: Colors.primary, fontWeight: Font.weights.semibold },
  body: { flex: 1 },

  sustainCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  sustainScore: { width: 70, height: 70, borderRadius: 35, borderWidth: 5, alignItems: 'center', justifyContent: 'center' },
  sustainNum: { fontSize: Font.sizes.xl, fontWeight: Font.weights.heavy },
  sustainMax: { fontSize: Font.sizes.xs, fontWeight: Font.weights.medium, marginTop: -4 },
  sustainBar: { flex: 1 },
  sustainTrack: { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  sustainFill: { height: '100%', borderRadius: 4 },
  sustainNote: { fontSize: Font.sizes.xs, color: Colors.textMuted },

  financialsCard: { backgroundColor: Colors.white, borderRadius: 14, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  financialsRow: { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 16 },
  financialStat: { flex: 1, alignItems: 'center', gap: 4 },
  financialDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 8 },
  financialsDividerH: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
  financialValue: { fontSize: Font.sizes.lg, fontWeight: Font.weights.heavy, color: Colors.textPrimary, marginTop: 4 },
  financialLabel: { fontSize: Font.sizes.xs, color: Colors.textMuted, textAlign: 'center' },
  sourceNote: { fontSize: Font.sizes.xs, color: Colors.textMuted, fontStyle: 'italic', marginTop: 4 },

  donationCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  donationBarWrap: { flexDirection: 'row', height: 16, borderRadius: 8, overflow: 'hidden', marginBottom: 10 },
  donationRed: { backgroundColor: '#C0392B' },
  donationBlue: { backgroundColor: '#2980B9' },
  donationLegend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: Font.sizes.sm, color: Colors.textSecondary },

  targetList: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 20, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  targetRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  targetText: { fontSize: Font.sizes.sm, color: Colors.textSecondary, flex: 1 },

  brandsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  brandCard: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  brandName: { fontSize: Font.sizes.sm, fontWeight: Font.weights.medium, color: Colors.textPrimary },
  productRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  productImage: { width: 52, height: 52, borderRadius: 8, marginRight: 12, resizeMode: 'contain' },
  productImagePlaceholder: { width: 52, height: 52, borderRadius: 8, marginRight: 12, backgroundColor: '#D5EAE3', alignItems: 'center', justifyContent: 'center' },
  productLogo: { width: 34, height: 34, opacity: 0.85 },
  productScore: { minWidth: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 6 },
  productScoreNum: { fontSize: Font.sizes.md, fontWeight: Font.weights.bold },
  productInfo: { flex: 1 },
  productName: { fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.textPrimary },
  productBrand: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.primaryLight, borderTopWidth: 1, borderTopColor: Colors.border,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  upgradeBannerText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.primaryDark, flex: 1 },
});
