/**
 * Regression guard for the standing UI rule: the app shows the 0-100
 * numeric score, never a bare letter grade (A/B/C/D/F) — see CLAUDE.md.
 * This has regressed once already, so it gets its own test rather than
 * relying on someone remembering to check by eye.
 *
 * Scans the raw source of every screen/component that has displayed a
 * score in the past for a JSX text expression that renders a bare
 * grade-named variable directly (e.g. `{grade}`, `{displayGrade}`,
 * `{item.grade}`). Passing a grade THROUGH a word-producing function is
 * fine and expected — e.g. `{scoreToVerdict(displayGrade)}` renders
 * "Good"/"Poor"/etc, not a letter — so this only flags the bare-variable
 * form (no parentheses after the grade-named identifier).
 *
 * This is a static source check, not a rendered-output check: this project
 * has no React Native component-rendering test setup (no
 * @testing-library/react-native, and react-test-renderer errors out under
 * the current jest-expo config — confirmed while building this test), so a
 * real render-and-inspect test isn't available without adding a new
 * dependency. A source scan is a meaningful regression guard on its own —
 * it's exactly the pattern class ("just render the letter, it's right
 * there on the object") that caused the last regression — but it cannot
 * catch every possible way a letter could reach the screen (e.g. a letter
 * baked into a string built elsewhere and passed in as a prop).
 */
const fs = require('fs');
const path = require('path');

const FILES_TO_CHECK = [
  'src/screens/ProductScoreScreen.js',
  'src/screens/ScanHistoryScreen.js',
  'src/screens/HomeScreen.js',
  'src/screens/CompanyProfileScreen.js',
  'src/components/GradeRing.js',
  'src/components/ScanHistoryItem.js',
  'src/components/ShareCard.js',
];

// Matches a JSX text child rendering a bare grade-named variable, e.g.
// `>{grade}<`, `>{displayGrade}<`, `>{item.grade}<`, `>{h.grade}<`.
// Deliberately does NOT match a function call like
// `{scoreToVerdict(displayGrade)}` — the trailing `(` right after the
// grade-named identifier there means it's not a bare-variable render.
const BARE_GRADE_JSX = />\s*\{\s*[\w$]*\.?(?:display)?[Gg]rade\s*\}\s*</;

describe('letter grade is never rendered directly as JSX text', () => {
  test.each(FILES_TO_CHECK)('%s has no bare grade variable in JSX text', (relPath) => {
    const fullPath = path.join(__dirname, '..', '..', relPath);
    const source = fs.readFileSync(fullPath, 'utf8');
    expect(source).not.toMatch(BARE_GRADE_JSX);
  });
});
