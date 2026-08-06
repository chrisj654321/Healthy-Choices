// src/data/research/sourcing/meat-poultry/perdue_final.js
module.exports = {
  companyId: 'perdue',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-08-05',

    // No page disclosing a company-wide sourcing structure (owned farms vs.
    // contract growers vs. open-market) was fetched or found in this
    // research pass — the raw research and fact-check files cover GAP/
    // Certified Humane/AGW/PVP/chill-method/recalls/court records in depth
    // but never reach a sourcing-model disclosure for Perdue itself. A
    // genuine data gap, not evidence either way.
    model: 'unknown',
    modelSource: {
      name: 'No company-wide sourcing-model disclosure (owned farms vs. contract growers vs. open-market) was located for Perdue Farms in this research pass. Perdue states it holds a USDA AMS Process Verified Program certification (see practices[]) covering the hatchery, the feed mill and the farm; that statement was not independently confirmed against a USDA record, and in any case does not state whether those farms are company-owned or independently contracted.',
      url: 'https://corporate.perduefarms.com/responsibility/animal-care/programs-practices',
      date: '2026-08-05',
      basis: 'company-disclosure',
    },

    // Third-party certification hits found this pass are all scoped to
    // subsidiary brands, not the flagship Perdue-brand product line — see
    // scope notes on each entry. Perdue's own "GAP 2 or higher" claim for
    // its organic chicken is a company disclosure (UNVERIFIED), not a GAP
    // directory hit, so it stays out of this array and lives in practices[]
    // instead.
    certifications: [
      {
        name: 'Certified Humane',
        verifier: 'Humane Farm Animal Care',
        scope: "Niman Ranch (Perdue subsidiary) — all pork, beef, lamb, and processed products (bacon, sausages, hot dogs, hams) across 720+ independent family farms and ranches. NOT Perdue-brand chicken, NOT Coleman Natural, Panorama Organic, or Draper Valley Farms — no Certified Humane hit was found for any of those.",
        standard: 'unknown',
        verifiedDate: '2026-08-05',
        source: {
          name: "Certified Humane's own press page, \"Niman Ranch Joins Certified Humane\" — certifier's-own-page primary source, VERIFIED per fact-check",
          url: 'https://certifiedhumane.org/niman-ranch-joins-certified-humane/',
        },
      },
      {
        name: 'Global Animal Partnership (GAP) Animal Welfare Certified',
        verifier: 'Global Animal Partnership',
        scope: 'Panorama Organic (Perdue subsidiary) — Panorama Grass-Fed Meats, organic, 100% grass-fed ranches only. NOT Perdue-brand chicken or any other subsidiary.',
        standard: 'Step 4 (of GAP\'s 5+ step scale), held "since the program launch in 2010" per GAP\'s own announcement',
        verifiedDate: '2026-08-05',
        source: {
          name: "GAP's own 2021 announcement post, corroborated by a Whole Foods Market product listing and Panorama's own marketing copy — VERIFIED per fact-check (certifier's own page + independent retailer corroboration)",
          url: 'https://globalanimalpartnership.org/about/news/post/panorama-grass-fed-meats-organic-step-4-rated-100-grass-fed-ranchers/',
        },
      },
      {
        name: 'Global Animal Partnership (GAP) Animal Welfare Certified',
        verifier: 'Global Animal Partnership',
        scope: 'Draper Valley Farms (Perdue subsidiary) only. NOT Perdue-brand chicken or any other subsidiary. Step level not stated anywhere on Draper Valley\'s own site or elsewhere found — record certification without a step number rather than infer one.',
        standard: 'unknown', // GAP-certified, no step number found anywhere — VERIFIED as a negative finding per fact-check
        verifiedDate: '2026-08-05',
        source: {
          name: "Draper Valley Farms' own site — VERIFIED (as a negative finding: certification confirmed, step number genuinely absent from the page)",
          url: 'https://drapervalleyfarms.com/practices/global-animal-partnership/',
        },
      },
    ],

    // welfareMeatPoultry: meat-poultry module shape (schema keys currently
    // documented as comments in evidence-schema.md; populated here as a
    // real object per the module's established convention in sibling
    // _final.js files, e.g. tyson_final.js).
    welfareMeatPoultry: {
      // Perdue's own "GAP 2 or higher" claim for its organic chicken is a
      // company disclosure (UNVERIFIED) about the flagship brand itself,
      // not a GAP directory hit, and is NOT the same as the Step 4/Step-
      // unknown certifications[] entries above (which belong to Panorama
      // Organic and Draper Valley subsidiaries, not the Perdue brand line).
      // Left 'unknown' at the company-wide level per the module's
      // company-wide-vs-subsidiary scoping convention (same approach used
      // for Tyson/Hormel/Applegate) — the claim itself is preserved in
      // practices[] with basis 'company-disclosure' instead of flattering
      // this field with an unverified self-report.
      gapStep: 'unknown',
      gapStepSource: {
        name: 'Perdue\'s own corporate animal-care page states its organic chicken is raised on farms "GAP 2 or higher" — a company disclosure (UNVERIFIED per fact-check), not a confirmed GAP directory hit (GAP does not expose a queryable public producer directory). Kept as company-disclosure-only evidence in practices[] rather than populating this company-wide field with an unverified self-report; the two subsidiary-scoped GAP hits that WERE independently corroborated (Panorama Organic Step 4, Draper Valley step-unknown) are recorded in certifications[] instead, scoped to those brands only.',
        url: 'https://corporate.perduefarms.com/responsibility/animal-care/programs-practices',
        date: '2026-08-05',
        basis: 'company-disclosure',
      },
      // Stage 5 correction: was 'not-applicable'. Per evidence-schema.md,
      // 'not-applicable' means the SPECIES doesn't apply to the company at
      // all (scorer.js: "company doesn't sell beef/lamb at all") — but Perdue
      // does sell beef, through its Panorama Organic subsidiary, so the field
      // applies and simply wasn't resolvable at the company-wide level.
      // 'unknown' is the honest value; the schema explicitly forbids
      // conflating the two. Zero scoring difference (both map to 0 in
      // GRASS_FINISHED_ADJUSTMENT), so this is a truthfulness fix, not a
      // score change, and it does not flatter in either direction.
      grassFinished: 'unknown', // Perdue's core business is poultry. Panorama Organic (subsidiary) is a grass-fed beef line, but that is a subsidiary-scoped fact, not carried up as a Perdue-brand claim — see certifications[] for the Panorama-specific entry.
      grassFinishedSource: {
        name: 'Not applicable to the Perdue-brand product line (poultry). Panorama Organic, a Perdue subsidiary, markets 100% grass-fed beef and holds GAP Step 4 (see certifications[]), but that is scoped to the Panorama brand, not carried up to the parent company-wide field.',
        url: 'https://corporate.perduefarms.com/responsibility/animal-care/programs-practices',
        date: '2026-08-05',
        basis: 'company-disclosure',
      },
      gestationCrateStatus: 'unknown', // Perdue-brand itself is poultry; gestation crates apply to Coleman Natural's pork line specifically (see practices[]), not confirmed at a Perdue-company-wide level.
      gestationCrateSource: {
        name: "Coleman Natural Foods (Perdue subsidiary) states its pork is \"100% crate-free\" (gestation and farrowing) per trade press (meatpoultry.com, refrigeratedfrozenfood.com, 2018) and Coleman's own site — a subsidiary-scoped, company-disclosure-level claim (UNVERIFIED, not an independent auditor's confirmation of the crate-free claim itself, though Coleman is separately American Humane Certified for pork under a different standard, see practices[]). Not carried up to a Perdue-company-wide gestation-crate status.",
        url: 'https://www.colemannatural.com/standards/',
        date: '2026-08-05',
        basis: 'company-disclosure',
      },
      chillMethod: 'water-chilled',
      chillMethodSource: {
        name: 'Perdue\'s own consumer-facing FAQ content states birds are held in a chilled water bath lowering temperature from 90°F to about 37°F over two hours, with no chlorine used in the chill water. Company disclosure (UNVERIFIED per fact-check — not third-party audited), but a specific, detailed technical description with no contradicting source found. Draper Valley Farms (subsidiary) markets an "air-chilled" line separately in its own marketing copy — not confirmed against Perdue\'s water-chilling description directly, and not carried into this company-wide field; flagged as an open follow-up item for a future research pass.',
        url: 'https://corporate.perduefarms.com',
        date: '2026-08-05',
        basis: 'company-disclosure',
      },
      scorecards: [
        {
          name: 'Cornucopia Institute Organic Beef Scorecard',
          ratedLine: 'Panorama Organic',
          appliesTo: 'organic-line',
          rating: '950/1100',
          tier: '5-star',
          spacePerAnimal: null,
          year: 2026,
          url: 'https://www.cornucopia.org/scorecard/organic-beef-scorecard/panorama-organic/',
          // VERIFIED per fact-check — fetched directly from Cornucopia's own scorecard page this pass.
        },
        {
          name: 'Cornucopia Institute Organic Poultry Scorecard',
          ratedLine: 'Draper Valley Farms / Roxy the Organic Chicken',
          appliesTo: 'organic-line',
          rating: '0/1800',
          tier: '1-star',
          spacePerAnimal: null,
          year: 2026,
          url: 'https://www.cornucopia.org/scorecard/organic-poultry-scorecard/roxy-the-organic-chicken-draper-valley-farms-perdue/',
          // VERIFIED per fact-check — fetched directly from Cornucopia's own scorecard page this pass.
          // Stage 5 scope note (do NOT smooth this over, and do NOT invent an
          // explanation for it): this 0/1800 and the Draper Valley GAP
          // certification in certifications[] are not in conflict and neither
          // resolves the other. They are different instruments — GAP is a
          // certifier's pass/fail audit status (step level genuinely absent
          // from Draper Valley's page), Cornucopia is an advocacy
          // organization's independently-computed points rating on its own
          // rubric. A brand can hold the first and score low on the second.
          // No source found this pass states WHY the score is 0, so no reason
          // is asserted here; the UI must render both, attributed to their
          // own instrument, and must not narrate a cause.
          // Note: Cornucopia lists this same 0/1800 score under two separate
          // page names (Roxy the Organic Chicken and a plain Draper Valley
          // Farms listing) for what appears to be the same underlying
          // producer. Recorded once here to avoid double-counting; the
          // second listing (cornucopia.org/scorecard/organic-poultry-scorecard/draper-valley-farms-perdue/)
          // carries the identical score and is not a separate data point.
        },
      ],
    },

    // Adjudicated/settled/pending actions. Chaney is active/pending and
    // hedged per the mandatory language table; Jien and Hemy are settled
    // (Jien monetarily, Hemy via a non-monetary label change) and are
    // stated directly per the VERIFIED/UNVERIFIED-but-well-corroborated
    // flags from the fact-check pass — none of these are stated with
    // causation-by-juxtaposition or forbidden language.
    enforcement: [
      {
        year: 2023,
        body: 'U.S. District Court, District of Maryland — Jien v. Perdue Farms, Inc. (1:19-cv-02521)',
        action:
          "Perdue Farms, Inc. and Perdue Foods LLC were among ~50 poultry-industry defendants (plus two compensation-survey firms, Agri Stats and Webber, Meng, Sahl & Co.) in a labor antitrust class action brought by poultry-plant workers alleging wage-fixing through shared compensation-survey data. Perdue's own settlement was preliminarily approved April 3, 2023 by Judge Stephanie A. Gallagher; the case resolved across the full defendant class with $398.05 million in total settlements granted final approval June 5, 2025 (a separate non-monetary injunctive settlement with data-aggregator Agri Stats received final approval March 10, 2026). This is a worker/labor wage-fixing case, distinct from the separate consumer/purchaser broiler-chicken price-fixing MDL. The case resolved by settlement; there was no trial and no adjudication of liability, and the underlying wage-fixing claims remain allegations.",
        status: 'settled',
        amount: 60700000,
        source: {
          name: "Cohen Milstein case page, corroborated by Bloomberg Law (legal-wire reporting on the court's own order) and meatpoultry.com trade press. Stage 5 provenance correction: the fact-check called these \"two independent sources\" — Cohen Milstein is plaintiffs' counsel, i.e. a PARTY to the case, not an independent source. The real basis is one arm's-length wire report (Bloomberg Law) plus trade press plus a party's own case page; CourtListener 403'd on all three passes, so no primary court document was ever opened for the $60.7M figure. Retained with direct language because the figure is a neutral procedural fact reported consistently across outlets (headline rounding to \"$60M\" is the only variance found, per fact-check), not because it met the primary-source VERIFIED bar.",
          url: 'https://cohenmilstein.com/case-study/jien-et-al-v-perdue-farms-inc-et-al/',
        },
      },
      {
        year: 2014,
        body: 'U.S. District Court, District of New Jersey — Hemy v. Perdue Farms, Inc. (3:11-cv-00888)',
        action:
          "A putative class action asserting New Jersey Consumer Fraud Act, common-law fraud, negligent-misrepresentation, and breach-of-warranty claims over a \"Humanely Raised\" label and a \"Raised Cage Free\" label used specifically on Perdue's Harvestland chicken brand (not Perdue's flagship brand). The case resolved via a label change, not a monetary payment: Perdue and the Humane Society of the United States announced an agreement on November 8, 2014 in which Perdue removed the \"Humanely Raised\" claim from Harvestland packaging, in exchange for dismissal of related New Jersey and Florida cases. Perdue's general counsel stated the company \"vigorously opposed\" the claims and maintained its labels were not misleading — this was a negotiated settlement, not a court finding that the label was false.",
        status: 'settled',
        amount: null,
        source: {
          name: 'lancasterfarming.com, corroborated by topclassactions.com, foodnavigator-usa.com, feedstuffs.com, and fortune.com — five independent outlets describing the same label-removal outcome with no contradiction. UNVERIFIED per the strict fact-check flag rubric (no primary court document re-opened, CourtListener 403\'d both research passes), but well-corroborated by independent secondary press.',
          url: 'https://www.lancasterfarming.com/perdue-settles-lawsuit-over-humanely-raised-label/',
        },
      },
      {
        year: 2024,
        body: 'U.S. District Court, District of Maryland — Chaney v. Perdue Farms Inc. (1:24-cv-02975)',
        action:
          "Five individual plaintiffs, all Salisbury, MD-area residents relying on private wells, filed suit October 11, 2024 on behalf of a putative class alleging Perdue's Salisbury, MD Agribusiness Facility released PFAS (\"forever chemicals,\" including PFOS, PFOA, and PFHxS) into groundwater via wastewater spray irrigation and stream discharge over 20+ years. The complaint further alleges that Maryland's Dept. of the Environment identified elevated PFAS in Perdue's wastewater in September 2023, and that Perdue knew PFAS had reached residents' private wells by April 2024 but did not notify the surrounding community (500+ homes on private wells within roughly two miles) until October 1, 2024. On August 12, 2025, the court denied Perdue's motion to stay the case and granted Perdue's motion to dismiss only in part — claims tied to vague \"health effects\" and future-cancer-risk-only injuries were dismissed without prejudice for insufficient causation pleading, while strict-liability, negligence, private/public nuisance, and trespass claims survived and the case proceeds to discovery. No liability finding, no settlement — case is active. PFAS contamination and causation remain allegations, not established fact.",
        status: 'pending',
        amount: null,
        source: {
          name: 'Court memorandum opinion (Case No. SAG-24-02975, ECF 44, filed 2025-08-12), independently corroborated by the Baltimore Sun, wboc.com, CBS News Baltimore, and daily-record.com — VERIFIED per fact-check via a directly-fetchable primary court document plus independent press. Scope note (Stage 5): the opinion is a primary source for the PROCEDURAL POSTURE and for what the complaint ALLEGES — on a motion to dismiss the court recites the plaintiffs\' allegations as true without finding them so. It is not a source establishing contamination, causation, or what Perdue knew and when. All such content is stated here as allegation only.',
          url: 'https://thenewlede.org/wp-content/uploads/2025/08/judges-opinion-on-defendants-mtd-or-stay-8122025.pdf',
        },
      },
    ],

    recalls: [
      {
        year: 2024,
        agency: 'USDA-FSIS',
        product: 'PERDUE Simply Smart ORGANICS Breaded Chicken Breast Nuggets (22-oz), PERDUE Chicken Breast Tenders (29-oz), and Butcher Box Organic Chicken Breast Nuggets',
        reason: 'Possible contamination with metal wire, discovered after consumer complaints of metal wire embedded in product.',
        scope: 'Approximately 167,171 lbs, frozen ready-to-eat chicken breast nugget and tender products produced March 23, 2024 at the Perry, GA establishment.',
        scale: 'own-facility',
        healthImpact: null, // no confirmed adverse reactions reported
        source: {
          name: 'FSIS recall notice (fsis.usda.gov 403\'d direct fetch both research passes), independently corroborated by ABC News/GMA, Today.com, CBS News, and NPR, plus a direct quote from Perdue\'s own SVP of food safety and quality — UNVERIFIED per the strict flag rubric (primary FSIS page not independently reached) but strongly corroborated by 5 independent outlets with zero discrepancy',
          url: 'https://www.fsis.usda.gov/recalls-alerts/perdue-foods-llc-recalls-frozen-ready-eat-chicken-breast-nugget-and-tender-products',
          date: '2024-08-16',
        },
      },
    ],

    practices: [
      {
        claim: 'Perdue states it holds a USDA AMS Process Verified Program (PVP) certification for its "No Antibiotics Ever" claim, under which USDA AMS auditors review the hatchery, the feed mill, and the farm. Perdue also states it eliminated routine use of all human antibiotics from every production step by the end of 2014. The USDA AMS page for this certification returned HTTP 403 on direct fetch in both the research and fact-check passes, so the certificate itself was not independently confirmed; recorded as a company statement rather than as a retrieved government record.',
        basis: 'company-disclosure',
        source: {
          name: "Perdue's own animal-care page. Fact-check flagged the program-level fact VERIFIED, but the only corroboration found was a 2015 PR Newswire item — a paid press-release wire, i.e. company-issued, not arm's-length reporting — and the canonical USDA AMS page 403'd. Basis recorded as company-disclosure on that ground (Stage 5 downgrade from 'government-record'). Facility-level PVP detail was UNVERIFIED and is deliberately omitted.",
          url: 'https://corporate.perduefarms.com/responsibility/animal-care/programs-practices',
          date: '2026-08-05',
        },
      },
      {
        claim: 'Perdue\'s own corporate site states its organic chicken is raised on farms "GAP 2 or higher." This is a company self-report about the Perdue brand itself, not an independently confirmed GAP directory hit (GAP has no queryable public producer directory) — kept distinct from the subsidiary-scoped, independently-corroborated GAP certifications for Panorama Organic (Step 4) and Draper Valley Farms (step unknown) in certifications[].',
        basis: 'company-disclosure',
        source: {
          name: "Perdue Farms corporate site, animal-care programs-and-practices page. UNVERIFIED per fact-check.",
          url: 'https://corporate.perduefarms.com/responsibility/animal-care/programs-practices',
          date: '2026-08-05',
        },
      },
      {
        claim: 'Coleman Natural Foods (Perdue subsidiary) pork is certified "American Humane Certified" (administered by American Humane, a different certifier from Certified Humane/Humane Farm Animal Care — do not conflate) and marketed as "100% crate-free" (gestation and farrowing). Scoped to Coleman Natural\'s pork line only, not the Perdue brand or other subsidiaries.',
        basis: 'company-disclosure',
        source: {
          name: "meatpoultry.com and refrigeratedfrozenfood.com trade press (2018), corroborated by colemannatural.com/standards/. UNVERIFIED per fact-check (trade press + company site, not American Humane's own directory).",
          url: 'https://www.colemannatural.com/standards/',
          date: '2026-08-05',
        },
      },
      {
        claim: 'GAP portfolio-page search-engine summaries describe Coleman Natural Foods farms/ranches as certified at GAP Pork Step 1 and Chicken Step 2, Step 3 (organic), and Step 5. Recorded here rather than in certifications[] or welfareMeatPoultry.gapStep because the underlying GAP portfolio page 404\'d on direct fetch in both the research and fact-check passes — these numbers are search-engine-synthesis-only, lower confidence than the Panorama Organic Step 4 finding, and should not be presented with equal confidence.',
        basis: 'company-disclosure',
        source: {
          name: 'Search-engine-indexed summary of globalanimalpartnership.org/portfolio/coleman-natural-foods/ (direct fetch 404\'d twice, independently, in both research and fact-check passes). UNVERIFIED, explicitly lower-confidence per fact-check.',
          url: 'https://globalanimalpartnership.org/portfolio/coleman-natural-foods/',
          date: '2026-08-05',
        },
      },
      {
        claim: 'Panorama Organic and Coleman Natural/Coleman Organic product lines are marketed as "USDA Certified Organic," per the brands\' own marketing and (for Panorama) Whole Foods retail listings. Not independently confirmed against the USDA Organic Integrity Database directly — the live database could not be queried in this research pass.',
        basis: 'company-disclosure',
        source: {
          name: "Panorama Organic and Coleman Natural's own marketing/product pages; Whole Foods Market product listing for Panorama. UNVERIFIED — no direct USDA Organic Integrity DB query performed.",
          // URL points at the brands' own marketing page, which is the actual
          // source. The USDA Organic Integrity DB (organic.ams.usda.gov/integrity)
          // is named above as the check NOT performed — citing its URL as the
          // source would imply a database hit that never happened.
          url: 'https://www.colemannatural.com/standards/',
          date: '2026-08-05',
        },
      },
    ],
  },
};
