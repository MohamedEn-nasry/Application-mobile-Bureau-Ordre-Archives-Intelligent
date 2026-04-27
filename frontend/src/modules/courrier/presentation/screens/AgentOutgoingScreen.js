// src/screens/agent/AgentOutgoingScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, SearchBar, FilterChips, MailCard, EmptyState } from '../../../../shared/components';
import { Colors, Spacing, Shadow } from '../../../../shared/theme';
import { OUTGOING_MAIL } from '../../../../data/mockData';

export default function AgentOutgoingScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tous');

  const data = OUTGOING_MAIL.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !search || m.subject.toLowerCase().includes(q) || m.reference.toLowerCase().includes(q) || m.recipient.toLowerCase().includes(q);
    const matchFilter = filter === 'Tous' || m.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Courrier sortant" onBack={() => navigation.goBack()} />
      <View style={styles.filtersArea}>
        <SearchBar placeholder="Réf., destinataire, sujet…" value={search} onChangeText={setSearch} />
        <View style={{ height: Spacing.sm }} />
        <FilterChips options={['Tous', 'Draft', 'Sent', 'Archived']} selected={filter} onSelect={setFilter} />
        <Text style={styles.count}>{data.length} courrier{data.length !== 1 ? 's' : ''}</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MailCard item={item} type="outgoing" onPress={() => navigation.navigate('AgentOutgoingDetail', { mail: item })} />
        )}
        ListEmptyComponent={<EmptyState icon="📤" title="Aucun courrier sortant" subtitle="Créez votre premier courrier sortant." />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AgentAddOutgoing')}>
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
  fab: { position: 'absolute', bottom: 24, right: Spacing.lg, width: 54, height: 54, borderRadius: 16, backgroundColor: Colors.teal600, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
  fabText: { fontSize: 26, color: '#fff', lineHeight: 32 },
});
