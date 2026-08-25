# Bolthouse Farms — Fact-Check (Agent 2)

Fact-checked 2026-08-23. Role: verify claims in `bolthouse-farms_raw.md` against primary sources. Not a rewrite — this file only appends a flag and, where found, a primary URL per claim. See flag key at bottom.

## Ownership / intro claim

- Ownership per brief: Butterfly Equity; a 2025 Hain Celestial 10-Q SEC filing surfaced referencing Bolthouse in a corporate-transaction context, not independently verified. **UNVERIFIED** — out of scope for this pass (task did not ask to resolve ownership). Carry the raw file's own flag forward: do not assert an ownership correction without a dedicated pass.

## Lobbying

- Senate LDA `client_name=Bolthouse` → count 0. **VERIFIED** — the zero-result API response is itself the primary-source finding (lda.gov direct API, queried 2026-08-23). Publishable as "no registered federal lobbying activity found."

## Donations

- FEC "Bolthouse" query rate-limited (HTTP 429) after the Bellisio query consumed the demo-key quota; fec.gov web search UI and general web search both returned no PAC. **UNVERIFIED** — not independently confirmed via a clean direct API call this pass (unlike Bellisio's donations finding, which had a clean zero-result API response). Per brief: **donations → null**, do not assert a confirmed zero. Recommend a follow-up direct query to `api.open.fec.gov/v1/names/committees/?q=Bolthouse` once the rate limit clears.

## Issues (recalls, settlements, litigation)

1. **Oct 15, 2025 — CA Prop 65 cadmium settlement, AG# 2025-00655.** **VERIFIED, adjudicated.** Confirmed directly via CA OAG primary record: https://oag.ca.gov/node/599294 — 60-day notice filed 2025-02-28 by Environmental Health Advocates, Inc. against Wm. Bolthouse Farms, Inc. and Ralphs Grocery Company; settled 2025-10-15; **$3,000 non-contingent civil penalty + $24,500 attorney's fees/costs = $27,500 total.** This is a signed settlement, i.e. adjudicated, not merely alleged. **Product-name resolution: the CA OAG primary record names the product "Bolthouse Farms Immunity Juice- Carrot, Turmeric, Ginger."** This confirms the raw file's correction and the task brief's version — the correct name is **"Bolthouse Farms Immunity Juice – Carrot, Turmeric, Ginger."** The original brief's "1915 Organic Immunity Juice" is **not** the product named in the OAG record and should not be used. (Note: the settlement PDF itself — https://oag.ca.gov/system/files/prop65/settlements/2025-00655S6233.pdf — could not be cleanly text-extracted by the fetch tool in this pass; the figures and product name above are confirmed via the OAG notice page directly, which is itself a primary AG record, not a secondary summary.) **Publishable, current, adjudicated.**
2. **June 2016 — protein drink recall, ~3.8M bottles.** **UNVERIFIED against a primary FDA.gov page** — no fda.gov press release or enforcement-report URL could be located in this pass (searched directly and via `site:fda.gov`); the only company-side primary source found is Bolthouse's own recall notice page (bolthouse.com/newsalert), corroborated by multiple independent secondary outlets (Food Safety News, Food Engineering) and a DLA/commissary subsistence bulletin republishing the notice. Facts (3.8M bottles, spoilage, Protein PLUS + Mocha Cappuccino lines, best-by 6/20–9/18/2016) are consistent across all sources with no contradiction. Recommend: publishable with a hedge ("per company recall notice and multiple news reports; FDA enforcement-database record not independently located this pass") rather than citing it as FDA-confirmed. STALE flag does not apply (2016 is within the >2020 test only insofar as it's old — flag as **dated but not disqualifying**, since Prop 65 (2025) is the current headline item and this is supporting history).
3. **Oct–Nov 2012 — Salmonella carrot-chip recall.** **STALE**, per brief. Corroborated by company press release (thecampbellscompany.com, a primary corporate source, since Bolthouse is a Campbell's subsidiary as of the time of that release) and multiple secondary outlets; no fda.gov primary page located either. Pre-2020 → background only, do not use as current-risk framing.
4. **PFAS class actions — Tate v. Bolthouse (1:23-cv-01038, E.D. Cal.) and Smith v. Bolthouse (2:23-cv-00373).** **UNVERIFIED as to outcome / ALLEGED as to merits** — complaint PDFs (classaction.org) confirm the suits were filed as described (parties, case numbers, filing date, claims), but these are ALLEGED claims, not adjudicated findings; the "previously dismissed" note in raw is itself unconfirmed against a docket. Per brief: **hedge or omit** — do not present the PFAS allegation (e.g. "~95x EPA advisory level") as an established fact. If used at all, must be framed explicitly as "plaintiffs allege," never as a company admission or finding.
5. **Felix v. Wm. Bolthouse Farms (1:19-cv-00312, E.D. Cal.).** **UNVERIFIED** — source page 403'd, nature of claims not confirmed, pre-2020 docket activity. **Must omit** per brief.
6. **OSHA inspection IDs.** **UNVERIFIED** — inspection records exist on osha.gov's establishment database, but no citation/violation/penalty detail was retrievable this pass, and an inspection record alone is not evidence of a violation. **Must omit** per brief.

## Tally

- Publishable now, current, adjudicated: Prop 65 cadmium settlement (Oct 15, 2025) — VERIFIED via CA OAG primary record, product name resolved.
- Publishable as background with a sourcing hedge (no FDA.gov primary page located, but well-corroborated): 2016 protein drink recall; 2012 carrot-chip Salmonella recall (also STALE).
- Must omit: PFAS class actions (ALLEGED only, unless explicitly hedged as allegations); Felix v. Bolthouse (UNVERIFIED); OSHA inspections (UNVERIFIED, no citation detail).
- Lobbying: VERIFIED zero. Donations: UNVERIFIED (rate-limited) → **null**, not a confirmed zero.

## Bolthouse product-name resolution (headline finding)

The CA Attorney General's primary Prop 65 notice record (oag.ca.gov/node/599294) names the product **"Bolthouse Farms Immunity Juice- Carrot, Turmeric, Ginger."** The task brief's original name, "1915 Organic Immunity Juice," does not match any name in the primary AG record and should be dropped. Use "Bolthouse Farms Immunity Juice – Carrot, Turmeric, Ginger" going forward.

## Flag key

VERIFIED = primary source directly confirms (URL recorded). UNVERIFIED = secondary only, or source unreachable. DISPUTED = conflicting sources / contradicted by a higher-authority source. STALE = event predates 2020 — factually fine, flag for framing (not "current risk").
