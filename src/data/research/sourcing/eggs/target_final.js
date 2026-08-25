// src/data/research/sourcing/eggs/target_final.js
// Agent 4 (writer) output — sourcing-transparency pipeline, egg pilot.
// Catalog SKU in scope: Good & Gather Grade A Large Eggs (conventional, not
// organic and not cage-free labeled).
module.exports = {
  companyId: 'target',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    model: 'aggregator',
    modelSource: {
      name: 'Cornucopia Institute, Organic Egg Scorecard (private-label description)',
      url: 'https://www.cornucopia.org/scorecard/eggs/good-and-gather-target-2/',
      date: '2026-07-29',
      basis: 'third-party-scorecard',
    },

    // No third-party certification meets the directory-hit bar for the
    // conventional catalog SKU. Target's own site groups a *different*,
    // cage-free Good & Gather SKU under a "Certified Humane" filter — that is
    // recorded in practices[] below (company-disclosure basis), not here,
    // since it is Target's own merchandising categorization rather than an
    // independent Certified Humane directory confirmation.
    certifications: [],

    welfare: {
      // The catalog SKU ("Good & Gather Grade A Large Eggs") carries no
      // cage-free claim; Target separately sells cage-free and
      // organic-cage-free Good & Gather lines. Housing reflects the worst
      // system still sold.
      housing: 'caged',
      housingSource: {
        name: 'Target.com, Good & Gather product listings',
        url: 'https://www.target.com/',
        date: '2026-07-29',
        basis: 'company-disclosure',
      },
      // Cornucopia's "Good and Gather (Target)" scorecard entry showed a "0"
      // score, but the required /1700 denominator could not be confirmed on
      // the page across two targeted fetches (unlike the Kroger, Walmart,
      // and Albertsons entries, which all clearly showed "/1700"). Per the
      // writer rule requiring an explicit denominator, this entry is
      // omitted rather than asserted as "0/1700."
      scorecards: [],
    },

    // No egg-specific litigation, recall, or antitrust action naming Target
    // or Good & Gather was found in any source reviewed.
    enforcement: [],

    practices: [
      {
        claim:
          'Target stated in 2016 a goal to transition to a 100% cage-free egg supply chain by 2025, subject to available supply. The 2025 target was not met; Target\'s corporate sustainability page states a revised target of 100% cage-free unit sales and SKUs by 2030, with interim milestones of 57-61% of unit sales cage-free by the end of 2026 (81% of SKUs, rising to 94% by 2029), and states liquid eggs are already sourced 100% cage-free company-wide.',
        basis: 'company-disclosure',
        source: {
          name: 'Target Corporation, corporate sustainability page',
          url: 'https://corporate.target.com/sustainability-governance/responsible-supply-chains/animal-welfare',
          date: '2026-07-29',
        },
      },
      {
        claim:
          'Secondary reporting (Star Tribune) states Target\'s annual sustainability report disclosed a different, revenue-based cage-free figure of 68% (fiscal 2025) up from 57% the prior year. This revenue-based figure has not been reconciled with Target\'s own unit-volume-based progress figures above; the two may reflect different metrics or reporting periods and should not be averaged or treated as the same measurement.',
        basis: 'company-disclosure',
        source: {
          name: 'Star Tribune',
          url: 'https://www.startribune.com/cage-free-cage-free-eggs-target-walmart-sustainability-esg-goals-pledges/601112057',
          date: '2025-07',
        },
      },
      {
        claim:
          "Target's website groups a cage-free \"Good & Gather\" egg SKU (12ct Cage-Free Fresh Grade A Large Brown Eggs) under a \"Certified Humane\" product filter on target.com. This is a different SKU from the plain \"Good & Gather Grade A Large Eggs\" line in this catalog, which was not shown under that filter and carries no Certified Humane claim in its own product description.",
        basis: 'company-disclosure',
        source: {
          name: 'Target.com, Certified Humane category page',
          url: 'https://www.target.com/c/eggs-dairy-grocery/certified-humane/-/N-5xsziZvw5v8',
          date: '2026-07-29',
        },
      },
    ],
  },
};
