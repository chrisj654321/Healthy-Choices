/**
 * paywallPricing.js
 * Pure pricing helpers shared by PaywallContent and OfferContent — no React,
 * no navigation. Every displayed price is derived from a real RevenueCat
 * `product`/`introPrice`; the FALLBACK_* constants below are display-only
 * stand-ins shown while RC offerings are still loading (or unavailable),
 * never an invented discount. They mirror the real configured intro offer
 * (50% off the first year: $49.99 -> $24.99, i.e. ~$2.08/mo).
 */

// ─── Fallback prices (shown before RC offerings load) ──────────────────────

export const FALLBACK_PRICES = {
  yearly:  { price: '$49.99', period: '/year',  monthlyBig: '$4.17/mo', savePct: 48 },
  monthly: { price: '$7.99',  period: '/month', monthlyBig: '$7.99/mo', savePct: null },
};

// Exit-offer fallback — used only until RC's real introPrice loads.
export const OFFER_FALLBACK = {
  standardPrice: '$49.99',
  introPrice:    '$24.99',
  introMonthly:  '$2.08/mo',
};

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
 * Exit-offer (OfferContent) pricing — strike-through standard price -> real
 * configured intro price, expressed per-month, plus savings vs. paying full
 * price monthly for a year. Only trusts a real RC introPrice that is
 * actually cheaper than the standard price; otherwise falls back to the
 * OFFER_FALLBACK constants (which match the real configured offer) so the
 * screen never shows a blank price while RC is still loading.
 */
export function computeOfferPricing(yearlyPkg, monthlyPkg) {
  const product = yearlyPkg?.product;
  const introPrice = product?.introPrice;
  const hasRealIntro = !!(product && introPrice && introPrice.price > 0 && introPrice.price < product.price);

  const standardPrice = product?.priceString ?? OFFER_FALLBACK.standardPrice;
  const introPriceStr = hasRealIntro
    ? (introPrice.priceString || `$${Number(introPrice.price).toFixed(2)}`)
    : OFFER_FALLBACK.introPrice;
  const introMonthly = hasRealIntro
    ? (monthlyEquiv(introPrice.price, product.currencyCode) ?? OFFER_FALLBACK.introMonthly)
    : OFFER_FALLBACK.introMonthly;
  const monthlyPlanPrice = monthlyPkg?.product?.priceString ?? FALLBACK_PRICES.monthly.price;

  // Savings vs. the real standard yearly price (Apple's own intro-offer framing).
  const introNumeric = hasRealIntro ? introPrice.price : 24.99;
  const standardNumeric = hasRealIntro ? product.price : 49.99;
  const savePctVsStandard = standardNumeric > 0
    ? Math.round((1 - introNumeric / standardNumeric) * 100)
    : null;

  // Savings vs. paying full price monthly for a year (12x the monthly price).
  const monthlyNumeric = monthlyPkg?.product?.price ?? 7.99;
  const yearOfMonthly = monthlyNumeric * 12;
  const savePctVsMonthly = yearOfMonthly > 0
    ? Math.round((1 - introNumeric / yearOfMonthly) * 100)
    : null;

  return {
    standardPrice,
    introPrice: introPriceStr,
    introMonthly,
    monthlyPlanPrice,
    savePctVsStandard,
    savePctVsMonthly,
    fromRC: hasRealIntro,
  };
}
