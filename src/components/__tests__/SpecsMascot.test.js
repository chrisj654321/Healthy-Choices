/**
 * Logic-level tests for src/components/SpecsMascot.js.
 *
 * expo-image is a native module -- we don't render it (no react-test-renderer
 * in this codebase), we just mock it out to a no-op and assert on the
 * plain-JS surface: the CLIPS map and the component's exported shape.
 */
jest.mock('expo-image', () => ({ Image: () => null }));

import SpecsMascot, { CLIPS } from '../SpecsMascot';

describe('CLIPS', () => {
  test('has exactly the 6 expected keys', () => {
    expect(Object.keys(CLIPS).sort()).toEqual(
      ['backflip', 'idle-loop', 'inspecting', 'shy-blush', 'static', 'wave'].sort()
    );
  });

  test('every clip require() resolves to a truthy asset module', () => {
    Object.entries(CLIPS).forEach(([key, source]) => {
      expect(source).toBeTruthy();
    });
  });
});

describe('default export', () => {
  test('SpecsMascot is a function component', () => {
    expect(typeof SpecsMascot).toBe('function');
  });
});
