import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCourrierDetails } from '../hooks/useCourrierDetails';
import { OutgoingCourrier, CourrierStatus, CourrierPriority } from '../../domain/entities/OutgoingCourrier';
import { BottomNav } from '../../../../shared/presentation/components/BottomNav';

interface Props {
  navigation: any;
  route: any;
}

const getStatusColor = (status: CourrierStatus): string => {
  switch (status) {
    case CourrierStatus.DRAFT:
      return '#94A3B8';
    case CourrierStatus.PENDING:
      return '#F59E0B';
    case CourrierStatus.SENT:
      return '#3B82F6';
    case CourrierStatus.DELIVERED:
      return '#10B981';
    case CourrierStatus.ARCHIVED:
      return '#6B7280';
    case CourrierStatus.CANCELLED:
      return '#EF4444';
    default:
      return '#94A3B8';
  }
};

const getPriorityColor = (priority: CourrierPriority): string => {
  switch (priority) {
    case CourrierPriority.URGENT:
      return '#DC2626';
    case CourrierPriority.HIGH:
      return '#EA580C';
    case CourrierPriority.NORMAL:
      return '#059669';
    case CourrierPriority.LOW:
      return '#0891B2';
    default:
      return '#059669';
  }
};

export const CourrierDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { courrierId } = route.params || {};
  const [showActions, setShowActions] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  
  const {
    courrier,
    isLoading,
    error,
    fetchCourrier,
    clearError,
    updateCourrier,
  } = useCourrierDetails();

  React.useEffect(() => {
    if (courrierId) {
      fetchCourrier(courrierId);
    }
  }, [courrierId, fetchCourrier]);

  const isIncoming = courrier?.type === 'incoming';
  const isOutgoing = courrier?.type === 'outgoing' || !courrier?.type; // Default to outgoing if no type specified

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = () => {
    navigation.navigate('EditCourrier', { courrierId });
  };

  const handleArchive = () => {
    Alert.alert(
      'Archiver le courrier',
      'Êtes-vous sûr de vouloir archiver ce courrier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Archiver', style: 'destructive', onPress: () => {
          // TODO: Implement archive functionality
        }},
      ]
    );
  };

  const handleReassign = () => {
    // TODO: Implement reassign functionality
    Alert.alert('Réassigner', 'Fonctionnalité à implémenter');
  };

  const handleViewHistory = () => {
    // TODO: Implement history view
    Alert.alert('Historique', 'Fonctionnalité à implémenter');
  };

  const handleAccept = () => {
    Alert.alert(
      'Accepter le courrier',
      'Êtes-vous sûr de vouloir accepter ce courrier entrant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Accepter', style: 'default', onPress: () => {
          // TODO: Implement accept functionality
          Alert.alert('Accepté', 'Le courrier a été accepté avec succès');
        }},
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Rejeter le courrier',
      'Êtes-vous sûr de vouloir rejeter ce courrier entrant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Rejeter', style: 'destructive', onPress: () => {
          // TODO: Implement reject functionality
          Alert.alert('Rejeté', 'Le courrier a été rejeté');
        }},
      ]
    );
  };

  const handleForward = () => {
    // TODO: Implement forward functionality
    Alert.alert('Transférer', 'Fonctionnalité à implémenter');
  };

  const handleRespond = () => {
    setShowResponse(true);
  };

  if (isLoading && !courrier) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              clearError();
              fetchCourrier(courrierId);
            }}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!courrier) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="mail-outline" size={48} color="#9CA3AF" />
          <Text style={styles.errorTitle}>Courrier non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, isIncoming && styles.incomingHeader]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isIncoming ? 'Courrier Entrant' : 'Courrier'}
        </Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowActions(!showActions)}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={[isIncoming ? styles.incomingIndicator : styles.outgoingIndicator]}>
        <View style={styles.indicatorDot} />
        <Text style={styles.indicatorText}>
          {isIncoming ? 'COURRIER ENTRANT' : 'COURRIER SORTANT'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="document-text-outline" size={16} color="#6B7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Référence</Text>
                <Text style={styles.infoValue}>{courrier.reference}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person-outline" size={16} color="#6B7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {isIncoming ? 'Expéditeur' : 'Destinataire'}
                </Text>
                <Text style={styles.infoValue}>{courrier.recipient}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {isIncoming ? 'Date de réception' : 'Date d\'envoi'}
                </Text>
                <Text style={styles.infoValue}>{formatDate(courrier.dateSent)}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="flag-outline" size={16} color="#6B7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Statut</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(courrier.status) }]}>
                  <Text style={styles.statusText}>{courrier.status}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="alert-circle-outline" size={16} color="#6B7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Priorité</Text>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(courrier.priority) }]}>
                  <Text style={styles.priorityText}>{courrier.priority}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sujet</Text>
          <View style={styles.subjectContainer}>
            <Text style={styles.subject}>{courrier.subject}</Text>
          </View>
        </View>

        {courrier.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{courrier.description}</Text>
            </View>
          </View>
        )}

        {courrier.attachments && courrier.attachments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pièces jointes</Text>
            <View style={styles.attachmentsContainer}>
              {courrier.attachments.map((attachment, index) => (
                <TouchableOpacity key={index} style={styles.attachmentItem}>
                  <View style={styles.attachmentIcon}>
                    <Ionicons name="document-outline" size={20} color="#6B7280" />
                  </View>
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName}>{attachment}</Text>
                    <Text style={styles.attachmentSize}>2.3 MB</Text>
                  </View>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Ionicons name="download-outline" size={16} color="#3B82F6" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {isIncoming ? (
          <View style={styles.actionSection}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard} onPress={handleAccept}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="checkmark" size={24} color="#10B981" />
                </View>
                <Text style={styles.actionCardText}>Accepter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={handleReject}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="close" size={24} color="#EF4444" />
                </View>
                <Text style={styles.actionCardText}>Rejeter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={handleRespond}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="chatbubble-outline" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.actionCardText}>Répondre</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={handleForward}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="arrow-forward" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.actionCardText}>Transférer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.actionSection}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard} onPress={handleEdit}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="create-outline" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.actionCardText}>Modifier</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={handleArchive}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="archive-outline" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.actionCardText}>Archiver</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={handleReassign}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="person-add-outline" size={24} color="#10B981" />
                </View>
                <Text style={styles.actionCardText}>Réassigner</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={handleViewHistory}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="time-outline" size={24} color="#6B7280" />
                </View>
                <Text style={styles.actionCardText}>Historique</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isIncoming && showResponse && (
          <View style={styles.responseSection}>
            <Text style={styles.sectionTitle}>Réponse rapide</Text>
            <View style={styles.responseContainer}>
              <Text style={styles.responseLabel}>Votre réponse:</Text>
              <View style={styles.responseInput}>
                <Text style={styles.responsePlaceholder}>Tapez votre réponse ici...</Text>
              </View>
              <View style={styles.responseActions}>
                <TouchableOpacity style={[styles.responseButton, styles.cancelResponseButton]} onPress={() => setShowResponse(false)}>
                  <Text style={styles.cancelResponseText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.responseButton, styles.sendResponseButton]}>
                  <Ionicons name="send" size={16} color="#FFFFFF" />
                  <Text style={styles.sendResponseText}>Envoyer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNav active="courrier" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#3B82F6',
  },
  incomingHeader: {
    backgroundColor: '#10B981',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outgoingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    gap: 8,
  },
  incomingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 8,
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subjectContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 24,
  },
  descriptionContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  attachmentsContainer: {
    gap: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    color: '#64748B',
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  responseSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  responseContainer: {
    gap: 12,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  responseInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
  },
  responsePlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },
  responseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  responseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  cancelResponseButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelResponseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  sendResponseButton: {
    backgroundColor: '#3B82F6',
  },
  sendResponseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
