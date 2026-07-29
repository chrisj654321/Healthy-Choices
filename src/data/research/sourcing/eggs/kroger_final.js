// src/data/research/sourcing/eggs/kroger_final.js
// Agent 4 (writer) output — sourcing-transparency pipeline, egg pilot.
// Catalog SKUs in scope: Kroger brand Grade A Large White Eggs (conventional);
// Simple Truth Natural Cage Free Large Brown Eggs (cage-free).
module.exports = {
  companyId: 'kroger',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    model: 'aggregator',
    modelSource: {
      name: 'Cornucopia Institute, Organic Egg Scorecard (private-label description)',
      url: 'https://www.cornucopia.org/scorecard/eggs/simple-truth-kroger-3/',
      date: '2026-07-29',
      basis: 'third-party-scorecard',
    },

    // Certified Humane hit for the Kipster/Simple Truth co-brand could not be
    // confirmed via the certifier's own directory or an equivalent primary
    // source (only a secondary product page + trade press) — omitted rather
    // than listed as a certification.
    certifications: [],

    welfare: {
      // Kroger sells both a conventional line (this catalog SKU, no cage-free
      // claim) and a cage-free line (Simple Truth); housing reflects the
      // worst system still sold.
      housing: 'caged',
      housingSource: {
        name: 'Kroger Co. and Simple Truth product listings',
        url: 'https://www.kroger.com/',
        date: '2026-07-29',
        basis: 'company-disclosure',
      },
      // Cornucopia's "Simple Truth (Kroger)" scorecard entry (0/1700, 1-star)
      // is left OUT of this array. The fact-check could not resolve whether
      // the rated product is Cornucopia's organic line or the same
      // non-organic cage-free SKU in this catalog — repeated fetches of the
      // Cornucopia page gave contradictory answers on this point, unlike the
      // Walmart and Albertsons entries below. Asserting either
      // appliesTo value would risk stating a disputed scope claim as settled.
      scorecards: [],
    },

    enforcement: [
      {
        year: 2024,
        body: 'U.S. District Court, Northern District of Illinois',
        action:
          "Sorkin v. The Kroger Co. (1:23-cv-14916): a putative class action alleged Kroger's in-store \"Farm Fresh\" egg labeling was misleading because the eggs came from caged hens. The court dismissed the case, finding \"farm fresh\" did not necessarily imply open-space housing and distinguishing it from terms like \"cage-free\" or \"free-range.\"",
        status: 'adjudicated',
        amount: null,
        source: {
          name: 'CourtListener docket 1:23-cv-14916',
          url: 'https://www.courtlistener.com/docket/67883102/sorkin-v-the-kroger-co/',
        },
      },
      {
        year: 2023,
        body: 'U.S. District Court, Central District of Illinois',
        action:
          "Long v. The Kroger Co. (1:23-cv-01179): a putative class action alleged \"Farm Fresh,\" \"Positive Farm Fresh,\" and \"Grade A\" labeling misled consumers about whether eggs were cage-free. The plaintiff voluntarily dismissed the case in October 2023, before the court ruled on Kroger's pending motion to dismiss.",
        status: 'alleged',
        amount: null,
        source: {
          name: 'CourtListener docket 1:23-cv-01179',
          url: 'https://www.courtlistener.com/docket/67320626/long-v-the-kroger-co/',
        },
      },
      // In re: Processed Egg Products Antitrust Litigation (MDL 2:08-md-02002)
      // is deliberately NOT recorded in enforcement[] for Kroger. Multiple
      // secondary sources report Kroger was one of 12 retail companies that
      // joined as a direct-purchaser PLAINTIFF (not a defendant) — i.e.
      // Kroger was suing egg producers, not being sued or investigated. An
      // enforcement[] entry is read by the UI as an action AGAINST this
      // company; placing a plaintiff's own lawsuit there would misrepresent
      // Kroger's role, regardless of how the prose hedges it.
      {
        year: 2026,
        body: 'FDA (voluntary recall by supplier Midwest Poultry Services)',
        action:
          'According to CBS News, approximately 1.6 million cartons of shell eggs distributed under multiple brands, including Kroger and Simple Truth, were recalled in July 2026 due to possible Salmonella Enteritidis contamination. Reported illness counts vary by source and point in the timeline: initial recall-notice coverage reported no confirmed illnesses, while later outbreak-investigation reporting cited approximately 98 illnesses across 17 states. These figures were not reconciled against a primary FDA source, which returned an access error and could not be independently loaded.',
        status: 'alleged',
        amount: null,
        source: {
          name: 'CBS News',
          url: 'https://www.cbsnews.com/news/egg-recall-salmonella-midwest-poultry-kroger/',
        },
      },
    ],

    practices: [
      {
        claim:
          "Kroger stated in 2016 a goal to transition to a 100% cage-free egg supply chain by 2025. According to secondary reporting citing Kroger's 2022 ESG report, Kroger said it did not expect to meet that 2025 commitment and set a revised goal of approximately 70% of eggs sold moving to cage-free or higher-welfare standards by 2030. The same secondary reporting attributes a 2024 figure of approximately 56% of egg revenue (43% of units) from cage-free sources to Kroger's 2024 ESG report. None of these figures could be independently confirmed against Kroger's own primary ESG documents, which were not text-extractable this session.",
        basis: 'company-disclosure',
        source: {
          name: "Kroger ESG report, via secondary reporting (AOL/WATTPoultry)",
          url: 'https://www.aol.com/articles/kroger-walks-back-cage-free-170636688.html',
          date: '2022',
        },
      },
    ],
  },
};
