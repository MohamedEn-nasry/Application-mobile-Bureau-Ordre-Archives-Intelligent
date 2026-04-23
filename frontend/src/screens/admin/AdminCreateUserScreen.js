// src/screens/admin/AdminCreateUserScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Input, Card, PrimaryButton, Toggle, SelectInput } from '../../components';
import { Colors, Spacing, Radius } from '../../theme';

export default function AdminCreateUserScreen({ navigation }) {
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirm: '', phone: '', role: '', active: true });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Requis';
    if (!form.username.trim()) e.username = 'Requis';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Adresse e-mail invalide';
    if (form.password.length < 6) e.password = 'Minimum 6 caractères';
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    if (!form.role) e.role = 'Sélectionnez un rôle';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    Alert.alert('Compte créé', `L'utilisateur "${form.fullName}" a été créé avec succès.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Créer un utilisateur" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <Card>
          <Text style={styles.sectionLabel}>Informations personnelles</Text>
          <Input label="Nom complet *" placeholder="Prénom Nom" value={form.fullName} onChangeText={(v) => set('fullName', v)} error={errors.fullName} />
          <Input label="Nom d'utilisateur *" placeholder="prenom.nom" value={form.username} onChangeText={(v) => set('username', v)} error={errors.username} />
          <Input label="Adresse e-mail *" placeholder="utilisateur@bureau.dz" value={form.email} onChangeText={(v) => set('email', v)} keyboardType="email-address" error={errors.email} />
          <Input label="Téléphone (optionnel)" placeholder="+213 6XX XXX XXX" value={form.phone} onChangeText={(v) => set('phone', v)} keyboardType="phone-pad" />
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Sécurité</Text>
          <Input label="Mot de passe *" placeholder="Minimum 6 caractères" value={form.password} onChangeText={(v) => set('password', v)} secureTextEntry error={errors.password} />
          <Input label="Confirmer le mot de passe *" placeholder="Répétez le mot de passe" value={form.confirm} onChangeText={(v) => set('confirm', v)} secureTextEntry error={errors.confirm} />
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Rôle et accès</Text>
          <SelectInput label="Rôle *" value={form.role} options={['Admin', 'Agent', 'Lecteur']} onSelect={(v) => set('role', v)} />
          {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

          {form.role && (
            <View style={styles.permPreview}>
              <Text style={styles.permPreviewTitle}>Permissions du rôle {form.role} :</Text>
              {ROLE_PERMS[form.role]?.map((p) => (
                <Text key={p} style={styles.permItem}>✅ {p}</Text>
              ))}
            </View>
          )}

          <View style={{ height: Spacing.sm }} />
          <Toggle label="Compte actif" sublabel="Autoriser la connexion immédiatement" value={form.active} onToggle={() => set('active', !form.active)} />
        </Card>

        <PrimaryButton title="Créer le compte" onPress={handleCreate} icon="✓" />
        <PrimaryButton title="Annuler" onPress={() => navigation.goBack()} style={{ backgroundColor: Colors.gray200 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const ROLE_PERMS = {
  Admin: ['Accès complet au système', 'Gestion des utilisateurs', 'Attribution des rôles', 'Paramètres système', 'Accès à tout le courrier'],
  Agent: ['Créer et modifier du courrier', 'Scanner des documents', 'Lancer l\'OCR', 'Mettre à jour les statuts'],
  Lecteur: ['Consulter le courrier', 'Rechercher et filtrer', 'Voir les archives'],
};

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 12 },
  errorText: { fontSize: 11, color: Colors.red600, marginTop: -8, marginBottom: 8 },
  permPreview: { backgroundColor: Colors.blue50, borderRadius: 8, padding: 12, marginTop: 4, marginBottom: 8 },
  permPreviewTitle: { fontSize: 11, fontWeight: '700', color: Colors.blue800, marginBottom: 6 },
  permItem: { fontSize: 12, color: Colors.blue700, marginBottom: 3 },
});
