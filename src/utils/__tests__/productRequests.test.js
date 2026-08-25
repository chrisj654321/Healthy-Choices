/**
 * Tests for src/utils/productRequests.js.
 *
 * Covers the widened addRequest() shape added for the "Suggest a product by
 * name" feature:
 *   - bare barcode string (existing ScannerScreen call site) keeps working
 *   - { barcode, name, brand } object form
 *   - name-only requests (no barcode) don't blow up and never falsely
 *     resolve against getProductByBarcode
 *   - the offline/pendingSync retry path works for both shapes
 *
 * supabase and productStore are both mocked — this suite only exercises
 * the local-storage + sync-orchestration logic in productRequests.js, not
 * a real network/SQLite round trip.
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../supabase', () => ({
  supabase: {
    auth: { getUser: jest.fn() },
    from: jest.fn(),
  },
}));

jest.mock('../../data/productStore', () => ({
  getProductByBarcode: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';
import { getProductByBarcode } from '../../data/productStore';
import { addRequest, getRequests, retryPendingSyncs } from '../productRequests';

// Point supabase.from('product_requests').insert([...]) at a controllable result.
function mockInsertResult(result) {
  const insert = jest.fn().mockResolvedValue(result);
  supabase.from.mockReturnValue({ insert });
  return insert;
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
  getProductByBarcode.mockResolvedValue(null);
  mockInsertResult({ error: null }); // sync succeeds by default
});

// ─── Backward compatibility: bare barcode string ───────────────────────────────

describe('addRequest — bare barcode string (ScannerScreen call site)', () => {
  test('saves a barcode entry with name/brand null and syncs immediately', async () => {
    const entry = await addRequest('0123456789012');

    expect(entry.barcode).toBe('0123456789012');
    expect(entry.name).toBeNull();
    expect(entry.brand).toBeNull();
    expect(entry.pendingSync).toBe(false);

    const [insertedRows] = supabase.from.mock.results[0].value.insert.mock.calls[0];
    expect(insertedRows[0]).toMatchObject({
      barcode: '0123456789012',
      name: null,
      brand: null,
    });
  });
});

// ─── Object form ────────────────────────────────────────────────────────────────

describe('addRequest — object form', () => {
  test('{ barcode, name, brand } saves all three fields and syncs', async () => {
    const entry = await addRequest({ barcode: '999', name: 'Bagel Seasoning', brand: "Trader Joe's" });

    expect(entry).toMatchObject({
      barcode: '999',
      name: 'Bagel Seasoning',
      brand: "Trader Joe's",
      pendingSync: false,
    });

    const insertCall = supabase.from.mock.results[0].value.insert.mock.calls[0][0][0];
    expect(insertCall).toMatchObject({ barcode: '999', name: 'Bagel Seasoning', brand: "Trader Joe's" });
  });

  test('{ name, brand } with no barcode ("Suggest a product") stores barcode: null', async () => {
    const entry = await addRequest({ name: 'Everything Bagel Seasoning', brand: "Trader Joe's" });

    expect(entry.barcode).toBeNull();
    expect(entry.name).toBe('Everything Bagel Seasoning');
    expect(entry.brand).toBe("Trader Joe's");

    const insertCall = supabase.from.mock.results[0].value.insert.mock.calls[0][0][0];
    expect(insertCall.barcode).toBeNull();
    expect(insertCall.name).toBe('Everything Bagel Seasoning');
  });

  test('{ name } with no brand stores brand: null', async () => {
    const entry = await addRequest({ name: 'Mystery Snack' });
    expect(entry.brand).toBeNull();
  });
});

// ─── getRequests: name-only entries never falsely resolve ─────────────────────

describe('getRequests', () => {
  test('a barcode entry that now resolves is reported resolved: true', async () => {
    const product = { barcode: '111', name: 'Known Product' };
    getProductByBarcode.mockResolvedValue(product);

    await addRequest('111');
    const [result] = await getRequests();

    expect(result.resolved).toBe(true);
    expect(result.product).toBe(product);
  });

  test('a barcode entry with no match is reported resolved: false', async () => {
    getProductByBarcode.mockResolvedValue(null);

    await addRequest('222');
    const [result] = await getRequests();

    expect(result.resolved).toBe(false);
    expect(result.product).toBeNull();
  });

  test('a name-only entry never resolves, and never calls getProductByBarcode', async () => {
    await addRequest({ name: 'Couch-requested snack' });

    const results = await getRequests();
    const nameEntry = results.find((r) => r.name === 'Couch-requested snack');

    expect(nameEntry.resolved).toBe(false);
    expect(nameEntry.product).toBeNull();
    expect(getProductByBarcode).not.toHaveBeenCalled();
  });

  test('mixed list: name-only entry stays unresolved while a barcode entry resolves', async () => {
    getProductByBarcode.mockImplementation(async (barcode) =>
      barcode === '333' ? { barcode: '333', name: 'Found It' } : null
    );

    await addRequest({ name: 'Name only request' });
    await addRequest('333');

    const results = await getRequests();
    const nameResult = results.find((r) => r.name === 'Name only request');
    const barcodeResult = results.find((r) => r.barcode === '333');

    expect(nameResult.resolved).toBe(false);
    expect(barcodeResult.resolved).toBe(true);
  });
});

// ─── Offline / pendingSync recovery, both shapes ───────────────────────────────

describe('offline pendingSync recovery', () => {
  // NOTE: addRequest() itself fires a fire-and-forget retryPendingSyncs()
  // call in the background (see productRequests.js) as a bonus "clear out
  // anything that failed before" pass. That background call races with the
  // explicit retryPendingSyncs() calls below, so these tests assert on the
  // insert mock instance tied to the SUCCESS response (captured directly
  // from mockInsertResult's return value) and check its most recent call,
  // rather than assuming exactly one insert happens after the mock flips.

  test('bare barcode string: failed sync is flagged pending, then recovered by retryPendingSyncs', async () => {
    mockInsertResult({ error: { message: 'network down' } });

    const entry = await addRequest('444');
    expect(entry.pendingSync).toBe(true);

    // Confirm it's actually persisted to AsyncStorage as pending, not just
    // the returned object.
    const stored = JSON.parse(await AsyncStorage.getItem('@hc_product_requests'));
    expect(stored[0]).toMatchObject({ barcode: '444', pendingSync: true });

    // Connection recovers.
    const insertOnRetry = mockInsertResult({ error: null });
    await retryPendingSyncs();

    const storedAfter = JSON.parse(await AsyncStorage.getItem('@hc_product_requests'));
    expect(storedAfter[0]).toMatchObject({ barcode: '444', pendingSync: false });
    expect(insertOnRetry).toHaveBeenCalled();
  });

  test('object form (name-only): failed sync is flagged pending, then recovered by retryPendingSyncs', async () => {
    mockInsertResult({ error: { message: 'network down' } });

    const entry = await addRequest({ name: 'Offline Suggested Product', brand: 'Some Brand' });
    expect(entry.pendingSync).toBe(true);

    const stored = JSON.parse(await AsyncStorage.getItem('@hc_product_requests'));
    expect(stored[0]).toMatchObject({
      name: 'Offline Suggested Product',
      brand: 'Some Brand',
      barcode: null,
      pendingSync: true,
    });

    const insertOnRetry = mockInsertResult({ error: null });
    await retryPendingSyncs();

    const storedAfter = JSON.parse(await AsyncStorage.getItem('@hc_product_requests'));
    expect(storedAfter[0]).toMatchObject({ name: 'Offline Suggested Product', pendingSync: false });

    // Retry must have sent the name/brand through, not nulled them out.
    expect(insertOnRetry).toHaveBeenCalled();
    const lastCall = insertOnRetry.mock.calls[insertOnRetry.mock.calls.length - 1];
    expect(lastCall[0][0]).toMatchObject({ name: 'Offline Suggested Product', brand: 'Some Brand', barcode: null });
  });

  test('retryPendingSyncs is a no-op when nothing is pending', async () => {
    await addRequest('555'); // syncs immediately (default mock succeeds)
    supabase.from.mockClear();

    await retryPendingSyncs();

    expect(supabase.from).not.toHaveBeenCalled();
  });
});
