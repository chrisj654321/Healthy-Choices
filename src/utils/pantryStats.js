import { getScanHistory } from './storage';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Personal pantry stats derived from local scan history, for the Profile
 * screen's "Your Pantry Report Card" section.
 *
 * Returns null (not an error) when there's no scan history yet — callers
 * should render nothing in that case.
 *
 * Shape:
 * {
 *   totalScans: number,
 *   scansThisWeek: number,
 *   averageScore: number,       // 0-100, rounded, all-time
 *   bestProduct: { name, score },
 *   lowestProduct: { name, score, product },
 * }
 */
export async function getPantryStats() {
  const history = await getScanHistory();
  if (!history || history.length === 0) return null;

  const now = Date.now();
  const scansThisWeek = history.filter((entry) => {
    const t = new Date(entry.scannedAt).getTime();
    return !Number.isNaN(t) && now - t <= WEEK_MS;
  }).length;

  const scored = history.filter((entry) => typeof entry.score === 'number');
  if (scored.length === 0) return null;

  const totalScore = scored.reduce((sum, entry) => sum + entry.score, 0);
  const averageScore = Math.round(totalScore / scored.length);

  let best = scored[0];
  let lowest = scored[0];
  for (const entry of scored) {
    if (entry.score > best.score) best = entry;
    if (entry.score < lowest.score) lowest = entry;
  }

  return {
    totalScans: history.length,
    scansThisWeek,
    averageScore,
    bestProduct: { name: best.name, score: best.score },
    lowestProduct: { name: lowest.name, score: lowest.score, product: lowest.product },
  };
}
