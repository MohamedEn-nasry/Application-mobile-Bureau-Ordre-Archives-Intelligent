import { useState, useCallback } from 'react';
import { AsyncResult, failure } from '../../../../core/utils/result';
import { GetIncomingMailUseCase, GetIncomingMailParams } from '../../domain/usecases/GetIncomingMailUseCase';
import { MailListResponse } from '../../domain/repositories/CourrierRepository';
import { MailFilters } from '../../domain/entities/MailFilters';

/**
 * Incoming mail hook state
 */
export interface IncomingMailState {
  isLoading: boolean;
  error: string | null;
  data: MailListResponse | null;
  filters: Partial<MailFilters>;
}

/**
 * Custom hook for incoming mail functionality
 * Provides incoming mail state management and data fetching
 */
export const useIncomingMail = (getIncomingMailUseCase: GetIncomingMailUseCase) => {
  const [state, setState] = useState<IncomingMailState>({
    isLoading: false,
    error: null,
    data: null,
    filters: {
      page: 1,
      limit: 20,
      sortBy: 'date',
      sortOrder: 'desc',
    },
  });

  /**
   * Fetch incoming mails with current filters
   */
  const fetchIncomingMails = useCallback(async (filters?: Partial<MailFilters>): Promise<AsyncResult<MailListResponse>> => {
    const finalFilters = { ...state.filters, ...filters };
    
    setState((prev: IncomingMailState) => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      filters: finalFilters 
    }));

    try {
      const result = await getIncomingMailUseCase.executeWithValidation({ filters: finalFilters });
      
      if (result.isFailure()) {
        setState((prev: IncomingMailState) => ({
          ...prev,
          isLoading: false,
          error: result.error.message,
          data: null,
        }));
      } else {
        setState((prev: IncomingMailState) => ({
          ...prev,
          isLoading: false,
          error: null,
          data: result.value,
        }));
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch incoming mails';
      setState((prev: IncomingMailState) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        data: null,
      }));
      
      return failure(error as Error);
    }
  }, [getIncomingMailUseCase, state.filters]);

  /**
   * Refresh incoming mails (reset to first page)
   */
  const refreshIncomingMails = useCallback(async (): Promise<AsyncResult<MailListResponse>> => {
    return fetchIncomingMails({ page: 1 });
  }, [fetchIncomingMails]);

  /**
   * Load more incoming mails (next page)
   */
  const loadMoreIncomingMails = useCallback(async (): Promise<AsyncResult<MailListResponse> | null> => {
    if (!state.data || !state.data.mails.length || state.isLoading) {
      return null;
    }

    const nextPage = (state.filters.page || 1) + 1;
    const result = await fetchIncomingMails({ page: nextPage });
    
    if (result.isSuccess() && result.value && state.data) {
      // Append new mails to existing ones
      const combinedData: MailListResponse = {
        ...result.value,
        mails: [...state.data.mails, ...result.value.mails],
      };
      
      setState((prev: IncomingMailState) => ({
        ...prev,
        data: combinedData,
      }));
    }

    return result;
  }, [fetchIncomingMails, state.data, state.filters, state.isLoading]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters: Partial<MailFilters>) => {
    setState((prev: IncomingMailState) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    const defaultFilters: Partial<MailFilters> = {
      page: 1,
      limit: 20,
      sortBy: 'date',
      sortOrder: 'desc',
    };
    
    setState((prev: IncomingMailState) => ({
      ...prev,
      filters: defaultFilters,
    }));
  }, []);

  /**
   * Search incoming mails
   */
  const searchIncomingMails = useCallback(async (query: string): Promise<AsyncResult<MailListResponse>> => {
    return fetchIncomingMails({ query, page: 1 });
  }, [fetchIncomingMails]);

  /**
   * Filter by status
   */
  const filterByStatus = useCallback(async (status: string): Promise<AsyncResult<MailListResponse>> => {
    return fetchIncomingMails({ status: status as any, page: 1 });
  }, [fetchIncomingMails]);

  /**
   * Filter by priority
   */
  const filterByPriority = useCallback(async (priority: string): Promise<AsyncResult<MailListResponse>> => {
    return fetchIncomingMails({ priority: priority as any, page: 1 });
  }, [fetchIncomingMails]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev: IncomingMailState) => ({ ...prev, error: null }));
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
        sortBy: 'date',
        sortOrder: 'desc',
      },
    });
  }, []);

  return {
    state,
    fetchIncomingMails,
    refreshIncomingMails,
    loadMoreIncomingMails,
    updateFilters,
    resetFilters,
    searchIncomingMails,
    filterByStatus,
    filterByPriority,
    clearError,
    reset,
  };
};
