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

    // BAP certification of the Brownsville, TX plant is corroborated by
    // three independent contemporary trade sources (press release plus two
    // trade-press outlets); BAP's own certified-facilities directory could
    // not be queried directly (404/redirect to a non-queryable landing
    // page — a tooling gap, not evidence against the certification). ASC is
    // named by SeaPak only as an accepted alternative to MSC for its
    // WILD-CAUGHT (salmon) line, not for shrimp — no ASC certification hit
    // was found for SeaPak/Rich Products at all, so it is intentionally NOT
    // listed here.
    certifications: [
      {
        name: 'Best Aquaculture Practices (BAP)',
        verifier: 'Global Aquaculture Alliance / BAP',
        scope: 'Brownsville, TX processing plant (shrimp and tilapia processing); company states minimum 2-star BAP required for all its aquaculture (shrimp) suppliers',
        standard:
          'Minimum 2-star BAP required for all aquaculture suppliers; as of this research pass, 80% of SeaPak\'s aquaculture products are sourced from 4-star (top-tier) BAP-certified suppliers, with a stated company goal of reaching 100% — 80% is the current figure, not yet achieved at 100%',
        verifiedDate: '2026-07-30',
        source: {
          name: 'PR Newswire — "Rich Products\' Texas Manufacturing Plant Receives \'Best Aquaculture Practices\' Certification," corroborated by ReliablePlant and SeafoodSource trade coverage; current 80%/4-star figure confirmed via direct fetch of SeaPak\'s own sustainability page (BAP\'s own certified-facilities directory could not be queried directly — redirected to a non-queryable landing page)',
          url: 'https://www.prnewswire.com/news-releases/rich-products-texas-manufacturing-plant-receives-best-aquaculture-practices-certification-164297706.html',
        },
      },
    ],

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

    enforcement: [
      {
        year: 2011,
        body: 'U.S. Food and Drug Administration',
        action:
          'Rich Products Corporation issued a nationwide voluntary recall of "SeaPak Breaded Butterfly Shrimp – Ready to Fry" (22 oz, Product Code 10302, production date 7/25/2011) after an undeclared milk ingredient (whey, less than 0.1%) was found in the shrimp coating — an allergen-labeling issue, not a pathogen or contamination finding. Confirmed via an archived mirror of the FDA\'s own recall-notification text. Not confirmed as covering the "Jumbo Butterfly Shrimp" SKU specifically (a same-family, larger-size product currently sold); recorded against the "Breaded Butterfly Shrimp" line as named in the recall.',
        status: 'settled',
        amount: null,
        source: {
          name: 'Archived mirror of FDA recall-notification email (spinics.net public archive of the FDA recall mailing list) — confirms company, product, net weight, and allergen reason verbatim; the original fda.gov page for this record is no longer live',
          url: 'https://www.spinics.net/lists/fda/msg04519.html',
        },
      },
    ],

    practices: [
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
          'SeaPak/Rich Products processes some product in Thailand, a country the U.S. State Department downgraded to Tier 3 (its lowest ranking) in its 2014 Trafficking in Persons report, driven substantially by forced-labor concerns in the fishing industry. No forced-labor action, finding, court record, or investigative report naming SeaPak or Rich Products Corporation specifically was found in this research — this is country-level context about a location where the company discloses processing activity, not a brand-specific finding.',
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
