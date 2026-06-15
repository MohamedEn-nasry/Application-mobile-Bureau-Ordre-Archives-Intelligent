import { useCallback, useEffect, useState } from 'react';
import { container } from '../../../../core/di/container';
import { ReportsOverview } from '../../domain/entities/ReportsOverview';
import { GetReportsOverviewUseCase } from '../../domain/usecases/GetReportsOverviewUseCase';

export const useReportsOverview = () => {
  const [period, setPeriod] = useState('6m');
  const [data, setData] = useState<ReportsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const useCase = container.resolve<GetReportsOverviewUseCase>(
        'GetReportsOverviewUseCase'
      );

      const result = await useCase.execute(period);

      if (result.isSuccess()) {
        setData(result.value);
      } else {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    data,
    period,
    setPeriod,
    isLoading,
    error,
    refetch: fetchReports,
  };
};