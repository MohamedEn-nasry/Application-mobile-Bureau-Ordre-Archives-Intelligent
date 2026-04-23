// src/screens/agent/AgentClassificationScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, PrimaryButton, SectionTitle } from '../../components';
import { Colors, Spacing, Radius, Shadow } from '../../theme';

const CATEGORIES = ['Finance / Budget', 'Administratif / Général', 'Juridique / Conformité', 'RH / Personnel', 'Technique / Infrastructure', 'Sécurité / Audit'];

export default function AgentClassificationScreen({ navigation, route }) {
  const mail = route.params?.mail;
  const suggested = mail?.category || 'Finance / Budget';
  const confidence = mail?.confidence || 84;
  const alternatives = mail?.alternativeCategories || [{ label: 'Administratif / Général', confidence: 51 }, { label: 'Juridique / Conformité', confidence: 22 }];
  const [selected, setSelected] = useState(suggested);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Classification" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* AI Card */}
        <View style={styles.aiCard}>
          <Text style={styles.aiLabel}>SUGGESTION IA</Text>
          <View style={styles.aiRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiCategory}>{suggested}</Text>
              <Text style={styles.aiConf}>Score de confiance : {confidence}%</Text>
            </View>
            <View style={styles.aiScore}><Text style={styles.aiScoreText}>{confidence}%</Text></View>
          </View>
          <View style={styles.confTrack}><View style={[styles.confFill, { width: `${confidence}%` }]} /></View>
        </View>

        {/* Alternative suggestions */}
        <Card>
          <SectionTitle title="Suggestions alternatives" />
          <View style={styles.altRow}>
            {alternatives.map((a) => (
              <TouchableOpacity
                key={a.label}
                style={[styles.altCard, selected === a.label && styles.altCardActive]}
                onPress={() => setSelected(a.label)}
              >
                <Text style={[styles.altLabel, selected === a.label && { color: Colors.blue800, fontWeight: '700' }]} numberOfLines={2}>{a.label}</Text>
                <Text style={[styles.altConf, selected === a.label && { color: Colors.blue600 }]}>{a.confidence}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Manual override */}
        <Card>
          <SectionTitle title="Sélection manuelle" />
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catRow, selected === cat && styles.catRowActive]}
              onPress={() => setSelected(cat)}
            >
              <View style={[styles.radio, selected === cat && styles.radioActive]}>
                {selected === cat && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.catLabel, selected === cat && { color: Colors.blue800, fontWeight: '700' }]}>{cat}</Text>
              {selected === cat && <Text style={styles.catCheck}>✓</Text>}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Selected summary */}
        <View style={styles.selectedBanner}>
          <Text style={styles.selectedKey}>Catégorie sélectionnée :</Text>
          <Text style={styles.selectedVal}>{selected}</Text>
        </View>

        <PrimaryButton title="Appliquer la classification" icon="✓"
          onPress={() => Alert.alert('Classification appliquée', `Catégorie : "${selected}"`, [{ text: 'OK', onPress: () => navigation.goBack() }])} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aiCard: { backgroundColor: Colors.blue900, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.md },
  aiLabel: { fontSize: 10, fontWeight: '800', color: Colors.blue300, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  aiRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  aiCategory: { fontSize: 18, fontWeight: '800', color: '#fff', lineHeight: 22 },
  aiConf: { fontSize: 12, color: Colors.blue200, marginTop: 4 },
  aiScore: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.teal400, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.teal200 + '60' },
  aiScoreText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  confTrack: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4, height: 5, overflow: 'hidden' },
  confFill: { backgroundColor: Colors.teal400, height: 5 },
  altRow: { flexDirection: 'row', gap: Spacing.sm },
  altCard: { flex: 1, backgroundColor: Colors.background, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.gray150 },
  altCardActive: { backgroundColor: Colors.blue50, borderColor: Colors.blue400 },
  altLabel: { fontSize: 12, color: Colors.gray700, marginBottom: 4, lineHeight: 16 },
  altConf: { fontSize: 12, fontWeight: '700', color: Colors.gray400 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderRadius: Radius.sm, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight },
  catRowActive: { backgroundColor: Colors.blue50, borderBottomColor: 'transparent' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.gray200, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.blue800 },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.blue800 },
  catLabel: { flex: 1, fontSize: 14, color: Colors.gray700 },
  catCheck: { fontSize: 14, color: Colors.blue600, fontWeight: '800' },
  selectedBanner: { backgroundColor: Colors.teal50, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.teal100 },
  selectedKey: { fontSize: 11, fontWeight: '700', color: Colors.teal600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 },
  selectedVal: { fontSize: 15, fontWeight: '800', color: Colors.teal800 },
});
