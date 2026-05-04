import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart, PieChart } from 'react-native-chart-kit';

import { ChartStats, SummaryStats } from '../../domain/entities/DashboardStats';
import { DashboardRepositoryImpl } from '../../data/repositories/DashboardRepositoryImpl';
import { DashboardRemoteDataSource } from '../../data/datasources/DashboardRemoteDataSource';

const screenWidth = Dimensions.get('window').width;
const chartWidth = Platform.OS === 'web' ? Math.min(screenWidth - 64, 736) : screenWidth - 48;

const repository = new DashboardRepositoryImpl(new DashboardRemoteDataSource());
const dateRanges = ['7 jours', '30 jours', '3 mois', '6 mois', '1 an'];

const rangeToDays: Record<string, number | undefined> = {
  '7 jours': 7,
  '30 jours': 30,
  '3 mois': 90,
  '6 mois': 180,
  '1 an': 365,
};

export function ReportsScreen() {
  const [activeRange, setActiveRange] = useState('6 mois');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [charts, setCharts] = useState<ChartStats | null>(null);

  const fetchData = useCallback(async (range: string) => {
    try {
      const days = rangeToDays[range];
      const [summaryRes, chartsRes] = await Promise.all([
        repository.getSummaryStats(days),
        repository.getChartStats(days),
      ]);
      if (summaryRes.isSuccess()) setSummary(summaryRes.value);
      if (chartsRes.isSuccess()) setCharts(chartsRes.value);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData(activeRange);
  }, [activeRange, fetchData]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 12, color: '#6B7280', fontWeight: '500' }}>Chargement des rapports...</Text>
      </View>
    );
  }

  const incomingMail = summary?.incomingMail || 0;
  const outgoingMail = summary?.outgoingMail || 0;
  const pendingMail = summary?.pendingMail || 0;
  const archivedMail = summary?.archivedMail || 0;

  const keyMetrics = summary?.keyMetrics || { tauxTraitement: 0, delaiMoyen: 0, courriersRetard: 0 };

  // Data mapping for Bar Chart
  const monthlyData = (charts?.monthlyStats && charts.monthlyStats.length > 0)
    ? charts.monthlyStats
    : [{ month: 'Jan', entrant: 0, sortant: 0 }];

  const barChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        data: monthlyData.map(d => d.entrant),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue
      },
      {
        data: monthlyData.map(d => d.sortant),
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green
      }
    ]
  };

  // Data mapping for Pie Chart
  const categoryDataRaw = (charts?.categoryStats && charts.categoryStats.length > 0)
    ? charts.categoryStats
    : [{ name: 'Aucune', value: 1 }];

  const pieColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const pieChartData = categoryDataRaw.map((cat, index) => ({
    name: cat.name.length > 12 ? cat.name.substring(0, 12) + '...' : cat.name,
    population: cat.value,
    color: pieColors[index % pieColors.length],
    legendFontColor: '#4B5563',
    legendFontSize: 12,
  }));

  const handleExportPDF = async () => {
    try {
      const now = new Date().toLocaleDateString('fr-DZ', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });

      const monthlyRows = (charts?.monthlyStats ?? []).map(m =>
        `<tr><td>${m.month}</td><td>${m.entrant}</td><td>${m.sortant}</td><td>${m.entrant + m.sortant}</td></tr>`
      ).join('');

      const catRows = (charts?.categoryStats ?? []).map(c =>
        `<tr><td>${c.name}</td><td>${c.value}</td></tr>`
      ).join('');

      const html = `
        <!DOCTYPE html><html lang="fr">
        <head>
          <meta charset="UTF-8"/>
          <style>
            body { font-family: Arial, sans-serif; color: #1E293B; padding: 32px; }
            h1   { color: #2563EB; margin-bottom: 4px; }
            .sub { color: #64748B; font-size: 13px; margin-bottom: 32px; }
            h2   { color: #4F46E5; font-size: 15px; margin: 24px 0 8px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px; }
            .kpi-grid { display: flex; gap: 16px; margin-bottom: 8px; }
            .kpi  { flex: 1; background: #F8FAFC; border-radius: 10px; padding: 14px; text-align: center; border: 1px solid #E2E8F0; }
            .kpi-val  { font-size: 26px; font-weight: 800; color: #2563EB; }
            .kpi-lbl  { font-size: 11px; color: #64748B; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th    { background: #2563EB; color: #fff; padding: 10px 12px; font-size: 12px; text-align: left; }
            td    { padding: 9px 12px; font-size: 13px; border-bottom: 1px solid #F1F5F9; }
            tr:nth-child(even) td { background: #F8FAFC; }
            .footer { margin-top: 40px; color: #94A3B8; font-size: 11px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Rapport &amp; Statistiques</h1>
          <div class="sub">Généré le ${now} &nbsp;|&nbsp; Période : ${activeRange}</div>
          <h2>Vue d'ensemble</h2>
          <div class="kpi-grid">
            <div class="kpi"><div class="kpi-val">${incomingMail}</div><div class="kpi-lbl">Entrants</div></div>
            <div class="kpi"><div class="kpi-val">${outgoingMail}</div><div class="kpi-lbl">Sortants</div></div>
            <div class="kpi"><div class="kpi-val">${pendingMail}</div><div class="kpi-lbl">En attente</div></div>
            <div class="kpi"><div class="kpi-val">${archivedMail}</div><div class="kpi-lbl">Archivés</div></div>
          </div>
          <h2>Indicateurs de Performance (KPIs)</h2>
          <div class="kpi-grid">
            <div class="kpi"><div class="kpi-val" style="color:#10B981">${keyMetrics.tauxTraitement}%</div><div class="kpi-lbl">Taux de Traitement</div></div>
            <div class="kpi"><div class="kpi-val" style="color:#4F46E5">${keyMetrics.delaiMoyen} j</div><div class="kpi-lbl">Délai Moyen</div></div>
            <div class="kpi"><div class="kpi-val" style="color:#EF4444">${keyMetrics.courriersRetard}</div><div class="kpi-lbl">En Retard</div></div>
          </div>
          <h2>Évolution Mensuelle</h2>
          <table>
            <tr><th>Mois</th><th>Entrant</th><th>Sortant</th><th>Total</th></tr>
            ${monthlyRows || '<tr><td colspan="4" style="text-align:center;color:#94A3B8">Aucune donnée</td></tr>'}
          </table>
          <h2>Répartition par Catégorie</h2>
          <table>
            <tr><th>Catégorie</th><th>Nombre</th></tr>
            ${catRows || '<tr><td colspan="2" style="text-align:center;color:#94A3B8">Aucune donnée</td></tr>'}
          </table>
          <div class="footer">Bureau d'Ordre — Système de Gestion des Archives Intelligentes</div>
        </body></html>
      `;

      // ── Web: use browser print dialog ──────────────────────────────────
      if (Platform.OS === 'web') {
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(html);
          win.document.close();
          win.print();
        }
        return;
      }

      // ── Mobile: use expo-print + expo-sharing (requires install) ───────
      Alert.alert(
        'Installation requise',
        "Pour exporter en PDF sur mobile, vous devez d'abord installer les modules requis.\n\nFermez l'application et exécutez :\nnpx expo install expo-print expo-sharing",
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      Alert.alert('Erreur', err?.message ?? 'Impossible de générer le PDF.');
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Filters Header */}
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Feather name="calendar" size={16} color="#4F46E5" />
          <Text style={styles.filterTitle}>PÉRIODE D'ANALYSE</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {dateRanges.map((range) => {
            const isActive = activeRange === range;
            return (
              <TouchableOpacity
                key={range}
                onPress={() => setActiveRange(range)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={isActive ? ['#4F46E5', '#3B82F6'] : ['#F3F4F6', '#F3F4F6']}
                  style={styles.filterChip}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {range}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(activeRange); }} tintColor="#4F46E5" />}
      >
        <View style={styles.maxWidthContainer}>
          
          {/* Key Overview Cards */}
          <View style={styles.grid}>
            <View style={[styles.cardWrapper]}>
              <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={styles.statCard} start={{x:0, y:0}} end={{x:1,y:1}}>
                <View style={[styles.iconContainer, { backgroundColor: '#4F46E5' }]}>
                  <Feather name="download" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.statValue}>{incomingMail}</Text>
                <Text style={styles.statLabel}>Courriers Entrants</Text>
              </LinearGradient>
            </View>

            <View style={[styles.cardWrapper]}>
              <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.statCard} start={{x:0, y:0}} end={{x:1,y:1}}>
                <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
                  <Feather name="upload" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.statValue}>{outgoingMail}</Text>
                <Text style={styles.statLabel}>Courriers Sortants</Text>
              </LinearGradient>
            </View>

            <View style={[styles.cardWrapper]}>
              <LinearGradient colors={['#FFFBEB', '#FEF3C7']} style={styles.statCard} start={{x:0, y:0}} end={{x:1,y:1}}>
                <View style={[styles.iconContainer, { backgroundColor: '#F59E0B' }]}>
                  <Feather name="clock" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.statValue}>{pendingMail}</Text>
                <Text style={styles.statLabel}>En Attente</Text>
              </LinearGradient>
            </View>

            <View style={[styles.cardWrapper]}>
              <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.statCard} start={{x:0, y:0}} end={{x:1,y:1}}>
                <View style={[styles.iconContainer, { backgroundColor: '#64748B' }]}>
                  <Feather name="archive" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.statValue}>{archivedMail}</Text>
                <Text style={styles.statLabel}>Archivés</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={[styles.section, styles.shadow]}>
            <View style={styles.sectionHeaderRow}>
              <Feather name="activity" size={20} color="#4F46E5" />
              <Text style={styles.sectionTitle}>Indicateurs de Performance (KPIs)</Text>
            </View>
            <View style={styles.kpiContainer}>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiLabel}>Taux de Traitement</Text>
                <Text style={[styles.kpiValue, { color: '#10B981' }]}>{keyMetrics.tauxTraitement}%</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiBox}>
                <Text style={styles.kpiLabel}>Délai Moyen</Text>
                <Text style={[styles.kpiValue, { color: '#4F46E5' }]}>{keyMetrics.delaiMoyen} j</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiBox}>
                <Text style={styles.kpiLabel}>En Retard</Text>
                <Text style={[styles.kpiValue, { color: keyMetrics.courriersRetard > 0 ? '#EF4444' : '#10B981' }]}>
                  {keyMetrics.courriersRetard}
                </Text>
              </View>
            </View>
          </View>

          {/* Monthly Bar Chart */}
          <View style={[styles.section, styles.shadow]}>
            <View style={styles.sectionHeaderRow}>
              <Feather name="bar-chart-2" size={20} color="#4F46E5" />
              <Text style={styles.sectionTitle}>Évolution Mensuelle</Text>
            </View>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} /><Text style={styles.legendText}>Entrant</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#10B981' }]} /><Text style={styles.legendText}>Sortant</Text></View>
            </View>
            <View style={styles.chartContainer}>
              {Platform.OS !== 'web' || chartWidth > 0 ? (
                <BarChart
                  data={barChartData}
                  width={chartWidth}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  style={styles.chart}
                  showBarTops={false}
                  fromZero={true}
                  withInnerLines={true}
                />
              ) : null}
            </View>
          </View>

          {/* Categories Pie Chart */}
          <View style={[styles.section, styles.shadow]}>
            <View style={styles.sectionHeaderRow}>
              <Feather name="pie-chart" size={20} color="#4F46E5" />
              <Text style={styles.sectionTitle}>Répartition par Catégorie</Text>
            </View>
            <View style={styles.chartContainer}>
              {Platform.OS !== 'web' || chartWidth > 0 ? (
                <PieChart
                  data={pieChartData}
                  width={chartWidth}
                  height={200}
                  chartConfig={chartConfig}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[10, 0]}
                  absolute
                />
              ) : null}
            </View>
          </View>

          {/* Export Button */}
          <TouchableOpacity onPress={handleExportPDF} activeOpacity={0.8} style={{ marginBottom: 40 }}>
            <LinearGradient
              colors={['#4F46E5', '#4338CA']}
              style={styles.exportButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Feather name="download-cloud" size={20} color="#FFFFFF" />
              <Text style={styles.exportText}>Télécharger le Rapport PDF</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  
  filterContainer: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', elevation: 2, zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  filterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  filterTitle: { fontSize: 12, fontWeight: '800', color: '#374151', letterSpacing: 1 },
  filterScroll: { gap: 10, paddingRight: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24 },
  filterChipText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  filterChipTextActive: { color: '#FFFFFF', fontWeight: '700' },

  scrollView: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingVertical: 20 },
  maxWidthContainer: { width: '100%', maxWidth: 800, paddingHorizontal: 20 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20, rowGap: 16 },
  cardWrapper: { width: '48%' },
  statCard: { borderRadius: 20, padding: 20, alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  iconContainer: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '600', color: '#4B5563' },

  section: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, marginBottom: 20 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  
  kpiContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16 },
  kpiBox: { flex: 1, alignItems: 'center' },
  kpiLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 8, textAlign: 'center' },
  kpiValue: { fontSize: 24, fontWeight: '900' },
  kpiDivider: { width: 1, height: 40, backgroundColor: '#E5E7EB' },

  legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },

  chartContainer: { alignItems: 'center', marginTop: 10 },
  chart: { borderRadius: 16 },

  exportButton: { borderRadius: 20, paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  exportText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  shadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
});
