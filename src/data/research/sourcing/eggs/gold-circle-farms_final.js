// src/data/research/sourcing/eggs/gold-circle-farms_final.js
module.exports = {
  companyId: 'gold-circle-farms',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    // Gold Circle Farms is, per convergent secondary sourcing, a brand
    // marketed by Luberski, Inc. (dba Hidden Villa Ranch), Fullerton, CA —
    // but no primary corporate/trademark filing tying "Gold Circle Farms"
    // specifically to Luberski was successfully loaded, and how eggs sold
    // under this label are actually sourced was not confirmed. Left unknown
    // rather than guessed.
    model: 'unknown',

    // Certified Humane / GAP / AWA-AGW could not be queried for Gold Circle
    // Farms, Hidden Villa Ranch, or Luberski Inc. (interactive directories,
    // not independently checkable) — no certification confirmed.
    certifications: [],

    welfare: {
      // No source specifically confirms a housing system for Gold Circle
      // Farms eggs.
      housing: 'unknown',

      // Cornucopia's only relevant score is for "Hidden Villa Ranch" as a
      // parent/corporate entity (0/1700, 1-star) — Gold Circle Farms is not
      // named anywhere on that page, and no separate Gold-Circle-specific
      // Cornucopia entry exists. Omitted here rather than misattributed.
      scorecards: [],
    },

    // A 2015 San Diego City Attorney settlement against Luberski, Inc. (dba
    // Hidden Villa Ranch) over "California Ranch Fresh" mislabeling exists,
    // but is deliberately NOT recorded here: (a) it concerns a separate
    // private-label line, not Gold Circle Farms eggs specifically, and (b)
    // this same file's `model` is 'unknown' precisely because no primary
    // source confirms Gold Circle Farms is even a Luberski/Hidden Villa Ranch
    // brand — recording the settlement here would assert the very corporate
    // link this record says it cannot confirm. If a future pass verifies
    // that link, this belongs on a Hidden Villa Ranch / Luberski company
    // record, not this one.
    enforcement: [],

    practices: [],
  },
};
