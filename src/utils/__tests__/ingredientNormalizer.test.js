/**
 * Tests for src/utils/ingredientNormalizer.js — the shared parser used by
 * both the app runtime (productParser.js) and the build-time ingest script
 * (scripts/ingest-products.js).
 *
 * Fixtures are taken directly from real founder scan screenshots (see the
 * P0 ingredient data-quality brief): duplicate oils, "Added To Preserve
 * Freshness" ranked as a real ingredient, and OCR garbage rows.
 */
import { normalizeIngredientTokens, classifyTokenPlausibility } from '../ingredientNormalizer';

describe('normalizeIngredientTokens: oil disclosure resolution', () => {
  test('"Vegetable Oil (Canola Oil, Sunflower Oil), Sugar, Canola Oil" yields each oil once, no generic row', () => {
    const tokens = normalizeIngredientTokens(
      'Vegetable Oil (Canola Oil, Sunflower Oil), Sugar, Canola Oil'
    );
    expect(tokens).toEqual(['canola oil', 'sunflower oil', 'sugar']);
    expect(tokens).not.toContain('vegetable oil');
    // Each oil appears exactly once even though canola oil was listed twice.
    expect(tokens.filter((t) => t === 'canola oil')).toHaveLength(1);
    expect(tokens.filter((t) => t === 'sunflower oil')).toHaveLength(1);
  });

  test('bare oil names in the disclosure get the " oil" suffix so they match oil profiles', () => {
    const tokens = normalizeIngredientTokens('Vegetable Oil (Canola and/or Sunflower), Salt');
    expect(tokens).toEqual(['canola oil', 'sunflower oil', 'salt']);
  });

  test('falls back to normal handling when the parenthetical contains something unrecognized', () => {
    const tokens = normalizeIngredientTokens('Vegetable Oil (Canola Oil, Mystery Fat), Salt');
    // Not all-known -> parent + contents both emitted (existing behavior).
    expect(tokens).toEqual(['vegetable oil', 'canola oil', 'mystery fat', 'salt']);
  });
});

describe('normalizeIngredientTokens: advisory-phrase filtering', () => {
  test('"Whey, Added To Preserve Freshness, Lactose" drops the advisory phrase', () => {
    const tokens = normalizeIngredientTokens('Whey, Added To Preserve Freshness, Lactose');
    expect(tokens).toEqual(['whey', 'lactose']);
  });

  test('drops "may contain", "contains 2% or less of", and "for freshness" style phrases', () => {
    const tokens = normalizeIngredientTokens(
      'Salt, Spices, May Contain Tree Nuts, Contains 2% Or Less Of Citric Acid, Added For Freshness'
    );
    expect(tokens).not.toEqual(expect.arrayContaining(['may contain tree nuts']));
    expect(tokens).toContain('salt');
    expect(tokens).toContain('spices');
  });
});

describe('normalizeIngredientTokens: dedup', () => {
  test('drops exact repeats of the same normalized token, first occurrence wins', () => {
    const tokens = normalizeIngredientTokens('Sugar, Salt, Sugar, Water, Salt');
    expect(tokens).toEqual(['sugar', 'salt', 'water']);
  });
});

describe('normalizeIngredientTokens: regression — normal comma lists unchanged', () => {
  test('a real multi-ingredient label parses the same as the pre-change parser', () => {
    const text =
      'Enriched Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Palm Oil, Cocoa (Processed With Alkali), Salt, Baking Soda, Soy Lecithin, Natural Flavor';
    const tokens = normalizeIngredientTokens(text);
    expect(tokens).toEqual([
      'enriched flour',
      'wheat flour',
      'niacin',
      'reduced iron',
      'thiamine mononitrate',
      'riboflavin',
      'folic acid',
      'sugar',
      'palm oil',
      'cocoa',
      'processed with alkali',
      'salt',
      'baking soda',
      'soy lecithin',
      'natural flavor',
    ]);
  });
});

describe('classifyTokenPlausibility', () => {
  const knownKeys = new Set(['soybean oil', 'soybean', 'canola oil', 'sodium stearoyl lactylate']);

  test('rescues "sgybean" to "soybean" (edit-distance 1)', () => {
    const result = classifyTokenPlausibility('sgybean', knownKeys);
    expect(result.verdict).toBe('rescued');
    expect(result.rescuedTo).toBe('soybean');
  });

  test('flags OCR garbage rows as garbage', () => {
    expect(classifyTokenPlausibility('balle creak', knownKeys).verdict).toBe('garbage');
    expect(classifyTokenPlausibility('mi 49015 usa austin® cneese', knownKeys).verdict).toBe('garbage');
    expect(classifyTokenPlausibility('unequar', knownKeys).verdict).toBe('garbage');
  });

  test('never rejects legitimate long ingredient names', () => {
    expect(classifyTokenPlausibility('partially hydrogenated soybean oil', knownKeys).verdict).toBe('ok');
    expect(classifyTokenPlausibility('sodium stearoyl lactylate', knownKeys).verdict).toBe('ok');
  });

  test('a bare number is garbage', () => {
    expect(classifyTokenPlausibility('49015', knownKeys).verdict).toBe('garbage');
  });
});
