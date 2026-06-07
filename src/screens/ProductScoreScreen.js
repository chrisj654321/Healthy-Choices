import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Share, StatusBar, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import {
  scoreProduct, gradeToColor, scoreToVerdict, generateScoreExplanation, getPersonalisedWarnings,
} from '../utils/scorer';
import { addScanToHistory, getUserPrefs } from '../utils/storage';
import { useProStatus } from '../utils/subscription';
import { COMPANY_DB } from '../data/companies';
import IngredientRow from '../components/IngredientRow';
import GradeRing from '../components/GradeRing';
import StatBar from '../components/StatBar';

// ── Flag utils ────────────────────────────────────────────────────────────────

const FLAG_RANK = { avoid: 0, caution: 1, allergen: 1, moderate: 2, ok: 3 };
function sortIngredients(a, b) {
  const rank = (x) => x.category === 'unknown' ? 4 : (FLAG_RANK[x.flag] ?? 3);
  return rank(a) - rank(b);
}

const isBad = (item) => item.flag === 'avoid' || item.flag === 'caution' || item.flag === 'allergen';
const isOkay = (item) => item.flag === 'moderate';
const isGood = (item) => item.flag === 'ok';

const CATEGORY_META = {
  grains:           { emoji: '🌾', label: 'Grains & Flours' },
  sweeteners:       { emoji: '🍬', label: 'Sweeteners' },
  fats:             { emoji: '🫒', label: 'Fats & Oils' },
  dyes:             { emoji: '🎨', label: 'Artificial Dyes' },
  preservatives:    { emoji: '🧪', label: 'Preservatives' },
  emulsifiers:      { emoji: '⚗️', label: 'Emulsifiers & Stabilizers' },
  'flavor-enhancers': { emoji: '✨', label: 'Flavor Enhancers' },
  dairy:            { emoji: '🥛', label: 'Dairy & Alternatives' },
  proteins:         { emoji: '🥩', label: 'Proteins & Legumes' },
  spices:           { emoji: '🌿', label: 'Spices & Herbs' },
  additives:        { emoji: '🔬', label: 'Additives & Processing Aids' },
  probiotics:       { emoji: '🦠', label: 'Probiotics & Fermented' },
  cacao:            { emoji: '🍫', label: 'Cacao & Chocolate' },
  'sugar-alcohols': { emoji: '🍭', label: 'Sugar Alcohols' },
  vitamins:         { emoji: '💊', label: 'Vitamins & Minerals' },
  unknown:          { emoji: '❓', label: 'Unknown' },
};

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

function CategorySection({ catKey, items, collapsed, onToggle }) {
  const meta = CATEGORY_META[catKey] ?? CATEGORY_META.unknown;
  const badCount = items.filter(isBad).length;
  const okayCount = items.filter(isOkay).length;
  const goodCount = items.filter(isGood).length;
  const sorted = [...items].sort(sortIngredients);

  return (
    <View style={catS.wrap}>
      <TouchableOpacity style={catS.header} onPress={onToggle} activeOpacity={0.7}>
        <Text style={catS.emoji}>{meta.emoji}</Text>
        <Text style={catS.name}>{meta.label}</Text>
        <View style={catS.right}>
          {badCount > 0 && (
            <View style={[catS.pill, catS.pillBad]}>
              <Text style={[catS.pillText, catS.pillTextBad]}>{badCount} bad</Text>
            </View>
          )}
          {okayCount > 0 && (
            <View style={[catS.pill, catS.pillOkay]}>
              <Text style={[catS.pillText, catS.pillTextOkay]}>{okayCount} okay</Text>
            </View>
          )}
          {goodCount > 0 && badCount === 0 && okayCount === 0 && (
            <View style={[catS.pill, catS.pillGood]}>
              <Text style={[catS.pillText, catS.pillTextGood]}>{goodCount} good</Text>
            </View>
          )}
          <Ionicons
            name={collapsed ? 'chevron-down' : 'chevron-up'}
            size={14}
            color="#9BB5AE"
          />
        </View>
      </TouchableOpacity>
      {!collapsed && (
        <View style={catS.body}>
          {sorted.map((item, i) => <IngredientRow key={i} item={item} />)}
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

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ProductScoreScreen({ route, navigation }) {
  const { product } = route?.params ?? {};
  const insets = useSafeAreaInsets();
  const { isPro, refresh: refreshPro } = useProStatus();
  const [result, setResult] = useState(null);
  const [warnings, setWarnings] = useState(null);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [collapsedCats, setCollapsedCats] = useState(new Set());

  useEffect(() => {
    const r = scoreProduct(product);
    setResult(r);
    // Only add to history when navigating from the scanner, not when
    // viewing a past scan from the history list.
    if (!route?.params?.fromHistory) {
      addScanToHistory(product, r);
    }
    getUserPrefs().then((prefs) => {
      setWarnings(getPersonalisedWarnings(r.analyzedIngredients, product, prefs));
    });
  }, [product]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    if (!isPro) {
      navigation.navigate('Paywall', { feature: 'share' });
      return;
    }
    await Share.share({
      message:
        `${product.name} scored ${result.grade} (${result.score}/100) on Healthy Choices.\n` +
        (result.avoidCount > 0
          ? `⚠️ ${result.avoidCount} ingredient(s) to avoid.`
          : '✅ No major red-flag ingredients!'),
    });
  }, [result, product, isPro, navigation]);

  if (!product) return null;
  if (!result) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  const { score, grade, analyzedIngredients } = result;
  const gradeCol = gradeToColor(grade);
  const verdict = scoreToVerdict(grade);
  const explanation = generateScoreExplanation(product, result);
  const { nutrition = {} } = product;
  const company = product.companyId ? COMPANY_DB[product.companyId] : null;

  const totalBad = analyzedIngredients.filter(isBad).length;
  const totalOkay = analyzedIngredients.filter(isOkay).length;
  const totalGood = analyzedIngredients.filter(isGood).length;

  const grouped = analyzedIngredients.reduce((acc, item) => {
    const key = item.category || 'unknown';
    (acc[key] = acc[key] || []).push(item);
    return acc;
  }, {});
  const sortedCats = Object.keys(grouped).sort((a, b) => {
    const badA = grouped[a].filter(isBad).length;
    const badB = grouped[b].filter(isBad).length;
    if (badB !== badA) return badB - badA;
    return grouped[b].length - grouped[a].length;
  });

  const toggleCat = (key) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const TABS = ['ingredients', 'nutrition', 'company'];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        bounces
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[3]}
      >
        {/* ── 0: Hero image ── */}
        <View style={s.heroWrap}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={s.heroImg} resizeMode="cover" />
          ) : (
            <View style={[s.heroPlaceholder, { backgroundColor: gradeCol }]}>
              <Text style={s.heroGrade}>{grade}</Text>
            </View>
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.52)', 'rgba(0,0,0,0.0)']}
            style={[s.heroOverlay, { paddingTop: insets.top + 10 }]}
          >
            <TouchableOpacity style={s.navBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={s.navBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* ── 1: Product info + score ── */}
        <View style={s.infoCard}>
          <Text style={s.productName}>{product.name}</Text>
          <Text style={s.productMeta}>
            {product.brand}
            {product.category && product.category !== 'General' ? ` · ${product.category}` : ''}
          </Text>

          <View style={s.scoreRow}>
            <GradeRing score={score} grade={grade} color={gradeCol} size={88} />
            <View style={s.scoreRight}>
              <View style={[s.verdictBadge, { backgroundColor: gradeCol + '1C' }]}>
                <Text style={[s.verdictText, { color: gradeCol }]}>{verdict}</Text>
              </View>
              <Text style={s.scoreSubLabel}>out of 100</Text>
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

        {/* ── 2: HealthyChoices Says ── */}
        <View style={[s.sayCard, { borderLeftColor: gradeCol }]}>
          <View style={s.sayHeader}>
            <View style={[s.sayIcon, { backgroundColor: gradeCol + '22' }]}>
              <Ionicons name="leaf" size={13} color={gradeCol} />
            </View>
            <Text style={[s.sayTitle, { color: gradeCol }]}>HealthyChoices Says</Text>
          </View>
          <Text style={s.sayText}>{explanation}</Text>
        </View>

        {/* ── 3: Tabs (sticky) ── */}
        <View style={s.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[s.tab, activeTab === tab && s.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[s.tabLabel, activeTab === tab && s.tabLabelActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
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

              {/* Summary row */}
              <IngredientSummaryRow totalBad={totalBad} totalOkay={totalOkay} totalGood={totalGood} />

              {/* All clear banner */}
              {totalBad === 0 && totalOkay === 0 && (
                <View style={s.allClear}>
                  <Ionicons name="checkmark-circle" size={22} color="#1D9E75" />
                  <Text style={s.allClearText}>No concerning ingredients found</Text>
                </View>
              )}

              {/* Category sections */}
              {sortedCats.map((key) => (
                <CategorySection
                  key={key}
                  catKey={key}
                  items={grouped[key]}
                  collapsed={collapsedCats.has(key)}
                  onToggle={() => toggleCat(key)}
                />
              ))}

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
                  {product.servingSize
                    ? `Per serving: ${product.servingSize} · ${product.calories} kcal`
                    : `Per 100g · ${product.calories} kcal`}
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
            <ProGateCard
              icon="business-outline"
              title="Company Transparency"
              desc="See lobbying spend, political donations, and controversies behind every brand you scan."
              onUpgrade={() => navigation.navigate('Paywall', { feature: 'company' })}
            />
          )}
          {activeTab === 'company' && isPro && (
            <View>
              {company ? (
                <>
                  <View style={s.coHead}>
                    <Text style={s.coName}>{company.name}</Text>
                    <Text style={s.coHQ}>{company.hq}</Text>
                  </View>

                  <View style={s.coStats}>
                    <CoStat icon="people-outline" label="Employees" value={company.employees} />
                    <CoStat icon="trending-up-outline" label="Revenue" value={`$${company.revenue}`} />
                    <CoStat
                      icon="megaphone-outline"
                      label="Lobbying/yr"
                      value={formatMoney(company.lobbyingSpend)}
                      highlight
                    />
                  </View>

                  {company.issues?.length > 0 && (
                    <View style={s.coAlert}>
                      <Ionicons name="alert-circle" size={15} color="#D93B3B" />
                      <Text style={s.coAlertText}>
                        {company.issues.filter((i) => i.severity === 'high').length} high-severity &{' '}
                        {company.issues.filter((i) => i.severity === 'medium').length} medium issues documented.
                      </Text>
                    </View>
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
  heroPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroGrade: { fontSize: 90, fontWeight: '900', color: 'rgba(255,255,255,0.30)' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingBottom: 16,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },

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

  // HealthyChoices Says card
  sayCard: {
    marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    backgroundColor: '#F7FAF8', borderRadius: 14,
    padding: 16, borderLeftWidth: 3,
  },
  sayHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
  sayIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  sayTitle: { fontSize: 13, fontWeight: '700' },
  sayText: { fontSize: 14, color: '#2D4A42', lineHeight: 22 },

  // Tabs (sticky)
  tabBar: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#EDF2F0',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 13 },
  tabActive: { borderBottomWidth: 2.5, borderBottomColor: Colors.primary },
  tabLabel: { fontSize: 13, color: '#9BB5AE', fontWeight: '500' },
  tabLabelActive: { color: Colors.primary, fontWeight: '700' },

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
});
