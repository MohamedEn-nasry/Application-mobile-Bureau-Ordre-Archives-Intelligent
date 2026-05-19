import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Switch
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Role, Roles } from '../../../../shared/constants/roles';
import { useCategories } from '../../../courrier/presentation/hooks/useCategories';
import { CategorieSelectorModal } from '../../../../shared/presentation/components/CategorieSelectorModal';

interface UserFormProps {
  onSubmit: (user: {
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    roleName: Role;
    isActive: boolean;
    imagePath: string;
    categorieId?: number;
  }) => void;
  isLoading: boolean;
  error: string | null;
  initialData?: any;
}
export const UserForm = ({ onSubmit, isLoading, error, initialData }: UserFormProps) => {
  const [firstname, setFirstname] = useState(initialData?.FirstName || '');
  const [lastname, setLastname] = useState(initialData?.LastName || '');
  const [email, setEmail] = useState(initialData?.Email || '');
  const [password, setPassword] = useState('');
  const [roleName, setRoleName] = useState<Role>(initialData?.RoleName || Roles.AGENT);
  const [isActive, setIsActive] = useState(initialData !== undefined ? initialData.IsActive : true);
  const [imagePath, setImagePath] = useState(initialData?.ImagePath || '');
  const [emailError, setEmailError] = useState('');
  const [categorieId, setCategorieId] = useState<number | null>(initialData?.CategorieId || null);
  const [showCategorieModal, setShowCategorieModal] = useState(false);
  
  const { categories } = useCategories();

  const validateGmail = (text: string) => {
    setEmail(text);

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (text && !gmailRegex.test(text)) {
      setEmailError("L'adresse doit être un compte Gmail (@gmail.com)");
    } else {
      setEmailError('');
    }
  };

  const handlePickImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      copyToCacheDirectory: true
    });

    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];


      setImagePath(`/uploads/users/${file.name}`);
    }
  };

  const handleSubmit = () => {
    if (emailError || !email) {
      setEmailError('Une adresse Gmail valide est requise');
      return;
    }

    const userData: any = {
      firstname,
      lastname,
      email,
      roleName,
      isActive,
      imagePath,
      categorieId: roleName === Roles.LECTEUR ? categorieId : undefined
    };

    if (!initialData) {
      userData.password = password;
    }

    onSubmit(userData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{initialData ? 'Modifier l\'Utilisateur' : 'Créer un Utilisateur'}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          🛡 Réservé à l&apos;administrateur — aucune inscription publique
        </Text>
      </View>

      <View style={styles.card}>
        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.label}>PRÉNOM</Text>
        <TextInput
          style={styles.input}
          placeholder="Ahmed"
          value={firstname}
          onChangeText={setFirstname}
        />

        <Text style={styles.label}>NOM</Text>
        <TextInput
          style={styles.input}
          placeholder="nasiri"
          value={lastname}
          onChangeText={setLastname}
        />

        <Text style={styles.label}>ADRESSE EMAIL GMAIL</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="nom.utilisateur@gmail.com"
          value={email}
          onChangeText={validateGmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}

        {!initialData && (
          <>
            <Text style={styles.label}>MOT DE PASSE</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </>
        )}

        <Text style={styles.label}>IMAGE PATH</Text>
        <TouchableOpacity style={styles.imageInput} onPress={handlePickImage}>
          <Text
            style={[styles.imageInputText, !imagePath && styles.placeholderText]}
            numberOfLines={1}
          >
            {imagePath || 'Choisir une image'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>RÔLE</Text>
        <View style={styles.roleBox}>
          {Object.values(Roles).map(r => (
            <TouchableOpacity
              key={r}
              style={[
                styles.roleButton,
                roleName === r && styles.roleButtonActive
              ]}
              onPress={() => setRoleName(r as Role)}
            >
              <Text
                style={[
                  styles.roleText,
                  roleName === r && styles.roleTextActive
                ]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {roleName === Roles.LECTEUR && (
          <>
            <Text style={styles.label}>CATÉGORIE ASSOCIÉE (LECTEUR)</Text>
            <TouchableOpacity 
              style={styles.categorieSelector} 
              onPress={() => setShowCategorieModal(true)}
            >
              <Text style={[styles.categorieSelectorText, !categorieId && styles.placeholderText]}>
                {categorieId 
                  ? categories.find(c => Number(c.id) === categorieId)?.Nom || 'Sélectionner une catégorie'
                  : 'Sélectionner une catégorie'}
              </Text>
            </TouchableOpacity>

            <CategorieSelectorModal
              visible={showCategorieModal}
              categories={categories}
              selectedCategoryId={categorieId}
              onSelect={(id) => setCategorieId(id)}
              onClose={() => setShowCategorieModal(false)}
            />
          </>
        )}

        <View style={styles.activeRow}>
          <View>
            <Text style={styles.activeTitle}>Compte actif</Text>
            <Text style={styles.activeSubtitle}>
              L&apos;utilisateur peut se connecter immédiatement
            </Text>
          </View>

          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
          <Text style={styles.createButtonText}>{initialData ? 'Enregistrer les modifications' : 'Créer le compte'}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 45,
    backgroundColor: '#f8fafc'
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 20
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 14,
    borderRadius: 16,
    marginBottom: 14
  },
  infoText: {
    color: '#1d4ed8',
    fontWeight: '600',
    fontSize: 14
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8
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
    marginBottom: 18
  },
  imageInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18
  },
  imageInputText: {
    fontSize: 15,
    color: '#0f172a'
  },
  placeholderText: {
    color: '#94a3b8'
  },
  categorieSelector: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  categorieSelectorText: {
    fontSize: 15,
    color: '#0f172a'
  },
  error: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    textAlign: 'center'
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fff1f1'
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: -14,
    marginBottom: 14,
    marginLeft: 4
  },
  roleBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20
  },
  roleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#f1f5f9'
  },
  roleButtonActive: {
    backgroundColor: '#dbeafe'
  },
  roleText: {
    color: '#64748b',
    fontWeight: '700'
  },
  roleTextActive: {
    color: '#2563eb'
  },
  activeRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a'
  },
  activeSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
    maxWidth: 230
  },
  createButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 20,
    alignItems: 'center'
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800'
  }
});