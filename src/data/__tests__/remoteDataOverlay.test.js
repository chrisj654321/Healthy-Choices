/**
 * remoteDataOverlay.test.js
 *
 * Covers the Phase 3 mechanism that lets company and ingredient research ship
 * in the downloadable catalog instead of the app bundle.
 *
 * The bundled modules are mocked with small stand-in objects rather than
 * loaded for real — the point under test is the overlay's merge behavior and
 * its never-throw contract, and mutating the real 302-company COMPANY_DB
 * would leak across test files.
 */

jest.mock('../companies', () => ({
  COMPANY_DB: {},
  BRAND_TO_COMPANY: {},
  BRAND_PARENT_MAP: {},
}));

jest.mock('../ingredientCache', () => ({
  CACHED_INGREDIENT_ANALYSIS: {},
}));

jest.mock('../../utils/sentry', () => ({
  captureException: jest.fn(),
}));

const ALL_TABLES = ['companies', 'brand_company_map', 'ingredient_analysis'];

/**
 * Builds a fake expo-sqlite handle. `tables` decides what sqlite_master
 * reports, which is how an older catalog (schemaVersion 1, no reference
 * tables) is simulated.
 */
function makeDb({ tables = ALL_TABLES, companies = [], brands = [], ingredients = [] } = {}) {
  return {
    getAllAsync: jest.fn(async (sql) => {
      if (sql.includes('sqlite_master')) return tables.map((name) => ({ name }));
      if (sql.includes('FROM companies')) return companies;
      if (sql.includes('FROM brand_company_map')) return brands;
      if (sql.includes('FROM ingredient_analysis')) return ingredients;
      throw new Error(`unexpected query: ${sql}`);
    }),
  };
}

function load() {
  const overlay = require('../remoteDataOverlay');
  const companies = require('../companies');
  const ingredientCache = require('../ingredientCache');
  const { captureException } = require('../../utils/sentry');
  return { ...overlay, ...companies, ...ingredientCache, captureException };
}

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe('applyRemoteReferenceData', () => {
  test('resolves with zero counts and does not throw when the db handle is null', async () => {
    const { applyRemoteReferenceData } = load();

    await expect(applyRemoteReferenceData(null)).resolves.toEqual({
      companies: 0,
      brands: 0,
      ingredients: 0,
    });
  });

  test('overlays companies, both brand maps, and ingredient analyses', async () => {
    const { applyRemoteReferenceData, COMPANY_DB, BRAND_TO_COMPANY, BRAND_PARENT_MAP, CACHED_INGREDIENT_ANALYSIS } = load();

    const counts = await applyRemoteReferenceData(makeDb({
      companies: [{ id: 'pepsico', json: '{"id":"pepsico","name":"PepsiCo, Inc."}' }],
      brands: [
        { brand: 'doritos', kind: 'company', value: 'pepsico' },
        { brand: 'doritos', kind: 'parent', value: 'PepsiCo' },
      ],
      ingredients: [{ name: 'sugar', json: '{"risk":5,"category":"sweeteners"}' }],
    }));

    expect(counts).toEqual({ companies: 1, brands: 2, ingredients: 1 });
    expect(COMPANY_DB.pepsico).toEqual({ id: 'pepsico', name: 'PepsiCo, Inc.' });
    expect(BRAND_TO_COMPANY.doritos).toBe('pepsico');
    expect(BRAND_PARENT_MAP.doritos).toBe('PepsiCo');
    expect(CACHED_INGREDIENT_ANALYSIS.sugar).toEqual({ risk: 5, category: 'sweeteners' });
  });

  test('is additive — it replaces matching keys and leaves bundled-only keys alone', async () => {
    const { applyRemoteReferenceData, COMPANY_DB } = load();
    COMPANY_DB.pepsico = { id: 'pepsico', name: 'stale bundled record' };
    COMPANY_DB.nestle = { id: 'nestle', name: 'bundled only' };

    await applyRemoteReferenceData(makeDb({
      companies: [{ id: 'pepsico', json: '{"id":"pepsico","name":"fresh"}' }],
    }));

    expect(COMPANY_DB.pepsico.name).toBe('fresh');
    // A company missing from the catalog must NOT disappear — a stale record
    // beats a blank company screen. Removals still need an app release.
    expect(COMPANY_DB.nestle).toEqual({ id: 'nestle', name: 'bundled only' });
  });

  test('leaves bundled data untouched on a pre-schemaVersion-2 catalog', async () => {
    const { applyRemoteReferenceData, COMPANY_DB, captureException } = load();
    COMPANY_DB.nestle = { id: 'nestle', name: 'bundled only' };

    const db = makeDb({ tables: [] });
    await expect(applyRemoteReferenceData(db)).resolves.toEqual({
      companies: 0,
      brands: 0,
      ingredients: 0,
    });

    expect(COMPANY_DB.nestle).toEqual({ id: 'nestle', name: 'bundled only' });
    // An old catalog is an expected state, not an error worth a Sentry event.
    expect(captureException).not.toHaveBeenCalled();
    expect(db.getAllAsync).toHaveBeenCalledTimes(1); // the sqlite_master probe only
  });

  test('overlays the tables that exist when only some are present', async () => {
    const { applyRemoteReferenceData, COMPANY_DB, BRAND_TO_COMPANY } = load();

    const counts = await applyRemoteReferenceData(makeDb({
      tables: ['companies'],
      companies: [{ id: 'mars', json: '{"id":"mars"}' }],
      brands: [{ brand: 'snickers', kind: 'company', value: 'mars' }],
    }));

    expect(counts).toEqual({ companies: 1, brands: 0, ingredients: 0 });
    expect(COMPANY_DB.mars).toEqual({ id: 'mars' });
    expect(BRAND_TO_COMPANY.snickers).toBeUndefined();
  });

  test('skips malformed rows without losing the good ones', async () => {
    const { applyRemoteReferenceData, COMPANY_DB, BRAND_TO_COMPANY, BRAND_PARENT_MAP } = load();

    const counts = await applyRemoteReferenceData(makeDb({
      companies: [
        { id: 'good', json: '{"id":"good"}' },
        { id: 'broken', json: '{not valid json' },
        { id: 'notobject', json: '"a string"' },
        { id: null, json: '{"id":"noid"}' },
      ],
      brands: [
        { brand: 'ok', kind: 'company', value: 'good' },
        { brand: 'weird', kind: 'unknown-kind', value: 'good' },
        { brand: 'empty', kind: 'company', value: '' },
      ],
    }));

    expect(counts.companies).toBe(1);
    expect(COMPANY_DB.good).toEqual({ id: 'good' });
    expect(COMPANY_DB.broken).toBeUndefined();
    expect(COMPANY_DB.notobject).toBeUndefined();

    expect(counts.brands).toBe(1);
    expect(BRAND_TO_COMPANY.ok).toBe('good');
    expect(BRAND_TO_COMPANY.weird).toBeUndefined();
    expect(BRAND_PARENT_MAP.weird).toBeUndefined();
    expect(BRAND_TO_COMPANY.empty).toBeUndefined();
  });

  test('reports to Sentry and resolves instead of rejecting when a query fails', async () => {
    const { applyRemoteReferenceData, captureException } = load();

    const db = { getAllAsync: jest.fn().mockRejectedValue(new Error('db gone')) };
    await expect(applyRemoteReferenceData(db)).resolves.toEqual({
      companies: 0,
      brands: 0,
      ingredients: 0,
    });

    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'applyRemoteReferenceData' })
    );
  });
});
