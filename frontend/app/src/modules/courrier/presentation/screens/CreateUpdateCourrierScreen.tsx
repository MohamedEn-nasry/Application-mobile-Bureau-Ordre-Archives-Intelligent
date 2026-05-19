import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useThemeStyles } from '../../../../application/providers/ThemeProvider';

import { CourrierForm } from '../components/CourrierForm';
import { useCreateCourrier } from '../hooks/useCreateCourrier';
import { useUpdateCourrier } from '../hooks/useUpdateCourrier';
import { useCourrierOcrAttachment } from '../hooks/useCourrierOcrAttachment';

type CourrierType = 'Entrant' | 'Sortant';

export const CreateUpdateCourrierScreen = ({ navigation, route }: any) => {
  const styles = useThemeStyles(localStyles);
  const {
    courrier: initialCourrier,
    initialType,
  } = route.params || {};

  const isEditMode = !!initialCourrier;
  const forcedType: CourrierType | undefined = initialType;

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

  const {
    pendingAttachment,
    previewOcr,
    setConfirmedOcr,
    uploadAndConfirmAfterCourrierCreated,
    isLoading: isOcrLoading,
    error: ocrError,
  } = useCourrierOcrAttachment();

  const getCreatedCourrierId = (created: any) => {
    return Number(
      created?.Id ??
      created?.id ??
      created?.CourrierId ??
      created?.courrierId ??
      0
    );
  };

  const handleSave = async (courrierData: any) => {
    let success: any;

    const finalCourrierData = {
      ...courrierData,
      type: forcedType ?? courrierData.type,
      Type: forcedType ?? courrierData.Type,
    };

    if (isEditMode) {
      success = await updateCourrier({
        id: Number(initialCourrier.Id ?? initialCourrier.id),
        ...finalCourrierData,
        statut: finalCourrierData.statut || initialCourrier.Statut,
      });

      if (success && pendingAttachment) {
        const courrierId = Number(initialCourrier.Id ?? initialCourrier.id);

        const uploaded = await uploadAndConfirmAfterCourrierCreated(courrierId);

        if (!uploaded) {
          Alert.alert(
            'Pièce jointe',
            'Le courrier est modifié, mais la pièce jointe/OCR n’a pas été enregistré.'
          );
          return;
        }
      }
    } else {
      success = await createCourrier(finalCourrierData);

      if (success) {
        const courrierId = getCreatedCourrierId(success);

        if (!courrierId) {
          Alert.alert(
            'Erreur',
            'Courrier créé, mais impossible de récupérer son ID pour enregistrer la pièce jointe.'
          );
          return;
        }

        if (pendingAttachment) {
          const uploaded = await uploadAndConfirmAfterCourrierCreated(courrierId);

          if (!uploaded) {
            Alert.alert(
              'Pièce jointe',
              'Le courrier est créé, mais la pièce jointe/OCR n’a pas été enregistré.'
            );
            return;
          }
        }
      }
    }

    if (success) {
      navigation?.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <CourrierForm
        onSubmit={handleSave}
        isLoading={isEditMode ? isUpdating : isCreating || isOcrLoading}
        error={isEditMode ? updateError || ocrError : createError || ocrError}
        initialData={initialCourrier}
        forcedType={forcedType}
        hideType={!!forcedType}
        pendingAttachment={pendingAttachment}
        onPreviewOcr={previewOcr}
        onConfirmOcr={setConfirmedOcr}
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

const localStyles = StyleSheet.create({
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