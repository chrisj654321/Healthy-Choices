# Verified Company Research Batch 04 — Dairy
**Companies:** land-o-lakes, organic-valley, chobani, tillamook, saputo, vital-farms, cabot-creamery, sargento
**Verification date:** 2026-06-11
**Verifier note:** This report was produced by an independent fact-checker who did NOT write the original research. Each finding was verified via web search against primary sources before a status was assigned.

---

## Verification Key
- ✅ VERIFIED — confirmed via primary source (court record, FDA database, official press release, government agency)
- ⚠️ ALLEGED — credible media reports but not adjudicated or contested
- 📅 OUTDATED — fully resolved >5 years ago with no ongoing relevance
- ❌ REMOVE — speculative, no credible source, date error, unacceptable liability

---

## Land O'Lakes, Inc. (id: land-o-lakes)

### ✅ VERIFIED — FDA Warning Letter: Nutra Blend Subsidiary / Animal Feed Deaths (2023)
- **Original severity:** High — CONFIRMED APPROPRIATE
- **Verification:** FDA warning letter confirmed at https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/nutra-blend-llc-subsidiary-land-olakes-651174-05222023. Inspection was December 12–16, 2022; letter issued May 22, 2023. Root cause confirmed: monensin (ionophore) cross-contamination from staged ingredients for a different product. Calf deaths confirmed via necropsy reports. Failure to file Reportable Food Registry report in required timeframe confirmed. Addressee confirmed: Lisa Deverell, President Purina Animal Nutrition / EVP Land O'Lakes.
- **DB Action:** Add as new issue. Suggested key: `fda_warning_animal_feed_deaths`
- **Recommended language:** "In 2023, the FDA issued a warning letter to Nutra Blend LLC, a Land O'Lakes subsidiary, after a cross-contamination incident at its Mason City, Iowa medicated feed mill caused multiple calf deaths from ionophore toxicity. The company also failed to file a required Reportable Food Registry report within the mandated timeframe."

### ✅ VERIFIED — Antitrust Settlement: Dairy Price-Fixing / CWT Herd Retirement Program (settled 2016)
- **Original severity:** High — RECALIBRATE TO MEDIUM (see note)
- **Verification:** $52 million settlement confirmed via Hagens Berman press release (Sept 7, 2016) and Dairy Reporter. Land O'Lakes named as defendant alongside DFA, Agri-Mark, Dairylea. Conduct period 2003–2010 confirmed. No admission of wrongdoing confirmed. Consumer class covered 15 states confirmed.
- **Severity note:** The research assigns "High" but the conduct ended in 2010 and the case settled in 2016. As a standalone Land O'Lakes item it warrants Medium — this is a decade-old settled civil case with no admission of wrongdoing, not an active enforcement action. The 500,000-cow figure is the plaintiffs' allegation, not a court finding.
- **DB Action:** Add as new issue. Suggested key: `antitrust_cwt_settlement`
- **Recommended language:** "Land O'Lakes was a named defendant in a $52 million class-action antitrust settlement (2016) alleging that dairy cooperatives slaughtered more than 500,000 cows under the CWT herd retirement program between 2003 and 2010 to artificially inflate milk prices. No admission of wrongdoing."

### ✅ VERIFIED — Lobbying Spend: USDA / Congress / EPA (ongoing)
- **Original severity:** Low — CONFIRMED APPROPRIATE
- **Verification:** OpenSecrets client ID D000022070 confirmed active. Lobbying targets agriculture, dairy pricing, nutrition labeling, and environmental regulation are consistent with OpenSecrets filings. The $1.2M/year figure in the DB is consistent with reported ranges.
- **DB Action:** Confirms existing entry.

### ✅ VERIFIED — WinField United: Fertilizer Runoff / Mississippi River Basin (2021–ongoing)
- **Original severity:** Medium — CONFIRMED APPROPRIATE
- **Verification:** WinField United is Land O'Lakes' agribusiness subsidiary and a major US distributor of crop inputs. Environmental Defense Fund and NRDC documentation of Mississippi River nutrient loading and Gulf hypoxia is well established. No direct EPA enforcement action against Land O'Lakes specifically.
- **DB Action:** Confirms existing `fertilizer_runoff` entry. No severity change needed.

---

## Organic Valley / CROPP Cooperative (id: organic-valley)

### ✅ VERIFIED — Lyons Magnus Co-Packer Recall: Microbial Contamination (2022)
- **Original severity:** High — CONFIRMED APPROPRIATE
- **Verification:** FDA recall confirmed; Lyons Magnus expanded voluntary recall August 10, 2022, to cover Organic Valley branded products. Pathogens cited: Cronobacter sakazakii and Clostridium botulinum potential. FDA warning letter to Lyons Magnus January 30, 2023 confirmed at FDA.gov, citing failure to achieve commercial sterility and shipment of contaminated product after discovering the issue in April 2022. Organic Valley's single-serve aseptic milk products confirmed as affected brands.
- **DB Action:** Add as new issue. Suggested key: `lyons_magnus_recall_2022`
- **Recommended language:** "Organic Valley products were included in a major recall in August 2022 when co-packer Lyons Magnus LLC recalled 35+ million packages of aseptic products due to potential contamination with Cronobacter sakazakii. The FDA later issued a warning letter to Lyons Magnus (January 2023) for continuing production for months after internal contamination was detected."

### ⚠️ ALLEGED — Class Action: "Humanewashing" / Premature Calf Separation (filed 2022; dismissed September 2024)
- **Original severity:** Medium
- **IMPORTANT DATE CORRECTION:** The research states this case was "active litigation as of mid-2026." This is INCORRECT. Web search confirms the parties mutually agreed to dismissal in September 2024. The case is CLOSED with no settlement payment. The 2023 partial survival of the motion to dismiss (Judge Jon S. Tigar, N.D. Cal.) is accurate.
- **Revised status:** ⚠️ ALLEGED — Dismissed September 2024. No consumer payment, no injunction.
- **Revised severity:** Low (resolved; no finding against Organic Valley)
- **DB Action:** If added, note the case was dismissed without settlement or admission. Suggested key: `calf_separation_lawsuit_dismissed`
- **Recommended language:** "In 2022, a PETA Foundation-backed class action alleged Organic Valley misled consumers about calf separation practices. A 2023 court ruling held that a reasonable consumer could find the labeling misleading. The parties mutually dismissed the case in September 2024 with no settlement or payment."

### ✅ VERIFIED — Organic Valley Grassmilk Recall: Aseptic Sterility (August 2022)
- **Original severity:** Medium — RECALIBRATE
- **Verification:** Confirmed via Seward Community Co-op recall notice (corroborates the research source). This is likely part of or contiguous with the larger Lyons Magnus recall event, as the timing and sterility failure mechanism are identical. The research presents it as a separate recall. FDA Food Safety News coverage from August 2022 documents the Lyons Magnus expansion to include Organic Valley Grassmilk. The distinction between this and the Lyons Magnus recall above is thin.
- **Revised severity:** Low — the recall is real but appears to be a product-line variant of the broader Lyons Magnus event already captured above. Adding both creates duplicative impression.
- **DB Action:** Consolidate with `lyons_magnus_recall_2022` or note as a product line within it. Do not add as a standalone High severity finding.

### ✅ VERIFIED — Oregon DEQ Fine: Storm Drain Milk Spill (2019 fine; 2021 fire)
- **Original severity:** Low — CONFIRMED APPROPRIATE
- **Verification:** Oregon DEQ records confirm $26,574 fine against CROPP/Organic Valley McMinnville Creamery for discharging milk into a storm drain leading to a South Yamhill River tributary, turning the creek white for ~3/4 mile. Oregon newsroom (DEQ) press release confirmed. 2021 fire confirmed at same facility with ammonia-related evacuation radius; plant rebuilt and reopened May 2022.
- **Severity note:** The fine predates our 2020 scope window; the 2021 fire is in scope. The fire was not an environmental enforcement action but a safety incident. Low severity is appropriate.
- **DB Action:** Add as new issue. Suggested key: `oregon_deq_fine_milk_spill`
- **Recommended language:** "In 2019, Oregon fined Organic Valley $26,574 for discharging milk into a storm drain that turned a local creek white for three-quarters of a mile. A fire at the same McMinnville, Oregon creamery in 2021 prompted a half-mile evacuation radius due to ammonia; the facility was rebuilt and reopened in May 2022."

---

## Chobani, LLC (id: chobani)

### ⚠️ ALLEGED — Class Action: Phthalates in "Natural" Yogurt (filed April 2025; status uncertain as of June 2026)
- **Original severity:** Medium
- **IMPORTANT STATUS CORRECTION:** The research states the court "partially denied Chobani's motion to dismiss in early 2026, allowing key claims to proceed." Web search finds conflicting signals: a August 2025 hearing where the court indicated it would dismiss, and separate allaboutlawyer.com coverage claiming the court "partially denied" the motion to dismiss. The case (Wysocki v. Chobani LLC, 3:25-cv-00907-JES-VET, S.D. Cal.) is confirmed filed April 16, 2025. The court's final disposition is not definitively resolved in search results — the case may still be active.
- **Verification:** PlasticList testing organization confirmed; four phthalates confirmed detected (DEHP, DEP, DBP, DEHT). No FDA finding of unsafe levels confirmed. No recall confirmed. The "natural ingredients" marketing claim is the basis of the case. No settlement as of research date confirmed.
- **Revised status:** ⚠️ ALLEGED — Active litigation, outcome uncertain. Do not characterize the motion to dismiss status definitively.
- **DB Action:** Add as new issue. Suggested key: `phthalates_lawsuit_2025`
- **Recommended language:** "An April 2025 class action (S.D. Cal.) alleges that Chobani plain Greek yogurts contained phthalates — endocrine-disrupting chemicals — leached from plastic packaging, despite marketing claiming 'only natural ingredients.' Independent testing detected four phthalate variants. No FDA recall has been issued and the case is pending."

### ✅ VERIFIED — "Zero Sugar" Labeling Lawsuit: Dismissed (May 29, 2025)
- **Original severity:** Low — CONFIRMED APPROPRIATE
- **Verification:** Judge John J. Tharp, Jr. (N.D. Ill.) granted Chobani's motion to dismiss May 29, 2025. Confirmed at National Law Review. Preemption ground confirmed: FDA granted Chobani a Temporary Marketing Permit for allulose-containing "Zero Sugar" product and issued guidance excluding allulose from total sugar counts. No consumer payment, no product change required.
- **DB Action:** This is a Chobani win, not a finding against them. Recommend NOT adding to DB as a consumer-facing issue. The dismissal actually supports Chobani's labeling practice.

### ✅ VERIFIED — Supply Chain Labor: Dairy Farmworker Conditions (2021–ongoing)
- **Original severity:** Medium — CONFIRMED APPROPRIATE
- **Verification:** Worker Justice Center of New York open letter confirmed at wjcny.org. Substandard housing, injury rates, organizing retaliation allegations confirmed. Chobani's Fair Trade USA partnership confirmed. Labor and food justice coalition opposition (35 groups) to Fair Trade USA dairy standard confirmed via Fair World Project. Jacobin and WCCNY coverage corroborates the retaliation allegations. This is a well-sourced labor issue.
- **DB Action:** Add as new issue. Suggested key: `farmworker_labor_conditions`
- **Recommended language:** "The Worker Justice Center of New York and a coalition of 35 labor rights organizations have alleged that dairy farms in Chobani's supplier network maintain substandard housing, high injury rates, and retaliate against workers seeking to organize. Chobani partnered with Fair Trade USA for supplier certification, a program that labor groups have criticized as inadequate on union rights."

### ❌ REMOVE — Voluntary Recall: Mold Contamination (2013 historical / no verified 2020–2026 action)
- **Reason:** The 2013 recall is outside scope and predates by 7+ years. The research finds "no major FDA-classified recall found in 2020–2026 period" and cites only "voluntary action with specific retailers" — this is vague and unverifiable. The Stewart Law Firm blog is not a primary source. No FDA recall record for Chobani mold in 2020–2026 was found in web searches. Including a historical action from 2013 with a note about unverified recent "minor" action creates a misleading impression.
- **DB Action:** Do not add. The 2013 recall is too old for scope; no verified recent action exists.

---

## Tillamook County Creamery Association (id: tillamook)

### ✅ VERIFIED — Class Action: "Dairy Done Right" Marketing Deception (Oregon Supreme Court, April 2025)
- **Original severity:** High — CONFIRMED APPROPRIATE
- **Verification:** Oregon Supreme Court ruling April 3, 2025 confirmed via OPB (https://www.opb.org/article/2025/04/03/oregon-supreme-court-tillamook-lawsuit-case-moves-forward/). The court reversed lower court dismissals and allowed the case to proceed. Lawsuit originally filed 2019 confirmed. "Dairy Done Right" and "Goodbye Big Food" campaigns confirmed as basis of claims.
- **FACTUAL CORRECTION:** The research states "up to 80% of Tillamook's milk comes from Threemile Canyon Farms." Multiple verified sources (OPB, legal filings) state "upwards of two thirds" or "two thirds or more." The "80%" figure appears to be an approximation not confirmed by primary sources. Use "upwards of two-thirds" in DB language.
- **Threemile Canyon size:** Research says "70,000-cow" operation; OPB and other sources confirm "approximately 70,000 cattle including 33,000 milking cows." The 70,000 figure refers to total cattle, not milking cows.
- **DB Action:** Add as new issue. Suggested key: `dairy_done_right_lawsuit`
- **Recommended language:** "A 2019 class action alleging that Tillamook's 'Dairy Done Right' and 'Goodbye Big Food' marketing campaigns deceive consumers — because upwards of two-thirds of Tillamook's milk comes from Threemile Canyon Farms, a CAFO with approximately 70,000 cattle near Boardman, Oregon, not the small coastal farms depicted in advertising — was revived by the Oregon Supreme Court in April 2025 and is proceeding to trial."

### ✅ VERIFIED — Supplier Environmental Violations: Threemile Canyon Farms (DEQ fine; California credit fraud allegation)
- **Original severity:** High — RECALIBRATE TO MEDIUM
- **Verification:** Oregon DEQ fine of $19,500 for five PM violations June 2019–September 2020 confirmed via OPB (Jan 27, 2022). California LCFS credit fraud allegation by Food and Water Watch confirmed as advocacy allegation, not an adjudicated finding. 2019 digester spill (300,000+ gallons of manure into waterway) confirmed by OPB and East Oregonian.
- **Severity note:** These are violations at a supplier, not Tillamook directly. The LCFS fraud allegation is by an advocacy organization, not a regulator. Recalibrate to Medium, noting supplier relationship clearly.
- **DB Action:** Add as new issue. Suggested key: `threemile_supplier_violations`
- **Recommended language:** "Threemile Canyon Farms, Tillamook's primary milk supplier, was fined $19,500 by the Oregon DEQ for five air quality permit violations (2019–2020). A 2022 advocacy report by Food and Water Watch alleged the farm continued collecting California clean-energy credits while violating air quality rules. A 2019 spill sent over 300,000 gallons of manure into an Oregon waterway."

### ✅ VERIFIED — FDA Recall: Undeclared Allergens in Ice Cream (May–June 2023)
- **Original severity:** Low — CONFIRMED APPROPRIATE
- **Verification:** FDA recall notice confirmed. Tillamook Waffle Cone Swirl ice cream mis-packaged in Chocolate Peanut Butter cartons. Up to 1,440 cartons affected. Distributed only at Safeway in Washington state and northern Idaho. Wheat and soy allergens undeclared. No illnesses reported. KPTV June 2023 coverage confirmed.
- **DB Action:** Add as new issue. Suggested key: `allergen_recall_ice_cream_2023`

### ✅ VERIFIED — FDA Recall: Foreign Plastic in Cheese (May 2024)
- **Original severity:** Medium — RECALIBRATE TO LOW
- **Verification:** Recall confirmed. Gray and black plastic pieces found in Tillamook Colby Jack and Monterey Jack cheese twin-packs sold at Costco Northwest locations. Produced for Costco only. FDA Class II classification confirmed (temporary adverse health consequences, not likely serious harm). Costco-specific, limited distribution.
- **Severity note:** Class II, limited to Costco Northwest, no illnesses. Low is more appropriate for a packaging defect at a single retailer channel.
- **DB Action:** Add as new issue. Suggested key: `plastic_recall_cheese_2024`

### ✅ VERIFIED — Supply Chain: Groundwater Contamination / Lower Umatilla Basin (ongoing)
- **Original severity:** Medium — CONFIRMED APPROPRIATE
- **Verification:** NW Environmental Advocates documentation confirmed. Oregon CAFO permitting framework nitrogen contamination issue is well documented for the Lower Umatilla Basin. This is an ongoing regulatory/advocacy record, not a single enforcement action.
- **DB Action:** Add as new issue. Suggested key: `groundwater_contamination_supplier`

---

## Saputo Inc. (id: saputo)

### ✅ VERIFIED — FDA Recall: Great Value Cottage Cheese (Pasteurization Failure, February 2026)
- **Original severity:** Medium — CONFIRMED APPROPRIATE
- **Verification:** FDA recall notice confirmed at FDA.gov. 24-state Walmart distribution confirmed (AL, AK, AZ, AR, CA, CO, GA, ID, IL, IA, KS, KY, LA, MO, MS, MT, NM, NV, OR, TN, TX, UT, WA, WY). February 17–20, 2026 distribution dates confirmed. California Department of Food and Agriculture involvement confirmed. Pasteurizer subsequently repaired and certified confirmed. No illnesses reported confirmed.
- **DB Action:** Add as new issue. Suggested key: `cottage_cheese_recall_pasteurization_2026`

### ❌ REMOVE — Recall: Listeria Risk in Gouda Cheese / Deutsch Kase Haus (originally stated as 2022–2023)
- **DATE ERROR:** Web search definitively places this recall in February 2017, not 2022–2023. All search results (FDA recall database URL ucm542225.htm, Dairy Reporter February 17 2017, Food Safety News) confirm the date. The recall has been terminated. This is a >5-year-old resolved recall outside scope.
- **DB Action:** Do not add. This is a 2017 recall, outside the 2020–2026 research window. The research contains a material date error.

### ✅ VERIFIED — Canadian Trade Policy: Class 7 Pricing Dispute (2018–2022)
- **Original severity:** Low — CONFIRMED APPROPRIATE
- **Verification:** Canada's Class 7 milk pricing policy confirmed; Saputo CEO opposition confirmed via CTV/CBC coverage; USMCA dispute and eventual elimination of Class 7 policy confirmed. This is a trade policy/lobbying matter, not an enforcement action.
- **DB Action:** Low value for consumer transparency app — this is a trade dispute, not a safety or ethical concern about products. Recommend NOT adding unless the app covers trade policy posture. If included, severity Low is correct.

### ✅ VERIFIED — Environmental / Water Use: Plant Expansion Opposition (2021–2022)
- **Original severity:** Low — CONFIRMED APPROPRIATE
- **Verification:** Community opposition to Saputo plant expansions in drought-affected regions confirmed via Reuters 2022. No formal EPA or California enforcement action found.
- **DB Action:** Confirms existing `water_usage` entry.

---

## Vital Farms, Inc. (id: vital-farms)

### ✅ VERIFIED — PETA/Consumer Lawsuit: "Humanewashing" / Pasture-Raised Claims (dismissed January 2025; Vital Farms prevailed)
- **Original severity:** Medium
- **Verification:** Case dismissal January 2025 confirmed. No consumer payment, no settlement confirmed. PETA withdrew May 2023 confirmed. $292,000 sanctions paid by Vital Farms to PETA for discovery abuse (overly broad subpoenas) confirmed — this was a discovery sanction, not a consumer finding. Vital Farms' own response page (vitalfarms.com/whats-happening-with-the-vital-farms-lawsuit/) confirms these facts.
- **Revised status:** ✅ VERIFIED — Vital Farms prevailed. Case dismissed without settlement.
- **Revised severity:** Low (Vital Farms won; the $292,000 sanctions relate to discovery conduct, not product misrepresentation)
- **DB Action:** If adding, frame accurately as a dismissed case. The sanctions are newsworthy but context matters. Suggested key: `humanewashing_lawsuit_dismissed`
- **Recommended language:** "A 2021 PETA Foundation-backed class action alleging Vital Farms misled consumers about pasture-raised and humane-certification claims was dismissed in January 2025 with no settlement or consumer payment. During litigation, Vital Farms was sanctioned $292,000 for overly broad discovery requests against PETA."

### ✅ VERIFIED — Listeria-Linked Recall: Hard-Boiled Eggs / Almark Foods (December 2019–January 2020)
- **Original severity:** Medium — RECALIBRATE TO LOW (see note)
- **Verification:** Almark Foods (Gainesville, GA) recall confirmed via FDA. Three Vital Farms pasture-raised hard-cooked egg varieties included in expanded recall confirmed. Outbreak statistics (7 illnesses, 4 hospitalizations, 1 death, 5 states) confirmed via CDC/FDA. Vital Farms was an affected brand, not the source facility, confirmed.
- **Severity note:** This recall predates 2020 (initiated December 2019, expanded January 2020). It is at the boundary of scope. Vital Farms was not responsible — Almark's facility was the contamination source. Medium may overstate Vital Farms' culpability. Low is more appropriate given Vital Farms was a downstream brand victim, not the facility operator.
- **DB Action:** Add if including supply chain accountability. Suggested key: `almark_listeria_recall_2019`
- **Recommended language:** "Vital Farms pasture-raised hard-boiled eggs were included in a December 2019–January 2020 recall of all products from Almark Foods' Georgia facility, linked to a Listeria outbreak that caused 7 illnesses and 1 death. Vital Farms was an affected brand; the contamination originated at the co-packer's facility."

### ⚠️ ALLEGED — 2026 Social Media Controversy: Linoleic Acid in Eggs
- **Original severity:** Low — CONFIRMED APPROPRIATE
- **Verification:** Nourish Food Club / Michigan State University fatty acid analysis confirmed. 22.5% linoleic acid composition in Vital Farms eggs confirmed. Viral social media controversy in January 2026 confirmed. Vital Farms' response (feed composition openly disclosed on website) confirmed by multiple sources. No lawsuit filed as of research date confirmed. Nourish Food Club themselves confirmed Vital Farms never lied about feed composition.
- **Revised status:** ⚠️ ALLEGED — The controversy is real but no claim of deception has been adjudicated or formally filed. Vital Farms appears to have disclosed feed composition.
- **DB Action:** Low value for consumer transparency app given Vital Farms' transparency about feed. If added, low severity is correct. Suggested key: `linoleic_acid_controversy_2026`

---

## Cabot Creamery Cooperative / Agri-Mark (id: cabot-creamery)

### ✅ VERIFIED — Vermont State Environmental Fine: Wastewater Permit Violations (February 2026)
- **Original severity:** Medium — CONFIRMED APPROPRIATE
- **Verification:** Vermont ANR press release confirmed at anr.vermont.gov. $60,000 fine confirmed. Middlebury, Vermont facility confirmed. 15 permit violations since July 1, 2022 confirmed. BOD/pH exceedances, unpermitted high-strength dairy waste discharges, monitoring failures all confirmed. Vermont Superior Court Environmental Division consent order confirmed. $716,000 taxpayer-funded upgrade and subsequent violations confirmed via Vermont Daily Chronicle. WCAX February 14, 2026 coverage confirmed.
- **DB Action:** Add as new issue. Suggested key: `vermont_wastewater_fine_2026`
- **Recommended language:** "In February 2026, the Vermont Agency of Natural Resources fined Agri-Mark (Cabot Creamery's parent cooperative) $60,000 for 15 wastewater permit violations at its Middlebury, Vermont facility since July 2022, including unpermitted discharges of high-strength dairy waste that impacted the town's municipal treatment plant — notable because Vermont taxpayers had funded a $716,000 upgrade to the facility."

### ✅ VERIFIED — FDA Recall: Butter / Possible Fecal Contamination (March–April 2025)
- **Original severity:** Low — CONFIRMED APPROPRIATE
- **Verification:** VTDigger April 10, 2025 confirmed. 189 cases (1,700+ lbs) of Cabot 8oz Extra Creamy Premium Butter recalled. States confirmed: VT, NY, PA, ME, CT, NH, AR. FDA Class III classification confirmed (least serious; not likely to cause adverse health consequences). Agri-Mark recovered 99.5% of affected lot before retail sale — only 17 retail packages (8.5 lbs) reached consumers. No illnesses reported confirmed. Cause: Coliform bacteria detected in finished product testing.
- **DB Action:** Add as new issue. Suggested key: `butter_recall_coliform_2025`
- **Recommended language:** "Cabot Creamery voluntarily recalled 1,700 pounds of Extra Creamy Premium Butter in April 2025 due to possible fecal (Coliform) contamination. The FDA classified it as Class III (not likely to cause adverse health consequences). Agri-Mark recovered 99.5% of the lot before retail sale."

### ✅ VERIFIED — FDA Recall: Undeclared Peanuts in Co-Branded Popcorn (October 2025)
- **Original severity:** Medium — CONFIRMED APPROPRIATE
- **Verification:** FDA recall notice confirmed at FDA.gov (Jody's Inc. recall). October 2025 date confirmed. 6oz bags of Cabot Creamery Sea Salt Caramel Cheddar Popcorn. Undeclared peanuts confirmed; distributed to IL, CA, FL, GA, MA, MD, NC, OR, TX. Discovered via consumer complaints. No illnesses reported confirmed. This bears the Cabot brand name on co-manufacturer Jody's packaging.
- **DB Action:** Add as new issue. Suggested key: `peanut_allergen_recall_popcorn_2025`
- **Recommended language:** "In October 2025, co-manufacturer Jody's Inc. recalled Cabot Creamery-branded Sea Salt Caramel Cheddar Popcorn in 9 states due to undeclared peanuts, a potentially life-threatening allergen. The issue was discovered through consumer complaints."

### ✅ VERIFIED — Antitrust Settlement: CWT Dairy Price-Fixing (named defendant, settled 2016)
- **Original severity:** High — RECALIBRATE TO MEDIUM (same reasoning as Land O'Lakes entry)
- **Verification:** Agri-Mark named as defendant in $52M CWT settlement confirmed via Hagens Berman. Same case as Land O'Lakes entry above. Settlement finalized September 2016. No admission of wrongdoing. Conduct period 2003–2010.
- **Severity note:** High is disproportionate for a decade-old civil settlement with no admission of wrongdoing. Recalibrate to Medium. Both the Land O'Lakes and Cabot entries derive from this same case.
- **DB Action:** Add as new issue. Suggested key: `antitrust_cwt_settlement`
- **Recommended language:** "Agri-Mark (Cabot Creamery's parent cooperative) was a named defendant in a $52 million class-action antitrust settlement (2016) alleging dairy cooperatives slaughtered over 500,000 cows under the CWT herd retirement program (2003–2010) to artificially inflate milk prices. No admission of wrongdoing."

---

## Sargento Foods Inc. (id: sargento)

### ✅ VERIFIED — Voluntary Recall: Listeria Contamination from Rizo-Lopez Supplier (February 2024)
- **Original severity:** High — CONFIRMED APPROPRIATE
- **Verification:** FDA outbreak investigation confirmed at FDA.gov. Sargento recall February 5, 2024 confirmed. Cotija cheese supplier Rizo-Lopez Foods (Modesto, CA) confirmed. Hawaii DOH positive Listeria test confirmed. 26 illnesses, 23 hospitalizations, 2 deaths across multiple states confirmed via CDC. 10,498 Sargento cases recalled, 15 states confirmed. Federal consent decree permanently enjoining Rizo-Lopez from production (October 8, 2024) confirmed. Rizo-Lopez bankruptcy confirmed.
- **IMPORTANT CLARIFICATION from verification:** Sargento's branded consumer retail products were NOT affected; only Sargento Food Service and Ingredients products (the B2B supply channel) were recalled. The research does not make this distinction clearly.
- **DB Action:** Add as new issue. Suggested key: `rizo_lopez_listeria_recall_2024`
- **Recommended language:** "In February 2024, Sargento voluntarily recalled 10,498 cases of food service and ingredients products containing Cotija cheese from supplier Rizo-Lopez Foods (Modesto, CA) after Listeria monocytogenes was detected. The broader Rizo-Lopez outbreak caused 26 illnesses, 23 hospitalizations, and 2 deaths. Rizo-Lopez was subsequently banned from food production by federal court order and filed for bankruptcy."

### ✅ VERIFIED — Civil Lawsuit: Sargento v. Rizo-Lopez for Breach of Contract (2024; pending)
- **Original severity:** Medium — CONFIRMED APPROPRIATE
- **Verification:** Case confirmed at Justia docket (2:2024cv00308, E.D. Wis., filed March 8, 2024). BizTimes Milwaukee coverage confirmed. Damages claimed exceeding $42 million confirmed. Rizo-Lopez bankruptcy makes recovery uncertain — confirmed by research.
- **Note:** This is Sargento as plaintiff seeking damages from a supplier — this is Sargento acting as a victim of the contamination, not as a wrongdoer. Framing matters.
- **DB Action:** Low consumer transparency value — this is Sargento suing a supplier, not a finding against Sargento. Recommend NOT adding as a negative issue in the DB, or note it as context within the Listeria recall entry.

### ✅ VERIFIED — Supplier Quality Risk: Rizo-Lopez Decade-Long Listeria History (2014–2024)
- **Original severity:** Medium — CONFIRMED APPROPRIATE
- **Verification:** FDA outbreak investigation confirms Listeria cases linked to Rizo-Lopez dating to 2014. Ten-year contamination history confirmed. Federal consent decree October 2024 confirmed. Questions about supplier auditing are legitimate public record concerns.
- **DB Action:** Consolidate with `rizo_lopez_listeria_recall_2024` rather than creating a separate entry. The auditing concern can be noted in the narrative language of the recall entry.

---

## Summary of Changes from Research Draft

| Finding | Company | Change |
|---|---|---|
| CWT antitrust settlement | Land O'Lakes, Cabot | Severity: High → Medium (decade-old civil settlement, no admission) |
| Tillamook milk source percentage | Tillamook | Factual correction: "80%" → "upwards of two-thirds" |
| Tillamook "70,000 cow" claim | Tillamook | Clarification: 70,000 total cattle, ~33,000 milking cows |
| Threemile Canyon violations | Tillamook | Severity: High → Medium (supplier violations, advocacy allegation not adjudicated) |
| Tillamook plastic recall | Tillamook | Severity: Medium → Low (Class II, Costco-only, no illnesses) |
| Saputo Gouda recall date | Saputo | DATE ERROR: 2022–2023 stated; actual date is February 2017 — REMOVE |
| Organic Valley calf lawsuit | Organic Valley | Status correction: "active mid-2026" → dismissed September 2024, no settlement |
| Organic Valley Grassmilk recall | Organic Valley | Flag: likely same event as Lyons Magnus recall; don't double-count |
| Chobani phthalates lawsuit | Chobani | Status correction: court signaled dismissal August 2025; uncertain, not confirmed denial of motion |
| Chobani Zero Sugar dismissal | Chobani | Recommend NOT adding — Chobani won this case |
| Chobani mold recall "minor note" | Chobani | REMOVE — no verified 2020–2026 FDA action; 2013 out of scope |
| Vital Farms PETA lawsuit | Vital Farms | Severity: Medium → Low — Vital Farms prevailed, no settlement |
| Vital Farms Almark recall | Vital Farms | Severity: Medium → Low — Vital Farms was downstream brand victim, not facility operator |
| Vital Farms linoleic acid | Vital Farms | Status: Alleged; Vital Farms disclosed feed composition openly |
| Sargento v. Rizo-Lopez lawsuit | Sargento | Recommend NOT adding — Sargento is plaintiff/victim, not wrongdoer |
| Sargento recall scope | Sargento | Clarification: Only food service/ingredients channel affected, not branded retail |
