import { useState, useEffect } from 'react';
import { GetDashboardDataUseCase, DashboardData } from '../../domain/usecases/GetDashboardDataUseCase';
import { DashboardRepository } from '../../data/repositories/DashboardRepository';
import { DashboardRemoteDataSource } from '../../data/datasources/DashboardRemoteDataSource';

// IPA: /vju: mOd.el/ - View Model (pronounced "vyoo mod-el")
// IPA: /eId.dZEnt dæb.bord/ - Agent Dashboard (pronounced "ay-jent dab-bord")
// IPA: /pre.zEn.teI.SEn/ - Presentation (pronounced "pre-zen-tay-shen")

export interface AgentDashboardViewModel {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useAgentDashboardViewModel = (): AgentDashboardViewModel => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize use case with dependencies
  const getDashboardDataUseCase = new GetDashboardDataUseCase(
    new DashboardRepository(
      new DashboardRemoteDataSource()
    )
  );

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dashboardData = await getDashboardDataUseCase.execute();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    await loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refresh
  };
};
