import { useCallback, useState } from 'react';

import { UserEmailLookup } from '../../../users/domain/entities/UserEmailLookup';
import { UserLookupRemoteDataSource } from '../../../users/data/datasources/UserLookupRemoteDataSource';
import { UserLookupRepositoryImpl } from '../../../users/data/repositories/UserLookupRepositoryImpl';
import { SearchUsersByEmailUseCase } from '../../../users/domain/usecases/SearchUsersByEmailUseCase';

const dataSource = new UserLookupRemoteDataSource();
const repository = new UserLookupRepositoryImpl(dataSource);
const searchUsersByEmailUseCase = new SearchUsersByEmailUseCase(repository);

export const useUserEmailLookup = () => {
    const [suggestions, setSuggestions] = useState<UserEmailLookup[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [lookupError, setLookupError] = useState<string | null>(null);

    const searchUsers = useCallback(async (email: string) => {
        const value = email.trim();

        if (value.length < 2) {
            setSuggestions([]);
            setLookupError(null);
            return;
        }

        setIsSearching(true);
        setLookupError(null);

        try {
            const result = await searchUsersByEmailUseCase.execute(value);

            if (result.isSuccess()) {
                setSuggestions(result.value);
            } else {
                setLookupError(result.error.message);
            }
        } catch (err: any) {
            setLookupError(err.message || 'Erreur lors de la recherche.');
        } finally {
            setIsSearching(false);
        }
    }, []);

    const clearSuggestions = () => {
        setSuggestions([]);
    };

    return {
        suggestions,
        isSearching,
        lookupError,
        searchUsers,
        clearSuggestions,
    };
};