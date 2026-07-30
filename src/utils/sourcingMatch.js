/**
 * Product-level matching for the sourcing-transparency evidence schema
 * (.claude/skills/sourcing-transparency/references/evidence-schema.md).
 *
 * A `company.sourcing` record hangs off a COMPANY, but almost every piece of
 * evidence in it (a scorecard, a certification's scope) describes ONE brand
 * LINE, not the whole company. Most brands sell eggs in multiple housing
 * tiers under the same name (caged AND cage-free AND pasture-raised), so a
 * scanned product's own name is the ground truth for which tier is actually
 * in the user's hand — more reliable, per-SKU, than any company-wide field.
 *
 * These are pure functions (no RN dependency) — see
 * src/utils/__tests__/sourcingMatch.test.js.
 */

// Human labels for the DETECTED tier (never for company.sourcing.welfare.housing,
// which is a deliberately company-wide "worst system" field — see
// evidence-schema.md's Display rules).
const TIER_LABELS = {
  conventional: 'Conventional / Caged',
  'cage-free': 'Cage-Free',
  'free-range': 'Free-Range',
  organic: 'Organic (no housing claim on this carton)',
  'pasture-raised': 'Pasture-Raised',
};

/**
 * detectHousingTier(productName) -> 'pasture-raised' | 'free-range' | 'cage-free' | 'organic' | 'conventional'
 *
 * Reads the tier directly off the product's own name — this is what's
 * printed on the label, and is more reliable per-SKU than any company-wide
 * field. Ordered most-specific-claim first: a name can contain multiple
 * words ("Organic Pasture-Raised") — pasture beats organic-alone since it's
 * the more specific/higher claim.
 */
export function detectHousingTier(productName) {
  const name = (productName || '').toLowerCase();

  if (/pasture[\s-]raised/.test(name)) return 'pasture-raised';
  if (/free[\s-]range/.test(name)) return 'free-range';
  if (/cage[\s-]free/.test(name)) return 'cage-free';
  if (/organic/.test(name)) return 'organic';
  return 'conventional';
}

// appliesTo matching, isolated for readability/testability.
function appliesToMatchesTier(appliesTo, tier, nameIsOrganic) {
  if (!appliesTo) return false;
  if (appliesTo === 'all-lines') return true;
  if (appliesTo === 'conventional-line') return tier === 'conventional';
  if (appliesTo === 'organic-line') {
    // An organic pasture-raised (or organic free-range) SKU is still on the
    // organic line — but only when the product's OWN name says "organic".
    // Without that, a plain pasture-raised/free-range SKU must not borrow
    // the organic line's rating.
    if (tier === 'organic') return true;
    if ((tier === 'pasture-raised' || tier === 'free-range') && nameIsOrganic) return true;
    return false;
  }
  return false;
}

// Tier-name phrases as they actually appear in scope prose (evidence-schema.md
// requires scope to be written in plain English, not an enum) — used only to
// check whether an EXHAUSTIVE "X lines only" list names the current tier.
const TIER_SCOPE_PHRASES = {
  conventional: ['conventional', 'flagship'],
  'cage-free': ['cage free', 'cage-free'],
  'free-range': ['free range', 'free-range'],
  'pasture-raised': ['pasture raised', 'pasture-raised'],
  organic: ['organic'],
};

/**
 * scopeCoversTier(scope, tier) -> boolean
 *
 * A cert's `scope` is free text the pipeline writes to state exactly what
 * the cert covers. Two patterns actually occur in real data:
 *   1. An EXCLUSION: "...NOT the flagship conventional [Brand] product" —
 *      names what's OUT.
 *   2. An EXHAUSTIVE INCLUSION: "Free Range and Pasture Raised lines
 *      only" — the word "only" signals this list is the complete set;
 *      any tier not named in it is implicitly excluded, even though the
 *      sentence never says so directly. Missing this pattern is what let
 *      a real catalog SKU ("Eggland's Best Cage Free...") surface a
 *      certification whose scope never once mentions cage-free.
 * Absent either signal, the cert is assumed to cover the tier — this stays
 * conservative in the direction of not inventing an exclusion no one wrote.
 */
function scopeCoversTier(scopeRaw, tier) {
  const scope = (scopeRaw || '').toLowerCase();
  if (!scope) return true;

  const ownPhrases = TIER_SCOPE_PHRASES[tier] || [];
  const namesThisTier = ownPhrases.some((p) => scope.includes(p));

  // Pattern 1: explicit exclusion of the tier being checked.
  if (tier === 'conventional' && (scope.includes('conventional') || scope.includes('flagship'))) {
    return false;
  }

  // Pattern 2: "<tiers> lines only" / "only ... <tiers>" — an exhaustive
  // list that doesn't name this tier means this tier is excluded, even
  // when no exclusion phrase for THIS tier exists.
  if (scope.includes('only') && !namesThisTier) return false;

  return true;
}

/**
 * matchSourcingToProduct(sourcing, tier, productName) -> {
 *   housingLabel: string,         // human label for `tier` itself — NOT company.sourcing.welfare.housing
 *   scorecard: object | null,     // the ONE scorecards[] entry whose appliesTo matches this tier, or null
 *   certifications: array,        // certifications[] entries whose `scope` text doesn't explicitly
 *                                 // exclude this tier (see filtering rule below)
 * }
 *
 * `productName` is required to resolve the 'organic-line' + pasture/free-range
 * case above (tier alone collapses "organic pasture-raised" down to just
 * 'pasture-raised' — see detectHousingTier). Defaults to '' (never matches
 * that case) so a caller that omits it fails conservatively, not by
 * over-matching.
 *
 * `appliesTo` matching: 'organic-line' matches tier 'organic' OR 'pasture-raised' OR 'free-range' when
 * the product name ALSO contains "organic" (an organic pasture-raised SKU is still on the organic
 * line); 'conventional-line' matches tier 'conventional'; 'all-lines' always matches.
 *
 * Certification filtering: see scopeCoversTier() above — handles both an explicit exclusion
 * ("NOT the flagship conventional product") and an exhaustive inclusion list ("Free Range and
 * Pasture Raised lines only", where "only" makes every unnamed tier implicitly excluded).
 *
 * Never returns "the nearest scorecard" when nothing matches — returns scorecard: null and lets the
 * caller render nothing. Showing an unmatched rating is the exact bug this function exists to prevent.
 */
export function matchSourcingToProduct(sourcing, tier, productName = '') {
  const housingLabel = TIER_LABELS[tier] || TIER_LABELS.conventional;

  if (!sourcing) {
    return { housingLabel, scorecard: null, certifications: [] };
  }

  const nameIsOrganic = /organic/i.test(productName || '');

  const scorecards = sourcing.welfare?.scorecards ?? [];
  const scorecard =
    scorecards.find((sc) => appliesToMatchesTier(sc.appliesTo, tier, nameIsOrganic)) || null;

  const certifications = (sourcing.certifications ?? []).filter((cert) =>
    scopeCoversTier(cert.scope, tier)
  );

  return { housingLabel, scorecard, certifications };
}
