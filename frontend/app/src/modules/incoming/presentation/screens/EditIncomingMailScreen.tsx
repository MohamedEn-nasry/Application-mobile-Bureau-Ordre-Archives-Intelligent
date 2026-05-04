import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEditIncomingMailViewModel } from '../viewmodels/EditIncomingMailViewModel';

export const EditIncomingMailScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { mailId } = route.params;
  const {
    mail,
    formData,
    isLoading,
    isSaving,
    error,
    updateFormData,
    saveMail,
    resetForm
  } = useEditIncomingMailViewModel(mailId);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    const success = await saveMail();
    if (success) {
      Alert.alert(
        'Success',
        'Incoming mail updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  };

  const handleStatusPress = () => {
    const statusOptions = [
      { label: 'Pending', value: 'pending' },
      { label: 'In Progress', value: 'in_progress' },
      { label: 'Completed', value: 'completed' }
    ];

    Alert.alert(
      'Select Status',
      'Choose the current status',
      [
        ...statusOptions.map(option => ({
          text: option.label,
          onPress: () => updateFormData('status', option.value)
        })),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const getStatusLabel = (value: string) => {
    const option = statusOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' }
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading mail details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!mail) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Mail Not Found</Text>
          <Text style={styles.errorMessage}>The requested mail could not be found.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Incoming Mail</Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
          <Ionicons name="refresh" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reference (Read-only) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Reference</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>{mail.Reference}</Text>
          </View>
        </View>

        {/* Date Received (Read-only) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date Received</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>
              {mail.DateCourrier.toISOString().split('T')[0]}
            </Text>
          </View>
        </View>

        {/* Sender (Read-only) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Sender</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>{mail.Expediteur || 'Unknown Sender'}</Text>
          </View>
        </View>

        {/* Subject (Read-only) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Subject</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>{mail.Objet}</Text>
          </View>
        </View>

        {/* Description (Read-only) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <View style={[styles.readOnlyInput, styles.textArea]}>
            <Text style={styles.readOnlyText}>{mail.Description || 'No description provided'}</Text>
          </View>
        </View>

        {/* Status (Editable) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <TouchableOpacity style={styles.statusButton} onPress={handleStatusPress}>
            <Text style={styles.statusText}>{getStatusLabel(formData.status || mail.Statut)}</Text>
            <Ionicons name="chevron-down" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* OCR Status (Read-only) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>OCR Status</Text>
          <View style={styles.readOnlyInput}>
            <View style={styles.ocrStatusContainer}>
              <Ionicons 
                name={mail.TexteOcr ? 'checkmark-circle' : 'ellipse'} 
                size={16} 
                color={mail.TexteOcr ? '#10B981' : '#94A3B8'} 
              />
              <Text style={styles.ocrStatusText}>
                OCR {mail.TexteOcr ? 'Processed' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Category (Read-only) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>
              Category ID: {mail.CategorieId}
            </Text>
          </View>
        </View>

        {/* Assigned To (Read-only) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Assigned To</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>
              {mail.AssigneA ? `User ID: ${mail.AssigneA}` : 'Not assigned'}
            </Text>
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Update Incoming Mail</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  resetButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#64748B',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  statusText: {
    fontSize: 16,
    color: '#1E293B',
  },
  ocrStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ocrStatusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 24,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#EF4444',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
