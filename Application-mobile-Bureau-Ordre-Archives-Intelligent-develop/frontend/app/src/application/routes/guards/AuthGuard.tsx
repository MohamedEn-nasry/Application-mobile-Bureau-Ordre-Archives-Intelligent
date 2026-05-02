import React, { ReactNode } from 'react';
import { useAuthSession } from '../../../modules/auth/presentation/hooks/useAuthSession';
import { View, ActivityIndicator } from 'react-native';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Higher Order Component to protect screens that require authentication.
 */
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { session, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If no session, the RootNavigator should have already switched to AuthStack,
  // but this is a secondary safety layer for specific components.
  if (!session) {
    return null; 
  }

  return <>{children}</>;
};
