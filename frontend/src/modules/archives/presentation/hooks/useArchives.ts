import { useState, useCallback } from 'react';
import { AsyncResult, failure } from '../../../../core/utils/result';
import { GetArchivesUseCase, GetArchivesParams } from '../../domain/usecases/GetArchivesUseCase';
import { ArchiveListResponse, ArchiveFilters } from '../../domain/repositories/ArchivesRepository';

/**
 * Archives hook state
 */
export interface ArchivesState {
  isLoading: boolean;
  error: string | null;
  data: ArchiveListResponse | null;
  filters: ArchiveFilters;
}

/**
 * Custom hook for archives functionality
 * Provides archives state management and data fetching
 */
export const useArchives = (getArchivesUseCase: GetArchivesUseCase) => {
  const [state, setState] = useState<ArchivesState>({
    isLoading: false,
    error: null,
    data: null,
    filters: {
      page: 1,
      limit: 20,
      sortBy: 'archivedDate',
      sortOrder: 'desc',
    },
  });

  /**
   * Fetch archives with current filters
   */
  const fetchArchives = useCallback(async (filters?: Partial<ArchiveFilters>): Promise<AsyncResult<ArchiveListResponse>> => {
    const finalFilters = { ...state.filters, ...filters };
    
    setState((prev: ArchivesState) => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      filters: finalFilters 
    }));

    try {
      const result = await getArchivesUseCase.executeWithValidation({ filters: finalFilters });
      
      if (result.isFailure()) {
        setState((prev: ArchivesState) => ({
          ...prev,
          isLoading: false,
          error: result.error.message,
          data: null,
        }));
      } else {
        setState((prev: ArchivesState) => ({
          ...prev,
          isLoading: false,
          error: null,
          data: result.value,
        }));
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch archives';
      setState((prev: ArchivesState) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        data: null,
      }));
      
      return failure(error as Error);
    }
  }, [getArchivesUseCase, state.filters]);

  /**
   * Refresh archives (reset to first page)
   */
  const refreshArchives = useCallback(async (): Promise<AsyncResult<ArchiveListResponse>> => {
    return fetchArchives({ page: 1 });
  }, [fetchArchives]);

  /**
   * Load more archives (next page)
   */
  const loadMoreArchives = useCallback(async (): Promise<AsyncResult<ArchiveListResponse> | null> => {
    if (!state.data || !state.data.archives.length || state.isLoading) {
      return null;
    }

    const nextPage = (state.filters.page || 1) + 1;
    const result = await fetchArchives({ page: nextPage });
    
    if (result.isSuccess() && result.value && state.data) {
      // Append new archives to existing ones
      const combinedData: ArchiveListResponse = {
        ...result.value,
        archives: [...state.data.archives, ...result.value.archives],
      };
      
      setState((prev: ArchivesState) => ({
        ...prev,
        data: combinedData,
      }));
    }

    return result;
  }, [fetchArchives, state.data, state.filters, state.isLoading]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters: Partial<ArchiveFilters>) => {
    setState((prev: ArchivesState) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    const defaultFilters: ArchiveFilters = {
      page: 1,
      limit: 20,
      sortBy: 'archivedDate',
      sortOrder: 'desc',
    };
    
    setState((prev: ArchivesState) => ({
      ...prev,
      filters: defaultFilters,
    }));
  }, []);

  /**
   * Search archives
   */
  const searchArchives = useCallback(async (query: string): Promise<AsyncResult<ArchiveListResponse>> => {
    return fetchArchives({ query, page: 1 });
  }, [fetchArchives]);

  /**
   * Filter by category
   */
  const filterByCategory = useCallback(async (category: string): Promise<AsyncResult<ArchiveListResponse>> => {
    return fetchArchives({ category: category as any, page: 1 });
  }, [fetchArchives]);

  /**
   * Filter by status
   */
  const filterByStatus = useCallback(async (status: string): Promise<AsyncResult<ArchiveListResponse>> => {
    return fetchArchives({ status: status as any, page: 1 });
  }, [fetchArchives]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev: ArchivesState) => ({ ...prev, error: null }));
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: null,
      filters: {
        page: 1,
        limit: 20,
        sortBy: 'archivedDate',
        sortOrder: 'desc',
      },
    });
  }, []);

  return {
    state,
    fetchArchives,
    refreshArchives,
    loadMoreArchives,
    updateFilters,
    resetFilters,
    searchArchives,
    filterByCategory,
    filterByStatus,
    clearError,
    reset,
  };
};
