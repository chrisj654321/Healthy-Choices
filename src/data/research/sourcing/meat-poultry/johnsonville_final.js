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
      gapStep: 'unknown',
      gapStepSource: {
        name: "Global Animal Partnership's interactive producer directory was not queryable (documented tooling limitation). A targeted WebSearch for Johnsonville + GAP/Certified Humane/AWA returned no relevant hit in the Stage 2 pass, and an independent Stage 3 re-run of the same search also returned zero Johnsonville-specific hits. Two independent negative searches with no positive result; still recorded as unknown rather than a confirmed absence, since GAP's own directory itself could not be directly queried.",
        url: 'https://globalanimalpartnership.org/partners/manufacturers/',
        date: '2026-07-30',
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

    practices: [
      {
        claim:
          "According to secondary aggregator reporting (Fox News), Johnsonville recalled approximately 100,000 lbs of Jalapeño Cheddar smoked sausage in 2019 after a customer complaint of hard green plastic found in the product. Not independently confirmed against a primary FSIS recall notice — direct fetches of fsis.usda.gov returned 403/404 throughout this research pass.",
        basis: 'company-disclosure',
        source: {
          name: 'Fox News (secondary aggregator; FSIS primary notice not independently fetched)',
          url: 'https://www.foxnews.com/health/johnsonville-recalls-nearly-100000-pounds-of-sausage',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "According to secondary aggregator reporting (TopClassActions), Johnsonville recalled approximately 42,000 lbs of ready-to-eat pork sausage links in June 2023 over possible black plastic fiber contamination. Not independently confirmed against a primary FSIS recall notice.",
        basis: 'company-disclosure',
        source: {
          name: 'TopClassActions (secondary aggregator; FSIS primary notice not independently fetched)',
          url: 'https://topclassactions.com/lawsuit-settlements/consumer-products/recalls/johnsonville-initiates-recall-for-pork-sausage-links-due-to-plastic-contamination/',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "According to secondary aggregator reporting (AARP, TopClassActions), Johnsonville recalled approximately 35,000+ lbs of turkey kielbasa sausage in March 2024 over possible rubber contamination. Not independently confirmed against a primary FSIS recall notice.",
        basis: 'company-disclosure',
        source: {
          name: 'AARP; TopClassActions (secondary aggregators; FSIS primary notice not independently fetched)',
          url: 'https://www.aarp.org/health/conditions-treatments/info-2024/johnsonville-sausage-recall.html',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "FSIS recall page title (fsis.usda.gov) indicates Johnsonville LLC recalled approximately 22,672 lbs of cheddar bratwurst (produced Feb. 5, 2025 at its Momence, IL establishment) on April 5, 2025 for possible hard plastic/foreign-matter contamination, shipped to retail in GA, IN, KS, KY, MI, MN, OH, TN, VA, and WI. Page title/URL located; full page content was not independently fetched (403).",
        basis: 'government-record',
        source: {
          name: 'FSIS recall notice (page existence confirmed via search-result title match; full content not independently fetched — HTTP 403)',
          url: 'https://www.fsis.usda.gov/recalls-alerts/johnsonville-llc-recalls-cheddar-bratwurst-product-due-possible-foreign-matter',
          date: '2025-04-05',
        },
      },
    ],
  },
};
