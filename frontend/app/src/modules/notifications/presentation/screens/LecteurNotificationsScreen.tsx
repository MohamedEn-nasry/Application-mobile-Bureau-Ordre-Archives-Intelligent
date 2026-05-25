import React, { useState, useMemo } from 'react';
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
import { useLecteurNotifications } from '../hooks/useLecteurNotifications';
import { LecteurBottomNav } from '../../../../shared/presentation/components/LecteurBottomNav';
import { Roles } from '../../../../shared/constants/roles';
import { Routes } from '../../../../shared/constants/routes';
import { useThemeStyles } from '../../../../application/providers/ThemeProvider';

export const LecteurNotificationsScreen = ({ navigation, route }: any) => {
  const styles = useThemeStyles(localStyles);
  const currentUserId = Number(route?.params?.userId ?? 0);

  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Tout' | 'Mises à jour' | 'Rappels'>('Tout');

  const {
    notifications,
    unreadCount,
    isLoading,
    isActionLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useLecteurNotifications();

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeTab === 'Mises à jour') {
        const type = String(n.Type ?? '').toLowerCase();
        return type.includes('status') || type.includes('mise') || type.includes('update') || type.includes('assigned');
      }
      if (activeTab === 'Rappels') {
        const type = String(n.Type ?? '').toLowerCase();
        return type.includes('rappel') || type.includes('deadline');
      }
      return true;
    });
  }, [notifications, activeTab]);

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
    if (value === null || value === undefined) return null;
    return Number(value);
  };

  const handleNotificationPress = async (notification: Notification) => {
    setOpenedMenuId(null);
    const notificationId = getNotificationId(notification);
    const isRead = getNotificationIsRead(notification);
    const entityId = getNotificationEntityId(notification);

    if (!isRead && notificationId && !Number.isNaN(notificationId)) {
      await markAsRead(notificationId);
    }

    if (entityId && !Number.isNaN(entityId)) {
      navigation.navigate(Routes.Lecteur.CourrierDetail, {
        id: entityId,
        roleName: Roles.LECTEUR,
        userId: currentUserId,
      });
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const isRead = getNotificationIsRead(item);
    const typeStr = String(item.Type ?? '').toLowerCase();
    
    let isUpdate = typeStr.includes('status') || typeStr.includes('mise') || typeStr.includes('update') || typeStr.includes('assigned');
    let isReminder = typeStr.includes('rappel') || typeStr.includes('deadline');
    let isArchive = typeStr.includes('archive');

    let badgeText = 'Notification';
    let badgeBg = '#f1f5f9';
    let badgeColor = '#64748b';
    let icon = '🔔';
    let iconBg = '#f1f5f9';

    if (isUpdate) {
      badgeText = 'Mise à jour';
      badgeBg = '#eff6ff';
      badgeColor = '#3b82f6';
      icon = '🔄';
      iconBg = '#eff6ff';
    } else if (isArchive) {
      badgeText = 'Archive';
      badgeBg = '#fff7ed';
      badgeColor = '#f97316';
      icon = '📦';
      iconBg = '#fff7ed';
    } else if (isReminder) {
      badgeText = 'Rappel';
      badgeBg = '#f3e8ff';
      badgeColor = '#a855f7';
      icon = '🔔';
      iconBg = '#f3e8ff';
    }

    return (
      <View style={[styles.card, !isRead && styles.cardUnread]}>
        <View style={styles.cardTopRow}>
          <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          
          <View style={styles.cardHeaderContent}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {item.Title}
              </Text>
              {!isRead && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.message} numberOfLines={2}>
              {item.Message}
            </Text>
            
            <View style={styles.cardMetaRow}>
              <View style={[styles.badgePill, { backgroundColor: badgeBg }]}>
                <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
              </View>
              <Text style={styles.dateText}>
                {formatDateTime(item.CreatedAt)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardActionsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            disabled={isActionLoading || isRead}
            onPress={() => {
              if (!isRead) {
                markAsRead(getNotificationId(item));
              }
            }}
          >
            <Text style={[styles.actionText, isRead && styles.actionTextDisabled]}>
              Marquer lu
            </Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity 
            style={styles.actionButton}
            disabled={isActionLoading}
            onPress={() => handleNotificationPress(item)}
          >
            <Text style={styles.actionTextBlue}>Voir le courrier ›</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerArea}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>{unreadCount} non lues</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.readAllButton, (isActionLoading || unreadCount === 0) && styles.readAllButtonDisabled]}
            onPress={async () => {
              await markAllAsRead();
              await refetch();
            }}
            disabled={isActionLoading || unreadCount === 0}
          >
            <Text style={styles.readAllText}>
              {isActionLoading ? '...' : '✓ Tout lire'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsRow}>
          {(['Tout', 'Mises à jour', 'Rappels'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.contentArea}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refetch}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {isLoading ? (
          <ActivityIndicator size="large" color="#3B36D3" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredNotifications}
            keyExtractor={item => String(getNotificationId(item))}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>Aucune notification</Text>
                <Text style={styles.emptySubtitle}>Vos alertes apparaîtront ici.</Text>
              </View>
            }
          />
        )}
      </View>

      <LecteurBottomNav navigation={navigation} active="alerts" unreadCount={unreadCount} userId={currentUserId} />
    </SafeAreaView>
  );
};

const formatDateTime = (date: Date | string) => {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  
  return value.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B36D3',
  },
  headerArea: {
    backgroundColor: '#3B36D3',
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
  },
  headerSubtitle: {
    marginTop: 4,
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '500',
  },
  readAllButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  readAllButtonDisabled: {
    opacity: 0.5,
  },
  readAllText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#ffffff',
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  cardUnread: {
    borderColor: '#818cf8',
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
  },
  cardTopRow: {
    flexDirection: 'row',
    padding: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 20,
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    flex: 1,
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 16,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4f46e5',
    marginLeft: 8,
  },
  message: {
    marginTop: 6,
    color: '#64748b',
    lineHeight: 20,
    fontSize: 14,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  dateText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  cardActionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#f1f5f9',
  },
  actionText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 14,
  },
  actionTextDisabled: {
    color: '#cbd5e1',
  },
  actionTextBlue: {
    color: '#4f46e5',
    fontWeight: '800',
    fontSize: 14,
  },
  errorBox: {
    margin: 16,
    backgroundColor: '#fee2e2',
    padding: 14,
    borderRadius: 12,
  },
  errorText: {
    color: '#dc2626',
    fontWeight: '700',
  },
  retryText: {
    marginTop: 8,
    color: '#4f46e5',
    fontWeight: '900',
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
  },
  emptySubtitle: {
    marginTop: 6,
    color: '#64748b',
  },
});
