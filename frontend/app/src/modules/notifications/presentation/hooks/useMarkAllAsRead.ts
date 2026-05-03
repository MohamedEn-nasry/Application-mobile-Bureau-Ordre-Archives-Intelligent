import { useState, useCallback } from 'react';
import { MarkAllAsReadUseCase } from '../../domain/usecases/MarkAllAsReadUseCase';

interface UseMarkAllAsReadProps {
  markAllAsReadUseCase: MarkAllAsReadUseCase;
}

interface UseMarkAllAsReadReturn {
  loading: boolean;
  error: string | null;
  markAllAsRead: () => Promise<boolean>;
}

export const useMarkAllAsRead = ({
  markAllAsReadUseCase,
}: UseMarkAllAsReadProps): UseMarkAllAsReadReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const result = await markAllAsReadUseCase.execute();

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
  }, [markAllAsReadUseCase]);

  return {
    loading,
    error,
    markAllAsRead,
  };
};
