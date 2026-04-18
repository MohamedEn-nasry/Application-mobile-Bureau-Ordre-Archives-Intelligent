import { useState } from 'react';
import { container } from '../../../../core/di/container';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    setError(null);
    
    // In a real app the useCase would be registered in DI
    const useCase = container.resolve<LoginUseCase>('LoginUseCase');
    const result = await useCase.execute({ email, password });
    
    setIsLoading(false);
    
    if (result.isError()) {
      setError(result.error.message);
      return false;
    }
    return true;
  };

  return { login, isLoading, error };
};
