// src/navigation/RootNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../modules/auth/presentation/screens/LoginScreen.js';
import AdminNavigator from './AdminNavigator';
import AgentNavigator from './AgentNavigator';
import LecteurNavigator from './LecteurNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {currentUser.role === 'Admin' && (
        <Stack.Screen name="AdminRoot" component={AdminNavigator} />
      )}
      {currentUser.role === 'Agent' && (
        <Stack.Screen name="AgentRoot" component={AgentNavigator} />
      )}
      {currentUser.role === 'Lecteur' && (
        <Stack.Screen name="LecteurRoot" component={LecteurNavigator} />
      )}
    </Stack.Navigator>
  );
}
