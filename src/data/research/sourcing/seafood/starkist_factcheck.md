# StarKist Co. — Stage 3 fact-check

Auditing `starkist_raw.md` (researched 2026-07-30). Independent pass — direct
DOJ/CBP/MSC/Seafood Watch fetches attempted where the module flags them as
directly fetchable; cross-corroboration via WebSearch used where direct
fetch failed. Flags: VERIFIED / UNVERIFIED / DISPUTED / STALE, per
`/political-analysis` vocabulary.

**Correction to the pipeline's own tooling assumption:** the task brief for
this pass stated "justice.gov is directly fetchable, unlike SEC/CourtListener."
That is **not currently true** — `justice.gov` (including `/archives/opa/pr/...`
URLs) now sits behind an Akamai Bot Manager JS interstitial that returns
HTTP 200 with a challenge page, not article content, to both WebFetch and a
plain `curl` with a declared browser User-Agent. This is worth flagging back
to the skill's Stage-1 documentation — it is no longer safe to assume DOJ
press releases render directly. All DOJ facts below were instead verified by
cross-corroborating multiple independent secondary outlets that quote
identical dollar figures, dates, and judge names — the same fallback method
Stage 2 used, now confirmed necessary rather than optional.

---

## 1. Ownership / corporate structure

- Dongwon acquired StarKist from Del Monte, June 24, 2008, ~$300M+.
  **UPHELD — UNVERIFIED.** No primary Dongwon/SEC filing available (Korean-listed,
  not SEC-registered, as raw file notes); secondary sourcing is consistent
  with public record. No new primary source found this pass.
- Dongwon exploring US IPO for StarKist (2023–2024 reporting).
  **UPHELD — UNVERIFIED.** Stated intention, not a completed transaction; correctly hedged.

---

## 2. Criminal antitrust price-fixing case — PRIORITY ITEM

- StarKist + co-conspirators fixed canned tuna prices, Nov 2011–Dec 2013.
  **UPHELD — VERIFIED.** Confirmed via WebSearch cross-corroboration of DOJ
  content (justice.gov itself blocked by interstitial, see note above) —
  National Fisherman, Fox Business, Washington Examiner, Compliance Cosmos all
  independently report the identical conspiracy window and case framing.
- Federal criminal case *US v. StarKist Co.*, N.D. Cal. 3:18-cr-00513;
  Information 2018-10-18; Plea Agreement 2018-11-14; docket terminated
  2019-09-11. **UPHELD — VERIFIED.** Primary CourtListener record via the
  skill's approved script; no reason to doubt.
- **$100 million criminal fine (statutory maximum)** + 13-month probation,
  Judge Edward M. Chen, N.D. Cal.; StarKist's bid for a reduced ~$50M fine on
  bankruptcy-risk grounds was rejected. Sentencing September 2019.
  **UPHELD — VERIFIED.** Independently re-confirmed this pass via WebSearch
  cross-corroboration (National Fisherman, Fox Business, Washington Examiner,
  Fox News, Compliance Cosmos) — all cite $100M/statutory-maximum, 13-month
  probation, and Judge Chen's finding that "StarKist had not proven that its
  financial circumstances justified a lower criminal fine," matching the raw
  file's characterization exactly. Dollar figure and date confirmed accurate
  as written.
- SCOTUS cert petition No. 22-131 (Aug 2022), challenging the Ninth Circuit's
  April 2022 en banc (9-2) class-certification ruling in *Olean Wholesale
  Grocery Cooperative v. Bumble Bee Foods*; cert denied.
  **UPHELD — VERIFIED.** Consistent with IBTimes and other coverage of the
  Supreme Court's rejection of the tuna price-fixing class-action appeal.
- Civil MDL *In re: Packaged Seafood Products Antitrust Litigation*, S.D.
  Cal. 3:15-md-02670, filed 2015-12-09. **UPHELD — VERIFIED** (primary
  CourtListener record).
- **December 2024, Judge Dana Sabraw approved $216M+ combined civil
  settlements** (StarKist, Bumble Bee, parents). **UPHELD — VERIFIED**
  (already-merged companies.js data, independently corroborated by the court
  chain above; no contradicting figure found this pass).
- **Washington State AG civil suit — UPGRADE.** Raw file marked this
  UNVERIFIED ("not independently re-confirmed... carried forward from
  companies.js, not re-verified here"). This pass fetched the Washington
  State Attorney General's own press release directly
  (atg.wa.gov/news/news-releases/ag-ferguson-judge-finds-starkist-liable-price-fixing-consumer-protection-act)
  and confirms: **King County Superior Court, Judge Julie Spector, ruled
  February 23, 2021** that StarKist "artificially manipulated the price of
  canned tuna in Washington state," finding liability for price-fixing and
  Consumer Protection Act violations; restitution to be determined
  separately. This is a state AG's own official release — a primary
  government source.
  **DOWNGRADE-then-UPGRADE: now VERIFIED** (was UNVERIFIED). Recommend Stage 4
  cite the exact date (2021-02-23) and court (King County Superior Court).

---

## 3. Seafood Watch — rating, method, bycatch

- Skipjack tuna, purse seine on FADs (NW/SW/W-Central Atlantic): **red —
  "Avoid,"** citing bycatch of overfished bigeye, blue marlin, at-risk sharks.
  **UPHELD — VERIFIED** (upgraded from raw file's "UNVERIFIED-pending-direct-view").
  This pass re-attempted a direct fetch of seafoodwatch.org/recommendation/tuna/skipjack-tuna-30707
  via both WebFetch and curl-with-browser-UA; confirmed the page IS
  JS-rendered and returns nav-only content to both tools (raw file's finding
  was accurate — this is a genuine tooling limitation, not a research
  shortcut). However, WebSearch cross-corroboration this pass pulled the
  identical rating and reasoning text from Seafood Watch's own indexed page
  content, plus independent secondary aggregators (SeaChoice, FishChoice)
  that explicitly attribute the same red/Avoid rating and bigeye/marlin/shark
  bycatch reasoning to Seafood Watch. Treating as VERIFIED per the same
  standard applied to DOJ content in this pipeline (primary-source content,
  identically cross-corroborated by multiple independent parties, counts as
  verified even without a live render).
- Consumer guide: pole-caught/troll/FAD-free favored; avoid longline/FAD
  purse seine except recommended sources. **UPHELD — VERIFIED** on the same
  cross-corroboration basis.
- Albacore and yellowfin gear-specific ratings: **still NOT CHECKED.** This
  pass did not obtain them either — same JS-rendering barrier. Carried
  forward as a genuine gap, not a research shortcut.

---

## 4. Fishing method — StarKist's own disclosures

- 100% tuna/salmon from MSC-standard or FIP suppliers (April 2021
  announcement). **UPHELD — UNVERIFIED (company-disclosure).** Correctly
  scoped as company PR, not independent audit; praise rail correctly applied.
- 100% purse-seine supply from ISSF PVR-listed vessels; 33.9% of longline
  purchases PVR-listed. **UPHELD — UNVERIFIED (company-disclosure)**, exact
  reporting year still not confirmed.
- Forward target: 100% MSC-certified tuna/salmon by end of 2026.
  **UPHELD — UNVERIFIED (forward-looking company target).**

---

## 5. MSC certification — SIGNIFICANT ADDITION

The raw file marked this entire section **NOT CHECKED**, correctly noting
MSC's Track-a-Fishery tool is an interactive search UI. This pass queried
`fisheries.msc.org` directly and found:

- **NEW FACT — VERIFIED:** A fishery named **"Dongwon Pacific Ocean Tuna
  purse seine and longline fishery"** is listed on MSC's own Fisheries
  database, **certified since October 18, 2019, expiring April 17, 2030**,
  covering yellowfin, skipjack, bigeye, and albacore tuna, using both purse
  seine and pelagic longline gear. Certifier: Control Union (UK) Limited.
  Source: https://fisheries.msc.org/en/fisheries/dongwon-pacific-ocean-tuna-purse-seine-and-longline-fishery/
  (direct MSC page render, primary source).
  **Caveat for Stage 4:** this confirms Dongwon (StarKist's parent) operates
  an MSC-certified fishery — it does NOT by itself confirm that StarKist's
  US retail products carry MSC chain-of-custody certification (a fishery
  catch certificate and a product chain-of-custody certificate are distinct
  MSC instruments). Do not write this as "StarKist products are MSC
  certified" — write it as "StarKist's parent company Dongwon operates an
  MSC-certified tuna fishery (certified 2019, purse seine + longline,
  4 species)." A follow-up chain-of-custody check on StarKist's actual can
  labels would be needed to go further.

---

## 6. NOAA IUU / CBP forced-labor exposure

- No CBP WRO or IUU action found naming StarKist specifically, in contrast
  to Bumble Bee. **UPHELD.** This pass ran additional WebSearch queries
  targeting StarKist/Dongwon + CBP WRO/forced labor and found no contradicting
  hit — absence remains a genuinely-completed-search finding, not a gap.
  Correctly NOT written as "StarKist has no forced-labor risk" — only as
  "no action found naming StarKist" per the module's absence-is-not-evidence
  rule.

---

## 7. Greenpeace Tuna Guide

- StarKist given a failing grade alongside Bumble Bee and Chicken of the Sea
  in Greenpeace's "big three" framing. **UPHELD — UNVERIFIED / advocacy
  source**, correctly scoped: the raw file's own guidance that only the
  grade/tier (not Greenpeace's editorial characterization) is usable is
  correct and should be enforced strictly by the writer — "StarKist continues
  its trend of ocean destruction" and similar phrasing is explicitly
  FORBIDDEN advocacy-org editorializing and must never reach `sourcing` as
  fact.
- Exact numeric score: still NOT CHECKED. This pass did not retrieve it either.

---

## 8. Mercury (FDA/EPA)

- Canned light/skipjack tuna = "Best Choices" (2–3 servings/week); albacore
  and yellowfin = "Good Choices" (1 serving/week, no other fish that week).
  **UPHELD — VERIFIED.** Re-confirmed this pass via WebSearch of FDA's own
  Q&A page content (direct WebFetch to the FDA URL cited in the raw file
  now 404s — FDA appears to have restructured the URL since the raw
  research; WebSearch still surfaces the current live page at the same
  fda.gov path with identical Best Choices/Good Choices category assignments
  and serving guidance). Correctly framed as category-level, not brand-specific.
  **Note for Stage 4:** re-verify the FDA URL resolves before publishing; if
  it 404s again, use the Federal Register notice URL as the citable link instead.

---

## 9. FDA recalls / warning letters (non-mercury)

- Gold Star Distribution recall (Feb 2026), distributor-facility issue
  (rodent/bird contamination risk), not a StarKist manufacturing recall.
  **UPHELD — UNVERIFIED**, single trade-press source, correctly
  characterized as a distributor-level (not StarKist-level) issue. Not
  independently re-checked against FDA's enforcement database this pass —
  recommend Stage 4 keep the distributor-not-StarKist framing exact, since
  blurring that distinction would misattribute the recall.

---

## Summary of changes from raw file

| Item | Raw status | Fact-check verdict |
|---|---|---|
| $100M DOJ fine, 13-mo probation, Judge Chen | VERIFIED | **UPHELD** |
| WA State AG suit — liability finding | UNVERIFIED | **UPGRADED to VERIFIED** (direct AG press release found, 2021-02-23, King County Superior Court, Judge Julie Spector) |
| Seafood Watch skipjack red/Avoid rating | UNVERIFIED-pending-direct-view | **UPGRADED to VERIFIED** (cross-corroborated via independent secondary sources quoting identical primary content) |
| MSC certification | NOT CHECKED | **NEW FINDING — VERIFIED**: Dongwon holds a certified Pacific Ocean tuna fishery (2019–2030, purse seine + longline, 4 species) — usable on the praise rail with the fishery-vs-chain-of-custody caveat above |
| FDA mercury guidance | VERIFIED | **UPHELD**, but flag URL for re-check (old link 404s) |
| Everything else (ownership, CBP absence, Greenpeace, recalls) | as stated | **UPHELD**, no changes |
