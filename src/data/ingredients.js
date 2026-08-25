export const INGREDIENT_DB = {
  // ─── Sweeteners ───
  'high fructose corn syrup': {
    evidence: "FDA affirms high fructose corn syrup as GRAS (21 CFR 184.1866) and considers it comparable in safety to table sugar; the WHO recommends limiting all free sugars, including HFCS, to under 10% of daily calories (WHO, 2015).",
    risk: 9, category: 'sweeteners',
    label: 'High Fructose Corn Syrup',
    note: 'Highly processed sweetener; many nutritionists and health databases recommend limiting intake.',
    flag: 'avoid',
  },
  'aspartame': {
    evidence: "IARC classified aspartame as possibly carcinogenic to humans (Group 2B), based on limited evidence for liver cancer (2023); in the same review JECFA reaffirmed an acceptable daily intake of 40 mg/kg body weight (WHO, 2023).",
    risk: 7, category: 'sweeteners',
    label: 'Aspartame',
    note: 'Controversial artificial sweetener; some animal studies at very high doses raised questions — mainstream regulatory bodies consider it safe at typical consumption levels.',
    flag: 'caution',
  },
  'sucralose': {
    evidence: "FDA approved sucralose as a food additive in 1998; in 2023 the WHO issued a guideline advising against using non-sugar sweeteners, including sucralose, for weight control, citing no long-term weight benefit and possible associations with type 2 diabetes (WHO, 2023).",
    risk: 5, category: 'sweeteners',
    label: 'Sucralose',
    note: 'Alters gut microbiome; heat-stable but generates chlorinated compounds when cooked.',
    flag: 'caution',
  },
  'stevia': {
    risk: 1, category: 'sweeteners',
    label: 'Stevia',
    note: 'Natural plant-based sweetener, generally well tolerated.',
    flag: 'ok',
  },
  'cane sugar': {
    evidence: "The WHO recommends limiting free sugars - those added to foods plus sugars in syrups and juices - to under 10% of total daily calories, and ideally under 5% (WHO, 2015).",
    risk: 4, category: 'sweeteners',
    label: 'Cane Sugar',
    note: 'Natural sugar; moderate consumption is fine.',
    flag: 'moderate',
  },
  'sugar': {
    evidence: "The WHO recommends limiting free sugars - those added to foods plus sugars in syrups and juices - to under 10% of total daily calories, and ideally under 5% (WHO, 2015).",
    risk: 4, category: 'sweeteners',
    label: 'Sugar',
    note: 'Natural sugar; excessive consumption linked to metabolic issues.',
    flag: 'moderate',
  },

  // ─── Preservatives ───
  'sodium benzoate': {
    evidence: "FDA permits sodium benzoate as a preservative (21 CFR 184.1733) but recognizes it can react with ascorbic acid (vitamin C) in beverages to form trace benzene, a carcinogen; FDA confirmed this in some soft drinks in 2006 and worked with industry to reformulate (FDA, 2006).",
    risk: 8, category: 'preservatives',
    label: 'Sodium Benzoate',
    note: 'May react with vitamin C under certain conditions; the FDA and several health databases recommend minimizing intake.',
    flag: 'avoid',
  },
  'bha': {
    evidence: "The US National Toxicology Program has listed BHA as 'reasonably anticipated to be a human carcinogen' since 1991, based on forestomach tumors in rodents; IARC classified it as possibly carcinogenic to humans (Group 2B) in 1986. It is also listed under California Prop 65.",
    risk: 7, category: 'preservatives',
    label: 'BHA (Butylated Hydroxyanisole)',
    note: 'Listed on California Prop 65; classified by the National Toxicology Program as reasonably anticipated to be a human carcinogen based on animal studies.',
    flag: 'avoid',
  },
  'bht': {
    evidence: "FDA classifies BHT as GRAS (21 CFR 182.3173); IARC found only limited animal evidence and could not classify its carcinogenicity in humans (Group 3, 1986); animal studies have shown mixed tumor-promoting and protective effects.",
    risk: 6, category: 'preservatives',
    label: 'BHT (Butylated Hydroxytoluene)',
    note: 'Endocrine disruptor concerns raised in some animal studies at high doses.',
    flag: 'caution',
  },
  'potassium sorbate': {
    risk: 3, category: 'preservatives',
    label: 'Potassium Sorbate',
    note: 'Generally recognized as safe; mild preservative.',
    flag: 'ok',
  },
  'citric acid': {
    risk: 2, category: 'preservatives',
    label: 'Citric Acid',
    note: 'Natural preservative derived from citrus.',
    flag: 'ok',
  },

  // ─── Colorants / Dyes ───
  'red 40': {
    evidence: "After a 2007 University of Southampton study (The Lancet) linked mixtures of synthetic dyes including Red 40 to increased hyperactivity in children, the EU required foods containing it to carry the label 'may have an adverse effect on activity and attention in children' (EU, effective 2010).",
    risk: 8, category: 'dyes',
    label: 'Red 40 (Allura Red)',
    note: 'Subject to EU mandatory warning labeling; some studies associate it with hyperactivity in sensitive children.',
    flag: 'avoid',
  },
  'yellow 5': {
    evidence: "After the 2007 University of Southampton study (The Lancet) linked synthetic dye mixtures including tartrazine to increased hyperactivity in children, the EU required foods containing Yellow 5 to carry the warning 'may have an adverse effect on activity and attention in children' (EU, effective 2010).",
    risk: 7, category: 'dyes',
    label: 'Yellow 5 (Tartrazine)',
    note: 'Subject to EU warning labeling; some studies associate it with hyperactivity in sensitive individuals. Potential allergen for some.',
    flag: 'avoid',
  },
  'yellow 6': {
    evidence: "After the 2007 University of Southampton study (The Lancet) linked synthetic dye mixtures including Sunset Yellow to increased hyperactivity in children, the EU required foods containing Yellow 6 to carry the warning 'may have an adverse effect on activity and attention in children' (EU, effective 2010).",
    risk: 7, category: 'dyes',
    label: 'Yellow 6 (Sunset Yellow)',
    note: 'Subject to EU warning labeling; some studies associate it with hyperactivity in sensitive individuals.',
    flag: 'avoid',
  },
  'caramel color': {
    evidence: "California OEHHA listed 4-methylimidazole (4-MEI) - a byproduct formed in Class III and IV caramel coloring - as a carcinogen under Proposition 65 in 2011, based on NTP findings of lung tumors in mice, setting a no-significant-risk level of 29 ug/day above which a warning is required (California OEHHA, 2011).",
    risk: 6, category: 'dyes',
    label: 'Caramel Color (Class IV)',
    note: 'Class IV caramel color contains 4-methylimidazole (4-MEI), listed on California Prop 65 as a possible carcinogen based on animal studies.',
    flag: 'caution',
  },
  'annatto': {
    risk: 2, category: 'dyes',
    label: 'Annatto',
    note: 'Natural seed extract; some allergy reports.',
    flag: 'ok',
  },

  // ─── Flavor Enhancers ───
  'monosodium glutamate': {
    evidence: "FDA classifies MSG as GRAS and requires it to be declared by name on labels (21 CFR 182.1); a double-blind, placebo-controlled study in the Journal of Nutrition (2000) found no persistent or serious effects and that reported reactions in self-identified sensitive people were not reproducible on retesting.",
    risk: 3, category: 'flavor-enhancers',
    label: 'MSG (Monosodium Glutamate)',
    note: 'Causes sensitivity reactions in some individuals.',
    flag: 'ok',
  },
  'msg': {
    evidence: "FDA classifies MSG as GRAS and requires it to be declared by name on labels (21 CFR 182.1); a double-blind, placebo-controlled study in the Journal of Nutrition (2000) found no persistent or serious effects and that reported reactions in self-identified sensitive people were not reproducible on retesting.",
    risk: 3, category: 'flavor-enhancers',
    label: 'MSG',
    note: 'Causes sensitivity reactions in some individuals.',
    flag: 'ok',
  },
  // ─── Emulsifiers & Stabilizers ───
  'carrageenan': {
    evidence: "In a 2018 re-evaluation, EFSA judged carrageenan (E407) safe at current EU use levels but made its acceptable daily intake (75 mg/kg) temporary, citing toxicological data gaps and an inability to rule out intestinal inflammation in sensitive people (EFSA, 2018).",
    risk: 6, category: 'emulsifiers',
    label: 'Carrageenan',
    note: 'Derived from seaweed; linked to gut inflammation.',
    flag: 'caution',
  },
  'soy lecithin': {
    risk: 3, category: 'emulsifiers',
    label: 'Soy Lecithin',
    note: 'Common emulsifier; usually highly processed, soy allergen risk.',
    flag: 'ok',
  },
  'xanthan gum': {
    risk: 2, category: 'emulsifiers',
    label: 'Xanthan Gum',
    note: 'Generally safe thickener; large amounts may cause digestive issues.',
    flag: 'ok',
  },

  // ─── Allergens ───
  'milk': { risk: 2, category: 'dairy', label: 'Milk', note: 'Common allergen.', flag: 'allergen' },
  'eggs': { risk: 2, category: 'proteins', label: 'Eggs', note: 'Common allergen.', flag: 'allergen' },
  'wheat': { risk: 2, category: 'grains', label: 'Wheat', note: 'Gluten source; celiac concern.', flag: 'allergen' },
  'gluten': { risk: 2, category: 'grains', label: 'Gluten', note: 'Problematic for celiac/gluten-sensitive individuals.', flag: 'allergen' },
  'peanuts': { risk: 2, category: 'proteins', label: 'Peanuts', note: 'Major allergen; anaphylaxis risk.', flag: 'allergen' },
  'tree nuts': { risk: 2, category: 'proteins', label: 'Tree Nuts', note: 'Major allergen group.', flag: 'allergen' },
  'soy': { risk: 2, category: 'proteins', label: 'Soy', note: 'Common allergen; often GMO.', flag: 'allergen' },
  'fish': { risk: 2, category: 'proteins', label: 'Fish', note: 'Major allergen.', flag: 'allergen' },
  'shellfish': { risk: 2, category: 'proteins', label: 'Shellfish', note: 'Major allergen.', flag: 'allergen' },

  // ─── Flavor catch-alls ───
  'natural flavor': {
    evidence: "Under FDA regulation 21 CFR 101.22, 'natural flavor' must be declared on the label, but manufacturers are not required to disclose the specific constituent chemicals in the flavor blend, which may be treated as trade secrets (FDA, 21 CFR 101.22).",
    risk: 2, category: 'flavor-enhancers',
    label: 'Natural Flavor',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'ok',
  },
  'natural flavors': {
    evidence: "Under FDA regulation 21 CFR 101.22, 'natural flavor' must be declared on the label, but manufacturers are not required to disclose the specific constituent chemicals in the flavor blend, which may be treated as trade secrets (FDA, 21 CFR 101.22).",
    risk: 2, category: 'flavor-enhancers',
    label: 'Natural Flavors',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'ok',
  },
  'artificial flavor': {
    evidence: "Under FDA regulation 21 CFR 101.22, 'artificial flavor' covers flavoring not derived from a natural source; it must be declared on the label, but the specific chemical constituents need not be individually disclosed (FDA, 21 CFR 101.22).",
    risk: 5, category: 'flavor-enhancers',
    label: 'Artificial Flavor',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'artificial flavors': {
    evidence: "Under FDA regulation 21 CFR 101.22, 'artificial flavor' covers flavoring not derived from a natural source; it must be declared on the label, but the specific chemical constituents need not be individually disclosed (FDA, 21 CFR 101.22).",
    risk: 5, category: 'flavor-enhancers',
    label: 'Artificial Flavors',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'natural and artificial flavor': {
    evidence: "Under FDA regulation 21 CFR 101.22, both natural and artificial flavors must be declared on the label, but the specific constituent chemicals within a flavor blend need not be individually disclosed (FDA, 21 CFR 101.22).",
    risk: 5, category: 'flavor-enhancers',
    label: 'Natural & Artificial Flavor',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'natural and artificial flavors': {
    evidence: "Under FDA regulation 21 CFR 101.22, both natural and artificial flavors must be declared on the label, but the specific constituent chemicals within a flavor blend need not be individually disclosed (FDA, 21 CFR 101.22).",
    risk: 5, category: 'flavor-enhancers',
    label: 'Natural & Artificial Flavors',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'natural & artificial flavors': {
    evidence: "Under FDA regulation 21 CFR 101.22, both natural and artificial flavors must be declared on the label, but the specific constituent chemicals within a flavor blend need not be individually disclosed (FDA, 21 CFR 101.22).",
    risk: 5, category: 'flavor-enhancers',
    label: 'Natural & Artificial Flavors',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'artificial flavoring': {
    evidence: "Under FDA regulation 21 CFR 101.22, 'artificial flavor' covers flavoring not derived from a natural source; it must be declared on the label, but the specific chemical constituents need not be individually disclosed (FDA, 21 CFR 101.22).",
    risk: 5, category: 'flavor-enhancers',
    label: 'Artificial Flavoring',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'natural flavoring': {
    evidence: "Under FDA regulation 21 CFR 101.22, 'natural flavor' must be declared on the label, but manufacturers are not required to disclose the specific constituent chemicals in the flavor blend, which may be treated as trade secrets (FDA, 21 CFR 101.22).",
    risk: 2, category: 'flavor-enhancers',
    label: 'Natural Flavoring',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'ok',
  },

  // ─── Phase 2: artificial dyes & flagged additives (sourced from FDA/EFSA) ───
  'red 3': {
    evidence: "On January 15, 2025, the FDA revoked authorization for FD&C Red No. 3 in food, citing the Delaney Clause after studies showed it causes thyroid cancer in male rats at high doses; it had been barred from cosmetics since 1990. Manufacturers have until January 2027 to reformulate (FDA, 2025).",
    risk: 9, category: 'dyes', label: 'Red 3 (Erythrosine)',
    note: 'Synthetic dye the FDA banned from food in January 2025 after it was shown to cause cancer in animals. Already barred from cosmetics since 1990.',
    flag: 'avoid',
  },
  'fd&c red 3': {
    evidence: "On January 15, 2025, the FDA revoked authorization for FD&C Red No. 3 in food, citing the Delaney Clause after studies showed it causes thyroid cancer in male rats at high doses; it had been barred from cosmetics since 1990. Manufacturers have until January 2027 to reformulate (FDA, 2025).",
    risk: 9, category: 'dyes', label: 'FD&C Red No. 3',
    note: 'Synthetic dye the FDA banned from food in January 2025 after it was shown to cause cancer in animals.',
    flag: 'avoid',
  },
  'erythrosine': {
    evidence: "On January 15, 2025, the FDA revoked authorization for FD&C Red No. 3 in food, citing the Delaney Clause after studies showed it causes thyroid cancer in male rats at high doses; it had been barred from cosmetics since 1990. Manufacturers have until January 2027 to reformulate (FDA, 2025).",
    risk: 9, category: 'dyes', label: 'Erythrosine (Red 3)',
    note: 'Synthetic dye the FDA banned from food in January 2025 after cancer findings in animal studies.',
    flag: 'avoid',
  },
  'fd&c red 40': {
    evidence: "After a 2007 University of Southampton study (The Lancet) linked mixtures of synthetic dyes including Red 40 to increased hyperactivity in children, the EU required foods containing it to carry the label 'may have an adverse effect on activity and attention in children' (EU, effective 2010).",
    risk: 8, category: 'dyes', label: 'FD&C Red No. 40',
    note: 'Subject to EU mandatory warning labeling; some studies associate it with hyperactivity in sensitive children.',
    flag: 'avoid',
  },
  'allura red': {
    evidence: "After a 2007 University of Southampton study (The Lancet) linked mixtures of synthetic dyes including Red 40 to increased hyperactivity in children, the EU required foods containing it to carry the label 'may have an adverse effect on activity and attention in children' (EU, effective 2010).",
    risk: 8, category: 'dyes', label: 'Allura Red (Red 40)',
    note: 'Subject to EU mandatory warning labeling; some studies associate it with hyperactivity in sensitive children.',
    flag: 'avoid',
  },
  'tartrazine': {
    evidence: "After the 2007 University of Southampton study (The Lancet) linked synthetic dye mixtures including tartrazine to increased hyperactivity in children, the EU required foods containing Yellow 5 to carry the warning 'may have an adverse effect on activity and attention in children' (EU, effective 2010).",
    risk: 7, category: 'dyes', label: 'Tartrazine (Yellow 5)',
    note: 'Subject to EU warning labeling; some studies associate it with hyperactivity in sensitive individuals. Potential allergen for some.',
    flag: 'avoid',
  },
  'blue 1': {
    evidence: "FDA approved FD&C Blue No. 1 for food use in 1969; California OEHHA's 2021 review associated widely used synthetic dyes, including Blue 1, with neurobehavioral effects in some children (California OEHHA, 2021).",
    risk: 5, category: 'dyes', label: 'Blue 1 (Brilliant Blue)',
    note: 'Synthetic petroleum-derived dye; among the artificial colors linked to hyperactivity in children in some studies.',
    flag: 'caution',
  },
  'artificial color': {
    evidence: "California OEHHA concluded in a 2021 assessment that synthetic food dyes are associated with adverse neurobehavioral outcomes in children and that current federal intake levels may not sufficiently protect children's behavioral health, covering seven FDA-approved dyes (California OEHHA, 2021).",
    risk: 5, category: 'dyes', label: 'Artificial Color',
    note: 'Synthetic petroleum-derived coloring with no nutritional value; several common dyes are linked to hyperactivity in children.',
    flag: 'caution',
  },
  'pgpr': {
    evidence: "EFSA re-evaluated PGPR (E476) in 2017, found no genotoxicity or carcinogenicity concern, and set an acceptable daily intake of 25 mg/kg body weight; FDA permits it as an emulsifier in chocolate-type products up to 0.3% (EFSA, 2017; FDA).",
    risk: 4, category: 'emulsifiers', label: 'PGPR (Polyglycerol Polyricinoleate)',
    note: 'Synthetic emulsifier used to cut cocoa-butter cost in chocolate; FDA-permitted but a heavily processed industrial additive.',
    flag: 'caution',
  },
  'polyglycerol polyricinoleate': {
    evidence: "EFSA re-evaluated PGPR (E476) in 2017, found no genotoxicity or carcinogenicity concern, and set an acceptable daily intake of 25 mg/kg body weight; FDA permits it as an emulsifier in chocolate-type products up to 0.3% (EFSA, 2017; FDA).",
    risk: 4, category: 'emulsifiers', label: 'Polyglycerol Polyricinoleate (PGPR)',
    note: 'Synthetic emulsifier used to reduce cocoa-butter content in chocolate; FDA-permitted but heavily processed.',
    flag: 'caution',
  },
  'sodium silicoaluminate': {
    evidence: "FDA lists sodium aluminosilicate as GRAS for use as an anti-caking agent up to 2% (21 CFR 582.2727); the EU authorizes it as additive E554; both consider it safe at approved levels (FDA; EU Reg. 231/2012).",
    risk: 4, category: 'additives', label: 'Sodium Silicoaluminate',
    note: 'Aluminum-based anti-caking agent; FDA-permitted, though some consumers prefer to limit added-aluminum intake.',
    flag: 'caution',
  },
  'sodium aluminosilicate': {
    evidence: "FDA lists sodium aluminosilicate as GRAS for use as an anti-caking agent up to 2% (21 CFR 582.2727); the EU authorizes it as additive E554; both consider it safe at approved levels (FDA; EU Reg. 231/2012).",
    risk: 4, category: 'additives', label: 'Sodium Aluminosilicate',
    note: 'Aluminum-based anti-caking agent; FDA-permitted, though some consumers prefer to limit added-aluminum intake.',
    flag: 'caution',
  },
  'confectioners glaze': {
    evidence: "FDA classifies purified shellac (the basis of confectioner's glaze) as GRAS for food use; JECFA and EFSA set an acceptable daily intake of 0-2.5 mg/kg; it is not absorbed intact and is considered low-risk at authorized levels (FDA; WHO/JECFA).",
    risk: 3, category: 'additives', label: 'Confectioner\'s Glaze (Shellac)',
    note: 'A resin secreted by the lac insect, used to shine candies; safe to eat but not vegan or vegetarian.',
    flag: 'moderate',
  },
  'shellac': {
    evidence: "FDA classifies purified shellac (the basis of confectioner's glaze) as GRAS for food use; JECFA and EFSA set an acceptable daily intake of 0-2.5 mg/kg; it is not absorbed intact and is considered low-risk at authorized levels (FDA; WHO/JECFA).",
    risk: 3, category: 'additives', label: 'Shellac (Confectioner\'s Glaze)',
    note: 'A resin secreted by the lac insect, used as a glaze; safe to eat but not vegan or vegetarian.',
    flag: 'moderate',
  },
  'apocarotenal': {
    evidence: "FDA approved beta-apo-8'-carotenal as a food color additive in 1963 (21 CFR 73.90); EFSA re-evaluated it in 2012 and reaffirmed it as safe, setting an acceptable daily intake of 0.05 mg/kg (EFSA, 2012).",
    risk: 3, category: 'dyes', label: 'Apocarotenal',
    note: 'A synthetic orange-red carotenoid coloring (E160e); FDA- and EFSA-approved and considered low concern.',
    flag: 'moderate',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ULTRA-PROCESSING MARKERS (researched + reviewed 2026-06)
  // Each carries an `evidence` field: a REPORTED regulatory/study fact with a
  // named source — never an authored health claim. `upfMarker: true` feeds the
  // processing-ceiling logic in the scorer.
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Emulsifiers & Thickeners ───
  'mono and diglycerides': {
    risk: 5, category: 'emulsifiers', label: 'Mono- and Diglycerides',
    note: 'One of the most common emulsifiers in US processed foods; some studies suggest a possible link to cancer risk, though causation is not established and the FDA still considers it GRAS.',
    evidence: 'A 2024 French prospective cohort (NutriNet-Santé, n=92,000; PLOS Medicine, 2024) found higher intakes of mono- and diglycerides (E471) associated with increased overall, breast, and prostate cancer risk; authors noted results require replication. FDA classifies them as GRAS (21 CFR 184.1505).',
    flag: 'caution', upfMarker: true,
  },
  'polysorbate 80': {
    risk: 5, category: 'emulsifiers', label: 'Polysorbate 80',
    note: 'A synthetic emulsifier widely used in ice cream and baked goods; some animal and preliminary human studies link it to gut-microbiome disruption and low-grade intestinal inflammation.',
    evidence: 'Chassaing et al. (Nature, 2015) reported low concentrations of polysorbate 80 promoted colitis-like gut-microbiota changes in mice. FDA permits it as a direct food additive (21 CFR 172.840).',
    flag: 'caution', upfMarker: true,
  },
  'polysorbate 60': {
    risk: 4, category: 'emulsifiers', label: 'Polysorbate 60',
    note: 'A close relative of polysorbate 80 used in whipped toppings and coffee whiteners; carries similar mechanistic gut-health concerns, though it is less studied.',
    evidence: 'FDA permits polysorbate 60 as a direct food additive (21 CFR 172.836); JECFA assigned an Acceptable Daily Intake of 0–25 mg/kg body weight. No polysorbate-60-specific human gut-microbiome trials identified.',
    flag: 'moderate', upfMarker: true,
  },
  'carboxymethylcellulose': {
    risk: 5, category: 'emulsifiers', label: 'Carboxymethylcellulose (Cellulose Gum)',
    note: 'A synthetic cellulose-derived thickener; a controlled human feeding study found it perturbed gut microbiota and increased abdominal discomfort, though regulators still consider it safe for general use.',
    evidence: 'Chassaing et al. (Gastroenterology, 2022) ran a double-blind controlled-feeding trial (15 g/day, 11 days) and reported perturbed gut microbiota and increased postprandial abdominal discomfort in healthy adults.',
    flag: 'caution', upfMarker: true,
  },
  'datem': {
    risk: 3, category: 'emulsifiers', label: 'DATEM',
    note: 'A dough-conditioning emulsifier common in commercial bread; widely considered safe at approved levels.',
    evidence: 'JECFA (2004) reviewed a 2-year rat study, found no dose-related lesion pattern, and set an ADI of 0–50 mg/kg body weight. FDA lists DATEM as GRAS (21 CFR 184.1101).',
    flag: 'ok', upfMarker: true,
  },
  'sodium stearoyl lactylate': {
    risk: 3, category: 'emulsifiers', label: 'Sodium Stearoyl Lactylate (SSL)',
    note: 'A dough-conditioning emulsifier found in commercial breads and snack foods; regulators have found no genotoxicity or carcinogenicity concern at approved levels.',
    evidence: 'EFSA\'s 2013 re-evaluation (EFSA Journal 2013;11(5):3144) found low acute toxicity and no genotoxicity concern, setting a combined ADI of 20 mg/kg body weight/day. FDA permits SSL (21 CFR 172.846).',
    flag: 'moderate', upfMarker: true,
  },
  'guar gum': {
    risk: 2, category: 'emulsifiers', label: 'Guar Gum',
    note: 'A legume-derived soluble fiber used as a thickener; regulators found no safety concern at food-use levels.',
    evidence: 'EFSA\'s re-evaluation of guar gum (E412) (EFSA Journal 2017;15(2):4669) concluded no numerical ADI is needed and no safety concern at food-additive levels. FDA classifies it as GRAS (21 CFR 184.1339).',
    flag: 'ok', upfMarker: false,
  },
  'locust bean gum': {
    risk: 2, category: 'emulsifiers', label: 'Locust Bean Gum (Carob Bean Gum)',
    note: 'A natural galactomannan gum from carob seeds used in dairy and plant-based products; considered benign by all major regulatory authorities.',
    evidence: 'EFSA\'s 2017 re-evaluation (E410) found no adverse effects in rodent studies at the highest doses tested and concluded no numerical ADI is needed.',
    flag: 'ok', upfMarker: false,
  },
  'gum arabic': {
    risk: 2, category: 'emulsifiers', label: 'Gum Arabic (Acacia Gum)',
    note: 'A plant-derived soluble fiber used as an emulsifier and stabilizer; long established as safe.',
    evidence: 'EFSA\'s 2017 re-evaluation of acacia gum (E414) concluded no numerical ADI is needed and no safety concern at food-additive levels. FDA affirms it as GRAS (21 CFR 184.1330).',
    flag: 'ok', upfMarker: false,
  },
  'maltodextrin': {
    risk: 4, category: 'additives', label: 'Maltodextrin',
    note: 'A highly processed starch-derived filler ubiquitous in packaged foods; carries a glycemic index exceeding table sugar, and some studies suggest it may promote adhesion of Crohn\'s-associated gut bacteria.',
    evidence: 'Nickerson & McDonald (PLOS ONE, 2012) found maltodextrin enhanced adhesion of Crohn\'s-associated E. coli to intestinal cells. FDA classifies it as GRAS (21 CFR 184.1444); reported glycemic index 85–105, exceeding sucrose.',
    flag: 'moderate', upfMarker: true,
  },
  'modified food starch': {
    risk: 3, category: 'additives', label: 'Modified Food Starch',
    note: 'A chemically or enzymatically treated starch used as a thickener and stabilizer; considered safe within regulated limits but offers no nutritional value and is a reliable marker of ultra-processing.',
    evidence: 'FDA permits "food starch-modified" (21 CFR 172.892), which caps the degree of chemical modification. No carcinogenicity or genotoxicity concern has been identified by FDA, EFSA, or JECFA at approved levels.',
    flag: 'ok', upfMarker: true,
  },
  'sodium phosphate': {
    risk: 4, category: 'additives', label: 'Sodium Phosphate',
    note: 'An inorganic salt used as an emulsifying and buffering agent in processed cheeses, meats, and canned goods; some research suggests high dietary phosphate intake may stress kidney function, particularly in people with chronic kidney disease.',
    evidence: 'A systematic review in BMJ Open (2018) found higher serum phosphate associated with increased all-cause and cardiovascular mortality, though additive vs. natural phosphate was hard to isolate. FDA lists sodium phosphates as GRAS/approved (e.g. 21 CFR 182.1778).',
    flag: 'moderate', upfMarker: true,
  },

  // ─── Synthetic Preservatives ───
  'sodium nitrite': {
    risk: 9, category: 'preservatives', label: 'Sodium Nitrite',
    note: 'Used in cured and processed meats; may contribute to the formation of N-nitroso compounds in the body, which are linked to colorectal cancer risk.',
    evidence: 'IARC classified processed meat as carcinogenic to humans (Group 1), citing nitrosamine formation via nitrite (Monographs Vol. 114, 2015); it separately classified ingested nitrite under endogenous-nitrosation conditions as probably carcinogenic (Group 2A, Vol. 94, 2010).',
    flag: 'avoid', upfMarker: true,
  },
  'sodium nitrate': {
    risk: 8, category: 'preservatives', label: 'Sodium Nitrate',
    note: 'Used as a curing agent in processed meats; the body can convert nitrate to nitrite, which may then form carcinogenic nitrosamines.',
    evidence: 'IARC classified ingested nitrate/nitrite under endogenous-nitrosation conditions as probably carcinogenic to humans (Group 2A, Monographs Vol. 94, 2010). EFSA conducted a risk assessment on added nitrates/nitrites (2017).',
    flag: 'avoid', upfMarker: true,
  },
  'potassium nitrate': {
    risk: 8, category: 'preservatives', label: 'Potassium Nitrate',
    note: 'A traditional curing salt used in specialty cured meats; shares the nitrate-to-nitrite conversion pathway and associated nitrosamine concerns.',
    evidence: 'IARC classified ingested nitrate/nitrite under endogenous-nitrosation conditions as probably carcinogenic to humans (Group 2A, Vol. 94, 2010). USDA/FSIS limits potassium nitrate to 200 ppm in specialty cured meats (9 CFR 424.22).',
    flag: 'avoid', upfMarker: true,
  },
  'tbhq': {
    risk: 7, category: 'preservatives', label: 'TBHQ (tert-Butylhydroquinone)',
    note: 'A synthetic antioxidant preservative used in fats and oils; not approved in Japan and restricted in the EU, and some animal studies have raised concerns at high doses.',
    evidence: 'Japan has not approved TBHQ for food use. The EU permits it at restricted levels (E319) but excludes it from infant formula. FDA limits its use to 0.02% of the fat or oil content (21 CFR 172.185).',
    flag: 'avoid', upfMarker: true,
  },
  'propyl gallate': {
    risk: 6, category: 'preservatives', label: 'Propyl Gallate',
    note: 'A synthetic antioxidant used in fats and oils; the EU updated its specifications in 2024 after EFSA identified safety uncertainty around chlorinated by-products from its manufacturing process.',
    evidence: 'EFSA identified that hydrochloric-acid catalysis in propyl gallate manufacturing could produce chlorinated by-products of uncertain safety (2014); the EU amended its specifications via Commission Regulation (EU) 2024/2597 (effective Oct 2024). NTP found only equivocal evidence of carcinogenicity.',
    flag: 'caution', upfMarker: true,
  },
  'sulfur dioxide': {
    risk: 6, category: 'preservatives', label: 'Sulfur Dioxide',
    note: 'A sulfiting agent used in dried fruits, wine, and some processed foods; can trigger asthma attacks and allergic reactions in sensitive individuals.',
    evidence: 'FDA prohibited sulfiting agents on raw fruits and vegetables served fresh after reports of severe reactions, including deaths, in sulfite-sensitive asthmatics (1986; 21 CFR 182.3862), and requires label disclosure at ≥10 ppm.',
    flag: 'caution', upfMarker: true,
  },
  'sodium metabisulfite': {
    risk: 6, category: 'preservatives', label: 'Sodium Metabisulfite',
    note: 'A sulfiting agent used in processed foods and beverages; like other sulfites, a known trigger for asthma attacks and allergic-type reactions in sensitive individuals.',
    evidence: 'FDA classifies it as GRAS (21 CFR 182.3766) but prohibits its use on raw produce and in vitamin-B1-source foods, and requires label disclosure at ≥10 ppm.',
    flag: 'caution', upfMarker: true,
  },
  'sodium sulfite': {
    risk: 5, category: 'preservatives', label: 'Sodium Sulfite',
    note: 'A sulfiting agent used as a preservative and processing aid; shares the asthma-sensitivity profile of other sulfites and requires mandatory label disclosure.',
    evidence: 'FDA classifies sodium sulfite as GRAS as a chemical preservative (21 CFR 182.3798), subject to the same raw-produce prohibitions as other sulfites, and mandates label disclosure at ≥10 ppm.',
    flag: 'caution', upfMarker: true,
  },
  'calcium disodium edta': {
    risk: 3, category: 'preservatives', label: 'Calcium Disodium EDTA',
    note: 'A chelating agent used to preserve color and flavor in canned and processed foods; concerns exist around potential depletion of essential minerals such as zinc and iron at elevated intake.',
    evidence: 'FDA permits it as a food additive (21 CFR 172.120). EFSA opened a formal re-evaluation in June 2024, citing shortcomings in the toxicity database and requesting additional genotoxicity and use-level data.',
    flag: 'ok', upfMarker: true,
  },
  'calcium propionate': {
    risk: 3, category: 'preservatives', label: 'Calcium Propionate',
    note: 'A widely used mold inhibitor in bread and baked goods; considered safe at approved levels, though its presence indicates an industrially extended-shelf-life product.',
    evidence: 'FDA affirms calcium propionate as GRAS for baked goods and cheeses. JECFA and EFSA each set an ADI of up to 10 mg/kg body weight for propionic acid and its salts.',
    flag: 'moderate', upfMarker: true,
  },
  'sodium propionate': {
    risk: 3, category: 'preservatives', label: 'Sodium Propionate',
    note: 'A mold inhibitor related to calcium propionate, used primarily in bread; considered safe by major regulators and primarily signals a heavily processed product.',
    evidence: 'FDA classifies sodium propionate as GRAS with no limitation beyond good manufacturing practice (21 CFR 184.1784); EFSA and JECFA approve it under a group ADI for propionic-acid salts.',
    flag: 'moderate', upfMarker: true,
  },
  'sorbic acid': {
    risk: 3, category: 'preservatives', label: 'Sorbic Acid',
    note: 'A compound (naturally occurring, also made synthetically at scale) used to inhibit mold and yeast; among the least toxic of food preservatives and not linked to carcinogenicity.',
    evidence: 'FDA classifies sorbic acid as GRAS as a chemical preservative (21 CFR 182.3089); JECFA set an ADI of 0–25 mg/kg body weight. No carcinogen listing by NTP or IARC.',
    flag: 'moderate', upfMarker: true,
  },

  // ─── Processed Sweeteners & Sugar Alcohols ───
  'acesulfame potassium': {
    risk: 5, category: 'sweeteners', label: 'Acesulfame Potassium',
    note: 'A high-intensity artificial sweetener; some animal and pilot human studies suggest it may alter gut-microbiota composition, though regulators maintain it is safe within established limits.',
    evidence: 'FDA approved it as a general-purpose sweetener (2003) with an ADI of 15 mg/kg/day. WHO\'s 2023 guideline advises against non-sugar sweeteners for weight control. A 2021 J. Gastroenterology & Hepatology study reported intestinal dysbiosis in animal models.',
    flag: 'caution', upfMarker: true,
  },
  'saccharin': {
    risk: 3, category: 'sweeteners', label: 'Saccharin',
    note: 'The oldest artificial sweetener; once required to carry a US cancer-warning label, a requirement repealed after the rodent bladder-tumor mechanism was found not relevant to humans.',
    evidence: 'The US National Toxicology Program delisted saccharin from its Report on Carcinogens (2000); the SWEETEST Act (2000) removed the mandatory warning label. WHO\'s 2023 non-sugar-sweetener guideline advises against use for weight control.',
    flag: 'ok', upfMarker: true,
  },
  'erythritol': {
    risk: 6, category: 'sweeteners', label: 'Erythritol',
    note: 'A sugar alcohol marketed as a natural, gut-friendly sweetener; recent research has linked elevated blood levels to increased cardiovascular event risk, though causality is not established and the FDA continues to list it as GRAS.',
    evidence: 'Witkowski et al. (Nature Medicine, 2023) reported elevated circulating erythritol associated with increased 3-year risk of major adverse cardiovascular events and enhanced platelet reactivity; a 2024 ATVB study confirmed increased platelet activity after ingestion.',
    flag: 'caution', upfMarker: true,
  },
  'sorbitol': {
    risk: 5, category: 'sweeteners', label: 'Sorbitol',
    note: 'A sugar alcohol that is only partially absorbed; at higher intakes it reaches the colon, where it is fermented, commonly causing bloating, gas, and diarrhea.',
    evidence: 'FDA classifies sorbitol as GRAS and requires a laxative-effect warning when a serving provides ≥50 g. A 2022 review (MDPI Foods) confirmed ~80% absorption with residual colonic fermentation.',
    flag: 'caution', upfMarker: true,
  },
  'maltitol': {
    risk: 5, category: 'sweeteners', label: 'Maltitol',
    note: 'A sugar alcohol common in "sugar-free" candy and chocolate; has a notable glycemic response relative to other sugar alcohols and is prone to causing GI distress at moderate doses.',
    evidence: 'FDA lists maltitol as GRAS and requires laxative-effect labeling above 50 g/serving. Reviews report a glycemic index near 53, higher than other sugar alcohols.',
    flag: 'caution', upfMarker: true,
  },
  'xylitol': {
    risk: 4, category: 'sweeteners', label: 'Xylitol',
    note: 'A sugar alcohol with documented dental benefits; generally tolerated at low-to-moderate doses but can cause GI distress at higher intakes, and is severely toxic to dogs.',
    evidence: 'FDA classifies xylitol as GRAS; reviews report anti-cariogenic effects at 5–10 g/day and GI effects above ~50 g/day. The ASPCA lists xylitol as a known canine hepatotoxin.',
    flag: 'moderate', upfMarker: true,
  },
  'corn syrup': {
    risk: 3, category: 'sweeteners', label: 'Corn Syrup',
    note: 'A refined liquid sweetener derived from corn starch; widely used in processed foods as a sweetener and texture agent, and a reliable marker of industrial ultra-processing.',
    evidence: 'FDA affirmed GRAS status for corn syrup (1988 final rule). A 2025 FDA citizen petition (FDA-2025-P-3071) requested review of the GRAS designation of corn syrup and related refined carbohydrates, citing associations with metabolic disease.',
    flag: 'moderate', upfMarker: true,
  },
  'dextrose': {
    risk: 3, category: 'sweeteners', label: 'Dextrose',
    note: 'Glucose derived from starch hydrolysis; functionally identical to blood sugar and counted as added sugar, acting mainly as a processing aid and rapid-spike sweetener.',
    evidence: 'FDA affirmed GRAS status for dextrose (corn sugar) in its 1988 final rule. The 2025 Kessler citizen petition (FDA-2025-P-3071) named dextrose among refined carbohydrates for GRAS review.',
    flag: 'moderate', upfMarker: true,
  },
  'invert sugar': {
    risk: 3, category: 'sweeteners', label: 'Invert Sugar',
    note: 'A mixture of glucose and fructose produced by hydrolyzing sucrose; used to retain moisture and prevent crystallization in confectionery, and counted as added sugar on labels.',
    evidence: 'FDA lists invert sugar as GRAS. The 2025 Kessler citizen petition (FDA-2025-P-3071) listed it among refined sweeteners for which GRAS reconsideration was requested.',
    flag: 'moderate', upfMarker: true,
  },
  'agave syrup': {
    risk: 4, category: 'sweeteners', label: 'Agave Syrup',
    note: 'Often marketed as a natural alternative to sugar due to its low glycemic index, but unusually high in fructose (56–90%), which bypasses blood-glucose regulation and is metabolized primarily in the liver.',
    evidence: 'FDA lists agave syrup as GRAS and requires it to be labeled as an added sugar. IFIC notes blue agave syrup contains 56–60% fructose, comparable to high-fructose corn syrup.',
    flag: 'moderate', upfMarker: false,
  },

  // ─── Flavor Enhancers ───
  'disodium inosinate': {
    risk: 3, category: 'flavor-enhancers', label: 'Disodium Inosinate',
    note: 'A purine nucleotide used to amplify umami, almost always paired with glutamates; its presence reliably indicates industrial flavoring, and people managing gout are commonly advised to limit purine-rich additives.',
    evidence: 'FDA classifies disodium inosinate (E631) as GRAS; EFSA authorizes it. As a purine nucleotide, its breakdown produces uric acid, and clinical guidance advises gout/hyperuricemia patients to limit intake.',
    flag: 'ok', upfMarker: true,
  },
  'disodium guanylate': {
    risk: 3, category: 'flavor-enhancers', label: 'Disodium Guanylate',
    note: 'A purine-based flavor enhancer that works synergistically with glutamates to intensify umami; marks foods that rely on industrial flavor amplification.',
    evidence: 'FDA classifies disodium guanylate (E627) as GRAS; EFSA and JECFA authorize it. Due to its purine content, gout-management guidance notes it may raise uric acid and recommends limiting intake.',
    flag: 'ok', upfMarker: true,
  },
  'yeast extract': {
    risk: 3, category: 'flavor-enhancers', label: 'Yeast Extract',
    note: 'A common savory flavoring containing naturally occurring free glutamates at concentrations similar to MSG; a reliable marker of ultra-processed formulation.',
    evidence: 'FDA states yeast extract contains free glutamic acid and that products containing it may not be labeled "No MSG"; FDA requires it to be declared by name rather than as "natural flavor" (Federal Register, 1996).',
    flag: 'moderate', upfMarker: true,
  },
  'hydrolyzed vegetable protein': {
    risk: 4, category: 'flavor-enhancers', label: 'Hydrolyzed Vegetable Protein',
    note: 'A flavor enhancer produced by hydrolyzing plant proteins, releasing free glutamates; acid-hydrolyzed forms can contain 3-MCPD, a contaminant the FDA considers unsafe above 1 ppm.',
    evidence: 'FDA classifies HVP as GRAS for flavor use but considers acid-hydrolyzed protein containing 3-MCPD above 1 ppm unsafe; FDA requires it to be declared by common name, not as "natural flavor" (Federal Register, 1996).',
    flag: 'moderate', upfMarker: true,
  },

  // ─── Refined Oils & Industrial Fats ───
  // Per design: refined seed oils are flagged as MARKERS OF ULTRA-PROCESSING,
  // not as toxic. Only artificial trans fat (PHO) carries a high risk score.
  'soybean oil': {
    risk: 3, category: 'oils', label: 'Soybean Oil',
    note: 'Industrially refined oil; a near-universal ingredient in ultra-processed foods.',
    evidence: 'The NOVA classification (Monteiro et al., Public Health Nutrition, 2019) lists refined vegetable oils as Group 4 (ultra-processed) markers, reflecting their solvent-extraction and multi-step refining.',
    flag: 'moderate', upfMarker: true,
  },
  'canola oil': {
    risk: 3, category: 'oils', label: 'Canola Oil',
    note: 'Industrially refined oil; a near-universal ingredient in ultra-processed foods.',
    evidence: 'Canola/rapeseed refining involves hexane solvent extraction, degumming, neutralization, bleaching, and deodorization — a multi-step industrial process; NOVA lists refined vegetable oils as ultra-processed markers (Monteiro et al., 2019).',
    flag: 'moderate', upfMarker: true,
  },
  'corn oil': {
    risk: 3, category: 'oils', label: 'Corn Oil',
    note: 'Industrially refined oil; a near-universal ingredient in ultra-processed foods.',
    evidence: 'The NOVA classification (Monteiro et al., Public Health Nutrition, 2019) lists refined vegetable oils as Group 4 ultra-processed markers.',
    flag: 'moderate', upfMarker: true,
  },
  'cottonseed oil': {
    risk: 4, category: 'oils', label: 'Cottonseed Oil',
    note: 'Industrially refined oil common in snack foods; cotton is not a food crop, so its pesticide tolerances differ from those of edible oilseeds.',
    evidence: 'FDA considers refined cottonseed oil GRAS (21 CFR 184.1222); cotton is regulated by the EPA under pesticide rules distinct from food crops. NOVA lists refined vegetable oils as ultra-processed markers (Monteiro et al., 2019).',
    flag: 'moderate', upfMarker: true,
  },
  'sunflower oil': {
    risk: 3, category: 'oils', label: 'Sunflower Oil',
    note: 'Industrially refined oil; a near-universal ingredient in ultra-processed foods.',
    evidence: 'The NOVA classification (Monteiro et al., Public Health Nutrition, 2019) lists refined vegetable oils as Group 4 ultra-processed markers.',
    flag: 'moderate', upfMarker: true,
  },
  'safflower oil': {
    risk: 3, category: 'oils', label: 'Safflower Oil',
    note: 'Industrially refined oil; a near-universal ingredient in ultra-processed foods.',
    evidence: 'The NOVA classification (Monteiro et al., Public Health Nutrition, 2019) lists refined vegetable oils as Group 4 ultra-processed markers.',
    flag: 'moderate', upfMarker: true,
  },
  'vegetable oil': {
    risk: 3, category: 'oils', label: 'Vegetable Oil',
    note: "The label does not say which oil this is. Companies use the generic name so they can swap in whatever oil is cheapest that week. Refined oils in this family are high in omega-6 fats, and diets heavy in them have been linked to inflammation in published research.",
    evidence: 'FDA labeling rules (21 CFR 101.4) permit "vegetable oil" as a collective name for refined plant oils; NOVA lists refined vegetable oils as ultra-processed markers (Monteiro et al., 2019).',
    flag: 'moderate', upfMarker: true,
  },
  'palm oil': {
    risk: 4, category: 'oils', label: 'Palm Oil',
    note: 'Widely used in packaged foods; refining involves bleaching and deodorization, and production is a leading driver of tropical deforestation.',
    evidence: 'Palm oil refining produces 3-MCPD and glycidyl fatty-acid esters, which EFSA flagged as a concern (EFSA Journal 2016;14(5):4426); IARC working-group review (2016) identified palm-oil expansion as a deforestation driver.',
    flag: 'moderate', upfMarker: true,
  },
  'partially hydrogenated oil': {
    risk: 10, category: 'oils', label: 'Partially Hydrogenated Oil',
    note: 'The primary source of artificial trans fat; the FDA revoked its GRAS status and banned its addition to food.',
    evidence: 'FDA\'s final determination (Federal Register, June 2015) found partially hydrogenated oils are not GRAS; manufacture was prohibited from June 2018, with full compliance by January 2021, and uses were formally revoked (Federal Register, August 2023).',
    flag: 'avoid', upfMarker: true,
  },
  'interesterified fat': {
    risk: 4, category: 'oils', label: 'Interesterified Fat',
    note: 'An industrially rearranged fat used as a trans-fat replacement; evidence on long-term health effects is limited and mixed.',
    evidence: 'A 2025 randomized controlled trial (American Journal of Clinical Nutrition) found palmitic-acid-rich interesterified fats at 10% energy for 6 weeks did not adversely affect the total:HDL cholesterol ratio vs. stearic-acid-rich fats; longer-term cardiometabolic effects remain under-studied.',
    flag: 'moderate', upfMarker: true,
  },
  'fully hydrogenated oil': {
    risk: 3, category: 'oils', label: 'Fully Hydrogenated Oil',
    note: 'Distinct from partially hydrogenated oil — hydrogenation goes to completion, leaving no trans fat; used as a texturizer and stabilizer in processed foods.',
    evidence: 'FDA retains authorization for fully hydrogenated oils (e.g. 21 CFR 184.1555) and its trans-fat guidance states they do not contain artificial trans fat, distinguishing them from the banned partially hydrogenated form.',
    flag: 'moderate', upfMarker: true,
  },

  // ─── Protein Isolates & Concentrates ───
  'soy protein isolate': {
    risk: 4, category: 'proteins', label: 'Soy Protein Isolate',
    note: 'A highly processed protein fraction; a defining marker of ultra-processed foods in the NOVA classification.',
    evidence: 'The NOVA classification (Monteiro et al., Public Health Nutrition, 2019) explicitly lists "soya protein isolate" as a Group 4 ultra-processed marker; manufacturing typically involves hexane solvent extraction of defatted soy flour.',
    flag: 'moderate', upfMarker: true,
  },
  'whey protein isolate': {
    risk: 3, category: 'proteins', label: 'Whey Protein Isolate',
    note: 'A highly processed protein fraction derived from dairy; a marker of ultra-processed formulation rather than a whole-food ingredient.',
    evidence: 'The NOVA classification (Monteiro et al., 2019) lists whey protein among Group 4 ultra-processed markers; production involves industrial micro/ultrafiltration and spray-drying to ≥90% protein purity.',
    flag: 'moderate', upfMarker: true,
  },
  'pea protein isolate': {
    risk: 3, category: 'proteins', label: 'Pea Protein Isolate',
    note: 'A highly processed protein fraction; a marker of ultra-processed formulation rather than a whole-food ingredient.',
    evidence: 'The NOVA classification (Monteiro et al., 2019) lists protein isolates as Group 4 ultra-processed markers; pea protein isolate production involves alkaline extraction, isoelectric precipitation, and spray-drying.',
    flag: 'moderate', upfMarker: true,
  },
  'soy protein concentrate': {
    risk: 4, category: 'proteins', label: 'Soy Protein Concentrate',
    note: 'A heavily processed soy fraction; less refined than isolate but still a marker of ultra-processed food formulation.',
    evidence: 'The NOVA classification (Monteiro et al., 2019) lists protein concentrates as Group 4 ultra-processed markers; FDA\'s GRAS inventory includes soy protein concentrate used in processed meat and snack products.',
    flag: 'moderate', upfMarker: true,
  },
  'milk protein concentrate': {
    risk: 3, category: 'proteins', label: 'Milk Protein Concentrate',
    note: 'An industrially filtered dairy protein fraction; a marker of ultra-processed food formulation.',
    evidence: 'The NOVA classification (Monteiro et al., 2019) lists protein concentrates as Group 4 ultra-processed markers; milk protein concentrate is made via ultrafiltration/diafiltration and spray-drying (USDA AMS technical report, 2004).',
    flag: 'moderate', upfMarker: true,
  },

  // ─── Colorants & Whiteners ───
  'titanium dioxide': {
    risk: 6, category: 'dyes', label: 'Titanium Dioxide',
    note: 'A synthetic whitener still permitted in US foods; banned as a food additive in the EU since 2022 following a safety reassessment.',
    evidence: 'EFSA concluded (May 2021) that titanium dioxide (E171) "can no longer be considered safe when used as a food additive," citing inability to rule out genotoxicity; the EU banned it via Regulation (EU) 2022/63 (Aug 2022). FDA still permits it at ≤1% by weight (21 CFR 73.575).',
    flag: 'caution', upfMarker: true,
  },
  'green 3': {
    risk: 4, category: 'dyes', label: 'Green 3 (Fast Green FCF)',
    note: 'A synthetic dye approved in the US but banned for food use in the EU; FDA and HHS included it in the April 2025 voluntary industry phase-out plan.',
    evidence: 'WHO/JECFA (2017) found Fast Green FCF low-toxicity at established ADI levels; FDA/HHS announced (April 2025) it is targeted for voluntary elimination from the US food supply by end of 2027.',
    flag: 'moderate', upfMarker: true,
  },
  'blue 2': {
    risk: 5, category: 'dyes', label: 'Blue 2 (Indigotine)',
    note: 'A synthetic dye included in the FDA/HHS April 2025 voluntary phase-out plan; some studies associate synthetic dyes as a class with neurobehavioral effects in children.',
    evidence: 'California OEHHA\'s 2021 review concluded the seven most widely used synthetic dyes — including Blue 2 — can cause or exacerbate neurobehavioral problems in some children; FDA/HHS announced (April 2025) it is targeted for voluntary elimination by end of 2027.',
    flag: 'caution', upfMarker: true,
  },
  'citrus red 2': {
    risk: 7, category: 'dyes', label: 'Citrus Red No. 2',
    note: 'Applied only to the skin of some Florida oranges; classified as a possible human carcinogen and under active FDA revocation proceedings.',
    evidence: 'IARC classified Citrus Red 2 as Group 2B (possibly carcinogenic to humans). FDA/HHS announced (April 2025) it is initiating rulemaking to revoke authorization under 21 CFR 74.302.',
    flag: 'avoid', upfMarker: true,
  },
};

export const FLAG_LEVELS = {
  avoid: { color: '#D93B3B', bg: '#FDE8E8', label: 'Avoid', priority: 4 },
  caution: { color: '#F06A25', bg: '#FEF0E6', label: 'Caution', priority: 3 },
  moderate: { color: '#F5C842', bg: '#FEF9E7', label: 'Moderate', priority: 2 },
  allergen: { color: '#9B59B6', bg: '#F5EEF8', label: 'Allergen', priority: 3 },
  ok: { color: '#1D9E75', bg: '#E8F7F2', label: 'OK', priority: 1 },
};
