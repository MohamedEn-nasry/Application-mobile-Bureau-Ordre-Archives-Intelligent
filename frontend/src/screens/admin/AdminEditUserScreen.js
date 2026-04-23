// src/screens/admin/AdminEditUserScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Input, Card, PrimaryButton, SecondaryButton, Toggle, Avatar, Badge, SelectInput } from '../../components';
import { Colors, Spacing, Radius, RoleColors } from '../../theme';

const ROLE_PERMS = {
  Admin:   { perms: ['Accès complet au système', 'Gestion des utilisateurs', 'Attribution des rôles', 'Paramètres système', 'Tout le courrier, lecture/écriture'], denied: [] },
  Agent:   { perms: ['Créer et modifier du courrier', 'Scanner des documents', 'Lancer l\'OCR et classifier', 'Mettre à jour les statuts'], denied: ['Gestion des utilisateurs', 'Paramètres système'] },
  Lecteur: { perms: ['Consulter le courrier assigné', 'Rechercher et filtrer les documents', 'Voir les archives et l\'OCR'], denied: ['Créer ou modifier du courrier', 'Scanner, OCR ou classifier', 'Modifier les statuts'] },
};

export default function AdminEditUserScreen({ navigation, route }) {
  const { user } = route.params;
  const [form, setForm] = useState({ fullName: user.fullName, username: user.username, email: user.email, role: user.role, active: user.status === 'Active' });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const roleC = RoleColors[form.role] || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Modifier l'utilisateur" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Profile card */}
        <View style={[styles.profileCard, { backgroundColor: roleC.bg, borderColor: roleC.border }]}>
          <Avatar initials={user.initials} role={user.role} size={56} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: roleC.text }]}>{user.fullName}</Text>
            <Text style={[styles.profileEmail, { color: roleC.text + 'AA' }]}>{user.email}</Text>
          </View>
          <Badge label={user.role} />
        </View>

        {/* Editable fields */}
        <Card>
          <Text style={styles.sectionLabel}>Informations</Text>
          <Input label="Nom complet" value={form.fullName} onChangeText={(v) => set('fullName', v)} />
          <Input label="Nom d'utilisateur" value={form.username} onChangeText={(v) => set('username', v)} />
          <Input label="Email" value={form.email} onChangeText={(v) => set('email', v)} keyboardType="email-address" />
        </Card>

        {/* Role assignment */}
        <Card>
          <Text style={styles.sectionLabel}>Rôle et statut</Text>
          <SelectInput label="Rôle" value={form.role} options={['Admin', 'Agent', 'Lecteur']} onSelect={(v) => set('role', v)} />
          <View style={{ height: 8 }} />
          <Toggle label="Compte actif" sublabel="Autoriser la connexion" value={form.active} onToggle={() => set('active', !form.active)} />
        </Card>

        {/* Permissions summary */}
        <Card style={{ backgroundColor: form.role === 'Admin' ? Colors.purple50 : form.role === 'Agent' ? Colors.blue50 : Colors.teal50 }}>
          <Text style={styles.sectionLabel}>Résumé des permissions — {form.role}</Text>
          {ROLE_PERMS[form.role]?.perms.map((p) => <Text key={p} style={styles.permOk}>✅  {p}</Text>)}
          {ROLE_PERMS[form.role]?.denied.map((p) => <Text key={p} style={styles.permDenied}>❌  {p}</Text>)}
        </Card>

        <PrimaryButton title="Enregistrer les modifications" onPress={() => { Alert.alert('Sauvegardé', 'Informations mises à jour.'); navigation.goBack(); }} />
        <SecondaryButton title="Réinitialiser le mot de passe" icon="🔑" style={{ paddingVertical: 13 }} onPress={() => Alert.alert('Réinitialisation', 'Un e-mail de réinitialisation sera envoyé.')} />
        <PrimaryButton title="Désactiver le compte" danger onPress={() => Alert.alert('Confirmer', 'Désactiver ce compte ?', [{ text: 'Annuler', style: 'cancel' }, { text: 'Désactiver', style: 'destructive', onPress: () => navigation.goBack() }])} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1 },
  profileName: { fontSize: 16, fontWeight: '800' },
  profileEmail: { fontSize: 12, marginTop: 2 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 12 },
  permOk: { fontSize: 13, color: Colors.gray700, marginBottom: 5 },
  permDenied: { fontSize: 13, color: Colors.gray400, marginBottom: 5 },
});
