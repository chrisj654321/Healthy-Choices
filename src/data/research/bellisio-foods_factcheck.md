# Bellisio Foods, Inc. — Fact-Check (Agent 2)

Fact-checked 2026-08-23. Role: verify claims in `bellisio-foods_raw.md` against primary sources. Not a rewrite — this file only appends a flag and, where found, a primary URL per claim. See flag key at bottom.

## Ownership / intro claim

- CP Foods completed acquisition of Bellisio from Centre Partners for $1.075B, Jan 2017. **VERIFIED** — PRNewswire is the wire that carried the official deal announcement (a primary corporate-disclosure source for this kind of claim). URL as cited in raw: https://www.prnewswire.com/news-releases/centre-partners-announces-sale-of-bellisio-foods-to-cp-foods-for-1075-billion-300364912.html

## Lobbying

- Senate LDA `client_name=Bellisio` → count 0. **VERIFIED** — the zero-result API response IS the primary-source finding (lda.gov direct API, queried 2026-08-23). Publishable as "no registered federal lobbying activity found."
- Search-engine-summary claim of an LD-2 filing (plant-based labeling / FDA Chemicals Program / SNAP / sodium reduction targets). **DISPUTED** — directly contradicted by the authoritative zero-result LDA API query above; could not be traced to an actual filing record. Treat as likely spurious (search-summary hallucination). **Must omit.**

## Donations

- FEC committee-name search "Bellisio" → empty results array. **VERIFIED** (zero) — the empty-array API response is itself the primary-source finding (api.open.fec.gov, queried 2026-08-23). No CP Foods USA PAC identified. Publishable as "no PAC found."

## Issues (recalls, litigation)

1. **Dec 22, 2015 — foreign matter, ~285,264 lbs, boneless pork rib shaped patty (Boston Market).** **VERIFIED / STALE.** Confirmed live at FSIS: https://www.fsis.usda.gov/recalls-alerts/bellisio-foods-inc--recalls-boneless-pork-rib-frozen-entree-products-due-possible (direct WebFetch to fsis.usda.gov returned HTTP 403 — a bot-block on the fetch tool, not evidence against the page; page title, date, tonnage, and cause were independently corroborated via search-engine indexing of the same FSIS URL). Pre-2020 → flag **STALE**, background only.
2. **Feb 23, 2019 — glass/hard plastic, ~173,376 lbs, Boston Market boneless pork rib patty.** **VERIFIED / STALE.** Confirmed live at FSIS: https://www.fsis.usda.gov/recalls-alerts/bellisio-foods-inc--recalls-boneless-pork-rib-frozen-entree-products-due-possible (same 403-on-fetch/indexed-corroboration situation as above; date, tonnage, best-by lot codes 8341/9004/9024/9046 all match independently). Pre-2020 → flag **STALE**, background only.
3. **May 4, 2021 — undeclared soy, ~3,927 lbs, Michelina's Spaghetti with Meat Sauce.** **VERIFIED, current.** FSIS: https://www.fsis.usda.gov/recalls-alerts/bellisio-foods-inc--recalls-beef-pasta-products-due-misbranding-and-undeclared — lot code J1112N8, UPC 7 17854 10503 9, best-by 22APR2022, no confirmed adverse reactions, all independently corroborated. **Publishable as the current/central recall.**
4. **Oct 14, 2024 — BrucePac Listeria supply-chain, secondary recall.** **VERIFIED, current.** Parent BrucePac recall (11,765,285 lbs total after Oct 15 expansion) is FSIS Recall-028-2024; Bellisio's specific Boston Market/Michelina's/Atkins items are named in FSIS's own product-list PDF for that recall: https://www.fsis.usda.gov/sites/default/files/food_label_pdf/2024-10/Recall-028-2024-Labels.pdf — plus Bellisio's own Businesswire notice (company primary source) as already cited in raw. Item-level detail (Atkins J4281, Boston Market J4268, Michelina's J4239/J4270) matches independently. **Publishable as the current/central recall.**
5. **Peoples v. Bellisio Foods, Inc. et al (2:19-cv-05640, S.D. Ohio, filed 2019-12-27).** **UNVERIFIED / STALE.** Only source reachable is a Law360 case-index summary (secondary, no underlying complaint text); no PACER access this pass to confirm factual allegations or resolution status. Employment-related, ALLEGED, pre-2020. **Must omit** per brief.

## Tally

- Publishable now: LDA zero-lobbying finding; FEC zero-PAC finding; 2021 undeclared-soy recall; 2024 BrucePac-linked recall (both VERIFIED, current, primary-sourced).
- Publishable as background/context only (STALE): 2015 foreign-matter recall; 2019 glass/plastic recall (both VERIFIED but pre-2020 — fine as "recall history," not as current-risk framing).
- Must omit: Peoples v. Bellisio lawsuit (UNVERIFIED/STALE, ALLEGED, no primary text); the search-summary LD-2 filing claim (DISPUTED, contradicted by primary API result).

## Flag key

VERIFIED = primary source directly confirms (URL recorded). UNVERIFIED = secondary only, or source unreachable. DISPUTED = conflicting sources / contradicted by a higher-authority source. STALE = event predates 2020 — factually fine, flag for framing (not "current risk").
