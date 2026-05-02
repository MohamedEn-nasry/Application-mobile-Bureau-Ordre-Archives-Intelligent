import { apiClient } from '../../../../core/network/apiClient';
import { Settings, UpdateSettingsRequest } from '../../domain/entities/Settings';
import { SettingsMapper } from '../mappers/SettingsMapper';

export class SettingsApiDataSource {
  constructor(private client: typeof apiClient) {}

  async getSettings(): Promise<Settings> {
    const data = await this.client.get('/settings');
    return SettingsMapper.mapToDomain(data);
  }

  async updateSettings(request: UpdateSettingsRequest): Promise<Settings> {
    const apiRequest = SettingsMapper.mapUpdateRequestToApi(request);
    const data = await this.client.put('/settings', apiRequest);
    return SettingsMapper.mapToDomain(data);
  }

  async launchBackup(): Promise<void> {
    await this.client.post('/settings/backup');
  }
}
