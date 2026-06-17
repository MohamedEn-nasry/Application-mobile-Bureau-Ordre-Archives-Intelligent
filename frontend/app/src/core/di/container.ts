import { apiClient } from '../network/apiClient';
import { tokenStorage } from '../storage/tokenStorage';

// Auth Module
import { AuthRemoteDataSource } from '../../modules/auth/data/datasources/AuthRemoteDataSource';
import { AuthRepositoryImpl } from '../../modules/auth/data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '../../modules/auth/domain/usecases/LoginUseCase';
import { LogoutUseCase } from '../../modules/auth/domain/usecases/LogoutUseCase';
import { CheckAuthUseCase } from '../../modules/auth/domain/usecases/CheckAuthUseCase';
import { RefreshTokenUseCase } from '../../modules/auth/domain/usecases/RefreshTokenUseCase';

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


import { CourrierRemoteDataSource } from '../../modules/courrier/data/datasources/CourrierRemoteDataSource';
import { CourrierRepositoryImpl } from '../../modules/courrier/data/repositories/CourrierRepositoryImpl';

import { GetCourriersUseCase } from '../../modules/courrier/domain/usecases/GetCourriersUseCase';
import { GetCourrierByIdUseCase } from '../../modules/courrier/domain/usecases/GetCourrierByIdUseCase';
import { CreateCourrierUseCase } from '../../modules/courrier/domain/usecases/CreateCourrierUseCase';
import { UpdateCourrierUseCase } from '../../modules/courrier/domain/usecases/UpdateCourrierUseCase';
import { UpdateCourrierStatusUseCase } from '../../modules/courrier/domain/usecases/UpdateCourrierStatusUseCase';
import { ArchiveCourrierUseCase } from '../../modules/courrier/domain/usecases/ArchiveCourrierUseCase';
import { DeleteCourrierUseCase } from '../../modules/courrier/domain/usecases/DeleteCourrierUseCase';
import { CategorieRemoteDataSource } from '../../modules/courrier/data/datasources/CategorieRemoteDataSource';
import { CategorieRepositoryImpl } from '../../modules/courrier/data/repositories/CategorieRepositoryImpl';
import { GetCategoriesUseCase } from '../../modules/courrier/domain/usecases/GetCategoriesUseCase';
import { NotificationRemoteDataSource } from '../../modules/notifications/data/datasources/NotificationsRemoteDataSource';
import { NotificationRepositoryImpl } from '../../modules/notifications/data/repositories/NotificationsRepositoryImpl';

import { GetNotificationsUseCase } from '../../modules/notifications/domain/usecases/GetNotificationsUseCase';
import { GetLecteurNotificationsUseCase } from '../../modules/notifications/domain/usecases/GetLecteurNotificationsUseCase';
import { GetSuperAgentNotificationsUseCase } from '../../modules/notifications/domain/usecases/GetSuperAgentNotificationsUseCase';
import { GetUnreadNotificationsCountUseCase } from '../../modules/notifications/domain/usecases/GetUnreadCountUseCase';
import { MarkNotificationAsReadUseCase } from '../../modules/notifications/domain/usecases/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../modules/notifications/domain/usecases/MarkAllNotificationsAsReadUseCase';
import { DeleteNotificationUseCase } from '../../modules/notifications/domain/usecases/DeleteNotificationUseCase';

import { ReportsRemoteDataSource } from '../../modules/reports/data/datasources/ReportsRemoteDataSource';
import { ReportsRepositoryImpl } from '../../modules/reports/data/repositories/ReportsRepositoryImpl';
import { GetReportsOverviewUseCase } from '../../modules/reports/domain/usecases/GetReportsOverviewUseCase';
import { AgentDashboardRemoteDataSource } from '../../modules/dashboard/data/datasources/AgentDashboardRemoteDataSource';
import { AgentDashboardRepositoryImpl } from '../../modules/dashboard/data/repositories/AgentDashboardRepositoryImpl';
import { GetAgentDashboardUseCase } from '../../modules/dashboard/domain/usecases/GetAgentDashboardUseCase';


import { PieceJointeRemoteDataSource } from '../../modules/courrier/data/datasources/PieceJointeRemoteDataSource';
import { PieceJointeRepositoryImpl } from '../../modules/courrier/data/repositories/PieceJointeRepositoryImpl';
import { GetCourrierPiecesJointesUseCase } from '../../modules/courrier/domain/usecases/GetCourrierPiecesJointesUseCase';
import { GetPieceJointeImageUseCase } from '../../modules/courrier/domain/usecases/GetPieceJointeImageUseCase';
import { GetAgentOcrResultsUseCase } from '../../modules/dashboard/domain/usecases/GetAgentOcrResultsUseCase';

import { LecteurDashboardRemoteDataSource } from '../../modules/dashboard/data/datasources/LecteurDashboardRemoteDataSource';
import { LecteurDashboardRepositoryImpl } from '../../modules/dashboard/data/repositories/LecteurDashboardRepositoryImpl';
import { GetLecteurDashboardUseCase } from '../../modules/dashboard/domain/usecases/GetLecteurDashboardUseCase';

// SuperAgent Dashboard Module
import { SuperAgentDashboardRemoteDataSource } from '../../modules/dashboard/data/datasources/SuperAgentDashboardRemoteDataSource';
import { SuperAgentDashboardRepositoryImpl } from '../../modules/dashboard/data/repositories/SuperAgentDashboardRepositoryImpl';
import { GetSuperAgentDashboardUseCase } from '../../modules/dashboard/domain/usecases/GetSuperAgentDashboardUseCase';
import { GetSuperAgentOcrResultsUseCase } from '../../modules/dashboard/domain/usecases/GetSuperAgentOcrResultsUseCase';

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
    this.register('RefreshTokenUseCase', new RefreshTokenUseCase(authRepository));

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

    // 5. Courrier Module
    const courrierRemoteDataSource = new CourrierRemoteDataSource();
    const courrierRepository = new CourrierRepositoryImpl(courrierRemoteDataSource);

    this.register('CourrierRepository', courrierRepository);
    this.register('GetCourriersUseCase', new GetCourriersUseCase(courrierRepository));
    this.register('GetCourrierByIdUseCase', new GetCourrierByIdUseCase(courrierRepository));
    this.register('CreateCourrierUseCase', new CreateCourrierUseCase(courrierRepository));
    this.register('UpdateCourrierUseCase', new UpdateCourrierUseCase(courrierRepository));
    this.register('UpdateCourrierStatusUseCase', new UpdateCourrierStatusUseCase(courrierRepository));
    this.register('ArchiveCourrierUseCase', new ArchiveCourrierUseCase(courrierRepository));
    this.register('DeleteCourrierUseCase', new DeleteCourrierUseCase(courrierRepository));

    // Categories Module
    const categorieRemoteDataSource = new CategorieRemoteDataSource();
    const categorieRepository = new CategorieRepositoryImpl(categorieRemoteDataSource);

    this.register('CategorieRepository', categorieRepository);
    this.register('GetCategoriesUseCase', new GetCategoriesUseCase(categorieRepository));


    // Notifications Module
    const notificationRemoteDataSource = new NotificationRemoteDataSource();
    const notificationRepository = new NotificationRepositoryImpl(notificationRemoteDataSource);

    this.register('NotificationRepository', notificationRepository);
    this.register('GetNotificationsUseCase', new GetNotificationsUseCase(notificationRepository));
    this.register('GetLecteurNotificationsUseCase', new GetLecteurNotificationsUseCase(notificationRepository));
    this.register('GetSuperAgentNotificationsUseCase', new GetSuperAgentNotificationsUseCase(notificationRepository));
    this.register('GetUnreadNotificationsCountUseCase', new GetUnreadNotificationsCountUseCase(notificationRepository));
    this.register('MarkNotificationAsReadUseCase', new MarkNotificationAsReadUseCase(notificationRepository));
    this.register('MarkAllNotificationsAsReadUseCase', new MarkAllNotificationsAsReadUseCase(notificationRepository));
    this.register('DeleteNotificationUseCase', new DeleteNotificationUseCase(notificationRepository));

    // Reports Module
    const reportsRemoteDataSource = new ReportsRemoteDataSource();
    const reportsRepository = new ReportsRepositoryImpl(reportsRemoteDataSource);

    this.register('ReportsRepository', reportsRepository);
    this.register('GetReportsOverviewUseCase', new GetReportsOverviewUseCase(reportsRepository));

    // Agent Dashboard Module
    const agentDashboardRemoteDataSource = new AgentDashboardRemoteDataSource();
    const agentDashboardRepository = new AgentDashboardRepositoryImpl(agentDashboardRemoteDataSource);

    this.register('GetAgentDashboardUseCase', new GetAgentDashboardUseCase(agentDashboardRepository));

    // RefreshTokenUseCase already registered above
    this.register(
      'GetAgentOcrResultsUseCase',
      new GetAgentOcrResultsUseCase(agentDashboardRepository)
    );

    ///Image OCR

    const pieceJointeRemoteDataSource = new PieceJointeRemoteDataSource();
    const pieceJointeRepository = new PieceJointeRepositoryImpl(
      pieceJointeRemoteDataSource
    );

    this.register('GetCourrierPiecesJointesUseCase', new GetCourrierPiecesJointesUseCase(pieceJointeRepository));

    this.register('GetPieceJointeImageUseCase', new GetPieceJointeImageUseCase(pieceJointeRepository));


    const lecteurDashboardRemoteDataSource =
      new LecteurDashboardRemoteDataSource();

    const lecteurDashboardRepository =
      new LecteurDashboardRepositoryImpl(lecteurDashboardRemoteDataSource);

    this.register('GetLecteurDashboardUseCase', new GetLecteurDashboardUseCase(lecteurDashboardRepository)
    );

    // SuperAgent Dashboard Module Registration
    const superAgentDashboardRemoteDataSource = new SuperAgentDashboardRemoteDataSource();
    const superAgentDashboardRepository = new SuperAgentDashboardRepositoryImpl(superAgentDashboardRemoteDataSource);

    this.register('GetSuperAgentDashboardUseCase', new GetSuperAgentDashboardUseCase(superAgentDashboardRepository));
    this.register('GetSuperAgentOcrResultsUseCase', new GetSuperAgentOcrResultsUseCase(superAgentDashboardRepository));

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
