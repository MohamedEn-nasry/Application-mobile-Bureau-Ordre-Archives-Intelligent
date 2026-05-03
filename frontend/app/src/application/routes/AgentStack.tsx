import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
<<<<<<< HEAD
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
=======
import { AgentDashboardScreen } from '../../modules/dashboard/presentation/screens/AgentDashboardScreen';

const Stack = createNativeStackNavigator();

export const AgentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AgentDashboard" 
        component={AgentDashboardScreen} 
        options={{ 
          title: 'Agent Dashboard',
          headerShown: false 
        }} 
      />
    </Stack.Navigator>
  );
};
>>>>>>> origin/develop
