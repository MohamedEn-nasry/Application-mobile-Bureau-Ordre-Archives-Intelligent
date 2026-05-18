import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

import { useCourrierDetails } from '../hooks/useCourrierDetail';
import { useCategories } from '../hooks/useCategories';
import { useArchiveCourrier } from '../hooks/useArchiveCourrier';
import { useUpdateCourrierStatus } from '../hooks/useUpdateCourrierStatus';
import { useReassignCourrier } from '../hooks/useReassignCourrier';
import { useCourrierHistory } from '../hooks/useCourrierHistory';
import { useCourrierOcrAttachment } from '../hooks/useCourrierOcrAttachment';
import { useCourrierAttachments } from '../hooks/useCourrierAttachments';

import { useUserProfile } from '../../../profile/presentation/hooks/useUserProfile';
import { useUserEmailLookup } from '../../../users/presentation/hooks/useUserEmailLookup';

import { Roles, Role } from '../../../../shared/constants/roles';
import { Permissions } from '../../../../shared/constants/permissions';
import { can } from '../../../../shared/authorization/can';
import { Routes } from '../../../../shared/constants/routes';

import { SelectedFileModel } from '../../data/models/PieceJointeModels';

export const CourrierDetailScreen = ({ route, navigation }: any) => {
  const { id } = route.params;

  const currentRole = (route?.params?.roleName ?? Roles.LECTEUR) as Role;
  const currentUserId = Number(route?.params?.userId ?? 0);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [ocrModalVisible, setOcrModalVisible] = useState(false);
  const [editableOcrText, setEditableOcrText] = useState('');
  const [ocrWasEdited, setOcrWasEdited] = useState(false);

  const [reassignVisible, setReassignVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);

  const [assigneEmail, setAssigneEmail] = useState('');
  const [selectedAssigneId, setSelectedAssigneId] = useState<number | null>(
    null
  );
  const [reassignCommentaire, setReassignCommentaire] = useState('');

  const canUpdateCourrier = can(currentRole, Permissions.COURRIER_UPDATE);
  const canArchiveCourrier = can(currentRole, Permissions.COURRIER_ARCHIVE);
  const canChangeStatus = can(
    currentRole,
    Permissions.COURRIER_CHANGE_STATUS
  );

  const isReadOnly =
    !canUpdateCourrier && !canArchiveCourrier && !canChangeStatus;

  const {
    courrier,
    isLoading,
    error,
    refetch,
  } = useCourrierDetails(Number(id));

  const isEntrant = courrier?.Type === 'Entrant';
  const userToFetchId = isEntrant ? courrier?.AssigneA : courrier?.AuteurId;
  const { profile: assignedUserProfile } = useUserProfile(userToFetchId ?? 0);

  const {
    ocrImage,
    error: attachmentsError,
    refetch: refetchAttachments,
  } = useCourrierAttachments(Number(id));

  const {
    archiveCourrier,
    isLoading: isArchiving,
  } = useArchiveCourrier();

  const {
    updateStatus,
    isLoading: isUpdatingStatus,
  } = useUpdateCourrierStatus();

  const {
    pendingAttachment,
    previewOcr,
    uploadAndConfirmNow,
    isLoading: isOcrLoading,
    error: ocrError,
  } = useCourrierOcrAttachment();

  const {
    reassignCourrier,
    isLoading: isReassigning,
    error: reassignError,
  } = useReassignCourrier();

  const {
    history,
    isLoading: isLoadingHistory,
    error: historyError,
    fetchHistory,
  } = useCourrierHistory();

  const {
    suggestions: userSuggestions,
    isSearching: isSearchingUsers,
    lookupError,
    searchUsers,
    clearSuggestions,
  } = useUserEmailLookup();

  const { categories } = useCategories();

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchAttachments();
    }, [refetch, refetchAttachments])
  );

  const getCategorieName = (categorieId: number | null) => {
    if (!categorieId) return 'Catégorie';

    const categorie = categories.find(
      item => Number(item.id) === Number(categorieId)
    );

    return categorie?.Nom || `Catégorie ${categorieId}`;
  };

  const handleArchive = async () => {
    if (!courrier) return;

    const success = await archiveCourrier(Number(courrier.id));

    if (success) {
      await refetch();
      await refetchAttachments();
    }
  };

  const handleChangeStatus = async (statut: string) => {
    if (!courrier) return;

    const success = await updateStatus(Number(courrier.id), statut);

    if (success) {
      await refetch();
    }
  };

  const getAvailableStatuses = () => {
    if (!courrier) return [];

    if (courrier.IsEntrant) {
      return [
        { value: 'ATraiter', label: 'En attente' },
        { value: 'EnTraitement', label: 'En traitement' },
        { value: 'Traite', label: 'Traité' },
        { value: 'Archive', label: 'Archivé' },
      ];
    }

    return [
      { value: 'ATraiter', label: 'En attente' },
      { value: 'Pret', label: 'Prêt' },
      { value: 'Envoye', label: 'Envoyé' },
      { value: 'Archive', label: 'Archivé' },
    ];
  };

  const openStatusDialog = () => {
    setStatusModalVisible(true);
  };

  const handleSelectStatus = async (status: string) => {
    setStatusModalVisible(false);
    await handleChangeStatus(status);
  };

  const openReassignModal = () => {
    setAssigneEmail('');
    setSelectedAssigneId(null);
    setReassignCommentaire('');
    clearSuggestions();
    setReassignVisible(true);
  };

  const handleAssigneEmailChange = (text: string) => {
    setAssigneEmail(text);
    setSelectedAssigneId(null);
    searchUsers(text);
  };

  const handleSelectAssigneUser = (user: any) => {
    setSelectedAssigneId(Number(user.id));
    setAssigneEmail(user.Email);
    clearSuggestions();
  };

  const handleConfirmReassign = async () => {
    if (!courrier) return;

    if (!selectedAssigneId) {
      Alert.alert(
        'Réassignation',
        'Veuillez choisir un utilisateur existant.'
      );
      return;
    }

    const success = await reassignCourrier({
      courrierId: Number(courrier.id),
      assigneA: selectedAssigneId,
      commentaire: reassignCommentaire.trim() || null,
    });

    if (success) {
      setReassignVisible(false);
      await refetch();
    }
  };

  const openHistoryModal = async () => {
    if (!courrier) return;

    setHistoryVisible(true);
    await fetchHistory(Number(courrier.id));
  };



  const handleConfirmOcrUpload = async () => {
    if (!courrier || !pendingAttachment) return;

    const classification = pendingAttachment.preview.classification;

    const success = await uploadAndConfirmNow(Number(courrier.id), {
      texteOcr: editableOcrText.trim(),
      ocrConfiance: pendingAttachment.preview.ocrConfiance,
      corrigeManuellement: ocrWasEdited,
      categorieId: classification.suggestedCategorieId ?? courrier.CategorieId,
      scoreConfiance: classification.scoreConfiance,
      methode: classification.methode || 'OCR_RULE_BASED',
    });

    if (success) {
      setOcrModalVisible(false);
      await refetch();
      await refetchAttachments();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (error || !courrier) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || 'Courrier introuvable.'}
        </Text>

        <Pressable style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Réessayer</Text>
        </Pressable>
      </SafeAreaView>
    );
  }


  const screenTitle = isEntrant ? 'Courrier Entrant' : 'Courrier Sortant';
  const categorieName = getCategorieName(courrier.CategorieId);

  const ocrImageDataUrl =
    (ocrImage as any)?.DataUrl ?? (ocrImage as any)?.dataUrl ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <View style={styles.topBarText}>
          <Text style={styles.screenTitle}>{screenTitle}</Text>
          <Text style={styles.screenReference}>{courrier.Reference}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.heroCard, !isEntrant && styles.heroCardSortant]}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>Référence</Text>

              <Text style={styles.heroReference} numberOfLines={1}>
                {courrier.Reference}
              </Text>
            </View>

            <StatusBadge status={courrier.Statut} />
          </View>

          <View style={styles.heroSeparator} />

          <View style={styles.heroMetaRow}>
            <Text style={styles.heroMetaText}>
              {formatDate(courrier.DateCourrier)}
            </Text>

            <Text style={styles.heroMetaText} numberOfLines={1}>
              {categorieName}
            </Text>
          </View>
        </View>

        <SectionCard>
          <Text style={styles.sectionLabel}>
            {isEntrant ? 'EXPÉDITEUR' : 'DESTINATAIRE'}
          </Text>

          <Text style={styles.mainValue}>
            {isEntrant
              ? courrier.Expediteur || 'Non défini'
              : courrier.Destinataire || 'Non défini'}
          </Text>

          <View style={styles.separator} />

          <Text style={styles.sectionLabel}>OBJET</Text>

          <Text style={styles.mainValue}>
            {courrier.Objet || 'Non défini'}
          </Text>
        </SectionCard>

        <SectionCard title="Description">
          <Text style={styles.description}>
            {courrier.Description || 'Aucune description.'}
          </Text>
        </SectionCard>

        <SectionCard title="Catégorie">
          <Text style={styles.mainValue}>{categorieName}</Text>
        </SectionCard>

        <SectionCard title="Texte OCR extrait">
          <Text style={styles.ocrHint}>
            Comparez le texte extrait avec l’image originale.
          </Text>

          {attachmentsError ? (
            <Text style={styles.errorText}>{attachmentsError}</Text>
          ) : null}

          {ocrError ? <Text style={styles.errorText}>{ocrError}</Text> : null}

          <View style={styles.ocrCompareContainer}>
            <View style={styles.ocrCompareBox}>
              <Text style={styles.ocrCompareTitle}>Image originale</Text>

              {ocrImageDataUrl ? (
                <Image
                  source={{ uri: ocrImageDataUrl }}
                  style={styles.ocrImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.emptyImageBox}>
                  <Text style={styles.emptyImageText}>
                    Aucune image OCR disponible.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.ocrCompareBox}>
              <Text style={styles.ocrCompareTitle}>Texte extrait</Text>

              <View style={styles.ocrBox}>
                <Text style={styles.ocrText}>
                  {courrier.TexteOcr || 'Aucun texte OCR extrait.'}
                </Text>
              </View>
            </View>
          </View>
        </SectionCard>

        {currentRole !== Roles.LECTEUR && (
          <SectionCard title={isEntrant ? 'Assigné à' : 'Émis par'}>
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {isEntrant ? (assignedUserProfile?.Initials || 'A') : (assignedUserProfile?.Initials || 'U')}
                </Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {isEntrant
                    ? courrier.AssigneA
                      ? assignedUserProfile?.FullName || `Utilisateur #${courrier.AssigneA}`
                      : 'Non assigné'
                    : assignedUserProfile?.FullName || `Utilisateur #${courrier.AuteurId}`}
                </Text>

                <Text style={styles.userRole}>
                  {isEntrant ? 'Agent assigné' : 'Auteur du courrier'}
                </Text>
              </View>
            </View>
          </SectionCard>
        )}

        {canChangeStatus ? (
          <SectionCard title="Changer le statut">
            <TouchableOpacity
              style={styles.statusSelector}
              onPress={openStatusDialog}
              disabled={isUpdatingStatus}
            >
              <StatusBadge status={courrier.Statut} />

              <Text style={styles.chevron}>
                {isUpdatingStatus ? '...' : '⌄'}
              </Text>
            </TouchableOpacity>
          </SectionCard>
        ) : null}

        {!isReadOnly ? (
          <>
            <Text style={styles.actionsTitle}>ACTIONS</Text>

            <View style={styles.actionsRow}>
              {canUpdateCourrier ? (
                <ActionButton
                  label="Modifier"
                  color="#1455ff"
                  onPress={() =>
                    navigation.navigate(Routes.Agent.CreateUpdateCourrier, {
                      courrier,
                      roleName: currentRole,
                      userId: currentUserId,
                    })
                  }
                />
              ) : null}

              {canArchiveCourrier ? (
                <ActionButton
                  label={isArchiving ? '...' : 'Archiver'}
                  color="#475569"
                  onPress={handleArchive}
                />
              ) : null}

              {canUpdateCourrier ? (
                <ActionButton
                  label={isReassigning ? '...' : 'Réassigner'}
                  color="#4f46e5"
                  onPress={openReassignModal}
                />
              ) : null}
              {/* 
              {canUpdateCourrier ? (
                <ActionButton
                  label={isOcrLoading ? '...' : 'OCR'}
                  color="#8b22f4"
                  onPress={handlePickOcrImage}
                />
              ) : null} */}

              <ActionButton
                label="Historique"
                color="#009688"
                onPress={openHistoryModal}
              />
            </View>
          </>
        ) : null}

        <SectionCard title="Informations système">
          <InfoRow
            label="Créé le"
            value={formatDate(courrier.CreatedAt)}
          />

          <InfoRow
            label="Modifié le"
            value={formatDate(courrier.UpdatedAt)}
          />

          <InfoRow
            label="Échéance"
            value={
              courrier.DateEcheance
                ? formatDate(courrier.DateEcheance)
                : 'Aucune échéance'
            }
          />
        </SectionCard>
      </ScrollView>

      <Modal
        visible={reassignVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReassignVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Réassigner le courrier</Text>

            <Text style={styles.modalSubtitle}>
              Cherchez l'utilisateur par email, puis choisissez-le.
            </Text>

            {reassignError ? (
              <Text style={styles.modalError}>{reassignError}</Text>
            ) : null}

            <Text style={styles.modalLabel}>Email utilisateur</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="agent@email.com"
              placeholderTextColor="#94a3b8"
              value={assigneEmail}
              onChangeText={handleAssigneEmailChange}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {isSearchingUsers ? (
              <Text style={styles.lookupText}>Recherche...</Text>
            ) : null}

            {lookupError ? (
              <Text style={styles.modalError}>{lookupError}</Text>
            ) : null}

            {assigneEmail.trim().length >= 2 &&
              userSuggestions.length === 0 &&
              !isSearchingUsers &&
              !selectedAssigneId ? (
              <Text style={styles.modalError}>
                Aucun utilisateur avec cet email.
              </Text>
            ) : null}

            {userSuggestions.length > 0 ? (
              <View style={styles.suggestionsBox}>
                {userSuggestions.map(user => (
                  <TouchableOpacity
                    key={user.id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectAssigneUser(user)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.suggestionEmail}>{user.Email}</Text>

                      <Text style={styles.suggestionName}>
                        {user.FullName || 'Utilisateur'} · {user.RoleName}
                      </Text>
                    </View>

                    <Text style={styles.suggestionChoose}>Choisir</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            {selectedAssigneId ? (
              <Text style={styles.selectedUserText}>
                Utilisateur sélectionné ✓ ID: {selectedAssigneId}
              </Text>
            ) : null}

            <Text style={styles.modalLabel}>Commentaire</Text>

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Ex: Réassignation pour traitement urgent..."
              placeholderTextColor="#94a3b8"
              value={reassignCommentaire}
              onChangeText={setReassignCommentaire}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButtonFlex}
                onPress={() => setReassignVisible(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmReassign}
                disabled={isReassigning}
              >
                <Text style={styles.modalConfirmText}>
                  {isReassigning ? '...' : 'Confirmer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={historyVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setHistoryVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Historique du courrier</Text>

            {isLoadingHistory ? (
              <ActivityIndicator
                size="large"
                color="#2563eb"
                style={{ marginVertical: 20 }}
              />
            ) : null}

            {historyError ? (
              <Text style={styles.modalError}>{historyError}</Text>
            ) : null}

            {!isLoadingHistory && history.length === 0 ? (
              <Text style={styles.emptyHistory}>
                Aucun historique disponible.
              </Text>
            ) : null}

            <ScrollView style={styles.historyList}>
              {history.map(item => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyTopRow}>
                    <StatusBadge status={item.ancienStatut} />
                    <Text style={styles.historyArrow}>→</Text>
                    <StatusBadge status={item.nouveauStatut} />
                  </View>

                  {item.commentaire ? (
                    <Text style={styles.historyComment}>
                      {item.commentaire}
                    </Text>
                  ) : null}

                  <Text style={styles.historyMeta}>
                    Par {item.modifieParNom} ·{' '}
                    {formatDate(new Date(item.changedAt))}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setHistoryVisible(false)}
            >
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={statusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Changer le statut</Text>

            <Text style={styles.modalSubtitle}>
              Choisir le nouveau statut
            </Text>

            {getAvailableStatuses().map(item => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.statusOption,
                  courrier.Statut === item.value && styles.statusOptionActive,
                ]}
                onPress={() => handleSelectStatus(item.value)}
              >
                <StatusBadge status={item.value} />

                <Text style={styles.statusOptionLabel}>{item.label}</Text>

                {courrier.Statut === item.value ? (
                  <Text style={styles.statusCheck}>✓</Text>
                ) : null}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={ocrModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOcrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Vérifier le résultat OCR</Text>

            <Text style={styles.modalSubtitle}>
              Le texte OCR sera enregistré après confirmation.
            </Text>

            <TextInput
              value={editableOcrText}
              onChangeText={text => {
                setEditableOcrText(text);
                setOcrWasEdited(true);
              }}
              multiline
              style={styles.ocrInput}
              placeholder="Texte OCR extrait..."
              placeholderTextColor="#94a3b8"
            />

            {pendingAttachment ? (
              <View style={styles.classificationBox}>
                <Text style={styles.classificationTitle}>
                  Classification proposée
                </Text>

                <Text style={styles.classificationText}>
                  Catégorie:{' '}
                  {pendingAttachment.preview.classification
                    .suggestedCategorieName || 'Non détectée'}
                </Text>

                <Text style={styles.classificationText}>
                  Score:{' '}
                  {pendingAttachment.preview.classification.scoreConfiance}%
                </Text>
              </View>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButtonFlex}
                onPress={() => setOcrModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmOcrUpload}
                disabled={isOcrLoading}
              >
                <Text style={styles.modalConfirmText}>
                  {isOcrLoading ? '...' : 'Confirmer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const SectionCard = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <View style={styles.sectionCard}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {children}
    </View>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const ActionButton = ({
  label,
  color,
  onPress,
}: {
  label: string;
  color: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.actionIcon}>⌁</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const item = getStatusStyle(status);

  return (
    <View style={[styles.statusBadge, { backgroundColor: item.bg }]}>
      <Text style={[styles.statusText, { color: item.color }]}>
        {item.label}
      </Text>
    </View>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'ATraiter':
      return {
        label: 'En attente',
        bg: '#fef3c7',
        color: '#d97706',
      };

    case 'EnTraitement':
      return {
        label: 'En traitement',
        bg: '#dbeafe',
        color: '#2563eb',
      };

    case 'Traite':
      return {
        label: 'Traité',
        bg: '#dcfce7',
        color: '#16a34a',
      };

    case 'Recu':
      return {
        label: 'Reçu',
        bg: '#dcfce7',
        color: '#16a34a',
      };

    case 'Envoye':
      return {
        label: 'Envoyé',
        bg: '#dcfce7',
        color: '#16a34a',
      };

    case 'Archive':
      return {
        label: 'Archivé',
        bg: '#e2e8f0',
        color: '#475569',
      };

    case 'Pret':
      return {
        label: 'Prêt',
        bg: '#ede9fe',
        color: '#7c3aed',
      };

    default:
      return {
        label: status,
        bg: '#e2e8f0',
        color: '#475569',
      };
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  centerContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  topBar: {
    height: 74,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    marginRight: 10,
  },

  backText: {
    fontSize: 38,
    color: '#334155',
  },

  topBarText: {
    flex: 1,
  },

  screenTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },

  screenReference: {
    marginTop: 2,
    color: '#64748b',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  heroCard: {
    backgroundColor: '#1e56f5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  heroCardSortant: {
    backgroundColor: '#4f35eb',
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },

  heroLabel: {
    color: '#dce7ff',
    fontWeight: '800',
  },

  heroReference: {
    marginTop: 7,
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 21,
  },

  heroSeparator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: 18,
  },

  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  heroMetaText: {
    color: '#ffffff',
    fontWeight: '800',
    flex: 1,
  },

  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  sectionTitle: {
    color: '#94a3b8',
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  sectionLabel: {
    color: '#94a3b8',
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },

  mainValue: {
    color: '#07162e',
    fontSize: 17,
    fontWeight: '900',
  },

  separator: {
    height: 1,
    backgroundColor: '#e5eaf2',
    marginVertical: 16,
  },

  description: {
    color: '#334155',
    lineHeight: 24,
    fontSize: 15,
  },

  ocrHint: {
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 12,
  },

  ocrCompareContainer: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'stretch',
    flexWrap: 'wrap',
  },

  ocrCompareBox: {
    flex: 1,
    minWidth: 280,
  },

  ocrCompareTitle: {
    color: '#94a3b8',
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  ocrImage: {
    width: '100%',
    minHeight: 360,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5eaf2',
  },

  emptyImageBox: {
    minHeight: 360,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5eaf2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  emptyImageText: {
    color: '#94a3b8',
    fontWeight: '800',
    textAlign: 'center',
  },

  ocrBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5eaf2',
    borderRadius: 16,
    padding: 16,
    minHeight: 360,
  },

  ocrText: {
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 24,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 13,
    fontWeight: '900',
  },

  statusSelector: {
    height: 54,
    borderWidth: 1,
    borderColor: '#d9e2f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  chevron: {
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: '900',
  },

  actionsTitle: {
    color: '#94a3b8',
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 2,
  },

  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },

  actionButton: {
    width: 86,
    height: 70,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 10,
  },

  actionIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },

  actionLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#1455ff',
    fontWeight: '900',
    fontSize: 16,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    color: '#07162e',
    fontSize: 17,
    fontWeight: '900',
  },

  userRole: {
    color: '#64748b',
    marginTop: 3,
  },

  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5eaf2',
    paddingVertical: 10,
  },

  infoLabel: {
    color: '#94a3b8',
    fontWeight: '800',
    marginBottom: 4,
  },

  infoValue: {
    color: '#0f172a',
    fontWeight: '700',
  },

  errorText: {
    color: '#dc2626',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },

  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },

  retryText: {
    color: '#ffffff',
    fontWeight: '900',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    maxHeight: '85%',
  },

  modalTitle: {
    fontSize: 20,
    color: '#0f172a',
    fontWeight: '900',
    marginBottom: 6,
  },

  modalSubtitle: {
    color: '#64748b',
    marginBottom: 14,
    lineHeight: 20,
  },

  modalLabel: {
    color: '#334155',
    fontWeight: '900',
    marginBottom: 8,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#dbe3ef',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#0f172a',
    marginBottom: 12,
  },

  modalTextArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  lookupText: {
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 8,
  },

  modalError: {
    color: '#dc2626',
    fontWeight: '800',
    marginBottom: 10,
  },

  selectedUserText: {
    color: '#16a34a',
    fontWeight: '900',
    marginBottom: 12,
  },

  suggestionsBox: {
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
    backgroundColor: '#ffffff',
  },

  suggestionEmail: {
    color: '#0f172a',
    fontWeight: '900',
  },

  suggestionName: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 3,
  },

  suggestionChoose: {
    color: '#2563eb',
    fontWeight: '900',
    fontSize: 12,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  modalCancelButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },

  modalCancelButtonFlex: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalCancelText: {
    color: '#475569',
    fontWeight: '900',
  },

  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalConfirmText: {
    color: '#ffffff',
    fontWeight: '900',
  },

  modalCloseButton: {
    marginTop: 10,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalCloseText: {
    color: '#ffffff',
    fontWeight: '900',
  },

  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },

  statusOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },

  statusOptionLabel: {
    flex: 1,
    marginLeft: 10,
    color: '#0f172a',
    fontWeight: '800',
  },

  statusCheck: {
    color: '#2563eb',
    fontWeight: '900',
    fontSize: 18,
  },

  ocrInput: {
    minHeight: 170,
    borderWidth: 1,
    borderColor: '#dbe3ef',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    color: '#0f172a',
    textAlignVertical: 'top',
    marginBottom: 14,
  },

  classificationBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 12,
  },

  classificationTitle: {
    color: '#0f172a',
    fontWeight: '900',
    marginBottom: 6,
  },

  classificationText: {
    color: '#475569',
    fontWeight: '700',
    marginTop: 3,
  },

  historyList: {
    maxHeight: 420,
    marginTop: 10,
  },

  historyItem: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5eaf2',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },

  historyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  historyArrow: {
    color: '#94a3b8',
    fontWeight: '900',
  },

  historyComment: {
    color: '#334155',
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 8,
  },

  historyMeta: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },

  emptyHistory: {
    color: '#64748b',
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 20,
  },
});