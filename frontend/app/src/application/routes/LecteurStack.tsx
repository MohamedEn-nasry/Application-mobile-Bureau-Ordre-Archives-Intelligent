import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Roles } from '../../shared/constants/roles';
import { Routes } from '../../shared/constants/routes';
import { LecteurCourriersScreen } from '../../modules/courrier/presentation/screens/LecteurCourriersScreen';
import { CourrierDetailScreen } from '../../modules/courrier/presentation/screens/CourrierDetailScreen';
import { useCourrierInitialParams } from './useCourrierInitialParams';
import { LecteurDashboardScreen } from '../../modules/dashboard/presentation/screens/LecteurDashboardScreen';
import { ProfileScreen } from '../../modules/profile/presentation/screens/ProfileScreen';
import { LecteurNotificationsScreen } from '../../modules/notifications/presentation/screens/LecteurNotificationsScreen';

const Stack = createNativeStackNavigator();



export const LecteurStack = () => {
  const courrierParams = useCourrierInitialParams(Roles.LECTEUR);

  return (
    <Stack.Navigator id="LecteurStack"
      initialRouteName={Routes.Lecteur.Dashboard}
      screenOptions={{ headerShown: false }}
    >


      <Stack.Screen
        name={Routes.Lecteur.Dashboard}
        component={LecteurDashboardScreen}
        options={{ headerShown: false }}
      />



      <Stack.Screen
        name={Routes.Lecteur.CourrierOverview}
        component={LecteurCourriersScreen}
        initialParams={courrierParams}
      />


      <Stack.Screen
        name={Routes.Lecteur.Notifications}
        component={LecteurNotificationsScreen}
        options={{ headerShown: false }}
      />
      

      <Stack.Screen
        name={Routes.Lecteur.CourrierDetail}
        component={CourrierDetailScreen}
        initialParams={courrierParams}
      />


      <Stack.Screen
        name={Routes.Lecteur.Profile}
        component={ProfileScreen}
        options={{ headerShown: false }}
      />

      
    </Stack.Navigator>


  );
};
