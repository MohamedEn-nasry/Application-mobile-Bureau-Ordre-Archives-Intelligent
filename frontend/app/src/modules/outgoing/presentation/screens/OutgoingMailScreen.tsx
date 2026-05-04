import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';

// IPA: /aʊt.goʊ.ɪŋ meɪl/ - Outgoing Mail (pronounced "out-goh-ing mail")
// IPA: /skri:n/ - Screen (pronounced "screen")

interface OutgoingMailItem {
  id: string;
  reference: string;
  subject: string;
  recipient: string;
  date: string;
  status: 'Draft' | 'Sent' | 'Delivered' | 'Archived';
  hasAttachments: boolean;
  attachmentCount?: number;
}

type FilterType = 'All' | 'Date' | 'Recipient' | 'Subject' | 'Status';

export const OutgoingMailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for outgoing mails
  const outgoingMails: OutgoingMailItem[] = [
    {
      id: '1',
      reference: 'OUT-2026-001',
      subject: 'Réponse à la demande de données statistiques',
      recipient: 'Direction Provinciale de Rabat',
      date: '2026-03-19',
      status: 'Archived',
      hasAttachments: true,
      attachmentCount: 1,
    },
    {
      id: '2',
      reference: 'OUT-2026-002',
      subject: 'Rapport trimestriel Q1 2026',
      recipient: 'Ministère de l\'Éducation',
      date: '2026-03-18',
      status: 'Sent',
      hasAttachments: true,
      attachmentCount: 2,
    },
    {
      id: '3',
      reference: 'OUT-2026-003',
      subject: 'Demande de clarification',
      recipient: 'Service des Archives',
      date: '2026-03-17',
      status: 'Draft',
      hasAttachments: false,
    },
    {
      id: '4',
      reference: 'OUT-2026-004',
      subject: 'Confirmation de réception',
      recipient: 'Direction Régionale',
      date: '2026-03-16',
      status: 'Delivered',
      hasAttachments: false,
    },
  ];

  const filters: FilterType[] = ['All', 'Date', 'Recipient', 'Subject', 'Status'];

  const getStatusColor = (status: OutgoingMailItem['status']) => {
    switch (status) {
      case 'Draft': return '#94A3B8';
      case 'Sent': return '#F59E0B';
      case 'Delivered': return '#10B981';
      case 'Archived': return '#6B7280';
      default: return '#94A3B8';
    }
  };

  const handleMailPress = (mail: OutgoingMailItem) => {
    navigation.navigate('OutgoingMailDetail', { mailId: mail.id });
  };

  const handleAddMail = () => {
    navigation.navigate('AddOutgoingMail');
  };

  const filteredMails = outgoingMails.filter(mail => {
    const matchesSearch = searchQuery === '' || 
      mail.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (selectedFilter) {
      case 'All': return true;
      case 'Status': return true; // Would implement status filtering
      case 'Date': return true; // Would implement date filtering
      case 'Recipient': return true; // Would implement recipient filtering
      case 'Subject': return true; // Would implement subject filtering
      default: return true;
    }
  });

  const renderMailItem = ({ item }: { item: OutgoingMailItem }) => (
    <TouchableOpacity 
      style={styles.mailItem}
      onPress={() => handleMailPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.mailHeader}>
        <Text style={styles.referenceText}>{item.reference}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.subjectText} numberOfLines={2}>{item.subject}</Text>
      <Text style={styles.recipientText}>{item.recipient}</Text>
      
      <View style={styles.mailFooter}>
        <View style={styles.attachmentContainer}>
          {item.hasAttachments && (
            <>
              <Feather name="paperclip" size={14} color="#64748B" />
              <Text style={styles.attachmentText}>
                {item.attachmentCount || 1} file
              </Text>
            </>
          )}
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Outgoing Mail</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by reference, recipient..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
        
        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter && styles.filterTabTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Mail List */}
      <View style={styles.content}>
        <Text style={styles.mailCount}>{filteredMails.length} mail items</Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredMails}
            renderItem={renderMailItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mailList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="mail-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>No outgoing mail found</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddMail}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <AgentBottomNav active="outgoing" navigation={navigation} />
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 16,
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
  filterContainer: {
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 0,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterTabTextActive: {
    color: '#4F46E5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mailCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 16,
  },
  mailList: {
    paddingBottom: 100,
  },
  mailItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  mailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  referenceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    lineHeight: 22,
  },
  recipientText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  mailFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
