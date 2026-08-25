// src/data/research/sourcing/eggs/vital-farms_final.js
module.exports = {
  companyId: 'vital-farms',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    model: 'contract-farms',
    modelSource: {
      name: "Company disclosure (hub-and-spoke network of contracted family farms; company's own avian-influenza page describes '600+' / '575+' contracted farms as of 2025-2026)",
      url: 'https://vitalfarms.com/avian-influenza/',
      date: '2026-04-15',
      basis: 'company-disclosure',
    },

    certifications: [
      {
        name: 'Certified Humane',
        verifier: 'Humane Farm Animal Care',
        scope: 'Pasture-raised shell egg cartons; operations described as over 100 farms in Texas, Missouri, Arkansas, Tennessee, Oklahoma, and Georgia',
        standard: 'total outdoor pasture system, with access to shelters at night',
        verifiedDate: '2026-07-28',
        source: {
          name: 'Certified Humane — Vital Farms producer page',
          url: 'https://certifiedhumane.org/vital-farms/',
        },
      },
    ],

    welfare: {
      housing: 'pasture-raised',
      housingSource: {
        name: 'Certified Humane — Vital Farms producer page (describes company-wide operations as a total outdoor pasture system)',
        url: 'https://certifiedhumane.org/vital-farms/',
        date: '2026-07-28',
        basis: 'certification',
      },
      scorecards: [
        {
          name: 'Cornucopia Organic Egg Scorecard',
          ratedLine: 'Vital Farms Organic',
          appliesTo: 'organic-line',
          rating: '1135/1700',
          tier: '4-star (1-5 scale)',
          year: 2024,
          url: 'https://www.cornucopia.org/scorecard/eggs/vital-farms-organic/',
        },
      ],
    },

    enforcement: [
      {
        year: 2021,
        body: 'U.S. District Court, Western District of Texas',
        action:
          "Usler et al. v. Vital Farms, Inc. (W.D. Tex., No. 1:21-cv-00447), filed May 20, 2021, alleged the company's 'humane'/'ethical' marketing claims were false, citing hatchery male-chick culling and beak-trimming as practices inconsistent with that marketing. Vital Farms states the court dismissed the class-action claims in September 2024 and that plaintiffs subsequently dropped remaining claims with no payment by the company. The court docket confirms the case was terminated January 7, 2025 — the docket confirms the closure date; the company's own account is the source for the substance of how the case was resolved.",
        status: 'adjudicated',
        amount: null,
        source: {
          name: 'CourtListener docket (primary court record, confirms filed/terminated dates); Vital Farms company statement (substance of resolution)',
          url: 'https://www.courtlistener.com/docket/59922095/usler-v-vital-farms-inc/',
        },
      },
      // Foundation to Support Animal Protection v. Vital Farms Inc.
      // (E.D. Va., No. 2:22-mc-00023) is a docket-confirmed case — filed
      // 2022-12-30, terminated 2023-12-22 — but is NOT included above.
      // Neither the raw research nor the fact-check pass ever established
      // what the underlying dispute concerned; a miscellaneous ("mc")
      // docket of this kind is very likely a subpoena or discovery matter
      // tied to the Usler litigation above rather than a separate
      // enforcement action, but that was never confirmed. Recording an
      // `action` description would mean guessing at what the case was
      // about, which is worse than omitting it.
      {
        year: 2026,
        body: 'U.S. District Court, Western District of Texas',
        action:
          "A federal securities class action (Wilkerson v. Vital Farms, Inc., W.D. Tex., No. 1:26-cv-00738) alleges the company made materially misleading statements about the operational impact of an ERP system transition ahead of a February 26, 2026 disclosure that it had missed its own revenue guidance. The court docket confirms the case was filed March 27, 2026 and remains pending, with no termination date recorded.",
        status: 'pending',
        amount: null,
        source: {
          name: 'CourtListener docket (primary court record)',
          url: 'https://www.courtlistener.com/docket/73101339/wilkerson-v-vital-farms-inc/',
        },
      },
    ],

    practices: [
      {
        claim:
          "As of April 2026, the company states approximately 9% of its contracted farms were temporarily housing hens indoors as part of avian-influenza management. Separately, an April 2024 version of the same company page reported 5 of 600+ farms affected since Fall 2022; the page has been updated at least twice since (May 2025, April 2026), so that 5-of-600 figure is that specific date's snapshot, not a current count.",
        basis: 'company-disclosure',
        source: {
          name: 'Vital Farms — Avian Influenza page (rolling company disclosure)',
          url: 'https://vitalfarms.com/avian-influenza/',
          date: '2026-04-15',
        },
      },
    ],
  },
};
