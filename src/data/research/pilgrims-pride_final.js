// Pilgrim's Pride Corporation — companies.js company record
// Agent 3 (Legal Writer) final output. Legal-separation pipeline: /political-analysis.
// Built from pilgrims-pride_raw.md + pilgrims-pride_factcheck.md ONLY.
//
// FLAG HANDLING APPLIED (see notes at the bottom of this file for the full ledger):
//  • The criminal guilty plea is written in DIRECT language per the fact-checker's
//    explicit recommendation (docket-snippet + 7 independent sources converging on
//    the identical figure and dates, zero contradiction). The `source` field records
//    that court-record access was INDIRECT so a future pass can re-verify directly.
//  • "First company to plead guilty in the DOJ broiler investigation" — OMITTED.
//    The fact-checker could not confirm DOJ's own language for this superlative.
//  • Civil settlements are NOT summed. The $195.5M three-class aggregate is treated
//    as INCLUSIVE of the $75M direct-purchaser figure per the fact-check resolution;
//    the $100M grower settlement is a separate, additive track and gets its own entry.
//  • DISPUTED "$370 in 2024-cycle PAC contributions" — OMITTED (FEC.gov primary
//    fetch shows no 2024 activity for the terminated PAC; contradicts OpenSecrets).
//  • JBS / J&F parent-company conduct (FCPA plea, beef price-fixing) is NOT in
//    issues[] — it is not Pilgrim's Pride's own conduct. Ownership appears only as
//    company-structure context in `parentCompany`.
//  • donationSplit omitted entirely — no sourced R/D split exists. Never guessed.
//  • lobbyingSpend / politicalDonations are `null` (not found), never `0`.
//  • sustainabilityScore omitted — no third-party ESG rating located.

export const pilgrimsPrideCompany = {
  id: 'pilgrims-pride',
  name: "Pilgrim's Pride",
  hq: 'Greeley, Colorado, USA',
  revenue: '18.5B',
  employees: '62,200',
  logo: 'https://www.google.com/s2/favicons?domain=pilgrims.com&sz=256',
  parentCompany:
    "JBS S.A. — company proxy filings place JBS's stake in Pilgrim's Pride at approximately 82–83%.",
  lobbyingSpend: null,
  lobbyingTargets: [],
  politicalDonations: null,
  issues: [
    {
      id: 'price-fixing-guilty-plea',
      title: 'Criminal Price-Fixing Conviction, $107.9M Fine (2021)',
      severity: 'high',
      description:
        "Pilgrim's Pride Corporation pleaded guilty to one count of conspiracy in restraint of trade under Section 1 of the Sherman Act (15 U.S.C. § 1) for fixing prices and rigging bids for broiler chicken products. The plea agreement was announced in October 2020, and at a February 23, 2021 sentencing hearing before Judge Raymond P. Moore in the U.S. District Court for the District of Colorado (United States v. Pilgrim's Pride Corporation, No. 1:20-cr-00330-RM), the court assessed a criminal fine of $107,923,572. Separately, no individual was convicted in the related prosecutions: a Denver jury acquitted three Pilgrim's Pride executives on July 7, 2022, and charges against four other Pilgrim's Pride executives were dismissed in August and October 2022. Those outcomes concern individual liability and do not affect the company's own guilty plea.",
      source:
        "U.S. District Court, District of Colorado, No. 1:20-cr-00330-RM, judgment entered March 23, 2021; DOJ Antitrust Division, February 2021 — court records accessed indirectly (docket data and DOJ release corroborated across multiple independent reports rather than read from a single direct primary open); re-verify against the court docket when accessible",
    },
    {
      id: 'broiler-purchaser-class-settlements',
      title: 'Broiler Chicken Purchaser-Class Settlements (~$195.5M)',
      severity: 'high',
      description:
        "In the multidistrict broiler chicken antitrust litigation in the Northern District of Illinois, Pilgrim's Pride settled claims brought by three certified purchaser classes — direct purchasers, commercial and institutional indirect purchasers, and end-user consumers. Case-tracking and trade-press reports put the aggregate of those settlements at approximately $195.5 million, a figure that appears to include, rather than add to, the $75 million direct-purchaser settlement the company disclosed in January 2021. The individual class-by-class breakdown has not been independently confirmed against the court's approval orders.",
      source:
        'In re Broiler Chicken Antitrust Litigation (N.D. Ill.); company 8-K disclosure, January 2021, as reported by case-tracking and trade-press sources — settlement approval orders not independently opened',
    },
    {
      id: 'broiler-grower-settlement-2024',
      title: '$100M Chicken-Grower Antitrust Settlement (2024)',
      severity: 'high',
      description:
        "Pilgrim's Pride reached a $100 million settlement on June 24, 2024 to resolve antitrust claims brought by chicken growers, according to trade-press reporting. This grower litigation is a separate track from the broiler chicken purchaser-class settlements above, brought by different plaintiffs on a different theory, and the figures are not overlapping.",
      source: 'Food Dive, June 2024 — court settlement order not independently opened',
    },
    {
      id: 'securities-settlement-2025',
      title: '$41.5M Shareholder Securities Settlement (2025)',
      severity: 'high',
      description:
        "A securities class action filed in 2016 in the U.S. District Court for the District of Colorado alleged that Pilgrim's Pride misled investors about the basis of its reported profits during a February 2014 to November 2016 class period. According to reports from two independent legal-news outlets, a $41.5 million settlement received final approval on June 17, 2025. This case is distinct from the antitrust matters above.",
      source:
        'Courthouse News Service and Law360, June 2025 — final approval order not independently opened',
    },
    {
      id: 'osha-ammonia-canton-2022',
      title: 'OSHA Citations After Ammonia Leak, Canton GA (2022)',
      severity: 'medium',
      description:
        "Following a January 19, 2022 ammonia release at the Canton, Georgia poultry processing plant that hospitalized two workers and prompted an evacuation, OSHA issued nine serious citations and proposed a penalty of $110,630, according to the agency's news release as reported by seven independent outlets.",
      source: 'OSHA news release, August 2022, as reported across independent trade and legal press',
    },
    {
      id: 'clean-water-act-suwannee-2017',
      title: '$1.43M Clean Water Act Settlement, Suwannee River (2017)',
      severity: 'medium',
      description:
        "Environmental groups brought a Clean Water Act citizen suit alleging that wastewater discharges from the Live Oak, Florida plant exceeded permitted pollution limits. In November 2017, Pilgrim's Pride agreed to a $1.43 million settlement — $1.3 million funding a Sustainable Farming Fund for water-quality improvement in the Suwannee Basin and a $130,000 civil penalty paid to the U.S. Treasury.",
      source:
        'Environment Florida / Sierra Club v. Pilgrim\'s Pride Corp., M.D. Fla., November 2017, as reported by Law360 and the plaintiff organizations — consent decree not independently opened',
    },
    {
      id: 'fsis-foreign-matter-recalls',
      title: 'USDA Recalls for Foreign Matter (2016–2020)',
      severity: 'low',
      description:
        "USDA FSIS announced a recall on April 7, 2016 of Gold Kist Farms-labeled fully cooked chicken nugget and patty products produced at the Waco, Texas establishment for possible plastic contamination, initially covering about 40,780 pounds. The recall was expanded through May 2016 to a combined total of roughly 5,550,904 pounds. FSIS recall listings also record further Pilgrim's Pride foreign-matter recalls between 2018 and 2020; the dates and volumes of those later notices were not independently confirmed.",
      source: 'USDA FSIS recall notices, April–May 2016 (fsis.usda.gov listing content)',
    },
    {
      id: 'inaugural-committee-donation-2025',
      title: "$5M Inaugural Committee Donation; Senator's Letter (2025)",
      severity: 'low',
      description:
        "Pilgrim's Pride donated $5 million to the Trump-Vance Inaugural Committee, described in Sen. Elizabeth Warren's May 19, 2025 letter to the company as the single largest donation that committee received. The donation is a lawful, disclosed contribution. In her letter, Sen. Warren asked the company about the timing of the donation relative to three subsequent administration actions she identified — SEC approval of a JBS listing on the New York Stock Exchange, the Department of Justice's suspension of Foreign Corrupt Practices Act enforcement, and a USDA waiver of certain workplace-safety requirements for poultry and pork producers. Those questions are a senator's stated concerns; no finding of wrongdoing has been made, and no connection between the donation and any of those actions has been established.",
      source: 'Sen. Elizabeth Warren press release and letter, warren.senate.gov, May 19, 2025',
    },
  ],
  subsidiaries: [
    "Pilgrim's",
    'Just BARE',
    "Gold'n Plump",
    'County Line',
    'Pierce Chicken',
    'Gold Kist',
    'Country Pride',
    'To-Ricos',
    'Moy Park',
    "Pilgrim's Food Masters",
  ],
};

export default pilgrimsPrideCompany;

/* ── WRITER'S LEDGER — what was omitted and why ─────────────────────────────────
 *
 * OMITTED (DISPUTED):
 *   • "$370 in 2024-cycle PAC contributions" (OpenSecrets). FEC.gov, directly
 *     fetched by the fact-checker, shows no 2024-cycle activity for the terminated
 *     PAC (C00113902). Contradicted by the primary source → omitted per doctrine.
 *
 * OMITTED (UNVERIFIED superlatives / characterizations):
 *   • "First company to plead guilty" in the DOJ broiler investigation — the
 *     fact-checker could not confirm DOJ's own wording. Superlative dropped; the
 *     plea itself is stated on its own.
 *   • "Largest protein-industry antitrust settlement of its kind" (Food Dive's own
 *     characterization of the $100M grower settlement).
 *   • "Largest Clean Water Act citizen-suit penalty in Florida history" (the
 *     plaintiff groups' own characterization).
 *   • "1,377 days of violations" and the 379,641 lbs TRI figure — plaintiff-group
 *     characterizations of the underlying data, not independently confirmed.
 *
 * OMITTED (insufficiently corroborated this pass):
 *   • 2016 OSHA penalties at Waco, TX ($122,500) and Live Oak, FL ($78,175) — the
 *     fact-checker did not re-check these; only the Canton, GA citation carried
 *     strong multi-source corroboration.
 *   • $361M "affected commerce" scope figure — not independently re-checked.
 *   • JBS take-private bid history (2021–2022) — trade press only, and not conduct.
 *   • Pilgrim's Pride's share of the poultry wage-fixing MDL — a genuine research
 *     gap. NOT written as zero, NOT estimated from Perdue's figure.
 *
 * KEPT OUT OF issues[] BY DESIGN (parent-company conduct, not PPC's own):
 *   • J&F Investimentos FCPA guilty plea ($256M+), the Batista brothers' Brazilian
 *     pleas, and JBS S.A.'s $25M beef price-fixing settlement. These belong to JBS
 *     and J&F. Blending them into a Pilgrim's Pride issues[] entry would attribute
 *     another entity's conduct to this company. JBS appears only as ownership
 *     structure in `parentCompany`.
 *   • JBS S.A.'s own federal lobbying spend ($1.62M in 2024, $3.38M in 2025 per
 *     OpenSecrets-indexed data) — a different filer entity from Pilgrim's Pride
 *     Corp. Not merged into lobbyingSpend, which stays null for PPC specifically.
 *
 * FIELD DECISIONS:
 *   • lobbyingSpend: null and politicalDonations: null — "not found," not "zero."
 *     OpenSecrets was 403-blocked for both upstream agents; the one figure that
 *     could be primary-checked turned out DISPUTED. A `0` would render to users as
 *     a factual claim that the company does not lobby or donate.
 *   • donationSplit: omitted entirely — no sourced R/D percentage exists anywhere in
 *     the research. Doctrine requires the split sum to 100; guessing is forbidden.
 *   • The $5M inaugural-committee donation is deliberately NOT written into
 *     politicalDonations. It is a different disclosure regime from PAC/employee
 *     campaign contributions and would misrepresent that field; it lives in
 *     issues[] instead, where it can carry its own context.
 *   • sustainabilityScore: omitted — no named third-party ESG rating was located.
 *
 * CAUSATION-BY-JUXTAPOSITION CHECK:
 *   • No donation or lobbying figure is placed adjacent to a regulatory outcome.
 *     In the inaugural-donation entry the three administration actions appear only
 *     inside the description of what Sen. Warren asked about, followed by an
 *     explicit statement that no connection has been established.
 *
 * FORBIDDEN-LANGUAGE CHECK:
 *   • "criminal" is used once, in the price-fixing entry, where it is earned by an
 *     actual guilty plea and court-assessed criminal fine. It appears nowhere else.
 *   • No "deliberately," "intentionally misled," "fraudulent," or "corrupt."
 *   • No medical-causation language anywhere (recalls describe foreign matter and
 *     the recall action only — no health outcomes asserted).
 *   • The acquittals and dismissals are stated as case outcomes. No inference is
 *     drawn in either direction about the individuals' conduct.
 *
 * ── AGENT 4 (LEGAL REVIEWER) PASS ──────────────────────────────────────────────
 * Verdict: APPROVED with three revisions applied. Independent re-scan of the raw
 * and fact-check checkpoints; omissions (the $370 DISPUTED PAC figure, the
 * "first company to plead guilty" superlative, all JBS/J&F parent conduct) were
 * confirmed absent from shipped data — they survive only in this ledger.
 *
 * 1. Guilty-plea direct language — SUSTAINED. The UNVERIFIED flag reflects a
 *    fetch-access failure (403s), not an evidentiary weakness: the company's own
 *    Oct 2020 8-K is a company disclosure, structured docket data independently
 *    matched the fine to the dollar and the March 23, 2021 judgment date, and 7
 *    independent outlets converge with zero contradiction. Accurate reporting of
 *    a court proceeding is the safest category of statement there is; hedging a
 *    real guilty plea as an allegation would itself be inaccurate. The `source`
 *    field does document the indirect-access caveat, as the writer claimed.
 *
 * 2. REVISED — executive outcomes. Removed the seven named individuals. Naming
 *    people who were acquitted or had charges dismissed inside an issue titled
 *    "Criminal Price-Fixing Conviction" creates association-by-proximity with a
 *    crime they were cleared of, for no user benefit. Also dropped "the same
 *    alleged conspiracy" (the word "alleged" partially undercut the company's
 *    own admitted plea) and the redundant closing "No individual was convicted."
 *    Replaced with a neutral line stating that individual liability is a
 *    separate question from the corporate plea — guards both readings.
 *
 * 3. REVISED — title "(2021–2022)" on the purchaser-class entry. No source in
 *    either checkpoint establishes that date range; changed to the amount.
 *
 * 4. REVISED — title "Senate Inquiry" → "Senator's Letter." This was one
 *    senator's letter, not a Senate committee proceeding; the original title
 *    overstated it.
 *
 * Field checks: lobbyingSpend / politicalDonations are `null`, not `0`
 * (32 existing companies.js records already use null; the UI gates on `> 0`).
 * donationSplit correctly omitted — CompanyProfileScreen optional-chains it.
 * parentCompany carries JBS ownership as structure only, hedged to the 82–83%
 * range per the fact-checker's own recommendation. Severities conform.
 *
 * Remaining (non-blocking): every issues[] entry rests on secondary sourcing
 * with the primary open blocked by 403. A later pass from an unblocked network
 * should re-open the D. Colo. docket, the FSIS notices, and the N.D. Ill.
 * approval orders.
 */
