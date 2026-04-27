// src/screens/lecteur/LecteurMailDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Badge, InfoRow, SectionTitle, OCRBox, AttachmentItem, Timeline, Card } from '../../../../shared/components';
import { Colors, Spacing, Radius, Shadow } from '../../../../shared/theme';

export default function LecteurMailDetailScreen({ navigation, route }) {
  const { mail } = route.params;
  const isIn = !!mail.sender;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Détail du courrier"
        onBack={() => navigation.goBack()}
        right={<View style={styles.readOnlyTag}><Text style={styles.readOnlyTagText}>👁 Lecture seule</Text></View>}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero - read-only, no status dropdown */}
        <Card>
          <View style={styles.heroTop}>
            <Text style={styles.heroRef}>{mail.reference}</Text>
            <Badge label={mail.status} />
          </View>
          <Text style={styles.heroSubject}>{mail.subject}</Text>
          <Text style={styles.heroMeta}>{isIn ? mail.sender : mail.recipient} · {isIn ? mail.dateReceived : mail.dateSent}</Text>
          {mail.category && (
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>🏷 {mail.category}</Text>
            </View>
          )}
        </Card>

        {/* Info — display only, no editing */}
        <Card>
          <InfoRow label="Référence" value={mail.reference} />
          <InfoRow label={isIn ? 'Date reçue' : 'Date envoyée'} value={isIn ? mail.dateReceived : mail.dateSent} />
          <InfoRow label={isIn ? 'Expéditeur' : 'Destinataire'} value={isIn ? mail.sender : mail.recipient} />
          <InfoRow label="Statut" value={mail.status} />
          {mail.category && <InfoRow label="Catégorie" value={mail.category} />}
          {mail.description && <InfoRow label="Description" value={mail.description} last />}
        </Card>

        {/* OCR — view only */}
        {mail.ocrText && (
          <View>
            <SectionTitle title="Texte extrait (OCR)" />
            <OCRBox text={mail.ocrText} />
          </View>
        )}

        {/* Classification — display only */}
        {mail.confidence && (
          <View style={styles.classificationCard}>
            <Text style={styles.classLabel}>Classification</Text>
            <Text style={styles.classCategory}>{mail.category}</Text>
            <View style={styles.classBarTrack}>
              <View style={[styles.classBarFill, { width: `${mail.confidence}%` }]} />
            </View>
            <Text style={styles.classConf}>Confiance : {mail.confidence}%</Text>
          </View>
        )}

        {/* Attachments — view + download only */}
        {mail.attachments?.length > 0 && (
          <View>
            <SectionTitle title={`Pièces jointes (${mail.attachments.length})`} />
            <View style={styles.attachGrid}>
              {mail.attachments.map((f, i) => (
                <AttachmentItem key={i} file={f}
                  onPress={() => navigation.navigate('LecteurDocumentViewer', { file: f })} />
              ))}
            </View>
          </View>
        )}

        {/* Timeline — read only */}
        {mail.timeline?.length > 0 && (
          <Card style={{ backgroundColor: Colors.gray50 }}>
            <SectionTitle title="Historique" />
            <Timeline events={mail.timeline} />
          </Card>
        )}

        {/* No edit/archive/status-change actions for Lecteur */}
        <View style={styles.readOnlyNotice}>
          <Text style={styles.readOnlyNoticeIcon}>ℹ️</Text>
          <Text style={styles.readOnlyNoticeText}>
            Accès en lecture seule. Contactez un Agent ou l'Administrateur pour toute modification.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 },
  readOnlyTag: { backgroundColor: Colors.teal50, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.teal100 },
  readOnlyTagText: { fontSize: 11, fontWeight: '700', color: Colors.teal700 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  heroRef: { fontSize: 11, fontWeight: '800', color: Colors.blue600, fontFamily: 'monospace', letterSpacing: 0.5 },
  heroSubject: { fontSize: 17, fontWeight: '800', color: Colors.blue900, lineHeight: 22, marginBottom: 4 },
  heroMeta: { fontSize: 12, color: Colors.gray500 },
  categoryTag: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: Colors.blue50, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: Colors.blue100 },
  categoryTagText: { fontSize: 11, fontWeight: '600', color: Colors.blue700 },
  classificationCard: { backgroundColor: Colors.blue50, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.blue100 },
  classLabel: { fontSize: 11, fontWeight: '800', color: Colors.blue700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  classCategory: { fontSize: 16, fontWeight: '800', color: Colors.blue900, marginBottom: 8 },
  classBarTrack: { height: 5, backgroundColor: Colors.blue100, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  classBarFill: { height: 5, backgroundColor: Colors.blue400, borderRadius: 3 },
  classConf: { fontSize: 11, color: Colors.blue500, fontWeight: '600' },
  attachGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  readOnlyNotice: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: Colors.teal50, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.teal100 },
  readOnlyNoticeIcon: { fontSize: 16 },
  readOnlyNoticeText: { flex: 1, fontSize: 12, color: Colors.teal700, lineHeight: 17 },
});
