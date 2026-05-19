import { useCallback, useEffect, useState } from 'react';
import { container } from '../../../../core/di/container';
import { GetAgentDashboardUseCase } from '../../domain/usecases/GetAgentDashboardUseCase';
import { AgentDashboard } from '../../domain/entities/AgentDashboard';

export const useAgentDashboard = () => {
    const [data, setData] = useState<AgentDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const useCase = container.resolve<GetAgentDashboardUseCase>(
                'GetAgentDashboardUseCase'
            );

            const result = await useCase.execute();

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
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        data,
        isLoading,
        error,
        refetch: fetchDashboard,
    };
};