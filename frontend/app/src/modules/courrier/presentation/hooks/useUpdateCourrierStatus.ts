import { useState, useCallback } from 'react';
import { container } from '../../../../core/di/container';
import { UpdateCourrierStatusUseCase } from '../../domain/usecases/UpdateCourrierStatusUseCase';

export const useUpdateCourrierStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(async (id: number, statut: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const useCase = container.resolve<UpdateCourrierStatusUseCase>(
        'UpdateCourrierStatusUseCase'
      );

      const result = await useCase.execute({ id, statut });

      if (result.isError()) {
        setError(result.error.message);
        return false;
      }

      return result.value;
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateStatus,
    isLoading,
    error,
  };
};