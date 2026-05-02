import { useContext } from 'react';
import { AuthContext } from '../../../../application/providers/AuthProvider';

export const useAuthSession = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthSession must be used within an AuthProvider');
  }
  return context;
};
