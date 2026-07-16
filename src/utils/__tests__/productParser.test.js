/**
 * Tests for parseIngredients() in src/utils/productParser.js, which now
 * delegates to the shared ingredientNormalizer (see
 * src/utils/__tests__/ingredientNormalizer.test.js for the normalizer's own
 * unit tests). These tests pin down the OpenFoodFacts-shaped call contract.
 */
import { parseIngredients } from '../productParser';

describe('parseIngredients', () => {
  test('returns [] when there is no ingredients text on any known field', () => {
    expect(parseIngredients({})).toEqual([]);
  });

  test('prefers ingredients_text_en, falls back to ingredients_text, falls back to ingredients array', () => {
    expect(parseIngredients({ ingredients_text_en: 'Sugar, Salt' })).toEqual(['sugar', 'salt']);
    expect(parseIngredients({ ingredients_text: 'Sugar, Salt' })).toEqual(['sugar', 'salt']);
    expect(
      parseIngredients({ ingredients: [{ text: 'Sugar' }, { text: 'Salt' }] })
    ).toEqual(['sugar', 'salt']);
  });

  test('duplicate oils in a vegetable-oil disclosure collapse to one entry each, generic term dropped', () => {
    const tokens = parseIngredients({
      ingredients_text_en: 'Vegetable Oil (Canola Oil, Sunflower Oil), Sugar, Canola Oil',
    });
    expect(tokens).toEqual(['canola oil', 'sunflower oil', 'sugar']);
  });

  test('advisory/label phrases like "Added To Preserve Freshness" are filtered out', () => {
    const tokens = parseIngredients({ ingredients_text_en: 'Whey, Added To Preserve Freshness, Lactose' });
    expect(tokens).toEqual(['whey', 'lactose']);
  });
});
