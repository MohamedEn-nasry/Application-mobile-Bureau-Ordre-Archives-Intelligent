import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface Props {
  value: number | string;
  label: string;
  subLabel?: string;
  color: string;         // e.g. '#3B82F6'
  backgroundColor: string;
}

/**
 * StatCard
 * Displays a single KPI value with a label and optional sub-label.
 * Used in the 2-column stats grid at the top of the dashboard.
 */
export const StatCard: React.FC<Props> = ({
  value,
  label,
  subLabel,
  color,
  backgroundColor,
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={[styles.badge, { backgroundColor }]}>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
      {subLabel ? <Text style={styles.subLabel}>{subLabel}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    minHeight: 90,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    lineHeight: 16,
  },
  subLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
