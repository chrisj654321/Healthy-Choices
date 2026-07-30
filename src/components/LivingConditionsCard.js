import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { detectHousingTier, matchSourcingToProduct } from '../utils/sourcingMatch';

// Static requires — RN's bundler needs these resolved at build time, not
// from a dynamic path string. Keyed by the DETECTED tier (see
// sourcingMatch.js), never by company.sourcing.welfare.housing (that field
// is a deliberately company-wide "worst system" value, not this SKU's).
//
// No specific housing claim on the carton (plain "conventional") defaults
// to caged.jpg — the pilot's own research anchored that finding for the
// companies in this dataset. 'organic' is deliberately NOT the same
// default: USDA organic rules require outdoor access, so a caged/battery
// photo would depict a system organic certification legally prohibits —
// showing it would be a factual error, not just an imprecise stand-in.
// free-range.jpg is the closer (if imperfect) generic image for "organic,
// no further housing claim on this carton" — organic access requirements
// are closer in kind to free-range than to pasture-scale or caged.
const TIER_IMAGES = {
  conventional: require('../../assets/sourcing/eggs/caged.jpg'),
  organic: require('../../assets/sourcing/eggs/free-range.jpg'),
  'cage-free': require('../../assets/sourcing/eggs/cage-free.jpg'),
  'free-range': require('../../assets/sourcing/eggs/free-range.jpg'),
  'pasture-raised': require('../../assets/sourcing/eggs/pasture-raised.jpg'),
};

/**
 * Product-level "how was this specific carton raised" card. Supersedes the
 * COMPANY-level Sourcing tab (CompanyProfileScreen.js / SourcingSection.js)
 * as the primary surface for this data — that tab still exists, but only as
 * a "see the full record" link from here (footer of this card).
 *
 * Scoped to the actual SKU the user is holding via product.name (see
 * src/utils/sourcingMatch.js) because most brands sell eggs across multiple
 * housing tiers under one name — showing a company-wide or wrong-tier value
 * next to the wrong carton is the exact failure mode this card exists to
 * prevent.
 *
 * Pro-gating is handled by the caller (ProductScoreScreen.js), matching that
 * screen's own ProGateCard convention rather than CompanyProfileScreen.js's
 * LockedTeaser — this component only renders once the caller has already
 * decided to show it.
 */
export default function LivingConditionsCard({ product, company, navigation }) {
  if (!company?.sourcing) return null;
  // Narrow, intentional gate: only the eggs module has data so far. A
  // non-eggs sourcing record (dairy, meat-poultry, ...) has no matching UI
  // (no tier photos, no caption behavior) yet, so it renders nothing rather
  // than guessing.
  if (company.sourcing.industry !== 'eggs' || product?.category !== 'Eggs') return null;

  const tier = detectHousingTier(product?.name);
  const { housingLabel, scorecard, certifications } = matchSourcingToProduct(
    company.sourcing,
    tier,
    product?.name
  );
  const image = TIER_IMAGES[tier] || TIER_IMAGES.conventional;

  const openScorecardSource = () => {
    if (scorecard?.url) Linking.openURL(scorecard.url).catch(() => {});
  };

  return (
    <View style={s.wrap}>
      <Text style={s.header}>How This Was Raised</Text>

      <View style={s.badge}>
        <Text style={s.badgeText}>{housingLabel}</Text>
      </View>

      <Image source={image} style={s.photo} resizeMode="cover" />
      <Text style={s.caption}>This animal lived in conditions similar to this.</Text>

      {scorecard?.spacePerAnimal && (
        <TouchableOpacity
          style={s.spaceRow}
          activeOpacity={scorecard.url ? 0.75 : 1}
          disabled={!scorecard.url}
          onPress={openScorecardSource}
        >
          <Ionicons name="resize-outline" size={16} color={Colors.primaryDark} />
          <View style={s.spaceTextWrap}>
            <Text style={s.spaceText}>Certified standard: {scorecard.spacePerAnimal}</Text>
            <Text style={s.spaceSource}>
              {scorecard.name}
              {scorecard.url ? ' · Tap to view source' : ''}
            </Text>
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

      <TouchableOpacity
        style={s.footerLink}
        activeOpacity={0.75}
        onPress={() => navigation.navigate('CompanyProfile', { company, initialTab: 'sourcing' })}
      >
        <Text style={s.footerLinkText}>See the full sourcing record for {company.name} →</Text>
        <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
      </TouchableOpacity>
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
