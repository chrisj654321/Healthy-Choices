const REANALYZED_ISSUES = {
  'nbty': [
    {
      id: 'ftc-review-hijacking',
      title: 'FTC Action: Amazon Review Hijacking',
      severity: 'high',
      description: "The Bountiful Company, parent of Nature's Bounty, agreed to pay $600,000 to settle FTC charges that it manipulated Amazon's review system to attach established products' ratings to new supplements. The FTC later distributed over $527,000 in refunds to deceived consumers.",
      source: 'FTC, 2023',
    },
    {
      id: 'nestle-ownership',
      title: 'Core Brands Now Owned by Nestlé',
      severity: 'medium',
      description: "In 2021, the core NBTY brands — Nature's Bounty, Solgar, Osteo Bi-Flex and Puritan's Pride — were sold to Nestlé Health Science for $5.75 billion, changing the corporate parent accountable to consumers.",
      source: 'Nestlé / Bloomberg, 2021',
    },
    {
      id: 'ginkgo-efficacy-suit',
      title: 'Ginkgo Biloba Efficacy Lawsuit',
      severity: 'medium',
      description: "A 2022 class action alleges Nature's Bounty ginkgo biloba products provide no cognitive benefit and that the claimed benefits are unsupported by evidence in healthy adults. The allegations have not been adjudicated.",
      source: 'Class action filing, 2022',
    },
    {
      id: 'prior-ftc-claims',
      title: 'Prior FTC Deceptive-Claims History',
      severity: 'medium',
      description: "Nature's Bounty has previously settled FTC and state allegations over unsubstantiated health claims for supplements such as echinacea and ginkgo biloba. The brand has faced repeated regulatory scrutiny of its marketing claims over time.",
      source: 'FTC, 2016',
    },
  ],

  'gnc': [
    {
      id: 'chinese-linked-ownership',
      title: 'Owned by Chinese-State-Linked Firm',
      severity: 'high',
      description: 'After filing Chapter 11 bankruptcy in 2020, GNC was sold for roughly $770 million to Harbin Pharmaceutical Group, a Chinese drugmaker tied through CITIC to entities that media describe as state-linked. The sale was approved by a U.S. bankruptcy court and closed in October 2020.',
      source: 'SEC filings / Bloomberg, 2020',
    },
    {
      id: 'banned-substances-settlement',
      title: 'Undisclosed Ingredients in Store Brands',
      severity: 'high',
      description: 'GNC settled a $2.25M multistate action in 2015 after testing found unlisted, potentially dangerous ingredients in GNC store-brand supplements, and agreed to a supplier-certification program. The underlying concern of selling third-party products it does not independently verify has been raised repeatedly.',
      source: 'New York AG, 2015',
    },
    {
      id: 'military-base-concerns',
      title: 'National-Security Scrutiny on Bases',
      severity: 'medium',
      description: 'Members of Congress have raised concerns in 2024–2025 about Chinese-state-linked GNC operating stores on U.S. military bases and accessing service members’ purchase data. In 2024, protein products at base stores were reportedly pulled for containing hemp, banned for military personnel. These concerns are not adjudicated.',
      source: 'Congressional statements / Bloomberg Gov, 2024',
    },
  ],

  'now-foods': [
    {
      id: 'ginseng-pesticide-recall',
      title: 'Ginseng Recalled Over Banned Pesticide',
      severity: 'medium',
      description: 'NOW Foods voluntarily recalled its American Ginseng products in 2023 after a lot was found contaminated with quintozene, a banned pesticide traced to a supplier’s raw material, and later received an FDA warning letter on the matter.',
      source: 'FDA, 2023',
    },
    {
      id: 'phosphatidyl-serine-recall',
      title: 'Supplement Recalled for Low Potency',
      severity: 'low',
      description: 'In January 2024, NOW voluntarily recalled its Phosphatidyl Serine Extra Strength 300 mg softgels because they did not meet label-claim potency. No adverse events were reported.',
      source: 'NOW / FDA, 2024',
    },
    {
      id: 'salmonella-food-recalls',
      title: 'Salmonella Recalls of Food Products',
      severity: 'low',
      description: 'NOW issued precautionary voluntary recalls of Real Food raw macadamia nuts (2020) and a sprouting mix over possible Salmonella contamination from supplier ingredients. No illnesses were reported in either recall.',
      source: 'FDA recall notices, 2020–2021',
    },
  ],

  'nordic-naturals': [
    {
      id: 'baby-d3-recall',
      title: "Baby's Vitamin D3 Recalled, Superpotent",
      severity: 'medium',
      description: "Nordic Naturals voluntarily recalled one lot of Baby's Vitamin D3 Liquid in February 2024 after a manufacturing error caused an elevated (superpotent) vitamin D3 dose. The recall covered roughly 3,800 units; no adverse events were reported and the FDA later terminated the recall.",
      source: 'FDA, 2024',
    },
    {
      id: 'heart-health-suit',
      title: 'Fish Oil "Heart Health" Class Action',
      severity: 'medium',
      description: 'A federal class action (Clark v. Nordic Naturals, N.D. Cal.) filed in 2024 alleges the company misleadingly markets fish oil as supporting heart health, citing trials showing no cardiovascular benefit. A court preserved six claims in 2025; the case is pending as of 2026.',
      source: 'N.D. Cal., 2024–2025',
    },
    {
      id: 'zero-sugar-mislabel-recall',
      title: 'Kids Gummies Recalled for Sugar Mislabel',
      severity: 'medium',
      description: 'In May 2025, Nordic Naturals recalled roughly 1,164 bottles of Zero Sugar Kids Multivitamin gummies after they were found to contain undisclosed sugar and fumaric acid not reflected on the label.',
      source: 'ConsumerLab / company recall, 2025',
    },
    {
      id: 'natural-labeling-suit',
      title: '"Natural" Labeling Class Action',
      severity: 'medium',
      description: 'A 2024 class action alleges consumers were misled by "natural" branding because products contain synthetic excipients and synthetically derived vitamins; a court declined to dismiss it. The allegations remain unproven.',
      source: 'Class action filing, 2024',
    },
  ],

  'thorne': [
    {
      id: 'clean-record-nsf',
      title: 'Clean Record, NSF Sport Certified',
      severity: 'low',
      description: 'Thorne has no FDA warning letters, FTC actions, or major class-action settlements in the 2020–2026 period. Its manufacturing is NSF Certified for Sport, an independent quality program recognized by anti-doping authorities and used by many professional sports organizations.',
      source: 'NSF / FDA records, 2026',
    },
  ],

  'abbott-nutrition': [
    {
      id: 'sturgis-recall-consent-decree',
      title: 'Formula Recall, Shortage & Consent Decree',
      severity: 'high',
      description: "Abbott's Sturgis, Michigan plant was linked to Cronobacter contamination and unsanitary conditions; the 2022 shutdown caused a nationwide infant-formula shortage. Abbott entered a five-year consent decree with the FDA as a condition of reopening.",
      source: 'FDA, 2022',
    },
    {
      id: 'nec-verdicts',
      title: 'Similac NEC Lawsuits and Verdicts',
      severity: 'high',
      description: 'Abbott faces hundreds of lawsuits alleging its cow’s-milk-based Similac Special Care formula for preterm infants causes necrotizing enterocolitis. A Missouri jury awarded $495 million in 2024 and an Illinois jury awarded $70 million in 2026; Abbott is challenging the verdicts, and many cases remain pending in a federal MDL.',
      source: 'Missouri / Illinois courts, 2024–2026',
    },
    {
      id: 'doj-criminal-investigation',
      title: 'DOJ Investigation Into Sturgis Plant',
      severity: 'medium',
      description: 'In 2023, the U.S. Department of Justice opened a criminal investigation into conduct at the Sturgis plant following the recall, after the FDA reported falsified records and unsanitary conditions. The investigation has not resulted in charges as of 2026.',
      source: 'DOJ / media reports, 2023',
    },
    {
      id: 'sec-ftc-investigations',
      title: 'SEC and FTC Investigations',
      severity: 'medium',
      description: 'In 2023, the SEC reportedly opened an inquiry into Abbott’s disclosures about its formula business, and the FTC began examining whether formula makers engaged in anticompetitive conduct in WIC program contracting. These are investigations, not findings of wrongdoing.',
      source: 'SEC / FTC, 2023',
    },
  ],

  'reckitt': [
    {
      id: 'enfamil-nec-litigation',
      title: 'Enfamil NEC Lawsuits and Verdicts',
      severity: 'high',
      description: "Reckitt's Mead Johnson faces hundreds of lawsuits alleging Enfamil cow-milk formula caused necrotizing enterocolitis in premature infants. An Illinois jury awarded $60 million in 2024 and a Missouri jury awarded $495 million jointly with Abbott; Reckitt is appealing, and a large federal MDL remains pending.",
      source: 'Illinois / Missouri courts, 2024',
    },
    {
      id: 'securities-class-action',
      title: 'Investor Suit Over NEC Disclosures',
      severity: 'medium',
      description: 'A federal securities class action filed in 2025 alleges Reckitt misled investors about its financial exposure from the Enfamil NEC litigation. The allegations are pending and unproven.',
      source: 'SDNY, 2025',
    },
    {
      id: 'wic-antitrust-probe',
      title: 'FTC WIC Contracting Investigation',
      severity: 'medium',
      description: 'Mead Johnson/Reckitt, alongside Abbott, is part of an FTC inquiry into whether exclusive WIC infant-formula contracts enabled anticompetitive coordination. This is an investigation, not a finding of wrongdoing.',
      source: 'FTC, 2023',
    },
    {
      id: 'phenylephrine-claims',
      title: 'Oral Phenylephrine Efficacy Question',
      severity: 'low',
      description: 'An FDA advisory committee voted unanimously in 2023 that oral phenylephrine is not effective as a nasal decongestant. A related class action over Mucinex Sinus-Max was dismissed in 2024, but the finding raised questions about products containing the ingredient.',
      source: 'FDA advisory committee, 2023',
    },
  ],

  'bayer-consumer': [
    {
      id: 'roundup-litigation',
      title: 'Roundup Glyphosate Cancer Litigation',
      severity: 'high',
      description: 'Bayer (via its Monsanto acquisition) has paid over $10 billion settling Roundup cancer claims and proposed an additional $7.25 billion global settlement in 2026 to resolve current and future non-Hodgkin lymphoma claims. The proposed settlement received preliminary court approval, with a final-approval hearing set for 2026.',
      source: 'Court filings / Bayer, 2026',
    },
    {
      id: 'alka-seltzer-recalls',
      title: 'Alka-Seltzer Plus Mislabeling Recalls',
      severity: 'medium',
      description: 'Bayer issued voluntary recalls of Alka-Seltzer Plus products in 2022–2023 after packaging listed active ingredients that did not match the contents, which the FDA flagged as posing risk to consumers relying on the label. One recall covered about 1.1 million cartons.',
      source: 'FDA, 2022–2023',
    },
    {
      id: 'flintstones-metals-testing',
      title: 'Heavy-Metal Findings in Children’s Vitamins',
      severity: 'medium',
      description: 'According to 2024 independent testing by the advocacy group Lead Safe Mama, Flintstones Chewable Children’s Vitamins tested positive for lead and arsenic. The findings have not been confirmed by the FDA and have not resulted in a recall as of 2026.',
      source: 'Lead Safe Mama (independent testing), 2024',
    },
    {
      id: 'aspirin-divestiture',
      title: 'Aspirin Brand Sold to Haleon',
      severity: 'low',
      description: 'In 2025, Bayer agreed to sell its Aspirin and Bepanthen consumer brands to Haleon for roughly €8.2 billion, a change relevant to consumers who associate Bayer with Aspirin. Aleve, Claritin, One A Day and Flintstones remain with Bayer.',
      source: 'Company announcements, 2025',
    },
  ],

  'kenvue': [
    {
      id: 'talc-litigation',
      title: 'Talc & Cancer Litigation',
      severity: 'high',
      description: "Johnson's Baby Powder talc has been linked to cancer in thousands of lawsuits. J&J agreed in 2023 to retain all talc liabilities and indemnify Kenvue; a court rejected J&J's proposed $8.9 billion bankruptcy settlement in 2025, and a 2024 jury awarded $45 million in one mesothelioma case. Talc-based Johnson's Baby Powder was discontinued globally in 2023.",
      source: 'Court filings / SEC, 2023–2025',
    },
    {
      id: 'phenylephrine-claims',
      title: 'Oral Phenylephrine Efficacy Question',
      severity: 'low',
      description: 'An FDA advisory committee voted unanimously in 2023 that oral phenylephrine is not effective as a nasal decongestant, the active ingredient in products such as Sudafed PE and Benadryl Allergy Plus Congestion. A related class action was dismissed in 2024, but the FDA finding raised questions about the products.',
      source: 'FDA advisory committee, 2023',
    },
    {
      id: 'ipo-securities-suit',
      title: 'Securities Suit Over IPO Disclosures',
      severity: 'medium',
      description: 'A securities class action filed after Kenvue’s 2023 IPO alleges that IPO filings made misleading statements about talc liability exposure and the company’s outlook. The allegations are pending and unproven.',
      source: 'Securities class action, 2023',
    },
  ],

  'church-dwight': [
    {
      id: 'vitafusion-mesh-recall',
      title: 'Vitafusion Gummies Metal-Mesh Recall',
      severity: 'medium',
      description: 'Church & Dwight voluntarily recalled select Vitafusion gummy vitamins in 2021, including kids’ melatonin and multivitamin products, after consumer reports of possible metallic mesh contamination from manufacturing equipment. The company stated no injuries were reported at the time of the recall.',
      source: 'FDA recall database, 2021',
    },
    {
      id: 'nad-absorption-claim',
      title: 'Dropped "Clinically Proven" Vitamin Claim',
      severity: 'medium',
      description: 'In 2020, the advertising self-regulatory body NAD found that "Clinically Proven Absorption" claims on Vitafusion and L’il Critters multivitamins could mislead consumers into thinking all nutrients were tested when only two were. Church & Dwight agreed to drop the claim.',
      source: 'NAD (BBB National Programs), 2020',
    },
    {
      id: 'greenwashing-suit',
      title: 'Arm & Hammer "Eco-Friendly" Lawsuit',
      severity: 'medium',
      description: 'A 2023 class action alleges Church & Dwight markets Arm & Hammer Clean Burst laundry detergent as environmentally friendly while it contains 1,4-dioxane, a substance listed under California Prop 65. The greenwashing allegations are pending and unproven.',
      source: 'Class action filing, 2023',
    },
    {
      id: 'more-loads-claim-suit',
      title: 'Arm & Hammer "2X More Loads" Lawsuit',
      severity: 'low',
      description: 'A 2022 class action alleges Arm & Hammer laundry detergent was advertised as providing "2X more loads" in a way that misled consumers about the comparison baseline. The allegations have not been adjudicated.',
      source: 'Class action filing, 2022',
    },
  ],
};

module.exports = REANALYZED_ISSUES;
