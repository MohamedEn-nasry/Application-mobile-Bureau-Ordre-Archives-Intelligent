import { useState, useEffect, useCallback } from 'react';
import { AsyncResult } from '../../../../core/utils/result';
import { GetCurrentUserUseCase } from '../../domain/usecases/GetCurrentUserUseCase';
import { CheckAuthUseCase } from '../../domain/usecases/CheckAuthUseCase';
import { LogoutUseCase } from '../../domain/usecases/LogoutUseCase';
import { AuthSession } from '../../domain/entities/AuthSession';

/**
 * Auth session hook state
 */
export interface AuthSessionState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthSession | null;
  error: string | null;
}

/**
 * Custom hook for authentication session management
 * Provides session state and auth operations
 */
export const useAuthSession = (
  getCurrentUserUseCase: GetCurrentUserUseCase,
  checkAuthUseCase: CheckAuthUseCase,
  logoutUseCase: LogoutUseCase
) => {
  const [state, setState] = useState<AuthSessionState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(async () => {
    const result = await checkAuthUseCase.execute();
    
    if (result.isFailure()) {
      setState((prev: AuthSessionState) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        error: result.error.message,
      }));
      return false;
    }

    const isAuthenticated = result.value;
    setState((prev: AuthSessionState) => ({
      ...prev,
      isAuthenticated,
    }));

    return isAuthenticated;
  }, [checkAuthUseCase]);

  /**
   * Get current user
   */
  const getCurrentUser = useCallback(async () => {
    const result = await getCurrentUserUseCase.execute();
    
    if (result.isFailure()) {
      setState((prev: AuthSessionState) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: result.error.message,
      }));
      return;
    }

    const user = result.value;
    setState((prev: AuthSessionState) => ({
      ...prev,
      isLoading: false,
      isAuthenticated: !!user,
      user,
      error: null,
    }));
  }, [getCurrentUserUseCase]);

  /**
   * Logout
   */
  const logout = useCallback(async (): Promise<AsyncResult<void>> => {
    const result = await logoutUseCase.execute();
    
    if (result.isFailure()) {
      setState((prev: AuthSessionState) => ({
        ...prev,
        error: result.error.message,
      }));
    } else {
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
    }

    return result;
  }, [logoutUseCase]);

  /**
   * Refresh session
   */
  const refreshSession = useCallback(async () => {
    setState((prev: AuthSessionState) => ({ ...prev, isLoading: true, error: null }));
    await getCurrentUser();
  }, [getCurrentUser]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev: AuthSessionState) => ({ ...prev, error: null }));
  }, []);

  /**
   * Initialize auth session on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        await getCurrentUser();
      } else {
        setState((prev: AuthSessionState) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    initializeAuth();
  }, [checkAuth, getCurrentUser]);

  return {
    state,
    checkAuth,
    getCurrentUser,
    logout,
    refreshSession,
    clearError,
  };
};
