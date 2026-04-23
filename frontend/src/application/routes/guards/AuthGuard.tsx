import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../providers/AuthProvider';

/**
 * AuthGuard component props
 */
export interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard component
 * Protects routes that require authentication
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = 'Login' 
}) => {
  const { state } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      // User is not authenticated, redirect to login
      navigation.navigate(redirectTo as never);
    }
  }, [state.isLoading, state.isAuthenticated, navigation, redirectTo]);

  // Show loading screen while checking authentication
  if (state.isLoading) {
    return <LoadingScreen />;
  }

  // Show children only if authenticated
  if (state.isAuthenticated) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
};

/**
 * Loading screen component
 */
const LoadingScreen: React.FC = () => {
  return (
    <div style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#fff'
    }}>
      <div>Loading...</div>
    </div>
  );
};
