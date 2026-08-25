const REANALYZED_ISSUES = {
  'talking-rain': [
    {
      id: 'water-ad-ftc-referral',
      title: 'NAD Referred "Water" Ads to FTC',
      severity: 'medium',
      description: 'The National Advertising Division (NAD) determined that Talking Rain\'s "The Adventurous Side of Water" and "The Bold Side of Water" taglines for Sparkling Ice could mislead consumers, following a challenge by Nestlé. After Talking Rain declined to comply with the NAD determination, NAD referred the matter to the FTC; the FTC received the referral and entered the case in its public legal library, but no formal FTC enforcement action against Talking Rain has been documented.',
      source: 'FTC Legal Library; BBB National Programs NAD case decisions; TINA.org',
    },
    {
      id: 'natural-flavors-lawsuit',
      title: 'Class Action: "Natural Flavors" Claims Disputed',
      severity: 'low',
      description: 'A class-action lawsuit filed in 2018 alleged that Sparkling Ice\'s "natural flavors" marketing was misleading given the presence of additives including malic acid. According to TINA.org coverage, the matter was reportedly resolved, but no court order or settlement amount has been confirmed via primary sources.',
      source: 'TINA.org; classaction.org',
    },
    {
      id: 'cherry-limeade-recall-2018',
      title: 'Voluntary Recall: Off-Taste Cherry Limeade',
      severity: 'low',
      description: 'Talking Rain voluntarily recalled Sparkling Ice Cherry Limeade in 2018 in response to customer complaints of off-taste and off-odor. The FDA Safety Alert confirmed no illnesses were reported in connection with the recall.',
      source: 'FDA Safety Alert, 2018',
    },
    {
      id: 'former-ceo-misconduct',
      title: 'Former CEO Named in 2017 Sexual Assault Lawsuit',
      severity: 'medium',
      description: 'A former Talking Rain sales manager filed a lawsuit in 2017 alleging sexual assault by the company\'s then-CEO and subsequent retaliation; the CEO departed the company that year. The case was reportedly resolved confidentially in 2018, and no ongoing pattern of leadership misconduct has been documented at the company.',
      source: 'Seattle Times, 2017; KIRO 7, 2017',
    },
  ],

  'boston-beer': [
    {
      id: 'truly-securities-lawsuit-dismissed',
      title: 'Investor Fraud Suit Dismissed on Appeal',
      severity: 'medium',
      description: 'Investors sued Boston Beer alleging securities fraud related to the 2021 collapse of Truly Hard Seltzer demand, which resulted in a large inventory write-off and significant stock drop. The U.S. District Court for the Southern District of New York dismissed the case in December 2022, and the Second Circuit upheld the dismissal in November 2023, finding no actionable misrepresentation.',
      source: 'Brewbound, November 2023; Boston Globe, November 2023; SEC filings',
    },
    {
      id: 'ardagh-jury-verdict-191m',
      title: '$191M Jury Verdict for Contract Breach',
      severity: 'high',
      description: 'A jury in the U.S. District Court for the Northern District of Illinois returned a verdict of $175.5 million against Boston Beer on April 6, 2026, in favor of can supplier Ardagh Metal Packaging, after finding Boston Beer breached a long-term supply contract; pre-judgment interest brought the total to approximately $191 million. Boston Beer has appealed, and the matter is pending.',
      source: 'Brewbound, April 2026; Food Dive, April 2026; Boston Beer 8-K SEC filings; Law360',
    },
    {
      id: 'employee-noncompete-lawsuits',
      title: 'Former Employees Sue Over Non-Competes',
      severity: 'medium',
      description: 'Multiple former Boston Beer sales representatives filed lawsuits in 2024 alleging hostile work environment, gender discrimination, and improper use of non-compete agreements; the cases include allegations that non-competes were used to block workers from joining competing employers. The lawsuits are pending as of 2026.',
      source: 'Brewbound, 2024; Boston Globe, March 2024',
    },
  ],

  'mark-anthony-brands': [
    {
      id: 'asa-youth-marketing-2026',
      title: 'UK Regulator Ruled White Claw Ads Targeted Youth',
      severity: 'medium',
      description: 'The UK Advertising Standards Authority (ASA) issued ruling A26-1327600 on March 25, 2026, finding that three Mark Anthony Brands Instagram Stories from October–November 2025 featured individuals appearing under 25 years old and that the "#studentwavemakers" campaign directly targeted students, in violation of CAP Code rule 18.16 governing alcohol advertising. The ASA ordered the ads not to appear again in their current form.',
      source: 'ASA official ruling A26-1327600, March 25, 2026; The Spirits Business, March 2026',
    },
    {
      id: 'underage-exposure-research',
      title: 'Academic Research: High Underage Ad Exposure',
      severity: 'medium',
      description: 'Published research from the Center on Alcohol Marketing and Youth (CAMY) at Boston University documented that hard seltzer advertising — including White Claw — reached underage audiences at rates exceeding industry self-regulatory thresholds. The findings support concerns about health-adjacent marketing of White Claw to audiences who include minors.',
      source: 'CAMY, Boston University; Alcohol Justice, 2022',
    },
    {
      id: 'white-claw-health-halo',
      title: 'Health-Adjacent Marketing of Alcoholic Drinks',
      severity: 'medium',
      description: 'White Claw products are marketed with calorie counts, low-carb messaging, and imagery associated with active lifestyles, a practice consumer health advocates describe as a "health halo" framing for alcoholic beverages. Regulatory scrutiny in both the US and UK has identified these patterns as potentially misleading to consumers.',
      source: 'CAMY, 2022; ASA ruling A26-1327600, 2026',
    },
  ],

  'bimbo': [
    {
      id: 'allergen-labeling-fda-warning',
      title: 'FDA Warning Letter: Sesame Labeling Violations',
      severity: 'medium',
      description: 'FDA issued a warning letter (reference 672140, dated June 17, 2024) to Bimbo Bakeries USA following a late 2023 inspection of its Phoenix, Arizona facility, citing violations related to sesame allergen labeling on Sara Lee Artesano products. The Center for Science in the Public Interest (CSPI) and the food allergy advocacy group FARE issued public statements raising concern about the company\'s response and the risk to consumers with sesame allergies.',
      source: 'FDA warning letter 672140, June 17, 2024; CSPI, 2024; Allergic Living, 2024',
    },
    {
      id: 'metal-wire-bread-recall-2023',
      title: 'Metal Wire Fragments Recalled from Bread',
      severity: 'medium',
      description: 'Bimbo Bakeries USA announced a voluntary recall on February 19, 2023, covering multiple bread brands (including Sara Lee, Great Value, Kroger, Nature\'s Harvest, and L\'Oven Fresh) due to possible contamination with flexible metal wire originating from a faulty flour mill screen. No injuries were reported in connection with the recall.',
      source: 'Multiple sources confirming February 2023 recall; Natural Products Insider',
    },
    {
      id: 'driver-misclassification-lawsuit',
      title: 'DOL Intervened in Worker Misclassification Suit',
      severity: 'high',
      description: 'A lawsuit filed in U.S. District Court in Vermont in October 2022 alleged that Bimbo Bakeries USA misclassified delivery drivers as independent contractors in violation of the Fair Labor Standards Act; the U.S. Department of Labor filed an amicus brief in March 2023 opposing Bimbo\'s counterclaim, and the counterclaim was dismissed in December 2023. The underlying case remains pending; the Second Circuit ruled in May 2026 to limit the geographic scope of the collective action.',
      source: 'HR Dive, 2023; Food Business News, 2023; VTDigger, 2023; Second Circuit, May 2026',
    },
  ],

  'flowers-foods': [
    {
      id: 'ca-misclassification-135m',
      title: '$135M Settlement: California Driver Misclassification',
      severity: 'high',
      description: 'A California federal court approved a settlement of approximately $135 million gross (including a $55 million core fund for roughly 475 plaintiffs and approximately $50 million in territory repurchases) in Ludlow v. Flowers Foods, resolving claims that Flowers Foods misclassified bread delivery drivers as independent contractors rather than employees. The settlement received final court approval in 2024 according to law firm Nicholas & Tomasevic.',
      source: 'Nicholas & Tomasevic (nicholaslaw.org); Flowers Foods SEC 8-K filings; Food Business News, 2024',
    },
    {
      id: 'multistate-misclassification-55m',
      title: '$55M FLSA Settlement: Multi-State Drivers',
      severity: 'high',
      description: 'Flowers Foods agreed to a separate $55 million settlement to resolve federal FLSA misclassification claims brought by delivery route drivers across multiple states. Together with the California settlement, Flowers Foods\' documented costs from driver misclassification litigation total more than $200 million.',
      source: 'Staffing Industry Analysts; Law360 Employment Authority, 2023',
    },
    {
      id: 'ca-distribution-restructure',
      title: 'California Operations Converted to Employed Drivers',
      severity: 'medium',
      description: 'Following the outcome of prolonged misclassification litigation, Flowers Foods restructured its California distribution model to use employed drivers rather than independent contractors, according to company SEC filings and Food Business News reporting in 2024. The change reflects a material operational shift driven by legal outcomes rather than voluntary reform.',
      source: 'Food Business News, 2024; Flowers Foods SEC 8-K filings',
    },
  ],

  'post-holdings': [
    {
      id: 'cereal-health-claims-15m',
      title: '$15M Settlement: Deceptive Cereal Health Claims',
      severity: 'medium',
      description: 'A California federal court granted preliminary approval on February 24, 2021 to a $15 million settlement resolving claims that Post used terms including "less processed," "wholesome," "nutritious," and "smart" on high-sugar cereals in a manner that mislead consumers. As part of the settlement, Post agreed to discontinue use of those terms on the affected products; the class period covered purchases from August 2012 through November 2, 2020.',
      source: 'Food Dive, 2021; National Law Review, 2021; Food Business News, March 2021',
    },
    {
      id: 'osha-bef-foods-death',
      title: 'OSHA: Worker\'s Arm Amputated at BEF Foods Plant',
      severity: 'high',
      description: 'OSHA cited BEF Foods — a Post Holdings subsidiary — for a September 2020 incident at its Lima, Ohio plant in which a sanitation worker\'s arm was caught in a running auger she was cleaning, resulting in partial amputation; OSHA proposed a $136,532 penalty and cited two repeat violations, including one previously cited at the same facility in 2016 for the same lockout/tagout hazard. The DOL classified the violations as repeat.',
      source: 'Insurance Journal, March 2021; Powder Bulk Solids, 2021; Bloomberg Law, 2021; OSHA enforcement records',
    },
    {
      id: 'michael-foods-allergen-recall',
      title: 'Michael Foods Recalled Egg Products for Allergen',
      severity: 'medium',
      description: 'Post Holdings subsidiary Michael Foods recalled Fair Meadow Foundations liquid egg products due to undeclared allergens; the recall is documented in a USDA FSIS recall alert.',
      source: 'USDA FSIS recall alert (Michael Foods Inc.)',
    },
  ],

  'b-and-g-foods': [
    {
      id: 'heavy-metals-spices-lawsuit',
      title: 'Class Action: Heavy Metals in Spice Islands & Tone\'s',
      severity: 'high',
      description: 'A class-action lawsuit (Blassingame v. B&G Foods, N.D. California, case 5:22-cv-00640) filed in 2022 alleges that specific Spice Islands and Tone\'s products contained elevated levels of lead, arsenic, and cadmium based on Consumer Reports testing published in November 2021; the named products include Spice Islands sweet basil and ground ginger and Tone\'s ground thyme. The lawsuit is pending as of 2026.',
      source: 'Consumer Reports, November 2021; classaction.org; Law Street Media, 2022; B&G Foods 10-Q filings, 2022',
    },
    {
      id: 'milk-allergen-recall',
      title: 'Voluntary Recall: Undeclared Milk in Crackers',
      severity: 'medium',
      description: 'B&G Foods issued a voluntary allergy alert and recalled a limited number of boxes of Back to Nature Organic crackers due to undeclared milk in the product; approximately 1,502 cases were affected. The FDA Safety Alert is publicly documented.',
      source: 'FDA Safety Alert (B&G Foods / Back to Nature Organic)',
    },
    {
      id: 'emeril-no-preservatives-lawsuit',
      title: 'Lawsuit: "No Preservatives" Pasta Sauce Label',
      severity: 'low',
      description: 'A class-action lawsuit (Minondo v. B&G Foods, case 23-cv-8087, EDNY) filed on October 30, 2023 alleges that Emeril\'s pasta sauces labeled "no preservatives" contain citric acid, which plaintiffs contend functions as a preservative. This is part of a broader wave of similar litigation affecting multiple food companies; the case is pending.',
      source: 'Milberg LLP complaint (filed October 30, 2023); classaction.org',
    },
  ],

  'utz-brands': [
    {
      id: 'acrylamide-prop65',
      title: 'Prop 65 Acrylamide Notice (Enforcement Now Enjoined)',
      severity: 'medium',
      description: 'The California Attorney General\'s Prop 65 database confirms a Notice of Violation (No. 2021-00857) was filed against Utz Brands for acrylamide levels in potato chips; acrylamide forms naturally during high-heat cooking of starchy foods and is classified as a probable carcinogen by the International Agency for Research on Cancer. A federal court permanently enjoined California from requiring Prop 65 dietary acrylamide warnings on food products in May 2025, though the underlying science on dietary acrylamide remains an open area of research.',
      source: 'California AG Prop 65 database, Notice No. 2021-00857; Sidley Austin LLP, May 2025',
    },
    {
      id: 'salmonella-recall-2026',
      title: 'Salmonella Recall: Zapp\'s and Dirty Chips',
      severity: 'medium',
      description: 'Utz Quality Foods voluntarily recalled certain limited varieties of Zapp\'s and Dirty Potato Chips in 2026 due to potential Salmonella contamination traced to dry milk powder in the seasoning supplied by California Dairies, Inc.; affected products carried best-by dates in July and August 2026. No illnesses were reported in connection with the recall.',
      source: 'FDA Safety Alert (Utz Quality Foods LLC, 2026); CBS News; NBC News, 2026',
    },
    {
      id: 'driver-flsa-settlement',
      title: '$2.5M Settlement: Route Driver FLSA Violations',
      severity: 'medium',
      description: 'Approximately 2,000 current and former route delivery drivers in Pennsylvania, Maryland, North Carolina, and New Jersey reached a $2.5 million FLSA settlement with Utz, resolving claims that drivers were misclassified as "outside salespersons" to avoid overtime pay requirements; the lawsuit was filed in September 2015 and the settlement was finalized approximately 2017.',
      source: 'Central Penn Business Journal; wageadvocates.com; VerdictSearch',
    },
  ],

  'treehouse-foods': [
    {
      id: 'listeria-waffles-recall-2024',
      title: 'Nationwide Listeria Recall of Frozen Waffles & Pancakes',
      severity: 'high',
      description: 'TreeHouse Foods issued two consecutive voluntary recalls in October 2024 — an initial recall on October 18 and an expanded recall on October 22 — covering frozen waffles and pancakes sold under more than 40 store-brand labels at major retailers including Walmart, Target, Kroger, Whole Foods, and Trader Joe\'s, due to potential Listeria monocytogenes contamination. TreeHouse Foods confirmed the recalls in press releases; a class-action lawsuit was subsequently filed and a settlement was reported as pending final court approval.',
      source: 'FDA recall notices, October 18 and 22, 2024; TreeHouse Foods press releases; NPR, October 2024; Consumer Reports, October 2024',
    },
    {
      id: 'securities-fraud-settlement-27m',
      title: '$27M Securities Fraud Settlement (2021)',
      severity: 'high',
      description: 'TreeHouse Foods agreed to a $27 million settlement resolving a federal securities fraud class action alleging the company misled investors about integration failures following its 2016 acquisition of ConAgra\'s private-label food business; a federal judge granted final approval in November 2021. The class period covered February 1 through November 2, 2016.',
      source: 'Food Dive; Wolf Popper LLP; Store Brands Magazine; TreeHouse Foods SEC 10-K filings',
    },
    {
      id: 'private-label-quality-risk',
      title: 'Private Label Model Creates Quality Control Risk',
      severity: 'low',
      description: 'As one of the largest US producers of store-brand food products, TreeHouse Foods manufactures under more than 40 retailer labels simultaneously, a model that Food Dive has noted creates structural quality-control challenges. The 2024 Listeria recall — which affected products sold under dozens of brand names at the same time — illustrates the breadth of consumer exposure when a single facility has a contamination event.',
      source: 'Food Dive, 2023',
    },
  ],

  'rich-products': [
    {
      id: 'worker-death-osha-willful',
      title: 'Worker Killed; OSHA Cites Willful Violation',
      severity: 'high',
      description: 'Adewale Ogunyemi, a 42-year-old sanitation worker, died on July 20, 2021 at Rich Products\' Crest Hill, Illinois facility after becoming caught in machinery; OSHA proposed a $145,027 penalty and cited a willful violation for failure to implement energy control (lockout/tagout) procedures. The Department of Labor\'s official January 2022 announcement stated the company had "an extensive history of OSHA violations nationwide" and placed Rich Products in the Severe Violator Enforcement Program.',
      source: 'DOL/OSHA press release, January 2022; Joliet Patch, January 2022; Bloomberg Law, 2022',
    },
    {
      id: 'osha-violations-pattern',
      title: 'Documented Pattern of OSHA Violations Nationwide',
      severity: 'high',
      description: 'Good Jobs First\'s Violation Tracker — a publicly accessible aggregator of federal and state enforcement records — documents multiple OSHA enforcement actions against Rich Products facilities across the country. The DOL\'s own language in its 2022 press release explicitly confirmed an "extensive history of OSHA violations nationwide" at the company.',
      source: 'Good Jobs First Violation Tracker; DOL press release, January 2022',
    },
    {
      id: 'injury-retaliation-allegation',
      title: 'Worker Allegedly Fired Day After Workplace Injury',
      severity: 'medium',
      description: 'According to a February 2023 In These Times investigation, a worker at the Crest Hill, Illinois facility was terminated the day after suffering a workplace injury, with the company citing her refusal to take a post-injury drug test; labor advocates raised concerns about retaliation and injury underreporting at the facility. The allegation has not been adjudicated.',
      source: 'In These Times, February 2023; Workday Magazine',
    },
  ],
};

module.exports = REANALYZED_ISSUES;
