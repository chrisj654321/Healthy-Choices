// Bolthouse Farms — Legal Writer final money-trail fields (Agent 3)
// Wm. Bolthouse Farms, Inc. (Bakersfield, CA) — carrots, refrigerated juices, dressings, smoothies. Ownership per brief: Butterfly Equity (not reconfirmed this pass).
// Every field below traces to a VERIFIED flag in bolthouse-farms_factcheck.md. UNVERIFIED / STALE / ALLEGED items omitted.

module.exports = {
  // Lobbying — VERIFIED true zero: lda.gov API returns count 0 for "Bolthouse" (no registrant, ever).
  lobbyingSpend: 0,
  lobbyingSpendYear: null,
  lobbyingSource: 'Senate LDA (no registrant), 2026',
  lobbyingTargets: [],

  // Donations — UNVERIFIED this pass (FEC name search was rate-limited, not a clean zero). Assert null, not 0.
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,

  issues: [
    {
      id: 'bolthouse-prop65-cadmium-settlement-2025',
      title: 'Prop 65 Cadmium Settlement',
      severity: 'low',
      description:
        'In February 2025 a private enforcer filed a California Proposition 65 notice alleging that the cadmium level in "Bolthouse Farms Immunity Juice – Carrot, Turmeric, Ginger" was above the state warning threshold. Bolthouse Farms settled the matter in October 2025. The signed settlement set a $3,000 civil penalty plus $24,500 in attorney’s fees and costs, a total of $27,500, and required point-of-sale warnings and a stop to sale of the product at issue. Proposition 65 is a California labeling and exposure-warning law; the settlement resolves a warning-label matter and is not a finding that the product caused harm.',
      source: 'California OAG Prop 65 settlement (AG# 2025-00655), 2025',
    },
  ],
};

// OMITTED (with reason):
// - June 2016 protein-drink recall (~3.8M bottles): UNVERIFIED against a primary FDA record this pass (factcheck flagged it uncertain). Omitted per brief.
// - Oct-Nov 2012 Salmonella carrot-chip recall: STALE (pre-2020). Omitted from a current profile.
// - PFAS class actions (Tate 1:23-cv-01038, Smith 2:23-cv-00373): ALLEGED, not adjudicated. Omitted.
// - Felix v. Bolthouse (1:19-cv-00312): UNVERIFIED nature of claims, pre-2020. Omitted.
// - OSHA inspection IDs: UNVERIFIED — inspection records exist but no citation/penalty detail; an inspection alone is not a violation. Omitted.
