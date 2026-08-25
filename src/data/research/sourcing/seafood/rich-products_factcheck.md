# Rich Products Corporation (SeaPak) — Stage 3 fact-check

companyId: `rich-products`
Fact-checked: 2026-07-30 (independent pass — I re-fetched primary sources
directly rather than trusting the researcher's summaries; see status per
claim below)

Flags per /political-analysis: VERIFIED / UNVERIFIED / DISPUTED / STALE.
"Absent" vs "not checked" per SKILL.md — never collapsed.

---

## 1. Farmed vs. wild-caught split, and shrimp = farmed line

**Raw claim:** SeaPak carries both farmed and wild-caught seafood; shrimp is
the farmed line, salmon is the wild-caught line.

**Verdict: UPHELD — VERIFIED (company-disclosure basis).** I re-fetched
seapak.com/sustainability/ directly. It confirms the wild-caught line is
governed by MSC/ASC/RFM certification (see §4 below) and shrimp is treated
as the aquaculture/farmed line under BAP. This is company disclosure, not
independently audited that shrimp is 100% farmed with zero wild-caught SKUs,
but it is a clean, consistent statement from the primary page, not a
paraphrase error. Basis stays `company-disclosure`.

## 2. Geography — "processed in Ecuador/Thailand" vs. "farmed in Ecuador/Thailand"

**Raw claim:** SeaPak states ~80% of products processed in Brownsville, TX,
~20% in Ecuador and Thailand — but this is PROCESSING location, not
confirmed FARMING/growing location.

**Verdict: UPHELD — this is the single most important catch in the raw
file and I confirmed it independently.** I re-fetched the live page myself
and got the identical language: "80% of our shrimp products are processed
in Brownsville, TX. The remaining 20% ... produced in two other countries —
Ecuador and Thailand." The page does NOT state where the live shrimp were
farmed/grown before processing. **This is exactly the ambiguity the founder
flagged as the priority risk, and the raw researcher was right not to
collapse "processed in" into "farmed in."** I could not find any SeaPak or
Rich Products source — company page, press release, or trade coverage —
that names a farming/grow-out country distinct from the processing country.
**Status: NOT CHECKED for a farming-country-specific source (a genuine gap,
not an absence) — record `sourcing.model` sourcing-country field as
`unknown` with this ambiguity noted, not as "farmed in Ecuador/Thailand."**
Any downstream copy must say "processed in," never "farmed in," until a
farming-specific source surfaces.

**Vietnam/India:** UPHELD as NOT CHECKED (no brand-specific evidence either
way; not a completed negative search, correctly not written as absence).

## 3. Farming system (open-pond vs. closed-containment/RAS)

**Raw claim:** No SeaPak/Rich Products disclosure found specifying pond vs.
RAS system for shrimp suppliers; only category-level Thailand RAS-adoption
context found (not brand-specific).

**Verdict: UPHELD.** I did not find a SeaPak-specific farming-system
disclosure either. **This must be written as `unknown` with an explicit
"the specific farming system used by SeaPak's suppliers is not publicly
disclosed" note — the Global Seafood Alliance category-level RAS-adoption
article must NOT be cited as if it describes SeaPak's actual suppliers.**
This is the exact failure mode the founder warned about (assuming
category norms) and the raw file correctly avoided it. Flag as a genuine
finding worth stating plainly: **SeaPak's own sustainability marketing
tells you the certification tier and the countries products move through,
but not the pond-vs-closed-containment method — a real disclosure gap, not
neutral.**

## 4. Seafood Watch rating — does NOT apply to SeaPak specifically

**Raw claim:** Thailand farmed shrimp reportedly upgraded from RED to
YELLOW ("Good Alternative"), ~95% of Thai shrimp production, criteria
counts conflicting between sources (9 yellow/1 red vs. 7 yellow/2 green).
Ecuador whiteleg shrimp reportedly rated "Good Alternative" broadly. Neither
tied to SeaPak's specific suppliers — country-level only.

**Verdict: UPHELD, with the criteria-count conflict resolved and the
brand-vs-country distinction confirmed as correct and important.**
Independent WebSearch (I could not get seafoodwatch.org's PDF/HTML content
to load directly either — same tooling wall the researcher hit) converged
on: Thailand farmed shrimp = YELLOW/"Good Alternative," ~95% of Thai
production, **nine yellow criteria and one red criterion** (this is the
figure that recurred across independent sources — Global Seafood Alliance,
The Fish Site, Thai Union's own press release citing the rating; the "7
yellow/2 green" figure the researcher also saw did not recur and looks like
a misread of a different/older assessment). Ecuador whiteleg shrimp:
semi-intensive pond production scored ~4.02/10, YELLOW, one red criterion
(chemicals), "Good Alternative" — also converged across independent
sources. **Both ratings remain UNVERIFIED at VERIFIED-tier** — I still
could not load seafoodwatch.org's own report pages directly (404 on the
recommendation page, empty shell on the PDF fetch); this is corroborated
secondary sourcing, not a primary-document pull.

**Critical: neither rating is SeaPak-specific, and the raw file was right
to refuse to collapse country rating into brand rating.** Given SeaPak
will not confirm a farming country distinct from its Ecuador/Thailand
*processing* countries (§2), **the chain "Seafood Watch rates Thai/Ecuador
shrimp YELLOW → therefore SeaPak's shrimp rates YELLOW" is two unverified
inferences stacked (processing country ≠ confirmed farming country; country
rating ≠ brand rating) and must NOT be written as SeaPak's rating.** The
only honest claim: "Seafood Watch rates farmed shrimp from Thailand and
Ecuador — two countries where SeaPak processes product — as 'Good
Alternative' (Yellow); this is a country/category-level rating, not a
rating of SeaPak's specific supply chain." Record as `practices[]`,
basis `third-party-scorecard`, scoped explicitly as country-level.

## 5. BAP certification — CORRECTED (contradiction resolved)

**Raw claim:** SeaPak page states 80% of aquaculture products from 4-star
BAP suppliers (goal: 100%); a conflicting secondary source claimed already
"100%." Flagged as unresolved for Stage 3.

**Verdict: CORRECTED — the raw researcher's WebFetch pull was right, the
secondary "100%" source is stale/wrong.** I independently re-fetched
seapak.com/sustainability/ just now and got the identical current figure
verbatim: **"today, 80% of all our products are the top level of BAP
4-star certified and we are progressing toward a goal of procuring 100%."**
This is the live page as of 2026-07-30, so it supersedes any older
secondary claim of "100% already achieved." Record `certifications[]` entry
as: minimum 2-star BAP required for all aquaculture suppliers (VERIFIED,
company-disclosure), 80% currently 4-star with 100% as stated goal
(VERIFIED as current company-disclosure, not yet achieved — do not write
"100% top-tier" as a present-tense fact).

**Directory cross-check:** I also tried bapcertification.org's certified-
facilities page directly — it 404'd for me too (same as the researcher).
**Status stays NOT CHECKED against BAP's own directory** — this is a
tooling gap, not evidence against the certification. The Brownsville plant
BAP certification itself is corroborated by three independent contemporary
trade sources (PR Newswire, ReliablePlant, SeafoodSource) all naming the
same plant and certifying body (Global Aquaculture Alliance/BAP) — treat as
**high-confidence UNVERIFIED-tier** (press release + trade press, not a
primary directory pull), same as the raw file concluded.

## 6. ASC certification — UPHELD, scope clarified further

**Raw claim:** No ASC certification found for the farmed shrimp line; ASC
is named as an alternative to MSC specifically for the WILD-CAUGHT line.

**Verdict: UPHELD, and confirmed with the exact full sentence structure.**
I re-fetched the live page and pulled the full paragraph: "Nearly all our
wild-caught seafood is sourced from suppliers certified by [MSC] ... or an
equivalent," followed immediately by "Equivalent programs certifying our
suppliers include [ASC] and [ASMI's RFM]." Read together, ASC/RFM are
explicitly positioned as alternatives to MSC **for the wild-caught line**,
not the shrimp/aquaculture line, which is governed separately by BAP. The
raw researcher's read was correct — **do not record ASC as a shrimp
certification.** No ASC directory hit found for SeaPak/Rich Products either
(WebSearch only; asc-aqua.org's own directory not directly queried — record
as NOT CHECKED against the primary directory, consistent with the raw
file).

## 7. Forced-labor exposure — category vs. brand-specific (founder's key ask)

**Raw claim:** Well-documented category-level Thailand forced-labor history
(2014 Tier 3 TIP downgrade, HRW "Hidden Chains," DOL supply-chain study);
NO brand-specific finding tying SeaPak/Rich Products to any forced-labor
action.

**Verdict: UPHELD — this is the correct framing and I independently
confirmed both halves.**
- Category-level: Independent search converged on the 2014 Thailand Tier 3
  TIP downgrade being driven substantially by fishing-industry forced-labor
  findings, corroborated across multiple independent outlets (NPR, World
  Fishing, The Fish Site) — **VERIFIED at the category level** via
  convergent independent reporting, though I did not load the State
  Department's TIP report PDF directly either (same as the researcher).
  Treat category-level claim as UNVERIFIED-tier-but-high-confidence per the
  flag rules (no single primary document opened by either pass), not
  VERIFIED in the strict primary-document sense.
- Brand-specific: **I found zero evidence — no CBP action, no NOAA finding,
  no court record, no investigative report — naming SeaPak or Rich Products
  in connection with forced labor.** This confirms the raw file's "brand-
  specific finding: NONE."
- **This is exactly the place the module warned is easy to overstate.** The
  raw file did NOT overstate it — it explicitly separated category risk
  from brand finding and said so in plain language. **Confirmed correct.**
  Any downstream copy must preserve this separation: it is legitimate to
  say "SeaPak processes some product in Thailand, a country with a
  documented history of forced labor in its seafood industry (Tier 3 TIP
  downgrade, 2014)" as two separate, individually-sourced facts. It is
  **forbidden** (causation-by-juxtaposition / unverified brand accusation)
  to imply SeaPak's own supply chain has forced-labor exposure without a
  brand-specific source, which does not exist in this record.
- CBP WRO check: UPHELD as a genuine completed negative search (no
  shrimp-specific WRO for Thailand/Ecuador/Vietnam/Indonesia found) —
  correctly distinguished from "not checked."

## 8. FDA recall — UPGRADED to VERIFIED

**Raw claim:** 2011 nationwide recall of "SeaPak Breaded Butterfly Shrimp –
Ready to Fry," 22 oz, undeclared milk (whey), one lot, Sept 2011. Raw file
held this at UNVERIFIED (secondary sources only; old FDA URL not
confirmed live).

**Verdict: UPGRADED from UNVERIFIED to VERIFIED.** I independently located
and fetched an archived mirror of the FDA's own recall-notification email
(spinics.net/lists/fda/msg04519.html — this is a public archive of FDA's
recall mailing list, i.e. the FDA's own release text, not a third-party
paraphrase). It confirms verbatim: company "Rich Products Corporation,"
product "SeaPak Breaded Butterfly Shrimp – Ready to Fry," net weight
"22 oz.," reason "undeclared milk ingredient (whey) in the coating of the
shrimp (less than 0.1%)," announced 2011-09-26. This matches every detail
in the raw file exactly and is a near-primary FDA-originated document, not
just converging secondary reporting. The live fda.gov page for this record
is confirmed gone (404, and a `site:fda.gov` search turns up nothing for
SeaPak) — consistent with the raw file's note that old recall URLs of this
era are routinely retired; that is a hosting/archival fact, not a reason to
discount the recall itself.

**Product-name resolution:** Checked whether "Jumbo Butterfly Shrimp" (the
catalog SKU) is the same line as the recalled "Breaded Butterfly Shrimp."
Current SeaPak retail listings show both a standard "Crispy Breaded
Butterfly Shrimp" and a larger "Jumbo Butterfly Shrimp" as **same product
family, differentiated by shrimp size** — not confirmed as the identical
SKU recalled in 2011. **Record the recall against the SeaPak Breaded
Butterfly Shrimp product line generally, not asserted as specifically
covering the Jumbo variant** — this is the correct scoping per the evidence
schema's line-matching rule.

## 9. Litigation

**Raw claim:** 20 federal dockets pulled; none relate to seafood sourcing,
welfare, or forced labor — general employment/civil-rights/immigration
litigation only.

**Verdict: UPHELD.** No independent search turned up any seafood-sourcing,
welfare, or forced-labor litigation against Rich Products/SeaPak beyond
what the raw file already correctly excluded. Nothing to add.

## 10. Ownership

**Raw claim:** SeaPak is a Rich Products Corporation trademark/brand.

**Verdict: UPHELD — VERIFIED**, consistent across primary company sources
on both passes.

---

## Summary of Stage 3 changes for Stage 4 (writer)

1. **BAP 4-star figure CORRECTED to 80% (goal 100%)** — the "100% already
   achieved" secondary claim is superseded/wrong; use the live-page figure.
2. **FDA recall UPGRADED UNVERIFIED → VERIFIED** via near-primary archived
   FDA notification.
3. **Farming country/system stay `unknown`** — do not let "processed in
   Ecuador/Thailand" become "farmed in Ecuador/Thailand" anywhere downstream.
   This is the module's core claim type and the data does not support a
   specific-country farming claim.
4. **Seafood Watch YELLOW rating for Thai/Ecuador shrimp is country-level
   only** — write it as country/category context explicitly, never as
   "SeaPak's shrimp is rated Yellow."
5. **Forced-labor: category risk only, zero brand-specific finding** — keep
   these as two separately sourced facts, never juxtaposed to imply a
   SeaPak-specific accusation.
6. **ASC applies to the wild-caught (salmon) line only, not shrimp** — do
   not list ASC under shrimp/aquaculture certifications.
