// src/screens/lecteur/LecteurSearchScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, SearchBar, FilterChips, MailCard, EmptyState, Card } from '../../../../shared/components';
import { Colors, Spacing, Radius } from '../../../../shared/theme';
import { INCOMING_MAIL, OUTGOING_MAIL } from '../../../../data/mockData';

const ALL_MAIL = [...INCOMING_MAIL, ...OUTGOING_MAIL];
const SCOPE_OPTIONS = ['Tous', 'Entrant', 'Sortant', 'Archivé'];
const STATUS_OPTIONS = ['Tous statuts', 'Pending', 'Processed', 'Urgent', 'Archived'];

export default function LecteurSearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous statuts');
  const [recentSearches] = useState(['budget', 'formation', 'maintenance', 'rapport annuel']);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return ALL_MAIL.filter((m) => {
      const matchQuery =
        m.subject.toLowerCase().includes(q) ||
        m.reference.toLowerCase().includes(q) ||
        (m.sender || '').toLowerCase().includes(q) ||
        (m.recipient || '').toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q);
      const matchScope =
        scope === 'Tous' ||
        (scope === 'Entrant' && m.sender) ||
        (scope === 'Sortant' && m.recipient) ||
        (scope === 'Archivé' && m.status === 'Archived');
      const matchStatus =
        statusFilter === 'Tous statuts' || m.status === statusFilter;
      return matchQuery && matchScope && matchStatus;
    });
  }, [query, scope, statusFilter]);

  // Applied filters (non-default)
  const appliedFilters = [
    scope !== 'Tous' && { label: `Portée : ${scope}`, key: 'scope' },
    statusFilter !== 'Tous statuts' && { label: statusFilter, key: 'status' },
  ].filter(Boolean);

  const clearFilter = (key) => {
    if (key === 'scope') setScope('Tous');
    if (key === 'status') setStatusFilter('Tous statuts');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Recherche" onBack={() => navigation.goBack()} />

      <View style={styles.searchArea}>
        <SearchBar
          placeholder="Rechercher dans tout le courrier…"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        <View style={{ height: Spacing.sm }} />
        <FilterChips options={SCOPE_OPTIONS} selected={scope} onSelect={setScope} />
        <View style={{ height: Spacing.sm }} />
        <FilterChips options={STATUS_OPTIONS} selected={statusFilter} onSelect={setStatusFilter} />
      </View>

      {/* Applied filters row */}
      {appliedFilters.length > 0 && (
        <View style={styles.appliedRow}>
          <Text style={styles.appliedLabel}>Filtres actifs :</Text>
          {appliedFilters.map((f) => (
            <TouchableOpacity key={f.key} style={styles.appliedTag} onPress={() => clearFilter(f.key)}>
              <Text style={styles.appliedTagText}>{f.label}</Text>
              <Text style={styles.appliedTagX}>  ✕</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => { setScope('Tous'); setStatusFilter('Tous statuts'); }}>
            <Text style={styles.clearAll}>Tout effacer</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          query.length >= 2 ? (
            <View style={styles.resultHeader}>
              <Text style={styles.resultCount}>
                {results.length} résultat{results.length !== 1 ? 's' : ''} pour <Text style={styles.resultQuery}>« {query} »</Text>
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.recentTitle}>Recherches récentes</Text>
              {recentSearches.map((s) => (
                <TouchableOpacity key={s} style={styles.recentRow} onPress={() => setQuery(s)}>
                  <Text style={styles.recentIcon}>🕐</Text>
                  <Text style={styles.recentText}>{s}</Text>
                  <Text style={styles.recentChevron}>›</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.hintBox}>
                <Text style={styles.hintText}>💡 Recherchez par référence, objet, expéditeur ou description</Text>
              </View>
            </View>
          )
        }
        renderItem={({ item }) => (
          <MailCard
            item={item}
            type={item.sender ? 'incoming' : 'outgoing'}
            onPress={() => navigation.navigate('LecteurMailDetail', { mail: item })}
          />
        )}
        ListEmptyComponent={
          query.length >= 2 ? (
            <EmptyState icon="🔍" title="Aucun résultat" subtitle={`Aucun courrier ne correspond à « ${query} »`} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  searchArea: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  appliedRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, paddingHorizontal: Spacing.lg, paddingVertical: 8, backgroundColor: Colors.blue50, borderBottomWidth: 0.5, borderBottomColor: Colors.blue100 },
  appliedLabel: { fontSize: 11, fontWeight: '700', color: Colors.blue700 },
  appliedTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.blue800, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  appliedTagText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  appliedTagX: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  clearAll: { fontSize: 11, fontWeight: '700', color: Colors.red600 },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  resultHeader: { marginBottom: Spacing.md },
  resultCount: { fontSize: 13, color: Colors.gray500, fontWeight: '500' },
  resultQuery: { fontWeight: '800', color: Colors.blue800 },
  recentTitle: { fontSize: 12, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 },
  recentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 12, marginBottom: 6, borderWidth: 0.5, borderColor: Colors.border, gap: 10 },
  recentIcon: { fontSize: 14 },
  recentText: { flex: 1, fontSize: 14, color: Colors.gray700 },
  recentChevron: { fontSize: 18, color: Colors.gray300 },
  hintBox: { backgroundColor: Colors.amber50, borderRadius: Radius.md, padding: 12, borderWidth: 0.5, borderColor: Colors.amber100, marginTop: Spacing.md },
  hintText: { fontSize: 12, color: Colors.amber700, lineHeight: 17 },
});
