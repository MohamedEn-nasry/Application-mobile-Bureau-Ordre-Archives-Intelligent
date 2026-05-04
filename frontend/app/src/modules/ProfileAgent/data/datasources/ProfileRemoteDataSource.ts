import { AgentProfile } from '../../domain/entities/AgentProfile';

export interface ProfileRemoteDataSource {
  getProfile(): Promise<AgentProfile>;
  updateProfile(profile: Partial<AgentProfile>): Promise<AgentProfile>;
  updatePreferences(preferences: { pushNotifications: boolean; language: string }): Promise<boolean>;
  changePassword(currentPassword: string, newPassword: string): Promise<boolean>;
}

export class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
  async getProfile(): Promise<AgentProfile> {
    // TODO: Implement actual API call
    // Mock data for now
    return new AgentProfile(
      '1',
      'Ahmed Benali',
      'ahmed.benali@gov.ma',
      'AGENT',
      'AG-2024-017',
      'Administrative Services',
      'Agent Bureau d\'Ordre',
      'January 2024',
      {
        Processed: 142,
        ThisMonth: 23,
        Scans: 38,
      },
      {
        PushNotifications: true,
        Language: 'Français',
      },
      {
        Version: 'Intelligent Bureau d\'Ordre v2.1.0',
        Build: 'Agent Portal - Build 2026.03',
      }
    );
  }

  async updateProfile(profile: Partial<AgentProfile>): Promise<AgentProfile> {
    // TODO: Implement actual API call
    const currentProfile = await this.getProfile();
    // Merge updates with current profile
    const updatedProfile = { ...currentProfile, ...profile };
    return updatedProfile;
  }

  async updatePreferences(preferences: { pushNotifications: boolean; language: string }): Promise<boolean> {
    // TODO: Implement actual API call
    console.log('Updating preferences:', preferences);
    return true;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    // TODO: Implement actual API call
    console.log('Changing password');
    return true;
  }
}
