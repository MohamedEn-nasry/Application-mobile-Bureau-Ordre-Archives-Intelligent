import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  CourrierTab,
  useCourriersList,
} from '../hooks/useCourriersList';

import { Courrier } from '../../domain/entities/Courrier';
import { Routes } from '../../../../shared/constants/routes';

export const CourrierOverviewScreen = ({ navigation }: any) => {
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

  const tabs: CourrierTab[] = ['Entrant', 'Sortant', 'Tous'];

  const handleOpenDetails = (courrier: Courrier) => {
    navigation.navigate(Routes.Admin.CourrierDetail, {
      id: Number(courrier.id),
    });
  };

  const renderItem = ({ item }: { item: Courrier }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => handleOpenDetails(item)}
    >
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>↙</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={styles.reference} numberOfLines={1}>
            {item.Reference}
          </Text>

          <StatusBadge status={item.Statut} />
        </View>

        <Text style={styles.sender} numberOfLines={1}>
          {item.PersonName}
        </Text>

        <Text style={styles.subject} numberOfLines={1}>
          {item.Objet}
        </Text>

        <View style={styles.cardBottom}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>
              {item.CategorieLabel}
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
       

        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>♢</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
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
              {tab === 'Entrant' ? '  4' : ''}
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

        <TouchableOpacity>
          <Text style={styles.filterIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        {['Date', 'Statut', 'Catégorie', 'Expéditeur'].map(item => (
          <TouchableOpacity key={item} style={styles.filterChip}>
            <Text style={styles.filterChipText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {courriers.length} résultats
        </Text>

        <TouchableOpacity>
          <Text style={styles.sortText}>Trier par date ↓</Text>
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
          data={courriers}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

<TouchableOpacity
  activeOpacity={0.85}
  style={styles.fabButton}
  onPress={() => navigation.navigate('CreateUpdateCourrier')}
>
  <Text style={styles.fabIcon}>+</Text>
</TouchableOpacity>
    </SafeAreaView>
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
    fabButton: {
        position: 'absolute',
        right: 22,
        bottom: 28,
        width: 60,
        height: 60,
        borderRadius: 30,
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

  notificationIcon: {
    fontSize: 24,
    color: '#334155',
  },

  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 1,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationBadgeText: {
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
  },

  filterChipText: {
    color: '#334155',
    fontWeight: '700',
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
    paddingBottom: 120,
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
});