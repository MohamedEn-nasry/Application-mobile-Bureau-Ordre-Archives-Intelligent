import { useState } from 'react';
import { container } from '../../../../core/di/container';
import { CreateCourrierUseCase } from '../../domain/usecases/CreateCourrierUseCase';
import { CreateCourrierParams } from '../../domain/repositories/CourrierRepository';

export const useCreateCourrier = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourrier = async (courrier: CreateCourrierParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const useCase = container.resolve<CreateCourrierUseCase>(
        'CreateCourrierUseCase'
      );

      const result = await useCase.execute(courrier);

      if (result.isError()) {
        setError(result.error.message);
        return null;
      }

      return result.value;
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCourrier,
    isLoading,
    error,
  };
};