const REANALYZED_ISSUES = {
  'garden-of-life': [
    {
      id: 'gol-lead-protein-2025',
      title: 'Lead Detected in Plant-Based Protein',
      severity: 'medium',
      description: 'A 2025 Consumer Reports investigation reported elevated lead in Garden of Life Sport Organic Plant-Based Protein, above the level Consumer Reports considers safe per day. The FDA has set no enforceable lead limit for protein powders; the finding was not a recall.',
      source: 'Consumer Reports, 2025',
    },
    {
      id: 'gol-lead-class-action',
      title: 'Class Action Over Protein Lead Claims',
      severity: 'medium',
      description: 'Garden of Life faces a consumer class-action alleging its organic plant-based protein was advertised as safe despite containing lead; pending as of 2025. The company states its products meet FDA, EPA, WHO and EFSA heavy-metal guidance.',
      source: 'Top Class Actions (pending litigation), 2025',
    },
    {
      id: 'gol-probiotic-potency',
      title: 'Probiotic Potency Below Label',
      severity: 'low',
      description: 'According to 2024 independent testing by ConsumerLab, some Garden of Life probiotic batches measured below their labeled live-culture counts. This testing is not a regulatory adjudication.',
      source: 'ConsumerLab, 2024',
    },
    {
      id: 'gol-nestle-ownership',
      title: 'Nestlé Ownership Conflict',
      severity: 'low',
      description: 'Garden of Life is owned by Nestlé, the world’s largest food company, which has faced ongoing scrutiny over supply-chain labor and sourcing practices. Buyers seeking independent brands should be aware of this ownership.',
      source: 'Company ownership records',
    },
  ],

  'follow-your-heart': [
    {
      id: 'fyh-danone-ownership',
      title: 'Owned by Danone Since 2021',
      severity: 'low',
      description: 'Follow Your Heart (Earth Island, maker of Vegenaise) was acquired by the multinational Danone in February 2021. The brand operates as a Danone subsidiary, so independent-brand claims should be weighed against corporate ownership.',
      source: 'Danone / PR Newswire, 2021',
    },
    {
      id: 'fyh-clean-record',
      title: 'No Major Enforcement on Record',
      severity: 'low',
      description: 'FDA and FTC enforcement databases show no recalls, warning letters, or enforcement actions against Follow Your Heart during 2020–2026. This reflects a comparatively clean regulatory profile for the period reviewed.',
      source: 'FDA / FTC databases, 2026',
    },
  ],

  'lundberg': [
    {
      id: 'lundberg-arsenic-rice',
      title: 'Inorganic Arsenic in Rice Products',
      severity: 'medium',
      description: 'Consumer Reports and independent 2024 lab testing have found measurable inorganic arsenic in California rice, including Lundberg products, reflecting an industry-wide issue tied to legacy soil contamination. Lundberg’s own published testing reports levels below FDA and EU thresholds.',
      source: 'Consumer Reports; independent lab testing, 2024',
    },
    {
      id: 'lundberg-heavy-metals-byproducts',
      title: 'Heavy Metals in Rice Byproducts',
      severity: 'low',
      description: 'Independent testing has reported trace lead and other heavy metals in rice bran and rice-polish byproducts, an endemic feature of rice agriculture rather than a Lundberg-specific finding. No regulatory action has been taken.',
      source: 'Independent testing, 2024',
    },
    {
      id: 'lundberg-water-use',
      title: 'Water Use Amid California Drought',
      severity: 'low',
      description: 'Lundberg Family Farms relies on Sacramento Valley irrigation, a region affected by recurring drought and water-allocation pressures during 2021–2024. This is general agricultural context, not a regulatory violation.',
      source: 'California water reporting, 2024',
    },
    {
      id: 'lundberg-labor-clean',
      title: 'No Labor Violations on Record',
      severity: 'low',
      description: 'OSHA and NLRB databases show no recorded violations against Lundberg Family Farms during 2020–2026, and the company holds Fair Trade certification on some organic rice lines. This reflects a clean labor record for the period.',
      source: 'OSHA / NLRB databases, 2026',
    },
  ],

  'eden-foods': [
    {
      id: 'eden-aca-lawsuit',
      title: 'Resolved Contraception Mandate Lawsuit',
      severity: 'low',
      description: 'In Eden Foods v. Sebelius (2013), the company challenged the Affordable Care Act contraception mandate on religious grounds; following the 2014 Hobby Lobby decision, a court entered a permanent injunction in Eden’s favor in 2015. The case is fully resolved but drew consumer boycotts.',
      source: 'Civil Rights Litigation Clearinghouse, 2015',
    },
    {
      id: 'eden-bpa-free-pioneer',
      title: 'Early Adopter of BPA-Free Cans',
      severity: 'low',
      description: 'Eden Foods has used BPA-free can linings since 1999 and labels its cans as BPA, BPS and phthalate free, with tomatoes packed in amber glass. This is a notable positive on food-contact safety relative to many peers.',
      source: 'Eden Foods company records',
    },
    {
      id: 'eden-supply-transparency',
      title: 'Limited Supply-Chain Disclosure',
      severity: 'low',
      description: 'As a small privately held company, Eden Foods publishes limited supply-chain documentation, and some organic-ingredient sourcing details are not independently verifiable. No misconduct has been established.',
      source: 'Consumer review of public disclosures, 2024',
    },
  ],

  'bragg': [
    {
      id: 'bragg-acv-claims',
      title: 'Limited Evidence for ACV Benefits',
      severity: 'low',
      description: 'Bragg’s apple cider vinegar marketing emphasizes wellness and metabolic benefits for which scientific evidence remains limited. No FTC enforcement action has been taken against the company over these claims.',
      source: 'FTC health-claim guidance, 2023',
    },
    {
      id: 'bragg-liquid-aminos-sodium',
      title: 'High Sodium in Liquid Aminos',
      severity: 'low',
      description: 'Bragg Liquid Aminos contains roughly 960 mg of sodium per tablespoon, among the highest of liquid seasonings, despite the product’s health-oriented positioning. The figure is verifiable from the product label.',
      source: 'Product nutrition label',
    },
    {
      id: 'bragg-clean-record',
      title: 'No Major Enforcement on Record',
      severity: 'low',
      description: 'FDA, FTC and USDA databases show no recalls, warning letters, or enforcement actions against Bragg during 2020–2026. The company is privately held with limited public sustainability disclosure.',
      source: 'FDA / FTC / USDA databases, 2026',
    },
  ],

  'goya-foods': [
    {
      id: 'goya-political-2020',
      title: 'CEO Endorsement Sparked Boycotts',
      severity: 'medium',
      description: 'In July 2020, CEO Robert Unanue praised President Trump at a White House event, prompting #BoycottGoya campaigns and a counter-boycott; a Cornell study found sales briefly rose then normalized. Unanue endorsed Trump again in 2024. This is reputational, not a regulatory matter.',
      source: 'CNN, NBC News, 2020; Cornell study, 2022',
    },
    {
      id: 'goya-sodium-canned',
      title: 'High Sodium in Canned Goods',
      severity: 'medium',
      description: 'Nutrition analyses report that Goya canned beans and rice products carry several hundred milligrams of sodium per serving, a meaningful share of the recommended daily limit. The figures are verifiable from product labels.',
      source: 'Nutrition label analysis, 2022',
    },
    {
      id: 'goya-labor-clean',
      title: 'No Major Facility Violations',
      severity: 'low',
      description: 'OSHA inspections of Goya facilities in New Jersey and Puerto Rico (2022–2023) found no major violations, and one NLRB wage complaint was withdrawn. This reflects a clean recent inspection record.',
      source: 'OSHA / NLRB databases, 2026',
    },
  ],

  'frontier-co-op': [
    {
      id: 'frontier-spice-lead-context',
      title: 'Lead in Spices: Industry-Wide Issue',
      severity: 'low',
      description: 'Heavy metals such as lead are an endemic, industry-wide concern in spices sourced from regions with contaminated soils. Independent ConsumerLab testing of Frontier turmeric in 2023 reported lead well below the FDA action level for spices.',
      source: 'ConsumerLab, 2023; Consumer Reports spice testing, 2021',
    },
    {
      id: 'frontier-supply-transparency',
      title: 'Limited Sourcing Traceability',
      severity: 'low',
      description: 'Frontier Co-op sources from dozens of countries, with Fair Trade certification covering only part of its portfolio and batch-level origin documentation not publicly available. This is a transparency limitation rather than a proven violation.',
      source: 'Frontier Co-op sustainability report, 2023',
    },
    {
      id: 'frontier-supplier-labor-risk',
      title: 'Labor Risks in Sourcing Regions',
      severity: 'low',
      description: 'Spices such as turmeric, cinnamon and cumin originate from regions where the ILO and Amnesty International have documented labor concerns industry-wide. These regional risks are not independently audited for Frontier’s specific supply chain.',
      source: 'ILO / Amnesty International reporting, 2023',
    },
    {
      id: 'frontier-clean-record',
      title: 'No U.S. Enforcement on Record',
      severity: 'low',
      description: 'FDA, FTC, OSHA and NLRB databases show no recalls, warning letters, or major enforcement actions against Frontier Co-op’s U.S. operations during 2020–2026. This reflects a clean domestic regulatory record.',
      source: 'FDA / FTC / OSHA / NLRB databases, 2026',
    },
  ],
};

module.exports = REANALYZED_ISSUES;
