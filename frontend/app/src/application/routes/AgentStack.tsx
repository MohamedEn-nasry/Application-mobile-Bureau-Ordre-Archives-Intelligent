import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgentDashboardScreen } from '../../modules/dashboard/presentation/screens/AgentDashboardScreen';

import { Routes } from '../../shared/constants/routes';

import { CreateUpdateCourrierScreen } from '../../modules/courrier/presentation/screens/CreateUpdateCourrierScreen';
import { Roles } from '../../shared/constants/roles';
import { CourrierOverviewScreen } from '../../modules/courrier/presentation/screens/CourrierOverviewScreen';
import { CourrierDetailScreen } from '../../modules/courrier/presentation/screens/CourrierDetailScreen';
import { useCourrierInitialParams } from './useCourrierInitialParams';
import { AgentIncomingMailScreen } from '../../modules/courrier/presentation/screens/AgentIncomingMailScreen';
import { AgentOutgoingMailScreen } from '../../modules/courrier/presentation/screens/AgentOutgoingMailScreen';
import { AgentProfileScreen } from '../../modules/profile/presentation/screens/AgentProfileScreen';
import { NotificationsScreen } from '../../modules/notifications/presentation/screens/NotificationsScreen';
import { AgentOcrResultsScreen } from '../../modules/dashboard/presentation/screens/AgentOcrResultsScreen';

const Stack = createNativeStackNavigator();

export const AgentStack = () => {
  const courrierParams = useCourrierInitialParams(Roles.AGENT);

  return (
    <Stack.Navigator id="AgentStack"
      initialRouteName={Routes.Agent.Dashboard}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={Routes.Agent.Dashboard}
        component={AgentDashboardScreen}
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
      />
      <Stack.Screen
        name={Routes.Agent.OutgoingMail}
        component={AgentOutgoingMailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.Agent.Profile}
        component={AgentProfileScreen}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={Routes.Agent.Notifications}
        component={NotificationsScreen}
        initialParams={{
          roleName: Roles.AGENT,
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
