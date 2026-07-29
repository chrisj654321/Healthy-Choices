// src/data/research/sourcing/eggs/crystal-farms_final.js
module.exports = {
  companyId: 'crystal-farms',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    // Ownership chain confirmed: Crystal Farms -> Michael Foods, Inc. ->
    // Post Holdings, Inc. Whether Crystal Farms itself owns flocks or is a
    // packer/distributor of eggs from other Michael Foods facilities was not
    // resolved by either research pass — left unknown rather than guessed.
    model: 'unknown',

    // Certified Humane / GAP / AWA-AGW / USDA Organic Integrity DB could not
    // be queried for Crystal Farms or Michael Foods — no certification
    // confirmed.
    certifications: [],

    welfare: {
      // No source confirms the housing system for the Crystal Farms Grade AA
      // Large White Eggs SKU. "Grade AA" naming alone suggests conventional
      // but is inference only, not a confirmed fact.
      housing: 'unknown',

      // Cornucopia has no scored entry for "Crystal Farms." The only
      // Michael-Foods-family entry, "Abbotsford Egg Products (Michael
      // Foods)" (20/1700, 1-star), is a distinct, separately-named brand and
      // must NOT be attributed to Crystal Farms — omitted here rather than
      // misattributed.
      scorecards: [],
    },

    enforcement: [
      {
        year: 2017,
        body: 'U.S. District Court, E.D. Pennsylvania (MDL 2:08-md-02002)',
        action:
          "Michael Foods, Inc. (Crystal Farms' corporate parent, via Post Holdings — Crystal Farms itself was not a named party) was a defendant in the In re: Processed Egg Products Antitrust Litigation (MDL 2:08-md-02002), which alleged coordinated egg pricing among processors. Secondary legal press consistently cites a $75 million settlement amount specific to Michael Foods, but this figure was not independently confirmed against the court's own order, so it is not asserted as a verified amount. A separately reported cumulative-total figure across all settling defendants was not used here: the two fact-checking passes on this litigation could not reconcile it against a per-defendant breakdown. The alleged conduct predates Post's June 2014 acquisition of Michael Foods.",
        status: 'settled',
        amount: null,
        source: {
          name: 'Top Class Actions',
          url: 'https://topclassactions.com/lawsuit-settlements/lawsuit-news/michael-foods-pay-75m-settle-egg-price-fixing-class-action/',
        },
      },
    ],

    practices: [],
  },
};
