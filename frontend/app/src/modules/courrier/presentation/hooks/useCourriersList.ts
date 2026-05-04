import { useState, useEffect, useCallback, useMemo } from 'react';
import { container } from '../../../../core/di/container';
import { GetCourriersUseCase } from '../../domain/usecases/GetCourriersUseCase';
import { Courrier } from '../../domain/entities/Courrier';

export type CourrierTab = 'Entrant' | 'Sortant' | 'Tous';

export const useCourriersList = () => {
  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<CourrierTab>('Entrant');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourriers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const useCase = container.resolve<GetCourriersUseCase>('GetCourriersUseCase');
      const result = await useCase.execute();

      if (result.isSuccess()) {
        setCourriers(result.value);
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
    fetchCourriers();
  }, [fetchCourriers]);

  const filteredCourriers = useMemo(() => {
    let result = [...courriers];

    if (selectedTab !== 'Tous') {
      result = result.filter(c => c.Type === selectedTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      result = result.filter(c =>
        c.Reference.toLowerCase().includes(q) ||
        c.Objet.toLowerCase().includes(q) ||
        c.Expediteur?.toLowerCase().includes(q) ||
        c.Destinataire?.toLowerCase().includes(q) ||
        c.TexteOcr?.toLowerCase().includes(q)
      );
    }

    result.sort(
      (a, b) => b.DateCourrier.getTime() - a.DateCourrier.getTime()
    );

    return result;
  }, [courriers, selectedTab, searchQuery]);

  return {
    courriers: filteredCourriers,
    allCourriers: courriers,
    isLoading,
    error,
    selectedTab,
    setSelectedTab,
    searchQuery,
    setSearchQuery,
    refetch: fetchCourriers,
  };
};