import React from 'react';
import { Image } from 'expo-image';

// Static fallback cutout — used for the "static" clip key and for any
// unrecognized clip name passed in by a caller (never throws on a typo).
const STATIC_SOURCE = require('../../assets/mascot/specs-standing.png');

// All 5 approved animation clips + the static fallback. Loop-once vs.
// infinite-loop playback is baked into each WebP's own frame metadata
// (see scripts/media/build-mascot-webp.sh) — there is no runtime playback-control
// code here at all.
export const CLIPS = {
  wave: require('../../assets/mascot/webp/specs-wave.webp'),
  'idle-loop': require('../../assets/mascot/webp/specs-idle-loop.webp'),
  backflip: require('../../assets/mascot/webp/specs-backflip.webp'),
  'shy-blush': require('../../assets/mascot/webp/specs-shy-blush.webp'),
  inspecting: require('../../assets/mascot/webp/specs-inspecting.webp'),
  static: STATIC_SOURCE,
};

/**
 * Specs the mascot. Deliberately a plain function component with ZERO hooks
 * so it's safe to render inside App.js's class-based ErrorBoundary fallback
 * (a hook there would break the rules-of-hooks / crash the crash screen).
 *
 * <SpecsMascot clip="wave" size={64} />
 *
 * Unknown/missing `clip` values fall back to the static standing cutout
 * instead of throwing, so a typo'd clip name degrades gracefully.
 */
export default function SpecsMascot({ clip = 'static', size = 64, style }) {
  const source = CLIPS[clip] || STATIC_SOURCE;

  return (
    <Image
      source={source}
      style={[{ width: size, height: size }, style]}
      contentFit="contain"
      cachePolicy="memory"
      pointerEvents="none"
    />
  );
}
