import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCourrierDetails } from '../hooks/useCourrierDetail';
import { useCategories } from '../hooks/useCategories';
import { useArchiveCourrier } from '../hooks/useArchiveCourrier';
import { useUpdateCourrierStatus } from '../hooks/useUpdateCourrierStatus';

import { Roles, Role } from '../../../../shared/constants/roles';
import { Permissions } from '../../../../shared/constants/permissions';
import { can } from '../../../../shared/authorization/can';
import { Routes } from '../../../../shared/constants/routes';

export const CourrierDetailScreen = ({ route, navigation }: any) => {
  const { id } = route.params;

  const currentRole = (route?.params?.roleName ?? Roles.ADMIN) as Role;
  const currentUserId = Number(route?.params?.userId ?? 0);

  const canUpdateCourrier = can(currentRole, Permissions.COURRIER_UPDATE);
  const canArchiveCourrier = can(currentRole, Permissions.COURRIER_ARCHIVE);
  const canChangeStatus = can(currentRole, Permissions.COURRIER_CHANGE_STATUS);

  const isReadOnly =
    !canUpdateCourrier &&
    !canArchiveCourrier &&
    !canChangeStatus;

  const {
    courrier,
    isLoading,
    error,
    refetch,
  } = useCourrierDetails(Number(id));

  const {
    archiveCourrier,
    isLoading: isArchiving,
  } = useArchiveCourrier();

  const {
    updateStatus,
    isLoading: isUpdatingStatus,
  } = useUpdateCourrierStatus();

  const { categories } = useCategories();

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
    }
  };

  const handleChangeStatus = async (statut: string) => {
    if (!courrier) return;

    const success = await updateStatus(Number(courrier.id), statut);

    if (success) {
      await refetch();
    }
  };

  const openStatusDialog = () => {
    Alert.alert(
      'Changer le statut',
      'Choisir le nouveau statut',
      [
        {
          text: 'En attente',
          onPress: () => handleChangeStatus('ATraiter'),
        },
        {
          text: 'En traitement',
          onPress: () => handleChangeStatus('EnTraitement'),
        },
        {
          text: 'Traité',
          onPress: () => handleChangeStatus('Traite'),
        },
        {
          text: 'Archivé',
          onPress: () => handleChangeStatus('Archive'),
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
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

  const isEntrant = courrier.IsEntrant;
  const screenTitle = isEntrant ? 'Courrier Entrant' : 'Courrier Sortant';
  const categorieName = getCategorieName(courrier.CategorieId);

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

        {courrier.TexteOcr ? (
          <SectionCard title="Texte OCR extrait">
            <View style={styles.ocrBox}>
              <Text style={styles.ocrText}>{courrier.TexteOcr}</Text>
            </View>
          </SectionCard>
        ) : null}

        <SectionCard title={isEntrant ? 'Assigné à' : 'Émis par'}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {isEntrant ? 'A' : 'U'}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {isEntrant
                  ? courrier.AssigneA
                    ? `Utilisateur #${courrier.AssigneA}`
                    : 'Non assigné'
                  : `Utilisateur #${courrier.AuteurId}`}
              </Text>

              <Text style={styles.userRole}>
                {isEntrant ? 'Agent assigné' : 'Auteur du courrier'}
              </Text>
            </View>
          </View>
        </SectionCard>

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
                  label="Réassigner"
                  color="#4f46e5"
                  onPress={() => {}}
                />
              ) : null}

              {canUpdateCourrier ? (
                <ActionButton
                  label="OCR"
                  color="#8b22f4"
                  onPress={() => {}}
                />
              ) : null}

              <ActionButton
                label="Historique"
                color="#009688"
                onPress={() => {}}
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

  ocrBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5eaf2',
    borderRadius: 16,
    padding: 16,
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
});