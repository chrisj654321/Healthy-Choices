/**
 * "Buy this instead" lookup — the ONLY entry point screens should use to find
 * higher-graded alternatives for a scanned product.
 *
 * ARCHITECTURE NOTE: this module owns all lookup logic and exposes a single
 * async function. The internals are backed by productStore.js's async SQLite
 * queries (Wave 4 of the product-catalog re-architecture) — the curated,
 * grade-A/B cut now happens in SQL via getCuratedGradeABCandidates(), using
 * the precomputed `grade` column, so no client-side scoreProduct() call is
 * needed here at all. Screens must always call getAlternatives() — never
 * query productStore.js or any other product source directly — so that any
 * future internals swap stays invisible to callers.
 *
 * "Best available" ceiling fallback (added for the low/empty-category case):
 * when a category has no curated 80+ (grade A/B) match, this falls back to
 * productStore.js's getBestInCategory() — the single highest-scoring product
 * in-category regardless of grade — so a low-scoring category still shows an
 * honest "best we found" pick instead of nothing. That fallback item is
 * flagged `ceiling: true` so callers can render it with different, non-
 * endorsement copy, and is only ever returned if it scores strictly higher
 * than the scanned product (never recommend something equal or worse).
 */
import { getCuratedGradeABCandidates, getBestInCategory } from '../data/productStore';

const DEFAULT_LIMIT = 12;

/**
 * Normalizes a category string for comparison. Generated-catalog categories
 * are often raw taxonomy tags like "en:nut-bars" — strip the "en:" prefix and
 * lowercase so "Cereals" and "en:Cereals" would match, while still requiring
 * an exact same-category match (no fuzzy category inference).
 */
function normalizeCategory(cat) {
  if (!cat || typeof cat !== 'string') return null;
  const stripped = cat.replace(/^en:/i, '').trim().toLowerCase();
  return stripped || null;
}

/**
 * getAlternatives(product, { limit, scannedScore })
 *
 * Returns a Promise resolving to:
 *   { alternatives: Array<AlternativeProduct>, count: number }
 *
 * AlternativeProduct is the same shape as a PRODUCT_DB entry, plus a
 * computed `_score`/`_grade` pair so callers don't need to re-score. A
 * ceiling-fallback item (see below) additionally carries `ceiling: true`.
 *
 * Selection logic:
 *   - Same normalized category as `product`, excludes the scanned barcode.
 *   - Primary: grade A or B (80+) only. Prefers curated products (real
 *     image + resolvable companyId) with a real image over generated-catalog
 *     entries; within each tier, sorts by score descending. Returns up to
 *     `limit` (default 12) alternatives plus a total count.
 *   - Fallback ("best available" ceiling): if NO 80+ match exists in-category,
 *     falls back to the single highest-scoring in-category product regardless
 *     of grade (productStore.js's getBestInCategory()), so a low-scoring
 *     category (e.g. fried chips) still shows an honest best-we-found pick
 *     instead of nothing. Only used when the caller passes `scannedScore`
 *     (the scanned product's own 0-100 score — this module never re-derives
 *     it via scoreProduct()) AND the best-in-category item scores strictly
 *     higher than `scannedScore` — never recommend something equal or worse.
 *     Without `scannedScore`, or with nothing that beats it, this resolves
 *     to the same empty result as having no candidates at all.
 *
 * Edge cases: no category on the scanned product resolves to
 * { alternatives: [], count: 0 } — callers should render nothing.
 */
export async function getAlternatives(product, { limit = DEFAULT_LIMIT, scannedScore } = {}) {
  if (!product || !product.category) {
    return { alternatives: [], count: 0 };
  }

  const targetCategory = normalizeCategory(product.category);
  if (!targetCategory) {
    return { alternatives: [], count: 0 };
  }

  const scannedBarcode = product.barcode != null ? String(product.barcode) : null;

  // Curated + grade A/B is already guaranteed by the SQL query — recommending
  // an alternative is an endorsement, and only hand-curated products with a
  // real photo, resolvable company, and a non-insufficient-data A/B grade
  // clear that bar. Only the category match (regex-based normalization, not
  // worth re-deriving in SQL) and the scanned-barcode exclusion happen here.
  const candidatePool = await getCuratedGradeABCandidates();

  const candidates = [];
  for (const { product: entry, score, grade } of candidatePool) {
    if (!entry || !entry.barcode) continue;
    if (scannedBarcode && String(entry.barcode) === scannedBarcode) continue;

    const entryCategory = normalizeCategory(entry.category);
    if (!entryCategory || entryCategory !== targetCategory) continue;

    candidates.push({ entry, score, grade });
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);

    const total = candidates.length;
    const alternatives = candidates.slice(0, limit).map((c) => ({
      ...c.entry,
      _score: c.score,
      _grade: c.grade,
    }));

    return { alternatives, count: total };
  }

  // No 80+ match in this category — offer the "best available" ceiling
  // fallback instead of nothing, but only if we actually know the scanned
  // product's own score to compare against.
  if (typeof scannedScore !== 'number') {
    return { alternatives: [], count: 0 };
  }

  const best = await getBestInCategory(targetCategory, scannedBarcode);
  if (!best || !best.product || typeof best.score !== 'number' || best.score <= scannedScore) {
    return { alternatives: [], count: 0 };
  }

  const ceilingAlternative = {
    ...best.product,
    _score: best.score,
    _grade: best.grade,
    ceiling: true,
  };

  return { alternatives: [ceilingAlternative], count: 1 };
}
