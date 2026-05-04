import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgentDashboardScreen } from '../../modules/dashboard/presentation/screens/AgentDashboardScreen';
import { OutgoingMailScreen } from '../../modules/outgoing/presentation/screens/OutgoingMailScreen';
import { OutgoingMailDetailScreen } from '../../modules/outgoing/presentation/screens/OutgoingMailDetailScreen';
import { AddOutgoingMailScreen } from '../../modules/outgoing/presentation/screens/AddOutgoingMailScreen';

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
      <Stack.Screen 
        name="OutgoingMail" 
        component={OutgoingMailScreen} 
        options={{ 
          title: 'Outgoing Mail',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="OutgoingMailDetail" 
        component={OutgoingMailDetailScreen} 
        options={{ 
          title: 'Mail Detail',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="AddOutgoingMail" 
        component={AddOutgoingMailScreen} 
        options={{ 
          title: 'Add Outgoing Mail',
          headerShown: false 
        }} 
      />
    </Stack.Navigator>
  );
};
