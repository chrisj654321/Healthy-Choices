import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../constants/colors';
import SpecsMascot from './SpecsMascot';

const PARTICLE_COLORS = ['#1D9E75', '#6DBE47', '#F5C842', '#F06A25', '#2EC090', '#F5A623'];
const PARTICLE_COUNT = 18;
// How long the full-screen moment stays up before auto-dismissing and
// calling onDone (the caller uses that to fire the 'firstHighScore' review
// prompt — see ProductScoreScreen.js).
const CELEBRATION_MS = 2600;

// Precomputed once per mount, not once per module — this only ever mounts
// for the single first-90+ scan of an install (see
// mascotMoments.js#checkFirstHighScore), so there is no repeat playback to
// keep visually consistent across.
function buildParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.4;
    const distance = 90 + Math.random() * 70;
    return {
      key: i,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
    };
  });
}

/**
 * Full-screen "first 90+ score ever" celebration: Specs's backflip clip
 * plus a fireworks/confetti burst behind him, built with the plain
 * React Native `Animated` API only — no native confetti/particle
 * dependency (particles are just Views animated on opacity + transform,
 * both native-driver-safe).
 *
 * Fires exactly once per install. The caller (ProductScoreScreen) gates
 * mounting this on mascotMoments.js#checkFirstHighScore and passes the
 * real numeric score (never the letter grade — see CLAUDE.md on scores).
 * Auto-dismisses after CELEBRATION_MS and calls onDone().
 */
export default function FirstHighScoreCelebration({ score, onDone }) {
  const particles = useRef(buildParticles()).current;
  const burst = useRef(new Animated.Value(0)).current;
  const content = useRef(new Animated.Value(0)).current;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(burst, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(content, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onDoneRef.current?.();
    }, CELEBRATION_MS);
    return () => clearTimeout(timer);
    // Deliberately runs once on mount only — burst/content are stable refs
    // and onDone is read through onDoneRef so a caller passing a fresh
    // function identity each render can't restart the timer/animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={st.overlay} pointerEvents="auto">
      <View style={st.burstWrap}>
        {particles.map((p) => (
          <Animated.View
            key={p.key}
            style={[
              st.particle,
              {
                backgroundColor: p.color,
                opacity: burst.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
                transform: [
                  { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] }) },
                  { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, p.dy] }) },
                  { scale: burst.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.4, 1, 0.6] }) },
                ],
              },
            ]}
          />
        ))}
      </View>

      <Animated.View
        style={{
          opacity: content,
          transform: [{ scale: content.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
        }}
      >
        <SpecsMascot clip="backflip" size={140} />
        <Text style={st.title}>Your first 90+ score! 🎉</Text>
        {typeof score === 'number' && <Text style={st.score}>{score}/100</Text>}
      </Animated.View>
    </View>
  );
}

const st = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26,46,40,0.92)',
    zIndex: 20,
  },
  burstWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  score: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryLight,
    textAlign: 'center',
  },
});
