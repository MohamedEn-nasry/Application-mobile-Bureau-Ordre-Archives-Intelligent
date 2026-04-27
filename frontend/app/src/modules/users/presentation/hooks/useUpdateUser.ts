import { useState, useCallback } from 'react';
import { container } from '../../../../core/di/container';
import { UpdateUserUseCase } from '../../domain/usecases/UpdateUserUseCase';

export const useUpdateUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUser = useCallback(async (params: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
        roleName: string;
        isActive: boolean;
        imagePath?: string;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const useCase = container.resolve<UpdateUserUseCase>('UpdateUserUseCase');
            const result = await useCase.execute(params);

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

    return { updateUser, isLoading, error };
};
