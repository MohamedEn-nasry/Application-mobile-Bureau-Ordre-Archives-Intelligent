import { useState, useEffect, useCallback } from 'react';
import { container } from '../../../../core/di/container';
import { Courrier } from '../../domain/entities/Courrier';
import { GetCourrierByIdUseCase } from '../../domain/usecases/GetCourrierByIdUseCase';

export const useCourrierDetails = (id: number) => {
  const [courrier, setCourrier] = useState<Courrier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourrier = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const useCase = container.resolve<GetCourrierByIdUseCase>(
        'GetCourrierByIdUseCase'
      );

      const result = await useCase.execute(id);

      if (result.isSuccess()) {
        setCourrier(result.value);
      } else {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourrier();
  }, [fetchCourrier]);

  return {
    courrier,
    isLoading,
    error,
    refetch: fetchCourrier,
  };
};