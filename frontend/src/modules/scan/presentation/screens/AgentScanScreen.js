// src/screens/agent/AgentScanScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, PrimaryButton, SecondaryButton } from '../../../../shared/components';
import { Colors, Spacing, Radius, Shadow } from '../../../../shared/theme';

export default function AgentScanScreen({ navigation }) {
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);

  const handleCapture = () => {
    setCaptured(true);
  };

  const handleExport = (format) => {
    setExportFormat(format);
    Alert.alert(
      `Document sauvegardé (${format.toUpperCase()})`,
      `Le document a été enregistré au format ${format.toUpperCase()}.`,
      [
        { text: 'Lancer OCR', onPress: () => navigation.navigate('AgentOCR', { fromScan: true }) },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader
        title="Scanner un document"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={[styles.flashBtn, flash && styles.flashBtnOn]} onPress={() => setFlash(!flash)}>
            <Text style={styles.flashIcon}>⚡</Text>
            <Text style={[styles.flashLabel, flash && { color: Colors.amber400 }]}>{flash ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Camera viewport */}
        <View style={styles.cameraView}>
          {/* Simulated camera background */}
          <View style={styles.cameraInner}>
            {captured ? (
              <>
                <View style={styles.capturedOverlay} />
                <Text style={styles.capturedText}>✓ Document capturé</Text>
              </>
            ) : (
              <>
                {/* Scanner frame with animated corners */}
                <View style={styles.scanFrame}>
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />
                  {/* Scan line */}
                  <View style={styles.scanLine} />
                </View>
                <Text style={styles.cameraHint}>Alignez le document dans le cadre</Text>
              </>
            )}
            {flash && <View style={styles.flashOverlay} />}
          </View>

          {/* Camera controls overlay */}
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.controlBtn} onPress={() => Alert.alert('Galerie', 'Ouvrir la galerie photo')}>
              <Text style={styles.controlBtnIcon}>🖼</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.captureBtn, captured && styles.captureBtnDone]}
              onPress={handleCapture}
              activeOpacity={0.85}
            >
              <View style={[styles.captureInner, captured && styles.captureInnerDone]}>
                {captured && <Text style={styles.captureCheck}>✓</Text>}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn} onPress={() => Alert.alert('Retourner', 'Basculer caméra avant/arrière')}>
              <Text style={styles.controlBtnIcon}>🔄</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Adjust controls */}
        <View style={styles.adjustRow}>
          <TouchableOpacity style={styles.adjustBtn} onPress={() => Alert.alert('Recadrer', 'Recadrer le document')}>
            <Text style={styles.adjustIcon}>✂️</Text>
            <Text style={styles.adjustLabel}>Recadrer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adjustBtn} onPress={() => Alert.alert('Améliorer', 'Améliorer la lisibilité')}>
            <Text style={styles.adjustIcon}>✨</Text>
            <Text style={styles.adjustLabel}>Améliorer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adjustBtn} onPress={() => Alert.alert('Rotation', 'Faire pivoter le document')}>
            <Text style={styles.adjustIcon}>↻</Text>
            <Text style={styles.adjustLabel}>Rotation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adjustBtn} onPress={() => Alert.alert('Contraste', 'Ajuster le contraste')}>
            <Text style={styles.adjustIcon}>◑</Text>
            <Text style={styles.adjustLabel}>Contraste</Text>
          </TouchableOpacity>
        </View>

        {/* Export options */}
        <Card>
          <Text style={styles.exportTitle}>Enregistrer sous</Text>
          <View style={styles.exportRow}>
            <TouchableOpacity
              style={[styles.exportOption, styles.exportPdf, exportFormat === 'pdf' && styles.exportOptionSelected]}
              onPress={() => handleExport('pdf')}
            >
              <Text style={styles.exportOptionIcon}>📄</Text>
              <Text style={[styles.exportOptionLabel, { color: Colors.coral600 }]}>Enregistrer en PDF</Text>
              <Text style={styles.exportOptionSub}>Idéal pour l'archivage</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportOption, styles.exportImg, exportFormat === 'image' && styles.exportOptionSelected]}
              onPress={() => handleExport('image')}
            >
              <Text style={styles.exportOptionIcon}>🖼</Text>
              <Text style={[styles.exportOptionLabel, { color: Colors.blue600 }]}>Enregistrer en image</Text>
              <Text style={styles.exportOptionSub}>JPEG haute résolution</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <PrimaryButton
          title="Procéder à l'OCR →"
          onPress={() => navigation.navigate('AgentOCR', { fromScan: true })}
          disabled={!captured}
          style={!captured && { opacity: 0.5 }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 },
  flashBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.gray900 + '33', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 0.5, borderColor: Colors.gray600 + '44' },
  flashBtnOn: { backgroundColor: Colors.amber50, borderColor: Colors.amber200 },
  flashIcon: { fontSize: 13 },
  flashLabel: { fontSize: 10, fontWeight: '800', color: Colors.gray400 },
  cameraView: { borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.md },
  cameraInner: { backgroundColor: '#0a0e1a', height: 240, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  scanFrame: { width: '72%', height: '75%', borderWidth: 1, borderColor: 'rgba(55,138,221,0.5)', borderRadius: 4, position: 'relative' },
  corner: { width: 18, height: 18, position: 'absolute' },
  cornerTL: { top: -1.5, left: -1.5, borderTopWidth: 3, borderLeftWidth: 3, borderColor: Colors.blue400 },
  cornerTR: { top: -1.5, right: -1.5, borderTopWidth: 3, borderRightWidth: 3, borderColor: Colors.blue400 },
  cornerBL: { bottom: -1.5, left: -1.5, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: Colors.blue400 },
  cornerBR: { bottom: -1.5, right: -1.5, borderBottomWidth: 3, borderRightWidth: 3, borderColor: Colors.blue400 },
  scanLine: { position: 'absolute', top: '50%', left: 0, right: 0, height: 1.5, backgroundColor: Colors.blue400 + '80' },
  cameraHint: { position: 'absolute', bottom: 12, fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  capturedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(29,158,117,0.2)' },
  capturedText: { fontSize: 16, fontWeight: '800', color: Colors.teal400 },
  flashOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,245,200,0.15)' },
  cameraControls: { backgroundColor: '#0a0e1a', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg },
  controlBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  controlBtnIcon: { fontSize: 20 },
  captureBtn: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  captureBtnDone: { borderColor: Colors.teal400 },
  captureInner: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  captureInnerDone: { backgroundColor: Colors.teal400 },
  captureCheck: { fontSize: 22, color: '#fff', fontWeight: '800' },
  adjustRow: { flexDirection: 'row', gap: Spacing.sm },
  adjustBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center', gap: 4, borderWidth: 0.5, borderColor: Colors.border },
  adjustIcon: { fontSize: 20 },
  adjustLabel: { fontSize: 10, fontWeight: '700', color: Colors.gray600 },
  exportTitle: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 12 },
  exportRow: { flexDirection: 'row', gap: Spacing.sm },
  exportOption: { flex: 1, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 1 },
  exportOptionSelected: { borderWidth: 2 },
  exportPdf: { backgroundColor: Colors.coral50, borderColor: Colors.coral200 },
  exportImg: { backgroundColor: Colors.blue50, borderColor: Colors.blue100 },
  exportOptionIcon: { fontSize: 28, marginBottom: 6 },
  exportOptionLabel: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  exportOptionSub: { fontSize: 10, color: Colors.gray400, marginTop: 2 },
});
