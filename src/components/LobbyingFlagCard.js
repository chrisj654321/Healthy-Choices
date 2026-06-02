import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';

const SEVERITY_MAP = {
  high: { color: '#D93B3B', bg: '#FDE8E8', icon: 'alert-circle' },
  medium: { color: '#F06A25', bg: '#FEF0E6', icon: 'warning' },
  low: { color: '#F5C842', bg: '#FEF9E7', icon: 'information-circle' },
};

export default function LobbyingFlagCard({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_MAP[issue.severity] || SEVERITY_MAP.low;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: sev.color }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: sev.bg }]}>
          <Ionicons name={sev.icon} size={16} color={sev.color} />
        </View>
        <Text style={styles.title}>{issue.title}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textMuted} />
      </View>
      {expanded && (
        <View style={styles.body}>
          <Text style={styles.description}>{issue.description}</Text>
          {issue.source && (
            <Text style={styles.source}>Source: {issue.source}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: Font.sizes.sm,
    fontWeight: Font.weights.semibold,
    color: Colors.textPrimary,
  },
  body: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  description: {
    fontSize: Font.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  source: {
    fontSize: Font.sizes.xs,
    color: Colors.textMuted,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
