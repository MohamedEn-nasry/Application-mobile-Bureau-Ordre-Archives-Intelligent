import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgentDashboardScreen } from '../../modules/dashboard/presentation/screens/AgentDashboardScreen';
import { SuperAgentDashboardScreen } from '../../modules/dashboard/presentation/screens/SuperAgentDashboardScreen';

import { Routes } from '../../shared/constants/routes';

import { CreateUpdateCourrierScreen } from '../../modules/courrier/presentation/screens/CreateUpdateCourrierScreen';
import { Roles } from '../../shared/constants/roles';
import { CourrierOverviewScreen } from '../../modules/courrier/presentation/screens/CourrierOverviewScreen';
import { CourrierDetailScreen } from '../../modules/courrier/presentation/screens/CourrierDetailScreen';
import { useCourrierInitialParams } from './useCourrierInitialParams';
import { AgentIncomingMailScreen } from '../../modules/courrier/presentation/screens/AgentIncomingMailScreen';
import { AgentOutgoingMailScreen } from '../../modules/courrier/presentation/screens/AgentOutgoingMailScreen';
import { ProfileScreen } from '../../modules/profile/presentation/screens/ProfileScreen';
import { NotificationsScreen } from '../../modules/notifications/presentation/screens/NotificationsScreen';
import { AgentOcrResultsScreen } from '../../modules/dashboard/presentation/screens/AgentOcrResultsScreen';
import { useAuthSession } from '../../modules/auth/presentation/hooks/useAuthSession';
import { Role } from '../../shared/constants/roles';

const Stack = createNativeStackNavigator();

export const AgentStack = () => {
  const { session } = useAuthSession();
  const currentRole = (session?.role ?? Roles.AGENT) as Role;
  const courrierParams = useCourrierInitialParams(currentRole);

  return (
    <Stack.Navigator id="AgentStack"
      initialRouteName={Routes.Agent.Dashboard}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={Routes.Agent.Dashboard}
        component={currentRole === Roles.SUPER_AGENT ? SuperAgentDashboardScreen : AgentDashboardScreen}
        initialParams={{
          roleName: currentRole,
          userId: Number(session?.userId ?? 0),
        }}
        options={{

          headerShown: false
        }}
      />
      <Stack.Screen
        name={Routes.Agent.CourrierOverview}
        component={CourrierOverviewScreen}
        initialParams={courrierParams}
      />

      <Stack.Screen
        name={Routes.Agent.CourrierDetail}
        component={CourrierDetailScreen}
        initialParams={courrierParams}
      />

      <Stack.Screen
        name={Routes.Agent.CreateUpdateCourrier}
        component={CreateUpdateCourrierScreen}
        initialParams={courrierParams}
      />
      <Stack.Screen
        name={Routes.Agent.IncomingMail}
        component={AgentIncomingMailScreen}
        initialParams={{
          roleName: currentRole,
          userId: Number(session?.userId ?? 0),
        }}
      />
      <Stack.Screen
        name={Routes.Agent.OutgoingMail}
        component={AgentOutgoingMailScreen}
        initialParams={{
          roleName: currentRole,
          userId: Number(session?.userId ?? 0),
        }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.Agent.Profile}
        component={ProfileScreen}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={Routes.Agent.Notifications}
        component={NotificationsScreen}
        initialParams={{
          roleName: currentRole,
          userId: Number(session?.userId ?? 0),
        }}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={Routes.Agent.OcrResults}
        component={AgentOcrResultsScreen}
        options={{ headerShown: false }}
      />


    </Stack.Navigator>
  );
};
