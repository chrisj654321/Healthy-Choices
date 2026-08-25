# Wild Planet Foods — Stage 2 raw research

companyId: `wild-planet`
Category: premium canned tuna/seafood
Researched: 2026-07-30

Raw facts only. No characterization/scoring. VERIFIED = confirmed via primary
source. UNVERIFIED = news/secondary source only. NOT CHECKED = a directory
I could not actually query (never ABSENT unless a real search completed with
a genuine negative result).

---

## 1. Fishing method (primary founder question)

**Fact:** Wild Planet's own Tuna Procurement Policy page states the company
sources 100% of its tuna from pole & line, troll, or handline fisheries, and
explicitly states it does not buy long-line or purse-seine caught tuna.
Exact quote: "Wild Planet sources 100% of its tuna from pole & line, troll
or handline fisheries." / "Wild Planet Foods does not buy any long-line or
purse seine caught tuna."
- Source: Wild Planet Foods, "Tuna Procurement Policy"
- URL: https://wildplanetfoods.com/pages/tuna-procurement-policy
- Date accessed: 2026-07-30
- Status: **VERIFIED** (primary source — company's own procurement-policy
  page, fetched directly). Note per praise-rail rule: this is a
  company-disclosure claim about ITS OWN sourcing method, not yet
  cross-confirmed against an independent registry/observer program — treat
  as basis `company-disclosure` for the fishing-method claim itself, while
  the third-party rating below (§2) is the independent confirmation the
  founder asked for.

**Fact:** Same page states bycatch rate for pole & line and troll fishing is
"<0.5%."
- Source/URL/date: same as above.
- Status: **VERIFIED** as a company-stated figure (company-disclosure basis;
  not independently re-measured by me).

**Fact:** Sourcing breakdown by species (company-disclosed): Albacore —
"Over 90% of our albacore comes from Japan and the US," sourced from
North/South Pacific and North/South Atlantic. Skipjack — "Over 90% of our
skipjack comes from Japan," sourced from Pacific, Indian Ocean, Indonesian
and Maldivian fleets. Yellowfin — sourced from the South Atlantic Brazilian
handline fishery.
- Source: same Tuna Procurement Policy page.
- Status: **VERIFIED** as company disclosure (company-disclosure basis).

**Fact:** Wild Planet's Japanese skipjack sourcing region overlaps with a
real, independently MSC-certified fishery: the Japanese pole & line skipjack
and albacore tuna fishery (Tosakatsuo Suisan Group / Meiho Fishery, Miyagi
Prefecture) was the first skipjack fishery to earn MSC certification, in
2016. I could NOT confirm Wild Planet specifically buys FROM this certified
fishery (as opposed to other Japanese pole & line boats) — this is
regional/method context, not a brand-specific tie.
- Source: MSC Fisheries register, "Japanese pole and line skipjack and
  albacore tuna fishery"
- URL: https://fisheries.msc.org/en/fisheries/japanese-pole-and-line-skipjack-and-albacore-tuna-fishery/
- Date: 2026-07-30
- Status: **VERIFIED** (the fishery's MSC certification is a primary-source
  fact) but **NOT tied to Wild Planet's specific supply chain** — record
  separately, do not conflate.

## 2. Seafood Watch rating (primary founder question)

**Fact:** Seafood Watch (Monterey Bay Aquarium) rates pole-and-line and troll
caught albacore/skipjack tuna as its top consumer recommendation category;
Wild Planet's own procurement policy states "over 95% of our tuna" achieves
the Seafood Watch GREEN ("Best Choice") rating, with the remainder YELLOW.
- Source (company claim): Wild Planet Tuna Procurement Policy, same URL as
  above.
- Status of the company's % claim: **UNVERIFIED as a brand-specific
  percentage** — this figure comes from Wild Planet's own page, not from a
  Seafood Watch page I could independently load with matching numbers.
- Independent confirmation attempt: I tried to directly fetch Seafood
  Watch's own tuna guide pages
  (seafoodwatch.org/seafood-basics/sustainable-healthy-fish/nutritious-albacore-tuna,
  which redirects to montereybayaquarium.org) and the fetch returned only
  page-navigation boilerplate, not the ratings table — the content did not
  load through WebFetch. Status: **NOT CHECKED** — Seafood Watch's own
  rating page could not actually be queried (tooling limitation, not a
  completed negative search).
- General/method-level confirmation that IS verified: multiple independent
  sources (not just Wild Planet) state Seafood Watch, Greenpeace, and
  FishWise treat pole & line and troll caught tuna as the top-tier
  sustainability catch method, distinct from longline/purse-seine. This is
  method-level, not a Wild-Planet-specific rating pull.
  - Source: Monterey Bay Aquarium Seafood Watch consumer tuna guide listing
    (search-result summary; page itself did not load for direct quote).
  - URL: https://www.seafoodwatch.org/recommendations/download-consumer-guides/sustainable-tuna-guide
  - Status: **UNVERIFIED** (could not load the primary page directly;
    relying on search-engine summary of it, which is a step removed from
    the primary source).

## 3. MSC certification

**Fact:** Wild Planet does NOT hold MSC certification, and states this is a
deliberate choice, not an oversight or a failed application. Exact quote
from the company's own procurement policy: Wild Planet "intentionally
declines MSC certification, believing it would lower standards by permitting
less sustainable methods" [WebFetch tool's paraphrase of the page's stated
position — flagging that this is a paraphrase, not a verbatim quote, so
treat the reasoning language as approximate].
- Source: Wild Planet Foods, Tuna Procurement Policy.
- URL: https://wildplanetfoods.com/pages/tuna-procurement-policy
- Status: **VERIFIED** that Wild Planet is NOT MSC-certified (checked
  against the MSC fisheries/company search via WebSearch, which returned no
  Wild Planet Foods brand listing) — this is a genuine "does not hold this
  certification" finding, not a NOT-CHECKED gap. The company's own STATED
  REASON for declining is company-disclosure only.

## 4. B Corp certification

**Founder's brief described Wild Planet as "B Corp" — I could NOT confirm
this.** Multiple WebSearch queries for "Wild Planet Foods" + B Corp /
Certified B Corporation / bcorporation.net returned no matching B Lab
directory listing; the only "Wild"-named companies that appeared in
bcorporation.net results were unrelated businesses (The Wild Foods — a
Chilean food company; Wild Nutrition Ltd; Planet Wild GmbH — a climate
nonprofit). I attempted to directly query the B Lab directory
(bcorporation.net/en-us/find-a-b-corp) — it returned HTTP 403 Forbidden to
WebFetch, consistent with SKILL.md's note that certification directories are
interactive JS search UIs that defeat direct fetching.
- Status: **NOT CHECKED** for a definitive directory answer (the directory
  itself could not be queried), but **the surrounding web search evidence
  leans toward "no confirmed B Corp listing found."** This directly
  contradicts the task brief's framing — flag to the founder before this
  becomes a written claim anywhere downstream.

## 5. Ownership (context, not in founder's numbered questions but material)

**Fact:** Wild Planet Foods was acquired by Bolton Group (an Italian
privately-held conglomerate) on approximately August 22, 2021. Wild Planet
was founded in 2004 by Bill Carvalho, who continued to lead the company
post-acquisition per reporting. Terms not disclosed. This followed Bolton
Group's 2019 acquisition of Tri Marine, a tuna supply company.
- Sources (multiple corroborating secondary reports):
  - https://www.esmmagazine.com/supply-chain/bolton-group-acquires-wild-planet-foods-144802
  - https://www.seafoodsource.com/news/business-finance/bolton-group-strengthens-sustainable-tuna-supply-after-wild-planet-purchase
  - https://www.bolton.com/our-company/news/bolton-acquires-wild-planet-foods (Bolton's own press page — closer to primary)
- Date: acquisition reported 2021-08-22 to 2021-08-30 across sources (minor
  date variance between "announced" and "closed").
- Status: **UNVERIFIED** as VERIFIED-tier (multiple converging news sources
  plus the acquirer's own press page, but I did not load Bolton's press
  release PDF directly to confirm verbatim) — high-confidence but not
  primary-document-verified.
- **Note for downstream stages:** "privately held" (per the task brief) is
  still technically accurate — Bolton Group is itself privately held — but
  Wild Planet is no longer an independent company; it's a subsidiary of a
  larger seafood/consumer-goods conglomerate. This nuance matters for any
  "who owns this" framing.

## 6. Litigation (CourtListener, via Stage 1 primary-source script)

**Fact:** Two related federal class actions — Soto v. Wild Planet Foods,
Inc. (N.D. Cal., 5:15-cv-05082, filed 2015-11-05, terminated 2017-11-27) and
Shihad v. Wild Planet Foods, Inc. (N.D. Cal., 5:16-cv-01478, filed
2016-03-25, terminated 2017-05-12) — alleged Wild Planet (and its
Sustainable Seas brand) underfilled tuna cans by roughly 30% below the
federally mandated 5-oz minimum weight, based on NOAA testing cited in the
complaints. Claims: breach of warranty, fraud, negligent misrepresentation,
California UCL/FAL violations. The cases were consolidated and settled for
a combined $1.7 million fund.
- Source: CourtListener dockets (Stage 1 primary-pull script output).
  - https://www.courtlistener.com/docket/4620259/soto-v-wild-planet-foods-inc/
  - https://www.courtlistener.com/docket/4182689/shihad-v-wild-planet-foods-inc/
- Corroborating secondary reporting on the underfilling allegation and
  settlement amount:
  - https://topclassactions.com/lawsuit-settlements/lawsuit-news/wild-planet-settles-underfilled-tuna-class-actions-1-7m/
  - https://www.foodprocessing.com/home/news/11315960/wild-planet-foods-reaches-17-million-settlement-in-underfilled-tuna-suit
- Status: **VERIFIED** for docket existence, filing date, and
  dateTerminated (primary CourtListener data via Stage 1 script — resolved,
  not pending). **UNVERIFIED** for the specific $1.7M settlement figure and
  the "30% underfilled" detail (these come from secondary legal-news
  reporting, not a court order I loaded directly).
- **Note:** This is a fill-weight/consumer-protection matter, NOT a
  fishing-method or animal-welfare claim — it does not bear on the
  pole-and-line sourcing question, but it is a real, resolved legal finding
  about label/product accuracy and belongs in the record.
- Other Wild Planet hits in the CourtListener batch pull (AW Liquidation
  bankruptcy proceeding, ADI Liquidation) are creditor/bankruptcy-adjacent
  matters, not welfare or sourcing litigation — noted but not treated as
  substantive findings here.

## 7. FDA recalls

Searched directly for "Wild Planet" tuna/sardine FDA recalls. Found no FDA
recall specifically naming Wild Planet Foods. Only tangential and unrelated
results appeared (a Tri-Union Seafoods/Genova/Van Camp's/H-E-B/Trader Joe's
recall for a different reason; independent ConsumerLab.com mercury/heavy-
metal testing of various tuna brands including Wild Planet, which is
lab-testing commentary, not an FDA recall).
- Status: **NOT ABSENT-CONFIRMED** in the strict sense (I did not query
  FDA's recall database directly by company name — I used WebSearch only).
  Mark as **NOT CHECKED against FDA's own recall database directly**;
  WebSearch turned up no matching recall.

## 8. Certification directories not queryable directly

Per SKILL.md, these are "interactive JS search UIs with no API" and could
not be driven by WebFetch/WebSearch in a way that returns authoritative
per-brand results:
- MSC track-a-fishery / company search — WebSearch used as fallback; no
  Wild Planet Foods brand-level MSC listing found (consistent with §3
  above, where the company itself says it declines MSC).
- B Corp / bcorporation.net — see §4, 403'd on direct fetch.

---

## Summary of open items for Stage 3 fact-check

1. Confirm the Seafood Watch GREEN-rating percentage (95%+) against Seafood
   Watch's own published guide — my direct fetch attempts returned only
   page navigation shells, not the ratings content.
2. Resolve the B Corp discrepancy — founder's brief assumed B Corp status;
   my research found no confirming listing. Needs either a working directory
   query or founder clarification of the source of that assumption.
3. Confirm the $1.7M settlement figure and 30%-underfill detail against a
   primary court document (settlement order), not just legal-news sites.
