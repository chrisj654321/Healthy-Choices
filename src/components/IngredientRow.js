import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Font } from '../constants/typography';

const UNKNOWN_COLOR = '#B8C8C3';
const UNKNOWN_BG = '#F2F4F3';

function resolveColors(item) {
  if (item.category === 'unknown' || !item.flagInfo) {
    return { color: UNKNOWN_COLOR, bg: UNKNOWN_BG, label: 'Unknown' };
  }
  return { color: item.flagInfo.color, bg: item.flagInfo.bg, label: item.flagInfo.label };
}

export default function IngredientRow({ item }) {
  const [expanded, setExpanded] = useState(false);
  const { color, bg, label } = resolveColors(item);
  const note = item.note || (item.category === 'unknown' ? 'Not yet in our ingredient database.' : null);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => note && setExpanded((e) => !e)}
      activeOpacity={note ? 0.7 : 1}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.label} numberOfLines={expanded ? undefined : 1}>
            {item.label}
          </Text>
          <View style={[styles.badge, { backgroundColor: bg }]}>
            <Text style={[styles.badgeText, { color }]}>{label}</Text>
          </View>
        </View>
        {expanded && note ? (
          <Text style={[styles.note, item.category === 'unknown' && styles.noteGray]}>{note}</Text>
        ) : null}
        {note ? (
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={13}
            color={UNKNOWN_COLOR}
            style={styles.chevron}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F2',
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    marginTop: 5, marginRight: 12, flexShrink: 0,
  },
  content: { flex: 1 },
  top: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: 8,
  },
  label: {
    flex: 1, fontSize: 14, fontWeight: '600', color: '#1A2E28',
  },
  badge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10, flexShrink: 0,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  note: {
    fontSize: 12, color: '#5C7A72', lineHeight: 17, marginTop: 5,
  },
  noteGray: { color: '#9BB5AE', fontStyle: 'italic' },
  chevron: { marginTop: 3 },
});
