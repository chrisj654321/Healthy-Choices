// src/data/research/sourcing/eggs/post-holdings_final.js
module.exports = {
  companyId: 'post-holdings',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    model: 'aggregator',
    modelSource: {
      name: "Post Holdings press release describing Michael Foods' 'controlled supply' as 'inclusive of owned and third-party contracted farms'",
      url: 'https://www.postholdings.com/post-holdings-reports-avian-influenza-at-third-party-contracted-facility-and-affirms-fiscal-year-2025-adjusted-ebitda-outlook/',
      date: '2024-12-09',
      basis: 'company-disclosure',
    },

    certifications: [],

    welfare: {
      // Retailer listings show both a distinct "Cage-Free" labeled variant
      // and separate non-labeled default SKUs under the Egg Beaters and
      // Davidson's Safest Choice brands, but the housing system of the
      // non-labeled default SKUs — which is what 'housing' is required to
      // reflect (the worst system still sold) — was never independently
      // confirmed. Left 'unknown' rather than asserted as 'mixed', which
      // would read as a determination the evidence doesn't support.
      housing: 'unknown',
      scorecards: [],
    },

    enforcement: [
      {
        year: 2017,
        body: 'U.S. District Court, Eastern District of Pennsylvania (multidistrict litigation)',
        action:
          "Michael Foods, Inc. (a Post Holdings subsidiary since June 2014) was a defendant, alongside roughly 10 other egg producers and the United Egg Producers trade group, in In re Processed Egg Products Antitrust Litigation (MDL No. 2:08-md-02002), which alleged a conspiracy to restrict egg supply and control prices; direct-purchaser plaintiffs included Kraft, Kellogg, General Mills, and Nestle. Michael Foods reached a settlement with the direct-purchaser plaintiff class; secondary legal-press sources report final court approval on November 20, 2017, and consistently cite a $75 million settlement amount specific to Michael Foods, but this figure was not independently confirmed against the court's own order, so it is not asserted as a verified amount. The alleged conduct predates Post's June 2014 acquisition of Michael Foods. The court's own docket confirms the overall multidistrict litigation was filed December 2, 2008 and terminated November 8, 2022.",
        status: 'settled',
        amount: null,
        source: {
          name: 'CourtListener docket (primary court record, MDL); secondary legal press (Law360, Lexis Legal News, Feedstuffs) for the $75M figure and 2017 approval date',
          url: 'https://www.courtlistener.com/docket/4368662/in-re-processed-egg-products-antitrust-litigation/',
        },
      },
      {
        year: 2016,
        body: 'Federal Trade Commission (complaint filed by the Humane Society of the United States)',
        action:
          "The Humane Society of the United States filed a complaint with the FTC in October 2016 alleging that Davidson's Safest Choice egg carton packaging (depicting pastures, a red barn, and free-roaming hens) misrepresented production methods, and that the pictured hens were in reality confined in battery cages; HSUS also alleged the company's pasteurization-related Salmonella claim was misleading. No FTC investigation finding, consent order, or dismissal has been publicly reported.",
        status: 'alleged',
        amount: null,
        source: {
          name: 'Food Safety News',
          url: 'https://www.foodsafetynews.com/2016/10/humane-society-says-egg-carton-artwork-is-false-advertising/',
        },
      },
    ],

    practices: [
      {
        claim:
          'Some Egg Beaters and Bob Evans-branded liquid egg products are co-packed by a third-party processor (Cargill Kitchen Solutions), per an April 2025 FSIS recall notice; the primary FSIS.gov notice could not be independently loaded, but the co-packing relationship is corroborated by multiple secondary press outlets.',
        basis: 'company-disclosure',
        source: {
          name: 'FSIS recall notice (secondary corroboration: Today.com, NPR, WattAgNet)',
          url: 'https://www.today.com/food/recall/liquid-egg-recall-rcna198830',
          date: '2025-04-04',
        },
      },
      {
        claim:
          "On December 9, 2024, the company disclosed that a third-party contracted egg-laying flock in Iowa (approximately 4.5 million hens, about 12% of Post's controlled egg supply of owned and third-party contracted farms) tested positive for avian influenza; Post affirmed its fiscal-year 2025 Adjusted EBITDA outlook despite the event.",
        basis: 'company-disclosure',
        source: {
          name: 'Post Holdings press release',
          url: 'https://www.postholdings.com/post-holdings-reports-avian-influenza-at-third-party-contracted-facility-and-affirms-fiscal-year-2025-adjusted-ebitda-outlook/',
          date: '2024-12-09',
        },
      },
      {
        claim:
          'Company states it maintains an internal Animal Welfare Committee with named external advisors, conducts routine internal and third-party audits, and commits to reporting progress at least annually; no third-party welfare certification (Certified Humane, Global Animal Partnership, Animal Welfare Approved) is named for the egg business specifically.',
        basis: 'company-disclosure',
        source: {
          name: 'Post Holdings sustainability page',
          url: 'https://www.postholdings.com/home/sustainability/sourcing/animal-welfare/',
          date: '2026-07-28',
        },
      },
    ],
  },
};
