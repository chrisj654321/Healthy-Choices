/**
 * Tests for src/utils/shareCard.js — the data-mapping logic behind the
 * social share card (src/components/ShareCard.js). This covers the pure
 * shaping logic only (score-band colors, top-3 issue selection, ingredient
 * chip picking, money-trail / empty-state fallbacks). The actual view-to-
 * image capture (react-native-view-shot's captureRef) is a native module and
 * cannot be unit-tested here — that path is only exercised by a real device
 * build (see Hadrian's build report).
 */
import {
  getShareCardScoreColor,
  pickIngredientChips,
  pickTopIssues,
  buildMoneyTrail,
  buildShareCardData,
  SHARE_CARD_COLORS,
} from '../shareCard';

// ─── getShareCardScoreColor ─────────────────────────────────────────────────

describe('getShareCardScoreColor', () => {
  test('red below 55', () => {
    expect(getShareCardScoreColor(0)).toBe(SHARE_CARD_COLORS.red);
    expect(getShareCardScoreColor(54)).toBe(SHARE_CARD_COLORS.red);
  });

  test('amber from 55 up to 79', () => {
    expect(getShareCardScoreColor(55)).toBe(SHARE_CARD_COLORS.amber);
    expect(getShareCardScoreColor(79)).toBe(SHARE_CARD_COLORS.amber);
  });

  test('green at 80 and above', () => {
    expect(getShareCardScoreColor(80)).toBe(SHARE_CARD_COLORS.green);
    expect(getShareCardScoreColor(100)).toBe(SHARE_CARD_COLORS.green);
  });

  test('muted when insufficientData or score missing', () => {
    expect(getShareCardScoreColor(90, true)).toBe(SHARE_CARD_COLORS.muted);
    expect(getShareCardScoreColor(null)).toBe(SHARE_CARD_COLORS.muted);
    expect(getShareCardScoreColor(undefined)).toBe(SHARE_CARD_COLORS.muted);
    expect(getShareCardScoreColor(NaN)).toBe(SHARE_CARD_COLORS.muted);
  });
});

// ─── pickIngredientChips ─────────────────────────────────────────────────

function ing(label, flag, color) {
  return { label, flag, flagInfo: color ? { color } : undefined };
}

describe('pickIngredientChips', () => {
  test('avoid ones sort before caution, moderate, and ok', () => {
    const items = [
      ing('Sugar', 'ok', '#1D9E75'),
      ing('Red 40', 'avoid', '#D93B3B'),
      ing('Sodium Nitrite', 'caution', '#F5A623'),
      ing('Palm Oil', 'moderate', '#F5C842'),
    ];
    const chips = pickIngredientChips(items, 3);
    expect(chips.map((c) => c.label)).toEqual(['Red 40', 'Sodium Nitrite', 'Palm Oil']);
  });

  test('caps at the given limit even when more flagged ingredients exist', () => {
    const items = [
      ing('A', 'avoid'), ing('B', 'avoid'), ing('C', 'avoid'), ing('D', 'avoid'),
    ];
    expect(pickIngredientChips(items, 3)).toHaveLength(3);
  });

  test('falls back to a default color when flagInfo is missing (unknown ingredient)', () => {
    const chips = pickIngredientChips([ing('Mystery Additive', 'avoid', null)]);
    expect(chips[0].color).toBe('#B8C8C3');
  });

  test('returns an empty array for an empty or missing ingredient list', () => {
    expect(pickIngredientChips([])).toEqual([]);
    expect(pickIngredientChips(undefined)).toEqual([]);
  });

  test('ignores malformed entries without a label', () => {
    const items = [{ flag: 'avoid' }, ing('Real One', 'avoid')];
    expect(pickIngredientChips(items)).toHaveLength(1);
  });
});

// ─── pickTopIssues ─────────────────────────────────────────────────────────

function issue(title, severity, description = 'desc') {
  return { title, severity, description };
}

describe('pickTopIssues', () => {
  test('sorts high severity before medium before low', () => {
    const issues = [
      issue('Low thing', 'low'),
      issue('High thing', 'high'),
      issue('Medium thing', 'medium'),
    ];
    const top = pickTopIssues(issues, 3);
    expect(top.map((i) => i.title)).toEqual(['High thing', 'Medium thing', 'Low thing']);
  });

  test('keeps only the top 3 when more issues exist', () => {
    const issues = [
      issue('High 1', 'high'), issue('High 2', 'high'),
      issue('Medium 1', 'medium'), issue('Low 1', 'low'),
    ];
    const top = pickTopIssues(issues, 3);
    expect(top).toHaveLength(3);
    expect(top.map((i) => i.title)).toEqual(['High 1', 'High 2', 'Medium 1']);
  });

  test('truncates long descriptions and appends an ellipsis', () => {
    const longDesc = 'x'.repeat(200);
    const top = pickTopIssues([issue('Big issue', 'high', longDesc)]);
    expect(top[0].description.length).toBeLessThanOrEqual(110);
    expect(top[0].description.endsWith('…')).toBe(true);
  });

  test('leaves short descriptions untouched', () => {
    const top = pickTopIssues([issue('Short issue', 'high', 'A short description.')]);
    expect(top[0].description).toBe('A short description.');
  });

  test('returns an empty array when there are no issues', () => {
    expect(pickTopIssues([])).toEqual([]);
    expect(pickTopIssues(undefined)).toEqual([]);
  });

  test('maps severity to the house severity palette', () => {
    const top = pickTopIssues([issue('H', 'high'), issue('M', 'medium'), issue('L', 'low')]);
    expect(top.map((i) => i.color)).toEqual(['#D93B3B', '#F06A25', '#F5C842']);
  });
});

// ─── buildMoneyTrail ─────────────────────────────────────────────────────

describe('buildMoneyTrail', () => {
  test('reports both lobbying and donations when present', () => {
    const company = {
      lobbyingSpend: 3900000,
      lobbyingTargets: ['FDA', 'Congress', 'State legislatures'],
      politicalDonations: 2100000,
      donationSplit: { republican: 44, democrat: 56 },
    };
    const money = buildMoneyTrail(company);
    expect(money.hasLobbying).toBe(true);
    expect(money.lobbyingSpendLabel).toBe('$3.9M');
    // Capped at 2 targets even though 3 were supplied.
    expect(money.lobbyingTargets).toEqual(['FDA', 'Congress']);
    expect(money.hasDonations).toBe(true);
    expect(money.donationsLabel).toBe('$2.1M');
    expect(money.repPct).toBe(44);
    expect(money.demPct).toBe(56);
    expect(money.isEmpty).toBe(false);
  });

  test('treats lobbyingSpend of 0 as the "unresearched" sentinel, not a verified zero', () => {
    const money = buildMoneyTrail({ lobbyingSpend: 0, politicalDonations: 0, donationSplit: null });
    expect(money.hasLobbying).toBe(false);
    expect(money.isEmpty).toBe(true);
  });

  test('requires donationSplit to actually exist, not just a nonzero donations figure', () => {
    const money = buildMoneyTrail({ politicalDonations: 50000, donationSplit: null });
    expect(money.hasDonations).toBe(false);
  });

  test('isEmpty is true for a company with neither lobbying nor donations', () => {
    const money = buildMoneyTrail({ lobbyingSpend: 0, lobbyingTargets: [], politicalDonations: 0, donationSplit: null, issues: [] });
    expect(money.isEmpty).toBe(true);
  });

  test('is empty and safe for a null/unresolved company', () => {
    const money = buildMoneyTrail(null);
    expect(money).toEqual({
      hasLobbying: false,
      lobbyingSpendLabel: null,
      lobbyingTargets: [],
      hasDonations: false,
      donationsLabel: null,
      repPct: null,
      demPct: null,
      isEmpty: true,
    });
  });

  test('reports only lobbying when donations are missing', () => {
    const money = buildMoneyTrail({ lobbyingSpend: 10000, lobbyingTargets: [], politicalDonations: 0, donationSplit: null });
    expect(money.hasLobbying).toBe(true);
    expect(money.hasDonations).toBe(false);
    expect(money.isEmpty).toBe(false);
  });
});

// ─── buildShareCardData ─────────────────────────────────────────────────

describe('buildShareCardData', () => {
  const cleanCompany = {
    name: 'Once Upon a Farm, PBC',
    logo: 'https://example.com/logo.png',
    lobbyingSpend: 0,
    lobbyingTargets: [],
    politicalDonations: 10000,
    donationSplit: { republican: 20, democrat: 80 },
    issues: [],
  };

  test('a real scored product with a resolved company maps every field', () => {
    const product = { name: 'Organic Fruit Pouch', servingSize: '1 pouch (99g)', companyId: 'once-upon-a-farm' };
    const result = { score: 88, grade: 'A', displayGrade: 'A', insufficientData: false, analyzedIngredients: [] };
    const data = buildShareCardData({ product, result, company: cleanCompany });

    expect(data.productName).toBe('Organic Fruit Pouch');
    expect(data.metaLine).toBe('1 pouch (99g)');
    expect(data.parentCompanyLabel).toBe('Once Upon a Farm, PBC');
    expect(data.logo).toBe('https://example.com/logo.png');
    expect(data.scoreLabel).toBe('88');
    expect(data.scoreColor).toBe(SHARE_CARD_COLORS.green);
    expect(data.verdictLabel).toBe('EXCELLENT');
    expect(data.insufficientData).toBe(false);
  });

  test('a clean company (no issues, no lobbying) still reports donations and an empty issues list', () => {
    const product = { name: 'Snack', companyId: 'once-upon-a-farm' };
    const result = { score: 82, displayGrade: 'A', insufficientData: false, analyzedIngredients: [] };
    const data = buildShareCardData({ product, result, company: cleanCompany });

    expect(data.money.hasLobbying).toBe(false);
    expect(data.money.hasDonations).toBe(true);
    expect(data.money.isEmpty).toBe(false);
    expect(data.issues).toEqual([]);
    expect(data.issuesEmpty).toBe(true);
  });

  test('an unresolved company (no match) degrades to "None on record" everywhere, not a crash', () => {
    const product = { name: 'Mystery Snack', companyId: null };
    const result = { score: 60, displayGrade: 'C', insufficientData: false, analyzedIngredients: [] };
    const data = buildShareCardData({ product, result, company: null });

    expect(data.parentCompanyLabel).toBeNull();
    expect(data.logo).toBeNull();
    expect(data.money.isEmpty).toBe(true);
    expect(data.issuesEmpty).toBe(true);
    expect(data.scoreColor).toBe(SHARE_CARD_COLORS.amber);
  });

  test('an insufficient-data scan shows a muted "unscored" state, not a fabricated score', () => {
    const product = { name: 'Unresearched Item', companyId: null };
    const result = { score: 42, displayGrade: '?', insufficientData: true, analyzedIngredients: [] };
    const data = buildShareCardData({ product, result, company: null });

    expect(data.scoreLabel).toBe('—');
    expect(data.score).toBeNull();
    expect(data.scoreColor).toBe(SHARE_CARD_COLORS.muted);
    expect(data.verdictLabel).toBe('UNSCORED');
  });

  test('never throws when product/result/company are all missing', () => {
    expect(() => buildShareCardData({})).not.toThrow();
    expect(() => buildShareCardData()).not.toThrow();
    const data = buildShareCardData();
    expect(data.productName).toBe('Unknown product');
    expect(data.issuesEmpty).toBe(true);
  });

  test('picks the top 3 issues by severity from a company with several', () => {
    const company = {
      ...cleanCompany,
      issues: [
        { id: 'a', title: 'Low issue', severity: 'low', description: 'd' },
        { id: 'b', title: 'High issue 1', severity: 'high', description: 'd' },
        { id: 'c', title: 'Medium issue', severity: 'medium', description: 'd' },
        { id: 'd', title: 'High issue 2', severity: 'high', description: 'd' },
      ],
    };
    const product = { name: 'Snack', companyId: 'x' };
    const result = { score: 40, displayGrade: 'F', insufficientData: false, analyzedIngredients: [] };
    const data = buildShareCardData({ product, result, company });

    expect(data.issues).toHaveLength(3);
    expect(data.issues.map((i) => i.title)).toEqual(['High issue 1', 'High issue 2', 'Medium issue']);
    expect(data.issuesEmpty).toBe(false);
  });
});
