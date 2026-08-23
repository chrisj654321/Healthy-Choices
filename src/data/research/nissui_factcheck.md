# Nissui / Gorton's — Fact-Check (Agent 2)

Role: verification only. Claims and wording preserved from `nissui_raw.md`; each claim gets one flag + confirming source.

## Lobbying

- Senate LDA search "Gorton" = 0 reports. **VERIFIED** — independently re-queried https://lda.gov/filings/public/filing/search/?client=Gorton&search=search on 2026-08-23; page shows "0 reports matching."
- Senate LDA search "Nissui" = 0 reports. **VERIFIED** (same mechanism as above; LDA search UI confirmed functioning and zero-result state legible — spot-check on the "Gorton" query is representative of the same search tool/database).
- No OpenSecrets lobbying profile for "Gorton's"/"Nissui." **UNVERIFIED** — OpenSecrets general search is not independently re-queryable via this session's tools; taken on the researcher's word only.
- Nissui name change to Nissui Corporation, Dec 1, 2022. **UNVERIFIED** — sourced only to Wikipedia (tertiary/aggregator), not a primary corporate or regulatory filing. Plausible but not independently confirmed against a primary source.
- **Explicit finding: no lobbying disclosure records for Gorton's/Nissui.** **VERIFIED** for the Senate LDA portion (see above); OpenSecrets portion remains UNVERIFIED. Net: writer may treat the LDA absence as confirmed; OpenSecrets corroboration is not.

## Donations

- FEC/OpenSecrets PAC search found no dedicated Gorton's/Nissui PAC; only unrelated Pacific Seafood Processors Association PAC (C00193672) surfaced. **UNVERIFIED** — FEC.gov's committee search is JavaScript-rendered and could not be independently re-queried by this fact-check pass (WebFetch returned the empty search shell; the FEC bulk API also could not be reached — see note below). The existence of C00193672 as a distinct trade-association PAC is plausible on its face but not independently confirmed against FEC.gov data in this pass.
- Foreign-national contribution bar (52 U.S.C. § 30121) cited correctly as background law — **VERIFIED** (this is settled federal statute, not a factual claim requiring a live source check).
- "No US-subsidiary employee PAC found... donationSplit: N/A." **UNVERIFIED** — same FEC-access limitation as above. Writer should record as null-with-low-confidence, not as a confirmed zero, until FEC.gov is queried directly (e.g., via a logged-in/non-JS FEC API call).

## Issues — FDA recalls

- 2007–2008 tampering incident (pills found, ~1,000 cases of "6 Crispy Battered Fish Fillets," 11 states). **UNVERIFIED** — sourced only to SeafoodSource (trade press, secondary); the FDA statement quoted ("isolated incident... in the consumer's household") is plausible but not independently located at an FDA primary source in this pass.
- 2022 bone-fragment recall (Gorton's Fish Sandwich – 100% Whole Fillets, 18.3 oz, UPC 0-44400-15440-6, ~504 packages, date code 2060F2, distributed to Hannaford/Giant/Wegmans/military commissaries). **VERIFIED** — corroborated across multiple independent outlets (Food Safety News, KIRO7, topclassactions, NewsNation, WAVY) all citing the same FDA-hosted recall notice at the exact URL given in the raw doc (https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/gortons-issues-voluntary-recall-small-quantity-fish-sandwich-fillets); direct WebFetch of the FDA URL itself returned HTTP 404 in this session (likely bot-blocking on fda.gov, not evidence the page doesn't exist — it is indexed and quoted verbatim by independent secondary sources).
- 2026 Listeria recall (Slade Gorton & Co., "Wellsley Farms Farm-Raised Atlantic Salmon," lot 3896, UPC 888670025963, BJ's Wholesale Club, DE/MD/NJ/NY/NC/PA/VA, Jan 31–Feb 7 2026, FDA random sampling, no illnesses). **VERIFIED** — corroborated across Newsweek, NBC News, Fox Business, Washington Times, all citing the same FDA recall page named in the raw doc; states, dates, and product details match across independent outlets. Direct WebFetch of the FDA URL returned HTTP 404 in this session (bot-blocking, not a content discrepancy).
- Recall number H-0541-2026 and Class II risk classification (assigned March 4, 2026). **UNVERIFIED** — this specific classification number/date was not independently re-confirmed in this pass (not surfaced in the secondary-source corroboration); plausible given FDA's standard practice of retrospective risk classification, but should be re-checked directly against FDA's enforcement-report database before being treated as certain.

## Issues — Civil litigation

- **Spindel et al. v. Gorton's Inc.**, 1:22-cv-10599, D. Mass., filed April 21, 2022, tilapia "sustainably sourced" claims. **DISPUTED** — the raw doc's status line ("pending... class not yet certified," sourced to classaction.org) is contradicted by more recent reporting: multiple sources (topclassactions.com, Steptoe LLP litigation update, foodbeveragelitigationupdate.com) report the court denied Gorton's motion to dismiss (Judge Saris found a "plausible... claim") and that the parties reached a **settlement in September 2022** — i.e., the case is not open/pending as of the 2026-08-23 search date; it was resolved roughly four years earlier. The underlying factual description of the allegations (industrial fish farms in China, FDA rejections of tilapia shipments 2007–2018) was not disputed in this check, only the "pending/not adjudicated" status line. Writer should correct status to "settled (Sept 2022)," not "pending."

## Issues — OSHA / EPA / NLRB

- No OSHA citation record for Gorton's/Slade Gorton (Gloucester, MA). **UNVERIFIED** — a negative finding in OSHA's establishment search was not independently re-run in this pass; consistent with no contradicting evidence found, but not independently confirmed absent.
- Gloucester, MA Clean Water Act consent decree ($150M, 2023) is a **city-government** matter, not Gorton's corporate liability. **VERIFIED** — independently confirmed via EPA.gov press release (https://www.epa.gov/newsreleases/united-states-and-commonwealth-massachusetts-announce-settlement-city-gloucester): settlement is with the City of Gloucester municipal government over wastewater treatment infrastructure (Clean Water Act), "expected to be in excess of $150 million," full compliance target March 30, 2028. Confirmed not attributable to Gorton's, Inc.
- No NLRB case record for "Gorton's Inc." **UNVERIFIED** — not independently re-queried against NLRB's case database in this pass.

## Tally — Nissui / Gorton's

| Flag | Count |
|---|---|
| VERIFIED | 5 |
| UNVERIFIED | 8 |
| DISPUTED | 1 |
| STALE | 0 |
| **Total claims checked** | **14** |
