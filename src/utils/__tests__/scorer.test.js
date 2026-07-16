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
    // No `packaging` field on this fixture -> packaging is unresearched, so
    // this doesn't qualify for the literal-100 raw-whole-food ceiling (2026-07-09
    // rule: assume plastic/unverified packaging until proven otherwise) even
    // though "blackberries" itself has no processing indicator. It lands at
    // the processed-clean ceiling (96) instead.
    const result = scoreProduct({ ingredients: ['blackberries'], nutrition: { sugars: 7 } });
    expect(result.wholeFoodClean).toBe(true);
    expect(result.isRawWholeFood).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(95);
    expect(result.score).toBe(96);
  });

  test('whole-food clean nutrition penalty is waived to at most 5 points even with high sugar', () => {
    // sugars: 35 -> raw nutritionPenalty would be 12, but the whole-food-clean
    // path only applies min(nutritionPenalty * 0.25, 5) => min(3, 5) = 3.
    // Packaging is unresearched -> default assume-plastic penalty of 2 applies.
    const result = scoreProduct({ ingredients: ['blackberries'], nutrition: { sugars: 35 } });
    expect(result.wholeFoodClean).toBe(true);
    expect(result.nutritionPenalty).toBe(12);
    expect(result.score).toBe(95); // 100 - 3 (waived nutrition hit) - 2 (assumed packaging)
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
    // raw penalty (25 + 22.5 = 47.5) drives it below the ceiling; -2 more from
    // the default assume-plastic packaging penalty (no packaging data here).
    expect(result.score).toBe(51);
  });
});

describe('scoreProduct: allergen flag = zero penalty', () => {
  test('an ingredient flagged "allergen" in the DB (peanuts) contributes zero penalty', () => {
    const result = scoreProduct({ ingredients: ['peanuts'], nutrition: {} });
    const item = result.analyzedIngredients[0];
    expect(item.flag).toBe('allergen');
    expect(item.penalty).toBe(0);
    // allergen is not a "concern" flag for wholeFoodClean purposes, so this is
    // still wholeFoodClean — but with no packaging data present it isn't
    // eligible for the literal-100 raw-whole-food ceiling, so it lands at the
    // processed-clean ceiling (96) instead.
    expect(result.score).toBe(96);
  });
});

describe('scoreProduct: certification bonus', () => {
  test('a product with one certification scores +3 over the same product with none, when not clamped by the ceiling', () => {
    // 'sugar' (risk 4, flag moderate) is not a upfMarker (sweeteners only count
    // as markers when flag is avoid/caution), so the ceiling (96, since no
    // packaging data is present) stays well above the computed score and
    // doesn't interfere with reading the cert bonus directly. No packaging
    // data -> the default assume-plastic penalty (2) applies to both.
    const base = { ingredients: ['sugar'], nutrition: {} };
    const withoutCert = scoreProduct(base);
    const withCert = scoreProduct({ ...base, certifications: ['USDA Organic'] });
    expect(withoutCert.certBonus).toBe(0);
    expect(withCert.certBonus).toBe(3);
    expect(withCert.score).toBe(withoutCert.score + 3);
    expect(withoutCert.score).toBe(88);
    expect(withCert.score).toBe(91);
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
