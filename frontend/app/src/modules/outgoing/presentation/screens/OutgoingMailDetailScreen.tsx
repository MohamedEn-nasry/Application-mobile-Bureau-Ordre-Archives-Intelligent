import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// IPA: /aʊt.goʊ.ɪŋ meɪl de.teɪl/ - Outgoing Mail Detail (pronounced "out-goh-ing mail de-tail")
// IPA: /skri:n/  - Screen (pronounced "screen")

interface MailDetail {
  id: string;
  reference: string;
  dateSent: string;
  recipient: string;
  subject: string;
  description: string;
  status: 'Draft' | 'Sent' | 'Delivered' | 'Archived';
  attachments: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    uri?: string;
  }>;
  deliveryTracking: Array<{
    status: string;
    date: string;
    completed: boolean;
  }>;
}

export const OutgoingMailDetailScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const [selectedStatus, setSelectedStatus] = useState('Archived');
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Mock data - in real app, this would come from route params or API
  const mailDetail: MailDetail = {
    id: route.params?.mailId || '1',
    reference: 'OUT-2026-001',
    dateSent: '2026-03-19',
    recipient: 'Direction Provinciale de Rabat',
    subject: 'Réponse à la demande de données statistiques',
    description: 'En réponse à votre demande du 10 mars, veuillez trouver ci-joint les données statistiques demandées.',
    status: 'Archived',
    attachments: [
      {
        id: '1',
        name: 'statistiques_q1_2026.xlsx',
        size: '1.8 MB',
        type: 'PDF',
      },
    ],
    deliveryTracking: [
      {
        status: 'Created',
        date: '2026-03-19',
        completed: true,
      },
      {
        status: 'Sent',
        date: '2026-03-19',
        completed: true,
      },
      {
        status: 'Delivered',
        date: '',
        completed: false,
      },
    ],
  };

  const statusOptions = ['Draft', 'Sent', 'Delivered', 'Archived'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return '#94A3B8';
      case 'Sent': return '#F59E0B';
      case 'Delivered': return '#10B981';
      case 'Archived': return '#6B7280';
      default: return '#94A3B8';
    }
  };

  const handleViewAttachment = (attachment: typeof mailDetail.attachments[0]) => {
    Alert.alert('View Attachment', `Opening ${attachment.name}`);
  };

  const handleEdit = () => {
    navigation.navigate('AddOutgoingMail', { mailId: mailDetail.id });
  };

  const handleArchive = () => {
    Alert.alert(
      'Archive Mail',
      'Are you sure you want to archive this mail?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Archive', onPress: () => Alert.alert('Success', 'Mail archived successfully') }
      ]
    );
  };

  const handleUpdateStatus = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Status updated successfully');
      setShowStatusDropdown(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mail Detail</Text>
          <Text style={styles.headerSubtitle}>{mailDetail.reference}</Text>
        </View>
        <TouchableOpacity 
          style={styles.statusButton}
          onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          activeOpacity={0.7}
        >
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(mailDetail.status) }]} />
          <Text style={styles.statusButtonText}>{mailDetail.status}</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Mail Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mail Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Reference</Text>
              <Text style={styles.infoValue}>{mailDetail.reference}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date Sent</Text>
              <Text style={styles.infoValue}>{mailDetail.dateSent}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Recipient</Text>
              <Text style={styles.infoValue}>{mailDetail.recipient}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Subject</Text>
              <Text style={styles.infoValue}>{mailDetail.subject}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{mailDetail.description}</Text>
          </View>
        </View>

        {/* Attachments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments ({mailDetail.attachments.length})</Text>
          {mailDetail.attachments.map((attachment) => (
            <TouchableOpacity 
              key={attachment.id}
              style={styles.attachmentItem}
              onPress={() => handleViewAttachment(attachment)}
              activeOpacity={0.7}
            >
              <View style={styles.attachmentIcon}>
                <Feather name="file" size={24} color="#64748B" />
              </View>
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName}>{attachment.name}</Text>
                <Text style={styles.attachmentSize}>{attachment.size} - {attachment.type}</Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Update Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Status</Text>
          <TouchableOpacity 
            style={styles.statusDropdown}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
            activeOpacity={0.7}
          >
            <View style={styles.selectedStatus}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(selectedStatus) }]} />
              <Text style={styles.selectedStatusText}>{selectedStatus}</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#64748B" />
          </TouchableOpacity>
          
          {showStatusDropdown && (
            <View style={styles.statusOptions}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.statusOption}
                  onPress={() => {
                    setSelectedStatus(status);
                    setShowStatusDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
                  <Text style={styles.statusOptionText}>{status}</Text>
                  {status === 'Delivered' && (
                    <Ionicons name="checkmark" size={16} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Delivery Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Tracking</Text>
          <View style={styles.trackingContainer}>
            {mailDetail.deliveryTracking.map((tracking, index) => (
              <View key={index} style={styles.trackingItem}>
                <View style={styles.trackingLeft}>
                  <View style={[
                    styles.trackingDot,
                    tracking.completed && styles.trackingDotCompleted
                  ]}>
                    {tracking.completed && (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  {index < mailDetail.deliveryTracking.length - 1 && (
                    <View style={styles.trackingLine} />
                  )}
                </View>
                <View style={styles.trackingRight}>
                  <Text style={[
                    styles.trackingStatus,
                    tracking.completed && styles.trackingStatusCompleted
                  ]}>
                    {tracking.status}
                  </Text>
                  <Text style={styles.trackingDate}>{tracking.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={18} color="#64748B" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleArchive}
            activeOpacity={0.7}
          >
            <Feather name="archive" size={18} color="#64748B" />
            <Text style={styles.actionButtonText}>Archive</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryActionButton]}
            onPress={handleUpdateStatus}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="refresh" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionButtonText}>Update Status</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  descriptionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  attachmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  attachmentSize: {
    fontSize: 14,
    color: '#64748B',
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  statusOptions: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
    flex: 1,
  },
  trackingContainer: {
    paddingLeft: 12,
  },
  trackingItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  trackingLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  trackingDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingDotCompleted: {
    backgroundColor: '#10B981',
  },
  trackingLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginTop: 8,
  },
  trackingRight: {
    flex: 1,
    paddingTop: 2,
  },
  trackingStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  trackingStatusCompleted: {
    color: '#1E293B',
  },
  trackingDate: {
    fontSize: 14,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  primaryActionButton: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
  },
  primaryActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
