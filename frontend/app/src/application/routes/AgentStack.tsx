import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgentDashboardScreen } from '../../modules/dashboard/presentation/screens/AgentDashboardScreen';
import { IncomingMailScreen } from '../../modules/incoming/presentation/screens/IncomingMailScreen';
import { AddIncomingMailScreen } from '../../modules/incoming/presentation/screens/AddIncomingMailScreen';
import { MailDetailScreen } from '../../modules/incoming/presentation/screens/MailDetailScreen';
import { EditIncomingMailScreen } from '../../modules/incoming/presentation/screens/EditIncomingMailScreen';
import { RunOCRScreen } from '../../modules/incoming/presentation/screens/RunOCRScreen';
import { ClassifyScreen } from '../../modules/incoming/presentation/screens/ClassifyScreen';
import { ScanDocumentScreen } from '../../modules/incoming/presentation/screens/ScanDocumentScreen';

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
        name="IncomingMail" 
        component={IncomingMailScreen} 
        options={{ 
          title: 'Incoming Mail',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="AddIncomingMail" 
        component={AddIncomingMailScreen} 
        options={{ 
          title: 'Add Incoming Mail',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="IncomingMailDetail" 
        component={MailDetailScreen} 
        options={{ 
          title: 'Mail Detail',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="EditIncomingMail" 
        component={EditIncomingMailScreen} 
        options={{ 
          title: 'Edit Incoming Mail',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="RunOCR" 
        component={RunOCRScreen} 
        options={{ 
          title: 'Run OCR',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="Classify" 
        component={ClassifyScreen} 
        options={{ 
          title: 'Classify Document',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="ScanDocument" 
        component={ScanDocumentScreen} 
        options={{ 
          title: 'Scan Document',
          headerShown: false 
        }} 
      />
    </Stack.Navigator>
  );
};
