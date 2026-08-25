/**
 * Tests for parseIngredients() in src/utils/productParser.js, which now
 * delegates to the shared ingredientNormalizer (see
 * src/utils/__tests__/ingredientNormalizer.test.js for the normalizer's own
 * unit tests). These tests pin down the OpenFoodFacts-shaped call contract.
 */
import { parseIngredients, findCompanyId, buildProductFromRaw, detectContainsBioengineered } from '../productParser';
import { BRAND_TO_COMPANY, COMPANY_DB } from '../../data/companies';

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

/**
 * findCompanyId() resolves a brand string in three stages: (1) BRAND_TO_COMPANY
 * exact/substring keys, (2) BRAND_PARENT_MAP -> fuzzy COMPANY_DB name match,
 * (3) NEW — direct COMPANY_DB record-NAME matching, added because most of the
 * OpenFoodFacts bulk dump's "brand" field is the *manufacturer's legal name*
 * ("General Mills, Inc.", "The Kroger Co.") rather than a consumer brand, and
 * none of those legal names are (or should be) BRAND_TO_COMPANY keys.
 *
 * Stage (3) is intentionally conservative — see productParser.js's comments
 * above matchCompanyDbName/isTrustworthyPrefixPair for the full reasoning.
 * The tests below are grouped to make that reasoning checkable: new
 * resolutions, a hard no-regression pass over every pre-existing brand key,
 * and real near-collisions (constructed from actual COMPANY_DB records) that
 * must NOT cross-map.
 */
describe('findCompanyId — COMPANY_DB name matching (stage 3)', () => {
  test('resolves manufacturer legal names straight from the OFF bulk dump', () => {
    // Real strings pulled from src/data/products_generated.json, with real
    // SKU counts at time of writing.
    expect(findCompanyId('General Mills, Inc.')).toBe('general-mills');       // 929 SKUs
    expect(findCompanyId('GENERAL MILLS SALES INC.')).toBe('general-mills');  // 1,401 SKUs
    expect(findCompanyId('The Kroger Co.')).toBe('kroger');                   // 1,629 SKUs
    expect(findCompanyId('Wal-Mart Stores, Inc.')).toBe('walmart');           // 2,966 SKUs — biggest single owner in the catalog
    expect(findCompanyId('WAL-MART STORES')).toBe('walmart');
    expect(findCompanyId('WAL-MART')).toBe('walmart');
  });

  test('bridges an initialism legal name to its COMPANY_DB record ("H-E-B")', () => {
    // COMPANY_DB['heb'].name is literally "H-E-B". The real OFF brand text is
    // spelled out ("H E Butt Grocery Company", 477 SKUs) — plain prefix
    // matching can't bridge "Butt" -> "B", so this needs the initialism rule.
    expect(COMPANY_DB.heb.name).toBe('H-E-B');
    expect(findCompanyId('H E Butt Grocery Company')).toBe('heb');
    expect(findCompanyId('H-E-B')).toBe('heb');
  });

  test('does not fuzzy-match a real subsidiary that has no COMPANY_DB record of its own', () => {
    // Fred Meyer, King Soopers, and Ralphs are real Kroger subsidiaries
    // (COMPANY_DB.kroger.subsidiaries lists all three) but none of them has
    // its own COMPANY_DB entry or a curated BRAND_TO_COMPANY/BRAND_PARENT_MAP
    // mapping — resolving their legal names onto "kroger" (or anything else)
    // would be a guess this app must not make on its own. (Harris Teeter,
    // the fourth subsidiary in that same list, is intentionally excluded
    // from this test: it now HAS a curated 'harris-teeter inc.' -> 'kroger'
    // entry in src/data/companies.js, a deliberate business decision made
    // upstream of this resolver, not something stage 3 should second-guess.)
    expect(COMPANY_DB.kroger.subsidiaries).toEqual(
      expect.arrayContaining(['Fred Meyer', 'King Soopers', 'Ralphs'])
    );
    expect(COMPANY_DB['fred-meyer']).toBeUndefined();
    expect(COMPANY_DB['king-soopers']).toBeUndefined();
    expect(COMPANY_DB['ralphs']).toBeUndefined();
    expect(findCompanyId('Fred Meyer Stores, Inc.')).toBeNull();
    expect(findCompanyId('King Soopers, Inc.')).toBeNull();
    expect(findCompanyId('Ralphs Grocery Company')).toBeNull();
  });

  test('an unknown brand still returns null', () => {
    expect(findCompanyId('Completely Unrelated Snack Brand XYZ')).toBeNull();
    expect(findCompanyId('')).toBeNull();
    expect(findCompanyId(null)).toBeNull();
  });

  test('a near-collision does not cross-map: two real companies sharing a name stem', () => {
    // garden-of-life and garden-of-light are two different real COMPANY_DB
    // records that both start with "Garden of ...". A brand string that
    // reduces to just "garden" is ambiguous between them and must return
    // null rather than guessing either one.
    expect(COMPANY_DB['garden-of-life'].name).toMatch(/^Garden of Life/);
    expect(COMPANY_DB['garden-of-light'].name).toMatch(/^Garden of Light/);
    expect(findCompanyId('The Garden Company, Ltd.')).toBeNull();

    // Still resolves cleanly when the string is NOT ambiguous — a real SKU
    // in the OFF dump tagged exactly "Garden of Light Inc.".
    expect(findCompanyId('Garden of Light Inc.')).toBe('garden-of-light');
  });

  test('a generic leftover word does not silently cross-map to an unrelated real company', () => {
    // Real near-collisions found validating against the full OFF bulk dump.
    // "The Organic Co" strips down to the single word "organic", which is
    // NOT the same thing as the real company "Organic Valley (CROPP
    // Cooperative)". "RIVERSIDE" was found tagged on a "FROZEN LOBSTER MEAT"
    // SKU — nothing to do with "Riverside Natural Foods Ltd.", a vegan
    // snack-bar maker.
    expect(COMPANY_DB['organic-valley'].name).toMatch(/^Organic Valley/);
    expect(COMPANY_DB['riverside-natural-foods'].name).toBe('Riverside Natural Foods Ltd.');
    expect(findCompanyId('The Organic Co')).toBeNull();
    expect(findCompanyId('RIVERSIDE')).toBeNull();
  });

  test('a manufacturer legal name is bridged to its parent via a hand-curated BRAND_TO_COMPANY entry', () => {
    // COMPANY_DB['kelloggs'].name is "Kellanova (Kellogg's)" — Kellogg's
    // 2023 corporate rebrand. The real OFF brand text is the pre-rebrand
    // legal name ("The Kellogg Company", 707 SKUs) which shares no textual
    // root with "Kellanova" at all, so word-boundary/prefix matching cannot
    // bridge it. It is resolved instead by an explicit hand-curated
    // BRAND_TO_COMPANY entry (added 2026-08-22, company-expansion pass) — the
    // correct fix. A generic "(Kellogg's)"-parenthetical alias was rejected
    // because doing that for every COMPANY_DB record with a "(...)" aside
    // produces real false positives elsewhere in this exact dataset (e.g.
    // cleaneats' "(private label)" alias would wrongly capture the unrelated
    // real brand string "Private Label Foods").
    expect(COMPANY_DB.kelloggs.name).toBe("Kellanova (Kellogg's)");
    expect(findCompanyId('The Kellogg Company')).toBe('kelloggs');
  });

  test('every pre-existing BRAND_TO_COMPANY resolution is unchanged (no regressions)', () => {
    for (const [brand, companyId] of Object.entries(BRAND_TO_COMPANY)) {
      expect(findCompanyId(brand)).toBe(companyId);
    }
  });

  test('spot-checked pre-existing BRAND_PARENT_MAP resolutions are unchanged', () => {
    // These already resolved via the pre-existing fuzzy BRAND_PARENT_MAP ->
    // COMPANY_DB name match (stage 2), which stage 3 must not interfere with.
    expect(findCompanyId('burts bees')).toBe('clorox-company');
    expect(findCompanyId('larabar')).toBe('general-mills');
    expect(findCompanyId("m&m's")).toBe('mars');
    expect(findCompanyId('aveeno')).toBe('kenvue');
    expect(findCompanyId('nescafe')).toBe('nestle');
  });
});

/**
 * Phase 3 (2026-08-25, founder-locked): bioengineered (GMO) disclosure is a
 * neutral flag, detected against the RAW ingredients text BEFORE
 * normalizeIngredientTokens strips the USDA disclosure sentence out as label
 * text. detectContainsBioengineered/detectBioengineered themselves are unit
 * tested in ingredientNormalizer.test.js — these tests pin down the runtime
 * wiring: that buildProductFromRaw attaches the flag to the product object,
 * and that the disclosure text never leaks into the parsed ingredients list
 * (which is what makes it a real flag, not a fake ingredient row).
 */
describe('detectContainsBioengineered / buildProductFromRaw — bioengineered flag wiring', () => {
  test('detects a USDA bioengineered disclosure in the raw text', () => {
    expect(detectContainsBioengineered({ ingredients_text_en: 'Sugar Beets (Produced With Genetic Engineering), Water' })).toBe(true);
  });

  test('returns false for ordinary ingredients text', () => {
    expect(detectContainsBioengineered({ ingredients_text_en: 'Water, Sugar, Salt' })).toBe(false);
  });

  test('returns false when there is no ingredients text on any known field', () => {
    expect(detectContainsBioengineered({})).toBe(false);
  });

  test('buildProductFromRaw attaches containsBioengineered: true, and the disclosure never leaks into the ingredients array', () => {
    const p = buildProductFromRaw('000', {
      product_name: 'Some Rice',
      ingredients_text_en: 'Water, Parboiled Rice, Bioengineered Food Ingredient',
    });
    expect(p.containsBioengineered).toBe(true);
    expect(p.ingredients).toEqual(['water', 'parboiled rice']);
  });

  test('buildProductFromRaw attaches containsBioengineered: false for a clean product', () => {
    const p = buildProductFromRaw('001', {
      product_name: 'Plain Water',
      ingredients_text_en: 'Water',
    });
    expect(p.containsBioengineered).toBe(false);
  });

  // Mirrors the exact boolean condition ProductScoreScreen.js uses to decide
  // whether to render the neutral "Contains a bioengineered (GMO)
  // ingredient" badge — (product.isBioengineered || product.containsBioengineered).
  // There's no component-render test harness in this codebase (no
  // @testing-library/react-native dependency — see package.json), so this is
  // the logic-level proxy for "the flag renders the badge": it proves the
  // exact predicate the screen gates on evaluates true for both a runtime
  // (containsBioengineered) and a curated-catalog (isBioengineered) product,
  // and false for neither.
  describe('badge-visibility predicate (product.isBioengineered || product.containsBioengineered)', () => {
    const showsBadge = (product) => !!(product.isBioengineered || product.containsBioengineered);

    test('shows for a runtime-flagged (live scan) product', () => {
      expect(showsBadge({ containsBioengineered: true })).toBe(true);
    });

    test('shows for a catalog-flagged product (e.g. Ben\'s Original Ready Rice)', () => {
      expect(showsBadge({ isBioengineered: true })).toBe(true);
    });

    test('does not show when neither flag is set', () => {
      expect(showsBadge({ isVegan: true })).toBe(false);
      expect(showsBadge({})).toBe(false);
    });
  });
});

describe('buildProductFromRaw — category detection', () => {
  // OFF's categories_tags runs general -> specific, so a real egg product's
  // first tag is usually a broad one, never "eggs" itself. This is why
  // trusting cats[0] blindly (the old behavior) meant a scanned egg outside
  // the curated catalog would almost never get category: 'Eggs', silently
  // hiding the Living Conditions card from every unrecognized egg brand.
  test('finds "Eggs" from a non-first categories_tags entry (realistic OFF ordering)', () => {
    const p = buildProductFromRaw('000', {
      product_name: 'Some Unrecognized Free Range Eggs',
      brands: 'Some Random Brand',
      categories_tags: ['en:fresh-foods', 'en:eggs', 'en:chicken-eggs'],
    });
    expect(p.category).toBe('Eggs');
  });

  test('does not false-positive on "eggplants" (substring, not a whole tag token)', () => {
    const p = buildProductFromRaw('001', {
      product_name: 'Grilled Eggplant',
      categories_tags: ['en:vegetables', 'en:eggplants'],
    });
    expect(p.category).not.toBe('Eggs');
  });

  test('falls back to cats[0] for anything with no known category signal', () => {
    const p = buildProductFromRaw('002', {
      product_name: 'Some Snack',
      categories_tags: ['en:salty-snacks'],
    });
    expect(p.category).toBe('salty snacks');
  });

  test('falls back to General when categories_tags is empty/missing', () => {
    const p = buildProductFromRaw('003', { product_name: 'Mystery Item' });
    expect(p.category).toBe('General');
  });
});
