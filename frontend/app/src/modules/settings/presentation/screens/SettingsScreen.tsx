import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { BottomNav } from '../../../../shared/presentation/components/BottomNav';
import { Routes } from '../../../../shared/constants/routes';
import { useAuth } from '../../../../application/providers/AuthProvider';
import { useUserProfile } from '../../../profile/presentation/hooks/useUserProfile';
import { localStorage } from '../../../../core/storage/localStorage';
import { useTheme } from '../../../../application/providers/ThemeProvider';

export const SettingsScreen = ({ navigation }: any) => {
  const { session, logout } = useAuth();
  const currentUserId = Number(session?.userId ?? 0);

  const { profile, isLoading, error } = useUserProfile(currentUserId);
  const { isDarkMode, setDarkMode, colors: theme } = useTheme();

  // Settings states
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [ocrAutoSync, setOcrAutoSync] = useState(true);

  // Load persistent settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const emailVal = await localStorage.getItem<boolean>('@settings_email_notifications');
        const smsVal = await localStorage.getItem<boolean>('@settings_sms_notifications');
        const ocrVal = await localStorage.getItem<boolean>('@settings_ocr_auto_sync');

        if (emailVal !== null) setEmailNotifications(emailVal);
        if (smsVal !== null) setSmsNotifications(smsVal);
        if (ocrVal !== null) setOcrAutoSync(ocrVal);
      } catch (err) {
        console.error('Failed to load settings from storage:', err);
      }
    };

    loadSettings();
  }, []);

  const handleToggleEmail = async (value: boolean) => {
    setEmailNotifications(value);
    try {
      await localStorage.setItem('@settings_email_notifications', value);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSms = async (value: boolean) => {
    setSmsNotifications(value);
    try {
      await localStorage.setItem('@settings_sms_notifications', value);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleOcr = async (value: boolean) => {
    setOcrAutoSync(value);
    try {
      await localStorage.setItem('@settings_ocr_auto_sync', value);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDarkMode = async (value: boolean) => {
    await setDarkMode(value);
  };

  const handleLogout = async () => {

    await logout();

  };

  const renderUserProfile = () => {
    if (isLoading) {
      return (
        <View style={[styles.profileLoader, { backgroundColor: theme.cardBg }]}>
          <ActivityIndicator size="small" color="#4F46E5" />
        </View>
      );
    }

    if (error || !profile) {
      return (
        <View style={[styles.profileErrorWrap, { backgroundColor: theme.cardBg }]}>
          <Text style={styles.profileErrorText}>Impossible de charger les infos de profil</Text>
        </View>
      );
    }

    return (
      <View style={[styles.profileCard, { backgroundColor: theme.cardBg }]}>
        <View style={[styles.profileAvatar, { backgroundColor: theme.avatarBg, borderColor: theme.profileBorder }]}>
          <Text style={[styles.profileAvatarText, { color: theme.avatarText }]}>
            {profile.Initials || 'AD'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.textMain }]}>{profile.FullName}</Text>
          <Text style={[styles.profileEmail, { color: theme.textMuted }]}>{profile.Email}</Text>
          <View style={styles.profileRoleBadge}>
            <Text style={styles.profileRoleText}>{profile.RoleName || 'ADMIN'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paramètres Système</Text>
        <Text style={styles.headerSubtitle}>Gérer vos préférences et sécurité</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>MON PROFIL</Text>
        {renderUserProfile()}

        <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>SÉCURITÉ & ACCÈS</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(Routes.Admin.ChangePassword)}
          >
            <View style={[styles.iconWrap, { backgroundColor: '#EEF2FF' }]}>
              <Feather name="lock" size={20} color="#4F46E5" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: theme.textMain }]}>Changer le mot de passe</Text>
              <Text style={[styles.rowDescription, { color: theme.textMuted }]}>Mettre à jour vos identifiants de connexion</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>NOTIFICATIONS & SYSTÈME</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Feather name="bell" size={20} color="#10B981" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: theme.textMain }]}>Notifications Email</Text>
              <Text style={[styles.rowDescription, { color: theme.textMuted }]}>Recevoir des alertes de nouveaux courriers par email</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={handleToggleEmail}
              trackColor={{ false: '#CBD5E1', true: '#C7D2FE' }}
              thumbColor={emailNotifications ? '#4F46E5' : '#F1F5F9'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: '#F0FDF4' }]}>
              <MaterialCommunityIcons name="whatsapp" size={22} color="#22C55E" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: theme.textMain }]}>Notifications SMS & WhatsApp</Text>
              <Text style={[styles.rowDescription, { color: theme.textMuted }]}>Alertes instantanées sur les courriers urgents</Text>
            </View>
            <Switch
              value={smsNotifications}
              onValueChange={handleToggleSms}
              trackColor={{ false: '#CBD5E1', true: '#C7D2FE' }}
              thumbColor={smsNotifications ? '#4F46E5' : '#F1F5F9'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="scan-outline" size={20} color="#F97316" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: theme.textMain }]}>Synchro OCR Automatique</Text>
              <Text style={[styles.rowDescription, { color: theme.textMuted }]}>Extraire automatiquement le texte des pièces jointes</Text>
            </View>
            <Switch
              value={ocrAutoSync}
              onValueChange={handleToggleOcr}
              trackColor={{ false: '#CBD5E1', true: '#C7D2FE' }}
              thumbColor={ocrAutoSync ? '#4F46E5' : '#F1F5F9'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: isDarkMode ? '#334155' : '#F8FAFC' }]}>
              <Feather name="moon" size={20} color={isDarkMode ? '#F1F5F9' : '#475569'} />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: theme.textMain }]}>Mode Sombre</Text>
              <Text style={[styles.rowDescription, { color: theme.textMuted }]}>Activer le thème visuel sombre</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: '#CBD5E1', true: '#C7D2FE' }}
              thumbColor={isDarkMode ? '#4F46E5' : '#F1F5F9'}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>COMPTE & APPLICATION</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Version de l'application</Text>
            <Text style={[styles.infoValue, { color: theme.textMain }]}>v2.1.0 (Build 2026.05)</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Base de données</Text>
            <Text style={[styles.infoValue, { color: theme.textMain }]}>PostgreSQL (Actif)</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.88}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={22} color="#FF0000" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>


      </ScrollView>

      <BottomNav navigation={navigation} activeRoute="Paramètres" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#4338CA',
    paddingTop: 54,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#4338CA',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: '#C7D2FE',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 110,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 22,
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  profileAvatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4F46E5',
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  profileRoleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  profileRoleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
  },
  profileLoader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileErrorWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  profileErrorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowText: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  rowDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 26,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
});
