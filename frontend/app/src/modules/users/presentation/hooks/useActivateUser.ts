import { useState, useCallback } from 'react';
import { container } from '../../../../core/di/container';
import { ActivateUserUseCase } from '../../domain/usecases/ActivateUserUseCase';

export const useActivateUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activateUser = useCallback(async (id: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const useCase = container.resolve<ActivateUserUseCase>('ActivateUserUseCase');
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

    return { activateUser, isLoading, error };
};
