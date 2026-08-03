// src/data/research/sourcing/meat-poultry/land-o-frost_final.js
module.exports = {
  companyId: 'land-o-frost',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-07-30',

    model: 'unknown',
    modelSource: {
      name: "Land O'Frost's corporate \"Who We Are\" page and FAQ page were both fetched directly and contain no disclosure of meat/animal sourcing practices, supplier relationships, farm practices, or a described sourcing model of any kind — their content is limited to company history, brand acquisitions, philanthropy, storage/nutrition guidance, and retail/employment information. This absence was independently confirmed twice (research pass and a separate fact-check pass) against the same pages. The company's 2025 Corporate Social Responsibility report (as described in press coverage, not the full PDF) covers emissions targets, Safe Quality Food (SQF) facility ratings — a food-safety certification, not an animal-welfare certification — and philanthropy, with no sourcing or welfare content mentioned in any press coverage found. Recorded as not disclosed, not as evidence of bad practice.",
      url: 'https://www.landofrost.com/who-we-are/',
      date: '2026-07-30',
      basis: 'company-disclosure',
    },

    certifications: [],

    welfareMeatPoultry: {
      gapStep: 'none',
      gapStepSource: {
        name: "Re-checked 2026-08-03 using the same 3-method process applied uniformly across all 8 meat-poultry companies in this pass (previously this company was checked via the Shoppers directory alone, an inconsistent method vs. the Manufacturers-directory check used for Tyson/Hormel/Kraft Heinz — corrected here): (1) GAP's Manufacturers directory [globalanimalpartnership.org/partners/manufacturers/, confirmed by direct HTML inspection to be a fixed, non-paginated 28-entry list — no match]; (2) GAP's Shoppers/'Buy G.A.P. Certified' directory [globalanimalpartnership.org/shoppers/, confirmed fixed ~80-entry list — no match for Land O'Frost or its Ambassador brand, reconfirmed]; (3) a site-restricted WebSearch (site:globalanimalpartnership.org \"Land O'Frost\"), which returned zero GAP-hosted hits. Method validated against known-positive controls (Tyson Foods Inc., Applegate Farms), so the absence is a genuine completed search. 'none' confirmed and retained.",
        url: 'https://globalanimalpartnership.org/partners/manufacturers/',
        date: '2026-08-03',
        basis: 'third-party-audit',
      },
      grassFinished: 'not-applicable',
      grassFinishedSource: {
        name: "No grass-fed or grass-finished beef claim was found for any Land O'Frost product line in this research pass.",
        url: 'https://www.landofrost.com/who-we-are/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      gestationCrateStatus: 'unknown',
      gestationCrateSource: {
        name: "No gestation-crate policy, company statement, or certification was found for Land O'Frost pork sourcing anywhere in the company's public materials.",
        url: 'https://www.landofrost.com/who-we-are/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      chillMethod: 'unknown',
      chillMethodSource: {
        name: "No chilling-method disclosure was found for Land O'Frost poultry products in this research pass.",
        url: 'https://www.landofrost.com/who-we-are/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      scorecards: [],
    },

    enforcement: [
      {
        year: 2020,
        body: 'Occupational Safety and Health Administration',
        action:
          "OSHA opened an inspection of Land O'Frost's Lansing, IL plant (16850 Chicago Avenue) on July 1, 2020, after a June 29, 2020 workplace injury in which a maintenance technician's hand was crushed in a Multi-Vac machine that cycled unexpectedly after safety guards were bypassed without proper lockout/tagout procedure, causing a fracture and hospitalization. OSHA issued one Serious citation under 29 CFR 1910.147(d) (lockout/tagout); the initial $74,218 penalty was reduced to $13,494 via formal settlement on October 30, 2020. The case closed November 24, 2021.",
        status: 'settled',
        amount: 13494,
        source: {
          name: "OSHA establishment inspection detail page (direct fetch, independently re-confirmed on a second fetch)",
          url: 'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1481556.015',
        },
      },
      {
        year: 2024,
        body: 'Occupational Safety and Health Administration',
        action:
          "OSHA opened a referral-type inspection of Land O'Frost's Chicago, IL plant (700 E. 107th Street) on January 17, 2024, focused on amputation hazards and food-manufacturing safety standards. Six citations were issued initially (including four Serious); three were deleted via a formal settlement on May 31, 2024, leaving citations under 29 CFR 1910.212 (machine guarding), 1910.147 (lockout/tagout), 1910.219 (mechanical power-transmission guarding), and 1904.0040 (recordkeeping). The initial $66,828 penalty was reduced to $44,262 after settlement. The case closed June 27, 2025.",
        status: 'settled',
        amount: 44262,
        source: {
          name: 'OSHA establishment inspection detail page (direct fetch, independently re-confirmed on a second fetch)',
          url: 'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1721385.015',
        },
      },
    ],

    recalls: [
      {
        year: 2015,
        agency: 'USDA-FSIS',
        product: 'Ambassador Beef Summer Sausage (12 oz. packages)',
        reason: 'Misbranding — contained undeclared pork',
        scope: 'Approximately 17 lb; produced July 25, 2015, shipped to Minnesota retail locations; discovered and self-reported to FSIS by the establishment',
        scale: 'own-facility',
        healthImpact: { illnesses: 0, hospitalizations: 0, deaths: 0 },
        source: {
          name: 'Perishable News and Food Poisoning Bulletin (accessed via WebSearch restatement, direct fsis.usda.gov fetch blocked); FSIS establishment page title independently corroborates',
          url: 'https://www.fsis.usda.gov/',
          date: '2015-07-25',
        },
      },
      {
        year: 2018,
        agency: 'USDA-FSIS',
        product: 'Premium Black Forest Ham',
        reason: "Mislabeling — front panel correctly read \"Black Forest Ham\" but the back panel was mislabeled \"Honey Smoked Turkey Breast\"",
        scope: 'Approximately 4,944 lb; produced April 27, 2018, shipped to AZ, CA, OR, TX, WA; discovered via a June 20, 2018 consumer complaint',
        scale: 'own-facility',
        healthImpact: { illnesses: 0, hospitalizations: 0, deaths: 0 },
        source: {
          name: 'Food Safety News, The National Provisioner, Legal Reader, Hip2Save, and corp.commissaries.com — five independent outlets (accessed via WebSearch restatement, direct fsis.usda.gov fetch blocked)',
          url: 'https://www.fsis.usda.gov/recalls-alerts/recall-notification-report-054-2018-ham-products',
          date: '2018-04-27',
        },
      },
    ],

    practices: [
      {
        claim:
          "No \"no antibiotics ever,\" hormone-free, or nitrate/nitrite policy claim was found anywhere in Land O'Frost's public materials (corporate site, FAQ, or CSR press coverage) — a multi-query search found nothing, though individual product-label/retailer-listing claims were not exhaustively spot-checked.",
        basis: 'company-disclosure',
        source: {
          name: "Land O'Frost, \"Who We Are\" and \"FAQs\" (direct fetch, both independently re-confirmed on a second fetch)",
          url: 'https://www.landofrost.com/faqs/',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Land O'Frost's three named manufacturing facilities (Lansing, IL; Madisonville, KY; Searcy, AR) each received an \"Excellent\" rating under the Safe Quality Food (SQF) program, per the company's 2025 Corporate Social Responsibility report. SQF is a GFSI-recognized food-safety certification covering facility/process food-safety management — it does not certify how animals were raised or handled and is not an animal-welfare standard.",
        basis: 'company-disclosure',
        source: {
          name: 'Perishable News, "Land O\'Frost Turns Family Values into Forward Progress in 2025 Corporate Social Responsibility Report" (direct fetch; the full CSR report PDF itself was not independently opened)',
          url: 'https://perishablenews.com/deli/land-ofrost-turns-family-values-into-forward-progress-in-2025-corporate-social-responsibility-report/',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Land O'Frost, its Ambassador brand, and its acquired Wellshire brand name do not appear in the Certified Humane directory (checked against the directory's current URL, certifiedhumane.org/whos-certified/).",
        basis: 'third-party-audit',
        source: {
          name: 'Certified Humane — Who\'s Certified directory (direct fetch of the current directory URL, after the previously-attempted URL was found to be dead)',
          url: 'https://certifiedhumane.org/whos-certified/',
          date: '2026-07-30',
        },
      },
    ],
  },
};
