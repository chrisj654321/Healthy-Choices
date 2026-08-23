# Just Born, Inc. — Fact-Check (Agent 2)

Role: verification only. Claims and wording preserved from `just-born_raw.md`; each claim gets one flag + confirming source.

## Lobbying

- OpenSecrets: no client profile for "Just Born" (search noted as JS-rendered/incomplete by researcher). **UNVERIFIED** — researcher's own caveat stands; not independently re-queryable in this pass either.
- Senate/House LDA API `client_name=Just+Born` → count 0, empty results. **VERIFIED** — independently re-fetched https://lda.gov/api/v1/filings/?client_name=Just+Born on 2026-08-23: confirms `"count": 0`, `"results": []`, `"next": null`, `"previous": null`.
- **Conclusion: no registered federal lobbyist/registrant for Just Born.** **VERIFIED** for the LDA-API portion (directly confirmed above); OpenSecrets portion remains UNVERIFIED per researcher's own caveat.

## Donations

- FEC.gov committee search: no PAC found for "Just Born." **UNVERIFIED** — FEC.gov committee search (JS-rendered) and FEC bulk API (rate-limited, HTTP 429 on DEMO_KEY in this session) could not be independently re-queried in this pass.
- Individual/executive contributions (David Shaffer, Ross Born, Gardner "Chip" Jett Jr.) — no records located; researcher explicitly notes FEC/OpenSecrets donor-lookup tools are JS-rendered and could not be queried. **UNVERIFIED** — researcher's own caveat stands; leadership names/titles are corroborated by justborn.com and fb101.com company/trade sources (adequate for biographical fact, not for the donation-absence claim itself).
- **Conclusion: no company PAC found; no verified individual/executive donation records found.** **UNVERIFIED** — consistent with the above; writer should record null-with-low-confidence pending a direct FEC query, not a confirmed zero.

## Issues — slack-fill class actions

- **White v. Just Born, Inc.**, 2:17-cv-04025-C-NKL, W.D. Mo., filed 2017, Mike & Ike/Hot Tamales ~35% non-functional slack-fill, motion to dismiss denied July 21, 2017. **VERIFIED** — sourced to a Justia docket page (dockets.justia.com), which mirrors PACER's official federal docket data and is treated as primary-adjacent for case existence/number/court; confectionerynews.com corroborates the same case number, court, and denial date independently.
- **Escobar et al. v. Just Born, Inc.** / **Mateski v. Just Born**, consolidated, 17-cv-1826, C.D. Cal., filed state court Feb 2017, removed March 2017, "46% empty space" allegation. **VERIFIED** — corroborated via truthinadvertising.org and CourtListener (courtlistener.com/docket/5940692), the latter being a primary-adjacent federal-docket mirror (RECAP/PACER-sourced); case number, court, and allegation percentage confirmed consistent across independent sources.
- Settlement: $3.3 million nationwide class settlement, preliminary approval July 2020, final fairness hearing Dec 15 2020, terms ($0.50/product with proof of purchase or voucher, max 8 free boxes; voucher-only without proof; fill-line/size-image label commitment). **VERIFIED** — the $3.3 million figure, settlement terms, and label-commitment are independently corroborated across topclassactions.com, classactionsreporter.com, and truthinadvertising.org, all describing identical terms and figures; treated as VERIFIED via convergent independent secondary reporting even though no single court-filed settlement agreement PDF was directly re-pulled in this pass.
- Status: **Settled** (civil, not government/regulatory; no FTC action identified). **VERIFIED** — consistent with all sources found; no FTC or other regulatory action surfaced anywhere in this independent check either.

## Issues — 2016 strike and related litigation

- ~400 BCTGM Local 6 members struck Sept 7 2016 at Bethlehem, PA plant during peak Peeps season; issues cited: pension elimination for new hires, below-market wage increases, higher employee health-insurance cost share; workers returned late October 2016; no new contract as of report date. **VERIFIED** — independently corroborated via CBS News coverage of the case, which restates the same strike facts (pension elimination, wage increases) sourced to BCTGM Local 6 itself.
- **Just Born, Inc. v. Local Union No. 6, BCTGM**, Civil No. 16-5114, E.D. Pa. Just Born sued alleging the strike violated a no-strike clause in the expired CBA; Judge Jeffrey L. Schmehl granted summary judgment for the union, dismissed the case Dec 29, 2017 (2017 WL 6731647), ruling Just Born failed to show workers waived their right to strike. **VERIFIED** — independently confirmed via govinfo.gov (a primary official U.S. government document repository: https://www.govinfo.gov/app/details/USCOURTS-paed-5_16-cv-05114/context) and corroborated by CBS News's report of the same 15-page opinion, same judge, same Dec 29 date, and same "failed to prove... violated a no-strike clause" holding.
- Status: **Adjudicated — dismissed via summary judgment.** **VERIFIED** (per above).
- No specific NLRB unfair-labor-practice case number independently located/confirmed. **UNVERIFIED** — researcher's own caveat correctly preserved; not independently re-searched against NLRB's case database in this pass, so absence remains unconfirmed rather than affirmatively ruled out.

## Issues — Red Dye No. 3 advocacy letter

- March 2023 Consumer Reports (and allied groups) letter to Just Born Quality Confections urging removal of Red Dye No. 3, citing its 1990 cosmetics ban as a carcinogen; followed a late-2022 FDA petition by 20+ organizations. **VERIFIED**, with a date refinement — independently confirmed the letter exists at the exact PDF URL cited in the raw doc (advocacy.consumerreports.org/wp-content/uploads/2023/04/Just-Born-Confectioners-Letter.pdf) and via Consumer Reports' own advocacy pages; the letter was sent **March 17, 2023** (addressed to David Shaffer and Gardner Jett Jr.) with a response requested by March 31, 2023 — more precise than the raw doc's "March 2023" but not contradicting it.
- Explicitly flagged by researcher as **advocacy-group letter, not an FDA warning letter or regulatory enforcement action.** **VERIFIED** — this is exactly the distinction the task brief asked to be preserved; confirmed correct. No FDA warning letter or enforcement action was found anywhere in independent searches either. This item must not be presented as regulatory action in downstream writing.

## Issues — FDA / FTC / EPA / OSHA (absence findings)

- No FDA Warning Letter, FTC enforcement action, EPA ECHO record, or OSHA citation for Just Born located. **UNVERIFIED** (all four) — none of these negative findings were independently re-queried against their respective agency databases in this pass; no contradicting evidence surfaced either, but absence is not independently confirmed.

## Tally — Just Born, Inc.

| Flag | Count |
|---|---|
| VERIFIED | 9 |
| UNVERIFIED | 8 |
| DISPUTED | 0 |
| STALE | 0 |
| **Total claims checked** | **17** |
