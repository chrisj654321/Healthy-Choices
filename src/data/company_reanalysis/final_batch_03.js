const REANALYZED_ISSUES = {
  'tyson': [
    {
      id: 'water-pollution-371m',
      title: '371M lbs of Waterway Pollution (2018–2022)',
      severity: 'high',
      description: 'Tyson Foods released at least 371.7 million pounds of pollutants — including nitrogen, phosphorus, chloride, and cyanide — into US waterways across 41 facilities between 2018 and 2022, according to a Union of Concerned Scientists / Investigate Midwest analysis published in May 2024. Separately, Tyson agreed to pay $3 million to the Alabama Attorney General in August 2021 to settle a 2019 illegal discharge into the Mulberry Fork of the Black Warrior River that killed an estimated 175,000 fish.',
      source: 'Union of Concerned Scientists / Investigate Midwest, May 2024; Alabama AG, August 2021',
    },
    {
      id: 'covid-betting-pool',
      title: 'Managers Ran COVID Betting Pool on Workers',
      severity: 'high',
      description: 'A Tyson plant manager at the Waterloo, Iowa facility organized a cash-entry betting pool in which supervisors wagered on how many workers would contract COVID-19; seven managers were terminated in December 2020 following an independent investigation led by former US Attorney General Eric Holder. Over 1,000 workers at the facility were infected and at least six died.',
      source: 'NPR, NBC News, CNBC, December 2020',
    },
    {
      id: 'child-labor-dol',
      title: 'DOL Finds Minors at Arkansas Plants',
      severity: 'high',
      description: 'The US Department of Labor launched an investigation in September 2023 into child labor at Tyson facilities; Arkansas court records unsealed in October 2024 confirmed the DOL found minors under 16 employed at two Arkansas Tyson plants, linked to cleaning subcontractor QSI/Vincit Group. As of June 2026, the investigation remains open with no published settlement.',
      source: 'US Department of Labor; CBS News, October 2024',
    },
    {
      id: 'product-recall-2025',
      title: '58 Million lb Corn Dog & Sausage Recall',
      severity: 'high',
      description: 'Tyson subsidiary Hillshire Brands recalled approximately 58 million pounds of State Fair Corn Dogs and Jimmy Dean Pancakes & Sausage on a Stick products in September 2025 after wood fragment contamination was discovered; USDA classified the recall as Class I, its highest urgency level, and at least five consumer injuries were reported. Products had been distributed to retail stores, school districts, and the US Department of Defense.',
      source: 'USDA FSIS official recall notice, September 27, 2025',
    },
    {
      id: 'labor-controversy-2024',
      title: 'Plant Closure Amid Migrant Hiring Controversy',
      severity: 'medium',
      description: 'In March 2024, Tyson announced the closure of its Perry, Iowa plant affecting 1,276 workers; separately, the company announced a migrant hiring initiative at other facilities. Tyson stated the two decisions were unrelated, but the coinciding announcements prompted a documented public boycott campaign.',
      source: 'NPR, Newsweek, Fox Business, March 2024',
    },
    {
      id: 'lobbying-pac-2024',
      title: 'Lobbying & PAC Contributions (2022–2024)',
      severity: 'medium',
      description: 'Federal Election Commission and OpenSecrets public filings show Tyson spent approximately $1.886 million on federal lobbying in 2022 and approximately $1.670 million in 2024, with approximately $1.05 million in PAC contributions during the 2024 election cycle.',
      source: 'OpenSecrets; FEC filings, 2022–2024',
    },
  ],

  'hormel': [
    {
      id: 'product-recalls-2024-2025',
      title: 'Three Recalls for Foreign Matter (2024–2025)',
      severity: 'high',
      description: 'USDA FSIS issued three separate recall notices for Hormel products within 20 months: approximately 945 lbs of spiced deli ham in February 2024 for an undeclared milk allergen; approximately 256,185 lbs of canned beef stew in May 2025 for wood contamination; and approximately 4.87 million lbs of ready-to-eat frozen chicken in October 2025 for metal fragments from a conveyor belt, which generated multiple consumer complaints. Products from the October 2025 recall had been distributed between February and September 2025.',
      source: 'USDA FSIS official recall notices, February 2024, May 2025, October 2025',
    },
    {
      id: 'worker-rights-2025',
      title: 'Class Action: Sick Leave Law Violations',
      severity: 'medium',
      description: 'Four UFCW Local 663 members filed suit against Hormel in Mower County District Court in July 2025, alleging the company willfully violated Minnesota\'s Earned Sick and Safe Time law by forcing workers to use contractual vacation time in place of statutory sick leave benefits and withholding accruals from January through February 2025. A labor arbitrator had previously ruled Hormel could not substitute vacation time for ESST compliance; the lawsuit is pending.',
      source: 'UFCW Local 663, July 30, 2025; CBS Minnesota; Minnesota Reformer',
    },
    {
      id: 'gestation-crates',
      title: 'Supply Chain Gestation Crate Use Alleged',
      severity: 'high',
      description: 'Animal welfare organizations, including the Humane Society of the United States, allege that Hormel\'s contract pork supply chain continues to source from farms using gestation crates despite long-standing pledges to phase them out; Hormel has not provided independent third-party verification of full compliance.',
      source: 'Humane Society of the United States; Prop 12 compliance reporting',
    },
    {
      id: 'lobbying-correction',
      title: 'Lobbying Spend Lower Than Reported',
      severity: 'low',
      description: 'OpenSecrets data for the 2024 election cycle shows Hormel spent approximately $490,000 on federal lobbying and approximately $7,000 in PAC contributions — substantially below figures previously cited for the company, which appear to reflect a historical peak year.',
      source: 'OpenSecrets, 2024 cycle',
    },
  ],

  'jbs': [
    {
      id: 'fcpa-corruption',
      title: '$155M US Bribery Settlement (2020)',
      severity: 'high',
      description: 'JBS parent company J&F Investimentos agreed to pay approximately $155 million to the US Department of Justice and Securities and Exchange Commission in October 2020 to settle Foreign Corrupt Practices Act charges arising from a scheme involving more than $148 million in payments to Brazilian government officials, without admitting wrongdoing. Separately, J&F paid approximately $3.2 billion in a 2017 domestic Brazilian settlement covering the same underlying bribery conduct.',
      source: 'US DOJ and SEC official filings, October 2020',
    },
    {
      id: 'antitrust-beef',
      title: '~$160M in Beef Price-Fixing Settlements',
      severity: 'high',
      description: 'JBS has agreed to at least three separate settlements totaling approximately $160.5 million to resolve federal antitrust class actions alleging beef price-fixing: $52.5 million to direct purchasers (February 2022), $25 million to commercial and institutional indirect purchasers, and $83.5 million to cattle producers (2025). All settlements were reached without admission of wrongdoing.',
      source: 'National Trial Lawyers; Food Dive; Perishable News; court records, 2022–2025',
    },
    {
      id: 'ransomware-payment',
      title: '$11M Ransom Paid to Cybercriminal Group',
      severity: 'high',
      description: 'JBS paid $11 million in Bitcoin in June 2021 to the REvil ransomware group following a cyberattack on May 30, 2021 that disrupted beef and pork processing operations in the United States, Canada, and Australia for several days; the FBI attributed the attack to REvil/Sodinokibi.',
      source: 'JBS statement; FBI; NPR, June 2021',
    },
    {
      id: 'greenwashing-settlement',
      title: 'NY AG: Net Zero Claim Was Misleading',
      severity: 'high',
      description: 'JBS agreed on October 31, 2025 to pay $1.1 million and revise its marketing following a New York Attorney General investigation that found the company\'s "Net Zero by 2040" pledge failed to account for deforestation emissions from its supply chain. Under the settlement, JBS must change "pledge" to "goal" in consumer-facing materials and submit to annual compliance reviews for three years.',
      source: 'New York Attorney General official press release; Kelley Drye, November 2025',
    },
    {
      id: 'amazon-deforestation',
      title: 'Supply Chain Linked to Amazon Deforestation',
      severity: 'high',
      description: 'Investigative reporting by Mighty Earth and independent analyses have documented links between JBS\'s Brazilian beef supply chain and deforestation in the Amazon; the New York Attorney General\'s 2025 greenwashing investigation independently confirmed that JBS\'s Net Zero claim failed to account for deforestation-related emissions, providing primary-source legal corroboration of the supply chain findings.',
      source: 'Mighty Earth; New York AG, October 2025',
    },
  ],

  'smithfield': [
    {
      id: 'covid-worker-safety',
      title: 'COVID Outbreak: ~1,300 Workers Infected',
      severity: 'high',
      description: 'Approximately 1,300 workers at Smithfield Foods\' Sioux Falls, South Dakota pork processing plant were infected with COVID-19 in April 2020 after the facility remained open during the early pandemic; OSHA fined Smithfield $13,494 — a penalty the workers\' union publicly called inadequate. A lawsuit filed in April 2020 by Food & Water Watch over working conditions was dismissed in May 2024.',
      source: 'NPR, April 2020; OSHA; Food & Water Watch v. Smithfield (dismissed May 2024)',
    },
    {
      id: 'lagoon-pollution',
      title: 'Hog Lagoon Nuisance: Jury Awards up to $473.5M',
      severity: 'high',
      description: 'In the April 2018 Kinlaw Farms trial, a jury awarded $50 million in punitive damages against Smithfield subsidiary Murphy-Brown over hog lagoon odor and runoff; the judge subsequently reduced the punitive award to approximately $3.25 million under North Carolina\'s punitive damages cap. A separate jury in 2019 awarded $473.5 million in a related hog nuisance case against Murphy-Brown.',
      source: 'NC Newsline; Insurance Journal; The Counter, 2018–2019',
    },
    {
      id: 'chinese-ownership-ccp',
      title: 'Chinese State-Linked Ownership of US Facilities',
      severity: 'high',
      description: 'Smithfield Foods is owned by Hong Kong-listed WH Group, whose executive chairman Wan Long is a confirmed member of the Chinese Communist Party; Smithfield holds approximately 89,218 acres of US farmland according to AFIDA reporting. The federal Protecting America\'s Strategic Farmland Act (PASS Act), introduced in February 2023, and multiple state legislatures have introduced restrictions specifically targeting Chinese ownership of US agricultural assets.',
      source: 'Federal Newswire; National Hog Farmer; AFIDA filings; PASS Act, 2023',
    },
  ],

  'perdue': [
    {
      id: 'child-labor-dol',
      title: '$4.15M Child Labor Settlement (2025)',
      severity: 'high',
      description: 'Perdue Farms agreed on January 15, 2025 to pay $4.15 million to settle US Department of Labor findings that children as young as minors under 16 had been employed at its Accomac, Virginia processing facility between 2020 and 2023, working with electric knives and heat-sealing presses and during prohibited nighttime hours. The settlement included $2 million in restitution to affected minors, $2 million to child labor advocacy organizations, and a $150,000 civil monetary penalty; staffing agency SMX/Staff Management Solutions paid a $125,000 penalty and was permanently enjoined from future violations in meat processing.',
      source: 'US Department of Labor press release, January 15, 2025 (dol.gov)',
    },
    {
      id: 'product-recalls-2022-2023',
      title: 'USDA Recalls for Foreign Matter (2022–2023)',
      severity: 'medium',
      description: 'USDA FSIS issued recall notices for Perdue Foods products in 2022 and 2023 for foreign matter and extraneous material contamination, affecting sausage products and frozen chicken nuggets and tenders.',
      source: 'USDA FSIS official recall notices, 2022–2023',
    },
    {
      id: 'antibiotic-use',
      title: 'Antibiotic Use in Poultry Production',
      severity: 'medium',
      description: 'Perdue Farms has faced scrutiny from public health advocates over antibiotic use practices in its poultry supply chain; the company has made commitments to reduce antibiotic use, but independent verification of full compliance across contract growers has not been publicly established.',
      source: 'Consumer and public health advocacy reporting',
    },
  ],

  'butterball': [
    {
      id: 'sanitation-violations-2025',
      title: 'FSIS Sanitation Violations at Two NC Plants',
      severity: 'high',
      description: 'FSIS noncompliance reports documented violations at Butterball\'s Raeford, North Carolina plant on October 27, 2025 and at its Mount Olive, North Carolina plant on October 15–17, 2025; violations included documentation failures at Raeford and unsanitary conditions — including turkey bones along a back wall — that were not properly escalated at Mount Olive. Carolina Public Press and NC Health News reported in December 2025 that FSIS lacked sufficient enforcement tools to compel correction.',
      source: 'FSIS noncompliance reports; Carolina Public Press / NC Health News, December 2025',
    },
    {
      id: 'product-recall-2021',
      title: 'Ground Turkey Recalled for Blue Plastic',
      severity: 'medium',
      description: 'Butterball LLC recalled approximately 14,107 pounds of ground turkey in October 2021 after possible contamination with blue plastic pieces was identified; USDA classified the recall as Class II.',
      source: 'USDA FSIS official recall notice, October 2021',
    },
    {
      id: 'covid-worker-safety-2020',
      title: 'COVID Safety Failures at NC Plants (2020)',
      severity: 'high',
      description: 'Workers at Butterball\'s North Carolina facilities filed five OSHA and NC OSH complaints in 2020 alleging inadequate COVID-19 protections; OSHA dismissed the complaints and NC OSH cited lack of jurisdiction, resulting in no enforcement action. Civil Eats and NC Health News documented the safety concerns raised by workers.',
      source: 'Civil Eats, May 2020; NC Health News, November 2020',
    },
    {
      id: 'animal-welfare-record',
      title: 'Animal Welfare Violations & Ongoing Scrutiny',
      severity: 'high',
      description: 'Butterball was the subject of a documented undercover animal cruelty investigation in 2012. Good Jobs First\'s Violation Tracker records approximately $19.6 million in penalties across 21 enforcement records for Butterball; animal welfare advocacy organizations continue to rate the company poorly on welfare standards.',
      source: 'Good Jobs First Violation Tracker; advocacy reporting, 2012–present',
    },
  ],

  'foster-farms': [
    {
      id: 'product-recall-2025',
      title: '~4 Million lb Corn Dog Recall for Wood',
      severity: 'high',
      description: 'Foster Poultry Farms LLC recalled approximately 3,961,138 pounds of chicken corn dog products in October 2025 after wood fragments were found embedded in the batter; USDA classified the recall as Class I and at least five consumer injuries were reported. Products had been distributed to retail stores, the US Department of Defense, and USDA Commodity Foods programs, and were produced between July 30, 2024 and August 4, 2025.',
      source: 'USDA FSIS official recall notice, October 17, 2025',
    },
    {
      id: 'salmonella-outbreak-2013',
      title: '634 Salmonella Illnesses Across 29 States',
      severity: 'high',
      description: 'The CDC confirmed 634 Salmonella Heidelberg illnesses across 29 states linked to Foster Farms chicken between September 2013 and March 2014, involving seven antibiotic-resistant strains; USDA FSIS documents obtained via FOIA disclosed over 200 sanitation noncompliance reports at two Foster Farms California plants during the same period.',
      source: 'CDC; USDA FSIS (FOIA disclosure); NRDC analysis, 2014',
    },
    {
      id: 'pe-acquisition-2022',
      title: 'Private Equity Acquisition by Atlas Holdings',
      severity: 'medium',
      description: 'Atlas Holdings, a Greenwich, Connecticut private equity firm, completed its acquisition of Foster Farms on June 7, 2022, ending 83 years of family ownership. The new CEO is Donnie Smith, who previously served as CEO of Tyson Foods from 2009 to 2016.',
      source: 'WATTPoultry, June 2022',
    },
  ],

  'bob-evans': [
    {
      id: 'product-recalls-plastic',
      title: 'Two Blue Rubber Recalls, Same Facility',
      severity: 'medium',
      description: 'USDA FSIS issued recall notices for Bob Evans raw pork sausage products in 2020 (approximately 4,200 lbs produced December 17, 2020) and again in 2022 (approximately 7,560 lbs of Italian sausage produced September 8, 2022), both for contamination with thin blue rubber pieces from the same Xenia, Ohio facility. Two identical contamination incidents involving the same contaminant at the same plant within two years constitutes a documented pattern.',
      source: 'USDA FSIS official recall notices, 2020 and 2022',
    },
    {
      id: 'post-holdings-ownership',
      title: 'Owned by Post Holdings Since 2021',
      severity: 'low',
      description: 'Post Holdings, a publicly traded consumer packaged goods company, acquired the Bob Evans grocery division in 2021. OpenSecrets records show Post Holdings spent approximately $520,000 on federal lobbying, with PAC contributions directed approximately 61% to Republican candidates.',
      source: 'Post Holdings SEC filings; OpenSecrets',
    },
  ],

  'lactalis': [
    {
      id: 'criminal-indictment-2023',
      title: 'Criminal Charges Filed in France (2023)',
      severity: 'high',
      description: 'Lactalis Group and its subsidiary Celia Laiterie de Craon were formally indicted on February 16, 2023 in France on charges of aggravated deception, involuntary injuries, and failure to execute product withdrawal and recall measures; both entities were placed under judicial supervision with €300,000 bonds each, and several hundred civil complainants are parties to the pending criminal case. Prosecutors allege Salmonella contamination was present at the Craon facility since at least 2005.',
      source: 'Dairy Reporter, February 20, 2023; France24, February 16, 2023; Food Safety News',
    },
    {
      id: 'infant-formula-recall-2026',
      title: 'Cereulide Recall: 18 Countries, Delayed Response',
      severity: 'high',
      description: 'A French court opened a judicial investigation on January 30, 2026 following a Foodwatch legal complaint over cereulide contamination in Lactalis infant formula products that had been on sale since January 2025 — a full year before recall. Authorities in Belgium, Luxembourg, and Brazil confirmed links to infant illness, and recalls spread across 18 European countries.',
      source: 'Dairy Reporter, January 23, 2026; Foodwatch.org; Just-Food',
    },
    {
      id: 'infant-salmonella-recall',
      title: 'Global Infant Formula Salmonella Recall',
      severity: 'high',
      description: 'Lactalis conducted a worldwide recall of infant formula products in December 2017 after Salmonella Agona contamination was detected at its Craon, France manufacturing facility; the recall affected products in more than 80 countries and was linked to illnesses in infants across multiple nations.',
      source: 'French Ministry of Social Affairs and Health; international regulatory bodies, 2017',
    },
    {
      id: 'corporate-opacity',
      title: 'Privately Held with No Public Reporting',
      severity: 'medium',
      description: 'Lactalis is one of the world\'s largest dairy companies with revenues of approximately $28 billion, yet it is privately held by the Besnier family with no public reporting obligations; CEO Emmanuel Besnier is documented as declining media interviews and press inquiries, and multiple investigative outlets have noted the company\'s systematic refusal to provide public disclosure.',
      source: 'Multiple investigative outlets; Lactalis company structure records',
    },
  ],

  'dfa': [
    {
      id: 'price-fixing-northeast',
      title: '$50M Northeast Price-Fixing Settlement',
      severity: 'high',
      description: 'Dairy Farmers of America agreed to pay $50 million to settle a class-action lawsuit alleging the cooperative engaged in anticompetitive practices that suppressed milk prices paid to dairy farmers in the Northeast region, without admitting wrongdoing.',
      source: 'Cohen Milstein; Reuters',
    },
    {
      id: 'price-fixing-southwest',
      title: '$24.5M Southwest Price-Fixing Settlement (2025)',
      severity: 'high',
      description: 'DFA agreed to pay $24.5 million in July 2025 to settle federal antitrust claims alleging price-fixing in the Southwest milk market, with co-defendant Select Milk paying an additional $9.9 million for a combined $34.4 million settlement; non-monetary terms included dissolution of the Greater Southwest Agency and antitrust compliance education requirements. The preliminary settlement was filed in US District Court for the District of New Mexico.',
      source: 'Farmshine, August 10, 2025; Hagens Berman case filings',
    },
    {
      id: 'price-fixing-southeast-historical',
      title: '$140M Southeast Price-Fixing Settlement (2013)',
      severity: 'medium',
      description: 'DFA agreed to pay $70 million — part of a combined $140 million settlement including subsidiaries National Dairy Holdings and Mid-Am Capital — in January 2013 to resolve a Southeast region antitrust class action alleging anticompetitive milk pricing, without admitting wrongdoing. Together with the Northeast and Southwest settlements, DFA\'s documented antitrust exposure across three regions totals approximately $214.5 million or more.',
      source: 'Dairy Herd; Dairy Foods; NPR, January 23, 2013',
    },
    {
      id: 'antitrust-doj-intervention',
      title: 'DOJ Required Divestitures in Dean Foods Deal',
      severity: 'high',
      description: 'The US Department of Justice required DFA to divest three dairy processing plants — in Illinois, Wisconsin, and Massachusetts — as conditions of approving DFA\'s $433 million acquisition of the majority of Dean Foods\' assets in May 2020; the DOJ stated the deal "poses a serious risk of anticompetitive harm." The Wisconsin divestiture included surrender of associated intellectual property and brand name rights.',
      source: 'US DOJ Antitrust Division filing, May 1, 2020',
    },
    {
      id: 'lobbying-fmmo',
      title: 'Lobbying USDA & Congress on Milk Pricing',
      severity: 'medium',
      description: 'DFA, which controls approximately 30% of the US milk supply, actively lobbies the USDA, Congressional agriculture committees, and the FDA on Federal Milk Marketing Order rules that govern minimum prices paid to dairy farmers; the cooperative\'s market concentration and lobbying activity have been documented in OpenSecrets filings and USDA FMMO proceedings.',
      source: 'OpenSecrets; USDA Federal Milk Marketing Order proceedings',
    },
  ],
};

module.exports = REANALYZED_ISSUES;
