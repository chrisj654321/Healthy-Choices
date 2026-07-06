import { COMPANY_DB } from '../data/companies';
import { getSpotlightEligibleCompanies } from '../data/productStore';

/**
 * Returns a { company, issue } object for the weekly company spotlight card,
 * or null when no eligible company exists. Async — reads the eligible
 * company list from productStore's precomputed spotlight_company_ids
 * summary table (already filtered to companies with at least one
 * high-severity issue AND at least one product) instead of scanning
 * PRODUCT_DB in JS.
 *
 * Weekly rotation: stable all week, changes each Monday.
 * // Weekly rotation. To switch to daily later, divide by (1000*60*60*24).
 */
export async function getSpotlightCompany() {
  const eligibleRows = await getSpotlightEligibleCompanies();

  const eligible = eligibleRows
    .map((row) => COMPANY_DB[row.companyId])
    .filter(Boolean);

  if (eligible.length === 0) return null;

  // Weekly rotation among RECOGNIZABLE, household-name brands only — the spotlight is a
  // weekly release + weekly change, and it should always feature a company people know.
  // Anchored so Sargento leads the week of 2026-06-29; each following week advances to the
  // next name and wraps around. Any id not currently eligible is skipped; if none of the
  // curated names are eligible we fall back to rotating the full eligible set.
  const WEEK_MS = 1000 * 60 * 60 * 24 * 7;
  const FEATURED_ORDER = [
    'sargento', 'coca-cola', 'pepsico', 'nestle', 'kelloggs', 'general-mills',
    'kraft-heinz', 'hershey', 'mars', 'mondelez', 'campbell', 'tyson', 'hormel',
    'mccormick', 'danone', 'unilever', 'conagra', 'red-bull', 'monster-beverage',
    'keurig-dr-pepper', 'jm-smucker', 'dole-food', 'smithfield', 'oatly',
    'celsius-holdings', 'tropicana-brands', 'tillamook', 'blue-diamond',
    'bumble-bee', 'starkist',
  ];
  const eligibleById = new Map(eligible.map((c) => [c.id, c]));
  const pool = FEATURED_ORDER.map((id) => eligibleById.get(id)).filter(Boolean);
  const rotation = pool.length > 0 ? pool : eligible;

  // Anchored weekly index (deterministic, not dependent on "now" beyond the week bucket).
  const ANCHOR_WEEK = Math.floor(Date.parse('2026-06-29T00:00:00Z') / WEEK_MS);
  const week = Math.floor(Date.now() / WEEK_MS);
  const idx = (((week - ANCHOR_WEEK) % rotation.length) + rotation.length) % rotation.length;
  const company = rotation[idx];

  const issue = company.issues.find((i) => i.severity === 'high');
  if (!issue) return null;

  return { company, issue };
}
