import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { UserForm } from '../components/UserForm';
import { useCreateUser } from '../hooks/useCreateUser';

export const CreateUserScreen = ({ navigation }: any) => {
  const { createUser, isLoading, error } = useCreateUser();

  const handleCreate = async (user: any) => {
    const createdUser = await createUser(user);

    if (createdUser) {
      navigation?.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <UserForm onSubmit={handleCreate} isLoading={isLoading} error={error} />

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation?.goBack()}>
        <Text style={styles.cancelText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  cancelButton: {
    marginHorizontal: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  cancelText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '600'
  }
});