# Johnsonville — Stage 3 fact-check

Fact-checker: independent Stage 3 pass, separate from Stage 2 researcher.
Reviewed: 2026-07-30
Upstream checkpoint: `johnsonville_raw.md` (confirmed >500 bytes before starting).

Flags per political-analysis.md: VERIFIED / UNVERIFIED / DISPUTED / STALE.
Does not rewrite raw claims — annotates only.

---

## Overall framing: "thin public record"

**UPHELD.** Johnsonville is genuinely privately held (Stayer family), has
no SEC filings, and is a manufacturer rather than an integrated hog
producer. This framing is accurate and appropriately caveated in the raw
file; no evidence found to contradict it.

## Priority check — GAP and Certified Humane directories (were these genuinely absent, or just NOT CHECKED?)

This was the specific instruction for this file: retry the GAP and
Certified Humane directories for Johnsonville rather than accepting the raw
file's findings at face value, since the module's rule is that "NOT
CHECKED" must never be recorded as "ABSENT" without a search that genuinely
completed.

- **Certified Humane:** raw file already reports a direct WebFetch of
  `certifiedhumane.org/whos-certified/` was completed and Johnsonville did
  not appear. **Independently re-run in this pass via targeted WebSearch**
  (`Johnsonville sausage "Certified Humane"`) — returned general
  Certified-Humane-program pages and other certified brands (e.g. North
  Country Smokehouse) but **no result tying Johnsonville to the program at
  all**, positive or negative. This is a second, independent completed
  search that also failed to surface a Johnsonville/Certified Humane
  connection. **UPHELD — genuine absence-after-search, not an incomplete
  search.**
- **GAP (Global Animal Partnership):** raw file marks this NOT CHECKED
  (interactive directory not queryable). **Independently re-run in this
  pass** via targeted WebSearch (`Johnsonville Certified Humane OR Global
  Animal Partnership certified 2025 2026`) — returned only generic
  certification-program explainer pages (GAP's own "Get Certified" and
  "Manufacturers" partner-listing pages, Certified Humane's own generic
  pages) with **no Johnsonville-specific hit of any kind**. This is
  consistent with, and reinforces, Stage 2's own general WebSearch attempt.
  **Still recommend recording as NOT CHECKED rather than ABSENT** — a
  negative WebSearch result is not equivalent to a genuine query of GAP's
  own interactive producer directory (the documented SKILL.md tooling
  limitation), so this fact-check did not fully close the gap either. But
  two independent negative searches (Stage 2's and this one) with zero
  Johnsonville hits meaningfully raise confidence that no GAP relationship
  is being missed by search-indexing gaps.
- **Conclusion for Stage 4: record both as `unknown`.** Neither directory
  produced a positive hit for Johnsonville across two independent research
  passes, and the module's own rule is explicit that absence of
  certification is a fact worth storing but is NOT evidence of bad
  practice — do not write Johnsonville as "not certified" in a way that
  implies a negative welfare finding; write as no-certification-found /
  `unknown`, identical in display treatment to a brand nobody has ever
  audited.

## Sourcing model (own farms vs. contract growers vs. open market)

- **UPHELD — `unknown`, genuine gap.** No new evidence found in this pass.
  The 2014 sow-harvest-capacity figure and the DecisionNext
  logistics-vendor case studies are correctly identified by Stage 2 as
  off-point for the housing/farm-ownership claim type; no re-characterization
  needed.

## Gestation-crate status / housing

- **UPHELD — `unknown`, genuine gap.** No Johnsonville-specific statement
  found in this pass either. Stage 2's inference that Johnsonville likely
  does not directly own/operate gestation-scale hog-breeding operations is
  reasonable but correctly labeled as inference, not fact — carried forward
  unchanged.

## Antibiotics claims

- **UPHELD.** No "no antibiotics ever" claim found for Johnsonville branded
  product in this pass either; USDA PVP master listing still not
  independently checked (403 tooling limitation, consistent across all
  three files in this batch).

## Litigation — Hormel Foods Corp. v. Johnsonville, LLC

- **UPHELD.** This is correctly scoped as an off-topic labor/trade-secrets
  dispute between competitors, not an animal-welfare or consumer-protection
  matter — appropriately included for completeness but flagged as not
  relevant to the module's priority. No new evidence changes this
  characterization. The dismissal-with-prejudice fact remains single-source
  (meatingplace.com) — **UPHELD as UNVERIFIED**, not independently
  re-confirmed in this pass, but low-stakes given the claim's irrelevance to
  the welfare/misleading-claims priority.
- **UPHELD — no animal-welfare, consumer-protection, or antitrust litigation
  naming Johnsonville was found in this pass either**, consistent with
  Johnsonville's absence from the Stage 1 pork-antitrust and
  broiler-chicken-antitrust party lists.

## FSIS recalls

- **UPHELD across all four recall rows — UNVERIFIED, consistent with the
  documented fsis.usda.gov 403 tooling limitation** shared across all three
  files in this research batch. Not independently re-fetched in this pass;
  no reason found to doubt the reported figures, but none reach the
  VERIFIED bar. All four remain correctly characterized as foreign-material
  contamination events unrelated to the module's welfare/sourcing priority.

## OSHA — plant safety

- **UPHELD — Searched, not found**, and the place-name disambiguation
  (New Johnsonville, TN vs. the sausage company) is correctly handled and
  not re-litigated here.

---

## Summary for Stage 4

- **No claims in this file were upgraded, downgraded, or disputed** — the
  raw file's own discipline in this pass held up under independent
  re-checking. The two directory checks this fact-check was specifically
  asked to retry (GAP, Certified Humane) both came back with a second,
  independent negative result, reinforcing rather than contradicting Stage
  2's `unknown` recommendation.
- **Mandatory for Stage 4:** write Johnsonville's welfare/sourcing-model
  fields as `unknown` across the board (sourcing model, gestation-crate
  status, GAP, Certified Humane, AGW, antibiotics claim) — this is a
  genuine data desert for a privately held manufacturer, not a finding of
  either good or bad practice, and the card must not read as implying
  either.
- The Hormel trade-secrets litigation and the four foreign-material FSIS
  recalls may be included for general-transparency completeness but are
  off-point for the module's living-conditions/misleading-claims headline
  and should not be framed as welfare findings.
