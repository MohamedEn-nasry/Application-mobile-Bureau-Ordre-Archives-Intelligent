import { useState, useEffect, useCallback, useMemo } from 'react';
import { IncomingMail, IncomingMailStatus } from '../../domain/entities/IncomingMail';
import { IncomingMailFilter } from '../../domain/repositories/IncomingMailRepository';
import { GetIncomingMailsUseCase } from '../../domain/usecases/GetIncomingMailsUseCase';
import { IncomingMailRepositoryImpl } from '../../data/repositories/IncomingMailRepositoryImpl';
import { IncomingMailRemoteDataSource } from '../../data/datasources/IncomingMailRemoteDataSource';
import { handleApiError, getErrorMessage } from '../../../../core/error/ErrorHandler';

type FilterStatus = IncomingMailStatus | 'All';

export const useIncomingMailViewModel = () => {
  const [mails, setMails] = useState<IncomingMail[]>([]);
  const [filteredMails, setFilteredMails] = useState<IncomingMail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IncomingMailFilter & { status?: FilterStatus }>({});

  // Initialize repository and use case with useMemo
  const getIncomingMailsUseCase = useMemo(() => {
    const remoteDataSource = new IncomingMailRemoteDataSource();
    const repository = new IncomingMailRepositoryImpl(remoteDataSource);
    return new GetIncomingMailsUseCase(repository);
  }, []);

  const loadIncomingMails = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getIncomingMailsUseCase.execute(filters);
      
      if (result.isSuccess()) {
        setMails(result.value);
        setError(null);
      } else {
        setError(result.error?.message || 'Failed to load incoming mails');
        setMails([]);
      }
    } catch (err: any) {
      const appError = handleApiError(err);
      setError(getErrorMessage(appError));
      setMails([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, getIncomingMailsUseCase]);

  const applyFilters = useCallback(() => {
    let filtered = [...mails];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(mail =>
        mail.Reference.toLowerCase().includes(searchLower) ||
        mail.Objet.toLowerCase().includes(searchLower) ||
        (mail.Expediteur && mail.Expediteur.toLowerCase().includes(searchLower))
      );
    }

    if (filters.status && (filters.status as FilterStatus) !== 'All') {
      const statusFilter = filters.status as FilterStatus;
      filtered = filtered.filter(mail => mail.Statut === (statusFilter as IncomingMailStatus));
    }

    if (filters.sender) {
      filtered = filtered.filter(mail =>
        mail.Expediteur?.toLowerCase().includes(filters.sender!.toLowerCase()) || false
      );
    }

    if (filters.subject) {
      filtered = filtered.filter(mail =>
        mail.Objet.toLowerCase().includes(filters.subject!.toLowerCase())
      );
    }

    setFilteredMails(filtered);
  }, [mails, filters]);

  useEffect(() => {
    loadIncomingMails();
  }, [loadIncomingMails]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const updateFilters = (newFilters: Partial<IncomingMailFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const refresh = () => {
    loadIncomingMails();
  };

  return {
    mails: filteredMails,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh
  };
};
