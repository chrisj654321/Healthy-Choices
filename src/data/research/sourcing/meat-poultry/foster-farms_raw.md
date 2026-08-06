# Foster Farms — Stage 2 raw research

companyId: `foster-farms`
Legal entity: Foster Poultry Farms LLC (owned by Atlas Holdings since June 2022)
Researched: 2026-08-05

Raw facts only. No characterization/scoring. Basis label on every claim.

**NOT CHECKED flags (top of file, per doctrine):**
- A Greener World / Animal Welfare Approved directory (agreenerworld.org/directory/) — WebFetch returned HTTP 403 (blocked). Not queried successfully at all.
- GAP's "Farms & Ranches" directory (multi-page, not the single "Manufacturers" partner page) — not paginated through. Only the Manufacturers partner list was directly fetched.
- USDA AMS's Foster-Farms-specific PVP content page (ams.usda.gov/content/foster-farms-process-verified-program) — WebFetch returned HTTP 403 both times attempted. PVP certificate facts below come from search-engine-indexed snippets of that page, not a direct fetch.
- The primary FSIS Notice of Intended Enforcement PDF (marlerblog.com mirror) — fetched but returned corrupted/binary content, unreadable. NOIE facts below are from secondary news sources only.
- USDA AMS Packers and Stockyards settlement page (ams.usda.gov/content/usda-settles-packers-and-stockyards-case-foster-farms-llc) — WebFetch returned HTTP 403. Title/existence only, confirmed via search-result title, content not read. Flagging for a follow-up pass — this could be a real enforcement action not yet documented anywhere in this file.
- 24 of the CourtListener records were reviewed per the Section 7 instructions (18 shown in `_wave2_primary.json`'s foster-farms batch — the batch array holds only 18 entries, not 22 as stated in the brief; treating the file as authoritative over the brief's stated count).

---

## 1. GAP (Global Animal Partnership) step level — PRIORITY

- **Fact:** GAP's "Manufacturers | 5-Step Partners" page, fetched directly, lists: Great American Foods, Norpel, Capra Foods, Villari Food Group, Wayne Farms, Pederson's Natural Farms, Isernio's Sausage Company, Happy N' Healthy Pet Products, Wellshire Farms, Tarantino Meat Co, Gourmet Foods Inc., Goodnight Brothers Country Ham, 3 Little Pigs LLC, Miller Poultry, Meyer Natural Angus, FreeBird Chicken, Bell & Evans, Atkins Ranch, Allen Harim, Innovative Foods, Mosner Family Brands, Filet of Chicken, Emmaus Foods LLC, Perdue Farms, Bay Valley Foods Inc., Continental Sausage, Maid-Rite Specialty Foods LLC, Joyce Farms. **Foster Farms does NOT appear on this list.**
  Source: Global Animal Partnership, "Manufacturers | 5-Step Partners," https://globalanimalpartnership.org/partners/manufacturers/ — fetched 2026-08-05.
  Basis: VERIFIED (primary source, directly fetched) for this one page only. GAP's "Farms & Ranches" directory is separate and multi-page and was NOT paginated through in this pass — a Foster-Farms-supplied grower entry there cannot be ruled out.
- **Conclusion for Stage 3/4:** No GAP step rating found for Foster Farms as of 2026-08-05. Status: **NOT CHECKED exhaustively** (Farms & Ranches pages and GAP's own site search not queried) — record as unresolved/not-found-on-the-page-checked, not as a confirmed absence.

## 2. Certified Humane (certifiedhumane.org / Humane Farm Animal Care) — PRIORITY

- **Fact:** Certified Humane's "Who's Certified" page (certifiedhumane.org/whos-certified/) was fetched directly. It is a static alphabetical table, "Ackron Egg Farms" through "Zoet Poultry," 300+ company/product entries. **Foster Farms / Foster Poultry Farms does not appear anywhere in the table.**
  Source: Humane Farm Animal Care, "Who's Certified," https://certifiedhumane.org/whos-certified/ — fetched 2026-08-05.
  Basis: VERIFIED — a genuinely completed, directly-fetched, full-alphabet search. **ABSENT** (not NOT CHECKED — this directory was actually queried end to end).
- **Fact:** Certified Humane's "Shop by Brand" page (certifiedhumane.org/take-action-for-farm-animals/shop/) was also fetched directly and independently confirms Foster Farms is absent; visible brands on that page include Applegate, ButcherBox, Organic Valley, Vital Farms, and various egg producers.
  Source: same domain, https://certifiedhumane.org/take-action-for-farm-animals/shop/ — fetched 2026-08-05.
  Basis: VERIFIED, second independent confirmation of absence.

## 3. American Humane Certified (americanhumane.org) — separate certifier, NOT Certified Humane

- **Fact:** Foster Farms holds "American Humane Certified" status (administered by the American Humane Association, formerly known as "Humane Certified") on its fresh chicken products. Press coverage describes Foster Farms as the first West Coast fresh-chicken producer to earn this certification, and states American Humane audited Foster Farms broiler operations for the eighth consecutive year (as of the audit press release referenced).
  Sources: American Humane Society press release, "Third-Party Audit Finds Foster Farms Continues Commitment to Excellent Animal Welfare," https://www.americanhumane.org/press-release/third-party-audit-finds-foster-farms-continues-commitment-to-excellent-animal-welfare/; PR Newswire, "Foster Farms First Major Poultry Producer In The West To Earn Humane Certification From American Humane Association," https://www.prnewswire.com/news-releases/foster-farms-first-major-poultry-producer-in-the-west-to-earn-humane-certification-from-american-humane-association--meets-increasing-consumer-demand-for-humanely-raised-foods-197011261.html.
  Basis: company/certifier press release (third-party certifier's own announcement, not Foster Farms' marketing alone) — but **this is a DIFFERENT certification program than "Certified Humane" (Humane Farm Animal Care)** named in the evidence-schema's `certifications[]` example. Flag explicitly for Stage 4: American Humane Certified is a real, named, third-party-audited program with its own standard — it is not the same as the Certified Humane search result (Section 2) coming up empty, and should not be conflated with it.
  **Important scoping note:** the "American Humane Certified" standard has been publicly criticized as permissive (allows conventional battery-cage-adjacent and standard-density broiler conditions) by advocacy groups; per the language rules, that critique is not carried into this record — only the certification's existence and administering body are recorded here as fact.

## 4. A Greener World / Animal Welfare Approved (agreenerworld.org)

- **NOT CHECKED** — WebFetch to agreenerworld.org/directory/ returned HTTP 403 (blocked) on the only attempt made. No search-engine results independently surfaced a Foster Farms AGW/AWA listing either, but that is not the same as a completed directory search. Do not record as absent.

## 5. USDA Process Verified Program (PVP) — "No Antibiotics Ever" claim — PRIORITY (secondary claim type)

- **Fact:** Foster Farms holds multiple active USDA AMS Process Verified Program certificates covering "No Antibiotics Ever" (NAE): birds hatched, raised, and harvested with no antibiotics ever; fed an all-vegetarian diet with no animal by-products; and (for at least one certificate) "No antibiotics important to human medicine as defined by the World Health Organization" (NAIHM). Certificate numbers/locations found: PV6061JBA (Fresno, CA — Foster Farms South Division facility), issued 2026-04-14; PV5217WCA (Kelso, WA), issued 2025-09-04; PV6083LTA (Foster Farms South Division, Fresno, CA).
  Source: USDA Agricultural Marketing Service PVP content page, title-matched as "foster farms process verified program," https://www.ams.usda.gov/content/foster-farms-process-verified-program — indexed content seen via search snippet only; direct WebFetch 403'd twice (2026-08-05). Also referenced: USDA AMS, "Process Verified Program," https://www.ams.usda.gov/services/auditing/process-verified-programs.
  Basis: PVP-audited (this is the real distinction the module cares about — a government-verified process claim, not company-disclosure only) — **but flagged UNVERIFIED at the direct-primary-source level** because the AMS page itself could not be independently fetched; the certificate numbers/dates come from a secondary search-engine synthesis of that page's indexed content, not a page this researcher read directly.
- **Fact:** Foster Farms' own consumer blog explains its "No Antibiotics Ever (NAE)" claim.
  Source: Foster Farms, "What does No Antibiotics Ever (NAE) mean?," https://www.fosterfarms.com/blog/what-does-no-antibiotics-ever-nae-mean/ — company-disclosure, corroborating (not conflicting with) the PVP finding above.

## 6. Air-chilled vs. water-chilled (poultry) — PRIORITY

- **Fact:** Foster Farms markets specific product lines/SKUs as "air chilled" (e.g., retail SKU "Foster Farms Air Chilled Chicken Breasts Bone," sold at Vons/Shaws; "Simply Raised" air-chilled wings). Foster Farms' own site copy for its "Our Story / Healthy" page lists air-chilled among several attributes it offers ("air chilled, free range, organic, antibiotic free, hormone free, cage free, & vegetarian-fed options") without stating this applies to all products.
  Sources: Foster Farms product/retail listings, e.g. https://www.vons.com/shop/product-details.970591768.html; https://www.fosterfarms.com/our-story/healthy/ — fetched/searched 2026-08-05.
  Basis: company-disclosure, and explicitly SKU/line-scoped, not company-wide.
- **Fact:** Water-chilling is described industry-wide (secondary sources, not Foster-Farms-specific) as the more conventional/majority U.S. broiler-processing method, with air-chilling positioned as the premium minority alternative.
  Basis: general industry context (not a Foster Farms-specific primary statement) — UNVERIFIED as to what fraction of Foster Farms' own total production is air- vs. water-chilled. Foster Farms' own "Our Story / Healthy" page, fetched directly, does NOT state a company-wide chilling method for its core/commodity chicken line.
  **Conclusion:** Foster Farms sells BOTH air-chilled (labeled, premium/branded SKUs) and (by omission/industry-default inference only, not confirmed) presumably water-chilled core commodity chicken. NOT CHECKED for a direct Foster Farms statement on its default/majority processing method — do not write "Foster Farms is air-chilled" as a company-wide fact.

## 7. USDA-FSIS enforcement / recalls (excluding the already-logged Oct 2025 corn dog recall)

### 2013–2014 Salmonella Heidelberg outbreak — verified against CDC primary source

- **Fact:** CDC's own outbreak page states: "A total of 634 persons infected with seven outbreak strains of Salmonella Heidelberg were reported from 29 states and Puerto Rico from March 1, 2013 to July 11, 2014." 38% of ill persons were hospitalized; no deaths were reported. 77% of illnesses were reported from California.
  Source: CDC (archived), "2013 Salmonella Outbreak Linked to Foster Farms Brand Chicken," https://archive.cdc.gov/www_cdc_gov/salmonella/heidelberg-10-13/index.html — fetched directly 2026-08-05.
  Basis: VERIFIED, primary CDC source. This matches the existing `companies.js` `salmonella-outbreak-2013` entry's 634/29-states figures exactly — no update needed there, already correctly sourced.
- **Fact — formal FSIS enforcement, more specific than the existing company record shows:** FSIS issued a Public Health Alert on 2013-10-07 for chicken products from three Foster Farms California facilities, and — per secondary reporting — issued **Notices of Intended Enforcement (NOIE)** for the Livingston and Fresno plants around the same period, warning it would close the plants within three days if corrective action was inadequate. Foster Farms submitted and implemented corrective changes to slaughter/processing on 2013-10-10, avoiding a suspension of inspection. FSIS did NOT order a recall or halt shipping at that time.
  Sources: FSIS, "FSIS Issues Public Health Alert for Chicken Products Produced at Three Foster Farms Facilities," https://www.fsis.usda.gov/recalls-alerts/fsis-issues-public-health-alert-chicken-products-produced-three-foster-farms (title/existence confirmed via search; CDC archive page corroborates the Oct 7/Oct 10, 2013 dates and the "corrective actions... to allow for continued operations" language); NOIE detail from Food Safety News, "Why Did FSIS Close a Foster Farms Plant for Cockroaches But Not Salmonella?," https://www.foodsafetynews.com/2014/01/why-fsis-closed-a-foster-farms-plant-for-cockroaches-but-not-salmonella/ (secondary).
  Basis: NOIE claim is **UNVERIFIED at the primary-document level** — the actual FSIS NOIE letter (marlerblog.com PDF mirror) was fetched but returned corrupted binary content and could not be read. The CDC page (VERIFIED, Section above) independently confirms the Oct 7 alert and Oct 10 corrective-action dates, and states FSIS made a final regulatory determination that Foster Farms' process-control measures were "successful," with no suspension of inspection issued in 2013.
- **Fact — separate incident, same window, different cause:** In January 2014, USDA ordered Foster Farms to suspend operations at its Livingston, CA plant. Secondary reporting attributes this specifically to a cockroach infestation finding, not directly to the Salmonella outbreak (though press framed it in the same food-safety narrative).
  Source: search-indexed title, "USDA Orders Foster Farms Suspend Operations Livingston Plant," delauro.house.gov — WebFetch 403'd, not independently confirmed beyond the search snippet. Basis: NOT CHECKED at the primary-document level; corroborated only by the Food Safety News secondary source above, which frames it as "closed... for cockroaches, not Salmonella."
- **Fact — 634-illness outbreak's litigation outcome (relevant for pattern-vs-single-incident scoring):** In March 2018, an Arizona federal jury awarded $6.5M (net $1.95M after 70% fault allocated to the family's food handling) to the family of a 5-year-old child (Noah Craten) who suffered a brain injury from a Salmonella Heidelberg infection traced to Foster Farms chicken as part of the CDC-identified outbreak. The jury found Foster Farms 30% at fault, based on epidemiological/microbiological evidence, despite USDA not classifying Salmonella as a legal "adulterant" on raw chicken. This appears to be the federal case listed in the CourtListener batch as "Craten v. Foster Poultry Farms Incorporated," D. Arizona, docket 2:15-cv-02587, filed 2015-12-21, terminated 2018-09-19, nature of suit "Personal Injury: Other" (see Section 9 below — this IS one of the 18 CourtListener records, correctly categorized there as a product-liability suit, not further characterized in this file beyond what's stated here).
  Sources: Food Business News, "Foster Farms responsible in Salmonella case, court says," https://www.foodbusinessnews.net/articles/11498-foster-farms-responsible-in-salmonella-case-court-says (2018-03-12); Pritzker Hageman Law Firm, https://www.pritzkerlaw.com/personal-injury/2018/landmark-salmonella-lawsuit-yields-6-5-million-verdict/.
  Basis: UNVERIFIED at primary-docket level (secondary legal-news reporting, consistent across 2+ independent outlets) — status: **adjudicated** (jury verdict, not a settlement or mere allegation).

### 2017–2018 "repeated Salmonella outbreak pattern" — NOT FOUND (explicit non-finding)

- Despite a genuine, multi-query search effort (CDC archive search, general web search for "Foster Farms Salmonella 2017," "2018," "Infantis," "Enteritidis"), **no distinct CDC-documented Foster Farms Salmonella outbreak in 2017 or 2018 was found.** All search results referencing "2017/2018 investigation" resolve either to (a) continued secondary/retrospective coverage of the single 2013–2014 outbreak (which ran until July 2014, per CDC), or (b) the 2018 Craten court verdict (a lawsuit outcome from the 2013–2014 outbreak, not a new outbreak). One 2024 OCA legal complaint (Section 8 below) separately cites "2018 USDA inspection records documenting egregious, deliberate mistreatment of poultry" and birds "entering scalders alive" — this is a different kind of 2018 fact (a welfare/inspection-record allegation cited in litigation, not a foodborne-illness outbreak) and was NOT independently verified against the underlying USDA inspection record in this pass; see Section 8.
  **Conclusion for Stage 3/4:** the "repeated 2013 + 2017–2018" pattern described in the research brief could NOT be substantiated as two separate CDC outbreak events. Only ONE CDC-confirmed multistate Salmonella outbreak (2013–2014, 634 illnesses) was found. Do not write a "repeated outbreak pattern (2013, 2017-18)" claim — the evidence only supports the single 2013–2014 outbreak, plus the separately-alleged 2018 inspection-record welfare claims in the pending OCA litigation.

### Other FSIS recalls found (beyond the already-logged Oct 2025 corn dog recall)

- **Fact:** 2016 recall, ~220,450 lb of fully cooked frozen chicken nuggets, possible contamination with blue plastic and black rubber material fragments.
  Source: FSIS recall listing, title-matched via search — direct fsis.gov page not independently fetched in this pass (fsis.gov WebFetch behavior was not tested directly here; not attempted). Basis: UNVERIFIED (search-indexed title only).
- **Fact:** 2017 recall, ~131,880 lb of frozen ready-to-eat breaded chicken patty products, possible plastic contamination. Source: FSIS, "Foster Poultry Farms Recalls Frozen Ready-To-Eat Breaded Chicken Patty Products Due to Possible Foreign Matter Contamination," https://www.fsis.usda.gov/recalls-alerts/foster-poultry-farms-recalls-frozen-ready-eat-breaded-chicken-patty-products-due — title/URL confirmed via search, page content not directly fetched. Basis: UNVERIFIED (title-level only).
- **Fact:** 2022 recall, ~148,000 lb of fully cooked frozen chicken breast patty products, possible hard clear plastic contamination. Source: FSIS, "Foster Farms Recalls Fully Cooked Frozen Chicken Patty Products Due to Possible Foreign Matter Contamination," https://www.fsis.usda.gov/recalls-alerts/foster-farms-recalls-fully-cooked-frozen-chicken-patty-products-due-possible-foreign — title/URL confirmed via search, content not directly fetched. Basis: UNVERIFIED (title-level only).
  **Pattern note (raw fact only, no characterization applied here):** four separate FSIS recalls for foreign-matter contamination (plastic/rubber x3, wood x1) are now documented across 2016, 2017, 2022, and 2025, in addition to the two Salmonella-related actions (2013 alert/corrective-action, no recall issued; 2014 recall of 1M+ lb of fresh chicken — see below).
- **Fact:** July 2014 recall of "over one million pounds" of fresh chicken products, sold in 9 Western states (CA, HI, WA, AZ, NV, ID, UT, OR, AK), produced March 8/10/11 2014, due to Salmonella Heidelberg. FSIS stated it had "conclusive evidence" linking a specific illness to this chicken. This recall followed the ~9-month multistate outbreak (by that point ~621 people in 29 states/Puerto Rico) documented in Section above.
  Sources: multiple corroborating outlets — Food Safety News, "FSIS: 'Conclusive Evidence' Linking Salmonella Case to Foster Farms Chicken Prompts Limited Recall," https://www.foodsafetynews.com/2014/07/foster-farms-make-monumental-recall-on-chicken/; Marler Clark, https://marlerclark.com/news_events/foster-farms-recall-of-over-one-million-pounds-of-fresh-chicken-is-first-in.
  Basis: UNVERIFIED at FSIS-primary level (secondary news, consistent across 2+ outlets) — this recall IS part of/overlaps the CDC-verified 2013-2014 outbreak already logged in `companies.js`, not a new separate incident.

## 8. Welfare-adjacent litigation NOT visible on CourtListener (state/DC court — matches the pilot's known CourtListener federal-only blind spot)

Per industry-modules.md's documented finding, CourtListener only covers federal courts. A direct web search for "[company] lawsuit" surfaced THREE state/DC-court welfare-adjacent suits that do NOT appear in the CourtListener batch (`_wave2_primary.json`) at all:

- **Leining v. Foster Poultry Farms, Inc. (and American Humane Association)** — Los Angeles County Superior Court, case BC588004, filed 2015-07-13. Putative class action alleging Foster Farms' "American Humane Certified" labeling misled consumers because footage allegedly showed chickens were not raised/slaughtered humanely, and that American Humane's certification standard itself was too lax to support the claim. **Outcome: summary judgment for BOTH defendants**, affirmed on appeal — California Court of Appeal, Second District, Division 5, docket B291600, decided 2021-02-23. The court's basis: Foster Farms' claims were barred by **federal preemption** under the Poultry and Poultry Products Inspection Act (PPIA) because the labels had been pre-approved by FSIS; American Humane's negligent-misrepresentation claim failed on separate elements (no physical injury / no limited class of intended beneficiaries).
  Sources: FindLaw, "Leining v. Foster Poultry Farms Inc (2021)," https://caselaw.findlaw.com/court/ca-court-of-appeal/2112707.html; Bloomberg Law, "Foster Farms Avoids Chicken Treatment Claims in Labeling Suit," https://news.bloomberglaw.com/product-liability-and-toxics-law/foster-farms-avoids-chicken-treatment-claims-in-labeling-suit — both accessed 2026-08-05.
  Basis: VERIFIED (two independent secondary legal-news sources agree on court, docket number, date, and outcome). **Status: adjudicated (dismissed on summary judgment / federal preemption — not a ruling on whether the underlying welfare claims were true or false).**

- **Organic Consumers Association v. Foster Farms, LLC et al.** — filed 2024-04-10 in District of Columbia Superior Court under the DC Consumer Protection Procedures Act. Alleges Foster Farms' "five freedoms" marketing claims ("freedom from discomfort," "freedom from injury, pain, or disease," claims of "room to run around") are false, citing "multiple undercover investigations" and citing 2018 USDA inspection records the complaint characterizes as documenting "egregious, deliberate mistreatment of poultry" including birds entering scalders alive/conscious. Specific allegations in the complaint: chickens confined to under 1 sq ft/bird, no outdoor access/enrichment, fast-growth-linked mobility problems, unsanitary conditions causing infections, improper pre-slaughter stunning.
  **Procedural history:** Foster Farms removed the case to federal court (D.D.C., case 1:2024cv01703); OCA moved to remand. On 2025-03-26, Judge Tanya Chutkan **granted the motion to remand** (denied OCA's motion for attorneys' fees, finding Foster Farms' removal was "objectively reasonable"). The case is therefore back in DC Superior Court. **No ruling on the underlying merits (the actual welfare/labeling claims) has been found as of this research pass.**
  Sources: Organic Consumers Association, "Organic Consumers Association Takes Legal Action Against Foster Farms," https://organicconsumers.org/organic-consumers-association-takes-legal-action-against-foster-farms/; Justia, "Organic Consumers Association v. Foster Farms, LLC et al, No. 1:2024cv01703 - Document 17 (D.D.C. 2025)," https://law.justia.com/cases/federal/district-courts/district-of-columbia/dcdce/1:2024cv01703/269595/17/; Capital Press, "Organic group accuses Foster Farms of false advertising related to chicken treatment," https://www.capitalpress.com/ag_sectors/livestock/organic-group-accuses-foster-farms-of-false-advertising-related-to-chicken-treatment/article_8702ef90-3340-11ef-a97d-737be604aa1a.html.
  Basis: VERIFIED procedural facts (Justia docket entry is a primary court record); the underlying substantive allegations (undercover-investigation footage, "2018 USDA inspection records") are **UNVERIFIED/ALLEGED** — this researcher did NOT independently locate or read the cited 2018 USDA inspection records or the Mercy for Animals investigation footage referenced. **Status: pending / alleged.**

- **Animal Legal Defense Fund v. Foster Poultry Farms** — Superior Court of California, County of Merced, filed 2020-09-02. Alleges Foster Farms' Livingston, CA slaughterhouse (which draws ~4 million gallons/day, reportedly >60% of the city's water usage, from the "critically overdrafted" Merced Subbasin) violates the California Constitution's Article X, Section 2 ban on "unreasonable use" of water. The complaint specifically targets Foster Farms' **live-hang slaughter method with electric immobilization**, which ALDF's complaint characterizes as both water-intensive and (in ALDF's own framing) cruel. A December 2020 ruling allowed the case to proceed, rejecting Foster Farms' argument that animal-protection organizations lack standing to litigate water-use issues. **Status: CLOSED — settlement agreement reached (per ALDF's case page, updated 2025-04-21).** The specific settlement terms were NOT found/read in this pass.
  Source: Animal Legal Defense Fund, "Challenging Foster Farms Slaughterhouse's Illegal Water Use," https://aldf.org/case/challenging-foster-farms-slaughterhouses-illegal-water-use/ — fetched directly 2026-08-05.
  Basis: VERIFIED procedural facts (ALDF's own case page, the party that filed it) — but note ALDF is the plaintiff/an advocacy organization, so its characterization of the slaughter method as "cruel" is ALDF's own framing, not an independent adjudication; the case settled without (as far as found) a court ruling on the merits of that characterization. Settlement terms unknown — do not assume admission of wrongdoing.

## 9. CourtListener federal docket review (from `_wave2_primary.json`, batch[2], label "foster-farms")

18 records were returned (query "Foster Poultry Farms," reported totalCount 3653 — the 18 are the sample actually captured in the file; the brief's stated "22 results" does not match the file's actual contents, noting this discrepancy explicitly). Reviewed each:

- Perez v. Foster Poultry Farms (E.D. Cal., 1:22-cv-00691) — Civil Rights: Jobs — employment, not welfare/consumer.
- Nelson v. Foster Poultry Farms (E.D. Cal., 1:21-cv-00222) — Labor/Mgt Relations — employment.
- Reichard v. Foster Poultry Farms (E.D. Cal., 1:06-cv-00238) — Labor/Mgt Relations — employment.
- Kravitz v. Foster Poultry Farms (D. Del. Bankruptcy, 16-51608) — bankruptcy adversary proceeding, commercial.
- Laguna v. Foster Poultry Farms (E.D. Cal., 2:10-cv-03137) — Labor/Mgt Relations — employment.
- Joann Linan v. Foster Poultry Farms (E.D. Cal., 1:14-cv-01625) — FMLA — employment.
- Gipson v. Foster Poultry Farms (W.D. La., 3:10-cv-00528) — Civil Rights: Jobs — employment.
- Craten v. Foster Poultry Farms Incorporated (D. Ariz., 2:15-cv-02587) — Personal Injury: Other — **this is the Salmonella product-liability case, see Section 7 above; single-plaintiff product injury, not a class action or labeling/consumer-protection suit.**
- Foster Poultry Farms v. American Internation[al] (E.D. Cal., 1:04-cv-05930) — Insurance — commercial contract.
- Avalos v. Foster Poultry Farms, Inc. (E.D. Cal., 1:11-cv-00611) — Labor/Mgt Relations — employment.
- Garrison v. Foster Poultry Farms Incorporated (D. Ariz., 2:16-cv-00280) — Personal Injury: Other — single-plaintiff injury (not confirmed food-related from title alone; not a class action).
- Bell v. Foster Poultry Farms, Inc. (E.D. Cal., 1:05-cv-01539) — Labor: Fair Standards — employment.
- Foster Poultry Farms v. Conagra Foods Refrig[erated] (E.D. Cal., 1:04-cv-05810) — Anti-Trust — commercial, Foster Farms as PLAINTIFF, not a welfare/consumer matter.
- Foster Poultry Farms v. Orkin, LLC (E.D. Cal., 1:14-cv-00812) — Contract: Other — commercial (pest control vendor dispute).
- Foster Poultry Farms v. Zacky Farms, Inc. (E.D. Cal. Bankruptcy, 12-02672) — bankruptcy, commercial.
- Wendy Freeman v. Foster Poultry Farms (C.D. Cal., 2:15-cv-09129) — Personal injury - Product liability — single-plaintiff, not a class action per docket caption (only one named plaintiff).
- Foster Poultry Farms Incorporated v. LaClaire (D. Ariz., 2:19-cv-04630) — Contract: Other — commercial.
- Foster Poultry Farms v. Suntrust Bank (E.D. Cal., 1:04-cv-05513) — Contract: Other — commercial/financial.
- Johnson v. Foster Poultry Farms, Inc. (S.D. Ala., 2:19-cv-00620) — Civil Rights: Jobs — employment.
- Johnson v. Foster Poultry Farms, Inc. (S.D. Ala., 2:15-cv-00092) — Civil Rights: Jobs — employment (different case, same case name/parties pattern).

**Conclusion: none of the 18 CourtListener federal records qualify as a class action, consumer-protection/false-advertising suit, or welfare-specific suit.** All are single-plaintiff employment/civil-rights suits, single-plaintiff personal-injury/product-liability suits, or ordinary commercial contract/bankruptcy/insurance/antitrust disputes (in two of which Foster Farms is the plaintiff, not defendant). This is a valid, explicit non-finding for the federal docket — the real welfare/consumer-protection litigation (Section 8) exists entirely in state/DC courts, invisible to CourtListener, consistent with the documented limitation in industry-modules.md.

## 10. Existing `companies.js` record (for de-duplication)

Read directly. Existing `issues[]` array already contains:
1. `product-recall-2025` — the ~4M lb corn dog wood-fragment recall (Oct 2025, Class I, ~5 injuries) — per brief, not duplicated here.
2. `salmonella-outbreak-2013` — 634 illnesses/29 states, 2013-14, CDC + FSIS FOIA sanitation reports — **verified accurate against CDC primary source in Section 7 above, no correction needed.**
3. `pe-acquisition-2022` — Atlas Holdings acquisition, June 2022, CEO Donnie Smith (ex-Tyson CEO) — ownership fact, not sourcing-relevant, not re-researched here.

No `sourcing` block exists yet on this record (this Stage 2 pass is the first sourcing-transparency research for foster-farms).

## 11. Sourcing model

- **Fact:** Foster Farms is vertically integrated — it hatches, raises (via a mix of company-owned farms AND independent contract growers in California, Washington, and Oregon), manufactures its own feed, slaughters/processes at its own plants (Livingston, Fresno, Creswell OR, Kelso WA), and runs its own distribution trucking. Contract-grower relationships with independent Central Valley growers date to the 1940s-50s and continue today.
  Sources: general company-history summaries cross-corroborated across multiple secondary sources (Wikipedia, Encyclopedia.com, PortersFiveForce.com business-history summaries, Meatpoultry.com trade press) — accessed 2026-08-05, no single primary Foster-Farms-authored disclosure was directly fetched confirming the exact company-farm/contract-grower ratio.
  Basis: UNVERIFIED at primary-source level, but consistent across several independent secondary sources — best classified as **contract-farms** (mixed with some company-owned operations), not a single-farm or pure-aggregator model. NOT a co-op.

---

## Summary of coverage gaps for Stage 3/4

1. A Greener World / AWA directory — NOT CHECKED (403).
2. GAP Farms & Ranches directory (beyond Manufacturers page) — NOT CHECKED.
3. USDA AMS PVP primary page content — NOT CHECKED directly (403 both attempts); certificate numbers are secondary/search-snippet sourced only.
4. USDA AMS Packers & Stockyards settlement with Foster Farms LLC — title/existence only, content NOT CHECKED (403). This could be a real, undocumented enforcement action — flag for a follow-up pass.
5. Primary FSIS NOIE document — fetched but unreadable (corrupted binary); NOIE claim rests on secondary sourcing only.
6. Foster Farms' company-wide (vs. SKU-specific) chilling method — NOT CHECKED; only labeled premium SKUs confirmed air-chilled.
7. OCA v. Foster Farms underlying allegations (undercover footage, "2018 USDA inspection records") — NOT independently verified; case itself is real and pending (VERIFIED procedurally), but the substance is ALLEGED only.
8. ALDF v. Foster Poultry Farms settlement terms — NOT CHECKED (case confirmed settled, terms unknown).
