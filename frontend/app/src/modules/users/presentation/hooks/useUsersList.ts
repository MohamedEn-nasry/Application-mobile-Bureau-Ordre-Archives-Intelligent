import { useState, useEffect, useCallback } from 'react';
import { container } from '../../../../core/di/container';
import { GetUsersUseCase } from '../../domain/usecases/GetUsersUseCase';
import { ManagedUser } from '../../domain/entities/ManagedUser';


export const useUsersList = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Resolving UseCase via container (mocked here if not previously registered)
    const useCase = container.resolve<GetUsersUseCase>('GetUsersUseCase');
    const result = await useCase.execute();

    setIsLoading(false);

    if (result.isSuccess()) {
      setUsers(result.value);
    } else {
      setError(result.error.message);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, refetch: fetchUsers };
};
