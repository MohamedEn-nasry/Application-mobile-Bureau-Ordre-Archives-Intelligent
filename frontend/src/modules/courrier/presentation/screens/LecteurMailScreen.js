// src/screens/lecteur/LecteurMailScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, SearchBar, FilterChips, MailCard, EmptyState, ReadOnlyBanner } from '../../../../shared/components';
import { Colors, Spacing } from '../../../../shared/theme';
import { INCOMING_MAIL, OUTGOING_MAIL } from '../../../../data/mockData';

const TABS = ['Entrant', 'Sortant', 'Archive'];

export default function LecteurMailScreen({ navigation }) {
  const [tab, setTab] = useState('Entrant');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tous');

  const getRaw = () => {
    if (tab === 'Entrant') return INCOMING_MAIL;
    if (tab === 'Sortant') return OUTGOING_MAIL;
    return [...INCOMING_MAIL, ...OUTGOING_MAIL].filter((m) => m.status === 'Archived');
  };

  const data = getRaw().filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !search || m.subject.toLowerCase().includes(q) || m.reference.toLowerCase().includes(q);
    const matchFilter = filter === 'Tous' || m.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Courrier" onBack={() => navigation.goBack()} />
      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            {tab === t && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.filtersArea}>
        <ReadOnlyBanner />
        <SearchBar placeholder="Rechercher…" value={search} onChangeText={setSearch} />
        <View style={{ height: Spacing.sm }} />
        <FilterChips options={['Tous', 'Pending', 'Processed', 'Urgent', 'Archived']} selected={filter} onSelect={setFilter} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MailCard item={item} type={item.sender ? 'incoming' : 'outgoing'}
            onPress={() => navigation.navigate('LecteurMailDetail', { mail: item })} />
        )}
        ListEmptyComponent={<EmptyState icon="📭" title="Aucun résultat" subtitle="Modifiez votre recherche." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 13, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.gray400 },
  tabTextActive: { color: Colors.teal700, fontWeight: '800' },
  tabIndicator: { position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 2.5, backgroundColor: Colors.teal600, borderRadius: 2 },
  filtersArea: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  list: { padding: Spacing.lg, paddingBottom: 100 },
});
