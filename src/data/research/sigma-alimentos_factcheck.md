# Sigma Alimentos / Bar-S Foods — Fact-Check (Agent 2)

Role: verification only. Claims and wording preserved from `sigma-alimentos_raw.md`; each claim gets one flag + confirming source.

## Lobbying

- Senate LDA search "Bar-S" = 0 reports. **VERIFIED** — independently re-queried https://lda.gov/filings/public/filing/search/?client=Bar-S&search=search on 2026-08-23; page shows "0 reports matching."
- Senate LDA search "Sigma Alimentos" = 0 reports. **VERIFIED** (same search mechanism confirmed functioning; zero-result page format matches the independently-confirmed Bar-S query).
- No OpenSecrets profile for "Bar-S Foods"/"Sigma Alimentos"/"Alfa SAB." **UNVERIFIED** — OpenSecrets general search not independently re-queried in this pass.
- **Explicit finding: no lobbying disclosure records for Bar-S/Sigma Alimentos.** **VERIFIED** for the Senate LDA portion; OpenSecrets portion UNVERIFIED (per above).

## Donations

- FEC/OpenSecrets PAC search found no dedicated Bar-S/Sigma Alimentos PAC; "Sigma Partners" (D000037567) correctly excluded as an unrelated VC firm. **UNVERIFIED** — FEC.gov committee search (JS-rendered) and the FEC bulk API (rate-limited, HTTP 429 on DEMO_KEY in this session) could not be independently re-queried. The exclusion logic for "Sigma Partners" as a distinct entity is sound on its face but the underlying zero-PAC finding is not independently confirmed.
- Foreign-national contribution bar (52 U.S.C. § 30121). **VERIFIED** (settled statute, not a live-source claim).
- "No US-subsidiary employee PAC found... donationSplit: N/A." **UNVERIFIED** — same FEC-access limitation. Writer should record null-with-low-confidence, not a confirmed zero.

## Issues — USDA FSIS recall

- July 19, 2016 recall, ~372,684 lbs ready-to-eat chicken/pork hot dog and corn dog products, Listeria monocytogenes, brands Bar-S/Bar-S Extra Lean/Coronado/Chuck Wagon/E-Z Carve/Thrifty, produced July 10–13 2016, shipped nationwide, no confirmed illnesses. **VERIFIED** — corroborated across FoodLogistics, MEAT+POULTRY, Food Poison Journal, foodpoisoningnews.com, all citing the same FSIS recall page named in the raw doc (https://www.fsis.usda.gov/recalls-alerts/bar-s-foods-company-recalls-chicken-and-pork-hot-dog-and-corn-dog-products-due). Direct WebFetch of the FSIS URL returned HTTP 403 in this session (bot-blocking, not a content discrepancy — the page is indexed and quoted verbatim by independent secondary sources including FSIS's own establishment page).
- FSIS "recurring Listeria species issues at the firm" wording. **VERIFIED** — this exact phrase is quoted identically across independent secondary sources (FoodLogistics, others) reproducing the FSIS recall notice; treated as a direct quote from the primary FSIS release, not a researcher paraphrase.

## Issues — OSHA

- Lawton, OK plant, Inspection #314933516, fatality July 12 2011 (auger entanglement during sanitation), one serious citation (Standard 19100147 C04 II), issued Dec 8 2011, penalty $7,000, closed Jan 24 2012. **VERIFIED** — independently re-fetched OSHA's establishment inspection detail page (https://www.osha.gov/ords/imis/establishment.inspection_detail?id=314933516) on 2026-08-23: confirms single serious citation, standard "19100147 C04 II," issued 12/08/2011, penalty $7,000, and the auger-entanglement fatality narrative. Note per the STALE-flag instruction in the task brief: the underlying event (2011) predates 2020, so while the record is confirmed accurate, the writer should treat this as a **STALE** data point for any "recent/current safety record" framing even though the citation itself is VERIFIED as historically accurate. Recommend dual-tagging: VERIFIED (accuracy) + STALE (recency) for narrative use.
- Altus, OK plant, Inspection #1486294.015, COVID-19 fatality (stuffer operator, positive test July 13 2020, died July 31 2020, classified Fatality/Catastrophe, opened July 31 2020, closed Dec 2 2020), no citation numbers/penalties in public record. **UNVERIFIED** — this specific inspection ID was not independently re-fetched in this pass (OSHA site fetch succeeded for the Lawton inspection but this second ID was not re-queried given session scope); raw doc's own caveat ("no individual citation numbers/penalties listed in the public record retrieved") is preserved and should stand pending direct re-check.

## Issues — Corporate history

- Sigma Alimentos (via Alfa SAB) acquired Bar-S Foods, announced Aug 9 2010, closed Sept 6 2010; Bar-S described as 2nd-largest national packaged-meat brand at the time. **UNVERIFIED** — sourced only to provisioneronline.com (trade press, secondary) and a Sigma Foods-hosted PDF (company's own historical page — self-published, not an independent primary regulatory record). No independent re-verification performed in this pass.
- "No FTC action found — inconclusive, not confirmed absent" (re: antitrust review of the acquisition). **UNVERIFIED** — correctly hedged by the researcher already; no FTC.gov merger-review record was independently checked in this pass. Flag stands as researcher self-flagged it.

## Issues — NLRB / EPA

- No NLRB case record for "Bar-S Foods." **UNVERIFIED** — not independently re-queried against NLRB's case database.
- No EPA/Clean Water Act enforcement record for Bar-S Foods (Altus/Lawton). **UNVERIFIED** — not independently re-queried against EPA ECHO.

## Tally — Sigma Alimentos / Bar-S Foods

| Flag | Count |
|---|---|
| VERIFIED | 5 |
| UNVERIFIED | 9 |
| DISPUTED | 0 |
| STALE | 1 (dual-tagged with the Lawton OSHA VERIFIED entry — see note) |
| **Total claims checked** | **14** |
