// src/screens/admin/AdminProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, InfoRow, PrimaryButton, SecondaryButton, Badge, Input } from '../../components';
import { Colors, Spacing, Radius, Shadow } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function AdminProfileScreen({ navigation }) {
  const { currentUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.fullName || '');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader
        title="Mon profil"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.blue600 }}>{editing ? 'Annuler' : '✏️ Modifier'}</Text>
          </TouchableOpacity>
        }
      />

      {/* Profile header */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{currentUser?.initials}</Text>
          <TouchableOpacity style={styles.avatarEdit}><Text style={{ fontSize: 12 }}>📷</Text></TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{currentUser?.fullName}</Text>
          <Text style={styles.role}>Administrateur système</Text>
          <View style={{ marginTop: 6 }}><Badge label="Admin" /></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {editing ? (
          <Card>
            <Text style={styles.sectionLabel}>Modifier le profil</Text>
            <Input label="Nom complet" value={name} onChangeText={setName} />
            <Input label="Email" value={currentUser?.email} editable={false} />
            <Input label="Téléphone" value={currentUser?.phone || ''} keyboardType="phone-pad" />
            <PrimaryButton title="Enregistrer" onPress={() => { setEditing(false); Alert.alert('Profil mis à jour'); }} />
          </Card>
        ) : (
          <Card>
            <Text style={styles.sectionLabel}>Informations du compte</Text>
            <InfoRow label="Nom complet" value={currentUser?.fullName} />
            <InfoRow label="Nom d'utilisateur" value={currentUser?.username} />
            <InfoRow label="Adresse e-mail" value={currentUser?.email} />
            <InfoRow label="Téléphone" value={currentUser?.phone || '—'} />
            <InfoRow label="Rôle" value="Admin" />
            <InfoRow label="Dernière connexion" value={currentUser?.lastLogin} last />
          </Card>
        )}

        <Card>
          <Text style={styles.sectionLabel}>Sécurité</Text>
          <SecondaryButton title="Changer le mot de passe" icon="🔑" style={styles.actionBtn}
            onPress={() => Alert.alert('Mot de passe', 'Un e-mail de réinitialisation vous sera envoyé.')} />
          <SecondaryButton title="Sessions actives" icon="📱" style={[styles.actionBtn, { marginTop: 8 }]}
            onPress={() => Alert.alert('Sessions', '1 session active — cet appareil.')} />
        </Card>

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
  header: { backgroundColor: Colors.blue900, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xxl, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  avatarWrap: { width: 66, height: 66, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  avatarText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  avatarEdit: { position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.teal400, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.blue900 },
  name: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
  role: { fontSize: 12, color: Colors.blue200, marginTop: 2 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 12 },
  actionBtn: { paddingVertical: 13 },
});
