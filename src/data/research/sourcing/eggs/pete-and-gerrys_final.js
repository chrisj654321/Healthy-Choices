// src/data/research/sourcing/eggs/pete-and-gerrys_final.js
module.exports = {
  companyId: 'pete-and-gerrys',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    model: 'contract-farms',
    modelSource: {
      name: "Cornucopia Organic Egg Scorecard — Pete and Gerry's Organic Eggs (multiple supplying farms)",
      url: 'https://www.cornucopia.org/scorecard/eggs/pete-and-gerrys-organic-eggs/',
      date: '2024-03-22',
      basis: 'third-party-scorecard',
    },

    certifications: [
      {
        name: 'Certified Humane',
        verifier: 'Humane Farm Animal Care',
        scope: "Per certifier directory: Kirkland Cage-Free Organic Eggs (private label); Nellie's Free-Range Eggs",
        standard: 'unknown',
        verifiedDate: '2026-07-29',
        source: {
          name: "Certified Humane — Who's Certified directory",
          url: 'https://certifiedhumane.org/whos-certified/',
        },
      },
    ],

    welfare: {
      housing: 'free-range',
      housingSource: {
        name: "Pete & Gerry's company site — product-line tagline ('Organic, Free-Range, and Pasture-Raised Eggs')",
        url: 'https://www.peteandgerrys.com',
        date: '2026-07-28',
        basis: 'company-disclosure',
      },
      scorecards: [
        {
          name: 'Cornucopia Organic Egg Scorecard',
          ratedLine: "Pete and Gerry's Organic Eggs",
          appliesTo: 'organic-line',
          rating: '1100/1700',
          tier: '4-star (1-5 scale)',
          year: 2024,
          url: 'https://www.cornucopia.org/scorecard/eggs/pete-and-gerrys-organic-eggs/',
        },
      ],
    },

    enforcement: [
      {
        year: 2019,
        body: 'U.S. District Court, Southern District of New York',
        action:
          "Lugones et al. v. Pete and Gerry's Organics, LLC (S.D.N.Y., No. 1:19-cv-02097), filed March 6, 2019, alleged marketing language ('love,' 'kindness,' 'green grass,' claims hens roam freely) misrepresented actual housing conditions; Nellie's Free Range Eggs was a co-defendant. A 2020 ruling on the motion to dismiss dismissed Nellie's Free Range Eggs from the case along with several claims, while other fraud/GBL claims survived. Secondary press subsequently reported the case as settled; settlement terms were not found. The court docket confirms the case was terminated April 23, 2020.",
        status: 'settled',
        amount: null,
        source: {
          name: 'CourtListener docket (primary court record)',
          url: 'https://www.courtlistener.com/docket/14631058/lugones-v-pete-and-gerrys-organics-llc/',
        },
      },
      {
        year: 2021,
        body: 'U.S. District Court, Southern District of New York',
        action:
          "Mogull v. Pete and Gerry's Organics, LLC (S.D.N.Y., No. 7:21-cv-03521), filed April 21, 2021, alleged 'free-range' labeling (Nellie's brand) did not meet the conditions represented. The court denied a motion to dismiss in March 2022. Secondary sources report the case was voluntarily dismissed with prejudice following settlement discussions. The court docket confirms the case was terminated April 12, 2023.",
        status: 'settled',
        amount: null,
        source: {
          name: 'CourtListener docket (primary court record)',
          url: 'https://www.courtlistener.com/docket/59840464/mogull-v-pete-and-gerrys-organics-llc/',
        },
      },
    ],

    practices: [
      {
        claim:
          "Organic Pasture Raised line is stated by the company to provide 108 square feet of outdoor space per hen, which the company attributes to Certified Humane Pasture-Raised standards (not independently cross-checked against the certifier's own published pasture-raised standard document).",
        basis: 'company-disclosure',
        source: {
          name: "Pete & Gerry's product page",
          url: 'https://www.peteandgerrys.com/products/organic-pasture-raised-eggs',
          date: '2026-07-28',
        },
      },
    ],
  },
};
