// src/data/research/sourcing/eggs/danone_final.js
//
// NOTE: This sourcing fragment attaches to `horizon-family-brands`, NOT
// `danone`. As of April 2, 2024, Platinum Equity completed acquisition of a
// majority interest in Horizon Organic (and Wallaby) from Danone. Trade
// press reports Danone retains a minority stake; Platinum Equity's own
// announcement does not itself state this, so treat the "minority stake"
// detail as trade-press-sourced rather than company-confirmed. The app's
// product-to-company mapping was already corrected to point Horizon Organic
// products at the existing `horizon-family-brands` company record. This
// file follows that correction.
module.exports = {
  companyId: 'horizon-family-brands',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    // Cornucopia's own scorecard states Horizon's organic eggs are "sourced
    // from multiple distributors and other producers, including Hidden Villa
    // Ranch" — an aggregator model, not a single owned flock.
    model: 'aggregator',
    modelSource: {
      name: 'Cornucopia Organic Egg Scorecard — Horizon Organic (Danone)',
      url: 'https://www.cornucopia.org/scorecard/eggs/horizon-organic-danone/',
      date: '2024-03-22',
      basis: 'third-party-scorecard',
    },

    // A Certified Humane award naming "Horizon Organic Eggs" exists but is
    // dated May 23, 2007 — nearly 20 years old, and tied to a producer
    // (Braswell Foods) that current sourcing appears to have moved on from
    // (Hidden Villa Ranch is the licensee referenced in current material).
    // Too stale to list as a current certification.
    certifications: [],

    welfare: {
      // No current, company-wide housing determination could be confirmed.
      housing: 'unknown',

      scorecards: [
        {
          name: 'Cornucopia Organic Egg Scorecard',
          ratedLine: 'Horizon Organic',
          appliesTo: 'organic-line',
          rating: '0/1700',
          tier: '1-star (1-5 scale)',
          year: 2024,
          url: 'https://www.cornucopia.org/scorecard/eggs/horizon-organic-danone/',
        },
        // Hidden Villa Ranch's own 0/1700 score is DELIBERATELY omitted here.
        // Hidden Villa Ranch is a separate corporate entity (Luberski, Inc.),
        // and this scorecards[] array is matched against Horizon Organic
        // SKUs by the UI — including that score here would render a
        // different company's rating on a Horizon carton. The VERIFIED
        // supply-chain fact (Horizon sources from multiple producers
        // including Hidden Villa Ranch) is preserved above in `modelSource`,
        // which is the correct place for a sourcing-relationship fact that
        // isn't itself a rating of Horizon.
      ],
    },

    enforcement: [],

    practices: [],
  },
};
