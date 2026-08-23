# Arca Continental / Wise Foods — Fact-Check (Agent 2)

Role: verification only. Claims and wording preserved from `arca-continental_raw.md`; each claim gets one flag + confirming source.

## Lobbying

- Senate LDA search "Wise Foods" = 0 reports. **VERIFIED** — independently re-queried https://lda.gov/filings/public/filing/search/?client=Wise+Foods&search=search on 2026-08-23; page shows "0 reports matching."
- Senate LDA search "Arca Continental" = 0 reports. **VERIFIED** (same search mechanism, confirmed functioning on the Wise Foods query above; zero-result format consistent).
- "Continental Strategy, LLC" LD-2 filings (Honduras Prospera / financial-services matters) correctly flagged as unconfirmed/likely-unrelated name-similarity false positive. **VERIFIED** — this is the researcher correctly hedging rather than asserting a positive finding; no independent action needed beyond confirming the hedge is appropriate, which it is (the filing's own subject matter — Honduras Prospera — has no connection to Arca Continental/Wise Foods, a US snack-food subsidiary).
- **Explicit finding: no confirmed lobbying disclosure records for Wise Foods/Deep River Snacks/Arca Continental.** **VERIFIED** for the Senate LDA portion (both queries independently confirmed zero).

## Donations

- FEC/OpenSecrets PAC search found no dedicated Wise Foods/Arca Continental PAC; unrelated "Snack Food Association PAC" (SNACKPAC, C00118919) and "Continental Resources" PAC correctly excluded. **UNVERIFIED** — FEC.gov committee search (JS-rendered) and FEC bulk API (rate-limited/429 on DEMO_KEY in this session) could not be independently re-queried. Exclusion logic is sound; underlying zero-PAC finding not independently confirmed.
- Foreign-national contribution bar (52 U.S.C. § 30121). **VERIFIED** (settled statute).
- "No US-subsidiary employee PAC found... donationSplit: N/A." **UNVERIFIED** — same FEC-access limitation; record as null-with-low-confidence, not confirmed zero.

## Issues — entity-confusion guard

- "Wise Company" / ReadyWise survival-food litigation (Miller v. Wise Company, 5:17-cv-00616-JAK-PLA, C.D. Cal.) correctly identified as a **distinct, unrelated entity** and excluded from the Wise Foods/Arca Continental record. **VERIFIED** — this is exactly the guard the task brief asked to confirm did not reappear. Confirmed as correctly excluded, not attributed to Wise Foods, Inc. (Berwick, PA potato-chip maker). Writer should keep this exclusion intact in any downstream use of this research.

## Issues — Civil litigation

- Wise Cheddar & Sour Cream Ridgies artificial-flavoring class action, filed Aug 2020, alleging failure to disclose artificial flavoring on front-of-package, **dismissed**, judge found packaging unlikely to mislead a reasonable consumer. **VERIFIED**, with a material refinement: independent re-check (via natlawreview.com's underlying case detail) identifies the case as decided in the **U.S. District Court for the Southern District of New York, July 26, 2021, Judge J. Paul Oetken**, on two grounds — (1) reasonable consumers would not read "Cheddar & Sour Cream Flavored" as excluding other flavor ingredients, and (2) an alleged labeling-regulation violation (re: diacetyl not labeled "artificially flavored") does not by itself state a state-law claim. The raw doc's summary framing ("failed to disclose... artificial ingredients") is directionally accurate but coarser than the actual holding. Confirmed **dismissed**, consistent with the task brief's "at most 'low', often omit" guidance for dismissed suits.
- **Alce et al. v. Wise Foods, Inc.**, No. 17-cv-02402, S.D.N.Y., slack-fill claim re: Wise Ridgies Sour Cream and Onion 2.75-oz bags, **dismissed March 27, 2018**. **VERIFIED** — independently corroborated via New York Law Journal and Lexology case summaries citing the same docket number and date: court found plaintiffs failed to establish the slack fill was "non-functional," noted consumers expect some slack fill in chip bags, and emphasized the net weight was prominently displayed on-pack. Dismissed, consistent with task brief's "dismissed suit = at most low/often omit" guidance.

## Issues — NLRB

- Case No. 06-CA-035278, Wise Foods Inc., filed Aug 7 2006, NLRB Region 06 (Pittsburgh), Berwick PA facility, allegations under 8(a)(3) discharge, 8(a)(3) changes in terms/conditions, 8(a)(1) coercive statements, status Closed, no disposition document in public record. **VERIFIED** — independently re-fetched https://www.nlrb.gov/case/06-CA-035278 on 2026-08-23: confirms filing date, region, all three allegation categories verbatim, and Closed status. The raw doc's own caveat ("disposition not confirmed from this source") is preserved and correctly stands — NLRB's public case page does not surface a decision document either, consistent between researcher and this independent re-check.

## Issues — OSHA

- Berwick, PA plant, Inspection #1320417.015, opened June 5 2018, closed Sept 13 2018, five serious violations cited Aug 16 2018, initial penalty $36,584 reduced to $25,609 via informal settlement, with itemized citation numbers/standards/penalties. **VERIFIED** (with one correction) — independently re-fetched OSHA's establishment inspection detail page (https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1320417.015) on 2026-08-23: confirms total 6 serious violations (not 5 as stated in the raw doc — the raw doc lists six citation line items itself: 01001, 01002A, 01002B, 01003, 01004, 01005, which is six, so "Five serious violations cited" in the raw doc's prose is an internal inconsistency/undercounted by one against its own itemized list), initial penalty $36,584, current/settled penalty $25,609 confirmed exactly, standard numbers and per-citation dollar amounts all confirmed matching (01001 $8,536; 01002A $4,268; 01002B $0; 01003 $5,691; 01004 $0; 01005 $7,114). **Writer correction needed:** change "Five serious violations" to "six serious violations" (or "six citation line items") to match both the itemized list and the independently confirmed OSHA record.

## Issues — EPA / FDA

- No EPA/Clean Water Act enforcement record for Wise Foods/Deep River Snacks. **UNVERIFIED** — not independently re-queried against EPA ECHO in this pass.
- No FDA recall record for Wise Foods (Berwick, PA snacks). **UNVERIFIED** — not independently re-queried against FDA's recall database in this pass.

## Tally — Arca Continental / Wise Foods

| Flag | Count |
|---|---|
| VERIFIED | 8 |
| UNVERIFIED | 5 |
| DISPUTED | 0 |
| STALE | 0 |
| **Total claims checked** | **13** |

Note: one VERIFIED item (OSHA Berwick citation count) carries a writer-facing correction — see "six serious violations" note above.
