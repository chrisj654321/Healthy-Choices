import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gradeToColor, scoreToVerdict } from '../utils/scorer';

export default function ScanHistoryItem({ item, onPress, onDelete }) {
  const gradeColor = gradeToColor(item.grade);
  const verdict = scoreToVerdict(item.grade);
  const date = new Date(item.scannedAt);
  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Score indicator */}
      <View style={styles.scoreWrap}>
        <View style={[styles.scoreDot, { backgroundColor: gradeColor }]} />
        <Text style={[styles.scoreNum, { color: gradeColor }]}>{item.score}</Text>
        <Text style={styles.scoreSlash}>/100</Text>
      </View>

      {/* Product info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.brand} numberOfLines={1}>{item.brand}</Text>
        <View style={styles.bottomRow}>
          <View style={[styles.verdictBadge, { backgroundColor: gradeColor + '18' }]}>
            <Text style={[styles.verdictText, { color: gradeColor }]}>{verdict}</Text>
          </View>
          <Text style={styles.time}>{dateStr} · {timeStr}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onDelete} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Ionicons name="trash-outline" size={17} color="#C8D8D3" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
    marginRight: 14,
    minWidth: 62,
  },
  scoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 3,
    marginRight: 4,
    alignSelf: 'center',
  },
  scoreNum: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  scoreSlash: {
    fontSize: 12,
    color: '#B0C4BE',
    fontWeight: '500',
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A2E28',
  },
  brand: {
    fontSize: 12,
    color: '#8AA49E',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  verdictBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verdictText: {
    fontSize: 11,
    fontWeight: '700',
  },
  time: {
    fontSize: 11,
    color: '#B0C4BE',
  },
});
