// src/data/research/sourcing/meat-poultry/dietz-and-watson_final.js
module.exports = {
  companyId: 'dietz-and-watson',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-07-30',

    model: 'contract-farms',
    modelSource: {
      name: "Dietz & Watson's \"Global Impact\" page states the company does not operate its own farms, instead sourcing from external supplier programs organized by species (chicken, beef, pork, turkey), each with its own company-stated standard — the most detailed company-disclosed sourcing breakdown found among the three companies in this batch.",
      url: 'https://www.dietzandwatson.com/our-family/global-impact',
      date: '2026-07-30',
      basis: 'company-disclosure',
    },

    certifications: [],

    welfareMeatPoultry: {
      gapStep: 'none',
      gapStepSource: {
        name: "Global Animal Partnership's Shoppers partner-list page does not include Dietz & Watson; independently re-confirmed on a second fetch of the live directory.",
        url: 'https://globalanimalpartnership.org/shoppers/',
        date: '2026-07-30',
        basis: 'third-party-audit',
      },
      grassFinished: 'not-applicable',
      grassFinishedSource: {
        name: 'No grass-fed or grass-finished beef claim was found for any Dietz & Watson product line in this research pass.',
        url: 'https://www.dietzandwatson.com/our-family/global-impact',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      gestationCrateStatus: 'unknown',
      gestationCrateSource: {
        name: "No gestation-crate policy or company statement was found for Dietz & Watson pork sourcing; the company states its pork suppliers \"meet and exceed current humane handling requirements\" and participate in the National Pork Board Sustainable Pork Advisory Council, but does not address gestation-crate use specifically, and no certification was found.",
        url: 'https://www.dietzandwatson.com/our-family/global-impact',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      chillMethod: 'unknown',
      chillMethodSource: {
        name: 'No chilling-method disclosure was found for Dietz & Watson poultry products in this research pass.',
        url: 'https://www.dietzandwatson.com/our-family/global-impact',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      scorecards: [],
    },

    enforcement: [
      {
        year: 2010,
        body: 'USDA Food Safety and Inspection Service',
        action:
          "On March 16, 2010, FSIS issued a public health alert (prompted by a Canadian Food Inspection Agency tip) for deli meat products manufactured by a third-party supplier, Siena Foods LTD (Toronto), and sold in the U.S. under several brands including Dietz & Watson, Boar's Head, Daniele, and Black Bear of the Black Forest, due to possible Listeria monocytogenes contamination. No illnesses were reported at the time of the alert. This concerned a third-party supplier's products sold under the Dietz & Watson label, not a Dietz & Watson-operated facility.",
        status: 'adjudicated',
        amount: null,
        source: {
          name: 'USDA-FSIS / Canadian Food Inspection Agency alert (accessed via WebSearch restatement, direct fsis.usda.gov fetch blocked)',
          url: 'https://www.fsis.usda.gov/',
        },
      },
      {
        year: 2017,
        body: 'Voluntary recall — Deutsch Kase Haus (third-party co-packer)',
        action:
          "In February 2017, Colby and Colby Jack cheese products labeled Dietz & Watson were voluntarily recalled for possible Listeria monocytogenes contamination. The products were manufactured by a third-party supplier, Deutsch Kase Haus (Middlebury, Indiana) — not a Dietz & Watson-operated plant. Dietz & Watson ended its supplier relationship with Deutsch Kase Haus following the incident. This was a cheese recall traced to a since-dropped co-packer, not a contamination event at a Dietz & Watson-manufactured product or facility; no contamination recall of a Dietz & Watson-manufactured product was found in this research.",
        status: 'adjudicated',
        amount: null,
        source: {
          name: 'Manufacturing.net, Food Safety News, MEAT+POULTRY, Refrigerated & Frozen Foods, and Gourmet News — five independent outlets',
          url: 'https://www.foodsafetynews.com/',
        },
      },
      {
        year: 2020,
        body: 'U.S. District Court, Southern District of New York — Watson v. Dietz & Watson, Inc.',
        action:
          "A class action (case no. 1:20-cv-06550, filed August 17, 2020, Judge Alison J. Nathan) alleged Dietz & Watson's Smoked Gouda cheese labeling was deceptive because its smoky flavor comes from added \"natural smoke flavoring\" rather than actual wood-smoke exposure. The case status is settled and voluntarily dismissed; settlement terms were not made public.",
        status: 'settled',
        amount: null,
        source: {
          name: 'truthinadvertising.org litigation tracker; docket details corroborated via UniCourt',
          url: 'https://www.truthinadvertising.org/',
        },
      },
      {
        year: 2020,
        body: 'U.S. District Court, Eastern District of New York — Jones v. Dietz & Watson, Inc.',
        action:
          "A related class action (case no. 1:20-cv-06018, E.D.N.Y.) alleged the same type of deceptive \"smoked\" labeling claim against Dietz & Watson's Smoked Provolone cheese. Plaintiffs filed to voluntarily dismiss the suit with prejudice within about a month of filing; settlement details were not made public.",
        status: 'settled',
        amount: null,
        source: {
          name: 'National Law Review / Lexology, "Flavor Litigation Update: Smoked Cheese"; corroborated via topclassactions.com',
          url: 'https://www.natlawreview.com/',
        },
      },
      {
        year: 2024,
        body: 'Occupational Safety and Health Administration',
        action:
          "OSHA opened a referral-type inspection of Dietz & Watson's Philadelphia facility (5701 Tacony Street) on February 21, 2024, examining amputation hazards, and issued two \"Other\" citations under 29 CFR 1910.212(a)(2) and 29 CFR 1910.219(c)(4)(i) (machine-guarding standards). Total penalty was $12,340 following an informal settlement; the case closed December 20, 2024.",
        status: 'settled',
        amount: 12340,
        source: {
          name: 'OSHA establishment inspection detail page (direct fetch)',
          url: 'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1729245.015',
        },
      },
    ],

    practices: [
      {
        claim:
          "Dietz & Watson states its chicken suppliers raise \"cage free chickens... in a healthy, reduced stress environment that promotes animal welfare and natural behavior,\" fed \"wholesome feed with vitamins, minerals and abundant fresh water.\" No third-party certifier is named for this cage-free claim.",
        basis: 'company-disclosure',
        source: {
          name: "Dietz & Watson, \"Global Impact\"",
          url: 'https://www.dietzandwatson.com/our-family/global-impact',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Dietz & Watson states its beef suppliers \"meet and exceed current humane handling requirements\" and participate in the Global Roundtable for Sustainable Beef (GRSB), an industry sustainability roundtable rather than an animal-welfare certifier; supplier membership on GRSB's own roster was not independently confirmed.",
        basis: 'company-disclosure',
        source: {
          name: "Dietz & Watson, \"Global Impact\"",
          url: 'https://www.dietzandwatson.com/our-family/global-impact',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Dietz & Watson states its pork suppliers \"meet and exceed current humane handling requirements... in reduced stress environments\" and participate in the National Pork Board Sustainable Pork Advisory Council; supplier membership on the Board's own roster was not independently confirmed.",
        basis: 'company-disclosure',
        source: {
          name: "Dietz & Watson, \"Global Impact\"",
          url: 'https://www.dietzandwatson.com/our-family/global-impact',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Dietz & Watson states its turkey is raised in \"a reduced stress environment that promotes natural behavior and socialization\" on \"sustainable family farms in the Shenandoah Valley,\" following National Turkey Federation (NTF) Standards of Conduct — an industry-association program, not an independent third-party welfare certification.",
        basis: 'company-disclosure',
        source: {
          name: "Dietz & Watson, \"Global Impact\"",
          url: 'https://www.dietzandwatson.com/our-family/global-impact',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Dietz & Watson's \"Naturals\" product line (a distinct line, not the whole catalog) is marketed as \"no antibiotics EVER, no nitrates, no nitrites, no artificial preservatives, and no gluten\" and \"exclusively sourced from humane farms,\" with the company stating it conducts its own annual supplier audits — an internal, self-run audit program, not independent third-party certification.",
        basis: 'company-disclosure',
        source: {
          name: 'Dietz & Watson, "No Antibiotics Ever"',
          url: 'https://www.dietzandwatson.com/dietz-life/eatingbetter/no-antibiotics-ever',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Dietz & Watson states it separately sells a USDA Certified Organic \"Organics\" line — a legally-defined federal certification (which legally prohibits synthetic pesticides and most antibiotic use) distinct from the self-audited Naturals line. This claim was not independently confirmed against the USDA Organic Integrity Database (interactive search UI not queryable by this pipeline's tooling), so it is recorded as a company claim, not a verified certification.",
        basis: 'company-disclosure',
        source: {
          name: "Dietz & Watson, \"No Antibiotics Ever\" (company disclosure of the Organics line's existence; USDA Organic Integrity Database not independently queried)",
          url: 'https://www.dietzandwatson.com/dietz-life/eatingbetter/no-antibiotics-ever',
          date: '2026-07-30',
        },
      },
    ],
  },
};
