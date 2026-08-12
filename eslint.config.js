// Focused lint gate. Its one job is to catch the Rules-of-Hooks class of bug
// that shipped a production crash in 1.2.0 (a hook declared after an early
// return in ProductScoreScreen — see decision-log 2026-08-09). It is
// deliberately NOT a full style linter: only `react-hooks/rules-of-hooks`
// runs, as an error, so `npm test` fails fast on a hook-order mistake instead
// of letting it reach users. Add more rules later if wanted; keep this one
// strict and noise-free so it never gets muted.
const reactHooks = require('eslint-plugin-react-hooks');

module.exports = [
  {
    // Global ignore (own entry, so it applies before any file is parsed).
    // src/data/** is product/batch DATA — some of it not even valid ESM
    // (Octavius staging files) — never React, so it is never linted.
    ignores: ['src/data/**'],
  },
  {
    // Lint only where hooks and components live.
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'react-hooks': reactHooks },
    linterOptions: {
      // Existing code carries eslint-disable comments for rules this focused
      // config does not enable; don't report those as problems.
      reportUnusedDisableDirectives: 'off',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      // exhaustive-deps intentionally off — it is a different (dependency
      // array) concern, noisy across an existing codebase, and not the crash
      // class this gate exists for. Enable as 'warn' later if desired.
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];
