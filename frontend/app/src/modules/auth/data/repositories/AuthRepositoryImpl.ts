import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { AuthSession } from '../../domain/entities/AuthSession';
import { Result, ok, fail } from '../../../../core/utils/result';
import { AuthRemoteDataSource } from '../datasources/AuthRemoteDataSource';
import { TokenStorage } from '../../../../core/storage/tokenStorage';
import { Failure, ServerFailure, AuthFailure } from '../../../../core/error/failures';
import { Role } from '../../../../shared/constants/roles';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private remoteDataSource: AuthRemoteDataSource,
    private tokenStorage: TokenStorage
  ) {}

  async login(email: string, password: string): Promise<Result<AuthSession>> {
    try {
      const response = await this.remoteDataSource.login(email, password);
      
      const session = new AuthSession(
        response.token,
        response.user.id,
        response.user.email,
        response.user.role as Role
      );

      await this.tokenStorage.setToken(session.token);
      return ok(session);
    } catch (error: any) {
      if (error.name === 'AuthException') {
        return fail(new AuthFailure(error.message));
      }
      return fail(new ServerFailure(error.message));
    }
  }

  async logout(): Promise<Result<void>> {
    try {
      await this.remoteDataSource.logout();
      await this.tokenStorage.clearToken();
      return ok(undefined);
    } catch (error: any) {
      // Force clear token locally even if server fails
      await this.tokenStorage.clearToken();
      return fail(new ServerFailure(error.message));
    }
  }

  async getSession(): Promise<Result<AuthSession | null>> {
    // In a real app we'd fetch me() if token exists, we simulate fetching cached token
    const token = await this.tokenStorage.getToken();
    if (!token) return ok(null);
    
    // For demo purposes returning null. Real Implementation fetches from /auth/me
    return ok(null); 
  }
}
