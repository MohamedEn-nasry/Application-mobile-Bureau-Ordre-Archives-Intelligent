import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SystemStatus } from '../../domain/entities/SystemStatus';
import { SystemConfig } from '../../domain/entities/SystemConfig';
import { GetSystemInfoUseCase } from '../../domain/usecases/GetSystemInfoUseCase';

interface State {
  status: SystemStatus | null;
  config: SystemConfig | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_STATUS'; payload: SystemStatus }
  | { type: 'SET_CONFIG'; payload: SystemConfig }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: State = {
  status: null,
  config: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
};

const systemInfoReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_REFRESHING':
      return { ...state, isRefreshing: action.payload, error: null };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isRefreshing: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

interface ContextType {
  state: State;
  loadSystemInfo: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

const SystemInfoContext = createContext<ContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const SystemInfoProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(systemInfoReducer, initialState);
  const getSystemInfoUseCase = new GetSystemInfoUseCase();

  const loadSystemInfo = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await getSystemInfoUseCase.execute();
      dispatch({ type: 'SET_STATUS', payload: result.status });
      dispatch({ type: 'SET_CONFIG', payload: result.config });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load system information' });
    }
  };

  const refreshData = async () => {
    try {
      dispatch({ type: 'SET_REFRESHING', payload: true });
      const result = await getSystemInfoUseCase.execute();
      dispatch({ type: 'SET_STATUS', payload: result.status });
      dispatch({ type: 'SET_CONFIG', payload: result.config });
      dispatch({ type: 'SET_REFRESHING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh system information' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  useEffect(() => {
    loadSystemInfo();
  }, []);

  const contextValue: ContextType = {
    state,
    loadSystemInfo,
    refreshData,
    clearError,
  };

  return React.createElement(
    SystemInfoContext.Provider,
    { value: contextValue },
    children
  );
};

export const useSystemInfo = (): ContextType => {
  const context = useContext(SystemInfoContext);
  if (!context) {
    throw new Error('useSystemInfo must be used within a SystemInfoProvider');
  }
  return context;
};
