import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { useCategories } from '../hooks/useCategories';
import { PendingOcrAttachment } from '../hooks/useCourrierOcrAttachment';
import {
  ConfirmOcrPayloadModel,
  SelectedFileModel,
} from '../../data/models/PieceJointeModels';

import { useUserEmailLookup } from '../../../users/presentation/hooks/useUserEmailLookup';
import { CategorieSelectorModal } from '../../../../shared/presentation/components/CategorieSelectorModal';

type CourrierType = 'Entrant' | 'Sortant';

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

  forcedType?: CourrierType;
  hideType?: boolean;

  pendingAttachment?: PendingOcrAttachment | null;
  onPreviewOcr?: (
    file: SelectedFileModel
  ) => Promise<PendingOcrAttachment | null>;
  onConfirmOcr?: (payload: ConfirmOcrPayloadModel) => void;

  onOcrPress?: () => void;
}

const DateTimeField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const pickerValue = parseInputDateTime(value) || new Date();

  if (Platform.OS === 'web') {
    return (
      <View style={styles.dateTimeWebWrapper}>
        {React.createElement('input', {
          type: 'datetime-local',
          value,
          onChange: (event: any) => onChange(event.target.value),
          style: {
            width: '100%',
            height: 48,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: '#0f172a',
            fontSize: 15,
            fontFamily: 'inherit',
          },
        })}
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.input}
        activeOpacity={0.85}
        onPress={() => setShowPicker(true)}
      >
        <Text style={value ? styles.dateValue : styles.datePlaceholder}>
          {value ? formatDisplayDateTime(value) : 'Choisir date et heure'}
        </Text>
      </TouchableOpacity>

      {showPicker ? (
        <DateTimePicker
          value={pickerValue}
          mode="datetime"
          display="default"
          onChange={(_event, selectedDate) => {
            setShowPicker(false);

            if (!selectedDate) return;

            onChange(formatInputDateTime(selectedDate));
          }}
        />
      ) : null}
    </>
  );
};

export const CourrierForm = ({
  onSubmit,
  isLoading,
  error,
  initialData,
  forcedType,
  hideType = false,
  pendingAttachment,
  onPreviewOcr,
  onConfirmOcr,
  onOcrPress,
}: CourrierFormProps) => {
  const isEditMode = !!initialData;

  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  const {
    suggestions: userSuggestions,
    isSearching: isSearchingUsers,
    lookupError,
    searchUsers,
    clearSuggestions,
  } = useUserEmailLookup();

  const [showCategorieModal, setShowCategorieModal] = useState(false);
  const [ocrModalVisible, setOcrModalVisible] = useState(false);

  const [reference, setReference] = useState(initialData?.Reference || '');

  const [type, setType] = useState<CourrierType>(
    forcedType || initialData?.Type || 'Entrant'
  );

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

  const [texteOcr, setTexteOcr] = useState(initialData?.TexteOcr || '');

  const [categorieId, setCategorieId] = useState<number | null>(
    initialData?.CategorieId ? Number(initialData.CategorieId) : null
  );

  const [assigneA, setAssigneA] = useState(
    initialData?.AssigneA ? String(initialData.AssigneA) : ''
  );

  const [dateEcheance, setDateEcheance] = useState(
    initialData?.DateEcheance
      ? formatInputDateTime(initialData.DateEcheance)
      : ''
  );

  const [assigneAEmail, setAssigneAEmail] = useState(
    initialData?.AssigneAEmail || ''
  );

  const [fieldError, setFieldError] = useState('');
  const [editableOcrText, setEditableOcrText] = useState('');
  const [ocrWasEdited, setOcrWasEdited] = useState(false);



  useEffect(() => {
    if (forcedType) {
      setType(forcedType);
    }
  }, [forcedType]);

  const selectedCategorie = categories.find(
    item => Number(item.id) === Number(categorieId)
  );

  const handleAssigneAEmailChange = (text: string) => {
    setAssigneAEmail(text);
    setAssigneA('');

    searchUsers(text);

    const exactUser = userSuggestions.find(
      user => user.Email.toLowerCase() === text.trim().toLowerCase()
    );

    if (exactUser) {
      setAssigneA(exactUser.id);
      clearSuggestions();
    }
  };

  const handleSelectAssigneUser = (user: any) => {
    setAssigneA(user.id);
    setAssigneAEmail(user.Email);
    clearSuggestions();
  };

  const handleOcrPress = () => {
    if (onOcrPress) {
      onOcrPress();
      return;
    }

    console.log('Open OCR camera screen');
  };

  const openOcrPreviewModal = (pending: PendingOcrAttachment) => {
    setEditableOcrText(pending.preview.texteOcr || '');
    setOcrWasEdited(false);
    setOcrModalVisible(true);
  };

  const handlePickFile = async () => {
    if (!onPreviewOcr) {
      handleOcrPress();
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    const file: SelectedFileModel = {
      uri: asset.uri,
      name: asset.name || `document-${Date.now()}.jpg`,
      mimeType: asset.mimeType || 'image/jpeg',
      size: asset.size,
      file: (asset as any).file,
    };

    const pending = await onPreviewOcr(file);

    if (pending) {
      openOcrPreviewModal(pending);
    }
  };

  const handleScanWithCamera = async () => {
    if (!onPreviewOcr) {
      handleOcrPress();
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      setFieldError("L'accès à la caméra est refusé.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    const file: SelectedFileModel = {
      uri: asset.uri,
      name: `scan-${Date.now()}.jpg`,
      mimeType: asset.mimeType || 'image/jpeg',
      size: asset.fileSize,
    };

    const pending = await onPreviewOcr(file);

    if (pending) {
      openOcrPreviewModal(pending);
    }
  };

  const extractOcrFields = (text: string) => {
    const cleanText = text.replace(/\r/g, '');

    const lines = cleanText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const findLineValue = (labels: string[]) => {
      for (const line of lines) {
        const normalizedLine = normalizeText(line);

        for (const label of labels) {
          const normalizedLabel = normalizeText(label);

          if (normalizedLine.startsWith(normalizedLabel)) {
            const separatorIndex = line.indexOf(':');

            if (separatorIndex >= 0) {
              return line.slice(separatorIndex + 1).trim();
            }

            const labelRegex = new RegExp(`^${label}\\s*:?\\s*`, 'i');
            return line.replace(labelRegex, '').trim();
          }
        }
      }

      return '';
    };

    const extractedReference = findLineValue([
      'Réf',
      'Ref',
      'Reference',
      'Référence',
    ]);

    const extractedObjet = findLineValue(['Objet', 'Subject']);

    const extractedDate = extractDateFromText(cleanText);

    const expediteur = extractExpediteurFromLines(lines);

    return {
      reference: extractedReference,
      objet: extractedObjet,
      dateCourrier: extractedDate,
      expediteur,
    };
  };

  const normalizeText = (value: string) => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const extractDateFromText = (text: string) => {
    const numericDateMatch = text.match(
      /\b(\d{2})[\/\-](\d{2})[\/\-](\d{4})\b/
    );

    if (numericDateMatch) {
      const [, day, month, year] = numericDateMatch;
      return `${year}-${month}-${day}`;
    }

    const frenchDateMatch = text.match(
      /\b(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(\d{4})\b/i
    );

    if (!frenchDateMatch) return '';

    const day = frenchDateMatch[1].padStart(2, '0');
    const monthName = normalizeText(frenchDateMatch[2]);
    const year = frenchDateMatch[3];

    const months: Record<string, string> = {
      janvier: '01',
      fevrier: '02',
      mars: '03',
      avril: '04',
      mai: '05',
      juin: '06',
      juillet: '07',
      aout: '08',
      septembre: '09',
      octobre: '10',
      novembre: '11',
      decembre: '12',
    };

    const month = months[monthName];

    return month ? `${year}-${month}-${day}` : '';
  };

  const extractExpediteurFromLines = (lines: string[]) => {
    const ignored = [
      'royaume',
      'réf',
      'ref',
      'objet',
      'monsieur',
      'madame',
      'à monsieur',
      'a monsieur',
      'rabat',
    ];

    const possibleHeaderLines = lines.slice(0, 5).filter(line => {
      const normalized = normalizeText(line);

      return !ignored.some(word =>
        normalized.startsWith(normalizeText(word))
      );
    });

    return possibleHeaderLines.join(' - ');
  };

  const handleConfirmOcr = () => {
    if (!pendingAttachment) return;

    const classification = pendingAttachment.preview.classification;

    const suggestedCategorieId = classification.suggestedCategorieId ?? null;

    const finalText = editableOcrText.trim();

    onConfirmOcr?.({
      texteOcr: finalText,
      ocrConfiance: pendingAttachment.preview.ocrConfiance,
      corrigeManuellement: ocrWasEdited,
      categorieId: suggestedCategorieId,
      scoreConfiance: classification.scoreConfiance,
      methode: classification.methode || 'OCR_RULE_BASED',
    });

    setTexteOcr(finalText);

    if (suggestedCategorieId) {
      setCategorieId(suggestedCategorieId);
    }

    const extracted = extractOcrFields(finalText);

    if (!reference.trim() && extracted.reference) {
      setReference(extracted.reference);
    }

    if (!objet.trim() && extracted.objet) {
      setObjet(extracted.objet);
    }

    if (!dateCourrier.trim() && extracted.dateCourrier) {
      setDateCourrier(extracted.dateCourrier);
    }

    if (type === 'Entrant' && !expediteur.trim() && extracted.expediteur) {
      setExpediteur(extracted.expediteur);
    }

    if (!description.trim() && finalText) {
      setDescription(finalText.slice(0, 500));
    }

    setOcrModalVisible(false);
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

    const courrierDate = parseInputDate(dateCourrier);

    if (!courrierDate) {
      setFieldError('La date du courrier est invalide.');
      return;
    }

    if (dateEcheance) {
      const echeanceDate = parseInputDateTime(dateEcheance);

      if (!echeanceDate) {
        setFieldError("La date d'échéance est invalide.");
        return;
      }

      if (echeanceDate < courrierDate) {
        setFieldError(
          "La date d'échéance doit être supérieure ou égale à la date du courrier."
        );
        return;
      }
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

    if (type === 'Entrant' && !assigneA) {
      setFieldError(
        "Veuillez choisir un utilisateur existant pour l'assignation."
      );
      return;
    }

    setFieldError('');

    onSubmit({
      reference: reference.trim(),
      type: forcedType || type,
      dateCourrier: toIsoDate(dateCourrier),
      expediteur: type === 'Entrant' ? expediteur.trim() : null,
      destinataire: type === 'Sortant' ? destinataire.trim() : null,
      objet: objet.trim(),
      description: description.trim() || null,
      statut,
      texteOcr: texteOcr.trim() || null,
      categorieId,
      assigneA: assigneA ? Number(assigneA) : null,
      dateEcheance: dateEcheance ? toIsoDateTime(dateEcheance) : null,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEditMode
          ? 'Modifier le courrier'
          : type === 'Sortant'
            ? 'Add Outgoing Mail'
            : 'Add Incoming Mail'}
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📩 Gestion des courriers entrants et sortants du bureau d’ordre
        </Text>
      </View>

      <View style={styles.card}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {fieldError ? <Text style={styles.error}>{fieldError}</Text> : null}

        {!hideType ? (
          <>
            <Text style={styles.label}>TYPE</Text>

            <View style={styles.typeBox}>
              {(['Entrant', 'Sortant'] as CourrierType[]).map(item => (
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
          </>
        ) : null}

        <Text style={styles.label}>RÉFÉRENCE</Text>

        <TextInput
          style={styles.input}
          placeholder={type === 'Sortant' ? 'SORT-2026-001' : 'ENT-2026-001'}
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

        {type === 'Entrant' ? (
          <>
            <Text style={styles.label}>ASSIGNÉ À</Text>

            <View style={styles.emailLookupWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email utilisateur"
                placeholderTextColor="#94a3b8"
                value={assigneAEmail}
                onChangeText={handleAssigneAEmailChange}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              {isSearchingUsers ? (
                <Text style={styles.lookupInfo}>Recherche...</Text>
              ) : null}

              {lookupError ? (
                <Text style={styles.fieldWarning}>{lookupError}</Text>
              ) : null}

              {assigneAEmail.trim().length >= 2 &&
                userSuggestions.length === 0 &&
                !isSearchingUsers &&
                !assigneA ? (
                <Text style={styles.emailNotFound}>
                  Aucun utilisateur avec cet email.
                </Text>
              ) : null}

              {userSuggestions.length > 0 ? (
                <View style={styles.suggestionsBox}>
                  {userSuggestions.map(user => (
                    <TouchableOpacity
                      key={user.id}
                      style={styles.suggestionItem}
                      onPress={() => handleSelectAssigneUser(user)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.suggestionEmail}>{user.Email}</Text>

                        <Text style={styles.suggestionName}>
                          {user.FullName || 'Utilisateur'} · {user.RoleName}
                        </Text>
                      </View>

                      <Text style={styles.suggestionChoose}>Choisir</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              {assigneA ? (
                <Text style={styles.emailFound}>
                  Email valide ✓ utilisateur ID: {assigneA}
                </Text>
              ) : null}
            </View>
          </>
        ) : null}

        <Text style={styles.label}>DATE ÉCHÉANCE</Text>

        <DateTimeField value={dateEcheance} onChange={setDateEcheance} />

        <Text style={styles.label}>ATTACHMENTS</Text>

        <View style={styles.attachmentActions}>
          <TouchableOpacity
            style={styles.attachBox}
            activeOpacity={0.85}
            onPress={handlePickFile}
          >
            <Text style={styles.attachText}>📎 Attach File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scanBox}
            activeOpacity={0.85}
            onPress={handleScanWithCamera}
          >
            <Text style={styles.scanText}>📷 Scan</Text>
          </TouchableOpacity>
        </View>

        {pendingAttachment ? (
          <View style={styles.ocrSummary}>
            <Text style={styles.ocrSummaryTitle}>
              {pendingAttachment.confirmedPayload
                ? 'OCR confirmé'
                : 'OCR prêt à confirmer'}
            </Text>

            <Text style={styles.ocrSummaryText} numberOfLines={3}>
              {pendingAttachment.confirmedPayload
                ? pendingAttachment.confirmedPayload.texteOcr
                : pendingAttachment.preview.texteOcr}
            </Text>

            <Text style={styles.ocrSummaryMeta}>
              Catégorie proposée:{' '}
              {pendingAttachment.preview.classification.suggestedCategorieName ||
                'Non détectée'}
            </Text>

            <Text style={styles.ocrSummaryMeta}>
              Confiance OCR: {pendingAttachment.preview.ocrConfiance}%
            </Text>

            {!pendingAttachment.confirmedPayload ? (
              <TouchableOpacity
                style={styles.confirmOcrSmallButton}
                onPress={() => openOcrPreviewModal(pendingAttachment)}
              >
                <Text style={styles.confirmOcrSmallText}>Confirmer OCR</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </View>

      <Modal
        visible={ocrModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOcrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ocrModalCard}>
            <Text style={styles.modalTitle}>Vérifier le résultat OCR</Text>

            <Text style={styles.ocrModalSubtitle}>
              Le texte et la classification seront enregistrés seulement après
              Save.
            </Text>

            <TextInput
              value={editableOcrText}
              onChangeText={text => {
                setEditableOcrText(text);
                setOcrWasEdited(true);
              }}
              multiline
              style={styles.ocrInput}
              placeholder="Texte OCR extrait..."
              placeholderTextColor="#94a3b8"
            />

            {pendingAttachment ? (
              <View style={styles.classificationBox}>
                <Text style={styles.classificationTitle}>
                  Classification proposée
                </Text>

                <Text style={styles.classificationText}>
                  Catégorie:{' '}
                  {pendingAttachment.preview.classification
                    .suggestedCategorieName || 'Non détectée'}
                </Text>

                <Text style={styles.classificationText}>
                  Score:{' '}
                  {pendingAttachment.preview.classification.scoreConfiance}%
                </Text>

                {pendingAttachment.preview.classification.message ? (
                  <Text style={styles.classificationMessage}>
                    {pendingAttachment.preview.classification.message}
                  </Text>
                ) : null}
              </View>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setOcrModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmOcr}
              >
                <Text style={styles.modalConfirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CategorieSelectorModal
        visible={showCategorieModal}
        categories={categories}
        selectedCategoryId={categorieId}
        onSelect={(id) => setCategorieId(id)}
        onClose={() => setShowCategorieModal(false)}
      />

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginTop: 20 }}
        />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {isEditMode
              ? 'Enregistrer les modifications'
              : type === 'Sortant'
                ? 'Save Outgoing Mail'
                : 'Save Incoming Mail'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const pad = (value: number) => String(value).padStart(2, '0');

const formatInputDate = (date: Date | string) => {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return '';
  }

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const formatInputDateTime = (date: Date | string) => {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return '';
  }

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const parseInputDate = (value: string) => {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day, 0, 0, 0);

  return Number.isNaN(date.getTime()) ? null : date;
};

const parseInputDateTime = (value: string) => {
  if (!value) return null;

  const [datePart, timePart = '00:00'] = value.split('T');

  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day, hour || 0, minute || 0, 0);

  return Number.isNaN(date.getTime()) ? null : date;
};

const toIsoDate = (date: string) => {
  return `${date}T00:00:00`;
};

const toIsoDateTime = (value: string) => {
  const date = parseInputDateTime(value);

  if (!date) return null;

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

const formatDisplayDateTime = (value: string) => {
  const date = parseInputDateTime(value);

  if (!date) return 'Choisir date et heure';

  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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
  emailLookupWrapper: {
    marginBottom: 18,
  },

  lookupInfo: {
    marginTop: -12,
    marginBottom: 10,
    marginLeft: 4,
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },

  emailNotFound: {
    marginTop: -12,
    marginBottom: 10,
    marginLeft: 4,
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '800',
  },

  emailFound: {
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '900',
  },

  suggestionsBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 16,
    marginTop: -10,
    marginBottom: 14,
    overflow: 'hidden',
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  suggestionEmail: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '900',
  },

  suggestionName: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },

  suggestionChoose: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '900',
  },

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

  dateTimeWebWrapper: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 0,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 18,
    height: 50,
    justifyContent: 'center',
  },

  dateValue: {
    color: '#0f172a',
    fontSize: 15,
  },

  datePlaceholder: {
    color: '#94a3b8',
    fontSize: 15,
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

  attachmentActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  attachBox: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#c4b5fd',
    backgroundColor: '#f5f3ff',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },

  scanBox: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },

  attachText: {
    color: '#6d28d9',
    fontWeight: '900',
  },

  scanText: {
    color: '#2563eb',
    fontWeight: '900',
  },

  ocrSummary: {
    marginBottom: 18,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  ocrSummaryTitle: {
    color: '#16a34a',
    fontWeight: '900',
    marginBottom: 6,
  },

  ocrSummaryText: {
    color: '#334155',
    lineHeight: 20,
  },

  ocrSummaryMeta: {
    marginTop: 6,
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },

  confirmOcrSmallButton: {
    marginTop: 12,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },

  confirmOcrSmallText: {
    color: '#ffffff',
    fontWeight: '900',
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

  ocrModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    maxHeight: '85%',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 14,
  },

  ocrModalSubtitle: {
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },

  ocrInput: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 16,
    padding: 12,
    color: '#0f172a',
    textAlignVertical: 'top',
    marginBottom: 14,
  },

  classificationBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  classificationTitle: {
    color: '#0f172a',
    fontWeight: '900',
    marginBottom: 6,
  },

  classificationText: {
    color: '#475569',
    fontWeight: '700',
    marginTop: 3,
  },

  classificationMessage: {
    color: '#94a3b8',
    marginTop: 6,
    fontSize: 12,
  },

  modalActions: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 10,
  },

  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalCancelText: {
    color: '#475569',
    fontWeight: '900',
  },

  modalConfirmText: {
    color: '#ffffff',
    fontWeight: '900',
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