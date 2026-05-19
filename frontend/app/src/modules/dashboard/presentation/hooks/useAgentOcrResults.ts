import { useCallback, useEffect, useState } from 'react';

import { container } from '../../../../core/di/container';
import { AgentOcrResult } from '../../domain/entities/AgentOcrResult';
import { GetAgentOcrResultsUseCase } from '../../domain/usecases/GetAgentOcrResultsUseCase';

export const useAgentOcrResults = () => {
  const [items, setItems] = useState<AgentOcrResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const useCase = container.resolve<GetAgentOcrResultsUseCase>(
        'GetAgentOcrResultsUseCase'
      );

      const result = await useCase.execute();

      if (result.isSuccess()) {
        setItems(result.value);
      } else {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des résultats OCR.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchItems,
  };
};