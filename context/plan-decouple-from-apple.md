# Plan: decouple releases from Apple review

**Founder goal (2026-08-05):** Apple review turnaround has become unacceptably long. Use Apple/EAS builds ONLY for genuine native changes; move everything else to lanes we control.

## The three delivery lanes

| Lane | Speed | Carries |
|---|---|---|
| EAS build + Apple review | days–weeks | Native modules, permissions, icon/name, Expo SDK bumps |
| OTA (`expo-updates`) | minutes | All JS: screens, logic, scorer, layout, copy |
| Server data (Supabase) | instant | Catalog, company data, config, paywall content |

**Rule of thumb:** if it's JavaScript or data, it must never require an Apple build.

## Established facts (verified 2026-08-05, not assumed)

- `expo-updates@56.0.22` is installed and wired (added 2026-07-22). **But OTA can only reach a binary that already ships the update engine — the first such build is 1.2.0, currently rejected/unapproved. Phase 0 is therefore a hard prerequisite for every other lane.**
- `react-native-purchases@10.2.2` + `react-native-purchases-ui@10.2.2` have been in `package.json` since **2026-06-06** — i.e. before the first App Store approval (2026-07-06) — and `RevenueCatUI.presentCustomerCenter()` is already called live in `ProfileScreen.js`. **The RC UI native module is therefore present in every shipped binary**, so RC paywall surfaces can be driven from JS via OTA with no new build.
- RC **single-page** remote paywalls require SDK ≥ 8.11.3 → we qualify at 10.2.2. ✅
- RC **multipage** remote paywalls require SDK ≥ 10.6.0 → we do NOT qualify at 10.2.2. ❌ Adopting them means a native version bump = an Apple build. This is what rules out full RC-rendered paywalls for our two-screen (paywall → exit-offer) flow in the near term.
- The product catalog already bypasses Apple entirely: `products.db` is downloaded at runtime from Supabase Storage (`productStore.js`). Its weakness is that `DB_VERSION` is a hardcoded constant, so announcing a new catalog still needs a JS change.

## Phases

### Phase 0 — Approve a build carrying `expo-updates` (FOUNDER, blocking)
Resubmit the 3.1.2(c)-fixed 1.2.0 build. Until an OTA-capable binary is live, Phases 1–4 can be *built* but cannot *reach users* without another build. Everything downstream unblocks the moment this is approved.

### Phase 1 — Remote-controlled paywall content (hybrid)
**Decision: keep our custom paywall layout in code; drive its mutable content from the RevenueCat Offering `metadata` JSON, editable in the RC dashboard with no build and no OTA.**

Rejected alternative — full RC-rendered paywalls (`RevenueCatUI.presentPaywall()`) — for two concrete reasons:
1. Our founder-designed two-screen flow (main paywall → dismiss → exit offer) needs RC *multipage*, which needs SDK 10.6.0 and therefore a native build. It would defeat the point.
2. We were just rejected under **3.1.2(c)** for paywall price prominence. Layout rules that live in code cannot be accidentally broken from a dashboard by someone editing copy. Keeping the compliance-critical layout in code and only the copy/products remote is the safer split of powers.

What becomes remotely editable: headline/subhead per trigger, feature-list rows, badge and CTA copy, and which products/offering are shown. What stays locked in code: price prominence hierarchy, trial disclosure rendering, legal links.

### Phase 2 — Remote catalog manifest + remote config
Replace the hardcoded `DB_VERSION` with a small JSON manifest fetched from Supabase (`{ dbVersion, dbUrl }`), so shipping a new catalog is an upload plus a manifest edit — no code at all. Same fetch carries a general remote-config/feature-flag payload (kill switches, free-scan limit, feature toggles) with safe in-code defaults for offline/failure.

### Phase 3 — Move remaining bundled data server-side
`companies.js`, `ingredientCache.js` (~700KB, already flagged in backlog), the spotlight rotation list, and featured-product barcodes are frozen into the JS bundle today. Fold them into the downloadable SQLite DB so company/sourcing research reaches users same-day. Biggest win for the sourcing-transparency pipeline.

### Phase 4 — Native-change discipline
Keep a written list of what genuinely requires a build, batch such changes, and treat each native build as an OTA baseline reset (OTA only reaches matching binary versions).

## Guardrails

- **The scorer stays on-device.** Moving scoring server-side would break offline scanning and cut against the no-tracking posture. OTA already covers scorer changes.
- **Every remote surface needs a safe default.** If Supabase is unreachable, the app must fall back to bundled values, never a blank screen. `productStore.js`'s existing "never throw, degrade to null" contract is the model.
- **Paywall compliance checklist** must be run against any RC dashboard edit: billed amount most prominent; trial duration + post-trial price disclosed; breakdown/savings subordinate in size and position.
- **Never fabricate a price.** Remote content must never assert an offer the store isn't actually configured to sell (see the 2026-08-05 discount→trial migration).
