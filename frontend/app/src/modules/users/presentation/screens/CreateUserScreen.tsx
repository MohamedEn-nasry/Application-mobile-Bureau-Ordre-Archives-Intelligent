import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { UserForm } from '../components/UserForm';
import { useCreateUser } from '../hooks/useCreateUser';
import { Role } from '../../../../shared/constants/roles';

// Real app would receive navigation props
export const CreateUserScreen = ({ navigation }: any) => {
  const { createUser, isLoading, error } = useCreateUser();

  const handleCreate = async (email: string, role: Role, password?: string) => {
    const user = await createUser(email, role, password);
    if (user) {
      // On success, go back to list
      navigation?.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <UserForm onSubmit={handleCreate} isLoading={isLoading} error={error} />
      <Button title="Cancel" onPress={() => navigation?.goBack()} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff'
  }
});
