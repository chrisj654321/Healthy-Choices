// R.M. Palmer Co. — money-trail fields (Agent 3, Legal Writer)
// Sources: rm-palmer_raw.md + rm-palmer_factcheck.md
// Fact-check superseded the news figures with a direct OSHA docket pull: 10 citations,
//   $65,464 final penalty, case CLOSED via formal settlement (OSHA-primary-only — no
//   independent news confirmed the settlement; stated factually and neutrally below).
// NTSB probable cause is attributed to the NTSB in its own voice — the app does not assert
//   the company "caused" the deaths. Civil suits are ALLEGED/PENDING and hedged; UGI and
//   DuPont are also named defendants (no sole-fault implication).
// Lobbying and PAC data UNVERIFIED (LDA + OpenFEC primary access blocked both passes) → null.

lobbyingSpend: null, // LDA primary DB access blocked both passes; search-based absence, not a confirmed zero
lobbyingTargets: [],
lobbyingSpendYear: null,
lobbyingSource: null,
politicalDonations: null, // OpenFEC primary access blocked both passes; no PAC found, but not a certified negative
donationSplit: null,
donationSplitYear: null,
donationSplitSource: null,
issues: [
  {
    id: 'west-reading-explosion-2023',
    title: '2023 West Reading Plant Explosion (7 Killed)',
    severity: 'high',
    description:
      'On March 24, 2023, a natural gas explosion at R.M. Palmer\'s West Reading, Pennsylvania plant killed 7 workers and injured 10, with about $42 million in property damage. The NTSB determined the probable cause was the degradation of a retired underground polyethylene gas service tee, which let gas migrate into the buildings; the NTSB also identified the company\'s insufficient emergency-response procedures and employee training as a contributing factor, noting that workers who smelled gas did not evacuate before the blast. After the explosion, OSHA cited the company for 10 violations; the company entered a formal settlement and the final penalty was $65,464 (OSHA inspection 1659063.015, case closed). Families of the victims have filed wrongful-death lawsuits, which were pending as of 2025; the gas utility UGI and DuPont are also named as defendants.',
    source:
      'NTSB report PIR2501 (2025); OSHA inspection 1659063.015 (closed, formal settlement); Philadelphia Inquirer, July 29 2025',
  },
],
