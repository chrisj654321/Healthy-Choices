  'tea powder': { risk: IngredientRisk.Low, category: 'beverages', explanation: 'Powdered tea leaves or tea extract used for flavor or beverage preparation. Tea is low concern at normal food-use levels, though caffeine varies by type.' },
  'natural and artificial flavors milk': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Parser fragment for natural and artificial flavors with milk indicated as a source or allergen. The flavor blend is proprietary under 21 CFR 101.22, and milk adds allergen relevance, so it remains medium.' },
  'organic egg': { risk: IngredientRisk.Low, category: 'eggs', explanation: 'USDA Organic egg ingredient. Egg is a major allergen, but it is otherwise a standard low-risk protein ingredient.' },
  'juices': { risk: IngredientRisk.Medium, category: 'beverages', explanation: 'Generic plural form for fruit or vegetable juices. Juice can provide flavor and micronutrients, but it lacks whole-fruit fiber and can deliver concentrated sugars, so the class risk is moderate.' },
  'with bha': { risk: IngredientRisk.High, category: 'preservatives', explanation: 'Parser fragment indicating the synthetic antioxidant preservative BHA. The cache treats BHA as high concern because of toxicology and regulatory caution around this preservative.' },
  'dried milk powder': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Dehydrated milk powder used in baking and prepared foods. It is a dairy allergen but otherwise a standard low-risk dairy ingredient.' },
  'and b7': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Parser fragment indicating added vitamin B7, or biotin. Biotin is an essential water-soluble vitamin and low risk at typical food fortification levels.' },
  'catfish': { risk: IngredientRisk.Low, category: 'seafood', explanation: 'Mild white fish used as a seafood protein. Catfish is a fish allergen but otherwise low concern when properly sourced and cooked.' },
  'flounder': { risk: IngredientRisk.Low, category: 'seafood', explanation: 'Lean flatfish used as a seafood protein. Flounder is a fish allergen but otherwise low concern and generally lower in mercury than large predatory fish.' },
  'red color': { risk: IngredientRisk.Medium, category: 'dyes', explanation: 'Class phrase for an unspecified red color additive. Because the exact colorant is not disclosed, this follows the moderate risk for unspecified added colors.' },
  'vitamin mineral blend': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Blend of vitamins and minerals used for fortification. These nutrients are regulated and low concern at typical food fortification levels.' },
  'and artificial color': { risk: IngredientRisk.High, category: 'dyes', explanation: 'Parser fragment indicating an artificial color additive. Synthetic food dyes are treated as high concern in the cache because several are linked to behavioral concerns in sensitive children.' },
  'flatbread': { risk: IngredientRisk.Medium, category: 'grains', explanation: 'Bread component usually made from wheat or other grain flour, water, and salt. Commercial flatbread is often a refined-grain product, so the concern is moderate.' },
  'with water': { risk: IngredientRisk.Low, category: 'additives', explanation: 'Parser fragment indicating water was added. Water is a basic food ingredient with no ingredient-level safety concern.' },
  'cow milk': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Milk from cows used as a dairy ingredient. Milk is a major allergen but otherwise a standard low-risk dairy ingredient in the cache.' },
  'non-hydrogenated': { risk: IngredientRisk.Medium, category: 'fats', explanation: 'Fat-processing descriptor meaning the oil or fat was not hydrogenated. Avoiding hydrogenation is favorable, but the underlying fat source is not disclosed, so the class stays moderate.' },
  'pico de gallo': { risk: IngredientRisk.Low, category: 'condiments', explanation: 'Fresh salsa-style condiment made from tomato, onion, chile, cilantro, and lime. It is a low-risk vegetable-based condiment, with sodium depending on the recipe.' },
  'mirepoix': { risk: IngredientRisk.Low, category: 'vegetables', explanation: 'Aromatic vegetable blend, usually onion, carrot, and celery. It is a low-risk vegetable ingredient base.' },
  'elemental iron': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Iron powder used for food enrichment and fortification. Iron is an essential mineral and low concern at regulated fortification levels.' },
  'a b-vitamin': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Label fragment denoting one of the B vitamins. B vitamins are essential water-soluble nutrients and low risk at typical food fortification levels.' },
  'rennetless': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Cheese-production descriptor meaning animal rennet was not used. It does not identify a risky ingredient by itself and usually denotes a dairy product attribute.' },
  'protein blend milk protein concentrate': { risk: IngredientRisk.Medium, category: 'dairy', explanation: 'Protein blend fragment specifically identifying milk protein concentrate. Concentrated dairy protein is processed and contains milk allergen, so it follows the medium risk used for milk protein concentrate.' },
  'less than 2 soy protein concentrate': { risk: IngredientRisk.Medium, category: 'proteins', explanation: 'Quantity fragment for soy protein concentrate at less than 2 percent. Concentrated soy protein is processed and soy-derived, so it follows the medium protein risk in the cache.' },
  'l-methionine': { risk: IngredientRisk.Low, category: 'amino acids', explanation: 'Essential sulfur-containing amino acid used in nutrition fortification or protein balancing. It is low concern at typical food-use levels.' },
  'natural and artificial flavour': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'British spelling for natural and artificial flavor. These flavoring substances are regulated under 21 CFR 101.22, but proprietary composition keeps the concern moderate.' },
  'artificial colors red 3': { risk: IngredientRisk.High, category: 'dyes', explanation: 'Synthetic color declaration specifically identifying FD&C Red No. 3. FDA revoked authorization for Red No. 3 in food in 2025, so this follows the high dye risk.' },
  'organic mct oil': { risk: IngredientRisk.Low, category: 'fats', explanation: 'Organic medium-chain triglyceride oil, usually derived from coconut or palm kernel oil. MCT oil is low concern at typical food-use levels, though it is calorie-dense.' },
  'less than 2 of natural and artificial flavor': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Quantity fragment for natural and artificial flavor at less than 2 percent. Flavoring substances are regulated under 21 CFR 101.22, but proprietary composition keeps the concern moderate.' },
  'red no40': { risk: IngredientRisk.High, category: 'dyes', explanation: 'Condensed label form for FD&C Red No. 40. It is FDA-approved, but the app flags Red 40 high because synthetic dye mixtures have been linked to behavioral concerns in sensitive children.' },
  'frozen': { risk: IngredientRisk.Low, category: 'additives', explanation: 'Preparation descriptor indicating the food was frozen. Freezing is a standard preservation method and does not identify a higher-risk additive by itself.' },
  'n-acetyl-l-tyrosine': { risk: IngredientRisk.Low, category: 'amino acids', explanation: 'Acetylated form of the amino acid L-tyrosine used in functional foods and supplements. It is low concern at typical use levels.' },
  'pea proteins': { risk: IngredientRisk.Low, category: 'proteins', explanation: 'Plural label form for pea protein ingredients. Pea protein is a common dairy-free plant protein and low concern in the cache.' },
  'natural flavor salt': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Parser fragment combining natural flavor with salt. Salt is low concern, but the proprietary natural flavor component keeps the overall phrase at medium risk.' },
  'jalapeos': { risk: IngredientRisk.Low, category: 'vegetables', explanation: 'Parser form for jalapenos, a Capsicum pepper ingredient. Jalapenos are low-risk vegetables or spices at culinary amounts.' },
  'creme fraiche': { risk: IngredientRisk.Medium, category: 'dairy', explanation: 'Cultured cream used as a dairy ingredient. It is a dairy allergen and high in saturated fat, so the concern is moderate.' },
  'cone': { risk: IngredientRisk.Medium, category: 'grains', explanation: 'Parser fragment usually denoting an ice cream cone or wafer cone. Commercial cones are refined-grain confectionery components, so the concern is moderate.' },
  'non-animal': { risk: IngredientRisk.Low, category: 'dairy-alternatives', explanation: 'Source descriptor indicating an ingredient is not animal-derived. It does not identify a risky ingredient by itself, so the phrase is low concern.' },
  'lion s mane': { risk: IngredientRisk.Low, category: 'botanicals', explanation: 'Parser form for lions mane mushroom, an edible Hericium erinaceus mushroom used in foods and supplements. It is low concern at typical food-use levels.' },
  'milk vitamin d3': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Parser fragment denoting milk fortified with vitamin D3. Milk is a major allergen, but it is otherwise a standard low-risk dairy ingredient at food-use levels.' },
  'unrefined sea salt': { risk: IngredientRisk.Low, category: 'preservatives', explanation: 'Minimally processed sea salt retaining trace minerals. It is still sodium chloride, so total sodium intake is the relevant consideration.' },
  'd-sorbitol': { risk: IngredientRisk.Medium, category: 'sugar-alcohols', explanation: 'D form of sorbitol, a sugar alcohol sweetener and humectant. Sorbitol is FDA GRAS, but it can cause bloating or laxative effects at higher intakes, so the cache treats it as medium.' },
  'whole dry milk': { risk: IngredientRisk.Medium, category: 'dairy', explanation: 'Powdered whole cow milk. It provides dairy protein and calcium, but the whole-milk fat profile keeps it at medium concern.' },
  'sea salt organic': { risk: IngredientRisk.Low, category: 'preservatives', explanation: 'Sea salt with organic marketing or sourcing language. Salt itself is sodium chloride, so total sodium intake is the relevant consideration.' },
  'bacteria': { risk: IngredientRisk.Low, category: 'probiotics', explanation: 'Generic class term for bacterial cultures used in fermented foods. Food cultures such as lactic-acid bacteria have long food-use history and are low concern in properly made foods.' },
  'pasturized milk': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Misspelled label form for pasteurized milk. Milk is a major allergen but otherwise a standard low-risk dairy ingredient in the cache.' },
  'b-carotene': { risk: IngredientRisk.Low, category: 'dyes', explanation: 'Short label form for beta-carotene, a yellow-orange carotenoid used as a color or vitamin A source. It is a permitted color additive and low concern at food-use levels.' },
  '2 or less of sea salt': { risk: IngredientRisk.Low, category: 'preservatives', explanation: 'Quantity fragment for sea salt at 2 percent or less. Sea salt is still sodium chloride, so total sodium intake is the relevant consideration.' },
  'less than 15 of salt': { risk: IngredientRisk.Low, category: 'preservatives', explanation: 'Quantity fragment denoting salt below a stated percentage. Sodium chloride is a common seasoning and preservative; the main consideration is total sodium intake.' },
  'camauba wax': { risk: IngredientRisk.Low, category: 'additives', explanation: 'Likely OCR form of carnauba wax, a plant wax used as a coating or glaze. Food-grade carnauba wax is low concern at typical coating levels.' },
  'transglutaminase': { risk: IngredientRisk.Medium, category: 'additives', explanation: 'Enzyme used to bind proteins in meat, seafood, and dairy processing, sometimes called meat glue. It is used at low levels, but the processing function and transparency concerns keep it at medium.' },
  'with other natural flavors': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Parser fragment denoting additional natural flavors. Natural flavors are regulated under 21 CFR 101.22, but proprietary composition keeps the concern moderate.' },
  'cobalamin': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Vitamin B12 compound used for fortification. It is an essential water-soluble vitamin and low risk at typical food fortification levels.' },
  'lbulgaricus': { risk: IngredientRisk.Low, category: 'probiotics', explanation: 'Condensed label form for Lactobacillus bulgaricus, a lactic-acid bacterium used in yogurt and cultured dairy. It has long food-use history and is low risk for the general population.' },
  'modified foodstarch': { risk: IngredientRisk.Medium, category: 'additives', explanation: 'Single-word label form for modified food starch. It is FDA-permitted but processed, so it follows the medium additive risk in the cache.' },
  'containing up to 10 solution of water': { risk: IngredientRisk.Low, category: 'additives', explanation: 'Processing phrase denoting added water solution, usually for moisture retention. Water itself is low concern, though the complete solution would need the named additives to score more specifically.' },
  'thiaminemononitrate': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Condensed label form for thiamine mononitrate, a vitamin B1 fortification form. It is an essential water-soluble vitamin and low risk at typical food fortification levels.' },
  'vitamins & minerals': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Class phrase for added vitamin and mineral fortification. These nutrients are low concern at typical regulated food levels.' },
  'serrano': { risk: IngredientRisk.Low, category: 'vegetables', explanation: 'Serrano pepper, a Capsicum vegetable used for heat and flavor. It is low concern at culinary amounts.' },
  '2 or less of water': { risk: IngredientRisk.Low, category: 'additives', explanation: 'Quantity fragment indicating water at 2 percent or less. Water is a basic food ingredient with no ingredient-level safety concern.' },
  'jalapeo': { risk: IngredientRisk.Low, category: 'vegetables', explanation: 'Parser form for jalapeno, a Capsicum pepper ingredient. Jalapeno is low concern at culinary amounts.' },
  'acesulfame-k': { risk: IngredientRisk.Medium, category: 'sweeteners', explanation: 'Abbreviation for acesulfame potassium, a high-intensity artificial sweetener. FDA approves it with an ADI, but the cache treats nonnutritive sweeteners in this family as medium concern.' },
  'unenriched': { risk: IngredientRisk.Medium, category: 'grains', explanation: 'Grain descriptor meaning enrichment nutrients were not added back after refining. It usually denotes refined flour without fortification, so the concern is moderate.' },
  'e471': { risk: IngredientRisk.Medium, category: 'emulsifiers', explanation: 'E-number for mono- and diglycerides of fatty acids used as emulsifiers. This processed emulsifier family is treated as medium concern in the cache.' },
  'vitamine': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'French or typo form for vitamin. Vitamins are regulated nutrients and low concern at typical fortification levels.' },
  'less than 2 natural and artificial flavor': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Quantity fragment for natural and artificial flavor at less than 2 percent. Flavoring substances are regulated under 21 CFR 101.22, but proprietary composition keeps the concern moderate.' },
  'vitamin b-2': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Vitamin B2, also known as riboflavin. It is an essential water-soluble vitamin and low risk at typical fortification levels.' },
  'pie shell': { risk: IngredientRisk.Medium, category: 'grains', explanation: 'Prepared pie crust component usually made from refined flour and fat. It is a processed bakery ingredient, so the concern is moderate.' },
  'e330': { risk: IngredientRisk.Low, category: 'additives', explanation: 'E-number for citric acid, a common acidulant and preservative. Citric acid is FDA GRAS and low concern at food-use levels.' },
  'oils': { risk: IngredientRisk.Medium, category: 'fats', explanation: 'Generic plural label form for added edible oils. Because the source and refinement level are unspecified, this follows the medium risk used for generic vegetable oils.' },
  'sheanut': { risk: IngredientRisk.Medium, category: 'nuts', explanation: 'Shea nut or shea-derived ingredient, usually a fat source such as shea butter. It is a tree-nut-like botanical fat and remains moderate when the exact refined ingredient is not disclosed.' },
  'non fat milk powder': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Nonfat dry milk powder used in baking and prepared foods. It is a dairy allergen but retains milk protein and minerals without the saturated fat of whole milk powder.' },
  'cognac': { risk: IngredientRisk.Medium, category: 'beverages', explanation: 'Distilled grape brandy used as a flavor ingredient or drink. Ethanol is the relevant concern, so it is moderate even when used in small culinary amounts.' },
  'and water': { risk: IngredientRisk.Low, category: 'additives', explanation: 'Parser fragment indicating water was added. Water is a basic food ingredient with no ingredient-level safety concern.' },
  'wrapper water': { risk: IngredientRisk.Low, category: 'additives', explanation: 'Parser fragment where wrapper appears to be packaging noise but water is the only food substance. Water is a basic ingredient with no ingredient-level safety concern.' },
  'hpmc': { risk: IngredientRisk.Low, category: 'emulsifiers', explanation: 'Abbreviation for hydroxypropyl methylcellulose, a cellulose-derived thickener and film former. It is a common food additive and low concern at typical food-use levels.' },
  'organic milk powder': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Organic dried milk powder. It is a dairy allergen but otherwise a standard low-risk dairy ingredient.' },
  'milk sugar': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Common name for lactose, the natural sugar in milk. It is low concern except for people with lactose intolerance.' },
  'candy sugar': { risk: IngredientRisk.Medium, category: 'sweeteners', explanation: 'Sugar used in candy or confectionery. It is added sugar and follows the medium sweetener risk in the cache.' },
  'and natural flavoring': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Parser fragment denoting natural flavoring. Natural flavoring is regulated under 21 CFR 101.22, but proprietary composition keeps the concern moderate.' },
  'protein concentrate': { risk: IngredientRisk.Medium, category: 'proteins', explanation: 'Generic concentrated protein ingredient. Protein concentration is a processed format separated from the whole food matrix, so the concern is moderate unless the source is specifically low risk.' },
  'artificial': { risk: IngredientRisk.Medium, category: 'additives', explanation: 'Generic descriptor indicating an artificial ingredient or component. Because the exact ingredient is not named, this stays a moderate additive-class concern.' },
  'nigari': { risk: IngredientRisk.Low, category: 'additives', explanation: 'Mineral-rich magnesium chloride coagulant used in tofu making. It is a traditional food-processing aid and low concern at typical use levels.' },
  'wheatflour': { risk: IngredientRisk.Medium, category: 'grains', explanation: 'Single-word label form for wheat flour. Refined wheat flour is medium concern because bran and germ are removed, reducing fiber and nutrients.' },
  'artificial flavoring and salt': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Parser fragment combining artificial flavoring with salt. Salt is low concern, but proprietary artificial flavoring keeps the overall phrase at medium risk.' },
  'cornflour': { risk: IngredientRisk.Low, category: 'grains', explanation: 'Single-word label form for corn flour. Corn flour is a common gluten-free grain ingredient and low concern when not chemically modified.' },
  'hydrolized soy protein': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Misspelled label form for hydrolyzed soy protein, an umami flavor enhancer. It is soy-derived and heavily processed, so the concern is medium.' },
  'milk and vitamin d3': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Milk fortified with vitamin D3. Milk is a major allergen, but it is otherwise a standard low-risk dairy ingredient at food-use levels.' },
  'crabstick': { risk: IngredientRisk.Medium, category: 'seafood', explanation: 'Imitation crab stick usually made from surimi fish paste plus starch, sugar, sodium, and additives. The processed seafood format keeps the concern moderate.' },
  'natural flavored oil': { risk: IngredientRisk.Medium, category: 'fats', explanation: 'Oil carrying natural flavoring compounds. The oil source is unspecified and natural flavoring is proprietary, so the phrase stays medium.' },
  'vit b9': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Abbreviated label form for vitamin B9, or folate. It is an essential B vitamin and low risk at typical food fortification levels.' },
  'cow': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Animal-source descriptor usually denoting cow milk or cow dairy. Milk is a major allergen but otherwise low risk as a basic dairy ingredient.' },
  'carbonation': { risk: IngredientRisk.Low, category: 'beverages', explanation: 'Dissolved carbon dioxide used to carbonate beverages. Carbonation is low concern at typical beverage levels.' },
  'folicacid': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Single-word label form for folic acid, a vitamin B9 fortification form. It is low concern at regulated food fortification levels.' },
  'vitamin and mineral blend salt': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Parser fragment combining a vitamin-mineral blend with salt. The fortification blend is low concern, and salt is also low risk in the cache at normal food-use levels.' },
  'anthocyanins': { risk: IngredientRisk.Low, category: 'dyes', explanation: 'Plant polyphenol pigments used as natural red, purple, or blue colorants. Anthocyanin colors are low concern at food-use levels.' },
  'citricacid': { risk: IngredientRisk.Low, category: 'additives', explanation: 'Single-word label form for citric acid. Citric acid is FDA GRAS and low concern as an acidulant or preservative at food-use levels.' },
  'hard boiled egg': { risk: IngredientRisk.Low, category: 'eggs', explanation: 'Cooked whole egg ingredient. Egg is a major allergen but otherwise a standard low-risk protein food.' },
  'mono-glycerides': { risk: IngredientRisk.Medium, category: 'emulsifiers', explanation: 'Hyphenated label form for monoglycerides, part of the mono- and diglycerides emulsifier family. This processed emulsifier family is treated as medium concern in the cache.' },
  'made of sugar': { risk: IngredientRisk.Medium, category: 'sweeteners', explanation: 'Phrase denoting sugar as the substance. Added sugar follows the medium sweetener risk in the cache.' },
  'less than 1 -corn syrup': { risk: IngredientRisk.High, category: 'sweeteners', explanation: 'Quantity fragment for corn syrup at less than 1 percent. Corn syrup is a refined added sweetener, and the existing cache treats it as high concern for excess sugar exposure.' },
  'l-threonine': { risk: IngredientRisk.Low, category: 'amino acids', explanation: 'Essential amino acid used for protein balancing or fortification. It is low concern at typical food-use levels.' },
  'l-histidine': { risk: IngredientRisk.Low, category: 'amino acids', explanation: 'Essential amino acid used for protein balancing or fortification. It is low concern at typical food-use levels.' },
  'leucine': { risk: IngredientRisk.Low, category: 'amino acids', explanation: 'Essential branched-chain amino acid used in protein and sports-nutrition formulations. It is low concern at typical food-use levels.' },
  'monodiglycerides': { risk: IngredientRisk.Medium, category: 'emulsifiers', explanation: 'Compressed label form for mono- and diglycerides, a common emulsifier family. This processed emulsifier family is treated as medium concern in the cache.' },
  'lcasei': { risk: IngredientRisk.Low, category: 'probiotics', explanation: 'Condensed label form for Lactobacillus casei, a lactic-acid bacterium used in cultured dairy and probiotic foods. It has long food-use history and is low risk for the general population.' },
  'salt sea salt': { risk: IngredientRisk.Low, category: 'preservatives', explanation: 'Parser fragment denoting salt and sea salt. Both are sodium chloride sources, so total sodium intake is the relevant consideration.' },
  'sea salts': { risk: IngredientRisk.Low, category: 'preservatives', explanation: 'Plural form for sea salt. Sea salt is still sodium chloride, so total sodium intake is the relevant consideration.' },
  'salt and natural flavors': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Parser fragment combining salt with natural flavors. Salt is low concern, but proprietary natural flavors keep the overall phrase at medium risk.' },
  'salt and artificial flavor': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Parser fragment combining salt with artificial flavor. Salt is low concern, but proprietary artificial flavor keeps the overall phrase at medium risk.' },
  'milk traces': { risk: IngredientRisk.Low, category: 'dairy', explanation: 'Allergen trace statement indicating possible milk presence. Milk is a major allergen but otherwise a standard low-risk dairy ingredient.' },
  'vitamin and mineral premix': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Premixed vitamins and minerals used for fortification. These nutrients are low concern at typical regulated food levels.' },
  'reduce iron': { risk: IngredientRisk.Low, category: 'vitamins', explanation: 'Likely parser form for reduced iron, an elemental iron fortification ingredient. Iron is an essential mineral and low concern at regulated fortification levels.' },
  'casing': { risk: IngredientRisk.Medium, category: 'meats', explanation: 'Sausage or meat-product casing, which may be natural collagen, animal intestine, or cellulose. Because the source is not disclosed and it is tied to processed meat formats, the class risk is moderate.' },
  'salt natural flavor': { risk: IngredientRisk.Medium, category: 'flavor-enhancers', explanation: 'Parser fragment combining salt with natural flavor. Salt is low concern, but proprietary natural flavor keeps the overall phrase at medium risk.' },
  'saib': { risk: IngredientRisk.Medium, category: 'additives', explanation: 'Abbreviation for sucrose acetate isobutyrate, used as a weighting agent in some beverages. FDA permits specified uses, but the specialized additive profile keeps it at medium concern.' },
  '415': { risk: IngredientRisk.Low, category: 'emulsifiers', explanation: 'E-number for xanthan gum, a fermented polysaccharide thickener. Xanthan gum is low concern at typical food-use levels.' },
  'sea salt natural sea salt': { risk: IngredientRisk.Low, category: 'preservatives', explanation: 'Duplicate parser fragment denoting sea salt. Sea salt is still sodium chloride, so total sodium intake is the relevant consideration.' },

// could_not_verify:
// - 'usa': country or origin fragment, not an ingredient.
// - 'red': color descriptor with no verifiable dye or food identity.
// - '35': numeric fragment with no ingredient identity.
// - '6': numeric fragment with no ingredient identity.
// - 'granular': physical-form descriptor with no ingredient identity.
// - '2': numeric fragment with no ingredient identity.
// - 'refined': processing descriptor with no ingredient identity.
// - 'concentrate': generic processing descriptor with no verifiable ingredient identity.
// - '7': numeric fragment with no ingredient identity.
// - '15': numeric fragment with no ingredient identity.
// - 'raw': preparation descriptor with no ingredient identity.
// - 'sodium acid': incomplete sodium salt name with no verifiable ingredient identity.
// - '9': numeric fragment with no ingredient identity.
// - 'wrapper': packaging fragment, not a food ingredient.
// - 'sat': abbreviation fragment with no verifiable ingredient identity.
// - '10': numeric fragment with no ingredient identity.
// - 'skinless': preparation descriptor with no ingredient identity.
// - 'tack blend': unclear parser fragment with no verifiable food-additive identity.
// - 'e': single-letter fragment with no ingredient identity.
// - 'wg': abbreviation fragment with no verifiable ingredient identity.
// - 'mono-hydrochloride': incomplete chemical-name fragment with no verifiable ingredient identity.
// - 'non-meat': product-class descriptor with no specific ingredient identity.
// - 'sodium di-': incomplete sodium-compound fragment with no verifiable ingredient identity.
// - 'mexico': country or origin fragment, not an ingredient.
// - 'of': connector word with no ingredient identity.
// - '11': numeric fragment with no ingredient identity.
// - '12': numeric fragment with no ingredient identity.
// - 'tri-': incomplete chemical-name fragment with no verifiable ingredient identity.
// - 'ground': physical-form descriptor with no ingredient identity.
// - 'b-': incomplete vitamin or chemical fragment with no verifiable ingredient identity.
// - 'whole': descriptor with no ingredient identity.
// - 'chlorine': ambiguous parser fragment; cannot verify whether it denotes a food-grade chlorine compound, sanitizer residue, or label noise.
// - 'modified': processing descriptor with no ingredient identity.
