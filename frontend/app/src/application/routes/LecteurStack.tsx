import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

const Placeholder = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Lecteur Dashboard Placeholder</Text>
  </View>
);

export const LecteurStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LecteurDashboard" component={Placeholder} options={{ title: 'Lecteur' }} />
    </Stack.Navigator>
  );
};
