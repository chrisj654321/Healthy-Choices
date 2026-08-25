# Froneri US, Inc. (Froneri / Dreyer's Grand Ice Cream, Inc.) — Fact-Check

Fact-checker pass (Agent 2 of /political-analysis), 2026-08-23. Role: annotate the researcher's claims against PRIMARY sources. Not a rewrite; no new conclusions beyond flags + citations.

Flags used: **VERIFIED** (primary source confirms — URL given) / **UNVERIFIED** (no primary source found or reachable) / **DISPUTED** (primary source contradicts the raw claim) / **STALE** (true but pre-2020).

## Lobbying

- Claim: "No federal LDA registrant record for Froneri or Dreyer's Grand Ice Cream" — **VERIFIED, refined.** Queried the LDA Senate API directly (machine-readable primary source, same underlying data as lda.gov):
  - `registrant_name=Froneri` → 0 results. `client_name=Froneri` → 0 results. **Froneri has never filed as either registrant or client.**
  - `registrant_name=Dreyer` → 0 results (Dreyer's has never itself registered as a lobbying firm — expected).
  - `client_name=Dreyer` → **8 filings found**, all naming client "DREYER'S GRAND ICE CREAM," registrant "THELEN (FORMERLY THELEN REID BROWN RAYSMAN & STEINER LLP)." All 8 filings run 2002 Mid-Year through 2004 Year-End; income reported was $11,871 (2002 Mid-Year) then $0 for every subsequent period; **zero filings of any kind since 2004.**
  - Source: https://lda.senate.gov/api/v1/filings/?client_name=Dreyer (queried 2026-08-23; mirrors lda.gov data).
  - Verdict: **VERIFIED ZERO for the current/recent period** — no LDA activity for Froneri or Dreyer's Grand Ice Cream since 2004. The 2002–2004 Thelen filings are real but **STALE** (pre-2020, 20+ years old) — do not cite as current lobbying; fine as a one-line historical footnote if the writer wants it, otherwise omit.
- OpenSecrets 403 / FEC.gov unrendered — **UNVERIFIED, tool limitation confirmed again.** I re-attempted FEC via the openFEC API (`api.open.fec.gov`) and hit `OVER_RATE_LIMIT` on the shared DEMO_KEY; could not get a fresh read this pass either. Since the primary LDA record above already gives a clean, current "zero" for lobbying, this gap matters less for lobbyingSpend but still leaves politicalDonations unconfirmed.
- **lobbyingSpend: VERIFIED 0** (current period, LDA primary source). **politicalDonations: still null/unconfirmable** — FEC not independently reachable this pass either.

## Donations

- No change from researcher's findings — still **UNVERIFIED**. I attempted independent verification via the openFEC API and was rate-limited before getting a result (`OVER_RATE_LIMIT` on DEMO_KEY, both for committee-name search and candidate search). Did not attempt a browser-rendered opensecrets.org/fec.gov session (out of scope for this pass).
- Verdict: **politicalDonations: null** stands — no primary confirmation either way. Do not publish "zero donations" as fact.

## Issues

### 1. Bloomberg sanitation report / alleged Feb 2026 Form 483 (Bakersfield)
- **UNVERIFIED — no primary FDA record found. This is the critical finding of this fact-check pass.**
- I searched directly for a primary confirmation: FDA's Inspection Classification Database (fda.gov), FDA Form 483/Warning Letters listings, and FDA's own inspection/enforcement pages. The Inspection Classification Database exists as a public tool (https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-classification-database) but is a live search form, not fetchable/queryable by the tools available in this pass — same limitation the researcher hit.
- No FDA warning letter for Dreyer's/Froneri/Nestlé at the Bakersfield facility was found in any search.
- The only "Form 483 in Feb 2026" reference anywhere is the Redica Systems commercial document-store LISTING the researcher already flagged — that is a paid third-party index, not a primary FDA record, and its content still cannot be verified.
- The Bloomberg article itself remains paywalled (confirmed still 403/inaccessible to WebFetch this pass).
- **Verdict: UNVERIFIED. No primary FDA record (Form 483 text, Inspection Classification Database entry, or warning letter) confirms this. Per the brief: this must be OMITTED or heavily hedged as "press-reported inspection observations, not an adjudicated FDA finding" — never stated as fact, and never paired with the Feb-2026/Bakersfield specifics, which are themselves unconfirmed.**

### 2. Outshine Fruit Bars glass-contamination recall
- **VERIFIED (event) / UNVERIFIED (classification, currently pending).**
- Independently re-fetched the PR Newswire release directly (primary company/regulatory-notice source): confirmed real, dated **2026-08-16**. Reason: possible glass contamination. Products/UPCs match the raw doc exactly (Strawberry 041548610047, Grape 041548244044 and alt 041548000121, Watermelon 041548413624, Tangerine 041548612041). No illnesses/injuries reported. Source: https://www.prnewswire.com/news-releases/dreyers-grand-ice-cream-inc-issues-voluntary-recall-on-select-outshine-fruit-bars-due-to-possible-foreign-matter-contamination-302852376.html
- Checked openFDA's enforcement-report API (`api.fda.gov/food/enforcement.json`, the machine-readable primary FDA recall database) for "Dreyer" and "Outshine" — this recall **does not yet appear** in openFDA as of the dataset's `last_updated: 2026-08-12` (i.e., the database snapshot predates the Aug 16 announcement; FDA typically classifies a recall several weeks after initiation, so a Class I/II/III designation is not yet publicly assigned). This confirms the researcher's "classification NOT STATED" finding, not a gap in research — the classification genuinely isn't out yet.
- **Verdict: Recall event VERIFIED as real and active. Classification (Class I/II/III) UNVERIFIED/pending — do not assert a class; say "classification not yet assigned by FDA as of [date]" if the writer wants to mention it at all.**
- Bonus finding (not in raw doc, flagged for the synthesizer's awareness only, not a claim to publish without separate sourcing): openFDA also shows Dreyer's/Outshine has **four earlier CONFIRMED Class II recalls** on primary record — 2016 Drumstick Listeria (2 recall numbers, same event), 2018 Dreyer's lid-mismatch, 2020 Outshine white-plastic-contamination (3 recall numbers, same event, ~122k cases total), and 2021 Outshine foreign-material. All Terminated/closed. These are real primary-source recalls the raw researcher didn't surface; useful context on a pattern of contamination recalls if the synthesizer wants it, but outside this fact-check's scope to editorialize further.

### 3. FDA allergen alert #1 — undeclared milk, Outshine No Sugar Added Strawberry Fruit Bars
- **VERIFIED** via openFDA primary record. Recall number **F-1365-2023**, classification **Class II**, recalling firm "Dreyer's Grand Ice Cream, Inc." (Oakland, CA). Recall initiation date **2023-07-17** (matches raw doc exactly). Batch codes **LLA317822 and LLA317922**, Best By 30 SEP 2024 (matches exactly). Reason: "Undeclared allergen; milk." Quantity: 23 pallets / 5,060 cases. Distribution: PA, MD, NC, NY, MI, VA, MS, WV, OH, KY, DE, NJ, AR, MO, TN, AL, LA. Termination date 2024-09-05 (case closed).
- Source: https://api.fda.gov/food/enforcement.json (openFDA, queried 2026-08-23).
- One correction to the raw doc: distribution list per openFDA is broader/different in a few states than the raw doc's summary (raw doc said Kroger VA/WV/OH/KY, ShopRite MD/PA/VA/DE/NJ, Walmart AR/MO/TN/MS/KY/AL/LA — the openFDA state list is a superset/near-match; retailer-level breakdown isn't in the openFDA record, so the raw doc's retailer detail is plausible but only the state list is independently confirmed here).

### 4. FDA allergen alert #2 — undeclared wheat, Häagen-Dazs Chocolate Dark Chocolate Mini Bars
- **VERIFIED** via openFDA primary record. Recall number **H-0227-2026**, classification **Class II**, recalling firm "Dreyer's Grand Ice Cream, Inc." (Walnut Creek, CA). Recall initiation date **2025-11-03** (matches raw doc). Batch/lot **LLA519501** (matches exactly). Reason: "Undeclared wheat." Quantity: 3,410 cases. Distribution (per openFDA, narrower than raw doc's 29-state Kroger list): **CA, KY, OH, WI**. Status: Completed.
- Source: https://api.fda.gov/food/enforcement.json (openFDA, queried 2026-08-23).
- **DISCREPANCY flagged, not disputed:** the raw doc's distribution claim (Kroger in 29 states + Giant Eagle in 5 states) is far broader than openFDA's official distribution_pattern field (CA, KY, OH, WI only). This is likely the raw doc citing the company's press-release distribution language (retailer + state list) vs. openFDA's own summarized distribution_pattern field, which can be terser than the underlying release. Flag for the writer: **use CA/KY/OH/WI if citing the primary FDA record; the 29-state Kroger figure is unconfirmed against openFDA and needs the FDA safety-alert page itself (still 403 to automated fetch) or the PR Newswire release to reconcile.**

### 5. NLRB filings
- **All 8 case-level claims independently re-verified against nlrb.gov (primary source), re-fetched directly in this pass (not re-derived from the raw doc):**

| Case # | Verified status/disposition | Match to raw doc |
|---|---|---|
| 32-CA-336745 | Closed — Bilateral Settlement Agreement, filed 2025-02-06 | VERIFIED, matches |
| 32-CA-337834 | Closed — RD Order, issued 2025-01-06 | VERIFIED, matches |
| 32-CA-345226 | Closed — RD Order, issued 2025-01-06 | VERIFIED, matches |
| 32-RC-335673 | Closed — election lost, tally 160 against / 115 for, 2025-03-12 | VERIFIED, matches (raw doc's 8 challenged ballots not independently re-confirmed but immaterial — union lost either way) |
| 32-CA-370485 | Closed — Dismissed by NLRB General Counsel, 2026-02-05 | VERIFIED, matches |
| **31-CA-374204** | **OPEN — no disposition, charge filed 2025-09-26, allegation only** | **VERIFIED OPEN, matches** |
| 31-CA-328989 | Closed — Withdrawal approved 2024-10-17 | VERIFIED, matches |
| 31-CA-297115 | Closed — Withdrawal approved 2022-08-09 | VERIFIED, matches |

- Source pattern: https://www.nlrb.gov/case/{case-number}, each fetched directly 2026-08-23.
- **Verdict on the open charge (31-CA-374204): CONFIRMED OPEN as of 2026-08-23. This is an unproven ALLEGATION — no NLRB finding of merit exists. Publishable only as "an open, unresolved unfair labor practice charge alleging X, filed [date], pending" — never as an established fact or a finding against the company.**
- **Verdict on the other 7: CONFIRMED closed without any litigated Board decision on the merits** — 1 bilateral settlement, 2 RD Orders, 1 lost election, 1 GC dismissal, 2 GC-approved withdrawals. None represents an adjudicated finding of wrongdoing. Safe to publish as background/pattern context (e.g., "seven prior NLRB charges since 2022, none resulting in a Board finding against the company") but not as proof of misconduct.

### 6. Cal/OSHA citation — Bakersfield
- **VERIFIED**, re-fetched directly from osha.gov (primary source) this pass, independent of the raw doc. Establishment: Dreyer's Grand Ice Cream, Inc., 7301 District Blvd, Bakersfield, CA 93313. Inspection opened 2023-02-14, closed 2023-08-03. 2 citations: **Citation 01001, Serious, standard 3943(C), $5,060**; **Citation 01002, Other, standard 3203(A), $0**. Total penalty **$5,060**. Case status: Closed.
- Source: https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1651298.015 (fetched 2026-08-23, content matched exactly on independent re-fetch).
- **Verdict: fully confirmed, matches raw doc exactly, publishable as-is.**

### 7. FTC antitrust historical note (2002, pre-Froneri)
- Not independently re-verified this pass (out of scope — researcher already flagged it as context-only, pre-dates the Froneri entity, and the brief did not ask for resolution on this item). No change to its status.

## Tally

| Claim | Flag |
|---|---|
| Outshine glass recall — event | VERIFIED |
| Outshine glass recall — FDA classification | UNVERIFIED (pending, not yet assigned) |
| FDA allergen alert #1 (milk, Jul 2023) | VERIFIED |
| FDA allergen alert #2 (wheat, Nov 2025) | VERIFIED (distribution-list discrepancy noted) |
| Cal/OSHA Bakersfield citation ($5,060) | VERIFIED |
| Bloomberg sanitation report / alleged Feb 2026 Form 483 | UNVERIFIED — no primary FDA record found |
| NLRB 31-CA-374204 (open charge) | VERIFIED OPEN — allegation only, no finding |
| NLRB other 7 cases | VERIFIED closed, none litigated-to-a-Board-finding |
| Lobbying (Froneri) | VERIFIED ZERO (LDA, all-time) |
| Lobbying (Dreyer's) | VERIFIED ZERO since 2004 (STALE 2002-2004 activity exists but immaterial) |
| Donations/FEC | UNVERIFIED — API rate-limited, no primary confirmation either way |

**Publishable / omit verdicts (explicit, per brief):**
- **Bloomberg sanitation report: OMIT, or if included, hedge hard** — "press-reported FDA inspection observations from a paywalled Bloomberg article; no primary FDA Form 483, warning letter, or Inspection Classification Database record could be confirmed. Do not state as an adjudicated finding." The Feb-2026/Bakersfield date-and-plant pairing specifically should not be stated as fact under any framing — it traces only to a paid document-store index listing, not a primary record.
- **NLRB 31-CA-374204: publishable only as a pending/open allegation**, explicitly labeled unresolved, never as a finding.
- **Outshine glass recall: publishable as a real, active, voluntary recall.** Do not state a recall class (Class I/II/III) — it is not yet assigned in FDA's public enforcement database as of this fact-check date.
- **Lobbying: publishable as "$0 / no lobbying disclosure activity"** for both Froneri and Dreyer's Grand Ice Cream in the current era (nothing since 2004) — this is now a primary-source-confirmed zero, stronger than the raw doc's "unresolved."
- **Donations: not publishable as zero** — still genuinely unconfirmed; leave as null/no claim.
