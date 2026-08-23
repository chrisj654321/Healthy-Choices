// Glanbia — Legal Writer final money-trail fields (Agent 3)
// Parent: Glanbia plc (Irish). US entity: Glanbia Performance Nutrition / Glanbia Nutritionals.
// Every field below traces to a VERIFIED flag in glanbia_factcheck.md. UNVERIFIED / STALE / DISPUTED items omitted.

module.exports = {
  // Lobbying — VERIFIED via lda.gov primary API (registrant Miller & Chevalier, Q4 2017 LD-2, income $10,000).
  // Most recent verified figure; later cycles show no confirmed filings.
  lobbyingSpend: 10000,
  lobbyingSpendYear: 2017,
  lobbyingSource: 'Senate LDA, 2017',
  lobbyingTargets: ['Dairy industry policy'],

  // Donations — GPN PAC (FEC C00543090) terminated with $0 receipts in the 2019–2020 cycle.
  // Not FEC-confirmed as an active donor, so assert null rather than 0.
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,

  issues: [
    {
      id: 'glanbia-osha-westhaven-burn-2021',
      title: 'OSHA Serious Violation — Worker Burn Injury',
      severity: 'low',
      description:
        'After a worker cleaning a tank at the Glanbia Nutritionals plant in West Haven, Connecticut was hospitalized in April 2021 with second-degree burns from a hot-water release, OSHA opened an inspection and issued three serious citations. One citation was upheld on review for a final penalty of $13,653; the other two were reduced or vacated to $0.',
      source: 'OSHA.gov Inspection #1525146.015, 2021',
    },
  ],
};

// OMITTED (with reason):
// - 2022 FDA warning letter: RETRACTED — FDA misidentified Glanbia and withdrew the letter. Never published, any framing.
// - 2002 FDA warning letter (stevia/soy claim): STALE (pre-2020). Accurate but excluded from a current profile.
// - 2015 Citeline "misbranded protein bars": UNVERIFIED (paywalled trade press, no primary FDA document).
// - Class actions (Daly/think!, Hacker, Tocci/Isopure protein-spiking, Bergman vanilla, Isopure slack-fill):
//   all ALLEGED, none adjudicated or settled. Omitted (labeling/consumer suits, not defensible as material).
// - Second OSHA inspection (#1514325.015), FTC/EPA/NLRB "clean" claims: UNVERIFIED negatives. Omitted.
