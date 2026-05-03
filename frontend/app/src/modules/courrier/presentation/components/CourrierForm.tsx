import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
}

export const CourrierForm = ({
  onSubmit,
  isLoading,
  error,
  initialData,
}: CourrierFormProps) => {
  const isEditMode = !!initialData;

  const [reference, setReference] = useState(initialData?.Reference || '');
  const [type, setType] = useState(initialData?.Type || 'Entrant');

  const [dateCourrier, setDateCourrier] = useState(
    initialData?.DateCourrier
      ? formatInputDate(initialData.DateCourrier)
      : formatInputDate(new Date())
  );

  const [expediteur, setExpediteur] = useState(initialData?.Expediteur || '');
  const [destinataire, setDestinataire] = useState(initialData?.Destinataire || '');
  const [objet, setObjet] = useState(initialData?.Objet || '');
  const [description, setDescription] = useState(initialData?.Description || '');
  const [statut, setStatut] = useState(initialData?.Statut || 'ATraiter');
  const [texteOcr, setTexteOcr] = useState(initialData?.TexteOcr || '');
  const [categorieId, setCategorieId] = useState(
    initialData?.CategorieId ? String(initialData.CategorieId) : '1'
  );
  const [assigneA, setAssigneA] = useState(
    initialData?.AssigneA ? String(initialData.AssigneA) : ''
  );
  const [dateEcheance, setDateEcheance] = useState(
    initialData?.DateEcheance ? formatInputDate(initialData.DateEcheance) : ''
  );

  const [fieldError, setFieldError] = useState('');

  const handleSubmit = () => {
    if (!reference.trim()) {
      setFieldError('La référence est obligatoire.');
      return;
    }

    if (!objet.trim()) {
      setFieldError("L'objet est obligatoire.");
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
      categorieId: categorieId ? Number(categorieId) : null,
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
          value={reference}
          onChangeText={setReference}
        />

        <Text style={styles.label}>DATE COURRIER</Text>
        <TextInput
          style={styles.input}
          placeholder="2026-05-03"
          value={dateCourrier}
          onChangeText={setDateCourrier}
        />

        {type === 'Entrant' ? (
          <>
            <Text style={styles.label}>EXPÉDITEUR</Text>
            <TextInput
              style={styles.input}
              placeholder="Direction des Ressources Humaines"
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
              value={destinataire}
              onChangeText={setDestinataire}
            />
          </>
        )}

        <Text style={styles.label}>OBJET</Text>
        <TextInput
          style={styles.input}
          placeholder="Objet du courrier"
          value={objet}
          onChangeText={setObjet}
        />

        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {isEditMode ? (
          <>
            <Text style={styles.label}>STATUT</Text>
            <View style={styles.statusBox}>
              {['ATraiter', 'EnTraitement', 'Traite', 'Archive', 'Pret', 'Envoye'].map(
                item => (
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
                )
              )}
            </View>
          </>
        ) : null}

        <Text style={styles.label}>CATÉGORIE ID</Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          value={categorieId}
          onChangeText={setCategorieId}
          keyboardType="numeric"
        />

        <Text style={styles.label}>ASSIGNÉ À</Text>
        <TextInput
          style={styles.input}
          placeholder="ID utilisateur"
          value={assigneA}
          onChangeText={setAssigneA}
          keyboardType="numeric"
        />

        <Text style={styles.label}>DATE ÉCHÉANCE</Text>
        <TextInput
          style={styles.input}
          placeholder="2026-05-10"
          value={dateEcheance}
          onChangeText={setDateEcheance}
        />

        <Text style={styles.label}>TEXTE OCR</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Texte OCR extrait..."
          value={texteOcr}
          onChangeText={setTexteOcr}
          multiline
        />
      </View>

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

  card: {
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