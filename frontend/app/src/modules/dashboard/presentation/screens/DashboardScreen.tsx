import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { StatCard } from '../components/StatCard';
import { RecentActivityList } from '../components/RecentActivityList';
import { QuickActionsRow } from '../components/QuickActionsRow';
import { PendingMailBanner } from '../components/PendingMailBanner';
import { BottomNav } from '../../../../shared/presentation/components/BottomNav';
import { useAuthSession } from '../../../auth/presentation/hooks/useAuthSession';
import { NotificationBadge } from '../../../notifications/presentation/components/NotificationBadge';
import { useUnreadNotificationsCount } from '../../../notifications/presentation/hooks/useUnreadCount';
import { useNotificationsDependencies } from '../../../notifications/presentation/providers/NotificationsProvider';
import { Routes } from '../../../../shared/constants/routes';

interface Props {
  navigation: any; // typed properly once NativeStackNavigationProp is configured
}


export const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const {
    stats,
    activities,
    quickActions,
    isLoadingStats,
    isLoadingActivities,
    errorStats,
    errorActivities,
    refetch,
  } = useAdminDashboard();

  const { session } = useAuthSession();
  const userName = session?.fullName || 'Utilisateur';


  const { unreadCount } = useUnreadNotificationsCount();

  const handleNotificationsPress = () => {
    navigation.navigate(Routes.Admin.Notifications);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isRefreshing = isLoadingStats || isLoadingActivities;

  // ── Error state ──────────────────────────────────────────────────────────
  if (!isLoadingStats && !isLoadingActivities && (errorStats || errorActivities)) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>Erreur de chargement</Text>
        <Text style={styles.errorMessage}>{errorStats ?? errorActivities}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Initial loading skeleton ─────────────────────────────────────────────
  if (isLoadingStats && !stats) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Chargement du tableau de bord…</Text>
      </SafeAreaView>
    );
  }

  // ── Happy path ───────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />

      {/* ── Gradient header ── */}
      <LinearGradient
        colors={['#1D4ED8', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={['top']} style={styles.headerInner}>
          {/* Top row */}
          <View style={styles.headerTop}>
            <View style={styles.avatarGroup}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(userName)}</Text>
              </View>
              <View>
                <Text style={styles.welcome}>Bienvenue,</Text>
                <Text style={styles.adminName}>{userName}</Text>
              </View>
            </View>
            <NotificationBadge
              count={unreadCount}
              onPress={handleNotificationsPress}
              size={20}
              color="#FFFFFF"
            />
          </View>

          {/* Date */}
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('fr-MA', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </SafeAreaView>
      </LinearGradient>

      {/* ── Scrollable content ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            tintColor="#2563EB"
            colors={['#2563EB']}
          />
        }
      >
        {/* ── Summary cards: Users & Roles ── */}
        <Text style={styles.sectionTitle}>Vue d&apos;ensemble</Text>
        <View style={styles.statsGrid}>
          <StatCard
            value={stats?.totalUsers ?? '—'}
            label="Utilisateurs"
            subLabel="Total enregistrés"
            color="#2563EB"
            backgroundColor="#EFF6FF"
          />
          <StatCard
            value={stats?.totalAgents ?? '—'}
            label="Agents"
            subLabel="Rôle Agent"
            color="#4F46E5"
            backgroundColor="#EEF2FF"
          />
        </View>
        <View style={[styles.statsGrid, styles.statsGridSecond]}>
          <StatCard
            value={stats?.totalLecteurs ?? '—'}
            label="Lecteurs"
            subLabel="Rôle Lecteur"
            color="#0284C7"
            backgroundColor="#F0F9FF"
          />
          <StatCard
            value={stats?.totalReports ?? '—'}
            label="Rapports"
            subLabel="Générés"
            color="#7C3AED"
            backgroundColor="#F5F3FF"
          />
        </View>

        {/* ── Courrier stats ── */}
        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Courriers</Text>
        <View style={styles.statsGrid}>
          <StatCard
            value={stats?.incomingMail ?? '—'}
            label="Entrant"
            subLabel="+12% ce mois"
            color="#059669"
            backgroundColor="#ECFDF5"
          />
          <StatCard
            value={stats?.outgoingMail ?? '—'}
            label="Sortant"
            subLabel="+8% ce mois"
            color="#D97706"
            backgroundColor="#FFFBEB"
          />
        </View>
        <View style={[styles.statsGrid, styles.statsGridSecond]}>
          <StatCard
            value={stats?.pendingMail ?? '—'}
            label="En attente"
            subLabel="Nécessitent action"
            color="#DC2626"
            backgroundColor="#FEF2F2"
          />
          <StatCard
            value={stats?.archivedMail ?? '—'}
            label="Archivés"
            subLabel="Total archivé"
            color="#475569"
            backgroundColor="#F8FAFC"
          />
        </View>

        {/* ── Pending mail banner ── */}
        {stats && stats.pendingMail > 0 && (
          <View style={styles.sectionSpacing}>
            <PendingMailBanner
              pendingCount={stats.pendingMail}
              onPress={() => { navigation.navigate(Routes.Admin.CourrierOverview) }}
            />
          </View>
        )}

        {/* ── Quick actions ── */}
        <View style={styles.sectionSpacing}>
          <QuickActionsRow
            actions={quickActions}
            onPress={(routeName) => navigation.navigate(routeName)}
          />
        </View>

        {/* ── Recent activity ── */}
        <View style={styles.sectionSpacing}>
          {isLoadingActivities ? (
            <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 20 }} />
          ) : (
            <RecentActivityList
              activities={activities}
              onSeeAll={() => {/* navigate to activity log */ }}
            />
          )}
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} activeRoute="Accueil" />
    </View>
  );
};

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // ── Header
  header: {
    paddingBottom: 20,
  },
  headerInner: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  welcome: {
    color: '#BFDBFE',
    fontSize: 11,
  },
  adminName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#F87171',
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  dateText: {
    color: '#BFDBFE',
    fontSize: 12,
    textTransform: 'capitalize',
  },

  // ── Body
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 110,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  sectionSpacing: {
    marginTop: 20,
  },

  // ── Stats grid
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statsGridSecond: {
    marginTop: 10,
  },

  // ── States
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: '#64748B',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
