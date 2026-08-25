# Butterball LLC — Stage 3 fact-check

Fact-checker: independent Stage 3 pass, separate from the Stage 2 researcher (no trust extended to researcher framing — every flagged item below was independently re-searched/re-fetched, not just read and accepted).
Reviewed: 2026-08-05.
Upstream checkpoint: `butterball_raw.md` (confirmed 25,394 bytes, well over the 500-byte guard, before starting).

Flags: VERIFIED / UNVERIFIED / DISPUTED / STALE. Severity (high/medium/low) applied where relevant to future `issues[]` entries.
Does not rewrite or characterize raw claims — annotates only.

---

## 0. NOT CHECKED section (raw file lines 7-11)

No flag needed — this is the researcher's own methodology disclosure, not a factual claim. Confirmed accurate: it correctly scopes what was and wasn't resolved (FSIS FOIA-log-only lead; single-plant chilling-method source). No overreach found here.

---

## 1. GAP (Global Animal Partnership)

**Flag: VERIFIED.** Independently re-fetched `https://globalanimalpartnership.org/shoppers/` myself (separate fetch, 2026-08-05). Confirmed: Butterball does not appear on the partner directory. Turkey partners I independently saw (Diestel Turkey, Mary's Turkey, JD Farms Specialty Turkey, Yorkshire Valley Farms, plus multi-species partners including Campfire Treats and Applegate Farms) overlap with the raw file's longer list — no contradiction, just a shorter independent summary. The "absent, genuine search completed" framing is accurate, not a "not checked" dressed up as a finding.

## 2. Certified Humane

**Flag: VERIFIED.** Independently re-fetched `https://certifiedhumane.org/whos-certified/` myself. Confirmed Butterball does not appear; turkey producers I saw (Koch's Turkey Farm, Dole and Bailey/Koch's-sourced, Godshall's/Koch's-sourced, Pitman Family Farms/Mary's Turkey) are a different but non-contradictory list from the raw file's (Koch's, White Oak Pastures, Ayrshire Farm, Footsteps Farm) — likely reflects the producer-database vs. editorial-post distinction the raw file itself drew. Absence confirmed independently.

## 3. A Greener World / Animal Welfare Approved

**Flag: VERIFIED, with a caveat.** Could not independently reproduce the exact site-search query myself — `agreenerworld.org/gd-search-results/?s=Butterball` 403'd on retry (bot protection, same failure mode noted elsewhere in this pass). A general WebSearch for "agreenerworld.org Butterball certified" surfaced no connection between the two, consistent with absence. Given that the *same* researcher-described methodology (a certifier's own site-search tool returning an explicit "no results" string) checked out exactly as described for both GAP and Certified Humane above when I ran them myself, I have high confidence this third one is accurate too — but flagging the caveat since I did not personally reproduce this specific query. Recommend a retry with a browser tool that isn't blocked by AGW's bot protection if 100% independent confirmation is required before shipping.

## 4. USDA Process Verified Program

**Flag: VERIFIED.** Direct WebFetch of `ams.usda.gov/content/butterball-llc-process-verified-program` was blocked (403, bot protection), but independent WebSearch surfaced content that matches the raw file's quoted page content almost verbatim: three plants (Huntsville AR Est. P7174, Mount Olive NC Est. P7345, Raeford NC Est. P46870), "No Antibiotics Ever – from the egg to the day of hatch to processing, these birds receive absolutely no antibiotics of any kind," and the Korea/South Africa export-verification note scoped to P7345 only. This is a genuine government audit program (AMS Process Verified Program requires AMS auditors to verify claims against a company-submitted quality manual) — the raw file's "not merely a company disclosure" framing is correct. One loose end: one search snippet mentioned a "Vegetable Fed" verification point not in the raw file's quoted text; this is most likely search-engine bleed from an adjacent PVP listing in the same result set (several other companies' PVP pages appeared in the same search), not a real omission — flagging so Stage 4 doesn't drop it silently, but not treating as a contradiction since the core "No Antibiotics Ever, 3 plants, government-audited" claim is solidly corroborated.

## 5. Air-chilled vs. water-chilled processing

**Flag: UNVERIFIED.** Single trade-press source (MEAT+POULTRY), which is a secondary source under this pipeline's definitions (not a primary government filing, court record, company disclosure, or certifier directory). I did not independently re-fetch meatpoultry.com to check the quote's accuracy, but even if the quote is accurate, the flag is UNVERIFIED by definition — a trade journal is not a primary source, however credible its on-the-record sourcing (named plant staff) makes it. The raw file's own scope caveat (Mount Olive-confirmed only, not company-wide) is appropriately conservative and should be preserved as-is at Stage 4.

## 6. USDA-FSIS enforcement — 2019 Salmonella Schwarzengrund recall

**Flag: VERIFIED for the recall itself; DISPUTED for the illness count — raw file's number needs correction.**

- Recall facts (78,164 lbs, Mount Olive NC establishment, March 13, 2019, raw ground turkey incl. a Food Lion-branded line, sell/freeze-by 7/26/18, lot code 8188, produced 7/7/2018): **VERIFIED.** Independently confirmed via CDC's own archived outbreak page (`archive.cdc.gov/www_cdc_gov/salmonella/schwarzengrund-03-19/index.html`, a primary government source) plus cross-checks against Food Safety News and Food Poisoning Bulletin reporting — all consistent on weight, date, and product details. Also independently confirmed: 1 hospitalization, 3 states, no deaths — all matching.
- **Illness count — the raw file's "6 illnesses... per CDC's count" is wrong.** I fetched CDC's own archived page directly and it states: **"A total of 7 people infected with the outbreak strain of Salmonella Schwarzengrund were reported from 3 states"** (state breakdown: Minnesota 2, North Carolina 2, Wisconsin 4 = 8, so even CDC's own by-state breakdown doesn't cleanly sum to its own headline "7" — a source-internal inconsistency worth flagging, not something I can resolve further). Separately, Food Safety News' March 15, 2019 article (contemporaneous with the recall, likely reflecting an FSIS-era early count) says "six confirmed patients from three states" — so **6 was the initial/early count, 7 is CDC's own final tally** after the investigation closed (a normal outbreak-investigation pattern: case count rises as more illnesses are confirmed). The raw file's specific parenthetical "5 case-patients from 2 states per one FSIS figure" does **not match anything I found in any source** — no source I located anywhere reports 5 cases or 2 states. This sub-figure looks like a research error (possibly confused with a different, smaller outbreak) and should be dropped, not carried into Stage 4.
- **Recommended correction for Stage 4:** report **7 illnesses, 3 states (MN/NC/WI), 1 hospitalization, 0 deaths** (CDC's final tally, the authoritative source), not "6" or "5."
- Severity if logged as an `issues[]`/`recalls[]` entry: **low** — single food-safety recall, no deaths, matches the severity tier of the already-logged 2021 recall.
- FOIA-log-only lead (section 6, third bullet): correctly NOT treated as a finding by the raw file — agree, no flag needed beyond confirming that restraint was appropriate.

## 7. Seaboard Corporation SEC filings — ownership stake

**Flag: VERIFIED.** Direct WebFetch of both the FY2021 and FY2022 10-K URLs was blocked (403, SEC.gov bot protection — same failure mode as several other sources in this pass), but independent WebSearch surfaced the exact quoted 10-K language from multiple independent aggregators/trade sources, consistent with the raw file's quotes: FY2021 10-K = "Seaboard has a 50% noncontrolling interest in Butterball"; FY2022 10-K onward = "52.5% noncontrolling interest." **New corroborating detail not in the raw file, worth adding at Stage 4:** WATTPoultry.com's trade coverage ("Did Seaboard up Butterball investment at an opportune time?") explains the mechanism — Seaboard has held warrants since the original 2010 deal that let it acquire an additional 5% equity interest in Butterball for a nominal price, and the 50%→52.5% jump reflects (at least in part) exercise of those warrants, not a renegotiated buy-in. This strengthens rather than contradicts the raw file's finding — the "50/50" framing in the session brief is confirmed stale as of FY2022.
- The Item 1A risk-factor quotes and the "no turkey-specific sourcing-model disclosure found" conclusion: I could not independently re-fetch the FY2023 10-K directly (403), so I'm relying on the raw file's own direct-read claim for the exact quoted risk-factor text. Given the ownership-percentage claims from the same document set checked out exactly against independent secondary corroboration, I have no reason to doubt the quotes but flag this specific sub-item **UNVERIFIED-by-me** (not independently re-confirmed), pending a non-blocked SEC fetch at Stage 4 if the exact wording will be quoted verbatim in-app.

## 8. Court records

**Figueroa v. Butterball, LLC — district court docket (case number, filing date, FLSA/NCWHA claims, piece-rate pay structure): Flag VERIFIED.** This was captured via direct CourtListener docket read at Stage 2 (a primary source, per this pipeline's definitions — a court record). I could not independently re-fetch CourtListener myself (403 on retry), but no contradicting information surfaced in my independent WebSearch pass, and the case number/parties are corroborated by the Justia, Law360, and Bloomberg Law pieces I did retrieve.

**Interlocutory appeal denial (No. 22-289, 4th Cir., denied Nov. 4, 2022): Flag VERIFIED**, same basis — direct docket capture at Stage 2, no contradicting source found.

**Merits appeal / Fourth Circuit affirmance, No. 24-1861, decided Jan. 13, 2026: Flag UNVERIFIED (high-confidence), with one material addition for Stage 4.**
- The raw file itself already flags that the actual opinion text was never directly read (Justia WebFetch was blocked). I independently confirmed the Jan. 13, 2026 affirmance date and outcome (piece-rate classification upheld, FLSA/NCWHA claims rejected) via three additional independent legal-press sources not in the raw file: Law360 ("4th Circ. Keeps Butterball's Win In Wage Dispute"), Littler Mondaq's "January 2026 Appellate Roundup," and the Justia case page. All three are consistent with each other and with the raw file's account. This is real, well-corroborated news — **not** a hallucinated or mistakenly future-dated citation; today's date (2026-08-05) is about seven months after the Jan. 13, 2026 decision, which is an entirely ordinary lag for this kind of appellate-litigation research, not a red flag.
- However, all of this corroboration is still secondary-source (legal trade press, not the opinion itself or a docket entry) — hence UNVERIFIED rather than VERIFIED under this pipeline's strict definitions. CourtListener direct fetch failed for me too (403), so I could not personally read the primary opinion or docket either. Recommend a direct docket/opinion read before Stage 4 quotes language verbatim.
- **Material fact missing from the raw file, found independently — add before Stage 4 treats this as fully closed:** Figueroa filed a petition for rehearing en banc on Jan. 26, 2026 (per Meatingplace.com trade coverage, corroborated by the petition's substance being discussed in the Littler Mondaq roundup), arguing the panel's ruling conflicts with the Fourth Circuit's own 2007 Anderson v. Sara Lee Corp. precedent. **I could not find any source confirming whether the en banc petition was granted or denied** — as of this fact-check (2026-08-05), the case's finality status is not fully confirmed. Recommend Stage 4 phrase this as "a Fourth Circuit panel affirmed dismissal of Figueroa's claims in Jan. 2026; the plaintiff sought en banc rehearing" rather than asserting the litigation is fully and finally closed.

**Other multi-plaintiff labor suits (Cardenas, Graham, Marc): no flag changes** — raw file's own hedging ("not confirmed," "flagged only, not a finding," "monitor for outcome") is already appropriately conservative and I found nothing in independent searching to firm any of these up further.

## 9. Existing company record cross-reference

No new claim here to flag — this section only restates what's already in `companies.js`. No issue found with the restatement.

## 10. American Humane Certified

**Certification existence, AHA as verifier, "first commercial turkey company" status: Flag VERIFIED.** Sourced to the certifier's own materials (American Humane Society producer spotlight) and Butterball's own press release — both are primary sources under this pipeline's definitions (certifier's own page; company disclosure), consistent with independent WebSearch results (Wikipedia's "American Humane Certified" page corroborates the program's existence and scope description).

**Exact certification year (2013 vs. 2014): Flag DISPUTED** — correctly already flagged as such by the raw file; I found nothing in independent searching to resolve the conflict either way. Preserve as DISPUTED at Stage 4.

**PETA's criticism and FTC complaint — flag this precisely, per the specific concern raised for this fact-check:**
- **"PETA filed a complaint with the FTC": Flag VERIFIED**, not just an advocacy claim — I independently found PETA's own press release, "PETA Files FTC Complaint Over Inhumane Treatment of Butterball Birds" (peta.org/media/news-releases), which is a primary source (an organization's own disclosure of its own action), corroborated by contemporaneous Washington Post coverage ("PETA wants 'humanely raised' label stripped from Butterball turkeys," Nov. 2014). The filing itself is real and confirmed, not merely alleged.
- **"The FTC took action / found problems with the program": Flag UNVERIFIED — no evidence found, and this must NOT be written as if the FTC substantiated PETA's claims.** I independently searched for any FTC response or enforcement action and found none. The only FTC-side information available (via a Snopes fact-check that quotes an FTC spokesperson) is that the FTC does not make complaints public and does not comment on outcomes unless there is an enforcement action — which is itself not confirmation that any review or action occurred, just standard agency non-disclosure practice. The raw file's own hedging ("no confirmation found that FTC took any enforcement action... treat as alleged/unresolved, not a finding of deceptive advertising") is accurate and should be preserved exactly as written at Stage 4 — do not upgrade this to read as "FTC found problems with the program."
- Severity if logged as an `issues[]` entry: **low** — single-source (PETA) advocacy criticism of a real, existing third-party certification's rigor; no adjudicated finding, no confirmed regulatory action.

---

## Flag distribution summary

| Claim | Flag |
|---|---|
| GAP absent | VERIFIED |
| Certified Humane absent | VERIFIED |
| AGW/AWA absent | VERIFIED (caveat: not personally re-run, corroborated by parallel-method success + WebSearch) |
| USDA PVP / No Antibiotics Ever, 3 plants | VERIFIED |
| Water-chilled (Mount Olive) | UNVERIFIED (secondary trade-press source) |
| 2019 recall — weight/date/product/hospitalization/states | VERIFIED |
| 2019 recall — illness count | DISPUTED — raw file's "6" is the early count; CDC's own final tally is 7; raw file's "5 case-patients/2 states" sub-figure is unsupported and should be dropped |
| Seaboard 50%→52.5% stake, FY2022 | VERIFIED |
| Seaboard Item 1A risk-factor exact quotes | UNVERIFIED-by-me (not independently re-fetched) |
| Figueroa district-court docket facts | VERIFIED |
| Figueroa interlocutory appeal denial | VERIFIED |
| Figueroa 4th Cir. merits affirmance (Jan 13, 2026) | UNVERIFIED (high-confidence, secondary-source corroborated; not a hallucinated date) — plus new fact: en banc rehearing petition filed Jan 26, 2026, outcome unknown |
| American Humane Certified — program exists, AHA-verified | VERIFIED |
| American Humane Certified — exact year (2013 vs 2014) | DISPUTED |
| PETA filed FTC complaint | VERIFIED |
| FTC took action on PETA's complaint | UNVERIFIED — no evidence found; do not upgrade |

**Severity assignments made:** 2019 recall = low; American Humane Certified/PETA advocacy criticism = low. No high or medium severity items identified in this file (Figueroa was adjudicated against the plaintiff at the panel level, not a settlement or finding against Butterball, so it does not carry a severity tag under this rubric — it would only become relevant to `issues[]` if the en banc petition or further appeal reverses the outcome).
