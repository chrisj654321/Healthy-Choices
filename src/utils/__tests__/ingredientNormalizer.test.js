/**
 * Tests for src/utils/ingredientNormalizer.js — the shared parser used by
 * both the app runtime (productParser.js) and the build-time ingest script
 * (scripts/ingest-products.js).
 *
 * Fixtures are taken directly from real founder scan screenshots (see the
 * P0 ingredient data-quality brief): duplicate oils, "Added To Preserve
 * Freshness" ranked as a real ingredient, and OCR garbage rows.
 */
import {
  normalizeIngredientTokens,
  classifyTokenPlausibility,
  isLabelBoilerplate,
  segmentIntoKnownIngredients,
} from '../ingredientNormalizer';

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

describe('normalizeIngredientTokens + classifyTokenPlausibility: vandalized third-party (live OFF) data', () => {
  // Real-world incident: a vandalized OpenFoodFacts listing injected a fake
  // narrative into ingredients_text, which rendered as ranked ingredients and
  // leaked into the auto-generated "Food Exposé Says" summary as if it were
  // the app's own claim (including a false statement about a real
  // acquisition). Mirrors the real pipeline: normalize first (strips
  // advisory-pattern matches, dedupes), then each token that fails an
  // ingredient lookup goes through the plausibility gate.
  const text =
    'Dry Roasted Peanuts, Palm Oil, I Was One Of The First People That Worked For Justin, Justin Sold Out To Kraft Or Nestle For Hundreds Of Millions, Only Kinda Sketchy Ingredient 20 Years Ago Was Palm Oil, Local Boulder Colorado Nut Butter';

  test('the "local ..." sourcing-descriptor phrase is stripped at normalization', () => {
    const tokens = normalizeIngredientTokens(text);
    expect(tokens).not.toContain('local boulder colorado nut butter');
    expect(tokens).toEqual(
      expect.arrayContaining(['dry roasted peanuts', 'palm oil'])
    );
  });

  test('every surviving narrative-sentence token is caught as garbage by the plausibility gate (never rendered, never quoted in the score summary)', () => {
    const tokens = normalizeIngredientTokens(text);
    const narrativeTokens = tokens.filter((t) => t.includes('justin') || t.includes('sketchy'));
    expect(narrativeTokens.length).toBeGreaterThan(0); // sanity: they did survive normalization
    for (const t of narrativeTokens) {
      expect(classifyTokenPlausibility(t, new Set()).verdict).toBe('garbage');
    }
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

describe('normalizeIngredientTokens: label-section truncation (whole-package OCR)', () => {
  // Real-world case (2026-07 founder scan, Gorilla Mind energy drink): the
  // OFF ingredients field was OCR'd off the ENTIRE can, running past the
  // declaration into Nutrition Facts, the warning box, and the address —
  // which rendered rows like "Boise", "Cans Per Day", and "Nutrition Facts
  // Serving Size 1 Can" as ingredients.
  const ocrText =
    'Carbonated Filtered Water, Citric Acid, Natural Flavors, Sucralose, Sodium Benzoate, ' +
    'Potassium Sorbate, Niacinamide, Calcium Pantothenate. ' +
    'Nutrition Facts Serving Size 1 Can 16 Fl Oz. Calories 5 Total Fat 0g Sodium 5mg. ' +
    'Warning: Do Not Exceed 2 Cans Per Day. Consult A Qualified Healthcare Professional Before Use. ' +
    'Gorilla Mind, Boise, ID, USA @gorillamind Gorillamind.com Please Recycle';

  test('everything after the Nutrition Facts marker is cut before tokenizing', () => {
    const tokens = normalizeIngredientTokens(ocrText);
    expect(tokens).toEqual([
      'carbonated filtered water',
      'citric acid',
      'natural flavors',
      'sucralose',
      'sodium benzoate',
      'potassium sorbate',
      'niacinamide',
      'calcium pantothenate',
    ]);
    expect(tokens).not.toContain('boise');
    expect(tokens.some((t) => t.includes('cans per day'))).toBe(false);
    expect(tokens.some((t) => t.includes('serving size'))).toBe(false);
  });

  test('a lone trailing marker phrase cuts the tail too (warning box without a facts panel)', () => {
    const tokens = normalizeIngredientTokens(
      'Water, Sugar, Citric Acid, Warning: Keep Out Of Reach Of Children'
    );
    expect(tokens).toEqual(['water', 'sugar', 'citric acid']);
  });

  test('a marker inside the first characters does NOT wipe the declaration', () => {
    // "Ingredients:"-style headers sometimes mis-scrape; never cut at index < 20.
    const tokens = normalizeIngredientTokens('Serving Size Water, Sugar');
    expect(tokens.length).toBeGreaterThan(0);
  });

  test('normal labels without markers are untouched', () => {
    const tokens = normalizeIngredientTokens('Peanuts, Sea Salt');
    expect(tokens).toEqual(['peanuts', 'sea salt']);
  });
});

describe('isLabelBoilerplate: weak-hit screen', () => {
  test('flags warning/panel/address sentences that share a food word with the DB', () => {
    expect(isLabelBoilerplate('may cause occasionally rapid heart rate')).toBe(true);
    expect(isLabelBoilerplate('nutrition facts serving size 1 can 16 fl oz')).toBe(true);
    expect(isLabelBoilerplate('usa @gorillamind gorillamind.com please recycle')).toBe(true);
    expect(isLabelBoilerplate('consult a qualified healthcare professional before use')).toBe(true);
  });

  test('never flags real ingredients — including weak-match shapes the catalog probe surfaced', () => {
    expect(isLabelBoilerplate('bay leaf')).toBe(false);
    expect(isLabelBoilerplate('riboflavin vitamin b2')).toBe(false);
    expect(isLabelBoilerplate('flavor enhancer e621')).toBe(false);
    expect(isLabelBoilerplate('yellow 5 & 6')).toBe(false);
    expect(isLabelBoilerplate('nutritional yeast')).toBe(false);
    expect(isLabelBoilerplate('organic grade a milk and organic grade a cream')).toBe(false);
  });
});

describe('segmentIntoKnownIngredients: comma-loss merges', () => {
  const keys = new Set([
    'potassium sorbate', 'l-theanine', 'sodium benzoate', 'saffron extract',
    'blackberry', 'juice concentrate', 'dried', 'cheddar cheese',
    'palm oil', 'carrageenan',
  ]);

  test('splits two glued multi-word ingredients', () => {
    expect(segmentIntoKnownIngredients('potassium sorbate l-theanine', keys)).toEqual([
      'potassium sorbate',
      'l-theanine',
    ]);
  });

  test('never splits when any piece would be a bare single word', () => {
    // "blackberry juice concentrate" is ONE ingredient, not blackberry + juice
    // concentrate; "dried cheddar cheese" is not dried + cheddar cheese.
    expect(segmentIntoKnownIngredients('blackberry juice concentrate', keys)).toBeNull();
    expect(segmentIntoKnownIngredients('dried cheddar cheese', keys)).toBeNull();
  });

  test('returns null when a word is unaccounted for (no partial invention)', () => {
    expect(segmentIntoKnownIngredients('potassium sorbate mysteryzine', keys)).toBeNull();
  });

  test('leaves a token alone when it is itself a known name', () => {
    expect(segmentIntoKnownIngredients('sodium benzoate', keys)).toBeNull();
  });
});
