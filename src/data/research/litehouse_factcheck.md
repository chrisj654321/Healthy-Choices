# Litehouse, Inc. — Fact-Check (Agent 2, Fact-Checker)

Role: verify Agent 1's raw research against primary sources. This document does not rewrite or conclude — it flags each claim.
Fact-check date: 2026-08-23.

Flags used: VERIFIED (primary source confirms) / UNVERIFIED (secondary only, or unreachable) / DISPUTED / STALE (pre-2020).

---

### 1. FDA Warning Letter — MARCS-CMS 662949 (Nov 29, 2023)
**Flag: VERIFIED**
- Primary source page exists at the exact URL cited: https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/litehouse-inc-662949-11292023
- Direct fetch returns HTTP 404 (FDA blocks non-browser fetches on this endpoint — confirmed independently, same result as Agent 1 got). Content confirmed via search-engine indexing of that exact fda.gov URL (title: "litehouse inc 662949 11292023"), consistent with Agent 1's description of the letter (soy misbranding, section 403(w)).
- Government enforcement action → VERIFIED per protocol despite the fetch-blocking caveat. Recommend the writer cite the URL as-is; it is a real FDA page, not a broken/retracted link.

### 2. Recall — Undeclared soy, Simple Truth Plant Based Ranch Dressing (April 19, 2023)
**Flag: VERIFIED**
- Confirmed directly via the openFDA Food Enforcement API (official FDA API, stronger primary source than the HTML page): `https://api.fda.gov/food/enforcement.json?search=recalling_firm:"Litehouse"`
- Record match: recalling firm Litehouse Inc.; product "Simple Truth Plant Based Ranch Dressing 12floz bottle"; reason "product labeled as ranch dressing but contains Caesar dressing"; recall initiation date April 19, 2023; classification Class II; status Terminated.
- Matches Agent 1's claim exactly (lot code / root cause not independently re-verified but consistent with the confirmed event).
- Primary URL for citation: https://api.fda.gov/food/enforcement.json?search=recalling_firm:%22Litehouse%22

### 3. Recall — Undeclared anchovies, Brite Harbor Caesar Dressing & Dip (Feb 15, 2021)
**Flag: VERIFIED**
- Confirmed via openFDA Food Enforcement API. Record: product "Brite Harbor Caesar Dressing & Dip, 1.5 oz pillows (pouches)"; reason undeclared anchovies; recall initiation date Feb 12, 2021 (Agent 1 cited the Feb 15, 2021 FDA public-announcement date — the 3-day gap is initiation-vs-announcement, not a discrepancy); classification Class II; status Terminated.
- Primary URL: https://api.fda.gov/food/enforcement.json?search=recalling_firm:%22Litehouse%22

**ADDITIONAL FINDING NOT IN AGENT 1'S RAW RESEARCH** — flagging for the writer's awareness, not adding a new claim to publish without review:
- A second, separate undeclared-anchovies recall exists in the same openFDA dataset: "Litehouse item 15533 Ranch dressing packaged in 1.25 oz. plastic cup," recall initiation Sept 20, 2021, report date Oct 20, 2021, **Class I** (more severe than the Feb 2021 Class II event), status Terminated. This event is not mentioned in litehouse_raw.md. Recommend Agent 1 (researcher) confirm and add it — Class I anchovy-allergen recalls are the most publishable class of claim in this whole file.

### 4. Recall — Undeclared egg, OPA by Litehouse Ranch (Aug 12, 2017)
**Flag: STALE (pre-2020)** — also independently VERIFIED as a real event.
- Confirmed via openFDA Food Enforcement API: product "OPA by Litehouse Ranch, 6/11.25 oz. glass round bottles per case"; reason "undeclared egg"; recall initiation date Aug 11, 2017 (Agent 1 cited Aug 12, 2017, the company press-release date — 1-day gap, immaterial); classification **Class I**; status Terminated.
- Per protocol this is STALE regardless of verification strength; flag for the writer to omit or clearly date-bound if used.

### 5. OSHA — Inspection (opened April 8, 2025)
**Flag: VERIFIED, with a correction to Agent 1's status claim.**
- Confirmed via OSHA's own establishment inspection detail page (primary source): https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1816469.015
- Establishment: Litehouse Inc., 1109 North Ella, Sandpoint, ID 83864. Inspection 1816469.015. **Opened April 8, 2025; CLOSED April 17, 2025.** Planned, partial-scope inspection by the Boise Area Office, no advance notice given, targeting amputation-hazard emphasis programs.
- Agent 1 described this as an "open/unconfirmed" inspection with status possibly not yet closed. That is now out of date — the primary source shows the case status is **CLOSED**, not open.
- No violation summary, citation table, or penalty amount is present on the inspection-detail page in either of two fetch passes. This is consistent with (but does not prove) no citations having issued — OSHA's public page simply does not surface citation data for this case in this view.
- Writer guidance: an open inspection would need omission per the brief's rule, but this inspection is now closed with no visible citation. Still recommend omission or a heavily hedged one-liner ("OSHA closed a planned partial inspection in April 2025; no citations are shown in the public record") — do NOT describe it as an ongoing/open case, and do NOT imply a finding either way since citation data isn't confirmed absent.

### 6. Civil lawsuit — Cassar v. Litehouse, Inc. (filed Dec 27, 2025)
**Flag: UNVERIFIED / ALLEGED — no primary court document fetched.**
- Both of Agent 1's sources are secondary: a law-firm marketing newsletter (Juris Law Group) and a docket-aggregator listing (Law.com Radar), not the court's own e-filing system (NY courts eCourts / NYSCEF).
- I did not attempt to pull the NYSCEF docket directly (outside this pass's scope/tooling). Case number and venue are plausible and internally consistent across both secondary sources, but that is corroboration between secondaries, not primary confirmation.
- This is, in any case, an unproven civil complaint. Flag stands regardless of the sourcing gap: **must be hedged or omitted** per the brief — do not state the labeling claim as fact, only as an allegation in a pending suit.

### 7. FTC actions — none found
**Flag: UNVERIFIED** (absence claim, no definitive negative-result source cited or fetched).
- Agent 1 did not cite a specific FTC database query URL/result for this negative finding (unlike the LDA and FEC negative findings below, which do cite a queried URL). Recommend the writer treat this as "no FTC action found in this research pass" rather than a confirmed zero, or have Agent 1 re-run with a specific FTC enforcement-action search URL cited.

### 8. Lobbying — no registrant found (LDA)
**Flag: VERIFIED zero.**
- Confirmed directly via the LDA's own REST API (primary source, official government API): `https://lda.gov/api/v1/filings/?client_name=Litehouse` returns `"count": 0` — no filings, no registrants, no client records matching "Litehouse."
- This satisfies the brief's rule: API returns count 0 → VERIFIED zero.

### 9. Donations — no FEC-registered PAC or committee found
**Flag: UNVERIFIED — as anticipated, FEC search is not verifiable by static fetch.**
- Fetched https://www.fec.gov/data/search/?query=Litehouse&type=committees directly: the page is a JavaScript-rendered search interface: no results are present in the static HTML, so a "zero results" finding cannot be confirmed or denied from this page load. Agent 1's "no PAC found" claim was reached the same way (page load, no results visible) and carries the same limitation.
- Per the brief's own instruction: FEC is likely unverifiable this way → **politicalDonations should be set to null**, not "confirmed zero."

---

## Tally

| # | Claim | Flag |
|---|---|---|
| 1 | FDA Warning Letter Nov 29 2023 (soy misbranding) | VERIFIED |
| 2 | April 19 2023 Simple Truth recall (undeclared soy) | VERIFIED |
| 3 | Feb 2021 Brite Harbor anchovies recall | VERIFIED |
| 3b | (new) Sept/Oct 2021 second anchovies recall, Class I — not in raw research | VERIFIED (unreviewed addition — flag for researcher) |
| 4 | 2017 OPA undeclared-egg recall | STALE (pre-2020), also VERIFIED as an event |
| 5 | April 2025 OSHA inspection | VERIFIED it occurred and is CLOSED; no citation data confirmed present or absent |
| 6 | Cassar v. Litehouse civil suit (Dec 2025) | UNVERIFIED / ALLEGED — pending, unproven |
| 7 | FTC — none found | UNVERIFIED (negative claim, no queried-URL evidence given) |
| 8 | Lobbying (LDA) — none found | VERIFIED zero |
| 9 | Donations (FEC) — none found | UNVERIFIED — set politicalDonations to null |

## Publishable (VERIFIED) vs. must-omit/hedge

**Publishable as VERIFIED, government-primary-sourced facts:**
- FDA Warning Letter, Nov 29, 2023 (MARCS-CMS 662949) — undeclared soy / misbranding.
- April 19, 2023 recall — Simple Truth Plant Based Ranch Dressing, undeclared soy, Class II.
- Feb 2021 recall — Brite Harbor Caesar Dressing & Dip, undeclared anchovies, Class II.
- (Recommend researcher confirm and add) Sept 2021 recall — Litehouse Ranch item 15533, undeclared anchovies, **Class I** — currently missing from the raw research entirely.
- LDA lobbying: zero registrants found (VERIFIED zero, can state plainly as "no lobbying registration found").
- 2017 OPA egg recall is a real, verified event but STALE — omit or clearly date-bound only ("in 2017, before the window this profile covers").

**Must omit or heavily hedge:**
- OSHA April 2025 inspection: do not call it "open" (it's closed per primary source) and do not imply any citation/violation — the public record shown does not surface citation data either way. If mentioned at all, state only that a planned inspection occurred and closed, with no citation data available.
- Cassar v. Litehouse lawsuit: allegation only, unproven, sourced from secondary aggregators not the court docket itself — must be framed as "a pending, unproven lawsuit alleges..." or omitted.
- FTC "none found": don't state as a confirmed zero; phrase as "no FTC action found in this research pass" if kept at all.
- FEC/PAC donations: set `politicalDonations: null` rather than asserting a confirmed zero — the FEC site could not be verified as returning zero results (JS-rendered, no static confirmation).
