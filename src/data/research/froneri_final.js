// Froneri US, Inc. — Legal Writer final money-trail fields (Agent 3)
// US operating entity: Dreyer's Grand Ice Cream, Inc. Brands: Dreyer's/Edy's, Häagen-Dazs US, Drumstick, Outshine.
// Structure: Nestlé / PAI Partners 50/50 joint venture. Parent Nestlé's lobbying/PAC is a separate entity's disclosure and is NOT attributed here.
// Every field below traces to a VERIFIED flag in froneri_factcheck.md. UNVERIFIED / STALE / DISPUTED / open-allegation items omitted (see bottom).

module.exports = {
  // Lobbying — VERIFIED true zero: Senate LDA API returns no registrant and no client filing for "Froneri" (all-time),
  // and none for "Dreyer's Grand Ice Cream" since 2004. The 2002–2004 Dreyer's filings are STALE (pre-2020) and omitted.
  lobbyingSpend: 0,
  lobbyingSpendYear: null,
  lobbyingSource: 'Senate LDA (no registrant), 2026',
  lobbyingTargets: [],

  // Donations — UNVERIFIED: FEC/OpenSecrets could not be independently read this pass (API rate-limited).
  // Not publishable as a zero. Left null — no claim either way.
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,

  issues: [
    {
      id: 'froneri-product-recalls-2023-2026',
      title: 'Pattern of Product Recalls',
      severity: 'medium',
      description:
        'Froneri’s US business, Dreyer’s Grand Ice Cream, has issued several voluntary recalls in recent years. In August 2026 it recalled select Outshine Fruit Bars nationwide because the bars might contain small pieces of glass; the recall was company-initiated and no injuries were reported. In November 2025 it recalled Häagen-Dazs Chocolate Dark Chocolate Mini Bars because the label did not declare wheat, a common allergen (FDA Class II). In July 2023 it recalled Outshine No Sugar Added Strawberry Fruit Bars because the label did not declare milk, a common allergen (FDA Class II). Each recall was voluntary.',
      source: 'FDA enforcement reports F-1365-2023 and H-0227-2026; Dreyer’s/PR Newswire recall notice, 2023–2026',
    },
    {
      id: 'froneri-caosha-bakersfield-2023',
      title: 'Workplace Safety Citation',
      severity: 'low',
      description:
        'In 2023 California workplace-safety regulators (Cal/OSHA) inspected the Dreyer’s Grand Ice Cream plant in Bakersfield, California. The inspection resulted in one Serious citation and one Other citation, with a total penalty of $5,060. The case is closed.',
      source: 'Cal/OSHA (OSHA IMIS inspection 1651298.015), 2023',
    },
  ],
};

// OMITTED (with reason):
// - Bloomberg July 2026 sanitation report / alleged Feb 2026 Form 483 (Bakersfield): UNVERIFIED. No primary FDA record
//   (483 text, Inspection Classification Database entry, or warning letter) could be confirmed; source traces only to a
//   paywalled article and a paid document-store index listing. Not published under any framing.
// - NLRB case 31-CA-374204: a single OPEN, unadjudicated unfair-labor-practice charge (an allegation, not a finding). Omitted.
// - The other 7 NLRB filings (2022–2026): all closed short of any litigated Board finding of merit (settlement, RD orders,
//   a lost election, a GC dismissal, two withdrawals). No adjudicated wrongdoing — omitted.
// - Outshine glass-recall FDA classification (Class I/II/III): not yet assigned in FDA’s public enforcement database as of
//   2026-08-23; no class asserted for that recall above.
// - Nov 2025 wheat recall state count: the raw doc’s "29-state" distribution is UNVERIFIED against openFDA (which lists CA/KY/OH/WI);
//   the state count is therefore omitted from the description rather than asserted.
// - 2002–2004 Dreyer's LDA filings: VERIFIED but STALE (pre-2020). Excluded from a current lobbying figure.
// - FTC antitrust matter (docket 0210174, 2002): STALE and pre-dates the Froneri entity. Omitted.
// - Parent Nestlé lobbying/PAC: separate legal entity; not attributed to Froneri per pipeline rule.
