// src/screens/lecteur/LecteurDocumentViewerScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, SecondaryButton, Input } from '../../components';
import { Colors, Spacing, Radius, Shadow } from '../../theme';

export default function LecteurDocumentViewerScreen({ navigation, route }) {
  const { file } = route.params || {};
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const totalPages = 3;

  const isPdf = file?.type === 'pdf';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader
        title="Visionneuse de document"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={styles.downloadBtn} onPress={() => Alert.alert('Téléchargement', `${file?.name || 'Document'} téléchargé.`)}>
            <Text style={styles.downloadBtnText}>⬇  Télécharger</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Document info bar */}
        <View style={styles.infoBar}>
          <View style={styles.fileTypePill}>
            <Text style={styles.fileTypeText}>{(file?.type || 'pdf').toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fileName} numberOfLines={1}>{file?.name || 'Document.pdf'}</Text>
            <Text style={styles.fileSize}>{file?.size || '—'}</Text>
          </View>
        </View>

        {/* Main document preview */}
        <View style={styles.docContainer}>
          {/* Fake document content for UI purposes */}
          <View style={styles.docPage}>
            <View style={styles.docHeader}>
              <View style={styles.docHeaderLine} />
              <View style={[styles.docHeaderLine, { width: '60%' }]} />
            </View>
            <View style={styles.docBody}>
              {[100, 90, 95, 80, 100, 75, 88, 60].map((w, i) => (
                <View key={i} style={[styles.docLine, { width: `${w}%`, opacity: 0.12 + i * 0.04 }]} />
              ))}
              <View style={[styles.docLine, { width: '40%', marginTop: 16 }]} />
              {[85, 90, 70].map((w, i) => (
                <View key={`b${i}`} style={[styles.docLine, { width: `${w}%` }]} />
              ))}
            </View>
            <View style={styles.docFooter}>
              <View style={[styles.docLine, { width: '30%', opacity: 0.15 }]} />
            </View>
          </View>

          {/* Page label */}
          <View style={styles.pageLabel}>
            <Text style={styles.pageLabelText}>Page {page} / {totalPages}</Text>
          </View>

          {/* Zoom controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoom((z) => Math.max(50, z - 25))}>
              <Text style={styles.zoomBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.zoomLabel}>{zoom}%</Text>
            <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoom((z) => Math.min(200, z + 25))}>
              <Text style={styles.zoomBtnText}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Page navigation */}
        {isPdf && (
          <View style={styles.pageNav}>
            <TouchableOpacity
              style={[styles.pageNavBtn, page === 1 && styles.pageNavBtnDisabled]}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <Text style={[styles.pageNavText, page === 1 && { color: Colors.gray200 }]}>‹ Précédent</Text>
            </TouchableOpacity>
            <View style={styles.pageIndicator}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.pageDot, page === i + 1 && styles.pageDotActive]}
                  onPress={() => setPage(i + 1)}
                />
              ))}
            </View>
            <TouchableOpacity
              style={[styles.pageNavBtn, page === totalPages && styles.pageNavBtnDisabled]}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <Text style={[styles.pageNavText, page === totalPages && { color: Colors.gray200 }]}>Suivant ›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search in document */}
        <Card>
          <Text style={styles.searchLabel}>Rechercher dans le document</Text>
          <Input
            placeholder="Saisir un terme de recherche…"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 1 && (
            <View style={styles.searchResult}>
              <Text style={styles.searchResultText}>2 occurrences trouvées pour « {searchTerm} »</Text>
            </View>
          )}
        </Card>

        {/* Actions */}
        <SecondaryButton
          title="Ouvrir dans une application externe"
          icon="↗"
          style={{ paddingVertical: 13 }}
          onPress={() => Alert.alert('Ouvrir', 'Ouverture dans l\'application par défaut…')}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 },
  downloadBtn: { backgroundColor: Colors.teal50, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 0.5, borderColor: Colors.teal100 },
  downloadBtnText: { fontSize: 12, fontWeight: '700', color: Colors.teal700 },
  infoBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 0.5, borderColor: Colors.border },
  fileTypePill: { backgroundColor: Colors.blue800, borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: 6 },
  fileTypeText: { fontSize: 11, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  fileName: { fontSize: 13, fontWeight: '700', color: Colors.gray900 },
  fileSize: { fontSize: 11, color: Colors.gray400, marginTop: 1 },
  docContainer: { backgroundColor: '#1a1f2e', borderRadius: Radius.xl, padding: Spacing.lg, minHeight: 320, position: 'relative', ...Shadow.md },
  docPage: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: Radius.md, padding: Spacing.lg, minHeight: 240 },
  docHeader: { marginBottom: Spacing.lg, gap: 8 },
  docHeaderLine: { height: 8, backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 4, width: '80%' },
  docBody: { gap: 6 },
  docLine: { height: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  docFooter: { marginTop: Spacing.xl },
  pageLabel: { position: 'absolute', bottom: 12, left: Spacing.lg },
  pageLabelText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  zoomControls: { position: 'absolute', bottom: 12, right: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  zoomBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  zoomBtnText: { color: '#fff', fontSize: 16, fontWeight: '600', lineHeight: 20 },
  zoomLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '700', minWidth: 34, textAlign: 'center' },
  pageNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageNavBtn: { backgroundColor: Colors.surface, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 0.5, borderColor: Colors.border },
  pageNavBtnDisabled: { opacity: 0.4 },
  pageNavText: { fontSize: 13, fontWeight: '700', color: Colors.blue600 },
  pageIndicator: { flexDirection: 'row', gap: 6 },
  pageDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gray200 },
  pageDotActive: { backgroundColor: Colors.blue800, width: 20 },
  searchLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 },
  searchResult: { backgroundColor: Colors.blue50, borderRadius: Radius.sm, padding: 8, borderWidth: 0.5, borderColor: Colors.blue100 },
  searchResultText: { fontSize: 12, color: Colors.blue700, fontWeight: '600' },
});
