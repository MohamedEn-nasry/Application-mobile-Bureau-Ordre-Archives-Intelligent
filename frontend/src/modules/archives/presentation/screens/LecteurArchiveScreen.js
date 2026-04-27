// src/screens/lecteur/LecteurArchiveScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, SearchBar, FilterChips, EmptyState, Badge } from '../../../../shared/components';
import { Colors, Spacing, Radius, Shadow } from '../../../../shared/theme';
import { INCOMING_MAIL, OUTGOING_MAIL } from '../../../../data/mockData';

// Build archive from both lists
const ARCHIVED_ITEMS = [
  ...INCOMING_MAIL.filter((m) => m.status === 'Archived'),
  ...OUTGOING_MAIL.filter((m) => m.status === 'Archived'),
  // Extra demo archive items
  {
    id: 'arch1', reference: 'IN-2026-0856', subject: 'Rapport budgétaire T1 2026',
    sender: 'Contrôle financier', dateReceived: '28 Mar 2026',
    status: 'Archived', category: 'Finance / Budget', attachments: [{ name: 'Rapport_T1.pdf', type: 'pdf' }],
    description: 'Rapport de performance financière du T1 2026.', ocrText: '', timeline: [],
  },
  {
    id: 'arch2', reference: 'OUT-2026-0210', subject: 'Mise à jour politique du personnel',
    recipient: 'Tous les départements', dateSent: '15 Mar 2026',
    status: 'Archived', category: 'RH / Personnel', attachments: [{ name: 'Politique_Personnel.pdf', type: 'pdf' }],
    description: 'Politiques internes du personnel mises à jour, effectives en Avril 2026.', timeline: [],
  },
  {
    id: 'arch3', reference: 'IN-2026-0820', subject: 'Compte-rendu réunion interministérielle',
    sender: 'Cabinet du Premier Ministre', dateReceived: '10 Mar 2026',
    status: 'Archived', category: 'Administratif / Général', attachments: [{ name: 'CR_Réunion.pdf', type: 'pdf' }, { name: 'Annexes.pdf', type: 'pdf' }],
    description: 'Compte-rendu de la réunion interministérielle du 8 mars 2026.', ocrText: '', timeline: [],
  },
];

const CAT_FILTERS = ['Toutes', 'Finance', 'RH', 'Technique', 'Administratif'];

const FILE_ICONS = { pdf: '📄', xlsx: '📊', docx: '📝' };

export default function LecteurArchiveScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Toutes');

  const data = useMemo(() => {
    return ARCHIVED_ITEMS.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        item.subject.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        (item.sender || item.recipient || '').toLowerCase().includes(q);
      const matchCat = catFilter === 'Toutes' ||
        (item.category || '').toLowerCase().includes(catFilter.toLowerCase());
      return matchSearch && matchCat;
    });
  }, [search, catFilter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Archive" onBack={() => navigation.goBack()} />

      <View style={styles.filtersArea}>
        <SearchBar placeholder="Rechercher dans l'archive…" value={search} onChangeText={setSearch} />
        <View style={{ height: Spacing.sm }} />
        <FilterChips options={CAT_FILTERS} selected={catFilter} onSelect={setCatFilter} />
        <Text style={styles.count}>{data.length} document{data.length !== 1 ? 's' : ''} archivé{data.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isIn = !!item.sender;
          const dateLabel = isIn ? item.dateReceived : item.dateSent;
          const partyLabel = isIn ? item.sender : item.recipient;
          const firstAttach = item.attachments?.[0];
          return (
            <TouchableOpacity
              style={styles.archiveItem}
              onPress={() => navigation.navigate('LecteurMailDetail', { mail: item })}
              activeOpacity={0.82}
            >
              <View style={[styles.archiveIcon, isIn ? styles.archiveIconIn : styles.archiveIconOut]}>
                <Text style={styles.archiveIconText}>
                  {firstAttach ? (FILE_ICONS[firstAttach.type] || '📄') : isIn ? '📥' : '📤'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.archiveTop}>
                  <Text style={styles.archiveRef}>{item.reference}</Text>
                  <Text style={styles.archiveDate}>{dateLabel}</Text>
                </View>
                <Text style={styles.archiveSubject} numberOfLines={1}>{item.subject}</Text>
                <Text style={styles.archiveMeta} numberOfLines={1}>
                  {isIn ? `De : ${partyLabel}` : `À : ${partyLabel}`}
                </Text>
                <View style={styles.archiveBottom}>
                  {item.category && (
                    <View style={styles.catTag}>
                      <Text style={styles.catTagText}>{item.category}</Text>
                    </View>
                  )}
                  {item.attachments?.length > 0 && (
                    <Text style={styles.attachCount}>📎 {item.attachments.length}</Text>
                  )}
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState icon="📂" title="Archive vide" subtitle="Aucun document archivé ne correspond à votre recherche." />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filtersArea: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  count: { fontSize: 11, color: Colors.gray400, fontWeight: '600', paddingTop: 6 },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  archiveItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 0.5, borderColor: Colors.border, ...Shadow.xs },
  archiveIcon: { width: 46, height: 46, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  archiveIconIn: { backgroundColor: Colors.blue50 },
  archiveIconOut: { backgroundColor: Colors.teal50 },
  archiveIconText: { fontSize: 22 },
  archiveTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  archiveRef: { fontSize: 10, fontWeight: '800', color: Colors.blue600, fontFamily: 'monospace', letterSpacing: 0.3 },
  archiveDate: { fontSize: 10, color: Colors.gray400 },
  archiveSubject: { fontSize: 13, fontWeight: '700', color: Colors.gray900, marginBottom: 2 },
  archiveMeta: { fontSize: 11, color: Colors.gray400, marginBottom: 6 },
  archiveBottom: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catTag: { backgroundColor: Colors.gray100, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  catTagText: { fontSize: 10, fontWeight: '600', color: Colors.gray600 },
  attachCount: { fontSize: 10, color: Colors.gray400 },
  chevron: { fontSize: 20, color: Colors.gray300 },
});
