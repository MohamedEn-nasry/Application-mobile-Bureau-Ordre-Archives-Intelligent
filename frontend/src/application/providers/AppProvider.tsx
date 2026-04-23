import React, { ReactNode, useEffect } from 'react';
import { container, SERVICE_TOKENS } from '../../core/di/container';
import { ApiClient } from '../../core/network/apiClient';
import { apiConfig } from '../../core/network/api';
import { StorageFactory } from '../../core/storage/localStorage';
import { TokenStorageImpl } from '../../core/storage/tokenStorage';
import { UserMapper } from '../../modules/auth/data/mappers/userMapper';
import { AuthMapper } from '../../modules/auth/data/mappers/AuthMapper';
import { AuthRemoteDataSource } from '../../modules/auth/data/datasources/AuthRemoteDataSource';
import { AuthRepositoryImpl } from '../../modules/auth/data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '../../modules/auth/domain/usecases/LoginUseCase';
import { LogoutUseCase } from '../../modules/auth/domain/usecases/LogoutUseCase';
import { CheckAuthUseCase } from '../../modules/auth/domain/usecases/CheckAuthUseCase';
import { GetCurrentUserUseCase } from '../../modules/auth/domain/usecases/GetCurrentUserUseCase';

/**
 * AppProvider component
 * Sets up dependency injection and provides all services to the app
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    setupDependencyInjection();
  }, []);

  return <>{children}</>;
};

/**
 * Setup dependency injection container
 */
const setupDependencyInjection = () => {
  // Core services
  const apiClient = new ApiClient(
    apiConfig.getConfig().baseUrl,
    apiConfig.getConfig().defaultHeaders,
    apiConfig.getConfig().timeout
  );

  const storage = StorageFactory.createStorage('async');
  const tokenStorage = new TokenStorageImpl(storage);

  // Register core services
  container.register(SERVICE_TOKENS.API_CLIENT, apiClient);

  // Auth mappers
  const userMapper = new UserMapper();
  const authMapper = new AuthMapper();

  // Auth data source
  const authRemoteDataSource = new AuthRemoteDataSource(apiClient, userMapper);

  // Auth repository
  const authRepository = new AuthRepositoryImpl(authRemoteDataSource, tokenStorage);

  // Auth use cases
  const loginUseCase = new LoginUseCase(authRepository);
  const logoutUseCase = new LogoutUseCase(authRepository);
  const checkAuthUseCase = new CheckAuthUseCase(authRepository);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);

  // Register auth services
  container.register(SERVICE_TOKENS.AUTH_REPOSITORY, authRepository);
  container.register(SERVICE_TOKENS.LOGIN_USE_CASE, loginUseCase);
  container.register(SERVICE_TOKENS.LOGOUT_USE_CASE, logoutUseCase);
  container.register(SERVICE_TOKENS.CHECK_AUTH_USE_CASE, checkAuthUseCase);
  container.register(SERVICE_TOKENS.GET_CURRENT_USER_USE_CASE, getCurrentUserUseCase);

  // Register other services (for future modules)
  // container.register(SERVICE_TOKENS.USER_MANAGEMENT_REPOSITORY, ...);
  // container.register(SERVICE_TOKENS.GET_USERS_USE_CASE, ...);
  // container.register(SERVICE_TOKENS.CREATE_USER_USE_CASE, ...);
};
