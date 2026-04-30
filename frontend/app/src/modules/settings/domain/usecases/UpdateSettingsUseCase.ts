import { ISettingsRepository } from '../repositories/ISettingsRepository';
import { Settings, UpdateSettingsRequest } from '../entities/Settings';

export class UpdateSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(request: UpdateSettingsRequest): Promise<Settings> {
    return this.settingsRepository.updateSettings(request);
  }
}

export class LaunchBackupUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(): Promise<void> {
    return this.settingsRepository.launchBackup();
  }
}
