# Healthy Choices — App Store Copy

---

## App Name
**Healthy Choices: Food Scanner**
(30 chars — fits iOS title field)

---

## Subtitle (30 chars max)
**Scan Barcodes. See Every Ingredient.**
(38 chars — trim to): **Scan. Know What's In Your Food.**
(33 chars — trim to): **Know Every Ingredient You Eat**
(30 chars ✅)

**Final subtitle:** `Know Every Ingredient You Eat`

---

## Category
- **Primary:** Health & Fitness
- **Secondary:** Food & Drink

---

## Age Rating
**4+** (no objectionable content)

---

## Keywords (100 chars max — comma-separated, no spaces after commas)
```
food scanner,barcode scan,ingredient checker,clean eating,nutrition,healthy food,food label,additive
```
(99 chars ✅)

**Notes:**
- Do NOT include app name or subtitle words (Apple ignores duplicates)
- "seed oils" omitted — not an FDA-regulated category; could signal pseudoscience to reviewers
- High-value terms covered: food scanner, barcode, ingredient, nutrition, food label, additive

---

## Description (4000 chars max)

```
Scan any food product barcode and instantly see its health score, full ingredient breakdown, and the company behind it — all in seconds.

INGREDIENT TRANSPARENCY
• Every ingredient rated and explained in plain English
• Flagged additives, dyes, and preservatives clearly highlighted
• Allergen alerts for peanuts, dairy, gluten, soy, shellfish, and more
• Personalized flags based on your dietary preferences (vegan, keto, gluten-free, and more)

COMPANY TRANSPARENCY
• See corporate lobbying spend and political donation data for the brand behind every product
• Know which companies are funding efforts to block food labeling laws
• Make values-aligned purchasing decisions with full context

HEALTH SCORE
• Simple 0–100 score for every product
• Based on ingredient quality, processing level, and additive flags
• Compare products side by side to find cleaner alternatives

YOUR PROFILE
• Set allergens, dietary preferences, and your top nutrition goal
• Scores and flags automatically personalized to what matters to you
• All preferences stored privately on your device

SCAN HISTORY
• Every product you've scanned, saved locally
• Filter by score, date, or flag type
• No cloud sync — your data stays on your phone

Scores and ingredient information are for educational purposes only and are not medical advice. They should not be used to diagnose, treat, or prevent any health condition. Consult a qualified healthcare professional for dietary guidance.

Healthy Choices uses Open Food Facts (openfoodfacts.org) and the USDA FoodData Central database. Ingredient flag data is curated from publicly available regulatory sources including FDA, California Prop 65, and EU food labeling regulations.
```

Character count: ~1,450 (well under 4,000 limit ✅)

---

## What's New (first release)
```
Initial release. Scan barcodes, see ingredient health scores, allergen alerts, and company transparency data — all offline and private.
```

---

## Privacy Policy URL
`https://healthychoices.app/privacy`

*(Host web/privacy.html at this URL before submitting — Netlify Drop is fastest: go to drop.netlify.com and drag the web/ folder)*

---

## Support URL
`https://healthychoices.app`

*(Can be same domain as privacy policy — just needs to resolve)*

---

## App Store Screenshots (required before submission)
Screenshots needed for:
- iPhone 6.9" (iPhone 16 Pro Max) — 1320 × 2868 px
- iPhone 6.5" (iPhone 14 Plus) — 1242 × 2688 px
- iPad 13" (optional but recommended)

Suggested screens to capture:
1. Scanner active with scan line animation
2. Product score screen (A-grade product, green)
3. Product score screen (D/F-grade product with red flags)
4. Company profile with lobbying/donation data
5. Profile screen showing allergen + dietary selections

---

## Pre-Submission Checklist

- [ ] Supabase URL + anon key filled into `src/utils/supabase.js`
- [ ] Apple Developer account created
- [ ] Apple Service ID created (com.jamesadventure.healthychoices.siwa) for Sign in with Apple
- [ ] Google OAuth client ID configured in Supabase Auth → Providers → Google
- [ ] RevenueCat integrated (replaces mock `src/utils/subscription.js`) — **REQUIRED for App Store**
- [ ] Privacy policy hosted at a live URL
- [ ] Support URL resolves
- [ ] Screenshots captured on physical device or simulator
- [ ] `eas.json` updated with real App Store Connect App ID and Apple Team ID
- [ ] USDA API key rotated and moved to `.env`
