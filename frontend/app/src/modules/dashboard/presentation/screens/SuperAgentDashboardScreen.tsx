import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useSuperAgentDashboard } from '../hooks/useSuperAgentDashboard';
import { StatCard } from '../components/StatCardAg';
import { QuickActionCard } from '../components/QuickActionCardAg';
import { AssignedMailCard } from '../components/AssignedMailCard';
import { ActivityItem } from '../components/ActivityItem';
import { OcrResultCard } from '../components/OCRResultCard';

import { Routes } from '../../../../shared/constants/routes';
import { Roles } from '../../../../shared/constants/roles';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';
import { useAuthSession } from '../../../auth/presentation/hooks/useAuthSession';
import { useThemeStyles } from '../../../../application/providers/ThemeProvider';

export const SuperAgentDashboardScreen = ({ navigation, route }: any) => {
  const styles = useThemeStyles(localStyles);
  const { data, isLoading, error, refetch } = useSuperAgentDashboard();
  const { session } = useAuthSession();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Loading error'}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentUserId = Number(route?.params?.userId ?? session?.userId ?? 0);
  const currentRole = route?.params?.roleName || session?.role || Roles.SUPER_AGENT;
  const initials = getInitials(data.userName);

  const goToIncomingMail = () => {
    navigation.navigate(Routes.Agent.IncomingMail, {
      roleName: currentRole,
      userId: currentUserId,
    });
  };

  const goToCreateCourrier = (initialType: 'Entrant' | 'Sortant') => {
    navigation.navigate(Routes.Agent.CreateUpdateCourrier, {
      roleName: currentRole,
      userId: currentUserId,
      initialType,
    });
  };

  const goToCourrierDetail = (courrierId: number) => {
    navigation.navigate(Routes.Agent.CourrierDetail, {
      id: courrierId,
      courrierId,
      roleName: currentRole,
      userId: currentUserId,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Premium SuperAgent Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userRow}>
              {data.userImage ? (
                <Image source={{ uri: data.userImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              )}

              <View>
                <Text style={styles.greeting}>Hello, Supervisor</Text>
                <Text style={styles.userName}>{data.userName}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.bellButton}
              onPress={() =>
                navigation.navigate(Routes.Agent.Notifications, {
                  roleName: currentRole,
                  userId: currentUserId,
                })
              }
            >
              <Feather name="bell" size={22} color="#FFFFFF" />

              {data.unreadNotifications > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {data.unreadNotifications > 99
                      ? '99+'
                      : data.unreadNotifications}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>

          {/* Overseer search context */}
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color="#DDD6FE" />

            <TextInput
              placeholder="Search mail in your categories..."
              placeholderTextColor="#C7D2FE"
              style={styles.searchInput}
              onSubmitEditing={(event) =>
                navigation.navigate(Routes.Agent.CourrierOverview, {
                  roleName: currentRole,
                  userId: currentUserId,
                  searchQuery: event.nativeEvent.text,
                })
              }
            />
          </View>
        </View>

        <View style={styles.content}>
          {/* Overseen workloads (filtered by categories assigned to the SuperAgent) */}
          <View style={styles.cardsGrid}>
            <StatCard
              value={data.stats.incomingCount}
              label="Category Incoming"
              subLabel={`${data.stats.incomingPending} pending`}
              icon="inbox"
              color="#6D28D9"
              backgroundColor="#F5F3FF"
            />

            <StatCard
              value={data.stats.outgoingCount}
              label="Category Outgoing"
              subLabel={`${data.stats.outgoingDrafts} drafts`}
              icon="send"
              color="#0EA5E9"
              backgroundColor="#E0F2FE"
            />

            <StatCard
              value={data.stats.pendingTasksCount}
              label="Category Tasks"
              subLabel={data.stats.pendingTasksLabel}
              icon="clipboard"
              color="#F59E0B"
              backgroundColor="#FEF3C7"
            />

            <StatCard
              value={data.stats.recentScansCount}
              label="Category Scans"
              subLabel={data.stats.recentScansLabel}
              icon="maximize"
              color="#10B981"
              backgroundColor="#D1FAE5"
            />
          </View>

          <Text style={styles.sectionTitle}>Supervisor Actions</Text>

          <View style={styles.quickActionsRow}>
            <QuickActionCard
              label="Add Incoming"
              icon="inbox"
              color="#6D28D9"
              backgroundColor="#F5F3FF"
              onPress={() => goToCreateCourrier('Entrant')}
            />

            <QuickActionCard
              label="Add Outgoing"
              icon="send"
              color="#0EA5E9"
              backgroundColor="#E0F2FE"
              onPress={() => goToCreateCourrier('Sortant')}
            />

            <QuickActionCard
              label="Scan Document"
              icon="camera"
              color="#10B981"
              backgroundColor="#D1FAE5"
              onPress={() => console.log("Scanning functionality to integrate")}
            />

            <QuickActionCard
              label="OCR History"
              icon="file-text"
              color="#F59E0B"
              backgroundColor="#FEF3C7"
              onPress={() =>
                navigation.navigate(Routes.Agent.OcrResults, {
                  roleName: currentRole,
                  userId: currentUserId,
                })
              }
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Monitored Mails</Text>

            <TouchableOpacity onPress={goToIncomingMail}>
              <Text style={styles.viewAll}>View all ›</Text>
            </TouchableOpacity>
          </View>

          {data.assignedMails.map((mail) => (
            <AssignedMailCard
              key={mail.id}
              item={mail}
              onPress={() => goToCourrierDetail(mail.id)}
            />
          ))}

          <Text style={styles.sectionTitle}>Category Activity Stream</Text>

          <View style={styles.activityCard}>
            {data.recentActivities.map((activity) => (
              <ActivityItem key={activity.id} item={activity} />
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category OCR Results</Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.Agent.OcrResults, {
                  roleName: currentRole,
                  userId: currentUserId,
                })
              }
            >
              <Text style={styles.viewAll}>View all ›</Text>
            </TouchableOpacity>
          </View>

          {data.recentOcrResults.map((ocr) => (
            <OcrResultCard
              key={ocr.id}
              item={ocr}
              onPress={() => goToCourrierDetail(ocr.id)}
            />
          ))}
        </View>
      </ScrollView>

      <AgentBottomNav
        navigation={navigation}
        active="dashboard"
        unreadCount={data.unreadNotifications}
        userId={currentUserId}
        roleName={currentRole}
      />
    </View>
  );
};

const getInitials = (name: string) => {
  if (!name) return 'SA';

  const parts = name.trim().split(' ');

  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';

  return `${first}${second}`.toUpperCase() || 'SA';
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContent: {
    paddingBottom: 105,
  },

  header: {
    backgroundColor: '#6D28D9', // Premium Royal Purple
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },

  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
  },

  avatarInitials: {
    color: '#6D28D9',
    fontWeight: '900',
    fontSize: 17,
  },

  greeting: {
    color: '#DDD6FE',
    fontSize: 15,
  },

  userName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },

  bellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6D28D9',
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  searchBox: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 10,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 14,
    marginTop: 8,
  },

  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  sectionHeader: {
    marginTop: 6,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  viewAll: {
    color: '#6D28D9',
    fontWeight: '800',
  },

  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF2F7',
    paddingHorizontal: 20,
  },

  errorText: {
    color: '#DC2626',
    fontSize: 15,
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: '700',
  },

  retryButton: {
    backgroundColor: '#6D28D9',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
