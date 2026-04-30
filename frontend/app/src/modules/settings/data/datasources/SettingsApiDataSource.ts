import { apiClient } from '../../../../core/network/apiClient';
import { Settings, UpdateSettingsRequest } from '../../domain/entities/Settings';

export class SettingsApiDataSource {
  constructor(private client: typeof apiClient) {}

  async getSettings(): Promise<Settings> {
    return this.client.get('/settings');
  }

  async updateSettings(request: UpdateSettingsRequest): Promise<Settings> {
    return this.client.put('/settings', request);
  }

  async launchBackup(): Promise<void> {
    await this.client.post('/settings/backup');
  }
}
