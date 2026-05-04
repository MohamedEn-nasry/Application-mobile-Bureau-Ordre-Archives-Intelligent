import { Result, ok, fail } from '../../../../core/utils/result';
import { AgentProfile } from '../../domain/entities/AgentProfile';
import { ProfileRepository } from '../../domain/repositories/ProfileRepository';
import { ProfileRemoteDataSource, ProfileRemoteDataSourceImpl } from '../datasources/ProfileRemoteDataSource';
import { ServerFailure } from '../../../../core/error/failures';

export class ProfileRepositoryImpl implements ProfileRepository {
  private dataSource: ProfileRemoteDataSource;

  constructor(dataSource?: ProfileRemoteDataSource) {
    this.dataSource = dataSource || new ProfileRemoteDataSourceImpl();
  }

  async getProfile(): Promise<Result<AgentProfile>> {
    try {
      const profile = await this.dataSource.getProfile();
      return ok(profile);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async updateProfile(profile: Partial<AgentProfile>): Promise<Result<AgentProfile>> {
    try {
      const updatedProfile = await this.dataSource.updateProfile(profile);
      return ok(updatedProfile);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async updatePreferences(preferences: { pushNotifications: boolean; language: string }): Promise<Result<boolean>> {
    try {
      const result = await this.dataSource.updatePreferences(preferences);
      return ok(result);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<Result<boolean>> {
    try {
      const result = await this.dataSource.changePassword(currentPassword, newPassword);
      return ok(result);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }
}
