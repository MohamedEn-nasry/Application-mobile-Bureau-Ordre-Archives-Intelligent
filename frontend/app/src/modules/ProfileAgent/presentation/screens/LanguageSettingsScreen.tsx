import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';

interface Props {
  navigation: any;
  route: {
    params?: {
      currentLanguage?: string;
    };
  };
}

interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  flag: string;
}

const languages: Language[] = [
  {
    id: '1',
    name: 'French',
    nativeName: 'Français',
    code: 'fr',
    flag: '🇫🇷',
  },
  {
    id: '2',
    name: 'English',
    nativeName: 'English',
    code: 'en',
    flag: '🇬🇧',
  },
  {
    id: '3',
    name: 'Arabic',
    nativeName: 'العربية',
    code: 'ar',
    flag: '🇲🇦',
  },
  {
    id: '4',
    name: 'Spanish',
    nativeName: 'Español',
    code: 'es',
    flag: '🇪🇸',
  },
  {
    id: '5',
    name: 'German',
    nativeName: 'Deutsch',
    code: 'de',
    flag: '🇩🇪',
  },
  {
    id: '6',
    name: 'Italian',
    nativeName: 'Italiano',
    code: 'it',
    flag: '🇮🇹',
  },
];

export const LanguageSettingsScreen: React.FC<Props> = ({ navigation, route }) => {
  const currentLanguage = route?.params?.currentLanguage || 'Français';
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find(lang => lang.nativeName === currentLanguage) || languages[0]
  );

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleSaveLanguage = () => {
    Alert.alert(
      'Language Changed',
      `App language will be changed to ${selectedLanguage.name}. This will take effect after restarting the app.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // TODO: Save language preference to backend/local storage
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language Settings</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveLanguage}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Current Language */}
          <View style={styles.currentLanguageCard}>
            <Text style={styles.currentLanguageTitle}>Current Language</Text>
            <View style={styles.currentLanguageItem}>
              <Text style={styles.flag}>{selectedLanguage.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{selectedLanguage.name}</Text>
                <Text style={styles.nativeName}>{selectedLanguage.nativeName}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
          </View>

          {/* Available Languages */}
          <View style={styles.languagesSection}>
            <Text style={styles.sectionTitle}>Available Languages</Text>
            
            {languages.map((language) => (
              <TouchableOpacity
                key={language.id}
                style={[
                  styles.languageCard,
                  selectedLanguage.id === language.id && styles.selectedLanguageCard,
                ]}
                onPress={() => handleLanguageSelect(language)}
              >
                <Text style={styles.flag}>{language.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.nativeName}>{language.nativeName}</Text>
                </View>
                <View style={styles.radioButton}>
                  <View style={[
                    styles.radioInner,
                    selectedLanguage.id === language.id && styles.radioInnerSelected,
                  ]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Language Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Language Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Ionicons name="information-circle-outline" size={20} color="#6B46C1" />
                <Text style={styles.infoText}>
                  Changing the language will update the entire application interface.
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="refresh-outline" size={20} color="#6B46C1" />
                <Text style={styles.infoText}>
                  Some changes may require restarting the app to take full effect.
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="download-outline" size={20} color="#6B46C1" />
                <Text style={styles.infoText}>
                  Language packs are downloaded automatically when selected.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <AgentBottomNav active="profile" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#6B46C1',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  currentLanguageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currentLanguageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  currentLanguageItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  nativeName: {
    fontSize: 14,
    color: '#6B7280',
  },
  languagesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  languageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedLanguageCard: {
    borderWidth: 2,
    borderColor: '#6B46C1',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  radioInnerSelected: {
    backgroundColor: '#6B46C1',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});
