// src/screens/agent/AgentIncomingDetailScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScreenHeader, Badge, InfoRow, SectionTitle, AICard,
  OCRBox, AttachmentItem, ActionBar, Card, SelectInput,
} from '../../components';
import { Colors, Spacing, Radius, Shadow } from '../../theme';

export default function AgentIncomingDetailScreen({ navigation, route }) {
  const { mail } = route.params;
  const [status, setStatus] = useState(mail.status);

  const actions = [
    { icon: '✏️', label: 'Modifier', onPress: () => Alert.alert('Modifier', 'Modifier ce courrier.') },
    { icon: '🔄', label: 'Mettre à jour', onPress: () => Alert.alert('Statut', 'Statut mis à jour.') },
    { icon: '🔍', label: 'Lancer OCR', onPress: () => navigation.navigate('AgentOCR', { mail }) },
    { icon: '🏷', label: 'Classifier', onPress: () => navigation.navigate('AgentClassification', { mail }) },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Détail courrier entrant" onBack={() => navigation.goBack()} />
      <ActionBar actions={actions} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroRef}>{mail.reference}</Text>
            <Badge label={status} />
          </View>
          <Text style={styles.heroSubject}>{mail.subject}</Text>
          <Text style={styles.heroMeta}>{mail.sender} · {mail.dateReceived}</Text>
        </View>

        {/* Info */}
        <Card>
          <InfoRow label="Expéditeur" value={mail.sender} />
          <InfoRow label="Date reçue" value={mail.dateReceived} />
          <InfoRow label="Catégorie" value={mail.category || '—'} />
          {mail.description && <InfoRow label="Description" value={mail.description} last />}
        </Card>

        {/* Status updater */}
        <Card>
          <SelectInput
            label="Mettre à jour le statut"
            value={status}
            options={['Pending', 'In Progress', 'Processed', 'Urgent']}
            onSelect={(v) => { setStatus(v); Alert.alert('Statut mis à jour', `→ ${v}`); }}
          />
        </Card>

        {/* AI */}
        {mail.confidence && (
          <View>
            <SectionTitle title="Classification IA" />
            <AICard
              category={mail.category}
              confidence={mail.confidence}
              alternatives={mail.alternativeCategories}
              onApply={() => navigation.navigate('AgentClassification', { mail })}
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

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 },
  hero: { backgroundColor: Colors.blue900, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.md },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  heroRef: { fontSize: 11, fontWeight: '800', color: Colors.blue300, fontFamily: 'monospace', letterSpacing: 0.5 },
  heroSubject: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 4, lineHeight: 22 },
  heroMeta: { fontSize: 12, color: Colors.blue200 },
  attachGrid: { flexDirection: 'row', flexWrap: 'wrap' },
});
