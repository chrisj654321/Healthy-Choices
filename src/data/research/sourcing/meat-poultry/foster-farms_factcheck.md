# Foster Farms — Stage 3 fact-check (independent verification pass)

companyId: `foster-farms`
Stage 2 (research) file: `foster-farms_raw.md` (confirmed present, 32,228 bytes, >500-byte checkpoint guard passed)
Fact-checked: 2026-08-05, independent instance — did not trust researcher's framing; re-fetched/re-searched primary sources directly wherever possible.

Flags used: **VERIFIED** (primary source directly confirms) / **UNVERIFIED** (secondary source only) / **DISPUTED** (contradicting sources, both noted) / **STALE** (source predates 2020). Severity ('high'/'medium'/'low') added where relevant per the issues[] rubric. Raw claims are preserved verbatim; only flags/annotations are added.

---

## 1. GAP (Global Animal Partnership) step level

- **Fact:** GAP's "Manufacturers | 5-Step Partners" page lists many companies; Foster Farms does NOT appear.
  **FACT-CHECK FLAG: VERIFIED (absence on this one page only).** Not independently re-fetched this pass (low priority, researcher's own basis note is already correctly hedged), but the researcher's own conclusion — "NOT CHECKED exhaustively... record as unresolved/not-found-on-the-page-checked, not as a confirmed absence" — is the correct, conservative framing and should be preserved as-is into Stage 4. Do not upgrade to "confirmed absent."

## 2. Certified Humane (certifiedhumane.org / Humane Farm Animal Care) — PRIORITY item, independently re-verified

- **Fact:** Certified Humane's "Who's Certified" page fetched directly; Foster Farms does not appear in the 300+-entry A–Z table.
  **FACT-CHECK FLAG: VERIFIED — genuinely confirmed absent, not merely "not checked."** Independently re-fetched `certifiedhumane.org/whos-certified/` in this pass; confirmed the full alphabetical table was returned (sample near "F" pulled: Forsman Farms Inc, Fred Usinger Inc, First Light Farms, Fairfield Specialty Eggs) and Foster Farms/Foster Poultry Farms is absent. **This IS a solid basis for "confirmed absent," not "not checked"** — the distinction the researcher flagged for scrutiny holds up. Two independent fetches (researcher's + this pass) of the same complete, paginated-in-full directory agree. Record as confirmed-absent in Stage 4, not as an open item.
- **Fact:** "Shop by Brand" page also confirms absence.
  **FLAG: VERIFIED**, second independent confirmation, consistent with above.

## 3. American Humane Certified (americanhumane.org) — separate certifier, NOT Certified Humane

- **Fact:** Foster Farms holds "American Humane Certified" status on fresh chicken; press describes it as first West Coast fresh-chicken producer to earn it; American Humane audited Foster Farms broiler operations "for the eighth consecutive year" per the cited press release.
  **FACT-CHECK FLAG: DISPUTED / DOWNGRADE FROM RAW FILE'S FRAMING.** The raw file states this as a live, present-tense fact ("Foster Farms **holds** ... status"). Independent verification this pass found:
  - The cited "eighth consecutive year" press release is itself several years old (PR Newswire's original "first in the West" announcement dates to roughly 2011; the "eighth consecutive year" follow-up release — the most recent dated evidence found anywhere for this claim — is from **February 2021**). No audit renewal, PR, or listing newer than 2021 was found in this pass despite a direct search for a 2025/2026 audit.
  - More importantly: American Humane's own **current, primary-source "Certified Farm Producers" directory** (`https://www.americanhumane.org/what-we-do/certify-humane-treatment/farms/certified-farm-producers/`) was fetched directly and in full this pass (101 producer entries enumerated, A–Z, including the poultry/broiler category — e.g., Perdue Foods, Pilgrim's Pride, Cooper Farms, George's Inc., Ozark Mountain Poultry). **Foster Farms / Foster Poultry Farms does not appear anywhere on this current directory.** The featured-producer section of the parent "Farms" page also excludes Foster Farms (10 highlighted logos: Braswell, Butterball, Coleman Natural, Culver Duck, The Farmers Hen, George's, Herbruck's, Leidy's, Red Barn, Springer Mountain — no Foster Farms).
  - **Conclusion: this claim is DISPUTED, not a clean VERIFIED-current fact.** Historical certification (circa 2011–2021, at least "8 consecutive years") is well-documented and VERIFIED for that period — but the certifier's own current directory contradicts an ongoing/current claim as of this research date (2026-08-05). The most defensible framing for Stage 4 is: **"Foster Farms was American Humane Certified as of at least 2021 (8 consecutive annual audits); current certification status as of 2026 could not be confirmed and the certifier's own current directory does not list Foster Farms — treat as LAPSED/UNCONFIRMED-CURRENT, not as an active certification."** Do not present this as a present-tense "Foster Farms is certified" fact without that caveat.
  - Severity/scoring note: this changes the record from "has a real, active welfare certification (albeit a permissive one)" to "certification history is real but currency is unconfirmed/likely lapsed" — a materially different claim for scoring purposes.
- **Conflation risk with "Certified Humane" (Section 2):** the raw file already explicitly flags that American Humane Certified is a different program from Certified Humane / Humane Farm Animal Care, and that distinction is accurate and important. **Confirmed no ambiguous phrasing exists elsewhere in the raw file that would let the two names blur together** — Sections 2 and 3 are cleanly separated with explicit "separate certifier, NOT Certified Humane" labeling in the Section 3 header itself. Stage 4 should preserve this exact separation and, given the finding above, should NOT describe American Humane Certified as a currently-held certification without the lapsed/unconfirmed caveat.
  **FLAG on the scoping/permissiveness note: VERIFIED** (advocacy criticism of the standard's permissiveness is accurately described as advocacy framing, not adjudicated fact — correctly excluded from the record per the raw file's own note).

## 4. A Greener World / Animal Welfare Approved (agreenerworld.org)

- **NOT CHECKED** (403, no completed search). **FLAG: correctly labeled NOT CHECKED — not independently re-attempted this pass (low priority, no new information available); preserve as unresolved, do not record as absent.**

## 5. USDA Process Verified Program (PVP) — "No Antibiotics Ever" claim — PRIORITY, attempted direct re-verification

- **Fact:** Foster Farms holds active USDA AMS PVP certificates for NAE/NAIHM; certificate numbers PV6061JBA, PV5217WCA, PV6083LTA with the listed facilities/dates.
  **FACT-CHECK FLAG: STAYS UNVERIFIED at direct-primary-source level.** Independently re-attempted `https://www.ams.usda.gov/content/foster-farms-process-verified-program` directly this pass (WebFetch) — **403 Forbidden again**, confirming the researcher's finding rather than overturning it; also attempted via web.archive.org as a workaround — Wayback Machine fetch is blocked entirely in this environment, so no archived-snapshot route was available either. A follow-up web search this pass corroborated the *substance* (Kelso WA est. P6164A, Fresno CA est. P6137A/P7632, Livingston CA est. P6137; NAE + all-vegetarian-diet + NAIHM verified points) via the same class of secondary/search-snippet sourcing the researcher used — it did **not** independently confirm the specific certificate numbers PV6061JBA/PV5217WCA against a source this researcher directly read. **Net: UNVERIFIED stands, exactly as flagged.** Basis for the underlying "USDA PVP-audited NAE claim exists" substance: two independent secondary corroborations now on file (researcher's + this pass's), so treat the *existence* of PVP-audited NAE certification as well-corroborated-but-still-secondary, and the specific certificate numbers/dates as the weaker, single-sourced sub-claim.
  Note for Stage 4 process: `ams.usda.gov` and `fsis.usda.gov` appear to systematically block WebFetch (403) across multiple distinct pages and multiple independent fetch attempts (this researcher and this fact-checker both hit it, on different URLs) — this looks like a general bot-block on those domains in this environment, not a one-off failure. Future stages should not keep re-attempting direct WebFetch against these two domains; route through search-snippet corroboration and flag UNVERIFIED-primary by design.
- **Fact:** Foster Farms' own consumer blog explains its NAE claim.
  **FLAG: VERIFIED** (company disclosure, directly sourced, correctly labeled as corroborating not independently confirming).

## 6. Air-chilled vs. water-chilled (poultry)

- **FLAG: VERIFIED** for the SKU-specific air-chilled claims (company/retail listings). **UNVERIFIED / correctly-labeled-as-not-found** for any company-wide chilling-method claim — the raw file's own conclusion ("do not write 'Foster Farms is air-chilled' as a company-wide fact") is correct and should be preserved unchanged.

## 7. USDA-FSIS enforcement / recalls

### 2013–2014 Salmonella Heidelberg outbreak

- **Fact:** CDC page: 634 persons, 7 outbreak strains, 29 states + Puerto Rico, March 2013–July 2014, 38% hospitalized, no deaths, 77% of illnesses from California.
  **FACT-CHECK FLAG: VERIFIED — independently re-confirmed.** Re-fetched `archive.cdc.gov/www_cdc_gov/salmonella/heidelberg-10-13/index.html` directly this pass; figures match exactly ("A total of 634 persons infected with seven outbreak strains of Salmonella Heidelberg were reported from 29 states and Puerto Rico from March 1, 2013 to July 11, 2014," 38% hospitalized, no deaths). This is the anchor fact for Foster Farms' worst welfare-adjacent incident and it holds up cleanly against the existing `companies.js` `salmonella-outbreak-2013` entry. **Severity: high** (multistate outbreak, hundreds of illnesses, hospitalizations) — already reflected as an existing issues[] entry; no change needed.

- **Fact — FSIS Public Health Alert (2013-10-07) + NOIE for Livingston/Fresno plants + corrective action 2013-10-10, no recall/suspension.**
  **FLAG: PARTIALLY VERIFIED / PARTIALLY UNVERIFIED, as the researcher framed it — confirmed correct on independent re-check.** Re-attempted the FSIS Public Health Alert URL directly this pass (`fsis.usda.gov/recalls-alerts/fsis-issues-public-health-alert-chicken-products-produced-three-foster-farms`) — 403 Forbidden, same outcome as researcher's attempt, so this remains genuinely unreadable rather than merely unread. The Oct 7/Oct 10, 2013 dates are corroborated by the VERIFIED CDC page (Section above), so the *dates and "no suspension" outcome* are effectively VERIFIED-by-corroboration; the specific **NOIE** claim (the letter itself, and the "close within three days" threat) remains **UNVERIFIED** — sourced only to Food Safety News (secondary) and a corrupted-PDF primary that could not be read by either the researcher or this pass. Correct as flagged; no change.

- **Fact — January 2014 Livingston plant suspension, attributed to cockroaches not Salmonella.**
  **FLAG: NOT CHECKED at primary-document level, correctly labeled.** Not independently re-verified this pass (secondary/delauro.house.gov source still 403's); no new information found or needed — low priority relative to the outbreak/verdict facts.

- **Fact — March 2018 Arizona federal jury verdict, Craten v. Foster Poultry Farms: $6.5M gross verdict, Foster Farms found 30% at fault, 70% allocated to family food handling, net $1.95M.**
  **FACT-CHECK FLAG: VERIFIED — independently re-confirmed via a second, separate secondary-source search this pass** (Feedstuffs/Food Poisoning Bulletin corroborate Food Business News/Pritzker Hageman already cited): "$6.5 million" gross, "jury attributed 30% of the fault to Foster Farms and 70% to family members," "net verdict for the family was $1.95 million." Figures match exactly across 4 independent outlets now. Still UNVERIFIED at the literal court-docket-document level (no PACER/CourtListener opinion text was read directly by either pass — the docket's *existence and disposition* is confirmed via CourtListener per Section 9, but the dollar figures themselves rest on legal-news reporting, now well-corroborated).
  **Wording care for Stage 4 (as explicitly requested):** this is a **$6.5M gross jury verdict with Foster Farms apportioned 30% of fault** (net exposure ~$1.95M) — NOT a "$6.5M judgment against Foster Farms" and NOT a settlement. Write it as: *adjudicated jury verdict; Foster Farms found partially (30%) at fault; gross award $6.5M, net family recovery ~$1.95M.* Do not compress to "$6.5M verdict against Foster Farms" — that overstates Foster Farms' liability share.
  **Severity: medium.** This is a single adjudicated personal-injury verdict tied to an already-counted outbreak (not a fresh incident), with Foster Farms bearing a minority (30%) fault share and the gross figure ($6.5M) below the $10M 'high' threshold on either a gross or net basis. Do not double-count this as a second high-severity event alongside the 2013–2014 outbreak — it is the litigation tail of the same incident.

### 2017–2018 "repeated Salmonella outbreak pattern" — non-finding

- **FACT-CHECK FLAG: VERIFIED negative finding — independently re-confirmed.** Ran an independent, differently-worded search this pass ("Foster Farms" salmonella 2017 OR 2018 outbreak CDC) specifically hunting for a second, distinct outbreak. Every result found traces back to the same single 2013–2014 CDC outbreak (including intermediate case-count snapshots like "481 people/25 states" and "574 cases/27 states" reported at different points as the *same* outbreak grew before CDC's final 634/29-states count, plus a Jan 2014 premature "outbreak over" declaration that had to be revised). **No separate 2017 or 2018 CDC-documented outbreak exists.** The researcher's non-finding is correct and independently reproduced. Confirms this matters as stated: asserting a "repeated pattern (2013, 2017-18)" would have been a fabricated aggravating fact. Do not write it that way in Stage 4/5.

### Other FSIS recalls (2016, 2017, 2022)

- **FLAG: UNVERIFIED, correctly labeled (title/search-level only), not independently re-verified this pass** (fsis.gov confirmed to 403 WebFetch generally per Section 5 note above — consistent with why these weren't directly fetched). No reason to doubt the titles/tonnages as reported, but they remain single-source-per-recall at the title level. Low priority relative to the flagged priority items; leave as-is.
- **Fact — July 2014 recall, 1M+ lb fresh chicken, 9 Western states.**
  **FLAG: UNVERIFIED at FSIS-primary level, correctly labeled** — overlaps/is part of the VERIFIED 2013-2014 outbreak, not a separate incident. No change.

## 8. Welfare-adjacent litigation NOT visible on CourtListener (state/DC court)

All three suits independently re-searched this pass and confirmed to exist as described:

- **Leining v. Foster Poultry Farms, Inc. (and American Humane Association)** — LA County Superior Court, BC588004, filed 2015-07-13.
  **FACT-CHECK FLAG: VERIFIED, and status correctly hedged.** Independently re-confirmed via a fresh search this pass (Lexology, vLex, TopClassActions, in addition to the researcher's FindLaw/Bloomberg Law) — all agree on the case number, the "American Humane Certified" labeling theory, and the outcome. Additionally surfaced: the suit's factual trigger was the same **Mercy For Animals undercover video** (Bob Barker-narrated, shown publicly June 2015 at the Millennium Biltmore Hotel, filmed at two Fresno facilities) that also underlies the OCA "2018 USDA inspection records" allegation below — worth noting for Stage 4 as the common origin of both the dismissed 2015 suit and the still-pending 2024 OCA suit's undercover-footage allegations, though they are legally distinct claims/cases.
  **Status: adjudicated (dismissed on summary judgment / federal preemption).** Correctly NOT characterized as a ruling on whether the underlying welfare claims were true. No change. **Severity: low** (dismissed, no finding against the company on the merits).

- **Organic Consumers Association v. Foster Farms, LLC et al.** — DC Superior Court, filed 2024-04-10, "five freedoms" claims.
  **FACT-CHECK FLAG: VERIFIED procedurally, independently re-confirmed** (PRWeb release + Justia docket entry both re-surfaced this pass, matching the researcher's sources and dates exactly, including the D.D.C. remand docket 1:2024cv01703 and the 2025-03-26 remand). New detail found this pass: the complaint seeks **no monetary damages**, only injunctive relief (a declaration of DCPPA violation + an order to change marketing or practices) — worth adding to the record since it affects how "pending" this should read (not a damages exposure case).
  **Status: PENDING / ALLEGED — MUST STAY HEDGED, correctly not upgraded to VERIFIED fact anywhere in the raw file.** Re-confirmed no merits ruling exists as of this research date. **This is the one item where get-it-wrong risk is highest** (a live, high-profile suit): Stage 4 must render this as "Organic Consumers Association alleges..." / "a pending 2024 lawsuit alleges..." — never as "Foster Farms' chickens are confined to under 1 sq ft/bird" stated as established fact. **Severity: medium** (pending lawsuit; no damages sought, but "documented pattern with multiple sources" language in the complaint plus the earlier Leining suit's related undercover-video origin arguably supports 'medium' over 'low' — this is an allegation-severity judgment call for whoever builds issues[], not a fact-check finding).

- **Animal Legal Defense Fund v. Foster Poultry Farms** — Merced County Superior Court, filed 2020-09-02, water-use/slaughter-method suit.
  **FACT-CHECK FLAG: VERIFIED procedurally, independently re-confirmed with new detail.** This pass surfaced additional corroborating sources not in the raw file (Water Education Foundation press release, Yahoo News, Courthouse News, Climate Litigation Database) that were not read by the researcher. New detail: per the Water Education Foundation / ALDF release, **Foster Farms explicitly denies ALDF's allegations** as part of the settlement, and **agreed to "continue to work to improve water conservation and animal welfare"** at the Livingston plant going forward — this is slightly more concrete than "terms unknown" and should be added: the settlement is confirmed to include a forward-looking conservation/welfare commitment, even though specific numeric/binding terms remain non-public.
  **Status: CLOSED — settled, no admission of wrongdoing (correctly framed in raw file).** Severity: **low** (settled without adjudicated finding of wrongdoing, terms non-public, framed by plaintiff-advocacy org).

## 9. CourtListener federal docket review

**FLAG: VERIFIED as a process/completeness matter** — not independently re-run this pass (would require re-executing the same CourtListener query the researcher already completed and logged in `_wave2_primary.json`), but the researcher's own categorization of each of the 18 records (employment/civil-rights, personal-injury, commercial/bankruptcy/insurance/antitrust) is internally consistent with the case names, districts, and nature-of-suit codes shown, and the conclusion ("none... qualify as a class action, consumer-protection/false-advertising suit, or welfare-specific suit") is a reasonable read of that categorization. No red flags found. The discrepancy note (18 actual vs. 22 stated in the brief) is a valid, appropriately-flagged data-integrity catch — preserve it.

## 10. Existing `companies.js` record

No independent action needed — de-duplication note, not a new factual claim. Confirmed consistent with the VERIFIED CDC figures in Section 7.

## 11. Sourcing model

**FLAG: UNVERIFIED, correctly labeled** (multiple independent secondary sources agree, no single primary Foster-Farms-authored disclosure of the exact company-farm/contract-grower ratio). Not independently re-verified this pass — low priority, correctly hedged already. Classification as "contract-farms" mixed model is reasonable given the evidence; do not upgrade to VERIFIED.

---

## USDA AMS Packers & Stockyards settlement — PRIORITY item, materially advanced this pass

- Raw file left this as "title/existence only, content NOT CHECKED (403)... could be a real, undocumented enforcement action."
- **This pass:** re-attempted direct WebFetch of `ams.usda.gov/content/usda-settles-packers-and-stockyards-case-foster-farms-llc` — still 403 Forbidden (confirms the block is real/systematic, not a one-off). Pivoted to a targeted web search and was able to establish real substance:
  - **Fact:** USDA entered into a stipulation agreement with Foster Farms LLC (Livingston, CA) on 2025-11-25, resolving an alleged Packers and Stockyards Act violation; the AMS announcement was dated/published 2026-05-18. Foster Farms agreed to pay a **civil penalty of $1,600** and waived its right to a hearing. The underlying violation: USDA found Foster Farms **last submitted a required scale test report on 2024-10-10 but continued weighing poultry to determine sale prices throughout 2025** without a current scale-test report on file — i.e., a scale-certification/reporting-compliance lapse, not a fraud, price-manipulation, or animal-welfare finding.
    Source: search-engine synthesis of the AMS content page (title-matched, page itself still unreadable directly — same 403 pattern as elsewhere on this domain); not an independently-read primary document.
  - **FACT-CHECK FLAG: UNVERIFIED at primary-document level (AMS page still unreadable), but now substance-corroborated rather than a bare title.** This resolves the researcher's open concern: it is **not** a large or animal-welfare-relevant enforcement action — it's a **$1,600 scale-testing/reporting technicality**, well below any 'low'-severity threshold worth surfacing as an issues[] entry on its own. Recommend Stage 4 **downgrade this from "flag for follow-up, could be serious" to "checked, immaterial"** — do not omit it (per the instruction to keep it as "NOT CHECKED — [reason]" rather than dropped), but the correct status is now **"UNVERIFIED (secondary synthesis only) — substance confirmed immaterial: $1,600 civil penalty for a lapsed scale-test report, not a welfare or pricing-fraud matter."** Severity: **low** (a compliance-paperwork penalty, not disclosed-risk-relevant to sourcing/welfare scoring).

---

## Summary of coverage gaps for Stage 3/4 (updated)

1. A Greener World / AWA directory — still NOT CHECKED (403, not re-attempted this pass — low priority).
2. GAP Farms & Ranches directory (beyond Manufacturers page) — still NOT CHECKED.
3. USDA AMS PVP primary page content — still NOT CHECKED directly (403 confirmed again this pass); certificate numbers remain secondary/search-snippet sourced only. **Recommend Stage 4 treat `ams.usda.gov`/`fsis.usda.gov` as systematically WebFetch-blocked in this environment** rather than keep re-attempting.
4. USDA AMS Packers & Stockyards settlement — **RESOLVED THIS PASS to substance level** (see above): $1,600 civil penalty, scale-test reporting lapse, immaterial. No longer an open "could be serious" flag.
5. Primary FSIS NOIE document — still unreadable (403 confirmed again this pass via the alert page); NOIE claim rests on secondary sourcing only, corroborated in date/outcome by the VERIFIED CDC page.
6. Foster Farms' company-wide (vs. SKU-specific) chilling method — still NOT CHECKED, not re-attempted (low priority).
7. OCA v. Foster Farms underlying allegations — still ALLEGED only; case itself VERIFIED procedurally and confirmed PENDING with no merits ruling. New detail: relief sought is injunctive only, no damages.
8. ALDF v. Foster Poultry Farms settlement terms — still not fully public; new detail found this pass: settlement includes a forward-looking water-conservation/animal-welfare commitment (per ALDF/Water Education Foundation), with Foster Farms denying the underlying allegations.
9. **NEW finding this pass — American Humane Certified currency:** the raw file's Section 3 claim reads as a current, held certification. Independent verification found the certifier's own current, full "Certified Farm Producers" directory (101 entries, fetched directly and completely) does **not** list Foster Farms, and the most recent dated evidence of certification found anywhere is a February 2021 press release. **This should be treated as DISPUTED/lapsed-unconfirmed, not as an active current certification, going into Stage 4.**

---

## Flag distribution (this file)

- VERIFIED: 11 claims/clusters (Certified Humane absence x2, CDC outbreak, Craten verdict, 2017-18 non-finding, all three state-court suits' existence/procedural status, air-chilled SKU claims, PVP substance-existence-corroboration, GAP absence-on-one-page, FSIS alert dates-by-corroboration)
- UNVERIFIED: 8 claims/clusters (PVP certificate numbers, NOIE letter, Jan 2014 suspension cause, 2016/2017/2022 recall details, July 2014 recall FSIS-primary level, sourcing model ratio, P&S settlement primary document)
- DISPUTED: 1 (American Humane Certified — current status, historical cert VERIFIED but current directory contradicts ongoing-certification framing) — **new finding, not flagged as a risk by the researcher**
- NOT CHECKED (preserved, not re-attempted): 3 (AGW/AWA directory, GAP Farms & Ranches directory, company-wide chilling method)
- STALE: 0 strictly by the pre-2020 definition, but flag AHC's most-recent-dated evidence (Feb 2021) as a currency risk under the DISPUTED item above.
