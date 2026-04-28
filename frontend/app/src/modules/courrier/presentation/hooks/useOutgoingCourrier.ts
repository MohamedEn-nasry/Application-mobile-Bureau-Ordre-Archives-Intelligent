import { useState, useCallback, useEffect } from 'react';
import { OutgoingCourrier } from '../../domain/entities/OutgoingCourrier';
import { CourrierFilter } from '../../domain/entities/CourrierFilter';
import { GetOutgoingCourrierUseCase, GetOutgoingCourrierParams } from '../../domain/usecases/GetOutgoingCourrierUseCase';
import { container } from '../../../../core/di/container';
import { Result } from '../../../../core/utils/result';

interface UseOutgoingCourrierState {
  courriers: OutgoingCourrier[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
}

interface UseOutgoingCourrierReturn extends UseOutgoingCourrierState {
  fetchCourriers: (filter?: CourrierFilter) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export const useOutgoingCourrier = (initialFilter?: CourrierFilter): UseOutgoingCourrierReturn => {
  const [state, setState] = useState<UseOutgoingCourrierState>({
    courriers: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    hasMore: true,
  });

  const [currentFilter, setCurrentFilter] = useState<CourrierFilter | undefined>(initialFilter);

  const fetchCourriers = useCallback(async (filter?: CourrierFilter) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const getOutgoingCourrierUseCase = container.resolve<GetOutgoingCourrierUseCase>('GetOutgoingCourrierUseCase');
      
      const params: GetOutgoingCourrierParams = {
        filter: filter || currentFilter || {
          page: 1,
          limit: 20,
          sortBy: 'dateSent',
          sortOrder: 'desc'
        }
      };

      const result = await getOutgoingCourrierUseCase.execute(params);

      if (result.isSuccess()) {
        const isFirstPage = !filter?.page || filter.page === 1;
        
        setState(prev => ({
          ...prev,
          courriers: isFirstPage ? result.value : [...prev.courriers, ...result.value],
          isLoading: false,
          totalCount: result.value.length,
          currentPage: filter?.page || 1,
          hasMore: result.value.length >= (filter?.limit || 20),
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error.message,
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch courriers',
      }));
    }
  }, [currentFilter]);

  const loadMore = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return;

    const nextPage = state.currentPage + 1;
    const nextFilter = {
      ...currentFilter,
      page: nextPage,
    };

    await fetchCourriers(nextFilter);
  }, [state.isLoading, state.hasMore, state.currentPage, currentFilter, fetchCourriers]);

  const refresh = useCallback(async () => {
    const refreshFilter = {
      ...currentFilter,
      page: 1,
    };
    
    await fetchCourriers(refreshFilter);
  }, [currentFilter, fetchCourriers]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initial load
  useEffect(() => {
    fetchCourriers(initialFilter);
  }, []);

  return {
    ...state,
    fetchCourriers,
    loadMore,
    refresh,
    clearError,
  };
};
