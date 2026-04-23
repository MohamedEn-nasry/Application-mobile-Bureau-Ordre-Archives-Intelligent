import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

/**
 * Lecteur stack navigator
 * Handles reader-specific screens
 */
const Stack = createNativeStackNavigator();

export const LecteurStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LecteurDashboard"
        component={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Lecteur Dashboard</Text>
          </View>
        )}
      />
    </Stack.Navigator>
  );
};
