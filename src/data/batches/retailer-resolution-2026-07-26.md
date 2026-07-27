# Retailer / Private-Label Ownership Resolution — 2026-07-26

Research pass on the 24 US grocery retailer / private-label brand-owner strings from Open Food Facts
(18,345 SKUs, 14.8% of catalog). Goal: resolve each to a real, current (2026) parent company so store
brands stop resolving to nothing.

Checked `src/data/companies.js` (284 records at time of research) before proposing anything new.
Existing keys relevant to this batch: `walmart`, `albertsons`, `heb`, `kroger`, `target`, `trader-joes`,
`publix`, `wegmans`, `costco`. No entry existed for any of: `meijer`, `hy-vee`, `giant-eagle`, `weis`,
`schnuck(s)`, `nash-finch`, `hannaford`, `raleys`, `big-y`, `tops`, `stater-bros`, `harris-teeter`,
`delhaize`, `walgreens`, `price-chopper`, `brookshire`, `cvs`, `ahold`, `supervalu`, `unfi`,
`spartannash`, `c-and-s`, or `awg`.

**No edits made to `companies.js` or `products.js` — this is a research deliverable only.**

---

## Resolution table

| Brand-owner string (OFF) | Resolved current parent (2026) | companyId | Source(s) | Confidence |
|---|---|---|---|---|
| Wal-Mart Stores, Inc. | Walmart Inc. (legal name changed Feb 1, 2018 — same entity) | `walmart` (EXISTING) | [Walmart 8-K, Feb 1 2018 (SEC)](https://www.sec.gov/Archives/edgar/data/0000104169/000010416918000013/form8-kx212018.htm) | high |
| Safeway, Inc. | Albertsons Companies, Inc. (acquired by Cerberus-led AB Acquisition LLC Jan 30, 2015; Albertsons/Safeway combined entity now trades as Albertsons Companies, Inc., NYSE: ACI) | `albertsons` (EXISTING) | [Albertsons/Cerberus merger-complete release](https://www.cerberus.com/media-center/albertsons-safeway-complete-merger-transaction/); existing companies.js record already lists Safeway as subsidiary | high |
| Meijer, Inc. | Independent — 100% Meijer family owned, private, no parent | `meijer` (**NEW**) | [Forbes — Meijer family profile](https://www.forbes.com/profile/meijer/) | high |
| Ahold USA, Inc. | Koninklijke Ahold Delhaize N.V. (folded into the "Ahold Delhaize USA" holding structure formed Jan 2018, post 2016 Ahold/Delhaize merger) | `ahold-delhaize` (**NEW**) | [Grocery Dive — Ahold Delhaize USA 10-year timeline](https://www.grocerydive.com/news/ahold-delhaize-usa-adusa-timeline-10-year-merger-anniversary/825596/); [Ahold Delhaize N.V. Euronext profile](https://www.tradingview.com/symbols/EURONEXT-AD/) | high |
| Hy-Vee, Inc. | Independent — employee-owned, private | `hy-vee` (**NEW**) | [Hy-Vee corporate — "your employee-owned grocery store"](https://www.hy-vee.com/corporate/our-company/) | high |
| Supervalu, Inc. | United Natural Foods, Inc. (UNFI) — wholly-owned subsidiary since Oct 22, 2018 acquisition | `unfi` (**NEW**) | [UNFI IR — "UNFI Completes Transformative Acquisition of SUPERVALU"](https://ir.unfi.com/news/press-release-details/2018/UNFI-Completes-Transformative-Acquisition-Of-SUPERVALU/default.aspx) | high |
| Giant Eagle, Inc. | Independent — 5 Pittsburgh families, private. **FLAG: Kroger announced a definitive agreement to acquire Giant Eagle for $1.65B on July 1, 2026 — deal NOT yet closed** as of this research (2026-07-27) | `giant-eagle` (**NEW**, note pending Kroger deal) | [Kroger IR — Giant Eagle acquisition announcement, July 1 2026](https://ir.kroger.com/news/news-details/2026/Kroger-Announces-Agreement-to-Acquire-Giant-Eagle/default.aspx); [LegalClarity — five founding families](https://legalclarity.org/who-owns-giant-eagle-five-families-behind-the-chain/) | high |
| Associated Wholesale Grocers, Inc. | Independent — retailer-owned cooperative (1,100+ member companies), no external parent | `awg` (**NEW**) | [AWG corporate site](https://awginc.com/); [The Shelby Report — AWG centennial, 2026](https://theshelbyreport.com/2026/03/23/awgs-cooperative-strength-positions-independent-grocers-for-future/) | high |
| Weis Markets, Inc. | Independent — publicly traded (NYSE: WMK), Weis family holds ~65% voting control; not owned by another company | `weis-markets` (**NEW**) | [dcf-model.com — Weis Markets ownership](https://dcf-model.com/blogs/history/wmk-history-mission-ownership); [Yahoo Finance WMK](https://finance.yahoo.com/quote/WMK/) | high |
| Schnuck Markets, Inc. | Independent — 100% Schnuck family owned, private | `schnucks` (**NEW**) | [Wikipedia — Schnucks](https://en.wikipedia.org/wiki/Schnucks) | medium-high (Wikipedia; family-ownership claim not cross-checked against a second primary source) |
| Nash Finch Company | C&S Wholesale Grocers, LLC. Chain of custody: Nash Finch merged into Spartan Stores in Nov 2013 → renamed SpartanNash Co. (NASDAQ: SPTN) → **SpartanNash acquired by C&S Wholesale Grocers, deal closed Sept 22, 2025** ($1.77B) | `c-and-s-wholesale` (**NEW**) | [C&S Wholesale Grocers — "Completes Acquisition of SpartanNash"](https://corporate.spartannash.com/C-S-Wholesale-Grocers-Completes-Acquisition-of-SpartanNash) | high |
| Hannaford Bros. Co. | Koninklijke Ahold Delhaize N.V. (Hannaford is one of the ADUSA banners; was a Delhaize Group brand pre-2016 merger) | `ahold-delhaize` (**NEW**, same record as Ahold USA / Delhaize America) | [Grocery Dive — ADUSA banners include Hannaford](https://www.grocerydive.com/news/ahold-delhaize-usa-adusa-timeline-10-year-merger-anniversary/825596/) | high |
| Food Town Stores Inc. | **COULD NOT VERIFY** — see unverifiable section | `null` | — | — |
| Raley's | The Raley's Companies — independent, private, family-owned (Thomas P. Raley, 1935); also owns Bashas', Food City, Nob Hill Foods, Bel Air, AJ's Fine Foods banners | `raleys` (**NEW**) | [The Raley's Companies — Our Story](https://theraleyscompanies.com/our-story/) | high |
| H E Butt Grocery Company | H-E-B (same lineage entity, now operates as H-E-B, LP) | `heb` (EXISTING) | existing companies.js record | high |
| Big Y Foods, Inc. | Independent — private, D'Amour family owned | `big-y` (**NEW**) | [Wikipedia — Big Y](https://en.wikipedia.org/wiki/Big_Y) | medium-high |
| Tops Markets, LLC | Northeast Grocery, Inc. (formed by the 2021 Tops/Price Chopper-Market 32 merger; Golub family holds majority ownership). **FLAG: Northeast Grocery retained UBS in Aug 2025 to explore a sale of the whole company — no buyer/completion confirmed as of the most recent reporting found (March 2026)** | `northeast-grocery` (**NEW**) | [Progressive Grocer — "Is Northeast Grocery Exploring a Sale?"](https://progressivegrocer.com/northeast-grocery-exploring-sale); [Wikipedia — Northeast Grocery](https://en.wikipedia.org/wiki/Northeast_Grocery) | high (ownership) / medium (sale-exploration status, evolving) |
| Stater Bros. Markets Inc. | Independent — private, Stater Bros. Holdings Inc. is a subsidiary of La Cadena Investments, majority-owned by the Jack H. Brown Revocable Trust | `stater-bros` (**NEW**) | [pestel-analysis.com — Stater Bros ownership](https://pestel-analysis.com/blogs/owners/staterbros); [Wikipedia — Stater Bros.](https://en.wikipedia.org/wiki/Stater_Bros.) | medium (secondary/blog sources; no primary filing found since Stater Bros is private and non-reporting) |
| Harris-Teeter Inc. | The Kroger Co. — wholly-owned subsidiary since Jan 28, 2014 acquisition | `kroger` (EXISTING) | [PRNewswire — "Kroger Completes Merger with Harris Teeter"](https://www.prnewswire.com/news-releases/kroger-completes-merger-with-harris-teeter-242556901.html) | high — **note for reviewer: `kroger.subsidiaries` in companies.js does not currently list Harris Teeter; consider adding** |
| Delhaize America, Inc. | Koninklijke Ahold Delhaize N.V. (Food Lion, Giant/Martin's under the former Delhaize America umbrella, now under ADUSA) | `ahold-delhaize` (**NEW**, same record) | [Grocery Dive — ADUSA banners](https://www.grocerydive.com/news/ahold-delhaize-usa-adusa-timeline-10-year-merger-anniversary/825596/) | high |
| Walgreens Co. | Now private. Walgreens Boots Alliance, Inc. was acquired by Sycamore Partners; deal closed Aug 28, 2025. WBA delisted from Nasdaq and split into 5 standalone companies (Walgreens, The Boots Group, Shields Health Solutions, CareCentrix, VillageMD), all under Sycamore Partners ownership | `walgreens` (**NEW**) | [Sycamore Partners — "Completes Acquisition of Walgreens Boots Alliance," Aug 28 2025](https://www.sycamorepartners.com/news-article/sycamore-partners-completes-acquisition-of-walgreens-boots-alliance); [FierceHealthcare — Sycamore closes acquisition, splits into 5 companies](https://www.fiercehealthcare.com/finance/sycamore-partners-closes-acquisition-walgreens-splits-pharmacy-retailer-5-standalone) | high |
| Price Chopper Supermarkets | Northeast Grocery, Inc. (same entity as Tops Markets — 2021 merger) | `northeast-grocery` (**NEW**, same record) | same as Tops Markets row | high |
| Brookshire Grocery Company | Independent — private, third/fourth-generation Brookshire family owned | `brookshire-grocery` (**NEW**) | [Tyler Economic Development Council — Brookshire Grocery Company](https://tedc.org/success-and-news/success-in-tyler/brookshire-grocery-company); [Wikipedia — Brookshire's](https://en.wikipedia.org/wiki/Brookshire's) | high |
| CVS Pharmacy, Inc. | CVS Health Corporation (NYSE: CVS) — CVS Pharmacy is the retail-pharmacy operating subsidiary | `cvs-health` (**NEW**) | [Wikipedia — CVS Health](https://en.wikipedia.org/wiki/CVS_Health); public SEC filer (ticker CVS) | high |

---

## New records needed (19 brand-owner strings → 16 distinct new companyIds)

Only verified facts included. No revenue/employee figures unless a primary source confirmed them —
mostly omitted since sources found were market-cap/stock-quote pages, not verified revenue statements.

1. **`meijer`** — Meijer, Inc. HQ: Grand Rapids, Michigan (implied by Midwest operations; not independently re-verified beyond family/ownership sources — flag HQ for reviewer to double check against Meijer's own site). Private, 100% family-owned (Meijer family: Hank, Doug, Mark Meijer). Not publicly traded. Store brands: Meijer (private label), True Goodness, Purple Cow. *(Brand names beyond "Meijer" itself not independently verified this pass — flag for photo/label confirmation before use as brand→company mapping.)*
2. **`ahold-delhaize`** — Koninklijke Ahold Delhaize N.V. HQ: Zaandam, Netherlands. Public, Euronext Amsterdam: AD. US operating brands (ADUSA banners, all confirmed by source above): Food Lion, Giant Food, The Giant Company, Hannaford, Stop & Shop. Store-brand lines commonly associated with these banners: Nature's Promise, Taste of Inspirations (not independently verified this pass — flag before using as brand mappings).
3. **`hy-vee`** — Hy-Vee, Inc. HQ: West Des Moines, Iowa (per Hy-Vee corporate site). Private, employee-owned (ESOP). Not publicly traded.
4. **`unfi`** — United Natural Foods, Inc. HQ: Providence, Rhode Island. Public, NYSE: UNFI. Owns Supervalu (wholly-owned subsidiary since 2018), which itself historically supplied/owned banners like Cub Foods, Shopper's Food Warehouse (verify before use — not independently confirmed this pass).
5. **`giant-eagle`** — Giant Eagle, Inc. HQ: Pittsburgh, Pennsylvania. Private, owned by 5 founding families (Goldstein, Porter, Chait, Moravitz, Shapira). Not publicly traded. **Pending acquisition by Kroger announced July 1, 2026 — do not merge into `kroger` until deal closes.** Store brands: Giant Eagle, Market District (not independently verified as trademark owner this pass).
6. **`awg`** — Associated Wholesale Grocers, Inc. HQ: Kansas City, Kansas. Cooperative — 100% owned by 1,100+ independent member-retailers. Not publicly traded, no single parent. Supplies private-label lines (Best Choice, Always Save) to member stores (not independently verified this pass — flag before use).
7. **`weis-markets`** — Weis Markets, Inc. HQ: Sunbury, Pennsylvania. Public, NYSE: WMK. Weis family holds ~65% of voting power (controlled public company, not a subsidiary of anyone).
8. **`schnucks`** — Schnuck Markets, Inc. HQ: St. Louis, Missouri. Private, 100% Schnuck family owned.
9. **`c-and-s-wholesale`** — C&S Wholesale Grocers, LLC. HQ: Keene, New Hampshire. Private, majority owned by Richard B. Cohen. Recently acquired SpartanNash Company (which itself had absorbed Nash Finch Company in the 2013 merger) — deal closed Sept 22, 2025, $1.77B.
10. **`raleys`** — The Raley's Companies. HQ: West Sacramento, California. Private, family-founded (Thomas P. Raley, 1935). Store banners: Raley's, Bel Air, Nob Hill Foods, Raley's O-N-E Market, Bashas', Bashas' Diné, Food City, AJ's Fine Foods, Eddie's Country Store.
11. **`big-y`** — Big Y Foods, Inc. HQ: Springfield, Massachusetts. Private, D'Amour family owned (cousins Charles and Michael D'Amour).
12. **`northeast-grocery`** — Northeast Grocery, Inc. HQ: Schenectady, New York. Private, Golub family majority owners (formed by 2021 merger of Price Chopper/Market 32 and Tops Friendly Markets). Banners: Tops, Price Chopper, Market 32. **Flag: company retained UBS in Aug 2025 to explore a sale; unresolved as of the most recent (March 2026) reporting found — re-verify before shipping if this batch is used much later.**
13. **`stater-bros`** — Stater Bros. Markets Inc. HQ: San Bernardino, California (per company history; not independently re-confirmed this pass beyond secondary sources — flag). Private, ultimate control via La Cadena Investments / Jack H. Brown Revocable Trust.
14. **`walgreens`** — Walgreens (post-split standalone company). HQ: Deerfield, Illinois (historical WBA/Walgreens HQ; not independently re-confirmed post-split — flag for reviewer). Now privately held under Sycamore Partners (private-equity owner, NY-based) since the Aug 28, 2025 deal close. No longer public (formerly Nasdaq: WBA, delisted).
15. **`brookshire-grocery`** — Brookshire Grocery Company. HQ: Tyler, Texas. Private, Brookshire family owned (3rd/4th generation). Banners: Brookshire's, Super 1 Foods, Spring Market, FRESH by Brookshire's.
16. **`cvs-health`** — CVS Health Corporation. HQ: Woonsocket, Rhode Island. Public, NYSE: CVS. CVS Pharmacy, Inc. is the retail-pharmacy operating subsidiary; CVS Health also owns CVS Caremark (PBM) and Aetna (insurance) — not relevant to grocery/private-label scope.

---

## Could not verify

- **Food Town Stores Inc.** (527 SKUs) — genuinely ambiguous, left `null`. Two candidate chains surfaced in research, **neither confirmed as the exact legal entity behind this OFF brand-owner string**:
  - *Lewis Food Town, Inc.* — private Houston-area chain (~29 stores), DBA "Food Town," founded by Ross Lewis in 1993/94. Legal name does not match "Food Town Stores Inc." exactly.
  - *Foodtown* (NY/NJ/CT cooperative, ~66 stores) — historically owned by Twin County Grocers (bankrupt 1998), now supplied by Allegiance Retail Services. Also does not match the legal-entity string.
  - No source found that displays "Food Town Stores, Inc." as a registered legal name with a UPC company prefix. Do not guess which chain this is — reviewer/Octavius should treat any future SKUs under this brand-owner as `companyId: null` until someone finds the actual GS1 registrant.

No other entities in the list of 24 were left unresolved.

---

## Entities acquired/merged/dissolved since the OFF data was collected (explicit flags)

- **Wal-Mart Stores, Inc.** → renamed Walmart Inc., Feb 1, 2018 (same entity, name-only change).
- **Safeway, Inc.** → acquired by Albertsons/Cerberus-led AB Acquisition LLC, closed Jan 30, 2015.
- **Supervalu, Inc.** → acquired by United Natural Foods, Inc., closed Oct 22, 2018 (delisted from NYSE).
- **Nash Finch Company** → merged into Spartan Stores to form SpartanNash Co., Nov 2013; **SpartanNash itself then acquired by C&S Wholesale Grocers, closed Sept 22, 2025** ($1.77B) — two consolidation events since the original data point.
- **Tops Markets, LLC** and **Price Chopper Supermarkets** (Golub/Northeast Grocery) → merged into single parent Northeast Grocery, Inc., completed Nov 2021.
- **Ahold USA, Inc.** and **Delhaize America, Inc.** → merged via the 2016 Ahold/Delhaize combination; formal "Ahold Delhaize USA" parent structure established Jan 2018.
- **Walgreens Co.** (via Walgreens Boots Alliance) → WBA taken private by Sycamore Partners, closed Aug 28, 2025; delisted from Nasdaq, split into 5 standalone companies.
- **Harris-Teeter Inc.** → acquired by The Kroger Co., closed Jan 28, 2014.
- **Giant Eagle, Inc.** → **PENDING** acquisition by The Kroger Co. announced July 1, 2026 ($1.65B); not yet closed as of this research date (2026-07-27). Treat as still-independent until confirmed closed.
- **Northeast Grocery, Inc.** → **PENDING/UNRESOLVED**: reported (Aug 2025, via UBS) to be exploring a sale of the whole company; no buyer or completion found in the most recent (March 2026) reporting. Re-verify before relying on this long-term.

---

## Report summary

**Counts:**
- Resolved to an **existing** `companyId`: **4** — `walmart` (Wal-Mart Stores, Inc.), `albertsons` (Safeway, Inc.), `heb` (H E Butt Grocery Company), `kroger` (Harris-Teeter Inc.)
- Resolved to a **NEW** `companyId` needed: **19 brand-owner strings → 16 distinct new records** (`meijer`, `ahold-delhaize` ×3 strings, `hy-vee`, `unfi`, `giant-eagle`, `awg`, `weis-markets`, `schnucks`, `c-and-s-wholesale`, `raleys`, `big-y`, `northeast-grocery` ×2 strings, `stater-bros`, `walgreens`, `brookshire-grocery`, `cvs-health`)
- **Unverifiable**: 1 — Food Town Stores Inc. (`companyId: null`, do not guess)

**Which of the 24 already roll up into a record we have:** Wal-Mart Stores, Inc. → `walmart`; Safeway, Inc. → `albertsons`; H E Butt Grocery Company → `heb`; Harris-Teeter Inc. → `kroger`. That's it — only 4 of 24 map onto existing records. The task brief's hint that "several of these entities no longer exist independently" is real, but it mostly plays out as **consolidation among themselves** (Nash Finch + Hannaford/Delhaize/Ahold + Tops/Price Chopper), not consolidation into records this app already had, except for the Kroger/Albertsons/Walmart/H-E-B cases above.

**Flagged for the reviewer, ranked by how much it should worry you:**
1. **Giant Eagle** — a real, signed acquisition agreement with Kroger exists (announced 6 days before this research, July 1 2026) but has not closed. If it closes before this data ships, `giant-eagle` should immediately be merged into `kroger` and Giant Eagle added to `kroger.subsidiaries`. Recommend re-checking Kroger IR before applying this batch.
2. **Northeast Grocery** (Tops + Price Chopper parent) — actively shopping itself since Aug 2025 per UBS-run process; no result found as of the latest (Mar 2026) coverage. Ownership could change under this record with no further OFF-data signal.
3. **Food Town Stores Inc.** — left null rather than guessed. If this brand carries meaningful SKU volume in the actual products.js catalog (not just OFF's aggregate), it may be worth a dedicated Octavius research pass with retailer-site label photos (UPC company-prefix lookup) rather than general web search, since general search couldn't disambiguate the two "Food Town" candidates.
4. **HQ addresses and store-brand-name lists for the 16 new records** are mostly secondary-source (Wikipedia, trade press, "who owns X" blog aggregators) rather than primary filings, because 14 of 16 are privately held with no SEC reporting. Confidence is marked per-row above; nothing here is fabricated, but a couple of HQ addresses (Meijer, Stater Bros, post-split Walgreens) came from my own knowledge of the companies rather than a source pulled in this session and are flagged inline as "not independently re-confirmed" — worth a quick spot-check before treating as gospel.
5. **`kroger.subsidiaries` in the existing companies.js is missing Harris Teeter** — a one-line factual gap unrelated to this task's scope but easy to fix in the same review pass.
6. Store-brand name lists under each new company (e.g., Meijer's "True Goodness," AWG's "Best Choice") are noted where I recalled them but could **not** independently confirm this session — do not treat those specific sub-bullets as verified; only the headline ownership facts and the explicitly-sourced banner names (Raley's, Brookshire's, Ahold Delhaize's five ADUSA banners) are solid.

No political/lobbying/donation data was researched or written for any of these entities per task scope — that stays with `/political-analysis`.
