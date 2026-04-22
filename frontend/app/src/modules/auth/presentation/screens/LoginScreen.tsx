import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";
import { useAuthSession } from "../hooks/useAuthSession";
import { Roles } from "../../../../shared/constants/roles";

export const LoginScreen = () => {
  const { login, isLoading, error } = useLogin();
  const { session } = useAuthSession();

  const handleLogin = async (email: string, password?: string) => {
    await login(email, password);
  };

  useEffect(() => {
    if (!session?.role) return;

    console.log(`Login success - User role: ${session.role}`);

    if (session.role === Roles.ADMIN) {
      console.log("Navigate to admin dashboard");
    } else if (session.role === Roles.AGENT) {
      console.log("Navigate to agent dashboard");
    } else if (session.role === Roles.LECTEUR) {
      console.log("Navigate to lecteur dashboard");
    }
  }, [session]);

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
