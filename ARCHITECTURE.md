# Healthy Choices — Architecture

A plain-language map of how the app is built. If you're new to coding, read this
top to bottom — each section builds on the last. For the *why* behind the product,
see [VISION.md](VISION.md).

---

## 1. What the app is built with (the tech stack)

Think of these as the building materials. Each one has a job.

| Tool | What it does, in plain words |
|------|------------------------------|
| **React Native** | The framework that lets us write the app once and run it on iPhone (and Android later). It's JavaScript, not Swift. |
| **Expo (SDK 56)** | A toolkit on top of React Native that handles the hard native stuff (camera, builds, fonts) so we don't have to. |
| **React Navigation** | Controls moving between screens — the tabs at the bottom and the back button. |
| **Supabase** | Our cloud backend. Handles user accounts, login (email, Apple, Google), and account deletion. |
| **RevenueCat** | Handles paid subscriptions and talks to Apple's payment system for us. |
| **Open Food Facts** | A free public food database we query over the internet when a barcode is scanned. |
| **EAS (Expo Application Services)** | The cloud service that compiles our code into a real `.ipa` app file and ships it to Apple. |

**Important mental model:** most of the app runs *on the phone itself*. The internet
is only used for three things: looking up a scanned product (Open Food Facts), logging
in (Supabase), and checking subscription status (RevenueCat). Everything else —
scoring, history, preferences — happens locally on the device.

---

## 2. The folder map

```
HealthyChoices/
├── index.js              ← The true entry point. Registers the app with the phone.
├── App.js                ← The root component. Sets up error handling + providers.
├── app.json              ← App config: name, icon, permissions, plugins.
├── eas.json              ← Build & submit settings for the cloud build service.
│
├── src/
│   ├── screens/          ← Full pages the user sees (one file = one screen)
│   ├── components/        ← Reusable UI pieces shared across screens
│   ├── navigation/        ← Defines the tabs and screen-to-screen flow
│   ├── context/           ← App-wide state (who is logged in)
│   ├── utils/             ← Logic helpers (scoring, parsing, storage, integrations)
│   ├── data/              ← The "brains": ingredient + company + product databases
│   └── constants/         ← Colors and fonts used everywhere
│
├── assets/               ← Icon, splash screen, images
├── plugins/              ← Custom build tweaks (withFmtFix.js)
├── scripts/              ← Offline tools to build the product database
├── supabase/             ← Cloud function code (account deletion)
└── web/                  ← The privacy policy & terms pages (a separate website)
```

---

## 3. The most important flow: what happens when you scan

This is the heart of the app. Follow the path:

```
1. User points camera at a barcode
        │
        ▼
2. ScannerScreen.js detects the barcode number
        │
        ▼
3. App asks Open Food Facts API over the internet:
   "What product is barcode 012000001628?"
        │
        ├── Found online ──┐
        │                  ▼
        │           productParser.js converts the messy API response
        │           into our clean internal shape (name, brand,
        │           ingredients[], nutrition{}, companyId, etc.)
        │
        └── Not found ─────┐
                           ▼
                    Look in our local PRODUCT_DB (products.js)
                    as a backup. If still nothing → "Product Not Found"
        │
        ▼
4. The clean product object is handed to ProductScoreScreen.js
        │
        ▼
5. scorer.js analyzes every ingredient and the nutrition,
   then produces a score (0–100) and a letter grade (A–F)
        │
        ▼
6. ProductScoreScreen displays the grade, the ingredient
   breakdown, warnings, and the company behind the brand
        │
        ▼
7. The scan is saved to local history (storage.js)
```

**Key idea:** the camera and the scoring don't talk to each other directly. The
barcode becomes a *product object*, and the product object becomes a *score*. Each
step has one job. This is why the app is easy to extend later.

---

## 4. The scoring engine (`src/utils/scorer.js`)

This is where a product becomes a grade. The logic is deliberately simple and
transparent (in keeping with the vision — no black boxes).

**How a score is built:**
- Every product **starts at 100 points**.
- Each risky **ingredient** subtracts points (based on its risk level × 2.5).
- Bad **nutrition** subtracts points (high sugar, sodium, saturated fat).
- **Certifications** (like USDA Organic) add a small bonus.
- The result is clamped between 0 and 100, then mapped to a letter:

| Score | Grade | Verdict |
|-------|-------|---------|
| 80–100 | A | Excellent |
| 65–79 | B | Good |
| 50–64 | C | Fair |
| 35–49 | D | Poor |
| 0–34 | F | Avoid |

**How each ingredient is judged** (the lookup order matters):
1. First check `INGREDIENT_DB` (the hand-curated, highest-quality list in `ingredients.js`).
2. If not found, check `CACHED_INGREDIENT_ANALYSIS` (the larger cache in `ingredientCache.js`).
3. If still not found, mark it **"unknown"** — no penalty, but shown honestly as unrecognized.

> That third case is the "unknown ingredient" gap. Growing the cache in step 2 is how
> we shrink it. (See the VISION — ideally *nothing* comes back unknown.)

`scorer.js` also produces the **plain-English explanation** ("This product scores poorly
mainly due to…") and the **personalized warnings** (allergens, diet conflicts, goal
notes) based on the user's saved preferences.

---

## 5. The data layer (`src/data/`) — the app's "brains"

These files are what make the app smart. They ship *inside* the app, so scoring works
even offline.

| File | What it holds |
|------|---------------|
| **ingredients.js** (`INGREDIENT_DB`) | The hand-curated, premium ingredient list with risk levels, categories, and notes. Checked first. |
| **ingredientCache.js** (`CACHED_INGREDIENT_ANALYSIS`) | The larger ~573-entry cache of ingredients with risk + plain-language explanations. Checked second. |
| **companies.js** (`COMPANY_DB`, `BRAND_TO_COMPANY`) | Who owns what. Maps a brand → parent company, plus lobbying spend, political donation splits, and controversies. Powers the "who you're funding" pillar. |
| **products.js** (`PRODUCT_DB`) | Barcode → product lookup. A few hand-curated products + (when present) the big generated catalog. |
| **products_generated.json** | A 221 MB auto-generated catalog of 135,775 products. **Not shipped** — it's excluded from the app so downloads stay small; the app uses the Open Food Facts API instead. |
| **preferences.js**, **stores.js** | Option lists for the Profile screen (diet styles, goals, store choices). |

---

## 6. Navigation (`src/navigation/AppNavigator.js`)

How the user moves through the app. There are three "gates" on launch:

```
App opens
   │
   ├─ Still loading auth/onboarding? → show spinner
   │
   ├─ First time ever? → OnboardingScreen
   │
   ├─ Not logged in? → AuthScreen (login required)
   │
   └─ Logged in → the main app (bottom tabs)
```

The **main app** has 4 bottom tabs, each containing its own mini-stack of screens:

- **Scan** → Scanner → ProductScore → CompanyProfile
- **Search** → ProductSearch → ProductScore → CompanyProfile
- **History** → ScanHistory → ProductScore → CompanyProfile
- **Profile** → (single screen)

The **Paywall** sits above all tabs at the "root" level, so any screen can open it.

---

## 7. Accounts & payments

**Login (`src/context/AuthContext.js` + `src/utils/supabase.js`):**
- `AuthContext` is the app-wide memory of "who is logged in." Any screen can ask it.
- Supabase handles the actual login (email/password, Sign in with Apple, Google).
- Login tokens are stored in the phone's **encrypted keychain** (`expo-secure-store`),
  not plain storage — more secure.

**Subscriptions (`src/utils/subscription.js`):**
- RevenueCat talks to Apple's payment system. We never touch credit card data.
- When a user logs in, we tell RevenueCat their account ID (`Purchases.logIn`) so their
  subscription follows them across devices.
- `useProStatus()` is a reusable hook any screen calls to ask "is this user Pro?"

**Account deletion (`supabase/functions/delete-account/index.ts`):**
- A small cloud function that permanently deletes a user's account when they tap
  "Delete Account." Required by Apple. Must be deployed to Supabase to work.

---

## 8. Local storage (`src/utils/storage.js`)

Things saved on the phone (via `AsyncStorage`), no internet needed:
- **Scan history** (last 100 scans)
- **User preferences** (diet flags, allergens, goals, favorite stores)
- **Onboarding completed?** flag
- **Daily scan count** — free users get 5 scans/day; this tracks and resets at midnight.

Every read is wrapped in error handling so a corrupted value can never crash the app.

---

## 9. How the app gets built and shipped

1. We write JavaScript in `src/`.
2. `eas build --platform ios --profile production` sends the code to Expo's cloud.
3. Expo compiles it into a real iOS app (`.ipa`), applying the config in `app.json`
   and the custom plugins in `plugins/`.
4. `eas submit` (or the build's auto-submit) uploads it to App Store Connect.
5. It appears in **TestFlight** for testing, then goes to **App Store review**.

`app.json` is the control panel for this: app name, icon, the camera permission text,
the splash screen, and which plugins run during the build.

---

## 10. Quick reference — "where do I find…?"

| I want to change… | Look in… |
|-------------------|----------|
| How a product is scored | `src/utils/scorer.js` |
| An ingredient's risk/description | `src/data/ingredientCache.js` or `ingredients.js` |
| Company ownership / lobbying data | `src/data/companies.js` |
| The paywall (prices, copy, buttons) | `src/screens/PaywallScreen.js` |
| The scan camera screen | `src/screens/ScannerScreen.js` |
| The score results page | `src/screens/ProductScoreScreen.js` |
| Login screen | `src/screens/AuthScreen.js` |
| Colors and fonts | `src/constants/colors.js`, `typography.js` |
| App name, icon, permissions | `app.json` |
| Subscription logic | `src/utils/subscription.js` |
| What loads first when the app opens | `index.js` → `App.js` → `AppNavigator.js` |
