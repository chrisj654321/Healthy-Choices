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
