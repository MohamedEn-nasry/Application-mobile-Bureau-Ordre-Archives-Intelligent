import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { SettingsSection } from '../components/SettingsSection';
import { SettingItem } from '../components/SettingItem';
import { Settings } from '../../domain/entities/Settings';
import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 16,
  },
});

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { settings, loading } = useSettings();
  const { updateSettings: updateSettingsApi, launchBackup, loading: saving } = useUpdateSettings();
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local settings when data loads
  React.useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const updateLocalSettings = (updates: Partial<Settings>) => {
    if (localSettings) {
      setLocalSettings({ ...localSettings, ...updates });
      setHasChanges(true);
    }
  };

  const updateOcrSettings = (updates: Partial<Settings['ocr']>) => {
    if (localSettings) {
      updateLocalSettings({
        ocr: { ...localSettings.ocr, ...updates },
      });
    }
  };

  const updateBackupSettings = (updates: Partial<Settings['backup']>) => {
    if (localSettings) {
      updateLocalSettings({
        backup: { ...localSettings.backup, ...updates },
      });
    }
  };

  const handleSave = async () => {
    if (!localSettings || !hasChanges) return;
    
    try {
      const result = await updateSettingsApi(localSettings);
      if (result) {
        setHasChanges(false);
        Alert.alert('Succès', 'Paramètres enregistrés avec succès');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer les paramètres');
    }
  };

  const handleLaunchBackup = async () => {
    Alert.alert(
      'Lancer la sauvegarde',
      'Êtes-vous sûr de vouloir lancer une sauvegarde maintenant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Lancer',
          onPress: async () => {
            const success = await launchBackup();
            if (success) {
              Alert.alert('Succès', 'Sauvegarde lancée avec succès');
            } else {
              Alert.alert('Erreur', 'Impossible de lancer la sauvegarde');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!localSettings) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Impossible de charger les paramètres</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* OCR & AI Classification Section */}
        <SettingsSection
          title="OCR & IA Classification"
          titleColor="white"
          headerColor="purple"
        >
          <SettingItem
            label="Langue OCR"
            value={localSettings.ocr.language}
            type="selector"
            onPress={() => {
              // Will open language selector
            }}
          />
          <SettingItem
            label="Seuil de confiance"
            value={`${localSettings.ocr.confidenceThreshold}%`}
            type="selector"
            onPress={() => {
              // Will open threshold selector
            }}
          />
          <SettingItem
            label="OCR activé"
            description="Extraction automatique du texte"
            type="toggle"
            toggleValue={localSettings.ocr.enabled}
            onToggleChange={(value) => updateOcrSettings({ enabled: value })}
          />
          <SettingItem
            label="Classification automatique"
            description="Suggestions basées sur l'IA"
            type="toggle"
            toggleValue={localSettings.ocr.automaticClassification}
            onToggleChange={(value) => updateOcrSettings({ automaticClassification: value })}
            isLast
          />
        </SettingsSection>

        {/* Backup & Archiving Section */}
        <SettingsSection
          title="Sauvegarde & Archivage"
          titleColor="white"
          headerColor="green"
        >
          <SettingItem
            label="Sauvegarde automatique"
            description="Sauvegarde chiffrée sur le serveur"
            type="toggle"
            toggleValue={localSettings.backup.automaticBackup}
            onToggleChange={(value) => updateBackupSettings({ automaticBackup: value })}
          />
          <SettingItem
            label="Fréquence de sauvegarde"
            value={localSettings.backup.backupFrequency === 'daily' ? 'Quotidienne' : 
                   localSettings.backup.backupFrequency === 'weekly' ? 'Hebdomadaire' : 'Mensuelle'}
            type="selector"
            onPress={() => {
              // Will open frequency selector
            }}
          />
          <SettingItem
            label="Archivage automatique"
            type="toggle"
            toggleValue={localSettings.backup.automaticArchiving}
            onToggleChange={(value) => updateBackupSettings({ automaticArchiving: value })}
          />
          <SettingItem
            label="Lancer la sauvegarde maintenant"
            type="info"
            onPress={handleLaunchBackup}
            isLast
          />
        </SettingsSection>

        {/* System Information Section */}
        <SettingsSection title="Informations Système">
          <SettingItem
            label="Serveur"
            value={localSettings.systemInfo.server}
            type="info"
          />
          <SettingItem
            label="BD"
            value={localSettings.systemInfo.database}
            type="info"
          />
          <SettingItem
            label="Dernier backup"
            value={localSettings.systemInfo.lastBackup}
            type="info"
          />
          <SettingItem
            label="Mise à jour"
            value={localSettings.systemInfo.updateStatus === 'up-to-date' ? 'À jour' : 
                   localSettings.systemInfo.updateStatus === 'available' ? 'Disponible' : 'Erreur'}
            type="info"
            isLast
          />
        </SettingsSection>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!hasChanges || saving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer les paramètres</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
