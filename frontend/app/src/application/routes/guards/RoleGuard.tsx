import React, { ReactNode } from 'react';
import { useAuthSession } from '../../../modules/auth/presentation/hooks/useAuthSession';
import { Role } from '../../../shared/constants/roles';
import { View, Text } from 'react-native';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
}

/**
 * Higher Order Component to protect screens or components for specific roles.
 */
export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { session } = useAuthSession();

  if (!session || !allowedRoles.includes(session.role)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>
          Access Denied
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 10 }}>
          You do not have permission to view this content.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};
