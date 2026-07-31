// src/data/research/sourcing/seafood/bumble-bee_final.js
module.exports = {
  companyId: 'bumble-bee',
  sourcing: {
    industry: 'seafood',
    lastVerified: '2026-07-30',

    model: 'aggregator',
    modelSource: {
      name:
        "Bumble Bee's supply chain runs through FCF Co., Ltd. (Bumble Bee's parent company since January 2020, and also its primary tuna supplier) rather than a single farm or an exclusive contract fleet. Per Mongabay's investigative reporting, FCF supplies approximately 95% of Bumble Bee's albacore and more than 70% of its light-meat (skipjack) tuna, drawn from FCF's own FAD-free and MSC-related fishery programs.",
      url: 'https://news.mongabay.com/2020/02/tuna-supply-chains-under-scrutiny-as-bumble-bee-brand-changes-hands/',
      date: '2026-07-30',
      basis:
        'investigative-journalism (single outlet, treated as a lead per the module\'s IUU/labor sourcing tier), consistent with Bumble Bee\'s own company-disclosed sourcing-mix reporting (see practices below)',
    },

    certifications: [],
    // No confirmed MSC (or other third-party) certification found for Bumble
    // Bee/FCF as of this research pass. Two FCF-operated longline fisheries
    // (Indian Ocean tuna; Western/Central Pacific albacore-and-yellowfin) are
    // in active Fishery Improvement Projects working toward MSC certification
    // but were NOT yet certified as of the most recent document found (an
    // April 2024 FIP action plan). See practices[] below — this is recorded
    // as a company claim/FIP status, not a certification-directory hit.

    welfareSeafood: {
      sourceType: 'wild-caught',
      sourceTypeSource: {
        name:
          "Canned tuna has no meaningful U.S. commercial aquaculture; Seafood Watch's skipjack rating (see below) confirms wild-capture gear types (purse seine) for the species Bumble Bee's canned tuna draws from",
        url: 'https://www.seafoodwatch.org/recommendation/tuna/skipjack-tuna-30707',
        date: '2026-07-30',
        basis: 'category-level industry fact + third-party-scorecard fishery record',
      },

      farmingSystem: 'not-applicable',
      farmingSystemSource: {
        name:
          'No Bumble Bee aquaculture/farmed sourcing identified in this research pass; the canned tuna category is wild-caught only',
        url: 'https://www.seafoodwatch.org/recommendation/tuna/skipjack-tuna-30707',
        date: '2026-07-30',
        basis: 'category-level industry fact',
      },

      fishingMethod: 'unknown',
      fishingMethodSource: {
        name:
          "Bumble Bee/FCF disclose sustainability-program participation (FIP/MSC status by fishery, two FCF FAD-free sourcing programs) but not a gear-type breakdown (FAD vs. non-FAD, purse seine vs. longline share) for its own flagship retail SKUs (chunk light, solid white albacore). Vessels enrolled in FCF's programs can still include mixed gear practices, and no public disclosure resolving this to the SKU level was found.",
        url: 'https://thebumblebeecompany.com/sustaining-fisheries/',
        date: '2026-07-30',
        basis: 'company-disclosure (gap — gear-type breakdown not disclosed)',
      },

      seafoodWatchRating: 'Avoid (red)',
      seafoodWatchScope:
        'Skipjack tuna caught by purse seine on floating objects/FADs — Northwest, Southwest, or Western Central Atlantic. Seafood Watch rates by species + gear + region, not by brand; this is the underlying fishery-method rating for the gear/species combination most associated with canned light/skipjack tuna generally. It is not a confirmed Bumble Bee-specific gear breakdown (see fishingMethod above, unknown).',
      seafoodWatchSource: {
        name:
          'Seafood Watch (Monterey Bay Aquarium) — Skipjack Tuna recommendation page; cited concerns include bycatch of overfished bigeye tuna, blue marlin, and at-risk sharks',
        url: 'https://www.seafoodwatch.org/recommendation/tuna/skipjack-tuna-30707',
        date: '2026-07-30',
        basis: 'third-party-scorecard',
      },
    },

    enforcement: [
      {
        year: 2017,
        body: 'U.S. District Court, N.D. Cal. (DOJ Antitrust Division prosecution), Judge Edward M. Chen',
        action:
          "Pleaded guilty to one count of price-fixing shelf-stable (canned/pouch) tuna sold in the U.S. (Sherman Act §1), part of a conspiracy with StarKist and Chicken of the Sea/Tri-Union Seafoods running from as early as Q1 2011 through at least Q4 2013 (case: United States v. Bumble Bee Foods, LLC, N.D. Cal. No. 3:17-cr-00249; filed May 8, 2017; plea and sentencing held together August 2, 2017). Sentenced to a minimum criminal fine of $25 million, rising to a maximum of $81.5 million payable by successor entity 'Big Catch' in the event of a qualifying sale of Bumble Bee, plus a $400 special assessment; no restitution or probation was imposed. DOJ described the conspiracy as affecting over $600 million in canned tuna sales.",
        status: 'adjudicated',
        amount: 25000000,
        source: {
          name:
            'DOJ press release, "Bumble Bee Agrees to Plead Guilty to Price Fixing" (justice.gov blocked to direct fetch in this and the StarKist research pass; cross-corroborated identically by CBS News, Fox News, Law360, and SeafoodSource, all citing the same $25M/$81.5M figures and "Big Catch" successor-entity condition)',
          url: 'https://www.justice.gov/archives/opa/pr/bumble-bee-agrees-plead-guilty-price-fixing',
        },
      },
      {
        year: 2020,
        body: 'U.S. District Court, N.D. Cal. (DOJ Antitrust Division prosecution), Judge Edward M. Chen',
        action:
          "Former Bumble Bee President and CEO Christopher Lischewski was convicted December 3, 2019 of conspiring to fix, raise, and maintain the price of canned tuna with Bumble Bee, StarKist, and Chicken of the Sea (case: United States v. Lischewski, N.D. Cal. No. 3:18-cr-00203; filed May 16, 2018). The court found Lischewski was 'a leader or organizer' of the conspiracy. Sentenced June 16, 2020 to 40 months in federal prison and a $100,000 criminal fine. The Ninth Circuit affirmed the conviction July 7, 2021, and the U.S. Supreme Court denied Lischewski's petition for writ of certiorari on May 2, 2022 (No. 21-852) — the conviction is fully final, with no further appeal avenue remaining.",
        status: 'adjudicated',
        amount: 100000,
        source: {
          name:
            'DOJ press release, "Former Bumble Bee CEO Sentenced to Prison for Fixing Prices of Canned Tuna"; cert-denial date and docket number cross-corroborated by California Lawyers Association Antitrust E-Briefs (June 2022) and Wolters Kluwer Antitrust Connect blog',
          url: 'https://www.justice.gov/archives/opa/pr/former-bumble-bee-ceo-sentenced-prison-fixing-prices-canned-tuna',
        },
      },
      {
        year: 2017,
        body:
          "Los Angeles County District Attorney's Office / Los Angeles County Superior Court, California — a separate workplace-safety matter, not the federal price-fixing case",
        action:
          "Multiple news outlets (NBC News, CBS News, and others) reported that Bumble Bee agreed, announced January 2017, to plead guilty to a misdemeanor charge of willfully failing to provide an effective safety program, following the October 11, 2012 death of employee Jose Melena, who was trapped and cooked inside an industrial tuna pressure-cooker oven at the company's Santa Fe Springs, CA plant. Two individual employees were separately charged; reporting indicates one pleaded guilty to a felony lockout-tagout violation causing death. Reporting describes an approximately $6 million total settlement — described by the then-LA County DA's office as the largest known payout in a California workplace-violation death case — covering restitution to Melena's family, oven-safety equipment upgrades, and funding for the DA's office's workplace-safety enforcement program. The underlying LA County Superior Court criminal docket and the DA's own press release were not independently opened/confirmed in this research pass, so the dollar figure is not asserted as a verified amount.",
        status: 'settled',
        amount: null,
        source: {
          name:
            "NBC News, \"Bumble Bee to Pay $6 Million Over Employee Cooked in Tuna Oven\" (cross-corroborated by CBS News and other outlets; LA County DA press release PDF located but not independently opened this pass)",
          url: 'https://www.nbcnews.com/news/us-news/bumble-bee-pay-6-million-over-employee-cooked-tuna-oven-n408721',
        },
      },
      {
        year: 2024,
        body:
          'U.S. District Court, S.D. Cal., Judge Dana Sabraw — In re: Packaged Seafood Products Antitrust Litigation, MDL 3:15-md-02670',
        action:
          "In December 2024, Judge Dana Sabraw approved a combined civil settlement of over $216 million from StarKist, Bumble Bee, and their parent/former-parent companies (including Bumble Bee's former parent Lion Capital) together, resolving claims from direct purchasers, commercial food preparers, and individual consumers in the packaged-seafood price-fixing multidistrict litigation covering the 2011-2015 conspiracy period. The $216M figure is the total across all settling defendants, not Bumble Bee's individual share, which was not separately disclosed in sources reviewed.",
        status: 'settled',
        amount: null,
        source: {
          name: 'Courthouse News Service, "Judge grants $216 million settlement in yearslong canned tuna antitrust suit"',
          url: 'https://www.courthousenews.com/judge-grants-216-million-settlement-in-yearslong-canned-tuna-antitrust-suit/',
        },
      },
      {
        year: 2025,
        body: 'Federal court (exact docket not confirmed this research pass)',
        action:
          "Four fishing-vessel laborers filed suit in March 2025 alleging forced labor benefiting Bumble Bee's tuna supply chain. Bumble Bee moved to dismiss the suit (reported June 2025); no ruling on the merits has been found as of this research pass. Per the negative-claims-need-adjudication rule, this remains an allegation in active litigation, not an established fact.",
        status: 'pending',
        amount: null,
        source: {
          name: 'Mongabay, "Bumble Bee asks court to dismiss lawsuit alleging forced labor in tuna supply chain"',
          url: 'https://news.mongabay.com/2025/06/bumble-bee-asks-court-to-dismiss-lawsuit-alleging-forced-labor-in-tuna-supply-chain/',
        },
      },
    ],

    practices: [
      {
        claim:
          "CBP issued a Withhold Release Order effective August 18, 2020 on fish from the Da Wang, a Vanuatu-flagged, Taiwan-owned distant-water fishing vessel, citing evidence of forced labor (physical violence, debt bondage, withholding of wages, abusive living/working conditions). CBP escalated this to a full forced-labor Finding on January 28, 2022 — a stronger enforcement action than a WRO (a Finding is an adjudicated determination resulting in automatic seizure/exclusion, versus a WRO's detain-pending-review). The WRO and Finding are themselves verified government actions. Bumble Bee's own supply-chain connection to the Da Wang is NOT independently confirmed by a CBP notice naming Bumble Bee — that link is sourced only to advocacy reporting (Greenpeace) connecting the vessel to FCF, Bumble Bee's parent/supplier, and should be treated as an unconfirmed lead.",
        basis: 'government-record',
        source: {
          name:
            'CBP Withhold Release Orders & Findings listing (WRO and Finding dates); Bumble Bee/FCF supply-chain link per Greenpeace, "Forced labor linked to Bumble Bee supply chain" (advocacy source, not independently confirmed)',
          url: 'https://www.cbp.gov/trade/forced-labor/withhold-release-orders-and-findings',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "CBP issued a Withhold Release Order effective August 4, 2021 on the Hangton No. 112 (Fijian-flagged/owned vessel), citing forced labor (withholding of wages, debt bondage, retention of identity documents) — directly confirmed on CBP's own newsroom page. Reporting states Hangton Pacific supplies tuna to the Pacific Fishing Company (PAFCO) canning facility in Levuka, Fiji, which has a processing agreement with Bumble Bee Seafoods. The WRO itself is a verified government action; Bumble Bee's link to it via the PAFCO processing agreement is NOT confirmed directly from CBP's own notice text and remains a secondary-sourced, unconfirmed connection.",
        basis: 'government-record',
        source: {
          name:
            'CBP official notice, "CBP issues Withhold Release Order on Seafood Harvested with Forced Labor by the Hangton No. 112" (directly fetched, primary source)',
          url: 'https://www.cbp.gov/newsroom/national-media-release/cbp-issues-withhold-release-order-seafood-harvested-forced-labor-0',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "States that 71% of its seafood was 'sourced sustainably' in 2021, rising to 91% by 2023. 'Sourced sustainably' is Bumble Bee's own self-defined metric, not a named third-party certification or audit standard.",
        basis: 'company-disclosure',
        source: {
          name:
            "FoodNavigator-USA, \"The Bumble Bee Seafood Co's sustainability success opens unexpected marketing opportunities\"",
          url: 'https://www.foodnavigator-usa.com/Article/2022/03/31/bumble-bee-co-s-sustainability-success-opens-unexpected-marketing-opportunities/',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "States that, as of end of 2021, its albacore tuna line was sourced either from fisheries in formal Fishery Improvement Programs (FIPs) or already MSC-certified, and that it was converting its skipjack ('light tuna') line to MSC-certified sourcing during 2022. Separately, Bumble Bee and FCF announced (reported 2024) they are pursuing MSC certification for two longline tuna fisheries — an Indian Ocean albacore/bigeye/yellowfin fishery and a Western/Central Pacific albacore-and-yellowfin fishery, together spanning three oceans and more than 250 longline vessels, reported to represent approximately 50% of Bumble Bee's albacore production. As of the most recent document found (an April 2024 Fishery Improvement Project action plan), these two fisheries were still in assessment/improvement status working toward MSC standards, NOT yet MSC-certified.",
        basis: 'company-disclosure',
        source: {
          name:
            'SeafoodSource, "Bumble Bee Seafood pursuing MSC certification for two longline tuna fisheries"; FisheryProgress.org FIP profile, "Western and Central Pacific albacore and yellowfin tuna longline"',
          url: 'https://www.seafoodsource.com/news/environment-sustainability/bumble-bee-seafood-pursuing-msc-certification-for-two-longline-tuna-fisheries',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Received a failing grade in Greenpeace USA's canned tuna brand guide ('The high cost of cheap tuna,' 3rd edition), alongside StarKist and Chicken of the Sea/Tri-Union. Only the pass/fail grade is recorded here — Greenpeace's own editorial characterization of Bumble Bee is not reproduced as fact.",
        basis: 'third-party-scorecard',
        source: {
          name: 'Greenpeace USA Tuna Guide, "The high cost of cheap tuna" (3rd edition)',
          url: 'https://www.greenpeace.org/usa/tuna-scorecard-24/',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "FDA/EPA joint fish-consumption guidance places canned light (skipjack) tuna in the 'Best Choices' category (2-3 servings/week) and albacore/white and yellowfin tuna in the 'Good Choices' category (1 serving/week, no other fish that week), reflecting higher mercury bioaccumulation in the larger, longer-lived species. This is category-level guidance about the tuna species, not a Bumble Bee-specific finding or accusation.",
        basis: 'government-record',
        source: {
          name: 'FDA/EPA, "Advice about Eating Fish" joint guidance',
          url: 'https://www.fda.gov/food/consumers/questions-answers-fdaepa-advice-about-eating-fish-those-who-might-become-or-are-pregnant-or',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Recalled specific production codes of its 5-oz Chunk White Albacore and Chunk Light Tuna products (reported early 2023) due to loose seals/seams that could allow contamination by spoilage organisms or pathogens. This is sourced to a single trade-press report; FDA's own recall enforcement database was not independently queried this research pass to confirm the recall record directly.",
        basis: 'government-record',
        source: {
          name: 'SeafoodSource, "Bumble Bee, Tri-Union Seafoods issue recall of canned tuna products"',
          url: 'https://www.seafoodsource.com/news/food-safety-health/bumble-bee-tri-union-seafoods-issue-recall-of-canned-tuna-products',
          date: '2026-07-30',
        },
      },
    ],
  },
};
