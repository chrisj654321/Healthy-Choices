import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Font } from '../constants/typography';

export default function GradeRing({ score, grade, color, size = 120 }) {
  const fontSize = size * 0.38;
  const subFontSize = size * 0.16;

  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: color }]}>
      <Text style={[styles.grade, { fontSize, color }]}>{grade}</Text>
      <Text style={[styles.score, { fontSize: subFontSize, color }]}>{score}/100</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  grade: {
    fontWeight: Font.weights.heavy,
  },
  score: {
    fontWeight: Font.weights.medium,
    marginTop: -4,
  },
});
