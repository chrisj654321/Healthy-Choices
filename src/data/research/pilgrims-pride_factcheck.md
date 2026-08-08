# Pilgrim's Pride Corporation — Fact-Check Checkpoint (Agent 2)

Independent fact-check of `pilgrims-pride_raw.md`. I am a separate instance from
Agent 1 (Researcher) — I did not trust their framing and re-attempted primary-source
fetches myself. Annotations only; nothing in the raw file was rewritten.

**Fetch environment note:** Like Agent 1, my direct WebFetch attempts to DOJ.gov,
CourtListener, SEC.gov, OSHA.gov, and the PSU-hosted judgment PDF were **blocked**
(HTTP 403/401, or connection reset) on every attempt, across multiple tries. Two
primary-source fetches DID succeed directly: **warren.senate.gov** (Sen. Warren's
official press release) and **fec.gov** (FEC committee page). Everything else below
is corroborated via WebSearch synthesis of multiple independent secondary sources,
not a direct primary-source open — flagged UNVERIFIED per doctrine's strict rule,
with corroboration strength noted explicitly so Agent 3 can weigh it.

Flags used: **VERIFIED** / **UNVERIFIED** / **DISPUTED** / **STALE**.

---

## 1. Basic company facts

- HQ address (Greeley, CO) — **UNVERIFIED**. Low-risk, single secondary source (centralguide.net), not independently re-checked this pass. No reason to doubt it but no primary confirmation either.
- Revenue ~$18.5B FY2025, employees ~62,200–63,000 — **UNVERIFIED**. Not re-fetched this pass (SEC 8-K exhibit URL cited by Agent 1 returned 403 for me too). Two independent secondary figures (GlobeNewswire release, stockanalysis.com) roughly agree, which is mild corroboration but neither is a direct primary open.

---

## 2. JBS ownership

- **JBS ownership ~82.42% (2025 proxy) / ~83% (rounded 2026 coverage)** — **UNVERIFIED**, but corroborated: independently re-searched and found the 82.42% figure repeated consistently (Quartr proxy-filing summary, MatrixBCG "Who Owns" aggregator) without contradiction. I did not open PPC's actual proxy statement (DEF 14A) or the JBS N.V. 6-K directly — same gap Agent 1 flagged. Multiple independent secondary sources agree on 82.42%, which is meaningfully stronger than a single source, but this is still not a primary-document open. **Recommend**: if Agent 3 needs an exact current %, cite as "approximately 82–83% per company proxy filings" rather than a single decimal, given no source here is a confirmed direct primary open.
- **JBS take-private bid history (Aug 2021 offer, raised Nov 2021, withdrawn Feb 17 2022)** — **UNVERIFIED** (trade-press only, MEAT+POULTRY; not re-verified this pass, no contradicting source found either).
- **JBS parent-company legal history (J&F FCPA plea $256M+, Batista personal pleas, JBS beef price-fixing $25M)** — confirmed as **clearly scoped to JBS/J&F, not Pilgrim's Pride**, in the raw doc's own framing (explicit disclaimers in Section 2). This scoping is correct and should be preserved as-is by Agent 3 — do not let any of this migrate into PPC's own issues[] entries. Flag on the underlying JBS figures themselves: **UNVERIFIED** (not re-fetched — DOJ EDNY and SEC press releases not independently re-opened this pass), but low risk since they are explicitly NOT proposed as Pilgrim's Pride facts.

---

## 3. CRIMINAL antitrust conviction (the headline fact) — scrutinized hardest per brief

**Core facts: case number, fine amount, plea date, sentencing date.**

- Case No. **1:20-cr-00330-RM**, D. Colorado — **UNVERIFIED** by direct fetch (CourtListener docket page and DOJ case-document URL both returned 403 on repeated attempts, from two separate agent instances now). HOWEVER: a WebSearch query targeting this exact case number returned a synthesis pulling from the *indexed content of the CourtListener docket itself* (not just news coverage), which independently states: case filed **Oct 13, 2020**, terminated **Feb 23, 2021**, judgment entered **March 23, 2021**, fine **$107,923,572.00**, special assessment **$400.00**, Judge **Raymond P. Moore**, guilty plea to Count 1 of the Information (price-fixing/bid-rigging conspiracy "ended in January 2019"). This matches Agent 1's figures exactly and adds one new granular detail (judgment *entered* a month after the sentencing hearing — normal court procedure, not a discrepancy).
- Fine amount **$107,923,572.00** — **UNVERIFIED** by direct primary fetch, but corroborated by an unusually strong convergence: the CourtListener docket-snippet above, plus **7 independent secondary sources** found via fresh search (avinews, Food Dive, Feedstuffs, Talk Business & Politics, Food Manufacturing, IndustryWeek, Faruqi & Faruqi) all independently reporting the identical figure ($107,923,572 / "$107.9M," rounded elsewhere to "$108M"). Per the task brief's own standard, this level of independent multi-source agreement is meaningfully stronger than a typical single-source UNVERIFIED claim. **Recommend Agent 3 treat this as functionally reliable** even though it does not meet the strict "direct primary open" bar for a formal VERIFIED flag — or make one more direct-fetch attempt before writing final copy.
- Original agreed figure $110,524,140 vs. final court-assessed $107,923,572 — **UNVERIFIED**, same corroboration pattern as above (repeated across the same convergent set of sources). No contradiction found.
- Plea agreement announced **Oct 13/14, 2020**; sentencing **Feb 23, 2021** before Judge Raymond P. Moore — **UNVERIFIED** by direct fetch, but same strong multi-source convergence as above.
- **"First company to plead guilty" superlative** — scrutinized specifically per the brief. **UNVERIFIED**: found repeated in secondary coverage (avinews, Food Dive both independently state Pilgrim's was "the first company to plead guilty" in the DOJ's broiler-chicken investigation) but I could not independently open the DOJ press release itself to confirm DOJ used this exact framing. No contradicting source found (no other company reports an earlier guilty plea in this same investigation). Recommend hedging attribution: "according to DOJ" / "press reports describe Pilgrim's as the first..." rather than a bare superlative, since the underlying DOJ language wasn't independently confirmed.
- Scope of affected commerce ($361M) — **UNVERIFIED**, not independently re-checked this pass; no contradiction found.

**Severity if used:** `high` — criminal conviction, and the fine ($107.9M) independently clears the >$10M adjudicated-fine threshold. This is `high` regardless of the VERIFIED/UNVERIFIED sourcing flag; the flag governs *how it must be worded* (hedged vs. direct), not its severity classification.

---

## 4. CIVIL settlements — broiler chicken MDL

- **$75M DPP settlement, announced Jan 11, 2021** — **UNVERIFIED** (SEC 8-K URL 403'd for me too; MEAT+POULTRY secondary source not re-confirmed independently, though no contradiction found).
- **$195.5M "three certified classes" aggregate vs. $75M DPP overlap question** — **RESOLVED, with correction to Agent 1's flag.** Fresh search of case-tracking sources (Cohen Milstein case study — plaintiffs' firm involved in the MDL, and classaction.org) indicates the three certified classes referenced in the $195.5M aggregate are **End-User Consumer, Commercial/Institutional Indirect Purchaser, and Direct Purchaser Plaintiff (DPP)** — i.e., the $75M DPP figure is almost certainly a **component of**, not additional to, the $195.5M aggregate. Separately, the End-User Consumer class settled for $181M in total but **across six defendants jointly** (Tyson, Fieldale, Peco, George's, Pilgrim's, Mar-Jac) — so Pilgrim's own share of that $181M is a fraction, not the full $181M. **This is still UNVERIFIED** (no primary settlement-approval order opened directly), but the practical guidance for Agent 3 is: **do not add $75M + $195.5M together** — treat $195.5M as Pilgrim's-Pride-specific total across the three purchaser classes (DPP included), and the $100M grower settlement below as a genuinely separate, additive track (different plaintiffs, different case theory).
- **$100M grower settlement, June 24, 2024** — **UNVERIFIED** (Food Dive is an independent trade-press outlet, not a party to the case, which is somewhat stronger than an advocacy or plaintiffs'-counsel source, but still not a primary court order). No contradicting source found; "largest protein-industry antitrust settlement of its kind" is Food Dive's own characterization, not confirmed independently — treat as the outlet's characterization if quoted, not as flat fact.
- **Wage-fixing MDL gap** — Agent 1 correctly did NOT fabricate a Pilgrim's-specific figure here. Confirmed as a genuine unresolved gap, not a finding. No flag needed — nothing to annotate since no claim was made.

**Severity if used:** `high` for both the $195.5M purchaser-class aggregate and the $100M grower settlement (each clears >$10M settled-lawsuit threshold).

---

## 5. Individual executive outcomes

- **First trial group — Lovette, Penn, Austin, plus Claxton's Fries and Brady — acquitted July 7, 2022, jury in Denver, third trial after two mistrials (Dec 2021, March 2022)** — **UNVERIFIED** by direct primary fetch, but very strongly corroborated: independently found via Lawdragon (counsel's own press release for defendant Roger Austin — a party-adjacent but factually reliable source for outcome/date), the Skadden client memo PDF, CBS News, and Competition Policy International, all agreeing on the July 7, 2022 acquittal date and the five-defendant, third-trial framing. **One correction/addition to note**: independent sources identify the presiding judge for this trial as **Chief Judge Philip A. Brimmer** — the raw doc doesn't name a judge for this trial (only names Judge Moore, who handled the *corporate* sentencing, a different proceeding). Not a contradiction, just a gap Agent 3 could fill if citing the trial specifically.
- **Second indictment group — McGuire, Stiller, Tucker, Gay — charges dismissed (Gay/Tucker Aug 11, 2022; McGuire/Stiller Oct 17, 2022)** — **UNVERIFIED** by direct fetch, but strongly corroborated by multiple independent sources (MEAT+POULTRY, DTN/Progressive Farmer, Agri-Pulse, Law Week Colorado, and a defense-counsel firm's own case write-up) all agreeing on both dismissal dates and the four names. Additional detail found independently: presiding **U.S. District Judge Daniel D. Domenico** dismissed on evidentiary grounds, stating the government's evidence showed only "the faintest whiffs of an agreement to fix prices" — this is a useful, well-corroborated detail if Agent 3 wants a concrete reason for dismissal rather than a bare statement that charges were dropped.
- **Net result — no individual convicted despite the corporate guilty plea** — this is a valid synthesis of the two outcomes above, not an independent claim requiring its own primary source. No contradiction found anywhere in this pass.

**Severity if used:** `medium` — these are case-outcome facts (acquittal/dismissal), not fines or convictions themselves; they contextualize the `high`-severity corporate conviction above but aren't independently a high-severity issue in their own right.

---

## 6. Shareholder securities-fraud settlement

- **$41.5M settlement, final approval June 17, 2025, Judge R. Brooke Jackson** — **UNVERIFIED** by direct fetch (Courthouse News 403'd for me too), but corroborated by **two independent non-party sources** (Courthouse News and Law360) in addition to the plaintiffs'-counsel press release Agent 1 already flagged as party-interested. Two independent journalism outlets agreeing is meaningfully stronger than the single party-interested source alone. No contradiction found. Confirmed distinct from the antitrust cases — correct case name and class-period framing (Feb 2014–Nov 2016) not disputed by anything found this pass.

**Severity if used:** `high` — settled lawsuit >$10M.

---

## 7. Trump-Vance Inaugural Committee donation

- **$5 million donation, "single largest donor" claim, letter dated May 19, 2025** — **VERIFIED**. I directly fetched Sen. Warren's official press release (warren.senate.gov) — this succeeded where every other primary-source fetch failed. It independently confirms: $5M amount, the "single largest donation" characterization (exceeding combined Apple/Amazon/Meta/Google CEO contributions), and the May 19, 2025 letter date.
- **Warren's specific allegations** — **VERIFIED as to what Warren said** (directly confirmed via her own press release), but the allegations themselves remain **unadjudicated opinion/suspicion, not fact** — this must stay hedged exactly as Agent 1 flagged. One correction: the raw doc's Section 7 characterizes Warren's concern as being about JBS's SEC-approved dual listing only. My direct fetch shows Warren's letter actually cites **three** specific administration actions she connects to the donation's timing: (1) SEC approval for JBS's NYSE listing, (2) DOJ's suspension of FCPA enforcement (relevant given JBS's prior FCPA violation), and (3) a USDA waiver of workplace-safety requirements for poultry/pork producers. Agent 3 should use the fuller three-part framing if citing Warren's allegation, still fully hedged as her stated suspicion, not an adjudicated finding, and per doctrine's causation-by-juxtaposition rule — do not imply the donation caused any of these three actions.

**Severity if used:** `low` — this is a disclosed donation (not itself wrongdoing) plus a single senator's unadjudicated suspicion; per doctrine this is exactly the "single-source advocacy/political concern" category, not medium or high, and must be worded as allegation only.

---

## 8. Lobbying spend and PAC donations

- **PAC status** — **VERIFIED** (direct FEC.gov fetch succeeded). Pilgrim's Pride Corporation PAC (C00113902) is confirmed **terminated**. However, my direct FEC.gov fetch shows the **most recent activity on file is the 2011–2012 cycle, with $0 raised/spent/cash-on-hand** — FEC.gov's own committee page shows **no 2024-cycle data at all** for this committee.
- **"$370 in 2024-cycle contributions" (OpenSecrets snippet)** — **DISPUTED**. This is a direct conflict: Agent 1's OpenSecrets-snippet figure claims $370 in 2024-cycle PAC contributions, but my direct primary-source fetch of FEC.gov (the underlying disclosure system OpenSecrets itself sources from) shows no 2024-cycle filings for this committee at all, consistent with a PAC that's been terminated since well before 2024. Recommend Agent 3 **not use the $370 figure** — the primary source contradicts it.
- **Lobbying "$0 in 2024" / "$0 in 2010" claims** — **UNVERIFIED** (OpenSecrets still 403'd for me too). No contradiction found, but not independently confirmed either.
- **Recommendation for `lobbyingSpend` / `politicalDonations` fields**: Agent 1's recommendation to use `null` (not `0`) is **reinforced, not weakened**, by this pass — the one figure I could independently check (PAC 2024 activity) turned out to be disputed rather than confirmed. Do not write `0` for either field.

**Severity if used:** N/A (data fields, not an issues[] entry) — but the DISPUTED $370 figure should not appear anywhere in final copy.

---

## 9. OSHA / workplace-safety enforcement

- **Canton, GA ammonia leak, Jan 19, 2022 — 9 serious citations, $110,630 proposed fine** — **UNVERIFIED** by direct fetch (osha.gov 403'd), but corroborated by an unusually large independent set: Bloomberg Law, Powder & Bulk Solids (two separate articles), Supermarket Perimeter, Food Manufacturing, Occupational Health & Safety, and WATTPoultry — seven independent outlets, all citing the identical $110,630 figure, 9 serious citations, and Jan 19, 2022 date, with the osha.gov press-release URL cited consistently as their common source. This is about as strong as secondary corroboration gets. No contradiction found.
- **Waco, TX ($122,500, 2016) and Live Oak, FL ($78,175, 2016) OSHA fines** — **UNVERIFIED**, not independently re-checked this pass; no contradiction found either.

**Severity if used:** `medium` each — OSHA citations/fines under $10M, documented pattern.

---

## 10. EPA / Clean Water Act — Suwannee River

- **$1.43M settlement (Nov 2017): $1.3M Sustainable Farming Fund + $130,000 civil penalty** — **UNVERIFIED** by direct fetch, but corroborated beyond Agent 1's advocacy-group source: independently found **Law360** (independent legal-news outlet, not a party to the case) reporting the same $1.4M figure and settlement structure, plus the presiding judge's name — **U.S. District Judge Timothy J. Corrigan** — which Agent 1's version didn't include. Having an independent non-advocacy source (Law360) corroborate the advocacy group's numbers meaningfully upgrades confidence here versus a single-source advocacy claim.
- **"1,377 days of violations," "largest CWA citizen-suit penalty in FL history" characterization** — **UNVERIFIED**, and per Agent 1's own correct flag, the "largest in Florida history" claim remains the plaintiff groups' own characterization — should not be stated as objective fact, only attributed ("environmental groups characterized this as...").

**Severity if used:** `medium` — settlement under $10M, but well-documented multi-source pattern (citizen suit + independent legal press corroboration).

---

## 11. USDA-FSIS recalls

- **April 2016 recall, ~40,780 lbs, chicken nugget/patty products, plastic contamination** — **spot-checked and UPGRADED to closer-to-VERIFIED**: fsis.usda.gov itself appeared directly in search results as an indexed source (not just a URL reference, actual FSIS.gov content), confirming: April 7, 2016 recall date, Waco, TX establishment, 40,780 lbs, GOLD KIST FARMS-labeled fully cooked chicken nugget/patty products, plastic contamination, discovered via consumer complaints. Still not a direct WebFetch open (I did not personally load fsis.usda.gov this pass, this is a search synthesis of its content), so formally **UNVERIFIED**, but this is about as close to primary-source content as a search snippet gets, and it is a government website's own content, not press interpretation. **New detail not in raw doc**: this recall was **expanded multiple times through May 2016**, reaching a combined **5,550,904 lbs** — significantly larger in its final scope than the initial 40,780 lbs figure. Agent 3 should use the initial 40,780 lbs figure only if specifically describing the original April 7 notice; if characterizing the full incident, the ~5.55M lbs expanded total is more accurate and should be sourced/dated separately.
- **2018, 2019, 2020 recalls (rubber contamination)** — **UNVERIFIED**, not independently re-checked this pass; no contradiction found.

**Severity if used:** `low` each — recalls are disclosed/routine FSIS actions, not adjudicated fines; the "recurring pattern" framing (already correctly caveated by Agent 1 as industry-wide, not unique to Pilgrim's) should stay soft.

---

## 12. Subsidiaries / brands — 13. SEC 10-K — 14. Sustainability score

No independent re-verification attempted this pass; low-risk (brand names) or explicitly-flagged-as-gap (10-K, sustainability score) items where Agent 1 already correctly declined to fabricate. No new flags.

---

## Summary table

| Claim | Flag | Corroboration strength |
|---|---|---|
| Case No. 1:20-cr-00330-RM, fine $107,923,572, plea Oct 2020, sentencing Feb 23 2021 | UNVERIFIED | Very strong — docket-snippet + 7 independent secondary sources, all matching |
| "First company to plead guilty" | UNVERIFIED | Moderate — 2 sources, no direct DOJ language confirmed |
| Lovette/Penn/Austin acquittal July 7 2022 | UNVERIFIED | Very strong — 4+ independent sources, consistent |
| McGuire/Stiller/Tucker/Gay dismissals Aug/Oct 2022 | UNVERIFIED | Very strong — 5+ independent sources, consistent |
| $75M DPP + $195.5M three-class aggregate (DPP included, not additive) | UNVERIFIED | Moderate — resolves Agent 1's flagged ambiguity |
| $100M grower settlement (2024) | UNVERIFIED | Moderate — 1 independent trade-press source |
| $41.5M shareholder settlement | UNVERIFIED | Strong — 2 independent journalism sources |
| JBS ownership ~82.42% | UNVERIFIED | Moderate — 2 sources agree, no primary doc opened |
| $5M inaugural donation, largest-donor claim, May 19 2025 letter | **VERIFIED** | Direct primary fetch (warren.senate.gov) |
| Warren's specific allegations (3-part, not 1-part as drafted) | **VERIFIED as to what Warren said**; allegation itself stays hedged | Direct primary fetch |
| PAC terminated status | **VERIFIED** | Direct primary fetch (fec.gov) |
| "$370 in 2024-cycle PAC contributions" | **DISPUTED** | FEC.gov shows no 2024 data; contradicts OpenSecrets snippet |
| OSHA Canton GA $110,630 fine | UNVERIFIED | Very strong — 7 independent sources |
| CWA Suwannee River $1.43M settlement | UNVERIFIED | Strong — independent Law360 corroboration added |
| FSIS April 2016 recall, 40,780 lbs | UNVERIFIED | Strong — FSIS.gov content itself indexed; note final scope grew to 5.55M lbs |

**No STALE flags assigned** — all claims scrutinized concern events from 2015 onward, and the ones that matter most for `issues[]` (criminal conviction, civil settlements, 2025 donation) are recent.

**No claims found to be fabricated or contradicted by evidence**, except the OpenSecrets-sourced "$370 in 2024" PAC figure, which is DISPUTED against a directly-fetched FEC.gov primary source.
