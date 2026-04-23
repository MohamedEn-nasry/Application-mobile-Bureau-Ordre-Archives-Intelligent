// src/screens/agent/AgentProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, InfoRow, PrimaryButton, SecondaryButton, Badge } from '../../components';
import { Colors, Spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function AgentProfileScreen({ navigation }) {
  const { currentUser, logout } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Mon profil" onBack={() => navigation.goBack()} />
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{currentUser?.initials}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{currentUser?.fullName}</Text>
          <Text style={styles.role}>Agent opérationnel</Text>
          <View style={{ marginTop: 6 }}><Badge label="Agent" /></View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Card>
          <InfoRow label="Email" value={currentUser?.email} />
          <InfoRow label="Nom d'utilisateur" value={currentUser?.username} />
          <InfoRow label="Téléphone" value={currentUser?.phone || '—'} />
          <InfoRow label="Dernière connexion" value={currentUser?.lastLogin} last />
        </Card>
        <Card>
          <InfoRow label="Rôle" value="Agent" />
          <InfoRow label="Accès" value="Opérationnel" />
          <InfoRow label="Statut" value="Actif" last />
        </Card>
        <SecondaryButton title="Modifier le profil" icon="✏️" style={{ paddingVertical: 13 }} onPress={() => {}} />
        <SecondaryButton title="Changer le mot de passe" icon="🔑" style={{ paddingVertical: 13 }} onPress={() => Alert.alert('Mot de passe', 'Un e-mail de réinitialisation vous sera envoyé.')} />
        <PrimaryButton title="Se déconnecter" danger
          onPress={() => Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Déconnecter', style: 'destructive', onPress: logout },
          ])} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.blue800, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xxl, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  avatar: { width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  avatarText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  name: { fontSize: 18, fontWeight: '800', color: '#fff' },
  role: { fontSize: 12, color: Colors.blue200, marginTop: 2 },
});
