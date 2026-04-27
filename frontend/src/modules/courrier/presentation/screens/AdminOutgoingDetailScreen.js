// src/screens/admin/AdminOutgoingDetailScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScreenHeader, Badge, InfoRow, SectionTitle,
  AttachmentItem, Timeline, ActionBar, Card, SelectInput,
} from '../../../../shared/components';
import { Colors, Spacing, Radius, Shadow } from '../../../../shared/theme';

export default function AdminOutgoingDetailScreen({ navigation, route }) {
  const { mail } = route.params;
  const [status, setStatus] = useState(mail.status);

  const actions = [
    { icon: '✏️', label: 'Modifier', onPress: () => Alert.alert('Modifier', 'Modifier ce courrier sortant.') },
    { icon: '📁', label: 'Archiver', onPress: () => { setStatus('Archived'); Alert.alert('Archivé', 'Courrier archivé.'); } },
    { icon: '🔄', label: 'Réassigner', onPress: () => Alert.alert('Réassigner', 'Choisir un agent.') },
    { icon: '📋', label: 'Historique', onPress: () => navigation.navigate('AdminMailHistory', { mail }) },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Détail courrier sortant" onBack={() => navigation.goBack()} />
      <ActionBar actions={actions} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroRef}>{mail.reference}</Text>
            <Badge label={status} />
          </View>
          <Text style={styles.heroSubject}>{mail.subject}</Text>
          <Text style={styles.heroMeta}>À : {mail.recipient} · {mail.dateSent}</Text>
        </View>

        <Card>
          <InfoRow label="Référence" value={mail.reference} />
          <InfoRow label="Date envoyée" value={mail.dateSent} />
          <InfoRow label="Destinataire" value={mail.recipient} />
          {mail.description && <InfoRow label="Description" value={mail.description} last />}
        </Card>

        <Card>
          <SelectInput
            label="Changer le statut"
            value={status}
            options={['Draft', 'Sent', 'Archived']}
            onSelect={setStatus}
          />
        </Card>

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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 },
  hero: { backgroundColor: Colors.teal800, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.md },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  heroRef: { fontSize: 11, fontWeight: '800', color: Colors.teal100, fontFamily: 'monospace', letterSpacing: 0.5 },
  heroSubject: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  heroMeta: { fontSize: 12, color: Colors.teal100 },
  attachGrid: { flexDirection: 'row', flexWrap: 'wrap' },
});
