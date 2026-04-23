import React, { createContext, useContext, ReactNode } from 'react';
import { container, SERVICE_TOKENS } from '../../core/di/container';
import { LoginUseCase } from '../../modules/auth/domain/usecases/LoginUseCase';
import { LogoutUseCase } from '../../modules/auth/domain/usecases/LogoutUseCase';
import { CheckAuthUseCase } from '../../modules/auth/domain/usecases/CheckAuthUseCase';
import { GetCurrentUserUseCase } from '../../modules/auth/domain/usecases/GetCurrentUserUseCase';
import { useAuthSession } from '../../modules/auth/presentation/hooks/useAuthSession';
import { AuthSession } from '../../modules/auth/domain/entities/AuthSession';

/**
 * Auth context interface
 */
export interface AuthContextValue {
  state: {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: AuthSession | null;
    error: string | null;
  };
  login: (params: { identifier: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

/**
 * Auth context
 */
const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * AuthProvider component
 * Provides authentication context to the app
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get use cases from DI container
  const loginUseCase = container.resolve<LoginUseCase>(SERVICE_TOKENS.LOGIN_USE_CASE);
  const logoutUseCase = container.resolve<LogoutUseCase>(SERVICE_TOKENS.LOGOUT_USE_CASE);
  const checkAuthUseCase = container.resolve<CheckAuthUseCase>(SERVICE_TOKENS.CHECK_AUTH_USE_CASE);
  const getCurrentUserUseCase = container.resolve<GetCurrentUserUseCase>(SERVICE_TOKENS.GET_CURRENT_USER_USE_CASE);

  // Use auth session hook
  const { state, logout, refreshSession, clearError } = useAuthSession(
    getCurrentUserUseCase,
    checkAuthUseCase,
    logoutUseCase
  );

  /**
   * Login function
   */
  const login = async (params: { identifier: string; password: string }) => {
    const result = await loginUseCase.executeWithValidation(params);
    // The useAuthSession hook will automatically update the session
    return result;
  };

  const contextValue: AuthContextValue = {
    state,
    login,
    logout,
    refreshSession,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
