# Storck — Fact-Check (Agent 2: Fact-Checker)

Reviewing src/data/research/storck_raw.md. Flags: VERIFIED / UNVERIFIED / DISPUTED / STALE.

## Lobbying

- "OpenSecrets lists a 'Storck USA' federal lobbying client profile (id D000057216): Storck USA spent $220,000 lobbying in 2020" — **VERIFIED**, and confirmed via a source independent of OpenSecrets (whose page 403'd for both researcher and fact-checker). Direct query of the official lda.gov API (successor to lda.senate.gov) for client_name="Storck" returns the full filing history for "STORCK USA, L.P." Registrant Prime Policy Group filed: 2020 Registration (posted 2020-07-23), a 2020 Q3 report with income **$110,000.00** (posted 2020-10-18, amended 2020-10-20, same amount), and a 2020 Q4 Termination report also listing income **$110,000.00**. Q3 income ($110,000) + Q4 income ($110,000) = **$220,000 for calendar year 2020**, matching the OpenSecrets figure exactly. This is the highest-priority confirmation in the batch and it holds up. Source: https://lda.gov/api/v1/filings/?client_name=Storck, confirmed 2026-08-23. Full history also shows two earlier, unrelated lobbying stints: 2000–2001 (Baker & McKenzie, $0 reported income both periods) and 2009 (Baker & McKenzie, Q1 income $20,000, terminated Q3 2009) — useful additional context the researcher didn't surface, not itself a claim requiring a flag.
- "No LDA filing detail (issues/bills/lobbyist names) found via general search" — **VERIFIED as resolved by this pass**: the lda.gov filing record identifies registrant Prime Policy Group and the 2020 registration/Q3/Q4 filings, though the specific issues/bills lobbied were not extracted from the underlying filing text in this pass (would require opening the individual LD-2 PDF, e.g. via lda.gov's filing detail page) — that remains **UNVERIFIED**.

## Donations

- "No FEC committee found under Storck USA / August Storck / Storck USA L.P. / Storck of The Americas Inc." — **UNVERIFIED** as a negative. This fact-check pass attempted to confirm the negative directly against FEC.gov's committee search but the search UI is JavaScript-rendered and did not return a clean result through the fetch tool; a general web search likewise surfaced no Storck-named FEC committee (only an unrelated "Jim Stork for Congress" match). Net: consistent with "no PAC found," but not confirmed via a clean zero-result primary-source query the way the Bonduelle/Ready Pac negative was.
- "August Storck KG is privately held, owned by the Oberwelland family" — **UNVERIFIED** (Wikipedia-sourced per researcher; not independently re-checked this pass, low-risk factual claim about corporate structure).
- donationSplit N/A — **VERIFIED** as consistent (no PAC located by either pass).

## Issues — FDA

- "No FDA Warning Letter or FDA-issued recall found for Storck USA" — **UNVERIFIED as a negative finding**; not independently re-queried against FDA's warning-letter database this pass.

## Issues — OSHA

- "No OSHA inspection or citation record found for Storck USA" (searched under Lake Forest, IL headquarters and a Chicago/Franklin Park manufacturing-plant guess) — **UNVERIFIED as a negative**; researcher's own flag stands — OSHA's establishment-search tool was not queried directly with Storck's exact legal facility name/address by researcher or fact-checker. Note: the researcher's speculation about a "Chicago Franklin Park manufacturing plant" was not confirmed to exist — treat as unconfirmed, not as an established Storck facility.

## Issues — Civil litigation

- Kpakpoe-Awei v. Storck USA L.P., Case No. 18-1086, S.D.N.Y., filed 2018-02-07, Werther's Sugar Free Caramel slack-fill claim (2.75-oz bag), settled/dismissed by Judge Vincent L. Briccetti — **VERIFIED** that the case exists and was resolved by settlement/dismissal: confirmed via independent search corroboration (case cited elsewhere as "18-cv-1086, S.D.N.Y.," same judge, same product). **Minor factual wrinkle for the writer**: sources differ on the exact slack-fill percentage — the researcher's sources say "as much as 69% slack-fill vs. 33% in the 5-oz size," while another independent source (Truth in Advertising) describes it as "approximately 60% empty space" and frames the mislabeling claim partly around a blood-glucose-impact statement rather than purely slack-fill. This is likely two sources summarizing the same complaint loosely rather than a true factual conflict, but the exact percentage figure should not be quoted as a single settled number — **flag the specific "69%/33%" figure as UNVERIFIED even though the case itself is VERIFIED.** Settlement terms/amount remain **UNVERIFIED** (not found by researcher or fact-checker).
- Woods v. Storck USA L.P., C.D. Cal., complaint filed "2018-11-14" (year inferred, not confirmed), Werther's Original ~40% slack-fill claim — **UNVERIFIED**. This fact-check pass specifically attempted to locate this docket and could not find it (search returned only unrelated "Woods" cases in C.D. Cal.). No case number, and the 2018 filing year remains unconfirmed. **This is the weakest-sourced claim in the Storck file — do not present the filing date as confirmed.**
- Advertising & Marketing Law Blog commentary on the broader 2018 slack-fill litigation wave sweeping up Storck — this is secondary commentary/analysis, not a standalone factual claim; **N/A**, no flag needed.
- "No lawsuits found specifically naming Riesen or Toffifay/Toffifee" — **UNVERIFIED as a negative**; not independently re-checked this pass.

## FTC / EPA / NLRB

- "No FTC/EPA/NLRB action found" — **UNVERIFIED as a negative finding** in all three cases; not directly queried against those databases by researcher or fact-checker.

---

## Tally — Storck
- VERIFIED: 4
- UNVERIFIED: 9
- STALE: 0
- DISPUTED: 0

**Storck lobbying verdict, explicit: the $220,000/2020 figure is CONFIRMED via a primary source independent of OpenSecrets (lda.gov's own filing database: $110,000 Q3 + $110,000 Q4 termination = $220,000). This is the strongest-sourced claim in the entire three-company batch and can be published with confidence, citing lda.gov rather than the 403'd OpenSecrets page.**
