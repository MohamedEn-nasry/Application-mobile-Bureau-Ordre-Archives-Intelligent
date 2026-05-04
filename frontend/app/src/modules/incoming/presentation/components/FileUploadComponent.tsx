import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

interface FileUploadProps {
  onFileSelected: (files: string[]) => void;
  onFileRemoved: (index: number) => void;
  files: string[];
  maxFiles?: number;
  maxSize?: number; // in MB
}

export const FileUploadComponent: React.FC<FileUploadProps> = ({
  onFileSelected,
  onFileRemoved,
  files,
  maxFiles = 5,
  maxSize = 10,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFilePicker = async () => {
    try {
      setIsUploading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
        ],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const newFiles = result.assets.map(asset => asset.name);
        const totalFiles = [...files, ...newFiles];
        
        if (totalFiles.length > maxFiles) {
          Alert.alert(
            'File Limit Exceeded',
            `Maximum ${maxFiles} files allowed. Please remove some files first.`,
            [{ text: 'OK' }]
          );
          return;
        }

        // Check file sizes
        const oversizedFiles = result.assets.filter(asset => {
          const sizeInMB = (asset.size || 0) / (1024 * 1024);
          return sizeInMB > maxSize;
        });

        if (oversizedFiles.length > 0) {
          Alert.alert(
            'File Too Large',
            `Maximum file size is ${maxSize}MB. Please select smaller files.`,
            [{ text: 'OK' }]
          );
          return;
        }

        onFileSelected(newFiles);
      }
    } catch {
      Alert.alert(
        'Error',
        'Failed to select files. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCamera = () => {
    Alert.alert(
      'Add File',
      'Choose file source',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            // Mock camera functionality
            Alert.alert('Camera', 'Camera functionality would be implemented here.');
          }
        },
        {
          text: 'Choose from Device',
          onPress: handleFilePicker
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Attachments</Text>
      
      {/* Upload Area */}
      <TouchableOpacity 
        style={styles.uploadArea}
        onPress={handleCamera}
        disabled={isUploading || files.length >= maxFiles}
      >
        {isUploading ? (
          <ActivityIndicator size="small" color="#4F46E5" />
        ) : (
          <>
            <Ionicons name="cloud-upload" size={24} color="#4F46E5" />
            <Text style={styles.uploadText}>
              {files.length >= maxFiles 
                ? `Maximum ${maxFiles} files reached` 
                : 'Tap to add files'
              }
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* File List */}
      {files.length > 0 && (
        <View style={styles.fileList}>
          {files.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <View style={styles.fileInfo}>
                <Ionicons name="document" size={16} color="#64748B" />
                <Text style={styles.fileName} numberOfLines={1}>
                  {file}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onFileRemoved(index)}
              >
                <Ionicons name="close" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* File Info */}
      <Text style={styles.infoText}>
        {files.length} of {maxFiles} files • Max {maxSize}MB per file
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
  },
  fileList: {
    marginTop: 12,
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
});
