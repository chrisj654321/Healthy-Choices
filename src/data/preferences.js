export const DIET_PREFERENCE_OPTIONS = [
  { value: 'high-protein', label: 'High Protein' },
  { value: 'whole-unprocessed', label: 'Whole & Unprocessed' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'gluten-free', label: 'Gluten Free' },
  { value: 'low-carb', label: 'Low Carb' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'calorie-counting', label: 'Calorie Counting' },
  { value: 'mindful-eating', label: 'Mindful Eating' },
  { value: 'intermittent-fasting', label: 'Intermittent Fasting' },
  { value: 'flexitarian', label: 'Flexitarian' },
];

// Replaces the old nutrient-target list (2026-07-19) — these read as real
// life goals instead of diet-app jargon. `scorer.js`'s GOAL_NOTE_MAP is still
// keyed by the OLD ids below; it safely no-ops (returns null, never throws)
// for any of these new ids since it looks the id up with `?? null`. Rewiring
// per-goal score notes to the new ids is tracked as follow-up work, not a
// blocker for shipping the new option list.
export const PRIMARY_GOAL_OPTIONS = [
  { value: 'weight-loss', label: 'Losing weight' },
  { value: 'more-energy', label: 'Having more energy' },
  { value: 'managing-health-concerns', label: 'Managing a health concern' },
  { value: 'fitness-performance', label: 'Improving fitness, strength, or sports performance' },
  { value: 'inflammation-skin', label: 'Reducing inflammation, bloating, or skin breakouts' },
  { value: 'family-health', label: 'Pregnancy, fertility, or family health goals' },
  { value: 'learn-ingredients', label: 'Learning about ingredients & ultra-processed foods' },
  { value: 'long-term-habits', label: 'Building long-term healthy habits' },
  { value: 'money-values', label: 'Knowing what my money supports' },
];
