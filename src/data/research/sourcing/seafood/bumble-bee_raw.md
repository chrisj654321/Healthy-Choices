# Bumble Bee Foods, LLC — Stage 2 raw research (seafood module)

companyId: `bumble-bee` | Owned by FCF Co., Ltd. (Taiwan, since Jan 2020)
Researched: 2026-07-30. Raw facts only — no characterization, no scoring.
Category note: canned tuna is virtually all wild-caught (no meaningful US
commercial tuna aquaculture), so per founder direction this batch prioritizes
Seafood Watch rating, fishing method/bycatch, and MSC status over the
farmed-vs-wild decode that leads the module generally.

---

## 1. Ownership / corporate structure

- **FACT:** Bumble Bee Foods filed for Chapter 11 bankruptcy on November 21, 2019, and entered an asset purchase agreement with F.C.F. Fishery Co., Ltd. (a Kaohsiung City, Taiwan-based seafood processor/distributor) to sell substantially all assets for approximately $925 million (bid/agreement figure) / $928 million (final closed transaction figure per NBC San Diego).
  **Source:** Food Business News, "Bumble Bee Foods declares bankruptcy," https://www.foodbusinessnews.net/articles/14943-bumble-bee-foods-declares-bankruptcy; Axios, "Bumble Bee Foods files for bankruptcy and sells $925 million in assets," https://www.axios.com/2019/11/22/bumble-bee-tuna-bankruptcy; Food Dive, https://www.fooddive.com/news/bumble-bee-files-for-bankruptcy-and-agrees-to-sell-for-925m/567858/
  **Status:** UNVERIFIED (multiple consistent news sources; bankruptcy court docket itself not pulled this pass — could be added via the skill's Stage-1 script against a bankruptcy-court query if needed).
- **FACT:** FCF closed its acquisition of Bumble Bee's North American assets on January 31, 2020, for the ~$928 million transaction. FCF Co., Ltd. is the current owner of the Bumble Bee brand.
  **Source:** NBC San Diego, "FCF Closes Acquisition of Bumble Bee's North American Assets in $928M Deal," https://www.nbcsandiego.com/news/local/fcf-closes-acquisition-of-bumble-bees-north-american-assets-in-928m-deal/2255783/; CNBC, "Bumble Bee files for bankruptcy," https://www.cnbc.com/2019/11/22/bumble-bee-files-for-bankruptcy.html
  **Status:** UNVERIFIED (news sources; consistent across multiple independent outlets, treat as high-confidence).
- **FACT:** The bankruptcy filing explicitly followed the company's 2017 guilty plea and $25 million criminal antitrust fine (see Section 2) — reporting frames the bankruptcy as driven at least in part by that liability plus the pending civil litigation.
  **Source:** Food Business News (above), same article.
  **Status:** UNVERIFIED (causal framing from secondary reporting, not a court finding of causation).

---

## 2. Criminal antitrust price-fixing case (DOJ) — the flagged "already-known" finding

**Cross-reference:** already documented (reviewed, in production) in `src/data/companies.js` under `bumble-bee.issues` (`tuna-price-fixing-guilty-plea`, `tuna-civil-settlement-2024`). Restated here with full source detail for the sourcing pipeline's own record:

- **FACT:** Bumble Bee Foods, LLC and co-conspirators (StarKist, Chicken of the Sea/Tri-Union Seafoods) agreed to fix prices of shelf-stable (canned/pouch) tuna sold in the U.S. from as early as Q1 2011 through at least Q4 2013.
  **Source:** DOJ press release, "Bumble Bee Agrees to Plead Guilty to Price Fixing," https://www.justice.gov/archives/opa/pr/bumble-bee-agrees-plead-guilty-price-fixing
  **Status:** VERIFIED (DOJ primary source; content confirmed via search-engine index since direct WebFetch to justice.gov 403'd — corroborated identically by Corporate Crime Reporter, CBS News, Fox News, SeafoodSource, all citing the same $25M figure and conspiracy dates).
- **FACT:** Federal criminal case *United States v. Bumble Bee Foods, LLC*, N.D. Cal., docket 3:17-cr-00249. Filed 2017-05-08; Change of Plea Hearing and Sentencing held together on 2017-08-02 before Judge Edward M. Chen; docket terminated 2017-08-02.
  **Source:** CourtListener docket (pulled via this skill's Stage-1 script, `_primary.json`), https://www.courtlistener.com/docket/6081948/united-states-v-bumble-bee-foods-llc/
  **Status:** VERIFIED (primary court record via approved script).
- **FACT:** Bumble Bee agreed to plead guilty and pay a **$25 million criminal fine** (minimum), rising to a maximum of **$81.5 million**, payable by a related/successor entity ("Big Catch" per the plea record), in the event of a qualifying sale of Bumble Bee. The court also imposed a $400 special assessment. Restitution and probation were not imposed at sentencing.
  **Source:** DOJ press release (above); corroborated by search-indexed content describing the Change of Plea/Sentencing record, "The Court sentenced the defendant to pay...a minimum criminal fine of $25 million without interest, with the possibility of a criminal fine of $81.5 million payable by Big Catch in the event of a qualifying event."
  **Status:** VERIFIED (DOJ primary source language, cross-confirmed by the docket entry dates above).
- **FACT:** Former Bumble Bee President and CEO **Christopher Lischewski** was indicted and tried; convicted December 3, 2019, of conspiring to fix, raise, and maintain prices with Bumble Bee, Chicken of the Sea, and StarKist. Sentenced by Judge Edward M. Chen on June 16, 2020, to **40 months in federal prison** and a **$100,000 criminal fine**.
  **Source:** SeafoodSource, "Bumble Bee's Chris Lischewski convicted of fixing prices of canned tuna," https://www.seafoodsource.com/news/business-finance/bumble-bee-s-chris-lischewski-convicted-of-fixing-prices-of-canned-tuna"; DOJ press release "Former Bumble Bee CEO Sentenced to Prison for Fixing Prices of Canned Tuna," https://www.justice.gov/archives/opa/pr/former-bumble-bee-ceo-sentenced-prison-fixing-prices-canned-tuna
  **Status:** VERIFIED (DOJ primary + trade-press corroboration).
- **FACT:** Federal criminal case *United States v. Lischewski*, N.D. Cal., docket 3:18-cr-00203. Filed 2018-05-16; docket terminated 2020-06-16 (matching the sentencing date above).
  **Source:** CourtListener docket (Stage-1 script pull), https://www.courtlistener.com/docket/6738410/united-states-v-lischewski/
  **Status:** VERIFIED (primary court record via approved script).
- **FACT:** Lischewski appealed his conviction to the Ninth Circuit, arguing the jury instructions erroneously equated "mutual understanding" with "agreement." The Ninth Circuit affirmed the conviction on July 7, 2021, finding the instructions "correctly reflected the substantive law." Lischewski subsequently filed a petition for writ of certiorari with the U.S. Supreme Court (filed 2021-12-06); the search results for this pass did not surface a confirmed Supreme Court ruling on that petition (likely denied, consistent with the general pattern of cert petitions in this litigation family, but NOT independently confirmed).
  **Source:** SeafoodSource, "Chris Lischewski's appeal denied as judicial panel cites 'overwhelming' evidence," https://www.seafoodsource.com/news/business-finance/chris-lischewskis-appeal-denied-as-judicial-panel-cites-overwhelming-evidence; cert petition PDF, https://appliedantitrust.com/03_criminal/case_studies/packaged_seafood/3_sct/lischewski_us_cert_petition2021_12_06app.pdf
  **Status:** VERIFIED for the Ninth Circuit affirmance (2021-07-07); **NOT CHECKED** for the final disposition of the SCOTUS cert petition — flag as open/unresolved in this checkpoint rather than assuming denial.
- **FACT:** Civil MDL *In re: Packaged Seafood Products Antitrust Litigation*, S.D. Cal., docket 3:15-md-02670 (same consolidated case StarKist is party to — see that company's checkpoint), plus dozens of individual purchaser suits directly naming Bumble Bee (e.g. *Youngblood v. Bumble Bee Foods LLC* 3:15-cv-01863; *Wal-Mart Stores, Inc. v. Bumble Bee Foods, LLC* 3:16-cv-02821; *Olean Wholesale Grocery Cooperative, Inc. v. Bumble Bee Foods LLC* 3:15-cv-01714).
  **Source:** CourtListener dockets (Stage-1 script pull, `_primary.json`).
  **Status:** VERIFIED (primary court records via approved script).
- **FACT:** In December 2024, U.S. District Judge Dana Sabraw (S.D. Cal.) approved over $216 million in combined civil settlements from StarKist, Bumble Bee, and their parent companies (including Bumble Bee's former parent Lion Capital), resolving claims by direct purchasers, commercial food preparers, and individual consumers for the 2011–2015 conspiracy period.
  **Source:** Courthouse News Service (already cited in companies.js, cross-confirmed here), https://www.courthousenews.com/judge-grants-216-million-settlement-in-yearslong-canned-tuna-antitrust-suit/
  **Status:** VERIFIED (already reviewed/merged data per companies.js; independently corroborated by the court-record chain above).

---

## 3. Separate matter — 2012 workplace-death criminal case (state, not the antitrust case)

This is a DIFFERENT prosecution from the price-fixing case — a California workplace-safety criminal matter — surfaced during research and worth flagging since it is a real, adjudicated forced-labor/worker-safety-adjacent record not currently in companies.js.

- **FACT:** On October 11, 2012, Bumble Bee employee Jose Melena, 62, died after being trapped inside an industrial pressure-cooker oven at the company's Santa Fe Springs, California plant when a coworker, believing Melena was on a break, loaded roughly 12,000 lbs of canned tuna into the oven and started it; Melena was cooked for approximately two hours before discovery.
  **Source:** NBC News, "Bumble Bee to Pay $6 Million Over Employee Cooked in Tuna Oven," https://www.nbcnews.com/news/us-news/bumble-bee-pay-6-million-over-employee-cooked-tuna-oven-n408721; CBS News, https://www.cbsnews.com/news/tuna-company-bumble-bee-foods-pay-record-settlement-death-worker-cooked-oven/
  **Status:** UNVERIFIED (multiple consistent news sources; underlying LA County Superior Court criminal docket not pulled this pass — the source PDF from the LA County DA's office was found, https://da.lacounty.gov/sites/default/files/press/081215_Bumble_Bee_Foods_to_Pay_States_Largest_Known_Workplace_Violations_Settlement_for_Death_of_Employee_Trapped_Inside_Industrial_Oven.pdf, but not opened/read this pass).
- **FACT:** Bumble Bee agreed (announced January 2017) to plead guilty to a misdemeanor charge of willfully failing to provide an effective safety program. Two individual employees (plant Operations Director Angel Rodriguez and former safety manager Saul Florez) were separately charged; reporting indicates Florez pleaded guilty to a felony lockout-tagout violation causing death and was sentenced to three years' probation plus community labor.
  **Source:** MyNewsLA, "Cooked to death in agony for two hours: Gruesome guilty plea by Bumble Bee Foods," https://mynewsla.com/crime/2017/01/25/cooked-to-death-in-agony-for-two-hours-gruesome-guilty-plea-by-bumble-bee-foods/; Safety News Alert, https://www.safetynewsalert.com/bumble-bee-to-pay-6m-in-oven-death-2-managers-will-pay-30k/
  **Status:** UNVERIFIED (consistent news reporting; not confirmed against the actual LA Superior Court criminal docket).
- **FACT:** Total settlement reported at $6 million — described by then-LA County DA Jackie Lacey as the largest known payout in a California workplace-violation death case — including $3 million to replace tuna ovens with automated equipment not requiring workers to enter, and $1.5 million restitution to Melena's family.
  **Source:** LA County DA press release PDF (link above, not directly opened this pass); NBC News, CBS News (above).
  **Status:** UNVERIFIED (this pass did not open the primary LA County DA PDF; recommend a follow-up fetch of that PDF directly for VERIFIED status).
  **Note for Stage 3/4:** this is a labor/worker-safety fact, not a fishing/sourcing fact — flag for the writer as adjacent context, not core to the seafood module's fishing-method/certification claim types, but real and citable if the app's company profile wants a worker-safety line.

---

## 4. Seafood Watch (Monterey Bay Aquarium) — rating, method, bycatch

**Structural fact:** Seafood Watch does NOT publish brand-level ratings; it rates by species + gear/method + region, per the skill's module guidance. The ratings below are the underlying fishery components Bumble Bee's canned tuna draws from, not a single "Bumble Bee rating."

- **FACT:** Seafood Watch rates **skipjack tuna caught by purse seine on floating objects/FADs** (Northwest/Southwest/Western Central Atlantic) **red — "Avoid,"** citing bycatch of overfished bigeye tuna, blue marlin, and at-risk sharks, and insufficient bycatch-reduction measures for highly vulnerable species.
  **Source:** Seafood Watch, "Skipjack Tuna," https://www.seafoodwatch.org/recommendation/tuna/skipjack-tuna-30707
  **Status:** UNVERIFIED-pending-direct-view — retrieved via search-engine index of the page; direct WebFetch render was not successfully obtained this pass (page appears to require JS rendering).
- **FACT:** Seafood Watch's consumer guidance recommends pole-caught, pole-&-line, troll-caught, or FAD-free ("free school"/"school-caught") canned tuna as better choices, and explicitly advises avoiding tuna caught with longlines or purse seines using FADs except for specifically recommended sources.
  **Source:** Seafood Watch consumer tuna guide, https://www.seafoodwatch.org/recommendations/download-consumer-guides/sustainable-tuna-guide
  **Status:** UNVERIFIED-pending-direct-view (same retrieval caveat).
- **NOT CHECKED:** Direct rendering of Seafood Watch's albacore (longline vs. troll/pole-and-line) and yellowfin (purse seine FAD vs. free-school) rating pages, which would show the specific gear-type ratings for the species Bumble Bee's albacore and light-tuna lines draw from. WebFetch attempts on comparable pages returned empty nav-only content this pass; needs a follow-up with a JS-capable fetch or manual browser check.

---

## 5. Fishing method — Bumble Bee / FCF's own sourcing disclosures

- **FACT (company-disclosure):** In 2021, 71% of Bumble Bee's seafood was reported as "sourced sustainably" by the company; this rose to 91% by 2023, per company/trade-press reporting.
  **Source:** FoodNavigator-USA, "The Bumble Bee Seafood Co's sustainability success opens unexpected marketing opportunities," https://www.foodnavigator-usa.com/Article/2022/03/31/bumble-bee-co-s-sustainability-success-opens-unexpected-marketing-opportunities/
  **Status:** UNVERIFIED (company-disclosure basis — "sourced sustainably" is Bumble Bee's own self-defined metric, not a named third-party certification or audit standard; per the skill's praise rail this cannot be presented as an independent fact).
- **FACT (company-disclosure):** At the end of 2021, Bumble Bee's albacore tuna line was reported as either sourced from fisheries in formal improvement programs (FIPs) or already MSC-certified — described by the company as three years ahead of an internal schedule. Bumble Bee stated it was converting its skipjack ("light tuna") line to MSC-certified sourcing during 2022.
  **Source:** Same FoodNavigator-USA article as above; Bumble Bee's own site, "Sustaining Fisheries," https://thebumblebeecompany.com/sustaining-fisheries/
  **Status:** UNVERIFIED (company-disclosure basis).
- **FACT:** Bumble Bee's primary supplier, FCF Co., Ltd. (also Bumble Bee's parent since 2020), operates two FAD-free tuna sourcing programs; one of the two is also MSC-certified. Per Mongabay reporting, FCF supplies approximately 95% of Bumble Bee's albacore and more than 70% of its light-meat (skipjack) tuna.
  **Source:** Mongabay, "Tuna supply chains under scrutiny as Bumble Bee brand changes hands," https://news.mongabay.com/2020/02/tuna-supply-chains-under-scrutiny-as-bumble-bee-brand-changes-hands/
  **Status:** UNVERIFIED (investigative-journalism source per the module's IUU/labor sourcing tier — treat as a lead, not established fact, until independently corroborated).

---

## 6. MSC (Marine Stewardship Council) certification

- **FACT:** Bumble Bee Seafood and FCF Co., Ltd. announced (reported ~2024) they are pursuing MSC certification for two longline tuna fisheries: (1) an Indian Ocean tuna longline fishery targeting albacore, bigeye, and yellowfin, with vessels flagged to China, Taiwan, Malaysia, Seychelles, and Oman fishing the high seas and EEZs of Mauritius, Seychelles, and Madagascar; and (2) a Western/Central Pacific albacore-and-yellowfin longline fishery. Together these span three oceans, three tuna species, and more than 250 longline vessels — reported to represent approximately 50% of Bumble Bee's entire albacore tuna production.
  **Source:** SeafoodSource, "Bumble Bee Seafood pursuing MSC certification for two longline tuna fisheries," https://www.seafoodsource.com/news/environment-sustainability/bumble-bee-seafood-pursuing-msc-certification-for-two-longline-tuna-fisheries; FisheryProgress.org FIP profile, "Western and Central Pacific albacore and yellowfin tuna longline," https://fisheryprogress.org/fip-profile/western-and-central-pacific-albacore-and-yellowfin-tuna-longline; Ocean Outcomes, "New Tuna FIP to Drive Improvements on Hundreds of Chinese and Chinese Taipei Longline Vessels," https://www.oceanoutcomes.org/news/bumble-bee-fcf-O2-albacore-tuna-project-FIP-launch/
  **Status:** UNVERIFIED for the certification claim itself — as of the most recent document found (a FisheryProgress.org FIP action-plan PDF dated April 2024), these fisheries were still IN ASSESSMENT / improvement-project status working toward MSC Principle 2 (ecosystem/bycatch) performance indicators, **not yet MSC-certified**. This must NOT be written as "Bumble Bee is MSC certified" — it is pursuing certification via an active Fishery Improvement Project.
  **Action needed:** direct query of fisheries.msc.org "Track a Fishery" for these two named fisheries would give the authoritative current certification status (certified / in assessment / suspended) — not completed this pass since MSC's site is an interactive tool per the skill's Stage-1 notes.

---

## 7. NOAA IUU / CBP forced-labor exposure — Bumble Bee has confirmed hits (unlike StarKist)

- **FACT:** CBP issued a Withhold Release Order (WRO) in 2020 on fish from the ***Da Wang***, a Vanuatu-flagged, Taiwan-owned distant-water fishing vessel, citing evidence of forced labor (physical violence, debt bondage, withholding of wages, abusive living/working conditions). Reporting ties the Da Wang's catch to Bumble Bee's supply chain; the Da Wang's crew were separately indicted on forced-labor/human-trafficking-related charges.
  **Source:** SeafoodSource / SeafoodSource reporting cited in WebSearch results (title: "US CBP takes action against Fijian tuna longliner..." references the broader pattern); Greenpeace, "Forced labor linked to Bumble Bee supply chain," https://www.greenpeace.org/usa/forced-labor-linked-to-bumble-bee-supply-chain/
  **Status:** The **WRO itself is a government action and VERIFIED-able** in principle (per the module's guidance that CBP WROs are government actions), but this pass sourced the Da Wang WRO's existence and date via secondary/advocacy reporting, not a direct read of the CBP WRO notice itself. **Status: UNVERIFIED pending a direct cbp.gov WRO-notice pull** — the Bumble Bee supply-chain LINK specifically is sourced from Greenpeace (advocacy org) and should be treated as a lead until CBP's own notice or a court record confirms the Bumble Bee connection.
- **FACT:** CBP issued a WRO effective August 4, 2021, on the ***Hangton No. 112*** (Fijian-flagged/owned), citing forced labor (withholding of wages, debt bondage, retention of identity documents). Hangton Pacific supplies tuna to the Pacific Fishing Company (PAFCO) canning facility in Levuka, Fiji, which has a processing agreement with Bumble Bee Seafoods.
  **Source:** CBP official notice, "CBP issues Withhold Release Order on Seafood Harvested with Forced Labor by the Hangton No. 112," https://www.cbp.gov/newsroom/national-media-release/cbp-issues-withhold-release-order-seafood-harvested-forced-labor-0
  **Status:** VERIFIED for the WRO itself (direct CBP government source, URL resolves to CBP's own newsroom). The Bumble Bee/PAFCO processing-agreement link is UNVERIFIED (relayed via secondary reporting summarizing the CBP notice plus trade-press context — not fully confirmed which portion of that description comes directly from CBP's own notice text vs. surrounding reporting).
- **FACT:** In March 2025, four fishing-vessel laborers filed suit alleging forced labor benefiting Bumble Bee's tuna supply chain; Bumble Bee moved to dismiss (reported June 2025).
  **Source:** Mongabay, "Bumble Bee asks court to dismiss lawsuit alleging forced labor in tuna supply chain," https://news.mongabay.com/2025/06/bumble-bee-asks-court-to-dismiss-lawsuit-alleging-forced-labor-in-tuna-supply-chain/; TradeLawDaily, https://tradelawdaily.com/article/2025/03/14/4-fishing-vessel-laborers-accuse-bumble-bee-tuna-of-benefitting-from-forced-labor-2503130048; Greenpeace, "Fishers sue Bumble Bee Foods for years of forced labor," https://www.greenpeace.org/usa/fishers-sue-bumble-bee-foods-for-years-of-forced-labor/
  **Status:** UNVERIFIED — this is an ALLEGATION in active/pending litigation (motion to dismiss reported, no ruling on the merits found). Per the skill's negative-claims-need-adjudication rule, this must be flagged as ALLEGED, not stated as established fact, unless/until a court ruling or settlement is found. Docket number not pulled this pass — a follow-up Stage-1 script run against CourtListener for "Bumble Bee forced labor 2025" would likely surface the S.D. Cal. docket.
- **NOT CHECKED:** NOAA's IUU Report to Congress (2023 edition found, not opened) was not read this pass for any additional Bumble Bee/FCF-linked vessel or flag-state identifications.

---

## 8. Greenpeace Tuna Guide (secondary/advocacy source — leads only)

- **FACT:** Greenpeace USA's tuna brand guide gives Bumble Bee a **failing grade**, describing it (in Greenpeace's own words, reported by SeafoodSource) as "North America's largest shelf stable seafood company," holding "over a quarter of the U.S. canned tuna market," while receiving poor sustainability ratings; Greenpeace states Bumble Bee "has not made a commitment to introduce responsibly-caught products under its flagship brand and is not using its market power to demonstrably help the oceans or seafood workers."
  **Source:** Greenpeace USA Tuna Guide, https://www.greenpeace.org/usa/oceans/tuna-guide/; "The high cost of cheap tuna" (3rd edition), https://www.greenpeace.org/usa/tuna-scorecard-24/; SeafoodSource, https://www.seafoodsource.com/news/environment-sustainability/greenpeace-ranks-u-s-tuna-canners-for-sustainability-flunks-most
  **Status:** UNVERIFIED / advocacy-organization source. Per the Cornucopia precedent in this skill, the pass/fail grade itself is a citable measured output; the descriptive/editorial language quoted above is Greenpeace's own characterization and is FORBIDDEN from being written into `sourcing` as established fact — only the grade/tier may be used.
- **NOT CHECKED:** Exact numeric score (if Greenpeace's methodology publishes one) not retrieved — the scorecard page itself was not directly rendered this pass.

---

## 9. Mercury (FDA/EPA — category-level, not brand-specific)

- **FACT:** Same FDA/EPA joint guidance as StarKist's checkpoint applies identically here — canned light (skipjack) tuna in "Best Choices" (2–3 servings/week); albacore/white and yellowfin tuna in "Good Choices" (1 serving/week) due to higher mercury bioaccumulation in larger/longer-lived species.
  **Source:** FDA, https://www.fda.gov/food/consumers/questions-answers-fdaepa-advice-about-eating-fish-those-who-might-become-or-are-pregnant-or
  **Status:** VERIFIED (primary FDA source, category-level — a statement about the tuna SPECIES, not a Bumble Bee-specific claim).

---

## 10. FDA recalls / warning letters (non-mercury)

- **FACT:** Bumble Bee Foods LLC recalled specific production codes of its 5-oz Chunk White Albacore and Chunk Light Tuna products (reported early 2023) due to loose seals/seams that could allow contamination by spoilage organisms or pathogens.
  **Source:** SeafoodSource, "Bumble Bee, Tri-Union Seafoods issue recall of canned tuna products," https://www.seafoodsource.com/news/food-safety-health/bumble-bee-tri-union-seafoods-issue-recall-of-canned-tuna-products
  **Status:** UNVERIFIED (single trade-press source this pass; FDA's own recall enforcement report not independently pulled).
- **NOT CHECKED:** FDA's recall database was not queried directly for Bumble Bee's full recall history (packaging-defect recalls also reported historically, e.g. a 2016 Bumble Bee/Tri-Union recall referenced in search results but not detailed here as it predates this research window's focus).
