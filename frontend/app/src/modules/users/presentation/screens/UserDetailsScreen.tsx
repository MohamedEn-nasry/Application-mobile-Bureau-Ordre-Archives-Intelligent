import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Routes } from '../../../../shared/constants/routes';

export const UserDetailsScreen = ({ route, navigation }: any) => {
  const { user } = route.params || {};

  const firstName = user?.FirstName || user?.firstname || 'Utilisateur';
  const lastName = user?.LastName || user?.lastname || '';
  const email = user?.Email || user?.email || 'email@example.com';
  const role = user?.RoleName || user?.roleName || 'Agent';
  const isActive = user?.IsActive ?? user?.isActif ?? true;
  const imagePath = user?.ImagePath || user?.imagePath;
  const userId = user?.id || user?.Id;
  const createdAt = user?.CreatedAt || user?.createdAt;
  const updatedAt = user?.UpdatedAt || user?.updatedAt;

  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'token',
                'accessToken',
                'refreshToken',
                'user',
                'currentUser',
              ]);
            } finally {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: Routes.Auth.Login || 'Login',
                  },
                ],
              });
            }
          },
        },
      ]
    );
  };

  const permissions = getPermissionsByRole(role);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <View style={styles.headerBackground}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.headerNav}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Profil {formatRole(role)}</Text>

            <TouchableOpacity style={styles.moreButton}>
              <Feather name="more-vertical" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfoContainer}>
            <View style={styles.avatarWrapper}>
              {imagePath ? (
                <Image source={{ uri: imagePath }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>{initials || 'U'}</Text>
                </View>
              )}

              <View style={styles.cameraIcon}>
                <Feather name="camera" size={14} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.userName}>
              {firstName} {lastName}
            </Text>

            <Text style={styles.userEmail}>{email}</Text>

            <View style={styles.badgesRow}>
              <View style={styles.roleBadge}>
                <Feather name="shield" size={14} color="#9333EA" />
                <Text style={styles.roleText}>{formatRole(role)}</Text>
              </View>

              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isActive ? '#22C55E' : '#FB7185' },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    { color: isActive ? '#16A34A' : '#E11D48' },
                  ]}
                >
                  {isActive ? 'Actif' : 'Inactif'}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informations utilisateur</Text>

          <InfoRow icon="hash" label="ID utilisateur" value={String(userId || '—')} />
          <InfoRow icon="user" label="Nom complet" value={`${firstName} ${lastName}`} />
          <InfoRow icon="mail" label="Email" value={email} />
          <InfoRow icon="shield" label="Rôle" value={formatRole(role)} />
          <InfoRow icon="activity" label="Statut" value={isActive ? 'Actif' : 'Inactif'} />
          <InfoRow icon="calendar" label="Créé le" value={formatDate(createdAt)} />
          <InfoRow icon="clock" label="Modifié le" value={formatDate(updatedAt)} />
        </View>

        <View style={styles.permissionsGrid}>
          {permissions.map(item => (
            <View key={item} style={styles.permissionItem}>
              <Feather name="check-circle" size={14} color="#059669" />
              <Text style={styles.permissionText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionCard}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate(Routes.Admin.CreateUpdateUser, { user })}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="edit-2" size={18} color="#2563EB" />
            </View>

            <Text style={styles.actionText}>Modifier le profil</Text>
            <Feather name="chevron-right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => {
              if (!userId) return;
              navigation.navigate(Routes.Admin.ChangePassword, {
                userId: Number(userId),
              });
            }}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FFFBEB' }]}>
              <Feather name="key" size={18} color="#D97706" />
            </View>

            <Text style={styles.actionText}>Changer le mot de passe</Text>
            <Feather name="chevron-right" size={20} color="#CBD5E1" />
          </TouchableOpacity>
          {/* 
          <View style={styles.separator} /> */}

          {/* <TouchableOpacity style={styles.actionRow}>
            <View style={[styles.actionIconBox, { backgroundColor: '#F8FAFC' }]}>
              <Feather name="shield" size={18} color="#64748B" />
            </View>

            <Text style={styles.actionText}>Journaux de sécurité</Text>
            <Feather name="chevron-right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.separator} />

          {/* <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
            <View style={[styles.actionIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Feather name="log-out" size={18} color="#EF4444" />
            </View>

            <Text style={[styles.actionText, { color: '#EF4444' }]}>
              Se déconnecter
            </Text>

            <Feather name="chevron-right" size={20} color="#CBD5E1" />
          </TouchableOpacity> */}
        </View>

        <Text style={styles.versionText}>
          Intelligent Bureau d'Ordre — v2.4.1
        </Text>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconBox}>
        <Feather name={icon} size={16} color="#2563EB" />
      </View>

      <View style={styles.infoTextBox}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const formatRole = (role: string) => {
  const value = String(role).toLowerCase();

  if (value === 'admin' || value === 'administrateur') return 'Administrateur';
  if (value === 'agent') return 'Agent';
  if (value === 'lecteur') return 'Lecteur';

  return role;
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getPermissionsByRole = (role: string) => {
  const value = String(role).toLowerCase();

  if (value === 'admin' || value === 'administrateur') {
    return [
      'Gestion utilisateurs',
      'Paramètres système',
      'Tout le courrier',
      'Rapports & export',
    ];
  }

  if (value === 'agent') {
    return [
      'Créer courrier',
      'Modifier courrier',
      'Scanner OCR',
      'Changer statut',
    ];
  }

  return [
    'Consulter courrier',
    'Recherche & filtres',
    'Lecture seule',
    'Notifications',
  ];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  headerBackground: {
    backgroundColor: '#2563EB',
    paddingBottom: 40,
    overflow: 'hidden',
  },

  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -100,
    right: -100,
  },

  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -50,
    left: -50,
  },

  safeArea: {
    zIndex: 1,
  },

  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },

  backButton: {
    padding: 5,
  },

  moreButton: {
    padding: 5,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  profileInfoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
    padding: 4,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#60A5FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  avatarInitials: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2563EB',
  },

  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: '#DBEAFE',
    marginBottom: 16,
  },

  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  roleText: {
    color: '#9333EA',
    fontWeight: '700',
    fontSize: 13,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontWeight: '700',
    fontSize: 13,
  },

  scrollView: {
    flex: 1,
    marginTop: -20,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTitle: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoTextBox: {
    flex: 1,
  },

  infoLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },

  infoValue: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },

  permissionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },

  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: '48%',
    gap: 6,
  },

  permissionText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    flex: 1,
  },

  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },

  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 66,
  },

  versionText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 10,
  },
});