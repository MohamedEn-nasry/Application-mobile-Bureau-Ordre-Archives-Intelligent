import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { LoginForm, LoginFormProps } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';

/**
 * Login screen props
 */
export interface LoginScreenProps {
  loginUseCase: LoginUseCase;
  onLoginSuccess?: () => void;
}

/**
 * Login screen component
 * Dumb screen that uses the useLogin hook for state management
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({
  loginUseCase,
  onLoginSuccess,
}) => {
  const { state, login, clearError } = useLogin(loginUseCase);

  /**
   * Handle login submission
   */
  const handleLoginSubmit: LoginFormProps['onSubmit'] = async (params) => {
    const result = await login(params);
    
    if (result.isSuccess && result.value) {
      // Login successful
      clearError();
      onLoginSuccess?.();
    }
    // Error is handled by the hook
  };

  /**
   * Clear error on unmount
   */
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <LoginForm
        onSubmit={handleLoginSubmit}
        loginState={state}
        disabled={false}
      />
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
