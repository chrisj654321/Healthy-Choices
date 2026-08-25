# Land O'Frost — Stage 3 fact-check (meat-poultry module)

Auditor: separate Sonnet instance from the Stage 2 researcher (this is a retry
of a prior Stage 3 run on this company that stalled before writing a file).
Method: independent WebFetch/WebSearch passes against the raw file's claims —
not a re-read of the researcher's reasoning. Fact-check date: 2026-07-30.
Direct WebFetch of fsis.usda.gov continues to 403 this session too (same
tooling limitation the researcher and the Boar's Head/Dietz & Watson
fact-checkers hit) — all recall upgrades below come from cross-referencing
multiple independent secondary outlets, not a working primary FSIS fetch.
OSHA's own site, by contrast, fetched cleanly both times.

---

## 1. GAP (Global Animal Partnership) step level — UPHELD for parent, but MATERIAL NEW FINDING for a sub-brand

**Land O'Frost (parent) — UPHELD, VERIFIED ABSENT.** Independently
re-fetched https://globalanimalpartnership.org/shoppers/ this pass. Neither
"Land O'Frost" nor "Ambassador" appears anywhere on the current partner
list. Confirms the raw file's finding.

**Wellshire Farms — NEW FINDING, not in the raw file's Section 1: Wellshire
Farms DOES appear as its own G.A.P. partner**, independently of the parent
company. Confirmed on two separate G.A.P.-owned pages:
- https://globalanimalpartnership.org/shoppers/ lists "Wellshire Farms" by
  name among direct/partner brands.
- https://globalanimalpartnership.org/partners/manufacturers/ lists
  Wellshire Farms as a Manufacturing & Processors partner, scope "Chicken,
  Beef, Pork." No single numeric step level is published on this listing
  page (G.A.P. step levels are typically assigned per-farm/per-label, not as
  one company-wide number) — record the partnership as verified, the exact
  step number as not found in this pass.
- A G.A.P.-published profile page on Wellshire's president (Lou Colameco)
  exists per WebSearch snippet but 404's on direct fetch
  (globalanimalpartnership.org/about/news/post/lou-colmeco-of-wellshire-farms/)
  — treat that specific article as NOT CHECKED, not needed since the two
  partner-listing pages above independently confirm the partnership.

Status: Land O'Frost (parent) VERIFIED ABSENT (unchanged). **Wellshire Farms
VERIFIED PRESENT as a G.A.P. manufacturer/processor partner — this is a
genuine third-party certification-adjacent finding the raw file's parent-only
search missed by design (raw file explicitly recorded this as a gap to
check).** If Wellshire Farms appears as its own catalog entry or companyId,
Stage 4 should NOT inherit Land O'Frost's "no certification" status for it.

## 2. Sourcing model — UPHELD, and sub-brand pages now checked directly

- Land O'Frost "Who We Are" page and FAQ page: **independently re-fetched
  both**, same URLs as the raw file. Confirmed identical result — no
  animal-welfare, sourcing, antibiotics, hormone, or nitrate/nitrite content
  on either page. UPHELD, VERIFIED (direct fetch).
- CSR report (Section 2 press-coverage claim) — not independently re-fetched
  this pass (Issuu embed problem is a known tooling limitation, not worth a
  second attempt without a different access path); the raw file's own
  VERIFIED-SECONDARY flag and "NOT FULLY CHECKED" caveat for the full PDF
  stand. UPHELD, unchanged status.
- SQF food-safety vs. welfare-certification distinction — UPHELD, correct
  and worth keeping explicit at Stage 4.
- **Wellshire Farms sub-brand site (eatwellshire.com, redirected from
  wellshirefarms.com) — independently fetched. This is the sub-brand check
  the raw file flagged as needed, and it changes the record materially:**
  Wellshire has its own "About Wellshire" / "Our Standards" section stating
  animals are "vegetarian fed and never administered any animal
  by-products," products are "Raised without Antibiotics, with No Added
  Hormones," and sourced from "family-owned facilities and farmers." **These
  are company-disclosure claims, not third-party certified** — no
  certification mark (USDA Organic, AGW, Certified Humane, GAP step number)
  appears on the site itself. Per the pipeline's praise rail, these claims
  stay `basis: company-disclosure` and are NOT elevated to verified-good
  status on their own — but combined with the independently-confirmed G.A.P.
  manufacturer partnership above (Section 1), Wellshire Farms has
  meaningfully more welfare signal than the Land O'Frost parent record and
  should get its own `sourcing` entry if it's a separate catalog item, not
  inherit the parent's near-blank one.
- **Ambassador sub-brand — independently checked, confirms the raw file's
  gap concern in the negative direction: no independent disclosure found.**
  Ambassador's current retail presence is a product catalog page under
  Wimmer's Meats (wimmersmeats.com/brands/ambassador/products) with no
  sourcing/welfare/antibiotics content and no certifications listed anywhere
  on the page. Ambassador does not have its own welfare page the way
  Wellshire does. Status: VERIFIED ABSENT for this specific page (direct
  fetch); treat Ambassador as inheriting the parent's "not disclosed" status
  unless a further page turns up.
- Wellshire Farms acquisition date — still UNVERIFIED, not re-checked this
  pass (low priority, doesn't affect any welfare/safety claim).

## 3. "No antibiotics ever" / "no nitrates/nitrites added" claims — UPHELD for parent; PARTIALLY RESOLVED for Wellshire

- For the **Land O'Frost-branded** product lines specifically (Premium,
  DeliShaved, Bistro Favorites): not independently re-checked at the
  product-label level this pass (would require fetching individual SKU
  pages, out of scope for this retry) — raw file's UNVERIFIED-ABSENT status
  and its own recommendation to spot-check 2-3 product labels stands as an
  open to-do, carried forward unchanged.
- For **Wellshire**: now resolved by the direct site fetch in Section 2
  above — Wellshire's own site DOES make a "Raised without Antibiotics, with
  No Added Hormones" claim, company-disclosure basis. This is a new fact not
  in the raw file (which only checked the Land O'Frost parent site, where no
  such claim exists). Sub-brand claims must not be merged into a
  company-wide "no claim found" statement.
- USDA PVP check — UPHELD, still NOT CHECKED (403 persists, WebSearch
  pass non-exhaustive, consistent with the other two companies in this
  batch).

## 4. Stress/handling practices — certification check — UPDATED

- GAP: see Section 1 — parent VERIFIED ABSENT, Wellshire Farms VERIFIED
  PRESENT (material update from raw file).
- **Certified Humane — RESOLVED this pass, upgraded from NOT CHECKED.** The
  raw file's attempted URL (certifiedhumane.org/find-certified-products/)
  404's — confirmed, still broken. But the correct current URL,
  **certifiedhumane.org/whos-certified/**, fetched successfully this pass (a
  genuinely completed search of the full certified-company listing).
  **Land O'Frost, Wellshire, Wellshire Farms, and Ambassador all VERIFIED
  ABSENT** from the Certified Humane directory. Caveat: this fetch was
  processed through WebFetch's summarization model against what the tool
  described as "the complete certified company listing" rather than a
  manual page-by-page read, so treat as high-but-not-absolute confidence —
  reasonable to write as VERIFIED ABSENT given the directory loaded and
  returned a real, described listing (unlike the 404 the raw file hit).
- AGW (A Greener World) — not independently re-checked this pass
  (agreenerworld.org/directory/ is documented as 403'ing for this pipeline
  per the other two companies' fact-checks); leave as NOT CHECKED, do not
  infer ABSENT.

## 5. Recalls and food-safety enforcement (USDA-FSIS) — UPHELD, upgraded corroboration, discrepancy RESOLVED

- **August 2015 Ambassador Beef Summer Sausage recall — UPHELD, upgraded to
  VERIFIED-SECONDARY with more detail.** Independently confirmed via
  Perishable News, Food Poisoning Bulletin, and the FSIS establishment page
  title itself, all agreeing on the core facts. New detail beyond the raw
  file: 12 oz. packages, establishment number **EST. 500**, product shipped
  to retail locations in **Minnesota** (raw file didn't have the ship-state).
  Discovered by the establishment itself, which self-reported to FSIS; no
  adverse reactions reported. Direct fsis.usda.gov fetch still 403's — this
  remains secondary-sourced, not primary-confirmed, but now corroborated
  across three independent non-advocacy outlets rather than two.
- **June 2018 Black Forest Ham / Honey Smoked Turkey mislabeling recall —
  UPHELD, upgraded to VERIFIED-SECONDARY, and the raw file's flagged
  title/content discrepancy is RESOLVED.** The raw file worried that a URL
  titled "...sausage-product-due-misbranding" was being used for a recall
  described as ham. Independently confirmed this pass: that "sausage" URL
  belongs to the **2015** Ambassador Beef Summer Sausage recall (correctly
  titled) — it is a *different* FSIS notice from the 2018 ham recall, which
  has its own separate official record, **"Recall Notification Report
  054-2018 (Ham Products),"** found via WebSearch at
  fsis.usda.gov/recalls-alerts/recall-notification-report-054-2018-ham-products
  (also 403's on direct fetch, but the title itself — "Ham Products" —
  confirms it is the correct notice for the ham mislabeling event, not a
  conflation). No two separate recalls were conflated; the raw file's
  research was accurate, just under-confident about the URL mismatch. New
  corroborating detail: the problem was discovered **June 20, 2018** via a
  **consumer complaint**, and the firm notified FSIS **June 22, 2018**
  (raw file didn't have the discovery mechanism). Confirmed via Food Safety
  News, The National Provisioner, Legal Reader, Hip2Save, and
  corp.commissaries.com — five independent outlets, well beyond the raw
  file's sourcing.
- **No pathogen-contamination recall found — UPHELD, unchanged status**
  (UNVERIFIED-ABSENT). Not independently re-searched this pass; the raw
  file's caveat about FSIS's own database not being directly queryable
  stands.

## 6. OSHA — plant safety — UPHELD, VERIFIED, both cases independently re-confirmed against OSHA's own database

Both OSHA establishment-inspection-detail URLs from the raw file were
independently re-fetched this pass (direct fetch of osha.gov succeeded
cleanly, no 403 — OSHA's site is fetchable unlike SEC/CourtListener/FSIS,
consistent with SKILL.md).

- **Lansing, IL plant (16850 Chicago Avenue) — UPHELD, VERIFIED, all figures
  match exactly.** Inspection opened July 1, 2020; lockout/tagout citation
  under 29 CFR 1910.147(d) issued October 19, 2020; initial penalty $74,218;
  final settled penalty **$13,494**. Independently confirmed the underlying
  incident description (employee's hand crushed in a Multi-Vac machine
  during maintenance without proper lockout procedure).
- **Chicago, IL plant (700 E. 107th Street) — UPHELD, VERIFIED, all figures
  match exactly.** Inspection opened January 17, 2024, referral type,
  amputation/food-manufacturing safety emphasis; six citations initially
  (matches the raw file's "six total citations... 4 Serious + other
  categories"); citations under 1910.212, 1910.147 (two sub-parts),
  1910.219, and 1904.0040 recordkeeping; initial penalty $66,828; final
  settled penalty **$44,262**; case closed June 27, 2025. All figures
  independently reproduced from OSHA's own database, not just re-stated from
  the raw file.
- **Address-reconciliation flag — still UNRESOLVED, not something this pass
  could close.** The 700 E. 107th Street, Chicago address still does not
  obviously match the three CSR-named plants (Lansing IL, Madisonville KY,
  Searcy AR). Not investigated further this pass — a genuine open question,
  not a confidence issue on the OSHA figures themselves, which are fully
  VERIFIED regardless of which specific facility this address belongs to.

## 7. Litigation — UPHELD, not independently re-searched this pass

No lawsuit against Land O'Frost was found in the raw file's multi-query
WebSearch pass. Not independently re-run this pass (lower priority than the
certification/recall/OSHA items this retry was scoped to prioritize); the
raw file's UNVERIFIED-ABSENT status and its own lower-confidence caveat
(CourtListener not directly queryable) stand unchanged.

---

## Summary for Stage 4

1. **Land O'Frost (parent) remains the thinnest-disclosure company in this
   batch — UPHELD as a genuine, now twice-independently-confirmed gap, not a
   research-pass miss.** Own-site pages (Who We Are, FAQ) checked directly
   by two separate agents with identical results. Write as `unknown` /
   "not disclosed," never as implied-bad.
2. **Material correction: Wellshire Farms is NOT the same record as Land
   O'Frost and should not inherit its blank sourcing profile.** Wellshire
   Farms is an independently-confirmed Global Animal Partnership
   manufacturer/processor partner (chicken, beef, pork) — a real
   third-party-verified signal absent from the parent brand — plus its own
   site makes company-disclosure claims (raised without antibiotics, no
   added hormones, vegetarian-fed, no animal by-products) that are NOT
   independently certified and must stay tagged `basis: company-disclosure`.
   Certified Humane: absent for Wellshire too (now VERIFIED ABSENT, not just
   NOT CHECKED). If Wellshire appears as its own catalog entry, give it its
   own `sourcing` record built from these facts rather than copying Land
   O'Frost's.
3. **Ambassador remains as thin as the parent** — independently checked its
   current retail brand page (under Wimmer's Meats); no welfare/sourcing
   content found. Fine to inherit the parent's "not disclosed" status.
4. **Both OSHA cases are fully VERIFIED** against OSHA's own database by
   independent re-fetch — $13,494 (2020, Lansing) and $44,262 (2024,
   Chicago) both confirmed exactly. Safe to state directly per the
   VERIFIED-facts language rule.
5. **Both recalls upgraded to VERIFIED-SECONDARY** with additional
   corroborating detail (2015: EST. 500, Minnesota shipment; 2018: consumer-
   complaint discovery mechanism) and the raw file's flagged URL-title
   discrepancy is resolved — no conflation occurred, the "sausage" URL and
   the 2018 "ham products" report are two genuinely separate, correctly-
   titled FSIS notices. Direct FSIS primary-source fetch still blocked by
   403 for both.
6. **GAP directory re-confirmed VERIFIED ABSENT for the Land O'Frost
   parent.** Certified Humane upgraded from NOT CHECKED to **VERIFIED
   ABSENT** (parent and both sub-brands checked) using the correct current
   URL (whos-certified/, not the raw file's dead find-certified-products/
   link). AGW remains NOT CHECKED — tooling limitation, do not infer
   ABSENT.
7. No advocacy-org editorial characterization was found carried into this
   record as objective fact anywhere in the raw file or in this pass's
   independent checks — all claims found were either company-disclosure
   (correctly tagged as such) or government enforcement records.
