export const Colors = {
  primary: '#1D9E75',
  primaryDark: '#157A5A',
  primaryLight: '#E8F7F2',
  primaryMid: '#2EC090',

  white: '#FFFFFF',
  background: '#F7FAF9',
  surface: '#FFFFFF',
  border: '#E0EDE9',

  textPrimary: '#1A2E28',
  textSecondary: '#5C7A72',
  textMuted: '#9BB5AE',

  scoreA: '#1D9E75',
  scoreB: '#6DBE47',
  scoreC: '#F5A623',
  scoreD: '#F06A25',
  scoreF: '#D93B3B',

  flagRed: '#D93B3B',
  flagOrange: '#F06A25',
  flagYellow: '#F5C842',
  flagGreen: '#1D9E75',

  dangerLight: '#FDE8E8',
  warningLight: '#FEF3E2',
  successLight: '#E8F7F2',

  shadow: 'rgba(29, 158, 117, 0.12)',
  overlay: 'rgba(0,0,0,0.5)',
};

// Per-aisle accent colors for the Home category tiles (color = label bar / icon,
// light = icon-circle background when a tile has no hero photo yet).
//
// Categories are grouped into consecutive pairs (in HEALTHY_CATEGORIES' own
// order) so each pair shares one shade, progressing light green -> deep dark
// green across the first half of the pairs, then restarting light -> dark
// brown across the second half. The green/brown split is computed from
// however many pairs exist, so it stays balanced as categories are added or
// removed (see context/decision-log.md, 2026-07-12).
const GREEN_LIGHT = '#3FAE82';
const GREEN_DARK = '#0C3D2E';
const BROWN_LIGHT = '#C9A876';
const BROWN_DARK = '#4A3418';

function mixHex(hex1, hex2, t) {
  const c1 = [1, 3, 5].map((i) => parseInt(hex1.substr(i, 2), 16));
  const c2 = [1, 3, 5].map((i) => parseInt(hex2.substr(i, 2), 16));
  return '#' + c1
    .map((c, i) => Math.round(c + (c2[i] - c) * t).toString(16).padStart(2, '0'))
    .join('');
}

export function buildCategoryAccents(categoryIds) {
  const totalPairs = Math.ceil(categoryIds.length / 2);
  const greenPairs = Math.ceil(totalPairs / 2);
  const brownPairs = totalPairs - greenPairs;

  const accents = {};
  categoryIds.forEach((id, i) => {
    const pairIndex = Math.floor(i / 2);
    let color;
    if (pairIndex < greenPairs) {
      const t = greenPairs > 1 ? pairIndex / (greenPairs - 1) : 0;
      color = mixHex(GREEN_LIGHT, GREEN_DARK, t);
    } else {
      const bIndex = pairIndex - greenPairs;
      const t = brownPairs > 1 ? bIndex / (brownPairs - 1) : 0;
      color = mixHex(BROWN_LIGHT, BROWN_DARK, t);
    }
    accents[id] = { color, light: mixHex(color, '#FFFFFF', 0.88) };
  });
  return accents;
}
