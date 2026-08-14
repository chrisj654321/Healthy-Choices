/**
 * Characterization tests for src/data/productStore.js — Wave 2 pilot of the
 * product-catalog re-architecture (see context/research-catalog-rearchitecture.md
 * and scripts/catalog-database/verify-productstore-queries.js for the real-schema/real-data
 * proof this file doesn't attempt to duplicate).
 *
 * expo-sqlite and expo-file-system/legacy both wrap native modules that
 * can't run under Jest, so both are hand-mocked below (same pattern as
 * subscription.test.js's react-native-purchases mock and storage.test.js's
 * AsyncStorage mock) — controllable jest.fn()s, not the real native
 * implementations.
 *
 * What these tests pin:
 *   - initProductStore() is idempotent: calling it twice only runs the
 *     download/open logic once (this is the module-level cached-promise
 *     pattern the brief specifically calls for, since getProductByBarcode
 *     also triggers it implicitly on every call).
 *   - It skips the downloadAsync call entirely when a same-version copy
 *     already exists on-device, and re-downloads when DB_VERSION differs
 *     from what's recorded in the on-device .version file.
 *   - getProductByBarcode reshapes a raw DB row (JSON-stringified nested
 *     columns) into the same object shape PRODUCT_DB[barcode] has.
 *   - getProductByBarcode returns null (never throws) for: no row found,
 *     and a rejected/failed DB open — and reports failures to Sentry via
 *     captureException in both the init-failure and query-failure paths.
 *
 * NOT covered here (impossible without a real device/simulator build, see
 * the Wave 2 build report): whether the real on-device FileSystem.downloadAsync()
 * call and SQLite.openDatabaseAsync() succeed end-to-end on a physical device
 * against the real REMOTE_DB_URL. That remains unverified until an EAS build
 * is tested on-device (this is exactly the class of gap that let the old
 * Metro-asset-bundling approach ship broken — see the 2026-07-12 decision log
 * entry and Sentry `metroRequire: Cannot find module` reports).
 */

const mockDb = {
  getFirstAsync: jest.fn(),
  getAllAsync: jest.fn(),
};

/**
 * initProductStore() now also runs remoteDataOverlay.js, which probes
 * sqlite_master for the reference tables and then reads whichever exist.
 * Those calls share the getAllAsync mock with the product queries, so tests
 * that assert "this function short-circuits without querying" must exclude
 * them. Returns only the calls that actually touch product data.
 */
const OVERLAY_TABLES = /sqlite_master|FROM companies|FROM brand_company_map|FROM ingredient_analysis/;

function productQueries(mockFn) {
  return mockFn.mock.calls.filter(([sql]) => !OVERLAY_TABLES.test(String(sql)));
}

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///documents/',
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  downloadAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
}));

jest.mock('../../utils/sentry', () => ({ captureException: jest.fn() }));

// getRemoteDbConfig() is remoteConfig.js's own concern (see
// remoteConfig.test.js) — here it's mocked so productStore's existing
// hardcoded-constant behavior stays pinned by default (resolves null, same
// as "manifest unreachable"), with a couple of dedicated tests below for the
// override/fallback wiring itself.
jest.mock('../../utils/remoteConfig', () => ({ getRemoteDbConfig: jest.fn() }));

import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import { captureException } from '../../utils/sentry';
import { getRemoteDbConfig } from '../../utils/remoteConfig';
import { DB_VERSION, REMOTE_DB_URL } from '../productStore';

// productStore.js caches its init promise at module scope, so it must be
// re-imported fresh (via jest.resetModules) in every test that cares about
// init behavior, or state bleeds across tests.
function loadProductStore() {
  let mod;
  jest.isolateModules(() => {
    mod = require('../productStore');
  });
  return mod;
}

beforeEach(() => {
  jest.clearAllMocks();
  FileSystem.getInfoAsync.mockResolvedValue({ exists: false });
  FileSystem.makeDirectoryAsync.mockResolvedValue(undefined);
  FileSystem.downloadAsync.mockResolvedValue(undefined);
  FileSystem.readAsStringAsync.mockResolvedValue(DB_VERSION);
  FileSystem.writeAsStringAsync.mockResolvedValue(undefined);
  SQLite.openDatabaseAsync.mockResolvedValue(mockDb);
  mockDb.getFirstAsync.mockReset();
  mockDb.getAllAsync.mockReset();
  // Default: no remote manifest override — same behavior as "manifest
  // unreachable," which is what every pre-existing test below pins.
  getRemoteDbConfig.mockResolvedValue(null);
});

// Minimal raw-row fixture shared by the new-function tests below — same
// shape as the getProductByBarcode fixtures above.
function makeRow(overrides = {}) {
  return {
    barcode: '000000000001',
    name: 'Test Product',
    brand: 'Test Brand',
    companyId: 'test-co',
    category: 'Snack Bars',
    image: 'https://example.com/img.png',
    servingSize: '1 bar (40g)',
    calories: 150,
    ingredients_json: JSON.stringify(['oats', 'honey']),
    nutrition_json: JSON.stringify({ fat: 5, sodium: 90, sugars: 8, protein: 4 }),
    certifications_json: JSON.stringify([]),
    flags_json: JSON.stringify({}),
    packaging_json: null,
    isOrganic: 0,
    isVegan: 0,
    isGlutenFree: 0,
    source: 'manual',
    score: 75,
    grade: 'C',
    search_text: 'test product test brand snack bars 000000000001',
    ...overrides,
  };
}

// ─── initProductStore ──────────────────────────────────────────────────────

describe('initProductStore', () => {
  test('is idempotent — calling twice only downloads the DB once', async () => {
    const { initProductStore } = loadProductStore();

    await initProductStore();
    await initProductStore();

    expect(FileSystem.downloadAsync).toHaveBeenCalledTimes(1);
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1);
  });

  test('concurrent calls before the first resolves still only download once', async () => {
    const { initProductStore } = loadProductStore();

    await Promise.all([initProductStore(), initProductStore(), initProductStore()]);

    expect(FileSystem.downloadAsync).toHaveBeenCalledTimes(1);
  });

  test('skips downloadAsync when the destination file exists and the version matches', async () => {
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    FileSystem.readAsStringAsync.mockResolvedValue(DB_VERSION);
    const { initProductStore } = loadProductStore();

    await initProductStore();

    expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith('products.db');
  });

  test('re-downloads when the on-device version file does not match DB_VERSION', async () => {
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    FileSystem.readAsStringAsync.mockResolvedValue('some-stale-version');
    const { initProductStore } = loadProductStore();

    await initProductStore();

    expect(FileSystem.downloadAsync).toHaveBeenCalledTimes(1);
  });

  test('downloads from REMOTE_DB_URL to the documents SQLite directory, then writes the version marker', async () => {
    const { initProductStore } = loadProductStore();

    await initProductStore();

    expect(FileSystem.downloadAsync).toHaveBeenCalledWith(
      REMOTE_DB_URL,
      'file:///documents/SQLite/products.db'
    );
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      'file:///documents/SQLite/products.db.version',
      DB_VERSION
    );
  });

  test('never rejects, even if the download fails — reports to Sentry', async () => {
    FileSystem.downloadAsync.mockRejectedValue(new Error('download failed'));
    const { initProductStore } = loadProductStore();

    await expect(initProductStore()).resolves.toBeUndefined();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'initProductStore' })
    );
  });

  test('never rejects, even if opening the DB fails — reports to Sentry', async () => {
    SQLite.openDatabaseAsync.mockRejectedValue(new Error('open failed'));
    const { initProductStore } = loadProductStore();

    await expect(initProductStore()).resolves.toBeUndefined();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'initProductStore' })
    );
  });
});

// ─── remote manifest wiring (Phase 2 — see remoteConfig.js) ────────────────

describe('remote manifest dbVersion/dbUrl override', () => {
  test('downloads from the manifest dbUrl/dbVersion when getRemoteDbConfig resolves both', async () => {
    getRemoteDbConfig.mockResolvedValue({
      dbVersion: '2026-09-01-remote',
      dbUrl: 'https://huvxeaegygaeotomdqpc.supabase.co/storage/v1/object/public/Catalog/products-v2.db',
    });
    const { initProductStore } = loadProductStore();

    await initProductStore();

    expect(FileSystem.downloadAsync).toHaveBeenCalledWith(
      'https://huvxeaegygaeotomdqpc.supabase.co/storage/v1/object/public/Catalog/products-v2.db',
      'file:///documents/SQLite/products.db'
    );
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      'file:///documents/SQLite/products.db.version',
      '2026-09-01-remote'
    );
  });

  test('falls back to the hardcoded DB_VERSION/REMOTE_DB_URL when the manifest resolves null', async () => {
    getRemoteDbConfig.mockResolvedValue(null);
    const { initProductStore } = loadProductStore();

    await initProductStore();

    expect(FileSystem.downloadAsync).toHaveBeenCalledWith(REMOTE_DB_URL, 'file:///documents/SQLite/products.db');
  });

  test('falls back to the hardcoded constants (never throws) if getRemoteDbConfig itself rejects', async () => {
    getRemoteDbConfig.mockRejectedValue(new Error('remoteConfig blew up'));
    const { initProductStore } = loadProductStore();

    await expect(initProductStore()).resolves.toBeUndefined();
    expect(FileSystem.downloadAsync).toHaveBeenCalledWith(REMOTE_DB_URL, 'file:///documents/SQLite/products.db');
  });

  test('skips downloading when the on-device version already matches the manifest dbVersion', async () => {
    getRemoteDbConfig.mockResolvedValue({
      dbVersion: 'matching-remote-version',
      dbUrl: 'https://huvxeaegygaeotomdqpc.supabase.co/storage/v1/object/public/Catalog/products-v2.db',
    });
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    FileSystem.readAsStringAsync.mockResolvedValue('matching-remote-version');
    const { initProductStore } = loadProductStore();

    await initProductStore();

    expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
  });
});

// ─── getProductByBarcode ───────────────────────────────────────────────────

describe('getProductByBarcode', () => {
  test('returns a correctly-reshaped product object for a found row', async () => {
    mockDb.getFirstAsync.mockResolvedValue({
      barcode: '016000275287',
      name: 'Cheerios Original',
      brand: 'Cheerios',
      companyId: 'general-mills',
      category: 'Cereals',
      image: null,
      servingSize: '1 cup (28g)',
      calories: 100,
      ingredients_json: JSON.stringify(['whole grain oats', 'sugar']),
      nutrition_json: JSON.stringify({ fat: 2, sodium: 140, sugars: 1, protein: 3 }),
      certifications_json: JSON.stringify(['Heart-Check']),
      flags_json: JSON.stringify({}),
      packaging_json: null,
      isOrganic: 0,
      isVegan: 0,
      isGlutenFree: 0,
      source: 'manual',
      score: 71,
      grade: 'C',
      search_text: 'cheerios original cheerios cereals 016000275287',
    });

    const { getProductByBarcode } = loadProductStore();
    const product = await getProductByBarcode('016000275287');

    expect(product).toEqual({
      barcode: '016000275287',
      name: 'Cheerios Original',
      brand: 'Cheerios',
      companyId: 'general-mills',
      source: 'curated',
      category: 'Cereals',
      image: null,
      servingSize: '1 cup (28g)',
      calories: 100,
      ingredients: ['whole grain oats', 'sugar'],
      nutrition: { fat: 2, sodium: 140, sugars: 1, protein: 3 },
      certifications: ['Heart-Check'],
      flags: {},
      packaging: null,
      isOrganic: false,
      isVegan: false,
      isGlutenFree: false,
    });

    expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
      'SELECT * FROM products WHERE barcode = ?',
      ['016000275287']
    );
  });

  test('defaults null JSON columns to [] / {} instead of null', async () => {
    mockDb.getFirstAsync.mockResolvedValue({
      barcode: '000000000000',
      name: 'Mystery Product',
      brand: null,
      companyId: null,
      category: null,
      image: null,
      servingSize: null,
      calories: null,
      ingredients_json: null,
      nutrition_json: null,
      certifications_json: null,
      flags_json: null,
      packaging_json: null,
      isOrganic: 0,
      isVegan: 0,
      isGlutenFree: 0,
      source: 'generated',
      score: null,
      grade: null,
      search_text: 'mystery product 000000000000',
    });

    const { getProductByBarcode } = loadProductStore();
    const product = await getProductByBarcode('000000000000');

    expect(product.ingredients).toEqual([]);
    expect(product.nutrition).toEqual({});
    expect(product.certifications).toEqual([]);
    expect(product.flags).toEqual({});
    expect(product.packaging).toBeNull();
    expect(product.isOrganic).toBe(false);
    expect(product.isVegan).toBe(false);
    expect(product.isGlutenFree).toBe(false);
  });

  test('reshapes packaging_json into a real packaging object when present', async () => {
    mockDb.getFirstAsync.mockResolvedValue({
      barcode: '014500021830',
      name: 'Birds Eye Steamfresh Pure & Simple Broccoli Florets 10.8oz',
      brand: 'Birds Eye',
      companyId: 'conagra',
      category: 'Frozen Vegetables & Fruit',
      image: null,
      servingSize: '3.5 oz (99g)',
      calories: 30,
      ingredients_json: JSON.stringify(['broccoli']),
      nutrition_json: JSON.stringify({ fat: 0, saturatedFat: 0, sodium: 15, carbs: 5, sugars: 1, protein: 2 }),
      certifications_json: JSON.stringify([]),
      flags_json: JSON.stringify({}),
      packaging_json: JSON.stringify({
        material: 'plastic',
        format: 'steam-bag',
        heatUse: 'microwave',
        concernLevel: 'high',
        concerns: ['microplastics', 'heated-plastic-contact'],
      }),
      isOrganic: 0,
      isVegan: 1,
      isGlutenFree: 1,
      source: 'manual',
      score: 91,
      grade: 'A',
      search_text: 'birds eye steamfresh broccoli 014500021830',
    });

    const { getProductByBarcode } = loadProductStore();
    const product = await getProductByBarcode('014500021830');

    expect(product.packaging).toEqual({
      material: 'plastic',
      format: 'steam-bag',
      heatUse: 'microwave',
      concernLevel: 'high',
      concerns: ['microplastics', 'heated-plastic-contact'],
    });
    expect(product.isOrganic).toBe(false);
    expect(product.isVegan).toBe(true);
    expect(product.isGlutenFree).toBe(true);
  });

  test('reshapes SQLite integer diet flags (1/0) into real JS booleans', async () => {
    mockDb.getFirstAsync.mockResolvedValue({
      barcode: '074873970838',
      name: 'WestSoy Organic Unsweetened Vanilla Soymilk 32oz',
      brand: 'WestSoy',
      companyId: 'hain-celestial',
      category: 'Plant-Based Milk',
      image: null,
      servingSize: '1 cup (240ml)',
      calories: 100,
      ingredients_json: JSON.stringify(['organic soymilk', 'natural vanilla flavor']),
      nutrition_json: JSON.stringify({ fat: 4.5, saturatedFat: 0.5, sodium: 25, carbs: 5, sugars: 1, protein: 9 }),
      certifications_json: JSON.stringify(['USDA Organic', 'Non-GMO Project Verified']),
      flags_json: JSON.stringify({}),
      packaging_json: null,
      isOrganic: 1,
      isVegan: 1,
      isGlutenFree: 1,
      source: 'manual',
      score: 95,
      grade: 'A',
      search_text: 'westsoy organic vanilla soymilk 074873970838',
    });

    const { getProductByBarcode } = loadProductStore();
    const product = await getProductByBarcode('074873970838');

    expect(product.packaging).toBeNull();
    expect(product.isOrganic).toBe(true);
    expect(product.isVegan).toBe(true);
    expect(product.isGlutenFree).toBe(true);
    expect(typeof product.isOrganic).toBe('boolean');
    expect(typeof product.isVegan).toBe('boolean');
    expect(typeof product.isGlutenFree).toBe('boolean');
  });

  test('returns null when no row is found', async () => {
    mockDb.getFirstAsync.mockResolvedValue(null);

    const { getProductByBarcode } = loadProductStore();
    await expect(getProductByBarcode('nonexistent')).resolves.toBeNull();
  });

  test('returns null (not a throw) if init never produced a DB handle', async () => {
    SQLite.openDatabaseAsync.mockRejectedValue(new Error('open failed'));

    const { getProductByBarcode } = loadProductStore();
    await expect(getProductByBarcode('016000275287')).resolves.toBeNull();
    expect(mockDb.getFirstAsync).not.toHaveBeenCalled();
  });

  test('returns null (not a throw) if the query itself rejects, reports to Sentry', async () => {
    mockDb.getFirstAsync.mockRejectedValue(new Error('query failed'));

    const { getProductByBarcode } = loadProductStore();
    await expect(getProductByBarcode('016000275287')).resolves.toBeNull();
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getProductByBarcode', barcode: '016000275287' })
    );
  });

  test('implicitly calls initProductStore if the store was never explicitly initialized', async () => {
    mockDb.getFirstAsync.mockResolvedValue(null);

    const { getProductByBarcode } = loadProductStore();
    await getProductByBarcode('016000275287');

    expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1);
  });
});

// ─── searchProductsLocal ───────────────────────────────────────────────────

describe('searchProductsLocal', () => {
  test('lowercases the query and binds it into the LIKE/limit query, maps rows', async () => {
    mockDb.getAllAsync.mockResolvedValue([makeRow()]);

    const { searchProductsLocal } = loadProductStore();
    const results = await searchProductsLocal('CHEERIOS', 6);

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      "SELECT * FROM products WHERE search_text LIKE '%' || ? || '%' LIMIT ?",
      ['cheerios', 6]
    );
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Test Product');
    expect(results[0].ingredients).toEqual(['oats', 'honey']);
  });

  test('defaults limit to 6 when not provided', async () => {
    mockDb.getAllAsync.mockResolvedValue([]);
    const { searchProductsLocal } = loadProductStore();

    await searchProductsLocal('bar');

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(expect.any(String), ['bar', 6]);
  });

  test('returns [] (not a throw) when the store never opens', async () => {
    SQLite.openDatabaseAsync.mockRejectedValue(new Error('open failed'));
    const { searchProductsLocal } = loadProductStore();

    await expect(searchProductsLocal('bar')).resolves.toEqual([]);
    expect(mockDb.getAllAsync).not.toHaveBeenCalled();
  });

  test('returns [] (not a throw) if the query rejects, reports to Sentry', async () => {
    mockDb.getAllAsync.mockRejectedValue(new Error('query failed'));
    const { searchProductsLocal } = loadProductStore();

    await expect(searchProductsLocal('bar')).resolves.toEqual([]);
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'searchProductsLocal' })
    );
  });
});

// ─── getFeaturedProducts ───────────────────────────────────────────────────

describe('getFeaturedProducts', () => {
  test('reorders results to match the INPUT barcode order, not SQL order', async () => {
    const rowA = makeRow({ barcode: 'AAA', name: 'A Product' });
    const rowB = makeRow({ barcode: 'BBB', name: 'B Product' });
    const rowC = makeRow({ barcode: 'CCC', name: 'C Product' });
    // Deliberately returned out of order (as SQL IN() may do).
    mockDb.getAllAsync.mockResolvedValue([rowC, rowA, rowB]);

    const { getFeaturedProducts } = loadProductStore();
    const results = await getFeaturedProducts(['AAA', 'BBB', 'CCC']);

    expect(results.map((r) => r.barcode)).toEqual(['AAA', 'BBB', 'CCC']);
  });

  test('skips barcodes with no matching row', async () => {
    const rowA = makeRow({ barcode: 'AAA', name: 'A Product' });
    mockDb.getAllAsync.mockResolvedValue([rowA]);

    const { getFeaturedProducts } = loadProductStore();
    const results = await getFeaturedProducts(['AAA', 'MISSING']);

    expect(results.map((r) => r.barcode)).toEqual(['AAA']);
  });

  test('returns [] for an empty or non-array input without querying', async () => {
    const { getFeaturedProducts } = loadProductStore();

    await expect(getFeaturedProducts([])).resolves.toEqual([]);
    await expect(getFeaturedProducts(undefined)).resolves.toEqual([]);
    // Startup now also overlays the catalog's reference data onto the
    // bundled modules (remoteDataOverlay.js), which probes sqlite_master.
    // Assert no PRODUCTS query ran rather than no query at all.
    expect(productQueries(mockDb.getAllAsync)).toHaveLength(0);
  });

  test('returns [] (not a throw) if the query rejects, reports to Sentry', async () => {
    mockDb.getAllAsync.mockRejectedValue(new Error('query failed'));
    const { getFeaturedProducts } = loadProductStore();

    await expect(getFeaturedProducts(['AAA'])).resolves.toEqual([]);
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getFeaturedProducts' })
    );
  });
});

// ─── getProductsByCategory ─────────────────────────────────────────────────

describe('getProductsByCategory', () => {
  const categoryTile = { id: 'snack-bars', productCategories: ['Snack Bars'] };

  test('queries lower(category) IN (...) ordered by score IS NULL, score DESC', async () => {
    mockDb.getAllAsync.mockResolvedValue([]);
    const { getProductsByCategory } = loadProductStore();

    await getProductsByCategory(categoryTile);

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      'SELECT * FROM products WHERE lower(category) IN (?) ORDER BY score IS NULL, score DESC',
      ['snack bars']
    );
  });

  test('maps rows into { product, result } pairs with a minimal result shape', async () => {
    mockDb.getAllAsync.mockResolvedValue([makeRow({ score: 88, grade: 'A' })]);
    const { getProductsByCategory } = loadProductStore();

    const items = await getProductsByCategory(categoryTile);

    expect(items).toHaveLength(1);
    expect(items[0].product.name).toBe('Test Product');
    expect(items[0].result).toEqual({ score: 88, grade: 'A', insufficientData: false });
  });

  test('marks insufficientData true when ingredients_json is null or "[]"', async () => {
    mockDb.getAllAsync.mockResolvedValue([
      makeRow({ barcode: 'A', ingredients_json: null, score: null, grade: null }),
      makeRow({ barcode: 'B', ingredients_json: '[]', score: null, grade: null }),
    ]);
    const { getProductsByCategory } = loadProductStore();

    const items = await getProductsByCategory(categoryTile);

    expect(items[0].result.insufficientData).toBe(true);
    expect(items[1].result.insufficientData).toBe(true);
  });

  test('returns [] when categoryTile has no productCategories, without querying', async () => {
    const { getProductsByCategory } = loadProductStore();

    await expect(getProductsByCategory({ id: 'empty', productCategories: [] })).resolves.toEqual([]);
    await expect(getProductsByCategory(null)).resolves.toEqual([]);
    // See the note on getFeaturedProducts's equivalent test — startup's
    // reference-data overlay makes one sqlite_master probe of its own.
    expect(productQueries(mockDb.getAllAsync)).toHaveLength(0);
  });

  test('returns [] (not a throw) if the query rejects, reports to Sentry', async () => {
    mockDb.getAllAsync.mockRejectedValue(new Error('query failed'));
    const { getProductsByCategory } = loadProductStore();

    await expect(getProductsByCategory(categoryTile)).resolves.toEqual([]);
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getProductsByCategory', categoryId: 'snack-bars' })
    );
  });
});

// ─── getCategoryCounts ──────────────────────────────────────────────────────

describe('getCategoryCounts', () => {
  test('returns a plain object keyed by category_id', async () => {
    mockDb.getAllAsync.mockResolvedValue([
      { category_id: 'snack-bars', count: 12 },
      { category_id: 'cereal', count: 30 },
    ]);
    const { getCategoryCounts } = loadProductStore();

    await expect(getCategoryCounts()).resolves.toEqual({ 'snack-bars': 12, cereal: 30 });
    expect(mockDb.getAllAsync).toHaveBeenCalledWith('SELECT category_id, count FROM category_counts');
  });

  test('returns {} (not a throw) if the store never opens', async () => {
    SQLite.openDatabaseAsync.mockRejectedValue(new Error('open failed'));
    const { getCategoryCounts } = loadProductStore();

    await expect(getCategoryCounts()).resolves.toEqual({});
  });

  test('returns {} (not a throw) if the query rejects, reports to Sentry', async () => {
    mockDb.getAllAsync.mockRejectedValue(new Error('query failed'));
    const { getCategoryCounts } = loadProductStore();

    await expect(getCategoryCounts()).resolves.toEqual({});
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getCategoryCounts' })
    );
  });
});

// ─── getHeroImagesByCategory ────────────────────────────────────────────────

describe('getHeroImagesByCategory', () => {
  test('returns a plain object keyed by category_id, image or null', async () => {
    mockDb.getAllAsync.mockResolvedValue([
      { category_id: 'snack-bars', image: 'https://example.com/a.png' },
      { category_id: 'cereal', image: null },
    ]);
    const { getHeroImagesByCategory } = loadProductStore();

    await expect(getHeroImagesByCategory()).resolves.toEqual({
      'snack-bars': 'https://example.com/a.png',
      cereal: null,
    });
  });

  test('returns {} (not a throw) if the query rejects, reports to Sentry', async () => {
    mockDb.getAllAsync.mockRejectedValue(new Error('query failed'));
    const { getHeroImagesByCategory } = loadProductStore();

    await expect(getHeroImagesByCategory()).resolves.toEqual({});
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getHeroImagesByCategory' })
    );
  });
});

// ─── getProductsByCompany ───────────────────────────────────────────────────

describe('getProductsByCompany', () => {
  test('queries by companyId and reshapes each row', async () => {
    mockDb.getAllAsync.mockResolvedValue([makeRow({ companyId: 'general-mills' })]);
    const { getProductsByCompany } = loadProductStore();

    const results = await getProductsByCompany('general-mills');

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      'SELECT * FROM products WHERE companyId = ?',
      ['general-mills']
    );
    expect(results).toHaveLength(1);
    expect(results[0].companyId).toBe('general-mills');
  });

  test('returns [] (not a throw) if the store never opens', async () => {
    SQLite.openDatabaseAsync.mockRejectedValue(new Error('open failed'));
    const { getProductsByCompany } = loadProductStore();

    await expect(getProductsByCompany('general-mills')).resolves.toEqual([]);
  });

  test('returns [] (not a throw) if the query rejects, reports to Sentry', async () => {
    mockDb.getAllAsync.mockRejectedValue(new Error('query failed'));
    const { getProductsByCompany } = loadProductStore();

    await expect(getProductsByCompany('general-mills')).resolves.toEqual([]);
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getProductsByCompany', companyId: 'general-mills' })
    );
  });
});

// ─── getCuratedGradeABCandidates ────────────────────────────────────────────

describe('getCuratedGradeABCandidates', () => {
  test('queries curated (image + companyId) grade A/B rows and pairs product/score/grade', async () => {
    mockDb.getAllAsync.mockResolvedValue([makeRow({ score: 90, grade: 'A' })]);
    const { getCuratedGradeABCandidates } = loadProductStore();

    const results = await getCuratedGradeABCandidates();

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringMatching(
        /SELECT \* FROM products\s+WHERE image IS NOT NULL AND image != ''\s+AND companyId IS NOT NULL AND companyId != ''\s+AND grade IN \('A', 'B'\)/
      )
    );
    expect(results).toHaveLength(1);
    expect(results[0].product.name).toBe('Test Product');
    expect(results[0].score).toBe(90);
    expect(results[0].grade).toBe('A');
  });

  test('reshapes multiple rows, one pair per row', async () => {
    mockDb.getAllAsync.mockResolvedValue([
      makeRow({ barcode: 'AAA', score: 95, grade: 'A' }),
      makeRow({ barcode: 'BBB', score: 82, grade: 'B' }),
    ]);
    const { getCuratedGradeABCandidates } = loadProductStore();

    const results = await getCuratedGradeABCandidates();

    expect(results.map((r) => r.product.barcode)).toEqual(['AAA', 'BBB']);
    expect(results.map((r) => r.grade)).toEqual(['A', 'B']);
  });

  test('returns [] (not a throw) if the store never opens', async () => {
    SQLite.openDatabaseAsync.mockRejectedValue(new Error('open failed'));
    const { getCuratedGradeABCandidates } = loadProductStore();

    await expect(getCuratedGradeABCandidates()).resolves.toEqual([]);
    expect(mockDb.getAllAsync).not.toHaveBeenCalled();
  });

  test('returns [] (not a throw) if the query rejects, reports to Sentry', async () => {
    mockDb.getAllAsync.mockRejectedValue(new Error('query failed'));
    const { getCuratedGradeABCandidates } = loadProductStore();

    await expect(getCuratedGradeABCandidates()).resolves.toEqual([]);
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getCuratedGradeABCandidates' })
    );
  });
});

// ─── getSpotlightEligibleCompanies ──────────────────────────────────────────

describe('getSpotlightEligibleCompanies', () => {
  test('returns the raw rows from spotlight_company_ids', async () => {
    const rows = [
      { companyId: 'sargento', productCount: 4, featuredOrder: 0, hasHighIssue: 1 },
      { companyId: 'some-co', productCount: 2, featuredOrder: null, hasHighIssue: 1 },
    ];
    mockDb.getAllAsync.mockResolvedValue(rows);
    const { getSpotlightEligibleCompanies } = loadProductStore();

    await expect(getSpotlightEligibleCompanies()).resolves.toEqual(rows);
    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      'SELECT companyId, productCount, featuredOrder, hasHighIssue FROM spotlight_company_ids'
    );
  });

  test('returns [] (not a throw) if the store never opens', async () => {
    SQLite.openDatabaseAsync.mockRejectedValue(new Error('open failed'));
    const { getSpotlightEligibleCompanies } = loadProductStore();

    await expect(getSpotlightEligibleCompanies()).resolves.toEqual([]);
  });

  test('returns [] (not a throw) if the query rejects, reports to Sentry', async () => {
    mockDb.getAllAsync.mockRejectedValue(new Error('query failed'));
    const { getSpotlightEligibleCompanies } = loadProductStore();

    await expect(getSpotlightEligibleCompanies()).resolves.toEqual([]);
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ function: 'getSpotlightEligibleCompanies' })
    );
  });
});
