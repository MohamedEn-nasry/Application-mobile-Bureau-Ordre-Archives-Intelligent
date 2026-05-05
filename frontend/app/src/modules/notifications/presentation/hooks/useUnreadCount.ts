import { useState, useEffect, useCallback } from 'react';
import { GetUnreadCountUseCase } from '../../domain/usecases/GetUnreadCountUseCase';
import { NotificationType } from '../../domain/entities/Notification';

interface UseUnreadCountProps {
  getUnreadCountUseCase: GetUnreadCountUseCase;
  type?: NotificationType;
  refreshInterval?: number;
}

interface UseUnreadCountReturn {
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useUnreadCount = ({
  getUnreadCountUseCase,
  type,
  refreshInterval = 30000, // 30 seconds
}: UseUnreadCountProps): UseUnreadCountReturn => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getUnreadCountUseCase.execute({ type });

      if (result.isSuccess()) {
        setUnreadCount(result.value);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [getUnreadCountUseCase, type]);

  useEffect(() => {
    fetchUnreadCount();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchUnreadCount, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchUnreadCount, refreshInterval]);

  const refresh = useCallback(async () => {
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    error,
    refresh,
  };
};
