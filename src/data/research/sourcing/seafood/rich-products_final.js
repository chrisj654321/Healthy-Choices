// src/data/research/sourcing/seafood/rich-products_final.js
module.exports = {
  companyId: 'rich-products',
  sourcing: {
    industry: 'seafood',
    lastVerified: '2026-07-30',

    // SeaPak (a Rich Products brand) sources shrimp (farmed) and salmon
    // (wild-caught) from a network of supplier facilities across several
    // countries rather than a single farm or contract-farm arrangement.
    model: 'aggregator',
    modelSource: {
      name: 'SeaPak — Sourcing & Sustainability (company disclosure of multi-country supplier network)',
      url: 'https://seapak.com/sustainability/',
      date: '2026-07-30',
      basis: 'company-disclosure',
    },

    // EMPTY BY DECISION, NOT BY ABSENCE — read this before adding anything.
    // BAP: SeaPak's Brownsville, TX plant BAP certification is real but was
    // never confirmed against BAP's own certified-facilities directory (the
    // directory redirects to a non-queryable landing page — recorded as NOT
    // CHECKED, which is a tooling gap, NOT evidence against the cert). Its only
    // sources are Rich Products' own undated press release plus trade coverage
    // of that release — company-disclosure tier, not the directory hit this
    // array requires, and there is no `verifiedDate` this pipeline can honestly
    // write. It also covers a US PROCESSING plant, not the shrimp farms, so
    // rendering it as this product's certification would repeat the exact
    // processing-vs-farming conflation this module exists to prevent. Recorded
    // in practices[] as company-disclosure instead.
    // ASC: named by SeaPak only as an accepted alternative to MSC for its
    // WILD-CAUGHT (salmon) line, never for shrimp; no ASC hit found for
    // SeaPak/Rich Products at all. Intentionally not listed.
    certifications: [],

    welfareSeafood: {
      // Company carries both a farmed line (shrimp) and a wild-caught line
      // (salmon).
      sourceType: 'mixed',
      sourceTypeSource: {
        name: 'SeaPak — Sourcing & Sustainability (shrimp positioned as the aquaculture/farmed line under BAP; salmon positioned as the wild-caught line under MSC/ASC/RFM)',
        url: 'https://seapak.com/sustainability/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },

      // Applies to the shrimp/aquaculture line specifically (salmon is
      // wild-caught, so farming fields don't apply to it).
      farmingSystem: 'unknown',
      farmingSystemSource: {
        name: 'No SeaPak or Rich Products disclosure found specifying pond vs. closed-containment/RAS farming system for shrimp suppliers. (Category-level context exists — Thai industry trade press describes some shift toward recirculating systems — but that is country/industry-level, not a SeaPak-specific source, and is not attached to SeaPak\'s suppliers here.)',
        url: 'https://seapak.com/sustainability/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      // SeaPak discloses that ~80% of its products are processed in
      // Brownsville, TX and ~20% in Ecuador and Thailand — but this is
      // PROCESSING location, confirmed via direct page fetch, not the same
      // fact as where the shrimp are actually farmed/grown. No SeaPak or
      // Rich Products source found that names a farming/grow-out country
      // distinct from these processing locations, so the farming country
      // itself is recorded as unknown rather than inferred from processing.
      farmingCountry: 'unknown',
      farmingCountrySource: {
        name: 'SeaPak — Sourcing & Sustainability states "80% of our shrimp products are processed in Brownsville, TX... the remaining 20%... produced in two other countries — Ecuador and Thailand" — this is disclosed PROCESSING location only; no SeaPak/Rich Products source found stating the farming/grow-out country of the shrimp itself',
        url: 'https://seapak.com/sustainability/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },

      // Applies to the salmon/wild-caught line. No specific catch method
      // disclosed — only that suppliers must be MSC-certified or an
      // accepted equivalent (ASC, ASMI RFM).
      fishingMethod: 'unknown',
      fishingMethodSource: {
        name: 'SeaPak — Sourcing & Sustainability states wild-caught seafood suppliers are MSC-certified "or an equivalent" (naming ASC and ASMI\'s Responsible Fisheries Management as equivalents) but does not disclose a specific catch method for the salmon line',
        url: 'https://seapak.com/sustainability/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },

      // No Seafood Watch rating confirmed for SeaPak's own supply chain.
      // Country-level Thailand/Ecuador farmed-shrimp ratings exist and are
      // real, but SeaPak's confirmed disclosure is a PROCESSING country,
      // not a confirmed FARMING country — attaching a country rating to
      // SeaPak here would stack two unverified inferences. That country
      // context is recorded instead in practices[], explicitly scoped as
      // country-level, not a SeaPak rating.
      seafoodWatchRating: 'unknown',
      seafoodWatchScope:
        'No Seafood Watch rating confirmed as applying to SeaPak\'s specific supply chain. Country-level ratings exist for farmed shrimp from Thailand and Ecuador (two countries where SeaPak discloses processing, not confirmed farming) — see practices[] for that context, kept separate because it is not a verified SeaPak-specific rating.',
      seafoodWatchSource: {
        name: 'Not applicable — no SeaPak-specific Seafood Watch rating found; see practices[] for the country-level context that was found',
        url: 'https://seapak.com/sustainability/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
    },

    // EMPTY BY DECISION. No adjudicated, settled, pending, or alleged
    // enforcement ACTION was found against Rich Products/SeaPak on any
    // sourcing, welfare, or forced-labor matter (Stage 1 pulled 20 federal
    // dockets; all were employment/civil-rights/immigration matters outside
    // this module's scope). The 2011 allergen recall was a VOLUNTARY company
    // recall, not an agency enforcement action — none of this array's status
    // values ('adjudicated'/'settled'/'pending'/'alleged') describe it
    // truthfully, so it is recorded in practices[] as a government record
    // instead (same placement Bumble Bee's 2023 recall uses in this batch).
    enforcement: [],

    practices: [
      {
        claim:
          'Issued a nationwide voluntary recall in September 2011 of "SeaPak Breaded Butterfly Shrimp – Ready to Fry" (22 oz, Product Code 10302, production date 7/25/2011) after an undeclared milk ingredient (whey, less than 0.1%) was found in the shrimp coating — an allergen-labeling issue, not a pathogen or contamination finding, and a voluntary recall rather than an enforcement action. Not confirmed as covering the "Jumbo Butterfly Shrimp" SKU specifically (a same-family, larger-size product currently sold); recorded against the "Breaded Butterfly Shrimp" line as named in the recall.',
        basis: 'government-record',
        source: {
          name: 'Archived mirror of FDA recall-notification email (spinics.net public archive of the FDA recall mailing list) — confirms company, product, net weight, and allergen reason verbatim; the original fda.gov page for this record is no longer live',
          url: 'https://www.spinics.net/lists/fda/msg04519.html',
          date: '2026-07-30',
        },
      },
      {
        claim:
          'Discloses that 80% of its products are processed at its Brownsville, TX facility and the remaining ~20% are processed in Ecuador and Thailand. This is a disclosed PROCESSING location split, not a disclosure of where the shrimp are actually farmed/grown before processing — no source distinguishing the two was found.',
        basis: 'company-disclosure',
        source: {
          name: 'SeaPak — Sourcing & Sustainability',
          url: 'https://seapak.com/sustainability/',
          date: '2026-07-30',
        },
      },
      {
        claim:
          'States that it requires a minimum 2-star Best Aquaculture Practices (BAP) certification of all its aquaculture (shrimp) suppliers, and that 80% of its products currently come from 4-star BAP-certified suppliers (4 stars is the highest level on BAP\'s own scale), with a stated goal of reaching 100%. 80% is the company\'s current stated figure, not an achieved 100%. These are SeaPak\'s own statements about its suppliers; BAP\'s certified-facilities directory could not be queried to confirm any of them independently.',
        basis: 'company-disclosure',
        source: {
          name: 'SeaPak — Sourcing & Sustainability (direct page fetch, 2026-07-30)',
          url: 'https://seapak.com/sustainability/',
          date: '2026-07-30',
        },
      },
      {
        claim:
          'Announced via company press release that its Brownsville, TX processing plant received Best Aquaculture Practices (BAP) certification from the Global Aquaculture Alliance, covering shrimp and tilapia PROCESSING at that plant — a processing-facility certification, not a certification of the farms where the shrimp were raised. The announcement is undated in the sources reviewed and BAP\'s own certified-facilities directory could not be queried, so whether this certification is current as of 2026 is unconfirmed.',
        basis: 'company-disclosure',
        source: {
          name: 'PR Newswire — "Rich Products\' Texas Manufacturing Plant Receives \'Best Aquaculture Practices\' Certification," corroborated by ReliablePlant and SeafoodSource trade coverage of the same release (all trace to the company announcement; not a primary directory record)',
          url: 'https://www.prnewswire.com/news-releases/rich-products-texas-manufacturing-plant-receives-best-aquaculture-practices-certification-164297706.html',
          date: '2026-07-30',
        },
      },
      {
        claim:
          'Seafood Watch rates farmed shrimp from Thailand (~95% of Thai production; YELLOW, "Good Alternative," nine yellow criteria and one red criterion) and farmed whiteleg shrimp from Ecuador (semi-intensive pond production, ~4.02/10, YELLOW, "Good Alternative," one red criterion for chemical use) — both countries where SeaPak discloses it processes product. This is a country/category-level rating, not a rating of SeaPak\'s specific supply chain; SeaPak has not disclosed a confirmed farming country distinct from its processing locations, so this rating cannot be attached to SeaPak\'s shrimp directly.',
        basis: 'third-party-scorecard',
        source: {
          name: 'Seafood Watch Thailand farmed-shrimp assessment and Ecuador whiteleg-shrimp assessment, corroborated via convergent independent trade coverage (Global Seafood Alliance, The Fish Site); direct fetch of Seafood Watch\'s own report pages/PDF did not return ratings content',
          url: 'https://www.seafoodwatch.org/stories/thai-shrimp-a-journey-toward-sustainability',
          date: '2026-07-30',
        },
      },
      {
        claim:
          'COUNTRY-LEVEL CONTEXT, NOT A FINDING ABOUT THIS COMPANY: no forced-labor action, finding, court record, or investigative report naming SeaPak or Rich Products Corporation was found anywhere in this research. Separately, and as background on one of the countries where SeaPak discloses PROCESSING activity: the U.S. State Department downgraded Thailand to Tier 3 (its lowest ranking) in its 2014 Trafficking in Persons report, driven substantially by forced-labor concerns in the fishing industry. That is a 2014 ranking and is not a statement of Thailand\'s current TIP tier, nor of conditions at any facility SeaPak uses.',
        basis: 'government-record',
        source: {
          name: 'U.S. State Department 2014 Trafficking in Persons Report (Thailand Tier 3 downgrade), corroborated via the joint NOAA Fisheries/State Department "Report to Congress: Human Trafficking in the Seafood Supply Chain" (mandated by the FY2020 NDAA) and independent press coverage (NPR, World Fishing, The Fish Site); the State Department report itself was identified but not opened directly in this research pass',
          url: 'https://media.fisheries.noaa.gov/2020-12/DOSNOAAReport_HumanTrafficking.pdf',
          date: '2026-07-30',
        },
      },
    ],
  },
};
