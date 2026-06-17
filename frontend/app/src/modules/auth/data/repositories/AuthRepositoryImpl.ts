import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { AuthSession } from "../../domain/entities/AuthSession";
import { Result, ok, fail } from "../../../../core/utils/result";
import { AuthRemoteDataSource } from "../datasources/AuthRemoteDataSource";
import { TokenStorage } from "../../../../core/storage/tokenStorage";
import {
  Failure,
  ServerFailure,
  AuthFailure,
} from "../../../../core/error/failures";
import { AuthMapper } from "../mappers/AuthMapper";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private remoteDataSource: AuthRemoteDataSource,
    private tokenStorage: TokenStorage,
  ) { }

  // ──── Login ──────────────────────────────────────────────────────────
  async login(email: string, password: string): Promise<Result<AuthSession>> {
    try {
      const response = await this.remoteDataSource.login(email, password);
      const session = AuthMapper.toDomain(response);

      await this.tokenStorage.setToken(session.token);
      await this.tokenStorage.setRefreshToken(session.refreshToken);
      await this.tokenStorage.setEmail(session.email);
      await this.tokenStorage.setUserId(session.userId);
      await this.tokenStorage.setFullName(session.fullName);
      await this.tokenStorage.setRole(session.role);

      return ok(session);
    } catch (error: any) {
      if (error.name === "AuthException") {
        return fail(new AuthFailure(error.message));
      }
      return fail(new ServerFailure(error.message));
    }
  }

  // ──── Refresh ─────────────────────────────────────────────────────────
  async refresh(
    email: string,
    refreshToken: string,
  ): Promise<Result<AuthSession>> {
    try {
      const response = await this.remoteDataSource.refresh(email, refreshToken);
      const session = AuthMapper.toDomain(response);

      await this.tokenStorage.setToken(session.token);
      await this.tokenStorage.setRefreshToken(session.refreshToken);
      await this.tokenStorage.setUserId(session.userId);
      await this.tokenStorage.setFullName(session.fullName);
      await this.tokenStorage.setRole(session.role);

      return ok(session);
    } catch (error: any) {

      await this.tokenStorage.clearAll();
      if (error.name === "AuthException") {
        return fail(new AuthFailure(error.message));
      }
      return fail(new ServerFailure(error.message));
    }
  }

  // ──── Logout ──────────────────────────────────────────────────────────
  async logout(
    email: string,
    refreshToken: string,
  ): Promise<Result<void>> {
    try {
      await this.remoteDataSource.logout(email, refreshToken);
    } catch (error: any) {

      console.warn("Logout server call failed, clearing locally:", error.message);
    } finally {
      await this.tokenStorage.clearAll();
    }
    return ok(undefined);
  }

  // ──── GetSession ──────────────────────────────────────────────────────
  async getSession(): Promise<Result<AuthSession | null>> {
    try {
      const token = await this.tokenStorage.getToken();
      const refreshToken = await this.tokenStorage.getRefreshToken();
      const email = await this.tokenStorage.getEmail();
      const userId = await this.tokenStorage.getUserId();
      const fullName = await this.tokenStorage.getFullName();
      const role = await this.tokenStorage.getRole();

      if (!token || !refreshToken || !email) {
        return ok(null);
      }


      const session = new AuthSession(
        token,
        refreshToken,
        userId ?? '',
        email,
        fullName ?? '',
        (role ?? 'Agent') as any,
      );
      return ok(session);
    } catch {
      await this.tokenStorage.clearAll();
      return ok(null);
    }
  }
}
