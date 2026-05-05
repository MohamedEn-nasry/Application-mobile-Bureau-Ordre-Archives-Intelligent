import { useState, useCallback } from 'react';
import { MarkNotificationAsUnreadUseCase } from '../../domain/usecases/MarkNotificationAsUnreadUseCase';

interface UseMarkAsUnreadProps {
  markAsUnreadUseCase: MarkNotificationAsUnreadUseCase;
}

interface UseMarkAsUnreadReturn {
  loading: boolean;
  error: string | null;
  markAsUnread: (id: string) => Promise<boolean>;
}

export const useMarkAsUnread = ({
  markAsUnreadUseCase,
}: UseMarkAsUnreadProps): UseMarkAsUnreadReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const markAsUnread = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const result = await markAsUnreadUseCase.execute({ id });

      if (result.isSuccess()) {
        return result.value;
      } else {
        setError(result.error.message);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [markAsUnreadUseCase]);

  return {
    loading,
    error,
    markAsUnread,
  };
};
