import React, { useState } from 'react';
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
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';

// IPA: /æd aʊt.goʊ.ɪŋ meɪl/ - Add Outgoing Mail (pronounced "add out-goh-ing mail")
// IPA: /skri:n/ - Screen (pronounced "screen")

interface Attachment {
  uri: string;
  name: string;
  size: number;
  type: string;
}

export const AddOutgoingMailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    reference: '',
    dateSent: '',
    recipient: '',
    subject: '',
    description: '',
    status: 'Draft' as 'Draft' | 'Sent' | 'Delivered' | 'Archived',
  });
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = ['Draft', 'Sent', 'Delivered', 'Archived'];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAttachFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newAttachments = result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.name,
          size: asset.size || 0,
          type: asset.mimeType || 'unknown',
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.reference.trim()) {
      Alert.alert('Error', 'Reference is required');
      return;
    }
    if (!formData.dateSent.trim()) {
      Alert.alert('Error', 'Date sent is required');
      return;
    }
    if (!formData.recipient.trim()) {
      Alert.alert('Error', 'Recipient is required');
      return;
    }
    if (!formData.subject.trim()) {
      Alert.alert('Error', 'Subject is required');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Outgoing mail saved successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save outgoing mail');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Outgoing Mail</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Form */}
      <ScrollView 
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reference */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Reference *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. OUT-2026-005"
            value={formData.reference}
            onChangeText={(value) => handleInputChange('reference', value)}
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Date Sent */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Date Sent *</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.textInputWithIcon}
              placeholder="jj/mm/aaaa"
              value={formData.dateSent}
              onChangeText={(value) => handleInputChange('dateSent', value)}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="calendar" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipient */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Recipient *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Organization or person name"
            value={formData.recipient}
            onChangeText={(value) => handleInputChange('recipient', value)}
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Subject */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Subject *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Brief description of the mail"
            value={formData.subject}
            onChangeText={(value) => handleInputChange('subject', value)}
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Additional details about this mail..."
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Attachments */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Attachments</Text>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={handleAttachFile}
            activeOpacity={0.7}
          >
            <Feather name="paperclip" size={20} color="#64748B" />
            <Text style={styles.attachButtonText}>Attach File</Text>
          </TouchableOpacity>
          
          {attachments.length > 0 && (
            <View style={styles.attachmentsList}>
              {attachments.map((attachment, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <Feather name="file" size={16} color="#64748B" />
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName} numberOfLines={1}>
                      {attachment.name}
                    </Text>
                    <Text style={styles.attachmentSize}>
                      {formatFileSize(attachment.size)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeAttachment}
                    onPress={() => handleRemoveAttachment(index)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Status */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Status</Text>
          <View style={styles.statusContainer}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusOption,
                  formData.status === status && styles.statusOptionActive
                ]}
                onPress={() => handleInputChange('status', status)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.statusOptionText,
                  formData.status === status && styles.statusOptionTextActive
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#FFFFFF" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Save Outgoing Mail</Text>
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
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  textInputWithIcon: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
  },
  iconButton: {
    padding: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  attachButtonText: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 8,
    fontWeight: '500',
  },
  attachmentsList: {
    marginTop: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  attachmentSize: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  removeAttachment: {
    padding: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  statusOptionActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  statusOptionTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
