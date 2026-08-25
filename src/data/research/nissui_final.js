// Money-trail fields for Nissui Corporation (Japan) — US subsidiary Gorton's, Inc. / Slade Gorton & Co., Inc. (Gloucester, MA)
// Legal Writer (Agent 3). Flags applied from nissui_factcheck.md. Write-as-if-it-ships.
{
  // Lobbying — Senate LDA absence VERIFIED (both "Gorton" and "Nissui" queries returned 0 reports).
  lobbyingSpend: 0,
  lobbyingTargets: [],
  lobbyingSpendYear: 2026,
  lobbyingSource: 'Senate LDA (no registrant), 2026',

  // Donations — FEC PAC search was UNVERIFIED (FEC committee search JS-rendered / bulk API unreachable this pass).
  // null = "not confirmed," NOT zero.
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,

  issues: [
    {
      id: 'gortons-fish-sandwich-recall-2022',
      title: 'Voluntary Recall — Bone Fragments in Fish Sandwich',
      severity: 'low',
      description:
        'In 2022 Gorton\'s voluntarily recalled a small quantity of Fish Sandwich 100% Whole Fillets (18.3 oz) for the potential presence of large or sharp bone fragments, a choking hazard. The product was distributed to retailers including Hannaford and Giant. No injuries were reported.',
      source: 'FDA.gov recall notice, 2022',
    },
    {
      id: 'slade-gorton-salmon-listeria-2026',
      title: 'Voluntary Recall — Listeria Risk in Salmon',
      severity: 'low',
      description:
        'In February 2026 Slade Gorton & Co. voluntarily recalled one lot of Wellsley Farms Farm-Raised Atlantic Salmon (2-lb bags) sold at BJ\'s Wholesale Club after FDA random sampling detected potential Listeria monocytogenes. The recall covered seven states. No illnesses were reported.',
      source: 'FDA.gov recall notice, 2026',
    },
  ],
}
