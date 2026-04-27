// src/screens/admin/AdminReportsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, SectionTitle, FilterChips, PrimaryButton, StatCard } from '../../../../shared/components';
import { Colors, Spacing, Radius, Shadow } from '../../../../shared/theme';
import { ANALYTICS } from '../../../../data/mockData';

const PERIODS = ['Ce mois', 'T1 2026', '2025', 'Personnalisé'];

export default function AdminReportsScreen({ navigation }) {
  const [period, setPeriod] = useState('Ce mois');
  const s = ANALYTICS.summary;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader
        title="Rapports et analytique"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Export', 'Rapport exporté avec succès.')}>
            <Text style={styles.exportBtnText}>⬇  Exporter</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <FilterChips options={PERIODS} selected={period} onSelect={setPeriod} />

        {/* KPI Row */}
        <View style={styles.kpiGrid}>
          <StatCard label="Courrier entrant" value={String(s.totalIncoming)} accent />
          <StatCard label="Courrier sortant" value={String(s.totalOutgoing)} color={Colors.teal600} />
          <StatCard label="En attente" value={String(s.pending)} color={Colors.amber400} />
          <StatCard label="Archivés" value={String(s.archived)} color={Colors.gray500} />
        </View>

        {/* Bar chart */}
        <Card>
          <SectionTitle title="Entrant vs Sortant" />
          <View style={styles.chartArea}>
            {ANALYTICS.monthlyMail.map((d) => {
              const maxH = 80; const maxV = 80;
              return (
                <View key={d.month} style={styles.barGroup}>
                  <View style={styles.barValues}>
                    <Text style={styles.barVal}>{d.incoming}</Text>
                  </View>
                  <View style={styles.barPair}>
                    <View style={[styles.barIn, { height: (d.incoming / maxV) * maxH }]} />
                    <View style={[styles.barOut, { height: (d.outgoing / maxV) * maxH }]} />
                  </View>
                  <Text style={styles.barLabel}>{d.month}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.blue400 }]} /><Text style={styles.legendText}>Entrant</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.teal400 }]} /><Text style={styles.legendText}>Sortant</Text></View>
          </View>
        </Card>

        {/* Category breakdown */}
        <Card>
          <SectionTitle title="Courrier par catégorie" />
          {ANALYTICS.categories.map((c) => (
            <View key={c.name} style={styles.catRow}>
              <View style={styles.catLeft}>
                <Text style={styles.catName}>{c.name}</Text>
                <View style={styles.catBarTrack}>
                  <View style={[styles.catBarFill, { width: `${c.percent}%`, backgroundColor: c.color }]} />
                </View>
              </View>
              <Text style={[styles.catPct, { color: c.color }]}>{c.percent}%</Text>
            </View>
          ))}
        </Card>

        {/* User activity */}
        <Card>
          <SectionTitle title="Activité par utilisateur" />
          {ANALYTICS.userActivity.map((u, i) => (
            <View key={u.name} style={[styles.activityRow, i === ANALYTICS.userActivity.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.activityRank}>
                <Text style={styles.activityRankText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityName}>{u.name}</Text>
                <Text style={styles.activityRole}>{u.role}</Text>
              </View>
              <View style={styles.activityBadge}>
                <Text style={styles.activityCount}>{u.actions}</Text>
                <Text style={styles.activityLabel}>actions</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Pending + Archived stats */}
        <View style={styles.bottomStats}>
          <View style={[styles.bottomStat, { backgroundColor: Colors.amber50, borderColor: Colors.amber100 }]}>
            <Text style={[styles.bottomStatNum, { color: Colors.amber600 }]}>{s.pending}</Text>
            <Text style={styles.bottomStatLabel}>Courriers en attente</Text>
            <Text style={styles.bottomStatSub}>Nécessitent une action</Text>
          </View>
          <View style={[styles.bottomStat, { backgroundColor: Colors.gray100, borderColor: Colors.gray200 }]}>
            <Text style={[styles.bottomStatNum, { color: Colors.gray600 }]}>{s.archived}</Text>
            <Text style={styles.bottomStatLabel}>Courriers archivés</Text>
            <Text style={styles.bottomStatSub}>Total historique</Text>
          </View>
        </View>

        <PrimaryButton title="⬇  Exporter le rapport PDF" onPress={() => Alert.alert('Export', 'Rapport PDF généré.')} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  exportBtn: { backgroundColor: Colors.blue50, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 0.5, borderColor: Colors.blue100 },
  exportBtnText: { fontSize: 12, fontWeight: '700', color: Colors.blue700 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chartArea: { flexDirection: 'row', alignItems: 'flex-end', height: 110, marginTop: Spacing.sm, gap: 4 },
  barGroup: { flex: 1, alignItems: 'center', gap: 4 },
  barValues: { height: 16, justifyContent: 'flex-end' },
  barVal: { fontSize: 9, color: Colors.gray400, fontWeight: '700' },
  barPair: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 80 },
  barIn: { width: 14, backgroundColor: Colors.blue400, borderRadius: 3 },
  barOut: { width: 14, backgroundColor: Colors.teal400, borderRadius: 3 },
  barLabel: { fontSize: 10, color: Colors.gray500, fontWeight: '600' },
  legend: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: Colors.gray500 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.md },
  catLeft: { flex: 1, gap: 5 },
  catName: { fontSize: 13, fontWeight: '600', color: Colors.gray700 },
  catBarTrack: { height: 7, backgroundColor: Colors.gray100, borderRadius: 4, overflow: 'hidden' },
  catBarFill: { height: 7, borderRadius: 4 },
  catPct: { fontSize: 14, fontWeight: '800', minWidth: 36, textAlign: 'right' },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight },
  activityRank: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.blue50, alignItems: 'center', justifyContent: 'center' },
  activityRankText: { fontSize: 12, fontWeight: '800', color: Colors.blue700 },
  activityName: { fontSize: 13, fontWeight: '700', color: Colors.gray900 },
  activityRole: { fontSize: 11, color: Colors.gray400 },
  activityBadge: { alignItems: 'flex-end' },
  activityCount: { fontSize: 18, fontWeight: '800', color: Colors.blue800 },
  activityLabel: { fontSize: 10, color: Colors.gray400 },
  bottomStats: { flexDirection: 'row', gap: Spacing.sm },
  bottomStat: { flex: 1, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1 },
  bottomStatNum: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  bottomStatLabel: { fontSize: 12, fontWeight: '700', color: Colors.gray700, marginTop: 4 },
  bottomStatSub: { fontSize: 11, color: Colors.gray400, marginTop: 2 },
});
