import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Notification } from '../../domain/entities/Notification';
import { useNotifications } from '../hooks/useNotifications';
import { BottomNav } from '../../../../shared/presentation/components/BottomNav';

export const NotificationsScreen = ({ navigation }: any) => {
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

  const handleOpenNotification = async (notification: Notification) => {
    if (!notification.IsRead) {
      await markAsRead(Number(notification.id));
    }

    if (notification.EntityType === 'Courrier' && notification.EntityId) {
      navigation.navigate('CourrierDetail', {
        id: notification.EntityId,
      });
    }
  };

  const handleDelete = (notification: Notification) => {
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
          onPress: () => deleteNotification(Number(notification.id)),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Notification }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.card,
          !item.IsRead && styles.cardUnread,
        ]}
        onPress={() => handleOpenNotification(item)}
        onLongPress={() => handleDelete(item)}
      >
        <View style={styles.iconBox}>
          <Text style={styles.icon}>{getNotificationIcon(item.Type)}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.notificationTitle} numberOfLines={1}>
              {item.Title}
            </Text>

            {!item.IsRead ? <View style={styles.unreadDot} /> : null}
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {item.Message}
          </Text>

          <View style={styles.footerRow}>
            <Text style={styles.typeText}>
              {getTypeLabel(item.Type)}
            </Text>

            <Text style={styles.dateText}>
              {formatDateTime(item.CreatedAt)}
            </Text>
          </View>
        </View>
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
          style={styles.readAllButton}
          onPress={markAllAsRead}
          disabled={isActionLoading || unreadCount === 0}
        >
          <Text style={styles.readAllText}>Tout lire</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            !onlyUnread && styles.filterButtonActive,
          ]}
          onPress={() => setOnlyUnread(false)}
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
          onPress={() => setOnlyUnread(true)}
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
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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

      <BottomNav navigation={navigation} activeRoute="Alertes" />
    </SafeAreaView>
  );
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'CourrierAssigned':
      return '📩';
    case 'CourrierStatusChanged':
      return '🔄';
    case 'Deadline':
      return '⏰';
    default:
      return '🔔';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'CourrierAssigned':
      return 'Courrier assigné';
    case 'CourrierStatusChanged':
      return 'Statut modifié';
    case 'Deadline':
      return 'Échéance';
    default:
      return 'Notification';
  }
};

const formatDateTime = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
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
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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