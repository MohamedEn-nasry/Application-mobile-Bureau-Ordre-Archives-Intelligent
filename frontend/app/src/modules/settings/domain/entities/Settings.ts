export interface OCRSettings {
  enabled: boolean;
  language: string;
  confidenceThreshold: number;
  automaticClassification: boolean;
}

export interface BackupSettings {
  automaticBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  automaticArchiving: boolean;
  lastBackup?: string;
}

export interface SystemInfo {
  server: string;
  database: string;
  lastBackup: string;
  updateStatus: 'up-to-date' | 'available' | 'error';
}

export interface Settings {
  ocr: OCRSettings;
  backup: BackupSettings;
  systemInfo: SystemInfo;
}

export interface UpdateSettingsRequest {
  ocr?: Partial<OCRSettings>;
  backup?: Partial<BackupSettings>;
}
