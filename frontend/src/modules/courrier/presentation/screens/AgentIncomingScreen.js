// src/screens/agent/AgentIncomingScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, SearchBar, FilterChips, MailCard, EmptyState } from '../../../../shared/components';
import { Colors, Spacing, Shadow } from '../../../../shared/theme';
import { INCOMING_MAIL } from '../../../../data/mockData';

export default function AgentIncomingScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tous');

  const data = INCOMING_MAIL.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !search || m.subject.toLowerCase().includes(q) || m.reference.toLowerCase().includes(q) || m.sender.toLowerCase().includes(q);
    const matchFilter = filter === 'Tous' || m.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Courrier entrant" onBack={() => navigation.goBack()} />
      <View style={styles.filtersArea}>
        <SearchBar placeholder="Réf., expéditeur, sujet…" value={search} onChangeText={setSearch} />
        <View style={{ height: Spacing.sm }} />
        <FilterChips options={['Tous', 'Pending', 'Urgent', 'In Progress', 'Processed', 'Archived']} selected={filter} onSelect={setFilter} />
        <Text style={styles.count}>{data.length} courrier{data.length !== 1 ? 's' : ''}</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MailCard item={item} type="incoming" onPress={() => navigation.navigate('AgentIncomingDetail', { mail: item })} />
        )}
        ListEmptyComponent={<EmptyState icon="📭" title="Aucun courrier trouvé" subtitle="Modifiez votre recherche ou vos filtres." />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AgentAddIncoming')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  filtersArea: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  count: { fontSize: 11, color: Colors.gray400, fontWeight: '600', paddingTop: 6 },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  fab: { position: 'absolute', bottom: 24, right: Spacing.lg, width: 54, height: 54, borderRadius: 16, backgroundColor: Colors.blue800, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
  fabText: { fontSize: 26, color: '#fff', lineHeight: 32 },
});
