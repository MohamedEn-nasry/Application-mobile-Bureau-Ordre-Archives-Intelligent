import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AgentProfile } from '../../domain/models/AgentProfile';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';

interface Props {
  navigation: any;
  route: {
    params: {
      profile: AgentProfile;
    };
  };
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

export const EditProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const [profile] = useState<AgentProfile>(route?.params?.profile || mockProfileData);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    department: profile.department,
    position: profile.position,
  });

  const handleSave = () => {
    // Validate form
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // TODO: Save profile data to backend
    Alert.alert('Success', 'Profile updated successfully', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter your full name"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Email Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email address"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Employee ID (Read-only) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Employee ID</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>{profile.employeeId}</Text>
            </View>
          </View>

          {/* Department Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={styles.input}
              value={formData.department}
              onChangeText={(text) => setFormData({ ...formData, department: text })}
              placeholder="Enter your department"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Position Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Position</Text>
            <TextInput
              style={styles.input}
              value={formData.position}
              onChangeText={(text) => setFormData({ ...formData, position: text })}
              placeholder="Enter your position"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Role (Read-only) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>{profile.role}</Text>
            </View>
          </View>

          {/* Since (Read-only) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Member Since</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>{profile.since}</Text>
            </View>
          </View>
        </View>

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
  form: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  readOnlyInput: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  bottomPadding: {
    height: 20,
  },
});
