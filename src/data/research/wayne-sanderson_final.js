// src/data/research/wayne-sanderson_final.js
//
// /political-analysis Agent 3 (Legal Writer) checkpoint — 2026-08-06.
// Upstream: wayne-sanderson_raw.md (Agent 1) + wayne-sanderson_factcheck.md (Agent 2).
//
// This is a FULL companies.js company record (shaped like the `perdue` object
// in src/data/companies.js), not a sourcing fragment. Merge target: a new
// 'wayne-sanderson' key in the COMPANIES map. No existing id/name collision —
// grep of companies.js for "wayne"/"sanderson" returned zero hits.
//
// Flag → action mapping applied throughout (VERIFIED = direct language;
// UNVERIFIED = hedged/attributed or omitted; DISPUTED = omitted or both sides;
// STALE = explicit date caveat). Nothing here states an allegation as fact,
// asserts causation between money and regulatory outcomes, or makes a medical
// claim. Sourcing block deliberately absent — that is the sourcing-transparency
// skill's territory, not this pipeline's.

module.exports = {
  id: 'wayne-sanderson',
  name: 'Wayne-Sanderson Farms',
  hq: 'Oakwood, Georgia, USA',

  // DISPUTED between two low-reliability secondary aggregators ($8B vs $9.5B);
  // both parents are private, so no primary financial disclosure exists.
  // Fact-checker's explicit recommendation was to omit rather than pick one.
  // `null` is this dataset's established "not found" value for revenue.
  revenue: null,

  // "More than 27,000" per a dated July 2025 PRNewswire release (Harrison
  // Poultry acquisition); the company's own evergreen site page says 26,000.
  // Neither figure is corroborated outside company-issued material, so the
  // more recent dated figure is used. Not upgraded to a verified fact.
  employees: '27,000',

  logo: 'https://www.google.com/s2/favicons?domain=waynesandersonfarms.com&sz=256',

  // Added by Agent 4 for parity with the pilgrims-pride_final.js precedent,
  // which carries ownership as company-structure context in `parentCompany`
  // rather than leaving it only inside issues[]. Split is not disclosed —
  // stated as unknown, never guessed at 50/50.
  parentCompany:
    'Jointly owned by Cargill, Incorporated and Continental Grain Company through a joint venture that acquired Sanderson Farms in July 2022; the ownership percentage held by each parent has not been publicly disclosed.',

  // No federal lobbying figure could be confirmed against a primary source:
  // OpenSecrets returned HTTP 403 on direct fetch in both the research and
  // fact-check passes, and no Senate LDA filing under the Wayne-Sanderson
  // Farms name was located. `null` = not found. Deliberately NOT `0` — a 0
  // would render to users as a confirmed claim that the company does not
  // lobby, which no source supports. Parent-company (Cargill) lobbying totals
  // exist but are whole-company figures and must never be attributed here.
  lobbyingSpend: null,
  lobbyingTargets: [],

  // Agent 4 (Legal Reviewer) ruling — was 60430, changed to null.
  //
  // The FEC figure is correctly sourced but is the WRONG METRIC for this field.
  // FEC.gov, 2023–2024 cycle, Wayne-Sanderson Farms LLC PAC (Committee ID
  // C00412445): total RECEIPTS $60,430.04 ($58,525.36 itemized + $1,904.68
  // unitemized, all individual contributions) — i.e. money employees gave TO
  // the PAC, not money the PAC gave to candidates or committees.
  //
  // This field is defined as "USD total cycle" (companies.js header) and
  // "total PAC + employee donations" (political-analysis doctrine); every other
  // record populates it with money contributed OUT to candidates/parties
  // (perdue 420000, nestle 1850000). CompanyProfileScreen.js renders it bare
  // under the label "Political Donations" in the Pro money-trail block, with no
  // per-field source note available — so a receipts number here would state to
  // the user a fact its source does not support, and would break cross-company
  // comparison. No user-facing data is lost either way: that block is gated on
  // `!lobbyRisk.unknown` (scorer.js getLobbyingRiskLevel), and lobbyingSpend is
  // null, so the figure would never have rendered.
  //
  // A future pass should pull FEC Schedule B (disbursements to candidates) for
  // C00412445 and populate this field from that. Two conflicting OpenSecrets
  // numbers ($64,531 and $22,930) remain unverifiable (403-blocked) — do not use.
  politicalDonations: null,

  // donationSplit intentionally omitted — no sourced party-split percentage
  // exists for this PAC. A 50/50 or estimated split would be a fabricated
  // figure rendering as fact. Do not populate without an FEC/OpenSecrets split.

  issues: [
    {
      id: 'ownership-change-2022',
      title: 'Formed by 2022 Cargill and Continental Grain Deal',
      severity: 'low',
      description:
        'Cargill and Continental Grain Company completed their joint acquisition of Sanderson Farms, Inc. on July 22, 2022, at $203.00 per share in an all-cash transaction valued at approximately $4.53 billion. The buyers combined Sanderson Farms with Wayne Farms, an existing Continental Grain subsidiary, to form Wayne-Sanderson Farms, a privately held company headquartered in Oakwood, Georgia, led by former Wayne Farms CEO Clint Rivers. The ownership percentages held by each parent have not been publicly disclosed.',
      source: 'Cargill and Continental Grain joint press release (PR Newswire), July 22, 2022',
    },
    {
      id: 'broiler-grower-antitrust-settlement',
      title: 'Grower Pay Antitrust Settlement (~$17.75M)',
      severity: 'medium',
      description:
        'According to the court-appointed settlement administrator\'s claims site and multiple independent reports, Sanderson Farms agreed to a settlement reported at $17.75 million (cited as $17.78 million in some accounts), reported as finalized in February 2023, resolving claims in the broiler chicken grower antitrust litigation. That litigation alleged that poultry processors suppressed the compensation paid to independent contract farmers who raise broiler chickens between January 27, 2013 and December 31, 2019. The settlement is reported to have been reached without any admission of wrongdoing. This settlement is separate from, and not additive to, the consumer-class settlement listed below.',
      source: 'Broiler grower antitrust settlement administrator site and multiple independent reports, February 2023 — no court-filed settlement document or approval order was opened directly for this entry; re-verify against the court docket when accessible',
    },
    {
      id: 'broiler-enduser-consumer-settlement-2025',
      title: 'One of Ten Defendants in $22.35M Consumer Deal',
      severity: 'medium',
      description:
        'On June 30, 2025, the U.S. District Court for the Northern District of Illinois granted final approval of a $22.35 million End-User Consumer Class settlement in the In re Broiler Chicken Antitrust Litigation covering ten defendants, listed as Claxton, Foster Farms, House of Raeford, Koch Foods, Mountaire, O.K. Foods, Perdue, Sanderson, Simmons, and Wayne. Sanderson was one of those ten defendants; the individual company shares of the $22.35 million were not separately disclosed in the sources reviewed, so no amount can be attributed to Sanderson alone. A separate, earlier $181 million consumer settlement approved December 20, 2021 covered six other defendants and did not include Sanderson.',
      source: 'Cohen Milstein litigation case page and Class Action.org, June 2025',
    },
    {
      id: 'broiler-antitrust-dap-verdict-2023',
      title: 'Jury Cleared Sanderson in Price-Fixing Trial (2023)',
      severity: 'low',
      description:
        'On October 30, 2023, after a six-week jury trial in the U.S. District Court for the Northern District of Illinois, a unanimous jury returned a verdict in favor of Sanderson Farms, rejecting claims brought by a group of large direct purchasers that the company conspired to inflate broiler chicken prices between 2008 and 2012. Sanderson Farms was found not liable and paid nothing in this proceeding. This verdict resolved only the direct-purchaser claims tried in that case; it is a separate track from the grower and consumer-class settlements listed above, which involve different plaintiff classes and different case periods, and it neither reverses nor offsets them. It is recorded here for completeness.',
      source: 'Food Dive; Bloomberg Law, October 2023',
    },
    {
      id: 'eeoc-ada-lawsuit-2021',
      title: 'EEOC Disability Discrimination Suit (Pending)',
      severity: 'medium',
      description:
        'The U.S. Equal Employment Opportunity Commission filed suit against Sanderson Farms, Inc. in the U.S. District Court for the Southern District of Mississippi (Case No. 5:21-cv-0084-KS-JCG), alleging that the company violated the Americans with Disabilities Act by refusing a night-shift schedule accommodation to an employee with cluster headaches and then terminating the employee. These are allegations in a filed civil complaint, not findings of liability. No settlement, consent decree, or verdict was located in the sources reviewed, and the matter has not been shown to be adjudicated.',
      source: 'US EEOC newsroom release (eeoc.gov), 2021 filing; status unresolved as reviewed August 2026',
    },
    {
      id: 'usda-fsis-recalls-2022-2023',
      title: 'Two USDA FSIS Recalls (2022 and 2023)',
      severity: 'medium',
      description:
        'USDA FSIS recall notices were issued for two Wayne Farms products. On December 7, 2023, approximately 1,377 pounds of Chef\'s Line Fire Grilled Chicken Breast produced at the Decatur, Alabama facility were recalled following a customer complaint indicating the product may have been undercooked. In April 2022, approximately 585,030 pounds of product were recalled. Only these two recall actions were confirmed in the sources reviewed; a further trade-press headline could not be resolved as either a duplicate reference or a separate action and is therefore not counted.',
      source: 'USDA FSIS recall notices, April 2022 and December 2023',
    },
    {
      id: 'nlrb-union-certification-2025',
      title: 'UFCW Certified at Hammond, LA Plant (2025)',
      severity: 'low',
      description:
        'In NLRB Case No. 15-RD-372826, captioned "Sanderson Farms, LLC d/b/a Wayne-Sanderson Farms," a representation election was held at the company\'s Hammond, Louisiana facility after a petition filed September 5, 2025. Of 510 eligible voters, 376 ballots were cast, and United Food and Commercial Workers Local 455 was retained as the employees\' bargaining representative by a vote of 242 to 134. The National Labor Relations Board certified the result on November 17, 2025 and the case is closed. This is a procedural election outcome, not a finding of any violation by the company.',
      source: 'National Labor Relations Board case docket 15-RD-372826 (nlrb.gov), certified November 17, 2025',
    },
    {
      id: 'osha-ammonia-citation-2019',
      title: 'Pre-Merger OSHA Ammonia Citation (Jan 2019)',
      severity: 'low',
      description:
        'As of January 2019 — before the 2022 merger that created Wayne-Sanderson Farms — OSHA was reported to have proposed penalties of $119,341 against Wayne Farms following an ammonia release at its Laurel, Mississippi plant that sent employees to the hospital. This figure appears consistently across trade-press reports and a matching US Department of Labor news release title, but no OSHA primary record was successfully retrieved in either research pass, and the matter concerns the pre-merger Wayne Farms entity rather than the combined company. An aggregate penalty total circulating for the combined company could not be verified or broken out by incident and is not reproduced here.',
      source: 'Trade press reporting of a US Department of Labor OSHA news release, August 2019 (incident January 2019)',
    },
  ],

  // Company-self-reported brand list; the company states it operates nine
  // poultry brands, not all of which were individually named in any source
  // reviewed. Harrison Poultry was reported acquired in July 2025.
  subsidiaries: [
    'Wayne Farms',
    'Sanderson Farms',
    'Covington Farms',
    'Platinum Harvest',
    'Chef\'s Craft',
    'Naked Truth',
    'Harrison Poultry',
  ],

  // sustainabilityScore intentionally omitted — no score was located by either
  // upstream agent, and estimating one would fabricate a rating.
};
