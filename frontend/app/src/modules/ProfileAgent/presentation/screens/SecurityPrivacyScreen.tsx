import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';

interface Props {
  navigation: any;
}

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'action';
  value?: boolean;
  action?: () => void;
}

export const SecurityPrivacyScreen: React.FC<Props> = ({ navigation }) => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricLogin: false,
    sessionTimeout: true,
    dataEncryption: true,
    locationTracking: false,
    analyticsTracking: true,
    crashReporting: true,
    marketingEmails: false,
  });

  const handleToggleSetting = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleManageDevices = () => {
    Alert.alert('Manage Devices', 'Device management feature coming soon!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Opening privacy policy in browser...');
    // TODO: Open privacy policy URL
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Opening terms of service in browser...');
    // TODO: Open terms of service URL
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'Your data will be prepared and sent to your email. This may take up to 24 hours.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Export',
          onPress: () => {
            Alert.alert('Success', 'Data export request submitted successfully!');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Please type "DELETE" to confirm account deletion.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Confirm',
                  style: 'destructive',
                  onPress: () => {
                    Alert.alert('Account Deletion', 'Account deletion request submitted. You will receive a confirmation email.');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security & Privacy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Security Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="lock-closed" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Change Password</Text>
                    <Text style={styles.settingDescription}>Update your account password</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
                  <Ionicons name="chevron-forward" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="phone-portrait" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                    <Text style={styles.settingDescription}>Add an extra layer of security</Text>
                  </View>
                </View>
                <Switch
                  value={securitySettings.twoFactorAuth}
                  onValueChange={() => handleToggleSetting('twoFactorAuth')}
                  trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
                  thumbColor={securitySettings.twoFactorAuth ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="finger-print" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Biometric Login</Text>
                    <Text style={styles.settingDescription}>Use fingerprint or face recognition</Text>
                  </View>
                </View>
                <Switch
                  value={securitySettings.biometricLogin}
                  onValueChange={() => handleToggleSetting('biometricLogin')}
                  trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
                  thumbColor={securitySettings.biometricLogin ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="time" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Session Timeout</Text>
                    <Text style={styles.settingDescription}>Automatically log out after inactivity</Text>
                  </View>
                </View>
                <Switch
                  value={securitySettings.sessionTimeout}
                  onValueChange={() => handleToggleSetting('sessionTimeout')}
                  trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
                  thumbColor={securitySettings.sessionTimeout ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="phone-portrait" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Manage Devices</Text>
                    <Text style={styles.settingDescription}>View and manage connected devices</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={handleManageDevices}>
                  <Ionicons name="chevron-forward" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Privacy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy</Text>
            
            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="shield-checkmark" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Data Encryption</Text>
                    <Text style={styles.settingDescription}>Encrypt your data at rest and in transit</Text>
                  </View>
                </View>
                <Switch
                  value={securitySettings.dataEncryption}
                  onValueChange={() => handleToggleSetting('dataEncryption')}
                  trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
                  thumbColor={securitySettings.dataEncryption ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="location" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Location Tracking</Text>
                    <Text style={styles.settingDescription}>Allow app to access your location</Text>
                  </View>
                </View>
                <Switch
                  value={securitySettings.locationTracking}
                  onValueChange={() => handleToggleSetting('locationTracking')}
                  trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
                  thumbColor={securitySettings.locationTracking ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="analytics" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Analytics Tracking</Text>
                    <Text style={styles.settingDescription}>Help us improve the app with usage data</Text>
                  </View>
                </View>
                <Switch
                  value={securitySettings.analyticsTracking}
                  onValueChange={() => handleToggleSetting('analyticsTracking')}
                  trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
                  thumbColor={securitySettings.analyticsTracking ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="bug" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Crash Reporting</Text>
                    <Text style={styles.settingDescription}>Automatically report crashes and errors</Text>
                  </View>
                </View>
                <Switch
                  value={securitySettings.crashReporting}
                  onValueChange={() => handleToggleSetting('crashReporting')}
                  trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
                  thumbColor={securitySettings.crashReporting ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="mail" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Marketing Emails</Text>
                    <Text style={styles.settingDescription}>Receive promotional emails and updates</Text>
                  </View>
                </View>
                <Switch
                  value={securitySettings.marketingEmails}
                  onValueChange={() => handleToggleSetting('marketingEmails')}
                  trackColor={{ false: '#E2E8F0', true: '#DBEAFE' }}
                  thumbColor={securitySettings.marketingEmails ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            </View>
          </View>

          {/* Data Management Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            
            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="download" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Export Data</Text>
                    <Text style={styles.settingDescription}>Download a copy of your data</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={handleDataExport}>
                  <Ionicons name="chevron-forward" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="trash" size={20} color="#EF4444" />
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, styles.dangerText]}>Delete Account</Text>
                    <Text style={styles.settingDescription}>Permanently delete your account and data</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={handleDeleteAccount}>
                  <Ionicons name="chevron-forward" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Legal Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            
            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="document-text" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Privacy Policy</Text>
                    <Text style={styles.settingDescription}>Read our privacy policy</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={handlePrivacyPolicy}>
                  <Ionicons name="chevron-forward" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingLeft}>
                  <Ionicons name="document-text" size={20} color="#6B46C1" />
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Terms of Service</Text>
                    <Text style={styles.settingDescription}>Read our terms of service</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={handleTermsOfService}>
                  <Ionicons name="chevron-forward" size={20} color="#64748B" />
                </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actionButton: {
    padding: 8,
  },
  dangerText: {
    color: '#EF4444',
  },
  bottomPadding: {
    height: 20,
  },
});
