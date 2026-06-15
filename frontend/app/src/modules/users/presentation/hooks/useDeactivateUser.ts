import { useState, useCallback } from 'react';
import { container } from '../../../../core/di/container';
import { DeactivateUserUseCase } from '../../domain/usecases/DeactivateUserUseCase';

export const useDeactivateUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deactivateUser = useCallback(async (id: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const useCase = container.resolve<DeactivateUserUseCase>('DeactivateUserUseCase');
            const result = await useCase.execute(id);

            if (result.isError()) {
                setError(result.error.message);
                return false;
            }
            return result.value;
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { deactivateUser, isLoading, error };
};