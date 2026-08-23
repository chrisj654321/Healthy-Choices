# Glanbia — Fact-Check (Agent 2: Fact-Checker)

Reviewing src/data/research/glanbia_raw.md. Each claim below is quoted/paraphrased from the researcher's original wording, then flagged. Flags: VERIFIED / UNVERIFIED / DISPUTED / STALE.

## CRITICAL VERDICT — 2022 FDA Warning Letter

**DISPUTED — DO NOT PUBLISH.** The researcher's note that this letter was retracted is CONFIRMED. FDA's own May 9, 2022 constituent update (originally posted at fda.gov/food/hfp-constituent-updates/..., content now also mirrored at https://www.fda.gov/food/cfsan-constituent-updates/fda-sends-warning-letters-11-companies-illegally-selling-adulterated-dietary-supplements — direct WebFetch of both URLs returned 404/blocked, but the FDA.gov page content was independently confirmed via two separate search-engine extractions that quote the FDA text directly) states: FDA determined Glanbia Performance Nutrition (Manufacturing), Inc. was **incorrectly identified**; the site selling "Uplift Max" and "Shred Her Max" had falsely claimed to be an Optimum Nutrition property; Glanbia self-reported the error to FDA; **the Warning Letter was retracted**, and FDA continued investigating to find the real responsible firm. Corroborated by [WholeFoods Magazine — "FDA Retracts Warning Letter to Glanbia Performance Nutrition"](https://www.wholefoodsmagazine.com/articles/6238-fda-retracts-warning-letter-to-glanbia-performance-nutrition) (trade press, independent of FDA). **This never happened as a real issue against Glanbia — a writer must omit it entirely, not present it as a live/past FDA action.**

## Lobbying

- "Glanbia PLC spent $10,000 lobbying in 2017" (OpenSecrets snippet, D000072268) — **VERIFIED**, and independently corroborated by a different primary source than the one the researcher tried. Direct query of the official Senate/House consolidated Lobbying Disclosure Act database API (lda.gov, successor system to lda.senate.gov) for client_name=Glanbia, filing_year=2017 returns a Q4 2017 LD-2 report from registrant Miller & Chevalier, Chtd, lobbyist P. Welles Orr, for clients "Glanbia Inc" and "Glanbia Performance Nutrition," **income $10,000** (Q1–Q3 2017 income not itemized/reported in the same pull). Primary source: https://lda.gov/api/v1/filings/?client_name=Glanbia&filing_year=2017 (also searchable at https://lda.senate.gov/system/public/).
- Older "Glanbia Foods" OpenSecrets URL (id D000026233, cycle 2015) — **UNVERIFIED**. Not fetched by researcher or fact-checker this pass.
- "No dollar figures found... for Optimum Nutrition, BSN, think!, Isopure... as standalone registrants" — **VERIFIED**. The lda.gov client-name search confirms lobbying is filed under "Glanbia Inc" and "Glanbia Performance Nutrition" only; no separate brand-name registrant/client records exist. Note: the full lda.gov pull also shows Glanbia Inc's lobbying history runs back to 2006 (89 total filings, focus "dairy industry" policy, registrant Miller & Chevalier throughout), which the researcher did not surface — useful context but not a claim requiring separate flagging.
- "Not confirmed whether Glanbia/Optimum Nutrition currently files LDA registrations" for 2023/2024 — **UNVERIFIED**, not checked this pass (fact-check pull was scoped to 2017 to answer the specific $10,000 question; a fresh year filter would be needed for current-year activity).
- USDA Class I milk pricing comment letter — **VERIFIED** as an extant primary document (it is itself a USDA-hosted PDF, not a secondary citation of one), but the exact submission date remains **UNVERIFIED** (not found in this pass either). Note: this is a regulatory comment, not LDA lobbying — the researcher was correct to distinguish it as such.

## Donations

- GPN PAC (FEC ID C00543090) — registration date 2013-03-25, status "Terminated Corporation PAC - Nonqualified - Unauthorized," address 975 Meridian Lake Dr Aurora IL, treasurer Kevin P. Murphy, connected org Optimum Nutrition Inc, 2019–2020 cycle: $0 receipts / $1,546 disbursements ($1,448 to other committees + $98 other) / $1,546 beginning cash / $0 ending cash — **VERIFIED**. Confirmed by direct fetch of the FEC.gov primary record; every figure matches exactly. Source: https://www.fec.gov/data/committee/C00543090/, confirmed 2026-08-23.
- OpenSecrets mirror of the same PAC, noting "foreign parent company, Glanbia plc" — **VERIFIED** as consistent with the FEC record above (same committee ID); the foreign-parent framing is OpenSecrets editorial description, not an independently checkable fact.
- donationSplit N/A (PAC terminated, $0 receipts, no recipient-level breakdown) — **VERIFIED**, consistent with the FEC financial summary above.
- Second, separate "Glanbia Foods PAC Donors" page (FEC ID C00441089) — **UNVERIFIED**. Not fetched in detail by researcher or fact-checker.
- No separate PAC found for BSN/think!/Isopure individually — **UNVERIFIED** as a negative (not independently re-queried against FEC this pass), but consistent with the "connected organization" logic already confirmed for GPN PAC.

## Issues — FDA

- 2002-05-07 Warning Letter to Optimum Nutrition, Inc. (Aurora, IL), Chicago District Office, re: stevia adulteration (3 products) and unapproved soy-protein cancer/atherosclerosis health claim, following a July 25–27, 2001 inspection — **STALE** (predates 2020, per fact-check rules — flag regardless of accuracy). Independently **confirmed accurate** via FDA's own Enforcement Story Archive page (https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/enforcement-story-archive/center-food-safety-and-applied-nutrition-continued-2002 — direct WebFetch blocked/404'd, but a separate search-engine extraction quoting that exact FDA.gov URL confirms the May 7, 2002 Chicago District warning letter to Optimum Nutrition Inc., the stevia finding, and the FDA lab confirmation of stevia in the sampled product). Net flag: **STALE, but independently corroborated as factually accurate** — a writer should still exclude it as a current issue per the pre-2020 rule, unless explicitly framed as historical.
- 2015-09-23 Citeline/Pink Sheet "misbranded" protein bars claim — **UNVERIFIED**. Paywalled trade-press article; no primary FDA document (Warning Letter, import alert, etc.) located to confirm exact action type or date.
- 2022-05-04 Warning Letter — see CRITICAL VERDICT above. **DISPUTED / DO NOT PUBLISH.**

## Issues — OSHA

- Inspection #1525146.015, Glanbia Nutritionals NA, Inc., 301 Heffernan Drive, West Haven, CT — opened 2021-04-15, closed 2021-11-16, triggered by a 2021-04-13 hot-water burn injury (15–20% body, second-degree), 3 serious citations, initial penalty $40,959, final penalty $13,653 (two of three citations reduced/vacated to $0) — **VERIFIED**. Confirmed by direct fetch of the OSHA.gov primary inspection-detail page; citation IDs, standards, dates, and dollar amounts all match exactly. Source: https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1525146.015, confirmed 2026-08-23.
- Second inspection record #1514325.015 — **UNVERIFIED**, not opened by researcher or fact-checker.
- OSHA "Injury Line" record — **UNVERIFIED**, not opened.

## Issues — Civil litigation (all "alleged, not adjudicated" per the researcher — that status itself is unchanged by this pass; flags below cover only whether the case/docket exists as described)

- John Daly et al. v. Glanbia Performance Nutrition Inc., Case No. 2023CH00096, Cook County Chancery (think! "no artificial sweeteners" / maltitol claim) — **VERIFIED** that a matching case exists: a federal docket "Daly v. Glanbia Performance Nutrition (NA), Inc.," No. 1:2023cv00933, N.D. Ill. (same plaintiff surname, same defendant, same subject matter — consistent with a CAFA removal from the Cook County filing) is confirmed via Justia's court-docket mirror: https://dockets.justia.com/docket/illinois/ilndce/1:2023cv00933/430355. Underlying allegation remains **alleged, not adjudicated** — unchanged.
- Tocci et al. v. The Isopure Company, LLC / General Nutrition Corp., Case No. 14-cv-09097, S.D.N.Y. (protein-spiking) — **VERIFIED** docket exists: confirmed via UniCourt's federal-docket mirror (7:14-CV-09097, filed 2014-11-14, Judge Vincent L. Briccetti) — https://unicourt.com/case/rc-db1-tocci-v-the-isopure-company-llc-et-al-700891. Outcome/disposition still **UNVERIFIED** (not located in this pass).
- Isopure slack-fill (~30% empty space) class action — **UNVERIFIED**. No case number found by researcher or fact-checker.
- Bergman et al. v. Glanbia Performance Nutrition, Inc. (vanilla-sourcing/"Madagascar vanilla" mislabeling) — **UNVERIFIED**. Only the ClassAction.org-hosted complaint PDF was located (an aggregator hosting a document, not an independently confirmed docket).
- Hacker v. Glanbia Performance Nutrition, Case No. 3:22-cv-01119 — **VERIFIED** as a real, distinct case: confirmed filing date 2022-08-01, involves a different product/claim than researcher guessed (Optimum Nutrition "Essential AMIN.O Energy" powder, synthetic-flavoring/deceptive-labeling claim, purchased at a Sprouts in San Diego) rather than the GMO-free think! matter the researcher flagged as a possible mix-up. **Note for writer: this is NOT the same case as the "GMO FREE" think! labeling suit the researcher wondered about — they are separate matters; do not conflate.**

## FTC / EPA / NLRB

- "No FTC/EPA/NLRB action found" — **UNVERIFIED as a negative finding** in all three cases; neither the researcher nor this fact-check pass queried ECHO, NLRB case search, or FTC directly. Do not present as a confirmed clean record — present as "not found in searches conducted," which is weaker.

---

## Tally — Glanbia
- VERIFIED: 11
- UNVERIFIED: 11
- STALE: 1 (also independently corroborated as accurate)
- DISPUTED: 1 (the 2022 warning letter — retraction confirmed, **DO NOT PUBLISH** as a real issue)

**2022 warning-letter verdict, explicit: RETRACTED. Confirmed via FDA's own constituent-update content (independently re-confirmed, not just the researcher's single source) and corroborated by trade press. It must never appear in writer-facing output as a live FDA action against Glanbia.**
