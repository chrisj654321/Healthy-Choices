# Bonduelle — Fact-Check (Agent 2: Fact-Checker)

Reviewing src/data/research/bonduelle_raw.md. Flags: VERIFIED / UNVERIFIED / DISPUTED / STALE.

## Lobbying

- "No lobbying found" for Bonduelle / Bonduelle Fresh Americas / Bonduelle USA / Ready Pac (any variant) — **VERIFIED** as a true negative. Direct query of the official lda.gov API (successor to lda.senate.gov) for client_name="Bonduelle" returns `count: 0` (zero filings, ever). Same query for client_name="Ready Pac" also returns `count: 0`. This is a direct, conclusive primary-source zero-result — stronger confirmation than the researcher's own general/site-search approach. Sources: https://lda.gov/api/v1/filings/?client_name=Bonduelle and https://lda.gov/api/v1/filings/?client_name=Ready+Pac, confirmed 2026-08-23.

## Donations

- PAC "READY PAC" (FEC ID C00540997) is unrelated to Ready Pac Foods: treasurer Amy Willis Gray, PO Box in Washington DC, no connected-organization field, registered 2013-01-25, "Hybrid PAC (with Non-Contribution Account) - Nonqualified - Unauthorized" — **VERIFIED**. Confirmed by direct fetch of the FEC.gov primary record: same treasurer, same PO Box address, same registration date, no connected org listed, status now shown as "Active" with $148,722.51 in outstanding committee debt and $0 activity in the current (2025–2026) cycle. Source: https://www.fec.gov/data/committee/C00540997/, confirmed 2026-08-23. The researcher's conclusion — treat as an unrelated, coincidentally-named PAC — is correct.
- No FEC committee found under any Bonduelle/Ready Pac name variant — **UNVERIFIED** as an exhaustive negative (not re-run against FEC's full-text committee search this pass; a name-substring miss is possible but no evidence of one was found).
- donationSplit N/A — **VERIFIED**, consistent with the above (no PAC exists to have a split).

## Issues — FDA/FSIS recalls (Ready Pac Foods / Ready Pac Produce)

- 2024-02 recall of four salad-kit products (Marketside Southwest Chopped Kit, Marketside Bacon Ranch Crunch Kit, Ready Pac Bistro Fresh Mex Chopped Kit, Ready Pac Bistro Queso Crunch Salad Kit) due to Listeria monocytogenes risk from Rizo-López Foods cheese supplier, 15,751 cases, no illnesses reported — **VERIFIED**. Confirmed by the FDA's own recall notice (URL matches exactly: https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/ready-pac-foods-inc-recalls-four-salad-kits-due-possible-health-risk-listeria-monocytogenes) and corroborated by PRNewswire's original press release and the Bonduelle Americas company blog notice. All figures (case count, notification date 2024-02-07, product list) match across sources.
- 2017-02 recall of ~59,225 lbs "Puro Picante Blazin Hot" chicken salad (Swedesboro NJ, Jackson GA, Irwindale CA establishments) due to Listeria via a cheese supplier — **VERIFIED**. Confirmed directly via FSIS.gov's own recall notice: https://www.fsis.usda.gov/recalls-alerts/ready-pac-foods-inc.-recalls-chicken-salad-products-due-possible-listeria — figures match (59,225 lbs, three establishments, production window 2017-01-17 to 02-17, use-by 01/31–03/04/17, no confirmed illnesses, discovered 2017-02-21 via supplier notification). One minor discrepancy: FSIS lists the recall announcement date as 2017-02-22, not simply "2017-02" as the researcher's heading states — immaterial, not a factual error.
- Two further FSIS recalls (misbranding/undeclared allergen, salad products) — **UNVERIFIED**. URLs located but not opened for date/quantity detail by researcher or fact-checker.
- Apple-slice Listeria recall (293,488 cases, McDonald's/Burger King supply) potentially linked to Ready Pac — **UNVERIFIED**, per the researcher's own flag; not independently confirmed this pass either. **Do not use without direct-source verification** — the researcher explicitly could not separate this from an unrelated 2024 Grimmway apple recall, and this pass did not resolve that ambiguity.

## Issues — FDA/FSIS recalls (Bonduelle USA Inc., frozen vegetables)

- 2015-09 recall of 9,335 cases of frozen corn (multiple private-label names: Wylwood, Market Basket, Bountiful Harvest, West Creek) after a Tennessee state test found Listeria monocytogenes, distributed to 14 states, no illnesses reported — **VERIFIED**. Corroborated directly by CNN, CBS News, and Fox News reporting (independent direct news reporting, not aggregators) with matching case count, brand names, and distribution states. A related FDA.gov retailer notice (Giant Food's own recall alert for the same underlying product, https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/giant-food-alerts-customers-voluntary-recall-store-brand-frozen-whole-kernel-sweet-corn) further confirms this was a genuine FDA-tracked recall event, though a Bonduelle-USA-specific FDA press-release page was not independently located in this pass.

## Issues — OSHA

- Ready Pac Food Inc., Inspection #926331.015, Florence NJ, opened 2013-07-25, closed 2013-11-13, referral/amputation-hazard emphasis, citation detail not retrievable — **UNVERIFIED** for citation/penalty detail (metadata only, consistent with researcher's own finding; fact-check pass did not re-attempt this specific inspection).
- Bonduelle USA, Inc., $43,000 penalty, 2017-11-16, Oakfield NY (40 Stevens Street), serious violation, sourced only via Good Jobs First Violation Tracker snippet — **UNVERIFIED**, unchanged from researcher's flag. This fact-check pass attempted independent confirmation two ways: (1) a U.S. Dept. of Labor OSHA regional press-release page for that date range returned HTTP 403 (blocked), and (2) a direct OSHA.gov establishment search for "Bonduelle USA" in NY did return "Results - of 2" (i.e., OSHA's own database does show 2 inspection records for this establishment, which is at least consistent with an inspection having occurred), but the actual citation/penalty data table did not render through the fetch tool, so the specific $43,000 figure could not be independently confirmed against OSHA's primary inspection-detail page. **Net: still UNVERIFIED, but strengthened** — a real Bonduelle USA/Oakfield OSHA inspection record does exist in OSHA's database (2 results), which had not been confirmed before. Recommend a human pull the two inspection IDs directly from https://www.osha.gov/ords/imis/establishment.html (search "Bonduelle USA", state NY) to get exact citation-level confirmation before publishing the dollar figure.

## Issues — Civil litigation

- California wage-and-hour class action, Ready Pac Foods Inc. / Ready Pac Produce Inc. / OTS Solutions LLC, $715,000 settlement, class period 2022-09-08 to 2025-05-11, denied wrongdoing — **UNVERIFIED**. Re-confirmed via an independent search pass (same underlying ClaimDepot settlement-notice source); no case number, court, or docket was located by researcher or fact-checker. ClaimDepot is a settlement-claims-administration site, not a primary court record — treat the $715,000 figure and all details as **plausible but not independently court-confirmed**. Recommend not publishing a specific dollar figure without a located case number.

## EPA / FTC / NLRB

- "No EPA/FTC/NLRB record found" — **UNVERIFIED as a negative finding** in all three cases; not directly queried against ECHO, FTC, or NLRB databases by researcher or fact-checker.

---

## Tally — Bonduelle
- VERIFIED: 6
- UNVERIFIED: 9 (one — the OSHA $43,000 penalty — strengthened by confirming the underlying inspection record exists, though the dollar figure itself remains unconfirmed)
- STALE: 0
- DISPUTED: 0
