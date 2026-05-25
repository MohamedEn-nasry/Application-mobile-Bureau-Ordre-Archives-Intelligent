import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useChangePassword } from '../hooks/useChangePassword';
import { useThemeStyles } from '../../../application/providers/ThemeProvider';

export const ChangePasswordScreen = ({ navigation, route }: any) => {
  const styles = useThemeStyles(localStyles);
  const userId = Number(route?.params?.userId ?? 0);
  const { changePassword, isLoading, error } = useChangePassword();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canSubmit = useMemo(() => {
    if (!userId || userId < 1) return false;
    if (!oldPassword || !newPassword || !confirmNewPassword) return false;
    if (newPassword !== confirmNewPassword) return false;
    if (newPassword.length < 4) return false;
    return true;
  }, [userId, oldPassword, newPassword, confirmNewPassword]);

  const handleSubmit = async () => {
    if (!userId || userId < 1) {
      Alert.alert('Erreur', "Utilisateur invalide.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    const ok = await changePassword({
      id: userId,
      oldPassword,
      newPassword,
    });

    if (ok) {
      Alert.alert('Succès', 'Mot de passe modifié.');
      navigation?.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Réinitialiser le mot de passe</Text>
          <Text style={styles.subtitle}>
            Saisissez l’ancien mot de passe puis choisissez un nouveau.
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Field
            label="Ancien mot de passe"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={!showOld}
            onToggleSecure={() => setShowOld((v) => !v)}
          />

          <Field
            label="Nouveau mot de passe"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNew}
            onToggleSecure={() => setShowNew((v) => !v)}
          />

          <Field
            label="Confirmer le nouveau mot de passe"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry={!showConfirm}
            onToggleSecure={() => setShowConfirm((v) => !v)}
          />

          <Pressable
            disabled={!canSubmit || isLoading}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.primaryBtn,
              (!canSubmit || isLoading) && styles.primaryBtnDisabled,
              pressed && canSubmit && !isLoading && { opacity: 0.9 },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryText}>Valider</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation?.goBack()} style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Annuler</Text>
          </Pressable>

          <Text style={styles.hint}>
            ID utilisateur: <Text style={styles.hintStrong}>{String(userId || '-')}</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Field = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  onToggleSecure,
}: any) => {
  const styles = useThemeStyles(localStyles);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor="#94A3B8"
          style={styles.input}
          secureTextEntry={secureTextEntry}
        />
        <Pressable onPress={onToggleSecure} style={styles.eyeBtn}>
          <Feather name={secureTextEntry ? 'eye' : 'eye-off'} size={18} color="#64748B" />
        </Pressable>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  card: {
    margin: 18,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    color: '#DC2626',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
    marginBottom: 7,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    height: 50,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0F172A',
  },
  eyeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryBtnDisabled: {
    backgroundColor: '#93C5FD',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryText: {
    color: '#334155',
    fontWeight: '800',
    fontSize: 16,
  },
  hint: {
    marginTop: 14,
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
  hintStrong: {
    color: '#0F172A',
    fontWeight: '900',
  },
});

