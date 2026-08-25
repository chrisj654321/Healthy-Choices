// Bellisio Foods, Inc. — Legal Writer final money-trail fields (Agent 3)
// Parent: Charoen Pokphand Foods PCL (Thailand), since Jan 2017. US brands: Michelina's, Boston Market (frozen), Atkins (frozen).
// Every field below traces to a VERIFIED flag in bellisio-foods_factcheck.md. UNVERIFIED / STALE / DISPUTED items omitted.

module.exports = {
  // Lobbying — VERIFIED true zero: lda.gov API returns count 0 for "Bellisio" (no registrant, ever).
  // The search-summary LD-2 claim (plant-based labeling / FDA / SNAP / sodium) is DISPUTED and omitted.
  lobbyingSpend: 0,
  lobbyingSpendYear: null,
  lobbyingSource: 'Senate LDA (no registrant), 2026',
  lobbyingTargets: [],

  // Donations — VERIFIED zero: FEC committee-name search "Bellisio" returns an empty result set. No PAC found.
  politicalDonations: 0,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: 'FEC (no committee), 2026',

  issues: [
    {
      id: 'bellisio-brucepac-listeria-recall-2024',
      title: 'Chicken Product Recall — Possible Listeria',
      severity: 'medium',
      description:
        'In October 2024 Bellisio Foods issued a voluntary recall of certain Boston Market, Michelina’s, and Atkins products that contained chicken from BrucePac, a third-party supplier. The recall followed BrucePac’s own recall of ready-to-eat meat and poultry after routine USDA testing found possible Listeria monocytogenes contamination at a BrucePac facility. Bellisio said it stopped using ingredients from that facility. No confirmed adverse-reaction reports were listed at the time of the notice.',
      source: 'FSIS/USDA recall notice (Recall-028-2024), 2024',
    },
    {
      id: 'bellisio-undeclared-soy-recall-2021',
      title: 'Undeclared Soy Allergen Recall',
      severity: 'low',
      description:
        'In May 2021 Bellisio Foods recalled about 3,927 pounds of "Michelina’s Spaghetti with Meat Sauce" because soy-containing ingredients may have mixed into a product that does not normally contain soy, and the soy was not declared on the label. No confirmed adverse-reaction reports were listed at the time of the notice.',
      source: 'FSIS/USDA recall notice, 2021',
    },
  ],
};

// OMITTED (with reason):
// - Dec 2015 foreign-matter recall and Feb 2019 glass/plastic recall: VERIFIED but STALE (pre-2020). Excluded from a current profile.
// - Peoples v. Bellisio Foods (2:19-cv-05640, S.D. Ohio, filed 2019): UNVERIFIED and STALE, ALLEGED employment claim, no primary complaint text. Omitted.
// - Search-summary LD-2 lobbying filing: DISPUTED, contradicted by the primary zero-result LDA API. Omitted.
