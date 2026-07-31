// src/data/research/sourcing/meat-poultry/tyson_final.js
module.exports = {
  companyId: 'tyson',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-07-30',

    model: 'contract-farms',
    modelSource: {
      name: "Tyson Foods press release on the Progressive Beef program (a licensed quality-management system for feedlot operators covering food safety, antibiotic stewardship, environmental practices, and animal-welfare best practices); by 2020 Tyson had purchased 3M+ Progressive Beef-certified cattle, described at the time as more than half of its cattle supply chain — read as evidence of a contract-feedlot supply structure for cattle. Tyson's overall company-wide sourcing-model disclosure (contract vs. owned herds/flocks) was not independently confirmed in this research pass; SEC 10-K risk-factor text, which would normally describe this, could not be fetched (systematic HTTP 403 on sec.gov Archives URLs across this entire research batch).",
      url: 'https://www.tysonfoods.com/news/news-releases/2020/9/tyson-foods-becomes-first-us-food-company-verify-sustainable-cattle-production',
      date: '2020-09-09',
      basis: 'company-disclosure',
    },

    certifications: [],

    welfareMeatPoultry: {
      gapStep: 'unknown',
      gapStepSource: {
        name: "Global Animal Partnership's own Manufacturers directory page does not list Tyson (checked directly, 2026-07-30). A separate, uncorroborated secondary claim attributed to Open Philanthropy Project states GAP achieves scale partly through contracts with large producers 'including Tyson Foods' — this was not traced to Open Philanthropy's original publication and conflicts with the directory finding. Independent fact-check WebSearch reconfirmed both sides exist with no resolution either way. Status stays genuinely DISPUTED/unresolved — not a confirmed absence of any GAP relationship, and not confirmed presence either.",
        url: 'https://globalanimalpartnership.org/partners/manufacturers/',
        date: '2026-07-30',
        basis: 'third-party-audit',
      },
      grassFinished: 'not-claimed',
      grassFinishedSource: {
        name: "Tyson's own consumer-education blog post explains grass-fed vs. grass-finished terminology without claiming any specific Tyson product is grass-finished. Tyson's beef sustainability program, Progressive Beef, is a feedlot quality-management/food-safety program, not a grass-fed or grass-finished welfare certification (see practices[]). No American Grassfed Association certification was found for any Tyson-family brand, though the AGA directory could not be directly fetched (HTTP 403) — its absence is not confirmed as exhaustive.",
        url: 'https://thefeed.blog/2021/09/27/how-to-read-food-labels-on-beef-and-pork/',
        date: '2021-09-27',
        basis: 'company-disclosure',
      },
      gestationCrateStatus: 'unknown',
      gestationCrateSource: {
        name: "Tyson's CEO has stated the company can supply California Prop 12-compliant (crate-free) pork to meet market demand, and news coverage reports Tyson supplying California with compliant pork — but this describes supply capability for a specific state market, not a company-wide gestation-crate-free claim or status. No independent certifier (GAP, Certified Humane, AGW) was found confirming Tyson's own gestation-crate practices.",
        url: 'https://www.agriculturedive.com/news/prop-12-compliance-is-here-in-New-Year-California-pork/703660/',
        date: '2026-07-30',
        basis: 'company-disclosure',
      },
      chillMethod: 'air-chilled',
      chillMethodSource: {
        name: "Tyson's own 2018 press release confirms it acquired Tecumseh Poultry LLC, owner of the air-chilled, organic Smart Chicken brand, which now operates as a wholly-owned Tyson subsidiary — independently corroborated by Lincoln Journal Star, The Shelby Report, Feedstuffs, and Talk Business & Politics. This applies to the Smart Chicken brand specifically; Tyson's flagship Tyson-brand fresh chicken's own chilling method was not confirmed in this research (industry-standard water-chilling is the default for most U.S. commodity chicken, but no direct Tyson statement was found either way).",
        url: 'https://www.tysonfoods.com/news/news-releases/2018/6/tyson-foods-acquires-one-leading-brands-organic-chicken',
        date: '2018-06-04',
        basis: 'company-disclosure',
      },
      scorecards: [],
    },

    enforcement: [
      {
        year: 2016,
        body: 'U.S. District Court, Northern District of Illinois — In re Broiler Chicken Antitrust Litigation (MDL)',
        action:
          "Tyson Breeders, Inc. is a named defendant in the consolidated multidistrict litigation alleging chicken processors conspired to fix broiler chicken prices, alongside Pilgrim's Pride, Sanderson Farms, and other processors. The docket (filed 2016-09-02) remains active with no termination date recorded. (Kraft Heinz also appears in this same docket, but as a purchaser/plaintiff, not a defendant — see the separate kraft-heinz companyId record; the two roles should never be conflated.)",
        status: 'pending',
        amount: null,
        source: {
          name: "CourtListener docket (primary court record, Stage 1 script pull), cross-checked against the Lockridge Grindal Nauen case tracker's defendant list and a 2025 court-order defendant roster — Tyson appears on every independent version of the defendant list found",
          url: 'https://www.courtlistener.com/docket/4508538/in-re-broiler-chicken-antitrust-litigation/',
        },
      },
      {
        year: 2021,
        body: 'U.S. Department of Justice, Antitrust Division — criminal chicken price-fixing investigation',
        action:
          "According to Food Dive and Food & Power, Tyson was the first company to cooperate under the DOJ's Corporate Leniency Program in connection with a criminal investigation into chicken price-fixing (conduct alleged 2012-2017), and as a result avoided criminal prosecution; Tyson separately paid a reported $80 million to resolve related civil claims. Pilgrim's Pride, a co-defendant in the same investigation, pleaded guilty to a criminal charge and paid a $108 million fine. The exact date of Tyson's own civil payment was not independently confirmed in this research; presented here in the context of the investigation's broader resolution window.",
        status: 'settled',
        amount: null,
        source: {
          name: 'Food Dive; Food & Power (secondary trade/news reporting, consistent detail, not independently confirmed against a DOJ primary document)',
          url: 'https://www.fooddive.com/news/tyson-foods-exchanges-cooperation-for-leniency-in-price-fixing-probe/579602/',
        },
      },
      {
        year: 2022,
        body: 'U.S. District Court, District of Minnesota — In re Cattle and Beef Antitrust Litigation (MDL No. 3031)',
        action:
          "Tyson Foods, Inc. and Tyson Fresh Meats, Inc. are named defendants, alongside Cargill Meat Solutions, Swift Beef Company, JBS USA Food Company, and National Beef Packing Company, in litigation alleging collusion among major beef packers. The docket (JPML consolidation 2022-03-10, case filed 2022-06-03) remains active with no termination date recorded.",
        status: 'pending',
        amount: null,
        source: {
          name: 'CourtListener docket (primary court record, Stage 1 script pull)',
          url: 'https://www.courtlistener.com/docket/63363039/in-re-cattle-and-beef-antitrust-litigation/',
        },
      },
      {
        year: 2025,
        body: 'Direct-purchaser and consumer plaintiffs — In re Cattle and Beef Antitrust Litigation, D. Minnesota',
        action:
          "According to Bloomberg Law, Feedstuffs, Meatingplace, and JDJournal, Tyson agreed in December 2025 to an $82.5 million settlement with direct-purchaser plaintiffs in the cattle/beef antitrust litigation (reported structure: $80 million settlement fund plus $2.5 million in notice/administration costs), with preliminary court approval granted May 2026 by Judge John Tunheim. Tyson also previously agreed to pay a reported $55 million to resolve related consumer price-fixing claims in the same litigation. Both figures were reported consistently across four independent outlets but not independently confirmed against the underlying court filing.",
        status: 'settled',
        amount: null,
        source: {
          name: 'Bloomberg Law; Feedstuffs; Meatingplace; JDJournal — four independent outlets reporting consistent figures and structure',
          url: 'https://news.bloomberglaw.com/antitrust/tyson-foods-wins-first-approval-of-83-million-price-fixing-deal',
        },
      },
      {
        year: 2025,
        body: 'Purchaser plaintiffs — pork price-fixing multidistrict litigation',
        action:
          "According to NBC News, Insurance Journal, Food Dive, Supply Chain Dive, and Talk Business & Politics, Tyson agreed to pay a reported $85 million in 2025 to settle a proposed class action alleging collusion to inflate pork prices — described by these outlets as the largest settlement to date in the pork antitrust MDL. This is separate from Hormel's own, smaller pork-litigation settlement (see the hormel companyId record). Not independently confirmed against the underlying court filing; exact article URLs for this specific figure were not captured during research.",
        status: 'settled',
        amount: null,
        source: {
          name: 'NBC News; Insurance Journal; Food Dive; Supply Chain Dive; Talk Business & Politics',
          url: 'https://www.fooddive.com/',
        },
      },
      {
        year: 2025,
        body: 'Environmental Working Group v. Tyson Foods, Inc. (settlement)',
        action:
          "Tyson launched 'Brazen Beef' in September 2023 (a joint venture with Schweid & Sons) marketed as 'climate-smart' and moving toward 'net zero,' including a USDA-approved 'climate-friendly' claim citing a 10% greenhouse-gas reduction. The Environmental Working Group sued Tyson in 2024 alleging greenwashing — that Tyson never defined 'climate-smart beef' or disclosed how the reduction was measured. According to EWG, Earthjustice, Food Processing, and Bloomberg (a financial outlet with no stake in the case), plus a case write-up from UK law firm Peters & Peters (a third party to the case), Tyson settled in November 2025: it agreed to stop making 'net zero' and 'climate-smart beef' claims, to halt marketing, selling, or promoting Brazen Beef in the U.S. for five years, and not to make new environmental claims without verification by a jointly agreed-upon expert. Per Peters & Peters, Tyson did not admit wrongdoing. The settlement agreement's own text was not independently read in this research (the document was located but could not be rendered for text extraction).",
        status: 'settled',
        amount: null,
        source: {
          name: 'Environmental Working Group; Earthjustice; Food Processing; Bloomberg; Peters & Peters (case commentary) — independently corroborating, including at least one non-advocacy, non-party source',
          url: 'https://earthjustice.org/press/2025/tyson-foods-agrees-to-stop-making-net-zero-and-climate-smart-beef-claims',
        },
      },
    ],

    practices: [
      {
        claim:
          "Progressive Beef — a licensed quality-management program covering food safety, antibiotic stewardship, environmental practices, and animal-welfare best practices for feedlot operators in Tyson's cattle supply chain. Tyson began licensing it in 2018 and reported purchasing over 3 million Progressive Beef-certified cattle by 2020, described at the time as more than half of its cattle supply chain. This is a feedlot quality-management/food-safety program, not a grass-fed or grass-finished welfare certification.",
        basis: 'company-disclosure',
        source: {
          name: "Tyson Foods press release, \"Tyson Foods Becomes First U.S. Food Company to Verify Sustainable Cattle Production Practices at Scale\"",
          url: 'https://www.tysonfoods.com/news/news-releases/2020/9/tyson-foods-becomes-first-us-food-company-verify-sustainable-cattle-production',
          date: '2020-09-09',
        },
      },
      {
        claim:
          "According to trade press, Tyson changed its 'no antibiotics ever' branded-chicken claim to 'No Antibiotics Important to Human Medicine' (completed by end of 2023), which allows ionophores (not classified as medically important antibiotics) in some chickens' diets for fresh/frozen/ready-to-eat branded products.",
        basis: 'company-disclosure',
        source: {
          name: "Supermarket Perimeter, \"Tyson updates its 'no antibiotics ever' policy\" (secondary trade press; the underlying USDA AMS Process Verified Program page could not be independently fetched — HTTP 403)",
          url: 'https://www.supermarketperimeter.com/articles/9916-tyson-updates-its-no-antibiotics-ever-policy',
          date: '2026-07-30',
        },
      },
      {
        claim:
          "USDA AMS lists a 'Tyson Foods, Inc. Process Verified Program' and a separate 'Tyson Fresh Meats Process Verified Program.' Program scope and audit details were not independently confirmed — the USDA AMS pages describing them could not be fetched directly.",
        basis: 'government-record',
        source: {
          name: 'USDA Agricultural Marketing Service (page existence confirmed via search-result title match; page content not independently fetched — HTTP 403)',
          url: 'https://www.ams.usda.gov/content/tyson-foods-inc-process-verified-program',
          date: '2026-07-30',
        },
      },
    ],
  },
};
