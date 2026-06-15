import { useCallback, useEffect, useState } from 'react';
import { container } from '../../../../core/di/container';
import { GetSuperAgentDashboardUseCase } from '../../domain/usecases/GetSuperAgentDashboardUseCase';
import { AgentDashboard } from '../../domain/entities/AgentDashboard';

export const useSuperAgentDashboard = () => {
    const [data, setData] = useState<AgentDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const useCase = container.resolve<GetSuperAgentDashboardUseCase>(
                'GetSuperAgentDashboardUseCase'
            );

            const result = await useCase.execute();

            if (result.isSuccess()) {
                setData(result.value);
            } else {
                setError(result.error.message);
            }
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la récupération du tableau de bord');
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
