// src/data/research/sourcing/eggs/organic-valley_final.js
module.exports = {
  companyId: 'organic-valley',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    // CROPP Cooperative (Organic Valley) is a genuine farmer-owned co-op:
    // board elected by farmer members, one-farm-one-vote, 5.5% equity
    // investment requirement. Confirmed directly on CROPP's own farmer-facing
    // FAQ page.
    model: 'co-op',
    modelSource: {
      name: 'CROPP Cooperative — Farmers FAQ',
      url: 'https://www.farmers.coop/frequently-asked-questions/',
      date: '2026-07-29',
      basis: 'company-disclosure',
    },

    // Certified Humane status for Organic Valley eggs could not be confirmed
    // against a certifier directory (organicvalley.coop's own page 403'd;
    // certifiedhumane.org producer listing not independently loaded) — left
    // out per the no-directory-hit rule rather than asserted.
    certifications: [],

    welfare: {
      // Current company-wide housing system not independently confirmed.
      // A 2011 advocacy complaint alleged limited "sun porch" outdoor access
      // at one West Coast supplier, but current status of that supply
      // relationship was not verified, so this is not stretched into a
      // company-wide housing determination.
      housing: 'unknown',

      scorecards: [
        {
          name: 'Cornucopia Organic Egg Scorecard',
          ratedLine: 'Organic Valley',
          appliesTo: 'all-lines',
          rating: '555/1700',
          tier: '2-star (1-5 scale)',
          year: 2024,
          url: 'https://www.cornucopia.org/scorecard/eggs/organic-valley/',
        },
      ],
    },

    enforcement: [
      {
        year: 2011,
        body: 'USDA National Organic Program (complaint filed by The Cornucopia Institute, an advocacy organization; no agency action recorded)',
        action:
          'The Cornucopia Institute, an advocacy organization, filed a complaint with USDA alleging that a West Coast egg supplier used by CROPP Cooperative (Petaluma Egg Farm) provided outdoor access only through enclosed, screened "sun porches" that did not meet federal organic outdoor-access standards. As of 2011 — no adjudicated fine, certificate suspension, or court ruling against Organic Valley/CROPP was found, and the current (2026) status of this specific supply relationship has not been confirmed.',
        status: 'alleged',
        amount: null,
        source: {
          name: 'Common Dreams (reproducing Cornucopia Institute release)',
          url: 'https://www.commondreams.org/newswire/2011/04/13/watchdog-organic-valley-herbrucks-violating-federal-organic-standards-factory',
        },
      },
    ],

    practices: [
      {
        claim:
          'CROPP Cooperative reports around 1,600 farmer-members across 29 states, governed one-farm-one-vote by a board elected from the farmer membership.',
        basis: 'company-disclosure',
        source: {
          name: 'CROPP Cooperative — Farmers FAQ',
          url: 'https://www.farmers.coop/frequently-asked-questions/',
          date: '2026-07-29',
        },
      },
      {
        claim:
          "CROPP's Egg Pool, founded in 1994, includes about 50 organic egg-producing member farms, with a regional minimum flock size as low as 5,000 birds depending on region and route proximity.",
        basis: 'company-disclosure',
        source: {
          name: 'CROPP Cooperative — Egg Pool',
          url: 'https://www.farmers.coop/pools/egg-pool/',
          date: '2026-07-29',
        },
      },
    ],
  },
};
