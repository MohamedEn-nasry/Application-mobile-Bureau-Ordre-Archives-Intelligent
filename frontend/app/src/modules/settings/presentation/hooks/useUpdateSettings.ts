import { useState } from 'react';
import { UpdateSettingsUseCase, LaunchBackupUseCase } from '../../domain/usecases/UpdateSettingsUseCase';
import { SettingsRepositoryImpl } from '../../data/repositories/SettingsRepositoryImpl';
import { UpdateSettingsRequest, Settings } from '../../domain/entities/Settings';

export const useUpdateSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettingsUseCase = new UpdateSettingsUseCase(new SettingsRepositoryImpl());
  const launchBackupUseCase = new LaunchBackupUseCase(new SettingsRepositoryImpl());

  const updateSettings = async (request: UpdateSettingsRequest): Promise<Settings | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateSettingsUseCase.execute(request);
      return result;
    } catch (err) {
      setError('Impossible de mettre à jour les paramètres');
      console.error('Error updating settings:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const launchBackup = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await launchBackupUseCase.execute();
      return true;
    } catch (err) {
      setError('Impossible de lancer la sauvegarde');
      console.error('Error launching backup:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateSettings,
    launchBackup,
    loading,
    error,
  };
};
