const { daysBetween, jaccardSimilarity } = require('./utils');

const SCORE_FIELDS = Object.freeze([
  ['brand_relevance', 0.2],
  ['evidence_strength', 0.2],
  ['audience_usefulness', 0.15],
  ['emotional_strength', 0.15],
  ['visual_feasibility', 0.1],
  ['novelty', 0.15],
  ['production_efficiency', 0.05],
]);

function clampScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(5, number));
}

function scoreFinding(finding, recentConcepts = []) {
  const comparisonText = `${finding.hook || ''} ${finding.topic || ''} ${
    finding.format || ''
  }`;
  const maxSimilarity = recentConcepts.reduce((highest, concept) => {
    const candidate = `${concept.hook || ''} ${concept.topic || ''} ${
      concept.format || ''
    }`;
    return Math.max(highest, jaccardSimilarity(comparisonText, candidate));
  }, 0);

  const novelty = Math.max(0, Math.min(5, (1 - maxSimilarity) * 5));
  const productionEfficiency = 6 - clampScore(finding.production_cost || 3);
  const values = {
    brand_relevance: clampScore(finding.brand_relevance),
    evidence_strength: clampScore(finding.evidence_strength),
    audience_usefulness: clampScore(finding.audience_usefulness),
    emotional_strength: clampScore(finding.emotional_strength),
    visual_feasibility: clampScore(finding.visual_feasibility),
    novelty,
    production_efficiency: clampScore(productionEfficiency),
  };

  const weighted = SCORE_FIELDS.reduce(
    (total, [field, weight]) => total + values[field] * weight,
    0
  );

  return {
    score: Math.round((weighted / 5) * 100),
    maxSimilarity: Number(maxSimilarity.toFixed(3)),
    values,
  };
}

function evaluateFinding(finding, config, recentConcepts = [], now = new Date()) {
  const reasons = [];
  if (!finding.source_url) reasons.push('missing source URL');
  if (!finding.hook) reasons.push('missing hook');
  if (!finding.topic) reasons.push('missing topic');
  if (
    daysBetween(finding.observed_at, now) >
    config.research.staleAfterDays
  ) {
    reasons.push('finding is stale');
  }

  const scoring = scoreFinding(finding, recentConcepts);
  if (scoring.score < config.research.minimumScore) {
    reasons.push(`score ${scoring.score} is below minimum`);
  }
  if (
    scoring.maxSimilarity >
    config.deduplication.maxTextSimilarity
  ) {
    reasons.push('too similar to recent content');
  }

  return {
    accepted: reasons.length === 0,
    reasons,
    ...scoring,
  };
}

module.exports = {
  SCORE_FIELDS,
  evaluateFinding,
  scoreFinding,
};
