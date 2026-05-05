import React from 'react';
import { NotificationsScreen } from './NotificationsScreen';
import { useNotificationsDependencies } from '../providers/NotificationsProvider';

interface ConnectedNotificationsScreenProps {
  navigation: any;
}

export const ConnectedNotificationsScreen: React.FC<ConnectedNotificationsScreenProps> = ({ navigation }) => {
  const {
    getNotificationsUseCase,
    markAsReadUseCase,
    markAllAsReadUseCase,
    getUnreadCountUseCase,
  } = useNotificationsDependencies();

  return (
    <NotificationsScreen
      getNotificationsUseCase={getNotificationsUseCase}
      markAsReadUseCase={markAsReadUseCase}
      markAllAsReadUseCase={markAllAsReadUseCase}
      getUnreadCountUseCase={getUnreadCountUseCase}
      navigation={navigation}
    />
  );
};
