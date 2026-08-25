# Wild Planet Foods — Stage 3 fact-check

companyId: `wild-planet`
Fact-checked: 2026-07-30 (independent pass — re-fetched primary sources
directly)

Flags per /political-analysis: VERIFIED / UNVERIFIED / DISPUTED / STALE.

---

## 1. Fishing method — pole & line / troll / handline only

**Raw claim:** Wild Planet's own procurement policy states 100% pole &
line, troll, or handline sourcing; no longline or purse seine; bycatch
<0.5%. Flagged basis `company-disclosure` for the method claim itself.

**Verdict: UPHELD, and independently re-confirmed verbatim.** I re-fetched
wildplanetfoods.com/pages/tuna-procurement-policy directly and got matching
quotes: "Wild Planet sources 100% of its tuna from pole & line, troll or
handline fisheries," "does not buy any long-line or purse seine caught
tuna," bycatch "<0.5%." **This is the founder's priority question, and the
raw file's core caution is correct: this is company disclosure about its
own sourcing, not yet independently audited.** No independent registry
(MSC, an observer program, or a third-party fishery audit) confirms Wild
Planet's own supply chain practices this method at the stated volumes.
**Keep basis as `company-disclosure`** — do not upgrade to
`third-party-audit` or `certification` on the strength of the company page
alone.

## 2. Seafood Watch rating — DOWNGRADED, company-disclosure only

**Raw claim:** Wild Planet states >95% of its tuna is Seafood Watch GREEN,
rest YELLOW. Raw file flagged this figure as UNVERIFIED brand-specific
(sourced from Wild Planet's own page, Seafood Watch's own page did not
load).

**Verdict: DOWNGRADED to UNVERIFIED / company-disclosure — confirmed, not
resolved.** I independently attempted to load Seafood Watch's own tuna
guide/recommendation pages and PDFs and hit the identical wall the
researcher did — 404s and navigation-only shells, no ratings content
returned. **I could not independently confirm the 95%/Green figure against
Seafood Watch's own page either.** What I could confirm via independent
search (not Wild Planet's own copy): Seafood Watch does rate
pole-and-line/troll-caught Pacific/Atlantic albacore and Pacific skipjack
as GREEN/"Best Choice" or "Super Green" at the **method level** — this
supports the plausibility of Wild Planet's claim but is not the same as
confirming Wild Planet's specific "over 95%" brand-level percentage.

**This is exactly the founder's Priority #2 concern, and the answer is:
the pole-and-line/troll METHOD carries an independently-confirmed top
sustainability rating; the specific ">95% GREEN" PERCENTAGE claim is Wild
Planet's own marketing copy, not yet independently verified.** Record two
separate items: (a) `practices[]` claim "sources tuna via pole & line,
troll, or handline methods that Seafood Watch rates as top-tier/Best
Choice" — basis `third-party-scorecard` (the method-level Seafood Watch
rating is independently confirmed via multiple convergent sources, even
though I could not load Seafood Watch's page directly); (b) the specific
"95%+ of Wild Planet's own tuna is GREEN-rated" figure stays basis
`company-disclosure`, explicitly attributed as "Wild Planet states..." —
never asserted as the app's own finding.

## 3. Japanese MSC-certified fishery — UPHELD, correctly NOT tied to brand

**Raw claim:** A real MSC-certified Japanese pole & line skipjack/albacore
fishery exists (certified 2016) and geographically overlaps Wild Planet's
stated Japan sourcing, but no confirmation Wild Planet buys from this
specific certified fishery.

**Verdict: UPHELD, and I found evidence that actively argues AGAINST
conflating the two.** I re-fetched the MSC fisheries register page
directly: certification is confirmed active (certified 2016-10-17,
expires 2027-04-15) — but the page states the catch **"is marketed
domestically in Japan,"** with no export/buyer information naming Wild
Planet or any US brand. That's a mild positive signal that this specific
certified fishery may NOT be Wild Planet's supplier (domestic marketing
cuts against a US import relationship), reinforcing that the raw file was
right to record this as regional context only, not a supply-chain tie.
**Do not let this MSC certification bleed into Wild Planet's own record in
any form.**

## 4. MSC certification (company-level) — UPHELD

**Raw claim:** Wild Planet does NOT hold MSC certification; states this is
a deliberate choice, not a failed application. Raw file flagged its own
quote of the company's stated reasoning as a paraphrase, not verbatim.

**Verdict: UPHELD on the certification-status fact; CORRECTED on the exact
wording.** I re-fetched the page and got different verbatim language than
the raw file's paraphrase: "Wild Planet chooses to not use eco-logo
certifications, which do not improve our sustainable sourcing standard."
(The raw file's rendering — "intentionally declines MSC certification,
believing it would lower standards by permitting less sustainable
methods" — was a reasonable paraphrase of the gist but is not the
company's actual wording.) **If this reasoning is ever quoted in
user-facing copy, use the verbatim sentence above, attributed to Wild
Planet, not the raw file's paraphrase.** The underlying fact — no MSC
certification, framed by the company as intentional — stays VERIFIED (no
MSC brand listing found on two independent search passes).

## 5. B Corp certification — DOWNGRADED / CORRECTED

**Raw claim:** Founder's brief assumed B Corp status; raw researcher found
no confirming bcorporation.net listing across multiple search attempts;
direct directory fetch 403'd. Flagged as NOT CHECKED for a definitive
directory answer, but evidence "leans toward no confirmed listing."

**Verdict: CORRECTED — record as ABSENT, not NOT CHECKED, and flag the
founder's original premise as unconfirmed.** I independently ran a fresh
search for "Wild Planet" + bcorporation.net / B Corp and got the same
negative result: no Wild Planet Foods entry anywhere in B Lab's directory
results. The only "Wild"-adjacent hits (Wild Frontiers, Planet Wild GmbH,
PLANET B) are unrelated companies, matching the raw file's finding exactly.
My own direct fetch attempt at bcorporation.net's search page also failed
(403), same tooling wall as the researcher hit. **Given two independent
research passes both surface zero matching listing across multiple query
variants, this clears the bar for a genuinely completed negative search —
record `certifications[]` as ABSENT (no B Corp certification found), not
NOT CHECKED**, per the schema's rule that repeated genuine searches
returning nothing is a real absence finding, distinct from a directory
that literally cannot be queried at all. **Separately and importantly: per
SKILL.md's evidence-schema rule, even if B Corp certification existed, it
certifies overall company practices (governance, environment, workers,
community, customers) — it is NOT a fishing-method or sourcing-specific
certification and must never be conflated with or substituted for the
pole-and-line/Seafood Watch sourcing claims above.** This module boundary
holds regardless of the B Corp outcome. **Flag to the founder: the "B
Corp" premise in the original brief appears to be incorrect and should not
be repeated in any marketing or app copy about Wild Planet.**

## 6. Ownership — Bolton Group acquisition

**Raw claim:** Acquired by Bolton Group (Italian private conglomerate)
~Aug 2021; founder continued to lead; "privately held" framing technically
accurate but should note Wild Planet is now a subsidiary, not independent.

**Verdict: UPHELD.** Independent search corroborates the same acquisition
date, acquirer, and reporting across the same class of sources (trade
press plus Bolton's own press page). Still UNVERIFIED-tier in the strict
primary-document sense (no direct load of Bolton's press release), same
as the raw file concluded — appropriately cautious, no change needed. The
raw file's nuance note (independent brand vs. now-subsidiary) is correct
and should carry through to Stage 4.

## 7. Litigation — underfilled tuna cans, $1.7M settlement

**Raw claim:** Soto and Shihad class actions (N.D. Cal.), consolidated,
settled for $1.7M; alleged ~30% underfill vs. "the federally mandated 5-oz
minimum weight." Docket existence/dates VERIFIED via Stage 1 script;
settlement figure and underfill detail held at UNVERIFIED (secondary legal
news only).

**Verdict: UPGRADED settlement figure to VERIFIED via convergent
independent legal-press sourcing; CORRECTED one factual imprecision.**
Independent search corroborated the $1.7M settlement figure and the
underfilling allegation across multiple independently-reporting outlets,
including Law360 (a subscription legal-news service with its own court
access, closer to primary than general consumer blogs) alongside
FoodProcessing.com and topclassactions.com — all converging on identical
figures. This is strong enough convergence to treat the **existence and
amount of the $1.7M settlement as VERIFIED** even without loading the
court's settlement order directly.

**Correction needed:** the raw file's phrase "30% below the federally
mandated 5-oz minimum weight" **conflates two different numbers.** Per the
same sources: the cans are LABELED 5 oz (a label declaration, not itself
"the federally mandated minimum"); the actual **federal minimum fill
standard for canned tuna is 3.23 oz drained weight**, and testing found
roughly 2.25 oz average — which is the ~30% figure (30% below 3.23 oz, not
30% below the 5-oz label weight). **Stage 4 should write this as: "tested
cans averaged about 30% below the federal minimum fill standard for
canned tuna (3.23 oz), on a product labeled 5 oz,"** not "30% below the
federally mandated 5-oz minimum" — the 5-oz figure is a label weight, not
itself the federal standard.

**Note preserved from raw file, still correct:** this is a fill-weight /
consumer-protection matter, not a fishing-method or welfare claim — keep
it recorded as a separate, resolved legal finding, not blended into the
sourcing/welfare claims above.

## 8. FDA recalls — UPHELD

**Raw claim:** No FDA recall found specifically naming Wild Planet Foods
tuna/sardines; only unrelated tangential hits (other brands' recalls,
independent mercury-testing commentary).

**Verdict: UPHELD.** No independent search turned up a Wild Planet-specific
FDA recall either. Consistent negative finding across two passes — record
as a genuinely completed negative search (no recall found), not "not
checked," same conclusion the raw file reached.

---

## Summary of Stage 3 changes for Stage 4 (writer)

1. **Fishing method claim stays `company-disclosure`** — the founder's
   Priority #2 concern is valid: this is Wild Planet's own procurement
   policy, not yet independently audited at the brand-supply-chain level.
2. **Seafood Watch rating split into two records:** method-level GREEN
   rating for pole-and-line/troll tuna = independently supported
   (`third-party-scorecard`); Wild Planet's own "95%+" brand percentage
   stays `company-disclosure`, attributed, never stated as the app's own
   finding.
3. **B Corp DOWNGRADED/CORRECTED to ABSENT** — two independent passes found
   no listing. Flag to founder that the original brief's "B Corp" premise
   looks wrong.
4. **MSC-declined reasoning quote CORRECTED** to the actual verbatim
   sentence ("chooses to not use eco-logo certifications, which do not
   improve our sustainable sourcing standard") if ever quoted.
5. **Litigation settlement figure UPGRADED to VERIFIED** ($1.7M,
   convergent independent legal press); **underfill-percentage framing
   CORRECTED** — 30% is against the 3.23 oz federal minimum fill standard,
   not against the 5-oz label weight.
6. Japan MSC-certified fishery: confirmed real and active, but evidence
   (domestic-market-only language) further supports keeping it OUT of Wild
   Planet's record entirely.
