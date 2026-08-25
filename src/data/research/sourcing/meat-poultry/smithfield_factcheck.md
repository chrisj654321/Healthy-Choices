# Smithfield Foods, Inc. — Stage 3 fact-check

Fact-checker: independent Stage 3 pass, separate from Stage 2 researcher.
Reviewed: 2026-07-30
Upstream checkpoint: `smithfield_raw.md` (confirmed >500 bytes before starting).

Flags per political-analysis.md: VERIFIED / UNVERIFIED / DISPUTED / STALE.
Does not rewrite raw claims — annotates only.

---

## PRIORITY #1 — Pork antitrust: defendant or purchaser? (role-confusion cross-check)

**Claim as raised in raw file:** Smithfield Foods, Inc. is a named party in
*In re Pork Antitrust Litigation* (0:18-cv-01776 / MDL 2998, D. Minnesota).
Raw file marks the docket data VERIFIED (Stage 1 primary pull) but does not
explicitly state whether Smithfield's role is defendant or purchaser.

**Resolution: UPHELD and now explicitly confirmed. Smithfield's role is
DEFENDANT (alleged price-fixer), not purchaser/plaintiff.**

This is the correct, expected role — unlike the Kraft Heinz broiler-chicken
case in the parallel fact-check, where a purchaser was almost written up as
a defendant. Independent WebSearch (case-tracker synthesis, cross-checked
against meatingplace.com and nationalhogfarmer.com trade coverage)
consistently lists the defendant roster as: Agri Stats, Inc.; Clemens Food
Group, LLC; The Clemens Family Corporation; Hormel Foods Corporation; Hormel
Foods, LLC; JBS USA Food Company; Seaboard Foods LLC; **Smithfield Foods,
Inc.**; Triumph Foods, LLC; Tyson Foods, Inc.; Tyson Prepared Foods, Inc.;
Tyson Fresh Meats, Inc. Smithfield is consistently on the defendant side —
no source found places it as a purchaser/plaintiff. The Stage 1 primary
docket party list independently supports this: it lists Smithfield Foods,
Inc. alongside the other named producer-defendants, separate from the
labeled plaintiff groups ("Direct Purchaser Plaintiffs," "Direct Action
Plaintiffs," "Commercial and Institutional Indirect Purchaser Plaintiffs").

**Flag: VERIFIED for defendant role** — corroborated by both the Stage 1
primary docket data and independent secondary case-tracker sources, with no
contradicting source found anywhere in this pass.

### Settlement figures — raw file's list is incomplete, not wrong

The raw file lists two Smithfield settlements ($42M restaurants/commercial,
$75M indirect/consumer purchasers). Independent WebSearch found a **third,
larger settlement not in the raw file**:

- **$83 million** paid to resolve claims from **direct purchasers**
  (named plaintiffs Maplevale Farms Inc. and John Gross & Company Inc.),
  reported by MEAT+POULTRY ("Smithfield Foods agrees to $75 million pork
  antitrust settlement" article and related coverage), National Hog Farmer,
  Food Dive, PorkBusiness, and money.usnews.com — five independent
  non-advocacy outlets.
- The $75M indirect/consumer-purchaser settlement **received final court
  approval April 11, 2023**, per U.S. District Judge John R. Tunheim's own
  quoted language ("a fair, reasonable and adequate deal... only three have
  opted out, and none have objected") — this is closer to a primary source
  than the raw file's framing suggested, since multiple outlets quote the
  judge's order directly, though the order itself was not independently
  read in this pass.
- **Combined total across all three Smithfield pork-antitrust settlements:
  approximately $200 million** ($42M + $75M + $83M), consistent with an
  independently-found figure describing JBS, Tyson, and Smithfield together
  having "paid out more than $200 million combined" — cross-corroborating
  the completeness of this settlement list.
- **Basis: UNVERIFIED** (secondary legal/trade press, primary court orders
  not independently read) **but multiply corroborated across five
  independent outlets for the $83M figure alone, with no contradicting
  source.** **Mandatory correction for Stage 4: if Smithfield's pork
  antitrust settlements are cited, use all three figures (or the ~$200M
  combined total), not just the $42M/$75M pair from the raw file** — citing
  only two would understate Smithfield's actual settlement exposure.

---

## PRIORITY #2 — Gestation-crate status / HSUS settlement (the headline finding)

This is the single most load-bearing claim in the file, so it gets the most
scrutiny. **Verdict: the case's existence and 2022 procedural history are
well-corroborated. The specific 2025 settlement language — "still crates
sows for 4 to 6 weeks each pregnancy cycle" — remains single-source
(HSUS's own announcement) despite a genuine additional search effort in
this pass. Flag stays UNVERIFIED for that exact quote; use with an explicit
HSUS-attribution hedge, not as flat fact.**

**What is well-corroborated (upgraded confidence from the raw file):**

- **The lawsuit's filing (Oct. 2021)** and **Judge Yvonne Williams's Oct.
  24, 2022 denial of Smithfield's motion to dismiss** are independently
  reported by multiple non-advocacy trade outlets found in this pass:
  MEAT+POULTRY (two separate articles — the initial filing and the
  motion-to-dismiss ruling), Farm Progress, National Hog Farmer, and AGDAILY
  — four independent trade-press sources beyond the two HSUS-adjacent links
  Stage 2 already cited. This raises the case's procedural history well
  past single-source, even though the D.C. Superior Court's own docket
  system was not directly queried (consistent with the documented tooling
  gap for state courts).
- **The January 28, 2025 settlement's occurrence** is also corroborated
  across the same independent outlets' later coverage plus a case digest
  entry at The Brooks Institute's "Animal Law Digest" (an academic
  animal-law tracking publication, not a party to the litigation or an
  advocacy group itself) — though this fact-check could not open that page
  (HTTP 406) to confirm what specifically it reports about the settlement's
  terms.

**What is NOT independently corroborated (the specific quoted language):**

- Every search attempted in this pass — including targeted searches for
  Smithfield's own sustainability-report language, and searches explicitly
  excluding humaneworld.org — returned the same phrasing ("now more clearly
  tells consumers that it still crates sows for 4 to 6 weeks each pregnancy
  cycle following insemination") traceable only to HSUS's own settlement
  announcement (humaneworld.org). **No independent journalism outlet, and
  no Smithfield-authored page, was found in this pass that separately
  reports or quotes this specific disclosure language.** This matches
  exactly the situation the SKILL.md instructions describe: "if you can
  only find one source repeating the same claim, mark UNVERIFIED and say
  so."
- This is an important distinction from how the raw file characterized it.
  The raw file already correctly flagged this as "UNVERIFIED-tier (this is
  the plaintiff-side org's own settlement announcement)" — **that flag is
  UPHELD, not downgraded further, but this fact-check confirms it cannot be
  upgraded either, despite real effort to find independent corroboration.**
- **No dollar settlement amount was found for the HSUS case either** (the
  raw file correctly notes HSUS's announcement mentions no payment) —
  confirmed, no contradicting figure found.

**Mandatory instruction to Stage 4:** This remains the strongest available
evidence for the module's central misleading-claims priority and should
still be used — but it must be framed as an attributed claim, not flat
fact: *"According to HSUS's January 2025 settlement announcement, Smithfield
now discloses that it 'still crates sows for 4 to 6 weeks each pregnancy
cycle following insemination' — a disclosure that followed a 2021 lawsuit
alleging Smithfield's 'group housing' marketing was misleading; a D.C.
Superior Court judge allowed the case to proceed in 2022 before the parties
settled in January 2025."* Do NOT write "Smithfield admits/discloses/states"
as unattributed fact — attribute the specific disclosure language to HSUS's
characterization of the settlement, per the forbidden-language rule against
"quoting an advocacy group's characterization as objective truth." The
**scope point (company-owned farms are only ~40% of supply, see below) is
independently well-supported and may be stated more directly.**

### Scope: company-owned vs. contract-grower share of hog supply

- **Claim:** Company-owned farms account for only ~40% of hogs processed by
  Smithfield's Fresh Pork segment as of FY2025, heading toward ~30%.
  **UPHELD and independently re-corroborated.** WebSearch independently
  returned the same ~40% figure ("in fiscal year 2025, Smithfield sourced
  approximately 40% of the hogs processed in its Fresh Pork segment's
  facilities from its Hog Production segment"), plus additional independent
  detail not in the raw file: Smithfield's Hog Production segment
  reportedly comprises **"more than 240 company-owned farms and more than
  1,300 contract farms,"** and total hog production fell to an estimated
  **11.5 million head in 2025, down ~35% from a 2019 peak of 17.6 million.**
  **Basis: UNVERIFIED** (secondary financial-press synthesis, Smithfield's
  primary 10-K/investor materials not independently read in this pass
  either) **but now corroborated by additional independent figures beyond
  the two sources Stage 2 cited.** Safe for Stage 4 to use directly with
  the standard UNVERIFIED hedge — this is the load-bearing scope fact that
  makes the "fulfilled commitment" 2023 PR language read as materially
  incomplete, and it does not depend on the single-sourced HSUS quote above.
  **Caution:** one source encountered in this cross-check (grokipedia.com)
  is an AI-generated content aggregator, not journalism — do not cite it if
  it resurfaces in Stage 4 drafting.

---

## Prop 12 / CA / MA compliance

- **UPHELD.** No new evidence found either way on Smithfield's absence from
  *NPPC v. Ross* as a named party, or on the Center for a Humane Economy's
  26%-market-share/Prop-12-opposition characterization (still
  advocacy-sourced, still UNVERIFIED, correctly not carried as fact).

## GAP / Certified Humane / AWA certification directories

- **UPHELD across all four directory rows.** Not independently re-queried
  in this pass (time budget prioritized the two founder-flagged priorities
  above) — carry forward Stage 2's NOT CHECKED / Searched-not-found labels
  as-is. Do not write any of these as confirmed-absent.

## Stress/handling — FSIS humane-handling enforcement (NOIE)

- **UPHELD — UNVERIFIED, not independently re-fetched in this pass.** No
  new evidence found either way; the farmtransparency.org 404 and
  fsis.usda.gov 403 pattern is consistent with the documented tooling
  limitation.

## OSHA — plant safety

- **UPHELD across all rows.** Not independently re-verified in this pass.

## Other litigation (Food & Water Watch, Murphy-Brown nuisance suits)

- **UPHELD.** Both correctly flagged as advocacy-hosted/secondary in the raw
  file; no new evidence found to upgrade or dispute either in this pass.

## Antibiotics claims / Sourcing model / FSIS recalls

- **UPHELD as written across all items.** No new evidence found to change
  any flag; Stage 2's basis labeling on these sections was already
  disciplined (correctly distinguishing Smithfield's own investor-relations
  press release as company self-disclosure vs. secondary trade coverage
  elsewhere).

## SEC 10-K / Corporate status

- **UPHELD.** The Jan. 2025 Nasdaq IPO (ticker SFD) and WH Group ~88%
  post-secondary-offering ownership figures were not independently
  re-verified against the primary S-1/424B4 filings in this pass; no
  contradicting information found.

---

## Summary for Stage 4

- **Highest-priority finding: Smithfield's role in the pork antitrust MDL is
  confirmed DEFENDANT** (correctly matching the raw file's implicit
  framing) — no purchaser/plaintiff role-confusion risk materialized here,
  unlike the Kraft Heinz broiler-chicken case. **However, the settlement
  list is incomplete: add the $83M direct-purchaser settlement (Maplevale
  Farms) — total combined Smithfield pork-antitrust settlements are
  ~$200M across three settlements, not the $42M+$75M pair in the raw
  file.**
- **Second-priority finding (the module's central claim): the HSUS
  settlement's existence and the 2021–2022 procedural history are now
  corroborated by four independent trade-press outlets — stronger than the
  raw file's original sourcing. But the specific "crates sows 4 to 6 weeks"
  disclosure language remains sourced ONLY to HSUS's own announcement
  despite a real search effort to find independent corroboration — it must
  be written as an attributed HSUS characterization, not flat fact, per the
  forbidden-language rule on advocacy-group characterizations.** The
  independently-strong companion fact — that company-owned farms are only
  ~40% of Smithfield's hog supply, heading toward 30% — can be stated more
  directly and does the most work for the "misleading claim" framing
  without needing the single-sourced quote.
- Everything else in the file — Prop 12, GAP/Certified Humane/AWA
  directories, FSIS NOIE, OSHA, Food & Water Watch, Murphy-Brown, antibiotics
  claims, FSIS recalls, SEC/ownership — carried forward unchanged from
  Stage 2's own flags; no material new findings or corrections in this
  fact-check pass beyond the two priority items and the settlement-list
  correction above.
