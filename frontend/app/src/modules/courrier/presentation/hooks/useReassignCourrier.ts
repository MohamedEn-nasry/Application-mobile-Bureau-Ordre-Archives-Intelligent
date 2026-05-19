import { useState } from 'react';

import { CourrierActionsRemoteDataSource } from '../../data/datasources/CourrierActionsRemoteDataSource';
import { CourrierActionsRepositoryImpl } from '../../data/repositories/CourrierActionsRepositoryImpl';
import { ReassignCourrierUseCase } from '../../domain/usecases/ReassignCourrierUseCase';

const dataSource = new CourrierActionsRemoteDataSource();
const repository = new CourrierActionsRepositoryImpl(dataSource);
const reassignUseCase = new ReassignCourrierUseCase(repository);

export const useReassignCourrier = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reassignCourrier = async (params: {
        courrierId: number;
        assigneA: number;
        commentaire?: string | null;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await reassignUseCase.execute(params);

            if (result.isSuccess()) {
                return true;
            }

            setError(result.error.message);
            return false;
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la réassignation.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        reassignCourrier,
        isLoading,
        error,
    };
};