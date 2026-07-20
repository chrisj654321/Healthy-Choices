import React, { useState } from 'react';
import PaywallContent from '../components/PaywallContent';
import OfferContent from '../components/OfferContent';

// Thin navigator wrapper around the pure PaywallContent/OfferContent
// components — the actual UI/logic lives there so onboarding (which renders
// before the NavigationContainer exists) can embed the exact same paywall
// via callbacks instead of navigation.
//
// Mirrors OnboardingScreen's paywall-step state machine (plan Part C6/C2):
// dismissing the main paywall shows the one-time 50%-off OfferContent
// instead of exiting immediately; only dismissing THAT is a true exit. This
// applies to every in-app paywall trigger (scan limit, company profile,
// search, history, share, alternatives, etc.) — not just onboarding, since
// the founder's ask was for the offer to appear "if someone clicks the exit
// from the paywall," with no feature-specific carve-out. Found missing here
// in review 2026-07-19 (Hadrian's extraction wired OfferContent into
// onboarding only and left this wrapper on the old goBack()-only behavior).
export default function PaywallScreen({ route, navigation }) {
  const feature = route?.params?.feature ?? null;
  const [showOffer, setShowOffer] = useState(false);

  if (showOffer) {
    return (
      <OfferContent
        onPurchased={() => navigation.goBack()}
        onPayFullPrice={() => setShowOffer(false)}
        onDismiss={() => navigation.goBack()}
      />
    );
  }

  return (
    <PaywallContent
      feature={feature}
      onPurchased={() => navigation.goBack()}
      onDismiss={() => setShowOffer(true)}
    />
  );
}
