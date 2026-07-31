// src/data/research/sourcing/seafood/starkist_final.js
module.exports = {
  companyId: 'starkist',
  sourcing: {
    industry: 'seafood',
    lastVerified: '2026-07-30',

    model: 'aggregator',
    modelSource: {
      name: "StarKist's Sustainability Knowledge Center / Natural Resources & Policies pages describe sourcing from vessels enrolled in the International Seafood Sustainability Foundation's (ISSF) ProActive Vessel Register (PVR) and MSC/Fishery-Improvement-Project (FIP) participating fisheries, rather than a single farm or an exclusive contract fleet",
      url: 'https://starkist.com/sustainability-knowledge-center/',
      date: '2026-07-30',
      basis: 'company-disclosure',
    },

    certifications: [
      {
        name: 'MSC (Marine Stewardship Council) Fisheries Standard — fishery-level catch certification',
        verifier: 'Control Union (UK) Limited',
        scope:
          "Dongwon Pacific Ocean Tuna purse seine and longline fishery — held by StarKist's parent company, Dongwon Industries. This is a FISHERY-level catch certification confirmed on MSC's own Fisheries database. It does NOT by itself confirm that StarKist's U.S. retail cans carry MSC chain-of-custody certification (a fishery catch certificate and a product chain-of-custody certificate are distinct MSC instruments) — no chain-of-custody check on StarKist's own can labels was completed in this research pass.",
        standard:
          'MSC Fisheries Standard — purse seine and pelagic longline gear, covering yellowfin, skipjack, bigeye, and albacore tuna. Certified 2019-10-18, expires 2030-04-17.',
        verifiedDate: '2026-07-30',
        source: {
          name: 'MSC Fisheries database — Dongwon Pacific Ocean Tuna purse seine and longline fishery',
          url: 'https://fisheries.msc.org/en/fisheries/dongwon-pacific-ocean-tuna-purse-seine-and-longline-fishery/',
        },
      },
    ],

    welfareSeafood: {
      sourceType: 'wild-caught',
      sourceTypeSource: {
        name: 'MSC Fisheries database — Dongwon Pacific Ocean Tuna purse seine and longline fishery (confirms wild-capture gear types); canned tuna has no meaningful U.S. commercial aquaculture, so wild-caught is the category for this product line',
        url: 'https://fisheries.msc.org/en/fisheries/dongwon-pacific-ocean-tuna-purse-seine-and-longline-fishery/',
        date: '2026-07-30',
        basis: 'certification-directory record + category-level industry fact',
      },

      farmingSystem: 'not-applicable',
      farmingSystemSource: {
        name: 'No StarKist aquaculture/farmed sourcing identified — same MSC fishery record above confirms purse-seine/longline (wild-capture) gear only',
        url: 'https://fisheries.msc.org/en/fisheries/dongwon-pacific-ocean-tuna-purse-seine-and-longline-fishery/',
        date: '2026-07-30',
        basis: 'certification-directory record',
      },

      fishingMethod: 'unknown',
      fishingMethodSource: {
        name: "StarKist discloses vessel-registry participation (100% purse-seine supply from ISSF PVR-listed vessels; 33.9% of longline purchases PVR-listed, exact reporting year not disclosed) but not a gear-type breakdown (FAD vs. non-FAD, purse seine vs. longline share) for its own flagship retail SKUs (chunk light, solid white albacore) — PVR-listed vessels can still use FADs, and no public disclosure resolving this was found",
        url: 'https://starkist.com/about-starkist/corporate-responsibility/natural-resources-policies/',
        date: '2026-07-30',
        basis: 'company-disclosure (gap — gear-type breakdown not disclosed)',
      },

      seafoodWatchRating: 'Avoid (red)',
      seafoodWatchScope:
        'Skipjack tuna caught by purse seine on floating objects/FADs — Northwest, Southwest, or Western Central Atlantic. Seafood Watch rates by species + gear + region, not by brand; this is the underlying fishery-method rating for the gear/species combination most associated with canned light/skipjack tuna generally. It is not a confirmed StarKist-specific gear breakdown (see fishingMethod above, unknown).',
      seafoodWatchSource: {
        name: 'Seafood Watch (Monterey Bay Aquarium) — Skipjack Tuna recommendation page; cited concerns include bycatch of overfished bigeye tuna, blue marlin, and at-risk sharks',
        url: 'https://www.seafoodwatch.org/recommendation/tuna/skipjack-tuna-30707',
        date: '2026-07-30',
        basis: 'third-party-scorecard',
      },
    },

    enforcement: [
      {
        year: 2019,
        body: 'U.S. District Court, N.D. Cal. (DOJ Antitrust Division prosecution), Judge Edward M. Chen',
        action:
          "Pleaded guilty to one count of price-fixing canned tuna sold in the U.S. (Sherman Act §1), part of a conspiracy with Bumble Bee and Chicken of the Sea/Tri-Union Seafoods running from as early as November 2011 through at least December 2013 (case: United States v. StarKist Co., N.D. Cal. 3:18-cr-00513). Sentenced to a $100 million criminal fine — the statutory maximum — plus 13 months' probation; the court rejected StarKist's request for a reduced ~$50 million fine on bankruptcy-risk grounds.",
        status: 'adjudicated',
        amount: 100000000,
        source: {
          name: 'U.S. Department of Justice — press release, "StarKist Ordered to Pay $100 Million Criminal Fine for Antitrust Violation" (2019); figures cross-corroborated by CBS News, SeafoodSource, National Fisherman, and Natural Law Review coverage of the same sentencing',
          url: 'https://www.justice.gov/archives/opa/pr/starkist-ordered-pay-100-million-criminal-fine-antitrust-violation',
        },
      },
      {
        year: 2021,
        body: 'Washington State Attorney General / King County Superior Court, Judge Julie Spector',
        action:
          "Washington State's Attorney General brought a civil action against StarKist and parent Dongwon Industries under the state Consumer Protection Act. On February 23, 2021, King County Superior Court ruled StarKist liable for price-fixing and Consumer Protection Act violations, finding StarKist 'artificially manipulated the price of canned tuna in Washington state'; restitution was to be determined separately.",
        status: 'adjudicated',
        amount: null,
        source: {
          name: 'Washington State Office of the Attorney General — press release, "AG Ferguson: Judge finds StarKist liable for price-fixing, Consumer Protection Act violations"',
          url: 'https://www.atg.wa.gov/news/news-releases/ag-ferguson-judge-finds-starkist-liable-price-fixing-consumer-protection-act',
        },
      },
      {
        year: 2024,
        body: 'U.S. District Court, S.D. Cal., Judge Dana Sabraw — In re: Packaged Seafood Products Antitrust Litigation, MDL 3:15-md-02670',
        action:
          "In December 2024, Judge Dana Sabraw approved a combined civil settlement of over $216 million from StarKist, Bumble Bee, and their parent companies together, resolving claims from direct purchasers, commercial food preparers, and individual consumers in the packaged-seafood price-fixing multidistrict litigation. The $216M figure is the total across all settling defendants, not StarKist's individual share, which was not separately disclosed in sources reviewed. (Separately, the Ninth Circuit's April 2022 en banc ruling upheld class certification in the related civil suit Olean Wholesale Grocery Cooperative v. Bumble Bee Foods et al.; StarKist's petition for certiorari, No. 22-131, was denied by the U.S. Supreme Court, leaving that class certification in place.)",
        status: 'settled',
        amount: null,
        source: {
          name: 'Courthouse News Service, "Judge grants $216 million settlement in yearslong canned tuna antitrust suit"',
          url: 'https://www.courthousenews.com/judge-grants-216-million-settlement-in-yearslong-canned-tuna-antitrust-suit/',
        },
      },
    ],

    practices: [
      {
        claim:
          "Announced in April 2021 that it sources 100% of its tuna and salmon from suppliers meeting the MSC standard for sustainable fishing, or enrolled in a Fishery Improvement Project (FIP) working toward that standard.",
        basis: 'company-disclosure',
        source: {
          name: 'PR Newswire, "StarKist Sourcing 100% of its Tuna and Salmon from Marine Stewardship Council (MSC) or Fishery Improvement Project (FIP) Fisheries"',
          url: 'https://www.prnewswire.com/news-releases/starkist-sourcing-100-of-its-tuna-and-salmon-from-marine-stewardship-council-msc-or-fishery-improvement-project-fip-fisheries-301274999.html',
          date: '2021',
        },
      },
      {
        claim:
          "States it purchased 100% of its purse-seine tuna supply from vessels listed on the ISSF ProActive Vessel Register (PVR), and 33.9% of its longline purchases from PVR-listed vessels, for its most recent reporting period (exact reporting year not disclosed in sources reviewed).",
        basis: 'company-disclosure',
        source: {
          name: "StarKist Sustainability Knowledge Center / Natural Resources & Policies pages",
          url: 'https://starkist.com/about-starkist/corporate-responsibility/natural-resources-policies/',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "States a forward-looking goal to purchase 100% of its tuna and salmon from MSC-certified fisheries by the end of 2026 — a target, not yet an achieved or independently audited state.",
        basis: 'company-disclosure',
        source: {
          name: 'StarKist sustainability pages, via SeafoodSource coverage',
          url: 'https://www.seafoodsource.com/news/environment-sustainability/starkist-says-all-its-salmon-and-tuna-now-sustainably-sourced',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "A completed search of CBP's Withhold Release Order / forced-labor-Finding listings and general IUU-fishing search terms found no action naming StarKist or a StarKist-supplying vessel. This is an absence-from-search finding, not proof of a clean supply chain — CBP's full WRO/Finding list was not paged through item-by-item.",
        basis: 'government-record',
        source: {
          name: 'CBP "Withhold Release Orders & Findings" listing (searched, no StarKist-specific hit found)',
          url: 'https://www.cbp.gov/trade/forced-labor/withhold-release-orders-and-findings',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Received a failing grade in Greenpeace USA's canned tuna brand guide ('The high cost of cheap tuna,' 3rd edition), alongside Bumble Bee and Chicken of the Sea/Tri-Union, described by Greenpeace as the market's 'big three.' Only the pass/fail grade is recorded here — Greenpeace's own editorial characterization of StarKist is not reproduced as fact.",
        basis: 'third-party-scorecard',
        source: {
          name: 'Greenpeace USA Tuna Guide, "The high cost of cheap tuna" (3rd edition)',
          url: 'https://www.greenpeace.org/usa/tuna-scorecard-24/',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "FDA/EPA joint fish-consumption guidance places canned light (skipjack) tuna in the 'Best Choices' category (2–3 servings/week) and albacore/white and yellowfin tuna in the 'Good Choices' category (1 serving/week, no other fish that week), reflecting higher mercury bioaccumulation in the larger, longer-lived species. This is category-level guidance about the tuna species, not a StarKist-specific finding or accusation.",
        basis: 'government-record',
        source: {
          name: 'Federal Register, "Advice About Eating Fish From the Environmental Protection Agency and Food and Drug Administration" (FDA URL in the original raw checkpoint has since 404'd; this Federal Register notice is the stable citable link for the same guidance)',
          url: 'https://www.federalregister.gov/documents/2017/01/19/2017-01073/advice-about-eating-fish-from-the-environmental-protection-agency-and-food-and-drug-administration',
          date: '2026-07-30',
        },
      },
    ],
  },
};
