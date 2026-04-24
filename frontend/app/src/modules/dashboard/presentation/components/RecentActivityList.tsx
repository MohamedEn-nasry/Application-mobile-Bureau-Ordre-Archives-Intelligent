import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ActivityItem, ActivityIconType } from '../../domain/entities/DashboardStats';

// ── Icon colour mapping ───────────────────────────────────────────────────
const ICON_META: Record<ActivityIconType, { bg: string; dot: string; symbol: string }> = {
  mail: { bg: '#DBEAFE', dot: '#2563EB', symbol: '✉' },
  archive: { bg: '#EDE9FE', dot: '#7C3AED', symbol: '📦' },
  'user-plus': { bg: '#DCFCE7', dot: '#16A34A', symbol: '👤' },
  download: { bg: '#FEF3C7', dot: '#D97706', symbol: '⬇' },
  eye: { bg: '#F1F5F9', dot: '#475569', symbol: '👁' },
};
// ─────────────────────────────────────────────────────────────────────────

interface Props {
  activities: ActivityItem[];
  onSeeAll?: () => void;
}


export const RecentActivityList: React.FC<Props> = ({ activities, onSeeAll }) => {
  return (
    <View>
      {/* Section header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Activité Récente</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.seeAll}>Tout voir →</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List body */}
      <View style={styles.card}>
        {activities.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune activité récente</Text>
          </View>
        ) : (
          activities.map((item, index) => {
            const meta = ICON_META[item.icon] ?? ICON_META.eye;
            const isLast = index === activities.length - 1;
            return (
              <View key={item.id} style={[styles.row, !isLast && styles.rowBorder]}>
                <View style={[styles.iconBadge, { backgroundColor: meta.bg }]}>
                  <Text style={{ fontSize: 12 }}>{meta.symbol}</Text>
                </View>
                <View style={styles.textBlock}>
                  <Text style={[styles.user, { color: meta.dot }]} numberOfLines={1}>
                    {item.user}
                  </Text>
                  <Text style={styles.action} numberOfLines={1}>
                    {item.action}
                  </Text>
                </View>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  seeAll: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
  },
  user: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  action: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  time: {
    fontSize: 11,
    color: '#94A3B8',
    flexShrink: 0,
  },
  empty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});
