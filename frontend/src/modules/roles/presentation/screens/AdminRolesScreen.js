// src/screens/admin/AdminRolesScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, Badge } from '../../../../shared/components';
import { Colors, Spacing, Radius, RoleColors } from '../../../../shared/theme';

const ROLES = [
  {
    role: 'Admin',
    subtitle: 'Accès complet au système',
    description: 'L\'administrateur dispose de tous les droits. Il gère les utilisateurs, les rôles, les paramètres et accède à l\'intégralité du courrier.',
    perms: [
      { label: 'Accès complet au système', ok: true },
      { label: 'Gérer et créer des utilisateurs', ok: true },
      { label: 'Attribuer et modifier les rôles', ok: true },
      { label: 'Configurer les paramètres système', ok: true },
      { label: 'Tout le courrier (lecture/écriture/archivage)', ok: true },
      { label: 'Rapports et analytique', ok: true },
      { label: 'Scanner des documents / OCR', ok: true },
    ],
  },
  {
    role: 'Agent',
    subtitle: 'Accès opérationnel',
    description: 'L\'agent traite le courrier au quotidien : création, édition, numérisation, OCR et mise à jour des statuts.',
    perms: [
      { label: 'Créer et modifier le courrier', ok: true },
      { label: 'Scanner des documents', ok: true },
      { label: 'Lancer l\'analyse OCR', ok: true },
      { label: 'Appliquer la classification', ok: true },
      { label: 'Mettre à jour les statuts', ok: true },
      { label: 'Gestion des utilisateurs', ok: false },
      { label: 'Paramètres système', ok: false },
      { label: 'Rapports et analytique', ok: false },
    ],
  },
  {
    role: 'Lecteur',
    subtitle: 'Consultation uniquement',
    description: 'Le lecteur consulte le courrier et les documents en lecture seule. Aucune modification n\'est possible.',
    perms: [
      { label: 'Consulter le courrier accessible', ok: true },
      { label: 'Rechercher et filtrer les documents', ok: true },
      { label: 'Voir le texte OCR et la classification', ok: true },
      { label: 'Parcourir les archives', ok: true },
      { label: 'Créer ou modifier le courrier', ok: false },
      { label: 'Scanner ou lancer l\'OCR', ok: false },
      { label: 'Modifier les statuts', ok: false },
      { label: 'Gestion des utilisateurs', ok: false },
    ],
  },
];

export default function AdminRolesScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Rôles et permissions" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Intro */}
        <View style={styles.intro}>
          <Text style={styles.introIcon}>🔐</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>Contrôle d'accès basé sur les rôles</Text>
            <Text style={styles.introText}>Chaque compte est associé à un rôle qui détermine les actions autorisées dans l'application.</Text>
          </View>
        </View>

        {ROLES.map((r) => {
          const c = RoleColors[r.role];
          return (
            <Card key={r.role} style={{ borderLeftWidth: 4, borderLeftColor: c.text }}>
              {/* Header */}
              <View style={styles.roleHeader}>
                <View style={[styles.roleIconWrap, { backgroundColor: c.bg }]}>
                  <Text style={styles.roleIcon}>{r.role === 'Admin' ? '👑' : r.role === 'Agent' ? '⚙️' : '👁'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Badge label={r.role} />
                  <Text style={styles.roleSubtitle}>{r.subtitle}</Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.roleDesc}>{r.description}</Text>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Permissions */}
              <Text style={styles.permsTitle}>Permissions</Text>
              {r.perms.map((p) => (
                <View key={p.label} style={styles.permRow}>
                  <Text style={[styles.permIcon, { color: p.ok ? Colors.teal400 : Colors.red400 }]}>
                    {p.ok ? '✓' : '✕'}
                  </Text>
                  <Text style={[styles.permLabel, !p.ok && styles.permLabelDenied]}>{p.label}</Text>
                </View>
              ))}
            </Card>
          );
        })}

        {/* Note */}
        <View style={styles.note}>
          <Text style={styles.noteText}>
            💡 Les rôles sont attribués lors de la création du compte ou modifiés depuis la fiche utilisateur.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  intro: { flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.blue50, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.blue100, alignItems: 'flex-start' },
  introIcon: { fontSize: 24 },
  introTitle: { fontSize: 14, fontWeight: '800', color: Colors.blue900, marginBottom: 4 },
  introText: { fontSize: 12, color: Colors.blue700, lineHeight: 17 },
  roleHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  roleIconWrap: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  roleIcon: { fontSize: 22 },
  roleSubtitle: { fontSize: 12, color: Colors.gray500, marginTop: 4 },
  roleDesc: { fontSize: 13, color: Colors.gray600, lineHeight: 18, marginBottom: Spacing.md },
  divider: { height: 0.5, backgroundColor: Colors.borderLight, marginBottom: Spacing.md },
  permsTitle: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 10 },
  permRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 7 },
  permIcon: { fontSize: 13, fontWeight: '800', width: 16, textAlign: 'center', marginTop: 1 },
  permLabel: { fontSize: 13, color: Colors.gray700, flex: 1 },
  permLabelDenied: { color: Colors.gray300 },
  note: { backgroundColor: Colors.amber50, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.amber100 },
  noteText: { fontSize: 12, color: Colors.amber600, lineHeight: 18 },
});
