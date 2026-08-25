// src/data/research/sourcing/eggs/walmart_final.js
// Agent 4 (writer) output — sourcing-transparency pipeline, egg pilot.
// Catalog SKUs in scope: Great Value Grade A Large White Eggs (conventional);
// Great Value Cage Free Large Brown Eggs (cage-free).
module.exports = {
  companyId: 'walmart',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    model: 'aggregator',
    modelSource: {
      name: 'Cornucopia Institute, Organic Egg Scorecard (private-label description)',
      url: 'https://www.cornucopia.org/scorecard/eggs/great-value-walmart/',
      date: '2026-07-29',
      basis: 'third-party-scorecard',
    },

    // Certified Humane: searches found no listing for "Great Value" itself
    // (only other Walmart-carried brands, e.g. Happy Egg Co., Pete & Gerry's,
    // were identified as certified) — omitted.
    certifications: [],

    welfare: {
      // Walmart sells both a conventional line (this catalog SKU, no
      // cage-free claim) and a cage-free line (Great Value Cage Free);
      // housing reflects the worst system still sold.
      housing: 'caged',
      housingSource: {
        name: 'Walmart / Great Value product listings',
        url: 'https://www.walmart.com/',
        date: '2026-07-29',
        basis: 'company-disclosure',
      },
      scorecards: [
        {
          name: 'Cornucopia Organic Egg Scorecard',
          ratedLine: 'Great Value organic eggs (private label store brand)',
          appliesTo: 'organic-line',
          rating: '0/1700',
          tier: '1-star (1-5 scale)',
          year: 2024,
          url: 'https://www.cornucopia.org/scorecard/eggs/great-value-walmart/',
        },
      ],
    },

    // No enforcement entry is included for Walmart. What was found and why
    // it was excluded:
    // - Processed Egg Products Antitrust MDL (2:08-md-02002): Walmart does
    //   not appear on the roster of 12 retailer direct-purchaser plaintiffs
    //   found across convergent secondary sources — confirmed as an absence,
    //   so no case applies to Walmart here.
    // - Marketside Organic v. Cal-Maine (N.D. Cal., filed Jan. 2018): names
    //   Walmart as a defendant, but concerns the separate "Marketside
    //   Organic" brand, not "Great Value" (this catalog's brand), and no
    //   resolution (settlement/dismissal/trial outcome) was found in any
    //   source reviewed. Omitted as out-of-brand-scope with an unconfirmed
    //   status.
    // - 2018 Rose Acre Farms recall (200M+ eggs): reported to have reached
    //   Walmart stores, but brand attribution to "Great Value" specifically
    //   was never confirmed. Omitted as unconfirmed.
    // - NPPC v. Ross (Prop 12): Walmart's role as party/amicus was
    //   explicitly not confirmed in any source. Omitted.
    enforcement: [],

    practices: [
      {
        claim:
          "Walmart U.S. and Sam's Club U.S. stated in April 2016 a goal to transition to a 100% cage-free egg supply chain by 2025.",
        basis: 'company-disclosure',
        source: {
          name: 'Walmart press release, via Food Logistics (secondary)',
          url: 'https://www.foodlogistics.com/sustainability/news/12191358/walmart-walmart-commits-to-100-cagefree-eggs-by-2025',
          date: '2016-04-05',
        },
      },
      {
        claim:
          "According to secondary reporting, Walmart's cage-free progress was reported at approximately 14% of sales (2019), 21% of Walmart U.S. sales and 41% of Sam's Club sales (2023), and 27% of sales (2024). By 2024 the original 2025 100% target was described as unattainable, and no new 100% target date was located. None of these figures were confirmed against a primary Walmart document, which could not be reached this session (repeated connection errors).",
        basis: 'company-disclosure',
        source: {
          name: 'Secondary analysis, AInvest',
          url: 'https://www.ainvest.com/news/walmart-ethical-supply-chain-crossroads-laggards-pace-cage-free-revolution-2506/',
          date: '2025',
        },
      },
    ],
  },
};
