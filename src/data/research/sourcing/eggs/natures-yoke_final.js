// src/data/research/sourcing/eggs/natures-yoke_final.js
module.exports = {
  companyId: 'natures-yoke',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    // Nature's Yoke is produced by Westfield Egg Farm, Inc. (New Holland, PA),
    // a four-generation, family-run business per its own site.
    model: 'single-farm',
    modelSource: {
      name: "Nature's Yoke — About (Westfield Egg Farm, Inc.)",
      url: 'https://naturesyoke.com/about/',
      date: '2026-07-29',
      basis: 'company-disclosure',
    },

    // Certified Humane was NOT independently confirmed against Humane Farm
    // Animal Care's own certified-producer directory by any research or
    // fact-check pass — the only source is the company's own About page.
    // Left empty rather than published as a verified certification (see
    // matching practices[] entry below, and organic-valley_final.js for the
    // same call made correctly on the first pass).
    certifications: [],

    welfare: {
      // Company states all three of its lines (Organic, Legacy, Omega-3) are
      // Free-Range — the company's own consistent, company-wide statement.
      housing: 'free-range',
      housingSource: {
        name: "Nature's Yoke — About",
        url: 'https://naturesyoke.com/about/',
        date: '2026-07-29',
        basis: 'company-disclosure',
      },

      scorecards: [
        {
          name: 'Cornucopia Organic Egg Scorecard',
          ratedLine: "Nature's Yoke (Westfield Egg Farm)",
          appliesTo: 'organic-line',
          rating: '1115/1700',
          tier: '4-star (1-5 scale)',
          year: 2024,
          url: 'https://www.cornucopia.org/scorecard/eggs/natures-yoke-westfield-egg-farm/',
        },
      ],
    },

    // No enforcement, litigation, recall, or certificate-suspension record
    // was found for Westfield Egg Farm Inc. / Nature's Yoke — a clean/thin
    // record is an expected outcome for a small regional producer.
    enforcement: [],

    practices: [
      {
        claim:
          "The company states its three egg lines (Organic, Legacy, Omega-3) are '100% Certified Humane' and produced by its four-generation, family-run business. This claim was not confirmed against Humane Farm Animal Care's own certified-producer directory by any research or fact-check pass — it is the company's own statement about itself, not an independently verified certification.",
        basis: 'company-disclosure',
        source: {
          name: "Nature's Yoke — About",
          url: 'https://naturesyoke.com/about/',
          date: '2026-07-29',
        },
      },
    ],
  },
};
