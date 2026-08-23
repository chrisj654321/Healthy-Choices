// Storck — Legal Writer final money-trail fields (Agent 3)
// Parent: August Storck KG (German, privately held). US entity: Storck USA L.P. (Werther's Original, Riesen, Toffifay).
// Every field below traces to a VERIFIED flag in storck_factcheck.md. UNVERIFIED items omitted.

module.exports = {
  // Lobbying — VERIFIED via lda.gov primary API: registrant Prime Policy Group, 2020 Q3 $110,000 + Q4 termination $110,000 = $220,000.
  // Strongest-sourced figure in the batch; 2020 is the last active year.
  lobbyingSpend: 220000,
  lobbyingSpendYear: 2020,
  lobbyingSource: 'Senate LDA, 2020',
  lobbyingTargets: [],

  // Donations — foreign, privately-held parent; no US PAC found. No FEC committee located.
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,

  // No adjudicated or material verified issue. FDA/OSHA: none found. Slack-fill packaging suits omitted (minor, not material).
  issues: [],
};

// OMITTED (with reason):
// - Kpakpoe-Awei v. Storck USA (S.D.N.Y., Werther's slack-fill, settled): minor slack-fill packaging suit; settlement terms
//   and the specific fill percentages are UNVERIFIED. Not defensible as a material issue. Omitted.
// - Woods v. Storck USA (C.D. Cal., Werther's ~40% slack-fill): UNVERIFIED — docket not located, filing year unconfirmed. Omitted.
// - FDA / OSHA / FTC / EPA / NLRB "none found" claims: UNVERIFIED negatives (not confirmed via clean primary-source query). Omitted.
