import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Notification } from '../../domain/entities/Notification';
import { useNotifications } from '../hooks/useNotifications';
import { BottomNav } from '../../../../shared/presentation/components/BottomNav';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';
import { Roles } from '../../../../shared/constants/roles';
import { Routes } from '../../../../shared/constants/routes';

export const NotificationsScreen = ({ navigation, route }: any) => {
  const roleName = route?.params?.roleName ?? Roles.ADMIN;
  const currentUserId = Number(route?.params?.userId ?? 0);

  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);

  const {
    notifications,
    unreadCount,
    onlyUnread,
    setOnlyUnread,
    isLoading,
    isActionLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const getNotificationId = (notification: any) => {
    return Number(notification?.id ?? notification?.Id);
  };

  const getNotificationIsRead = (notification: any) => {
    return Boolean(notification?.IsRead ?? notification?.isRead);
  };

  const getNotificationEntityType = (notification: any) => {
    return String(notification?.EntityType ?? notification?.entityType ?? '');
  };

  const getNotificationEntityId = (notification: any) => {
    const value = notification?.EntityId ?? notification?.entityId;

    if (value === null || value === undefined) {
      return null;
    }

    return Number(value);
  };

  const handleNotificationPress = async (notification: Notification) => {
    setOpenedMenuId(null);

    const notificationId = getNotificationId(notification);
    const isRead = getNotificationIsRead(notification);
    const entityType = getNotificationEntityType(notification);
    const entityId = getNotificationEntityId(notification);

    if (!isRead && notificationId && !Number.isNaN(notificationId)) {
      await markAsRead(notificationId);
    }

    if (
      entityType.toLowerCase() === 'courrier' &&
      entityId &&
      !Number.isNaN(entityId)
    ) {
      if (roleName === Roles.AGENT) {
        navigation.navigate(Routes.Agent.CourrierDetail, {
          id: entityId,
          roleName: Roles.AGENT,
          userId: currentUserId,
        });
        return;
      }

      navigation.navigate(Routes.Admin.CourrierDetail, {
        id: entityId,
        roleName: Roles.ADMIN,
        userId: currentUserId,
      });
    }
  };

  const doDeleteNotification = async (notification: Notification) => {
    const notificationId = getNotificationId(notification);

    if (!notificationId || Number.isNaN(notificationId)) {
      Alert.alert('Erreur', 'Notification invalide.');
      return;
    }

    setOpenedMenuId(null);

    const success = await deleteNotification(notificationId);

    if (success !== false) {
      await refetch();
    }
  };

  const handleDelete = (notification: Notification) => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof globalThis !== 'undefined' &&
          typeof (globalThis as any).confirm === 'function'
          ? (globalThis as any).confirm(
            'Voulez-vous vraiment supprimer cette notification ?'
          )
          : true;

      if (confirmed) {
        doDeleteNotification(notification);
      }

      return;
    }

    Alert.alert(
      'Supprimer la notification',
      'Voulez-vous vraiment supprimer cette notification ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => doDeleteNotification(notification),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const isRead = getNotificationIsRead(item);
    const notificationId = String(getNotificationId(item));
    const isMenuOpen = openedMenuId === notificationId;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.card, !isRead && styles.cardUnread]}
        onPress={() => handleNotificationPress(item)}
        disabled={isActionLoading}
      >
        <View style={styles.iconBox}>
          <Text style={styles.icon}>{getNotificationIcon(item.Type)}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.notificationTitle} numberOfLines={1}>
              {item.Title}
            </Text>

            {!isRead ? <View style={styles.unreadDot} /> : null}
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {item.Message}
          </Text>

          <View style={styles.footerRow}>
            <Text style={styles.typeText}>{getTypeLabel(item.Type)}</Text>

            <Text style={styles.dateText}>
              {formatDateTime(item.CreatedAt)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.8}
          disabled={isActionLoading}
          onPress={(event: any) => {
            event?.stopPropagation?.();
            setOpenedMenuId(isMenuOpen ? null : notificationId);
          }}
        >
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>

        {isMenuOpen ? (
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.85}
              disabled={isActionLoading}
              onPress={(event: any) => {
                event?.stopPropagation?.();
                handleDelete(item);
              }}
            >
              <Text style={styles.menuDeleteText}>
                {isActionLoading ? '...' : 'Supprimer'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alertes</Text>

          <Text style={styles.subtitle}>
            {unreadCount} notification(s) non lue(s)
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.readAllButton,
            (isActionLoading || unreadCount === 0) &&
            styles.readAllButtonDisabled,
          ]}
          onPress={async () => {
            setOpenedMenuId(null);
            await markAllAsRead();
            await refetch();
          }}
          disabled={isActionLoading || unreadCount === 0}
        >
          <Text style={styles.readAllText}>
            {isActionLoading ? '...' : 'Tout lire'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            !onlyUnread && styles.filterButtonActive,
          ]}
          onPress={() => {
            setOpenedMenuId(null);
            setOnlyUnread(false);
          }}
        >
          <Text
            style={[
              styles.filterText,
              !onlyUnread && styles.filterTextActive,
            ]}
          >
            Toutes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            onlyUnread && styles.filterButtonActive,
          ]}
          onPress={() => {
            setOpenedMenuId(null);
            setOnlyUnread(true);
          }}
        >
          <Text
            style={[
              styles.filterText,
              onlyUnread && styles.filterTextActive,
            ]}
          >
            Non lues
          </Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity onPress={refetch}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => setOpenedMenuId(null)}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Aucune notification</Text>

              <Text style={styles.emptySubtitle}>
                Les nouvelles alertes apparaîtront ici.
              </Text>
            </View>
          }
        />
      )}

      {roleName === Roles.AGENT ? (
        <AgentBottomNav
          navigation={navigation}
          active="alerts"
          unreadCount={unreadCount}
          userId={currentUserId}
        />
      ) : (
        <BottomNav navigation={navigation} activeRoute="Alertes" />
      )}
    </SafeAreaView>
  );
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'CourrierAssigned':
    case 'COURRIER_ASSIGNED':
    case 'ASSIGNED':
      return '📩';

    case 'CourrierStatusChanged':
    case 'STATUS_CHANGED':
    case 'StatusChanged':
      return '🔄';

    case 'Deadline':
    case 'DEADLINE':
      return '⏰';

    default:
      return '🔔';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'CourrierAssigned':
    case 'COURRIER_ASSIGNED':
    case 'ASSIGNED':
      return 'Courrier assigné';

    case 'CourrierStatusChanged':
    case 'STATUS_CHANGED':
    case 'StatusChanged':
      return 'Statut modifié';

    case 'Deadline':
    case 'DEADLINE':
      return 'Échéance';

    default:
      return 'Notification';
  }
};

const formatDateTime = (date: Date | string) => {
  const value = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return '';
  }

  return value.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },

  subtitle: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 14,
  },

  readAllButton: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },

  readAllButtonDisabled: {
    opacity: 0.55,
  },

  readAllText: {
    color: '#1455ff',
    fontWeight: '900',
  },

  filtersRow: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d9e2f0',
    marginRight: 10,
    backgroundColor: '#ffffff',
  },

  filterButtonActive: {
    backgroundColor: '#1455ff',
    borderColor: '#1455ff',
  },

  filterText: {
    color: '#334155',
    fontWeight: '800',
  },

  filterTextActive: {
    color: '#ffffff',
  },

  loader: {
    marginTop: 40,
  },

  listContent: {
    padding: 16,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#eef2f7',
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
    position: 'relative',
    overflow: 'visible',
  },

  cardUnread: {
    borderColor: '#bfdbfe',
    backgroundColor: '#f8fbff',
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 22,
  },

  cardContent: {
    flex: 1,
    paddingRight: 34,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  notificationTitle: {
    flex: 1,
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 16,
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1455ff',
    marginLeft: 8,
  },

  message: {
    marginTop: 6,
    color: '#475569',
    lineHeight: 20,
  },

  footerRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  typeText: {
    color: '#1455ff',
    fontWeight: '800',
    fontSize: 12,
  },

  dateText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 12,
  },

  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  menuDots: {
    color: '#475569',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 24,
  },

  menuDropdown: {
    position: 'absolute',
    top: 44,
    right: 10,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 30,
    overflow: 'hidden',
  },

  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 130,
  },

  menuDeleteText: {
    color: '#dc2626',
    fontWeight: '900',
    fontSize: 14,
  },

  errorBox: {
    margin: 16,
    backgroundColor: '#fee2e2',
    padding: 14,
    borderRadius: 16,
  },

  errorText: {
    color: '#dc2626',
    fontWeight: '700',
  },

  retryText: {
    marginTop: 8,
    color: '#1455ff',
    fontWeight: '900',
  },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
  },

  emptySubtitle: {
    marginTop: 6,
    color: '#94a3b8',
    textAlign: 'center',
  },
});