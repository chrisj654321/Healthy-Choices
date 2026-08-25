// Money-trail fields for Arca Continental (Mexico) — US subsidiaries Wise Foods, Inc. (Berwick, PA) + Deep River Snacks
// Legal Writer (Agent 3). Flags applied from arca-continental_factcheck.md. Write-as-if-it-ships.
{
  // Lobbying — Senate LDA absence VERIFIED (both "Wise Foods" and "Arca Continental" queries returned 0 reports;
  // the "Continental Strategy, LLC" filings were a confirmed name-similarity false positive, excluded).
  lobbyingSpend: 0,
  lobbyingTargets: [],
  lobbyingSpendYear: 2026,
  lobbyingSource: 'Senate LDA (no registrant), 2026',

  // Donations — FEC PAC search was UNVERIFIED (FEC committee search JS-rendered / bulk API rate-limited this pass).
  // null = "not confirmed," NOT zero.
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,

  issues: [
    {
      id: 'wise-foods-osha-berwick-2018',
      title: 'OSHA Citations — Berwick Plant Safety Violations',
      severity: 'medium',
      description:
        'In 2018 OSHA cited Wise Foods\' Berwick, PA plant for six serious violations following a complaint-based inspection. The initial penalty of $36,584 was reduced to $25,609 through an informal settlement. The cited standards covered machine guarding and electrical safety.',
      source: 'OSHA inspection record #1320417.015, 2018',
    },
  ],
}

// Omitted per flag mapping:
// - "Wise Company" / ReadyWise survival-food litigation (Miller v. Wise Company): a DISTINCT, unrelated entity;
//   excluded to avoid misattribution (fact-check confirmed the guard held).
// - Cheddar & Sour Cream artificial-flavoring class action (2020-21): DISMISSED (consumer-unlikely-to-be-misled); omitted.
// - Alce slack-fill class action: DISMISSED March 2018; omitted.
// - NLRB Case 06-CA-035278 (2006): unadjudicated allegations, no disposition in the public record, and STALE; omitted.
