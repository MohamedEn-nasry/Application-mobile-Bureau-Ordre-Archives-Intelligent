import { useState, useCallback } from 'react';
import { OutgoingCourrier } from '../../domain/entities/OutgoingCourrier';
import { GetCourrierDetailsUseCase, GetCourrierDetailsParams } from '../../domain/usecases/GetCourrierDetailsUseCase';
import { container } from '../../../../core/di/container';

interface UseCourrierDetailsState {
  courrier: OutgoingCourrier | null;
  isLoading: boolean;
  error: string | null;
}

interface UseCourrierDetailsReturn extends UseCourrierDetailsState {
  fetchCourrier: (id: string) => Promise<void>;
  clearError: () => void;
  updateCourrier: (courrier: OutgoingCourrier) => void;
}

export const useCourrierDetails = (): UseCourrierDetailsReturn => {
  const [state, setState] = useState<UseCourrierDetailsState>({
    courrier: null,
    isLoading: false,
    error: null,
  });

  const fetchCourrier = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const getCourrierDetailsUseCase = container.resolve<GetCourrierDetailsUseCase>('GetCourrierDetailsUseCase');
      
      const params: GetCourrierDetailsParams = { id };
      const result = await getCourrierDetailsUseCase.execute(params);

      if (result.isSuccess()) {
        setState(prev => ({
          ...prev,
          courrier: result.value,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error.message,
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch courrier details',
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const updateCourrier = useCallback((courrier: OutgoingCourrier) => {
    setState(prev => ({ ...prev, courrier }));
  }, []);

  return {
    ...state,
    fetchCourrier,
    clearError,
    updateCourrier,
  };
};
