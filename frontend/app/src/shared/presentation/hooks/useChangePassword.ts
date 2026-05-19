import { useCallback, useState } from 'react';
import { container } from '../../../core/di/container';
import { ChangePasswordUseCase } from '../../../modules/users/domain/usecases/ChangePasswordUseCase';

export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = useCallback(
    async (params: { id: number; oldPassword: string; newPassword: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const useCase = container.resolve<ChangePasswordUseCase>('ChangePasswordUseCase');
        const result = await useCase.execute(params);

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
    },
    []
  );

  return { changePassword, isLoading, error };
};

