import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';

interface Props {
  navigation: any;
}

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  content?: string[];
}

const helpTopics: HelpTopic[] = [
  {
    id: '1',
    title: 'Getting Started',
    description: 'Learn the basics of using the application',
    icon: 'rocket-outline',
    content: [
      '• Navigate through the dashboard to see your statistics',
      '• Use the bottom navigation to access different sections',
      '• View incoming and outgoing mail from the respective tabs',
      '• Check alerts for important notifications',
      '• Access your profile to manage your account settings',
    ],
  },
  {
    id: '2',
    title: 'Managing Mail',
    description: 'How to handle incoming and outgoing mail',
    icon: 'mail-outline',
    content: [
      '• View all incoming mail in the Incoming tab',
      '• Process mail by marking it as read or archived',
      '• Create new outgoing mail from the Outgoing tab',
      '• Track the status of your outgoing communications',
      '• Use search and filter options to find specific mail',
    ],
  },
  {
    id: '3',
    title: 'Scanning Documents',
    description: 'Learn how to scan and process documents',
    icon: 'camera-outline',
    content: [
      '• Use the camera to scan documents',
      '• Ensure proper lighting for best results',
      '• Crop and adjust scanned images as needed',
      '• Save scans to appropriate categories',
      '• Share scanned documents with relevant parties',
    ],
  },
  {
    id: '4',
    title: 'Profile Management',
    description: 'Manage your account and preferences',
    icon: 'person-outline',
    content: [
      '• Edit your profile information from the Profile tab',
      '• Change your password regularly for security',
      '• Configure notification preferences',
      '• Update your department and position information',
      '• View your activity statistics and performance',
    ],
  },
  {
    id: '5',
    title: 'Security Best Practices',
    description: 'Keep your account secure and protected',
    icon: 'shield-checkmark-outline',
    content: [
      '• Use strong, unique passwords',
      '• Never share your login credentials',
      '• Log out when using shared devices',
      '• Keep your app updated to the latest version',
      '• Report any suspicious activity immediately',
    ],
  },
  {
    id: '6',
    title: 'Troubleshooting',
    description: 'Common issues and their solutions',
    icon: 'build-outline',
    content: [
      '• Clear app cache if experiencing slow performance',
      '• Check internet connection for sync issues',
      '• Restart the app if it becomes unresponsive',
      '• Ensure camera permissions are enabled for scanning',
      '• Contact support if issues persist',
    ],
  },
];

export const HelpDocumentationScreen: React.FC<Props> = ({ navigation }) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact support?',
      [
        {
          text: 'Email',
          onPress: () => {
            Linking.openURL('mailto:support@bureau-ordre.gov.ma');
          },
        },
        {
          text: 'Phone',
          onPress: () => {
            Linking.openURL('tel:+212-522-000-000');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleFAQ = () => {
    Alert.alert('FAQ', 'Frequently Asked Questions section coming soon!');
  };

  const handleVideoTutorials = () => {
    Alert.alert('Video Tutorials', 'Video tutorials will be available soon!');
  };

  const filteredTopics = helpTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Documentation</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleFAQ}>
              <Ionicons name="help-circle-outline" size={24} color="#6B46C1" />
              <Text style={styles.quickActionTitle}>FAQ</Text>
              <Text style={styles.quickActionSubtitle}>Frequently Asked Questions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard} onPress={handleVideoTutorials}>
              <Ionicons name="play-circle-outline" size={24} color="#6B46C1" />
              <Text style={styles.quickActionTitle}>Video Tutorials</Text>
              <Text style={styles.quickActionSubtitle}>Watch and learn</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard} onPress={handleContactSupport}>
              <Ionicons name="headset-outline" size={24} color="#6B46C1" />
              <Text style={styles.quickActionTitle}>Contact Support</Text>
              <Text style={styles.quickActionSubtitle}>Get help from our team</Text>
            </TouchableOpacity>
          </View>

          {/* Help Topics */}
          <View style={styles.topicsSection}>
            <Text style={styles.sectionTitle}>Help Topics</Text>
            
            {filteredTopics.map((topic) => (
              <View key={topic.id} style={styles.topicCard}>
                <TouchableOpacity
                  style={styles.topicHeader}
                  onPress={() => toggleTopic(topic.id)}
                >
                  <View style={styles.topicLeft}>
                    <Ionicons name={topic.icon as any} size={24} color="#6B46C1" />
                    <View style={styles.topicInfo}>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                      <Text style={styles.topicDescription}>{topic.description}</Text>
                    </View>
                  </View>
                  <Ionicons
                    name={expandedTopic === topic.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>

                {expandedTopic === topic.id && topic.content && (
                  <View style={styles.topicContent}>
                    {topic.content.map((item, index) => (
                      <Text key={index} style={styles.contentItem}>{item}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* App Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>App Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>Intelligent Bureau d'Ordre v2.1.0</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Build</Text>
                <Text style={styles.infoValue}>Agent Portal - Build 2026.03</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Last Updated</Text>
                <Text style={styles.infoValue}>March 15, 2026</Text>
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  topicsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topicInfo: {
    marginLeft: 12,
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  topicContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  contentItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});
