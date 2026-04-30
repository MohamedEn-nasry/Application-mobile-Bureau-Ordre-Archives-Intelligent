import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetUserById } from '../hooks/useGetUserById';
import { Routes } from '../../../../shared/constants/routes';
import { BottomNav } from '../../../../shared/presentation/components/BottomNav';

export const UserDetailsScreen = ({ navigation, route }: any) => {
  const { userId } = route.params || {};
  const [selectedRole, setSelectedRole] = useState('Agent');

  const { user, isLoading, error } = useGetUserById(userId);

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.centered}>
        <Ionicons name="person-outline" size={64} color="#94A3B8" />
        <Text style={styles.errorTitle}>
          {error ? 'Erreur de chargement' : 'Utilisateur non trouvé'}
        </Text>
        <Text style={styles.errorText}>
          {error || "Les détails de cet utilisateur n&apos;ont pas pu être chargés"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
          <Text style={styles.retryButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const initials = `${user.FirstName[0] ?? ''}${user.LastName[0] ?? ''}`.toUpperCase();
  const username = user.Email.split('@')[0]; // Extract username from email

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.iconButton} onPress={handleGoBack}>
            <Feather name="arrow-left" size={24} color="#334155" />
          </TouchableOpacity>

          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle}>Modifier Utilisateur</Text>
            <Text style={styles.headerSubTitle}>Assigner un rôle</Text>
          </View>

          <TouchableOpacity style={styles.menuButton}>
            <Feather name="more-vertical" size={20} color="#334155" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Blue User Info Card */}
        <View style={styles.blueCard}>
          <View style={styles.blueCardContent}>
            <View style={styles.avatarSection}>
              <View style={styles.blueAvatar}>
                <Text style={styles.blueAvatarText}>{initials}</Text>
              </View>
            </View>
            
            <View style={styles.userInfoSection}>
              <Text style={styles.userName}>{user.FirstName} {user.LastName}</Text>
              <Text style={styles.userEmail}>{user.Email}</Text>
              
              <View style={styles.tagsContainer}>
                <View style={styles.agentTag}>
                  <Text style={styles.agentTagText}>Agent</Text>
                </View>
                <View style={styles.activeTag}>
                  <Text style={styles.activeTagText}>Actif</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dernière connexion</Text>
                <Text style={styles.infoValue}>24 Mar 2026</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Département</Text>
                <Text style={styles.infoValue}>Secrétariat</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DU COMPTE</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={`${user.FirstName} ${user.LastName}`}
                editable={false}
                placeholder="NOM COMPLET"
              />
            </View>
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={username}
                editable={false}
                placeholder="NOM D'UTILISATEUR"
              />
            </View>
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={user.Email}
                editable={false}
                placeholder="EMAIL"
              />
            </View>
          </View>
        </View>

        {/* Role Assignment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RÔLE ASSIGNÉ</Text>
          
          <TouchableOpacity
            style={[styles.roleOption, selectedRole === 'Administrateur' && styles.roleOptionSelected]}
            onPress={() => setSelectedRole('Administrateur')}
          >
            <View style={[styles.radioButton, selectedRole === 'Administrateur' && styles.radioButtonSelected]}>
              {selectedRole === 'Administrateur' && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={[styles.roleText, selectedRole === 'Administrateur' && styles.roleTextSelected]}>Administrateur</Text>
            {selectedRole === 'Administrateur' && <Ionicons name="checkmark" size={20} color="#2563EB" />}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.roleOption, selectedRole === 'Agent' && styles.roleOptionSelected]}
            onPress={() => setSelectedRole('Agent')}
          >
            <View style={[styles.radioButton, selectedRole === 'Agent' && styles.radioButtonSelected]}>
              {selectedRole === 'Agent' && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={[styles.roleText, selectedRole === 'Agent' && styles.roleTextSelected]}>Agent</Text>
            {selectedRole === 'Agent' && <Ionicons name="checkmark" size={20} color="#2563EB" />}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.roleOption, selectedRole === 'Lecteur' && styles.roleOptionSelected]}
            onPress={() => setSelectedRole('Lecteur')}
          >
            <View style={[styles.radioButton, selectedRole === 'Lecteur' && styles.radioButtonSelected]}>
              {selectedRole === 'Lecteur' && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={[styles.roleText, selectedRole === 'Lecteur' && styles.roleTextSelected]}>Lecteur</Text>
            {selectedRole === 'Lecteur' && <Ionicons name="checkmark" size={20} color="#2563EB" />}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="users" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTop: {
    height: 74,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitleBlock: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubTitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 1,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Blue Card Styles
  blueCard: {
    backgroundColor: '#2563EB',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  blueCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarSection: {
    marginRight: 16,
  },
  blueAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueAvatarText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 20,
  },
  userInfoSection: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  agentTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  agentTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTag: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Section Styles
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  
  // Input Styles
  inputRow: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  
  // Radio Button Styles
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  roleOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2563EB',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  roleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
  roleTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
