import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCategories } from '../hooks/useCategories';

type CourrierFormData = {
  reference: string;
  type: string;
  dateCourrier: string;
  expediteur?: string | null;
  destinataire?: string | null;
  objet: string;
  description?: string | null;
  statut?: string;
  texteOcr?: string | null;
  categorieId?: number | null;
  assigneA?: number | null;
  dateEcheance?: string | null;
};

interface CourrierFormProps {
  onSubmit: (courrier: CourrierFormData) => void;
  isLoading: boolean;
  error: string | null;
  initialData?: any;

  // اختياري: من بعد يمكن تمرر navigation نحو شاشة OCR
  onOcrPress?: () => void;
}

export const CourrierForm = ({
  onSubmit,
  isLoading,
  error,
  initialData,
  onOcrPress,
}: CourrierFormProps) => {
  const isEditMode = !!initialData;

  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  const [showCategorieModal, setShowCategorieModal] = useState(false);

  const [reference, setReference] = useState(initialData?.Reference || '');
  const [type, setType] = useState(initialData?.Type || 'Entrant');

  const [dateCourrier, setDateCourrier] = useState(
    initialData?.DateCourrier
      ? formatInputDate(initialData.DateCourrier)
      : formatInputDate(new Date())
  );

  const [expediteur, setExpediteur] = useState(initialData?.Expediteur || '');
  const [destinataire, setDestinataire] = useState(
    initialData?.Destinataire || ''
  );

  const [objet, setObjet] = useState(initialData?.Objet || '');
  const [description, setDescription] = useState(
    initialData?.Description || ''
  );

  const [statut, setStatut] = useState(initialData?.Statut || 'ATraiter');

  // لا يظهر للمستخدم في الإدخال اليدوي، لكنه يبقى في state
  // لكي نستعمله لاحقاً عندما ترجع نتيجة OCR
  const [texteOcr] = useState(initialData?.TexteOcr || '');

  const [categorieId, setCategorieId] = useState<number | null>(
    initialData?.CategorieId ? Number(initialData.CategorieId) : null
  );

  const [assigneA, setAssigneA] = useState(
    initialData?.AssigneA ? String(initialData.AssigneA) : ''
  );

  const [dateEcheance, setDateEcheance] = useState(
    initialData?.DateEcheance ? formatInputDate(initialData.DateEcheance) : ''
  );

  const [fieldError, setFieldError] = useState('');

  const selectedCategorie = categories.find(
    item => Number(item.id) === Number(categorieId)
  );

  const handleOcrPress = () => {
    if (onOcrPress) {
      onOcrPress();
      return;
    }

    console.log('Open OCR camera screen');
  };

  const handleSubmit = () => {
    if (!reference.trim()) {
      setFieldError('La référence est obligatoire.');
      return;
    }

    if (!dateCourrier.trim()) {
      setFieldError('La date du courrier est obligatoire.');
      return;
    }

    if (type === 'Entrant' && !expediteur.trim()) {
      setFieldError("L'expéditeur est obligatoire pour un courrier entrant.");
      return;
    }

    if (type === 'Sortant' && !destinataire.trim()) {
      setFieldError('Le destinataire est obligatoire pour un courrier sortant.');
      return;
    }

    if (!objet.trim()) {
      setFieldError("L'objet est obligatoire.");
      return;
    }

    if (!categorieId) {
      setFieldError('La catégorie est obligatoire.');
      return;
    }

    setFieldError('');

    onSubmit({
      reference: reference.trim(),
      type,
      dateCourrier: toIsoDate(dateCourrier),
      expediteur: type === 'Entrant' ? expediteur.trim() : null,
      destinataire: type === 'Sortant' ? destinataire.trim() : null,
      objet: objet.trim(),
      description: description.trim() || null,
      statut,
      texteOcr: texteOcr.trim() || null,
      categorieId: categorieId,
      assigneA: assigneA ? Number(assigneA) : null,
      dateEcheance: dateEcheance ? toIsoDate(dateEcheance) : null,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEditMode ? 'Modifier le courrier' : 'Créer un courrier'}
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📩 Gestion des courriers entrants et sortants du bureau d’ordre
        </Text>
      </View>

      <View style={styles.formRow}>
        <View style={styles.card}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {fieldError ? <Text style={styles.error}>{fieldError}</Text> : null}

          <Text style={styles.label}>TYPE</Text>
          <View style={styles.typeBox}>
            {['Entrant', 'Sortant'].map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.typeButton,
                  type === item && styles.typeButtonActive,
                ]}
                onPress={() => setType(item)}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === item && styles.typeTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>RÉFÉRENCE</Text>
          <TextInput
            style={styles.input}
            placeholder="ENT-2026-001"
            placeholderTextColor="#94a3b8"
            value={reference}
            onChangeText={setReference}
          />

          <Text style={styles.label}>DATE COURRIER</Text>
          <TextInput
            style={styles.input}
            placeholder="2026-05-03"
            placeholderTextColor="#94a3b8"
            value={dateCourrier}
            onChangeText={setDateCourrier}
          />

          {type === 'Entrant' ? (
            <>
              <Text style={styles.label}>EXPÉDITEUR</Text>
              <TextInput
                style={styles.input}
                placeholder="Direction des Ressources Humaines"
                placeholderTextColor="#94a3b8"
                value={expediteur}
                onChangeText={setExpediteur}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>DESTINATAIRE</Text>
              <TextInput
                style={styles.input}
                placeholder="Commune de Rabat"
                placeholderTextColor="#94a3b8"
                value={destinataire}
                onChangeText={setDestinataire}
              />
            </>
          )}

          <Text style={styles.label}>OBJET</Text>
          <TextInput
            style={styles.input}
            placeholder="Objet du courrier"
            placeholderTextColor="#94a3b8"
            value={objet}
            onChangeText={setObjet}
          />

          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description..."
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {isEditMode ? (
            <>
              <Text style={styles.label}>STATUT</Text>
              <View style={styles.statusBox}>
                {[
                  'ATraiter',
                  'EnTraitement',
                  'Traite',
                  'Archive',
                  'Pret',
                  'Envoye',
                ].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.statusButton,
                      statut === item && styles.statusButtonActive,
                    ]}
                    onPress={() => setStatut(item)}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        statut === item && styles.statusTextActive,
                      ]}
                    >
                      {getStatusLabel(item)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : null}

          <Text style={styles.label}>CATÉGORIE</Text>
          <TouchableOpacity
            style={styles.selectBox}
            activeOpacity={0.85}
            onPress={() => setShowCategorieModal(true)}
          >
            <Text
              style={[
                styles.selectText,
                !selectedCategorie && styles.selectPlaceholder,
              ]}
              numberOfLines={1}
            >
              {isLoadingCategories
                ? 'Chargement...'
                : selectedCategorie
                  ? selectedCategorie.Nom
                  : 'Choisir une catégorie'}
            </Text>

            <Text style={styles.selectChevron}>⌄</Text>
          </TouchableOpacity>

          {categoriesError ? (
            <Text style={styles.fieldWarning}>{categoriesError}</Text>
          ) : null}

          <Text style={styles.label}>ASSIGNÉ À</Text>
          <TextInput
            style={styles.input}
            placeholder="ID utilisateur"
            placeholderTextColor="#94a3b8"
            value={assigneA}
            onChangeText={setAssigneA}
            keyboardType="numeric"
          />

          <Text style={styles.label}>DATE ÉCHÉANCE</Text>
          <TextInput
            style={styles.input}
            placeholder="2026-05-10"
            placeholderTextColor="#94a3b8"
            value={dateEcheance}
            onChangeText={setDateEcheance}
          />
        </View>

        <TouchableOpacity
          style={styles.ocrSideButton}
          activeOpacity={0.85}
          onPress={handleOcrPress}
        >
          <Text style={styles.ocrCameraIcon}>📷</Text>
          <Text style={styles.ocrSideText}>OCR</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCategorieModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategorieModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choisir une catégorie</Text>

            <ScrollView style={styles.modalList}>
              {categories.length > 0 ? (
                categories.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.categorieOption,
                      Number(item.id) === Number(categorieId) &&
                        styles.categorieOptionActive,
                    ]}
                    onPress={() => {
                      setCategorieId(Number(item.id));
                      setShowCategorieModal(false);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.categorieName}>{item.Nom}</Text>

                      {item.Description ? (
                        <Text style={styles.categorieDescription}>
                          {item.Description}
                        </Text>
                      ) : null}
                    </View>

                    {Number(item.id) === Number(categorieId) ? (
                      <Text style={styles.checkMark}>✓</Text>
                    ) : null}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyCategorie}>
                  Aucune catégorie disponible.
                </Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCategorieModal(false)}
            >
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginTop: 20 }}
        />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {isEditMode ? 'Enregistrer les modifications' : 'Créer le courrier'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const formatInputDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const toIsoDate = (date: string) => {
  return `${date}T00:00:00`;
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ATraiter':
      return 'En attente';
    case 'EnTraitement':
      return 'En traitement';
    case 'Traite':
      return 'Traité';
    case 'Archive':
      return 'Archivé';
    case 'Pret':
      return 'Prêt';
    case 'Envoye':
      return 'Envoyé';
    default:
      return status;
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 45,
    backgroundColor: '#f8fafc',
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 20,
  },

  infoBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
  },

  infoText: {
    color: '#1d4ed8',
    fontWeight: '600',
    fontSize: 14,
  },

  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 18,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  error: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '700',
  },

  typeBox: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },

  typeButtonActive: {
    backgroundColor: '#dbeafe',
  },

  typeText: {
    color: '#64748b',
    fontWeight: '800',
  },

  typeTextActive: {
    color: '#2563eb',
  },

  statusBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },

  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
  },

  statusButtonActive: {
    backgroundColor: '#dbeafe',
  },

  statusText: {
    color: '#64748b',
    fontWeight: '700',
  },

  statusTextActive: {
    color: '#2563eb',
  },

  ocrSideButton: {
    width: 58,
    minHeight: 92,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },

  ocrCameraIcon: {
    fontSize: 24,
    marginBottom: 6,
  },

  ocrSideText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },

  selectBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectText: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '600',
    flex: 1,
  },

  selectPlaceholder: {
    color: '#94a3b8',
    fontWeight: '500',
  },

  selectChevron: {
    color: '#64748b',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },

  fieldWarning: {
    color: '#d97706',
    fontSize: 12,
    fontWeight: '700',
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    maxHeight: '75%',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 14,
  },

  modalList: {
    maxHeight: 380,
  },

  categorieOption: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  categorieOptionActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },

  categorieName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },

  categorieDescription: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 13,
  },

  checkMark: {
    color: '#2563eb',
    fontSize: 20,
    fontWeight: '900',
  },

  emptyCategorie: {
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: '700',
  },

  modalCloseButton: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalCloseText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
  },

  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 20,
    alignItems: 'center',
  },

  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});