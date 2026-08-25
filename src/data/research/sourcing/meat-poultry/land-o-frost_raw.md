# Land O'Frost — Stage 2 raw research (meat-poultry module)

Company: Land O'Frost, Inc., privately held, family-owned (founded 1958;
described by the company as the largest privately held/family-owned sliced
lunchmeat brand in the US). HQ Lansing/Munster, Illinois area. No SEC
filings, no public 10-K. Research date: 2026-07-30.

Tooling note: same WebFetch 403 pattern on fsis.usda.gov and the AMS PVP PDF
as documented in the other two files in this batch.

**Headline finding for this company: near-total absence of public
sourcing/animal-welfare disclosure**, in contrast to both Boar's Head and
Dietz & Watson, which each maintain a dedicated animal-welfare page with
company-stated (if uncertified) practices. This absence is itself recorded
as a fact below, not an accusation — Land O'Frost may have practices it
simply does not publish, and the record should say "not disclosed," never
imply bad practice from silence (per SKILL.md's absence-is-not-evidence
rule).

---

## 1. GAP (Global Animal Partnership) step level

**NOT a step holder — searched and absent.** Same completed directory fetch
used for the other two companies in this batch:
https://globalanimalpartnership.org/shoppers/, retrieved 2026-07-30. Land
O'Frost does not appear on the G.A.P.-certified retailer/brand partner list
(full list recorded once, in `boars-head_raw.md` Section 1).

- Source: Global Animal Partnership, "Shoppers" partner list,
  https://globalanimalpartnership.org/shoppers/, retrieved 2026-07-30.
- Status: **VERIFIED ABSENT** (genuine completed search).

## 2. Sourcing model

- Fact: Land O'Frost's own "Who We Are" corporate page contains **no
  disclosure** of meat/animal sourcing practices, supplier relationships,
  farm practices, antibiotics policy, nitrate/nitrite policy, or animal
  welfare commitments of any kind. The page's content is limited to company
  history, brand acquisitions (see below), and community
  philanthropy/sponsorship.
  Source: Land O'Frost, "Who We Are," https://www.landofrost.com/who-we-are/,
  fetched directly 2026-07-30. Status: VERIFIED (direct fetch confirms the
  absence of this content on this specific page).
- Fact: The company's public **FAQ page** likewise contains no answers
  regarding meat sourcing, animal welfare, antibiotics, nitrates/nitrites,
  or hormones — its scope is limited to storage/freezing guidance, gluten
  content, nutrition-label questions, retail locations, coupons, and
  employment.
  Source: Land O'Frost, "FAQs," https://www.landofrost.com/faqs/, fetched
  directly 2026-07-30. Status: VERIFIED (direct fetch).
- Fact: The company's **2025 Corporate Social Responsibility report**
  (press coverage, not the full PDF) covers greenhouse-gas emissions
  reduction (5% Scope 1/2 reduction achieved, new 2030 target of an
  additional 3%), **food-safety certification** — "Excellent" ratings from
  **Safe Quality Food (SQF)** across all three manufacturing facilities
  (Lansing, IL; Madisonville, KY; Searcy, AR) — and community/philanthropy
  metrics ($2M+ donated to Breakthrough T1D, youth sports sponsorships).
  **No animal-welfare or meat-sourcing content is described in any press
  coverage of this report found in this research pass.**
  Source: Perishable News, "Land O'Frost Turns Family Values into Forward
  Progress in 2025 Corporate Social Responsibility Report,"
  https://perishablenews.com/deli/land-ofrost-turns-family-values-into-forward-progress-in-2025-corporate-social-responsibility-report/,
  fetched directly 2026-07-30. Status: VERIFIED as to what this press
  coverage describes (direct fetch); **the full CSR report PDF itself was
  not independently opened** (Issuu embed did not yield extractable text in
  this pass) — so this is VERIFIED-SECONDARY (a trade-press account of the
  report, not the report itself) as to what topics it covers, and it
  remains possible the full report contains sourcing/welfare content not
  reflected in press coverage. Flag as NOT FULLY CHECKED for Stage 3: pull
  the actual PDF from issuu.com/landofrost/docs/2025_land_o_frost_corporate_social_responsibility_
  directly if a working fetch path exists.
- Fact: SQF (Safe Quality Food) is a **food-safety** certification (GFSI-
  recognized), not an animal-welfare certification — it certifies
  facility/process food-safety management, not how animals were raised or
  handled. Recording this distinction explicitly so it is not conflated
  with a welfare cert at Stage 4.
  Source: general knowledge of the SQF program structure, cross-checked
  against the same Perishable News article's framing ("Excellent" ratings
  under "Food Safety"), 2026-07-30. Status: VERIFIED (the article itself
  frames it as a food-safety metric, not welfare).
- Fact: Land O'Frost's homepage lists these product lines/brands: **Land
  O'Frost Premium**, **DeliShaved**, **Bistro Favorites**, **Wellshire**,
  **Colameco's Primo Naturale**, **Ambassador**, **DaBecca Foods**,
  **Fairbury Brand**, **Wimmers Meats** — several of these (Wellshire,
  Ambassador, Fairbury, Wimmers, DaBecca) are acquired brands rather than
  organically built Land O'Frost lines, meaning "Land O'Frost" as a
  companyId may cover meaningfully different sourcing practices per brand
  that a single company-wide record cannot capture. The only claim found
  anywhere on the homepage is Bistro Favorites being "100% natural, hand
  seasoned" — no antibiotics/hormone/nitrate claim.
  Source: Land O'Frost homepage, https://www.landofrost.com/, fetched
  directly 2026-07-30. Status: VERIFIED (direct fetch). **Flag for Stage 0/6:
  if any of these acquired sub-brands (esp. Wellshire, which markets itself
  independently as natural/organic-leaning) appear as distinct catalog
  entries, they may need separate sourcing research rather than inheriting
  the parent's near-empty record.**
- Fact: Land O'Frost **acquired Wellshire Farms** (year not confirmed in
  this pass — press release exists but was not fetched for the date).
  Source: Manufacturing.net, "Land O'Frost Purchases Wellshire Farms,"
  found via WebSearch, retrieved 2026-07-30. Status: UNVERIFIED (headline
  only, not fetched for date/detail).

## 3. "No antibiotics ever" / "no nitrates/nitrites added" claims

- **No such claim was found anywhere in this research pass** — not on the
  homepage, not in the FAQ, not in CSR press coverage, and no product-label
  claim surfaced in multiple WebSearch queries targeting this specifically.
  This is a genuinely completed multi-query search, not a single failed
  lookup.
  Status: **UNVERIFIED-ABSENT** — searched across the company's own primary
  pages (direct fetches succeeded) plus WebSearch for product-label
  language; found nothing. Recording as absent-with-caveat because product-
  label claims can exist on individual SKU packaging/retailer listings that
  a homepage-level search would miss — this is weaker confidence than the
  GAP finding above (which was a genuine full-directory search) and should
  be spot-checked against 2-3 actual Land O'Frost product pages/labels at
  Stage 3 before being written as a confirmed absence.
- **USDA Process Verified Program (ams.usda.gov) check:** same 403 as the
  other two files; WebSearch pass found no PVP entry for Land O'Frost.
  Status: **NOT CHECKED — directory blocked by 403, WebSearch pass
  non-exhaustive.**

## 4. Stress/handling practices — certification check

- No animal-welfare certification (Certified Humane, AGW/Animal Welfare
  Approved, GAP) found for Land O'Frost in any search this pass, consistent
  with the company's complete absence of animal-welfare messaging anywhere
  in its own public materials.
  Status: **GAP directory: VERIFIED ABSENT** (full directory fetch
  succeeded, see Section 1). **Certified Humane: NOT CHECKED** (direct
  fetch of certifiedhumane.org/find-certified-products/ returned 404 in
  this session, consistent with the failure noted in the other two files).
  **AGW: NOT CHECKED** cleanly for this specific company — treat as NOT
  CHECKED per SKILL.md rather than inferring ABSENT from the general
  pattern of no welfare messaging.

## 5. Recalls and food-safety enforcement (USDA-FSIS)

- Fact: **August 2015** — Land O'Frost, Inc. (Lansing, IL establishment)
  recalled approximately **17 pounds** of "Ambassador Beef Summer Sausage"
  due to misbranding: the product contained **pork that was not declared**
  on the label. Product was produced July 25, 2015.
  Source: WebSearch aggregation of FSIS recall records (Perishable News,
  Food Poisoning Bulletin), retrieved 2026-07-30. Status: UNVERIFIED
  (secondary aggregation; original FSIS notice URL not independently
  fetched in this pass — direct FSIS fetch 403'd).
- Fact: **June 2018** — Land O'Frost, Inc. (Madisonville, KY establishment)
  recalled approximately **4,944 pounds** of "Premium Black Forest Ham"
  product due to misbranding: front-of-package correctly said "Black Forest
  Ham" but the back panel was incorrectly labeled "Honey Smoked Turkey
  Breast" — a mislabeling/allergen-adjacent risk (undeclared true product
  identity), not a contamination event. Product produced April 27, 2018;
  shipped to AZ, CA, OR, TX, WA. No confirmed adverse reactions reported.
  Source: USDA-FSIS recall notice, "Land O'Frost Recalls Sausage Product
  Due to Misbranding," https://www.fsis.usda.gov/recalls-alerts/land-ofrost-recalls-sausage-product-due-misbranding
  (title says "sausage" but WebSearch content describes ham — likely two
  separate recall notices conflated in aggregation; **flag for Stage 3 to
  disambiguate the exact FSIS notice title/number**), retrieved via
  WebSearch summary 2026-07-30 (direct WebFetch of fsis.usda.gov 403'd).
  Status: UNVERIFIED (secondary aggregation of an FSIS notice; pounds/date/
  ship-state detail consistent across multiple independent outlets so
  reasonably reliable, but not independently confirmed against the primary
  FSIS page itself).
- Fact: **No listeria, salmonella, or other pathogen-contamination recall**
  was found for Land O'Frost in this research pass — both recalls located
  were misbranding/mislabeling events, not contamination events.
  Status: UNVERIFIED-ABSENT (genuinely searched via multiple WebSearch query
  variations targeting "listeria," "recall," "USDA FSIS" combined with the
  company name; FSIS's own database was not directly queried due to the 403
  issue, so this is not as strong as a direct database confirmation).

## 6. OSHA — plant safety

Two distinct, well-documented OSHA cases found via direct fetch of OSHA's
own inspection-detail pages:

- Fact: **Lansing, IL plant** (16850 Chicago Avenue) — inspection opened
  **July 1, 2020**, following a **June 29, 2020** workplace injury: a
  maintenance technician's hand was "crushed" in a Multi-Vac machine after
  he bypassed safety guards to perform maintenance without proper
  lockout/tagout procedure; the machine cycled unexpectedly, causing a
  fracture and severe laceration requiring hospitalization. Resulted in
  **one Serious citation** under **29 CFR 1910.147(d)** (lockout/tagout),
  issued October 19, 2020. Initial penalty **$74,218**, reduced to
  **$13,494** via formal settlement October 30, 2020. Case closed November
  24, 2021.
  Source: OSHA establishment inspection detail page,
  https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1481556.015,
  fetched directly 2026-07-30. Status: VERIFIED (direct fetch of OSHA's own
  record).
- Fact: **Chicago, IL plant** (700 E. 107th Street) — inspection opened
  **January 17, 2024**, a "Referral" with complete scope, focused on
  amputation hazards and food-manufacturing safety standards. Resulted in
  **six total citations** initially (4 Serious + other categories),
  ultimately **3 citations deleted** via formal settlement (May 31, 2024),
  leaving citations under standards **29 CFR 1910.212** (machine guarding),
  **1910.147** (lockout/tagout), **1910.219** (mechanical power-transmission
  guarding), and **1904.0040** (recordkeeping). Initial total penalty
  **$66,828**, reduced to **$44,262** after settlement. Case closed **June
  27, 2025**.
  Source: OSHA establishment inspection detail page,
  https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1721385.015,
  fetched directly 2026-07-30. Status: VERIFIED (direct fetch of OSHA's own
  record).
- Note: this "700 E. 107th Street, Chicago, IL" address does not obviously
  match the three plants named in the CSR report (Lansing IL, Madisonville
  KY, Searcy AR) — possibly a fourth site, a warehouse/distribution
  facility, or an older/since-closed location. **Flag for Stage 3** to
  reconcile plant-location scope before writing a `model` field.

## 7. Litigation

- **No lawsuit (class action, consumer-protection, or otherwise) against
  Land O'Frost specifically was found** in this research pass, across
  several distinct WebSearch query phrasings (general "lawsuit," "class
  action," combined with "listeria," "nitrate," "mislabel"). This is a
  genuinely completed multi-query search.
  Status: **UNVERIFIED-ABSENT** — CourtListener itself was not directly
  queried (403 on WebFetch per SKILL.md's documented limitation, and this
  pass relied on WebSearch's general web coverage rather than a
  docket-search tool); a state-court consumer-protection suit could exist
  and simply not surface in general web search the way it wouldn't have for
  the DC Superior Court case SKILL.md flags as a known past miss. Treat this
  absence as lower-confidence than the OSHA/GAP findings above.

## Summary of gaps for Stage 3 (fact-check) to prioritize

1. This is the thinnest-disclosure company of the three — confirm the
   "no antibiotics" and "no welfare certification" absences aren't simply
   this research pass missing a page; spot-check 2-3 actual product
   labels/retailer listings directly.
2. Reconcile the "700 E. 107th Street, Chicago" OSHA plant address against
   the three plants (Lansing, Madisonville, Searcy) named in CSR coverage.
3. Pull the full 2025 CSR report PDF directly (Issuu didn't yield text in
   this pass) in case it contains sourcing/welfare content not reflected in
   press coverage.
4. Disambiguate the exact FSIS notice for the 2018 misbranding recall — the
   URL title says "sausage," the content summary describes ham; likely two
   separate notices were conflated by WebSearch aggregation.
5. Certified Humane / AGW: NOT CHECKED cleanly, same as the other two
   companies in this batch — re-run before Stage 4.
6. Determine whether acquired sub-brands (Wellshire Farms especially) need
   independent sourcing research rather than inheriting this near-empty
   parent record, if any appear as separate catalog entries.
