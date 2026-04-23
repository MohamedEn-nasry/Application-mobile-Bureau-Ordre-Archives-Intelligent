import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useIncomingMail } from '../hooks/useIncomingMail';
import { GetIncomingMailUseCase } from '../../domain/usecases/GetIncomingMailUseCase';
import { MailItem } from '../../domain/entities/MailItem';

/**
 * Lecteur Courrier Screen component props
 */
export interface LecteurCourrierScreenProps {
  getIncomingMailUseCase: GetIncomingMailUseCase;
}

/**
 * Lecteur Courrier Screen component
 * Displays incoming mails for reader role users
 */
export const LecteurCourrierScreen: React.FC<LecteurCourrierScreenProps> = ({
  getIncomingMailUseCase,
}) => {
  const { state, fetchIncomingMails, refreshIncomingMails, searchIncomingMails, filterByStatus, filterByPriority, clearError } = useIncomingMail(getIncomingMailUseCase);

  useEffect(() => {
    // Load incoming mails on component mount
    refreshIncomingMails();
  }, [refreshIncomingMails]);

  /**
   * Handle mail item press
   */
  const handleMailPress = (mail: MailItem) => {
    // TODO: Navigate to mail detail screen
    console.log('Mail pressed:', mail.subject);
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    refreshIncomingMails();
  };

  /**
   * Format file size
   */
  const formatFileSize = (attachments: any[]): string => {
    if (!attachments || attachments.length === 0) return '';
    const totalSize = attachments.reduce((sum, attachment) => {
      const size = parseFloat(attachment.size?.replace(/[^0-9.]/g, '') || '0');
      const unit = attachment.size?.replace(/[0-9.]/g, '')?.toLowerCase() || '';
      
      let bytes = size;
      if (unit.includes('ko')) bytes = size * 1024;
      else if (unit.includes('mo')) bytes = size * 1024 * 1024;
      else if (unit.includes('go')) bytes = size * 1024 * 1024 * 1024;
      
      return sum + bytes;
    }, 0);

    const units = ['B', 'KB', 'MB', 'GB'];
    let fileSize = totalSize;
    let unitIndex = 0;
    
    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }
    
    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
  };

  /**
   * Render mail item
   */
  const renderMailItem = ({ item }: { item: MailItem }) => (
    <TouchableOpacity style={styles.mailItem} onPress={() => handleMailPress(item)}>
      <View style={styles.mailHeader}>
        <View style={styles.mailTitleContainer}>
          <Text style={styles.mailSubject}>{item.subject}</Text>
          <Text style={styles.mailReference}>{item.reference}</Text>
        </View>
        <View style={styles.mailStatusContainer}>
          <Text style={[styles.mailStatus, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
          <Text style={styles.mailPriority}>
            {item.priority}
          </Text>
        </View>
      </View>
      
      <Text style={styles.mailDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.mailMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Expéditeur:</Text>
          <Text style={styles.metaValue}>{item.sender || 'N/A'}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Catégorie:</Text>
          <Text style={styles.metaValue}>{item.category}</Text>
        </View>
      </View>
      
      <View style={styles.mailFooter}>
        <Text style={styles.mailDate}>
          Reçu le: {item.dateReceived?.toLocaleDateString() || 'N/A'}
        </Text>
        {item.attachments.length > 0 && (
          <Text style={styles.mailAttachments}>
            {item.attachments.length} pièce(s) jointe(s) • {formatFileSize(item.attachments)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  /**
   * Get status color
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Pending': return '#FFA500';
      case 'Processed': return '#00FF00';
      case 'Urgent': return '#FF0000';
      case 'Archived': return '#808080';
      case 'Sent': return '#0000FF';
      default: return '#000000';
    }
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>Aucun courrier entrant trouvé</Text>
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
      <Text style={styles.title}>Courriers Entrants</Text>
      
      {/* Error display */}
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.retryButton}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => filterByStatus('Pending')}
        >
          <Text style={styles.filterButtonText}>En attente</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => filterByPriority('urgent')}
        >
          <Text style={styles.filterButtonText}>Urgent</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => refreshIncomingMails()}
        >
          <Text style={styles.filterButtonText}>Tous</Text>
        </TouchableOpacity>
      </View>

      {/* Mails list */}
      <FlatList
        data={state.data?.mails || []}
        renderItem={renderMailItem}
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  mailItem: {
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
  mailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mailTitleContainer: {
    flex: 1,
  },
  mailSubject: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  mailReference: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  mailStatusContainer: {
    alignItems: 'flex-end',
  },
  mailStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  mailPriority: {
    fontSize: 12,
    color: '#666',
  },
  mailDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  mailMeta: {
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
  mailFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mailDate: {
    fontSize: 12,
    color: '#666',
  },
  mailAttachments: {
    fontSize: 12,
    color: '#007AFF',
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
