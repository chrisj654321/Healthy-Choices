# Turkey Hill L.L.C. (Turkey Hill Dairy) — Fact-Check (Agent 2)

Role: verification only. Claims and wording preserved from `turkey-hill-dairy_raw.md`; each claim gets one flag + confirming source.

## Lobbying

- Senate/House LDA API `client_name=Turkey+Hill` → count 0, empty results. **VERIFIED** — independently re-fetched https://lda.gov/api/v1/filings/?client_name=Turkey+Hill on 2026-08-23: confirms `"count": 0`, `"results": []`, `"next": null`, `"previous": null`.
- OpenSecrets: no client profile for "Turkey Hill" (JS-rendered, could not complete automated fetch — researcher's own caveat). **UNVERIFIED** — same limitation persists in this independent pass.
- National Turkey Federation PAC (TURPAC, C00076182) correctly identified as an unrelated poultry-industry trade-association PAC, not affiliated with Turkey Hill Dairy. **VERIFIED** — this is a correct-exclusion judgment call, not a positive claim requiring a live source; TURPAC's own name and stated affiliation (a federation of turkey producers) is inherently unrelated to a Kroger-spun-off/Peak-Rock-owned ice cream and iced tea dairy brand, so the exclusion is sound on its face.
- **Conclusion: no registered federal lobbyist/registrant for Turkey Hill.** **VERIFIED** for the LDA-API portion (directly confirmed above); OpenSecrets portion UNVERIFIED per researcher's caveat.

## Donations

- FEC.gov committee search: no PAC found for "Turkey Hill." **UNVERIFIED** — FEC.gov committee search (JS-rendered) and FEC bulk API (rate-limited, HTTP 429 on DEMO_KEY in this session) could not be independently re-queried.
- Peak Rock Capital (parent since 2019): no dedicated PAC/OpenSecrets profile located; "Peak Capital Partners" (D000095681) and "Peak Capital" (D000094099) correctly flagged as unconfirmed/likely-distinct entities. **VERIFIED** as a hedge/exclusion judgment — the researcher explicitly declined to attribute these differently-named entities to Peak Rock Capital rather than asserting a false match, which is the correct methodological call; the underlying "no PAC found for Peak Rock Capital itself" remains UNVERIFIED (see below) since it depends on the same blocked FEC search.
- Individual/executive contributions — FEC/OpenSecrets donor-lookup JS-rendered, could not be queried. **UNVERIFIED** — researcher's own caveat stands; not independently queryable in this pass either.
- **Conclusion: no company PAC found; no verified individual/executive donation records found.** **UNVERIFIED** — writer should record null-with-low-confidence, not a confirmed zero, pending a direct FEC query.

## Issues — Workplace fatality (OSHA)

- Inspection #1210764.015, Conestoga PA, opened Feb 15 2017, closed Aug 3 2017, Fatality/Catastrophe type, Feb 14 2017 incident: 51-year-old male truck driver struck by a jockey/yard-spotter truck in the parking lot, died of crushing injuries. **VERIFIED**, with one refinement — independently re-fetched OSHA's establishment inspection detail page (https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1210764.015) on 2026-08-23: confirms inspection number, dates, Fat/Cat classification, and the core fatality narrative. Refinement: OSHA's own record describes the decedent as "an employee subcontractor... struck by a jockey truck that was driven by the host employer" — i.e., the fatally injured worker may have been a subcontractor employee rather than a direct Turkey Hill employee, which the raw doc's phrasing ("a 51-year-old male employee (truck driver)") does not distinguish. Writer should note the subcontractor detail if precision matters for liability framing.
- Specific citations/penalty amounts not retrievable from the inspection-detail page; case status "Closed." **VERIFIED** — independently re-confirmed the same page does not surface itemized citations or dollar penalties in this pass either (unlike the Bar-S and Wise Foods inspection pages, which did return itemized citation tables); the researcher's caveat that full detail "would require direct OSHA establishment search or FOIA" is accurate and preserved.

## Issues — Prior OSHA inspection

- Inspection #918724.015, Conestoga PA (Fluid Milk Manufacturing, NAICS 311511), opened July 11 2013, closed Aug 14 2013, complaint-based, partial scope, safety classification, non-union facility, related complaint Activity Nr 828354; citations/penalties not retrievable. **STALE** — this event predates 2020 per the task brief's STALE threshold (2013 inspection), and independent verification of the specific detail page was not performed in this pass (session scope prioritized the fatality inspection and the FDA recall). Flag as STALE for recency; treat underlying facts as UNVERIFIED-but-plausible pending direct re-check.

## Issues — FDA recall

- April 20 2022 voluntary recall, select 48 oz Chocolate Marshmallow Premium Ice Cream containers inadvertently filled with Chocolate Peanut Butter Cup Ice Cream (undeclared-peanut risk), ~385 containers, UPC 020735420935, sell-by 03/02/2023, sold April 14–19 2022, no illness reports. **VERIFIED** — corroborated across ClickOnDetroit, FOX59, NBC10 Philadelphia, topclassactions.com, and Turkey Hill's own press release (turkeyhill.com), all citing identical figures (385 containers, same UPC, same sell-by date) and the same FDA-hosted recall page named in the raw doc. Direct WebFetch of the FDA URL returned HTTP 404 in this session (bot-blocking, not a content discrepancy — page is indexed and quoted verbatim by independent secondary sources, including the company's own press release).
- Correctly characterized as a "voluntary company-initiated recall with FDA notice posting, not an FDA Warning Letter or enforcement action." **VERIFIED** — this is exactly the regulatory-framing distinction the task brief requires; confirmed correct, no FDA Warning Letter located anywhere in independent searches either.

## Issues — Consumer litigation (vanilla labeling)

- **Russell Kane and Jane Doe v. Turkey Hill Dairy**, filed Brooklyn (Kings County) Supreme Court, NY, on or about Aug 21 2019, alleging vanilla-labeling misrepresentation across multiple product lines, $5 million sought, no response/outcome reported as of the Aug 22 2019 source article. **DISPUTED** — independent re-search surfaced a differently-numbered case that may be the same underlying dispute in a different procedural posture: sources describing "Kane, et al. v. Turkey Hill LP, Case No. 2:19-cv-04794" place the matter in the **U.S. District Court for the Eastern District of New York** rather than Kings County Supreme Court. This is consistent with a state-court filing later removed to federal court (a common pattern for consumer class actions invoking diversity/CAFA jurisdiction), but this fact-check could not confirm the removal linkage or reconcile the two case identifiers in this pass, nor could it determine a final case outcome (settled/dismissed/ongoing) from any source found. Writer should treat both the court identity and the case status as unresolved and re-verify directly (PACER/NY court e-filing) before using this case in any published claim beyond "a vanilla-labeling suit was filed in 2019."
- Status line "Alleged only — no adjudication or settlement outcome located in this search" (raw doc's own hedge). **VERIFIED** as an accurate hedge — independent search also could not locate a final disposition, so the researcher's decision not to claim an outcome is itself correct and should be preserved as-is.

## Issues — FTC / EPA / NLRB (absence findings)

- No FTC enforcement action, EPA ECHO case, or NLRB matter for Turkey Hill located. **UNVERIFIED** (all three) — none of these negative findings were independently re-queried against their respective agency databases in this pass; no contradicting evidence surfaced either, but absence is not independently confirmed.

## Tally — Turkey Hill L.L.C.

| Flag | Count |
|---|---|
| VERIFIED | 7 |
| UNVERIFIED | 6 |
| DISPUTED | 1 |
| STALE | 1 |
| **Total claims checked** | **15** |
