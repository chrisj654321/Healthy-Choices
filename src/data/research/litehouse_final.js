// Litehouse, Inc. — money-trail fields (Agent 3, Legal Writer)
// Sources: litehouse_raw.md + litehouse_factcheck.md
// Senate LDA VERIFIED zero registrant. FEC unverifiable -> politicalDonations null.
// Allergen items folded into ONE medium issue: documented undeclared-allergen recalls
//   culminating in the Nov 29, 2023 FDA Warning Letter (all VERIFIED, government-primary-sourced).

lobbyingSpend: 0,
lobbyingTargets: [],
lobbyingSpendYear: 2026,
lobbyingSource: 'Senate LDA (no registrant), 2026',
politicalDonations: null, // FEC committee search JS-rendered, zero-result not confirmable against a primary source
donationSplit: null,
donationSplitYear: null,
donationSplitSource: null,
issues: [
  {
    id: 'allergen-labeling-fda-warning-2023',
    title: 'Undeclared-Allergen Recalls and 2023 FDA Warning Letter',
    severity: 'medium',
    description:
      'The FDA issued Litehouse, Inc. a Warning Letter dated November 29, 2023 (reference MARCS-CMS 662949) citing misbranding under section 403(w) of the Federal Food, Drug, and Cosmetic Act for failure to declare the major allergen soy on a finished product label. The letter followed an April 19, 2023 recall of Simple Truth Plant Based Ranch Dressing (Class II), which the company traced to work-in-progress bulk containers that were mislabeled and actually held soy-containing Caesar dressing. This was part of a documented pattern of undeclared-allergen recalls: in February 2021 the company also recalled Brite Harbor Caesar Dressing & Dip (Class II) for undeclared anchovies. Both recalls are listed as terminated in the FDA enforcement record.',
    source:
      'FDA Warning Letter MARCS-CMS 662949 (Nov 29, 2023), https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/litehouse-inc-662949-11292023; openFDA Food Enforcement API, https://api.fda.gov/food/enforcement.json?search=recalling_firm:%22Litehouse%22 (April 19, 2023 soy recall and Feb 2021 anchovies recall)',
  },
],
// OMITTED: 2017 OPA by Litehouse undeclared-egg recall — real and VERIFIED but STALE (pre-2020).
// OMITTED: April 2025 OSHA inspection — CLOSED with no citation data present in the public record; no finding to state.
// OMITTED: Cassar v. Litehouse (Dec 2025) — unproven civil complaint, secondary sources only; allegation, not fact.
// OMITTED: possible Sept 2021 Class I anchovies recall — flagged by fact-checker but not confirmed in the raw research; unverified recall not included.
// OMITTED (absence findings): FTC "none found" — negative claim, no queried-URL evidence; nothing to state.
