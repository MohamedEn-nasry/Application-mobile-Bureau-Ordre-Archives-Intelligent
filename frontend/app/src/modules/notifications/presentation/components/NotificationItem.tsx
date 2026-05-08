import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notification, NotificationType } from '../../domain/entities/Notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onPress?: (notification: Notification) => void;
}

const notificationConfig: Record<NotificationType, { icon: string; iconColor: string; bgColor: string; borderColor: string; dotColor: string }> = {
  [NotificationType.SECURITY]: {
    icon: 'shield-checkmark',
    iconColor: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    dotColor: '#ef4444',
  },
  [NotificationType.SYSTEM]: {
    icon: 'settings',
    iconColor: '#475569',
    bgColor: '#f8fafc',
    borderColor: '#e2e8f0',
    dotColor: '#64748b',
  },
  [NotificationType.MAIL]: {
    icon: 'mail',
    iconColor: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#dbeafe',
    dotColor: '#3b82f6',
  },
  [NotificationType.USER]: {
    icon: 'person-add',
    iconColor: '#16a34a',
    bgColor: '#f0fdf4',
    borderColor: '#dcfce7',
    dotColor: '#22c55e',
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 2,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#3b82f6',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  message: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    color: '#94a3b8',
  },
  actionText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onPress,
}) => {
  const config = notificationConfig[notification.Type];
  const isRead = notification.IsRead;

  const handlePress = () => {
    if (!isRead) {
      onMarkAsRead(notification.id);
    }
    if (onPress) {
      onPress(notification);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        { borderColor: config.borderColor, borderWidth: 1 }
      ]}
      activeOpacity={0.8}
    >
      {/* Unread indicator */}
      {!isRead && <View style={styles.unreadIndicator} />}

      <View style={styles.contentContainer}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
          <Ionicons name={config.icon as any} size={15} color={config.iconColor} />
        </View>

        {/* Content */}
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text style={[
              styles.title,
              { color: isRead ? '#334155' : '#0f172a' }
            ]}>
              {notification.Title}
            </Text>
            {!isRead && (
              <View style={[styles.unreadDot, { backgroundColor: config.dotColor }]} />
            )}
          </View>
          <Text style={styles.message}>{notification.Message}</Text>
          <View style={styles.footer}>
            <Text style={styles.time}>{notification.TimeAgo}</Text>
            {notification.ActionText && (
              <Text style={styles.actionText}>
                {notification.ActionText} {notification.ActionUrl && '->'}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
