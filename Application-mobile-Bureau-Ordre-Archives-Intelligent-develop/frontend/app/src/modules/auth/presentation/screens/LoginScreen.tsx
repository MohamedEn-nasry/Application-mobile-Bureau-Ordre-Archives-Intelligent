import { View, StyleSheet } from "react-native";
import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

export const LoginScreen = () => {
  const { login, isLoading, error } = useLogin();

  const handleLogin = async (email: string, password?: string) => {
    await login(email, password);
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
  },
});
