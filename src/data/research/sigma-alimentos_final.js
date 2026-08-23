// Money-trail fields for Sigma Alimentos (Mexico, part of Alfa SAB) — US subsidiary Bar-S Foods Co. (Phoenix, AZ)
// Legal Writer (Agent 3). Flags applied from sigma-alimentos_factcheck.md. Write-as-if-it-ships.
{
  // Lobbying — Senate LDA absence VERIFIED (both "Bar-S" and "Sigma Alimentos" queries returned 0 reports).
  lobbyingSpend: 0,
  lobbyingTargets: [],
  lobbyingSpendYear: 2026,
  lobbyingSource: 'Senate LDA (no registrant), 2026',

  // Donations — FEC PAC search was UNVERIFIED (FEC bulk API rate-limited / HTTP 429 this pass).
  // null = "not confirmed," NOT zero.
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,

  issues: [
    {
      id: 'bar-s-listeria-recall-2016',
      title: 'Recall — Listeria Risk in Hot Dogs and Corn Dogs',
      severity: 'medium',
      description:
        'In July 2016 Bar-S Foods recalled about 372,684 lbs of ready-to-eat chicken and pork hot dog and corn dog products, shipped nationwide, for possible Listeria monocytogenes contamination. FSIS stated the recall followed "recurring Listeria species issues at the firm" and was taken as a precautionary measure. No confirmed illnesses were reported.',
      source: 'USDA FSIS recall notice, July 2016',
    },
  ],
}

// Omitted per flag mapping:
// - Lawton, OK OSHA fatality ($7,000, 2011): STALE (pre-2020) and minor single citation; omitted from a current profile.
// - Altus, OK OSHA COVID-19 fatality (2020): UNVERIFIED (inspection ID not re-fetched, no citations/penalties in record);
//   also a COVID infection with no adjudicated violation — omitted to avoid an unsupported causation claim.
// - 2010 acquisition / FTC review: neutral corporate history and inconclusive; not an issue.
