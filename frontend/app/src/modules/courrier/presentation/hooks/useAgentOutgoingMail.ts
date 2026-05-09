import { useCallback, useEffect, useState } from 'react';

import { AgentOutgoingMail } from '../../domain/entities/AgentOutgoingMail';
import { AgentOutgoingMailRemoteDataSource } from '../../data/datasources/AgentOutgoingMailRemoteDataSource';
import { AgentOutgoingMailRepositoryImpl } from '../../data/repositories/AgentOutgoingMailRepositoryImpl';
import { GetAgentOutgoingMailUseCase } from '../../domain/usecases/GetAgentOutgoingMailUseCase';

const remoteDataSource = new AgentOutgoingMailRemoteDataSource();
const repository = new AgentOutgoingMailRepositoryImpl(remoteDataSource);
const getAgentOutgoingMailUseCase = new GetAgentOutgoingMailUseCase(repository);

export const useAgentOutgoingMail = () => {
    const [items, setItems] = useState<AgentOutgoingMail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getAgentOutgoingMailUseCase.execute();

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