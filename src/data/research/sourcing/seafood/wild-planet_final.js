// src/data/research/sourcing/seafood/wild-planet_final.js
module.exports = {
  companyId: 'wild-planet',
  sourcing: {
    industry: 'seafood',
    lastVerified: '2026-07-30',

    // Wild Planet buys tuna from many independent pole & line, troll, and
    // handline fleets across several countries/oceans (Japan, US, Brazil,
    // Pacific/Atlantic/Indian Ocean fisheries) rather than owning boats or
    // holding a single-farm/contract-farm arrangement.
    model: 'aggregator',
    modelSource: {
      name: 'Wild Planet Foods — Tuna Procurement Policy (company disclosure of multi-fishery sourcing network)',
      url: 'https://wildplanetfoods.com/pages/tuna-procurement-policy',
      date: '2026-07-30',
      basis: 'company-disclosure',
    },

    // No third-party certification confirmed. Wild Planet does not hold MSC
    // certification (stated as a deliberate choice, not a failed
    // application). A "B Corp" premise in the original brief was checked
    // against two independent bcorporation.net search passes — no matching
    // listing found either time — and is corrected here to no certification
    // found; it is intentionally NOT listed below.
    certifications: [],

    welfareSeafood: {
      sourceType: 'wild-caught',
      sourceTypeSource: {
        name: 'Wild Planet Foods — Tuna Procurement Policy ("Wild Planet sources 100% of its tuna from pole & line, troll or handline fisheries")',
        url: 'https://wildplanetfoods.com/pages/tuna-procurement-policy',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },

      farmingSystem: 'not-applicable',
      farmingSystemSource: {
        name: 'Not applicable — company states 100% of its tuna supply is wild-caught (pole & line, troll, or handline); no farmed product line found',
        url: 'https://wildplanetfoods.com/pages/tuna-procurement-policy',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      farmingCountry: 'not-applicable',
      farmingCountrySource: {
        name: 'Not applicable — same basis as farmingSystem; no farmed tuna line to attach a farming country to',
        url: 'https://wildplanetfoods.com/pages/tuna-procurement-policy',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },

      // Company discloses a combination of three methods (pole & line,
      // troll, handline) without a per-method percentage breakdown, so no
      // single enum value below captures it precisely — see practices[] for
      // the exact combination and the explicit exclusion of longline/
      // purse-seine.
      fishingMethod: 'other',
      fishingMethodSource: {
        name: 'Wild Planet Foods — Tuna Procurement Policy ("sources 100% of its tuna from pole & line, troll or handline fisheries"; "does not buy any long-line or purse seine caught tuna"; bycatch "<0.5%")',
        url: 'https://wildplanetfoods.com/pages/tuna-procurement-policy',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },

      // Method-level Seafood Watch rating only. Wild Planet's own claim that
      // ">95% of our tuna" achieves the GREEN rating is Wild Planet's own
      // marketing figure, not independently confirmed against Seafood
      // Watch's own page (repeated direct-fetch attempts returned only
      // navigation shells, no ratings content) — recorded separately below
      // in practices[], attributed, never as this app's own finding.
      seafoodWatchRating: 'Best Choice / Green (method-level rating; NOT a confirmed Wild-Planet-brand-specific percentage)',
      seafoodWatchScope: 'Pole-and-line and troll-caught Pacific/Atlantic albacore and Pacific skipjack tuna — this is the method-level Seafood Watch recommendation category, independently corroborated across multiple convergent sources describing the rating system, not a page-level pull of Wild Planet’s specific listing. Wild Planet’s own claim that "over 95%" of its own tuna carries this rating is company-disclosure only (see practices[]).',
      seafoodWatchSource: {
        name: 'Monterey Bay Aquarium Seafood Watch, sustainable tuna consumer guide (direct fetch of ratings content failed — page returned navigation boilerplate only; method-level GREEN rating for pole-and-line/troll tuna corroborated via multiple independent convergent sources)',
        url: 'https://www.seafoodwatch.org/recommendations/download-consumer-guides/sustainable-tuna-guide',
        date: '2026-07-30',
        basis: 'third-party-scorecard',
      },
    },

    enforcement: [
      {
        year: 2017,
        body: 'U.S. District Court, Northern District of California',
        action:
          'Two consolidated federal class actions — Soto v. Wild Planet Foods, Inc. (5:15-cv-05082, filed 2015-11-05, terminated 2017-11-27) and Shihad v. Wild Planet Foods, Inc. (5:16-cv-01478, filed 2016-03-25, terminated 2017-05-12) — alleged Wild Planet (and its Sustainable Seas brand) underfilled tuna cans labeled 5 oz, with testing cited in the complaints showing cans averaged roughly 30% below the federal minimum fill standard for canned tuna (3.23 oz drained weight), not 30% below the 5-oz label figure itself. Claims included breach of warranty, fraud, negligent misrepresentation, and California UCL/FAL violations. This is a fill-weight/label-accuracy matter, not a fishing-method or welfare finding.',
        status: 'settled',
        amount: 1700000,
        source: {
          name: 'CourtListener docket (primary court record: filing/termination dates), corroborated by convergent independent legal-press reporting (Law360, FoodProcessing.com, TopClassActions.com) on the $1.7M settlement figure',
          url: 'https://www.courtlistener.com/docket/4620259/soto-v-wild-planet-foods-inc/',
        },
      },
    ],

    practices: [
      {
        claim:
          'States it sources 100% of its tuna from pole & line, troll, or handline fisheries, and does not buy any longline or purse-seine caught tuna; states a bycatch rate under 0.5% for its pole & line and troll fishing.',
        basis: 'company-disclosure',
        source: {
          name: "Wild Planet Foods — Tuna Procurement Policy",
          url: 'https://wildplanetfoods.com/pages/tuna-procurement-policy',
          date: '2026-07-30',
        },
      },
      {
        claim:
          'Wild Planet states that "over 95%" of its own tuna achieves the Seafood Watch GREEN ("Best Choice") rating, with the remainder YELLOW. This is Wild Planet’s own figure — Seafood Watch’s own ratings pages could not be independently loaded to confirm this specific percentage.',
        basis: 'company-disclosure',
        source: {
          name: "Wild Planet Foods — Tuna Procurement Policy",
          url: 'https://wildplanetfoods.com/pages/tuna-procurement-policy',
          date: '2026-07-30',
        },
      },
      {
        claim:
          'Pole-and-line and troll-caught tuna, as a fishing method (not a Wild Planet-specific claim), carries Seafood Watch\'s "Best Choice" (green) rating — the rating attaches to the method, and Wild Planet\'s use of that method at the stated volumes is company-disclosed, not independently audited.',
        basis: 'third-party-scorecard',
        source: {
          name: 'Monterey Bay Aquarium Seafood Watch, sustainable tuna consumer guide (rating system corroborated via multiple convergent sources; direct page/PDF fetch did not return ratings content)',
          url: 'https://www.seafoodwatch.org/recommendations/download-consumer-guides/sustainable-tuna-guide',
          date: '2026-07-30',
        },
      },
      {
        claim:
          'States it does not pursue MSC or other eco-logo certifications by choice, saying (verbatim, per company page): "Wild Planet chooses to not use eco-logo certifications, which do not improve our sustainable sourcing standard."',
        basis: 'company-disclosure',
        source: {
          name: "Wild Planet Foods — Tuna Procurement Policy",
          url: 'https://wildplanetfoods.com/pages/tuna-procurement-policy',
          date: '2026-07-30',
        },
      },
    ],
  },
};
