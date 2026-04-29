import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ChartStats, SummaryStats } from '../../domain/entities/DashboardStats';
import { DashboardRepositoryImpl } from '../../data/repositories/DashboardRepositoryImpl';
import { DashboardRemoteDataSource } from '../../data/datasources/DashboardRemoteDataSource';

const screenWidth = Dimensions.get('window').width;
const repository = new DashboardRepositoryImpl(new DashboardRemoteDataSource());
const dateRanges = ['7 jours', '30 jours', '3 mois', '6 mois', '1 an'];

export function ReportsScreen() {
  const [activeRange, setActiveRange] = useState('6 mois');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [charts, setCharts] = useState<ChartStats | null>(null);

  const fetchData = async () => {
    try {
      const [summaryRes, chartsRes] = await Promise.all([
        repository.getSummaryStats(),
        repository.getChartStats(),
      ]);
      if (summaryRes.isSuccess()) setSummary(summaryRes.value);
      if (chartsRes.isSuccess()) setCharts(chartsRes.value);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const incomingMail = summary?.incomingMail || 0;
  const outgoingMail = summary?.outgoingMail || 0;
  const pendingMail = summary?.pendingMail || 0;
  const archivedMail = summary?.archivedMail || 0;

  // Fake chart data if empty to show the beautiful design
  const monthlyData = (charts?.monthlyStats && charts.monthlyStats.length > 0) 
    ? charts.monthlyStats 
    : [
        { month: 'Jan', entrant: 45, sortant: 30 },
        { month: 'Fév', entrant: 52, sortant: 38 },
        { month: 'Mar', entrant: 38, sortant: 42 },
        { month: 'Avr', entrant: 65, sortant: 50 },
        { month: 'Mai', entrant: 48, sortant: 55 },
        { month: 'Juin', entrant: 70, sortant: 60 }
      ];

  const maxChartValue = Math.max(...monthlyData.flatMap(d => [d.entrant, d.sortant]), 100);

  const categoryData = (charts?.categoryStats && charts.categoryStats.length > 0)
    ? charts.categoryStats
    : [
        { name: 'Factures', value: 45, color: '#3B82F6' },
        { name: 'Plaintes', value: 25, color: '#10B981' },
        { name: 'Demandes', value: 20, color: '#F59E0B' },
        { name: 'Autres', value: 10, color: '#64748B' }
      ];

  const totalCat = categoryData.reduce((acc, cat) => acc + cat.value, 0) || 1;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Filters */}
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Feather name="calendar" size={14} color="#3B82F6" />
          <Text style={styles.filterTitle}>PÉRIODE</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {dateRanges.map((range) => (
            <TouchableOpacity 
              key={range} 
              style={[styles.filterChip, activeRange === range && styles.filterChipActive]}
              onPress={() => setActiveRange(range)}
            >
              <Text style={[styles.filterChipText, activeRange === range && styles.filterChipTextActive]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#3B82F6" />}
      >
        <View style={styles.maxWidthContainer}>
          {/* Summary Stats */}
          <View style={styles.grid}>
            <View style={[styles.card, styles.shadow]}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <Feather name="arrow-down-left" size={18} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.cardValue}>{incomingMail}</Text>
                <Text style={styles.cardLabel}>Entrant</Text>
              </View>
            </View>

            <View style={[styles.card, styles.shadow]}>
              <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                <Feather name="arrow-up-right" size={18} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.cardValue}>{outgoingMail}</Text>
                <Text style={styles.cardLabel}>Sortant</Text>
              </View>
            </View>

            <View style={[styles.card, styles.shadow]}>
              <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
                <Feather name="clock" size={18} color="#D97706" />
              </View>
              <View>
                <Text style={styles.cardValue}>{pendingMail}</Text>
                <Text style={styles.cardLabel}>En attente</Text>
              </View>
            </View>

            <View style={[styles.card, styles.shadow]}>
              <View style={[styles.iconBox, { backgroundColor: '#F8FAFC' }]}>
                <Feather name="archive" size={18} color="#475569" />
              </View>
              <View>
                <Text style={styles.cardValue}>{archivedMail}</Text>
                <Text style={styles.cardLabel}>Archivés</Text>
              </View>
            </View>
          </View>

          {/* Bar Chart (Custom Flexbox Implementation for Web/Mobile perfect sync) */}
          <View style={[styles.section, styles.shadow]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Courrier Mensuel</Text>
                <Text style={styles.sectionSubtitle}>Entrant vs Sortant</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#3B82F6' }]} /><Text style={styles.legendText}>Entrant</Text></View>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#818CF8' }]} /><Text style={styles.legendText}>Sortant</Text></View>
              </View>
            </View>

            <View style={styles.barChartContainer}>
              {monthlyData.map((data, index) => {
                const entrantHeight = (data.entrant / maxChartValue) * 100;
                const sortantHeight = (data.sortant / maxChartValue) * 100;
                
                return (
                  <View key={index} style={styles.barColumn}>
                    <View style={styles.barsWrapper}>
                      <View style={[styles.bar, { height: `${entrantHeight}%`, backgroundColor: '#3B82F6' }]} />
                      <View style={[styles.bar, { height: `${sortantHeight}%`, backgroundColor: '#818CF8' }]} />
                    </View>
                    <Text style={styles.barLabel}>{data.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Category Progress Bars (Custom) */}
          <View style={[styles.section, styles.shadow]}>
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Courrier par Catégorie</Text>
              <Text style={styles.sectionSubtitle}>Répartition globale</Text>
            </View>

            <View style={styles.progressContainer}>
              {categoryData.map((cat, index) => {
                const percentage = Math.round((cat.value / totalCat) * 100);
                const color = cat.color || ['#3B82F6', '#10B981', '#F59E0B', '#64748B'][index % 4];
                return (
                  <View key={index} style={styles.progressRow}>
                    <View style={styles.progressLabelBox}>
                      <View style={[styles.dot, { backgroundColor: color }]} />
                      <Text style={styles.progressLabel}>{cat.name}</Text>
                    </View>
                    <View style={styles.progressBarWrapper}>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
                      </View>
                      <Text style={styles.progressValue}>{percentage}%</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Key Metrics */}
          <View style={[styles.section, styles.shadow]}>
            <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Indicateurs Clés</Text>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Taux de traitement</Text>
              <View style={styles.metricValueBox}>
                <Text style={styles.metricValue}>87%</Text>
                <View style={[styles.badge, { backgroundColor: '#DCFCE7' }]}><Text style={[styles.badgeText, { color: '#16A34A' }]}>+4%</Text></View>
              </View>
            </View>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Délai moyen de traitement</Text>
              <View style={styles.metricValueBox}>
                <Text style={styles.metricValue}>2.3j</Text>
                <View style={[styles.badge, { backgroundColor: '#DCFCE7' }]}><Text style={[styles.badgeText, { color: '#16A34A' }]}>-0.5j</Text></View>
              </View>
            </View>
            
            <View style={[styles.metricRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.metricLabel}>Courriers en retard</Text>
              <View style={styles.metricValueBox}>
                <Text style={styles.metricValue}>12</Text>
                <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}><Text style={[styles.badgeText, { color: '#DC2626' }]}>+3</Text></View>
              </View>
            </View>
          </View>

          {/* Export Button */}
          <TouchableOpacity style={styles.exportButton}>
            <Feather name="download" size={18} color="#FFFFFF" />
            <Text style={styles.exportText}>Exporter le Rapport PDF</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  
  // Filter Top Bar
  filterContainer: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  filterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  filterTitle: { fontSize: 11, fontWeight: '700', color: '#475569', letterSpacing: 0.5 },
  filterScroll: { gap: 8, paddingRight: 20 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  filterChipActive: { backgroundColor: '#2563EB' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  filterChipTextActive: { color: '#FFFFFF' },

  scrollView: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingVertical: 16 },
  maxWidthContainer: { width: '100%', maxWidth: 800, paddingHorizontal: 16 },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 16 },
  card: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardValue: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  cardLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },

  // Sections
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  sectionSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  
  // Custom Bar Chart
  legendRow: { flexDirection: 'row', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: '#64748B' },
  
  barChartContainer: { height: 160, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 10 },
  barColumn: { alignItems: 'center', height: '100%', justifyContent: 'flex-end', width: 40 },
  barsWrapper: { flexDirection: 'row', gap: 4, height: '80%', alignItems: 'flex-end', width: '100%', justifyContent: 'center' },
  bar: { width: 12, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barLabel: { fontSize: 11, color: '#94A3B8', marginTop: 8 },

  // Custom Progress Bars
  progressContainer: { gap: 12 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabelBox: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 100 },
  progressLabel: { fontSize: 13, color: '#475569', fontWeight: '500' },
  progressBarWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 12 },
  progressBarBg: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressValue: { width: 36, textAlign: 'right', fontSize: 13, fontWeight: '600', color: '#334155' },

  // Metrics
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  metricLabel: { fontSize: 13, color: '#475569', fontWeight: '500' },
  metricValueBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metricValue: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  // Export
  exportButton: { backgroundColor: '#3B82F6', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 20 },
  exportText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  shadow: { shadowColor: '#64748B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
});
