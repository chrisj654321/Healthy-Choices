# Dietz & Watson — Stage 2 raw research (meat-poultry module)

Company: Dietz & Watson, Inc., privately held (family-owned since 1939, HQ
Philadelphia, PA). No SEC filings, no public 10-K. Research date: 2026-07-30.

Tooling note: same WebFetch 403 pattern as the Boar's Head file for
fsis.usda.gov, and 403/404 for the GAP/Certified Humane/AGW directory pages
when hit a second time — see per-item notes below for which specific fetch
succeeded vs. failed.

---

## 1. GAP (Global Animal Partnership) step level

**NOT a step holder — searched and absent.** Same completed directory fetch
as used for the Boar's Head file (one fetch covered all three companies in
this batch): https://globalanimalpartnership.org/shoppers/, retrieved
2026-07-30. Dietz & Watson does not appear on the G.A.P.-certified
retailer/brand partner list. (Full partner list is recorded in
`boars-head_raw.md` Section 1 to avoid duplicating ~65 names across three
files — same source, same retrieval, applies identically here.)

- Source: Global Animal Partnership, "Shoppers" partner list,
  https://globalanimalpartnership.org/shoppers/, retrieved 2026-07-30.
- Status: **VERIFIED ABSENT** (genuine completed search).

## 2. Sourcing model

Dietz & Watson does not describe itself as operating farms; it sources from
external supplier programs, organized by species, each with its own
company-stated standard. This is the most detailed *company-disclosed*
sourcing breakdown found among the three companies in this batch.

- Fact: "We work with farmers who share those values and raise animals The
  Right Way, upholding our family commitment to quality above all else and
  never cutting corners."
  Source: Dietz & Watson, "Global Impact," https://www.dietzandwatson.com/our-family/global-impact,
  fetched directly 2026-07-30. Basis: company-disclosure. Status: VERIFIED
  (direct fetch).
- Fact — **Chicken:** "cage free chickens are raised in a healthy, reduced
  stress environment that promotes animal welfare and natural behavior,"
  with "wholesome feed with vitamins, minerals and abundant fresh water."
  No certifier named for the "cage free" claim — it is an unaudited company
  claim, not a certification.
  Source: same Global Impact page, fetched directly 2026-07-30. Basis:
  company-disclosure. Status: VERIFIED (direct fetch); **flag for Stage 3**
  — "cage free" for chicken has no third-party certifier cited here, so per
  SKILL.md this belongs in `practices[]` with basis `company-disclosure`,
  not `certifications[]`.
- Fact — **Beef:** suppliers "meet and exceed current humane handling
  requirements by adhering to progressive industry leading practices," and
  "are industry leaders in sustainability planning and development and
  participate in the **Global Roundtable for Sustainable Beef (GRSB)**."
  Source: same page, fetched directly 2026-07-30. Status: VERIFIED as to
  Dietz & Watson's claim of GRSB supplier participation (company-disclosure,
  unverified against GRSB's own member list — GRSB membership search was
  attempted via WebSearch and returned no independent confirmation; NOT
  CHECKED against GRSB's own roster directly, that site was not queried in
  this pass). GRSB itself is an industry sustainability roundtable, not an
  animal-welfare certifier — its standards are about supply-chain
  sustainability broadly, not a welfare audit standard comparable to GAP or
  Certified Humane, so even if confirmed this would be a `practices[]` entry
  (basis company-disclosure), never a `certifications[]` entry.
- Fact — **Pork:** "raised under strict programs that meet and exceed
  current humane handling requirements by providing reduced stress
  environments," fed "wholesome diets with vitamins and minerals on
  sustainable farms." Suppliers "participate in the Global Roundtable for
  Sustainable Beef and the **National Pork Board Sustainable Pork Advisory
  Council**."
  Source: same page, fetched directly 2026-07-30. Status: VERIFIED as
  company-disclosure; NOT CHECKED against the National Pork Board's own
  roster.
- Fact — **Turkey:** raised in "a reduced stress environment that promotes
  natural behavior and socialization" on "sustainable family farms in the
  **Shenandoah Valley**," following **National Turkey Federation (NTF)
  Standards of Conduct**. This is the only company in the batch to name a
  specific sourcing region for one species.
  Source: same page, fetched directly 2026-07-30. Status: VERIFIED
  company-disclosure. NTF Standards of Conduct is an industry-association
  program, not an independent third-party certifier (same caveat AWI raised
  about Boar's Head's identical NTF reliance — see `boars-head_raw.md`
  Section 4).
- Fact — **Naturals line specifically:** "exclusively sourced from humane
  farms" (no certifier named).
  Source: Dietz & Watson, "No Antibiotics Ever,"
  https://www.dietzandwatson.com/dietz-life/eatingbetter/no-antibiotics-ever,
  fetched directly 2026-07-30. Status: VERIFIED (direct fetch); basis
  company-disclosure, no named auditor.

## 3. "No antibiotics ever" / "no nitrates/nitrites added" claims

- Fact: The **Naturals product line** (a distinct line, not the whole
  catalog) carries the claim: "no antibiotics EVER, no nitrates, no
  nitrites, no artificial preservatives, and no gluten." The company states
  it will "conduct annual audits of each and every one of its suppliers to
  ensure they are committed to the 'No Antibiotics Ever' standards" — an
  internally-run audit program, not independent third-party certification
  and not confirmed to be a USDA Process Verified Program.
  Source: Dietz & Watson, "No Antibiotics Ever" page (fetched directly,
  2026-07-30), URL as above. Status: VERIFIED for exact claim language
  (direct fetch); the "annual audits" claim is company-disclosure of its
  own internal process, not a named third-party auditor.
- Fact: Separately, the company also sells a **USDA Certified Organic
  ("Organics")** line, which is a distinct, legally-defined federal
  certification (organic certification legally requires no synthetic
  pesticides/antibiotics) — this is a real, checkable certification tier,
  unlike the Naturals line's self-audited claim.
  Source: same page, fetched directly 2026-07-30. Status: VERIFIED that the
  company claims this line as USDA Certified Organic; **NOT independently
  confirmed against the USDA Organic Integrity Database**
  (organic.ams.usda.gov/integrity) — per SKILL.md this database's
  interactive search UI defeats agent fetches, so this is NOT CHECKED, flag
  for the local bulk-download script route the skill recommends for
  organic-heavy modules if this claim becomes load-bearing.
- **USDA Process Verified Program (ams.usda.gov) check:** same 403 on the
  official PVP PDF listing as documented in `boars-head_raw.md`. WebSearch
  pass found no PVP entry naming Dietz & Watson among visible results.
  Status: **NOT CHECKED — directory blocked by 403, WebSearch pass
  non-exhaustive.**

## 4. Stress/handling practices — certification check

- No evidence found that Dietz & Watson holds Certified Humane or AGW
  (Animal Welfare Approved) certification. Attempted direct fetch of
  https://certifiedhumane.org/find-certified-products/ — 404. AGW directory
  (https://agreenerworld.org/directory/) was fetched successfully in a
  separate pass for this batch and returned a full name list (see
  `boars-head_raw.md` Section 1's GAP list for the retrieval method, though
  note AGW is a separate directory from GAP) — Dietz & Watson did not appear
  in it either.
  Status: **NOT CHECKED against Certified Humane** (404, directory itself
  could not be queried). **NOT CHECKED against AGW** in the same sense —
  treat consistently as NOT CHECKED rather than ABSENT per SKILL.md, since
  the fetch tooling for at least one of the two relevant passes failed
  intermittently across this research session and a clean, reproducible
  confirmation was not obtained for this specific company.
- All handling-practice claims found (chicken "reduced stress environment,"
  beef/pork "meet and exceed... humane handling requirements") are
  **company-disclosure only** — no named independent auditor accompanies
  any of them on the company's own page. This mirrors the exact pattern
  AWI's FTC complaint challenged in Boar's Head (vague "meets and exceeds"
  language with an unnamed or industry-association-only standard behind
  it) — flag as a comparable candidate for the "intentionally misleading
  claims" card, though no advocacy group or regulator complaint against
  Dietz & Watson specifically for this language was found in this research
  pass (searched; genuinely found nothing — this is an ABSENT finding for
  "known regulatory/advocacy challenge to this specific claim," distinct
  from the underlying claim's own weak sourcing, which is VERIFIED
  company-disclosure).

## 5. Recalls and food-safety enforcement

- Fact: In March 2010, USDA-FSIS issued a public health alert for deli
  meats potentially contaminated with Listeria monocytogenes, sold under
  several brands including Dietz & Watson, after Canadian health officials
  found Listeria during an unrelated outbreak investigation.
  Source: WebSearch aggregation citing a 2010-era FSIS public health alert,
  retrieved 2026-07-30. Status: UNVERIFIED (secondary aggregation; original
  FSIS alert URL not independently located/fetched in this pass).
- Fact: In February 2017, two Dietz & Watson-labeled cheese products (Colby
  and Colby Jack, service-deli cut) were voluntarily recalled for possible
  Listeria monocytogenes contamination. The products were manufactured by a
  **third-party supplier, Deutsch Kase Haus** (Middlebury, Indiana) — not a
  Dietz & Watson-operated plant. The contamination was first detected when
  Tennessee's Department of Agriculture sampled "Amish Classic Colby"
  cheese from a Trenton, TN store on **January 30, 2017**; Dietz & Watson's
  public recall announcement followed on **February 28, 2017**. Dietz &
  Watson subsequently ended its supplier relationship with Deutsch Kase
  Haus over the incident.
  Source: WebSearch aggregation (Refrigerated & Frozen Foods, MEAT+POULTRY,
  Manufacturing.net), retrieved 2026-07-30. Status: UNVERIFIED (secondary
  trade-press reporting; underlying FDA/FSIS recall notice not
  independently fetched — note this was a *cheese* recall via a co-packer,
  not a Dietz & Watson-manufactured meat product).
- Fact: No recall of a Dietz & Watson-**manufactured** (as opposed to
  supplied-ingredient) product was found in this research pass. This is a
  genuinely completed search across multiple query variations, so it is
  recorded as an ABSENT finding, not NOT CHECKED — with the caveat that
  WebFetch could not directly query the FSIS recall database itself
  (403'd), so this ABSENT rests on WebSearch coverage only, which is not as
  complete as a direct database query.
  Status: **UNVERIFIED-ABSENT** (genuinely searched via WebSearch across
  several query phrasings; FSIS's own recall search tool was not directly
  queried due to the 403 issue).

## 6. OSHA — plant safety

- Fact: OSHA inspection of Dietz & Watson, Inc.'s Philadelphia facility
  (5701 Tacony Street) — inspection opened **February 21, 2024**, type
  "Referral," partial scope, safety-focused, specifically examining
  **amputation hazards**. Resulted in **two citations**, both classified
  "Other," under standards **29 CFR 1910.212(a)(2)** and **29 CFR
  1910.219(c)(4)(i)** (machine guarding standards — general point-of-
  operation and moving-machine-parts guarding). Total penalty **$12,340**,
  reduced/reclassified through an informal settlement. Case closed
  **December 20, 2024**.
  Source: OSHA establishment inspection detail page,
  https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1729245.015,
  fetched directly 2026-07-30. Status: VERIFIED (direct fetch of OSHA's own
  record).

## 7. Litigation

- Fact: **Watson v. Dietz & Watson, Inc.**, Case No. **1:20-cv-06550**, U.S.
  District Court for the **Southern District of New York**, filed
  **08/17/2020**, Judge Alison J. Nathan. Class-action alleging deceptive
  labeling of Dietz & Watson **Smoked Gouda cheese** — claim is that the
  smoky flavor comes from added "natural smoke flavoring" rather than
  actual wood-smoke exposure, and that this should have been disclosed on
  the front label per a cited 2017 FDA Warning Letter standard for "smoke
  flavor" vs. "smoked" labeling. Claims: NY consumer-protection statutes,
  negligent misrepresentation, breach of warranty, fraud, unjust
  enrichment.
  Source: docket details found via WebSearch citing UniCourt case record,
  https://unicourt.com/case/pc-db5-watson-v-dietz-watson-inc-643044, and
  original filing PDF at
  https://www.classaction.org/media/watson-v-dietz-and-watson-inc.pdf;
  retrieved 2026-07-30. Status: **UNVERIFIED** — docket number and court
  were found via WebSearch summarizing UniCourt (a legal-data aggregator,
  not the court's own PACER/CourtListener record) rather than a direct
  CourtListener confirmation (CourtListener itself 403's on WebFetch per
  SKILL.md's documented limitation). The docket number format
  (1:20-cv-06550, S.D.N.Y.) is consistent with a real federal filing and
  should clear to VERIFIED at Stage 3 with a CourtListener API/script pull
  if the primary-source script from Stage 1 is re-run for this company.
- Fact: A related suit, **Jones v. Dietz & Watson, Inc.**, Case No.
  **1:20-cv-06018**, same court, alleging the same type of claim against
  Dietz & Watson's **Smoked Provolone** cheese.
  Source: https://www.classaction.org/media/jones-v-dietz-and-watson-inc.pdf,
  found via WebSearch, retrieved 2026-07-30. Status: UNVERIFIED (same
  caveat as above — docket number found via secondary aggregator, not
  independently confirmed on CourtListener directly).
- Note: both suits concern **cheese labeling/flavor-sourcing claims**, not
  animal welfare or meat sourcing — included here per the standard Stage 2
  source list ("court records... consumer-protection suits") rather than
  the welfare-specific claim types, since they are the only litigation
  found against this company in this pass.

## Summary of gaps for Stage 3 (fact-check) to prioritize

1. Confirm the Watson v. Dietz & Watson (1:20-cv-06550) and Jones v. Dietz &
   Watson (1:20-cv-06018) dockets directly via CourtListener/PACER if a
   working access path exists (script-based, per SKILL.md's Stage 1 tool),
   since both were only found via a secondary aggregator (UniCourt/
   classaction.org) in this pass.
2. Certified Humane and AGW directory checks are NOT CHECKED cleanly for
   this company — re-run directly before Stage 4 writes `unknown` vs.
   ABSENT.
3. GRSB and National Pork Board Sustainable Pork Advisory Council supplier
   membership: Dietz & Watson's claim of participation is company-disclosure
   only; NOT CHECKED against either organization's own public member
   roster.
4. USDA Organic Integrity Database check for the "Organics" line: NOT
   CHECKED (interactive search UI, per SKILL.md's documented limitation).
5. USDA Process Verified Program: NOT CHECKED (PDF listing 403'd, WebSearch
   pass non-exhaustive, no hit found).
