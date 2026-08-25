# StarKist Co. — Stage 2 raw research (seafood module)

companyId: `starkist` | Owned by Dongwon Industries Co., Ltd. (South Korea)
Researched: 2026-07-30. Raw facts only — no characterization, no scoring.
Category note: canned tuna is virtually all wild-caught (no meaningful US
commercial tuna aquaculture), so per founder direction this batch prioritizes
Seafood Watch rating, fishing method/bycatch, and MSC status over the
farmed-vs-wild decode that leads the module generally.

---

## 1. Ownership / corporate structure

- **FACT:** StarKist is wholly owned by Dongwon Industries Co., Ltd. (Dongwon F&B was folded back into Dongwon Industries as a single food division). Dongwon purchased StarKist from Del Monte Foods on June 24, 2008, for slightly more than $300 million.
  **Source:** Wikipedia "StarKist" (tertiary, cites SEC/press at time) + KED Global "Dongwon F&B to accelerate global push with StarKist" (2023-10-12), https://www.kedglobal.com/korean-food/newsView/ked202310120012
  **Status:** UNVERIFIED (secondary/news sources; no SEC or Dongwon primary filing pulled directly — Dongwon is Korean-listed, not SEC-registered, so 10-K pull from the skill's script doesn't apply here).
- **FACT:** Dongwon Group has explored/discussed a possible U.S. IPO for its StarKist business to fund logistics acquisitions (reported 2023–2024).
  **Source:** SeafoodSource, "Dongwon Group explores StarKist IPO to fund logistics acquisition," https://www.seafoodsource.com/news/business-finance/dongwon-group-explores-starkist-ipo-to-fund-logistics-acquisition
  **Status:** UNVERIFIED (news reporting of a stated intention, not a completed transaction).

---

## 2. Criminal antitrust price-fixing case (DOJ) — the flagged "already-known" finding

**Cross-reference:** this case is already documented (reviewed, in production) in `src/data/companies.js` under `starkist.issues` (`tuna-price-fixing-criminal`, `tuna-civil-settlement-2024`). Restating with full source detail here for the sourcing pipeline's own record, verified independently:

- **FACT:** StarKist Co. and co-conspirators (Bumble Bee, Chicken of the Sea/Tri-Union Seafoods) agreed to fix prices of canned tuna sold in the U.S. from as early as November 2011 through at least December 2013.
  **Source:** DOJ Antitrust Division case page, "US v. StarKist Co.," https://www.justice.gov/atr/case/us-v-starkist-co
  **Status:** VERIFIED (primary government source; case summary; DOJ site itself 403'd WebFetch but content confirmed via search-engine cache of the DOJ page and cross-confirmed by CourtListener docket below).
- **FACT:** Federal criminal case *United States v. Starkist Co.*, N.D. Cal., docket 3:18-cr-00513. Information filed 2018-10-18; Plea Agreement filed 2018-11-14 (StarKist pleaded guilty to one count of price-fixing, Sherman Act §1); docket terminated 2019-09-11.
  **Source:** CourtListener docket (pulled via this skill's Stage-1 script, `_primary.json`), https://www.courtlistener.com/docket/8049367/united-states-v-starkist-co/
  **Status:** VERIFIED (primary court record, pulled programmatically by the skill's approved script — not a blocked WebFetch call).
- **FACT:** U.S. District Judge Edward M. Chen (N.D. Cal.) sentenced StarKist to pay a $100 million criminal fine — the statutory maximum — plus a 13-month term of probation. StarKist had argued for a reduced $50 million fine, citing bankruptcy risk; the judge rejected that argument. Sentencing occurred September 2019 (consistent with the docket-termination date above, 2019-09-11).
  **Source:** DOJ press release, "StarKist Ordered to Pay $100 Million Criminal Fine for Antitrust Violation," https://www.justice.gov/archives/opa/pr/starkist-ordered-pay-100-million-criminal-fine-antitrust-violation (2019); corroborated by CBS News, SeafoodSource, National Fisherman, Natural Law Review coverage of the same sentencing.
  **Status:** VERIFIED (DOJ press release is a primary government source; WebFetch to justice.gov 403'd per the known tooling limitation, but the release's content — fine amount, judge, probation term, StarKist's $50M counter-argument — is corroborated identically across five independent outlets, so treating as VERIFIED per the skill's guidance that DOJ press releases are directly citable government sources).
- **FACT:** StarKist petitioned the U.S. Supreme Court (No. 22-131) in August 2022 to overturn the Ninth Circuit's April 2022 en banc (9-2) decision upholding class certification in the related civil antitrust suit (*Olean Wholesale Grocery Cooperative v. Bumble Bee Foods* et al.). The Supreme Court declined to hear the appeal (cert denied), leaving the class certification — and StarKist's exposure to the related civil settlement — in place.
  **Source:** SeafoodSource, "US Supreme Court declines to hear Starkist's price-fixing lawsuit appeal"; U.S. Chamber of Commerce case page, "StarKist Co. v. Olean Wholesale Grocery Cooperative, Inc.," https://www.uschamber.com/cases/antitrust-and-competition-law/starkist-co-v-olean-wholesale-grocery-cooperative-inc; SCOTUS docket filings at supremecourt.gov (No. 22-131).
  **Status:** VERIFIED (multiple independent outlets + direct SCOTUS docket filings referenced by URL).
- **FACT:** Civil MDL *In re: Packaged Seafood Products Antitrust Litigation*, S.D. Cal., docket 3:15-md-02670, filed 2015-12-09 (consolidating the individual purchaser suits against StarKist, Bumble Bee, and Chicken of the Sea/Tri-Union). Dozens of individual feeder cases exist (e.g. *Olean Wholesale Grocery Cooperative, Inc. v. Bumble Bee Foods LLC*, 3:15-cv-01714).
  **Source:** CourtListener docket (Stage-1 script pull), https://www.courtlistener.com/docket/4193574/in-re-packaged-seafood-products-antitrust-litigation/
  **Status:** VERIFIED (primary court record via approved script).
- **FACT:** In December 2024, U.S. District Judge Dana Sabraw (S.D. Cal.) approved over $216 million in combined civil settlements from StarKist, Bumble Bee, and their parent companies, resolving claims from direct purchasers, commercial food preparers, and individual consumers.
  **Source:** Courthouse News Service, "Judge grants $216 million settlement in yearslong canned tuna antitrust suit," https://www.courthousenews.com/judge-grants-216-million-settlement-in-yearslong-canned-tuna-antitrust-suit/ (already cited in companies.js, cross-confirmed here).
  **Status:** VERIFIED (already reviewed/merged data per companies.js; independently corroborated in this pass by the same court-record chain above).
- **FACT:** Washington State's Attorney General filed a separate state civil suit (2020) against StarKist and Dongwon Industries; a state court found StarKist liable for price-fixing and state Consumer Protection Act violations. (Already documented in companies.js.)
  **Status:** UNVERIFIED in THIS pass — not independently re-confirmed via a state-court docket (WA state courts aren't covered by CourtListener's federal-only search per the module's known limitation); carried forward from the already-reviewed companies.js entry, not re-verified here.

---

## 3. Seafood Watch (Monterey Bay Aquarium) — rating, method, bycatch

**Structural fact:** Seafood Watch does NOT publish brand-level ratings. It rates by **species + fishing gear/method + region/stock**, exactly as the skill's module notes ("cite its actual rating and reasoning, not just the letter grade"). StarKist's own products draw from multiple underlying fisheries/methods, so the ratings below are the underlying components StarKist's canned tuna is sourced from, not a single "StarKist rating."

- **FACT:** Seafood Watch rates **skipjack tuna** caught by **purse seine on floating objects/FADs** (Northwest, Southwest, or Western Central Atlantic) **red — "Avoid."** Cited concerns: catch of overfished bigeye tuna, blue marlin, and at-risk sharks as bycatch; measures to reduce bycatch of highly vulnerable species need strengthening.
  **Source:** Seafood Watch, "Skipjack Tuna" recommendation page, https://www.seafoodwatch.org/recommendation/tuna/skipjack-tuna-30707 (accessed via search-engine index, page itself did not return readable content to WebFetch — treat rating text as reported by the page's indexed content).
  **Status:** UNVERIFIED-pending-direct-view — the rating figure (red/Avoid) and stated reasoning were retrieved via search-engine snippet of the Seafood Watch page, not a successful direct WebFetch render (the fetch returned only a nav skeleton, likely JS-rendered content). Treat as high-confidence secondary until a direct page render confirms it.
- **FACT:** Seafood Watch's general consumer guidance for canned/pouched tuna: "buy...tuna from the Atlantic or Pacific when you see one of these terms on the label: pole-caught, pole-&-lines, troll-caught, or FAD-free (also called free school or school-caught)" as the better-choice indicators, and explicitly advises "Avoid tuna caught with longlines or purse seines using FADs, except for the sources we recommend."
  **Source:** Seafood Watch consumer tuna guide, https://www.seafoodwatch.org/recommendations/download-consumer-guides/sustainable-tuna-guide
  **Status:** UNVERIFIED-pending-direct-view (same retrieval caveat as above).
- **NOT CHECKED:** Seafood Watch's specific rating pages for **albacore tuna** (troll/pole-and-line vs. longline, by ocean basin) and **yellowfin tuna** (purse seine FAD vs. free-school vs. pole-and-line) were not successfully rendered — WebFetch returned empty/nav-only content on the albacore page (https://www.seafoodwatch.org/recommendation/tuna/albacore-30725), and yellowfin's page URL was not directly retrieved this pass. A direct browser or authenticated fetch of these pages is needed to record StarKist's exact underlying gear-type ratings with full reasoning text.
- **NOT CHECKED:** Whether Seafood Watch's assessment PDFs (e.g. the Indian Ocean tuna pelagic assessment, seafoodwatch.org/globalassets/sfw/pdf/expert-review/2025/...) name StarKist or Dongwon-linked vessels specifically — a PDF was found in search results but not opened/read this pass.

---

## 4. Fishing method — StarKist's own sourcing disclosures

- **FACT:** StarKist announced (April 2021) that it sources 100% of its tuna and salmon from suppliers that meet the MSC standard for sustainable fishing OR are enrolled in a Fishery Improvement Project (FIP) working toward that standard.
  **Source:** PR Newswire, "StarKist® Sourcing 100% of its Tuna and Salmon from Marine Stewardship Council (MSC) or Fishery Improvement Project (FIP) Fisheries," https://www.prnewswire.com/news-releases/starkist-sourcing-100-of-its-tuna-and-salmon-from-marine-stewardship-council-msc-or-fishery-improvement-project-fip-fisheries-301274999.html; corroborated by SeafoodSource, "StarKist says all its salmon and tuna now sustainably-sourced," https://www.seafoodsource.com/news/environment-sustainability/starkist-says-all-its-salmon-and-tuna-now-sustainably-sourced
  **Status:** UNVERIFIED as an independent fact (this is StarKist's own company-disclosure/press release, not a third-party audit — per the skill's praise rail, this can only be recorded as company-disclosure basis, never as an independently verified sustainability claim).
- **FACT (company-disclosure):** StarKist states it purchased 100% of its purse-seine tuna supply from vessels listed on the International Seafood Sustainability Foundation's (ISSF) ProActive Vessel Register (PVR), and 33.9% of its longline purchases were from PVR-listed vessels, for its most recent reporting period (exact year not confirmed in this pass).
  **Source:** Aggregated by WebSearch from StarKist's own Sustainability Knowledge Center / Natural Resources & Policies pages, https://starkist.com/sustainability-knowledge-center/ and https://starkist.com/about-starkist/corporate-responsibility/natural-resources-policies/ — pages not independently rendered via WebFetch this pass, figures relayed via search index.
  **Status:** UNVERIFIED (company-disclosure basis; source page not directly rendered — NOT CHECKED for the exact reporting year/date these percentages apply to).
- **FACT (company-disclosure, forward target):** StarKist states a goal to purchase 100% of its tuna and salmon from MSC-certified fisheries by the end of 2026.
  **Source:** Same StarKist sustainability pages as above, relayed via SeafoodSource coverage.
  **Status:** UNVERIFIED (company-disclosure, forward-looking target, not yet an achieved/audited state).
- **NOT CHECKED:** No public disclosure found this pass of StarKist's specific pole-and-line vs. purse-seine-with-FAD percentage breakdown for its flagship U.S. retail products (chunk light, solid white albacore). The 100%-purse-seine-PVR figure above describes vessel registry participation, not gear type (PVR vessels can still use FADs).

---

## 5. MSC (Marine Stewardship Council) certification

- **NOT CHECKED:** msc.org's "Track a Fishery" / certified fishery list was not directly queried by brand name this pass (per the skill, MSC's site is an interactive search tool requiring a live agent session, not just WebSearch). WebSearch results describe StarKist's FIP/PVR-based sourcing model (above) rather than naming a specific MSC-certified fishery StarKist itself holds chain-of-custody certification for.
  **Action needed:** a follow-up pass should query fisheries.msc.org directly for "StarKist" or "Dongwon" as a supply-chain/chain-of-custody certificate holder.

---

## 6. NOAA IUU / CBP forced-labor exposure

- **FACT:** A completed search for CBP Withhold Release Orders (WROs) or IUU-fishing enforcement actions specifically naming StarKist or vessels supplying StarKist found **no results** — no WRO or IUU action tied to StarKist's supply chain was located, in contrast to Bumble Bee (see that company's separate checkpoint, which does have two named WROs in its supply chain).
  **Source:** WebSearch queries against cbp.gov "Withhold Release Orders & Findings" listings and general IUU-fishing search terms combined with "StarKist," conducted 2026-07-30.
  **Status:** Search genuinely completed — recording as **absent from this search**, not "no case exists." CBP's WRO list (cbp.gov/trade/forced-labor/withhold-release-orders-and-findings) was not paged through item-by-item; a completed direct read of that list would be a stronger confirmation.
- **NOT CHECKED:** NOAA's biennial IUU Report to Congress (most recent found in search: 2023 report, fisheries.noaa.gov/s3/2023-08/2023RTC-ImprovingIFManagement.pdf) was not opened/read this pass to check whether it names Dongwon-linked or StarKist-supplying vessels/nations for IUU identification.

---

## 7. Greenpeace Tuna Guide (secondary/advocacy source — leads only)

- **FACT:** Greenpeace USA's canned tuna brand guide (most recent cited edition: "The high cost of cheap tuna," 3rd edition, https://www.greenpeace.org/usa/tuna-scorecard-24/) gives StarKist a **failing grade**, alongside Bumble Bee and Chicken of the Sea (described in Greenpeace's own coverage as the market's "big three" all receiving failing scores for "little improvement to their policies and practices").
  **Source:** Greenpeace USA Tuna Guide, https://www.greenpeace.org/usa/oceans/tuna-guide/; SeafoodSource, "Greenpeace ranks U.S. tuna canners for sustainability, flunks most," https://www.seafoodsource.com/news/environment-sustainability/greenpeace-ranks-u-s-tuna-canners-for-sustainability-flunks-most
  **Status:** UNVERIFIED / advocacy-organization source — per the module's Cornucopia precedent, Greenpeace's letter grade/pass-fail output is a citable measured score (like Cornucopia's numeric score), but any of Greenpeace's editorial sentences characterizing StarKist (e.g. "StarKist continues its trend of ocean destruction," found in search results) is advocacy-organization prose and is FORBIDDEN from being carried into `sourcing` as fact per the political-analysis rules this skill imports verbatim. Only the grade/tier is usable, never the editorial line.
- **NOT CHECKED:** The exact numeric score or letter grade (as opposed to plain "failing") was not retrieved — the actual Greenpeace scorecard page (greenpeace.org/usa/tuna-scorecard-24/) was not directly rendered this pass.

---

## 8. Mercury (FDA/EPA — category-level, not brand-specific)

- **FACT:** FDA/EPA joint fish-consumption advice places canned light (skipjack) tuna in the "Best Choices" category (2–3 servings/week), and albacore/white tuna and yellowfin tuna in the "Good Choices" category (1 serving/week, no other fish that week that week) due to higher mercury content in the larger, longer-lived albacore and yellowfin species versus skipjack.
  **Source:** FDA, "Questions & Answers from the FDA/EPA Advice about Eating Fish," https://www.fda.gov/food/consumers/questions-answers-fdaepa-advice-about-eating-fish-those-who-might-become-or-are-pregnant-or; Federal Register notice, https://www.federalregister.gov/documents/2017/01/19/2017-01073/advice-about-eating-fish-from-the-environmental-protection-agency-and-food-and-drug-administration
  **Status:** VERIFIED (primary FDA source, category-level guidance — this is a statement about the tuna SPECIES/category, not a StarKist-specific accusation or test result; must be presented that way per the module's mercury-advisory guidance).
- **NOT CHECKED:** No StarKist-specific mercury recall or FDA warning letter was found in this pass (searches surfaced packaging-defect and contamination recalls unrelated to mercury — see below).

---

## 9. FDA recalls / warning letters (non-mercury)

- **FACT:** StarKist canned tuna was among products named in a recall initiated by Gold Star Distribution (a Minneapolis wholesaler), reported around February 2026, after FDA found the distributor's facility had rodent excreta and bird droppings with potential to contaminate stored product. This was a distributor-facility recall (Gold Star), not a StarKist manufacturing/formulation recall.
  **Source:** SeafoodSource, "Starkist among brands in massive Gold Star recall," https://www.seafoodsource.com/news/food-safety-health/starkist-chicken-of-the-sea-among-recalled-brands-in-massive-gold-star-recall
  **Status:** UNVERIFIED (single trade-press source this pass; not cross-checked against FDA's own recall database/enforcement report).
- **NOT CHECKED:** FDA's recall database (accessdata.fda.gov/scripts/ires/) was not queried directly for a full StarKist recall history.
