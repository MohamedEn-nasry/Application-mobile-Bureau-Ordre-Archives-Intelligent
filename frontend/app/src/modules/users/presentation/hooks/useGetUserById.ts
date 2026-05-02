import { useState, useEffect, useCallback } from 'react';
import { ManagedUser } from '../../domain/entities/ManagedUser';

export const useGetUserById = (userId: number) => {
  const [user, setUser] = useState<ManagedUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId || userId < 1) {
      setError('Invalid user ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Direct API call since we don't have a specific use case for getting user by ID
      const response = await fetch(`/api/Users/${userId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('User not found');
        } else if (response.status === 403) {
          setError('Access denied');
        } else {
          setError('Failed to fetch user details');
        }
        return;
      }

      const userData = await response.json();
      
      // Map API response to ManagedUser format
      const managedUser: ManagedUser = new ManagedUser(
        String(userData.Id),
        userData.Firstname,
        userData.Lastname,
        userData.Email,
        userData.RoleName,
        userData.IsActif,
        userData.CreatedAt ? new Date(userData.CreatedAt) : new Date(),
        userData.UpdatedAt ? new Date(userData.UpdatedAt) : new Date(),
        userData.ImagePath || ''
      );

      setUser(managedUser);
    } catch {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isLoading, error, refetch: fetchUser };
};
