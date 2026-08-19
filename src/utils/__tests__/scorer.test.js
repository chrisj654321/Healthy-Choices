/**
 * Characterization tests for src/utils/scorer.js.
 *
 * These tests pin down CURRENT behavior exactly as implemented — including a
 * few surprising corners of the real code (duplicate DB keys, naive pluralization,
 * token-fallback matches that route through the DB instead of the unknown-ingredient
 * classifier). Anything surprising is called out in a comment and mirrored in the
 * Hadrian build report under "Flagged for review." Do not treat a passing test here
 * as an endorsement of the behavior — some are deliberately pinning quirks, not
 * describing ideal behavior.
 *
 * Uses the REAL src/data/ingredients.js and src/data/ingredientCache.js — no mocks.
 * Both files are small enough (731 and 2813 lines) to load directly in Jest/Node.
 */
import {
  upfCeiling,
  scoreToGrade,
  scoreToColor,
  gradeToColor,
  scoreToVerdict,
  lookupIngredient,
  scoreProduct,
  getPersonalisedWarnings,
  getLobbyingRiskLevel,
  formatCurrency,
} from '../scorer';

// ─── upfCeiling ────────────────────────────────────────────────────────────

describe('upfCeiling', () => {
  test('load 0 -> 100 (no marker load, no ceiling pressure)', () => {
    expect(upfCeiling(0)).toBe(100);
  });

  test('negative load -> 100 (treated the same as <= 0)', () => {
    expect(upfCeiling(-1)).toBe(100);
  });

  test('formula: max(40, round(100 - load*22)) at load 0.4', () => {
    expect(upfCeiling(0.4)).toBe(Math.max(40, Math.round(100 - 0.4 * 22)));
    expect(upfCeiling(0.4)).toBe(91);
  });

  test('formula at load 1.0', () => {
    expect(upfCeiling(1.0)).toBe(Math.max(40, Math.round(100 - 1.0 * 22)));
    expect(upfCeiling(1.0)).toBe(78);
  });

  test('formula at load 2.0', () => {
    expect(upfCeiling(2.0)).toBe(Math.max(40, Math.round(100 - 2.0 * 22)));
    expect(upfCeiling(2.0)).toBe(56);
  });

  test('floor holds at high loads: 3.0 -> 40', () => {
    expect(upfCeiling(3.0)).toBe(40);
  });

  test('floor also holds just past the mathematical crossover (2.7 -> 41, still near floor)', () => {
    expect(upfCeiling(2.7)).toBe(41);
  });
});

// ─── scoreToGrade boundaries ───────────────────────────────────────────────

describe('scoreToGrade boundaries', () => {
  test.each([
    [90, 'A'],
    [89, 'B'],
    [80, 'B'],
    [79, 'C'],
    [70, 'C'],
    [69, 'D'],
    [60, 'D'],
    [59, 'F'],
    [0, 'F'],
  ])('scoreToGrade(%i) -> %s', (score, grade) => {
    expect(scoreToGrade(score)).toBe(grade);
  });
});

// ─── scoreToColor / gradeToColor / scoreToVerdict ─────────────────────────

describe('scoreToColor', () => {
  test('null score -> neutral gray', () => {
    expect(scoreToColor(null)).toBe('#9BB5AE');
  });
  test('90 -> green (A range)', () => {
    expect(scoreToColor(90)).toBe('#1D9E75');
  });
  test('89 -> light green (B range)', () => {
    expect(scoreToColor(89)).toBe('#6DBE47');
  });
  test('70 -> orange-yellow (C range)', () => {
    expect(scoreToColor(70)).toBe('#F5A623');
  });
  test('50 -> orange (D range, >=50 boundary)', () => {
    expect(scoreToColor(50)).toBe('#F06A25');
  });
  test('49 -> red (below 50)', () => {
    expect(scoreToColor(49)).toBe('#D93B3B');
  });
});

describe('gradeToColor', () => {
  test('? -> neutral gray', () => {
    expect(gradeToColor('?')).toBe('#9BB5AE');
  });
  test('A -> green', () => {
    expect(gradeToColor('A')).toBe('#1D9E75');
  });
  test('F -> red', () => {
    expect(gradeToColor('F')).toBe('#D93B3B');
  });
  test('unrecognized grade key falls back to neutral gray', () => {
    expect(gradeToColor('Z')).toBe('#9BB5AE');
  });
});

describe('scoreToVerdict', () => {
  test('? -> Unscored', () => {
    expect(scoreToVerdict('?')).toBe('Unscored');
  });
  test('A -> Excellent', () => {
    expect(scoreToVerdict('A')).toBe('Excellent');
  });
  test('F -> Avoid', () => {
    expect(scoreToVerdict('F')).toBe('Avoid');
  });
  test('unrecognized grade -> Unknown', () => {
    expect(scoreToVerdict('Z')).toBe('Unknown');
  });
});

// ─── getLobbyingRiskLevel / formatCurrency ─────────────────────────────────
//
// Sparse company records (ownership verified, financials not researched) use
// `null` for revenue/employees but `0` for lobbyingSpend/politicalDonations
// (see COMPANY_DB.willas in src/data/companies.js) — 144 of the 268 existing
// companies carry `lobbyingSpend: 0` this way. Neither null nor 0 may render
// as a favorable "Low risk" claim or as a fabricated dollar amount.

describe('getLobbyingRiskLevel: missing-data cases', () => {
  test('undefined spend -> unknown "No data", not "Low"', () => {
    const result = getLobbyingRiskLevel(undefined);
    expect(result.label).toBe('No data');
    expect(result.unknown).toBe(true);
  });

  test('null spend -> unknown "No data", not "Low"', () => {
    const result = getLobbyingRiskLevel(null);
    expect(result.label).toBe('No data');
    expect(result.unknown).toBe(true);
  });

  test('0 spend -> unknown "No data", not "Low" (0 is the "unresearched" sentinel, not a verified zero)', () => {
    const result = getLobbyingRiskLevel(0);
    expect(result.label).toBe('No data');
    expect(result.unknown).toBe(true);
  });

  test('"No data" band is visually neutral, not green', () => {
    const result = getLobbyingRiskLevel(null);
    expect(result.color).not.toBe('#1D9E75'); // not the "Low" green
    expect(result.bg).not.toBe('#E8F7F2');    // not the "Low" green background
  });
});

describe('getLobbyingRiskLevel: numeric-input bands are unchanged', () => {
  test('1 -> Low (any positive spend below Moderate threshold)', () => {
    const result = getLobbyingRiskLevel(1);
    expect(result.label).toBe('Low');
    expect(result.unknown).toBeUndefined();
  });
  test('499999 -> Low', () => {
    expect(getLobbyingRiskLevel(499999).label).toBe('Low');
  });
  test('500000 -> Moderate', () => {
    expect(getLobbyingRiskLevel(500000).label).toBe('Moderate');
  });
  test('1500000 -> High', () => {
    expect(getLobbyingRiskLevel(1500000).label).toBe('High');
  });
  test('3000000 -> Very High', () => {
    expect(getLobbyingRiskLevel(3000000).label).toBe('Very High');
  });
  test('3000001 -> Very High', () => {
    expect(getLobbyingRiskLevel(3000001).label).toBe('Very High');
  });
});

describe('formatCurrency: missing-data cases', () => {
  test('undefined -> null (never the string "$undefined")', () => {
    expect(formatCurrency(undefined)).toBeNull();
  });
  test('null -> null (never the string "$null")', () => {
    expect(formatCurrency(null)).toBeNull();
  });
});

describe('formatCurrency: numeric formatting is unchanged', () => {
  test('0 -> "$0" (a real, formattable number)', () => {
    expect(formatCurrency(0)).toBe('$0');
  });
  test('500 -> "$500"', () => {
    expect(formatCurrency(500)).toBe('$500');
  });
  test('2500 -> "$3K" (rounds to nearest K)', () => {
    expect(formatCurrency(2500)).toBe('$3K');
  });
  test('2500000 -> "$2.5M"', () => {
    expect(formatCurrency(2500000)).toBe('$2.5M');
  });
});

// ─── calcNutritionPenalty (not exported; exercised via scoreProduct with
// empty ingredients so nutritionPenalty is isolated from ingredient penalties) ──

describe('calcNutritionPenalty (via scoreProduct().nutritionPenalty)', () => {
  function nutritionPenaltyFor(nutrition) {
    return scoreProduct({ ingredients: [], nutrition }).nutritionPenalty;
  }

  test('sugars <= 12 -> no sugar penalty', () => {
    expect(nutritionPenaltyFor({ sugars: 12 })).toBe(0);
  });
  test('sugars > 12 (13) -> +4', () => {
    expect(nutritionPenaltyFor({ sugars: 13 })).toBe(4);
  });
  test('sugars > 20 (21) -> +8', () => {
    expect(nutritionPenaltyFor({ sugars: 21 })).toBe(8);
  });
  test('sugars > 30 (31) -> +12', () => {
    expect(nutritionPenaltyFor({ sugars: 31 })).toBe(12);
  });

  test('sodium <= 300 -> no sodium penalty', () => {
    expect(nutritionPenaltyFor({ sodium: 300 })).toBe(0);
  });
  test('sodium > 300 (301) -> +4', () => {
    expect(nutritionPenaltyFor({ sodium: 301 })).toBe(4);
  });
  test('sodium > 500 (501) -> +8', () => {
    expect(nutritionPenaltyFor({ sodium: 501 })).toBe(8);
  });

  test('saturatedFat <= 5 -> no satFat penalty', () => {
    expect(nutritionPenaltyFor({ saturatedFat: 5 })).toBe(0);
  });
  test('saturatedFat > 5 (6) -> +4', () => {
    expect(nutritionPenaltyFor({ saturatedFat: 6 })).toBe(4);
  });
  test('saturatedFat > 10 (11) -> +8', () => {
    expect(nutritionPenaltyFor({ saturatedFat: 11 })).toBe(8);
  });

  test('cap at 20 when all three tiers are maxed (12+8+8=28 raw, capped to 20)', () => {
    expect(nutritionPenaltyFor({ sugars: 31, sodium: 501, saturatedFat: 11 })).toBe(20);
  });
});

// ─── lookupIngredient ──────────────────────────────────────────────────────

describe('lookupIngredient', () => {
  test('exact match hits a known DB entry (sugar)', () => {
    const hit = lookupIngredient('sugar');
    expect(hit).not.toBeNull();
    expect(hit.source).toBe('db');
    expect(hit.entry.label).toBe('Sugar');
    expect(hit.entry.risk).toBe(4);
    expect(hit.entry.flag).toBe('moderate');
  });

  test('case-insensitive normalization (SUGAR matches sugar)', () => {
    const hit = lookupIngredient('SUGAR');
    expect(hit).not.toBeNull();
    expect(hit.entry.label).toBe('Sugar');
  });

  test('parentheticals are stripped before matching ("Sugar (organic)" matches "sugar")', () => {
    const hit = lookupIngredient('Sugar (organic)');
    expect(hit).not.toBeNull();
    expect(hit.entry.label).toBe('Sugar');
  });

  test('plural input matches a plural DB key directly (eggs -> Eggs, allergen)', () => {
    const hit = lookupIngredient('eggs');
    expect(hit).not.toBeNull();
    expect(hit.source).toBe('db');
    expect(hit.entry.label).toBe('Eggs');
    expect(hit.entry.flag).toBe('allergen');
  });

  test('singularization: plural input falls back to cache entry under the singular key (almonds -> almond cache entry)', () => {
    // 'almond'/'almonds' are not DB keys; 'almonds' IS a cache key directly (exact
    // hit on the plural itself), so this actually resolves via the exact-match
    // cache branch rather than needing the singularize fallback. Pinning the
    // observed source/category here.
    const hit = lookupIngredient('almonds');
    expect(hit).not.toBeNull();
    expect(hit.source).toBe('cache');
    expect(hit.entry.category).toBe('nuts');
  });

  test('token fallback: an unrecognized multi-word ingredient matches via a shared significant token (interesterified blahblahzoid -> Interesterified Fat)', () => {
    const hit = lookupIngredient('interesterified blahblahzoid');
    expect(hit).not.toBeNull();
    expect(hit.source).toBe('db');
    expect(hit.entry.label).toBe('Interesterified Fat');
  });

  test('cleaned phrase fallback strips quantity fragments before lookup (roasted peanuts 39% -> roasted peanuts)', () => {
    const hit = lookupIngredient('roasted peanuts 39%');
    expect(hit).not.toBeNull();
    expect(hit.source).toBe('cache');
    expect(hit.entry.category).toBe('nuts');
  });

  test('cleaned phrase fallback strips parser headings before lookup (Ingredients: Soy Protein Isolate)', () => {
    const hit = lookupIngredient('Ingredients: Soy Protein Isolate');
    expect(hit).not.toBeNull();
    expect(hit.source).toBe('db');
    expect(hit.entry.label).toBe('Soy Protein Isolate');
  });

  test('cleaned phrase fallback strips percent counts from known phrases (Peanut Butter 2%)', () => {
    const hit = lookupIngredient('Peanut Butter 2%');
    expect(hit).not.toBeNull();
    expect(hit.source).toBe('cache');
    expect(hit.entry.category).toBe('nuts');
  });

  test('cleaned phrase fallback strips purpose words before lookup (Humectant Glycerol)', () => {
    const hit = lookupIngredient('Humectant Glycerol');
    expect(hit).not.toBeNull();
    expect(hit.source).toBe('cache');
    expect(hit.entry.category).toBe('additives');
  });

  test('cleaned phrase fallback strips purpose words before lookup (Leavening Sodium Acid Pyrophosphate)', () => {
    const hit = lookupIngredient('Leavening Sodium Acid Pyrophosphate');
    expect(hit).not.toBeNull();
    expect(hit.source).toBe('cache');
    expect(hit.entry.category).toBe('additives');
  });

  test('ambiguity: two equally-specific single-token candidates with no clear winner -> null', () => {
    // 'nitrite' alone resolves to Sodium Nitrite, 'nitrate' alone resolves to
    // Sodium Nitrate. Together, each contributes exactly one shared token to a
    // DIFFERENT candidate, so there is no single best match -> ambiguous -> null.
    expect(lookupIngredient('nitrite')).not.toBeNull();
    expect(lookupIngredient('nitrate')).not.toBeNull();
    expect(lookupIngredient('nitrite nitrate blend')).toBeNull();
  });

  test('no shared non-weak token -> null (nonsense ingredient)', () => {
    expect(lookupIngredient('zzznovelchem xyzcompound')).toBeNull();
  });

  test('empty string input -> null', () => {
    expect(lookupIngredient('')).toBeNull();
  });

  test('null input -> null', () => {
    expect(lookupIngredient(null)).toBeNull();
  });

  test('undefined input -> null', () => {
    expect(lookupIngredient(undefined)).toBeNull();
  });

  // FLAGGED FOR REVIEW: naive singularize() only strips a trailing "s" (and
  // never for words ending "ss"); it doesn't handle "-es" plurals. "shellfishes"
  // singularizes to "shellfishe", NOT "shellfish", so it fails to match the
  // real DB key "shellfish" even though a human would recognize the plural.
  test('FLAGGED: naive pluralization does not strip "-es" plurals ("shellfishes" fails to match "shellfish")', () => {
    expect(lookupIngredient('shellfish')).not.toBeNull();
    expect(lookupIngredient('shellfishes')).toBeNull();
  });

  // Fixed 2026-07-04: was pinning the duplicate-key bug, now verifies the corrected
  // classification. INGREDIENT_DB previously had duplicate string keys for 'red 40'
  // and 'yellow 5' — an early, more severe avoid/risk-8 (resp. avoid/risk-7) entry,
  // silently shadowed by a later, milder caution/risk-6 "Phase 2" entry (plain JS
  // object literals let the last definition win with no warning). The duplicate
  // (milder) entries were removed, so lookups now resolve to the original, more
  // severe avoid classification.
  test('duplicate DB key "red 40" is resolved; now correctly returns the severe avoid entry', () => {
    const hit = lookupIngredient('red 40');
    expect(hit.entry.risk).toBe(8);
    expect(hit.entry.flag).toBe('avoid');
  });

  test('duplicate DB key "yellow 5" is resolved; now correctly returns the severe avoid entry', () => {
    const hit = lookupIngredient('yellow 5');
    expect(hit.entry.risk).toBe(7);
    expect(hit.entry.flag).toBe('avoid');
  });
});

// ─── classifyUnknown behavior, exercised through scoreProduct (not exported) ──

describe('classifyUnknown (via scoreProduct on unmatched ingredients)', () => {
  test('a synthetic-pattern name that does NOT hit the DB/cache gets flag caution, risk 3', () => {
    // "bleached" matches a SYNTHETIC_PATTERNS regex; "zoranium compound" ensures
    // no DB/cache exact or token match fires first (lookupIngredient returns null
    // for this string; verified directly below as well).
    expect(lookupIngredient('bleached zoranium compound')).toBeNull();
    const result = scoreProduct({ ingredients: ['bleached zoranium compound'], nutrition: {} });
    const item = result.analyzedIngredients[0];
    expect(item.flag).toBe('caution');
    expect(item.risk).toBe(3);
    expect(item.category).toBe('unknown');
  });

  test('a whole-food word inside a multi-word name passes as ok/risk 0 ("dried rutabaga puree")', () => {
    expect(lookupIngredient('dried rutabaga puree')).toBeNull();
    const result = scoreProduct({ ingredients: ['dried rutabaga puree'], nutrition: {} });
    const item = result.analyzedIngredients[0];
    expect(item.flag).toBe('ok');
    expect(item.risk).toBe(0);
  });

  test('a long (>5 word) non-food, non-synthetic name gets flag moderate, risk 1', () => {
    const name = 'zzznovelchem xyzcompound blah foo bar baz'; // 6 words
    expect(lookupIngredient(name)).toBeNull();
    const result = scoreProduct({ ingredients: [name], nutrition: {} });
    const item = result.analyzedIngredients[0];
    expect(item.flag).toBe('moderate');
    expect(item.risk).toBe(1);
  });

  test('a short (<=5 word), non-synthetic, non-whole-food name defaults to ok/risk 0', () => {
    const name = 'zzznovelchem xyzcompound blah foo bar'; // 5 words exactly
    expect(lookupIngredient(name)).toBeNull();
    const result = scoreProduct({ ingredients: [name], nutrition: {} });
    const item = result.analyzedIngredients[0];
    expect(item.flag).toBe('ok');
    expect(item.risk).toBe(0);
  });
});

// ─── scoreProduct integration ──────────────────────────────────────────────

describe('scoreProduct: whole-food clean path', () => {
  test('single clean whole-food ingredient with modest sugar scores >= 95 and is marked wholeFoodClean', () => {
    // No `packaging` field on this fixture. Since 2026-08-08 that is treated
    // as NEUTRAL rather than as assumed-plastic: missing packaging data no
    // longer costs points and no longer blocks the literal-100 raw-whole-food
    // ceiling. A single raw ingredient with no processing indicator and no
    // known packaging concern therefore reaches 100.
    const result = scoreProduct({ ingredients: ['blackberries'], nutrition: { sugars: 7 } });
    expect(result.wholeFoodClean).toBe(true);
    expect(result.isRawWholeFood).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(95);
    expect(result.score).toBe(100);
  });

  test('whole-food clean nutrition penalty is waived to at most 5 points even with high sugar', () => {
    // sugars: 35 -> raw nutritionPenalty would be 12, but the whole-food-clean
    // path only applies min(nutritionPenalty * 0.25, 5) => min(3, 5) = 3.
    // Unresearched packaging is neutral since 2026-08-08, so nothing further
    // is deducted.
    const result = scoreProduct({ ingredients: ['blackberries'], nutrition: { sugars: 35 } });
    expect(result.wholeFoodClean).toBe(true);
    expect(result.nutritionPenalty).toBe(12);
    expect(result.score).toBe(97); // 100 - 3 (waived nutrition hit)
  });

  test('a raw single-ingredient product with packaging verified clean reaches the literal 100 ceiling', () => {
    const result = scoreProduct({
      ingredients: ['almonds'],
      nutrition: { sugars: 1 },
      packaging: { material: 'glass' },
    });
    expect(result.wholeFoodClean).toBe(true);
    expect(result.isRawWholeFood).toBe(true);
    expect(result.score).toBe(100);
  });

  test('the same raw ingredient with a processing word (roasted) is not eligible for the literal 100 ceiling', () => {
    const result = scoreProduct({
      ingredients: ['roasted almonds'],
      nutrition: { sugars: 1 },
      packaging: { material: 'glass' },
    });
    expect(result.isRawWholeFood).toBe(false);
    expect(result.score).toBe(96);
  });
});

describe('scoreProduct: insufficient data', () => {
  test('empty ingredients array -> insufficientData true, displayGrade "?"', () => {
    const result = scoreProduct({ ingredients: [], nutrition: {} });
    expect(result.insufficientData).toBe(true);
    expect(result.displayGrade).toBe('?');
    expect(result.gradeColor).toBe('#9BB5AE');
  });

  test('missing ingredients key entirely also -> insufficientData true', () => {
    const result = scoreProduct({ nutrition: {} });
    expect(result.insufficientData).toBe(true);
    expect(result.displayGrade).toBe('?');
  });
});

describe('scoreProduct: processing-ceiling clamp', () => {
  test('two severe markers (partially hydrogenated oil + sodium nitrite) clamp the score at/under the computed upfCeiling', () => {
    const product = {
      ingredients: ['partially hydrogenated oil', 'sodium nitrite'],
      nutrition: { sugars: 5, sodium: 100, saturatedFat: 2 },
    };
    const result = scoreProduct(product);
    // Both ingredients are severe markers (risk >= 7) -> weight 1.0 each -> markerLoad 2.
    expect(result.markerLoad).toBe(2);
    expect(result.upfCeiling).toBe(56);
    expect(result.score).toBeLessThanOrEqual(result.upfCeiling);
    // UPDATED 2026-08-17 (form-penalty model): this fixture's own ingredient
    // list contains "sodium nitrite", which is now ALSO Rule 1's trigger (a)
    // for processed/cured meat (WHO Group 1) — so the hard cap of 40 now
    // applies on top of the UPF-ceiling clamp this test exists to pin down.
    // Before this rule the raw penalty (25 + 22.5 = 47.5) landed the score at
    // 53, under the 56 ceiling but above 40; the cap now dominates. Confirms
    // the cap is enforced as the true final ceiling, not just the UPF curve.
    expect(result.isProcessedCuredMeat).toBe(true);
    expect(result.score).toBe(40);
  });
});

describe('scoreProduct: allergen flag = zero penalty', () => {
  test('an ingredient flagged "allergen" in the DB (peanuts) contributes zero penalty', () => {
    const result = scoreProduct({ ingredients: ['peanuts'], nutrition: {} });
    const item = result.analyzedIngredients[0];
    expect(item.flag).toBe('allergen');
    expect(item.penalty).toBe(0);
    // allergen is not a "concern" flag for wholeFoodClean purposes, so this is
    // still wholeFoodClean. Since 2026-08-08 missing packaging data no longer
    // blocks the literal-100 raw-whole-food ceiling, so a single raw
    // ingredient with no known packaging concern reaches 100.
    expect(result.score).toBe(100);
  });
});

describe('scoreProduct: certification bonus', () => {
  test('a product with one certification scores +3 over the same product with none, when not clamped by the ceiling', () => {
    // 'sugar' (risk 4, flag moderate) is not a upfMarker (sweeteners only count
    // as markers when flag is avoid/caution), so the ceiling stays well above
    // the computed score and doesn't interfere with reading the cert bonus
    // directly. Unresearched packaging is neutral since 2026-08-08, so no
    // packaging deduction applies to either side of the comparison.
    const base = { ingredients: ['sugar'], nutrition: {} };
    const withoutCert = scoreProduct(base);
    const withCert = scoreProduct({ ...base, certifications: ['USDA Organic'] });
    expect(withoutCert.certBonus).toBe(0);
    expect(withCert.certBonus).toBe(3);
    expect(withCert.score).toBe(withoutCert.score + 3);
    expect(withoutCert.score).toBe(90);
    expect(withCert.score).toBe(93);
  });

  test('certifications are tiered by what they actually verify, not a flat bonus', () => {
    const base = { ingredients: ['sugar'], nutrition: {} };
    // Tier A: independently verifies the ingredient/additive profile.
    expect(scoreProduct({ ...base, certifications: ['USDA Organic'] }).certBonus).toBe(3);
    expect(scoreProduct({ ...base, certifications: ['Non-GMO Project Verified'] }).certBonus).toBe(3);
    expect(scoreProduct({ ...base, certifications: ['Heart-Check'] }).certBonus).toBe(3);
    // Tier B: real verification, scoped to a dietary/allergen need.
    expect(scoreProduct({ ...base, certifications: ['Certified Gluten-Free (GFCO)'] }).certBonus).toBe(2);
    expect(scoreProduct({ ...base, certifications: ['Kosher (OU)'] }).certBonus).toBe(2);
    // Tier C: real certification, but about ethics/sourcing not this product's
    // ingredient profile.
    expect(scoreProduct({ ...base, certifications: ['Fair Trade Certified'] }).certBonus).toBe(1);
    // Tier D: a dietary-pattern or origin claim, not an independently verified
    // safety/quality standard — contributes nothing.
    expect(scoreProduct({ ...base, certifications: ['Made in USA'] }).certBonus).toBe(0);
    expect(scoreProduct({ ...base, certifications: ['Keto Certified'] }).certBonus).toBe(0);
  });

  test('total certification bonus is capped even when many real certs stack', () => {
    const result = scoreProduct({
      ingredients: ['sugar'],
      nutrition: {},
      certifications: [
        'USDA Organic', 'Non-GMO Project Verified', 'Heart-Check',
        'Certified Gluten-Free (GFCO)', 'Certified Vegan', 'Kosher (OU)',
        'Fair Trade Certified', 'Certified Humane',
      ],
    });
    // Uncapped this would be 3+3+3+2+2+2+1+1 = 17 — capped at MAX_CERT_BONUS.
    expect(result.certBonus).toBe(8);
  });

  test('an unrecognized certification string defaults to a modest +1, not the old flat +3', () => {
    const result = scoreProduct({
      ingredients: ['sugar'],
      nutrition: {},
      certifications: ['Some Brand-New Cert Nobody Has Seen Yet'],
    });
    expect(result.certBonus).toBe(1);
  });
});

describe('scoreProduct: sourcing/housing adjustment (eggs)', () => {
  // Founder directive (2026-07-30): a conventional/caged egg must not score
  // identically to a pasture-raised one just because the ingredient list is
  // the same single "eggs" entry — the housing tier itself is meant to
  // "weigh heavily" into the score, not just show up in a separate card.
  const eggBase = { ingredients: ['eggs'], nutrition: {}, category: 'Eggs' };

  test('every tier gets its own sourcingAdjustment, read from the product name alone', () => {
    // Second-pass design (2026-07-30): only pasture-raised carries the real
    // foraging + sun-exposure mechanism the Penn State nutrient gap
    // measured. organic/free-range/cage-free are real regulatory/welfare
    // steps but none guarantee actual foraging, so they cluster well below
    // pasture-raised rather than near-tying it — ordered by how much
    // outdoor-access requirement each legally carries (organic's 2023 rule
    // > free-range's unstandardized access > cage-free's none at all).
    //
    // Every value below was shifted down 4 on 2026-08-08 when the
    // unresearched-packaging penalty was removed. That raised a clean egg's
    // base from 96 to 100, so the offset keeps each tier's FINAL score
    // exactly where it was tuned (89/88/83/78) while letting pasture-raised
    // reach the literal 100 it was always meant to.
    expect(scoreProduct({ ...eggBase, name: 'Some Brand Grade A Large Eggs' }).sourcingAdjustment).toBe(-22);
    expect(scoreProduct({ ...eggBase, name: 'Some Brand Cage Free Eggs' }).sourcingAdjustment).toBe(-17);
    expect(scoreProduct({ ...eggBase, name: 'Some Brand Free Range Eggs' }).sourcingAdjustment).toBe(-12);
    expect(scoreProduct({ ...eggBase, name: 'Some Brand Organic Eggs' }).sourcingAdjustment).toBe(-11);
    expect(scoreProduct({ ...eggBase, name: 'Some Brand Pasture-Raised Eggs' }).sourcingAdjustment).toBe(6);
  });

  test('a real catalog case: Eggland\'s Best Classic (conventional) drops two full letter grades vs. before this feature, grounded in the real Penn State nutrient-gap study', () => {
    // Single clean ingredient, no packaging data -> pre-adjustment this
    // landed on the 96 ceiling (grade A) same as every other tier. Founder
    // called the first pass (-8, landing at grade B) not strict enough
    // given how large the real nutrient gap (omega-3/vitamin D/E/A) is.
    const result = scoreProduct({
      ingredients: ['eggs'],
      nutrition: { fat: 4, saturatedFat: 1, sodium: 60, carbs: 0, sugars: 0, protein: 6 },
      category: 'Eggs',
      name: "Eggland's Best Classic Large White Eggs Grade A",
      certifications: [],
    });
    expect(result.score).toBe(78);
    expect(result.grade).toBe('C');
  });

  test('pasture-raised reaches a literal 100, breaking past the processed-food ceiling that trapped every tier at the same score before', () => {
    const result = scoreProduct({
      ingredients: ['eggs'],
      nutrition: { fat: 4, saturatedFat: 1, sodium: 60, carbs: 0, sugars: 0, protein: 6 },
      category: 'Eggs',
      name: 'Vital Farms Pasture-Raised Large Grade A Eggs',
      certifications: [],
    });
    expect(result.score).toBe(100);
    expect(result.grade).toBe('A');
  });

  test('tiers are fully ordered top to bottom for an otherwise-identical product: pasture > organic > free-range > cage-free > conventional', () => {
    const scoreFor = (name) => scoreProduct({ ...eggBase, name }).score;
    const pasture = scoreFor('Brand Pasture-Raised Eggs');
    const organic = scoreFor('Brand Organic Eggs');
    const freeRange = scoreFor('Brand Free Range Eggs');
    const cageFree = scoreFor('Brand Cage Free Eggs');
    const conventional = scoreFor('Brand Grade A Eggs');
    expect(pasture).toBeGreaterThan(organic);
    expect(organic).toBeGreaterThan(freeRange);
    expect(freeRange).toBeGreaterThan(cageFree);
    expect(cageFree).toBeGreaterThan(conventional);
  });

  test('scoped to Eggs only — a non-egg product with an egg-tier-sounding name gets no adjustment', () => {
    const result = scoreProduct({
      ingredients: ['chicken'],
      nutrition: {},
      category: 'Meat & Seafood / Primary Proteins',
      name: 'Some Free Range Chicken Breast',
    });
    expect(result.sourcingAdjustment).toBe(0);
  });

  test('a plant-based egg substitute gets no housing adjustment even though it is catalogued under Eggs', () => {
    const result = scoreProduct({
      ingredients: ['water', 'mung bean protein'],
      nutrition: {},
      category: 'Eggs',
      name: 'JUST Egg Plant-Based Egg',
    });
    expect(result.sourcingAdjustment).toBe(0);
  });

  test('a non-egg product with no category set is unaffected (no crash, adjustment is 0)', () => {
    const result = scoreProduct({ ingredients: ['sugar'], nutrition: {} });
    expect(result.sourcingAdjustment).toBe(0);
  });
});

describe('scoreProduct: sourcing/housing adjustment (meat-poultry, seafood)', () => {
  // Unlike eggs, no meat-poultry product carries a tier claim in its own
  // name (verified against the real catalog, 2026-07-30) -- so this reads
  // company-level `sourcing` data via companyId, not the product name.
  // 'tyson' and 'smithfield' are real COMPANY_DB records with real
  // sourcing data merged from the pipeline -- these tests pin real values,
  // not fixtures, so a future data edit that breaks the scoring
  // assumptions here shows up as a failing test (same pattern as the eggs
  // sourcingMatch tests).
  const beefFranks = { ingredients: ['beef'], nutrition: {}, category: 'Deli & Lunch', name: 'Angus beef franks', companyId: 'tyson' };
  const smithfieldSausage = { ingredients: ['pork'], nutrition: {}, category: 'Deli & Lunch', name: 'Smoked Sausage Rope', companyId: 'smithfield' };
  const turkeyProduct = { ingredients: ['turkey'], nutrition: {}, category: 'Deli & Lunch', name: 'Oven Roasted Turkey Breast', companyId: 'tyson' };

  test('a real beef product from a company with no grass-finished claim gets the confirmed-conventional penalty', () => {
    const result = scoreProduct(beefFranks);
    expect(result.sourcingAdjustment).toBe(-16);
  });

  test('grass-finished tiers are ordered by how VERIFIED the 100% claim is, not by "some grass exposure"', () => {
    const grassBase = { ingredients: ['beef'], nutrition: {}, category: 'Deli & Lunch' };
    const scoreFor = (grassFinished) => {
      // Synthetic company with only grassFinished varied -- isolates the
      // factor being tested without needing 4 different real companies.
      const fakeId = '__test-beef-co__';
      require('../../data/companies').COMPANY_DB[fakeId] = {
        id: fakeId,
        sourcing: { industry: 'meat-poultry', welfareMeatPoultry: { grassFinished } },
      };
      const result = scoreProduct({ ...grassBase, name: 'Beef Franks', companyId: fakeId });
      delete require('../../data/companies').COMPANY_DB[fakeId];
      return result.sourcingAdjustment;
    };
    const certified = scoreFor('certified');
    const claims100 = scoreFor('company-claims-100-percent');
    const vague = scoreFor('company-disclosure-vague');
    const notClaimed = scoreFor('not-claimed');
    expect(certified).toBeGreaterThan(claims100);
    expect(claims100).toBeGreaterThan(vague);
    // A vague, uncompleted "grass-fed" claim earns NO credit -- the 2026
    // study found some such retail products test identical to grain-fed.
    expect(vague).toBe(0);
    expect(vague).toBeGreaterThan(notClaimed);
  });

  test('a real pork product from a company confirmed using gestation crates gets the crate penalty', () => {
    const result = scoreProduct(smithfieldSausage);
    expect(result.sourcingAdjustment).toBe(-6);
  });

  test('a poultry product gets no adjustment -- chill method is a processing fact, not scored, and GAP is dormant for this company', () => {
    const result = scoreProduct(turkeyProduct);
    expect(result.sourcingAdjustment).toBe(0);
  });

  test('species detection gates the field correctly: a pork company\'s BEEF product does not get the pork gestation-crate treatment', () => {
    const result = scoreProduct({ ingredients: ['beef'], nutrition: {}, category: 'Deli & Lunch', name: 'Smithfield Beef Franks', companyId: 'smithfield' });
    // smithfield's gestationCrateStatus is 'crates-used' (-6) but this is a
    // BEEF product -- must not inherit the pork penalty. smithfield's
    // grassFinished is 'not-applicable' (no beef line researched), so this
    // should be 0, not -6.
    expect(result.sourcingAdjustment).toBe(0);
  });

  test('seafood: real Seafood Watch ratings drive a real spread (StarKist/Bumble Bee Avoid vs. Wild Planet Best Choice)', () => {
    const starkist = scoreProduct({ ingredients: ['tuna'], nutrition: {}, category: 'Canned Goods', name: 'StarKist Chunk Light Tuna in Water', companyId: 'starkist' });
    const wildPlanet = scoreProduct({ ingredients: ['tuna'], nutrition: {}, category: 'Canned Goods', name: 'Wild Planet Wild Albacore Tuna', companyId: 'wild-planet' });
    expect(starkist.sourcingAdjustment).toBe(-5);
    expect(wildPlanet.sourcingAdjustment).toBe(4);
  });

  test('seafood: farmed shrimp with an unconfirmed sourcing country gets a modest, real-evidence-grounded caution', () => {
    const result = scoreProduct({ ingredients: ['shrimp'], nutrition: {}, category: 'Meat & Seafood / Primary Proteins', name: 'SeaPak Jumbo Butterfly Shrimp 9oz', companyId: 'rich-products' });
    expect(result.sourcingAdjustment).toBe(-3);
  });

  test('a product with no companyId is unaffected (no crash, adjustment is 0)', () => {
    const result = scoreProduct({ ingredients: ['beef'], nutrition: {}, category: 'Deli & Lunch', name: 'Some Unbranded Beef Product' });
    expect(result.sourcingAdjustment).toBe(0);
  });

  test('a companyId that resolves to a non-sourced company is unaffected', () => {
    const result = scoreProduct({ ingredients: ['sugar'], nutrition: {}, category: 'Chips & Crackers', name: 'Some Chips', companyId: 'pepsico' });
    expect(result.sourcingAdjustment).toBe(0);
  });
});

describe('scoreProduct: packaging penalty', () => {
  test('plastic pouch + high concern + microwave heat use -> penalty 8 (6 base + 2 heat)', () => {
    const result = scoreProduct({
      ingredients: ['blackberries'],
      nutrition: {},
      packaging: { material: 'plastic', format: 'pouch', concernLevel: 'high', heatUse: 'microwave' },
    });
    expect(result.packagingPenalty).toBe(8);
    expect(result.packagingConcern).not.toBeNull();
    expect(result.packagingConcern.title).toBe('Microwave plastic packaging');
  });

  test('penalty caps at 10 even when several extra concerns stack on top of a high/heated base', () => {
    const result = scoreProduct({
      ingredients: ['blackberries'],
      nutrition: {},
      packaging: {
        material: 'plastic',
        format: 'steam pouch',
        concernLevel: 'high',
        heatUse: 'microwave',
        concerns: ['heated-plastic-contact', 'fatty-food-contact'],
      },
    });
    // 6 (high) + 2 (microwave/steam) + 1 (heated-plastic-contact) + 1 (fatty-food-contact) = 10, would be 10 uncapped too
    expect(result.packagingPenalty).toBe(10);
  });
});

describe('scoreProduct: score bounds', () => {
  test('result score is always an integer between 0 and 100 inclusive, even for a maximally bad product', () => {
    const result = scoreProduct({
      ingredients: Array(20).fill('partially hydrogenated oil'),
      nutrition: { sugars: 50, sodium: 900, saturatedFat: 20 },
    });
    expect(Number.isInteger(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.score).toBe(0);
  });

  test('result score for a clean product does not exceed 100', () => {
    const result = scoreProduct({
      ingredients: ['blackberries'],
      nutrition: { sugars: 0 },
      certifications: ['USDA Organic', 'Non-GMO Project Verified'],
    });
    expect(result.score).toBeLessThanOrEqual(100);
    expect(Number.isInteger(result.score)).toBe(true);
  });
});

// ─── getPersonalisedWarnings ───────────────────────────────────────────────

describe('getPersonalisedWarnings', () => {
  test('allergen hit fires when prefs.allergens includes a matching allergen (peanuts)', () => {
    const analyzed = scoreProduct({ ingredients: ['peanuts'], nutrition: {} }).analyzedIngredients;
    const warnings = getPersonalisedWarnings(analyzed, { nutrition: {} }, { allergens: ['peanuts'], dietaryFlags: [], primaryGoal: null });
    expect(warnings.allergenHits).toHaveLength(1);
    expect(warnings.allergenHits[0].allergen).toBe('peanuts');
    expect(warnings.allergenHits[0].ingredients).toHaveLength(1);
  });

  test('allergen hit does NOT fire when prefs.allergens is empty', () => {
    const analyzed = scoreProduct({ ingredients: ['peanuts'], nutrition: {} }).analyzedIngredients;
    const warnings = getPersonalisedWarnings(analyzed, { nutrition: {} }, { allergens: [], dietaryFlags: [], primaryGoal: null });
    expect(warnings.allergenHits).toHaveLength(0);
  });

  test('dietary conflict fires for vegan + gelatin', () => {
    const analyzed = scoreProduct({ ingredients: ['gelatin'], nutrition: {} }).analyzedIngredients;
    const warnings = getPersonalisedWarnings(analyzed, { nutrition: {} }, { allergens: [], dietaryFlags: ['vegan'], primaryGoal: null });
    expect(warnings.dietaryConflicts).toHaveLength(1);
    expect(warnings.dietaryConflicts[0].diet).toBe('vegan');
    expect(warnings.dietaryConflicts[0].label).toBe('Vegan');
  });

  test('goalNote fires for avoid-added-sugar when sugars > 12', () => {
    const warnings = getPersonalisedWarnings([], { nutrition: { sugars: 20 } }, { allergens: [], dietaryFlags: [], primaryGoal: 'avoid-added-sugar' });
    expect(warnings.goalNote).toBe('Contains 20g sugar — above your low-sugar goal.');
  });

  test('goalNote is null for avoid-added-sugar when sugars <= 12', () => {
    const warnings = getPersonalisedWarnings([], { nutrition: { sugars: 12 } }, { allergens: [], dietaryFlags: [], primaryGoal: 'avoid-added-sugar' });
    expect(warnings.goalNote).toBeNull();
  });

  test('null prefs returns the empty shape', () => {
    const warnings = getPersonalisedWarnings([], {}, null);
    expect(warnings).toEqual({ allergenHits: [], dietaryConflicts: [], goalNote: null });
  });
});

// ─── Plausibility gate: rescue + hidden-garbage (P0 ingredient data quality) ──

describe('scoreProduct: unknown-ingredient plausibility gate', () => {
  test('an OCR typo close to a real DB key is rescued and scored as that ingredient', () => {
    // "sgybean oil" is 1-2 edits from "soybean oil", a real DB/cache key.
    expect(lookupIngredient('sgybean oil')).toBeNull();
    const result = scoreProduct({ ingredients: ['sgybean oil'], nutrition: {} });
    const item = result.analyzedIngredients[0];
    expect(item.category).not.toBe('unknown');
    expect(result.hiddenUnreadableCount).toBe(0);
  });

  test('OCR garbage rows are hidden (no row emitted) and counted in hiddenUnreadableCount', () => {
    const result = scoreProduct({
      ingredients: ['whey', 'balle creak', 'mi 49015 usa austin® cneese', 'unequar', 'lactose'],
      nutrition: {},
    });
    const raws = result.analyzedIngredients.map((i) => i.raw);
    expect(raws).toEqual(['whey', 'lactose']);
    expect(result.hiddenUnreadableCount).toBe(3);
  });

  test('a legitimate long ingredient name is never hidden as garbage', () => {
    const result = scoreProduct({
      ingredients: ['partially hydrogenated soybean oil', 'sodium stearoyl lactylate'],
      nutrition: {},
    });
    expect(result.hiddenUnreadableCount).toBe(0);
    expect(result.analyzedIngredients).toHaveLength(2);
  });

  test('the previously-pinned classifyUnknown fixtures still reach classifyUnknown unhidden', () => {
    // These are 3+ word synthesized names — the short-token garbage heuristic
    // must not touch them.
    const r1 = scoreProduct({ ingredients: ['bleached zoranium compound'], nutrition: {} });
    expect(r1.hiddenUnreadableCount).toBe(0);
    expect(r1.analyzedIngredients[0].flag).toBe('caution');

    const r2 = scoreProduct({ ingredients: ['dried rutabaga puree'], nutrition: {} });
    expect(r2.hiddenUnreadableCount).toBe(0);
    expect(r2.analyzedIngredients[0].flag).toBe('ok');
  });
});

describe('scoreProduct: weak-hit boilerplate gate + merged-token expansion', () => {
  // Regression for the 2026-07 Gorilla Mind scan: whole-package OCR tokens
  // that shared ONE food word with a DB entry rendered as scored ingredients
  // ("May Cause Occasionally Rapid Heart Rate" as a seed), and comma-loss
  // merges rendered as one nonsense unknown row.

  test('a warning sentence that weak-matches a DB entry is hidden, not scored', () => {
    const result = scoreProduct({
      ingredients: ['whey', 'may cause occasionally rapid heart rate'],
      nutrition: {},
    });
    expect(result.analyzedIngredients.map((i) => i.raw)).toEqual(['whey']);
    expect(result.hiddenUnreadableCount).toBe(1);
  });

  test('real single-shared-token ingredients still render (weak hit must NOT imply hidden)', () => {
    const result = scoreProduct({
      ingredients: ['bay leaf', 'nutritional yeast'],
      nutrition: {},
    });
    expect(result.hiddenUnreadableCount).toBe(0);
    expect(result.analyzedIngredients).toHaveLength(2);
  });

  test('a comma-loss merge of two known compound names splits into both rows', () => {
    const result = scoreProduct({
      ingredients: ['potassium sorbate l-theanine'],
      nutrition: {},
    });
    const raws = result.analyzedIngredients.map((i) => i.raw);
    expect(raws).toEqual(['potassium sorbate', 'l-theanine']);
  });

  test('a one-ingredient name that merely CONTAINS known names is not shredded', () => {
    // "blackberry juice concentrate" must stay one row even though
    // "blackberry" and "juice concentrate" both exist as keys.
    const result = scoreProduct({
      ingredients: ['blackberry juice concentrate'],
      nutrition: {},
    });
    expect(result.analyzedIngredients).toHaveLength(1);
    expect(result.analyzedIngredients[0].raw).toBe('blackberry juice concentrate');
  });
});

// ─── Form-penalty model (2026-08-17, founder-approved) ────────────────────
//
// Fixtures below mirror real catalog products' name/category/ingredients
// exactly (see src/data/products.js) so these tests double as the accuracy
// audit's own regression pins. `isProcessedCuredMeat`, `isFriedSnack`,
// `refinedGrainPenalty`, and `formCap` are read directly off scoreProduct's
// return value (added for this feature) rather than re-implemented here.

describe('scoreProduct: form-penalty model — Rule 1 (processed/cured meat cap 40)', () => {
  test('Hebrew National Beef Franks (name trigger "frank" + nitrite) caps at 40', () => {
    const result = scoreProduct({
      name: 'Beef Franks',
      category: 'Deli & Lunch',
      ingredients: ['beef', 'water', 'contains 2% or less of: salt', 'spice', 'sodium lactate', 'paprika', 'hydrolyzed soy protein', 'garlic powder', 'sodium diacetate', 'sodium erythorbate', 'flavoring', 'sodium nitrite'],
      nutrition: { fat: 15, saturatedFat: 6, sodium: 500, carbs: 1, sugars: 0, protein: 7 },
    });
    expect(result.isProcessedCuredMeat).toBe(true);
    // Real product's own high sodium/sat-fat + flagged additives already
    // drive the base score to 32, BELOW the 40 cap — the cap is a ceiling,
    // not a floor, so it stays at 32 rather than getting pulled UP to 40.
    expect(result.score).toBeLessThanOrEqual(40);
    expect(result.score).toBe(32);
  });

  test('Bob Evans Original Pork Sausage Links (name trigger "sausage", no nitrite) caps at 40', () => {
    const result = scoreProduct({
      name: 'Bob Evans Original Pork Sausage Links',
      category: 'Frozen Breakfast',
      ingredients: ['pork', 'water', 'seasoning (salt, contains 2% or less of each of the following: dextrose, spices, flavoring, monosodium glutamate, maltodextrin, natural flavor)', 'potassium lactate', 'formed in collagen casing'],
      nutrition: { fat: 17, saturatedFat: 6, sodium: 530, carbs: 1, sugars: 0, protein: 10 },
    });
    expect(result.isProcessedCuredMeat).toBe(true);
    expect(result.score).toBe(40);
  });

  test('Applegate deli turkey (category "Deli & Lunch" + meat word, NO nitrite, NO name trigger word) still caps at 40 — WHO Group 1 covers the deli-slicing/brining process itself, not only a disclosed nitrite', () => {
    const result = scoreProduct({
      name: 'Naturals Oven Roasted Turkey Breast',
      brand: 'Applegate',
      category: 'Deli & Lunch',
      ingredients: ['turkey breast', 'water', 'sea salt', 'potato starch', 'salt', 'chicken broth', 'rosemary extract'],
      nutrition: { fat: 0, saturatedFat: 0, sodium: 290, carbs: 0, sugars: 0, protein: 14 },
    });
    expect(result.isProcessedCuredMeat).toBe(true);
    expect(result.score).toBe(40);
  });

  test('nitrate/nitrite alone (trigger a) caps at 40 even with a generic, non-meat-sounding name', () => {
    const result = scoreProduct({
      name: 'Generic Snack Product',
      ingredients: ['sodium nitrite'],
      nutrition: {},
    });
    expect(result.isProcessedCuredMeat).toBe(true);
    expect(result.score).toBeLessThanOrEqual(40);
  });
});

describe('scoreProduct: form-penalty model — Rule 2 (fried snack cap 50)', () => {
  test("Lay's Classic Potato Chips caps at 50", () => {
    const result = scoreProduct({
      name: "Lay's Classic Potato Chips",
      category: 'Chips',
      ingredients: ['potatoes', 'sunflower oil', 'corn oil', 'canola oil', 'salt'],
      nutrition: { fat: 10, saturatedFat: 1.5, sodium: 170, carbs: 15, sugars: 0, protein: 2 },
    });
    expect(result.isFriedSnack).toBe(true);
    expect(result.score).toBe(50);
  });

  test('Fritos Original Corn Chips caps at 50', () => {
    const result = scoreProduct({
      name: 'Fritos Original Corn Chips',
      category: 'Chips & Crackers',
      ingredients: ['CORN', 'VEGETABLE OIL (CORN AND/OR CANOLA OIL)', 'AND SALT'],
      nutrition: { fat: 10, saturatedFat: 1.5, sodium: 170, carbs: 16, sugars: 0, protein: 2 },
    });
    expect(result.isFriedSnack).toBe(true);
    expect(result.score).toBe(50);
  });

  test('Boulder Canyon "Avocado Oil" Kettle Chips caps at 50 — the claimed frying oil does not rescue it', () => {
    const result = scoreProduct({
      name: 'Boulder Canyon Avocado Oil Classic Sea Salt Kettle Chips',
      category: 'Chips & Crackers',
      ingredients: ['potatoes', 'avocado oil', 'sea salt'],
      nutrition: { fat: 9, saturatedFat: 1.5, sodium: 120, carbs: 16, sugars: 0, protein: 3 },
    });
    expect(result.isFriedSnack).toBe(true);
    expect(result.score).toBe(50);
    // Rule 4: avocado oil must not make this "wholeFoodClean" on its own.
    expect(result.wholeFoodClean).toBe(false);
  });

  test('category gate: a chip/crisp/kettle/puff word OUTSIDE a chip-relevant category does not trigger (Gerber Puffs baby food, Kettle & Fire bone broth, Cookie Crisp cereal)', () => {
    const babyPuffs = scoreProduct({
      name: 'Gerber Puffs Strawberry Apple',
      category: 'Baby Food',
      ingredients: ['rice flour', 'whole wheat flour'],
      nutrition: {},
    });
    expect(babyPuffs.isFriedSnack).toBe(false);

    const boneBroth = scoreProduct({
      name: 'Kettle & Fire Classic Chicken Bone Broth',
      category: 'Soups & Broths',
      ingredients: ['chicken broth', 'water'],
      nutrition: {},
    });
    expect(boneBroth.isFriedSnack).toBe(false);

    const cerealChip = scoreProduct({
      name: 'Cookie Crisp Chocolate Chip',
      category: 'Cereals',
      ingredients: ['whole grain corn', 'sugar', 'corn flour'],
      nutrition: {},
    });
    expect(cerealChip.isFriedSnack).toBe(false);
  });

  test('"chocolate chip" in a Snack Bar/Cereal-category name never trips the bare "chip" trigger', () => {
    const result = scoreProduct({
      name: 'Quaker Chewy Chocolate Chip Granola Bar',
      category: 'Snack Bars',
      ingredients: ['granola', 'sugar', 'chocolate chips'],
      nutrition: {},
    });
    expect(result.isFriedSnack).toBe(false);
  });

  test('an explicit "Oven Baked" claim exempts a Chips & Crackers item from the fried-snack cap (real catalog case: Lay\'s Oven Baked Potato Crisps)', () => {
    const result = scoreProduct({
      name: "Lay's Oven Baked Original Potato Crisps",
      category: 'Chips & Crackers',
      ingredients: ['dried potatoes', 'corn starch', 'sunflower oil'],
      nutrition: {},
    });
    expect(result.isFriedSnack).toBe(false);
  });

  test('the lower cap wins when a product triggers both Rule 1 and Rule 2 (fried, cured-meat-named snack)', () => {
    const result = scoreProduct({
      name: 'Fried Pork Rinds Bacon Flavor',
      category: 'Chips & Crackers',
      ingredients: ['pork skins', 'salt', 'sodium nitrite'],
      nutrition: {},
    });
    expect(result.isProcessedCuredMeat).toBe(true);
    expect(result.isFriedSnack).toBe(true);
    expect(result.formCap).toBe(40);
    expect(result.score).toBeLessThanOrEqual(40);
  });
});

describe('scoreProduct: form-penalty model — Rule 3 (refined-grain #1 ingredient, -25 penalty)', () => {
  test('enriched wheat flour as the #1 ingredient takes the -25 penalty', () => {
    const withRefined = scoreProduct({
      name: 'Refined Flour Muffin',
      category: 'Bread',
      ingredients: ['enriched wheat flour', 'malted barley flour', 'water', 'sugar', 'salt', 'yeast'],
      nutrition: { sugars: 2, sodium: 200, saturatedFat: 0.5 },
    });
    const withoutRefined = scoreProduct({
      name: 'Refined Flour Muffin',
      category: 'Bread',
      ingredients: ['whole wheat flour', 'malted barley flour', 'water', 'sugar', 'salt', 'yeast'],
      nutrition: { sugars: 2, sodium: 200, saturatedFat: 0.5 },
    });
    expect(withRefined.refinedGrainPenalty).toBe(25);
    expect(withoutRefined.refinedGrainPenalty).toBe(0);
    // Not an exact -25 delta on the FINAL score: swapping "enriched wheat
    // flour" for "whole wheat flour" also changes that one ingredient's own
    // DB-matched risk (enriched = moderate/risk 5/penalty 12.5; whole wheat
    // = ok/risk 2/penalty 0), which is separate from and additional to
    // Rule 3's -25. Directional check instead — refined scores meaningfully
    // lower, and by at least the 25-point penalty itself.
    expect(withRefined.score).toBeLessThan(withoutRefined.score);
    expect(withoutRefined.score - withRefined.score).toBeGreaterThanOrEqual(25);
  });

  test('a refined grain further down the list (not #1) does not trigger the penalty', () => {
    const result = scoreProduct({
      name: 'Not First Ingredient',
      ingredients: ['tomatoes', 'water', 'enriched wheat flour', 'salt'],
      nutrition: {},
    });
    expect(result.refinedGrainPenalty).toBe(0);
  });

  test('whole-grain, almond-flour, and legume-flour #1 ingredients are never penalized', () => {
    for (const first of ['whole wheat flour', 'brown rice', 'oats', 'almond flour', 'chickpea flour', 'coconut flour']) {
      const result = scoreProduct({ ingredients: [first, 'water', 'salt'], nutrition: {} });
      expect(result.refinedGrainPenalty).toBe(0);
    }
  });

  test('the -25 penalty floors at 0, never goes negative', () => {
    const result = scoreProduct({
      name: 'Terrible Refined Product',
      ingredients: ['enriched flour', 'partially hydrogenated oil', 'sodium nitrite', 'red 40', 'yellow 5'],
      nutrition: { sugars: 40, sodium: 900, saturatedFat: 15 },
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });
});

describe('scoreProduct: form-penalty model — Rule 4 (snack/frying oils neutral, never a positive)', () => {
  test('"avocado oil" as an ingredient does not make a product wholeFoodClean or count toward the raw-100 path', () => {
    const result = scoreProduct({
      ingredients: ['potatoes', 'avocado oil', 'sea salt'],
      nutrition: { sugars: 0, sodium: 120, saturatedFat: 1.5 },
    });
    expect(result.wholeFoodClean).toBe(false);
    expect(result.markerCount).toBeGreaterThan(0);
  });

  test('a whole avocado (no "oil") still gets full whole-food credit', () => {
    const result = scoreProduct({
      ingredients: ['avocado'],
      nutrition: { sugars: 1, sodium: 5, saturatedFat: 2 },
    });
    expect(result.wholeFoodClean).toBe(true);
  });

  test('canola / sunflower / safflower / soybean / vegetable oil are all treated as processing markers, not a whole-food credit', () => {
    for (const oil of ['canola oil', 'sunflower oil', 'safflower oil', 'soybean oil', 'vegetable oil']) {
      const result = scoreProduct({
        ingredients: ['oats', oil, 'salt'],
        nutrition: { sugars: 0, sodium: 100, saturatedFat: 1 },
      });
      expect(result.wholeFoodClean).toBe(false);
    }
  });
});

describe('scoreProduct: form-penalty model — safeguards (accuracy, not blunt category caps)', () => {
  test('Simple Mills Almond Flour Crackers (fried-snack category, but not fried or refined-grain; contains organic sunflower oil) is untouched by every new rule and stays at its real 93 — proves Rule 4 does not double-penalize an already-flagged Medium-risk oil via the UPF ceiling', () => {
    const result = scoreProduct({
      name: 'Simple Mills Almond Flour Crackers Fine Ground Sea Salt',
      category: 'Chips & Crackers',
      ingredients: ['nut and seed flour blend (almonds, sunflower seeds, flax seeds)', 'tapioca', 'cassava', 'organic sunflower oil', 'sea salt', 'organic onion', 'organic garlic', 'rosemary extract (for freshness)'],
      nutrition: { fat: 9, saturatedFat: 0.5, sodium: 230, carbs: 17, sugars: 0, protein: 3 },
      certifications: ['Gluten-Free Certified', 'Non-GMO Project Verified'],
    });
    expect(result.isProcessedCuredMeat).toBe(false);
    expect(result.isFriedSnack).toBe(false);
    expect(result.refinedGrainPenalty).toBe(0);
    expect(result.formCap).toBeNull();
    expect(result.score).toBe(93);
  });

  test("Mary's Gone Crackers (whole-grain, fried-snack category) is untouched by every new rule and stays at its real 94", () => {
    const result = scoreProduct({
      name: "Mary's Gone Crackers Original Crackers",
      category: 'Chips & Crackers',
      ingredients: ['brown rice', 'quinoa', 'flax seeds', 'sesame seeds', 'tamari (water, soybeans, salt, vinegar)', 'sea salt'],
      nutrition: { fat: 5, saturatedFat: 0.5, sodium: 180, carbs: 20, sugars: 0, protein: 4 },
      certifications: ['USDA Organic', 'Non-GMO Project'],
    });
    expect(result.isProcessedCuredMeat).toBe(false);
    expect(result.isFriedSnack).toBe(false);
    expect(result.refinedGrainPenalty).toBe(0);
    expect(result.formCap).toBeNull();
    expect(result.score).toBe(94);
  });

  test('a plain fresh chicken breast is never treated as processed/cured meat', () => {
    const result = scoreProduct({
      name: 'Grilled Chicken Breast Strips',
      category: 'Meat & Seafood / Primary Proteins',
      ingredients: ['chicken breast', 'water', 'salt'],
      nutrition: { fat: 2, saturatedFat: 0.5, sodium: 300, carbs: 0, sugars: 0, protein: 20 },
    });
    expect(result.isProcessedCuredMeat).toBe(false);
  });

  test('plain fresh salmon, ground beef, and eggs are never treated as processed/cured meat', () => {
    for (const fixture of [
      { name: 'Fresh Atlantic Salmon Fillet', category: 'Meat & Seafood / Primary Proteins', ingredients: ['salmon'] },
      { name: '80/20 Ground Beef', category: 'Meat & Seafood / Primary Proteins', ingredients: ['beef'] },
      { name: 'Grade A Large Eggs', category: 'Eggs', ingredients: ['eggs'] },
    ]) {
      const result = scoreProduct({ ...fixture, nutrition: {} });
      expect(result.isProcessedCuredMeat).toBe(false);
    }
  });

  test('word-boundary matching: "graham" and "hamburger" are never matched by the "ham" trigger', () => {
    const graham = scoreProduct({
      name: 'Honey Graham Crackers',
      category: 'Chips & Crackers',
      ingredients: ['whole wheat flour', 'sugar', 'honey'],
      nutrition: {},
    });
    expect(graham.isProcessedCuredMeat).toBe(false);

    const hamburgerBun = scoreProduct({
      name: 'Hamburger Buns',
      category: 'Bread',
      ingredients: ['whole wheat flour', 'water', 'yeast', 'sugar', 'salt'],
      nutrition: {},
    });
    expect(hamburgerBun.isProcessedCuredMeat).toBe(false);
  });

  test('"Hot Dog Buns" and "Frankfurter Buns" are bread, not the meat itself, and are not capped (real catalog case: Wonder Classic Enriched Hot Dog Buns)', () => {
    const hotDogBuns = scoreProduct({
      name: 'Wonder Classic Enriched Hot Dog Buns',
      category: 'Bread',
      ingredients: ['enriched wheat flour', 'water', 'yeast'],
      nutrition: {},
    });
    expect(hotDogBuns.isProcessedCuredMeat).toBe(false);

    const frankfurterBuns = scoreProduct({
      name: 'Frankfurter Buns',
      category: 'Bread',
      ingredients: ['enriched wheat flour', 'water', 'yeast'],
      nutrition: {},
    });
    expect(frankfurterBuns.isProcessedCuredMeat).toBe(false);
  });

  test('"Frank\'s RedHot" (possessive brand name) is not matched by bare "frank" (real catalog case: Frank\'s RedHot Original Cayenne Pepper Sauce)', () => {
    const hotSauce = scoreProduct({
      name: "Frank's RedHot Original Cayenne Pepper Sauce",
      category: 'Condiments & Sauces',
      ingredients: ['cayenne red peppers', 'distilled vinegar', 'water', 'salt', 'garlic powder'],
      nutrition: {},
    });
    expect(hotSauce.isProcessedCuredMeat).toBe(false);
  });

  test('a genuine trigger word elsewhere in the same name still fires even when the bun/possessive exception also applies', () => {
    const result = scoreProduct({
      name: "Frank's Bacon Hot Dog Buns",
      category: 'Bread',
      ingredients: ['enriched wheat flour', 'water', 'bacon bits'],
      nutrition: {},
    });
    expect(result.isProcessedCuredMeat).toBe(true);
  });

  test('a product the catalog\'s own schema declares vegan is never treated as processed/cured meat, even when its name says "sausage" (real catalog case: MorningStar Farms Veggie Sausage Patties)', () => {
    const result = scoreProduct({
      name: 'MorningStar Farms Veggie Sausage Patties Original',
      category: 'Frozen Breakfast',
      isVegan: true,
      ingredients: ['water', 'wheat gluten', 'soy protein concentrate', 'vegetable oil (corn, canola and/or sunflower)', 'soy flour', 'soy protein isolate'],
      nutrition: { fat: 7, saturatedFat: 1, sodium: 520, carbs: 8, sugars: 1, protein: 16 },
    });
    expect(result.isProcessedCuredMeat).toBe(false);
  });

  test('a whole-wheat bread #1 ingredient is never refined-grain-penalized', () => {
    const result = scoreProduct({
      name: 'Whole Wheat Bread',
      category: 'Bread',
      ingredients: ['whole wheat flour', 'water', 'yeast', 'salt'],
      nutrition: {},
    });
    expect(result.refinedGrainPenalty).toBe(0);
  });

  test('hummus filed under the same "Deli & Lunch" category as deli meat is never treated as processed/cured meat', () => {
    const result = scoreProduct({
      name: 'Classic Hummus',
      brand: 'Sabra',
      category: 'Deli & Lunch',
      ingredients: ['cooked chickpeas', 'tahini', 'soybean oil', 'garlic', 'salt'],
      nutrition: {},
    });
    expect(result.isProcessedCuredMeat).toBe(false);
  });
});
