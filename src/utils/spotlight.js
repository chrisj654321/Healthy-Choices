import { COMPANY_DB } from '../data/companies';
import { PRODUCT_DB } from '../data/products';

/**
 * Returns a { company, issue } object for the weekly company spotlight card,
 * or null when no eligible company exists.
 *
 * Eligible = company has at least one high-severity issue AND at least one
 * product in PRODUCT_DB (so the "explore" link is meaningful).
 *
 * Weekly rotation: stable all week, changes each Monday.
 * // Weekly rotation. To switch to daily later, divide by (1000*60*60*24).
 */
export function getSpotlightCompany() {
  const productCompanyIds = new Set(
    Object.values(PRODUCT_DB)
      .map((p) => p.companyId)
      .filter(Boolean)
  );

  const eligible = Object.values(COMPANY_DB).filter((company) => {
    const hasHighIssue = company.issues?.some((i) => i.severity === 'high');
    const hasProducts = productCompanyIds.has(company.id);
    return hasHighIssue && hasProducts;
  });

  if (eligible.length === 0) return null;

  // Weekly rotation. To switch to daily later, divide by (1000*60*60*24).
  const week = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  const company = eligible[week % eligible.length];

  const issue = company.issues.find((i) => i.severity === 'high');
  if (!issue) return null;

  return { company, issue };
}
