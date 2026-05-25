import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { UserForm } from '../components/UserForm';
import { useCreateUser } from '../hooks/useCreateUser';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useThemeStyles } from '../../../../application/providers/ThemeProvider';

export const CreateUpdateUserScreen = ({ navigation, route }: any) => {
  const styles = useThemeStyles(localStyles);
  const { user: initialUser } = route.params || {};
  const isEditMode = !!initialUser;

  const { createUser, isLoading: isCreating, error: createError } = useCreateUser();
  const { updateUser, isLoading: isUpdating, error: updateError } = useUpdateUser();

  const handleSave = async (userData: any) => {
    let success;
    if (isEditMode) {
      success = await updateUser({ id: Number(initialUser.id), ...userData });
    } else {
      success = await createUser(userData);
    }

    if (success) {
      navigation?.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <UserForm 
        onSubmit={handleSave} 
        isLoading={isEditMode ? isUpdating : isCreating} 
        error={isEditMode ? updateError : createError}
        initialData={initialUser}
      />

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation?.goBack()}>
        <Text style={styles.cancelText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
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