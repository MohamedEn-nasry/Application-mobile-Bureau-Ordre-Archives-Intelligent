import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, FlatList, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { FAKE_COURRIERS, CourrierItem } from '../../data/fakeData';

const TABS = [
  { key: 'Entrant', label: 'Entrant' },
  { key: 'Sortant', label: 'Sortant' },
  { key: 'Tous', label: 'Tous' },
];

const STATUS_FILTERS = ['Tous', 'En attente', 'Traité', 'Archivé'];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'En attente': { bg: '#FEF3C7', text: '#D97706' },
  'Traité':     { bg: '#D1FAE5', text: '#059669' },
  'Archivé':    { bg: '#F1F5F9', text: '#475569' },
};

const CAT_COLORS: Record<string, string> = {
  'Administratif':      '#3B82F6',
  'Financier':          '#7C3AED',
  'Plaintes':           '#DC2626',
  'Ressources Humaines':'#0891B2',
};

interface Props {
  navigation: any;
}

export function MailOverviewScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'Entrant' | 'Sortant' | 'Tous'>('Entrant');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('Tous');

  const filtered = useMemo(() => {
    return FAKE_COURRIERS.filter(c => {
      const matchTab = activeTab === 'Tous' || c.type === activeTab;
      const matchStatus = activeStatus === 'Tous' || c.statut === activeStatus;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || 
        c.reference.toLowerCase().includes(q) ||
        c.expediteur.toLowerCase().includes(q) ||
        c.objet.toLowerCase().includes(q);
      return matchTab && matchStatus && matchSearch;
    });
  }, [activeTab, searchQuery, activeStatus]);

  const incomingCount = FAKE_COURRIERS.filter(c => c.type === 'Entrant').length;

  const renderItem = ({ item }: { item: CourrierItem }) => {
    const statusStyle = STATUS_STYLE[item.statut] || STATUS_STYLE['En attente'];
    const catColor = CAT_COLORS[item.categorie] || '#64748B';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('IncomingMailDetail', { courrier: item })}
      >
        <View style={styles.cardInner}>
          {/* Left icon */}
          <View style={[styles.typeIcon, { backgroundColor: item.type === 'Entrant' ? '#EFF6FF' : '#EEF2FF' }]}>
            <Feather
              name={item.type === 'Entrant' ? 'arrow-down-left' : 'arrow-up-right'}
              size={16}
              color={item.type === 'Entrant' ? '#2563EB' : '#4F46E5'}
            />
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <View style={styles.cardTopRow}>
              <Text style={styles.refText}>{item.reference}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.statut}</Text>
              </View>
            </View>

            <Text style={styles.senderText} numberOfLines={1}>{item.expediteur}</Text>
            <Text style={styles.subjectText} numberOfLines={1}>{item.objet}</Text>

            <View style={styles.cardFooter}>
              <View style={[styles.catBadge, { backgroundColor: catColor + '20' }]}>
                <Text style={[styles.catText, { color: catColor }]}>{item.categorie}</Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateText}>{item.date}</Text>
                <Feather name="chevron-right" size={12} color="#94A3B8" />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {tab.key === 'Entrant' && (
                <View style={[styles.tabBadge, { backgroundColor: isActive ? '#2563EB' : '#CBD5E1' }]}>
                  <Text style={styles.tabBadgeText}>{incomingCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Référence, expéditeur, objet..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Status Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {STATUS_FILTERS.map(f => {
            const isActive = activeStatus === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveStatus(f)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>{filtered.length} résultat(s)</Text>
        <TouchableOpacity>
          <Text style={styles.sortText}>Trier par date ↓</Text>
        </TouchableOpacity>
      </View>

      {/* Mail List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>Aucun courrier trouvé</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Tabs
  tabsContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 6, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#2563EB' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#94A3B8' },
  tabTextActive: { color: '#2563EB' },
  tabBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  tabBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },

  // Search
  searchContainer: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, gap: 8, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 13, color: '#334155', padding: 0 },
  filtersScroll: { gap: 8, paddingRight: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  filterChipTextActive: { color: '#FFFFFF' },

  // Results row
  resultsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  resultsText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  sortText: { fontSize: 12, color: '#2563EB', fontWeight: '600' },

  // List
  list: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30, gap: 10 },

  // Card
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardInner: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 12 },
  typeIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  refText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600' },
  senderText: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  subjectText: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catText: { fontSize: 11, fontWeight: '600' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 11, color: '#94A3B8' },

  // Empty
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 14, color: '#94A3B8', fontWeight: '500' },
});
