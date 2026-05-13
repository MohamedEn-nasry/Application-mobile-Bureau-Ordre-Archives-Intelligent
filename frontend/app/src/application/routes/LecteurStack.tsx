import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { Roles } from '../../shared/constants/roles';
import { Routes } from '../../shared/constants/routes';
import { CourrierOverviewScreen } from '../../modules/courrier/presentation/screens/CourrierOverviewScreen';
import { CourrierDetailScreen } from '../../modules/courrier/presentation/screens/CourrierDetailScreen';
import { useCourrierInitialParams } from './useCourrierInitialParams';
import { LecteurDashboardScreen } from '../../modules/dashboard/presentation/screens/LecteurDashboardScreen';

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
        component={CourrierOverviewScreen}
        initialParams={courrierParams}
      />

      <Stack.Screen
        name={Routes.Lecteur.CourrierDetail}
        component={CourrierDetailScreen}
        initialParams={courrierParams}
      />
    </Stack.Navigator>


  );
};
