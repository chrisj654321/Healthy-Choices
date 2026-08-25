# Sourcing-transparency egg pilot — Stage 5 legal & praise-rail review
_Reviewed: 2026-07-29 | Agent 5 (reviewer, Opus) | independent of the writer_

Scope: all 15 `*_final.js` fragments, each cross-read against its own `_raw.md`
and `_factcheck.md`, plus `_primary_pull.json` (the Stage-1 CourtListener/SEC
pull) as the authority on docket dates. `companies.js` was checked for
companyId existence and for pre-existing `sourcing` fields (0 found — the
merge is cleanly additive).

**Headline:** the batch is strong on the things the pilot was most afraid of
(Cornucopia denominators, scorecard scope, forbidden language, negative-claim
hedging) and weakest on the **praise rail** — the direction nobody instinctively
audits. Three fragments are clean, five have blocking defects, seven need
targeted field-level fixes.

---

## Verdict per company

| Company | Verdict | Issues found |
|---|---|---|
| natures-yoke | **REVISE (blocking)** | Certified Humane listed in `certifications[]` sourced ONLY to the company's own About page, against an explicit "must NOT be used" line in its factcheck; `verifiedDate` falsely asserts we confirmed the directory; `standard: ''` |
| gold-circle-farms | **REVISE (blocking)** | 2015 San Diego settlement attached to this brand's `enforcement[]` when its factcheck explicitly bars using it "as a fact specifically about Gold Circle Farms," and the brand→Luberski corporate link is itself unverified (`model: 'unknown'`) |
| danone (→ horizon-family-brands) | **REVISE (blocking)** | `scorecards[1]` puts a *different company's* (Hidden Villa Ranch) 0/1700 score on Horizon's record with `appliesTo: 'organic-line'` — a UI would render it against a Horizon carton. companyId itself is CORRECT |
| kroger | **REVISE (blocking)** | Antitrust MDL where Kroger was a **plaintiff** placed in `enforcement[]`; `Long` voluntary dismissal mislabeled `status: 'adjudicated'` |
| albertsons | **REVISE (blocking)** | Same plaintiff-in-`enforcement[]` defect; 2012-dated Certified Humane in `certifications[]` with `verifiedDate: '2012-12-17'` and no machine-readable staleness marker |
| egglands-best | REVISE (minor) | `amount: 100000` asserts an UNVERIFIED figure (ftc.gov 403'd for both agents) in a structured field the prose hedges |
| pete-and-gerrys | REVISE (minor) | `modelSource.name` quotes Cornucopia's editorial prose verbatim; `basis: 'third-party-audit'` upgrades an UNVERIFIED advocacy characterization |
| happy-egg | REVISE (minor) | `housingSource` is the exact Cornucopia characterization its factcheck bars, labeled `basis: 'third-party-audit'` |
| post-holdings | REVISE (minor) | `basis: 'government-record'` on a claim whose only URL is today.com; `amount: 75000000` unhedged in a structured field; `housing: 'mixed'` where the worst system is admittedly unconfirmed |
| crystal-farms | REVISE (minor) | $75M stated flatly (sibling file hedges the identical fact); uses the `$135M` aggregate that post-holdings' factcheck flags **DISPUTED**; missing the predates-acquisition note post-holdings carries |
| vital-farms | REVISE (minor) | Avian-flu practice blends 2024/2025/2026 figures under one "as of April 2026" date; `source.name` calls the defendant's own account "corroborat[ion]" of a court record; docket-confirmed FSAP case dropped with no exclusion note |
| organic-valley | REVISE (minor) | `body: 'USDA National Organic Program'` on a complaint USDA never acted on — the prose is correct, the badge field is not |
| **target** | **APPROVED** | Best-handled fragment in the batch. Omitted the Cornucopia `0` because the `/1700` denominator wasn't visible, and documented why |
| **walmart** | **APPROVED** | Documented four separate exclusions with reasons. `ratedLine` is a hedge sentence rather than a verbatim line (cosmetic) |
| **bob-evans** | **APPROVED** | Correctly `unknown`/`unknown` rather than inferring; explicitly declined to inherit the parent's antitrust case |

**Totals: 3 APPROVED / 12 REVISE** (5 blocking, 7 minor). No fragment needs to
be scrapped; every defect is a named field or entry.

---

## Required fixes (REVISE items) — exact text, exact file, exact field

### BLOCKING 1 — `natures-yoke_final.js`, `certifications[0]` (lines 18–30)

Delete the entire `certifications[]` entry. Currently:

```js
name: 'Certified Humane',
verifier: 'Humane Farm Animal Care',
scope: 'Free-Range egg lines (Organic, Legacy, Omega-3)',
standard: '',
verifiedDate: '2026-07-29',
source: { name: "Nature's Yoke — About (company statement)", url: 'https://naturesyoke.com/about/' },
```

`natures-yoke_factcheck.md` claim #3 flags this **UNVERIFIED (company
self-claim, not third-party-confirmed)** and lists it under *Claims that must
NOT be used*: "Nature's Yoke's '100% Certified Humane' claim as an
independently-verified third-party fact — it is the company's own statement
about itself, not cross-checked against certifiedhumane.org's producer
directory by either agent."

**Fix:** set `certifications: []` and move the claim to `practices[]`:

```js
practices: [
  {
    claim: "The company states its three egg lines (Organic, Legacy, Omega-3) are '100% Certified Humane and produced by our four-generation, family-run business.' This was not confirmed against Humane Farm Animal Care's own certified-producer directory by any research pass.",
    basis: 'company-disclosure',
    source: { name: "Nature's Yoke — About", url: 'https://naturesyoke.com/about/', date: '2026-07-29' },
  },
],
```

Also: `standard: ''` must be `'unknown'` per the schema ("anything unresolved
is `'unknown'`") — blank strings render as a present-but-empty value.

### BLOCKING 2 — `gold-circle-farms_final.js`, `enforcement[0]` (lines 33–46)

Remove the entry from this company record. `gold-circle-farms_factcheck.md`
*Claims that must NOT be used*: "The 2015 San Diego settlement … as a fact
specifically about Gold Circle Farms (it concerns the separate 'California
Ranch Fresh' private-label line)."

The fragment's own prose concedes the point — "not a finding about Gold Circle
Farms eggs specifically" — while placing it in the array a UI renders as
*this company's* enforcement history. It compounds: the same file sets
`model: 'unknown'` precisely because no primary source ties Gold Circle Farms
to Luberski/Hidden Villa Ranch. The record therefore says "we cannot confirm
who owns this brand" and "here is that unconfirmed owner's settlement" in the
same object.

**Fix:** `enforcement: []`, with the finding preserved as a comment for the
next pass. If the founder wants it retained, it belongs on a Hidden Villa
Ranch / Luberski company record, not here.

### BLOCKING 3 — `danone_final.js`, `scorecards[1]` (lines 47–55)

Delete:

```js
{
  name: 'Cornucopia Organic Egg Scorecard',
  ratedLine: 'Hidden Villa Ranch',
  appliesTo: 'organic-line',
  rating: '0/1700',
  ...
}
```

Hidden Villa Ranch is a separate corporate entity (Luberski, Inc.) that
Cornucopia scored on its own page. `ratedLine` is honest, but `appliesTo:
'organic-line'` is what the UI matches on — so a Horizon Organic carton would
display a score that rates a different company. This is the exact trap the
schema was written to prevent. `scorecards[0]` (Horizon Organic, 0/1700,
VERIFIED per factcheck #7) stays.

If the supplier relationship is worth surfacing, it already is: `modelSource`
carries Cornucopia's VERIFIED factual statement that Horizon's eggs are
"sourced from multiple distributors and other producers, including Hidden
Villa Ranch."

`companyId: 'horizon-family-brands'` is **correct** and the file's header note
documents the Platinum Equity transfer accurately. One nit: the note asserts
"Danone retains only a minority stake," which factcheck #3 flags as
trade-press-only (Platinum Equity's own release is silent on it) — it is in a
JS comment so it will not render, but soften it if the comment survives merge.

### BLOCKING 4 — `kroger_final.js`, `enforcement[2]` (lines 71–82)

Remove from `enforcement[]`. `kroger_factcheck.md` claim #7 establishes Kroger
was one of 12 retailer **Direct Action Plaintiffs**, and the Albertsons
factcheck spells out the consequence: "being a plaintiff — this litigation
should NOT be characterized as [the company] facing/defending an antitrust
claim."

The prose says "(not a defendant)". The *placement* is the defect: the schema
defines `enforcement[]` as actions against the company, and any UI built from
it will badge this as a Kroger issue. Two further problems in the same entry —
`status: 'adjudicated'` is asserted for a role that is UNVERIFIED, and the
entry omits that the December 2019 jury **rejected** the plaintiffs' claims.

**Fix:** drop the entry; if retained anywhere it belongs in `practices[]`
(basis `company-disclosure` is wrong; there is no fitting basis — see the
batch-level basis note below).

### BLOCKING 5 — `kroger_final.js`, `enforcement[1]` (line 65)

`status: 'adjudicated'` → the docket (`_primary_pull.json`, `kroger-long`)
shows `dateTerminated: 2023-10-23` on a **plaintiff's voluntary dismissal
before any ruling**, which the fragment's own prose states. A voluntary
dismissal is not an adjudication. Use `status: 'alleged'` (the only enum value
that does not imply a merits outcome) and keep the disposition in `action`.

### BLOCKING 6 — `albertsons_final.js`, `enforcement[0]` (lines 61–73)

Same plaintiff-in-`enforcement[]` defect as Kroger, same fix. Note the roster
lists **Safeway and Albertsons separately**, so "via its Safeway heritage
brand" is imprecise; drop the parenthetical if the entry is preserved anywhere.

### BLOCKING 7 — `albertsons_final.js`, `certifications[0]` (lines 19–32)

`verifiedDate: '2012-12-17'` misuses the field, which the schema defines as
"when WE confirmed directory membership." The `scope` string does carry
"treat as dated," but the schema has no machine-readable staleness field, so a
UI reading `certifications[]` will render "Certified Humane" from 13-year-old
evidence with no caveat.

This is also the batch's sharpest internal inconsistency: `danone_final.js`
**excluded** a 2007 Certified Humane award as "Too stale to list as a current
certification." Same certifier, same reasoning, opposite outcome.

**Fix (pick one, apply consistently with danone):** (a) move to `practices[]`
with `basis: 'certification'` and the 2012 date in the claim text, or (b) keep
in `certifications[]` and add an explicit `asOf: '2012-12-17'` /
`stale: true` field so the UI can honor it. Do not leave `verifiedDate` at
2012 either way.

### MINOR 8 — `egglands-best_final.js`, `enforcement[0]` (line 58)

`amount: 100000` → `amount: null`. Factcheck claim #8 is **UNVERIFIED**
(ftc.gov 403'd for both the researcher and the fact-checker). The prose
hedges correctly; the structured field does not, and the structured field is
what a UI formats as "$100,000 fine." Keep the figure described in `action`
as secondary-sourced. Consider `status: 'alleged'`, though `'settled'` is
defensible given the consent-order framing survives in two mirrors.

### MINOR 9 — `pete-and-gerrys_final.js`, `modelSource` (lines 9–14)

Currently quotes Cornucopia verbatim: `"'Multiple farms supply this brand,
which is family owned and operated, with a close relationship'"`, with
`basis: 'third-party-audit'`.

Two rails hit at once. The schema: "NEVER carry the scorecard's editorial
prose about a brand into this record — only its measured score and tier."
political-analysis.md forbids "Quoting an advocacy group's characterization as
objective truth." And factcheck claim #11 flags this content as "advocacy/
third-party investigator characterization" — **UNVERIFIED** — while `basis:
'third-party-audit'` presents it as audited. The "nearly 20 other family
farms" figure inside the same string is also UNVERIFIED.

**Fix:** `name: 'Cornucopia Organic Egg Scorecard — Pete and Gerry's Organic
Eggs (multiple supplying farms)'`, `basis: 'third-party-directory'` (see
batch note) — no quoted prose, no farm count.

### MINOR 10 — `happy-egg_final.js`, `housingSource` (lines 20–25)

The `name` reproduces the characterization `happy-egg_factcheck.md` bars:
"Cornucopia's 'markets primarily conventional "free range" eggs…unclear
supplier arrangements' characterization — advocacy framing, not fact."
`basis: 'third-party-audit'` again upgrades it.

**Fix:** `name: 'Cornucopia Organic Egg Scorecard — Happy Egg (page notes the
brand sells organic, heritage, and pastured lines in addition to free-range)'`,
`basis: 'third-party-directory'`. `housing: 'free-range'` itself is fine as the
worst system the brand sells.

### MINOR 11 — `post-holdings_final.js`, `practices[0]` (line 60)

`basis: 'government-record'` while `source.url` is
`https://www.today.com/food/recall/liquid-egg-recall-rcna198830` and the claim
text admits the FSIS notice "could not be independently loaded." `basis` is
the field the UI uses to say "government record" — it must describe the source
actually cited. Either put the fsis.usda.gov URL in `source.url` (accepting it
403s) or downgrade the basis. Factcheck claim #11: UNVERIFIED.

### MINOR 12 — `post-holdings_final.js`, `enforcement[0]` (line 36) and `welfare.housing` (line 19)

- `amount: 75000000` — factcheck claim #4 is UNVERIFIED (docket unreachable;
  four outlets agree). Same structured-field problem as Eggland's. Recommend
  `amount: null` with the figure retained in `action`, which already hedges it
  well. If the merge keeps the number, keep it identically in crystal-farms.
- `housing: 'mixed'` where the `housingSource` concedes "the exact housing
  system of the non-labeled default SKUs was not independently confirmed."
  The schema requires the **worst system still sold**; if the worst is
  unconfirmed the field cannot be stated. Recommend `'unknown'` — which the
  display rules render as neutral "No data," not as a negative. `'mixed'`
  currently reads as a determination the evidence does not support, and it
  reads *better* than the record warrants.
- Minor: `housingSource.basis: 'company-disclosure'` on a **kroger.com**
  retailer listing. That is a retailer listing, not the company's disclosure.

### MINOR 13 — `crystal-farms_final.js`, `enforcement[0]` (lines 37–44)

Three fixes to one `action` string:

1. "Michael Foods settled its portion for $75 million" is stated flatly.
   `post-holdings_final.js` hedges the identical fact ("not independently
   confirmed against the court's own order"). Both factchecks flag it
   UNVERIFIED. Match the sibling file's hedging verbatim.
2. Delete "part of a cumulative total of roughly $135 million recovered across
   all settling defendants." `post-holdings_factcheck.md` claim #6 flags this
   aggregate **DISPUTED** and lists it under must-not-use: the per-defendant
   breakdown sums to ~$83.4M without Cal-Maine and ~$164M with it. The two
   factcheck files disagree; the one that did the arithmetic says it does not
   reconcile. DISPUTED → omit or present both sides; do not restate as "roughly."
3. Add the temporal note post-holdings carries — that the alleged conduct
   predates Post's June 2014 acquisition — and, since this entry attributes a
   **parent's** conduct to a subsidiary brand record, state that Crystal Farms
   was not itself a party. `bob-evans_final.js` declined to inherit this same
   case on exactly that logic; the reasoning should be visible here too rather
   than left implicit.

Confirmed correct: the Abbotsford Egg Products 20/1700 score is **not**
attributed to Crystal Farms — it appears only in an explanatory comment saying
it must not be. Check #5b passes.

### MINOR 14 — `vital-farms_final.js`, `practices[0]` (line 81) and `enforcement[0]` (line 60)

- The practice claim opens "As of April 2026" then folds in "5 of 600+ farms
  affected as of the company's last update" — per factcheck claim #10 the
  5-of-600 figure is the **April 2024** vintage, and the page has been updated
  twice since (May 2025, April 2026). Split into dated statements; the
  factcheck's instruction was "cite with an as-of date, not as a static fact."
- `source.name: 'CourtListener docket (primary court record); corroborated by
  company statement'` — the defendant's own account of its own favorable
  outcome is not corroboration of a court record. The docket confirms the
  termination date and nothing about disposition. Drop the clause; the `action`
  text already attributes the substance to the company properly.
- `status: 'adjudicated'` is defensible (the court did dismiss the class
  claims) but rests on the company's page, not the docket. Acceptable if the
  `action` attribution stays as written.
- **Omission to note:** `_primary_pull.json` contains a docket-confirmed case
  absent from the fragment — *Foundation to Support Animal Protection v. Vital
  Farms Inc.*, E.D. Va. 2:22-mc-00023, filed 2022-12-30, `dateTerminated:
  2023-12-22`. A terminated miscellaneous docket is very likely a
  subpoena/discovery matter, not an enforcement action, so excluding it is
  probably right — but every other fragment in the batch documented its
  exclusions in a comment and this one did not. Add the note. (It is terminated,
  so this is not the check-#10 failure mode of a live case being dropped.)

### MINOR 15 — `organic-valley_final.js`, `enforcement[0]` (line 50)

`body: 'USDA National Organic Program'` for a complaint USDA never acted on.
The `action` prose is correct and well-hedged, but `body` is the field a UI
badges, and "USDA National Organic Program — 2011" reads as a federal
proceeding. `post-holdings_final.js` got this pattern right for the HSUS/FTC
complaint: `'Federal Trade Commission (complaint filed by the Humane Society
of the United States)'`.

**Fix:** `body: 'USDA National Organic Program (complaint filed by The
Cornucopia Institute, an advocacy organization; no agency action recorded)'`.

Everything else here is exemplary — STALE handled with an explicit "As of
2011 —", `status: 'alleged'`, current status flagged unconfirmed, the Judy's
Family Farm 0/1700 score correctly NOT attributed, the Oregon DEQ dairy fines
correctly excluded, and the unconfirmable Certified Humane claim **omitted with
a documented reason**. That last one is the direct counterexample to
natures-yoke: identical evidentiary situation, opposite writer decision.

### BATCH-LEVEL 16 — invalid `basis` enum value (4 files)

`kroger`, `walmart`, `target`, `albertsons` all use
`basis: 'third-party-directory'`, which is **not in the schema enum**
(`certification | third-party-audit | government-record | company-disclosure`).
Any UI switching on `basis` falls through to a default.

The honest resolution is that the enum is short a value: an advocacy scorecard
is neither an audit nor a company disclosure. Four other fields
(pete-and-gerrys/happy-egg/danone `modelSource`, albertsons ASPCA `practices`)
reach for `'third-party-audit'` for the same reason, which overstates what
Cornucopia and the ASPCA scorecard are. **Recommend Stage 6 add
`'third-party-scorecard'` to the enum in `evidence-schema.md` and normalize all
eight fields to it**, rather than forcing everything into `company-disclosure`.
Founder call, but it should be one decision applied to all eight.

### BATCH-LEVEL 17 — cosmetic normalizations for Stage 6

- `tier` formatting is inconsistent: `'1-star'`, `'1-star (1-5 scale)'`,
  `'4-star'`, `'2-star'`. The schema example includes the scale. Normalize.
- `natures-yoke` `standard: ''` → `'unknown'` (only blank in the batch).
- `organic-valley` `practices[0]`/`[1]` claim strings lack terminal periods.
- `walmart` `scorecards[0].ratedLine` is a hedge sentence, not the verbatim
  line the schema asks for. Its factcheck confirms the page's own wording —
  "Great Value organic eggs (private label store brand)" — so use that and
  move the caveat out of the identifier field.
- **Catalog data bug, outside these fragments but flagged by two factcheck
  files:** `natures-yoke_factcheck.md` #16 and `gold-circle-farms_factcheck.md`
  both conclude the catalog maps a Gold Circle Farms product to `natures-yoke`,
  and that this is very likely wrong (every source names Luberski/Hidden Villa
  Ranch; Westfield's own five-brand portfolio excludes it). Both companyIds
  exist in `companies.js` (lines 5873 and 5889), so merging these fragments
  will not orphan anything — but the **product→company mapping** should be
  fixed separately, and the Gold Circle fragment's `sourcing` data will attach
  to a record no product currently points at until it is.

---

## Praise-rail audit

This is where the batch is weakest, and it is the asymmetry worth naming: the
writer hedged negative claims carefully and repeatedly, then relaxed on
positives. Every violation below runs in a company's **favor**.

| Finding | Fragment | Traceable to certifier / independent scorecard / government program? |
|---|---|---|
| Certified Humane from the company's own About page | natures-yoke | **NO** — company self-claim, barred by its own factcheck. Blocking. |
| Certified Humane from a 2012 certifier press release, `verifiedDate` 2012 | albertsons | Certifier's own site, but 13 years stale and inconsistent with danone's exclusion of a 2007 award. Blocking. |
| "family owned and operated, with a close relationship" quoted as `modelSource` | pete-and-gerrys | **NO** — advocacy editorial, UNVERIFIED, labeled `third-party-audit`. |
| "no payment by the company" / favorable dismissal called "corroborated by company statement" | vital-farms | **NO** — defendant's own account of its own outcome presented as corroboration. |
| `housing: 'mixed'` where the worst system is unconfirmed | post-holdings | **NO** — a determination the evidence does not support, reading better than warranted. |

**Certifications that DO clear the rail** — traced to the certifier's own site
and correctly scoped:

- `egglands-best` — HFAC "Who's Certified" directory hit, scoped explicitly to
  Free Range and Pasture Raised lines and stating it does **not** cover the
  flagship conventional product. Textbook.
- `pete-and-gerrys` — HFAC directory hit naming Kirkland Cage-Free Organic and
  Nellie's Free-Range. Factcheck claim #4 VERIFIED. (Its `modelSource` is the
  problem, not this.)
- `vital-farms` — certifiedhumane.org's own Vital Farms producer page, with the
  audited standard recorded. Factcheck claim #4 VERIFIED. This is the only
  fragment in the batch where `housing: 'pasture-raised'` is legitimately used,
  and it is correctly backed by `basis: 'certification'` per the schema rule
  that the term has no USDA definition.

**Correct absences** (a fact stored as a fact, not an accusation):
`happy-egg` (VERIFIED-ABSENT against the current HFAC directory),
`walmart`, `target`, `kroger`, `organic-valley`, `danone`, `crystal-farms`,
`gold-circle-farms`, `bob-evans`, `post-holdings` — and each documents whether
it was a completed search or NOT CHECKED. The "absent vs. not checked"
discipline the schema demands held across all 15 files.

---

## Scope-matching audit (scorecards / certifications)

The pilot's biggest trap. **Result: 9 of 10 scorecard entries pass; 1 fails.**

| Fragment | ratedLine | appliesTo | Rating | Verdict |
|---|---|---|---|---|
| egglands-best | Eggland's Best (organic line) | organic-line | 20/1700 | PASS — factcheck #2 VERIFIED organic scope; catalog SKU is conventional |
| pete-and-gerrys | Pete and Gerry's Organic Eggs | organic-line | 1100/1700 | PASS |
| vital-farms | Vital Farms Organic | organic-line | 1135/1700 | PASS — distinct from the flagship non-organic pasture line |
| happy-egg | Happy Egg Organic Free Range eggs | organic-line | 1000/1700 | PASS — factcheck: "Do not apply this score to the conventional free-range SKU" |
| natures-yoke | Nature's Yoke (Westfield Egg Farm) | organic-line | 1115/1700 | PASS — mixed producer, organic on separate properties |
| organic-valley | Organic Valley | all-lines | 555/1700 | PASS — `all-lines` is correct; page's own scope is "sells only organic products" |
| walmart | Great Value organic eggs (hedged) | organic-line | 0/1700 | PASS on scope; `ratedLine` should be verbatim |
| albertsons | O Organics (Albertsons) | organic-line | 30/1700 | PASS — and correctly flags this rates a *different* private label than the catalog's Lucerne |
| danone | Horizon Organic | organic-line | 0/1700 | PASS |
| danone | **Hidden Villa Ranch** | organic-line | 0/1700 | **FAIL** — rates a different corporate entity; `appliesTo` would match a Horizon SKU |

**Deliberate, correct omissions** — three of these are the best judgment calls
in the batch:

- `kroger` — the Simple Truth 0/1700 entry withheld because the factcheck
  rated its scope **DISPUTED** (repeated fetches disagreed on whether the rated
  product is organic or the same cage-free SKU in the catalog). The writer
  refused to assert `appliesTo` in either direction. Exactly right.
- `target` — the Good & Gather `0` withheld because the `/1700` denominator was
  not visible across two fetches. Factcheck: "Do NOT cite '0/1700' … the '0' is
  shown, the '/1700' is not."
- `crystal-farms` — Abbotsford Egg Products (20/1700) explicitly not attributed.
- `gold-circle-farms` — Hidden Villa Ranch's 0/1700 explicitly not attributed
  (the correct decision that `danone_final.js` failed to make with the same
  score).

**Certification scope** — all four `certifications[]` entries name the covered
lines rather than implying company-wide coverage, and three explicitly state
what they do **not** cover. `welfare.housing` was set to the worst system sold
in every case except `post-holdings` (see Minor 12).

### Cornucopia validity — PASS, no exceptions

All 10 ratings show an explicit `/1700` and none exceeds 1700. Every
known-invalid figure was discarded: **2170** (Vital Farms), **1915** (Pete and
Gerry's), **1905** (Carol's), **1745** (Happy Egg), and Target's undenominated
**0**. The pilot's page-ID-vs-score rule was applied without a single miss —
the strongest single result in this review.

### Docket-confirmed dates — PASS

Every docket assertion checks out against `_primary_pull.json`:

| Case | Docket `dateTerminated` | Fragment says | Verdict |
|---|---|---|---|
| Janecyk v. Eggland's Best | `null` | "remains open, no termination date recorded" / `pending` | Correct |
| Wilkerson v. Vital Farms | `null` | "remains pending, no termination date recorded" / `pending` | Correct |
| Usler v. Vital Farms | 2025-01-07 | "terminated January 7, 2025" | Correct |
| Lugones v. Pete and Gerry's | 2020-04-23 | "terminated April 23, 2020" | Correct |
| Mogull v. Pete and Gerry's | 2023-04-12 | "terminated April 12, 2023" | Correct |
| Sorkin v. Kroger | 2024-08-06 | dismissed, `year: 2024` | Correct |
| Long v. Kroger | 2023-10-23 | "voluntarily dismissed in October 2023" | Date correct; `status` wrong (Blocking 5) |
| Egg antitrust MDL | 2008-12-02 → 2022-11-08 | quoted accurately in 4 fragments | Correct |

Both `dateTerminated: null` cases correctly read as pending — check #10's
failure mode does not occur. Notably, `egglands-best` and `vital-farms` cite
"CourtListener docket (primary court record)" for facts their own factcheck
files recorded as 403-blocked; that is legitimate here because the Stage-1
script pull supplied them, and the writer confined its docket claims to
exactly the fields the script returns (dates, docket number, court). Good
discipline — worth preserving as the pattern.

### STALE handling — PASS

- 2015 San Diego settlement: carries "As of 2015 — this predates current
  practice," with the private-label-line caveat. Language correct; the problem
  is *placement* (Blocking 2), not framing.
- 2011 Organic Valley / Petaluma complaint: "As of 2011 —", `status:
  'alleged'`, notes no adjudicated fine and that the 2026 supply-relationship
  status is unconfirmed. Best STALE handling in the batch.
- 1996 FTC matter: dated 1994–1996 explicitly, no implication of current
  practice.
- 2012 Albertsons certification: dated in prose but **not** in a
  machine-readable field (Blocking 7).
- 2007 Braswell certification: excluded outright as too stale. Correct — and
  the precedent Albertsons should have followed.

---

## Forbidden-language scan results

**Clean. Zero violations in any rendered field.** A full-text scan of every
`description`, `action`, `claim`, `scope`, `name`, `ratedLine`, and `tier`
across all 15 files for the political-analysis.md forbidden list returned only:

- **"Certified Humane"** (6 files) — a certifier's verbatim program name, which
  the schema explicitly requires be recorded verbatim. Not the adjective.
- **"Deliberately excluded"** (`albertsons_final.js:117`) — in a JS comment,
  describing the *writer's own* decision to drop the Substack claim, not a
  company's intent.
- **"unlike"** (`kroger_final.js:40`, `target_final.js:41`) — in JS comments,
  comparing the confidence of *our own* scorecard entries, not brands.

No unadjudicated "fraudulent," no "deliberately"/"intentionally" applied to a
company, no medical-causation language anywhere, no praise adjectives
("excellent," "humane" as adjective, "clean," "responsible"), no condemnation
adjectives ("notorious," "abusive"), and **no brand-vs-brand comparison in any
data field** — comparisons remain computed at render time as the schema
requires.

**Causation-by-juxtaposition:** none found. There are no lobbying or donation
figures in these fragments, and the one place the risk existed — Post
Holdings' avian-influenza disclosure adjacent to an EBITDA guidance
affirmation — is presented as the single company statement it actually was,
with no implied connection.

Two near-misses worth watching at merge, both currently acceptable:

1. `post-holdings` HSUS entry — "the pictured hens were in reality confined in
   battery cages" sits inside the `alleging that…` clause, correctly attributed
   as HSUS's allegation, with "No FTC investigation finding, consent order, or
   dismissal has been publicly reported" appended. Compliant, but the phrase
   "in reality" would read as adopted if a UI ever truncates the sentence.
2. `crystal-farms` — "the largest individual settlement in the case" is a
   superlative. It is factual and about the litigation rather than a
   company-vs-company comparison, so it clears the rule; but since the
   surrounding aggregate figure is DISPUTED and must go (Minor 13), trim this
   with it.

---

## Overall assessment — is this batch safe to merge into companies.js as-is?

**No — not as-is. Yes, after the five blocking fixes.**

The five blocking items are all deletions or single-field edits. None requires
new research, none touches a fragment's core, and none needs to go back to the
writer:

1. `natures-yoke` — `certifications[0]` → `[]`, claim moves to `practices[]`
2. `gold-circle-farms` — `enforcement[0]` → `[]`
3. `danone` — delete `scorecards[1]` (Hidden Villa Ranch)
4. `kroger` — delete `enforcement[2]` (MDL); `enforcement[1].status` →
   `'alleged'`
5. `albertsons` — delete `enforcement[0]` (MDL); resolve the 2012
   `verifiedDate`

The seven minor items are mechanical and should be applied in the same pass
(`amount` → `null` on the three UNVERIFIED figures, the `basis` enum decision
across eight fields, the `body` field on organic-valley, post-holdings'
`housing` → `'unknown'`, crystal-farms' hedging brought in line with
post-holdings, vital-farms' avian-flu dates split). `target`, `walmart`, and
`bob-evans` merge unchanged apart from the batch-level `basis` normalization.

**What the batch got right** — worth recording in the decision log as the
pilot's validated behaviors, because these are the failure modes that were
actually feared going in:

- Cornucopia denominator rule: 10/10 valid, 5/5 invalid figures discarded.
- Scorecard scope: 9/10 correct, including three cases where the right answer
  was to publish nothing.
- Forbidden language: zero violations.
- Docket dates: 8/8 accurate, both open cases correctly pending.
- `unknown` used honestly — five fragments carry `housing: 'unknown'` and three
  carry `model: 'unknown'` rather than inferring.
- Exclusions documented in-file with reasons, which is what made this review
  auditable at all.

**The structural lesson for the module.** Every single praise-rail violation
found here was a *placement* error, not a language error: the prose was almost
always correctly hedged, and the defect was putting a properly-hedged claim
into a structured field whose semantics assert more than the prose does —
a company self-claim in `certifications[]`, a supplier's score in
`scorecards[]`, a plaintiff's case in `enforcement[]`, an UNVERIFIED figure in
`amount`, a news URL under `basis: 'government-record'`. The writer checklist
in `evidence-schema.md` audits *language*; it does not audit whether an
entry belongs in the array it was placed in. Recommend adding to the Stage-4
checklist before the next industry runs:

- [ ] Every `certifications[]` entry's `source.url` is the **certifier's**
      domain, not the company's.
- [ ] Every `scorecards[]` entry rates **this** company, not a supplier,
      licensee, or parent.
- [ ] Every `enforcement[]` entry names this company as a **respondent**, not a
      plaintiff or complainant.
- [ ] Every `amount` is null unless the figure is VERIFIED against a primary
      source — prose hedging does not cover a structured number.
- [ ] `basis` describes the source actually in `source.url`.

**Most serious single finding** — `natures-yoke_final.js`. The fragment
publishes "Certified Humane, verifier: Humane Farm Animal Care,
verifiedDate: 2026-07-29" on the strength of nothing but the company's own
marketing page, when its fact-checker had written, in that exact file, that
this claim must NOT be used as an independently-verified third-party fact.

It would have been the pipeline's one unforced error, and in the worst
direction. The Pro tier's entire proposition is that a positive claim in this
app has been independently verified — that is what a user is paying to see.
Shipping this would have had the app vouch, in its own voice and with a
same-day verification date, for a welfare certification nobody checked. If
Nature's Yoke's certificate has lapsed, been narrowed to one line, or never
covered all three, the app is the party making a false certification claim
about a real company — a false-advertising exposure that runs in the company's
favor, which is the direction nobody audits and no user reports. The tell is
that the same batch handled the identical evidentiary situation correctly for
Organic Valley: unconfirmable Certified Humane claim, certifications left
empty, reason documented in the file.
