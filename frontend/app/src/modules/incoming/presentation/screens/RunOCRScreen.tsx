import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const RunOCRScreen: React.FC<{ navigation: any, route: any }> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleFlash = () => {
    setFlashMode(prev => prev === 'off' ? 'on' : 'off');
  };

  const handleScan = async () => {
    if (isScanning || isProcessing) return;

    setIsScanning(true);
    setIsProcessing(true);

    try {
      // Simulate camera capture and OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate OCR completion
      Alert.alert(
        'OCR Complete',
        'Document has been successfully scanned and text extracted.',
        [
          {
            text: 'View Results',
            onPress: () => {
              navigation.goBack();
            }
          },
          {
            text: 'Scan Another',
            onPress: () => {
              setIsScanning(false);
              setIsProcessing(false);
            }
          }
        ]
      );
    } catch {
      Alert.alert(
        'OCR Failed',
        'Failed to process document. Please try again.',
        [{ text: 'OK' }]
      );
      setIsScanning(false);
      setIsProcessing(false);
    }
  };

  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Run OCR</Text>
        <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
          <Ionicons 
            name={flashMode === 'on' ? 'flash' : 'flash-off'} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      {/* Mock Camera View */}
      <View style={styles.cameraContainer}>
        <View style={styles.mockCamera}>
          {/* Document Frame Overlay */}
          <View style={styles.overlay}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
            
            {/* Scanning Line Animation */}
            {isScanning && (
              <View style={styles.scanningLine} />
            )}
            
            {/* Camera Icon */}
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={48} color="#FFFFFF" />
              <Text style={styles.cameraIconText}>Camera Preview</Text>
            </View>
            
            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                Position document within the frame
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.galleryButton}
          onPress={() => {
            Alert.alert('Gallery', 'Gallery selection would be implemented here');
          }}
        >
          <Ionicons name="images" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.scanButton, (isScanning || isProcessing) && styles.scanButtonDisabled]}
          onPress={handleScan}
          disabled={isScanning || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <View style={styles.scanButtonInner}>
              <Ionicons name="camera" size={32} color="#FFFFFF" />
              <Text style={styles.scanButtonText}>
                {isScanning ? 'Scanning...' : 'Scan'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => {
            Alert.alert(
              'OCR Information',
              'Optical Character Recognition (OCR) extracts text from images. Position your document clearly within the frame for best results.',
              [{ text: 'Got it' }]
            );
          }}
        >
          <Ionicons name="information-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.processingText}>Processing document...</Text>
            <Text style={styles.processingSubtext}>Extracting text with OCR</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  flashButton: {
    padding: 4,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  mockCamera: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    position: 'relative',
  },
  cameraIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    gap: 8,
  },
  cameraIconText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 100,
    left: 40,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4F46E5',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 100,
    right: 40,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4F46E5',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 200,
    left: 40,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4F46E5',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 200,
    right: 40,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4F46E5',
  },
  scanningLine: {
    position: 'absolute',
    top: 100,
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: '#4F46E5',
    // Animation would be added here
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: '#000000',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  scanButtonInner: {
    alignItems: 'center',
    gap: 4,
  },
  scanButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  processingSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
