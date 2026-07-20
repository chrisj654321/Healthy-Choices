import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { getUserPrefs, saveUserPrefs } from '../utils/storage';
import { hasBeenPrimed, optInToNotifications, declineNotificationPriming } from '../utils/notifications';
import { ALLERGEN_OPTIONS, DIETARY_OPTIONS, SelectStep } from '../components/setupSteps';

// Post-first-scan setup flow (Part B9) — the allergen/dietary selection UI
// that used to live inside onboarding, plus the notification-priming moment
// for anyone who didn't already opt in via a commitment-step goal deadline.
// Reachable from: the Home "finish setting up your profile" nudge card, and
// a one-time auto-prompt after the user's first real scan.
//
// 'stores' was cut from this flow (founder, 2026-07-19) — the favorite-stores
// feature is paused, not shipped, and comes back later. StoresStep still
// lives in ../components/setupSteps.js, unused for now; re-add 'stores' to
// STEPS + the JSX below (mirroring the allergens/dietary blocks) to restore it.
const STEPS = ['allergens', 'dietary', 'notify'];

export default function ProfileSetupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState(null);
  const [steps, setSteps] = useState(STEPS);
  const scrollRef = useRef(null);
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    (async () => {
      const [userPrefs, primed] = await Promise.all([getUserPrefs(), hasBeenPrimed()]);
      if (!active) return;
      setPrefs(userPrefs);
      // Re-showing the OS permission-priming UI after the user already made
      // that choice (opted in via a goal deadline, or declined before) is
      // pointless — skip straight past it. Allergens/dietary/stores always
      // show since they're meant to be revisited/adjusted.
      setSteps(primed ? STEPS.filter((st) => st !== 'notify') : STEPS);
    })();
    return () => { active = false; };
  }, []);

  const currentStep = steps[step];
  const isLast      = step === steps.length - 1;
  const progressPct = steps.length > 1 ? step / (steps.length - 1) : 1;

  const goToStep = (next) => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      slideAnim.setValue(20);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  };

  const finish = async (finalPrefs) => {
    if (finalPrefs) await saveUserPrefs(finalPrefs);
    navigation.goBack();
  };

  const handleNext = async () => {
    // Continuing past a section counts as reviewing it (Skip does not).
    const reviewKey = { allergens: 'allergensReviewed', dietary: 'dietaryReviewed' }[currentStep];
    const nextPrefs = reviewKey ? { ...prefs, [reviewKey]: true } : prefs;
    if (reviewKey) setPrefs(nextPrefs);

    if (isLast) {
      await finish(nextPrefs);
      return;
    }
    goToStep(step + 1);
  };

  const handleSkip = async () => {
    if (isLast) {
      await finish(prefs);
      return;
    }
    goToStep(step + 1);
  };

  const handleNotifyChoice = async (accepted) => {
    if (accepted) {
      await optInToNotifications();
    } else {
      await declineNotificationPriming();
    }
    await finish(prefs);
  };

  const toggleArray = (key, id) => {
    setPrefs((p) => {
      const cur = p[key] ?? [];
      return { ...p, [key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });
  };

  if (!prefs) return null;

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={s.topBar}>
        <View style={s.progressTrack}>
          <Animated.View style={[s.progressFill, { width: `${progressPct * 100}%` }]} />
        </View>
        <TouchableOpacity style={s.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {currentStep === 'allergens' && (
            <SelectStep
              title="Any food allergies?"
              subtitle="We'll highlight these on every product you scan — even trace amounts."
              options={ALLERGEN_OPTIONS}
              selected={prefs.allergens}
              onToggle={(id) => toggleArray('allergens', id)}
              noneLabel="No allergies"
              onNone={() => setPrefs((p) => ({ ...p, allergens: [] }))}
            />
          )}
          {currentStep === 'dietary' && (
            <SelectStep
              title="How do you eat?"
              subtitle="We'll personalise your ingredient flags and score summaries."
              options={DIETARY_OPTIONS}
              selected={prefs.dietaryFlags}
              onToggle={(id) => toggleArray('dietaryFlags', id)}
            />
          )}
          {currentStep === 'notify' && <NotifyStep />}
        </Animated.View>
      </ScrollView>

      {currentStep === 'notify' ? (
        <View style={[s.footer, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={s.skipBtn} onPress={() => handleNotifyChoice(false)}>
            <Text style={s.skipText}>Not now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.nextBtn} onPress={() => handleNotifyChoice(true)} activeOpacity={0.85}>
            <Text style={s.nextText}>Sure, remind me</Text>
            <Ionicons name="notifications" size={17} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[s.footer, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={s.skipBtn} onPress={handleSkip}>
            <Text style={s.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.nextBtn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={s.nextText}>{isLast ? 'Done' : 'Continue'}</Text>
            <Ionicons name="arrow-forward" size={17} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Step: NotifyStep (notification opt-in priming) ───────────────────────────

function NotifyStep() {
  return (
    <View style={nt.wrap}>
      <View style={nt.iconWrap}>
        <Ionicons name="notifications-outline" size={44} color={Colors.primary} />
      </View>
      <Text style={nt.title}>Want gentle reminders{'\n'}to decode your pantry?</Text>
      <Text style={nt.sub}>
        We'll nudge you here and there — never anything pushy, and you can turn
        it off anytime in your profile.
      </Text>
    </View>
  );
}

const nt = StyleSheet.create({
  wrap:     { alignItems: 'center', paddingTop: 24, paddingBottom: 12 },
  iconWrap: {
    width: 96, height: 96, borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 28,
  },
  title:    {
    fontSize: 26, fontWeight: '800', color: Colors.textPrimary,
    textAlign: 'center', lineHeight: 34, marginBottom: 14,
  },
  sub:      {
    fontSize: 15, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 22, paddingHorizontal: 8,
  },
});

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background },
  topBar:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  progressTrack:{ flex: 1, height: 3, backgroundColor: Colors.border, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  closeBtn:     {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  scroll:       { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  footer:       {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 24, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  skipBtn:      { paddingVertical: 14, paddingHorizontal: 8 },
  skipText:     { fontSize: 15, color: Colors.textMuted, fontWeight: '600' },
  nextBtn:      {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary,
    paddingVertical: 15, borderRadius: 14,
    shadowColor: Colors.primary, shadowOpacity: 0.35, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  nextText:     { fontSize: 16, fontWeight: '700', color: '#fff' },
});
