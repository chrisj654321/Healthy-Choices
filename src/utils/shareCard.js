/**
 * Pure data-mapping logic for the social share card (src/components/ShareCard.js).
 *
 * Kept separate from the component on purpose: this project has no working
 * React Native component-render test setup (see
 * src/__tests__/noLetterGradeInUI.test.js's header comment — react-test-renderer
 * errors out under the current jest-expo config), so the only way to unit-test
 * the share card's behavior is to test the plain-JS shaping logic that feeds
 * it, not the JSX. The actual view-to-image capture (react-native-view-shot)
 * cannot be unit-tested here either way — that's a native module.
 */
import { scoreToVerdict, formatCurrency } from './scorer';

// Locked 3-band color scheme for the share card score ring, per the approved
// design: red <55, amber 55-79, green 80+. This is intentionally NOT the same
// as scoreToColor() in scorer.js (a 5-band scheme used everywhere else in the
// app) — the share card design spec calls for exactly 3 bands.
export const SHARE_CARD_COLORS = {
  red: '#D93B3B',
  amber: '#F5A623',
  green: '#1D9E75',
  muted: '#9BB5AE',
};

// Same severity palette as LobbyingFlagCard.js's SEVERITY_MAP, reused here so
// the share card's colors match the rest of the app rather than inventing a
// new palette for one screen.
const SEVERITY_COLOR = {
  high: '#D93B3B',
  medium: '#F06A25',
  low: '#F5C842',
};

const FLAG_COLOR_FALLBACK = '#B8C8C3'; // matches IngredientRow.js's UNKNOWN_COLOR

// Same ranking IngredientRow/ProductScoreScreen use to sort avoid before
// caution before moderate before ok/allergen.
const CHIP_FLAG_RANK = { avoid: 0, caution: 1, moderate: 2, ok: 3, allergen: 3 };
const SEVERITY_RANK = { high: 0, medium: 1, low: 2 };

export function getShareCardScoreColor(score, insufficientData = false) {
  if (insufficientData || score == null || Number.isNaN(score)) return SHARE_CARD_COLORS.muted;
  if (score < 55) return SHARE_CARD_COLORS.red;
  if (score < 80) return SHARE_CARD_COLORS.amber;
  return SHARE_CARD_COLORS.green;
}

function truncate(text, maxLen) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trimEnd()}…`;
}

// "What's in it" chips — up to `limit`, avoid/caution ones first (see
// CHIP_FLAG_RANK), pulled from the scan's already-analyzed ingredients so
// this never re-runs ingredient analysis.
export function pickIngredientChips(analyzedIngredients = [], limit = 3) {
  return [...analyzedIngredients]
    .filter((item) => item && item.label)
    .sort((a, b) => {
      const rank = (x) => CHIP_FLAG_RANK[x.flag] ?? 3;
      return rank(a) - rank(b);
    })
    .slice(0, limit)
    .map((item) => ({
      label: item.label,
      color: item.flagInfo?.color || FLAG_COLOR_FALLBACK,
    }));
}

// "On record" — top `limit` company issues by severity (high -> medium ->
// low), each with a short description for the compact card layout.
export function pickTopIssues(issues = [], limit = 3) {
  return [...issues]
    .filter((issue) => issue && issue.title)
    .sort((a, b) => (SEVERITY_RANK[a.severity] ?? 3) - (SEVERITY_RANK[b.severity] ?? 3))
    .slice(0, limit)
    .map((issue) => ({
      title: issue.title,
      description: truncate(issue.description, 110),
      severity: issue.severity,
      color: SEVERITY_COLOR[issue.severity] || SHARE_CARD_COLORS.muted,
    }));
}

// "Where the money goes" — lobbying spend of 0 is this dataset's
// "unresearched" sentinel, not a verified zero (see getLobbyingRiskLevel in
// scorer.js and the matching `> 0` gate in CompanyProfileScreen.js /
// ProductScoreScreen.js), so it is treated the same as missing here.
// donationSplit must also actually exist — otherwise a bare politicalDonations
// figure with no split data would have nothing to draw the bar from.
export function buildMoneyTrail(company) {
  const hasLobbying = !!(company && company.lobbyingSpend > 0);
  const hasDonations = !!(company && company.politicalDonations > 0 && company.donationSplit != null);

  return {
    hasLobbying,
    lobbyingSpendLabel: hasLobbying ? formatCurrency(company.lobbyingSpend) : null,
    lobbyingTargets: hasLobbying ? (company.lobbyingTargets || []).slice(0, 2) : [],
    hasDonations,
    donationsLabel: hasDonations ? formatCurrency(company.politicalDonations) : null,
    repPct: hasDonations ? company.donationSplit.republican : null,
    demPct: hasDonations ? company.donationSplit.democrat : null,
    isEmpty: !hasLobbying && !hasDonations,
  };
}

// Full data shape the ShareCard component renders from. Never throws on
// missing product/result/company — every field degrades to a safe empty
// state instead (unresolved companies, insufficient-data scans, and
// clean/no-issue companies are all real, common cases here, not edge cases).
export function buildShareCardData({ product, result, company } = {}) {
  const insufficientData = !!result?.insufficientData;
  const score = insufficientData ? null : result?.score;
  const displayGrade = result?.displayGrade ?? result?.grade ?? '?';
  const scoreColor = getShareCardScoreColor(score, insufficientData);
  const verdictLabel = (scoreToVerdict(displayGrade) || 'Unknown').toUpperCase();

  const issues = pickTopIssues(company?.issues);
  const money = buildMoneyTrail(company);

  return {
    productName: product?.name || 'Unknown product',
    metaLine: product?.servingSize || null,
    // "None on record" is the same graceful-empty treatment used for money
    // trail / issues below — an unresolved company is functionally the same
    // "nothing to show here" state as a resolved company with no lobbying or
    // issue history.
    parentCompanyLabel: company?.name || null,
    logo: company?.logo || null,
    score,
    scoreLabel: insufficientData || score == null ? '—' : String(score),
    scoreColor,
    verdictLabel,
    insufficientData,
    chips: pickIngredientChips(result?.analyzedIngredients),
    money,
    issues,
    issuesEmpty: issues.length === 0,
  };
}
