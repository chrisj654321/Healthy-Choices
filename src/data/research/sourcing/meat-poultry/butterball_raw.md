# Butterball LLC — Stage 2 raw research

companyId: `butterball` | Industry module: meat-poultry | Research pass: 2026-08-05

Read-only research. Raw facts only — no scoring, no characterization, no comparison language. Follows evidence-schema.md and industry-modules.md (meat-poultry section) doctrine.

## NOT CHECKED — flagged up front

- None of the nine assigned sources were fully unreachable. Two sub-items were only partially resolvable and are flagged inline below:
  - USDA-FSIS "other/additional enforcement actions beyond the two already-logged NC plant sanitation violations" — direct fsis.usda.gov noncompliance-report search returned only a FOIA-request-log reference (a pending FOIA request for Butterball/Prestage noncompliance reports, filed by a third party, not yet fulfilled as of the log's publish date). No searchable public noncompliance-report database was reachable for a systematic pull beyond the two recalls documented below. Treat "other FSIS noncompliance reports beyond the Raeford/Mount Olive Oct 2025 findings" as NOT CHECKED — the FOIA index page was the only avenue found and it doesn't itself contain report contents.
  - Air-chilled vs. water-chilled: Butterball's own consumer/technical disclosures (butterball.com, butterballfoodservice.com) were not the source that yielded this fact — a trade-press technical profile was. Butterball's own site was searched via WebSearch/WebFetch but no dedicated "how we process" chilling-method page surfaced. The trade-press source below is treated as reliable (on-the-record plant-manager interview, named individuals, specific equipment) but note it describes ONE plant (Mount Olive, NC) specifically, not a company-wide statement covering Huntsville, AR or Raeford, NC.

---

## 1. GAP (Global Animal Partnership) — gap.globalanimalpartnership.org / globalanimalpartnership.org

**ABSENT — genuine search completed.** Loaded globalanimalpartnership.org's "For Shoppers" full partner/brand directory page (the site's complete public-facing list of G.A.P.-certified partner brands, retailers, and farms, covering beef/chicken/pork/turkey/lamb at all steps). Captured full page text (~15,000 characters, every listed partner). Turkey-labeled partners present on the list: Diestel Turkey / Diestel Turkey Ranch (Step 3), Evermore Pet Food (Turkey Step 2), Campfire Treats (Turkey Step 1, 2), Rossdown Natural Foods (Turkey Step 1 & 2), Earth Animal (Turkey Step 1), Mary's Turkey (Turkey Step 3 & 5), JD Farms Specialty Turkey (Turkey Step 1), Yorkshire Valley Farms Ltd. (Turkey Step 2), Tender & True Pet Nutrition (Turkey Step 1), Applegate Farms (Turkey Step 1), Freshpet (Turkey Step 1). **Butterball does not appear anywhere on this list.**
- Source: Global Animal Partnership, "For Shoppers" — https://globalanimalpartnership.org/shoppers/ — accessed 2026-08-05.

## 2. Certified Humane (certifiedhumane.org)

**ABSENT — genuine search completed.** Navigated to certifiedhumane.org's "Who's Certified" searchable producer/product database (certifiedhumane.org/whos-certified/) and ran its client-side search for "Butterball" (confirmed via direct DOM inspection that the search executes against the full loaded dataset, not just the visible page — result: "No matching records found").
- Cross-check: certifiedhumane.org's own "Where to find a Certified Humane turkey for Thanksgiving" editorial post lists named Certified Humane turkey producers — Koch's Turkey Farm (PA), White Oak Pastures (GA), Ayrshire Farm (VA), Footsteps Farm (CT). Butterball is not named.
- Note: Butterball's own marketing and press use the term "American Humane Certified" (see section 9 below), a DIFFERENT certification program run by the American Humane Association — not Certified Humane / Humane Farm Animal Care. These are frequently confused; do not conflate them.
- Sources: https://certifiedhumane.org/whos-certified/ (site search executed 2026-08-05); https://certifiedhumane.org/where-to-find-a-certified-humane-turkey-for-thanksgiving/ — accessed 2026-08-05.

## 3. A Greener World / Animal Welfare Approved (agreenerworld.org)

**ABSENT — genuine search completed.** Ran AGW's own directory search (agreenerworld.org/gd-search-results/?s=Butterball) — result page: "Search Results — No listings were found matching your selection."
- Source: A Greener World directory search — https://agreenerworld.org/gd-search-results/?s=Butterball&post_type=gd_place — accessed 2026-08-05.

## 4. USDA Process Verified Program (ams.usda.gov)

**PRESENT — confirmed PVP listing, government-audited.** Butterball, LLC has an active USDA AMS Process Verified Program listing. Exact page contents:
- Commodity: Turkey
- Location(s) covered: Huntsville, AR (Est. P7174); Mount Olive, NC (Est. P7345); Raeford, NC (Est. P46870)
- Process Verified Point(s) listed on the page:
  1. "No Antibiotics Ever – from the egg to the day of hatch to processing, these birds receive absolutely no antibiotics of any kind."
  2. "Poultry Export Verification Program for Korea and South Africa (Est. P7345 only) – for the export of poultry and poultry products to Korea and South Africa."
- This means Butterball's "No Antibiotics Ever" claim is USDA-AMS-audited (auditors verify hatchery, feed mill, farm, and processing-plant compliance under the PVP program per industry-modules.md's description of how PVP works) — not merely a company disclosure, for the three plants named. No indication from this page whether ALL Butterball turkey products carry this claim company-wide, or only specific product lines produced at these plants — scope is plant-level as listed, not asserted as 100% of Butterball's output.
- Source: USDA Agricultural Marketing Service, "Butterball, LLC Process Verified Program" — https://www.ams.usda.gov/content/butterball-llc-process-verified-program — accessed 2026-08-05 (page undated; content reflects current AMS listing as of access date).

## 5. Air-chilled vs. water-chilled processing

**PRESENT — water-chilled, one plant confirmed by name.** MEAT+POULTRY (trade press, Sosland Publishing), in a profile titled "Controlled growth" (URL slug: butterball-implements-controlled-growth) based on an on-site interview at Butterball's Mount Olive, NC facility with named plant staff (Craig Leviner, manufacturing director; Art Lankford, VP of operations), states:

> "Once eviscerated and ready, the super toms move to an approximately five-hour chilling process to bring temperatures from 104°F down to 40°F. The new Morris chilling system was installed to replace the previous system last year. Four hallways 180 feet long house the multi-function system, two agitating and two screw-type functions. The chilling water also contains a peracetic acid additive to control Salmonella."

This describes an immersion/agitation water-chill system (a "Morris chilling system"), i.e., **water-chilled**, not air-chilled, at the Mount Olive plant. No equivalent on-the-record confirmation found for the Huntsville, AR or Raeford, NC plants specifically — treat as Mount Olive-confirmed, company-wide unconfirmed.
- Source: MEAT+POULTRY, "Controlled growth" — https://www.meatpoultry.com/articles/29906-butterball-implements-controlled-growth — accessed 2026-08-05 (publish date not visible in rendered page text; article references the Mount Olive plant's 2017-era equipment install, consistent with a ~2018 publish window based on related trade coverage found in the same search).

## 6. USDA-FSIS enforcement (beyond the already-logged Oct 2025 Raeford/Mount Olive sanitation violations)

**One additional recall found, not currently in the company record — recommend for Stage 4 recalls[] array:**

- **2019 Salmonella Schwarzengrund recall.** FSIS recall notice: Butterball, LLC (Mount Olive, NC establishment) recalled approximately 78,164 lbs of raw ground turkey products (multiple fat percentages, plus a Food Lion-branded ground turkey line) on March 13, 2019, for possible contamination with Salmonella Schwarzengrund. Product had a sell/freeze-by date of 7/26/18 and lot code 8188, produced 7/7/2018, shipped to institutional and retail locations nationwide. CDC/FSIS multistate outbreak investigation (with Wisconsin DHS, Wisconsin DATCP) tied to this recall: 6 illnesses reported across Minnesota, North Carolina, and Wisconsin (5 case-patients from 2 states per one FSIS figure, 6 ill people per CDC's count across 3 states — sources give slightly different counts, both cited below), 1 hospitalization.
  - Source: FSIS recall notice, "Butterball LLC Recalls Turkey Products Due to Possible Salmonella Schwarzengrund Contamination" — https://www.fsis.usda.gov/recalls-alerts/butterball-llc-recalls-turkey-products-due-possible-salmonella-schwarzengrund — accessed 2026-08-05 (WebFetch directly blocked by site's bot protection; content captured via search-engine indexed summary, not direct page fetch — moderate confidence, cross-confirm at Stage 3 fact-check if possible).
  - Cross-source: CDC, "2019 Salmonella Infections Linked to Butterball Brand Ground Turkey" — https://archive.cdc.gov/www_cdc_gov/salmonella/schwarzengrund-03-19/index.html — accessed 2026-08-05.

- **Already logged, not duplicated here:** Oct 2021 blue-plastic ground turkey recall (~14,107 lbs, Class II) — already in companies.js `product-recall-2021`. Oct 2025 Raeford/Mount Olive FSIS sanitation noncompliance reports — already in companies.js `sanitation-violations-2025`.

- **FOIA-log-only lead, not a confirmed finding:** An FSIS FOIA request log (FOIA-Report-November-2025.pdf) shows a third-party FOIA request (ID 2026-FSIS-00024-F, submitted 11/17/2025) for "the most recent compliance or noncompliance reports for Butterball and Prestage Foods." This confirms a requester wanted more noncompliance-report data but does NOT itself contain report contents — not usable as a finding, listed here only so Stage 3/4 knows the lead exists.
  - Source: FSIS FOIA Requests Received log — https://www.fsis.usda.gov/sites/default/files/media_file/documents/FOIA-Report-November-2025.pdf — accessed 2026-08-05.

## 7. Seaboard Corporation SEC filings (ticker SEB)

**Ownership stake — CORRECTION CANDIDATE for the session brief's "50/50" description:**
- FY2021 10-K (filed 2022-02-15): "Seaboard has a 50% noncontrolling interest in Butterball, LLC ('Butterball'), a vertically integrated producer and processor of conventional, antibiotic-free and organic turkey products."
- FY2022 10-K (filed 2023-02-14): "Seaboard has a 52.5% noncontrolling interest in Butterball, a producer and processor of conventional and antibiotic-free turkey products."
- FY2023 10-K (filed 2024): "Seaboard has a 52.5% investment in Butterball, a producer and processor of conventional and antibiotic-free turkey products."
- **Seaboard's stake increased from 50% to 52.5% during fiscal year 2022** (change appears between the FY2021 and FY2022 filings). This makes the "50/50 joint venture" framing in the session brief stale as of the FY2022/FY2023 filings — Seaboard now holds a slight majority economic interest (52.5%), though it is still accounted for as a noncontrolling/equity-method interest, meaning Seaboard does not consolidate Butterball's financials. The Rea family / Maxwell Farms side presumably holds the remaining ~47.5%, not confirmed directly in the filings reviewed.
- Also note: the FY2021 filing's segment description included "organic turkey products" as part of Butterball's product mix; this phrase was dropped from the FY2022 and FY2023 descriptions ("conventional and antibiotic-free" only) — raw fact, not characterized (could reflect a real change in product mix or just a description-language change; not resolvable from the 10-K text alone).
- Source: Seaboard Corporation FY2021 10-K, Item 1 (Business) — https://www.sec.gov/Archives/edgar/data/88121/000008812122000017/seb-20211231x10k.htm — accessed 2026-08-05.
- Source: Seaboard Corporation FY2022 10-K, Item 1 (Business) — https://www.sec.gov/Archives/edgar/data/88121/000008812123000020/seb-20221231x10k.htm — accessed 2026-08-05.
- Source: Seaboard Corporation FY2023 10-K, Item 1 (Business) — https://www.sec.gov/Archives/edgar/data/88121/000008812124000025/seb-20231231x10k.htm — accessed 2026-08-05.

**"Specific Turkey Segment Risks" (FY2023 10-K, Item 1A Risk Factors):**
Two named risk items specific to the Turkey segment, quoted in full below (both are business/brand-value risks, NOT animal-welfare or environmental-compliance risks — no such risk factor was found specific to Butterball in this filing):
1. "Decreased Perception of Value in the Butterball Brand and Changes in Consumer Preferences Could Adversely Affect Sales Quantity and Price of Butterball Products. ... In addition, negative news reports for any reason related to Butterball specifically or the turkey/poultry industry generally could negatively impact this brand perception, Butterball's results of operations and the value of Seaboard's investment in Butterball."
2. "Adverse Operating Results Could Result in Need for Raising Additional Capital. Butterball has third-party bank loan facilities that are secured by substantially all of the assets of Butterball. ..."
- Source: same FY2023 10-K as above, Item 1A — accessed 2026-08-05.

**Sourcing model (company-owned vs. contract growers):** The FY2023 10-K's only "contract grower" language found is in the Notes to Financial Statements (leases footnote) and explicitly describes Seaboard's PORK segment ("Seaboard leases ports, vessels, contract grower assets... caring for hogs in its contract grower agreements") — it does NOT describe Butterball/turkey sourcing. No turkey-specific sourcing-model disclosure (own flocks vs. contract growers) was found in any of the three 10-Ks reviewed; Seaboard's turkey segment section is brief (a few sentences) because Butterball is an equity-method investee, not a consolidated subsidiary, so its operational detail isn't broken out the way Seaboard's own Pork/Marine/CT&M segments are. **Sourcing model: not resolved from SEC filings — mark `unknown`/`company-disclosure` pending a Butterball-direct source at Stage 4, not `contract-farms` inferred from the pork-segment language.**

**Litigation:** FY2023 10-K's general "Legal and Regulatory Risks" boilerplate (Item 1A) is company-wide, not Butterball-specific: "Trends in litigation may include class actions involving employees, consumers, competitors, suppliers, shareholders, or injured persons, and claims relating to product liability, contract disputes, antitrust regulations, intellectual property, advertising, labeling, wage and hour laws, employment practices or environmental matters." No Butterball-specific litigation matter is named in the Legal Proceedings section of the FY2023 10-K (the named litigation matters disclosed there — e.g., Helms-Burton Act litigation re: Cuba — are unrelated to Butterball).

## 8. Court records (CourtListener / RECAP)

Reviewed the full 19-result "Butterball" batch in `_wave2_primary.json`. Most are single- or few-plaintiff employment suits (wage/hour, civil rights jobs, FMLA) — consistent with the task's expectation that these are noise for this module. None found to be a consumer-protection/false-advertising suit or an animal-welfare suit. One genuine class/collective claim identified and researched in depth:

**Figueroa v. Butterball, LLC — wage/hour collective and class claim, RESOLVED against the plaintiff.**
- District court case: Figueroa v. Butterball, LLC, No. 5:20-cv-00585 (E.D.N.C.), filed Nov. 4, 2020, terminated Aug. 23, 2024. Cause: 29 U.S.C. §201, denial of overtime compensation. Plaintiff Osvaldo Figueroa, a turkey loader (piece-rate pay: $12/truckload plus $8.96/hour for hours worked beyond 40/week), brought FLSA and North Carolina Wage and Hour Act (NCWHA) claims, framed as a proposed collective/class action ("on behalf of himself and all others similarly situated").
  - Source: https://www.courtlistener.com/docket/18605777/figueroa-v-butterball-llc/ — accessed 2026-08-05.
- Interlocutory appeal (the docket the brief flagged, No. 22-289, 4th Cir.): This was a Rule 5 / 28 U.S.C. §1292(b) "Petition for Permission to Appeal" the district court's July 27, 2022 order — NOT a ruling on the merits. Filed Oct. 13, 2022; the Fourth Circuit issued a COURT ORDER DENYING the motion for permission to appeal on Nov. 4, 2022 — that's why the docket terminated so fast. This was simply the appellate court declining to hear an early appeal; the underlying case continued in district court.
  - Source: https://www.courtlistener.com/docket/69209283/osvaldo-figueroa-v-butterball-llc/ — accessed 2026-08-05 (full docket entries captured directly).
- Merits appeal (reached after district court final judgment): Figueroa v. Butterball, LLC, No. 24-1861 (4th Cir.), decided Jan. 13, 2026. Per Bloomberg Law ("Butterball Gets Poultry Worker's Would-Be OT Class Suit Tossed") and Justia case summary: the district court dismissed Figueroa's NCWHA claims with prejudice and ultimately ruled against his FLSA claim too, finding his paystubs "directly refute Figueroa's claim that Butterball owed him a higher overtime rate because they reflect a piece-rate, not hourly, pay scheme" — i.e., the court held Figueroa was properly classified as a piece-rate employee and Butterball had correctly calculated/paid overtime. The Fourth Circuit AFFIRMED. Status: **adjudicated**, resolved in Butterball's favor (proposed class/collective claim rejected).
  - Source: Bloomberg Law, "Butterball Gets Poultry Worker's Would-Be OT Class Suit Tossed" — https://news.bloomberglaw.com/litigation/butterball-gets-poultry-workers-would-be-ot-class-suit-tossed — accessed 2026-08-05.
  - Source: Justia, Osvaldo Figueroa v. Butterball, LLC, No. 24-1861 (4th Cir. 2026) — https://law.justia.com/cases/federal/appellate-courts/ca4/24-1861/24-1861-2026-01-13.html — accessed 2026-08-05 (WebFetch blocked by site; identified via search-engine summary only, not directly read — moderate confidence, recommend direct read at Stage 3 fact-check if possible).

**Other multi-plaintiff labor suits reviewed, not flagged as significant for this module (listed for completeness, not to be duplicated as findings):**
- Cardenas v. Butterball, LLC, 1:14-cv-08589 (N.D. Ill.), filed 2014-10-30, terminated 2016-02-04. FLSA claim brought by 5 named plaintiffs (Cardenas, Contreras-Torres, Ortiz, Rojas, Rosiquez Perez). Docket viewed directly; outcome/settlement terms not visible in the free docket entries reviewed (would require PACER purchase to confirm resolution). Wage/hour matter, not welfare or consumer-protection — noise for this module per the task's framing, noted only in case Stage 3 wants to verify further.
- Graham v. Butterball, LLC et al., 2:22-cv-02026 (W.D. Ark.), filed 2022-02-02. "Other Statutory Actions." Per Justia docket summary: court granted Butterball's and co-defendant Christopher Marr's Motion for Summary Judgment on 2023-03-22 (Judge P.K. Holmes III) — i.e., resolved in Butterball's favor. Underlying claim type not confirmed from available free sources (not confirmed as welfare or consumer-protection related; flagged only, not a finding).
- Marc v. Butterball, LLC, 5:25-cv-00391 (E.D.N.C.), filed 2025-07-03, **PENDING/ONGOING** as of last docket update Aug. 3, 2026. No nature-of-suit code visible on the free docket. Docket entries include "Consent - Party Plaintiff" filings (Sep. 18, 2025 and others) — a filing type characteristic of FLSA collective-action opt-ins, suggesting this is likely another wage/hour collective action, but this is an inference, not confirmed from the complaint itself (which sits behind a PACER paywall). Status: alleged/pending, unresolved. Flag for a future research pass once resolved.

## 9. Existing company record (src/data/companies.js, `butterball` entry, line ~1770)

Existing `issues[]` array already logs (verified, NOT duplicated in this file's findings above):
- `sanitation-violations-2025` — FSIS noncompliance at Raeford, NC (Oct 27, 2025) and Mount Olive, NC (Oct 15–17, 2025) plants.
- `product-recall-2021` — ~14,107 lb ground turkey recall, blue plastic contamination, Class II.
- `covid-worker-safety-2020` — 2020 OSHA/NC OSH complaints, dismissed/no jurisdiction finding.
- `animal-welfare-record` — 2012 undercover animal-cruelty investigation; Good Jobs First Violation Tracker ~$19.6M across 21 enforcement records.

Existing record also states `subsidiaries: ['Butterball']` (self-referential, likely a data artifact) and does not currently contain any `sourcing` block, GAP/Certified Humane/PVP data, or the American Humane Certified fact below — all new to this research pass.

## 10. American Humane Certified (found opportunistically during Certified Humane research — third-party certification, not one of the nine assigned sources but directly relevant to `certifications[]`)

**PRESENT — real third-party certification, distinct from Certified Humane and GAP.**
- Butterball became the first (and per multiple 2013-era sources, remains the only) commercial turkey company to hold "American Humane Certified" status, first awarded in 2013 (one source: American Humane Society producer spotlight; another dates initial certification to 2014 — sources conflict on exact year, both are cited below).
- Verifier: American Humane Association (AHA), through its American Humane Certified™ Farm program.
- Standard: per AHA's own materials, "200 rigorous, science-based standards annually audited by AHS [American Humane Society]." AHA describes its program as "the first and largest Farm Animal Welfare Audit Program in the U.S." Audits are annual and may be unannounced.
- Scope: per Butterball's own statements, the certification covers "contract farmers, operations team, transportation partners and harvest facilities" — i.e., described by Butterball as covering its full turkey supply chain, not one product line. (This scope claim is Butterball's own description of AHA's audit coverage — treat the SCOPE claim as company-disclosure even though the certification itself is third-party.)
- Sources: American Humane Society, "American Humane Certified™ Producer Spotlight: Butterball" — https://www.americanhumane.org/article/american-humane-certified-producer-spotlight-butterball/ — accessed 2026-08-05. Butterball Foodservice press release, "Butterball to Earn American Humane Certified™ Program Recognition for Third Consecutive Year" — https://www.butterballfoodservice.com/press-releases/butterball-to-earn-american-humane-certified-program-recognition-for-third-consecutive-year/ — accessed 2026-08-05.

**Third-party criticism of this certification (advocacy source, not adjudicated — record as a fact that criticism exists, not as a truth claim about the certification's validity):**
- PETA published a "Consumer Alert" article (Nov. 13, 2014, updated Aug. 20, 2024) titled "Don't Be Fooled by Butterball's 'Humane' Label," arguing the American Humane Certified standard is "nearly indistinguishable from standard industry practice," and stating PETA "filed a formal complaint with the Federal Trade Commission" over the label (no confirmation found that FTC took any enforcement action on this complaint — treat as alleged/unresolved, not a finding of deceptive advertising).
- Source: PETA, "CONSUMER ALERT: Don't Be Fooled by Butterball's 'Humane' Label" — https://www.peta.org/news/consumer-alert-dont-fooled-butterballs-humane-label/ — accessed 2026-08-05 (published 2014-11-13, last updated 2024-08-20 per page).

---

## Summary of what's usable at Stage 4 vs. what needs another pass

**Clean, sourced facts ready for Stage 4 schema-writing:**
- GAP: absent (genuine search)
- Certified Humane: absent (genuine search)
- AGW/AWA: absent (genuine search)
- USDA PVP: present, "No Antibiotics Ever," 3 named plants, government-audited
- Chill method: water-chilled (Mount Olive plant confirmed by name; company-wide not confirmed)
- 2019 Salmonella Schwarzengrund recall: new finding, not yet in companies.js
- Seaboard ownership stake: 52.5% (not 50/50) since FY2022 — correction candidate
- Figueroa wage/hour class/collective claim: adjudicated, resolved against plaintiff (Jan 2026)
- American Humane Certified: present, real third-party cert, with PETA's advocacy criticism as a separate, unadjudicated fact

**Needs another pass or Stage 3 fact-check verification:**
- FSIS 2019 recall page and Fourth Circuit 24-1861 opinion — both cited from search-engine summaries because direct WebFetch was blocked (403) by bot protection; browser-based fetch confirmed the FSIS/CDC facts independently across multiple sources (moderate-high confidence) but the 24-1861 opinion text itself was never directly read — recommend a direct read before quoting it in the final `enforcement[]` entry.
- Sourcing model (contract growers vs. company-owned flocks): unresolved from SEC filings; needs a Butterball-direct source.
- Marc v. Butterball (pending 2025 case): unresolved, monitor for outcome.
- Graham v. Butterball and Cardenas v. Butterball: underlying claim types not fully confirmed from free sources; likely not welfare/consumer-protection but not 100% ruled out either.
