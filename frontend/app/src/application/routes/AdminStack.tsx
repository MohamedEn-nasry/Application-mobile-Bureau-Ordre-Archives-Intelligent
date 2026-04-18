import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UsersListScreen } from '../../modules/users/presentation/screens/UsersListScreen';
import { CreateUserScreen } from '../../modules/users/presentation/screens/CreateUserScreen';

const Stack = createNativeStackNavigator();

// Placeholder for Dashboard (we should implement a real one later)
const DashboardPlaceholder = () => null;

export const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UsersList" 
        component={UsersListScreen} 
        options={{ title: 'Manage Users' }} 
      />
      <Stack.Screen 
        name="CreateUser" 
        component={CreateUserScreen} 
        options={{ title: 'Create New User' }} 
      />
    </Stack.Navigator>
  );
};
