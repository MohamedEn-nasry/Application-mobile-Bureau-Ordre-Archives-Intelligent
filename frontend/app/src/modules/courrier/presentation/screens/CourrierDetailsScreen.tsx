import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
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
    case CourrierStatus.ACCEPTED:
      return '#10B981';
    case CourrierStatus.REJECTED:
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
  const [responseText, setResponseText] = useState('');
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardRecipient, setForwardRecipient] = useState('');
  const [forwardMessage, setForwardMessage] = useState('');
  
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

  const handleArchive = async () => {
    Alert.alert(
      'Archiver le courrier',
      'Êtes-vous sûr de vouloir archiver ce courrier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Archiver', style: 'destructive', onPress: async () => {
          try {
            if (courrier) {
              const updatedCourrier = { ...courrier, status: CourrierStatus.ARCHIVED };
              updateCourrier(updatedCourrier);
              
              // TODO: Implement actual API call to update status
              // For now, simulate success
              Alert.alert('Succès', 'Le courrier a été archivé avec succès');
              navigation.goBack();
            }
          } catch (error) {
            Alert.alert('Erreur', 'Échec de l\'archivage du courrier');
          }
        }},
      ]
    );
  };

  const handleReassign = () => {
    setShowReassignModal(true);
  };

  const handleConfirmReassign = async () => {
    if (!selectedUser.trim()) {
      Alert.alert('Erreur', 'Veuillez sélectionner un utilisateur');
      return;
    }

    try {
      if (courrier) {
        const updatedCourrier = { ...courrier, assignedTo: selectedUser };
        updateCourrier(updatedCourrier);
        
        // TODO: Implement actual API call to reassign
        Alert.alert('Succès', `Le courrier a été réassigné à ${selectedUser}`);
        setShowReassignModal(false);
        setSelectedUser('');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la réassignation du courrier');
    }
  };

  const [users, setUsers] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const handleViewHistory = () => {
    setShowHistoryModal(true);
  };

  // TODO: Fetch users from API
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const handleAccept = async () => {
    Alert.alert(
      'Accepter le courrier',
      'Êtes-vous sûr de vouloir accepter ce courrier entrant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Accepter', style: 'default', onPress: async () => {
          try {
            if (courrier) {
              const updatedCourrier = { 
                ...courrier, 
                status: CourrierStatus.ACCEPTED,
                acceptedAt: new Date()
              };
              updateCourrier(updatedCourrier);
              
              // TODO: Implement actual API call to update status
              Alert.alert('Succès', 'Le courrier a été accepté avec succès');
            }
          } catch (error) {
            Alert.alert('Erreur', 'Échec de l\'acceptation du courrier');
          }
        }},
      ]
    );
  };

  const handleReject = async () => {
    Alert.alert(
      'Rejeter le courrier',
      'Êtes-vous sûr de vouloir rejeter ce courrier entrant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Rejeter', style: 'destructive', onPress: async () => {
          try {
            if (courrier) {
              const updatedCourrier = { 
                ...courrier, 
                status: CourrierStatus.REJECTED,
                rejectedAt: new Date()
              };
              updateCourrier(updatedCourrier);
              
              // TODO: Implement actual API call to update status
              Alert.alert('Succès', 'Le courrier a été rejeté');
            }
          } catch (error) {
            Alert.alert('Erreur', 'Échec du rejet du courrier');
          }
        }},
      ]
    );
  };

  const handleForward = () => {
    setShowForwardModal(true);
  };

  const handleConfirmForward = async () => {
    if (!forwardRecipient.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un destinataire');
      return;
    }

    try {
      if (courrier) {
        // TODO: Implement actual API call to forward
        // For now, simulate success
        Alert.alert('Succès', `Le courrier a été transféré à ${forwardRecipient}`);
        setShowForwardModal(false);
        setForwardRecipient('');
        setForwardMessage('');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec du transfert du courrier');
    }
  };

  const handleRespond = () => {
    setShowResponse(true);
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une réponse');
      return;
    }

    try {
      // TODO: Implement actual API call to send response
      // For now, simulate success
      Alert.alert('Succès', 'Votre réponse a été envoyée avec succès');
      setResponseText('');
      setShowResponse(false);
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'envoi de la réponse');
    }
  };

  const handleDownloadAttachment = async (attachmentName: string) => {
    try {
      // TODO: Implement actual file download
      // For now, simulate download
      Alert.alert('Téléchargement', `Téléchargement de ${attachmentName} démarré...`);
      
      // In a real app, you would:
      // 1. Call API to get download URL
      // 2. Use React Native's FileSystem or Linking to download file
      // 3. Show progress indicator
      // 4. Handle download completion/error
    } catch (error) {
      Alert.alert('Erreur', 'Échec du téléchargement du fichier');
    }
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
                  <TouchableOpacity 
                    style={styles.downloadButton}
                    onPress={() => handleDownloadAttachment(attachment)}
                  >
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
              <TextInput
                style={styles.responseInput}
                placeholder="Tapez votre réponse ici..."
                placeholderTextColor="#94A3B8"
                multiline
                value={responseText}
                onChangeText={setResponseText}
                textAlignVertical="top"
              />
              <View style={styles.responseActions}>
                <TouchableOpacity style={[styles.responseButton, styles.cancelResponseButton]} onPress={() => setShowResponse(false)}>
                  <Text style={styles.cancelResponseText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.responseButton, styles.sendResponseButton]} onPress={handleSendResponse}>
                  <Ionicons name="send" size={16} color="#FFFFFF" />
                  <Text style={styles.sendResponseText}>Envoyer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {showReassignModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Réassigner le courrier</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowReassignModal(false)}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalLabel}>Sélectionner un utilisateur:</Text>
            <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.userItem,
                      selectedUser === user && styles.selectedUserItem
                    ]}
                    onPress={() => setSelectedUser(user)}
                  >
                    <View style={styles.userRadio}>
                      {selectedUser === user && (
                        <View style={styles.radioSelected} />
                      )}
                    </View>
                    <Text style={styles.userName}>{user}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Aucun utilisateur disponible</Text>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setShowReassignModal(false);
                  setSelectedUser('');
                }}
              >
                <Text style={styles.cancelModalText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleConfirmReassign}
              >
                <Text style={styles.confirmModalText}>Réassigner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showHistoryModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.historyModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Historique du courrier</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowHistoryModal(false)}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyItemHeader}>
                      <View style={styles.historyActionBadge}>
                        <Text style={styles.historyActionText}>{item.action}</Text>
                      </View>
                      <Text style={styles.historyDate}>
                        {formatDate(item.date)}
                      </Text>
                    </View>
                    <Text style={styles.historyUser}>Par: {item.user}</Text>
                    <Text style={styles.historyDescription}>{item.description}</Text>
                    {index < history.length - 1 && (
                      <View style={styles.historySeparator} />
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Aucun historique disponible</Text>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.historyModalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeModalButton]}
                onPress={() => setShowHistoryModal(false)}
              >
                <Text style={styles.closeModalText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showForwardModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.forwardModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Transférer le courrier</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowForwardModal(false);
                  setForwardRecipient('');
                  setForwardMessage('');
                }}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalLabel}>Destinataire:</Text>
            <TextInput
              style={styles.forwardInput}
              placeholder="Nom ou email du destinataire..."
              placeholderTextColor="#94A3B8"
              value={forwardRecipient}
              onChangeText={setForwardRecipient}
            />
            
            <Text style={[styles.modalLabel, { marginTop: 16 }]}>Message (optionnel):</Text>
            <TextInput
              style={[styles.forwardInput, styles.forwardMessageInput]}
              placeholder="Ajouter un message..."
              placeholderTextColor="#94A3B8"
              multiline
              value={forwardMessage}
              onChangeText={setForwardMessage}
              textAlignVertical="top"
            />
            
            <View style={styles.forwardModalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setShowForwardModal(false);
                  setForwardRecipient('');
                  setForwardMessage('');
                }}
              >
                <Text style={styles.cancelModalText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleConfirmForward}
              >
                <Text style={styles.confirmModalText}>Transférer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 12,
  },
  userList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedUserItem: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  userRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelModalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmModalButton: {
    backgroundColor: '#3B82F6',
  },
  confirmModalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  historyList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  historyItem: {
    marginBottom: 16,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyActionBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  historyActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
    textTransform: 'uppercase',
  },
  historyDate: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  historyUser: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  historyDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  historySeparator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 16,
  },
  historyModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  closeModalButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  closeModalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  forwardModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  forwardInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 16,
  },
  forwardMessageInput: {
    minHeight: 100,
  },
  forwardModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
