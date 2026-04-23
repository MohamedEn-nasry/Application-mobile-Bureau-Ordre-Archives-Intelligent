// src/screens/admin/AdminSettingsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, Toggle, PrimaryButton, SettingsRow } from '../../components';
import { Colors, Spacing, Radius } from '../../theme';

export default function AdminSettingsScreen({ navigation }) {
  const [s, setS] = useState({
    emailAlerts: true, pushNotif: true, securityAlerts: true,
    twoFactor: false, sessionLock: true,
    autoOCR: true, autoClassify: true,
    autoArchive: true,
  });
  const toggle = (k) => setS((prev) => ({ ...prev, [k]: !prev[k] }));

  const sections = [
    {
      title: 'Général',
      rows: [
        { label: 'Langue de l\'application', sub: 'Français', right: <Text style={styles.link}>Modifier</Text> },
        { label: 'Fuseau horaire', sub: 'Africa/Alger (UTC+1)', right: <Text style={styles.link}>Modifier</Text> },
        { label: 'Sauvegarde', sub: 'Dernière sauvegarde : 13 Avr 2026', right: <Text style={styles.link}>Forcer</Text>, last: true },
      ],
    },
    {
      title: 'Notifications',
      rows: [
        { label: 'Alertes par e-mail', right: <Toggle value={s.emailAlerts} onToggle={() => toggle('emailAlerts')} /> },
        { label: 'Notifications push', right: <Toggle value={s.pushNotif} onToggle={() => toggle('pushNotif')} /> },
        { label: 'Alertes de sécurité', right: <Toggle value={s.securityAlerts} onToggle={() => toggle('securityAlerts')} />, last: true },
      ],
    },
    {
      title: 'Sécurité',
      rows: [
        { label: 'Authentification à deux facteurs', sub: 'Recommandé pour les admins', right: <Toggle value={s.twoFactor} onToggle={() => toggle('twoFactor')} /> },
        { label: 'Verrouillage de session', sub: 'Après 30 min d\'inactivité', right: <Toggle value={s.sessionLock} onToggle={() => toggle('sessionLock')} /> },
        { label: 'Tentatives de connexion max', sub: '5 tentatives avant blocage', right: <Text style={styles.link}>5</Text>, last: true },
      ],
    },
    {
      title: 'OCR et Classification IA',
      rows: [
        { label: 'OCR automatique à l\'import', sub: 'Lancer l\'OCR sur chaque nouveau document', right: <Toggle value={s.autoOCR} onToggle={() => toggle('autoOCR')} /> },
        { label: 'Classification automatique', sub: 'Appliquer si confiance ≥ 75%', right: <Toggle value={s.autoClassify} onToggle={() => toggle('autoClassify')} /> },
        { label: 'Seuil de confiance minimum', sub: 'Actuellement : 75%', right: <Text style={styles.link}>Modifier</Text>, last: true },
      ],
    },
    {
      title: 'Archivage et sauvegarde',
      rows: [
        { label: 'Archivage automatique', sub: 'Archiver après traitement', right: <Toggle value={s.autoArchive} onToggle={() => toggle('autoArchive')} /> },
        { label: 'Délai avant archivage', sub: 'Actuellement : 90 jours', right: <Text style={styles.link}>Modifier</Text> },
        { label: 'Fréquence de sauvegarde', sub: 'Chaque nuit à 02:00', right: <Text style={styles.link}>Modifier</Text>, last: true },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Paramètres système" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {sections.map((sec) => (
          <Card key={sec.title}>
            <Text style={styles.sectionLabel}>{sec.title}</Text>
            {sec.rows.map((row, i) => (
              <SettingsRow key={row.label} label={row.label} sub={row.sub} right={row.right} last={row.last} />
            ))}
          </Card>
        ))}

        <PrimaryButton title="Enregistrer les paramètres" onPress={() => Alert.alert('Sauvegardé', 'Les paramètres ont été mis à jour.')} />
        <TouchableOpacity style={styles.profileLink} onPress={() => navigation.navigate('AdminProfile')}>
          <Text style={styles.profileLinkText}>👤  Mon profil</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 4 },
  link: { fontSize: 13, fontWeight: '700', color: Colors.blue600 },
  profileLink: { alignItems: 'center', paddingVertical: 12 },
  profileLinkText: { fontSize: 14, fontWeight: '600', color: Colors.blue600 },
});
