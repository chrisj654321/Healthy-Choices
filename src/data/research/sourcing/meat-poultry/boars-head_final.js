// src/data/research/sourcing/meat-poultry/boars-head_final.js
module.exports = {
  companyId: 'boars-head',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-07-30',

    model: 'contract-farms',
    modelSource: {
      name: "Boar's Head, \"Animal Well-Being\" — the company states it does not operate farms or raise animals itself, instead sourcing from external suppliers selected on criteria including animal welfare standards, and describes collaborating with animal welfare experts and unnamed \"third-party audits.\" No specific certifier or audit standard is named on the page.",
      url: 'https://boarshead.com/animalwell-being',
      date: '2026-07-30',
      basis: 'company-disclosure',
    },

    certifications: [],

    welfareMeatPoultry: {
      gapStep: 'none',
      gapStepSource: {
        name: "Global Animal Partnership's Shoppers partner-list page does not include Boar's Head; independently re-confirmed on a second fetch of the live directory.",
        url: 'https://globalanimalpartnership.org/shoppers/',
        date: '2026-07-30',
        basis: 'third-party-audit',
      },
      grassFinished: 'not-applicable',
      grassFinishedSource: {
        name: 'No grass-fed or grass-finished beef claim was found for any Boar\'s Head product line in this research pass.',
        url: 'https://boarshead.com/animalwell-being',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      gestationCrateStatus: 'unknown',
      gestationCrateSource: {
        name: "No gestation-crate policy, company statement, or certification was found for Boar's Head pork sourcing in this research pass.",
        url: 'https://boarshead.com/animalwell-being',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      chillMethod: 'unknown',
      chillMethodSource: {
        name: "No chilling-method disclosure was found for Boar's Head poultry products in this research pass.",
        url: 'https://boarshead.com/animalwell-being',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      scorecards: [],
    },

    enforcement: [
      {
        year: 2021,
        body: 'Animal Welfare Institute — advocacy complaints filed with the Federal Trade Commission (no FTC action taken)',
        action:
          "On February 23, 2021, the Animal Welfare Institute (AWI) filed two complaints with the FTC alleging Boar's Head's \"humanely raised\" label claims — on its chicken sausage and on its Simplicity All Natural turkey products — are deceptive, on the grounds that Boar's Head's compliance with the industry-association FACTA (chicken) and NTF (turkey) programs does not constitute independent third-party welfare certification. As of this research (2026-07-30), no FTC enforcement action, consent order, or other public disposition on either complaint has been found in the five-plus years since filing; the matter has not been adjudicated. Recorded as 'alleged' rather than 'pending' because nothing indicates an open or active FTC proceeding — an advocacy complaint with no agency response in five-plus years is an unadjudicated allegation, not a pending action.",
        status: 'alleged',
        amount: null,
        source: {
          name: 'Animal Welfare Institute Quarterly, Spring 2021 retrospective (direct fetch); corroborated by Lady Free Thinker, New Food Magazine, Perishable News, and a Crowell & Moring law-firm client alert (non-advocacy legal-industry source)',
          url: 'https://awionline.org/awi-quarterly/spring-2021/awi-challenges-boars-head-humanely-raised-claim',
        },
      },
      {
        year: 2024,
        body: 'USDA Food Safety and Inspection Service (FSIS)',
        action:
          "FSIS opened an investigation July 12, 2024 after Maryland health officials detected Listeria monocytogenes in a liverwurst sample. Boar's Head recalled approximately 207,528 lb of liverwurst and related deli meat (produced June 11-July 17, 2024) from its Jarratt, Virginia plant on July 26, 2024, then expanded the recall on July 30, 2024 to approximately 7 million additional pounds of ready-to-eat meat and poultry products made at the Jarratt plant (establishment M12612) between May 10 and July 29, 2024. CDC identified 61 illnesses across 19 states and 10 deaths tied to the outbreak, with illness specimens collected May 29-September 13, 2024; CDC declared the outbreak over on November 21, 2024. FSIS suspended production at the Jarratt plant on July 31, 2024. A USDA-FSIS public report issued January 2025 found inadequate sanitation practices at the Jarratt facility contributed to the outbreak and documented 69 FSIS noncompliance reports issued for the plant between August 2023 and August 2024. Boar's Head permanently discontinued liverwurst production at Jarratt; the plant's broader suspension was indefinite, not permanent — FSIS placed the suspension into abeyance on July 18, 2025 after reviewing corrective documentation, and the plant reopened for non-liverwurst production in 2025 under enhanced federal oversight and at least 90 days of heightened Listeria monitoring.",
        status: 'adjudicated',
        amount: null,
        source: {
          name: 'USDA-FSIS recall notices and January 2025 public report (accessed via WebSearch restatement, direct fsis.usda.gov fetch blocked); corroborated by Food Safety News (direct fetch of its inspection-record investigation), CIDRAP, Virginia Business, WTVR, WVTF, and Fox Business',
          url: 'https://www.fsis.usda.gov/recalls-alerts/boars-head-provisions-co--expands-recall-ready-eat-meat-and-poultry-products-due',
        },
      },
      {
        year: 2025,
        body: 'U.S. District Court, Southern District of New York — Pompilio et al. v. Boar\'s Head Provisions Co. Inc.',
        action:
          "A consumer class action arising from the 2024 listeria recall (case no. 7:24-cv-08220-PMH, White Plains division), covering purchases of recalled products May 10-August 12, 2024, reached a $3.1 million class-action settlement; the court granted final approval on August 13, 2025.",
        status: 'settled',
        amount: 3100000,
        source: {
          name: 'CourtListener docket; corroborated by Fast Company and Food Poisoning News',
          url: 'https://www.courtlistener.com/?q=Pompilio+v.+Boar%27s+Head',
        },
      },
      {
        year: 2024,
        body: 'Wrongful-death claim — Morgenstein family (private settlement)',
        action:
          "The family of Gunter Morgenstein, represented by Ron Simon & Associates, reached a settlement with Boar's Head over a wrongful-death claim tied to the 2024 listeria outbreak, announced December 13, 2024; settlement terms were not disclosed and no public court docket number was located.",
        status: 'settled',
        amount: null,
        source: {
          name: '13newsnow, WAVY, MEAT+POULTRY, and Supermarket Perimeter — four independent outlets',
          url: 'https://www.13newsnow.com/',
        },
      },
      {
        year: 2024,
        body: "Wrongful-death suit — Otis Adams Jr. family",
        action:
          "A wrongful-death suit was filed by Morgan & Morgan on behalf of the family of Otis Adams Jr. (died May 5, 2024), alleging he contracted listeriosis from Boar's Head ham purchased at a Tampa-area Publix — reported as the first suit in the outbreak tied to ham/cheese rather than liverwurst. No public court docket number was located, and the case's current status was not confirmed in this research — recorded as an unadjudicated allegation rather than as a confirmed-pending action.",
        status: 'alleged',
        amount: null,
        source: {
          name: 'ABC News, Good Morning America, Forbes, and The Hill',
          url: 'https://abcnews.go.com/',
        },
      },
      {
        year: 2014,
        body: 'Occupational Safety and Health Administration',
        action:
          "OSHA issued one Serious citation to Boar's Head Provisions Co. Inc. (inspection #317489482) under 29 CFR 1910.22(a)(1), a walking-working-surfaces standard, with a penalty of $2,100; the citation was contested and reached a final settled order June 13, 2016. This predates and is unrelated to the 2024 listeria outbreak.",
        status: 'settled',
        amount: 2100,
        source: {
          name: "OSHA establishment/violation detail page (direct fetch)",
          url: 'https://www.osha.gov/ords/imis/establishment.violation_detail?id=317489482&citation_id=01001A',
        },
      },
    ],

    practices: [
      {
        claim:
          "Boar's Head states it selects suppliers on criteria including \"ethical farming practices, animal welfare standards, and sustainable approaches,\" collaborates with animal-welfare experts, and conducts \"verification audits, annual reviews, and third-party audits\" framed around the Five Freedoms — no specific certifier or audited standard is named.",
        basis: 'company-disclosure',
        source: {
          name: "Boar's Head, \"Animal Well-Being\"",
          url: 'https://boarshead.com/animalwell-being',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Boar's Head's chicken products are produced under the FACTA (Farm Animal Care Training & Auditing) program and its turkey products under the National Turkey Federation (NTF) Standards of Conduct — both industry-association programs, not independent third-party welfare certifications. This is the basis of the unadjudicated AWI complaint filed with the FTC (see enforcement).",
        basis: 'company-disclosure',
        source: {
          name: 'Corroborated across AWI, Lady Free Thinker, New Food Magazine, Perishable News, and Crowell & Moring (non-advocacy legal-industry source); no direct Boar\'s Head statement naming FACTA/NTF was independently fetched',
          url: 'https://awionline.org/awi-quarterly/spring-2021/awi-challenges-boars-head-humanely-raised-claim',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Boar's Head's Simplicity and All Natural Collection product lines carry \"no added hormones and no antibiotics ever\" claims and are marketed as \"humanely raised pork.\"",
        basis: 'company-disclosure',
        source: {
          name: "Boar's Head product listings (aggregated via retailer pages)",
          url: 'https://boarshead.com/',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Boar's Head labels certain products \"No Nitrates or Nitrites Added\" except for those naturally occurring in cultured celery powder and sea salt — standard FDA-permitted \"uncured\" labeling language; the product does still contain naturally-occurring nitrates/nitrites from those ingredients despite the \"no added\" framing.",
        basis: 'company-disclosure',
        source: {
          name: "Boar's Head product labels (aggregated)",
          url: 'https://boarshead.com/',
          date: '2026-07-30',
        },
      },
    ],
  },
};
