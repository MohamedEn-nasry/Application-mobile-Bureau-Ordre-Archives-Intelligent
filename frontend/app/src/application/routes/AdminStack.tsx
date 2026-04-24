import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminDashboardScreen } from '../../modules/dashboard/presentation/screens/DashboardScreen';
import { UsersListScreen } from '../../modules/users/presentation/screens/UsersListScreen';
import { CreateUserScreen } from '../../modules/users/presentation/screens/CreateUserScreen';
import { Routes } from '../../shared/constants/routes';

const Stack = createNativeStackNavigator();

export const AdminStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Admin.Dashboard}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={Routes.Admin.Dashboard}
        component={AdminDashboardScreen}
      />
      <Stack.Screen
        name={Routes.Admin.UsersList}
        component={UsersListScreen}
        options={{ headerShown: true, title: 'Gestion Utilisateurs' }}
      />
      <Stack.Screen
        name={Routes.Admin.CreateUser}
        component={CreateUserScreen}
        options={{ headerShown: true, title: 'Créer un utilisateur' }}
      />
    </Stack.Navigator>
  );
};
