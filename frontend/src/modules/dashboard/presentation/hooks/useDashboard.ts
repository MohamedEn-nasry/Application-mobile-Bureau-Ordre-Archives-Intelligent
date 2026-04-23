import { useState, useCallback } from 'react';
import { AsyncResult, failure } from '../../../../core/utils/result';
import { GetDashboardStatsUseCase, GetDashboardStatsParams } from '../../domain/usecases/GetDashboardStatsUseCase';
import { GetRecentActivitiesUseCase, GetRecentActivitiesParams } from '../../domain/usecases/GetRecentActivitiesUseCase';
import { DashboardStats, DashboardActivity } from '../../domain/entities/DashboardStats';

/**
 * Dashboard hook state
 */
export interface DashboardState {
  isLoading: boolean;
  error: string | null;
  stats: DashboardStats | null;
  recentActivities: DashboardActivity[];
  refreshing: boolean;
}

/**
 * Custom hook for dashboard functionality
 * Provides dashboard state management and data fetching
 */
export const useDashboard = (
  getDashboardStatsUseCase: GetDashboardStatsUseCase,
  getRecentActivitiesUseCase: GetRecentActivitiesUseCase
) => {
  const [state, setState] = useState<DashboardState>({
    isLoading: false,
    error: null,
    stats: null,
    recentActivities: [],
    refreshing: false,
  });

  /**
   * Fetch dashboard stats
   */
  const fetchDashboardStats = useCallback(async (refresh?: boolean): Promise<AsyncResult<DashboardStats>> => {
    setState((prev: DashboardState) => ({ 
      ...prev, 
      isLoading: !refresh, 
      refreshing: !!refresh,
      error: null 
    }));

    try {
      const result = await getDashboardStatsUseCase.executeWithValidation({ refresh });
      
      if (result.isFailure()) {
        setState((prev: DashboardState) => ({
          ...prev,
          isLoading: false,
          refreshing: false,
          error: result.error.message,
          stats: null,
        }));
      } else {
        setState((prev: DashboardState) => ({
          ...prev,
          isLoading: false,
          refreshing: false,
          error: null,
          stats: result.value,
        }));
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
      setState((prev: DashboardState) => ({
        ...prev,
        isLoading: false,
        refreshing: false,
        error: errorMessage,
        stats: null,
      }));
      
      return failure(error as Error);
    }
  }, [getDashboardStatsUseCase]);

  /**
   * Fetch recent activities
   */
  const fetchRecentActivities = useCallback(async (limit?: number): Promise<AsyncResult<DashboardActivity[]>> => {
    try {
      const result = await getRecentActivitiesUseCase.executeWithValidation({ limit });
      
      if (result.isSuccess()) {
        setState((prev: DashboardState) => ({
          ...prev,
          recentActivities: result.value,
        }));
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch recent activities';
      setState((prev: DashboardState) => ({
        ...prev,
        error: errorMessage,
      }));
      
      return failure(error as Error);
    }
  }, [getRecentActivitiesUseCase]);

  /**
   * Refresh dashboard data
   */
  const refreshDashboard = useCallback(async (): Promise<void> => {
    await fetchDashboardStats(true);
    await fetchRecentActivities(10);
  }, [fetchDashboardStats, fetchRecentActivities]);

  /**
   * Load initial dashboard data
   */
  const loadDashboard = useCallback(async (): Promise<void> => {
    await fetchDashboardStats();
    await fetchRecentActivities(10);
  }, [fetchDashboardStats, fetchRecentActivities]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev: DashboardState) => ({ ...prev, error: null }));
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      stats: null,
      recentActivities: [],
      refreshing: false,
    });
  }, []);

  return {
    state,
    fetchDashboardStats,
    fetchRecentActivities,
    refreshDashboard,
    loadDashboard,
    clearError,
    reset,
  };
};
