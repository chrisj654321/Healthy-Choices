// src/data/research/sourcing/meat-poultry/kraft-heinz_final.js
module.exports = {
  companyId: 'kraft-heinz',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-07-30',

    model: 'aggregator',
    modelSource: {
      name: "Kraft Heinz's own European Chicken Commitment page describes standards applied to its chicken 'suppliers' (plural) with third-party auditing and annual public reporting of supplier compliance — consistent with an aggregator model that buys from multiple external chicken producers rather than a single-farm or contract-flock structure. Separately, Kraft Heinz's market position is that of a large industrial purchaser that processes chicken and pork into branded products (Oscar Mayer) rather than raising livestock itself. Note that 'aggregator' here is this pipeline's reading of the structure, not a classification Kraft Heinz itself publishes. No company-wide sourcing-model disclosure (e.g., 10-K risk-factor language) was independently read in this research pass — sec.gov Archives URLs returned HTTP 403 throughout this research batch.",
      url: 'https://www.kraftheinz.com/en-GB/animal-welfare-commitment',
      date: '2026-07-30',
      basis: 'company-disclosure',
    },

    certifications: [],

    welfareMeatPoultry: {
      gapStep: 'unknown',
      gapStepSource: {
        name: "Global Animal Partnership's own Manufacturers directory page, fetched directly, does not list Kraft Heinz, Oscar Mayer, or any Kraft Heinz brand among its shown manufacturer partners (page 1 of the list only; the multi-page Farms & Ranches directory was not checked). Separately, Kraft Heinz made a forward-looking commitment (2017) to source 100% of its U.S. chicken via breeds/standards approved by RSPCA or GAP by 2024, including a max stocking density of 6 lb/sq ft and improved litter/lighting/enrichment — this is a pledge about supplier standards, not a claim that Kraft Heinz itself holds a GAP step rating, and no evidence was found in this research confirming the 2024 target was met. NOT CHECKED exhaustively; do not write as absent — write as 'not found on manufacturers directory; company has a supplier-standard pledge, completion unconfirmed.'",
        url: 'https://globalanimalpartnership.org/partners/manufacturers/',
        date: '2026-07-30',
        basis: 'third-party-audit',
      },
      grassFinished: 'unknown',
      grassFinishedSource: {
        name: "No evidence was found of Kraft Heinz/Oscar Mayer marketing any product as 'grass-fed.' Oscar Mayer's meat lines found in this research (hot dogs, bacon, turkey bacon, lunch meat) are processed/cured products, not raw beef cuts where a grass-fed label would typically appear. This is an absence-of-finding from the searches run in this research pass, not a completed exhaustive search of Kraft Heinz's full product catalog — carried forward as unknown, not as a confirmed 'no grass-fed claims.'",
        url: 'https://www.kraftheinz.com/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      // Stage 5 review (2026-07-31) downgraded this field from
      // 'company-claims-crate-free' to 'unknown'. Kraft Heinz has never
      // claimed to BE crate-free; its own current (2023) language is that it
      // is "phasing out the purchase of pork from suppliers who use gestation
      // stalls," open-ended, with no completion date or percentage. The enum
      // value 'company-claims-crate-free' asserted a completed company claim
      // the source note itself says does not exist. No source found supports
      // an affirmative 'crates-used' finding either (the only such claim is
      // advocacy-sourced and treated as a lead), so the field is genuinely
      // unresolved. The pledge history is preserved below and renders as
      // no-data, not as implied-good or implied-bad.
      gestationCrateStatus: 'unknown',
      gestationCrateSource: {
        name: "In 2012, then-Kraft Foods announced Oscar Mayer would move away from gestation stalls by 2022 (one of several such industry pledges made 2012-2015). Kraft Heinz's own successive disclosures then restated this commitment: its 2017 ESG report and 2018 proxy statement restated the target as elimination of gestation stalls globally 'by 2025'; its 2023 ESG Report softened the language to 'phasing out the purchase of pork from suppliers who use gestation stalls' — an open-ended phrase with no completion date or percentage-achieved figure disclosed. This is company-disclosure (Kraft Heinz's own successive report language); the sequence itself is the citable fact (2012: pledge by 2022 -> 2018: restated as by 2025 -> 2023: open-ended 'phasing out,' no completion percentage). No percentage-complete figure for Kraft Heinz's current gestation-stall-free sourcing was found. A separate 2021 World Animal Protection ('Quit Stalling') report characterizing the 2022 pledge as missed is an advocacy-sourced claim, treated as a lead only, not established fact, and is not the basis for this status. No GAP, Certified Humane, or AGW certification specific to Kraft Heinz's own gestation-crate-free status was found (NOT CHECKED exhaustively). Because there is no completion percentage or third-party certification, this is recorded as a company claim of moving toward crate-free sourcing, not a certified or company-wide-confirmed crate-free status.",
        url: 'https://www.sec.gov/Archives/edgar/data/1637459/000121465924004993/d322243px14a6g.htm',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      chillMethod: 'unknown',
      chillMethodSource: {
        name: 'No information was found on Oscar Mayer/Kraft Heinz poultry (turkey bacon, turkey breast) chilling method in this research pass. Genuine search attempted, no relevant result surfaced — do not write as either air- or water-chilled.',
        url: 'https://www.kraftheinz.com/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      scorecards: [],
    },

    // DELIBERATELY OMITTED (Stage 5 review, 2026-07-31): In re Broiler Chicken
    // Antitrust Litigation (N.D. Ill., 1:16-cv-08637). Kraft Heinz appears in
    // that docket as a PURCHASER/PLAINTIFF — it sued Tyson, Pilgrim's Pride and
    // other processors in 2019 alleging it was overcharged — and is on NO
    // version of the defendant roster. Stage 4 placed it in enforcement[] with
    // status 'pending'; the prose was correct but the FIELD TYPE was not.
    // enforcement[] means "an action against this company," and any UI that
    // renders body/status/year without the full action text would show
    // "Kraft Heinz — broiler chicken antitrust — pending," i.e. the exact
    // defamatory inversion the Stage 3 fact-check spent its priority section
    // preventing. The fact-check's own mandatory instruction was that this
    // UNVERIFIED, non-welfare fact defaults to OMIT unless the founder
    // specifically wants purchaser-side antitrust activity surfaced. If the
    // founder does want it, it needs its own non-enforcement field, not this
    // array. Source if restored: Food Business News, "Kraft Heinz, Conagra,
    // Nestle file poultry price-fixing lawsuit" (2019-04-02), mirrored by
    // Supermarket Perimeter.
    enforcement: [
      {
        year: 2025,
        body: 'USDA Food Safety and Inspection Service (FSIS)',
        action:
          "On 2025-07-02, Kraft Heinz Foods Company recalled approximately 367,812 lbs of fully cooked Oscar Mayer Turkey Bacon Original (12 oz vacuum packs, UPC 071871548601, 'use by' dates 2025-07-18 through 2025-08-02, lot code RS40) due to possible Listeria monocytogenes contamination. Product was made 2025-04-24 through 2025-06-11 and distributed nationwide plus exports to the British Virgin Islands and Hong Kong. The contamination was discovered via Kraft Heinz's own internal lab testing; no illnesses were reported as of the recall notice. The FSIS.gov primary recall notice could not be independently fetched (HTTP 403), but ABC News and Food Dive independently corroborate the same figures and detail.",
        status: 'settled',
        amount: null,
        source: {
          name: 'FSIS recall notice, title matched via search — page not independently fetched (HTTP 403); ABC News and Food Dive corroborate the same figures',
          url: 'https://www.fsis.usda.gov/recalls-alerts/kraft-heinz-foods-company-recalls-turkey-bacon-products-due-possible-listeria-contamination',
        },
      },
      {
        year: 2018,
        body: 'U.S. Occupational Safety and Health Administration (OSHA)',
        action:
          "As of 2018-03-16, Kraft Heinz Foods Company's Mason, OH facility received a citation after an employee suffered a partial finger amputation while clearing a machine jam; OSHA found failures in energy-control (lockout/tagout) procedures, inadequate machine guarding, and insufficient training, with $109,939 in proposed penalties. OSHA's proposed penalty is the figure at citation; whether it was contested, reduced, or paid as proposed was not determined in this research, so no final penalty amount is recorded. This is a 2018 finding, outside the 2023-2025 recency window relevant to this research pass, and is included only as historical pattern context with this explicit date caveat — it should not be presented as a current or recent finding.",
        status: 'alleged',
        amount: null,
        source: {
          name: 'U.S. Department of Labor press release (primary government source, URL located via search, not independently re-fetched in this research pass)',
          url: 'https://www.dol.gov/newsroom/releases/osha/osha20180316-3',
        },
      },
    ],

    practices: [
      {
        claim:
          "Kraft Heinz's European Chicken Commitment (published on its own site) pledges, by 2026, for European chicken supply only: compliance with all EU animal welfare laws regardless of production country; a maximum stocking density of 30kg/m2 or less; higher-welfare breed genetics; minimum 50 lux lighting (including natural light); at least 2 metres of perch space and 2 pecking substrates per 1,000 birds; no cages or multi-tier systems; specified stunning methods (controlled atmospheric stunning using inert gas or multi-phase systems, or effective electrical stunning without live inversion); and third-party auditing with annual public reporting. The geographic scope is explicitly Europe only, with a target year of 2026 (not yet due at time of research) — this does not apply to and must never be used to characterize U.S. Oscar Mayer sourcing.",
        basis: 'company-disclosure',
        source: {
          name: 'Kraft Heinz UK site, "Animal Welfare Commitment," fetched directly',
          url: 'https://www.kraftheinz.com/en-GB/animal-welfare-commitment',
          date: '2026-07-30',
        },
      },
    ],
  },
};
