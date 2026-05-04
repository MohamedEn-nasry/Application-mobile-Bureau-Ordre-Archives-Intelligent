import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { AgentProfile } from '../../domain/models/AgentProfile';
import { Routes } from '../../../../shared/constants/routes';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';

interface Props {
  navigation: any;
}

const mockProfileData: AgentProfile = {
  id: '1',
  name: 'Ahmed Benali',
  email: 'ahmed.benali@gov.ma',
  role: 'AGENT',
  employeeId: 'AG-2024-017',
  department: 'Administrative Services',
  position: 'Agent Bureau d\'Ordre',
  since: 'January 2024',
  statistics: {
    processed: 142,
    thisMonth: 23,
    scans: 38,
  },
  preferences: {
    pushNotifications: true,
    language: 'Français',
  },
  appVersion: {
    version: 'Intelligent Bureau d\'Ordre v2.1.0',
    build: 'Agent Portal - Build 2026.03',
  },
};

export const AgentProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [profile] = React.useState<AgentProfile>(mockProfileData);
  const [pushNotifications, setPushNotifications] = React.useState(profile.preferences.pushNotifications);

  const handleEditProfile = () => {
    navigation.navigate(Routes.Agent.EditProfile, { profile });
  };

  const handleChangePassword = () => {
    navigation.navigate(Routes.Agent.ChangePassword);
  };

  const handleLanguageSettings = () => {
    navigation.navigate(Routes.Agent.LanguageSettings, { 
      currentLanguage: profile.preferences.language 
    });
  };

  const handleHelpDocumentation = () => {
    navigation.navigate(Routes.Agent.HelpDocumentation);
  };

  const handleSecurityPrivacy = () => {
    navigation.navigate(Routes.Agent.SecurityPrivacy);
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AB</Text>
              </View>
              <TouchableOpacity style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.email}>{profile.email}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{profile.role}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.statisticsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.statistics.processed}</Text>
            <Text style={styles.statLabel}>Processed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.statistics.thisMonth}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.statistics.scans}</Text>
            <Text style={styles.statLabel}>Scans</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <Feather name="edit" size={20} color="#64748B" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
            <Ionicons name="lock-closed" size={20} color="#64748B" />
            <Text style={styles.menuText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.menuItem}>
            <Ionicons name="notifications" size={20} color="#64748B" />
            <Text style={styles.menuText}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
              thumbColor={pushNotifications ? '#2563EB' : '#FFFFFF'}
            />
          </View>
          <TouchableOpacity style={styles.menuItem} onPress={handleLanguageSettings}>
            <Ionicons name="language" size={20} color="#64748B" />
            <Text style={styles.menuText}>Language: {profile.preferences.language}</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleHelpDocumentation}>
            <Ionicons name="help-circle" size={20} color="#64748B" />
            <Text style={styles.menuText}>Help & Documentation</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleSecurityPrivacy}>
            <Ionicons name="shield-checkmark" size={20} color="#64748B" />
            <Text style={styles.menuText}>Security & Privacy</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Agent Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AGENT INFORMATION</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Employee ID</Text>
            <Text style={styles.infoValue}>{profile.employeeId}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>{profile.department}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{profile.position}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Since</Text>
            <Text style={styles.infoValue}>{profile.since}</Text>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>{profile.appVersion.version}</Text>
          <Text style={styles.buildText}>{profile.appVersion.build}</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
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
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6B46C1',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#E9D5FF',
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statisticsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 15,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 15,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  versionSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  buildText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});
