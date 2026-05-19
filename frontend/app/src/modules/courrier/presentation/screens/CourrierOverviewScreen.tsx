import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import {
  CourrierTab,
  useCourriersList,
} from '../hooks/useCourriersList';

import { Courrier } from '../../domain/entities/Courrier';
import { Routes } from '../../../../shared/constants/routes';
import { BottomNav } from '../../../../shared/presentation/components/BottomNav';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';
import { useCategories } from '../hooks/useCategories';
import { can } from '../../../../shared/authorization/can';
import { Permissions } from '../../../../shared/constants/permissions';
import { Role, Roles } from '../../../../shared/constants/roles';
import { useUnreadNotificationsCount } from '../../../notifications/presentation/hooks/useUnreadCount';
import { useAuthSession } from '../../../auth/presentation/hooks/useAuthSession';
import { useThemeStyles } from '../../../../application/providers/ThemeProvider';

type FilterModalType = 'statut' | 'categorie' | 'expediteur' | null;
type SortDirection = 'desc' | 'asc';

export const CourrierOverviewScreen = ({ navigation, route }: any) => {
  const styles = useThemeStyles(localStyles);
  const {
    courriers,
    isLoading,
    error,
    selectedTab,
    setSelectedTab,
    searchQuery,
    setSearchQuery,
    refetch,
  } = useCourriersList();

  const { categories } = useCategories();
  const { session } = useAuthSession();

  const currentRole = (route?.params?.roleName ?? session?.role ?? Roles.ADMIN) as Role;
  const currentUserId = Number(route?.params?.userId ?? session?.userId ?? 0);

  const canCreateCourrier = can(currentRole, Permissions.COURRIER_CREATE);
  const viewOwnOnly = can(currentRole, Permissions.COURRIER_VIEW_OWN);

  const {
    unreadCount,
    refetchUnreadCount,
  } = useUnreadNotificationsCount();

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchUnreadCount();
    }, [refetch, refetchUnreadCount])
  );

  const [filterModal, setFilterModal] = useState<FilterModalType>(null);
  const [selectedStatut, setSelectedStatut] = useState<string | null>(null);
  const [selectedCategorieId, setSelectedCategorieId] = useState<number | null>(null);
  const [selectedExpediteur, setSelectedExpediteur] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const tabs: CourrierTab[] = ['Entrant', 'Sortant', 'Tous'];

  const roleCourriers = useMemo(() => {
    if (!viewOwnOnly) {
      return courriers;
    }

    return courriers.filter(
      item =>
        item.AuteurId === currentUserId ||
        item.AssigneA === currentUserId
    );
  }, [courriers, viewOwnOnly, currentUserId]);

  const getCategorieName = (categorieId: number | null) => {
    if (!categorieId) return 'Catégorie';

    const categorie = categories.find(
      item => Number(item.id) === Number(categorieId)
    );

    return categorie?.Nom || `Catégorie ${categorieId}`;
  };

  const statusOptions = useMemo(() => {
    return Array.from(
      new Set(roleCourriers.map(item => item.Statut).filter(Boolean))
    );
  }, [roleCourriers]);

  const expediteurOptions = useMemo(() => {
    const values = roleCourriers
      .map(item => item.Expediteur)
      .filter((value): value is string => !!value && value.trim().length > 0);

    return Array.from(new Set(values));
  }, [roleCourriers]);

  const displayedCourriers = useMemo(() => {
    let result = [...roleCourriers];

    if (selectedStatut) {
      result = result.filter(item => item.Statut === selectedStatut);
    }

    if (selectedCategorieId !== null) {
      result = result.filter(
        item => Number(item.CategorieId) === Number(selectedCategorieId)
      );
    }

    if (selectedExpediteur) {
      result = result.filter(
        item =>
          item.Expediteur?.toLowerCase() === selectedExpediteur.toLowerCase()
      );
    }

    result.sort((a, b) => {
      const aTime = a.DateCourrier.getTime();
      const bTime = b.DateCourrier.getTime();

      return sortDirection === 'desc' ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [
    roleCourriers,
    selectedStatut,
    selectedCategorieId,
    selectedExpediteur,
    sortDirection,
  ]);

  const hasActiveFilters =
    selectedStatut !== null ||
    selectedCategorieId !== null ||
    selectedExpediteur !== null ||
    sortDirection !== 'desc';

  const clearFilters = () => {
    setSelectedStatut(null);
    setSelectedCategorieId(null);
    setSelectedExpediteur(null);
    setSortDirection('desc');
  };

  const handleOpenDetails = (courrier: Courrier) => {
    const detailRoute =
      currentRole === Roles.AGENT || currentRole === Roles.SUPER_AGENT
        ? ((Routes.Agent as any)?.CourrierDetail ?? Routes.Admin.CourrierDetail)
        : Routes.Admin.CourrierDetail;

    navigation.navigate(detailRoute, {
      id: Number(courrier.id),
      roleName: currentRole,
      userId: currentUserId,
    });
  };

  const handleOpenNotifications = () => {
    const notificationsRoute =
      currentRole === Roles.AGENT || currentRole === Roles.SUPER_AGENT
        ? ((Routes.Agent as any)?.Notifications ?? Routes.Admin.Notifications)
        : Routes.Admin.Notifications;

    navigation.navigate(notificationsRoute, {
      roleName: currentRole,
      userId: currentUserId,
    });
  };

  const handleCreateCourrier = () => {
    const createRoute =
      (Routes.Agent as any)?.CreateUpdateCourrier ?? 'CreateUpdateCourrier';

    navigation.navigate(createRoute, {
      roleName: currentRole,
      userId: currentUserId,
    });
  };

  const renderItem = ({ item }: { item: Courrier }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => handleOpenDetails(item)}
    >
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>
          {item.Type === 'Entrant' ? '↙' : '↗'}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={styles.reference} numberOfLines={1}>
            {item.Reference}
          </Text>

          <StatusBadge status={item.Statut} />
        </View>

        <Text style={styles.sender} numberOfLines={1}>
          {item.PersonName || 'Non défini'}
        </Text>

        <Text style={styles.subject} numberOfLines={1}>
          {item.Objet}
        </Text>

        <View style={styles.cardBottom}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText} numberOfLines={1}>
              {getCategorieName(item.CategorieId)}
            </Text>
          </View>

          <Text style={styles.date}>
            {formatDate(item.DateCourrier)} ›
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>

        <View style={styles.headerTextBox}>
          <Text style={styles.title}>Courrier</Text>
          <Text style={styles.subtitle}>Vue d&apos;ensemble</Text>
        </View>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleOpenNotifications}
        >
          <Feather name="bell" size={22} color="#334155" />

          {unreadCount > 0 ? (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Référence, expéditeur, objet..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />

        <TouchableOpacity onPress={clearFilters}>
          <Text
            style={[
              styles.filterIcon,
              hasActiveFilters && styles.filterIconActive,
            ]}
          >
            ≡
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            sortDirection !== 'desc' && styles.filterChipActive,
          ]}
          onPress={() =>
            setSortDirection(current => (current === 'desc' ? 'asc' : 'desc'))
          }
        >
          <Text
            style={[
              styles.filterChipText,
              sortDirection !== 'desc' && styles.filterChipTextActive,
            ]}
          >
            Date {sortDirection === 'desc' ? '↓' : '↑'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            !!selectedStatut && styles.filterChipActive,
          ]}
          onPress={() => setFilterModal('statut')}
        >
          <Text
            style={[
              styles.filterChipText,
              !!selectedStatut && styles.filterChipTextActive,
            ]}
          >
            {selectedStatut ? getStatusLabel(selectedStatut) : 'Statut'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedCategorieId !== null && styles.filterChipActive,
          ]}
          onPress={() => setFilterModal('categorie')}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedCategorieId !== null && styles.filterChipTextActive,
            ]}
            numberOfLines={1}
          >
            {selectedCategorieId !== null
              ? getCategorieName(selectedCategorieId)
              : 'Catégorie'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            !!selectedExpediteur && styles.filterChipActive,
          ]}
          onPress={() => setFilterModal('expediteur')}
        >
          <Text
            style={[
              styles.filterChipText,
              !!selectedExpediteur && styles.filterChipTextActive,
            ]}
            numberOfLines={1}
          >
            {selectedExpediteur || 'Expéditeur'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {displayedCourriers.length} résultats
        </Text>

        <TouchableOpacity
          onPress={() =>
            setSortDirection(current => (current === 'desc' ? 'asc' : 'desc'))
          }
        >
          <Text style={styles.sortText}>
            Trier par date {sortDirection === 'desc' ? '↓' : '↑'}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={displayedCourriers}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Aucun courrier trouvé.</Text>
            </View>
          }
        />
      )}

      <FilterModal
        visible={filterModal !== null}
        title={
          filterModal === 'statut'
            ? 'Choisir un statut'
            : filterModal === 'categorie'
              ? 'Choisir une catégorie'
              : 'Choisir un expéditeur'
        }
        onClose={() => setFilterModal(null)}
      >
        {filterModal === 'statut' ? (
          <>
            <FilterOption
              label="Tous les statuts"
              active={!selectedStatut}
              onPress={() => {
                setSelectedStatut(null);
                setFilterModal(null);
              }}
            />

            {statusOptions.map(status => (
              <FilterOption
                key={status}
                label={getStatusLabel(status)}
                active={selectedStatut === status}
                onPress={() => {
                  setSelectedStatut(status);
                  setFilterModal(null);
                }}
              />
            ))}
          </>
        ) : null}

        {filterModal === 'categorie' ? (
          <>
            <FilterOption
              label="Toutes les catégories"
              active={selectedCategorieId === null}
              onPress={() => {
                setSelectedCategorieId(null);
                setFilterModal(null);
              }}
            />

            {categories.map(categorie => (
              <FilterOption
                key={categorie.id}
                label={categorie.Nom}
                description={categorie.Description || undefined}
                active={Number(categorie.id) === Number(selectedCategorieId)}
                onPress={() => {
                  setSelectedCategorieId(Number(categorie.id));
                  setFilterModal(null);
                }}
              />
            ))}
          </>
        ) : null}

        {filterModal === 'expediteur' ? (
          <>
            <FilterOption
              label="Tous les expéditeurs"
              active={!selectedExpediteur}
              onPress={() => {
                setSelectedExpediteur(null);
                setFilterModal(null);
              }}
            />

            {expediteurOptions.map(expediteur => (
              <FilterOption
                key={expediteur}
                label={expediteur}
                active={selectedExpediteur === expediteur}
                onPress={() => {
                  setSelectedExpediteur(expediteur);
                  setFilterModal(null);
                }}
              />
            ))}
          </>
        ) : null}
      </FilterModal>

      {canCreateCourrier && (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.fabButton}
          onPress={handleCreateCourrier}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}

      {currentRole === Roles.AGENT || currentRole === Roles.SUPER_AGENT ? (
        <AgentBottomNav navigation={navigation} roleName={currentRole} userId={currentUserId} />
      ) : (
        <BottomNav navigation={navigation} activeRoute="Courrier" />
      )}
    </SafeAreaView>
  );
};

const FilterModal = ({
  visible,
  title,
  children,
  onClose,
}: {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const styles = useThemeStyles(localStyles);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>

          <ScrollView style={styles.modalList}>
            {children}
          </ScrollView>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const FilterOption = ({
  label,
  description,
  active,
  onPress,
}: {
  label: string;
  description?: string;
  active: boolean;
  onPress: () => void;
}) => {
  const styles = useThemeStyles(localStyles);
  return (
    <TouchableOpacity
      style={[
        styles.filterOption,
        active && styles.filterOptionActive,
      ]}
      onPress={onPress}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.filterOptionLabel}>{label}</Text>

        {description ? (
          <Text style={styles.filterOptionDescription}>{description}</Text>
        ) : null}
      </View>

      {active ? <Text style={styles.checkMark}>✓</Text> : null}
    </TouchableOpacity>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = useThemeStyles(localStyles);
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
      return { label: 'En attente', bg: '#fef3c7', color: '#d97706' };
    case 'EnTraitement':
      return { label: 'En traitement', bg: '#dbeafe', color: '#2563eb' };
    case 'Traite':
      return { label: 'Traité', bg: '#dcfce7', color: '#16a34a' };
    case 'Recu':
      return { label: 'Reçu', bg: '#dcfce7', color: '#16a34a' };
    case 'Envoye':
      return { label: 'Envoyé', bg: '#dcfce7', color: '#16a34a' };
    case 'Archive':
      return { label: 'Archivé', bg: '#e2e8f0', color: '#475569' };
    case 'Pret':
      return { label: 'Prêt', bg: '#ede9fe', color: '#7c3aed' };
    default:
      return { label: status, bg: '#e2e8f0', color: '#475569' };
  }
};

const getStatusLabel = (status: string) => {
  return getStatusStyle(status).label;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },

  menuButton: {
    marginRight: 18,
  },

  menuText: {
    fontSize: 26,
    color: '#334155',
  },

  headerTextBox: {
    flex: 1,
  },

  title: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0f172a',
  },

  subtitle: {
    marginTop: 2,
    fontSize: 14,
    color: '#64748b',
  },

  notificationButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 1,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },

  tabsContainer: {
    height: 52,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  tabButtonActive: {
    borderBottomColor: '#1455ff',
  },

  tabText: {
    color: '#94a3b8',
    fontWeight: '900',
  },

  tabTextActive: {
    color: '#1455ff',
  },

  searchBox: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 46,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d9e2f0',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  searchIcon: {
    fontSize: 22,
    color: '#94a3b8',
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },

  filterIcon: {
    fontSize: 22,
    color: '#1455ff',
    fontWeight: '900',
  },

  filterIconActive: {
    color: '#dc2626',
  },

  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 14,
  },

  filterChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9e2f0',
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginRight: 9,
    maxWidth: 130,
  },

  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  filterChipText: {
    color: '#334155',
    fontWeight: '700',
  },

  filterChipTextActive: {
    color: '#ffffff',
  },

  resultsRow: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  resultsText: {
    color: '#64748b',
    fontWeight: '900',
  },

  sortText: {
    color: '#1455ff',
    fontWeight: '900',
  },

  loader: {
    marginTop: 40,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 130,
  },

  emptyBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  emptyText: {
    color: '#94a3b8',
    fontWeight: '800',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  cardIconText: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: '800',
  },

  cardContent: {
    flex: 1,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  reference: {
    flex: 1,
    fontSize: 16,
    color: '#1455ff',
    fontWeight: '900',
  },

  sender: {
    marginTop: 8,
    fontSize: 16,
    color: '#07162e',
    fontWeight: '900',
  },

  subject: {
    marginTop: 5,
    fontSize: 15,
    color: '#40516d',
  },

  cardBottom: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  categoryChip: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    maxWidth: 130,
  },

  categoryText: {
    color: '#0284c7',
    fontWeight: '800',
  },

  date: {
    color: '#8b9bb7',
    fontWeight: '700',
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

  errorBox: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    padding: 14,
  },

  errorText: {
    color: '#dc2626',
    fontWeight: '700',
  },

  retryButton: {
    marginTop: 10,
  },

  retryText: {
    color: '#2563eb',
    fontWeight: '900',
  },

  fabButton: {
    position: 'absolute',
    right: 22,
    bottom: 92,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },

  fabIcon: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '700',
    marginTop: -3,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    maxHeight: '75%',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 14,
  },

  modalList: {
    maxHeight: 380,
  },

  filterOption: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  filterOptionActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },

  filterOptionLabel: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
  },

  filterOptionDescription: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 4,
  },

  checkMark: {
    color: '#2563eb',
    fontSize: 20,
    fontWeight: '900',
    marginLeft: 10,
  },

  modalCloseButton: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalCloseText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
  },
});