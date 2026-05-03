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
import { useArchiveCourrier } from '../hooks/useArchiveCourrier';
import { useUpdateCourrierStatus } from '../hooks/useUpdateCourrierStatus';

export const CourrierDetailScreen = ({ route, navigation }: any) => {
  const { id } = route.params;

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

        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isEntrant = courrier.IsEntrant;
  const screenTitle = isEntrant ? 'Courrier Entrant' : 'Courrier Sortant';

  const handleArchive = async () => {
    const success = await archiveCourrier(Number(courrier.id));

    if (success) {
      await refetch();
    }
  };

  const handleConfirmReception = async () => {
    const success = await updateStatus(Number(courrier.id), 'Recu');

    if (success) {
      await refetch();
    }
  };

  const handleChangeStatus = async (statut: string) => {
    const success = await updateStatus(Number(courrier.id), statut);

    if (success) {
      await refetch();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <View>
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
            <View>
              <Text style={styles.heroLabel}>Référence</Text>
              <Text style={styles.heroReference}>
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

            <Text style={styles.heroMetaText}>
              {courrier.CategorieLabel}
            </Text>
          </View>
        </View>

        <SectionCard>
          <Text style={styles.sectionLabel}>
            {isEntrant ? 'EXPÉDITEUR' : 'DESTINATAIRE'}
          </Text>

          <Text style={styles.mainValue}>
            {isEntrant ? courrier.Expediteur : courrier.Destinataire}
          </Text>

          <View style={styles.separator} />

          <Text style={styles.sectionLabel}>OBJET</Text>

          <Text style={styles.mainValue}>
            {courrier.Objet}
          </Text>
        </SectionCard>

        <SectionCard title="Description">
          <Text style={styles.description}>
            {courrier.Description || 'Aucune description.'}
          </Text>
        </SectionCard>

        <SectionCard title={`Pièces jointes (${courrier.Attachments.length})`}>
          {courrier.Attachments.length > 0 ? (
            courrier.Attachments.map(file => (
              <AttachmentItem
                key={file.id}
                fileName={file.fileName}
                mimeType={file.mimeType}
                size={file.size}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Aucune pièce jointe.</Text>
          )}
        </SectionCard>

        {isEntrant ? (
          <>
            <SectionCard title="Texte OCR extrait">
              <View style={styles.ocrBox}>
                <Text style={styles.ocrText}>
                  {courrier.TexteOcr ||
                    '"Monsieur le Directeur, J’ai l’honneur de vous soumettre ma demande de congé exceptionnel pour une période de 6 jours ouvrables......"'}
                </Text>
              </View>
            </SectionCard>

            <SectionCard>
              <View style={styles.classificationTop}>
                <View>
                  <View style={styles.aiIconBox}>
                    <Text style={styles.aiIcon}>⌘</Text>
                  </View>

                  <Text style={styles.classificationTitle}>
                    CLASSIFICATION IA
                  </Text>

                  <Text style={styles.classificationLabel}>
                    {courrier.CategorieLabel} - Congés
                  </Text>

                  <Text style={styles.classificationSubtitle}>
                    Suggestion automatique
                  </Text>
                </View>

                <View style={styles.confidenceBox}>
                  <Text style={styles.confidenceText}>94%</Text>
                  <Text style={styles.classificationSubtitle}>
                    Confiance
                  </Text>
                </View>
              </View>

              <View style={styles.progressBackground}>
                <View style={styles.progressFill} />
              </View>
            </SectionCard>

            <SectionCard title="Changer le statut">
              <TouchableOpacity
                style={styles.statusSelector}
                onPress={() =>
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
                        text: 'Annuler',
                        style: 'cancel',
                      },
                    ]
                  )
                }
              >
                <StatusBadge status={courrier.Statut} />
                <Text style={styles.chevron}>⌄</Text>
              </TouchableOpacity>
            </SectionCard>
          </>
        ) : (
          <SectionCard title="Suivi d'envoi">
            <Timeline items={courrier.Timeline} />
          </SectionCard>
        )}

        <Text style={styles.actionsTitle}>ACTIONS</Text>

        <View style={styles.actionsRow}>
          <ActionButton
            label="Modifier"
            color="#1455ff"
            // onPress={() =>
            //   navigation.navigate('CreateUpdateCourrier', {
            //     courrier,
            //   })
            // }
          />

          <ActionButton
            label={isArchiving ? '...' : 'Archiver'}
            color="#475569"
            onPress={handleArchive}
          />

          <ActionButton
            label="Réassigner"
            color="#4f46e5"
            onPress={() => {}}
          />

          {isEntrant ? (
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

        <SectionCard title={isEntrant ? 'Assigné à' : 'Émis par'}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {isEntrant ? 'FH' : 'AB'}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {isEntrant ? 'Fatima Zohra Haddad' : 'Ahmed Benali'}
              </Text>

              <Text style={styles.userRole}>
                {isEntrant ? 'Agent — Secrétariat' : 'Administrateur'}
              </Text>
            </View>

            {isEntrant ? (
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Changer</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.validText}>✓ Validé</Text>
            )}
          </View>
        </SectionCard>

        {!isEntrant ? (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmReception}
            disabled={isUpdatingStatus}
          >
            <Text style={styles.confirmButtonText}>
              {isUpdatingStatus ? 'Traitement...' : '✓ Confirmer la réception'}
            </Text>
          </TouchableOpacity>
        ) : null}
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

const AttachmentItem = ({
  fileName,
  mimeType,
  size,
}: {
  fileName: string;
  mimeType: string;
  size: string;
}) => {
  return (
    <View style={styles.attachmentItem}>
      <View style={styles.attachmentLeft}>
        <View style={styles.attachmentIconBox}>
          <Text style={styles.attachmentIcon}>📎</Text>
        </View>

        <View style={styles.attachmentInfo}>
          <Text style={styles.attachmentName} numberOfLines={1}>
            {fileName}
          </Text>

          <Text style={styles.attachmentMeta}>
            {mimeType} • {size}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>Voir</Text>
      </TouchableOpacity>
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
      activeOpacity={0.8}
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.actionIcon}>⌁</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const Timeline = ({
  items,
}: {
  items: {
    label: string;
    date?: string;
    done: boolean;
  }[];
}) => {
  if (!items.length) {
    return <Text style={styles.emptyText}>Aucun suivi disponible.</Text>;
  }

  return (
    <View>
      {items.map((item, index) => (
        <View key={`${item.label}-${index}`} style={styles.timelineRow}>
          <View style={styles.timelineLeft}>
            <View
              style={[
                styles.timelineDot,
                {
                  backgroundColor: item.done ? '#4f46e5' : '#cbd5e1',
                },
              ]}
            />

            {index !== items.length - 1 ? (
              <View style={styles.timelineLine} />
            ) : null}
          </View>

          <View style={styles.timelineContent}>
            <Text
              style={[
                styles.timelineLabel,
                !item.done && styles.timelinePending,
              ]}
            >
              {item.label}
            </Text>

            <Text
              style={[
                styles.timelineDate,
                !item.done && styles.timelinePending,
              ]}
            >
              {item.date || 'En attente'}
            </Text>
          </View>
        </View>
      ))}
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
  },

  heroMetaText: {
    color: '#ffffff',
    fontWeight: '800',
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

  emptyText: {
    color: '#94a3b8',
    fontWeight: '600',
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

  attachmentItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  attachmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  attachmentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffe1e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  attachmentIcon: {
    fontSize: 18,
  },

  attachmentInfo: {
    flex: 1,
  },

  attachmentName: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '900',
  },

  attachmentMeta: {
    color: '#8b9bb7',
    marginTop: 3,
  },

  viewButton: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
  },

  viewButtonText: {
    color: '#1455ff',
    fontWeight: '900',
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

  classificationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  aiIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  aiIcon: {
    color: '#ffffff',
    fontWeight: '900',
  },

  classificationTitle: {
    color: '#6d28d9',
    fontWeight: '900',
    marginBottom: 22,
  },

  classificationLabel: {
    fontSize: 18,
    color: '#07162e',
    fontWeight: '900',
  },

  classificationSubtitle: {
    color: '#64748b',
    marginTop: 4,
  },

  confidenceBox: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  confidenceText: {
    color: '#16a34a',
    fontSize: 28,
    fontWeight: '900',
  },

  progressBackground: {
    height: 10,
    backgroundColor: '#e9d5ff',
    borderRadius: 999,
    marginTop: 18,
  },

  progressFill: {
    width: '94%',
    height: 10,
    backgroundColor: '#8b5cf6',
    borderRadius: 999,
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

  changeButton: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },

  changeButtonText: {
    color: '#1455ff',
    fontWeight: '900',
  },

  validText: {
    color: '#16a34a',
    fontWeight: '900',
  },

  confirmButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: '#4f35eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  confirmButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },

  timelineRow: {
    flexDirection: 'row',
    minHeight: 54,
  },

  timelineLeft: {
    width: 24,
    alignItems: 'center',
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#c7d2fe',
  },

  timelineContent: {
    flex: 1,
  },

  timelineLabel: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 15,
  },

  timelineDate: {
    color: '#64748b',
    marginTop: 3,
  },

  timelinePending: {
    color: '#b8c3d6',
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