import { useCallback, useEffect, useState } from 'react';
import { NotificationRemoteDataSource } from '../../data/datasources/NotificationsRemoteDataSource';

const dataSource = new NotificationRemoteDataSource();

export const useUnreadNotificationsCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    setIsLoading(true);

    try {
      const count = await dataSource.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.log('Unread notifications count error:', error);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    isLoading,
    refetchUnreadCount: fetchUnreadCount,
  };
};