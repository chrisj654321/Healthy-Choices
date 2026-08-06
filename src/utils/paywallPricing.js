/**
 * paywallPricing.js
 * Pure pricing helpers shared by PaywallContent and OfferContent — no React,
 * no navigation. Every displayed price is derived from a real RevenueCat
 * `product`/`introPrice`; the FALLBACK_* constants below are display-only
 * stand-ins shown while RC offerings are still loading (or unavailable),
 * never an invented number. They mirror the real configured offer: a 3-day
 * free trial on yearly only ($49.99/yr after trial), monthly at $7.99/mo
 * flat, no trial. (Changed 2026-07-24 — the prior 50%-off-first-year intro
 * offer was replaced after an Apple 3.1.2(c) rejection: the calculated
 * per-month price was shown more prominently than the real billed amount.
 * See FALLBACK_TRIAL_FINE and computeYearlySavings below.)
 */

// ─── Fallback prices (shown before RC offerings load) ──────────────────────

export const FALLBACK_PRICES = {
  yearly:  { price: '$49.99', period: '/year',  monthlyBig: '$4.17/mo' },
  monthly: { price: '$7.99',  period: '/month', monthlyBig: '$7.99/mo' },
};

// Shown until RC's real introPrice (the 3-day trial) loads. Must always
// read "<duration> free, then <billed amount><period>" per Apple's free-
// trial disclosure requirement — never just a price.
export const FALLBACK_TRIAL_FINE = '3 Days Free, then $49.99/year';
export const FALLBACK_SAVE_PCT_VS_MONTHLY = 48;

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Builds a localized "$X.XX/mo" string from an annual price. */
export function monthlyEquiv(annualPrice, currencyCode) {
  try {
    const monthly = (annualPrice / 12).toFixed(2);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode ?? 'USD' })
      .format(monthly) + '/mo';
  } catch {
    return null;
  }
}

/**
 * Build intro-offer copy from a confirmed App Store Connect introductory
 * price. Handles BOTH a free trial (price 0) and a discounted intro (e.g.
 * 50% off the first year). Returns null when there is no intro offer, so
 * the copy can never advertise an offer the store doesn't actually have.
 * `periodLabel` is the display suffix for the plan (e.g. '/year').
 */
export function introOffer(pkg, periodLabel) {
  const introPrice = pkg?.product?.introPrice;
  if (!introPrice) return null;
  const n = introPrice.periodNumberOfUnits;
  const unit = (introPrice.periodUnit || '').toLowerCase();
  if (!n || !unit) return null;
  const regular = pkg.product.priceString;

  // Total length of the intro = unit × count × number of billing cycles. This lets a
  // monthly plan whose intro runs 12 cycles read as "first year" (not "first month").
  const cycles = introPrice.cycles ?? introPrice.numberOfPeriods ?? 1;
  const unitMonths = { day: 1 / 30, week: 0.25, month: 1, year: 12 }[unit] || 1;
  const totalMonths = unitMonths * n * cycles;
  const spanLabel =
    totalMonths >= 11.5 && totalMonths < 23 ? 'year'
    : totalMonths >= 23 ? `${Math.round(totalMonths / 12)} years`
    : totalMonths >= 1.5 ? `${Math.round(totalMonths)} months`
    : n > 1 ? `${n} ${unit}s` : unit;

  // Free trial
  if (introPrice.price === 0) {
    const unitLabel = unit.charAt(0).toUpperCase() + unit.slice(1) + (n > 1 ? 's' : '');
    const label = `${n} ${unitLabel} Free`;
    return { pill: label, cta: `Start ${label}`, fine: `${label}, then ${regular}${periodLabel || ''}` };
  }

  // Discounted intro (e.g. 50% off the first year — on either the monthly or yearly plan)
  const introStr = introPrice.priceString || `$${Number(introPrice.price).toFixed(2)}`;
  const full = pkg.product.price;
  let pill = `Intro ${introStr}`;
  if (full > 0 && introPrice.price < full) {
    const pct = Math.round((1 - introPrice.price / full) * 100);
    if (pct > 0) pill = `${pct}% off first ${spanLabel}`;
  }
  // A multi-cycle intro (e.g. monthly at 50% off for 12 months) charges per period, so
  // show the period suffix. A single-period intro (a year paid up front) already covers it.
  const introPer = cycles > 1 && periodLabel ? periodLabel : '';
  return {
    pill,
    cta: 'Claim offer',
    fine: `${introStr}${introPer} for your first ${spanLabel}, then ${regular}${periodLabel || ''}`,
  };
}

/**
 * Exit-offer (OfferContent) pricing — the real yearly billed amount, its
 * per-month breakdown, and an honest savings-vs-monthly percentage (yearly
 * price vs. 12x the monthly price). No discount/strike-through math here —
 * the yearly price IS the price, trial or not. Every number is a real
 * comparison, never a fabricated "was/now".
 */
export function computeYearlySavings(yearlyPkg, monthlyPkg) {
  const yearlyProduct = yearlyPkg?.product;
  const yearlyPrice = yearlyProduct?.priceString ?? FALLBACK_PRICES.yearly.price;
  const yearlyNumeric = yearlyProduct?.price ?? 49.99;

  const monthlyEquivPrice = yearlyProduct
    ? (monthlyEquiv(yearlyProduct.price, yearlyProduct.currencyCode) ?? FALLBACK_PRICES.yearly.monthlyBig)
    : FALLBACK_PRICES.yearly.monthlyBig;

  const monthlyPlanPrice = monthlyPkg?.product?.priceString ?? FALLBACK_PRICES.monthly.price;
  const monthlyNumeric = monthlyPkg?.product?.price ?? 7.99;

  const yearOfMonthly = monthlyNumeric * 12;
  const savePctVsMonthly = yearOfMonthly > 0
    ? Math.round((1 - yearlyNumeric / yearOfMonthly) * 100)
    : FALLBACK_SAVE_PCT_VS_MONTHLY;

  return { yearlyPrice, monthlyEquivPrice, monthlyPlanPrice, savePctVsMonthly };
}
