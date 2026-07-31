// src/data/research/sourcing/meat-poultry/smithfield_final.js
module.exports = {
  companyId: 'smithfield',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-07-30',

    model: 'contract-farms',
    modelSource: {
      // Original source (ainvest.com) was an AI-generated financial-content
      // aggregator -- the same category the fact-check explicitly flagged
      // NOT to cite (grokipedia.com) when it independently re-corroborated
      // this figure. Re-sourced to Smithfield's own investor relations
      // press release and MEAT+POULTRY trade press (Stage 5 review, 2026-07-30).
      name: "Smithfield's own Q3/fiscal-year-2025 investor materials: company-owned hog production fell from 14.6 million head (2024) to 11.1 million head (2025), approximately 40% of hogs processed by its Fresh Pork segment, on track for 11.5 million head total in 2025 (down from a 2019 peak of 17.6 million). Two hog-farming operations formerly owned by Smithfield (Murphy Family Ventures, 150,000 sows; VisionAg LLC, 28,000 sows) became independent contract producers in the same period -- the rightsizing strategy driving the owned-vs-contract shift.",
      url: 'https://investors.smithfieldfoods.com/news-events/press-releases/detail/1434/smithfield-foods-reports-record-fiscal-2025-results',
      date: '2026-07-30',
      basis: 'company-disclosure',
    },

    certifications: [],

    welfareMeatPoultry: {
      gapStep: 'unknown',
      gapStepSource: {
        name: "Global Animal Partnership's find-a-producer directory was not genuinely queried in this pass — the URL attempted (globalanimalpartnership.org/find-a-producer) returned 404, and the correct interactive directory URL was not located. A site-restricted WebSearch (site:globalanimalpartnership.org Smithfield) returned no producer-specific hit. Recorded as NOT CHECKED / unknown, not as confirmed absence, since GAP's own directory was never successfully loaded.",
        url: 'https://globalanimalpartnership.org/',
        date: '2026-07-30',
        basis: 'third-party-audit',
      },
      grassFinished: 'not-applicable',
      grassFinishedSource: {
        name: 'Smithfield is a pork producer/processor; no grass-fed/grass-finished beef claim applies to its product line.',
        url: 'https://www.smithfieldfoods.com/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      // Stage 5 review (2026-07-31) downgraded this field from
      // 'company-claims-crate-free' to 'crates-used'. Rationale: this is a
      // company-WIDE field, and Smithfield's own crate-free claim is scoped to
      // company-owned farms only, which are ~40% of hogs processed and falling
      // toward ~30% (independently corroborated, per the fact-check). The
      // remaining majority comes from contract growers for whom group housing
      // is only "recommended," not required. A company-wide value asserting a
      // crate-free claim would flatter — the same failure the eggs module
      // prevents by defining welfare.housing as the WORST system still sold.
      // 'crates-used' also matches how the same evidence pattern was scored on
      // the hormel record (owned farms converted, majority of supply not), so
      // the two are comparable rather than reversed by disclosure style.
      // This value does NOT rest on the single-sourced HSUS quote below; it
      // rests on the corroborated scope facts. Smithfield's own crate-free
      // claim is preserved, attributed, in practices[].
      gestationCrateStatus: 'crates-used',
      gestationCrateSource: {
        name: "Smithfield announced in 2007 a company-wide commitment to phase out individual gestation stalls on company-owned sow farms over 10 years, replacing them with group housing; incremental progress was reported at 71.4% by end of 2014 and 87% by a later 2016 report. In June 2023 Smithfield announced it had fulfilled that 2007 commitment — group housing on all company-owned U.S. farms, after a reported $360M+ conversion investment. This claim is explicitly scoped to company-owned farms only. Contract growers were only 'recommended,' not required, to convert to group housing (target year 2022 cited via a sliding-scale incentive structure); growers who don't convert keep existing contracts but are less likely to get extensions. Company-owned farms account for only ~40% of hogs processed by Smithfield's Fresh Pork segment as of FY2025 (heading toward ~30%), so the 'fulfilled commitment' language covers a minority, and shrinking, share of total supply. All of this is secondary trade-press reporting of company statements, not independently confirmed against Smithfield's own primary disclosure text in this pass (direct WebFetch of the company's own announcement returned 403). Separately, Smithfield was not found to be a named plaintiff in National Pork Producers Council v. Ross, the U.S. Supreme Court's 2023 Proposition 12 case (named plaintiffs were NPPC and the American Farm Bureau Federation); the primary opinion PDF was located but not read line-by-line for a full party list in this pass.",
        url: 'https://www.feedstuffs.com/agribusiness-news/smithfield-fulfills-sow-housing-commitment-on-company-owned-farms',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      chillMethod: 'not-applicable',
      chillMethodSource: {
        name: 'Smithfield is a pork producer/processor; air-chilled vs. water-chilled is a poultry-processing claim type and does not apply to its product line.',
        url: 'https://www.smithfieldfoods.com/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      scorecards: [],
    },

    enforcement: [
      {
        year: 2018,
        body: 'U.S. District Court, District of Minnesota — In re Pork Antitrust Litigation (MDL No. 2998)',
        action:
          "Smithfield Foods, Inc. is a named defendant in the consolidated multidistrict litigation alleging major U.S. pork producers (also including Hormel Foods, Agri Stats, Seaboard Foods, Clemens Food Group, JBS USA, Triumph Foods, and Tyson entities) conspired to fix, raise, or stabilize pork prices beginning around 2009, partly via shared data through Agri Stats Inc. The overarching MDL docket (JPML consolidation 2021-03-10; the underlying case filed 2018-06-28) is VERIFIED as not-yet-terminated per direct CourtListener primary-source data (Stage 1 script pull; dateTerminated: null across all three related dockets). Smithfield's defendant role (as opposed to purchaser/plaintiff) was independently confirmed in fact-check via cross-checked defendant rosters, with no contradicting source found. The MDL remains open overall because other co-defendants continue litigating even after Smithfield's own portion settled (see below).",
        status: 'pending',
        amount: null,
        source: {
          name: 'CourtListener docket (primary court record, Stage 1 script pull); defendant role independently cross-checked against meatingplace.com and nationalhogfarmer.com trade coverage',
          url: 'https://www.courtlistener.com/docket/7338509/in-re-pork-antitrust-litigation/',
        },
      },
      {
        year: 2025,
        body: 'In re Pork Antitrust Litigation, D. Minnesota — settlements by Smithfield',
        action:
          "Smithfield has settled three separate tranches of the pork price-fixing MDL: approximately $42 million with restaurant/direct-action plaintiffs (also agreeing to cooperate in prosecuting claims against other pork companies); approximately $75 million with indirect/consumer purchasers (final court approval reported April 11, 2023, per Judge John R. Tunheim); and approximately $83 million with direct purchasers (named plaintiffs Maplevale Farms Inc. and John Gross & Company Inc.), reported by MEAT+POULTRY, National Hog Farmer, Food Dive, PorkBusiness, and U.S. News — five independent non-advocacy outlets. Combined, these three settlements total approximately $200 million, consistent with an independently found figure describing JBS, Tyson, and Smithfield together having 'paid out more than $200 million combined.' None of the three settlement amounts were independently confirmed against a primary court-filed order in this research pass.",
        status: 'settled',
        amount: 200000000,
        source: {
          name: 'MEAT+POULTRY; National Hog Farmer; Food Dive; PorkBusiness; U.S. News (five independent outlets, consistent figures, primary court orders not independently read)',
          url: 'https://www.nationalhogfarmer.com/market-news/smithfield-foods-posts-record-profit-sets-stage-for-2026-growth',
        },
      },
      {
        year: 2025,
        body: 'Humane Society of the United States v. Smithfield Foods, Inc. — Superior Court of the District of Columbia',
        action:
          "HSUS sued Smithfield on Oct. 18, 2021, alleging Smithfield's 'group housing' marketing and its public statement that it had eliminated gestation-crate use violated the D.C. Consumer Protection Procedures Act. HSUS's own filing characterized Smithfield's 'group housing' as a repeating cycle involving gestation crates — an allegation from the plaintiff, not an established fact. On Oct. 24, 2022, D.C. Superior Court Judge Yvonne Williams denied Smithfield's motion to dismiss, a procedural ruling allowing the case to proceed that is not itself a finding of liability; this ruling and the case's 2021 filing are independently corroborated by four non-advocacy trade outlets (MEAT+POULTRY, Farm Progress, National Hog Farmer, AGDAILY). The parties settled on Jan. 28, 2025. According to HSUS's own settlement announcement — the only source found for this specific language despite a genuine additional search effort, so it is presented here as HSUS's characterization, not Smithfield's own statement or an independently confirmed fact — Smithfield agreed to clarify its marketing and disclosures, and its materials now state that it 'still crates sows for 4 to 6 weeks each pregnancy cycle following insemination.' No settlement payment amount was found in HSUS's announcement or elsewhere.",
        status: 'settled',
        amount: null,
        source: {
          name: "Humane Society of the United States settlement announcement (plaintiff-side source for the specific disclosure quote); case filing and 2022 motion-to-dismiss ruling independently corroborated by MEAT+POULTRY, Farm Progress, National Hog Farmer, and AGDAILY",
          url: 'https://www.humaneworld.org/en/news/humane-society-united-states-and',
        },
      },
      {
        year: 2020,
        body: 'USDA Food Safety and Inspection Service — Notice of Intended Enforcement, Smithfield Fresh Meats Corp. (Est. M320M)',
        action:
          "A Notice of Intended Enforcement dated Feb. 20, 2020, reportedly alleged failure to prevent inhumane handling and slaughter of livestock at this establishment, per a document found hosted at an animal-advocacy site rather than FSIS's own domain (fsis.usda.gov returned 403 to direct fetch throughout this research pass). An NOIE gives the establishment a chance to demonstrate compliance before FSIS suspends inspection personnel assignment; it is a preliminary compliance notice, not an adjudicated finding. Content is drawn from search-result synthesis only and was not independently read from a primary FSIS document — flagged for re-verification against fsis.usda.gov directly before use as more than a lead.",
        status: 'alleged',
        amount: null,
        source: {
          name: 'Document hosted by an animal-advocacy organization (farmtransparency.org), not FSIS itself; content not independently fetched (404 on the specific document URL)',
          url: 'https://www.fsis.usda.gov/',
        },
      },
      {
        year: 2020,
        body: 'OSHA — Smithfield Packaged Meats Corp., Sioux Falls, SD',
        action:
          "OSHA cited the company for one general-duty-clause violation — failure to provide a workplace free of recognized COVID-19 hazards ahead of a March 2020 outbreak at the plant. Per Dept. of Labor figures reported by Insurance Journal, approximately 1,294 workers at the plant contracted COVID-19 and 4 employees died in spring 2020. The proposed penalty was $13,494 — the statutory maximum for this violation type at the time. Reporting indicates Smithfield initially contested the citation and later settled with OSHA; exact settlement terms were not independently confirmed in this pass. Because $13,494 is the PROPOSED penalty and the settled amount is unknown, no final penalty amount is recorded here.",
        status: 'settled',
        amount: null,
        source: {
          name: 'Insurance Journal; OSHA regional press release (page returned 404 on direct fetch in this pass — content from search-result synthesis, not independently confirmed)',
          url: 'https://www.insurancejournal.com/news/national/2020/09/11/582117.htm',
        },
      },
      {
        year: 2020,
        body: 'Cal/OSHA — Smithfield facility and subcontractor CitiStaff Solutions',
        action:
          "Cal/OSHA reportedly cited both Smithfield and its subcontractor CitiStaff Solutions for COVID-19 protection failures (masking, physical barriers) at a California facility, where more than 315 of approximately 1,800 workers were reportedly infected. Combined proposed fines were reported at more than $100,000 across both companies. This is secondary reporting only — no single primary source URL was independently confirmed in this research pass, and no disposition (contested, reduced, settled, or paid) was found, so the citations are recorded as unadjudicated.",
        status: 'alleged',
        amount: null,
        source: {
          name: 'Secondary news-search synthesis; no single primary source independently confirmed in this pass',
          url: 'https://www.osha.gov/',
        },
      },
      {
        year: 2024,
        body: 'Food & Water Watch v. Smithfield Foods, Inc. — Superior Court of the District of Columbia',
        action:
          "Food & Water Watch alleged Smithfield repeatedly misled consumers during COVID-19 (a separate case from the HSUS gestation-crate suit). Reported settled and dismissed in May 2024. Sourced to FarmSTAND, an advocacy/legal-support organization for food-system litigation; this is a D.C. Superior Court matter not covered by CourtListener's federal-only search, consistent with the pipeline's documented tooling limitation for state courts, and was not independently confirmed against the court's own docket.",
        status: 'settled',
        amount: null,
        source: {
          name: 'FarmSTAND (advocacy/legal-support organization, not independently cross-checked against the D.C. Superior Court docket)',
          url: 'https://farmstand.org/case/food-water-watch-v-smithfield-foods/',
        },
      },
      {
        year: 2020,
        body: 'North Carolina federal court / Fourth Circuit Court of Appeals — Murphy-Brown LLC nuisance litigation (hog-farm odor/lagoon suits)',
        action:
          "North Carolina federal nuisance litigation from roughly 2018-2020: neighbors alleged odor and insect nuisance from Smithfield's Murphy-Brown hog-production subsidiary's anaerobic lagoon waste-management system. A 2018 jury awarded $75,000 in compensatory damages per plaintiff plus $5 million in punitive damages, reduced to $2.5 million under North Carolina's punitive-damages cap. On November 19, 2020 the Fourth Circuit affirmed the jury's liability verdict for compensatory and punitive damages but vacated the punitive-damages award and remanded for a rehearing on that specific issue. Smithfield subsequently announced a settlement resolving the remaining cases (terms not disclosed). Re-sourced from trade/legal press (Feedstuffs, Insurance Journal, VOA News) rather than Wikipedia alone (Stage 5 review, 2026-07-30). A broader aggregate figure (~500 plaintiffs across 29 cases total, cited only by Wikipedia) was NOT independently confirmed against a primary docket count and is not asserted here — this entry describes the one case with independently-corroborated details.",
        status: 'settled',
        amount: null,
        source: {
          name: 'Feedstuffs, "Smithfield settles North Carolina hog nuisance lawsuit"; Insurance Journal and VOA News independently corroborate the Fourth Circuit ruling and settlement announcement',
          url: 'https://www.feedstuffs.com/livestock-and-poultry-market-news/smithfield-settles-north-carolina-hog-nuisance-lawsuit',
        },
      },
    ],

    practices: [
      {
        claim:
          "Smithfield announced in June 2023 that it had fulfilled its 2007 commitment to convert sows to group housing, a claim it scopes to its company-owned U.S. farms after a reported $360M+ conversion investment. Company-owned farms accounted for approximately 40% of the hogs processed by Smithfield's Fresh Pork segment as of FY2025, with a stated forward target near 30%; contract growers, who supply the remaining majority, were recommended rather than required to convert. No third-party certification of crate-free status was found for either group.",
        basis: 'company-disclosure',
        source: {
          name: "Smithfield announcement as reported by Feedstuffs, \"Smithfield fulfills sow housing commitment on company-owned farms\" (company's own announcement page returned 403 to direct fetch); supply-share figures from secondary financial-press reporting of Smithfield's FY2025 disclosures",
          url: 'https://www.feedstuffs.com/agribusiness-news/smithfield-fulfills-sow-housing-commitment-on-company-owned-farms',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "Smithfield's 'Pure Farms' line (launched Feb. 2017) markets fresh pork cuts, ham cuts, and packaged cuts (breakfast sausage, bacon) as 'no antibiotics, steroids, hormones or artificial ingredients,' stated to meet 'the highest level of USDA standards.'",
        basis: 'company-disclosure',
        source: {
          name: "Smithfield Foods investor-relations press release, \"Smithfield Foods Introduces Pure Farms(TM) Antibiotic-Free Product Line\" (primary company source; full text not independently re-fetched in this pass)",
          url: 'https://investors.smithfieldfoods.com/2017-02-20-Smithfield-Foods-Introduces-Pure-Farms-TM-Antibiotic-Free-Product-Line',
          date: '2017-02-20',
        },
      },
      {
        claim:
          "USDA AMS lists a 'Smithfield Process Verified Program' page. Its current (2026) scope — whether it currently covers antibiotic-related claims specifically, or only traceability/handling — was not confirmed; direct WebFetch of the page and the master PVP listing PDF returned 403 in this research pass.",
        basis: 'government-record',
        source: {
          name: 'USDA Agricultural Marketing Service (page existence confirmed via search-result title match; page content not independently fetched — HTTP 403)',
          url: 'https://www.ams.usda.gov/content/smithfield-process-verified-program',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "A 2006 secondary source states Smithfield Packing Company achieved USDA Process Verified Program certification for all three of its processing facilities at that time, described then as 'the world's largest pork company to be 100% process verified,' covering traceability-to-farm-of-origin, PQA Plus program adherence, and TQA livestock-hauler status. This is a 2006 source and the current (2026) PVP scope was not independently re-verified — flagged as outdated context, not a current-state claim.",
        basis: 'company-disclosure',
        source: {
          name: 'American Association of Swine Veterinarians news item (2006; STALE — predates 2020, current status not reconfirmed)',
          url: 'https://www.aasv.org/2006/05/smithfield-foods-achieves-usda-process-verified-certification/',
          date: '2006-05-01',
        },
      },
      {
        claim:
          "According to an FSIS recall page title, Smithfield Packaged Meats Corp. recalled approximately 185,610 lbs of ready-to-eat bacon topping product in 2022 for possible metal contamination, following a customer complaint. Page title/URL located via search; full page content was not independently fetched (403).",
        basis: 'government-record',
        source: {
          name: 'FSIS recall notice (page existence confirmed via search-result title match; full content not independently fetched — HTTP 403)',
          url: 'https://www.fsis.usda.gov/recalls-alerts/smithfield-packaged-meats-corp--recalls-a-ready-eat-bacon-topping-products-due',
          date: '2022-01-01',
        },
      },
    ],
  },
};
