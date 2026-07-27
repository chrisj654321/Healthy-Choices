// Metro bundler configuration.
//
// This file exists for ONE reason: Sentry source maps. Without it, Metro emits
// a bundle with no Debug ID and no accompanying .map file, so there is nothing
// to upload and nothing to match an upload against — which is exactly why the
// 1.2.0 (1.1.6) build produced no source maps despite the Sentry Expo config
// plugin being correctly configured in app.json. The plugin wires up the UPLOAD;
// this wires up the thing being uploaded.
//
// A Debug ID is a fingerprint baked into both the bundle and its source map at
// bundle time. Sentry pairs them by that ID, which is what makes a stack trace
// resolve to real file names and line numbers instead of an offset into
// compiled bytecode.
//
// getSentryExpoConfig() returns Expo's own default config with Sentry's
// serializer added — it is a superset of `getDefaultConfig(__dirname)`, not a
// replacement for it, so Expo's asset/transformer defaults are preserved.
//
// HISTORY, so this doesn't get deleted again: a previous metro.config.js was
// removed on 2026-07-12 when the 161MB products.db stopped being bundled as a
// Metro asset and moved to a runtime download. That config was genuinely dead.
// This one is not — deleting it silently breaks crash symbolication, with no
// build error and no failing test to catch it.
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

module.exports = getSentryExpoConfig(__dirname);
