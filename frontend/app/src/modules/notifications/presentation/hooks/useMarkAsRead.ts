import { useState, useCallback } from 'react';
import { MarkNotificationAsReadUseCase } from '../../domain/usecases/MarkNotificationAsReadUseCase';

interface UseMarkAsReadProps {
  markAsReadUseCase: MarkNotificationAsReadUseCase;
}

interface UseMarkAsReadReturn {
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<boolean>;
}

export const useMarkAsRead = ({
  markAsReadUseCase,
}: UseMarkAsReadProps): UseMarkAsReadReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const markAsRead = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const result = await markAsReadUseCase.execute({ id });

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
  }, [markAsReadUseCase]);

  return {
    loading,
    error,
    markAsRead,
  };
};
