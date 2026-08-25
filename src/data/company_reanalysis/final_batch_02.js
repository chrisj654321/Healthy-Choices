const REANALYZED_ISSUES = {
  'hershey': [
    {
      id: 'lead_cadmium',
      title: 'Lead & Cadmium Found in Dark Chocolate',
      severity: 'high',
      description: 'Consumer Reports tested Hershey dark chocolate products in December 2022 and found lead and cadmium at levels exceeding California Prop 65 daily limits. A class action filed December 28, 2022 (Lazazzaro v. Hershey, E.D.N.Y.) was dismissed without prejudice in February 2024; the underlying heavy metal findings from independent testing have not been contested.',
      source: 'Consumer Reports, December 2022; Top Class Actions, February 2024',
    },
    {
      id: 'pfas_wrappers',
      title: 'PFAS Chemicals in Chocolate Wrappers',
      severity: 'high',
      description: 'Two class actions filed in Pennsylvania federal court in 2024 allege that Hershey wrappers contain PFAS (per- and polyfluoroalkyl substances): Parish v. Hershey (1:24-cv-01868-CCC, filed Oct 29, 2024) and Beekman v. Hershey (1:24-cv-02234-CCC, filed Dec 24, 2024); the cases were consolidated in 2025. Independent lab testing across four facilities by Grizzly Research confirmed PFAS presence in the wrappers, and in January 2025 the FDA revoked 35 Food Contact Notifications permitting PFAS in food packaging.',
      source: 'Insurance Journal, 2024; Top Class Actions, 2025; Bakery & Snacks, 2025',
    },
    {
      id: 'cocoa_child_labor',
      title: 'Cocoa Supply Chain Child Labor Suit',
      severity: 'high',
      description: 'Hershey is named as a defendant in Coubaly et al. v. Nestlé, Cargill, Barry Callebaut, Mars, Olam, Mondelēz, and Hershey, a trafficking and forced labor lawsuit filed by International Rights Advocates on behalf of Malian children who allege they were trafficked to work on Ivory Coast cocoa farms. As of July 2025, the defendant companies successfully defeated an appeal; the case\'s further legal status is pending.',
      source: 'International Rights Advocates; Reuters, July 2025',
    },
    {
      id: 'skinnypop_underfilling',
      title: 'SkinnyPop Alleged 43% Underfilling',
      severity: 'medium',
      description: 'A class action filed September 12, 2024 in the U.S. District Court for the Southern District of California (Bogren et al. v. Hershey) alleges that SkinnyPop popcorn bags are filled to only 57% of stated weight, a 43% underfill. The case was pending as of late 2024.',
      source: 'Bloomberg Law, 2024; ClassAction.org, 2024',
    },
  ],

  'danone': [
    {
      id: 'listeria_silk',
      title: 'Silk Plant-Based Milk Listeria Deaths',
      severity: 'high',
      description: 'A national recall of Silk plant-based milk products was issued in July 2024 after Listeria contamination at third-party manufacturer Joriki (Pickering, Ontario) was linked to 3 deaths, 20 illnesses, and 15 hospitalizations. Danone Canada, Walmart Canada, and Intact Insurance agreed to a C$6.5 million class action settlement, with an approval hearing scheduled for January 26, 2026 in Montreal; no party admitted liability.',
      source: 'Globe and Mail, 2025; CP24, November 2025; Top Class Actions Canada',
    },
    {
      id: 'aptamil_cereulide_2026',
      title: 'Infant Formula Recalled Over Toxin Contamination',
      severity: 'high',
      description: 'The UK Food Standards Agency issued multiple recall alerts (FSA-PRIN-03/05/07-2026) for Aptamil and Cow & Gate infant formulas after cereulide toxin was identified in an ARA oil ingredient manufactured in China and incorporated into base powder produced in Ireland. Products were distributed across the UK, EU, and third countries; Nigeria\'s NAFDAC also issued a public alert (No. 08/2026). No admissions of liability have been made.',
      source: 'UK Food Standards Agency recalls FSA-PRIN-03/05/07-2026, 2026; NAFDAC Alert 08/2026',
    },
    {
      id: 'formula_marketing',
      title: 'Infant Formula WHO Code Violations',
      severity: 'high',
      description: 'The Access to Nutrition Foundation\'s Breast Milk Substitutes Index assigned Danone a 31% WHO Code compliance score, among the lowest of major formula manufacturers. IBFAN and Baby Milk Action have documented tactics including sponsorship of healthcare professional bodies and donations to government nutrition programs in Indonesia that monitors allege constitute improper formula promotion.',
      source: 'Access to Nutrition Foundation BMS Index; Baby Milk Action / IBFAN archives',
    },
    {
      id: 'yocrunch_plastic_recall',
      title: 'YoCrunch Recalled for Plastic Pieces',
      severity: 'medium',
      description: 'The FDA confirmed a recall of 17 YoCrunch yogurt varieties on July 14, 2025 (initiated July 11) after plastic pieces measuring 7–25 mm with sharp edges were found in dome toppers, posing a choking and laceration risk. The recall was nationwide and no injuries were reported at the time of announcement.',
      source: 'FDA recall database, July 2025; ABC News GMA, 2025',
    },
    {
      id: 'so_delicious_recall',
      title: 'So Delicious Recalled for Hard Foreign Objects',
      severity: 'medium',
      description: 'The FDA issued a Class II recall on December 15, 2025 for So Delicious Dairy Free Salted Caramel Cluster frozen dessert pints after small stones and hard objects were found in cashew inclusions. No injuries were reported at the time of the recall.',
      source: 'FDA recall notice, December 2025; Food Safety News, December 2025',
    },
    {
      id: 'evian_microplastics',
      title: 'Evian Microplastics Lawsuit Settled',
      severity: 'medium',
      description: 'The Plastic Pollution Coalition and Earth Island Institute each filed suit against Danone alleging that Evian water bottles leach microplastics and BPA, based on independent lab testing. Danone settled both lawsuits in September 2025, agreeing to allocate corporate funds over three years toward plastic-free Evian alternatives in the U.S.; Danone did not admit liability.',
      source: 'Plastic Pollution Coalition, July 2024; Packaging Dive, September 2025',
    },
  ],

  'campbell': [
    {
      id: 'clean_water_act_ohio',
      title: 'EPA Suit Over 5,400+ Admitted Pollution Discharges',
      severity: 'high',
      description: 'The DOJ and EPA filed suit in March 2024 against Campbell Soup Supply Co. over more than 5,400 admitted Clean Water Act violations at its Napoleon, Ohio facility, alleging illegal discharges of phosphorus, ammonia, E. coli, oil, grease, and suspended solids into the Maumee River, a tributary of Lake Erie. Campbell admitted liability via joint stipulation in September 2025; a trial to determine the penalty amount is anticipated in 2026.',
      source: 'EPA / DOJ complaint, March 2024; Spectrum News 1 Ohio, September 2025; Environment Ohio, 2025',
    },
    {
      id: 'wood_contamination_2025',
      title: 'USDA Alert: Wood Fragments in Soup Products',
      severity: 'medium',
      description: 'The USDA Food Safety and Inspection Service issued a public health alert on April 11, 2025 for Campbell\'s, Healthy Request, Molly\'s Kitchen, Sysco, Verve, and Crafted Market soup products distributed across Illinois, Indiana, Michigan, and Ohio after wood fragments were discovered originating from an FDA-regulated cilantro ingredient. No injuries were reported.',
      source: 'USDA FSIS public health alert, April 11, 2025; Food Safety News, April 2025',
    },
    {
      id: 'sodium_labeling',
      title: 'Consumer Lawsuits Over Sodium Health Claims',
      severity: 'medium',
      description: 'Multiple consumer class actions filed between 2019 and 2024 allege that Campbell misleadingly marketed high-sodium soups using "healthy" imagery and labeling claims. The cases\' settlement status had not been confirmed in primary court records as of mid-2026.',
      source: 'The Hill; TheHill.com; consumer court filings 2019–2024',
    },
    {
      id: 'bpa',
      title: 'BPA in Can Linings',
      severity: 'medium',
      description: 'Campbell has used bisphenol A (BPA) in the epoxy linings of its metal soup cans. Independent testing has detected BPA migration into canned foods, and the FDA has faced ongoing scientific debate about safe exposure thresholds. Campbell has stated it is working to transition to alternative liners.',
      source: 'FDA BPA assessments; consumer advocacy reporting',
    },
  ],

  'jm-smucker': [
    {
      id: 'jif_salmonella_2022',
      title: 'Jif Peanut Butter Salmonella Recall — 16 Ill',
      severity: 'high',
      description: 'The FDA issued a Class I recall in May 2022 for Jif peanut butter produced at the Lexington, Kentucky facility (lot codes 1274425–2140425) after whole-genome sequencing linked the strain to 16 illnesses across 12 states. Investigators matched the outbreak strain to an environmental sample from the same facility collected as far back as 2010. Smucker reported a $90 million direct financial impact from the recall.',
      source: 'FDA recall notice, May 2022; CDC outbreak investigation; Axios, September 2022',
    },
    {
      id: 'pet_food_pentobarbital',
      title: 'Euthanasia Drug Found in Gravy Train Pet Food',
      severity: 'high',
      description: 'Smucker voluntarily withdrew Gravy Train, Kibbles \'N Bits, Ol\' Roy, and Skippy wet dog food products in February 2018 after the FDA confirmed the presence of pentobarbital, a euthanasia drug, in samples; an ABC7/WJLA investigation found positive results in approximately 60% of Gravy Train cans tested. The FDA traced the contamination to tallow from a single supplier at one facility. This entry covers a pet food product.',
      source: 'FDA Animal & Veterinary advisories, 2018; CNN, 2018',
    },
    {
      id: 'pet_food_inspection_failures',
      title: 'Repeated FDA Pet Food Facility Violations',
      severity: 'medium',
      description: 'An FDA inspection in December 2019–January 2020 found Smucker\'s pet food facility had repeated the same Preventive Controls failure—relating to nutrient hazard management—that was cited in a March 2019 inspection. This inspection pattern coincided with three pet food recalls in under two years: 9Lives (December 2018, thiamine deficiency), Special Kitty (December 2019, excess choline chloride), and Natural Balance (July 2020, excess choline chloride). These entries cover pet food products.',
      source: 'FDA inspection reports; FDA recall notices 2018–2020; Food Safety News, 2018',
    },
    {
      id: 'uncrustables_protein',
      title: 'Uncrustables Protein Content Lawsuit',
      severity: 'medium',
      description: 'A class action filed in 2021 in the Northern District of California (Brown v. J.M. Smucker) alleges that Uncrustables sandwiches overstate protein content by 20–140%, in violation of the California Consumers Legal Remedies Act. The case\'s current status in 2026 has not been confirmed in primary court records.',
      source: 'Top Class Actions, 2021; ClassAction.org',
    },
    {
      id: 'natural_pb_recall_2021',
      title: 'Smucker\'s Natural Peanut Butter Salmonella Recall',
      severity: 'medium',
      description: 'The FDA issued a recall in November 2021 for approximately 3,000 jars of Smucker\'s Natural Peanut Butter Chunky (16 oz) due to potential Salmonella contamination. No illnesses were linked to the recalled product.',
      source: 'FDA recall notice, November 2021; AboutLawsuits.com, November 2021',
    },
  ],

  'mccormick': [
    {
      id: 'cinnamon_lead_recall',
      title: 'Recurring Lead Contamination in Cinnamon',
      severity: 'high',
      description: 'McCormick issued a recall of specific cinnamon lots in 2024 (beginning "L23" or "M07") for elevated lead levels, and in March 2026 a nationwide FDA recall of McCormick cinnamon products was announced due to lead contamination. Consumer Reports\' 2023 investigation of herbs and spices found elevated arsenic, cadmium, and lead readings across multiple McCormick product lines, indicating a recurring pattern of heavy metal contamination.',
      source: 'FDA recall notices, 2024 and March 2026; Consumer Reports, 2023',
    },
    {
      id: 'salmonella_recall_2021',
      title: 'Salmonella Recall: Italian Seasoning & Frank\'s',
      severity: 'medium',
      description: 'The FDA recalled McCormick Perfect Pinch Italian Seasoning, McCormick Culinary Italian Seasoning, and Frank\'s RedHot Buffalo Ranch Seasoning in July 2021 after routine FDA testing detected Salmonella. Distribution covered 32 states, Bermuda, and Canada. No illnesses were reported and the recall was completed and terminated.',
      source: 'FDA recall notice, July 26, 2021; McCormick press release, 2021',
    },
    {
      id: 'lead_spices',
      title: 'Heavy Metals Found Across Spice Lineup',
      severity: 'high',
      description: 'Consumer Reports\' December 2022 and 2023 investigations found elevated lead, cadmium, and arsenic levels in multiple McCormick spice products. As You Sow filed California Prop 65 legal notices against McCormick for lead and cadmium levels in specific products exceeding state daily safe harbor limits.',
      source: 'Consumer Reports, 2022–2023; As You Sow toxic enforcement program',
    },
  ],

  'ferrero': [
    {
      id: 'kinder_salmonella_2022',
      title: 'Kinder Salmonella Outbreak, Delayed Disclosure',
      severity: 'high',
      description: 'Belgian food safety authorities closed Ferrero\'s Arlon plant on April 8, 2022 after monophasic Salmonella Typhimurium was linked to at least 101 illnesses in the UK (majority in children under 5) and additional cases across France, Germany, Ireland, Sweden, and the Netherlands. UK FSA and Scottish FSS formally raised concerns about delays in Ferrero\'s disclosure after the contamination was reportedly detected in a buttermilk tank in December 2021 and Ferrero concluded there was no risk without notifying authorities until the outbreak became public. The US FDA also recalled Kinder Happy Moments and Kinder Mix Chocolate Treats Basket; the Arlon plant did not resume production until September 2022.',
      source: 'UK Food Standards Agency recall notices, 2022; Food Safety News, 2022; FDA US recall notice, 2022',
    },
    {
      id: 'hazelnut_child_labor',
      title: '3,020 Children in Hazelnut Supply Chain',
      severity: 'high',
      description: 'Ferrero\'s own 2024 Sustainability Report, produced in collaboration with the International Labour Organization, identified 3,020 children engaged in child labor in its Turkish hazelnut supply chain. Ferrero\'s ILO partnership is in its fifth phase (2024–2026), indicating the problem has persisted for at least a decade without full remediation.',
      source: 'Ferrero 2024 Sustainability Report; ILO project pages (ilo.org), 2024',
    },
    {
      id: 'palm_oil_ferrero',
      title: 'Palm Oil Linked to Deforestation Allegations',
      severity: 'medium',
      description: 'According to the Rainforest Action Network\'s Keep Forests Standing scorecard and a 2022 Rainforest Rescue open letter signed by more than 77,000 people, Ferrero\'s palm oil supply chain—including through Brazilian supplier Agropalma—has been associated with ongoing deforestation and land rights concerns. These findings have not been adjudicated; Ferrero has adopted a "no deforestation" palm oil policy but civil society organizations document continued gaps in implementation.',
      source: 'Rainforest Action Network KFS Scorecard; Rainforest Rescue, 2022; Great Italian Food Trade, 2022',
    },
    {
      id: 'nutella_sugar',
      title: 'Nutella Opposed EU Front-of-Pack Warning Label',
      severity: 'medium',
      description: 'Ferrero lobbied against the adoption of the EU\'s Nutri-Score front-of-pack nutritional warning system in 2022, which would assign Nutella a low score due to its high sugar and palm oil content. EURACTIV confirmed Ferrero\'s opposition as part of broader industry efforts to block or delay the mandatory labeling scheme.',
      source: 'EURACTIV, 2022',
    },
  ],

  'lindt': [
    {
      id: 'lead_lindt',
      title: 'Lead & Cadmium in Dark Chocolate, Lawsuit Active',
      severity: 'high',
      description: 'Consumer Reports\' December 2022 testing found that several Lindt dark chocolate bars contained lead and cadmium at levels exceeding California Prop 65 daily limits, and As You Sow subsequently filed Prop 65 legal notices citing both metals in Lindt\'s 70% and 85% cocoa bars. A class action, In re Lindt & Sprüngli Dark Chocolate Litigation (No. 1:2023cv01186, E.D.N.Y.), survived Lindt\'s motion to dismiss on September 6, 2024, when Judge Ann M. Donnelly rejected Lindt\'s argument that phrases like "expertly crafted" constituted non-actionable puffery; the case was in early discovery as of late 2024.',
      source: 'Consumer Reports, December 2022; Justia case 1:2023cv01186; Fortune, 2024; Snopes, December 2024',
    },
    {
      id: 'prop65_dual_metals',
      title: 'Prop 65 Notices for Lead and Cadmium',
      severity: 'high',
      description: 'As You Sow\'s Toxic Chocolate enforcement program issued California Prop 65 notices against Lindt for both lead and cadmium in its 70% and 85% cocoa dark chocolate bars. These dual-metal findings are consistent with confirmed scientific mechanisms: cadmium is absorbed from soil by cocoa trees, while lead contamination typically occurs post-harvest during drying and transport. The FDA does not enforce binding cadmium limits for most chocolate products, making Prop 65 the primary U.S. regulatory mechanism.',
      source: 'As You Sow asyousow.org/environmental-health/toxic-enforcement/toxic-chocolate; Consumer Reports, 2022',
    },
  ],

  'haribo': [
    {
      id: 'carnauba_wax_forced_labor',
      title: 'Forced Labor Conditions in Carnauba Wax Supply',
      severity: 'high',
      description: 'A 2017 ARD/WDR Markencheck documentary investigation found workers in Haribo\'s Brazilian carnauba wax supply chain sleeping outdoors or in trucks, lacking toilets and clean drinking water, and earning approximately $12 per day; the Brazilian Labor Ministry described conditions at one site as "slavery." Haribo pledged an independent audit following the broadcast, but no public audit results or confirmed full remediation have been published through 2025.',
      source: 'Business & Human Rights Resource Centre; FoodNavigator, November 2017; Vice, 2017',
    },
    {
      id: 'gelatin_source',
      title: 'Gelatin Sourced from Documented Factory Farms',
      severity: 'medium',
      description: 'The same 2017 ARD/WDR investigation documented conditions at pig farms supplying gelatin to Haribo, including animals with open sores, inadequate water access, and dead animals left among live pigs. Haribo pledged an investigation but has not published independent audit results confirming remediation of its pork gelatin supply chain.',
      source: 'ARD/WDR Markencheck documentary, 2017; FoodNavigator, November 2017',
    },
  ],

  'tootsie-roll': [
    {
      id: 'osha_amputation_2021',
      title: 'OSHA Willful Violation: Worker Finger Amputation',
      severity: 'high',
      description: 'OSHA cited Tootsie Roll Industries for one willful serious violation and proposed a $136,532 penalty following a workplace incident on April 19, 2021 at its Chicago facility, in which a 48-year-old worker suffered a partial finger amputation when a safety lockout was bypassed on a Robert\'s C-1500 Form, Fill and Seal Machine. OSHA\'s Region 5 news release, dated October 5, 2021, confirmed the willful classification.',
      source: 'OSHA Region 5 news release, October 5, 2021 (osha.gov); Bloomberg Law, 2021',
    },
    {
      id: 'artificial_colors',
      title: 'Synthetic Dyes Under FDA Phase-Out Pressure',
      severity: 'medium',
      description: 'Tootsie Roll products contain Red 40, Yellow 5, and Yellow 6 synthetic food dyes. In April 2025 the HHS and FDA announced an initiative to phase out synthetic dyes from the food supply, and in January 2025 the FDA finalized a ban on Red 3 effective 2027. California\'s School Food Safety Act (2024) and bans enacted in multiple states in 2024–2025 further restrict these dyes. CSPI\'s Synthetic Dyes Corporate Commitment Tracker does not list Tootsie Roll as having made any commitment to remove synthetic dyes.',
      source: 'FDA official announcements, April 2025; CSPI (cspi.org); Morgan Lewis client alert, 2026',
    },
  ],
};

module.exports = REANALYZED_ISSUES;
