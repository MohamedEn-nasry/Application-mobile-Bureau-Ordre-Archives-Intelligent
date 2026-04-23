import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../../modules/auth/presentation/screens/LoginScreen';
import { container, SERVICE_TOKENS } from '../../core/di/container';
import { LoginUseCase } from '../../modules/auth/domain/usecases/LoginUseCase';

/**
 * Auth stack navigator
 * Handles authentication-related screens
 */
const Stack = createNativeStackNavigator();

export const AuthStack: React.FC = () => {
  // Get login use case from DI container
  const loginUseCase = container.resolve<LoginUseCase>(SERVICE_TOKENS.LOGIN_USE_CASE);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={(props: any) => (
          <LoginScreen
            {...props}
            loginUseCase={loginUseCase}
            onLoginSuccess={() => {
              // Navigation will be handled by the AuthGuard
              console.log('Login successful');
            }}
          />
        )}
      />
    </Stack.Navigator>
  );
};
