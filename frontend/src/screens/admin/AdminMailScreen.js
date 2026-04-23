// src/screens/admin/AdminMailScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, SearchBar, FilterChips, MailCard, EmptyState, IconButton } from '../../components';
import { Colors, Spacing } from '../../theme';
import { INCOMING_MAIL, OUTGOING_MAIL } from '../../data/mockData';

const TABS = ['Entrant', 'Sortant', 'Tous'];
const SORT_OPTIONS = ['Date ↓', 'Date ↑', 'Référence', 'Statut'];

export default function AdminMailScreen({ navigation }) {
  const [tab, setTab] = useState('Entrant');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [sort, setSort] = useState('Date ↓');
  const [showSort, setShowSort] = useState(false);

  const rawData = useMemo(() => {
    if (tab === 'Entrant') return INCOMING_MAIL;
    if (tab === 'Sortant') return OUTGOING_MAIL;
    return [...INCOMING_MAIL, ...OUTGOING_MAIL];
  }, [tab]);

  const filtered = useMemo(() => {
    let d = rawData;
    if (search) {
      const q = search.toLowerCase();
      d = d.filter((m) => m.subject.toLowerCase().includes(q) || m.reference.toLowerCase().includes(q) || (m.sender || m.recipient || '').toLowerCase().includes(q));
    }
    if (filterStatus !== 'Tous') d = d.filter((m) => m.status === filterStatus);
    if (sort === 'Date ↓') d = [...d].sort((a, b) => (b.dateReceived || b.dateSent) > (a.dateReceived || a.dateSent) ? 1 : -1);
    if (sort === 'Date ↑') d = [...d].sort((a, b) => (a.dateReceived || a.dateSent) > (b.dateReceived || b.dateSent) ? 1 : -1);
    if (sort === 'Référence') d = [...d].sort((a, b) => a.reference.localeCompare(b.reference));
    if (sort === 'Statut') d = [...d].sort((a, b) => a.status.localeCompare(b.status));
    return d;
  }, [rawData, search, filterStatus, sort]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Aperçu du courrier"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSort(!showSort)}>
            <Text style={styles.sortBtnText}>⇅ {sort}</Text>
          </TouchableOpacity>
        }
      />

      {/* Sort dropdown */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map((o) => (
            <TouchableOpacity key={o} style={[styles.sortOption, sort === o && styles.sortOptionActive]} onPress={() => { setSort(o); setShowSort(false); }}>
              <Text style={[styles.sortOptionText, sort === o && { color: Colors.blue800, fontWeight: '700' }]}>{o}</Text>
              {sort === o && <Text style={{ color: Colors.blue600, fontSize: 14 }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            {tab === t && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}
      <View style={styles.filtersArea}>
        <SearchBar placeholder="Réf., expéditeur, sujet…" value={search} onChangeText={setSearch} />
        <View style={{ height: Spacing.sm }} />
        <FilterChips
          options={['Tous', 'Pending', 'Processed', 'Urgent', 'Archived', 'Sent', 'Draft']}
          selected={filterStatus}
          onSelect={setFilterStatus}
        />
        <View style={styles.resultCount}>
          <Text style={styles.resultCountText}>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MailCard
            item={item}
            type={item.sender ? 'incoming' : 'outgoing'}
            onPress={() => navigation.navigate(item.sender ? 'AdminMailDetail' : 'AdminOutgoingDetail', { mail: item })}
          />
        )}
        ListEmptyComponent={<EmptyState icon="📭" title="Aucun courrier trouvé" subtitle="Modifiez vos filtres ou termes de recherche" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  sortBtn: { backgroundColor: Colors.blue50, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 0.5, borderColor: Colors.blue100 },
  sortBtnText: { fontSize: 11, fontWeight: '700', color: Colors.blue700 },
  sortDropdown: { position: 'absolute', top: 60, right: Spacing.lg, backgroundColor: Colors.surface, borderRadius: 10, borderWidth: 0.5, borderColor: Colors.border, zIndex: 100, width: 160, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 8 } },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight },
  sortOptionActive: { backgroundColor: Colors.blue50 },
  sortOptionText: { fontSize: 13, color: Colors.gray700 },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', position: 'relative' },
  tabActive: {},
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.gray400 },
  tabTextActive: { color: Colors.blue800, fontWeight: '800' },
  tabIndicator: { position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 2.5, backgroundColor: Colors.blue800, borderRadius: 2 },
  filtersArea: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  resultCount: { paddingTop: 6 },
  resultCountText: { fontSize: 11, color: Colors.gray400, fontWeight: '600' },
  list: { padding: Spacing.lg, paddingBottom: 100 },
});
