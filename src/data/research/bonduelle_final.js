// Bonduelle — Legal Writer final money-trail fields (Agent 3)
// Parent: Bonduelle Group (French, family-controlled). US entities: Bonduelle Fresh Americas / Ready Pac Foods; Bonduelle USA Inc.
// Every field below traces to a VERIFIED flag in bonduelle_factcheck.md. UNVERIFIED / STALE items omitted.

module.exports = {
  // Lobbying — VERIFIED true zero: lda.gov API returns count 0 for both "Bonduelle" and "Ready Pac" (no filings, ever).
  lobbyingSpend: 0,
  lobbyingSpendYear: null,
  lobbyingSource: 'Senate LDA (no registrant), 2026',
  lobbyingTargets: [],

  // Donations — foreign parent, no US PAC found. The FEC "READY PAC" (C00540997) is an unrelated, coincidentally-named committee.
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,

  issues: [
    {
      id: 'readypac-listeria-recall-2024',
      title: 'Salad-Kit Recall — Possible Listeria',
      severity: 'medium',
      description:
        'Ready Pac Foods recalled four salad-kit products in February 2024 over potential Listeria monocytogenes contamination, after its cheese supplier, Rizo-López Foods, reported that the cheese ingredient was believed contaminated. The recall covered about 15,751 cases; no illnesses were reported at the time of the notice.',
      source: 'FDA.gov recall notice, 2024',
    },
    {
      id: 'readypac-chicken-salad-recall-2017',
      title: 'Chicken Salad Recall — Possible Listeria',
      severity: 'low',
      description:
        'Ready Pac Foods recalled about 59,225 pounds of "Puro Picante Blazin Hot" chicken salad in February 2017 over possible Listeria monocytogenes contamination traced to a cheese supplier that had recalled its own product. No confirmed illnesses were reported.',
      source: 'FSIS/USDA recall notice, 2017',
    },
  ],
};

// OMITTED (with reason):
// - 2015 Bonduelle USA frozen-corn Listeria recall: STALE (pre-2020). Omitted from a current profile.
// - OSHA $43,000 penalty (Oakfield, NY, 2017): UNVERIFIED — dollar figure sourced only from a secondary tracker snippet.
// - $715,000 California wage-and-hour settlement: UNVERIFIED — no case number or court located; settlement-site source only.
// - Two additional FSIS misbranding/allergen recalls, apple-slice recall: UNVERIFIED (not opened / sourcing unresolved).
// - EPA/FTC/NLRB "clean" claims: UNVERIFIED negatives. Omitted.
