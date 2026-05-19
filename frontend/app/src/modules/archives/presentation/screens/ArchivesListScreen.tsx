import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// ─── Fake Data ────────────────────────────────────────────────────────────────

interface ArchiveItem {
  id: number;
  reference: string;
  titre: string;
  categorie: string;
  date: string;
  taille: string;
  format: string;
  auteur: string;
  description: string;
}

const FAKE_ARCHIVES: ArchiveItem[] = [
  { id: 1, reference: 'ARC-2026-001', titre: 'Rapport Annuel 2025', categorie: 'Rapports', date: '12/01/2026', taille: '4.2 MB', format: 'PDF', auteur: 'Direction Générale', description: 'Rapport annuel consolidé de l\'exercice 2025 incluant bilans financiers et indicateurs.' },
  { id: 2, reference: 'ARC-2026-002', titre: 'Circulaire N°12 - Procédures RH', categorie: 'Administratif', date: '18/01/2026', taille: '1.8 MB', format: 'PDF', auteur: 'Service RH', description: 'Circulaire relative aux nouvelles procédures de gestion des ressources humaines.' },
  { id: 3, reference: 'ARC-2026-003', titre: 'Budget Prévisionnel 2026', categorie: 'Financier', date: '25/01/2026', taille: '3.5 MB', format: 'XLSX', auteur: 'Service Financier', description: 'Budget prévisionnel consolidé pour l\'exercice fiscal 2026.' },
  { id: 4, reference: 'ARC-2026-004', titre: 'Contrat Maintenance Informatique', categorie: 'Juridique', date: '02/02/2026', taille: '2.1 MB', format: 'PDF', auteur: 'Direction SI', description: 'Contrat de maintenance du parc informatique — prestataire TechnoSol.' },
  { id: 5, reference: 'ARC-2026-005', titre: 'Procès-verbal Réunion CA — Février', categorie: 'Administratif', date: '14/02/2026', taille: '890 KB', format: 'DOCX', auteur: 'Secrétariat', description: 'Procès-verbal de la réunion du conseil d\'administration du 10 Février 2026.' },
  { id: 6, reference: 'ARC-2026-006', titre: 'Rapport Audit Interne Q1', categorie: 'Rapports', date: '01/04/2026', taille: '5.7 MB', format: 'PDF', auteur: 'Audit Interne', description: 'Résultats de l\'audit interne du premier trimestre 2026.' },
  { id: 7, reference: 'ARC-2026-007', titre: 'Convention Partenariat — Université', categorie: 'Juridique', date: '15/04/2026', taille: '1.2 MB', format: 'PDF', auteur: 'Direction', description: 'Convention de partenariat avec l\'Université Mohammed V de Rabat.' },
  { id: 8, reference: 'ARC-2026-008', titre: 'Plan de Formation 2026', categorie: 'Administratif', date: '20/04/2026', taille: '2.9 MB', format: 'PDF', auteur: 'Service RH', description: 'Plan annuel de formation et développement des compétences du personnel.' },
];

const CATEGORIES = ['Tous', 'Rapports', 'Administratif', 'Financier', 'Juridique'];

const CAT_COLORS: Record<string, string> = {
  'Rapports':      '#4F46E5',
  'Administratif': '#2563EB',
  'Financier':     '#7C3AED',
  'Juridique':     '#0891B2',
};

const FORMAT_COLORS: Record<string, { bg: string; text: string }> = {
  'PDF':  { bg: '#FEE2E2', text: '#DC2626' },
  'XLSX': { bg: '#D1FAE5', text: '#059669' },
  'DOCX': { bg: '#DBEAFE', text: '#2563EB' },
};

// ─── Archive Card ─────────────────────────────────────────────────────────────

function ArchiveCard({ item, onPress }: { item: ArchiveItem; onPress: () => void }) {
  const catColor   = CAT_COLORS[item.categorie] ?? '#64748B';
  const fmtStyle   = FORMAT_COLORS[item.format] ?? { bg: '#F1F5F9', text: '#475569' };
  const scale      = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {/* Accent bar */}
        <View style={[styles.cardAccent, { backgroundColor: catColor }]} />

        <View style={styles.cardBody}>
          {/* Top row */}
          <View style={styles.cardTopRow}>
            <View style={styles.refRow}>
              <Feather name="folder" size={12} color={catColor} />
              <Text style={[styles.refText, { color: catColor }]}>{item.reference}</Text>
            </View>
            <View style={[styles.formatBadge, { backgroundColor: fmtStyle.bg }]}>
              <Text style={[styles.formatText, { color: fmtStyle.text }]}>{item.format}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.titleText} numberOfLines={2}>{item.titre}</Text>

          {/* Author */}
          <Text style={styles.authorText} numberOfLines={1}>
            <Feather name="user" size={11} color="#94A3B8" />{'  '}{item.auteur}
          </Text>

          {/* Footer */}
          <View style={styles.cardFooter}>
            <View style={[styles.catPill, { backgroundColor: catColor + '18' }]}>
              <Text style={[styles.catText, { color: catColor }]}>{item.categorie}</Text>
            </View>
            <View style={styles.footerRight}>
              <Text style={styles.sizeText}>{item.taille}</Text>
              <View style={styles.dot} />
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          </View>
        </View>

        <Feather name="chevron-right" size={16} color="#CBD5E1" style={styles.chevron} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────

function StatsBanner() {
  const total     = FAKE_ARCHIVES.length;
  const rapports  = FAKE_ARCHIVES.filter(a => a.categorie === 'Rapports').length;
  const juridique = FAKE_ARCHIVES.filter(a => a.categorie === 'Juridique').length;
  const financier = FAKE_ARCHIVES.filter(a => a.categorie === 'Financier').length;

  return (
    <View style={styles.banner}>
      <View style={styles.bannerStat}>
        <Text style={styles.bannerNumber}>{total}</Text>
        <Text style={styles.bannerLabel}>Total</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerStat}>
        <Text style={[styles.bannerNumber, { color: '#4F46E5' }]}>{rapports}</Text>
        <Text style={styles.bannerLabel}>Rapports</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerStat}>
        <Text style={[styles.bannerNumber, { color: '#0891B2' }]}>{juridique}</Text>
        <Text style={styles.bannerLabel}>Juridique</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerStat}>
        <Text style={[styles.bannerNumber, { color: '#7C3AED' }]}>{financier}</Text>
        <Text style={styles.bannerLabel}>Financier</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

interface Props { navigation: any; }

export function ArchivesListScreen({ navigation }: Props) {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('Tous');

  const data = useMemo(() => {
    return FAKE_ARCHIVES.filter(a => {
      const matchCat = category === 'Tous' || a.categorie === category;
      const q        = search.trim().toLowerCase();
      const matchQ   = !q || a.titre.toLowerCase().includes(q) || a.reference.toLowerCase().includes(q) || a.auteur.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [search, category]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <StatsBanner />

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Titre, référence, auteur..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x-circle" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category chips */}
        <View style={styles.chipsRow}>
          {CATEGORIES.map(c => {
            const isActive = category === c;
            return (
              <TouchableOpacity key={c} style={[styles.chip, isActive && styles.chipActive]} onPress={() => setCategory(c)} activeOpacity={0.75}>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Counter */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>{data.length} archive{data.length !== 1 ? 's' : ''} trouvée{data.length !== 1 ? 's' : ''}</Text>
        <View style={styles.sortRow}>
          <Feather name="arrow-down" size={12} color="#2563EB" />
          <Text style={styles.sortText}>Date (récent)</Text>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ArchiveCard item={item} onPress={() => {}} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIcon}>
              <Feather name="folder" size={32} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>Aucune archive trouvée</Text>
            <Text style={styles.emptySubtitle}>Modifiez votre recherche ou réinitialisez les filtres.</Text>
            {(search || category !== 'Tous') && (
              <TouchableOpacity style={styles.resetBtn} onPress={() => { setSearch(''); setCategory('Tous'); }}>
                <Text style={styles.resetBtnText}>Réinitialiser</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  banner: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  bannerStat: { flex: 1, alignItems: 'center' },
  bannerNumber: { fontSize: 22, fontWeight: '800', color: '#2563EB', marginBottom: 2 },
  bannerLabel: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  bannerDivider: { width: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },

  searchWrapper: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 11, gap: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#334155', padding: 0 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  chipTextActive: { color: '#FFFFFF' },

  resultsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  resultsText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { fontSize: 12, color: '#2563EB', fontWeight: '600' },

  listContent: { paddingHorizontal: 16, paddingBottom: 32 },

  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden', shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardAccent: { width: 4, alignSelf: 'stretch' },
  cardBody: { flex: 1, padding: 14 },
  chevron: { marginRight: 12 },

  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  refRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  refText: { fontSize: 12, fontWeight: '700' },

  formatBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  formatText: { fontSize: 10, fontWeight: '700' },

  titleText: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 4, lineHeight: 20 },
  authorText: { fontSize: 12, color: '#64748B', marginBottom: 10 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catText: { fontSize: 11, fontWeight: '600' },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sizeText: { fontSize: 11, color: '#94A3B8' },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#CBD5E1' },
  dateText: { fontSize: 11, color: '#94A3B8' },

  emptyBox: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },
  emptySubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', paddingHorizontal: 40 },
  resetBtn: { marginTop: 8, backgroundColor: '#EFF6FF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  resetBtnText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
});
