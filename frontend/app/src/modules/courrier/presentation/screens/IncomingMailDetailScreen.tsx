import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { CourrierItem } from '../../data/fakeData';

const STATUS_OPTIONS = ['En attente', 'Traité', 'Archivé'];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'En attente': { bg: '#FEF3C7', text: '#D97706' },
  'Traité':     { bg: '#D1FAE5', text: '#059669' },
  'Archivé':    { bg: '#F1F5F9', text: '#475569' },
};

interface Props {
  navigation: any;
  route: { params: { courrier: CourrierItem } };
}

export function IncomingMailDetailScreen({ navigation, route }: Props) {
  const { courrier } = route.params;
  const [currentStatus, setCurrentStatus] = useState(courrier.statut);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusStyle = STATUS_STYLE[currentStatus] || STATUS_STYLE['En attente'];

  const actions = [
    { label: 'Modifier',   icon: 'edit-3',    bg: '#2563EB' },
    { label: 'Archiver',   icon: 'archive',   bg: '#475569' },
    { label: 'Réassigner', icon: 'user-check', bg: '#4F46E5' },
    { label: 'OCR',        icon: 'eye',       bg: '#7C3AED' },
    { label: 'Historique', icon: 'clock',     bg: '#0891B2' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Blue Reference Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.refLabel}>Référence</Text>
              <Text style={styles.refValue}>{courrier.reference}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{currentStatus}</Text>
            </View>
          </View>

          <View style={styles.headerMeta}>
            <View style={styles.metaItem}>
              <Feather name="calendar" size={12} color="#BFDBFE" />
              <Text style={styles.metaText}>{courrier.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="tag" size={12} color="#BFDBFE" />
              <Text style={styles.metaText}>{courrier.categorie}</Text>
            </View>
          </View>
        </View>

        {/* Sender / Subject */}
        <View style={styles.section}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIconBox}>
              <Feather name="user" size={13} color="#94A3B8" />
            </View>
            <View>
              <Text style={styles.fieldLabel}>EXPÉDITEUR</Text>
              <Text style={styles.fieldValue}>{courrier.expediteur}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.fieldRow}>
            <View style={styles.fieldIconBox}>
              <Feather name="file-text" size={13} color="#94A3B8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>OBJET</Text>
              <Text style={styles.fieldValue}>{courrier.objet}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <Text style={styles.descText}>{courrier.description}</Text>
        </View>

        {/* Attachments */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PIÈCES JOINTES ({courrier.attachments.length})</Text>
          {courrier.attachments.map((att, i) => (
            <View key={i} style={styles.attachRow}>
              <View style={styles.attachIcon}>
                <Feather name="paperclip" size={14} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.attachName} numberOfLines={1}>{att}</Text>
                <Text style={styles.attachMeta}>PDF • 245 KB</Text>
              </View>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>Voir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* OCR Section */}
        <View style={styles.section}>
          <View style={styles.ocrHeader}>
            <Text style={styles.sectionLabel}>TEXTE OCR EXTRAIT</Text>
            <TouchableOpacity style={styles.ocrBtn}>
              <Feather name="refresh-cw" size={11} color="#7C3AED" />
              <Text style={styles.ocrBtnText}>Relancer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ocrBox}>
            <Text style={styles.ocrText}>{courrier.ocrText}...</Text>
          </View>
        </View>

        {/* AI Classification */}
        <View style={styles.aiSection}>
          <View style={styles.aiHeader}>
            <View style={styles.aiIcon}>
              <Feather name="cpu" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.aiTitle}>CLASSIFICATION IA</Text>
          </View>
          <View style={styles.aiBody}>
            <View>
              <Text style={styles.aiValue}>{courrier.classification}</Text>
              <Text style={styles.aiSub}>Suggestion automatique</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.aiConfidence}>{courrier.confidence}%</Text>
              <Text style={styles.aiSub}>Confiance</Text>
            </View>
          </View>
          <View style={styles.aiBar}>
            <View style={[styles.aiBarFill, { width: `${courrier.confidence}%` }]} />
          </View>
        </View>

        {/* Status Changer */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CHANGER LE STATUT</Text>
          <TouchableOpacity
            style={styles.statusDropdownBtn}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{currentStatus}</Text>
            </View>
            <Feather name={showStatusDropdown ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
          </TouchableOpacity>

          {showStatusDropdown && (
            <View style={styles.dropdown}>
              {STATUS_OPTIONS.map(opt => {
                const s = STATUS_STYLE[opt];
                return (
                  <TouchableOpacity
                    key={opt}
                    style={styles.dropdownItem}
                    onPress={() => { setCurrentStatus(opt as any); setShowStatusDropdown(false); }}
                  >
                    {currentStatus === opt && <Feather name="check-circle" size={14} color="#2563EB" />}
                    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                      <Text style={[styles.statusText, { color: s.text }]}>{opt}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACTIONS</Text>
          <View style={styles.actionsGrid}>
            {actions.map(action => (
              <TouchableOpacity
                key={action.label}
                style={[styles.actionBtn, { backgroundColor: action.bg }]}
                activeOpacity={0.85}
              >
                <Feather name={action.icon as any} size={18} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Assignment */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.sectionLabel}>ASSIGNÉ À</Text>
          <View style={styles.assignRow}>
            <View style={styles.assignAvatar}>
              <Text style={styles.assignAvatarText}>
                {courrier.assigneA !== 'Non assigné'
                  ? courrier.assigneA.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  : '—'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.assignName}>{courrier.assigneA}</Text>
              <Text style={styles.assignRole}>Agent — Bureau d'Ordre</Text>
            </View>
            <TouchableOpacity style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Changer</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 20 },

  // Blue header card
  headerCard: { margin: 16, backgroundColor: '#2563EB', borderRadius: 20, padding: 18 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  refLabel: { fontSize: 11, color: '#BFDBFE', fontWeight: '600', marginBottom: 4 },
  refValue: { fontSize: 16, color: '#FFFFFF', fontWeight: '800', letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '700' },
  headerMeta: { flexDirection: 'row', gap: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#3B82F6' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#BFDBFE' },

  // Sections
  section: { backgroundColor: '#FFFFFF', borderRadius: 18, marginHorizontal: 16, marginBottom: 12, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 12 },

  // Field rows
  fieldRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  fieldIconBox: { marginTop: 2 },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 3 },
  fieldValue: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },

  //  Description
  descText: { fontSize: 13, color: '#475569', lineHeight: 20 },

  //  Attachments
  attachRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F8FAFC', borderRadius: 12, padding: 10, marginBottom: 8 },
  attachIcon: { width: 36, height: 36, backgroundColor: '#FEE2E2', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  attachName: { fontSize: 13, fontWeight: '600', color: '#334155' },
  attachMeta: { fontSize: 11, color: '#94A3B8' },
  viewBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  viewBtnText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },

  //  OCR
  ocrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ocrBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F5F3FF', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  ocrBtnText: { fontSize: 11, fontWeight: '600', color: '#7C3AED' },
  ocrBox: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  ocrText: { fontSize: 12, color: '#475569', lineHeight: 18, fontStyle: 'italic' },

  //  AI Section
  aiSection: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#F5F3FF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#DDD6FE' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  aiIcon: { width: 32, height: 32, backgroundColor: '#7C3AED', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  aiTitle: { fontSize: 11, fontWeight: '700', color: '#5B21B6', letterSpacing: 0.5 },
  aiBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  aiValue: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  aiSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  aiConfidence: { fontSize: 24, fontWeight: '800', color: '#059669' },
  aiBar: { height: 8, backgroundColor: '#DDD6FE', borderRadius: 4, overflow: 'hidden' },
  aiBarFill: { height: '100%', backgroundColor: '#7C3AED', borderRadius: 4 },

  //  Status dropdown
  statusDropdownBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 12 },
  dropdown: { marginTop: 8, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },

  //  Actions
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionBtn: { flex: 1, minWidth: 55, borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 6 },
  actionBtnText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },

  //  Assignment
  assignRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  assignAvatar: { width: 40, height: 40, backgroundColor: '#DBEAFE', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  assignAvatarText: { fontSize: 14, fontWeight: '800', color: '#2563EB' },
  assignName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  assignRole: { fontSize: 12, color: '#64748B' },
  changeBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  changeBtnText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
});
