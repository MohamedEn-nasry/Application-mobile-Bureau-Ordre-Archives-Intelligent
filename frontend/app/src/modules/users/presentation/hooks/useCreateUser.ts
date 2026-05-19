import { useState } from 'react';
import { container } from '../../../../core/di/container';
import { CreateUserUseCase } from '../../domain/usecases/CreateUserUseCase';
import { Roles } from '../../../../shared/constants/roles';

export const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (user: any) => {
    setIsLoading(true);
    setError(null);

    // In a real app the useCase would be registered in DI container
    const useCase = container.resolve<CreateUserUseCase>('CreateUserUseCase');
    const result = await useCase.execute(user);

    if (result.isError()) {
      setIsLoading(false);
      setError(result.error.message);
      return null;
    }

    // Assign category if this is a Lecteur and category was selected
    if (user.roleName === Roles.LECTEUR && user.categorieId) {
      const repo = container.resolve<any>('UserRepository');
      await repo.assignCategory(Number(result.value.id), user.categorieId);
    }

    setIsLoading(false);
    return result.value;
  };

  return { createUser, isLoading, error };
};
