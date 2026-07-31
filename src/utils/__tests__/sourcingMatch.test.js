/**
 * Tests for src/utils/sourcingMatch.js — pure product-to-sourcing-evidence
 * matching (no RN dependency).
 *
 * Uses REAL `sourcing` records pulled straight from src/data/companies.js
 * (vital-farms, egglands-best) rather than fixtures, so a future edit to
 * that data that breaks scope-matching assumptions here shows up as a
 * failing test.
 */

import { detectHousingTier, matchSourcingToProduct, isEggsHousingEligible, getComparisonBaseline, detectMeatSpecies } from '../sourcingMatch';
import { COMPANY_DB } from '../../data/companies';

const vitalFarmsSourcing = COMPANY_DB['vital-farms'].sourcing;
const egglandsBestSourcing = COMPANY_DB['egglands-best'].sourcing;

describe('detectHousingTier', () => {
  test('detects pasture-raised (hyphenated)', () => {
    expect(detectHousingTier('Vital Farms Pasture-Raised Large Grade A Eggs')).toBe('pasture-raised');
  });

  test('detects pasture-raised even when "organic" is also present (pasture beats organic-alone)', () => {
    expect(detectHousingTier('Vital Farms Organic Pasture-Raised Extra Large Eggs')).toBe('pasture-raised');
  });

  test('detects free-range', () => {
    expect(detectHousingTier("Pete & Gerry's Organic Free-Range Eggs Large")).toBe('free-range');
  });

  test('detects cage-free', () => {
    expect(detectHousingTier('Simple Truth Natural Cage Free Large Brown Eggs')).toBe('cage-free');
  });

  test('detects cage-free with the space-separated spelling', () => {
    expect(detectHousingTier("Eggland's Best Cage Free Large Brown Eggs")).toBe('cage-free');
  });

  test('detects organic-alone (no housing claim on the carton)', () => {
    expect(detectHousingTier("Eggland's Best Organic Large Brown Eggs")).toBe('organic');
  });

  test('falls back to conventional when no claim is present', () => {
    expect(detectHousingTier('Kroger Grade A Large White Eggs')).toBe('conventional');
    expect(detectHousingTier("Eggland's Best Classic Large White Eggs Grade A")).toBe('conventional');
  });

  test('handles missing/empty name without throwing', () => {
    expect(detectHousingTier(undefined)).toBe('conventional');
    expect(detectHousingTier('')).toBe('conventional');
  });

  test('is case-insensitive', () => {
    expect(detectHousingTier('VITAL FARMS PASTURE-RAISED LARGE EGGS')).toBe('pasture-raised');
  });
});

describe('matchSourcingToProduct — Vital Farms (real data)', () => {
  test('an organic pasture-raised SKU matches the organic-line scorecard and gets spacePerAnimal', () => {
    const productName = 'Vital Farms Organic Pasture-Raised Extra Large Eggs';
    const tier = detectHousingTier(productName);
    expect(tier).toBe('pasture-raised');

    const result = matchSourcingToProduct(vitalFarmsSourcing, tier, productName);

    expect(result.scorecard).not.toBeNull();
    expect(result.scorecard.ratedLine).toBe('Vital Farms Organic');
    expect(result.scorecard.appliesTo).toBe('organic-line');
    expect(result.scorecard.spacePerAnimal).toEqual(expect.stringContaining('108.9 sq ft/hen'));
  });

  test('a non-organic pasture-raised SKU (this exact real catalog SKU) does NOT get the organic-line scorecard', () => {
    const productName = 'Vital Farms Pasture-Raised Large Grade A Eggs';
    const tier = detectHousingTier(productName);
    expect(tier).toBe('pasture-raised');

    const result = matchSourcingToProduct(vitalFarmsSourcing, tier, productName);

    expect(result.scorecard).toBeNull();
  });

  test('housingLabel reflects the DETECTED tier, not company.sourcing.welfare.housing', () => {
    // Vital Farms' company-wide welfare.housing is 'pasture-raised' already,
    // so this doesn't distinguish much on its own — the real assertion is
    // that a conventional-tier detection never inherits the company-wide
    // label; see the Eggland's Best conventional case below.
    const result = matchSourcingToProduct(vitalFarmsSourcing, 'pasture-raised', 'Vital Farms Pasture-Raised Large Grade A Eggs');
    expect(result.housingLabel).toBe('Pasture-Raised');
  });
});

describe("matchSourcingToProduct — Eggland's Best (real data)", () => {
  test('the flagship conventional product does NOT show the Certified Humane certification', () => {
    const productName = "Eggland's Best Classic Large White Eggs Grade A";
    const tier = detectHousingTier(productName);
    expect(tier).toBe('conventional');

    const result = matchSourcingToProduct(egglandsBestSourcing, tier, productName);

    expect(result.certifications).toHaveLength(0);
    expect(result.housingLabel).toBe('Conventional / Caged');
  });

  test('the flagship conventional product does NOT get the organic-line scorecard', () => {
    const productName = "Eggland's Best Classic Large White Eggs Grade A";
    const tier = detectHousingTier(productName);

    const result = matchSourcingToProduct(egglandsBestSourcing, tier, productName);

    expect(result.scorecard).toBeNull();
  });

  test('an organic-line SKU gets the organic-line SCORECARD but NOT the Certified Humane cert (its scope names only free-range/pasture-raised as an exhaustive "only" list — organic is never named)', () => {
    const productName = "Eggland's Best Organic Large Brown Eggs";
    const tier = detectHousingTier(productName);
    expect(tier).toBe('organic');

    const result = matchSourcingToProduct(egglandsBestSourcing, tier, productName);

    // These are independently-sourced facts, not a contradiction: the
    // Cornucopia scorecard rates the organic line directly (that's what an
    // "Organic Egg Scorecard" does); the Certified Humane cert is a
    // separate certification whose own scope text is exhaustive
    // ("...lines only") and simply never names organic as covered.
    expect(result.certifications).toHaveLength(0);
    expect(result.scorecard).not.toBeNull();
    expect(result.scorecard.appliesTo).toBe('organic-line');
    expect(result.scorecard.spacePerAnimal).toEqual(expect.stringContaining('1.2 sq ft'));
  });

  test('a free-range SKU (named in the "only" list) DOES surface the Certified Humane certification', () => {
    const productName = "Eggland's Best Free Range Large Brown Eggs";
    const tier = detectHousingTier(productName);
    expect(tier).toBe('free-range');

    const result = matchSourcingToProduct(egglandsBestSourcing, tier, productName);

    expect(result.certifications).toHaveLength(1);
    expect(result.certifications[0].name).toBe('Certified Humane');
  });

  test('a cage-free SKU does not match the organic-line scorecard (name has no "organic")', () => {
    const productName = "Eggland's Best Cage Free Large Brown Eggs";
    const tier = detectHousingTier(productName);
    expect(tier).toBe('cage-free');

    const result = matchSourcingToProduct(egglandsBestSourcing, tier, productName);

    expect(result.scorecard).toBeNull();
  });
});

describe('matchSourcingToProduct — safety/edge cases', () => {
  test('returns scorecard: null (never "nearest") and empty certifications when sourcing is missing', () => {
    const result = matchSourcingToProduct(null, 'pasture-raised', 'Some Product Pasture-Raised Eggs');
    expect(result.scorecard).toBeNull();
    expect(result.certifications).toEqual([]);
    expect(result.housingLabel).toBe('Pasture-Raised');
  });

  test('omitting productName fails conservatively (no organic-line match), not by over-matching', () => {
    const result = matchSourcingToProduct(vitalFarmsSourcing, 'pasture-raised');
    expect(result.scorecard).toBeNull();
  });

  test('unknown tier falls back to the conventional label rather than throwing', () => {
    const result = matchSourcingToProduct(vitalFarmsSourcing, 'not-a-real-tier', '');
    expect(result.housingLabel).toBe('Conventional / Caged');
  });
});

describe('matchSourcingToProduct — genericStandard (product/tier-based, no company required)', () => {
  test('a completely unresolved product (no company, no sourcing) still gets a generic tier standard', () => {
    const productName = 'Some Random Brand Free Range Large Eggs';
    const tier = detectHousingTier(productName);
    const result = matchSourcingToProduct(null, tier, productName);

    expect(result.genericStandard).not.toBeNull();
    expect(result.genericStandard.spacePerAnimal).toEqual(expect.stringContaining('2 sq ft'));
  });

  test('conventional (no claim on the carton) still gets a generic industry standard', () => {
    const result = matchSourcingToProduct(null, 'conventional', 'Some Brand Grade A Large Eggs');
    expect(result.genericStandard.spacePerAnimal).toEqual(expect.stringContaining('67 sq in'));
  });

  test('pasture-raised generic standard matches the Certified Humane figure', () => {
    const result = matchSourcingToProduct(null, 'pasture-raised', 'Some Brand Pasture-Raised Eggs');
    expect(result.genericStandard.spacePerAnimal).toEqual(expect.stringContaining('108 sq ft'));
  });

  test('organic has no fabricated generic figure (never-fabricate rule — left unset, not guessed)', () => {
    const result = matchSourcingToProduct(null, 'organic', 'Some Brand Organic Eggs');
    expect(result.genericStandard).toBeNull();
  });

  test('a real per-brand scorecard figure is still returned alongside genericStandard (caller prefers the specific one)', () => {
    const productName = 'Vital Farms Organic Pasture-Raised Extra Large Eggs';
    const tier = detectHousingTier(productName);
    const result = matchSourcingToProduct(vitalFarmsSourcing, tier, productName);

    expect(result.scorecard.spacePerAnimal).toEqual(expect.stringContaining('108.9 sq ft/hen'));
    expect(result.genericStandard.spacePerAnimal).toEqual(expect.stringContaining('108 sq ft'));
  });
});

describe('getComparisonBaseline — reference point shown alongside a per-brand figure', () => {
  test('non-organic tiers compare against their own generic standard', () => {
    expect(getComparisonBaseline('pasture-raised').spacePerAnimal).toEqual(expect.stringContaining('108 sq ft'));
    expect(getComparisonBaseline('cage-free').spacePerAnimal).toEqual(expect.stringContaining('1.5 sq ft'));
    expect(getComparisonBaseline('conventional').spacePerAnimal).toEqual(expect.stringContaining('67 sq in'));
  });

  test('organic has no standard of its own — falls back to the cage-free regulatory floor, clearly noted as such', () => {
    const baseline = getComparisonBaseline('organic');
    expect(baseline.spacePerAnimal).toEqual(expect.stringContaining('1.5 sq ft'));
    expect(baseline.note).toEqual(expect.stringContaining('organic'));
  });

  test('a real-data case: Eggland\'s Best organic-line per-brand figure (1.2 sq ft) falls short of the cage-free floor it must clear', () => {
    const productName = "Eggland's Best Organic Large Brown Eggs";
    const tier = detectHousingTier(productName);
    const result = matchSourcingToProduct(egglandsBestSourcing, tier, productName);
    const baseline = getComparisonBaseline(tier);

    expect(result.scorecard.spacePerAnimal).toEqual(expect.stringContaining('1.2 sq ft'));
    expect(baseline.spacePerAnimal).toEqual(expect.stringContaining('1.5 sq ft'));
  });

  test('a real-data case: Vital Farms organic-pasture per-brand figure (108.9 sq ft) tracks its own certified standard (108 sq ft) closely', () => {
    const productName = 'Vital Farms Organic Pasture-Raised Extra Large Eggs';
    const tier = detectHousingTier(productName);
    const result = matchSourcingToProduct(vitalFarmsSourcing, tier, productName);
    const baseline = getComparisonBaseline(tier);

    expect(result.scorecard.spacePerAnimal).toEqual(expect.stringContaining('108.9 sq ft'));
    expect(baseline.spacePerAnimal).toEqual(expect.stringContaining('108 sq ft'));
  });
});

describe('isEggsHousingEligible', () => {
  test('true for a real egg product', () => {
    expect(isEggsHousingEligible({ category: 'Eggs', name: 'Kroger Grade A Large White Eggs' })).toBe(true);
  });

  test('false for a non-Eggs category', () => {
    expect(isEggsHousingEligible({ category: 'Dairy', name: 'Some Milk' })).toBe(false);
  });

  test('false for a plant-based egg substitute even though it is catalogued under Eggs', () => {
    expect(isEggsHousingEligible({ category: 'Eggs', name: 'JUST Egg Plant-Based Egg' })).toBe(false);
  });

  test('handles missing product without throwing', () => {
    expect(isEggsHousingEligible(undefined)).toBe(false);
    expect(isEggsHousingEligible(null)).toBe(false);
  });
});

describe('detectMeatSpecies', () => {
  test('explicit species word wins', () => {
    expect(detectMeatSpecies('Oscar Mayer Turkey Bologna')).toBe('poultry');
    expect(detectMeatSpecies('Grilled Chicken Breast Strips')).toBe('poultry');
    expect(detectMeatSpecies('All Natural Uncured Beef Franks')).toBe('beef');
    expect(detectMeatSpecies('Angus beef franks')).toBe('beef');
  });

  test('explicit species word overrides a pork-format word (real catalog cases)', () => {
    expect(detectMeatSpecies('BEEF SMOKED SAUSAGE')).toBe('beef');
    expect(detectMeatSpecies('BEEF POLSKA KIELBASA')).toBe('beef');
    expect(detectMeatSpecies('Turkey Polska Kielbasa')).toBe('poultry');
    expect(detectMeatSpecies('Italian Style Smoked Chicken Sausage with Mozzarella Cheese')).toBe('poultry');
  });

  test('pork-format words default to pork only when no explicit species word is present', () => {
    expect(detectMeatSpecies('Original Bratwurst')).toBe('pork');
    expect(detectMeatSpecies('Smoked Sausage Rope')).toBe('pork');
    expect(detectMeatSpecies('Natural Choice Honey Deli Ham')).toBe('pork');
  });

  test('genuinely mixed-species names are unknown, not guessed', () => {
    expect(detectMeatSpecies('Franks made with chicken and pork')).toBe('unknown');
  });

  test('a name with no species signal at all is unknown', () => {
    expect(detectMeatSpecies('Dino Nuggets')).toBe('unknown');
  });

  test('handles missing/empty name without throwing', () => {
    expect(detectMeatSpecies(undefined)).toBe('unknown');
    expect(detectMeatSpecies('')).toBe('unknown');
  });
});
