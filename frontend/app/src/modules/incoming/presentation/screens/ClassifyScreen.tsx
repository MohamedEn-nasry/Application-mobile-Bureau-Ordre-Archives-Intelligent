import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types and Interfaces
interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  subcategories: string[];
}

interface ClassificationRequest {
  category: string;
  subcategory: string;
}

interface ClassifyScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
  route: {
    params: {
      mailId: string;
    };
  };
}

export const ClassifyScreen: React.FC<ClassifyScreenProps> = ({ navigation, route }) => {
  const { mailId } = route.params;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories: Category[] = useMemo(() => [
    {
      id: 'official',
      name: 'Official Government Document',
      icon: 'document-text',
      color: '#4F46E5',
      subcategories: [
        'Legal Document',
        'Policy Document',
        'Government Form',
        'Official Letter',
        'Regulation',
        'Directive'
      ]
    },
    {
      id: 'financial',
      name: 'Financial Document',
      icon: 'card',
      color: '#10B981',
      subcategories: [
        'Invoice',
        'Receipt',
        'Budget Report',
        'Financial Statement',
        'Tax Document',
        'Expense Report'
      ]
    },
    {
      id: 'administrative',
      name: 'Administrative Memo',
      icon: 'clipboard',
      color: '#F59E0B',
      subcategories: [
        'Internal Memo',
        'Meeting Minutes',
        'Announcement',
        'Policy Update',
        'Procedural Document',
        'Administrative Notice'
      ]
    },
    {
      id: 'educational',
      name: 'Educational Material',
      icon: 'school',
      color: '#8B5CF6',
      subcategories: [
        'Course Material',
        'Training Document',
        'Educational Report',
        'Research Paper',
        'Curriculum',
        'Academic Paper'
      ]
    },
    {
      id: 'personal',
      name: 'Personal Document',
      icon: 'person',
      color: '#EF4444',
      subcategories: [
        'Personal Letter',
        'Personal Form',
        'Personal Request',
        'Personal Statement',
        'Personal Record',
        'Other Personal'
      ]
    },
    {
      id: 'other',
      name: 'Other',
      icon: 'folder',
      color: '#6B7280',
      subcategories: [
        'Uncategorized',
        'Mixed Content',
        'External Document',
        'Miscellaneous',
        'Unknown Type',
        'Other'
      ]
    }
  ], []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any ongoing operations if needed
      setIsProcessing(false);
    };
  }, []);

  // Validate mailId on component mount
  useEffect(() => {
    if (!mailId) {
      setError('Invalid mail ID provided');
      setIsLoading(false);
      return;
    }
    // Could fetch mail details here if needed
    setIsLoading(false);
  }, [mailId]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setError(null);
  }, []);

  const handleSubcategorySelect = useCallback((subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setError(null);
  }, []);

  const handleClassify = useCallback(async () => {
    if (!selectedCategory || !selectedSubcategory) {
      Alert.alert(
        'Selection Required',
        'Please select both a category and subcategory.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!mailId) {
      Alert.alert(
        'Error',
        'Invalid mail ID. Cannot classify document.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate API call for now - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful classification
      const category = categories.find(cat => cat.id === selectedCategory);
      const classification = `${category?.name} - ${selectedSubcategory}`;
      
      Alert.alert(
        'Classification Complete',
        `Document has been classified as:\n\n${classification}`,
        [
          {
            text: 'View Document',
            onPress: () => {
              navigation.goBack();
            }
          },
          {
            text: 'Classify Another',
            onPress: () => {
              setSelectedCategory(null);
              setSelectedSubcategory(null);
              setIsProcessing(false);
            }
          }
        ]
      );
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to classify document. Please try again.';
      setError(errorMessage);
      
      Alert.alert(
        'Classification Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedCategory, selectedSubcategory, mailId, navigation, categories]);

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Classify Document</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => setError(null)}
            accessibilityLabel="Retry classification"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Ionicons name="information-circle" size={24} color="#4F46E5" />
          <Text style={styles.instructionsText}>
            Select the appropriate category and subcategory for this document
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardSelected,
                  { borderLeftColor: category.color }
                ]}
                onPress={() => handleCategorySelect(category.id)}
                accessibilityLabel={`Select ${category.name} category`}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedCategory === category.id }}
              >
                <View style={styles.categoryContent}>
                  <View style={styles.categoryIconContainer}>
                    <Ionicons 
                      name={category.icon} 
                      size={24} 
                      color={category.color} 
                      accessibilityLabel={`${category.name} icon`}
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                {selectedCategory === category.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#4F46E5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Subcategories */}
        {selectedCategoryData && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Subcategory</Text>
            <View style={styles.subcategoriesContainer}>
              {selectedCategoryData.subcategories.map((subcategory) => (
                <TouchableOpacity
                  key={subcategory}
                  style={[
                    styles.subcategoryCard,
                    selectedSubcategory === subcategory && styles.subcategoryCardSelected,
                    { borderLeftColor: selectedCategoryData.color }
                  ]}
                  onPress={() => handleSubcategorySelect(subcategory)}
                  accessibilityLabel={`Select ${subcategory} subcategory`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedSubcategory === subcategory }}
                >
                  <Text style={styles.subcategoryName}>{subcategory}</Text>
                  {selectedSubcategory === subcategory && (
                    <Ionicons name="checkmark-circle" size={20} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Selection Summary */}
        {selectedCategory && selectedSubcategory && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Selected Classification:</Text>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryText}>
                {selectedCategoryData?.name} - {selectedSubcategory}
              </Text>
            </View>
          </View>
        )}

        {/* Classify Button */}
        <TouchableOpacity 
          style={[
            styles.classifyButton,
            (!selectedCategory || !selectedSubcategory) && styles.classifyButtonDisabled,
            isProcessing && styles.classifyButtonProcessing
          ]}
          onPress={handleClassify}
          disabled={!selectedCategory || !selectedSubcategory || isProcessing}
          accessibilityLabel="Classify document"
          accessibilityRole="button"
          accessibilityState={{ disabled: !selectedCategory || !selectedSubcategory || isProcessing }}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="folder" size={20} color="#FFFFFF" />
              <Text style={styles.classifyButtonText}>Classify Document</Text>
            </>
          )}
        </TouchableOpacity>
        </ScrollView>
      )}
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
    justifyContent: 'space-between',
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
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 12,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
  },
  categoryCardSelected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#4F46E5',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  subcategoriesContainer: {
    gap: 8,
  },
  subcategoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 3,
  },
  subcategoryCardSelected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#4F46E5',
  },
  subcategoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
    marginBottom: 4,
  },
  summaryContent: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  classifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  classifyButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  classifyButtonProcessing: {
    backgroundColor: '#6B7280',
  },
  classifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 40,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
