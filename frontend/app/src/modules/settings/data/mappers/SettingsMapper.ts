import { Settings, OCRSettings, BackupSettings, SystemInfo } from '../../domain/entities/Settings';

export class SettingsMapper {
  static mapToDomain(data: any): Settings {
    return {
      ocr: {
        enabled: data.ocr?.enabled ?? false,
        language: data.ocr?.language ?? 'Arabe + Français',
        confidenceThreshold: data.ocr?.confidenceThreshold ?? 80,
        automaticClassification: data.ocr?.automaticClassification ?? false,
      },
      backup: {
        automaticBackup: data.backup?.automaticBackup ?? false,
        backupFrequency: data.backup?.backupFrequency ?? 'daily',
        automaticArchiving: data.backup?.automaticArchiving ?? false,
        lastBackup: data.backup?.lastBackup,
      },
      systemInfo: {
        server: data.systemInfo?.server ?? 'Ubuntu 22.04',
        database: data.systemInfo?.database ?? 'PostgreSQL 15',
        lastBackup: data.systemInfo?.lastBackup ?? 'Hier 02:00',
        updateStatus: data.systemInfo?.updateStatus ?? 'up-to-date',
      },
    };
  }

  static mapToApi(settings: Partial<Settings>): any {
    const result: any = {};
    
    if (settings.ocr) {
      result.ocr = settings.ocr;
    }
    
    if (settings.backup) {
      result.backup = settings.backup;
    }
    
    if (settings.systemInfo) {
      result.systemInfo = settings.systemInfo;
    }
    
    return result;
  }
}
