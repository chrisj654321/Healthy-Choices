/**
 * Tests for src/utils/paywallContent.js — the field-by-field validation
 * layer between RC's `offering.metadata` (untrusted, hand-typed dashboard
 * JSON) and the paywall UI. Every case below pins the "never all-or-nothing"
 * contract: a bad field falls back to its own default, a good field passes
 * through, and no input shape ever throws or produces a blank/partial
 * result.
 */

import {
  getPaywallContent,
  resolveFeatureColor,
  headlineFor,
  DEFAULT_HEADLINES,
  DEFAULT_FEATURES,
  DEFAULT_YEARLY_BADGE,
  DEFAULT_CTA_LABELS,
} from '../paywallContent';
import { Colors } from '../../constants/colors';

const FULL_DEFAULTS = {
  headlines: DEFAULT_HEADLINES,
  features: DEFAULT_FEATURES,
  yearlyBadge: DEFAULT_YEARLY_BADGE,
  ctaLabels: DEFAULT_CTA_LABELS,
};

describe('getPaywallContent — no metadata (today\'s behavior)', () => {
  test('null offering -> exact in-code defaults', () => {
    expect(getPaywallContent(null)).toEqual(FULL_DEFAULTS);
  });

  test('undefined offering -> exact in-code defaults', () => {
    expect(getPaywallContent(undefined)).toEqual(FULL_DEFAULTS);
  });

  test('offering with no metadata key at all -> exact in-code defaults', () => {
    expect(getPaywallContent({ identifier: 'default', availablePackages: [] })).toEqual(FULL_DEFAULTS);
  });

  test('offering.metadata is an empty object -> exact in-code defaults', () => {
    expect(getPaywallContent({ metadata: {} })).toEqual(FULL_DEFAULTS);
  });

  test('offering.metadata is null -> exact in-code defaults', () => {
    expect(getPaywallContent({ metadata: null })).toEqual(FULL_DEFAULTS);
  });
});

describe('getPaywallContent — malformed metadata never throws / never blanks', () => {
  test('metadata is a string -> falls back to full defaults, does not throw', () => {
    expect(() => getPaywallContent({ metadata: 'not an object' })).not.toThrow();
    expect(getPaywallContent({ metadata: 'not an object' })).toEqual(FULL_DEFAULTS);
  });

  test('metadata is an array -> falls back to full defaults, does not throw', () => {
    expect(getPaywallContent({ metadata: ['a', 'b'] })).toEqual(FULL_DEFAULTS);
  });

  test('metadata is a number -> falls back to full defaults, does not throw', () => {
    expect(getPaywallContent({ metadata: 42 })).toEqual(FULL_DEFAULTS);
  });

  test('a bare metadata object (not wrapped in an offering) is accepted directly', () => {
    // getCurrentOffering() callers pass the whole offering, but the function
    // also tolerates being handed metadata directly — defensive, not relied on.
    const bare = { yearlyBadge: 'LIMITED TIME' };
    expect(getPaywallContent(bare).yearlyBadge).toBe('LIMITED TIME');
  });
});

describe('getPaywallContent — headlines: per-field fallback', () => {
  test('one valid trigger, others missing -> only that trigger overridden, rest default', () => {
    const result = getPaywallContent({
      metadata: { headlines: { company: { title: 'New Title', sub: 'New sub.' } } },
    });
    expect(result.headlines.company).toEqual({ title: 'New Title', sub: 'New sub.' });
    expect(result.headlines.search).toEqual(DEFAULT_HEADLINES.search);
    expect(result.headlines.history).toEqual(DEFAULT_HEADLINES.history);
    expect(result.headlines.alternatives).toEqual(DEFAULT_HEADLINES.alternatives);
    expect(result.headlines.default).toEqual(DEFAULT_HEADLINES.default);
  });

  test('title present but sub missing on one entry -> title overridden, sub falls back to default (per-field, not per-entry)', () => {
    const result = getPaywallContent({ metadata: { headlines: { search: { title: 'Only Title' } } } });
    expect(result.headlines.search).toEqual({ title: 'Only Title', sub: DEFAULT_HEADLINES.search.sub });
  });

  test('wrong type (title is a number) -> that field falls back, entry not dropped', () => {
    const result = getPaywallContent({
      metadata: { headlines: { history: { title: 12345, sub: 'Valid sub.' } } },
    });
    expect(result.headlines.history).toEqual({ title: DEFAULT_HEADLINES.history.title, sub: 'Valid sub.' });
  });

  test('empty-string title -> treated as invalid, falls back (avoids a typo blanking the headline)', () => {
    const result = getPaywallContent({ metadata: { headlines: { company: { title: '', sub: '   ' } } } });
    expect(result.headlines.company).toEqual(DEFAULT_HEADLINES.company);
  });

  test('oversized title -> falls back rather than rendering a truncated/broken headline', () => {
    const huge = 'x'.repeat(500);
    const result = getPaywallContent({ metadata: { headlines: { alternatives: { title: huge, sub: 'fine' } } } });
    expect(result.headlines.alternatives.title).toBe(DEFAULT_HEADLINES.alternatives.title);
    expect(result.headlines.alternatives.sub).toBe('fine');
  });

  test('headlines is not an object (e.g. a string) -> all headlines fall back to defaults', () => {
    expect(getPaywallContent({ metadata: { headlines: 'nope' } }).headlines).toEqual(DEFAULT_HEADLINES);
  });

  test('unknown trigger key is ignored, known ones still resolve', () => {
    const result = getPaywallContent({
      metadata: { headlines: { madeUpTrigger: { title: 'x', sub: 'y' } } },
    });
    expect(result.headlines).toEqual(DEFAULT_HEADLINES);
  });
});

describe('getPaywallContent — features: caps, per-row validation, icon/color allowlists', () => {
  test('fully valid override -> passes through exactly', () => {
    const rows = [
      { icon: 'star-outline', colorKey: 'flagRed', text: 'Custom feature one' },
      { icon: 'leaf-outline', colorKey: 'textSecondary', text: 'Custom feature two' },
    ];
    expect(getPaywallContent({ metadata: { features: rows } }).features).toEqual(rows);
  });

  test('not an array -> falls back to DEFAULT_FEATURES entirely', () => {
    expect(getPaywallContent({ metadata: { features: 'nope' } }).features).toEqual(DEFAULT_FEATURES);
  });

  test('empty array -> falls back to DEFAULT_FEATURES (an empty feature list would blank the card)', () => {
    expect(getPaywallContent({ metadata: { features: [] } }).features).toEqual(DEFAULT_FEATURES);
  });

  test('oversized array is capped at MAX_FEATURES (8), not rejected wholesale', () => {
    const rows = Array.from({ length: 20 }, (_, i) => ({
      icon: 'star-outline', colorKey: 'primary', text: `Feature ${i}`,
    }));
    const result = getPaywallContent({ metadata: { features: rows } }).features;
    expect(result.length).toBe(8);
    expect(result[0].text).toBe('Feature 0');
    expect(result[7].text).toBe('Feature 7');
  });

  test('unknown icon name falls back to the default icon, row is kept (not dropped)', () => {
    const result = getPaywallContent({
      metadata: { features: [{ icon: 'nuclear-bomb-outline', colorKey: 'primary', text: 'Still shows' }] },
    }).features;
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Still shows');
    expect(result[0].icon).not.toBe('nuclear-bomb-outline');
    // Must resolve to a color regardless — no crash on lookup.
    expect(resolveFeatureColor(result[0].colorKey)).toBeTruthy();
  });

  test('unknown colorKey falls back to the default color key, row is kept', () => {
    const result = getPaywallContent({
      metadata: { features: [{ icon: 'star-outline', colorKey: 'rainbow-glitter', text: 'Still shows' }] },
    }).features;
    expect(result[0].colorKey).toBe('primary');
  });

  test('row missing text is dropped entirely; other valid rows in the same array survive', () => {
    const result = getPaywallContent({
      metadata: {
        features: [
          { icon: 'star-outline', colorKey: 'primary' }, // no text -> dropped
          { icon: 'leaf-outline', colorKey: 'primary', text: 'Kept row' },
        ],
      },
    }).features;
    expect(result).toEqual([{ icon: 'leaf-outline', colorKey: 'primary', text: 'Kept row' }]);
  });

  test('all rows invalid -> falls back to DEFAULT_FEATURES, not an empty array', () => {
    const result = getPaywallContent({
      metadata: { features: [{ icon: 'star-outline' }, { colorKey: 'primary' }] },
    }).features;
    expect(result).toEqual(DEFAULT_FEATURES);
  });

  test('non-object row (e.g. a bare string) inside the array is skipped, not thrown', () => {
    const result = getPaywallContent({
      metadata: { features: ['garbage', { icon: 'star-outline', colorKey: 'primary', text: 'Kept' }] },
    }).features;
    expect(result).toEqual([{ icon: 'star-outline', colorKey: 'primary', text: 'Kept' }]);
  });
});

describe('getPaywallContent — yearlyBadge', () => {
  test('valid string overrides the default', () => {
    expect(getPaywallContent({ metadata: { yearlyBadge: 'LIMITED TIME' } }).yearlyBadge).toBe('LIMITED TIME');
  });

  test('wrong type (number) -> falls back to default', () => {
    expect(getPaywallContent({ metadata: { yearlyBadge: 12345 } }).yearlyBadge).toBe(DEFAULT_YEARLY_BADGE);
  });

  test('oversized string -> falls back to default', () => {
    expect(getPaywallContent({ metadata: { yearlyBadge: 'x'.repeat(500) } }).yearlyBadge).toBe(DEFAULT_YEARLY_BADGE);
  });

  test('empty string -> falls back to default', () => {
    expect(getPaywallContent({ metadata: { yearlyBadge: '' } }).yearlyBadge).toBe(DEFAULT_YEARLY_BADGE);
  });
});

describe('getPaywallContent — ctaLabels', () => {
  test('both valid -> both overridden', () => {
    const result = getPaywallContent({
      metadata: { ctaLabels: { yearly: 'Go Premium', monthly: 'Try Monthly' } },
    }).ctaLabels;
    expect(result).toEqual({ yearly: 'Go Premium', monthly: 'Try Monthly' });
  });

  test('only one valid -> that one overridden, the other falls back independently', () => {
    const result = getPaywallContent({ metadata: { ctaLabels: { yearly: 'Go Premium' } } }).ctaLabels;
    expect(result).toEqual({ yearly: 'Go Premium', monthly: DEFAULT_CTA_LABELS.monthly });
  });

  test('wrong type (ctaLabels itself is an array) -> both fall back to defaults', () => {
    expect(getPaywallContent({ metadata: { ctaLabels: ['a', 'b'] } }).ctaLabels).toEqual(DEFAULT_CTA_LABELS);
  });

  test('a field with the wrong type inside a valid object -> only that field falls back', () => {
    const result = getPaywallContent({
      metadata: { ctaLabels: { yearly: 999, monthly: 'Try Monthly' } },
    }).ctaLabels;
    expect(result).toEqual({ yearly: DEFAULT_CTA_LABELS.yearly, monthly: 'Try Monthly' });
  });
});

describe('getPaywallContent — fully valid override across every field at once', () => {
  test('everything overridden together, everything passes through', () => {
    const metadata = {
      headlines: {
        company: { title: 'A', sub: 'a' },
        search: { title: 'B', sub: 'b' },
        history: { title: 'C', sub: 'c' },
        alternatives: { title: 'D', sub: 'd' },
        default: { title: 'E', sub: 'e' },
      },
      features: [{ icon: 'shield-checkmark-outline', colorKey: 'flagYellow', text: 'Only feature' }],
      yearlyBadge: 'SPECIAL OFFER',
      ctaLabels: { yearly: 'Go', monthly: 'Also go' },
    };
    const result = getPaywallContent({ metadata });
    expect(result).toEqual({
      headlines: metadata.headlines,
      features: metadata.features,
      yearlyBadge: 'SPECIAL OFFER',
      ctaLabels: { yearly: 'Go', monthly: 'Also go' },
    });
  });
});

describe('resolveFeatureColor', () => {
  test('known key resolves to the real Colors.* value', () => {
    expect(resolveFeatureColor('primary')).toBe(Colors.primary);
    expect(resolveFeatureColor('flagOrange')).toBe(Colors.flagOrange);
  });

  test('unknown key falls back to the default color, does not return undefined', () => {
    expect(resolveFeatureColor('not-a-real-key')).toBe(Colors.primary);
    expect(resolveFeatureColor(undefined)).toBe(Colors.primary);
  });
});

describe('headlineFor', () => {
  const content = getPaywallContent(null);

  test('known trigger returns that trigger\'s headline', () => {
    expect(headlineFor(content, 'company')).toEqual(DEFAULT_HEADLINES.company);
  });

  test('null/undefined feature (onboarding case) returns default', () => {
    expect(headlineFor(content, null)).toEqual(DEFAULT_HEADLINES.default);
    expect(headlineFor(content, undefined)).toEqual(DEFAULT_HEADLINES.default);
  });

  test('unrecognized trigger falls back to default rather than throwing', () => {
    expect(headlineFor(content, 'not-a-real-trigger')).toEqual(DEFAULT_HEADLINES.default);
  });
});
