// src/screens/agent/AgentAddIncomingScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Input, Card, PrimaryButton, SelectInput } from '../../components';
import { Colors, Spacing, Radius } from '../../theme';

export default function AgentAddIncomingScreen({ navigation }) {
  const [form, setForm] = useState({ reference: '', dateReceived: '', sender: '', subject: '', description: '', status: 'Pending' });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (!form.reference.trim()) e.reference = 'Requis';
    if (!form.sender.trim()) e.sender = 'Requis';
    if (!form.subject.trim()) e.subject = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    Alert.alert('Enregistré', 'Le courrier entrant a été créé avec succès.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Ajouter courrier entrant" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.sectionLabel}>Identification</Text>
          <Input label="Référence *" placeholder="IN-2026-XXXX" value={form.reference} onChangeText={(v) => set('reference', v)} error={errors.reference} />
          <Input label="Date de réception" placeholder="JJ/MM/AAAA" value={form.dateReceived} onChangeText={(v) => set('dateReceived', v)} />
          <Input label="Expéditeur *" placeholder="Organisation ou personne" value={form.sender} onChangeText={(v) => set('sender', v)} error={errors.sender} />
          <Input label="Objet *" placeholder="Objet du courrier" value={form.subject} onChangeText={(v) => set('subject', v)} error={errors.subject} />
          <Input label="Description" placeholder="Description optionnelle…" value={form.description} onChangeText={(v) => set('description', v)} multiline numberOfLines={4} />
        </Card>
        <Card>
          <Text style={styles.sectionLabel}>Statut et pièces jointes</Text>
          <SelectInput label="Statut initial" value={form.status} options={['Pending', 'In Progress', 'Processed', 'Urgent']} onSelect={(v) => set('status', v)} />
          <Text style={styles.label}>Pièces jointes</Text>
          <TouchableOpacity style={styles.attachArea} onPress={() => Alert.alert('Pièces jointes', 'Sélecteur de fichiers (expo-document-picker)')}>
            <Text style={styles.attachIcon}>📎</Text>
            <Text style={styles.attachTitle}>Appuyer pour joindre des fichiers</Text>
            <Text style={styles.attachSub}>PDF, DOCX, XLSX, Images</Text>
          </TouchableOpacity>
        </Card>
        <PrimaryButton title="Enregistrer le courrier" onPress={handleSave} icon="✓" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '700', color: Colors.gray600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 4 },
  attachArea: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.blue200, borderRadius: Radius.md, padding: Spacing.xl, alignItems: 'center', backgroundColor: Colors.blue50 },
  attachIcon: { fontSize: 32, marginBottom: 8 },
  attachTitle: { fontSize: 13, fontWeight: '700', color: Colors.blue600 },
  attachSub: { fontSize: 11, color: Colors.gray400, marginTop: 4 },
});
