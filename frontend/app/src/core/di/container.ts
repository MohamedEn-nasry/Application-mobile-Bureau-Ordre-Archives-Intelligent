import { apiClient } from '../network/apiClient';
import { tokenStorage } from '../storage/tokenStorage';

// Auth Module
import { AuthRemoteDataSource } from '../../modules/auth/data/datasources/AuthRemoteDataSource';
import { AuthRepositoryImpl } from '../../modules/auth/data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '../../modules/auth/domain/usecases/LoginUseCase';
import { LogoutUseCase } from '../../modules/auth/domain/usecases/LogoutUseCase';
import { CheckAuthUseCase } from '../../modules/auth/domain/usecases/CheckAuthUseCase';

// Users Module
import { UserManagementRemoteDataSource } from '../../modules/users/data/datasources/UserManagementRemoteDataSource';
import { UserManagementRepositoryImpl } from '../../modules/users/data/repositories/UserManagementRepositoryImpl';
import { CreateUserUseCase } from '../../modules/users/domain/usecases/CreateUserUseCase';
import { GetUsersUseCase } from '../../modules/users/domain/usecases/GetUsersUseCase';

// Dashboard Module
import { DashboardRemoteDataSource } from '../../modules/dashboard/data/datasources/DashboardRemoteDataSource';
import { DashboardRepositoryImpl } from '../../modules/dashboard/data/repositories/DashboardRepositoryImpl';
import { GetDashboardStatsUseCase } from '../../modules/dashboard/domain/usecases/GetDashboardStatsUseCase';
import { GetRecentActivityUseCase } from '../../modules/dashboard/domain/usecases/GetRecentActivityUseCase';
import { DeactivateUserUseCase } from '../../modules/users/domain/usecases/DeactivateUserUseCase';
import { ActivateUserUseCase } from '../../modules/users/domain/usecases/ActivateUserUseCase';
import { UpdateUserUseCase } from '../../modules/users/domain/usecases/UpdateUserUseCase';
import { ChangePasswordUseCase } from '../../modules/users/domain/usecases/ChangePasswordUseCase';

<<<<<<< HEAD
// Courrier Module
import { OutgoingCourrierRemoteDataSource } from '../../modules/courrier/data/datasources/OutgoingCourrierRemoteDataSource';
import { OutgoingCourrierRepositoryImpl } from '../../modules/courrier/data/repositories/OutgoingCourrierRepositoryImpl';
import { GetOutgoingCourrierUseCase } from '../../modules/courrier/domain/usecases/GetOutgoingCourrierUseCase';
import { GetCourrierDetailsUseCase } from '../../modules/courrier/domain/usecases/GetCourrierDetailsUseCase';

=======
>>>>>>> origin/develop
// This is a simple manual DI container
export class DIContainer {
  private static instance: DIContainer;
  private dependencies: Map<string, any> = new Map();

  private constructor() { }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
      DIContainer.instance.init();
    }
    return DIContainer.instance;
  }

  private init() {
    // 1. Core
    this.register('apiClient', apiClient);
    this.register('tokenStorage', tokenStorage);

    // 2. Auth Module
    const authRemoteDataSource = new AuthRemoteDataSource();
    const authRepository = new AuthRepositoryImpl(authRemoteDataSource, tokenStorage);
    this.register('AuthRepository', authRepository);
    this.register('LoginUseCase', new LoginUseCase(authRepository));
    this.register('LogoutUseCase', new LogoutUseCase(authRepository));
    this.register('CheckAuthUseCase', new CheckAuthUseCase(authRepository));

    // 3. Users Module
    const userRemoteDataSource = new UserManagementRemoteDataSource();
    const userRepository = new UserManagementRepositoryImpl(userRemoteDataSource);
    this.register('UserRepository', userRepository);
    this.register('CreateUserUseCase', new CreateUserUseCase(userRepository));
    this.register('GetUsersUseCase', new GetUsersUseCase(userRepository));
    this.register('DeactivateUserUseCase', new DeactivateUserUseCase(userRepository));
    this.register('ActivateUserUseCase', new ActivateUserUseCase(userRepository));
    this.register('UpdateUserUseCase', new UpdateUserUseCase(userRepository));
    this.register('ChangePasswordUseCase', new ChangePasswordUseCase(userRepository));

    // 4. Dashboard Module
    const dashboardRemoteDataSource = new DashboardRemoteDataSource();
    const dashboardRepository = new DashboardRepositoryImpl(dashboardRemoteDataSource);
    this.register('DashboardRepository', dashboardRepository);
    this.register('GetDashboardStatsUseCase', new GetDashboardStatsUseCase(dashboardRepository));
    this.register('GetRecentActivityUseCase', new GetRecentActivityUseCase(dashboardRepository));
<<<<<<< HEAD

    // 5. Courrier Module
    const courrierRemoteDataSource = new OutgoingCourrierRemoteDataSource();
    const courrierRepository = new OutgoingCourrierRepositoryImpl(courrierRemoteDataSource);
    this.register('OutgoingCourrierRepository', courrierRepository);
    this.register('GetOutgoingCourrierUseCase', new GetOutgoingCourrierUseCase(courrierRepository));
    this.register('GetCourrierDetailsUseCase', new GetCourrierDetailsUseCase(courrierRepository));
=======
>>>>>>> origin/develop
  }

  public register<T>(key: string, instance: T): void {
    this.dependencies.set(key, instance);
  }

  public resolve<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    if (!dependency) {
      throw new Error(`Dependency ${key} not found.`);
    }
    return dependency as T;
  }
}

export const container = DIContainer.getInstance();
