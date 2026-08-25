# Boar's Head — Stage 3 fact-check (meat-poultry module)

Auditor: separate Sonnet instance from Stage 2 researcher. Method: independent
WebSearch/WebFetch passes against the raw file's claims — not a re-read of the
researcher's reasoning. Fact-check date: 2026-07-30. WebFetch continues to
403 on fsis.usda.gov and cdc.gov directly for this session too (same tooling
limitation the researcher hit); all upgrades below come from cross-referencing
multiple independent secondary outlets via WebSearch, not from a working
primary-source fetch path.

---

## PRIORITY 1 — Listeria outbreak figures

**61 illnesses / 19 states / 10 deaths — UPHELD, VERIFIED.** Independently
re-confirmed via WebSearch across KGW, VPM, Daily Voice, and CDC's own
investigation-update page title, all describing the outbreak's **final**
tally when CDC declared it over on **November 21, 2024**. Every source found
in this pass agrees on 61/19/10 — no independent source shows a different
final number. UPHOLD as VERIFIED via WebSearch restatement of the CDC page
(WebFetch still 403's on cdc.gov).

**Initial recall — 207,528 lb, July 26, 2024 — UPHELD, VERIFIED**, with an
added detail the raw file didn't have: the recalled liverwurst was produced
**June 11–July 17, 2024** (44-day shelf life). Confirmed via Food Safety
News and the FSIS notice title itself, both independently found via
WebSearch.

**Expanded recall — 7M+ lb, July 30, 2024, plant M12612, May 10–July 29,
2024 production window — UPHELD, VERIFIED**, and the raw file's one
UNVERIFIED sub-claim is now resolved: **establishment number M12612 is
CONFIRMED** (multiple independent sources, including a description of the
establishment's 1984 grant-of-inspection history, all cite M12612 for the
Jarratt plant). Upgrade M12612 from UNVERIFIED to VERIFIED.

**69 FSIS noncompliance reports / "inadequate sanitation practices" —
UPHELD, VERIFIED.** Confirmed via CIDRAP and other independent outlets
citing the same January 2025 USDA-FSIS report, same "69 noncompliance
reports" language, date range essentially matching (Aug 2023–Aug 2024 per
one source vs. the raw file's Aug 2023–Aug 2024 — consistent).

### Date-range conflict — RESOLVED (not a genuine dispute)

The raw file flagged two conflicting illness windows: "January–July 2024" vs.
"May–November 2024." Neither is correct as an illness window. CDC's own
investigation page (confirmed via independent WebSearch restatement, since
direct fetch still 403's) states specimens were collected from sick people
**May 29, 2024 to September 13, 2024**. Neither secondary summary the
researcher hit had this right:

- "January–July 2024" has no support in any source found in this pass — likely
  a WebSearch snippet artifact, possibly conflating the outbreak
  investigation's July 12, 2024 open date with an illness-onset date. **No
  source supports a January 2024 start. Treat as incorrect, do not carry
  forward.**
- "May–November 2024" conflates the **illness specimen-collection window**
  (starts ~May 29) with the **outbreak-closure announcement date** (November
  21, 2024, when CDC declared the outbreak over — 60 days after the last
  reported illness, per CDC's own closure convention). November is not part
  of the illness window.

**CORRECTED figure for Stage 4:** illness specimen collection ran **May 29,
2024 – September 13, 2024**; CDC declared the outbreak over on **November
21, 2024** (a separate, later administrative date — write these as two
distinct dates, never merge them into one range).

### Jarratt plant "permanent closure" — DISPUTED / CORRECTED (material)

The raw file states Boar's Head "announced the permanent closure of the
Jarratt facility... by September 13, 2024." **This is now outdated and
should not be written as a current fact.** Independently confirmed via
Virginia Business, WTVR, WVTF, and Fox Business (all 2025 coverage):

- The September 13, 2024 announcement was that Boar's Head would close the
  Jarratt facility **indefinitely** and **permanently discontinue liverwurst
  production** — those are two different commitments, and only the second one
  was actually "permanent."
- **FSIS placed the plant's suspension into abeyance on July 18, 2025**,
  after reviewing the company's corrective food-safety documentation, and the
  plant **reopened** for non-liverwurst production in mid/late-2025 under
  federal (not state-delegated) inspection and at least 90 days of
  heightened Listeria monitoring.

**CORRECTED for Stage 4:** the Jarratt facility's closure was indefinite, not
permanent — it reopened under enhanced federal oversight roughly a year
after the outbreak. Only liverwurst production at Jarratt was permanently
discontinued. Writing "permanent closure of the plant" would be a factual
error as of 2026.

---

## PRIORITY 2 — AWI FTC complaint

**Complaint is real — UPHELD, VERIFIED.** Independently confirmed via
Lady Free Thinker, New Food Magazine, Perishable News, and a Crowell &
Moring law-firm client alert (a non-advocacy, non-AWI legal-industry source
independently describing the same filing) — all corroborate: AWI filed
(actually **two** complaints, filed together Feb 23, 2021, one covering
chicken sausage/FACTA and one covering Simplicity All Natural turkey/NTF —
the raw file's "a complaint... alleging" is a reasonable simplification but
Stage 4 should say "complaints" plural if precision matters) alleging
Boar's Head's "humanely raised" claims are deceptive because FACTA/NTF are
minimum industry-association programs, not independent welfare
certification.

**Outcome — UPHELD, and now more confidently confirmed as unresolved.**
Searched FTC.gov directly, and searched for any AWI follow-up through
2022–2026: **no evidence found of any FTC enforcement action, consent
order, or public disposition on this complaint in the five-plus years
since filing.** This is consistent with (and reinforces) the raw file's own
conclusion. Per the flag→action mapping, this must be written as a pending,
unadjudicated advocacy complaint with **no resolution as of 2026** — never
implied as an active investigation or a credible signal that FTC action is
forthcoming (FTC very rarely takes public individual action on this style of
complaint, and five-plus years of silence should be read as "likely no
further action," not "still pending review"). AWI's own characterization of
FACTA/NTF as inadequate remains correctly excluded from established fact per
the raw file's own note — UPHELD, no change.

**Certified Humane / AGW — UPHELD, still NOT CHECKED.** Re-attempted
agreenerworld.org/directory/ this pass — still 403's. Tooling limitation
persists; do not upgrade to ABSENT.

---

## Other sections

**Sourcing model (company-disclosure claims, Section 2) — UPHELD, VERIFIED
(company-disclosure basis unchanged).** The FACTA/NTF compliance fact is
now corroborated by more independent outlets than just AWI (see Priority 2
above) — still tag as UNVERIFIED per the pipeline's advocacy-sourcing rule
(no primary Boar's Head statement names FACTA/NTF directly), but note for
Stage 4 that this is well-corroborated across multiple non-AWI sources, not
resting on AWI alone.

**No antibiotics / no nitrates claims (Section 3) — UPHELD, not
independently re-verified this pass** (lower priority per brief; recommend
Stage 3's original suggestion — direct fetch of boarshead.com/allnatural —
still stands as a to-do if this becomes load-bearing). PVP check — UPHELD,
NOT CHECKED (still 403, still non-exhaustive WebSearch).

**OSHA 2014 citation — UPHELD, VERIFIED.** Independently found the same
establishment/violation ID (317489482) resolving to a real OSHA database
entry via WebSearch; did not re-extract the exact $2,100 figure but no
reason to doubt it.

**Litigation (Section 6):**
- **Morgenstein settlement — UPGRADED from UNVERIFIED to VERIFIED-SECONDARY.**
  Confirmed via 13newsnow, WAVY, MEAT+POULTRY, and Supermarket Perimeter —
  four independent outlets agree: settlement announced December 13, 2024
  (year now confirmed), terms undisclosed. Still no public docket number
  located (case may have settled before or shortly after filing, common for
  first-mover wrongful-death suits).
- **Adams v. Boar's Head (ham) — UPGRADED from UNVERIFIED to
  VERIFIED-SECONDARY.** Confirmed via ABC News, Good Morning America,
  Forbes, and The Hill — well beyond a single trade-press mention. Suit
  filed by Morgan & Morgan on behalf of Otis Adams Jr. (d. May 5, 2024,
  Tampa-area Publix purchase). Still no docket number located.
- **$3.1M class-action settlement — UPGRADED from UNVERIFIED to
  VERIFIED-SECONDARY, docket number now found.** Case is **Pompilio et al.
  v. Boar's Head Provisions Co. Inc.**, No. **7:24-cv-08220-PMH**
  (S.D.N.Y., White Plains division). Final approval granted **August 13,
  2025**. Class period: purchases of recalled products May 10–August 12,
  2024.

**GAP absence (Section 1) — UPHELD, VERIFIED ABSENT.** Independently
re-fetched globalanimalpartnership.org/shoppers/ this pass and confirmed
Boar's Head does not appear on the current list.

---

## Summary for Stage 4

1. Outbreak toll (61/19/10) and both recall figures (207,528 lb / 7M+ lb):
   VERIFIED, safe to state directly.
2. Illness window: use **May 29 – September 13, 2024** (specimen
   collection), with outbreak-declared-over date **November 21, 2024**
   stated separately. Do not use "January–July" or "May–November."
3. Jarratt plant closure: was **indefinite**, not permanent — the plant
   **reopened under federal oversight in 2025**. Only liverwurst production
   is permanently discontinued. This is a material correction from the raw
   file and should not ship as "permanently closed."
4. AWI FTC complaint: real, filed Feb 23, 2021 (two complaints), **no FTC
   action in 5+ years** — write as an unresolved, unadjudicated advocacy
   complaint per the ALLEGED/PENDING language rules, with an explicit "no
   resolution found as of 2026" caveat.
5. Litigation: three matters now have stronger sourcing (Morgenstein,
   Adams, and the $3.1M settlement with a real docket number,
   7:24-cv-08220-PMH) — still hedge as settled/pending per available
   detail, none rise to "adjudicated verdict" language.
6. Certified Humane/AGW/PVP: still NOT CHECKED — tooling limitation
   unresolved, do not write as ABSENT.
