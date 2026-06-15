import { useState } from 'react';

import { CourrierHistoryResponseModel } from '../../data/models/CourrierHistoryResponseModel';
import { CourrierActionsRemoteDataSource } from '../../data/datasources/CourrierActionsRemoteDataSource';
import { CourrierActionsRepositoryImpl } from '../../data/repositories/CourrierActionsRepositoryImpl';
import { GetCourrierHistoryUseCase } from '../../domain/usecases/GetCourrierHistoryUseCase';

const dataSource = new CourrierActionsRemoteDataSource();
const repository = new CourrierActionsRepositoryImpl(dataSource);
const getHistoryUseCase = new GetCourrierHistoryUseCase(repository);

export const useCourrierHistory = () => {
    const [history, setHistory] = useState<CourrierHistoryResponseModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async (courrierId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getHistoryUseCase.execute(courrierId);

            if (result.isSuccess()) {
                setHistory(result.value);
                return true;
            }

            setError(result.error.message);
            return false;
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement de l'historique.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        history,
        isLoading,
        error,
        fetchHistory,
    };
};