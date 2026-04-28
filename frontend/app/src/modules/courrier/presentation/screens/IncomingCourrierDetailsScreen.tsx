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

export const IncomingCourrierDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
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

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const handleViewHistory = () => {
    // TODO: Implement history view
    Alert.alert('Historique', 'Fonctionnalité à implémenter');
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Courrier Entrant</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowActions(!showActions)}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.incomingIndicator}>
          <View style={styles.indicatorDot} />
          <Text style={styles.indicatorText}>COURRIER ENTRANT</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Référence:</Text>
            <Text style={styles.infoValue}>{courrier.reference}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Expéditeur:</Text>
            <Text style={styles.infoValue}>{courrier.recipient}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date de réception:</Text>
            <Text style={styles.infoValue}>{formatDate(courrier.dateSent)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Statut:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(courrier.status) }]}>
              <Text style={styles.statusText}>{courrier.status}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Priorité:</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(courrier.priority) }]}>
              <Text style={styles.priorityText}>{courrier.priority}</Text>
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
            <Text style={styles.sectionTitle}>Message</Text>
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{courrier.description}</Text>
            </View>
          </View>
        )}

        {courrier.attachments && courrier.attachments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pièces jointes</Text>
            <View style={styles.attachmentsContainer}>
              {courrier.attachments.map((attachment, index) => (
                <TouchableOpacity key={index} style={styles.attachmentItem}>
                  <Ionicons name="attach" size={20} color="#6B7280" />
                  <Text style={styles.attachmentName}>{attachment}</Text>
                  <Ionicons name="download-outline" size={16} color="#3B82F6" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {!showResponse && (
          <View style={styles.actionSection}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={handleAccept}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Accepter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={handleReject}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Rejeter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.respondButton]} onPress={handleRespond}>
                <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Répondre</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.forwardButton]} onPress={handleForward}>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Transférer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {showResponse && (
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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.historyButton} onPress={handleViewHistory}>
          <Ionicons name="time-outline" size={20} color="#6B7280" />
          <Text style={styles.historyButtonText}>Voir l'historique</Text>
        </TouchableOpacity>
      </View>

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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
  messageContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  message: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  attachmentsContainer: {
    gap: 8,
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
  attachmentName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    marginLeft: 8,
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    minWidth: 100,
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  respondButton: {
    backgroundColor: '#3B82F6',
  },
  forwardButton: {
    backgroundColor: '#F59E0B',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
});
