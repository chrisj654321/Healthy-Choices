// src/data/research/sourcing/meat-poultry/foster-farms_final.js
module.exports = {
  companyId: 'foster-farms',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-08-05',

    model: 'contract-farms',
    modelSource: {
      name: "Foster Farms is vertically integrated: it hatches, raises (via a mix of company-owned farms AND independent contract growers in California, Washington, and Oregon), manufactures its own feed, slaughters/processes at its own plants (Livingston, Fresno, Creswell OR, Kelso WA), and runs its own distribution trucking. Contract-grower relationships with independent Central Valley growers date to the 1940s-50s and continue today. This is UNVERIFIED at the primary-source level — no single Foster-Farms-authored disclosure confirming the exact company-farm/contract-grower ratio was found; the claim rests on cross-corroborated secondary company-history sources (Wikipedia, Encyclopedia.com, PortersFiveForces.com, Meatpoultry.com trade press), consistent across all of them. Classified as 'contract-farms' (mixed with some company-owned operations) rather than single-farm or pure-aggregator; not a co-op.",
      url: 'https://www.fosterfarms.com/our-story/',
      date: '2026-08-05',
      basis: 'company-disclosure',
    },

    certifications: [],

    welfareMeatPoultry: {
      // GAP's single-page "Manufacturers" partner directory was directly
      // fetched and does not list Foster Farms, but GAP's separate,
      // multi-page "Farms & Ranches" directory was NOT paginated through in
      // this pass — per the schema's "absent vs. not checked" rule, a
      // partial check cannot be recorded as a confirmed absence, so this
      // stays 'unknown' rather than 'none'.
      gapStep: 'unknown',
      gapStepSource: {
        name: "GAP's \"Manufacturers | 5-Step Partners\" directory (globalanimalpartnership.org/partners/manufacturers/) was fetched directly on 2026-08-05 and lists ~27 companies (Great American Foods, Wayne Farms, Bell & Evans, Perdue Farms, Miller Poultry, etc.) — Foster Farms does NOT appear. However, GAP's separate \"Farms & Ranches\" directory is multi-page and was NOT paginated through in this research pass, so this is a partial, not exhaustive, check. Recorded as unresolved/not-found-on-the-page-checked, not as a confirmed absence.",
        url: 'https://globalanimalpartnership.org/partners/manufacturers/',
        date: '2026-08-05',
        basis: 'third-party-audit',
      },
      // Foster Farms is a poultry-only producer; no beef/lamb line exists to
      // carry a grass-fed/grass-finished claim.
      grassFinished: 'not-applicable',
      grassFinishedSource: {
        name: 'Foster Farms is a poultry (chicken) producer with no beef or lamb product line — the grass-fed/grass-finished claim type does not apply.',
        url: 'https://www.fosterfarms.com/',
        date: '2026-08-05',
        basis: 'company-disclosure',
      },
      // Poultry-only producer; no hog/gestation-crate operations.
      gestationCrateStatus: 'not-applicable',
      gestationCrateSource: {
        name: 'Foster Farms is a poultry (chicken) producer with no hog/pork operations — the gestation-crate claim type does not apply.',
        url: 'https://www.fosterfarms.com/',
        date: '2026-08-05',
        basis: 'company-disclosure',
      },
      // Foster Farms markets specific labeled SKUs (e.g. "Air Chilled
      // Chicken Breasts," "Simply Raised" air-chilled wings) as air-chilled,
      // but no Foster-Farms-wide statement of its default/majority chilling
      // method (for core/commodity chicken) was found. Because this field
      // is company-wide, a SKU-scoped premium-line fact is not carried up
      // here — see practices[] for the scoped claim, matching how the same
      // SKU-vs-company-wide distinction was handled for Tyson's Smart
      // Chicken subsidiary.
      chillMethod: 'unknown',
      chillMethodSource: {
        name: "Foster Farms sells specific labeled air-chilled SKUs (e.g. retail listing \"Foster Farms Air Chilled Chicken Breasts Bone\" at Vons/Shaws; \"Simply Raised\" air-chilled wings) and its own \"Our Story / Healthy\" page lists air-chilled among several attributes it offers across its portfolio (\"air chilled, free range, organic, antibiotic free, hormone free, cage free, & vegetarian-fed options\") without stating this applies company-wide. Water-chilling is the more conventional/majority method industry-wide (general industry context, not a Foster-Farms-specific statement). No direct Foster Farms statement on its default/majority processing method for core/commodity chicken was found — this field stays 'unknown' rather than reading as company-wide air-chilling.",
        url: 'https://www.fosterfarms.com/our-story/healthy/',
        date: '2026-08-05',
        basis: 'company-disclosure',
      },
      scorecards: [],
    },

    enforcement: [
      {
        year: 2013,
        body: 'USDA Food Safety and Inspection Service',
        action:
          "FSIS issued a Public Health Alert on 2013-10-07 for chicken products from three Foster Farms California facilities, tied to the Salmonella Heidelberg outbreak that ultimately grew to 634 illnesses across 29 states and Puerto Rico (see recalls[]). Per secondary reporting (Food Safety News), FSIS also issued Notices of Intended Enforcement (NOIE) for the Livingston and Fresno plants around the same period, warning it would close the plants within three days absent adequate corrective action — this specific NOIE detail is UNVERIFIED at the primary-document level; the underlying FSIS letter (found only as a corrupted, unreadable PDF mirror) could not be read by either the research or fact-check pass. Foster Farms implemented corrective changes to slaughter/processing on 2013-10-10, and FSIS made a final regulatory determination that the corrective measures were successful — no suspension of inspection was issued in 2013. Separately, in January 2014 USDA ordered a suspension of operations at the Livingston plant; secondary reporting attributes this specifically to a cockroach infestation finding, not the Salmonella outbreak, though this attribution was NOT independently confirmed at the primary-document level (delauro.house.gov source blocked; low-priority, not re-attempted).",
        status: 'adjudicated',
        amount: null,
        source: {
          name: 'CDC outbreak page (VERIFIED primary source for the Oct 7/Oct 10, 2013 dates and "no suspension" outcome); FSIS Public Health Alert page (title/existence confirmed via search, content blocked — HTTP 403 on direct fetch, confirmed on two independent attempts); Food Safety News (secondary, for the NOIE detail specifically)',
          url: 'https://www.fsis.usda.gov/recalls-alerts/fsis-issues-public-health-alert-chicken-products-produced-three-foster-farms',
        },
      },
      {
        year: 2018,
        body: 'U.S. District Court, District of Arizona — Craten v. Foster Poultry Farms Incorporated (2:15-cv-02587)',
        action:
          "A jury found Foster Farms 30% at fault (70% allocated to the family's own food handling) in a $6.5 million gross verdict awarded to the family of a 5-year-old child who suffered a brain injury following a Salmonella Heidelberg infection linked to Foster Farms chicken as part of the CDC-identified 2013-14 outbreak. Causation and injury here are the jury's findings in this one individual case — not a general health claim about the product. Net recovery from Foster Farms specifically was approximately $1.95 million. This is the litigation tail of the already-counted 2013-14 outbreak, not a separate incident. Figures confirmed consistently across four independent secondary legal-news outlets (Food Business News, Pritzker Hageman, Feedstuffs, Food Poisoning Bulletin); not independently read from the court docket/opinion text itself.",
        status: 'adjudicated',
        amount: 1950000,
        source: {
          name: 'Food Business News, "Foster Farms responsible in Salmonella case, court says" (2018-03-12); Pritzker Hageman Law Firm; corroborated by Feedstuffs and Food Poisoning Bulletin',
          url: 'https://www.foodbusinessnews.net/articles/11498-foster-farms-responsible-in-salmonella-case-court-says',
        },
      },
      {
        year: 2021,
        body: 'California Court of Appeal, Second District, Division 5 — Leining v. Foster Poultry Farms, Inc. (and American Humane Association), B291600 (orig. LA County Superior Court BC588004)',
        action:
          "A putative class action alleged Foster Farms' \"American Humane Certified\" labeling misled consumers, citing footage the plaintiffs said showed chickens were not raised/slaughtered humanely, and that American Humane's certification standard itself was too lax to support the claim. The trial court granted summary judgment for both Foster Farms and American Humane Association; the Court of Appeal affirmed on 2021-02-23. The dismissal's basis was federal preemption under the Poultry and Poultry Products Inspection Act (the labels had been pre-approved by FSIS), plus separate pleading failures on the negligent-misrepresentation claim — not a ruling on whether the underlying welfare claims were true or false. Independently corroborated by FindLaw, Bloomberg Law, Lexology, vLex, and TopClassActions.",
        status: 'adjudicated',
        amount: null,
        source: {
          name: 'FindLaw, "Leining v. Foster Poultry Farms Inc (2021)"; Bloomberg Law, "Foster Farms Avoids Chicken Treatment Claims in Labeling Suit"',
          url: 'https://caselaw.findlaw.com/court/ca-court-of-appeal/2112707.html',
        },
      },
      {
        year: 2024,
        body: 'District of Columbia Superior Court — Organic Consumers Association v. Foster Farms, LLC et al.',
        action:
          "Organic Consumers Association alleges Foster Farms' \"five freedoms\" marketing claims (\"freedom from discomfort,\" \"freedom from injury, pain, or disease,\" \"room to run around\") are false, citing undercover investigation footage and 2018 USDA inspection records the complaint characterizes as documenting mistreatment of poultry, including birds allegedly entering scalders alive. These substantive allegations are UNVERIFIED/ALLEGED — this research did not independently locate or read the cited inspection records or investigation footage. Procedurally: Foster Farms removed the case to federal court (D.D.C. 1:2024cv01703); on 2025-03-26 Judge Tanya Chutkan granted OCA's motion to remand (denying OCA fees, finding the removal \"objectively reasonable\"), returning the case to DC Superior Court. No ruling on the underlying merits has been found. The complaint seeks injunctive relief only, no monetary damages.",
        status: 'pending',
        amount: null,
        source: {
          name: 'Organic Consumers Association press release; Justia docket (D.D.C. 1:2024cv01703, primary court record); Capital Press',
          url: 'https://organicconsumers.org/organic-consumers-association-takes-legal-action-against-foster-farms/',
        },
      },
      {
        year: 2025,
        body: 'Superior Court of California, County of Merced — Animal Legal Defense Fund v. Foster Poultry Farms',
        action:
          "Filed 2020-09-02, ALDF alleged Foster Farms' Livingston, CA slaughterhouse (drawing an estimated ~4 million gallons/day, reportedly over 60% of the city's water usage, from the \"critically overdrafted\" Merced Subbasin) violates the California Constitution's ban on \"unreasonable use\" of water, specifically targeting Foster Farms' live-hang slaughter method with electric immobilization, which ALDF's own complaint characterized as cruel (an advocacy-party characterization, not an adjudicated finding). A December 2020 ruling allowed the case to proceed on standing grounds. Foster Farms denies ALDF's allegations. The case settled (confirmed via ALDF's own case page, updated 2025-04-21); per the Water Education Foundation, the settlement includes a forward-looking commitment by Foster Farms to \"continue to work to improve water conservation and animal welfare\" at the Livingston plant. Specific numeric/binding settlement terms remain non-public; no admission of wrongdoing.",
        status: 'settled',
        amount: null,
        source: {
          name: "Animal Legal Defense Fund, \"Challenging Foster Farms Slaughterhouse's Illegal Water Use\" (plaintiff's own case page); corroborated by Water Education Foundation, Yahoo News, Courthouse News, and the Climate Litigation Database",
          url: 'https://aldf.org/case/challenging-foster-farms-slaughterhouses-illegal-water-use/',
        },
      },
      {
        year: 2025,
        body: 'USDA Agricultural Marketing Service — Packers and Stockyards Act stipulation, Foster Farms LLC (Livingston, CA)',
        action:
          "USDA entered a stipulation agreement with Foster Farms LLC on 2025-11-25 (AMS announcement dated 2026-05-18) resolving an alleged Packers and Stockyards Act violation: Foster Farms had last submitted a required scale-test report on 2024-10-10 but continued weighing poultry to determine sale prices throughout 2025 without a current scale-test report on file. Foster Farms agreed to pay a $1,600 civil penalty and waived its right to a hearing. This is a scale-certification/reporting-compliance lapse — not a welfare finding or a pricing-fraud/manipulation finding. UNVERIFIED at the primary-document level (the AMS page itself returned HTTP 403 on repeated direct-fetch attempts by both the research and fact-check passes); substance confirmed via search-engine synthesis of the AMS page's indexed content, not an independently-read primary document.",
        status: 'settled',
        amount: 1600,
        source: {
          name: 'USDA Agricultural Marketing Service (page title-matched via search; content not independently fetched — HTTP 403 on repeated attempts)',
          url: 'https://www.ams.usda.gov/content/usda-settles-packers-and-stockyards-case-foster-farms-llc',
        },
      },
    ],

    recalls: [
      {
        year: 2014,
        agency: 'USDA-FSIS',
        product: 'Fresh chicken products',
        reason: 'Salmonella Heidelberg contamination',
        scope: 'Over 1 million lbs; produced March 8/10/11, 2014; sold in 9 Western states (CA, HI, WA, AZ, NV, ID, UT, OR, AK)',
        scale: 'own-facility',
        // The full CDC-documented outbreak this recall was part of: 634
        // persons infected across 29 states + Puerto Rico, March
        // 2013-July 2014, 38% hospitalized (CDC reported as a percentage,
        // not a raw count — not converted to a number here to avoid
        // presenting a derived/estimated figure as a verified one), no
        // deaths reported.
        healthImpact: { illnesses: 634, hospitalizations: null, deaths: 0 },
        source: {
          name: 'CDC (archived), "2013 Salmonella Outbreak Linked to Foster Farms Brand Chicken" (VERIFIED, directly fetched, independently re-confirmed in fact-check); Food Safety News and Marler Clark for the recall-specific scope details (secondary, UNVERIFIED at FSIS-primary level)',
          url: 'https://archive.cdc.gov/www_cdc_gov/salmonella/heidelberg-10-13/index.html',
          date: '2014-07-01',
        },
      },
      {
        year: 2016,
        agency: 'USDA-FSIS',
        product: 'Fully cooked frozen chicken nuggets',
        reason: 'Possible foreign-matter contamination (blue plastic and black rubber material fragments)',
        scope: 'Approximately 220,450 lbs',
        scale: 'own-facility',
        healthImpact: null,
        source: {
          name: 'FSIS recall listing (title-matched via search; fsis.gov page content not independently fetched in this pass) — UNVERIFIED at title level only',
          url: 'https://www.fsis.usda.gov/recalls-alerts',
          date: '2026-08-05',
        },
      },
      {
        year: 2017,
        agency: 'USDA-FSIS',
        product: 'Frozen ready-to-eat breaded chicken patty products',
        reason: 'Possible foreign-matter (plastic) contamination',
        scope: 'Approximately 131,880 lbs',
        scale: 'own-facility',
        healthImpact: null,
        source: {
          name: 'FSIS, "Foster Poultry Farms Recalls Frozen Ready-To-Eat Breaded Chicken Patty Products Due to Possible Foreign Matter Contamination" (title/URL confirmed via search, page content not directly fetched) — UNVERIFIED at title level only',
          url: 'https://www.fsis.usda.gov/recalls-alerts/foster-poultry-farms-recalls-frozen-ready-eat-breaded-chicken-patty-products-due',
          date: '2017-01-01',
        },
      },
      {
        year: 2022,
        agency: 'USDA-FSIS',
        product: 'Fully cooked frozen chicken breast patty products',
        reason: 'Possible foreign-matter (hard clear plastic) contamination',
        scope: 'Approximately 148,000 lbs',
        scale: 'own-facility',
        healthImpact: null,
        source: {
          name: 'FSIS, "Foster Farms Recalls Fully Cooked Frozen Chicken Patty Products Due to Possible Foreign Matter Contamination" (title/URL confirmed via search, content not directly fetched) — UNVERIFIED at title level only',
          url: 'https://www.fsis.usda.gov/recalls-alerts/foster-farms-recalls-fully-cooked-frozen-chicken-patty-products-due-possible-foreign',
          date: '2022-01-01',
        },
      },
      // Note: the ~4M lb Oct 2025 corn dog wood-fragment recall (Class I,
      // ~5 injuries) is already logged on this company's existing
      // companies.js issues[] entry ('product-recall-2025') and is
      // intentionally NOT duplicated here, per the research brief.
    ],

    practices: [
      {
        // The single biggest judgment call in this file — see DISPUTED
        // flag in Stage 3 fact-check. Deliberately kept OUT of
        // certifications[] (which implies a current, directory-confirmed
        // certification) and placed here with an explicit date caveat,
        // per the STALE/DISPUTED handling rules.
        claim:
          "Foster Farms was \"American Humane Certified\" (administered by the American Humane Association — a separate certifier/program from \"Certified Humane\"/Humane Farm Animal Care, see below) on its fresh chicken products as of at least February 2021, per American Humane's own press release describing an eighth consecutive year of audits; press coverage described Foster Farms as the first West Coast fresh-chicken producer to earn the certification. Historical certification through at least 2021 is well-documented. However, American Humane's own current, primary \"Certified Farm Producers\" directory (101 producer entries, fetched directly and in full on 2026-08-05, including the poultry/broiler category) does NOT list Foster Farms, and the directory page's 10 featured-producer logos also exclude Foster Farms. No renewal, audit, or listing dated later than February 2021 was found despite a direct search. As of 2026-08-05, current/ongoing certification status is unconfirmed and the certifier's own directory suggests it has lapsed — this should be read as a historical certification, not an active current one. Advocacy groups have separately criticized the American Humane Certified standard itself as permissive; that critique is advocacy framing, not adjudicated fact, and is not asserted here.",
        basis: 'third-party-audit',
        source: {
          name: "American Humane Association press release announcing an eighth consecutive year of third-party welfare audits of Foster Farms broiler operations (historical, dated ~Feb 2021 — the release's own title carries the certifier's promotional characterization of the result and is deliberately not reproduced here, per the no-praise-adjective rule); American Humane, \"Certified Farm Producers\" current directory (fetched directly and in full, 2026-08-05, showing absence)",
          url: 'https://www.americanhumane.org/what-we-do/certify-humane-treatment/farms/certified-farm-producers/',
          date: '2026-08-05',
        },
      },
      {
        claim:
          "Certified Humane (Humane Farm Animal Care) does not list Foster Farms / Foster Poultry Farms as a certified producer. This is a confirmed absence, not an unchecked gap: the certifier's full A-Z \"Who's Certified\" directory (300+ entries) and its \"Shop by Brand\" page were both fetched directly and in full, independently, twice — once during research and once during fact-check — and Foster Farms does not appear on either. (Note: this is a different certifier/program from \"American Humane Certified,\" the historical certification described above — the two names are similar but are separate organizations with separate standards.)",
        basis: 'third-party-audit',
        source: {
          name: 'Humane Farm Animal Care, "Who\'s Certified" (full directory, fetched directly and independently re-confirmed)',
          url: 'https://certifiedhumane.org/whos-certified/',
          date: '2026-08-05',
        },
      },
      {
        claim:
          "Foster Farms states, and secondary/search-indexed sources indicate, that it holds USDA AMS Process Verified Program (PVP) certificates for its \"No Antibiotics Ever\" (NAE) claim — birds hatched, raised, and harvested with no antibiotics ever, fed an all-vegetarian diet, and (for at least one certificate) meeting a \"No Antibiotics Important to Human Medicine\" (NAIHM) standard. This is NOT recorded as a government-verified fact and must not render as one: the USDA AMS page describing it (ams.usda.gov/content/foster-farms-process-verified-program) returned HTTP 403 on repeated direct-fetch attempts across both the research and fact-check passes, and a Wayback Machine workaround was also blocked. The existence of a PVP-audited NAE certification is corroborated across two independent secondary/search-snippet sources, but specific certificate numbers were not confirmed against a source either pass directly read. Basis is deliberately recorded as 'company-disclosure' rather than 'government-record': the only source either pass actually read on this point is Foster Farms' own consumer blog. Upgrading the basis would let a search-engine snippet render to users as a government-verified certification.",
        basis: 'company-disclosure',
        source: {
          name: 'USDA Agricultural Marketing Service, "Foster Farms Process Verified Program" (page existence/content confirmed only via search-engine-indexed snippets; direct WebFetch 403\'d on repeated attempts — ams.usda.gov and fsis.usda.gov appear to systematically block WebFetch in this environment); Foster Farms\' own consumer blog corroborates the underlying NAE claim as company-disclosure',
          url: 'https://www.ams.usda.gov/content/foster-farms-process-verified-program',
          date: '2026-08-05',
        },
      },
      {
        claim:
          "Foster Farms markets specific labeled SKUs as air-chilled — e.g. \"Foster Farms Air Chilled Chicken Breasts Bone\" (retail listing at Vons/Shaws) and \"Simply Raised\" air-chilled wings — but this is scoped to those specific premium/branded product lines only. No company-wide statement of Foster Farms' default/majority chilling method for its core commodity chicken line was found; industry-wide, water-chilling is the more conventional majority method, but that is general industry context, not a Foster-Farms-specific disclosure. Do not read this as \"Foster Farms is air-chilled\" company-wide.",
        basis: 'company-disclosure',
        source: {
          name: 'Foster Farms / retailer product listings (e.g. Vons.com); Foster Farms, "Our Story / Healthy" page',
          url: 'https://www.fosterfarms.com/our-story/healthy/',
          date: '2026-08-05',
        },
      },
    ],
  },
};
