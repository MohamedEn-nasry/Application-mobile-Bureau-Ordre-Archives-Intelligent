// src/screens/admin/AdminMailHistoryScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, Timeline, Badge } from '../../components';
import { Colors, Spacing, Radius } from '../../theme';

const FULL_HISTORY = [
  { label: 'Courrier créé et enregistré', date: 'Système', color: 'blue', actor: 'Système automatique' },
  { label: 'OCR lancé automatiquement', date: '+3 min', color: 'teal', actor: 'Système automatique' },
  { label: 'Assigné à Sara Benali', date: '+10 min', color: 'blue', actor: 'Admin : Ahmed Mehdi' },
  { label: 'Statut → En attente', date: '+15 min', color: 'amber', actor: 'Sara Benali' },
  { label: 'Classification appliquée : Finance / Budget', date: '+20 min', color: 'teal', actor: 'Sara Benali' },
];

export default function AdminMailHistoryScreen({ navigation, route }) {
  const { mail } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Historique du courrier" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }}>
        <Card>
          <Text style={styles.ref}>{mail.reference}</Text>
          <Text style={styles.subject} numberOfLines={2}>{mail.subject}</Text>
          <View style={{ marginTop: 8 }}><Badge label={mail.status} /></View>
        </Card>
        <Card>
          <Text style={styles.sectionLabel}>Chronologie complète</Text>
          <Timeline events={[...FULL_HISTORY, ...(mail.timeline || [])]} />
        </Card>
        <Card style={{ backgroundColor: Colors.gray50 }}>
          <Text style={styles.sectionLabel}>Dernière modification</Text>
          <Text style={{ fontSize: 13, color: Colors.gray700 }}>Par Sara Benali · Aujourd'hui à 09:45</Text>
          <Text style={{ fontSize: 12, color: Colors.gray400, marginTop: 2 }}>Statut mis à jour → En attente de validation</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ref: { fontSize: 11, fontWeight: '800', color: Colors.blue600, fontFamily: 'monospace', marginBottom: 4 },
  subject: { fontSize: 16, fontWeight: '700', color: Colors.blue900 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 12 },
});
