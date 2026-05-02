import { useState } from 'react';
import { container } from '../../../../core/di/container';
import { CreateUserUseCase } from '../../domain/usecases/CreateUserUseCase';
import { Role } from '../../../../shared/constants/roles';

export const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (user: any) => {
    setIsLoading(true);
    setError(null);

    // In a real app the useCase would be registered in DI container
    const useCase = container.resolve<CreateUserUseCase>('CreateUserUseCase');
    const result = await useCase.execute(user);

    setIsLoading(false);

    if (result.isError()) {
      setError(result.error.message);
      return null;
    }
    return result.value;
  };

  return { createUser, isLoading, error };
};
