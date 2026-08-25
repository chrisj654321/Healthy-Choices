# Wave 02 company resolution

Status: **COMPLETE — ownership-only resolution 2026-08-23**

Scope: ownership resolution only for Base Culture, Simple Kneads, Seven Sundays, Safe Catch, Season Brand, Bonafide Provisions, and Bare Bones. This file does not add political, lobbying, regulatory, or legal-issue claims and does not modify the live company database.

## Initial local-database check

- None of the seven requested brand names or proposed IDs currently has a matching `COMPANY_DB` record or `BRAND_TO_COMPANY` alias in `src/data/companies.js`.
- The raw product checkpoint proposes distinct IDs for all seven brands. Each remains blocked from formatting until its current legal owner is verified.
- Any recommended new record will use `null`, not `0`, for unknown lobbying, donation, revenue, employee, and sustainability fields. Empty issue arrays mean no issue research was performed in this ownership-only pass.

## Final mapping recommendations

| Product brand | Exact recommended `companyId` | Existing/new | Resolution | Confidence / blocker |
|---|---|---|---|---|
| Base Culture | `base-culture` | New | Base Culture, Inc. is the current operating legal entity. Flowers Foods is an investor, not the parent: its FY2025 Form 10-K says it neither controls nor can significantly influence Base Culture. | High. No ownership blocker. |
| Simple Kneads | `simple-kneads` | New | The legal operator is Shiloh's Five Loaves, Inc. d/b/a Simple Kneads. | High. No ownership blocker. |
| Seven Sundays | `seven-sundays` | New | The legal operator is Seven Sundays, LLC, a Minnesota LLC. Its current site describes the business as a family business; historical outside investments do not establish a controlling parent. | High for the legal operator; no controlling parent was found. No ownership blocker. |
| Safe Catch | `safe-catch` | New | Safe Catch, Inc. is the current brand owner and operating entity. A February 2026 trademark application remains in Safe Catch, Inc.'s name. | High for the current legal brand owner; no controlling parent was found. No ownership blocker. |
| Season Brand | `mutandis` | New | Mutandis SCA acquired 100% of Season Brand LLC in 2021, and Mutandis' 2024 annual report still includes Season Brand LLC in its consolidated reporting perimeter. | High. Use the ultimate-parent ID, not `season-brand`. Backup product only. |
| Bonafide Provisions | `blount-fine-foods` | New | Transaction adviser Cody Peak identifies Blount Fine Foods as the counterparty in its completed sell-side engagement for Bonafide Provisions LLC. Bonafide Provisions LLC remains the operating/trademark-holding entity, so map the product to ultimate parent Blount Fine Foods. | Medium-high. The parties did not publish a dated acquisition release or price; the named sell-side adviser is direct transaction evidence. No formatting blocker if this documented parent mapping is accepted. |
| Bare Bones | `bare-bones` | New | The current operator and brand owner is Barebones Ventures, LLC. Current company terms, team page, and a 2025 USPTO filing all identify the same entity/founder-led operation. | High for the current legal owner; no controlling parent was found. Backup product only. |

## Evidence by company

### Base Culture

- The SEC Form D filed June 11, 2024 identifies the issuer as **Base Culture, Inc.**, a Delaware corporation, and lists its Clearwater operating address: https://www.sec.gov/Archives/edgar/data/1725048/000172504824000004/xslFormDX01/primary_doc.xml
- Flowers Foods' FY2025 Form 10-K says it invested $9 million in 2022 and another $2 million in 2023, but explicitly says Flowers does not control Base Culture and cannot significantly influence it. Flowers accounts for the holding as an investment in an unconsolidated affiliate: https://www.sec.gov/Archives/edgar/data/1128928/000119312526071441/flo-20260103.htm
- The Florida Division of Corporations lists Base Culture, Inc. as an active foreign corporation as of its current record: https://search.sunbiz.org/Inquiry/corporationsearch/SearchResultDetail?aggregateId=forp-f25000001985-eb584523-2c91-4cd6-a249-0d87e7169e2b

**Conclusion:** Base Culture is a separate owner for catalog-diversity counting. Do not map it to existing `flowers-foods`.

### Simple Kneads

- The SEC's April 30, 2024 annual-report filing identifies the issuer as **Shiloh's Five Loaves, Inc. d/b/a Simple Kneads**, a North Carolina corporation, and ties it directly to `simplekneads.com`: https://www.sec.gov/Archives/edgar/data/1619148/000110465924055080/xslC_X01/primary_doc.xml
- The underlying SEC filing index confirms the legal entity, CIK, address, and annual-report period: https://www.sec.gov/Archives/edgar/data/1619148/0001104659-24-055080-index.html
- The live manufacturer site continues to identify Tristaun LeClaire as founder/CEO and presents Simple Kneads as the same operating bakery: https://simplekneads.com/

**Conclusion:** Use a distinct `simple-kneads` company record whose legal name is Shiloh's Five Loaves, Inc. Historical crowdfunding investors are not a parent-company mapping.

### Seven Sundays

- A 2023 SEC Form D identifies **Seven Sundays, LLC**, a Minnesota LLC, with founders Hannah and Brady Barnstable as executive officers, directors, and promoters: https://www.sec.gov/Archives/edgar/data/1625492/000162549223000003/xslFormDX01/primary_doc.xml
- The live company About page identifies Hannah and Brady as founders and calls Seven Sundays a family business: https://sevensundays.com/pages/about
- Seven Sundays announced that it acquired its longtime manufacturing partner in June 2025, evidence that the operating company remained an active acquirer rather than a brand folded into another food conglomerate: https://www.linkedin.com/posts/seven-sundays-llc_weve-officially-welcomed-birch-to-the-family-activity-7376244254328905728-O6nI
- Seven Sundays' own press archive reports a 15% Katjesgreenfood investment in 2017. That is a minority investment and is not evidence of parent control: https://sevensundays.com/pages/press-info

**Conclusion:** Use `seven-sundays`. Do not map the brand to SunOpta merely because SunOpta supplies an ingredient, and do not map it to Katjes based on the disclosed minority stake.

### Safe Catch

- Safe Catch, Inc.'s February 2, 2026 USPTO application for its core Safe Catch mark identifies **Safe Catch, Inc.** as the current applicant/owner: https://tsdr.uspto.gov/#caseNumber=99628125&caseSearchType=US_APPLICATION&caseType=DEFAULT&searchType=statusSearch
- A 2025 California Attorney General notice independently identifies Safe Catch, Inc. and the Safe Catch tuna product/UPC: https://oag.ca.gov/prop65/60-Day-Notice-2025-00305
- The current company site remains `safecatch.com`; no primary-source acquisition announcement or current trademark assignment to another company was found.

**Conclusion:** Use a distinct `safe-catch` record. This is a legal-owner resolution, not a finding that the company has no outside investors.

### Season Brand — backup

- Mutandis announced an agreement to acquire 100% of Season Brand LLC on June 2, 2021: https://mutandis.com/wp-content/uploads/2021/06/Mutandis_Press-release.pdf
- Mutandis' subsequent prospectus says the transaction closed at the end of July 2021 and gives the final purchase price: https://mutandis.com/wp-content/uploads/2022/01/Extrait-du-Prospectus-vis%C3%A9.pdf
- Mutandis' 2024 annual financial report includes Season Brand LLC in the group's consolidated reporting perimeter and says it is managed by Mutandis USA: https://mutandis.com/wp-content/uploads/2025/03/MUTANDIS-RFA-2024.pdf

**Conclusion:** If this backup product is used, map it to new ultimate-parent ID `mutandis`, not `season-brand`.

### Bonafide Provisions

- Bonafide's current terms identify **Bonafide Provisions, LLC** as the operating entity: https://www.bonafideprovisions.com/pages/terms-conditions
- A September 2025 trademark filing remains in Bonafide Provisions, LLC's name, consistent with the acquired brand continuing as a legal subsidiary/brand owner: https://tsdr.uspto.gov/#caseNumber=99421433&caseSearchType=US_APPLICATION&caseType=DEFAULT&searchType=statusSearch
- Cody Peak, the transaction adviser, lists its Bonafide Provisions LLC sell-side engagement and names **Blount Fine Foods** as the counterparty: https://codypeakadv.com/experience/
- Blount's own current About page says Blount Fine Foods is family-owned and operated and headquartered in Rhode Island: https://blountfinefoods.com/about-us

**Conclusion:** Map Bonafide products to ultimate-parent ID `blount-fine-foods`. Retain Bonafide Provisions LLC in the parent's subsidiaries/brands list.

### Bare Bones — backup

- Current terms identify **Barebones Ventures LLC** as the contracting entity and state that the site content belongs to or is licensed to Barebones Ventures, LLC: https://www.barebonesbroth.com/pages/terms-and-conditions
- The live team page identifies Ryan and Katherine Harvey as co-founders and Katherine Harvey as chief executive: https://www.barebonesbroth.com/pages/our-story
- A June 2025 USPTO opposition-extension filing identifies Barebones Ventures, LLC as a Delaware LLC at its current Ohio address: https://ttabvue.uspto.gov/ttabvue/ttabvue-99040493-EXT-1.pdf

**Conclusion:** Use `bare-bones`. No current controlling parent was verified.

## Minimal proposed company records

These are ownership-safe stubs only. They intentionally contain no invented revenue, headcount, lobbying, donations, issues, or sustainability score. Political analysis and its required independent review pipeline must occur before any user-facing issue copy is added.

```js
'base-culture': {
  id: 'base-culture',
  name: 'Base Culture, Inc.',
  hq: 'Clearwater, Florida, USA',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=baseculture.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['Base Culture'],
  sustainabilityScore: null,
},

'simple-kneads': {
  id: 'simple-kneads',
  name: "Shiloh's Five Loaves, Inc. d/b/a Simple Kneads",
  hq: 'Graham, North Carolina, USA',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=simplekneads.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['Simple Kneads'],
  sustainabilityScore: null,
},

'seven-sundays': {
  id: 'seven-sundays',
  name: 'Seven Sundays, LLC',
  hq: 'Bloomington, Minnesota, USA',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=sevensundays.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['Seven Sundays', 'Birch Packaging'],
  sustainabilityScore: null,
},

'safe-catch': {
  id: 'safe-catch',
  name: 'Safe Catch, Inc.',
  hq: 'Sausalito, California, USA',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=safecatch.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['Safe Catch'],
  sustainabilityScore: null,
},

'mutandis': {
  id: 'mutandis',
  name: 'Mutandis SCA',
  hq: 'Casablanca, Morocco',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=mutandis.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['Season Brand LLC', 'Season Brand'],
  sustainabilityScore: null,
},

'blount-fine-foods': {
  id: 'blount-fine-foods',
  name: 'Blount Fine Foods Corp.',
  hq: 'Warren, Rhode Island, USA',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=blountfinefoods.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['Blount Fine Foods', 'Bonafide Provisions', 'Bonafide Provisions, LLC'],
  sustainabilityScore: null,
},

'bare-bones': {
  id: 'bare-bones',
  name: 'Barebones Ventures, LLC',
  hq: 'Sylvania, Ohio, USA',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=barebonesbroth.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['Bare Bones', 'Bare Bones Broth'],
  sustainabilityScore: null,
},
```

## Required brand aliases when records are eventually approved

```js
'base culture': 'base-culture',
'simple kneads': 'simple-kneads',
'seven sundays': 'seven-sundays',
'safe catch': 'safe-catch',
'season brand': 'mutandis',
'bonafide provisions': 'blount-fine-foods',
'bare bones': 'bare-bones',
'bare bones broth': 'bare-bones',
```

## Scope and legal-safety notes

- This ownership pass does not claim that an independent company has no investors. It only distinguishes minority/non-controlling investment from a verified parent-company relationship.
- `null` is mandatory for money and political fields not researched. Do not change these values to zero.
- Bonafide is the only preferred product here whose verified legal operator should not be used as the ultimate-parent `companyId`.
- Season Brand and Bare Bones were retained as resolved backups even though the coordinator currently prefers Safe Catch/Crown Prince and Bonafide/College Inn combinations.
- Before merging any stub into `companies.js`, the normal political-analysis research, fact-check, legal-writing, and legal-review pipeline remains required if user-facing company issues or political fields will be populated.

---

## Wave 1 follow-up

Status: **COMPLETE — ownership-only resolution, 2026-08-23**

Scope: current ultimate-owner and legal-entity resolution for Strong Roots, A Dozen Cousins, Little Sesame, and Mr. Dell's. No live company data is changed here.

### Initial database check

- None of the proposed IDs `mccain`, `a-dozen-cousins`, `little-sesame`, or `westin-foods` currently exists as a `COMPANY_DB` record or `BRAND_TO_COMPANY` alias in `src/data/companies.js`.
- Strong Roots and Mr. Dell's have parent-company candidates in the Wave 1 raw research. A Dozen Cousins and Little Sesame require confirmation that outside funding did not establish a controlling parent.
- Final IDs, primary-source evidence, safe stubs, aliases, and blockers are recorded below.

### Final recommendations

| Brand | Recommended `companyId` | Existing/new | Current ultimate owner / operator | Confidence | Blocker |
|---|---|---|---|---|---|
| Strong Roots | `mccain` | New | McCain Foods Group Inc. is the McCain-family holding company and ultimate governance body; McCain Foods Limited is the operating company that completed the acquisition | High | None for ownership mapping |
| A Dozen Cousins | `verde-valle-foods` | New | Acquired by Verde Valle Foods in May 2025; the official Verde Valle site is owned and operated by Productos Verde Valle, S.A. de C.V. | High for group mapping | The private group does not publish the exact intercompany share chain between the Mexican parent and U.S. subsidiary |
| Little Sesame | `little-sesame` | New | Little Sesame Inc. | High | No controlling parent is disclosed; do not convert the 2025 Series A lead investor into a parent-company mapping |
| Mr. Dell's | `westin-foods` | New | Westin Foods; Mr. Dell's Foods, LLC is the current brand/legal operator | High for parent mapping | Westin's public pages use the trade name “Westin Foods” but do not disclose a corporate suffix for the parent |
| Mestemacher | `mestemacher` | New | Mestemacher GmbH, owned by members of the Detmers family | High | None for ownership mapping |

None of these IDs currently exists in `COMPANY_DB` or `BRAND_TO_COMPANY`. “New” means a company record is required before the selected product can merge; it does not authorize editing the live company file in this pass.

### Strong Roots → `mccain`

- McCain Foods' April 11, 2024 release calls the transaction a **completed acquisition** and says Strong Roots will remain a distinct business unit. Operational independence does not make Strong Roots independently owned: https://www.mccain.com/information-centre/news/strong-roots-set-for-global-growth-as-mccain-foods-deepens-partnership-in-vegetable-forward-sustainable-food/
- McCain's current leadership page states that McCain Foods Limited is privately held and that ultimate governance is provided by McCain Foods Group Inc., the McCain-family holding company: https://www.mccain.com/about-us/our-leadership/
- McCain's current contact page identifies the operating company as McCain Foods Limited and its corporate head office in Toronto: https://www.mccain.com/contact/
- Resolution: map Strong Roots to `mccain`. The minimal record should represent the ultimate McCain group, while naming McCain Foods Limited as the operating company.

### A Dozen Cousins → `verde-valle-foods`

- Verde Valle Foods' official May 14, 2025 announcement says A Dozen Cousins joined the Verde Valle Foods family and links to the acquisition announcement: https://www.verdevallefoods.com/news/big-news-a-dozen-cousins-joins-verde-valle-foods
- Verde Valle Foods' current official brand portfolio lists A Dozen Cousins among its brands: https://www.verdevallefoods.com/our-brands
- The same official site's privacy notice states that the site is owned and operated by Productos Verde Valle, S.A. de C.V.; its Spanish privacy notice also covers that entity's affiliates and subsidiaries: https://www.verdevallefoods.com/privacy-notice and https://www.verdevallefoods.com/es/aviso-de-privacidad
- Resolution: replace the stale proposed independent ID `a-dozen-cousins` with `verde-valle-foods`. Use the recognizable group ID but identify Productos Verde Valle, S.A. de C.V. as the legal group operator. The precise private-company share chain between Productos Verde Valle and Verde Valle Foods, Inc. is not publicly stated, so do not claim a percentage or transaction value.

### Little Sesame → `little-sesame`

- Little Sesame's current terms identify Little Sesame Inc. as the owner/operator of the site, content, and registered marks: https://www.eatlittlesesame.com/pages/terms-and-conditions
- The SEC's Form D identifies Little Sesame Inc. as a Delaware corporation and its principal place of business as Washington, D.C.: https://www.sec.gov/Archives/edgar/data/1717020/000171702019000002/xslFormDX01/primary_doc.xml
- The company's July 15, 2025 financing announcement describes an $8.5 million Series A led by InvestEco Capital, with several participating investors. It does not describe an acquisition or a controlling parent: https://www.businesswire.com/news/home/20250715607602/en/Little-Sesame-Closes-%248.5M-Series-A-Funding-to-Fuel-Rapid-Growth
- Resolution: use `little-sesame`. Treat the named firms as investors only. No primary source reviewed establishes that InvestEco or another investor controls Little Sesame Inc.

### Mr. Dell's → `westin-foods`

- Mr. Dell's current official history states that Westin Foods purchased the business in 2019 and describes Westin as family-owned: https://www.mrdells.com/about
- The current footer on that page identifies the operating entity as Mr. Dell's Foods, LLC.
- Westin Foods' official site says Westin Capital Group is a privately held family business with no outside investors and identifies Scott Carlson as owner and CEO: https://www.westinfoods.com/
- Westin's official FAQ says Westin Foods is privately owned, has privately held shareholders, and is headquartered in Omaha: https://www.westinfoods.com/faqs
- Resolution: map Mr. Dell's to `westin-foods`. Keep `Mr. Dell's Foods, LLC` as an operator/subsidiary. Because Westin does not publish a legal corporate suffix on the reviewed pages, the legally safe display name is simply “Westin Foods.”

### Mestemacher → `mestemacher`

- Mestemacher's official company history states that Mestemacher GmbH has belonged to members of the Detmers family since 1985: https://www.mestemacher-gmbh.com/company/the-lifestyle-bakery-concept/
- Its official legal notice identifies Mestemacher GmbH, its Gütersloh address, managing director, and trade-register number HRB 1604: https://www.mestemacher.de/legal-note/
- Resolution: use `mestemacher`. No controlling parent is disclosed; the Detmers family owns the operating company directly. This is a distinct company for brand-diversity counting.

### Minimal ownership-only company stubs

These stubs intentionally leave all unresearched political, lobbying, financial, workforce, and sustainability fields null or empty. They are handoff material only and must still pass the normal company-review pipeline before a live merge.

```js
'mccain': {
  id: 'mccain',
  name: 'McCain Foods Group Inc.',
  hq: 'Canada',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=mccain.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['McCain Foods Limited', 'McCain Foods', 'Strong Roots'],
  sustainabilityScore: null,
},

'verde-valle-foods': {
  id: 'verde-valle-foods',
  name: 'Productos Verde Valle, S.A. de C.V.',
  hq: 'Zapopan, Jalisco, Mexico',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=verdevallefoods.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['Verde Valle Foods, Inc.', 'Verde Valle', 'Isadora', 'A Dozen Cousins'],
  sustainabilityScore: null,
},

'little-sesame': {
  id: 'little-sesame',
  name: 'Little Sesame Inc.',
  hq: 'Washington, District of Columbia, USA',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=eatlittlesesame.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['Little Sesame'],
  sustainabilityScore: null,
},

'westin-foods': {
  id: 'westin-foods',
  name: 'Westin Foods',
  hq: 'Omaha, Nebraska, USA',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=westinfoods.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ["Mr. Dell's Foods, LLC", "Mr. Dell's"],
  sustainabilityScore: null,
},

'mestemacher': {
  id: 'mestemacher',
  name: 'Mestemacher GmbH',
  hq: 'Gütersloh, Germany',
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=mestemacher-gmbh.com&sz=256',
  lobbyingSpend: null,
  lobbyingTargets: [],
  lobbyingSpendYear: null,
  lobbyingSource: null,
  politicalDonations: null,
  donationSplit: null,
  donationSplitYear: null,
  donationSplitSource: null,
  issues: [],
  subsidiaries: ['Mestemacher'],
  sustainabilityScore: null,
},
```

### Required Wave 1 brand aliases when records are approved

```js
'strong roots': 'mccain',
'mccain foods': 'mccain',
'a dozen cousins': 'verde-valle-foods',
'verde valle': 'verde-valle-foods',
'verde valle foods': 'verde-valle-foods',
'little sesame': 'little-sesame',
"mr. dell's": 'westin-foods',
'mr dells': 'westin-foods',
'mr dell foods': 'westin-foods',
'mestemacher': 'mestemacher',
```

### Wave 1 legal-safety notes

- Strong Roots' “distinct business unit” language concerns operations and brand stewardship, not ownership; it remains part of the McCain group.
- A Dozen Cousins must not be counted as an independent-company diversity slot after the May 2025 acquisition.
- Little Sesame's outside financing is not enough to infer control. The record should remain at Little Sesame Inc. unless a later primary source documents an acquisition or controlling parent.
- Westin's exact registered parent suffix remains unpublished on the reviewed first-party pages. Do not expand “Westin Foods” into an assumed Inc., LLC, or Corp.
- Mestemacher is a Detmers-family company with no disclosed controlling parent and qualifies as a separate company for diversity.
