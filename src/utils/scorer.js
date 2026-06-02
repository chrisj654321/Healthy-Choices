import { INGREDIENT_DB, FLAG_LEVELS } from '../data/ingredients';
import { CACHED_INGREDIENT_ANALYSIS, riskToFlag } from '../data/ingredientCache';

/**
 * Returns personalised warnings and flags based on user prefs.
 * Returns { allergenHits, dietaryConflicts, goalNote }
 */
export function getPersonalisedWarnings(analyzedIngredients, product, prefs) {
  if (!prefs) return { allergenHits: [], dietaryConflicts: [], goalNote: null };

  const { allergens = [], dietaryFlags = [], primaryGoal } = prefs;
  const { nutrition = {} } = product;

  // Allergen hits — ingredient category matches an allergen the user flagged
  const ALLERGEN_CATEGORY_MAP = {
    peanuts: ['proteins'],
    'tree nuts': ['proteins'],
    milk: ['dairy'],
    eggs: ['proteins'],
    wheat: ['grains'],
    soy: ['proteins'],
    fish: ['proteins'],
    shellfish: ['proteins'],
  };
  const ALLERGEN_KEYWORD_MAP = {
    peanuts: ['peanut'],
    'tree nuts': ['almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'tree nut'],
    milk: ['milk', 'dairy', 'whey', 'casein', 'lactose', 'cream', 'butter', 'cheese'],
    eggs: ['egg', 'albumin'],
    wheat: ['wheat', 'gluten', 'flour', 'bread'],
    soy: ['soy', 'tofu', 'edamame', 'tempeh'],
    fish: ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'anchovy'],
    shellfish: ['shellfish', 'shrimp', 'crab', 'lobster', 'scallop', 'clam'],
  };

  const allergenHits = allergens.reduce((acc, a) => {
    const keywords = ALLERGEN_KEYWORD_MAP[a] || [];
    const hits = analyzedIngredients.filter((item) => {
      const rawLower = item.raw.toLowerCase();
      return keywords.some((kw) => rawLower.includes(kw));
    });
    if (hits.length > 0) acc.push({ allergen: a, ingredients: hits });
    return acc;
  }, []);

  // Dietary conflicts
  const DIET_CONFLICT_MAP = {
    vegan: { keywords: ['milk', 'dairy', 'whey', 'casein', 'egg', 'albumin', 'honey', 'gelatin', 'tallow', 'lard', 'shellac'], label: 'Vegan' },
    vegetarian: { keywords: ['gelatin', 'tallow', 'lard', 'anchovies', 'rennet'], label: 'Vegetarian' },
    'gluten-free': { keywords: ['wheat', 'gluten', 'barley', 'rye', 'malt'], label: 'Gluten-Free' },
    'dairy-free': { keywords: ['milk', 'dairy', 'whey', 'casein', 'lactose', 'cream', 'butter', 'cheese'], label: 'Dairy-Free' },
    keto: { keywords: ['sugar', 'high fructose corn syrup', 'maltodextrin', 'dextrose', 'corn syrup', 'honey', 'rice syrup'], label: 'Keto' },
    'low-sugar': { keywords: ['sugar', 'high fructose corn syrup', 'corn syrup', 'honey', 'rice syrup', 'dextrose'], label: 'Low Sugar' },
  };

  const dietaryConflicts = dietaryFlags.reduce((acc, flag) => {
    const rule = DIET_CONFLICT_MAP[flag];
    if (!rule) return acc;
    const hits = analyzedIngredients.filter((item) => {
      const rawLower = item.raw.toLowerCase();
      return rule.keywords.some((kw) => rawLower.includes(kw));
    });
    if (hits.length > 0) acc.push({ diet: flag, label: rule.label, ingredients: hits });
    return acc;
  }, []);

  // Goal note
  const GOAL_NOTE_MAP = {
    'avoid-added-sugar': nutrition.sugars > 12 ? `Contains ${nutrition.sugars}g sugar — above your low-sugar goal.` : null,
    'reduce-sodium': nutrition.sodium > 300 ? `Contains ${nutrition.sodium}mg sodium — high for your sodium goal.` : null,
    'increase-protein': nutrition.protein < 5 ? 'Low protein content — under 5g per serving.' : null,
    'increase-fiber': null,
    'avoid-high-risk': null,
    'eat-clean': null,
    'low-carb-diet': nutrition.carbs > 20 ? `Contains ${nutrition.carbs}g carbs — above your low-carb target.` : null,
  };
  const goalNote = primaryGoal ? GOAL_NOTE_MAP[primaryGoal] ?? null : null;

  return { allergenHits, dietaryConflicts, goalNote };
}

/**
 * Scores a product's ingredients and returns a health score (0-100) and grade (A-F).
 */
export function scoreProduct(product) {
  const { ingredients = [], nutrition = {}, certifications = [] } = product;

  const analyzed = analyzeIngredients(ingredients);
  const nutritionPenalty = calcNutritionPenalty(nutrition);
  const certBonus = certifications.length * 3;

  // Base score starts at 100, subtract penalties
  let score = 100;
  score -= analyzed.totalPenalty;
  score -= nutritionPenalty;
  score += certBonus;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    grade: scoreToGrade(score),
    gradeColor: gradeToColor(scoreToGrade(score)),
    analyzedIngredients: analyzed.items,
    flaggedCount: analyzed.flaggedCount,
    avoidCount: analyzed.avoidCount,
    nutritionPenalty,
    certBonus,
  };
}

function analyzeIngredients(ingredients) {
  let totalPenalty = 0;
  let flaggedCount = 0;
  let avoidCount = 0;
  const items = [];

  ingredients.forEach((raw) => {
    const key = raw.toLowerCase().trim();
    const data = INGREDIENT_DB[key];

    if (data) {
      const penalty = data.risk * 2.5;
      totalPenalty += penalty;
      flaggedCount++;
      if (data.flag === 'avoid') avoidCount++;

      items.push({
        raw,
        label: data.label,
        risk: data.risk,
        category: data.category,
        note: data.note,
        flag: data.flag,
        flagInfo: FLAG_LEVELS[data.flag],
        penalty,
      });
    } else {
      const cached = CACHED_INGREDIENT_ANALYSIS[key];
      if (cached) {
        const flag = riskToFlag(cached.risk);
        const penalty = flag === 'ok' ? 0 : cached.risk * 2.5;
        totalPenalty += penalty;
        if (flag !== 'ok') flaggedCount++;
        if (flag === 'avoid') avoidCount++;
        items.push({
          raw,
          label: formatIngredientLabel(raw),
          risk: cached.risk,
          category: cached.category || 'unknown',
          note: cached.explanation,
          flag,
          flagInfo: FLAG_LEVELS[flag] || FLAG_LEVELS['ok'],
          penalty,
        });
      } else {
        items.push({
          raw,
          label: formatIngredientLabel(raw),
          risk: 0,
          category: 'unknown',
          note: null,
          flag: 'ok',
          flagInfo: FLAG_LEVELS['ok'],
          penalty: 0,
        });
      }
    }
  });

  return { items, totalPenalty: Math.min(totalPenalty, 80), flaggedCount, avoidCount };
}

function calcNutritionPenalty(nutrition) {
  let penalty = 0;
  if (nutrition.sugars > 30) penalty += 12;
  else if (nutrition.sugars > 20) penalty += 8;
  else if (nutrition.sugars > 12) penalty += 4;

  if (nutrition.sodium > 500) penalty += 8;
  else if (nutrition.sodium > 300) penalty += 4;

  if (nutrition.saturatedFat > 10) penalty += 8;
  else if (nutrition.saturatedFat > 5) penalty += 4;

  return Math.min(penalty, 20);
}

export function scoreToGrade(score) {
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

export function gradeToColor(grade) {
  const map = { A: '#1D9E75', B: '#6DBE47', C: '#F5A623', D: '#F06A25', F: '#D93B3B' };
  return map[grade] || '#9BB5AE';
}

export function formatIngredientLabel(raw) {
  return raw
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getLobbyingRiskLevel(spend) {
  if (spend >= 3000000) return { label: 'Very High', color: '#D93B3B', bg: '#FDE8E8' };
  if (spend >= 1500000) return { label: 'High', color: '#F06A25', bg: '#FEF0E6' };
  if (spend >= 500000) return { label: 'Moderate', color: '#F5C842', bg: '#FEF9E7' };
  return { label: 'Low', color: '#1D9E75', bg: '#E8F7F2' };
}

export function formatCurrency(amount) {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

export function scoreToVerdict(grade) {
  const map = { A: 'Excellent', B: 'Good', C: 'Fair', D: 'Poor', F: 'Avoid' };
  return map[grade] || 'Unknown';
}

export function generateScoreExplanation(product, result) {
  const { grade, flaggedCount, nutritionPenalty, certBonus, analyzedIngredients } = result;
  const avoidList = analyzedIngredients.filter((i) => i.flag === 'avoid');
  const cautionList = analyzedIngredients.filter((i) => i.flag === 'caution' || i.flag === 'moderate');

  if (grade === 'A') {
    if (certBonus > 0 && product.certifications?.length > 0) {
      return `${product.name} earns a top score with clean, recognizable ingredients and ${product.certifications[0]} certification — no harmful additives detected.`;
    }
    if (flaggedCount === 0) {
      return `Every ingredient in ${product.name} passed our screening with no concerns. A clean, healthy choice.`;
    }
    return `${product.name} has clean ingredients overall. A few minor items are noted in the breakdown below, but nothing significant.`;
  }

  if (grade === 'F') {
    if (avoidList.length >= 2) {
      const a = avoidList[0].label;
      const b = avoidList[1].label;
      return `This product scores poorly mainly due to ${a} and ${b}${avoidList.length > 2 ? `, along with ${avoidList.length - 2} more flagged ingredient${avoidList.length > 3 ? 's' : ''}` : ''}, which are flagged in our database. See the breakdown for details.`;
    }
    if (avoidList.length === 1) {
      const m = avoidList[0];
      return `${m.label} is the primary concern — ${m.note ? m.note.toLowerCase() : 'flagged in our database'}. Additional issues also lower the score.`;
    }
    return `Multiple flagged ingredients and high sugar, sodium, or saturated fat levels combine to give this product a low score. See the breakdown for details.`;
  }

  if (grade === 'D') {
    if (avoidList.length > 0) {
      const m = avoidList[0];
      const extra = avoidList.length > 1 ? ` and ${avoidList.length - 1} other flagged ingredient${avoidList.length > 2 ? 's' : ''}` : '';
      return `${m.label}${extra} lower this score significantly. ${m.note ? m.note : 'This ingredient is flagged in our database — check the breakdown for details.'}`;
    }
    if (nutritionPenalty > 8) {
      return `High ${nutritionPenalty > 12 ? 'sugar and sodium' : 'sugar or sodium'} levels, combined with several flagged additives, pull this score down.`;
    }
    return `Several caution-level ingredients combine to give this product a poor score. See the breakdown below for specifics.`;
  }

  if (grade === 'C') {
    if (avoidList.length > 0) {
      const m = avoidList[0];
      return `${m.label} is the primary concern in this product${m.note ? ` — ${m.note.toLowerCase().slice(0, 80)}` : ''}. Check the ingredients tab for the full breakdown.`;
    }
    if (cautionList.length >= 2) {
      const names = cautionList.slice(0, 2).map((i) => i.label).join(' and ');
      return `${names} are worth monitoring here. These aren't classified as high-risk but may be a concern for some people.`;
    }
    if (nutritionPenalty > 4) {
      return `Above-average ${nutritionPenalty > 8 ? 'sugar and sodium levels' : 'nutritional values'}, along with ${flaggedCount} flagged ingredient${flaggedCount !== 1 ? 's' : ''}, bring this into the fair range.`;
    }
    return `A fair score — no avoid-level ingredients, but ${flaggedCount} ingredient${flaggedCount !== 1 ? 's' : ''} worth monitoring.`;
  }

  if (grade === 'B') {
    if (flaggedCount === 0) {
      return `${product.name} is a solid choice with clean ingredients and no red flags. A minor nutritional consideration keeps it from a perfect score.`;
    }
    const c = cautionList[0];
    if (c) {
      return `A good product overall. ${c.label} is worth noting${c.note ? ` — ${c.note.toLowerCase().slice(0, 70)}` : ''}, but no high-risk ingredients were found.`;
    }
    return `${product.name} scores well with mostly clean ingredients. A small number of items to be aware of, but nothing high-risk.`;
  }

  return `${product.name} received a moderate score. Review the ingredient breakdown below for details.`;
}
