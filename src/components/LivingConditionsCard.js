import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { detectHousingTier, matchSourcingToProduct, isEggsHousingEligible, getComparisonBaseline } from '../utils/sourcingMatch';

// Static requires — RN's bundler needs these resolved at build time, not
// from a dynamic path string. Keyed by the DETECTED tier (see
// sourcingMatch.js), never by company.sourcing.welfare.housing (that field
// is a deliberately company-wide "worst system" value, not this SKU's).
//
// No specific housing claim on the carton (plain "conventional") defaults
// to caged.jpg — the pilot's own research anchored that finding for the
// companies in this dataset.
//
// 'organic' (2026-07-30, revised): NOT caged.jpg — USDA organic rules
// legally prohibit battery cages outright, so that photo would depict a
// housing SYSTEM organic certification bars, a factual error about the
// system even when the real number is bad. NOT free-range.jpg either
// (the original default) — real audited data (Eggland's Best's organic
// line, 1.2 sq ft/hen indoors) came in BELOW the cage-free minimum, closer
// to a dense indoor barn than an open-pasture shot. cage-free.jpg is the
// accurate middle: legally correct (no cages) and honest about what the
// real numbers actually look like, not the more generous free-range scene.
const TIER_IMAGES = {
  conventional: require('../../assets/sourcing/eggs/caged.jpg'),
  organic: require('../../assets/sourcing/eggs/cage-free.jpg'),
  'cage-free': require('../../assets/sourcing/eggs/cage-free.jpg'),
  'free-range': require('../../assets/sourcing/eggs/free-range.jpg'),
  'pasture-raised': require('../../assets/sourcing/eggs/pasture-raised.jpg'),
};

/**
 * Product-level "how was this specific carton raised" card. Supersedes the
 * COMPANY-level Sourcing tab (CompanyProfileScreen.js / SourcingSection.js)
 * as the primary surface for this data — that tab still exists, but only as
 * a "see the full record" link from here (footer of this card, when we have
 * a resolved company to link to).
 *
 * PRODUCT-based, not company-based: the tier (badge + photo + space figure)
 * is read entirely off product.name via sourcingMatch.js, and renders
 * whenever the product is in the Eggs category — with or without a
 * resolved company, with or without company-level `sourcing` research. This
 * is what makes it work for every catalog egg (not just the ~15 companies
 * the pilot happened to research) and for an unrecognized scanned egg with
 * no catalog/company record at all. `company.sourcing` is an OPTIONAL
 * enhancement layered on top (a real per-brand scorecard figure, third-party
 * certification chips) — never a requirement to show anything.
 *
 * Pro-gating is handled by the caller (ProductScoreScreen.js), matching that
 * screen's own ProGateCard convention rather than CompanyProfileScreen.js's
 * LockedTeaser — this component only renders once the caller has already
 * decided to show it.
 */
export default function LivingConditionsCard({ product, company, navigation }) {
  // Narrow, intentional gate: only the eggs module has tier photos/copy so
  // far, and a plant-based egg substitute (e.g. JUST Egg) has no hens at
  // all — see isEggsHousingEligible().
  if (!isEggsHousingEligible(product)) return null;

  const tier = detectHousingTier(product?.name);
  const { housingLabel, scorecard, certifications, genericStandard } = matchSourcingToProduct(
    company?.sourcing?.industry === 'eggs' ? company.sourcing : null,
    tier,
    product?.name
  );
  const image = TIER_IMAGES[tier] || TIER_IMAGES.conventional;

  // Prefer a real, per-brand verified figure (a Cornucopia-style scorecard
  // entry scoped to this exact line) over the generic tier definition —
  // more specific and independently scored beats a certifier's general
  // minimum. Fall back to the generic standard so every tier still shows
  // something rather than nothing.
  //
  // A bare per-brand number ("1.2 sq ft indoors") has no reference point on
  // its own — pair it with the generic baseline for that tier so the reader
  // can judge it themselves. Always shown alongside a per-brand figure when
  // one exists, whether the brand clears the baseline or falls short of it
  // — never rendered selectively only when a brand looks bad.
  const spaceInfo = scorecard?.spacePerAnimal
    ? {
        label: 'Certified standard',
        spacePerAnimal: scorecard.spacePerAnimal,
        sourceName: scorecard.name,
        url: scorecard.url,
        baseline: getComparisonBaseline(tier),
      }
    : genericStandard
      ? { label: `What "${housingLabel}" means`, spacePerAnimal: genericStandard.spacePerAnimal, sourceName: genericStandard.name, url: genericStandard.url, baseline: null }
      : null;

  const openSpaceSource = () => {
    if (spaceInfo?.url) Linking.openURL(spaceInfo.url).catch(() => {});
  };

  return (
    <View style={s.wrap}>
      <Text style={s.header}>How This Was Raised</Text>

      <View style={s.badge}>
        <Text style={s.badgeText}>{housingLabel}</Text>
      </View>

      <Image source={image} style={s.photo} resizeMode="cover" />
      <Text style={s.caption}>This animal lived in conditions similar to this.</Text>

      {spaceInfo && (
        <TouchableOpacity
          style={s.spaceRow}
          activeOpacity={spaceInfo.url ? 0.75 : 1}
          disabled={!spaceInfo.url}
          onPress={openSpaceSource}
        >
          <Ionicons name="resize-outline" size={16} color={Colors.primaryDark} />
          <View style={s.spaceTextWrap}>
            <Text style={s.spaceText}>{spaceInfo.label}: {spaceInfo.spacePerAnimal}</Text>
            <Text style={s.spaceSource}>
              {spaceInfo.sourceName}
              {spaceInfo.url ? ' · Tap to view source' : ''}
            </Text>
            {spaceInfo.baseline && (
              <Text style={s.spaceCompare}>
                For comparison — {spaceInfo.baseline.name}: {spaceInfo.baseline.spacePerAnimal}
                {spaceInfo.baseline.note ? ` (${spaceInfo.baseline.note})` : ''}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}

      {certifications.length > 0 && (
        <View style={s.certRow}>
          {certifications.map((cert, i) => (
            <View key={i} style={s.certChip}>
              <Ionicons name="ribbon-outline" size={12} color={Colors.primary} />
              <Text style={s.certChipText}>{cert.name}</Text>
            </View>
          ))}
        </View>
      )}

      {company && (
        <TouchableOpacity
          style={s.footerLink}
          activeOpacity={0.75}
          onPress={() => navigation.navigate('CompanyProfile', { company, initialTab: 'sourcing' })}
        >
          <Text style={s.footerLinkText}>See the full sourcing record for {company.name} →</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginHorizontal: 16, marginTop: 10, marginBottom: 4,
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: '#EDF2F0',
  },
  header: { fontSize: Font.sizes.base, fontWeight: Font.weights.bold, color: Colors.textPrimary, marginBottom: 10 },

  // Neutral factual pill — not red/alarming. Same visual pattern as
  // SourcingSection.js's housingBadge (this card is the primary surface
  // that pattern now serves).
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
  },
  badgeText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold, color: Colors.primaryDark },

  photo: { width: '100%', height: 170, borderRadius: 12, backgroundColor: Colors.border },
  // Bold, prominent per the founder's exact hedged wording — not fine print.
  caption: {
    fontSize: Font.sizes.base,
    fontWeight: Font.weights.bold,
    color: Colors.textPrimary,
    marginTop: 10,
    lineHeight: 21,
  },

  spaceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.primaryLight, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
    marginTop: 14,
  },
  spaceTextWrap: { flex: 1 },
  spaceText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.bold, color: Colors.primaryDark },
  spaceSource: { fontSize: Font.sizes.xs, color: Colors.textMuted, fontStyle: 'italic', marginTop: 3 },
  // Neutral, not red/alarming — same treatment whether the brand's real
  // figure clears this baseline or falls short of it (symmetric fairness).
  spaceCompare: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 6, lineHeight: 16 },

  certRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  certChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.successLight, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  certChipText: { fontSize: Font.sizes.xs, fontWeight: Font.weights.semibold, color: Colors.primaryDark },

  footerLink: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    marginTop: 16, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#F0F5F2',
  },
  footerLinkText: { fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.primary },
});
