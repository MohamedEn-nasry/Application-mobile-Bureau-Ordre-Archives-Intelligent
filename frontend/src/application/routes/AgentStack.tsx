import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

/**
 * Agent stack navigator
 * Handles agent-specific screens
 */
const Stack = createNativeStackNavigator();

export const AgentStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AgentDashboard"
        component={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Agent Dashboard</Text>
          </View>
        )}
      />
    </Stack.Navigator>
  );
};
