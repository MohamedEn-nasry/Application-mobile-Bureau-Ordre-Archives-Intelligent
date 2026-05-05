import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CourrierForm } from '../components/CourrierForm';
import { useCreateCourrier } from '../hooks/useCreateCourrier';
import { useUpdateCourrier } from '../hooks/useUpdateCourrier';

export const CreateUpdateCourrierScreen = ({ navigation, route }: any) => {
  const { courrier: initialCourrier } = route.params || {};
  const isEditMode = !!initialCourrier;

  const {
    createCourrier,
    isLoading: isCreating,
    error: createError,
  } = useCreateCourrier();

  const {
    updateCourrier,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateCourrier();

  const handleSave = async (courrierData: any) => {
    let success;

    if (isEditMode) {
      success = await updateCourrier({
        id: Number(initialCourrier.Id),
        ...courrierData,
        statut: courrierData.statut || initialCourrier.Statut,
      });
    } else {
      success = await createCourrier(courrierData);
    }

    if (success) {
      navigation?.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <CourrierForm
        onSubmit={handleSave}
        isLoading={isEditMode ? isUpdating : isCreating}
        error={isEditMode ? updateError : createError}
        initialData={initialCourrier}
      />

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation?.goBack()}
      >
        <Text style={styles.cancelText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  cancelButton: {
    marginHorizontal: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  cancelText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '600',
  },
});