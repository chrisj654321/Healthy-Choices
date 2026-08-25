/**
 * paywallContent.js
 * Remote-editable PAYWALL COPY, validated field-by-field against in-code
 * defaults — see context/plan-decouple-from-apple.md, Phase 1.
 *
 * The founder edits `offering.metadata` (arbitrary JSON, hand-typed into the
 * RevenueCat dashboard) to change headline/subhead per trigger, the feature
 * list, the yearly badge, and the CTA labels — with NO app build and NO OTA
 * update. What is deliberately NOT here: price rendering, price hierarchy,
 * trial disclosure fine print, and the legal links. Those stay hardcoded in
 * PaywallContent.js so a dashboard copy edit can never re-break the Apple
 * 3.1.2(c) price-prominence fix (commit 4c0d817).
 *
 * Contract: `getPaywallContent()` NEVER throws and NEVER returns a partially
 * blank shape. Every field is validated independently and falls back to its
 * own in-code default — a typo in one headline must never blank the rest of
 * the paywall. `getPaywallContent(null)` (no offering / no metadata, i.e.
 * today's behavior) returns exactly the in-code defaults.
 *
 * ── Dashboard JSON shape (RevenueCat → Offerings → your offering → Metadata) ──
 * All keys optional. Any missing/invalid key silently falls back to its
 * current in-app default; unknown keys are ignored.
 *
 * {
 *   "headlines": {
 *     "company":      { "title": "See who funds\nyour food.",       "sub": "Company transparency is a Premium feature." },
 *     "search":       { "title": "Find any\nproduct instantly.",    "sub": "Product search is a Premium feature." },
 *     "history":      { "title": "Your complete\nscan history.",    "sub": "Full history is a Premium feature." },
 *     "alternatives": { "title": "See every\ncleaner option.",      "sub": "Full better-picks lists are a Premium feature." },
 *     "default":      { "title": "Know everything\nabout your food.", "sub": "Everything you need to eat better." }
 *   },
 *   "features": [
 *     { "icon": "business-outline", "colorKey": "primary",    "text": "Company lobbying & donation data" },
 *     { "icon": "search-outline",   "colorKey": "primary",    "text": "Search any product by name" },
 *     { "icon": "time-outline",     "colorKey": "primary",    "text": "Unlimited scan history" },
 *     { "icon": "warning-outline",  "colorKey": "flagOrange", "text": "Priority ingredient alerts" }
 *   ],
 *   "yearlyBadge": "3-DAY FREE TRIAL",
 *   "ctaLabels": {
 *     "yearly": "Start Free Trial",
 *     "monthly": "Unlock Premium Now"
 *   }
 * }
 *
 * `icon` must be one of ICON_ALLOWLIST below (an Ionicons glyph name) — an
 * unrecognized name falls back to a default icon rather than crashing
 * Ionicons. `colorKey` must be one of COLOR_KEY_MAP's keys below (a name for
 * an in-code Colors.* value) — dashboard JSON can never inject an arbitrary
 * CSS color string, only pick among a fixed, reviewed palette. Use `\n` in a
 * headline `title` for an explicit line break, same as the in-code defaults.
 * `features` is capped at MAX_FEATURES rows; extra rows are ignored, not
 * truncating mid-row. Strings over their max length fall back to default
 * rather than being truncated (a cut-off sentence reads worse than the old
 * copy).
 */

import { Colors } from '../constants/colors';

// ─── Limits ─────────────────────────────────────────────────────────────────

const MAX_FEATURES = 8;
const MAX_HEADLINE_TITLE_LEN = 80;
const MAX_HEADLINE_SUB_LEN = 160;
const MAX_FEATURE_TEXT_LEN = 100;
const MAX_BADGE_LEN = 40;
const MAX_CTA_LEN = 40;

// ─── Allowlists ─────────────────────────────────────────────────────────────
// Icon allowlist: known-safe Ionicons glyph names. An unrecognized name
// (typo, deprecated glyph, garbage) falls back to DEFAULT_ICON rather than
// being passed straight to <Ionicons name=...> where it would render a
// broken-glyph box or, on some platforms, throw.
const ICON_ALLOWLIST = new Set([
  'business-outline', 'search-outline', 'time-outline', 'warning-outline',
  'checkmark-circle', 'checkmark-circle-outline', 'shield-checkmark-outline',
  'star-outline', 'heart-outline', 'flag-outline', 'leaf-outline',
  'nutrition-outline', 'list-outline', 'lock-open-outline', 'eye-outline',
  'alert-circle-outline', 'trending-up-outline', 'people-outline',
  'ribbon-outline', 'bulb-outline', 'stats-chart-outline', 'lock-closed-outline',
]);
const DEFAULT_ICON = 'checkmark-circle-outline';

// Color-key allowlist: dashboard JSON picks a NAME, never a raw color value.
// This is the fixed, reviewed palette a feature-row icon can use.
const COLOR_KEY_MAP = {
  primary: Colors.primary,
  primaryDark: Colors.primaryDark,
  flagOrange: Colors.flagOrange,
  flagRed: Colors.flagRed,
  flagYellow: Colors.flagYellow,
  textSecondary: Colors.textSecondary,
};
const DEFAULT_COLOR_KEY = 'primary';

const HEADLINE_KEYS = ['company', 'search', 'history', 'alternatives', 'default'];

// ─── In-code defaults ───────────────────────────────────────────────────────
// These are byte-identical to what PaywallContent.js hardcoded before this
// module existed — no metadata / unreachable RC must render exactly as today.

export const DEFAULT_HEADLINES = {
  company:      { title: 'See who funds\nyour food.',         sub: 'Company transparency is a Premium feature.' },
  search:       { title: 'Find any\nproduct instantly.',      sub: 'Product search is a Premium feature.' },
  history:      { title: 'Your complete\nscan history.',      sub: 'Full history is a Premium feature.' },
  alternatives: { title: 'See every\ncleaner option.',        sub: 'Full better-picks lists are a Premium feature.' },
  default:      { title: 'Know everything\nabout your food.', sub: 'Everything you need to eat better.' },
};

export const DEFAULT_FEATURES = [
  { icon: 'business-outline', colorKey: 'primary',    text: 'Company lobbying & donation data' },
  { icon: 'search-outline',   colorKey: 'primary',    text: 'Search any product by name' },
  { icon: 'time-outline',     colorKey: 'primary',    text: 'Unlimited scan history' },
  { icon: 'warning-outline',  colorKey: 'flagOrange', text: 'Priority ingredient alerts' },
];

export const DEFAULT_YEARLY_BADGE = '3-DAY FREE TRIAL';

export const DEFAULT_CTA_LABELS = {
  yearly: 'Start Free Trial',
  monthly: 'Unlock Premium Now',
};

// ─── Field-level validators ─────────────────────────────────────────────────

function isNonEmptyString(v, maxLen) {
  return typeof v === 'string' && v.length > 0 && v.trim().length > 0 && v.length <= maxLen;
}

function validHeadlineEntry(entry, fallback) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return fallback;
  return {
    title: isNonEmptyString(entry.title, MAX_HEADLINE_TITLE_LEN) ? entry.title : fallback.title,
    sub:   isNonEmptyString(entry.sub, MAX_HEADLINE_SUB_LEN)     ? entry.sub   : fallback.sub,
  };
}

function validHeadlines(raw) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const result = {};
  for (const key of HEADLINE_KEYS) {
    result[key] = validHeadlineEntry(source[key], DEFAULT_HEADLINES[key]);
  }
  return result;
}

function validFeatureRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
  const text = isNonEmptyString(row.text, MAX_FEATURE_TEXT_LEN) ? row.text : null;
  if (!text) return null; // a row with no usable text isn't worth rendering
  const icon = typeof row.icon === 'string' && ICON_ALLOWLIST.has(row.icon) ? row.icon : DEFAULT_ICON;
  const colorKey = typeof row.colorKey === 'string' && Object.prototype.hasOwnProperty.call(COLOR_KEY_MAP, row.colorKey)
    ? row.colorKey
    : DEFAULT_COLOR_KEY;
  return { icon, colorKey, text };
}

function validFeatures(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_FEATURES;
  const rows = raw.slice(0, MAX_FEATURES).map(validFeatureRow).filter(Boolean);
  return rows.length > 0 ? rows : DEFAULT_FEATURES;
}

function validBadgeText(raw) {
  return isNonEmptyString(raw, MAX_BADGE_LEN) ? raw : DEFAULT_YEARLY_BADGE;
}

function validCtaLabels(raw) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  return {
    yearly:  isNonEmptyString(source.yearly, MAX_CTA_LEN)  ? source.yearly  : DEFAULT_CTA_LABELS.yearly,
    monthly: isNonEmptyString(source.monthly, MAX_CTA_LEN) ? source.monthly : DEFAULT_CTA_LABELS.monthly,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Merge an RC Offering's `metadata` over the in-code defaults, validating
 * every field independently. Accepts an Offering, a bare metadata object, or
 * null/undefined — never throws, never returns a partial/blank shape.
 */
export function getPaywallContent(offeringOrMetadata) {
  try {
    const metadata = offeringOrMetadata && typeof offeringOrMetadata === 'object'
      ? (offeringOrMetadata.metadata ?? offeringOrMetadata)
      : null;
    const source = metadata && typeof metadata === 'object' && !Array.isArray(metadata) ? metadata : {};
    return {
      headlines:   validHeadlines(source.headlines),
      features:    validFeatures(source.features),
      yearlyBadge: validBadgeText(source.yearlyBadge),
      ctaLabels:   validCtaLabels(source.ctaLabels),
    };
  } catch {
    // Belt-and-suspenders: any unforeseen shape (a throwing getter, etc.)
    // still resolves to the exact in-code defaults, never a blank paywall.
    return {
      headlines:   validHeadlines(undefined),
      features:    DEFAULT_FEATURES,
      yearlyBadge: DEFAULT_YEARLY_BADGE,
      ctaLabels:   DEFAULT_CTA_LABELS,
    };
  }
}

/** Resolve a validated colorKey to its real Colors.* value. */
export function resolveFeatureColor(colorKey) {
  return COLOR_KEY_MAP[colorKey] ?? COLOR_KEY_MAP[DEFAULT_COLOR_KEY];
}

/** Look up the headline/sub for a trigger feature, falling back to 'default'. */
export function headlineFor(content, feature) {
  const key = feature && content?.headlines?.[feature] ? feature : 'default';
  return content?.headlines?.[key] ?? DEFAULT_HEADLINES.default;
}
