import { useState, useCallback } from 'react';
import { AsyncResult, failure } from '../../../../core/utils/result';
import { LoginUseCase, LoginParams } from '../../domain/usecases/LoginUseCase';
import { LoginResponse } from '../../domain/repositories/AuthRepository';

/**
 * Login hook state
 */
export interface LoginState {
  isLoading: boolean;
  error: string | null;
  data: LoginResponse | null;
}

/**
 * Custom hook for login functionality
 * Provides login state management and login execution
 */
export const useLogin = (loginUseCase: LoginUseCase) => {
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
    data: null,
  });

  /**
   * Execute login
   */
  const login = useCallback(async (params: LoginParams): Promise<AsyncResult<LoginResponse>> => {
    setState((prev: LoginState) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await loginUseCase.executeWithValidation(params);
      
      if (result.isFailure()) {
        setState((prev: LoginState) => ({
          ...prev,
          isLoading: false,
          error: result.error.message,
          data: null,
        }));
      } else {
        setState((prev: LoginState) => ({
          ...prev,
          isLoading: false,
          error: null,
          data: result.value,
        }));
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState((prev: LoginState) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        data: null,
      }));
      
      return failure(error as Error);
    }
  }, [loginUseCase]);

  /**
   * Reset login state
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: null,
    });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev: LoginState) => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    login,
    reset,
    clearError,
  };
};
