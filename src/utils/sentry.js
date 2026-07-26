/**
 * sentry.js
 * Sentry crash/error reporting — JS layer only.
 *
 * Scope: this wires the JS SDK (`Sentry.init` + `captureException`) for runtime
 * crash/error visibility. Symbolication (readable stack traces instead of
 * minified bundle offsets) is configured OUTSIDE this file, as of 2026-07-26:
 *
 *   - `app.json` carries the "@sentry/react-native/expo" config plugin, which
 *     adds the source-map upload build phase to the generated native projects.
 *   - Three env vars drive it at build time — SENTRY_ORG, SENTRY_PROJECT,
 *     SENTRY_AUTH_TOKEN — stored as EAS secrets, never in the repo. The auth
 *     token is a credential; it must never be pasted into app.json (the plugin
 *     itself warns about this, since plugin props get written into the app
 *     package).
 *   - EAS builds upload maps automatically. OTA updates do NOT — `eas update`
 *     ships new JS that the build-time upload never saw, so it needs a manual
 *     `npm run upload:sourcemaps` afterward or those stacks stay minified.
 *     See context/sops.md → "Shipping a JS fix with readable stack traces".
 *
 * The upload is keyed on the `release`/`dist` pair set below: if those ever
 * drift from what the native SDK reports at runtime, Sentry silently fails to
 * match maps to events and the traces go minified again with no error anywhere.
 *
 * Native crash capture (iOS/Android crashes outside the JS engine) rides the
 * same plugin. Note that none of this changes what gets CAPTURED — JS
 * exceptions and error-boundary catches were always reported; symbolication
 * only changes how readable they are.
 *
 * No user tracking / no PII — see CLAUDE.md non-negotiables and the
 * 2026-07-02 decision log entry ("NO user tracking, NO PII selling — ever").
 * sendDefaultPii is explicitly off, and beforeSend strips any user/request
 * data as defense-in-depth even though sendDefaultPii already suppresses it.
 */

import * as Sentry from '@sentry/react-native';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';

const SENTRY_DSN =
  'https://7a3c87989d3d7ceb24d9bdda7deb107c@o4511678184685568.ingest.us.sentry.io/4511678765334528';

/**
 * Release identifier in Sentry's mobile convention: `<bundleId>@<version>+<build>`
 * (e.g. `com.jamesadventure.healthychoices@1.2.0+31`). This is the exact shape
 * the native SDK auto-detects from Info.plist, so setting it explicitly changes
 * nothing about grouping — it just makes the value deterministic from JS and
 * survives `enableNative: false` or a native-detection miss.
 *
 * Returns null in Expo Go / dev, where these natives report null. Callers must
 * then OMIT `release` entirely rather than pass a half-built string, so the
 * SDK's own detection still gets its chance.
 */
function nativeRelease() {
  const id = Application.applicationId;
  const version = Application.nativeApplicationVersion;
  const build = Application.nativeBuildVersion;
  if (!id || !version || !build) return null;
  return `${id}@${version}+${build}`;
}

/**
 * OTA provenance tags. The native release above identifies the BINARY, and two
 * devices running the same binary report the same release even when one has
 * pulled a JS-only `eas update` and the other hasn't — so release alone cannot
 * answer "is this device running the patched code?" once expo-updates is live
 * (first shipped in the 1.2.0 build). `ota.update_id` is what actually
 * distinguishes them; filter on it to confirm a fix landed.
 *
 * All values are strings because Sentry tags must be strings, and every read is
 * wrapped because these constants are null in Expo Go and can throw if the
 * updates module isn't configured in a given build.
 */
function otaTags() {
  try {
    return {
      'ota.update_id': Updates.updateId || 'embedded',
      'ota.channel': Updates.channel || 'none',
      'ota.runtime_version': Updates.runtimeVersion || 'unknown',
      'ota.embedded_launch': String(Updates.isEmbeddedLaunch),
    };
  } catch (e) {
    return { 'ota.update_id': 'unavailable' };
  }
}

/**
 * Call once at module scope in App.js, before the component tree renders.
 * Safe-ish to call multiple times (Sentry.init is idempotent-ish), but the
 * intent is exactly one call at startup.
 */
export function initSentry() {
  try {
    const release = nativeRelease();

    Sentry.init({
      dsn: SENTRY_DSN,

      // Which build an event came from. Omitted (not set to a placeholder) when
      // the natives report null, so the SDK falls back to its own detection.
      ...(release ? { release, dist: Application.nativeBuildVersion } : {}),

      // OTA provenance on every event — see otaTags().
      initialScope: { tags: otaTags() },

      // Hard no-tracking stance: never attach IP address, user identity,
      // cookies, or other default PII to events.
      sendDefaultPii: false,

      // Defense-in-depth: even with sendDefaultPii off, strip anything that
      // could carry user identity or request/cookie data before it leaves
      // the device.
      beforeSend(event) {
        if (event.user) {
          event.user = null;
        }
        if (event.request) {
          if (event.request.cookies) delete event.request.cookies;
          if (event.request.headers) delete event.request.headers;
          delete event.request.data;
        }
        return event;
      },

      // Crash/error tracking, not full performance monitoring — keep the
      // sample rate conservative to control noise and stay comfortably
      // inside the free 5k-events/month tier.
      tracesSampleRate: 0.1,

      environment: __DEV__ ? 'development' : 'production',
    });
  } catch (e) {
    // Never let Sentry setup itself crash the app.
    console.warn('[Sentry] init failed:', e && e.message);
  }
}

/**
 * Safe wrapper around Sentry.captureException — never throws, safe to call
 * even if initSentry() failed or was never called.
 *
 * @param {unknown} error - the caught error/exception
 * @param {object} [context] - extra context, forwarded as Sentry "extra" data
 */
export function captureException(error, context) {
  try {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } catch (e) {
    console.warn('[Sentry] captureException failed:', e && e.message);
  }
}
