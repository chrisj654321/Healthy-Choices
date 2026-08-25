/**
 * fetchWithTimeout — fetch that always resolves within a bound.
 *
 * RN's fetch has NO default timeout (unlike browsers): on a flaky/slow
 * connection a request can hang indefinitely, leaving the user staring at a
 * spinner (search) or a "Found!" overlay that never advances (scanner).
 * Extracted from ProductSearchScreen so the scanner's barcode lookup gets the
 * same bound instead of hanging until the OS gives up.
 */

export const REMOTE_TIMEOUT_MS = 8000;

export function fetchWithTimeout(url, options, timeoutMs = REMOTE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/**
 * True when a fetch rejection is an expected abort/cancellation rather than a
 * real failure: our own AbortController timeout firing, or the OS canceling an
 * in-flight request when the app is backgrounded (iOS suspends JS timers, so
 * the timeout can even fire late, on resume). The caller falls back either
 * way, so this lets a caller skip error-level Sentry noise for a non-failure.
 *
 * Matches by name ('AbortError', the standard DOM abort) and by message —
 * React Native / Hermes phrases it as "Fetch request has been canceled", which
 * carries no AbortError name, so the message check is the one that catches it.
 */
export function isAbortError(error) {
  if (!error) return false;
  if (error.name === 'AbortError') return true;
  const message = String(error.message ?? error).toLowerCase();
  return message.includes('abort') || message.includes('cancel');
}
