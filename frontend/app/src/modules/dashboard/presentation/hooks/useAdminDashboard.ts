import { useState, useEffect, useCallback } from 'react';
import { SummaryStats, ActivityItem, QuickAction } from '../../domain/entities/DashboardStats';
import { GetDashboardStatsUseCase } from '../../domain/usecases/GetDashboardStatsUseCase';
import { GetRecentActivityUseCase } from '../../domain/usecases/GetRecentActivityUseCase';
import { NoParams } from '../../../../core/base/UseCase';
import { ADMIN_QUICK_ACTIONS } from '../config/quickActions';
import { container } from '../../../../core/di/container';

interface AdminDashboardState {
  stats: SummaryStats | null;
  activities: ActivityItem[];
  quickActions: QuickAction[];
  isLoadingStats: boolean;
  isLoadingActivities: boolean;
  errorStats: string | null;
  errorActivities: string | null;
}

export interface UseAdminDashboardReturn extends AdminDashboardState {
  refetch: () => void;
}

export const useAdminDashboard = (): UseAdminDashboardReturn => {
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [errorActivities, setErrorActivities] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    setErrorStats(null);
    const getDashboardStats = container.resolve<GetDashboardStatsUseCase>('GetDashboardStatsUseCase');
    const result = await getDashboardStats.execute(new NoParams());
    setIsLoadingStats(false);
    if (result.isSuccess()) {
      setStats(result.value);
    } else {
      setErrorStats(result.error.message);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    setIsLoadingActivities(true);
    setErrorActivities(null);
    const getRecentActivity = container.resolve<GetRecentActivityUseCase>('GetRecentActivityUseCase');
    const result = await getRecentActivity.execute(new NoParams());
    setIsLoadingActivities(false);
    if (result.isSuccess()) {
      setActivities(result.value);
    } else {
      setErrorActivities(result.error.message);
    }
  }, []);


  const refetch = useCallback(() => {
    fetchStats();
    fetchActivities();
  }, [fetchStats, fetchActivities]);


  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    stats,
    activities,
    quickActions: ADMIN_QUICK_ACTIONS,
    isLoadingStats,
    isLoadingActivities,
    errorStats,
    errorActivities,
    refetch,
  };
};
