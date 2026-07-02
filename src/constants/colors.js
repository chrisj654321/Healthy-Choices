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
const TONE_GREEN = { color: '#1D9E75', light: '#E8F7F2' };
const TONE_DEEP_GREEN = { color: '#157A5A', light: '#DFF0EA' };
const TONE_TAN = { color: '#A98D5F', light: '#F4EDE1' };

export const categoryAccents = {
  beverages:        TONE_GREEN,
  'chips-crackers': TONE_DEEP_GREEN,
  'snack-bars':     TONE_TAN,
  'frozen-veg':     TONE_GREEN,
  'cooking-oils':   TONE_DEEP_GREEN,
  'plant-milk':     TONE_TAN,
  bread:            TONE_GREEN,
  condiments:       TONE_DEEP_GREEN,
  yogurt:           TONE_TAN,
  'frozen-breakfast':TONE_GREEN,
  cereal:           TONE_DEEP_GREEN,
  'frozen-meals':   TONE_TAN,
  'deli-lunch':     TONE_GREEN,
  'canned-goods':   TONE_DEEP_GREEN,
  cheese:           TONE_TAN,
  'pasta-grains':   TONE_GREEN,
  nuts:             TONE_DEEP_GREEN,
  'baby-food':      TONE_TAN,
  'coffee-creamer': TONE_GREEN,
  'nut-butters':    TONE_DEEP_GREEN,
  'pasta-sauce':    TONE_TAN,
  soups:            TONE_GREEN,
  'coffee-tea':     TONE_DEEP_GREEN,
  eggs:             TONE_TAN,
  granola:          TONE_GREEN,
};
