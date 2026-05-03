import { useState } from 'react';
import { container } from '../../../../core/di/container';
import { UpdateCourrierUseCase } from '../../domain/usecases/UpdateCourrierUseCase';
import { UpdateCourrierParams } from '../../domain/repositories/CourrierRepository';

export const useUpdateCourrier = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCourrier = async (courrier: UpdateCourrierParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const useCase = container.resolve<UpdateCourrierUseCase>(
        'UpdateCourrierUseCase'
      );

      const result = await useCase.execute(courrier);

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
  };

  return {
    updateCourrier,
    isLoading,
    error,
  };
};