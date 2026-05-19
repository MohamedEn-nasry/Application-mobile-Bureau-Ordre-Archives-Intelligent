import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Notification, NotificationType } from '../../domain/entities/Notification';
import { NotificationItem } from './NotificationItem';

interface NotificationsListProps {
  notifications: Notification[];
  loading?: boolean;
  onMarkAsRead: (id: string) => void;
  onNotificationPress?: (notification: Notification) => void;
  onMarkAllAsRead?: () => void;
  selectedType?: NotificationType | 'all';
  onTypeChange?: (type: NotificationType | 'all') => void;
}

const types: { id: NotificationType | 'all'; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: NotificationType.SYSTEM, label: 'Système' },
  { id: NotificationType.MAIL, label: 'Courrier' },
  { id: NotificationType.SECURITY, label: 'Sécurité' },
  { id: NotificationType.USER, label: 'Utilisateurs' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingHorizontal: 16,
  },
  tabsList: {
    flexDirection: 'row',
    gap: 6,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  tabBadge: {
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabBadge: {
    backgroundColor: '#3b82f6',
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
  },
  activeTabBadgeText: {
    color: 'white',
  },
  markAllContainer: {
    backgroundColor: '#eff6ff',
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  markAllText: {
    fontSize: 12,
    color: '#1d4ed8',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  markAllButtonText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  loading = false,
  onMarkAsRead,
  onNotificationPress,
  onMarkAllAsRead,
  selectedType = 'all',
  onTypeChange,
}) => {
  const unreadCount = notifications.filter(n => !n.IsRead).length;
  const filteredNotifications = selectedType === 'all' 
    ? notifications 
    : notifications.filter(n => n.Type === selectedType);

  const getUnreadCountForType = (type: NotificationType | 'all') => {
    if (type === 'all') return unreadCount;
    return notifications.filter(n => n.Type === type && !n.IsRead).length;
  };

  const renderTab = (tab: typeof types[0]) => {
    const isActive = selectedType === tab.id;
    const count = getUnreadCountForType(tab.id);

    return (
      <TouchableOpacity
        key={tab.id}
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={() => onTypeChange?.(tab.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {tab.label}
        </Text>
        {count > 0 && (
          <View style={[styles.tabBadge, isActive && styles.activeTabBadge]}>
            <Text style={[styles.tabBadgeText, isActive && styles.activeTabBadgeText]}>
              {count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="notifications-off" size={24} color="#94a3b8" />
      </View>
      <Text style={styles.emptyTitle}>Aucune notification</Text>
      <Text style={styles.emptySubtitle}>Tout est à jour dans cette catégorie</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          data={types}
          renderItem={({ item }) => renderTab(item)}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsList}
        />
      </View>

      {/* Mark all as read */}
      {unreadCount > 0 && onMarkAllAsRead && (
        <View style={styles.markAllContainer}>
          <Text style={styles.markAllText}>
            {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
          </Text>
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={onMarkAllAsRead}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-done" size={12} color="#2563eb" />
            <Text style={styles.markAllButtonText}>Tout marquer lu</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onMarkAsRead={onMarkAsRead}
            onPress={onNotificationPress}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
