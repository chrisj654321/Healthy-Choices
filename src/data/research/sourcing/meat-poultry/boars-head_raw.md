# Boar's Head — Stage 2 raw research (meat-poultry module)

Company: Boar's Head Provision Company (Boar's Head Brand), privately held.
No SEC filings, no public 10-K. Research date: 2026-07-30.

Tooling note: WebFetch returned HTTP 403 on fsis.usda.gov, cdc.gov, and the
ams.usda.gov PDF endpoints for this batch (same failure mode SKILL.md
documents for CourtListener/SEC). Facts below sourced from those domains
were obtained via WebSearch, whose result snippets directly quote/summarize
the FSIS/CDC pages — tagged VERIFIED where the WebSearch output is a direct
restatement of the primary agency page content, since the underlying source
is a government record, not a news outlet's independent reporting. Marked
UNVERIFIED where only secondary (news/advocacy) sources were reachable.

---

## 1. GAP (Global Animal Partnership) step level

**NOT a step holder — searched and absent.** Fetched
https://globalanimalpartnership.org/shoppers/ (2026-07-30), which lists
G.A.P.-certified retail/brand partners. Boar's Head does not appear on the
list. Full list captured includes: Imagine Foods, Campfire Treats, TruBeef
Organic, Butcher Box, Country Natural Beef, Pineland Farms, La Quercia, Deck
Family Farm, Wellshire Farms, Thompson Farms, Tender & True Pet Nutrition,
Southern Natural Farms, Pederson's Natural Farms, Open Farm Pet, Mosner
Family Brands, Meyer Natural Angus, Jaindl, Hunter Cattle, Joyce Farms,
Hickory Nut Gap Farm, Hearst Ranch, Diestel Turkey, Charcutnuvo, Baldwin
Family Farms, Thrive Market, Whole Foods Market, Amazon, Adams Ranch, 3
Little Pigs, DeBoer's Poultry, RAWR, Evermore Pet Food, The Honest Kitchen,
Ranger, Roxy Organic Chicken, LaBelle Patrimoine, Egganic, Rossdown Natural
Foods, Feltman's, Open Prairie, Canidae, Seemore Meats & Veggies, Cafe
Spice, Rosie Organic Chicken, Rocky Free Range Chicken, Nuggets Healthy
Eats, Patagonian Grass-Fed, Force of Nature, Halo Pets, Earth Animal, EVOL,
Mary's Turkey, Mary's Chicken, Pine Manor, Llano Seco Rancho, JD Farms, Best
Dressed Chicken, Original Brat Hans, Yorkshire Valley Farms, Panorama Meats,
Happy N Healthy Pet Products, Freshpet, Fork in the Road Foods, Bilinski's,
Bell & Evans, Atkins Ranch, Applegate Farms, Americhicken, Olli Salumeria.

- Source: Global Animal Partnership, "Shoppers" partner list,
  https://globalanimalpartnership.org/shoppers/, retrieved 2026-07-30.
- Status: **VERIFIED ABSENT** (genuine completed search of the live directory page).
- Caveat: page was read via WebFetch's page-summarization model, not a raw
  HTML/text dump — if the app later needs this as a load-bearing fact for a
  specific product, a second confirmation pass (direct browser view) is
  advisable before Stage 4 write-up.

## 2. Sourcing model

Boar's Head does **not** operate farms or raise animals itself; it buys from
external suppliers/growers under a contract-supplier model.

- Fact: "Boar's Head does not operate farms or raise animals themselves,
  instead relying on external suppliers... suppliers are carefully selected
  based on stringent criteria, including ethical farming practices, animal
  welfare standards, and sustainable approaches."
  Source: Boar's Head, "Animal Well-Being," https://boarshead.com/animalwell-being,
  retrieved 2026-07-30. Basis: **company-disclosure**. Status: VERIFIED (page fetched directly).
- Same page: Boar's Head states it "collaborates with animal welfare
  experts," "implements... verification audits, annual reviews, and
  third-party audits," and frames its standard around the "Five Freedoms."
  No specific certifier, certification name, or audit standard is named on
  the page — general "third-party audits" only, no named auditor.
  Source: same as above. Status: VERIFIED (company-disclosure, unnamed basis).
- Fact: Boar's Head complies with **FACTA (Farm Animal Care Training &
  Auditing)** for its chicken products and the **National Turkey Federation
  (NTF)** program for turkey products — these are described by the Animal
  Welfare Institute as *minimum industry* audits, not independent welfare
  certifications (see Section 4 below for the full AWI/FTC claim).
  Source: Animal Welfare Institute, cited via WebSearch summary of AWI
  materials, retrieved 2026-07-30. Status: UNVERIFIED (secondary/advocacy
  characterization of which standard Boar's Head uses — the *existence* of
  FACTA/NTF compliance is plausible company practice but AWI is an
  interested advocacy party in litigation against the claim; the underlying
  FTC complaint is the harder evidence, see Section 4).
- Fact: Most Boar's Head product is made under contract manufacturing
  relationships rather than in company-run plants exclusively; company
  strategy since the 1990s has stressed exclusive retailer relationships
  while relying on contracted producers for meat supply.
  Source: Wikipedia, "Boar's Head Provision Company," via WebSearch,
  retrieved 2026-07-30. Status: UNVERIFIED (secondary/encyclopedia source,
  not independently confirmed against a primary filing since the company is
  private).

## 3. "No antibiotics ever" / "no nitrates/nitrites added" claims

- Fact: Boar's Head "Simplicity" and "All Natural Collection" lines carry
  "no added hormones and no antibiotics ever" claims; product described as
  "humanely raised pork."
  Source: Boar's Head product pages, cited via WebSearch aggregation of
  Publix/Boar's Head listings, retrieved 2026-07-30. Basis: company-disclosure.
  Status: UNVERIFIED (WebSearch snippet aggregation, not a direct fetch of
  a single Boar's Head page — recommend Stage 3 re-confirm against
  boarshead.com/allnatural directly).
- Fact: Boar's Head "No Nitrates or Nitrites added except for those
  naturally occurring in cultured celery powder and sea salt" — standard
  FDA-permitted "uncured" labeling language, meaning the product does
  contain naturally-occurring nitrates/nitrites from celery powder despite
  the "no added" claim.
  Source: WebSearch aggregation of Boar's Head product labels, retrieved
  2026-07-30. Status: UNVERIFIED (label-claim aggregation, not single primary fetch).
- **USDA Process Verified Program (ams.usda.gov) check:** attempted to
  fetch the official PVP listing PDF
  (https://www.ams.usda.gov/sites/default/files/media/Official%20ListingPVP.pdf)
  directly — WebFetch returned 403. WebSearch of the PVP program plus
  "Boar's Head" returned no matching PVP entry for Boar's Head among results
  (entries found were for Tyson, Sanderson Farms, Wayne Farms, Case Farms,
  Koch Foods, Dallas USA Foods, Southwest Poultry — none Boar's Head).
  Status: **NOT CHECKED — directory PDF blocked by 403; WebSearch pass found
  no Boar's Head PVP entry among visible results but did not exhaustively
  page through the full 82-page listing, so this is not a completed search.**

## 4. Stress/handling practices — "humanely raised" claim challenged

This is the single most load-bearing finding for the "intentionally
misleading claims" priority.

- Fact: On **February 23, 2021**, the Animal Welfare Institute (AWI) filed a
  complaint with the **Federal Trade Commission (FTC)** alleging Boar's
  Head's "humanely raised" claims on its chicken sausage and "Simplicity All
  Natural" turkey products are deceptive. AWI's complaint states there is
  "no evidence" Boar's Head "exceeds minimum industry standards," arguing
  the company merely complies with FACTA (chicken) and NTF (turkey)
  programs, which AWI describes as auditing standards that "do not even
  require 100 percent compliance" and "put little emphasis on essential
  welfare standards such as environmental enrichment, adequate lighting, and
  low pre-slaughter mortality rates."
  Source: Animal Welfare Institute press release, "FTC Challenge: Boar's
  Head 'Humanely Raised' Labels Deceive Consumers,"
  https://awionline.org/press-releases/ftc-challenge-boars-head-humanely-raised-labels-deceive-consumers
  (link found via WebSearch; direct WebFetch of this specific URL returned
  the site's news-archive homepage instead of the article, so exact article
  text could not be independently confirmed by direct fetch); corroborated
  by AWI Quarterly Spring 2021 retrospective,
  https://awionline.org/awi-quarterly/spring-2021/awi-challenges-boars-head-humanely-raised-claim
  (this one WAS fetched directly, 2026-07-30, and confirms the February 2021
  date and the FACTA/NTF detail).
  Status: **VERIFIED as to AWI's filing and dated claim content** (via direct
  fetch of the AWI Quarterly retrospective); **UNVERIFIED as to any FTC
  disposition/outcome** — no evidence found that the FTC took public action
  on the complaint. This is advocacy-organization framing of Boar's Head's
  practices (AWI's characterization of FACTA/NTF as inadequate is AWI's own
  editorial judgment, not an adjudicated fact) — per SKILL.md's
  advocacy-prose rule, AWI's *characterization* ("far short of scientifically
  established standards") must NOT be carried into `sourcing` as established
  fact. Only the fact that AWI filed this specific complaint, on this date,
  about these specific product claims, is usable as a "consumer complaint
  filed" data point.
- No evidence found (via the searches run) that Boar's Head holds Certified
  Humane or AGW/Animal Welfare Approved certification for any supplier tier.
  Status: **NOT CHECKED against the Certified Humane and AGW directories
  directly** — attempted direct fetch of
  https://certifiedhumane.org/find-certified-products/ (404) and
  https://agreenerworld.org/directory/ (403); both directory fetches failed.
  WebSearch turned up no Certified Humane hit for Boar's Head, but per
  SKILL.md rule this is NOT CHECKED, not ABSENT, since the directory itself
  could not be queried.

## 5. Boar's Head 2024 listeria outbreak and recall — primary findings

- Fact: FSIS opened an investigation July 12, 2024, after the Maryland
  Department of Health detected Listeria monocytogenes in a liverwurst
  sample.
  Source: FSIS/CDC, via WebSearch summary, retrieved 2026-07-30.
  Status: VERIFIED (WebSearch snippet directly restates FSIS/CDC page
  content; underlying pages 403'd on direct WebFetch).
- Fact: **Initial recall July 26, 2024** — approximately **207,528 pounds**
  of liverwurst and related deli meat products, all made on the same
  production line as the contaminated sample, from the Jarratt, Virginia
  plant (Boar's Head Provisions Co., Inc.).
  Source: USDA-FSIS recall notice, "Boar's Head Provisions Co. Recalls
  Ready-To-Eat Liverwurst And Other Deli Meat Products Due to Possible
  Listeria Contamination,"
  https://www.fsis.usda.gov/recalls-alerts/boars-head-provisions-co--recalls-ready-eat-liverwurst-and-other-deli-meat-products
  (URL found via WebSearch; content retrieved via WebSearch summary since
  direct WebFetch of fsis.usda.gov 403'd). Status: VERIFIED via WebSearch
  restatement of the FSIS notice; recommend independent confirmation before
  Stage 4 if a tooling fix becomes available.
- Fact: **Expanded recall July 30, 2024** — approximately **7 million
  additional pounds** of ready-to-eat meat and poultry products, covering
  all products made at the Jarratt plant **between May 10 and July 29,
  2024**. FSIS establishment number referenced in secondary coverage as
  **M12612** (not independently confirmed against the primary FSIS
  establishment database due to the 403 issue).
  Source: USDA-FSIS recall notice, "Boar's Head Provisions Co. Expands
  Recall for Ready-To-Eat Meat and Poultry Products Due to Possible Listeria
  Contamination,"
  https://www.fsis.usda.gov/recalls-alerts/boars-head-provisions-co--expands-recall-ready-eat-meat-and-poultry-products-due,
  retrieved via WebSearch summary 2026-07-30 (direct WebFetch 403'd).
  Status: VERIFIED (pounds/date range) via WebSearch restatement of the FSIS
  page; **establishment number M12612 is UNVERIFIED** (found only in
  secondary aggregation, not confirmed on a primary FSIS document directly).
- Fact: **Outbreak toll — 61 illnesses across 19 states, 10 deaths.**
  Illness window January–July 2024 per one CDC-sourced summary (a separate
  secondary summary described the outbreak window as "May to November
  2024" — these two figures conflict and should be reconciled at Stage 3
  against the CDC's own page directly, which WebFetch could not reach).
  Source: CDC, "Investigation Update: Listeria Outbreak, Meats Sliced at
  Delis," https://www.cdc.gov/listeria/outbreaks/delimeats-7-24/investigation.html,
  retrieved via WebSearch summary 2026-07-30 (direct WebFetch 403'd).
  Status: VERIFIED for the headline figures (61 illnesses, 19 states, 10
  deaths) — these numbers were consistent across every independent
  WebSearch pass and multiple outlets (Marler Blog, Food Safety News, ABC
  News); **the exact date range is UNVERIFIED / DISPUTED between sources**
  (January–July 2024 vs. May–November 2024) and needs a direct-fetch
  reconciliation at Stage 3 if tooling allows, or should be left as a range
  rather than an exact start/end date.
- Fact: FSIS suspended all production at the Jarratt, VA plant on **July 31,
  2024**. Boar's Head announced the **permanent closure** of the Jarratt
  facility and **discontinuation of all liverwurst production** by
  September 13, 2024.
  Source: WebSearch aggregation of FSIS/company statements (Today.com,
  ConsumerAffairs), retrieved 2026-07-30. Status: UNVERIFIED (secondary
  news sourcing; direct FSIS/company statement not independently fetched).
- Fact: **USDA-FSIS's own January 2025 public report** ("Review of the
  Boar's Head Listeria monocytogenes Outbreak," January 2025) found
  "inadequate sanitation practices" at the Jarratt facility contributed to
  the outbreak, and documented **69 noncompliance reports** issued for the
  Jarratt facility in the year leading up to the outbreak (inspections
  logged August 2023–August 2024), citing observed black mold, mildew,
  insects, blood pooling on floors, and foul odors.
  Source: USDA-FSIS, "Review of the Boar's Head Listeria monocytogenes
  Outbreak," January 2025 PDF,
  https://www.fsis.usda.gov/sites/default/files/media_file/documents/Boars-Head-Public-Report-012025.pdf
  (URL confirmed via WebSearch; direct WebFetch of the PDF returned 403).
  Status: VERIFIED via WebSearch restatement of the report's headline
  findings (multiple independent outlets — Food Safety News, ConsumerAffairs
  — cite the same "69 noncompliance reports" and "inadequate sanitation
  practices" language, consistent with a direct quote from the report); the
  PDF itself could not be independently opened to confirm exact wording.
- Fact (broader plant scope): A separate Food Safety News investigation,
  fetched directly, reports FSIS inspection documents also flagged years of
  sanitation issues (product residue on food-contact surfaces on nine
  separate dates Feb–Jul 2024; fly/cockroach/ant/ladybug infestations;
  standing water with algal growth on the receiving dock; black mold on wall
  caulk and steel vats) specifically at the **Jarratt, VA** facility (built
  1974, 219,182 sq ft), with the inspection record spanning **February
  2019** (baseline) through **July 29, 2024**.
  Source: Food Safety News, "Boar's Head inspection documents show years of
  safety problems preceded outbreak,"
  https://www.foodsafetynews.com/2026/06/boars-head-inspection-documents-show-years-of-safety-problems-preceded-outbreak/,
  fetched directly 2026-07-30. Status: VERIFIED as reported by this outlet
  (direct fetch succeeded); this is a news outlet's synthesis of primary
  FSIS inspection records, not the FSIS records themselves, so tag as
  VERIFIED-SECONDARY (a serious journalism outlet's direct account of
  government documents it reviewed, one step removed from primary).
- Fact (multi-plant scope, separate from Jarratt): CBS News and other
  outlets reported additional violations found at Boar's Head plants in
  **New Castle, Indiana**; **Forrest City, Arkansas**; and **Petersburg,
  Virginia** (a second VA facility distinct from Jarratt), with issues
  dating back roughly six years, including equipment covered in meat
  scraps, "old dry meat and fat residue," mold, insects, and blood pools.
  Source: WebSearch aggregation citing CBS News coverage, retrieved
  2026-07-30. Status: UNVERIFIED (not independently fetched from CBS
  directly; treat as a lead for Stage 3 to confirm against primary FSIS
  inspection records if accessible).
- Fact: An OSHA inspection of Boar's Head Provisions Co. Inc. (inspection
  #317489482) resulted in one **Serious** citation under 29 CFR
  1910.22(a)(1) ("general requirements" — walking-working surfaces),
  penalty **$2,100**, issued **March 19, 2014**, contested April 1, 2014,
  final order June 13, 2016 (state-plan settlement). This predates the 2024
  outbreak by a decade and is unrelated to it — included here only because
  it's the one OSHA record found for the company; it does not describe
  sanitation/food-safety conditions, only a workplace walking-surface
  hazard.
  Source: OSHA establishment/violation detail page,
  https://www.osha.gov/ords/imis/establishment.violation_detail?id=317489482&citation_id=01001A,
  fetched directly 2026-07-30. Status: VERIFIED (direct fetch of OSHA's own
  record).

## 6. Litigation

- Fact: Boar's Head **settled its first wrongful-death lawsuit** tied to the
  2024 outbreak — the family of **Gunter Morgenstein**, represented by Ron
  Simon & Associates, announced the settlement December 13 (year not
  independently confirmed, presumed 2024 based on outbreak timeline; terms
  undisclosed).
  Source: WebSearch aggregation (MEAT+POULTRY, "Boar's Head reaches
  settlement in wrongful death lawsuit"), retrieved 2026-07-30. Status:
  UNVERIFIED (secondary trade-press report, no court docket number found;
  per SKILL.md, WebFetch is 403'd on CourtListener so a docket-level
  confirmation was not attempted for this specific matter — flag for a
  direct `[company] lawsuit` docket search at Stage 3).
- Fact: A separate wrongful-death suit was filed on behalf of **Otis Adams
  Jr.**'s family, alleging he contracted listeria from Boar's Head **ham**
  (not liverwurst) — notable because it was reportedly the first suit tied
  to ham/cheese products rather than liverwurst.
  Source: The Hill, via WebSearch aggregation, retrieved 2026-07-30. Status:
  UNVERIFIED (secondary news report, no docket number located).
  **CourtListener/PACER limitation note (SKILL.md):** not independently
  queried for a docket number due to the documented CourtListener 403 issue;
  a direct WebSearch for "Adams v. Boar's Head" docket number was not run in
  this pass — recommend Stage 3 do so.
- Fact: A **class-action settlement of $3.1 million** was reached over the
  July 2024 recall; claim deadline was **May 16, 2025**.
  Source: Fast Company / Food Poisoning News, via WebSearch aggregation,
  retrieved 2026-07-30. Status: UNVERIFIED (secondary reporting; no docket
  number independently confirmed).

## Summary of gaps for Stage 3 (fact-check) to prioritize

1. Reconcile the outbreak date-range conflict (Jan–Jul 2024 vs. May–Nov
   2024) directly against cdc.gov if a working fetch path is found.
2. Confirm FSIS establishment number M12612 against a primary FSIS source.
3. Get docket numbers for the Morgenstein settlement and Adams v. Boar's
   Head suits via direct WebSearch (not attempted this pass) since
   CourtListener itself is 403'd for WebFetch.
4. Certified Humane and AGW directories were NOT CHECKED (both direct
   fetches failed with 404/403) — re-attempt before writing `unknown` vs.
   ABSENT into the final record.
5. USDA Process Verified Program: NOT CHECKED (PDF listing 403'd); no PVP
   hit found for Boar's Head in the WebSearch pass, but this was not an
   exhaustive page-by-page search of the ~82-page official listing.
