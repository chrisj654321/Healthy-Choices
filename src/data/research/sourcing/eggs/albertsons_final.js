// src/data/research/sourcing/eggs/albertsons_final.js
// Agent 4 (writer) output — sourcing-transparency pipeline, egg pilot.
// Catalog SKU in scope: Lucerne Grade AA Large Eggs (conventional store
// brand, Albertsons/Safeway family).
module.exports = {
  companyId: 'albertsons',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    model: 'aggregator',
    modelSource: {
      name: 'Cornucopia Institute, Organic Egg Scorecard (private-label description)',
      url: 'https://www.cornucopia.org/scorecard/eggs/o-organics-albertsons/',
      date: '2026-07-29',
      basis: 'third-party-scorecard',
    },

    // A Certified Humane award naming Lucerne Cage-Free, O Organics, and Open
    // Nature eggs exists, but is dated December 17, 2012 — nearly 14 years
    // old, with no independent reconfirmation found since. Per the same
    // standard applied to danone_final.js's 2007 Braswell/Horizon award (and
    // to keep that call consistent rather than reaching a different answer
    // for the same evidentiary situation), this is too stale to list as a
    // current certification. Preserved below as a dated practice claim
    // instead. It would not cover the conventional Lucerne Grade AA line in
    // this catalog in any case — Certified Humane categorically excludes
    // caged housing.
    certifications: [],

    welfare: {
      // The catalog SKU (Lucerne Grade AA Large Eggs) carries no cage-free
      // claim; Albertsons separately sells cage-free Lucerne, O Organics, and
      // Open Nature lines. Housing reflects the worst system still sold.
      housing: 'caged',
      housingSource: {
        name: 'Albertsons.com, Lucerne product listings',
        url: 'https://www.albertsons.com/',
        date: '2026-07-29',
        basis: 'company-disclosure',
      },
      scorecards: [
        {
          name: 'Cornucopia Organic Egg Scorecard',
          // This rates a DIFFERENT Albertsons private-label brand entirely —
          // "O Organics" — not "Lucerne," the brand in this catalog. No
          // Cornucopia egg-scorecard entry for Lucerne itself was found.
          ratedLine: 'O Organics (Albertsons)',
          appliesTo: 'organic-line',
          rating: '30/1700',
          tier: '1-star (1-5 scale)',
          year: 2024,
          url: 'https://www.cornucopia.org/scorecard/eggs/o-organics-albertsons/',
        },
      ],
    },

    // In re: Processed Egg Products Antitrust Litigation (MDL 2:08-md-02002)
    // is deliberately NOT recorded in enforcement[] for Albertsons, same
    // reasoning as kroger_final.js: multiple secondary sources report
    // Albertsons was one of 12 retail companies that joined as a
    // direct-purchaser PLAINTIFF (not a defendant), alongside Kroger and
    // others. enforcement[] is read as an action AGAINST this company;
    // recording Albertsons' own lawsuit there would misrepresent its role.
    //
    // A 2010 Wright County Egg / Hillandale Farms Salmonella recall
    // (~228 million eggs nationally) is reported by a single secondary
    // source to have involved cartons under "Lucerne" branding. This is
    // 16 years old, single-sourced, and could not be re-confirmed against
    // a primary FDA recall notice (404) — omitted rather than included as
    // a company-attributed fact.
    enforcement: [],

    practices: [
      {
        claim:
          'A Certified Humane award (Humane Farm Animal Care) naming Albertsons\' Lucerne Cage-Free, O Organics, and Open Nature egg lines is dated December 17, 2012. This has not been independently reconfirmed since and is nearly 14 years old — treat as historical, not a current certification status. It would not, in any case, cover the conventional Lucerne Grade AA Large Eggs line in this catalog, which Certified Humane\'s own housing standards categorically exclude.',
        basis: 'certification',
        source: {
          name: 'Certified Humane (certifiedhumane.org)',
          url: 'https://certifiedhumane.org/safeways-lucerne-cage-free-o-organic-and-open-nature-eggs-are-certified-humane/',
          date: '2012-12-17',
        },
      },
      {
        claim:
          'Albertsons Companies stated in March 2016 a goal of working with suppliers toward sourcing 100% cage-free eggs for its retail shell-egg products by 2025, based on available supply, across its store banners (Safeway, Vons, Pavilions, Jewel-Osco, Shaw\'s, Acme, and others). In March 2017, Albertsons stated it was expanding this commitment to include retail liquid eggs sold under the Lucerne and Open Nature brands.',
        basis: 'company-disclosure',
        source: {
          name: 'Albertsons Companies press release (PR Newswire)',
          url: 'https://www.prnewswire.com/news-releases/albertsons-companies-sets-goal-for-cage-free-eggs-by-2025-300228385.html',
          date: '2016-03-01',
        },
      },
      {
        claim:
          "According to search-indexed content from Albertsons' own \"Animal Well-Being\" page (the live page returned an error and could not be independently reloaded this session), more than 60% of liquid and shell eggs across Albertsons stores were sourced from cage-free environments as of 2023. No Albertsons-published cage-free percentage more recent than 2023 was located.",
        basis: 'company-disclosure',
        source: {
          name: 'Albertsons Companies, Animal Well-Being page (via search index)',
          url: 'https://www.albertsonscompanies.com/our-impact/products/animal-well-being/default.aspx',
          date: '2023',
        },
      },
      {
        claim:
          "The ASPCA's 2024 Supermarket Scorecard gave Albertsons an overall grade of C (320 of 900 possible points), including a cage-free policy score of 100/100, a progress-reporting score of 48/100, a store-brand score of 63/100, and a combined \"Laying Hens\" category score of 211/300.",
        basis: 'third-party-scorecard',
        source: {
          name: 'ASPCA Supermarket Scorecard 2024',
          url: 'https://www.aspca.org/supermarketscorecard',
          date: '2024-08',
        },
      },
      // NOTE: a single-author Substack post ("Crunch Time for Cage-Free")
      // characterizes Albertsons as having "quietly removed" its cage-free
      // pledge. No other source corroborates this, and the fact-check
      // explicitly instructs this must not be used absent a primary
      // Albertsons statement. Deliberately excluded.
    ],
  },
};
