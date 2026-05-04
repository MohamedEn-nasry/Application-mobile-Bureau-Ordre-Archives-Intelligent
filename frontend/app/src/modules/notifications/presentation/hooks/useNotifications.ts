import { useCallback, useEffect, useState } from 'react';
import { container } from '../../../../core/di/container';

import { Notification } from '../../domain/entities/Notification';
import { GetNotificationsUseCase } from '../../domain/usecases/GetNotificationsUseCase';
import { GetUnreadNotificationsCountUseCase } from '../../domain/usecases/GetUnreadCountUseCase';
import { MarkNotificationAsReadUseCase } from '../../domain/usecases/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../domain/usecases/MarkAllNotificationsAsReadUseCase';
import { DeleteNotificationUseCase } from '../../domain/usecases/DeleteNotificationUseCase';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlyUnread, setOnlyUnread] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const useCase = container.resolve<GetNotificationsUseCase>(
        'GetNotificationsUseCase'
      );

      const result = await useCase.execute(onlyUnread);

      if (result.isSuccess()) {
        setNotifications(result.value);
      } else {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [onlyUnread]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const useCase = container.resolve<GetUnreadNotificationsCountUseCase>(
        'GetUnreadNotificationsCountUseCase'
      );

      const result = await useCase.execute();

      if (result.isSuccess()) {
        setUnreadCount(result.value);
      }
    } catch (err) {
      console.log('Unread count error:', err);
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    setIsActionLoading(true);

    try {
      const useCase = container.resolve<MarkNotificationAsReadUseCase>(
        'MarkNotificationAsReadUseCase'
      );

      const result = await useCase.execute(id);

      if (result.isSuccess()) {
        await fetchNotifications();
        await fetchUnreadCount();
        return true;
      }

      setError(result.error.message);
      return false;
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  }, [fetchNotifications, fetchUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    setIsActionLoading(true);

    try {
      const useCase = container.resolve<MarkAllNotificationsAsReadUseCase>(
        'MarkAllNotificationsAsReadUseCase'
      );

      const result = await useCase.execute();

      if (result.isSuccess()) {
        await fetchNotifications();
        await fetchUnreadCount();
        return true;
      }

      setError(result.error.message);
      return false;
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  }, [fetchNotifications, fetchUnreadCount]);

  

  const deleteNotification = useCallback(async (id: number) => {
    setIsActionLoading(true);

    try {
      const useCase = container.resolve<DeleteNotificationUseCase>(
        'DeleteNotificationUseCase'
      );

      const result = await useCase.execute(id);

      if (result.isSuccess()) {
        await fetchNotifications();
        await fetchUnreadCount();
        return true;
      }

      setError(result.error.message);
      return false;
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    onlyUnread,
    setOnlyUnread,
    isLoading,
    isActionLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};