import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useReportsOverview } from '../hooks/useReportsOverview';
import { BottomNav } from '../../../../shared/presentation/components/BottomNav';

const periods = [
  { label: '7 jours', value: '7d' },
  { label: '30 jours', value: '30d' },
  { label: '3 mois', value: '3m' },
  { label: '6 mois', value: '6m' },
  { label: '1 an', value: '1y' },
];

export const ReportsScreen = ({ navigation }: any) => {
  const {
    data,
    period,
    setPeriod,
    isLoading,
    error,
  } = useReportsOverview();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Rapports & Analytiques</Text>

        <Text style={styles.menu}>⋮</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>PÉRIODE</Text>

        <View style={styles.periodRow}>
          {periods.map(item => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.periodChip,
                period === item.value && styles.periodChipActive,
              ]}
              onPress={() => setPeriod(item.value)}
            >
              <Text
                style={[
                  styles.periodText,
                  period === item.value && styles.periodTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#2563eb"
            style={styles.loader}
          />
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {data ? (
          <>
            <View style={styles.statsGrid}>
              <StatCard label="Entrant" value={data.summary.entrant} icon="↙" />
              <StatCard label="Sortant" value={data.summary.sortant} icon="↗" />
              <StatCard label="En attente" value={data.summary.enAttente} icon="◷" />
              <StatCard label="Archivés" value={data.summary.archives} icon="▣" />
            </View>

            <Card title="Courrier Mensuel" subtitle="Entrant vs Sortant">
              <SimpleBarChart data={data.monthlyCourriers} />
            </Card>

            <Card title="Courrier par Catégorie" subtitle="Répartition des courriers">
              {data.categoryDistribution.map(item => (
                <CategoryRow
                  key={item.name}
                  name={item.name}
                  percentage={Number(item.percentage)}
                />
              ))}
            </Card>

            <Card title="Activité Utilisateurs" subtitle="Actions cette semaine">
              <SimpleLineChart data={data.userActivity} />
            </Card>

            <Card title="Indicateurs Clés">
              {data.keyIndicators.map(item => (
                <KpiRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  delta={item.delta}
                  isPositive={item.isPositive}
                />
              ))}
            </Card>
          </>
        ) : null}
      </ScrollView>

      <BottomNav navigation={navigation} activeRoute="Accueil" />
    </SafeAreaView>
  );
};

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>
      <Text style={styles.statIconText}>{icon}</Text>
    </View>

    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const Card = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
    {children}
  </View>
);

const SimpleBarChart = ({
  data,
}: {
  data: { label: string; entrant: number; sortant: number }[];
}) => {
  const max = Math.max(
    1,
    ...data.map(item => Math.max(item.entrant, item.sortant))
  );

  return (
    <View style={styles.barChart}>
      {data.map(item => (
        <View key={item.label} style={styles.barItem}>
          <View style={styles.barWrapper}>
            <View
              style={[
                styles.barEntrant,
                { height: `${(item.entrant / max) * 100}%` },
              ]}
            />

            <View
              style={[
                styles.barSortant,
                { height: `${(item.sortant / max) * 100}%` },
              ]}
            />
          </View>

          <Text style={styles.chartLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

const SimpleLineChart = ({
  data,
}: {
  data: { label: string; count: number }[];
}) => {
  const max = Math.max(1, ...data.map(item => item.count));

  return (
    <View style={styles.lineChart}>
      {data.map(item => (
        <View key={item.label} style={styles.lineItem}>
          <View
            style={[
              styles.lineDot,
              {
                marginTop: 70 - (item.count / max) * 60,
              },
            ]}
          />

          <Text style={styles.chartLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

const CategoryRow = ({
  name,
  percentage,
}: {
  name: string;
  percentage: number;
}) => (
  <View style={styles.categoryRow}>
    <Text style={styles.categoryName}>{name}</Text>

    <View style={styles.categoryBarBg}>
      <View
        style={[
          styles.categoryBarFill,
          { width: `${percentage}%` },
        ]}
      />
    </View>

    <Text style={styles.categoryPercent}>{percentage}%</Text>
  </View>
);

const KpiRow = ({
  label,
  value,
  delta,
  isPositive,
}: {
  label: string;
  value: string;
  delta: string;
  isPositive: boolean;
}) => (
  <View style={styles.kpiRow}>
    <Text style={styles.kpiLabel}>{label}</Text>

    <View style={styles.kpiRight}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text
        style={[
          styles.kpiDelta,
          isPositive ? styles.kpiPositive : styles.kpiNegative,
        ]}
      >
        {delta}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  topBar: {
    height: 68,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  back: {
    fontSize: 38,
    color: '#334155',
    marginRight: 14,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },

  menu: {
    fontSize: 24,
    color: '#334155',
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  sectionTitle: {
    color: '#334155',
    fontWeight: '900',
    marginBottom: 10,
  },

  periodRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  periodChip: {
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginRight: 8,
  },

  periodChipActive: {
    backgroundColor: '#1455ff',
  },

  periodText: {
    color: '#64748b',
    fontWeight: '900',
    fontSize: 12,
  },

  periodTextActive: {
    color: '#ffffff',
  },

  loader: {
    marginTop: 40,
  },

  errorBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    padding: 14,
  },

  errorText: {
    color: '#dc2626',
    fontWeight: '800',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  statIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  statIconText: {
    color: '#1455ff',
    fontSize: 20,
    fontWeight: '900',
  },

  statValue: {
    color: '#0f172a',
    fontSize: 25,
    fontWeight: '900',
  },

  statLabel: {
    color: '#64748b',
    marginTop: 2,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTitle: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 16,
  },

  cardSubtitle: {
    color: '#94a3b8',
    marginTop: 3,
    marginBottom: 14,
  },

  barChart: {
    height: 180,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 14,
  },

  barItem: {
    alignItems: 'center',
    flex: 1,
  },

  barWrapper: {
    height: 130,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  barEntrant: {
    width: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    marginRight: 4,
  },

  barSortant: {
    width: 12,
    backgroundColor: '#818cf8',
    borderRadius: 4,
  },

  lineChart: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
  },

  lineItem: {
    alignItems: 'center',
    flex: 1,
  },

  lineDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#2563eb',
    marginBottom: 6,
  },

  chartLabel: {
    marginTop: 6,
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },

  categoryName: {
    flex: 1,
    color: '#334155',
    fontWeight: '700',
  },

  categoryBarBg: {
    width: 90,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#eef2f7',
    marginRight: 12,
  },

  categoryBarFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#2563eb',
  },

  categoryPercent: {
    width: 40,
    textAlign: 'right',
    color: '#0f172a',
    fontWeight: '900',
  },

  kpiRow: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  kpiLabel: {
    color: '#334155',
    fontSize: 15,
  },

  kpiRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  kpiValue: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 16,
    marginRight: 10,
  },

  kpiDelta: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    fontWeight: '900',
    fontSize: 12,
  },

  kpiPositive: {
    color: '#16a34a',
    backgroundColor: '#dcfce7',
  },

  kpiNegative: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
  },
});