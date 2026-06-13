const REANALYZED_ISSUES = {
  'kroger': [
    {
      id: 'kroger-albertsons-merger-blocked',
      title: 'Albertsons Merger Blocked on Antitrust Grounds',
      severity: 'high',
      description: 'The FTC sued in 2024 to stop Kroger\'s ~$24.6B acquisition of Albertsons. In December 2024 a federal judge granted a preliminary injunction halting the deal, finding it likely to reduce grocery competition, and a Washington state court separately found it violated state consumer-protection law.',
      source: 'FTC; U.S. District Court (D. Oregon), 2024',
    },
    {
      id: 'kroger-fair-food-holdout',
      title: 'Declines to Join Farmworker Fair Food Program',
      severity: 'medium',
      description: 'Kroger is one of the major grocers that has declined to join the Coalition of Immokalee Workers\' Fair Food Program, which sets wage and safety standards for tomato pickers. Farmworkers marched across Florida in March 2023 to pressure Kroger and Publix to participate.',
      source: 'Coalition of Immokalee Workers, 2023',
    },
    {
      id: 'kroger-socal-wage-dispute',
      title: 'Southern California Grocery Wage Dispute',
      severity: 'medium',
      description: 'In 2022, UFCW members at Kroger-owned Ralphs and Food 4 Less held strike-authorization votes after contract talks broke down, with the union calling the company\'s wage offer below cost-of-living needs. The union has also alleged Kroger outsourced food preparation to non-union kitchens.',
      source: 'UFCW; KPBS, 2022',
    },
    {
      id: 'kroger-merger-store-closures',
      title: 'Store Divestitures Tied to Failed Merger',
      severity: 'medium',
      description: 'In connection with the failed Albertsons merger, Kroger announced plans affecting numerous stores. Worker advocates raised concerns about layoffs and the adequacy of notice and severance, though the underlying labor claims have not been adjudicated.',
      source: 'Labor advocacy reports, 2023-2024',
    },
  ],

  'walmart': [
    {
      id: 'walmart-ca-wage-hour-settlements',
      title: 'Repeated California Wage-and-Hour Settlements',
      severity: 'medium',
      description: 'Walmart has settled multiple California wage-and-hour class actions, including a $65M settlement in 2019 over failure to provide cashier seating and a $5.2M settlement over unpaid COVID-19 screening time. The settlements resolved allegations without admissions of wrongdoing.',
      source: 'California court dockets, 2019-2022',
    },
    {
      id: 'walmart-osha-warehouse-safety',
      title: 'OSHA Citations at Distribution Facilities',
      severity: 'medium',
      description: 'Walmart has been cited by OSHA for workplace-safety issues at distribution and warehouse facilities, including ergonomic and machine-guarding hazards. The company has paid penalties and agreed to corrective measures in past enforcement actions.',
      source: 'OSHA records',
    },
    {
      id: 'walmart-union-retaliation-allegations',
      title: 'Allegations of Anti-Union Retaliation',
      severity: 'medium',
      description: 'Workers at multiple locations have filed NLRB charges alleging retaliation for union-organizing activity, including reduced scheduling and disciplinary actions. These complaints are unproven allegations pending before the labor board.',
      source: 'NLRB charges; media reports, 2023-2024',
    },
    {
      id: 'walmart-supplier-labor-concerns',
      title: 'Overseas Supplier Labor Concerns',
      severity: 'medium',
      description: 'Labor and human-rights organizations have reported alleged wage and labor abuses among Walmart suppliers in South Asia, including below-subsistence wages. Walmart says it conducts supplier audits; the allegations have not been independently adjudicated.',
      source: 'Human Rights Watch and labor-monitor reports, 2022-2024',
    },
    {
      id: 'walmart-plastic-pledge-gap',
      title: 'Plastic-Reduction Pledges Questioned',
      severity: 'low',
      description: 'Environmental groups report that Walmart\'s private-label packaging growth has outpaced its plastic-reduction commitments, alleging the company shifted packaging burden to suppliers. Walmart disputes these characterizations in its ESG reporting.',
      source: 'Environment America; Earthworks, 2023',
    },
  ],

  'costco': [
    {
      id: 'costco-chicken-welfare-suit',
      title: 'Shareholder Suit Over Chicken Welfare',
      severity: 'medium',
      description: 'A 2022 shareholder derivative lawsuit alleges Costco\'s Lincoln Premium Poultry operation raised chickens that grew too large to stand, citing 2021 Mercy for Animals undercover footage. The claims are pending and unproven; Costco says it maintains high animal-welfare standards.',
      source: 'Smith v. Vachris (King County, WA); CBS News, 2022',
    },
    {
      id: 'costco-covid-safety-complaints',
      title: 'Pandemic-Era Worker Safety Complaints',
      severity: 'low',
      description: 'During 2020-2021, some Costco warehouse workers filed OSHA complaints alleging inadequate ventilation, distancing, and PPE, and a few alleged retaliation for raising concerns. Costco agreed to enhanced safety measures; the allegations were not formally adjudicated.',
      source: 'OSHA complaints; USA Today, 2020-2021',
    },
    {
      id: 'costco-kirkland-sourcing-transparency',
      title: 'Limited Kirkland Sourcing Disclosure',
      severity: 'low',
      description: 'Costco has expanded Kirkland-brand organic products with limited public disclosure of supplier sourcing. Third-party reviewers have noted organic-certification verification gaps, particularly for produce.',
      source: 'Organic Integrity Database cross-checks, 2021-2023',
    },
  ],

  'target': [
    {
      id: 'target-2013-breach-settlement',
      title: 'Settled Landmark Data-Breach Case',
      severity: 'medium',
      description: 'Target\'s 2013 data breach exposed roughly 41 million payment-card accounts and contact data for 60 million customers. In 2017, Target agreed to pay $18.5M to 47 states and the District of Columbia, then the largest multistate data-breach settlement, and to strengthen its security program.',
      source: 'State Attorneys General settlement, 2017',
    },
    {
      id: 'target-ca-scheduling-claims',
      title: 'California Scheduling and Benefits Claims',
      severity: 'low',
      description: 'Target workers in California brought wage-and-hour claims alleging scheduling practices that limited benefits eligibility, which were resolved through settlement with back-wage payments and revised policies. Target did not admit wrongdoing.',
      source: 'California labor court, 2021',
    },
    {
      id: 'target-good-gather-supplier-audits',
      title: 'Good & Gather Supplier Audit Concerns',
      severity: 'low',
      description: 'Social-audit reports have alleged labor violations and below-poverty wages among some overseas suppliers for Target\'s Good & Gather private label. Target says it pursues audit remediation; the allegations are unverified and supply-chain transparency remains limited.',
      source: 'Social-accountability audit reports, 2022-2023',
    },
  ],

  'trader-joes': [
    {
      id: 'tj-nlrb-labor-violations',
      title: 'Found to Have Violated Labor Law',
      severity: 'medium',
      description: 'In November 2024, an NLRB administrative law judge found the Trader Joe\'s store in Hadley, Massachusetts violated federal labor law by barring union pins and denying unionized workers retirement benefits offered to others. Workers there and in Minneapolis unionized in 2022 under Trader Joe\'s United.',
      source: 'NLRB administrative law judge ruling, 2024',
    },
    {
      id: 'tj-plastic-packaging',
      title: 'Excess Single-Use Plastic Packaging',
      severity: 'low',
      description: 'Environmental groups have repeatedly cited Trader Joe\'s for using more single-use plastic packaging than competitors for produce and prepared foods. The company has announced packaging-reduction efforts.',
      source: 'Environment America, 2021',
    },
    {
      id: 'tj-osha-citations',
      title: 'Workplace-Safety Citations',
      severity: 'low',
      description: 'Trader Joe\'s store and warehouse facilities have received OSHA citations for hazards such as ergonomic and slip-and-fall risks and improper chemical storage. The company has addressed citations through penalties and corrective measures.',
      source: 'OSHA records, 2023',
    },
  ],

  'aldi': [
    {
      id: 'aldi-private-label-recalls',
      title: 'Private-Label Salmonella Recall',
      severity: 'medium',
      description: 'ALDI private-label products have been subject to contamination recalls, including a frozen-pizza Salmonella alert covering Mama Cozzi\'s and other brands tied to recalled dry-milk powder, with no illnesses reported. Regulators have flagged supplier-vetting and traceability gaps.',
      source: 'FDA/USDA enforcement records',
    },
    {
      id: 'aldi-wage-hour-claims',
      title: 'Distribution-Center Wage Claims',
      severity: 'medium',
      description: 'ALDI distribution-center workers in the Midwest filed wage-and-hour complaints alleging unpaid overtime and improper scheduling, which were resolved through settlement. ALDI denied liability but agreed to implement overtime-tracking measures.',
      source: 'Department of Labor; court filings, 2021-2022',
    },
    {
      id: 'aldi-organic-certification-gaps',
      title: 'Simply Nature Organic Verification Gaps',
      severity: 'low',
      description: 'Third-party reviewers have alleged gaps in organic-certification verification for ALDI\'s Simply Nature line, with some suppliers lacking complete USDA documentation. Remediation efforts are reported to be ongoing.',
      source: 'Organic Integrity Database, 2022-2023',
    },
    {
      id: 'aldi-plastic-packaging',
      title: 'Single-Use Plastic Packaging Growth',
      severity: 'low',
      description: 'Environmental groups allege ALDI expanded single-use plastic in its US fresh-produce packaging despite stricter standards in Europe, attributing it to cost-cutting. ALDI disputes characterizations of its sustainability record.',
      source: 'Environment America analysis, 2024',
    },
  ],

  'publix': [
    {
      id: 'publix-heiress-jan6-donations',
      title: 'Founding-Family Heiress Funded Jan. 6 Rally',
      severity: 'medium',
      description: 'Publix heiress Julie Jenkins Fancelli, a daughter of the chain\'s founder acting as a private individual, contributed roughly $650,000 to groups that organized the January 6, 2021 "Stop the Steal" rally. Publix, the company, said it was "deeply troubled" by her involvement and that the donations were not corporate.',
      source: 'OpenSecrets; Wall Street Journal, 2021-2023',
    },
    {
      id: 'publix-fair-food-holdout',
      title: 'Declines to Join Farmworker Fair Food Program',
      severity: 'medium',
      description: 'Publix has declined since 2009 to join the Coalition of Immokalee Workers\' Fair Food Program, which improves wages and conditions for tomato pickers, characterizing it as a labor matter for other employers. Farmworkers marched across Florida in 2023 to press Publix to participate.',
      source: 'Coalition of Immokalee Workers, 2009-2023',
    },
    {
      id: 'publix-driver-misclassification-claims',
      title: 'Delivery-Driver Misclassification Allegations',
      severity: 'medium',
      description: 'Workers have alleged Publix uses independent-contractor classifications for delivery drivers in ways that limit organizing and benefits, raising claims pending in Florida courts and before the NLRB. These are unproven allegations.',
      source: 'NLRB charges; Florida court filings, 2022-2023',
    },
    {
      id: 'publix-greenwise-organic-verification',
      title: 'GreenWise Organic Verification Concerns',
      severity: 'low',
      description: 'Consumer advocates have alleged limited third-party verification for some products in Publix\'s GreenWise organic line, citing incomplete USDA documentation among certain suppliers. Publix has committed to enhanced vetting.',
      source: 'USDA Organic Integrity Database, 2022-2023',
    },
  ],

  'heb': [
    {
      id: 'heb-private-label-recalls',
      title: 'Private-Label Contamination Recalls',
      severity: 'medium',
      description: 'H-E-B has recalled Central Market and H-E-B brand products over contamination concerns such as Salmonella and Listeria, with regulators flagging supplier-auditing gaps. No injuries were cited in these actions.',
      source: 'FDA enforcement records, 2023',
    },
    {
      id: 'heb-supplier-labor-concerns',
      title: 'Private-Label Supplier Labor Allegations',
      severity: 'low',
      description: 'Labor advocates have alleged wage theft and unsafe conditions among some suppliers for H-E-B\'s Mi Tienda line. H-E-B says it began supplier audits in 2022; the allegations are unverified and supply-chain transparency remains limited.',
      source: 'Labor advocacy organizations, 2021-2023',
    },
    {
      id: 'heb-water-usage',
      title: 'Water Use in Drought-Prone South Texas',
      severity: 'low',
      description: 'Conservation groups raised concerns about water use by H-E-B\'s ice-production and food-processing operations during South Texas droughts in 2020-2022, noting limited disclosure of conservation metrics. Recent ESG reports show modest reported improvements.',
      source: 'Local conservation groups, 2020-2022',
    },
  ],

  'wegmans': [
    {
      id: 'wegmans-part-time-wage-gaps',
      title: 'Living-Wage Gaps for Part-Time Workers',
      severity: 'low',
      description: 'Wegmans generally pays above industry average, and 2022-2023 negotiations produced wage increases of roughly 3-5%. However, part-time workers, the majority of its workforce, received smaller increases and reported difficulty meeting living-wage thresholds in high-cost markets.',
      source: 'UFCW; Bureau of Labor Statistics, 2022-2023',
    },
    {
      id: 'wegmans-covid-hazard-pay',
      title: 'Delayed Pandemic Hazard Pay',
      severity: 'low',
      description: 'Workers reported Wegmans initially declined to provide hazard pay during 2020-2021 pandemic peaks, implementing temporary pay in some regions only after union pressure and complaints. Some workers reported continued PPE and ventilation concerns.',
      source: 'UFCW; local news, 2021',
    },
    {
      id: 'wegmans-private-label-transparency',
      title: 'Limited Private-Label Sourcing Disclosure',
      severity: 'low',
      description: 'Wegmans publishes limited public data on organic certification and fair-trade verification for its expanding store-brand products. Third-party reviewers have noted gaps in organic vetting for produce.',
      source: 'Organic Integrity Database; consumer reports, 2023',
    },
  ],
};

module.exports = REANALYZED_ISSUES;
