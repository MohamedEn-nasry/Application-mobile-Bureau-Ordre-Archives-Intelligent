import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDashboard } from '../hooks/useDashboard';
import { GetDashboardStatsUseCase } from '../../domain/usecases/GetDashboardStatsUseCase';
import { GetRecentActivitiesUseCase } from '../../domain/usecases/GetRecentActivitiesUseCase';
import { DashboardStats, DashboardActivity } from '../../domain/entities/DashboardStats';

/**
 * Lecteur Dashboard Screen component props
 */
export interface LecteurDashboardScreenProps {
  getDashboardStatsUseCase: GetDashboardStatsUseCase;
  getRecentActivitiesUseCase: GetRecentActivitiesUseCase;
}

/**
 * Lecteur Dashboard Screen component
 * Displays dashboard overview for reader role users
 */
export const LecteurDashboardScreen: React.FC<LecteurDashboardScreenProps> = ({
  getDashboardStatsUseCase,
  getRecentActivitiesUseCase,
}) => {
  const { state, refreshDashboard, loadDashboard, clearError } = useDashboard(
    getDashboardStatsUseCase,
    getRecentActivitiesUseCase
  );

  useEffect(() => {
    // Load dashboard data on component mount
    loadDashboard();
  }, [loadDashboard]);

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    refreshDashboard();
  };

  /**
   * Format number with K, M suffix
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  /**
   * Render stat card
   */
  const renderStatCard = (title: string, value: string, subtitle?: string, color: string = '#007AFF') => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  /**
   * Render activity item
   */
  const renderActivityItem = (activity: DashboardActivity) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityIconText}>
          {activity.type.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription} numberOfLines={2}>
          {activity.description}
        </Text>
        <Text style={styles.activityTime}>
          {activity.timestamp.toLocaleDateString()} • {activity.timestamp.toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  /**
   * Render loading indicator
   */
  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
    </View>
  );

  if (state.isLoading && !state.stats) {
    return renderLoadingIndicator();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de Bord</Text>
      
      {/* Error display */}
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.retryButton}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={state.refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aperçu</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Archives', formatNumber(state.stats?.totalArchives || 0))}
            {renderStatCard('Courriers', formatNumber(state.stats?.totalCourriers || 0))}
            {renderStatCard('Documents', formatNumber(state.stats?.totalDocuments || 0))}
            {renderStatCard('Notifications', formatNumber(state.stats?.unreadNotifications || 0))}
          </View>
        </View>

        {/* Priority Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Éléments Prioritaires</Text>
          <View style={styles.priorityGrid}>
            {renderStatCard(
              'En Attente',
              formatNumber(state.stats?.pendingCourriers || 0),
              'Courriers en attente de traitement',
              '#FFA500'
            )}
            {renderStatCard(
              'Urgent',
              formatNumber(state.stats?.urgentCourriers || 0),
              'Courriers urgents',
              '#FF0000'
            )}
            {renderStatCard(
              'Archives Expirant',
              formatNumber(state.stats?.archiveStats.expiringSoon || 0),
              'Archives expirant bientôt',
              '#FF6B6B'
            )}
            {renderStatCard(
              'Utilisateurs Actifs',
              formatNumber(state.stats?.activeUsers || 0),
              'Utilisateurs connectés',
              '#00FF00'
            )}
          </View>
        </View>

        {/* Processing Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques de Traitement</Text>
          <View style={styles.processingContainer}>
            <View style={styles.processingItem}>
              <Text style={styles.processingLabel}>Efficacité</Text>
              <Text style={styles.processingValue}>
                {state.stats ? Math.round((state.stats.processedCourriers / state.stats.totalCourriers) * 100) : 0}%
              </Text>
            </View>
            <View style={styles.processingItem}>
              <Text style={styles.processingLabel}>Total En Attente</Text>
              <Text style={styles.processingValue}>
                {(state.stats?.pendingCourriers || 0) + (state.stats?.unreadNotifications || 0)}
              </Text>
            </View>
            <View style={styles.processingItem}>
              <Text style={styles.processingLabel}>Priorité</Text>
              <Text style={[styles.processingValue, { color: getPriorityColor(getPriorityLevel(state.stats || undefined)) }]}>
                {getPriorityLevel(state.stats || undefined)}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activités Récentes</Text>
          <View style={styles.activitiesContainer}>
            {state.recentActivities.length > 0 ? (
              state.recentActivities.map((activity) => (
                <View key={activity.id}>
                  {renderActivityItem(activity)}
                </View>
              ))
            ) : (
              <View style={styles.emptyActivities}>
                <Text style={styles.emptyActivitiesText}>Aucune activité récente</Text>
              </View>
            )}
          </View>
        </View>

        {/* Document Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques des Documents</Text>
          <View style={styles.documentStatsContainer}>
            <View style={styles.documentStatItem}>
              <Text style={styles.documentStatLabel}>Taille Totale</Text>
              <Text style={styles.documentStatValue}>
                {formatFileSize(state.stats?.documentStats.totalSize || 0)}
              </Text>
            </View>
            <View style={styles.documentStatItem}>
              <Text style={styles.documentStatLabel}>Téléversements Récents</Text>
              <Text style={styles.documentStatValue}>
                {state.stats?.documentStats.recentUploads || 0}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

/**
 * Helper function to get priority color
 */
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return '#FF0000';
    case 'high': return '#FF6B6B';
    case 'medium': return '#FFA500';
    case 'low': return '#00FF00';
    default: return '#007AFF';
  }
}

/**
 * Helper function to get priority level
 */
function getPriorityLevel(stats?: DashboardStats): string {
  if (!stats) return 'low';
  
  const urgentCourriers = stats.urgentCourriers;
  const pendingCourriers = stats.pendingCourriers;
  const expiringSoon = stats.archiveStats.expiringSoon;
  
  if (urgentCourriers > 10 || pendingCourriers > 50 || expiringSoon > 20) {
    return 'critical';
  }
  if (urgentCourriers > 5 || pendingCourriers > 25 || expiringSoon > 10) {
    return 'high';
  }
  if (urgentCourriers > 0 || pendingCourriers > 10 || expiringSoon > 5) {
    return 'medium';
  }
  return 'low';
}

/**
 * Helper function to format file size
 */
function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let fileSize = bytes;
  let unitIndex = 0;
  
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }
  
  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#1a1a1a',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderColor: '#fcc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#d00',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  processingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  processingItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  processingLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  processingValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  activitiesContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 10,
    color: '#999',
  },
  emptyActivities: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyActivitiesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  documentStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentStatItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  documentStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
