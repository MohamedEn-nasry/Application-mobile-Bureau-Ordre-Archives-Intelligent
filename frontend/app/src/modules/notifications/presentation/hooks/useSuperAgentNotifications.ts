import { useCallback, useEffect, useState } from 'react';
import { Notification } from '../../domain/entities/Notification';
import { GetSuperAgentNotificationsUseCase } from '../../domain/usecases/GetSuperAgentNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from '../../domain/usecases/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../domain/usecases/MarkAllNotificationsAsReadUseCase';
import { DeleteNotificationUseCase } from '../../domain/usecases/DeleteNotificationUseCase';
import { container } from '../../../../core/di/container';

export const useSuperAgentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const getSuperAgentNotificationsUseCase = container.resolve<GetSuperAgentNotificationsUseCase>('GetSuperAgentNotificationsUseCase');
      const result = await getSuperAgentNotificationsUseCase.execute(onlyUnread);

      if (result.isSuccess()) {
        const sortedNotifications = result.value.sort(
          (a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
        );
        setNotifications(sortedNotifications);
        setUnreadCount(sortedNotifications.filter(n => !n.IsRead).length);
      } else {
        setError(result.error.message || 'Erreur lors du chargement des notifications');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inattendue');
    } finally {
      setIsLoading(false);
    }
  }, [onlyUnread]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    if (isActionLoading) return false;
    setIsActionLoading(true);

    try {
      const markAsReadUseCase = container.resolve<MarkNotificationAsReadUseCase>('MarkNotificationAsReadUseCase');
      const result = await markAsReadUseCase.execute(id);

      if (result.isSuccess()) {
        setNotifications(prev =>
          prev.map(n => (Number(n.id) === id ? { ...n, IsRead: true } as Notification : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (isActionLoading) return false;
    setIsActionLoading(true);

    try {
      const markAllAsReadUseCase = container.resolve<MarkAllNotificationsAsReadUseCase>('MarkAllNotificationsAsReadUseCase');
      const result = await markAllAsReadUseCase.execute();

      if (result.isSuccess()) {
        setNotifications(prev => prev.map(n => ({ ...n, IsRead: true } as Notification)));
        setUnreadCount(0);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteNotification = async (id: number) => {
    if (isActionLoading) return false;
    setIsActionLoading(true);

    try {
      const deleteNotificationUseCase = container.resolve<DeleteNotificationUseCase>('DeleteNotificationUseCase');
      const result = await deleteNotificationUseCase.execute(id);

      if (result.isSuccess()) {
        setNotifications(prev => prev.filter(n => Number(n.id) !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

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
