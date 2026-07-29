// src/data/research/sourcing/eggs/bob-evans_final.js
// Agent 4 (writer) output — sourcing-transparency pipeline, egg pilot.
// Catalog product in scope: Bob Evans 100% Liquid Egg Whites (processed
// product; Bob Evans Farms packaged-foods business is owned by Post
// Holdings, Inc., distinct from the separately-sold Bob Evans restaurant
// chain).
module.exports = {
  companyId: 'bob-evans',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    // Sourcing model at the laying-hen/farm level was not disclosed in any
    // source reviewed. What IS known — that the product line runs through a
    // mix of Post-owned processing (Michael Foods) and a third-party
    // co-packer (Cargill Kitchen Solutions) — describes the processing
    // chain, not the underlying hen-housing/farm-sourcing model, and rests
    // on sources that returned access errors (SEC 8-K, FSIS notice) when
    // attempted directly. Left unknown rather than inferred.
    model: 'unknown',

    certifications: [],

    welfare: {
      // Hen housing system for the flocks supplying Bob Evans-branded
      // liquid egg-white products was not disclosed in any source located —
      // not by Bob Evans/Post Holdings, not by a certifier, not by
      // packaging. Recorded as unknown, not inferred.
      housing: 'unknown',
      scorecards: [],
    },

    enforcement: [
      {
        year: 2025,
        body: 'USDA FSIS (recall by co-packer Cargill Kitchen Solutions)',
        action:
          "According to Today.com and other secondary reporting, in April 2025 Cargill Kitchen Solutions (a co-packer for Bob Evans-branded liquid egg products, at its Lake Odessa, Michigan facility) recalled approximately 212,268 pounds combined of \"Bob Evans Better'n Eggs Made with Real Egg Whites\" and Egg Beaters-branded liquid egg products, due to possible contamination with a cleaning solution containing sodium hypochlorite. FSIS classified the recall Class III (negligible health risk), and no confirmed illnesses were reported. The primary FSIS recall notice returned an access error and could not be independently loaded.",
        status: 'alleged',
        amount: null,
        source: {
          name: 'Today.com',
          url: 'https://www.today.com/food/recall/liquid-egg-recall-rcna198830',
        },
      },
      // The Processed Egg Products Antitrust MDL named Michael Foods, Inc.
      // as a defendant, not Bob Evans Farms — and Bob Evans was not yet part
      // of Post Holdings' portfolio during the alleged conduct or the
      // November 2017 settlement (Post's acquisition of Bob Evans closed
      // January 2018). No litigation naming Bob Evans Farms directly as a
      // party was found. Not included as a Bob Evans enforcement entry.
    ],

    practices: [
      {
        claim:
          "Bob Evans Farms participates in Protein PACT, described by parent company Post Holdings as a collective-action industry initiative on animal-protein sustainability. Post Holdings' animal-welfare page does not specify a particular housing standard or welfare commitment tied to this membership.",
        basis: 'company-disclosure',
        source: {
          name: 'Post Holdings, Inc., sustainability/animal-welfare page',
          url: 'https://www.postholdings.com/home/sustainability/sourcing/animal-welfare/',
          date: '2026-07-29',
        },
      },
    ],
  },
};
