/**
 * remoteDataOverlay.js
 *
 * Phase 3 of context/plan-decouple-from-apple.md — lets company research and
 * ingredient analysis reach users by uploading a new products.db, with no app
 * build and no OTA update.
 *
 * ## Why an overlay and not a replacement
 *
 * `scorer.js` reads `COMPANY_DB` and `CACHED_INGREDIENT_ANALYSIS` through
 * plain synchronous imports, and `scoreProduct()` is called synchronously
 * from the render path (ProductScoreScreen). Turning those reads into
 * awaited database queries would mean making the scorer async, which fights
 * the plan's own guardrail that the scorer stays on-device and synchronous.
 *
 * So the bundled modules stay exactly as they are and keep their synchronous
 * interface. They become the OFFLINE SEED. At startup this module reads the
 * same data out of the downloaded SQLite catalog and `Object.assign`s it onto
 * those already-exported objects. Metro's module interop hands every importer
 * the same object reference, so a single assign updates every consumer —
 * `scorer.js`, `productParser.js`, `spotlight.js` and the four screens — with
 * no change to any of them.
 *
 * ## Deliberate properties
 *
 * - **Additive only.** Rows in the catalog add or replace keys; nothing is
 *   ever deleted. A company dropped from the catalog therefore keeps its
 *   bundled record rather than disappearing. That is the safe direction: a
 *   stale record beats a missing one on a screen that promises transparency.
 *   Removing a company still needs an app release.
 * - **Never throws.** Same contract as productStore.js. Any failure reports
 *   to Sentry and leaves the bundled seed untouched.
 * - **Tolerates an old catalog.** A products.db built before schemaVersion 2
 *   has none of these tables. That is not an error — the app simply runs on
 *   bundled data, exactly as it did before this file existed.
 * - **Timing.** App.js starts the product store without awaiting it, so a
 *   screen already on screen at cold start can render one frame from bundled
 *   data before the overlay lands. Every company surface (product score,
 *   company profile, company list) is reached by navigation after startup, so
 *   in practice they read post-overlay. This is a known, accepted seam, not
 *   an oversight — fixing it would mean blocking first paint on a database
 *   read, which is a worse trade.
 */
import { COMPANY_DB, BRAND_TO_COMPANY, BRAND_PARENT_MAP } from './companies';
import { CACHED_INGREDIENT_ANALYSIS } from './ingredientCache';
import { captureException } from '../utils/sentry';

const REQUIRED_TABLES = ['companies', 'brand_company_map', 'ingredient_analysis'];

/**
 * A products.db built before schemaVersion 2 has no reference tables at all.
 * Querying a missing table throws, so check sqlite_master first rather than
 * relying on try/catch to tell "old catalog" apart from "real failure."
 */
async function findPresentTables(db) {
  const placeholders = REQUIRED_TABLES.map(() => '?').join(',');
  const rows = await db.getAllAsync(
    `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN (${placeholders})`,
    REQUIRED_TABLES
  );
  return new Set(rows.map((row) => row.name));
}

/**
 * Parses a JSON column, returning null on malformed content instead of
 * throwing — one corrupt row must not cost us every other row in the table.
 */
function parseJsonOrNull(text) {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    return null;
  }
}

async function overlayCompanies(db) {
  const rows = await db.getAllAsync('SELECT id, json FROM companies');
  let applied = 0;
  for (const row of rows) {
    if (!row?.id) continue;
    const company = parseJsonOrNull(row.json);
    if (!company) continue;
    COMPANY_DB[row.id] = company;
    applied += 1;
  }
  return applied;
}

async function overlayBrandMaps(db) {
  const rows = await db.getAllAsync('SELECT brand, kind, value FROM brand_company_map');
  let applied = 0;
  for (const row of rows) {
    if (!row?.brand || typeof row.value !== 'string' || !row.value) continue;
    if (row.kind === 'company') {
      BRAND_TO_COMPANY[row.brand] = row.value;
    } else if (row.kind === 'parent') {
      BRAND_PARENT_MAP[row.brand] = row.value;
    } else {
      continue;
    }
    applied += 1;
  }
  return applied;
}

async function overlayIngredientAnalysis(db) {
  const rows = await db.getAllAsync('SELECT name, json FROM ingredient_analysis');
  let applied = 0;
  for (const row of rows) {
    if (!row?.name) continue;
    const analysis = parseJsonOrNull(row.json);
    if (!analysis) continue;
    CACHED_INGREDIENT_ANALYSIS[row.name] = analysis;
    applied += 1;
  }
  return applied;
}

/**
 * Overlays the catalog's reference data onto the bundled modules.
 *
 * Call once, after the catalog database is open. Never rejects. Resolves with
 * a small count object for logging and tests; callers are free to ignore it.
 *
 * @param {object|null} db An open expo-sqlite database handle, or null.
 */
export async function applyRemoteReferenceData(db) {
  const counts = { companies: 0, brands: 0, ingredients: 0 };
  if (!db) return counts;

  try {
    const present = await findPresentTables(db);

    // Each table is overlaid independently so a failure in one (or its
    // absence from an older catalog) still lets the other two through.
    if (present.has('companies')) {
      counts.companies = await overlayCompanies(db);
    }
    if (present.has('brand_company_map')) {
      counts.brands = await overlayBrandMaps(db);
    }
    if (present.has('ingredient_analysis')) {
      counts.ingredients = await overlayIngredientAnalysis(db);
    }
  } catch (error) {
    captureException(error, { function: 'applyRemoteReferenceData' });
  }

  return counts;
}
