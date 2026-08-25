import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Floating back button — fixed top-left, same offset on every screen,
 * frosted glass circle over whatever's behind it (photo, gradient, or flat
 * color). Must be rendered as a sibling OUTSIDE any ScrollView/FlatList so
 * `position: absolute` keeps it pinned regardless of scroll.
 */
export default function BackButton({ onPress, navigation, style }) {
  const insets = useSafeAreaInsets();
  const handlePress = onPress ?? (() => navigation?.goBack());

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.wrap, { top: insets.top + 8 }, style]}
      activeOpacity={0.75}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <BlurView intensity={40} tint="dark" style={styles.blur}>
        <Ionicons name="chevron-back" size={26} color="#fff" />
      </BlurView>
    </TouchableOpacity>
  );
}

const SIZE = 44;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    zIndex: 20,
    elevation: 20,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: 'hidden',
  },
  blur: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
});
