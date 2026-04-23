import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

/**
 * Admin stack navigator
 * Handles admin-specific screens
 */
const Stack = createNativeStackNavigator();

export const AdminStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboard"
        component={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Admin Dashboard</Text>
          </View>
        )}
      />
    </Stack.Navigator>
  );
};
