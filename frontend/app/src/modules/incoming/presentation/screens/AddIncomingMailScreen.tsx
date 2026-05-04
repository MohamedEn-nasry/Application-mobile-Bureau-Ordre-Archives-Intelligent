import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddIncomingMailViewModel } from '../viewmodels/AddIncomingMailViewModel';
import { FileUploadComponent } from '../components/FileUploadComponent';

// IPA: /æd In.kʌm.Iŋ meI.l skri:n/ - Add Incoming Mail Screen (pronounced "ad in-kuh-ming mail screen")
// IPA: /fɔ:rm/ - Form (pronounced "form")
// IPA: /ætætʃ.mənt/ - Attachment (pronounced "at-atch-ment")

export const AddIncomingMailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    formData,
    isLoading,
    error,
    attachments,
    updateFormData,
    addAttachment,
    removeAttachment,
    generateReference,
    saveMail,
    resetForm
  } = useAddIncomingMailViewModel();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    const success = await saveMail();
    if (success) {
      Alert.alert(
        'Success',
        'Incoming mail saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              navigation.goBack();
            }
          }
        ]
      );
    }
  };

  
  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' }
  ];

  const handleStatusPress = () => {
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Incoming Mail</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Form */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reference */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Reference *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. INC-2026-006"
              value={formData.reference}
              onChangeText={(text) => updateFormData('reference', text)}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={generateReference}
            >
              <Ionicons name="refresh" size={20} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Received */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date Received *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="jj/mm/aaaa"
              value={formData.dateReceived instanceof Date ? formData.dateReceived.toISOString().split('T')[0] : formData.dateReceived}
              onChangeText={(text) => updateFormData('dateReceived', text)}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity style={styles.calendarButton}>
              <Ionicons name="calendar" size={20} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sender */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Sender *</Text>
          <TextInput
            style={styles.input}
            placeholder="Organization or person name"
            value={formData.sender}
            onChangeText={(text) => updateFormData('sender', text)}
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Subject */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Subject *</Text>
          <TextInput
            style={styles.input}
            placeholder="Brief description of the mail"
            value={formData.subject}
            onChangeText={(text) => updateFormData('subject', text)}
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional details about this mail..."
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Attachments */}
        <View style={styles.formGroup}>
          <FileUploadComponent
            files={attachments}
            onFileSelected={(newFiles) => {
              newFiles.forEach(file => addAttachment(file));
            }}
            onFileRemoved={removeAttachment}
            maxFiles={5}
            maxSize={10}
          />
        </View>

        {/* Status */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <TouchableOpacity style={styles.statusButton} onPress={handleStatusPress}>
            <Text style={styles.statusText}>{getStatusLabel(formData.status)}</Text>
            <Ionicons name="chevron-down" size={20} color="#64748B" />
          </TouchableOpacity>
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
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Incoming Mail</Text>
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
  headerRight: {
    width: 32,
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
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  generateButton: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  calendarButton: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
  },
  attachButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4F46E5',
  },
  attachmentsList: {
    marginTop: 12,
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  attachmentText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  removeAttachment: {
    padding: 4,
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
});
