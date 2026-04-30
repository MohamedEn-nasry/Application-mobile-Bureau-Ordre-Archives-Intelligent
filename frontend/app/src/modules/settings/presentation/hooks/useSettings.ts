import { useState, useEffect } from 'react';
import { GetSettingsUseCase } from '../../domain/usecases/GetSettingsUseCase';
import { SettingsRepositoryImpl } from '../../data/repositories/SettingsRepositoryImpl';
import { Settings } from '../../domain/entities/Settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSettingsUseCase = new GetSettingsUseCase(new SettingsRepositoryImpl());

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSettingsUseCase.execute();
      setSettings(data);
    } catch (err) {
      setError('Impossible de charger les paramètres');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  };
};
