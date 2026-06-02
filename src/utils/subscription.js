/**
 * subscription.js
 * RevenueCat-backed subscription management.
 *
 * Dashboard setup (do once before testing purchases):
 *   1. app.revenuecat.com → New Project → Add iOS App
 *      Bundle ID: com.healthychoices.app
 *   2. Entitlements → New → Identifier: "Healthy Choices Pro"
 *   3. Products → Add product IDs that match App Store Connect:
 *      "monthly" and "yearly"
 *   4. Attach both products to the "Healthy Choices Pro" entitlement
 *   5. Offerings → Default → Add packages for monthly + yearly
 *   6. Auth → Integrations → copy your iOS public SDK key (replace RC_API_KEY below if needed)
 */

import Purchases, { LOG_LEVEL, PACKAGE_TYPE } from 'react-native-purchases';
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

// ─── Config ───────────────────────────────────────────────────────────────────

const RC_API_KEY = Platform.select({
  ios:     'test_OGDUwBQEwAbrJPBbvDRYlEKDYfH',
  android: 'REPLACE_WITH_ANDROID_RC_KEY',   // add when ready for Google Play
  default: 'test_OGDUwBQEwAbrJPBbvDRYlEKDYfH',
});

export const ENTITLEMENT_ID = 'Healthy Choices Pro';

// ─── Initialization ───────────────────────────────────────────────────────────

/**
 * Call once at app startup (App.js), before any purchase calls.
 * Pass the Supabase user.id so RC and your backend stay in sync — or
 * leave userId undefined to start anonymous (RC assigns its own ID).
 */
export async function initRevenueCat(userId) {
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey: RC_API_KEY });

  if (userId) {
    try {
      await Purchases.logIn(userId);
    } catch (e) {
      console.warn('[RC] logIn during init:', e.message);
    }
  }
}

// ─── User identity ────────────────────────────────────────────────────────────

/**
 * Link RC to your Supabase user so subscription state follows the account
 * across devices and reinstalls. Call when auth state changes to signed-in.
 */
export async function identifyRCUser(userId) {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    return customerInfo;
  } catch (e) {
    console.warn('[RC] identifyRCUser:', e.message);
    return null;
  }
}

/**
 * Reset RC to anonymous. Call on sign-out so the next user starts clean.
 */
export async function resetRCUser() {
  try {
    await Purchases.logOut();
  } catch (e) {
    // logOut throws if already anonymous — safe to ignore
    if (!e.message?.includes('anonymous')) {
      console.warn('[RC] resetRCUser:', e.message);
    }
  }
}

// ─── Entitlement checks ───────────────────────────────────────────────────────

/**
 * Returns true if the current user has an active "Healthy Choices Pro"
 * entitlement. Uses the local cache — near-instant, no network required.
 */
export async function getProStatus() {
  try {
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    console.warn('[RC] getProStatus:', e.message);
    return false;
  }
}

/**
 * Returns the full CustomerInfo object, or null on error.
 * Useful for displaying subscription details (expiry date, product, etc.).
 */
export async function getCustomerInfo() {
  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
}

// ─── Offerings ────────────────────────────────────────────────────────────────

/**
 * Returns the current RC Offering (the set of packages shown to the user),
 * or null on error.
 *
 * Each offering.availablePackages entry has:
 *   .identifier      — e.g. "$rc_monthly", "$rc_annual", or your custom ID
 *   .packageType     — PACKAGE_TYPE.MONTHLY / ANNUAL / etc.
 *   .product.priceString  — localized price, e.g. "$3.99"
 *   .product.introPrice   — intro/trial details (if set in App Store Connect)
 */
export async function getCurrentOffering() {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch (e) {
    console.warn('[RC] getOfferings:', e.message);
    return null;
  }
}

/**
 * Extract the yearly and monthly packages from an Offering.
 * Matches by PACKAGE_TYPE first, then falls back to identifier substring.
 */
export function extractPackages(offering) {
  if (!offering) return { yearly: null, monthly: null };

  const pkgs = offering.availablePackages;

  const yearly = pkgs.find(
    (p) =>
      p.packageType === PACKAGE_TYPE.ANNUAL ||
      p.identifier.toLowerCase().includes('year') ||
      p.identifier === '$rc_annual'
  ) ?? null;

  const monthly = pkgs.find(
    (p) =>
      p.packageType === PACKAGE_TYPE.MONTHLY ||
      p.identifier.toLowerCase().includes('month') ||
      p.identifier === '$rc_monthly'
  ) ?? null;

  return { yearly, monthly };
}

// ─── Purchasing ───────────────────────────────────────────────────────────────

/**
 * Purchase a specific RC Package object.
 * Returns true if "Healthy Choices Pro" is now active.
 *
 * THROWS on failure — catch in the UI layer.
 * Check e.userCancelled === true to detect user backing out (no error toast needed).
 */
export async function purchaseRCPackage(rcPackage) {
  const { customerInfo } = await Purchases.purchasePackage(rcPackage);
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

/**
 * Restore previous purchases (e.g. after reinstall or new device).
 * Returns true if Pro entitlement was recovered.
 */
export async function restorePurchases() {
  try {
    const info = await Purchases.restorePurchases();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    console.warn('[RC] restorePurchases:', e.message);
    return false;
  }
}

// ─── React hook ───────────────────────────────────────────────────────────────

/**
 * useProStatus()
 * Subscribes to live CustomerInfo updates — re-renders automatically
 * when a purchase completes, a subscription renews, or it expires.
 *
 * Returns { isPro: boolean, loading: boolean, refresh: () => void }
 */
export function useProStatus() {
  const [isPro,   setIsPro]   = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const status = await getProStatus();
    setIsPro(status);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    // RC fires this listener whenever subscription state changes:
    // purchase, renewal, cancellation, grace period, etc.
    const remove = Purchases.addCustomerInfoUpdateListener((info) => {
      setIsPro(info.entitlements.active[ENTITLEMENT_ID] !== undefined);
      setLoading(false);
    });

    return () => remove();
  }, [refresh]);

  return { isPro, loading, refresh };
}

// ─── Feature gate config ──────────────────────────────────────────────────────

export const PRO_FEATURES = {
  share: {
    icon:  'share-social-outline',
    title: 'Share Product Scores',
    desc:  'Send product health scores to friends and family.',
  },
  search: {
    icon:  'search-outline',
    title: 'Search Products',
    desc:  'Look up any product by name without scanning.',
  },
  company: {
    icon:  'business-outline',
    title: 'Company Transparency',
    desc:  'See lobbying spend, political donations, and controversies behind every brand.',
  },
  history: {
    icon:  'time-outline',
    title: 'Full Scan History',
    desc:  'Access your complete scan history beyond the last 5 products.',
  },
};
