import React, { useState } from 'react';
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
import { useMailDetailViewModel } from '../viewmodels/MailDetailViewModel';

// IPA: /meI.l de.teI.l skri:n/ - Mail Detail Screen (pronounced "mail de-tail screen")
// IPA: /oU.si.ar/ - OCR (pronounced "oh-see-ar")
// IPA: /klæs.I.fI.keI.SEn/ - Classification (pronounced "clas-i-fi-kay-shen")

export const MailDetailScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { mailId } = route.params;
  const [activeTab, setActiveTab] = useState<'details' | 'ocr'>('details');
  const [selectedCategory, setSelectedCategory] = useState('Circulaires & Directives');
  const [isApplyingClassification, setIsApplyingClassification] = useState(false);
  
  const {
    mail,
    isLoading,
    error,
    updateStatus,
    refresh
  } = useMailDetailViewModel(mailId);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRunOCR = () => {
    navigation.navigate('RunOCR', { mailId });
  };

  const handleClassify = () => {
    navigation.navigate('Classify', { mailId });
  };

  const handleEdit = () => {
    navigation.navigate('EditIncomingMail', { mailId });
  };

  const handleStatusUpdate = () => {
    if (!mail) return;
    
    const statusOptions = [
      { label: 'Pending', value: 'pending' },
      { label: 'In Progress', value: 'in_progress' },
      { label: 'Completed', value: 'completed' }
    ];

    Alert.alert(
      'Update Status',
      'Select new status',
      [
        ...statusOptions.map(option => ({
          text: option.label,
          onPress: () => updateStatus(option.value as any)
        })),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleManualOverride = () => {
    Alert.alert(
      'Manual Override',
      'Choose a different category',
      [
        { text: 'Administratif', onPress: () => handleCategorySelect('Administratif') },
        { text: 'Rapports', onPress: () => handleCategorySelect('Rapports') },
        { text: 'Documentation', onPress: () => handleCategorySelect('Documentation') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleApplyClassification = async () => {
    setIsApplyingClassification(true);
    try {
      // Simulate classification process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Classification Applied',
        `Mail has been successfully classified as: ${selectedCategory}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setIsApplyingClassification(false);
              // Refresh mail data to show updated classification
              refresh();
            }
          }
        ]
      );
    } catch {
      Alert.alert(
        'Classification Failed',
        'Failed to apply classification. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsApplyingClassification(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return '#F59E0B';
      case 'pending':
        return '#EF4444';
      case 'completed':
        return '#10B981';
      default:
        return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'time' as keyof typeof Ionicons.glyphMap;
      case 'pending':
        return 'alert-circle' as keyof typeof Ionicons.glyphMap;
      case 'completed':
        return 'checkmark-circle' as keyof typeof Ionicons.glyphMap;
      default:
        return 'help-circle' as keyof typeof Ionicons.glyphMap;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading mail details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !mail) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error || 'Mail not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
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
        <Text style={styles.headerTitle}>Mail Detail</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
          <Ionicons name="refresh" size={24} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ocr' && styles.activeTab]}
          onPress={() => setActiveTab('ocr')}
        >
          <Text style={[styles.tabText, activeTab === 'ocr' && styles.activeTabText]}>
            OCR Extracted Text
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'details' ? (
          // Details Tab
          <View>
            {/* Mail Info */}
            <View style={styles.section}>
              <View style={styles.headerRow}>
                <Text style={styles.reference}>{mail.Reference}</Text>
                <View style={styles.statusContainer}>
                  <Ionicons 
                    name={getStatusIcon(mail.Statut)} 
                    size={16} 
                    color={getStatusColor(mail.Statut)} 
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(mail.Statut) }]}>
                    {mail.Statut.replace('_', ' ')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Date Received</Text>
                  <Text style={styles.infoValue}>{mail.DateCourrier.toISOString().split('T')[0]}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Sender</Text>
                  <Text style={styles.infoValue}>{mail.Expediteur || 'Unknown Sender'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Subject</Text>
                  <Text style={styles.infoValue}>{mail.Objet}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Attachments</Text>
                  <Text style={styles.infoValue}>Category: {mail.CategorieId}</Text>
                </View>
              </View>

              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{mail.Description}</Text>
              </View>

              <View style={styles.attachmentSection}>
                <Text style={styles.sectionTitle}>OCR Text</Text>
                <Text style={styles.description}>
                  {mail.TexteOcr || 'No OCR text available'}
                </Text>
              </View>
            </View>

            {/* Category Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category Details</Text>
              <View style={styles.classificationBox}>
                <Text style={styles.classificationText}>Category ID: {mail.CategorieId}</Text>
                <Text style={styles.classificationText}>
                  Assigned To: {mail.AssigneA ? `User ID: ${mail.AssigneA}` : 'Not assigned'}
                </Text>
              </View>
            </View>

            {/* Status Update Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status Update</Text>
              <TouchableOpacity 
                style={styles.statusUpdateButton}
                onPress={handleStatusUpdate}
              >
                <Text style={styles.statusUpdateText}>Current Status: {mail.Statut.replace('_', ' ')}</Text>
                <Ionicons name="chevron-down" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // OCR Tab
          <View>
            <View style={styles.section}>
              <View style={styles.ocrHeader}>
                <Text style={styles.sectionTitle}>OCR Extracted Text</Text>
                <View style={styles.ocrStatusContainer}>
                  <Ionicons 
                    name={mail.TexteOcr ? 'checkmark-circle' : 'ellipse'} 
                    size={16} 
                    color={mail.TexteOcr ? '#10B981' : '#94A3B8'} 
                  />
                  <Text style={[styles.ocrStatusText, { color: mail.TexteOcr ? '#10B981' : '#94A3B8' }]}>
                    OCR {mail.TexteOcr ? 'Processed' : 'Pending'}
                  </Text>
                </View>
              </View>

              {mail.TexteOcr ? (
                <View style={styles.ocrTextContainer}>
                  <Text style={styles.ocrText}>{mail.TexteOcr}</Text>
                </View>
              ) : (
                <View style={styles.noOCRContainer}>
                  <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
                  <Text style={styles.noOCRText}>No OCR text available</Text>
                  <Text style={styles.noOCRSubtext}>Run OCR to extract text from documents</Text>
                </View>
              )}
            </View>

            {/* Classification Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Classification</Text>
              
              {/* AI Suggested Category */}
              <View style={styles.aiSuggestedContainer}>
                <View style={styles.aiHeader}>
                  <Ionicons name="sparkles" size={16} color="#8B5CF6" />
                  <Text style={styles.aiHeaderText}>AI Suggested Category</Text>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.suggestedCategoryBox,
                    selectedCategory === 'Circulaires & Directives' && styles.selectedCategoryBox
                  ]}
                  onPress={() => handleCategorySelect('Circulaires & Directives')}
                >
                  <Text style={styles.suggestedCategoryText}>Circulaires & Directives</Text>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>95%</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Alternative Suggestions */}
              <View style={styles.alternativeContainer}>
                <Text style={styles.alternativeTitle}>Alternative Suggestions</Text>
                <View style={styles.alternativeList}>
                  <TouchableOpacity 
                    style={[
                      styles.alternativeItem,
                      selectedCategory === 'Administratif' && styles.selectedAlternativeItem
                    ]}
                    onPress={() => handleCategorySelect('Administratif')}
                  >
                    <Ionicons 
                      name={selectedCategory === 'Administratif' ? 'radio-button-on' : 'radio-button-off'} 
                      size={16} 
                      color={selectedCategory === 'Administratif' ? '#8B5CF6' : '#64748B'} 
                    />
                    <Text style={[
                      styles.alternativeText,
                      selectedCategory === 'Administratif' && styles.selectedAlternativeText
                    ]}>Administratif</Text>
                    <Text style={styles.alternativeConfidence}>82%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.alternativeItem,
                      selectedCategory === 'Rapports' && styles.selectedAlternativeItem
                    ]}
                    onPress={() => handleCategorySelect('Rapports')}
                  >
                    <Ionicons 
                      name={selectedCategory === 'Rapports' ? 'radio-button-on' : 'radio-button-off'} 
                      size={16} 
                      color={selectedCategory === 'Rapports' ? '#8B5CF6' : '#64748B'} 
                    />
                    <Text style={[
                      styles.alternativeText,
                      selectedCategory === 'Rapports' && styles.selectedAlternativeText
                    ]}>Rapports</Text>
                    <Text style={styles.alternativeConfidence}>78%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.alternativeItem,
                      selectedCategory === 'Documentation' && styles.selectedAlternativeItem
                    ]}
                    onPress={() => handleCategorySelect('Documentation')}
                  >
                    <Ionicons 
                      name={selectedCategory === 'Documentation' ? 'radio-button-on' : 'radio-button-off'} 
                      size={16} 
                      color={selectedCategory === 'Documentation' ? '#8B5CF6' : '#64748B'} 
                    />
                    <Text style={[
                      styles.alternativeText,
                      selectedCategory === 'Documentation' && styles.selectedAlternativeText
                    ]}>Documentation</Text>
                    <Text style={styles.alternativeConfidence}>71%</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Manual Override */}
              <View style={styles.manualOverrideContainer}>
                <Text style={styles.manualOverrideTitle}>Manual Override</Text>
                <TouchableOpacity style={styles.manualOverrideButton} onPress={handleManualOverride}>
                  <Ionicons name="create-outline" size={16} color="#4F46E5" />
                  <Text style={styles.manualOverrideButtonText}>Choose different category</Text>
                </TouchableOpacity>
              </View>

              {/* Apply Classification Button */}
              <TouchableOpacity 
                style={styles.applyClassificationButton}
                onPress={handleApplyClassification}
                disabled={isApplyingClassification}
              >
                {isApplyingClassification ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.applyClassificationText}>Apply Classification: {selectedCategory}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.ocrButton]}
          onPress={handleRunOCR}
        >
          <Ionicons name="scan" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Run OCR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.classifyButton]}
          onPress={handleClassify}
        >
          <Ionicons name="filter" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Classify</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <Ionicons name="create" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Edit Mail</Text>
        </TouchableOpacity>
      </View>
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
  refreshButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reference: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoGrid: {
    gap: 16,
    marginBottom: 20,
  },
  infoItem: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  attachmentSection: {
    marginBottom: 20,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  classificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  classificationText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  statusUpdateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusUpdateText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  ocrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ocrStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ocrStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceContainer: {
    marginBottom: 16,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  ocrTextContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ocrText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
  },
  noOCRContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noOCRText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  noOCRSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  noClassificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  noClassificationText: {
    fontSize: 14,
    color: '#64748B',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  ocrButton: {
    backgroundColor: '#4F46E5',
  },
  classifyButton: {
    backgroundColor: '#10B981',
  },
  editButton: {
    backgroundColor: '#F59E0B',
  },
  actionButtonText: {
    fontSize: 12,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
  // Classification UI Styles
  aiSuggestedContainer: {
    marginBottom: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  suggestedCategoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  suggestedCategoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  alternativeContainer: {
    marginBottom: 20,
  },
  alternativeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  alternativeList: {
    gap: 8,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  alternativeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  alternativeConfidence: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  manualOverrideContainer: {
    marginBottom: 20,
  },
  manualOverrideTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  manualOverrideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  manualOverrideButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
  },
  applyClassificationButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyClassificationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedCategoryBox: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  selectedAlternativeItem: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  selectedAlternativeText: {
    color: '#10B981',
    fontWeight: '600',
  },
});
