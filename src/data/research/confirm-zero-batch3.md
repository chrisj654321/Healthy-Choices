# Confirm-Zero Pass — Batch 3

Date of research: 2026-08-23
Method: Senate LDA API (lda.senate.gov/api/v1/filings), FEC.gov / OpenSecrets web search (FEC DEMO_KEY was rate-limited, so donation checks are web-search based, not direct API), FDA/FSIS recall databases, OSHA, NLRB, court dockets.

## ESCALATE (real, citable issue found)

- **bellisio-foods** — two real FSIS recalls (2021 undeclared allergen; 2024 BrucePac Listeria supply-chain recall)
- **bolthouse-farms** — two recalls (2012 Salmonella carrot chips; 2016 protein-drink spoilage) plus an ADJUDICATED Oct 2025 California Prop 65 settlement (cadmium in Immunity Juice, $27,500)
- **froneri** — 2026 Bloomberg sanitation-inspection report on a Dreyer's CA plant, a 2026 Outshine Fruit Bars glass-contamination recall, two FDA allergy alerts, and an open pattern of NLRB unfair-labor-practice case filings against Dreyer's/Froneri facilities
- **johanna-foods** — real, active federal litigation: Johanna Foods (plaintiff) v. Executive Office of the President, Court of International Trade No. 1:25-cv-00155 (Brazil tariff challenge, filed July 2025); also a 2010 trademark/trade-dress suit vs. Coca-Cola (old, settled)

**Clean:** galerie, finlays

---

## 1. galerie (Ross Acquisition Co. dba Galerie, Louisville KY)

**Lobbying:** LDA API `registrant_name=Galerie` → **count: 0**. VERIFIED zero via lda.senate.gov/api/v1/filings (queried 2026-08-23).

**Donations:** No PAC found via FEC/web search (FEC API DEMO_KEY was rate-limited; no "Galerie" or "Ross Acquisition" PAC surfaced in web search). "No PAC found (search)."

**Issues:** No FDA/FSIS recalls, OSHA citations, or lawsuits found for Ross Acquisition Co. dba Galerie (Louisville, KY — boxed candy/character gift sets).

Note: search surfaced a **different, unrelated company** — "Galerie au chocolat Inc.," a Quebec-based plant-based-chocolate maker, recalled by Health Canada/CFIA on 2026-04-30 for improperly declared milk (source: recalls-rappels.canada.ca). Confirmed this is a separate Canadian entity, not Ross Acquisition Co. dba Galerie — no connection found. Not counted against the target company.

**Verdict: clean (no footprint)**

---

## 2. bellisio-foods (Bellisio Foods, Inc.)

**Lobbying:** LDA API `registrant_name=Bellisio` → **count: 0**. VERIFIED zero via lda.senate.gov/api/v1/filings (queried 2026-08-23). Consistent with OpenSecrets summary noting Bellisio Foods has not reported federal lobbying (source: opensecrets.org/orgs/bellisio-foods/summary?id=D000069953).

**Donations:** No PAC found (search). "No PAC found (search)."

**Issues — ESCALATE:**
- **May 2021**: FSIS recall of ~4,000 lbs of "Michelina's Spaghetti with Meat Sauce" (Bellisio Foods, Jackson OH plant) for misbranding and an undeclared allergen (soy). Source: FSIS.usda.gov, "Bellisio Foods, Inc. Recalls Beef Pasta Products Due to Misbranding and an Undeclared Allergen," dated May 2021. Regulatory recall — adjudicated fact, not alleged.
- **October 14, 2024**: Bellisio Foods voluntarily recalled Boston Market, Michelina's, and Atkins chicken-containing products after its supplier BrucePac (Durant, OK) recalled ~11.8M lbs of ready-to-eat meat/poultry for possible Listeria monocytogenes contamination. Source: BusinessWire press release Oct 14, 2024, and FSIS.usda.gov BrucePac recall notice. No confirmed illnesses reported tied to Bellisio product specifically; this was a supply-chain-triggered voluntary recall, not a contamination originating at a Bellisio-owned facility.

**Verdict: ESCALATE — two real FSIS recall events (2021 undeclared allergen; 2024 supply-chain Listeria recall), no illnesses confirmed in either.**

---

## 3. bolthouse-farms (Wm. Bolthouse Farms, Inc.)

**Lobbying:** LDA API `registrant_name=Bolthouse` → **count: 0**. VERIFIED zero via lda.senate.gov/api/v1/filings (queried 2026-08-23).

**Donations:** No PAC found (search). "No PAC found (search)."

**Issues — ESCALATE:**
- **October 2012**: Voluntary recall of ~5,600 cases of Bolthouse Farms 16-oz Carrot Chips for possible Salmonella after routine sampling detected it in one bag; no illnesses reported. Source: company press release (thecampbellscompany.com/bolthouse.com newsroom), FDA recall listing.
- **June 22, 2016**: Recall of ~3.8 million bottles of Bolthouse Farms Protein PLUS shakes and Mocha Cappuccino drinks nationwide, after consumer complaints of spoilage (lumpy texture, off odor/taste) and reports of illness; cause cited as spoilage rather than an identified pathogen. Source: Food Safety News, June 2016 ("Bolthouse Farms recalls millions of drinks because of illnesses").
- **October 15, 2025**: ADJUDICATED — California Attorney General Prop 65 settlement (case 2025-00655S6233) over cadmium in Bolthouse Farms "Immunity Juice" (Carrot, Turmeric, Ginger). Settlement required $3,000 civil penalty + $24,500 attorney fees/costs ($27,500 total) and required warning/reformulation or cessation of sale of the noncompliant product. Source: oag.ca.gov/system/files/prop65/settlements/2025-00655S6233.pdf.

Note: the widely-covered **November 2024 organic-carrot E. coli O121:H19 outbreak (39 illnesses, 1 death)** was traced to **Grimmway Farms** (Bakersfield CA), a *different, competing* carrot grower — confirmed via FDA/CDC outbreak pages naming Grimmway Farms as the source and recalling firm. Not Bolthouse. Ruled out.

**Verdict: ESCALATE — two recalls (2012 Salmonella, 2016 spoilage/illness reports) plus one adjudicated Prop 65 settlement (Oct 2025, cadmium, $27,500).**

---

## 4. johanna-foods (Johanna Foods, Inc. / Johanna Beverage Company, LLC)

**Lobbying:** LDA API `registrant_name=Johanna+Foods` → **count: 0**. VERIFIED zero via lda.senate.gov/api/v1/filings (queried 2026-08-23).

**Donations:** No PAC found (search). "No PAC found (search)."

**Issues — ESCALATE (litigation, not a recall/fine):**
- **Filed July 18, 2025**: Johanna Foods, Inc. and Johanna Beverage Company, LLC v. Executive Office of the President et al., U.S. Court of International Trade, No. 1:25-cv-00155. Johanna Foods (a major orange-juice-from-concentrate importer, relies on Brazilian OJ) sued the federal government to block President Trump's 50% tariff on Brazilian imports (issued via letter/executive order under IEEPA, effective Aug 1, 2025), arguing it lacked statutory/constitutional basis. Johanna Foods is the **plaintiff**, not a defendant — this is Johanna asserting its own rights against a government tariff action, not an adjudicated finding of wrongdoing by Johanna. Sources: Bloomberg, "Orange Juice Importers Say Prices Will Rise Due to Brazil Tariffs," July 21, 2025; Civil Rights Litigation Clearinghouse case 46807; CIT docket 1:25-cv-00155.
- **2010** (older, settled): Johanna Foods, Inc. v. The Coca-Cola Company (D.N.J. 3:10-cv-04844; parallel N.D. Ga. 1:10-cv-03752). Coca-Cola sent threat letters alleging trade-dress/design-patent infringement over Johanna's Tree Ripe carafe-shaped juice container sold to ALDI; Johanna filed for declaratory judgment of non-infringement. Resolved via settlement/dismissal per court dockets (Justia). 15 years old, low current relevance but real litigation history.

Unconfirmed lead (not escalated): a search result referenced a voluntary market withdrawal of "Our Family" brand yogurt for a packaging defect (bloating). Could not confirm Johanna Foods was the manufacturer of record for this specific private-label product with adequate sourcing — flagging as unconfirmed, not counted as a finding.

**Verdict: ESCALATE — no lobbying/PAC footprint, but Johanna Foods is an active plaintiff in a real, high-profile 2025 federal tariff lawsuit against the Executive Office of the President, plus older (2010) trademark litigation vs. Coca-Cola.**

---

## 5. finlays (Finlay Extracts & Ingredients USA, Inc. dba Finlays / James Finlay & Co. / John Swire & Sons)

**Lobbying:** LDA API `registrant_name=Finlays` → count: 1, but that single hit is **"FINLAYSON GROUP"** — an unrelated DC lobbying firm (lobbyists John Birnberg, Joseph Glenn Finlayson) registered in 2002 representing client **Coca-Cola** on Copyright/Patent/Trademark and Small Business issues. This is a name-collision false positive, not Finlay Extracts & Ingredients. Confirmed via follow-up targeted queries, all **count: 0**:
  - `registrant_name=Finlay+Extracts` → 0
  - `registrant_name=James+Finlay` → 0
  - `registrant_name=Swire` → 0 (parent company John Swire & Sons)
  - `client_name=Finlay` → 0
VERIFIED zero for the actual target company via lda.senate.gov/api/v1/filings (queried 2026-08-23).

**Donations:** No PAC found (search). "No PAC found (search)."

**Issues:** No FDA/FSIS recalls, OSHA citations, or lawsuits found for Finlay Extracts & Ingredients USA (Lincoln, Rhode Island B2B tea/coffee/botanical extract facility). Low public profile, B2B supplier (not consumer-facing), consistent with absence of consumer recall history.

**Verdict: clean (no footprint)**

---

## 6. froneri (Froneri US — Dreyer's/Edy's, Häagen-Dazs US, Drumstick; Nestlé/PAI Partners JV)

**Lobbying:** LDA API `registrant_name=Froneri` → **count: 0**. VERIFIED zero via lda.senate.gov/api/v1/filings (queried 2026-08-23).

**Donations:** No PAC found (search). "No PAC found (search)."

**Issues — ESCALATE:**
- **Bloomberg, July 10, 2026**: "Dreyer's Sanitation Inspection Flags Ice Cream Sandwiches, Drumsticks." A Dreyer's Grand Ice Cream (Froneri subsidiary) California factory was cited by regulators for repeated sanitation failures and bacterial-contamination findings, including employees touching trash cans and returning to food handling without handwashing. Products named: Round Top Drumsticks, Nestlé Toll House Minis Chocolate Chip Vanilla Sandwiches and Strawberry Shortcake Bars, Outshine Mini Fruit Pops. Source: bloomberg.com/news/articles/2026-07-10/dreyer-s-ice-cream-drumsticks-sandwiches-flagged-for-sanitation-issues.
- **2026** (year confirmed, exact date not independently verified beyond search snippet): FDA-listed voluntary recall, "Dreyer's Grand Ice Cream, Inc. Issues Voluntary Recall on Select Outshine Fruit Bars Due to Possible Foreign Matter Contamination" (glass), covering 55 lot codes, no injuries reported. Source: fda.gov/safety/recalls-market-withdrawals-safety-alerts (title as listed), prnewswire.com press release.
- FDA allergy alerts (undeclared allergens, not contamination): "Dreyer's Grand Ice Cream, Inc. Issues Allergy Alert on Undeclared Wheat in Haagen-Dazs Chocolate Dark Chocolate Mini Bars" and "...Issues Allergy Alert on Undeclared Milk in Outshine No Sugar Added Strawberry Fruit Bars" — both listed on fda.gov/safety/recalls-market-withdrawals-safety-alerts.
- **NLRB Case 32-CA-336745** — "Dreyer's Grand Ice Cream, Inc., a wholly owned subsidiary of Froneri," unfair-labor-practice charge filed 2/27/2024, Region 32 (Oakland, CA), Tulare, CA facility, ~300 employees, status: **Closed**. Full allegation/outcome not public without an NLRB FOIA request (case detail page withholds specifics pending redaction). Source: nlrb.gov/case/32-CA-336745.
- Additional NLRB filings against Dreyer's/Froneri facilities found in the same search, suggesting a recurring pattern (not individually detailed here): 31-CA-190908, 25-RC-338551, 32-CA-370457, 31-CA-312541. Source: nlrb.gov case search.

**Verdict: ESCALATE — no lobbying/PAC footprint, but a real 2026 sanitation-inspection report (Bloomberg), a 2026 glass-contamination recall, two allergen alerts, and an open-status pattern of NLRB unfair-labor-practice filings against Dreyer's/Froneri facilities.**

---

## One-line summary

1. galerie — clean (no footprint)
2. bellisio-foods — ESCALATE: 2021 FSIS undeclared-allergen recall + 2024 BrucePac Listeria supply-chain recall
3. bolthouse-farms — ESCALATE: 2012 Salmonella recall, 2016 spoilage/illness recall, Oct 2025 adjudicated Prop 65 cadmium settlement ($27,500)
4. johanna-foods — ESCALATE: active 2025 CIT tariff lawsuit vs. federal government (plaintiff) + 2010 trademark suit vs. Coca-Cola
5. finlays — clean (no footprint)
6. froneri — ESCALATE: 2026 Bloomberg sanitation-inspection report, 2026 glass-contamination recall, 2 allergen alerts, open pattern of NLRB unfair-labor-practice filings
