export const INGREDIENT_DB = {
  // ─── Sweeteners ───
  'high fructose corn syrup': {
    risk: 9, category: 'sweeteners',
    label: 'High Fructose Corn Syrup',
    note: 'Highly processed sweetener; many nutritionists and health databases recommend limiting intake.',
    flag: 'avoid',
  },
  'aspartame': {
    risk: 7, category: 'sweeteners',
    label: 'Aspartame',
    note: 'Controversial artificial sweetener; some animal studies at very high doses raised questions — mainstream regulatory bodies consider it safe at typical consumption levels.',
    flag: 'caution',
  },
  'sucralose': {
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
    risk: 4, category: 'sweeteners',
    label: 'Cane Sugar',
    note: 'Natural sugar; moderate consumption is fine.',
    flag: 'moderate',
  },
  'sugar': {
    risk: 4, category: 'sweeteners',
    label: 'Sugar',
    note: 'Natural sugar; excessive consumption linked to metabolic issues.',
    flag: 'moderate',
  },

  // ─── Preservatives ───
  'sodium benzoate': {
    risk: 8, category: 'preservatives',
    label: 'Sodium Benzoate',
    note: 'May react with vitamin C under certain conditions; the FDA and several health databases recommend minimizing intake.',
    flag: 'avoid',
  },
  'bha': {
    risk: 7, category: 'preservatives',
    label: 'BHA (Butylated Hydroxyanisole)',
    note: 'Listed on California Prop 65; classified by the National Toxicology Program as reasonably anticipated to be a human carcinogen based on animal studies.',
    flag: 'avoid',
  },
  'bht': {
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
    risk: 8, category: 'dyes',
    label: 'Red 40 (Allura Red)',
    note: 'Subject to EU mandatory warning labeling; some studies associate it with hyperactivity in sensitive children.',
    flag: 'avoid',
  },
  'yellow 5': {
    risk: 7, category: 'dyes',
    label: 'Yellow 5 (Tartrazine)',
    note: 'Subject to EU warning labeling; some studies associate it with hyperactivity in sensitive individuals. Potential allergen for some.',
    flag: 'avoid',
  },
  'yellow 6': {
    risk: 7, category: 'dyes',
    label: 'Yellow 6 (Sunset Yellow)',
    note: 'Subject to EU warning labeling; some studies associate it with hyperactivity in sensitive individuals.',
    flag: 'avoid',
  },
  'caramel color': {
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
    risk: 6, category: 'flavor-enhancers',
    label: 'MSG (Monosodium Glutamate)',
    note: 'Causes sensitivity reactions in some individuals.',
    flag: 'caution',
  },
  'msg': {
    risk: 6, category: 'flavor-enhancers',
    label: 'MSG',
    note: 'Causes sensitivity reactions in some individuals.',
    flag: 'caution',
  },
  'natural flavors': {
    risk: 3, category: 'flavor-enhancers',
    label: 'Natural Flavors',
    note: 'Vague term — can include hundreds of chemicals derived from natural sources.',
    flag: 'moderate',
  },
  'artificial flavors': {
    risk: 5, category: 'flavor-enhancers',
    label: 'Artificial Flavors',
    note: 'Synthetic chemicals; limited long-term safety data.',
    flag: 'caution',
  },

  // ─── Emulsifiers & Stabilizers ───
  'carrageenan': {
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
    risk: 4, category: 'flavor-enhancers',
    label: 'Natural Flavor',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'natural flavors': {
    risk: 4, category: 'flavor-enhancers',
    label: 'Natural Flavors',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'artificial flavor': {
    risk: 5, category: 'flavor-enhancers',
    label: 'Artificial Flavor',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'artificial flavors': {
    risk: 5, category: 'flavor-enhancers',
    label: 'Artificial Flavors',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'natural and artificial flavor': {
    risk: 5, category: 'flavor-enhancers',
    label: 'Natural & Artificial Flavor',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'natural and artificial flavors': {
    risk: 5, category: 'flavor-enhancers',
    label: 'Natural & Artificial Flavors',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'natural & artificial flavors': {
    risk: 5, category: 'flavor-enhancers',
    label: 'Natural & Artificial Flavors',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'artificial flavoring': {
    risk: 5, category: 'flavor-enhancers',
    label: 'Artificial Flavoring',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
  'natural flavoring': {
    risk: 4, category: 'flavor-enhancers',
    label: 'Natural Flavoring',
    note: 'Umbrella term covering up to 100 undisclosed chemicals. Manufacturers aren\'t required to disclose individual compounds.',
    flag: 'caution',
  },
};

export const FLAG_LEVELS = {
  avoid: { color: '#D93B3B', bg: '#FDE8E8', label: 'Avoid', priority: 4 },
  caution: { color: '#F06A25', bg: '#FEF0E6', label: 'Caution', priority: 3 },
  moderate: { color: '#F5C842', bg: '#FEF9E7', label: 'Moderate', priority: 2 },
  allergen: { color: '#9B59B6', bg: '#F5EEF8', label: 'Allergen', priority: 3 },
  ok: { color: '#1D9E75', bg: '#E8F7F2', label: 'OK', priority: 1 },
};
