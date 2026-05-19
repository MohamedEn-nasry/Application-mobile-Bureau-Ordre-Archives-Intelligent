import { useCallback, useEffect, useState } from 'react';

import { container } from '../../../../core/di/container';
import { LecteurDashboardOverview } from '../../domain/entities/LecteurDashboardOverview';
import { GetLecteurDashboardUseCase } from '../../domain/usecases/GetLecteurDashboardUseCase';

export const useLecteurDashboard = () => {
    const [data, setData] = useState<LecteurDashboardOverview | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOverview = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const useCase = container.resolve<GetLecteurDashboardUseCase>(
                'GetLecteurDashboardUseCase'
            );

            const result = await useCase.execute();

            if (result.isSuccess()) {
                setData(result.value);
            } else {
                setError(result.error.message);
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement du dashboard lecteur.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    return {
        data,
        isLoading,
        error,
        refetch: fetchOverview,
    };
};