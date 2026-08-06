# Perdue Farms — Stage 2 raw research findings

companyId: `perdue` | Industry module: meat-poultry | Research pass: 2026-08-05

## NOT CHECKED — flag for Stage 3/later stages

- **USDA Organic Integrity Database (organic.ams.usda.gov/integrity)** — the live
  database is an Angular single-page app that would not render/query reliably
  through this session's browser tooling (errored on load, blank viewport on
  retry). Panorama Organic and Coleman Organic's USDA Organic status is
  reported below ONLY from secondary press/company sources, not a direct DB
  hit. Someone with working access to the DB should re-run this query.
- **A Greener World / Animal Welfare Approved directory (agreenerworld.org/directory/)**
  — the directory has a live search box, but this session's browser tool
  could not drive it reliably (query params didn't filter; a second tab
  rendered at 0x0 viewport). General web search turned up no AGW/Animal
  Welfare Approved hits for any of the 5 brands (see below), but that is NOT
  the same as a completed directory search — treat AGW status as unresolved,
  not absent.
- **GAP's own searchable partner/producer directory** — GAP's site does not
  expose a queryable public database (confirmed by fetching
  globalanimalpartnership.org/certified-gap/: "does not contain a searchable
  directory of certified producers or brands"). Findings below for GAP come
  from GAP's own portfolio/news pages, brand sites, and secondary sources
  (Whole Foods product listings, Cornucopia, trade press) — not a directory
  search. GAP portfolio pages for Coleman Natural Foods and Niman Ranch
  either 404'd or rendered as content-empty placeholders when fetched
  directly; figures below for those two are AI-search-engine summaries of
  page content I could not independently re-verify by direct fetch, and
  should be treated as lower-confidence than the Draper Valley/Panorama
  findings (which had corroborating independent sources).
- **USDA-FSIS Quarterly Enforcement Reports** (noncompliance records,
  suspensions) — fsis.usda.gov pages returned HTTP 403 to direct fetch in
  this session. Only recall/public-health-alert pages (which are also
  aggregated by news outlets) were reachable. No noncompliance-report-level
  search was completed.
- **CourtListener full-text search across all 18 Perdue dockets** — I only
  deep-read the two dockets the brief flagged (Jien, Hemy) plus followed up
  on two more that looked consumer/product-relevant from the docket list
  (Owens, Chaney). The other ~14 dockets in the raw pull are single-plaintiff
  employment-discrimination/labor suits (civil rights jobs, ADA, FLSA) per
  their `natureOfSuit` field and were treated as noise per the brief's
  instruction, not individually opened.

## 1. GAP (Global Animal Partnership)

- **Perdue (parent brand)**: Perdue's own corporate site states its organic
  chicken is raised on farms "GAP 2 or higher." — Source: Perdue Farms
  corporate site, corporate.perduefarms.com/responsibility/animal-care/programs-practices
  (fetched 2026-08-05). This is a **company-disclosure claim**, not a
  confirmed GAP directory hit — GAP's own site was not queryable (see NOT
  CHECKED above). Perdue Foodservice's animal-care page
  (perduefoodservice.com/the-perdue-difference/animal-care/) mentions GAP
  only in a footnote about breed-welfare-assessment approval bodies for the
  Better Chicken Commitment, not as a GAP step certification for Perdue's
  own product line.
- **Coleman Natural Foods**: search-engine summary of
  globalanimalpartnership.org/portfolio/coleman-natural-foods/ (direct fetch
  404'd) states Coleman Natural has farms/ranches certified at **Pork Step 1**
  and **Chicken Step 2, Step 3 (organic), and Step 5**. Lower confidence per
  NOT CHECKED note above — could not independently re-verify by direct page
  fetch. Source: Google/Bing-indexed cache of the GAP portfolio page, accessed
  2026-08-05.
- **Niman Ranch**: GAP's own portfolio page
  (globalanimalpartnership.org/portfolio/niman-ranch/) rendered as an empty
  placeholder (just a heading and an August 15, 2017 date, no step data) when
  fetched directly. A separate GAP news mention names Paul Willis (Niman Ranch
  Pork Co. manager) as a "Step-rated farmer" without stating the step. No
  reliable step number found for Niman Ranch.
- **Panorama Organic**: **Step 4**, confirmed via multiple independent
  sources — GAP's own 2021 announcement post ("Panorama Grass-Fed Meats -
  Organic, Step 4 Rated, 100% Grass-Fed Ranchers,"
  globalanimalpartnership.org/about/news/post/panorama-grass-fed-meats-organic-step-4-rated-100-grass-fed-ranchers/,
  Nov 1, 2021), a Whole Foods Market product listing ("Panorama, Beef Ground
  85/15 ... Grass Fed Organic Step 4"), and Panorama's own marketing copy
  ("Global Animal Partnership (GAP) Step 4 approved"). Ranches have held
  Step 4 "since the program launch in 2010" per the GAP announcement.
- **Draper Valley Farms**: Draper Valley's own site
  (drapervalleyfarms.com/practices/global-animal-partnership/) states "We're
  proud to be certified by the Global Animal Partnership (GAP)" but does NOT
  state a specific step number anywhere on the page. No step number found
  elsewhere either. Record as: GAP-certified, step level unknown.

## 2. Certified Humane (certifiedhumane.org)

- **Niman Ranch**: CONFIRMED. certifiedhumane.org's own press page
  ("Niman Ranch Joins Certified Humane®," certifiedhumane.org/niman-ranch-joins-certified-humane/,
  fetched 2026-08-05) states: certification covers "all of Niman Ranch's
  pork, beef, lamb and processed products, including bacon, sausages, hot
  dogs, and hams," effective **September 1, 2016**. Niman Ranch became "the
  largest multi-protein company in the U.S. to join the program," across
  "more than 720 independent family farms and ranches."
- **Coleman Natural Foods**: NOT Certified Humane. Coleman's pork is
  certified under a DIFFERENT program — **American Humane Certified**
  (administered by American Humane, not Humane Farm Animal Care's Certified
  Humane program — these are two distinct certifiers, do not conflate).
  Source: meatpoultry.com and refrigeratedfrozenfood.com trade press, 2018
  ("Coleman Naturals goes crate-free," "Perdue Farms' Coleman Natural Foods
  pork brand now 100% crate-free"), corroborated by colemannatural.com/standards/.
  Coleman states its pork is "100% crate-free" (gestation and farrowing) and
  "one of only two pork companies that are American Humane Certified."
- **Perdue, Panorama Organic, Draper Valley Farms**: no Certified Humane hits
  found in web search. Search was general web search, not a direct
  certifiedhumane.org producer-search-tool query (that tool's URL/interface
  was not identified in this session) — treat as a partial/general search,
  not a fully completed directory search.

## 3. A Greener World / Animal Welfare Approved (agreenerworld.org)

No AGW/Animal Welfare Approved certification found via general web search for
Perdue, Coleman Natural, Niman Ranch, Panorama Organic, or Draper Valley
Farms. The one certifiedhumane.org-adjacent hit ("Panorama at the Peak
Restaurant") is an unrelated Berkeley Springs, WV restaurant, not Panorama
Organic Grass-Fed Meats. Per the NOT CHECKED section above, the directory's
own search interface could not be reliably driven by this session's browser
tool, so this is a general-search null result, not a directory-confirmed
ABSENT.

## 4. USDA Process Verified Program (PVP) — "no antibiotics ever"

CONFIRMED, well-documented. Perdue Foods LLC holds a **USDA AMS Process
Verified Program** certification specifically for its "No Antibiotics Ever"
claim, with USDA AMS auditors sent to "the hatchery, the feed mill and the
farm." Perdue's own animal-care page states it holds "USDA Process Verified
Program for Poultry Care," covering "more than 50 documented points from
hatchery to harvest," and that for turkeys specifically: "All our
No-Antibiotics-Ever turkeys are fed a vegetarian diet and are certified in
the USDA Process Verified Program by USDA auditors." A specific facility
listing (Perdue Foods LLC, Concord, NC, Est. P-9099, Certificate No.
PV6089TSA, originally approved December 6, 2012, plus a Cromwell Complex,
Cromwell, KY location) is referenced via search-indexed content, though the
canonical USDA AMS page itself
(ams.usda.gov/content/perdue-foods-llc-process-verified-program) returned
HTTP 403 on direct fetch — treat the facility-level detail as
lower-confidence, the program-level fact (Perdue Foods LLC IS PVP-certified
for No Antibiotics Ever) as solid, corroborated by both Perdue's own site and
independent trade press (prnewswire.com 2015 release on PVP expansion).
Perdue states it "became the first major chicken company to eliminate the
routine use of all human antibiotics from every production step" by the end
of 2014.

## 5. USDA Organic Integrity Database

NOT CHECKED directly (see top of file). Secondary-source-only findings,
basis = company/press disclosure, NOT a database confirmation:
- **Panorama Organic**: multiple sources (Whole Foods listings, Panorama's
  own marketing, Cornucopia Institute scorecard writeups) describe it as
  "third-party USDA Certified Organic." Cornucopia Institute's Organic Beef
  Scorecard (which itself sources from the Organic Integrity DB) includes
  Panorama Organic as a rated entry, which is indirect evidence the line is
  in the DB, but I did not query the DB myself.
- **Coleman Natural / Coleman Organic**: Coleman's product line includes
  organic SKUs marketed as "USDA Certified Organic" per Coleman's own site,
  again not independently confirmed against the DB in this pass.

## 6. Air-chilled vs. water-chilled processing

CONFIRMED (water-chilled), from Perdue's own consumer-facing FAQ content
(search-indexed excerpt of corporate.perduefarms.com FAQ / consumer content,
accessed via search 2026-08-05): "At Perdue's processing plants, defeathered
and eviscerated birds are held in a chilled water bath that lowers their
temperature from 90°F to about 37°F over the course of two hours." The same
source states "Chlorine is not used in any of Perdue's chill water systems,"
though chlorine may be used to sanitize equipment, and Perdue "may apply
USDA-approved organic solutions to raise or lower the pH level of the water."
No mention anywhere of Perdue operating air-chilled lines — Perdue's
processing (at least the lines described in this consumer content) is
**water-chilled** (immersion chilling), not air-chilled. This is Perdue's own
technical/consumer disclosure, not a third-party audit — record basis
accordingly. Draper Valley Farms' own practices page mentions "air-chilled"
in a marketing blurb ("More flavor for you and your family") suggesting
Draper Valley (the subsidiary, not parent Perdue brand) may run an
air-chilled line, but the page did not compare/confirm this against
water-chilling directly — worth a follow-up fetch of
drapervalleyfarms.com/practices/ air-chilling section specifically if Stage 4
needs Draper Valley's own chill method as a separate fact from parent
Perdue's.

## 7. USDA-FSIS enforcement / recalls (new items, 2023–2026 window)

Existing company record already logs "USDA FSIS issued recall notices for
Perdue Foods products in 2022 and 2023 for foreign matter and extraneous
material contamination, affecting sausage products and frozen chicken
nuggets and tenders" — do not duplicate that entry. NEW finding below is
outside that already-logged window:

- **August 16, 2024 recall — metal contamination.** Perdue Foods LLC (Perry,
  GA establishment) recalled approximately **167,171 lbs** of frozen,
  ready-to-eat chicken breast nugget and tender products for possible
  contamination with metal wire, discovered after consumer complaints of
  metal wire embedded in product. Products: PERDUE Simply Smart ORGANICS
  Breaded Chicken Breast Nuggets (22-oz) and PERDUE Chicken Breast Tenders
  (29-oz), produced March 23, 2024, "Best If Used By 03 23 25." No confirmed
  adverse reactions reported. Source: FSIS recall notice
  (fsis.usda.gov/recalls-alerts/perdue-foods-llc-recalls-frozen-ready-eat-chicken-breast-nugget-and-tender-products),
  corroborated by ABC News, Today.com, multiple trade press, accessed via
  search 2026-08-05 (direct FSIS page fetch returned 403; content confirmed
  via search-indexed excerpts and independent news coverage of the same FSIS
  notice).
- No 2025 or 2026 Perdue-specific FSIS recalls were found in this search
  pass — searches for "Perdue FSIS recall 2025" surfaced other companies'
  2025 recalls (e.g., Kayem Foods) but nothing naming Perdue. This is a
  genuine search-came-up-empty result, not a NOT CHECKED — but note FSIS's
  own site could not be directly browsed (403), so this relied on
  third-party indexing of FSIS notices, which could lag.
- For completeness/context (all PRE-2023, do not add to the record without
  checking against what's already logged): a 2022 public health alert for
  plastic/blue dye contamination in gluten-free chicken tenders (Aug 2022,
  no recall issued as product was past shelf availability), and several
  misbranding/undeclared-allergen recalls from 2018–2019 (egg, milk, wheat
  allergens on various chicken products). These are older than the module's
  2023–2026 window and are noted only so Stage 3/4 doesn't re-discover them
  as "new."

## 8. Court records

### Jien v. Perdue Farms, Inc. (D. Md., 1:19-cv-02521) — VERIFIED, NOT the consumer broiler-chicken price-fixing MDL

This is a **poultry-plant-WORKER wage-fixing labor antitrust case**, distinct
from "In re Broiler Chicken Antitrust Litigation" (the consumer/purchaser
price-fixing MDL in N.D. Illinois). Confirmed directly from the CourtListener
docket page (fetched via browser 2026-08-05): "Cause: 15:1 Antitrust
Litigation (Monopolizing Trade)," filed by plaintiffs Judy Jien, Kieo Jibidi,
and Elaisa Clement (poultry-plant workers) against ~50 poultry-industry
defendants including Perdue Farms, Inc. and Perdue Foods LLC, plus two
compensation-survey/consulting firms (Agri Stats, Inc. and Webber, Meng,
Sahl & Co., Inc.) alleged to have facilitated wage-data-sharing among
processors.

- **Perdue-specific settlement: $60.7 million**, preliminarily approved by
  Judge Stephanie A. Gallagher on **April 3, 2023**. Source: Cohen Milstein
  (plaintiffs' counsel) case-study page,
  cohenmilstein.com/case-study/jien-et-al-v-perdue-farms-inc-et-al/, fetched
  2026-08-05; corroborated by meatpoultry.com trade press ("Perdue Farms
  settles wage-fixing claims").
  Note: an earlier search result described the Perdue figure as "$60
  million" (feedstuffs.com/meatpoultry.com secondary coverage) vs. the more
  precise "$60.7 million" on Cohen Milstein's own case page — use $60.7M as
  the more authoritative (plaintiffs'-counsel-sourced) figure but flag the
  minor discrepancy for Stage 3 fact-check.
- **Overall case status: SETTLED across the defendant class.** Final
  approval of **$398.05 million in total settlements** (all defendants
  combined, not just Perdue) granted **June 5, 2025**, with $132 million in
  attorneys' fees awarded. A separate, non-monetary injunctive settlement
  with data-aggregator Agri Stats, Inc. (removing granular plant-level wage
  data from its reports) received final approval **March 10, 2026**. Per
  Cohen Milstein, this is billed as "the largest recovery ever in a U.S.
  antitrust class action for low-wage workers" and "the second-largest
  recovery ever in a U.S. wage-fixing class action."
- Status for schema purposes: **settled** (Perdue's $60.7M piece), not
  pending/alleged — both preliminary and final court approval are
  documented with dates.

### Hemy v. Perdue Farms, Inc. (D.N.J., 3:11-cv-00888) — VERIFIED, consumer-protection/false-advertising re: "Humanely Raised" label

Confirmed directly from the CourtListener docket (fetched via browser
2026-08-05, ~130 entries reviewed through Nov 2011). This was a **New Jersey
Consumer Fraud Act (NJCFA) / common-law fraud / negligent misrepresentation /
breach of express warranty** class action targeting Perdue's use of a
"Humanely Raised" label and a "Raised Cage Free" label on its **Harvestland**
chicken brand specifically (not Perdue's flagship brand, and not the meat-
poultry subsidiaries covered elsewhere in this file).

- Animal Welfare Institute (AWI) attempted to **intervene** in the case
  (Aug 4, 2011 motion) — this motion was **DENIED** by Judge Freda L. Wolfson
  on Nov 30, 2011, the same order that granted Perdue's motion to dismiss in
  part: claims tied to the "Raised Cage Free" label and an unjust-enrichment
  claim were **dismissed WITH PREJUDICE**; the NJCFA, common-law fraud,
  negligent misrepresentation, and breach-of-warranty claims tied to the
  "Humanely Raised" label were dismissed WITHOUT PREJUDICE with leave to
  amend (plaintiffs did amend, case continued into 2012+ with further
  motions).
- **Final resolution**: settled via **label change, not a monetary payment**.
  Perdue Farms Inc. and the Humane Society of the United States (HSUS, which
  had backed related plaintiffs in both the NJ case and a parallel Florida
  case) reached an agreement announced **November 8, 2014** (settlement
  reached mid-October 2014, matching the docket's Oct 23, 2014 termination
  date): Perdue agreed to **remove the "Humanely Raised" claim from
  Harvestland chicken packaging**, in exchange for dismissal of both the NJ
  and FL cases. Perdue's general counsel stated the company "vigorously
  opposed plaintiffs' claims" and maintained its labels were not misleading —
  i.e., this was a settlement with a practice change, not an adjudicated
  finding that the label WAS false. Source: lancasterfarming.com
  ("Perdue Settles Lawsuit Over 'Humanely Raised' Label"), corroborated by
  topclassactions.com and prwatch.org coverage of the same joint press
  release, accessed 2026-08-05.
- Status for schema purposes: **settled** (non-monetary — labeling-practice
  change), scoped specifically to the Harvestland brand's "Humanely Raised"
  and "Raised Cage Free" claims, not a company-wide finding.

### Chaney v. Perdue Farms Inc. (D. Md., 1:24-cv-02975) — NEW FINDING, not in the brief's original two flagged cases, PENDING/ALLEGED

Found while reviewing the raw docket list; this is a **currently active,
unresolved environmental-contamination class action** filed October 11,
2024, not previously flagged in the brief. Full memorandum opinion (Aug 12,
2025 ruling on Perdue's motion to dismiss/stay) obtained directly.

- Five individual plaintiffs (Rachel Chaney, Doug & Julie Davis, Gary &
  Rebecca Doss), all Salisbury, MD/Wicomico County residents relying on
  private wells, sued Perdue Farms Inc. and several Perdue Agribusiness/
  Perdue Foods entities on behalf of a putative class, alleging Perdue's
  **"Agribusiness Facility"** (250+ acres in Salisbury, MD — grain storage,
  feed mill, soybean extraction plant, oilseed refinery, hatcheries) released
  **PFAS ("forever chemicals")**, including PFOS, PFOA, and PFHxS, into
  groundwater via wastewater spray irrigation and direct discharge to a
  stream (Peggy's Branch), for at least 20 years.
- Maryland Dept. of the Environment (MDE) discovered highly elevated PFAS in
  Perdue's wastewater in **September 2023**; Perdue notified its first
  affected resident Sept 30, 2023. January 2024 groundwater testing at the
  facility found **1,370 ppt PFOS and 1,300 ppt PFHxS** — EPA's finalized
  (April 2024) safe drinking-water standards are 4 ppt and 10 ppt
  respectively (i.e., roughly 340x and 130x over the EPA standard for those
  two compounds at that test point). Perdue allegedly knew PFAS had migrated
  to residents' private wells by April 2024 but did not send notification/
  bottled-water-and-testing-offer letters to the surrounding community until
  **October 1, 2024** — about a year after MDE's initial discovery. Plaintiffs
  identify "more than 500 homes with private shallow wells" within roughly
  two miles downgradient of the facility.
- **Court ruling (Aug 12, 2025, Judge Stephanie A. Gallagher, D. Md.)**:
  Perdue's motion to STAY the case pending MDE's investigation was **DENIED**.
  Perdue's motion to DISMISS was **GRANTED IN PART, DENIED IN PART** —
  claims tied to unspecified vague "health effects" and to future
  cancer-risk-only injuries were dismissed WITHOUT PREJUDICE for insufficient
  causation pleading; strict liability/abnormally-dangerous-activity,
  negligence, private nuisance, public nuisance, and trespass claims all
  SURVIVED and the case proceeds to discovery. This is an early-stage
  ruling on the pleadings only — no liability finding, no settlement, case is
  ACTIVE.
- Status for schema purposes: **pending/alleged** (per the language rules —
  claims survived a motion to dismiss, which is not an adjudication of
  fault). Source: court memorandum opinion, Case No. SAG-24-02975, ECF 44,
  filed 2025-08-12 (obtained directly from a copy hosted at
  thenewlede.org/wp-content/uploads/2025/08/judges-opinion-on-defendants-mtd-or-stay-8122025.pdf).
  Flag for whoever handles this: this is environmental contamination, not
  strictly ANIMAL welfare, labor, or product/consumer-protection in the
  narrowest sense — but it's squarely a real, current, well-documented
  Perdue enforcement-adjacent matter the brief's two named cases wouldn't
  have caught. Judgment call for Stage 3/4 on whether it belongs in this
  company's `enforcement[]` array (I think it does — it's exactly the kind
  of "adjudicated/settled/pending" entry the schema anticipates) even though
  it's not specifically a meat-poultry-module welfare claim.

### Owens v. Perdue Farms Inc. (M.D. Ga., 5:20-cv-00307) — checked, low relevance

Personal-injury product-liability case filed Aug 5, 2020 by Hans Owens;
Vincit Group filed a third-party complaint. The court **granted Perdue
Foods LLC's motion to dismiss on April 29, 2021** — Perdue was dismissed
from the case; it continued (if at all) between Owens and Vincit Group only.
No further detail found on the underlying product-liability allegation
itself. Given Perdue was dismissed and no settlement/judgment against Perdue
was found, this does not appear to warrant an `enforcement[]` entry, but
flagging it here in case Stage 3 wants to verify the dismissal grounds.

### Other 14 dockets in the raw pull — not individually researched

Per the brief's instruction to skip noise: Mullis, Howard, Perry, Amisial,
Parker, Smith, Calloway, Davis, Berry, Reyes, Earnest, Delgado, Watts,
Williams (x2) are single-plaintiff employment-discrimination, FLSA wage/hour,
ADA, or personal-injury suits per their `natureOfSuit` field, none naming
welfare/labor-class/consumer-protection issues at the case-name/nature-of-suit
level. Not opened individually.

## 9. Existing company record (src/data/companies.js, `perdue` entry)

Reviewed lines 1729–1768. Existing `issues[]` array already logs:
1. `child-labor-dol` — $4.15M DOL settlement, Jan 15, 2025, Accomac VA
   facility (2020–2023 violations).
2. `product-recalls-2022-2023` — USDA FSIS recalls, foreign matter,
   sausage + nuggets/tenders, 2022–2023.
3. `antibiotic-use` — general antibiotic-scrutiny note, no PVP detail.

None of the findings in sections 1–8 above duplicate these three. The
antibiotic-use issue entry in particular could be sharpened with the PVP
facts in section 4 (Perdue's antibiotic-free claims ARE independently
PVP-audited by USDA AMS, which is stronger than the current entry implies —
that's a Stage 3/4 judgment call, not mine to make here).

Existing record also lists `subsidiaries: ['Perdue', 'Niman Ranch', 'Coleman Natural', 'Panorama Organic', 'Draper Valley Farms']`
— matches the 5 brands this research covered.
