const REANALYZED_ISSUES = {
  'land-o-lakes': [
    {
      id: 'fda-warning-animal-feed-deaths',
      title: 'FDA Warning: Calf Deaths from Feed Contamination',
      severity: 'high',
      description: 'In 2023, the FDA issued a warning letter to Nutra Blend LLC, a Land O\'Lakes subsidiary, after cross-contamination at its Mason City, Iowa medicated feed mill caused multiple calf deaths from ionophore toxicity. The company also failed to file a required Reportable Food Registry report within the mandated timeframe.',
      source: 'FDA Warning Letter, May 2023',
    },
    {
      id: 'antitrust-cwt-settlement',
      title: 'Antitrust Settlement: Dairy Price-Fixing Allegations',
      severity: 'medium',
      description: 'Land O\'Lakes was a named defendant in a $52 million class-action antitrust settlement (2016) alleging that dairy cooperatives slaughtered more than 500,000 cows under the CWT herd retirement program between 2003 and 2010 to artificially inflate milk prices. No admission of wrongdoing.',
      source: 'Hagens Berman Press Release; Dairy Reporter, September 2016',
    },
    {
      id: 'lobbying-spend',
      title: 'Ongoing Federal Lobbying on Dairy & Labeling',
      severity: 'low',
      description: 'Land O\'Lakes spends approximately $1.2 million annually lobbying Congress and federal agencies on dairy pricing, nutrition labeling, and environmental regulation. Lobbying activity is reported to OpenSecrets under client ID D000022070.',
      source: 'OpenSecrets, ongoing',
    },
    {
      id: 'fertilizer-runoff',
      title: 'WinField United Linked to Mississippi River Runoff',
      severity: 'medium',
      description: 'WinField United, Land O\'Lakes\' agribusiness subsidiary and a major U.S. crop input distributor, has been documented by the Environmental Defense Fund and NRDC as a contributor to nitrogen loading in the Mississippi River Basin and Gulf hypoxia. No direct EPA enforcement action against Land O\'Lakes has been confirmed.',
      source: 'Environmental Defense Fund; NRDC, ongoing',
    },
  ],

  'organic-valley': [
    {
      id: 'lyons-magnus-recall-2022',
      title: 'Recall: Aseptic Products Contaminated by Co-Packer',
      severity: 'high',
      description: 'Organic Valley products were included in a major recall in August 2022 when co-packer Lyons Magnus LLC recalled 35+ million packages of aseptic products due to potential contamination with Cronobacter sakazakii and Clostridium botulinum. The FDA later issued a warning letter to Lyons Magnus (January 2023) for continuing production for months after internal contamination was detected in April 2022.',
      source: 'FDA Recall Notice; FDA Warning Letter, January 2023',
    },
    {
      id: 'calf-separation-lawsuit-dismissed',
      title: 'Humanewashing Lawsuit: Dismissed Without Settlement',
      severity: 'low',
      description: 'A 2022 PETA Foundation-backed class action alleged Organic Valley misled consumers about calf separation practices; a 2023 court ruling found a reasonable consumer could find the labeling misleading. The parties mutually dismissed the case in September 2024 with no settlement or payment.',
      source: 'U.S. District Court N.D. Cal. (Judge Jon S. Tigar); parties\' dismissal, September 2024',
    },
    {
      id: 'oregon-deq-fine-milk-spill',
      title: 'Oregon DEQ Fine: Milk Discharge to Waterway',
      severity: 'low',
      description: 'In 2019, Oregon fined Organic Valley (CROPP Cooperative) $26,574 for discharging milk into a storm drain that turned a local creek white for three-quarters of a mile. A fire at the same McMinnville, Oregon creamery in 2021 prompted a half-mile evacuation radius due to ammonia release; the facility was rebuilt and reopened in May 2022.',
      source: 'Oregon DEQ Press Release, 2019; news reports, 2021',
    },
  ],

  'chobani': [
    {
      id: 'phthalates-lawsuit-2025',
      title: 'Class Action: Phthalates in "Natural" Yogurt',
      severity: 'medium',
      description: 'An April 2025 class action (S.D. Cal., Wysocki v. Chobani LLC) alleges that Chobani plain Greek yogurts contained phthalates — endocrine-disrupting chemicals — leached from plastic packaging, despite marketing claiming "only natural ingredients." Independent testing by PlasticList detected four phthalate variants (DEHP, DEP, DBP, DEHT). No FDA recall has been issued and the case is pending.',
      source: 'U.S. District Court S.D. Cal., Case 3:25-cv-00907; PlasticList, 2025',
    },
    {
      id: 'farmworker-labor-conditions',
      title: 'Supplier Farms Alleged to Have Poor Labor Conditions',
      severity: 'medium',
      description: 'The Worker Justice Center of New York and a coalition of 35 labor rights organizations have alleged that dairy farms in Chobani\'s supplier network maintain substandard housing, high injury rates, and retaliate against workers seeking to organize. Chobani partnered with Fair Trade USA for supplier certification, a program that labor groups have criticized as inadequate on union rights.',
      source: 'Worker Justice Center of New York; Fair World Project, 2021–ongoing',
    },
  ],

  'tillamook': [
    {
      id: 'dairy-done-right-lawsuit',
      title: '"Dairy Done Right" Marketing Lawsuit Proceeds',
      severity: 'high',
      description: 'A 2019 class action alleging that Tillamook\'s "Dairy Done Right" and "Goodbye Big Food" marketing campaigns deceive consumers — because upwards of two-thirds of Tillamook\'s milk comes from Threemile Canyon Farms, a CAFO with approximately 70,000 cattle near Boardman, Oregon, not the small coastal farms depicted in advertising — was revived by the Oregon Supreme Court in April 2025 and is proceeding to trial.',
      source: 'Oregon Supreme Court, April 3, 2025; OPB',
    },
    {
      id: 'threemile-supplier-violations',
      title: 'Primary Supplier Fined for Air & Water Violations',
      severity: 'medium',
      description: 'Threemile Canyon Farms, Tillamook\'s primary milk supplier, was fined $19,500 by the Oregon DEQ for five air quality permit violations (2019–2020). A 2022 advocacy report by Food and Water Watch alleged the farm continued collecting California clean-energy credits while violating air quality rules. A 2019 spill sent over 300,000 gallons of manure into an Oregon waterway.',
      source: 'Oregon DEQ; Food and Water Watch, 2022; OPB, January 2022',
    },
    {
      id: 'allergen-recall-ice-cream-2023',
      title: 'Recall: Undeclared Allergens in Ice Cream',
      severity: 'low',
      description: 'In May–June 2023, Tillamook recalled up to 1,440 cartons of Waffle Cone Swirl ice cream after the product was mis-packaged in Chocolate Peanut Butter cartons, leaving wheat and soy allergens undeclared. Distribution was limited to Safeway locations in Washington state and northern Idaho, and no illnesses were reported.',
      source: 'FDA Recall Notice; KPTV, June 2023',
    },
    {
      id: 'plastic-recall-cheese-2024',
      title: 'Recall: Plastic Pieces Found in Cheese',
      severity: 'low',
      description: 'In May 2024, Tillamook recalled Colby Jack and Monterey Jack cheese twin-packs sold exclusively at Costco Northwest locations after gray and black plastic pieces were found in the product. The FDA classified the recall as Class II, indicating temporary adverse health consequences were possible but serious harm was unlikely; no illnesses were reported.',
      source: 'FDA Recall Notice, May 2024',
    },
    {
      id: 'groundwater-contamination-supplier',
      title: 'Supplier Linked to Groundwater Contamination',
      severity: 'medium',
      description: 'Environmental advocates and NW Environmental Advocates have documented ongoing nitrogen contamination of the Lower Umatilla Basin groundwater linked to CAFO operations, including Threemile Canyon Farms, operating under Oregon\'s agricultural permitting framework. This is an ongoing regulatory and advocacy record, not a single enforcement action.',
      source: 'NW Environmental Advocates, ongoing',
    },
  ],

  'saputo': [
    {
      id: 'cottage-cheese-recall-pasteurization-2026',
      title: 'Recall: Pasteurization Failure in Cottage Cheese',
      severity: 'medium',
      description: 'In February 2026, Saputo recalled Great Value cottage cheese distributed to 24 states at Walmart stores after a pasteurization equipment failure was identified; the California Department of Food and Agriculture was involved in the investigation. The pasteurizer was subsequently repaired and certified, and no illnesses were reported.',
      source: 'FDA Recall Notice, February 2026; California CDFA',
    },
    {
      id: 'water-usage-opposition',
      title: 'Community Opposition to Plant Water Use',
      severity: 'low',
      description: 'Saputo faced documented community opposition to plant expansions in drought-affected regions in 2021–2022. No formal EPA or California enforcement action has been confirmed.',
      source: 'Reuters, 2022',
    },
  ],

  'vital-farms': [
    {
      id: 'humanewashing-lawsuit-dismissed',
      title: 'Humanewashing Lawsuit Dismissed; Vital Farms Prevailed',
      severity: 'low',
      description: 'A 2021 PETA Foundation-backed class action alleging Vital Farms misled consumers about pasture-raised and humane-certification claims was dismissed in January 2025 with no settlement or consumer payment. During litigation, Vital Farms was ordered to pay $292,000 in sanctions related to overly broad discovery subpoenas served on PETA.',
      source: 'Court dismissal, January 2025; Vital Farms vitalfarms.com',
    },
    {
      id: 'almark-listeria-recall-2019',
      title: 'Eggs Recalled in Listeria Outbreak at Co-Packer',
      severity: 'low',
      description: 'Vital Farms pasture-raised hard-boiled eggs were included in a December 2019–January 2020 recall of all products from co-packer Almark Foods\' Georgia facility, linked to a Listeria outbreak that caused 7 illnesses, 4 hospitalizations, and 1 death. Vital Farms was an affected brand; the contamination originated at the co-packer\'s facility, not at Vital Farms.',
      source: 'FDA Recall Notice; CDC Outbreak Investigation, 2019–2020',
    },
    {
      id: 'linoleic-acid-controversy-2026',
      title: 'Social Media Controversy: Egg Fatty Acid Composition',
      severity: 'low',
      description: 'A January 2026 social media controversy followed a Nourish Food Club and Michigan State University fatty acid analysis that found 22.5% linoleic acid in Vital Farms eggs, raising online debate about feed composition. Vital Farms disclosed feed composition openly on its website; Nourish Food Club confirmed the company did not misrepresent its feed ingredients. No lawsuit has been filed.',
      source: 'Nourish Food Club; Michigan State University analysis, January 2026',
    },
  ],

  'cabot-creamery': [
    {
      id: 'vermont-wastewater-fine-2026',
      title: 'Vermont Fined Parent Co. for Wastewater Violations',
      severity: 'medium',
      description: 'In February 2026, the Vermont Agency of Natural Resources fined Agri-Mark (Cabot Creamery\'s parent cooperative) $60,000 for 15 wastewater permit violations at its Middlebury, Vermont facility since July 2022, including unpermitted discharges of high-strength dairy waste that impacted the town\'s municipal treatment plant. The violations were notable because Vermont taxpayers had previously funded a $716,000 upgrade to the same facility.',
      source: 'Vermont ANR Press Release; Vermont Superior Court Environmental Division consent order, February 2026',
    },
    {
      id: 'butter-recall-coliform-2025',
      title: 'Recall: Possible Fecal Contamination in Butter',
      severity: 'low',
      description: 'Cabot Creamery voluntarily recalled approximately 1,700 pounds of Extra Creamy Premium Butter in April 2025 after Coliform bacteria were detected in finished product testing. The FDA classified the recall as Class III (not likely to cause adverse health consequences). Agri-Mark recovered 99.5% of the affected lot before retail sale, and no illnesses were reported.',
      source: 'FDA Recall Notice; VTDigger, April 10, 2025',
    },
    {
      id: 'peanut-allergen-recall-popcorn-2025',
      title: 'Recall: Undeclared Peanuts in Co-Branded Popcorn',
      severity: 'medium',
      description: 'In October 2025, co-manufacturer Jody\'s Inc. recalled Cabot Creamery-branded Sea Salt Caramel Cheddar Popcorn in nine states due to undeclared peanuts, a potentially life-threatening allergen for susceptible consumers. The issue was discovered through consumer complaints, and no illnesses were reported.',
      source: 'FDA Recall Notice, October 2025',
    },
    {
      id: 'antitrust-cwt-settlement',
      title: 'Antitrust Settlement: Dairy Price-Fixing Allegations',
      severity: 'medium',
      description: 'Agri-Mark (Cabot Creamery\'s parent cooperative) was a named defendant in a $52 million class-action antitrust settlement (2016) alleging that dairy cooperatives slaughtered over 500,000 cows under the CWT herd retirement program (2003–2010) to artificially inflate milk prices. No admission of wrongdoing.',
      source: 'Hagens Berman; Dairy Reporter, September 2016',
    },
  ],

  'sargento': [
    {
      id: 'rizo-lopez-listeria-recall-2024',
      title: 'Recall: Listeria from Supplier; 2 Deaths in Outbreak',
      severity: 'high',
      description: 'In February 2024, Sargento voluntarily recalled 10,498 cases of food service and ingredients products containing Cotija cheese from supplier Rizo-Lopez Foods (Modesto, CA) after Listeria monocytogenes was detected by Hawaii health authorities. The broader Rizo-Lopez Listeria outbreak — with contamination history traced back to 2014 — caused 26 illnesses, 23 hospitalizations, and 2 deaths. Rizo-Lopez was permanently banned from food production by federal court order in October 2024 and subsequently filed for bankruptcy.',
      source: 'FDA Outbreak Investigation; CDC; U.S. District Court consent decree, October 2024',
    },
  ],
};

module.exports = REANALYZED_ISSUES;
