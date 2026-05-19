import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';

import { NotificationRemoteDataSource } from '../../data/datasources/NotificationsRemoteDataSource';
import { NotificationRepositoryImpl } from '../../data/repositories/NotificationsRepositoryImpl';

import { GetNotificationsUseCase } from '../../domain/usecases/GetNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from '../../domain/usecases/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../domain/usecases/MarkAllNotificationsAsReadUseCase';
import { GetUnreadNotificationsCountUseCase } from '../../domain/usecases/GetUnreadCountUseCase';
import { DeleteNotificationUseCase } from '../../domain/usecases/DeleteNotificationUseCase';

interface NotificationsDependencies {
  getNotificationsUseCase: GetNotificationsUseCase;
  markAsReadUseCase: MarkNotificationAsReadUseCase;
  markAllAsReadUseCase: MarkAllNotificationsAsReadUseCase;
  getUnreadCountUseCase: GetUnreadNotificationsCountUseCase;
  deleteNotificationUseCase: DeleteNotificationUseCase;
}

const NotificationsContext =
  createContext<NotificationsDependencies | null>(null);

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  const dependencies = useMemo<NotificationsDependencies>(() => {
    const dataSource = new NotificationRemoteDataSource();
    const repository = new NotificationRepositoryImpl(dataSource);

    return {
      getNotificationsUseCase: new GetNotificationsUseCase(repository),
      markAsReadUseCase: new MarkNotificationAsReadUseCase(repository),
      markAllAsReadUseCase: new MarkAllNotificationsAsReadUseCase(repository),
      getUnreadCountUseCase: new GetUnreadNotificationsCountUseCase(repository),
      deleteNotificationUseCase: new DeleteNotificationUseCase(repository),
    };
  }, []);

  return (
    <NotificationsContext.Provider value={dependencies}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsDependencies =
  (): NotificationsDependencies => {
    const context = useContext(NotificationsContext);

    if (!context) {
      throw new Error(
        'useNotificationsDependencies must be used within a NotificationsProvider'
      );
    }

    return context;
  };