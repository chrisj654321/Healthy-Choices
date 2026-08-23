# Wildway company resolution

Research date: 2026-08-22
Resolution status: **RESOLVED WITH BANKRUPTCY DISCLOSURE — current federal trademark owner remains Wildway, LLC**

## Pre-merge verification completed 2026-08-22

- The official USPTO Trademark Search service was queried by serial number `86581216` for the registered WILDWAY food mark. The current record is live and lists `Wildway LLC (LIMITED LIABILITY COMPANY; TEXAS, USA)` as the current owner for granola, breakfast cereal, and related foods.
- The latest publicly accessible PACER-derived docket reproduction for Western District of Texas case `26-51606-mmp`, checked 2026-08-22, still lists Wildway, LLC as the Chapter 7 debtor and shows no asset-sale or trademark-transfer entry through its latest displayed filing on 2026-07-28.
- Wildway's current official store continues selling the exact packaged granolas in this batch under Wildway, LLC's website terms.

No completed assignment, acquirer, or different packaged-product operator was found. Accordingly, `companyId: 'wildway'` is the most current documented mapping. Chapter 7 is retained as a material ownership-status caveat; the mapping must be revisited if the trustee later sells or assigns the brand.

Official owner-search endpoint used: `https://tmsearch.uspto.gov/prod-v1-0-0/tmsearch` (serial-number query for `86581216`).

## Company identity

- **Legal company name:** Wildway, LLC.
- **Entity type:** Texas limited liability company. Wildway's current terms define “Wildway” as Wildway, LLC, a Texas limited liability company. The same page later calls it a “Texas corporation”; that inconsistent phrase should not override the more specific LLC identification. [Official Wildway terms](https://wildwayoflife.com/pages/online-orders-terms-conditions)
- **Business location:** San Antonio, Texas. The official terms list 10203 Kotzebue St. #115, San Antonio, TX 78217. CCOF's current certification directory independently lists Wildway, LLC at the same street and suite 115. [Official Wildway terms](https://wildwayoflife.com/pages/online-orders-terms-conditions) · [CCOF certified-member record](https://ccof.org/directory-member/wildway-llc/)
- **Official website:** https://wildwayoflife.com/
- **Founder/current public brand representative:** Kyle Koehler. Wildway's current About page identifies Kyle as founder; CCOF lists Kyle Koehler as the company contact. This supports brand continuity but does not establish equity ownership. [Official About page](https://wildwayoflife.com/pages/new-about) · [CCOF certified-member record](https://ccof.org/directory-member/wildway-llc/)
- **Proposed `companyId`:** `wildway`
- **Proposed display name:** `Wildway, LLC`
- **Brand aliases:** `Wildway`; `Wildway Granola` (common product/brand wording, not verified as a formal DBA); `Wildway of Life` (website/domain wording, not verified as a formal DBA).
- **Court-listed DBAs requiring legal confirmation before use as customer-facing aliases:** `Wildway`, `Wild Tree Farms`, and `Wildway Food`.

## Ownership / parent conclusion

No reliable current source located in this review identifies a parent company or completed acquisition of the Wildway brand. Wildway's own current terms identify Wildway, LLC as the website and product operator, while the current brand site continues to identify Kyle as founder. Therefore, use **Wildway, LLC as the provisional company of record**, not a guessed parent.

This is not proof that Wildway, LLC remains the ultimate beneficial owner. Texas public records do not provide sufficient free shareholder detail to establish private-company equity ownership, and a recent bankruptcy filing creates a material possibility that the brand or other assets may be transferred.

## Material current-status finding

A PACER-derived reproduction of the U.S. Bankruptcy Court docket reports that Wildway, LLC filed a voluntary Chapter 7 case in the Western District of Texas on June 15, 2026, case **26-51606-mmp**. The reproduced docket identifies the debtor as Wildway, LLC, lists DBAs Wildway, Wild Tree Farms, and Wildway Food, and shows activity through July 28, 2026. [PACER-derived docket reproduction](https://www.inforuptcy.com/browse-filings/texas-western-bankruptcy-court/5%3A26-bk-51606/bankruptcy-case-wildway-llc)

Because Chapter 7 may lead to asset abandonment or transfer, the coordinator should confirm the latest PACER docket and current trademark/brand owner immediately before merge. No verified post-filing buyer or completed brand transfer was found in this research.

## Safe schema recommendation

The existing `companies.js` schema can safely receive a **minimal identity record** without political or legal issue claims:

```js
'wildway': {
  id: 'wildway',
  name: 'Wildway, LLC',
  hq: 'San Antonio, Texas, USA',
  parentCompany: null,
  revenue: null,
  employees: null,
  logo: 'https://www.google.com/s2/favicons?domain=wildwayoflife.com&sz=256',
  subsidiaries: ['Wildway'],
  sustainabilityScore: null,
},
```

### Do not infer or auto-fill

- Do not set `lobbyingSpend`, `politicalDonations`, or donation splits to zero; no search sufficient to prove zero was completed here.
- Do not assign a sustainability score from brand marketing or certifications.
- Do not add an empty `issues` array as an affirmative “no issues” conclusion.
- Do not publish bankruptcy language in customer-facing copy until the official court docket is checked and the wording receives legal/fact review.
- Do not list Kyle Koehler as current owner; current sources establish founder/contact status, not present equity ownership.

## Coordinator decision

- **Company-ID validation:** Can be unblocked provisionally with `companyId: 'wildway'` and the minimal identity record above.
- **Final ownership validation:** Remains open because the June 2026 Chapter 7 case may affect who owns or operates the brand.
- **Recommended merge gate:** Confirm the latest official court docket and verify that Wildway, LLC still owns/operates the packaged products being added. If assets were transferred, replace the provisional parent mapping with the documented buyer before merging.
