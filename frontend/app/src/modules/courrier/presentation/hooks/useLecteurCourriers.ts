import { useCallback, useEffect, useState } from 'react';

import { Courrier } from '../../domain/entities/Courrier';
import { LecteurCourrierFilters } from '../../domain/repositories/LecteurCourrierRepository';
import { LecteurCourrierRemoteDataSource } from '../../data/datasources/LecteurCourrierRemoteDataSource';
import { LecteurCourrierRepositoryImpl } from '../../data/repositories/LecteurCourrierRepositoryImpl';
import { GetLecteurCourriersUseCase } from '../../domain/usecases/GetLecteurCourriersUseCase';

const remoteDataSource = new LecteurCourrierRemoteDataSource();
const repository = new LecteurCourrierRepositoryImpl(remoteDataSource);
const getLecteurCourriersUseCase = new GetLecteurCourriersUseCase(repository);

export const useLecteurCourriers = () => {
    const [items, setItems] = useState<Courrier[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async (filters?: LecteurCourrierFilters) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getLecteurCourriersUseCase.execute(filters);

            if (result.isSuccess()) {
                setItems(result.value);
            } else {
                setError(result.error.message);
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des courriers.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return {
        items,
        isLoading,
        error,
        refetch: fetchItems,
    };
};
