// src/screens/admin/AdminMailDetailScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScreenHeader, Badge, InfoRow, SectionTitle, AICard,
  OCRBox, AttachmentItem, Timeline, ActionBar, Card, IconButton, SelectInput,
} from '../../components';
import { Colors, Spacing, Radius, Shadow } from '../../theme';

export default function AdminMailDetailScreen({ navigation, route }) {
  const { mail } = route.params;
  const [status, setStatus] = useState(mail.status);

  const actions = [
    { icon: '✏️', label: 'Modifier', onPress: () => Alert.alert('Modifier', 'Ouvrir le formulaire de modification.') },
    { icon: '📁', label: 'Archiver', onPress: () => { setStatus('Archived'); Alert.alert('Archivé', 'Le courrier a été archivé.'); } },
    { icon: '🔄', label: 'Réassigner', onPress: () => Alert.alert('Réassigner', 'Choisir un agent.') },
    { icon: '🔍', label: 'Lancer OCR', onPress: () => Alert.alert('OCR', 'Traitement OCR lancé…') },
    { icon: '📋', label: 'Historique', onPress: () => navigation.navigate('AdminMailHistory', { mail }) },
    { icon: '🗑', label: 'Supprimer', onPress: () => Alert.alert('Confirmer', 'Supprimer ce courrier ?', [{ text: 'Annuler', style: 'cancel' }, { text: 'Supprimer', style: 'destructive', onPress: () => navigation.goBack() }]), danger: true },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Détail courrier entrant"
        onBack={() => navigation.goBack()}
        right={<IconButton icon="⋮" onPress={() => {}} />}
      />

      {/* Action bar */}
      <ActionBar actions={actions} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header hero */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroRef}>{mail.reference}</Text>
            <Badge label={status} />
          </View>
          <Text style={styles.heroSubject}>{mail.subject}</Text>
          <Text style={styles.heroMeta}>{mail.sender} · {mail.dateReceived}</Text>
          {mail.assignedTo && (
            <View style={styles.assignedRow}>
              <Text style={styles.assignedIcon}>👤</Text>
              <Text style={styles.assignedText}>Assigné à : {mail.assignedTo}</Text>
            </View>
          )}
        </View>

        {/* Details */}
        <Card>
          <SectionHeader>Informations</SectionHeader>
          <InfoRow label="Référence" value={mail.reference} />
          <InfoRow label="Date reçue" value={mail.dateReceived} />
          <InfoRow label="Expéditeur" value={mail.sender} />
          <InfoRow label="Sujet" value={mail.subject} />
          <InfoRow label="Catégorie" value={mail.category || '—'} />
          {mail.description && <InfoRow label="Description" value={mail.description} last />}
        </Card>

        {/* Status update */}
        <Card>
          <SelectInput
            label="Changer le statut"
            value={status}
            options={['Pending', 'In Progress', 'Processed', 'Archived', 'Urgent']}
            onSelect={setStatus}
          />
        </Card>

        {/* AI Classification */}
        {mail.confidence && (
          <View>
            <SectionTitle title="Classification IA" />
            <AICard
              category={mail.category}
              confidence={mail.confidence}
              alternatives={mail.alternativeCategories}
              onApply={() => Alert.alert('Classification appliquée', `Catégorie confirmée : ${mail.category}`)}
            />
          </View>
        )}

        {/* OCR */}
        {mail.ocrText && (
          <View>
            <SectionTitle title="Texte extrait (OCR)" />
            <OCRBox text={mail.ocrText} />
          </View>
        )}

        {/* Attachments */}
        {mail.attachments?.length > 0 && (
          <View>
            <SectionTitle title={`Pièces jointes (${mail.attachments.length})`} />
            <View style={styles.attachGrid}>
              {mail.attachments.map((f, i) => (
                <AttachmentItem key={i} file={f} onPress={() => Alert.alert('Ouvrir', f.name)} />
              ))}
            </View>
          </View>
        )}

        {/* Timeline */}
        {mail.timeline?.length > 0 && (
          <Card style={{ backgroundColor: Colors.gray50 }}>
            <SectionTitle title="Historique" action="Tout voir" onAction={() => navigation.navigate('AdminMailHistory', { mail })} />
            <Timeline events={mail.timeline} />
          </Card>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const SectionHeader = ({ children }) => (
  <Text style={{ fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 4 }}>{children}</Text>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 },
  hero: { backgroundColor: Colors.blue900, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.md },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  heroRef: { fontSize: 11, fontWeight: '800', color: Colors.blue300, fontFamily: 'monospace', letterSpacing: 0.5 },
  heroSubject: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4, lineHeight: 24 },
  heroMeta: { fontSize: 12, color: Colors.blue200 },
  assignedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.sm, padding: 8 },
  assignedIcon: { fontSize: 14 },
  assignedText: { fontSize: 12, color: Colors.blue100 },
  attachGrid: { flexDirection: 'row', flexWrap: 'wrap' },
});
