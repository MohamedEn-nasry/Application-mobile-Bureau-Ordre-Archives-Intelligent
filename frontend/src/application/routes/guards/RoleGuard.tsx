import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../providers/AuthProvider';
import { UserRole } from '../../modules/auth/domain/entities/UserEntitie';

/**
 * RoleGuard component props
 */
export interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * RoleGuard component
 * Protects routes that require specific user roles
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles,
  redirectTo = 'Login' 
}) => {
  const { state } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!state.isLoading) {
      if (!state.isAuthenticated) {
        // User is not authenticated, redirect to login
        navigation.navigate(redirectTo as never);
      } else if (state.user && !allowedRoles.includes(state.user.user.role)) {
        // User doesn't have required role, redirect to appropriate dashboard
        const userRole = state.user.user.role;
        switch (userRole) {
          case UserRole.ADMIN:
            navigation.navigate('AdminStack' as never);
            break;
          case UserRole.AGENT:
            navigation.navigate('AgentStack' as never);
            break;
          case UserRole.LECTEUR:
            navigation.navigate('LecteurStack' as never);
            break;
          default:
            navigation.navigate(redirectTo as never);
        }
      }
    }
  }, [state.isLoading, state.isAuthenticated, state.user, allowedRoles, navigation, redirectTo]);

  // Show loading screen while checking authentication
  if (state.isLoading) {
    return <LoadingScreen />;
  }

  // Show children only if authenticated and has required role
  if (state.isAuthenticated && state.user && allowedRoles.includes(state.user.user.role)) {
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
