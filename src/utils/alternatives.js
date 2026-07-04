/**
 * "Buy this instead" lookup — the ONLY entry point screens should use to find
 * higher-graded alternatives for a scanned product.
 *
 * ARCHITECTURE NOTE: this module owns all lookup logic and exposes a single
 * async function. The implementation today is synchronous under the hood
 * (in-memory PRODUCT_DB), but a SQLite productStore migration (Wave 2, in
 * progress separately) will replace the internals with real async queries.
 * Screens must always call getAlternatives() — never scan PRODUCT_DB or any
 * other product source directly — so that swap-in is invisible to callers.
 */
import { PRODUCT_DB } from '../data/products';
import { scoreProduct } from './scorer';

const DEFAULT_LIMIT = 12;

/**
 * A product counts as "curated" (vs. generated-catalog junk) when it has a
 * real photo and a resolvable company — the two signals that distinguish
 * hand-entered MANUAL_PRODUCTS from the bulk products_generated.json import,
 * without needing to import the private MANUAL_PRODUCTS map itself.
 */
function isCurated(product) {
  return Boolean(product.image) && Boolean(product.companyId);
}

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
 * getAlternatives(product, { limit })
 *
 * Returns a Promise resolving to:
 *   { alternatives: Array<AlternativeProduct>, count: number }
 *
 * AlternativeProduct is the same shape as a PRODUCT_DB entry, plus a
 * computed `_score`/`_grade` pair so callers don't need to re-score.
 *
 * Selection logic:
 *   - Same normalized category as `product`, excludes the scanned barcode.
 *   - Grade A or B only.
 *   - Prefers curated products (real image + resolvable companyId) with a
 *     real image over generated-catalog entries; within each tier, sorts by
 *     score descending.
 *   - Returns up to `limit` (default 12) alternatives plus a total count.
 *
 * Edge cases: no category on the scanned product, or zero A/B matches,
 * resolve to { alternatives: [], count: 0 } — callers should render nothing.
 */
export async function getAlternatives(product, { limit = DEFAULT_LIMIT } = {}) {
  if (!product || !product.category) {
    return { alternatives: [], count: 0 };
  }

  const targetCategory = normalizeCategory(product.category);
  if (!targetCategory) {
    return { alternatives: [], count: 0 };
  }

  const scannedBarcode = product.barcode != null ? String(product.barcode) : null;

  const candidates = [];

  // Curated-only, and curation is checked BEFORE scoring: isCurated is a
  // cheap field test that cuts ~136k catalog entries down to the ~900
  // curated ones, so scoreProduct (expensive) runs on at most that many.
  // Recommending an alternative is an endorsement — only hand-curated
  // products with a real photo and company clear that bar anyway.
  for (const entry of Object.values(PRODUCT_DB)) {
    if (!entry || !entry.barcode) continue;
    if (!isCurated(entry)) continue;
    if (scannedBarcode && String(entry.barcode) === scannedBarcode) continue;

    const entryCategory = normalizeCategory(entry.category);
    if (!entryCategory || entryCategory !== targetCategory) continue;

    // Need ingredient/nutrition data to score at all.
    let scored;
    try {
      scored = scoreProduct(entry);
    } catch (_) {
      continue;
    }
    if (scored.insufficientData) continue;

    const grade = scored.displayGrade || scored.grade;
    if (grade !== 'A' && grade !== 'B') continue;

    candidates.push({ entry, score: scored.score, grade });
  }

  if (candidates.length === 0) {
    return { alternatives: [], count: 0 };
  }

  candidates.sort((a, b) => b.score - a.score);

  const total = candidates.length;
  const alternatives = candidates.slice(0, limit).map((c) => ({
    ...c.entry,
    _score: c.score,
    _grade: c.grade,
  }));

  return { alternatives, count: total };
}
