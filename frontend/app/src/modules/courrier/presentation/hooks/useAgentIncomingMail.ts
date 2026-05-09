import { useCallback, useEffect, useState } from 'react';

import { AgentIncomingMail } from '../../domain/entities/AgentIncomingMail';
import { AgentIncomingMailRemoteDataSource } from '../../data/datasources/AgentIncomingMailRemoteDataSource';
import { AgentIncomingMailRepositoryImpl } from '../../data/repositories/AgentIncomingMailRepositoryImpl';
import { GetAgentIncomingMailUseCase } from '../../domain/usecases/GetAgentIncomingMailUseCase';

const remoteDataSource = new AgentIncomingMailRemoteDataSource();
const repository = new AgentIncomingMailRepositoryImpl(remoteDataSource);
const getAgentIncomingMailUseCase = new GetAgentIncomingMailUseCase(repository);

export const useAgentIncomingMail = () => {
    const [items, setItems] = useState<AgentIncomingMail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getAgentIncomingMailUseCase.execute();

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