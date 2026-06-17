import { Result } from '../../../../core/utils/result';
import { AuthSession } from '../entities/AuthSession';

export interface AuthRepository {
  login(email: string, password: string): Promise<Result<AuthSession>>;
  refresh(email: string, refreshToken: string): Promise<Result<AuthSession>>;
  logout(email: string, refreshToken: string): Promise<Result<void>>;
  getSession(): Promise<Result<AuthSession | null>>;
}
