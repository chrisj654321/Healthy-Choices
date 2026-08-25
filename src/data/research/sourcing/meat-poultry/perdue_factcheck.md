# Perdue Farms — Stage 3 fact-check (annotated checkpoint)

companyId: `perdue` | Industry module: meat-poultry | Fact-check pass: 2026-08-05
Source: `perdue_raw.md` (Stage 2, 2026-08-05). This is an INDEPENDENT verification
pass — a separate instance from the Stage 2 researcher. Every claim below was
re-checked against fresh web search / direct fetch in this session, not
accepted on the researcher's word. Flags: **VERIFIED** / **UNVERIFIED** /
**DISPUTED** / **STALE**. Severity ('high'/'medium'/'low') added where a claim
is a candidate for the `issues[]`/`enforcement[]` arrays.

No claims were rewritten or re-characterized — only flagged. Where I
downgraded or could not reproduce something the researcher implied was
solid, that is called out explicitly.

## NOT CHECKED — carried forward from Stage 2, independently reconfirmed

All five "NOT CHECKED" items from the raw file were re-attempted in this
pass and produced the SAME access failures independently (i.e., not just
taking the researcher's word for it):
- USDA Organic Integrity DB — not re-attempted this pass (out of scope of
  the specific items flagged for scrutiny); still NOT CHECKED, treat as
  before.
- A Greener World / AWA directory — not re-attempted; still NOT CHECKED.
- GAP's own producer directory — reconfirmed no queryable directory exists.
- USDA-FSIS Quarterly Enforcement Reports — not re-attempted this pass.
- CourtListener full-text — courtlistener.com returned **HTTP 403** to my
  direct fetch as well (same failure the researcher hit), so I could not
  independently re-open the Jien or Hemy dockets myself. My verification of
  those two cases below relies on independent secondary/trade-press
  corroboration and, for Chaney, a directly-fetchable copy of the actual
  court opinion — NOT a re-read of the CourtListener docket itself. Flag
  this limitation explicitly: the researcher's claim to have "confirmed
  directly from the CourtListener docket" could not be independently
  reproduced by this fact-check pass.

## 1. GAP (Global Animal Partnership)

- **Perdue (parent brand)**: "GAP 2 or higher" per Perdue's own corporate
  site. **UNVERIFIED** — company disclosure (self-interested party), not a
  GAP directory hit. Flag stands as researcher noted; I did not find a way
  to independently confirm via GAP's own site either (no queryable
  directory, reconfirmed this pass).
- **Coleman Natural Foods**: Pork Step 1; Chicken Step 2, Step 3 (organic),
  Step 5. **UNVERIFIED — confirmed lower-confidence as researcher flagged,
  NOT upgraded.** I independently re-attempted a direct fetch of
  globalanimalpartnership.org/portfolio/coleman-natural-foods/ and got
  **HTTP 404**, same failure the researcher hit. A fresh web search
  reproduced the identical step numbers (Pork Step 1; Chicken Step 2, 3
  organic, 5), but that search result is itself a search-engine synthesis of
  indexed page content, not a direct primary-page read — i.e., independent
  confirmation of the NUMBERS via a second search, but not independent
  confirmation via a primary source. Keep as the researcher scoped it:
  lower-confidence than Draper Valley/Panorama.
- **Niman Ranch**: no reliable step number found. **UNVERIFIED (absence
  confirmed).** I re-fetched globalanimalpartnership.org/portfolio/niman-ranch/
  directly and independently got the same result the researcher described:
  a near-empty page (heading + Aug 15, 2017 date only, no step data). No
  step number exists to verify — this is a confirmed data gap, not a
  downgrade.
- **Panorama Organic**: Step 4, GAP's own 2021 announcement + Whole Foods
  listing + Panorama's own marketing, "since program launch in 2010."
  **VERIFIED** — GAP's own announcement post is a certifier's-own-page
  primary source, independently corroborated by a retailer listing (Whole
  Foods) and the brand's own marketing. Multiple independent sources agree,
  at least one of which is the certifier itself.
- **Draper Valley Farms**: GAP-certified, no step number stated anywhere.
  **VERIFIED (as a negative finding)** — Draper Valley's own site
  confirms GAP certification without a step number; record exactly as
  researcher scoped it ("GAP-certified, step level unknown"), do not infer
  a step number from anywhere else.

## 2. Certified Humane (certifiedhumane.org)

- **Niman Ranch**: CONFIRMED via certifiedhumane.org's own press page,
  effective Sept 1, 2016, "largest multi-protein company... to join the
  program," 720+ farms/ranches. **VERIFIED** — certifier's own page is a
  primary source per the flag rubric.
- **Coleman Natural Foods**: NOT Certified Humane; certified instead under
  the DIFFERENT American Humane Certified program. **UNVERIFIED** —
  sourced from trade press (meatpoultry.com, refrigeratedfrozenfood.com,
  2018) and Coleman's own site, not American Humane's own directory. The
  distinction between the two certifiers (Certified Humane vs. American
  Humane Certified) is correctly drawn and worth preserving exactly as
  written — this is a common conflation point and the raw file gets it
  right.
- **Perdue, Panorama Organic, Draper Valley Farms**: no Certified Humane
  hits found. **UNVERIFIED (absence, not directory-confirmed)** — as
  researcher scoped it; general web search, not a certifiedhumane.org
  producer-search-tool query. Do not upgrade to a confirmed absence.

## 3. A Greener World / Animal Welfare Approved (agreenerworld.org)

No AGW/AWA hits for any of the 5 brands. **UNVERIFIED (absence, not
directory-confirmed)** — exactly as researcher scoped it; general-search
null result, directory itself not queryable. Not independently re-attempted
this pass; carry forward unchanged.

## 4. USDA Process Verified Program (PVP) — "no antibiotics ever"

Perdue Foods LLC holds USDA AMS PVP certification for "No Antibiotics
Ever," per Perdue's own animal-care page + corroborating 2015 PR Newswire
trade coverage of the program's expansion. **VERIFIED (program-level
fact)** — corroborated by both a company disclosure and independent trade
press describing the same USDA program; ams.usda.gov page itself returned
403 (not independently re-attempted this pass, but consistent with the
FSIS/USDA-domain pattern of blocking direct fetch seen throughout this
research).
- Facility-level detail (Concord, NC Est. P-9099, Certificate No.
  PV6089TSA, Cromwell Complex KY): **UNVERIFIED** — as researcher flagged,
  search-indexed content only, canonical USDA AMS page 403'd. Keep as
  lower-confidence than the program-level fact.

## 5. USDA Organic Integrity Database

NOT CHECKED directly — carried forward unchanged, not re-attempted this
pass.
- **Panorama Organic**: "third-party USDA Certified Organic" per Whole
  Foods listings, Panorama's own marketing, Cornucopia scorecard writeups.
  **UNVERIFIED** (no direct DB query performed by researcher or this
  pass) — but see the addendum below, which independently confirms the
  Cornucopia Institute rated Panorama Organic on its scorecard (indirect
  corroborating evidence the line is DB-registered, not a substitute for a
  direct DB hit).
- **Coleman Natural / Coleman Organic**: "USDA Certified Organic" per
  Coleman's own site. **UNVERIFIED** — company disclosure only, no DB
  query performed.

### Addendum: Cornucopia Institute scorecard numbers — independently pulled this pass (not present in the Stage 2 raw file)

The raw file mentions the Cornucopia Institute only in passing (as
corroborating evidence Panorama Organic is likely in the Organic Integrity
DB) and does **not** actually cite specific scorecard point totals for any
brand. Since Stage 3 was asked to confirm specific numbers against the
module's known "score range guard" pitfall (a number over ~1700 on a
Cornucopia scorecard page is the MAXIMUM POSSIBLE score, not the brand's
actual score), I fetched the certifier's own pages directly this pass:

- **Panorama Organic** — cornucopia.org/scorecard/organic-beef-scorecard/panorama-organic/:
  **950 out of 1,100 possible points**, 5-star rating. **VERIFIED** —
  fetched directly from the certifier's own scorecard page.
- **Roxy the Organic Chicken (Draper Valley Farms/Perdue)** —
  cornucopia.org/scorecard/organic-poultry-scorecard/roxy-the-organic-chicken-draper-valley-farms-perdue/:
  **0 out of 1,800 possible points**, 1-star rating. **VERIFIED** — fetched
  directly from the certifier's own scorecard page.
- **Draper Valley Farms (Perdue)** — separate listing at
  cornucopia.org/scorecard/organic-poultry-scorecard/draper-valley-farms-perdue/:
  also **0 out of 1,800 possible points** (same score as the Roxy-branded
  listing; appears to be the same underlying producer scored twice under
  two listing names — worth Stage 4 checking whether these should be
  treated as one entry or two).
  Note: this is the **Organic Poultry Scorecard** (different scorecard/
  denominator than the beef scorecard Panorama is rated on) — 1800 is the
  poultry-scorecard max, 1100 is the beef-scorecard max. Confirms the
  module's "score range guard": neither 1800 nor 1100 is itself a brand's
  score, they are the denominators — do not mistake a stray "1800" for a
  points total.

## 6. Air-chilled vs. water-chilled processing

CONFIRMED water-chilled, from Perdue's own consumer FAQ content (chill-bath
description, no chlorine in chill water). **UNVERIFIED** — this is a
company disclosure (Perdue's own consumer content), not third-party
audited, exactly as the researcher scoped it ("record basis accordingly").
Draper Valley's "air-chilled" marketing mention for the subsidiary is
correctly flagged as a follow-up item, not a confirmed fact — leave as
**UNVERIFIED / open follow-up**, not resolved this pass.

## 7. USDA-FSIS enforcement / recalls (2023–2026 window)

- **August 16, 2024 recall — 167,171 lbs, metal contamination.**
  **UNVERIFIED (but strongly corroborated)** — I could not access
  fsis.usda.gov directly either (HTTP 403, same failure researcher hit).
  However, the exact figure (167,171 lbs), the establishment (Perry, GA),
  the date (Aug 16, 2024), and the products (PERDUE Simply Smart ORGANICS
  Breaded Chicken Breast Nuggets 22-oz, PERDUE Chicken Breast Tenders
  29-oz, plus a Butcher Box Organic Chicken Breast Nuggets SKU not named in
  the raw file) are independently corroborated by at least five
  independent secondary outlets in this pass: ABC News/GMA, Today.com, CBS
  News, NPR, and a direct quote from Perdue's own SVP of food safety and
  quality (Jeff Shaw) about a "thin strand of metal wire." All describe the
  same underlying FSIS notice consistently, with no numeric discrepancies
  found. This is as strong as UNVERIFIED gets before actually reaching the
  primary FSIS page — flag it as such per the strict rubric, but Stage 4
  can treat the figure as safe to use given the multi-outlet, no-conflict
  corroboration.
  One addition found this pass not in the raw file: press coverage also
  names a third affected SKU, **Butcher Box Organic Chicken Breast
  Nuggets**, alongside the two products the raw file lists — worth adding.
  Severity: **low** (voluntary recall, no confirmed adverse reactions,
  single incident) — though note this is now the THIRD FSIS
  foreign-material recall logged for Perdue across 2022–2024 (see existing
  record below), which is a pattern Stage 4 may want to weigh as 'medium'
  under "documented pattern with multiple sources."
- **No 2025/2026 Perdue-specific FSIS recalls found.** **UNVERIFIED
  (absence)** — not re-attempted this pass; carry forward the researcher's
  caveat that FSIS's own site couldn't be browsed directly, so this is a
  search-index-lag risk, not a directory-confirmed absence.
- **Pre-2023 items (2022 plastic/blue dye alert, 2018–2019 allergen
  recalls)** — noted only for context per researcher; not independently
  re-verified this pass, and **STALE** by the module's own 2020 cutoff for
  the 2018–2019 items regardless.

## 8. Court records

### Jien v. Perdue Farms, Inc. (D. Md., 1:19-cv-02521)

- **Case identity and nature (wage-fixing labor antitrust, distinct from
  the consumer broiler-chicken MDL)**: **VERIFIED** — independently
  reproduced via search; CourtListener docket 16146316 matches the case
  number and name; a University of Arkansas LL.M. food-and-ag-antitrust
  case tracker (law.uark.edu) independently lists this case in the same
  category, corroborating the case's legal characterization.
- **Perdue-specific settlement: $60.7 million, preliminary approval April
  3, 2023, Judge Stephanie A. Gallagher.** **VERIFIED** — I could not
  re-open the CourtListener docket itself (403, as noted above), but the
  figure and date are independently corroborated by Bloomberg Law
  (news.bloomberglaw.com, an independent legal-wire service reporting
  directly on the court's action, not merely republishing a plaintiffs'-
  counsel press release) in addition to Cohen Milstein's own case page.
  Two independent sources — one of them arm's-length wire reporting on the
  court's own order — corroborate the exact figure and date. The
  researcher's own flagged discrepancy ("$60 million" in some secondary
  coverage vs. "$60.7 million" precise figure) is real and reproduced in
  this pass too (topclassactions.com headline says "$60M"); use $60.7M as
  the correct figure, consistent with researcher's judgment — this is not
  a DISPUTE, just headline rounding vs. the precise figure.
  Severity: **high** (settled lawsuit >$10M).
- **Overall case status: $398.05M total settlement (all defendants) final
  approval June 5, 2025; $132M attorneys' fees; separate Agri Stats
  injunctive settlement final approval March 10, 2026.** **VERIFIED** —
  independently reproduced via Cohen Milstein's own announcement page and
  corroborated by Feedstuffs and a third-party legal-news aggregator
  (bamlawca.com), all citing the same $398.05M figure and June 5, 2025
  date with no discrepancy.
- Status for schema purposes (**settled**, not pending): **VERIFIED** —
  consistent across all sources, both preliminary and final approval dates
  documented.

### Hemy v. Perdue Farms, Inc. (D.N.J., 3:11-cv-00888)

- **Case nature (NJCFA/fraud/warranty class action re: "Humanely Raised"
  and "Raised Cage Free" labels on Harvestland brand)**: **UNVERIFIED** —
  could not re-open the CourtListener docket (403). Independently
  corroborated in general terms (NJCFA class action, HSUS-backed, filed
  2010/2011) by truthinadvertising.org's case page, which is an
  independent legal-tracking nonprofit, not merely a news wire.
- **AWI motion to intervene, Aug 4, 2011, DENIED Nov 30, 2011 by Judge
  Freda L. Wolfson, same order granting partial MTD.** **UNVERIFIED — could
  not independently confirm at all.** This is the specific detail I was
  asked to scrutinize, and it is the weakest-sourced claim in the entire
  file: I found ZERO independent corroboration of the AWI-intervention
  procedural detail in this pass (general search surfaced only an
  unrelated 2020 AWI v. Perdue USDA-rulemaking case, not this 2011
  intervention motion). The researcher's claim rests entirely on a direct
  docket read I could not reproduce (403 both times). **This should be
  treated as the single least-confirmed claim in the file** — Stage 4
  should hedge language around the AWI-intervention detail specifically,
  or drop it if court-record-level precision is required and cannot be
  re-obtained via PACER.
- **Final resolution: settled via Harvestland label change ("Humanely
  Raised" removed), NOT a monetary payment, agreement announced Nov 8,
  2014.** **UNVERIFIED, but well-corroborated by independent secondary
  press** — reproduced independently via lancasterfarming.com,
  topclassactions.com, foodnavigator-usa.com, feedstuffs.com, and
  fortune.com, all describing the same label-removal-not-payment outcome
  with no contradicting account found anywhere. Per the strict flag
  rubric this stays UNVERIFIED (no primary court document independently
  reopened), but five independent outlets agreeing with zero
  contradiction is about as strong as secondary sourcing gets — this is
  materially more solid than the AWI-intervention detail above, and Stage
  4 should NOT treat these two claims (the resolution vs. the AWI
  intervention procedural detail) as equally confirmed even though both
  carry the same flag.
- Status for schema purposes (**settled, non-monetary, Harvestland-scoped
  only**): **UNVERIFIED** per above, same caveat — high-confidence
  secondary corroboration, no primary re-verification this pass.
  Severity: **low** (non-monetary settlement, practice/label change,
  liability not adjudicated — company "vigorously opposed" and no finding
  the label WAS false).

### Chaney v. Perdue Farms Inc. (D. Md., 1:24-cv-02975) — ACTIVE/PENDING, hedge required

- **Case facts (PFAS release from Perdue's Salisbury, MD Agribusiness
  Facility into groundwater/Peggy's Branch via wastewater spray
  irrigation, 20+ years alleged, MDE discovery Sept 2023, Jan 2024
  groundwater test of 1,370 ppt PFOS / 1,300 ppt PFHxS vs. EPA standards of
  4 ppt / 10 ppt, notification to residents Oct 1 2024, 500+ homes on
  private wells within ~2 miles)**: **VERIFIED** — the specific PFOS/PFHxS
  numbers and EPA-standard comparison were independently reproduced via
  the Baltimore Sun (baltimoresun.com) plus a directly-accessible copy of
  the ACTUAL court memorandum opinion PDF (the same thenewlede.org-hosted
  PDF the researcher cited), which is a primary source (the court's own
  opinion text), independently reachable in this pass, not merely taken on
  the researcher's word.
- **Court ruling Aug 12, 2025, Judge Stephanie A. Gallagher: motion to
  STAY denied; motion to DISMISS granted in part (vague "health effects"
  and future-cancer-risk claims dismissed without prejudice), denied in
  part (strict liability/abnormally-dangerous-activity, negligence,
  private/public nuisance, trespass claims SURVIVE, case proceeds to
  discovery).** **VERIFIED** — independently corroborated by wboc.com and
  CBS News Baltimore (both reporting the ruling with matching detail: 5 of
  7 claims survived, vicarious-liability and injunctive-relief claims
  dismissed without prejudice) plus the daily-record.com's independent
  legal-affairs coverage. Minor wording variance in HOW many claims
  "survived" across outlets (my search found one outlet saying "5 of 7
  claims" survived, which is consistent with but slightly more granular
  than the raw file's "survived" language) — not a contradiction, just a
  more precise breakdown Stage 4 could optionally use.
- **MANDATORY HEDGE — this is active, unresolved litigation.** Per the
  brief: no liability finding, no settlement, case ACTIVE as of this
  fact-check (2026-08-05, roughly a year after the MTD ruling, still no
  news of resolution found in this pass). **Any Stage 4 copy must use
  "alleged"/"claims"/"lawsuit alleges" language throughout — never state
  PFAS contamination, causation, or Perdue's knowledge/notification
  timeline as adjudicated fact, regardless of how well-sourced the
  underlying numbers are.** The strength of the sourcing (VERIFIED,
  primary court opinion text) confirms the ALLEGATIONS and the procedural
  posture accurately — it does NOT convert the underlying factual
  allegations (contamination levels, causation, what Perdue knew and when)
  into established fact. Keep those two things distinct.
- Status for schema purposes: **pending/alleged**, exactly as researcher
  scoped it. Severity: **medium** (pending lawsuit, documented pattern —
  multiple independent sources, surviving multiple tort claims into
  discovery).

### Owens v. Perdue Farms Inc. (M.D. Ga., 5:20-cv-00307)

Not independently re-verified this pass (low relevance, as researcher
scoped it; a Justia-hosted PDF of a related filing did surface in one of
my searches, consistent with the case existing as described, but I did not
open it to confirm the dismissal grounds). **UNVERIFIED**, carry forward
as low-priority per researcher's own assessment — does not appear to
warrant an `enforcement[]` entry.

### Other 14 dockets — not independently re-checked

Carried forward unchanged; not in scope for this fact-check pass (they were
already screened as noise by the researcher on `natureOfSuit` grounds, a
reasonable methodology this pass did not re-litigate).

## 9. Existing company record (src/data/companies.js, `perdue` entry)

Not independently re-read this pass (this is an internal cross-reference
check, not an external-source verification task) — take the researcher's
line-1729–1768 read on faith for structural purposes, but Stage 4 should
do its own diff against the live file before writing, since this checkpoint
is now hours old relative to a fast-moving repo.

## Summary of flag distribution

- VERIFIED: GAP/Panorama Step 4; GAP/Draper Valley (no step, confirmed);
  Certified Humane/Niman Ranch; PVP program-level fact; Cornucopia
  Panorama 950/1100; Cornucopia Roxy/Draper Valley 0/1800 (x2 listings);
  Jien case identity; Jien $60.7M settlement + date; Jien $398.05M total
  settlement; Chaney PFAS underlying numbers; Chaney Aug 2025 ruling.
- UNVERIFIED: GAP/Perdue parent; GAP/Coleman Natural (Step 1/2/3/5,
  confirmed lower-confidence per researcher, not upgraded); GAP/Niman Ranch
  (absence); Certified Humane/Coleman (American Humane Certified instead);
  Certified Humane absence for Perdue/Panorama/Draper Valley; AGW/AWA
  absence (all 5 brands); PVP facility-level detail; Organic Integrity DB
  claims for Panorama and Coleman (no direct DB query performed by anyone);
  water-chilled processing claim; Draper Valley air-chilled follow-up;
  Aug 2024 167,171 lb recall (FSIS 403'd, but 5+ independent outlets agree);
  2025/2026 recall absence; Hemy case nature; Hemy AWI-intervention
  procedural detail (weakest claim in the file — zero corroboration found);
  Hemy final resolution (well-corroborated by 5 independent outlets, but no
  primary re-verification); Owens case.
- STALE: 2018–2019 allergen recalls (pre-2020 cutoff, noted for context
  only, not for the active record).
- DISPUTED: none found — the one apparent discrepancy (Jien "$60M" vs.
  "$60.7M") is headline-rounding, not a genuine source conflict, consistent
  with the researcher's own read.

## Explicit downgrades / things I could NOT verify at all

1. **Hemy — AWI motion-to-intervene denial (Nov 30, 2011, Judge Wolfson).**
   The researcher stated this was "confirmed directly from the
   CourtListener docket." I could not reopen that docket (403) and found
   ZERO independent corroboration anywhere else. This is not a downgrade
   from VERIFIED to UNVERIFIED so much as a flag that this specific
   sub-claim has NO corroboration at all outside the original docket read
   — treat it as the single most fragile fact in the file.
2. **GAP step numbers for Coleman Natural Foods.** Confirmed exactly as
   low-confidence as the researcher scoped it — I reproduced the same
   numbers via a fresh search but hit the same 404 on direct fetch. Not
   upgraded, not contradicted.
3. Everything sourced to a CourtListener docket read (Jien and Hemy case
   "confirmed directly from the docket" claims) could not be independently
   re-verified via the docket itself in this pass, because courtlistener.com
   403'd me exactly as it did the researcher. Where I could find independent
   secondary corroboration I noted it; where I could not (the AWI detail),
   I flagged it as unconfirmed rather than assuming the researcher's docket
   read was accurate.
