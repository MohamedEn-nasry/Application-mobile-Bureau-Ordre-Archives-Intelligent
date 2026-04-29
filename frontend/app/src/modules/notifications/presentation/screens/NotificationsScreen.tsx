import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Notification, NotificationType } from '../../domain/entities/Notification';
import { NotificationsList } from '../components/NotificationsList';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkAsRead } from '../hooks/useMarkAsRead';
import { useMarkAllAsRead } from '../hooks/useMarkAllAsRead';
import { GetNotificationsUseCase } from '../../domain/usecases/GetNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from '../../domain/usecases/MarkNotificationAsReadUseCase';
import { MarkAllAsReadUseCase } from '../../domain/usecases/MarkAllAsReadUseCase';
import { GetUnreadCountUseCase } from '../../domain/usecases/GetUnreadCountUseCase';
import { BottomNav } from '../../../../shared/presentation/components/BottomNav';

interface NotificationsScreenProps {
  getNotificationsUseCase: GetNotificationsUseCase;
  markAsReadUseCase: MarkNotificationAsReadUseCase;
  markAllAsReadUseCase: MarkAllAsReadUseCase;
  getUnreadCountUseCase: GetUnreadCountUseCase;
  navigation: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
});

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  getNotificationsUseCase,
  markAsReadUseCase,
  markAllAsReadUseCase,
  getUnreadCountUseCase,
  navigation,
}) => {
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');

  const {
    notifications,
    loading,
    unreadCount,
    refresh,
  } = useNotifications({
    getNotificationsUseCase,
    getUnreadCountUseCase,
    type: selectedType === 'all' ? undefined : selectedType,
  });

  const { markAsRead } = useMarkAsRead({
    markAsReadUseCase,
  });

  const { markAllAsRead } = useMarkAllAsRead({
    markAllAsReadUseCase,
  });

  const handleMarkAsRead = async (id: string) => {
    const success = await markAsRead(id);
    if (success) {
      await refresh();
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();
    if (success) {
      await refresh();
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Handle notification press - navigate to relevant screen
    if (notification.ActionUrl) {
      // Navigate to action URL
      console.log('Navigate to:', notification.ActionUrl);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.content}>
        <NotificationsList
          notifications={notifications}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
          onNotificationPress={handleNotificationPress}
          onMarkAllAsRead={unreadCount > 0 ? handleMarkAllAsRead : undefined}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </View>
      
      <BottomNav active="alerts" navigation={navigation} />
    </SafeAreaView>
  );
};
