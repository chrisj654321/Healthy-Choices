/**
 * Tests for scripts/catalog-database/validate-ingredients.js — the Octavius
 * pipeline guardrail that stops paraphrased/contaminated ingredient text from
 * being merged into products.js.
 *
 * The primary fixture is the real Phase 1-2 bug (Ben's rice): a lead-in
 * disclaimer ("less than 2%") + editorial commentary ("that adds a trivial
 * amount of saturated fat") glued onto one ingredient token, plus a USDA
 * bioengineered disclosure stored as its own fake ingredient row.
 */
const { validateIngredients, checkToken } = require('../validate-ingredients');

describe('validateIngredients: the reference contamination bug', () => {
  test('flags the Ben\'s-rice-style contaminated ingredients', () => {
    const offenders = validateIngredients([
      'parboiled long grain brown rice (less than 2% canola oil that adds a trivial amount of saturated fat)',
      'and bioengineered food ingredient',
    ]);
    expect(offenders).toHaveLength(2);

    const riceToken = offenders.find((o) => o.token.startsWith('parboiled'));
    expect(riceToken.reasons).toEqual(
      expect.arrayContaining(['advisory-or-lead-in-disclaimer-text', 'editorial-commentary-glued-to-ingredient'])
    );

    const bioengineeredToken = offenders.find((o) => o.token.includes('bioengineered'));
    expect(bioengineeredToken.reasons).toContain('bioengineered-disclosure-stored-as-ingredient');
  });

  test('passes the same product once cleaned to verbatim, separated ingredients', () => {
    const offenders = validateIngredients(['parboiled long grain brown rice', 'water', 'canola oil']);
    expect(offenders).toEqual([]);
  });
});

describe('validateIngredients: individual contamination categories', () => {
  test('flags a glued lead-in disclaimer left inside a token', () => {
    const offenders = validateIngredients(['contains 2% or less of: soy lecithin']);
    expect(offenders).toHaveLength(1);
    expect(offenders[0].reasons).toContain('advisory-or-lead-in-disclaimer-text');
  });

  test('flags editorial commentary glued to a real ingredient', () => {
    const offenders = validateIngredients(['riboflavin which is a source of vitamin b2']);
    expect(offenders).toHaveLength(1);
    expect(offenders[0].reasons).toContain('editorial-commentary-glued-to-ingredient');
  });

  test('flags a bioengineered disclosure stored as an ingredient row', () => {
    const offenders = validateIngredients(['produced with genetic engineering']);
    expect(offenders).toHaveLength(1);
    expect(offenders[0].reasons).toContain('bioengineered-disclosure-stored-as-ingredient');
  });

  test('flags nutrition-facts / packaging OCR text', () => {
    const offenders = validateIngredients(['nutrition facts serving size 1 cup', 'questions? call 1-800-555-0100']);
    expect(offenders).toHaveLength(2);
    for (const o of offenders) expect(o.reasons).toContain('nutrition-facts-or-packaging-text');
  });

  test('flags an overly long run-on token with no list structure', () => {
    const offenders = validateIngredients(['canola oil that somebody decided to describe in far too many words here']);
    expect(offenders[0].reasons.length).toBeGreaterThan(0);
  });
});

describe('validateIngredients: verbatim label text is NOT flagged (false-positive guard)', () => {
  test('a real parenthetical oil-blend disclosure passes clean', () => {
    const offenders = validateIngredients(['vegetable oil (canola oil, corn oil, soybean oil, sunflower oil)']);
    expect(offenders).toEqual([]);
  });

  test('a real bracketed sub-ingredient disclosure passes clean', () => {
    const offenders = validateIngredients([
      'diced tomatoes in juice [diced tomatoes, tomato juice, calcium chloride (firming aid), citric acid]',
    ]);
    expect(offenders).toEqual([]);
  });

  test('a bare "and/or" oil-sourcing blend with no brackets passes clean', () => {
    const offenders = validateIngredients(['canola oil and/or safflower oil and/or sunflower oil']);
    expect(offenders).toEqual([]);
  });

  test('a known short no-vowel ingredient (tbhq) is not misflagged as garbage', () => {
    const offenders = validateIngredients(['tbhq']);
    expect(offenders).toEqual([]);
  });

  test('ordinary short real ingredient names pass clean', () => {
    const offenders = validateIngredients(['salt', 'sugar', 'water', 'whole grain oats', 'modified corn starch']);
    expect(offenders).toEqual([]);
  });
});

describe('validateIngredients: malformed input', () => {
  test('a non-array ingredients field is flagged rather than crashing', () => {
    const offenders = validateIngredients(undefined);
    expect(offenders).toHaveLength(1);
    expect(offenders[0].reasons).toContain('ingredients-not-an-array');
  });

  test('an empty ingredients array is clean (no offenders, not this validator\'s job to reject empties)', () => {
    expect(validateIngredients([])).toEqual([]);
  });
});

describe('checkToken', () => {
  test('returns an empty array for an empty/whitespace token', () => {
    expect(checkToken('')).toEqual([]);
    expect(checkToken('   ')).toEqual([]);
  });
});
