# Bumble Bee Foods, LLC — Stage 3 fact-check

Auditing `bumble-bee_raw.md` (researched 2026-07-30). Independent pass —
direct DOJ/CBP/MSC fetches attempted where the module flags them as
directly fetchable; cross-corroboration via WebSearch used where direct
fetch failed. Flags: VERIFIED / UNVERIFIED / DISPUTED / STALE, per
`/political-analysis` vocabulary.

**Same tooling correction as the StarKist checkpoint:** `justice.gov` press
releases are NOT currently directly fetchable — the site returns HTTP 200
with an Akamai Bot Manager JS-challenge interstitial to both WebFetch and
`curl` with a declared browser User-Agent, to both the researcher's tools and
this fact-checker's. All DOJ facts below were verified via cross-corroboration
of multiple independent secondary sources quoting identical figures, not a
direct DOJ page render. This should be corrected in the skill's Stage-1
documentation going forward.

---

## 1. Ownership / corporate structure

- Chapter 11 filed **November 21, 2019**; asset purchase agreement with FCF
  for ~$925M (bid) / ~$928M (closed). **UPHELD — UPGRADE toward VERIFIED.**
  This pass found the actual bankruptcy case identity via WebSearch: filed in
  the **U.S. Bankruptcy Court for the District of Delaware, case no.
  19-12502**, debtor "Old BBP, Inc." (formerly Bumble Bee Parent, Inc.),
  Judge Laurie Selber Silverstein — matching the Nov 21, 2019 filing date and
  ~$925M asset-sale figure in the raw file exactly. This is a specific,
  citable case number the Stage-1 script could pull a primary docket record
  for in a follow-up pass (PACER/Delaware Bankruptcy Court, not covered by
  CourtListener's typical civil/criminal docket search — flag as an action
  item). Recorded as UNVERIFIED still since the docket itself wasn't pulled,
  but now anchored to an exact case number rather than just news reports.
- FCF closed acquisition January 31, 2020, ~$928M; FCF is current owner.
  **UPHELD — UNVERIFIED**, consistent multi-outlet reporting, no contradiction found.
- Bankruptcy filing "followed" the 2017 guilty plea/fine — causal framing.
  **UPHELD — correctly flagged as causal framing from secondary reporting,
  not a court finding.** Writer must not present this as adjudicated
  causation (forbidden-language rule on causation-by-juxtaposition applies
  here too, even though this isn't a lobbying example — the same logic:
  don't imply the fine directly caused the bankruptcy as established fact).

---

## 2. Criminal antitrust price-fixing case — PRIORITY ITEM

- Bumble Bee + co-conspirators fixed canned/pouch tuna prices, Q1
  2011–Q4 2013. **UPHELD — VERIFIED**, cross-corroborated (CBS News, Fox
  News, NBC News, SeafoodSource all report the identical conspiracy window).
- Federal criminal case *US v. Bumble Bee Foods, LLC*, N.D. Cal. 3:17-cr-00249;
  filed 2017-05-08; plea/sentencing 2017-08-02. **UPHELD — VERIFIED**
  (primary CourtListener record via approved script).
- **$25 million minimum criminal fine, rising to $81.5 million maximum**
  payable by successor entity "Big Catch" on a qualifying sale of Bumble
  Bee; $400 special assessment; no restitution/probation imposed.
  **UPHELD — VERIFIED.** Re-confirmed this pass via WebSearch
  cross-corroboration: CBS News, Fox News, and Law360 independently cite the
  identical $25M/$81.5M figures and the "Big Catch" successor-entity
  condition. Dollar figures and structure confirmed accurate exactly as
  written — this is the single most load-bearing fact in the checkpoint and
  it holds up.
- **Christopher Lischewski, former President/CEO, convicted December 3,
  2019**; sentenced by Judge Edward M. Chen **June 16, 2020, to 40 months in
  federal prison + $100,000 criminal fine.** **UPHELD — VERIFIED.**
  Cross-corroborated by SeafoodSource, Volkov Law blog, Food Business News,
  and (per DOJ's own indexed press-release title, matching search result)
  the DOJ release itself. One useful addition found this pass: the DOJ
  release also states the conspiracy "affected over $600 million" in canned
  tuna sales and that the court found Lischewski was "a leader or organizer"
  of the conspiracy — both citable VERIFIED additions the writer could use
  for context (leader/organizer finding = an adjudicated fact from
  sentencing, not an allegation).
- Federal criminal case *US v. Lischewski*, N.D. Cal. 3:18-cr-00203; filed
  2018-05-16; terminated 2020-06-16. **UPHELD — VERIFIED** (primary
  CourtListener record).
- Ninth Circuit affirmed conviction July 7, 2021; cert petition filed
  2021-12-06; raw file flagged the SCOTUS outcome as **NOT CHECKED /
  open-unresolved**. **RESOLVED THIS PASS:** the Supreme Court **denied
  Lischewski's cert petition on May 2, 2022, in case No. 21-852** (the
  question presented concerned the per se rule in criminal antitrust and the
  Sixth Amendment jury-proof requirement). Source: multiple law-firm/bar
  association trackers (California Lawyers Association Antitrust E-Briefs
  June 2022; Wolters Kluwer Antitrust Connect blog), both citing the docket
  number and denial date.
  **UPGRADE — now VERIFIED, resolved.** Stage 4 should write this as
  resolved/final, not open — the raw file's caution to "flag as
  open/unresolved" is now outdated; the conviction is fully final with no
  further appeal avenue.
- Civil MDL 3:15-md-02670 + named suits (*Youngblood*, *Wal-Mart*, *Olean*).
  **UPHELD — VERIFIED** (primary CourtListener records).
- December 2024, Judge Sabraw approved $216M+ combined civil settlements.
  **UPHELD — VERIFIED** (already-merged companies.js data, independently
  corroborated).

---

## 3. Separate matter — 2012 workplace-death case (Jose Melena)

- Melena died October 11, 2012, trapped in an industrial tuna oven, Santa Fe
  Springs, CA. **UPHELD — UNVERIFIED (multiple consistent secondary
  sources)**, correctly scoped as labor/worker-safety, not a fishing/sourcing
  claim, per the raw file's own note to Stage 3/4.
- Bumble Bee pled guilty (announced Jan 2017) to a misdemeanor safety-program
  violation; Saul Florez pled guilty to a felony LOTO violation causing
  death, 3 years' probation + community labor. **UPHELD — UNVERIFIED**,
  consistent reporting, no contradiction found.
- Total settlement **$6 million**, described as the largest known California
  workplace-violation-death payout. **UPHELD, with a completeness
  correction.** This pass could not open the LA County DA's PDF directly
  (binary/non-text render failure on both WebFetch and this session's tools)
  but found the same figures via WebSearch cross-corroboration (NBC News,
  CBS News, ISHN, Fox News), which additionally surfaces a detail the raw
  file omitted: the $6M breaks down as **$1.5M to Melena's family + $3M for
  oven-safety upgrades (as raw file states) + an additional $750,000 to the
  DA's office to fund workplace-safety investigations** — a third component
  not captured in the raw checkpoint. Minor addition, not a contradiction;
  recommend Stage 4 either use the full three-part breakdown or keep the
  simpler two-part version raw file used (both are accurate, the three-part
  version is just more complete).

---

## 4. Seafood Watch — rating, method, bycatch

- Skipjack purse-seine/FAD: red/Avoid, same bigeye/marlin/shark bycatch
  reasoning as StarKist's checkpoint (identical underlying fishery rating,
  correctly noted as shared across brands since Seafood Watch rates by
  species+gear, not brand). **UPHELD — VERIFIED** (same cross-corroboration
  upgrade applied in the StarKist checkpoint: JS-rendering barrier confirmed
  genuine on repeat attempt, but WebSearch pulled identical primary-page
  content independently corroborated by SeaChoice/FishChoice).
- Consumer guide favoring pole/troll/FAD-free. **UPHELD — VERIFIED**, same basis.
- Albacore/yellowfin gear-specific pages: still **NOT CHECKED** — same JS
  barrier, not resolved this pass either.

---

## 5. Fishing method — Bumble Bee/FCF disclosures

- 71% "sourced sustainably" (2021) rising to 91% (2023), self-reported.
  **UPHELD — UNVERIFIED (company-disclosure)**, correctly flagged as a
  self-defined metric, not third-party audited — praise rail correctly applied.
- Albacore line MSC-certified-or-FIP by end of 2021; skipjack conversion
  target for 2022. **UPHELD — UNVERIFIED (company-disclosure)**, correctly scoped.
- FCF supplies ~95% of Bumble Bee's albacore, 70%+ of light-meat tuna, per
  Mongabay. **UPHELD — UNVERIFIED (investigative-journalism source, treated
  as a lead)**, correctly scoped per the module's IUU/labor sourcing tier —
  this is exactly the right caution for a single-outlet investigative claim.

---

## 6. MSC certification

- Two longline fisheries (Indian Ocean tuna; Western/Central Pacific
  albacore/yellowfin) pursuing MSC certification via active FIPs, **NOT yet
  certified** as of the raw file's most recent document (April 2024 FIP
  action plan). **UPHELD — UNVERIFIED for certification status**, and the
  raw file's explicit caution ("must NOT be written as 'Bumble Bee is MSC
  certified'") is correct and should be enforced by the writer.
  This pass attempted a direct MSC Track-a-Fishery query for "FCF" and for
  "Indian Ocean tuna longline" and could not conclusively identify either
  named fishery in a certified state — MSC's search UI genuinely resists
  scripted/agent querying, consistent with the skill's documented
  limitation. One general WebSearch result (an ISSF tuna-fisheries tracking
  table, "last updated June 5, 2026") suggests some Pacific longline
  fisheries tied to FCF-linked operators have since reached full assessment,
  but nothing found this pass confirms these two SPECIFIC named fisheries
  have reached certified status. **Action needed, unresolved:** a live
  browser session against fisheries.msc.org (not WebFetch/curl) querying
  "FCF" and the two specific fishery names by their fisheryprogress.org
  profile names would give an authoritative current status. Do not upgrade
  this claim without that direct check.
  **Contrast note for Stage 4:** StarKist's parent (Dongwon) DOES hold a
  certified MSC fishery (found this pass, see starkist_factcheck.md) — do
  NOT let this asymmetry read as a comparative claim in copy ("StarKist is
  MSC-certified, Bumble Bee isn't") since the app's comparison rail computes
  comparisons from graded data, never hand-written into records per the
  reviewer's mandate.

---

## 7. NOAA IUU / CBP forced-labor exposure

- **Da Wang WRO (2020), Vanuatu-flagged/Taiwan-owned, forced labor,
  reported tied to Bumble Bee's supply chain.** Raw file flagged the WRO
  itself as "VERIFIED-able in principle" but UNVERIFIED pending a direct
  CBP notice pull, with the Bumble Bee link sourced to Greenpeace (advocacy,
  lead-only).
  **UPGRADE + IMPORTANT ADDITION.** This pass confirms via WebSearch
  cross-corroboration: WRO effective **August 18, 2020** (exact date not in
  raw file — worth adding), and — not in the raw file at all — **CBP
  escalated this to a full forced-labor FINDING on January 28, 2022**,
  citing evidence of all 11 ILO forced-labor indicators. A Finding is a
  stronger enforcement action than a WRO (WRO = detain-pending-review;
  Finding = an adjudicated determination that results in automatic
  seizure/exclusion). Source: SeafoodSource reporting on the 2022 escalation,
  cross-referenced against CBP's own WRO/Finding action pattern (consistent
  with CBP's public methodology for Da Wang precedent cases).
  **The Bumble Bee/FCF supply-chain link remains UNVERIFIED** — still
  sourced to secondary reporting connecting Da Wang to FCF (Bumble Bee's
  parent), not a CBP notice that names Bumble Bee directly. Recommend Stage
  4 write the WRO/Finding as VERIFIED government action, and the Bumble
  Bee/FCF connection as a hedged secondary-sourced link, exactly as the raw
  file intended — just with the corrected 2020-08-18 WRO date and the new
  2022-01-28 Finding escalation added.
- **Hangton No. 112 WRO, effective August 4, 2021,** Fijian-flagged, forced
  labor (wage withholding, debt bondage, document retention); tied to PAFCO
  processing facility with a Bumble Bee agreement.
  **UPHELD — VERIFIED for the WRO itself.** This pass directly fetched
  CBP's own newsroom page (cbp.gov, 110KB of real rendered content — CBP's
  site, unlike DOJ's, is NOT behind a JS interstitial and IS directly
  fetchable) and confirmed the exact effective date (August 4, 2021),
  vessel name, and forced-labor citation language verbatim. This is now a
  directly-confirmed primary source, stronger than the raw file's own
  citation. **The Bumble Bee/PAFCO link remains UNVERIFIED** as the raw file
  states — correctly hedged, not fully confirmed as coming from CBP's own
  notice text.
- Four fishing-vessel laborers' March 2025 forced-labor suit; Bumble Bee
  moved to dismiss (June 2025). **UPHELD — UNVERIFIED / ALLEGED**, correctly
  flagged as pending litigation, no ruling on the merits. This is exactly
  right per the negative-claims-need-adjudication rule — must stay hedged.
- NOAA IUU Report to Congress: **still NOT CHECKED**, not resolved this pass either.

---

## 8. Greenpeace Tuna Guide

- Failing grade; Greenpeace's editorial characterization quoted in the raw
  file ("has not made a commitment...", "largest shelf stable seafood
  company"). **UPHELD — UNVERIFIED / advocacy source**, correctly scoped.
  **Flag for the writer:** the raw file itself quotes several sentences of
  Greenpeace's own editorial framing verbatim for internal reference. That
  quoted editorial language is explicitly FORBIDDEN from reaching `sourcing`
  as fact — only the pass/fail grade may be used. This is already correctly
  caveated in the raw file's Status line, but flagging again here since it's
  the single easiest praise-rail/negative-rail violation for a writer to
  slip on if skimming.

---

## 9. Mercury (FDA/EPA)

- Same category-level guidance as StarKist's checkpoint. **UPHELD —
  VERIFIED**, re-confirmed this pass via the same FDA Q&A page content
  cross-check (see starkist_factcheck.md — identical source, identical figures).

---

## 10. FDA recalls / warning letters (non-mercury)

- 5-oz Chunk White Albacore / Chunk Light Tuna recall (early 2023), loose
  seals/seams risk. **UPHELD — UNVERIFIED**, single trade-press source, not
  independently re-checked against FDA's enforcement database this pass.

---

## Summary of changes from raw file

| Item | Raw status | Fact-check verdict |
|---|---|---|
| $25M/$81.5M DOJ fine, "Big Catch" clause | VERIFIED | **UPHELD**, exact figures re-confirmed |
| Lischewski 40-month sentence, $100K fine | VERIFIED | **UPHELD**; added citable detail — court found him "leader or organizer," conspiracy "affected over $600M" in sales |
| Lischewski SCOTUS cert petition outcome | NOT CHECKED / flagged open | **RESOLVED — denied May 2, 2022, case No. 21-852.** Write as final, not pending. |
| Bankruptcy filing date/figures | UNVERIFIED | **UPHELD**, now anchored to exact case number (D. Del. 19-12502) for a future primary-docket pull |
| Melena settlement $6M breakdown | UNVERIFIED | **UPHELD**, minor completeness addition ($750K to DA's office not in raw file) |
| Seafood Watch skipjack red/Avoid | UNVERIFIED-pending-direct-view | **UPGRADED to VERIFIED** (cross-corroboration) |
| Da Wang WRO | UNVERIFIED (link only) | **UPGRADED for the WRO fact itself** (exact date confirmed) + **NEW FACT: escalated to a formal CBP forced-labor Finding, Jan 28, 2022** — not in raw file, add for Stage 4. Bumble Bee/FCF link stays UNVERIFIED. |
| Hangton No. 112 WRO | VERIFIED (not directly rendered) | **UPHELD, now directly confirmed** via live CBP page fetch |
| MSC certification (2 longline fisheries) | UNVERIFIED, not yet certified | **UPHELD**, still unresolved on live status — do not upgrade without a live-browser MSC query |
| Everything else | as stated | **UPHELD**, no changes |
