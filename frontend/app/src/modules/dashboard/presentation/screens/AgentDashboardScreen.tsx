import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';
import { useAgentDashboardViewModel } from '../viewmodels/AgentDashboardViewModel';
import { MailStatsCard } from '../components/MailStatsCard';
import { QuickActionCard } from '../components/QuickActionCard';
import { AssignedMailItem } from '../components/AssignedMailItem';
import { RecentActivityItem } from '../components/RecentActivityItem';
import { OCRResultCard } from '../components/OCRResultCard';

// IPA: /dæb.bord/ - Dashboard (pronounced "dab-bord")
// IPA: /eId.dZEnt/ - Agent (pronounced "ay-jent")
// IPA: /meI.l/ - Mail (pronounced "mail")
// IPA: /æk.tIv.I.ti/ - Activity (pronounced "ak-tiv-i-tee")
// IPA: /oU.si.ar/ - OCR (pronounced "oh-see-ar")
// IPA: /vju: mOd.el/ - View Model (pronounced "vyoo mod-el")

export const AgentDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error, refresh } = useAgentDashboardViewModel();

  // IPA: /hæn.dl/ - Handle (pronounced "han-dl")
  const handleNotificationPress = () => {
    const notificationCount = data?.summaryStats.pendingMail || 0;
    Alert.alert('Notifications', `You have ${notificationCount} new notifications`);
  };

  const handleQuickAction = (action: string) => {
    Alert.alert('Quick Action', `${action} action selected`);
  };

  const handleMailItemPress = (mailId: string) => {
    Alert.alert('Mail Details', `Opening mail ${mailId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      
      {/* Purple Header Section */}
      <View style={styles.purpleHeader}>
        <View style={styles.headerTop}>
          {/* Profile Picture */}
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/60/FFFFFF/4F46E5?text=AB' }} 
              style={styles.profileImage}
            />
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Good Morning,</Text>
              <Text style={styles.userNameText}>Ahmed Benali</Text>
            </View>
          </View>
          
          {/* Notification Bell */}
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search mail..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mail Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mail Statistics</Text>
          <View style={styles.statsGrid}>
            <MailStatsCard
              title="Incoming Mail"
              count={data?.summaryStats.incomingMail || 0}
              subtitle={`${data?.summaryStats.pendingMail || 0} pending`}
              icon="inbox"
              color="#4F46E5"
              onPress={() => handleQuickAction('View Incoming Mail')}
            />
            <MailStatsCard
              title="Outgoing Mail"
              count={data?.summaryStats.outgoingMail || 0}
              subtitle="Ready to send"
              icon="send"
              color="#10B981"
              onPress={() => handleQuickAction('View Outgoing Mail')}
            />
            <MailStatsCard
              title="Pending Tasks"
              count={data?.summaryStats.pendingMail || 0}
              subtitle="Requires action"
              icon="file-text"
              color="#F59E0B"
              onPress={() => handleQuickAction('View Pending Tasks')}
            />
            <MailStatsCard
              title="Archived Mail"
              count={data?.summaryStats.archivedMail || 0}
              subtitle="Completed"
              icon="archive"
              color="#8B5CF6"
              onPress={() => handleQuickAction('View Archived Mail')}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {data?.quickActions.map((action, index) => (
              <QuickActionCard
                key={action.id}
                title={action.label}
                icon={action.icon as any}
                color={action.colorScheme === 'blue' ? '#4F46E5' : 
                      action.colorScheme === 'indigo' ? '#10B981' : 
                      action.colorScheme === 'amber' ? '#F59E0B' : '#8B5CF6'}
                onPress={() => handleQuickAction(action.label)}
              />
            ))}
          </View>
        </View>

        {/* Assigned Mail */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Assigned Mail</Text>
            <TouchableOpacity onPress={() => handleQuickAction('View All Mail')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mailList}>
            {data?.assignedMail.map((mail, index) => (
              <AssignedMailItem
                key={mail.id}
                reference={mail.reference}
                title={mail.title}
                sender={mail.sender}
                status={mail.status}
                date={mail.date}
                onPress={() => handleMailItemPress(mail.reference)}
              />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {data?.recentActivity.map((activity, index) => (
              <RecentActivityItem
                key={activity.id}
                activity={activity.action}
                timestamp={activity.time}
                icon={activity.icon as any}
                iconColor={activity.icon === 'mail' ? '#4F46E5' : 
                        activity.icon === 'archive' ? '#10B981' : 
                        activity.icon === 'user-plus' ? '#F59E0B' : '#8B5CF6'}
              />
            ))}
          </View>
        </View>

        {/* OCR Results */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>OCR Results</Text>
            <TouchableOpacity onPress={() => handleQuickAction('View All OCR')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.ocrList}>
            {data?.ocrResults.map((result, index) => (
              <OCRResultCard
                key={result.id}
                reference={result.reference}
                title={result.title}
                completionDate={result.completionDate}
                content={result.content}
                confidence={result.confidence}
                onPress={() => handleMailItemPress(result.reference)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <AgentBottomNav active="dashboard" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  purpleHeader: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  greetingContainer: {
    marginLeft: 16,
  },
  greetingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  userNameText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
    scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  mailList: {
    gap: 12,
  },
  activityList: {
    gap: 4,
  },
  ocrList: {
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
