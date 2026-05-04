import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgentDashboardScreen } from '../../modules/dashboard/presentation/screens/AgentDashboardScreen';
import { AgentProfileScreen } from '../../modules/ProfileAgent/presentation/screens/AgentProfileScreen';
import { EditProfileScreen } from '../../modules/ProfileAgent/presentation/screens/EditProfileScreen';
import { ChangePasswordScreen } from '../../modules/ProfileAgent/presentation/screens/ChangePasswordScreen';
import { LanguageSettingsScreen } from '../../modules/ProfileAgent/presentation/screens/LanguageSettingsScreen';
import { HelpDocumentationScreen } from '../../modules/ProfileAgent/presentation/screens/HelpDocumentationScreen';
import { SecurityPrivacyScreen } from '../../modules/ProfileAgent/presentation/screens/SecurityPrivacyScreen';

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
        name="AgentProfile" 
        component={AgentProfileScreen} 
        options={{ 
          title: 'Profile',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ 
          title: 'Edit Profile',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen} 
        options={{ 
          title: 'Change Password',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="LanguageSettings" 
        component={LanguageSettingsScreen} 
        options={{ 
          title: 'Language Settings',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="HelpDocumentation" 
        component={HelpDocumentationScreen} 
        options={{ 
          title: 'Help & Documentation',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="SecurityPrivacy" 
        component={SecurityPrivacyScreen} 
        options={{ 
          title: 'Security & Privacy',
          headerShown: false 
        }} 
      />
    </Stack.Navigator>
  );
};
