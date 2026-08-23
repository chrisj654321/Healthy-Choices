# Confirm-Zero Pass — Batch 2

Researcher pass, /political-analysis pipeline. Checks small private companies for federal lobbying, PAC donations, and real regulatory/legal issues. "None found" is a valid result and is recorded as such, not as "confirmed zero," unless a primary database (lda.gov / FEC) directly returned a zero-count result.

**ESCALATE:** Litehouse, Inc. — FDA Warning Letter (Nov 29, 2023) tied to a 2023 allergen-mislabeling recall. This is a formal FDA enforcement action, not an allegation. Recommend a reviewer look at whether this belongs on the company's issues record.

All other companies in this batch: clean, no federal political footprint, no material regulatory/legal issues found.

---

## 1. litehouse — Litehouse, Inc.

**Lobbying:** None found. LDA.gov REST API direct query (`client_name=litehouse`) returned `"count": 0, "results": []` on 2026-08-23. Primary-database confirmed zero. (Source: lda.gov/api/v1/filings/?client_name=litehouse, checked 2026-08-23)

**Donations:** No PAC found. FEC.gov committee search for "Litehouse" returned no matching committee name (Source: fec.gov/data/committees/?q=Litehouse, checked 2026-08-23). Note: FEC.gov's committee browse page is client-rendered and the query filter could not be independently verified as applied server-side, so this is recorded as "no PAC found," not a confirmed database zero.

**Issues:**
- FDA allergy alert / recall, Feb 15, 2021: Litehouse recalled 225 boxes of Brite Harbor Dressing & Dip pillow-packets — packets labeled "Caesar" on front but "Blue Cheese" on back (mislabeling), creating an undeclared-anchovy risk. No adverse reactions reported. (Source: FDA, fda.gov/safety/recalls-market-withdrawals-safety-alerts/litehouse-inc-issues-allergy-alert-undeclared-anchovies-product)
- Recall, April 19, 2023: Litehouse recalled Simple Truth brand Plant Based Ranch Dressing after consumer complaints — containers were filled with Caesar Dressing (mislabeled work-in-progress bulk containers), creating an undeclared-soy-allergen risk.
- **FDA Warning Letter, Nov 29, 2023** (MARCS-CMS 662949): issued to Litehouse, Inc. concerning the April 2023 misbranding/undeclared-allergen incident above. A warning letter is a formal FDA enforcement action — adjudicated by FDA, not merely alleged. (Source: fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/litehouse-inc-662949-11292023)
- No Listeria recall found for Litehouse specifically (checked per brief's dairy/refrigerated flag — a February 2024 Listeria dairy recall found in the same search belongs to a different company, Rizo Lopez Foods, Inc., not Litehouse).

---

## 2. suja-life — Suja Life, LLC

**Lobbying:** None found. LDA.gov REST API direct query (`client_name=suja`) returned `"count": 0, "results": []` on 2026-08-23. Primary-database confirmed zero. Also checked parent/majority owner Paine Schwartz Partners by name — no lobbying-specific hits in general web search. (Source: lda.gov/api/v1/filings/?client_name=suja, checked 2026-08-23)

**Donations:** No PAC found. FEC.gov committee search for "Suja" returned no matching committee name (same client-rendering caveat as above). (Source: fec.gov/data/committees/?q=Suja, checked 2026-08-23)

**Issues:**
- Class-action lawsuit (California): plaintiff alleges Suja Classic and Suja Fresh Start juices are falsely marketed as "raw" when processing leaves them in a nutritional state similar to pasteurized juice. Allegation, not adjudicated as of the sources found. (Source: topclassactions.com, "Suja 'Raw' Juice Class Action Lawsuit Alleges False Advertising")
- California Proposition 65 60-day notice of violation naming Suja Life LLC, Costco, and Walmart. A Prop 65 notice is a pre-suit allegation, not an adjudicated finding. (Source: oag.ca.gov/system/files/prop65/notices/2018-00256.pdf)
- Recall, May 2019: Suja Organic Kombucha recalled for possible foreign-material contamination (voluntary, FDA-aware). (Source: dla.mil ALFOODACT 2019-024)

---

## 3. hometown-food-company — Hometown Food Company

**Lobbying:** None found. LDA.gov REST API direct query (`client_name=hometown+food`) returned `"count": 0, "results": []` on 2026-08-23. Primary-database confirmed zero. (Source: lda.gov/api/v1/filings/?client_name=hometown+food, checked 2026-08-23)

**Donations:** No PAC found. FEC.gov committee search for "Hometown Food" returned no matching committee name (same client-rendering caveat). (Source: fec.gov/data/committees/?q=Hometown+Food, checked 2026-08-23)

**Issues:**
- Recall, March 11, 2019: Hometown Food Co. recalled ~12,185 cases (roughly 100,000 5-lb bags) of Pillsbury Unbleached All-Purpose Flour (lot codes 8292/8293) for possible Salmonella contamination. No illnesses reported in connection with this specific recall. (Source: Food Safety News, foodsafetynews.com/2019/03; FDA recall notice)
- Separate recall, June 2019: Hometown Food Co. recalled additional Pillsbury flour sourced from ADM amid a broader multistate E. coli O26 outbreak investigation tied to flour. Several product-liability lawsuits followed the outbreak (per Schmidt Law and Ron Simon & Associates law-firm pages), but no adjudicated outcome was found in the sources reviewed. (Source: Food Safety News, foodsafetynews.com/2019/06)
- Both recalls were voluntary, FDA-cooperative actions; no FDA warning letter found against Hometown Food Company.

---

## 4. kent-precision-foods — Kent Precision Foods Group, Inc.

**Lobbying:** None found. LDA.gov REST API direct query (`client_name=kent+precision`) returned `"count": 0, "results": []` on 2026-08-23. Primary-database confirmed zero. (Source: lda.gov/api/v1/filings/?client_name=kent+precision, checked 2026-08-23)

**Donations:** No PAC found. FEC.gov committee search for "Kent Precision" returned no matching committee name (same client-rendering caveat). (Source: fec.gov/data/committees/?q=Kent+Precision, checked 2026-08-23)

**Issues:**
- OSHA inspection #896566.015, Columbus, OH facility (683 Manor Park Dr.), opened 03/19/2013, closed 07/01/2013: 5 violations found (2 serious, 2 repeat, 1 other). Initial penalty $19,500, reduced to $9,750 via informal settlement. This is an adjudicated/settled OSHA citation, over a decade old. (Source: osha.gov/ords/imis/establishment.inspection_detail?id=896566.015)
- No FDA recalls, warning letters, or lawsuits found for Kent Precision Foods Group in the sources reviewed.

---

## 5. beyond-better-foods — Beyond Better Foods, LLC

**Lobbying:** None found. LDA.gov REST API direct query (`client_name=beyond+better+foods`) returned `"count": 0, "results": []` on 2026-08-23. Primary-database confirmed zero. (Source: lda.gov/api/v1/filings/?client_name=beyond+better+foods, checked 2026-08-23)

**Donations:** No PAC found. FEC.gov committee search for "Beyond Better Foods" returned no matching committee name (same client-rendering caveat). (Source: fec.gov/data/committees/?q=Beyond+Better+Foods, checked 2026-08-23)

**Issues:**
- Class-action lawsuit, filed January 2019: alleges Enlightened brand ice cream is mislabeled as "ice cream" because it substitutes vegetable-derived fat for milk fat, and mislabels erythritol as a "Natural Sweetener." Allegation, not adjudicated as of the sources found. (Source: classaction.org, "Beyond Better Foods' Enlightened Product is Mislabeled as Ice Cream, Class Action Claims"; Bloomberg Law)
- Recall/allergy alert: Beyond Better Foods recalled select cases of Enlightened Peanut Butter Chocolate Chip ice cream after packaging mix-up caused undeclared-peanut risk (product packaged in Mint Chocolate Chip containers). (Source: MANNA FoodBank / FDA recall notice)
- Recall/allergy alert, reported via PR Newswire (~2020): Beyond Better Foods recalled select Chocolate Peanut Butter ice cream pints after a packaging mix-up caused undeclared-milk risk (product packaged in Dairy-Free Chocolate Peanut Butter containers). (Source: prnewswire.com/news-releases/beyond-better-foods-llc-issues-allergy-alert-on-undeclared-milk-in-mislabeled-chocolate-peanut-butter-pints-301083367.html)
- No FDA warning letter found for Beyond Better Foods in the sources reviewed.

---

## 6. tropical-cheese — Tropical Cheese Industries, Inc.

**Lobbying:** None found. LDA.gov REST API direct query (`client_name=tropical+cheese`) returned `"count": 0, "results": []` on 2026-08-23. Primary-database confirmed zero. (Source: lda.gov/api/v1/filings/?client_name=tropical+cheese, checked 2026-08-23)

**Donations:** No PAC found. FEC.gov committee search for "Tropical Cheese" returned no matching committee name (same client-rendering caveat). (Source: fec.gov/data/committees/?q=Tropical+Cheese, checked 2026-08-23)

**Issues:**
- No FDA recalls, warning letters, OSHA citations, or lawsuits found for Tropical Cheese Industries in the sources reviewed, including a specific check for Listeria recalls (per brief's dairy/refrigerated flag). General web search and FDA recall search returned no matches for this company by name. Absence recorded as "none found," not "confirmed zero," since no single primary database (e.g. FDA's recall search, PACER) was queried directly for this company. (Sources checked 2026-08-23: general web search, fda.gov recall listings)

---

### Method notes
- LDA.gov results are true primary-database zero-count confirmations (direct REST API query, JSON `count: 0`).
- FEC.gov results are recorded as "no PAC found" rather than confirmed zero: fec.gov's committee browse UI renders client-side, so a fetched page could not be verified to reflect the applied search filter rather than a default/unfiltered listing. The OpenFEC public API (api.open.fec.gov) was attempted with the public DEMO_KEY but returned HTTP 429 (rate-limited, ~12.5 hour retry window) for all six queries.
- No company in this batch has a company PAC or federal lobbying registration.
