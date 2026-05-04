import { useCallback, useEffect, useState } from 'react';
import { container } from '../../../../core/di/container';
import { Categorie } from '../../domain/entities/Categorie';
import { GetCategoriesUseCase } from '../../domain/usecases/GetCategoriesUseCase';

export const useCategories = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const useCase = container.resolve<GetCategoriesUseCase>(
        'GetCategoriesUseCase'
      );

      const result = await useCase.execute();

      if (result.isSuccess()) {
        setCategories(result.value);
      } else {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
};