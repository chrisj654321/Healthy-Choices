/**
 * Tests for src/utils/paywallPricing.js — the pure pricing/trial-copy
 * helpers shared by PaywallContent and OfferContent.
 *
 * Added alongside the "$0 today" prominence change (2026-08-19): the new
 * badge is purely additive UI (see PaywallContent.js / OfferContent.js). The
 * hard compliance rule is that the REAL billed amount stays visible in the
 * trial disclosure text produced here — Apple rejected v1.2.0 under 3.1.2(c)
 * for hiding it. These tests pin that the disclosure string always reads
 * "<duration> Free, then <billed amount><period>" and never collapses to a
 * bare "$0".
 */
import { introOffer, FALLBACK_TRIAL_FINE, FALLBACK_PRICES, monthlyEquiv } from '../paywallPricing';

describe('FALLBACK_TRIAL_FINE — shown before RC loads, must disclose the real billed amount', () => {
  test('reads "<n> Days Free, then <price>/year" — duration AND billed amount both present', () => {
    expect(FALLBACK_TRIAL_FINE).toMatch(/^\d+ Days Free, then \$\d+\.\d{2}\/year$/);
  });

  test('never collapses to just "$0" or a bare zero-cost claim', () => {
    expect(FALLBACK_TRIAL_FINE).not.toBe('$0');
    expect(FALLBACK_TRIAL_FINE.toLowerCase()).not.toContain('$0 today');
    expect(FALLBACK_TRIAL_FINE.toLowerCase()).not.toContain('free today');
  });
});

describe('introOffer — free trial branch (RC introPrice.price === 0)', () => {
  const trialPkg = {
    product: {
      priceString: '$49.99',
      price: 49.99,
      introPrice: { price: 0, periodNumberOfUnits: 3, periodUnit: 'DAY', cycles: 1 },
    },
  };

  test('fine string discloses the trial duration AND the real billed amount — never just the trial', () => {
    const offer = introOffer(trialPkg, '/year');
    expect(offer.fine).toBe('3 Days Free, then $49.99/year');
    // The billed amount must survive as its own substring — a future edit
    // that drops it (e.g. to make room for a "$0 today" badge) must fail here.
    expect(offer.fine).toContain('$49.99/year');
  });

  test('pill/cta read the trial framing, not the price — the price lives in `fine`', () => {
    const offer = introOffer(trialPkg, '/year');
    expect(offer.pill).toBe('3 Days Free');
    expect(offer.cta).toBe('Start 3 Days Free');
  });

  test('no introPrice on the package -> returns null (never fabricates an offer)', () => {
    expect(introOffer({ product: { priceString: '$49.99' } }, '/year')).toBeNull();
  });

  test('no package at all -> returns null, does not throw', () => {
    expect(() => introOffer(null, '/year')).not.toThrow();
    expect(introOffer(null, '/year')).toBeNull();
  });
});

describe('introOffer — discounted-intro branch still discloses the real billed amount', () => {
  test('multi-cycle discount fine string ends with the real regular price', () => {
    const pkg = {
      product: {
        priceString: '$7.99',
        price: 7.99,
        introPrice: {
          price: 3.99, priceString: '$3.99',
          periodNumberOfUnits: 1, periodUnit: 'MONTH', cycles: 12,
        },
      },
    };
    const offer = introOffer(pkg, '/month');
    expect(offer.fine).toContain('then $7.99/month');
  });
});

describe('FALLBACK_PRICES / monthlyEquiv — sanity, unaffected by the "$0 today" badge change', () => {
  test('yearly fallback price matches the fallback trial fine\'s billed amount', () => {
    expect(FALLBACK_TRIAL_FINE).toContain(FALLBACK_PRICES.yearly.price);
  });

  test('monthlyEquiv derives a per-month figure from an annual price', () => {
    expect(monthlyEquiv(49.99, 'USD')).toBe('$4.17/mo');
  });
});
