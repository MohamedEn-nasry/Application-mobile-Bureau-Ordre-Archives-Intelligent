import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';
import { AuthContext } from '../../../../application/providers/AuthProvider';

export const LoginScreen = () => {
  const { login, isLoading, error } = useLogin();
  // We use this to force the app to re-evaluate the navigation tree after login
  const { setSession } = useContext(AuthContext) as any;

  const handleLogin = async (email: string, password?: string) => {
    const success = await login(email, password);
    if (success) {
      // Logic handled via App layout reading session
      console.log('Login success');
    }
  };

  return (
    <View style={styles.container}>
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  }
});
