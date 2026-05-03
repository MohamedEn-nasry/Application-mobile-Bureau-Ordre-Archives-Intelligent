import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationType } from '../../domain/entities/Notification';
import { GetNotificationsUseCase } from '../../domain/usecases/GetNotificationsUseCase';
import { GetUnreadCountUseCase } from '../../domain/usecases/GetUnreadCountUseCase';

interface UseNotificationsProps {
  getNotificationsUseCase: GetNotificationsUseCase;
  getUnreadCountUseCase: GetUnreadCountUseCase;
  type?: NotificationType;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  refresh: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useNotifications = ({
  getNotificationsUseCase,
  getUnreadCountUseCase,
  type,
}: UseNotificationsProps): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const notificationsResult = await getNotificationsUseCase.execute({ type });
      const unreadCountResult = await getUnreadCountUseCase.execute({ type });

      if (notificationsResult.isSuccess() && unreadCountResult.isSuccess()) {
        setNotifications(notificationsResult.value);
        setUnreadCount(unreadCountResult.value);
      } else {
        setError(
          notificationsResult.isError() 
            ? notificationsResult.error.message 
            : unreadCountResult.isError() 
              ? unreadCountResult.error.message 
              : 'Unknown error'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [getNotificationsUseCase, getUnreadCountUseCase, type]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const refresh = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  const refetch = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    refresh,
    refetch,
  };
};
