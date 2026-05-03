import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

const Placeholder = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Agent Dashboard Placeholder</Text>
  </View>
);

export const AgentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AgentDashboard" component={Placeholder} options={{ title: 'Agent' }} />
    </Stack.Navigator>
  );
};