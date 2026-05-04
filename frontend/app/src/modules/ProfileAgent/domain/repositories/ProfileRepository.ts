import { Result } from '../../../../core/utils/result';
import { AgentProfile } from '../entities/AgentProfile';

export interface ProfileRepository {
  getProfile(): Promise<Result<AgentProfile>>;
  updateProfile(profile: Partial<AgentProfile>): Promise<Result<AgentProfile>>;
  updatePreferences(preferences: { pushNotifications: boolean; language: string }): Promise<Result<boolean>>;
  changePassword(currentPassword: string, newPassword: string): Promise<Result<boolean>>;
}
