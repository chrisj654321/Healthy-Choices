// src/data/research/sourcing/meat-poultry/hormel_final.js
module.exports = {
  companyId: 'hormel',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-07-30',

    model: 'contract-farms',
    modelSource: {
      name: "Hormel's own Global Impact site (hogs supply-chain page) describes systems it harvests hogs from in terms of purchased/contracted supply rather than a fully owned herd, consistent with a contract-farm structure. Separately, per company materials referenced in this research (not independently re-fetched at a current date), Hormel has stated it purchases roughly 96% of hogs under supply contracts from 250+ independent producers, mostly Midwest family farms, while also owning/operating some hog farms itself in Colorado. That specific 96%/250+ figure traces to an FY2017-era reference and is STALE — nearly a decade old, not re-confirmed for the current year, and should not be presented as Hormel's present-day split. The contract-farm classification is used here as the best-supported reading of the overall structure despite the dated percentage.",
      url: 'https://www.hormelfoods.com/global-impact/planet/supply-chain/hogs/',
      date: '2024-11-19',
      basis: 'company-disclosure',
    },

    // Scoped narrowly to Applegate's beef hot dog line, not Hormel-branded
    // meat or the Hormel corporation generally — matches the practices[]
    // scope note below. Step level left unstated: the underlying
    // "GAP-certified" fact is corroborated by two independent trade-press
    // outlets (MEAT+POULTRY 2019, Supermarket Perimeter) beyond Applegate's
    // own site, but the specific "Step 4" designation is not independently
    // confirmed as applied to this product. Added at Stage 5 review
    // (2026-07-30) — a corroborated positive was sitting only in
    // practices[], which understated it (certifications: [] renders as
    // "no third-party welfare certification found," which was inaccurate).
    certifications: [
      {
        name: 'Global Animal Partnership (GAP) Animal Welfare Certified',
        verifier: 'Global Animal Partnership',
        scope: "Applegate's beef hot dog line only — not Hormel-branded meat, not Applegate's other product lines",
        standard: 'unknown', // step level not independently confirmed, see note above
        verifiedDate: '2026-07-30',
        source: {
          name: "Applegate, \"Animal Welfare\"; MEAT+POULTRY, \"GAP certifies Applegate hot dogs\" (2019-07-02); Supermarket Perimeter, \"Applegate Farms takes pride in Humanely Raised standard\"",
          url: 'https://applegate.com/mission/animal-welfare',
        },
      },
    ],

    welfareMeatPoultry: {
      gapStep: 'unknown',
      gapStepSource: {
        name: "Global Animal Partnership's own Manufacturers directory page, fetched directly, does not list Hormel or Applegate among its shown manufacturer partners (page 1 of the list only; the multi-page Farms & Ranches directory was not checked, so this does not rule out a GAP relationship recorded elsewhere on the site). Independently, GAP does host a dedicated page at globalanimalpartnership.org/portfolio/applegate-farms/, confirming GAP carries an Applegate portfolio entry — but that page's content is a bare logo and a 2017 date with no step-level text, so it neither confirms nor contradicts a specific step. This applies to Applegate's beef hot dog line specifically (see practices[]), not to Hormel-branded meat generally — no GAP relationship is confirmed for the Hormel corporate brand itself. NOT CHECKED exhaustively; do not write as absent.",
        url: 'https://globalanimalpartnership.org/partners/manufacturers/',
        date: '2026-07-30',
        basis: 'third-party-audit',
      },
      grassFinished: 'not-claimed',
      grassFinishedSource: {
        name: "Hormel does not sell raw/fresh beef cuts as a mainline consumer brand (its portfolio is primarily pork, turkey, and processed/prepared foods: SPAM, Skippy, Justin's, Wholly, Columbus, Jennie-O). The one beef-relevant line found, Applegate's beef hot dogs, is sourced as 100% 'Certified Regenerative Beef' as of a 2025 Hormel press release — certified via Regenerative Organic Certified (ROC), Land to Market, and 'Certified Regenerative' (endorsed by Certified Humane). This is a regenerative-agriculture/soil-practice certification, not a grass-fed or grass-finished welfare/diet certification, and must not be conflated with one. No American Grassfed Association (or equivalent) certification was found for any Hormel-family beef product in this research pass.",
        url: 'https://www.hormelfoods.com/newsroom/press-releases/applegate-farms-llc-beats-2025-regenerative-goal-transitions-all-beef-hot-dogs-to-100-certified-regenerative-beef/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      gestationCrateStatus: 'crates-used',
      gestationCrateSource: {
        name: "Independently confirmed directly on Hormel's own Global Impact site, in Hormel's own words: \"19% of the total hogs we were harvesting on an annualized basis (regardless of destination) were produced in California Proposition 12 compliant systems\" and \"13% were produced in loose sow housed systems,\" with 100% of hogs destined for the Massachusetts and California markets specifically housed in group pens from birth (the legally-required subset for those two states' compliance regimes, not a company-wide figure). This data lives directly on Hormel's Global Impact site rather than in one titled downloadable report document; the page references a '2023/2024 Group Sow Housing Report' and was last updated 11/19/24, with the figures described as of June 2024. Because only 19%+13% of hogs are in Prop-12-compliant or loose-housed systems, the majority of Hormel's supply is not disclosed as crate-free — this is recorded as 'crates-used' rather than any crate-free status. Separately, Hormel states it converted its own company-owned sow farms to group housing by 2018, and that it purchases roughly 96% of hogs under contract from 250+ independent producers (that percentage is STALE, FY2017-era, not re-confirmed for the current year — see practices[]).",
        url: 'https://www.hormelfoods.com/global-impact/planet/supply-chain/hogs/',
        date: '2024-11-19',
        basis: 'company-disclosure',
      },
      chillMethod: 'unknown',
      chillMethodSource: {
        name: "No information was found on whether Jennie-O (Hormel's turkey brand) uses air-chilling or water-chilling; searches surfaced only unrelated content (employee training/air-and-water-quality compliance topics, and the 2026 sale of Hormel's whole-bird turkey processing business to Life-Science Innovations, with Hormel retaining the Jennie-O brand for ground/processed turkey). Genuine search attempted, no relevant result surfaced — do not write as either air- or water-chilled.",
        url: 'https://www.provisioneronline.com/articles/120524-hormel-foods-completes-sale-of-whole-bird-turkey-business-to-life-science-innovations',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      scorecards: [],
    },

    enforcement: [
      {
        year: 2018,
        body: 'U.S. District Court, District of Minnesota — In re Pork Antitrust Litigation (MDL No. 2998)',
        action:
          "Hormel Foods, LLC was named as a defendant in In re Pork Antitrust Litigation (docket 0:18-cv-01776, filed 2018-06-28; also consolidated as MDL No. 2998, docket 0:21-md-02998, filed 2021-06-22; both dockets show no termination date recorded), alongside Agri Stats Inc., Seaboard Foods LLC, Seaboard Corporation, and Smithfield Foods Inc., over an alleged conspiracy since January 2009 to restrict hog supply and fix/raise/stabilize pork prices, partly via shared data through Agri Stats. According to multiple independent trade-press accounts (meatingplace.com, National Hog Farmer), Judge John Tunheim later granted Hormel's motion for summary judgment on most claims, with the court's stated basis being that Hormel did not formally subscribe to the Agri Stats benchmarking-report service central to the alleged conspiracy (Hormel is reported to have only accepted free Agri Stats samples in 2017). The dismissal was partial, not total: it was without prejudice as to most claims, but the consumer indirect-purchaser plaintiffs' complaint against Hormel continued. Hormel separately settled with the Direct Purchaser Plaintiffs and other purchaser tiers for a reported combined total of roughly $11 million ($2.4M to institutional customers, $4.8M to wholesalers/direct purchasers, $4.4M to consumers), reached in Q2 fiscal 2024, without admitting fault.",
        status: 'settled',
        amount: null,
        source: {
          name: 'CourtListener docket (Stage 1 primary court record) for the defendant listing and docket status; Star Tribune and Bloomberg Law for the settlement figures (independently re-corroborated by nny360.com, Feedstuffs, and an official PR Newswire class-action settlement notice); meatingplace.com and National Hog Farmer for the summary-judgment/Agri Stats-subscription reasoning. The summary-judgment specifics and settlement figures are UNVERIFIED — no primary court order or settlement declaration was independently read in this research pass — but corroborated across multiple independent, non-advocacy outlets with no contradicting account found.',
          url: 'https://www.courtlistener.com/docket/7338509/in-re-pork-antitrust-litigation/',
        },
      },
      {
        year: 2025,
        body: 'USDA Food Safety and Inspection Service (FSIS)',
        action:
          "According to Today.com, approximately 4,874,815 lbs of foodservice ready-to-eat frozen chicken breast/thigh products were recalled for possible metal-fragment contamination; product was distributed 2025-02-10 through 2025-09-19 to HRI Commercial Food Service locations nationwide, and the recall was issued after multiple customer complaints of metal in product. The FSIS.gov listing was referenced via search (title matched) but could not be independently fetched (HTTP 403).",
        status: 'settled',
        amount: null,
        source: {
          name: 'Today.com (secondary news); FSIS.gov listing referenced via search, page not independently fetched — HTTP 403',
          url: 'https://www.today.com/food/recall/hormel-frozen-chicken-recall-rcna240051',
        },
      },
      {
        year: 2025,
        body: 'USDA Food Safety and Inspection Service (FSIS)',
        action:
          "According to an FSIS.gov listing referenced via search (page not independently fetched — HTTP 403), approximately 256,185 lbs of canned beef stew were recalled for possible wood contamination, dated approximately May 2025.",
        status: 'settled',
        amount: null,
        source: {
          name: 'FSIS.gov listing referenced via search, page not independently fetched — HTTP 403',
          url: 'https://www.fsis.usda.gov/recalls-alerts',
        },
      },
    ],

    practices: [
      {
        claim:
          "Applegate, a Hormel subsidiary, states on its own site that cattle raised for its products are third-party certified via GAP Step 4 ('Pasture Centered' — pasture/outdoor access year-round), Certified Humane, or Australian Certified Organic. This is now corroborated by two independent trade-press outlets beyond Applegate's own site — MEAT+POULTRY (2019) and Supermarket Perimeter — describing the GAP Animal Welfare Certified logo appearing on Applegate's 'The Great Organic Uncured Beef Hot Dog' at Whole Foods. The underlying 'GAP-certified' claim for this specific product is corroborated; the exact 'Step 4' designation is not independently confirmed by a source describing it as applied to Applegate specifically. This scope is limited to Applegate's beef hot dog line — it is not a Hormel-corporate-wide claim, and it does not apply to Hormel-branded meat. Separately, Applegate's site also describes a 'Humanely Raised' standard (a Where Food Comes From program), which is a different certification body from Certified Humane (Humane Farm Animal Care/HFAC) despite the similar name — which of these program(s) Applegate actually holds was not independently confirmed against either certifier's own directory in this research pass, so the two are not merged into a single certification here.",
        basis: 'company-disclosure',
        source: {
          name: "Applegate, \"Animal Welfare\"; MEAT+POULTRY, \"GAP certifies Applegate hot dogs\" (2019-07-02); Supermarket Perimeter, \"Applegate Farms takes pride in Humanely Raised standard\"",
          url: 'https://applegate.com/mission/animal-welfare',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Applegate, a Hormel subsidiary, states it has required its pork suppliers to house sows in groups (not gestation crates) since 1987. No independent third-party audit confirmation was found for this specific historical claim beyond Applegate's general GAP/Certified Humane certifications noted above. This is scoped to Applegate specifically, not to Hormel-branded pork.",
        basis: 'company-disclosure',
        source: {
          name: 'Hormel/Applegate press materials (search-engine synthesis, not independently re-fetched from a single primary Applegate page in this research pass)',
          url: 'https://applegate.com/mission/animal-welfare',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Hormel states its company-owned sow farms were converted to group housing by 2018, which the company describes as ahead of its stated commitment. This is distinct from Hormel's contract-farm supply (the ~96%-under-contract/250+ producers figure — see modelSource), which is a separately STALE, FY2017-era figure not re-confirmed for the current year.",
        basis: 'company-disclosure',
        source: {
          name: 'Search-engine synthesis citing a Hormel FY1999/2017-era 10-K reference and Hormel CSR materials — not independently re-fetched at a current date',
          url: 'https://www.hormelfoods.com/global-impact/global-impact-reporting/',
          date: '2026-07-30',
        },
      },
    ],
  },
};
