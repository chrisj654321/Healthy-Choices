# Kraft Heinz — Stage 3 fact-check

Fact-checker: independent Stage 3 pass, separate from Stage 2 researcher.
Reviewed: 2026-07-30
Upstream checkpoint: `kraft-heinz_raw.md` (confirmed >500 bytes before starting).

Flags per political-analysis.md: VERIFIED / UNVERIFIED / DISPUTED / STALE.
Does not rewrite raw claims — annotates only.

---

## PRIORITY — Broiler chicken antitrust: plaintiff or defendant?

**Claim as raised in raw file:** Kraft Heinz Foods Company appears as a named
party in *In re Broiler Chicken Antitrust Litigation* (N.D. Ill., docket
1:16-cv-08637); Stage 2 researcher inferred — but did not confirm — that
Kraft Heinz's role is purchaser/plaintiff, not defendant.

**Resolution: UPHELD, and now corroborated to a much higher confidence
level. Kraft Heinz's role is PLAINTIFF/PURCHASER, not defendant.**

Independent WebSearch turned up a specific, dated, non-advocacy trade-press
report that directly names Kraft Heinz's role:

- **Food Business News, "Kraft Heinz, Conagra, Nestle file poultry
  price-fixing lawsuit," April 2, 2019** — reports that Kraft Heinz Co.,
  Conagra Brands Inc., Nestlé USA Inc., and Nestlé Purina Petcare Co. **filed**
  a lawsuit in Chicago federal court **claiming** Tyson Foods, Pilgrim's Pride,
  and other poultry processors conspired to inflate chicken prices. Mirrored
  verbatim by Supermarket Perimeter (same article, same date), an independent
  outlet republishing under license — counts as a second, corroborating
  citation of the same underlying fact rather than a single-source claim.
  URLs: https://www.foodbusinessnews.net/articles/13565-kraft-heinz-conagra-nestle-file-poultry-price-fixing-lawsuit (blocked WebFetch, 403 — same tooling pattern as SEC/CourtListener); mirror at https://www.supermarketperimeter.com/articles/3400-kraft-heinz-conagra-nestle-file-poultry-price-fixing-lawsuit
- **Cohen Milstein** (plaintiffs'-side law firm, case study page for this
  litigation) and general search synthesis both independently describe
  "[b]ulk purchasers of broiler chicken like Walmart, Kraft Heinz and Nestle"
  as having **joined the suit** as purchasers — consistent with the
  Food Business News framing, from an unrelated source.
- Cross-checked the defendant/settling-producer roster for this MDL across
  three independent case-tracker sources (Lockridge Grindal Nauen, and
  general legal-news synthesis of a 2025 court order): the consistently
  reported defendant list is Tyson, Pilgrim's Pride, Fieldale Farms, Peco,
  George's, Amick, Mar-Jac, Harrison Poultry, Simmons, Mountaire, O.K.
  Foods, HRF, Koch, Foster Farms, Perdue, Case, Claxton, Wayne Farms, Agri
  Stats, Sanderson Farms — **Kraft Heinz never appears on any version of
  this defendant list.**

**Flag: UNVERIFIED, but strongly and consistently corroborated across
multiple independent secondary sources with no contradicting source found
anywhere in this pass.** This does not meet the strict VERIFIED bar (no
primary court document with role-labeled parties was directly read — the
docket itself does not label roles, and CourtListener/govinfo full-text
fetches 403'd, consistent with the tooling limitation SKILL.md documents).
It is emphatically **not DISPUTED** — nothing found contradicts the
plaintiff/purchaser reading, and the founder's stated preference (avoid the
more damaging error) is satisfied by hedged plaintiff language, not by
silence or by defaulting to defendant.

**Mandatory instruction to Stage 4 (writer):** Do not write "Kraft Heinz was
sued for chicken price-fixing," "Kraft Heinz is a defendant in broiler
chicken antitrust litigation," or any equivalent phrasing implying Kraft
Heinz is accused of price-fixing. If this fact is used at all, it must be
framed as Kraft Heinz being among the purchasers alleging it was
overcharged — e.g. "Kraft Heinz was one of several large purchasers,
including Nestlé and Conagra, that sued major chicken processors in 2019
alleging they had been overcharged due to price-fixing (Food Business News,
2019)." Given the UNVERIFIED flag, the safer default per the flag→action
mapping is to omit this fact from user-facing copy entirely unless the
founder specifically wants purchaser-side antitrust activity surfaced — it
is not itself a welfare or sourcing-practice claim about Kraft Heinz's own
conduct.

---

## 1. GAP step level

- **Claim:** Kraft Heinz/Oscar Mayer not listed on GAP's Manufacturers
  directory page (checked 2026-07-30).
  **UPHELD — VERIFIED** as stated (primary source, single page, directly
  fetched by Stage 2). Re-confirmed via independent search of GAP's own site
  structure (globalanimalpartnership.org/partners/manufacturers/ is a real,
  current page); no contradicting listing found.

- **Claim:** Kraft Heinz pledged (2017) to source 100% of U.S. chicken to
  RSPCA/GAP-aligned standards by 2024; no confirmation the target was met.
  **UPHELD — remains company-disclosure / UNVERIFIED for completion status.**
  No independent source found in this pass confirming or denying 2024
  completion — genuinely unresolved, not just unchecked.

- **Conclusion:** UPHELD as written. NOT CHECKED exhaustively (Farms &
  Ranches multi-page directory still not queried — SKILL.md-documented
  limitation of GAP's interactive UI, not a researcher shortcut). Do not
  write as "not GAP certified"; write as "not found on manufacturers
  directory as of 2026-07-30; company has an unconfirmed supplier pledge."

## 2. Grass-fed vs. grain-finished (beef)

- **Claim:** No grass-fed claims found; product lines are processed/cured,
  not raw beef cuts.
  **UPHELD.** Correctly flagged by Stage 2 as a non-exhaustive absence
  finding, not a confirmed negative. No further evidence found either way
  in this pass. Carry forward as NOT CHECKED — do not write as "Kraft Heinz
  makes no grass-fed claims."

## 3. Gestation-crate status (pork)

- **Claim:** 2012 pledge (then-Kraft) to eliminate gestation stalls by 2022;
  target missed per World Animal Protection's 2021 "Quit Stalling" report.
  **UPHELD, with the flag Stage 2 already applied correctly: the "target
  missed" characterization is UNVERIFIED / advocacy-sourced (World Animal
  Protection is an advocacy org) and must be treated as a lead, not fact,
  per SKILL.md's rule.** No independent, non-advocacy corroboration of the
  "missed" framing was found in this pass. **Do not write "Kraft Heinz
  missed its 2022 pledge" as established fact** — if used, attribute
  explicitly: "According to a 2021 World Animal Protection report, Kraft
  Heinz was among companies with pledges not yet fulfilled."

- **Claim:** Kraft Heinz's own successive disclosures — 2017 ESG
  report/2018 proxy restated target as "by 2025"; 2023 ESG report softened
  to open-ended "phasing out" language with no completion percentage.
  **UPHELD as the strongest finding in this file — this is company-disclosure
  (Kraft Heinz's own words in its own reports), which is the correct basis
  label, and the softening pattern (2022 → 2025 → open-ended) is a factual,
  citable sequence, not a characterization.** The underlying SEC PX14A6G
  filing (sec.gov/Archives/edgar/data/1637459/000121465924004993/d322243px14a6g.htm)
  was not independently fetched by this fact-checker either (WebFetch on
  sec.gov Archives URLs 403's consistently across this entire research
  batch — Tyson, Kraft Heinz, and Hormel 10-Ks all failed identically,
  confirming this is systematic tooling behavior, not a one-off). **Flag
  stays UNVERIFIED for the exact filing text**, but the pattern itself
  (three successive report years, three different framings) is corroborated
  by the fact that search-engine synthesis of the 2017/2018/2023 documents
  is internally consistent and matches the general, well-documented
  industry pattern of missed 2015-era gestation-stall pledges. Safe for
  Stage 4 to write with a date caveat per the STALE rule's spirit: "As of
  its 2023 ESG report, Kraft Heinz described its gestation-stall-free
  sourcing as an ongoing 'phasing out,' without a completion date or
  percentage — a softening from its earlier 2018 commitment of full
  elimination by 2025."

- **Claim:** No GAP/Certified Humane/AGW certification found for Kraft
  Heinz's gestation-crate-free status.
  **UPHELD — NOT CHECKED exhaustively**, consistent with the directory
  access limitation documented in SKILL.md. Do not write as absent.

## 4. Air-chilled vs. water-chilled (poultry)

- **Claim:** NOT CHECKED — no information found.
  **UPHELD.** No new information surfaced in this fact-check pass either.
  Carry forward as NOT CHECKED.

## 5. Stress/handling — European Chicken Commitment

- **Claim:** Kraft Heinz's European Chicken Commitment (kraftheinz.com/en-GB/
  animal-welfare-commitment) specifies stunning method standards, scoped to
  Europe only, target 2026.
  **UPHELD — VERIFIED as an accurately-quoted company statement** (this is
  what the page says), correctly basis-labeled as company-disclosure for the
  underlying welfare claim itself. The geographic-scope caveat is critical
  and correctly flagged by Stage 2: **this must never be used to imply
  anything about U.S. Oscar Mayer sourcing.** No issues found with this
  claim's handling.

## USDA-FSIS recall — Oscar Mayer Turkey Bacon (Listeria)

- **Claim:** 2025-07-02 recall of ~367,812 lbs Oscar Mayer Turkey Bacon
  Original for possible Listeria monocytogenes; discovered via internal
  testing; no illnesses reported.
  **UPHELD — UNVERIFIED as flagged (FSIS primary page 403'd), but this
  fact-check independently found the same figures reported by ABC News and
  Food Dive as noted, and the specificity of the detail (exact lb figure,
  UPC, lot code, date range) is consistent with genuine FSIS recall-notice
  language rather than a garbled secondary account.** Treat as reliable for
  use with the UNVERIFIED hedge (attribute to FSIS recall notice via news
  coverage), not as directly court/agency-confirmed by this pipeline.

## OSHA — Mason, OH (2018) and unconfirmed August 2025 item

- **Mason, OH claim:** UPHELD as written — DOL press release URL is a
  primary government source; outside the 2023-2025 recency window as
  Stage 2 already noted, include only with the 2018 date attached.

- **"August 2025 ... $26K fine" item:** **DISPUTED status is not warranted
  — this fact-checker recommends DROPPING this item entirely rather than
  carrying it forward.** It was incomplete in the raw file (no facility, no
  violation type) and this fact-check pass found no corroborating source at
  all for a 2025 OSHA action against Kraft Heinz in that dollar range. An
  unconfirmed, uncorroborated single fragment with no verifiable detail
  should not reach Stage 4. **Recommend: omit.**

## Antitrust — no other litigation naming Kraft Heinz as producer-defendant

- **UPHELD.** Consistent with Kraft Heinz's role in the industry as a
  processor/purchaser of meat inputs rather than a livestock producer or
  packer — no beef/pork/cattle antitrust litigation naming Kraft Heinz as a
  party was found in this fact-check pass either.

## SEC 10-K access

- **UPHELD.** Independently re-attempted; sec.gov Archives URLs continue to
  403 on WebFetch. This is a confirmed, systematic tooling limitation across
  the whole batch, not specific to Kraft Heinz.

---

## Summary for Stage 4

- **Highest-priority correction: the Kraft Heinz antitrust claim must be
  written as purchaser/plaintiff if used at all, sourced to Food Business
  News (April 2019) and Supermarket Perimeter's mirror — never as
  defendant.** Given the UNVERIFIED flag and that this isn't a welfare claim
  about Kraft Heinz's own practices, the flag→action mapping default is to
  omit unless the founder wants purchaser-side context surfaced.
- Strongest legitimate finding: the gestation-stall pledge-softening pattern
  (2012→2018→2023), sourced to Kraft Heinz's own successive disclosures —
  usable with a date caveat, framed as evolving language, not as "broken
  promise" (that characterization itself is advocacy-sourced/UNVERIFIED).
- Drop the unconfirmed August 2025 OSHA fragment — insufficient corroboration
  to reach user-facing copy.
- Everything else: no changes from Stage 2's own flags. Stage 2's basis
  labeling in this file was unusually careful and disciplined; this fact-check
  found no claims presented as more certain than their sourcing supports.
