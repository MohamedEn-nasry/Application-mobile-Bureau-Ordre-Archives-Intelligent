import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { FAKE_COURRIERS, CourrierItem } from '../../data/fakeData';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ['Tous', 'En attente', 'Traité', 'Archivé'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  'En attente': { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
  'Traité':     { bg: '#D1FAE5', text: '#059669', dot: '#10B981' },
  'Archivé':    { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' },
};

const CAT_COLORS: Record<string, string> = {
  'Administratif':       '#3B82F6',
  'Financier':           '#7C3AED',
  'Plaintes':            '#DC2626',
  'Ressources Humaines': '#0891B2',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  navigation: any;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatsBanner() {
  const incoming = FAKE_COURRIERS.filter(c => c.type === 'Entrant');
  const pending  = incoming.filter(c => c.statut === 'En attente').length;
  const treated  = incoming.filter(c => c.statut === 'Traité').length;
  const archived = incoming.filter(c => c.statut === 'Archivé').length;

  return (
    <View style={styles.banner}>
      <View style={styles.bannerStat}>
        <Text style={styles.bannerNumber}>{incoming.length}</Text>
        <Text style={styles.bannerLabel}>Total</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerStat}>
        <Text style={[styles.bannerNumber, { color: '#F59E0B' }]}>{pending}</Text>
        <Text style={styles.bannerLabel}>En attente</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerStat}>
        <Text style={[styles.bannerNumber, { color: '#10B981' }]}>{treated}</Text>
        <Text style={styles.bannerLabel}>Traités</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerStat}>
        <Text style={[styles.bannerNumber, { color: '#94A3B8' }]}>{archived}</Text>
        <Text style={styles.bannerLabel}>Archivés</Text>
      </View>
    </View>
  );
}

function MailCard({ item, onPress }: { item: CourrierItem; onPress: () => void }) {
  const statusStyle = STATUS_STYLE[item.statut] ?? STATUS_STYLE['En attente'];
  const catColor    = CAT_COLORS[item.categorie] ?? '#64748B';
  const scale       = useRef(new Animated.Value(1)).current;

  const handlePressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Left accent bar */}
        <View style={[styles.cardAccent, { backgroundColor: catColor }]} />

        <View style={styles.cardBody}>
          {/* Top row: reference + status */}
          <View style={styles.cardTopRow}>
            <View style={styles.refRow}>
              <Feather name="arrow-down-left" size={13} color="#2563EB" />
              <Text style={styles.refText}>{item.reference}</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.statut}</Text>
            </View>
          </View>

          {/* Sender */}
          <Text style={styles.senderText} numberOfLines={1}>
            <Feather name="user" size={11} color="#94A3B8" />{'  '}{item.expediteur}
          </Text>

          {/* Subject */}
          <Text style={styles.subjectText} numberOfLines={2}>{item.objet}</Text>

          {/* Footer: category + date + attachments */}
          <View style={styles.cardFooter}>
            <View style={[styles.catPill, { backgroundColor: catColor + '18' }]}>
              <Text style={[styles.catText, { color: catColor }]}>{item.categorie}</Text>
            </View>
            <View style={styles.footerRight}>
              {item.attachments.length > 0 && (
                <View style={styles.attachBadge}>
                  <Feather name="paperclip" size={10} color="#64748B" />
                  <Text style={styles.attachCount}>{item.attachments.length}</Text>
                </View>
              )}
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          </View>
        </View>

        {/* Chevron */}
        <Feather name="chevron-right" size={16} color="#CBD5E1" style={styles.chevron} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export function CourrierListScreen({ navigation }: Props) {
  const [search,       setSearch]       = useState('');
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('Tous');

  const data = useMemo(() => {
    // Only incoming mail
    return FAKE_COURRIERS.filter(c => {
      if (c.type !== 'Entrant') return false;
      if (activeStatus !== 'Tous' && c.statut !== activeStatus) return false;
      const q = search.trim().toLowerCase();
      if (q) {
        return (
          c.reference.toLowerCase().includes(q) ||
          c.expediteur.toLowerCase().includes(q) ||
          c.objet.toLowerCase().includes(q) ||
          c.categorie.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, activeStatus]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Stats Banner */}
      <StatsBanner />

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Référence, expéditeur, objet..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x-circle" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          )}
        </View>

        {/* Status filter chips */}
        <View style={styles.chipsRow}>
          {STATUS_FILTERS.map(f => {
            const isActive = activeStatus === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setActiveStatus(f)}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Results counter */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {data.length} courrier{data.length !== 1 ? 's' : ''} trouvé{data.length !== 1 ? 's' : ''}
        </Text>
        <View style={styles.sortRow}>
          <Feather name="arrow-down" size={12} color="#2563EB" />
          <Text style={styles.sortText}>Date (récent)</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <MailCard
            item={item}
            onPress={() => navigation.navigate('IncomingMailDetail', { courrier: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIcon}>
              <Feather name="inbox" size={32} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>Aucun courrier trouvé</Text>
            <Text style={styles.emptySubtitle}>
              {search ? 'Modifiez votre recherche ou réinitialisez les filtres.' : 'Aucun courrier entrant disponible.'}
            </Text>
            {search.length > 0 && (
              <TouchableOpacity style={styles.resetBtn} onPress={() => { setSearch(''); setActiveStatus('Tous'); }}>
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

  // Banner
  banner: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bannerStat:    { flex: 1, alignItems: 'center' },
  bannerNumber:  { fontSize: 22, fontWeight: '800', color: '#2563EB', marginBottom: 2 },
  bannerLabel:   { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  bannerDivider: { width: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },

  // Search
  searchWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#334155', padding: 0 },
  chipsRow: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive:     { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipText:       { fontSize: 12, fontWeight: '600', color: '#64748B' },
  chipTextActive: { color: '#FFFFFF' },

  // Results row
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  sortRow:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText:    { fontSize: 12, color: '#2563EB', fontWeight: '600' },

  // List
  listContent: { paddingHorizontal: 16, paddingBottom: 32 },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardAccent: { width: 4, alignSelf: 'stretch' },
  cardBody:   { flex: 1, padding: 14 },
  chevron:    { marginRight: 12 },

  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  refRow:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  refText:    { fontSize: 12, fontWeight: '700', color: '#2563EB' },

  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, gap: 5 },
  statusDot:  { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '600' },

  senderText:  { fontSize: 12, color: '#64748B', marginBottom: 4 },
  subjectText: { fontSize: 13, fontWeight: '600', color: '#1E293B', marginBottom: 10, lineHeight: 18 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catPill:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catText:    { fontSize: 11, fontWeight: '600' },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  attachBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F8FAFC', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  attachCount: { fontSize: 10, fontWeight: '600', color: '#64748B' },
  dateText:    { fontSize: 11, color: '#94A3B8' },

  // Empty state
  emptyBox: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  emptyTitle:    { fontSize: 16, fontWeight: '700', color: '#334155' },
  emptySubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', paddingHorizontal: 40 },
  resetBtn:      { marginTop: 8, backgroundColor: '#EFF6FF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  resetBtnText:  { fontSize: 13, fontWeight: '700', color: '#2563EB' },
});
