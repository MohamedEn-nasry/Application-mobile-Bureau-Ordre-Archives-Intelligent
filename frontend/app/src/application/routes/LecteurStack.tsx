import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { Roles } from '../../shared/constants/roles';
import { Routes } from '../../shared/constants/routes';
import { CourrierOverviewScreen } from '../../modules/courrier/presentation/screens/CourrierOverviewScreen';
import { CourrierDetailScreen } from '../../modules/courrier/presentation/screens/CourrierDetailScreen';
import { useCourrierInitialParams } from './useCourrierInitialParams';

const Stack = createNativeStackNavigator();

const Placeholder = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Lecteur Dashboard Placeholder</Text>
  </View>
);

export const LecteurStack = () => {
  const courrierParams = useCourrierInitialParams(Roles.LECTEUR);

  return (
    <Stack.Navigator id="LecteurStack">
      <Stack.Screen name="LecteurDashboard" component={Placeholder} options={{ title: 'Lecteur' }} />
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
