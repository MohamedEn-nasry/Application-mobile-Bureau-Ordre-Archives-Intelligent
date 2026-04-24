import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { QuickAction } from '../../domain/entities/DashboardStats';

// ── Color palette ─────────────────────────────────────────────────────────
const COLOR_MAP: Record<QuickAction['colorScheme'], { bg: string; text: string; symbol: string }> = {
  blue: { bg: '#3e71dfff', text: '#FFFFFF', symbol: '👥' },
  indigo: { bg: '#7975d0ff', text: '#FFFFFF', symbol: '🛡' },
  sky: { bg: '#0284C7', text: '#FFFFFF', symbol: '✉' },
  violet: { bg: '#7C3AED', text: '#FFFFFF', symbol: '📊' },
  slate: { bg: '#4aa587ff', text: '#FFFFFF', symbol: '⚙' },
  amber: { bg: '#D97706', text: '#FFFFFF', symbol: '⚠' },
};
// ─────────────────────────────────────────────────────────────────────────

interface Props {
  actions: QuickAction[];
  onPress: (routeName: string) => void;
}

/**
 * QuickActionsRow
 * Horizontally scrollable row of action buttons.
 * Pressing an action calls onPress(routeName) — navigation lives in the screen.
 */
export const QuickActionsRow = ({ actions, onPress }: Props) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Actions Rapides</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((action) => {
          const meta = COLOR_MAP[action.colorScheme] ?? COLOR_MAP.slate;
          return (
            <TouchableOpacity
              key={action.id}
              style={[styles.pill, { backgroundColor: meta.bg }]}
              onPress={() => onPress(action.routeName)}
              activeOpacity={0.8}
            >
              <Text style={styles.symbol}>{meta.symbol}</Text>
              <Text style={[styles.label, { color: meta.text }]}>{action.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  scrollContent: {
    gap: 10,
    paddingRight: 4,
  },
  pill: {
    width: 76,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  symbol: {
    fontSize: 20,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 12,
  },
});
