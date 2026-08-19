import React, { forwardRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { buildShareCardData, SHARE_CARD_COLORS } from '../utils/shareCard';

// Fixed 9:16 card dimensions (device-independent points). The screen that
// captures this view (react-native-view-shot's captureRef) upscales the
// output to a higher-res PNG via its own width/height options — this
// component just needs to lay out correctly at a consistent aspect ratio,
// not at final export resolution.
export const SHARE_CARD_WIDTH = 360;
export const SHARE_CARD_HEIGHT = 640;

// FUTURE: once a referral program ships, a referral code param gets appended
// here (e.g. `${APP_STORE_URL}?ref=${referralCode}`). No referral backend
// exists yet — this is a static link only. See context/backlog.md.
const APP_STORE_URL = 'apps.apple.com/app/id6776718186';

/**
 * The dark 9:16 social share card. Rendered off-screen by ProductScoreScreen
 * and captured to a PNG via react-native-view-shot — see handleShare there.
 *
 * Data shaping (top-3 issue selection, empty-state fallbacks, score-band
 * colors) lives in src/utils/shareCard.js so it's unit-testable without a
 * component-render setup (this project doesn't have one — see
 * src/__tests__/noLetterGradeInUI.test.js's header comment).
 */
const ShareCard = forwardRef(function ShareCard({ product, result, company }, ref) {
  const data = buildShareCardData({ product, result, company });

  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      {/* Header wordmark */}
      <View style={styles.header}>
        <Ionicons name="search" size={13} color={Colors.primaryMid} />
        <Text style={styles.wordmark}>FOOD EXPOSÉ</Text>
      </View>

      {/* Top row: company logo + product name/meta + score ring */}
      <View style={styles.topRow}>
        {data.logo ? (
          <Image source={{ uri: data.logo }} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={styles.logoFallback}>
            <Ionicons name="business-outline" size={20} color="rgba(255,255,255,0.55)" />
          </View>
        )}
        <View style={styles.topRowMid}>
          <Text style={styles.productName} numberOfLines={2}>{data.productName}</Text>
          <SubLine metaLine={data.metaLine} parentCompanyLabel={data.parentCompanyLabel} />
        </View>
        <ScoreRing scoreLabel={data.scoreLabel} color={data.scoreColor} />
      </View>
      <Text style={[styles.verdict, { color: data.scoreColor }]}>{data.verdictLabel}</Text>

      {/* What's in it */}
      <SectionHeader label="What's in it" />
      {data.chips.length > 0 ? (
        <View style={styles.chipRow}>
          {data.chips.map((chip, i) => (
            <View key={i} style={styles.chip}>
              <View style={[styles.chipDot, { backgroundColor: chip.color }]} />
              <Text style={styles.chipText} numberOfLines={1}>{chip.label}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyGreen}>No flagged ingredients</Text>
      )}

      {/* Where the money goes */}
      <SectionHeader label="Where the money goes" />
      {data.money.isEmpty ? (
        <Text style={styles.emptyGreen}>None on record</Text>
      ) : (
        <View style={styles.moneyWrap}>
          {data.money.hasLobbying && (
            <View style={styles.moneyRow}>
              <Text style={styles.moneyAmount}>{data.money.lobbyingSpendLabel}</Text>
              <Text style={styles.moneyLabel}>spent lobbying / year</Text>
              {data.money.lobbyingTargets.length > 0 && (
                <Text style={styles.moneyTargets} numberOfLines={1}>
                  Targets: {data.money.lobbyingTargets.join(', ')}
                </Text>
              )}
            </View>
          )}
          {data.money.hasDonations && (
            <View style={styles.moneyRow}>
              <Text style={styles.moneyAmount}>{data.money.donationsLabel}</Text>
              <Text style={styles.moneyLabel}>in political donations</Text>
              <View style={styles.splitBar}>
                <View style={[styles.splitBarRed, { flex: Math.max(data.money.repPct, 0.0001) }]} />
                <View style={[styles.splitBarBlue, { flex: Math.max(data.money.demPct, 0.0001) }]} />
              </View>
              <Text style={styles.moneyTargets}>
                R {data.money.repPct}% · D {data.money.demPct}%
              </Text>
            </View>
          )}
        </View>
      )}

      {/* On record */}
      <SectionHeader label="On record" />
      {data.issuesEmpty ? (
        <Text style={styles.emptyGreen}>None on record</Text>
      ) : (
        <View style={styles.issueWrap}>
          {data.issues.map((issue, i) => (
            <View key={i} style={[styles.issueRow, { borderLeftColor: issue.color }]}>
              <Text style={styles.issueTitle} numberOfLines={1}>{issue.title}</Text>
              <Text style={styles.issueDesc} numberOfLines={2}>{issue.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Footer CTA */}
      <View style={styles.footer}>
        <Text style={styles.cta}>Scan your food. Follow the money.</Text>
        <View style={styles.storeBadge}>
          <Ionicons name="logo-apple" size={13} color="#fff" />
          <Text style={styles.storeBadgeText}>{APP_STORE_URL}</Text>
        </View>
      </View>
    </View>
  );
});

export default ShareCard;

function SubLine({ metaLine, parentCompanyLabel }) {
  return (
    <Text style={styles.subLine} numberOfLines={1}>
      {metaLine ? metaLine : null}
      {metaLine ? ' · ' : ''}
      {parentCompanyLabel ? (
        parentCompanyLabel
      ) : (
        <Text style={{ color: SHARE_CARD_COLORS.green }}>None on record</Text>
      )}
    </Text>
  );
}

function ScoreRing({ scoreLabel, color }) {
  return (
    <View style={[styles.ring, { borderColor: color }]}>
      <Text style={[styles.ringScore, { color }]}>{scoreLabel}</Text>
      <Text style={styles.ringSub}>/100</Text>
    </View>
  );
}

function SectionHeader({ label }) {
  return (
    <View style={styles.sectionHeaderWrap}>
      <Text style={styles.sectionHeader}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SHARE_CARD_WIDTH,
    height: SHARE_CARD_HEIGHT,
    backgroundColor: '#10201C',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },

  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 18 },
  wordmark: {
    fontSize: 11, fontWeight: Font.weights.heavy, color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1.6,
  },

  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  logo: {
    width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)',
  },
  logoFallback: {
    width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  topRowMid: { flex: 1, paddingTop: 2 },
  productName: {
    fontSize: 16, fontWeight: Font.weights.bold, color: '#fff', lineHeight: 20,
  },
  subLine: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 4 },

  ring: {
    width: 58, height: 58, borderRadius: 29, borderWidth: 4,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  ringScore: { fontSize: 18, fontWeight: Font.weights.heavy },
  ringSub: { fontSize: 8, color: 'rgba(255,255,255,0.5)', fontWeight: Font.weights.medium, marginTop: -2 },

  verdict: {
    fontSize: 13, fontWeight: Font.weights.heavy, letterSpacing: 0.8,
    marginTop: 8, marginLeft: 56,
  },

  sectionHeaderWrap: { marginTop: 15, marginBottom: 7 },
  sectionHeader: {
    fontSize: 10, fontWeight: Font.weights.bold, color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.1,
  },

  emptyGreen: { fontSize: 13, fontWeight: Font.weights.semibold, color: SHARE_CARD_COLORS.green },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12,
    paddingHorizontal: 9, paddingVertical: 5, maxWidth: SHARE_CARD_WIDTH - 40,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: Font.weights.medium },

  moneyWrap: { gap: 12 },
  moneyRow: {},
  moneyAmount: { fontSize: 18, fontWeight: Font.weights.heavy, color: '#fff' },
  moneyLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  moneyTargets: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 5 },
  splitBar: {
    flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 8,
  },
  splitBarRed: { backgroundColor: '#D9534F' },
  splitBarBlue: { backgroundColor: '#4A7CC7' },

  issueWrap: { gap: 8 },
  issueRow: { borderLeftWidth: 3, paddingLeft: 9 },
  issueTitle: { fontSize: 12, fontWeight: Font.weights.semibold, color: '#fff' },
  issueDesc: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, lineHeight: 15 },

  footer: { marginTop: 'auto', alignItems: 'center' },
  cta: {
    fontSize: 14, fontWeight: Font.weights.bold, color: '#fff', textAlign: 'center', marginBottom: 10,
  },
  storeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  storeBadgeText: { fontSize: 11, fontWeight: Font.weights.bold, color: '#fff' },
});
