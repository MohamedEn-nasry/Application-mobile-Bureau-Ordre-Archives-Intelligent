import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { AuthStack } from './AuthStack';
import { AdminStack } from './AdminStack';
import { AgentStack } from './AgentStack';
import { LecteurStack } from './LecteurStack';

/**
 * Root navigator component
 * Handles authentication state and navigation between auth and app stacks
 */
export const RootNavigator: React.FC = () => {
  const { state } = useAuth();

  // Show loading screen while checking authentication
  if (state.isLoading) {
    return <LoadingScreen />;
  }

  // Show auth stack if not authenticated
  if (!state.isAuthenticated) {
    return <AuthStack />;
  }

  // Show appropriate stack based on user role
  const userRole = state.user?.user.role;

  switch (userRole) {
    case 'Admin':
      return <AdminStack />;
    case 'Agent':
      return <AgentStack />;
    case 'Lecteur':
      return <LecteurStack />;
    default:
      // Fallback to auth stack if role is unknown
      return <AuthStack />;
  }
};

/**
 * Loading screen component
 */
const LoadingScreen: React.FC = () => {
  // In a real app, you would show a proper loading spinner
  return null;
};
