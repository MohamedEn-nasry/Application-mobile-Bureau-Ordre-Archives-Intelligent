import { useCallback, useEffect, useState } from 'react';

import { UserProfile } from '../../domain/entities/UserProfile';
import { UserProfileRemoteDataSource } from '../../data/datasources/UserProfileRemoteDataSource';
import { UserProfileRepositoryImpl } from '../../data/repositories/UserProfileRepositoryImpl';
import { GetUserProfileUseCase } from '../../domain/usecases/GetUserProfileUseCase';

const remoteDataSource = new UserProfileRemoteDataSource();
const repository = new UserProfileRepositoryImpl(remoteDataSource);
const getUserProfileUseCase = new GetUserProfileUseCase(repository);

export const useUserProfile = (userId: number) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await getUserProfileUseCase.execute(userId);

            if (result.isSuccess()) {
                setProfile(result.value);
            } else {
                setError(result.error.message);
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement du profil.');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        isLoading,
        error,
        refetch: fetchProfile,
    };
};