import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';
import { useIncomingMailViewModel } from '../viewmodels/IncomingMailViewModel';
import { IncomingMailItem } from '../components/IncomingMailItem';
import { IncomingMail } from '../../domain/entities/IncomingMail';

// IPA: /In.kʌm.Iŋ meI.l skri:n/ - Incoming Mail Screen (pronounced "in-kuh-ming mail screen")
// IPA: /fIl.tər/ - Filter (pronounced "fil-ter")
// IPA: /sɑ:rtʃ/ - Search (pronounced "sarch")

export const IncomingMailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const { mails, isLoading, error, filters, updateFilters, refresh } = useIncomingMailViewModel();

  const filterOptions = ['All', 'Date', 'Sender', 'Subject', 'Status'];

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
    
    // Reset all filters first
    updateFilters({ 
      status: undefined, 
      sender: undefined, 
      subject: undefined,
      search: searchQuery || undefined 
    });
    
    // Apply specific filter based on selection
    if (filter === 'Status') {
      Alert.alert(
        'Select Status',
        'Choose a status to filter by',
        [
          { text: 'All', onPress: () => updateFilters({ status: 'All' }) },
          { text: 'Pending', onPress: () => updateFilters({ status: 'pending' }) },
          { text: 'In Progress', onPress: () => updateFilters({ status: 'in_progress' }) },
          { text: 'Completed', onPress: () => updateFilters({ status: 'completed' }) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else if (filter === 'All') {
      updateFilters({ search: searchQuery || undefined });
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    updateFilters({ search: text || undefined });
  };

  const handleMailPress = (mail: IncomingMail) => {
    navigation.navigate('IncomingMailDetail', { mailId: mail.id });
  };

  const handleAddMail = () => {
    navigation.navigate('AddIncomingMail');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading incoming mails...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
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
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Incoming Mail</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
            <Ionicons name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search incoming mail..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
        
        {/* Filter Options */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive
              ]}
              onPress={() => handleFilterPress(filter)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Mail List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mails.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="mail-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No incoming mail found</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery || selectedFilter !== 'All' 
                ? 'Try adjusting your search or filters' 
                : 'Start by adding your first incoming mail'}
            </Text>
          </View>
        ) : (
          mails.map((mail) => (
            <IncomingMailItem
              key={mail.id}
              mail={mail}
              onPress={() => handleMailPress(mail)}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddMail}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <AgentBottomNav active="incoming" navigation={navigation} />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  refreshButton: {
    padding: 4,
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
    paddingRight: 20,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#FFFFFF',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  filterChipTextActive: {
    color: '#4F46E5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#4F46E5',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
