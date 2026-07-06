/**
 * Tests for src/utils/alternatives.js's getAlternatives() — Wave 4 of the
 * product-catalog re-architecture replaced the old "scan Object.values(
 * PRODUCT_DB), filter curated, scoreProduct() each survivor" logic with a
 * single SQL-backed productStore.js call (getCuratedGradeABCandidates()),
 * which already guarantees curated + grade A/B. Only the same-category
 * match and scanned-barcode exclusion still happen in JS here.
 *
 * productStore.js is mocked wholesale (same pattern as other utils tests
 * that mock native-backed modules) so these tests pin getAlternatives()'s
 * own filtering/sorting/shaping logic, not productStore.js's SQL.
 */

const mockGetCuratedGradeABCandidates = jest.fn();

jest.mock('../../data/productStore', () => ({
  getCuratedGradeABCandidates: (...args) => mockGetCuratedGradeABCandidates(...args),
}));

import { getAlternatives } from '../alternatives';

function makeCandidate({ barcode, category = 'Cereals', score = 80, grade = 'A' } = {}) {
  return {
    product: {
      barcode,
      name: `Product ${barcode}`,
      brand: 'Some Brand',
      companyId: 'some-co',
      category,
      image: 'https://example.com/img.png',
    },
    score,
    grade,
  };
}

beforeEach(() => {
  mockGetCuratedGradeABCandidates.mockReset();
});

describe('getAlternatives', () => {
  test('returns empty result when the scanned product has no category', async () => {
    const result = await getAlternatives({ barcode: '123' });
    expect(result).toEqual({ alternatives: [], count: 0 });
    expect(mockGetCuratedGradeABCandidates).not.toHaveBeenCalled();
  });

  test('returns empty result when product is null/undefined', async () => {
    await expect(getAlternatives(null)).resolves.toEqual({ alternatives: [], count: 0 });
    await expect(getAlternatives(undefined)).resolves.toEqual({ alternatives: [], count: 0 });
  });

  test('filters candidates to the same normalized category, excludes scanned barcode', async () => {
    mockGetCuratedGradeABCandidates.mockResolvedValue([
      makeCandidate({ barcode: 'AAA', category: 'en:Cereals', score: 70 }),
      makeCandidate({ barcode: 'BBB', category: 'Snack Bars', score: 99 }), // different category
      makeCandidate({ barcode: 'SCANNED', category: 'Cereals', score: 100 }), // scanned product itself
    ]);

    const result = await getAlternatives({ barcode: 'SCANNED', category: 'Cereals' });

    expect(result.alternatives.map((a) => a.barcode)).toEqual(['AAA']);
    expect(result.count).toBe(1);
  });

  test('sorts by score descending and applies the limit', async () => {
    mockGetCuratedGradeABCandidates.mockResolvedValue([
      makeCandidate({ barcode: 'LOW', score: 60 }),
      makeCandidate({ barcode: 'HIGH', score: 95 }),
      makeCandidate({ barcode: 'MID', score: 80 }),
    ]);

    const result = await getAlternatives({ barcode: 'SCANNED', category: 'Cereals' }, { limit: 2 });

    expect(result.alternatives.map((a) => a.barcode)).toEqual(['HIGH', 'MID']);
    expect(result.count).toBe(3);
  });

  test('spreads the full product plus _score/_grade, preserving the existing output contract', async () => {
    mockGetCuratedGradeABCandidates.mockResolvedValue([
      makeCandidate({ barcode: 'AAA', score: 88, grade: 'A' }),
    ]);

    const result = await getAlternatives({ barcode: 'SCANNED', category: 'Cereals' });

    expect(result.alternatives[0]).toEqual(
      expect.objectContaining({
        barcode: 'AAA',
        name: 'Product AAA',
        companyId: 'some-co',
        _score: 88,
        _grade: 'A',
      })
    );
  });

  test('returns empty result when no candidates match the category', async () => {
    mockGetCuratedGradeABCandidates.mockResolvedValue([
      makeCandidate({ barcode: 'AAA', category: 'Snack Bars' }),
    ]);

    const result = await getAlternatives({ barcode: 'SCANNED', category: 'Cereals' });

    expect(result).toEqual({ alternatives: [], count: 0 });
  });

  test('returns empty result when the candidate pool itself is empty', async () => {
    mockGetCuratedGradeABCandidates.mockResolvedValue([]);

    const result = await getAlternatives({ barcode: 'SCANNED', category: 'Cereals' });

    expect(result).toEqual({ alternatives: [], count: 0 });
  });
});
