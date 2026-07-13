/**
 * Characterization tests for buildCategoryAccents (src/constants/colors.js) —
 * the pair-based light-green-to-dark-green-then-restart-light-to-dark-brown
 * gradient used for the Home screen's category tiles (see
 * context/decision-log.md, 2026-07-12).
 */
import { buildCategoryAccents } from '../colors';

describe('buildCategoryAccents', () => {
  test('two categories in the same consecutive pair get an identical color', () => {
    const accents = buildCategoryAccents(['a', 'b', 'c', 'd']);
    expect(accents.a.color).toBe(accents.b.color);
    expect(accents.c.color).toBe(accents.d.color);
    expect(accents.a.color).not.toBe(accents.c.color);
  });

  test('the first pair is the lightest green anchor', () => {
    const ids = Array.from({ length: 25 }, (_, i) => `cat-${i}`);
    const accents = buildCategoryAccents(ids);
    expect(accents['cat-0'].color).toBe('#3fae82');
  });

  test('the last pair is the darkest brown anchor', () => {
    const ids = Array.from({ length: 25 }, (_, i) => `cat-${i}`);
    const accents = buildCategoryAccents(ids);
    expect(accents['cat-24'].color).toBe('#4a3418');
  });

  test('the pair at the green/brown boundary restarts at the lightest brown anchor, not a darker shade', () => {
    // 25 categories -> 13 pairs -> 7 green pairs (indices 0-6) -> pair 7 is
    // the first brown pair, categories at index 14 and 15.
    const ids = Array.from({ length: 25 }, (_, i) => `cat-${i}`);
    const accents = buildCategoryAccents(ids);
    expect(accents['cat-14'].color).toBe('#c9a876');
  });

  test('25 categories split into 7 green pairs and 6 brown pairs', () => {
    const ids = Array.from({ length: 25 }, (_, i) => `cat-${i}`);
    const accents = buildCategoryAccents(ids);
    // Pair 6 (categories 12-13) is the last green pair -> deepest green anchor.
    expect(accents['cat-12'].color).toBe('#0c3d2e');
    expect(accents['cat-13'].color).toBe('#0c3d2e');
    // Pair 7 (categories 14-15) is the first brown pair -> lightest brown anchor.
    expect(accents['cat-14'].color).toBe('#c9a876');
    expect(accents['cat-15'].color).toBe('#c9a876');
  });

  test('progresses monotonically darker within the green half and within the brown half', () => {
    const ids = Array.from({ length: 25 }, (_, i) => `cat-${i}`);
    const accents = buildCategoryAccents(ids);
    const luminance = (hex) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const pairFirstColors = Array.from({ length: 13 }, (_, pairIndex) => accents[`cat-${pairIndex * 2}`].color);
    const greenHalf = pairFirstColors.slice(0, 7);
    const brownHalf = pairFirstColors.slice(7);
    for (let i = 1; i < greenHalf.length; i++) {
      expect(luminance(greenHalf[i])).toBeLessThanOrEqual(luminance(greenHalf[i - 1]));
    }
    for (let i = 1; i < brownHalf.length; i++) {
      expect(luminance(brownHalf[i])).toBeLessThanOrEqual(luminance(brownHalf[i - 1]));
    }
  });

  test('an odd category count still assigns every id a color, including the trailing singleton', () => {
    const ids = Array.from({ length: 7 }, (_, i) => `cat-${i}`);
    const accents = buildCategoryAccents(ids);
    ids.forEach((id) => {
      expect(accents[id]).toBeDefined();
      expect(accents[id].color).toMatch(/^#[0-9a-f]{6}$/);
    });
    // 7 categories -> 4 pairs -> 2 green pairs (cat-0..cat-3), 2 brown pairs
    // (cat-4..cat-6) -> cat-6 is a singleton pair of its own (the trailing
    // odd category), landing on the darkest brown anchor, distinct from
    // cat-4/cat-5's lightest-brown pair.
    expect(accents['cat-4'].color).toBe(accents['cat-5'].color);
    expect(accents['cat-6'].color).toBe('#4a3418');
    expect(accents['cat-6'].color).not.toBe(accents['cat-5'].color);
  });

  test('the green/brown split recomputes for a smaller even category count', () => {
    const ids = Array.from({ length: 4 }, (_, i) => `cat-${i}`);
    const accents = buildCategoryAccents(ids);
    // 4 categories -> 2 pairs -> 1 green pair, 1 brown pair.
    expect(accents['cat-0'].color).toBe('#3fae82');
    expect(accents['cat-1'].color).toBe('#3fae82');
    expect(accents['cat-2'].color).toBe('#c9a876');
    expect(accents['cat-3'].color).toBe('#c9a876');
  });

  test('light is a white-blended tint derived from color, not a fixed shared pastel', () => {
    const ids = Array.from({ length: 25 }, (_, i) => `cat-${i}`);
    const accents = buildCategoryAccents(ids);
    expect(accents['cat-0'].light).not.toBe(accents['cat-24'].light);
    expect(accents['cat-0'].light).toMatch(/^#[0-9a-f]{6}$/);
  });

  test('every returned color and light value is a valid 6-digit hex string', () => {
    const ids = Array.from({ length: 25 }, (_, i) => `cat-${i}`);
    const accents = buildCategoryAccents(ids);
    Object.values(accents).forEach(({ color, light }) => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
      expect(light).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
});
