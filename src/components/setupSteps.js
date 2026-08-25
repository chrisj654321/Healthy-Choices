// Shared allergen / dietary / store selection UI — originally built inside
// OnboardingScreen, extracted here (Part B9) so removing those steps from
// onboarding doesn't orphan them. Both OnboardingScreen (GoalStep,
// ChallengeStep — SelectStep only) and ProfileSetupScreen (the full set,
// post-first-scan) import from this single source.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { STORES } from '../data/stores';
import { StoreLogo } from '../screens/ProfileScreen';

const { width: SCREEN_W } = Dimensions.get('window');

export const ALLERGEN_OPTIONS = [
  { id: 'peanuts',   label: 'Peanuts',        icon: 'alert-circle-outline' },
  { id: 'tree nuts', label: 'Tree Nuts',       icon: 'alert-circle-outline' },
  { id: 'milk',      label: 'Dairy / Milk',    icon: 'alert-circle-outline' },
  { id: 'eggs',      label: 'Eggs',            icon: 'alert-circle-outline' },
  { id: 'wheat',     label: 'Wheat / Gluten',  icon: 'alert-circle-outline' },
  { id: 'soy',       label: 'Soy',             icon: 'alert-circle-outline' },
  { id: 'fish',      label: 'Fish',            icon: 'alert-circle-outline' },
  { id: 'shellfish', label: 'Shellfish',        icon: 'alert-circle-outline' },
];

export const DIETARY_OPTIONS = [
  { id: 'vegan',        label: 'Vegan',          icon: 'leaf-outline' },
  { id: 'vegetarian',   label: 'Vegetarian',     icon: 'flower-outline' },
  { id: 'gluten-free',  label: 'Gluten-Free',    icon: 'ban-outline' },
  { id: 'dairy-free',   label: 'Dairy-Free',     icon: 'water-outline' },
  { id: 'keto',         label: 'Keto',           icon: 'fitness-outline' },
  { id: 'paleo',        label: 'Paleo',          icon: 'nutrition-outline' },
  { id: 'low-sugar',    label: 'Low Sugar',      icon: 'trending-down-outline' },
  { id: 'organic-only', label: 'Organic Only',   icon: 'earth-outline' },
  // Phase 3 (2026-08-25, founder-locked): a neutral disclosure preference,
  // NOT a health-danger flag — turning this on only surfaces a heads-up card
  // (ProductScoreScreen's personalised warnings) when a scanned product
  // carries a USDA bioengineered-food disclosure. It never changes the score.
  { id: 'avoid-bioengineered', label: 'Avoid Bioengineered (GMO)', icon: 'flask-outline' },
];

// ─── SelectStep (allergens / dietary / goal / challenge) ───────────────────────

export function SelectStep({ title, subtitle, options, selected, onToggle, single = false, noneLabel, onNone }) {
  const noneActive = noneLabel && selected.length === 0;
  return (
    <View style={ss.wrap}>
      <Text style={ss.title}>{title}</Text>
      <Text style={ss.sub}>{subtitle}</Text>
      <View style={ss.grid}>
        {noneLabel && (
          <TouchableOpacity
            style={[ss.chip, ss.chipFull, noneActive && ss.chipActive]}
            onPress={onNone}
            activeOpacity={0.75}
          >
            <Ionicons name="checkmark-circle-outline" size={14} color={noneActive ? '#fff' : Colors.primary} />
            <Text style={[ss.chipText, noneActive && ss.chipTextActive]}>{noneLabel}</Text>
          </TouchableOpacity>
        )}
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <TouchableOpacity
              key={opt.id}
              style={[ss.chip, active && ss.chipActive, single && ss.chipFull]}
              onPress={() => onToggle(opt.id)}
              activeOpacity={0.75}
            >
              {opt.icon && (
                <Ionicons name={opt.icon} size={14} color={active ? '#fff' : Colors.primary} />
              )}
              <Text style={[ss.chipText, active && ss.chipTextActive]}>{opt.label}</Text>
              {active && <Ionicons name="checkmark" size={13} color="#fff" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const ss = StyleSheet.create({
  wrap:          { paddingBottom: 16 },
  title:         { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8, lineHeight: 33 },
  sub:           { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 24 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip:          {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 22, borderWidth: 1.5, borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  chipActive:    { backgroundColor: Colors.primary },
  chipFull:      { width: '100%' },
  chipText:      { fontSize: 14, fontWeight: '600', color: Colors.primary },
  chipTextActive:{ color: '#fff' },
});

// ─── StoresStep (favorite stores) ───────────────────────────────────────────────

export function StoresStep({ selected, onToggle }) {
  return (
    <View style={st.wrap}>
      <Text style={st.title}>Where do you shop?</Text>
      <Text style={st.sub}>Pick your favorite stores — we'll tailor shopping guides around them.</Text>
      <View style={st.grid}>
        {STORES.map((item) => {
          const active = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[st.card, active && st.cardActive]}
              onPress={() => onToggle(item.id)}
              activeOpacity={0.75}
            >
              <StoreLogo storeId={item.id} label={item.label} size={38} />
              <Text style={[st.cardLabel, active && st.cardLabelActive]} numberOfLines={1}>
                {item.label}
              </Text>
              {active && (
                <View style={st.check}>
                  <Ionicons name="checkmark" size={11} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap:          { paddingBottom: 16 },
  title:         { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8, lineHeight: 33 },
  sub:           { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 24 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card:          {
    width: (SCREEN_W - 48 - 20) / 3,
    alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 12, paddingHorizontal: 6,
    borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  cardActive:    { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  cardLabel:     { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  cardLabelActive: { color: Colors.primary },
  check:         {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
});
