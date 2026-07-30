import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';

// Human-readable labels for the sourcing-transparency evidence schema
// (.claude/skills/sourcing-transparency/references/evidence-schema.md).
// 'unknown' is deliberately absent from every map below — the schema treats
// 'unknown' as "omit or show a neutral not-confirmed note", never a label.
const INDUSTRY_LABELS = {
  eggs: 'Eggs',
  dairy: 'Dairy',
  'meat-poultry': 'Meat & Poultry',
  seafood: 'Seafood',
  'produce-farms': 'Produce & Farms',
};

const MODEL_LABELS = {
  'single-farm': 'Single Farm',
  'contract-farms': 'Contract Farm Network',
  'co-op': 'Farmer Cooperative',
  aggregator: 'Multi-Source / Aggregated',
};

const HOUSING_LABELS = {
  caged: 'Caged',
  'cage-free': 'Cage-Free',
  'free-range': 'Free-Range',
  'pasture-raised': 'Pasture-Raised',
  mixed: 'Mixed Systems',
};

// Legal-STATUS tones for enforcement entries — deliberately NOT the
// high/medium/low SEVERITY palette LobbyingFlagCard uses for issues[]. This
// map communicates how resolved an action is, not how bad it is; whatever
// weight an entry carries lives in its already-hedged `action` text, not in
// red/orange/yellow color.
const STATUS_STYLE = {
  adjudicated: { color: '#2980B9', bg: '#EAF3FA', icon: 'checkmark-done-circle-outline', label: 'Adjudicated' },
  settled: { color: '#2980B9', bg: '#EAF3FA', icon: 'checkmark-done-circle-outline', label: 'Settled' },
  pending: { color: Colors.textSecondary, bg: '#EEF3F1', icon: 'hourglass-outline', label: 'Pending' },
  alleged: { color: Colors.textSecondary, bg: '#EEF3F1', icon: 'help-circle-outline', label: 'Alleged' },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function humanizeIndustry(industry) {
  if (!industry) return null;
  return (
    INDUSTRY_LABELS[industry] ||
    industry.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

// Attribution helper for the schema's mandatory `basis` field — a
// company-disclosure claim must never read in the app's own voice as
// established fact (evidence-schema.md display rules).
function sourceLine(source) {
  if (!source?.name) return null;
  return source.basis === 'company-disclosure' ? `The company states — ${source.name}` : `Source: ${source.name}`;
}

export default function SourcingSection({ sourcing }) {
  if (!sourcing) return null;

  const {
    industry,
    lastVerified,
    model,
    modelSource,
    certifications = [],
    welfare,
    enforcement = [],
    practices = [],
  } = sourcing;

  const housing = welfare?.housing;
  const scorecards = welfare?.scorecards ?? [];

  const headerParts = [];
  const industryLabel = humanizeIndustry(industry);
  if (industryLabel) headerParts.push(industryLabel);
  if (lastVerified) headerParts.push(`Verified ${formatDate(lastVerified)}`);

  return (
    <View>
      {headerParts.length > 0 && (
        <Text style={styles.headerRow}>{headerParts.join(' · ')}</Text>
      )}

      {/* Sourcing model — omitted entirely (no card, no header) when unknown,
          per evidence-schema.md: 'unknown' is never rendered as a value. */}
      {model && model !== 'unknown' && (
        <>
          <SubHeader title="Sourcing Model" />
          <View style={styles.card}>
            <Text style={styles.modelLabel}>{MODEL_LABELS[model] || model}</Text>
            {sourceLine(modelSource) && (
              <Text style={styles.sourceNote}>{sourceLine(modelSource)}</Text>
            )}
          </View>
        </>
      )}

      {/* Certifications — an empty array is neutral information, not a red
          flag; the note below must carry no warning styling. */}
      <SubHeader title="Certifications" />
      {certifications.length > 0 ? (
        certifications.map((cert, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.certName}>{cert.name}</Text>
            {cert.verifier && <Text style={styles.certMeta}>Verifier: {cert.verifier}</Text>}
            {cert.scope && <Text style={styles.certScope}>{cert.scope}</Text>}
            {cert.standard && <Text style={styles.certMeta}>Standard: {cert.standard}</Text>}
            <Text style={styles.sourceNote}>
              {cert.verifiedDate ? `Verified ${formatDate(cert.verifiedDate)}` : ''}
              {cert.verifiedDate && cert.source?.name ? ' · ' : ''}
              {cert.source?.name ?? ''}
            </Text>
          </View>
        ))
      ) : (
        <NeutralNote text="No third-party welfare certification found for this brand." />
      )}

      {/* Housing — the one deliberately company-wide field. Unknown still
          renders a neutral "not confirmed" note (distinct from "not shown at
          all") so the user can tell "checked, don't know" from "no data". */}
      <SubHeader title="Housing System" />
      {housing && housing !== 'unknown' ? (
        <View style={styles.card}>
          <View style={styles.housingBadge}>
            <Text style={styles.housingBadgeText}>{HOUSING_LABELS[housing] || housing}</Text>
          </View>
          {sourceLine(welfare?.housingSource) && (
            <Text style={styles.sourceNote}>{sourceLine(welfare.housingSource)}</Text>
          )}
        </View>
      ) : (
        <NeutralNote text="Housing system not independently confirmed." />
      )}

      {/* Scorecard ratings — every entry names the exact line it rates so a
          rating can never be misread as describing the whole company or a
          different SKU (this screen never knows which product the user is
          holding — see CompanyProfileScreen.js route params). */}
      {scorecards.length > 0 && (
        <>
          <SubHeader title="Welfare Scorecard Ratings" />
          {scorecards.map((sc, i) => (
            <ScorecardCard key={i} entry={sc} />
          ))}
        </>
      )}

      {/* Enforcement / litigation */}
      {enforcement.length > 0 && (
        <>
          <SubHeader title="Enforcement & Litigation" />
          {enforcement.map((e, i) => (
            <EnforcementCard key={i} entry={e} />
          ))}
        </>
      )}

      {/* Practices — real information that isn't certification-backed;
          basis drives the attribution suffix so a company's own claim never
          reads as the app's established fact. */}
      {practices.length > 0 && (
        <>
          <SubHeader title="Reported Practices" />
          {practices.map((p, i) => (
            <PracticeRow key={i} entry={p} />
          ))}
        </>
      )}
    </View>
  );
}

function ScorecardCard({ entry }) {
  const body = (
    <>
      <Text style={styles.scorecardName}>{entry.name}</Text>
      <View style={styles.scorecardStatsRow}>
        {entry.rating ? <Text style={styles.scorecardRating}>{entry.rating}</Text> : null}
        {entry.tier ? <Text style={styles.scorecardTier}>{entry.tier}</Text> : null}
      </View>
      <View style={styles.ratedLineWrap}>
        <Ionicons name="pricetag-outline" size={13} color={Colors.primaryDark} />
        <Text style={styles.ratedLineText}>Rates: {entry.ratedLine}</Text>
      </View>
      {(entry.year || entry.url) && (
        <Text style={styles.sourceNote}>
          {entry.year ?? ''}
          {entry.year && entry.url ? ' · ' : ''}
          {entry.url ? 'Tap to view source' : ''}
        </Text>
      )}
    </>
  );

  if (entry.url) {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => Linking.openURL(entry.url).catch(() => {})}
      >
        {body}
      </TouchableOpacity>
    );
  }
  return <View style={styles.card}>{body}</View>;
}

function EnforcementCard({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const tone = STATUS_STYLE[entry.status] || STATUS_STYLE.alleged;
  const label = [entry.year, entry.body, tone.label].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity
      style={[efStyles.card, { borderLeftColor: tone.color }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={efStyles.header}>
        <View style={[efStyles.iconWrap, { backgroundColor: tone.bg }]}>
          <Ionicons name={tone.icon} size={16} color={tone.color} />
        </View>
        <Text style={efStyles.title}>{label}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textMuted} />
      </View>
      {expanded && (
        <View style={efStyles.body}>
          {/* Rendered verbatim — already hedged by the sourcing-transparency
              pipeline. Never summarize or add interpretive framing here. */}
          <Text style={efStyles.description}>{entry.action}</Text>
          {entry.source?.name && <Text style={efStyles.source}>Source: {entry.source.name}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

function PracticeRow({ entry }) {
  const isCompanyClaim = entry.basis === 'company-disclosure';
  const suffix = isCompanyClaim
    ? '— according to the company'
    : entry.source?.name
    ? `— per ${entry.source.name}`
    : '';

  // The suffix above already states the source's NAME for every basis
  // except company-disclosure — repeating it in the note below would say
  // the same thing twice. The note's job is to add what the suffix
  // couldn't: the name when it's a company claim, and the date/link
  // whenever either exists.
  const noteParts = [];
  if (isCompanyClaim && entry.source?.name) noteParts.push(entry.source.name);
  if (entry.source?.date) noteParts.push(formatDate(entry.source.date) || entry.source.date);
  const noteText = noteParts.join(' · ');
  const hasUrl = Boolean(entry.source?.url);

  const note = (noteText || hasUrl) && (
    <Text style={styles.sourceNote}>
      {[noteText, hasUrl ? 'Tap to view source' : ''].filter(Boolean).join(' · ')}
    </Text>
  );

  const content = (
    <>
      <Text style={styles.practiceText}>
        {entry.claim}
        {suffix ? ` ${suffix}` : ''}
      </Text>
      {note}
    </>
  );

  return (
    <View style={styles.practiceRow}>
      <Ionicons name="leaf-outline" size={14} color={Colors.primary} style={styles.practiceIcon} />
      {hasUrl ? (
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.7} onPress={() => Linking.openURL(entry.source.url).catch(() => {})}>
          {content}
        </TouchableOpacity>
      ) : (
        <View style={{ flex: 1 }}>{content}</View>
      )}
    </View>
  );
}

function SubHeader({ title }) {
  return <Text style={styles.subHeader}>{title}</Text>;
}

function NeutralNote({ text }) {
  return (
    <View style={styles.neutralNote}>
      <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
      <Text style={styles.neutralNoteText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginBottom: 16 },
  subHeader: {
    fontSize: Font.sizes.sm,
    fontWeight: Font.weights.bold,
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 10,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sourceNote: { fontSize: Font.sizes.xs, color: Colors.textMuted, fontStyle: 'italic', marginTop: 6 },

  modelLabel: { fontSize: Font.sizes.base, fontWeight: Font.weights.bold, color: Colors.textPrimary },

  certName: { fontSize: Font.sizes.base, fontWeight: Font.weights.bold, color: Colors.textPrimary },
  certMeta: { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 4 },
  certScope: { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginTop: 4, lineHeight: 20 },

  housingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  housingBadgeText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold, color: Colors.primaryDark },

  scorecardName: { fontSize: Font.sizes.base, fontWeight: Font.weights.bold, color: Colors.textPrimary },
  scorecardStatsRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 6 },
  scorecardRating: { fontSize: Font.sizes.md, fontWeight: Font.weights.heavy, color: Colors.primary },
  scorecardTier: { fontSize: Font.sizes.sm, color: Colors.textSecondary },
  // Deliberately prominent, tinted box — not fine print. This is the line
  // that keeps a rating from being misread as describing a different SKU.
  ratedLineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  ratedLineText: { flex: 1, fontSize: Font.sizes.sm, fontWeight: Font.weights.bold, color: Colors.primaryDark },

  practiceRow: { flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'flex-start' },
  practiceIcon: { marginTop: 3 },
  practiceText: { fontSize: Font.sizes.sm, color: Colors.textSecondary, lineHeight: 20 },

  neutralNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  neutralNoteText: { flex: 1, fontSize: Font.sizes.sm, color: Colors.textSecondary, lineHeight: 20 },
});

// Enforcement card mirrors LobbyingFlagCard's visual language (colored left
// border + icon badge + expand/collapse) but is its own component: the
// underlying data shape (year/body/action/status) and color mapping (legal
// status, not severity) are both different from issues[].
const efStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.textPrimary },
  body: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  description: { fontSize: Font.sizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  source: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 6, fontStyle: 'italic' },
});
