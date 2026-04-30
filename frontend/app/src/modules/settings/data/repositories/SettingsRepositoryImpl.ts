import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';
import { SettingsApiDataSource } from '../datasources/SettingsApiDataSource';
import { Settings, UpdateSettingsRequest } from '../../domain/entities/Settings';
import { apiClient } from '../../../../core/network/apiClient';

export class SettingsRepositoryImpl implements ISettingsRepository {
  private dataSource: SettingsApiDataSource;

  constructor() {
    this.dataSource = new SettingsApiDataSource(apiClient);
  }

  async getSettings(): Promise<Settings> {
    return this.dataSource.getSettings();
  }

  async updateSettings(request: UpdateSettingsRequest): Promise<Settings> {
    return this.dataSource.updateSettings(request);
  }

  async launchBackup(): Promise<void> {
    return this.dataSource.launchBackup();
  }
}
