import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useArchives } from '../hooks/useArchives';
import { GetArchivesUseCase } from '../../domain/usecases/GetArchivesUseCase';
import { ArchiveItem } from '../../domain/entities/ArchiveItem';

/**
 * LecteurArchiveScreen component props
 */
export interface LecteurArchiveScreenProps {
  getArchivesUseCase: GetArchivesUseCase;
}

/**
 * Lecteur Archive Screen component
 * Displays archives for reader role users
 */
export const LecteurArchiveScreen: React.FC<LecteurArchiveScreenProps> = ({
  getArchivesUseCase,
}) => {
  const { state, fetchArchives, refreshArchives, searchArchives, filterByCategory, clearError } = useArchives(getArchivesUseCase);

  useEffect(() => {
    // Load archives on component mount
    refreshArchives();
  }, [refreshArchives]);

  /**
   * Handle archive item press
   */
  const handleArchivePress = (archive: ArchiveItem) => {
    // TODO: Navigate to archive detail screen
    console.log('Archive pressed:', archive.title);
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    refreshArchives();
  };

  /**
   * Format file size
   */
  const formatFileSize = (size: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let fileSize = size;
    let unitIndex = 0;
    
    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }
    
    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
  };

  /**
   * Render archive item
   */
  const renderArchiveItem = ({ item }: { item: ArchiveItem }) => (
    <View style={styles.archiveItem}>
      <View style={styles.archiveHeader}>
        <Text style={styles.archiveTitle}>{item.title}</Text>
        <Text style={styles.archiveReference}>{item.reference}</Text>
      </View>
      
      <Text style={styles.archiveDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.archiveMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Catégorie:</Text>
          <Text style={styles.metaValue}>{item.category}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Statut:</Text>
          <Text style={[styles.metaValue, styles.status]}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.archiveFooter}>
        <Text style={styles.archiveDate}>
          Archivé le: {item.archivedDate.toLocaleDateString()}
        </Text>
        <Text style={styles.archiveSize}>{formatFileSize(item.size)}</Text>
      </View>
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>Aucun archive trouvé</Text>
    </View>
  );

  /**
   * Render loading indicator
   */
  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );

  if (state.isLoading && !state.data) {
    return renderLoadingIndicator();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Archives</Text>
      
      {/* Error display */}
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
          <Text style={styles.retryButton} onPress={clearError}>
            Réessayer
          </Text>
        </View>
      )}

      {/* Archives list */}
      <FlatList
        data={state.data?.archives || []}
        renderItem={renderArchiveItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={state.isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={!state.isLoading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading indicator for pagination */}
      {state.isLoading && state.data && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#1a1a1a',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderColor: '#fcc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#d00',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  archiveItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  archiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  archiveTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  archiveReference: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  archiveDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  archiveMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  metaValue: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  status: {
    color: '#007AFF',
  },
  archiveFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  archiveDate: {
    fontSize: 12,
    color: '#666',
  },
  archiveSize: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
