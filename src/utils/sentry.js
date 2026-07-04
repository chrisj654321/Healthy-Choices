/**
 * sentry.js
 * Sentry crash/error reporting — JS layer only.
 *
 * Scope (deliberate): this wires the JS SDK (`Sentry.init` + `captureException`)
 * for runtime crash/error visibility. It does NOT add the Expo config plugin
 * ("@sentry/react-native/expo" in app.json's plugins array) and does NOT upload
 * debug symbols / source maps for native crash de-obfuscation.
 *
 * TODO(founder): once you generate a Sentry Auth Token (Settings → Auth Tokens,
 * project:releases scope) plus have your org slug + project slug in hand, add
 * the config plugin block to app.json, e.g.:
 *   ["@sentry/react-native/expo", { "organization": "<org-slug>", "project": "<project-slug>" }]
 * and wire the auth token into EAS build secrets for source map upload. Until
 * then, native-level crashes (outside JS) won't be symbolicated, and stack
 * traces in the Sentry dashboard may show minified/bundled JS instead of your
 * original source. This module still captures JS exceptions/error boundaries
 * fully — this TODO only affects symbolication quality and native crash capture.
 *
 * No user tracking / no PII — see CLAUDE.md non-negotiables and the
 * 2026-07-02 decision log entry ("NO user tracking, NO PII selling — ever").
 * sendDefaultPii is explicitly off, and beforeSend strips any user/request
 * data as defense-in-depth even though sendDefaultPii already suppresses it.
 */

import * as Sentry from '@sentry/react-native';

const SENTRY_DSN =
  'https://7a3c87989d3d7ceb24d9bdda7deb107c@o4511678184685568.ingest.us.sentry.io/4511678765334528';

/**
 * Call once at module scope in App.js, before the component tree renders.
 * Safe-ish to call multiple times (Sentry.init is idempotent-ish), but the
 * intent is exactly one call at startup.
 */
export function initSentry() {
  try {
    Sentry.init({
      dsn: SENTRY_DSN,

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
