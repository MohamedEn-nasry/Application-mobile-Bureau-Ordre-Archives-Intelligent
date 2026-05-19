import React from 'react';
import { useAuthSession } from '../../modules/auth/presentation/hooks/useAuthSession';
import { Roles } from '../../shared/constants/roles';
import { AuthStack } from './AuthStack';
import { AdminStack } from './AdminStack';
import { AgentStack } from './AgentStack';
import { LecteurStack } from './LecteurStack';
import { ActivityIndicator, View } from 'react-native';

export const RootNavigator = () => {
  const { session, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <AuthStack />;
  }

  switch (session.role) {
    case Roles.ADMIN:
      return <AdminStack />;

    case Roles.AGENT:
      return <AgentStack />;

    case Roles.LECTEUR:
      return <LecteurStack />;
      
    default:
      return <AuthStack />;
  }
};
