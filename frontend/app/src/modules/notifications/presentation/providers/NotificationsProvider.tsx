import React, { createContext, useContext, ReactNode } from 'react';
import { NotificationsRemoteDataSource } from '../../data/datasources/NotificationsRemoteDataSource';
import { NotificationsRepositoryImpl } from '../../data/repositories/NotificationsRepositoryImpl';
import { GetNotificationsUseCase } from '../../domain/usecases/GetNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from '../../domain/usecases/MarkNotificationAsReadUseCase';
import { MarkNotificationAsUnreadUseCase } from '../../domain/usecases/MarkNotificationAsUnreadUseCase';
import { MarkAllAsReadUseCase } from '../../domain/usecases/MarkAllAsReadUseCase';
import { GetUnreadCountUseCase } from '../../domain/usecases/GetUnreadCountUseCase';

interface NotificationsDependencies {
  getNotificationsUseCase: GetNotificationsUseCase;
  markAsReadUseCase: MarkNotificationAsReadUseCase;
  markAsUnreadUseCase: MarkNotificationAsUnreadUseCase;
  markAllAsReadUseCase: MarkAllAsReadUseCase;
  getUnreadCountUseCase: GetUnreadCountUseCase;
}

const NotificationsContext = createContext<NotificationsDependencies | null>(null);

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  // Initialize data source
  const dataSource = new NotificationsRemoteDataSource();

  // Initialize repository
  const repository = new NotificationsRepositoryImpl(dataSource);

  // Initialize use cases
  const getNotificationsUseCase = new GetNotificationsUseCase(repository);
  const markAsReadUseCase = new MarkNotificationAsReadUseCase(repository);
  const markAsUnreadUseCase = new MarkNotificationAsUnreadUseCase(repository);
  const markAllAsReadUseCase = new MarkAllAsReadUseCase(repository);
  const getUnreadCountUseCase = new GetUnreadCountUseCase(repository);

  const dependencies: NotificationsDependencies = {
    getNotificationsUseCase,
    markAsReadUseCase,
    markAsUnreadUseCase,
    markAllAsReadUseCase,
    getUnreadCountUseCase,
  };

  return (
    <NotificationsContext.Provider value={dependencies}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsDependencies = (): NotificationsDependencies => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotificationsDependencies must be used within a NotificationsProvider');
  }
  return context;
};
