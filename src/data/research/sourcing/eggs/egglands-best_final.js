// src/data/research/sourcing/eggs/egglands-best_final.js
module.exports = {
  companyId: 'egglands-best',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    model: 'contract-farms',
    modelSource: {
      name: "Eggland's Best — About Us (company disclosure of franchise/licensing model)",
      url: 'https://www.egglandsbest.com/about-us',
      date: '2026-07-28',
      basis: 'company-disclosure',
    },

    certifications: [
      {
        name: 'Certified Humane',
        verifier: 'Humane Farm Animal Care',
        scope: "Free Range and Pasture Raised lines only — NOT the flagship conventional Eggland's Best product",
        standard: 'unknown',
        verifiedDate: '2026-07-29',
        source: {
          name: "Certified Humane — Who's Certified directory",
          url: 'https://certifiedhumane.org/whos-certified/',
        },
      },
    ],

    welfare: {
      housing: 'caged',
      housingSource: {
        name: "Eggland's Best product line pages (Cage-Free line marketed as distinct from the base/flagship product)",
        url: 'https://www.egglandsbest.com/products/cage-free-eggs',
        date: '2026-07-28',
        basis: 'company-disclosure',
      },
      scorecards: [
        {
          name: 'Cornucopia Organic Egg Scorecard',
          ratedLine: "Eggland's Best (organic line)",
          appliesTo: 'organic-line',
          rating: '20/1700',
          tier: '1-star (1-5 scale)',
          year: 2024,
          url: 'https://www.cornucopia.org/scorecard/eggs/egglands-best/',
        },
      ],
    },

    enforcement: [
      {
        year: 1996,
        body: 'Federal Trade Commission',
        action:
          "FTC alleged during 1994-1996 that Eggland's Best's marketing claims about saturated fat and cholesterol effects were false or unsubstantiated. Secondary sources reproducing the FTC's press release describe a consent settlement requiring corrective package language and, per those sources, a $100,000 payment; the primary FTC release could not be independently loaded to confirm directly, so the dollar figure is not asserted as a verified amount.",
        status: 'settled',
        amount: null,
        source: {
          name: 'Quackwatch (secondary mirror reproducing FTC press release text; primary ftc.gov blocked/403 in two independent attempts)',
          url: 'https://quackwatch.org/cases/ftc/news/ftc-news-releases-for-1994/egglands-best/',
        },
      },
      {
        year: 2024,
        body: 'Private plaintiffs, federal court (California, per secondary reporting)',
        action:
          "A putative class action alleges Eggland's Best's '25% Less Saturated Fat than Regular Eggs' label claim is false; plaintiffs cite independent lab testing they say shows more saturated fat than labeled. The case was reported pending as of 2024, with no confirmed resolution found.",
        status: 'pending',
        amount: null,
        source: {
          name: 'TopClassActions.com',
          url: 'https://topclassactions.com/lawsuit-settlements/consumer-products/food/egglands-best-class-action-falsely-advertises-25-less-saturated-fat-than-regular-eggs/',
        },
      },
      {
        year: 2024,
        body: 'U.S. District Court, Northern District of Illinois',
        action:
          "Janecyk et al. v. Eggland's Best, Inc. (N.D. Ill., No. 1:24-cv-06222), filed July 23, 2024, alleges the company's 'cage free' labeling ('every hen ... free to roam in a pleasant, natural environment') misrepresents housing conditions. The presiding judge denied a motion to dismiss in February 2026, ruling plaintiffs plausibly alleged a reasonable person would be misled. The court docket confirms the case remains open, with no termination date recorded as of this research (2026-07-29).",
        status: 'pending',
        amount: null,
        source: {
          name: 'CourtListener docket (primary court record)',
          url: 'https://www.courtlistener.com/docket/68970638/janecyk-v-egglands-best-inc/',
        },
      },
    ],

    practices: [],
  },
};
