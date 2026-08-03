// src/data/research/sourcing/meat-poultry/johnsonville_final.js
module.exports = {
  companyId: 'johnsonville',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-07-30',

    // Johnsonville is privately held (Stayer family) with no SEC filings and
    // no public disclosure of its hog-sourcing structure. Two independent
    // research passes (Stage 2 + Stage 3 fact-check) both searched for an
    // owned-farm vs. contract-grower vs. open-market statement and found
    // none — a genuine data gap, not evidence either way.
    model: 'unknown',
    modelSource: {
      name: "No page was found on johnsonville.com or johnsonvillefoodservice.com disclosing whether the company's pork supply comes from company-owned farms, contract growers, or open-market purchasing. A 2014 secondary trade-press figure describing 'the most sow harvest capacity in the United States' (3,400 pigs/day) describes processing/slaughter capacity, not farm ownership or sourcing structure, and is stale/off-point. Independently reconfirmed as a genuine gap in the Stage 3 fact-check pass, not an incomplete search.",
      url: 'https://johnsonville.com/our-story/',
      date: '2026-07-30',
      basis: 'company-disclosure',
    },

    certifications: [],

    welfareMeatPoultry: {
      gapStep: 'none',
      gapStepSource: {
        name: "Re-checked 2026-08-03 using the same 3-method process applied uniformly across all 8 meat-poultry companies in this pass (previously the interactive producer directory attempt failed as a tooling limitation — replaced here with the two working static directories plus search): (1) GAP's Manufacturers directory [globalanimalpartnership.org/partners/manufacturers/, confirmed by direct HTML inspection to be a fixed, non-paginated 28-entry list — no match for 'Johnsonville']; (2) GAP's Shoppers/'Buy G.A.P. Certified' directory [globalanimalpartnership.org/shoppers/, confirmed fixed ~80-entry list — no match]; (3) a site-restricted WebSearch (site:globalanimalpartnership.org Johnsonville), which returned zero GAP-hosted hits (only Wikipedia and GAP's own general homepage/certification pages). This 3-method check is the same one that successfully surfaced real GAP portfolio pages for known-positive controls (Tyson Foods Inc., Applegate Farms) when run the same way, so this absence is a genuine completed search — upgraded from 'unknown' to 'none' on that basis.",
        url: 'https://globalanimalpartnership.org/partners/manufacturers/',
        date: '2026-08-03',
        basis: 'third-party-audit',
      },
      grassFinished: 'not-applicable',
      grassFinishedSource: {
        name: 'Johnsonville is a pork sausage manufacturer; no grass-fed/grass-finished beef claim applies to its product line. Not researched as an open claim type for this company.',
        url: 'https://johnsonville.com/our-story/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      gestationCrateStatus: 'unknown',
      gestationCrateSource: {
        name: "No Johnsonville-specific statement on gestation-crate use, group housing, or sow housing was found in either the Stage 2 research pass or the independent Stage 3 fact-check re-check. Johnsonville is primarily a sausage manufacturer rather than a vertically integrated hog producer/breeder in the way this claim type assumes, but that is an inference from absence of evidence, not a confirmed fact about its supply chain — its hog suppliers' practices were not identified. Recorded as unknown, not as crate-free or as using crates.",
        url: 'https://johnsonville.com/our-story/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      chillMethod: 'unknown',
      chillMethodSource: {
        name: 'No chilling-method disclosure (air-chilled vs. water-chilled) was located for Johnsonville products in this research pass; Johnsonville is primarily a pork sausage manufacturer rather than a fresh-poultry processor, so this claim type may have limited applicability, but no direct statement either way was found.',
        url: 'https://johnsonville.com/our-story/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      scorecards: [],
    },

    // The Hormel Foods Corp. v. Johnsonville, LLC trade-secrets dispute
    // (filed June 2025, dismissed with prejudice by Hormel) is a
    // labor/commercial dispute between two competitors over former-employee
    // conduct, not an animal-welfare, consumer-protection, or food-safety
    // matter, per the module's founder-set priority. Left out of
    // enforcement[] as out of this module's scope rather than mischaracterized
    // as a welfare/consumer-protection finding.
    enforcement: [],

    // These 4 entries were originally mislabeled as practices[] with
    // basis: 'company-disclosure' -- a recall is fundamentally a
    // government/regulatory action, not something a company voluntarily
    // discloses. Moved to the dedicated recalls[] array (Stage 5
    // follow-up, 2026-07-31) alongside the same basis correction.
    recalls: [
      {
        year: 2019,
        agency: 'USDA-FSIS',
        product: 'Jalapeño Cheddar smoked sausage',
        reason: 'Hard green plastic foreign-matter contamination',
        scope: 'Approximately 100,000 lbs',
        scale: 'own-facility',
        healthImpact: null,
        source: {
          name: 'Fox News (secondary aggregator; FSIS primary notice not independently fetched — direct fetches of fsis.usda.gov returned 403/404 throughout this research pass)',
          url: 'https://www.foxnews.com/health/johnsonville-recalls-nearly-100000-pounds-of-sausage',
          date: '2019-01-01',
        },
      },
      {
        year: 2023,
        agency: 'USDA-FSIS',
        product: 'Ready-to-eat pork sausage links',
        reason: 'Possible black plastic fiber contamination',
        scope: 'Approximately 42,000 lbs, June 2023',
        scale: 'own-facility',
        healthImpact: null,
        source: {
          name: 'TopClassActions (secondary aggregator; FSIS primary notice not independently fetched)',
          url: 'https://topclassactions.com/lawsuit-settlements/consumer-products/recalls/johnsonville-initiates-recall-for-pork-sausage-links-due-to-plastic-contamination/',
          date: '2023-06-01',
        },
      },
      {
        year: 2024,
        agency: 'USDA-FSIS',
        product: 'Turkey kielbasa sausage',
        reason: 'Possible rubber contamination',
        scope: 'Approximately 35,000+ lbs, March 2024',
        scale: 'own-facility',
        healthImpact: null,
        source: {
          name: 'AARP; TopClassActions (secondary aggregators; FSIS primary notice not independently fetched)',
          url: 'https://www.aarp.org/health/conditions-treatments/info-2024/johnsonville-sausage-recall.html',
          date: '2024-03-01',
        },
      },
      {
        year: 2025,
        agency: 'USDA-FSIS',
        product: 'Cheddar bratwurst (Momence, IL establishment)',
        reason: 'Possible hard plastic/foreign-matter contamination',
        scope: 'Approximately 22,672 lbs; produced Feb. 5, 2025; shipped to retail in GA, IN, KS, KY, MI, MN, OH, TN, VA, WI',
        scale: 'own-facility',
        healthImpact: null,
        source: {
          name: 'FSIS recall notice (page existence confirmed via search-result title match; full content not independently fetched — HTTP 403)',
          url: 'https://www.fsis.usda.gov/recalls-alerts/johnsonville-llc-recalls-cheddar-bratwurst-product-due-possible-foreign-matter',
          date: '2025-04-05',
        },
      },
    ],

    practices: [],
  },
};
