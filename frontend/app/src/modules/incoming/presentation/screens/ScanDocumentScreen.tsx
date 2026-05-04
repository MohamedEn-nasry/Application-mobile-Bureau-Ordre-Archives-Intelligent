import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  CameraView,
  useCameraPermissions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ScanDocumentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFlashToggle = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handleGallery = () => {
    Alert.alert(
      'Select from Gallery',
      'Choose an image from your gallery to scan',
      [
        {
          text: 'Choose Photo',
          onPress: () => {
            // Mock gallery selection
            Alert.alert('Success', 'Photo selected from gallery');
            navigation.goBack();
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleCapture = async () => {
    if (cameraRef.current && !isScanning) {
      setIsScanning(true);
      try {
        // Mock capture and scan process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        Alert.alert(
          'Document Scanned',
          'Document has been successfully scanned and processed.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } catch {
        Alert.alert('Error', 'Failed to scan document. Please try again.');
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleRetake = () => {
    // Reset for new scan
    setIsScanning(false);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#4F46E5" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionMessage}>
            Please grant camera permission to scan documents
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#EF4444" />
          <Text style={styles.permissionTitle}>Camera Access Denied</Text>
          <Text style={styles.permissionMessage}>
            Camera permission is required to scan documents. Please enable it in settings.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Document</Text>
        <TouchableOpacity style={styles.flashButton} onPress={handleFlashToggle}>
          <Ionicons 
            name={flashEnabled ? "flash" : "flash-off"} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          flash={flashEnabled ? "on" : "off"}
          enableTorch={flashEnabled}
        >
          {/* Document Frame Overlay */}
          <View style={styles.overlayContainer}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
              <View style={styles.overlayLeft} />
              <View style={styles.documentFrame}>
                {/* Corner markers */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                
                {/* Position instruction */}
                <View style={styles.instructionContainer}>
                  <Text style={styles.instructionText}>Position document within frame</Text>
                </View>
              </View>
              <View style={styles.overlayRight} />
            </View>
            <View style={styles.overlayBottom} />
          </View>

          {/* Scanning indicator */}
          {isScanning && (
            <View style={styles.scanningOverlay}>
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.scanningText}>Scanning document...</Text>
              </View>
            </View>
          )}
        </CameraView>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleGallery}>
          <Ionicons name="images" size={24} color="#FFFFFF" />
          <Text style={styles.controlText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.captureButton, isScanning && styles.captureButtonDisabled]}
          onPress={handleCapture}
          disabled={isScanning}
        >
          <View style={styles.captureInner}>
            {isScanning ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="camera" size={28} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={handleRetake}>
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
          <Text style={styles.controlText}>Retake</Text>
        </TouchableOpacity>
      </View>
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
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    flex: 2,
  },
  overlayLeft: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayRight: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  documentFrame: {
    flex: 1,
    margin: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FFFFFF',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  instructionContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -20 }],
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningContainer: {
    alignItems: 'center',
  },
  scanningText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 24,
    backgroundColor: '#000000',
  },
  controlButton: {
    alignItems: 'center',
    gap: 4,
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
