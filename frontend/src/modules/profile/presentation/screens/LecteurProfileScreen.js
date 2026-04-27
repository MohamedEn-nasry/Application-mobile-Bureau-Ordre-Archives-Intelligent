// src/screens/lecteur/LecteurProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, InfoRow, PrimaryButton, SecondaryButton, Badge } from '../../../../shared/components';
import { Colors, Spacing } from '../../../../shared/theme';
import { useAuth } from '../../../../context/AuthContext';

export default function LecteurProfileScreen({ navigation }) {
  const { currentUser, logout } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Mon profil" onBack={() => navigation.goBack()} />

      {/* Profile header — teal accent for Lecteur */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{currentUser?.initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{currentUser?.fullName}</Text>
          <Text style={styles.roleLabel}>Lecteur — Consultation uniquement</Text>
          <View style={{ marginTop: 6 }}><Badge label="Lecteur" /></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <Card>
          <Text style={styles.sectionLabel}>Informations du compte</Text>
          <InfoRow label="Nom complet" value={currentUser?.fullName} />
          <InfoRow label="Nom d'utilisateur" value={currentUser?.username} />
          <InfoRow label="Adresse e-mail" value={currentUser?.email} />
          <InfoRow label="Téléphone" value={currentUser?.phone || '—'} />
          <InfoRow label="Dernière connexion" value={currentUser?.lastLogin} last />
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Niveau d'accès</Text>
          <InfoRow label="Rôle" value="Lecteur" />
          <InfoRow label="Type d'accès" value="Lecture seule" />
          <InfoRow label="Statut" value="Actif" last />
        </Card>

        {/* Permissions summary */}
        <Card style={{ backgroundColor: Colors.teal50, borderColor: Colors.teal100 }}>
          <Text style={[styles.sectionLabel, { color: Colors.teal800 }]}>Vos permissions</Text>
          {[
            'Consulter le courrier accessible',
            'Rechercher et filtrer les documents',
            'Voir le texte OCR et la classification',
            'Parcourir les archives',
          ].map((p) => (
            <Text key={p} style={styles.permOk}>✅  {p}</Text>
          ))}
          {[
            'Créer ou modifier le courrier',
            'Modifier les statuts',
            'Scanner ou lancer l\'OCR',
          ].map((p) => (
            <Text key={p} style={styles.permDenied}>❌  {p}</Text>
          ))}
        </Card>

        {/* Only password change allowed — no edit profile for Lecteur */}
        <SecondaryButton
          title="Changer le mot de passe"
          icon="🔑"
          style={{ paddingVertical: 13 }}
          onPress={() => Alert.alert('Mot de passe', 'Un e-mail de réinitialisation vous sera envoyé.')}
        />

        <PrimaryButton
          title="Se déconnecter"
          danger
          onPress={() =>
            Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Déconnecter', style: 'destructive', onPress: logout },
            ])
          }
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.teal800, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xxl, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  avatar: { width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  avatarText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  name: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
  roleLabel: { fontSize: 12, color: Colors.teal100, marginTop: 2 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 12 },
  permOk: { fontSize: 13, color: Colors.gray700, marginBottom: 6 },
  permDenied: { fontSize: 13, color: Colors.gray300, marginBottom: 6 },
});
