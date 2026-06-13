const REANALYZED_ISSUES = {
  'illy': [
    {
      id: 'illy-coffee-sourcing-transparency',
      title: 'Limited Visibility Into Bean Sourcing',
      severity: 'low',
      description: 'Like most single-origin and blended coffee brands, illy sources from East African and Latin American regions where supply-chain monitors have flagged deforestation pressure. The company publishes Fair Trade and certification claims but offers limited farm-level traceability to consumers.',
      source: 'Global Canopy Forest Monitor, 2023',
    },
    {
      id: 'illy-premium-positioning-claims',
      title: 'Premium Health and Quality Positioning',
      severity: 'low',
      description: 'illy markets premium positioning tied to organic and Fair Trade certifications and LEED-certified Italian facilities. These certifications are verifiable, but premium pricing reflects positioning as much as measurable health benefit over mass-market coffee.',
      source: 'Fair Trade International / illy Sustainability Report, 2024',
    },
    {
      id: 'illy-thin-public-record',
      title: 'Limited Public Controversy Record',
      severity: 'low',
      description: 'No significant FDA recalls or enforcement actions against illy were identified in the 2020-2026 research window. Absence of documented issues does not guarantee absence of supply-chain risk in regions with weaker labor oversight.',
      source: 'FDA recall database review, 2026',
    },
  ],

  'e-j-gallo': [
    {
      id: 'gallo-alrb-union-interference',
      title: 'Regulator Overturned Anti-Union Elections',
      severity: 'high',
      description: 'The California Agricultural Labor Relations Board overturned worker votes to remove the United Farm Workers from Gallo operations in 2003 and again in 2007, finding the company unlawfully interfered with the elections. In the 2007 case the board cited Gallo providing a flawed and incomplete employee list that hindered union communication.',
      source: 'California ALRB decisions (Gallo 30 ALRB 2, 2004; 2007 ruling)',
    },
    {
      id: 'gallo-ufw-boycott-history',
      title: 'Historic UFW Nationwide Boycott',
      severity: 'medium',
      description: 'After Gallo signed with the Teamsters instead of renewing its United Farm Workers contract, the UFW led a nationwide consumer boycott from 1973 to 1978, including a 100-mile march. The dispute is foundational to the company’s long-running labor history.',
      source: 'UFW historical records',
    },
    {
      id: 'gallo-2023-layoffs',
      title: '2023 Layoff of 355 California Workers',
      severity: 'medium',
      description: 'Gallo laid off 355 California workers in 2023 after Republic National Distributing Company assumed retail distribution responsibilities, reflecting workforce instability tied to distribution-partner changes.',
      source: 'Wine Industry Insight, 2023',
    },
    {
      id: 'gallo-ongoing-contract-disputes',
      title: 'Ongoing Farmworker Contract Disputes',
      severity: 'medium',
      description: 'The company has faced continuing disputes with the UFW over contract terms, wages, and safety conditions in the 2022-2025 period. These negotiations remain ongoing and unadjudicated as of 2025.',
      source: 'UFW and labor press reports, 2022-2025',
    },
  ],

  'hint-water': [
    {
      id: 'hint-natural-flavors-disclosure',
      title: 'Undisclosed "Natural Flavor" Ingredients',
      severity: 'low',
      description: 'Hint Water lists "natural flavors," a category that under FDA rules can include a wide range of undisclosed flavoring compounds. Consumers cannot determine the specific source ingredients from the label.',
      source: 'CSPI ingredient disclosure research, 2022',
    },
    {
      id: 'hint-single-use-plastic',
      title: 'Single-Use Plastic Packaging',
      severity: 'medium',
      description: 'Hint Water is sold primarily in single-use plastic bottles. Despite wellness-oriented branding, the company has not published evidence of meeting major recycled-content or packaging-reduction targets.',
      source: 'Company sustainability reporting, 2024',
    },
    {
      id: 'hint-fruit-imagery-appeal',
      title: 'Fruit Imagery Appeal to Younger Buyers',
      severity: 'low',
      description: 'Hint markets flavored water using fruit names and imagery that can appeal to younger consumers. Health-positioned beverages aimed at minors are an area of general FTC scrutiny, though no specific action against Hint was identified.',
      source: 'FTC healthy-claims guidance, 2023',
    },
  ],

  'death-wish-coffee': [
    {
      id: 'dwc-2017-botulism-recall',
      title: '2017 Nitro Cold Brew Botulism Recall',
      severity: 'medium',
      description: 'Death Wish Coffee voluntarily recalled its 11-ounce Nitro Cold Brew cans in September 2017 after determining the process could allow growth of Clostridium botulinum in low-acid, reduced-oxygen packaging. No illnesses were reported and no toxin was found in product; the FDA later terminated the recall.',
      source: 'FDA recall notice, 2017',
    },
    {
      id: 'dwc-high-caffeine',
      title: 'Caffeine Far Above FDA Daily Guidance',
      severity: 'medium',
      description: 'Marketed as "the world’s strongest coffee," the product contains roughly 660mg of caffeine per pot, well above the FDA’s 400mg-per-day guidance for healthy adults. Health warnings on packaging are limited.',
      source: 'FDA caffeine guidance; product labeling',
    },
    {
      id: 'dwc-extreme-marketing',
      title: 'Extreme Caffeine Marketing Positioning',
      severity: 'low',
      description: 'The brand’s extreme-strength positioning may appeal to younger and thrill-seeking buyers. Pediatric guidance cautions against high caffeine intake for adolescents, though no enforcement action against the company was identified.',
      source: 'American Academy of Pediatrics caffeine statement, 2022',
    },
  ],

  'egglands-best': [
    {
      id: 'eb-enriched-colony-housing',
      title: 'Enriched Colony, Not Cage-Free, Housing',
      severity: 'medium',
      description: 'Many Eggland’s Best eggs come from enriched colony cages (roughly 750 cm² per hen), not cage-free or free-range systems. This meets baseline welfare standards but provides substantially less space than the outdoor imagery often associated with premium eggs.',
      source: 'Industry welfare standards; product disclosures',
    },
    {
      id: 'eb-consumer-perception-gap',
      title: 'Premium Branding vs. Production Reality',
      severity: 'medium',
      description: 'Consumer surveys suggest many shoppers believe premium egg brands imply cage-free or free-range production. Critics allege Eggland’s Best marketing imagery can reinforce that impression despite confined production, though no FTC action was identified.',
      source: 'Consumer Reports testing; FTC deceptive-practices guidance',
    },
    {
      id: 'eb-omega3-claims',
      title: 'Modest Omega-3 Fortification Levels',
      severity: 'low',
      description: 'Eggland’s Best promotes elevated omega-3 content from flax-based feed. The claim is substantiated, but per-egg omega-3 levels are modest relative to dedicated omega-3 supplements.',
      source: 'USDA nutrient database; product labeling',
    },
  ],

  'boars-head': [
    {
      id: 'bh-2024-listeria-deaths',
      title: 'Deadly 2024 Listeria Outbreak',
      severity: 'high',
      description: 'A 2024 outbreak of Listeria monocytogenes linked to Boar’s Head ready-to-eat deli meats caused at least 10 deaths and roughly 60 hospitalizations across about 19 states, per CDC and USDA investigators. It was one of the deadliest listeria outbreaks in recent US history.',
      source: 'CDC / USDA FSIS, 2024',
    },
    {
      id: 'bh-7m-pound-recall',
      title: 'Recall of About 7 Million Pounds',
      severity: 'high',
      description: 'On July 30, 2024, Boar’s Head expanded its recall to roughly 7 million pounds across 71 products under the Boar’s Head and Old Country brands. USDA traceback identified the company’s Jarratt, Virginia plant as the source.',
      source: 'USDA FSIS recall notice, 2024',
    },
    {
      id: 'bh-jarratt-violations',
      title: 'Dozens of Sanitation Violations Logged',
      severity: 'high',
      description: 'USDA inspectors recorded roughly 69 regulatory violations at the Jarratt, Virginia plant between August 2023 and August 2024, including observations of mold, mildew, insects, and pooling blood. Boar’s Head permanently closed the plant in September 2024.',
      source: 'USDA FSIS public report, January 2025',
    },
    {
      id: 'bh-response',
      title: 'Post-Outbreak Recall and Plant Closure',
      severity: 'medium',
      description: 'Boar’s Head cooperated with federal investigators, issued a voluntary recall, and permanently closed the implicated facility. The company stated it would enhance testing and food-safety protocols.',
      source: 'Company statements; FDA/USDA coordination, 2024',
    },
  ],

  'ocean-spray': [
    {
      id: 'os-no-artificial-flavors-settlement',
      title: '$5.4M "No Artificial Flavors" Settlement',
      severity: 'medium',
      description: 'Ocean Spray agreed to pay $5.4 million in 2019 to settle allegations that juices labeled "no artificial flavors" contained synthetic malic acid, without admitting wrongdoing. The settlement covered purchases from 2011 through January 2020 and required label changes.',
      source: 'Hilsley v. Ocean Spray settlement, 2019',
    },
    {
      id: 'os-added-sugar',
      title: 'High Added Sugar in Juice Cocktails',
      severity: 'medium',
      description: 'Ocean Spray cranberry juice cocktail products contain roughly 27-31g of added sugar per 8-ounce serving, far above the natural sugar in pure cranberry juice, despite health-oriented branding.',
      source: 'CSPI beverage analysis, 2022; product labels',
    },
    {
      id: 'os-no-preservatives-claim',
      title: 'Pending "No Preservatives" Class Actions',
      severity: 'medium',
      description: 'Ocean Spray faces class-action claims alleging its "no preservatives" labeling is misleading because products contain ascorbic acid, which plaintiffs characterize as a preservative. These actions were pending as of 2025.',
      source: 'Class-action filings, 2023-2025',
    },
  ],

  'sun-maid': [
    {
      id: 'sunmaid-1986-accounting-scandal',
      title: '1985-1986 Accounting Scandal',
      severity: 'low',
      description: 'A 1985-1986 accounting scandal at Sun-Maid involved roughly $27.3 million in grower overpayments tied to falsified records and overstated profits, and about 29% of its members left by May 1986. A $13.35 million settlement followed in 1988; the cooperative has had no comparable incident since.',
      source: 'Cooperative records; settlement filings, 1988',
    },
    {
      id: 'sunmaid-espy-gratuities',
      title: '1990s Espy Gratuities Case Reversed',
      severity: 'low',
      description: 'Parent organization Sun-Diamond Growers was charged with providing improper gifts to Agriculture Secretary Mike Espy and convicted at trial. The U.S. Supreme Court reversed in 1999 (United States v. Sun-Diamond Growers), narrowing the illegal-gratuity statute, so the conviction did not stand on appeal.',
      source: 'United States v. Sun-Diamond Growers, 526 U.S. 398 (1999)',
    },
    {
      id: 'sunmaid-pesticide-residue',
      title: 'Conventional-Farming Pesticide Residue',
      severity: 'low',
      description: 'Conventional California raisin farming uses sulfur and fungicide applications. EWG produce testing has flagged residue on some grape and raisin samples, a general agricultural concern rather than a company-specific enforcement matter.',
      source: 'EWG analysis, 2023-2024',
    },
  ],

  'dole-food': [
    {
      id: 'dole-dbcp-litigation',
      title: 'DBCP Pesticide Farmworker Litigation',
      severity: 'high',
      description: 'Dole has faced decades of lawsuits from Central American farmworkers alleging sterility and harm from DBCP, a pesticide banned in the US but used on banana plantations. A 2007 California jury award to Nicaraguan workers was later vacated, and subsequent cases were dismissed amid fraud findings against some plaintiffs’ attorneys.',
      source: 'Court records; Tellez v. Dole litigation history',
    },
    {
      id: 'dole-bananas-documentary-slapp',
      title: 'Failed Defamation Suit Over "Bananas!*"',
      severity: 'medium',
      description: 'Dole sued the makers of the 2009 documentary "Bananas!*" for defamation. A California court struck the suit under the state’s anti-SLAPP law, finding the film a protected exercise of free speech, and ordered Dole to pay roughly $200,000 in the filmmakers’ attorneys’ fees.',
      source: 'California Superior Court anti-SLAPP ruling, 2010',
    },
    {
      id: 'dole-supply-chain-labor',
      title: 'Ongoing Central American Labor Risk',
      severity: 'medium',
      description: 'Dole banana production continues in Central American regions where the ILO and labor NGOs have documented wage and safety vulnerabilities. These are reported supply-chain risks rather than adjudicated findings against the company.',
      source: 'ILO reports, 2023; NGO supply-chain audits',
    },
  ],

  'del-monte-foods': [
    {
      id: 'dmf-bpa-can-linings',
      title: 'Slow BPA Can-Lining Transition',
      severity: 'medium',
      description: 'Del Monte transitioned away from BPA-lined cans more slowly than several peers, citing supplier and cost constraints, with a partial transition reported completed around 2019. BPA in food packaging remains a consumer-health concern.',
      source: 'Environmental Working Group study, 2022',
    },
    {
      id: 'dmf-kenya-pineapple-violence',
      title: 'Alleged Violence at Kenya Pineapple Farm',
      severity: 'medium',
      description: 'A 2023 Bureau of Investigative Journalism and Guardian investigation, with a law firm dossier, alleged that security guards at the Del Monte brand’s Kenyan pineapple farm were responsible for roughly 146 incidents over a decade, including several deaths since 2019, beatings, and assault allegations. None of the deaths had resulted in convictions as of the reporting.',
      source: 'Bureau of Investigative Journalism / The Guardian, 2023',
    },
    {
      id: 'dmf-american-samoa-wages',
      title: '2007 Opposition to Samoa Wage Standards',
      severity: 'low',
      description: 'In 2007 Del Monte opposed applying mainland US minimum-wage standards to tuna-packing operations in American Samoa, citing economic impact on the local industry.',
      source: 'Public legislative record, 2007',
    },
    {
      id: 'dmf-1977-namibia-sourcing',
      title: '1977 Apartheid-Era Sourcing Boycott',
      severity: 'low',
      description: 'Del Monte faced boycott calls in 1977 after sardines sourced from Namibian waters under South African apartheid administration were found in some products. The issue is long resolved but reflects historical sourcing-ethics concerns.',
      source: 'Historical company records, 1977',
    },
  ],

  'polar-beverages': [
    {
      id: 'polar-artificial-sweeteners',
      title: 'Artificial Sweeteners in Diet Products',
      severity: 'low',
      description: 'Polar ginger ale and select diet products use aspartame and acesulfame-potassium. Both are FDA-permitted, with no enforcement issues identified, but some consumers prefer to avoid artificial sweeteners.',
      source: 'Product labels; FDA GRAS determinations',
    },
    {
      id: 'polar-clean-safety-record',
      title: 'No Recalls in Research Window',
      severity: 'low',
      description: 'No significant FDA recalls or safety enforcement actions against Polar Beverages were identified in the 2020-2026 window. Its mostly regional New England distribution limits supply-chain complexity.',
      source: 'FDA recall database review, 2026',
    },
    {
      id: 'polar-water-sourcing',
      title: 'New England Aquifer Water Sourcing',
      severity: 'low',
      description: 'As a Massachusetts-based beverage maker, Polar draws water from New England aquifers and is subject to state environmental regulation. No related violations were identified.',
      source: 'Company operational records',
    },
  ],

  'fage': [
    {
      id: 'fage-tax-relocation',
      title: '2012 Tax-Driven HQ Relocation',
      severity: 'low',
      description: 'Fage relocated its headquarters from Athens, Greece to Luxembourg in 2012, citing more favorable tax conditions, better access to bank funding, and reduced exposure to the Greek financial crisis.',
      source: 'Company statement, 2012',
    },
    {
      id: 'fage-clean-safety-record',
      title: 'No Major Recalls Identified',
      severity: 'low',
      description: 'No significant FDA or USDA recalls or safety incidents involving Fage were identified in the 2010-2026 research window. The company operates under EU food-safety and labeling standards.',
      source: 'FDA recall database; EU food-safety records',
    },
    {
      id: 'fage-supply-chain-transparency',
      title: 'Limited Public Supply-Chain Disclosure',
      severity: 'low',
      description: 'No major supply-chain labor violations were documented for Fage in the current research window. As with any company, absence of documented issues does not guarantee absence of risk in upstream dairy sourcing.',
      source: 'Company sustainability reports; NGO audit review',
    },
  ],
};

module.exports = REANALYZED_ISSUES;
