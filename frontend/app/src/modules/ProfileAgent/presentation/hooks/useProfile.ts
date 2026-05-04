import { useState, useEffect, useCallback, useMemo } from 'react';
import { AgentProfile } from '../../domain/entities/AgentProfile';
import { GetProfileUseCase } from '../../domain/usecases/GetProfileUseCase';
import { UpdateProfileUseCase } from '../../domain/usecases/UpdateProfileUseCase';
import { UpdatePreferencesUseCase } from '../../domain/usecases/UpdatePreferencesUseCase';
import { ChangePasswordUseCase } from '../../domain/usecases/ChangePasswordUseCase';
import { ProfileRepositoryImpl } from '../../data/repositories/ProfileRepositoryImpl';

export const useProfile = () => {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize repository and use cases
  const useCases = useMemo(() => {
    const repository = new ProfileRepositoryImpl();
    return {
      getProfileUseCase: new GetProfileUseCase(repository),
      updateProfileUseCase: new UpdateProfileUseCase(repository),
      updatePreferencesUseCase: new UpdatePreferencesUseCase(repository),
      changePasswordUseCase: new ChangePasswordUseCase(repository),
    };
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await useCases.getProfileUseCase.execute();
      
      if (result.isSuccess()) {
        setProfile(result.value);
      } else {
        setError(result.error.message || 'Failed to load profile');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [useCases]);

  const updateProfile = async (updates: Partial<AgentProfile>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await useCases.updateProfileUseCase.execute(updates);
      
      if (result.isSuccess()) {
        setProfile(result.value);
        return true;
      } else {
        setError(result.error.message || 'Failed to update profile');
        return false;
      }
    } catch {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (preferences: { pushNotifications: boolean; language: string }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await useCases.updatePreferencesUseCase.execute(preferences);
      
      if (result.isSuccess()) {
        // Reload profile to get updated preferences
        await loadProfile();
        return true;
      } else {
        setError(result.error.message || 'Failed to update preferences');
        return false;
      }
    } catch {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await useCases.changePasswordUseCase.execute({ currentPassword, newPassword });
      
      if (result.isSuccess()) {
        return true;
      } else {
        setError(result.error.message || 'Failed to change password');
        return false;
      }
    } catch {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadProfile();
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    updatePreferences,
    changePassword,
    refresh,
  };
};
