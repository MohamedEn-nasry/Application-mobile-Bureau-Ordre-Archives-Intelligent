# Bureau d'Ordre - Code Architecture & Data Flow Explanation

## Overview

This document provides a comprehensive explanation of the Bureau d'Ordre application's source code structure, architecture, and data flow. The application is built using React Native with TypeScript and follows Clean Architecture principles with proper separation of concerns.

## Architecture Overview

The application implements **Clean Architecture** with the following layers:

1. **Application Layer** - Entry point and navigation
2. **Core Layer** - Shared utilities, network, storage, and base classes
3. **Modules Layer** - Feature-specific implementations (Auth, Archives, Courrier, etc.)
4. **Components Layer** - Reusable UI components

## Directory Structure & Purpose

```
src/
├── application/           # Application entry point and navigation
│   ├── app.tsx           # Main App component
│   ├── providers/        # Context providers
│   └── routes/           # Navigation stacks
├── components/           # Reusable UI components
├── context/             # React contexts
├── core/                # Shared infrastructure
│   ├── base/           # Base classes and interfaces
│   ├── di/             # Dependency injection container
│   ├── error/          # Error handling
│   ├── network/        # API and network configuration
│   ├── storage/        # Local storage utilities
│   └── utils/          # Utility functions and types
├── data/               # Mock data for development
└── modules/            # Feature modules
    ├── archives/       # Archives management
    ├── auth/           # Authentication
    └── courrier/       # Mail/courier management
```

## Core Infrastructure

### 1. Base Classes (`src/core/base/`)

**UseCase.ts**: Defines the contract for all business logic operations
```typescript
export interface UseCase<Type, Params> {
  execute(params: Params): Promise<Result<Type>>;
}
```

**BaseEntity.ts, BaseModel.ts, BaseRepository.ts**: Provide base implementations for domain entities, data models, and repositories following Clean Architecture patterns.

### 2. Result Pattern (`src/core/utils/result.ts`)

Implements a functional approach to error handling:
- **Success<T>**: Represents successful operations
- **Error<T>**: Represents failed operations
- **Result<T>**: Union type that can be either Success or Error

This pattern eliminates try-catch blocks in business logic and provides type-safe error handling.

### 3. Dependency Injection (`src/core/di/container.ts`)

Centralized dependency management system:
- **DIContainer**: Main container class
- **SERVICE_TOKENS**: Constants for service registration
- Supports instances, factories, and singletons

### 4. Network Layer (`src/core/network/`)

**api.ts**: Centralized API configuration
- Base URL: `https://api.bureau-ordre.com`
- Configurable timeout, headers, and retry logic
- Environment-aware logging

**apiClient.ts**: HTTP client implementation
**endpoints.ts**: API endpoint definitions
**networkInfo.ts**: Network connectivity utilities

### 5. Storage Layer (`src/core/storage/`)

**localStorage.ts**: Abstract storage interface
**tokenStorage.ts**: Authentication token management

## Application Flow

### 1. Application Bootstrap (`src/application/app.tsx`)

```typescript
export const App = () => {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
};
```

The app starts by wrapping the entire application with `AppProvider` for dependency injection setup, then renders the `RootNavigator` for navigation.

### 2. Dependency Injection Setup (`src/application/providers/AppProvider.tsx`)

The `AppProvider` sets up all required services:

1. **Core Services**: API client, storage utilities
2. **Auth Services**: Repository, use cases, mappers, data sources
3. **Registration**: All services are registered in the DI container

Example setup flow:
```typescript
// Core services
const apiClient = new ApiClient(/* config */);
const storage = StorageFactory.createStorage('async');
const tokenStorage = new TokenStorageImpl(storage);

// Auth data flow
const authRemoteDataSource = new AuthRemoteDataSource(apiClient, userMapper);
const authRepository = new AuthRepositoryImpl(authRemoteDataSource, tokenStorage);
const loginUseCase = new LoginUseCase(authRepository);

// Register in DI container
container.register(SERVICE_TOKENS.LOGIN_USE_CASE, loginUseCase);
```

### 3. Navigation & Authentication (`src/application/routes/RootNavigator.tsx`)

The `RootNavigator` handles authentication state management:

1. **Loading State**: Shows loading screen while checking auth
2. **Unauthenticated**: Shows `AuthStack` (login/register)
3. **Authenticated**: Shows role-specific stack:
   - `AdminStack` for administrators
   - `AgentStack` for agents
   - `LecteurStack` for readers

## Data Flow Through Layers

### Authentication Flow Example

1. **User Input**: User enters credentials in login screen
2. **UI Layer**: Component calls authentication context
3. **Use Case Layer**: `LoginUseCase.execute()` is called
4. **Validation**: Input validation occurs in the use case
5. **Repository Layer**: `AuthRepository.login()` is called
6. **Data Source Layer**: `AuthRemoteDataSource.login()` makes API call
7. **Network Layer**: `ApiClient` sends HTTP request
8. **Response**: Data flows back through the same layers
9. **State Update**: Auth context updates authentication state
10. **Navigation**: `RootNavigator` redirects to appropriate stack

### Detailed Data Flow: Login Process

```typescript
// 1. UI Component calls use case
const loginResult = await loginUseCase.execute({ identifier, password });

// 2. Use Case validates input
protected validateInput(input: LoginParams): Result<void>

// 3. Use Case calls repository
const loginResult = await this.authRepository.login(credentials);

// 4. Repository calls data source
const response = await this.authRemoteDataSource.login(credentials);

// 5. Data source makes API call
const response = await this.apiClient.post('/auth/login', credentials);

// 6. Response flows back with Result pattern
return ok(response) or fail(error)
```

## Module Structure

### Auth Module (`src/modules/auth/`)

**Domain Layer**:
- `repositories/AuthRepository.ts`: Repository interface
- `usecases/`: Business logic (Login, Logout, CheckAuth, GetCurrentUser)

**Data Layer**:
- `datasources/AuthRemoteDataSource.ts`: API communication
- `repositories/AuthRepositoryImpl.ts`: Repository implementation
- `mappers/`: Data transformation between API and domain models

### Archives Module (`src/modules/archives/`)

Similar structure to auth module but focused on archive management functionality.

## Error Handling Strategy

The application uses a comprehensive error handling system:

1. **Failure Types** (`src/core/error/failures.ts`):
   - `AuthenticationFailure`: Auth-related errors
   - `ValidationFailure`: Input validation errors
   - `BusinessLogicFailure`: Business rule violations
   - `NetworkFailure`: Network connectivity issues

2. **Result Pattern**: All operations return `Result<T>` type
3. **Error Propagation**: Errors bubble up through layers without breaking the flow

## Key Architectural Benefits

1. **Separation of Concerns**: Each layer has specific responsibilities
2. **Testability**: Business logic is isolated from UI and infrastructure
3. **Maintainability**: Clear structure makes code easy to understand and modify
4. **Scalability**: New features can be added as independent modules
5. **Type Safety**: TypeScript provides compile-time error checking

## Information Transfer to End User

### Data Flow Summary

1. **User Interaction** → UI Components capture user input
2. **Business Logic** → Use cases validate and process requests
3. **Data Access** → Repositories abstract data operations
4. **Network Communication** → API clients handle HTTP requests
5. **Response Processing** → Data flows back through layers
6. **State Updates** → Context providers update application state
7. **UI Updates** → Components re-render with new data
8. **Navigation** → Router handles screen transitions

### State Management

- **Auth Context**: Manages authentication state globally
- **Local State**: Components manage their own UI state
- **Server State**: Data is fetched from API and cached as needed

### Security Considerations

- **Token Storage**: Authentication tokens stored securely
- **API Configuration**: Base URLs and headers configured centrally
- **Role-Based Access**: Navigation restricted by user roles
- **Input Validation**: All user inputs validated before processing

## Detailed File Navigation & Function Explanations

### Application Entry Point Flow

#### 1. `src/application/app.tsx` - Application Bootstrap
**Purpose**: Root component that initializes the entire application
**Key Variables**:
- `AppProvider`: Sets up dependency injection for all services
- `RootNavigator`: Handles navigation based on authentication state

**Why we move here**: This is the first file loaded when the app starts. It wraps everything with providers to ensure services are available before any UI renders.

#### 2. `src/application/providers/AppProvider.tsx` - Dependency Injection Setup
**Purpose**: Registers all services in the DI container
**Key Functions**:
- `setupDependencyInjection()`: Creates and registers all services
- `container.register()`: Stores services by token for later retrieval

**Key Variables**:
- `apiClient`: HTTP client for API communication
- `storage`: Local storage abstraction
- `tokenStorage`: Manages authentication tokens
- `authRemoteDataSource`: Handles API calls for auth
- `authRepository`: Business logic for authentication
- `loginUseCase`: Specific login business logic

**Why we move here**: This file ensures all dependencies are available before any component tries to use them. It's called once during app initialization.

#### 3. `src/application/routes/RootNavigator.tsx` - Navigation Controller
**Purpose**: Decides which navigation stack to show based on auth state
**Key Functions**:
- `RootNavigator()`: Main navigation component
- `LoadingScreen()`: Shows while checking authentication

**Key Variables**:
- `state.isLoading`: Shows loading indicator during auth check
- `state.isAuthenticated`: Determines if user is logged in
- `state.user?.user.role`: Determines which stack to show (Admin/Agent/Lecteur)

**Why we move here**: This is the central navigation hub that routes users to appropriate screens based on their authentication status and role.

### Authentication Flow - Detailed Step-by-Step

#### 4. `src/application/providers/AuthProvider.tsx` - Authentication Context
**Purpose**: Provides authentication state and methods to entire app
**Key Functions**:
- `login()`: Initiates login process
- `logout()`: Logs out user
- `refreshSession()`: Refreshes authentication tokens
- `clearError()`: Clears authentication errors
- `useAuth()`: Hook for components to access auth context

**Key Variables**:
- `loginUseCase`: Business logic for login
- `logoutUseCase`: Business logic for logout
- `checkAuthUseCase`: Business logic for auth checking
- `getCurrentUserUseCase`: Business logic for getting current user
- `state`: Contains isLoading, isAuthenticated, user, error

**Why we move here**: This context provides centralized authentication state management that any component can access through the `useAuth()` hook.

#### 5. `src/modules/auth/domain/usecases/LoginUseCase.ts` - Login Business Logic
**Purpose**: Handles login validation and execution
**Key Functions**:
- `execute()`: Main login execution method
- `validateInput()`: Validates user input before processing

**Key Variables**:
- `params.identifier`: User's email or username
- `params.password`: User's password
- `credentials`: Formatted credentials object
- `response`: Login response from repository

**Why we move here**: This use case contains all business rules for login (validation, error handling) before calling the repository.

#### 6. `src/modules/auth/data/repositories/AuthRepositoryImpl.ts` - Auth Repository Implementation
**Purpose**: Implements authentication repository interface
**Key Functions**:
- `login()`: Calls remote data source and saves tokens
- `logout()`: Calls remote logout and clears local storage
- `refreshToken()`: Refreshes expired tokens
- `isAuthenticated()`: Checks if user has valid tokens
- `getCurrentSession()`: Gets current user session
- `saveTokens()`: Helper to save access/refresh tokens
- `clearSession()`: Helper to clear all auth data

**Key Variables**:
- `remoteDataSource`: Handles API communication
- `tokenStorage`: Manages local token storage
- `response.user.accessToken`: JWT access token
- `response.user.refreshToken`: JWT refresh token

**Why we move here**: Repository abstracts data sources and handles both remote API calls and local storage operations.

#### 7. `src/modules/auth/data/datasources/AuthRemoteDataSource.ts` - API Communication
**Purpose**: Handles all HTTP requests for authentication
**Key Functions**:
- `login()`: Makes POST request to login endpoint
- `logout()`: Makes POST request to logout endpoint
- `refreshToken()`: Makes POST request to refresh endpoint
- `getCurrentUser()`: Makes GET request to current user endpoint
- `changePassword()`: Makes POST request to change password
- `requestPasswordReset()`: Makes POST request to password reset
- `resetPassword()`: Makes POST request to reset password with token

**Key Variables**:
- `apiClient`: HTTP client for making requests
- `userMapper`: Converts API responses to domain entities
- `credentials.identifier`: User identifier for API
- `credentials.password`: User password for API
- `data.accessToken`: JWT token from API response
- `data.refreshToken`: Refresh token from API response

**Why we move here**: This is the lowest level that actually communicates with the external API. It handles HTTP requests and response mapping.

### Network Layer Details

#### 8. `src/core/network/apiClient.ts` - HTTP Client Implementation
**Purpose**: Provides HTTP client with error handling and configuration
**Key Functions**:
- `request()`: Core HTTP request method with error handling
- `get()`: Convenience method for GET requests
- `post()`: Convenience method for POST requests
- `put()`: Convenience method for PUT requests
- `patch()`: Convenience method for PATCH requests
- `delete()`: Convenience method for DELETE requests
- `setAuthToken()`: Adds Bearer token to headers
- `clearAuthToken()`: Removes auth token from headers
- `createNetworkError()`: Creates appropriate error based on status code
- `parseHeaders()`: Converts Headers object to plain object

**Key Variables**:
- `baseUrl`: Base URL for all API requests
- `defaultHeaders`: Default headers for all requests
- `defaultTimeout`: Default timeout for requests
- `config.url`: Endpoint path
- `config.method`: HTTP method (GET, POST, etc.)
- `config.headers`: Request-specific headers
- `config.body`: Request body for POST/PUT requests
- `config.params`: URL query parameters

**Why we move here**: This is the foundation for all API communication. It handles HTTP requests, responses, timeouts, and error classification.

#### 9. `src/core/network/api.ts` - API Configuration
**Purpose**: Centralizes API configuration settings
**Key Functions**:
- `ApiConfigManager.getConfig()`: Gets current configuration
- `ApiConfigManager.updateConfig()`: Updates configuration
- `ApiConfigManager.setBaseUrl()`: Sets base URL
- `ApiConfigManager.setTimeout()`: Sets request timeout
- `ApiConfigManager.setDefaultHeader()`: Sets default header

**Key Variables**:
- `DEFAULT_API_CONFIG.baseUrl`: 'https://api.bureau-ordre.com'
- `DEFAULT_API_CONFIG.timeout`: 10000ms
- `DEFAULT_API_CONFIG.defaultHeaders`: Content-Type and Accept headers
- `DEFAULT_API_CONFIG.enableLogging`: Development-only logging
- `DEFAULT_API_CONFIG.retryAttempts`: Number of retry attempts
- `DEFAULT_API_CONFIG.retryDelay`: Delay between retries

**Why we move here**: This provides centralized configuration management for all API settings, making it easy to change endpoints, timeouts, or headers.

### Core Infrastructure Details

#### 10. `src/core/di/container.ts` - Dependency Injection Container
**Purpose**: Manages service registration and resolution
**Key Functions**:
- `register()`: Registers service instance
- `registerFactory()`: Registers service factory function
- `registerAsyncFactory()`: Registers async service factory
- `registerSingleton()`: Registers singleton service
- `registerAsyncSingleton()`: Registers async singleton service
- `resolve()`: Gets synchronous service
- `resolveAsync()`: Gets asynchronous service
- `isRegistered()`: Checks if service is registered
- `clear()`: Clears all registrations
- `remove()`: Removes specific service

**Key Variables**:
- `services`: Map of registered service instances
- `factories`: Map of registered factory functions
- `asyncFactories`: Map of registered async factory functions
- `singletons`: Map of registered singleton services
- `SERVICE_TOKENS`: Constants for service identification

**Why we move here**: This container provides centralized dependency management, allowing services to be loosely coupled and easily testable.

#### 11. `src/core/utils/result.ts` - Result Pattern Implementation
**Purpose**: Provides type-safe error handling without exceptions
**Key Functions**:
- `ok()`: Creates Success result
- `fail()`: Creates Error result
- `safeAsync()`: Wraps async functions in try-catch

**Key Classes**:
- `Success<T>`: Represents successful operation with value
- `Error<T>`: Represents failed operation with error
- `Result<T>`: Union type that can be either Success or Error

**Key Variables**:
- `value`: Success value in Success class
- `error`: Error value in Error class

**Why we move here**: This pattern eliminates try-catch blocks and provides type-safe error handling throughout the application.

### Data Transformation Flow

#### 12. Mappers and Models
**Purpose**: Transform data between different layers
**Key Files**:
- `UserMapper`: Converts between API models and domain entities
- `UserModelImpl`: Represents user data from API
- `AuthSessionImpl`: Represents authentication session

**Why we move here**: Mappers ensure data transformation is centralized and consistent, preventing data format issues between layers.

### Error Handling Flow

#### 13. `src/core/error/failures.ts` - Failure Types
**Purpose**: Defines specific error types for different scenarios
**Key Classes**:
- `AuthenticationFailure`: Auth-related errors
- `ValidationFailure`: Input validation errors
- `BusinessLogicFailure`: Business rule violations
- `NetworkFailure`: Network connectivity issues

**Why we move here**: Specific error types allow for precise error handling and user-friendly error messages.

### Complete Data Flow Example: Login Process

```
1. UI Component (LoginScreen)
   ↓ Calls: useAuth().login({ identifier, password })

2. AuthProvider.tsx
   ↓ Variables: loginUseCase from DI container
   ↓ Calls: loginUseCase.executeWithValidation(params)

3. LoginUseCase.ts
   ↓ Variables: params.identifier, params.password
   ↓ Function: validateInput() checks input validity
   ↓ Function: execute() calls repository
   ↓ Calls: authRepository.login(credentials)

4. AuthRepositoryImpl.ts
   ↓ Variables: remoteDataSource, tokenStorage
   ↓ Function: login() calls data source
   ↓ Calls: remoteDataSource.login(credentials)

5. AuthRemoteDataSource.ts
   ↓ Variables: apiClient, userMapper
   ↓ Function: login() makes API call
   ↓ Calls: apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)

6. ApiClient.ts
   ↓ Variables: baseUrl, defaultHeaders, timeout
   ↓ Function: post() calls request()
   ↓ Function: request() makes HTTP request
   ↓ Returns: Result<ApiResponse<T>>

7. Response flows back through same layers:
   ← AuthRemoteDataSource maps response
   ← AuthRepository saves tokens to storage
   ← LoginUseCase validates response
   ← AuthProvider updates context state
   ← UI Component re-renders with new state
   ← RootNavigator redirects to appropriate stack
```

## Variable Roles Summary

### Configuration Variables
- `baseUrl`: API server URL
- `timeout`: Request timeout duration
- `defaultHeaders`: Default HTTP headers
- `SERVICE_TOKENS`: Service identifiers for DI

### State Variables
- `isLoading`: Loading state indicator
- `isAuthenticated`: Authentication status
- `user`: Current user session
- `error`: Error message or null

### Data Variables
- `accessToken`: JWT authentication token
- `refreshToken`: JWT token refresh
- `credentials`: User login information
- `response`: API response data

### Function Roles Summary

### Business Logic Functions
- `execute()`: Main use case execution
- `validateInput()`: Input validation
- `login()`: Authentication logic
- `logout()`: Session termination

### Data Access Functions
- `request()`: HTTP request handling
- `saveTokens()`: Token storage
- `clearSession()`: Session cleanup
- `getCurrentUser()`: User data retrieval

### Navigation Functions
- `RootNavigator()`: Route determination
- `AuthGuard()`: Authentication protection
- `RoleGuard()`: Role-based access control

## Conclusion

This architecture provides a robust foundation for the Bureau d'Ordre application with clear separation of concerns, comprehensive error handling, and scalable module structure. The Clean Architecture approach ensures that business logic remains independent of UI frameworks and external dependencies, making the application maintainable and testable. Each file has a specific purpose, variables have clear roles, and functions follow single responsibility principles, creating a predictable and maintainable codebase.
