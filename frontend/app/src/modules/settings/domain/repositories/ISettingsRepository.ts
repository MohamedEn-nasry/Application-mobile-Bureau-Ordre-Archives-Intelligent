import { Settings, UpdateSettingsRequest } from '../entities/Settings';

export interface ISettingsRepository {
  getSettings(): Promise<Settings>;
  updateSettings(request: UpdateSettingsRequest): Promise<Settings>;
  launchBackup(): Promise<void>;
}
