// src/screens/agent/AgentOCRScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, PrimaryButton, SecondaryButton } from '../../../../shared/components';
import { Colors, Spacing, Radius, Shadow } from '../../../../shared/theme';

const DEFAULT_TEXT = `Direction des Finances – République Algérienne
Réf: MF/DG/2026-0892
Objet: Demande d'allocation budgétaire T2 2026
Conformément à la directive n°22/2026, nous sollicitons
l'allocation des crédits budgétaires pour le second
trimestre de l'exercice en cours.

Montant demandé : 4 500 000,00 DZD
Échéance de réponse : 20 Avril 2026

Directeur des Finances
M. Abdelkader BENHAMOU`;

export default function AgentOCRScreen({ navigation, route }) {
  const mail = route.params?.mail;
  const [ocrText, setOcrText] = useState(mail?.ocrText || DEFAULT_TEXT);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const wordCount = ocrText.trim().split(/\s+/).length;
  const lineCount = ocrText.split('\n').length;

  const displayText = searchTerm
    ? ocrText.split('\n').map((line) =>
        line.toLowerCase().includes(searchTerm.toLowerCase())
          ? `▶ ${line}`
          : `   ${line}`
      ).join('\n')
    : ocrText;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Résultat OCR" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Document preview */}
        <View style={styles.docPreview}>
          <Text style={styles.docPreviewIcon}>📄</Text>
          <View>
            <Text style={styles.docPreviewName}>{mail?.reference || 'Document numérisé'}</Text>
            <Text style={styles.docPreviewMeta}>Précision OCR : 97% · {wordCount} mots · {lineCount} lignes</Text>
          </View>
        </View>

        {/* Search inside text */}
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans le texte…"
            placeholderTextColor={Colors.gray300}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm ? <TouchableOpacity onPress={() => setSearchTerm('')}><Text style={styles.clearBtn}>✕</Text></TouchableOpacity> : null}
        </View>

        {/* OCR text editor */}
        <Card>
          <View style={styles.ocrHeader}>
            <Text style={styles.ocrHeaderLabel}>Texte extrait — modifiable</Text>
            {confirmed && <View style={styles.confirmedTag}><Text style={styles.confirmedTagText}>✓ Confirmé</Text></View>}
          </View>
          <View style={[styles.ocrTextWrap, confirmed && styles.ocrTextWrapConfirmed]}>
            <TextInput
              style={styles.ocrTextInput}
              value={displayText}
              onChangeText={setOcrText}
              multiline
              editable={!searchTerm}
              textAlignVertical="top"
            />
          </View>
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[['Mots', wordCount], ['Lignes', lineCount], ['Précision', '97%']].map(([label, val]) => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statNum}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          title={confirmed ? '✓ OCR Confirmé' : 'Confirmer l\'OCR'}
          style={confirmed ? { backgroundColor: Colors.teal600 } : {}}
          onPress={() => { setConfirmed(true); Alert.alert('OCR confirmé', 'Le texte a été sauvegardé.'); }}
        />
        <SecondaryButton title="Joindre à un courrier" icon="📎" style={{ paddingVertical: 13 }}
          onPress={() => { Alert.alert('Joint', 'OCR attaché au courrier.'); navigation.goBack(); }} />
        <SecondaryButton title="Passer à la classification →" icon="🏷" style={{ paddingVertical: 13 }}
          onPress={() => navigation.navigate('AgentClassification', { mail, ocrText })} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  docPreview: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.blue900, borderRadius: Radius.lg, padding: Spacing.md },
  docPreviewIcon: { fontSize: 32 },
  docPreviewName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  docPreviewMeta: { fontSize: 11, color: Colors.blue200, marginTop: 2 },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.gray150, paddingHorizontal: Spacing.md, gap: 8 },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: Colors.gray900, paddingVertical: 11 },
  clearBtn: { fontSize: 14, color: Colors.gray400, paddingHorizontal: 4 },
  ocrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ocrHeaderLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7 },
  confirmedTag: { backgroundColor: Colors.teal50, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: Colors.teal100 },
  confirmedTagText: { fontSize: 11, fontWeight: '700', color: Colors.teal600 },
  ocrTextWrap: { backgroundColor: Colors.blue50, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.blue100 },
  ocrTextWrapConfirmed: { borderColor: Colors.teal400 },
  ocrTextInput: { fontSize: 12, color: Colors.blue800, fontFamily: 'monospace', lineHeight: 20, minHeight: 160 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  stat: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.blue800 },
  statLabel: { fontSize: 10, color: Colors.gray400, marginTop: 2 },
});
