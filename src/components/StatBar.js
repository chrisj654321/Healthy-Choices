import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';

export default function StatBar({ label, value, max, unit = '', warn = false, color }) {
  const pct = Math.min((value / max) * 100, 100);
  const fillColor = color ?? (warn ? '#D93B3B' : Colors.primary);
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, warn && styles.valueWarn]}>{value}{unit}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: fillColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { fontSize: 14, color: '#5C7A72' },
  value: { fontSize: 14, fontWeight: '600', color: '#1A2E28' },
  valueWarn: { color: '#D93B3B' },
  track: { height: 6, backgroundColor: '#EDF2F0', borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});
